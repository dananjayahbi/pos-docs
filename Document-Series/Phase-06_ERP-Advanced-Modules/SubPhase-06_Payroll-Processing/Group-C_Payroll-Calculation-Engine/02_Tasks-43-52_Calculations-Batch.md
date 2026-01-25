# Tasks 43-52: Calculations and Batch Processing

> **Phase:** 06 - ERP Advanced Modules  
> **SubPhase:** 06 - Payroll Processing  
> **Group:** C - Payroll Calculation Engine  
> **Document:** 02 of 02  
> **Tasks Covered:** 43, 44, 45, 46, 47, 48, 49, 50, 51, 52

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [01_Tasks-35-42_LineItem-Attendance.md](01_Tasks-35-42_LineItem-Attendance.md)

---

## Document Overview

This document covers payroll calculations including overtime, unpaid leave, pro-rata adjustments, earnings and deductions processing, gross and net calculations, batch processing, async task implementation, and progress tracking.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
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

## Task 43: Implement Calculate Overtime

### Overview
Add overtime calculation method to PayrollProcessor service. Calculate overtime pay based on hours worked and hourly rate derived from basic salary.

### Dependencies
- Task 42 completed (Calculate Working Days method exists)
- PayrollProcessor service exists
- Attendance data includes overtime_hours field

### Instructions

1. **Add calculate_overtime method to PayrollProcessor**
   - Create method in `services/payroll_processor.py`
   - Accept attendance data and basic salary as parameters
   - Return calculated overtime amount

2. **Extract overtime hours from attendance**
   - Read total overtime hours from attendance data
   - Handle cases where overtime_hours is null or zero

3. **Calculate hourly rate**
   - Derive from basic salary: basic / 22 working days / 8 hours
   - Apply overtime multiplier (typically 1.5x)
   - Use Decimal for precision

4. **Calculate overtime amount**
   - Multiply overtime hours by overtime rate
   - Round to 2 decimal places
   - Return amount

5. **Handle edge cases**
   - Zero overtime hours returns zero
   - Validate overtime hours not negative
   - Cap overtime at maximum allowed (if policy exists)

### Calculation Formula

```
Hourly Rate = Basic Salary ÷ 22 days ÷ 8 hours
Overtime Rate = Hourly Rate × 1.5
Overtime Amount = Overtime Hours × Overtime Rate
```

### Expected Outcome
- Method calculates overtime pay accurately
- Returns Decimal value with 2 decimal places
- Handles edge cases gracefully

### Verification Checklist
- [ ] calculate_overtime method created in PayrollProcessor
- [ ] Accepts attendance and basic salary parameters
- [ ] Calculates hourly rate correctly
- [ ] Applies overtime multiplier
- [ ] Returns Decimal amount
- [ ] Handles zero overtime hours
- [ ] Validates input data

---

## Task 44: Implement Calculate Unpaid Leave

### Overview
Add method to calculate unpaid leave deductions based on leave records within the payroll period.

### Dependencies
- Task 42 completed
- Leave management module accessible
- Leave types configured (PAID vs UNPAID)

### Instructions

1. **Add calculate_unpaid_leave method**
   - Create in PayrollProcessor service
   - Accept employee ID and period dates
   - Query leave records

2. **Query unpaid leave records**
   - Filter leaves by employee and date range
   - Filter by leave_type with is_paid=False
   - Filter by status=APPROVED
   - Calculate total days

3. **Calculate per-day salary**
   - Use basic salary or configured salary base
   - Divide by total working days in period
   - Use Decimal precision

4. **Calculate deduction amount**
   - Multiply unpaid leave days by per-day salary
   - Include applicable allowances (if policy requires)
   - Return total deduction

5. **Handle overlapping leaves**
   - Ensure no double-counting of days
   - Handle partial day leaves correctly

### Calculation Formula

```
Per-Day Salary = Basic Salary ÷ Total Working Days
Unpaid Leave Deduction = Unpaid Days × Per-Day Salary
```

