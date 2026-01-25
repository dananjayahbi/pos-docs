# Tasks 01-09: PayrollPeriod Model and Status Management

> **Phase:** 06 - ERP Advanced Modules  
> **SubPhase:** 06 - Payroll Processing  
> **Group:** A - Payroll Period Models  
> **Document:** 01 of 02  
> **Tasks Covered:** 01, 02, 03, 04, 05, 06, 07, 08, 09

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **→ Next Document:** [02_Tasks-10-16_Settings-AutoGeneration.md](02_Tasks-10-16_Settings-AutoGeneration.md)

---

## Document Overview

This document establishes the foundation of the payroll processing system by extending the existing payroll app with processing capabilities, defining payroll status choices, and creating the comprehensive PayrollPeriod model. The PayrollPeriod model serves as the central entity for managing monthly payroll cycles, including date ranges, status tracking, locking mechanisms, and working day calculations.

### Tasks in This Document
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

---

## Task 01: Extend Payroll App

### Overview
Extend the existing `payroll` Django application to include payroll processing functionality. This task creates the necessary directory structure for processing-related models, tasks, and utilities while maintaining the existing leave management functionality.

### Dependencies
- Payroll application exists (from Phase 05, SubPhase 05)
- Django project structure established
- Multi-tenancy configured

### Instructions

1. **Verify existing payroll app structure**
   - Navigate to `apps/payroll/` directory
   - Confirm existing models (Employee, LeaveType, LeaveRequest, etc.)
   - Review current app configuration

2. **Create processing submodule structure**
   - Create `processing/` directory inside `apps/payroll/`
   - This will house payroll processing-specific code
   - Add `__init__.py` to make it a Python package

3. **Create tasks directory**
   - Create `tasks/` directory inside `apps/payroll/`
   - This will contain Celery tasks for automated processing
   - Add `__init__.py` for package initialization

4. **Create utilities directory**
   - Create `utils/` directory inside `apps/payroll/`
   - This will contain calculation helpers and utilities
   - Add `__init__.py` for package initialization

5. **Update app configuration**
   - Review `apps/payroll/apps.py`
   - Ensure app is properly registered
   - Verify tenant configuration if using django-tenants

6. **Prepare constants module**
   - Verify `constants.py` exists in `apps/payroll/`
   - If not exists, create it for payroll-related constants
   - This will be extended in Task 02

### Directory Structure
```
apps/payroll/
├── __init__.py                   # Existing
├── apps.py                       # Existing
├── constants.py                  # Extend in Task 02
├── models/
│   ├── __init__.py              # Existing
│   ├── employee.py              # Existing
│   ├── leave.py                 # Existing
│   ├── payroll_period.py        # Create in Task 03
│   └── payroll_settings.py      # Create in Task 10
├── processing/                   # New directory
│   └── __init__.py
├── tasks/                        # New directory
│   └── __init__.py
├── utils/                        # New directory
│   └── __init__.py
└── migrations/                   # Existing
```

### Module Organization

| Module/Directory | Purpose |
|-----------------|---------|
| `models/` | Database models (periods, runs, settings) |
| `processing/` | Business logic for payroll calculations |
| `tasks/` | Celery tasks for automation |
| `utils/` | Helper functions and calculators |
| `constants.py` | Status choices, configuration constants |

### Expected Outcome
- Extended payroll app structure ready for processing features
- Clear separation between leave management and payroll processing
- Foundation for Celery task integration
- Organized location for calculation utilities

### Verification Checklist
- [ ] `apps/payroll/processing/` directory exists
- [ ] `processing/__init__.py` created
- [ ] `apps/payroll/tasks/` directory exists
- [ ] `tasks/__init__.py` created
- [ ] `apps/payroll/utils/` directory exists
- [ ] `utils/__init__.py` created
- [ ] `constants.py` exists or created
- [ ] Existing leave management functionality intact

---

## Task 02: Define PayrollStatus Choices

### Overview
Define standard payroll status choices that track the lifecycle of payroll periods and payroll runs. These status constants ensure consistency across the payroll processing workflow and enable proper state management from draft creation to finalization.

### Dependencies
- Task 01: Extend payroll App
- `apps/payroll/constants.py` exists

### Instructions

1. **Open constants.py file**
   - Navigate to `apps/payroll/constants.py`
   - Add or extend module docstring
   - Document purpose of payroll status constants

2. **Add PayrollStatus section header**
   - Add comment section for payroll status choices
   - Explain usage context (periods, runs, workflow tracking)
   - Note that these follow Django's choices pattern

3. **Define STATUS_DRAFT constant**
   - Value: 'draft'
   - Display: 'Draft'
   - Purpose: Initial creation state
   - Period created but not yet processed

4. **Define STATUS_PROCESSING constant**
   - Value: 'processing'
   - Display: 'Processing'
   - Purpose: Active processing state
   - Celery task is running calculations

5. **Define STATUS_PROCESSED constant**
   - Value: 'processed'
   - Display: 'Processed'
   - Purpose: Processing completed
   - Ready for review and approval

6. **Define STATUS_APPROVED constant**
   - Value: 'approved'
   - Display: 'Approved'
   - Purpose: Manager approved
   - Approved for finalization and payment

7. **Define STATUS_FINALIZED constant**
   - Value: 'finalized'
   - Display: 'Finalized'
   - Purpose: Locked for payment
   - Cannot be modified, ready for disbursement

8. **Define STATUS_REVERSED constant**
   - Value: 'reversed'
   - Display: 'Reversed'
   - Purpose: Reversed with correction
   - Used when errors found after finalization

9. **Create PAYROLL_STATUS_CHOICES tuple**
   - Combine all status constants into choices tuple
   - Follow Django pattern: (value, display_name)
   - Maintain logical workflow order

### Payroll Status Lifecycle

```
┌─────────┐
│  DRAFT  │ ← Period created manually or auto-generated
└────┬────┘
     │
     ▼
┌────────────┐
│ PROCESSING │ ← Celery task calculating employee payrolls
└─────┬──────┘
      │
      ▼
┌───────────┐
│ PROCESSED │ ← Ready for HR/manager review
└─────┬─────┘
      │
      ▼
┌──────────┐
│ APPROVED │ ← Manager approved, ready to lock
└────┬─────┘
     │
     ▼
┌────────────┐
│ FINALIZED  │ ← Locked, ready for payment disbursement
└──────┬─────┘
       │
       ▼ (if errors found)
┌──────────┐
│ REVERSED │ ← Corrective action, new period created
└──────────┘
```

### Status Details

| Status | Value | Use Case | Can Edit | Can Process |
|--------|-------|----------|----------|-------------|
| DRAFT | 'draft' | Initial state, data entry | ✓ | ✓ |
| PROCESSING | 'processing' | Automated processing running | ✗ | ✗ |
| PROCESSED | 'processed' | Review and verification | ✓ | ✓ |
| APPROVED | 'approved' | Approved, pending finalization | ✗ | ✗ |
| FINALIZED | 'finalized' | Locked, ready for payment | ✗ | ✗ |
| REVERSED | 'reversed' | Historical record, corrected | ✗ | ✗ |

### Status Transition Rules

