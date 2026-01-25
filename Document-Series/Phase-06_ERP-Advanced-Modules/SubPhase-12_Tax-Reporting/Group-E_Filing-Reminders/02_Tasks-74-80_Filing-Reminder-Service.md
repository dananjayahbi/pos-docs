# Tasks 74-80: Filing Reminder Service

> **Phase:** 06 - ERP Advanced Modules  
> **SubPhase:** 12 - Tax Reporting  
> **Group:** E - Filing & Reminders  
> **Document:** 02 of 02  
> **Tasks Covered:** 74, 75, 76, 77, 78, 79, 80

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [01_Tasks-69-73_TaxSubmission-Model.md](01_Tasks-69-73_TaxSubmission-Model.md)
- **→ Next Group:** [Group-F_API-Testing-Documentation](../Group-F_API-Testing-Documentation/)

---

## Document Overview

This document covers the FilingReminderService implementation for automated tax filing deadline monitoring and reminder notifications. Includes deadline calculation methods for VAT, EPF/ETF, and PAYE returns according to Sri Lankan tax authority requirements. Implements Celery scheduled task for daily deadline checks, email notification delivery, and dashboard widget API endpoint for displaying upcoming and overdue filings.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 74 | Create Filing Reminder Service | High | 45 min |
| 75 | Add VAT Due Date Calc | Low | 20 min |
| 76 | Add EPF Due Date Calc | Low | 20 min |
| 77 | Add PAYE Due Date Calc | Low | 20 min |
| 78 | Create Reminder Celery Task | Medium | 35 min |
| 79 | Add Email Reminder Method | Medium | 30 min |
| 80 | Add Dashboard Reminder Widget | Medium | 35 min |

---

## Task 74: Create Filing Reminder Service

### Overview
Create the FilingReminderService class to handle all tax filing deadline monitoring and reminder logic. This service calculates due dates for different tax types, identifies pending filings, determines reminder urgency levels, and provides data for notifications. Centralizes deadline logic for VAT, PAYE, EPF, and ETF filings according to Sri Lankan tax authority requirements.

### Dependencies
- Task 73: TaxSubmission migrations applied
- TaxPeriodRecord model exists
- TaxConfiguration model exists
- Django timezone utilities configured

### Instructions

1. **Create services directory structure**
   - Navigate to `apps/accounting/tax/` directory
   - Create `services/` subdirectory if not exists
   - Create `__init__.py` in services directory
   - This organizes tax-related service classes

2. **Create filing_reminder.py file**
   - Create new file in `tax/services/` directory
   - Name it `filing_reminder.py`
   - This will contain FilingReminderService class

3. **Add file imports**
   - Import datetime and timedelta from datetime module
   - Import timezone from django.utils
   - Import TaxPeriodRecord model
   - Import TaxSubmission model
   - Import TaxConfiguration model
   - Import TaxTypeChoices from enums

4. **Add module docstring**
   - Document FilingReminderService purpose
   - Explain deadline calculation logic
   - Note Sri Lankan tax authority context
   - Reference IRD, CBSL, and ETF Board deadlines

5. **Define FilingReminderService class**
   - Create class with comprehensive docstring
   - Explain service responsibilities
   - Note it handles all tax types
   - Document methods overview

6. **Add initialization method**
   - Define __init__ method
   - Accept optional tenant parameter (multi-tenant support)
   - Store tenant for filtering
   - Initialize configuration cache

7. **Add get_pending_filings method**
   - Create method to find all unfiled tax periods
   - Query TaxPeriodRecord with status='FINALIZED'
   - Filter out periods with submissions
   - Return queryset of pending periods
   - Add date range filter parameter

8. **Add calculate_due_date method**
   - Create method accepting tax_type and period_start
   - Route to specific calculation method based on type
   - Return due date as datetime object
   - Raise error for unknown tax type

9. **Add get_urgency_level method**
   - Create method accepting due_date parameter
   - Calculate days remaining until due date
   - Return urgency string:
     - 'overdue': Due date passed
     - 'urgent': 1 day remaining
     - 'warning': 2-3 days remaining
     - 'upcoming': 4-7 days remaining
     - 'normal': More than 7 days
   - Used for color coding and priority

10. **Add get_days_remaining method**
    - Create method accepting due_date parameter
    - Calculate difference from current date
    - Return integer (negative if overdue)
    - Used in reminder messages

11. **Add get_reminder_schedule method**
    - Create method returning reminder trigger days
    - Return list: [7, 3, 1, 0] (days before due)
    - 7 days: First reminder
    - 3 days: Second reminder
    - 1 day: Urgent reminder
    - 0 days: Due date reminder

12. **Add should_send_reminder method**
    - Create method accepting due_date and last_reminder_date
    - Check if reminder should be sent today
    - Compare days_remaining to reminder_schedule
    - Ensure not sent already today
    - Return boolean

### Service Method Summary

