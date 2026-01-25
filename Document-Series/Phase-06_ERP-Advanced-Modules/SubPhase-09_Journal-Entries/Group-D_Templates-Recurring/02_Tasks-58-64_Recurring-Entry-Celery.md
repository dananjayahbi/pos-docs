# Tasks 58-64: Recurring Entry and Celery Processing

> **Phase:** 06 - ERP Advanced Modules  
> **SubPhase:** 09 - Journal Entries  
> **Group:** D - Templates & Recurring  
> **Document:** 02 of 02  
> **Tasks Covered:** 58, 59, 60, 61, 62, 63, 64

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [01_Tasks-49-57_Template-Model-Service.md](01_Tasks-49-57_Template-Model-Service.md)

---

## Document Overview

This document covers the implementation of the recurring journal entry system, which automates the generation of journal entries at scheduled intervals. The RecurringEntry model stores scheduling information and links to templates, while a Celery Beat task processes due entries automatically.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 58 | Create RecurringEntry Model | Medium | 30 min |
| 59 | Add Recurring Template FK | Low | 10 min |
| 60 | Add Recurring Frequency | Low | 15 min |
| 61 | Add Recurring Schedule Fields | Low | 20 min |
| 62 | Add Recurring Active Flag | Low | 10 min |
| 63 | Run Recurring Migrations | Low | 5 min |
| 64 | Create Recurring Entry Celery Task | High | 45 min |

---

## Task 58: Create RecurringEntry Model

### Overview
Create the RecurringEntry model that stores scheduled journal entry configurations. This model defines when and how often journal entries should be automatically generated from templates.

### Dependencies
- Task 57: Template service must be complete
- JournalEntryTemplate model must exist
- Multi-tenancy base model available

### Instructions

1. **Create recurring_entry.py file**
   - Navigate to `apps/accounting/models/` directory
   - Create new file named `recurring_entry.py`
   - This will contain the RecurringEntry model

2. **Import required dependencies**
   - Import Django model components
   - Import TenantAwareModel from core.models
   - Import JournalEntryTemplate for foreign key
   - Import timezone utilities

3. **Define RecurringEntry class**
   - Inherit from TenantAwareModel
   - Add comprehensive class docstring
   - Explain recurring entry purpose and functionality

4. **Add Meta class configuration**
   - Set database table name: 'accounting_recurring_entries'
   - Define verbose names
   - Set default ordering by next_run_date
   - Add indexes on is_active and next_run_date

5. **Prepare for field additions**
   - Model structure will be completed in subsequent tasks
   - Fields will define template link, frequency, and schedule
   - Clean separation of concerns

### Model Purpose

| Aspect | Purpose |
|--------|---------|
| Scheduling | Define when entries should be created |
| Automation | Enable automatic entry generation |
| Template Link | Connect to reusable entry patterns |
| Frequency Control | Define recurring intervals |

### Recurring Entry Use Cases

#### Monthly Rent Entry
- Template: "Monthly Rent Payment"
- Frequency: Monthly
- Schedule: 1st of each month
- Active: Yes
- Automatic generation until end date

#### Weekly Payroll Entry
- Template: "Weekly Payroll"
- Frequency: Weekly
- Schedule: Every Friday
- Active: Yes
- Continues indefinitely

#### Quarterly Depreciation
- Template: "Asset Depreciation"
- Frequency: Quarterly
- Schedule: Last day of quarter
- Active: Yes
- End date: Asset disposal date

#### Annual Insurance Adjustment
- Template: "Insurance Expense Recognition"
- Frequency: Yearly
- Schedule: Policy renewal date
- Active: Yes
- Renewable annually

### Expected Outcome
- Base RecurringEntry model created
- Proper inheritance from TenantAwareModel
- Meta configuration established
- Ready for field additions

### Verification Checklist
- [ ] `recurring_entry.py` file created
- [ ] RecurringEntry class defined
- [ ] Inherits from TenantAwareModel
- [ ] Class docstring added
- [ ] Meta class configured
- [ ] Table name set correctly
- [ ] Indexes prepared for is_active and next_run_date

---

## Task 59: Add Recurring Template FK

### Overview
Add the foreign key relationship to JournalEntryTemplate, linking each recurring entry to its template. This connection determines what entry structure will be generated on each scheduled run.

### Dependencies
- Task 58: RecurringEntry model must exist
- JournalEntryTemplate model must be available

### Instructions

