# Tasks 51-58: Webhook View, Signature Verification, and Parser

> **Phase:** 09 - Integrations & Sri Lanka Localizations  
> **SubPhase:** 02 - PayHere Integration  
> **Group:** D - Webhook & Notification  
> **Document:** 01 of 02  
> **Tasks Covered:** 51, 52, 53, 54, 55, 56, 57, 58

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **→ Next Document:** [02_Tasks-59-66_Handlers-Update-Verify.md](02_Tasks-59-66_Handlers-Update-Verify.md)

---

## Document Overview

Implement PayHere webhook endpoint with signature verification and POST data parsing. Create secure webhook view with CSRF exemption, IP whitelisting, MD5 signature verification, and comprehensive parameter parsing.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 51 | Create PayHere Webhook View | Medium | 40 min |
| 52 | Create Webhook URL Config | Low | 10 min |
| 53 | Create Webhook CSRF Exempt | Low | 5 min |
| 54 | Create Webhook IP Whitelist | Medium | 30 min |
| 55 | Create Signature Verification | High | 45 min |
| 56 | Create Signature Components | Medium | 25 min |
| 57 | Create Hash Comparison | Low | 15 min |
| 58 | Create Webhook Parser | Medium | 35 min |

---

## Task 51: Create PayHere Webhook View

### Overview
Create the main webhook view that receives POST notifications from PayHere servers. This view handles payment status updates, validates incoming requests, and orchestrates the webhook processing pipeline. The view must respond with 200 OK to all requests (even failures) to prevent PayHere from retrying unnecessarily.

### Dependencies
- Task 50: Implement Payment Initialization (from Group C)
- Payment model with status tracking exists
- Order model with payment relationship exists

### Instructions

1. **Create webhooks module**
   - Navigate to `backend/apps/payments/webhooks/` directory
   - Create new file named `payhere.py`
   - This will contain all PayHere webhook logic

2. **Import required dependencies**
   - Import Django views and decorators
   - Import PayHere configuration from settings
   - Import Payment and Order models
   - Import logging for webhook tracking
   - Import json for response formatting

3. **Define webhook view function**
   - Create function named `payhere_webhook_handler`
   - Accept `request` parameter (HttpRequest)
   - Return JsonResponse with 200 status code always
   - Use function-based view (not class-based) for simplicity

4. **Set up logging**
   - Create logger named 'payments.webhooks.payhere'
   - Log all incoming webhook requests with timestamp
   - Log request IP address for security tracking
   - Log full POST data (sanitize sensitive fields)

5. **Implement early validation**
   - Check if request method is POST
   - Return 200 OK with error message if not POST
   - Log invalid method attempts
   - Still return success to prevent retries

6. **Create response structure**
   - Define standard success response format
   - Include status 'success' or 'error'
   - Include message for debugging
   - Always return HTTP 200 regardless of processing outcome

7. **Add error handling wrapper**
   - Wrap entire view logic in try-except block
   - Catch all exceptions to prevent 500 errors
   - Log exceptions with full traceback
   - Return 200 OK even on exceptions

8. **Implement processing orchestration**
   - Call signature verification (Task 55)
   - Call webhook parser (Task 58)
   - Call status handler (Task 59+)
   - Return success response after processing

### Webhook View Structure

```
┌──────────────────────────────────────┐
│   payhere_webhook_handler()          │
│                                       │
│   1. Log Request                      │
│   2. Validate Method (POST)           │
│   3. Verify Signature (Task 55)       │
│   4. Parse Webhook Data (Task 58)     │
│   5. Handle Status (Task 59+)         │
│   6. Return 200 OK                    │
└──────────────────────────────────────┘
```

### Webhook Flow Diagram

```
PayHere Server
     │
     │ POST /api/webhooks/payhere/
     ▼
┌─────────────────┐
│  Webhook View   │
└────────┬────────┘
         │
         ├──► Log Request
         │
         ├──► Check Method
         │
         ├──► Verify IP (Task 54)
         │
         ├──► Verify Signature (Task 55)
         │
         ├──► Parse Data (Task 58)
         │
         ├──► Route to Handler (Task 59)
         │
         └──► Return 200 OK
```

