# Tasks 01-06: App Setup, Model Core, and References

> **Phase:** 05 - ERP Core Modules Part 2  
> **SubPhase:** 07 - Payment Recording  
> **Group:** A - Payment Model & Methods  
> **Document:** 01 of 03  
> **Tasks Covered:** 01, 02, 03, 04, 05, 06

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **→ Next Document:** [02_Tasks-07-12_Date-Currency-Details-User-Notes.md](02_Tasks-07-12_Date-Currency-Details-User-Notes.md)

---

## Document Overview

This document establishes the foundation for the payment recording system by creating the payments Django application, registering it in the tenant configuration, defining payment method and status enumerations, and implementing the core Payment model with reference fields. These elements form the backbone of comprehensive payment tracking for Sri Lankan ERP operations.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 01 | Create payments Django App | Low | 15 min |
| 02 | Register payments App | Low | 10 min |
| 03 | Define PaymentMethod Choices | Low | 15 min |
| 04 | Define PaymentStatus Choices | Low | 15 min |
| 05 | Create Payment Model Core Fields | Medium | 25 min |
| 06 | Add Payment Reference Fields | Medium | 20 min |

---

## Task 01: Create payments Django App

### Overview
Create a dedicated Django application for payment recording and management. This application will handle all payment transactions, including cash, card, bank transfers, mobile payments (FriMi, etc.), checks, and store credit—all payment methods commonly used in Sri Lankan retail and commerce environments.

### Dependencies
- Django project structure is established
- Apps directory (`apps/`) exists
- Multi-tenancy infrastructure is configured

### Instructions

1. **Create payments app directory structure**
   - Navigate to `apps/` directory
   - Create new directory named `payments`
   - This will be a tenant-level app (data isolated per tenant)

2. **Create standard Django app files**
   - Create `__init__.py` as package initialization
   - Create `apps.py` for application configuration
   - Create `models/` directory for model organization
   - Create `models/__init__.py` for model imports

3. **Create additional module directories**
   - Create `services/` directory for business logic
   - Create `services/__init__.py`
   - Create `serializers/` directory for DRF serializers
   - Create `serializers/__init__.py`
   - Create `views/` directory for API views
   - Create `views/__init__.py`

4. **Create utility and test directories**
   - Create `tests/` directory for test files
   - Create `tests/__init__.py`
   - Create `tasks/` directory for Celery tasks
   - Create `tasks/__init__.py`
   - Create `templates/` directory for email and PDF templates
   - Create `templates/emails/` and `templates/pdf/` subdirectories

5. **Configure app in apps.py**
   - Define `PaymentsConfig` class extending `AppConfig`
   - Set `name = 'apps.payments'`
   - Set `verbose_name = 'Payment Management'`
   - Add default auto field configuration

6. **Create constants.py file**
   - Create `constants.py` in `payments/` root
   - Will contain payment method choices, status choices, and constants

7. **Create admin.py file**
   - Create `admin.py` for Django admin configurations
   - Will register payment-related models

### Directory Structure
```
apps/payments/
├── __init__.py                    # Package initialization
├── apps.py                        # App configuration
├── constants.py                   # Constants and choices
├── admin.py                       # Django admin
├── models/
│   └── __init__.py               # Model imports
├── services/
│   └── __init__.py               # Business logic services
├── serializers/
│   └── __init__.py               # DRF serializers
├── views/
│   └── __init__.py               # API views
├── tasks/
│   └── __init__.py               # Celery tasks
├── tests/
│   └── __init__.py               # Test files
└── templates/
    ├── emails/                    # Email templates
    └── pdf/                       # PDF templates
```

### App Purpose

The payments app will handle:
- Recording payments across all methods (cash, card, bank, mobile, check, credit)
- Partial payment support for installment sales
- Split payments across multiple payment methods
- Payment allocation to invoices and orders
- Refund processing with approval workflow
- Payment receipt generation (PDF)
- Payment history and audit trails
- Payment method configuration per tenant
- Integration with Sri Lankan payment gateways (future)

