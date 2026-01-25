# Tasks 10-16: PayrollSettings and Auto-Generation

> **Phase:** 06 - ERP Advanced Modules  
> **SubPhase:** 06 - Payroll Processing  
> **Group:** A - Payroll Period Models  
> **Document:** 02 of 02  
> **Tasks Covered:** 10, 11, 12, 13, 14, 15, 16

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [01_Tasks-01-09_PayrollPeriod-Model.md](01_Tasks-01-09_PayrollPeriod-Model.md)
- **→ Next Group:** [Group-B: PayrollRun & EmployeePayroll](../Group-B_PayrollRun-EmployeePayroll/)

---

## Document Overview

This document covers the creation of tenant-level payroll settings and automation infrastructure. The PayrollSettings model provides configurable parameters for payroll processing, including payment schedules, cutoff dates, approval requirements, and automatic period generation. The Celery task automates monthly period creation, reducing manual workload and ensuring consistent payroll cycles.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 10 | Create PayrollSettings Model | Medium | 25 min |
| 11 | Add Settings Pay Day | Low | 10 min |
| 12 | Add Settings Cutoff | Low | 10 min |
| 13 | Add Settings Approval | Low | 10 min |
| 14 | Add Settings Auto Create | Low | 10 min |
| 15 | Run PayrollSettings Migrations | Low | 15 min |
| 16 | Create Period Auto-Generation Task | High | 30 min |

---

## Task 10: Create PayrollSettings Model

### Overview
Create the PayrollSettings model that stores tenant-specific payroll configuration. This model uses a OneToOne relationship with the Client (tenant) model, ensuring each tenant has a single, centralized set of payroll settings that govern period creation, payment dates, and workflow requirements.

### Dependencies
- Task 09: PayrollPeriod Migrations (period model exists)
- Client (Tenant) model exists
- User model exists
- Multi-tenancy configured

### Instructions

1. **Create payroll_settings.py file**
   - Navigate to `apps/payroll/models/` directory
   - Create new file `payroll_settings.py`
   - Add comprehensive module docstring
   - Explain tenant-level payroll configuration purpose

2. **Import required dependencies**
   - Import Django model classes and fields
   - Import Client model for OneToOne relationship
   - Import User model for approvers M2M relationship
   - Import timezone utilities

3. **Define PayrollSettings model class**
   - Inherit from `models.Model`
   - Add detailed model docstring
   - Explain OneToOne relationship with tenant
   - Note configuration parameters purpose

4. **Add tenant OneToOne field**
   - Field name: `tenant`
   - Type: OneToOneField to Client model
   - Relationship: One settings per tenant
   - on_delete: CASCADE (tenant deletion removes settings)
   - related_name: 'payroll_settings'
   - Purpose: Tenant-specific configuration

5. **Add effective_from field**
   - Type: DateField
   - Purpose: When settings become active
   - Help text: "Date from which these settings apply"
   - Used for settings history tracking

6. **Add notification_email field**
   - Type: EmailField
   - null: True, blank: True
   - Purpose: Email for payroll notifications
   - Help text: "Email address for payroll notifications"
   - Used for approval alerts, errors

7. **Add timestamps**
   - Field: `created_at` (DateTimeField, auto_now_add=True)
   - Field: `updated_at` (DateTimeField, auto_now=True)
   - Purpose: Track configuration changes

8. **Add Meta class**
   - Set `db_table` to 'payroll_settings'
   - Set `verbose_name` to 'Payroll Settings'
   - Set `verbose_name_plural` to 'Payroll Settings'
   - No ordering needed (one per tenant)

9. **Add __str__ method**
   - Format: "Payroll Settings - Tenant Name"
   - Show tenant name
   - User-friendly representation

10. **Update models __init__.py**
    - Import PayrollSettings from payroll_settings module
    - Add to __all__ list for package exports

### Model Structure Overview

```
PayrollSettings Model
├── Core Fields
│   ├── tenant (OneToOne to Client)
│   ├── effective_from (DateField)
│   └── notification_email (EmailField, nullable)
├── Pay Day Settings (Task 11)
│   ├── default_pay_day (Integer 1-28)
│   └── adjust_for_weekends (Boolean)
├── Cutoff Settings (Task 12)
│   └── attendance_cutoff_day (Integer)
├── Approval Settings (Task 13)
│   ├── require_approval (Boolean)
│   └── approvers (M2M to User)
├── Auto-Generation (Task 14)
│   └── auto_create_period (Boolean)
└── Audit
    ├── created_at (DateTime)
    └── updated_at (DateTime)
```

### Field Purpose

| Field | Type | Purpose |
|-------|------|---------|
| tenant | OneToOneField | Tenant association (1:1) |
| effective_from | DateField | Settings activation date |
| notification_email | EmailField | Alert recipient |
| created_at | DateTime | Settings creation timestamp |
| updated_at | DateTime | Last modification timestamp |

### OneToOne Relationship

#### Tenant ↔ Settings
```
Relationship: One tenant has one PayrollSettings
Access: tenant.payroll_settings
Reverse: settings.tenant

Benefits:
- Centralized configuration
- No duplicate settings per tenant
- Easy access pattern
- Automatic tenant isolation
```

#### Creating Settings
```
Purpose: Initialize settings for new tenant
Process:
1. Tenant created during onboarding
2. PayrollSettings created automatically (signal or admin)
3. Default values populated
4. Admin customizes as needed
```

#### Accessing Settings
```
Purpose: Get tenant's payroll configuration
Pattern:
settings = request.tenant.payroll_settings

Usage:
pay_day = settings.default_pay_day
needs_approval = settings.require_approval
```

### Effective From Field

#### Purpose
```
Track when settings become active
Support settings history (future feature)
Enable scheduled settings changes

Use Cases:
- New tenant: effective_from = tenant.created_date
- Settings update: effective_from = today or future date
- Compliance change: effective_from = Jan 1, 2027
```

#### Date-Based Logic
```
Query active settings:
settings = PayrollSettings.objects.get(
    tenant=tenant,
    effective_from__lte=date.today()
)

Future enhancement:
Support multiple settings records per tenant
with different effective_from dates for history
```

### Notification Email

#### Purpose
```
Send payroll-related notifications:
- Period processing started
- Period processing completed
- Approval required
- Processing errors
- Period finalized

Recipients:
- HR manager
- Payroll administrator
- Finance team lead
```

#### Email Scenarios

**Processing Started**
```
To: notification_email
Subject: Payroll Processing Started - January 2026
Body:
The payroll processing for January 2026 has been initiated.
Status will be updated upon completion.
```

**Approval Required**
```
To: notification_email, approvers
Subject: Payroll Approval Required - January 2026
Body:
Payroll for January 2026 has been processed and is ready for approval.
Please review and approve in the system.
```

**Processing Error**
```
To: notification_email, admins
Subject: Payroll Processing Error - January 2026
Body:
An error occurred during payroll processing for January 2026.
Error: [error details]
Please investigate and retry.
```

### Settings Initialization

#### Default Settings on Tenant Creation
```
Purpose: Auto-create settings when tenant created
Trigger: Post-save signal on Client model
Logic:
1. Check if PayrollSettings exists for tenant
2. If not, create with defaults:
   - default_pay_day = 25
   - attendance_cutoff_day = 20
   - require_approval = True
   - auto_create_period = False (manual until configured)
   - effective_from = tenant.created_date
3. Save settings
```

#### Settings Template
```
Standard defaults for Sri Lankan companies:
- Pay day: 25th of month
- Cutoff: 20th of month
- Approval required: Yes
- Auto-create: No (until verified)
- Weekend adjustment: Yes (move to Friday)
```

### Settings Management

#### Admin Interface
```
Configuration:
- Inline admin in Client (Tenant) admin
- Or: Standalone PayrollSettings admin
- Fieldsets: Pay Schedule, Approval, Automation
- Validations: Pay day range, cutoff logic

Access Control:
- Only tenant admins can modify
- Multi-tenant isolation enforced
- Audit trail in updated_at
```

#### API Endpoint
```
Purpose: Allow tenant admins to update settings
Method: PUT/PATCH
Endpoint: /api/payroll/settings/
Permissions: IsTenantAdmin

Request body:
{
  "default_pay_day": 28,
  "attendance_cutoff_day": 23,
  "require_approval": true,
  "auto_create_period": true,
  "notification_email": "hr@company.lk"
}

Response: Updated settings object
```

### Settings Validation

#### Business Rules
```
Validation 1: Pay day range
- Must be 1-28
- Reason: Ensure pay day exists in all months (Feb = 28)

Validation 2: Cutoff before pay day
- cutoff_day should be < default_pay_day
- Warning if cutoff >= pay_day

Validation 3: Notification email
- Valid email format if provided
- Can be null (no notifications)

Validation 4: Approvers
- At least one approver if require_approval = True
- Approvers must be active users
- Approvers must have permission
```