1. **Open recurring_entry.py file**
   - Navigate to RecurringEntry model class
   - Prepare to add template field

2. **Import JournalEntryTemplate**
   - Ensure import at top of file
   - From: `apps.accounting.models.journal_template`

3. **Add template field**
   - Type: ForeignKey to JournalEntryTemplate
   - on_delete: PROTECT (prevent deletion of used templates)
   - related_name: 'recurring_entries'
   - Required field (null=False)
   - Add help_text explaining relationship

4. **Add field documentation**
   - Explain template link purpose
   - Note: Template provides entry structure
   - Note: Variables will need values at runtime

5. **Consider template integrity**
   - PROTECT prevents accidental template deletion
   - If template deleted, recurring entry must be updated first
   - Maintains data integrity

### Field Specifications

| Property | Value |
|----------|-------|
| Field Type | ForeignKey |
| Related Model | JournalEntryTemplate |
| on_delete | PROTECT |
| related_name | 'recurring_entries' |
| Required | Yes |
| Null | False |

### Template Relationship

```
JournalEntryTemplate (1) ←─ (Many) RecurringEntry

One template can be used by multiple recurring entries:
- Template: "Monthly Rent"
  ├─ Recurring Entry: Office Rent (monthly)
  ├─ Recurring Entry: Warehouse Rent (monthly)
  └─ Recurring Entry: Storage Rent (monthly)
```

### Foreign Key Protection

#### Why PROTECT?
- Prevents orphaned recurring entries
- Forces explicit handling of template deletion
- Maintains referential integrity
- Requires user decision before deletion

#### Deletion Workflow
1. User attempts to delete template
2. System checks for linked recurring entries
3. If recurring entries exist, deletion blocked
4. User must:
   - Deactivate recurring entries, or
   - Reassign to different template, or
   - Delete recurring entries first
5. Then template deletion allowed

### Expected Outcome
- Template link established
- Recurring entries know which structure to use
- Template integrity protected
- Clear relationship for queries

### Verification Checklist
- [ ] JournalEntryTemplate imported
- [ ] template field added as ForeignKey
- [ ] on_delete set to PROTECT
- [ ] related_name set to 'recurring_entries'
- [ ] Field is required
- [ ] help_text added
- [ ] Field documentation included

---

## Task 60: Add Recurring Frequency

### Overview
Add the frequency field that defines how often the recurring entry should be generated. This field determines the interval between automatic entry creations.

### Dependencies
- Task 58: RecurringEntry model must exist

### Instructions

1. **Open recurring_entry.py file**
   - Continue in RecurringEntry model
   - Add frequency field after template

2. **Define FREQUENCY_CHOICES constant**
   - Create tuple with frequency options
   - Place above model class
   - Include all common recurrence patterns

3. **Define frequency constants**
   - DAILY: Every day
   - WEEKLY: Once per week
   - MONTHLY: Once per month
   - QUARTERLY: Every 3 months
   - YEARLY: Once per year

4. **Add frequency field**
   - Type: CharField
   - Max length: 20 characters
   - Choices: FREQUENCY_CHOICES
   - Required field
   - Add help_text explaining options

5. **Add field documentation**
   - Explain frequency purpose
   - Note: Determines scheduling interval
   - Note: Used by Celery task to calculate next run

### Field Specifications

| Property | Value |
|----------|-------|
| Field Type | CharField |
| Max Length | 20 |
| Choices | FREQUENCY_CHOICES |
| Required | Yes |
| Null | False |

### Frequency Definitions

| Frequency | Interval | Example Use Case |
|-----------|----------|------------------|
| DAILY | Every day | Daily sales summary entries |
| WEEKLY | Once per week | Weekly payroll entries |
| MONTHLY | Once per month | Monthly rent, depreciation |
| QUARTERLY | Every 3 months | Quarterly tax provisions |
| YEARLY | Once per year | Annual insurance adjustments |

### Frequency Calculation Logic

#### Daily Recurrence
- Next run: Current date + 1 day
- Example: If last run was Jan 15, next run is Jan 16
- Continues every day until end_date or deactivation

#### Weekly Recurrence
- Next run: Same day of week, next week
- Example: Every Friday
- If last run was Friday Jan 10, next run is Friday Jan 17

#### Monthly Recurrence
- Next run: Same day of month, next month
- Example: 1st of every month
- If last run was Jan 1, next run is Feb 1
- Handle month-end cases (e.g., Jan 31 → Feb 28)