### Expected Outcome
- Clean Django app structure for payments
- Organized directories for models, services, and views
- Foundation for payment recording system

### Verification Checklist
- [ ] `apps/payments/` directory exists
- [ ] `apps.py` with PaymentsConfig created
- [ ] `models/`, `services/`, `serializers/`, `views/` directories created
- [ ] `tasks/`, `tests/`, `templates/` directories created
- [ ] All `__init__.py` files created
- [ ] `constants.py` and `admin.py` files created

---

## Task 02: Register payments App

### Overview
Register the payments application in Django settings as a TENANT_APPS entry. This ensures that payment models and data are isolated per tenant in the multi-tenant architecture, providing data separation between different businesses using the ERP system.

### Dependencies
- Task 01: Create payments Django App
- Django settings configured with TENANT_APPS and SHARED_APPS

### Instructions

1. **Locate Django settings file**
   - Navigate to project settings directory
   - Open main settings file (likely `config/settings/base.py` or similar)

2. **Find TENANT_APPS configuration**
   - Locate the `TENANT_APPS` list in settings
   - This list contains apps whose data is isolated per tenant
   - Payments must be tenant-specific (each tenant has own payment records)

3. **Add payments to TENANT_APPS**
   - Add `'apps.payments'` to the TENANT_APPS list
   - Place after `'apps.invoices'` (dependency)
   - Place before `'apps.reports'` (if exists)

4. **Verify INSTALLED_APPS includes tenant apps**
   - Ensure `INSTALLED_APPS` is composed of SHARED_APPS + TENANT_APPS
   - Payments should appear in the combined app list

5. **Consider app ordering for migrations**
   - Payments depends on: customers, products, orders, invoices
   - Ensure these dependencies are registered before payments

### Configuration Location

The registration typically looks like:
```
TENANT_APPS = [
    'apps.core',
    'apps.customers',
    'apps.products',
    'apps.inventory',
    'apps.pos',
    'apps.orders',
    'apps.invoices',
    'apps.payments',        # Add here
    ...
]
```

### TENANT_APPS vs SHARED_APPS

| App Type | Data Isolation | Examples |
|----------|----------------|----------|
| TENANT_APPS | Isolated per tenant | payments, invoices, customers |
| SHARED_APPS | Shared across tenants | users, tenants, authentication |

### Expected Outcome
- Payments app registered in TENANT_APPS
- Payment models will use tenant-specific schemas
- Payment data isolated per business
- Migration system recognizes the app

### Verification Checklist
- [ ] `apps.payments` added to TENANT_APPS
- [ ] App order respects dependencies
- [ ] Django recognizes the app (check with `python manage.py showmigrations payments`)

---

## Task 03: Define PaymentMethod Choices

### Overview
Define the enumeration of payment methods supported in the system. These choices reflect common payment methods used in Sri Lankan commerce, including cash, payment cards, bank transfers, mobile wallets (FriMi, eZ Cash, etc.), checks, and store credit.

### Dependencies
- Task 01: Create payments Django App
- `constants.py` file exists

### Instructions

1. **Open constants.py file**
   - Navigate to `apps/payments/constants.py`
   - Add module docstring explaining payment constants

2. **Define PaymentMethod choices**
   - Create `PaymentMethod` class or tuple constant
   - Use Django's TextChoices pattern (recommended) or tuple pattern
   - Each choice has a value (database storage) and label (display)

3. **Define CASH payment method**
   - Value: `'CASH'`
   - Label: `'Cash'`
   - Purpose: Physical cash payments in LKR
   - Most common in Sri Lankan retail
   - Requires amount tendered and change calculation

4. **Define CARD payment method**
   - Value: `'CARD'`
   - Label: `'Card (Visa/MasterCard)'`
   - Purpose: Credit/debit card payments
   - Common in urban areas and larger transactions
   - Requires card type, last 4 digits, approval code