### Expected Outcome
- Method calculates unpaid leave deduction accurately
- Queries only approved unpaid leaves
- Returns deduction amount

### Verification Checklist
- [ ] calculate_unpaid_leave method created
- [ ] Queries leave records correctly
- [ ] Filters unpaid leave types
- [ ] Filters approved leaves only
- [ ] Calculates per-day salary
- [ ] Returns deduction amount
- [ ] Handles zero unpaid days

---

## Task 45: Implement Calculate Basic Pro-Rata

### Overview
Implement pro-rata basic salary calculation based on actual days worked versus total working days in the period.

### Dependencies
- Task 42 completed (working days calculation)
- Basic salary available from salary structure

### Instructions

1. **Add calculate_basic_pro_rata method**
   - Create in PayrollProcessor service
   - Accept basic salary, days worked, total working days
   - Return pro-rated amount

2. **Calculate pro-rata factor**
   - Factor = Days Worked ÷ Total Working Days
   - Handle full month (factor = 1.0)
   - Use Decimal for precision

3. **Apply pro-rata to basic salary**
   - Pro-Rata Basic = Basic Salary × Pro-Rata Factor
   - Round to 2 decimal places
   - Ensure never exceeds original basic

4. **Handle mid-month joining**
   - Calculate from employment_date if after period start
   - Adjust total working days accordingly

5. **Handle mid-month termination**
   - Calculate to termination_date if before period end
   - Pro-rate based on actual eligible days

6. **Store pro-rata information**
   - Record factor in calculation notes
   - Track original vs pro-rated amounts
   - Create PayrollLineItem with adjustment details

### Calculation Formula

```
Pro-Rata Factor = Days Worked ÷ Total Working Days
Pro-Rata Basic = Basic Salary × Pro-Rata Factor
```

### Example Scenarios

| Scenario | Basic | Days Worked | Total Days | Factor | Pro-Rata Basic |
|----------|-------|-------------|------------|--------|----------------|
| Full month | 150,000 | 22 | 22 | 1.0 | 150,000 |
| 2 days absent | 150,000 | 20 | 22 | 0.909 | 136,350 |
| Mid-month join | 150,000 | 10 | 22 | 0.455 | 68,250 |

### Expected Outcome
- Pro-rata calculation accurate for various scenarios
- Factor calculated correctly
- Returns adjusted basic salary

### Verification Checklist
- [ ] calculate_basic_pro_rata method created
- [ ] Calculates pro-rata factor correctly
- [ ] Applies factor to basic salary
- [ ] Handles full month (no adjustment)
- [ ] Handles mid-month joining
- [ ] Handles mid-month termination
- [ ] Returns Decimal amount
- [ ] Stores calculation notes

---

## Task 46: Implement Calculate Earnings

### Overview
Implement comprehensive earnings calculation processing all earning components from employee's salary structure with appropriate adjustments.

### Dependencies
- Task 45 completed (pro-rata calculation)
- Task 43 completed (overtime calculation)
- SalaryComponent model accessible

### Instructions

1. **Add calculate_earnings method**
   - Create in PayrollProcessor service
   - Accept employee, salary structure, attendance data
   - Process all earning components
   - Return list of line items

2. **Retrieve earning components**
   - Query SalaryComponent where component_type=EARNING
   - Filter by employee's salary structure
   - Order by sequence or priority

3. **Process basic salary component**
   - Apply pro-rata calculation
   - Create PayrollLineItem with adjustment details
   - Set line_type=EARNING

4. **Process fixed allowances**
   - Check if allowance is pro-ratable
   - Apply pro-rata factor if applicable
   - Full amount if not pro-ratable

5. **Process variable allowances**
   - Calculate based on attendance or performance
   - Apply calculation rules from component definition
   - Use attendance data for calculation

6. **Add overtime earnings**
   - Calculate overtime amount
   - Create line item for overtime
   - Link to attendance data

7. **Process conditional earnings**
   - Check eligibility criteria
   - Apply only if conditions met
   - Document reason in line item