#### DRAFT → PROCESSING
- Triggered by: "Process Payroll" action
- Validation: Period dates valid, employees exist
- Celery task: Initiated
- User action: Locked out during processing

#### PROCESSING → PROCESSED
- Triggered by: Celery task completion
- Validation: All calculations successful
- Result: EmployeePayroll records created
- User action: Review available

#### PROCESSED → APPROVED
- Triggered by: Manager approval action
- Validation: Approver has permission
- Audit: Logged approval with timestamp
- User action: Manual review completed

#### APPROVED → FINALIZED
- Triggered by: "Finalize Payroll" action
- Validation: All checks passed
- Lock: is_locked = True set on period
- User action: Period becomes immutable

#### FINALIZED → REVERSED
- Triggered by: "Reverse Payroll" action
- Validation: Admin permission required
- Audit: Reversal reason recorded
- User action: Corrective period created

#### Any → DRAFT (Reprocessing)
- Triggered by: "Reset to Draft" action
- Validation: Period not finalized
- Cleanup: Delete calculated EmployeePayroll records
- User action: Restart processing workflow

### Expected Outcome
- Complete payroll status lifecycle defined
- Clear state transitions for workflow
- Foundation for status-based business logic
- Support for approval and audit trails

### Verification Checklist
- [ ] STATUS_DRAFT constant defined
- [ ] STATUS_PROCESSING constant defined
- [ ] STATUS_PROCESSED constant defined
- [ ] STATUS_APPROVED constant defined
- [ ] STATUS_FINALIZED constant defined
- [ ] STATUS_REVERSED constant defined
- [ ] PAYROLL_STATUS_CHOICES tuple created
- [ ] All constants follow naming convention
- [ ] Status workflow documented

---

## Task 03: Create PayrollPeriod Model

### Overview
Create the core PayrollPeriod model that represents a monthly payroll cycle for a tenant. This model serves as the central entity for managing payroll processing, tracking status, maintaining audit trails, and coordinating employee payroll calculations.

### Dependencies
- Task 01: Extend payroll App
- Task 02: Define PayrollStatus Choices
- Multi-tenancy configured (django-tenants)
- Client (Tenant) model exists

### Instructions

1. **Create payroll_period.py file**
   - Navigate to `apps/payroll/models/` directory
   - Create new file `payroll_period.py`
   - Add module docstring explaining model purpose

2. **Import required dependencies**
   - Import Django model classes and fields
   - Import timezone utilities (timezone.now)
   - Import Client model for tenant FK
   - Import User model for audit fields
   - Import PayrollStatus choices from constants

3. **Define PayrollPeriod model class**
   - Inherit from `models.Model`
   - Add comprehensive model docstring
   - Explain monthly payroll period concept
   - Note tenant-specific nature

4. **Add tenant foreign key**
   - Field name: `tenant`
   - Type: ForeignKey to Client model
   - Relationship: Many periods per tenant
   - on_delete: CASCADE (tenant deletion removes periods)
   - related_name: 'payroll_periods'

5. **Add base identification fields**
   - Field: `period_month` (IntegerField, 1-12)
   - Field: `period_year` (IntegerField, e.g., 2026)
   - Purpose: Unique identification of payroll period
   - Used for querying and unique constraints

6. **Add timestamps**
   - Field: `created_at` (DateTimeField, auto_now_add=True)
   - Field: `updated_at` (DateTimeField, auto_now=True)
   - Purpose: Audit trail and change tracking

7. **Add Meta class**
   - Set `db_table` to 'payroll_periods'
   - Set `verbose_name` to 'Payroll Period'
   - Set `verbose_name_plural` to 'Payroll Periods'
   - Add ordering: ['-period_year', '-period_month']

8. **Define unique constraint**
   - Constraint: unique_together on (tenant, period_month, period_year)
   - Purpose: Prevent duplicate periods for same month/year
   - Ensure data integrity

9. **Add __str__ method**
   - Format: "Tenant Name - January 2026"
   - Show tenant name, month name, year
   - User-friendly representation

10. **Update models __init__.py**
    - Import PayrollPeriod from payroll_period module
    - Add to __all__ list for package exports

### Model Structure Overview

```
PayrollPeriod Model
├── Core Fields
│   ├── tenant (FK to Client)
│   ├── period_month (1-12)
│   └── period_year (e.g., 2026)
├── Dates (Task 04)
│   ├── start_date
│   ├── end_date
│   └── pay_date
├── Identification (Task 05)
│   └── name (e.g., "January 2026")
├── Status (Task 06)
│   └── status (PayrollStatus choices)
├── Locking (Task 07)
│   ├── is_locked
│   ├── locked_at
│   └── locked_by
├── Calculations (Task 08)
│   └── total_working_days
└── Audit
    ├── created_at
    └── updated_at
```

### Field Purpose

| Field | Type | Purpose |
|-------|------|---------|
| tenant | ForeignKey | Multi-tenant isolation |
| period_month | Integer | Month number (1-12) |
| period_year | Integer | Year (e.g., 2026) |
| created_at | DateTime | Record creation timestamp |
| updated_at | DateTime | Last modification timestamp |

### Tenant Isolation

- Each PayrollPeriod belongs to one tenant
- Query filtering: `PayrollPeriod.objects.filter(tenant=request.tenant)`
- Automatic filtering via middleware (django-tenants)
- Prevents cross-tenant data access

### Unique Constraint Logic

```
Constraint: (tenant, period_month, period_year)

Valid:
✓ Tenant A, January 2026
✓ Tenant A, February 2026
✓ Tenant B, January 2026

Invalid:
✗ Tenant A, January 2026 (duplicate)
```

### Model Usage Examples

#### Creating a Period
```
Purpose: System or admin creates new monthly payroll period
Process:
1. Validate month/year unique for tenant
2. Set start_date = 1st of month
3. Set end_date = last day of month
4. Set pay_date based on PayrollSettings
5. Calculate working_days
6. Set status = DRAFT
7. Save period
```

#### Querying Current Period
```
Purpose: Get active payroll period for current month
Logic:
1. Get current month and year
2. Filter by tenant
3. Filter by period_month and period_year
4. Return single period or None
```

#### Listing Historical Periods
```
Purpose: Display past payroll periods for reporting
Logic:
1. Filter by tenant
2. Order by period_year DESC, period_month DESC
3. Include status for filtering
4. Paginate results
```

### Expected Outcome
- Core PayrollPeriod model structure created
- Tenant isolation configured
- Unique constraint prevents duplicates
- Foundation for additional fields in subsequent tasks
- Ready for migration generation

### Verification Checklist
- [ ] `payroll_period.py` file created
- [ ] PayrollPeriod class defined
- [ ] tenant ForeignKey added
- [ ] period_month field added
- [ ] period_year field added
- [ ] created_at and updated_at fields added
- [ ] Meta class with db_table configured
- [ ] unique_together constraint set
- [ ] __str__ method implemented
- [ ] Model imported in models/__init__.py

---

## Task 04: Add Period Date Fields

### Overview
Add date fields to the PayrollPeriod model that define the temporal boundaries of the payroll period. These fields establish when the period starts, when it ends, and when employees will be paid, enabling accurate attendance tracking and payment scheduling.