### Expected Outcome
- PayrollSettings model created with OneToOne tenant relationship
- Foundation for pay day, cutoff, and approval configuration
- Notification infrastructure prepared
- Settings ready for tenant-specific customization

### Verification Checklist
- [ ] `payroll_settings.py` file created
- [ ] PayrollSettings class defined
- [ ] tenant OneToOneField added
- [ ] effective_from DateField added
- [ ] notification_email EmailField added
- [ ] created_at and updated_at fields added
- [ ] Meta class configured
- [ ] __str__ method implemented
- [ ] Model imported in models/__init__.py
- [ ] OneToOne relationship tested

---

## Task 11: Add Settings Pay Day

### Overview
Add pay day configuration fields to the PayrollSettings model. These fields control when employees receive their salaries each month and whether to adjust payment dates when they fall on weekends, ensuring consistent and compliant payment schedules.

### Dependencies
- Task 10: Create PayrollSettings Model

### Instructions

1. **Open payroll_settings.py model file**
   - Navigate to `apps/payroll/models/payroll_settings.py`
   - Locate the PayrollSettings model class
   - Position after effective_from field

2. **Add default_pay_day field**
   - Type: IntegerField
   - Purpose: Day of month for salary payment
   - Constraints: MinValueValidator(1), MaxValueValidator(28)
   - default: 25
   - Help text: "Day of the month for salary disbursement (1-28)"

3. **Add adjust_for_weekends field**
   - Type: BooleanField
   - default: True
   - Purpose: Auto-adjust pay day if falls on weekend
   - Help text: "Move pay date to Friday if it falls on weekend"

4. **Import validators**
   - From django.core.validators
   - Import MinValueValidator, MaxValueValidator
   - Apply to default_pay_day field

5. **Create pay day calculation method**
   - Method name: `calculate_pay_date(period_month, period_year)`
   - Parameters: month and year integers
   - Returns: date object with calculated pay date
   - Logic: Apply default_pay_day and weekend adjustment

6. **Add weekend detection helper**
   - Method name: `is_weekend(date)`
   - Returns: Boolean (True if Saturday or Sunday)
   - Used for pay date adjustment

7. **Add next working day helper**
   - Method name: `adjust_to_working_day(date)`
   - Returns: Adjusted date (previous Friday if weekend)
   - Sri Lanka weekend: Saturday, Sunday

### Pay Day Configuration

| Setting | Type | Range | Default | Purpose |
|---------|------|-------|---------|---------|
| default_pay_day | Integer | 1-28 | 25 | Payment day of month |
| adjust_for_weekends | Boolean | True/False | True | Weekend adjustment |

### Pay Day Range Explanation

#### Why 1-28?
```
Reason: February has minimum 28 days

All months have at least 28 days:
✓ January: 31 days
✓ February: 28 days (29 in leap year)
✓ March: 31 days
✓ April: 30 days
... and so on

Range 1-28 ensures pay day exists in every month
```

#### Common Pay Days
```
Sri Lankan companies typically pay on:
- 25th of month (most common)
- 28th of month
- Last working day of month
- 1st of following month
- 5th of following month

LankaCommerce default: 25th
```

### Pay Date Calculation Logic

#### Basic Calculation
```
Input:
- Period: January 2026
- default_pay_day: 25

Process:
1. Calculate pay date: January 25, 2026
2. Check if weekend: Is Jan 25, 2026 a Sunday? Yes
3. Apply adjustment: Move to previous Friday (Jan 23)

Output:
- pay_date: January 23, 2026
```

#### Weekend Detection
```
Date: January 25, 2026

Check day of week:
- Monday = 0
- Tuesday = 1
- Wednesday = 2
- Thursday = 3
- Friday = 4
- Saturday = 5 ← Weekend
- Sunday = 6 ← Weekend

January 25, 2026 = Sunday (6)
Result: is_weekend() returns True
```

#### Working Day Adjustment
```
If pay_date is Saturday:
- Move to previous Friday
- Example: Sat Jan 24 → Fri Jan 23

If pay_date is Sunday:
- Move to previous Friday
- Example: Sun Jan 25 → Fri Jan 23

If pay_date is weekday:
- No adjustment
- Return original date
```

### Calculate Pay Date Method

```
def calculate_pay_date(self, period_month, period_year):
    Purpose: Calculate pay date for given period
    Parameters:
    - period_month: Integer (1-12)
    - period_year: Integer (e.g., 2026)
    
    Returns: date object
    
    Logic:
    1. Create date with default_pay_day
       pay_date = date(period_year, period_month, self.default_pay_day)
    
    2. If adjust_for_weekends enabled:
       if self.is_weekend(pay_date):
           pay_date = self.adjust_to_working_day(pay_date)
    
    3. Return pay_date
    
    Example:
    settings.calculate_pay_date(1, 2026)
    → Returns: January 23, 2026 (adjusted from Jan 25 Sunday)
```

### Weekend Adjustment Examples

#### Example 1: Pay Day on Friday
```
Settings:
- default_pay_day: 25
- adjust_for_weekends: True

Period: January 2026
- Jan 25, 2026 = Sunday

Calculation:
1. Initial: Sunday, Jan 25
2. Detect weekend: True
3. Adjust: Move to Friday, Jan 23
4. Final: Friday, Jan 23, 2026
```

#### Example 2: Pay Day on Saturday
```
Settings:
- default_pay_day: 28
- adjust_for_weekends: True

Period: February 2026
- Feb 28, 2026 = Saturday

Calculation:
1. Initial: Saturday, Feb 28
2. Detect weekend: True
3. Adjust: Move to Friday, Feb 27
4. Final: Friday, Feb 27, 2026
```

#### Example 3: No Adjustment Needed
```
Settings:
- default_pay_day: 25
- adjust_for_weekends: True

Period: March 2026
- Mar 25, 2026 = Wednesday

Calculation:
1. Initial: Wednesday, Mar 25
2. Detect weekend: False
3. No adjustment needed
4. Final: Wednesday, Mar 25, 2026
```

#### Example 4: Adjustment Disabled
```
Settings:
- default_pay_day: 25
- adjust_for_weekends: False

Period: January 2026
- Jan 25, 2026 = Sunday

Calculation:
1. Initial: Sunday, Jan 25
2. Adjustment disabled
3. No change
4. Final: Sunday, Jan 25, 2026 (stays on weekend)
```

### Pay Day in Different Scenarios

#### Same Month Payment
```
Settings:
- default_pay_day: 25
- Period: January 2026

Result:
- Pay date: January 25, 2026 (or adjusted)
- Payment in same month as work period
```

#### Next Month Payment
```
Settings:
- default_pay_day: 5
- Period: January 2026

Implementation:
- Pay date calculated as February 5, 2026
- Requires logic to add month
- Common for companies with processing time
```

#### Last Day of Month
```
Settings:
- default_pay_day: 28 (or calculate last day)

Period: January 2026
- Pay date: January 31, 2026 (last day)

Period: February 2026
- Pay date: February 28, 2026 (last day)

Note: Requires custom logic if pay_day = -1 (last day)
```

### Integration with PayrollPeriod

#### Period Creation
```
When creating PayrollPeriod:
1. Get tenant's PayrollSettings
2. Call settings.calculate_pay_date(month, year)
3. Set period.pay_date = calculated date
4. Save period

Benefit: Consistent pay date calculation across system
```

#### Pay Date Override
```
Period creation:
- Use settings.calculate_pay_date() as default
- Allow manual override if needed
- Save custom pay_date

Use case: Special circumstances, holidays, early payment
```

### Public Holiday Consideration (Future)

#### Current Implementation
```
Adjusts for: Weekends only (Sat, Sun)
Does not adjust for: Public holidays

Reason: Public holiday calendar varies
Implementation: Future enhancement
```

#### Future Enhancement
```
Check sequence:
1. Is weekend? → Adjust to Friday
2. Is public holiday? → Adjust to previous working day
3. Is mercantile holiday? → Adjust based on policy

Requires: HolidayCalendar model integration
```

### Expected Outcome
- Pay day configuration added to settings
- Automatic weekend adjustment capability
- Consistent pay date calculation across system
- Foundation for public holiday integration

### Verification Checklist
- [ ] default_pay_day IntegerField added
- [ ] Validators (1-28) applied
- [ ] adjust_for_weekends BooleanField added
- [ ] calculate_pay_date() method created
- [ ] is_weekend() helper method created
- [ ] adjust_to_working_day() method created
- [ ] Weekend adjustment logic tested
- [ ] Default values set (pay_day=25, adjust=True)

---

## Task 12: Add Settings Cutoff

### Overview
Add attendance cutoff day configuration to the PayrollSettings model. The cutoff day determines the end date for attendance tracking in payroll calculations, allowing companies to close attendance a few days before pay day to allow processing time.

### Dependencies
- Task 10: Create PayrollSettings Model
- Task 11: Add Settings Pay Day

