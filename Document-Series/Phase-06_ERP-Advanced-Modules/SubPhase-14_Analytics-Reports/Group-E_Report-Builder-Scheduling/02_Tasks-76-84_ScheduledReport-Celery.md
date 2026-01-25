# Tasks 76-84: ScheduledReport Model, Celery Task, and Email Delivery

> **Phase:** 06 - ERP Advanced Modules  
> **SubPhase:** 14 - Analytics & Reports  
> **Group:** E - Report Builder & Scheduling  
> **Document:** 02 of 02  
> **Tasks Covered:** 76, 77, 78, 79, 80, 81, 82, 83, 84

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [01_Tasks-71-75_SavedReport-Model.md](01_Tasks-71-75_SavedReport-Model.md)

---

## Document Overview

This document covers the implementation of automated report scheduling functionality, including the ScheduledReport model for managing report schedules, Celery Beat integration for periodic task execution, email distribution system for report delivery, and comprehensive history tracking. This system enables users to configure reports that generate and distribute automatically on daily, weekly, or monthly schedules.

### Tasks in This Document

| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 76 | Create ScheduledReport model | Medium | 45 min |
| 77 | Add schedule frequency and timing fields | Medium | 30 min |
| 78 | Add recipients and email configuration | Medium | 25 min |
| 79 | Add next run calculation logic | High | 40 min |
| 80 | Run ScheduledReport migrations | Low | 10 min |
| 81 | Create report scheduler Celery task | High | 60 min |
| 82 | Add generate scheduled report method | Medium | 45 min |
| 83 | Add email distribution system | High | 50 min |
| 84 | Add schedule history tracking | Medium | 35 min |

### Purpose

The ScheduledReport system provides automated report generation and distribution:
- **Automation** - Generate reports automatically on schedules
- **Email Delivery** - Distribute reports to stakeholders via email
- **Flexible Scheduling** - Daily, weekly, monthly frequencies
- **History Tracking** - Log all scheduled report executions
- **Reliability** - Celery-based task queue for robust execution
- **Monitoring** - Track success/failure status of scheduled runs

---

## System Architecture

### Component Overview

```
┌────────────────────────────────────────────────────────────┐
│                    Celery Beat Scheduler                    │
│              (Periodic Task Trigger System)                 │
└──────────────────────┬─────────────────────────────────────┘
                       │
                       │ Every Minute: Check for Due Reports
                       ▼
┌────────────────────────────────────────────────────────────┐
│         process_scheduled_reports() Celery Task             │
│                                                             │
│  1. Query ScheduledReport.objects.filter(                   │
│       is_active=True, next_run <= now)                     │
│  2. For each due report:                                   │
│     - Call generate_report_instance()                      │
│     - Send email with attachment                           │
│     - Calculate next_run time                              │
│     - Create ScheduleHistory entry                         │
└──────────────────────┬─────────────────────────────────────┘
                       │
                       ▼
┌────────────────────────────────────────────────────────────┐
│                  ScheduledReport Model                      │
│                                                             │
│  • saved_report (FK to SavedReport)                        │
│  • frequency: DAILY / WEEKLY / MONTHLY                     │
│  • day_of_week: 0-6 (Monday-Sunday)                        │
│  • day_of_month: 1-31                                      │
│  • time_of_day: HH:MM time                                 │
│  • recipients: ["email1@...", "email2@..."]                │
│  • is_active: Boolean                                      │
│  • next_run: DateTime                                      │
│  • last_run: DateTime                                      │
│  • last_status: SUCCESS / FAILED / PENDING                 │
└──────────────────────┬─────────────────────────────────────┘
                       │
                       ▼
┌────────────────────────────────────────────────────────────┐
│                  ScheduleHistory Model                      │
│                                                             │
│  • scheduled_report (FK)                                   │
│  • run_at: DateTime                                        │
│  • status: SUCCESS / FAILED                                │
│  • report_instance (FK to ReportInstance, nullable)        │
│  • error_message: Text (if failed)                         │
│  • recipients_count: Integer                               │
│  • email_sent: Boolean                                     │
└────────────────────────────────────────────────────────────┘
```

### Execution Flow

```
[Celery Beat] --every minute--> [Check Due Reports]
                                        │
                    ┌───────────────────┴───────────────────┐
                    │                                       │
                    ▼                                       ▼
            [Daily Reports]                         [Weekly Reports]
        (next_run matches today)              (day_of_week matches)
                    │                                       │
                    └───────────────────┬───────────────────┘
                                        │
                                        ▼
                            [Monthly Reports]
                       (day_of_month matches)
                                        │
                                        ▼
                        [Generate Report Instance]
                                        │
                                        ▼
                            [Send Email with PDF]
                                        │
                                        ▼
                          [Update next_run Time]
                                        │
                                        ▼
                        [Create ScheduleHistory]
```

---

## Task 76: Create ScheduledReport Model

### Overview

Create the core ScheduledReport model within the analytics application. This model manages automated report generation schedules, linking to saved report configurations and defining when and how reports should be generated and distributed. The model inherits from TenantAwareModel to ensure proper multi-tenancy isolation and includes all essential fields for schedule management.

### Dependencies

- Task 75: SavedReport migrations completed
- SavedReport model exists and is functional
- TenantAwareModel base class available
- Django ORM configured
- ReportInstance model exists (for foreign key relationship)

### Instructions

1. **Create scheduled_report.py model file**
   - Navigate to `apps/analytics/models/` directory
   - Create new file named `scheduled_report.py`
   - This file will contain ScheduledReport and ScheduleHistory models

2. **Import required Django modules**
   - Import `models` from `django.db`
   - Import `timezone` from `django.utils`
   - Import `timedelta` from `datetime`
   - Import JSON validation utilities

3. **Import base model classes**
   - Import `TenantAwareModel` from core models
   - Provides automatic tenant scoping
   - Ensures scheduled reports are isolated per tenant

4. **Import related models**
   - Import `SavedReport` from same models package
   - Import `User` model for created_by field
   - Will import `ReportInstance` for tracking generated reports

5. **Define ScheduledReport model class**
   - Create class named `ScheduledReport`
   - Inherit from `TenantAwareModel`
   - Add comprehensive model docstring explaining purpose

6. **Add Meta class configuration**
   - Set `db_table` to 'analytics_scheduled_report'
   - Set `verbose_name` to 'Scheduled Report'
   - Set `verbose_name_plural` to 'Scheduled Reports'
   - Add ordering by `next_run` ascending
   - Add indexes on `is_active`, `next_run`, `last_run`

7. **Add saved_report foreign key field**
   - ForeignKey to SavedReport model
   - Set `on_delete=models.CASCADE` (delete schedule if saved report deleted)
   - Set `related_name='schedules'`
   - Add help text explaining relationship
   - This links schedule to report configuration

8. **Add is_active boolean field**
   - BooleanField with default=True
   - Controls whether schedule is currently enabled
   - Add help text: "Whether this schedule is active"
   - Allows pausing schedules without deletion

9. **Add created_by foreign key field**
   - ForeignKey to User model
   - Set `on_delete=models.SET_NULL`, `null=True`
   - Set `related_name='created_schedules'`
   - Tracks who created the schedule

10. **Add last_run datetime field**
    - DateTimeField with `null=True`, `blank=True`
    - Tracks when schedule last executed
    - Add help text: "Last execution time"
    - Used for monitoring and debugging

