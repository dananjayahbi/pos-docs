# Group C: Quote Services & Business Logic

> **Phase:** 05 - ERP Core Modules Part 2  
> **SubPhase:** 04 - Quote Management  
> **Group:** C of F  
> **Tasks Covered:** 37-52  
> **Group Goal:** Implement quote business operations and lifecycle management

---

## Navigation

- **↑ Parent:** [SubPhase-04 Summary](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [Group B: Quote Line Items & Calculations](../Group-B_Quote-Line-Items-Calculations/)
- **→ Next Group:** [Group D: Quote PDF Generation](../Group-D_Quote-PDF-Generation/)

---

## Group Overview

### Key Outcomes

1. **QuoteService Class** - Main service for quote operations
2. **Quote Creation** - Create new quote with initial line items
3. **Quote Duplication** - Duplicate existing quote as new draft
4. **Status Transitions** - send(), accept(), reject(), expire() methods
5. **Transition Validation** - Validate allowed status changes
6. **Quote Expiry Check** - Check and mark expired quotes
7. **Expiry Celery Task** - Periodic expiry checking task
8. **Order Conversion** - Convert accepted quote to sales order
9. **Inventory Validation** - Check stock before conversion
10. **Quote Revision** - Create new version linked to original
11. **Quote Locking** - Lock editing for sent/accepted quotes
12. **QuoteHistory Model** - Track all changes and transitions
13. **History Logging** - Log actions with user, timestamp, values
14. **QuoteSettings Model** - Tenant-level configuration
15. **Default Validity Period** - Apply default validity from settings
16. **Service Migrations** - Migrations for History and Settings

### Technology Context

| Technology | Purpose |
|------------|---------|
| Service Layer | Business logic encapsulation |
| Celery | Async expiry checking |
| Django Signals | History logging |
| State Machine | Status transitions |

---

## Documents in This Group

| # | Document | Tasks | Description |
|---|----------|-------|-------------|
| 01 | `01_Tasks-37-43_Service-Status-Expiry.md` | 37-43 | QuoteService, create, duplicate, transitions, validation, expiry |
| 02 | `02_Tasks-44-49_Conversion-Revision-History.md` | 44-49 | Order conversion, inventory check, revision, locking, history model/logging |
| 03 | `03_Tasks-50-52_Settings-Validity-Migration.md` | 50-52 | QuoteSettings model, default validity, migrations |

---

## Task Summary

| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 37 | Create QuoteService Class | Medium | 25 min |
| 38 | Implement Quote Creation | Medium | 25 min |
| 39 | Implement Quote Duplication | Medium | 25 min |
| 40 | Implement Quote Status Transitions | High | 30 min |
| 41 | Add Status Transition Validation | Medium | 25 min |
| 42 | Implement Quote Expiry Check | Medium | 25 min |
| 43 | Create Expiry Celery Task | Medium | 25 min |
| 44 | Implement Quote to Order Conversion | High | 35 min |
| 45 | Add Inventory Validation on Conversion | Medium | 25 min |
| 46 | Implement Quote Revision | Medium | 25 min |
| 47 | Add Quote Locking Logic | Medium | 20 min |
| 48 | Create Quote History Model | Medium | 25 min |
| 49 | Implement History Logging | Medium | 25 min |
| 50 | Create Quote Settings Model | Medium | 25 min |
| 51 | Implement Default Validity Period | Medium | 20 min |
| 52 | Run Service Layer Migrations | Low | 15 min |

---

## Execution Order

```
[Tasks 37-41: QuoteService with status transitions]
         │
         ▼
[Tasks 42-43: Expiry checking and Celery task]
         │
         ▼
[Tasks 44-47: Conversion, revision, locking]
         │
         ▼
[Tasks 48-49: History model and logging]
         │
         ▼
[Tasks 50-52: Settings and migrations]
```

---

## Expected Deliverables

```
apps/quotes/
├── models/
│   ├── __init__.py
│   ├── quote.py
│   ├── line_item.py
│   ├── history.py                # Task 48
│   └── settings.py               # Task 50
├── services/
│   ├── __init__.py
│   ├── calculation.py
│   └── quote_service.py          # Tasks 37-47, 49
├── tasks/
│   ├── __init__.py
│   └── expiry.py                 # Task 43
└── migrations/
    └── 0003_history_settings.py  # Task 52
```

---

## Notes for AI Agents

### QuoteService Methods
- create_quote(data, items, user)
- duplicate_quote(quote_id, user)
- send_quote(quote_id, user)
- accept_quote(quote_id, user)
- reject_quote(quote_id, user, reason)
- expire_quote(quote_id)
- convert_to_order(quote_id, user)
- create_revision(quote_id, user)

### Status Transition Rules
```python
ALLOWED_TRANSITIONS = {
    'DRAFT': ['SENT'],
    'SENT': ['ACCEPTED', 'REJECTED', 'EXPIRED'],
    'ACCEPTED': ['CONVERTED'],
    'REJECTED': [],  # Terminal
    'EXPIRED': [],   # Terminal
    'CONVERTED': [], # Terminal
}
```

### Quote to Order Conversion
1. Validate quote status is ACCEPTED
2. Check inventory for all line items
3. Create Order with line items
4. Update quote status to CONVERTED
5. Link quote.converted_to_order = order
6. Log history event

### Quote History Event Types
- CREATED: Quote created
- UPDATED: Quote modified
- SENT: Sent to customer
- ACCEPTED: Customer accepted
- REJECTED: Customer rejected
- EXPIRED: Quote expired
- CONVERTED: Converted to order
- REVISION: New revision created

### QuoteHistory Fields
- quote: FK to Quote
- event_type: Choice field
- user: FK to User
- timestamp: DateTimeField
- old_values: JSONField
- new_values: JSONField
- notes: TextField

### QuoteSettings Fields
- tenant: OneToOne to Tenant
- default_validity_days: Integer (default 30)
- quote_number_prefix: CharField (default "QT")
- auto_expire_enabled: BooleanField
- require_approval: BooleanField

### Celery Expiry Task
- Run daily at midnight
- Query quotes where status=SENT and valid_until < today
- Update status to EXPIRED
- Log history event for each
