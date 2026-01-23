# Tasks 60-64: Email Receipt System

> **Phase:** 05 - ERP Core Modules Part 2  
> **SubPhase:** 03 - Receipt Generation  
> **Group:** D - PDF & Email Receipts  
> **Document:** 02 of 03  
> **Tasks Covered:** 60, 61, 62, 63, 64

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [01_Tasks-53-59_PDF-Generation.md](01_Tasks-53-59_PDF-Generation.md)
- **→ Next Document:** [03_Tasks-65-68_Verification-Sharing-Prefs.md](03_Tasks-65-68_Verification-Sharing-Prefs.md)

---

## Document Overview

This document covers the implementation of email receipt functionality. It includes creating responsive HTML email templates, implementing email styling that works across email clients, building an email sending service, adding PDF attachment capabilities, and creating a web-based receipt lookup page.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 60 | Create email receipt template | Medium | 30 min |
| 61 | Add email styling | Medium | 25 min |
| 62 | Implement email sending service | Medium | 25 min |
| 63 | Add PDF attachment option | Medium | 20 min |
| 64 | Create receipt lookup page | Medium | 30 min |

---

## Task 60: Create Email Receipt Template

### Overview
Design and implement a responsive HTML email template for receipts that works across all major email clients. The template should be professional, mobile-friendly, and contain all essential transaction information.

### Dependencies
- Task 53: PDF receipt template (for structure reference)
- Email infrastructure: Django email configuration
- Tenant branding: Branding settings available

### Instructions

1. **Create email templates directory**
   - Create directory: `apps/pos/receipts/templates/receipts/email/`
   - Organize templates by type (receipt, notification, etc.)
   - Establish naming convention

2. **Create base email template**
   - Create file: `receipt_email.html`
   - Use table-based layout (email client compatibility)
   - Maximum width: 600px for optimal rendering
   - Responsive design for mobile devices

3. **Design email header section**
   - Tenant logo (centered or left-aligned)
   - Business name in prominent font
   - Subject line: "Your Receipt from [Business Name]"
   - Preview text (shows in email preview)

4. **Create greeting section**
   - Personalized greeting: "Hi [Customer Name],"
   - If no name: "Hello,"
   - Thank you message
   - Brief transaction summary

5. **Design transaction summary card**
   - Receipt number with label
   - Transaction date and time
   - Store location (if applicable)
   - Total amount (large, prominent)
   - Visual card with border or background color

6. **Create itemized purchase section**
   - Section title: "Purchase Details" or "Your Items"
   - Table layout for items
   - Columns: Item, Qty, Price
   - Clean, simple styling
   - Subtotal at bottom

7. **Design individual item rows**
   - Item name (bold or emphasized)
   - Quantity with unit indicator
   - Unit price formatted
   - Line total aligned right
   - Item modifiers or notes (if any)

8. **Add discount and promotion section**
   - Show applied discounts
   - Display coupon codes used
   - Highlight savings amount
   - Use accent color for emphasis

9. **Create financial breakdown section**
   - Subtotal before discounts and tax
   - Discounts applied
   - Tax breakdown (VAT rate and amount)
   - Final total (prominent, large font)
   - Payment method used

10. **Design call-to-action buttons**
    - "View Online Receipt" button (links to lookup page)
    - "Download PDF" button (if applicable)
    - "Contact Support" button
    - Use tenant accent color
    - Mobile-friendly button sizes (min 44px height)

11. **Add footer section**
    - Return policy summary
    - Customer support contact
    - Business address
    - Social media links
    - Unsubscribe link (required)

12. **Implement conditional sections**
    - Show customer loyalty points if applicable
    - Display shipping info if delivery order
    - Show special instructions or notes
    - Conditional promotional messages

13. **Add email metadata**
    - Plain text version (fallback)
    - Preheader text (appears in preview)
    - Email title tag
    - Open graph tags (for sharing)

14. **Ensure accessibility**
    - Alt text for all images
    - Semantic HTML structure
    - Sufficient color contrast
    - Readable font sizes (min 14px)

### Email Template Structure Diagram

```
┌─────────────────────────────────────────┐
│         Email Header (600px max)        │
├─────────────────────────────────────────┤
│ [LOGO]        BUSINESS NAME             │
├─────────────────────────────────────────┤
│                                         │
│ Hi Kasun,                              │
│                                         │
│ Thank you for your purchase!           │
│                                         │
├─────────────────────────────────────────┤
│ ┌─────────────────────────────────────┐│
│ │   TRANSACTION SUMMARY               ││
│ │                                     ││
│ │   Receipt: RC-2026-001234          ││
│ │   Date: Jan 23, 2026 at 2:35 PM   ││
│ │   Store: Main Street Branch        ││
│ │                                     ││
│ │   Total: Rs. 1,088.64             ││
│ └─────────────────────────────────────┘│
├─────────────────────────────────────────┤
│                                         │
│   YOUR PURCHASES                        │
│   ───────────────────────────────────  │
│   Item              Qty       Price     │
│   Tea 100g           2     Rs. 900.00  │
│   Sugar 1kg          1     Rs. 180.00  │
│   ───────────────────────────────────  │
│   Subtotal:              Rs. 1,080.00  │
│   Discount (10%):         Rs. -108.00  │
│   Tax (12%):              Rs. 116.64   │
│   ═══════════════════════════════════  │
│   Total:                Rs. 1,088.64   │
│                                         │
│   Payment: Cash                         │
├─────────────────────────────────────────┤
│                                         │
│  [View Online Receipt] [Download PDF]  │
│                                         │
├─────────────────────────────────────────┤
│   NEED HELP?                           │
│   Contact: support@store.com           │
│   Phone: +94 11 234 5678              │
│                                         │
│   Returns within 7 days with receipt   │
├─────────────────────────────────────────┤
│   My Store Pvt Ltd                     │
│   123 Main St, Colombo 00100          │
│   [Facebook] [Instagram] [WhatsApp]    │
│                                         │
│   Unsubscribe from receipts            │
└─────────────────────────────────────────┘
```

### Email Client Compatibility Considerations

| Email Client | Market Share | Special Considerations |
|--------------|--------------|------------------------|
| **Gmail** | ~30% | Good CSS support, clips after 102KB |
| **Apple Mail** | ~25% | Excellent CSS support |
| **Outlook** | ~20% | Limited CSS, uses Word rendering engine |
| **Yahoo Mail** | ~10% | Moderate CSS support |
| **Mobile Clients** | ~50% | Responsive design critical |

