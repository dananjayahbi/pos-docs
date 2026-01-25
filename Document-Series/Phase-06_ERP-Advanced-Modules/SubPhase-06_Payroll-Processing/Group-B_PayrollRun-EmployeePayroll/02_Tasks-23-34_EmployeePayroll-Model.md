# Tasks 23-34: EmployeePayroll Model

> **Phase:** 06 - ERP Advanced Modules  
> **SubPhase:** 06 - Payroll Processing  
> **Group:** B - PayrollRun & EmployeePayroll  
> **Document:** 02 of 02  
> **Tasks Covered:** 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [01_Tasks-17-22_PayrollRun-Model.md](01_Tasks-17-22_PayrollRun-Model.md)

---

## Document Overview

This document covers the EmployeePayroll model, which stores individual employee payroll calculations for each payroll run. This model captures the complete breakdown of an employee's salary calculation including attendance data, earnings, deductions, statutory contributions, and payment details. Each record represents one employee's payroll for one specific payroll run.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
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

## Task 23: Create EmployeePayroll Model

### Overview
Create the EmployeePayroll model that stores individual employee payroll records for each run. This model represents the detailed payroll calculation for a single employee, including all components, deductions, and final amounts. Multiple employees are processed per payroll run, with each employee having their own EmployeePayroll record.

### Dependencies
- PayrollRun model exists (Tasks 17-22)
- Employee model exists from HR module
- Tenant-aware base models configured

### Instructions

1. **Create employee_payroll.py model file**
   - Navigate to `apps/payroll/models/` directory
   - Create new file named `employee_payroll.py`
   - This will contain the EmployeePayroll model

2. **Import required modules**
   - Import Django model fields
   - Import TenantAwareMixin and TimestampMixin
   - Import Decimal for financial fields
   - Import JSONField for structured data

3. **Define EmployeePayroll model class**
   - Inherit from TenantAwareMixin and TimestampMixin
   - Add comprehensive model docstring
   - Explain individual payroll record purpose

4. **Add model docstring**
   - Describe the model's role
   - Explain relationship with PayrollRun
   - Note snapshot nature of data
   - Document calculation workflow

5. **Update models package initialization**
   - Open `apps/payroll/models/__init__.py`
   - Import EmployeePayroll model
   - Add to __all__ list

### EmployeePayroll Model Purpose

```
┌─────────────────────────────────────────────────────┐
│           EmployeePayroll Model                     │
├─────────────────────────────────────────────────────┤
│ Represents: Individual employee's payroll record    │
│             for a specific payroll run              │
│                                                     │
│ Key Responsibilities:                               │
│  • Store complete salary calculation breakdown      │
│  • Capture attendance data for the period           │
│  • Record earnings and deductions                   │
│  • Calculate statutory contributions                │
│  • Track payment status and details                 │
│  • Maintain snapshot of salary structure            │
│  • Preserve bank account information                │
└─────────────────────────────────────────────────────┘
```

### Model Relationships

```
┌──────────────┐         1:N          ┌─────────────────────┐
│ PayrollRun   │◄─────────────────────│  EmployeePayroll    │
└──────────────┘                      └─────────────────────┘
                                               │
                                               │ N:1
                                               ▼
                                      ┌──────────────────┐
                                      │    Employee      │
                                      │   (HR Module)    │
                                      └──────────────────┘
```

### Record Per Employee Per Run

```
PayrollRun: January 2026, Run #1
├── EmployeePayroll #1 (John Doe)
│   ├── Days Worked: 20
│   ├── Gross: LKR 200,000
│   └── Net: LKR 174,800
│
├── EmployeePayroll #2 (Jane Smith)
│   ├── Days Worked: 22
│   ├── Gross: LKR 180,000
│   └── Net: LKR 158,600
│
└── EmployeePayroll #50 (Bob Wilson)
    ├── Days Worked: 18
    ├── Gross: LKR 165,000
    └── Net: LKR 145,200
```

### Expected Outcome
- EmployeePayroll model class created
- Proper inheritance configured
- Model registered in package
- Foundation for adding fields

### Verification Checklist
- [ ] employee_payroll.py file created
- [ ] Required modules imported
- [ ] EmployeePayroll class defined
- [ ] Model docstring added
- [ ] Imported in __init__.py

