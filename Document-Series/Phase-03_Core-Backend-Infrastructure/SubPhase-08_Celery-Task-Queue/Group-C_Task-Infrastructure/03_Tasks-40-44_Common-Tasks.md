# Tasks 40-44: Common Tasks

> **Phase:** 03 - Core Backend Infrastructure  
> **SubPhase:** 08 - Celery Task Queue  
> **Group:** C - Task Infrastructure  
> **Document:** 03 of 04  
> **Tasks Covered:** 40, 41, 42, 43, 44

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [02_Tasks-33-39_Base-Task-Classes.md](02_Tasks-33-39_Base-Task-Classes.md)
- **→ Next Document:** [04_Tasks-45-46_Export-Testing.md](04_Tasks-45-46_Export-Testing.md)

---

## Document Overview

This document covers the creation of common task implementations for email sending, report generation, and notifications that will be used throughout the LankaCommerce Cloud platform.

### Tasks in This Document
| Task # | Task Name | Complexity |
|--------|-----------|------------|
| 40 | Create Email Tasks | Medium |
| 41 | Add send_email_task | Medium |
| 42 | Create Report Tasks | Medium |
| 43 | Add generate_report_task | Medium |
| 44 | Create Notification Tasks | Medium |

---

## Task 40: Create Email Tasks

### Overview
Create a dedicated file for email-related Celery tasks, establishing the foundation for transactional and bulk email sending capabilities in the LCC platform.

### Dependencies
- Task 33: Create BaseTask Class
- Task 37: Create TenantAwareTask

### Instructions

1. **Create email_tasks.py file**
   - Create file in tasks/ package
   - For LCC: `backend/apps/core/tasks/email_tasks.py`
   - This will contain all email-related tasks

2. **Add file docstring**
   - Document the file's purpose
   - List tasks contained in file
   - Provide usage examples

3. **Import required modules**
   - Import shared_task decorator
   - Import TenantAwareTask base class
   - Import Django email utilities
   - Import logging module

4. **Plan email task types**
   - Single email sending
   - Bulk email sending
   - Template-based emails
   - Transactional emails

5. **Add file-level constants**
   - Default email settings
   - Maximum retry attempts for email
   - Timeout values
   - Rate limits

### Email Tasks File Purpose
| Purpose | Description |
|---------|-------------|
| Transactional Emails | Order confirmations, password resets |
| Notification Emails | Alerts, reminders |
| Bulk Emails | Marketing, newsletters |
| System Emails | Error notifications, reports |

### Email Task Categories
| Task Type | Use Case | Priority |
|-----------|----------|----------|
| Single Email | User action triggered | High |
| Bulk Email | Marketing campaigns | Low |
| Admin Alert | System notifications | Critical |
| Report Email | Daily/weekly reports | Normal |

### Required Imports
Import these for email tasks:
| Module | Purpose |
|--------|---------|
| shared_task | Task decorator |
| TenantAwareTask | Multi-tenant base |
| send_mail | Django email function |
| EmailMessage | Email class |
| EmailMultiAlternatives | HTML email |
| get_template | Template rendering |
| logger | Logging |

### Email Configuration Considerations
| Setting | Purpose |
|---------|---------|
| EMAIL_BACKEND | Email sending backend |
| DEFAULT_FROM_EMAIL | Default sender |
| EMAIL_TIMEOUT | Send timeout |
| MAX_RETRIES | Retry attempts |

### Expected Outcome
- email_tasks.py file created
- Proper imports in place
- File documentation complete
- Ready for task implementations
- Constants defined

### Verification Checklist
- [ ] email_tasks.py created in tasks/
- [ ] File has docstring
- [ ] Required imports added
- [ ] Constants defined
- [ ] Path: backend/apps/core/tasks/email_tasks.py

---

## Task 41: Add send_email_task

### Overview
Implement the send_email_task function that handles sending individual emails asynchronously, with retry logic and error handling for the LCC platform.

### Dependencies
- Task 40: Create Email Tasks
- Task 37: Create TenantAwareTask

### Instructions

1. **Define send_email_task function**
   - Use @shared_task decorator
   - Set base to TenantAwareTask
   - Configure retry settings
   - Add function docstring

2. **Define function parameters**
   - tenant_id (required for tenant-aware task)
   - recipient email address
   - email subject
   - email body (text)
   - optional HTML body
   - optional attachments
   - optional reply-to address

3. **Implement email sending logic**
   - Validate email parameters
   - Construct email message
   - Set sender address
   - Add HTML alternative if provided
   - Attach files if provided
   - Send email using Django backend

4. **Add error handling**
   - Catch SMTP errors
   - Catch timeout errors
   - Retry on transient errors
   - Fail on permanent errors
   - Log all errors

