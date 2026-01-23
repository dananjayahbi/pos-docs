# Tasks 65-68: Receipt Verification, Sharing & Preferences

> **Phase:** 05 - ERP Core Modules Part 2  
> **SubPhase:** 03 - Receipt Generation  
> **Group:** D - PDF & Email Receipts  
> **Document:** 03 of 03  
> **Tasks Covered:** 65, 66, 67, 68

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [02_Tasks-60-64_Email-Receipts.md](02_Tasks-60-64_Email-Receipts.md)
- **→ Next Group:** [../Group-E_Receipt-API-Storage/](../Group-E_Receipt-API-Storage/)

---

## Document Overview

This document covers the implementation of advanced receipt features including authenticity verification, digital receipt sharing capabilities, SMS receipt delivery, and customer receipt format preferences.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 65 | Add receipt verification | Medium | 25 min |
| 66 | Create digital receipt sharing | Medium | 20 min |
| 67 | Add SMS receipt option | Medium | 25 min |
| 68 | Create receipt preferences | Medium | 20 min |

---

## Task 65: Add Receipt Verification

### Overview
Implement a comprehensive receipt verification system that allows customers, authorities, and businesses to verify the authenticity of receipts using cryptographic hashing and verification tokens. This prevents fraud and ensures receipt legitimacy.

### Dependencies
- Task 64: Receipt lookup page exists
- Receipt model: Core receipt data structure
- Cryptography: HMAC and hashing capabilities

### Instructions

1. **Create verification service class**
   - Create file: `apps/pos/receipts/services/verification.py`
   - Define `ReceiptVerificationService` class
   - Implement hash generation methods
   - Implement verification methods

2. **Design verification hash algorithm**
   - Use HMAC-SHA256 for security
   - Include receipt ID, number, amount, tenant ID
   - Use secret key from settings
   - Generate fixed-length hash (16-32 characters)
   - Hash should be deterministic (same input = same hash)

3. **Add verification fields to receipt model**
   - Add field: `verification_hash` (CharField, 64 chars)
   - Add field: `verification_token` (CharField, 16 chars for URLs)
   - Add field: `is_verified` (BooleanField, default True)
   - Add field: `verification_count` (IntegerField, track lookups)

4. **Implement hash generation on receipt creation**
   - Generate verification hash when receipt is created
   - Store hash in receipt model
   - Make hash immutable (cannot be changed after creation)
   - Log hash generation

5. **Create verification endpoint**
   - API endpoint: `/api/receipts/verify/`
   - Accept receipt number and hash/token
   - Return verification result (valid/invalid)
   - Include verification details (timestamp, receipt info)

6. **Implement verification logic**
   - Retrieve receipt by number or ID
   - Regenerate hash from receipt data
   - Compare provided hash with generated hash
   - Use constant-time comparison to prevent timing attacks
   - Return boolean result with details

7. **Design verification UI component**
   - Add verification badge on receipt lookup page
   - Display checkmark icon for verified receipts
   - Show verification timestamp
   - Display "Verified by LankaCommerce Cloud" message

8. **Create standalone verification page**
   - Page for customers to verify without viewing full receipt
   - Input: Receipt number and verification code
   - Output: Verified/Not verified status
   - Display basic receipt info if verified

9. **Add QR code verification**
   - Embed verification data in QR code
   - QR code contains: receipt URL + verification token
   - Scanning QR verifies automatically
   - Display verification status on lookup page

10. **Implement verification tracking**
    - Track number of verification attempts
    - Log each verification (timestamp, IP, result)
    - Alert on multiple failed verification attempts
    - Store verification history

11. **Create verification API for third parties**
    - Public API for authorities to verify receipts
    - Require API key for access
    - Rate limit verification requests
    - Return JSON response with verification details

12. **Add verification expiration handling**
    - Option to expire verification after X days (configurable)
    - Default: Never expire
    - Useful for limited-time offers or returns
    - Display expiration status on verification

13. **Implement tamper detection**
    - Detect if receipt data has been modified
    - Compare current data hash with stored hash
    - Flag receipts that don't match
    - Alert administrators on tampering

14. **Create verification certificate**
    - Generate printable/downloadable verification certificate
    - Include receipt details, verification hash, timestamp
    - Useful for audits or legal purposes
    - PDF format with official appearance

### Verification Hash Generation Algorithm

```python
import hmac
import hashlib
from django.conf import settings

def generate_verification_hash(receipt):
    """
    Generate cryptographic verification hash for receipt.
    
    Uses HMAC-SHA256 with secret key for security.
    Hash includes critical receipt data to ensure integrity.
    
    Args:
        receipt: Receipt model instance
    
    Returns:
        Hex string of hash (64 characters)
    """
    # Concatenate critical receipt data
    message = (
        f"{receipt.id}:"
        f"{receipt.receipt_number}:"
        f"{receipt.tenant_id}:"
        f"{receipt.total_amount}:"
        f"{receipt.created_at.isoformat()}"
    )
    
    # Generate HMAC-SHA256 hash
    hash_obj = hmac.new(
        key=settings.RECEIPT_VERIFICATION_SECRET.encode('utf-8'),
        msg=message.encode('utf-8'),
        digestmod=hashlib.sha256
    )
    
    # Return full hash (64 characters)
    return hash_obj.hexdigest()

def generate_verification_token(receipt):
    """
    Generate short verification token for URLs.
    
    Args:
        receipt: Receipt model instance
    
    Returns:
        Short hex string (16 characters)
    """
    full_hash = generate_verification_hash(receipt)
    # Use first 16 characters for URL token
    return full_hash[:16]
```

### Verification Service Class

```python
class ReceiptVerificationService:
    """
    Service for verifying receipt authenticity.
    """
    
    def __init__(self):
        """Initialize verification service."""
        self.secret_key = settings.RECEIPT_VERIFICATION_SECRET
    
    def verify_receipt(self, receipt_number, verification_hash):
        """
        Verify receipt authenticity using hash.
        
        Args:
            receipt_number: Receipt number string
            verification_hash: Hash or token to verify
        
        Returns:
            Dictionary with verification result and details
        """
        try:
            receipt = Receipt.objects.get(receipt_number=receipt_number)
            
            # Generate expected hash
            expected_hash = generate_verification_hash(receipt)
            expected_token = expected_hash[:16]
            
            # Check if provided hash matches (full or token)
            is_valid = hmac.compare_digest(verification_hash, expected_hash) or \
                       hmac.compare_digest(verification_hash, expected_token)
            
            # Update verification tracking
            receipt.verification_count += 1
            receipt.save(update_fields=['verification_count'])
            
            # Log verification attempt
            self._log_verification(receipt, is_valid)
            
            return {
                'valid': is_valid,
                'receipt_number': receipt.receipt_number,
                'amount': receipt.total_amount,
                'date': receipt.created_at,
                'business': receipt.tenant.business_name,
                'verified_at': timezone.now(),
            }
        
        except Receipt.DoesNotExist:
            return {
                'valid': False,
                'error': 'Receipt not found'
            }
    
    def _log_verification(self, receipt, is_valid):
        """Log verification attempt."""
        VerificationLog.objects.create(
            receipt=receipt,
            is_valid=is_valid,
            verified_at=timezone.now(),
        )
```