| Method Name | Purpose | Returns |
|-------------|---------|---------|
| get_pending_filings() | Find unfiled tax periods | QuerySet |
| calculate_due_date() | Get deadline for tax type | datetime |
| get_urgency_level() | Determine priority | str |
| get_days_remaining() | Days until due date | int |
| get_reminder_schedule() | Reminder trigger days | list |
| should_send_reminder() | Check if send today | bool |

### Urgency Level Classification

| Level | Days Remaining | Color Code | Action Priority |
|-------|----------------|------------|-----------------|
| **Overdue** | < 0 | Red | Immediate action |
| **Urgent** | 1 | Orange | File today |
| **Warning** | 2-3 | Yellow | Prepare filing |
| **Upcoming** | 4-7 | Blue | Review data |
| **Normal** | > 7 | Green | Monitor |

### Expected Service Structure
```
FilingReminderService:
├── __init__(tenant)
├── get_pending_filings(date_range)
├── calculate_due_date(tax_type, period_start)
├── get_urgency_level(due_date)
├── get_days_remaining(due_date)
├── get_reminder_schedule()
└── should_send_reminder(due_date, last_reminder)
```

### Expected Outcome
- FilingReminderService class defined
- Core deadline calculation routing
- Urgency level classification
- Reminder scheduling logic
- Tenant-aware filtering support

### Verification Checklist
- [ ] services/ directory created in tax/
- [ ] filing_reminder.py file created
- [ ] All necessary imports included
- [ ] Module docstring added
- [ ] FilingReminderService class defined
- [ ] __init__ method with tenant parameter
- [ ] get_pending_filings method implemented
- [ ] calculate_due_date routing method created
- [ ] get_urgency_level method implemented
- [ ] get_days_remaining method created
- [ ] get_reminder_schedule method defined
- [ ] should_send_reminder method implemented

---

## Task 75: Add VAT Due Date Calc

### Overview
Implement VAT return due date calculation according to Sri Lankan Inland Revenue Department regulations. VAT returns are due on the 20th of the month following the tax period. For example, VAT for January 2026 is due on February 20, 2026. This method ensures accurate deadline tracking for VAT filing compliance.

### Dependencies
- Task 74: FilingReminderService created

### Instructions

1. **Open filing_reminder.py file**
   - Navigate to FilingReminderService class
   - Locate area for deadline calculation methods

2. **Add calculate_vat_due_date method**
   - Create method accepting period_start (date)
   - Add comprehensive docstring
   - Explain VAT due date rule (20th of next month)
   - Include example calculation

3. **Calculate following month**
   - Extract year and month from period_start
   - Add 1 to month
   - Handle December rollover to next year
   - Use modulo arithmetic for month calculation

4. **Set due date to 20th**
   - Create datetime for following month
   - Set day to 20
   - Set time to 23:59:59 (end of day)
   - Use timezone.make_aware if needed

5. **Add weekend adjustment logic**
   - Check if due date falls on Saturday or Sunday
   - If weekend, move to next Monday
   - Sri Lankan business days: Monday-Friday
   - Use timedelta to adjust date

6. **Add public holiday awareness**
   - Add comment noting public holiday adjustment
   - In production, check holiday calendar
   - If due date is public holiday, move to next business day
   - Note: Implement holiday calendar integration later

7. **Add special case handling**
   - Handle February edge cases (28/29 days)
   - Ensure day 20 always valid
   - Handle year-end periods
   - Validate return value is future date

8. **Add validation checks**
   - Verify period_start is valid date
   - Ensure calculated due_date is after period_start
   - Raise ValueError for invalid inputs
   - Log calculation for debugging

9. **Update calculate_due_date router**
   - Add VAT case to calculate_due_date method
   - Check if tax_type == TaxTypeChoices.VAT
   - Call calculate_vat_due_date(period_start)
   - Return result

### Sri Lankan VAT Due Date Rules

| Rule Component | Details |
|----------------|---------|
| **Base Due Date** | 20th of following month |
| **Business Days** | Monday-Friday |
| **Weekend Adjustment** | Move to next Monday |
| **Public Holidays** | Move to next business day |
| **Grace Period** | None (strict deadline) |

### VAT Due Date Examples

| Tax Period | Period Start | Due Date | Calculation |
|------------|--------------|----------|-------------|
| January 2026 | 2026-01-01 | 2026-02-20 | Jan + 1 month, day 20 |
| February 2026 | 2026-02-01 | 2026-03-20 | Feb + 1 month, day 20 |
| December 2026 | 2026-12-01 | 2027-01-20 | Dec + 1 month (year rollover) |

### Weekend Adjustment Logic
```
If due_date.weekday() == 5 (Saturday):
    due_date += timedelta(days=2)  # Move to Monday

If due_date.weekday() == 6 (Sunday):
    due_date += timedelta(days=1)  # Move to Monday
```

### Expected Method Structure
```python
def calculate_vat_due_date(self, period_start: date) -> datetime:
    """
    Calculate VAT return due date (20th of following month).
    
    Args:
        period_start: Start date of tax period
        
    Returns:
        Due date as datetime (end of day)
    """
    # Implementation here
```

