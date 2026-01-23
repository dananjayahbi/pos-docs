# Tasks 41-46: Validation, Overdue, Aging & History

> **Phase:** 05 - ERP Core Modules Part 2  
> **SubPhase:** 06 - Invoice System  
> **Group:** C - Invoice Generation Services  
> **Document:** 02 of 03  
> **Tasks Covered:** 41, 42, 43, 44, 45, 46

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [01_Tasks-35-40_Service-Generation-Methods.md](01_Tasks-35-40_Service-Generation-Methods.md)
- **→ Next Document:** [03_Tasks-47-50_Settings-Terms-Migration.md](03_Tasks-47-50_Settings-Terms-Migration.md)

---

## Document Overview

This document covers status transition validation, overdue checking, invoice aging calculations, and invoice history tracking.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 41 | Add Status Transition Validation | Medium | 25 min |
| 42 | Implement Invoice Overdue Check | Medium | 25 min |
| 43 | Create Overdue Celery Task | Medium | 25 min |
| 44 | Implement Invoice Aging Calculator | Medium | 25 min |
| 45 | Create InvoiceHistory Model | Medium | 25 min |
| 46 | Implement History Logging | Medium | 25 min |

---

## Task 41: Add Status Transition Validation

### Overview
Implement comprehensive validation logic to ensure invoice status transitions follow business rules and prevent invalid state changes.

### Dependencies
- Task 40: Implement Invoice Status Transitions

### Instructions

1. **Define transition matrix**
   - Create `INVOICE_TRANSITIONS` constant in `apps/invoices/constants.py`
   - Map each status to list of allowed target statuses
   - Document business rules for each transition

2. **Create validation method**
   - Add `_can_transition(invoice, to_status)` method to InvoiceService
   - Accept invoice instance and target status
   - Return tuple (is_valid: bool, error_message: str)

3. **Check current status**
   - Get invoice.status
   - Look up allowed transitions from INVOICE_TRANSITIONS
   - Check if to_status is in allowed list

4. **Add business rule checks**
   - For ISSUED: Check invoice_date is set
   - For SENT: Check invoice is ISSUED first
   - For PAID: Check payment amount equals total
   - For VOID: Check no payments received
   - For CANCELLED: Check invoice not sent

5. **Check financial constraints**
   - Cannot change status if invoice has credit/debit notes applied
   - Cannot void if partial payments received
   - Cannot delete if any status except DRAFT

6. **Check permission-based rules**
   - Admin can override some restrictions
   - Regular users follow strict rules
   - Manager can cancel issued invoices

7. **Create custom exceptions**
   - Define `InvalidTransitionError` exception
   - Include current status, target status, reason in message

8. **Update all transition methods**
   - Call `_can_transition()` at start of each method
   - Raise exception if validation fails
   - Provide clear error message to user

9. **Add transition reasons**
   - For certain transitions, require reason (cancel, void)
   - Validate reason is provided
   - Store reason in appropriate field

### Transition Matrix

```python
INVOICE_TRANSITIONS = {
    InvoiceStatus.DRAFT: [
        InvoiceStatus.ISSUED,
        InvoiceStatus.CANCELLED,
    ],
    InvoiceStatus.ISSUED: [
        InvoiceStatus.SENT,
        InvoiceStatus.PAID,
        InvoiceStatus.PARTIAL,
        InvoiceStatus.CANCELLED,
        InvoiceStatus.VOID,
    ],
    InvoiceStatus.SENT: [
        InvoiceStatus.PAID,
        InvoiceStatus.PARTIAL,
        InvoiceStatus.OVERDUE,
        InvoiceStatus.VOID,
    ],
    InvoiceStatus.PARTIAL: [
        InvoiceStatus.PAID,
        InvoiceStatus.OVERDUE,
    ],
    InvoiceStatus.OVERDUE: [
        InvoiceStatus.PAID,
        InvoiceStatus.PARTIAL,
        InvoiceStatus.VOID,
    ],
    InvoiceStatus.PAID: [],      # Final status
    InvoiceStatus.CANCELLED: [], # Final status
    InvoiceStatus.VOID: [],      # Final status
}
```