#### Quarterly Recurrence
- Next run: Same day, 3 months later
- Example: Last day of each quarter
- Quarters: Mar 31, Jun 30, Sep 30, Dec 31

#### Yearly Recurrence
- Next run: Same date, next year
- Example: Annual policy renewal
- If last run was Jan 15, 2026, next run is Jan 15, 2027

### Edge Cases

#### Month-End Dates
```
Monthly recurrence set to 31st:
- Jan 31 → Feb 28/29 (last day of month)
- Feb 28 → Mar 31
- Mar 31 → Apr 30 (last day of month)
```

#### Leap Year Handling
```
Yearly recurrence on Feb 29:
- 2024 (leap): Feb 29
- 2025 (regular): Feb 28
- 2026 (regular): Feb 28
- 2028 (leap): Feb 29
```

#### Weekend Handling (Future Enhancement)
```
Option to adjust for weekends:
- If scheduled date is Saturday, use Friday
- If scheduled date is Sunday, use Monday
```

### Expected Outcome
- Frequency field defines recurrence pattern
- Clear interval options for users
- Foundation for scheduling calculations
- Support for common business cycles

### Verification Checklist
- [ ] FREQUENCY_CHOICES constant defined
- [ ] All frequency constants created
- [ ] frequency field added as CharField
- [ ] Choices parameter set
- [ ] Field is required
- [ ] help_text explains frequency options
- [ ] Documentation includes calculation logic

---

## Task 61: Add Recurring Schedule Fields

### Overview
Add fields that track the recurring entry schedule including start date, next run date, last run date, and optional end date. These fields control when the recurring entry is active and track its execution history.

### Dependencies
- Task 58: RecurringEntry model must exist

### Instructions

1. **Open recurring_entry.py file**
   - Continue in RecurringEntry model
   - Add schedule fields after frequency

2. **Add start_date field**
   - Type: DateField
   - Required field
   - Default: None (user must specify)
   - Help text: "Date when recurring entry begins"

3. **Add next_run_date field**
   - Type: DateField
   - Required field
   - Initially set to start_date
   - Help text: "Next scheduled execution date"
   - Indexed for query performance

4. **Add last_run_date field**
   - Type: DateField
   - Optional field (null=True, blank=True)
   - Initially None (no runs yet)
   - Help text: "Date of last successful execution"

5. **Add end_date field**
   - Type: DateField
   - Optional field (null=True, blank=True)
   - Default: None (recurring indefinitely)
   - Help text: "Optional end date for recurring entry"

6. **Add description field**
   - Type: CharField or TextField
   - Optional field
   - Max length: 255 characters
   - Help text: "Description of recurring entry purpose"

### Field Specifications

| Field | Type | Required | Indexed | Purpose |
|-------|------|----------|---------|---------|
| start_date | DateField | Yes | No | When to begin |
| next_run_date | DateField | Yes | Yes | Next scheduled run |
| last_run_date | DateField | No | No | Last execution date |
| end_date | DateField | No | No | When to stop |
| description | CharField | No | No | User description |

### Schedule Field Relationships

```
Timeline:
─────────────────────────────────────────────────────────────→
         ↑                    ↑                ↑         ↑
    start_date         last_run_date    next_run_date  end_date
   (2026-01-01)        (2026-01-31)     (2026-02-01)  (2026-12-31)
   
   Initial State:       After Execution:      Final State:
   - next_run = start   - last_run = old next - next_run > end_date
   - last_run = None    - next_run = calculated - Entry deactivates
```

### Schedule State Examples

#### New Recurring Entry
```
start_date: 2026-01-01
next_run_date: 2026-01-01
last_run_date: None
end_date: None
Status: Pending first run
```

#### Active Recurring Entry
```
start_date: 2026-01-01
next_run_date: 2026-02-01
last_run_date: 2026-01-01
end_date: 2026-12-31
Status: Active, last run completed
```

#### Completed Recurring Entry
```
start_date: 2026-01-01
next_run_date: 2027-01-01
last_run_date: 2026-12-31
end_date: 2026-12-31
Status: Completed, end_date reached
```

### Date Calculation Rules

#### Initial Setup
- next_run_date = start_date
- last_run_date = None
- Entry is ready for first execution

#### After Each Run
- last_run_date = current next_run_date
- next_run_date = calculated based on frequency
- If next_run_date > end_date, deactivate entry

#### Frequency-Based Calculation
- DAILY: next_run_date + 1 day
- WEEKLY: next_run_date + 7 days
- MONTHLY: next_run_date + 1 month (same day)
- QUARTERLY: next_run_date + 3 months
- YEARLY: next_run_date + 1 year