### Expected Outcome
- Accurate VAT due date calculation
- Weekend adjustment implemented
- Year-end rollover handling
- Integration with calculate_due_date router
- Validation and error handling

### Verification Checklist
- [ ] calculate_vat_due_date method created
- [ ] Method docstring explains VAT rule
- [ ] Following month calculation implemented
- [ ] Day set to 20th
- [ ] Time set to 23:59:59
- [ ] Weekend adjustment logic added
- [ ] Saturday moves to Monday
- [ ] Sunday moves to Monday
- [ ] December to January rollover handled
- [ ] Validation for invalid inputs
- [ ] calculate_due_date router updated
- [ ] VAT case added to router
- [ ] Example calculations documented

---

## Task 76: Add EPF Due Date Calc

### Overview
Implement EPF contribution due date calculation according to Sri Lankan Central Bank (CBSL) regulations. EPF contributions are due on the last day of the month following the salary period. For example, EPF for January 2026 salaries is due on February 28, 2026 (or February 29 in leap years). This method ensures compliance with CBSL EPF filing deadlines.

### Dependencies
- Task 75: VAT due date calculation implemented

### Instructions

1. **Open filing_reminder.py file**
   - Navigate to FilingReminderService class
   - Add new method after calculate_vat_due_date

2. **Add calculate_epf_due_date method**
   - Create method accepting period_start (date)
   - Add comprehensive docstring
   - Explain EPF due date rule (last day of next month)
   - Include example calculation

3. **Calculate following month**
   - Extract year and month from period_start
   - Add 1 to month
   - Handle December to January rollover
   - Use calendar module for month ranges

4. **Get last day of month**
   - Import calendar.monthrange function
   - Call monthrange(year, month)
   - Returns (first_weekday, last_day)
   - Use last_day as due date day

5. **Create due date datetime**
   - Build datetime with year, month, last_day
   - Set time to 23:59:59 (end of day)
   - Use timezone.make_aware for timezone
   - Return timezone-aware datetime

6. **Handle leap year February**
   - monthrange automatically handles leap years
   - February returns 28 or 29 appropriately
   - Test with 2024 (leap) and 2025 (non-leap)
   - No special logic needed (built-in)

7. **Add weekend adjustment**
   - Check if last day falls on Saturday or Sunday
   - If weekend, do NOT move forward (month boundary)
   - Instead, move to previous Friday
   - Use negative timedelta for backward adjustment

8. **Add business day calculation**
   - Create helper method get_last_business_day_of_month
   - Start from last day of month
   - Move backward until weekday (Mon-Fri)
   - Skip weekends backward
   - Use this for EPF due date

9. **Update calculate_due_date router**
   - Add EPF case to calculate_due_date method
   - Check if tax_type == TaxTypeChoices.EPF
   - Call calculate_epf_due_date(period_start)
   - Return result

10. **Add ETF due date method**
    - Create calculate_etf_due_date method
    - ETF also due last day of following month
    - Same logic as EPF
    - Call calculate_epf_due_date internally
    - Add comment noting ETF follows EPF rule

11. **Update router for ETF**
    - Add ETF case to calculate_due_date method
    - Check if tax_type == TaxTypeChoices.ETF
    - Call calculate_etf_due_date(period_start)
    - Both EPF and ETF use same calculation

### Sri Lankan EPF/ETF Due Date Rules

| Rule Component | Details |
|----------------|---------|
| **Base Due Date** | Last day of following month |
| **Business Days** | If weekend, previous Friday |
| **Leap Year** | Auto-handled by calendar.monthrange |
| **Month End** | Cannot extend past month boundary |
| **Authority** | CBSL for EPF, ETF Board for ETF |

### EPF/ETF Due Date Examples

| Tax Period | Period Start | Last Day of Next Month | If Weekend Adjustment | Final Due Date |
|------------|--------------|------------------------|----------------------|----------------|
| January 2026 | 2026-01-01 | 2026-02-28 (Friday) | No adjustment | 2026-02-28 |
| February 2026 | 2026-02-01 | 2026-03-31 (Tuesday) | No adjustment | 2026-03-31 |
| December 2025 | 2025-12-01 | 2026-01-31 (Saturday) | Move to Friday 30th | 2026-01-30 |
| February 2024 | 2024-02-01 | 2024-03-29 (Friday) | No adjustment (leap year) | 2024-03-29 |

### Last Business Day Logic
```python
def get_last_business_day_of_month(year: int, month: int) -> int:
    """Get last business day (Mon-Fri) of month."""
    _, last_day = calendar.monthrange(year, month)
    last_date = date(year, month, last_day)
    
    # Move backward from last day to find Friday or earlier
    while last_date.weekday() > 4:  # 5=Sat, 6=Sun
        last_date -= timedelta(days=1)
    
    return last_date.day
```