### Validation Rules

| Transition | Additional Rules |
|-----------|------------------|
| DRAFT → ISSUED | Must have line items, customer, due date |
| ISSUED → SENT | Must have customer email |
| * → PAID | Payment amount must equal balance |
| * → CANCELLED | Must provide cancellation reason |
| * → VOID | Must provide void reason |
| * → OVERDUE | Automatic only (via Celery task) |

### Validation Flow Diagram

```
┌─────────────────────┐
│ Transition Request  │
│ (current → target)  │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│ Check Transition    │
│ Matrix              │
│ - Is allowed?       │
└──────────┬──────────┘
           │
           ├─ No ──→ Raise InvalidTransitionError
           │
           ▼ Yes
┌─────────────────────┐
│ Check Business      │
│ Rules               │
│ - Dates set?        │
│ - Amounts valid?    │
└──────────┬──────────┘
           │
           ├─ No ──→ Raise ValidationError
           │
           ▼ Yes
┌─────────────────────┐
│ Check Financial     │
│ Constraints         │
│ - Credit notes?     │
│ - Payments?         │
└──────────┬──────────┘
           │
           ├─ No ──→ Raise ValidationError
           │
           ▼ Yes
┌─────────────────────┐
│ Proceed with        │
│ Transition          │
└─────────────────────┘
```

### Expected Outcome
- Comprehensive validation in place
- Clear error messages
- Business rules enforced
- Invalid transitions prevented

### Verification Checklist
- [ ] Transition matrix defined
- [ ] `_can_transition()` method implemented
- [ ] All business rules checked
- [ ] Custom exceptions created
- [ ] All transition methods updated
- [ ] Error messages clear

---

## Task 42: Implement Invoice Overdue Check

### Overview
Implement logic to check and mark invoices as overdue when their due date has passed and they remain unpaid.

### Dependencies
- Task 40: Implement Invoice Status Transitions

### Instructions

1. **Create check_overdue method**
   - Add `check_overdue(invoice_id=None)` method to InvoiceService
   - If invoice_id provided, check specific invoice
   - If None, check all invoices

2. **Define overdue criteria**
   - Invoice must be in ISSUED, SENT, or PARTIAL status
   - due_date must be less than today
   - balance_due must be greater than 0

3. **Query overdue invoices**
   - If checking all: query with filters
   - Use Q objects for complex conditions
   - Exclude PAID, CANCELLED, VOID, OVERDUE statuses
   - Filter due_date__lt=today

4. **Mark as overdue**
   - For each invoice, change status to OVERDUE
   - Set overdue_since date to due_date
   - Calculate days_overdue = today - due_date

5. **Send notifications**
   - Trigger overdue notification email
   - Log overdue event to InvoiceHistory
   - Create notification for account manager

6. **Calculate late fees**
   - If late fee policy exists in InvoiceSettings
   - Calculate late_fee_amount based on days overdue
   - Add late fee to invoice balance
   - Log late fee application

7. **Return summary**
   - Return count of invoices marked overdue
   - Return list of invoice numbers affected
   - Return total overdue amount

### Overdue Criteria

```python
overdue_criteria = Q(
    status__in=[
        InvoiceStatus.ISSUED,
        InvoiceStatus.SENT,
        InvoiceStatus.PARTIAL
    ],
    due_date__lt=date.today(),
    balance_due__gt=0
)
```

### Overdue Check Flow

```
┌─────────────────────┐
│ Daily Trigger       │
│ (Celery Task)       │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│ Query Invoices      │
│ - ISSUED/SENT       │
│ - due_date < today  │
│ - balance > 0       │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│ For Each Invoice    │
│                     │
│ ├─ Mark OVERDUE     │
│ ├─ Log history      │
│ ├─ Send email       │
│ └─ Calculate fees   │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│ Return Summary      │
│ - Count             │
│ - Total amount      │
└─────────────────────┘
```

