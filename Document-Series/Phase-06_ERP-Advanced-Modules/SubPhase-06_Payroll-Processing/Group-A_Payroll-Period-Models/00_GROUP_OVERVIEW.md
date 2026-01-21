# Group A: Payroll Period Models

> **Phase:** 06 - ERP Advanced Modules  
> **SubPhase:** 06 - Payroll Processing  
> **Group:** A of F  
> **Tasks Covered:** 01-16  
> **Group Goal:** Create payroll period and settings models

---

## Navigation

- **↑ Parent:** [SubPhase-06 Summary](../00_TASKS_SUMMARY.md)
- **→ Next Group:** [Group B: PayrollRun & EmployeePayroll](../Group-B_PayrollRun-EmployeePayroll/)

---

## Group Overview

### Key Outcomes

1. **Extend Payroll App** - Add processing to existing payroll app
2. **PayrollStatus Choices** - DRAFT, PROCESSING, PROCESSED, APPROVED, FINALIZED, REVERSED
3. **PayrollPeriod Model** - Monthly payroll period
4. **Period Date Fields** - start_date, end_date, pay_date
5. **Period Name Field** - Human-readable name (e.g., "January 2026")
6. **Period Status Field** - Status using PayrollStatus
7. **Period Lock Fields** - is_locked, locked_at, locked_by
8. **Period Working Days** - total_working_days for calculations
9. **PayrollPeriod Migrations** - Apply migrations
10. **PayrollSettings Model** - Tenant-level settings
11. **Settings Pay Day** - default_pay_day (e.g., 25th)
12. **Settings Cutoff** - attendance_cutoff_day
13. **Settings Approval** - require_approval boolean
14. **Settings Auto Create** - auto_create_period boolean
15. **PayrollSettings Migrations** - Apply migrations
16. **Period Auto-Generation Task** - Celery task for monthly creation

### Technology Context

| Technology | Purpose |
|------------|---------|
| Django ORM | Period, settings models |
| Choice Fields | PayrollStatus enum |
| Celery | Auto period generation |
| Tenant Settings | Per-tenant configuration |

---

## Documents in This Group

| # | Document | Tasks | Description |
|---|----------|-------|-------------|
| 01 | `01_Tasks-01-09_PayrollPeriod-Model.md` | 01-09 | App extension, status choices, period model |
| 02 | `02_Tasks-10-16_Settings-AutoGeneration.md` | 10-16 | PayrollSettings, Celery task |

---

## Task Summary

| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 01 | Extend payroll App | Low | 15 min |
| 02 | Define PayrollStatus Choices | Low | 15 min |
| 03 | Create PayrollPeriod Model | Medium | 25 min |
| 04 | Add Period Date Fields | Low | 15 min |
| 05 | Add Period Name Field | Low | 10 min |
| 06 | Add Period Status Field | Low | 15 min |
| 07 | Add Period Lock Fields | Medium | 20 min |
| 08 | Add Period Working Days | Low | 15 min |
| 09 | Run PayrollPeriod Migrations | Low | 15 min |
| 10 | Create PayrollSettings Model | Medium | 25 min |
| 11 | Add Settings Pay Day | Low | 10 min |
| 12 | Add Settings Cutoff | Low | 10 min |
| 13 | Add Settings Approval | Low | 10 min |
| 14 | Add Settings Auto Create | Low | 10 min |
| 15 | Run PayrollSettings Migrations | Low | 15 min |
| 16 | Create Period Auto-Generation Task | High | 30 min |

---

## Execution Order

```
[Tasks 01-09: PayrollStatus, PayrollPeriod model]
         │
         ▼
[Tasks 10-16: PayrollSettings, Celery task]
```

---

## Expected Deliverables

```
apps/payroll/
├── constants.py                  # Task 02 (extend)
├── models/
│   ├── payroll_period.py         # Tasks 03-08
│   └── payroll_settings.py       # Tasks 10-14
├── tasks/
│   ├── __init__.py
│   └── period_tasks.py           # Task 16
└── migrations/
    ├── 0012_payroll_period.py    # Task 09
    └── 0013_payroll_settings.py  # Task 15
```

---

## Notes for AI Agents

### PayrollStatus Choices
| Status | Description |
|--------|-------------|
| DRAFT | Period created, not processed |
| PROCESSING | Celery task running |
| PROCESSED | Processing complete, review |
| APPROVED | Manager approved |
| FINALIZED | Locked, ready for payment |
| REVERSED | Reversed with correction |

### PayrollPeriod Model Fields
- tenant: FK to Client
- name: CharField (e.g., "January 2026")
- period_month: Integer (1-12)
- period_year: Integer (e.g., 2026)
- start_date: DateField (month start)
- end_date: DateField (month end)
- pay_date: DateField (salary payment date)
- status: PayrollStatus choice
- total_working_days: Integer
- is_locked: Boolean
- locked_at: DateTimeField (nullable)
- locked_by: FK to User (nullable)
- notes: TextField
- created_at: DateTimeField
- updated_at: DateTimeField

### Unique Constraint
```
(tenant, period_month, period_year) unique
```

### PayrollSettings Model Fields
- tenant: OneToOne to Client
- default_pay_day: Integer (1-28, e.g., 25)
- attendance_cutoff_day: Integer (e.g., 20)
- require_approval: Boolean
- auto_create_period: Boolean
- approvers: M2M to User (nullable)
- notification_email: EmailField (nullable)
- effective_from: DateField

### Pay Day Logic
```
If pay_day = 25:
- January period: Pay date = 25th January
- If 25th is weekend, move to previous Friday
```

### Attendance Cutoff
```
Cutoff day = 20
- January payroll processes attendance from:
  21st December to 20th January
```

### Auto Period Generation Task
```
Celery beat schedule:
- Run on 1st of each month
- Check auto_create_period = True
- Create next month's period
- Set working_days based on calendar
```

### Working Days Calculation
```
January 2026:
- Total days: 31
- Weekend days: 8 (Sat/Sun)
- Public holidays: 2
- Working days: 31 - 8 - 2 = 21
```

### Period Status Flow
```
DRAFT → PROCESSING → PROCESSED → APPROVED → FINALIZED
                  ↓
              REVERSED (if error)
```

### Lock Behavior
```
When is_locked = True:
- Cannot modify period
- Cannot reprocess payroll
- Cannot change pay_date
- Only admin can unlock (with reason)
```