### Query Patterns

#### Find Due Entries
```
Filter conditions:
- is_active = True
- next_run_date <= today
- (end_date is None OR end_date >= today)

Purpose: Get entries ready to execute
Used by: Celery task
```

#### Find Upcoming Entries
```
Filter conditions:
- is_active = True
- next_run_date > today
- next_run_date <= today + 7 days

Purpose: Preview upcoming scheduled entries
Used by: Dashboard widgets
```

#### Find Expired Entries
```
Filter conditions:
- is_active = True
- end_date is not None
- end_date < today

Purpose: Identify entries that should be deactivated
Used by: Maintenance tasks
```

### Expected Outcome
- Complete schedule tracking system
- Clear execution history
- Support for time-bounded recurring entries
- Efficient querying for due entries

### Verification Checklist
- [ ] start_date field added
- [ ] next_run_date field added and indexed
- [ ] last_run_date field added
- [ ] end_date field added
- [ ] description field added
- [ ] All fields have appropriate help_text
- [ ] Date calculation logic documented
- [ ] Query patterns documented

---

## Task 62: Add Recurring Active Flag

### Overview
Add the is_active boolean field that controls whether a recurring entry is currently active and should be processed by the automated task. This provides an easy way to pause or resume recurring entries.

### Dependencies
- Task 58: RecurringEntry model must exist

### Instructions

1. **Open recurring_entry.py file**
   - Continue in RecurringEntry model
   - Add is_active field after schedule fields

2. **Add is_active field**
   - Type: BooleanField
   - Default: True (active by default)
   - Required field (not nullable)
   - Add help_text explaining purpose

3. **Add field documentation**
   - Explain active flag purpose
   - Note: Inactive entries are not processed
   - Note: Can be toggled to pause/resume

4. **Add index for performance**
   - Add to Meta.indexes
   - Frequently used in queries
   - Improves Celery task performance

5. **Document activation states**
   - Active: Entry will be processed on schedule
   - Inactive: Entry is paused, not processed
   - Can be deactivated manually or automatically

### Field Specifications

| Property | Value |
|----------|-------|
| Field Type | BooleanField |
| Default | True |
| Required | Yes |
| Null | False |
| Indexed | Yes |

### Active Flag States

| State | Value | Behavior |
|-------|-------|----------|
| Active | True | Processed on next_run_date |
| Inactive | False | Skipped by Celery task |

### Activation Scenarios

#### Manual Deactivation
```
User action: "Pause recurring entry"
Result: is_active = False
Effect: Entry not processed until reactivated
Use case: Temporary suspension (e.g., vendor on hold)
```

#### Automatic Deactivation
```
Condition: next_run_date > end_date
Result: is_active = False
Effect: Entry completed, no more runs
Use case: Time-bounded recurring entry completed
```

#### Manual Reactivation
```
User action: "Resume recurring entry"
Result: is_active = True
Effect: Entry processed on next scheduled date
Note: May need to update next_run_date if outdated
```

### Active Flag Use Cases

#### Temporary Vendor Hold
```
Scenario: Vendor payment dispute
Action: Deactivate "Monthly Vendor Payment"
Duration: Until dispute resolved
Reactivation: After resolution, resume payments
```

#### Seasonal Suspension
```
Scenario: Summer closure
Action: Deactivate "Weekly Payroll"
Duration: 3 months
Reactivation: On reopening, resume payroll
```

#### Template Modification
```
Scenario: Changing entry structure
Action: Deactivate recurring entry
Modification: Update linked template
Reactivation: After template verified
```

#### End of Contract
```
Scenario: Lease expiration
Action: Set end_date, auto-deactivate
Result: Entry stops after last payment
Status: Permanently inactive
```

### Query Optimization

#### Index Usage
```
Query: SELECT * FROM recurring_entries 
       WHERE is_active = True 
       AND next_run_date <= '2026-01-31';

Index: composite (is_active, next_run_date)
Benefit: Fast filtering of due active entries
Used by: Celery task (runs frequently)
```

### Expected Outcome
- Easy pause/resume capability
- Automatic deactivation support
- Efficient query performance
- Clear entry status

### Verification Checklist
- [ ] is_active field added as BooleanField
- [ ] Default set to True
- [ ] Field is required (not nullable)
- [ ] help_text added
- [ ] Index added to Meta.indexes
- [ ] Documentation includes use cases
- [ ] Activation/deactivation logic documented

