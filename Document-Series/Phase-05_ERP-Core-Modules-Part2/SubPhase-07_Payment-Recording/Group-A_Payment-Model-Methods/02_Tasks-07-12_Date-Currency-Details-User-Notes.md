# Tasks 07-12: Date, Currency, Details, User, and Notes Fields

> **Phase:** 05 - ERP Core Modules Part 2  
> **SubPhase:** 07 - Payment Recording  
> **Group:** A - Payment Model & Methods  
> **Document:** 02 of 03  
> **Tasks Covered:** 07, 08, 09, 10, 11, 12

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [01_Tasks-01-06_App-Setup-Model-Core.md](01_Tasks-01-06_App-Setup-Model-Core.md)
- **→ Next Document:** [03_Tasks-13-18_Number-Gen-Config-Index-Migration.md](03_Tasks-13-18_Number-Gen-Config-Index-Migration.md)

---

## Document Overview

This document extends the Payment model with critical operational fields including date tracking (payment date, processing timestamps), multi-currency support for international transactions, method-specific details storage, external reference tracking, user accountability, and internal notes. These additions enable comprehensive payment tracking and audit capabilities.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 07 | Add Payment Date Fields | Medium | 20 min |
| 08 | Add Payment Currency Fields | Medium | 20 min |
| 09 | Add Payment Method Details | Medium | 20 min |
| 10 | Add Payment Reference Number | Low | 15 min |
| 11 | Add Payment User Fields | Medium | 20 min |
| 12 | Add Payment Notes Fields | Low | 15 min |

---

## Task 07: Add Payment Date Fields

### Overview
Add comprehensive date and timestamp tracking to capture when payment was made, when it was processed in the system, and when it was cancelled (if applicable). These fields are critical for financial reconciliation, reporting, and audit trails.

### Dependencies
- Task 06: Add Payment Reference Fields
- Payment model exists with core fields

### Instructions

1. **Open payment.py model file**
   - Continue editing `apps/payments/models/payment.py`
   - Import timezone utilities if needed

2. **Add payment_date field**
   - Type: `DateField`
   - Required: No (nullable)
   - Default: Current date when payment recorded
   - Purpose: The actual date the payment was made by customer
   - Example: Check dated 2026-01-20, or card transaction date
   - May differ from created_at (system record creation)

3. **Add processed_at field**
   - Type: `DateTimeField`
   - Required: No (nullable)
   - Default: None
   - Purpose: When payment status changed to COMPLETED
   - Set automatically when status transitions to COMPLETED
   - Used for processing time analysis

4. **Add cancelled_at field**
   - Type: `DateTimeField`
   - Required: No (nullable)
   - Default: None
   - Purpose: When payment was cancelled
   - Set automatically when status changes to CANCELLED
   - Audit trail for cancellations

5. **Add helper methods for date handling**
   - `is_processed()`: Returns True if processed_at is set
   - `is_cancelled()`: Returns True if cancelled_at is set
   - `processing_duration()`: Calculate time from created_at to processed_at
   - `is_dated_check()`: Special handling for post-dated checks

6. **Add validation for date consistency**
   - payment_date should not be future date (except post-dated checks)
   - processed_at should be after created_at
   - cancelled_at should be after created_at
   - Cannot have both processed_at and cancelled_at set

### Extended Model Structure

```
Payment Model (Date Fields)
├── [Core and Reference Fields from Previous Tasks]
├── payment_date          [DateField, nullable]
├── processed_at          [DateTimeField, nullable]
└── cancelled_at          [DateTimeField, nullable]
```

### Date Field Specifications

| Field | Type | Required | Auto-Set | Purpose |
|-------|------|----------|----------|---------|
| payment_date | DateField | No | Default: today | Actual payment date |
| processed_at | DateTimeField | No | On COMPLETED | Processing timestamp |
| cancelled_at | DateTimeField | No | On CANCELLED | Cancellation timestamp |

### Date Field Usage Scenarios

**Scenario 1: Immediate Cash Payment**
```
Customer pays cash at POS:
- created_at:    2026-01-23 10:30:00  (system record time)
- payment_date:  2026-01-23           (same day)
- processed_at:  2026-01-23 10:30:05  (processed immediately)
- cancelled_at:  NULL
```

**Scenario 2: Post-Dated Check**
```
Customer provides check dated 2026-02-15:
- created_at:    2026-01-23 14:20:00  (check received)
- payment_date:  2026-02-15           (future date - check date)
- processed_at:  NULL                 (pending clearance)
- cancelled_at:  NULL
- status:        PENDING

After check clears on 2026-02-17:
- processed_at:  2026-02-17 09:00:00
- status:        COMPLETED
```