### Instructions

1. **Open payroll_settings.py model file**
   - Navigate to `apps/payroll/models/payroll_settings.py`
   - Locate the PayrollSettings model class
   - Position after adjust_for_weekends field

2. **Add attendance_cutoff_day field**
   - Type: IntegerField
   - Purpose: Day of month when attendance tracking closes
   - Constraints: MinValueValidator(1), MaxValueValidator(28)
   - default: 20
   - Help text: "Day of month when attendance is closed for payroll"

3. **Add use_cutoff_period field**
   - Type: BooleanField
   - default: False
   - Purpose: Enable/disable cutoff-based attendance tracking
   - Help text: "Use cutoff-based period instead of calendar month"

4. **Create cutoff date calculation method**
   - Method name: `calculate_cutoff_dates(period_month, period_year)`
   - Returns: tuple of (cutoff_start_date, cutoff_end_date)
   - Logic: Calculate attendance period based on cutoff

5. **Add cutoff validation method**
   - Method name: `validate_cutoff_settings()`
   - Validate cutoff_day < default_pay_day
   - Ensure sufficient processing time
   - Raise ValidationError if invalid

6. **Override clean method**
   - Add model-level validation
   - Call validate_cutoff_settings()
   - Ensure logical cutoff configuration

### Cutoff Day Configuration

| Setting | Type | Range | Default | Purpose |
|---------|------|-------|---------|---------|
| attendance_cutoff_day | Integer | 1-28 | 20 | Attendance close day |
| use_cutoff_period | Boolean | True/False | False | Enable cutoff tracking |

### Cutoff Day Concept

#### Purpose
```
Provide processing time between attendance close and pay day

Timeline:
├─ 1st ─────┤──────────┤── 20th ─────┤── 25th ──────┤── 31st ─┤
   Month     Attendance  Cutoff Day   Pay Day        Month
   Start     Tracking                 (Salary        End
                                       Payment)

Attendance tracked: 1st to 20th
Processing window: 21st to 24th
Payment: 25th
```

#### Without Cutoff (Calendar Month)
```
January Payroll:
- Attendance tracked: Jan 1 - Jan 31
- Processing: After Jan 31
- Payment: Early February
- Issue: Delay between month end and payment
```

#### With Cutoff (Cutoff Period)
```
January Payroll:
- Attendance tracked: Dec 21 - Jan 20
- Processing: Jan 21 - Jan 24
- Payment: Jan 25
- Benefit: Payment in same "period" month
```

### Cutoff Date Calculation

#### Standard Cutoff Period
```
Settings:
- attendance_cutoff_day: 20
- Period: January 2026

Calculation:
1. Cutoff end date: January 20, 2026
2. Cutoff start date: December 21, 2025
   (day after previous month's cutoff)

Attendance period: Dec 21, 2025 to Jan 20, 2026
Processing time: Jan 21 to Jan 24 (4 days)
Pay date: Jan 25, 2026
```

#### Calculate Cutoff Dates Method
```
def calculate_cutoff_dates(self, period_month, period_year):
    Purpose: Calculate attendance tracking period
    
    Parameters:
    - period_month: Integer (1-12)
    - period_year: Integer (e.g., 2026)
    
    Returns: Tuple (start_date, end_date)
    
    Logic:
    1. Cutoff end: period_month/cutoff_day
       end_date = date(period_year, period_month, self.attendance_cutoff_day)
    
    2. Cutoff start: Previous month, day after cutoff
       Calculate previous month and year
       start_date = date(prev_year, prev_month, self.attendance_cutoff_day + 1)
    
    3. Return (start_date, end_date)
    
    Example:
    settings.calculate_cutoff_dates(1, 2026)
    → Returns: (2025-12-21, 2026-01-20)
```

### Cutoff Period Examples

#### Example 1: January 2026
```
Settings:
- attendance_cutoff_day: 20
- Period: January 2026

Cutoff Period:
- Start: December 21, 2025 (day after Dec 20)
- End: January 20, 2026
- Duration: 31 days

Working Days:
- Count weekdays from Dec 21 to Jan 20
- Exclude weekends and holidays
- Example: 22 working days
```

#### Example 2: February 2026
```
Settings:
- attendance_cutoff_day: 20
- Period: February 2026

Cutoff Period:
- Start: January 21, 2026
- End: February 20, 2026
- Duration: 31 days

Note: February is short, but cutoff period spans to January
Working Days: ~22 working days
```

#### Example 3: Year-End (December to January)
```
Settings:
- attendance_cutoff_day: 20
- Period: January 2026

Cutoff Period:
- Start: December 21, 2025
- End: January 20, 2026
- Spans year boundary

Consideration:
- Attendance spans two calendar years
- Payroll reports need date range clarity
- Holiday season (Christmas, New Year) included
```

### Cutoff vs Calendar Month

#### Comparison Table

| Aspect | Calendar Month | Cutoff Period |
|--------|---------------|---------------|
| Start | 1st of month | Day after cutoff |
| End | Last day of month | Cutoff day |
| Duration | 28-31 days | Fixed 30-31 days |
| Processing | After month end | Before pay day |
| Payment | Next month | Same "period" month |
| Complexity | Simple | More complex |

#### When to Use Calendar Month
```
Use Cases:
- Simple payroll setup
- Payment can be delayed to next month
- Overtime can be processed in following month
- Minimal processing time needed

Benefits:
- Simpler to understand
- Aligns with calendar
- Standard for many companies
```

#### When to Use Cutoff Period
```
Use Cases:
- Need payment in same month
- Require processing time before pay day
- Complex calculations (OT, bonuses, deductions)
- Large employee base

Benefits:
- Payment within period month
- Adequate processing time
- Better cash flow planning
- Professional payroll practice
```

### Cutoff Validation Rules

#### Rule 1: Cutoff Before Pay Day
```
Validation: attendance_cutoff_day < default_pay_day
Error: "Cutoff day must be before pay day"

Example:
✓ Valid: cutoff=20, pay_day=25 (5 days processing)
✗ Invalid: cutoff=26, pay_day=25 (no processing time)
✗ Invalid: cutoff=25, pay_day=25 (same day)
```

#### Rule 2: Minimum Processing Time
```
Validation: pay_day - cutoff_day >= 3
Warning: "Less than 3 days for processing"

Example:
✓ Good: cutoff=20, pay_day=25 (5 days)
✓ Acceptable: cutoff=22, pay_day=25 (3 days)
⚠ Warning: cutoff=23, pay_day=25 (2 days)
✗ Invalid: cutoff=24, pay_day=25 (1 day)
```

#### Rule 3: Cutoff Range
```
Validation: 1 <= cutoff_day <= 28
Reason: Same as pay_day (all months have >=28 days)

Valid:
✓ cutoff_day = 15
✓ cutoff_day = 20
✓ cutoff_day = 25

Invalid:
✗ cutoff_day = 0
✗ cutoff_day = 30 (Feb doesn't have 30)
✗ cutoff_day = 31 (Feb doesn't have 31)
```

### Integration with PayrollPeriod

#### Period Creation with Cutoff
```
When use_cutoff_period = True:

1. Get cutoff dates from settings:
   start, end = settings.calculate_cutoff_dates(month, year)

2. Create PayrollPeriod:
   - period_month = month
   - period_year = year
   - start_date = start (from cutoff)
   - end_date = end (cutoff day)
   - pay_date = calculated pay date

3. Calculate working days for cutoff period
```

#### Period Creation without Cutoff
```
When use_cutoff_period = False:

1. Use calendar month:
   - start_date = 1st of month
   - end_date = last day of month

2. Pay date in following month:
   - pay_date = calculated for next month

3. Calculate working days for calendar month
```

### Attendance Integration

#### Query Attendance Records
```
Purpose: Get attendance for payroll period
Logic:
period = PayrollPeriod.objects.get(...)

attendance_records = Attendance.objects.filter(
    employee__tenant=period.tenant,
    date__gte=period.start_date,
    date__lte=period.end_date
)

Benefit: Cutoff dates automatically used if configured
```

#### Overtime Calculation
```
Purpose: Calculate OT within cutoff period
Logic:
If cutoff enabled:
- OT calculated from Dec 21 to Jan 20
- Included in January payroll
- Paid on Jan 25

If cutoff disabled:
- OT calculated for full January
- Processed after Jan 31
- Paid in February
```

### Expected Outcome
- Cutoff day configuration added
- Attendance period calculation logic implemented
- Validation ensures logical cutoff settings
- Foundation for cutoff-based payroll processing

### Verification Checklist
- [ ] attendance_cutoff_day IntegerField added
- [ ] Validators (1-28) applied
- [ ] use_cutoff_period BooleanField added
- [ ] calculate_cutoff_dates() method created
- [ ] validate_cutoff_settings() method created
- [ ] clean() method validates cutoff logic
- [ ] Cutoff before pay day validation
- [ ] Minimum processing time validation
- [ ] Default values set (cutoff=20, use_cutoff=False)

