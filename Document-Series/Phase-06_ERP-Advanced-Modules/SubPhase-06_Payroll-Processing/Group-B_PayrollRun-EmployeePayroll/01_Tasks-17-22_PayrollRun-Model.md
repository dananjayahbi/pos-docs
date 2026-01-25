# Tasks 17-22: PayrollRun Model

> **Phase:** 06 - ERP Advanced Modules  
> **SubPhase:** 06 - Payroll Processing  
> **Group:** B - PayrollRun & EmployeePayroll  
> **Document:** 01 of 02  
> **Tasks Covered:** 17, 18, 19, 20, 21, 22

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **→ Next Document:** [02_Tasks-23-34_EmployeePayroll-Model.md](02_Tasks-23-34_EmployeePayroll-Model.md)

---

## Document Overview

This document covers the PayrollRun model, which represents a single payroll processing execution for a specific period. The model tracks the processing status, stores summary totals, captures approval information, and logs any errors encountered during processing. This establishes the framework for managing payroll runs and tracking their lifecycle from initiation through completion.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 17 | Create PayrollRun Model | Medium | 25 min |
| 18 | Add Run Period FK | Low | 15 min |
| 19 | Add Run Status Field | Medium | 20 min |
| 20 | Add Run Summary Fields | Medium | 20 min |
| 21 | Add Run User Fields | Low | 15 min |
| 22 | Run PayrollRun Migrations | Low | 15 min |

---

## Task 17: Create PayrollRun Model

### Overview
Create the PayrollRun model that represents each payroll processing execution. This model serves as the central entity for tracking a specific payroll run, containing all metadata about the processing execution including timing, status, summaries, and user information. Multiple runs can exist for the same period to handle corrections and reprocessing.

### Dependencies
- PayrollPeriod model exists (Group A)
- Tenant-aware base models configured
- Django ORM setup complete

### Instructions

1. **Create payroll_run.py model file**
   - Navigate to `apps/payroll/models/` directory
   - Create new file named `payroll_run.py`
   - This will contain the PayrollRun model

2. **Import required modules**
   - Import Django model fields and validators
   - Import TenantAwareMixin and TimestampMixin from base models
   - Import User model from Django auth
   - Import JSONField for structured data storage
   - Import Decimal for financial precision

3. **Define PayrollRun model class**
   - Inherit from TenantAwareMixin and TimestampMixin
   - Add comprehensive model docstring
   - Explain the purpose of tracking payroll processing runs

4. **Add model docstring**
   - Describe the model's role in payroll processing
   - Explain the relationship with PayrollPeriod
   - Note that multiple runs can exist per period
   - Document the run lifecycle states

5. **Prepare for foreign key fields**
   - PayrollRun will reference PayrollPeriod
   - Will reference User models for tracking
   - These relationships added in subsequent tasks

6. **Update models package initialization**
   - Open `apps/payroll/models/__init__.py`
   - Import PayrollRun model
   - Add to __all__ list for package exports

### PayrollRun Model Purpose

```
┌─────────────────────────────────────────────────────┐
│              PayrollRun Model                       │
├─────────────────────────────────────────────────────┤
│ Represents: A single execution of payroll           │
│             processing for a specific period        │
│                                                     │
│ Key Responsibilities:                               │
│  • Track processing status and progress             │
│  • Store financial summary totals                   │
│  • Record processing timestamps                     │
│  • Capture user information (processor, approver)   │
│  • Log processing errors and issues                 │
│  • Support multiple runs per period (corrections)   │
└─────────────────────────────────────────────────────┘
```

### Model Relationships Overview

```
┌─────────────────┐         1:N          ┌──────────────────┐
│ PayrollPeriod   │◄─────────────────────│   PayrollRun     │
│  (Group A)      │                      │   (This Task)    │
└─────────────────┘                      └──────────────────┘
                                                  │
                                                  │ 1:N
                                                  ▼
                                         ┌──────────────────┐
                                         │ EmployeePayroll  │
                                         │   (Task 23)      │
                                         └──────────────────┘
```

### Multiple Runs Per Period

```
PayrollPeriod: January 2026
├── PayrollRun #1 (Initial processing)
│   ├── Status: FINALIZED
│   ├── Processed: 50 employees
│   └── Date: 2026-01-20
│
├── PayrollRun #2 (Correction run)
│   ├── Status: FINALIZED
│   ├── Processed: 3 employees (corrected)
│   └── Date: 2026-01-25
│
└── PayrollRun #3 (Final correction)
    ├── Status: PROCESSING
    ├── Processed: 1 employee (salary adjustment)
    └── Date: 2026-01-28
```

### Run Lifecycle