### Late Fee Calculation

```python
def calculate_late_fee(invoice, days_overdue):
    settings = InvoiceSettings.objects.get(tenant=invoice.tenant)
    
    if not settings.apply_late_fees:
        return 0
    
    if settings.late_fee_type == 'PERCENTAGE':
        # e.g., 2% per month
        months = days_overdue / 30
        return invoice.balance_due * (settings.late_fee_rate / 100) * months
    
    elif settings.late_fee_type == 'FIXED':
        # e.g., LKR 500 per day after 30 days
        if days_overdue > settings.late_fee_grace_days:
            return settings.late_fee_amount * (days_overdue - settings.late_fee_grace_days)
    
    return 0
```

### Expected Outcome
- Method to check and mark overdue invoices
- Automatic overdue detection
- Notifications sent
- Late fees calculated (if applicable)

### Verification Checklist
- [ ] `check_overdue()` method implemented
- [ ] Overdue criteria defined correctly
- [ ] Query filters correct
- [ ] Status updated to OVERDUE
- [ ] History logged
- [ ] Notifications triggered
- [ ] Late fees calculated

---

## Task 43: Create Overdue Celery Task

### Overview
Create a Celery periodic task that runs daily to automatically check and mark overdue invoices.

### Dependencies
- Task 42: Implement Invoice Overdue Check
- SubPhase 03, Task 20: Celery Task Queue Setup

### Instructions

1. **Create Celery task file**
   - Create `apps/invoices/tasks/overdue_tasks.py`
   - Import shared_task decorator from Celery
   - Import InvoiceService

2. **Define check_overdue_invoices task**
   - Create function `check_overdue_invoices()`
   - Decorate with `@shared_task`
   - Set name to 'invoices.check_overdue'

3. **Add task logic**
   - Call `InvoiceService.check_overdue()` (all invoices)
   - Log task execution (start, end, results)
   - Handle any exceptions gracefully

4. **Configure retry logic**
   - Set max_retries=3
   - Set retry backoff (5 min, 15 min, 1 hour)
   - Log retry attempts

5. **Add tenant iteration**
   - Query all active tenants
   - For each tenant, set schema context
   - Check overdue invoices for that tenant
   - Collect results per tenant

6. **Send summary report**
   - After processing all tenants
   - Send summary email to system admins
   - Include count of overdue invoices
   - Include total overdue amount

7. **Configure periodic schedule**
   - Add to Celery Beat schedule in settings
   - Set to run daily at 8:00 AM (Asia/Colombo)
   - Or use crontab schedule

8. **Add monitoring**
   - Log task duration
   - Track success/failure rate
   - Alert on repeated failures

### Celery Task Implementation

```python
from celery import shared_task
from django_tenants.utils import schema_context
from apps.tenants.models import Tenant
from apps.invoices.services import InvoiceService
import logging

logger = logging.getLogger(__name__)

@shared_task(
    name='invoices.check_overdue',
    bind=True,
    max_retries=3
)
def check_overdue_invoices(self):
    """
    Daily task to check and mark overdue invoices across all tenants
    """
    try:
        results = []
        tenants = Tenant.objects.filter(is_active=True)
        
        for tenant in tenants:
            with schema_context(tenant.schema_name):
                try:
                    service = InvoiceService(tenant=tenant)
                    summary = service.check_overdue()
                    
                    results.append({
                        'tenant': tenant.name,
                        'overdue_count': summary['count'],
                        'overdue_amount': summary['total_amount']
                    })
                    
                except Exception as e:
                    logger.error(f"Error checking overdue for {tenant.name}: {e}")
        
        # Log summary
        total_overdue = sum(r['overdue_count'] for r in results)
        logger.info(f"Overdue check complete: {total_overdue} invoices marked")
        
        return results
        
    except Exception as exc:
        logger.error(f"Overdue task failed: {exc}")
        raise self.retry(exc=exc, countdown=300)  # Retry in 5 minutes
```