---

## Task 13: Add Settings Approval

### Overview
Add approval workflow configuration to the PayrollSettings model. These fields control whether payroll processing requires managerial approval before finalization and identify which users are authorized to approve payroll, ensuring proper oversight and compliance.

### Dependencies
- Task 10: Create PayrollSettings Model
- User model with permissions exists

### Instructions

1. **Open payroll_settings.py model file**
   - Navigate to `apps/payroll/models/payroll_settings.py`
   - Locate the PayrollSettings model class
   - Position after use_cutoff_period field

2. **Add require_approval field**
   - Type: BooleanField
   - default: True
   - Purpose: Enable/disable approval requirement
   - Help text: "Require manager approval before finalization"

3. **Add approvers ManyToMany field**
   - Type: ManyToManyField to User model
   - blank: True
   - Purpose: Authorized approvers list
   - related_name: 'payroll_approver_for'
   - Help text: "Users authorized to approve payroll"

4. **Add min_approvals field**
   - Type: IntegerField
   - default: 1
   - Purpose: Minimum number of approvals required
   - Constraints: MinValueValidator(1)
   - Help text: "Minimum approvals needed (multi-approval future)"

5. **Create approval validation method**
   - Method name: `can_user_approve(user)`
   - Check if user in approvers list
   - Check if user has payroll_approve permission
   - Return Boolean

6. **Create approval check method**
   - Method name: `needs_approval(period)`
   - Check if require_approval enabled
   - Check if period status is PROCESSED
   - Return Boolean indicating if approval needed

7. **Add approver notification helper**
   - Method name: `get_approver_emails()`
   - Return list of approver email addresses
   - Used for notification system

### Approval Configuration

| Setting | Type | Default | Purpose |
|---------|------|---------|---------|
| require_approval | Boolean | True | Enable approval workflow |
| approvers | M2M(User) | Empty | Authorized approvers |
| min_approvals | Integer | 1 | Required approval count |

### Approval Workflow

```
Payroll Processing Flow:

┌─────────┐
│  DRAFT  │ ← Period created
└────┬────┘
     │
     ▼
┌────────────┐
│ PROCESSING │ ← Celery task calculates
└─────┬──────┘
      │
      ▼
┌───────────┐
│ PROCESSED │ ← Ready for review
└─────┬─────┘
      │
      ▼
   if require_approval:
      │
      ├─ Yes ────► Need approval from approvers
      │                    │
      │                    ▼
      │              ┌──────────┐
      │              │ APPROVED │
      │              └────┬─────┘
      │                   │
      └─ No ─────────────┘
                          │
                          ▼
                    ┌────────────┐
                    │ FINALIZED  │ ← Locked and ready for payment
                    └────────────┘
```

### Approval Requirements

#### Single Approval
```
Settings:
- require_approval: True
- min_approvals: 1
- approvers: [manager@company.lk]

Workflow:
1. Payroll processed
2. Manager reviews calculations
3. Manager approves (1 approval)
4. Status changes to APPROVED
5. Can be finalized
```

#### Multi-Approval (Future)
```
Settings:
- require_approval: True
- min_approvals: 2
- approvers: [hr_manager@company.lk, finance_manager@company.lk]

Workflow:
1. Payroll processed
2. HR manager reviews and approves (1/2)
3. Finance manager reviews and approves (2/2)
4. Status changes to APPROVED
5. Can be finalized

Implementation: Requires ApprovalLog model (future task)
```

#### No Approval Required
```
Settings:
- require_approval: False

Workflow:
1. Payroll processed
2. Can immediately finalize
3. No approval step needed
4. Use case: Small companies, trusted process
```

### Can User Approve Method

```
def can_user_approve(self, user):
    Purpose: Check if user authorized to approve
    Parameters:
    - user: User object
    
    Returns: Boolean
    
    Logic:
    1. Check if user in self.approvers.all()
    2. Or check if user has 'payroll.approve_payroll' permission
    3. Or check if user.is_staff (admin override)
    4. Return True if any condition met
    
    Example:
    if settings.can_user_approve(request.user):
        # Show approve button
        pass
```

### Needs Approval Method

```
def needs_approval(self, period):
    Purpose: Check if period needs approval
    Parameters:
    - period: PayrollPeriod object
    
    Returns: Boolean
    
    Logic:
    1. Check self.require_approval is True
    2. Check period.status == STATUS_PROCESSED
    3. Return True if both conditions met
    
    Example:
    if settings.needs_approval(period):
        # Send approval request notification
        notify_approvers(period)
```

### Approver Management

#### Adding Approvers
```
Purpose: Designate users who can approve payroll
Process:
1. Admin navigates to PayrollSettings
2. Select users from approvers M2M field
3. Selected users can approve payroll
4. Save settings

Criteria for approvers:
- HR managers
- Finance managers
- Payroll administrators
- Senior management
```

#### Approver Permissions
```
Required permission:
- Custom: 'payroll.approve_payroll'
- Or: is_staff = True
- Or: Explicitly in approvers list

Permission assignment:
- Via Django groups
- Via user permissions
- Via approvers M2M field
```

#### Removing Approvers
```
Process:
1. Remove user from approvers M2M field
2. User can no longer approve
3. Existing approvals remain valid
4. Use case: Role change, employee departure
```

### Approval Notifications

#### Get Approver Emails Method
```
def get_approver_emails(self):
    Purpose: Get email addresses of all approvers
    Returns: List of email strings
    
    Logic:
    1. Query self.approvers.filter(is_active=True)
    2. Extract email addresses
    3. Include notification_email if set
    4. Remove duplicates
    5. Return list
    
    Example:
    emails = settings.get_approver_emails()
    # ['hr@company.lk', 'finance@company.lk']
```

#### Approval Request Email
```
Triggered: When period status changes to PROCESSED
Recipients: get_approver_emails()
Subject: "Payroll Approval Required - January 2026"

Body:
Dear Approver,

The payroll for January 2026 has been processed and is ready for your approval.

Summary:
- Total Employees: 45
- Total Gross Pay: LKR 4,500,000
- Total Deductions: LKR 450,000
- Total Net Pay: LKR 4,050,000

Please review and approve in the system:
[Approve Payroll Button/Link]

Best regards,
LankaCommerce Payroll System
```

#### Approval Granted Email
```
Triggered: When period approved
Recipients: notification_email, admins
Subject: "Payroll Approved - January 2026"

Body:
The payroll for January 2026 has been approved.

Approved by: manager@company.lk
Approved at: 2026-01-24 10:30:15

The payroll can now be finalized for payment.

[Finalize Payroll Button/Link]
```

### Approval Validation

#### Rule 1: Approvers Required
```
Validation: If require_approval = True, approvers must exist
Error: "Approval enabled but no approvers assigned"

Check:
if self.require_approval and not self.approvers.exists():
    raise ValidationError("Assign at least one approver")
```

#### Rule 2: Min Approvals Valid
```
Validation: min_approvals <= total approvers
Warning: "More approvals required than approvers available"

Check:
if self.min_approvals > self.approvers.count():
    # Warning or error
    pass
```

#### Rule 3: Approvers Active
```
Validation: All approvers must be active users
Warning: "Some approvers are inactive"

Check:
inactive = self.approvers.filter(is_active=False)
if inactive.exists():
    # Notify admin to update approvers
    pass
```

### Approval Bypass

#### Admin Override
```
Scenario: Emergency situations, admin needs to finalize without approval
Permission: 'payroll.bypass_approval'
Action: Admin can finalize even without approvals
Audit: Logged with reason

Use cases:
- Approvers unavailable (travel, leave)
- System error correction
- Deadline pressure
```

#### Disable Approval
```
Scenario: Small company, approval not needed
Action: Set require_approval = False
Effect: Skip approval step entirely
Workflow: PROCESSED → FINALIZED directly
```

### Integration with PayrollPeriod

#### Approval Check Before Finalization
```
Purpose: Validate approval before locking period
Logic:
def can_finalize(period):
    settings = period.tenant.payroll_settings
    
    if settings.require_approval:
        if period.status != STATUS_APPROVED:
            return False, "Approval required before finalization"
    
    return True, "Can finalize"

Usage:
can_finalize, message = can_finalize(period)
if not can_finalize:
    show_error(message)
```

#### Approval Status Display
```
UI Display:
if settings.require_approval:
    if period.is_processed:
        show_message("Waiting for approval")
        show_button("Approve") if can_user_approve(user)
    elif period.is_approved:
        show_message("Approved, ready to finalize")
        show_button("Finalize")
```

### Expected Outcome
- Approval workflow configuration added
- Authorized approvers management
- Approval validation before finalization
- Notification infrastructure for approvals
- Flexible approval requirements per tenant