### Dependencies
- Task 03: Create PayrollPeriod Model

### Instructions

1. **Open payroll_period.py model file**
   - Navigate to `apps/payroll/models/payroll_period.py`
   - Locate the PayrollPeriod model class
   - Position after period_year field

2. **Add start_date field**
   - Type: DateField
   - Purpose: First day of payroll period
   - Nullable: False (required)
   - Help text: "First day of the payroll period"
   - Typically: 1st day of the month

3. **Add end_date field**
   - Type: DateField
   - Purpose: Last day of payroll period
   - Nullable: False (required)
   - Help text: "Last day of the payroll period"
   - Typically: Last day of the month

4. **Add pay_date field**
   - Type: DateField
   - Purpose: Date when salaries will be paid
   - Nullable: False (required)
   - Help text: "Date when salaries will be disbursed"
   - From PayrollSettings.default_pay_day

5. **Update model docstring**
   - Document date fields purpose
   - Explain relationship between dates
   - Note Sri Lanka business calendar considerations

6. **Add date validation method**
   - Method name: `clean()`
   - Override Django's clean method
   - Validate start_date < end_date
   - Validate pay_date >= end_date
   - Raise ValidationError if invalid

7. **Update __str__ method if needed**
   - Consider including date range
   - Format: "Tenant - January 2026 (01/01 - 31/01)"

### Date Fields Relationship

```
Timeline:
├─────────────────────────────────┤ Payroll Period
│                                 │
start_date                    end_date        pay_date
2026-01-01                   2026-01-31     2026-02-05
    │                            │              │
    └─ Attendance tracking start │              │
                                  └─ Tracking end│
                                                 └─ Salary disbursement
```

### Date Field Details

| Field | Type | Example | Purpose |
|-------|------|---------|---------|
| start_date | DateField | 2026-01-01 | Period start, attendance from |
| end_date | DateField | 2026-01-31 | Period end, attendance until |
| pay_date | DateField | 2026-02-05 | Salary payment date |

### Date Calculation Logic

#### Start Date
```
Calculation: First day of the period month
Example:
- period_month = 1 (January)
- period_year = 2026
- start_date = 2026-01-01
```

#### End Date
```
Calculation: Last day of the period month
Example:
- period_month = 1 (January)
- period_year = 2026
- end_date = 2026-01-31

Consider:
- February: 28 days (29 in leap years)
- Months with 30 days: Apr, Jun, Sep, Nov
- Months with 31 days: Jan, Mar, May, Jul, Aug, Oct, Dec
```

#### Pay Date
```
Calculation: Based on PayrollSettings.default_pay_day
Example:
- default_pay_day = 5 (5th of month)
- Period: January 2026
- pay_date = 2026-02-05 (5th of following month)

Weekend Adjustment:
- If pay_date falls on Saturday/Sunday
- Move to previous Friday
- Sri Lanka: Saturday & Sunday are weekends
```

### Attendance Tracking Integration

#### Standard Period
```
Period: January 2026
- start_date: 2026-01-01
- end_date: 2026-01-31
- Attendance tracked: Jan 1 to Jan 31
- Working days counted: Based on calendar
```

#### Cutoff-Based Period (with PayrollSettings)
```
Cutoff day: 20th of month
- Attendance tracking: Dec 21, 2025 to Jan 20, 2026
- Payroll period: January 2026
- Pay date: Jan 25, 2026
- Reason: Processing time before pay day
```

### Date Validation Rules

#### Rule 1: Start before End
```
Validation: start_date must be < end_date
Error: "Start date must be before end date"
Example:
✓ Valid: start=2026-01-01, end=2026-01-31
✗ Invalid: start=2026-01-31, end=2026-01-01
```

#### Rule 2: Pay Date After End
```
Validation: pay_date should be >= end_date
Warning: "Pay date before period end (unusual)"
Typical: pay_date in following month
Example:
✓ Typical: end=2026-01-31, pay=2026-02-05
✓ Valid: end=2026-01-31, pay=2026-01-25 (same month)
⚠ Unusual: end=2026-01-31, pay=2026-01-15 (before end)
```

#### Rule 3: Date Consistency with Period
```
Validation: Dates align with period_month and period_year
Check:
- start_date.month == period_month
- start_date.year == period_year
- end_date.month == period_month
- end_date.year == period_year
```

### Sri Lanka Business Calendar Considerations

#### Weekends
- Saturday: Weekend
- Sunday: Weekend
- Public holidays: Vary by year
- Mercantile holidays: Bank holidays

#### Pay Date Adjustment
```
If pay_date is Saturday or Sunday:
- Option 1: Move to previous Friday
- Option 2: Move to next Monday
- LankaCommerce default: Previous Friday
```

### Expected Outcome
- Date fields added to PayrollPeriod model
- Clear temporal boundaries for payroll period
- Foundation for attendance tracking integration
- Support for payment scheduling
- Date validation in place

### Verification Checklist
- [ ] start_date field added
- [ ] end_date field added
- [ ] pay_date field added
- [ ] All date fields have help_text
- [ ] clean() method validates date logic
- [ ] Validation: start_date < end_date
- [ ] Validation: pay_date timing checked
- [ ] Model docstring updated
- [ ] Date fields integrated with period_month/year

---

## Task 05: Add Period Name Field

### Overview
Add a human-readable name field to the PayrollPeriod model that provides a clear, user-friendly identifier for the payroll period. This field improves usability in the UI and makes period selection more intuitive for HR staff and managers.

### Dependencies
- Task 03: Create PayrollPeriod Model
- Task 04: Add Period Date Fields

### Instructions

1. **Open payroll_period.py model file**
   - Navigate to `apps/payroll/models/payroll_period.py`
   - Locate the PayrollPeriod model class
   - Position after period_year field, before date fields

2. **Add name field**
   - Type: CharField
   - max_length: 50
   - Purpose: Human-readable period identifier
   - Nullable: False (required)
   - Help text: "Human-readable name (e.g., 'January 2026')"

3. **Add db_index to name field**
   - Enable fast searching by name
   - Useful for autocomplete and filtering

4. **Create name generation method**
   - Method name: `generate_name()`
   - Purpose: Auto-generate name from month/year
   - Return format: "Month_Name Year"
   - Example: "January 2026", "December 2025"

5. **Use month name from calendar**
   - Import calendar module
   - Use calendar.month_name[month] for month name
   - Combine with year as string

6. **Override save method**
   - Auto-populate name if not provided
   - Call generate_name() before first save
   - Preserve manual name changes

7. **Update __str__ method**
   - Use name field for representation
   - Format: "Tenant Name - Period Name"
   - Example: "ABC Company - January 2026"

### Name Field Purpose

| Purpose | Example | Use Case |
|---------|---------|----------|
| Display | "January 2026" | UI dropdowns, lists |
| Selection | "February 2026" | Period picker |
| Reporting | "Q1 2026 - Jan" | Financial reports |
| Search | "Jan", "2026" | Quick search/filter |

### Name Generation Logic

```
Input:
- period_month = 1
- period_year = 2026

Process:
1. Import calendar module
2. Get month_name: calendar.month_name[1] = "January"
3. Concatenate: "January 2026"

Output:
- name = "January 2026"
```