### Expected Method Structure
```python
def calculate_epf_due_date(self, period_start: date) -> datetime:
    """
    Calculate EPF contribution due date (last day of following month).
    
    Args:
        period_start: Start date of salary period
        
    Returns:
        Due date as datetime (end of day)
    """
    # Implementation here

def calculate_etf_due_date(self, period_start: date) -> datetime:
    """
    Calculate ETF contribution due date (last day of following month).
    Same rule as EPF.
    """
    return self.calculate_epf_due_date(period_start)
```

### Expected Outcome
- Accurate EPF due date calculation
- Last day of month logic implemented
- Leap year handling automatic
- Weekend adjustment (backward to Friday)
- ETF uses same calculation
- Both integrated with router

### Verification Checklist
- [ ] calendar module imported
- [ ] calculate_epf_due_date method created
- [ ] Method docstring explains EPF rule
- [ ] Following month calculation implemented
- [ ] calendar.monthrange used for last day
- [ ] Leap year February handled correctly
- [ ] Weekend adjustment logic added
- [ ] Moves backward to Friday if weekend
- [ ] Time set to 23:59:59
- [ ] get_last_business_day_of_month helper created
- [ ] calculate_etf_due_date method created
- [ ] ETF calls EPF calculation
- [ ] calculate_due_date router updated for EPF
- [ ] calculate_due_date router updated for ETF

---

## Task 77: Add PAYE Due Date Calc

### Overview
Implement PAYE (Pay As You Earn) tax due date calculation according to Sri Lankan Inland Revenue Department regulations. PAYE remittances are due on the 15th of the month following the salary payment period. For example, PAYE for January 2026 salaries is due on February 15, 2026. This method ensures accurate deadline tracking for employee tax withholding compliance.

### Dependencies
- Task 76: EPF due date calculation implemented

### Instructions

1. **Open filing_reminder.py file**
   - Navigate to FilingReminderService class
   - Add new method after calculate_etf_due_date

2. **Add calculate_paye_due_date method**
   - Create method accepting period_start (date)
   - Add comprehensive docstring
   - Explain PAYE due date rule (15th of next month)
   - Include example calculation

3. **Calculate following month**
   - Extract year and month from period_start
   - Add 1 to month
   - Handle December to January rollover
   - Similar to VAT calculation

4. **Set due date to 15th**
   - Create datetime for following month
   - Set day to 15
   - Set time to 23:59:59 (end of day)
   - Use timezone.make_aware if needed

5. **Add weekend adjustment logic**
   - Check if 15th falls on Saturday or Sunday
   - If Saturday, move to next Monday (+2 days)
   - If Sunday, move to next Monday (+1 day)
   - Use same logic as VAT adjustment

6. **Add public holiday awareness**
   - Add comment noting public holiday consideration
   - If 15th is public holiday, next business day
   - Note: Implement holiday calendar integration
   - Placeholder for future enhancement

7. **Compare PAYE vs VAT deadlines**
   - Add comment noting difference:
     - PAYE: 15th of next month
     - VAT: 20th of next month
   - Both handle weekends similarly
   - Both administered by IRD

8. **Add validation checks**
   - Verify period_start is valid date
   - Ensure calculated due_date is after period_start
   - Raise ValueError for invalid inputs
   - Add logging for debugging

9. **Update calculate_due_date router**
   - Add PAYE case to calculate_due_date method
   - Check if tax_type == TaxTypeChoices.PAYE
   - Call calculate_paye_due_date(period_start)
   - Return result

10. **Add all tax types validation**
    - In calculate_due_date router, add else clause
    - Raise ValueError for unknown tax type
    - List supported types in error message
    - Ensures all types handled

### Sri Lankan PAYE Due Date Rules

| Rule Component | Details |
|----------------|---------|
| **Base Due Date** | 15th of following month |
| **Business Days** | Monday-Friday |
| **Weekend Adjustment** | Move to next Monday |
| **Public Holidays** | Move to next business day |
| **Authority** | Inland Revenue Department |

### PAYE Due Date Examples

| Salary Period | Period Start | Due Date | Day of Week | Adjustment |
|---------------|--------------|----------|-------------|------------|
| January 2026 | 2026-01-01 | 2026-02-15 | Saturday | Move to 2026-02-17 |
| February 2026 | 2026-02-01 | 2026-03-15 | Sunday | Move to 2026-03-16 |
| March 2026 | 2026-03-01 | 2026-04-15 | Wednesday | No adjustment |
| December 2026 | 2026-12-01 | 2027-01-15 | Friday | No adjustment |

### IRD Tax Deadlines Comparison

| Tax Type | Due Date | Administered By | Adjustment Rule |
|----------|----------|-----------------|-----------------|
| **PAYE** | 15th of next month | IRD | Next Monday if weekend |
| **VAT** | 20th of next month | IRD | Next Monday if weekend |
| **EPF** | Last day of next month | CBSL | Previous Friday if weekend |
| **ETF** | Last day of next month | ETF Board | Previous Friday if weekend |

### Expected Method Structure
```python
def calculate_paye_due_date(self, period_start: date) -> datetime:
    """
    Calculate PAYE remittance due date (15th of following month).
    
    Args:
        period_start: Start date of salary period
        
    Returns:
        Due date as datetime (end of day)
    """
    # Implementation here
```