**Scenario 3: Bank Transfer (Delayed Verification)**
```
Customer initiates transfer:
- created_at:    2026-01-23 15:00:00  (payment recorded)
- payment_date:  2026-01-23           (transfer date)
- processed_at:  NULL                 (awaiting verification)
- status:        PENDING

Transfer verified next day:
- processed_at:  2026-01-24 10:15:00
- status:        COMPLETED
```

**Scenario 4: Cancelled Payment**
```
Payment entered incorrectly and cancelled:
- created_at:    2026-01-23 11:00:00
- payment_date:  2026-01-23
- processed_at:  NULL
- cancelled_at:  2026-01-23 11:05:00
- status:        CANCELLED
```

### Processing Duration Analysis

```
Processing time metrics:

Immediate methods (CASH, CARD):
- Duration: < 1 minute
- processed_at - created_at ≈ seconds

Verification methods (BANK_TRANSFER):
- Duration: 1-2 business days
- Requires bank confirmation

Delayed methods (CHECK):
- Duration: 3-5 business days
- Post-dated checks: Days to months
```

### Sri Lankan Banking Context

**Business Days:**
- Monday to Friday: Normal banking days
- Weekends: No check clearing
- Public holidays: No processing
- Check clearing: Typically 3 working days

**Common Scenarios:**
- Cash: Immediate processing
- Card: Immediate or next business day
- Check: 3-5 days clearing period
- Bank transfer: Same day or next day verification

### Expected Outcome
- Comprehensive date tracking for all payment events
- Support for post-dated checks
- Processing duration analysis capability
- Proper audit trail for date-sensitive operations

### Verification Checklist
- [ ] payment_date DateField added
- [ ] processed_at DateTimeField added
- [ ] cancelled_at DateTimeField added
- [ ] All date fields are nullable
- [ ] Helper methods for date checks implemented
- [ ] Validation for date consistency added

---

## Task 08: Add Payment Currency Fields

### Overview
Add multi-currency support to the Payment model to handle international transactions and foreign currency payments. While LKR (Sri Lankan Rupee) will be the default and most common currency, support for USD, EUR, and other currencies enables cross-border business operations and tourism-related sales.

### Dependencies
- Task 07: Add Payment Date Fields
- Payment model exists

### Instructions

1. **Open payment.py model file**
   - Continue editing `apps/payments/models/payment.py`
   - Import currency-related utilities if available

2. **Add currency field**
   - Type: `CharField`
   - Max length: 3 characters (ISO 4217 currency codes)
   - Required: Yes
   - Default: `'LKR'` (Sri Lankan Rupee)
   - Common values: LKR, USD, EUR, GBP, INR
   - ISO 4217 standard codes

3. **Add exchange_rate field**
   - Type: `DecimalField`
   - Max digits: 12
   - Decimal places: 6
   - Required: No (nullable)
   - Default: None (NULL for LKR payments)
   - Purpose: Exchange rate used if foreign currency
   - Example: 1 USD = 325.500000 LKR

4. **Add amount_in_base_currency field**
   - Type: `DecimalField`
   - Max digits: 15
   - Decimal places: 2
   - Required: No (nullable)
   - Purpose: Amount converted to LKR (base currency)
   - Calculated: amount × exchange_rate
   - Used for reports in single currency

5. **Add currency conversion helper methods**
   - `is_foreign_currency()`: Returns True if currency != 'LKR'
   - `get_base_amount()`: Returns amount_in_base_currency or amount
   - `convert_to_base()`: Calculate and set amount_in_base_currency
   - `format_amount()`: Format with currency symbol

6. **Add currency validation**
   - Validate currency is valid ISO 4217 code
   - If foreign currency, exchange_rate must be provided
   - If foreign currency, amount_in_base_currency should be set
   - Exchange rate must be positive

### Extended Model Structure

```
Payment Model (Currency Fields)
├── [Previous Fields]
├── currency                   [CharField(3), default='LKR']
├── exchange_rate              [DecimalField(12,6), nullable]
└── amount_in_base_currency    [DecimalField(15,2), nullable]
```

### Currency Field Specifications

| Field | Type | Required | Default | Purpose |
|-------|------|----------|---------|---------|
| currency | CharField(3) | Yes | 'LKR' | ISO 4217 code |
| exchange_rate | Decimal(12,6) | No | NULL | Conversion rate |
| amount_in_base_currency | Decimal(15,2) | No | NULL | Amount in LKR |

### Currency Examples

**Scenario 1: Local LKR Payment**
```
Payment in Sri Lankan Rupees:
- amount:                  10000.00
- currency:                'LKR'
- exchange_rate:           NULL
- amount_in_base_currency: NULL

Interpretation: Direct LKR payment, no conversion needed
```

**Scenario 2: USD Payment (Tourism)**
```
Tourist pays in US Dollars:
- amount:                  100.00
- currency:                'USD'
- exchange_rate:           325.50
- amount_in_base_currency: 32550.00

Calculation: 100.00 USD × 325.50 = 32,550.00 LKR
```