5. **Configure retry behavior**
   - Set max_retries (e.g., 3)
   - Use exponential backoff
   - Add retry delay
   - Specify retriable exceptions

6. **Add logging**
   - Log email sending attempt
   - Log success with message ID
   - Log failures with error details
   - Log retry attempts

7. **Return result**
   - Return success/failure status
   - Include message ID if available
   - Include error message if failed

### Task Configuration
| Setting | Value | Purpose |
|---------|-------|---------|
| max_retries | 3 | Retry failed emails |
| default_retry_delay | 60 | Wait between retries |
| autoretry_for | (SMTPException,) | Auto-retry these errors |
| retry_backoff | True | Exponential backoff |

### Function Signature
```python
@shared_task(base=TenantAwareTask, ...)
def send_email_task(
    tenant_id,
    to_email,
    subject,
    body,
    html_body=None,
    from_email=None,
    reply_to=None,
    attachments=None
):
    # Implementation
    pass
```

### Email Sending Flow
```
1. Validate parameters
2. Get tenant context
3. Construct EmailMessage
4. Set sender and recipient
5. Add content (text + HTML)
6. Add attachments if any
7. Send via backend
8. Log success
9. Return result
```

### Error Scenarios
| Error | Handling |
|-------|---------|
| Invalid email address | Validate, fail immediately |
| SMTP timeout | Retry with backoff |
| SMTP connection error | Retry with backoff |
| Authentication error | Fail immediately |
| Rate limit exceeded | Retry after delay |
| Invalid recipient | Fail immediately |

### Retriable vs. Non-retriable Errors
| Error Type | Action |
|------------|--------|
| Transient (timeout, connection) | Retry |
| Permanent (invalid email, auth) | Fail |
| Rate limit | Retry with longer delay |

### Email Validation
Validate before sending:
- Email address format
- Subject not empty
- Body not empty
- Attachments are valid files
- tenant_id is valid

### Return Value Structure
```python
{
    'success': True/False,
    'message_id': 'unique-id' or None,
    'error': 'error message' or None,
    'attempts': number of attempts
}
```

### Expected Outcome
- send_email_task function implemented
- Handles tenant context
- Retry logic configured
- Error handling comprehensive
- Logs appropriately
- Returns useful result

### Verification Checklist
- [ ] send_email_task function defined
- [ ] Uses @shared_task with TenantAwareTask
- [ ] All parameters documented
- [ ] Email validation implemented
- [ ] Error handling in place
- [ ] Retry configuration set
- [ ] Logging at key points
- [ ] Returns structured result

---

## Task 42: Create Report Tasks

### Overview
Create a dedicated file for report generation tasks, establishing the foundation for PDF and Excel report generation in the LCC platform.

### Dependencies
- Task 33: Create BaseTask Class
- Task 37: Create TenantAwareTask

### Instructions

1. **Create report_tasks.py file**
   - Create file in tasks/ package
   - For LCC: `backend/apps/core/tasks/report_tasks.py`
   - This will contain all report generation tasks

2. **Add file docstring**
   - Document report task purposes
   - List report types
   - Provide usage examples

3. **Import required modules**
   - Import shared_task decorator
   - Import TenantAwareTask base class
   - Import report generation libraries
   - Import file storage utilities
   - Import logging module

4. **Plan report task types**
   - PDF report generation
   - Excel spreadsheet generation
   - CSV export
   - Email report to user

5. **Add file-level constants**
   - Report storage paths
   - Maximum report size
   - Timeout values
   - Supported formats

### Report Tasks Purpose
| Purpose | Description |
|---------|-------------|
| Sales Reports | Daily, weekly, monthly sales |
| Inventory Reports | Stock levels, movements |
| Financial Reports | P&L, balance sheet |
| Custom Reports | User-defined reports |

### Report Types
| Type | Format | Use Case |
|------|--------|----------|
| Transaction Report | PDF | Sales, purchases |
| Inventory Report | Excel | Stock levels |
| Financial Report | PDF | Accounting |
| Data Export | CSV | Raw data |

### Required Imports
| Module | Purpose |
|--------|---------|
| shared_task | Task decorator |
| TenantAwareTask | Multi-tenant base |
| ReportLab (or similar) | PDF generation |
| openpyxl/xlsxwriter | Excel generation |
| default_storage | File storage |
| logger | Logging |

### Report Generation Libraries
| Library | Format | Purpose |
|---------|--------|---------|
| ReportLab | PDF | Professional PDFs |
| WeasyPrint | PDF | HTML to PDF |
| openpyxl | Excel | Excel workbooks |
| xlsxwriter | Excel | Large Excel files |
| csv | CSV | Simple exports |

### Storage Strategy
| Storage | Use Case |
|---------|----------|
| Local Filesystem | Development |
| S3/Cloud Storage | Production |
| Temporary Files | Immediate download |
| Persistent Storage | Archive |

