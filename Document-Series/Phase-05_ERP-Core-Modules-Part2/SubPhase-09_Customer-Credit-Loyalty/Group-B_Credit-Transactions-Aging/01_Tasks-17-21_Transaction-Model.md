# Tasks 17-21: Transaction Model

> **Phase:** 05 - ERP Core Modules Part 2  
> **SubPhase:** 09 - Customer Credit & Loyalty  
> **Group:** B - Credit Transactions & Aging  
> **Tasks:** 17-21 of 90  
> **Complexity:** Medium  
> **Estimated Time:** 1 hour 35 minutes

---

## Navigation

- **↑ Parent:** [Group B Overview](./00_GROUP_OVERVIEW.md)
- **→ Next Document:** [Tasks 22-27: Service & Aging](./02_Tasks-22-27_Service-Aging.md)
- **← Previous Group:** [Group A: Credit Limit & Configuration](../Group-A_Credit-Limit-Configuration/)
- **⮩ Next Group:** [Group C: Loyalty Points System](../Group-C_Loyalty-Points-System/)

---

## Table of Contents

1. [Overview](#overview)
2. [Task 17: Create CreditTransaction Model](#task-17-create-credittransaction-model)
3. [Task 18: Define TransactionType Choices](#task-18-define-transactiontype-choices)
4. [Task 19: Add Transaction Fields](#task-19-add-transaction-fields)
5. [Task 20: Add Transaction Date Fields](#task-20-add-transaction-date-fields)
6. [Task 21: Run Transaction Migrations](#task-21-run-transaction-migrations)
7. [Validation Checklist](#validation-checklist)
8. [Transaction Flow Diagrams](#transaction-flow-diagrams)

---

## Overview

### Purpose

This document covers the creation of the `CreditTransaction` model that records all credit-related activities: purchases on credit, payments received, adjustments, interest charges, and write-offs.

### Key Deliverables

```
apps/credit/
├── models/
│   ├── __init__.py
│   └── credit_transaction.py      # Tasks 17-20
├── constants.py                   # Task 18 additions
└── migrations/
    └── 0003_transaction.py        # Task 21
```

### Prerequisites

- Group A tasks completed (CustomerCredit model exists)
- Order/Invoice models available for references
- Understanding of double-entry bookkeeping concepts

---

## Task 17: Create CreditTransaction Model

**Complexity:** Medium  
**Estimated Time:** 25 minutes

### Objective

Create the `CreditTransaction` model to record every credit-related transaction, maintaining a complete audit trail of credit usage and payments.

### Instructions

#### Step 1: Create Model File

Create `apps/credit/models/credit_transaction.py`.

#### Step 2: Define CreditTransaction Model

**Required Relationships:**
- **credit_account:** ForeignKey to CustomerCredit
  - `on_delete=models.CASCADE`
  - `related_name='transactions'`
  - Links transaction to credit account

#### Step 3: Add Base Fields

Include from base model mixin:
- UUID primary key (`id`)
- Timestamps (`created_at`, `updated_at`)
- Tenant isolation

#### Step 4: Add Transaction Identification

**Transaction Number:**
- **transaction_number:** CharField
  - `max_length=50`
  - `unique=True`
  - Auto-generated (e.g., "CT-2026-00001")
  - Help text: "Unique transaction number"

**Transaction Type:**
- **transaction_type:** CharField
  - Use choices (defined in Task 18)
  - Help text: "Type of credit transaction"

#### Step 5: Add Amount and Balance Fields

**Amount:**
- **amount:** DecimalField
  - `max_digits=12`, `decimal_places=2`
  - Always positive value
  - Help text: "Transaction amount (LKR)"

**Balance After:**
- **balance_after:** DecimalField
  - `max_digits=12`, `decimal_places=2`
  - Running balance after this transaction
  - Help text: "Credit balance after transaction (LKR)"

#### Step 6: Add Reference Fields

**Reference Type:**
- **reference_type:** CharField
  - `max_length=50`
  - `null=True`, `blank=True`
  - Examples: "Order", "Invoice", "Payment", "Manual"

**Reference ID:**
- **reference_id:** UUIDField
  - `null=True`, `blank=True`
  - Links to original document (order, invoice, etc.)

#### Step 7: Add Notes Field

**Notes:**
- **notes:** TextField
  - `blank=True`
  - Help text: "Additional notes about transaction"

#### Step 8: Add Model Meta

```
Meta:
    verbose_name = 'Credit Transaction'
    verbose_name_plural = 'Credit Transactions'
    db_table = 'credit_transaction'
    ordering = ['-transaction_date', '-created_at']
```

#### Step 9: Add String Representation

Return transaction number, type, and amount.

### Transaction Model Diagram

```
┌──────────────────────────────────────────────────────────────┐
│         CreditTransaction                                    │
├──────────────────────────────────────────────────────────────┤
│ id (UUID, PK)                                                │
│ credit_account_id (FK → CustomerCredit)                      │
│ transaction_number (Unique: "CT-2026-00001")                 │
│ transaction_type (Choice: TransactionType)                   │
│ amount (Decimal: Rs. 10,000.00)                              │
│ balance_after (Decimal: Rs. 45,000.00)                       │
│ reference_type (CharField: "Order")                          │
│ reference_id (UUID: order_id)                                │
│ transaction_date (DateTime)                                  │
│ due_date (Date) [for purchases]                              │
│ paid_date (Date) [for payments]                              │
│ notes (TextField)                                            │
│ created_at, updated_at                                       │
└──────────────────────────────────────────────────────────────┘
         │
         │ Many to One
         ▼
┌──────────────────────────────────────────────────────────────┐
│         CustomerCredit                                       │
├──────────────────────────────────────────────────────────────┤
│ id (UUID, PK)                                                │
│ customer_id (FK → Customer) [1:1]                            │
│ credit_limit (Decimal)                                       │
│ available_credit (Decimal)                                   │
│ outstanding_balance (Decimal)                                │
│ ...                                                          │
└──────────────────────────────────────────────────────────────┘
```

### Important Considerations

**Running Balance:**
- `balance_after` provides complete audit trail
- Can reconstruct balance at any point in time
- Helps detect discrepancies
- Example timeline:
  - Start: Rs. 0
  - Purchase Rs. 10,000 → Balance: Rs. 10,000
  - Payment Rs. 5,000 → Balance: Rs. 5,000
  - Purchase Rs. 8,000 → Balance: Rs. 13,000

**Transaction Numbers:**
- Format: `CT-{YEAR}-{SEQUENCE}`
- Example: CT-2026-00001, CT-2026-00002
- Unique across all tenants (or per tenant)
- Sequential for easy tracking
- Include year for annual reset

### Validation

- [ ] `credit_transaction.py` created
- [ ] Model inherits from base model
- [ ] ForeignKey to CustomerCredit
- [ ] Transaction number field with unique constraint
- [ ] Amount and balance fields with correct precision
- [ ] Reference fields for linking
- [ ] Meta options configured
- [ ] `__str__()` method implemented

---

## Task 18: Define TransactionType Choices

**Complexity:** Low  
**Estimated Time:** 15 minutes

### Objective

Define transaction type choices that categorize different types of credit transactions.

### Instructions

#### Step 1: Update Constants Module

Open `apps/credit/constants.py`.

#### Step 2: Define TransactionType Enum

Create `TransactionType` class using `TextChoices`:

| Type | Value | Description |
|------|-------|-------------|
| **CREDIT_PURCHASE** | `'credit_purchase'` | Purchase made using credit |
| **PAYMENT** | `'payment'` | Payment received from customer |
| **ADJUSTMENT** | `'adjustment'` | Manual balance adjustment |
| **INTEREST** | `'interest'` | Interest charge on overdue |
| **WRITE_OFF** | `'write_off'` | Bad debt write-off |

#### Step 3: Add Display Labels

Provide user-friendly labels:
- CREDIT_PURCHASE → "Credit Purchase"
- PAYMENT → "Payment"
- ADJUSTMENT → "Adjustment"
- INTEREST → "Interest Charge"
- WRITE_OFF → "Write-Off"

#### Step 4: Add Helper Methods

**increases_balance():**
- Returns True for: CREDIT_PURCHASE, INTEREST, ADJUSTMENT (if positive)
- Returns False for: PAYMENT, WRITE_OFF

**decreases_balance():**
- Returns True for: PAYMENT, WRITE_OFF, ADJUSTMENT (if negative)
- Returns False for: CREDIT_PURCHASE, INTEREST

**requires_approval():**
- Returns True for: WRITE_OFF, large ADJUSTMENT
- Returns False for: normal operations

### Transaction Type Flow

```
┌──────────────────────────────────────────────────────────────┐
│  Transaction Types & Balance Impact                          │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  CREDIT_PURCHASE (Increases Balance):                        │
│  • Customer buys Rs. 10,000 worth of goods                   │
│  • Outstanding balance increases by Rs. 10,000               │
│  • Available credit decreases by Rs. 10,000                  │
│  • Due date calculated from purchase date                    │
│                                                              │
│  PAYMENT (Decreases Balance):                                │
│  • Customer pays Rs. 5,000                                   │
│  • Outstanding balance decreases by Rs. 5,000                │
│  • Available credit increases by Rs. 5,000                   │
│  • Applied to oldest outstanding transactions                │
│                                                              │
│  INTEREST (Increases Balance):                               │
│  • System calculates Rs. 500 interest on overdue             │
│  • Outstanding balance increases by Rs. 500                  │
│  • Available credit decreases by Rs. 500                     │
│  • Generated automatically by scheduled task                 │
│                                                              │
│  ADJUSTMENT (Either Direction):                              │
│  • Manual correction by manager                              │
│  • Can increase or decrease balance                          │
│  • Requires authorization                                    │
│  • Documented in notes                                       │
│                                                              │
│  WRITE_OFF (Decreases Balance):                              │
│  • Bad debt written off Rs. 2,000                            │
│  • Outstanding balance decreases by Rs. 2,000                │
│  • Does NOT increase available credit                        │
│  • Account typically closed                                  │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

### Sri Lankan Context

**Payment Methods:**
- Cash payments (common in retail)
- Bank transfers (wholesale)
- Cheque payments (still widely used)
- Online/mobile banking (growing)

**Interest Charges:**
- Monthly calculation common
- 1.5% per month typical (18% annual)
- Applied to overdue amounts only
- Grace period before charging

### Validation

- [ ] `TransactionType` added to `constants.py`
- [ ] All five types defined
- [ ] Labels are user-friendly
- [ ] Helper methods implemented
- [ ] Can import: `from apps.credit.constants import TransactionType`

---

## Task 19: Add Transaction Fields

**Complexity:** Medium  
**Estimated Time:** 20 minutes

### Objective

Add additional fields to track transaction details, processing information, and payment methods.

### Instructions

#### Step 1: Add Processed By Field

**Processed By:**
- **processed_by:** ForeignKey to User
  - `on_delete=models.SET_NULL`
  - `null=True`, `blank=True`
  - `related_name='processed_credit_transactions'`
  - Help text: "User who processed this transaction"

#### Step 2: Add Payment Method Field

**Payment Method:**
- **payment_method:** CharField
  - `max_length=50`
  - `blank=True`
  - Choices: CASH, BANK_TRANSFER, CHEQUE, CARD, MOBILE_PAYMENT
  - Only for PAYMENT transactions

**Payment Reference:**
- **payment_reference:** CharField
  - `max_length=100`
  - `blank=True`
  - Cheque number, transaction ID, etc.

#### Step 3: Add Status Field

**Status:**
- **status:** CharField
  - Choices: PENDING, COMPLETED, FAILED, REVERSED
  - Default: COMPLETED
  - Help text: "Transaction status"

**Status Explanation:**
- PENDING: Payment initiated, not yet cleared (cheque)
- COMPLETED: Transaction completed successfully
- FAILED: Payment failed (bounced cheque, failed transfer)
- REVERSED: Transaction reversed/cancelled

#### Step 4: Add Reversal Tracking

**Is Reversed:**
- **is_reversed:** BooleanField
  - Default: `False`
  - Marks transaction as reversed

**Reversed At:**
- **reversed_at:** DateTimeField
  - `null=True`, `blank=True`

**Reversed By:**
- **reversed_by:** ForeignKey to User
  - `on_delete=models.SET_NULL`
  - `null=True`, `blank=True`
  - `related_name='reversed_credit_transactions'`

**Reversal Reason:**
- **reversal_reason:** TextField
  - `blank=True`
  - Explanation for reversal

#### Step 5: Add Interest Calculation Fields

**Interest Amount:**
- **interest_amount:** DecimalField
  - `max_digits=12`, `decimal_places=2`
  - `default=Decimal('0.00')`
  - For INTEREST type transactions

**Interest Days:**
- **interest_days:** PositiveIntegerField
  - `null=True`, `blank=True`
  - Number of days overdue for interest calculation

**Interest Rate Applied:**
- **interest_rate_applied:** DecimalField
  - `max_digits=5`, `decimal_places=2`
  - `null=True`, `blank=True`
  - Rate used for this interest calculation

#### Step 6: Create Helper Properties

**is_credit_transaction:**
- Returns True if increases balance (purchase, interest)

**is_debit_transaction:**
- Returns True if decreases balance (payment, write-off)

**can_be_reversed:**
- Returns True if transaction can be reversed
- False if already reversed or too old

### Transaction Status Lifecycle

```
┌──────────────────────────────────────────────────────────────┐
│  Transaction Status Flow                                     │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  PAYMENT Transaction:                                        │
│                                                              │
│  [PENDING]                                                   │
│      │                                                       │
│      │ Payment initiated (cheque deposited)                  │
│      │                                                       │
│      ├─────────────┬──────────────┐                          │
│      │             │              │                          │
│      ▼             ▼              ▼                          │
│  [COMPLETED]   [FAILED]    [REVERSED]                        │
│      │             │              │                          │
│      │ Cheque      │ Cheque       │ Error correction         │
│      │ cleared     │ bounced      │                          │
│      │             │              │                          │
│      │             │              ▼                          │
│      │             │         is_reversed = True              │
│      │             │         reversed_at = now               │
│      │             │         reversed_by = user              │
│      │             │                                         │
│      │             ▼                                         │
│      │        Credit balance                                 │
│      │        restored                                       │
│      │                                                       │
│      ▼                                                       │
│  Balance updated                                             │
│  Available credit increased                                  │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

### Validation

- [ ] `processed_by` field added
- [ ] Payment method and reference fields added
- [ ] Status field with choices
- [ ] Reversal tracking fields added
- [ ] Interest calculation fields added
- [ ] Helper properties implemented

---

## Task 20: Add Transaction Date Fields

**Complexity:** Medium  
**Estimated Time:** 20 minutes

### Objective

Add date fields to track transaction timing, due dates for purchases, and payment dates.

### Instructions

#### Step 1: Add Transaction Date

**Transaction Date:**
- **transaction_date:** DateTimeField
  - Default: `timezone.now`
  - Help text: "When transaction occurred"
  - Actual transaction time

#### Step 2: Add Due Date (for Purchases)

**Due Date:**
- **due_date:** DateField
  - `null=True`, `blank=True`
  - Help text: "Payment due date (for credit purchases)"
  - Calculated as: transaction_date + payment_terms_days
  - Only set for CREDIT_PURCHASE transactions

#### Step 3: Add Paid Date (for Payments)

**Paid Date:**
- **paid_date:** DateField
  - `null=True`, `blank=True`
  - Help text: "When payment was made"
  - Set when PAYMENT transaction recorded

#### Step 4: Add Effective Date

**Effective Date:**
- **effective_date:** DateField
  - Default: today
  - Help text: "Date when transaction takes effect"
  - May differ from transaction_date for backdated entries

#### Step 5: Create Date Helper Properties

**days_overdue:**
- Returns days between due_date and today
- Returns 0 if not overdue
- Returns None if no due date

**is_overdue:**
- Returns True if today > due_date
- Returns False otherwise

**days_until_due:**
- Returns days between today and due_date
- Negative if overdue

**payment_delay_days:**
- For PAYMENT transactions
- Returns days between due_date and paid_date
- Indicates if payment was late

#### Step 6: Add Date Validation

Create `clean()` method to validate:
- `due_date` only for CREDIT_PURCHASE
- `paid_date` only for PAYMENT
- `effective_date <= transaction_date`
- Dates make logical sense

### Transaction Timeline Diagram

```
┌──────────────────────────────────────────────────────────────┐
│  Credit Purchase Timeline                                    │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  transaction_date                                            │
│         │                                                    │
│         ▼                                                    │
│    [2026-01-15 10:30:00] Purchase made                       │
│         │                                                    │
│         │                                                    │
│         │◄──── payment_terms_days (30) ────►│               │
│         │                                    │               │
│         │                                    ▼               │
│         │                              due_date              │
│         │                                    │               │
│         │                              [2026-02-14]          │
│         │                                    │               │
│         │                                    │               │
│         │◄──── grace_period_days (5) ───────┤               │
│         │                                    │               │
│         │                                    ▼               │
│         │                          [2026-02-19] Grace ends   │
│         │                                    │               │
│         │                                    │               │
│         │                                    ▼               │
│         │                              [TODAY: 2026-02-25]   │
│         │                                    │               │
│         │                                    ├─► 6 days      │
│         │                                        overdue!    │
│         │                                                    │
│         ▼                                                    │
│    Payment made                                              │
│         │                                                    │
│         ▼                                                    │
│    paid_date = [2026-02-25]                                  │
│    payment_delay_days = 11 days (6 overdue + 5 grace)       │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

### Sri Lankan Business Calendar

**Public Holidays to Consider:**
- Poya Days (Full Moon, monthly)
- Sinhala/Tamil New Year (April)
- Christmas/Eid holidays
- National holidays

**Business Day Adjustments:**
- Due dates falling on holidays → next business day
- Payment grace period includes holidays
- Monthly statements adjusted for holiday months

### Validation

- [ ] `transaction_date` field added with default
- [ ] `due_date` field added (nullable)
- [ ] `paid_date` field added (nullable)
- [ ] `effective_date` field added
- [ ] Date helper properties implemented
- [ ] Date validation in `clean()` method

---

## Task 21: Run Transaction Migrations

**Complexity:** Low  
**Estimated Time:** 15 minutes

### Objective

Generate and apply migrations for the `CreditTransaction` model.

### Instructions

#### Step 1: Verify Model Complete

Ensure CreditTransaction model has:
- All fields from Tasks 17-20
- All imports correct
- No syntax errors
- Passes `python manage.py check`

#### Step 2: Generate Migration

```bash
python manage.py makemigrations credit
```

**Expected Output:**
- `0003_transaction.py` created
- Includes CreditTransaction model

#### Step 3: Review Migration

Check for:
- Model creation
- All fields with correct types
- Foreign keys to CustomerCredit, User
- Indexes (if any added)

#### Step 4: Apply Migration

```bash
python manage.py migrate credit
```

**Expected:**
- Migration applies successfully
- Table created: `credit_transaction`
- Foreign key constraints created

#### Step 5: Add Database Indexes

After confirming migration works, consider adding indexes for:
- `transaction_date` (frequent ordering)
- `due_date` (overdue queries)
- `(credit_account, transaction_date)` (account history)
- `transaction_type` (filtering by type)

Update model Meta with indexes and create new migration.

#### Step 6: Test Transaction Creation

Test in Django shell:

```python
from apps.credit.models import CustomerCredit, CreditTransaction
from apps.credit.constants import TransactionType
from decimal import Decimal
from django.utils import timezone

# Get credit account
credit = CustomerCredit.objects.first()

# Create purchase transaction
transaction = CreditTransaction.objects.create(
    credit_account=credit,
    transaction_number='CT-2026-00001',
    transaction_type=TransactionType.CREDIT_PURCHASE,
    amount=Decimal('10000.00'),
    balance_after=Decimal('10000.00'),
    transaction_date=timezone.now(),
    due_date=timezone.now().date() + timedelta(days=30),
    reference_type='Order',
    notes='Test purchase'
)

print(transaction)
print(f"Is overdue: {transaction.is_overdue}")
```

### Testing Checklist

```
□ Can create CREDIT_PURCHASE transaction
□ Can create PAYMENT transaction
□ Can create INTEREST transaction
□ Can create ADJUSTMENT transaction
□ Balance calculations work
□ Date fields populate correctly
□ Foreign keys link properly
□ Transaction numbers unique
□ Helper properties return correct values
□ Validation prevents invalid data
```

### Validation

- [ ] Migration generated successfully
- [ ] Migration reviewed and correct
- [ ] Migration applied without errors
- [ ] Table created in database
- [ ] Can create all transaction types
- [ ] Foreign keys work correctly
- [ ] Date calculations work
- [ ] Helper properties return expected values

---

## Validation Checklist

### Model Structure

- [ ] CreditTransaction model created
- [ ] Inherits from base model
- [ ] ForeignKey to CustomerCredit
- [ ] All core fields present
- [ ] All date fields present
- [ ] All payment fields present
- [ ] All reversal fields present
- [ ] All interest fields present

### Transaction Types

- [ ] TransactionType choices defined
- [ ] All five types included
- [ ] Helper methods work
- [ ] Can import from constants

### Functionality

- [ ] Can create transactions
- [ ] Balance tracking works
- [ ] Date calculations correct
- [ ] Status transitions valid
- [ ] Reversal logic works

### Database

- [ ] Migration successful
- [ ] Table created
- [ ] Foreign keys work
- [ ] Queries perform well

---

## Transaction Flow Diagrams

### Purchase on Credit Flow

```
┌──────────────────────────────────────────────────────────────┐
│  Credit Purchase Transaction Flow                            │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  1. Customer places order                                    │
│     │                                                        │
│     ▼                                                        │
│  2. Check available credit                                   │
│     │                                                        │
│     ├─► If insufficient → Reject                             │
│     └─► If sufficient → Continue                             │
│         │                                                    │
│         ▼                                                    │
│  3. Create Order                                             │
│     │                                                        │
│     ▼                                                        │
│  4. Create CreditTransaction                                 │
│     • type = CREDIT_PURCHASE                                 │
│     • amount = order total                                   │
│     • balance_after = old balance + amount                   │
│     • due_date = today + payment_terms_days                  │
│     • reference_type = 'Order'                               │
│     • reference_id = order.id                                │
│     │                                                        │
│     ▼                                                        │
│  5. Update CustomerCredit                                    │
│     • outstanding_balance += amount                          │
│     • available_credit -= amount                             │
│     • last_purchase_date = today                             │
│     │                                                        │
│     ▼                                                        │
│  6. Generate invoice                                         │
│     │                                                        │
│     ▼                                                        │
│  7. Send confirmation to customer                            │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

### Payment Received Flow

```
┌──────────────────────────────────────────────────────────────┐
│  Payment Transaction Flow                                    │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  1. Customer makes payment                                   │
│     │                                                        │
│     ▼                                                        │
│  2. Record payment details                                   │
│     • Amount                                                 │
│     • Payment method                                         │
│     • Payment reference                                      │
│     │                                                        │
│     ▼                                                        │
│  3. Create CreditTransaction                                 │
│     • type = PAYMENT                                         │
│     • amount = payment amount                                │
│     • balance_after = old balance - amount                   │
│     • paid_date = today                                      │
│     • payment_method = method                                │
│     • payment_reference = reference                          │
│     │                                                        │
│     ▼                                                        │
│  4. Update CustomerCredit                                    │
│     • outstanding_balance -= amount                          │
│     • available_credit += amount                             │
│     • last_payment_date = today                              │
│     │                                                        │
│     ▼                                                        │
│  5. Apply payment to oldest invoices (FIFO)                  │
│     │                                                        │
│     ▼                                                        │
│  6. Update risk score (positive adjustment)                  │
│     │                                                        │
│     ▼                                                        │
│  7. Send payment receipt                                     │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

---

## Next Steps

After completing Tasks 17-21, proceed to:

→ **[Tasks 22-27: Service & Aging](./02_Tasks-22-27_Service-Aging.md)**

This will implement:
- CreditService class for business logic
- Purchase and payment methods
- Credit limit checking
- Balance calculation
- Aging bucket calculator

---

## References

### Django Documentation
- Model Fields: https://docs.djangoproject.com/en/stable/ref/models/fields/
- Model Methods: https://docs.djangoproject.com/en/stable/topics/db/models/#model-methods
- Transactions: https://docs.djangoproject.com/en/stable/topics/db/transactions/

### Accounting Principles
- Double-Entry Bookkeeping
- Transaction Audit Trails
- Reconciliation Practices

### Project Resources
- CustomerCredit Model: `apps/credit/models/customer_credit.py`
- Base Models: `apps/core/models/base.py`
- User Model: Authentication configuration

---

**Document Version:** 1.0  
**Last Updated:** 2026-01-24  
**Status:** Ready for Implementation