**Scenario 3: EUR Payment**
```
European customer pays in Euros:
- amount:                  80.00
- currency:                'EUR'
- exchange_rate:           358.25
- amount_in_base_currency: 28660.00

Calculation: 80.00 EUR × 358.25 = 28,660.00 LKR
```

### Common Currency Codes (Sri Lankan Context)

| Code | Currency | Typical Use Case | Approx. Rate (2026) |
|------|----------|------------------|---------------------|
| LKR | Sri Lankan Rupee | Domestic transactions | 1.00 (base) |
| USD | US Dollar | Tourism, imports | ~325 LKR |
| EUR | Euro | European tourists, imports | ~355 LKR |
| GBP | British Pound | UK tourists, imports | ~410 LKR |
| INR | Indian Rupee | Indian tourists, cross-border | ~3.9 LKR |
| AUD | Australian Dollar | Australian tourists | ~210 LKR |
| JPY | Japanese Yen | Japanese tourists | ~2.2 LKR |
| SGD | Singapore Dollar | Regional business | ~240 LKR |

### Exchange Rate Precision

```
DecimalField(max_digits=12, decimal_places=6)

Examples:
1 USD = 325.500000 LKR
1 EUR = 358.250000 LKR
1 JPY = 2.185000 LKR

Six decimal places ensure:
- Accurate conversion for small amounts
- Minimal rounding errors
- Match central bank precision
```

### Currency Conversion Logic

```
If foreign currency payment received:

1. Verify exchange rate is current
   - Check against Central Bank of Sri Lanka rates
   - Apply any margin/markup if applicable

2. Calculate base currency amount
   - amount_in_base_currency = amount × exchange_rate
   - Round to 2 decimal places

3. Record both amounts
   - Original amount in foreign currency
   - Converted amount in LKR

4. All reports use amount_in_base_currency
   - Consistent currency for financial statements
   - Simplified accounting
```

### Sri Lankan Currency Regulations

**Central Bank of Sri Lanka (CBSL):**
- Official exchange rates published daily
- Commercial bank rates may vary slightly
- Tourism industry may use different rates

**Business Practices:**
- Hotels/tourism: Accept USD, EUR, GBP
- Retail: Mostly LKR only
- Export businesses: Invoice in USD/EUR
- Import payments: USD, EUR, CNY

**Accounting Standards:**
- Financial statements in LKR
- Foreign currency transactions converted at transaction date rate
- Exchange gains/losses recognized

### Expected Outcome
- Multi-currency payment support
- Exchange rate tracking
- Base currency conversion for reporting
- ISO 4217 compliance

### Verification Checklist
- [ ] currency CharField(3) added with default 'LKR'
- [ ] exchange_rate DecimalField(12,6) added (nullable)
- [ ] amount_in_base_currency DecimalField(15,2) added (nullable)
- [ ] Helper methods for currency operations implemented
- [ ] Validation for foreign currency requirements added
- [ ] Currency conversion logic documented

---

## Task 09: Add Payment Method Details

### Overview
Add a flexible JSONField to store method-specific details for each payment type. Different payment methods require different information (card last 4 digits, check number, bank name, etc.), and a JSON structure provides the flexibility to store varying data without rigid schema constraints.

### Dependencies
- Task 08: Add Payment Currency Fields
- Payment model exists
- PostgreSQL database (for JSONField support)

### Instructions

1. **Open payment.py model file**
   - Continue editing `apps/payments/models/payment.py`
   - Import JSONField from django.db.models

2. **Add method_details field**
   - Type: `JSONField`
   - Required: No (nullable)
   - Default: `dict` (empty dictionary)
   - Purpose: Store payment method-specific information
   - Flexible schema per payment method

3. **Define expected JSON structure per method**
   - Document structure for each PaymentMethod
   - Validate structure in service layer
   - Provide helper methods to access common fields

4. **Add helper methods for detail access**
   - `get_detail(key, default=None)`: Safe accessor for detail fields
   - `set_detail(key, value)`: Safe setter for detail fields
   - `get_card_last_four()`: Specific accessor for card payments
   - `get_check_number()`: Specific accessor for check payments
   - `get_mobile_transaction_id()`: Specific accessor for mobile payments

5. **Add detail formatting methods**
   - `format_payment_details()`: Human-readable payment details
   - Used for receipts, displays, and reports

### Extended Model Structure

```
Payment Model (Method Details)
├── [Previous Fields]
└── method_details    [JSONField, default=dict, nullable]
```

### JSON Structure by Payment Method

**CASH Payment:**
```json
{
  "amount_tendered": "5000.00",
  "change_given": "250.00",
  "register_id": "REG-001",
  "cashier_name": "Perera"
}
```

