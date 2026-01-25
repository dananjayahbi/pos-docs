# Tasks 65-69: Accounting Period Model

> **Phase:** 06 - ERP Advanced Modules  
> **SubPhase:** 09 - Journal Entries  
> **Group:** E - Approval & Posting  
> **Document:** 01 of 03  
> **Tasks Covered:** 65, 66, 67, 68, 69

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **→ Next Document:** [02_Tasks-70-74_Approval-Workflow.md](02_Tasks-70-74_Approval-Workflow.md)

---

## Document Overview

This document covers the implementation of the AccountingPeriod model, which manages fiscal periods for journal entry control. Accounting periods define date ranges with open/closed/locked status, enabling proper period-end closing procedures and preventing entries in closed periods.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 65 | Create AccountingPeriod Model | Medium | 30 min |
| 66 | Add Period Date Range | Low | 15 min |
| 67 | Add Period Status | Low | 20 min |
| 68 | Add Period Year/Month | Low | 15 min |
| 69 | Run Period Migrations | Low | 5 min |

---

## Task 65: Create AccountingPeriod Model

### Overview
Create the AccountingPeriod model that defines fiscal periods for accounting operations. Periods control which date ranges accept journal entries and enforce proper closing procedures at month-end and year-end.

### Dependencies
- Task 64: Recurring entry Celery task completed
- Multi-tenancy base model available
- Django models framework

### Instructions

1. **Create accounting_period.py file**
   - Navigate to `apps/accounting/models/` directory
   - Create new file named `accounting_period.py`
   - This will contain the AccountingPeriod model

2. **Import required dependencies**
   - Import Django model components
   - Import TenantAwareModel from core.models
   - Import date and datetime utilities
   - Import ValidationError for period validation

3. **Define AccountingPeriod class**
   - Inherit from TenantAwareModel
   - Add comprehensive class docstring
   - Explain fiscal period management purpose

4. **Add Meta class configuration**
   - Set database table name: 'accounting_periods'
   - Define verbose names (singular and plural)
   - Set default ordering by start_date descending
   - Add unique constraint on (tenant, fiscal_year, period_number)

5. **Prepare for field additions**
   - Date range fields (start_date, end_date)
   - Status field (OPEN, CLOSED, LOCKED)
   - Fiscal year and period identification
   - Validation methods for date logic

### Model Purpose

| Aspect | Purpose |
|--------|---------|
| Period Control | Define when entries can be posted |
| Closing Process | Support month-end and year-end closing |
| Audit Compliance | Lock periods post-audit |
| Financial Reporting | Group transactions by period |

### Accounting Period Concepts

#### Fiscal Year
```
Standard fiscal year organization:
- Calendar Year: January 1 to December 31
- Sri Lanka Standard: April 1 to March 31
- Custom: Any 12-month period

Each fiscal year contains 12 periods (months)
```

#### Period Numbering
```
Calendar Year Example:
- Period 1: January (Jan 1 - Jan 31)
- Period 2: February (Feb 1 - Feb 28/29)
- ...
- Period 12: December (Dec 1 - Dec 31)

Sri Lanka Fiscal Year Example:
- Period 1: April (Apr 1 - Apr 30)
- Period 2: May (May 1 - May 31)
- ...
- Period 12: March (Mar 1 - Mar 31)
```

#### Period Status Lifecycle
```
New Period: OPEN
    │
    ├─→ Regular posting allowed
    │   All entry types accepted
    │
    ▼
Month-End Closing: CLOSED
    │
    ├─→ No regular entries
    │   Adjusting entries only
    │   Reversing entries allowed
    │
    ▼
Year-End Audit: LOCKED
    │
    └─→ No changes allowed
        Read-only for reporting
        Cannot reopen without authorization
```

### Expected Outcome
- Base AccountingPeriod model created
- Proper inheritance and configuration
- Meta settings for uniqueness
- Ready for field additions