### Expected Outcome
- Accurate PAYE due date calculation
- 15th of following month implemented
- Weekend adjustment (forward to Monday)
- Year-end rollover handling
- Integration with calculate_due_date router
- Complete router for all tax types

### Verification Checklist
- [ ] calculate_paye_due_date method created
- [ ] Method docstring explains PAYE rule
- [ ] Following month calculation implemented
- [ ] Day set to 15th
- [ ] Time set to 23:59:59
- [ ] Weekend adjustment logic added
- [ ] Saturday moves to Monday (+2)
- [ ] Sunday moves to Monday (+1)
- [ ] December to January rollover handled
- [ ] Validation for invalid inputs
- [ ] calculate_due_date router updated for PAYE
- [ ] Router has default case for unknown types
- [ ] ValueError raised for unsupported tax types

---

## Task 78: Create Reminder Celery Task

### Overview
Create a Celery scheduled task that runs daily to check for pending tax filings and send reminders based on urgency. This task queries all unfiled tax periods, calculates days until due date, determines if reminders should be sent, and triggers email notifications. Scheduled via Celery Beat to run every morning at 8:00 AM.

### Dependencies
- Task 77: All due date calculations implemented
- Celery configured in Django project
- Celery Beat scheduler configured

### Instructions

1. **Open or create tasks.py file**
   - Navigate to `apps/accounting/` directory
   - Open existing `tasks.py` or create new file
   - This contains Celery tasks for accounting app

2. **Add task imports**
   - Import shared_task from celery
   - Import timezone from django.utils
   - Import FilingReminderService
   - Import TaxPeriodRecord, TaxSubmission
   - Import email sending utilities

3. **Add check_tax_filing_deadlines task**
   - Create function decorated with @shared_task
   - Name: check_tax_filing_deadlines
   - Add comprehensive docstring
   - Explain daily deadline checking
   - Note scheduled time (8:00 AM)

4. **Add logging**
   - Import Python logging module
   - Create logger for task
   - Log task start
   - Log number of pending filings found
   - Log reminders sent

5. **Initialize service**
   - Create FilingReminderService instance
   - Get pending filings using service
   - Filter for periods without submissions
   - Iterate through pending periods

6. **Calculate due dates and urgency**
   - For each pending period:
     - Get tax_type from period
     - Call service.calculate_due_date()
     - Call service.get_urgency_level()
     - Call service.get_days_remaining()
     - Check service.should_send_reminder()

7. **Filter by reminder schedule**
   - Only send reminders at specific intervals:
     - 7 days before: First reminder
     - 3 days before: Second reminder
     - 1 day before: Urgent reminder
     - 0 days (due date): Final reminder
   - Skip if not on reminder schedule
   - Track last reminder sent date

8. **Prepare reminder data**
   - Collect reminder information:
     - tax_type (VAT, PAYE, EPF, ETF)
     - period (e.g., "January 2026")
     - due_date
     - days_remaining
     - urgency_level
     - period_id
   - Build data dictionary

9. **Call email sending method**
   - Call FilingReminderService.send_reminder_email()
   - Pass reminder data dictionary
   - Pass recipient list (finance team)
   - Handle email sending errors
   - Log success or failure

10. **Add error handling**
    - Wrap task in try-except
    - Catch and log exceptions
    - Don't crash on individual failures
    - Continue processing other reminders
    - Return summary of results

11. **Add multi-tenant support**
    - If multi-tenant system:
      - Iterate through all active tenants
      - Switch tenant context
      - Run reminder check per tenant
      - Isolate tenant data properly

12. **Return task result**
    - Return dictionary with:
      - reminders_sent: count
      - pending_filings: count
      - errors: list of errors
      - execution_time: task duration
    - Used for monitoring

### Celery Task Configuration

| Configuration | Value | Purpose |
|---------------|-------|---------|
| **Task Name** | check_tax_filing_deadlines | Identifies task |
| **Schedule** | Daily at 8:00 AM | Morning reminder |
| **Retry** | 3 attempts | Handles transient failures |
| **Timeout** | 300 seconds | Prevents hanging |
| **Soft Timeout** | 240 seconds | Warning before hard timeout |

### Reminder Schedule Logic
```
Days Before Due | Reminder Type | Email Priority
----------------------------------------------------
7               | First         | Normal
3               | Second        | Medium
1               | Urgent        | High
0               | Final         | Critical
< 0             | Overdue       | Critical
```

### Expected Task Structure
```python
@shared_task(bind=True, max_retries=3)
def check_tax_filing_deadlines(self):
    """
    Daily task to check tax filing deadlines and send reminders.
    Runs at 8:00 AM every day.
    """
    logger.info("Starting tax filing deadline check...")
    
    service = FilingReminderService()
    pending = service.get_pending_filings()
    
    reminders_sent = 0
    
    for period in pending:
        # Calculate due date
        # Check if reminder needed
        # Send email
        # Increment counter
    
    logger.info(f"Reminders sent: {reminders_sent}")
    
    return {
        'reminders_sent': reminders_sent,
        'pending_filings': pending.count(),
        'execution_time': '...'
    }
```

