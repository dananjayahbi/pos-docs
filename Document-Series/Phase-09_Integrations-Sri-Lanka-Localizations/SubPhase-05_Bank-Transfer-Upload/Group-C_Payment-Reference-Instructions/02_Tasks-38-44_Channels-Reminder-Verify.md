# Tasks 38-44: Multi-Channel Delivery and Reminders

> **Phase:** 09 - Integrations & Sri Lanka Localizations  
> **SubPhase:** 05 - Bank Transfer with Upload  
> **Group:** C - Payment Reference & Instructions  
> **Document:** 02 of 02  
> **Tasks Covered:** 38, 39, 40, 41, 42, 43, 44

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [01_Tasks-29-37_Reference-Display.md](01_Tasks-29-37_Reference-Display.md)
- **→ Next Group:** [../Group-D_Proof-Upload-Verification/](../Group-D_Proof-Upload-Verification/)

---

## Document Overview

This document covers the implementation of multi-channel payment instruction delivery and automated reminder systems. It establishes email, WhatsApp, and SMS channels for sending payment instructions, implements a Celery-based reminder system for pending payments, and verifies the complete instruction delivery flow.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 38 | Create Email Instructions | Medium | 50 min |
| 39 | Create WhatsApp Instructions | Medium | 50 min |
| 40 | Create SMS Instructions | Low | 35 min |
| 41 | Create Payment Reminder | Medium | 60 min |
| 42 | Create Reminder Celery Task | Medium | 55 min |
| 43 | Create Final Reminder | Low | 30 min |
| 44 | Verify Instructions | Low | 40 min |

---

## Task 38: Create Email Instructions

### Overview
Create an email notification system that sends comprehensive payment instructions to customers. The email includes all payment details, bank account information, payment reference, deadline, and step-by-step instructions. It must be professionally formatted, mobile-responsive, and include brand styling.

### Dependencies
- Task 32: Create Payment Instructions
- Task 34: Create Bank Details Display
- Task 35: Create Amount Display
- Task 36: Create Expiry Display
- Core notification system must be configured

### Instructions

1. **Navigate to email templates directory**
   - Go to `backend/apps/payments/templates/emails/`
   - Create subdirectory `bank_transfer/` if not exists

2. **Create HTML email template**
   - Create file: `bank_transfer_instructions.html`
   - Use Django template language
   - Ensure mobile-responsive design

3. **Create plain text email template**
   - Create file: `bank_transfer_instructions.txt`
   - Plain text fallback for non-HTML email clients
   - Include all essential information

4. **Design email structure**
   - Header: Company logo and branding
   - Subject line: "Complete Your Payment - Order #{{order_id}}"
   - Greeting: Personalized with customer name
   - Order summary: Order number and amount
   - Payment reference: Prominently displayed
   - Bank details: All active accounts
   - Instructions: Step-by-step payment guide
   - Deadline: Clear expiry warning
   - Footer: Support contact and links

5. **Create send_email_instructions function**
   - Location: `backend/apps/payments/processors/bank_transfer/instructions.py`
   - Accept payment object and customer email
   - Generate instruction context
   - Send email using Django email backend

6. **Format email content**
   - Use instruction generation from Task 32
   - Apply bank details formatting from Task 34
   - Apply amount formatting from Task 35
   - Apply expiry formatting from Task 36

7. **Add email styling**
   - Use inline CSS for compatibility
   - Brand colors: primary, secondary
   - Responsive layout for mobile
   - Clear button/link styling

8. **Include call-to-action**
   - Button: "View Order" linking to order page
   - Link: "Upload Payment Proof" (after payment)
   - Contact support link

9. **Implement email sending**
   - Use Django's send_mail or EmailMultiAlternatives
   - Set from_email to tenant's email
   - Add reply-to address
   - Include both HTML and text versions

10. **Add error handling**
    - Handle email sending failures
    - Log failed attempts
    - Retry mechanism (optional)
    - Return success/failure status

### Email Structure

```
┌─────────────────────────────────────────┐
│  [Logo]  LankaCommerce Cloud            │
├─────────────────────────────────────────┤
│                                         │
│  Hi [Customer Name],                    │
│                                         │
│  Thank you for your order #12345!       │
│  Please complete your payment to        │
│  confirm your order.                    │
│                                         │
│  ╔═══════════════════════════════════╗ │
│  ║  PAYMENT REFERENCE                ║ │
│  ║  ORD-12345-A7B3                   ║ │
│  ║  [Copy Button]                    ║ │
│  ╚═══════════════════════════════════╝ │
│                                         │
│  Amount to Pay: ₨ 5,000.00             │
│                                         │
│  ┌─ Bank Account Details ─────────┐   │
│  │ Bank: Commercial Bank           │   │
│  │ Account: 1234567890             │   │
│  │ Name: LankaCommerce Cloud       │   │
│  │ Branch: Colombo 03              │   │
│  └─────────────────────────────────┘   │
│                                         │
│  How to Pay:                            │
│  1. Visit your bank or use banking app │
│  2. Make transfer to account above     │
│  3. Include reference: ORD-12345-A7B3  │
│  4. Upload proof of payment            │
│                                         │
│  ⚠️ PAY BEFORE: 31/01/2026 18:00       │
│                                         │
│  [View Order]  [Upload Proof]          │
│                                         │
├─────────────────────────────────────────┤
│  Need Help? support@lankacommerce.lk   │
│  © 2026 LankaCommerce Cloud            │
└─────────────────────────────────────────┘
```

### Email Template Variables

| Variable | Type | Description | Example |
|----------|------|-------------|---------|
| customer_name | str | Customer's name | "John Doe" |
| order_id | int | Order number | 12345 |
| reference | str | Payment reference | "ORD-12345-A7B3" |
| amount | str | Formatted amount | "₨ 5,000.00" |
| bank_accounts | list | Active bank accounts | [{bank, account, ...}] |
| expiry | str | Formatted deadline | "31/01/2026 18:00" |
| order_url | str | Link to order page | "https://..." |
| upload_url | str | Link to upload page | "https://..." |
| support_email | str | Support contact | "support@..." |
| tenant_name | str | Tenant business name | "LankaCommerce Cloud" |

### Subject Line Variations

