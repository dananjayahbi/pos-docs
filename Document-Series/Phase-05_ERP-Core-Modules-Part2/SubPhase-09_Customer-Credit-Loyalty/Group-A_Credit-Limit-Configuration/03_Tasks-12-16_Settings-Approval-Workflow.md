# Tasks 12-16: Settings & Approval Workflow

> **Phase:** 05 - ERP Core Modules Part 2  
> **SubPhase:** 09 - Customer Credit & Loyalty  
> **Group:** A - Credit Limit & Configuration  
> **Tasks:** 12-16 of 90  
> **Complexity:** Medium  
> **Estimated Time:** 1 hour 45 minutes

---

## Navigation

- **↑ Parent:** [Group A Overview](./00_GROUP_OVERVIEW.md)
- **← Previous Document:** [Tasks 07-11: Status, Dates, Risk & Migration](./02_Tasks-07-11_Status-Dates-Risk-Migration.md)
- **⮩ Next Group:** [Group B: Credit Transactions & Aging](../Group-B_Credit-Transactions-Aging/)

---

## Table of Contents

1. [Overview](#overview)
2. [Task 12: Create CreditSettings Model](#task-12-create-creditsettings-model)
3. [Task 13: Add Default Credit Settings](#task-13-add-default-credit-settings)
4. [Task 14: Create CreditApprovalWorkflow Model](#task-14-create-creditapprovalworkflow-model)
5. [Task 15: Add Approval Fields](#task-15-add-approval-fields)
6. [Task 16: Run Settings Migrations](#task-16-run-settings-migrations)
7. [Validation Checklist](#validation-checklist)
8. [Approval Workflow Guide](#approval-workflow-guide)

---

## Overview

### Purpose

This document covers the creation of tenant-specific credit settings and the credit approval workflow system. These models allow each tenant to configure their own credit policies and manage credit approval requests.

### Key Deliverables

```
apps/credit/
├── models/
│   ├── __init__.py
│   ├── customer_credit.py         # From previous tasks
│   ├── credit_settings.py         # Task 12-13
│   └── credit_approval.py         # Tasks 14-15
└── migrations/
    ├── 0001_initial.py            # From Task 11
    └── 0002_settings_approval.py  # Task 16
```

### Prerequisites

- Tasks 01-11 completed
- CustomerCredit model fully implemented
- Tenant model available from django-tenants

---

## Task 12: Create CreditSettings Model

**Complexity:** Medium  
**Estimated Time:** 25 minutes

### Objective

Create a `CreditSettings` model to store tenant-specific credit configuration such as default credit limits, payment terms, interest rates, and approval thresholds.

### Instructions

#### Step 1: Create Model File

Create `apps/credit/models/credit_settings.py`.

#### Step 2: Define CreditSettings Model

**Required Relationships:**
- **tenant:** OneToOneField to Tenant
  - `on_delete=models.CASCADE`
  - `related_name='credit_settings'`
  - Each tenant has one settings instance

#### Step 3: Add Default Credit Configuration Fields

Add the following fields:

**Default Credit Limit:**
- **default_credit_limit:** DecimalField
  - `max_digits=12`, `decimal_places=2`
  - Default: `Decimal('50000.00')` (Rs. 50,000)
  - Help text: "Default credit limit for new accounts (LKR)"

**Default Payment Terms:**
- **default_payment_terms_days:** PositiveIntegerField
  - Default: `30`
  - Help text: "Default payment terms in days (Net 30)"

**Default Grace Period:**
- **default_grace_period_days:** PositiveIntegerField
  - Default: `5`
  - Help text: "Default grace period in days"

**Default Interest Rate:**
- **default_interest_rate:** DecimalField
  - `max_digits=5`, `decimal_places=2`
  - Default: `Decimal('18.00')`
  - Help text: "Default annual interest rate (%)"

#### Step 4: Add Approval Threshold Fields

**Minimum Credit Limit:**
- **min_credit_limit:** DecimalField
  - Default: `Decimal('10000.00')` (Rs. 10,000)
  - Help text: "Minimum credit limit allowed (LKR)"

**Maximum Credit Limit:**
- **max_credit_limit:** DecimalField
  - Default: `Decimal('5000000.00')` (Rs. 5,000,000)
  - Help text: "Maximum credit limit allowed (LKR)"

**Auto Approval Threshold:**
- **auto_approval_threshold:** DecimalField
  - Default: `Decimal('100000.00')` (Rs. 100,000)
  - Help text: "Credit limits below this are auto-approved (LKR)"

**Requires Manager Approval:**
- **requires_manager_approval_above:** DecimalField
  - Default: `Decimal('500000.00')` (Rs. 500,000)
  - Help text: "Requires manager approval above this amount (LKR)"

#### Step 5: Add Risk Management Fields

**Auto Suspend After Late Payments:**
- **auto_suspend_after_late_payments:** PositiveIntegerField
  - Default: `3`
  - Help text: "Auto-suspend after X late payments"

**Auto Suspend Risk Score:**
- **auto_suspend_risk_score:** PositiveIntegerField
  - Default: `80`
  - Help text: "Auto-suspend if risk score exceeds this"

**Days Before Overdue:**
- **days_before_overdue_notification:** PositiveIntegerField
  - Default: `3`
  - Help text: "Send notification X days before due date"

#### Step 6: Add Model Meta

```
Meta:
    verbose_name = 'Credit Settings'
    verbose_name_plural = 'Credit Settings'
    db_table = 'credit_settings'
```

#### Step 7: Add Validation Method

Create `clean()` method to validate:
- `min_credit_limit < max_credit_limit`
- `auto_approval_threshold <= requires_manager_approval_above`
- `auto_suspend_after_late_payments > 0`
- All amounts >= 0

#### Step 8: Update Models Init

Export `CreditSettings` in `apps/credit/models/__init__.py`.

### Settings Configuration Diagram

```
┌──────────────────────────────────────────────────────────────┐
│  Credit Settings Hierarchy                                   │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  Tenant                                                      │
│    │                                                         │
│    ├─► CreditSettings (OneToOne)                            │
│    │                                                         │
│    │   Credit Limits:                                        │
│    │   ├─ min_credit_limit: Rs. 10,000                      │
│    │   ├─ max_credit_limit: Rs. 5,000,000                   │
│    │   └─ default_credit_limit: Rs. 50,000                  │
│    │                                                         │
│    │   Payment Terms:                                        │
│    │   ├─ default_payment_terms_days: 30                    │
│    │   ├─ default_grace_period_days: 5                      │
│    │   └─ default_interest_rate: 18%                        │
│    │                                                         │
│    │   Approval Thresholds:                                  │
│    │   ├─ auto_approval_threshold: Rs. 100,000              │
│    │   └─ requires_manager_approval: Rs. 500,000            │
│    │                                                         │
│    │   Risk Management:                                      │
│    │   ├─ auto_suspend_after_late_payments: 3               │
│    │   ├─ auto_suspend_risk_score: 80                       │
│    │   └─ days_before_overdue_notification: 3               │
│    │                                                         │
│    └─► Used by CustomerCredit accounts                      │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

### Validation

- [ ] `credit_settings.py` created
- [ ] OneToOne relationship to Tenant
- [ ] All default configuration fields added
- [ ] All approval threshold fields added
- [ ] All risk management fields added
- [ ] Validation method implemented
- [ ] Model exported in `__init__.py`

---

## Task 13: Add Default Credit Settings

**Complexity:** Medium  
**Estimated Time:** 20 minutes

### Objective

Implement logic to automatically create default `CreditSettings` for new tenants and provide method to get or create settings.

### Instructions

#### Step 1: Create Settings Manager

Create custom manager for `CreditSettings` with `get_or_create_for_tenant()` method.

**Method Logic:**
1. Try to get existing settings for tenant
2. If not found, create with default values
3. Return settings instance

#### Step 2: Add Signal for Tenant Creation

Create Django signal to auto-create settings when tenant is created.

**Signal Handler:**
- Listen for `post_save` on Tenant model
- If `created=True`, create CreditSettings
- Use default values from model

#### Step 3: Create Settings Helper Methods

Add class methods to `CreditSettings`:

**get_for_current_tenant():**
- Get settings for current tenant from context
- Use `connection.tenant` if available
- Return settings instance

**reset_to_defaults():**
- Reset all fields to default values
- Useful for testing or configuration reset

#### Step 4: Create signals.py File

Create `apps/credit/signals.py`:
- Import necessary signal decorators
- Define signal handlers
- Connect signals

#### Step 5: Import Signals in AppConfig

Update `apps/credit/apps.py`:
- Import signals in `ready()` method
- Ensure signals registered on app startup

### Sri Lankan Default Values

```
┌──────────────────────────────────────────────────────────────┐
│  Recommended Defaults for Sri Lankan Market                  │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  Credit Limits:                                              │
│  • Minimum:        Rs. 10,000    (Small retailers)           │
│  • Default:        Rs. 50,000    (Average customers)         │
│  • Maximum:        Rs. 5,000,000 (Large corporates)          │
│                                                              │
│  Payment Terms:                                              │
│  • Standard:       30 days       (Net 30 - most common)      │
│  • Grace Period:   5 days        (Sri Lankan practice)       │
│  • Interest:       18% p.a.      (Market average)            │
│                                                              │
│  Approval Thresholds:                                        │
│  • Auto-Approve:   Rs. 100,000   (Below = automatic)         │
│  • Manager:        Rs. 500,000   (Above = manager approval)  │
│                                                              │
│  Risk Management:                                            │
│  • Late Payments:  3 times       (Before suspension)         │
│  • Risk Score:     80/100        (Suspension threshold)      │
│  • Reminder:       3 days        (Before due date)           │
│                                                              │
│  Adjustments by Business Type:                               │
│  ┌─────────────────┬──────────────┬─────────────────┐        │
│  │ Business        │ Def. Limit   │ Payment Terms   │        │
│  ├─────────────────┼──────────────┼─────────────────┤        │
│  │ Retail Shop     │ Rs. 30,000   │ Net 15          │        │
│  │ Restaurant      │ Rs. 100,000  │ Net 30          │        │
│  │ Wholesaler      │ Rs. 500,000  │ Net 45          │        │
│  │ Corporate       │ Rs. 2,000,000│ Net 60          │        │
│  └─────────────────┴──────────────┴─────────────────┘        │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

### Validation

- [ ] Custom manager created with `get_or_create_for_tenant()`
- [ ] Signal created for tenant creation
- [ ] Helper methods implemented
- [ ] `signals.py` file created
- [ ] Signals imported in `apps.py` ready() method

---

## Task 14: Create CreditApprovalWorkflow Model

**Complexity:** Medium  
**Estimated Time:** 25 minutes

### Objective

Create a model to track credit approval requests when customers apply for credit or request limit increases.

### Instructions

#### Step 1: Create Model File

Create `apps/credit/models/credit_approval.py`.

#### Step 2: Define ApprovalStatus Choices

Create `ApprovalStatus` enum using `TextChoices`:

| Status | Value | Description |
|--------|-------|-------------|
| **PENDING** | `'pending'` | Awaiting review |
| **APPROVED** | `'approved'` | Approved by manager |
| **REJECTED** | `'rejected'` | Rejected |
| **CANCELLED** | `'cancelled'` | Cancelled by requester |

#### Step 3: Define CreditApprovalWorkflow Model

**Required Relationships:**
- **customer:** ForeignKey to Customer
  - `on_delete=models.CASCADE`
  - `related_name='credit_approvals'`

- **credit_account:** ForeignKey to CustomerCredit
  - `on_delete=models.CASCADE`
  - `related_name='approval_requests'`
  - `null=True`, `blank=True` (may not exist yet)

#### Step 4: Add Request Fields

**Requested Credit Limit:**
- **requested_credit_limit:** DecimalField
  - `max_digits=12`, `decimal_places=2`
  - Help text: "Requested credit limit (LKR)"

**Request Type:**
- **request_type:** CharField
  - Choices: NEW_ACCOUNT, LIMIT_INCREASE, LIMIT_DECREASE, REACTIVATION
  - Help text: "Type of credit request"

**Request Reason:**
- **request_reason:** TextField
  - Help text: "Reason for credit request"

**Requested By:**
- **requested_by:** ForeignKey to User
  - `on_delete=models.SET_NULL`
  - `null=True`
  - Help text: "User who submitted the request"

**Requested At:**
- **requested_at:** DateTimeField
  - `auto_now_add=True`

#### Step 5: Add Current Status Fields

**Status:**
- **status:** CharField
  - Use `ApprovalStatus.choices`
  - Default: `ApprovalStatus.PENDING`

**Reviewed By:**
- **reviewed_by:** ForeignKey to User
  - `on_delete=models.SET_NULL`
  - `null=True`, `blank=True`
  - `related_name='reviewed_credit_approvals'`

**Reviewed At:**
- **reviewed_at:** DateTimeField
  - `null=True`, `blank=True`

**Decision Notes:**
- **decision_notes:** TextField
  - `blank=True`
  - Help text: "Manager's notes on approval decision"

#### Step 6: Add Model Meta

```
Meta:
    verbose_name = 'Credit Approval Request'
    verbose_name_plural = 'Credit Approval Requests'
    db_table = 'credit_approval_workflow'
    ordering = ['-requested_at']
    indexes = [
        models.Index(fields=['status', '-requested_at']),
        models.Index(fields=['customer', 'status']),
    ]
```

#### Step 7: Add String Representation

Return customer name, requested amount, and status.

#### Step 8: Update Models Init

Export both `CreditApprovalWorkflow` and `ApprovalStatus`.

### Approval Workflow Diagram

```
┌──────────────────────────────────────────────────────────────┐
│  Credit Approval Workflow States                             │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  [PENDING]                                                   │
│      │                                                       │
│      │ Customer/Staff submits request                        │
│      │ • requested_credit_limit                              │
│      │ • request_reason                                      │
│      │ • requested_by                                        │
│      │                                                       │
│      ├─────────────────────────────┐                         │
│      │                             │                         │
│      ▼                             ▼                         │
│  Manager Reviews             Customer Cancels                │
│      │                             │                         │
│      │ • reviewed_by               ▼                         │
│      │ • reviewed_at          [CANCELLED]                    │
│      │ • decision_notes                                      │
│      │                                                       │
│      ├───────────┬──────────┐                                │
│      │           │          │                                │
│      ▼           ▼          ▼                                │
│  [APPROVED]  [REJECTED]  Check Threshold                     │
│      │                        │                              │
│      │                        ├─ < auto_approval → Auto      │
│      │                        └─ > threshold → Manager       │
│      │                                                       │
│      ├─► Update CustomerCredit:                              │
│           • credit_limit = requested_credit_limit            │
│           • status = ACTIVE                                  │
│           • approved_by = reviewed_by                        │
│           • approved_at = reviewed_at                        │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

### Validation

- [ ] `credit_approval.py` created
- [ ] `ApprovalStatus` choices defined
- [ ] All request fields added
- [ ] All review fields added
- [ ] Indexes defined
- [ ] Model exported in `__init__.py`

---

## Task 15: Add Approval Fields

**Complexity:** Medium  
**Estimated Time:** 20 minutes

### Objective

Add additional fields to track approval workflow details, supporting documents, and automated decisions.

### Instructions

#### Step 1: Add Previous Limit Tracking

**Previous Credit Limit:**
- **previous_credit_limit:** DecimalField
  - `max_digits=12`, `decimal_places=2`
  - `null=True`, `blank=True`
  - Help text: "Previous credit limit (for limit changes)"

**Change Amount:**
- Calculate property: `requested_credit_limit - previous_credit_limit`
- Useful for showing increase/decrease amount

#### Step 2: Add Document Attachments

**Supporting Documents:**
- **supporting_documents:** JSONField
  - Store list of document URLs/paths
  - Example: Bank statements, trade references
  - Default: `list`

#### Step 3: Add Auto-Approval Flag

**Is Auto Approved:**
- **is_auto_approved:** BooleanField
  - Default: `False`
  - Set to `True` if below auto-approval threshold

**Auto Approval Reason:**
- **auto_approval_reason:** CharField
  - `max_length=200`
  - `blank=True`
  - Example: "Below auto-approval threshold"

#### Step 4: Add Priority Field

**Priority:**
- **priority:** CharField
  - Choices: LOW, MEDIUM, HIGH, URGENT
  - Default: MEDIUM
  - Help text: "Request priority"

**Priority Logic:**
- URGENT: Large increases, risky customers
- HIGH: Above manager threshold
- MEDIUM: Standard requests
- LOW: Small increases, existing customers

#### Step 5: Create Helper Methods

**can_auto_approve():**
- Check if request can be auto-approved
- Compare against `CreditSettings.auto_approval_threshold`
- Return boolean

**approve(user, notes):**
- Set status to APPROVED
- Set reviewed_by, reviewed_at, decision_notes
- Update associated CustomerCredit
- Return success boolean

**reject(user, notes):**
- Set status to REJECTED
- Set reviewed_by, reviewed_at, decision_notes
- Return success boolean

**calculate_priority():**
- Auto-calculate priority based on:
  - Requested amount
  - Customer risk score
  - Previous payment history
- Return priority value

#### Step 6: Add Notification Methods

**send_approval_notification():**
- Notify customer of approval
- Include new credit limit
- Include terms and conditions

**send_rejection_notification():**
- Notify customer of rejection
- Include reason
- Suggest improvements

### Request Types Explained

```
┌──────────────────────────────────────────────────────────────┐
│  Credit Request Types                                        │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  NEW_ACCOUNT:                                                │
│  • First-time credit application                             │
│  • No previous credit account                                │
│  • Requires full documentation                               │
│  • Higher scrutiny                                           │
│                                                              │
│  LIMIT_INCREASE:                                             │
│  • Existing customer wants higher limit                      │
│  • Based on payment history                                  │
│  • Most common request type                                  │
│  • Can be auto-approved if history good                      │
│                                                              │
│  LIMIT_DECREASE:                                             │
│  • Customer wants to reduce exposure                         │
│  • Usually auto-approved                                     │
│  • May indicate cash flow issues                             │
│  • Monitor for risk                                          │
│                                                              │
│  REACTIVATION:                                               │
│  • Reactivate suspended account                              │
│  • After late payments resolved                              │
│  • Requires manager approval                                 │
│  • May have reduced limit                                    │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

### Validation

- [ ] Previous limit tracking fields added
- [ ] Supporting documents field added
- [ ] Auto-approval fields added
- [ ] Priority field added
- [ ] Helper methods implemented
- [ ] Notification methods created

---

## Task 16: Run Settings Migrations

**Complexity:** Low  
**Estimated Time:** 15 minutes

### Objective

Generate and apply migrations for `CreditSettings` and `CreditApprovalWorkflow` models.

### Instructions

#### Step 1: Verify All Models Complete

Ensure both new models:
- Have all fields defined
- Have correct relationships
- Pass `python manage.py check`

#### Step 2: Generate Migration

```bash
python manage.py makemigrations credit
```

**Expected:**
- `0002_settings_approval.py` created
- Includes CreditSettings model
- Includes CreditApprovalWorkflow model

#### Step 3: Review Migration

Check migration file for:
- Both models created
- All fields present
- Relationships correct
- Indexes created

#### Step 4: Apply Migration

```bash
python manage.py migrate credit
```

**Expected:**
- Tables created
- Foreign keys created
- Indexes created

#### Step 5: Create Initial Settings for Existing Tenants

Run Django management command or script to create `CreditSettings` for all existing tenants:

```python
from apps.credit.models import CreditSettings
from django_tenants.utils import get_tenant_model

Tenant = get_tenant_model()

for tenant in Tenant.objects.all():
    CreditSettings.objects.get_or_create(tenant=tenant)
```

#### Step 6: Test Approval Workflow

Create test approval request:

```python
from apps.credit.models import CreditApprovalWorkflow, ApprovalStatus
from decimal import Decimal

approval = CreditApprovalWorkflow.objects.create(
    customer=customer,
    requested_credit_limit=Decimal('150000.00'),
    request_type='NEW_ACCOUNT',
    request_reason='Expanding business',
    requested_by=user,
    priority='MEDIUM'
)

# Test auto-approval check
if approval.can_auto_approve():
    approval.approve(manager, "Auto-approved")
```

### Validation

- [ ] Migration generated
- [ ] Migration applied successfully
- [ ] Both tables created
- [ ] Settings created for existing tenants
- [ ] Can create approval requests
- [ ] Workflow methods work correctly

---

## Validation Checklist

### CreditSettings Model

- [ ] OneToOne relationship to Tenant
- [ ] All default configuration fields
- [ ] All approval threshold fields
- [ ] All risk management fields
- [ ] Validation method
- [ ] Manager with get_or_create_for_tenant()
- [ ] Signal for auto-creation

### CreditApprovalWorkflow Model

- [ ] Relationships to Customer and CustomerCredit
- [ ] ApprovalStatus choices
- [ ] All request fields
- [ ] All review fields
- [ ] Previous limit tracking
- [ ] Supporting documents
- [ ] Auto-approval fields
- [ ] Priority field
- [ ] Helper methods
- [ ] Notification methods

### Migrations

- [ ] 0002 migration generated
- [ ] Both models included
- [ ] Migration applied
- [ ] Tables exist
- [ ] Settings created for existing tenants

### Workflow Testing

- [ ] Can create approval request
- [ ] Can approve request
- [ ] Can reject request
- [ ] Auto-approval logic works
- [ ] CustomerCredit updated on approval

---

## Approval Workflow Guide

### Standard Approval Process

```
┌──────────────────────────────────────────────────────────────┐
│  Step-by-Step Approval Process                               │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  1. CUSTOMER APPLIES                                         │
│     • Fills application form                                 │
│     • Provides business details                              │
│     • Uploads supporting documents                           │
│     • Specifies requested limit                              │
│     │                                                        │
│     ▼                                                        │
│  2. SYSTEM VALIDATION                                        │
│     • Check if within min/max limits                         │
│     • Validate required documents                            │
│     • Check existing credit status                           │
│     • Calculate priority                                     │
│     │                                                        │
│     ▼                                                        │
│  3. AUTO-APPROVAL CHECK                                      │
│     • If < auto_approval_threshold                           │
│     • AND customer risk_score < 60                           │
│     • AND no late payments                                   │
│     • → AUTO-APPROVE                                         │
│     │                                                        │
│     ▼                                                        │
│  4. MANUAL REVIEW (if not auto-approved)                     │
│     • Credit officer reviews                                 │
│     • Checks payment history                                 │
│     • Reviews risk score                                     │
│     • Makes recommendation                                   │
│     │                                                        │
│     ▼                                                        │
│  5. MANAGER APPROVAL (if > manager threshold)                │
│     • Manager final approval                                 │
│     • Reviews recommendation                                 │
│     • Approves or rejects                                    │
│     │                                                        │
│     ▼                                                        │
│  6. DECISION & NOTIFICATION                                  │
│     • Customer notified                                      │
│     • Credit account updated if approved                     │
│     • Documents archived                                     │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

### Approval Decision Matrix

| Requested Limit | Risk Score | Payment History | Auto-Approve | Requires Manager |
|-----------------|------------|-----------------|--------------|------------------|
| < Rs. 100K | < 40 (Low) | Good | ✅ Yes | ❌ No |
| < Rs. 100K | 40-70 (Med) | Good | ⚠️ Maybe | ❌ No |
| < Rs. 100K | > 70 (High) | Any | ❌ No | ✅ Yes |
| Rs. 100K-500K | < 40 (Low) | Excellent | ⚠️ Maybe | ❌ No |
| Rs. 100K-500K | Any | Any | ❌ No | ✅ Yes |
| > Rs. 500K | Any | Any | ❌ No | ✅ Yes (Senior) |

### Sri Lankan Business Considerations

**Documents Required:**
- Business registration certificate
- Bank statements (3-6 months)
- Trade references (2-3)
- NIC/passport of owner
- Utility bill (address proof)
- Tax returns (if registered)

**Approval Timeline:**
- Auto-approval: Immediate
- Standard review: 1-2 business days
- Manager approval: 2-3 business days
- New accounts: 3-5 business days

---

## Next Steps

Group A is now complete! Proceed to:

→ **[Group B: Credit Transactions & Aging](../Group-B_Credit-Transactions-Aging/)**

This will implement:
- CreditTransaction model
- Credit purchase and payment recording
- Aging bucket calculations
- Payment reminders and alerts
- Credit suspension logic

---

## References

### Django Documentation
- Signals: https://docs.djangoproject.com/en/stable/topics/signals/
- JSONField: https://docs.djangoproject.com/en/stable/ref/models/fields/#jsonfield
- Custom Managers: https://docs.djangoproject.com/en/stable/topics/db/managers/

### Business References
- Credit Management Best Practices
- Risk Assessment Guidelines
- Sri Lankan Banking Regulations

### Project Resources
- Tenant Model: django-tenants configuration
- User Model: Authentication setup
- Notification System: (if exists)

---

**Document Version:** 1.0  
**Last Updated:** 2026-01-24  
**Status:** Ready for Implementation
