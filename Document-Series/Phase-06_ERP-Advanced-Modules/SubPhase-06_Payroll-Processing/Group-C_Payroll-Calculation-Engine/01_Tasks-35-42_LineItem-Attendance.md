# Tasks 35-42: PayrollLineItem Model and Attendance Integration

> **Phase:** 06 - ERP Advanced Modules  
> **SubPhase:** 06 - Payroll Processing  
> **Group:** C - Payroll Calculation Engine  
> **Document:** 01 of 02  
> **Tasks Covered:** 35, 36, 37, 38, 39, 40, 41, 42

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **→ Next Document:** [02_Tasks-43-52_Calculations-Batch.md](02_Tasks-43-52_Calculations-Batch.md)

---

## Document Overview

This document covers the PayrollLineItem model and the initial components of the payroll calculation engine. It establishes detailed line-item tracking for salary components and implements attendance data integration including fetching attendance records and calculating working days.

### Tasks in This Document
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

---

## Task 35: Create PayrollLineItem Model

### Overview
Create the PayrollLineItem model that stores detailed breakdowns of salary components for each employee payroll. Each line item represents a single earning, deduction, or contribution component, enabling detailed payslip generation and audit trails. This granular approach provides transparency and supports component-level analysis.

### Dependencies
- EmployeePayroll model exists (Group B)
- SalaryComponent model exists (from previous subphases)
- Tenant-aware base models configured

### Instructions

1. **Create payroll_line_item.py model file**
   - Navigate to `apps/payroll/models/` directory
   - Create new file named `payroll_line_item.py`
   - This will contain the PayrollLineItem model

2. **Import required modules**
   - Import Django model fields
   - Import TenantAwareMixin and TimestampMixin
   - Import Decimal for financial precision
   - Import JSONField for calculation notes

3. **Define PayrollLineItem model class**
   - Inherit from TenantAwareMixin and TimestampMixin
   - Add comprehensive model docstring
   - Explain line-by-line component tracking

4. **Add model docstring**
   - Describe the model's purpose
   - Explain relationship with EmployeePayroll
   - Note component breakdown capability
   - Document calculation transparency

5. **Prepare for field additions**
   - Structure ready for foreign keys
   - Relationships to EmployeePayroll and SalaryComponent
   - Amount fields for calculations

6. **Update models package initialization**
   - Open `apps/payroll/models/__init__.py`
   - Import PayrollLineItem model
   - Add to __all__ list

### PayrollLineItem Model Purpose

```
┌─────────────────────────────────────────────────────┐
│           PayrollLineItem Model                     │
├─────────────────────────────────────────────────────┤
│ Represents: Individual salary component in payroll  │
│                                                     │
│ Key Responsibilities:                               │
│  • Track each earning/deduction separately          │
│  • Store base and calculated amounts                │
│  • Record adjustments (pro-rata, etc.)              │
│  • Provide detailed payslip breakdown               │
│  • Enable component-level reporting                 │
│  • Support audit and reconciliation                 │
└─────────────────────────────────────────────────────┘
```

### Line Item Structure

```
EmployeePayroll: John Doe - January 2026
├── LineItem #1: Basic Salary
│   ├── Type: EARNING
│   ├── Base Amount: 150,000
│   ├── Adjustment: -27,273 (pro-rata)
│   └── Final Amount: 122,727
│
├── LineItem #2: Transport Allowance
│   ├── Type: EARNING
│   ├── Base Amount: 15,000
│   ├── Adjustment: 0
│   └── Final Amount: 15,000
│
├── LineItem #3: EPF Employee
│   ├── Type: DEDUCTION
│   ├── Base Amount: 13,200
│   ├── Adjustment: 0
│   └── Final Amount: 13,200
│
└── LineItem #4: PAYE Tax
    ├── Type: DEDUCTION
    ├── Base Amount: 5,500
    ├── Adjustment: 0
    └── Final Amount: 5,500
```

### Model Relationships