### Email Template Best Practices

| Practice | Reason | Implementation |
|----------|--------|----------------|
| **Table-based layout** | Universal support | Use `<table>` instead of `<div>` |
| **Inline CSS** | Email clients strip `<style>` | All styles inline |
| **Max width 600px** | Optimal rendering | Container table max-width |
| **Alt text for images** | Accessibility, images off | All `<img>` tags have alt |
| **Plain text version** | Fallback, accessibility | Create text-only version |
| **Mobile-first** | 50%+ mobile opens | Responsive tables |
| **Web-safe fonts** | Consistent rendering | Arial, Helvetica, Georgia |

### Preheader Text Strategy

The preheader is the text snippet that appears after the subject line in email clients:

```
Subject: Your Receipt from My Store
Preheader: Receipt #RC-2026-001234 | Total: Rs. 1,088.64 | Thank you for shopping with us!
```

- Keep under 100 characters
- Include key info (receipt number, amount)
- Don't repeat subject line
- Make it actionable or informative

### Plain Text Version Structure

Always include a plain text version as fallback:

```
YOUR RECEIPT FROM MY STORE
===========================

Hi Kasun,

Thank you for your purchase!

TRANSACTION SUMMARY
-------------------
Receipt: RC-2026-001234
Date: Jan 23, 2026 at 2:35 PM
Total: Rs. 1,088.64

YOUR PURCHASES
--------------
Tea 100g        x2    Rs. 900.00
Sugar 1kg       x1    Rs. 180.00
                    -----------
Subtotal:           Rs. 1,080.00
Discount (10%):       Rs. -108.00
Tax (12%):            Rs. 116.64
                    ===========
Total:              Rs. 1,088.64

Payment: Cash

VIEW ONLINE RECEIPT
https://mystore.lcc.app/receipt/abc123xyz

NEED HELP?
Contact: support@store.com
Phone: +94 11 234 5678

Returns within 7 days with receipt.

---
My Store Pvt Ltd
123 Main St, Colombo 00100
```

### Expected Outcome
```
apps/pos/receipts/
└── templates/
    └── receipts/
        └── email/
            ├── receipt_email.html        # HTML email template
            └── receipt_email.txt         # Plain text version
```

### Verification Checklist
- [ ] Email templates directory is created
- [ ] Base email template file exists
- [ ] Table-based layout is used (not div-based)
- [ ] Maximum width is 600px
- [ ] Email header with logo and business name exists
- [ ] Greeting section is personalized
- [ ] Transaction summary card is prominent
- [ ] Itemized purchase section displays all items
- [ ] Item rows show name, quantity, price
- [ ] Discount and promotion section is included
- [ ] Financial breakdown is clear and accurate
- [ ] Call-to-action buttons are mobile-friendly
- [ ] Footer section includes required information
- [ ] Conditional sections work correctly
- [ ] Plain text version is provided
- [ ] Preheader text is implemented
- [ ] Alt text is added to all images
- [ ] Accessibility standards are met

---

## Task 61: Add Email Styling

### Overview
Implement comprehensive CSS styling for email templates that ensures consistent appearance across all major email clients while maintaining responsiveness for mobile devices.

### Dependencies
- Task 60: Email receipt template is created
- Task 54: Tenant branding settings are available

### Instructions

1. **Understand email CSS limitations**
   - Email clients strip `<style>` tags
   - External stylesheets not supported
   - Limited CSS property support
   - Must use inline styles

2. **Create base email styles**
   - Define color palette (primary, secondary, accent)
   - Set font families (web-safe fonts)
   - Establish font sizes and line heights
   - Define spacing standards (padding, margins)

3. **Implement table-based structure**
   - Use nested tables for layout
   - Set table width="100%" for responsiveness
   - Add cellpadding and cellspacing attributes
   - Use table alignment for centering

