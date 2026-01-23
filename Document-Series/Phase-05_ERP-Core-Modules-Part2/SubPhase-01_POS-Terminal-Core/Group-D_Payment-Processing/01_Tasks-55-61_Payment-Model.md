# Tasks 55-61: Payment Model Setup

> **Phase:** 05 - ERP Core Modules Part 2  
> **SubPhase:** 01 - POS Terminal Core  
> **Group:** D - Payment Processing  
> **Document:** 01 of 03  
> **Tasks Covered:** 55, 56, 57, 58, 59, 60, 61

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **→ Next Document:** [02_Tasks-62-68_Payment-Service-Methods.md](02_Tasks-62-68_Payment-Service-Methods.md)

---

## Document Overview

This document covers the creation of the payment submodule, payment constants, and the POSPayment model with all necessary fields for handling various payment methods in the Sri Lankan context.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 55 | Create payment submodule | Low | 10 min |
| 56 | Define payment method constants | Low | 10 min |
| 57 | Define payment status constants | Low | 10 min |
| 58 | Create POSPayment model | Medium | 30 min |
| 59 | Add payment reference fields | Low | 15 min |
| 60 | Add cash payment fields | Low | 15 min |
| 61 | Add payment timestamp | Low | 10 min |

---

## Task 55: Create Payment Submodule

### Overview
Create the organized package structure for payment-related functionality within the POS app.

### Dependencies
- POS app structure exists
- Django project configured

### Instructions

1. **Create payment package directory**
   - Navigate to `apps/pos/` directory
   - Create new directory named `payment`
   - This will hold all payment-related modules

2. **Create payment package initializer**
   - Create `__init__.py` file in `apps/pos/payment/`
   - Leave empty or add package-level imports

3. **Create models subdirectory**
   - Create `models` directory inside `payment`
   - This will hold payment model definitions
   - Create `__init__.py` in models directory

4. **Create services subdirectory**
   - Create `services` directory inside `payment`
   - This will hold payment service classes
   - Create `__init__.py` in services directory

5. **Update parent package imports (optional)**
   - In `apps/pos/__init__.py`, optionally import payment package
   - Helps with discoverability

### Directory Structure
```
apps/pos/
├── __init__.py
├── models/                   # Existing
├── payment/                  # NEW: Payment package
│   ├── __init__.py          # Package initializer
│   ├── models/              # Payment models
│   │   └── __init__.py
│   └── services/            # Payment services
│       └── __init__.py
└── ...
```

### Expected Outcome
```
apps/pos/payment/
├── __init__.py
├── models/
│   └── __init__.py
└── services/
    └── __init__.py
```

### Verification Checklist
- [ ] `apps/pos/payment/` directory exists
- [ ] `apps/pos/payment/__init__.py` file exists
- [ ] `apps/pos/payment/models/` directory exists
- [ ] `apps/pos/payment/models/__init__.py` file exists
- [ ] `apps/pos/payment/services/` directory exists
- [ ] `apps/pos/payment/services/__init__.py` file exists

---

## Task 56: Define Payment Method Constants

### Overview
Define constants for all supported payment methods, including Sri Lankan-specific payment options.

### Dependencies
- Task 55: Create payment submodule

### Instructions

1. **Locate or create constants file**
   - Use existing `apps/pos/constants.py` file
   - If it doesn't exist, create it

2. **Create payment methods section**
   - Add section header comment: "# Payment Methods"
   - Group all payment method constants together

3. **Define CASH payment method**
   - Constant name: `PAYMENT_METHOD_CASH`
   - Value: `'CASH'`
   - Most common payment method in Sri Lanka

4. **Define CARD payment method**
   - Constant name: `PAYMENT_METHOD_CARD`
   - Value: `'CARD'`
   - Covers Visa, Mastercard, Amex

5. **Define BANK_TRANSFER payment method**
   - Constant name: `PAYMENT_METHOD_BANK_TRANSFER`
   - Value: `'BANK_TRANSFER'`
   - Direct bank transfers

6. **Define MOBILE payment method**
   - Constant name: `PAYMENT_METHOD_MOBILE`
   - Value: `'MOBILE'`
   - Covers FriMi, Dialog Genie, eZ Cash

7. **Define STORE_CREDIT payment method**
   - Constant name: `PAYMENT_METHOD_STORE_CREDIT`
   - Value: `'STORE_CREDIT'`
   - Customer credit balance

8. **Define PAYHERE payment method**
   - Constant name: `PAYMENT_METHOD_PAYHERE`
   - Value: `'PAYHERE'`
   - Popular Sri Lankan payment gateway

9. **Create payment method choices tuple**
   - Name: `PAYMENT_METHOD_CHOICES`
   - Format: `((constant, 'Display Name'), ...)`
   - Used for Django model choices

### Payment Methods Reference

| Constant | Value | Display Name | Use Case |
|----------|-------|--------------|----------|
| `PAYMENT_METHOD_CASH` | `'CASH'` | Cash | Cash payments |
| `PAYMENT_METHOD_CARD` | `'CARD'` | Credit/Debit Card | Card payments |
| `PAYMENT_METHOD_BANK_TRANSFER` | `'BANK_TRANSFER'` | Bank Transfer | Direct transfers |
| `PAYMENT_METHOD_MOBILE` | `'MOBILE'` | Mobile Payment | FriMi, Genie, eZ Cash |
| `PAYMENT_METHOD_STORE_CREDIT` | `'STORE_CREDIT'` | Store Credit | Customer credit |
| `PAYMENT_METHOD_PAYHERE` | `'PAYHERE'` | PayHere | Online gateway |