### Month Name Mapping

| Month Number | Month Name | Generated Name Example |
|--------------|------------|------------------------|
| 1 | January | January 2026 |
| 2 | February | February 2026 |
| 3 | March | March 2026 |
| 4 | April | April 2026 |
| 5 | May | May 2026 |
| 6 | June | June 2026 |
| 7 | July | July 2026 |
| 8 | August | August 2026 |
| 9 | September | September 2026 |
| 10 | October | October 2026 |
| 11 | November | November 2026 |
| 12 | December | December 2026 |

### Name Customization Options

#### Standard Format
```
Format: "Month Year"
Examples:
- "January 2026"
- "February 2026"
- "December 2025"
```

#### Short Month Format
```
Format: "Mon YYYY"
Examples:
- "Jan 2026"
- "Feb 2026"
- "Dec 2025"
```

#### Quarter Format (Optional Extension)
```
Format: "Q# YYYY - Month"
Examples:
- "Q1 2026 - January"
- "Q2 2026 - April"
- "Q4 2025 - October"
```

#### Custom Names (Manual Override)
```
Examples:
- "Jan 2026 - Special Bonus"
- "Year-End 2025"
- "Mid-Year Review 2026"

Purpose: Distinguish special payroll runs
```

### UI Integration

#### Dropdown Selection
```
Display: Name field in select options
Sort: By period_year DESC, period_month DESC
Example dropdown:
┌──────────────────────┐
│ January 2026         │
│ December 2025        │
│ November 2025        │
│ October 2025         │
└──────────────────────┘
```

#### Period List View
```
Columns:
| Period Name     | Status     | Pay Date   | Actions   |
|----------------|------------|------------|-----------|
| January 2026   | Finalized  | 2026-02-05 | View      |
| December 2025  | Finalized  | 2026-01-05 | View      |
| November 2025  | Finalized  | 2025-12-05 | View      |
```

#### Search and Filter
```
Search by:
- Name: "January", "Jan", "2026"
- Year: "2026"
- Month name: "January"

Quick filters:
- Current month
- Last 3 months
- Current year
- Last year
```

### Auto-Population Logic

#### On Create (save method)
```
def save(self, *args, **kwargs):
    if not self.name:
        self.name = self.generate_name()
    super().save(*args, **kwargs)

Result:
- Name auto-generated if empty
- Manual names preserved
- Consistent naming across system
```

#### Generate Name Method
```
def generate_name(self):
    import calendar
    month_name = calendar.month_name[self.period_month]
    return f"{month_name} {self.period_year}"

Examples:
- month=1, year=2026 → "January 2026"
- month=12, year=2025 → "December 2025"
```

### Localization Considerations

#### English (Default)
```
Month names: January, February, March, etc.
Format: "January 2026"
```

#### Sinhala Support (Future)
```
Month names: ජනවාරි, පෙබරවාරි, මාර්තු, etc.
Format: "ජනවාරි 2026"
Note: Requires i18n configuration
```

### Expected Outcome
- Human-readable name field added
- Auto-generation from month/year
- Improved UI/UX for period selection
- Support for manual name customization
- Efficient searching and filtering

### Verification Checklist
- [ ] name CharField added (max_length=50)
- [ ] db_index=True for fast searching
- [ ] generate_name() method created
- [ ] save() method auto-populates name
- [ ] calendar module imported for month names
- [ ] __str__ method uses name field
- [ ] Help text documented
- [ ] Manual name override supported

---

## Task 06: Add Period Status Field

### Overview
Add the status field to the PayrollPeriod model that tracks the current state of the payroll period through its lifecycle. This field enables workflow management, access control, and ensures proper sequencing of payroll processing stages.

### Dependencies
- Task 02: Define PayrollStatus Choices
- Task 03: Create PayrollPeriod Model

### Instructions

1. **Open payroll_period.py model file**
   - Navigate to `apps/payroll/models/payroll_period.py`
   - Locate the PayrollPeriod model class
   - Position after name field

2. **Add status field**
   - Type: CharField
   - max_length: 20
   - choices: PAYROLL_STATUS_CHOICES (from constants)
   - default: STATUS_DRAFT
   - Purpose: Track payroll period lifecycle
   - db_index: True (for filtering)
   - Help text: "Current status of the payroll period"

3. **Import status choices**
   - Import from apps.payroll.constants
   - Import PAYROLL_STATUS_CHOICES
   - Import individual status constants (STATUS_DRAFT, etc.)

4. **Add status transition methods**
   - Create method: `can_process()` - Check if can start processing
   - Create method: `can_approve()` - Check if can approve
   - Create method: `can_finalize()` - Check if can finalize
   - Create method: `can_reverse()` - Check if can reverse

5. **Add status change methods**
   - Method: `mark_as_processing()` - Set to PROCESSING
   - Method: `mark_as_processed()` - Set to PROCESSED
   - Method: `mark_as_approved()` - Set to APPROVED
   - Method: `mark_as_finalized()` - Set to FINALIZED
   - Method: `mark_as_reversed()` - Set to REVERSED

6. **Add status query methods**
   - Property: `is_draft` - Check if status is DRAFT
   - Property: `is_processing` - Check if status is PROCESSING
   - Property: `is_processed` - Check if status is PROCESSED
   - Property: `is_approved` - Check if status is APPROVED
   - Property: `is_finalized` - Check if status is FINALIZED
   - Property: `is_reversible` - Check if can be reversed

7. **Update Meta class**
   - Add index on status field for efficient filtering
   - Consider composite index (tenant, status) for queries

### Status Field Configuration

| Property | Value | Purpose |
|----------|-------|---------|
| Field Type | CharField | Store status code |
| Max Length | 20 | Accommodate status values |
| Choices | PAYROLL_STATUS_CHOICES | Dropdown options |
| Default | STATUS_DRAFT | Initial state |
| db_index | True | Fast status filtering |
| Null | False | Always required |

### Status Transition Methods

#### can_process()
```
Purpose: Check if period can be processed
Returns: Boolean
Logic:
- Status must be DRAFT or PROCESSED
- Period not locked
- All required data present
```

#### can_approve()
```
Purpose: Check if period can be approved
Returns: Boolean
Logic:
- Status must be PROCESSED
- Period not locked
- User has approval permission
```

#### can_finalize()
```
Purpose: Check if period can be finalized
Returns: Boolean
Logic:
- Status must be APPROVED
- Period not locked
- All employee payrolls validated
```

#### can_reverse()
```
Purpose: Check if period can be reversed
Returns: Boolean
Logic:
- Status is FINALIZED
- User has admin permission
- Within reversal window (e.g., 30 days)
```

### Status Change Methods

#### mark_as_processing()
```
Purpose: Set status to PROCESSING
Validation: can_process() returns True
Actions:
- Set status = STATUS_PROCESSING
- Save period
- Log status change
- Trigger processing Celery task
```

#### mark_as_processed()
```
Purpose: Set status to PROCESSED
Validation: Status is currently PROCESSING
Actions:
- Set status = STATUS_PROCESSED
- Save period
- Log completion
- Send notification to approvers
```