```
┌─────────────────┐         1:N          ┌──────────────────┐
│ EmployeePayroll │◄─────────────────────│ PayrollLineItem  │
└─────────────────┘                      └──────────────────┘
                                                  │
                                                  │ N:1
                                                  ▼
                                         ┌──────────────────┐
                                         │ SalaryComponent  │
                                         └──────────────────┘
```

### Line Item Benefits

```
Detailed Breakdown:
├── Transparency for employees
├── Clear payslip itemization
├── Component-level auditing
└── Regulatory compliance

Analysis Capabilities:
├── Track component costs over time
├── Identify high-cost components
├── Analyze deduction patterns
└── Compare actual vs. budgeted

Reconciliation:
├── Sum line items = employee total
├── Verify calculation accuracy
└── Audit trail for changes
```

### Expected Outcome
- PayrollLineItem model class created
- Proper inheritance from base mixins
- Model registered in package
- Foundation for line item tracking

### Verification Checklist
- [ ] payroll_line_item.py file created
- [ ] Required modules imported
- [ ] PayrollLineItem class defined
- [ ] Model docstring added
- [ ] Model imported in __init__.py

---

## Task 36: Add Line Item Fields

### Overview
Add the core fields to PayrollLineItem that link to parent records and store amount calculations. These fields capture the component reference, the calculated amounts, and descriptive information for payslip display.

### Dependencies
- Task 35: Create PayrollLineItem Model
- EmployeePayroll model exists
- SalaryComponent model exists

### Instructions

1. **Open payroll_line_item.py file**
   - Navigate to `apps/payroll/models/payroll_line_item.py`
   - Locate PayrollLineItem model class

2. **Import related models**
   - Import EmployeePayroll model
   - Import SalaryComponent model

3. **Add employee_payroll field**
   - ForeignKey to EmployeePayroll
   - Set on_delete=CASCADE
   - Set related_name='line_items'
   - Each line item belongs to one payroll

4. **Add component field**
   - ForeignKey to SalaryComponent
   - Set on_delete=PROTECT
   - Set related_name='payroll_line_items'
   - Links to salary component definition

5. **Add base_amount field**
   - DecimalField (12, 2)
   - Original component amount from salary structure
   - Before any adjustments
   - Default to 0.00

6. **Add calculated_amount field**
   - DecimalField (12, 2)
   - Amount after attendance-based calculations
   - Before pro-rata adjustments
   - Default to 0.00

7. **Add adjustment_amount field**
   - DecimalField (12, 2)
   - Pro-rata or other adjustments
   - Can be positive or negative
   - Default to 0.00

8. **Add final_amount field**
   - DecimalField (12, 2)
   - Final amount after all adjustments
   - This amount appears on payslip
   - Default to 0.00

9. **Add description field**
   - CharField max_length=200
   - Display name for payslip
   - May differ from component name
   - Optional, defaults to component name

10. **Add calculation_notes field**
    - JSONField
    - Stores calculation details
    - Useful for auditing
    - Default to empty dict

### Line Item Fields Structure

```
┌─────────────────────────────────────────────────────┐
│           PayrollLineItem Fields                    │
├─────────────────────────────────────────────────────┤
│ Relationships:                                      │
│  • employee_payroll: FK to EmployeePayroll          │
│  • component: FK to SalaryComponent                 │
│                                                     │
│ Amounts (Decimal 12.2):                             │
│  • base_amount: Original from salary structure      │
│  • calculated_amount: After calculations            │
│  • adjustment_amount: Pro-rata adjustments          │
│  • final_amount: Final payslip amount               │
│                                                     │
│ Display:                                            │
│  • description: CharField(200)                      │
│  • calculation_notes: JSONField                     │
└─────────────────────────────────────────────────────┘
```

### Amount Calculation Flow