### Celery Beat Schedule

```python
# In settings/base.py or celeryconfig.py

CELERY_BEAT_SCHEDULE = {
    'check-overdue-invoices-daily': {
        'task': 'invoices.check_overdue',
        'schedule': crontab(hour=8, minute=0),  # 8:00 AM daily
        'options': {'expires': 3600}  # Task expires if not executed within 1 hour
    },
    'send-invoice-reminders': {
        'task': 'invoices.send_reminders',
        'schedule': crontab(hour=9, minute=0, day_of_week='1,3,5'),  # Mon, Wed, Fri
    }
}
```

### Task Monitoring Dashboard

| Metric | Track |
|--------|-------|
| Execution time | Average duration per run |
| Success rate | % of successful runs |
| Invoices processed | Count per run |
| Overdue marked | Count per run |
| Errors | Count and types |

### Expected Outcome
- Celery task created and scheduled
- Runs daily automatically
- Processes all tenants
- Logs execution details
- Sends summary reports

### Verification Checklist
- [ ] Celery task file created
- [ ] Task decorated correctly
- [ ] Tenant iteration implemented
- [ ] Retry logic configured
- [ ] Beat schedule added
- [ ] Logging implemented
- [ ] Monitoring in place

---

## Task 44: Implement Invoice Aging Calculator

### Overview
Implement service methods to calculate invoice aging (how long invoices have been outstanding) and categorize into aging buckets.

### Dependencies
- Task 35: Create InvoiceService Class

### Instructions

1. **Create AgingService file**
   - Create `apps/invoices/services/aging_service.py`
   - Or add methods to InvoiceService

2. **Define aging buckets**
   - Create `AGING_BUCKETS` constant
   - Define ranges: Current (0-30), 30 Days (31-60), 60 Days (61-90), 90+ Days

3. **Create calculate_aging method**
   - Add `calculate_aging(invoice_id)` method
   - Accept invoice UUID
   - Return aging data dict

4. **Calculate days outstanding**
   - Get invoice.issue_date or invoice_date
   - Calculate days = today - issue_date
   - For paid invoices, use payment_date as end date

5. **Determine aging bucket**
   - If days 0-30: bucket = 'current'
   - If days 31-60: bucket = '30_days'
   - If days 61-90: bucket = '60_days'
   - If days 91+: bucket = '90_plus'

6. **Calculate aging metrics**
   - days_outstanding: int
   - aging_bucket: str
   - is_overdue: bool
   - days_overdue: int (if overdue)

7. **Create aging report method**
   - Add `generate_aging_report(tenant, filters=None)` method
   - Accept optional filters (customer, date range)
   - Return comprehensive aging report

8. **Query unpaid/partial invoices**
   - Filter status in [ISSUED, SENT, PARTIAL, OVERDUE]
   - Exclude PAID, CANCELLED, VOID

9. **Group by aging bucket**
   - Group invoices by their aging bucket
   - Calculate total per bucket
   - Calculate count per bucket

10. **Generate summary**
    - Total outstanding amount
    - Count of invoices per bucket
    - Amount per bucket
    - Aging percentage distribution

11. **Add customer breakdown**
    - Group by customer
    - Show aging per customer
    - Identify customers with oldest invoices

12. **Return report data**
    - Return structured dict/dataclass
    - Include summary and details
    - Ready for serialization to JSON

### Aging Buckets Definition

| Bucket | Days Range | Risk Level |
|--------|-----------|------------|
| Current | 0-30 | Low |
| 30 Days | 31-60 | Medium |
| 60 Days | 61-90 | High |
| 90+ Days | 91+ | Critical |