| Scenario | Subject Line |
|----------|-------------|
| Initial Send | "Complete Your Payment - Order #{{order_id}}" |
| Resend | "Payment Instructions - Order #{{order_id}} (Resent)" |
| Urgent | "⚠️ Payment Expiring Soon - Order #{{order_id}}" |

### Email Content Sections

| Section | Required | Description |
|---------|----------|-------------|
| Header | Yes | Logo and branding |
| Greeting | Yes | Personalized greeting |
| Order Info | Yes | Order number and summary |
| Reference | Yes | Payment reference (prominent) |
| Amount | Yes | Total amount to pay |
| Bank Details | Yes | All active accounts |
| Instructions | Yes | Step-by-step guide |
| Deadline | Yes | Expiry warning |
| CTA Buttons | Yes | View order, upload proof |
| Footer | Yes | Support and legal |

### Step-by-Step Instructions

| Step | Instruction |
|------|-------------|
| 1 | Visit your bank branch or use online/mobile banking |
| 2 | Select "Fund Transfer" or "Make Payment" |
| 3 | Enter bank details provided above |
| 4 | Enter exact amount: {{amount}} |
| 5 | **IMPORTANT:** Include reference code in remarks/description |
| 6 | Complete the transfer |
| 7 | Take a screenshot or photo of the confirmation |
| 8 | Upload proof using the link provided |

### send_email_instructions Function

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| payment | BankTransferPayment | Yes | Payment object |
| recipient_email | str | No | Override email (default: order email) |
| language | str | No | Email language (default: en) |

### Function Return Structure

| Field | Type | Description |
|-------|------|-------------|
| success | bool | Whether email sent successfully |
| message_id | str | Email message ID (if successful) |
| error | str | Error message (if failed) |
| sent_at | datetime | When email was sent |

### Expected Outcome
- Professional HTML email template with all payment details
- Plain text fallback template
- send_email_instructions function that handles email delivery
- Mobile-responsive design
- Clear step-by-step instructions
- Prominent payment reference display

### Verification Checklist
- [ ] HTML template created: bank_transfer_instructions.html
- [ ] Plain text template created: bank_transfer_instructions.txt
- [ ] send_email_instructions function implemented
- [ ] Email includes all required sections
- [ ] Payment reference prominently displayed
- [ ] All bank accounts shown
- [ ] Amount formatted with LKR symbol
- [ ] Expiry deadline clearly shown
- [ ] Step-by-step instructions included
- [ ] CTA buttons for view order and upload proof
- [ ] Mobile-responsive design
- [ ] Inline CSS for email client compatibility
- [ ] Error handling for send failures
- [ ] Function returns status dictionary

---

## Task 39: Create WhatsApp Instructions

### Overview
Create a WhatsApp messaging integration that sends payment instructions via WhatsApp Business API. The message should be concise, mobile-friendly, and include all essential payment details with clickable links where possible.

### Dependencies
- Task 32: Create Payment Instructions
- Task 37: Create Copy to Clipboard
- WhatsApp Business API credentials configured
- Phone number validation system in place

### Instructions

1. **Configure WhatsApp Business API**
   - Set up WhatsApp Business API credentials
   - Configure webhook for message status
   - Define message templates in WhatsApp Manager
   - Get template approval from WhatsApp

2. **Create WhatsApp message template**
   - Navigate to WhatsApp Business Manager
   - Create message template: "payment_instructions"
   - Include variables for order_id, amount, reference
   - Submit for approval

3. **Create send_whatsapp_instructions function**
   - Location: `backend/apps/payments/processors/bank_transfer/instructions.py`
   - Accept payment object and phone number
   - Format message for WhatsApp
   - Send via WhatsApp API

4. **Format message for WhatsApp**
   - Keep message concise (ideal < 1000 characters)
   - Use clear formatting (bold, line breaks)
   - Include essential details only
   - Add emoji for visual cues (✓, ⚠️, ₨)

5. **Structure WhatsApp message**
   - Greeting and order number
   - Payment reference (copyable)
   - Amount with currency
   - First bank account details (primary)
   - Payment deadline
   - Link to full instructions
   - Support contact

6. **Integrate WhatsApp API client**
   - Install WhatsApp Business API client library
   - Configure API credentials in settings
   - Implement send_message wrapper function
   - Handle API rate limits

7. **Format phone number**
   - Validate phone number format
   - Convert to international format (+94...)
   - Remove spaces and special characters
   - Validate Sri Lankan phone numbers

8. **Add message tracking**
   - Store message_id from API response
   - Track delivery status via webhook
   - Log sent, delivered, read statuses
   - Store in PaymentNotification model

9. **Implement retry mechanism**
   - Retry failed sends (max 3 attempts)
   - Exponential backoff between retries
   - Log all retry attempts
   - Mark as failed after max retries

10. **Add URL shortening**
    - Shorten order URL for WhatsApp
    - Shorten upload URL
    - Track clicks on shortened URLs
    - Use bit.ly or custom shortener

### WhatsApp Message Format

```
🛒 *Order #12345* - Payment Instructions

Thank you for your order! Complete payment to confirm.

*PAYMENT REFERENCE:*
ORD-12345-A7B3
(Include this in your transfer)

*AMOUNT:* ₨ 5,000.00

*BANK DETAILS:*
Bank: Commercial Bank of Ceylon
Account: 1234567890
Name: LankaCommerce Cloud
Branch: Colombo 03

*STEPS:*
1. Make bank transfer to above account
2. Include reference in remarks
3. Upload proof: [short_url]

⚠️ *Pay before:* 31/01/2026 18:00

Need help? Reply to this message
View full details: [short_url]

— LankaCommerce Cloud
```

### WhatsApp Message Specifications

| Specification | Value | Notes |
|---------------|-------|-------|
| Max Length | 4096 characters | Practical limit: 1000 chars |
| Formatting | Markdown style | *bold*, _italic_ |
| Links | HTTPS only | Clickable automatically |
| Emojis | Supported | Use sparingly |
| Images | Supported | Optional bank logo |
| Buttons | Template only | Up to 3 buttons |

### WhatsApp API Integration

| Component | Description |
|-----------|-------------|
| Provider | Twilio / MessageBird / Facebook |
| Authentication | API Key / Token |
| Endpoint | /messages |
| Method | POST |
| Format | JSON |

### Phone Number Format