```
Component: Basic Salary

Step 1: Base Amount
├── From salary structure: 150,000
└── base_amount = 150,000

Step 2: Calculated Amount
├── Attendance factor applied if variable
├── For basic (fixed): No change
└── calculated_amount = 150,000

Step 3: Adjustment Amount
├── Pro-rata for days worked
├── Days worked: 18/22 = 0.818
├── Adjustment: -27,273
└── adjustment_amount = -27,273

Step 4: Final Amount
├── calculated_amount + adjustment_amount
├── 150,000 - 27,273
└── final_amount = 122,727
```

### Example Line Items

```
Employee: John Doe
Period: January 2026
Days Worked: 18 / 22

LineItem #1 - Basic Salary (EARNING):
─────────────────────────────────────────────────────
base_amount:       150,000.00
calculated_amount: 150,000.00
adjustment_amount:  -27,273.00  (pro-rata)
final_amount:      122,727.00
description:       "Basic Salary"
notes: {
  "pro_rata_factor": 0.818,
  "days_worked": 18,
  "total_days": 22
}

LineItem #2 - Transport Allowance (EARNING):
─────────────────────────────────────────────────────
base_amount:        15,000.00
calculated_amount:  15,000.00
adjustment_amount:       0.00  (fixed allowance)
final_amount:       15,000.00
description:       "Transport Allowance"
notes: {"type": "fixed"}

LineItem #3 - Overtime (EARNING):
─────────────────────────────────────────────────────
base_amount:             0.00
calculated_amount:  15,980.00  (12.5 hrs × rate)
adjustment_amount:       0.00
final_amount:       15,980.00
description:       "Overtime Payment"
notes: {
  "hours": 12.5,
  "rate": 1278.41,
  "multiplier": 1.5
}

LineItem #4 - EPF Employee (DEDUCTION):
─────────────────────────────────────────────────────
base_amount:        13,200.00
calculated_amount:  13,200.00
adjustment_amount:       0.00
final_amount:       13,200.00
description:       "EPF Employee Contribution (8%)"
notes: {
  "epf_base": 165000,
  "rate": 0.08
}
```

### Calculation Notes JSON Structure

```json
{
  "calculation_type": "pro_rata",
  "pro_rata_factor": 0.818,
  "days_worked": 18,
  "total_working_days": 22,
  "original_amount": 150000,
  "adjustment": -27273,
  "timestamp": "2026-01-20T10:05:32Z"
}
```

### Query Examples

```
# Get all line items for employee payroll
payroll.line_items.all()

# Get earnings only
payroll.line_items.filter(
    component__component_type='EARNING'
)

# Get deductions only
payroll.line_items.filter(
    component__component_type='DEDUCTION'
)

# Sum earnings
total_earnings = payroll.line_items.filter(
    component__component_type='EARNING'
).aggregate(Sum('final_amount'))

# Get line item by component code
payroll.line_items.get(
    component__code='BASIC'
)
```

### Expected Outcome
- Complete line item field structure
- Amount tracking at each calculation stage
- Link to parent payroll and component
- Calculation transparency via notes

### Verification Checklist
- [ ] EmployeePayroll and SalaryComponent imported
- [ ] employee_payroll ForeignKey added
- [ ] component ForeignKey added
- [ ] base_amount Decimal field added
- [ ] calculated_amount Decimal field added
- [ ] adjustment_amount Decimal field added
- [ ] final_amount Decimal field added
- [ ] description CharField added
- [ ] calculation_notes JSONField added
- [ ] All Decimal fields (12,2) precision
- [ ] Defaults set appropriately

---

## Task 37: Add Line Item Type

### Overview
Add the line_type field to categorize line items as earnings, deductions, or employer contributions. This categorization enables proper grouping on payslips and supports correct calculation logic.

### Dependencies
- Task 36: Add Line Item Fields

### Instructions

1. **Define LineType choices**
   - Create tuple of type choices
   - EARNING: Adds to gross salary
   - DEDUCTION: Subtracts from gross
   - EMPLOYER_CONTRIBUTION: Employer cost, not on payslip
   - ADJUSTMENT: Pro-rata or other adjustments