### Verification Flow Diagram

```
[Customer/Authority Wants to Verify Receipt]
         │
         ▼
[Obtain Receipt Number + Verification Code]
  (From printed receipt, email, or QR code)
         │
         ▼
[Enter on Verification Page OR Scan QR Code]
         │
         ▼
[System Retrieves Receipt from Database]
         │
         ▼
[Generate Expected Hash from Receipt Data]
         │
         ▼
[Compare Provided Hash with Expected Hash]
  (Use constant-time comparison)
         │
    ┌────┴────┐
    │ Match?  │
    └────┬────┘
         │
    ┌────┴────┐
    │   Yes   │   No
    │         │   │
    ▼         ▼   ▼
[✓ VERIFIED] [✗ INVALID]
         │         │
         ▼         ▼
[Display Receipt Info] [Display Error]
         │
         ▼
[Log Verification Attempt]
```

### Verification Badge UI Component

```tsx
// components/receipts/VerificationBadge.tsx

interface VerificationBadgeProps {
  receipt: Receipt;
  showDetails?: boolean;
}

export function VerificationBadge({ receipt, showDetails = true }: VerificationBadgeProps) {
  return (
    <div className="verification-badge">
      <div className="badge-icon">
        <CheckCircleIcon className="text-green-600" />
      </div>
      <div className="badge-content">
        <h3 className="font-bold text-green-700">✓ Verified Receipt</h3>
        {showDetails && (
          <>
            <p className="text-sm text-gray-600">
              This receipt has been verified as authentic by LankaCommerce Cloud.
            </p>
            <p className="text-xs text-gray-500">
              Verification Code: {receipt.verification_token}
            </p>
            <p className="text-xs text-gray-500">
              Verified: {receipt.verification_count} time(s)
            </p>
          </>
        )}
      </div>
    </div>
  );
}
```

### Standalone Verification Page

```tsx
// app/verify/page.tsx

export default function VerifyReceiptPage() {
  const [receiptNumber, setReceiptNumber] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  
  const handleVerify = async () => {
    setLoading(true);
    
    const response = await fetch('/api/receipts/verify/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ receiptNumber, verificationCode }),
    });
    
    const data = await response.json();
    setResult(data);
    setLoading(false);
  };
  
  return (
    <div className="verify-receipt-page">
      <h1>Verify Receipt Authenticity</h1>
      
      <div className="verification-form">
        <input
          type="text"
          placeholder="Receipt Number (e.g., RC-2026-001234)"
          value={receiptNumber}
          onChange={(e) => setReceiptNumber(e.target.value)}
        />
        
        <input
          type="text"
          placeholder="Verification Code"
          value={verificationCode}
          onChange={(e) => setVerificationCode(e.target.value)}
        />
        
        <button onClick={handleVerify} disabled={loading}>
          {loading ? 'Verifying...' : 'Verify Receipt'}
        </button>
      </div>
      
      {result && (
        <div className={`verification-result ${result.valid ? 'valid' : 'invalid'}`}>
          {result.valid ? (
            <VerifiedReceiptInfo receipt={result} />
          ) : (
            <InvalidReceiptMessage error={result.error} />
          )}
        </div>
      )}
    </div>
  );
}
```

### Verification API Endpoint

```python
# apps/pos/receipts/views/verification.py

@api_view(['POST'])
def verify_receipt(request):
    """
    API endpoint to verify receipt authenticity.
    
    POST /api/receipts/verify/
    Body: {
        "receiptNumber": "RC-2026-001234",
        "verificationCode": "a1b2c3d4e5f67890"
    }
    """
    receipt_number = request.data.get('receiptNumber')
    verification_code = request.data.get('verificationCode')
    
    if not receipt_number or not verification_code:
        return Response(
            {'error': 'Receipt number and verification code required'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    # Use verification service
    service = ReceiptVerificationService()
    result = service.verify_receipt(receipt_number, verification_code)
    
    return Response(result)
```

### Expected Outcome
```
apps/pos/receipts/
├── models/
│   ├── receipt.py                     # With verification fields
│   └── verification_log.py            # Verification history
├── services/
│   └── verification.py                # Verification service
└── views/
    └── verification.py                # Verification API

frontend/
├── app/
│   └── verify/
│       └── page.tsx                   # Standalone verification page
└── components/
    └── receipts/
        └── VerificationBadge.tsx      # Verification UI component
```

### Verification Checklist
- [ ] Verification service class is created
- [ ] Verification hash algorithm is implemented
- [ ] Verification fields are added to receipt model
- [ ] Hash generation occurs on receipt creation
- [ ] Verification endpoint is created
- [ ] Verification logic uses constant-time comparison
- [ ] Verification UI component displays on lookup page
- [ ] Standalone verification page is created
- [ ] QR code includes verification data
- [ ] Verification tracking logs attempts
- [ ] Third-party verification API exists
- [ ] Expiration handling is implemented (optional)
- [ ] Tamper detection flags modified receipts
- [ ] Verification certificate can be generated

---

## Task 66: Create Digital Receipt Sharing

### Overview
Implement social and direct sharing capabilities for digital receipts, allowing customers to easily share receipts via email, social media, messaging apps, or generate shareable links.

### Dependencies
- Task 64: Receipt lookup page exists
- Task 65: Verification system ensures shared receipts are authentic

### Instructions

1. **Create share modal component**
   - Modal/dialog for sharing options
   - Triggered by "Share" button on receipt page
   - Display multiple sharing methods
   - Close button and overlay

2. **Implement copy link functionality**
   - Button to copy receipt URL to clipboard
   - Include verification token in URL
   - Show success notification when copied
   - URL format: `https://tenant.lcc.app/receipt/id?token=xyz`

3. **Add email sharing**
   - Form to enter recipient email address
   - Subject: "Receipt from [Business Name]"
   - Message body with receipt link
   - Send via backend email service
   - Confirmation message on success