### Sri Lanka Payment Context

**Popular Payment Methods in Sri Lanka:**
- **Cash:** Still the dominant payment method, especially for SMEs
- **Card:** Growing adoption, especially in urban areas (Colombo, Kandy)
- **Mobile:** FriMi (Sampath Bank), Dialog Genie, eZ Cash popular
- **Bank Transfer:** Used for larger transactions, B2B payments
- **PayHere:** Leading payment gateway, supports cards, mobile, QR codes

### Expected Outcome
```python
# In apps/pos/constants.py

# Payment Methods
PAYMENT_METHOD_CASH = 'CASH'
PAYMENT_METHOD_CARD = 'CARD'
PAYMENT_METHOD_BANK_TRANSFER = 'BANK_TRANSFER'
PAYMENT_METHOD_MOBILE = 'MOBILE'
PAYMENT_METHOD_STORE_CREDIT = 'STORE_CREDIT'
PAYMENT_METHOD_PAYHERE = 'PAYHERE'

PAYMENT_METHOD_CHOICES = (
    (PAYMENT_METHOD_CASH, 'Cash'),
    (PAYMENT_METHOD_CARD, 'Credit/Debit Card'),
    (PAYMENT_METHOD_BANK_TRANSFER, 'Bank Transfer'),
    (PAYMENT_METHOD_MOBILE, 'Mobile Payment'),
    (PAYMENT_METHOD_STORE_CREDIT, 'Store Credit'),
    (PAYMENT_METHOD_PAYHERE, 'PayHere'),
)
```

### Verification Checklist
- [ ] `apps/pos/constants.py` file exists
- [ ] All six payment method constants are defined
- [ ] `PAYMENT_METHOD_CHOICES` tuple is created
- [ ] Constants use uppercase naming convention
- [ ] Display names are user-friendly
- [ ] Sri Lankan payment methods included

---

## Task 57: Define Payment Status Constants

### Overview
Define constants for tracking the lifecycle status of payment transactions.

### Dependencies
- Task 56: Define payment method constants

### Instructions

1. **Locate constants file**
   - Open `apps/pos/constants.py`
   - Add new section after payment methods

2. **Create payment status section**
   - Add section header comment: "# Payment Status"
   - Group all payment status constants together

3. **Define PENDING status**
   - Constant name: `PAYMENT_STATUS_PENDING`
   - Value: `'PENDING'`
   - Initial state when payment is initiated

4. **Define COMPLETED status**
   - Constant name: `PAYMENT_STATUS_COMPLETED`
   - Value: `'COMPLETED'`
   - Payment successfully processed

5. **Define FAILED status**
   - Constant name: `PAYMENT_STATUS_FAILED`
   - Value: `'FAILED'`
   - Payment processing failed

6. **Define REFUNDED status**
   - Constant name: `PAYMENT_STATUS_REFUNDED`
   - Value: `'REFUNDED'`
   - Payment refunded to customer

7. **Define VOIDED status**
   - Constant name: `PAYMENT_STATUS_VOIDED`
   - Value: `'VOIDED'`
   - Payment cancelled before completion

8. **Create payment status choices tuple**
   - Name: `PAYMENT_STATUS_CHOICES`
   - Format: `((constant, 'Display Name'), ...)`
   - Used for Django model choices

### Payment Status Flow Diagram

```
┌─────────────────────────────────────────────────────────┐
│                   Payment Lifecycle                      │
└─────────────────────────────────────────────────────────┘

                    [Payment Initiated]
                           │
                           ▼
                      ┌─────────┐
                      │ PENDING │ ◄────────────┐
                      └─────────┘              │
                           │                   │
                ┌──────────┴──────────┐       │
                ▼                     ▼        │
         ┌───────────┐         ┌─────────┐   │ Retry
         │ COMPLETED │         │ FAILED  │───┘
         └───────────┘         └─────────┘
                │                     │
                │                     ▼
                │               ┌─────────┐
                │               │ VOIDED  │
                │               └─────────┘
                ▼
         ┌───────────┐
         │ REFUNDED  │
         └───────────┘
```

### Status Descriptions

| Status | Description | Can Transition To |
|--------|-------------|-------------------|
| **PENDING** | Payment initiated, awaiting confirmation | COMPLETED, FAILED, VOIDED |
| **COMPLETED** | Payment successfully processed | REFUNDED |
| **FAILED** | Payment processing failed | PENDING (retry), VOIDED |
| **REFUNDED** | Payment refunded to customer | (terminal state) |
| **VOIDED** | Payment cancelled before completion | (terminal state) |

### Use Cases

**PENDING:**
- Card authorization in progress
- Mobile payment OTP waiting
- Bank transfer confirmation pending

**COMPLETED:**
- Cash payment received and counted
- Card payment authorized and captured
- Mobile payment confirmed