11. **Add last_status choice field**
    - CharField with max_length=20
    - Define STATUS_CHOICES: SUCCESS, FAILED, PENDING
    - Set `null=True`, `blank=True`
    - Tracks outcome of last execution
    - Used for error monitoring

12. **Add error_message text field**
    - TextField with `null=True`, `blank=True`
    - Stores error details if execution fails
    - Add help text: "Error message from last failed run"
    - Essential for debugging schedule failures

### Expected Outcome

- ScheduledReport model class created
- Proper inheritance from TenantAwareModel
- Foreign key to SavedReport established
- Core fields defined (is_active, created_by, last_run, last_status)
- Meta configuration with appropriate indexes
- Foundation ready for frequency and timing fields

### Verification Checklist

- [ ] `scheduled_report.py` file created in `apps/analytics/models/`
- [ ] ScheduledReport class defined
- [ ] Inherits from TenantAwareModel
- [ ] saved_report ForeignKey configured with CASCADE delete
- [ ] is_active boolean field with default=True
- [ ] created_by ForeignKey to User with SET_NULL
- [ ] last_run DateTimeField (nullable)
- [ ] last_status CharField with STATUS_CHOICES
- [ ] error_message TextField (nullable)
- [ ] Meta class with db_table, verbose_name, ordering
- [ ] Indexes on is_active, next_run, last_run defined
- [ ] Model registered in `models/__init__.py`

---

## Task 77: Add Schedule Frequency and Timing Fields

### Overview

Add frequency and timing fields to the ScheduledReport model to control when reports are generated. These fields define whether reports run daily, weekly, or monthly, and specify the exact time and day for execution. The frequency system supports flexible scheduling patterns while maintaining simplicity in configuration.

### Dependencies

- Task 76: ScheduledReport model created
- Core model structure established
- Django time fields understanding

### Instructions

1. **Define FREQUENCY_CHOICES constant**
   - Create tuple at module level
   - Define three frequency options:
     - ('DAILY', 'Daily') - runs every day
     - ('WEEKLY', 'Weekly') - runs once per week
     - ('MONTHLY', 'Monthly') - runs once per month
   - Place constant above model definition

2. **Define DAY_OF_WEEK_CHOICES constant**
   - Create tuple mapping day numbers to names
   - Define choices from 0-6:
     - (0, 'Monday')
     - (1, 'Tuesday')
     - (2, 'Wednesday')
     - (3, 'Thursday')
     - (4, 'Friday')
     - (5, 'Saturday')
     - (6, 'Sunday')
   - Used for weekly frequency scheduling

3. **Add frequency choice field**
   - CharField with max_length=10
   - Set choices=FREQUENCY_CHOICES
   - Set default='WEEKLY'
   - Add help text: "How often the report should be generated"
   - Required field (no null/blank)

4. **Add time_of_day time field**
   - TimeField to specify execution time
   - Set default to 09:00:00 (9 AM)
   - Add help text: "Time of day to generate report (tenant timezone)"
   - Required field
   - Used for all frequency types

5. **Add day_of_week integer field**
   - IntegerField with choices=DAY_OF_WEEK_CHOICES
   - Set `null=True`, `blank=True`
   - Add help text: "Day of week for weekly schedules (0=Monday, 6=Sunday)"
   - Set validators for range 0-6
   - Only used when frequency='WEEKLY'

6. **Add day_of_month integer field**
   - IntegerField with no choices
   - Set `null=True`, `blank=True`
   - Add help text: "Day of month for monthly schedules (1-31)"
   - Set validators for range 1-31
   - Only used when frequency='MONTHLY'
   - Handle month-end edge cases (e.g., day 31 in February)

7. **Add next_run datetime field**
   - DateTimeField to track next scheduled execution
   - Set `null=True`, `blank=True`
   - Add help text: "Next scheduled run time (UTC)"
   - Add database index for query performance
   - This is the primary field used by Celery task

8. **Update Meta class indexes**
   - Add composite index on (is_active, next_run)
   - This optimizes the query for due reports
   - Add index on frequency for filtering

### Frequency Logic Rules

| Frequency | Required Fields | Calculation Logic |
|-----------|----------------|-------------------|
| DAILY | time_of_day | Run every day at specified time |
| WEEKLY | time_of_day, day_of_week | Run on specified weekday at specified time |
| MONTHLY | time_of_day, day_of_month | Run on specified day of month at specified time |

### Edge Case Handling

1. **Monthly day_of_month edge cases:**
   - If day_of_month=31 and current month has 30 days, run on last day (30th)
   - If day_of_month=29-31 in February, run on last day of February
   - Always attempt to run on specified day or closest available

2. **Timezone considerations:**
   - Store next_run in UTC timezone
   - time_of_day interpreted in tenant's timezone
   - Convert tenant time to UTC when calculating next_run

3. **Daylight saving time:**
   - Handle DST transitions gracefully
   - Use timezone-aware datetime calculations
   - Maintain consistent execution times

### Expected Outcome

- Frequency field with DAILY/WEEKLY/MONTHLY options
- time_of_day field for execution timing
- day_of_week field for weekly schedules
- day_of_month field for monthly schedules
- next_run field for tracking upcoming execution
- Proper indexes for query optimization
- Clear documentation of frequency logic

### Verification Checklist

- [ ] FREQUENCY_CHOICES constant defined with three options
- [ ] DAY_OF_WEEK_CHOICES constant defined (0-6)
- [ ] frequency CharField with choices and default='WEEKLY'
- [ ] time_of_day TimeField with default=09:00:00
- [ ] day_of_week IntegerField (nullable, range 0-6)
- [ ] day_of_month IntegerField (nullable, range 1-31)
- [ ] next_run DateTimeField (nullable, indexed)
- [ ] Validators added for day ranges
- [ ] Composite index on (is_active, next_run)
- [ ] Help text added to all fields
- [ ] Model documentation updated

---

## Task 78: Add Recipients and Email Configuration

### Overview

Add recipient management and email configuration fields to the ScheduledReport model. The recipients field stores a list of email addresses as JSON, allowing flexible distribution lists. Additional email configuration fields control subject line, message body, and attachment settings for automated report delivery.

### Dependencies

- Task 77: Frequency and timing fields added
- JSONField available (Django 3.1+)
- Email validation utilities available

### Instructions

1. **Add recipients JSONField**
   - JSONField to store list of email addresses
   - Set default=list (empty list)
   - Add help text: "List of email addresses to receive the report"
   - Store as JSON array: ["email1@example.com", "email2@example.com"]
   - Validate that it's a list of valid email addresses

2. **Add custom validation for recipients field**
   - Create custom validator function `validate_email_list`
   - Check that value is a list
   - Check that each item is a valid email address
   - Raise ValidationError if invalid
   - Place validator function before model definition

3. **Add email_subject CharField**
   - CharField with max_length=200
   - Set `null=True`, `blank=True`
   - Add help text: "Custom email subject line (uses default if blank)"
   - Support template variables: {report_name}, {date}, {tenant_name}
   - Example: "Scheduled Report: {report_name} - {date}"

4. **Add email_body TextField**
   - TextField for custom email message
   - Set `null=True`, `blank=True`
   - Add help text: "Custom email message body (uses default if blank)"
   - Support same template variables as subject
   - Can include HTML formatting

5. **Add include_csv boolean field**
   - BooleanField with default=False
   - Controls whether CSV attachment is included
   - Add help text: "Include CSV version of report as attachment"
   - If True, attach both PDF and CSV

