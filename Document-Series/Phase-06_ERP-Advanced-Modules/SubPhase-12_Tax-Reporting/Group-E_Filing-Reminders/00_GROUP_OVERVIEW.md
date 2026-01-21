# Group E: Filing & Reminders

> **Phase:** 06 - ERP Advanced Modules  
> **SubPhase:** 12 - Tax Reporting  
> **Group:** E of F  
> **Tasks Covered:** 69-80  
> **Group Goal:** Implement tax submission tracking and automated filing deadline reminders

---

## Navigation

- **↑ Parent:** [00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [Group-D_EPF-ETF-Returns](../Group-D_EPF-ETF-Returns/)
- **→ Next Group:** [Group-F_API-Testing-Documentation](../Group-F_API-Testing-Documentation/)

---

## Group Overview

This group implements tax submission tracking and automated filing reminders. Creates TaxSubmission model to store filed submission details including acknowledgment numbers and confirmation documents. Implements FilingReminderService with deadline calculations for each tax type (VAT, PAYE, EPF, ETF) and Celery task for daily deadline checks. Includes email notification delivery and dashboard reminder widget for pending filings.

### Key Outcomes

- TaxSubmission model for filed returns
- Submission reference (acknowledgment number)
- Submission date tracking
- Confirmation document upload
- FilingReminderService class
- VAT due date calculation (20th of following month)
- EPF due date calculation (last day of following month)
- PAYE due date calculation (15th of following month)
- Reminder Celery task (daily check)
- Email reminder delivery method
- Dashboard reminder widget data

### Technology Context

- **Scheduling:** Celery Beat for daily checks
- **Email:** Django email backend
- **Document Storage:** FileField for confirmations
- **Dashboard:** API endpoint for widget data

---

## Documents in This Group

| # | Document | Description | Tasks Covered |
|---|----------|-------------|---------------|
| 01 | `01_Tasks-69-73_TaxSubmission-Model.md` | Create TaxSubmission model with all fields | 69-73 |
| 02 | `02_Tasks-74-80_Filing-Reminder-Service.md` | Create FilingReminderService with deadlines and notifications | 74-80 |

---

## Task Summary

| Task # | Task Name | Complexity | Dependencies |
|--------|-----------|------------|--------------|
| 69 | Create TaxSubmission Model | Medium | Task 68 |
| 70 | Add Submission Reference | Low | Task 69 |
| 71 | Add Submission Date | Low | Task 69 |
| 72 | Add Submission Document | Low | Task 69 |
| 73 | Run TaxSubmission Migrations | Low | Task 72 |
| 74 | Create Filing Reminder Service | High | Task 73 |
| 75 | Add VAT Due Date Calc | Low | Task 74 |
| 76 | Add EPF Due Date Calc | Low | Task 75 |
| 77 | Add PAYE Due Date Calc | Low | Task 76 |
| 78 | Create Reminder Celery Task | Medium | Task 77 |
| 79 | Add Email Reminder Method | Medium | Task 78 |
| 80 | Add Dashboard Reminder Widget | Medium | Task 79 |

---

## Execution Order

```
Task 69: Create TaxSubmission Model
    │
    ├──────────────────────────────────────┐
    ▼                                      ▼
Tasks 70-72: Submission Fields       (parallel)
(Reference, Date, Document)
    │
    ▼
Task 73: Run Migrations
    │
    ▼
Task 74: Create Filing Reminder Service
    │
    ├──────────────────────────────────────┐
    ▼                                      ▼
Task 75: VAT Due Date    Task 76: EPF Due Date    Task 77: PAYE Due Date
    │                         │                         │
    └─────────────────────────┼─────────────────────────┘
                              │
                              ▼
                         Task 78: Reminder Celery Task
                              │
                              ▼
                         Task 79: Email Reminder Method
                              │
                              ▼
                         Task 80: Dashboard Widget
```

---

## Expected Deliverables

```
apps/accounting/
├── tax/
│   ├── __init__.py
│   ├── enums.py
│   ├── generators/
│   │   └── ...
│   └── services/
│       ├── __init__.py
│       └── filing_reminder.py  # FilingReminderService
├── models/
│   └── tax_submission.py       # TaxSubmission model
├── tasks.py                    # Add reminder Celery task
├── views/
│   └── tax.py                  # Add dashboard widget endpoint
└── migrations/
    └── 0023_taxsubmission.py
```

---

## Notes for AI Agents

### Sri Lanka Tax Filing Deadlines

| Tax Type | Due Date | Authority |
|----------|----------|-----------|
| VAT | 20th of following month | Inland Revenue |
| PAYE | 15th of following month | Inland Revenue |
| EPF | Last day of following month | CBSL |
| ETF | Last day of following month | ETF Board |

### TaxSubmission Model Fields
- tax_period: FK to TaxPeriodRecord
- submission_reference: Acknowledgment number
- submitted_at: DateTime of filing
- submitted_by: FK to User
- confirmation_document: FileField
- status: SUBMITTED, ACCEPTED, REJECTED

### Reminder Schedule Logic
```
Daily Check (8 AM):
├── 7 days before due: First reminder
├── 3 days before due: Second reminder
├── 1 day before due: Urgent reminder
└── On due date: Final reminder
```

### Email Reminder Template
```
Subject: Tax Filing Reminder - VAT Return Due in 3 Days

Dear Finance Team,

This is a reminder that the following tax return is due soon:

Tax Type: VAT
Period: January 2026
Due Date: February 20, 2026
Days Remaining: 3

Please ensure the return is filed before the deadline.

[Generate Return] [View Calendar]
```

### Dashboard Widget Data Structure
```json
{
  "pending_filings": [
    {
      "tax_type": "VAT",
      "period": "January 2026",
      "due_date": "2026-02-20",
      "days_remaining": 3,
      "status": "PENDING",
      "urgency": "warning"
    }
  ],
  "upcoming_count": 4,
  "overdue_count": 0
}
```

### Celery Task Configuration
- Schedule: Daily at 8:00 AM
- Task: Check all unfiled tax periods
- Action: Send reminders based on days remaining
- Per-tenant: Check each tenant's pending filings