**FAILED:**
- Card declined by bank
- Insufficient funds
- Payment gateway timeout
- Network error

**REFUNDED:**
- Customer returned goods
- Payment reversal processed
- Partial or full refund

**VOIDED:**
- Cashier cancelled transaction
- Customer changed mind before completion
- System error during processing

### Expected Outcome
```python
# In apps/pos/constants.py

# Payment Status
PAYMENT_STATUS_PENDING = 'PENDING'
PAYMENT_STATUS_COMPLETED = 'COMPLETED'
PAYMENT_STATUS_FAILED = 'FAILED'
PAYMENT_STATUS_REFUNDED = 'REFUNDED'
PAYMENT_STATUS_VOIDED = 'VOIDED'

PAYMENT_STATUS_CHOICES = (
    (PAYMENT_STATUS_PENDING, 'Pending'),
    (PAYMENT_STATUS_COMPLETED, 'Completed'),
    (PAYMENT_STATUS_FAILED, 'Failed'),
    (PAYMENT_STATUS_REFUNDED, 'Refunded'),
    (PAYMENT_STATUS_VOIDED, 'Voided'),
)
```

### Verification Checklist
- [ ] All five payment status constants are defined
- [ ] `PAYMENT_STATUS_CHOICES` tuple is created
- [ ] Constants use uppercase naming convention
- [ ] Status flow is clear and logical
- [ ] Terminal states are identified

---

## Task 58: Create POSPayment Model

### Overview
Create the POSPayment model that records payment transactions associated with POS carts, supporting multiple payment methods and statuses.

### Dependencies
- Task 55: Create payment submodule
- Task 56: Define payment method constants
- Task 57: Define payment status constants
- POSCart model exists

### Instructions

1. **Create POSPayment model file**
   - Create file: `apps/pos/payment/models/pos_payment.py`
   - Import necessary Django modules

2. **Import required dependencies**
   - Import Django models: `from django.db import models`
   - Import Decimal: `from decimal import Decimal`
   - Import settings: `from django.conf import settings`
   - Import payment constants: `from apps.pos.constants import PAYMENT_METHOD_CHOICES, PAYMENT_STATUS_CHOICES`
   - Import base models if available (TimestampedModel, TenantAwareModel)

3. **Define POSPayment model class**
   - Class name: `POSPayment`
   - Inherit from appropriate base models
   - Add model docstring explaining purpose

4. **Add cart foreign key field**
   - Field name: `cart`
   - Type: `ForeignKey` to `POSCart`
   - On delete: `CASCADE` (payment belongs to cart)
   - Related name: `'payments'`
   - Help text: "The cart this payment is associated with"

5. **Add payment method field**
   - Field name: `method`
   - Type: `CharField`
   - Max length: 20
   - Choices: `PAYMENT_METHOD_CHOICES`
   - Help text: "Payment method used"
   - Database index recommended for filtering

6. **Add amount field**
   - Field name: `amount`
   - Type: `DecimalField`
   - Max digits: 12
   - Decimal places: 2
   - Help text: "Payment amount in LKR"
   - Validators: Must be positive

7. **Add status field**
   - Field name: `status`
   - Type: `CharField`
   - Max length: 20
   - Choices: `PAYMENT_STATUS_CHOICES`
   - Default: `PAYMENT_STATUS_PENDING`
   - Help text: "Payment processing status"

8. **Add processed_by field**
   - Field name: `processed_by`
   - Type: `ForeignKey` to User model
   - On delete: `SET_NULL`, null=True
   - Help text: "User who processed this payment"

9. **Add Meta class**
   - Set `db_table` to `'pos_payment'`
   - Set `ordering` to `['-created_at']` (newest first)
   - Add verbose names
   - Add indexes for frequently queried fields

10. **Add __str__ method**
    - Return formatted string with cart ID, method, and amount
    - Format: "Payment #{id} - {method} - LKR {amount} ({status})"

11. **Update models __init__.py**
    - Import POSPayment in `apps/pos/payment/models/__init__.py`
    - Makes model easily importable

### POSPayment Model Schema

| Field | Type | Constraints | Purpose |
|-------|------|-------------|---------|
| `id` | AutoField | Primary Key | Payment identifier |
| `cart` | ForeignKey | NOT NULL, CASCADE | Link to POSCart |
| `method` | CharField | Choices, 20 chars | Payment method |
| `amount` | DecimalField | 12.2, positive | Payment amount |
| `status` | CharField | Choices, 20 chars | Payment status |
| `processed_by` | ForeignKey | NULL OK | User who processed |
| `created_at` | DateTimeField | Auto-add | Creation timestamp |
| `updated_at` | DateTimeField | Auto-update | Last update timestamp |

### Relationships Diagram

```
┌──────────────────┐         ┌──────────────────┐
│    POSCart       │◄────────┤   POSPayment     │
│                  │ 1     * │                  │
├──────────────────┤         ├──────────────────┤
│ id               │         │ id               │
│ session          │         │ cart_id          │
│ customer         │         │ method           │
│ status           │         │ amount           │
│ total            │         │ status           │
│ ...              │         │ processed_by_id  │
└──────────────────┘         │ created_at       │
                             │ ...              │
                             └──────────────────┘
                                      │
                                      │ *
                                      ▼ 1
                             ┌──────────────────┐
                             │      User        │
                             │                  │
                             ├──────────────────┤
                             │ id               │
                             │ username         │
                             │ email            │
                             └──────────────────┘
```