### Verification Checklist
- [ ] `accounting_period.py` file created
- [ ] AccountingPeriod class defined
- [ ] Inherits from TenantAwareModel
- [ ] Class docstring added
- [ ] Meta class configured
- [ ] Table name set correctly
- [ ] Unique constraint planned for tenant/year/period

---

## Task 66: Add Period Date Range

### Overview
Add start_date and end_date fields to define the period's date boundaries. These fields determine which transaction dates fall within the period and control entry posting.

### Dependencies
- Task 65: AccountingPeriod model must exist

### Instructions

1. **Open accounting_period.py file**
   - Navigate to AccountingPeriod model class
   - Add date range fields

2. **Add start_date field**
   - Type: DateField
   - Required field (not nullable)
   - No default (must be explicitly set)
   - Help text: "First day of accounting period"
   - Will be indexed for queries

3. **Add end_date field**
   - Type: DateField
   - Required field (not nullable)
   - No default (must be explicitly set)
   - Help text: "Last day of accounting period"
   - Will be indexed for queries

4. **Add name field**
   - Type: CharField
   - Max length: 50 characters
   - Optional field (can be auto-generated)
   - Example: "January 2026", "FY2026-Q1"
   - Help text: "Period name for display"

5. **Add date validation method**
   - Create clean() method
   - Validate end_date > start_date
   - Validate no overlapping periods for tenant
   - Raise ValidationError if invalid

### Field Specifications

| Field | Type | Required | Indexed | Purpose |
|-------|------|----------|---------|---------|
| start_date | DateField | Yes | Yes | Period start |
| end_date | DateField | Yes | Yes | Period end |
| name | CharField(50) | No | No | Display name |

### Date Range Examples

#### Monthly Periods
```
January 2026:
- start_date: 2026-01-01
- end_date: 2026-01-31
- name: "January 2026"

February 2026 (non-leap year):
- start_date: 2026-02-01
- end_date: 2026-02-28
- name: "February 2026"

February 2028 (leap year):
- start_date: 2028-02-01
- end_date: 2028-02-29
- name: "February 2028"
```

#### Custom Period Lengths
```
4-Week Period:
- start_date: 2026-01-01
- end_date: 2026-01-28
- name: "Period 1 (4 weeks)"

5-Week Period:
- start_date: 2026-01-29
- end_date: 2026-03-04
- name: "Period 2 (5 weeks)"
```

#### Quarter Periods
```
Q1 2026:
- start_date: 2026-01-01
- end_date: 2026-03-31
- name: "Q1 2026"

Q2 2026:
- start_date: 2026-04-01
- end_date: 2026-06-30
- name: "Q2 2026"
```

### Date Validation Logic

#### Basic Validation
```
Rule 1: end_date must be after start_date
Valid: 2026-01-01 to 2026-01-31
Invalid: 2026-01-31 to 2026-01-01

Rule 2: Dates cannot be equal
Invalid: 2026-01-01 to 2026-01-01
Minimum: 1-day period
```

#### Overlap Detection
```
Existing Period: 2026-01-01 to 2026-01-31
New Period: 2026-01-15 to 2026-02-15
Result: INVALID (overlaps existing)

Existing Period: 2026-01-01 to 2026-01-31
New Period: 2026-02-01 to 2026-02-28
Result: VALID (no overlap)
```

#### Gap Detection (Warning, not error)
```
Period 1: 2026-01-01 to 2026-01-31
Period 2: 2026-02-05 to 2026-02-28
Gap: 2026-02-01 to 2026-02-04

Warning: "Gap detected between periods"
Action: Allow but notify user
```

### Period Date Queries

#### Find Period for Transaction Date
```
Query: What period contains 2026-01-15?

Logic:
- WHERE start_date <= '2026-01-15'
- AND end_date >= '2026-01-15'
- AND tenant_id = current_tenant

Result: January 2026 period
```

#### Check Date Falls in Open Period
```
Query: Is 2026-01-15 in an OPEN period?

Logic:
- Find period containing date
- Check status = 'OPEN'

Result: True/False
Use case: Validate entry posting
```