4. **Implement social media sharing**
   - Facebook share button
   - Twitter share button
   - LinkedIn share button (for business receipts)
   - WhatsApp share button (mobile-friendly)
   - Use native share APIs where available

5. **Create short URL service**
   - Generate short URLs for easier sharing
   - Format: `https://lcc.sh/r/abc123`
   - Redirect to full receipt URL
   - Track short URL usage
   - Optional: Custom short URLs for tenants

6. **Add QR code sharing**
   - Display QR code for receipt
   - Download QR code as image
   - Share QR code image via messaging apps
   - QR code includes verification token

7. **Implement native Web Share API**
   - Use browser's native share dialog (mobile)
   - Fallback to custom share modal (desktop)
   - Share receipt title, URL, and summary
   - Better UX on mobile devices

8. **Create shareable text format**
   - Generate plain text summary of receipt
   - Include: Business name, amount, date, link
   - Example: "Receipt from My Store - Rs. 1,088.64 on Jan 23, 2026. View: [link]"
   - Suitable for SMS, messaging apps

9. **Add sharing tracking**
   - Track sharing method used
   - Count shares per receipt
   - Log sharing events
   - Analytics on most popular share methods

10. **Implement access control**
    - Ensure shared receipts require verification token
    - Prevent unauthorized access
    - Allow tenant to disable sharing (privacy setting)
    - Track who accessed shared receipts

11. **Create share analytics dashboard**
    - Show sharing statistics for tenants
    - Most shared receipts
    - Popular sharing methods
    - Time-based sharing trends

12. **Add share expiration option**
    - Optional: Shared links expire after X days
    - Configurable per tenant
    - Useful for sensitive receipts
    - Display expiration warning

### Share Modal Component

```tsx
// components/receipts/ShareModal.tsx

interface ShareModalProps {
  receipt: Receipt;
  isOpen: boolean;
  onClose: () => void;
}

export function ShareModal({ receipt, isOpen, onClose }: ShareModalProps) {
  const receiptUrl = getReceiptUrl(receipt);
  
  const handleCopyLink = async () => {
    await navigator.clipboard.writeText(receiptUrl);
    toast.success('Link copied to clipboard!');
  };
  
  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Receipt ${receipt.receipt_number}`,
          text: `View my receipt from ${receipt.tenant.business_name}`,
          url: receiptUrl,
        });
      } catch (error) {
        console.error('Share failed:', error);
      }
    }
  };
  
  const handleEmailShare = async (email: string) => {
    await fetch('/api/receipts/share/email/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ receiptId: receipt.id, recipientEmail: email }),
    });
    
    toast.success('Receipt shared via email!');
  };
  
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <h2>Share Receipt</h2>
      
      <div className="share-options">
        {/* Copy Link */}
        <button onClick={handleCopyLink} className="share-option">
          <LinkIcon />
          Copy Link
        </button>
        
        {/* Native Share (mobile) */}
        {navigator.share && (
          <button onClick={handleNativeShare} className="share-option">
            <ShareIcon />
            Share...
          </button>
        )}
        
        {/* Email */}
        <EmailShareForm onSubmit={handleEmailShare} />
        
        {/* Social Media */}
        <div className="social-share">
          <FacebookShareButton url={receiptUrl} />
          <TwitterShareButton url={receiptUrl} />
          <WhatsAppShareButton url={receiptUrl} />
        </div>
        
        {/* QR Code */}
        <QRCodeDisplay receipt={receipt} />
      </div>
    </Modal>
  );
}
```

### Short URL Service

```python
# apps/pos/receipts/services/short_url.py

import random
import string

class ShortURLService:
    """
    Service for generating and managing short URLs for receipts.
    """
    
    def generate_short_code(self, length=6):
        """
        Generate random short code.
        
        Args:
            length: Length of code (default 6)
        
        Returns:
            Random alphanumeric string
        """
        chars = string.ascii_letters + string.digits
        return ''.join(random.choice(chars) for _ in range(length))
    
    def create_short_url(self, receipt):
        """
        Create short URL for receipt.
        
        Args:
            receipt: Receipt instance
        
        Returns:
            ShortURL instance
        """
        # Generate unique code
        code = self.generate_short_code()
        while ShortURL.objects.filter(code=code).exists():
            code = self.generate_short_code()
        
        # Create short URL record
        short_url = ShortURL.objects.create(
            code=code,
            receipt=receipt,
            created_by=receipt.tenant,
        )
        
        return short_url
    
    def get_full_url(self, short_url):
        """
        Get full receipt URL from short URL.
        
        Args:
            short_url: ShortURL instance
        
        Returns:
            Full receipt URL with verification token
        """
        receipt = short_url.receipt
        token = receipt.verification_token
        
        return f"https://{receipt.tenant.subdomain}.lcc.app/receipt/{receipt.id}?token={token}"
    
    def track_access(self, short_url, request):
        """
        Track short URL access.
        
        Args:
            short_url: ShortURL instance
            request: HTTP request object
        """
        ShortURLAccess.objects.create(
            short_url=short_url,
            ip_address=request.META.get('REMOTE_ADDR'),
            user_agent=request.META.get('HTTP_USER_AGENT'),
            accessed_at=timezone.now(),
        )
        
        # Increment access count
        short_url.access_count += 1
        short_url.save(update_fields=['access_count'])
