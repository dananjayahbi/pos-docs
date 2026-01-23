# Tasks 07-12: Contact, Tax, Dates, Financial, Marketing, and Notes

> **Phase:** 05 - ERP Core Modules Part 2  
> **SubPhase:** 08 - Customer Module  
> **Group:** A - Customer Model & Profile  
> **Document:** 02 of 03  
> **Tasks Covered:** 07, 08, 09, 10, 11, 12

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [01_Tasks-01-06_App-Setup-Model-Core.md](01_Tasks-01-06_App-Setup-Model-Core.md)
- **→ Next Document:** [03_Tasks-13-18_Source-Code-Image-Index-Migration.md](03_Tasks-13-18_Source-Code-Image-Index-Migration.md)

---

## Document Overview

This document covers the addition of essential customer profile fields including contact information, tax identifiers for Sri Lanka business requirements, date tracking fields, financial summary calculations, marketing preferences, and internal notes.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 07 | Add Customer Contact Fields | Medium | 20 min |
| 08 | Add Customer Tax Fields | Medium | 20 min |
| 09 | Add Customer Date Fields | Medium | 20 min |
| 10 | Add Customer Financial Summary | Medium | 25 min |
| 11 | Add Customer Marketing Fields | Low | 15 min |
| 12 | Add Customer Notes Fields | Low | 15 min |

---

## Task 07: Add Customer Contact Fields

### Overview
Add primary contact fields to the Customer model for basic communication. These fields store the main email and phone numbers used for contacting customers. Detailed multi-address and multi-phone functionality will be handled by separate models in Group B.

### Dependencies
- Task 06: Add Customer Type Fields

### Instructions

1. **Open customer.py model file**
   - Navigate to `apps/customers/models/customer.py`
   - Locate Customer model class

2. **Add email field**
   - EmailField, max_length=255
   - Optional field (blank=True, null=True)
   - Unique per tenant (when provided)
   - Primary email for communication

3. **Add primary_phone field**
   - CharField, max_length=20
   - Optional field (blank=True, null=True)
   - Sri Lanka phone format (+94 XX XXX XXXX)
   - Main contact number

4. **Add secondary_phone field**
   - CharField, max_length=20
   - Optional field (blank=True, null=True)
   - Alternative contact number
   - Backup communication channel

5. **Add phone validation help text**
   - Add help_text to primary_phone
   - Note: "Format: +94 XX XXX XXXX"
   - Add help_text to secondary_phone

6. **Update Meta class indexes**
   - Add index on email field
   - Add index on primary_phone field
   - Both for fast lookup

7. **Update model docstring**
   - Document contact fields
   - Note that detailed addresses/phones are in separate models

### Contact Fields Structure

```
┌─────────────────────────────────────────────────┐
│           Customer Contact Fields               │
├─────────────────────────────────────────────────┤
│  • email (EmailField, optional, unique)         │
│  • primary_phone (CharField, optional)          │
│  • secondary_phone (CharField, optional)        │
└─────────────────────────────────────────────────┘
```

### Field Details

| Field | Type | Required | Max Length | Unique | Purpose |
|-------|------|----------|------------|--------|---------|
| email | EmailField | No | 255 | Yes (per tenant) | Primary email contact |
| primary_phone | CharField | No | 20 | No | Main phone number |
| secondary_phone | CharField | No | 20 | No | Alternate phone number |

### Sri Lanka Phone Format

```
Sri Lanka Phone Number Formats
═══════════════════════════════

Mobile Numbers:
  • Format: +94 7X XXX XXXX
  • Example: +94 77 123 4567
  • Prefixes: 70, 71, 72, 75, 76, 77, 78

Landline Numbers:
  • Format: +94 XX XXX XXXX
  • Example: +94 11 234 5678
  • Colombo: 11
  • Kandy: 81
  • Galle: 91

Compact Format (also accepted):
  • Mobile: 0771234567
  • Landline: 0112345678
```

### Email Usage Scenarios

| Scenario | Email Field Usage |
|----------|------------------|
| Individual customer | Personal email address |
| Business customer | General company email or contact person email |
| Invoice delivery | Primary recipient for digital invoices |
| Password reset | Account recovery email |
| Marketing | Newsletter and promotional emails |
| Order confirmation | Transaction notifications |

### Phone Usage Scenarios

| Field | Usage |
|-------|-------|
| primary_phone | First contact number, SMS notifications, WhatsApp |
| secondary_phone | Alternative contact, backup for urgent matters |

