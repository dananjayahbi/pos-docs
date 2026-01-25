# Tasks 57-64: Email Distribution System

> **Phase:** 06 - ERP Advanced Modules  
> **SubPhase:** 07 - Payslip Generation  
> **Group:** D - Bulk Generation & Email  
> **Document:** 02 of 02  
> **Tasks Covered:** 57, 58, 59, 60, 61, 62, 63, 64

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [01_Tasks-49-56_Bulk-Generation.md](01_Tasks-49-56_Bulk-Generation.md)

---

## Document Overview

This document covers the email distribution system for payslips, including HTML email templates, subject line configuration, the PayslipEmailer service, single and bulk email sending, rate limiting, status tracking, and failure handling. These components enable automated, reliable delivery of payslips to employees via email with PDF attachments.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 57 | Email Template | Medium | 35 min |
| 58 | Email Subject Configuration | Low | 20 min |
| 59 | PayslipEmailer Service | High | 45 min |
| 60 | Send Single Email Method | Medium | 30 min |
| 61 | Bulk Email Celery Task | Medium | 35 min |
| 62 | Email Throttling | Medium | 30 min |
| 63 | Email Status Tracking | Low | 25 min |
| 64 | Email Failure Handling | High | 40 min |

---

## Task 57: Email Template

### Overview
Create an HTML email template that accompanies the payslip PDF attachment. This template provides a professional, branded email with a summary of the payslip information and helps employees understand the attached document before opening it.

### Dependencies
- ReceiptTemplate system (for design patterns)
- Django templating engine
- Email infrastructure configuration

### Instructions

1. **Create email templates directory**
   - Navigate to `apps/hr/payroll/templates/payroll/emails/`
   - Create `payslip_email.html` for the main template
   - Create `payslip_email.txt` for plain-text fallback

2. **Design HTML email structure**
   - Use table-based layout for email client compatibility
   - Include DOCTYPE and meta tags for proper rendering
   - Set viewport meta tag for mobile responsiveness
   - Use inline CSS (many email clients strip external styles)

3. **Add email header section**
   - Include company logo (use absolute URL)
   - Display company name from tenant settings
   - Add professional greeting with employee name
   - Include appropriate spacing and branding colors

4. **Create payslip summary section**
   - Display period name prominently
   - Show gross pay amount
   - Show net pay amount
   - Display payment date
   - Include payslip number for reference

5. **Add instructional text**
   - Explain that payslip PDF is attached
   - Provide instructions for opening attachment
   - Mention confidentiality of payroll information
   - Include contact information for questions

6. **Create footer section**
   - Add company contact details
   - Include privacy notice
   - Add unsubscribe link (if required)
   - Include timestamp and system identifier

7. **Implement template variables**
   - `{{ employee_name }}` - Employee full name
   - `{{ period_name }}` - Pay period description
   - `{{ company_name }}` - Tenant company name
   - `{{ company_logo_url }}` - Absolute URL to logo
   - `{{ gross_pay }}` - Formatted gross pay amount
   - `{{ net_pay }}` - Formatted net pay amount
   - `{{ payment_date }}` - When payment will be made
   - `{{ slip_number }}` - Unique payslip identifier
   - `{{ support_email }}` - HR contact email

8. **Create plain-text version**
   - Write `payslip_email.txt` with same information
   - Remove all HTML formatting
   - Use clear section separators
   - Include all key information in readable format

### Email Client Compatibility

| Aspect | Recommendation |
|--------|----------------|
| Layout | Table-based, not divs |
| CSS | Inline only, no external |
| Images | Absolute URLs, alt text |
| Fonts | Web-safe fonts, fallbacks |
| Width | Max 600px for desktop |
| Background | Solid colors, no images |

### HTML Email Concepts

**Table-Based Layout**
Email clients, especially older versions of Outlook, have poor support for modern CSS. Table-based layouts ensure consistent rendering across all email clients. Use nested tables for complex layouts.

**Inline CSS**
Many email clients strip `<style>` tags and external stylesheets. All CSS must be written inline within each element's style attribute. This includes colors, fonts, spacing, and borders.