2. **Add line_type field**
   - CharField with LineType choices
   - Required field (no null/blank)
   - Max length 30 characters
   - Copy from component.component_type

3. **Add ordering**
   - Update Meta class
   - Order by line_type then component

4. **Add __str__ method**
   - Return meaningful string representation
   - Include employee, component, amount

### LineType Choices

```
┌─────────────────────────────────────────────────────┐
│              Line Item Types                        │
├─────────────────────────────────────────────────────┤
│ EARNING                                             │
│  • Adds to gross salary                             │
│  • Basic, allowances, overtime, bonuses             │
│  • Appears in earnings section                      │
│                                                     │
│ DEDUCTION                                           │
│  • Subtracts from gross salary                      │
│  • EPF employee, PAYE, loans, advances              │
│  • Appears in deductions section                    │
│                                                     │
│ EMPLOYER_CONTRIBUTION                               │
│  • Employer cost, not affecting employee            │
│  • EPF employer, ETF                                │
│  • For company cost tracking only                   │
│                                                     │
│ ADJUSTMENT                                          │
│  • Pro-rata adjustments                             │
│  • Corrections                                      │
│  • Special purpose line items                       │
└─────────────────────────────────────────────────────┘
```

### Payslip Grouping

```
PAYSLIP - John Doe - January 2026
═════════════════════════════════════════════════════

EARNINGS                           Amount (LKR)
─────────────────────────────────────────────────────
Basic Salary                        122,727.00
Transport Allowance                  15,000.00
Mobile Allowance                      5,000.00
Overtime Payment                     15,980.00
─────────────────────────────────────────────────────
GROSS SALARY                        158,707.00

DEDUCTIONS
─────────────────────────────────────────────────────
EPF Employee Contribution (8%)       13,200.00
PAYE Tax                              5,500.00
Loan Repayment                       10,000.00
─────────────────────────────────────────────────────
TOTAL DEDUCTIONS                     28,700.00

═════════════════════════════════════════════════════
NET SALARY (Take Home)              130,007.00
═════════════════════════════════════════════════════

EMPLOYER CONTRIBUTIONS (For Information)
─────────────────────────────────────────────────────
EPF Employer (12%)                   19,800.00
ETF (3%)                              4,950.00
─────────────────────────────────────────────────────
```

### Type-Based Calculations

```
Calculate Gross:
Sum all line_type='EARNING' final_amounts

Calculate Total Deductions:
Sum all line_type='DEDUCTION' final_amounts

Calculate Net:
Gross - Total Deductions

Calculate Employer Cost:
Gross + Sum(line_type='EMPLOYER_CONTRIBUTION')
```

### Expected Outcome
- Line items properly categorized
- Payslip grouping enabled
- Calculation logic supported

### Verification Checklist
- [ ] LineType choices tuple defined
- [ ] line_type field added
- [ ] All four types defined
- [ ] Meta ordering updated
- [ ] __str__ method added

---

## Task 38: Run PayrollLineItem Migrations

### Overview
Generate and apply Django migrations for the PayrollLineItem model, creating the database table with all fields, constraints, and indexes.

### Dependencies
- Task 37: Add Line Item Type
- All PayrollLineItem fields completed

### Instructions

1. **Review model completeness**
   - Verify all fields present
   - Check Meta class configuration

2. **Generate migration file**
   - Run makemigrations for payroll app

3. **Review generated migration**
   - Verify all fields included
   - Check foreign keys

4. **Apply migration**
   - Run migrate command

5. **Verify migration**
   - Check table exists
   - Test model operations

### Expected Outcome
- Migration applied successfully
- Database table created
- Model ready for use

### Verification Checklist
- [ ] makemigrations executed
- [ ] Migration file created
- [ ] migrate executed
- [ ] Table verified
- [ ] Test creation successful

---

## Task 39: Create PayrollProcessor Service

### Overview
Create the PayrollProcessor service class that orchestrates the entire payroll calculation process. This service coordinates attendance fetching, component calculations, deduction processing, and employee payroll record creation. It serves as the main entry point for payroll processing operations.