---

## Task 24: Add Employee FK

### Overview
Add the foreign key relationship to the Employee model. This links each payroll record to the specific employee it represents, enabling access to employee details and history.

### Dependencies
- Task 23: Create EmployeePayroll Model
- Employee model exists

### Instructions

1. **Open employee_payroll.py file**
   - Navigate to `apps/payroll/models/employee_payroll.py`
   - Locate EmployeePayroll model class

2. **Import Employee model**
   - Import Employee from hr.models
   - Adjust import path based on project structure

3. **Add employee field**
   - ForeignKey to Employee model
   - Set on_delete=PROTECT (prevent employee deletion with payroll)
   - Set related_name='employee_payrolls'
   - Add help_text explaining relationship

4. **Add employee display methods**
   - Create get_employee_name method
   - Create get_employee_code method
   - Quick access to employee identification

### Employee Relationship

```
┌─────────────────────────────────────────────────────┐
│         Employee ◄── EmployeePayroll                │
├─────────────────────────────────────────────────────┤
│ Relationship: Many-to-One                           │
│                                                     │
│ One Employee has multiple EmployeePayrolls:         │
│  • One per payroll run processed                    │
│  • Historical payroll records                       │
│  • Corrections and adjustments                      │
│                                                     │
│ Each EmployeePayroll belongs to one Employee        │
└─────────────────────────────────────────────────────┘
```

### Query Examples

```
# Get all payrolls for an employee
employee.employee_payrolls.all()

# Get latest payroll for employee
employee.employee_payrolls.first()

# Get payroll for specific period
employee.employee_payrolls.filter(
    payroll_run__payroll_period__period_month=1,
    payroll_run__payroll_period__period_year=2026
)

# Calculate YTD totals
from django.db.models import Sum
employee.employee_payrolls.filter(
    payroll_run__payroll_period__period_year=2026
).aggregate(
    ytd_gross=Sum('gross_salary'),
    ytd_net=Sum('net_salary')
)
```

### Expected Outcome
- Employee linked to payroll records
- Historical tracking enabled
- Cascade protection configured

### Verification Checklist
- [ ] Employee model imported
- [ ] employee ForeignKey added
- [ ] on_delete=PROTECT configured
- [ ] related_name='employee_payrolls'
- [ ] Helper methods created

---

## Task 25: Add Payroll Run FK

### Overview
Add the foreign key relationship to PayrollRun. This links each employee payroll record to the specific run it was created in, enabling run-level queries and aggregations.

### Dependencies
- Task 24: Add Employee FK

### Instructions

1. **Open employee_payroll.py file**
   - Continue in employee_payroll.py
   - Locate EmployeePayroll model

2. **Import PayrollRun model**
   - Import from same app models

3. **Add payroll_run field**
   - ForeignKey to PayrollRun
   - Set on_delete=CASCADE (delete employee payrolls with run)
   - Set related_name='employee_payrolls'

4. **Add Meta constraints**
   - Define unique_together for later use
   - Add ordering by employee

### Run Relationship

```
┌─────────────────────────────────────────────────────┐
│       PayrollRun ◄── EmployeePayroll                │
├─────────────────────────────────────────────────────┤
│ One Run has many Employee Payrolls                  │
│  • One record per employee processed                │
│  • All records created during processing            │
│                                                     │
│ Cascade deletion:                                   │
│  • Deleting run deletes employee records            │
└─────────────────────────────────────────────────────┘
```

### Query Examples

```
# Get all employee payrolls for a run
run.employee_payrolls.all()

# Count employees processed
run.employee_payrolls.count()

# Get successful vs failed
run.employee_payrolls.filter(
    payment_status='PAID'
).count()

# Calculate totals (verify)
run.employee_payrolls.aggregate(
    Sum('gross_salary'),
    Sum('net_salary')
)
```

### Expected Outcome
- Payroll records linked to runs
- Cascade deletion configured
- Run-level queries enabled

### Verification Checklist
- [ ] PayrollRun imported
- [ ] payroll_run ForeignKey added
- [ ] on_delete=CASCADE configured
- [ ] related_name set

---

## Task 26: Add Salary Reference