#### mark_as_approved()
```
Purpose: Set status to APPROVED
Validation: can_approve() returns True
Actions:
- Set status = STATUS_APPROVED
- Save period
- Log approval with approver user
- Notify HR for finalization
```

#### mark_as_finalized()
```
Purpose: Set status to FINALIZED
Validation: can_finalize() returns True
Actions:
- Set status = STATUS_FINALIZED
- Set is_locked = True
- Set locked_at = now()
- Set locked_by = current user
- Save period
- Log finalization
- Trigger payment notifications
```

#### mark_as_reversed()
```
Purpose: Set status to REVERSED
Validation: can_reverse() returns True
Actions:
- Set status = STATUS_REVERSED
- Save period
- Log reversal with reason
- Create corrective period
```

### Status Query Properties

#### is_draft
```
@property
def is_draft(self):
    return self.status == STATUS_DRAFT

Usage: if period.is_draft: show_edit_button()
```

#### is_processing
```
@property
def is_processing(self):
    return self.status == STATUS_PROCESSING

Usage: if period.is_processing: show_spinner()
```

#### is_finalized
```
@property
def is_finalized(self):
    return self.status == STATUS_FINALIZED

Usage: if period.is_finalized: lock_fields()
```

#### is_reversible
```
@property
def is_reversible(self):
    return self.is_finalized and not self.is_locked

Usage: if period.is_reversible: show_reverse_button()
```

### Status-Based Access Control

#### Edit Permission
```
Can edit when:
- Status = DRAFT
- Status = PROCESSED (with permission)
- User is admin

Cannot edit when:
- Status = PROCESSING
- Status = FINALIZED
- is_locked = True
```

#### Process Permission
```
Can process when:
- Status = DRAFT
- User has payroll_process permission
- Period not locked

Cannot process when:
- Status = PROCESSING (already running)
- Status = FINALIZED
```

#### Approval Permission
```
Can approve when:
- Status = PROCESSED
- User in PayrollSettings.approvers
- User has payroll_approve permission

Cannot approve when:
- Status != PROCESSED
- User not authorized
```

### Status Filtering Queries

#### Active Periods
```
Query: Filter for periods needing action
Status: DRAFT or PROCESSED
Purpose: Show periods requiring processing or approval
```

#### Completed Periods
```
Query: Filter for finalized periods
Status: FINALIZED
Purpose: Historical view, reporting
```

#### In-Progress Periods
```
Query: Filter for processing periods
Status: PROCESSING
Purpose: Show active Celery tasks
```

### Expected Outcome
- Status field tracks payroll period lifecycle
- Workflow validation through transition methods
- Status-based access control enabled
- Query helpers for filtering periods
- Foundation for approval workflow

### Verification Checklist
- [ ] status CharField added
- [ ] PAYROLL_STATUS_CHOICES imported
- [ ] Default status set to STATUS_DRAFT
- [ ] db_index=True for filtering
- [ ] can_process() method created
- [ ] can_approve() method created
- [ ] can_finalize() method created
- [ ] mark_as_processing() method created
- [ ] mark_as_processed() method created
- [ ] mark_as_approved() method created
- [ ] mark_as_finalized() method created
- [ ] is_draft property created
- [ ] is_finalized property created
- [ ] Status transition validation implemented

---

## Task 07: Add Period Lock Fields

### Overview
Add locking mechanism fields to the PayrollPeriod model that prevent modifications to finalized periods. This ensures data integrity, maintains audit trails, and protects completed payroll calculations from accidental or unauthorized changes.

### Dependencies
- Task 03: Create PayrollPeriod Model
- Task 06: Add Period Status Field
- User model exists (Django auth or custom)

### Instructions

1. **Open payroll_period.py model file**
   - Navigate to `apps/payroll/models/payroll_period.py`
   - Locate the PayrollPeriod model class
   - Position after status field

2. **Add is_locked field**
   - Type: BooleanField
   - default: False
   - Purpose: Master lock flag
   - db_index: True (for filtering)
   - Help text: "Locked periods cannot be modified"

3. **Add locked_at field**
   - Type: DateTimeField
   - null: True, blank: True
   - Purpose: Timestamp when period was locked
   - Audit trail for lock action

4. **Add locked_by field**
   - Type: ForeignKey to User model
   - null: True, blank: True
   - on_delete: SET_NULL (preserve record if user deleted)
   - related_name: 'locked_payroll_periods'
   - Purpose: Track who locked the period

5. **Add notes field**
   - Type: TextField
   - blank: True, default: ''
   - Purpose: Lock reason, special instructions
   - Help text: "Internal notes about this period"

6. **Create lock method**
   - Method name: `lock(user, reason=None)`
   - Set is_locked = True
   - Set locked_at = timezone.now()
   - Set locked_by = user
   - Add reason to notes if provided
   - Save period

7. **Create unlock method**
   - Method name: `unlock(user, reason=None)`
   - Validate user has permission
   - Set is_locked = False
   - Append unlock reason to notes
   - Save period
   - Log unlock action

8. **Add lock validation to save method**
   - Override save method
   - Check if is_locked = True
   - Prevent updates to locked periods (except unlock)
   - Raise PermissionDenied if attempt to modify

9. **Add lock query helpers**
   - Manager method: `unlocked()` - Filter unlocked periods
   - Manager method: `locked()` - Filter locked periods
   - Property: `can_unlock` - Check if user can unlock

### Lock Fields Configuration

| Field | Type | Null | Purpose |
|-------|------|------|---------|
| is_locked | BooleanField | False | Master lock flag |
| locked_at | DateTimeField | True | Lock timestamp |
| locked_by | ForeignKey(User) | True | Lock actor |
| notes | TextField | True | Lock reason, notes |

### Locking Workflow

```
Period Created (DRAFT)
    │
    ▼
Processing & Approval
    │
    ▼
Finalization Action
    │
    ├─ Set status = FINALIZED
    ├─ Set is_locked = True
    ├─ Set locked_at = now()
    └─ Set locked_by = current_user
    │
    ▼
Locked Period (Immutable)
    │
    ▼ (Admin only)
Unlock for Correction
    │
    ├─ Set is_locked = False
    ├─ Add unlock reason to notes
    └─ Log unlock action
    │
    ▼
Re-lock After Correction
```

### Lock Method Implementation

#### lock(user, reason=None)
```
Purpose: Lock the period to prevent modifications
Parameters:
- user: User performing lock action
- reason: Optional reason for locking

Logic:
1. Validate status is APPROVED or higher
2. Set is_locked = True
3. Set locked_at = timezone.now()
4. Set locked_by = user
5. If reason provided, append to notes
6. Save period
7. Log lock action

Example:
period.lock(request.user, "Payroll finalized for payment")
```

#### unlock(user, reason=None)
```
Purpose: Unlock the period for corrections
Parameters:
- user: User performing unlock action
- reason: Required reason for unlocking

Logic:
1. Validate user has admin/unlock permission
2. Require reason parameter
3. Set is_locked = False
4. Append unlock reason to notes with timestamp
5. Save period
6. Log unlock action with reason

Example:
period.unlock(admin_user, "Correction needed for employee X")
```

### Lock Validation Rules