### Verification Checklist
- [ ] require_approval BooleanField added
- [ ] approvers ManyToManyField added
- [ ] min_approvals IntegerField added
- [ ] can_user_approve() method created
- [ ] needs_approval() method created
- [ ] get_approver_emails() method created
- [ ] Validation: Approvers required if approval enabled
- [ ] Validation: Min approvals <= approver count
- [ ] Default values set (require_approval=True, min=1)

---

## Task 14: Add Settings Auto Create

### Overview
Add automatic period creation configuration to the PayrollSettings model. This field enables or disables the automated generation of payroll periods each month via Celery beat tasks, reducing manual workload and ensuring consistent payroll cycles.

### Dependencies
- Task 10: Create PayrollSettings Model
- Celery configured in project

### Instructions

1. **Open payroll_settings.py model file**
   - Navigate to `apps/payroll/models/payroll_settings.py`
   - Locate the PayrollSettings model class
   - Position after min_approvals field

2. **Add auto_create_period field**
   - Type: BooleanField
   - default: False
   - Purpose: Enable automatic period generation
   - Help text: "Automatically create new payroll periods monthly"

3. **Add auto_create_day field**
   - Type: IntegerField
   - default: 1
   - Purpose: Day of month to create next period
   - Constraints: MinValueValidator(1), MaxValueValidator(28)
   - Help text: "Day of month to auto-create next period (default: 1st)"

4. **Add create_months_ahead field**
   - Type: IntegerField
   - default: 0
   - Purpose: Create periods in advance
   - Constraints: MinValueValidator(0), MaxValueValidator(3)
   - Help text: "Months ahead to create (0=current month only)"

5. **Create period generation method**
   - Method name: `should_auto_create_period(check_date=None)`
   - Check if auto creation enabled
   - Check if it's the auto_create_day
   - Return Boolean

6. **Add period generation validation**
   - Method name: `validate_auto_create_settings()`
   - Validate auto_create_day is logical
   - Ensure not creating too far ahead
   - Return validation result

### Auto-Create Configuration

| Setting | Type | Range | Default | Purpose |
|---------|------|-------|---------|---------|
| auto_create_period | Boolean | True/False | False | Enable automation |
| auto_create_day | Integer | 1-28 | 1 | Day to create period |
| create_months_ahead | Integer | 0-3 | 0 | Advance creation |

### Auto-Create Concept

#### Purpose
```
Automate monthly payroll period creation
Reduce manual HR workload
Ensure consistent payroll cycles
Prepare periods in advance

Benefits:
- No forgotten periods
- Consistent process
- Advance planning
- Reduced admin burden
```

#### How It Works
```
Celery Beat Schedule:
- Runs daily at configured time
- Checks all tenants with auto_create_period = True
- For each tenant:
  - Check if today is auto_create_day
  - Check if period already exists
  - Create period if needed
  - Set status = DRAFT
  - Calculate working days
  - Send notification
```

### Auto-Create Day Setting

#### Timing Options

```
auto_create_day = 1 (Default)
- Create on 1st of month
- Period for current month
- Standard timing

auto_create_day = 25
- Create on 25th of previous month
- Period for next month
- Advance preparation

auto_create_day = 20
- Create on 20th (cutoff day)
- Period for next month
- Align with cutoff
```

#### Selection Criteria
```
Considerations:
1. When does HR need to start work?
   - If early month: auto_create_day = 1
   - If need advance: auto_create_day = 25 (previous month)

2. Cutoff alignment:
   - If cutoff = 20, create on 20th
   - Ready to process immediately after cutoff

3. Processing time:
   - If need 5+ days to review
   - Create early (25th previous month)
```

### Create Months Ahead

#### Options

```
create_months_ahead = 0 (Default)
- Create current month only
- Most common setting

create_months_ahead = 1
- Create current + next month
- Advance planning
- Use case: Month-end load balancing

create_months_ahead = 2
- Create current + 2 future months
- Long-term planning
- Use case: Annual planning

create_months_ahead = 3 (Maximum)
- Create quarterly periods
- Advanced planning
- Use case: Budget alignment
```

#### Example: Months Ahead
```
Settings:
- auto_create_day: 1
- create_months_ahead: 1
- Today: January 1, 2026

Created periods:
1. January 2026 (current month)
2. February 2026 (1 month ahead)

Next run: February 1, 2026
Created:
1. February 2026 (already exists, skip)
2. March 2026 (new, create)
```

### Should Auto-Create Method

```
def should_auto_create_period(self, check_date=None):
    Purpose: Check if period should be auto-created today
    Parameters:
    - check_date: Optional date to check (default: today)
    
    Returns: Boolean
    
    Logic:
    1. If not self.auto_create_period: return False
    2. check_date = check_date or date.today()
    3. If check_date.day == self.auto_create_day: return True
    4. Else: return False
    
    Example:
    Today is Jan 1, auto_create_day = 1
    → Returns True
    
    Today is Jan 5, auto_create_day = 1
    → Returns False
```

### Auto-Create Validation

#### Rule 1: Create Day Logical
```
Validation: auto_create_day should make sense
Recommendation: 1st of month or cutoff day

Suggested values:
✓ 1 (start of month)
✓ 20 (if cutoff = 20)
✓ 25 (if pay_day = 25, create in advance)

Unusual values:
⚠ 15 (mid-month, why?)
⚠ 28 (end of month, may cause delays)
```

#### Rule 2: Months Ahead Reasonable
```
Validation: 0 <= create_months_ahead <= 3
Reason: Don't create too far in future

Risks of creating too far ahead:
- Settings may change
- Employee roster changes
- Public holidays not yet announced
- Organizational changes
```

#### Rule 3: Cutoff Alignment
```
Recommendation: auto_create_day aligns with workflow

If use_cutoff_period = True:
- Consider auto_create_day = attendance_cutoff_day
- Or day after: cutoff_day + 1
- Benefit: Create as soon as attendance period closes
```

### Integration with Celery Task

#### Task Overview
```
Task: auto_create_payroll_periods
Schedule: Daily (e.g., 2:00 AM)
Purpose: Check and create periods for tenants

Pseudocode:
1. Get current date
2. Query tenants with auto_create_period = True
3. For each tenant:
   a. Get PayrollSettings
   b. Check should_auto_create_period()
   c. If yes, create period(s)
   d. Send notification
4. Log results
```

#### Period Creation Logic
```
For each tenant:
1. Check if should_auto_create_period() = True
2. If yes:
   a. Calculate periods to create:
      - Current month
      - +1 month if create_months_ahead >= 1
      - +2 months if create_months_ahead >= 2
      - +3 months if create_months_ahead = 3
   
   b. For each period:
      - Check if exists (tenant, month, year)
      - If not exists:
        * Create PayrollPeriod
        * Set dates using settings
        * Calculate working days
        * Set status = DRAFT
        * Save
        * Log creation
   
   c. Send notification email
```

### Auto-Create Scenarios

#### Scenario 1: Monthly Creation (Standard)
```
Settings:
- auto_create_period: True
- auto_create_day: 1
- create_months_ahead: 0

Timeline:
- Jan 1, 2026: Create January 2026 period
- Feb 1, 2026: Create February 2026 period
- Mar 1, 2026: Create March 2026 period

Benefit: Consistent, no advance creation
```

#### Scenario 2: Advance Creation
```
Settings:
- auto_create_period: True
- auto_create_day: 25
- create_months_ahead: 1

Timeline:
- Dec 25, 2025: Create Jan 2026 + Feb 2026
- Jan 25, 2026: Create Feb 2026 (exists) + Mar 2026
- Feb 25, 2026: Create Mar 2026 (exists) + Apr 2026

Benefit: Periods ready in advance
```

#### Scenario 3: Cutoff-Aligned Creation
```
Settings:
- auto_create_period: True
- auto_create_day: 20 (same as cutoff)
- create_months_ahead: 0
- use_cutoff_period: True

Timeline:
- Jan 20, 2026: 
  * Cutoff period closes (Dec 21 - Jan 20)
  * Create February period (Jan 21 - Feb 20)
- Feb 20, 2026:
  * Cutoff period closes (Jan 21 - Feb 20)
  * Create March period (Feb 21 - Mar 20)

Benefit: Period created as soon as previous closes
```

#### Scenario 4: Disabled Auto-Create
```
Settings:
- auto_create_period: False

Behavior:
- No automatic creation
- HR manually creates periods
- Full control, more work

Use case:
- Small company
- Irregular payroll
- Special requirements
```

### Notification on Creation

#### Auto-Create Success Email
```
Recipients: notification_email, payroll admins
Subject: "Payroll Periods Auto-Created"

Body:
The following payroll periods have been automatically created:

1. January 2026
   - Start: 2026-01-01
   - End: 2026-01-31
   - Pay Date: 2026-02-05
   - Status: Draft

2. February 2026
   - Start: 2026-02-01
   - End: 2026-02-28
   - Pay Date: 2026-03-05
   - Status: Draft

No action required. Periods are in Draft status.
```