**CARD Payment:**
```json
{
  "card_type": "VISA",
  "last_four": "1234",
  "approval_code": "AUTH123456",
  "terminal_id": "TERM-05",
  "merchant_id": "M123456789",
  "card_holder_name": "JOHN DOE",
  "transaction_type": "SALE"
}
```

**BANK_TRANSFER Payment:**
```json
{
  "bank_name": "Commercial Bank of Ceylon",
  "branch_name": "Colombo Main Branch",
  "account_number_last_four": "5678",
  "reference_number": "TRF20260123001",
  "transfer_date": "2026-01-23",
  "verified_by": "Manager Name"
}
```

**MOBILE Payment:**
```json
{
  "provider": "FriMi",
  "transaction_id": "FRI20260123456789",
  "mobile_number_last_four": "9876",
  "timestamp": "2026-01-23T10:30:00Z"
}
```

**CHECK Payment:**
```json
{
  "check_number": "123456",
  "bank_name": "Sampath Bank",
  "branch": "Kandy Branch",
  "check_date": "2026-01-25",
  "account_number_last_four": "7890",
  "is_post_dated": true,
  "clearing_date": "2026-01-28"
}
```

**STORE_CREDIT Payment:**
```json
{
  "credit_balance_before": "15000.00",
  "amount_used": "10000.00",
  "credit_balance_after": "5000.00",
  "credit_source": "REFUND",
  "original_refund_id": "REF-2025-00123"
}
```

### Field Definitions by Method

**CASH Details:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| amount_tendered | String | Yes | Amount given by customer |
| change_given | String | Yes | Change returned |
| register_id | String | No | POS register identifier |
| cashier_name | String | No | Cashier who processed |

**CARD Details:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| card_type | String | Yes | VISA, MASTERCARD, AMEX |
| last_four | String | Yes | Last 4 digits of card |
| approval_code | String | Yes | Bank approval code |
| terminal_id | String | No | POS terminal ID |

**BANK_TRANSFER Details:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| bank_name | String | Yes | Name of bank |
| reference_number | String | Yes | Bank transfer reference |
| branch_name | String | No | Bank branch |
| verified_by | String | No | Staff who verified |

**MOBILE Details:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| provider | String | Yes | FriMi, eZ Cash, mCash |
| transaction_id | String | Yes | Provider's transaction ID |
| mobile_number_last_four | String | No | Last 4 digits of mobile |

**CHECK Details:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| check_number | String | Yes | Check number |
| bank_name | String | Yes | Issuing bank |
| check_date | String | Yes | Date on check |
| is_post_dated | Boolean | No | If check is post-dated |

**STORE_CREDIT Details:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| credit_balance_before | String | Yes | Balance before payment |
| amount_used | String | Yes | Amount deducted |
| credit_balance_after | String | Yes | Balance after payment |

### Security and Privacy Considerations

**What to Store:**
- ✅ Last 4 digits of card/account
- ✅ Transaction references and IDs
- ✅ Approval codes
- ✅ Provider names

**What NOT to Store:**
- ❌ Full card numbers (PCI DSS violation)
- ❌ CVV codes (never store)
- ❌ Full account numbers
- ❌ PINs or passwords

### Helper Method Examples

```python
def get_detail(self, key, default=None):
    """Safely retrieve a value from method_details"""
    if not self.method_details:
        return default
    return self.method_details.get(key, default)

def set_detail(self, key, value):
    """Safely set a value in method_details"""
    if not self.method_details:
        self.method_details = {}
    self.method_details[key] = value

def get_card_last_four(self):
    """Get last 4 digits for card payments"""
    if self.method == PaymentMethod.CARD:
        return self.get_detail('last_four')
    return None

def format_payment_details(self):
    """Format payment details for display"""
    if self.method == PaymentMethod.CASH:
        tendered = self.get_detail('amount_tendered')
        change = self.get_detail('change_given')
        return f"Cash - Tendered: Rs. {tendered}, Change: Rs. {change}"
    
    elif self.method == PaymentMethod.CARD:
        card_type = self.get_detail('card_type', 'Card')
        last_four = self.get_detail('last_four', '****')
        return f"{card_type} ending in {last_four}"
    
    # ... other methods
```

### Querying JSON Fields

```python
# PostgreSQL JSON queries

# Find all VISA payments
Payment.objects.filter(
    method=PaymentMethod.CARD,
    method_details__card_type='VISA'
)

# Find post-dated checks
Payment.objects.filter(
    method=PaymentMethod.CHECK,
    method_details__is_post_dated=True
)

# Find FriMi mobile payments
Payment.objects.filter(
    method=PaymentMethod.MOBILE,
    method_details__provider='FriMi'
)
```

### Expected Outcome
- Flexible storage for method-specific details
- Type-safe accessors for common fields
- Support for all six payment methods
- PCI DSS compliant (no sensitive data stored)