### Business Rules

1. **Multiple Payments per Cart:**
   - Cart can have multiple payments (split payment)
   - Sum of all COMPLETED payments must equal or exceed cart total

2. **Amount Validation:**
   - Amount must be positive
   - Amount should not exceed cart total (validated in service layer)

3. **Status Transitions:**
   - PENDING → COMPLETED: Successful processing
   - PENDING → FAILED: Processing error
   - PENDING → VOIDED: Cancelled before completion
   - COMPLETED → REFUNDED: Return/refund processed

4. **Audit Trail:**
   - All payment attempts are recorded
   - Failed payments are kept for audit purposes
   - Timestamps track payment lifecycle

### Expected Outcome
```python
# apps/pos/payment/models/pos_payment.py

from django.db import models
from django.conf import settings
from decimal import Decimal
from apps.pos.constants import (
    PAYMENT_METHOD_CHOICES,
    PAYMENT_STATUS_CHOICES,
    PAYMENT_STATUS_PENDING
)

class POSPayment(models.Model):
    """
    Payment record for POS transactions.
    Supports multiple payment methods and split payments.
    """
    
    cart = models.ForeignKey(
        'pos.POSCart',
        on_delete=models.CASCADE,
        related_name='payments',
        help_text="The cart this payment is associated with"
    )
    
    method = models.CharField(
        max_length=20,
        choices=PAYMENT_METHOD_CHOICES,
        help_text="Payment method used"
    )
    
    amount = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        help_text="Payment amount in LKR"
    )
    
    status = models.CharField(
        max_length=20,
        choices=PAYMENT_STATUS_CHOICES,
        default=PAYMENT_STATUS_PENDING,
        help_text="Payment processing status"
    )
    
    processed_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        help_text="User who processed this payment"
    )
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'pos_payment'
        ordering = ['-created_at']
        verbose_name = 'POS Payment'
        verbose_name_plural = 'POS Payments'
        indexes = [
            models.Index(fields=['cart', 'status']),
            models.Index(fields=['method']),
            models.Index(fields=['created_at']),
        ]
    
    def __str__(self):
        return f"Payment #{self.id} - {self.method} - LKR {self.amount} ({self.status})"
```

### Verification Checklist
- [ ] `pos_payment.py` file exists in payment models directory
- [ ] POSPayment model is defined with all required fields
- [ ] Foreign keys to POSCart and User are properly configured
- [ ] Payment method and status use constants
- [ ] Decimal field for amount with proper precision
- [ ] Meta class with db_table and ordering
- [ ] __str__ method returns meaningful representation
- [ ] Model is imported in models/__init__.py

---

## Task 59: Add Payment Reference Fields

### Overview
Add fields to POSPayment model for storing payment gateway references, authorization codes, and transaction identifiers.

### Dependencies
- Task 58: Create POSPayment model

### Instructions

1. **Open POSPayment model file**
   - Navigate to `apps/pos/payment/models/pos_payment.py`
   - Locate the POSPayment class definition

2. **Add reference_number field**
   - Field name: `reference_number`
   - Type: `CharField`
   - Max length: 100
   - Nullable: True, blank=True
   - Help text: "External payment reference (bank transfer, mobile payment)"
   - Used for bank transfers, mobile payments

3. **Add authorization_code field**
   - Field name: `authorization_code`
   - Type: `CharField`
   - Max length: 50
   - Nullable: True, blank=True
   - Help text: "Card authorization code"
   - Returned by payment gateway for card payments

4. **Add transaction_id field**
   - Field name: `transaction_id`
   - Type: `CharField`
   - Max length: 100
   - Nullable: True, blank=True
   - Unique: True (across all payments)
   - Help text: "Unique transaction identifier from payment gateway"

5. **Add gateway_response field**
   - Field name: `gateway_response`
   - Type: `TextField`
   - Nullable: True, blank=True
   - Help text: "Full response from payment gateway (JSON)"
   - Stores complete gateway response for debugging

6. **Add notes field**
   - Field name: `notes`
   - Type: `TextField`
   - Nullable: True, blank=True
   - Help text: "Additional notes about this payment"
   - For manual notes by cashier

7. **Update Meta class indexes**
   - Add index on `reference_number` for lookups
   - Add index on `transaction_id` for uniqueness queries

### Reference Fields Use Cases

| Field | Payment Method | Example Value | Purpose |
|-------|----------------|---------------|---------|
| `reference_number` | BANK_TRANSFER | "BT20260123001234" | Bank transaction reference |
| `reference_number` | MOBILE | "FM2026012312345678" | FriMi/Genie transaction ID |
| `authorization_code` | CARD | "AUTH123456" | Card payment authorization |
| `transaction_id` | PAYHERE | "PH-1234567890" | PayHere transaction ID |
| `gateway_response` | CARD/PAYHERE | "{\"status\": \"success\", ...}" | Full gateway response |
| `notes` | ANY | "Customer requested receipt" | Manual notes |

### Sri Lankan Payment Gateway References