5. **Define BANK_TRANSFER payment method**
   - Value: `'BANK_TRANSFER'`
   - Label: `'Bank Transfer'`
   - Purpose: Direct bank transfers between accounts
   - Common for B2B payments
   - Requires bank name and reference number

6. **Define MOBILE payment method**
   - Value: `'MOBILE'`
   - Label: `'Mobile Payment (FriMi/eZ Cash)'`
   - Purpose: Mobile wallet payments
   - Growing in Sri Lanka (FriMi, eZ Cash, mCash)
   - Requires provider name and transaction ID

7. **Define CHECK payment method**
   - Value: `'CHECK'`
   - Label: `'Check'`
   - Purpose: Bank check payments
   - Still used in Sri Lanka for larger B2B payments
   - Requires check number, bank, and date
   - May support post-dated checks

8. **Define STORE_CREDIT payment method**
   - Value: `'STORE_CREDIT'`
   - Label: `'Store Credit'`
   - Purpose: Payment using customer's store credit balance
   - Created from refunds or promotional credits
   - Deducts from customer balance

### Payment Method Details

| Method | Value | Common Use | Validation Needs |
|--------|-------|------------|------------------|
| CASH | `'CASH'` | Walk-in sales, small amounts | Amount tendered ≥ total |
| CARD | `'CARD'` | Urban retail, online | Card details, approval code |
| BANK_TRANSFER | `'BANK_TRANSFER'` | B2B, large amounts | Bank reference verification |
| MOBILE | `'MOBILE'` | Urban/tech-savvy customers | Transaction ID verification |
| CHECK | `'CHECK'` | B2B, delayed payment | Check clearing period |
| STORE_CREDIT | `'STORE_CREDIT'` | Repeat customers, refunds | Sufficient balance |

### Sri Lankan Payment Context

**Cash Dominance:**
- Still primary payment method in Sri Lanka
- Denominations: Rs. 20, 50, 100, 500, 1000, 5000
- Change calculation critical for POS operations

**Mobile Payment Growth:**
- FriMi (Sampath Bank & LOLC Finance)
- eZ Cash
- mCash (Dialog)
- Growing adoption in urban areas

**Banking Infrastructure:**
- Online transfer systems (CEFTS, SLIPS)
- Common banks: Commercial Bank, Sampath Bank, HNB, NSB
- SWIFT codes for international transfers

**Check Usage:**
- Still common for B2B transactions
- Post-dated checks accepted for credit sales
- Typical clearing period: 3-5 business days

### Expected Outcome
- Six payment method choices defined
- Values optimized for database storage
- Labels clear for user interfaces
- Ready for use in Payment model

### Verification Checklist
- [ ] PaymentMethod enumeration defined
- [ ] All six methods included (CASH, CARD, BANK_TRANSFER, MOBILE, CHECK, STORE_CREDIT)
- [ ] Values are uppercase strings
- [ ] Labels are user-friendly
- [ ] Docstring explains Sri Lankan context

---

## Task 04: Define PaymentStatus Choices

### Overview
Define the enumeration of payment statuses that track the lifecycle of a payment from initiation through completion or failure. These statuses enable proper state management, workflow control, and audit trails for all payment transactions.

### Dependencies
- Task 01: Create payments Django App
- Task 03: Define PaymentMethod Choices
- `constants.py` file exists

### Instructions

1. **Open constants.py file**
   - Continue in `apps/payments/constants.py`
   - Add PaymentStatus choices after PaymentMethod

2. **Define PaymentStatus choices**
   - Create `PaymentStatus` class or tuple constant
   - Use Django's TextChoices pattern (recommended)
   - Each status represents a distinct payment state

3. **Define PENDING status**
   - Value: `'PENDING'`
   - Label: `'Pending'`
   - Purpose: Payment initiated but not yet processed
   - Initial state for most payments
   - Awaiting confirmation or approval