### Overview
Add fields that reference and snapshot the employee's salary configuration at processing time. This preserves the salary structure as it was when payroll was calculated, preventing issues from subsequent salary changes.

### Dependencies
- Task 25: Add Payroll Run FK
- EmployeeSalary model exists

### Instructions

1. **Open employee_payroll.py file**
   - Continue in employee_payroll.py

2. **Import EmployeeSalary model**
   - Import from payroll or hr models

3. **Add employee_salary field**
   - ForeignKey to EmployeeSalary
   - Set on_delete=PROTECT
   - Links to salary record used
   - Nullable (for terminated employees)

4. **Add salary_snapshot field**
   - JSONField
   - Stores frozen salary structure
   - Includes all components and amounts
   - Cannot be changed after processing

5. **Add snapshot documentation**
   - Document JSON structure
   - List required fields
   - Explain purpose

### Salary Snapshot Purpose

```
Why Snapshot?
─────────────────────────────────────────────────────

Problem:
Employee's salary changes after payroll processed
Historical payroll record now references wrong salary

Solution:
Freeze salary data at processing time
Store complete structure in JSON
Historical record remains accurate

Example:
Jan 2026 Payroll: Basic = 150,000 (snapshot)
Feb 2026: Salary updated to 160,000
Jan payroll still shows 150,000 (correct!)
```

### Salary Snapshot Structure

```json
{
  "salary_id": "uuid-of-salary-record",
  "effective_date": "2025-12-01",
  "basic_salary": 150000,
  "gross_salary": 195000,
  "template_id": "uuid-of-template",
  "template_name": "Standard Employee",
  "components": [
    {
      "id": "uuid",
      "code": "BASIC",
      "name": "Basic Salary",
      "type": "EARNING",
      "amount": 150000,
      "is_fixed": true,
      "is_taxable": true,
      "is_epf_applicable": true
    },
    {
      "id": "uuid",
      "code": "TRANSPORT",
      "name": "Transport Allowance",
      "type": "EARNING",
      "amount": 15000,
      "is_fixed": true,
      "is_taxable": true,
      "is_epf_applicable": false
    },
    {
      "id": "uuid",
      "code": "MOBILE",
      "name": "Mobile Allowance",
      "type": "EARNING",
      "amount": 5000,
      "is_fixed": true,
      "is_taxable": false,
      "is_epf_applicable": false
    }
  ]
}
```

### Snapshot vs Reference

```
employee_salary (ForeignKey):
  • Points to EmployeeSalary record
  • May change over time
  • Used for validation
  • Can be null (terminated employees)

salary_snapshot (JSON):
  • Frozen copy at processing time
  • Never changes
  • Used for recalculation
  • Always populated
```

### Expected Outcome
- Salary reference maintained
- Snapshot stored for history
- Audit trail preserved

### Verification Checklist
- [ ] EmployeeSalary imported
- [ ] employee_salary FK added
- [ ] salary_snapshot JSONField added
- [ ] Snapshot structure documented

---

## Task 27: Add Attendance Fields

### Overview
Add fields that capture attendance information for the payroll period. These fields track working days, absences, leave, overtime, and punctuality, forming the basis for salary calculations and adjustments.

### Dependencies
- Task 26: Add Salary Reference

### Instructions

1. **Open employee_payroll.py file**
   - Continue in employee_payroll.py

2. **Add days_worked field**
   - PositiveIntegerField
   - Count of days employee was present
   - Excludes weekends and holidays
   - Used for pro-rata calculations

3. **Add days_absent field**
   - PositiveIntegerField
   - Count of absent days with pay (sick leave)
   - Counted in working days
   - Default to 0

4. **Add unpaid_leave_days field**
   - PositiveIntegerField
   - Count of no-pay leave days
   - Deducted from working days
   - Used for salary reduction

5. **Add overtime_hours field**
   - DecimalField (max_digits=6, decimal_places=2)
   - Total overtime hours worked
   - Calculated separately and paid
   - Default to 0.00

6. **Add late_count field**
   - PositiveIntegerField
   - Number of late arrivals
   - May trigger deductions
   - Default to 0

7. **Add attendance validation**
   - Create validate_attendance method
   - Verify days_worked + unpaid_leave <= total_working_days
   - Check overtime hours reasonable