### Verification Checklist
- [ ] method_details JSONField added
- [ ] Default set to empty dict
- [ ] JSON structure documented for all methods
- [ ] Helper methods for safe access implemented
- [ ] Security guidelines followed (no full card numbers)
- [ ] Formatting methods for display added

---

## Task 10: Add Payment Reference Number

### Overview
Add a flexible reference number field to store external transaction identifiers such as bank transfer reference numbers, check numbers, gateway transaction IDs, and other tracking numbers provided by payment processors or financial institutions.

### Dependencies
- Task 09: Add Payment Method Details
- Payment model exists

### Instructions

1. **Open payment.py model file**
   - Continue editing `apps/payments/models/payment.py`

2. **Add reference_number field**
   - Type: `CharField`
   - Max length: 100 characters
   - Required: No (nullable, blank allowed)
   - Purpose: External reference from banks, gateways, customers
   - Indexed for quick lookup

3. **Add reference number usage patterns**
   - Bank transfers: Bank's transaction reference
   - Checks: Check number (duplicate of method_details for quick access)
   - Mobile payments: Provider's transaction ID
   - Card payments: Approval code or gateway reference
   - Store credit: Original refund reference

4. **Add reference validation helper**
   - `has_reference()`: Check if reference number exists
   - `validate_reference_format()`: Validate based on method

5. **Add index for reference number lookups**
   - Frequently used to verify payments
   - Bank reconciliation requires reference lookups

### Extended Model Structure

```
Payment Model (Reference Number)
├── [Previous Fields]
└── reference_number    [CharField(100), nullable, indexed]
```

### Reference Number Examples by Method

**CASH:**
```
reference_number: NULL
(No external reference for cash)
```

**CARD:**
```
reference_number: "AUTH123456789"
(Approval code from payment gateway)
```

**BANK_TRANSFER:**
```
reference_number: "CBL/TRF/2026/0123456"
(Bank's transaction reference)
Commercial Bank format: CBL/TRF/YYYY/NNNNNN
Sampath Bank format: SPB-TRF-YYYYMMDD-NNNN
```

**MOBILE (FriMi):**
```
reference_number: "FRI20260123456789"
(FriMi transaction ID)
eZ Cash format: EZ-YYYYMMDDHHMMSS-NNNN
```

**CHECK:**
```
reference_number: "123456"
(Check number - also in method_details)
```

**STORE_CREDIT:**
```
reference_number: "REF-2025-00789"
(Original refund that created the credit)
```

### Common Reference Formats (Sri Lankan Banks)

| Bank/Provider | Format | Example |
|---------------|--------|---------|
| Commercial Bank | CBL/TRF/YYYY/NNNNNN | CBL/TRF/2026/012345 |
| Sampath Bank | SPB-TRF-YYYYMMDD-NNNN | SPB-TRF-20260123-1234 |
| Hatton National Bank | HNB-YYYYMMDD-NNNNNN | HNB-20260123-123456 |
| FriMi | FRI-YYMMDDHHMMSSNNN | FRI-260123103045123 |
| eZ Cash | EZ-YYYYMMDDHHMMSS-NNN | EZ-20260123103045-123 |

### Use Cases

**Bank Reconciliation:**
```
When checking bank statement:
1. Find entry with reference CBL/TRF/2026/012345
2. Search Payment.objects.filter(reference_number='CBL/TRF/2026/012345')
3. Match payment to bank entry
4. Confirm amounts match
```

**Customer Inquiry:**
```
Customer: "I made payment with check #789456"
Staff: Search reference_number = '789456'
Result: Find payment PAY-2026-00234
Status: Verify payment recorded and applied
```

**Gateway Reconciliation:**
```
Payment gateway reports transaction AUTH987654:
1. Search reference_number = 'AUTH987654'
2. Verify status is COMPLETED
3. Match settlement amount
```

### Indexing Strategy

```
Create index on reference_number for:
- Quick lookup during bank reconciliation
- Customer service inquiries
- Gateway settlement matching

Index: payments_reference_number_idx
Type: B-tree index
Nullable: Yes (partial index on non-null values)
```

### Expected Outcome
- Single field for all external references
- Fast lookup capability
- Support for bank reconciliation
- Customer inquiry facilitation

### Verification Checklist
- [ ] reference_number CharField(100) added
- [ ] Field is nullable and blank=True
- [ ] Index added for quick lookups
- [ ] Helper methods for reference handling implemented
- [ ] Common reference formats documented

---

## Task 11: Add Payment User Fields

### Overview
Add user tracking fields to record which staff members were involved in the payment process. This provides accountability, enables user performance tracking, and creates a complete audit trail for all payment operations. Particularly important for approvals and cash handling.

### Dependencies
- Task 10: Add Payment Reference Number
- User model exists (Django auth or custom user)
- Payment model exists

### Instructions

1. **Open payment.py model file**
   - Continue editing `apps/payments/models/payment.py`
   - Import User model