### Dependencies
- Task 38: Run PayrollLineItem Migrations
- PayrollRun model exists
- EmployeePayroll model exists
- PayrollLineItem model exists

### Instructions

1. **Create services directory**
   - Navigate to `apps/payroll/`
   - Create `services/` directory if not exists
   - Create `__init__.py` in services directory

2. **Create payroll_processor.py file**
   - Create file in `services/` directory
   - This will contain PayrollProcessor class

3. **Import required modules**
   - Import Django ORM and database utilities
   - Import payroll models
   - Import Employee model
   - Import datetime utilities
   - Import Decimal for calculations

4. **Define PayrollProcessor class**
   - Service class (not a Django model)
   - Contains processing logic methods
   - Add comprehensive class docstring

5. **Add initialization method**
   - Constructor accepts optional parameters
   - Initialize instance variables
   - Set up logging

6. **Define main processing method**
   - process_period(period_id) method
   - Entry point for processing
   - Returns PayrollRun instance

7. **Add method stubs**
   - Stub methods for implementation in later tasks
   - get_eligible_employees
   - fetch_attendance_data
   - calculate_working_days
   - calculate_overtime
   - calculate_pro_rata
   - calculate_earnings
   - calculate_deductions
   - process_employee
   - process_batch

8. **Update services __init__.py**
   - Import PayrollProcessor
   - Add to __all__ list

### PayrollProcessor Service Structure

```
┌─────────────────────────────────────────────────────┐
│           PayrollProcessor Service                  │
├─────────────────────────────────────────────────────┤
│ Purpose: Orchestrate payroll calculation process    │
│                                                     │
│ Main Methods:                                       │
│  • process_period(period_id)                        │
│    - Entry point for processing                     │
│    - Creates PayrollRun                             │
│    - Processes all eligible employees               │
│                                                     │
│  • get_eligible_employees(period)                   │
│    - Query active employees                         │
│    - Filter by employment dates                     │
│                                                     │
│  • fetch_attendance_data(employee, period)          │
│    - Retrieve attendance records                    │
│    - Calculate totals                               │
│                                                     │
│  • calculate_working_days(attendance)               │
│    - Count actual working days                      │
│    - Exclude weekends, holidays                     │
│                                                     │
│  • process_employee(employee, period, run)          │
│    - Calculate single employee payroll              │
│    - Create EmployeePayroll record                  │
│    - Create line items                              │
│                                                     │
│  • process_batch(employees, period, run)            │
│    - Process multiple employees                     │
│    - Handle errors gracefully                       │
│    - Update run totals                              │
└─────────────────────────────────────────────────────┘
```

### Processing Workflow

```
1. process_period(period_id)
   ├── Validate period exists and is open
   ├── Create PayrollRun record
   ├── Update status to PROCESSING
   │
   ├── 2. get_eligible_employees(period)
   │   ├── Query active employees
   │   ├── Filter by employment dates
   │   └── Return employee list
   │
   ├── 3. For each employee:
   │   ├── fetch_attendance_data(employee, period)
   │   ├── calculate_working_days(attendance)
   │   ├── calculate_overtime(attendance)
   │   ├── calculate_earnings(employee, attendance)
   │   ├── calculate_deductions(gross, employee)
   │   ├── create_employee_payroll(...)
   │   └── create_line_items(...)
   │
   ├── 4. Update run totals
   │   ├── Sum all employee payrolls
   │   ├── Update total_gross, total_net, etc.
   │   └── Set error_count
   │
   └── 5. Finalize
       ├── Update status to PROCESSED or FAILED
       ├── Set completed_at timestamp
       └── Return PayrollRun
```

### Service Class Pattern