### Contact Field Validation

```
Email Validation Rules
══════════════════════
• Valid email format (user@domain.com)
• Unique per tenant
• Lowercase stored
• Max 255 characters

Phone Validation Rules
═══════════════════════
• Accept with/without +94 prefix
• Accept with/without spaces
• Store in consistent format
• Max 20 characters
```

### Multi-Contact Relationship

```
Customer Model Contact Flow
════════════════════════════

Customer (Basic)
  ├── email (single, primary)
  ├── primary_phone (single, primary)
  └── secondary_phone (single, backup)

CustomerPhone Model (Group B)
  └── Multiple phone numbers with types
      ├── MOBILE
      ├── LANDLINE
      ├── WHATSAPP
      └── WORK

CustomerAddress Model (Group B)
  └── Multiple addresses with types
      ├── BILLING
      ├── SHIPPING
      ├── HOME
      └── WORK
```

### Expected Outcome
- Basic contact information storage
- Email uniqueness enforcement
- Sri Lanka phone format support
- Fast lookup by contact information
- Foundation for communication

### Verification Checklist
- [ ] email field added (EmailField)
- [ ] primary_phone field added
- [ ] secondary_phone field added
- [ ] Email field set as unique per tenant
- [ ] Phone fields have help_text
- [ ] Index added on email
- [ ] Index added on primary_phone
- [ ] Model docstring updated

---

## Task 08: Add Customer Tax Fields

### Overview
Add tax-related fields to support Sri Lanka business taxation requirements. These fields store tax identification numbers, VAT registration, and other tax-related information primarily used for business customers.

### Dependencies
- Task 07: Add Customer Contact Fields

### Instructions

1. **Open customer.py model file**
   - Continue in `apps/customers/models/customer.py`
   - Locate Customer model class

2. **Add tax_id field**
   - CharField, max_length=50
   - Optional field (blank=True, null=True)
   - Sri Lanka Tax Identification Number (TIN)
   - Primarily for business customers

3. **Add vat_number field**
   - CharField, max_length=50
   - Optional field (blank=True, null=True)
   - Sri Lanka VAT registration number
   - For VAT-registered businesses

4. **Add help text to tax fields**
   - tax_id help_text: "Sri Lanka Tax Identification Number (TIN)"
   - vat_number help_text: "VAT Registration Number"

5. **Update model docstring**
   - Document tax fields
   - Note that these are primarily for business customers
   - Mention Sri Lanka tax compliance

### Tax Fields Structure

```
┌─────────────────────────────────────────────────┐
│            Customer Tax Fields                  │
├─────────────────────────────────────────────────┤
│  • tax_id (CharField, optional)                 │
│    Sri Lanka Tax Identification Number          │
│                                                 │
│  • vat_number (CharField, optional)             │
│    VAT Registration Number                      │
└─────────────────────────────────────────────────┘
```

### Field Details

| Field | Type | Required | Max Length | Purpose |
|-------|------|----------|------------|---------|
| tax_id | CharField | No | 50 | Tax Identification Number |
| vat_number | CharField | No | 50 | VAT Registration Number |

### Sri Lanka Tax System

#### Tax Identification Number (TIN)
```
Sri Lanka TIN Format
════════════════════

Individual TIN:
  • Format: 9 digits
  • Example: 123456789
  • Issued by: Inland Revenue Department

Business TIN:
  • Format: 9 digits
  • Example: 987654321
  • Issued to: Companies, partnerships
```

#### VAT Registration Number
```
Sri Lanka VAT Number Format
════════════════════════════

Standard Format:
  • Format: XXX-XXXXXXX-XXX
  • Example: 123-4567890-001
  • Components:
    - Branch code (3 digits)
    - Registration number (7 digits)
    - Check digits (3 digits)

Compact Format:
  • Format: 13 digits
  • Example: 1234567890001
```

### Tax Field Requirements by Customer Type

| Customer Type | tax_id | vat_number | Notes |
|--------------|--------|------------|-------|
| INDIVIDUAL | Optional | Rarely used | For high-income individuals |
| BUSINESS | Recommended | Optional | VAT if turnover > threshold |
| GOVERNMENT | N/A | N/A | Exempt from VAT |
| NONPROFIT | Optional | N/A | Usually tax-exempt |

### VAT Registration Threshold (Sri Lanka)

```
VAT Registration Requirements
══════════════════════════════

Mandatory Registration:
  • Annual turnover > LKR 12 million
  • Must register within 30 days

Voluntary Registration:
  • Any business can register
  • Benefits: Input tax credits
```

