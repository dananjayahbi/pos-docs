# Group C: Employee Salary Assignment

> **Phase:** 06 - ERP Advanced Modules  
> **SubPhase:** 05 - Salary Structure  
> **Group:** C of F  
> **Tasks Covered:** 35-48  
> **Group Goal:** Assign salary to employees with component tracking and history

---

## Navigation

- **↑ Parent:** [SubPhase-05 Summary](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [Group B: Salary Template & Grades](../Group-B_Salary-Template-Grades/)
- **→ Next Group:** [Group D: Statutory Components (EPF/ETF/PAYE)](../Group-D_Statutory-Components-EPF-ETF-PAYE/)

---

## Group Overview

### Key Outcomes

1. **EmployeeSalary Model** - Assign salary to employee
2. **Employee FK** - Link to Employee model
3. **Template FK** - Optional salary template link
4. **Basic Salary Field** - basic_salary DecimalField
5. **Gross Salary Field** - gross_salary (calculated)
6. **Effective Date Fields** - effective_from, effective_to
7. **Current Flag** - is_current boolean
8. **EmployeeSalary Migrations** - Apply migrations
9. **EmployeeSalaryComponent Model** - Employee-specific values
10. **Salary Component Fields** - employee_salary FK, component FK, amount
11. **EmployeeSalaryComponent Migrations** - Apply migrations
12. **Salary Assignment Signal** - Create history on change
13. **SalaryHistory Model** - Track changes over time
14. **SalaryHistory Migrations** - Apply migrations

### Technology Context

| Technology | Purpose |
|------------|---------|
| Django ORM | EmployeeSalary, SalaryHistory models |
| Signals | Change tracking |
| Decimal | Financial precision |
| Effective Date | Salary versioning |

---

## Documents in This Group

| # | Document | Tasks | Description |
|---|----------|-------|-------------|
| 01 | `01_Tasks-35-42_EmployeeSalary-Model.md` | 35-42 | EmployeeSalary model, migrations |
| 02 | `02_Tasks-43-48_Component-Signal-History.md` | 43-48 | EmployeeSalaryComponent, signal, history |

---

## Task Summary

| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 35 | Create EmployeeSalary Model | Medium | 25 min |
| 36 | Add Employee FK | Low | 15 min |
| 37 | Add Template FK | Low | 15 min |
| 38 | Add Basic Salary Field | Low | 15 min |
| 39 | Add Gross Salary Field | Medium | 20 min |
| 40 | Add Effective Date Fields | Medium | 20 min |
| 41 | Add Current Flag | Low | 15 min |
| 42 | Run EmployeeSalary Migrations | Low | 15 min |
| 43 | Create EmployeeSalaryComponent Model | Medium | 25 min |
| 44 | Add Salary Component Fields | Low | 15 min |
| 45 | Run EmployeeSalaryComponent Migrations | Low | 15 min |
| 46 | Create Salary Assignment Signal | High | 30 min |
| 47 | Create SalaryHistory Model | Medium | 25 min |
| 48 | Run SalaryHistory Migrations | Low | 15 min |

---

## Execution Order

```
[Tasks 35-42: EmployeeSalary model, migrations]
         │
         ▼
[Tasks 43-48: Components, signal, history]
```

---

## Expected Deliverables

```
apps/payroll/
├── models/
│   ├── employee_salary.py        # Tasks 35-41
│   ├── employee_salary_component.py # Tasks 43-44
│   └── salary_history.py         # Task 47
├── signals.py                    # Task 46
└── migrations/
    ├── 0005_employee_salary.py   # Task 42
    ├── 0006_employee_salary_component.py # Task 45
    └── 0007_salary_history.py    # Task 48
```

---

## Notes for AI Agents

### EmployeeSalary Model Fields
- employee: FK to Employee
- salary_template: FK to SalaryTemplate (nullable)
- salary_grade: FK to SalaryGrade (nullable)
- basic_salary: Decimal
- gross_salary: Decimal (calculated)
- effective_from: DateField
- effective_to: DateField (nullable)
- is_current: Boolean
- revision_number: Integer
- revision_reason: TextField
- created_by: FK to User
- created_at: DateTimeField

### Effective Date Logic
```
Multiple salary records per employee:
├── Salary 1: effective_from=2024-01-01, effective_to=2024-06-30
├── Salary 2: effective_from=2024-07-01, effective_to=2025-01-31
└── Salary 3: effective_from=2025-02-01, effective_to=null (current)

Only one record with is_current=True.
effective_to=null means "until next revision".
```

### Gross Salary Calculation
```
Gross = Sum of all EARNING components

Components (EARNING):
├── Basic Salary: 150,000
├── Transport Allowance: 15,000
├── Medical Allowance: 10,000
└── Housing Allowance: 20,000
────────────────────────────
Gross Salary: 195,000
```

### EmployeeSalaryComponent Model Fields
- employee_salary: FK to EmployeeSalary
- component: FK to SalaryComponent
- amount: Decimal (fixed value)
- percentage: Decimal (if percentage-based)
- calculated_amount: Decimal (computed)
- is_overridden: Boolean
- notes: TextField

### Component Value Sources
```
Priority:
1. Employee-specific override (highest)
2. Template default value
3. Component default value (lowest)
```

### Component Example
```
Employee: John Doe
Salary Template: Senior Developer Package

Components:
├── Basic Salary: 150,000 (override: 155,000) ← Employee override
├── Transport: 15,000 (template default)
├── Medical: 10,000 (template default)
├── EPF Employee: 8% of 155,000 = 12,400 (calculated)
└── PAYE: formula result (calculated)
```

### Salary Assignment Signal
```
On EmployeeSalary save:
1. If new record:
   - Mark previous as is_current=False
   - Set effective_to on previous record
   - Create SalaryHistory entry

2. If existing record modified:
   - Create SalaryHistory entry with changes
```

### SalaryHistory Model Fields
- employee: FK to Employee
- salary: FK to EmployeeSalary
- action: Choice (CREATED, REVISED, COMPONENT_CHANGED)
- previous_basic: Decimal
- new_basic: Decimal
- previous_gross: Decimal
- new_gross: Decimal
- change_percentage: Decimal
- effective_date: DateField
- reason: TextField
- changed_by: FK to User
- changed_at: DateTimeField
- component_changes: JSONField (component-level changes)

### History JSON Example
```json
{
  "component_changes": [
    {
      "component": "BASIC",
      "previous": 150000,
      "new": 165000,
      "change": 15000,
      "percentage": 10.0
    },
    {
      "component": "TRANSPORT",
      "previous": 15000,
      "new": 18000,
      "change": 3000,
      "percentage": 20.0
    }
  ]
}
```

### Current Salary Query
```
Get employee's current salary:
EmployeeSalary.objects.filter(
    employee=employee,
    is_current=True
).first()

Get salary for specific date:
EmployeeSalary.objects.filter(
    employee=employee,
    effective_from__lte=date,
    Q(effective_to__gte=date) | Q(effective_to__isnull=True)
).first()
```

### Revision Process
```
1. Create new EmployeeSalary with new effective_from
2. Close previous (set effective_to, is_current=False)
3. Copy components from previous or template
4. Override component values as needed
5. Calculate gross_salary
6. Create SalaryHistory record
7. Trigger notifications
```