### Response Format

```
Success Response:
{
    "status": "success",
    "message": "Webhook processed successfully"
}

Error Response (still 200 OK):
{
    "status": "error",
    "message": "Signature verification failed"
}
```

### Implementation Notes

- **Always return 200 OK**: PayHere retries failed webhooks, which can cause duplicate processing
- **Log everything**: Webhook debugging is difficult without comprehensive logs
- **Process asynchronously**: Consider moving heavy processing to Celery task
- **Idempotency**: Ensure webhooks can be processed multiple times safely

### Security Considerations

- Never expose internal error details in response
- Always validate signature before processing
- Log suspicious requests (invalid IPs, signatures)
- Rate limit webhook endpoint if needed

### Testing Strategy

- Test with PayHere sandbox notifications
- Test signature verification with valid/invalid hashes
- Test duplicate webhook handling
- Test various status codes
- Test malformed POST data

---

## Task 52: Create Webhook URL Config

### Overview
Configure Django URL routing for the PayHere webhook endpoint. Register the webhook view with a predictable URL pattern that PayHere servers can POST to. This URL must match the webhook URL configured in PayHere merchant dashboard.

### Dependencies
- Task 51: Create PayHere Webhook View

### Instructions

1. **Navigate to payments URLs**
   - Open `backend/apps/payments/urls.py`
   - If file doesn't exist, create it with app_name

2. **Import webhook view**
   - Import payhere_webhook_handler from webhooks.payhere
   - Use explicit import for clarity

3. **Define URL pattern**
   - Create path for 'webhooks/payhere/'
   - Map to payhere_webhook_handler view
   - Name the URL 'payhere-webhook' for reverse lookup

4. **Add to urlpatterns list**
   - Append webhook path to existing patterns
   - Place near other webhook URLs if any exist

5. **Include in main URLs**
   - Open `backend/config/urls.py`
   - Include payments.urls under 'api/' namespace
   - Ensure full path is accessible at `/api/webhooks/payhere/`

6. **Verify URL resolution**
   - Use Django's reverse() function to test
   - Verify URL generates correctly: `/api/webhooks/payhere/`
   - Check URL is accessible without authentication

7. **Document URL for PayHere config**
   - Add comment with full URL format
   - Note: `https://yourdomain.com/api/webhooks/payhere/`
   - This URL must be configured in PayHere merchant dashboard

### URL Configuration Structure

```
Main urls.py (config/urls.py)
└── /api/
    └── payments/urls.py
        └── webhooks/payhere/  ──► payhere_webhook_handler
```

### URL Pattern Example

```
Pattern: webhooks/payhere/
Name: payhere-webhook
View: payhere_webhook_handler
Full Path: /api/webhooks/payhere/
Method: POST
```

### PayHere Dashboard Configuration

```
Merchant Dashboard Settings:
├── Server URL (Sandbox): https://dev.yourdomain.com/api/webhooks/payhere/
└── Server URL (Production): https://yourdomain.com/api/webhooks/payhere/
```

### Implementation Notes

- **No trailing slash required**: Django handles both with/without
- **Use HTTPS in production**: PayHere requires secure webhook URLs
- **Public endpoint**: No authentication required (signature verification instead)
- **Include in API documentation**: Document this endpoint for reference

### Testing Strategy

- Test URL resolution using Django shell
- Test GET request returns 200 (even though not processed)
- Test POST request reaches view correctly
- Test URL is accessible without authentication
- Verify URL matches PayHere dashboard configuration

---

## Task 53: Create Webhook CSRF Exempt

### Overview
Exempt the PayHere webhook endpoint from Django's CSRF protection. External services like PayHere cannot provide CSRF tokens, so the webhook view must be explicitly exempted while maintaining security through signature verification.

### Dependencies
- Task 51: Create PayHere Webhook View

### Instructions