4. **Define COMPLETED status**
   - Value: `'COMPLETED'`
   - Label: `'Completed'`
   - Purpose: Payment successfully processed
   - Final state for successful payments
   - Triggers receipt generation and invoice update

5. **Define FAILED status**
   - Value: `'FAILED'`
   - Label: `'Failed'`
   - Purpose: Payment processing failed
   - Card declined, insufficient funds, technical error
   - May allow retry

6. **Define CANCELLED status**
   - Value: `'CANCELLED'`
   - Label: `'Cancelled'`
   - Purpose: Payment cancelled before processing
   - User-initiated cancellation or timeout
   - Terminal state (no further transitions)

7. **Define REFUNDED status**
   - Value: `'REFUNDED'`
   - Label: `'Refunded'`
   - Purpose: Payment has been refunded (fully or partially)
   - Reached after refund processing
   - Links to refund records

### Payment Status Flow

```
                    ┌─────────────────┐
                    │   PENDING       │ ← Initial state
                    │  (Initiated)    │
                    └────────┬────────┘
                             │
        ┌────────────────────┼────────────────────┐
        │                    │                    │
        ▼                    ▼                    ▼
┌───────────────┐    ┌───────────────┐   ┌───────────────┐
│   COMPLETED   │    │    FAILED     │   │   CANCELLED   │
│  (Processed)  │    │   (Error)     │   │ (User cancel) │
└───────┬───────┘    └───────┬───────┘   └───────────────┘
        │                    │
        │                    └─────► (Retry) ───┐
        │                                       │
        ▼                                       ▼
┌───────────────┐                       ┌───────────────┐
│   REFUNDED    │                       │   PENDING     │
│  (Reversed)   │                       │   (Retry)     │
└───────────────┘                       └───────────────┘
```

### Status Transition Rules

| Current Status | Allowed Transitions | Trigger |
|----------------|---------------------|---------|
| PENDING | COMPLETED, FAILED, CANCELLED | Process, error, or cancel action |
| COMPLETED | REFUNDED | Refund request approval |
| FAILED | PENDING | Retry payment |
| CANCELLED | *(none)* | Terminal state |
| REFUNDED | *(none)* | Terminal state |

### Status Descriptions

**PENDING:**
- Payment record created
- Awaiting processing or approval
- May require manager approval for large amounts
- Can be cancelled without financial impact
- Common for: checks, bank transfers (awaiting verification)

**COMPLETED:**
- Payment successfully processed
- Funds received or verified
- Invoice/order marked as paid
- Receipt generated and sent
- Cannot be cancelled (only refunded)

**FAILED:**
- Payment processing encountered error
- Examples: card declined, insufficient funds, timeout
- Customer notified of failure
- Can retry payment
- No financial impact (no reversal needed)

**CANCELLED:**
- User cancelled before processing
- Examples: customer changed mind, wrong amount entered
- No financial impact
- Cannot be reactivated (create new payment)
- Audit trail preserved

**REFUNDED:**
- Original payment reversed (full or partial)
- Refund record linked
- Customer balance updated if store credit
- Invoice balance adjusted
- May have multiple partial refunds

### Expected Outcome
- Five payment status choices defined
- Clear state transition logic
- Ready for Payment model status field
- Support for payment workflow management

### Verification Checklist
- [ ] PaymentStatus enumeration defined
- [ ] All five statuses included (PENDING, COMPLETED, FAILED, CANCELLED, REFUNDED)
- [ ] Values are uppercase strings
- [ ] Labels are user-friendly
- [ ] Status flow documented

---

## Task 05: Create Payment Model Core Fields

### Overview
Create the core Payment model with essential fields for tracking payment transactions. This model serves as the central record for all payment activities, capturing the payment number, method, status, amount, and timestamps. The model follows multi-tenant patterns and integrates with the broader ERP system.