6. **Add include_excel boolean field**
   - BooleanField with default=False
   - Controls whether Excel attachment is included
   - Add help text: "Include Excel version of report as attachment"
   - If True, attach Excel file

7. **Add attach_pdf boolean field**
   - BooleanField with default=True
   - Controls whether PDF attachment is included
   - Add help text: "Include PDF version of report as attachment"
   - Default format for report delivery

8. **Add cc_emails JSONField**
   - JSONField for CC recipients (optional)
   - Set default=list, `null=True`, `blank=True`
   - Add help text: "CC email addresses"
   - Same validation as recipients field

9. **Add bcc_emails JSONField**
   - JSONField for BCC recipients (optional)
   - Set default=list, `null=True`, `blank=True`
   - Add help text: "BCC email addresses"
   - Same validation as recipients field
   - Useful for silent monitoring

### Email Template Variables

| Variable | Description | Example |
|----------|-------------|---------|
| {report_name} | Name of the saved report | "Monthly Sales Report" |
| {date} | Current date | "2026-01-25" |
| {tenant_name} | Name of tenant | "Acme Corporation" |
| {frequency} | Schedule frequency | "Weekly" |
| {period_start} | Report period start | "2026-01-01" |
| {period_end} | Report period end | "2026-01-31" |

### Default Email Template

**Default Subject:**
```
Scheduled Report: {report_name} - {date}
```

**Default Body:**
```
Dear User,

Your scheduled {frequency} report "{report_name}" has been generated successfully.

Report Period: {period_start} to {period_end}
Generated: {date}
Tenant: {tenant_name}

Please find the report attached to this email.

This is an automated message from the ERP Analytics System.
```

### Recipients JSON Structure

```json
{
  "recipients": [
    "manager@example.com",
    "analyst@example.com",
    "director@example.com"
  ],
  "cc_emails": [
    "supervisor@example.com"
  ],
  "bcc_emails": [
    "audit@example.com"
  ]
}
```

### Expected Outcome

- recipients JSONField storing email addresses
- Email validation for all recipient fields
- email_subject and email_body customization
- Attachment format options (PDF, CSV, Excel)
- CC and BCC support for flexible distribution
- Template variable support for dynamic content
- Clear default email template

### Verification Checklist

- [ ] recipients JSONField with default=list
- [ ] validate_email_list validator function created
- [ ] Validator checks for list and valid emails
- [ ] email_subject CharField (max 200, nullable)
- [ ] email_body TextField (nullable)
- [ ] include_csv BooleanField (default=False)
- [ ] include_excel BooleanField (default=False)
- [ ] attach_pdf BooleanField (default=True)
- [ ] cc_emails JSONField (nullable)
- [ ] bcc_emails JSONField (nullable)
- [ ] Template variable documentation added
- [ ] Default email template defined
- [ ] All fields have help text

---

## Task 79: Add Next Run Calculation Logic

### Overview

Implement the logic to calculate the next scheduled run time based on frequency settings. This is a critical method that determines when each scheduled report should execute next. The calculation must account for timezone conversion, edge cases (like month-end dates), and ensure accurate scheduling across different frequency types.

### Dependencies

- Task 78: Recipients and email configuration added
- All frequency fields defined
- Python datetime and timezone libraries
- Tenant timezone settings available

### Instructions

1. **Create calculate_next_run method**
   - Add instance method to ScheduledReport model
   - Method signature: `def calculate_next_run(self)`
   - Returns datetime object (timezone-aware, UTC)
   - Call this method after each report execution

2. **Import required modules in method**
   - Import `timezone` from `django.utils`
   - Import `timedelta` from `datetime`
   - Import `pytz` for timezone handling
   - Get tenant timezone from tenant settings

3. **Get current time in tenant timezone**
   - Get current UTC time: `timezone.now()`
   - Convert to tenant timezone
   - Use tenant's timezone setting (e.g., 'Asia/Colombo')
   - This is the reference point for calculation

4. **Implement DAILY frequency calculation**
   - If frequency == 'DAILY':
     - Get today's date in tenant timezone
     - Combine with self.time_of_day
     - Create datetime for today at specified time
     - If time already passed today, add 1 day
     - Convert result to UTC
     - Return UTC datetime

5. **Implement WEEKLY frequency calculation**
   - If frequency == 'WEEKLY':
     - Get current day of week (0-6)
     - Calculate days until target day_of_week
     - If target day is today, check if time passed
     - If time passed, target next week (add 7 days)
     - Combine target date with time_of_day
     - Convert to UTC and return

6. **Implement MONTHLY frequency calculation**
   - If frequency == 'MONTHLY':
     - Get current month and year
     - Try to create date with day_of_month
     - Handle edge case: if day_of_month > days in month
       - Use last day of month instead
       - Example: day_of_month=31 in February → use 28/29
     - If target date already passed this month, move to next month
     - Apply same edge case handling for next month
     - Combine with time_of_day
     - Convert to UTC and return

7. **Handle timezone conversion**
   - Create helper method `_localize_to_tenant_tz(self, dt)`
   - Accepts naive datetime
   - Returns timezone-aware datetime in tenant timezone
   - Use tenant's timezone setting

8. **Handle edge case: Invalid day_of_month**
   - Create helper method `_get_valid_day_of_month(self, year, month)`
   - Checks if day_of_month is valid for given year/month
   - If invalid (e.g., day 31 in April), return last valid day
   - Use calendar module for month day count

9. **Add save override to set initial next_run**
   - Override save() method
   - On first save (if next_run is None):
     - Call calculate_next_run()
     - Set next_run to calculated value
   - Call super().save()

10. **Add update_next_run method**
    - Method to update next_run after execution
    - Called by Celery task after report generation
    - Recalculates next_run based on frequency
    - Saves the instance

### Calculation Logic Examples

**DAILY Example:**
```
Current: 2026-01-25 14:30 (tenant timezone)
time_of_day: 09:00
Result: 2026-01-26 09:00 (tenant) → Convert to UTC
Logic: Time already passed today, so tomorrow at 09:00
```

**WEEKLY Example:**
```
Current: 2026-01-25 (Saturday, day 5)
day_of_week: 1 (Tuesday)
time_of_day: 09:00
Result: 2026-01-27 09:00 (next Tuesday)
Logic: Calculate days until Tuesday: (1 - 5) % 7 = 3 days
```

**MONTHLY Example:**
```
Current: 2026-01-25
day_of_month: 15
time_of_day: 09:00
Result: 2026-02-15 09:00
Logic: Day 15 already passed this month, so next month day 15
```

**MONTHLY Edge Case:**
```
Current: 2026-01-25
day_of_month: 31
Result: 2026-01-31 09:00 (January has 31 days)
Next Run: 2026-02-28 09:00 (February doesn't have 31 days)
Logic: Use last day of February (28 or 29)
```

### Timezone Conversion Example

```
Tenant Timezone: Asia/Colombo (UTC+5:30)
time_of_day: 09:00 (tenant time)
Converted to UTC: 03:30 UTC

Daily schedule at 09:00 Asia/Colombo:
- Stored as next_run: 2026-01-26 03:30:00 UTC
- Displayed in UI: 2026-01-26 09:00:00 Asia/Colombo
```

### Edge Cases to Handle

1. **Daylight Saving Time (DST)**
   - Use timezone-aware datetimes
   - Let pytz handle DST transitions
   - May result in 23 or 25 hour days