2. **Add received_by field**
   - Type: `ForeignKey` to User model
   - Related name: `'payments_received'`
   - On delete: `PROTECT` (preserve user accountability)
   - Required: No (nullable)
   - Purpose: Staff member who received/recorded the payment
   - Set when payment is first created

3. **Add approved_by field**
   - Type: `ForeignKey` to User model
   - Related name: `'payments_approved'`
   - On delete: `PROTECT`
   - Required: No (nullable)
   - Purpose: Manager/supervisor who approved payment
   - Required for large amounts or specific methods

4. **Add approval workflow support**
   - Large payments may require manager approval
   - Approval thresholds configured per tenant
   - Status PENDING until approved

5. **Add user-related helper methods**
   - `requires_approval()`: Check if approval needed
   - `is_approved()`: Check if approved
   - `approve(user)`: Approve payment and set approved_by

6. **Add indexes for user-based reporting**
   - Index on received_by for staff performance reports
   - Index on approved_by for approval tracking

### Extended Model Structure

```
Payment Model (User Fields)
├── [Previous Fields]
├── received_by     [FK to User, nullable, PROTECT]
└── approved_by     [FK to User, nullable, PROTECT]
```

### User Field Specifications

| Field | Type | Related Name | On Delete | Required | Purpose |
|-------|------|--------------|-----------|----------|---------|
| received_by | ForeignKey(User) | payments_received | PROTECT | No | Who recorded payment |
| approved_by | ForeignKey(User) | payments_approved | PROTECT | No | Who approved payment |

### Usage Scenarios

**Scenario 1: Regular Cash Payment**
```
Small cash payment (Rs. 1,500):
- received_by:   User: "Cashier Perera"
- approved_by:   NULL (no approval needed)
- status:        COMPLETED (immediate)
```

**Scenario 2: Large Bank Transfer**
```
Large transfer (Rs. 500,000):
- received_by:   User: "Accounts Clerk Silva"
- approved_by:   NULL (initially)
- status:        PENDING

After manager approval:
- approved_by:   User: "Manager Fernando"
- status:        COMPLETED
```

**Scenario 3: Check Payment**
```
Check for Rs. 50,000:
- received_by:   User: "Sales Rep Jayawardena"
- approved_by:   User: "Branch Manager Wijesinghe"
- status:        PENDING (awaiting clearance)

After check clears:
- status:        COMPLETED
```

### Approval Workflow

```
                    ┌──────────────────┐
                    │  PAYMENT CREATED │
                    │  received_by set │
                    └────────┬─────────┘
                             │
                    ┌────────▼─────────┐
                    │ Amount Check     │
                    └────────┬─────────┘
                             │
                ┌────────────┴────────────┐
                │                         │
         Amount < Threshold        Amount ≥ Threshold
                │                         │
                ▼                         ▼
       ┌────────────────┐        ┌────────────────┐
       │ AUTO-APPROVE   │        │ REQUIRES       │
       │ approved_by    │        │ APPROVAL       │
       │ = received_by  │        │ status=PENDING │
       └────────────────┘        └────────┬───────┘
                                           │
                                  Manager approves
                                           │
                                           ▼
                                  ┌────────────────┐
                                  │ approved_by set│
                                  │ status=COMPLETE│
                                  └────────────────┘
```

### Approval Thresholds (Tenant Configurable)

| Amount Range | Approval Required | Typical Approver |
|--------------|-------------------|------------------|
| < Rs. 10,000 | No | Auto-approved |
| Rs. 10,000 - Rs. 50,000 | Branch Manager | Manager |
| Rs. 50,000 - Rs. 500,000 | Regional Manager | Senior Manager |
| > Rs. 500,000 | Finance Director | C-Level |

### User Performance Tracking

**Cashier Performance:**
```python
# Total payments received by a cashier
cashier_payments = Payment.objects.filter(
    received_by=cashier_user,
    created_at__date=today
)

# Calculate total handled
total_amount = cashier_payments.aggregate(
    total=Sum('amount')
)['total']

# Count by method
by_method = cashier_payments.values('method').annotate(
    count=Count('id'),
    total=Sum('amount')
)
```

**Manager Approval Tracking:**
```python
# Approvals by manager
approvals = Payment.objects.filter(
    approved_by=manager_user,
    approved_at__date=today
)

# Average approval time
avg_approval_time = approvals.aggregate(
    avg=Avg(F('processed_at') - F('created_at'))
)
```

### Accountability and Audit

**Audit Trail:**
- Who received payment: received_by
- When received: created_at
- Who approved: approved_by
- When approved: processed_at

**Accountability:**
- Cash handling: Track which cashier received
- Large payments: Track approval chain
- Discrepancies: Identify responsible staff
- Performance: Measure processing speed

**Security:**
- PROTECT on delete: Can't delete users with payment history
- Preserves audit trail permanently
- User IDs retained even if staff leaves