1. **Import CSRF decorator**
   - Import csrf_exempt from django.views.decorators.csrf
   - Add to imports in webhooks/payhere.py

2. **Apply decorator to view**
   - Add @csrf_exempt decorator above payhere_webhook_handler
   - Place before any other decorators

3. **Add security comment**
   - Comment explaining why CSRF is exempted
   - Note: "External POST from PayHere; security via signature verification"
   - Reference Task 55 for signature verification

4. **Verify exemption works**
   - Test POST request without CSRF token succeeds
   - Ensure no CSRF validation errors occur

### Decorator Application

```
@csrf_exempt
def payhere_webhook_handler(request):
    ...
```

### Security Rationale

```
CSRF Protection Not Needed Because:
├── External service cannot obtain CSRF token
├── Signature verification provides security (Task 55)
├── IP whitelisting adds additional layer (Task 54)
└── Payment data validation prevents tampering
```

### Implementation Notes

- **CSRF exemption is standard**: All payment gateway webhooks require this
- **Compensate with other security**: Signature + IP validation
- **Document the exemption**: Add clear comments explaining why
- **Review security regularly**: Ensure signature verification is robust

### Alternative Approaches

- Use @method_decorator for class-based views (not needed here)
- Configure CSRF exemption in middleware (not recommended)
- Use API framework decorators if using DRF (overkill for webhook)

### Testing Strategy

- Test POST without CSRF token succeeds
- Test POST with invalid CSRF token succeeds
- Ensure other views still require CSRF
- Verify signature verification compensates for CSRF exemption

---

## Task 54: Create Webhook IP Whitelist

### Overview
Implement IP address whitelisting to restrict webhook requests to PayHere's official server IPs. This adds an additional security layer beyond signature verification, preventing unauthorized webhook attempts from unknown sources.

### Dependencies
- Task 51: Create PayHere Webhook View
- Task 16: Verify PayHere Configuration

### Instructions

1. **Define PayHere server IPs**
   - Research PayHere's official webhook server IPs
   - Add to PayHere configuration in settings
   - Create PAYHERE_WEBHOOK_IPS setting (list of IP addresses)
   - Note: PayHere may use multiple IPs for redundancy

2. **Create IP validation utility**
   - Create function named `validate_webhook_ip`
   - Accept request parameter
   - Return True if IP is allowed, False otherwise

3. **Extract client IP address**
   - Get client IP from request.META['REMOTE_ADDR']
   - Check X-Forwarded-For header if behind proxy
   - Handle IPv4 and IPv6 addresses
   - Strip any port numbers from IP

4. **Compare against whitelist**
   - Load allowed IPs from configuration
   - Check if client IP matches any allowed IP
   - Handle both exact matches and CIDR ranges if needed
   - Log IP check result

5. **Integrate into webhook view**
   - Call validate_webhook_ip() early in request processing
   - Before signature verification
   - If IP not allowed, log warning and return 403 Forbidden
   - Include IP address in log message

6. **Add configuration flexibility**
   - Allow IP whitelist to be disabled (for development)
   - Create PAYHERE_WEBHOOK_IP_WHITELIST_ENABLED setting
   - Default to True in production, False in development
   - Log when IP whitelist is disabled

7. **Handle proxy configurations**
   - Respect X-Forwarded-For header when behind reverse proxy
   - Use X-Real-IP header as fallback
   - Document proxy configuration requirements
   - Be cautious with proxy headers (can be spoofed)

8. **Create IP update mechanism**
   - Document how to update IP whitelist
   - PayHere may change IPs, so make easily updatable
   - Consider fetching from environment variables
   - Log all IP whitelist changes

### IP Validation Flow

```
┌────────────────────┐
│  Webhook Request   │
└─────────┬──────────┘
          │
          ▼
┌────────────────────┐
│  Extract Client IP │ ──► request.META['REMOTE_ADDR']
└─────────┬──────────┘     or X-Forwarded-For
          │
          ▼
┌────────────────────┐
│ Load Allowed IPs   │ ──► Settings.PAYHERE_WEBHOOK_IPS
└─────────┬──────────┘
          │
          ▼
┌────────────────────┐
│  Compare IPs       │
└─────────┬──────────┘
          │
     ┌────┴────┐
     │         │
     ▼         ▼
  Match    No Match
     │         │
     │         └──► Return 403 Forbidden
     │
     └──► Continue Processing
```