| Input Format | Converted To | Example |
|--------------|--------------|---------|
| 0771234567 | +94771234567 | +94771234567 |
| 771234567 | +94771234567 | +94771234567 |
| +94771234567 | +94771234567 | +94771234567 |
| +94 77 123 4567 | +94771234567 | +94771234567 |

### send_whatsapp_instructions Function

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| payment | BankTransferPayment | Yes | Payment object |
| phone_number | str | Yes | Customer phone (E.164 format) |
| include_link | bool | No | Include order link (default: True) |

### API Request Structure

```python
{
  "to": "+94771234567",
  "type": "template",
  "template": {
    "name": "payment_instructions",
    "language": { "code": "en" },
    "components": [
      {
        "type": "body",
        "parameters": [
          { "type": "text", "text": "12345" },
          { "type": "text", "text": "ORD-12345-A7B3" },
          { "type": "text", "text": "5,000.00" }
        ]
      }
    ]
  }
}
```

### Message Status Tracking

| Status | Description | Action |
|--------|-------------|--------|
| sent | Message sent to WhatsApp | Log timestamp |
| delivered | Delivered to recipient | Update status |
| read | Read by recipient | Update status |
| failed | Failed to deliver | Retry or mark failed |

### Error Handling

| Error | Cause | Action |
|-------|-------|--------|
| Invalid Phone | Phone format wrong | Validate and retry |
| API Error | WhatsApp API down | Retry with backoff |
| Template Rejected | Template not approved | Use fallback method |
| Rate Limited | Too many messages | Queue for later |

### Expected Outcome
- WhatsApp message template approved and configured
- send_whatsapp_instructions function sending messages via API
- Concise, mobile-friendly message format
- Phone number validation and formatting
- Message delivery tracking
- Retry mechanism for failed sends

### Verification Checklist
- [ ] WhatsApp Business API configured
- [ ] Message template created and approved
- [ ] send_whatsapp_instructions function implemented
- [ ] Phone number validation and conversion
- [ ] Message includes reference, amount, bank details
- [ ] Message under 1000 characters (ideal)
- [ ] Links shortened for cleaner appearance
- [ ] Message tracking implemented
- [ ] Delivery status webhook configured
- [ ] Retry mechanism with max 3 attempts
- [ ] Error handling for API failures
- [ ] Message status stored in database

---

## Task 40: Create SMS Instructions

### Overview
Create an SMS notification system that sends concise payment instructions via SMS. Due to character limitations (160 chars per segment), the SMS must include only essential information with a link to full instructions.

### Dependencies
- Task 32: Create Payment Instructions
- Task 36: Create Expiry Display
- SMS gateway configured (Twilio/Dialog/Mobitel)

### Instructions

1. **Configure SMS gateway**
   - Set up SMS provider credentials (Twilio/Dialog)
   - Configure sender ID/short code
   - Test SMS delivery to Sri Lankan numbers
   - Set up delivery reports webhook

2. **Create SMS message template**
   - Keep within 160 characters for single SMS
   - Include most critical information only
   - Use abbreviations where appropriate
   - Add link to full instructions

3. **Create send_sms_instructions function**
   - Location: `backend/apps/payments/processors/bank_transfer/instructions.py`
   - Accept payment object and phone number
   - Format message for SMS constraints
   - Send via SMS gateway

4. **Format message for SMS**
   - Order number and amount
   - Payment reference
   - Deadline
   - Link to full details
   - Keep under 160 characters

5. **Implement SMS message variations**
   - Short format: Essential only (160 chars)
   - Medium format: More details (320 chars, 2 SMS)
   - Long format: All details (480 chars, 3 SMS)

6. **Integrate SMS gateway client**
   - Install SMS provider SDK (e.g., twilio python package)
   - Configure credentials in settings
   - Implement send_sms wrapper function
   - Handle rate limits and quotas

7. **Add message tracking**
   - Store SMS message ID
   - Track delivery status
   - Log cost per message
   - Store in PaymentNotification model

8. **Implement URL shortening**
   - Shorten instruction URL
   - Use bit.ly, TinyURL, or custom shortener
   - Track clicks
   - Essential for staying under character limit

9. **Handle multi-segment SMS**
   - Calculate message length
   - Determine number of segments
   - Warn if exceeds 1 segment (cost consideration)
   - Option to send shorter version

10. **Add delivery tracking**
    - Receive delivery reports from gateway
    - Update message status (sent/delivered/failed)
    - Log failures for manual follow-up
    - Retry failed messages

### SMS Message Formats

**Short Format (160 chars):**
```
LCC Order #12345
Pay Rs5,000
Ref: ORD-12345-A7B3
Bank: Comm.Bank 1234567890
By: 31/01 6PM
[short_url]
```

**Medium Format (2 SMS, 320 chars):**
```
LankaCommerce Order #12345
Amount: Rs 5,000.00
Reference: ORD-12345-A7B3

Bank: Commercial Bank
Account: 1234567890
Name: LankaCommerce Cloud
Branch: Colombo 03

Deadline: 31/01/2026 18:00
Full details: [short_url]
```

### Character Count Guidelines

| Format | Characters | Segments | Cost | Use When |
|--------|-----------|----------|------|----------|
| Short | ≤ 160 | 1 | Low | Default |
| Medium | ≤ 320 | 2 | Medium | Need more detail |
| Long | ≤ 480 | 3 | High | Rarely (prefer email) |

### SMS Content Priorities

| Priority | Information | Required |
|----------|-------------|----------|
| 1 | Order number | Yes |
| 2 | Amount | Yes |
| 3 | Reference | Yes |
| 4 | Bank account | Yes |
| 5 | Deadline | Yes |
| 6 | Link | Yes |
| 7 | Bank name | Optional |
| 8 | Account holder | No |
| 9 | Branch | No |

### SMS Gateway Configuration

| Provider | API Endpoint | Authentication | Cost (LKR/SMS) |
|----------|--------------|----------------|----------------|
| Twilio | api.twilio.com | Account SID + Token | ~2.00 |
| Dialog | ideabiz.lk | API Key | ~1.50 |
| Mobitel | mobitel.lk | Username + Password | ~1.50 |

### send_sms_instructions Function

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| payment | BankTransferPayment | Yes | Payment object |
| phone_number | str | Yes | Customer phone |
| format_type | str | No | short/medium/long (default: short) |
| language | str | No | en/si/ta (default: en) |

### API Request Structure (Twilio Example)

