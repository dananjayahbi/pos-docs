# Group C: Payroll Calculation Engine

> **Phase:** 06 - ERP Advanced Modules  
> **SubPhase:** 06 - Payroll Processing  
> **Group:** C of F  
> **Tasks Covered:** 35-52  
> **Group Goal:** Implement payroll calculation engine with attendance integration

---

## Navigation

- **↑ Parent:** [SubPhase-06 Summary](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [Group B: PayrollRun & EmployeePayroll](../Group-B_PayrollRun-EmployeePayroll/)
- **→ Next Group:** [Group D: EPF/ETF/PAYE Processing](../Group-D_EPF-ETF-PAYE-Processing/)

---

## Group Overview

### Key Outcomes

1. **PayrollLineItem Model** - Detailed line items per component
2. **Line Item Fields** - employee_payroll FK, component FK, amount
3. **Line Item Type** - EARNING, DEDUCTION, CONTRIBUTION
4. **PayrollLineItem Migrations** - Apply migrations
5. **PayrollProcessor Service** - Main processing engine
6. **Get Eligible Employees** - Find employees for payroll
7. **Fetch Attendance Data** - Get attendance for period
8. **Calculate Working Days** - Count actual days worked
9. **Calculate Overtime** - Sum overtime hours
10. **Calculate Unpaid Leave** - Count no-pay leave days
11. **Calculate Basic Pro-Rata** - Adjust basic for attendance
12. **Calculate Earnings** - Sum earning components
13. **Calculate Deductions** - Sum deduction components
14. **Calculate Gross** - Total earnings
15. **Calculate Net** - Gross minus deductions
16. **Batch Processing** - Process all employees
17. **Processing Celery Task** - Async processing
18. **Progress Tracking** - Track processing progress

### Technology Context

| Technology | Purpose |
|------------|---------|
| Django ORM | LineItem model |
| Service Layer | PayrollProcessor |
| Celery | Async batch processing |
| Redis | Progress tracking |

---

## Documents in This Group

| # | Document | Tasks | Description |
|---|----------|-------|-------------|
| 01 | `01_Tasks-35-42_LineItem-Attendance.md` | 35-42 | PayrollLineItem, attendance fetch, working days |
| 02 | `02_Tasks-43-52_Calculations-Batch.md` | 43-52 | Pro-rata, earnings, deductions, batch processing |

---

## Task Summary

| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 35 | Create PayrollLineItem Model | Medium | 25 min |
| 36 | Add Line Item Fields | Low | 15 min |
| 37 | Add Line Item Type | Low | 15 min |
| 38 | Run PayrollLineItem Migrations | Low | 15 min |
| 39 | Create PayrollProcessor Service | High | 35 min |
| 40 | Implement Get Eligible Employees | Medium | 25 min |
| 41 | Implement Fetch Attendance Data | Medium | 25 min |
| 42 | Implement Calculate Working Days | Medium | 20 min |
| 43 | Implement Calculate Overtime | Medium | 20 min |
| 44 | Implement Calculate Unpaid Leave | Medium | 20 min |
| 45 | Implement Calculate Basic Pro-Rata | High | 30 min |
| 46 | Implement Calculate Earnings | High | 30 min |
| 47 | Implement Calculate Deductions | High | 30 min |
| 48 | Implement Calculate Gross | Medium | 20 min |
| 49 | Implement Calculate Net | Medium | 20 min |
| 50 | Create Batch Processing | High | 35 min |
| 51 | Create Processing Celery Task | High | 30 min |
| 52 | Add Progress Tracking | Medium | 25 min |

---

## Execution Order

```
[Tasks 35-42: PayrollLineItem, attendance integration]
         │
         ▼
[Tasks 43-52: Calculations, batch, Celery]
```

---

## Expected Deliverables

```
apps/payroll/
├── models/
│   └── payroll_line_item.py      # Tasks 35-37
├── services/
│   └── payroll_processor.py      # Tasks 39-50
├── tasks/
│   └── processing_tasks.py       # Tasks 51-52
└── migrations/
    └── 0016_payroll_line_item.py # Task 38
```

---

## Notes for AI Agents

### PayrollLineItem Model Fields
- employee_payroll: FK to EmployeePayroll
- component: FK to SalaryComponent
- line_type: LineType choice
- base_amount: Decimal (from salary structure)
- calculated_amount: Decimal (after adjustments)
- adjustment_amount: Decimal (pro-rata, etc.)
- final_amount: Decimal (actual amount)
- description: TextField
- calculation_notes: JSONField

### LineType Choices
| Type | Description |
|------|-------------|
| EARNING | Adds to gross |
| DEDUCTION | Subtracts from gross |
| EMPLOYER_CONTRIBUTION | Employer cost |
| ADJUSTMENT | Pro-rata adjustments |

### PayrollProcessor Methods
- process_period(period_id)
- get_eligible_employees(period)
- fetch_attendance(employee, period)
- calculate_working_days(attendance)
- calculate_overtime(attendance)
- calculate_unpaid_leave(employee, period)
- calculate_pro_rata_basic(salary, days_worked, total_days)
- calculate_earnings(employee_salary, attendance)
- calculate_deductions(gross, employee)
- calculate_gross(line_items)
- calculate_net(gross, deductions)
- process_employee(employee, period, run)
- process_batch(employees, period, run)

### Eligible Employees Query
```
Eligible = Employees where:
- status = ACTIVE
- has current salary (is_current=True)
- employment_date <= period.end_date
- termination_date is null or > period.start_date
```

### Attendance Data Structure
```json
{
  "period_start": "2026-01-01",
  "period_end": "2026-01-31",
  "total_working_days": 22,
  "days_worked": 20,
  "days_absent": 1,
  "overtime_hours": 12.5,
  "late_arrivals": 3,
  "early_departures": 1
}
```

### Working Days Calculation
```
For each date in period:
  - Check if weekend (exclude)
  - Check if holiday (exclude)
  - Check attendance record
  - Sum present days
```

### Overtime Calculation
```
For each attendance in period:
  if overtime_hours > 0:
    total_overtime += overtime_hours

overtime_rate = basic / 22 / 8 * 1.5
overtime_pay = total_overtime * overtime_rate
```

### Pro-Rata Basic Calculation
```
Pro-Rata Factor = Days Worked / Total Working Days

Example:
Basic: 150,000
Days Worked: 18
Total Days: 22
Factor: 18/22 = 0.818

Pro-Rata Basic: 150,000 × 0.818 = 122,727
```

### Earnings Calculation
```
For each EARNING component:
  if is_fixed:
    amount = component.amount
  else:
    # Attendance-based
    amount = calculate_variable_amount(component, attendance)
  
  if is_pro_rata:
    amount = amount × pro_rata_factor
  
  line_items.append(amount)
```

### Deductions Calculation
```
For each DEDUCTION component:
  if component.code == 'EPF_EMP':
    amount = epf_base × 0.08
  elif component.code == 'PAYE':
    amount = calculate_paye(taxable_income)
  elif component.code == 'LOAN':
    amount = get_loan_deduction(employee)
  ...
```

### Batch Processing
```
For each employee in batch:
  try:
    process_employee(employee)
    success_count += 1
  except Exception as e:
    log_error(employee, e)
    error_count += 1
  
  update_progress(success_count + error_count)
```

### Celery Task
```
@shared_task(bind=True)
def process_payroll_task(self, period_id):
    # Update status to PROCESSING
    # Process batch
    # Update status to PROCESSED
    # Send notification
```

### Progress Tracking
```
Redis key: payroll_progress:{run_id}
Value: {
  "total": 50,
  "processed": 35,
  "success": 33,
  "errors": 2,
  "current_employee": "EMP-0036",
  "percentage": 70
}
```

### Transaction Handling
```
Each employee processed in atomic transaction:
- If single employee fails, others continue
- Errors logged but don't stop batch
- Summary includes error count
```