8. **Calculate EPF-applicable earnings**
   - Sum components marked as epf_applicable
   - Store epf_base for EPF calculation
   - Separate from non-EPF earnings

9. **Create line items for each earning**
   - Set employee_payroll FK
   - Set component FK
   - Set amounts (base, calculated, final)
   - Add calculation notes

### Earnings Processing Logic

```
For each EARNING component:
  - Get base amount from salary structure
  - Apply pro-rata if is_pro_ratable=True
  - Apply calculation formula if variable
  - Check eligibility conditions
  - Create PayrollLineItem
  - Track EPF applicability
```

### Component Processing

| Component | Pro-Rata | Calculation | EPF Applicable |
|-----------|----------|-------------|----------------|
| Basic Salary | Yes | Days worked based | Yes |
| Fixed Allowance | Per policy | Fixed amount | Per configuration |
| Transport | No | Fixed amount | No |
| Mobile | No | Fixed amount | No |
| Performance | No | Formula-based | Yes |
| Overtime | No | Hours × rate | Per policy |

### Expected Outcome
- All earning components processed
- Line items created for each earning
- Pro-rata applied correctly
- EPF base calculated

### Verification Checklist
- [ ] calculate_earnings method created
- [ ] Retrieves earning components
- [ ] Processes basic salary with pro-rata
- [ ] Processes fixed allowances
- [ ] Processes variable allowances
- [ ] Adds overtime earnings
- [ ] Checks eligibility conditions
- [ ] Calculates EPF base
- [ ] Creates PayrollLineItem records
- [ ] Returns line items list

---

## Task 47: Implement Calculate Deductions

### Overview
Implement deductions calculation processing all deduction components including EPF employee contribution, tax withholding, loans, and other deductions.

### Dependencies
- Task 46 completed (earnings calculated)
- Loan management module accessible
- Tax calculation service available

### Instructions

1. **Add calculate_deductions method**
   - Create in PayrollProcessor service
   - Accept employee, gross salary, EPF base
   - Process all deduction components
   - Return list of deduction line items

2. **Retrieve deduction components**
   - Query SalaryComponent where component_type=DEDUCTION
   - Filter by employee's salary structure
   - Include employee-specific deductions

3. **Calculate EPF employee contribution**
   - EPF Employee = EPF Base × 8%
   - Create line item for EPF deduction
   - Mark as statutory deduction

4. **Calculate PAYE tax**
   - Calculate taxable income
   - Apply tax slabs
   - Consider exemptions and reliefs
   - Create line item for PAYE

5. **Process loan deductions**
   - Query active loans for employee
   - Calculate installment amount due
   - Check if loan is in repayment period
   - Create line item for each loan

6. **Process other deductions**
   - Insurance premiums
   - Advance salary recovery
   - Disciplinary fines
   - Other configured deductions

7. **Apply deduction rules**
   - Check priority/sequence
   - Apply caps or limits
   - Ensure net salary minimum (if policy exists)

8. **Calculate total deductions**
   - Sum all deduction line items
   - Validate total doesn't exceed gross
   - Return deduction line items

9. **Create deduction line items**
   - Set employee_payroll FK
   - Set component FK (if applicable)
   - Set amounts and descriptions
   - Add calculation notes

### Deductions Processing Logic

```
For each DEDUCTION component:
  - Check if applicable to employee
  - Calculate deduction amount
  - Apply caps or limits
  - Check minimum net salary
  - Create PayrollLineItem
```

### Deduction Types

| Deduction | Calculation | Mandatory | Cap |
|-----------|-------------|-----------|-----|
| EPF Employee | EPF Base × 8% | Yes | None |
| PAYE Tax | Tax slabs | Yes | None |
| Loan Repayment | Fixed installment | Yes | Loan amount |
| Insurance | Fixed premium | Per contract | None |
| Advance Recovery | Fixed or % | No | Balance |
| Welfare Fund | Fixed amount | Per policy | Monthly cap |

### Expected Outcome
- All deductions calculated accurately
- EPF and PAYE calculated correctly
- Loan deductions applied
- Line items created