```python
{
  "to": "+94771234567",
  "from": "+94112345678",  # or sender ID "LCC"
  "body": "LCC Order #12345\nPay Rs5,000..."
}
```

### SMS Delivery Status

| Status | Description | Next Action |
|--------|-------------|-------------|
| queued | Queued for sending | Wait |
| sent | Sent to carrier | Wait for delivery |
| delivered | Delivered to phone | Mark complete |
| failed | Failed to deliver | Retry or escalate |
| undelivered | Number unreachable | Try alternate contact |

### URL Shortening Considerations

| Original URL | Shortened | Saved Chars |
|--------------|-----------|-------------|
| https://app.lankacommerce.lk/orders/12345/payment | lcc.lk/p/Ab7k | ~40 chars |

### Character Optimization Techniques

| Technique | Example | Savings |
|-----------|---------|---------|
| Abbreviate | "Commercial Bank" → "Comm.Bank" | 10 chars |
| Remove spaces | "Rs 5,000.00" → "Rs5,000" | 4 chars |
| Short date | "31/01/2026 18:00" → "31/01 6PM" | 8 chars |
| No punctuation | "Include reference:" → "Ref:" | 15 chars |

### Expected Outcome
- SMS gateway configured and tested
- send_sms_instructions function sending SMS
- Message optimized for 160-character limit
- Multiple format options (short/medium/long)
- URL shortening integrated
- Delivery tracking implemented

### Verification Checklist
- [ ] SMS gateway credentials configured
- [ ] send_sms_instructions function implemented
- [ ] Short format under 160 characters
- [ ] Message includes reference and amount
- [ ] Bank account number included
- [ ] Deadline included
- [ ] URL shortening implemented
- [ ] Phone number validation
- [ ] Multi-segment handling
- [ ] Delivery tracking via webhook
- [ ] Cost tracking per message
- [ ] Failed delivery retry mechanism
- [ ] Status stored in database

---

## Task 41: Create Payment Reminder

### Overview
Create an automated payment reminder system that sends notifications to customers with pending bank transfer payments. Reminders help reduce abandoned payments and ensure customers complete their transactions before expiry.

### Dependencies
- Task 38: Create Email Instructions
- Task 39: Create WhatsApp Instructions
- Task 40: Create SMS Instructions
- Celery task queue configured

### Instructions

1. **Define reminder trigger conditions**
   - Payment status: PENDING
   - Not expired yet
   - No payment proof uploaded
   - Time remaining: configurable threshold

2. **Create PaymentReminder model**
   - Location: `backend/apps/payments/models/reminders.py`
   - Track reminders sent for each payment
   - Store reminder type, channel, sent time
   - Prevent duplicate reminders

3. **Define model fields**
   - payment: ForeignKey to BankTransferPayment
   - reminder_type: CharField (choices: initial, follow_up, urgent, final)
   - channel: CharField (choices: email, whatsapp, sms)
   - sent_at: DateTimeField
   - status: CharField (sent, delivered, failed)
   - scheduled_for: DateTimeField

4. **Create reminder schedule configuration**
   - Location: `backend/apps/payments/configs.py`
   - Define REMINDER_SCHEDULE constant
   - Specify when each reminder should be sent

5. **Implement get_pending_reminders function**
   - Query payments needing reminders
   - Check reminder schedule
   - Exclude already-reminded payments
   - Return queryset of payments to remind

6. **Create send_reminder function**
   - Accept payment object and reminder_type
   - Determine which channel(s) to use
   - Format reminder message
   - Send via appropriate channel(s)

7. **Format reminder messages**
   - Use urgency appropriate to reminder type
   - Include time remaining
   - Emphasize deadline
   - Add urgency indicators (⚠️, 🔴) for late reminders

8. **Implement multi-channel reminders**
   - Send via email (always)
   - Send via WhatsApp (if phone available)
   - Send via SMS (for urgent/final reminders)
   - Track each channel separately

9. **Add reminder type variations**
   - Initial: 24 hours after order
   - Follow-up: 12 hours before expiry
   - Urgent: 6 hours before expiry
   - Final: 1 hour before expiry

10. **Prevent duplicate reminders**
    - Check PaymentReminder records
    - Don't send same reminder_type twice
    - Allow different reminder types
    - Log skipped duplicates

### Payment Reminder Flow

```
Order Created → Payment Pending
        │
        ├─ 24 hours later ────→ Initial Reminder (Email)
        │                       "Don't forget to pay"
        │
        ├─ 12 hours before ───→ Follow-up Reminder (Email + WhatsApp)
        │   expiry              "Payment due soon"
        │
        ├─ 6 hours before ────→ Urgent Reminder (Email + WhatsApp + SMS)
        │   expiry              "⚠️ Payment expires soon!"
        │
        └─ 1 hour before ─────→ Final Reminder (All channels)
            expiry              "🔴 FINAL NOTICE: Expires in 1 hour!"
```

### Reminder Schedule Configuration

```python
REMINDER_SCHEDULE = {
    'initial': {
        'hours_after_creation': 24,
        'channels': ['email'],
        'subject': "Don't Forget to Complete Your Payment",
        'urgency': 'low'
    },
    'follow_up': {
        'hours_before_expiry': 12,
        'channels': ['email', 'whatsapp'],
        'subject': "Payment Due Soon - Order #{{order_id}}",
        'urgency': 'medium'
    },
    'urgent': {
        'hours_before_expiry': 6,
        'channels': ['email', 'whatsapp', 'sms'],
        'subject': "⚠️ Payment Expires Soon - Order #{{order_id}}",
        'urgency': 'high'
    },
    'final': {
        'hours_before_expiry': 1,
        'channels': ['email', 'whatsapp', 'sms'],
        'subject': "🔴 FINAL NOTICE: Payment Expires in 1 Hour",
        'urgency': 'critical'
    }
}
```

### PaymentReminder Model Schema

```
PaymentReminder
├── id (PK, UUID)
├── payment (FK to BankTransferPayment)
├── reminder_type (CharField: initial/follow_up/urgent/final)
├── channel (CharField: email/whatsapp/sms)
├── sent_at (DateTimeField)
├── scheduled_for (DateTimeField)
├── status (CharField: pending/sent/delivered/failed)
├── message_id (CharField, external ID from provider)
├── error_message (TextField, null)
└── created_at (DateTimeField)
```

### Reminder Types

