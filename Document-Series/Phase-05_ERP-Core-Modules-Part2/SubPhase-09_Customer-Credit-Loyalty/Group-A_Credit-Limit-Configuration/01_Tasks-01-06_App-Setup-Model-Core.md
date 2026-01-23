# Tasks 01-06: Django App Setup & Credit Model Core

> **Phase:** 05 - ERP Core Modules Part 2  
> **SubPhase:** 09 - Customer Credit & Loyalty  
> **Group:** A - Credit Limit & Configuration  
> **Tasks:** 01-06 of 90  
> **Complexity:** Low to Medium  
> **Estimated Time:** 1 hour 45 minutes

---

## Navigation

- **↑ Parent:** [Group A Overview](./00_GROUP_OVERVIEW.md)
- **→ Next Document:** [Tasks 07-11: Status, Dates, Risk & Migration](./02_Tasks-07-11_Status-Dates-Risk-Migration.md)
- **⮨ Previous Group:** None (First Group)
- **⮩ Next Group:** [Group B: Credit Transactions & Aging](../Group-B_Credit-Transactions-Aging/)

---

## Table of Contents

1. [Overview](#overview)
2. [Task 01: Create Credit Django App](#task-01-create-credit-django-app)
3. [Task 02: Register Credit App](#task-02-register-credit-app)
4. [Task 03: Define CreditStatus Choices](#task-03-define-creditstatus-choices)
5. [Task 04: Create CustomerCredit Model](#task-04-create-customercredit-model)
6. [Task 05: Add Credit Limit Fields](#task-05-add-credit-limit-fields)
7. [Task 06: Add Credit Terms Fields](#task-06-add-credit-terms-fields)
8. [Validation Checklist](#validation-checklist)
9. [Sri Lankan Business Context](#sri-lankan-business-context)

---

## Overview

### Purpose

This document covers the foundational setup of the credit and loyalty system for the ERP. You will create a new Django app called `credit` and establish the core `CustomerCredit` model that tracks credit limits, balances, and payment terms for customer credit accounts.

### Key Deliverables

```
apps/credit/
├── __init__.py
├── apps.py                       # App configuration
├── models/
│   ├── __init__.py
│   └── customer_credit.py        # CustomerCredit model with limit/terms fields
└── constants.py                  # CreditStatus choices
```

### Prerequisites

- Django project structure established
- Customer model exists in `apps/customers`
- Multi-tenancy with django-tenants configured
- Base model mixins available

### Technology Stack

- **Django ORM:** Model definitions
- **PostgreSQL:** Database with tenant schemas
- **Decimal Fields:** Precision for monetary amounts (LKR)
- **django-tenants:** Multi-tenant isolation

---

## Task 01: Create Credit Django App

**Complexity:** Low  
**Estimated Time:** 15 minutes

### Objective

Create a new Django application named `credit` to handle all customer credit and loyalty functionality.

### Instructions

#### Step 1: Create App Directory Structure

1. Navigate to the backend apps directory
2. Create new directory `apps/credit/`
3. Create subdirectories:
   - `models/`
   - `services/`
   - `tasks/`
   - `serializers/`
   - `views/`
   - `tests/`

#### Step 2: Create App Configuration File

Create `apps/credit/apps.py`:

**Required Fields:**
- `name = 'apps.credit'`
- `verbose_name = 'Customer Credit & Loyalty'`
- `default_auto_field = 'django.db.models.BigAutoField'`

**Important Considerations:**
- Use proper app label for imports
- Set verbose name for admin display
- Follow project naming conventions

#### Step 3: Create Package Init Files

Create `__init__.py` in:
- `apps/credit/`
- `apps/credit/models/`
- `apps/credit/services/`
- `apps/credit/tasks/`
- `apps/credit/serializers/`
- `apps/credit/views/`
- `apps/credit/tests/`

Set default app config in `apps/credit/__init__.py`:
- Import and assign `default_app_config`

### Validation

- [ ] App directory structure created
- [ ] `apps.py` configured with correct name and verbose name
- [ ] All `__init__.py` files created
- [ ] App can be discovered by Django

---

## Task 02: Register Credit App

**Complexity:** Low  
**Estimated Time:** 10 minutes

### Objective

Register the `credit` app in the Django settings to make it available as a **tenant-specific app** (not shared).

### Instructions

#### Step 1: Locate Settings Configuration

Navigate to your Django settings file where `TENANT_APPS` is configured (likely `settings/base.py` or similar).

#### Step 2: Add to TENANT_APPS

Add `'apps.credit'` to the `TENANT_APPS` list.

**Placement Considerations:**
- Add after core apps (customers, products)
- Add before reporting/analytics apps
- Maintain logical grouping

**Example Order:**
```
TENANT_APPS = [
    'apps.customers',
    'apps.products',
    'apps.inventory',
    'apps.orders',
    'apps.credit',      # Add here
    'apps.invoices',
    'apps.reports',
]
```

#### Step 3: Verify Multi-Tenant Isolation

Ensure the app is:
- **NOT** in `SHARED_APPS` (credit is tenant-specific)
- **IN** `TENANT_APPS` (isolated per tenant)
- Properly ordered for dependency resolution

### Validation

- [ ] `apps.credit` added to `TENANT_APPS`
- [ ] Not present in `SHARED_APPS`
- [ ] Settings file has no syntax errors
- [ ] Django recognizes the app (`python manage.py check`)

---

## Task 03: Define CreditStatus Choices

**Complexity:** Low  
**Estimated Time:** 15 minutes

### Objective

Create status choices for customer credit accounts using Django's `TextChoices` class.

### Instructions

#### Step 1: Create Constants Module

Create `apps/credit/constants.py`.

#### Step 2: Define CreditStatus Enum

Create a `CreditStatus` class inheriting from `models.TextChoices`.

**Required Status Values:**

| Status | Value | Description |
|--------|-------|-------------|
| **ACTIVE** | `'active'` | Credit account is active and can be used |
| **SUSPENDED** | `'suspended'` | Credit temporarily suspended (late payments) |
| **CLOSED** | `'closed'` | Credit account permanently closed |
| **PENDING_APPROVAL** | `'pending_approval'` | Awaiting approval from management |

#### Step 3: Add Display Labels

Provide human-readable labels for each status:
- ACTIVE → "Active"
- SUSPENDED → "Suspended"
- CLOSED → "Closed"
- PENDING_APPROVAL → "Pending Approval"

#### Step 4: Add Helper Methods (Optional)

Consider adding class methods:
- `get_active_statuses()` → Returns list of statuses where credit can be used
- `requires_approval()` → Check if status requires approval

### Sri Lankan Context

In Sri Lankan retail/wholesale businesses:
- Credit is commonly extended to regular customers
- Suspension is common for late payments (rather than immediate closure)
- Approval workflows are important for risk management
- Many businesses operate on Net 30 or Net 60 terms

### Validation

- [ ] `constants.py` created
- [ ] `CreditStatus` inherits from `TextChoices`
- [ ] All four statuses defined with correct values
- [ ] Labels are user-friendly
- [ ] Can import successfully: `from apps.credit.constants import CreditStatus`

---

## Task 04: Create CustomerCredit Model

**Complexity:** Medium  
**Estimated Time:** 25 minutes

### Objective

Create the core `CustomerCredit` model that represents a customer's credit account, linking to the Customer model with a OneToOne relationship.

### Instructions

#### Step 1: Create Model File

Create `apps/credit/models/customer_credit.py`.

#### Step 2: Define Model Class

Create `CustomerCredit` model class.

**Required Relationships:**
- **customer:** OneToOne to Customer
  - Set `on_delete=models.CASCADE`
  - Set `related_name='credit_account'`
  - Make primary access point

#### Step 3: Add Base Fields

Include from your base model mixin (if available):
- UUID primary key (`id`)
- Timestamps (`created_at`, `updated_at`)
- Tenant isolation fields

#### Step 4: Add Status Field

- **status:** CharField
  - Use `CreditStatus.choices`
  - Default to `CreditStatus.PENDING_APPROVAL`
  - Add database index

#### Step 5: Add Model Meta

**Meta Options:**
- `verbose_name = 'Customer Credit Account'`
- `verbose_name_plural = 'Customer Credit Accounts'`
- `db_table = 'credit_customer_credit'`
- `ordering = ['-created_at']`

#### Step 6: Add String Representation

Implement `__str__()` method:
- Return customer name and credit limit
- Example: "John Silva - Rs. 50,000.00"

#### Step 7: Update Models Init

Update `apps/credit/models/__init__.py` to export `CustomerCredit`.

### Database Diagram

```
┌─────────────────────────────────────────┐
│         CustomerCredit                  │
├─────────────────────────────────────────┤
│ id (UUID, PK)                           │
│ customer_id (FK → Customer) [1:1]       │
│ status (Choice: CreditStatus)           │
│ created_at (DateTime)                   │
│ updated_at (DateTime)                   │
│ ... (more fields in Tasks 05-09)       │
└─────────────────────────────────────────┘
         │
         │ OneToOne
         ▼
┌─────────────────────────────────────────┐
│         Customer                        │
├─────────────────────────────────────────┤
│ id (UUID, PK)                           │
│ name (CharField)                        │
│ email (EmailField)                      │
│ ...                                     │
└─────────────────────────────────────────┘
```

### Important Considerations

**OneToOne vs ForeignKey:**
- Use OneToOne: Each customer has exactly ONE credit account
- This ensures credit account is unique per customer
- Simplifies queries: `customer.credit_account`

**Cascading Deletes:**
- When customer deleted → credit account deleted
- Prevents orphaned credit records
- Consider soft-delete if audit trail needed

### Validation

- [ ] `customer_credit.py` created
- [ ] Model inherits from appropriate base
- [ ] OneToOne relationship to Customer
- [ ] Status field uses `CreditStatus.choices`
- [ ] Meta options configured
- [ ] `__str__()` method implemented
- [ ] Exported in `models/__init__.py`

---

## Task 05: Add Credit Limit Fields

**Complexity:** Medium  
**Estimated Time:** 20 minutes

### Objective

Add fields to track credit limits, available credit, and outstanding balances.

### Instructions

#### Step 1: Add Credit Limit Field

- **credit_limit:** DecimalField
  - `max_digits=12` (up to Rs. 99,99,99,999.99)
  - `decimal_places=2`
  - `default=Decimal('0.00')`
  - Help text: "Maximum credit allowed (LKR)"

#### Step 2: Add Available Credit Field

- **available_credit:** DecimalField
  - Same precision as credit_limit
  - `default=Decimal('0.00')`
  - Help text: "Currently available credit (LKR)"
  - Should be calculated as: `credit_limit - outstanding_balance`

#### Step 3: Add Outstanding Balance Field

- **outstanding_balance:** DecimalField
  - Same precision as credit_limit
  - `default=Decimal('0.00')`
  - Help text: "Current amount owed (LKR)"
  - Updated when purchases/payments made

#### Step 4: Add Property for Credit Utilization

Create a calculated property:
- **credit_utilization_percentage**
  - Returns: `(outstanding_balance / credit_limit) × 100`
  - Returns `0.0` if credit_limit is zero
  - Useful for risk assessment

#### Step 5: Add Validation Method

Create `clean()` method to validate:
- `available_credit = credit_limit - outstanding_balance`
- `outstanding_balance >= 0`
- `available_credit >= 0`
- `credit_limit >= 0`

### Field Relationship Diagram

```
┌─────────────────────────────────────────────────────────────┐
│  Credit Limit Calculation                                   │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  credit_limit = Rs. 100,000.00                              │
│         │                                                   │
│         ├─► outstanding_balance = Rs. 35,000.00             │
│         │                                                   │
│         └─► available_credit = Rs. 65,000.00                │
│                                                             │
│  Formula:                                                   │
│  available_credit = credit_limit - outstanding_balance      │
│                                                             │
│  Utilization: 35,000 / 100,000 = 35%                        │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Sri Lankan Context

**Typical Credit Limits in Sri Lanka:**

| Business Type | Typical Credit Limit (LKR) |
|---------------|----------------------------|
| Small Retail Shop | 10,000 - 50,000 |
| Medium Retail Store | 50,000 - 200,000 |
| Restaurant/Hotel | 100,000 - 500,000 |
| Wholesale Buyer | 500,000 - 2,000,000 |
| Corporate Account | 2,000,000+ |

**Currency Considerations:**
- All amounts in Sri Lankan Rupees (LKR)
- Decimal precision important for exact calculations
- Use `Decimal` type (never `float` for money)

### Validation

- [ ] All three decimal fields added with correct precision
- [ ] Default values set to `Decimal('0.00')`
- [ ] Help text includes "(LKR)" currency indicator
- [ ] `credit_utilization_percentage` property implemented
- [ ] `clean()` method validates field relationships
- [ ] Import `Decimal` from `decimal` module

---

## Task 06: Add Credit Terms Fields

**Complexity:** Medium  
**Estimated Time:** 20 minutes

### Objective

Add fields to define payment terms (Net 30, Net 60, etc.) and grace periods before penalties apply.

### Instructions

#### Step 1: Add Payment Terms Field

- **payment_terms_days:** PositiveIntegerField
  - Default: `30` (Net 30)
  - Help text: "Payment due in X days (e.g., Net 30)"
  - Common values: 7, 15, 30, 45, 60, 90

#### Step 2: Add Grace Period Field

- **grace_period_days:** PositiveIntegerField
  - Default: `5`
  - Help text: "Grace period before late fees apply"
  - Allows customers extra days before penalties

#### Step 3: Add Interest Rate Field

- **interest_rate_annual:** DecimalField
  - `max_digits=5`
  - `decimal_places=2`
  - Default: `Decimal('18.00')` (18% per annum)
  - Help text: "Annual interest rate for overdue amounts (%)"
  - Nullable (some accounts may have no interest)

#### Step 4: Add Property for Effective Due Date

Create calculated property:
- **effective_payment_days**
  - Returns: `payment_terms_days + grace_period_days`
  - Example: Net 30 + 5 grace = 35 days total

#### Step 5: Create Helper Method

Add method `calculate_due_date(from_date)`:
- Takes a date (typically order/invoice date)
- Returns due date = `from_date + payment_terms_days days`
- Returns effective due date = `from_date + effective_payment_days`

### Payment Terms Reference

**Common Sri Lankan Business Terms:**

| Term | Days | Description |
|------|------|-------------|
| **Net 7** | 7 | Payment due within 7 days |
| **Net 15** | 15 | Payment due within 15 days |
| **Net 30** | 30 | Payment due within 30 days (most common) |
| **Net 45** | 45 | Payment due within 45 days |
| **Net 60** | 60 | Payment due within 60 days (wholesale) |
| **Net 90** | 90 | Payment due within 90 days (corporate) |

### Grace Period Explanation

```
┌──────────────────────────────────────────────────────────────┐
│  Timeline: Invoice Date → Due Date → Grace Period End       │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  Day 0: Invoice Date (Purchase Made)                        │
│         │                                                    │
│         │◄──── payment_terms_days (30 days) ────►│          │
│         │                                         │          │
│  Day 30: Official Due Date                       │          │
│         │                                         │          │
│         │◄─ grace_period_days (5) ─►│            │          │
│         │                            │            │          │
│  Day 35: Grace Period Ends           │            │          │
│         │                            │            │          │
│         ▼                            ▼            ▼          │
│    [Purchase]              [Late but OK]    [Penalties]     │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

### Interest Rate Context

**Sri Lankan Market Rates:**
- **Typical Business Credit:** 15-24% per annum
- **Low-Risk Customers:** 12-18% per annum
- **High-Risk/Small Retailers:** 18-30% per annum
- **Government Guidelines:** Central Bank rate + margin

**Calculation Example:**
```
Annual Rate: 18%
Monthly Rate: 18% / 12 = 1.5%
Daily Rate: 18% / 365 = 0.0493%

Overdue Amount: Rs. 10,000
Days Overdue: 30 days
Interest = 10,000 × (18% / 365) × 30 = Rs. 147.95
```

### Validation

- [ ] `payment_terms_days` field added (default 30)
- [ ] `grace_period_days` field added (default 5)
- [ ] `interest_rate_annual` field added (nullable, default 18.00)
- [ ] `effective_payment_days` property implemented
- [ ] `calculate_due_date()` method created
- [ ] Help text references Sri Lankan business practices

---

## Validation Checklist

### Code Quality

- [ ] All imports organized and working
- [ ] No syntax errors in any file
- [ ] Constants properly defined
- [ ] Model fields follow naming conventions
- [ ] Help text is descriptive and includes units (LKR, days, %)

### Model Structure

- [ ] CustomerCredit model created with OneToOne to Customer
- [ ] Status field uses CreditStatus choices
- [ ] All limit fields use Decimal with correct precision
- [ ] All term fields use appropriate integer types
- [ ] Meta options configured properly
- [ ] `__str__()` returns meaningful representation

### App Configuration

- [ ] Credit app created in correct directory
- [ ] App registered in `TENANT_APPS` (not SHARED_APPS)
- [ ] All package `__init__.py` files present
- [ ] Models exported in `models/__init__.py`

### Sri Lankan Context

- [ ] Currency references use "LKR" or "Rs."
- [ ] Credit limits appropriate for Sri Lankan market
- [ ] Payment terms reflect local business practices
- [ ] Interest rates align with Central Bank guidelines

### Testing Readiness

- [ ] Can import: `from apps.credit.models import CustomerCredit`
- [ ] Can import: `from apps.credit.constants import CreditStatus`
- [ ] Django check passes: `python manage.py check`
- [ ] Ready to create migrations

---

## Sri Lankan Business Context

### Credit Culture in Sri Lanka

**Why Credit is Important:**
- Many small businesses operate on thin cash margins
- Credit allows retailers to stock inventory before sales
- Personal relationships important in credit decisions
- Common in wholesale and B2B transactions

**Risk Factors in Sri Lankan Market:**
- Economic volatility (exchange rates, inflation)
- Seasonal cash flow (festivals, harvest seasons)
- Limited formal credit reporting
- Relationship-based trust over credit scores

### Typical Credit Workflow

```
┌────────────────────────────────────────────────────────────┐
│  Credit Application Process                                │
├────────────────────────────────────────────────────────────┤
│                                                            │
│  1. Customer requests credit facility                      │
│     │                                                      │
│     ▼                                                      │
│  2. Submit application with references                     │
│     │                                                      │
│     ▼                                                      │
│  3. Credit officer verifies:                               │
│     • Business registration                                │
│     • Bank statements (3-6 months)                         │
│     • Trade references                                     │
│     • Business location visit                              │
│     │                                                      │
│     ▼                                                      │
│  4. Credit limit approved by manager                       │
│     │                                                      │
│     ▼                                                      │
│  5. Credit account activated                               │
│     │                                                      │
│     ▼                                                      │
│  6. Regular review (monthly/quarterly)                     │
│                                                            │
└────────────────────────────────────────────────────────────┘
```

### Regional Credit Limits

Different limits based on location and business type:

| Region | Typical Limit Range (LKR) |
|--------|---------------------------|
| **Colombo** | 50,000 - 500,000 |
| **Gampaha/Kandy** | 30,000 - 300,000 |
| **Provincial Cities** | 20,000 - 200,000 |
| **Rural Areas** | 10,000 - 100,000 |

### Payment Behavior Patterns

**Common Payment Cycles:**
- **End of Month:** Many customers pay at month-end (salary day)
- **Festival Seasons:** Increased credit usage before Sinhala/Tamil New Year, Christmas, Ramadan
- **Harvest Seasons:** Agricultural customers pay after harvest
- **School Terms:** Credit increases at term start (for stationery, uniforms)

---

## Next Steps

After completing Tasks 01-06, proceed to:

→ **[Tasks 07-11: Status, Dates, Risk & Migration](./02_Tasks-07-11_Status-Dates-Risk-Migration.md)**

This will add:
- Credit status and approval fields
- Date tracking (last payment, last purchase)
- Risk assessment fields
- Database indexes for performance
- Initial migrations

---

## References

### Django Documentation
- Model Fields: https://docs.djangoproject.com/en/stable/ref/models/fields/
- Model Meta Options: https://docs.djangoproject.com/en/stable/ref/models/options/
- OneToOne Relationships: https://docs.djangoproject.com/en/stable/ref/models/fields/#onetoonefield

### Sri Lankan Business Resources
- Central Bank of Sri Lanka: https://www.cbsl.gov.lk/
- Interest Rate Guidelines
- Credit Risk Management Best Practices

### Project Resources
- Base Model Mixins: `apps/core/models/base.py`
- Customer Model: `apps/customers/models/customer.py`
- Settings Configuration: `settings/base.py`

---

**Document Version:** 1.0  
**Last Updated:** 2026-01-24  
**Status:** Ready for Implementation