### Configuration Example

```
PayHere Settings:
├── PAYHERE_WEBHOOK_IPS = [
│       '123.45.67.89',    # PayHere Production Server 1
│       '123.45.67.90',    # PayHere Production Server 2
│       '123.45.67.91',    # PayHere Backup Server
│   ]
├── PAYHERE_WEBHOOK_IP_WHITELIST_ENABLED = True
└── PAYHERE_WEBHOOK_TRUST_PROXY = True
```

### Implementation Notes

- **Optional security layer**: IP whitelist adds defense-in-depth
- **PayHere IP addresses**: Contact PayHere support for official IPs
- **Proxy awareness**: Critical when behind load balancers/CDNs
- **Logging**: Log all rejected requests for security monitoring

### Security Considerations

- IP addresses can be spoofed if not behind trusted proxy
- Always validate signature even with IP whitelist
- Keep IP list updated when PayHere changes infrastructure
- Monitor logs for blocked IP attempts

### Testing Strategy

- Test requests from allowed IPs pass validation
- Test requests from disallowed IPs return 403
- Test with proxy headers (X-Forwarded-For)
- Test with IP whitelist disabled (development)
- Test IPv4 and IPv6 addresses

---

## Task 55: Create Signature Verification

### Overview
Implement MD5 signature verification for PayHere webhook requests. Signature verification ensures the webhook request genuinely comes from PayHere and hasn't been tampered with. This is the primary security mechanism for webhook authentication.

### Dependencies
- Task 51: Create PayHere Webhook View
- Task 56: Create Signature Components (implemented together)
- Task 16: Verify PayHere Configuration (merchant_secret needed)

### Instructions

1. **Create signature verification function**
   - Create function named `verify_payhere_signature`
   - Accept request and webhook_data parameters
   - Return True if signature valid, False otherwise

2. **Extract signature from POST data**
   - Get 'md5sig' field from POST data
   - This is the signature sent by PayHere
   - Strip whitespace and convert to uppercase
   - Handle missing md5sig field gracefully

3. **Build local signature**
   - Call build_signature_components() (Task 56)
   - Generate MD5 hash of components string
   - Convert to uppercase (PayHere uses uppercase)
   - This is the expected signature

4. **Compare signatures**
   - Use hmac.compare_digest() for timing-safe comparison (Task 57)
   - Compare received signature with computed signature
   - Return True if match, False if mismatch

5. **Add comprehensive logging**
   - Log signature verification attempts
   - Log verification success/failure
   - DO NOT log the actual signatures (security risk)
   - Log order_id for correlation

6. **Handle verification failures**
   - If signature invalid, log warning with details
   - Include request IP and order_id in log
   - Raise SignatureVerificationError exception
   - Do not process webhook if signature fails

7. **Integrate into webhook view**
   - Call verify_payhere_signature() after IP validation
   - Before any payment processing
   - Catch SignatureVerificationError and return error response
   - Still return 200 OK to prevent retries

8. **Add verification bypass for testing**
   - Create PAYHERE_WEBHOOK_SIGNATURE_VERIFICATION setting
   - Allow disabling verification in development only
   - Default to True (always verify in production)
   - Log prominently when verification is disabled

### Signature Verification Flow

```
┌──────────────────────┐
│  Webhook POST Data   │
└──────────┬───────────┘
           │
           ├──► Extract md5sig field
           │
           ├──► Extract signature components:
           │    ├─ merchant_id
           │    ├─ order_id
           │    ├─ payhere_amount
           │    ├─ payhere_currency
           │    ├─ status_code
           │    └─ md5(merchant_secret).upper()
           │
           ▼
┌──────────────────────┐
│  Build Expected Hash │
└──────────┬───────────┘
           │
           ├──► Concatenate components
           ├──► Generate MD5 hash
           ├──► Convert to uppercase
           │
           ▼
┌──────────────────────┐
│  Compare Signatures  │ ──► hmac.compare_digest()
└──────────┬───────────┘
           │
      ┌────┴────┐
      │         │
      ▼         ▼
   Match    Mismatch
      │         │
      │         └──► Raise SignatureVerificationError
      │
      └──► Continue Processing
```