### Verification Checklist
- [ ] calculate_deductions method created
- [ ] Retrieves deduction components
- [ ] Calculates EPF employee (8%)
- [ ] Calculates PAYE tax
- [ ] Processes loan deductions
- [ ] Processes other deductions
- [ ] Applies deduction rules
- [ ] Creates PayrollLineItem records
- [ ] Returns deductions list
- [ ] Validates total deductions

---

## Task 48: Implement Calculate Gross

### Overview
Calculate gross salary by summing all earning line items.

### Dependencies
- Task 46 completed (earnings calculation)

### Instructions

1. **Add calculate_gross method**
   - Create in PayrollProcessor service
   - Accept list of earning line items
   - Return total gross amount

2. **Sum earning line items**
   - Iterate through all EARNING type line items
   - Sum final_amount field
   - Use Decimal precision

3. **Validate gross amount**
   - Ensure gross is positive
   - Check if within expected range
   - Log if significantly different from previous period

4. **Store gross salary**
   - Update EmployeePayroll.gross_salary field
   - Record calculation timestamp

### Calculation Formula

```
Gross Salary = Sum of all EARNING line items
```

### Expected Outcome
- Gross salary calculated accurately
- Sum of all earnings
- Stored in EmployeePayroll record

### Verification Checklist
- [ ] calculate_gross method created
- [ ] Sums all earning line items
- [ ] Returns Decimal amount
- [ ] Updates EmployeePayroll.gross_salary
- [ ] Validates gross amount
- [ ] Uses Decimal precision

---

## Task 49: Implement Calculate Net

### Overview
Calculate net salary by subtracting total deductions from gross salary.

### Dependencies
- Task 48 completed (gross calculation)
- Task 47 completed (deductions calculation)

### Instructions

1. **Add calculate_net method**
   - Create in PayrollProcessor service
   - Accept gross amount and deduction line items
   - Return net salary amount

2. **Sum all deductions**
   - Iterate through all DEDUCTION type line items
   - Sum final_amount field
   - Use Decimal precision

3. **Calculate net salary**
   - Net = Gross - Total Deductions
   - Ensure net is not negative
   - Round to 2 decimal places

4. **Apply minimum net salary policy**
   - Check if company has minimum net policy
   - Adjust deductions if net below minimum
   - Document adjustment in notes

5. **Store net salary**
   - Update EmployeePayroll.net_salary field
   - Update EmployeePayroll.total_deductions field
   - Record calculation timestamp

### Calculation Formula

```
Total Deductions = Sum of all DEDUCTION line items
Net Salary = Gross Salary - Total Deductions
```

### Expected Outcome
- Net salary calculated correctly
- Deductions subtracted from gross
- Stored in EmployeePayroll record

### Verification Checklist
- [ ] calculate_net method created
- [ ] Sums all deduction line items
- [ ] Calculates net = gross - deductions
- [ ] Validates net not negative
- [ ] Applies minimum net policy if exists
- [ ] Updates EmployeePayroll fields
- [ ] Returns Decimal amount

---

## Task 50: Create Batch Processing

### Overview
Implement batch processing to process payroll for all eligible employees in a payroll period.

### Dependencies
- Tasks 40-49 completed (all calculation methods)
- PayrollRun model exists

### Instructions

1. **Add process_period method**
   - Main entry point for batch processing
   - Accept period_id
   - Create PayrollRun record
   - Process all employees

2. **Create PayrollRun record**
   - Link to PayrollPeriod
   - Set run_number (auto-increment)
   - Set status to PROCESSING
   - Record started_at timestamp

3. **Get eligible employees**
   - Call get_eligible_employees method
   - Filter active employees with current salary
   - Order by employee_id or department

4. **Add process_employee method**
   - Process single employee
   - Wrap in database transaction
   - Handle errors gracefully
   - Return processing result

