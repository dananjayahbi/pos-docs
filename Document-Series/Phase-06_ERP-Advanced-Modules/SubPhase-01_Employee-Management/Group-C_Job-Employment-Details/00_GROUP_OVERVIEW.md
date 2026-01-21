# Group C: Job & Employment Details

> **Phase:** 06 - ERP Advanced Modules  
> **SubPhase:** 01 - Employee Management  
> **Group:** C of F  
> **Tasks Covered:** 35-50  
> **Group Goal:** Add job-related fields and employment history tracking

---

## Navigation

- **↑ Parent:** [SubPhase-01 Summary](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [Group B: Personal & Contact Details](../Group-B_Personal-Contact-Details/)
- **→ Next Group:** [Group D: Documents & Bank Details](../Group-D_Documents-Bank-Details/)

---

## Group Overview

### Key Outcomes

1. **Department FK** - Link to Department (SubPhase-02)
2. **Designation FK** - Link to Designation (SubPhase-02)
3. **Manager FK** - Self-referential FK to Employee
4. **Employment Type Field** - FULL_TIME, PART_TIME, etc.
5. **Hire Date Field** - hire_date, probation_end_date
6. **Confirmation Date** - Post-probation confirmation
7. **Work Location Fields** - work_location, work_from_home_eligible
8. **Termination Fields** - termination_date, reason, exit_interview
9. **Resignation Fields** - resignation_date, reason, notice_period
10. **Job Fields Migrations** - Apply migrations
11. **EmploymentHistory Model** - Track job changes
12. **History Core Fields** - effective_date, department, designation
13. **History Change Reason** - PROMOTION, TRANSFER, DEMOTION
14. **History Salary Change** - previous_salary, new_salary
15. **EmploymentHistory Migrations** - Apply migrations
16. **Employment History Signal** - Auto-create history on changes

### Technology Context

| Technology | Purpose |
|------------|---------|
| Django ORM | Job fields, EmploymentHistory model |
| Self-referential FK | Manager hierarchy |
| Signals | Auto-history tracking |
| ForeignKey | Department, Designation links |

---

## Documents in This Group

| # | Document | Tasks | Description |
|---|----------|-------|-------------|
| 01 | `01_Tasks-35-44_Job-Fields.md` | 35-44 | Department, designation, manager, dates, termination |
| 02 | `02_Tasks-45-50_Employment-History.md` | 45-50 | EmploymentHistory model, signal for auto-tracking |

---

## Task Summary

| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 35 | Add Department FK | Medium | 15 min |
| 36 | Add Designation FK | Medium | 15 min |
| 37 | Add Manager FK | Medium | 20 min |
| 38 | Add Employment Type Field | Low | 15 min |
| 39 | Add Hire Date Field | Medium | 20 min |
| 40 | Add Confirmation Date | Low | 15 min |
| 41 | Add Work Location Fields | Medium | 20 min |
| 42 | Add Termination Fields | Medium | 20 min |
| 43 | Add Resignation Fields | Medium | 20 min |
| 44 | Run Job Fields Migrations | Low | 15 min |
| 45 | Create EmploymentHistory Model | Medium | 25 min |
| 46 | Add History Core Fields | Medium | 20 min |
| 47 | Add History Change Reason | Low | 15 min |
| 48 | Add History Salary Change | Medium | 20 min |
| 49 | Run EmploymentHistory Migrations | Low | 15 min |
| 50 | Create Employment History Signal | High | 30 min |

---

## Execution Order

```
[Tasks 35-44: Job-related fields]
         │
         ▼
[Tasks 45-50: Employment history model and signal]
```

---

## Expected Deliverables

```
apps/employees/
├── models/
│   ├── __init__.py
│   ├── employee.py               # Tasks 35-43
│   └── employment_history.py     # Tasks 45-48
├── signals.py                    # Task 50
└── migrations/
    ├── 0005_job_fields.py        # Task 44
    └── 0006_history.py           # Task 49
```

---

## Notes for AI Agents

### Job-Related Fields
- department: FK to Department (nullable initially)
- designation: FK to Designation (nullable initially)
- manager: FK to Employee (self-referential, nullable)
- employment_type: EmploymentType choice
- hire_date: DateField
- probation_end_date: DateField
- confirmation_date: DateField (nullable)
- work_location: CharField
- work_from_home_eligible: Boolean

### Manager Hierarchy
```
CEO
├── CFO
│   ├── Accountant 1
│   └── Accountant 2
├── CTO
│   ├── Dev Lead
│   │   ├── Developer 1
│   │   └── Developer 2
│   └── QA Lead
└── COO
    └── Operations Manager

Validation: Prevent circular references
```

### Termination Fields
- termination_date: DateField
- termination_reason: Choice (PERFORMANCE, MISCONDUCT, REDUNDANCY, MUTUAL, OTHER)
- exit_interview_notes: TextField
- terminated_by: FK to User

### Resignation Fields
- resignation_date: DateField
- resignation_reason: TextField
- notice_period_days: Integer
- last_working_date: DateField

### EmploymentHistory Fields
- employee: FK to Employee
- effective_date: DateField
- change_type: Choice (HIRE, PROMOTION, TRANSFER, DEMOTION, SALARY_CHANGE)
- from_department: FK to Department (nullable)
- to_department: FK to Department (nullable)
- from_designation: FK to Designation (nullable)
- to_designation: FK to Designation (nullable)
- from_manager: FK to Employee (nullable)
- to_manager: FK to Employee (nullable)
- previous_salary: Decimal (nullable)
- new_salary: Decimal (nullable)
- notes: TextField
- changed_by: FK to User

### Change Type Choices
| Type | Description |
|------|-------------|
| HIRE | Initial hiring |
| PROMOTION | Job upgrade |
| TRANSFER | Department change |
| DEMOTION | Job downgrade |
| SALARY_CHANGE | Salary adjustment only |

### Auto-History Signal
```
On Employee save:
1. Check if department changed
2. Check if designation changed
3. Check if manager changed
4. If any changed:
   - Create EmploymentHistory record
   - Store old and new values
   - Set effective_date = today
```

### Probation Flow
```
Hire Date: 2026-01-15
Probation Period: 3 months
Probation End: 2026-04-15

If confirmed:
├── confirmation_date = 2026-04-01
├── employment_type = FULL_TIME
└── Create history: change_type = PROMOTION (PROBATION → PERMANENT)

If not confirmed:
├── status = TERMINATED
├── termination_reason = PERFORMANCE
└── termination_date = 2026-04-15
```