### Signature Components Order

```
Concatenation String (Task 56):
merchant_id + order_id + payhere_amount + payhere_currency + status_code + md5(merchant_secret).upper()

Example:
1234567 + ORD-123 + 5000.00 + LKR + 2 + 926E2B7E7B3F88EA43AA71C1C7C2602F
= "1234567ORD-1235000.00LKR2926E2B7E7B3F88EA43AA71C1C7C2602F"

MD5 Hash:
MD5("1234567ORD-1235000.00LKR2926E2B7E7B3F88EA43AA71C1C7C2602F").upper()
```

### Implementation Notes

- **Always uppercase**: PayHere signatures are uppercase
- **Timing-safe comparison**: Use hmac.compare_digest() to prevent timing attacks
- **No spaces**: Concatenate components directly without separators
- **MD5 is acceptable**: For signature verification (not password hashing)

### Security Considerations

- Signature verification is critical - never skip in production
- Log verification failures for security monitoring
- Don't expose signature details in error messages
- Merchant secret must be kept secure

### Error Handling

```
Signature Mismatch:
├── Log warning with order_id and IP
├── Raise SignatureVerificationError
├── Return 200 OK (to prevent retry)
└── Do not process payment

Missing md5sig Field:
├── Log error
├── Raise SignatureVerificationError
└── Return 200 OK

Missing Signature Components:
├── Log error with missing fields
├── Raise SignatureVerificationError
└── Return 200 OK
```

### Testing Strategy

- Test with valid PayHere signature
- Test with invalid signature
- Test with missing md5sig field
- Test with tampered POST data
- Test signature components order
- Test uppercase conversion
- Use PayHere sandbox for real signature tests

---

## Task 56: Create Signature Components

### Overview
Build the signature components string according to PayHere's specification. This string is hashed to create the expected signature for verification. The components must be concatenated in the exact order PayHere uses.

### Dependencies
- Task 55: Create Signature Verification (implemented together)
- Task 16: Verify PayHere Configuration

### Instructions

1. **Create components builder function**
   - Create function named `build_signature_components`
   - Accept webhook_data dictionary parameter
   - Return concatenated components string

2. **Extract required fields**
   - Extract merchant_id from POST data
   - Extract order_id from POST data
   - Extract payhere_amount from POST data (as string)
   - Extract payhere_currency from POST data
   - Extract status_code from POST data (as string)

3. **Get merchant secret hash**
   - Load merchant_secret from PayHere configuration
   - Generate MD5 hash of merchant_secret
   - Convert hash to uppercase
   - This is the 6th component

4. **Concatenate components in order**
   - Join all components without separators or spaces
   - Order: merchant_id + order_id + payhere_amount + payhere_currency + status_code + secret_hash
   - Return concatenated string

5. **Add validation**
   - Check that all required fields are present
   - Raise ValueError if any field is missing
   - Log missing fields for debugging

6. **Handle amount formatting**
   - Ensure payhere_amount is formatted as PayHere sends it
   - Should be decimal string with 2 decimal places (e.g., "5000.00")
   - Do not convert to float (precision issues)
   - Keep as string for concatenation

7. **Add component logging**
   - Log individual components for debugging (development only)
   - DO NOT log merchant_secret or its hash
   - Log final concatenated string length

### Signature Components Structure