### Expected Outcome
- Date range fields define period boundaries
- Name field for user-friendly display
- Validation prevents invalid date ranges
- Foundation for period-based entry control

### Verification Checklist
- [ ] start_date field added as DateField
- [ ] end_date field added as DateField
- [ ] name field added as CharField
- [ ] Both date fields required
- [ ] help_text added to all fields
- [ ] clean() validation method added
- [ ] end_date > start_date validated
- [ ] Overlap detection logic planned

---

## Task 67: Add Period Status

### Overview
Add the status field that controls period state and determines what operations are allowed. Status values (OPEN, CLOSED, LOCKED) enforce proper accounting period closing procedures.

### Dependencies
- Task 65: AccountingPeriod model must exist

### Instructions

1. **Open accounting_period.py file**
   - Continue in AccountingPeriod model
   - Add status field after date fields

2. **Define STATUS_CHOICES constant**
   - Create tuple with status options
   - Place above model class definition
   - Include three status states

3. **Define status constants**
   - OPEN: 'open' - Period accepts all entry types
   - CLOSED: 'closed' - Only adjusting entries allowed
   - LOCKED: 'locked' - No entries allowed (read-only)

4. **Add status field**
   - Type: CharField
   - Max length: 20 characters
   - Choices: STATUS_CHOICES
   - Default: 'OPEN'
   - Required field
   - Indexed for filtering

5. **Add status validation method**
   - Create can_post_entry() method
   - Check status allows entry type
   - Return boolean with reason if False

6. **Add status transition methods**
   - close_period(): OPEN → CLOSED
   - lock_period(): CLOSED → LOCKED
   - reopen_period(): CLOSED → OPEN (with authorization check)

### Field Specifications

| Property | Value |
|----------|-------|
| Field Type | CharField |
| Max Length | 20 |
| Choices | STATUS_CHOICES |
| Default | 'OPEN' |
| Required | Yes |
| Indexed | Yes |

### Status Definitions

| Status | Value | Allows Regular Entries | Allows Adjusting Entries | Allows Any Changes |
|--------|-------|------------------------|--------------------------|-------------------|
| OPEN | 'open' | ✓ Yes | ✓ Yes | ✓ Yes |
| CLOSED | 'closed' | ✗ No | ✓ Yes | ✓ Limited |
| LOCKED | 'locked' | ✗ No | ✗ No | ✗ No |

### Status Lifecycle

```
Period Creation
    │
    ▼
OPEN Status
    │
    ├─→ Regular journal entries
    ├─→ Sales/purchase entries
    ├─→ Payment entries
    ├─→ All transaction types
    │
    ▼ (Month-end closing initiated)
Month-End Process
    │
    ▼
CLOSED Status
    │
    ├─→ Regular entries blocked
    ├─→ Adjusting entries allowed
    ├─→ Reversing entries allowed
    ├─→ Accrual/deferral entries
    │
    ▼ (Year-end audit completed)
Audit Finalization
    │
    ▼
LOCKED Status
    │
    ├─→ All entries blocked
    ├─→ Read-only access
    ├─→ Reporting only
    └─→ Permanent state (rarely reopened)
```

### Entry Type Rules by Status

#### OPEN Period
```
Allowed Entry Types:
- Regular journal entries
- Sales invoices
- Purchase invoices
- Payment entries
- Receipt entries
- Bank transfers
- Adjusting entries
- Reversing entries

Status: All operations permitted
```

#### CLOSED Period
```
Allowed Entry Types:
- Adjusting entries (accruals, deferrals)
- Reversing entries
- Error corrections (with approval)

Blocked Entry Types:
- Regular journal entries
- Sales/purchase transactions
- Payment/receipt entries

Status: Month-end adjustments only
```

#### LOCKED Period
```
Allowed Entry Types:
- None (all blocked)

Allowed Operations:
- Read/view entries
- Generate reports
- Export data

Status: Permanent record, audit-locked
```

### Status Transition Rules