#### Auto-Create Error Email
```
Recipients: admins, support
Subject: "Payroll Auto-Create Failed"

Body:
Error occurred during automatic payroll period creation:

Tenant: ABC Company (Tenant ID: 123)
Error: Duplicate period exists
Date: 2026-01-01 02:15:30

Please review and create period manually if needed.
```

### Disabling Auto-Create

#### Temporary Disable
```
Scenario: Company on hold, restructuring, etc.
Action: Set auto_create_period = False
Effect: No new periods created automatically
Re-enable: Set auto_create_period = True when ready
```

#### Permanent Disable
```
Scenario: Manual period management preferred
Action: Set auto_create_period = False permanently
Effect: All periods created manually by HR
Use case: Complex payroll, irregular cycles
```

### Expected Outcome
- Auto-create configuration added to settings
- Flexible timing control (day of month)
- Advance creation capability (months ahead)
- Foundation for Celery task automation
- Reduced manual period creation workload

### Verification Checklist
- [ ] auto_create_period BooleanField added
- [ ] auto_create_day IntegerField added
- [ ] create_months_ahead IntegerField added
- [ ] Validators applied (1-28, 0-3)
- [ ] should_auto_create_period() method created
- [ ] validate_auto_create_settings() method created
- [ ] Default values set (auto_create=False, day=1, ahead=0)
- [ ] Integration points for Celery task defined

---

## Task 15: Run PayrollSettings Migrations

### Overview
Generate and apply Django migrations for the PayrollSettings model. This task creates the database table with all configuration fields, OneToOne relationship, and ManyToMany relationship for approvers, making the settings model operational.

### Dependencies
- Task 10: Create PayrollSettings Model
- Task 11: Add Settings Pay Day
- Task 12: Add Settings Cutoff
- Task 13: Add Settings Approval
- Task 14: Add Settings Auto Create
- PostgreSQL database configured

### Instructions

1. **Verify model completeness**
   - Review PayrollSettings model in `payroll_settings.py`
   - Confirm all fields from Tasks 10-14 present
   - Check all imports complete
   - Verify model imported in models/__init__.py

2. **Generate migration file**
   - Open terminal in project root
   - Activate virtual environment
   - Run makemigrations for payroll app
   - Command: `python manage.py makemigrations payroll`

3. **Review generated migration**
   - Navigate to `apps/payroll/migrations/`
   - Open newest migration file (e.g., `0013_payroll_settings.py`)
   - Verify all fields included
   - Check OneToOne to Client
   - Check ManyToMany to User (creates junction table)
   - Confirm validators

4. **Check ManyToMany table creation**
   - Migration should create payroll_settings_approvers table
   - Junction table for M2M relationship
   - Foreign keys to payroll_settings and users

5. **Apply migration to database**
   - Run migrate command
   - Command: `python manage.py migrate payroll`
   - Observe migration output
   - Confirm successful completion

6. **Verify table creation**
   - Connect to PostgreSQL
   - Check tables exist:
     * payroll_settings
     * payroll_settings_approvers (M2M junction)
   - Verify columns: `\d payroll_settings`
   - Check constraints and indexes

7. **Test model in Django shell**
   - Open shell: `python manage.py shell`
   - Import models
   - Create test settings instance
   - Test OneToOne relationship
   - Test M2M approvers relationship

8. **Document migration**
   - Note migration number
   - Document any special considerations
   - Update deployment notes

### Migration Commands

#### Generate Migrations
```bash
Command: python manage.py makemigrations payroll

Purpose: Create migration for PayrollSettings model

Expected Output:
Migrations for 'payroll':
  apps/payroll/migrations/0013_payroll_settings.py
    - Create model PayrollSettings
    - Create ManyToMany table for approvers

Checks:
- All fields validated
- OneToOne relationship resolved
- ManyToMany junction table created
```

#### Preview SQL
```bash
Command: python manage.py sqlmigrate payroll 0013

Purpose: View SQL statements before applying

Output: CREATE TABLE, indexes, constraints

Use: Verify correct structure
```

#### Apply Migration
```bash
Command: python manage.py migrate payroll

Expected Output:
Running migrations:
  Applying payroll.0013_payroll_settings... OK

Result: Tables created, ready for use
```

### Expected Migration File Structure

```python
# apps/payroll/migrations/0013_payroll_settings.py

from django.db import migrations, models
import django.core.validators

class Migration(migrations.Migration):
    
    dependencies = [
        ('payroll', '0012_payroll_period'),
        ('tenants', '0001_initial'),
        ('auth', '0012_user'),
    ]
    
    operations = [
        migrations.CreateModel(
            name='PayrollSettings',
            fields=[
                ('id', models.BigAutoField(...)),
                ('tenant', models.OneToOneField(
                    to='tenants.Client',
                    on_delete=models.CASCADE,
                    related_name='payroll_settings'
                )),
                ('effective_from', models.DateField(...)),
                ('notification_email', models.EmailField(null=True, blank=True)),
                ('default_pay_day', models.IntegerField(
                    default=25,
                    validators=[MinValueValidator(1), MaxValueValidator(28)]
                )),
                ('adjust_for_weekends', models.BooleanField(default=True)),
                ('attendance_cutoff_day', models.IntegerField(
                    default=20,
                    validators=[MinValueValidator(1), MaxValueValidator(28)]
                )),
                ('use_cutoff_period', models.BooleanField(default=False)),
                ('require_approval', models.BooleanField(default=True)),
                ('min_approvals', models.IntegerField(default=1)),
                ('auto_create_period', models.BooleanField(default=False)),
                ('auto_create_day', models.IntegerField(default=1)),
                ('create_months_ahead', models.IntegerField(default=0)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('approvers', models.ManyToManyField(
                    to='auth.User',
                    blank=True,
                    related_name='payroll_approver_for'
                )),
            ],
            options={
                'db_table': 'payroll_settings',
                'verbose_name': 'Payroll Settings',
                'verbose_name_plural': 'Payroll Settings',
            },
        ),
    ]
```

### Database Table Structure

#### payroll_settings Table
```sql
Table: payroll_settings

Columns:
- id: bigint (primary key)
- tenant_id: bigint (unique, foreign key to clients)
- effective_from: date
- notification_email: varchar(254) (nullable)
- default_pay_day: integer
- adjust_for_weekends: boolean
- attendance_cutoff_day: integer
- use_cutoff_period: boolean
- require_approval: boolean
- min_approvals: integer
- auto_create_period: boolean
- auto_create_day: integer
- create_months_ahead: integer
- created_at: timestamp
- updated_at: timestamp

Constraints:
- PRIMARY KEY (id)
- UNIQUE (tenant_id)
- FOREIGN KEY tenant_id REFERENCES clients(id) ON DELETE CASCADE
- CHECK (default_pay_day >= 1 AND default_pay_day <= 28)
- CHECK (attendance_cutoff_day >= 1 AND attendance_cutoff_day <= 28)
- CHECK (min_approvals >= 1)
- CHECK (create_months_ahead >= 0 AND create_months_ahead <= 3)
```

#### payroll_settings_approvers Table (M2M Junction)
```sql
Table: payroll_settings_approvers

Columns:
- id: bigint (primary key)
- payrollsettings_id: bigint (foreign key to payroll_settings)
- user_id: bigint (foreign key to users)

Constraints:
- PRIMARY KEY (id)
- UNIQUE (payrollsettings_id, user_id)
- FOREIGN KEY payrollsettings_id REFERENCES payroll_settings(id) ON DELETE CASCADE
- FOREIGN KEY user_id REFERENCES auth_user(id) ON DELETE CASCADE

Purpose: Link settings to multiple approver users
```

### Verification Tests

#### Django Shell Test
```python
# Open shell
python manage.py shell

# Import models
from apps.payroll.models import PayrollSettings
from apps.tenants.models import Client
from django.contrib.auth import get_user_model
from datetime import date

User = get_user_model()

# Get tenant
tenant = Client.objects.first()

# Create settings
settings = PayrollSettings.objects.create(
    tenant=tenant,
    effective_from=date.today(),
    default_pay_day=25,
    attendance_cutoff_day=20,
    require_approval=True,
    auto_create_period=False,
)

# Verify
print(settings)  # "Payroll Settings - Tenant Name"
print(settings.default_pay_day)  # 25
print(settings.adjust_for_weekends)  # True
```

#### OneToOne Relationship Test
```python
# Access settings from tenant
tenant_settings = tenant.payroll_settings
print(tenant_settings.default_pay_day)  # 25

# Access tenant from settings
settings_tenant = settings.tenant
print(settings_tenant.name)  # Tenant name
```