4. **Style container table**
   - Max width: 600px
   - Center alignment: margin: 0 auto
   - Background color: Light gray (#f4f4f4)
   - Padding around content

5. **Style content table**
   - Width: 100%
   - Background color: White (#ffffff)
   - Border radius: 8px (where supported)
   - Box shadow for depth (where supported)

6. **Design header styling**
   - Background color: Tenant primary color
   - Padding: 20px
   - Text color: White or contrasting color
   - Logo max height: 60px
   - Logo display: block, centered

7. **Style greeting section**
   - Font size: 16px
   - Line height: 1.5
   - Color: Dark gray (#333333)
   - Padding: 20px

8. **Design transaction summary card**
   - Background color: Light blue or tenant accent
   - Border: 2px solid tenant primary color
   - Border radius: 8px
   - Padding: 20px
   - Font size: 14px
   - Total amount: 24px, bold, accent color

9. **Style items table**
   - Width: 100%
   - Border collapse: collapse
   - Header background: Light gray
   - Alternating row colors (zebra striping)
   - Border bottom: 1px solid #ddd

10. **Design item row styling**
    - Padding: 10px
    - Font size: 14px
    - Item name: Bold
    - Prices: Right-aligned
    - Hover effect: Slight background change

11. **Style totals section**
    - Right-aligned
    - Font size: 14px
    - Bold labels
    - Separator line before total
    - Total row: Larger font (18px), bold

12. **Design call-to-action buttons**
    - Background color: Tenant accent color
    - Text color: White
    - Padding: 12px 24px
    - Border radius: 4px
    - Text decoration: None
    - Display: inline-block
    - Font weight: Bold
    - Min height: 44px (mobile tap target)

13. **Style footer section**
    - Background color: Light gray (#f9f9f9)
    - Padding: 20px
    - Font size: 12px
    - Color: Gray (#666666)
    - Text align: Center

14. **Implement responsive design**
    - Use media queries (where supported)
    - Percentage-based widths
    - Stack elements on mobile
    - Increase font sizes on mobile
    - Larger tap targets for buttons

15. **Add brand color integration**
    - Inject tenant colors into inline styles
    - Use Django template variables for colors
    - Apply primary color to header
    - Use accent color for buttons and highlights
    - Secondary color for footer

16. **Create button hover states**
    - Darken background on hover (where supported)
    - Add subtle transition
    - Change cursor to pointer
    - Maintain accessibility

17. **Ensure dark mode support**
    - Use CSS media query: @media (prefers-color-scheme: dark)
    - Provide light text on dark backgrounds
    - Adjust colors for visibility
    - Test in dark mode email clients

### Inline CSS Example

```html
<!-- Container Table -->
<table width="100%" border="0" cellpadding="0" cellspacing="0" 
       style="background-color: #f4f4f4; padding: 20px 0;">
    <tr>
        <td align="center">
            
            <!-- Content Table (Max 600px) -->
            <table width="600" border="0" cellpadding="0" cellspacing="0" 
                   style="background-color: #ffffff; border-radius: 8px; 
                          box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                
                <!-- Header -->
                <tr>
                    <td style="background-color: {{ primary_color }}; 
                               padding: 20px; text-align: center;">
                        <img src="{{ logo_url }}" alt="{{ business_name }}" 
                             style="max-height: 60px; display: block; margin: 0 auto;">
                        <h1 style="color: #ffffff; font-size: 24px; 
                                   margin: 10px 0 0 0; font-family: Arial, sans-serif;">
                            {{ business_name }}
                        </h1>
                    </td>
                </tr>
                
                <!-- Greeting -->
                <tr>
                    <td style="padding: 20px; font-size: 16px; 
                               line-height: 1.5; color: #333333; 
                               font-family: Arial, sans-serif;">
                        Hi {{ customer_name }},<br><br>
                        Thank you for your purchase!
                    </td>
                </tr>
                
                <!-- Transaction Summary Card -->
                <tr>
                    <td style="padding: 0 20px 20px 20px;">
                        <table width="100%" border="0" cellpadding="15" cellspacing="0" 
                               style="background-color: #f0f9ff; 
                                      border: 2px solid {{ primary_color }}; 
                                      border-radius: 8px;">
                            <tr>
                                <td style="font-size: 14px; color: #333333; 
                                           font-family: Arial, sans-serif;">
                                    <strong>Receipt:</strong> {{ receipt_number }}<br>
                                    <strong>Date:</strong> {{ transaction_date }}<br>
                                    <strong>Total:</strong> 
                                    <span style="font-size: 24px; font-weight: bold; 
                                                 color: {{ accent_color }};">
                                        Rs. {{ total_amount }}
                                    </span>
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>
                
                <!-- Items Table -->
                <tr>
                    <td style="padding: 0 20px 20px 20px;">
                        <h2 style="font-size: 18px; margin: 0 0 10px 0; 
                                   font-family: Arial, sans-serif;">
                            Your Purchases
                        </h2>
                        <table width="100%" border="0" cellpadding="8" cellspacing="0" 
                               style="border-collapse: collapse;">
                            <tr style="background-color: #f5f5f5;">
                                <th style="text-align: left; padding: 10px; 
                                           font-size: 14px; font-family: Arial, sans-serif;">
                                    Item
                                </th>
                                <th style="text-align: center; padding: 10px; 
                                           font-size: 14px; font-family: Arial, sans-serif;">
                                    Qty
                                </th>
                                <th style="text-align: right; padding: 10px; 
                                           font-size: 14px; font-family: Arial, sans-serif;">
                                    Price
                                </th>
                            </tr>
                            {% for item in items %}
                            <tr style="border-bottom: 1px solid #dddddd;">
                                <td style="padding: 10px; font-size: 14px; 
                                           font-family: Arial, sans-serif;">
                                    <strong>{{ item.name }}</strong>
                                </td>
                                <td style="padding: 10px; font-size: 14px; 
                                           text-align: center; font-family: Arial, sans-serif;">
                                    {{ item.quantity }}
                                </td>
                                <td style="padding: 10px; font-size: 14px; 
                                           text-align: right; font-family: Arial, sans-serif;">
                                    Rs. {{ item.total }}
                                </td>
                            </tr>
                            {% endfor %}
                        </table>
                    </td>
                </tr>
                
                <!-- CTA Button -->
                <tr>
                    <td style="padding: 0 20px 20px 20px; text-align: center;">
                        <a href="{{ receipt_url }}" 
                           style="display: inline-block; 
                                  background-color: {{ accent_color }}; 
                                  color: #ffffff; 
                                  text-decoration: none; 
                                  padding: 12px 24px; 
                                  border-radius: 4px; 
                                  font-size: 16px; 
                                  font-weight: bold; 
                                  font-family: Arial, sans-serif;">
                            View Online Receipt
                        </a>
                    </td>
                </tr>
                
                <!-- Footer -->
                <tr>
                    <td style="background-color: #f9f9f9; 
                               padding: 20px; 
                               text-align: center; 
                               font-size: 12px; 
                               color: #666666; 
                               font-family: Arial, sans-serif;">
                        {{ business_name }}<br>
                        {{ business_address }}<br>
                        <a href="{{ unsubscribe_url }}" 
                           style="color: #666666; text-decoration: underline;">
                            Unsubscribe
                        </a>
                    </td>
                </tr>
                
            </table>
        </td>
    </tr>
</table>
```

### Responsive Media Query

```html
<style type="text/css">
    /* These may be stripped by some email clients */
    @media screen and (max-width: 600px) {
        .container {
            width: 100% !important;
        }
        .content-table {
            width: 100% !important;
        }
        .mobile-full-width {
            width: 100% !important;
        }
        .mobile-padding {
            padding: 10px !important;
        }
        .mobile-font-size {
            font-size: 14px !important;
        }
    }
    
    /* Dark mode support */
    @media (prefers-color-scheme: dark) {
        .content-table {
            background-color: #1a1a1a !important;
        }
        .text-dark {
            color: #e0e0e0 !important;
        }
    }
</style>
```

### Web-Safe Font Stack

| Font Type | Font Stack |
|-----------|------------|
| **Sans-serif** | Arial, Helvetica, sans-serif |
| **Serif** | Georgia, Times New Roman, serif |
| **Monospace** | Courier New, Courier, monospace |

### Color Contrast Guidelines

| Element | Foreground | Background | Contrast Ratio |
|---------|------------|------------|----------------|
| Body text | #333333 | #ffffff | 12.6:1 (AAA) |
| Light text | #666666 | #ffffff | 5.7:1 (AA) |
| Button text | #ffffff | #2563EB | 8.6:1 (AAA) |
| Link text | #2563EB | #ffffff | 8.6:1 (AAA) |

### Expected Outcome
```
apps/pos/receipts/
└── templates/
    └── receipts/
        └── email/
            ├── receipt_email.html        # Updated with inline styles
            └── receipt_email.txt         # Plain text (no styling)
```

### Verification Checklist
- [ ] Email CSS limitations are understood and addressed
- [ ] Base email styles are defined
- [ ] Table-based structure is implemented
- [ ] Container table is styled with max width 600px
- [ ] Content table has white background and proper spacing
- [ ] Header styling uses tenant branding colors
- [ ] Greeting section has appropriate typography
- [ ] Transaction summary card is visually distinct
- [ ] Items table has proper borders and alignment
- [ ] Item rows are styled with consistent spacing
- [ ] Totals section is right-aligned and prominent
- [ ] Call-to-action buttons meet minimum size requirements
- [ ] Footer section has subdued styling
- [ ] Responsive design works on mobile devices
- [ ] Tenant brand colors are integrated
- [ ] Button hover states are implemented (where supported)
- [ ] Dark mode support is added
- [ ] All styles are inline (no external stylesheets)

---

## Task 62: Implement Email Sending Service

### Overview
Create a robust email sending service that handles receipt email delivery, manages email queue, implements retry logic, tracks delivery status, and integrates with Django's email backend.

### Dependencies
- Task 60: Email receipt template exists
- Task 61: Email styling is implemented
- Django email configuration: SMTP settings configured
- Receipt model: Email tracking fields

### Instructions

1. **Configure Django email settings**
   - Set up SMTP backend in settings
   - Configure email host, port, credentials
   - Set default from email address
   - Configure email timeout settings

2. **Create email service class**
   - Create file: `apps/pos/receipts/services/email_service.py`
   - Define `EmailReceiptService` class
   - Initialize with receipt instance
   - Set up email backend connection

3. **Implement email context builder**
   - Method to collect all email template data
   - Extract receipt information
   - Format currency and dates
   - Include tenant branding
   - Build items list
   - Add customer information

4. **Create template renderer method**
   - Render HTML email template with context
   - Render plain text email template
   - Handle template errors gracefully
   - Return both HTML and plain text versions

5. **Implement email composer method**
   - Create Django EmailMultiAlternatives object
   - Set subject line (dynamic with receipt number)
   - Set from address (tenant email or default)
   - Set recipient address (customer email)
   - Attach HTML version
   - Set plain text version as default
   - Add email headers

6. **Add email validation**
   - Validate recipient email address format
   - Check for bounced email addresses
   - Verify customer has opted in to email receipts
   - Handle invalid email addresses gracefully

7. **Implement send method**
   - Send email using Django email backend
   - Handle send failures with try/except
   - Log successful sends
   - Log failed sends with error details
   - Return send status (success/failure)

8. **Add retry logic**
   - Implement exponential backoff for retries
   - Retry up to 3 times on transient failures
   - Delay between retries (1s, 5s, 15s)
   - Give up after max retries
   - Log retry attempts

9. **Create batch email sending**
   - Method to send multiple receipt emails
   - Process emails in batches (e.g., 100 at a time)
   - Rate limiting to avoid SMTP throttling
   - Return summary of sent/failed emails

10. **Implement email tracking**
    - Update receipt model with email sent status
    - Record email sent timestamp
    - Track number of email send attempts
    - Store last email error (if failed)

11. **Add email queue integration**
    - Use Celery for async email sending
    - Create task: `send_receipt_email_task`
    - Queue email sends for background processing
    - Handle task failures and retries

12. **Create email delivery status**
    - Track: Queued, Sending, Sent, Failed, Bounced
    - Update status in receipt model
    - Provide status query methods
    - Alert on repeated failures

13. **Implement bounce handling**
    - Process bounce notifications (if available)
    - Mark email addresses as bounced
    - Prevent sending to bounced addresses
    - Log bounce reasons

14. **Add email preview functionality**
    - Method to generate email preview
    - Return HTML email without sending
    - Useful for testing and admin preview
    - Admin interface integration

15. **Create email resend method**
    - Allow manual resending of receipt emails
    - Check if already sent successfully
    - Confirm before resending
    - Log resend attempts

### Email Service Class Structure

```python
class EmailReceiptService:
    """
    Service for sending receipt emails to customers.
    """
    
    def __init__(self, receipt=None):
        """Initialize with optional receipt instance."""
        self.receipt = receipt
    
    def send_email(self, recipient_email=None):
        """
        Send receipt email to customer.
        Returns (success, message) tuple.
        """
        pass
    
    def build_context(self, receipt):
        """
        Build email template context.
        Returns dictionary with all template variables.
        """
        pass
    
    def render_template(self, template_name, context):
        """
        Render email template (HTML and text).
        Returns (html, text) tuple.
        """
        pass
    
    def compose_email(self, recipient, html_content, text_content):
        """
        Compose EmailMultiAlternatives object.
        Returns email message object.
        """
        pass
    
    def validate_email(self, email):
        """
        Validate email address.
        Returns True if valid.
        """
        pass
    
    def send_with_retry(self, email_message, max_retries=3):
        """
        Send email with retry logic.
        Returns (success, error_message) tuple.
        """
        pass
    
    def update_tracking(self, receipt, status, error=None):
        """
        Update email tracking in receipt model.
        """
        pass
    
    def generate_preview(self):
        """
        Generate email preview without sending.
        Returns HTML string.
        """
        pass
```

### Email Sending Workflow

```
[Trigger: Receipt Created/Manual Send]
         │
         ▼
[Validate Customer Email]
         │
    ┌────┴────┐
    │ Valid?  │
    └────┬────┘
         │ Yes
         ▼
[Build Email Context]
  ├─ Receipt data
  ├─ Customer info
  ├─ Tenant branding
  └─ Items list
         │
         ▼
[Render Email Templates]
  ├─ HTML version
  └─ Plain text version
         │
         ▼
[Compose Email Message]
  ├─ Set subject
  ├─ Set from/to
  ├─ Attach HTML
  └─ Set text fallback
         │
         ▼
[Queue Email Send (Celery)]
         │
         ▼
[Attempt Send via SMTP]
         │
    ┌────┴────┐
    │Success? │
    └────┬────┘
         │ No
         ▼
    [Retry Logic]
      (Max 3 times)
         │
    ┌────┴────┐
    │Success? │
    └────┬────┘
         │ Yes
         ▼
[Update Tracking: Sent]
         │
         ▼
[Log Success]
```

### Email Subject Line Template

```python
def get_subject_line(receipt):
    """Generate email subject line."""
    return f"Your Receipt from {receipt.tenant.business_name} - {receipt.receipt_number}"
```

### Django Email Configuration

```python
# settings.py

# Email backend
EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'

# SMTP settings
EMAIL_HOST = 'smtp.gmail.com'  # or other SMTP server
EMAIL_PORT = 587
EMAIL_USE_TLS = True
EMAIL_HOST_USER = 'noreply@mystore.lk'
EMAIL_HOST_PASSWORD = 'app-specific-password'

# Default from email
DEFAULT_FROM_EMAIL = 'My Store <noreply@mystore.lk>'
SERVER_EMAIL = 'server@mystore.lk'

# Email timeout
EMAIL_TIMEOUT = 30  # seconds
```

### Celery Task for Async Sending

```python
# apps/pos/receipts/tasks.py

from celery import shared_task
from apps.pos.receipts.services.email_service import EmailReceiptService

@shared_task(bind=True, max_retries=3)
def send_receipt_email_task(self, receipt_id, recipient_email=None):
    """
    Celery task to send receipt email asynchronously.
    """
    try:
        receipt = Receipt.objects.get(id=receipt_id)
        service = EmailReceiptService(receipt)
        success, message = service.send_email(recipient_email)
        
        if not success:
            # Retry with exponential backoff
            raise self.retry(exc=Exception(message), countdown=2 ** self.request.retries)
        
        return {'success': True, 'message': message}
    
    except Receipt.DoesNotExist:
        return {'success': False, 'message': 'Receipt not found'}
    
    except Exception as exc:
        # Max retries reached
        return {'success': False, 'message': str(exc)}
```

### Email Tracking Fields in Receipt Model

```python
# Add to Receipt model

email_sent = models.BooleanField(default=False)
email_sent_at = models.DateTimeField(null=True, blank=True)
email_recipient = models.EmailField(blank=True)
email_attempts = models.IntegerField(default=0)
email_last_error = models.TextField(blank=True)
email_status = models.CharField(
    max_length=20,
    choices=[
        ('pending', 'Pending'),
        ('queued', 'Queued'),
        ('sending', 'Sending'),
        ('sent', 'Sent'),
        ('failed', 'Failed'),
        ('bounced', 'Bounced'),
    ],
    default='pending'
)
```

### Retry Strategy

| Attempt | Delay | Total Wait Time |
|---------|-------|-----------------|
| 1 | Immediate | 0s |
| 2 | 2s | 2s |
| 3 | 4s | 6s |
| 4 (final) | 8s | 14s |

### Expected Outcome
```
apps/pos/receipts/
├── services/
│   └── email_service.py              # Email sending service
└── tasks.py                          # Celery tasks

apps/pos/receipts/models/
└── receipt.py                        # Updated with email tracking fields
```

### Verification Checklist
- [ ] Django email settings are configured
- [ ] Email service class is created
- [ ] Email context builder collects all required data
- [ ] Template renderer generates HTML and plain text
- [ ] Email composer creates proper Django email object
- [ ] Email validation prevents invalid sends
- [ ] Send method handles errors gracefully
- [ ] Retry logic implements exponential backoff
- [ ] Batch email sending is efficient
- [ ] Email tracking updates receipt model
- [ ] Email queue uses Celery for async processing
- [ ] Email delivery status is tracked
- [ ] Bounce handling marks problematic addresses
- [ ] Email preview functionality exists
- [ ] Email resend method is implemented
- [ ] All email operations are logged

---

## Task 63: Add PDF Attachment Option

### Overview
Implement the capability to attach PDF receipts to email messages, allowing customers to receive both an HTML email and a downloadable PDF version of their receipt.

### Dependencies
- Task 55: PDF generator service is functional
- Task 62: Email sending service is implemented
- Task 59: PDF storage is configured

### Instructions

1. **Add PDF attachment setting**
   - Add tenant setting: `attach_pdf_to_email` (boolean)
   - Default value: True (most customers want PDF)
   - Allow per-receipt override
   - Admin interface to toggle setting

2. **Extend email service with PDF support**
   - Add method: `attach_pdf(email_message, receipt)`
   - Generate PDF if not already generated
   - Retrieve PDF from storage if exists
   - Attach PDF to email message object

3. **Implement conditional PDF generation**
   - Check if PDF exists in storage
   - Generate PDF only if needed
   - Use cached PDF if available
   - Skip generation if attachment disabled

4. **Generate PDF for attachment**
   - Use PDF generator service
   - Select PDF style (A4 invoice recommended for email)
   - Generate PDF bytes
   - Return PDF content

5. **Attach PDF to email**
   - Use Django's `EmailMessage.attach()` method
   - Set attachment filename: `receipt_{number}.pdf`
   - Set MIME type: `application/pdf`
   - Add PDF bytes as attachment

6. **Implement attachment size check**
   - Check PDF file size
   - Warn if larger than 5MB (most email servers limit)
   - Consider compression for large PDFs
   - Skip attachment if too large, log warning

7. **Add inline vs. attachment choice**
   - Support `Content-Disposition: inline` for viewing in email
   - Support `Content-Disposition: attachment` for downloading
   - Default: attachment (better compatibility)
   - Make configurable per tenant

8. **Create attachment preview**
   - Admin interface to preview email with attachment
   - Show attachment size
   - Validate attachment is valid PDF
   - Test download from preview

9. **Implement fallback for PDF generation failure**
   - If PDF generation fails, still send email
   - Include message in email about PDF unavailability
   - Provide link to view/download PDF online
   - Log PDF generation error

10. **Add attachment tracking**
    - Track whether PDF was attached
    - Record attachment size
    - Log attachment errors
    - Store in receipt model

11. **Optimize for multiple recipients**
    - Generate PDF once, attach to multiple emails
    - Cache PDF bytes to avoid repeated generation
    - Efficient for batch email sends

12. **Create customer preference support**
    - Allow customers to opt out of PDF attachments
    - Store preference in customer model
    - Respect preference in email service
    - Reduce email size for customers who don't want PDFs

13. **Implement attachment security**
    - Ensure PDF contains no sensitive data beyond receipt
    - Don't attach if customer email is unverified
    - Log all attachment sends for audit
    - Consider encryption for sensitive information

### PDF Attachment Integration

```python
class EmailReceiptService:
    """Extended with PDF attachment support."""
    
    def send_email(self, recipient_email=None, attach_pdf=None):
        """
        Send receipt email with optional PDF attachment.
        
        Args:
            recipient_email: Recipient email address
            attach_pdf: Whether to attach PDF (overrides tenant setting)
        
        Returns:
            (success, message) tuple
        """
        # Determine if PDF should be attached
        should_attach_pdf = attach_pdf if attach_pdf is not None else self.receipt.tenant.attach_pdf_to_email
        
        # Compose email
        email_message = self.compose_email(recipient_email, html, text)
        
        # Attach PDF if enabled
        if should_attach_pdf:
            try:
                self.attach_pdf(email_message, self.receipt)
            except Exception as e:
                # Log error but still send email
                logger.error(f"Failed to attach PDF: {e}")
        
        # Send email
        return self.send_with_retry(email_message)
    
    def attach_pdf(self, email_message, receipt):
        """
        Attach PDF receipt to email message.
        
        Args:
            email_message: Django EmailMessage object
            receipt: Receipt instance
        """
        # Check if PDF exists in storage
        pdf_storage = PDFStorageService()
        
        if pdf_storage.pdf_exists(receipt):
            # Retrieve existing PDF
            pdf_bytes = pdf_storage.retrieve_pdf(receipt)
        else:
            # Generate new PDF
            pdf_generator = PDFGeneratorService()
            pdf_bytes = pdf_generator.generate_pdf(receipt, style='a4_invoice')
            
            # Save to storage for future use
            pdf_storage.save_pdf(pdf_bytes, receipt)
        
        # Check size
        pdf_size_mb = len(pdf_bytes) / (1024 * 1024)
        if pdf_size_mb > 5:
            logger.warning(f"PDF size {pdf_size_mb:.2f}MB exceeds 5MB limit")
            # Consider skipping attachment or compressing
        
        # Attach to email
        filename = f"receipt_{receipt.receipt_number}.pdf"
        email_message.attach(
            filename=filename,
            content=pdf_bytes,
            mimetype='application/pdf'
        )
        
        # Track attachment
        receipt.pdf_attached_to_email = True
        receipt.pdf_attachment_size = len(pdf_bytes)
        receipt.save(update_fields=['pdf_attached_to_email', 'pdf_attachment_size'])
```

### Email with PDF Attachment Flow

```
[Send Email Triggered]
         │
         ▼
[Check: Attach PDF?]
  (Tenant setting or override)
         │
    ┌────┴────┐
    │  Yes?   │
    └────┬────┘
         │ Yes
         ▼
[Check: PDF Exists?]
         │
    ┌────┴────┐
    │Exists?  │
    └────┬────┘
         │ No
         ▼
[Generate PDF]
  (A4 invoice style)
         │
         ▼
[Check PDF Size]
         │
    ┌────┴────┐
    │< 5MB?   │
    └────┬────┘
         │ Yes
         ▼
[Attach to Email]
         │
         ▼
[Send Email with Attachment]
         │
         ▼
[Track Attachment in DB]
```

### Attachment Configuration

```python
# Tenant model or settings

class TenantSettings(models.Model):
    """Tenant-specific settings."""
    
    # Email receipt settings
    attach_pdf_to_email = models.BooleanField(
        default=True,
        help_text="Attach PDF receipt to email"
    )
    
    pdf_attachment_style = models.CharField(
        max_length=20,
        choices=[
            ('a4_invoice', 'A4 Invoice Style'),
            ('thermal', 'Thermal Style'),
        ],
        default='a4_invoice',
        help_text="PDF style for email attachments"
    )
    
    max_attachment_size_mb = models.IntegerField(
        default=5,
        help_text="Maximum PDF attachment size in MB"
    )
```

### Customer Preference Model

```python
class CustomerPreferences(models.Model):
    """Customer preferences for receipt delivery."""
    
    customer = models.OneToOneField('Customer', on_delete=models.CASCADE)
    
    # Email preferences
    receive_email_receipts = models.BooleanField(default=True)
    include_pdf_attachment = models.BooleanField(default=True)
    
    # Other preferences
    preferred_receipt_format = models.CharField(
        max_length=20,
        choices=[
            ('email', 'Email Only'),
            ('pdf', 'PDF Only'),
            ('both', 'Email with PDF'),
            ('print', 'Print Only'),
        ],
        default='both'
    )
```

### Attachment Size Management

| Size Range | Action |
|------------|--------|
| < 1 MB | Attach normally |
| 1-5 MB | Attach with warning in logs |
| 5-10 MB | Consider compressing PDF |
| > 10 MB | Skip attachment, provide link instead |

### Expected Outcome
```
apps/pos/receipts/
├── models/
│   ├── receipt.py                    # Updated with attachment tracking
│   └── customer_preferences.py       # Customer receipt preferences
└── services/
    └── email_service.py              # Updated with PDF attachment support
```

### Verification Checklist
- [ ] PDF attachment setting is added to tenant model
- [ ] Email service is extended with PDF support
- [ ] Conditional PDF generation checks for existing PDFs
- [ ] PDF generation for attachment uses appropriate style
- [ ] PDF is properly attached to email message
- [ ] Attachment size check prevents oversized attachments
- [ ] Inline vs. attachment disposition is configurable
- [ ] Attachment preview is available in admin
- [ ] Fallback exists for PDF generation failure
- [ ] Attachment tracking updates receipt model
- [ ] Optimization exists for multiple recipients
- [ ] Customer preference support is implemented
- [ ] Attachment security measures are in place
- [ ] Email with PDF attachment sends successfully
- [ ] Attachment can be opened as valid PDF

---

## Task 64: Create Receipt Lookup Page

### Overview
Design and implement a web-based receipt lookup page that allows customers to view their receipts online via a unique URL or QR code. This page serves as the digital receipt destination.

### Dependencies
- Receipt model: Data structure in place
- Frontend framework: Next.js is available
- Task 53: PDF receipt template (for layout reference)

### Instructions

1. **Create backend API endpoint**
   - URL pattern: `/api/receipts/lookup/<receipt_id>/`
   - Accept receipt ID and verification token as parameters
   - Validate token to ensure authenticity
   - Return receipt data as JSON
   - Handle invalid or expired tokens

2. **Implement token-based authentication**
   - Generate unique verification token for each receipt
   - Token format: Short hash (16 characters)
   - Include token in receipt URL
   - Validate token before displaying receipt
   - Token doesn't expire (permanent access)

3. **Create Next.js receipt page**
   - Create file: `frontend/app/receipt/[id]/page.tsx`
   - Dynamic route based on receipt ID
   - Fetch receipt data from API
   - Display receipt information
   - Responsive design for all devices

4. **Design lookup page layout**
   - Clean, minimal design
   - Receipt information prominently displayed
   - Similar structure to PDF receipt
   - No navigation bar (standalone page)
   - Print-friendly styles

5. **Implement page header section**
   - Business logo (from tenant branding)
   - Business name and address
   - Receipt number and date
   - "Digital Receipt" title
   - Verification checkmark or badge

6. **Display transaction details**
   - Transaction date and time
   - Cashier/salesperson name
   - Terminal ID
   - Customer name (if available)
   - Payment method

7. **Create items display section**
   - Table or list of purchased items
   - Item name, quantity, unit price, total
   - Item modifiers or options
   - Responsive table design
   - Mobile-friendly list view

8. **Design financial summary section**
   - Subtotal before discounts and tax
   - Discounts applied (itemized)
   - Tax breakdown
   - Total amount (prominent)
   - Amount tendered and change

9. **Add action buttons**
   - Download PDF button
   - Print button (opens print dialog)
   - Email receipt button (if not already emailed)
   - Share button (social media or copy link)

10. **Implement print functionality**
    - CSS print styles (@media print)
    - Hide buttons when printing
    - Optimize layout for printing
    - Print button triggers window.print()

11. **Add download PDF button**
    - Button to download PDF version
    - Link to PDF storage URL or generate on-demand
    - Track PDF downloads
    - Handle missing PDFs gracefully

12. **Create verification badge**
    - Visual indicator of verified receipt
    - Show verification checkmark
    - Display verification timestamp
    - Explain verification method

13. **Implement error handling**
    - Handle receipt not found
    - Handle invalid token
    - Handle expired or deleted receipts
    - Display user-friendly error messages

14. **Add loading states**
    - Show loading spinner while fetching data
    - Skeleton loaders for content
    - Handle slow API responses
    - Timeout after 10 seconds with error

15. **Implement SEO and metadata**
    - Set page title: "Receipt {number} - {business_name}"
    - Meta description with receipt summary
    - Prevent indexing (noindex, nofollow)
    - Open graph tags for sharing

16. **Create mobile-optimized view**
    - Responsive design for small screens
    - Touch-friendly buttons
    - Readable font sizes
    - Efficient use of screen space

17. **Add QR code generation**
    - Generate QR code with receipt URL
    - Display on page for easy sharing
    - Allow downloading QR code image
    - Include verification token in QR data

### Receipt Lookup Page Mockup

```
┌─────────────────────────────────────────────────┐
│                   NAVBAR (minimal)              │
├─────────────────────────────────────────────────┤
│                                                 │
│              [BUSINESS LOGO]                    │
│           MY STORE PVT LTD                     │
│        123 Main St, Colombo 00100              │
│                                                 │
│     ✓ VERIFIED DIGITAL RECEIPT                 │
│                                                 │
├─────────────────────────────────────────────────┤
│  Receipt #: RC-2026-001234                     │
│  Date: January 23, 2026 at 2:35 PM            │
│  Cashier: Nimal Perera                         │
│  Terminal: POS-01                              │
├─────────────────────────────────────────────────┤
│  CUSTOMER INFORMATION                          │
│  Name: Kasun Silva                             │
│  Email: kasun@example.com                      │
├─────────────────────────────────────────────────┤
│  ITEMS PURCHASED                               │
│  ┌───────────────────────────────────────────┐│
│  │ Item          Qty    Price       Total    ││
│  ├───────────────────────────────────────────┤│
│  │ Tea 100g       2    Rs. 450    Rs. 900   ││
│  │ Sugar 1kg      1    Rs. 180    Rs. 180   ││
│  └───────────────────────────────────────────┘│
│                                                 │
│  Subtotal:                      Rs. 1,080.00   │
│  Discount (10%):                  Rs. -108.00  │
│  Tax (12% VAT):                   Rs. 116.64   │
│  ──────────────────────────────────────────    │
│  TOTAL:                         Rs. 1,088.64   │
│                                                 │
│  Payment: Cash                                 │
│  Tendered: Rs. 1,100.00                       │
│  Change: Rs. 11.36                            │
├─────────────────────────────────────────────────┤
│                                                 │
│  [Download PDF] [Print] [Email] [Share]       │
│                                                 │
├─────────────────────────────────────────────────┤
│  Thank you for shopping with us!               │
│  Returns within 7 days with this receipt       │
│                                                 │
│  Support: support@mystore.lk                   │
│  +94 11 234 5678                              │
│                                                 │
│  [QR CODE]                                     │
│  Scan to view receipt                          │
│                                                 │
└─────────────────────────────────────────────────┘
```

### Next.js Page Component Structure

```typescript
// frontend/app/receipt/[id]/page.tsx

interface ReceiptPageProps {
  params: {
    id: string;
  };
  searchParams: {
    token?: string;
  };
}

export default async function ReceiptPage({ params, searchParams }: ReceiptPageProps) {
  // Fetch receipt data
  const receipt = await fetchReceipt(params.id, searchParams.token);
  
  if (!receipt) {
    return <ReceiptNotFound />;
  }
  
  return (
    <div className="receipt-container">
      <ReceiptHeader receipt={receipt} />
      <ReceiptDetails receipt={receipt} />
      <ReceiptItems items={receipt.items} />
      <ReceiptTotals receipt={receipt} />
      <ReceiptActions receiptId={receipt.id} />
      <ReceiptFooter receipt={receipt.tenant} />
    </div>
  );
}
```

### Backend API Endpoint

```python
# apps/pos/receipts/views/lookup.py

from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

@api_view(['GET'])
def receipt_lookup(request, receipt_id):
    """
    API endpoint for receipt lookup.
    
    URL: /api/receipts/lookup/<receipt_id>/?token=<verification_token>
    """
    token = request.query_params.get('token')
    
    if not token:
        return Response(
            {'error': 'Verification token required'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    try:
        receipt = Receipt.objects.get(id=receipt_id)
        
        # Verify token
        if not receipt.verify_token(token):
            return Response(
                {'error': 'Invalid verification token'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        # Serialize receipt data
        serializer = ReceiptSerializer(receipt)
        
        return Response(serializer.data)
    
    except Receipt.DoesNotExist:
        return Response(
            {'error': 'Receipt not found'},
            status=status.HTTP_404_NOT_FOUND
        )
```

### Verification Token Generation

```python
# In Receipt model

import hmac
import hashlib

def generate_verification_token(self):
    """
    Generate verification token for receipt.
    
    Uses HMAC with secret key for security.
    """
    message = f"{self.id}:{self.receipt_number}:{self.total_amount}"
    token = hmac.new(
        key=settings.RECEIPT_SECRET_KEY.encode(),
        msg=message.encode(),
        digestmod=hashlib.sha256
    ).hexdigest()[:16]
    
    return token

def verify_token(self, token):
    """
    Verify receipt token.
    
    Returns True if token is valid.
    """
    expected_token = self.generate_verification_token()
    return hmac.compare_digest(token, expected_token)
```

### Receipt Lookup URL Format

```
https://{tenant_subdomain}.lcc.app/receipt/{receipt_id}?token={verification_token}

Example:
https://mystore.lcc.app/receipt/550e8400-e29b-41d4-a716-446655440000?token=a1b2c3d4e5f67890
```

### Print Styles

```css
/* Print-specific styles */
@media print {
  /* Hide interactive elements */
  .action-buttons,
  .navbar,
  .footer-links {
    display: none !important;
  }
  
  /* Optimize for printing */
  body {
    margin: 0;
    padding: 0;
  }
  
  .receipt-container {
    max-width: 100%;
    box-shadow: none;
    border: none;
  }
  
  /* Ensure proper page breaks */
  .receipt-section {
    page-break-inside: avoid;
  }
  
  /* Black and white optimization */
  * {
    color: #000 !important;
    background: #fff !important;
  }
}
```

### Expected Outcome
```
backend/apps/pos/receipts/
├── views/
│   └── lookup.py                      # Receipt lookup API
└── urls.py                            # URL routing

frontend/
├── app/
│   └── receipt/
│       └── [id]/
│           ├── page.tsx               # Receipt lookup page
│           └── loading.tsx            # Loading state
└── components/
    └── receipts/
        ├── ReceiptHeader.tsx
        ├── ReceiptDetails.tsx
        ├── ReceiptItems.tsx
        ├── ReceiptTotals.tsx
        ├── ReceiptActions.tsx
        └── ReceiptFooter.tsx
```

### Verification Checklist
- [ ] Backend API endpoint is created
- [ ] Token-based authentication is implemented
- [ ] Next.js receipt page is created with dynamic routing
- [ ] Lookup page layout is clean and professional
- [ ] Page header displays business branding
- [ ] Transaction details are clearly shown
- [ ] Items display section is responsive
- [ ] Financial summary is accurate and prominent
- [ ] Action buttons (download, print, email, share) work
- [ ] Print functionality uses proper CSS styles
- [ ] Download PDF button generates or retrieves PDF
- [ ] Verification badge indicates authentic receipt
- [ ] Error handling covers all failure cases
- [ ] Loading states provide good UX
- [ ] SEO metadata is properly set
- [ ] Mobile-optimized view works on all devices
- [ ] QR code is generated and displayed

---

## Summary

### Tasks Completed in This Document
| Task # | Task Name | Key Deliverable |
|--------|-----------|-----------------|
| 60 | Create email receipt template | `receipt_email.html` and `.txt` |
| 61 | Add email styling | Inline CSS styling for email |
| 62 | Implement email sending service | `EmailReceiptService` class |
| 63 | Add PDF attachment option | PDF attachment to emails |
| 64 | Create receipt lookup page | Web page for viewing receipts |

### Final Group D Document 2 Structure
```
apps/pos/receipts/
├── models/
│   └── receipt.py                     # With email and attachment tracking
├── services/
│   └── email_service.py               # Complete email service
├── tasks.py                           # Celery email tasks
├── templates/
│   └── receipts/
│       └── email/
│           ├── receipt_email.html     # HTML email template
│           └── receipt_email.txt      # Plain text version
└── views/
    └── lookup.py                      # Receipt lookup API

frontend/
└── app/
    └── receipt/
        └── [id]/
            └── page.tsx               # Receipt lookup page
```

### Group D Progress
- **Document 1 (Tasks 53-59):** PDF Generation System ✓
- **Document 2 (Tasks 60-64):** Email Receipts ✓
- **Document 3 (Tasks 65-68):** Verification, Sharing, Preferences (Next)

### Next Steps
1. Proceed to [03_Tasks-65-68_Verification-Sharing-Prefs.md](03_Tasks-65-68_Verification-Sharing-Prefs.md) to implement verification, sharing, SMS, and customer preferences
2. Test email sending with sample receipts
3. Verify PDF attachments are included and valid
4. Ensure receipt lookup page renders correctly
5. Test on mobile devices

---

## Notes for AI Agents

1. **Email Client Testing:**
   - Test in Gmail, Outlook, Apple Mail
   - Verify mobile email rendering
   - Check spam folder placement
   - Validate all links work

2. **SMTP Configuration:**
   - Use reliable SMTP service (SendGrid, AWS SES, etc.)
   - Configure SPF, DKIM, DMARC records
   - Monitor email deliverability
   - Handle bounce notifications

3. **Celery for Async Sending:**
   - Don't block request while sending email
   - Queue emails for background processing
   - Implement retry logic in tasks
   - Monitor queue length

4. **PDF Attachment Best Practices:**
   - Keep PDF size reasonable (< 5MB)
   - Use A4 invoice style for professional look
   - Cache PDFs to avoid regeneration
   - Provide fallback if PDF fails

5. **Receipt Lookup Security:**
   - Always require verification token
   - Use HMAC for token generation (secure)
   - Don't expose sensitive data without verification
   - Log access attempts for audit

6. **Mobile Optimization:**
   - Receipt lookup page must be mobile-friendly
   - Test on various screen sizes
   - Ensure buttons are tap-friendly (44px+)
   - Optimize load time for mobile networks

7. **Performance:**
   - Cache tenant branding in email service
   - Use async tasks for all email sends
   - Batch email operations when possible
   - Monitor email sending performance
