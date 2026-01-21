# Group B: PayrollRun & EmployeePayroll

> **Phase:** 06 - ERP Advanced Modules  
> **SubPhase:** 06 - Payroll Processing  
> **Group:** B of F  
> **Tasks Covered:** 17-34  
> **Group Goal:** Create payroll run and individual employee payroll models

---

## Navigation

- **↑ Parent:** [SubPhase-06 Summary](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [Group A: Payroll Period Models](../Group-A_Payroll-Period-Models/)
- **→ Next Group:** [Group C: Payroll Calculation Engine](../Group-C_Payroll-Calculation-Engine/)

---

## Group Overview

### Key Outcomes

1. **PayrollRun Model** - Model for each processing run
2. **Run Period FK** - Link to PayrollPeriod
3. **Run Status Field** - Status, started_at, completed_at
4. **Run Summary Fields** - total_employees, total_gross, total_net
5. **Run User Fields** - processed_by, approved_by
6. **PayrollRun Migrations** - Apply migrations
7. **EmployeePayroll Model** - Individual employee payroll record
8. **Employee FK** - Link to Employee model
9. **Payroll Run FK** - Link to PayrollRun
10. **Salary Reference** - Snapshot of EmployeeSalary
11. **Attendance Fields** - days_worked, days_absent, overtime_hours
12. **Financial Summary Fields** - gross_salary, total_deductions, net_salary
13. **EPF/ETF Fields** - epf_employee, epf_employer, etf
14. **Tax Field** - paye_tax
15. **Bank Fields** - Bank account snapshot
16. **Payment Status** - PENDING, PAID, FAILED
17. **EmployeePayroll Migrations** - Apply migrations
18. **Unique Constraint** - One payroll per employee per period

### Technology Context

| Technology | Purpose |
|------------|---------|
| Django ORM | Run, employee payroll models |
| ForeignKey | Period, employee links |
| Decimal | Financial precision |
| JSONField | Bank account snapshot |

---

## Documents in This Group

| # | Document | Tasks | Description |
|---|----------|-------|-------------|
| 01 | `01_Tasks-17-22_PayrollRun-Model.md` | 17-22 | PayrollRun model, migrations |
| 02 | `02_Tasks-23-34_EmployeePayroll-Model.md` | 23-34 | EmployeePayroll model, migrations |

---

## Task Summary

| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 17 | Create PayrollRun Model | Medium | 25 min |
| 18 | Add Run Period FK | Low | 15 min |
| 19 | Add Run Status Field | Medium | 20 min |
| 20 | Add Run Summary Fields | Medium | 20 min |
| 21 | Add Run User Fields | Low | 15 min |
| 22 | Run PayrollRun Migrations | Low | 15 min |
| 23 | Create EmployeePayroll Model | Medium | 25 min |
| 24 | Add Employee FK | Low | 15 min |
| 25 | Add Payroll Run FK | Low | 15 min |
| 26 | Add Salary Reference | Medium | 20 min |
| 27 | Add Attendance Fields | Medium | 20 min |
| 28 | Add Financial Summary Fields | Medium | 25 min |
| 29 | Add EPF/ETF Fields | Medium | 20 min |
| 30 | Add Tax Field | Low | 15 min |
| 31 | Add Bank Fields | Medium | 20 min |
| 32 | Add Payment Status | Low | 15 min |
| 33 | Run EmployeePayroll Migrations | Low | 15 min |
| 34 | Create Unique Constraint | Low | 15 min |

---

## Execution Order

```
[Tasks 17-22: PayrollRun model, migrations]
         │
         ▼
[Tasks 23-34: EmployeePayroll model, migrations]
```

---

## Expected Deliverables

```
apps/payroll/
├── models/
│   ├── payroll_run.py            # Tasks 17-21
│   └── employee_payroll.py       # Tasks 23-32, 34
└── migrations/
    ├── 0014_payroll_run.py       # Task 22
    └── 0015_employee_payroll.py  # Task 33
```

---

## Notes for AI Agents

### PayrollRun Model Fields
- payroll_period: FK to PayrollPeriod
- run_number: Integer (1, 2... for reruns)
- status: PayrollStatus choice
- started_at: DateTimeField
- completed_at: DateTimeField (nullable)
- total_employees: Integer
- total_gross: Decimal
- total_deductions: Decimal
- total_net: Decimal
- total_epf_employee: Decimal
- total_epf_employer: Decimal
- total_etf: Decimal
- total_paye: Decimal
- processed_by: FK to User
- approved_by: FK to User (nullable)
- approved_at: DateTimeField (nullable)
- notes: TextField
- error_count: Integer
- errors: JSONField (list of errors)

### Run Summary Example
```
PayrollRun: January 2026, Run #1
Status: PROCESSED
Employees: 50
Gross Total: LKR 7,500,000
Deductions: LKR 1,200,000
Net Total: LKR 6,300,000
EPF Employee: LKR 600,000
EPF Employer: LKR 900,000
ETF: LKR 225,000
PAYE: LKR 375,000
```

### EmployeePayroll Model Fields
- payroll_run: FK to PayrollRun
- employee: FK to Employee
- employee_salary: FK to EmployeeSalary
- salary_snapshot: JSONField (frozen salary data)
- days_worked: Integer
- days_absent: Integer
- unpaid_leave_days: Integer
- overtime_hours: Decimal
- late_count: Integer
- basic_salary: Decimal (actual for period)
- overtime_amount: Decimal
- gross_salary: Decimal
- total_deductions: Decimal
- net_salary: Decimal
- epf_employee: Decimal
- epf_employer: Decimal
- etf: Decimal
- paye_tax: Decimal
- bank_account: JSONField (snapshot)
- payment_status: PaymentStatus choice
- payment_date: DateField (nullable)
- payment_reference: CharField (nullable)
- notes: TextField
- is_verified: Boolean

### PaymentStatus Choices
| Status | Description |
|--------|-------------|
| PENDING | Awaiting payment |
| PAID | Payment completed |
| FAILED | Payment failed |
| ON_HOLD | Payment held |

### Salary Snapshot Purpose
```
Freeze salary at processing time:
- Prevents changes affecting past payroll
- Audit trail
- Recalculation reference
```

### Salary Snapshot JSON
```json
{
  "salary_id": "uuid",
  "basic_salary": 150000,
  "gross_salary": 195000,
  "template_id": "uuid",
  "components": [
    {"code": "BASIC", "amount": 150000},
    {"code": "TRANSPORT", "amount": 15000}
  ]
}
```

### Bank Account Snapshot
```json
{
  "bank_name": "Bank of Ceylon",
  "bank_code": "BOC",
  "branch_code": "001",
  "account_number": "123456789012",
  "account_name": "John Doe"
}
```

### Attendance Fields Logic
```
days_worked + days_absent + unpaid_leave_days = total_working_days

Example:
Total Working Days: 22
Days Worked: 18
Days Absent (with pay): 2 (sick leave)
Unpaid Leave: 2
```

### Unique Constraint
```
(payroll_run, employee) unique
- Prevents duplicate payroll for same employee
- Multiple runs allowed for period (corrections)
```

### Financial Summary Relationships
```
Gross = Basic + Allowances + Overtime + Bonus
Deductions = EPF Employee + PAYE + Loans + No-Pay
Net = Gross - Deductions

Employer Cost = Gross + EPF Employer + ETF
```