```
Component Order (PayHere Specification):
├── 1. merchant_id        (e.g., "1234567")
├── 2. order_id           (e.g., "ORD-123")
├── 3. payhere_amount     (e.g., "5000.00")
├── 4. payhere_currency   (e.g., "LKR")
├── 5. status_code        (e.g., "2")
└── 6. md5(merchant_secret).upper()  (e.g., "926E2B7E...")

Concatenated (no spaces):
"1234567ORD-1235000.00LKR2926E2B7E7B3F88EA43AA71C1C7C2602F"
```

### Component Details

```
merchant_id:
├── Format: Numeric string
├── Source: PayHere configuration
└── Example: "1234567"

order_id:
├── Format: String (your order ID)
├── Source: Your system (sent to PayHere during initialization)
└── Example: "ORD-123" or "PAY-2024-001"

payhere_amount:
├── Format: Decimal string with 2 decimal places
├── Source: Amount sent to PayHere (may differ from order total if fees)
└── Example: "5000.00"

payhere_currency:
├── Format: 3-letter currency code
├── Source: Always "LKR" for PayHere
└── Example: "LKR"

status_code:
├── Format: Integer as string
├── Source: PayHere webhook POST data
└── Example: "2" (success), "0" (pending), "-1" (cancelled)

merchant_secret hash:
├── Format: MD5 hash uppercase
├── Source: MD5(merchant_secret from config)
└── Example: "926E2B7E7B3F88EA43AA71C1C7C2602F"
```

### Implementation Notes

- **Exact order matters**: Changing order breaks signature verification
- **No separators**: Concatenate directly without spaces/commas/etc
- **String types**: Keep all components as strings (no type conversion)
- **Case sensitivity**: Follow PayHere's case requirements

### Edge Cases

```
Missing Fields:
├── Raise ValueError with clear message
├── Log which field is missing
└── Do not attempt partial signature

Amount Formatting:
├── Must match PayHere's format exactly
├── Always 2 decimal places
├── No thousand separators
└── Example: "5000.00" not "5,000.00" or "5000"

merchant_secret:
├── Load from secure configuration
├── Hash before including in components
├── Always uppercase the hash
└── Never log the secret itself
```

### Testing Strategy

- Test with valid webhook data
- Test with missing fields
- Test amount formatting (decimal places)
- Test with different order IDs
- Verify component order matches PayHere spec
- Compare generated signature with PayHere sandbox

---

## Task 57: Create Hash Comparison

### Overview
Implement timing-safe hash comparison using Python's hmac.compare_digest() function. This prevents timing attacks where an attacker could determine the correct signature by measuring comparison time.

### Dependencies
- Task 55: Create Signature Verification

### Instructions

1. **Import hmac module**
   - Import hmac from Python standard library
   - Used for compare_digest() function

2. **Create comparison wrapper function**
   - Create function named `compare_signatures`
   - Accept two parameters: signature1, signature2
   - Return boolean: True if equal, False if not

3. **Use hmac.compare_digest()**
   - Call hmac.compare_digest(signature1, signature2)
   - This prevents timing attacks
   - Returns True only if strings are identical

4. **Add type validation**
   - Ensure both signatures are strings
   - Convert to string if needed
   - Handle None values gracefully

5. **Add length check (optional optimization)**
   - If lengths differ, signatures can't match
   - Skip compare_digest() if lengths differ
   - Still timing-safe (length comparison is constant time)

6. **Integrate into signature verification**
   - Replace simple == comparison with compare_signatures()
   - Call in verify_payhere_signature() function
   - Compare received md5sig with computed signature

### Timing Attack Explanation

```
Insecure Comparison (==):
├── Compares byte-by-byte
├── Returns False on first mismatch
├── Time varies based on how many bytes match
└── Attacker can measure timing to guess signature

Secure Comparison (hmac.compare_digest):
├── Compares all bytes regardless of mismatches
├── Always takes same time
├── Time doesn't reveal how many bytes match
└── Prevents timing-based attacks
```

### Comparison Function Structure

```
def compare_signatures(sig1: str, sig2: str) -> bool:
    """
    Timing-safe signature comparison.
    Uses hmac.compare_digest to prevent timing attacks.
    """
    if not sig1 or not sig2:
        return False
    
    # Optional: Quick length check (timing-safe)
    if len(sig1) != len(sig2):
        return False
    
    # Timing-safe comparison
    return hmac.compare_digest(sig1, sig2)
```