```

### Short URL Model

```python
class ShortURL(models.Model):
    """
    Short URL for receipt sharing.
    """
    code = models.CharField(max_length=10, unique=True, db_index=True)
    receipt = models.ForeignKey('Receipt', on_delete=models.CASCADE, related_name='short_urls')
    created_by = models.ForeignKey('Tenant', on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    access_count = models.IntegerField(default=0)
    expires_at = models.DateTimeField(null=True, blank=True)
    
    def __str__(self):
        return f"lcc.sh/r/{self.code}"
    
    def is_expired(self):
        """Check if short URL has expired."""
        if not self.expires_at:
            return False
        return timezone.now() > self.expires_at
    
    def get_short_url(self):
        """Get formatted short URL."""
        return f"https://lcc.sh/r/{self.code}"
```

### Sharing Flow Diagram

```
[Customer Clicks "Share" Button]
         │
         ▼
[Share Modal Opens]
         │
    ┌────┴────────────────────────────┐
    │                                 │
    ▼                                 ▼
[Copy Link]                    [Social Media]
    │                                 │
    ▼                                 ▼
[Clipboard]                    [Facebook/Twitter/WhatsApp]
    │                                 │
    ▼                                 ▼
[Success Notification]         [Open Share Dialog]
    │                                 │
    └──────────┬──────────────────────┘
               │
               ▼
    [Track Sharing Event]
               │
               ▼
    [Increment Share Count]
```

### Social Media Share Integration

```tsx
// components/receipts/SocialShare.tsx

interface SocialShareProps {
  receiptUrl: string;
  receipt: Receipt;
}

export function SocialShare({ receiptUrl, receipt }: SocialShareProps) {
  const shareText = `Check out my receipt from ${receipt.tenant.business_name}`;
  
  const handleFacebookShare = () => {
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(receiptUrl)}`;
    window.open(facebookUrl, '_blank', 'width=600,height=400');
    trackShare('facebook');
  };
  
  const handleTwitterShare = () => {
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(receiptUrl)}`;
    window.open(twitterUrl, '_blank', 'width=600,height=400');
    trackShare('twitter');
  };
  
  const handleWhatsAppShare = () => {
    const message = `${shareText}\n${receiptUrl}`;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
    trackShare('whatsapp');
  };
  
  return (
    <div className="social-share-buttons">
      <button onClick={handleFacebookShare} className="facebook-share">
        <FacebookIcon /> Share on Facebook
      </button>
      
      <button onClick={handleTwitterShare} className="twitter-share">
        <TwitterIcon /> Share on Twitter
      </button>
      
      <button onClick={handleWhatsAppShare} className="whatsapp-share">
        <WhatsAppIcon /> Share on WhatsApp
      </button>
    </div>
  );
}
```

### Expected Outcome
```
apps/pos/receipts/
├── models/
│   ├── short_url.py                   # Short URL model
│   └── share_tracking.py              # Share event tracking
├── services/
│   └── short_url.py                   # Short URL service
└── views/
    └── share.py                       # Share endpoints

frontend/
└── components/
    └── receipts/
        ├── ShareModal.tsx             # Share modal component
        ├── SocialShare.tsx            # Social media sharing
        └── QRCodeDisplay.tsx          # QR code sharing
```

### Verification Checklist
- [ ] Share modal component is created
- [ ] Copy link functionality works
- [ ] Email sharing is implemented
- [ ] Social media sharing buttons work
- [ ] Short URL service generates unique URLs
- [ ] QR code sharing is available
- [ ] Native Web Share API is integrated
- [ ] Shareable text format is generated
- [ ] Sharing tracking logs events
- [ ] Access control requires verification token
- [ ] Share analytics dashboard exists
- [ ] Share expiration option is available

---

## Task 67: Add SMS Receipt Option

### Overview
Implement SMS-based receipt delivery that sends receipt links to customers' mobile phones via SMS, providing a convenient alternative to email for customers who prefer text messages.

### Dependencies
- Task 64: Receipt lookup page exists
- Task 66: Short URL service for SMS-friendly links
- SMS gateway: Twilio or local SMS provider

### Instructions

1. **Configure SMS gateway**
   - Choose SMS provider (Twilio, Dialog, Mobitel, etc.)
   - Set up account and credentials
   - Configure in Django settings
   - Test SMS sending

2. **Create SMS service class**
   - Create file: `apps/pos/receipts/services/sms_service.py`
   - Define `SMSReceiptService` class
   - Initialize with SMS gateway client
   - Implement send methods

3. **Design SMS message template**
   - Keep message short (160 characters for single SMS)
   - Include: Business name, amount, short URL
   - Example: "Your receipt from My Store: Rs. 1,088.64. View: lcc.sh/r/abc123"
   - Personalize with customer name if available

4. **Implement send SMS method**
   - Accept receipt and phone number
   - Validate phone number format
   - Generate short URL for receipt
   - Compose SMS message
   - Send via SMS gateway
   - Return success/failure status

5. **Add phone number validation**
   - Validate Sri Lankan mobile number format
   - Accept formats: 077xxxxxxx, +94 77 xxx xxxx, etc.
   - Normalize to standard format (+94xxxxxxxxx)
   - Reject invalid numbers

6. **Create SMS sending settings**
   - Tenant setting: Enable/disable SMS receipts
   - SMS template customization
   - Default country code (LK: +94)
   - SMS gateway configuration

7. **Implement SMS opt-in/opt-out**
   - Customers must opt in to receive SMS receipts
   - Store opt-in status in customer model
   - Honor opt-out requests
   - Compliance with telecommunications regulations

8. **Add SMS tracking**
   - Track SMS sent status
   - Store SMS delivery status (sent, delivered, failed)
   - Record delivery timestamp
   - Track SMS costs (if applicable)

9. **Create SMS retry logic**
   - Retry failed SMS sends (up to 3 times)
   - Exponential backoff between retries
   - Give up after max retries
   - Log retry attempts

10. **Implement SMS queue**
    - Use Celery for async SMS sending
    - Queue SMS sends to avoid blocking requests
    - Batch SMS sends for efficiency
    - Rate limit to comply with SMS gateway limits

11. **Add SMS delivery reports**
    - Admin interface to view SMS delivery status
    - Filter by status (sent, delivered, failed)
    - Export SMS logs for billing
    - Track SMS costs per tenant

12. **Create SMS cost tracking**
    - Record SMS cost per message
    - Calculate total SMS costs per tenant
    - Display costs in admin dashboard
    - Alert when SMS budget is reached

13. **Implement international SMS support**
    - Support phone numbers from other countries
    - Apply correct country code
    - Handle international SMS rates
    - Validate international phone formats

14. **Add SMS customization**
    - Allow tenants to customize SMS message
    - Variable placeholders (business name, amount, etc.)
    - Preview SMS before sending
    - Character count indicator

### SMS Service Class

```python
# apps/pos/receipts/services/sms_service.py

from twilio.rest import Client
from django.conf import settings