#### Rule 1: Lock Status Requirement
```
Validation: Period must be APPROVED or FINALIZED to lock
Error: "Cannot lock period with status: DRAFT"

Valid statuses for locking:
✓ APPROVED
✓ FINALIZED

Invalid statuses for locking:
✗ DRAFT
✗ PROCESSING
✗ PROCESSED
```

#### Rule 2: Modification Prevention
```
Validation: Locked periods cannot be modified
Error: "Cannot modify locked payroll period"

Allowed on locked period:
✓ Read operations
✓ Unlock operation (with permission)

Blocked on locked period:
✗ Field updates
✗ Status changes
✗ Re-processing
✗ Deletion
```

#### Rule 3: Unlock Permission
```
Validation: Only admin/manager can unlock
Error: "Insufficient permission to unlock period"

Required permissions:
- payroll.unlock_period
- Or: is_staff = True
- Or: User in PayrollSettings.approvers
```

### Lock Integration with Status

| Status | Auto-Lock | Can Unlock | Can Modify |
|--------|-----------|------------|------------|
| DRAFT | No | N/A | ✓ Yes |
| PROCESSING | No | N/A | ✗ No |
| PROCESSED | No | N/A | ✓ Yes (limited) |
| APPROVED | Optional | ✓ Admin | ✗ No |
| FINALIZED | Yes | ✓ Admin | ✗ No |
| REVERSED | Yes | ✗ No | ✗ No |

### Notes Field Usage

#### Lock Reason Example
```
Format: "[timestamp] Locked by [user]: [reason]"

Example:
"[2026-01-25 14:30] Locked by admin@company.lk: 
Payroll finalized for January 2026 payment processing."
```

#### Unlock Reason Example
```
Format: "[timestamp] Unlocked by [user]: [reason]"

Example:
"[2026-01-26 09:15] Unlocked by hr.manager@company.lk: 
Correction needed - Employee overtime miscalculated."
```

#### Multiple Actions
```
Combined notes showing history:

"[2026-01-25 14:30] Locked by admin@company.lk: 
Payroll finalized for January 2026.

[2026-01-26 09:15] Unlocked by hr.manager@company.lk: 
Overtime correction for Emp-001.

[2026-01-26 11:45] Locked by admin@company.lk: 
Re-locked after corrections applied."
```

### Query Helpers

#### Unlocked Periods
```
Purpose: Get periods available for editing
Usage: PayrollPeriod.objects.unlocked()
Filter: is_locked = False
```

#### Locked Periods
```
Purpose: Get immutable historical periods
Usage: PayrollPeriod.objects.locked()
Filter: is_locked = True
```

#### Can Unlock Property
```
@property
def can_unlock(self, user):
    return (
        self.is_locked and 
        (user.is_staff or user.has_perm('payroll.unlock_period'))
    )

Usage: 
if period.can_unlock(request.user):
    show_unlock_button()
```

### Audit Trail

#### Lock Event
```
Log entry:
- Event: "Period Locked"
- Period: January 2026
- User: admin@company.lk
- Timestamp: 2026-01-25 14:30:15
- Reason: "Finalized for payment"
```

#### Unlock Event
```
Log entry:
- Event: "Period Unlocked"
- Period: January 2026
- User: hr.manager@company.lk
- Timestamp: 2026-01-26 09:15:22
- Reason: "Overtime correction needed"
- Original Lock: 2026-01-25 by admin@company.lk
```

### Expected Outcome
- Lock mechanism prevents unauthorized modifications
- Audit trail tracks who locked/unlocked when
- Admin override capability for corrections
- Notes field provides context for actions
- Data integrity maintained for finalized payroll

### Verification Checklist
- [ ] is_locked BooleanField added
- [ ] locked_at DateTimeField added
- [ ] locked_by ForeignKey added
- [ ] notes TextField added
- [ ] lock(user, reason) method created
- [ ] unlock(user, reason) method created
- [ ] Save method validates lock status
- [ ] unlocked() manager method created
- [ ] locked() manager method created
- [ ] can_unlock property implemented
- [ ] Lock prevents period modifications
- [ ] Audit trail in notes field

---

## Task 08: Add Period Working Days

### Overview
Add the total_working_days field to the PayrollPeriod model that stores the calculated number of working days in the period. This field is essential for pro-rated salary calculations, attendance-based deductions, and various payroll computations.

### Dependencies
- Task 03: Create PayrollPeriod Model
- Task 04: Add Period Date Fields

### Instructions

1. **Open payroll_period.py model file**
   - Navigate to `apps/payroll/models/payroll_period.py`
   - Locate the PayrollPeriod model class
   - Position after pay_date field

2. **Add total_working_days field**
   - Type: IntegerField
   - default: 0
   - Purpose: Total working days in period
   - Help text: "Total working days in this payroll period"
   - Used for pro-rata calculations

3. **Create working days calculation method**
   - Method name: `calculate_working_days()`
   - Returns: Integer (number of working days)
   - Logic: Count weekdays between start_date and end_date
   - Exclude: Saturdays, Sundays
   - Exclude: Public holidays (future integration)

4. **Implement weekday calculation logic**
   - Import datetime utilities
   - Iterate through date range
   - Check if day is weekday (Monday-Friday)
   - Increment counter for each working day

5. **Add public holiday integration (placeholder)**
   - Create method: `get_public_holidays()`
   - Returns: List of holiday dates in period
   - Initially return empty list
   - Future: Query HolidayCalendar model

6. **Override save method to auto-calculate**
   - Before saving, check if start_date and end_date exist
   - Auto-calculate total_working_days if not set
   - Call calculate_working_days()
   - Store result in field

7. **Add recalculation method**
   - Method name: `recalculate_working_days()`
   - Force recalculation of working days
   - Update field with new value
   - Save period

8. **Add working days property helpers**
   - Property: `working_days_ratio` - Ratio to 30-day month
   - Property: `average_days_per_week` - Average working days per week

### Working Days Field Configuration

| Property | Value | Purpose |
|----------|-------|---------|
| Field Type | IntegerField | Store day count |
| Default | 0 | Placeholder before calculation |
| Null | False | Always required |
| Help Text | "Total working days..." | User guidance |

### Working Days Calculation Logic

#### Standard Month Calculation
```
Input:
- start_date: 2026-01-01 (Thursday)
- end_date: 2026-01-31 (Saturday)

Process:
1. Total days: 31
2. Count weekends:
   - Saturdays: Jan 3, 10, 17, 24, 31 (5 days)
   - Sundays: Jan 4, 11, 18, 25 (4 days)
   - Weekend days: 9 total
3. Count weekdays: 31 - 9 = 22
4. Subtract public holidays: 0 (none in January)

Output:
- total_working_days = 22
```

#### With Public Holidays
```
Input:
- start_date: 2026-04-01
- end_date: 2026-04-30
- Public holidays: Apr 14 (New Year), Apr 15 (Holiday)

Process:
1. Total days: 30
2. Weekend days: 8
3. Weekdays: 22
4. Public holidays (weekdays only): 2
5. Working days: 22 - 2 = 20

Output:
- total_working_days = 20
```

### Calculate Working Days Method