```
DRAFT → PROCESSING → PROCESSED → PENDING_APPROVAL → 
   APPROVED → FINALIZED → PAID
   
Alternative paths:
- PROCESSING → FAILED (error during processing)
- PENDING_APPROVAL → REJECTED (approval denied)
- FINALIZED → REVERSED (correction needed)
```

### Expected Outcome
- PayrollRun model class created
- Proper inheritance from base mixins
- Model registered in package initialization
- Foundation for adding fields in subsequent tasks

### Verification Checklist
- [ ] payroll_run.py file created in models directory
- [ ] Required modules imported
- [ ] PayrollRun class defined with inheritance
- [ ] Model docstring added
- [ ] Model imported in __init__.py
- [ ] Model added to __all__ list

---

## Task 18: Add Run Period FK

### Overview
Add the foreign key relationship between PayrollRun and PayrollPeriod. This links each payroll run to the specific period it processes, enabling multiple processing runs for the same period and maintaining the relationship between periods and their processing history.

### Dependencies
- Task 17: Create PayrollRun Model
- PayrollPeriod model exists (Group A)

### Instructions

1. **Open payroll_run.py model file**
   - Navigate to `apps/payroll/models/payroll_run.py`
   - Locate the PayrollRun model class

2. **Import PayrollPeriod model**
   - Add import statement for PayrollPeriod
   - Import from appropriate models module

3. **Add payroll_period field**
   - ForeignKey to PayrollPeriod model
   - Set on_delete=CASCADE (delete runs when period deleted)
   - Set related_name='payroll_runs'
   - Add help_text explaining the relationship

4. **Add run_number field**
   - PositiveIntegerField
   - Default to 1
   - Tracks which processing attempt this is
   - Increments for correction runs

5. **Add field documentation**
   - Document the period relationship
   - Explain the run_number purpose
   - Note multiple runs allowed per period

6. **Update Meta class**
   - Add unique_together constraint
   - Ensure (tenant, payroll_period, run_number) is unique
   - Add ordering by created_at descending

### Period-Run Relationship

```
┌─────────────────────────────────────────────────────┐
│         PayrollPeriod ◄── PayrollRun                │
├─────────────────────────────────────────────────────┤
│ Relationship Type: Many-to-One                      │
│                                                     │
│ One PayrollPeriod can have multiple PayrollRuns:    │
│  • Initial processing run                           │
│  • Correction runs                                  │
│  • Reprocessing after rejection                     │
│                                                     │
│ Each PayrollRun belongs to exactly one Period       │
└─────────────────────────────────────────────────────┘
```

### Run Number Logic

```
Period: January 2026
─────────────────────────────────────────────────────

First Processing:
├── run_number: 1
├── Purpose: Initial payroll processing
└── Processes all 50 employees

Correction Needed:
├── run_number: 2
├── Purpose: Fix 3 employee salary errors
└── Processes only affected employees

Final Adjustment:
├── run_number: 3
├── Purpose: Late overtime entry
└── Processes 1 employee
```

### Cascade Deletion Behavior

```
When PayrollPeriod is deleted:
├── All related PayrollRuns are deleted (CASCADE)
│   ├── PayrollRun #1 → Deleted
│   ├── PayrollRun #2 → Deleted
│   └── PayrollRun #3 → Deleted
│
└── All related EmployeePayroll records → Deleted
    (via cascade from PayrollRun)
```

### Query Examples

```
Access all runs for a period:
period.payroll_runs.all()

Get latest run for a period:
period.payroll_runs.first()  # With ordering=-created_at

Get run number 1 (initial run):
period.payroll_runs.filter(run_number=1).first()

Count correction runs:
period.payroll_runs.count() - 1
```

### Field Specifications

| Field | Type | Constraints | Purpose |
|-------|------|-------------|---------|
| payroll_period | ForeignKey | NOT NULL, CASCADE | Link to period |
| run_number | PositiveInteger | >= 1, default=1 | Processing sequence |
| unique_together | Constraint | (tenant, period, run_number) | Prevent duplicates |

### Expected Outcome
- PayrollRun linked to PayrollPeriod
- Run numbering system established
- Multiple runs per period supported
- Cascade deletion configured

### Verification Checklist
- [ ] PayrollPeriod imported
- [ ] payroll_period ForeignKey added
- [ ] run_number field added
- [ ] related_name set to 'payroll_runs'
- [ ] on_delete=CASCADE configured
- [ ] unique_together constraint added
- [ ] Meta ordering configured

---

## Task 19: Add Run Status Field

### Overview
Add the status field and related timestamp fields to track the payroll run's lifecycle. The status field uses a choices-based enumeration to represent different stages of processing, approval, and finalization. Timestamps track when processing started and completed.