2. **Month-end dates (day 29-31)**
   - Check if day exists in target month
   - Fall back to last day of month
   - Document behavior for users

3. **Leap years**
   - February 29 only exists in leap years
   - Handle day_of_month=29 in non-leap years
   - Use February 28 as fallback

4. **Week wraparound**
   - If day_of_week < current day, add 7 days
   - If day_of_week == current day and time passed, add 7 days
   - Ensure no skipped weeks

### Expected Outcome

- calculate_next_run() method working for all frequencies
- Proper timezone conversion from tenant to UTC
- Edge case handling for month-end dates
- Helper methods for timezone and date validation
- save() override to set initial next_run
- update_next_run() method for post-execution updates
- Accurate scheduling across DST transitions

### Verification Checklist

- [ ] calculate_next_run() method created
- [ ] DAILY frequency calculation implemented
- [ ] WEEKLY frequency calculation implemented
- [ ] MONTHLY frequency calculation implemented
- [ ] _localize_to_tenant_tz() helper method
- [ ] _get_valid_day_of_month() helper method
- [ ] Edge case handling for day 29-31
- [ ] Timezone conversion to UTC
- [ ] save() override to set initial next_run
- [ ] update_next_run() method created
- [ ] Method returns timezone-aware datetime
- [ ] All calculations tested with examples
- [ ] Documentation of calculation logic

---

## Task 80: Run ScheduledReport Migrations

### Overview

Generate and apply Django migrations for the ScheduledReport model, creating the database table with all configured fields, indexes, and constraints. This task finalizes the model definition and makes it available for use in the application.

### Dependencies

- Task 79: Next run calculation logic complete
- All ScheduledReport model fields defined
- Django migrations system configured
- Database connection established

### Instructions

1. **Register model in models package**
   - Open `apps/analytics/models/__init__.py`
   - Import ScheduledReport from scheduled_report module
   - Add to `__all__` list for exports
   - Ensure model is discoverable by Django

2. **Verify model imports**
   - Check all related model imports
   - Ensure SavedReport is importable
   - Verify User model import
   - Check TenantAwareModel import

3. **Generate migration file**
   - Open terminal in project root
   - Activate virtual environment
   - Run command: `python manage.py makemigrations analytics`
   - Django will detect ScheduledReport model
   - Migration file created in `apps/analytics/migrations/`

4. **Review generated migration**
   - Open the new migration file
   - Verify all fields are included
   - Check field types match model definition
   - Confirm indexes are created:
     - Index on is_active
     - Index on next_run
     - Composite index on (is_active, next_run)
   - Verify foreign keys configured correctly

5. **Check migration dependencies**
   - Ensure migration depends on SavedReport migration
   - Check dependency on previous analytics migrations
   - Verify no circular dependencies
   - Confirm dependency on User model migration

6. **Apply migration to database**
   - Run command: `python manage.py migrate analytics`
   - Django creates scheduled_reports table
   - Indexes and constraints applied
   - Foreign key relationships established

7. **Verify database schema**
   - Connect to database
   - Check table exists: `analytics_scheduled_report`
   - Verify all columns created
   - Confirm indexes exist
   - Check foreign key constraints

8. **Test model in Django shell**
   - Open Django shell: `python manage.py shell`
   - Import ScheduledReport model
   - Try to create test instance
   - Verify save() works correctly
   - Test calculate_next_run() method

### Migration Verification Steps

1. **Check migration file contents:**
   - CreateModel operation for ScheduledReport
   - All fields with correct types
   - ForeignKey to SavedReport
   - Indexes defined in Meta
   - Validators included

2. **Verify database table:**
   ```sql
   -- Check table exists
   SELECT * FROM information_schema.tables 
   WHERE table_name = 'analytics_scheduled_report';
   
   -- Check columns
   SELECT column_name, data_type 
   FROM information_schema.columns 
   WHERE table_name = 'analytics_scheduled_report';
   
   -- Check indexes
   SELECT indexname FROM pg_indexes 
   WHERE tablename = 'analytics_scheduled_report';
   ```

3. **Test model operations:**
   - Create instance
   - Save instance
   - Query instances
   - Update instance
   - Test calculate_next_run() method

### Expected Outcome

- Migration file generated successfully
- Database table created with all fields
- Indexes applied for query optimization
- Foreign key relationships established
- Model queryable and functional
- No migration errors or warnings
- ScheduledReport ready for use in application

### Verification Checklist

- [ ] ScheduledReport imported in `models/__init__.py`
- [ ] makemigrations command executed successfully
- [ ] Migration file created in analytics/migrations/
- [ ] Migration includes all model fields
- [ ] Foreign keys to SavedReport and User included
- [ ] Indexes defined in migration
- [ ] migrate command executed successfully
- [ ] Database table created: analytics_scheduled_report
- [ ] All columns exist in database
- [ ] Indexes created in database
- [ ] Foreign key constraints applied
- [ ] Model tested in Django shell
- [ ] calculate_next_run() method works
- [ ] No migration warnings or errors

---

## Task 81: Create Report Scheduler Celery Task

### Overview

Create the core Celery periodic task that queries for due scheduled reports and triggers their generation. This task runs every minute via Celery Beat, checking for any ScheduledReport instances where next_run time has been reached. It orchestrates the entire scheduled report execution workflow, including report generation, email sending, and history logging.

### Dependencies

- Task 80: ScheduledReport migrations complete
- Celery and Celery Beat configured
- Celery worker running
- Redis or RabbitMQ message broker configured
- Email backend configured

### Instructions

1. **Create tasks.py file in analytics app**
   - Navigate to `apps/analytics/` directory
   - Create new file `tasks.py`
   - This file contains all Celery tasks for analytics

2. **Import required Celery modules**
   - Import `shared_task` decorator from celery
   - Import `crontab` for Celery Beat scheduling
   - Import `timezone` from django.utils
   - Import logging for task monitoring

3. **Import analytics models**
   - Import ScheduledReport model
   - Import SavedReport model
   - Import ReportInstance model (for tracking generated reports)
   - Import ScheduleHistory model (will create in Task 84)

4. **Set up logging for task**
   - Create logger instance
   - Use `__name__` for logger name
   - Set appropriate log level
   - Log task start, success, and errors

5. **Create process_scheduled_reports task**
   - Use `@shared_task` decorator
   - Set task name: 'analytics.process_scheduled_reports'
   - Add retry configuration: max_retries=3
   - Function signature: `def process_scheduled_reports()`

6. **Query for due scheduled reports**
   - Get current UTC time: `timezone.now()`
   - Query ScheduledReport.objects.filter():
     - is_active=True
     - next_run__lte=current_time (due now or overdue)
   - Use select_related('saved_report') for optimization
   - Order by next_run ascending (oldest first)

7. **Iterate through due reports**
   - Loop through each scheduled report
   - Wrap in try/except block for error handling
   - Log each report being processed
   - Track success/failure count

8. **Generate report for each schedule**
   - Call generate_scheduled_report() method (Task 82)
   - Pass scheduled_report instance
   - Returns ReportInstance or None if failed
   - Capture any exceptions

9. **Update schedule after execution**
   - Update last_run to current time
   - Calculate and update next_run
   - Call calculate_next_run() method
   - Set last_status based on success/failure
   - Save scheduled_report instance

10. **Log execution results**
    - Log total reports processed
    - Log success count
    - Log failure count
    - Include timing information
    - Return summary dictionary

### Task Structure