**PayHere Transaction ID Format:**
- Prefix: "PH-" or "MERCHANT-"
- Length: 10-20 characters
- Example: "PH-1234567890"

**FriMi Reference Format:**
- Prefix: "FM"
- Date component: YYYYMMDD
- Sequence: 8 digits
- Example: "FM2026012312345678"

**Dialog Genie Reference Format:**
- Prefix: "DG" or "GENIE-"
- Length: 12-16 characters
- Example: "DG202601231234"

**eZ Cash Reference Format:**
- Prefix: "EZ"
- Length: 10-15 characters
- Example: "EZ12345678901"

### Payment Reference Diagram

```
┌────────────────────────────────────────────────────────────┐
│                    POSPayment Record                        │
├────────────────────────────────────────────────────────────┤
│                                                             │
│  Method: CARD                                              │
│  Amount: LKR 2,500.00                                      │
│  Status: COMPLETED                                          │
│                                                             │
│  ┌───────────────────────────────────────────────┐        │
│  │ Reference Fields                              │        │
│  ├───────────────────────────────────────────────┤        │
│  │ reference_number: "VISA-1234"                 │        │
│  │ authorization_code: "AUTH123456"              │        │
│  │ transaction_id: "PH-9876543210"               │        │
│  │ gateway_response: {                           │        │
│  │   "status": "approved",                       │        │
│  │   "card_type": "VISA",                        │        │
│  │   "last4": "1234",                            │        │
│  │   "approval_code": "AUTH123456"               │        │
│  │ }                                             │        │
│  │ notes: "Customer card on file"                │        │
│  └───────────────────────────────────────────────┘        │
│                                                             │
└────────────────────────────────────────────────────────────┘
```

### Field Validation Guidelines

**reference_number:**
- Required for: BANK_TRANSFER, MOBILE
- Optional for: CARD, PAYHERE
- Not needed for: CASH, STORE_CREDIT

**authorization_code:**
- Required for: CARD (when successful)
- Optional for: PAYHERE
- Not needed for: CASH, BANK_TRANSFER, MOBILE, STORE_CREDIT

**transaction_id:**
- Required for: PAYHERE
- Recommended for: CARD (if gateway provides)
- Optional for: MOBILE, BANK_TRANSFER
- Not needed for: CASH, STORE_CREDIT

**gateway_response:**
- Store for: CARD, PAYHERE, MOBILE (any gateway)
- Not needed for: CASH, STORE_CREDIT (no gateway)
- Format: JSON string
- Include full response for debugging

### Expected Outcome
```python
# Additional fields in POSPayment model

reference_number = models.CharField(
    max_length=100,
    null=True,
    blank=True,
    help_text="External payment reference (bank transfer, mobile payment)"
)

authorization_code = models.CharField(
    max_length=50,
    null=True,
    blank=True,
    help_text="Card authorization code"
)

transaction_id = models.CharField(
    max_length=100,
    null=True,
    blank=True,
    unique=True,
    help_text="Unique transaction identifier from payment gateway"
)

gateway_response = models.TextField(
    null=True,
    blank=True,
    help_text="Full response from payment gateway (JSON)"
)

notes = models.TextField(
    null=True,
    blank=True,
    help_text="Additional notes about this payment"
)

# Updated Meta indexes
indexes = [
    models.Index(fields=['cart', 'status']),
    models.Index(fields=['method']),
    models.Index(fields=['created_at']),
    models.Index(fields=['reference_number']),
    models.Index(fields=['transaction_id']),
]
```

### Verification Checklist
- [ ] `reference_number` field added (100 chars, nullable)
- [ ] `authorization_code` field added (50 chars, nullable)
- [ ] `transaction_id` field added (100 chars, unique, nullable)
- [ ] `gateway_response` field added (TextField, nullable)
- [ ] `notes` field added (TextField, nullable)
- [ ] Indexes updated for reference fields
- [ ] Help text describes purpose clearly

---

## Task 60: Add Cash Payment Fields

### Overview
Add specialized fields to POSPayment model for handling cash payments, including amount tendered and change calculation.

### Dependencies
- Task 58: Create POSPayment model
- Task 59: Add payment reference fields

### Instructions

1. **Open POSPayment model file**
   - Navigate to `apps/pos/payment/models/pos_payment.py`
   - Locate the POSPayment class definition

2. **Add amount_tendered field**
   - Field name: `amount_tendered`
   - Type: `DecimalField`
   - Max digits: 12
   - Decimal places: 2
   - Nullable: True, blank=True
   - Help text: "Amount of cash given by customer (for cash payments)"
   - Only applicable when method is CASH

3. **Add change_due field**
   - Field name: `change_due`
   - Type: `DecimalField`
   - Max digits: 12
   - Decimal places: 2
   - Nullable: True, blank=True
   - Help text: "Change to return to customer (for cash payments)"
   - Calculated as: amount_tendered - amount

4. **Add is_exact_change property method**
   - Method name: `is_exact_change`
   - Return type: Boolean
   - Returns True if amount_tendered equals amount (no change)
   - Use property decorator for easy access

5. **Add calculate_change method**
   - Method name: `calculate_change`
   - Calculates change_due from amount_tendered and amount
   - Returns Decimal value
   - Validation: amount_tendered must be >= amount

