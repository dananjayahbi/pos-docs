# Group D: Templates & Recurring

> **Phase:** 06 - ERP Advanced Modules  
> **SubPhase:** 09 - Journal Entries  
> **Group:** D of F  
> **Tasks Covered:** 49-64  
> **Group Goal:** Create journal entry templates for reusable entries and implement scheduled recurring entry functionality

---

## Navigation

- **↑ Parent:** [00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [Group-C_Auto-Generated-Entries](../Group-C_Auto-Generated-Entries/)
- **→ Next Group:** [Group-E_Approval-Posting](../Group-E_Approval-Posting/)

---

## Group Overview

This group implements template and recurring entry functionality for streamlined accounting workflows. JournalEntryTemplate model stores reusable entry patterns with line item definitions in JSON format, enabling quick creation of common entries like monthly rent or depreciation. RecurringEntry model schedules automatic entry generation at defined intervals (daily, weekly, monthly) with Celery Beat processing.

### Key Outcomes

- JournalEntryTemplate model for reusable entry patterns
- Template name, description, and category fields
- JSON field storing template line item definitions
- TemplateService for template operations
- Create entry from template method
- Save existing entry as template method
- RecurringEntry model for scheduled entries
- Frequency options (daily, weekly, monthly, yearly)
- Schedule tracking (next_run, last_run, end_date)
- Active/inactive flag for recurring entries
- Celery Beat task for processing recurring entries

### Technology Context

- **Storage:** JSONField for template line definitions
- **Scheduling:** Celery Beat for periodic task execution
- **Templates:** Copy-on-create pattern for entry generation
- **Categories:** Organized template library by use case

---

## Documents in This Group

| # | Document | Description | Tasks Covered |
|---|----------|-------------|---------------|
| 01 | `01_Tasks-49-57_Template-Model-Service.md` | Create JournalEntryTemplate model and TemplateService | 49-57 |
| 02 | `02_Tasks-58-64_Recurring-Entry-Celery.md` | Implement RecurringEntry model and Celery processing task | 58-64 |

---

## Task Summary

| Task # | Task Name | Complexity | Dependencies |
|--------|-----------|------------|--------------|
| 49 | Create JournalEntryTemplate Model | Medium | Task 48 |
| 50 | Add Template Name Field | Low | Task 49 |
| 51 | Add Template Description | Low | Task 49 |
| 52 | Add Template Lines JSON | Medium | Task 49 |
| 53 | Add Template Category | Low | Task 49 |
| 54 | Run Template Migrations | Low | Task 53 |
| 55 | Create Template Service | Medium | Task 54 |
| 56 | Add Create From Template | Medium | Task 55 |
| 57 | Add Save As Template | Medium | Task 56 |
| 58 | Create RecurringEntry Model | Medium | Task 57 |
| 59 | Add Recurring Template FK | Low | Task 58 |
| 60 | Add Recurring Frequency | Low | Task 58 |
| 61 | Add Recurring Schedule Fields | Low | Task 58 |
| 62 | Add Recurring Active Flag | Low | Task 58 |
| 63 | Run Recurring Migrations | Low | Task 62 |
| 64 | Create Recurring Entry Celery Task | High | Task 63 |

---

## Execution Order

```
Task 49: Create Template Model
    │
    ├─────────────────────────────────────┐
    ▼                                     ▼
Tasks 50-52: Template Fields       Task 53: Category
(name, description, lines JSON)
    │                                     │
    └─────────────┬───────────────────────┘
                  ▼
             Task 54: Run Migrations
                  │
                  ▼
             Task 55: Create Template Service
                  │
                  ▼
             Task 56: Create From Template
                  │
                  ▼
             Task 57: Save As Template
                  │
                  ▼
             Task 58: Create RecurringEntry Model
                  │
                  ├─────────────────────────────┐
                  ▼                             ▼
             Tasks 59-61: Recurring Fields  Task 62: Active Flag
             (template FK, frequency, schedule)
                  │                             │
                  └─────────────┬───────────────┘
                                ▼
                           Task 63: Run Migrations
                                │
                                ▼
                           Task 64: Celery Task
```

---

## Expected Deliverables

```
apps/accounting/
├── models/
│   ├── __init__.py
│   ├── journal_template.py    # JournalEntryTemplate model
│   └── recurring_entry.py     # RecurringEntry model
├── services/
│   ├── __init__.py
│   ├── template_service.py    # Template operations
│   └── recurring_service.py   # Recurring entry processing
├── tasks.py                   # Celery tasks (add recurring task)
└── migrations/
    ├── 0007_journalentrytemplate.py
    └── 0008_recurringentry.py
```

---

## Notes for AI Agents

### Template Line JSON Structure
```json
{
  "lines": [
    {
      "account_code": "5300",
      "description": "Monthly Rent",
      "debit": "{{amount}}",
      "credit": null
    },
    {
      "account_code": "1110",
      "description": "Bank Payment",
      "debit": null,
      "credit": "{{amount}}"
    }
  ]
}
```

### Template Categories
- GENERAL: General purpose templates
- MONTH_END: Month-end closing entries
- PAYROLL: Payroll-related templates
- DEPRECIATION: Asset depreciation entries
- ACCRUALS: Accrual entries
- CUSTOM: User-defined category

### Common Template Examples

**Monthly Rent Template:**
```
DR Rent Expense         [Amount]
    CR Bank                     [Amount]
```

**Depreciation Template:**
```
DR Depreciation Expense [Amount]
    CR Accumulated Depreciation [Amount]
```

**Prepaid Expense Amortization:**
```
DR Expense             [Amount]
    CR Prepaid Expense         [Amount]
```

### Recurring Frequency Options
- DAILY: Every day
- WEEKLY: Same day each week
- MONTHLY: Same day each month
- QUARTERLY: Every 3 months
- YEARLY: Once per year

### Celery Beat Schedule
```python
CELERY_BEAT_SCHEDULE = {
    'process-recurring-entries': {
        'task': 'accounting.tasks.process_recurring_entries',
        'schedule': crontab(hour=0, minute=30),  # Run daily at 00:30
    },
}
```

### Recurring Entry Processing Logic
1. Query RecurringEntry where is_active=True AND next_run <= today
2. For each recurring entry:
   - Create JournalEntry from linked template
   - Set entry_date = next_run
   - Update last_run = today
   - Calculate next_run based on frequency
   - If next_run > end_date, set is_active=False
3. Optionally auto-post if configured