```python
@shared_task(
    name='analytics.process_scheduled_reports',
    bind=True,
    max_retries=3
)
def process_scheduled_reports(self):
    """
    Process all due scheduled reports.
    
    Queries for active schedules where next_run <= now,
    generates reports, sends emails, and updates schedules.
    
    Returns:
        dict: Summary of processed reports
    """
    # Task implementation
```

### Celery Beat Configuration

Configure in Django settings or Celery configuration:

```python
# settings/celery.py or settings/base.py

CELERY_BEAT_SCHEDULE = {
    'process-scheduled-reports': {
        'task': 'analytics.process_scheduled_reports',
        'schedule': crontab(minute='*'),  # Every minute
        'options': {
            'expires': 50,  # Task expires after 50 seconds
        }
    },
}
```

### Task Workflow

```
1. Start Task
   │
2. Get Current Time (UTC)
   │
3. Query Due Reports
   │   SELECT * FROM scheduled_report
   │   WHERE is_active=True 
   │   AND next_run <= NOW()
   │
4. For Each Report:
   │
   ├─ 5. Generate Report Instance
   │     │   - Call saved_report.generate()
   │     │   - Apply filters
   │     │   - Create ReportInstance
   │     │
   ├─ 6. Send Email (Task 83)
   │     │   - Format email body
   │     │   - Attach report file
   │     │   - Send to recipients
   │     │
   ├─ 7. Update Schedule
   │     │   - Set last_run = now()
   │     │   - Calculate next_run
   │     │   - Set last_status
   │     │   - Save instance
   │     │
   └─ 8. Log History (Task 84)
         │   - Create ScheduleHistory entry
         │   - Record status
         │   - Log recipients count
         │
9. Return Summary
   - Total processed
   - Success count
   - Failure count
```

### Error Handling Strategy

1. **Per-schedule error handling:**
   - Wrap each schedule processing in try/except
   - Log error details
   - Set last_status='FAILED'
   - Store error_message
   - Continue to next schedule

2. **Task-level error handling:**
   - Catch unexpected errors
   - Log full traceback
   - Return partial results
   - Don't let one failure stop others

3. **Retry logic:**
   - Use Celery retry mechanism
   - Exponential backoff
   - Max 3 retries
   - Alert if all retries fail

### Logging Requirements

```
INFO: Starting scheduled report processing
INFO: Found 5 due scheduled reports
INFO: Processing schedule #123: Monthly Sales Report
INFO: Report generated successfully: instance_id=456
INFO: Email sent to 3 recipients
INFO: Schedule updated: next_run=2026-02-25 09:00:00
ERROR: Failed to process schedule #124: Database timeout
WARNING: Schedule #125 skipped: saved_report deleted
INFO: Completed: 5 processed, 4 success, 1 failed
```

### Expected Outcome

- Celery task created with proper decorator
- Task runs every minute via Celery Beat
- Queries for due reports efficiently
- Generates reports for each due schedule
- Updates schedules after execution
- Handles errors gracefully
- Logs comprehensive execution details
- Returns summary statistics

### Verification Checklist

- [ ] tasks.py file created in analytics app
- [ ] Celery imports added
- [ ] Logger configured for task
- [ ] @shared_task decorator applied
- [ ] Task name set: 'analytics.process_scheduled_reports'
- [ ] Query for due reports implemented
- [ ] select_related optimization used
- [ ] Iteration through schedules implemented
- [ ] Try/except error handling per schedule
- [ ] last_run updated after execution
- [ ] next_run recalculated
- [ ] last_status set based on result
- [ ] Logging throughout task
- [ ] Summary dictionary returned
- [ ] Celery Beat schedule configured
- [ ] Task registered in Celery app

---

## Task 82: Add Generate Scheduled Report Method

### Overview

Implement the method that generates a report instance from a scheduled report configuration. This method orchestrates the report generation process, applying the saved report's filters and configuration, executing the query, formatting the output, and creating a ReportInstance record. It serves as the bridge between the schedule trigger and the actual report generation.

### Dependencies

- Task 81: Celery task created
- SavedReport model with generate() method
- ReportInstance model exists
- Report generation logic from previous tasks
- File storage configured

### Instructions

1. **Create generate_scheduled_report method**
   - Add to ScheduledReport model
   - Method signature: `def generate_scheduled_report(self)`
   - Returns ReportInstance or None if failed
   - Handles full report generation workflow

2. **Validate schedule is active**
   - Check if self.is_active is True
   - If inactive, log warning and return None
   - Prevents disabled schedules from running
   - This is a safety check

3. **Check saved_report exists**
   - Verify self.saved_report is not None
   - Check if saved_report still exists (not deleted)
   - If missing, log error and return None
   - Set last_status='FAILED' with appropriate error message

4. **Get saved report configuration**
   - Access self.saved_report.config (JSONField)
   - Extract report type
   - Extract filters
   - Extract format preferences
   - Extract any custom parameters

5. **Determine report period**
   - Calculate date range based on frequency
   - For DAILY: Yesterday's data
   - For WEEKLY: Last 7 days
   - For MONTHLY: Last month
   - Use timezone-aware dates in tenant timezone

6. **Call saved report generate method**
   - Call self.saved_report.generate(filters, period)
   - Pass calculated date range
   - Pass any additional parameters
   - Returns ReportInstance object
   - Wrap in try/except for error handling

7. **Handle report generation errors**
   - Catch exceptions from generate() call
   - Log error with full traceback
   - Set self.error_message to error details
   - Set self.last_status = 'FAILED'
   - Return None to indicate failure

8. **Store generated report reference**
   - If generation successful, store ReportInstance
   - Add field to ScheduledReport: last_report_instance (FK)
   - Set self.last_report_instance = generated_instance
   - This tracks most recent report

9. **Update execution metadata**
   - Set self.last_run = timezone.now()
   - Set self.last_status = 'SUCCESS'
   - Clear self.error_message if previous failure
   - Save ScheduledReport instance

10. **Return report instance**
    - Return generated ReportInstance object
    - Will be used by email task to attach file
    - None return indicates failure

### Report Period Calculation Logic

**DAILY Reports:**
```
Frequency: DAILY
Today: 2026-01-26
Period: 2026-01-25 00:00:00 to 2026-01-25 23:59:59
Logic: Previous complete day's data
```

**WEEKLY Reports:**
```
Frequency: WEEKLY
Today: 2026-01-26 (Sunday)
Period: 2026-01-19 00:00:00 to 2026-01-25 23:59:59
Logic: Previous complete week (Monday to Sunday)
```

**MONTHLY Reports:**
```
Frequency: MONTHLY
Today: 2026-02-05
Period: 2026-01-01 00:00:00 to 2026-01-31 23:59:59
Logic: Previous complete month's data
```

### Method Flow Diagram

```
Start generate_scheduled_report()
│
├─ Check is_active
│  └─ If False: Log warning, Return None
│
├─ Check saved_report exists
│  └─ If None: Log error, Set FAILED, Return None
│
├─ Get report configuration
│  └─ Extract: type, filters, format, parameters
│
├─ Calculate report period
│  ├─ DAILY → Yesterday
│  ├─ WEEKLY → Last week
│  └─ MONTHLY → Last month
│
├─ Try:
│  ├─ Call saved_report.generate(filters, period)
│  ├─ Receive ReportInstance object
│  ├─ Set last_report_instance
│  ├─ Set last_run = now()
│  ├─ Set last_status = SUCCESS
│  ├─ Clear error_message
│  ├─ Save schedule
│  └─ Return ReportInstance
│
└─ Except Exception:
   ├─ Log error with traceback
   ├─ Set error_message
   ├─ Set last_status = FAILED
   ├─ Save schedule
   └─ Return None
```