### Attendance Fields Structure

```
┌─────────────────────────────────────────────────────┐
│           Attendance Tracking Fields                │
├─────────────────────────────────────────────────────┤
│ Working Days:                                       │
│  • days_worked: PositiveInteger                     │
│  • days_absent: PositiveInteger                     │
│  • unpaid_leave_days: PositiveInteger               │
│                                                     │
│ Additional Time:                                    │
│  • overtime_hours: Decimal(6,2)                     │
│  • late_count: PositiveInteger                      │
│                                                     │
│ Validation:                                         │
│  • Total days <= period working days                │
│  • Overtime hours <= reasonable limit               │
└─────────────────────────────────────────────────────┘
```

### Attendance Calculation Example

```
PayrollPeriod: January 2026
Total Calendar Days: 31
Weekends: 8 days (4 Saturdays, 4 Sundays)
Public Holidays: 1 day (Poya Day)
Total Working Days: 22

Employee: John Doe
─────────────────────────────────────────────────────
Days Present: 18
Days Absent (Sick Leave, Paid): 2
Unpaid Leave: 2
Total: 22 days ✓

Overtime: 12.5 hours
Late Arrivals: 3 times

Salary Impact:
├── Basic Pro-rata: 18/22 = 81.82%
├── Overtime Pay: 12.5 hours × rate
└── Late Penalty: 3 × penalty amount
```

### Working Days Breakdown

```
Total Working Days = 22
├── Days Worked: 18 (normal attendance)
├── Days Absent: 2 (sick leave, paid)
└── Unpaid Leave: 2 (no-pay leave)

Validation:
18 + 2 + 2 = 22 ✓

Pro-rata Factor:
(days_worked + days_absent) / total_working_days
(18 + 2) / 22 = 0.909
```

### Overtime Calculation

```
Basic Salary: 150,000
Working Days: 22
Working Hours per Day: 8

Hourly Rate:
150,000 / 22 / 8 = 852.27

Overtime Rate (1.5x):
852.27 × 1.5 = 1,278.41

Overtime Pay:
12.5 hours × 1,278.41 = 15,980.13
```

### Late Arrival Handling

```
Late Policy:
├── 1-5 minutes: Warning only
├── 6-15 minutes: Half-day deduction
└── 15+ minutes: Full-day deduction

Late Count: 3 times
Breakdown:
├── 1st: 8 minutes → Half-day deduction
├── 2nd: 20 minutes → Full-day deduction
└── 3rd: 5 minutes → Warning

Total Deduction: 1.5 days
```

### Expected Outcome
- Complete attendance tracking
- Pro-rata calculation support
- Overtime handling
- Leave management

### Verification Checklist
- [ ] days_worked field added
- [ ] days_absent field added
- [ ] unpaid_leave_days field added
- [ ] overtime_hours Decimal field added
- [ ] late_count field added
- [ ] All fields have defaults
- [ ] validate_attendance method created

---

## Task 28: Add Financial Summary Fields

### Overview
Add fields that store the calculated financial amounts for the employee's payroll. These fields capture basic salary, overtime pay, gross salary, deductions, and net salary, forming the complete financial picture.

### Dependencies
- Task 27: Add Attendance Fields

### Instructions

1. **Add basic_salary field**
   - DecimalField (15, 2)
   - Actual basic for this period
   - May be pro-rated
   - Default to 0.00

2. **Add overtime_amount field**
   - DecimalField (12, 2)
   - Calculated overtime payment
   - Based on overtime_hours
   - Default to 0.00

3. **Add gross_salary field**
   - DecimalField (15, 2)
   - Total earnings before deductions
   - Sum of all earning components
   - Default to 0.00

4. **Add total_deductions field**
   - DecimalField (15, 2)
   - Sum of all deductions
   - EPF, PAYE, loans, etc.
   - Default to 0.00

5. **Add net_salary field**
   - DecimalField (15, 2)
   - Final take-home amount
   - gross_salary - total_deductions
   - Default to 0.00

6. **Add calculation methods**
   - Create calculate_net method
   - Create validate_amounts method
   - Ensure net = gross - deductions

### Financial Fields Structure