```
class PayrollProcessor:
    """
    Service class for processing payroll calculations.
    
    Handles the complete payroll processing workflow including:
    - Employee eligibility determination
    - Attendance data retrieval
    - Salary calculations
    - Deduction processing
    - Record creation
    """
    
    def __init__(self, user=None):
        Initialize processor with optional user
        
    def process_period(self, period_id):
        Main entry point for processing
        
    def get_eligible_employees(self, period):
        Query and return eligible employees
        
    # Additional methods...
```

### Error Handling Strategy

```
Try-Catch at Employee Level:
├── Process each employee in try block
├── Catch exceptions per employee
├── Log error details
├── Continue with next employee
├── Don't fail entire batch
└── Return error summary

Error Information Captured:
├── Employee ID and name
├── Error type and message
├── Stack trace
├── Timestamp
└── Processing step where error occurred
```

### Expected Outcome
- PayrollProcessor service class created
- Method structure defined
- Processing workflow established
- Foundation for calculation logic

### Verification Checklist
- [ ] services/ directory created
- [ ] payroll_processor.py file created
- [ ] PayrollProcessor class defined
- [ ] __init__ method implemented
- [ ] process_period method stub created
- [ ] Helper method stubs created
- [ ] Class docstring comprehensive
- [ ] Service imported in __init__.py

---

## Task 40: Implement Get Eligible Employees

### Overview
Implement the get_eligible_employees method that queries and returns all employees eligible for payroll processing in the given period. This method filters employees based on status, employment dates, and salary configuration to ensure only valid employees are processed.

### Dependencies
- Task 39: Create PayrollProcessor Service
- Employee model with status field
- EmployeeSalary model with is_current flag

### Instructions

1. **Open payroll_processor.py file**
   - Navigate to `apps/payroll/services/payroll_processor.py`
   - Locate get_eligible_employees method stub

2. **Implement eligibility query**
   - Query employees with status=ACTIVE
   - Filter by employment_date <= period.end_date
   - Exclude if termination_date <= period.start_date
   - Ensure employee has current salary (is_current=True)

3. **Add optimization**
   - Use select_related for salary
   - Prefetch related data if needed
   - Optimize query performance

4. **Add validation**
   - Check if period is valid
   - Verify tenant context
   - Return empty queryset if invalid

5. **Add logging**
   - Log employee count found
   - Log any exclusions
   - Aid debugging

### Eligibility Criteria

```
┌─────────────────────────────────────────────────────┐
│          Employee Eligibility Criteria              │
├─────────────────────────────────────────────────────┤
│ Must Meet ALL Conditions:                           │
│                                                     │
│ 1. Employment Status                                │
│    • status = ACTIVE                                │
│    • Not TERMINATED, SUSPENDED, etc.                │
│                                                     │
│ 2. Employment Dates                                 │
│    • employment_date <= period.end_date             │
│    • Employed during or before period               │
│                                                     │
│ 3. Termination Check                                │
│    • termination_date IS NULL OR                    │
│    • termination_date > period.start_date           │
│    • Still employed during period                   │
│                                                     │
│ 4. Salary Configuration                             │
│    • Has EmployeeSalary record                      │
│    • is_current = True                              │
│    • Active salary structure exists                 │
│                                                     │
│ 5. Tenant Match                                     │
│    • employee.tenant = current_tenant               │
└─────────────────────────────────────────────────────┘
```

### Query Logic

```
Eligible Employees Query:

employees = Employee.objects.filter(
    tenant=tenant,
    status='ACTIVE',
    employment_date__lte=period.end_date
).filter(
    Q(termination_date__isnull=True) |
    Q(termination_date__gt=period.start_date)
).filter(
    employee_salaries__is_current=True
).select_related(
    'employee_salaries',
    'department',
    'position'
).distinct()
```

### Eligibility Examples