### Dependencies
- Task 18: Add Run Period FK

### Instructions

1. **Open payroll_run.py model file**
   - Continue in `apps/payroll/models/payroll_run.py`
   - Locate the PayrollRun model class

2. **Define PayrollStatus choices**
   - Create a tuple of status choices
   - Use constants pattern for status values
   - Include all lifecycle states

3. **Define status constants**
   - DRAFT: Initial state, not yet processing
   - PROCESSING: Currently executing
   - PROCESSED: Execution complete, awaiting approval
   - PENDING_APPROVAL: Submitted for review
   - APPROVED: Approved by manager/HR
   - REJECTED: Approval denied
   - FINALIZED: Locked and ready for payment
   - PAID: Payment completed
   - FAILED: Processing error occurred
   - REVERSED: Correction needed, run invalidated

4. **Add status field**
   - CharField with choices from PayrollStatus
   - Default to 'DRAFT'
   - Max length 20 characters
   - Index this field for query performance

5. **Add started_at field**
   - DateTimeField
   - Null and blank allowed
   - Timestamp when processing begins
   - Set automatically when status changes to PROCESSING

6. **Add completed_at field**
   - DateTimeField
   - Null and blank allowed
   - Timestamp when processing completes
   - Set when status changes to PROCESSED

7. **Add duration property**
   - Calculated property (not a database field)
   - Returns timedelta between started_at and completed_at
   - Returns None if either timestamp missing

8. **Update model docstring**
   - Document status field and lifecycle
   - Explain timestamp fields
   - Note automatic timestamp updates

### PayrollStatus Choices

```
┌────────────────────────────────────────────────────┐
│           PayrollRun Status Lifecycle              │
├────────────────────────────────────────────────────┤
│ DRAFT           → Not yet started                  │
│ PROCESSING      → Calculating payroll              │
│ PROCESSED       → Calculation complete             │
│ PENDING_APPROVAL→ Awaiting manager review          │
│ APPROVED        → Manager approved                 │
│ REJECTED        → Manager rejected                 │
│ FINALIZED       → Locked, ready for payment        │
│ PAID            → Payment processed                │
│ FAILED          → Error during processing          │
│ REVERSED        → Invalidated for correction       │
└────────────────────────────────────────────────────┘
```

### Status Transitions

```
Normal Flow:
DRAFT → PROCESSING → PROCESSED → PENDING_APPROVAL → 
  APPROVED → FINALIZED → PAID

Error Flow:
DRAFT → PROCESSING → FAILED
                  ↓
               (retry)
                  ↓
            PROCESSING

Rejection Flow:
PENDING_APPROVAL → REJECTED
                  ↓
            (reprocess)
                  ↓
              PROCESSING

Correction Flow:
FINALIZED → REVERSED
           ↓
    (new run created)
```

### Status Field Specifications

| Status | Description | Next Valid States |
|--------|-------------|------------------|
| DRAFT | Initial state | PROCESSING |
| PROCESSING | Actively calculating | PROCESSED, FAILED |
| PROCESSED | Ready for review | PENDING_APPROVAL |
| PENDING_APPROVAL | Awaiting approval | APPROVED, REJECTED |
| APPROVED | Manager approved | FINALIZED |
| REJECTED | Not approved | DRAFT (reprocess) |
| FINALIZED | Locked | PAID, REVERSED |
| PAID | Payment done | REVERSED |
| FAILED | Error occurred | DRAFT (retry) |
| REVERSED | Invalidated | (terminal) |

### Timestamp Tracking

```
Timeline Example:
─────────────────────────────────────────────────────
2026-01-20 10:00:00  │ started_at (PROCESSING)
                     │
                     │ [Processing 50 employees]
                     │ [Calculating earnings]
                     │ [Computing deductions]
                     │
2026-01-20 10:15:23  │ completed_at (PROCESSED)
─────────────────────────────────────────────────────
Duration: 15 minutes, 23 seconds
```

### Duration Calculation

```
If both timestamps exist:
  duration = completed_at - started_at
  
Examples:
  Started: 10:00:00
  Completed: 10:15:23
  Duration: 0:15:23 (15 minutes, 23 seconds)
  
  Started: 09:30:00
  Completed: 10:45:00
  Duration: 1:15:00 (1 hour, 15 minutes)
```

### Status-Based Queries

```
Get all processing runs:
PayrollRun.objects.filter(status='PROCESSING')

Get completed but not approved:
PayrollRun.objects.filter(status='PROCESSED')

Get all pending approval:
PayrollRun.objects.filter(status='PENDING_APPROVAL')

Get finalized runs for payment:
PayrollRun.objects.filter(status='FINALIZED')

Get all successful runs (not failed or reversed):
PayrollRun.objects.exclude(
    status__in=['FAILED', 'REVERSED']
)
```