class SMSReceiptService:
    """
    Service for sending receipt links via SMS.
    """
    
    def __init__(self):
        """Initialize SMS service with Twilio client."""
        self.client = Client(
            settings.TWILIO_ACCOUNT_SID,
            settings.TWILIO_AUTH_TOKEN
        )
        self.from_number = settings.TWILIO_PHONE_NUMBER
    
    def send_receipt_sms(self, receipt, phone_number):
        """
        Send receipt link via SMS.
        
        Args:
            receipt: Receipt instance
            phone_number: Customer phone number
        
        Returns:
            (success, message) tuple
        """
        try:
            # Validate phone number
            normalized_phone = self.normalize_phone(phone_number)
            if not normalized_phone:
                return (False, 'Invalid phone number')
            
            # Check opt-in status
            if not self.check_opt_in(normalized_phone):
                return (False, 'Customer has opted out of SMS receipts')
            
            # Generate short URL
            short_url_service = ShortURLService()
            short_url = short_url_service.create_short_url(receipt)
            
            # Compose message
            message_text = self.compose_message(receipt, short_url)
            
            # Send SMS
            message = self.client.messages.create(
                body=message_text,
                from_=self.from_number,
                to=normalized_phone
            )
            
            # Track SMS
            self.track_sms(receipt, normalized_phone, message.sid, 'sent')
            
            return (True, f'SMS sent to {normalized_phone}')
        
        except Exception as e:
            logger.error(f'Failed to send SMS: {e}')
            return (False, str(e))
    
    def compose_message(self, receipt, short_url):
        """
        Compose SMS message text.
        
        Args:
            receipt: Receipt instance
            short_url: ShortURL instance
        
        Returns:
            Message text string
        """
        business_name = receipt.tenant.business_name
        amount = f"Rs. {receipt.total_amount:,.2f}"
        url = short_url.get_short_url()
        
        # Keep under 160 characters for single SMS
        message = f"Your receipt from {business_name}: {amount}. View: {url}"
        
        return message
    
    def normalize_phone(self, phone_number):
        """
        Normalize phone number to E.164 format.
        
        Args:
            phone_number: Raw phone number string
        
        Returns:
            Normalized phone number or None if invalid
        """
        # Remove spaces, dashes, parentheses
        clean = re.sub(r'[^\d+]', '', phone_number)
        
        # Handle Sri Lankan numbers
        if clean.startswith('0'):
            # 077xxxxxxx -> +9477xxxxxxx
            clean = '+94' + clean[1:]
        elif clean.startswith('94') and not clean.startswith('+'):
            # 9477xxxxxxx -> +9477xxxxxxx
            clean = '+' + clean
        elif not clean.startswith('+'):
            # 77xxxxxxx -> +9477xxxxxxx
            clean = '+94' + clean
        
        # Validate format
        if re.match(r'^\+94[1-9]\d{8}$', clean):
            return clean
        
        return None
    
    def check_opt_in(self, phone_number):
        """
        Check if customer has opted in to SMS receipts.
        
        Args:
            phone_number: Normalized phone number
        
        Returns:
            True if opted in
        """
        # Check customer preferences
        try:
            customer = Customer.objects.get(phone=phone_number)
            return customer.preferences.receive_sms_receipts
        except Customer.DoesNotExist:
            # Default: Allow SMS if no customer record
            return True
    
    def track_sms(self, receipt, phone_number, message_sid, status):
        """
        Track SMS delivery.
        
        Args:
            receipt: Receipt instance
            phone_number: Phone number
            message_sid: Twilio message SID
            status: Delivery status
        """
        SMSLog.objects.create(
            receipt=receipt,
            phone_number=phone_number,
            message_sid=message_sid,
            status=status,
            sent_at=timezone.now(),
        )
```

### SMS Message Templates

| Template | Message | Length |
|----------|---------|--------|
| **Basic** | Your receipt from {business}: {amount}. View: {url} | ~60 chars |
| **Personalized** | Hi {name}! Your receipt from {business}: {amount}. View: {url} | ~70 chars |
| **With Thanks** | Thank you for shopping at {business}! Receipt: {amount}. View: {url} | ~75 chars |

### Phone Number Normalization

| Input Format | Normalized Output |
|--------------|-------------------|
| 077 123 4567 | +94771234567 |
| 0771234567 | +94771234567 |
| 94771234567 | +94771234567 |
| +94 77 123 4567 | +94771234567 |

### SMS Gateway Configuration

```python
# settings.py

# Twilio configuration
TWILIO_ACCOUNT_SID = os.getenv('TWILIO_ACCOUNT_SID')
TWILIO_AUTH_TOKEN = os.getenv('TWILIO_AUTH_TOKEN')
TWILIO_PHONE_NUMBER = os.getenv('TWILIO_PHONE_NUMBER', '+1234567890')

# Alternative: Local SMS provider (Dialog, Mobitel)
SMS_GATEWAY_PROVIDER = 'twilio'  # or 'dialog', 'mobitel'
SMS_GATEWAY_API_KEY = os.getenv('SMS_GATEWAY_API_KEY')
SMS_GATEWAY_URL = os.getenv('SMS_GATEWAY_URL')
```

### Celery Task for SMS Sending

```python
# apps/pos/receipts/tasks.py

@shared_task(bind=True, max_retries=3)
def send_receipt_sms_task(self, receipt_id, phone_number):
    """
    Celery task to send receipt SMS asynchronously.
    """
    try:
        receipt = Receipt.objects.get(id=receipt_id)
        service = SMSReceiptService()
        success, message = service.send_receipt_sms(receipt, phone_number)
        
        if not success:
            # Retry with exponential backoff
            raise self.retry(exc=Exception(message), countdown=2 ** self.request.retries)
        
        return {'success': True, 'message': message}
    
    except Receipt.DoesNotExist:
        return {'success': False, 'message': 'Receipt not found'}
    
    except Exception as exc:
        return {'success': False, 'message': str(exc)}
```

### SMS Log Model

```python
class SMSLog(models.Model):
    """
    Log of SMS receipt deliveries.
    """
    receipt = models.ForeignKey('Receipt', on_delete=models.CASCADE, related_name='sms_logs')
    phone_number = models.CharField(max_length=20)
    message_sid = models.CharField(max_length=50, blank=True)
    status = models.CharField(
        max_length=20,
        choices=[
            ('sent', 'Sent'),
            ('delivered', 'Delivered'),
            ('failed', 'Failed'),
            ('undelivered', 'Undelivered'),
        ]
    )
    sent_at = models.DateTimeField(auto_now_add=True)
    delivered_at = models.DateTimeField(null=True, blank=True)
    cost = models.DecimalField(max_digits=10, decimal_places=4, default=0)
    
    class Meta:
        ordering = ['-sent_at']