```
Period: January 2026 (2026-01-01 to 2026-01-31)

Employee A - John Doe
├── Status: ACTIVE ✓
├── Employment Date: 2025-06-01 ✓
├── Termination Date: NULL ✓
├── Current Salary: Yes ✓
└── Eligible: YES

Employee B - Jane Smith
├── Status: ACTIVE ✓
├── Employment Date: 2026-01-15 ✓
├── Termination Date: NULL ✓
├── Current Salary: Yes ✓
└── Eligible: YES (pro-rata from Jan 15)

Employee C - Bob Wilson
├── Status: TERMINATED ✗
├── Employment Date: 2024-01-01
├── Termination Date: 2025-12-31 ✗
├── Current Salary: No ✗
└── Eligible: NO (terminated before period)

Employee D - Alice Brown
├── Status: ACTIVE ✓
├── Employment Date: 2025-08-01 ✓
├── Termination Date: 2026-01-15 ✗
├── Current Salary: Yes ✓
└── Eligible: YES (pro-rata until Jan 15)

Employee E - Charlie Davis
├── Status: ACTIVE ✓
├── Employment Date: 2026-02-01 ✗
├── Termination Date: NULL ✓
├── Current Salary: Yes ✓
└── Eligible: NO (not employed during period)

Employee F - Diana Evans
├── Status: ACTIVE ✓
├── Employment Date: 2025-03-01 ✓
├── Termination Date: NULL ✓
├── Current Salary: No ✗
└── Eligible: NO (no salary configuration)
```

### Edge Cases

```
Mid-Month Joiners:
├── Employment date during period
├── Still eligible
└── Pro-rata calculation applied

Mid-Month Leavers:
├── Termination date during period
├── Still eligible
└── Pro-rata until termination

Salary Changes:
├── Multiple salary records
├── Use is_current=True
└── Snapshot taken at processing time

On-Hold Employees:
├── Status might be ON_HOLD
├── Check if should be included
└── May need custom logic
```

### Expected Outcome
- Accurate employee eligibility determination
- Optimized query performance
- Proper handling of edge cases
- Foundation for processing loop

### Verification Checklist
- [ ] get_eligible_employees method implemented
- [ ] Status filter applied (ACTIVE)
- [ ] Employment date filter applied
- [ ] Termination date filter applied
- [ ] Current salary filter applied
- [ ] Tenant filter applied
- [ ] select_related optimization used
- [ ] distinct() called if needed
- [ ] Logging added
- [ ] Edge cases handled

---

## Task 41: Implement Fetch Attendance Data

### Overview
Implement the fetch_attendance_data method that retrieves attendance records for an employee within the payroll period. This method aggregates daily attendance data including presence, absences, leave, and overtime hours.

### Dependencies
- Task 40: Implement Get Eligible Employees
- Attendance model exists from HR module
- Leave model exists from HR module

### Instructions

1. **Open payroll_processor.py file**
   - Locate fetch_attendance_data method stub

2. **Import attendance models**
   - Import Attendance model
   - Import Leave model
   - Import overtime calculations

3. **Implement attendance query**
   - Query attendance records for employee
   - Filter by date range (period.start_date to period.end_date)
   - Include related data

4. **Calculate attendance totals**
   - Count present days
   - Count absent days (with leave)
   - Count unpaid leave days
   - Sum overtime hours
   - Count late arrivals

5. **Handle leave records**
   - Query approved leave for period
   - Categorize leave types
   - Determine if paid or unpaid

6. **Return attendance data structure**
   - Return dictionary with all totals
   - Include breakdown details
   - Provide calculation notes

### Attendance Data Structure

```
Attendance Data Dictionary:
{
  "employee_id": "uuid",
  "period_start": "2026-01-01",
  "period_end": "2026-01-31",
  "total_working_days": 22,
  "days_present": 18,
  "days_absent": 2,
  "unpaid_leave_days": 2,
  "overtime_hours": 12.5,
  "late_arrivals": 3,
  "early_departures": 1,
  "leave_breakdown": {
    "sick_leave": 2,
    "casual_leave": 0,
    "annual_leave": 0,
    "no_pay_leave": 2
  },
  "overtime_breakdown": [
    {"date": "2026-01-05", "hours": 2.5},
    {"date": "2026-01-12", "hours": 3.0},
    {"date": "2026-01-19", "hours": 4.0},
    {"date": "2026-01-26", "hours": 3.0}
  ]
}
```