### Dependencies
- Task 01: Create payments Django App
- Task 02: Register payments App
- Task 03: Define PaymentMethod Choices
- Task 04: Define PaymentStatus Choices
- Customer, Order, Invoice models exist (from previous subphases)

### Instructions

1. **Create payment.py model file**
   - Create `payment.py` in `apps/payments/models/`
   - Import necessary Django modules
   - Import BaseModel (tenant-aware base model)
   - Import PaymentMethod and PaymentStatus from constants

2. **Define Payment model class**
   - Extend `BaseModel` (provides tenant isolation, created_at, updated_at)
   - Add model docstring explaining purpose
   - Set model Meta class

3. **Add payment_number field**
   - Type: `CharField`
   - Max length: 30 characters
   - Unique per tenant
   - Auto-generated format: `PAY-{YEAR}-{SEQUENCE}`
   - Example: `PAY-2026-00001`
   - Indexed for fast lookup

4. **Add method field**
   - Type: `CharField`
   - Max length: 20 characters
   - Choices: `PaymentMethod.choices`
   - Required field (no null)
   - Indexed for filtering

5. **Add status field**
   - Type: `CharField`
   - Max length: 20 characters
   - Choices: `PaymentStatus.choices`
   - Default: `PaymentStatus.PENDING`
   - Required field
   - Indexed for filtering

6. **Add amount field**
   - Type: `DecimalField`
   - Max digits: 15
   - Decimal places: 2
   - Required field (no null)
   - Must be positive (validated in constraints)
   - Stores actual payment amount

7. **Add tenant timestamp fields**
   - `created_at`: Auto-added by BaseModel
   - `updated_at`: Auto-added by BaseModel
   - These track record creation and modification

8. **Configure model Meta class**
   - Set `db_table = 'payments'`
   - Set `verbose_name = 'Payment'`
   - Set `verbose_name_plural = 'Payments'`
   - Set `ordering = ['-created_at']` (newest first)

9. **Add __str__ method**
   - Return payment number and amount
   - Format: `"PAY-2026-00001 (LKR 10,000.00)"`

10. **Add get_absolute_url method**
    - Return URL for payment detail view
    - Use reverse with payment ID

### Model Structure

```
Payment Model (Core Fields)
├── id                    [UUID, PK, auto]
├── tenant                [FK to Tenant, inherited from BaseModel]
├── payment_number        [CharField, unique, indexed]
├── method                [CharField, choices=PaymentMethod]
├── status                [CharField, choices=PaymentStatus, default=PENDING]
├── amount                [DecimalField, 15 digits, 2 decimal places]
├── created_at            [DateTimeField, auto_now_add]
└── updated_at            [DateTimeField, auto_now]
```

### Field Specifications

| Field | Type | Required | Default | Indexed | Notes |
|-------|------|----------|---------|---------|-------|
| payment_number | CharField(30) | Yes | Auto-gen | Yes | PAY-{YEAR}-{SEQ} |
| method | CharField(20) | Yes | - | Yes | From PaymentMethod choices |
| status | CharField(20) | Yes | PENDING | Yes | From PaymentStatus choices |
| amount | Decimal(15,2) | Yes | - | No | Must be positive |
| created_at | DateTime | Yes | now() | Yes | From BaseModel |
| updated_at | DateTime | Yes | now() | No | From BaseModel |

### Payment Number Format

```
PAY-{YEAR}-{SEQUENCE}

Examples:
PAY-2026-00001    First payment of 2026
PAY-2026-00123    123rd payment of 2026
PAY-2027-00001    First payment of 2027 (sequence resets)

Format ensures:
- Year identification for accounting periods
- Sequential tracking within year
- Easy sorting and filtering
- No conflicts across years
```

### Amount Field Precision

