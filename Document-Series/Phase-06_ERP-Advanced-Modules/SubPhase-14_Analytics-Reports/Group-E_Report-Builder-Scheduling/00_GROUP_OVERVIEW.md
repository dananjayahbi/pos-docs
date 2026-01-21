# Group E: Report Builder & Scheduling

> **Phase:** 06 - ERP Advanced Modules  
> **SubPhase:** 14 - Analytics & Reports  
> **Group:** E of F  
> **Tasks Covered:** 71-84  
> **Group Goal:** Implement saved report templates and scheduled report generation with email distribution

---

## Navigation

- **↑ Parent:** [00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [Group-D_Customer-Staff-Reports](../Group-D_Customer-Staff-Reports/)
- **→ Next Group:** [Group-F_API-Testing-Documentation](../Group-F_API-Testing-Documentation/)

---

## Group Overview

This group implements the report builder (saved report configurations) and scheduled report generation system. Creates SavedReport model for storing user-defined report configurations with filters and format preferences. Creates ScheduledReport model for automated report generation on daily, weekly, or monthly schedules with email distribution. Implements Celery task for processing scheduled reports, email delivery with attachments, and schedule execution history tracking.

### Key Outcomes

- SavedReport model for user configurations
- Report name and description fields
- Report type and filters JSON config
- Owner (user) foreign key
- ScheduledReport model for automation
- Schedule frequency (DAILY, WEEKLY, MONTHLY)
- Email recipients list
- Next run time calculation
- Report scheduler Celery task
- Generate scheduled report method
- Email distribution with attachments
- Schedule history tracking

### Technology Context

- **Scheduling:** Celery Beat for periodic execution
- **Email:** Django email with attachments
- **File Storage:** Generated reports stored for history
- **Frequency:** Configurable daily/weekly/monthly

---

## Documents in This Group

| # | Document | Description | Tasks Covered |
|---|----------|-------------|---------------|
| 01 | `01_Tasks-71-75_SavedReport-Model.md` | Create SavedReport model for user configurations | 71-75 |
| 02 | `02_Tasks-76-84_ScheduledReport-Celery.md` | Create ScheduledReport model, Celery task, and email delivery | 76-84 |

---

## Task Summary

| Task # | Task Name | Complexity | Dependencies |
|--------|-----------|------------|--------------|
| 71 | Create SavedReport Model | Medium | Task 70 |
| 72 | Add Saved Report Name | Low | Task 71 |
| 73 | Add Saved Report Config | Medium | Task 71 |
| 74 | Add Saved Report Owner | Low | Task 71 |
| 75 | Run SavedReport Migrations | Low | Task 74 |
| 76 | Create ScheduledReport Model | Medium | Task 75 |
| 77 | Add Schedule Frequency | Low | Task 76 |
| 78 | Add Schedule Recipients | Low | Task 76 |
| 79 | Add Schedule Next Run | Medium | Task 76 |
| 80 | Run ScheduledReport Migrations | Low | Task 79 |
| 81 | Create Report Scheduler Celery Task | High | Task 80 |
| 82 | Add Generate Scheduled Method | Medium | Task 81 |
| 83 | Add Email Distribution | Medium | Task 82 |
| 84 | Add Schedule History Tracking | Medium | Task 83 |

---

## Execution Order

```
Task 71: Create SavedReport Model
    │
    ├─────────────────────────────────────────┐
    ▼                                         ▼
Tasks 72-73: Name & Config          Task 74: Owner FK
    │                                         │
    └─────────────────────┬───────────────────┘
                          ▼
                     Task 75: Run SavedReport Migrations
                          │
                          ▼
                     Task 76: Create ScheduledReport Model
                          │
                          ├─────────────────────────────┐
                          ▼                             ▼
                     Task 77: Frequency         Tasks 78-79
                                               (recipients, next_run)
                          │                             │
                          └─────────────────────────────┘
                                        │
                                        ▼
                                   Task 80: Run Migrations
                                        │
                                        ▼
                                   Task 81: Create Celery Task
                                        │
                                        ▼
                                   Task 82: Generate Method
                                        │
                                        ▼
                                   Task 83: Email Distribution
                                        │
                                        ▼
                                   Task 84: History Tracking
```

---

## Expected Deliverables

```
apps/analytics/
├── models/
│   ├── __init__.py
│   ├── report_definition.py
│   ├── report_instance.py
│   ├── saved_report.py         # SavedReport model
│   └── scheduled_report.py     # ScheduledReport model
├── services/
│   ├── __init__.py
│   └── scheduler.py            # Report scheduling service
├── tasks.py                    # Celery tasks
└── migrations/
    ├── 0001_initial.py
    └── 0002_savedreport_scheduledreport.py
```

---

## Notes for AI Agents

### SavedReport Model Fields
- name: Report name
- description: Optional description
- report_definition: FK to ReportDefinition
- filters_config: JSONField with filter values
- output_format: Preferred format (PDF, Excel, etc.)
- owner: FK to User
- is_public: Boolean for sharing
- created_at, updated_at: DateTime

### SavedReport Config Structure
```json
{
  "name": "Monthly Sales by Product",
  "description": "Top selling products for current month",
  "report_definition": "SALES_BY_PRODUCT",
  "filters_config": {
    "date_range": "current_month",
    "category": ["groceries", "beverages"],
    "limit": 20
  },
  "output_format": "PDF"
}
```

### ScheduledReport Model Fields
- saved_report: FK to SavedReport
- frequency: Enum (DAILY, WEEKLY, MONTHLY)
- day_of_week: For WEEKLY (0=Monday)
- day_of_month: For MONTHLY (1-28)
- time_of_day: Time to run
- recipients: JSONField (email list)
- is_active: Boolean
- next_run: DateTime
- last_run: DateTime
- last_status: SUCCESS, FAILED

### Frequency Options
| Frequency | Schedule | Example |
|-----------|----------|---------|
| DAILY | Every day at time | 08:00 AM daily |
| WEEKLY | Specific day of week | Monday 08:00 AM |
| MONTHLY | Specific day of month | 1st of month 08:00 AM |

### Celery Task Logic
```
1. Query ScheduledReport where next_run <= now() and is_active=True
2. For each scheduled report:
   a. Generate report using SavedReport config
   b. Save to ReportInstance
   c. Email to recipients with attachment
   d. Update last_run, calculate next_run
   e. Log to history
```

### Email Template Structure
```
Subject: [LCC] Your Scheduled Report: Monthly Sales by Product

Dear User,

Your scheduled report has been generated and is attached to this email.

Report: Monthly Sales by Product
Period: January 2026
Generated: 2026-02-01 08:00:00
Format: PDF

Please find the report attached.

Best regards,
LankaCommerce Cloud
```

### Schedule History Model
```
ScheduleHistory:
├── scheduled_report: FK
├── run_at: DateTime
├── status: SUCCESS, FAILED
├── report_instance: FK (if successful)
├── error_message: Text (if failed)
└── recipients_count: Integer
```