---

## Task 63: Run Recurring Migrations

### Overview
Generate and apply database migrations for the RecurringEntry model. This creates the database table with all schedule, template, and status fields.

### Dependencies
- Task 58: RecurringEntry model created
- Task 59: Template foreign key added
- Task 60: Frequency field added
- Task 61: Schedule fields added
- Task 62: Active flag added

### Instructions

1. **Verify model is complete**
   - Open `recurring_entry.py`
   - Ensure all fields are defined:
     - template (ForeignKey)
     - frequency (CharField with choices)
     - start_date, next_run_date, last_run_date, end_date
     - description
     - is_active
   - Verify Meta class with indexes

2. **Import model in models package**
   - Open `apps/accounting/models/__init__.py`
   - Add import: `from .recurring_entry import RecurringEntry`
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
   - Check foreign key constraints
   - Verify indexes on is_active and next_run_date

5. **Apply migration**
   - Run: `python manage.py migrate accounting`
   - Verify migration applies successfully
   - Check for any errors or warnings

6. **Verify database table**
   - Connect to PostgreSQL database
   - List tables to confirm 'accounting_recurring_entries' exists
   - Describe table structure
   - Verify foreign key to journal_entry_templates
   - Check indexes created

### Migration Checklist

| Step | Command | Expected Outcome |
|------|---------|------------------|
| Import model | Add to `__init__.py` | Model discoverable |
| Make migrations | `makemigrations accounting` | Migration file created |
| Review migration | Open migration file | All fields and constraints present |
| Apply migration | `migrate accounting` | Table created |
| Verify table | Database query | Table structure correct |

### Expected Migration Operations

- **Create table:** accounting_recurring_entries
- **Add fields:**
  - id (auto-generated primary key)
  - template_id (foreign key to journal_entry_templates)
  - frequency (varchar 20 with check constraint)
  - start_date (date)
  - next_run_date (date, indexed)
  - last_run_date (date, nullable)
  - end_date (date, nullable)
  - description (varchar 255, nullable)
  - is_active (boolean, default True, indexed)
  - tenant_id (foreign key to tenants)
  - created_at, updated_at (timestamps)
  - created_by, updated_by (foreign keys to users)

### Expected Indexes

```
Index Name: idx_recurring_next_run
Columns: is_active, next_run_date
Purpose: Fast lookup of due active entries

Index Name: idx_recurring_template
Columns: template_id
Purpose: Fast lookup of entries using template

Index Name: idx_recurring_tenant
Columns: tenant_id
Purpose: Multi-tenant isolation
```

### Expected Outcome
- RecurringEntry table created in database
- All fields properly defined
- Foreign key constraints established
- Indexes created for performance
- Model ready for use

### Verification Checklist
- [ ] Model imported in `models/__init__.py`
- [ ] Migration file generated
- [ ] Migration file reviewed and correct
- [ ] All fields present in migration
- [ ] Foreign key to JournalEntryTemplate created
- [ ] Frequency choices constraint added
- [ ] Indexes on is_active and next_run_date
- [ ] Migration applied successfully
- [ ] Database table exists
- [ ] Table structure matches model

---

## Task 64: Create Recurring Entry Celery Task

### Overview
Implement the Celery periodic task that processes due recurring entries automatically. This task runs on schedule (e.g., daily), finds entries due for execution, generates journal entries from templates, and updates the recurring entry schedule.

### Dependencies
- Task 63: RecurringEntry migrations completed
- TemplateService with create_from_template method
- Celery configured in project
- Celery Beat for periodic task scheduling

### Instructions

1. **Open or create tasks.py file**
   - Navigate to `apps/accounting/` directory
   - Open existing `tasks.py` or create if doesn't exist
   - This will contain Celery tasks for accounting app

2. **Import required dependencies**
   - Import Celery shared_task decorator
   - Import RecurringEntry model
   - Import TemplateService
   - Import timezone utilities
   - Import logging for task monitoring

3. **Create process_recurring_entries task**
   - Decorate with @shared_task
   - Add task name: 'accounting.tasks.process_recurring_entries'
   - Add comprehensive docstring

4. **Implement task logic**
   - Query for due recurring entries:
     - is_active = True
     - next_run_date <= today
     - end_date is None OR end_date >= today
   - For each due entry:
     - Get template
     - Determine variable values (if needed)
     - Call TemplateService.create_from_template
     - Update last_run_date to current next_run_date
     - Calculate new next_run_date based on frequency
     - Check if end_date reached, deactivate if needed
     - Save recurring entry
   - Return summary of processed entries