| Type | Timing | Urgency | Channels | Subject Prefix |
|------|--------|---------|----------|----------------|
| initial | 24h after creation | Low | Email | "Don't forget" |
| follow_up | 12h before expiry | Medium | Email, WhatsApp | "Due soon" |
| urgent | 6h before expiry | High | All | "⚠️ Expires soon" |
| final | 1h before expiry | Critical | All | "🔴 FINAL NOTICE" |

### Reminder Message Variations

| Reminder Type | Email Subject | Message Tone |
|---------------|---------------|--------------|
| initial | "Complete Your Payment - Order #{{order_id}}" | Friendly reminder |
| follow_up | "Payment Due Soon - Order #{{order_id}}" | Gentle urgency |
| urgent | "⚠️ Payment Expires in 6 Hours - Order #{{order_id}}" | Strong urgency |
| final | "🔴 FINAL NOTICE: Payment Expires in 1 Hour - Order #{{order_id}}" | Critical urgency |

### get_pending_reminders Function

| Returns | Description |
|---------|-------------|
| QuerySet | Payments needing reminders of each type |

Query Logic:
- Status = PENDING
- expiry_date > now
- For each reminder type, check timing conditions
- Exclude if reminder already sent
- Order by expiry_date ascending (most urgent first)

### send_reminder Function

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| payment | BankTransferPayment | Yes | Payment to remind about |
| reminder_type | str | Yes | Type: initial/follow_up/urgent/final |
| force_channels | list | No | Override default channels |

### Expected Outcome
- PaymentReminder model tracking all reminders
- Reminder schedule configuration defining timing
- Functions to identify and send reminders
- Multi-channel reminder support
- Duplicate prevention system

### Verification Checklist
- [ ] PaymentReminder model created
- [ ] Model includes payment, type, channel, status fields
- [ ] REMINDER_SCHEDULE configuration defined
- [ ] get_pending_reminders function implemented
- [ ] send_reminder function implemented
- [ ] Multi-channel sending (email, WhatsApp, SMS)
- [ ] Reminder type variations (initial/follow_up/urgent/final)
- [ ] Duplicate prevention checks PaymentReminder
- [ ] Message urgency appropriate to reminder type
- [ ] Time remaining calculated correctly
- [ ] Migration created and applied

---

## Task 42: Create Reminder Celery Task

### Overview
Create a Celery periodic task that automatically sends payment reminders at scheduled intervals. The task queries for pending payments requiring reminders, determines which reminder type to send, and dispatches reminders via appropriate channels.

### Dependencies
- Task 41: Create Payment Reminder
- Celery and Celery Beat configured
- Redis or RabbitMQ message broker running

### Instructions

1. **Navigate to tasks directory**
   - Go to `backend/apps/payments/tasks/`
   - Create file: `reminder_tasks.py`

2. **Import required dependencies**
   - Import Celery decorators (shared_task, periodic_task)
   - Import payment and reminder models
   - Import reminder sending functions
   - Import timezone utilities

3. **Create send_payment_reminders task**
   - Decorate with @shared_task
   - Add task name: "payments.send_payment_reminders"
   - Set task options (max_retries, default_retry_delay)

4. **Implement task logic**
   - Query pending payments from get_pending_reminders
   - For each reminder type (initial, follow_up, urgent, final)
   - Send appropriate reminders
   - Log successes and failures

5. **Add error handling**
   - Try-except around reminder sending
   - Log errors without stopping entire task
   - Continue to next payment if one fails
   - Track failure count

6. **Implement batch processing**
   - Process reminders in batches (e.g., 50 at a time)
   - Avoid overwhelming email/SMS services
   - Add rate limiting if needed
   - Sleep between batches if required

7. **Configure periodic schedule**
   - Register task with Celery Beat
   - Set schedule: every 1 hour
   - Can adjust based on reminder timing needs
   - Use crontab for specific times

8. **Add task monitoring**
   - Log task start and completion
   - Count reminders sent per type
   - Track total processing time
   - Report errors to monitoring system

9. **Create manual trigger endpoint**
   - API endpoint to trigger task manually
   - Useful for testing and manual interventions
   - Requires admin permissions
   - Returns task ID for tracking

10. **Register task with Celery Beat**
    - Update celery.py or celerybeat-schedule.py
    - Add periodic task configuration
    - Set schedule using crontab or interval

### Celery Task Structure

```python
@shared_task(
    name='payments.send_payment_reminders',
    max_retries=3,
    default_retry_delay=300  # 5 minutes
)
def send_payment_reminders():
    """
    Periodic task to send payment reminders
    Runs every hour via Celery Beat
    """
    # Implementation
```

### Task Execution Flow

```
┌────────────────────────────────────┐
│  Celery Beat Triggers Task         │
│  (Every hour)                      │
└────────────┬───────────────────────┘
             │
             ▼
┌────────────────────────────────────┐
│  Query Pending Payments            │
│  get_pending_reminders()           │
└────────────┬───────────────────────┘
             │
             ▼
┌────────────────────────────────────┐
│  For Each Reminder Type:           │
│  - initial                         │
│  - follow_up                       │
│  - urgent                          │
│  - final                           │
└────────────┬───────────────────────┘
             │
             ▼
┌────────────────────────────────────┐
│  For Each Payment:                 │
│  1. Check if reminder already sent │
│  2. Send reminder                  │
│  3. Create PaymentReminder record  │
│  4. Handle errors                  │
└────────────┬───────────────────────┘
             │
             ▼
┌────────────────────────────────────┐
│  Log Summary:                      │
│  - Total processed                 │
│  - Sent by type                    │
│  - Failures                        │
└────────────────────────────────────┘
```

### Celery Beat Schedule Configuration

```python
# celerybeat-schedule.py or celery.py

from celery.schedules import crontab

CELERY_BEAT_SCHEDULE = {
    'send-payment-reminders': {
        'task': 'payments.send_payment_reminders',
        'schedule': crontab(minute=0),  # Every hour
        # Or: 'schedule': 3600.0,  # Every hour (in seconds)
    },
}
```

### Task Options

| Option | Value | Description |
|--------|-------|-------------|
| name | 'payments.send_payment_reminders' | Task identifier |
| max_retries | 3 | Retry failed task up to 3 times |
| default_retry_delay | 300 | Wait 5 minutes between retries |
| soft_time_limit | 600 | Warn if task runs over 10 minutes |
| time_limit | 900 | Kill task after 15 minutes |