#### ManyToMany Approvers Test
```python
# Add approvers
user1 = User.objects.get(email='manager@company.lk')
user2 = User.objects.get(email='hr@company.lk')

settings.approvers.add(user1, user2)
settings.save()

# Query approvers
approvers = settings.approvers.all()
print(f"Approvers: {approvers.count()}")  # 2

# Check specific user
can_approve = settings.approvers.filter(id=user1.id).exists()
print(f"User1 can approve: {can_approve}")  # True

# Remove approver
settings.approvers.remove(user2)
```

#### Method Test
```python
# Test pay date calculation
pay_date = settings.calculate_pay_date(1, 2026)
print(f"Pay date for Jan 2026: {pay_date}")

# Test cutoff calculation
start, end = settings.calculate_cutoff_dates(1, 2026)
print(f"Cutoff period: {start} to {end}")

# Test approval check
can_approve = settings.can_user_approve(user1)
print(f"User can approve: {can_approve}")

# Test auto-create check
should_create = settings.should_auto_create_period(date(2026, 1, 1))
print(f"Should auto-create: {should_create}")
```

### Multi-Tenancy Considerations

#### OneToOne Enforcement
```
Each tenant: Exactly one PayrollSettings
Database constraint: UNIQUE on tenant_id
Attempt duplicate: IntegrityError raised

Benefit: Centralized configuration per tenant
No ambiguity about active settings
```

#### Access Pattern
```
Always access settings via tenant:
settings = request.tenant.payroll_settings

Never query by ID directly:
Avoid: PayrollSettings.objects.get(id=X)
Use: request.tenant.payroll_settings
```

### Troubleshooting

#### Issue: OneToOne Already Exists
```
Error: PayrollSettings with tenant already exists

Solution:
1. Check if settings exist for tenant
2. Update existing instead of create new
3. Use get_or_create() pattern:
   settings, created = PayrollSettings.objects.get_or_create(
       tenant=tenant,
       defaults={'effective_from': date.today(), ...}
   )
```

#### Issue: ManyToMany Table Missing
```
Error: Table payroll_settings_approvers doesn't exist

Solution:
1. Check migration applied correctly
2. Re-run migrate command
3. Verify migration includes M2M creation
4. Check database for table
```

#### Issue: Validator Error
```
Error: Value out of range for validators

Solution:
1. Check field values in test data
2. Ensure 1 <= pay_day <= 28
3. Ensure 1 <= cutoff_day <= 28
4. Ensure 0 <= create_months_ahead <= 3
```

### Expected Outcome
- PayrollSettings table created in database
- M2M junction table for approvers created
- OneToOne relationship with tenant functional
- All validators applied
- Model ready for configuration management

### Verification Checklist
- [ ] makemigrations command successful
- [ ] Migration file generated (0013_payroll_settings.py)
- [ ] All fields present in migration
- [ ] OneToOne to Client configured
- [ ] ManyToMany to User configured
- [ ] M2M junction table created
- [ ] migrate command successful
- [ ] payroll_settings table exists
- [ ] payroll_settings_approvers table exists
- [ ] Django shell tests passed
- [ ] OneToOne relationship tested
- [ ] M2M approvers tested
- [ ] Model ready for use

---

## Task 16: Create Period Auto-Generation Task

### Overview
Create a Celery periodic task that automatically generates payroll periods for tenants based on their PayrollSettings configuration. This task runs daily, checks which tenants have auto-creation enabled, and creates periods on the specified day of the month, reducing manual workload and ensuring consistent payroll cycles.

### Dependencies
- Task 14: Add Settings Auto Create (auto_create_period field)
- Task 15: Run PayrollSettings Migrations
- Celery and Celery Beat configured
- Redis configured as broker
- PayrollPeriod model exists

### Instructions

1. **Create period_tasks.py file**
   - Navigate to `apps/payroll/tasks/` directory
   - Create new file `period_tasks.py`
   - Add module docstring explaining automation purpose

2. **Import required dependencies**
   - Import Celery shared_task decorator
   - Import PayrollPeriod and PayrollSettings models
   - Import date utilities (datetime, relativedelta)
   - Import logging for task monitoring
   - Import email utilities for notifications

3. **Create auto_create_payroll_periods task**
   - Decorator: @shared_task(bind=True)
   - Function name: `auto_create_payroll_periods`
   - Purpose: Daily check and create periods for eligible tenants
   - Return: Dictionary with creation statistics

4. **Implement tenant discovery logic**
   - Query PayrollSettings with auto_create_period=True
   - Filter by should_auto_create_period() for current date
   - Get list of tenants requiring period creation

5. **Implement period creation logic**
   - For each tenant:
     * Calculate periods to create (based on create_months_ahead)
     * Check if period already exists
     * Create period with proper dates and working days
     * Set status to DRAFT
     * Handle errors gracefully

6. **Add duplicate check**
   - Before creating period, check unique constraint
   - Query: PayrollPeriod exists for (tenant, month, year)
   - Skip if exists, log skip, continue to next

7. **Add notification on creation**
   - Send email to notification_email
   - Include created period details
   - List: period name, dates, status
   - Only send if periods created successfully

8. **Add error handling**
   - Try-except around period creation
   - Log errors with tenant context
   - Continue processing other tenants
   - Send error notification to admins

9. **Add logging**
   - Log task start
   - Log each tenant processed
   - Log periods created count
   - Log errors
   - Log task completion with statistics

10. **Configure Celery Beat schedule**
    - Add task to Celery Beat schedule
    - Run daily at 2:00 AM
    - Schedule key: 'auto-create-payroll-periods'

11. **Update tasks __init__.py**
    - Import auto_create_payroll_periods
    - Export in __all__ list

### Task Structure

```
Celery Task: auto_create_payroll_periods

Decorator: @shared_task(bind=True)
Schedule: Daily at 2:00 AM
Purpose: Auto-create periods for configured tenants

Input: None (runs on schedule)
Output: Dictionary with statistics

Statistics:
- total_tenants_checked: int
- periods_created: int
- tenants_processed: list
- errors: list
```

### Task Execution Flow

```
Daily Execution (2:00 AM):

1. Task starts
   └─ Log: "Auto-create task started"

2. Query tenants
   └─ Filter: auto_create_period = True
   └─ Filter: should_auto_create_period(today) = True
   └─ Result: List of eligible tenants

3. For each tenant:
   ├─ Log: "Processing tenant X"
   ├─ Get PayrollSettings
   ├─ Calculate periods to create
   │  └─ Current month + create_months_ahead
   ├─ For each period:
   │  ├─ Check if exists
   │  ├─ If not exists:
   │  │  ├─ Create PayrollPeriod
   │  │  ├─ Calculate dates from settings
   │  │  ├─ Calculate working days
   │  │  ├─ Set status = DRAFT
   │  │  ├─ Save
   │  │  └─ Log: "Created period Y"
   │  └─ If exists:
   │     └─ Log: "Period Y already exists, skip"
   ├─ Send notification email
   └─ Continue to next tenant

4. Handle errors
   ├─ Catch exceptions
   ├─ Log error with context
   ├─ Send admin notification
   └─ Continue processing

5. Task completes
   ├─ Calculate statistics
   ├─ Log summary
   └─ Return results
```

### Auto-Create Task Implementation

#### Task Function Signature
```python
@shared_task(bind=True)
def auto_create_payroll_periods(self):
    """
    Celery task to automatically create payroll periods
    for tenants with auto-creation enabled.
    
    Runs daily and checks which tenants need new periods
    based on their PayrollSettings configuration.
    
    Returns:
        dict: Statistics about period creation
    """
```

#### Tenant Discovery
```python
Purpose: Find tenants needing period creation today

Logic:
1. Get current date
2. Query PayrollSettings:
   - auto_create_period = True
   - Filter by should_auto_create_period(today)

3. Result: QuerySet of PayrollSettings

Example:
from datetime import date
today = date.today()

settings_list = PayrollSettings.objects.filter(
    auto_create_period=True,
    auto_create_day=today.day
)

tenants_to_process = [s.tenant for s in settings_list]
```

#### Period Calculation
```python
Purpose: Determine which periods to create

Input:
- Current date
- settings.create_months_ahead

Logic:
1. Calculate periods:
   periods_to_create = []
   
   for i in range(settings.create_months_ahead + 1):
       target_date = today + relativedelta(months=i)
       period_month = target_date.month
       period_year = target_date.year
       periods_to_create.append((period_month, period_year))

2. Return list of (month, year) tuples

Example:
today = 2026-01-01
create_months_ahead = 1

Results:
[
    (1, 2026),  # January 2026
    (2, 2026),  # February 2026
]
```