5. **Add next_run calculation method**
   - Create calculate_next_run_date method
   - Accept current_date and frequency as parameters
   - Implement date arithmetic for each frequency type
   - Handle edge cases (month-end, leap year)
   - Return calculated date

6. **Add error handling**
   - Try-except around entry generation
   - Log errors but continue processing other entries
   - Don't halt entire task on single entry failure
   - Track failed entries in return summary

7. **Add logging**
   - Log task start
   - Log each entry processed
   - Log any errors
   - Log task completion with summary

8. **Configure Celery Beat schedule**
   - Add task to CELERY_BEAT_SCHEDULE in settings
   - Schedule to run daily (e.g., 2:00 AM)
   - Can be adjusted based on business needs

### Task Flow Diagram

```
process_recurring_entries() [Daily at 2:00 AM]
    │
    ├─→ Query due recurring entries
    │   WHERE:
    │   - is_active = True
    │   - next_run_date <= today
    │   - (end_date IS NULL OR end_date >= today)
    │
    ├─→ For each due entry:
    │   │
    │   ├─→ Get template
    │   │
    │   ├─→ Prepare variable values
    │   │
    │   ├─→ Create journal entry from template
    │   │   ├─→ SUCCESS: Entry created
    │   │   └─→ ERROR: Log and continue
    │   │
    │   ├─→ Update last_run_date
    │   │
    │   ├─→ Calculate next_run_date
    │   │   ├─→ DAILY: +1 day
    │   │   ├─→ WEEKLY: +7 days
    │   │   ├─→ MONTHLY: +1 month
    │   │   ├─→ QUARTERLY: +3 months
    │   │   └─→ YEARLY: +1 year
    │   │
    │   ├─→ Check if next_run > end_date
    │   │   ├─→ YES: Set is_active = False
    │   │   └─→ NO: Keep active
    │   │
    │   └─→ Save recurring entry
    │
    └─→ Return summary
        ├─→ Total processed
        ├─→ Successful entries
        ├─→ Failed entries
        └─→ Deactivated entries
```

### Next Run Date Calculation

```python
def calculate_next_run_date(current_date, frequency):
    """Calculate next run date based on frequency."""
    
    if frequency == 'DAILY':
        return current_date + timedelta(days=1)
    
    elif frequency == 'WEEKLY':
        return current_date + timedelta(weeks=1)
    
    elif frequency == 'MONTHLY':
        # Handle month-end dates
        next_month = current_date.replace(day=1) + timedelta(days=32)
        try:
            return next_month.replace(day=current_date.day)
        except ValueError:
            # Day doesn't exist in next month (e.g., Jan 31 -> Feb 31)
            # Use last day of next month
            return next_month.replace(day=1) - timedelta(days=1)
    
    elif frequency == 'QUARTERLY':
        # Add 3 months
        return add_months(current_date, 3)
    
    elif frequency == 'YEARLY':
        # Add 1 year
        try:
            return current_date.replace(year=current_date.year + 1)
        except ValueError:
            # Handle Feb 29 in non-leap year
            return current_date.replace(year=current_date.year + 1, day=28)
```

### Processing Example

#### Monthly Rent Recurring Entry

**Initial State:**
```
Recurring Entry:
- Template: "Monthly Rent Payment"
- Frequency: MONTHLY
- start_date: 2026-01-01
- next_run_date: 2026-01-01
- last_run_date: None
- end_date: 2026-12-31
- is_active: True
```

**After First Run (2026-01-01):**
```
Actions:
1. Query finds entry (next_run_date = today)
2. Get "Monthly Rent Payment" template
3. Create journal entry for 2026-01-01
4. Update: last_run_date = 2026-01-01
5. Calculate: next_run_date = 2026-02-01
6. Check: 2026-02-01 <= 2026-12-31 (OK)
7. Keep is_active = True
8. Save recurring entry

Created Entry:
- Date: 2026-01-01
- Description: "January Rent Payment"
- Status: DRAFT
- Lines from template
```

**After Last Run (2026-12-01):**
```
Actions:
1. Query finds entry (next_run_date = 2026-12-01)
2. Create journal entry for 2026-12-01
3. Update: last_run_date = 2026-12-01
4. Calculate: next_run_date = 2027-01-01
5. Check: 2027-01-01 > 2026-12-31 (EXCEEDED)
6. Set is_active = False (completed)
7. Save recurring entry

Final State:
- last_run_date: 2026-12-01
- next_run_date: 2027-01-01
- is_active: False (no more runs)
```