```
DecimalField(max_digits=15, decimal_places=2)

Supports amounts up to: 9,999,999,999,999.99
                       (9.9 trillion LKR)

Typical Sri Lankan transactions:
- Retail sale:        Rs. 1,234.50
- Large purchase:     Rs. 500,000.00
- B2B transaction:    Rs. 10,000,000.00

Precision: 2 decimal places for cents (50 cents = Rs. 0.50)
```

### Expected Outcome
- Payment model with core fields created
- Auto-generated payment numbers
- Payment method and status tracking
- Decimal precision for financial amounts
- Ready for reference fields (Task 06)

### Verification Checklist
- [ ] `payment.py` file created in `models/` directory
- [ ] Payment class extends BaseModel
- [ ] payment_number field defined with unique constraint
- [ ] method field with PaymentMethod choices
- [ ] status field with PaymentStatus choices and PENDING default
- [ ] amount field with DecimalField(15, 2)
- [ ] Meta class configured
- [ ] `__str__` method implemented

---

## Task 06: Add Payment Reference Fields

### Overview
Extend the Payment model with foreign key references that link payments to their related entities: invoices, orders, and customers. These relationships enable payment allocation, balance tracking, and comprehensive reporting across the ERP system.

### Dependencies
- Task 05: Create Payment Model Core Fields
- Customer model exists (apps.customers)
- Order model exists (apps.orders)
- Invoice model exists (apps.invoices)

### Instructions

1. **Open payment.py model file**
   - Continue editing `apps/payments/models/payment.py`
   - Import Customer, Order, Invoice models

2. **Add invoice field**
   - Type: `ForeignKey` to Invoice model
   - Related name: `'payments'`
   - On delete: `PROTECT` (cannot delete invoice with payments)
   - Nullable: `Yes` (some payments not tied to invoice yet)
   - Purpose: Links payment to specific invoice
   - Enables invoice payment allocation

3. **Add order field**
   - Type: `ForeignKey` to Order model
   - Related name: `'payments'`
   - On delete: `PROTECT` (cannot delete order with payments)
   - Nullable: `Yes` (not all payments have orders)
   - Purpose: Links payment to point-of-sale order
   - Direct payment recording at POS

4. **Add customer field**
   - Type: `ForeignKey` to Customer model
   - Related name: `'payments'`
   - On delete: `PROTECT` (preserve payment history)
   - Nullable: `Yes` (walk-in sales may have no customer)
   - Purpose: Links payment to customer account
   - Enables customer payment history and balance tracking

5. **Add indexes for reference fields**
   - Create index on `invoice_id` (frequent queries)
   - Create index on `order_id` (frequent queries)
   - Create index on `customer_id` (customer reports)

6. **Update model Meta class**
   - Add indexes list
   - Add `index_together` for common query patterns

7. **Add property methods for relationships**
   - `has_invoice()`: Boolean check if payment linked to invoice
   - `has_order()`: Boolean check if payment linked to order
   - `has_customer()`: Boolean check if payment linked to customer

### Extended Model Structure

```
Payment Model (With References)
├── [Core Fields from Task 05]
├── invoice               [FK to Invoice, nullable, indexed]
├── order                 [FK to Order, nullable, indexed]
└── customer              [FK to Customer, nullable, indexed]
```

### Foreign Key Specifications

| Field | Model | Related Name | On Delete | Nullable | Purpose |
|-------|-------|--------------|-----------|----------|---------|
| invoice | Invoice | payments | PROTECT | Yes | Payment for invoice |
| order | Order | payments | PROTECT | Yes | Payment for POS order |
| customer | Customer | payments | PROTECT | Yes | Payment by customer |

### Relationship Patterns

**Payment → Invoice:**
```
Invoice: INV-2026-00123 (LKR 10,000)
    ↓
Payment 1: PAY-2026-00456 (LKR 6,000) - Partial
Payment 2: PAY-2026-00457 (LKR 4,000) - Complete

Result: Invoice fully paid via two payments
```