### Expected Outcome
- Complete status enumeration defined
- Status field with appropriate constraints
- Timestamp fields for processing tracking
- Duration calculation capability

### Verification Checklist
- [ ] PayrollStatus choices tuple defined
- [ ] All 10 status constants defined
- [ ] status CharField added with choices
- [ ] Default status is DRAFT
- [ ] started_at DateTimeField added
- [ ] completed_at DateTimeField added
- [ ] Both timestamp fields nullable
- [ ] duration property method created
- [ ] Status field indexed for performance

---

## Task 20: Add Run Summary Fields

### Overview
Add summary fields that aggregate financial totals across all employees in the payroll run. These fields provide quick access to totals without querying individual employee payroll records, enabling efficient reporting and validation. Summary fields include employee count, gross totals, deduction totals, net totals, and statutory contribution totals.

### Dependencies
- Task 19: Add Run Status Field

### Instructions

1. **Open payroll_run.py model file**
   - Continue in `apps/payroll/models/payroll_run.py`
   - Locate the PayrollRun model class

2. **Add total_employees field**
   - PositiveIntegerField
   - Default to 0
   - Count of employees processed in this run
   - Updated during batch processing

3. **Add total_gross field**
   - DecimalField with max_digits=15, decimal_places=2
   - Default to Decimal('0.00')
   - Sum of all employee gross salaries
   - Includes basic, allowances, overtime

4. **Add total_deductions field**
   - DecimalField with max_digits=15, decimal_places=2
   - Default to Decimal('0.00')
   - Sum of all employee deductions
   - Includes EPF employee, PAYE, loans, etc.

5. **Add total_net field**
   - DecimalField with max_digits=15, decimal_places=2
   - Default to Decimal('0.00')
   - Sum of all employee net salaries
   - Should equal total_gross minus total_deductions

6. **Add total_epf_employee field**
   - DecimalField with max_digits=12, decimal_places=2
   - Default to Decimal('0.00')
   - Sum of employee EPF contributions (8%)
   - Part of total_deductions

7. **Add total_epf_employer field**
   - DecimalField with max_digits=12, decimal_places=2
   - Default to Decimal('0.00')
   - Sum of employer EPF contributions (12%)
   - Not deducted from employee, employer cost

8. **Add total_etf field**
   - DecimalField with max_digits=12, decimal_places=2
   - Default to Decimal('0.00')
   - Sum of ETF contributions (3%)
   - Employer cost only

9. **Add total_paye field**
   - DecimalField with max_digits=12, decimal_places=2
   - Default to Decimal('0.00')
   - Sum of PAYE tax deductions
   - Part of total_deductions

10. **Add notes field**
    - TextField
    - Blank and null allowed
    - Free-form notes about the run
    - Reasons for correction runs, special circumstances

11. **Add validation method**
    - Create validate_totals method
    - Verify total_net equals total_gross minus total_deductions
    - Check that component totals sum correctly
    - Raise ValidationError if mismatched

### Summary Fields Structure

```
┌─────────────────────────────────────────────────────┐
│           PayrollRun Summary Fields                 │
├─────────────────────────────────────────────────────┤
│ Employee Count:                                     │
│  • total_employees: Integer                         │
│                                                     │
│ Financial Totals (Decimal 15.2):                    │
│  • total_gross: Sum of all gross salaries           │
│  • total_deductions: Sum of all deductions          │
│  • total_net: Sum of all net salaries               │
│                                                     │
│ Statutory Contributions (Decimal 12.2):             │
│  • total_epf_employee: Employee EPF (8%)            │
│  • total_epf_employer: Employer EPF (12%)           │
│  • total_etf: Employer ETF (3%)                     │
│  • total_paye: PAYE tax deductions                  │
│                                                     │
│ Additional:                                         │
│  • notes: TextField (optional)                      │
└─────────────────────────────────────────────────────┘
```

### Summary Calculation Example

```
PayrollRun: January 2026, Run #1
─────────────────────────────────────────────────────

Employees Processed: 50

Earnings Summary:
  Basic Salaries:        LKR 5,500,000
  Allowances:            LKR   750,000
  Overtime:              LKR   250,000
  ─────────────────────────────────────
  Total Gross:           LKR 6,500,000

Deductions Summary:
  EPF Employee (8%):     LKR   520,000
  PAYE Tax:              LKR   180,000
  Loan Recoveries:       LKR    30,000
  Other Deductions:      LKR    20,000
  ─────────────────────────────────────
  Total Deductions:      LKR   750,000

Net Salary:              LKR 5,750,000

Employer Costs:
  EPF Employer (12%):    LKR   780,000
  ETF (3%):              LKR   195,000
  ─────────────────────────────────────
  Total Employer Cost:   LKR   975,000

Total Company Expense:   LKR 7,475,000
(Gross + Employer Contributions)
```