### Error Handling Example

```
Entry Processing:
1. Entry A: Process successfully ✓
2. Entry B: Template not found ✗
   - Log error: "Template ID 999 not found for recurring entry ID 5"
   - Continue to next entry
3. Entry C: Variable value missing ✗
   - Log error: "Missing variable 'amount' for recurring entry ID 6"
   - Continue to next entry
4. Entry D: Process successfully ✓

Task Result:
{
  "total_due": 4,
  "processed": 2,
  "failed": 2,
  "deactivated": 0,
  "errors": [
    "Recurring entry 5: Template not found",
    "Recurring entry 6: Missing variable"
  ]
}
```

### Celery Beat Schedule Configuration

```python
# In settings.py or celery.py

CELERY_BEAT_SCHEDULE = {
    'process-recurring-entries': {
        'task': 'accounting.tasks.process_recurring_entries',
        'schedule': crontab(hour=2, minute=0),  # Daily at 2:00 AM
        'options': {
            'expires': 3600,  # Task expires after 1 hour
        },
    },
}
```

### Alternative Schedules

| Schedule | Crontab | Use Case |
|----------|---------|----------|
| Daily 2 AM | `crontab(hour=2, minute=0)` | Standard (recommended) |
| Twice daily | `crontab(hour='2,14', minute=0)` | High-frequency entries |
| Hourly | `crontab(minute=0)` | Real-time processing |
| Every 10 minutes | `crontab(minute='*/10')` | Testing/development |

### Logging Examples

```
[2026-01-15 02:00:00] INFO: Starting recurring entries processing task
[2026-01-15 02:00:01] INFO: Found 12 due recurring entries
[2026-01-15 02:00:02] INFO: Processing recurring entry ID 3: Monthly Rent
[2026-01-15 02:00:02] INFO: Created journal entry ID 145 from template ID 2
[2026-01-15 02:00:02] INFO: Updated next run date to 2026-02-01
[2026-01-15 02:00:03] INFO: Processing recurring entry ID 7: Weekly Payroll
[2026-01-15 02:00:03] ERROR: Failed to process recurring entry ID 7: Template not found
[2026-01-15 02:00:10] INFO: Task completed: 12 due, 11 processed, 1 failed, 2 deactivated
```

### Expected Outcome
- Automated recurring entry processing
- Daily task execution via Celery Beat
- Reliable entry generation from templates
- Proper schedule updates and end-date handling
- Comprehensive error logging

### Verification Checklist
- [ ] tasks.py file exists in accounting app
- [ ] process_recurring_entries task created
- [ ] Task decorated with @shared_task
- [ ] Query for due entries implemented
- [ ] Entry processing loop implemented
- [ ] Template-based entry creation working
- [ ] last_run_date update implemented
- [ ] calculate_next_run_date method created
- [ ] All frequency calculations implemented
- [ ] End date checking and deactivation logic
- [ ] Error handling for individual entries
- [ ] Logging at key points
- [ ] Celery Beat schedule configured
- [ ] Task returns summary dict
- [ ] Documentation includes examples

---

## Notes for AI Agents

### Recurring Entry System Architecture

The recurring entry system automates journal entry generation:
1. RecurringEntry stores schedule and template link
2. Celery Beat runs periodic task (daily)
3. Task queries due entries and creates journal entries
4. Schedule automatically updates for next run
5. Entries auto-deactivate when end_date reached

### Celery Task Design