### Integration with SavedReport

The method relies on SavedReport.generate() method:

```
SavedReport.generate(filters, period):
- Applies report type logic (sales, inventory, etc.)
- Applies custom filters from config
- Executes database query
- Formats results
- Generates PDF/CSV/Excel file
- Creates ReportInstance record
- Returns ReportInstance object
```

### Error Scenarios

| Error | Action | Status | Error Message |
|-------|--------|--------|---------------|
| Schedule inactive | Log warning, return None | No change | "Schedule is inactive" |
| SavedReport deleted | Log error, return None | FAILED | "Saved report no longer exists" |
| Query timeout | Catch exception | FAILED | "Database query timeout" |
| Permission denied | Catch exception | FAILED | "Access denied to required data" |
| File storage error | Catch exception | FAILED | "Failed to save report file" |
| Unknown error | Catch exception | FAILED | Full exception message |

### Expected Outcome

- generate_scheduled_report() method working correctly
- Validation of active status and saved_report
- Report period calculated based on frequency
- SavedReport.generate() called with correct parameters
- ReportInstance created and stored
- Error handling for all failure scenarios
- Metadata updated (last_run, last_status, error_message)
- Method returns ReportInstance or None

### Verification Checklist

- [ ] generate_scheduled_report() method created
- [ ] is_active validation implemented
- [ ] saved_report existence check
- [ ] Configuration extraction from saved_report.config
- [ ] Report period calculation for DAILY frequency
- [ ] Report period calculation for WEEKLY frequency
- [ ] Report period calculation for MONTHLY frequency
- [ ] Timezone-aware date handling
- [ ] saved_report.generate() call with parameters
- [ ] Try/except error handling
- [ ] last_report_instance field added to model
- [ ] last_run updated on success
- [ ] last_status set to SUCCESS or FAILED
- [ ] error_message stored on failure
- [ ] Method returns ReportInstance or None
- [ ] Comprehensive logging throughout method

---

## Task 83: Add Email Distribution System

### Overview

Implement the email distribution system that sends generated reports to configured recipients. This system creates properly formatted emails with customizable subject and body, attaches report files in requested formats (PDF, CSV, Excel), and handles email delivery through Django's email framework. Supports TO, CC, and BCC recipients with template variable substitution.

### Dependencies

- Task 82: Generate scheduled report method complete
- Django email backend configured (SMTP settings)
- Email templates defined
- Report file storage accessible
- EmailMessage class available

### Instructions

1. **Create send_scheduled_report_email method**
   - Add to ScheduledReport model
   - Method signature: `def send_scheduled_report_email(self, report_instance)`
   - Parameter: report_instance (ReportInstance object)
   - Returns boolean indicating success/failure

2. **Import email modules**
   - Import EmailMessage from django.core.mail
   - Import get_template from django.template
   - Import Context for template rendering
   - Import MIMEBase for attachments

3. **Validate recipients exist**
   - Check if self.recipients is not empty
   - If empty, log error and return False
   - Validate email format for all recipients
   - Remove any invalid email addresses

4. **Prepare template context**
   - Create context dictionary
   - Add report_name from saved_report
   - Add current date
   - Add tenant_name
   - Add frequency
   - Add period_start and period_end from report_instance
   - Add generated_at timestamp

5. **Format email subject**
   - Get self.email_subject or use default
   - Default: "Scheduled Report: {report_name} - {date}"
   - Replace template variables with context values
   - Use Python string.format() or template rendering
   - Limit subject length to 200 characters

6. **Format email body**
   - Get self.email_body or use default template
   - Default body includes:
     - Greeting
     - Report name and frequency
     - Report period
     - Attachment information
     - Automated message footer
   - Replace template variables
   - Support plain text and HTML versions

7. **Create EmailMessage object**
   - Initialize EmailMessage
   - Set subject to formatted subject
   - Set body to formatted body
   - Set from_email from settings.DEFAULT_FROM_EMAIL
   - Set to recipients from self.recipients list
   - Set cc from self.cc_emails if present
   - Set bcc from self.bcc_emails if present

8. **Attach report files based on preferences**
   - Check self.attach_pdf flag
   - If True and report_instance.pdf_file exists:
     - Attach PDF file
     - Filename: "{report_name}_{date}.pdf"
   - Check self.include_csv flag
   - If True and report_instance.csv_file exists:
     - Attach CSV file
   - Check self.include_excel flag
   - If True and report_instance.excel_file exists:
     - Attach Excel file

9. **Handle file attachment process**
   - Open report file from storage
   - Read file content
   - Set MIME type appropriately
   - Add Content-Disposition header
   - Attach to EmailMessage
   - Close file handle

10. **Send email**
    - Call email.send() method
    - Wrap in try/except for error handling
    - Catch SMTPException and general exceptions
    - Log success or failure
    - Return True if successful, False if failed

11. **Update email sent tracking**
    - If successful, set flag in ScheduleHistory
    - Log recipient count
    - Log timestamp of email send
    - Store email status for auditing

### Email Template Structure

**Default Subject Template:**
```
Scheduled Report: {report_name} - {date}
```

**Default Body Template:**
```
Dear User,

Your scheduled {frequency} report "{report_name}" has been generated successfully.

Report Details:
- Report Type: {report_type}
- Period: {period_start} to {period_end}
- Generated: {generated_at}
- Tenant: {tenant_name}

The report is attached to this email in the following format(s):
{attachment_list}

If you have any questions about this report, please contact your system administrator.

---
This is an automated message from the ERP Analytics System.
Do not reply to this email.
```

**HTML Email Version:**
Include styled HTML version with:
- Header with company logo
- Report details in formatted table
- Clear attachment list
- Footer with branding
- Responsive design for mobile devices

### Attachment Handling

**File Attachment Process:**
1. Get file from storage backend
2. Determine MIME type based on extension
3. Read file content
4. Create attachment with proper headers
5. Add to EmailMessage
6. Close file handle

**MIME Types:**
- PDF: application/pdf
- CSV: text/csv
- Excel: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet

**Filename Format:**
```
{report_name}_{date}.{ext}
Example: Monthly_Sales_Report_2026-01-25.pdf
```

### Email Sending Configuration

**Django Settings Required:**
```python
# Email backend
EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'

# SMTP configuration
EMAIL_HOST = 'smtp.gmail.com'
EMAIL_PORT = 587
EMAIL_USE_TLS = True
EMAIL_HOST_USER = 'your-email@example.com'
EMAIL_HOST_PASSWORD = 'your-password'

# Default sender
DEFAULT_FROM_EMAIL = 'noreply@yourdomain.com'
SERVER_EMAIL = 'server@yourdomain.com'
```

### Error Handling

**Email Sending Errors:**

| Error Type | Action | Return Value |
|------------|--------|--------------|
| No recipients | Log error | False |
| Invalid email format | Filter out invalid | Continue with valid |
| SMTP connection failed | Log error, retry | False |
| Attachment file missing | Log warning | Continue without |
| File read error | Log error | False |
| SMTP authentication failed | Log error | False |
| Recipient mailbox full | Log warning | True (partial) |
| Email size too large | Log error | False |

### Integration with Celery Task

Called from process_scheduled_reports task:

```
1. Generate report (Task 82)
   └─ Returns ReportInstance
   
2. Send email (Task 83)
   └─ Call schedule.send_scheduled_report_email(report_instance)
   └─ Returns success boolean
   
3. Log history (Task 84)
   └─ Record email_sent status
   └─ Record recipients_count
```

### Expected Outcome

- send_scheduled_report_email() method working
- Email message created with proper formatting
- Template variables replaced correctly
- Report files attached in requested formats
- Email sent to all recipients (TO, CC, BCC)
- Error handling for all failure scenarios
- Success/failure status returned
- Comprehensive logging of email operations

### Verification Checklist

- [ ] send_scheduled_report_email() method created
- [ ] Email modules imported
- [ ] Recipients validation implemented
- [ ] Template context prepared
- [ ] email_subject formatting with variables
- [ ] email_body formatting with variables
- [ ] Default templates defined
- [ ] EmailMessage object created
- [ ] TO recipients set from self.recipients
- [ ] CC recipients set from self.cc_emails
- [ ] BCC recipients set from self.bcc_emails
- [ ] PDF attachment logic (if attach_pdf=True)
- [ ] CSV attachment logic (if include_csv=True)
- [ ] Excel attachment logic (if include_excel=True)
- [ ] File reading and MIME type handling
- [ ] email.send() call with error handling
- [ ] SMTP exception handling
- [ ] Success/failure logging
- [ ] Method returns boolean status
- [ ] HTML email version created

---

## Task 84: Add Schedule History Tracking

### Overview

Implement the ScheduleHistory model to track all executions of scheduled reports. This model provides a comprehensive audit trail of report generation attempts, including success/failure status, error messages, recipient counts, and links to generated report instances. History tracking is essential for monitoring system reliability, debugging failures, and providing transparency to users.

### Dependencies

- Task 83: Email distribution system complete
- ScheduledReport model functional
- ReportInstance model exists
- Celery task integration ready

### Instructions

1. **Create ScheduleHistory model**
   - Add to scheduled_report.py file (after ScheduledReport model)
   - Create class named `ScheduleHistory`
   - Inherit from `TenantAwareModel`
   - Add comprehensive model docstring

2. **Add Meta class configuration**
   - Set `db_table` to 'analytics_schedule_history'
   - Set `verbose_name` to 'Schedule History'
   - Set `verbose_name_plural` to 'Schedule History'
   - Add ordering by run_at descending (newest first)
   - Add indexes on scheduled_report, run_at, status

3. **Add scheduled_report foreign key**
   - ForeignKey to ScheduledReport model
   - Set `on_delete=models.CASCADE`
   - Set `related_name='history'`
   - Add help text: "The schedule that was executed"
   - Allows querying all history for a schedule

4. **Add run_at datetime field**
   - DateTimeField with `auto_now_add=True`
   - Automatically set to execution time
   - Add help text: "When this execution occurred"
   - Indexed for query performance

5. **Add status choice field**
   - CharField with max_length=20
   - Define STATUS_CHOICES:
     - ('SUCCESS', 'Success')
     - ('FAILED', 'Failed')
     - ('PARTIAL', 'Partial Success')
   - Add help text: "Execution outcome"
   - Required field

6. **Add report_instance foreign key**
   - ForeignKey to ReportInstance model
   - Set `on_delete=models.SET_NULL`
   - Set `null=True`, `blank=True`
   - Set `related_name='schedule_history'`
   - Add help text: "Generated report instance"
   - Null if generation failed

7. **Add error_message text field**
   - TextField with `null=True`, `blank=True`
   - Stores full error details if execution failed
   - Add help text: "Error details if execution failed"
   - Empty for successful executions

8. **Add recipients_count integer field**
   - IntegerField with default=0
   - Tracks how many recipients received email
   - Add help text: "Number of email recipients"
   - Used for delivery statistics

9. **Add email_sent boolean field**
   - BooleanField with default=False
   - Indicates if email was sent successfully
   - Add help text: "Whether email delivery succeeded"
   - Can be True even if report generation failed (error notification)

10. **Add execution_time_seconds decimal field**
    - DecimalField with max_digits=10, decimal_places=2
    - Set `null=True`, `blank=True`
    - Stores how long execution took
    - Add help text: "Execution duration in seconds"
    - Used for performance monitoring

11. **Add file_size_bytes integer field**
    - IntegerField with `null=True`, `blank=True`
    - Stores size of generated report file
    - Add help text: "Size of generated report file"
    - Used for storage monitoring

12. **Add __str__ method**
    - Return formatted string: "{schedule} - {run_at} - {status}"
    - Makes history entries readable in admin
    - Include key identifying information

### Create History Logging Method

1. **Add create_history classmethod to ScheduledReport**
   - Classmethod signature: `@classmethod def create_history(cls, scheduled_report, status, ...)`
   - Creates and returns ScheduleHistory instance
   - Centralizes history creation logic

2. **Method parameters:**
   - scheduled_report: ScheduledReport instance
   - status: SUCCESS, FAILED, or PARTIAL
   - report_instance: ReportInstance or None
   - error_message: str or None
   - recipients_count: int
   - email_sent: bool
   - execution_time: float

3. **Create and save history instance**
   - Create ScheduleHistory object
   - Set all fields from parameters
   - Calculate file_size_bytes from report_instance
   - Save to database
   - Return created instance

### Integration with Celery Task

Update process_scheduled_reports task to log history:

```
For each scheduled report:
│
├─ Start timer
│
├─ Generate report
│  └─ Returns: report_instance or None
│
├─ Send email
│  └─ Returns: email_sent boolean
│
├─ Stop timer (calculate duration)
│
├─ Determine status:
│  ├─ SUCCESS: report generated and email sent
│  ├─ PARTIAL: report generated but email failed
│  └─ FAILED: report generation failed
│
└─ Create history:
   └─ Call ScheduledReport.create_history(
        scheduled_report=schedule,
        status=status,
        report_instance=instance,
        error_message=error if failed,
        recipients_count=len(recipients),
        email_sent=email_sent,
        execution_time=duration
      )
```

### History Query Examples

**Get all history for a schedule:**
```python
schedule = ScheduledReport.objects.get(id=123)
history = schedule.history.all().order_by('-run_at')
```

**Get recent failures:**
```python
failures = ScheduleHistory.objects.filter(
    status='FAILED',
    run_at__gte=timezone.now() - timedelta(days=7)
)
```

**Calculate success rate:**
```python
schedule = ScheduledReport.objects.get(id=123)
total = schedule.history.count()
success = schedule.history.filter(status='SUCCESS').count()
success_rate = (success / total) * 100 if total > 0 else 0
```

**Average execution time:**
```python
avg_time = ScheduleHistory.objects.filter(
    scheduled_report=schedule,
    status='SUCCESS'
).aggregate(Avg('execution_time_seconds'))
```

### Admin Display

Configure Django admin to display history:

1. **List display columns:**
   - scheduled_report
   - run_at
   - status (with color coding)
   - recipients_count
   - email_sent (icon)
   - execution_time_seconds

2. **Filters:**
   - status
   - email_sent
   - run_at (date hierarchy)
   - scheduled_report

3. **Search fields:**
   - scheduled_report__saved_report__name
   - error_message

4. **Readonly fields:**
   - All fields (history is immutable)

### History Retention Policy

Consider implementing history cleanup:

1. **Retention rules:**
   - Keep SUCCESS entries for 90 days
   - Keep FAILED entries for 180 days
   - Keep PARTIAL entries for 90 days

