# Group A: Payslip Data Models

> **Phase:** 06 - ERP Advanced Modules  
> **SubPhase:** 07 - Payslip Generation  
> **Group:** A of F  
> **Tasks Covered:** 01-16  
> **Group Goal:** Create payslip Django app and core data models

---

## Navigation

- **↑ Parent:** [SubPhase-07 Summary](../00_TASKS_SUMMARY.md)
- **→ Next Group:** [Group B: PDF Template Design](../Group-B_PDF-Template-Design/)

---

## Group Overview

### Key Outcomes

1. **Create Payslip App** - Initialize Django app
2. **Register Payslip App** - Add to TENANT_APPS
3. **PayslipStatus Choices** - DRAFT, GENERATED, SENT, VIEWED, DOWNLOADED
4. **Payslip Model** - Core model linking to EmployeePayroll
5. **Employee FK** - Link to Employee
6. **Period FK** - Link to PayrollPeriod
7. **Employee Payroll FK** - Link to EmployeePayroll
8. **Payslip Number Field** - Auto-generated unique (PAY-2026-01-001)
9. **Status Field** - PayslipStatus enum
10. **Generation Fields** - generated_at, generated_by
11. **PDF File Field** - FileField for PDF storage
12. **Sent Fields** - email_sent, sent_at, sent_to
13. **View Tracking** - first_viewed_at, view_count
14. **Download Tracking** - download_count, last_downloaded_at
15. **Payslip Migrations** - Apply migrations
16. **Model Constraints** - unique_together (employee, period)

### Technology Context

| Technology | Purpose |
|------------|---------|
| Django ORM | Payslip model |
| FileField | PDF storage |
| Choice Fields | PayslipStatus enum |
| Unique Constraint | One payslip per employee/period |

---

## Documents in This Group

| # | Document | Tasks | Description |
|---|----------|-------|-------------|
| 01 | `01_Tasks-01-08_App-Model-Core.md` | 01-08 | Django app, core model, number field |
| 02 | `02_Tasks-09-16_Status-Tracking-Migrations.md` | 09-16 | Status, tracking fields, migrations |

---

## Task Summary

| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 01 | Create payslip App | Low | 15 min |
| 02 | Register payslip App | Low | 10 min |
| 03 | Define PayslipStatus Choices | Low | 10 min |
| 04 | Create Payslip Model | Medium | 25 min |
| 05 | Add Payslip Employee FK | Low | 15 min |
| 06 | Add Payslip Period FK | Low | 15 min |
| 07 | Add Payslip Employee Payroll FK | Low | 15 min |
| 08 | Add Payslip Number Field | Medium | 20 min |
| 09 | Add Payslip Status Field | Low | 15 min |
| 10 | Add Payslip Generation Fields | Low | 15 min |
| 11 | Add Payslip PDF File Field | Medium | 20 min |
| 12 | Add Payslip Sent Fields | Medium | 20 min |
| 13 | Add Payslip View Tracking | Low | 15 min |
| 14 | Add Payslip Download Tracking | Low | 15 min |
| 15 | Run Payslip Migrations | Low | 15 min |
| 16 | Add Payslip Model Constraints | Low | 15 min |

---

## Execution Order

```
[Tasks 01-08: Django app, core model, number]
         │
         ▼
[Tasks 09-16: Status, tracking, migrations]
```

---

## Expected Deliverables

```
apps/payslip/
├── __init__.py
├── apps.py                       # Tasks 01-02
├── constants.py                  # Task 03
├── models/
│   ├── __init__.py
│   └── payslip.py                # Tasks 04-14, 16
└── migrations/
    └── 0001_payslip.py           # Task 15
```

---

## Notes for AI Agents

### PayslipStatus Choices
| Status | Description |
|--------|-------------|
| DRAFT | Created, PDF not generated |
| GENERATED | PDF generated, not sent |
| SENT | Email sent to employee |
| VIEWED | Employee viewed payslip |
| DOWNLOADED | Employee downloaded PDF |

### Payslip Model Fields
- tenant: FK to Client
- employee: FK to Employee
- payroll_period: FK to PayrollPeriod
- employee_payroll: FK to EmployeePayroll
- slip_number: CharField (unique)
- status: PayslipStatus choice
- generated_at: DateTimeField (nullable)
- generated_by: FK to User (nullable)
- pdf_file: FileField
- email_sent: Boolean
- sent_at: DateTimeField (nullable)
- sent_to: EmailField (nullable)
- first_viewed_at: DateTimeField (nullable)
- view_count: Integer (default 0)
- download_count: Integer (default 0)
- last_downloaded_at: DateTimeField (nullable)
- created_at: DateTimeField
- updated_at: DateTimeField

### Payslip Number Format
```
PAY-{YEAR}-{MONTH}-{SEQUENCE}

Example: PAY-2026-01-001

Generation:
1. Get year and month from period
2. Count existing payslips for that month
3. Increment sequence
4. Format with leading zeros
```

### PDF File Storage
```
Storage path:
payslips/{tenant_id}/{year}/{month}/{slip_number}.pdf

Example:
payslips/t123/2026/01/PAY-2026-01-001.pdf
```

### Unique Constraint
```
unique_together = ['employee', 'payroll_period']

One payslip per employee per period.
If regeneration needed, update existing record.
```

### Status Flow
```
DRAFT → GENERATED → SENT → VIEWED → DOWNLOADED
                 ↘          ↗
                  (direct view without email)
```

### View/Download Tracking
```
On first view:
- Set first_viewed_at
- Increment view_count
- Update status to VIEWED

On download:
- Increment download_count
- Set last_downloaded_at
- Update status to DOWNLOADED
```

### Relationship to Payroll
```
Payslip links to:
├── Employee (for quick access)
├── PayrollPeriod (for filtering)
└── EmployeePayroll (source data)

EmployeePayroll contains:
├── Salary amounts
├── Attendance data
├── EPF/ETF/PAYE
└── Net salary
```