5. **Process employee workflow**
   - Create EmployeePayroll record
   - Fetch attendance data
   - Calculate working days
   - Calculate overtime
   - Calculate unpaid leave
   - Calculate pro-rata basic
   - Calculate earnings
   - Calculate deductions
   - Calculate gross
   - Calculate net
   - Save EmployeePayroll
   - Return success/failure

6. **Implement error handling**
   - Catch exceptions per employee
   - Log error with employee details
   - Continue processing remaining employees
   - Don't fail entire batch for one error

7. **Track processing statistics**
   - Count total employees
   - Count processed successfully
   - Count errors
   - Calculate totals (gross, net, deductions)

8. **Update PayrollRun status**
   - After all employees processed
   - Set status to PROCESSED or ERROR
   - Set completed_at timestamp
   - Save totals and counts

9. **Add process_batch method**
   - Process list of employees
   - Call process_employee for each
   - Update progress periodically
   - Return batch results

### Processing Workflow

```
process_period(period_id):
  1. Create PayrollRun
  2. Get eligible employees
  3. For each employee:
     - Start transaction
     - Create EmployeePayroll
     - Fetch attendance
     - Calculate all components
     - Save results
     - Commit transaction
     - Handle errors
  4. Update PayrollRun totals
  5. Update status to PROCESSED
```

### Transaction Handling

Each employee processed in atomic transaction:
- If employee fails, transaction rolled back
- Other employees continue processing
- Errors logged for review
- Partial success possible

### Expected Outcome
- Batch processing processes all employees
- Each employee in separate transaction
- Errors handled gracefully
- Progress tracked

### Verification Checklist
- [ ] process_period method created
- [ ] Creates PayrollRun record
- [ ] Gets eligible employees
- [ ] process_employee method created
- [ ] Each employee in transaction
- [ ] Calls all calculation methods
- [ ] Handles errors per employee
- [ ] Updates processing statistics
- [ ] Updates PayrollRun status
- [ ] process_batch method created
- [ ] Returns processing results

---

## Task 51: Create Processing Celery Task

### Overview
Create asynchronous Celery task for payroll processing to handle long-running operations without blocking the web server.

### Dependencies
- Task 50 completed (batch processing)
- Celery configured in project
- Redis/RabbitMQ running

### Instructions

1. **Create tasks module**
   - Create `tasks/` directory in payroll app
   - Create `__init__.py`
   - Create `processing_tasks.py`

2. **Define process_payroll_task**
   - Use @shared_task decorator
   - Set bind=True to access task instance
   - Accept period_id parameter
   - Call PayrollProcessor.process_period

3. **Add task metadata**
   - Set task name
   - Set time_limit (e.g., 3600 seconds)
   - Set soft_time_limit
   - Configure retry policy

4. **Implement task workflow**
   - Update PayrollRun status to PROCESSING
   - Call process_period method
   - Update status to PROCESSED on success
   - Update status to ERROR on failure
   - Return processing results

5. **Add error handling**
   - Catch exceptions
   - Log errors
   - Update PayrollRun with error details
   - Optionally retry on failure

6. **Update PayrollProcessor**
   - Modify process_period to be task-compatible
   - Update progress to Redis
   - Send status updates

7. **Add task trigger in service**
   - Create method to start async processing
   - Call task.delay(period_id)
   - Return task_id for status tracking

8. **Configure task routing**
   - Route payroll tasks to specific queue
   - Set worker concurrency
   - Configure task result backend

### Task Implementation Structure

```
@shared_task(bind=True, name='payroll.process_period')
def process_payroll_task(self, period_id):
    # Update status to PROCESSING
    # Call PayrollProcessor.process_period
    # Update progress to Redis
    # Update status on completion
    # Return results
```

### Task Configuration

| Setting | Value |
|---------|-------|
| time_limit | 3600 (1 hour) |
| soft_time_limit | 3300 (55 min) |
| max_retries | 3 |
| default_retry_delay | 300 (5 min) |

### Expected Outcome
- Celery task processes payroll asynchronously
- Web requests don't block
- Task can be monitored
- Errors handled gracefully