**Absolute URLs**
All images, logos, and links must use absolute URLs (https://...) not relative paths. Email clients don't have context for relative paths and won't display images correctly.

**Plain-Text Fallback**
Some users disable HTML emails or use text-only clients. Always provide a plain-text version with the same information formatted for readability without HTML.

### Template Variable Guidelines

**Context Dictionary**
All variables are passed as a context dictionary to the template rendering engine. Ensure all required variables are available before rendering to avoid template errors.

**Formatting**
Apply currency formatting, date formatting, and number formatting in the view before passing to template. Templates should receive pre-formatted display values, not raw data.

**Missing Variables**
Use template filters like `{{ variable|default:"N/A" }}` to handle cases where optional variables might be missing. This prevents template rendering failures.

**Localization**
Consider language settings when formatting dates and currency. Use Django's localization framework to respect tenant locale settings.

### Expected Outcome
- Professional HTML email template
- Plain-text fallback version
- Template uses all required variables
- Compatible with major email clients
- Branded with company logo and colors

### Verification Checklist
- [ ] `payslip_email.html` template created
- [ ] `payslip_email.txt` plain-text version created
- [ ] All template variables defined
- [ ] Inline CSS applied throughout
- [ ] Company logo uses absolute URL
- [ ] Table-based layout for compatibility
- [ ] Payslip summary information displayed
- [ ] Footer with contact information included

---

## Task 58: Email Subject Configuration

### Overview
Implement configurable email subject line templates that allow tenants to customize how payslip email subjects appear. Support template variables for dynamic content and provide sensible defaults that work for all tenants.

### Dependencies
- Tenant model with settings field
- PayrollSettings model (if separate)
- Template rendering engine

### Instructions

1. **Add subject template fields**
   - Add `payslip_email_subject` field to tenant settings
   - Type: TextField (to allow multi-line if needed)
   - Default value: "Your Payslip for {{ period_name }}"
   - Make field optional (use default if empty)

2. **Define supported variables**
   - `{{ period_name }}` - Pay period (e.g., "January 2026")
   - `{{ employee_name }}` - Full name of employee
   - `{{ company_name }}` - Tenant company name
   - `{{ slip_number }}` - Unique payslip number
   - `{{ payment_date }}` - When payment occurs
   - `{{ month }}` - Month name only
   - `{{ year }}` - Year only

3. **Create subject rendering method**
   - Method: `render_email_subject(payslip, tenant)`
   - Load template string from tenant settings
   - Build context dictionary with all variables
   - Use Django template engine to render
   - Handle rendering errors gracefully

4. **Implement fallback logic**
   - If subject template is empty, use default
   - If rendering fails, use fallback subject
   - Fallback: "Payslip - [period_name]"
   - Log template rendering errors

5. **Add validation for templates**
   - Check that template uses valid syntax
   - Warn about unsupported variables
   - Prevent injection of email headers
   - Limit subject line to 200 characters

6. **Create configuration interface**
   - Add field to tenant admin or settings page
   - Show list of available variables
   - Provide preview functionality
   - Display example rendered subject

7. **Handle special characters**
   - Ensure subject line is properly encoded
   - Remove newline characters (security)
   - Handle Unicode characters correctly
   - Escape any special email header characters

### Template Variable Resolution

**Variable Context Building**
Before rendering the subject template, collect all required data:
- Extract period information from payslip
- Get employee details from related user
- Load tenant company information
- Format dates according to locale
- Build dictionary with all variable values

**Template Engine Usage**
Django's template engine allows rendering strings as templates. Create a Template object from the subject string, then call render() with the context dictionary. This provides the same variable substitution as regular templates.

**Error Handling**
If template syntax is invalid or contains undefined variables, catch the TemplateSyntaxError or VariableDoesNotExist exceptions. Fall back to the default subject to ensure emails can still be sent.

### Subject Line Best Practices

**Length Limits**
Most email clients display only 60-100 characters of the subject line before truncation. Keep important information at the beginning. Mobile clients show even fewer characters.

**Clarity Over Cleverness**
Subject lines should clearly indicate the email contains a payslip. Avoid cryptic abbreviations or overly creative wording that might confuse employees or trigger spam filters.

**Consistency**
Maintain consistent subject format across all payslip emails. This helps employees recognize legitimate payroll emails and filter them appropriately in their inbox.

**Security Considerations**
Subject lines must not contain sensitive information like full salary amounts or social security numbers. They should identify the document type and period without revealing private details.

### Email Header Injection Prevention

**Newline Characters**
Email headers are separated by newlines (CRLF). If an attacker can inject newlines into the subject, they could add arbitrary headers like BCC or attach malware. Always strip newlines from subject lines.

**Character Filtering**
Remove or escape characters that have special meaning in email headers: newline, carriage return, null bytes, and certain control characters.

**Length Validation**
Extremely long subject lines could be used in buffer overflow attacks or to hide malicious content. Enforce reasonable length limits (200-250 characters maximum).

### Expected Outcome
- Tenant-configurable email subjects
- Template variable substitution working
- Default subject if none configured
- Subject line validation and sanitization
- Preview functionality for templates

### Verification Checklist
- [ ] Subject template field added to tenant
- [ ] Default subject template defined
- [ ] All supported variables documented
- [ ] Subject rendering method implemented
- [ ] Error handling for invalid templates
- [ ] Newline and special character filtering
- [ ] Subject length validation (200 chars)
- [ ] Preview functionality available

---

## Task 59: PayslipEmailer Service

### Overview
Create the PayslipEmailer service class that encapsulates all email sending logic for payslips. This service handles email composition, PDF attachment, SMTP connection management, error handling, and provides both single and bulk sending capabilities.

### Dependencies
- Django email framework
- PayslipPDFGenerator service
- Tenant schema context
- Email configuration settings

### Instructions

1. **Create PayslipEmailer service class**
   - Location: `apps/hr/payroll/services/payslip_emailer.py`
   - Class: `PayslipEmailer`
   - Initialize with tenant context
   - Store tenant for schema operations

2. **Implement initialization method**
   - Accept tenant parameter in `__init__`
   - Store tenant reference
   - Validate email settings are configured
   - Raise exception if SMTP not configured

3. **Create email building method**
   - Method: `_build_email(payslip) -> EmailMessage`
   - Render email subject from template
   - Render HTML email body
   - Render plain-text email body
   - Create EmailMessage object with both versions

4. **Implement PDF attachment method**
   - Method: `_attach_pdf(email, payslip) -> None`
   - Use PayslipPDFGenerator to create PDF
   - Generate appropriate filename
   - Attach PDF to EmailMessage object
   - Set correct MIME type (application/pdf)

5. **Create status update method**
   - Method: `_update_status(payslip, success, error=None)`
   - Update `email_sent` flag
   - Set `sent_at` timestamp if successful
   - Set `sent_to` email address
   - Log error message if failed
   - Save payslip with update_fields

6. **Implement validation method**
   - Method: `_validate_payslip(payslip) -> tuple[bool, str]`
   - Check payslip status is finalized
   - Verify employee has work email
   - Validate email format
   - Check PDF can be generated
   - Return (is_valid, error_message)

7. **Add SMTP connection helper**
   - Method: `_get_connection() -> EmailBackend`
   - Get connection from Django settings
   - Support custom SMTP settings per tenant
   - Handle connection pooling
   - Implement connection retry logic

8. **Create helper for email context**
   - Method: `_build_email_context(payslip) -> dict`
   - Collect all template variables
   - Format currency and dates
   - Get company logo URL
   - Build complete context dictionary

### Service Architecture

**Single Responsibility**
The PayslipEmailer service has one job: sending payslip emails. It doesn't generate payslips, calculate salaries, or manage batches. This separation makes the code testable and maintainable.

**Dependency Injection**
The service receives the tenant as a parameter rather than accessing it globally. This makes testing easier and allows the service to work with any tenant without implicit dependencies.

**Error Isolation**
Each method handles its own errors and returns status information. Higher-level methods can decide how to handle failures without the service making assumptions about error recovery strategies.

**Stateless Operations**
The service maintains minimal state (just the tenant reference). Each method operates on the data it receives as parameters, making operations predictable and thread-safe.

### EmailMessage Object

**Django's Email Framework**
Django provides an EmailMessage class that abstracts email composition and sending. It handles MIME multipart messages, attachments, headers, and encoding automatically.

**HTML and Plain Text**
An EmailMessage can contain both HTML and plain-text versions. Email clients that support HTML will display the formatted version, while others fall back to plain text.

**Attachments**
The `attach()` method adds files to the email. It accepts filename, content (as bytes), and MIME type. The email framework handles proper encoding and multipart message structure.

**Connection Management**
EmailMessage can use the default SMTP connection or accept a custom connection object. Connection pooling can improve performance when sending multiple emails.

### SMTP Configuration

**Settings Required**
Django needs several settings for SMTP: EMAIL_HOST, EMAIL_PORT, EMAIL_HOST_USER, EMAIL_HOST_PASSWORD, EMAIL_USE_TLS, and DEFAULT_FROM_EMAIL. These can come from Django settings or environment variables.

**Tenant-Specific Settings**
In a multi-tenant system, each tenant might use different SMTP servers or sender addresses. Load SMTP configuration from tenant settings and create custom connection objects.

**Connection Security**
Always use TLS or SSL when connecting to SMTP servers to encrypt credentials and email content. Set EMAIL_USE_TLS=True for STARTTLS or EMAIL_USE_SSL=True for direct SSL.

**Authentication**
Most SMTP servers require authentication. Store credentials securely (environment variables or secrets manager, not in code). Some services like SendGrid use API keys instead of passwords.

### Expected Outcome
- PayslipEmailer service class implemented
- Email building with HTML and text versions
- PDF attachment functionality working
- Status update tracking included
- Validation before sending emails
- SMTP connection management handled

### Verification Checklist
- [ ] `PayslipEmailer` class created
- [ ] Initialization with tenant context
- [ ] `_build_email()` method implemented
- [ ] `_attach_pdf()` method working
- [ ] `_update_status()` method updates payslip
- [ ] `_validate_payslip()` checks preconditions
- [ ] `_get_connection()` manages SMTP
- [ ] `_build_email_context()` collects variables

---

## Task 60: Send Single Email Method

### Overview
Implement the `send_single()` method that sends a payslip email to one employee. This method orchestrates validation, email building, PDF attachment, sending, and status updates for a single payslip email operation.

### Dependencies
- PayslipEmailer service (Task 59)
- PayslipPDFGenerator service
- Django email backend
- Payslip model with email fields

### Instructions

1. **Implement send_single method signature**
   - Method: `send_single(payslip_id) -> dict`
   - Accept payslip ID (not object) for Celery compatibility
   - Return dictionary with success status and details
   - Handle all exceptions internally

2. **Load payslip with tenant schema**
   - Use tenant schema context
   - Query payslip by ID with related data
   - Select related: employee, period, company
   - Handle DoesNotExist gracefully

3. **Validate payslip for sending**
   - Call `_validate_payslip()` method
   - Check return status
   - If invalid, return error without sending
   - Log validation failures

4. **Build email message**
   - Call `_build_email()` method
   - Receive EmailMessage object
   - Handle template rendering errors
   - Log any building failures

5. **Attach PDF to email**
   - Call `_attach_pdf()` method
   - Handle PDF generation failures
   - Continue even if attachment fails (optional)
   - Or fail completely if PDF is required

6. **Send email**
   - Call `email.send()` method
   - Catch SMTPException and other email errors
   - Log sending attempts
   - Record SMTP error messages

7. **Update payslip status**
   - Call `_update_status()` on success
   - Mark email_sent=True
   - Record sent_at timestamp
   - Store recipient email address

8. **Handle failures**
   - Call `_update_status()` with error on failure
   - Log detailed error information
   - Don't raise exceptions (return status instead)
   - Prepare for retry if needed

9. **Return result dictionary**
   - Include success boolean
   - Add payslip_id for reference
   - Include error message if failed
   - Add recipient email address
   - Include timestamp

### Method Flow

**Step-by-Step Execution**
The send_single method follows a linear flow: load data, validate, build email, attach PDF, send, update status, return result. Each step can fail independently and is handled appropriately.

**Error Boundaries**
Each major operation (validation, building, sending) is wrapped in error handling. Failures in one step should not crash the entire method but should be captured and reported in the return value.

**Logging Strategy**
Log at key points: method entry, validation result, send attempt, send result, final outcome. Use appropriate log levels (DEBUG for entry, INFO for success, WARNING for validation failure, ERROR for send failure).

**Return Value Format**
The method returns a dictionary rather than raising exceptions. This makes it easier to use in Celery tasks and allows the caller to decide how to handle failures (retry, log, alert, etc.).

### Transaction Management

**Database Operations**
The status update at the end modifies the payslip record. Consider whether this should be in a database transaction. If the update fails, should the email send be considered successful?

**Atomic Updates**
Use Django's `update_fields` parameter when saving the payslip to minimize database locking and conflicts. Only update the fields that changed (email_sent, sent_at, sent_to).

**Concurrent Sending**
Multiple workers might try to send the same payslip. Add optimistic locking or check email_sent status before sending to prevent duplicate emails.

### Email Sending Errors

**SMTP Exceptions**
The most common error is SMTPException, which covers connection failures, authentication problems, and server rejections. Catch this specifically to provide helpful error messages.

**Connection Timeouts**
SMTP connections can time out if the server is slow or unreachable. Set reasonable timeout values in email settings. Consider timeouts as temporary failures suitable for retry.

**Invalid Recipient**
Email addresses might be malformed or rejected by the SMTP server. Validate email format before sending. Handle SMTPRecipientsRefused specifically.

**Attachment Size**
Large PDF attachments might exceed SMTP server limits (typically 10-25 MB). If payslips are very large, consider compression or providing download links instead of attachments.

### Expected Outcome
- Send single payslip email working
- Complete validation before sending
- PDF attachment included
- Status tracking updated
- Errors handled and logged
- Result dictionary returned

### Verification Checklist
- [ ] `send_single()` method implemented
- [ ] Accepts payslip_id parameter
- [ ] Loads payslip with tenant context
- [ ] Validates before sending
- [ ] Builds email with HTML and text
- [ ] Attaches PDF document
- [ ] Sends via SMTP
- [ ] Updates payslip status on success
- [ ] Handles and logs all errors
- [ ] Returns status dictionary

---

## Task 61: Bulk Email Celery Task

### Overview
Create a Celery task that sends payslip emails in bulk for an entire batch. This task processes all payslips in a batch, sends emails in parallel with rate limiting, tracks progress, and updates batch status upon completion.

### Dependencies
- Celery configured and running
- PayslipEmailer service
- BulkPayslipBatch model
- Redis or RabbitMQ message broker

### Instructions

1. **Create Celery task file**
   - Location: `apps/hr/payroll/tasks/payslip_email_tasks.py`
   - Import Celery app instance
   - Import required services and models

2. **Define bulk email task**
   - Decorator: `@shared_task(bind=True)`
   - Task name: `send_bulk_payslip_emails`
   - Parameters: `batch_id`, `tenant_schema`
   - Return: Result summary dictionary

3. **Set task configuration**
   - `bind=True` to access task instance (self)
   - `rate_limit='10/s'` for throttling
   - `max_retries=3` for failure handling
   - `soft_time_limit=3600` (1 hour timeout)
   - `time_limit=3900` (hard limit)

4. **Implement task body**
   - Switch to tenant schema context
   - Load BulkPayslipBatch record
   - Query all payslips in batch
   - Filter for finalized payslips only

5. **Update batch status to sending**
   - Set batch.status = 'sending'
   - Record sending_started_at timestamp
   - Save batch record

6. **Initialize progress tracking**
   - Create counters: sent, failed, skipped
   - Create error list for failures
   - Record start time

7. **Iterate through payslips**
   - Use queryset.iterator() for memory efficiency
   - Skip already-sent emails
   - Call send_single for each payslip
   - Track success/failure counts

8. **Update task progress**
   - Use `self.update_state()` for progress
   - Report percentage complete
   - Include count of sent/failed
   - Allow UI to show progress bar

9. **Handle individual failures**
   - Catch exceptions per payslip
   - Log error details
   - Continue with next payslip
   - Don't fail entire batch for one error

10. **Update batch completion status**
    - Set batch.status = 'completed'
    - Set emails_sent_count
    - Set emails_failed_count
    - Record sending_completed_at
    - Save error_log if failures occurred

11. **Return result summary**
    - Dictionary with counts
    - List of failed payslip IDs
    - Execution time
    - Batch ID and status

### Celery Task Concepts

**Shared Tasks**
The `@shared_task` decorator creates tasks that can be used by any Django app. This is preferred over app-specific tasks in reusable applications.

**Task Binding**
`bind=True` passes the task instance as the first parameter (self). This allows access to task metadata like task ID, request info, and methods like update_state() and retry().

**Rate Limiting**
The `rate_limit` parameter controls how many task executions per time period are allowed. '10/s' means 10 tasks per second. This prevents overwhelming external services like SMTP servers.

**Time Limits**
`soft_time_limit` raises an exception in the task when exceeded, allowing graceful cleanup. `time_limit` hard-kills the task. Always set soft limit lower than hard limit.

### Bulk Processing Strategy

**Memory Management**
Loading all payslips at once could consume excessive memory. Use queryset.iterator() to fetch records in batches from the database, processing one at a time.

**Parallelization**
Instead of sending emails sequentially, consider using Celery's group() or chord() primitives to send multiple emails in parallel while respecting rate limits.

**Checkpointing**
For very large batches, periodically save progress (counts, last processed ID) so the task can resume if interrupted rather than starting over.

**Idempotency**
If the task is retried, it should produce the same result. Skip payslips where email_sent=True to avoid duplicate emails on retry.

### Progress Reporting

**update_state Method**
Celery's `update_state()` allows tasks to report custom status and metadata. The UI can poll task status to show progress bars or real-time updates.

**State Format**
Pass state='PROGRESS' and meta with keys like 'current', 'total', 'percent', 'sent', 'failed'. The frontend can display this in a user-friendly format.

**Polling Frequency**
Update state periodically (every 10-100 records) rather than on every iteration. Too-frequent updates create unnecessary database and network overhead.

### Error Handling Strategy

**Continue on Error**
If one email fails, the task should continue processing remaining emails. Collect errors in a list and report them at the end rather than failing the entire batch.

**Error Recording**
Store detailed error information (payslip ID, employee name, error message, timestamp) in the batch's error_log field for later review and retry.

**Partial Success**
A batch can be partially successful (some emails sent, some failed). Report both success and failure counts. Consider a batch successful if >95% of emails were sent.

### Expected Outcome
- Celery task for bulk email sending
- Rate limiting applied
- Progress reporting implemented
- Error handling without task failure
- Batch status updates working
- Summary results returned

### Verification Checklist
- [ ] Celery task file created
- [ ] `send_bulk_payslip_emails` task defined
- [ ] Task configuration with rate limit
- [ ] Tenant schema context switching
- [ ] Batch status updates (sending, completed)
- [ ] Iterator for memory-efficient processing
- [ ] Progress reporting with update_state
- [ ] Individual error handling
- [ ] Success and failure counting
- [ ] Result summary dictionary returned

---

## Task 62: Email Throttling

### Overview
Implement comprehensive rate limiting and throttling mechanisms to prevent overloading SMTP servers, avoid being flagged as spam, and ensure reliable email delivery. This includes Celery-level rate limiting, connection pooling, and adaptive throttling based on server responses.

### Dependencies
- Celery task infrastructure
- Django email backend
- Redis for rate limit storage
- SMTP server connection

### Instructions

1. **Configure Celery rate limiting**
   - Set task-level rate limit: `rate_limit='10/s'`
   - Means 10 task executions per second maximum
   - Celery enforces this automatically
   - Adjust based on SMTP server limits

2. **Add worker-level rate limiting**
   - Configure CELERY_TASK_ROUTES for email tasks
   - Dedicate specific queue to email tasks
   - Limit worker concurrency for email queue
   - Set CELERYD_PREFETCH_MULTIPLIER=1 for email queue

3. **Implement connection pooling**
   - Create custom email backend if needed
   - Maintain pool of SMTP connections
   - Reuse connections across emails
   - Close idle connections after timeout

4. **Add per-tenant rate limiting**
   - Track emails sent per tenant per minute
   - Use Redis counters with TTL
   - Key format: `email_rate:{tenant_id}:{minute}`
   - Enforce tenant-specific limits

5. **Create throttle decorator**
   - Decorator: `@throttle_emails(max_per_second=10)`
   - Check rate before allowing execution
   - Sleep if rate limit would be exceeded
   - Log throttling events

6. **Implement adaptive throttling**
   - Monitor SMTP server responses
   - Detect rate limit errors (450, 451 codes)
   - Automatically reduce sending rate
   - Gradually increase after successful sends

7. **Add burst allowance**
   - Allow short bursts above base rate
   - Token bucket algorithm
   - Refill tokens over time
   - Consume tokens for each email

8. **Create monitoring metrics**
   - Track emails sent per second
   - Count throttling events
   - Measure SMTP response times
   - Alert on sustained throttling

### Rate Limiting Strategies

**Task-Level Rate Limiting**
Celery's rate_limit parameter controls how often a task can be executed. This is the simplest form of rate limiting and works well for straightforward scenarios.

**Queue-Level Rate Limiting**
Route email tasks to a dedicated queue and limit the number of workers processing that queue. This provides coarser control but is easier to manage.

**Application-Level Rate Limiting**
Use Redis or another fast storage to track execution rates. Before sending an email, check and increment the counter. This allows more sophisticated rate limiting algorithms.

**Adaptive Rate Limiting**
Monitor server responses and automatically adjust sending rate based on errors or slow responses. This prevents hitting hard limits that could cause blocking.

### Token Bucket Algorithm

**Concept**
Imagine a bucket that holds tokens. Each email requires one token. Tokens are added to the bucket at a steady rate (e.g., 10/second). The bucket has a maximum capacity (e.g., 50 tokens).

**Burst Handling**
If no emails are sent for a while, the bucket fills up. This allows sending a burst of emails up to the bucket capacity. This is more flexible than strict rate limiting.

**Implementation**
Store bucket state in Redis: current token count and last refill time. On each send attempt, calculate tokens to add based on elapsed time, check if enough tokens exist, consume a token if available.

**Configuration**
Set refill rate (tokens per second) and bucket capacity. A rate of 10/s with capacity 50 allows sustained 10/s rate with bursts up to 50 emails.

### SMTP Server Limits

**Common Limits**
Most SMTP services have rate limits: Gmail allows 100-500 per day for personal accounts, SendGrid tiers range from 100/day to unlimited, AWS SES has default limit of 14/second.

**Quota Types**
Some servers limit per second, others per minute, hour, or day. Some limit total recipients (not messages). Understand your SMTP provider's specific limits.

**Soft vs Hard Limits**
Soft limits trigger warnings or temporary deferrals. Hard limits cause rejections. Stay below soft limits to maintain good reputation and deliverability.

**Response Codes**
SMTP error codes indicate rate limiting: 450 (try again), 451 (local error), 452 (insufficient storage), 550 (rejection). Code 421 means service unavailable, often due to rate limiting.

### Connection Pooling

**Why Pool Connections**
Opening a new SMTP connection for each email is expensive: TCP handshake, TLS negotiation, authentication. Reusing connections improves throughput significantly.

**Django Email Backend**
Django's default email backend opens a new connection per email. Create a custom backend that maintains a connection pool using libraries like smtplib with thread-local storage.

**Connection Lifecycle**
Open connection when first needed, reuse for subsequent emails, close after idle timeout or after maximum emails sent. Handle connection failures and reconnection automatically.

**Thread Safety**
In Celery with multiple workers, each worker should have its own connection pool. Don't share SMTP connections across processes or threads without proper synchronization.

### Expected Outcome
- Rate limiting preventing server overload
- Celery-level throttling configured
- Connection pooling for efficiency
- Adaptive throttling based on responses
- Per-tenant rate limits enforced
- Monitoring metrics available

### Verification Checklist
- [ ] Celery rate_limit set on task
- [ ] Dedicated queue for email tasks
- [ ] Worker concurrency limited
- [ ] Connection pooling implemented
- [ ] Per-tenant rate tracking in Redis
- [ ] Throttle decorator created
- [ ] Adaptive throttling for SMTP errors
- [ ] Token bucket algorithm implemented
- [ ] Monitoring metrics defined
- [ ] Rate limit alerts configured

---

## Task 63: Email Status Tracking

### Overview
Implement comprehensive status tracking for payslip email delivery, including sent/failed flags, timestamps, recipient addresses, and integration with the payslip and batch models. This tracking enables reporting, troubleshooting, and ensures audit trails for email communications.

### Dependencies
- Payslip model with email fields
- BulkPayslipBatch model
- PayslipEmailer service
- Timezone handling

### Instructions

1. **Review payslip email fields**
   - Confirm `email_sent` BooleanField exists
   - Confirm `sent_at` DateTimeField exists
   - Confirm `sent_to` EmailField exists
   - Confirm `email_error` TextField exists

2. **Create status update method**
   - Method: `update_email_status(payslip, success, error=None)`
   - Location: PayslipEmailer service or model method
   - Update fields based on success/failure
   - Use update_fields for efficiency

3. **Handle successful send**
   - Set `email_sent = True`
   - Set `sent_at = timezone.now()`
   - Set `sent_to` to employee's work_email
   - Clear `email_error` field
   - Save with update_fields

4. **Handle failed send**
   - Set `email_sent = False`
   - Set `sent_at = None`
   - Set `sent_to = None`
   - Set `email_error` to error message
   - Truncate error if too long
   - Save with update_fields

5. **Add batch-level tracking**
   - Increment `batch.emails_sent_count` on success
   - Increment `batch.emails_failed_count` on failure
   - Append failure details to `batch.error_log`
   - Use F() expressions for atomic increments

6. **Create status query methods**
   - Method: `get_sent_payslips(batch)`
   - Method: `get_unsent_payslips(batch)`
   - Method: `get_failed_payslips(batch)`
   - Use QuerySet filters for efficiency

7. **Implement retry tracking**
   - Add `email_retry_count` field (IntegerField)
   - Increment on each retry attempt
   - Add `last_retry_at` DateTimeField
   - Max retries check before sending

8. **Create status display helpers**
   - Method: `get_email_status_display(payslip)`
   - Return: "Sent", "Failed", "Pending", "Retrying"
   - Use for UI display
   - Consider internationalization

9. **Add email history logging**
   - Create EmailLog model (optional)
   - Store: payslip, timestamp, success, recipient, error
   - Useful for detailed audit trail
   - Query for troubleshooting

### Status Field Design

**Boolean vs Status Enum**
Using a boolean `email_sent` flag is simple but limited. Consider adding a status field with values: PENDING, SENDING, SENT, FAILED, RETRY. This provides more granular state tracking.

**Timestamp Fields**
Store both attempt time and success time. `last_attempt_at` records when sending was tried. `sent_at` records when it succeeded. This helps identify stuck emails.

**Recipient Tracking**
Store the actual email address used for sending. If an employee changes their email after the payslip is generated, you can still see where the email was sent.

**Error Messages**
Store detailed error messages for troubleshooting. Truncate very long errors to prevent database bloat. Include error codes if available from SMTP server.

### Atomic Updates

**F() Expressions**
Django's F() expressions allow atomic database operations. `batch.emails_sent_count = F('emails_sent_count') + 1` increments the counter without race conditions.

**update_fields Parameter**
When calling save(), specify update_fields to only update changed fields. This reduces database locking and prevents overwriting concurrent changes to other fields.

**select_for_update**
For critical status updates, use select_for_update() to lock the record during the operation. This prevents concurrent updates that could cause inconsistent state.

**Transaction Isolation**
Consider database transaction isolation levels. Repeatable read or serializable isolation may be necessary for accurate counting in high-concurrency scenarios.

### Batch Status Aggregation

**Counting Strategies**
Maintain counters on the batch record (emails_sent_count) for quick access. Alternatively, count records in real-time with aggregation queries. Counters are faster but require careful maintenance.

**Error Logs**
Store error details as JSON in a TextField or in a separate EmailError model. JSON allows structured storage of multiple errors with timestamps and details.

**Status Percentages**
Calculate percentage sent, failed, pending for progress displays. Cache these calculations if batches are large to avoid repeated aggregation queries.

### Expected Outcome
- Email status tracking on payslips
- Successful send updates all fields
- Failed send records error message
- Batch counters updated atomically
- Query methods for status filtering
- Retry tracking implemented

### Verification Checklist
- [ ] Payslip email fields confirmed
- [ ] Status update method implemented
- [ ] Success handling sets correct fields
- [ ] Failure handling stores error message
- [ ] Batch counters incremented with F()
- [ ] Query methods for status filtering
- [ ] Retry count tracking added
- [ ] Status display helpers created
- [ ] update_fields used for efficiency
- [ ] Timezone-aware timestamps used

---

## Task 64: Email Failure Handling

### Overview
Implement comprehensive error handling for email sending failures, including logging, retry mechanisms, bounce handling, and notification of persistent failures. This ensures maximum email deliverability while handling various failure scenarios gracefully.

### Dependencies
- PayslipEmailer service
- Celery retry functionality
- Logging infrastructure
- Email status tracking (Task 63)

### Instructions

1. **Create error handling framework**
   - Define exception classes for email errors
   - `EmailValidationError` for invalid data
   - `EmailSendError` for SMTP failures
   - `EmailAttachmentError` for PDF issues

2. **Implement try-catch blocks**
   - Wrap email sending in try-except
   - Catch specific exceptions first
   - Catch general exceptions last
   - Always log caught exceptions

3. **Handle validation failures**
   - Catch EmailValidationError
   - Log validation failure details
   - Update payslip with error message
   - Don't retry validation failures
   - Mark as permanently failed

4. **Handle SMTP failures**
   - Catch SMTPException and subclasses
   - Parse SMTP error codes
   - Categorize as temporary or permanent
   - Temporary: 4xx codes (retry)
   - Permanent: 5xx codes (don't retry)

5. **Implement retry logic**
   - Use Celery's retry mechanism
   - Decorator: `@task(bind=True, autoretry_for=(SMTPException,))`
   - Set `retry_kwargs={'max_retries': 3}`
   - Set `retry_backoff=True` for exponential delay
   - Set `retry_backoff_max=600` (10 minutes max)

6. **Create manual retry function**
   - Function: `retry_failed_emails(batch_id)`
   - Query failed payslips in batch
   - Check retry count < max
   - Schedule send_single task for each
   - Update retry timestamps

7. **Implement bounce handling**
   - Listen for bounce notifications (if supported)
   - Parse bounce messages
   - Update email_error with bounce reason
   - Mark employee email as invalid
   - Notify HR of bounced emails

8. **Add error logging**
   - Log to Django logger with ERROR level
   - Include: payslip ID, employee, error type
   - Include: full traceback for debugging
   - Include: SMTP server response if available

9. **Create error notification system**
   - Notify HR after max retries exhausted
   - Email or in-app notification
   - Include: batch ID, failed count
   - Provide retry or investigate action

10. **Handle attachment failures**
    - Catch errors during PDF generation
    - Log PDF generation errors separately
    - Consider sending email without attachment
    - Or mark as failed and require manual send

11. **Implement circuit breaker**
    - Track consecutive failures per tenant
    - If failures exceed threshold, stop sending
    - Notify administrators of circuit break
    - Prevent wasting resources on broken config

### Exception Hierarchy

**Built-in Email Exceptions**
Python's smtplib provides several exception classes: SMTPException (base), SMTPAuthenticationError, SMTPServerDisconnected, SMTPRecipientsRefused, SMTPDataError, SMTPConnectError.

**Custom Exceptions**
Define custom exceptions for application-specific errors: EmailValidationError (invalid payslip data), EmailAttachmentError (PDF generation failed), EmailConfigurationError (SMTP not configured).

**Exception Handling Order**
Catch specific exceptions before general ones. Handle SMTPAuthenticationError differently from general SMTPException. The most specific handler should come first in the try-except chain.

### Retry Strategies

**Exponential Backoff**
After a failure, wait before retrying. Each subsequent retry waits longer: 1 min, 2 min, 4 min, 8 min. This gives temporary problems time to resolve without overwhelming the server.

**Maximum Retries**
Limit retry attempts to prevent infinite loops. Three retries is typical: initial attempt plus three retries = four total attempts. After max retries, mark as permanently failed.

**Retry Conditions**
Only retry temporary failures (4xx SMTP codes, connection timeouts, server unavailable). Don't retry permanent failures (5xx codes, invalid recipient, authentication failure).

**Celery Auto-Retry**
Celery's autoretry_for parameter automatically retries tasks when specified exceptions are raised. Set retry_kwargs to control max attempts and backoff behavior.

### SMTP Error Codes

**2xx Codes**
Success codes (rarely seen in exceptions): 200 (help), 211 (status), 220 (ready), 250 (OK), 251 (forwarded).

**4xx Codes**
Temporary failures, should retry: 421 (service unavailable), 450 (mailbox unavailable), 451 (local error), 452 (insufficient storage).

**5xx Codes**
Permanent failures, should not retry: 500 (syntax error), 501 (syntax in parameters), 550 (mailbox unavailable), 551 (user not local), 552 (storage exceeded), 553 (mailbox name invalid).

**Custom Handling**
Parse the numeric code from the SMTP exception message. Use a mapping dictionary to determine whether to retry based on the code.

### Bounce Handling

**What Are Bounces**
Bounces occur when an email cannot be delivered. Hard bounces (permanent) indicate invalid addresses. Soft bounces (temporary) indicate full mailboxes or server issues.

**Bounce Notifications**
Some SMTP services send bounce notifications to a special address or via webhooks. Configure bounce handling address in SMTP settings. Parse bounce messages to extract reason and recipient.

**Email Validation**
After multiple bounces, mark the email address as invalid in the employee record. Prevent future emails to invalid addresses. Notify HR to update employee contact information.

**Feedback Loops**
Major email providers offer feedback loops where spam complaints are reported. Subscribe to these loops to identify emails marked as spam and prevent future sends to those users.

### Circuit Breaker Pattern

**Purpose**
If SMTP configuration is broken (wrong password, blocked IP, invalid domain), continuing to attempt sends wastes resources and may worsen the problem (rate limiting, IP reputation).

**Implementation**
Track consecutive failures in Redis. Key: `email_circuit:{tenant_id}`, value: failure count. If count exceeds threshold (e.g., 10), set circuit to "open" for a cooldown period.

**Open Circuit**
When circuit is open, immediately fail all send attempts without trying. Return error message indicating circuit is open. Notify administrators to fix the problem.

**Half-Open and Reset**
After cooldown period, allow one test send (half-open state). If successful, reset counter and close circuit. If failed, reopen circuit for longer cooldown.

### Expected Outcome
- Comprehensive error handling for all failure types
- Retry mechanism with exponential backoff
- Bounce handling updating email validity
- Error logging for troubleshooting
- Notification system for persistent failures
- Circuit breaker preventing resource waste

### Verification Checklist
- [ ] Custom exception classes defined
- [ ] Try-catch blocks around all email operations
- [ ] Validation failures handled without retry
- [ ] SMTP error codes parsed and categorized
- [ ] Celery retry with exponential backoff
- [ ] Manual retry function for failed emails
- [ ] Bounce handling updates email validity
- [ ] Comprehensive error logging
- [ ] Notification system for HR on failures
- [ ] Attachment failure handling
- [ ] Circuit breaker pattern implemented
- [ ] Max retry limit enforced

---

## Summary

This document has covered the complete email distribution system for payslips, including:

**Email Templates (Task 57)**
HTML and plain-text email templates with template variables, inline CSS for email client compatibility, and professional branding.

**Subject Configuration (Task 58)**
Tenant-customizable email subject templates with variable substitution, validation, and security measures to prevent header injection.

**PayslipEmailer Service (Task 59)**
Core service class managing email composition, PDF attachment, SMTP connections, and status updates with clean separation of concerns.

**Single Email Sending (Task 60)**
Method to send individual payslip emails with complete validation, error handling, and status tracking.

**Bulk Email Task (Task 61)**
Celery task for batch email sending with progress reporting, memory-efficient iteration, and error resilience.

**Email Throttling (Task 62)**
Comprehensive rate limiting using Celery, connection pooling, adaptive throttling, and token bucket algorithms to prevent server overload.

**Status Tracking (Task 63)**
Detailed tracking of email status on payslips and batches with atomic updates and query methods.

**Failure Handling (Task 64)**
Robust error handling with retry mechanisms, bounce handling, circuit breakers, and notifications for persistent failures.

### Key Concepts Covered

- SMTP configuration and authentication
- HTML email design for compatibility
- Template variable substitution
- Rate limiting and throttling strategies
- Celery task configuration and retry
- Error categorization (temporary vs permanent)
- Circuit breaker pattern
- Bounce handling and email validation
- Connection pooling for performance
- Atomic database updates

### Integration Points

This email distribution system integrates with:
- Payslip generation (previous Group C)
- Bulk batch processing (previous Group D Task 49-56)
- PDF generation service
- Employee management for email addresses
- Tenant settings for SMTP and branding
- Celery task queue infrastructure

The system provides reliable, scalable email delivery for payslips while handling various failure scenarios and maintaining detailed audit trails.

---

**End of Document 02 - Email Distribution System**