```
┌─────────────────────────────────────────────────────┐
│           Financial Summary Fields                  │
├─────────────────────────────────────────────────────┤
│ Earnings:                                           │
│  • basic_salary: Decimal(15,2)                      │
│  • overtime_amount: Decimal(12,2)                   │
│  • gross_salary: Decimal(15,2)                      │
│                                                     │
│ Deductions:                                         │
│  • total_deductions: Decimal(15,2)                  │
│                                                     │
│ Final:                                              │
│  • net_salary: Decimal(15,2)                        │
│                                                     │
│ Formula:                                            │
│  net_salary = gross_salary - total_deductions       │
└─────────────────────────────────────────────────────┘
```

### Financial Calculation Flow

```
Step 1: Calculate Basic (Pro-rata if needed)
├── Full Basic: 150,000
├── Days Worked: 18 / 22
└── Basic Salary: 122,727.27

Step 2: Calculate Overtime
├── Overtime Hours: 12.5
├── Overtime Rate: 1,278.41
└── Overtime Amount: 15,980.13

Step 3: Calculate Gross
├── Basic: 122,727.27
├── Transport Allowance: 15,000
├── Mobile Allowance: 5,000
├── Overtime: 15,980.13
└── Gross Salary: 158,707.40

Step 4: Calculate Deductions
├── EPF Employee (8%): 12,000
├── PAYE Tax: 5,500
├── Loan Deduction: 10,000
└── Total Deductions: 27,500

Step 5: Calculate Net
├── Gross: 158,707.40
├── Deductions: 27,500
└── Net Salary: 131,207.40
```

### Earnings Breakdown

```
Gross Salary Components:
─────────────────────────────────────────────────────
Basic Salary (Pro-rata)         122,727.27
+ Transport Allowance            15,000.00
+ Mobile Allowance                5,000.00
+ Overtime Payment               15,980.13
+ Performance Bonus                   0.00
─────────────────────────────────────────────────────
GROSS SALARY                    158,707.40
```

### Deductions Breakdown

```
Total Deductions:
─────────────────────────────────────────────────────
EPF Employee Contribution (8%)   12,000.00
+ PAYE Tax                         5,500.00
+ Loan Repayment                  10,000.00
+ Advance Recovery                     0.00
+ Late Penalty                         0.00
─────────────────────────────────────────────────────
TOTAL DEDUCTIONS                  27,500.00
```

### Net Calculation

```
PAYSLIP SUMMARY
─────────────────────────────────────────────────────
Gross Salary                    158,707.40
Less: Deductions                (27,500.00)
─────────────────────────────────────────────────────
NET SALARY (Take Home)          131,207.40
═════════════════════════════════════════════════════
```

### Expected Outcome
- Complete financial tracking
- Accurate gross and net
- Deduction management
- Calculation validation

### Verification Checklist
- [ ] basic_salary field added
- [ ] overtime_amount field added
- [ ] gross_salary field added
- [ ] total_deductions field added
- [ ] net_salary field added
- [ ] All Decimal fields properly configured
- [ ] calculate_net method created
- [ ] validate_amounts method created

---

## Task 29: Add EPF/ETF Fields

### Overview
Add fields for tracking Employee Provident Fund (EPF) and Employees' Trust Fund (ETF) contributions. These statutory deductions and employer contributions are calculated based on EPF-applicable earnings according to Sri Lankan labor law.

### Dependencies
- Task 28: Add Financial Summary Fields

### Instructions

1. **Add epf_employee field**
   - DecimalField (12, 2)
   - Employee contribution (8%)
   - Deducted from salary
   - Default to 0.00

2. **Add epf_employer field**
   - DecimalField (12, 2)
   - Employer contribution (12%)
   - Not deducted, employer cost
   - Default to 0.00

3. **Add etf field**
   - DecimalField (12, 2)
   - Employer contribution (3%)
   - Not deducted, employer cost
   - Default to 0.00

4. **Add EPF documentation**
   - Document calculation basis
   - Note applicable earnings
   - Explain rates

### EPF/ETF Structure