### Tax Document Requirements

| Document Type | Requires TIN | Requires VAT |
|--------------|-------------|--------------|
| Tax Invoice | Yes | If VAT registered |
| Credit Note | Yes | If VAT registered |
| Debit Note | Yes | If VAT registered |
| Export Invoice | Yes | Yes (for refunds) |

### Tax Compliance Use Cases

| Scenario | Fields Used | Purpose |
|----------|------------|---------|
| B2B Invoice | tax_id, vat_number | Tax-compliant invoicing |
| VAT Return | vat_number | Sales VAT calculation |
| Tax Declaration | tax_id | Revenue reporting |
| Credit Limit | tax_id | Credit verification |
| Export Documentation | tax_id, vat_number | Customs clearance |

### Expected Outcome
- Tax identification storage
- VAT registration tracking
- Sri Lanka tax compliance support
- Business taxation requirements met
- Invoice generation data available

### Verification Checklist
- [ ] tax_id field added
- [ ] vat_number field added
- [ ] Both fields optional (blank=True, null=True)
- [ ] Help text added to tax_id
- [ ] Help text added to vat_number
- [ ] Max length set to 50 characters
- [ ] Model docstring updated

---

## Task 09: Add Customer Date Fields

### Overview
Add date tracking fields to monitor customer lifecycle events and purchase activity. These fields help analyze customer behavior, identify inactive customers, and track engagement over time.

### Dependencies
- Task 08: Add Customer Tax Fields

### Instructions

1. **Open customer.py model file**
   - Continue in `apps/customers/models/customer.py`
   - Locate Customer model class

2. **Add first_purchase_date field**
   - DateField, optional (blank=True, null=True)
   - Set when customer makes first purchase
   - Immutable after set

3. **Add last_purchase_date field**
   - DateField, optional (blank=True, null=True)
   - Updated with each new purchase
   - Used to identify inactive customers

4. **Add last_contact_date field**
   - DateField, optional (blank=True, null=True)
   - Updated when staff contacts customer
   - Tracks engagement

5. **Add next_follow_up_date field**
   - DateField, optional (blank=True, null=True)
   - Scheduled follow-up date
   - Used for sales reminders

6. **Add date_of_birth field**
   - DateField, optional (blank=True, null=True)
   - For INDIVIDUAL customers
   - Used for birthday promotions

7. **Update Meta class indexes**
   - Add index on last_purchase_date
   - Add index on next_follow_up_date
   - Both for querying inactive/due customers

8. **Update model docstring**
   - Document date tracking purpose
   - Explain each date field usage

### Date Fields Structure

```
┌─────────────────────────────────────────────────┐
│            Customer Date Fields                 │
├─────────────────────────────────────────────────┤
│ Purchase Tracking:                              │
│  • first_purchase_date (DateField)              │
│  • last_purchase_date (DateField)               │
│                                                 │
│ Engagement Tracking:                            │
│  • last_contact_date (DateField)                │
│  • next_follow_up_date (DateField)              │
│                                                 │
│ Personal Information:                           │
│  • date_of_birth (DateField)                    │
└─────────────────────────────────────────────────┘
```

### Field Details

| Field | Type | Required | Auto-Updated | Purpose |
|-------|------|----------|--------------|---------|
| first_purchase_date | DateField | No | Once only | First transaction date |
| last_purchase_date | DateField | No | Each purchase | Latest transaction date |
| last_contact_date | DateField | No | Manual | Latest communication |
| next_follow_up_date | DateField | No | Manual | Scheduled follow-up |
| date_of_birth | DateField | No | Manual | Birthday information |

### Date Field Usage Patterns

#### First Purchase Date
```
First Purchase Date Tracking
═════════════════════════════

Purpose:
  • Customer acquisition date
  • Lifetime calculation
  • Cohort analysis

Setting Logic:
  • Set once on first order
  • Never updated
  • Used to calculate customer age

Example:
  Customer created: 2026-01-01
  First purchase: 2026-01-15
  first_purchase_date = 2026-01-15
```

#### Last Purchase Date
```
Last Purchase Date Tracking
════════════════════════════

Purpose:
  • Identify inactive customers
  • Calculate recency
  • Trigger re-engagement

Update Logic:
  • Updated with each purchase
  • Used for RFM analysis
  • Triggers after X days inactive

Example:
  Purchase 1: 2025-12-01
  Purchase 2: 2026-01-15
  last_purchase_date = 2026-01-15
```