#### Why Celery?
- Asynchronous processing (doesn't block web requests)
- Scheduled execution via Celery Beat
- Reliable task queuing with Redis/RabbitMQ
- Automatic retry on failure
- Distributed task processing

#### Task Characteristics
- Idempotent: Safe to run multiple times
- Atomic per entry: Failure doesn't affect other entries
- Logged: Comprehensive logging for audit trail
- Fast: Processes entries efficiently
- Monitored: Returns summary for monitoring

### Schedule Calculation Patterns

#### Fixed Date Pattern
```
Monthly on 1st:
- Jan 1 → Feb 1 → Mar 1 → Apr 1
- Consistent day each month
```

#### Relative Pattern
```
Weekly on same weekday:
- Friday Jan 3 → Friday Jan 10 → Friday Jan 17
- Maintains day of week
```

#### Month-End Pattern
```
Monthly on last day:
- Jan 31 → Feb 28 → Mar 31 → Apr 30
- Adjusts to month length
```

### Variable Values for Recurring Entries

#### Static Templates (No Variables)
```
Template: Fixed amount entries
Example: Office rent always 50,000
Variable values: {} (empty dict)
Entry created with hardcoded amounts
```

#### Dynamic Templates (With Variables)
```
Template: Variable amount entries
Example: Depreciation based on asset value
Variable values: {"amount": calculate_depreciation()}
Entry created with calculated amounts

Future Enhancement: Store variable calculation logic
```

### Frequency Selection Guidelines

| Business Need | Recommended Frequency |
|---------------|----------------------|
| Rent/Lease payments | MONTHLY |
| Payroll | WEEKLY or MONTHLY |
| Depreciation | MONTHLY |
| Tax provisions | QUARTERLY |
| Insurance adjustments | YEARLY |
| Daily sales summary | DAILY |

### End Date Strategies

#### Time-Bounded Contracts
```
Example: 12-month lease
start_date: 2026-01-01
end_date: 2026-12-31
Result: Exactly 12 entries, then auto-deactivate
```

#### Indefinite Recurrence
```
Example: Ongoing utility bills
start_date: 2026-01-01
end_date: None
Result: Continues indefinitely until manually stopped
```

#### Trial Period
```
Example: 3-month promotional expense
start_date: 2026-01-01
end_date: 2026-03-31
Result: 3 entries, then stops
```

### Monitoring and Maintenance

#### Daily Checks
- Verify Celery Beat is running
- Check task execution logs
- Monitor failed entry count
- Review created journal entries

#### Weekly Reviews
- Check recurring entries approaching end_date
- Review inactive entries (manual vs automatic)
- Validate next_run_date accuracy
- Audit template integrity

#### Monthly Audits
- Compare actual entries to expected schedule
- Verify all recurring entries executed
- Check for orphaned recurring entries
- Review and update templates

### Integration Points

Recurring entries integrate with:
- **Template System:** Uses templates for entry structure
- **Journal Entry Workflow:** Creates DRAFT entries for review
- **Approval System:** Generated entries follow approval rules
- **Notification System:** Alert on failures or deactivation
- **Reporting:** Track recurring vs manual entries
- **Audit Trail:** Log all automated entry creation

### Future Enhancements

#### Variable Calculation
- Store calculation formulas with recurring entries
- Automatically compute variable values
- Example: Depreciation based on asset book value

#### Business Day Adjustment
- Skip weekends and holidays
- Adjust schedule to next business day
- Sri Lanka holiday calendar integration

#### Multi-Template Support
- One recurring entry, multiple templates
- Rotate between templates
- Example: Distribute expenses across departments

#### Approval Automation
- Auto-approve trusted recurring entries
- Require approval for amounts over threshold
- Different approval rules by category

---

## Final Checklist

### Model Implementation
- [ ] RecurringEntry model created with all fields
- [ ] template, frequency, schedule fields added
- [ ] is_active flag implemented
- [ ] Meta class with indexes configured
- [ ] Model inherits from TenantAwareModel
- [ ] Migrations generated and applied

### Celery Task Implementation
- [ ] process_recurring_entries task created
- [ ] Query for due entries implemented
- [ ] Entry processing loop working
- [ ] calculate_next_run_date method implemented
- [ ] All frequency calculations correct
- [ ] End date checking and auto-deactivation
- [ ] Error handling per entry
- [ ] Logging comprehensive
- [ ] Task returns summary dict

### Celery Beat Configuration
- [ ] CELERY_BEAT_SCHEDULE configured
- [ ] Task scheduled (e.g., daily 2 AM)
- [ ] Task name matches shared_task
- [ ] Schedule appropriate for business needs

### Integration
- [ ] TemplateService.create_from_template used
- [ ] Journal entries created in DRAFT status
- [ ] Multi-tenancy respected
- [ ] Audit fields populated

### Testing Readiness
- [ ] Task can be run manually for testing
- [ ] Example recurring entries documented
- [ ] Edge cases documented (month-end, leap year)
- [ ] Error scenarios covered
- [ ] Ready for unit and integration tests

### Documentation
- [ ] Frequency calculation logic documented
- [ ] Schedule update logic explained
- [ ] Error handling strategy clear
- [ ] Monitoring guidelines provided
- [ ] Integration points identified