### Usage in Signature Verification

```
# Extract received signature
received_sig = webhook_data.get('md5sig', '').upper()

# Compute expected signature
expected_sig = compute_expected_signature(webhook_data)

# Timing-safe comparison
if compare_signatures(received_sig, expected_sig):
    # Signature valid - continue processing
    return True
else:
    # Signature invalid - reject webhook
    raise SignatureVerificationError()
```

### Implementation Notes

- **Always use for security-critical comparisons**: Never use == for signatures
- **hmac.compare_digest is standard**: Available in Python 2.7.7+ and all Python 3.x
- **Constant time guarantee**: Comparison time doesn't leak information
- **Simple to implement**: Direct replacement for == operator

### Security Considerations

- Timing attacks are real and exploitable
- hmac.compare_digest is specifically designed for this use case
- Even millisecond differences can leak information
- Always use for password hashes, signatures, tokens

### Testing Strategy

- Test equal signatures return True
- Test different signatures return False
- Test None/empty string handling
- Test different length signatures
- Verify compare_digest is actually called (not ==)

---

## Task 58: Create Webhook Parser

### Overview
Parse POST data from PayHere webhook requests. Extract all relevant fields, validate data types, sanitize inputs, and structure data for processing. The parser handles all PayHere fields including payment details, customer information, and status codes.

### Dependencies
- Task 51: Create PayHere Webhook View

### Instructions

1. **Create parser function**
   - Create function named `parse_webhook_data`
   - Accept request parameter (HttpRequest)
   - Return dictionary with parsed and validated data

2. **Extract POST data**
   - Access request.POST dictionary
   - Extract all PayHere webhook fields
   - Handle missing fields with defaults or None

3. **Define required fields**
   - Create list of required PayHere fields
   - merchant_id, order_id, payment_id, payhere_amount
   - payhere_currency, status_code, md5sig
   - Validate all required fields are present

4. **Define optional fields**
   - Create list of optional PayHere fields
   - customer fields (first_name, last_name, email, phone)
   - card fields (card_holder_name, card_no_masked)
   - method, status_message, custom_1, custom_2
   - Extract if present, None if missing

5. **Parse and validate types**
   - Convert payhere_amount to Decimal
   - Convert status_code to integer
   - Keep order_id, payment_id as strings
   - Validate payhere_currency is "LKR"

6. **Sanitize string inputs**
   - Strip whitespace from all string fields
   - Validate email format if present
   - Validate phone format if present
   - Limit string lengths to reasonable values

7. **Build parsed data dictionary**
   - Structure data with clear keys
   - Separate payment data from customer data
   - Include metadata (received_at timestamp)
   - Return structured dictionary

8. **Add validation errors**
   - Raise ParseError for invalid data types
   - Raise ParseError for missing required fields
   - Include specific error messages
   - Log all parse errors

### PayHere Webhook Fields

```
Required Fields:
├── merchant_id (string)
├── order_id (string)
├── payment_id (string) - PayHere transaction ID
├── payhere_amount (decimal string) - e.g., "5000.00"
├── payhere_currency (string) - always "LKR"
├── status_code (integer) - 2, 0, -1, -2, -3, -4
└── md5sig (string) - signature for verification

Optional Fields:
├── payhere_id (string) - same as payment_id
├── method (string) - VISA, MASTER, AMEX, etc.
├── status_message (string) - human-readable status
├── card_holder_name (string)
├── card_no (string) - masked card number
├── first_name (string) - customer first name
├── last_name (string) - customer last name
├── email (string) - customer email
├── phone (string) - customer phone
├── address (string) - billing address
├── city (string) - billing city
├── country (string) - billing country
├── custom_1 (string) - your custom data
└── custom_2 (string) - your custom data
```

### Parsed Data Structure