### Aging Calculation Flow

```
┌─────────────────────┐
│ Invoice             │
│ Issue Date: Jan 1   │
│ Today: Jan 23       │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│ Calculate Days      │
│ days = 23           │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│ Determine Bucket    │
│ 0-30 → Current      │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│ Return Aging Data   │
│ {                   │
│   days: 23,         │
│   bucket: 'current',│
│   is_overdue: false │
│ }                   │
└─────────────────────┘
```

### Aging Report Structure

```python
{
    'summary': {
        'total_outstanding': 1500000,  # LKR
        'total_invoices': 45,
        'current': 800000,
        '30_days': 400000,
        '60_days': 200000,
        '90_plus': 100000
    },
    'buckets': [
        {
            'name': 'current',
            'label': '0-30 Days',
            'amount': 800000,
            'count': 20,
            'percentage': 53.3
        },
        {
            'name': '30_days',
            'label': '31-60 Days',
            'amount': 400000,
            'count': 15,
            'percentage': 26.7
        },
        # ... more buckets
    ],
    'by_customer': [
        {
            'customer_id': 'uuid',
            'customer_name': 'ABC Company',
            'total': 250000,
            'current': 150000,
            '30_days': 100000,
            '60_days': 0,
            '90_plus': 0,
            'oldest_invoice_days': 45
        },
        # ... more customers
    ]
}
```

### Expected Outcome
- Aging calculation service
- Individual invoice aging
- Comprehensive aging reports
- Customer-wise breakdown

### Verification Checklist
- [ ] AgingService created
- [ ] Aging buckets defined
- [ ] `calculate_aging()` method implemented
- [ ] `generate_aging_report()` method implemented
- [ ] Days calculation correct
- [ ] Bucket categorization works
- [ ] Report structure complete
- [ ] Customer breakdown included

---

## Task 45: Create InvoiceHistory Model

### Overview
Create the InvoiceHistory model to track all changes and actions performed on invoices for audit trail purposes.

### Dependencies
- Task 07: Invoice Model (Group A)

### Instructions

1. **Create InvoiceHistory model file**
   - Create `apps/invoices/models/invoice_history.py`
   - Import necessary base classes and mixins

2. **Define InvoiceHistory model**
   - Inherit from TenantAwareModel
   - Add UUIDField as primary key
   - Include tenant FK

3. **Add invoice relationship**
   - Add FK to Invoice model
   - Set related_name='history'
   - Set on_delete=CASCADE

4. **Add event type field**
   - Add event_type ChoiceField
   - Use InvoiceHistoryEvent choices (define in constants)
   - Required field

5. **Define event types**
   - Create InvoiceHistoryEvent choices in constants:
     - CREATED, UPDATED, ISSUED, SENT
     - PAID, PARTIAL_PAYMENT
     - OVERDUE, CANCELLED, VOIDED
     - CREDIT_NOTE_APPLIED, DEBIT_NOTE_APPLIED
     - REMINDER_SENT, PAYMENT_RECEIVED

6. **Add user tracking**
   - Add FK to User model (performed_by)
   - Can be null (for system actions)
   - Set related_name='invoice_actions'

7. **Add timestamp**
   - Add created_at DateTimeField (auto_now_add)
   - This tracks when event occurred

8. **Add old/new status**
   - Add old_status CharField (optional)
   - Add new_status CharField (optional)
   - For status changes

9. **Add changes JSON field**
   - Add changes JSONField
   - Store detailed changes dict
   - Include field-level changes

10. **Add notes field**
    - Add notes TextField (optional)
    - For additional context
    - User can add comments

11. **Add metadata field**
    - Add metadata JSONField (optional)
    - Store action-specific data
    - E.g., email sent to, payment reference

12. **Add model methods**
    - `__str__()`: Return event description
    - `get_description()`: Human-readable description