2. **Cleanup task:**
   - Celery periodic task (daily)
   - Delete old history entries
   - Keep summary statistics
   - Archive if needed

### Expected Outcome

- ScheduleHistory model created with all fields
- Proper foreign keys to ScheduledReport and ReportInstance
- Status tracking with clear states
- Error message capture for failures
- Execution metrics (time, file size, recipient count)
- History creation method in ScheduledReport
- Integration with Celery task for automatic logging
- Admin interface for viewing history
- Query methods for analysis

### Verification Checklist

- [ ] ScheduleHistory model created in scheduled_report.py
- [ ] Inherits from TenantAwareModel
- [ ] Meta class with db_table and ordering
- [ ] scheduled_report ForeignKey (CASCADE)
- [ ] run_at DateTimeField (auto_now_add)
- [ ] status CharField with STATUS_CHOICES
- [ ] report_instance ForeignKey (SET_NULL, nullable)
- [ ] error_message TextField (nullable)
- [ ] recipients_count IntegerField
- [ ] email_sent BooleanField
- [ ] execution_time_seconds DecimalField
- [ ] file_size_bytes IntegerField (nullable)
- [ ] Indexes on scheduled_report, run_at, status
- [ ] __str__ method returns formatted string
- [ ] create_history classmethod added to ScheduledReport
- [ ] Migration created and applied
- [ ] History logging integrated in Celery task
- [ ] Admin configuration created
- [ ] Query methods tested

---

## Final Verification Checklist

### Model Completion

- [ ] ScheduledReport model fully implemented
- [ ] All frequency and timing fields added
- [ ] Recipients and email configuration fields added
- [ ] Next run calculation logic working
- [ ] ScheduleHistory model created
- [ ] All migrations generated and applied
- [ ] Models registered in admin
- [ ] Models tested in Django shell

### Celery Integration

- [ ] Celery task file created
- [ ] process_scheduled_reports task implemented
- [ ] Task queries due reports correctly
- [ ] Task handles errors gracefully
- [ ] Celery Beat schedule configured
- [ ] Task tested with sample schedules
- [ ] Logging throughout task execution

### Report Generation

- [ ] generate_scheduled_report method working
- [ ] Report period calculation correct for all frequencies
- [ ] Integration with SavedReport.generate()
- [ ] Error handling for generation failures
- [ ] ReportInstance linking working

### Email System

- [ ] Email configuration in Django settings
- [ ] send_scheduled_report_email method working
- [ ] Template variable substitution working
- [ ] File attachment for PDF working
- [ ] File attachment for CSV working
- [ ] File attachment for Excel working
- [ ] CC and BCC support working
- [ ] Error handling for email failures
- [ ] Email sending tested with real SMTP

### History Tracking

- [ ] ScheduleHistory records created automatically
- [ ] Status correctly set (SUCCESS/FAILED/PARTIAL)
- [ ] Error messages captured
- [ ] Execution metrics recorded
- [ ] History queryable in admin
- [ ] History retention considered

### Testing

- [ ] Unit tests for calculate_next_run with all frequencies
- [ ] Unit tests for edge cases (month-end, DST)
- [ ] Integration test for full Celery workflow
- [ ] Test email delivery to real addresses
- [ ] Test error scenarios and recovery
- [ ] Test timezone conversion accuracy
- [ ] Load test with multiple concurrent schedules

### Documentation

- [ ] Model docstrings complete
- [ ] Method docstrings complete
- [ ] Inline comments for complex logic
- [ ] Admin help text for all fields
- [ ] User documentation for creating schedules
- [ ] Admin documentation for monitoring
- [ ] Troubleshooting guide for common issues

### Performance

- [ ] Database indexes optimized for queries
- [ ] Celery task execution time acceptable
- [ ] Email sending doesn't block other tasks
- [ ] Large report files handled efficiently
- [ ] Query optimization with select_related

---

## Notes for AI Agents

### Implementation Priority

1. **Phase 1 - Foundation (Tasks 76-80):**
   - Create ScheduledReport model with all fields
   - Implement next_run calculation logic
   - Run migrations and test in shell
   - Verify basic model operations

2. **Phase 2 - Automation (Task 81):**
   - Set up Celery task structure
   - Implement report querying logic
   - Configure Celery Beat schedule
   - Test task execution manually

3. **Phase 3 - Generation (Task 82):**
   - Implement generate_scheduled_report method
   - Test report period calculations
   - Handle all error scenarios
   - Verify ReportInstance creation

4. **Phase 4 - Distribution (Task 83):**
   - Configure email backend
   - Implement email sending method
   - Test with real email addresses
   - Verify attachments work correctly

5. **Phase 5 - Tracking (Task 84):**
   - Create ScheduleHistory model
   - Integrate history logging
   - Test history queries
   - Set up admin interface

### Common Pitfalls to Avoid

1. **Timezone Issues:**
   - Always use timezone-aware datetimes
   - Store next_run in UTC
   - Convert to tenant timezone for calculation
   - Test across DST transitions

2. **Email Failures:**
   - Don't let email failures break report generation
   - Implement retry logic for transient failures
   - Log all email errors comprehensively
   - Test with different SMTP providers

3. **Month-End Edge Cases:**
   - Handle day 29-31 in all months
   - Test February in leap years and non-leap years
   - Document fallback behavior clearly
   - Use last day of month when specified day doesn't exist

4. **Celery Configuration:**
   - Ensure Celery Beat is running
   - Verify task is registered correctly
   - Check task expires setting
   - Monitor task execution in Celery logs

5. **File Handling:**
   - Close file handles after reading
   - Handle missing files gracefully
   - Check file exists before attaching
   - Monitor storage space

### Testing Recommendations

1. **Create test schedules:**
   - One DAILY schedule
   - One WEEKLY schedule (different days)
   - One MONTHLY schedule (edge case day like 31)
   - One with multiple recipients
   - One with all attachment types

2. **Test failure scenarios:**
   - SavedReport deleted after schedule created
   - Database connection timeout
   - SMTP server unavailable
   - Invalid recipient email
   - File storage full

3. **Monitor execution:**
   - Check Celery Beat logs
   - Verify schedules execute at correct time
   - Confirm emails received
   - Review ScheduleHistory entries
   - Monitor next_run updates

### Maintenance Considerations

1. **Regular monitoring:**
   - Check ScheduleHistory for failures
   - Monitor email delivery rate
   - Track execution times
   - Watch storage usage

2. **Schedule cleanup:**
   - Identify inactive schedules
   - Archive old history entries
   - Clean up orphaned schedules
   - Remove test data

3. **Performance optimization:**
   - Review slow queries
   - Optimize report generation
   - Batch email sending if needed
   - Cache frequent calculations

### Security Considerations

1. **Email recipient validation:**
   - Validate all email addresses
   - Prevent email injection
   - Limit recipients per schedule
   - Log all email deliveries

2. **Access control:**
   - Ensure users can only create schedules for reports they own
   - Validate tenant isolation
   - Restrict schedule modification
   - Audit schedule changes

3. **Error message sanitization:**
   - Don't expose sensitive data in error messages
   - Filter stack traces before storing
   - Sanitize file paths
   - Protect database connection details

---

**END OF DOCUMENT**

**Total Lines:** ~950
**Total Tasks Covered:** 9 (Tasks 76-84)
**Estimated Total Implementation Time:** ~360 minutes (~6 hours)