```
┌─────────────────────────────────────────────────────┐
│           EPF/ETF Contributions                     │
├─────────────────────────────────────────────────────┤
│ Employee Deduction:                                 │
│  • epf_employee: Decimal(12,2) - 8%                 │
│                                                     │
│ Employer Costs:                                     │
│  • epf_employer: Decimal(12,2) - 12%                │
│  • etf: Decimal(12,2) - 3%                          │
│                                                     │
│ Total EPF: 20% (8% + 12%)                           │
│ Total ETF: 3%                                       │
└─────────────────────────────────────────────────────┘
```

### EPF Calculation

```
EPF Base Calculation:
─────────────────────────────────────────────────────
Basic Salary (Pro-rata):        150,000.00
+ Fixed Allowances (EPF eligible)    0.00
+ Overtime (if EPF eligible)     15,000.00
─────────────────────────────────────────────────────
EPF Base:                       165,000.00

Employee EPF (8%):
165,000 × 0.08 = 13,200.00

Employer EPF (12%):
165,000 × 0.12 = 19,800.00

Total EPF (20%):
165,000 × 0.20 = 33,000.00
```

### ETF Calculation

```
ETF Base = EPF Base (same earnings)
─────────────────────────────────────────────────────
ETF Base:                       165,000.00

Employer ETF (3%):
165,000 × 0.03 = 4,950.00

(No employee contribution for ETF)
```

### Complete Statutory Summary

```
Statutory Contributions Breakdown:
─────────────────────────────────────────────────────
                        Employee    Employer    Total
EPF (8%/12%)            13,200      19,800     33,000
ETF (3%)                     -       4,950      4,950
─────────────────────────────────────────────────────
TOTAL                   13,200      24,750     37,950

Employee Take-Home Impact: -13,200 (deducted)
Employer Additional Cost: +24,750
```

### Expected Outcome
- EPF tracking for employee and employer
- ETF tracking for employer
- Statutory compliance support

### Verification Checklist
- [ ] epf_employee field added
- [ ] epf_employer field added
- [ ] etf field added
- [ ] All fields Decimal(12,2)
- [ ] Defaults set to 0.00
- [ ] Calculation basis documented

---

## Task 30: Add Tax Field

### Overview
Add the field for tracking Pay As You Earn (PAYE) income tax deduction. This statutory deduction is calculated based on taxable income with exemptions and applied using progressive tax slabs as per Sri Lankan Inland Revenue regulations.

### Dependencies
- Task 29: Add EPF/ETF Fields

### Instructions

1. **Add paye_tax field**
   - DecimalField (12, 2)
   - PAYE income tax amount
   - Deducted from salary
   - Default to 0.00

2. **Add tax documentation**
   - Document PAYE calculation
   - Note exemptions applied
   - Reference tax slabs

### PAYE Tax Field

```
┌─────────────────────────────────────────────────────┐
│              PAYE Tax Deduction                     │
├─────────────────────────────────────────────────────┤
│ Field:                                              │
│  • paye_tax: Decimal(12,2)                          │
│                                                     │
│ Calculation:                                        │
│  • Based on annual taxable income projection        │
│  • Less personal relief and EPF exemption           │
│  • Applied using progressive tax slabs              │
│  • Monthly deduction = Annual tax / 12              │
└─────────────────────────────────────────────────────┘
```

### PAYE Calculation Example

```
Monthly Gross:                  200,000.00
Annual Projection:            2,400,000.00

Less Exemptions:
  Personal Relief:           (1,200,000.00)
  EPF Deduction (8%):          (144,000.00)
─────────────────────────────────────────────────────
Taxable Income:               1,056,000.00

Tax Slabs Applied:
  0 - 1,200,000 @ 0%:                 0.00
  Remaining @ 6%:
  1,056,000 × 0.06 =             63,360.00
─────────────────────────────────────────────────────
Annual Tax:                      63,360.00
Monthly PAYE:                     5,280.00
```

### Expected Outcome
- PAYE tax tracking
- Monthly deduction captured

### Verification Checklist
- [ ] paye_tax field added
- [ ] Decimal(12,2) type
- [ ] Default 0.00
- [ ] Documentation added

---

## Task 31: Add Bank Fields

### Overview
Add fields for storing employee bank account information as a snapshot. This preserves payment details as they existed at processing time, ensuring accurate payment records even if bank details change later.

### Dependencies
- Task 30: Add Tax Field

### Instructions