```

### Expected Outcome
```
apps/pos/receipts/
├── models/
│   └── sms_log.py                     # SMS delivery log
├── services/
│   └── sms_service.py                 # SMS sending service
└── tasks.py                           # Celery SMS tasks
```

### Verification Checklist
- [ ] SMS gateway is configured
- [ ] SMS service class is created
- [ ] SMS message template is designed (under 160 chars)
- [ ] Send SMS method is implemented
- [ ] Phone number validation normalizes formats
- [ ] SMS sending settings are configurable
- [ ] SMS opt-in/opt-out is implemented
- [ ] SMS tracking logs delivery status
- [ ] SMS retry logic handles failures
- [ ] SMS queue uses Celery for async sending
- [ ] SMS delivery reports are available in admin
- [ ] SMS cost tracking records expenses
- [ ] International SMS support is available
- [ ] SMS customization allows template editing

---

## Task 68: Create Receipt Preferences

### Overview
Implement a comprehensive customer preference system for receipt delivery, allowing customers to choose their preferred receipt format (print, email, SMS, or combinations) and manage their receipt delivery settings.

### Dependencies
- Task 62: Email receipt system
- Task 67: SMS receipt system
- Customer model: Customer data structure

### Instructions

1. **Create customer preferences model**
   - Create file: `apps/pos/receipts/models/customer_preferences.py`
   - Define `CustomerReceiptPreferences` model
   - Link to Customer model (OneToOne)
   - Store all receipt-related preferences

2. **Define preference fields**
   - Preferred receipt format: PRINT, EMAIL, SMS, BOTH, NONE
   - Include PDF in email: Boolean
   - Receive SMS receipts: Boolean
   - Default email address: EmailField
   - Default phone number: CharField
   - Auto-send receipts: Boolean

3. **Create preference UI component**
   - Settings page for customers to manage preferences
   - Form with all preference options
   - Save button with validation
   - Success/error notifications

4. **Implement preference API endpoints**
   - GET `/api/customer/preferences/` - Retrieve preferences
   - PUT `/api/customer/preferences/` - Update preferences
   - POST `/api/customer/preferences/reset/` - Reset to defaults
   - Authentication required

5. **Add preference selection at POS**
   - Prompt customer for receipt preference at checkout
   - Quick select buttons (Print, Email, SMS, Both, None)
   - Remember customer's last choice
   - Override for individual transactions

6. **Implement default preferences**
   - System-wide defaults for new customers
   - Tenant-specific defaults
   - Country/region-specific defaults (Sri Lanka: prefer print+SMS)
   - Allow tenant to set default preferences

7. **Create preference migration**
   - Migrate existing customers to new preference system
   - Set sensible defaults based on historical behavior
   - Prompt customers to update preferences on first use

8. **Add preference enforcement**
   - Respect customer preferences when generating receipts
   - Skip email if customer has opted out
   - Don't send SMS if customer has opted out
   - Always offer print option

9. **Implement eco-friendly options**
   - "Eco Mode" - Digital receipt only (no print)
   - Highlight environmental impact (trees saved, etc.)
   - Offer incentives for going paperless
   - Track eco-friendly receipt stats

10. **Create preference inheritance**
    - Guest checkout: Use tenant defaults
    - Registered customer: Use saved preferences
    - Override: Allow one-time preference change
    - Remember override for next time

11. **Add language preference**
    - Preferred language for receipts (English, Sinhala, Tamil)
    - Apply to email subject/body
    - Format dates/numbers according to locale
    - Store in preferences

12. **Implement notification preferences**
    - Receive receipt notifications: Boolean
    - Notification timing: Immediate, Daily digest, Weekly
    - Notify for returns/refunds: Boolean
    - Marketing opt-in/opt-out

13. **Create preference validation**
    - Validate email address before saving
    - Validate phone number format
    - Check for conflicts (e.g., SMS but no phone)
    - Provide helpful error messages

14. **Add preference analytics**
    - Track preference distribution (how many prefer email vs. SMS)
    - Monitor preference changes over time
    - Identify trends (e.g., shift to digital)
    - Report to tenants

### Customer Preferences Model

```python
# apps/pos/receipts/models/customer_preferences.py

class CustomerReceiptPreferences(models.Model):
    """
    Customer preferences for receipt delivery.
    """
    
    RECEIPT_FORMAT_CHOICES = [
        ('print', 'Print Only'),
        ('email', 'Email Only'),
        ('sms', 'SMS Only'),
        ('print_email', 'Print + Email'),
        ('print_sms', 'Print + SMS'),
        ('email_sms', 'Email + SMS'),
        ('all', 'All Methods'),
        ('none', 'No Receipt'),
    ]
    
    customer = models.OneToOneField(
        'Customer',
        on_delete=models.CASCADE,
        related_name='receipt_preferences'
    )
    
    # Receipt format preference
    preferred_format = models.CharField(
        max_length=20,
        choices=RECEIPT_FORMAT_CHOICES,
        default='print_email',
        help_text='Preferred receipt delivery method'
    )
    
    # Email preferences
    receive_email_receipts = models.BooleanField(default=True)
    include_pdf_attachment = models.BooleanField(default=True)
    email_address = models.EmailField(blank=True, help_text='Override customer default email')
    
    # SMS preferences
    receive_sms_receipts = models.BooleanField(default=False)
    phone_number = models.CharField(max_length=20, blank=True, help_text='Override customer default phone')
    
    # Delivery preferences
    auto_send_receipts = models.BooleanField(default=True, help_text='Send receipts automatically after purchase')
    
    # Eco-friendly option
    eco_mode = models.BooleanField(default=False, help_text='Digital receipts only (no printing)')
    
    # Language preference
    language = models.CharField(
        max_length=5,
        choices=[
            ('en', 'English'),
            ('si', 'Sinhala'),
            ('ta', 'Tamil'),
        ],
        default='en'
    )
    
    # Notification preferences
    receive_return_notifications = models.BooleanField(default=True)
    marketing_opt_in = models.BooleanField(default=False)
    
    # Metadata
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = 'Customer Receipt Preferences'
        verbose_name_plural = 'Customer Receipt Preferences'
    
    def __str__(self):
        return f"{self.customer.name} - {self.get_preferred_format_display()}"
    
    def should_print(self):
        """Check if receipt should be printed."""
        return 'print' in self.preferred_format and not self.eco_mode
    
    def should_email(self):
        """Check if receipt should be emailed."""
        return self.receive_email_receipts and 'email' in self.preferred_format
    
    def should_sms(self):
        """Check if receipt should be sent via SMS."""
        return self.receive_sms_receipts and 'sms' in self.preferred_format
```

### Preference API Serializer

```python
# apps/pos/receipts/serializers.py