### Expected Outcome
- report_tasks.py file created
- Proper imports in place
- File documentation complete
- Ready for report tasks
- Constants defined

### Verification Checklist
- [ ] report_tasks.py created in tasks/
- [ ] File has docstring
- [ ] Required imports added
- [ ] Constants defined
- [ ] Path: backend/apps/core/tasks/report_tasks.py

---

## Task 43: Add generate_report_task

### Overview
Implement the generate_report_task function that handles asynchronous report generation with support for multiple formats and tenant-specific data.

### Dependencies
- Task 42: Create Report Tasks
- Task 37: Create TenantAwareTask

### Instructions

1. **Define generate_report_task function**
   - Use @shared_task decorator
   - Set base to TenantAwareTask
   - Configure time limit
   - Add function docstring

2. **Define function parameters**
   - tenant_id (required)
   - report_type (sales, inventory, financial)
   - report_format (pdf, excel, csv)
   - date_range (start_date, end_date)
   - filters (additional parameters)
   - user_id (who requested)

3. **Implement report generation flow**
   - Validate parameters
   - Query data based on report type
   - Format data appropriately
   - Generate report file
   - Save to storage
   - Return file path/URL

4. **Add format handlers**
   - PDF generation handler
   - Excel generation handler
   - CSV generation handler
   - Each handler creates appropriate file

5. **Configure time limits**
   - Set soft time limit (5 minutes)
   - Set hard time limit (10 minutes)
   - Handle large datasets
   - Implement pagination if needed

6. **Add error handling**
   - Catch generation errors
   - Handle storage errors
   - Validate data availability
   - Log all errors

7. **Add progress tracking**
   - Update task state with progress
   - Use task.update_state() for progress
   - Show percentage complete
   - Useful for UI progress bars

### Task Configuration
| Setting | Value | Purpose |
|---------|-------|---------|
| time_limit | 600 | 10 minutes max |
| soft_time_limit | 300 | 5 minute warning |
| bind | True | Access to self |

### Function Signature
```python
@shared_task(
    base=TenantAwareTask,
    bind=True,
    time_limit=600,
    soft_time_limit=300
)
def generate_report_task(
    self,
    tenant_id,
    report_type,
    report_format,
    start_date,
    end_date,
    filters=None,
    user_id=None
):
    # Implementation
    pass
```

### Report Generation Flow
```
1. Validate parameters
2. Get tenant context
3. Query report data
4. Format data for report
5. Generate file based on format
6. Save to storage
7. Return file path/URL
8. Optionally email to user
```

### Report Types
| Type | Data Source | Output |
|------|-------------|--------|
| Sales Report | Transactions | PDF, Excel |
| Inventory Report | Stock data | Excel, CSV |
| Financial Report | Accounting data | PDF |
| Custom Report | User-defined | Any format |

### Progress Updates
Update task state for long-running reports:
```python
self.update_state(
    state='PROGRESS',
    meta={'current': step, 'total': total_steps, 'status': 'Generating...'}
)
```

### File Storage
| Step | Action |
|------|--------|
| Generate | Create file in memory/temp |
| Save | Store in media/reports/tenant_id/ |
| Return | Return file path or URL |
| Cleanup | Delete temp files |

### Report File Naming
Format: `{report_type}_{tenant_id}_{date}_{uuid}.{ext}`
Example: `sales_report_123_2026-01-23_abc123.pdf`

### Error Handling
| Error | Action |
|-------|--------|
| No data | Return empty report or error |
| Generation fails | Log error, retry |
| Storage fails | Log error, fail task |
| Timeout | Partial report or fail |

### Expected Outcome
- generate_report_task function implemented
- Handles multiple report types
- Supports multiple formats
- Progress tracking enabled
- Error handling comprehensive
- Files stored properly

### Verification Checklist
- [ ] generate_report_task function defined
- [ ] Uses @shared_task with TenantAwareTask
- [ ] All parameters documented
- [ ] Report type handling implemented
- [ ] Format handlers for PDF, Excel, CSV
- [ ] File storage implemented
- [ ] Progress tracking added
- [ ] Error handling in place
- [ ] Time limits configured
- [ ] Returns file path/URL

---

## Task 44: Create Notification Tasks

### Overview
Create a dedicated file for notification tasks, establishing the foundation for push notifications, SMS, and in-app alerts in the LCC platform.

### Dependencies
- Task 33: Create BaseTask Class
- Task 37: Create TenantAwareTask

### Instructions

1. **Create notification_tasks.py file**
   - Create file in tasks/ package
   - For LCC: `backend/apps/core/tasks/notification_tasks.py`
   - This will contain all notification tasks

2. **Add file docstring**
   - Document notification task purposes
   - List notification types
   - Provide usage examples