1. **Add bank_account field**
   - JSONField
   - Snapshot of bank details
   - Includes bank name, branch, account
   - Default to empty dict

2. **Add payment_reference field**
   - CharField max_length=100
   - Transaction reference number
   - Null and blank allowed
   - Set after payment processed

3. **Add payment_date field**
   - DateField
   - When payment made
   - Null and blank allowed
   - Set after successful payment

4. **Document bank snapshot structure**
   - Define required fields
   - Show example JSON

### Bank Account Snapshot

```json
{
  "bank_name": "Bank of Ceylon",
  "bank_code": "BOC",
  "branch_name": "Colombo 03 Branch",
  "branch_code": "001",
  "account_number": "123456789012",
  "account_name": "John Doe",
  "account_type": "SAVINGS",
  "swift_code": "BCEYLKLX"
}
```

### Payment Tracking

```
Before Payment:
├── bank_account: {...snapshot...}
├── payment_reference: NULL
├── payment_date: NULL
└── payment_status: PENDING

After Payment:
├── bank_account: {...snapshot...}
├── payment_reference: "TXN-2026-01-25-00123"
├── payment_date: 2026-01-25
└── payment_status: PAID
```

### Expected Outcome
- Bank details preserved
- Payment tracking enabled

### Verification Checklist
- [ ] bank_account JSONField added
- [ ] payment_reference CharField added
- [ ] payment_date DateField added
- [ ] All nullable
- [ ] JSON structure documented

---

## Task 32: Add Payment Status

### Overview
Add the payment status field to track whether the employee has been paid. This field works with payment_date and payment_reference to provide complete payment lifecycle tracking.

### Dependencies
- Task 31: Add Bank Fields

### Instructions

1. **Define PaymentStatus choices**
   - Create tuple of status choices
   - PENDING, PAID, FAILED, ON_HOLD

2. **Add payment_status field**
   - CharField with choices
   - Default to 'PENDING'
   - Max length 20

3. **Add notes field**
   - TextField
   - Free-form notes
   - Blank and null allowed

4. **Add is_verified field**
   - BooleanField
   - Verification flag
   - Default False

### Payment Status Lifecycle

```
PENDING → PAID
  ↓
FAILED → ON_HOLD
```

### Expected Outcome
- Payment status tracking
- Notes capability

### Verification Checklist
- [ ] PaymentStatus choices defined
- [ ] payment_status field added
- [ ] notes TextField added
- [ ] is_verified field added

---

## Task 33: Run EmployeePayroll Migrations

### Overview
Generate and apply migrations for the EmployeePayroll model.

### Dependencies
- Task 32: Add Payment Status

### Instructions

1. **Review model completeness**
2. **Generate migration**
3. **Review migration file**
4. **Apply migration**
5. **Verify table created**

### Expected Outcome
- Migration created and applied
- Database table exists

### Verification Checklist
- [ ] makemigrations executed
- [ ] Migration file created
- [ ] migrate executed
- [ ] Table verified

---

## Task 34: Create Unique Constraint

### Overview
Add a database constraint ensuring one payroll record per employee per run.

### Dependencies
- Task 33: Run EmployeePayroll Migrations

### Instructions

1. **Update Meta class**
   - Add unique_together constraint
   - Fields: (tenant, payroll_run, employee)

2. **Generate migration**
   - Run makemigrations again

3. **Apply migration**

### Unique Constraint

```
unique_together = (
    ('tenant', 'payroll_run', 'employee')
)

Prevents:
├── Duplicate payroll for same employee in same run
└── Data integrity issues

Allows:
└── Same employee in different runs (corrections)
```

### Expected Outcome
- Constraint applied
- Duplicates prevented

### Verification Checklist
- [ ] unique_together added
- [ ] Migration generated
- [ ] Migration applied
- [ ] Constraint verified

---

## Summary

Completed EmployeePayroll model with complete field structure.

### Key Achievements
- Employee and Run relationships
- Salary snapshot preservation
- Attendance tracking
- Financial calculations
- Statutory contributions
- Bank account snapshot
- Payment tracking
- Unique constraints

---

**Document Status:** ✅ Complete  
**Total Tasks:** 12  
**Estimated Time:** 230 minutes