13. **Add ordering**
    - Order by `-created_at` (newest first)
    - Add to Meta class

14. **Add indexes**
    - Index on invoice FK
    - Index on event_type
    - Index on created_at

### InvoiceHistory Model Structure

```python
class InvoiceHistory(TenantAwareModel):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4)
    tenant = models.ForeignKey(Tenant, on_delete=models.CASCADE)
    invoice = models.ForeignKey(
        Invoice,
        on_delete=models.CASCADE,
        related_name='history'
    )
    event_type = models.CharField(
        max_length=50,
        choices=InvoiceHistoryEvent.choices
    )
    performed_by = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        related_name='invoice_actions'
    )
    created_at = models.DateTimeField(auto_now_add=True)
    old_status = models.CharField(max_length=20, null=True, blank=True)
    new_status = models.CharField(max_length=20, null=True, blank=True)
    changes = models.JSONField(default=dict, blank=True)
    notes = models.TextField(blank=True)
    metadata = models.JSONField(default=dict, blank=True)
    
    class Meta:
        db_table = 'invoice_history'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['invoice']),
            models.Index(fields=['event_type']),
            models.Index(fields=['created_at']),
        ]
```

### History Event Types

| Event Type | Description | Metadata |
|-----------|-------------|----------|
| CREATED | Invoice created | creator, source |
| UPDATED | Invoice updated | changed_fields |
| ISSUED | Invoice issued | issued_by |
| SENT | Invoice sent | email, sent_by |
| PAID | Invoice paid in full | payment_method, amount |
| PARTIAL_PAYMENT | Partial payment | payment_method, amount |
| OVERDUE | Marked overdue | days_overdue |
| CANCELLED | Invoice cancelled | reason, cancelled_by |
| VOIDED | Invoice voided | reason, voided_by |
| CREDIT_NOTE_APPLIED | Credit note applied | credit_note_id, amount |
| DEBIT_NOTE_APPLIED | Debit note applied | debit_note_id, amount |
| REMINDER_SENT | Reminder sent | email, reminder_type |
| PAYMENT_RECEIVED | Payment received | payment_reference |

### Changes Field Example

```python
changes = {
    'field_changes': {
        'status': {'old': 'ISSUED', 'new': 'SENT'},
        'sent_to_email': {'old': None, 'new': 'customer@example.com'},
        'sent_at': {'old': None, 'new': '2026-01-23T10:30:00Z'}
    },
    'line_items_changed': False
}
```

### Expected Outcome
- InvoiceHistory model created
- All fields defined
- Event types documented
- Ready for migration

### Verification Checklist
- [ ] InvoiceHistory model created
- [ ] All fields added
- [ ] Event type choices defined
- [ ] Relationships configured
- [ ] Indexes added
- [ ] Meta options set
- [ ] Model methods added

---

## Task 46: Implement History Logging

### Overview
Implement automatic history logging for all invoice actions and changes using Django signals or explicit service calls.

### Dependencies
- Task 45: Create InvoiceHistory Model

### Instructions

1. **Create history utility module**
   - Create `apps/invoices/utils/history.py`
   - Or add to InvoiceService

2. **Create log_history function**
   - Define `log_invoice_history(invoice, event_type, user, **kwargs)`
   - Accept invoice, event type, user, and metadata
   - Create InvoiceHistory record

3. **Capture old/new status**
   - For status changes, capture old and new status
   - Pass as parameters or detect from invoice

4. **Capture field changes**
   - Use Django model _state or signals
   - Compare old vs new values
   - Store in changes JSON field

5. **Add metadata**
   - Accept **kwargs for event-specific metadata
   - Store in metadata field
   - Examples: email address, payment reference, reason

6. **Add notes parameter**
   - Accept optional notes parameter
   - Store user comments
   - Visible in audit trail

7. **Update all service methods**
   - Add history logging to issue()
   - Add history logging to send()
   - Add history logging to mark_paid()
   - Add history logging to cancel()
   - Add history logging to void()