### Customer Lifecycle Analysis

```
Customer Lifecycle States
═════════════════════════

New Customer:
  • first_purchase_date is null
  • Status: Registered but no purchase

Active Customer:
  • last_purchase_date within 90 days
  • Status: Regular purchaser

At Risk:
  • last_purchase_date 90-180 days ago
  • Trigger: Re-engagement campaign

Inactive:
  • last_purchase_date > 180 days ago
  • Trigger: Win-back campaign

Dormant:
  • last_purchase_date > 365 days ago
  • Consider: Archive status
```

### Follow-up Management

```
Follow-up Date Workflow
═══════════════════════

Set Follow-up:
  1. Customer requests callback
  2. Staff schedules follow-up
  3. next_follow_up_date = scheduled_date

Daily Query:
  SELECT * FROM customers
  WHERE next_follow_up_date = TODAY
  AND status = 'ACTIVE'

After Contact:
  1. Staff contacts customer
  2. last_contact_date = TODAY
  3. next_follow_up_date = NULL or next date
```

### Birthday Promotions

```
Birthday Campaign Workflow
══════════════════════════

Monthly Query:
  SELECT * FROM customers
  WHERE MONTH(date_of_birth) = CURRENT_MONTH
  AND customer_type = 'INDIVIDUAL'
  AND accepts_marketing = true

Campaign Actions:
  • Birthday discount coupon
  • Personalized email
  • SMS greeting
  • Special offer valid 7 days
```

### Date-Based Reporting

| Report | Date Fields Used | Calculation |
|--------|-----------------|-------------|
| New Customers | first_purchase_date | Count by month |
| Active Customers | last_purchase_date | Within 90 days |
| Customer Lifetime | first_purchase_date, current_date | Days since first purchase |
| Purchase Frequency | first_purchase_date, last_purchase_date, order_count | Orders / days active |
| Due Follow-ups | next_follow_up_date | Where date = today |

### Sri Lanka Context

#### Festival-Based Campaigns
```
Sri Lanka Festival Dates
════════════════════════

Use date fields to trigger campaigns:
  • Sinhala/Tamil New Year (April 13-14)
  • Vesak (May)
  • Christmas (December 25)
  • Deepavali (October/November)

Campaign Logic:
  If last_purchase_date within festival season:
    → Send festival greeting + discount
```

### Expected Outcome
- Comprehensive date tracking
- Customer lifecycle monitoring
- Inactive customer identification
- Follow-up management support
- Birthday campaign capability

### Verification Checklist
- [ ] first_purchase_date field added
- [ ] last_purchase_date field added
- [ ] last_contact_date field added
- [ ] next_follow_up_date field added
- [ ] date_of_birth field added
- [ ] All date fields optional
- [ ] Index on last_purchase_date
- [ ] Index on next_follow_up_date
- [ ] Model docstring updated

---

## Task 10: Add Customer Financial Summary

### Overview
Add denormalized financial summary fields to the Customer model for quick access to customer spending and payment history. These fields improve performance by avoiding complex aggregation queries and support credit limit management.

### Dependencies
- Task 09: Add Customer Date Fields

### Instructions

1. **Open customer.py model file**
   - Continue in `apps/customers/models/customer.py`
   - Locate Customer model class

2. **Add total_purchases field**
   - DecimalField, max_digits=15, decimal_places=2
   - Default to Decimal('0.00')
   - Sum of all completed orders
   - Updated on order completion

3. **Add total_payments field**
   - DecimalField, max_digits=15, decimal_places=2
   - Default to Decimal('0.00')
   - Sum of all payments received
   - Updated on payment recording

4. **Add outstanding_balance field**
   - DecimalField, max_digits=15, decimal_places=2
   - Default to Decimal('0.00')
   - Calculated: total_purchases - total_payments
   - Represents amount owed

5. **Add order_count field**
   - IntegerField, default=0
   - Total number of orders
   - Incremented on each order

6. **Add credit_limit field**
   - DecimalField, max_digits=15, decimal_places=2
   - Optional (blank=True, null=True)
   - Maximum allowed outstanding balance
   - Primarily for business customers

7. **Add average_order_value property**
   - Create @property method
   - Calculate: total_purchases / order_count
   - Return Decimal('0.00') if order_count is 0

8. **Add credit_available property**
   - Create @property method
   - Calculate: credit_limit - outstanding_balance
   - Return None if credit_limit is null