6. **Add save method override (optional)**
   - Override save() method
   - Auto-calculate change_due if amount_tendered provided
   - Only for cash payments
   - Call super().save() at end

### Cash Payment Flow Diagram

```
┌─────────────────────────────────────────────────────────┐
│              Cash Payment Workflow                       │
└─────────────────────────────────────────────────────────┘

    Customer purchases items totaling LKR 1,750.00
                      │
                      ▼
    ┌──────────────────────────────────────┐
    │  Cashier selects CASH payment        │
    │  Cart Total: LKR 1,750.00            │
    └──────────────────────────────────────┘
                      │
                      ▼
    ┌──────────────────────────────────────┐
    │  Cashier enters amount tendered      │
    │  Amount Tendered: LKR 2,000.00       │
    └──────────────────────────────────────┘
                      │
                      ▼
    ┌──────────────────────────────────────┐
    │  System calculates change            │
    │  Change = 2,000 - 1,750 = 250.00     │
    └──────────────────────────────────────┘
                      │
                      ▼
    ┌──────────────────────────────────────┐
    │  Display to cashier:                 │
    │  "Give LKR 250.00 change"            │
    │  (Open cash drawer)                  │
    └──────────────────────────────────────┘
                      │
                      ▼
    ┌──────────────────────────────────────┐
    │  POSPayment record saved:            │
    │  - method: CASH                      │
    │  - amount: 1,750.00                  │
    │  - amount_tendered: 2,000.00         │
    │  - change_due: 250.00                │
    │  - status: COMPLETED                 │
    └──────────────────────────────────────┘
```

### Cash Payment Scenarios

**Scenario 1: Exact Change**
```
Cart Total: LKR 1,500.00
Amount Tendered: LKR 1,500.00
Change Due: LKR 0.00
is_exact_change: True
```

**Scenario 2: Over Payment (Most Common)**
```
Cart Total: LKR 1,750.00
Amount Tendered: LKR 2,000.00
Change Due: LKR 250.00
is_exact_change: False
```

**Scenario 3: Large Bills**
```
Cart Total: LKR 850.00
Amount Tendered: LKR 5,000.00
Change Due: LKR 4,150.00
is_exact_change: False
Note: Check if sufficient change available
```

**Scenario 4: Rounding (Optional)**
```
Cart Total: LKR 1,748.50
Amount Tendered: LKR 1,750.00
Change Due: LKR 1.50
Note: Sri Lanka smallest coin is LKR 1
```

### Sri Lankan Currency Denominations

**Notes (Bills):**
- LKR 5,000 (largest, common)
- LKR 1,000 (very common)
- LKR 500 (common)
- LKR 100 (very common)
- LKR 50 (less common)
- LKR 20 (rare)

**Coins:**
- LKR 10 (common)
- LKR 5 (common)
- LKR 2 (common)
- LKR 1 (common, smallest)

**Note:** Cents (50c, 25c, 10c, 5c) are rarely used in modern transactions.

### Change Calculation Edge Cases

**Under Payment:**
- amount_tendered < amount
- Should be rejected in service layer
- Error: "Insufficient payment"

**Exact Change:**
- amount_tendered == amount
- change_due = 0
- No need to open cash drawer for change
- But still open to store cash

**Large Change:**
- change_due > LKR 1,000
- Warning to cashier: Check if sufficient change available
- May need to request smaller bills from customer

**Rounding:**
- If implementing rounding to nearest LKR 1
- Round cart total before payment
- Document rounding policy

### Expected Outcome
```python
# Additional fields in POSPayment model

amount_tendered = models.DecimalField(
    max_digits=12,
    decimal_places=2,
    null=True,
    blank=True,
    help_text="Amount of cash given by customer (for cash payments)"
)

change_due = models.DecimalField(
    max_digits=12,
    decimal_places=2,
    null=True,
    blank=True,
    help_text="Change to return to customer (for cash payments)"
)

@property
def is_exact_change(self):
    """Check if customer paid exact amount (no change needed)"""
    if self.amount_tendered and self.amount:
        return self.amount_tendered == self.amount
    return False

def calculate_change(self):
    """Calculate change due from amount tendered"""
    if not self.amount_tendered or not self.amount:
        return Decimal('0.00')
    
    change = self.amount_tendered - self.amount
    return max(change, Decimal('0.00'))  # Never negative

def save(self, *args, **kwargs):
    """Override save to auto-calculate change for cash payments"""
    if self.method == 'CASH' and self.amount_tendered:
        self.change_due = self.calculate_change()
    super().save(*args, **kwargs)
```

### Verification Checklist
- [ ] `amount_tendered` field added (12.2 decimal, nullable)
- [ ] `change_due` field added (12.2 decimal, nullable)
- [ ] `is_exact_change` property method implemented
- [ ] `calculate_change` method implemented
- [ ] save() method override with auto-calculation
- [ ] Fields only apply to CASH payments
- [ ] Change calculation handles edge cases

---

## Task 61: Add Payment Timestamp

### Overview
Add timestamp field to track when payment was actually processed, separate from created/updated timestamps.

### Dependencies
- Task 58: Create POSPayment model
- Task 60: Add cash payment fields

### Instructions

