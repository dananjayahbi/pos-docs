# Tasks 07-11: Status, Dates, Risk & Migration

> **Phase:** 05 - ERP Core Modules Part 2  
> **SubPhase:** 09 - Customer Credit & Loyalty  
> **Group:** A - Credit Limit & Configuration  
> **Tasks:** 07-11 of 90  
> **Complexity:** Medium  
> **Estimated Time:** 1 hour 35 minutes

---

## Navigation

- **↑ Parent:** [Group A Overview](./00_GROUP_OVERVIEW.md)
- **← Previous Document:** [Tasks 01-06: App Setup & Model Core](./01_Tasks-01-06_App-Setup-Model-Core.md)
- **→ Next Document:** [Tasks 12-16: Settings & Approval Workflow](./03_Tasks-12-16_Settings-Approval-Workflow.md)

---

## Table of Contents

1. [Overview](#overview)
2. [Task 07: Add Credit Status Fields](#task-07-add-credit-status-fields)
3. [Task 08: Add Credit Date Fields](#task-08-add-credit-date-fields)
4. [Task 09: Add Credit Risk Fields](#task-09-add-credit-risk-fields)
5. [Task 10: Create Credit Model Indexes](#task-10-create-credit-model-indexes)
6. [Task 11: Run Initial Credit Migrations](#task-11-run-initial-credit-migrations)
7. [Validation Checklist](#validation-checklist)
8. [Performance Considerations](#performance-considerations)

---

## Overview

### Purpose

This document extends the `CustomerCredit` model with fields for tracking approval status, date milestones, and risk assessment metrics. You'll also create database indexes for optimal query performance and generate the initial migration.

### Key Deliverables

- Credit status tracking fields (approved_by, approved_at, suspended_reason)
- Date milestone fields (last_payment, last_purchase, next_payment_due)
- Risk assessment fields (risk_score, late_payment_count, default_count)
- Database indexes for frequently queried fields
- Initial migration file

### Prerequisites

- Tasks 01-06 completed
- CustomerCredit model with limit and terms fields
- User model available for approval tracking

---

## Task 07: Add Credit Status Fields

**Complexity:** Medium  
**Estimated Time:** 20 minutes

### Objective

Add fields to track credit approval, suspension status, and the users responsible for these actions.

### Instructions

#### Step 1: Add Approved By Field

- **approved_by:** ForeignKey to User
  - `on_delete=models.SET_NULL`
  - `null=True`, `blank=True`
  - `related_name='approved_credit_accounts'`
  - Help text: "User who approved this credit account"

#### Step 2: Add Approved At Field

- **approved_at:** DateTimeField
  - `null=True`, `blank=True`
  - Help text: "When the credit account was approved"
  - Auto-set when status changes to ACTIVE

#### Step 3: Add Suspended By Field

- **suspended_by:** ForeignKey to User
  - `on_delete=models.SET_NULL`
  - `null=True`, `blank=True`
  - `related_name='suspended_credit_accounts'`
  - Help text: "User who suspended this credit account"

#### Step 4: Add Suspended At Field

- **suspended_at:** DateTimeField
  - `null=True`, `blank=True`
  - Help text: "When the credit account was suspended"

#### Step 5: Add Suspended Reason Field

- **suspended_reason:** TextField
  - `blank=True`, `null=True`
  - Help text: "Reason for credit suspension"
  - Common reasons: "Late payments", "Credit limit exceeded", "Risk assessment"

#### Step 6: Add Notes Field

- **notes:** TextField
  - `blank=True`
  - Help text: "Internal notes about this credit account"
  - For credit officer observations

### Status Lifecycle Diagram

```
┌──────────────────────────────────────────────────────────────┐
│  Credit Account Status Lifecycle                             │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  [PENDING_APPROVAL]                                          │
│         │                                                    │
│         │ ◄─── Application submitted                        │
│         │                                                    │
│         ▼                                                    │
│    Approval Process                                          │
│         │                                                    │
│         ├─── approved_by set                                 │
│         ├─── approved_at set                                 │
│         │                                                    │
│         ▼                                                    │
│    [ACTIVE] ◄──────────────────┐                             │
│         │                      │                             │
│         │                      │ (Resume after payment)      │
│         │                      │                             │
│         ▼                      │                             │
│   Late Payment Detected        │                             │
│         │                      │                             │
│         ├─── suspended_by set  │                             │
│         ├─── suspended_at set  │                             │
│         ├─── suspended_reason  │                             │
│         │                      │                             │
│         ▼                      │                             │
│    [SUSPENDED] ────────────────┘                             │
│         │                                                    │
│         │ (If unrecoverable)                                 │
│         │                                                    │
│         ▼                                                    │
│    [CLOSED]                                                  │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

### Important Considerations

**SET_NULL on User Deletion:**
- If user (credit officer) is deleted, credit records preserved
- Approval/suspension history remains via timestamps
- Consider soft-delete for users if audit trail critical

**Timestamp Automation:**
- Set `approved_at` when status → ACTIVE
- Set `suspended_at` when status → SUSPENDED
- Use Django signals or save() override

### Validation

- [ ] `approved_by` field added (ForeignKey to User)
- [ ] `approved_at` field added (DateTimeField, nullable)
- [ ] `suspended_by` field added (ForeignKey to User)
- [ ] `suspended_at` field added (DateTimeField, nullable)
- [ ] `suspended_reason` field added (TextField, nullable)
- [ ] `notes` field added (TextField, blank)
- [ ] Related names set to avoid conflicts

---

## Task 08: Add Credit Date Fields

**Complexity:** Medium  
**Estimated Time:** 20 minutes

### Objective

Add fields to track key date milestones in the credit account lifecycle: last payment received, last purchase made, and next payment due date.

### Instructions

#### Step 1: Add Last Payment Date

- **last_payment_date:** DateField
  - `null=True`, `blank=True`
  - Help text: "Date of last payment received"
  - Updated when payment recorded

#### Step 2: Add Last Purchase Date

- **last_purchase_date:** DateField
  - `null=True`, `blank=True`
  - Help text: "Date of last credit purchase"
  - Updated when credit used for purchase

#### Step 3: Add Next Payment Due Date

- **next_payment_due:** DateField
  - `null=True`, `blank=True`
  - Help text: "Next payment due date"
  - Calculated from oldest unpaid transaction

#### Step 4: Add Account Opened Date

- **account_opened_date:** DateField
  - `auto_now_add=True`
  - Help text: "When credit account was opened"
  - Immutable after creation

#### Step 5: Create Helper Properties

Add calculated properties:

**days_since_last_payment:**
- Returns days between today and `last_payment_date`
- Returns `None` if no payment recorded
- Useful for monitoring payment frequency

**days_until_next_payment:**
- Returns days between today and `next_payment_due`
- Negative if overdue
- Returns `None` if no payment due

**is_payment_overdue:**
- Returns `True` if `next_payment_due < today`
- Returns `False` otherwise

### Date Tracking Diagram

```
┌──────────────────────────────────────────────────────────────┐
│  Credit Date Tracking Timeline                               │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  account_opened_date (immutable)                             │
│         │                                                    │
│         ▼                                                    │
│    [2025-01-15] Account Created                              │
│         │                                                    │
│         ├─────► last_purchase_date                           │
│         │              │                                     │
│         │              ▼                                     │
│         │         [2025-01-20] Purchase Rs. 30,000           │
│         │              │                                     │
│         │              │                                     │
│         │              ├─────► next_payment_due              │
│         │              │              │                      │
│         │              │              ▼                      │
│         │              │         [2025-02-19] (Net 30)       │
│         │              │              │                      │
│         │              │              │                      │
│         ├─────────────►│◄─────────────┘                      │
│         │              │                                     │
│         │              ▼                                     │
│         │         [2025-02-15] Payment Rs. 15,000            │
│         │              │                                     │
│         │              ├─────► last_payment_date             │
│         │                                                    │
│         ▼                                                    │
│    [Today: 2025-03-01]                                       │
│         │                                                    │
│         ├─► days_since_last_payment = 14 days                │
│         ├─► days_until_next_payment = -10 days (OVERDUE!)   │
│         └─► is_payment_overdue = True                        │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

### Sri Lankan Context

**Payment Pattern Insights:**
- End-of-month payments very common (salary day)
- Poya day holidays can delay payments
- Festival seasons see delayed payments (Avurudu, Christmas)
- Consider business days vs calendar days

**Monitoring Frequency:**
- Daily check for overdue accounts
- Weekly reminder for upcoming due dates
- Monthly statement generation

### Validation

- [ ] `last_payment_date` field added
- [ ] `last_purchase_date` field added
- [ ] `next_payment_due` field added
- [ ] `account_opened_date` field added with `auto_now_add`
- [ ] `days_since_last_payment` property implemented
- [ ] `days_until_next_payment` property implemented
- [ ] `is_payment_overdue` property implemented

---

## Task 09: Add Credit Risk Fields

**Complexity:** Medium  
**Estimated Time:** 20 minutes

### Objective

Add fields to track risk metrics that help evaluate customer creditworthiness and identify high-risk accounts.

### Instructions

#### Step 1: Add Risk Score Field

- **risk_score:** PositiveIntegerField
  - Default: `50`
  - `validators=[MinValueValidator(0), MaxValueValidator(100)]`
  - Help text: "Risk score 0-100 (higher = riskier)"
  - 0-30: Low risk (Green)
  - 31-60: Medium risk (Yellow)
  - 61-100: High risk (Red)

#### Step 2: Add Late Payment Count

- **late_payment_count:** PositiveIntegerField
  - Default: `0`
  - Help text: "Number of late payments"
  - Incremented when payment past grace period

#### Step 3: Add Default Count

- **default_count:** PositiveIntegerField
  - Default: `0`
  - Help text: "Number of payment defaults (90+ days overdue)"
  - Serious indicator of credit risk

#### Step 4: Add Total Payments Made

- **total_payments_made:** PositiveIntegerField
  - Default: `0`
  - Help text: "Total number of payments received"
  - Track payment history

#### Step 5: Add On-Time Payment Percentage

- **on_time_payment_percentage:** DecimalField
  - `max_digits=5`, `decimal_places=2`
  - Default: `Decimal('100.00')`
  - Help text: "Percentage of on-time payments"
  - Calculate as: `(on_time_payments / total_payments) × 100`

#### Step 6: Add Last Risk Assessment Date

- **last_assessment_date:** DateField
  - `null=True`, `blank=True`
  - Help text: "When risk was last assessed"
  - Updated when risk score recalculated

#### Step 7: Create Risk Evaluation Methods

Add methods:

**get_risk_level():**
- Returns "LOW", "MEDIUM", or "HIGH" based on risk_score

**calculate_payment_reliability():**
- Returns decimal 0.0-1.0
- Based on on-time payment percentage and history

**should_suspend():**
- Returns True if:
  - late_payment_count >= 3
  - OR default_count >= 1
  - OR risk_score >= 80

### Risk Scoring Model

```
┌──────────────────────────────────────────────────────────────┐
│  Risk Score Calculation (0-100)                              │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  Base Score: 50 (neutral)                                    │
│                                                              │
│  Adjustments:                                                │
│  ─────────────────────────────────────────────────────      │
│                                                              │
│  POSITIVE (Lower Score = Less Risk):                         │
│  • On-time payment ratio > 90%        → -15 points           │
│  • Account age > 1 year              → -10 points           │
│  • No late payments                  → -15 points           │
│  • Utilization < 50%                 → -10 points           │
│                                                              │
│  NEGATIVE (Higher Score = More Risk):                        │
│  • Each late payment                 → +10 points           │
│  • Each default                      → +25 points           │
│  • Utilization > 90%                 → +15 points           │
│  • No payments in 60 days            → +20 points           │
│                                                              │
│  Risk Levels:                                                │
│  ┌────────────┬──────────┬──────────────────┐               │
│  │ Score      │ Level    │ Action           │               │
│  ├────────────┼──────────┼──────────────────┤               │
│  │   0-30     │ LOW      │ Increase limit   │               │
│  │  31-60     │ MEDIUM   │ Monitor          │               │
│  │  61-80     │ HIGH     │ Warning, reduce  │               │
│  │  81-100    │ CRITICAL │ Suspend          │               │
│  └────────────┴──────────┴──────────────────┘               │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

### Risk Assessment Workflow

```
┌──────────────────────────────────────────────────────────────┐
│  Automated Risk Assessment (Daily Task)                      │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  For each active credit account:                             │
│                                                              │
│  1. Calculate base score (50)                                │
│     │                                                        │
│     ▼                                                        │
│  2. Apply payment history adjustments                        │
│     │                                                        │
│     ▼                                                        │
│  3. Apply utilization adjustments                            │
│     │                                                        │
│     ▼                                                        │
│  4. Apply recency adjustments                                │
│     │                                                        │
│     ▼                                                        │
│  5. Clamp to 0-100 range                                     │
│     │                                                        │
│     ▼                                                        │
│  6. Update risk_score and last_assessment_date               │
│     │                                                        │
│     ▼                                                        │
│  7. If should_suspend() → change status to SUSPENDED         │
│     │                                                        │
│     ▼                                                        │
│  8. Notify credit manager if risk level changed              │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

### Sri Lankan Risk Factors

**High-Risk Indicators:**
- Frequent small payments (cash flow issues)
- Payment only after reminders
- Seasonal business with irregular payments
- New business without track record
- High staff turnover at customer site

**Low-Risk Indicators:**
- Consistent on-time payments
- Long business relationship
- Low credit utilization
- Multiple payment methods
- Stable business location

### Validation

- [ ] `risk_score` field added with validators (0-100)
- [ ] `late_payment_count` field added
- [ ] `default_count` field added
- [ ] `total_payments_made` field added
- [ ] `on_time_payment_percentage` field added
- [ ] `last_assessment_date` field added
- [ ] `get_risk_level()` method implemented
- [ ] `calculate_payment_reliability()` method implemented
- [ ] `should_suspend()` method implemented

---

## Task 10: Create Credit Model Indexes

**Complexity:** Medium  
**Estimated Time:** 20 minutes

### Objective

Create database indexes on frequently queried fields to ensure fast query performance, especially for reporting and filtering.

### Instructions

#### Step 1: Analyze Query Patterns

Common queries that need optimization:
1. Find all credit accounts by status
2. Find overdue accounts (next_payment_due < today)
3. Find accounts by customer
4. Find high-risk accounts (risk_score > threshold)
5. Find accounts with high utilization
6. Order accounts by outstanding balance

#### Step 2: Add Indexes in Meta

Update the `Meta` class with indexes:

**Single Field Indexes:**
- `status` - Very frequently filtered
- `next_payment_due` - Used in overdue queries
- `risk_score` - Used in risk filtering
- `outstanding_balance` - Used in sorting/filtering

**Composite Indexes:**
- `(status, risk_score)` - Combined filtering
- `(status, next_payment_due)` - Active overdue accounts
- `(customer, status)` - Customer-specific queries

#### Step 3: Add Index Names

Follow naming convention:
- `idx_credit_status`
- `idx_credit_payment_due`
- `idx_credit_risk`
- `idx_credit_balance`
- `idx_credit_status_risk`
- `idx_credit_status_due`
- `idx_credit_customer_status`

#### Step 4: Consider Partial Indexes (PostgreSQL)

For advanced optimization:
- Index only ACTIVE accounts
- Index only OVERDUE accounts
- Reduces index size and maintenance

### Index Strategy Diagram

```
┌──────────────────────────────────────────────────────────────┐
│  Index Strategy for CustomerCredit Model                     │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  Primary Key:                                                │
│  • id (UUID) [automatic]                                     │
│                                                              │
│  Foreign Keys:                                               │
│  • customer_id [automatic]                                   │
│  • approved_by_id [automatic]                                │
│  • suspended_by_id [automatic]                               │
│                                                              │
│  Custom Single Indexes:                                      │
│  • status              → Fast status filtering               │
│  • next_payment_due    → Overdue reports                     │
│  • risk_score          → Risk-based queries                  │
│  • outstanding_balance → Balance sorting                     │
│                                                              │
│  Composite Indexes:                                          │
│  • (status, risk_score)      → High-risk active accounts     │
│  • (status, next_payment_due)→ Active overdue accounts       │
│  • (customer, status)        → Customer credit status        │
│                                                              │
│  Query Examples:                                             │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ # Uses idx_credit_status                             │   │
│  │ CustomerCredit.objects.filter(status='active')       │   │
│  │                                                      │   │
│  │ # Uses idx_credit_status_due                         │   │
│  │ CustomerCredit.objects.filter(                       │   │
│  │     status='active',                                 │   │
│  │     next_payment_due__lt=today                       │   │
│  │ )                                                    │   │
│  │                                                      │   │
│  │ # Uses idx_credit_status_risk                        │   │
│  │ CustomerCredit.objects.filter(                       │   │
│  │     status='active',                                 │   │
│  │     risk_score__gte=70                               │   │
│  │ )                                                    │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

### Performance Considerations

**Index Benefits:**
- Faster WHERE clause filtering
- Faster ORDER BY sorting
- Reduced full table scans
- Better join performance

**Index Costs:**
- Slower INSERT/UPDATE (must update indexes)
- Additional storage space
- Maintenance overhead

**Best Practices:**
- Index columns used in WHERE, ORDER BY, JOIN
- Index foreign keys (automatic in Django)
- Avoid over-indexing (diminishing returns)
- Monitor query performance with EXPLAIN

### Validation

- [ ] Single indexes defined for status, next_payment_due, risk_score, outstanding_balance
- [ ] Composite indexes defined for common query patterns
- [ ] Index names follow naming convention
- [ ] Indexes documented with comments
- [ ] No redundant indexes created

---

## Task 11: Run Initial Credit Migrations

**Complexity:** Low  
**Estimated Time:** 15 minutes

### Objective

Generate and apply the initial database migration for the `CustomerCredit` model.

### Instructions

#### Step 1: Verify Model Completeness

Before generating migration, ensure:
- All fields from Tasks 04-09 are present
- All imports are correct
- Model passes `python manage.py check`

#### Step 2: Generate Migration

Run Django's makemigrations command:

```bash
python manage.py makemigrations credit
```

**Expected Output:**
- Migration file created: `apps/credit/migrations/0001_initial.py`
- Should include CustomerCredit model creation
- Should include all indexes

#### Step 3: Review Migration File

Open the generated migration file and verify:
- Model name correct: `CustomerCredit`
- All fields present with correct types
- Indexes created correctly
- Foreign keys set up properly
- No unexpected changes

#### Step 4: Apply Migration

Run migrate command:

```bash
python manage.py migrate credit
```

**Expected Output:**
- Applies 0001_initial migration
- Creates `credit_customer_credit` table
- Creates all indexes

#### Step 5: Verify Database

Check database to confirm:
- Table created with correct name
- All columns present with correct types
- Indexes created
- Foreign key constraints exist

#### Step 6: Test Model Operations

In Django shell, test basic operations:

```python
from apps.credit.models import CustomerCredit
from apps.customers.models import Customer
from apps.credit.constants import CreditStatus

# Create test customer
customer = Customer.objects.first()

# Create credit account
credit = CustomerCredit.objects.create(
    customer=customer,
    credit_limit=100000.00,
    status=CreditStatus.PENDING_APPROVAL
)

# Verify creation
print(credit)
print(f"Available credit: Rs. {credit.available_credit}")
```

### Migration Checklist

```
┌──────────────────────────────────────────────────────────────┐
│  Migration Generation Checklist                              │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  Pre-Migration:                                              │
│  □ All model fields defined                                  │
│  □ All imports present                                       │
│  □ Constants module created                                  │
│  □ No syntax errors                                          │
│  □ `python manage.py check` passes                           │
│                                                              │
│  Generate Migration:                                         │
│  □ Run `makemigrations credit`                               │
│  □ Migration file created                                    │
│  □ Review migration operations                               │
│  □ Verify field types and options                            │
│                                                              │
│  Apply Migration:                                            │
│  □ Run `migrate credit`                                      │
│  □ No errors during migration                                │
│  □ Table created in database                                 │
│  □ Indexes created                                           │
│                                                              │
│  Post-Migration:                                             │
│  □ Test model creation                                       │
│  □ Test queries                                              │
│  □ Verify indexes working                                    │
│  □ Document migration                                        │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

### Troubleshooting

**Common Issues:**

1. **"No changes detected"**
   - Ensure model imported in `models/__init__.py`
   - Check `apps.py` configuration
   - Verify app in `TENANT_APPS`

2. **Import errors during migration**
   - Check all import paths
   - Ensure Customer model accessible
   - Verify constants module

3. **Database errors**
   - Check database connection
   - Verify schema permissions
   - Ensure PostgreSQL running

4. **Index creation fails**
   - Check field names in indexes
   - Verify index syntax
   - Check PostgreSQL version

### Validation

- [ ] Migration file generated successfully
- [ ] Migration file reviewed and correct
- [ ] Migration applied without errors
- [ ] Table exists in database
- [ ] All indexes created
- [ ] Can create CustomerCredit instances
- [ ] Queries work correctly

---

## Validation Checklist

### Model Fields Complete

- [ ] All status fields added (approved_by, approved_at, suspended_by, suspended_at, suspended_reason)
- [ ] All date fields added (last_payment_date, last_purchase_date, next_payment_due, account_opened_date)
- [ ] All risk fields added (risk_score, late_payment_count, default_count, total_payments_made, on_time_payment_percentage, last_assessment_date)
- [ ] Helper properties implemented
- [ ] Risk evaluation methods implemented

### Database Optimization

- [ ] Indexes defined in Meta
- [ ] Index names follow convention
- [ ] Composite indexes for common queries
- [ ] No redundant indexes

### Migration Success

- [ ] Migration generated
- [ ] Migration reviewed
- [ ] Migration applied
- [ ] Table created
- [ ] Indexes created
- [ ] Model operations work

### Sri Lankan Compliance

- [ ] Risk scoring appropriate for local market
- [ ] Date tracking supports local payment patterns
- [ ] Grace periods align with business practices

---

## Performance Considerations

### Query Optimization

**Indexed Queries (Fast):**
```
# Single index on status
CustomerCredit.objects.filter(status='active')

# Composite index on status + next_payment_due
CustomerCredit.objects.filter(
    status='active',
    next_payment_due__lt=today
)

# Composite index on status + risk_score
CustomerCredit.objects.filter(
    status='active',
    risk_score__gte=70
)
```

**Non-Indexed Queries (Slower):**
```
# No index on suspended_reason
CustomerCredit.objects.filter(suspended_reason__icontains='late')

# No index on notes
CustomerCredit.objects.filter(notes__icontains='review')
```

### Monitoring Performance

Use Django Debug Toolbar or logging to monitor:
- Query execution time
- Number of queries per request
- Index usage
- Slow query log

### Scaling Considerations

For large deployments:
- Consider table partitioning by date
- Archive old closed accounts
- Use read replicas for reporting
- Cache frequently accessed data

---

## Next Steps

After completing Tasks 07-11, proceed to:

→ **[Tasks 12-16: Settings & Approval Workflow](./03_Tasks-12-16_Settings-Approval-Workflow.md)**

This will add:
- CreditSettings model for tenant configuration
- Default credit settings
- CreditApprovalWorkflow model
- Approval process implementation
- Additional migrations

---

## References

### Django Documentation
- Database Indexes: https://docs.djangoproject.com/en/stable/ref/models/indexes/
- Migrations: https://docs.djangoproject.com/en/stable/topics/migrations/
- QuerySet Optimization: https://docs.djangoproject.com/en/stable/topics/db/optimization/

### PostgreSQL Documentation
- Index Types: https://www.postgresql.org/docs/current/indexes-types.html
- Query Performance: https://www.postgresql.org/docs/current/performance-tips.html

### Project Resources
- Base Models: `apps/core/models/base.py`
- Customer Model: `apps/customers/models/customer.py`
- User Model: Authentication configuration

---

**Document Version:** 1.0  
**Last Updated:** 2026-01-24  
**Status:** Ready for Implementation