**Payment → Order:**
```
POS Order: ORD-2026-00789
    ↓
Payment: PAY-2026-00458 (LKR 2,500) - Immediate

Result: POS transaction completed
```

**Payment → Customer:**
```
Customer: "Perera Traders"
    ↓
Payment 1: PAY-2026-00459 (for Invoice 001)
Payment 2: PAY-2026-00460 (for Invoice 002)
Payment 3: PAY-2026-00461 (for Invoice 003)

Result: Customer payment history tracked
```

### Query Optimization

**Index Strategy:**
- Single indexes on: invoice_id, order_id, customer_id
- Composite index on: (customer_id, created_at) for customer reports
- Composite index on: (status, method) for payment reports

**Common Queries:**
```
# All payments for invoice
payments = Payment.objects.filter(invoice_id=invoice_id)

# Customer payment history
payments = Payment.objects.filter(
    customer_id=customer_id
).order_by('-created_at')

# Today's cash payments
payments = Payment.objects.filter(
    method=PaymentMethod.CASH,
    created_at__date=today
)
```

### Reverse Relationships

**From Invoice:**
```
invoice.payments.all()           # All payments for invoice
invoice.payments.filter(
    status=PaymentStatus.COMPLETED
)                                # Completed payments only
```

**From Order:**
```
order.payments.first()           # Typically one payment per order
order.payments.aggregate(
    Sum('amount')
)                                # Total paid for order
```

**From Customer:**
```
customer.payments.filter(
    created_at__year=2026
)                                # Customer's 2026 payments
customer.payments.aggregate(
    total=Sum('amount')
)                                # Lifetime customer payments
```

### Nullable Reference Logic

**Why nullable FKs:**
- **Invoice nullable:** Payment might be recorded before invoice generation
- **Order nullable:** Not all payments are POS transactions
- **Customer nullable:** Anonymous/walk-in sales don't require customer

**Validation rules:**
- At least one of invoice OR order should be set
- If neither set, validate business reason (e.g., deposit, prepayment)
- Customer usually required unless walk-in sale

### Expected Outcome
- Payment model links to invoices, orders, and customers
- Proper cascade protection on deletions
- Indexed for query performance
- Support for complex payment scenarios

### Verification Checklist
- [ ] invoice ForeignKey added with related_name='payments'
- [ ] order ForeignKey added with related_name='payments'
- [ ] customer ForeignKey added with related_name='payments'
- [ ] All FKs use PROTECT on delete
- [ ] All FKs are nullable
- [ ] Indexes added for reference fields
- [ ] Property methods for relationship checks added
- [ ] Model imports updated

---

## Related Diagrams

### Payment Core Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    PAYMENT MODEL (CORE)                     │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Identification:                                            │
│  ├─ payment_number: PAY-{YEAR}-{SEQ}                       │
│  └─ id: UUID                                                │
│                                                             │
│  Payment Details:                                           │
│  ├─ method: CASH | CARD | BANK_TRANSFER |                  │
│  │          MOBILE | CHECK | STORE_CREDIT                  │
│  ├─ status: PENDING | COMPLETED | FAILED |                 │
│  │          CANCELLED | REFUNDED                            │
│  └─ amount: Decimal(15,2) in LKR                          │
│                                                             │
│  References:                                                │
│  ├─ invoice: FK → Invoice (nullable)                       │
│  ├─ order: FK → Order (nullable)                           │
│  └─ customer: FK → Customer (nullable)                     │
│                                                             │
│  Timestamps:                                                │
│  ├─ created_at: Auto timestamp                             │
│  └─ updated_at: Auto timestamp                             │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Payment Entity Relationships