### Verification Checklist
- [ ] tasks/ directory created
- [ ] processing_tasks.py created
- [ ] process_payroll_task defined
- [ ] Uses @shared_task decorator
- [ ] Sets bind=True
- [ ] Accepts period_id parameter
- [ ] Calls PayrollProcessor.process_period
- [ ] Updates PayrollRun status
- [ ] Handles errors
- [ ] Returns processing results
- [ ] Task routing configured

---

## Task 52: Add Progress Tracking

### Overview
Implement real-time progress tracking for payroll processing using Redis to enable clients to monitor processing status.

### Dependencies
- Task 51 completed (Celery task)
- Redis configured
- Task 50 completed (batch processing)

### Instructions

1. **Add progress tracking to PayrollProcessor**
   - Import Redis client
   - Add update_progress method
   - Call during batch processing

2. **Create progress key structure**
   - Use key pattern: `payroll:progress:{run_id}`
   - Store progress data as JSON
   - Set expiration (e.g., 24 hours)

3. **Define progress data structure**
   - total_employees: Total count
   - processed: Number processed
   - success_count: Successful
   - error_count: Failed
   - current_employee: Currently processing
   - percentage: Completion percentage
   - started_at: Start timestamp
   - estimated_completion: Estimated time

4. **Update progress during processing**
   - Initialize progress at start
   - Update after each employee
   - Update percentage
   - Update current employee

5. **Add progress retrieval method**
   - Create get_processing_progress method
   - Accept run_id parameter
   - Retrieve from Redis
   - Return progress data

6. **Handle progress expiration**
   - Set TTL on progress keys
   - Clean up completed progress data
   - Archive to database if needed

7. **Add progress to Celery task**
   - Update progress in process_payroll_task
   - Call update_progress periodically
   - Clear progress on completion

8. **Create progress API endpoint**
   - Add endpoint to retrieve progress
   - Accept run_id parameter
   - Return progress JSON

### Progress Data Structure

```json
{
  "run_id": "uuid",
  "status": "PROCESSING",
  "total_employees": 50,
  "processed": 35,
  "success_count": 33,
  "error_count": 2,
  "percentage": 70,
  "current_employee": "EMP-0036",
  "started_at": "2026-01-20T10:00:00Z",
  "estimated_completion": "2026-01-20T10:15:00Z"
}
```

### Redis Key Operations

```
SET: payroll:progress:{run_id} = JSON data
EXPIRE: payroll:progress:{run_id} = 86400 (24 hours)
GET: payroll:progress:{run_id}
DEL: payroll:progress:{run_id} (on completion)
```

### Update Frequency

Update progress:
- After each employee processed
- Every 5 seconds minimum
- On error occurrence
- On completion

### Expected Outcome
- Progress tracked in real-time
- Stored in Redis with TTL
- Retrievable via API
- Updates during processing

### Verification Checklist
- [ ] update_progress method added to PayrollProcessor
- [ ] Progress stored in Redis
- [ ] Key pattern: payroll:progress:{run_id}
- [ ] Progress data structure defined
- [ ] Updated after each employee
- [ ] Percentage calculated
- [ ] get_processing_progress method created
- [ ] TTL set on progress keys
- [ ] Celery task updates progress
- [ ] Progress retrievable via API

---

## Summary

This document covered the payroll calculation and batch processing implementation:

**Calculations:**
- Overtime calculation based on hours and rates
- Unpaid leave deduction calculation
- Pro-rata basic salary for partial periods
- Comprehensive earnings processing
- Deductions including EPF, PAYE, loans
- Gross salary calculation
- Net salary calculation

**Batch Processing:**
- Batch processing for all employees
- Transaction-based processing per employee
- Error handling and recovery
- Async Celery task implementation
- Real-time progress tracking with Redis

**Key Outcomes:**
- All payroll calculations implemented
- Batch processing handles large employee sets
- Async processing prevents web server blocking
- Progress tracking enables monitoring
- Error handling ensures reliability

These implementations provide the calculation engine for accurate payroll processing with real-time monitoring capabilities.