9. **Update Meta class indexes**
   - Add index on outstanding_balance
   - Add index on total_purchases
   - For financial queries

10. **Update model docstring**
    - Document denormalized financial fields
    - Note update triggers

### Financial Summary Fields Structure

```
┌─────────────────────────────────────────────────┐
│          Customer Financial Summary             │
├─────────────────────────────────────────────────┤
│ Stored Fields (Denormalized):                   │
│  • total_purchases (Decimal, 15.2)              │
│  • total_payments (Decimal, 15.2)               │
│  • outstanding_balance (Decimal, 15.2)          │
│  • order_count (Integer)                        │
│  • credit_limit (Decimal, 15.2, optional)       │
│                                                 │
│ Calculated Properties:                          │
│  • average_order_value                          │
│  • credit_available                             │
└─────────────────────────────────────────────────┘
```

### Field Details

| Field | Type | Default | Purpose |
|-------|------|---------|---------|
| total_purchases | Decimal(15,2) | 0.00 | Sum of all order totals |
| total_payments | Decimal(15,2) | 0.00 | Sum of all payments |
| outstanding_balance | Decimal(15,2) | 0.00 | Amount owed by customer |
| order_count | Integer | 0 | Total number of orders |
| credit_limit | Decimal(15,2) | null | Maximum credit allowed |

### Financial Calculation Logic

```
Financial Summary Updates
═════════════════════════

On Order Completion:
  total_purchases += order.total_amount
  order_count += 1
  outstanding_balance = total_purchases - total_payments

On Payment Received:
  total_payments += payment.amount
  outstanding_balance = total_purchases - total_payments

On Refund:
  total_purchases -= refund.amount
  outstanding_balance = total_purchases - total_payments
```

### Credit Management

```
Credit Limit Workflow
═════════════════════

Set Credit Limit:
  • Business customers only
  • Based on credit evaluation
  • Example: credit_limit = 100000.00

Check Credit:
  credit_available = credit_limit - outstanding_balance

  If credit_available >= order_amount:
    → Allow order on credit
  Else:
    → Require payment first

Block Customer:
  If outstanding_balance > credit_limit:
    → status = BLOCKED
    → Require payment to unblock
```

### Outstanding Balance Scenarios

| Scenario | total_purchases | total_payments | outstanding_balance | Status |
|----------|----------------|----------------|---------------------|--------|
| Paid in full | 100,000 | 100,000 | 0 | Clean |
| Partial payment | 100,000 | 50,000 | 50,000 | Owing |
| Overpayment | 100,000 | 110,000 | -10,000 | Credit balance |
| No payments | 100,000 | 0 | 100,000 | Full debt |

### Average Order Value Usage

```
Average Order Value Calculation
════════════════════════════════

Property Method:
  @property
  def average_order_value(self):
      if self.order_count > 0:
          return self.total_purchases / self.order_count
      return Decimal('0.00')

Usage:
  • Customer segmentation
  • High-value customer identification
  • Sales performance analysis

Example:
  total_purchases = 150,000
  order_count = 25
  average_order_value = 6,000
```

### Customer Segmentation by Value

| Segment | total_purchases | average_order_value | Strategy |
|---------|----------------|---------------------|----------|
| VIP | > 500,000 | > 20,000 | Dedicated account manager |
| High Value | 200,000 - 500,000 | 10,000 - 20,000 | Priority support |
| Medium Value | 50,000 - 200,000 | 5,000 - 10,000 | Regular engagement |
| Low Value | < 50,000 | < 5,000 | Standard service |

### Financial Alerts

```
Automated Financial Alerts
══════════════════════════

Alert Triggers:
  • outstanding_balance > credit_limit
    → Block customer, send notification

  • outstanding_balance > 0 for > 30 days
    → Send payment reminder

  • outstanding_balance > 0 for > 60 days
    → Escalate to collections

  • total_purchases > 100,000 (milestone)
    → Award VIP status
```

### Sri Lanka Business Context

#### Credit Terms
```
Sri Lanka Standard Credit Terms
════════════════════════════════

Industry Standards:
  • 30 days net: Payment due in 30 days
  • 60 days: Extended credit for large customers
  • COD: Cash on delivery for new/risky customers

Credit Limits by Business Size:
  • Small business: LKR 50,000 - 200,000
  • Medium business: LKR 200,000 - 1,000,000
  • Large business: LKR 1,000,000+
```

### Expected Outcome
- Fast access to financial summaries
- Credit limit management
- Outstanding balance tracking
- Customer value analysis
- Performance optimization