#### OPEN → CLOSED
```
Trigger: Month-end closing process
Requirements:
- All pending entries approved/posted
- Bank reconciliation completed
- All transactions reviewed

Actions:
- Set status = 'CLOSED'
- Set closed_date = current date
- Set closed_by = current user
- Send notification to accounting team
```

#### CLOSED → LOCKED
```
Trigger: Year-end audit completion
Requirements:
- Financial statements approved
- Audit completed
- No pending adjustments
- CFO/Controller approval

Actions:
- Set status = 'LOCKED'
- Set locked_date = current date
- Set locked_by = current user
- Prevent any future changes
```

#### CLOSED → OPEN (Reopen)
```
Trigger: Error discovery, required correction
Requirements:
- Manager/CFO approval
- Documented reason
- Logged in audit trail

Actions:
- Set status = 'OPEN'
- Log reopen reason
- Notify accounting team
- Track in audit log
```

### Status Validation Examples

#### Can Post Regular Entry?
```
Period Status: OPEN
Entry Type: Regular Journal Entry
Result: True (allowed)

Period Status: CLOSED
Entry Type: Regular Journal Entry
Result: False (not allowed)
Reason: "Period closed for regular entries"

Period Status: LOCKED
Entry Type: Regular Journal Entry
Result: False (not allowed)
Reason: "Period locked, no changes allowed"
```

#### Can Post Adjusting Entry?
```
Period Status: OPEN
Entry Type: Adjusting Entry
Result: True (allowed)

Period Status: CLOSED
Entry Type: Adjusting Entry
Result: True (allowed)

Period Status: LOCKED
Entry Type: Adjusting Entry
Result: False (not allowed)
Reason: "Period locked, no changes allowed"
```

### Additional Status Fields

#### Tracking Fields
```
closed_date: DateTimeField (nullable)
- Set when period closed
- Tracks closing timestamp

closed_by: ForeignKey to User (nullable)
- User who closed period
- Audit trail

locked_date: DateTimeField (nullable)
- Set when period locked
- Permanent lock timestamp

locked_by: ForeignKey to User (nullable)
- User who locked period
- Authorization trail
```

### Expected Outcome
- Status field controls period operations
- Clear lifecycle from OPEN to LOCKED
- Entry type restrictions enforced
- Audit trail for status changes

### Verification Checklist
- [ ] STATUS_CHOICES constant defined
- [ ] OPEN, CLOSED, LOCKED constants created
- [ ] status field added as CharField
- [ ] Default status set to 'OPEN'
- [ ] Field is indexed
- [ ] can_post_entry() method planned
- [ ] Status transition methods outlined
- [ ] Tracking fields (closed_date, locked_date, etc.) planned
- [ ] Entry type validation logic documented

---

## Task 68: Add Period Year/Month

### Overview
Add fiscal year and period number fields to identify and organize accounting periods. These fields enable period lookup by year and month, supporting fiscal year reporting and period navigation.

### Dependencies
- Task 65: AccountingPeriod model must exist

### Instructions

1. **Open accounting_period.py file**
   - Continue in AccountingPeriod model
   - Add fiscal identification fields

2. **Add fiscal_year field**
   - Type: IntegerField
   - Required field
   - Store 4-digit year (e.g., 2026)
   - Help text: "Fiscal year this period belongs to"
   - Indexed for filtering

3. **Add period_number field**
   - Type: IntegerField
   - Required field
   - Range: 1-12 (for monthly periods)
   - Help text: "Period number within fiscal year (1-12)"
   - Validates range in clean() method

4. **Add is_year_end field**
   - Type: BooleanField
   - Default: False
   - Marks the final period of fiscal year
   - Help text: "True if this is the last period of fiscal year"

5. **Update unique constraint in Meta**
   - Add unique_together on (tenant, fiscal_year, period_number)
   - Prevents duplicate periods within a year

6. **Add helper methods**
   - get_period_display(): Format as "Period 1 - January 2026"
   - is_current_period(): Check if period contains today's date
   - get_next_period(): Find the following period
   - get_previous_period(): Find the preceding period