```
def calculate_working_days(self):
    Purpose: Count working days in period
    Returns: Integer
    
    Logic:
    1. Initialize counter = 0
    2. Get holiday dates for period
    3. Loop from start_date to end_date:
       a. Check if date is weekday (Mon-Fri)
       b. Check if date not in holidays
       c. If both true, increment counter
    4. Return counter
    
    Weekday check:
    - Monday = 0
    - Tuesday = 1
    - Wednesday = 2
    - Thursday = 3
    - Friday = 4
    - Saturday = 5 (exclude)
    - Sunday = 6 (exclude)
```

### Sri Lanka Business Calendar

#### Standard Weekends
```
Saturday: Weekend day
Sunday: Weekend day
Total: 2 days per week
```

#### Public Holidays (Examples)
```
January:
- Pongal/Thai Pongal (mid-Jan)

April:
- Sinhala & Tamil New Year (Apr 13-14)

May:
- May Day (May 1)
- Vesak (May full moon)

December:
- Christmas (Dec 25)

Note: Some holidays lunar-based, dates vary
```

#### Mercantile Holidays
```
Bank holidays specific to financial sector
Typically align with public holidays
May have additional closures
```

### Working Days Properties

#### working_days_ratio
```
@property
def working_days_ratio(self):
    Purpose: Ratio to standard 30-day month
    Returns: Float
    Calculation: total_working_days / 30.0
    
    Example:
    - total_working_days = 22
    - ratio = 22 / 30 = 0.733
    
    Usage: Pro-rata salary calculations
```

#### average_days_per_week
```
@property
def average_days_per_week(self):
    Purpose: Average working days per week
    Returns: Float
    Calculation: total_working_days / (period_weeks)
    
    Example:
    - total_working_days = 22
    - period_weeks = 4.43 (31 days / 7)
    - average = 22 / 4.43 = 4.97 days/week
    
    Usage: Weekly attendance reports
```

### Salary Pro-Ration Examples

#### Full Month Salary
```
Employee:
- Monthly salary: LKR 100,000
- Working days in period: 22
- Days worked: 22
- Calculation: (100,000 / 22) × 22 = 100,000
- Payable: LKR 100,000
```

#### Partial Month (Mid-Month Join)
```
Employee:
- Monthly salary: LKR 100,000
- Working days in period: 22
- Days worked: 10 (joined mid-month)
- Calculation: (100,000 / 22) × 10 = 45,454.55
- Payable: LKR 45,455
```

#### Absence Deduction
```
Employee:
- Monthly salary: LKR 100,000
- Working days in period: 22
- Days absent (unpaid): 3
- Days worked: 19
- Calculation: (100,000 / 22) × 19 = 86,363.64
- Payable: LKR 86,364
```

### Integration with Holiday Calendar (Future)

#### HolidayCalendar Model (Future)
```
Model structure:
- tenant: FK to Client
- name: "Sinhala New Year"
- date: 2026-04-14
- is_mandatory: True
- applies_to: "all" or "department"

Query:
holidays = HolidayCalendar.objects.filter(
    tenant=self.tenant,
    date__gte=self.start_date,
    date__lte=self.end_date
)
```

#### Working Days Adjustment
```
Current: Exclude weekends only
Future: Exclude weekends + holidays

Logic:
working_days = weekdays - public_holidays - mercantile_holidays
```

### Recalculation Scenarios

#### Scenario 1: Date Changes
```
Trigger: start_date or end_date modified
Action: Call recalculate_working_days()
Result: Updated total_working_days
```

#### Scenario 2: Holiday Addition
```
Trigger: New public holiday added for period
Action: Recalculate all periods for affected month
Result: Adjusted working days count
```

#### Scenario 3: Correction
```
Trigger: Manual correction needed
Action: Admin calls recalculate_working_days()
Result: Validated working days count
```

### Expected Outcome
- Working days automatically calculated
- Accurate pro-rata salary calculations
- Weekend exclusion implemented
- Foundation for holiday integration
- Recalculation capability available

### Verification Checklist
- [ ] total_working_days IntegerField added
- [ ] calculate_working_days() method created
- [ ] Weekday detection logic implemented
- [ ] Weekend days excluded (Sat, Sun)
- [ ] save() method auto-calculates working days
- [ ] recalculate_working_days() method added
- [ ] working_days_ratio property created
- [ ] get_public_holidays() placeholder created
- [ ] Default value set to 0

---

## Task 09: Run PayrollPeriod Migrations

### Overview
Generate and apply Django migrations for the PayrollPeriod model. This task creates the database table structure with all fields, indexes, and constraints defined in previous tasks, making the model operational in the database.

### Dependencies
- Task 03: Create PayrollPeriod Model
- Task 04: Add Period Date Fields
- Task 05: Add Period Name Field
- Task 06: Add Period Status Field
- Task 07: Add Period Lock Fields
- Task 08: Add Period Working Days
- PostgreSQL database configured
- Django multi-tenancy configured

### Instructions

1. **Verify model completeness**
   - Review PayrollPeriod model in `payroll_period.py`
   - Confirm all fields from Tasks 03-08 are present
   - Check imports are complete
   - Verify model is imported in models/__init__.py

2. **Generate migration file**
   - Open terminal in project root
   - Activate virtual environment
   - Run makemigrations command for payroll app
   - Command: `python manage.py makemigrations payroll`

3. **Review generated migration**
   - Navigate to `apps/payroll/migrations/`
   - Open newest migration file (e.g., `0012_payroll_period.py`)
   - Verify all fields are included
   - Check foreign key relationships
   - Confirm indexes are created
   - Verify unique_together constraint

4. **Check migration for schema awareness**
   - Ensure migration compatible with django-tenants
   - Verify table created in tenant schemas
   - Not in public schema (unless intentional)

5. **Apply migration to database**
   - Run migrate command
   - Command: `python manage.py migrate payroll`
   - Observe migration application output
   - Confirm successful completion

6. **Verify table creation**
   - Connect to PostgreSQL database
   - Check table exists: `\dt payroll_periods`
   - Verify columns: `\d payroll_periods`
   - Confirm indexes created
   - Check constraints

7. **Test model in Django shell**
   - Open Django shell: `python manage.py shell`
   - Import PayrollPeriod model
   - Create test instance
   - Verify save and retrieval
   - Test unique constraint

8. **Document migration**
   - Note migration number for reference
   - Document any special considerations
   - Update deployment checklist

### Migration Commands

#### Generate Migrations
```bash
Command: python manage.py makemigrations payroll

Purpose: Create migration file for model changes

Output:
Migrations for 'payroll':
  apps/payroll/migrations/0012_payroll_period.py
    - Create model PayrollPeriod

Checks:
- Model defined correctly
- Fields validated
- Foreign keys resolved
- No conflicts with existing migrations
```

#### Show Migration SQL
```bash
Command: python manage.py sqlmigrate payroll 0012

Purpose: Preview SQL that will be executed

Output: CREATE TABLE statements, indexes, constraints

Use: Verify correct table structure before applying
```

#### Apply Migrations
```bash
Command: python manage.py migrate payroll

Purpose: Execute migration, create database table

Output:
Running migrations:
  Applying payroll.0012_payroll_period... OK

Checks:
- Database connection successful
- Permissions sufficient
- No table conflicts
```

### Expected Migration File Structure