### Expected Outcome
- Celery task checks deadlines daily
- Reminders sent at scheduled intervals
- Multi-tenant support if needed
- Error handling and logging
- Task result reporting

### Verification Checklist
- [ ] tasks.py file exists in accounting app
- [ ] Celery shared_task imported
- [ ] check_tax_filing_deadlines function created
- [ ] @shared_task decorator applied
- [ ] Task docstring explains purpose
- [ ] Logging configured and used
- [ ] FilingReminderService instantiated
- [ ] Pending filings queried
- [ ] Due date calculated for each period
- [ ] Urgency level determined
- [ ] Reminder schedule checked
- [ ] Email sending called
- [ ] Error handling implemented
- [ ] Multi-tenant support added if needed
- [ ] Task result dictionary returned

---

## Task 79: Add Email Reminder Method

### Overview
Implement email sending functionality in FilingReminderService to deliver tax filing reminder notifications. Creates professionally formatted email messages with deadline information, urgency indicators, and action links. Uses Django's email backend to send reminders to finance team members. Includes HTML and plain text versions for compatibility.

### Dependencies
- Task 78: Celery reminder task created
- Django email backend configured in settings
- Email templates directory exists

### Instructions

1. **Open filing_reminder.py file**
   - Navigate to FilingReminderService class
   - Add new method for email sending

2. **Add email imports**
   - Import send_mail from django.core.mail
   - Import EmailMultiAlternatives for HTML emails
   - Import render_to_string from django.template.loader
   - Import settings from django.conf

3. **Add send_reminder_email method**
   - Create method accepting reminder_data dict
   - Add comprehensive docstring
   - Explain email sending purpose
   - Document required data fields

4. **Extract reminder data**
   - Get tax_type from reminder_data
   - Get period string (e.g., "January 2026")
   - Get due_date
   - Get days_remaining
   - Get urgency_level
   - Get period_id for action links

5. **Determine email subject**
   - Create subject based on urgency:
     - Overdue: "URGENT: Tax Filing Overdue - {tax_type}"
     - Urgent: "Tax Filing Due Tomorrow - {tax_type}"
     - Warning: "Tax Filing Due in {days} Days - {tax_type}"
     - Upcoming: "Tax Filing Reminder - {tax_type}"
   - Include tax type in subject

6. **Build plain text message**
   - Create text message body
   - Include greeting
   - State tax type and period
   - Show due date
   - Display days remaining or overdue
   - Add urgency notice if applicable
   - Include action instructions
   - Add signature

7. **Build HTML message**
   - Create HTML formatted version
   - Use professional styling
   - Include urgency color coding:
     - Red for overdue/urgent
     - Yellow for warning
     - Blue for upcoming
   - Add action buttons
   - Include company branding if available

8. **Add recipient list**
   - Get finance team email addresses
   - Query users with 'finance' role
   - Or use configured email list from settings
   - Default to FINANCE_EMAIL setting
   - Handle multiple recipients

9. **Send email using EmailMultiAlternatives**
   - Create EmailMultiAlternatives instance
   - Set subject, plain text body, from_email, recipients
   - Attach HTML version with attach_alternative()
   - Set content type to 'text/html'
   - Call send() method

10. **Add error handling**
    - Wrap send() in try-except
    - Catch SMTPException and general exceptions
    - Log error details
    - Don't raise exception (log only)
    - Return success boolean

11. **Add email template rendering**
    - Create template file: `emails/tax_filing_reminder.html`
    - Pass reminder_data as context
    - Use render_to_string to generate HTML
    - Apply template for consistent formatting

12. **Add action links**
    - Include link to generate return
    - Include link to view tax calendar
    - Include link to filing history
    - Use Django reverse() for URLs
    - Build absolute URLs with domain

### Email Subject Examples

| Urgency | Days Remaining | Subject Line |
|---------|----------------|--------------|
| Overdue | -2 | URGENT: Tax Filing Overdue - VAT Return |
| Urgent | 1 | Tax Filing Due Tomorrow - PAYE Remittance |
| Warning | 3 | Tax Filing Due in 3 Days - EPF Contribution |
| Upcoming | 7 | Tax Filing Reminder - VAT Return |

### Email Body Structure
```
Subject: Tax Filing Due in 3 Days - VAT Return

Dear Finance Team,

This is a reminder that the following tax return is due soon:

Tax Type: VAT
Period: January 2026
Due Date: February 20, 2026
Days Remaining: 3
Status: WARNING

Please ensure the return is filed before the deadline to avoid penalties.

Actions:
[Generate Return]  [View Calendar]  [Filing History]

---
ERP System - Tax Reporting Module
```