### Expected Outcome
- User accountability for all payments
- Approval workflow support
- Staff performance tracking capability
- Complete audit trail

### Verification Checklist
- [ ] received_by ForeignKey to User added
- [ ] approved_by ForeignKey to User added
- [ ] Both fields use PROTECT on delete
- [ ] Related names set ('payments_received', 'payments_approved')
- [ ] Helper methods for approval workflow implemented
- [ ] Indexes added for user-based queries

---

## Task 12: Add Payment Notes Fields

### Overview
Add text fields for recording notes and comments about payments. Public notes can be shared with customers (appear on receipts), while internal notes are for staff use only (audit trails, special instructions, reconciliation notes).

### Dependencies
- Task 11: Add Payment User Fields
- Payment model exists

### Instructions

1. **Open payment.py model file**
   - Continue editing `apps/payments/models/payment.py`

2. **Add notes field**
   - Type: `TextField`
   - Required: No (blank allowed, nullable)
   - Purpose: General notes about payment
   - Visible to customers (may appear on receipts)
   - Use for: payment conditions, special arrangements

3. **Add internal_notes field**
   - Type: `TextField`
   - Required: No (blank allowed, nullable)
   - Purpose: Internal staff notes
   - Never shown to customers
   - Use for: discrepancies, follow-ups, verification notes

4. **Add helper methods for notes**
   - `has_notes()`: Check if public notes exist
   - `has_internal_notes()`: Check if internal notes exist
   - `add_note(note, user, internal=False)`: Append timestamped note

5. **Add notes display helpers**
   - `get_public_notes()`: Returns notes safe for customers
   - `get_internal_notes_for_staff()`: Returns internal notes with access check

### Extended Model Structure

```
Payment Model (Notes Fields)
├── [Previous Fields]
├── notes                [TextField, nullable, blank]
└── internal_notes       [TextField, nullable, blank]
```

### Notes Field Specifications

| Field | Type | Required | Visible to Customer | Purpose |
|-------|------|----------|---------------------|---------|
| notes | TextField | No | Yes | Public payment notes |
| internal_notes | TextField | No | No | Staff-only notes |

### Notes Usage Examples

**Public Notes (Visible to Customer):**

Example 1: Payment Terms
```
notes: "Payment received with 2% early payment discount applied"
```

Example 2: Special Arrangement
```
notes: "Installment 1 of 3 - Next payment due: 2026-02-15"
```

Example 3: Customer Request
```
notes: "Customer requested receipt sent to alternate email: accounts@company.lk"
```

**Internal Notes (Staff Only):**

Example 1: Verification
```
internal_notes: "Bank transfer verified by calling bank on 2026-01-23 10:30 AM
Reference confirmed with Commercial Bank Kandy Branch"
```

Example 2: Discrepancy
```
internal_notes: "Customer initially provided check for Rs. 50,000 but check was returned NSF.
Replacement payment received via bank transfer on 2026-01-28.
Original check #123456 returned to customer."
```

Example 3: Follow-up Required
```
internal_notes: "Post-dated check for Rs. 100,000 dated 2026-02-15
Set reminder to deposit check on 2026-02-15
Notify customer if check bounces"
```

### Timestamped Note Append Pattern

```python
def add_note(self, note_text, user, internal=False):
    """
    Append timestamped note to payment
    
    Args:
        note_text: Text to add
        user: User adding note
        internal: If True, add to internal_notes
    """
    from django.utils import timezone
    
    timestamp = timezone.now().strftime('%Y-%m-%d %H:%M')
    new_entry = f"[{timestamp}] {user.get_full_name()}: {note_text}"
    
    if internal:
        if self.internal_notes:
            self.internal_notes += f"\n\n{new_entry}"
        else:
            self.internal_notes = new_entry
    else:
        if self.notes:
            self.notes += f"\n\n{new_entry}"
        else:
            self.notes = new_entry
    
    self.save()
```

### Notes in Different Contexts

**Receipt Display:**
```
PAYMENT RECEIPT
================
Payment: PAY-2026-00123
Amount: Rs. 10,000.00
Method: Bank Transfer

Notes:
Payment includes early settlement discount.
Thank you for your prompt payment.

[Internal notes NOT shown on receipt]
```

**Staff Dashboard:**
```
Payment: PAY-2026-00123
Status: COMPLETED

Public Notes:
Payment includes early settlement discount.

Internal Notes:
[2026-01-23 10:30] Perera: Transfer verified with bank
[2026-01-23 14:15] Silva: Applied to Invoice INV-2026-00456
```

### Common Note Scenarios

**Scenario 1: Check Clearing Notes**
```
notes: NULL

internal_notes:
[2026-01-23 09:00] Silva: Check received from customer
Check #789456, Sampath Bank, dated 2026-01-23
[2026-01-26 10:30] Silva: Check deposited at bank
[2026-01-28 14:00] Silva: Check cleared successfully
```