### Verification Checklist
- [ ] total_purchases field added
- [ ] total_payments field added
- [ ] outstanding_balance field added
- [ ] order_count field added
- [ ] credit_limit field added
- [ ] All Decimal fields use max_digits=15, decimal_places=2
- [ ] average_order_value property created
- [ ] credit_available property created
- [ ] Indexes added on financial fields
- [ ] Model docstring updated

---

## Task 11: Add Customer Marketing Fields

### Overview
Add fields to manage customer marketing preferences and track marketing communication history. These fields ensure GDPR/privacy compliance and enable targeted marketing campaigns.

### Dependencies
- Task 10: Add Customer Financial Summary

### Instructions

1. **Open customer.py model file**
   - Continue in `apps/customers/models/customer.py`
   - Locate Customer model class

2. **Add accepts_marketing field**
   - BooleanField, default=False
   - Explicit opt-in for marketing communications
   - Required for email marketing

3. **Add marketing_opt_in_date field**
   - DateTimeField, optional (blank=True, null=True)
   - Set when customer opts in
   - Audit trail for consent

4. **Add marketing_opt_out_date field**
   - DateTimeField, optional (blank=True, null=True)
   - Set when customer opts out
   - Track unsubscribe events

5. **Add last_marketing_email_sent field**
   - DateTimeField, optional (blank=True, null=True)
   - Last marketing email sent date
   - Prevent over-communication

6. **Add marketing_email_count field**
   - IntegerField, default=0
   - Total marketing emails sent
   - Track engagement frequency

7. **Update model docstring**
   - Document marketing consent tracking
   - Note privacy compliance purpose

### Marketing Fields Structure

```
┌─────────────────────────────────────────────────┐
│          Customer Marketing Fields              │
├─────────────────────────────────────────────────┤
│ Consent Management:                             │
│  • accepts_marketing (Boolean)                  │
│  • marketing_opt_in_date (DateTime)             │
│  • marketing_opt_out_date (DateTime)            │
│                                                 │
│ Communication Tracking:                         │
│  • last_marketing_email_sent (DateTime)         │
│  • marketing_email_count (Integer)              │
└─────────────────────────────────────────────────┘
```

### Field Details

| Field | Type | Default | Purpose |
|-------|------|---------|---------|
| accepts_marketing | BooleanField | False | Opt-in consent flag |
| marketing_opt_in_date | DateTimeField | null | Consent timestamp |
| marketing_opt_out_date | DateTimeField | null | Unsubscribe timestamp |
| last_marketing_email_sent | DateTimeField | null | Last campaign date |
| marketing_email_count | Integer | 0 | Total emails sent |

### Marketing Consent Workflow

```
Marketing Opt-In/Opt-Out Flow
══════════════════════════════

Customer Registration:
  accepts_marketing = False (default)
  → Explicit opt-in required

Opt-In Process:
  1. Customer checks "Subscribe to newsletter"
  2. accepts_marketing = True
  3. marketing_opt_in_date = current_datetime
  4. Send welcome email

Opt-Out Process:
  1. Customer clicks unsubscribe link
  2. accepts_marketing = False
  3. marketing_opt_out_date = current_datetime
  4. Remove from marketing lists
```

### Email Frequency Management

```
Marketing Email Throttling
══════════════════════════

Rules:
  • Maximum 2 emails per week
  • Minimum 3 days between emails
  • No emails if last_sent < 3 days ago

Check Before Sending:
  if last_marketing_email_sent:
      days_since = (now - last_marketing_email_sent).days
      if days_since < 3:
          → Skip this customer

After Sending:
  last_marketing_email_sent = now
  marketing_email_count += 1
```

### Marketing Compliance

| Regulation | Field Used | Compliance Action |
|-----------|-----------|-------------------|
| GDPR | accepts_marketing | Explicit consent required |
| CAN-SPAM | marketing_opt_out_date | Honor unsubscribe |
| Privacy Laws | marketing_opt_in_date | Consent audit trail |
| Best Practices | last_marketing_email_sent | Prevent spam |

### Marketing Segmentation

```
Marketing Segment Queries
═════════════════════════

Active Subscribers:
  WHERE accepts_marketing = true
  AND status = 'ACTIVE'

Recent Subscribers:
  WHERE accepts_marketing = true
  AND marketing_opt_in_date >= (now - 30 days)

Engaged Customers:
  WHERE accepts_marketing = true
  AND last_purchase_date >= (now - 90 days)

Low Engagement:
  WHERE accepts_marketing = true
  AND last_marketing_email_sent IS NOT NULL
  AND marketing_email_count > 10
  AND last_purchase_date < (now - 180 days)
  → Consider re-engagement campaign or remove
```