### Field Specifications

| Field | Type | Required | Indexed | Range | Purpose |
|-------|------|----------|---------|-------|---------|
| fiscal_year | IntegerField | Yes | Yes | 2000-2099 | Year identification |
| period_number | IntegerField | Yes | Yes | 1-12 | Month within year |
| is_year_end | BooleanField | Yes | No | - | Final period flag |

### Fiscal Year Examples

#### Calendar Year Fiscal
```
Fiscal Year: 2026
Period 1: January 2026 (2026-01-01 to 2026-01-31)
Period 2: February 2026 (2026-02-01 to 2026-02-28)
...
Period 12: December 2026 (2026-12-01 to 2026-12-31)
is_year_end: True for Period 12
```

#### Sri Lanka Standard Fiscal Year
```
Fiscal Year: 2026 (April 2026 to March 2027)
Period 1: April 2026 (2026-04-01 to 2026-04-30)
Period 2: May 2026 (2026-05-01 to 2026-05-31)
...
Period 12: March 2027 (2027-03-01 to 2027-03-31)
is_year_end: True for Period 12
```

#### Custom Fiscal Year (July-June)
```
Fiscal Year: 2026 (July 2026 to June 2027)
Period 1: July 2026 (2026-07-01 to 2026-07-31)
Period 2: August 2026 (2026-08-01 to 2026-08-31)
...
Period 12: June 2027 (2027-06-01 to 2027-06-30)
is_year_end: True for Period 12
```

### Period Identification

#### Unique Period Identification
```
Composite Key: (tenant_id, fiscal_year, period_number)

Example:
Tenant: ABC Company (ID=1)
Fiscal Year: 2026
Period Number: 1
Result: ABC's January 2026 period (unique)

Tenant: XYZ Company (ID=2)
Fiscal Year: 2026
Period Number: 1
Result: XYZ's January 2026 period (different period)
```

#### Period Lookup Patterns
```
Find Period by Year and Month:
- fiscal_year = 2026
- period_number = 1
- Result: January 2026 period

Find All Periods for Fiscal Year:
- fiscal_year = 2026
- Order by period_number
- Result: All 12 periods of 2026

Find Year-End Period:
- fiscal_year = 2026
- is_year_end = True
- Result: Period 12 (December 2026)
```

### Helper Method Implementations

#### get_period_display()
```
Purpose: Format period for display
Logic:
- Get month name from start_date
- Combine with fiscal_year
- Format: "Period {number} - {month} {year}"

Examples:
- Period 1: "Period 1 - January 2026"
- Period 12: "Period 12 - December 2026"
```

#### is_current_period()
```
Purpose: Check if today falls in period
Logic:
- Get today's date
- Check: start_date <= today <= end_date
- Return: Boolean

Use case: Highlight current period in UI
```

#### get_next_period()
```
Purpose: Find the following period
Logic:
- If period_number < 12:
    - Same fiscal_year, period_number + 1
- If period_number = 12:
    - Next fiscal_year, period_number = 1
- Return: Next period or None

Use case: Period navigation
```

#### get_previous_period()
```
Purpose: Find the preceding period
Logic:
- If period_number > 1:
    - Same fiscal_year, period_number - 1
- If period_number = 1:
    - Previous fiscal_year, period_number = 12
- Return: Previous period or None

Use case: Period navigation
```

### Period Navigation Flow

```
FY 2025, Period 12 ← FY 2026, Period 1 → FY 2026, Period 2
    (Previous)         (Current)           (Next)

Navigation:
- get_previous_period() → FY 2025, Period 12
- get_next_period() → FY 2026, Period 2
- is_current_period() → Check if today is between dates
```

### Year-End Period Handling

#### Year-End Closing Workflow
```
Period 12 Characteristics:
- is_year_end = True
- Last period of fiscal year
- Special closing procedures

Year-End Actions:
1. Close all revenue/expense accounts
2. Transfer to retained earnings
3. Generate year-end reports
4. Lock period after audit
5. Open Period 1 of next fiscal year
```