1. **Open POSPayment model file**
   - Navigate to `apps/pos/payment/models/pos_payment.py`
   - Locate the POSPayment class definition

2. **Add paid_at field**
   - Field name: `paid_at`
   - Type: `DateTimeField`
   - Nullable: True, blank=True
   - Help text: "Timestamp when payment was successfully completed"
   - Set only when status transitions to COMPLETED

3. **Add failed_at field**
   - Field name: `failed_at`
   - Type: `DateTimeField`
   - Nullable: True, blank=True
   - Help text: "Timestamp when payment failed"
   - Set when status transitions to FAILED

4. **Add refunded_at field**
   - Field name: `refunded_at`
   - Type: `DateTimeField`
   - Nullable: True, blank=True
   - Help text: "Timestamp when payment was refunded"
   - Set when status transitions to REFUNDED

5. **Add voided_at field**
   - Field name: `voided_at`
   - Type: `DateTimeField`
   - Nullable: True, blank=True
   - Help text: "Timestamp when payment was voided"
   - Set when status transitions to VOIDED

6. **Update Meta class indexes**
   - Add index on `paid_at` for reporting queries
   - Used for sales reports, payment reconciliation

7. **Add processing_duration property**
   - Calculate time between created_at and paid_at
   - Useful for analyzing payment gateway performance
   - Returns timedelta or None

### Timestamp Fields Purpose

| Field | Set When | Purpose |
|-------|----------|---------|
| `created_at` | Payment record created | Track when payment initiated |
| `updated_at` | Any field changed | Track last modification |
| `paid_at` | Status → COMPLETED | Track successful completion |
| `failed_at` | Status → FAILED | Track failure time |
| `refunded_at` | Status → REFUNDED | Track refund time |
| `voided_at` | Status → VOIDED | Track cancellation time |

### Payment Timeline Diagram

```
┌────────────────────────────────────────────────────────────┐
│                  Payment Lifecycle Timeline                 │
└────────────────────────────────────────────────────────────┘

Timeline: ──────────────────────────────────────────────────►

         created_at          paid_at
            │                   │
            ▼                   ▼
┌───────────────────────────────────────────────┐
│ PENDING (0-2 sec)     COMPLETED               │
└───────────────────────────────────────────────┘
    ↑                       ↑
    │                       └── Payment successful
    └── Payment initiated

OR (Failed scenario):

         created_at          failed_at
            │                   │
            ▼                   ▼
┌───────────────────────────────────────────────┐
│ PENDING (0-5 sec)     FAILED                  │
└───────────────────────────────────────────────┘
    ↑                       ↑
    │                       └── Card declined
    └── Payment initiated

OR (Refund scenario):

   created_at      paid_at        refunded_at
       │               │               │
       ▼               ▼               ▼
┌──────────────────────────────────────────────┐
│ PENDING → COMPLETED (2 days) → REFUNDED      │
└──────────────────────────────────────────────┘
```

### Use Cases for Timestamps

**Sales Reporting:**
- Query by `paid_at` to get completed payments
- Filter by date range for daily/weekly/monthly sales
- Exclude PENDING/FAILED payments from reports

**Payment Gateway Performance:**
- Calculate processing_duration for each payment
- Identify slow gateways or methods
- Average time: CASH (instant), CARD (2-5 sec), MOBILE (5-30 sec)

**Reconciliation:**
- Match payments by `paid_at` with gateway reports
- Identify discrepancies by comparing timestamps
- Useful for end-of-day settlement

**Audit Trail:**
- Track complete lifecycle of each payment
- When initiated, when completed/failed
- When refunded (if applicable)

**Failed Payment Analysis:**
- Query payments by `failed_at`
- Analyze failure patterns by time of day
- Identify peak failure times

### Example Payment Records with Timestamps

**Successful Cash Payment:**
```
created_at:  2026-01-23 14:30:00
paid_at:     2026-01-23 14:30:01  (1 second)
status:      COMPLETED
```

**Successful Card Payment:**
```
created_at:  2026-01-23 14:35:00
paid_at:     2026-01-23 14:35:03  (3 seconds)
status:      COMPLETED
```

**Failed Card Payment:**
```
created_at:  2026-01-23 14:40:00
failed_at:   2026-01-23 14:40:05  (5 seconds)
status:      FAILED
```

**Refunded Payment:**
```
created_at:   2026-01-20 10:15:00
paid_at:      2026-01-20 10:15:02
refunded_at:  2026-01-23 15:00:00  (3 days later)
status:       REFUNDED
```

### Sri Lankan Business Hours Context

**Peak Sales Times:**
- Morning: 10:00 AM - 12:00 PM
- Afternoon: 2:00 PM - 4:00 PM
- Evening: 6:00 PM - 8:00 PM

**Useful Timestamp Queries:**
- Payments during peak hours
- Weekend vs weekday patterns
- Holiday sales analysis
- Night sales (for 24-hour stores)