#### Period Creation
```python
Purpose: Create PayrollPeriod with proper configuration

For each (month, year):
1. Check if exists:
   exists = PayrollPeriod.objects.filter(
       tenant=tenant,
       period_month=month,
       period_year=year
   ).exists()
   
   if exists:
       log skip
       continue

2. Calculate dates:
   if settings.use_cutoff_period:
       start, end = settings.calculate_cutoff_dates(month, year)
   else:
       start = date(year, month, 1)
       end = last_day_of_month(year, month)
   
   pay_date = settings.calculate_pay_date(month, year)

3. Create period:
   period = PayrollPeriod.objects.create(
       tenant=tenant,
       period_month=month,
       period_year=year,
       start_date=start,
       end_date=end,
       pay_date=pay_date,
       status='draft',
   )

4. Name auto-generated by model

5. Working days auto-calculated by model

6. Return created period
```

### Error Handling

#### Try-Except Structure
```python
Purpose: Handle errors gracefully, continue processing

Structure:
for settings in settings_list:
    try:
        # Process tenant
        # Create periods
        # Send notification
        success_count += 1
    except IntegrityError as e:
        # Duplicate period (unique constraint)
        logger.warning(f"Period exists for {tenant}: {e}")
        skip_count += 1
    except Exception as e:
        # Other errors
        logger.error(f"Error creating period for {tenant}: {e}")
        error_list.append({
            'tenant': tenant.name,
            'error': str(e)
        })
        error_count += 1
    finally:
        # Always increment processed count
        processed_count += 1

Result: Continue processing all tenants even if one fails
```

#### Error Scenarios

```
Scenario 1: Duplicate Period
Error: IntegrityError (unique constraint)
Action: Log skip, continue
Reason: Period already created (manual or previous run)

Scenario 2: Invalid Dates
Error: ValueError (invalid date)
Action: Log error, notify admin, continue
Reason: Settings misconfigured (e.g., pay_day = 31)

Scenario 3: Missing Settings
Error: DoesNotExist (no PayrollSettings)
Action: Log error, continue
Reason: Tenant without settings (should not happen)

Scenario 4: Database Error
Error: OperationalError
Action: Log error, notify admin, retry?
Reason: Database connection issue
```

### Notification Emails

#### Success Notification
```
Triggered: After periods created for tenant
Recipients: settings.notification_email
Subject: "Payroll Periods Auto-Created - [Tenant Name]"

Body:
Dear Team,

The following payroll periods have been automatically created for [Tenant Name]:

1. January 2026
   - Period: 2026-01-01 to 2026-01-31
   - Pay Date: 2026-02-05
   - Status: Draft
   - Working Days: 22

2. February 2026
   - Period: 2026-02-01 to 2026-02-28
   - Pay Date: 2026-03-05
   - Status: Draft
   - Working Days: 20

The periods are ready for processing. No immediate action required.

Best regards,
LankaCommerce Payroll System
```

#### Error Notification
```
Triggered: If errors occur during creation
Recipients: System admins
Subject: "Payroll Auto-Create Error - [Tenant Name]"

Body:
Error occurred during automatic payroll period creation:

Tenant: ABC Company (ID: 123)
Date: 2026-01-01 02:05:15
Error: IntegrityError - Duplicate period

Details:
- Attempted to create: January 2026
- Reason: Period already exists

Action Required: Review tenant settings and period records.
```

### Logging

#### Log Levels
```
INFO: Normal operation
- Task started
- Tenant processed
- Period created
- Task completed

WARNING: Expected issues
- Period already exists (skip)
- No tenants to process

ERROR: Unexpected issues
- Period creation failed
- Database error
- Invalid configuration

DEBUG: Detailed information
- Settings values
- Date calculations
- Query results
```

#### Log Messages
```python
logger.info("Auto-create task started")
logger.info(f"Found {count} tenants to process")
logger.info(f"Processing tenant: {tenant.name}")
logger.info(f"Created period: {period.name}")
logger.warning(f"Period already exists, skipping: {period_name}")
logger.error(f"Error creating period for {tenant.name}: {error}")
logger.info(f"Task completed. Created {count} periods")
```

### Celery Beat Configuration

#### Schedule Definition
```python
# In celery.py or settings.py

from celery.schedules import crontab

CELERY_BEAT_SCHEDULE = {
    'auto-create-payroll-periods': {
        'task': 'apps.payroll.tasks.period_tasks.auto_create_payroll_periods',
        'schedule': crontab(hour=2, minute=0),  # 2:00 AM daily
        'options': {
            'expires': 3600,  # Task expires after 1 hour
        }
    },
}
```

#### Schedule Options
```
Option 1: Daily at 2:00 AM
schedule: crontab(hour=2, minute=0)
Reason: Off-peak hours, minimal impact

Option 2: Daily at midnight
schedule: crontab(hour=0, minute=0)
Reason: Start of new day

Option 3: Monthly on 1st at 2:00 AM
schedule: crontab(day_of_month=1, hour=2, minute=0)
Reason: Only check on typical creation day
Issue: Misses custom auto_create_day settings

Recommendation: Option 1 (daily check)
```

### Task Testing

#### Manual Invocation
```python
# Django shell or script
from apps.payroll.tasks.period_tasks import auto_create_payroll_periods

# Run task immediately
result = auto_create_payroll_periods.apply()
print(result.get())  # View results

# Or use delay for async
result = auto_create_payroll_periods.delay()
```

#### Test Scenarios
```
Test 1: Create period on correct day
- Set auto_create_day = today
- Run task
- Verify period created

Test 2: Skip on wrong day
- Set auto_create_day = tomorrow
- Run task
- Verify no period created

Test 3: Create months ahead
- Set create_months_ahead = 2
- Run task
- Verify 3 periods created (current + 2)

Test 4: Skip existing period
- Create period manually
- Run task
- Verify no duplicate, skip logged

Test 5: Handle error gracefully
- Misconfigure settings (invalid date)
- Run task
- Verify error logged, other tenants processed
```

### Performance Considerations

#### Optimization Strategies
```
1. Batch queries
   - Use select_related('tenant')
   - Prefetch related data
   - Minimize database hits

2. Limit iterations
   - Only process tenants needing creation
   - Early exit if no work to do

3. Async execution
   - Use Celery async capabilities
   - Don't block web requests

4. Error isolation
   - Wrap each tenant in try-except
   - One failure doesn't stop others
```

#### Monitoring
```
Metrics to track:
- Task execution time
- Number of tenants processed
- Number of periods created
- Error count
- Success rate

Tools:
- Celery Flower (monitoring dashboard)
- Django admin log entries
- Email notifications
- Custom metrics (Prometheus, etc.)
```

### Expected Outcome
- Celery task for automatic period creation
- Daily schedule in Celery Beat
- Tenant-specific configuration support
- Error handling and logging
- Email notifications on creation
- Reduced manual period management workload

### Verification Checklist
- [ ] period_tasks.py file created
- [ ] auto_create_payroll_periods task defined
- [ ] @shared_task decorator applied
- [ ] Tenant discovery logic implemented
- [ ] Period calculation logic implemented
- [ ] Period creation logic implemented
- [ ] Duplicate check implemented
- [ ] Error handling with try-except
- [ ] Logging added (INFO, WARNING, ERROR)
- [ ] Success email notification implemented
- [ ] Error email notification implemented
- [ ] Celery Beat schedule configured
- [ ] Task tested manually
- [ ] Task imported in tasks/__init__.py
- [ ] Documentation added

---

## Summary

This document completed the PayrollSettings model and automation infrastructure. The settings provide tenant-level configuration for pay schedules, cutoff periods, approval workflows, and automatic period generation. The Celery task automates monthly period creation, significantly reducing manual HR workload.

### Completed Tasks
- ✓ Created PayrollSettings model with OneToOne tenant relationship
- ✓ Added pay day configuration with weekend adjustment
- ✓ Implemented cutoff day for attendance tracking
- ✓ Built approval workflow with authorized approvers
- ✓ Configured auto-creation settings
- ✓ Applied PayrollSettings migrations
- ✓ Created Celery task for automatic period generation

### Key Features
- Tenant-specific payroll configuration
- Flexible pay day scheduling with weekend adjustment
- Cutoff-based attendance tracking
- Multi-user approval workflow
- Automated period generation via Celery Beat
- Email notifications for creation and errors
- Comprehensive error handling and logging

### Settings Summary

| Setting | Purpose | Default |
|---------|---------|---------|
| default_pay_day | Salary payment day | 25 |
| adjust_for_weekends | Weekend adjustment | True |
| attendance_cutoff_day | Attendance close day | 20 |
| use_cutoff_period | Enable cutoff tracking | False |
| require_approval | Mandate approval | True |
| approvers | Authorized approvers | Empty |
| auto_create_period | Enable automation | False |
| auto_create_day | Creation day | 1 |
| create_months_ahead | Advance periods | 0 |

### Next Steps
Proceed to **Group-B: PayrollRun & EmployeePayroll** to:
- Create PayrollRun model for processing batches
- Create EmployeePayroll model for individual calculations
- Implement salary components (basic, allowances, deductions)
- Build payroll calculation logic
- Integrate with PayrollPeriod and PayrollSettings

This completes Group-A: Payroll Period Models.