### Expected Outcome
- Fiscal year and period tracking
- Unique period identification
- Period navigation support
- Year-end period flagging
- Flexible fiscal year configuration

### Verification Checklist
- [ ] fiscal_year field added as IntegerField
- [ ] period_number field added as IntegerField
- [ ] is_year_end field added as BooleanField
- [ ] All fields have help_text
- [ ] fiscal_year and period_number indexed
- [ ] unique_together constraint on (tenant, fiscal_year, period_number)
- [ ] period_number range validation (1-12)
- [ ] get_period_display() method planned
- [ ] is_current_period() method planned
- [ ] get_next_period() method planned
- [ ] get_previous_period() method planned

---

## Task 69: Run Period Migrations

### Overview
Generate and apply database migrations for the AccountingPeriod model. This creates the database table with date ranges, status control, and fiscal year tracking.

### Dependencies
- Task 65: AccountingPeriod model created
- Task 66: Date range fields added
- Task 67: Status field added
- Task 68: Fiscal year and period fields added

### Instructions

1. **Verify model is complete**
   - Open `accounting_period.py`
   - Ensure all fields are defined:
     - start_date, end_date, name
     - status (with choices)
     - fiscal_year, period_number, is_year_end
     - closed_date, closed_by, locked_date, locked_by
   - Verify Meta class with unique_together constraint

2. **Import model in models package**
   - Open `apps/accounting/models/__init__.py`
   - Add import: `from .accounting_period import AccountingPeriod`
   - Ensures Django discovers the model

3. **Generate migration file**
   - Open terminal in project root
   - Activate virtual environment
   - Run: `python manage.py makemigrations accounting`
   - Review generated migration file

4. **Review migration file**
   - Navigate to `apps/accounting/migrations/`
   - Open newly generated migration file
   - Verify all fields included
   - Check constraints and indexes
   - Verify status choices constraint

5. **Apply migration**
   - Run: `python manage.py migrate accounting`
   - Verify migration applies successfully
   - Check for any errors or warnings

6. **Verify database table**
   - Connect to PostgreSQL database
   - Confirm 'accounting_periods' table exists
   - Describe table structure
   - Verify unique constraint on (tenant_id, fiscal_year, period_number)
   - Check indexes on status, fiscal_year, period_number
   - Verify date fields and status field

### Migration Checklist

| Step | Command | Expected Outcome |
|------|---------|------------------|
| Import model | Add to `__init__.py` | Model discoverable |
| Make migrations | `makemigrations accounting` | Migration file created |
| Review migration | Open migration file | All fields and constraints present |
| Apply migration | `migrate accounting` | Table created |
| Verify table | Database query | Table structure correct |

### Expected Migration Operations

- **Create table:** accounting_periods
- **Add fields:**
  - id (auto-generated primary key)
  - start_date (date, indexed)
  - end_date (date, indexed)
  - name (varchar 50, nullable)
  - status (varchar 20, default 'OPEN', indexed)
  - fiscal_year (integer, indexed)
  - period_number (integer, 1-12, indexed)
  - is_year_end (boolean, default False)
  - closed_date (timestamp, nullable)
  - closed_by (foreign key to users, nullable)
  - locked_date (timestamp, nullable)
  - locked_by (foreign key to users, nullable)
  - tenant_id (foreign key to tenants)
  - created_at, updated_at (timestamps)
  - created_by, updated_by (foreign keys to users)

### Expected Constraints

```
Unique Constraint:
Name: unique_period_per_tenant
Columns: (tenant_id, fiscal_year, period_number)
Purpose: Prevent duplicate periods

Check Constraint:
Name: check_end_after_start
Condition: end_date > start_date
Purpose: Validate date range

Check Constraint:
Name: check_period_number_range
Condition: period_number BETWEEN 1 AND 12
Purpose: Validate period number
```

### Expected Indexes