class CustomerReceiptPreferencesSerializer(serializers.ModelSerializer):
    """
    Serializer for customer receipt preferences.
    """
    
    class Meta:
        model = CustomerReceiptPreferences
        fields = [
            'preferred_format',
            'receive_email_receipts',
            'include_pdf_attachment',
            'email_address',
            'receive_sms_receipts',
            'phone_number',
            'auto_send_receipts',
            'eco_mode',
            'language',
            'receive_return_notifications',
            'marketing_opt_in',
        ]
    
    def validate_email_address(self, value):
        """Validate email address if provided."""
        if value and not re.match(r'^[^@]+@[^@]+\.[^@]+$', value):
            raise serializers.ValidationError('Invalid email address')
        return value
    
    def validate_phone_number(self, value):
        """Validate phone number if provided."""
        if value:
            sms_service = SMSReceiptService()
            normalized = sms_service.normalize_phone(value)
            if not normalized:
                raise serializers.ValidationError('Invalid phone number')
            return normalized
        return value
    
    def validate(self, data):
        """Cross-field validation."""
        # If SMS receipts enabled, phone number required
        if data.get('receive_sms_receipts') and 'sms' in data.get('preferred_format', ''):
            if not data.get('phone_number') and not self.instance.customer.phone:
                raise serializers.ValidationError({
                    'phone_number': 'Phone number required for SMS receipts'
                })
        
        # If email receipts enabled, email address required
        if data.get('receive_email_receipts') and 'email' in data.get('preferred_format', ''):
            if not data.get('email_address') and not self.instance.customer.email:
                raise serializers.ValidationError({
                    'email_address': 'Email address required for email receipts'
                })
        
        return data
```

### Preference Selection UI Component

```tsx
// components/customer/ReceiptPreferences.tsx

export function ReceiptPreferencesForm() {
  const [preferences, setPreferences] = useState<CustomerReceiptPreferences | null>(null);
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    fetchPreferences();
  }, []);
  
  const fetchPreferences = async () => {
    const response = await fetch('/api/customer/preferences/');
    const data = await response.json();
    setPreferences(data);
  };
  
  const handleSave = async () => {
    setLoading(true);
    
    await fetch('/api/customer/preferences/', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(preferences),
    });
    
    setLoading(false);
    toast.success('Preferences saved!');
  };
  
  if (!preferences) return <LoadingSpinner />;
  
  return (
    <form className="preferences-form">
      <h2>Receipt Delivery Preferences</h2>
      
      {/* Preferred Format */}
      <div className="form-group">
        <label>How would you like to receive receipts?</label>
        <select
          value={preferences.preferred_format}
          onChange={(e) => setPreferences({ ...preferences, preferred_format: e.target.value })}
        >
          <option value="print">Print Only</option>
          <option value="email">Email Only</option>
          <option value="sms">SMS Only</option>
          <option value="print_email">Print + Email</option>
          <option value="print_sms">Print + SMS</option>
          <option value="email_sms">Email + SMS</option>
          <option value="all">All Methods</option>
          <option value="none">No Receipt</option>
        </select>
      </div>
      
      {/* Email Options */}
      {preferences.preferred_format.includes('email') && (
        <>
          <div className="form-group">
            <label>
              <input
                type="checkbox"
                checked={preferences.include_pdf_attachment}
                onChange={(e) => setPreferences({ ...preferences, include_pdf_attachment: e.target.checked })}
              />
              Include PDF attachment in emails
            </label>
          </div>
          
          <div className="form-group">
            <label>Email Address (optional override)</label>
            <input
              type="email"
              value={preferences.email_address}
              onChange={(e) => setPreferences({ ...preferences, email_address: e.target.value })}
              placeholder="your@email.com"
            />
          </div>
        </>
      )}
      
      {/* SMS Options */}
      {preferences.preferred_format.includes('sms') && (
        <div className="form-group">
          <label>Phone Number (optional override)</label>
          <input
            type="tel"
            value={preferences.phone_number}
            onChange={(e) => setPreferences({ ...preferences, phone_number: e.target.value })}
            placeholder="+94 77 123 4567"
          />
        </div>
      )}
      
      {/* Eco Mode */}
      <div className="form-group eco-mode">
        <label>
          <input
            type="checkbox"
            checked={preferences.eco_mode}
            onChange={(e) => setPreferences({ ...preferences, eco_mode: e.target.checked })}
          />
          🌱 Eco Mode - Digital receipts only (save paper)
        </label>
        {preferences.eco_mode && (
          <p className="help-text">Thank you for helping the environment!</p>
        )}
      </div>
      
      {/* Language */}
      <div className="form-group">
        <label>Receipt Language</label>
        <select
          value={preferences.language}
          onChange={(e) => setPreferences({ ...preferences, language: e.target.value })}
        >
          <option value="en">English</option>
          <option value="si">Sinhala (සිංහල)</option>
          <option value="ta">Tamil (தமிழ்)</option>
        </select>
      </div>
      
      {/* Save Button */}
      <button type="button" onClick={handleSave} disabled={loading} className="save-button">
        {loading ? 'Saving...' : 'Save Preferences'}
      </button>
    </form>
  );
}
```

### POS Quick Preference Selection

```tsx
// components/pos/ReceiptOptionSelector.tsx

interface ReceiptOptionSelectorProps {
  onSelect: (format: string) => void;
  defaultFormat?: string;
}

export function ReceiptOptionSelector({ onSelect, defaultFormat }: ReceiptOptionSelectorProps) {
  return (
    <div className="receipt-option-selector">
      <p>How should we send your receipt?</p>
      
      <div className="option-buttons">
        <button
          onClick={() => onSelect('print')}
          className={defaultFormat === 'print' ? 'active' : ''}
        >
          🖨️ Print
        </button>
        
        <button
          onClick={() => onSelect('email')}
          className={defaultFormat === 'email' ? 'active' : ''}
        >
          📧 Email
        </button>
        
        <button
          onClick={() => onSelect('sms')}
          className={defaultFormat === 'sms' ? 'active' : ''}
        >
          💬 SMS
        </button>
        
        <button
          onClick={() => onSelect('print_email')}
          className={defaultFormat === 'print_email' ? 'active' : ''}
        >
          🖨️📧 Both
        </button>
        
        <button
          onClick={() => onSelect('none')}
          className={defaultFormat === 'none' ? 'active' : ''}
        >
          🚫 None
        </button>
      </div>
    </div>
  );
}
```

### Preference Enforcement Service

```python
# apps/pos/receipts/services/preference_service.py