### Expected Outcome
```python
# Additional timestamp fields in POSPayment model

paid_at = models.DateTimeField(
    null=True,
    blank=True,
    help_text="Timestamp when payment was successfully completed"
)

failed_at = models.DateTimeField(
    null=True,
    blank=True,
    help_text="Timestamp when payment failed"
)

refunded_at = models.DateTimeField(
    null=True,
    blank=True,
    help_text="Timestamp when payment was refunded"
)

voided_at = models.DateTimeField(
    null=True,
    blank=True,
    help_text="Timestamp when payment was voided"
)

@property
def processing_duration(self):
    """Calculate time taken to process payment"""
    if self.paid_at and self.created_at:
        return self.paid_at - self.created_at
    return None

# Updated Meta indexes
indexes = [
    models.Index(fields=['cart', 'status']),
    models.Index(fields=['method']),
    models.Index(fields=['created_at']),
    models.Index(fields=['reference_number']),
    models.Index(fields=['transaction_id']),
    models.Index(fields=['paid_at']),  # NEW
]
```

### Verification Checklist
- [ ] `paid_at` field added (DateTimeField, nullable)
- [ ] `failed_at` field added (DateTimeField, nullable)
- [ ] `refunded_at` field added (DateTimeField, nullable)
- [ ] `voided_at` field added (DateTimeField, nullable)
- [ ] `processing_duration` property method implemented
- [ ] Index added on `paid_at` for reporting
- [ ] Timestamps set appropriately based on status

---

## Summary

### Tasks Completed in This Document
| Task # | Task Name | Key Deliverable |
|--------|-----------|-----------------|
| 55 | Create payment submodule | `apps/pos/payment/` package structure |
| 56 | Define payment method constants | Payment method constants in constants.py |
| 57 | Define payment status constants | Payment status constants in constants.py |
| 58 | Create POSPayment model | POSPayment model with core fields |
| 59 | Add payment reference fields | Reference, authorization, transaction ID fields |
| 60 | Add cash payment fields | Amount tendered, change calculation |
| 61 | Add payment timestamp | Status-specific timestamps |

### Final POSPayment Model Structure
```
POSPayment Model:
├── Core Fields
│   ├── id (AutoField)
│   ├── cart (ForeignKey to POSCart)
│   ├── method (CharField with choices)
│   ├── amount (DecimalField)
│   ├── status (CharField with choices)
│   └── processed_by (ForeignKey to User)
│
├── Reference Fields
│   ├── reference_number (CharField, nullable)
│   ├── authorization_code (CharField, nullable)
│   ├── transaction_id (CharField, unique, nullable)
│   ├── gateway_response (TextField, nullable)
│   └── notes (TextField, nullable)
│
├── Cash Payment Fields
│   ├── amount_tendered (DecimalField, nullable)
│   └── change_due (DecimalField, nullable)
│
└── Timestamp Fields
    ├── created_at (DateTimeField, auto)
    ├── updated_at (DateTimeField, auto)
    ├── paid_at (DateTimeField, nullable)
    ├── failed_at (DateTimeField, nullable)
    ├── refunded_at (DateTimeField, nullable)
    └── voided_at (DateTimeField, nullable)
```

### Payment Constants Defined
```python
# Payment Methods
PAYMENT_METHOD_CASH = 'CASH'
PAYMENT_METHOD_CARD = 'CARD'
PAYMENT_METHOD_BANK_TRANSFER = 'BANK_TRANSFER'
PAYMENT_METHOD_MOBILE = 'MOBILE'
PAYMENT_METHOD_STORE_CREDIT = 'STORE_CREDIT'
PAYMENT_METHOD_PAYHERE = 'PAYHERE'

# Payment Status
PAYMENT_STATUS_PENDING = 'PENDING'
PAYMENT_STATUS_COMPLETED = 'COMPLETED'
PAYMENT_STATUS_FAILED = 'FAILED'
PAYMENT_STATUS_REFUNDED = 'REFUNDED'
PAYMENT_STATUS_VOIDED = 'VOIDED'
```

### Files Created/Modified
```
apps/pos/
├── payment/                          # NEW
│   ├── __init__.py                   # NEW
│   ├── models/                       # NEW
│   │   ├── __init__.py               # NEW
│   │   └── pos_payment.py            # NEW (Tasks 58-61)
│   └── services/                     # NEW
│       └── __init__.py               # NEW
└── constants.py                      # MODIFIED (Tasks 56-57)
```

### Next Steps
1. **Create migration** for POSPayment model
2. **Run migration** to create database table
3. Proceed to [02_Tasks-62-68_Payment-Service-Methods.md](02_Tasks-62-68_Payment-Service-Methods.md) to implement payment processing service

---

## Notes for AI Agents

1. **Sri Lankan Payment Context:** Focus on CASH, CARD, MOBILE (FriMi, Genie) payment methods
2. **Decimal Precision:** Use Decimal type for all money fields (12.2 format for LKR)
3. **Status Flow:** PENDING → COMPLETED/FAILED/VOIDED, COMPLETED → REFUNDED
4. **Multi-Tenancy:** Consider tenant isolation if using django-tenants
5. **Audit Trail:** All timestamp fields provide complete payment lifecycle tracking
6. **Change Calculation:** Auto-calculate for cash payments in save() method
7. **Indexes:** Add indexes on frequently queried fields (status, paid_at, method)
8. **Gateway Integration:** gateway_response stores full response for debugging
9. **Split Payments:** Model supports multiple payments per cart
10. **Migration:** After model creation, run `python manage.py makemigrations` and `python manage.py migrate`