```
Index: idx_period_status
Columns: status
Purpose: Fast filtering by status

Index: idx_period_fiscal_year
Columns: fiscal_year
Purpose: Year-based queries

Index: idx_period_number
Columns: period_number
Purpose: Period lookup

Index: idx_period_dates
Columns: start_date, end_date
Purpose: Date range queries

Composite Index: idx_period_lookup
Columns: tenant_id, fiscal_year, period_number
Purpose: Fast unique period lookup
```

### Post-Migration Setup

#### Create Initial Periods
```
After migration, create periods for current fiscal year:

For Calendar Year 2026:
- Period 1: Jan 1 - Jan 31
- Period 2: Feb 1 - Feb 28
- ...
- Period 12: Dec 1 - Dec 31

For each period:
- fiscal_year = 2026
- period_number = 1 to 12
- status = 'OPEN' (except past periods)
- is_year_end = True for period 12
```

#### Period Setup Script (Future Task)
```
Create management command:
- Command: create_fiscal_periods
- Parameters: fiscal_year, fiscal_type (calendar/april-march)
- Action: Generate 12 periods automatically
- Validation: Check for existing periods
```

### Expected Outcome
- AccountingPeriod table created in database
- All fields properly defined with correct types
- Unique constraint prevents duplicate periods
- Indexes optimize period lookups
- Model ready for period management

### Verification Checklist
- [ ] Model imported in `models/__init__.py`
- [ ] Migration file generated successfully
- [ ] Migration file reviewed and correct
- [ ] All fields present in migration
- [ ] Date range fields created
- [ ] Status field with choices constraint
- [ ] Fiscal year and period_number fields created
- [ ] Tracking fields (closed_date, locked_date, etc.) created
- [ ] Unique constraint on (tenant, fiscal_year, period_number)
- [ ] Check constraint on date range (end > start)
- [ ] Check constraint on period_number (1-12)
- [ ] Indexes on status, fiscal_year, period_number
- [ ] Migration applied successfully
- [ ] Database table exists with correct structure
- [ ] Ready for initial period setup

---

## Notes for AI Agents

### Accounting Period System Architecture

Accounting periods provide temporal control over financial transactions:
1. Periods define date ranges for transaction posting
2. Status controls what operations are permitted
3. Closing procedures enforce accounting standards
4. Locked periods provide audit-compliant immutability

### Period-Based Entry Validation

#### Entry Date Validation Flow
```
User attempts to post entry dated 2026-01-15:
    │
    ├─→ Find period containing 2026-01-15
    │   Query: start_date <= '2026-01-15' <= end_date
    │
    ├─→ Check period status
    │   ├─→ OPEN: Allow if entry type is regular
    │   ├─→ CLOSED: Allow only adjusting entries
    │   └─→ LOCKED: Reject all entries
    │
    └─→ Validation result: Allow or Block
```

### Month-End Closing Process

#### Standard Closing Workflow
```
1. Pre-Close Validation
   - All entries approved and posted
   - Bank reconciliation complete
   - Pending items resolved

2. Adjusting Entries
   - Record accruals and deferrals
   - Depreciation entries
   - Prepayment adjustments
   - Inventory adjustments

3. Close Period
   - Change status: OPEN → CLOSED
   - Record closed_date and closed_by
   - Generate period-end reports

4. Review Period (Optional)
   - Allow corrections via adjusting entries
   - Final review of financial statements

5. Lock Period (Year-End)
   - Change status: CLOSED → LOCKED
   - Post-audit finalization
   - Permanent immutability
```

### Sri Lanka Fiscal Year Considerations

#### Standard Fiscal Year (April to March)
```
FY 2026-2027:
- Starts: April 1, 2026
- Ends: March 31, 2027
- Period 1: April 2026
- Period 12: March 2027 (year-end)

Benefits:
- Aligns with government fiscal year
- Tax year compatibility
- Standard for Sri Lankan businesses
```