```
┌──────────────┐         ┌──────────────┐         ┌──────────────┐
│   CUSTOMER   │         │    ORDER     │         │   INVOICE    │
│              │         │              │         │              │
│ - id         │         │ - id         │         │ - id         │
│ - name       │         │ - order_num  │         │ - inv_num    │
│ - balance    │         │ - total      │         │ - total      │
└──────┬───────┘         └──────┬───────┘         └──────┬───────┘
       │                        │                        │
       │ payments               │ payments               │ payments
       │ (reverse FK)           │ (reverse FK)           │ (reverse FK)
       │                        │                        │
       └────────────────┬───────┴────────────────────────┘
                        │
                        │ invoice FK
                        │ order FK
                        │ customer FK
                        ▼
              ┌──────────────────┐
              │     PAYMENT      │
              │                  │
              │ - payment_number │
              │ - method         │
              │ - status         │
              │ - amount         │
              │ - invoice_id     │◄── Links to Invoice
              │ - order_id       │◄── Links to Order
              │ - customer_id    │◄── Links to Customer
              └──────────────────┘
```

### Payment Method Breakdown (Sri Lankan Context)

```
                    ┌──────────────────────┐
                    │  PAYMENT METHODS     │
                    │   (Sri Lankan ERP)   │
                    └──────────┬───────────┘
                               │
          ┌────────────────────┼────────────────────┐
          │                    │                    │
          ▼                    ▼                    ▼
    ┌──────────┐         ┌──────────┐        ┌──────────┐
    │   CASH   │         │   CARD   │        │  MOBILE  │
    │          │         │          │        │          │
    │ • LKR    │         │ • Visa   │        │ • FriMi  │
    │ • Change │         │ • Master │        │ • eZ Cash│
    └──────────┘         │ • Last 4 │        │ • mCash  │
                         └──────────┘        └──────────┘
          │                    │                    │
          ▼                    ▼                    ▼
    ┌──────────┐         ┌──────────┐        ┌──────────┐
    │  CHECK   │         │ BANK TRF │        │  STORE   │
    │          │         │          │        │  CREDIT  │
    │ • Number │         │ • Bank   │        │          │
    │ • Date   │         │ • Ref #  │        │ • Balance│
    │ • Bank   │         │ • SWIFT  │        │ • Deduct │
    └──────────┘         └──────────┘        └──────────┘
```

---

## Notes for AI Agents

### Multi-Tenancy Considerations
- All Payment records isolated per tenant
- BaseModel provides automatic tenant filtering
- Payment numbers unique within tenant, not globally
- Each tenant can configure their own payment methods

### Data Integrity
- PROTECT on delete ensures no orphaned payments
- Payment records never deleted (audit trail)
- Status transitions logged in PaymentHistory
- Amount field uses Decimal for precise financial calculations

### Sri Lankan Business Rules
- LKR is default currency (multi-currency in future phases)
- Mobile payments growing rapidly in urban areas
- Checks still common for B2B (post-dated checks accepted)
- Cash still dominates in rural areas

### Performance Optimization
- Indexes on frequently queried fields (status, method, customer)
- Composite indexes for common report queries
- Avoid N+1 queries using select_related for FKs

### Future Extensions (Later Tasks)
- Payment date fields (Task 07)
- Currency and exchange rate (Task 08)
- Method-specific details JSONField (Task 09)
- User tracking (received_by, approved_by) (Task 11)
- Payment number generator service (Task 13)

---

## Summary

This document established the foundational infrastructure for payment recording:

1. ✅ Created payments Django application with proper structure
2. ✅ Registered app in TENANT_APPS for multi-tenancy
3. ✅ Defined PaymentMethod choices (6 methods for Sri Lankan commerce)
4. ✅ Defined PaymentStatus choices (5 states with clear workflow)
5. ✅ Implemented Payment model core fields (number, method, status, amount)
6. ✅ Added reference fields linking to invoice, order, and customer

**Next Steps:** Proceed to [02_Tasks-07-12_Date-Currency-Details-User-Notes.md](02_Tasks-07-12_Date-Currency-Details-User-Notes.md) to add date fields, currency support, method details, and user tracking.