8. **Log on create**
   - In create_invoice(), log CREATED event
   - Include creation method (manual, from order)

9. **Log on update**
   - Optionally log UPDATED event for significant changes
   - Track which fields changed

10. **Add Django signals (optional)**
    - Create post_save signal for Invoice model
    - Auto-log certain changes
    - Use with care to avoid double-logging

11. **Create history query methods**
    - `get_invoice_history(invoice_id)`: Get all history
    - `get_recent_history(invoice_id, limit=10)`: Recent events
    - `get_history_by_type(invoice_id, event_type)`: Filter by type

12. **Add history to serializer**
    - Include history in InvoiceSerializer (Task 81)
    - Nest InvoiceHistorySerializer
    - Show recent history

### History Logging Implementation

```python
def log_invoice_history(
    invoice,
    event_type,
    user=None,
    old_status=None,
    new_status=None,
    changes=None,
    notes='',
    **metadata
):
    """
    Log an invoice history event
    
    Args:
        invoice: Invoice instance
        event_type: InvoiceHistoryEvent choice
        user: User who performed the action (optional)
        old_status: Previous status (optional)
        new_status: New status (optional)
        changes: Dict of field changes (optional)
        notes: Additional notes (optional)
        **metadata: Event-specific metadata
    """
    from apps.invoices.models import InvoiceHistory
    
    history = InvoiceHistory.objects.create(
        tenant=invoice.tenant,
        invoice=invoice,
        event_type=event_type,
        performed_by=user,
        old_status=old_status,
        new_status=new_status,
        changes=changes or {},
        notes=notes,
        metadata=metadata
    )
    
    return history
```

### Integration with Service Methods

```python
# In InvoiceService.issue()
def issue(self, invoice_id, user):
    invoice = Invoice.objects.get(id=invoice_id)
    
    # Validate and perform action
    old_status = invoice.status
    invoice.status = InvoiceStatus.ISSUED
    invoice.issued_at = timezone.now()
    invoice.issued_by = user
    invoice.save()
    
    # Log history
    log_invoice_history(
        invoice=invoice,
        event_type=InvoiceHistoryEvent.ISSUED,
        user=user,
        old_status=old_status,
        new_status=InvoiceStatus.ISSUED,
        notes='Invoice issued and ready to send'
    )
    
    return invoice
```

### History Timeline View

```
Invoice INV-2026-00001 History:

2026-01-23 14:30  [SENT]              John Doe
  ├─ Status: ISSUED → SENT
  ├─ Email: customer@example.com
  └─ Notes: Sent via automated process

2026-01-23 10:15  [ISSUED]            Jane Admin
  ├─ Status: DRAFT → ISSUED
  └─ Notes: Approved and issued

2026-01-22 16:45  [UPDATED]           John Doe
  ├─ Changed: due_date (2026-02-21 → 2026-02-28)
  └─ Notes: Extended payment terms

2026-01-22 15:30  [CREATED]           System
  ├─ Source: Order #ORD-123
  └─ Notes: Auto-generated from completed order
```

### Expected Outcome
- History logging function created
- All service methods log actions
- Complete audit trail
- Queryable history

### Verification Checklist
- [ ] `log_invoice_history()` function created
- [ ] All service methods log history
- [ ] Status changes captured
- [ ] Field changes tracked
- [ ] Metadata stored correctly
- [ ] History queryable
- [ ] Timeline view possible

---

## Summary

This document covered validation, overdue checking, aging calculations, and history tracking for invoices.

**Key Deliverables:**
- Status transition validation
- Overdue checking logic
- Celery task for daily overdue processing
- Aging calculator and reports
- InvoiceHistory model
- Automatic history logging

**Next Steps:**
- Proceed to [03_Tasks-47-50_Settings-Terms-Migration.md](03_Tasks-47-50_Settings-Terms-Migration.md)