```python
# apps/payroll/migrations/0012_payroll_period.py

from django.db import migrations, models
import django.db.models.deletion

class Migration(migrations.Migration):
    
    dependencies = [
        ('payroll', '0011_previous_migration'),
        ('tenants', '0001_initial'),  # Client model
        ('auth', '0012_user'),  # User model
    ]
    
    operations = [
        migrations.CreateModel(
            name='PayrollPeriod',
            fields=[
                ('id', models.BigAutoField(...)),
                ('tenant', models.ForeignKey(...)),
                ('period_month', models.IntegerField(...)),
                ('period_year', models.IntegerField(...)),
                ('start_date', models.DateField(...)),
                ('end_date', models.DateField(...)),
                ('pay_date', models.DateField(...)),
                ('name', models.CharField(...)),
                ('status', models.CharField(...)),
                ('is_locked', models.BooleanField(...)),
                ('locked_at', models.DateTimeField(...)),
                ('locked_by', models.ForeignKey(...)),
                ('notes', models.TextField(...)),
                ('total_working_days', models.IntegerField(...)),
                ('created_at', models.DateTimeField(...)),
                ('updated_at', models.DateTimeField(...)),
            ],
            options={
                'db_table': 'payroll_periods',
                'verbose_name': 'Payroll Period',
                'verbose_name_plural': 'Payroll Periods',
                'ordering': ['-period_year', '-period_month'],
            },
        ),
        migrations.AddIndex(
            model_name='payrollperiod',
            index=models.Index(fields=['tenant', 'status'], name='payroll_per_tenant_status_idx'),
        ),
        migrations.AlterUniqueTogether(
            name='payrollperiod',
            unique_together={('tenant', 'period_month', 'period_year')},
        ),
    ]
```

### Database Table Structure

```sql
Table: payroll_periods

Columns:
- id: bigint (primary key, auto increment)
- tenant_id: bigint (foreign key to clients)
- period_month: integer (1-12)
- period_year: integer
- start_date: date
- end_date: date
- pay_date: date
- name: varchar(50)
- status: varchar(20)
- is_locked: boolean
- locked_at: timestamp (nullable)
- locked_by_id: bigint (nullable, foreign key to users)
- notes: text
- total_working_days: integer
- created_at: timestamp
- updated_at: timestamp

Indexes:
- PRIMARY KEY (id)
- INDEX (tenant_id, status)
- INDEX (name)
- INDEX (status)
- UNIQUE (tenant_id, period_month, period_year)

Foreign Keys:
- tenant_id REFERENCES clients(id) ON DELETE CASCADE
- locked_by_id REFERENCES users(id) ON DELETE SET NULL
```

### Verification Tests

#### Django Shell Test
```python
# Open shell
python manage.py shell

# Import model
from apps.payroll.models import PayrollPeriod
from apps.tenants.models import Client
from datetime import date

# Get tenant
tenant = Client.objects.first()

# Create period
period = PayrollPeriod.objects.create(
    tenant=tenant,
    period_month=1,
    period_year=2026,
    start_date=date(2026, 1, 1),
    end_date=date(2026, 1, 31),
    pay_date=date(2026, 2, 5),
)

# Verify
print(period)  # Should show: "Tenant - January 2026"
print(period.total_working_days)  # Should show calculated days
print(period.status)  # Should show: "draft"
print(period.is_locked)  # Should show: False
```

#### Unique Constraint Test
```python
# Try to create duplicate period
try:
    duplicate = PayrollPeriod.objects.create(
        tenant=tenant,
        period_month=1,
        period_year=2026,
        start_date=date(2026, 1, 1),
        end_date=date(2026, 1, 31),
        pay_date=date(2026, 2, 5),
    )
except Exception as e:
    print(f"Expected error: {e}")
    # Should raise: IntegrityError unique constraint violation
```

#### Query Test
```python
# Filter by tenant
periods = PayrollPeriod.objects.filter(tenant=tenant)
print(f"Found {periods.count()} periods")

# Filter by status
draft_periods = PayrollPeriod.objects.filter(status='draft')
print(f"Draft periods: {draft_periods.count()}")

# Order by date
recent = PayrollPeriod.objects.order_by('-period_year', '-period_month').first()
print(f"Most recent: {recent}")
```

### Multi-Tenancy Considerations

#### Tenant Schema Routing
```
With django-tenants:
- Table created in each tenant schema
- Not in public schema
- Automatic tenant filtering

Behavior:
- Tenant A: payroll_periods table
- Tenant B: payroll_periods table
- Public: No payroll_periods table
```

#### Migration Application
```
Shared migrations: Applied to public schema
Tenant migrations: Applied to all tenant schemas

PayrollPeriod:
- Tenant-specific model
- Applied to tenant schemas only
- Automatic via django-tenants
```

### Troubleshooting

#### Issue: Migration Fails
```
Error: django.db.utils.OperationalError: no such table

Solution:
1. Check database connection
2. Verify migrations directory exists
3. Run migrate command again
4. Check for conflicts with existing tables
```

#### Issue: Unique Constraint Error
```
Error: IntegrityError: duplicate key value violates unique constraint

Solution:
1. Check for existing periods with same month/year
2. Delete test data if needed
3. Verify unique_together constraint correct
```

#### Issue: Foreign Key Error
```
Error: ForeignKey constraint violation

Solution:
1. Verify Client model exists
2. Check User model accessible
3. Ensure dependencies in migration file
```

### Expected Outcome
- PayrollPeriod table created in database
- All fields, indexes, and constraints applied
- Model operational for CRUD operations
- Multi-tenancy correctly configured
- Migrations documented and versioned

### Verification Checklist
- [ ] makemigrations command successful
- [ ] Migration file generated (e.g., 0012_payroll_period.py)
- [ ] Migration file reviewed for correctness
- [ ] All fields present in migration
- [ ] Unique constraint included
- [ ] Indexes created
- [ ] migrate command successful
- [ ] Table exists in database
- [ ] Django shell test passed
- [ ] Unique constraint test passed
- [ ] Model ready for use in application

---

## Summary

This document established the complete PayrollPeriod model infrastructure with status management, date fields, human-readable naming, workflow tracking, locking mechanisms, and working days calculations. The model is now ready for integration with PayrollSettings and payroll processing logic.

### Completed Tasks
- ✓ Extended payroll app structure
- ✓ Defined PayrollStatus choices for workflow
- ✓ Created PayrollPeriod model with tenant isolation
- ✓ Added period date fields (start, end, pay)
- ✓ Implemented human-readable naming
- ✓ Integrated status field with workflow helpers
- ✓ Built locking mechanism with audit trail
- ✓ Calculated working days with weekend exclusion
- ✓ Applied database migrations

### Key Features
- Monthly payroll period management
- Six-stage status workflow (DRAFT → FINALIZED)
- Lock/unlock capability with audit trail
- Automatic working days calculation
- Tenant-specific periods with unique constraints
- Foundation for payroll processing automation

### Next Steps
Proceed to [02_Tasks-10-16_Settings-AutoGeneration.md](02_Tasks-10-16_Settings-AutoGeneration.md) to:
- Create PayrollSettings model
- Configure pay day and cutoff settings
- Implement approval requirements
- Build Celery task for automatic period generation