### HTML Email Styling
```css
.urgency-overdue { background-color: #dc3545; color: white; }
.urgency-urgent { background-color: #fd7e14; color: white; }
.urgency-warning { background-color: #ffc107; color: black; }
.urgency-upcoming { background-color: #0dcaf0; color: white; }
```

### Expected Method Structure
```python
def send_reminder_email(self, reminder_data: dict) -> bool:
    """
    Send tax filing reminder email to finance team.
    
    Args:
        reminder_data: Dictionary with tax period and deadline info
        
    Returns:
        True if sent successfully, False otherwise
    """
    try:
        # Build subject and body
        # Get recipients
        # Send email
        return True
    except Exception as e:
        logger.error(f"Failed to send reminder: {e}")
        return False
```

### Expected Outcome
- Email sending functionality implemented
- Professional email formatting
- HTML and plain text versions
- Urgency-based styling
- Action links included
- Error handling and logging

### Verification Checklist
- [ ] Email imports added
- [ ] send_reminder_email method created
- [ ] Method docstring explains purpose
- [ ] reminder_data extracted properly
- [ ] Subject line varies by urgency
- [ ] Plain text message body created
- [ ] HTML message body created
- [ ] Urgency color coding applied
- [ ] Recipient list retrieved
- [ ] Finance team emails queried
- [ ] EmailMultiAlternatives used
- [ ] HTML version attached
- [ ] Send method called
- [ ] Error handling implemented
- [ ] Success boolean returned
- [ ] Action links included

---

## Task 80: Add Dashboard Reminder Widget

### Overview
Create API endpoint for dashboard widget displaying upcoming tax filing deadlines and overdue returns. Returns JSON data with pending filings, urgency levels, days remaining, and summary counts. Frontend dashboard uses this endpoint to show tax filing status, alert users to approaching deadlines, and provide quick access to filing actions.

### Dependencies
- Task 79: Email reminder method implemented
- FilingReminderService complete
- DRF viewset structure exists

### Instructions

1. **Open or create tax views file**
   - Navigate to `apps/accounting/views/` directory
   - Open `tax.py` or create if not exists
   - This contains tax-related API views

2. **Add view imports**
   - Import APIView from rest_framework.views
   - Import Response from rest_framework.response
   - Import permissions from rest_framework
   - Import FilingReminderService
   - Import TaxPeriodRecord, TaxSubmission

3. **Create TaxRemindersWidgetView class**
   - Create class inheriting from APIView
   - Add permission_classes for authentication
   - Add docstring explaining widget purpose
   - Note it's for dashboard display

4. **Implement get method**
   - Define get(self, request) method
   - No parameters needed
   - Returns current reminder status
   - Called by dashboard on load

5. **Initialize reminder service**
   - Create FilingReminderService instance
   - Get current tenant from request
   - Pass tenant to service if multi-tenant

6. **Get pending filings**
   - Call service.get_pending_filings()
   - Limit to next 30 days
   - Order by due_date ascending
   - Get overdue filings separately

7. **Build filings list**
   - Iterate through pending filings
   - For each filing:
     - Calculate due_date
     - Get urgency_level
     - Get days_remaining
     - Build filing dictionary
   - Collect all in list

8. **Structure filing data**
   - Each filing includes:
     - period_id: Database ID
     - tax_type: VAT, PAYE, EPF, or ETF
     - period: Display string (e.g., "January 2026")
     - due_date: ISO format string
     - days_remaining: Integer (negative if overdue)
     - urgency: overdue, urgent, warning, upcoming
     - status: PENDING, OVERDUE
   - Enable frontend rendering

9. **Add summary counts**
   - Calculate total pending_count
   - Calculate upcoming_count (>3 days)
   - Calculate warning_count (1-3 days)
   - Calculate urgent_count (0-1 days)
   - Calculate overdue_count (<0 days)
   - Include in response

10. **Add recent submissions**
    - Query last 5 TaxSubmission records
    - Order by submitted_at descending
    - Include tax_type, period, submission_date
    - Show recent activity

11. **Build response data**
    - Create response dictionary:
      - pending_filings: list
      - summary: counts dict
      - recent_submissions: list
      - last_updated: current timestamp
    - Return Response object

12. **Add caching**
    - Cache response for 1 hour
    - Use Django cache framework
    - Cache key per tenant
    - Invalidate on new submission

13. **Register URL route**
    - Open `apps/accounting/urls.py`
    - Add route: `tax/reminders/`
    - Map to TaxRemindersWidgetView
    - Name: 'tax-reminders-widget'

### Widget Response Structure
```json
{
  "pending_filings": [
    {
      "period_id": 123,
      "tax_type": "VAT",
      "period": "January 2026",
      "due_date": "2026-02-20",
      "days_remaining": 3,
      "urgency": "warning",
      "status": "PENDING"
    },
    {
      "period_id": 124,
      "tax_type": "PAYE",
      "period": "January 2026",
      "due_date": "2026-02-15",
      "days_remaining": -2,
      "urgency": "overdue",
      "status": "OVERDUE"
    }
  ],
  "summary": {
    "pending_count": 4,
    "upcoming_count": 2,
    "warning_count": 1,
    "urgent_count": 0,
    "overdue_count": 1
  },
  "recent_submissions": [
    {
      "tax_type": "EPF",
      "period": "December 2025",
      "submitted_at": "2026-01-28T10:30:00Z",
      "status": "ACCEPTED"
    }
  ],
  "last_updated": "2026-02-10T08:00:00Z"
}
```