### Schedule Options

| Schedule Type | Configuration | Description |
|---------------|---------------|-------------|
| Every Hour | `crontab(minute=0)` | Run at minute 0 of every hour |
| Every 30 Min | `crontab(minute='*/30')` | Run every 30 minutes |
| Specific Times | `crontab(hour='8,14,20', minute=0)` | 8 AM, 2 PM, 8 PM |
| Interval | `3600.0` | Every 3600 seconds (1 hour) |

### Task Return Structure

```python
{
    'total_processed': 45,
    'reminders_sent': {
        'initial': 10,
        'follow_up': 15,
        'urgent': 12,
        'final': 8
    },
    'failures': 0,
    'processing_time': 23.5,  # seconds
    'timestamp': '2026-01-31T10:00:00Z'
}
```

### Error Handling Strategy

| Error Type | Action | Log Level |
|------------|--------|-----------|
| Email Send Failed | Skip, log, continue | WARNING |
| WhatsApp API Error | Skip, log, continue | WARNING |
| SMS Gateway Down | Skip, log, continue | ERROR |
| Database Error | Retry task | ERROR |
| Unknown Error | Log, continue | ERROR |

### Batch Processing Configuration

| Setting | Value | Reason |
|---------|-------|--------|
| Batch Size | 50 | Avoid overwhelming services |
| Sleep Between | 1 second | Rate limit compliance |
| Max Per Run | 500 | Prevent long-running tasks |

### Manual Trigger API Endpoint

```
POST /api/admin/payments/reminders/trigger/
Authorization: Bearer <admin_token>

Response:
{
    "task_id": "abc-123-def-456",
    "status": "queued",
    "message": "Reminder task queued for execution"
}
```

### Expected Outcome
- Celery periodic task running every hour
- Automatic reminder sending for all reminder types
- Error handling without stopping entire task
- Batch processing to avoid overwhelming services
- Task monitoring and logging
- Manual trigger endpoint for admin use

### Verification Checklist
- [ ] reminder_tasks.py created
- [ ] send_payment_reminders task defined
- [ ] Task decorated with @shared_task
- [ ] Task queries pending payments correctly
- [ ] Loops through all reminder types
- [ ] Sends reminders via send_reminder function
- [ ] Error handling for each reminder
- [ ] Batch processing implemented
- [ ] Logging for start, progress, completion
- [ ] Celery Beat schedule registered
- [ ] Schedule set to hourly (or as configured)
- [ ] Task returns summary dictionary
- [ ] Manual trigger endpoint created (optional)
- [ ] Task tested with celery worker running

---

## Task 43: Create Final Reminder

### Overview
Create a specialized final reminder that is sent 1 hour before payment expiry. This is the last opportunity to notify customers before their payment window closes. The reminder must be highly visible, urgent, and sent via all available channels.

### Dependencies
- Task 41: Create Payment Reminder
- Task 42: Create Reminder Celery Task
- All communication channels (email, WhatsApp, SMS) functional

### Instructions

1. **Define final reminder criteria**
   - Time remaining: 1 hour before expiry
   - Payment status: PENDING
   - No previous final reminder sent
   - No payment proof uploaded

2. **Create send_final_reminder function**
   - Location: `backend/apps/payments/processors/bank_transfer/instructions.py`
   - Accept payment object
   - Send via all channels simultaneously
   - Mark as final reminder

3. **Format final reminder message**
   - Extremely urgent tone
   - Use attention-grabbing elements (🔴, ⚠️)
   - Time remaining prominently displayed
   - Consequences of non-payment stated
   - Include all payment details again

4. **Customize email template**
   - Create `bank_transfer_final_reminder.html`
   - Red/orange color scheme for urgency
   - Large, bold headline
   - Countdown timer (if possible)
   - Simplified instructions

5. **Customize WhatsApp message**
   - Use urgent formatting
   - Include countdown
   - Repeat reference and amount
   - Add direct contact option

6. **Customize SMS message**
   - All caps for urgency (sparingly)
   - Include essential details only
   - Clear deadline
   - Support contact number

7. **Add phone call option**
   - For very high-value orders
   - Automated voice call with IVR
   - Or flag for manual call from support
   - Log call attempts

8. **Implement escalation**
   - Notify internal team of impending expiry
   - Allow manual intervention
   - Consider extending deadline (business rule)
   - Log all final reminders for review

9. **Track final reminder effectiveness**
   - Measure conversion rate
   - Track which channel leads to payment
   - Analyze timing effectiveness
   - Adjust timing if needed

10. **Prevent multiple finals**
    - Check PaymentReminder for final type
    - Only send once
    - Log if attempted duplicate
    - Update status after sending

### Final Reminder Email Template

```
Subject: 🔴 FINAL NOTICE: Your Payment Expires in 1 Hour!

┌────────────────────────────────────────┐
│ ⚠️  URGENT: PAYMENT EXPIRING SOON  ⚠️  │
└────────────────────────────────────────┘

Dear [Customer Name],

This is your FINAL REMINDER. Your payment window 
closes in less than 1 HOUR!

⏰ TIME REMAINING: 58 minutes

Order #12345 will be automatically CANCELLED if 
payment is not received before:
🕐 31/01/2026 18:00 (Asia/Colombo)

╔═══════════════════════════════════════╗
║  PAYMENT REFERENCE: ORD-12345-A7B3    ║
╚═══════════════════════════════════════╝

AMOUNT: ₨ 5,000.00

QUICK ACTION STEPS:
1. Transfer to: Commercial Bank 1234567890
2. Include reference: ORD-12345-A7B3
3. Upload proof immediately

[ PAY NOW ] [ UPLOAD PROOF ] [ CONTACT SUPPORT ]

After expiry, you will need to place a new order.

Need immediate help? Call: +94 11 234 5678
```

### Final Reminder WhatsApp Message

```
🔴 *URGENT: PAYMENT EXPIRING!* 🔴

Your Order #12345 payment expires in *1 HOUR*!

⏰ *Deadline:* 31/01/2026 18:00

*PAYMENT REFERENCE:*
ORD-12345-A7B3

*AMOUNT:* ₨ 5,000.00

*BANK:* Commercial Bank
*Account:* 1234567890

*ACT NOW:*
1. Make transfer
2. Include reference
3. Upload proof: [url]

After deadline, order will be CANCELLED.

🆘 Need help? Reply NOW or call:
+94 11 234 5678
```