#### Calendar Year Fiscal
```
FY 2026:
- Starts: January 1, 2026
- Ends: December 31, 2026
- Period 1: January 2026
- Period 12: December 2026 (year-end)

Benefits:
- Simpler for international companies
- Aligns with calendar
- Common for technology businesses
```

### Period Status Best Practices

#### When to Close a Period
- All transactions for the month completed
- Bank reconciliation finished
- No pending approvals
- Monthly reports generated
- Management review complete

#### When to Lock a Period
- Annual audit completed
- Financial statements approved by board
- Tax returns filed
- Regulatory filings submitted
- CFO/Controller approval obtained

#### When to Reopen a Period
- Error discovered requiring correction
- Audit adjustment needed
- Regulatory requirement for change
- With proper authorization and audit trail
- Document reason thoroughly

### Multi-Tenant Period Considerations

#### Tenant Isolation
```
Each tenant has independent periods:
- Tenant A: 2026 periods (open)
- Tenant B: 2026 periods (closed)
- No cross-tenant period interference

Unique constraint ensures:
- One Period 1 for FY 2026 per tenant
- Different tenants, different fiscal calendars
```

### Period Query Patterns

#### Common Queries

**Find Current Open Period:**
```
Filter:
- status = 'OPEN'
- start_date <= today <= end_date
- tenant = current_tenant

Use: Default period for new entries
```

**Find All Periods for Year:**
```
Filter:
- fiscal_year = 2026
- tenant = current_tenant
Order by: period_number

Use: Fiscal year reports, period navigation
```

**Find Closed but Unlocked Periods:**
```
Filter:
- status = 'CLOSED'
- tenant = current_tenant

Use: Periods available for adjusting entries
```

### Integration Points

Accounting periods integrate with:
- **Journal Entries:** Validate entry_date falls in appropriate period
- **Posting Validation:** Check period status before posting
- **Month-End Close:** Workflow triggers period status change
- **Reports:** Filter transactions by period
- **Approval Workflow:** Period status affects approval requirements
- **Audit Trail:** Track period status changes

### Future Enhancements

#### 13-Period Year
```
Support 13 4-week periods instead of 12 months:
- Each period exactly 28 days
- Consistent weeks per period
- Alternative to calendar months
```

#### Period Budget Integration
```
Link periods to budget allocations:
- Budget per period
- Actual vs budget tracking
- Variance analysis by period
```

#### Automated Period Close
```
Scheduled period close:
- Celery task checks criteria
- Auto-close if conditions met
- Notification to accounting team
```

---

## Final Checklist

### Model Implementation
- [ ] AccountingPeriod model created
- [ ] start_date and end_date fields added
- [ ] name field for display added
- [ ] status field with OPEN/CLOSED/LOCKED choices
- [ ] fiscal_year and period_number fields added
- [ ] is_year_end flag implemented
- [ ] Tracking fields (closed_date, locked_date, etc.) added
- [ ] Meta class with unique constraint configured

### Validation
- [ ] Date range validation (end > start)
- [ ] Period overlap detection planned
- [ ] Period number range validation (1-12)
- [ ] Status-based entry validation method planned
- [ ] clean() method for model validation

### Helper Methods
- [ ] get_period_display() planned
- [ ] is_current_period() planned
- [ ] get_next_period() planned
- [ ] get_previous_period() planned
- [ ] can_post_entry() planned
- [ ] Status transition methods planned

### Migration
- [ ] Model imported in models/__init__.py
- [ ] Migration file generated
- [ ] Migration reviewed and correct
- [ ] All fields present in migration
- [ ] Unique constraint included
- [ ] Check constraints included
- [ ] Indexes defined
- [ ] Migration applied successfully
- [ ] Database table structure verified

### Documentation
- [ ] Fiscal year concepts explained
- [ ] Period status lifecycle documented
- [ ] Entry type rules by status documented
- [ ] Sri Lanka fiscal year patterns included
- [ ] Query patterns documented
- [ ] Integration points identified
- [ ] Ready for approval workflow (next document)