### Field Precision Specifications

| Field | Max Digits | Decimal Places | Max Value |
|-------|------------|----------------|-----------|
| total_gross | 15 | 2 | 9,999,999,999,999.99 |
| total_deductions | 15 | 2 | 9,999,999,999,999.99 |
| total_net | 15 | 2 | 9,999,999,999,999.99 |
| total_epf_employee | 12 | 2 | 9,999,999,999.99 |
| total_epf_employer | 12 | 2 | 9,999,999,999.99 |
| total_etf | 12 | 2 | 9,999,999,999.99 |
| total_paye | 12 | 2 | 9,999,999,999.99 |

### Validation Logic

```
Validation Rules:
─────────────────────────────────────────────────────

Rule 1: Net equals Gross minus Deductions
  total_net = total_gross - total_deductions
  
  Example:
  Gross: 6,500,000
  Deductions: 750,000
  Net: 5,750,000
  Valid: 5,750,000 = 6,500,000 - 750,000 ✓

Rule 2: EPF Employee is part of Deductions
  total_epf_employee <= total_deductions
  
Rule 3: PAYE is part of Deductions
  total_paye <= total_deductions

Rule 4: Employee count matches records
  total_employees = count(EmployeePayroll)
```

### Summary Update Process

```
During payroll processing:

For each employee processed:
  1. Calculate employee payroll
  2. Accumulate to run totals:
     ├── total_employees += 1
     ├── total_gross += employee.gross_salary
     ├── total_deductions += employee.total_deductions
     ├── total_net += employee.net_salary
     ├── total_epf_employee += employee.epf_employee
     ├── total_epf_employer += employee.epf_employer
     ├── total_etf += employee.etf
     └── total_paye += employee.paye_tax

After all employees:
  3. Validate totals
  4. Save PayrollRun
```

### Reporting Use Cases

| Report | Fields Used |
|--------|-------------|
| Payroll Summary | All total fields |
| Bank Transfer File | total_net |
| EPF Return | total_epf_employee, total_epf_employer |
| ETF Return | total_etf |
| PAYE Return | total_paye |
| Cost Analysis | total_gross, employer contributions |
| Budget Variance | total_gross vs. budget |

### Expected Outcome
- Complete financial summary tracking
- Efficient total queries without aggregation
- Validation capability for data integrity
- Foundation for reporting and analysis

### Verification Checklist
- [ ] total_employees field added
- [ ] total_gross field added with Decimal type
- [ ] total_deductions field added
- [ ] total_net field added
- [ ] total_epf_employee field added
- [ ] total_epf_employer field added
- [ ] total_etf field added
- [ ] total_paye field added
- [ ] notes TextField added
- [ ] All Decimal fields have appropriate precision
- [ ] Default values set to 0 or Decimal('0.00')
- [ ] validate_totals method created

---

## Task 21: Add Run User Fields

### Overview
Add fields to track which users initiated, processed, and approved the payroll run. These audit fields provide accountability and enable workflow management. The fields capture the user who processed the payroll and the user who approved it (if applicable).

### Dependencies
- Task 20: Add Run Summary Fields
- User model available from Django auth

### Instructions

1. **Open payroll_run.py model file**
   - Continue in `apps/payroll/models/payroll_run.py`
   - Locate the PayrollRun model class

2. **Import User model**
   - Import User from django.contrib.auth.models
   - Or import custom User model if defined

3. **Add processed_by field**
   - ForeignKey to User model
   - Set on_delete=PROTECT (prevent deletion of user with runs)
   - Set related_name='processed_payroll_runs'
   - Null and blank allowed
   - Tracks who initiated the processing

4. **Add approved_by field**
   - ForeignKey to User model
   - Set on_delete=PROTECT
   - Set related_name='approved_payroll_runs'
   - Null=True, blank=True (not all runs need approval)
   - Tracks who approved the payroll

5. **Add approved_at field**
   - DateTimeField
   - Null=True, blank=True
   - Timestamp when approval occurred
   - Set automatically when status changes to APPROVED

6. **Add error_count field**
   - PositiveIntegerField
   - Default to 0
   - Count of employees that failed processing
   - Incremented when individual employee processing fails