### Attendance Query Logic

```
Query Attendance Records:

attendance_records = Attendance.objects.filter(
    employee=employee,
    date__gte=period.start_date,
    date__lte=period.end_date,
    tenant=tenant
).select_related('employee')

For each record:
├── If status = PRESENT: days_present += 1
├── If status = ABSENT: days_absent += 1
├── If overtime_hours > 0: total_overtime += hours
└── If late_minutes > 0: late_count += 1
```

### Leave Integration

```
Query Leave Records:

leave_records = Leave.objects.filter(
    employee=employee,
    status='APPROVED',
    tenant=tenant
).filter(
    # Overlaps with period
    Q(start_date__lte=period.end_date) &
    Q(end_date__gte=period.start_date)
)

For each leave:
├── Calculate days in period
├── Check leave type
├── If paid_leave: days_absent += days
└── If unpaid_leave: unpaid_leave_days += days
```

### Expected Outcome
- Attendance data retrieved and aggregated
- Leave records integrated
- Overtime hours summed
- Complete data structure returned

### Verification Checklist
- [ ] fetch_attendance_data method implemented
- [ ] Attendance model imported
- [ ] Leave model imported
- [ ] Attendance query correct
- [ ] Leave query correct
- [ ] Days present counted
- [ ] Days absent counted
- [ ] Unpaid leave tracked
- [ ] Overtime hours summed
- [ ] Late arrivals counted
- [ ] Data dictionary returned

---

## Task 42: Implement Calculate Working Days

### Overview
Implement the calculate_working_days method that determines the actual number of working days in the period, excluding weekends and public holidays. This count is used for pro-rata salary calculations.

### Dependencies
- Task 41: Implement Fetch Attendance Data
- PublicHoliday model exists

### Instructions

1. **Open payroll_processor.py file**
   - Locate calculate_working_days method stub

2. **Import required utilities**
   - Import date utilities
   - Import PublicHoliday model
   - Import workday calculations

3. **Implement working days calculation**
   - Iterate through all dates in period
   - Exclude Saturdays and Sundays
   - Exclude public holidays
   - Count remaining days

4. **Query public holidays**
   - Get holidays for date range
   - Filter by tenant
   - Cache for performance

5. **Return working days count**
   - Return integer count
   - Include calculation notes

### Working Days Calculation Logic

```
Calculate Working Days:

For date in range(period.start_date, period.end_date + 1):
    ├── If weekday() in [5, 6]: Continue (weekend)
    ├── If date in public_holidays: Continue
    └── Else: working_days += 1

Return working_days
```

### Example Calculation

```
Period: January 2026
Total Days: 31

Weekends (Saturdays & Sundays):
├── 4 Saturdays: 4, 11, 18, 25
├── 4 Sundays: 5, 12, 19, 26
└── Total: 8 days

Public Holidays:
├── January 1: New Year's Day
└── Total: 1 day

Working Days:
31 - 8 - 1 = 22 working days
```

### Expected Outcome
- Accurate working day count
- Weekend exclusion
- Holiday exclusion
- Pro-rata base established

### Verification Checklist
- [ ] calculate_working_days method implemented
- [ ] Date iteration correct
- [ ] Weekend check implemented
- [ ] Holiday query implemented
- [ ] Count returned correctly

---

## Summary

This document established the PayrollLineItem model and initial processor components.

### Key Achievements
- PayrollLineItem model with amount tracking
- Line type categorization
- PayrollProcessor service class
- Employee eligibility logic
- Attendance data integration
- Working days calculation

### Next Steps
Proceed to [02_Tasks-43-52_Calculations-Batch.md](02_Tasks-43-52_Calculations-Batch.md) for calculation implementations.

---

**Document Status:** ✅ Complete  
**Total Tasks:** 8  
**Estimated Time:** 175 minutes