3. **Import required modules**
   - Import shared_task decorator
   - Import TenantAwareTask base class
   - Import notification service clients
   - Import logging module

4. **Plan notification types**
   - Push notifications (Firebase, etc.)
   - SMS notifications
   - In-app notifications
   - Webhook notifications

5. **Add file-level constants**
   - Notification service credentials
   - Rate limits
   - Retry settings
   - Timeout values

6. **Implement send_notification_task**
   - Generic notification sending
   - Multiple channel support
   - Retry logic
   - Error handling

### Notification Types
| Type | Channel | Use Case |
|------|---------|----------|
| Push | Mobile app | Order updates, alerts |
| SMS | Text message | OTPs, urgent alerts |
| In-App | Application UI | General notifications |
| Webhook | External system | Integration events |

### Notification Services
| Service | Purpose |
|---------|---------|
| Firebase Cloud Messaging | Push notifications |
| Twilio | SMS |
| SNS (AWS) | Multi-channel |
| OneSignal | Push notifications |

### Task Structure
Each notification task should:
- Accept tenant_id
- Accept recipient information
- Accept notification content
- Handle channel-specific formatting
- Retry on transient failures
- Log all attempts

### Notification Data Structure
| Field | Purpose |
|-------|---------|
| recipient | User ID or device token |
| title | Notification title |
| body | Notification content |
| data | Additional payload |
| priority | Normal or high |
| channel | push, sms, in-app |

### Required Imports
| Module | Purpose |
|--------|---------|
| shared_task | Task decorator |
| TenantAwareTask | Multi-tenant base |
| FCM client | Push notifications |
| SMS client | Text messages |
| Notification model | In-app storage |
| logger | Logging |

### Configuration Considerations
| Setting | Purpose |
|---------|---------|
| API_KEYS | Service credentials |
| RATE_LIMITS | Prevent abuse |
| RETRY_COUNT | Failed delivery retry |
| TIMEOUT | Service timeout |

### send_notification_task Implementation
```
1. Validate parameters
2. Get tenant context
3. Determine notification channel
4. Format message for channel
5. Send via appropriate service
6. Store in-app notification
7. Handle delivery failures
8. Return delivery status
```

### Error Handling
| Error | Action |
|-------|--------|
| Invalid recipient | Fail immediately |
| Service unavailable | Retry |
| Rate limit exceeded | Retry with delay |
| Invalid credentials | Fail, alert admin |

### Expected Outcome
- notification_tasks.py file created
- send_notification_task implemented
- Multiple channels supported
- Retry logic configured
- Error handling in place
- Proper logging

### Verification Checklist
- [ ] notification_tasks.py created
- [ ] File has docstring
- [ ] Required imports added
- [ ] send_notification_task defined
- [ ] Multiple channels supported
- [ ] Retry configuration set
- [ ] Error handling implemented
- [ ] Path: backend/apps/core/tasks/notification_tasks.py

---

## Summary

### Tasks Completed in This Document
| Task # | Task Name | Key Deliverable |
|--------|-----------|-----------------|
| 40 | Create Email Tasks | email_tasks.py file |
| 41 | Add send_email_task | Email sending task |
| 42 | Create Report Tasks | report_tasks.py file |
| 43 | Add generate_report_task | Report generation task |
| 44 | Create Notification Tasks | notification_tasks.py file |

### File Structure Created
```
backend/apps/core/tasks/
├── __init__.py
├── base.py
├── email_tasks.py          # Email tasks
├── report_tasks.py         # Report tasks
└── notification_tasks.py   # Notification tasks
```

### Tasks Implemented
| Task | Purpose | Base Class |
|------|---------|------------|
| send_email_task | Send emails | TenantAwareTask |
| generate_report_task | Generate reports | TenantAwareTask |
| send_notification_task | Send notifications | TenantAwareTask |

### Common Task Patterns Established
- All tasks use TenantAwareTask
- All tasks accept tenant_id
- All tasks have retry logic
- All tasks have error handling
- All tasks log appropriately

### Next Steps
Proceed to [04_Tasks-45-46_Export-Testing.md](04_Tasks-45-46_Export-Testing.md) to export all tasks and create comprehensive tests.

---

## Notes for AI Agents

1. **Tenant Awareness:** All common tasks use TenantAwareTask
2. **Error Handling:** Comprehensive error handling for each task
3. **Retry Logic:** Configure appropriate retry behavior
4. **Time Limits:** Set for long-running tasks like reports
5. **Progress Tracking:** Use update_state for long tasks
6. **Validation:** Validate all parameters before execution
7. **Logging:** Log at appropriate levels
8. **Return Values:** Return structured results
9. **File Storage:** Use Django storage backend
10. **Service Integration:** External services need proper error handling