7. **Add errors field**
   - JSONField
   - Default to list (empty list)
   - Stores error details for failed employees
   - Each error includes employee_id, error message, timestamp

8. **Add helper methods**
   - Create has_errors property (returns error_count > 0)
   - Create is_approved property (returns approved_by is not None)
   - Create can_approve method (checks if run can be approved)

### User Tracking Fields

```
┌─────────────────────────────────────────────────────┐
│             PayrollRun User Tracking                │
├─────────────────────────────────────────────────────┤
│ Processing User:                                    │
│  • processed_by: ForeignKey(User)                   │
│    - Who initiated the payroll processing           │
│    - Set when processing starts                     │
│    - Required field                                 │
│                                                     │
│ Approval User:                                      │
│  • approved_by: ForeignKey(User, nullable)          │
│    - Who approved the payroll                       │
│    - Set when status changes to APPROVED            │
│    - Optional (depends on workflow)                 │
│                                                     │
│  • approved_at: DateTimeField(nullable)             │
│    - When approval occurred                         │
│    - Auto-set with approved_by                      │
│                                                     │
│ Error Tracking:                                     │
│  • error_count: PositiveInteger (default=0)         │
│  • errors: JSONField (default=[])                   │
└─────────────────────────────────────────────────────┘
```

### User Assignment Examples

```
Example 1: HR Manager Processing
─────────────────────────────────────────────────────
processed_by: hr.manager@company.lk
approved_by: finance.director@company.lk
approved_at: 2026-01-22 14:30:00

Flow:
1. HR Manager initiates processing
2. System sets processed_by = current user
3. Processing completes successfully
4. HR Manager submits for approval
5. Finance Director reviews and approves
6. System sets approved_by and approved_at


Example 2: Automated Processing
─────────────────────────────────────────────────────
processed_by: system.admin@company.lk (system user)
approved_by: None (auto-approved)
approved_at: None

Flow:
1. Scheduled task initiates processing
2. System user set as processed_by
3. Processing completes
4. Auto-approved (no manual review needed)


Example 3: Processing with Errors
─────────────────────────────────────────────────────
processed_by: payroll.clerk@company.lk
approved_by: None
approved_at: None
error_count: 3

Flow:
1. Payroll Clerk initiates processing
2. 47 employees process successfully
3. 3 employees fail (errors logged)
4. Status remains FAILED
5. Cannot be submitted for approval
```

### Error Tracking Structure

```json
{
  "errors": [
    {
      "employee_id": "uuid-1234",
      "employee_code": "EMP-0023",
      "employee_name": "John Doe",
      "error_message": "Missing salary configuration",
      "error_type": "ValidationError",
      "timestamp": "2026-01-20T10:05:32Z"
    },
    {
      "employee_id": "uuid-5678",
      "employee_code": "EMP-0045",
      "employee_name": "Jane Smith",
      "error_message": "No bank account configured",
      "error_type": "ValidationError",
      "timestamp": "2026-01-20T10:07:18Z"
    },
    {
      "employee_id": "uuid-9012",
      "employee_code": "EMP-0067",
      "employee_name": "Bob Wilson",
      "error_message": "Attendance data not found",
      "error_type": "DataError",
      "timestamp": "2026-01-20T10:09:45Z"
    }
  ]
}
```

### Error Types

| Error Type | Description | Example |
|-----------|-------------|---------|
| ValidationError | Data validation failed | Missing required field |
| DataError | Required data missing | No salary record found |
| CalculationError | Math/logic error | Division by zero |
| ConfigurationError | Setup issue | Missing EPF configuration |
| ExternalError | External system failure | Bank API timeout |

### Approval Workflow

```
Can Approve When:
├── Status is PROCESSED or PENDING_APPROVAL
├── error_count = 0
├── total_employees > 0
├── User has 'approve_payroll' permission
└── Not already approved

Cannot Approve When:
├── Status is DRAFT, PROCESSING, or FAILED
├── error_count > 0
├── total_employees = 0
├── User lacks permission
└── Already approved
```

### Audit Trail

```
Query who processed which runs:
user.processed_payroll_runs.all()

Query who approved which runs:
user.approved_payroll_runs.all()

Get runs awaiting specific user approval:
PayrollRun.objects.filter(
    status='PENDING_APPROVAL',
    approved_by__isnull=True
)

Get all runs with errors:
PayrollRun.objects.filter(error_count__gt=0)
```

### Related User Actions

```
User: hr.manager@company.lk

Processed Runs:
├── January 2026 Run #1 (50 employees, FINALIZED)
├── February 2026 Run #1 (48 employees, FINALIZED)
└── March 2026 Run #1 (52 employees, PROCESSING)

Approved Runs:
├── December 2025 Run #1 (approved as backup)
└── January 2026 Run #2 (approved correction)
```