### Final Reminder SMS Message

```
🔴 URGENT! Order #12345 
payment EXPIRES IN 1 HOUR!
Pay Rs5,000 to Comm.Bank 
1234567890. Ref: ORD-12345-A7B3
Upload proof: [url]
Help: 0112345678
```

### Final Reminder Timing

| Trigger | Time Before Expiry | Urgency Level |
|---------|-------------------|---------------|
| Final Reminder | 60 minutes | Critical |
| Second Final (optional) | 30 minutes | Critical |
| Last Call (optional) | 15 minutes | Critical |

### Channel Priority for Final Reminder

| Channel | Priority | Delivery Time | Cost |
|---------|----------|---------------|------|
| Push Notification | 1 | Instant | Free |
| SMS | 2 | < 10 seconds | Medium |
| WhatsApp | 3 | < 30 seconds | Low |
| Email | 4 | < 1 minute | Low |
| Voice Call | 5 | Manual | High |

### Urgency Indicators

| Element | Usage | Effect |
|---------|-------|--------|
| 🔴 Red Circle | Subject lines | Visual alert |
| ⚠️ Warning | Throughout | Urgency signal |
| ⏰ Clock | Time remaining | Deadline emphasis |
| ALL CAPS | Sparingly | Attention grabber |
| Bold/Large Text | Key details | Readability |
| Red Color | Backgrounds, text | Danger signal |

### Escalation Actions

| Condition | Action | Who |
|-----------|--------|-----|
| High-value order (>100k) | Manual call | Sales team |
| Repeat customer | Personal email | Account manager |
| Multiple orders | WhatsApp direct | Support team |
| VIP customer | Immediate call | Manager |

### Effectiveness Tracking

| Metric | Description |
|--------|-------------|
| Sent Count | Total final reminders sent |
| Open Rate | Email/WhatsApp opens |
| Click Rate | Link clicks |
| Conversion Rate | Payments completed after final |
| Time to Payment | Minutes from reminder to payment |
| Channel Performance | Which channel converts best |

### Expected Outcome
- Highly urgent final reminder sent 1 hour before expiry
- Multi-channel delivery (email, WhatsApp, SMS)
- Attention-grabbing formatting and messaging
- Clear call-to-action with consequences stated
- Escalation for high-value orders
- Tracking and prevention of duplicates

### Verification Checklist
- [ ] send_final_reminder function created
- [ ] Triggers 1 hour before expiry
- [ ] Sends via all available channels simultaneously
- [ ] Email template created: bank_transfer_final_reminder.html
- [ ] Email uses urgent design (red/orange colors)
- [ ] WhatsApp message formatted with urgency indicators
- [ ] SMS message concise but urgent
- [ ] Time remaining calculated and displayed
- [ ] Consequences of non-payment stated
- [ ] All payment details repeated
- [ ] Support contact included (phone number)
- [ ] Duplicate prevention implemented
- [ ] PaymentReminder record created with type='final'
- [ ] Effectiveness tracking configured

---

## Task 44: Verify Instructions

### Overview
Comprehensively verify the entire payment instruction and reminder system. Test all components end-to-end, validate that instructions are generated correctly, verify all communication channels work, confirm reminders are sent on schedule, and ensure the complete flow from order creation to payment completion functions properly.

### Dependencies
- All previous tasks in Group C (Tasks 29-43)
- Test environment with all services running

### Instructions

1. **Create comprehensive test suite**
   - Location: `backend/apps/payments/tests/test_instructions.py`
   - Cover all functions and components
   - Include integration tests

2. **Test reference generation**
   - Generate multiple references
   - Verify unique format (ORD-{id}-{random})
   - Test collision detection
   - Verify validation works

3. **Test instruction generation**
   - Generate instructions for test payment
   - Verify all sections present
   - Check bank details formatting
   - Verify amount formatting (LKR)
   - Check expiry formatting

4. **Test email delivery**
   - Send test email instructions
   - Verify email received
   - Check HTML rendering
   - Verify plain text fallback
   - Test links are clickable

5. **Test WhatsApp delivery**
   - Send test WhatsApp message
   - Verify message received
   - Check formatting intact
   - Verify links work
   - Test delivery status webhook

6. **Test SMS delivery**
   - Send test SMS
   - Verify SMS received within seconds
   - Check character count
   - Verify shortened URLs work
   - Test delivery report

7. **Test reminder system**
   - Create test payment with near-expiry time
   - Trigger reminder task manually
   - Verify correct reminder type sent
   - Check all channels used
   - Verify no duplicates

8. **Test Celery task**
   - Run send_payment_reminders task
   - Verify task completes successfully
   - Check logs for errors
   - Verify reminders sent
   - Test task retry on failure

9. **Test final reminder**
   - Create payment expiring in 1 hour
   - Trigger final reminder
   - Verify sent via all channels
   - Check urgent formatting
   - Verify only sent once

10. **End-to-end flow test**
    - Create order → Generate payment
    - Verify initial instructions sent
    - Wait for reminder timing (or simulate)
    - Verify reminders sent on schedule
    - Upload payment proof
    - Verify reminders stop after payment

11. **Performance testing**
    - Test with batch of 100 payments
    - Measure processing time
    - Check resource usage
    - Verify no bottlenecks
    - Test rate limiting

12. **Error scenario testing**
    - Test email service down
    - Test WhatsApp API unavailable
    - Test SMS gateway error
    - Verify graceful degradation
    - Check error logging

### Test Suite Structure

```python
# test_instructions.py

class TestReferenceGeneration:
    def test_generate_unique_reference()
    def test_reference_format()
    def test_reference_validation()
    def test_collision_detection()

class TestInstructionGeneration:
    def test_generate_instructions()
    def test_bank_details_format()
    def test_amount_format()
    def test_expiry_format()
    def test_copy_format()

class TestEmailInstructions:
    def test_send_email()
    def test_email_template_rendering()
    def test_email_links()

class TestWhatsAppInstructions:
    def test_send_whatsapp()
    def test_phone_format()
    def test_message_length()

class TestSMSInstructions:
    def test_send_sms()
    def test_character_limit()
    def test_url_shortening()

class TestReminders:
    def test_get_pending_reminders()
    def test_send_reminder()
    def test_no_duplicates()

class TestCeleryTask:
    def test_task_execution()
    def test_batch_processing()
    def test_error_handling()

class TestFinalReminder:
    def test_final_reminder_timing()
    def test_multi_channel_send()
    def test_urgency_formatting()

class TestEndToEnd:
    def test_complete_flow()
    def test_reminder_schedule()
    def test_stop_after_payment()
```