**Scenario 2: Partial Payment Arrangement**
```
notes: "Partial payment - Balance of Rs. 25,000 due by 2026-02-15"

internal_notes:
[2026-01-23 11:00] Fernando: Customer requested payment plan
Manager approved 50% upfront, balance in 30 days
Follow-up reminder set for 2026-02-10
```

**Scenario 3: Foreign Currency**
```
notes: "Payment in USD - Exchange rate 325.50"

internal_notes:
[2026-01-23 10:00] Perera: Exchange rate from CBSL as of 2026-01-23
Tourist customer from USA, payment via credit card
```

### Security Considerations

**Access Control:**
- Public notes: Visible to customers, staff, reports
- Internal notes: Only visible to authorized staff
- Implement permission checks before displaying internal notes

**Sensitive Information:**
- Don't store PINs, passwords, full account numbers in notes
- Avoid customer personal data in internal notes
- Follow data privacy regulations

### Expected Outcome
- Public notes for customer-facing information
- Internal notes for staff coordination
- Timestamped note append capability
- Proper access control for sensitive notes

### Verification Checklist
- [ ] notes TextField added (nullable, blank)
- [ ] internal_notes TextField added (nullable, blank)
- [ ] Helper methods for checking note existence implemented
- [ ] add_note() method with timestamp implemented
- [ ] Display helpers for public/internal separation added
- [ ] Security considerations documented

---

## Related Diagrams

### Payment Model Field Progression

```
┌─────────────────────────────────────────────────────────────┐
│              PAYMENT MODEL - ALL FIELDS                      │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Core (Tasks 05-06):                                        │
│  ├─ payment_number, method, status, amount                 │
│  └─ invoice, order, customer (FKs)                          │
│                                                             │
│  Date Tracking (Task 07):                                   │
│  ├─ payment_date: When payment made                        │
│  ├─ processed_at: When completed                           │
│  └─ cancelled_at: When cancelled                           │
│                                                             │
│  Multi-Currency (Task 08):                                  │
│  ├─ currency: ISO 4217 code (default LKR)                  │
│  ├─ exchange_rate: Conversion rate                         │
│  └─ amount_in_base_currency: Converted to LKR             │
│                                                             │
│  Method Details (Task 09):                                  │
│  └─ method_details: JSON {card_last_four, check_number...} │
│                                                             │
│  External Reference (Task 10):                              │
│  └─ reference_number: Bank ref, approval code, etc.        │
│                                                             │
│  User Tracking (Task 11):                                   │
│  ├─ received_by: Staff who recorded payment                │
│  └─ approved_by: Manager who approved                      │
│                                                             │
│  Notes (Task 12):                                           │
│  ├─ notes: Public notes (customer-visible)                 │
│  └─ internal_notes: Staff notes (internal)                 │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Payment Lifecycle with All Fields

```
┌─────────────────┐
│ PAYMENT CREATED │
└────────┬────────┘
         │
         ├─ payment_number: PAY-2026-00001 (auto-generated)
         ├─ method: CARD
         ├─ status: PENDING
         ├─ amount: 10,000.00
         ├─ payment_date: 2026-01-23
         ├─ currency: LKR
         ├─ invoice: INV-2026-00456
         ├─ customer: "ABC Traders"
         ├─ received_by: "Cashier Perera"
         ├─ method_details: {"card_type": "VISA", "last_four": "1234"}
         ├─ reference_number: "AUTH789456"
         └─ notes: "Payment via Visa card"
         
         ▼
┌─────────────────┐
│ MANAGER REVIEWS │
└────────┬────────┘
         │
         ├─ approved_by: "Manager Silva" (set)
         ├─ internal_notes: "Approved - large transaction" (added)
         └─ status: PENDING → COMPLETED
         
         ▼
┌─────────────────┐
│   PROCESSED     │
└────────┬────────┘
         │
         ├─ processed_at: 2026-01-23 10:35:00 (set)
         └─ Receipt generated
```

---

## Summary

This document extended the Payment model with comprehensive operational fields:

1. ✅ **Date Tracking** (Task 07): payment_date, processed_at, cancelled_at for lifecycle tracking
2. ✅ **Multi-Currency** (Task 08): currency, exchange_rate, amount_in_base_currency for international payments
3. ✅ **Method Details** (Task 09): JSON field for flexible method-specific information
4. ✅ **Reference Number** (Task 10): External transaction references for reconciliation
5. ✅ **User Tracking** (Task 11): received_by and approved_by for accountability
6. ✅ **Notes** (Task 12): Public and internal notes for documentation

**Next Steps:** Proceed to [03_Tasks-13-18_Number-Gen-Config-Index-Migration.md](03_Tasks-13-18_Number-Gen-Config-Index-Migration.md) to implement payment number generation, method configuration, indexes, and migrations.