### Expected Outcome
- Complete user tracking for accountability
- Approval workflow support
- Error tracking for failed processing
- Audit trail capabilities

### Verification Checklist
- [ ] User model imported
- [ ] processed_by ForeignKey added
- [ ] approved_by ForeignKey added (nullable)
- [ ] approved_at DateTimeField added (nullable)
- [ ] error_count field added
- [ ] errors JSONField added with default
- [ ] on_delete=PROTECT set for user fields
- [ ] Related names configured
- [ ] has_errors property created
- [ ] is_approved property created
- [ ] can_approve method created

---

## Task 22: Run PayrollRun Migrations

### Overview
Generate and apply Django migrations for the PayrollRun model. This task creates the database schema for storing payroll run records with all fields, constraints, and indexes defined in previous tasks.

### Dependencies
- Task 21: Add Run User Fields
- All PayrollRun model fields completed
- Database connection configured

### Instructions

1. **Review model completeness**
   - Open `apps/payroll/models/payroll_run.py`
   - Verify all fields from tasks 17-21 are present
   - Check Meta class configuration
   - Ensure unique_together constraints defined

2. **Generate migration file**
   - Navigate to project root directory
   - Run makemigrations command for payroll app
   - Django will detect PayrollRun model
   - Migration file created in migrations directory

3. **Review generated migration**
   - Open the new migration file
   - Verify all fields included
   - Check field types and constraints
   - Ensure foreign keys properly configured
   - Verify indexes created for status, tenant

4. **Apply migration**
   - Run migrate command
   - Django creates payroll_payrollrun table
   - All columns created with proper types
   - Constraints and indexes applied
   - Foreign key relationships established

5. **Verify migration**
   - Check migration status shows applied
   - Verify table exists in database
   - Check column definitions match model
   - Confirm indexes created

6. **Test model operations**
   - Open Django shell
   - Import PayrollRun model
   - Create test instance
   - Verify save works
   - Test querying

### Migration File Structure

```
migrations/
├── 0001_initial.py              (from previous groups)
├── 0002_payroll_period.py       (Group A)
├── ...
├── 0014_payroll_run.py          (This task)
    ├── dependencies = [
    │       ('payroll', '0013_...'),
    │       ('tenants', '...'),
    │       ('auth', '...'),
    │   ]
    ├── operations = [
    │       migrations.CreateModel(
    │           name='PayrollRun',
    │           fields=[
    │               ('id', ...),
    │               ('tenant', ForeignKey...),
    │               ('payroll_period', ForeignKey...),
    │               ('run_number', PositiveInteger...),
    │               ('status', CharField...),
    │               ('started_at', DateTime...),
    │               ('completed_at', DateTime...),
    │               ('total_employees', PositiveInteger...),
    │               ('total_gross', Decimal...),
    │               ... (all fields)
    │           ],
    │           options={
    │               'unique_together': {('tenant', 'payroll_period', 'run_number')},
    │               'ordering': ['-created_at'],
    │               'indexes': [...]
    │           }
    │       )
    │   ]
```

### Database Table Schema

```
Table: payroll_payrollrun
─────────────────────────────────────────────────────

Column                    Type              Constraints
─────────────────────────────────────────────────────
id                       UUID              PRIMARY KEY
tenant_id                UUID              FOREIGN KEY, NOT NULL
payroll_period_id        UUID              FOREIGN KEY, NOT NULL
run_number               INTEGER           NOT NULL, DEFAULT 1
status                   VARCHAR(20)       NOT NULL, DEFAULT 'DRAFT'
started_at               TIMESTAMP         NULL
completed_at             TIMESTAMP         NULL
total_employees          INTEGER           NOT NULL, DEFAULT 0
total_gross              DECIMAL(15,2)     NOT NULL, DEFAULT 0.00
total_deductions         DECIMAL(15,2)     NOT NULL, DEFAULT 0.00
total_net                DECIMAL(15,2)     NOT NULL, DEFAULT 0.00
total_epf_employee       DECIMAL(12,2)     NOT NULL, DEFAULT 0.00
total_epf_employer       DECIMAL(12,2)     NOT NULL, DEFAULT 0.00
total_etf                DECIMAL(12,2)     NOT NULL, DEFAULT 0.00
total_paye               DECIMAL(12,2)     NOT NULL, DEFAULT 0.00
notes                    TEXT              NULL
processed_by_id          UUID              FOREIGN KEY, NULL
approved_by_id           UUID              FOREIGN KEY, NULL
approved_at              TIMESTAMP         NULL
error_count              INTEGER           NOT NULL, DEFAULT 0
errors                   JSONB             NOT NULL, DEFAULT '[]'
created_at               TIMESTAMP         NOT NULL, AUTO
updated_at               TIMESTAMP         NOT NULL, AUTO

UNIQUE (tenant_id, payroll_period_id, run_number)
INDEX idx_status (status)
INDEX idx_tenant_period (tenant_id, payroll_period_id)
```

