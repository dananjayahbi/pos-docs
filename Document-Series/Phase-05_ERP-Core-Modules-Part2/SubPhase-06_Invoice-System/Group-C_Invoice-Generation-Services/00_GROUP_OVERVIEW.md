# Group C: Invoice Generation Services

> **Phase:** 05 - ERP Core Modules Part 2  
> **SubPhase:** 06 - Invoice System  
> **Group:** C of F  
> **Tasks Covered:** 35-50  
> **Group Goal:** Implement invoice generation and lifecycle management services

---

## Navigation

- **↑ Parent:** [SubPhase-06 Summary](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [Group B: Invoice Line Items & Tax Calculation](../Group-B_Invoice-LineItems-Tax-Calculation/)
- **→ Next Group:** [Group D: Credit Notes & Debit Notes](../Group-D_Credit-Notes-Debit-Notes/)

---

## Group Overview

### Key Outcomes

1. **InvoiceService Class** - Main service for invoice operations
2. **Invoice from Order** - Auto-generate invoice from completed order
3. **Copy Order Line Items** - Copy with price snapshot
4. **Manual Invoice Creation** - Create without linked order
5. **Invoice Duplication** - Duplicate existing as new draft
6. **Status Transitions** - issue(), send(), mark_paid(), cancel(), void()
7. **Transition Validation** - Validate allowed status changes
8. **Overdue Check** - Check and mark overdue invoices
9. **Overdue Celery Task** - Daily task for overdue marking
10. **Aging Calculator** - Calculate age and aging buckets
11. **InvoiceHistory Model** - Track all invoice changes
12. **History Logging** - Log actions with user, timestamp
13. **InvoiceSettings Model** - Tenant-level configuration
14. **Default Due Date** - Apply default payment terms
15. **Payment Terms Text** - Generate terms text (Net 30, etc.)
16. **Service Migrations** - Apply migrations

### Technology Context

| Technology | Purpose |
|------------|---------|
| Service Layer | Business logic encapsulation |
| Celery | Async overdue checking |
| Django Signals | History logging |
| Tenant Settings | Multi-tenant configuration |

---

## Documents in This Group

| # | Document | Tasks | Description |
|---|----------|-------|-------------|
| 01 | `01_Tasks-35-40_Service-Generation-Methods.md` | 35-40 | InvoiceService, order-to-invoice, copy line items, manual, duplicate, status transitions |
| 02 | `02_Tasks-41-46_Validation-Overdue-Aging-History.md` | 41-46 | Transition validation, overdue check, Celery task, aging calculator, history model, logging |
| 03 | `03_Tasks-47-50_Settings-Terms-Migration.md` | 47-50 | InvoiceSettings, default due date, payment terms, migrations |

---

## Task Summary

| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 35 | Create InvoiceService Class | High | 30 min |
| 36 | Implement Invoice from Order | Medium | 25 min |
| 37 | Implement Copy Order Line Items | Medium | 25 min |
| 38 | Implement Manual Invoice Creation | Medium | 25 min |
| 39 | Implement Invoice Duplication | Medium | 25 min |
| 40 | Implement Invoice Status Transitions | High | 30 min |
| 41 | Add Status Transition Validation | Medium | 25 min |
| 42 | Implement Invoice Overdue Check | Medium | 25 min |
| 43 | Create Overdue Celery Task | Medium | 25 min |
| 44 | Implement Invoice Aging Calculator | Medium | 25 min |
| 45 | Create InvoiceHistory Model | Medium | 25 min |
| 46 | Implement History Logging | Medium | 25 min |
| 47 | Create InvoiceSettings Model | Medium | 25 min |
| 48 | Implement Default Due Date | Medium | 20 min |
| 49 | Implement Payment Terms Text | Low | 20 min |
| 50 | Run Invoice Service Migrations | Low | 15 min |

---

## Execution Order

```
[Tasks 35-40: InvoiceService with generation and transitions]
         │
         ▼
[Tasks 41-46: Validation, overdue, aging, history]
         │
         ▼
[Tasks 47-50: Settings, terms, migrations]
```

---

## Expected Deliverables

```
apps/invoices/
├── models/
│   ├── __init__.py
│   ├── invoice.py
│   ├── invoice_line_item.py
│   ├── invoice_history.py        # Task 45
│   └── invoice_settings.py       # Task 47
├── services/
│   ├── __init__.py
│   ├── invoice_service.py        # Tasks 35-44
│   └── aging_service.py          # Task 44
├── tasks/
│   ├── __init__.py
│   └── overdue_tasks.py          # Task 43
└── migrations/
    └── 0003_history_settings.py  # Task 50
```

---

## Notes for AI Agents

### InvoiceService Methods
- create_invoice(data, items, user)
- create_from_order(order_id, user)
- create_manual(data, items, user)
- duplicate_invoice(invoice_id, user)
- issue(invoice_id, user)
- send(invoice_id, email, user)
- mark_paid(invoice_id, payment_data, user)
- cancel(invoice_id, reason, user)
- void(invoice_id, reason, user)
- check_overdue()
- calculate_aging(invoice_id)

### Order to Invoice Flow
```
Order COMPLETED
       │
       ▼
Create Invoice (DRAFT)
       │
       ├─ Copy customer details
       ├─ Copy line items with prices
       ├─ Apply order discounts
       └─ Calculate taxes
       │
       ▼
Issue Invoice → Send to Customer
```

### Overdue Celery Task
```python
@shared_task
def check_overdue_invoices():
    """Daily task to mark overdue invoices"""
    today = date.today()
    invoices = Invoice.objects.filter(
        status__in=['ISSUED', 'SENT', 'PARTIAL'],
        due_date__lt=today
    )
    for invoice in invoices:
        invoice.status = InvoiceStatus.OVERDUE
        invoice.save()
        # Send reminder notification
```

### Invoice Aging Buckets
| Bucket | Days | Description |
|--------|------|-------------|
| Current | 0-30 | Not yet overdue |
| 30 Days | 31-60 | 1 month overdue |
| 60 Days | 61-90 | 2 months overdue |
| 90 Days | 91+ | 3+ months overdue |

### InvoiceHistory Event Types
- CREATED, UPDATED, ISSUED
- SENT, PAID, PARTIAL_PAYMENT
- OVERDUE, CANCELLED, VOIDED
- CREDIT_NOTE_APPLIED, DEBIT_NOTE_APPLIED
- REMINDER_SENT, PAYMENT_RECEIVED

### InvoiceSettings Fields
- tenant: OneToOne to Tenant
- invoice_number_prefix: CharField (default: "INV")
- default_due_days: IntegerField (default: 30)
- default_vat_rate: DecimalField (default: 12.00)
- show_svat_number: BooleanField
- default_terms: TextField
- auto_send_on_issue: BooleanField
- reminder_days: ArrayField [7, 14, 30]

### Payment Terms Options
| Term | Days | Description |
|------|------|-------------|
| Immediate | 0 | Due on receipt |
| Net 7 | 7 | Due in 7 days |
| Net 15 | 15 | Due in 15 days |
| Net 30 | 30 | Due in 30 days (default) |
| Net 45 | 45 | Due in 45 days |
| Net 60 | 60 | Due in 60 days |