```
{
    'payment': {
        'merchant_id': '1234567',
        'order_id': 'ORD-123',
        'payment_id': 'PH123456789',
        'amount': Decimal('5000.00'),
        'currency': 'LKR',
        'status_code': 2,
        'status_message': 'Success',
        'method': 'VISA'
    },
    'customer': {
        'first_name': 'John',
        'last_name': 'Doe',
        'email': 'john@example.com',
        'phone': '+94771234567',
        'address': '123 Main St',
        'city': 'Colombo',
        'country': 'Sri Lanka'
    },
    'card': {
        'holder_name': 'JOHN DOE',
        'masked_number': '************1234'
    },
    'custom': {
        'custom_1': 'tenant_id:123',
        'custom_2': 'user_id:456'
    },
    'security': {
        'signature': 'ABC123...',
        'ip_address': '123.45.67.89'
    },
    'metadata': {
        'received_at': datetime.now(),
        'raw_data': {...}  # Full POST data for debugging
    }
}
```

### Data Validation Rules

```
payhere_amount:
├── Must be valid decimal
├── Must be positive
├── Two decimal places
└── Example: "5000.00" → Decimal('5000.00')

status_code:
├── Must be integer
├── Valid values: 2, 0, -1, -2, -3, -4
└── Example: "2" → 2

payhere_currency:
├── Must be "LKR"
├── Case-insensitive check
└── Raise error if not LKR

email:
├── Optional but validate format if present
├── Basic regex or Django's EmailValidator
└── Example: "user@example.com"

phone:
├── Optional but sanitize if present
├── Remove spaces/dashes
├── Validate starts with + or digits
└── Example: "+94771234567"

strings:
├── Strip leading/trailing whitespace
├── Limit length (e.g., 255 chars)
├── Remove null bytes
└── Escape HTML if displaying
```

### Implementation Notes

- **Store raw data**: Keep full POST data for debugging/audit
- **Validate early**: Catch parsing errors before processing
- **Type safety**: Convert types explicitly (don't trust POST data)
- **Sanitization**: Clean all inputs to prevent injection attacks

### Error Handling

```
Missing Required Field:
├── Raise ParseError
├── Specify which field is missing
├── Log error with full POST data
└── Return 200 OK (don't retry)

Invalid Data Type:
├── Raise ParseError
├── Specify field and expected type
├── Log error with problematic value
└── Return 200 OK

Invalid Amount:
├── Raise ParseError if not decimal
├── Raise ParseError if negative
├── Log error
└── Return 200 OK

Invalid Status Code:
├── Log warning if unknown code
├── Don't reject (PayHere may add new codes)
├── Map to UNKNOWN status
└── Continue processing
```

### Testing Strategy

- Test with complete PayHere webhook data
- Test with missing optional fields
- Test with missing required fields
- Test with invalid data types
- Test amount parsing (decimals, formatting)
- Test status code validation
- Test email/phone validation
- Test with malformed data
- Use actual PayHere sandbox webhooks

---

## Summary

This document covered the webhook endpoint foundation:

### Completed Components
- **Task 51**: Webhook view with proper error handling and logging
- **Task 52**: URL configuration for webhook endpoint
- **Task 53**: CSRF exemption for external POST requests
- **Task 54**: IP whitelisting for PayHere servers
- **Task 55**: MD5 signature verification for security
- **Task 56**: Signature components builder following PayHere spec
- **Task 57**: Timing-safe hash comparison
- **Task 58**: Comprehensive POST data parser

### Security Layers

```
Webhook Security Stack:
├── 1. IP Whitelist (Task 54)
├── 2. Signature Verification (Task 55-57)
├── 3. Data Validation (Task 58)
└── 4. Idempotent Processing (Next document)
```

### Next Steps

The next document will cover:
- Status code mapping (Task 59)
- Status-specific handlers (Tasks 60-63)
- Order and transaction updates (Tasks 64-65)
- Webhook processing verification (Task 66)

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **→ Next Document:** [02_Tasks-59-66_Handlers-Update-Verify.md](02_Tasks-59-66_Handlers-Update-Verify.md)
