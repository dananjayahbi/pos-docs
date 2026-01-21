# Group A: Credit Limit & Configuration

> **Phase:** 05 - ERP Core Modules Part 2  
> **SubPhase:** 09 - Customer Credit & Loyalty  
> **Group:** A of F  
> **Tasks Covered:** 01-16  
> **Group Goal:** Create credit Django app with customer credit models and settings

---

## Navigation

- **↑ Parent:** [SubPhase-09 Summary](../00_TASKS_SUMMARY.md)
- **→ Next Group:** [Group B: Credit Transactions & Aging](../Group-B_Credit-Transactions-Aging/)

---

## Group Overview

### Key Outcomes

1. **Credit Django App** - New Django app for credit & loyalty
2. **App Registration** - Register credit in TENANT_APPS
3. **CreditStatus Choices** - ACTIVE, SUSPENDED, CLOSED, PENDING_APPROVAL
4. **CustomerCredit Model** - Customer credit account linked to customer
5. **Credit Limit Fields** - credit_limit, available_credit, outstanding_balance
6. **Credit Terms Fields** - payment_terms_days, grace_period_days
7. **Credit Status Fields** - status, approved_by, approved_at, suspended_reason
8. **Credit Date Fields** - last_payment_date, last_purchase_date, next_payment_due
9. **Credit Risk Fields** - risk_score, late_payment_count, default_count
10. **Credit Model Indexes** - Indexes for status, customer, balance
11. **Initial Credit Migrations** - Generate and apply migrations
12. **CreditSettings Model** - Tenant settings for limits, terms, interest
13. **Default Credit Settings** - Default limit, terms, approval threshold
14. **CreditApprovalWorkflow Model** - Credit approval requests
15. **Approval Fields** - requested_limit, requested_by, approved_by, decision
16. **Settings Migrations** - Migrations for CreditSettings, Workflow

### Technology Context

| Technology | Purpose |
|------------|---------|
| Django ORM | Credit models definition |
| PostgreSQL | Indexes for performance |
| Decimal | Precision for amounts |
| Workflow | Approval process |

---

## Documents in This Group

| # | Document | Tasks | Description |
|---|----------|-------|-------------|
| 01 | `01_Tasks-01-06_App-Setup-Model-Core.md` | 01-06 | Django app, registration, status choices, model, limit/terms fields |
| 02 | `02_Tasks-07-11_Status-Dates-Risk-Migration.md` | 07-11 | Status, date, risk fields, indexes, migrations |
| 03 | `03_Tasks-12-16_Settings-Approval-Workflow.md` | 12-16 | CreditSettings, defaults, approval workflow, migrations |

---

## Task Summary

| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 01 | Create credit Django App | Low | 15 min |
| 02 | Register credit App | Low | 10 min |
| 03 | Define CreditStatus Choices | Low | 15 min |
| 04 | Create CustomerCredit Model | Medium | 25 min |
| 05 | Add Credit Limit Fields | Medium | 20 min |
| 06 | Add Credit Terms Fields | Medium | 20 min |
| 07 | Add Credit Status Fields | Medium | 20 min |
| 08 | Add Credit Date Fields | Medium | 20 min |
| 09 | Add Credit Risk Fields | Medium | 20 min |
| 10 | Create Credit Model Indexes | Medium | 20 min |
| 11 | Run Initial Credit Migrations | Low | 15 min |
| 12 | Create CreditSettings Model | Medium | 25 min |
| 13 | Add Default Credit Settings | Medium | 20 min |
| 14 | Create CreditApprovalWorkflow Model | Medium | 25 min |
| 15 | Add Approval Fields | Medium | 20 min |
| 16 | Run Settings Migrations | Low | 15 min |

---

## Execution Order

```
[Tasks 01-06: Django app setup, credit model core]
         │
         ▼
[Tasks 07-11: Status, dates, risk, indexes, migrations]
         │
         ▼
[Tasks 12-16: Settings, approval workflow, migrations]
```

---

## Expected Deliverables

```
apps/credit/
├── __init__.py
├── apps.py                       # Tasks 01-02
├── models/
│   ├── __init__.py
│   ├── customer_credit.py        # Tasks 04-10
│   ├── credit_settings.py        # Tasks 12-13
│   └── credit_approval.py        # Tasks 14-15
├── constants.py                  # Task 03
└── migrations/
    ├── 0001_initial.py           # Task 11
    └── 0002_settings_approval.py # Task 16
```

---

## Notes for AI Agents

### CreditStatus Choices
- **ACTIVE**: Credit account is active and can be used
- **SUSPENDED**: Credit suspended due to late payments
- **CLOSED**: Credit account closed
- **PENDING_APPROVAL**: Awaiting approval

### CustomerCredit Fields
- customer: OneToOne to Customer
- credit_limit: Decimal (maximum credit allowed)
- available_credit: Decimal (remaining credit)
- outstanding_balance: Decimal (current owed amount)
- payment_terms_days: Integer (Net 30, Net 60, etc.)
- grace_period_days: Integer (grace days before penalties)

### Credit Terms Options
| Term | Description |
|------|-------------|
| Net 7 | Payment due in 7 days |
| Net 15 | Payment due in 15 days |
| Net 30 | Payment due in 30 days |
| Net 45 | Payment due in 45 days |
| Net 60 | Payment due in 60 days |

### Credit Risk Fields
- risk_score: Integer (0-100, higher = riskier)
- late_payment_count: Number of late payments
- default_count: Number of defaults
- last_assessment_date: Last risk assessment

### CreditSettings Fields
- tenant: OneToOne to Tenant
- default_credit_limit: Decimal
- default_payment_terms: Integer (days)
- approval_threshold: Decimal (limit requiring approval)
- interest_rate: Decimal (monthly interest %)
- max_credit_limit: Decimal
- auto_suspend_after_days: Integer

### CreditApprovalWorkflow Fields
- customer: FK to Customer
- requested_limit: Decimal
- current_limit: Decimal
- requested_by: FK to User
- approved_by: FK to User (nullable)
- decision: APPROVED, REJECTED, PENDING
- decision_date: DateTime
- notes: TextField

### Database Indexes
- customer (unique)
- status
- outstanding_balance
- next_payment_due
- (status, outstanding_balance) composite