### Marketing Campaign Types

| Campaign Type | Target Audience | Frequency |
|--------------|-----------------|-----------|
| Newsletter | All subscribers | Weekly |
| Promotions | Active customers | Bi-weekly |
| Birthday | Individual customers with DOB | Yearly |
| Win-back | Inactive subscribers | Monthly |
| New Product | High-value customers | As needed |

### Unsubscribe Handling

```
Unsubscribe Process
═══════════════════

Email Footer Link:
  "Unsubscribe from marketing emails"
  → Links to unsubscribe page

Unsubscribe Page:
  1. Confirm customer email
  2. Set accepts_marketing = False
  3. Set marketing_opt_out_date = now
  4. Show confirmation message
  5. Send confirmation email (transactional, not marketing)

Transactional Emails:
  • Order confirmations
  • Invoices
  • Password resets
  → Always sent, regardless of accepts_marketing
```

### Sri Lanka Context

#### Local Marketing Channels
```
Sri Lanka Marketing Preferences
════════════════════════════════

Common Channels:
  • Email: Growing adoption
  • SMS: Very popular
  • WhatsApp: Extremely popular
  • Viber: Common

Future Expansion:
  • Add accepts_sms field
  • Add accepts_whatsapp field
  • Add mobile_marketing_opt_in_date
```

### Expected Outcome
- Marketing consent management
- Privacy compliance
- Communication frequency control
- Audit trail for opt-in/opt-out
- Targeted campaign support

### Verification Checklist
- [ ] accepts_marketing field added (default=False)
- [ ] marketing_opt_in_date field added
- [ ] marketing_opt_out_date field added
- [ ] last_marketing_email_sent field added
- [ ] marketing_email_count field added (default=0)
- [ ] All DateTime fields optional
- [ ] Model docstring updated

---

## Task 12: Add Customer Notes Fields

### Overview
Add notes fields to the Customer model for storing general and internal notes. These fields provide staff with a place to record important customer information, preferences, special requirements, and internal observations.

### Dependencies
- Task 11: Add Customer Marketing Fields

### Instructions

1. **Open customer.py model file**
   - Continue in `apps/customers/models/customer.py`
   - Locate Customer model class

2. **Add notes field**
   - TextField, optional (blank=True, null=True)
   - General customer notes
   - Visible to all staff
   - Customer preferences, special requests

3. **Add internal_notes field**
   - TextField, optional (blank=True, null=True)
   - Internal staff notes
   - Not visible to customer
   - Sensitive information, warnings

4. **Add help text to notes fields**
   - notes help_text: "General notes about customer (visible to all staff)"
   - internal_notes help_text: "Internal notes (not visible to customer)"

5. **Update model docstring**
   - Document notes fields purpose
   - Distinguish between notes and internal_notes

### Notes Fields Structure

```
┌─────────────────────────────────────────────────┐
│            Customer Notes Fields                │
├─────────────────────────────────────────────────┤
│  • notes (TextField, optional)                  │
│    General customer notes                       │
│    Visible to all staff                         │
│                                                 │
│  • internal_notes (TextField, optional)         │
│    Internal staff notes                         │
│    Not visible to customer                      │
└─────────────────────────────────────────────────┘
```

### Field Details

| Field | Type | Required | Visibility | Purpose |
|-------|------|----------|------------|---------|
| notes | TextField | No | All staff | Customer preferences and information |
| internal_notes | TextField | No | Staff only | Sensitive internal information |

### Notes Field Usage

#### General Notes Examples
```
General Customer Notes
══════════════════════

Preferences:
  "Prefers delivery after 6 PM"
  "Always requests extra packaging"
  "VIP customer - priority service"

Special Requirements:
  "Requires invoice in Tamil"
  "Company purchase order needed"
  "Delivery to warehouse entrance only"

Contact Preferences:
  "Prefers WhatsApp communication"
  "Contact only on weekdays"
  "Speak with Mr. Perera (manager)"

Product Preferences:
  "Only purchases organic products"
  "Prefers Brand A over Brand B"
  "Regular buyer of Product X"
```