class ReceiptPreferenceService:
    """
    Service for enforcing customer receipt preferences.
    """
    
    def send_receipt_by_preference(self, receipt, customer):
        """
        Send receipt according to customer preferences.
        
        Args:
            receipt: Receipt instance
            customer: Customer instance
        """
        preferences = self.get_preferences(customer)
        
        # Print receipt
        if preferences.should_print():
            self.trigger_print(receipt)
        
        # Email receipt
        if preferences.should_email():
            email_service = EmailReceiptService(receipt)
            email = preferences.email_address or customer.email
            email_service.send_email(email)
        
        # SMS receipt
        if preferences.should_sms():
            sms_service = SMSReceiptService()
            phone = preferences.phone_number or customer.phone
            sms_service.send_receipt_sms(receipt, phone)
    
    def get_preferences(self, customer):
        """
        Get customer preferences or create defaults.
        
        Args:
            customer: Customer instance
        
        Returns:
            CustomerReceiptPreferences instance
        """
        preferences, created = CustomerReceiptPreferences.objects.get_or_create(
            customer=customer,
            defaults=self.get_default_preferences()
        )
        return preferences
    
    def get_default_preferences(self):
        """
        Get default preferences for new customers.
        
        Returns:
            Dictionary with default preferences
        """
        return {
            'preferred_format': 'print_email',
            'receive_email_receipts': True,
            'include_pdf_attachment': True,
            'receive_sms_receipts': False,
            'auto_send_receipts': True,
            'eco_mode': False,
            'language': 'en',
        }
```

### Expected Outcome
```
apps/pos/receipts/
├── models/
│   └── customer_preferences.py        # Preferences model
├── services/
│   └── preference_service.py          # Preference enforcement
├── serializers.py                     # API serializers
└── views/
    └── preferences.py                 # Preference API endpoints

frontend/
└── components/
    ├── customer/
    │   └── ReceiptPreferences.tsx     # Settings page
    └── pos/
        └── ReceiptOptionSelector.tsx  # POS quick select
```

### Verification Checklist
- [ ] Customer preferences model is created
- [ ] Preference fields cover all options
- [ ] Preference UI component is user-friendly
- [ ] Preference API endpoints are implemented
- [ ] Preference selection at POS is quick and easy
- [ ] Default preferences are sensible
- [ ] Preference migration handles existing customers
- [ ] Preference enforcement respects settings
- [ ] Eco-friendly options encourage paperless receipts
- [ ] Preference inheritance works for guests vs. registered
- [ ] Language preference is applied
- [ ] Notification preferences are respected
- [ ] Preference validation prevents invalid settings
- [ ] Preference analytics track trends

---

## Summary

### Tasks Completed in This Document
| Task # | Task Name | Key Deliverable |
|--------|-----------|-----------------|
| 65 | Add receipt verification | Verification service and UI |
| 66 | Create digital receipt sharing | Share modal and tracking |
| 67 | Add SMS receipt option | SMS service and delivery |
| 68 | Create receipt preferences | Preferences model and UI |

### Final Group D Document 3 Structure
```
apps/pos/receipts/
├── models/
│   ├── receipt.py                     # With verification fields
│   ├── verification_log.py            # Verification tracking
│   ├── short_url.py                   # Short URLs for sharing
│   ├── sms_log.py                     # SMS delivery log
│   └── customer_preferences.py        # Receipt preferences
├── services/
│   ├── verification.py                # Verification service
│   ├── short_url.py                   # Short URL service
│   ├── sms_service.py                 # SMS sending service
│   └── preference_service.py          # Preference enforcement
├── views/
│   ├── verification.py                # Verification API
│   ├── share.py                       # Share endpoints
│   └── preferences.py                 # Preferences API
└── tasks.py                           # Celery tasks

frontend/
├── app/
│   └── verify/
│       └── page.tsx                   # Verification page
└── components/
    ├── receipts/
    │   ├── VerificationBadge.tsx      # Verification UI
    │   ├── ShareModal.tsx             # Share dialog
    │   └── SocialShare.tsx            # Social sharing
    ├── customer/
    │   └── ReceiptPreferences.tsx     # Settings page
    └── pos/
        └── ReceiptOptionSelector.tsx  # POS quick select
```

### Group D Complete Summary

All 16 tasks (53-68) in Group D are now documented:

**Document 1 (Tasks 53-59): PDF Generation System**
- PDF receipt templates (A4 and thermal styles)
- Tenant branding integration
- PDF generator service
- PDF metadata and storage

**Document 2 (Tasks 60-64): Email Receipt System**
- Email templates (HTML and plain text)
- Email styling for client compatibility
- Email sending service with retry logic
- PDF attachments
- Receipt lookup web page

**Document 3 (Tasks 65-68): Verification, Sharing & Preferences**
- Receipt verification system
- Digital sharing capabilities
- SMS receipt delivery
- Customer receipt preferences

### Integration Points

1. **PDF + Email:** PDF generator creates A4 invoices that are attached to emails
2. **Email + SMS:** Both use short URLs for compact sharing
3. **Verification + Sharing:** Shared receipts include verification tokens
4. **Preferences + All:** Customer preferences control PDF, email, and SMS delivery

### Next Steps

1. Proceed to **Group E: Receipt API & Storage** to implement comprehensive receipt APIs
2. Test all PDF generation scenarios (A4, thermal, with branding)
3. Verify email delivery across multiple email clients
4. Test SMS delivery with Sri Lankan phone numbers
5. Validate verification system security
6. Ensure sharing works on mobile and desktop
7. Test preference enforcement in POS workflow

---

## Notes for AI Agents

1. **Verification Security:**
   - Always use HMAC for hash generation (secure)
   - Use constant-time comparison to prevent timing attacks
   - Never expose secret key in frontend code
   - Log all verification attempts for audit

2. **SMS Provider Selection:**
   - **Twilio:** International, reliable, good documentation
   - **Dialog SMS:** Sri Lanka local, competitive rates
   - **Mobitel SMS:** Sri Lanka local, alternative
   - Consider costs and delivery reliability

3. **Short URLs:**
   - Keep codes short (6-8 characters)
   - Ensure uniqueness (check before creating)
   - Track usage for analytics
   - Consider expiration for security

4. **Customer Preferences:**
   - Provide sensible defaults
   - Make preferences easy to change
   - Respect opt-out immediately
   - Sync preferences across channels

5. **Eco-Friendly Initiative:**
   - Encourage digital receipts
   - Track environmental impact
   - Offer incentives for paperless
   - Educate customers on benefits

6. **Testing:**
   - Test verification with tampered receipts
   - Test sharing on various platforms (mobile, desktop, social media)
   - Test SMS with international and Sri Lankan numbers
   - Test preferences in POS workflow
   - Verify language switching works correctly

7. **Performance:**
   - Cache verification results (short TTL)
   - Use async tasks for SMS sending
   - Batch short URL generation
   - Optimize preference lookups

8. **Compliance:**
   - GDPR/privacy: Honor opt-outs immediately
   - Telecommunications: Follow SMS regulations
   - Data retention: Store logs appropriately
   - Audit trails: Track all access and modifications