### Foreign Key Relationships

```
payroll_payrollrun
├── tenant_id → tenants_tenant(id)
│   └── ON DELETE CASCADE
│
├── payroll_period_id → payroll_payrollperiod(id)
│   └── ON DELETE CASCADE
│
├── processed_by_id → auth_user(id)
│   └── ON DELETE PROTECT
│
└── approved_by_id → auth_user(id)
    └── ON DELETE PROTECT
```

### Indexes Created

| Index Name | Columns | Type | Purpose |
|-----------|---------|------|---------|
| PRIMARY | id | B-tree | Primary key |
| idx_tenant | tenant_id | B-tree | Tenant filtering |
| idx_status | status | B-tree | Status queries |
| idx_tenant_period | tenant_id, payroll_period_id | B-tree | Period runs |
| unique_run | tenant_id, period_id, run_number | Unique | Prevent duplicates |

### Test Model Creation

```
After migration applied, test in Django shell:

from apps.payroll.models import PayrollRun, PayrollPeriod
from apps.tenants.models import Tenant
from django.contrib.auth import get_user_model

User = get_user_model()

# Get tenant and period
tenant = Tenant.objects.first()
period = PayrollPeriod.objects.filter(
    tenant=tenant, 
    status='OPEN'
).first()
user = User.objects.first()

# Create PayrollRun
run = PayrollRun.objects.create(
    tenant=tenant,
    payroll_period=period,
    run_number=1,
    status='DRAFT',
    processed_by=user,
    total_employees=0
)

print(f"Created: {run}")
print(f"Period: {run.payroll_period.name}")
print(f"Status: {run.status}")
print(f"Run Number: {run.run_number}")
```

### Verification Queries

```
# Check table exists
SELECT table_name 
FROM information_schema.tables 
WHERE table_name = 'payroll_payrollrun';

# Check columns
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'payroll_payrollrun'
ORDER BY ordinal_position;

# Check constraints
SELECT constraint_name, constraint_type 
FROM information_schema.table_constraints 
WHERE table_name = 'payroll_payrollrun';

# Check indexes
SELECT indexname, indexdef 
FROM pg_indexes 
WHERE tablename = 'payroll_payrollrun';
```

### Expected Outcome
- Migration file generated successfully
- Database table created with all columns
- Foreign keys established correctly
- Indexes created for query optimization
- Model ready for use in application

### Verification Checklist
- [ ] makemigrations command executed
- [ ] Migration file generated in migrations directory
- [ ] Migration file reviewed for accuracy
- [ ] migrate command executed successfully
- [ ] payroll_payrollrun table exists in database
- [ ] All columns present with correct types
- [ ] Foreign keys created and working
- [ ] Unique constraint on (tenant, period, run_number)
- [ ] Indexes created for performance
- [ ] Test instance creation successful
- [ ] Model queries work as expected

---

## Summary

This document established the PayrollRun model and its complete field structure:

### Completed Components
- ✅ PayrollRun model class with base mixins
- ✅ Foreign key to PayrollPeriod with run numbering
- ✅ Status field with lifecycle enumeration
- ✅ Timestamp tracking (started_at, completed_at)
- ✅ Financial summary fields (gross, deductions, net)
- ✅ Statutory contribution totals (EPF, ETF, PAYE)
- ✅ User tracking (processed_by, approved_by)
- ✅ Error tracking (error_count, errors)
- ✅ Database migrations applied

### Key Achievements
1. **Run Management** - Track individual processing executions
2. **Multiple Runs** - Support corrections and reprocessing
3. **Status Lifecycle** - Complete workflow from draft to paid
4. **Financial Summaries** - Aggregated totals for reporting
5. **User Accountability** - Audit trail for processing and approval
6. **Error Handling** - Track and report processing failures

### Model Relationships Established
- PayrollRun → PayrollPeriod (Many-to-One)
- PayrollRun → User (processed_by)
- PayrollRun → User (approved_by)

### Next Steps
Proceed to [02_Tasks-23-34_EmployeePayroll-Model.md](02_Tasks-23-34_EmployeePayroll-Model.md) to implement the EmployeePayroll model for individual employee payroll records.

---

**Document Status:** ✅ Complete  
**Total Tasks:** 6  
**Estimated Time:** 110 minutes