#### Internal Notes Examples
```
Internal Staff Notes
════════════════════

Payment Warnings:
  "Previous payment delays - require prepayment"
  "Check bounced on 2025-12-15 - cash only"
  "Credit limit reached - manager approval required"

Customer Issues:
  "Frequently complains - handle with care"
  "Price haggler - hold firm on pricing"
  "Returns many items - inspect closely"

Special Handling:
  "Connected to owner - VIP treatment"
  "Competitor's relative - be professional"
  "Large account - senior staff only"

Security Concerns:
  "Suspected fraud - verify ID always"
  "Disputed charges previously"
  "Banned from store temporarily (resolved)"
```

### Notes vs Internal Notes

| Aspect | notes | internal_notes |
|--------|-------|----------------|
| Visibility | All staff | Staff only (not customer) |
| Content | Customer preferences | Sensitive observations |
| API exposure | May be shown to customer | Never exposed |
| Purpose | Service quality | Risk management |
| Examples | "Likes blue color" | "Payment risk" |

### Notes Field Best Practices

```
Notes Writing Guidelines
════════════════════════

General Notes (notes):
  ✅ DO:
    • Customer preferences
    • Service requests
    • Delivery instructions
    • Contact preferences

  ❌ DON'T:
    • Negative judgments
    • Sensitive personal info
    • Payment warnings
    • Security concerns

Internal Notes (internal_notes):
  ✅ DO:
    • Payment history concerns
    • Return patterns
    • Pricing negotiations
    • Security flags

  ❌ DON'T:
    • Discriminatory comments
    • Unverified accusations
    • Personal attacks
    • Irrelevant information
```

### Notes in Customer Service Flow

```
POS Transaction Flow
════════════════════

1. Select Customer
   ↓
2. Display Customer Card
   ├── Basic Info
   ├── Outstanding Balance
   ├── Notes (if any)
   └── [Internal Notes - staff view only]
   ↓
3. Alert if Internal Notes exist
   → "⚠️ See internal notes"
   ↓
4. Proceed with transaction
```

### Notes Search and Filtering

| Use Case | Search In | Example Query |
|----------|-----------|---------------|
| Find VIP | notes | WHERE notes ILIKE '%VIP%' |
| Payment risks | internal_notes | WHERE internal_notes ILIKE '%payment%' |
| Delivery requirements | notes | WHERE notes ILIKE '%delivery%' |
| Manager approval needed | internal_notes | WHERE internal_notes ILIKE '%manager approval%' |

### Sri Lanka Context Examples

```
Sri Lanka-Specific Notes
════════════════════════

Language Preferences:
  notes: "Prefers communication in Sinhala"
  notes: "Tamil invoices required"

Location-Specific:
  notes: "Difficult to find address - call when nearby"
  notes: "Gate locked - ring bell twice"

Cultural Considerations:
  notes: "Closed on Poya days"
  notes: "Buddhist - no leather products"

Business Hours:
  notes: "Government office - deliver 9 AM - 4 PM only"
  notes: "Shop closed on Sundays"
```

### Expected Outcome
- Flexible note-taking capability
- Distinction between public and internal notes
- Customer service enhancement
- Risk management support
- Staff communication tool

### Verification Checklist
- [ ] notes field added (TextField)
- [ ] internal_notes field added (TextField)
- [ ] Both fields optional (blank=True, null=True)
- [ ] Help text added to notes
- [ ] Help text added to internal_notes
- [ ] Model docstring updated
- [ ] Clear distinction documented

---

## Summary

This document added essential customer profile fields:

### Completed Fields
- ✅ Contact fields (email, primary/secondary phone)
- ✅ Tax fields (TIN, VAT number)
- ✅ Date tracking (purchases, contact, follow-up, birthday)
- ✅ Financial summary (purchases, payments, balance, credit limit)
- ✅ Marketing preferences (consent, opt-in/out tracking)
- ✅ Notes fields (general and internal)

### Key Achievements
1. **Communication** - Contact information storage
2. **Tax Compliance** - Sri Lanka taxation support
3. **Lifecycle Tracking** - Customer engagement monitoring
4. **Financial Management** - Denormalized summary fields
5. **Marketing Control** - Privacy-compliant consent management
6. **Staff Tools** - Notes for service enhancement

### Next Steps
Proceed to [03_Tasks-13-18_Source-Code-Image-Index-Migration.md](03_Tasks-13-18_Source-Code-Image-Index-Migration.md) to add customer source tracking, customer code generator, profile image support, database indexes, constraints, and run migrations.

---

**Document Status:** ✅ Complete  
**Total Tasks:** 6  
**Total Lines:** ~1350