### Dashboard Widget Display

| Section | Content | Urgency Color |
|---------|---------|---------------|
| **Overdue** | Red badge with count | #dc3545 |
| **Urgent** | Orange badge (0-1 days) | #fd7e14 |
| **Warning** | Yellow badge (2-3 days) | #ffc107 |
| **Upcoming** | Blue badge (4-7 days) | #0dcaf0 |
| **Recent** | Green checkmark list | #198754 |

### Expected View Structure
```python
class TaxRemindersWidgetView(APIView):
    """
    API endpoint for dashboard tax filing reminders widget.
    """
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        """Get pending tax filings and reminder data."""
        service = FilingReminderService()
        pending = service.get_pending_filings()
        
        # Build response data
        data = {
            'pending_filings': [...],
            'summary': {...},
            'recent_submissions': [...],
            'last_updated': timezone.now()
        }
        
        return Response(data)
```

### Expected Outcome
- Dashboard widget API endpoint created
- Pending filings data returned
- Urgency levels included
- Summary counts provided
- Recent submissions listed
- URL route registered

### Verification Checklist
- [ ] tax.py views file exists or created
- [ ] APIView and Response imported
- [ ] TaxRemindersWidgetView class created
- [ ] permission_classes configured
- [ ] get method implemented
- [ ] FilingReminderService instantiated
- [ ] Pending filings queried
- [ ] Due dates calculated
- [ ] Urgency levels determined
- [ ] Filing dictionaries built
- [ ] Summary counts calculated
- [ ] Recent submissions queried
- [ ] Response data structured
- [ ] Response returned
- [ ] URL route registered in urls.py
- [ ] Caching implemented
- [ ] Multi-tenant filtering if needed

---

## Notes for AI Agents

### FilingReminderService Purpose
The FilingReminderService centralizes all tax filing deadline logic, ensuring consistent deadline calculations across the system. It provides a single source of truth for due dates, preventing discrepancies between reminder emails, dashboard widgets, and manual checks.

### Sri Lankan Tax Authority Deadlines Summary
```
VAT:   20th of following month (Inland Revenue)
PAYE:  15th of following month (Inland Revenue)
EPF:   Last day of following month (CBSL)
ETF:   Last day of following month (ETF Board)
```

### Reminder Schedule Strategy
The 7-3-1-0 day reminder schedule balances thoroughness with avoiding spam:
- **7 days:** Early warning, time to prepare
- **3 days:** Escalation, ensure action started
- **1 day:** Urgent, must file today/tomorrow
- **0 days:** Final, due date alert

### Weekend Adjustment Logic
IRD taxes (VAT, PAYE) move forward to Monday if due on weekend (authority acceptance). CBSL/ETF taxes move backward to Friday (month boundary constraint).

### Celery Beat Configuration
Add to Django settings for daily task:
```python
CELERY_BEAT_SCHEDULE = {
    'check-tax-filing-deadlines': {
        'task': 'apps.accounting.tasks.check_tax_filing_deadlines',
        'schedule': crontab(hour=8, minute=0),  # 8:00 AM daily
    },
}
```

### Email Configuration Requirements
- SMTP server configured in Django settings
- EMAIL_HOST, EMAIL_PORT, EMAIL_USE_TLS
- EMAIL_HOST_USER, EMAIL_HOST_PASSWORD
- DEFAULT_FROM_EMAIL for sender address
- FINANCE_EMAIL for recipient list

### Dashboard Integration
Frontend dashboard polls widget endpoint every 5 minutes or on page load. Shows badge with count and urgency color. Clicking opens tax calendar view with detailed filing list.

### Multi-Tenant Considerations
In multi-tenant systems:
- Service filters by tenant automatically
- Celery task iterates all tenants
- Each tenant gets separate reminders
- Dashboard shows only tenant's filings
- Cache keys include tenant identifier

### Performance Optimization
- Cache widget response for 1 hour
- Index database on submitted_at and due_date
- Batch email sending (don't send individually)
- Limit pending query to 90 days ahead
- Use select_related for foreign keys

### Testing Considerations
- Test due date calculations with various months
- Test leap year February scenarios
- Test weekend adjustments (both directions)
- Test year-end rollover (December to January)
- Mock email sending in tests
- Test multi-tenant isolation
- Verify urgency level thresholds

### Common Pitfalls to Avoid
- Don't send duplicate reminders on same day
- Don't forget timezone awareness
- Don't hardcode email recipients
- Don't ignore email sending failures
- Don't calculate due dates at query time (cache in TaxPeriodRecord)
- Don't expose sensitive tenant data across tenants