### Verification Checklist - Reference System

| Component | Test | Expected Result | Status |
|-----------|------|-----------------|--------|
| Reference Generator | Generate 100 refs | All unique | ☐ |
| Format | Check pattern | ORD-{id}-{code} | ☐ |
| Validation | Valid/invalid refs | Correct identification | ☐ |
| Collision | Force collision | Retry successful | ☐ |

### Verification Checklist - Instructions

| Component | Test | Expected Result | Status |
|-----------|------|-----------------|--------|
| Generation | Generate for payment | All sections present | ☐ |
| Bank Details | Format display | All accounts shown | ☐ |
| Amount | Format LKR | ₨ X,XXX.XX format | ☐ |
| Expiry | Format deadline | Correct timezone | ☐ |
| Copy Text | Generate copyable | Plain text format | ☐ |

### Verification Checklist - Email

| Component | Test | Expected Result | Status |
|-----------|------|-----------------|--------|
| Send | Send test email | Received in inbox | ☐ |
| HTML | Render template | Displays correctly | ☐ |
| Plain Text | Check fallback | Readable plain text | ☐ |
| Links | Click all links | Navigate correctly | ☐ |
| Mobile | View on phone | Responsive display | ☐ |

### Verification Checklist - WhatsApp

| Component | Test | Expected Result | Status |
|-----------|------|-----------------|--------|
| Send | Send test message | Delivered | ☐ |
| Formatting | Check bold/emoji | Displays correctly | ☐ |
| Links | Click links | Navigate correctly | ☐ |
| Delivery Status | Check webhook | Status updated | ☐ |

### Verification Checklist - SMS

| Component | Test | Expected Result | Status |
|-----------|------|-----------------|--------|
| Send | Send test SMS | Received < 10 sec | ☐ |
| Length | Count characters | ≤ 160 for short | ☐ |
| URLs | Click shortened URL | Correct destination | ☐ |
| Delivery Report | Check status | Delivered | ☐ |

### Verification Checklist - Reminders

| Component | Test | Expected Result | Status |
|-----------|------|-----------------|--------|
| Query | Get pending | Correct payments | ☐ |
| Send | Send reminder | All channels work | ☐ |
| Duplicates | Attempt duplicate | Prevented | ☐ |
| Final | Send final | Urgent format | ☐ |

### Verification Checklist - Celery Task

| Component | Test | Expected Result | Status |
|-----------|------|-----------------|--------|
| Execution | Run task | Completes | ☐ |
| Batch | 50 payments | Processes all | ☐ |
| Errors | Simulate error | Handles gracefully | ☐ |
| Schedule | Check Beat | Runs hourly | ☐ |

### End-to-End Flow Test Steps

| Step | Action | Expected Result | Status |
|------|--------|-----------------|--------|
| 1 | Create order | Order created | ☐ |
| 2 | Generate payment | Instructions sent (email) | ☐ |
| 3 | Wait 24h (simulate) | Initial reminder sent | ☐ |
| 4 | Wait until 12h before | Follow-up sent | ☐ |
| 5 | Wait until 6h before | Urgent reminder sent | ☐ |
| 6 | Wait until 1h before | Final reminder sent (all channels) | ☐ |
| 7 | Upload proof | Reminders stop | ☐ |
| 8 | Verify payment | Status updated | ☐ |

### Performance Benchmarks

| Metric | Target | Actual | Status |
|--------|--------|--------|--------|
| Generate 100 references | < 1 second | | ☐ |
| Send 100 emails | < 30 seconds | | ☐ |
| Send 100 WhatsApp | < 60 seconds | | ☐ |
| Send 100 SMS | < 90 seconds | | ☐ |
| Celery task (100 payments) | < 5 minutes | | ☐ |

### Error Handling Tests

| Scenario | Expected Behavior | Status |
|----------|-------------------|--------|
| Email server down | Log error, continue | ☐ |
| WhatsApp API error | Try alternate, log | ☐ |
| SMS gateway timeout | Retry, then skip | ☐ |
| Database connection lost | Retry task | ☐ |
| Invalid phone number | Skip WhatsApp/SMS | ☐ |

### Expected Outcome
- Complete test suite covering all components
- All tests passing
- End-to-end flow verified
- Performance benchmarks met
- Error handling validated
- Production-ready system

### Final Verification Checklist

- [ ] All unit tests written and passing
- [ ] Integration tests passing
- [ ] Reference generation tested (100+ unique refs)
- [ ] Instruction generation tested (all formats)
- [ ] Email delivery tested and verified
- [ ] WhatsApp delivery tested and verified
- [ ] SMS delivery tested and verified
- [ ] Reminder queries return correct payments
- [ ] Reminders sent at correct times
- [ ] Duplicate prevention working
- [ ] Final reminders sent via all channels
- [ ] Celery task runs successfully
- [ ] Celery Beat schedule confirmed (hourly)
- [ ] End-to-end flow tested completely
- [ ] Performance benchmarks achieved
- [ ] Error scenarios handled gracefully
- [ ] Logging comprehensive and useful
- [ ] Documentation complete and accurate

---

## Summary

This document completed the multi-channel delivery and automated reminder system for bank transfer payments. The implementation includes:

1. **Multi-Channel Delivery (Tasks 38-40):** Email, WhatsApp, and SMS instruction delivery with channel-specific formatting and optimization
2. **Reminder System (Tasks 41-43):** Automated payment reminders with escalating urgency, multi-channel delivery, and final critical reminder
3. **Task Automation (Task 42):** Celery periodic task for hourly reminder processing with batch handling and error recovery
4. **Comprehensive Verification (Task 44):** Complete test suite validating all components, channels, and end-to-end flows

The system now provides a complete customer communication solution that guides customers through payment, reminds them of pending payments with escalating urgency, and significantly reduces payment abandonment.

### Next Steps
Proceed to **Group-D: Proof Upload & Verification** to implement payment proof upload functionality, image processing, and verification workflows.
