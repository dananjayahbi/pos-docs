# Tasks 87-92: Report Scheduler, Testing & Documentation

> **Phase:** 06 - ERP Advanced Modules  
> **SubPhase:** 11 - Financial Reports  
> **Group:** F - Export, Testing & Documentation  
> **Document:** 02 of 02  
> **Tasks Covered:** 87, 88, 89, 90, 91, 92

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [01_Tasks-81-86_Excel-Export.md](01_Tasks-81-86_Excel-Export.md)
- **→ Next Group:** None (Last Group) | **Next SubPhase:** [SubPhase-12_Tax-Reporting](../../SubPhase-12_Tax-Reporting/)

---

## Document Overview

This document completes the financial reports module by implementing automated report scheduling via Celery, email delivery functionality, comprehensive REST API endpoints through ViewSets, URL routing configuration, extensive unit testing, and complete API documentation. These elements provide production-ready automation, reliable testing coverage, and clear API specifications for report consumers.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 87 | Create Report Scheduler | High | 1 hour |
| 88 | Add Email Report Method | Medium | 30 min |
| 89 | Create Report ViewSet | Medium | 45 min |
| 90 | Add Report URL Routes | Low | 15 min |
| 91 | Write Report Generator Tests | High | 1.5 hours |
| 92 | Create Report API Documentation | Medium | 45 min |

---

## Task 87: Create Report Scheduler

### Overview
Create a Celery task for automated report generation and distribution. This scheduler enables periodic generation of financial reports (Trial Balance, Profit & Loss, Balance Sheet, etc.) with configurable frequency, recipients, and output formats. Supports Sri Lankan business hours and Asia/Colombo timezone.

### Dependencies
- Task 86: Add GL Excel Export
- Celery configured in project
- All report generators implemented
- Email backend configured
- Django timezone support

### Instructions

1. **Open tasks.py file**
   - Navigate to `apps/accounting/tasks.py`
   - Prepare to add report scheduling task

2. **Import required modules**
   - Import Celery shared_task decorator
   - Import report generator classes
   - Import exporter classes (PDF, Excel)
   - Import Django email utilities
   - Import timezone utilities for Asia/Colombo
   - Import logging for task monitoring

3. **Define ScheduleConfig dataclass**
   - Create dataclass to hold schedule configuration
   - Fields: report_type, frequency, recipients, format
   - Fields: include_comparison, detail_level
   - Fields: day_of_month, day_of_week, time_of_day
   - Add validation method for configuration

4. **Create generate_scheduled_report task**
   - Use @shared_task decorator
   - Parameters: tenant_id, config_dict
   - Returns: task result with status and details
   - Set task name: 'accounting.generate_scheduled_report'

5. **Add tenant activation logic**
   - Set tenant context using tenant_id
   - Ensure proper schema routing
   - Handle tenant not found scenario

6. **Determine report date range**
   - Based on frequency (daily, weekly, monthly, quarterly)
   - Calculate start_date and end_date
   - Use Asia/Colombo timezone for date calculations
   - Handle month-end scenarios for monthly reports

7. **Instantiate report generator**
   - Map report_type to generator class
   - Create generator with date parameters
   - Pass include_comparison and detail_level
   - Handle invalid report_type

8. **Generate report data**
   - Call generator's generate_report method
   - Handle generation errors
   - Log generation success/failure
   - Measure generation time

9. **Create export based on format**
   - If format='pdf', use PDFExporter
   - If format='excel', use ExcelExporter
   - Generate file in memory
   - Set appropriate filename with date

10. **Trigger email delivery**
    - Call send_scheduled_report_email helper
    - Pass report file, recipients, report metadata
    - Handle email delivery errors
    - Log email send status

11. **Add error handling**
    - Try-except around entire task
    - Catch specific exceptions (GeneratorError, ExportError)
    - Log errors with full traceback
    - Return error status in task result

12. **Create frequency calculation helper**
    - Function: calculate_report_period(frequency)
    - Returns: (start_date, end_date) tuple
    - Handles: 'daily', 'weekly', 'monthly', 'quarterly', 'yearly'
    - Respects Sri Lankan fiscal periods

13. **Add scheduling time recommendations**
    - Document recommended times for each frequency
    - Consider Sri Lankan business hours (9 AM - 6 PM)
    - Avoid generating during peak transaction times
    - Suggest early morning (2 AM - 4 AM) for heavy reports

### Report Scheduler Architecture

```
┌─────────────────────────────────────────────────────────┐
│            Report Scheduler Flow                        │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  1. Celery Beat → Triggers Task                        │
│           │                                             │
│           ▼                                             │
│  2. generate_scheduled_report                           │
│           │                                             │
│           ├─→ Activate tenant context                   │
│           ├─→ Calculate date range                      │
│           ├─→ Instantiate generator                     │
│           ├─→ Generate report data                      │
│           ├─→ Create export (PDF/Excel)                 │
│           └─→ Send email                                │
│                     │                                   │
│                     ▼                                   │
│  3. Recipient receives report via email                 │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### Schedule Configuration Schema

```
{
  "report_type": "profit_loss",          // Required
  "frequency": "monthly",                // Required: daily/weekly/monthly/quarterly/yearly
  "recipients": [                        // Required: email addresses
    "cfo@lankacommerce.lk",
    "accounts@lankacommerce.lk"
  ],
  "format": "pdf",                       // Required: pdf/excel
  "include_comparison": true,            // Optional: default false
  "comparison_period": "prior_year",     // Optional: prior_period/prior_year
  "detail_level": "summary",             // Optional: summary/detail
  "day_of_month": 5,                     // For monthly: 1-31
  "day_of_week": 1,                      // For weekly: 0=Monday, 6=Sunday
  "time_of_day": "03:00"                 // Time in HH:MM format (24-hour)
}
```

### Frequency and Date Range Calculation

| Frequency | Date Range Calculation | Example Execution | Report Period |
|-----------|----------------------|-------------------|---------------|
| Daily | Previous day | Every day at 3 AM | Yesterday |
| Weekly | Previous week (Mon-Sun) | Every Monday at 3 AM | Last week |
| Monthly | Previous month | 5th of month at 3 AM | Last month |
| Quarterly | Previous quarter | 5th day of Q2/Q3/Q4/Q1 | Last quarter |
| Yearly | Previous fiscal year | April 5th at 3 AM | Last fiscal year |

### Sri Lankan Business Hours Considerations

```
Business Hours: 9:00 AM - 6:00 PM (Asia/Colombo)
═══════════════════════════════════════════════

Recommended Scheduling Times:
├── Light Reports (TB):        2:00 AM - 4:00 AM
├── Medium Reports (P&L, BS):  3:00 AM - 4:00 AM
├── Heavy Reports (GL):        1:00 AM - 2:00 AM
└── All Reports (Daily batch): 3:00 AM

Peak Hours to Avoid:
├── Morning Rush:   9:00 AM - 11:00 AM
├── Lunch Period:  12:00 PM -  1:00 PM
└── Closing Time:   5:00 PM -  6:00 PM

Timezone: Asia/Colombo (UTC+5:30)
```

### Date Range Calculation Examples

#### Monthly Report (Run on 5th of month)
```
Execution Date: January 5, 2026
Report Period: December 1, 2025 - December 31, 2025
Filename: profit_loss_2025_12.pdf

Execution Date: February 5, 2026
Report Period: January 1, 2026 - January 31, 2026
Filename: profit_loss_2026_01.pdf
```

#### Weekly Report (Run every Monday)
```
Execution Date: Monday, January 27, 2026
Report Period: January 20, 2026 - January 26, 2026
Filename: balance_sheet_week_04_2026.pdf

Execution Date: Monday, February 3, 2026
Report Period: January 27, 2026 - February 2, 2026
Filename: balance_sheet_week_05_2026.pdf
```

#### Quarterly Report (Run on 5th day of next quarter)
```
Execution Date: April 5, 2026 (Q2 starts)
Report Period: Q1 2026 (Jan 1 - Mar 31)
Filename: profit_loss_Q1_2026.pdf

Execution Date: July 5, 2026 (Q3 starts)
Report Period: Q2 2026 (Apr 1 - Jun 30)
Filename: profit_loss_Q2_2026.pdf
```

### Task Result Structure

```python
# Success Result
{
  "status": "success",
  "report_type": "profit_loss",
  "period": "2025-12-01 to 2025-12-31",
  "format": "pdf",
  "generation_time": 2.5,  # seconds
  "file_size": 45678,      # bytes
  "recipients": ["cfo@lankacommerce.lk"],
  "email_sent": true,
  "timestamp": "2026-01-05T03:00:00+05:30"
}

# Error Result
{
  "status": "error",
  "error_type": "GeneratorError",
  "error_message": "Insufficient data for report generation",
  "report_type": "profit_loss",
  "timestamp": "2026-01-05T03:00:00+05:30"
}
```

### Celery Beat Schedule Configuration

```python
# In settings/base.py or celery.py
CELERY_BEAT_SCHEDULE = {
    'monthly-pl-report': {
        'task': 'accounting.generate_scheduled_report',
        'schedule': crontab(day_of_month='5', hour=3, minute=0),
        'kwargs': {
            'config_dict': {
                'report_type': 'profit_loss',
                'frequency': 'monthly',
                'recipients': ['cfo@lankacommerce.lk'],
                'format': 'pdf',
                'include_comparison': True
            }
        }
    },
    'weekly-bs-report': {
        'task': 'accounting.generate_scheduled_report',
        'schedule': crontab(day_of_week='1', hour=3, minute=0),
        'kwargs': {
            'config_dict': {
                'report_type': 'balance_sheet',
                'frequency': 'weekly',
                'recipients': ['manager@lankacommerce.lk'],
                'format': 'excel'
            }
        }
    }
}
```

### Error Handling Scenarios

| Error Type | Handling Strategy | User Impact |
|------------|------------------|-------------|
| Tenant not found | Log error, send admin alert | Report skipped |
| Invalid report_type | Log error, notify recipients | Error email sent |
| No data for period | Generate empty report with note | Report sent with message |
| Export generation fails | Retry once, then log | Admin notified |
| Email delivery fails | Retry 3 times, then log | Admin notified |

### Expected Outcome
- Functional automated report scheduling
- Timezone-aware date calculations
- Multiple frequency support
- Error handling and logging
- Email delivery integration

### Verification Checklist
- [ ] tasks.py file updated
- [ ] ScheduleConfig dataclass defined
- [ ] generate_scheduled_report task created
- [ ] @shared_task decorator applied
- [ ] Tenant activation logic implemented
- [ ] Date range calculation for all frequencies
- [ ] Report generator instantiation
- [ ] Export generation (PDF/Excel)
- [ ] Email delivery trigger
- [ ] Error handling and logging
- [ ] Asia/Colombo timezone used
- [ ] Task result structure defined

---

## Task 88: Add Email Report Method

### Overview
Create email delivery functionality for scheduled reports. This method sends generated reports as attachments to specified recipients with professional email templates, proper MIME types, and Sri Lankan business context (SLT email compatibility, professional formatting).

### Dependencies
- Task 87: Create Report Scheduler
- Django email backend configured
- Email templates exist
- SMTP settings configured

### Instructions

1. **Create emails directory**
   - Navigate to `apps/accounting/`
   - Create `emails/` directory
   - Create `__init__.py` in emails/

2. **Create report_email.py module**
   - Create file at `apps/accounting/emails/report_email.py`
   - This will contain email sending logic

3. **Import required modules**
   - Import Django EmailMessage
   - Import email template rendering utilities
   - Import MIME type utilities
   - Import settings for email configuration
   - Import logging

4. **Create send_scheduled_report_email function**
   - Parameters: report_file, report_metadata, recipients
   - Returns: bool (success/failure)
   - Handles email composition and sending

5. **Extract report metadata**
   - Get report_type, period, format
   - Get generation_time, file_size
   - Get include_comparison flag
   - Get tenant information

6. **Create email subject**
   - Format: "[LankaCommerce] Profit & Loss Report - December 2025"
   - Include report type and period
   - Add tenant name if multi-tenant
   - Keep subject clear and professional

7. **Render email body**
   - Use HTML template for professional look
   - Include report summary information
   - Add period details and comparison info
   - Include generation timestamp
   - Add contact information for queries

8. **Attach report file**
   - Set appropriate filename
   - Determine MIME type (application/pdf or application/vnd.openxmlformats-officedocument.spreadsheetml.sheet)
   - Attach file to EmailMessage
   - Set content disposition to attachment

9. **Set email headers**
   - From: settings.DEFAULT_FROM_EMAIL
   - Reply-To: settings.REPORTS_REPLY_TO_EMAIL
   - To: recipients list
   - Priority: Normal (not urgent)

10. **Handle SLT email considerations**
    - Add note about file size for slow connections
    - Ensure attachment size under 10MB recommended
    - Add alternative download link if file is large
    - Consider SLT email client compatibility

11. **Send email and handle errors**
    - Call EmailMessage.send()
    - Catch SMTPException
    - Log send success/failure
    - Retry on transient errors

12. **Create email template**
    - Create `templates/accounting/emails/scheduled_report.html`
    - Professional HTML layout
    - Responsive design
    - Clear call-to-action (open attachment)

13. **Add plain text alternative**
    - Create plain text version for compatibility
    - Some email clients prefer plain text
    - Ensures delivery even with HTML disabled

### Email Structure

```
┌──────────────────────────────────────────────────────┐
│  From: LankaCommerce Reports <reports@system.lk>    │
│  To: cfo@lankacommerce.lk                            │
│  Subject: [LankaCommerce] P&L Report - Dec 2025     │
│  Attachment: profit_loss_2025_12.pdf (234 KB)       │
├──────────────────────────────────────────────────────┤
│                                                      │
│  [LOGO or Banner]                                    │
│                                                      │
│  Hello,                                              │
│                                                      │
│  Your scheduled Profit & Loss Report is ready.      │
│                                                      │
│  Report Details:                                     │
│  • Period: December 1 - 31, 2025                     │
│  • Type: Profit & Loss Statement                     │
│  • Format: PDF                                       │
│  • Includes Comparison: Yes (Prior Year)             │
│  • Generated: Jan 5, 2026 at 3:00 AM                 │
│                                                      │
│  Please find the attached report.                    │
│                                                      │
│  [Download Button/Link]                              │
│                                                      │
│  Questions? Contact support@lankacommerce.lk         │
│                                                      │
│  ---                                                 │
│  LankaCommerce Accounting System                     │
│  Automated Report Service                            │
│                                                      │
└──────────────────────────────────────────────────────┘
```

### Email Template Content

#### Subject Line Examples

| Report Type | Subject Line |
|------------|--------------|
| Trial Balance | "[LankaCommerce] Trial Balance - As of Dec 31, 2025" |
| Profit & Loss | "[LankaCommerce] Profit & Loss Report - December 2025" |
| Balance Sheet | "[LankaCommerce] Balance Sheet - As of Dec 31, 2025" |
| Cash Flow | "[LankaCommerce] Cash Flow Statement - Q4 2025" |
| General Ledger | "[LankaCommerce] General Ledger Report - December 2025" |

#### Email Body Sections

```
1. Greeting
   └── "Hello," or "Dear [Name]," if personalized

2. Report Ready Message
   └── Clear statement that report is ready
   └── Report type emphasized

3. Report Details Table
   ├── Period/Date Range
   ├── Report Type
   ├── Format (PDF/Excel)
   ├── Comparison Included (Yes/No)
   ├── Detail Level (Summary/Detail)
   └── Generation Timestamp

4. Attachment Information
   ├── File name
   ├── File size
   └── Note about opening attachments

5. Call to Action
   └── "Please find the attached report"
   └── Optional: Download link if file > 5MB

6. Support Contact
   └── Email for questions
   └── Phone number (optional)

7. Footer
   ├── System name
   ├── Automated message notice
   └── Unsubscribe link (if required)
```

### SLT Email Considerations

```
Sri Lanka Telecom (SLT) Email Compatibility
════════════════════════════════════════════

Challenges:
├── Slow connections in some areas
├── Attachment size limits (varies by provider)
├── Webmail clients (SLT.lk) may have restrictions
└── Corporate email servers may filter large files

Best Practices:
├── Keep attachments under 5MB when possible
├── For larger files, provide download link
├── Use standard formats (PDF preferred over Excel)
├── Include file size in email body
├── Test with SLT webmail and Outlook
└── Add plain text version for compatibility

Recommended Email Sizes:
├── Optimal: < 2MB (fast delivery)
├── Acceptable: 2-5MB (good delivery)
├── Large: 5-10MB (may delay)
└── Avoid: > 10MB (use download link)
```

### MIME Type Mapping

| Format | MIME Type | File Extension |
|--------|-----------|----------------|
| PDF | application/pdf | .pdf |
| Excel | application/vnd.openxmlformats-officedocument.spreadsheetml.sheet | .xlsx |

### Email Configuration Settings

```python
# In settings/base.py
EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
EMAIL_HOST = 'smtp.gmail.com'  # or SLT SMTP server
EMAIL_PORT = 587
EMAIL_USE_TLS = True
EMAIL_HOST_USER = 'reports@lankacommerce.lk'
EMAIL_HOST_PASSWORD = 'secure-password'
DEFAULT_FROM_EMAIL = 'LankaCommerce Reports <reports@lankacommerce.lk>'
REPORTS_REPLY_TO_EMAIL = 'support@lankacommerce.lk'

# For large attachments (optional cloud storage)
REPORT_DOWNLOAD_BASE_URL = 'https://reports.lankacommerce.lk/downloads/'
REPORT_DOWNLOAD_EXPIRY_HOURS = 48  # Link expires after 48 hours
```

### Error Handling

| Error Scenario | Handling | Notification |
|---------------|----------|--------------|
| SMTP connection fails | Retry 3 times with backoff | Admin email |
| Invalid recipient email | Skip recipient, log warning | Admin notification |
| Attachment too large | Create download link instead | Note in email |
| Template rendering error | Use plain text fallback | Log error |
| All send attempts fail | Log critical error | Admin alert |

### HTML Email Template Example Structure

```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <style>
        body { font-family: Arial, sans-serif; }
        .container { max-width: 600px; margin: 0 auto; }
        .header { background: #0066cc; color: white; padding: 20px; }
        .content { padding: 20px; }
        .details-table { width: 100%; border-collapse: collapse; }
        .details-table td { padding: 8px; border-bottom: 1px solid #ddd; }
        .button { background: #0066cc; color: white; padding: 12px 24px; 
                  text-decoration: none; border-radius: 4px; }
        .footer { color: #666; font-size: 12px; padding: 20px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h2>Financial Report Ready</h2>
        </div>
        <div class="content">
            <!-- Email content here -->
        </div>
        <div class="footer">
            <!-- Footer content here -->
        </div>
    </div>
</body>
</html>
```

### Expected Outcome
- Professional email delivery system
- Proper attachment handling
- SLT-compatible formatting
- HTML and plain text versions
- Error handling and logging

### Verification Checklist
- [ ] emails/ directory created
- [ ] report_email.py module created
- [ ] send_scheduled_report_email function defined
- [ ] Email subject formatting implemented
- [ ] HTML email template created
- [ ] Plain text alternative created
- [ ] Report file attachment logic
- [ ] MIME type handling
- [ ] SLT considerations addressed
- [ ] File size checks implemented
- [ ] Error handling added
- [ ] Retry logic for transient errors
- [ ] Logging statements added

---

## Task 89: Create Report ViewSet

### Overview
Create a Django REST Framework ViewSet that provides API endpoints for all financial reports. This ViewSet unifies report generation, export, and scheduling endpoints with proper authentication, permission checking, query parameter validation, and Sri Lankan business context.

### Dependencies
- Task 88: Add Email Report Method
- All report generators implemented
- All exporters implemented
- DRF installed and configured
- Authentication system in place

### Instructions

1. **Create reports.py views module**
   - Navigate to `apps/accounting/views/`
   - Create or open `reports.py` file
   - Prepare for ViewSet definition

2. **Import required modules**
   - Import DRF ViewSet, action decorator
   - Import Response, status from rest_framework
   - Import all report generators
   - Import PDF and Excel exporters
   - Import serializers for request validation
   - Import permission classes

3. **Create ReportViewSet class**
   - Inherit from viewsets.ViewSet
   - Set permission_classes (IsAuthenticated, TenantPermission)
   - Add docstring explaining ViewSet purpose

4. **Add list action (report types)**
   - Endpoint: GET /reports/
   - Returns: list of available report types
   - Response includes: name, description, parameters
   - No authentication required (public info)

5. **Add trial_balance action**
   - Decorator: @action(detail=False, methods=['get'])
   - Endpoint: GET /reports/trial-balance/
   - Query params: as_of_date, include_comparison
   - Returns: Trial Balance data
   - Calls TrialBalanceGenerator

6. **Add profit_loss action**
   - Decorator: @action(detail=False, methods=['get'])
   - Endpoint: GET /reports/profit-loss/
   - Query params: start_date, end_date, include_comparison
   - Returns: Profit & Loss data
   - Calls ProfitLossGenerator

7. **Add balance_sheet action**
   - Decorator: @action(detail=False, methods=['get'])
   - Endpoint: GET /reports/balance-sheet/
   - Query params: as_of_date, include_comparison
   - Returns: Balance Sheet data
   - Calls BalanceSheetGenerator

8. **Add cash_flow action**
   - Decorator: @action(detail=False, methods=['get'])
   - Endpoint: GET /reports/cash-flow/
   - Query params: start_date, end_date, method
   - Returns: Cash Flow Statement data
   - Calls CashFlowGenerator

9. **Add general_ledger action**
   - Decorator: @action(detail=False, methods=['get'])
   - Endpoint: GET /reports/general-ledger/
   - Query params: start_date, end_date, account_ids
   - Returns: General Ledger data
   - Calls GeneralLedgerGenerator

10. **Add export_pdf action**
    - Decorator: @action(detail=False, methods=['get'])
    - Endpoint: GET /reports/{report_type}/export/pdf/
    - URL pattern: /reports/trial-balance/export/pdf/
    - Calls appropriate generator, then PDFExporter
    - Returns: HttpResponse with PDF file

11. **Add export_excel action**
    - Decorator: @action(detail=False, methods=['get'])
    - Endpoint: GET /reports/{report_type}/export/excel/
    - Calls appropriate generator, then ExcelExporter
    - Returns: HttpResponse with Excel file

12. **Add schedule_report action**
    - Decorator: @action(detail=False, methods=['post'])
    - Endpoint: POST /reports/schedule/
    - Request body: schedule configuration
    - Creates Celery Beat schedule entry
    - Returns: schedule confirmation

13. **Create validate_date_range helper**
    - Validates start_date and end_date parameters
    - Ensures start_date <= end_date
    - Parses date strings to date objects
    - Returns tuple or raises ValidationError

14. **Create validate_as_of_date helper**
    - Validates as_of_date parameter
    - Ensures date is not in future
    - Parses date string to date object
    - Returns date or raises ValidationError

15. **Add query parameter validation**
    - Use serializers for parameter validation
    - Provide clear error messages
    - Handle missing required parameters
    - Validate date formats (YYYY-MM-DD)

16. **Add pagination support**
    - For General Ledger (may have many entries)
    - Use DRF's pagination classes
    - Configurable page size
    - Include page metadata in response

17. **Add filtering support**
    - General Ledger: filter by account
    - Profit & Loss: filter by department (future)
    - All reports: filter by date range

18. **Handle Sri Lankan date formats**
    - Support YYYY-MM-DD (ISO) - primary
    - Optionally support DD/MM/YYYY (local format)
    - Always return dates in ISO format
    - Document date format requirements

### ViewSet Structure

```
┌─────────────────────────────────────────────────┐
│           ReportViewSet                         │
├─────────────────────────────────────────────────┤
│ Base Actions:                                   │
│  • list() - List available reports              │
│                                                 │
│ Report Generation Actions:                      │
│  • trial_balance() - Generate TB                │
│  • profit_loss() - Generate P&L                 │
│  • balance_sheet() - Generate BS                │
│  • cash_flow() - Generate CF                    │
│  • general_ledger() - Generate GL               │
│                                                 │
│ Export Actions:                                 │
│  • export_pdf() - Export as PDF                 │
│  • export_excel() - Export as Excel             │
│                                                 │
│ Scheduling Actions:                             │
│  • schedule_report() - Schedule periodic report │
│                                                 │
│ Helper Methods:                                 │
│  • validate_date_range()                        │
│  • validate_as_of_date()                        │
│  • get_generator_class()                        │
└─────────────────────────────────────────────────┘
```

### API Endpoints Summary

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | /api/v1/accounting/reports/ | List report types | No |
| GET | /api/v1/accounting/reports/trial-balance/ | Generate Trial Balance | Yes |
| GET | /api/v1/accounting/reports/profit-loss/ | Generate Profit & Loss | Yes |
| GET | /api/v1/accounting/reports/balance-sheet/ | Generate Balance Sheet | Yes |
| GET | /api/v1/accounting/reports/cash-flow/ | Generate Cash Flow | Yes |
| GET | /api/v1/accounting/reports/general-ledger/ | Generate General Ledger | Yes |
| GET | /api/v1/accounting/reports/trial-balance/export/pdf/ | Export TB as PDF | Yes |
| GET | /api/v1/accounting/reports/trial-balance/export/excel/ | Export TB as Excel | Yes |
| POST | /api/v1/accounting/reports/schedule/ | Schedule report | Yes |

### Query Parameters by Report

#### Trial Balance
```
Required:
- as_of_date: Date (YYYY-MM-DD)

Optional:
- include_comparison: Boolean (default: false)
- comparison_date: Date (YYYY-MM-DD)
- detail_level: String (summary/detail, default: summary)
```

#### Profit & Loss
```
Required:
- start_date: Date (YYYY-MM-DD)
- end_date: Date (YYYY-MM-DD)

Optional:
- include_comparison: Boolean (default: false)
- comparison_period: String (prior_period/prior_year)
- detail_level: String (summary/detail, default: summary)
```

#### Balance Sheet
```
Required:
- as_of_date: Date (YYYY-MM-DD)

Optional:
- include_comparison: Boolean (default: false)
- comparison_date: Date (YYYY-MM-DD)
- format: String (standard/detailed, default: standard)
```

#### Cash Flow
```
Required:
- start_date: Date (YYYY-MM-DD)
- end_date: Date (YYYY-MM-DD)

Optional:
- method: String (direct/indirect, default: indirect)
- include_comparison: Boolean (default: false)
- comparison_period: String (prior_period/prior_year)
```

#### General Ledger
```
Required:
- start_date: Date (YYYY-MM-DD)
- end_date: Date (YYYY-MM-DD)

Optional:
- account_ids: Array of integers
- page: Integer (default: 1)
- page_size: Integer (default: 50)
```

### Response Structure Examples

#### Successful Report Generation
```json
{
  "status": "success",
  "report_type": "profit_loss",
  "metadata": {
    "start_date": "2025-12-01",
    "end_date": "2025-12-31",
    "generated_at": "2026-01-05T03:00:00+05:30",
    "includes_comparison": true,
    "detail_level": "summary"
  },
  "data": {
    "revenue": {
      "current": 1500000.00,
      "comparison": 1200000.00,
      "variance": 300000.00,
      "variance_percentage": 25.0
    },
    "expenses": { /* ... */ },
    "net_income": { /* ... */ }
  }
}
```

#### Error Response
```json
{
  "status": "error",
  "error_code": "INVALID_DATE_RANGE",
  "message": "start_date must be before end_date",
  "details": {
    "start_date": "2025-12-31",
    "end_date": "2025-12-01"
  }
}
```

#### Schedule Confirmation
```json
{
  "status": "scheduled",
  "schedule_id": "sched_abc123",
  "report_type": "profit_loss",
  "frequency": "monthly",
  "next_run": "2026-02-05T03:00:00+05:30",
  "recipients": ["cfo@lankacommerce.lk"]
}
```

### Permission Handling

```
Permission Checks
═════════════════

Authentication:
└── Must be authenticated user

Tenant Access:
└── Must belong to tenant being queried

Report-Specific Permissions:
├── Trial Balance → view_trial_balance
├── Profit & Loss → view_profit_loss
├── Balance Sheet → view_balance_sheet
├── Cash Flow → view_cash_flow
└── General Ledger → view_general_ledger

Admin Permissions:
├── Schedule Reports → schedule_reports
└── Export Reports → export_reports
```

### Date Format Validation

| Input Format | Valid | Parsed As | Example |
|-------------|-------|-----------|---------|
| YYYY-MM-DD | Yes | ISO format | 2025-12-31 |
| DD/MM/YYYY | Optional | Local format | 31/12/2025 |
| MM/DD/YYYY | No | Ambiguous | - |
| DD-MM-YYYY | No | Non-standard | - |

### Sri Lankan Business Context

```
Report Period Considerations
════════════════════════════

Fiscal Year:
- Sri Lankan companies: April 1 - March 31 (most common)
- Calendar year: January 1 - December 31 (some companies)

Common Reporting Periods:
├── Daily: For retail and high-volume businesses
├── Weekly: Monday to Sunday
├── Monthly: Calendar month (1st to last day)
├── Quarterly: Q1 (Jan-Mar), Q2 (Apr-Jun), Q3 (Jul-Sep), Q4 (Oct-Dec)
└── Annually: Full fiscal year

Holidays and Business Days:
- Exclude Poya Days (monthly full moon)
- Exclude Sinhala/Tamil New Year (April 14-15)
- Exclude Independence Day (February 4)
- Consider bank holidays for financial operations
```

### Error Codes

| Code | Description | HTTP Status |
|------|-------------|-------------|
| INVALID_DATE_RANGE | Date range validation failed | 400 |
| MISSING_PARAMETER | Required parameter missing | 400 |
| INVALID_DATE_FORMAT | Date format incorrect | 400 |
| FUTURE_DATE_NOT_ALLOWED | Date is in the future | 400 |
| REPORT_GENERATION_FAILED | Generator error | 500 |
| EXPORT_FAILED | Export process error | 500 |
| PERMISSION_DENIED | Insufficient permissions | 403 |
| TENANT_NOT_FOUND | Tenant does not exist | 404 |

### Expected Outcome
- Complete REST API for all reports
- Consistent endpoint structure
- Proper validation and error handling
- Export functionality integrated
- Permission-based access control

### Verification Checklist
- [ ] reports.py ViewSet file created
- [ ] ReportViewSet class defined
- [ ] Permission classes set
- [ ] list action implemented
- [ ] trial_balance action added
- [ ] profit_loss action added
- [ ] balance_sheet action added
- [ ] cash_flow action added
- [ ] general_ledger action added
- [ ] export_pdf action implemented
- [ ] export_excel action implemented
- [ ] schedule_report action added
- [ ] validate_date_range helper created
- [ ] validate_as_of_date helper created
- [ ] Query parameter validation
- [ ] Error handling for all actions
- [ ] Response structure consistent

---

## Task 90: Add Report URL Routes

### Overview
Register URL routes for the Report ViewSet, making all report endpoints accessible via the API. Configure URL patterns with proper namespace, versioning, and router registration following Django REST Framework best practices.

### Dependencies
- Task 89: Create Report ViewSet
- DRF router configured
- URL versioning strategy defined

### Instructions

1. **Open accounting urls.py**
   - Navigate to `apps/accounting/urls.py`
   - Prepare to register report routes

2. **Import required modules**
   - Import DRF DefaultRouter
   - Import ReportViewSet from views
   - Import Django path/include functions

3. **Create router instance**
   - If router doesn't exist, create DefaultRouter instance
   - If exists, use existing router

4. **Register ReportViewSet**
   - Use router.register()
   - Prefix: 'reports'
   - ViewSet: ReportViewSet
   - Basename: 'report'

5. **Create URL patterns list**
   - Include router.urls
   - Ensure patterns are properly structured

6. **Set app_name**
   - Set app_name = 'accounting'
   - Enables namespaced URL reversal

7. **Update project urls.py**
   - Navigate to main project urls.py
   - Include accounting URLs under API versioning

8. **Add URL versioning**
   - Include under /api/v1/accounting/
   - Maintains API version consistency

9. **Test URL reversal**
   - Ensure reverse('accounting:report-list') works
   - Test all report action URLs

10. **Document URL patterns**
    - Add comments explaining each route group
    - Document custom actions

### URL Structure

```
Base API URL: /api/v1/accounting/

Router-Generated URLs:
├── /api/v1/accounting/reports/
│   ├── GET: List available reports
│   │
│   ├── /trial-balance/
│   │   └── GET: Generate Trial Balance
│   │
│   ├── /profit-loss/
│   │   └── GET: Generate Profit & Loss
│   │
│   ├── /balance-sheet/
│   │   └── GET: Generate Balance Sheet
│   │
│   ├── /cash-flow/
│   │   └── GET: Generate Cash Flow
│   │
│   ├── /general-ledger/
│   │   └── GET: Generate General Ledger
│   │
│   ├── /trial-balance/export/pdf/
│   │   └── GET: Export TB as PDF
│   │
│   ├── /trial-balance/export/excel/
│   │   └── GET: Export TB as Excel
│   │
│   └── /schedule/
│       └── POST: Schedule report
│
└── (Other accounting endpoints...)
```

### URL Configuration Code Structure

```
apps/accounting/urls.py
═══════════════════════

1. Router setup
   └── DefaultRouter instance

2. ViewSet registration
   └── router.register('reports', ReportViewSet, basename='report')

3. URL patterns
   ├── router.urls
   └── Additional custom patterns (if any)

4. App namespace
   └── app_name = 'accounting'
```

### Project URL Integration

```
project/urls.py
═══════════════

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/v1/accounting/', include('apps.accounting.urls')),
    path('api/v1/pos/', include('apps.pos.urls')),
    # ... other app URLs
]
```

### URL Pattern Testing

| URL Pattern | Expected Reverse Name | Test Command |
|------------|----------------------|--------------|
| /reports/ | accounting:report-list | reverse('accounting:report-list') |
| /reports/trial-balance/ | accounting:report-trial-balance | reverse('accounting:report-trial-balance') |
| /reports/profit-loss/ | accounting:report-profit-loss | reverse('accounting:report-profit-loss') |
| /reports/balance-sheet/ | accounting:report-balance-sheet | reverse('accounting:report-balance-sheet') |
| /reports/cash-flow/ | accounting:report-cash-flow | reverse('accounting:report-cash-flow') |
| /reports/general-ledger/ | accounting:report-general-ledger | reverse('accounting:report-general-ledger') |
| /reports/schedule/ | accounting:report-schedule-report | reverse('accounting:report-schedule-report') |

### URL Naming Conventions

```
DRF Router Naming Pattern
═════════════════════════

Format: {basename}-{action}

Examples:
├── report-list → List endpoint
├── report-trial-balance → Trial Balance custom action
├── report-profit-loss → Profit & Loss custom action
├── report-schedule-report → Schedule custom action
└── report-export-pdf → PDF export custom action
```

### Full URL Examples

```
Development Server (http://localhost:8000)
══════════════════════════════════════════

List Reports:
GET http://localhost:8000/api/v1/accounting/reports/

Trial Balance:
GET http://localhost:8000/api/v1/accounting/reports/trial-balance/?as_of_date=2025-12-31

Profit & Loss:
GET http://localhost:8000/api/v1/accounting/reports/profit-loss/?start_date=2025-12-01&end_date=2025-12-31

Export TB as PDF:
GET http://localhost:8000/api/v1/accounting/reports/trial-balance/export/pdf/?as_of_date=2025-12-31

Schedule Report:
POST http://localhost:8000/api/v1/accounting/reports/schedule/
Body: { "report_type": "profit_loss", "frequency": "monthly", ... }
```

### Production URL Examples

```
Production Server (https://erp.lankacommerce.lk)
═════════════════════════════════════════════════

Trial Balance:
GET https://erp.lankacommerce.lk/api/v1/accounting/reports/trial-balance/?as_of_date=2025-12-31

Profit & Loss Export:
GET https://erp.lankacommerce.lk/api/v1/accounting/reports/profit-loss/export/excel/?start_date=2025-12-01&end_date=2025-12-31
```

### API Versioning Strategy

```
Version Structure
═════════════════

Current: /api/v1/
├── All current endpoints under v1
├── Maintains backward compatibility
└── Future versions: /api/v2/, /api/v3/

Version Migration:
├── v1 remains active during v2 development
├── Deprecation notices in v1 responses
├── Grace period (6-12 months) before v1 removal
└── Documentation for migration guide
```

### CORS Configuration (if needed)

```python
# In settings/base.py
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",  # React frontend (dev)
    "https://app.lankacommerce.lk",  # React frontend (prod)
]

CORS_ALLOW_METHODS = [
    'GET',
    'POST',
    'OPTIONS',
]

CORS_ALLOW_HEADERS = [
    'authorization',
    'content-type',
]
```

### Rate Limiting (optional)

```
Rate Limit Configuration
════════════════════════

Anonymous Users:
- 10 requests per minute (report list only)

Authenticated Users:
- 100 requests per minute (all endpoints)
- 20 report generations per hour (heavy endpoints)

Admin Users:
- 500 requests per minute
- Unlimited report generations
```

### Expected Outcome
- All report endpoints accessible
- Proper URL namespacing
- RESTful URL structure
- Version-controlled API paths
- Easy URL reversal in code

### Verification Checklist
- [ ] accounting/urls.py updated
- [ ] DefaultRouter instance created
- [ ] ReportViewSet registered
- [ ] app_name set to 'accounting'
- [ ] URL patterns list configured
- [ ] Project urls.py includes accounting URLs
- [ ] API versioning in place (/api/v1/)
- [ ] URL reversal tested
- [ ] All custom actions accessible
- [ ] Documentation updated with URLs

---

## Task 91: Write Report Generator Tests

### Overview
Create comprehensive unit tests for all report generators (Trial Balance, Profit & Loss, Balance Sheet, Cash Flow, General Ledger). Tests ensure accurate calculations, proper handling of edge cases, comparison mode functionality, and correct behavior with Sri Lankan business scenarios.

### Dependencies
- Task 90: Add Report URL Routes
- All report generators implemented
- pytest and pytest-django installed
- Test database configured

### Instructions

1. **Create tests directory structure**
   - Navigate to `apps/accounting/tests/`
   - Ensure `__init__.py` exists
   - Create separate test files per report

2. **Create test_trial_balance.py**
   - Create file for Trial Balance tests
   - Import pytest, TestCase, factories
   - Import TrialBalanceGenerator

3. **Set up test fixtures**
   - Use pytest fixtures for test data
   - Create ChartOfAccount fixtures
   - Create JournalEntry and JournalEntryLine fixtures
   - Create test tenant

4. **Write test_trial_balance_basic**
   - Create accounts with known balances
   - Generate Trial Balance report
   - Assert total debits = total credits
   - Assert individual account balances correct

5. **Write test_trial_balance_empty**
   - No transactions in the system
   - Generate Trial Balance
   - Assert empty result or all zeros
   - No errors raised

6. **Write test_trial_balance_comparison**
   - Create transactions for two periods
   - Generate TB with comparison
   - Assert current and comparison columns present
   - Assert variance calculations correct

7. **Write test_trial_balance_date_filtering**
   - Create transactions across multiple dates
   - Generate TB with specific as_of_date
   - Assert only transactions up to date included
   - Future transactions excluded

8. **Create test_profit_loss.py**
   - Create file for P&L tests
   - Import ProfitLossGenerator
   - Set up revenue and expense account fixtures

9. **Write test_profit_loss_basic**
   - Create revenue transactions
   - Create expense transactions
   - Generate P&L report
   - Assert net income calculation correct

10. **Write test_profit_loss_comparison_prior_year**
    - Create transactions for current and prior year
    - Generate P&L with prior_year comparison
    - Assert comparison columns accurate
    - Assert variance and percentage correct

11. **Write test_profit_loss_no_revenue**
    - Create only expense transactions
    - Generate P&L
    - Assert net loss calculated correctly
    - Assert revenue section shows zero

12. **Create test_balance_sheet.py**
    - Create file for Balance Sheet tests
    - Import BalanceSheetGenerator
    - Set up asset, liability, equity fixtures

13. **Write test_balance_sheet_basic**
    - Create asset, liability, equity accounts
    - Create transactions
    - Generate Balance Sheet
    - Assert Assets = Liabilities + Equity

14. **Write test_balance_sheet_comparison**
    - Create transactions for two periods
    - Generate BS with comparison
    - Assert current and comparison balance
    - Assert variance calculations

15. **Write test_balance_sheet_zero_equity**
    - New business with no equity
    - Assets = Liabilities
    - Generate Balance Sheet
    - Assert balances correctly

16. **Create test_cash_flow.py**
    - Create file for Cash Flow tests
    - Import CashFlowGenerator
    - Set up operating, investing, financing accounts

17. **Write test_cash_flow_indirect_method**
    - Create transactions in all three sections
    - Generate Cash Flow (indirect method)
    - Assert net cash flow calculated
    - Assert section totals correct

18. **Write test_cash_flow_direct_method**
    - Create cash-based transactions
    - Generate Cash Flow (direct method)
    - Assert operating cash flow from actual cash
    - Verify reconciliation with net income

19. **Write test_cash_flow_no_transactions**
    - Empty period
    - Generate Cash Flow
    - Assert all sections zero
    - No errors raised

20. **Create test_general_ledger.py**
    - Create file for General Ledger tests
    - Import GeneralLedgerGenerator

21. **Write test_general_ledger_single_account**
    - Create one account with multiple transactions
    - Generate GL for that account
    - Assert all transactions listed
    - Assert running balance correct

22. **Write test_general_ledger_multiple_accounts**
    - Create multiple accounts with transactions
    - Generate GL for selected accounts
    - Assert transactions grouped by account
    - Assert balances for each account

23. **Write test_general_ledger_date_range**
    - Create transactions outside and inside range
    - Generate GL with date range
    - Assert only in-range transactions included
    - Assert opening balance correct

24. **Create test_exporters.py**
    - Test PDF and Excel exporters
    - Ensure file generation works
    - Verify MIME types

25. **Write test_pdf_export**
    - Generate report data
    - Create PDF export
    - Assert PDF file created
    - Assert file size > 0

26. **Write test_excel_export**
    - Generate report data
    - Create Excel export
    - Assert Excel file created
    - Optionally read and verify content

27. **Add Sri Lanka-specific tests**
    - Test with LKR currency formatting
    - Test with Sinhala/Tamil account names
    - Test date handling in Asia/Colombo timezone
    - Test with Sri Lankan fiscal year dates

28. **Write test_lkr_currency_formatting**
    - Create accounts with large LKR amounts
    - Generate reports
    - Assert amounts formatted with commas
    - Assert decimal places (2) correct

29. **Write test_sinhala_account_names**
    - Create accounts with Sinhala names
    - Generate reports
    - Assert names displayed correctly
    - No encoding errors

30. **Write test_fiscal_year_transitions**
    - Create transactions across April 1 (fiscal year boundary)
    - Generate year-end reports
    - Assert fiscal year calculations correct

31. **Add performance tests**
    - Test with large datasets (1000+ transactions)
    - Measure generation time
    - Assert reasonable performance (<5 seconds)

32. **Create test utilities**
    - Helper function: create_test_accounts()
    - Helper function: create_test_transactions()
    - Fixture: sample_chart_of_accounts

33. **Configure pytest settings**
    - Update pytest.ini or conftest.py
    - Set database settings for tests
    - Configure test markers

### Test File Structure

```
apps/accounting/tests/
├── __init__.py
├── conftest.py                  # Shared fixtures
├── factories.py                 # Model factories
├── test_trial_balance.py        # TB tests
├── test_profit_loss.py          # P&L tests
├── test_balance_sheet.py        # BS tests
├── test_cash_flow.py            # CF tests
├── test_general_ledger.py       # GL tests
└── test_exporters.py            # Export tests
```

### Test Coverage Matrix

| Report | Test Cases | Edge Cases | Comparison Mode | Date Filtering |
|--------|-----------|------------|----------------|----------------|
| Trial Balance | ✓ Basic calculation | ✓ Empty data | ✓ Prior period | ✓ As-of date |
| Profit & Loss | ✓ Net income | ✓ No revenue | ✓ Prior year | ✓ Date range |
| Balance Sheet | ✓ Equation balance | ✓ Zero equity | ✓ Prior period | ✓ As-of date |
| Cash Flow | ✓ Three sections | ✓ No cash | ✓ Prior period | ✓ Date range |
| General Ledger | ✓ Transaction list | ✓ Single entry | N/A | ✓ Date range |

### Test Data Setup Example

```
Test Scenario: Profit & Loss Basic Calculation
═══════════════════════════════════════════════

Setup:
1. Create revenue account: "Sales Revenue"
2. Create expense account: "Operating Expenses"
3. Create transactions:
   - Dec 5: Debit Bank 1,000,000, Credit Sales 1,000,000
   - Dec 10: Debit Bank 500,000, Credit Sales 500,000
   - Dec 15: Debit Expenses 300,000, Credit Bank 300,000
   - Dec 20: Debit Expenses 200,000, Credit Bank 200,000

Expected Results:
- Total Revenue: 1,500,000
- Total Expenses: 500,000
- Net Income: 1,000,000

Assertions:
✓ report.total_revenue == 1,500,000
✓ report.total_expenses == 500,000
✓ report.net_income == 1,000,000
✓ report.net_income == report.total_revenue - report.total_expenses
```

### Comparison Mode Test Example

```
Test Scenario: P&L with Prior Year Comparison
══════════════════════════════════════════════

Setup:
1. Current Period: Dec 2025
   - Revenue: 1,500,000
   - Expenses: 500,000
   - Net Income: 1,000,000

2. Prior Year: Dec 2024
   - Revenue: 1,200,000
   - Expenses: 450,000
   - Net Income: 750,000

Expected Comparison:
- Revenue Variance: +300,000 (+25%)
- Expenses Variance: +50,000 (+11.11%)
- Net Income Variance: +250,000 (+33.33%)

Assertions:
✓ report.revenue.current == 1,500,000
✓ report.revenue.comparison == 1,200,000
✓ report.revenue.variance == 300,000
✓ report.revenue.variance_percentage == 25.0
✓ report.net_income.variance_percentage == 33.33
```

### Edge Case Test Scenarios

| Edge Case | Test Description | Expected Behavior |
|-----------|------------------|-------------------|
| No Transactions | Generate report with empty database | Return empty/zero report, no errors |
| Single Transaction | Only one journal entry | Correct balance, no division errors |
| Exact Zero Balance | Debits equal credits perfectly | Balance shows 0.00, not -0.00 |
| Large Numbers | Amounts > 1 billion LKR | Correct formatting, no overflow |
| Date Boundaries | Transactions on start/end dates | Inclusive of boundary dates |
| Future Dates | as_of_date in future | Reject or warning |
| Invalid Date Range | start_date > end_date | Raise ValidationError |
| Unicode Names | Sinhala/Tamil account names | Correct display, no errors |

### Sri Lankan Business Test Scenarios

```
Test Case: Fiscal Year Transition
══════════════════════════════════

Fiscal Year: April 1, 2025 - March 31, 2026

Transaction Dates:
- March 15, 2026 (end of fiscal year)
- April 5, 2026 (start of new fiscal year)

Test 1: Full Year P&L (Apr 1, 2025 - Mar 31, 2026)
Expected: Includes March 15 transaction, excludes April 5

Test 2: Q1 Report (Apr 1, 2026 - Jun 30, 2026)
Expected: Includes April 5 transaction, excludes March 15

Test 3: Year Comparison
Expected: Compares FY 2025-26 with FY 2024-25
```

```
Test Case: LKR Currency Formatting
═══════════════════════════════════

Input Amounts:
- 1234567.89 → "1,234,567.89"
- 500.5 → "500.50"
- 1000000 → "1,000,000.00"
- -5000.75 → "-5,000.75" or "(5,000.75)"

Assertions:
✓ Comma separators at thousands
✓ Exactly 2 decimal places
✓ Negative amounts handled (parentheses or minus)
✓ Large amounts (millions/billions) formatted correctly
```

```
Test Case: Multi-language Account Names
════════════════════════════════════════

Accounts:
1. English: "Cash at Bank"
2. Sinhala: "බැංකුවේ මුදල්"
3. Tamil: "வங்கியில் பணம்"

Generate Reports:
✓ Trial Balance lists all three accounts
✓ Names display without encoding errors
✓ Sorting works with Unicode characters
✓ PDF export includes all characters
✓ Excel export includes all characters
```

### Pytest Configuration Example

```python
# conftest.py
import pytest
from apps.tenants.models import Tenant
from apps.accounting.models import ChartOfAccount

@pytest.fixture
def test_tenant():
    """Create a test tenant."""
    tenant = Tenant.objects.create(
        schema_name='test_tenant',
        name='Test Company Ltd',
        domain='test.lankacommerce.lk'
    )
    return tenant

@pytest.fixture
def sample_accounts(test_tenant):
    """Create sample chart of accounts."""
    accounts = {
        'cash': ChartOfAccount.objects.create(
            tenant=test_tenant,
            code='1001',
            name='Cash at Bank',
            account_type='asset'
        ),
        'revenue': ChartOfAccount.objects.create(
            tenant=test_tenant,
            code='4001',
            name='Sales Revenue',
            account_type='revenue'
        ),
        'expense': ChartOfAccount.objects.create(
            tenant=test_tenant,
            code='5001',
            name='Operating Expenses',
            account_type='expense'
        )
    }
    return accounts
```

### Test Execution Commands

```bash
# Run all accounting tests
pytest apps/accounting/tests/

# Run specific test file
pytest apps/accounting/tests/test_trial_balance.py

# Run with coverage
pytest --cov=apps.accounting.reports apps/accounting/tests/

# Run with verbose output
pytest -v apps/accounting/tests/

# Run specific test
pytest apps/accounting/tests/test_profit_loss.py::test_profit_loss_basic

# Run tests matching pattern
pytest -k "comparison" apps/accounting/tests/
```

### Expected Test Coverage

```
Minimum Coverage Targets
════════════════════════

Overall: > 90%
├── Report Generators: > 95%
├── Exporters: > 85%
├── ViewSet: > 90%
└── Utilities: > 80%

Critical Paths (100% Required):
├── Financial calculations
├── Date range filtering
├── Comparison mode
└── Balance validations
```

### Expected Outcome
- Comprehensive test coverage for all generators
- Edge case handling verified
- Comparison mode tested
- Sri Lankan scenarios covered
- Performance benchmarks established

### Verification Checklist
- [ ] Test directory structure created
- [ ] conftest.py with fixtures
- [ ] test_trial_balance.py created
- [ ] test_profit_loss.py created
- [ ] test_balance_sheet.py created
- [ ] test_cash_flow.py created
- [ ] test_general_ledger.py created
- [ ] test_exporters.py created
- [ ] Basic calculation tests written
- [ ] Edge case tests written
- [ ] Comparison mode tests written
- [ ] Date filtering tests written
- [ ] Sri Lankan scenarios tested
- [ ] Performance tests added
- [ ] All tests passing
- [ ] Coverage > 90%

---

## Task 92: Create Report API Documentation

### Overview
Create comprehensive API documentation for all financial report endpoints using drf-spectacular (OpenAPI/Swagger). Documentation includes endpoint descriptions, parameter specifications, request/response examples, error codes, and usage guidelines tailored for Sri Lankan business context.

### Dependencies
- Task 91: Write Report Generator Tests
- drf-spectacular installed
- All endpoints implemented and tested

### Instructions

1. **Install drf-spectacular**
   - Add 'drf-spectacular' to requirements/base.txt
   - Install package
   - Already done if following project setup

2. **Configure drf-spectacular settings**
   - Open settings/base.py
   - Add SPECTACULAR_SETTINGS configuration
   - Configure title, version, description

3. **Add schema decorators to ViewSet**
   - Open apps/accounting/views/reports.py
   - Import extend_schema decorator
   - Add decorators to each ViewSet action

4. **Document trial_balance action**
   - Add @extend_schema decorator
   - Define summary and description
   - Specify query parameters with OpenAPIParameter
   - Document response structure

5. **Document profit_loss action**
   - Add schema decorator
   - Define parameters (start_date, end_date, etc.)
   - Document response with example
   - Note comparison mode behavior

6. **Document balance_sheet action**
   - Add schema decorator
   - Define as_of_date parameter
   - Document response structure
   - Explain accounting equation

7. **Document cash_flow action**
   - Add schema decorator
   - Document method parameter (direct/indirect)
   - Explain three sections
   - Provide example response

8. **Document general_ledger action**
   - Add schema decorator
   - Document account filtering
   - Explain pagination
   - Note date range behavior

9. **Document export actions**
   - Add schemas for export_pdf and export_excel
   - Document file response format
   - Specify MIME types
   - Note filename structure

10. **Document schedule_report action**
    - Add schema for POST action
    - Define request body serializer
    - Document schedule configuration
    - Explain frequency options

11. **Create request/response examples**
    - Add example JSON for each endpoint
    - Show successful responses
    - Show error responses
    - Include Sri Lankan business examples

12. **Document error responses**
    - List all error codes
    - Provide error message examples
    - Explain resolution steps
    - Note common mistakes

13. **Add authentication documentation**
    - Document required authentication
    - Explain token format
    - Show header examples
    - Document permission requirements

14. **Create usage guide**
    - Create docs/reports_api_guide.md
    - Step-by-step API usage examples
    - Common use cases
    - Best practices

15. **Add OpenAPI schema endpoint**
    - Configure URL for schema access
    - Add to project urls.py
    - Ensure schema generation works

16. **Configure Swagger UI**
    - Add Swagger UI URL
    - Configure UI customization
    - Add authentication to UI

17. **Add ReDoc UI**
    - Add ReDoc URL as alternative
    - Configure ReDoc customization
    - Provide both UI options

18. **Test schema generation**
    - Run schema generation command
    - Verify schema.yaml created
    - Check for errors or warnings

19. **Add code examples**
    - Python examples using requests library
    - JavaScript examples using fetch/axios
    - cURL examples for testing
    - Cover all major endpoints

20. **Document rate limiting**
    - Explain rate limit headers
    - Document limits per user type
    - Show rate limit error response

21. **Add Sri Lankan business examples**
    - Use LKR amounts in examples
    - Use Sri Lankan company names
    - Show fiscal year examples
    - Include local date formats

### API Documentation Structure

```
Documentation Components
════════════════════════

1. OpenAPI Schema (Auto-generated)
   ├── Endpoint definitions
   ├── Parameter specifications
   ├── Response schemas
   └── Error definitions

2. Swagger UI (/api/schema/swagger-ui/)
   ├── Interactive API explorer
   ├── Try-it-out functionality
   └── Authentication support

3. ReDoc UI (/api/schema/redoc/)
   ├── Clean documentation layout
   ├── Search functionality
   └── Mobile-friendly

4. Usage Guide (Markdown)
   ├── Getting started
   ├── Authentication
   ├── Common workflows
   └── Code examples
```

### SPECTACULAR_SETTINGS Configuration

```python
# settings/base.py
SPECTACULAR_SETTINGS = {
    'TITLE': 'LankaCommerce ERP API',
    'DESCRIPTION': 'Enterprise Resource Planning API with Financial Reports',
    'VERSION': '1.0.0',
    'SERVE_INCLUDE_SCHEMA': False,
    'COMPONENT_SPLIT_REQUEST': True,
    'SCHEMA_PATH_PREFIX': r'/api/v[0-9]',
    'DEFAULT_GENERATOR_CLASS': 'drf_spectacular.generators.SchemaGenerator',
    'CONTACT': {
        'name': 'LankaCommerce Support',
        'email': 'support@lankacommerce.lk'
    },
    'LICENSE': {
        'name': 'Proprietary',
    },
}
```

### Schema Decorator Examples

#### Trial Balance Documentation
```python
from drf_spectacular.utils import extend_schema, OpenAPIParameter
from drf_spectacular.types import OpenApiTypes

@extend_schema(
    summary="Generate Trial Balance Report",
    description=(
        "Generates a Trial Balance report for the specified date. "
        "Trial Balance lists all accounts with their debit and credit "
        "balances, ensuring the accounting equation is balanced."
    ),
    parameters=[
        OpenAPIParameter(
            name='as_of_date',
            type=OpenApiTypes.DATE,
            location=OpenAPIParameter.QUERY,
            description='Date for trial balance (YYYY-MM-DD)',
            required=True,
            example='2025-12-31'
        ),
        OpenAPIParameter(
            name='include_comparison',
            type=OpenApiTypes.BOOL,
            location=OpenAPIParameter.QUERY,
            description='Include comparison with prior period',
            required=False,
            default=False
        ),
        OpenAPIParameter(
            name='detail_level',
            type=OpenApiTypes.STR,
            location=OpenAPIParameter.QUERY,
            description='Detail level: summary or detail',
            required=False,
            enum=['summary', 'detail'],
            default='summary'
        ),
    ],
    responses={
        200: {
            'description': 'Trial Balance data',
            'content': {
                'application/json': {
                    'example': {
                        'status': 'success',
                        'report_type': 'trial_balance',
                        'metadata': {
                            'as_of_date': '2025-12-31',
                            'generated_at': '2026-01-05T03:00:00+05:30',
                        },
                        'data': {
                            'accounts': [
                                {
                                    'code': '1001',
                                    'name': 'Cash at Bank',
                                    'debit': 500000.00,
                                    'credit': 0.00
                                }
                            ],
                            'totals': {
                                'total_debit': 1500000.00,
                                'total_credit': 1500000.00
                            }
                        }
                    }
                }
            }
        },
        400: {'description': 'Invalid parameters'},
        401: {'description': 'Authentication required'},
        403: {'description': 'Permission denied'},
    },
    tags=['Financial Reports']
)
@action(detail=False, methods=['get'])
def trial_balance(self, request):
    # Implementation...
```

### Request/Response Examples

#### Profit & Loss Request
```http
GET /api/v1/accounting/reports/profit-loss/?start_date=2025-12-01&end_date=2025-12-31&include_comparison=true HTTP/1.1
Host: erp.lankacommerce.lk
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Accept: application/json
```

#### Profit & Loss Response
```json
{
  "status": "success",
  "report_type": "profit_loss",
  "metadata": {
    "start_date": "2025-12-01",
    "end_date": "2025-12-31",
    "generated_at": "2026-01-05T10:30:00+05:30",
    "includes_comparison": true,
    "comparison_period": "prior_year",
    "currency": "LKR"
  },
  "data": {
    "revenue": {
      "items": [
        {
          "account": "Sales Revenue",
          "current": 1500000.00,
          "comparison": 1200000.00,
          "variance": 300000.00,
          "variance_percentage": 25.0
        }
      ],
      "total": {
        "current": 1500000.00,
        "comparison": 1200000.00,
        "variance": 300000.00,
        "variance_percentage": 25.0
      }
    },
    "expenses": {
      "items": [
        {
          "account": "Operating Expenses",
          "current": 500000.00,
          "comparison": 450000.00,
          "variance": 50000.00,
          "variance_percentage": 11.11
        }
      ],
      "total": {
        "current": 500000.00,
        "comparison": 450000.00,
        "variance": 50000.00,
        "variance_percentage": 11.11
      }
    },
    "net_income": {
      "current": 1000000.00,
      "comparison": 750000.00,
      "variance": 250000.00,
      "variance_percentage": 33.33
    }
  }
}
```

### Error Response Examples

#### Invalid Date Range
```json
{
  "status": "error",
  "error_code": "INVALID_DATE_RANGE",
  "message": "start_date must be before end_date",
  "details": {
    "start_date": "2025-12-31",
    "end_date": "2025-12-01"
  },
  "timestamp": "2026-01-05T10:30:00+05:30"
}
```

#### Missing Parameter
```json
{
  "status": "error",
  "error_code": "MISSING_PARAMETER",
  "message": "Required parameter 'as_of_date' is missing",
  "details": {
    "parameter": "as_of_date",
    "type": "date",
    "format": "YYYY-MM-DD"
  }
}
```

#### Permission Denied
```json
{
  "status": "error",
  "error_code": "PERMISSION_DENIED",
  "message": "You do not have permission to view this report",
  "details": {
    "required_permission": "view_profit_loss",
    "user_permissions": ["view_trial_balance"]
  }
}
```

### Code Examples

#### Python (requests library)
```python
import requests

# Configuration
API_BASE = "https://erp.lankacommerce.lk/api/v1"
TOKEN = "your-auth-token-here"
headers = {
    "Authorization": f"Bearer {TOKEN}",
    "Accept": "application/json"
}

# Generate Profit & Loss Report
params = {
    "start_date": "2025-12-01",
    "end_date": "2025-12-31",
    "include_comparison": True
}

response = requests.get(
    f"{API_BASE}/accounting/reports/profit-loss/",
    headers=headers,
    params=params
)

if response.status_code == 200:
    report = response.json()
    print(f"Net Income: LKR {report['data']['net_income']['current']:,.2f}")
else:
    print(f"Error: {response.json()['message']}")

# Export as PDF
pdf_response = requests.get(
    f"{API_BASE}/accounting/reports/profit-loss/export/pdf/",
    headers=headers,
    params=params
)

if pdf_response.status_code == 200:
    with open("profit_loss_dec_2025.pdf", "wb") as f:
        f.write(pdf_response.content)
    print("PDF saved successfully")
```

#### JavaScript (axios)
```javascript
const axios = require('axios');

const API_BASE = 'https://erp.lankacommerce.lk/api/v1';
const TOKEN = 'your-auth-token-here';

// Generate Balance Sheet
axios.get(`${API_BASE}/accounting/reports/balance-sheet/`, {
  headers: {
    'Authorization': `Bearer ${TOKEN}`,
    'Accept': 'application/json'
  },
  params: {
    as_of_date: '2025-12-31',
    include_comparison: true
  }
})
.then(response => {
  const report = response.data;
  console.log('Total Assets:', report.data.assets.total.current);
  console.log('Total Liabilities:', report.data.liabilities.total.current);
  console.log('Total Equity:', report.data.equity.total.current);
})
.catch(error => {
  console.error('Error:', error.response.data.message);
});
```

#### cURL Commands
```bash
# Generate Trial Balance
curl -X GET "https://erp.lankacommerce.lk/api/v1/accounting/reports/trial-balance/?as_of_date=2025-12-31" \
  -H "Authorization: Bearer your-auth-token-here" \
  -H "Accept: application/json"

# Export Profit & Loss as Excel
curl -X GET "https://erp.lankacommerce.lk/api/v1/accounting/reports/profit-loss/export/excel/?start_date=2025-12-01&end_date=2025-12-31" \
  -H "Authorization: Bearer your-auth-token-here" \
  -o profit_loss_dec_2025.xlsx

# Schedule Monthly Report
curl -X POST "https://erp.lankacommerce.lk/api/v1/accounting/reports/schedule/" \
  -H "Authorization: Bearer your-auth-token-here" \
  -H "Content-Type: application/json" \
  -d '{
    "report_type": "profit_loss",
    "frequency": "monthly",
    "day_of_month": 5,
    "time_of_day": "03:00",
    "recipients": ["cfo@lankacommerce.lk"],
    "format": "pdf",
    "include_comparison": true
  }'
```

### Usage Guide Sections

```
docs/reports_api_guide.md
═════════════════════════

1. Introduction
   └── Overview of Financial Reports API

2. Authentication
   ├── Obtaining API token
   ├── Including token in requests
   └── Token expiration and refresh

3. Available Reports
   ├── Trial Balance
   ├── Profit & Loss
   ├── Balance Sheet
   ├── Cash Flow Statement
   └── General Ledger

4. Common Workflows
   ├── Monthly financial close
   ├── Year-end reporting
   ├── Quarterly board reports
   └── Daily cash monitoring

5. Export Functionality
   ├── PDF export
   ├── Excel export
   └── Format selection guidelines

6. Report Scheduling
   ├── Setting up automated reports
   ├── Email delivery configuration
   └── Managing schedules

7. Error Handling
   ├── Common errors
   ├── Troubleshooting
   └── Support contact

8. Best Practices
   ├── Date range selection
   ├── Comparison mode usage
   ├── Performance optimization
   └── Sri Lankan business considerations

9. Code Examples
   ├── Python examples
   ├── JavaScript examples
   └── cURL examples

10. Appendices
    ├── Error code reference
    ├── Parameter reference
    └── Response schema reference
```

### Sri Lankan Business Examples

```
Example: Monthly Reporting for Sri Lankan Company
══════════════════════════════════════════════════

Scenario: LankaCommerce (Pvt) Ltd
Fiscal Year: April 1, 2025 - March 31, 2026
Reporting Month: December 2025

Step 1: Generate Profit & Loss for December
GET /api/v1/accounting/reports/profit-loss/
?start_date=2025-12-01&end_date=2025-12-31
&include_comparison=true&comparison_period=prior_year

Step 2: Generate Balance Sheet as of December 31
GET /api/v1/accounting/reports/balance-sheet/
?as_of_date=2025-12-31&include_comparison=true

Step 3: Export both reports as PDF
GET .../profit-loss/export/pdf/?...
GET .../balance-sheet/export/pdf/?...

Step 4: Email reports to management
(Reports automatically emailed if scheduled)

Common Use Cases:
├── Monthly board meetings (1st week of month)
├── Tax filing preparation (April for fiscal year-end)
├── Bank loan applications (quarterly)
└── Investor reporting (quarterly/annually)
```

### Expected Outcome
- Complete OpenAPI/Swagger documentation
- Interactive API explorer (Swagger UI)
- Clean documentation layout (ReDoc)
- Comprehensive usage guide
- Code examples in multiple languages

### Verification Checklist
- [ ] drf-spectacular installed and configured
- [ ] SPECTACULAR_SETTINGS configured
- [ ] @extend_schema decorators added to all actions
- [ ] Parameters documented with OpenAPIParameter
- [ ] Response schemas defined
- [ ] Request/response examples added
- [ ] Error responses documented
- [ ] Authentication documented
- [ ] Swagger UI accessible
- [ ] ReDoc UI accessible
- [ ] Schema generation works without errors
- [ ] Usage guide created (docs/reports_api_guide.md)
- [ ] Python code examples added
- [ ] JavaScript code examples added
- [ ] cURL examples added
- [ ] Sri Lankan business examples included
- [ ] Rate limiting documented
- [ ] All endpoints covered

---

## Summary

This document completed the financial reports module with production-ready features:

### Completed Components
- ✅ Automated report scheduler via Celery
- ✅ Professional email delivery system
- ✅ Complete REST API ViewSet
- ✅ URL routing configuration
- ✅ Comprehensive unit tests
- ✅ Full API documentation (OpenAPI/Swagger)

### Key Achievements
1. **Automation** - Celery-based report scheduling with timezone awareness
2. **Email Delivery** - Professional email templates with SLT compatibility
3. **REST API** - Complete ViewSet with all report endpoints
4. **Testing** - >90% test coverage with Sri Lankan scenarios
5. **Documentation** - Interactive Swagger UI and comprehensive guides
6. **Sri Lankan Context** - Fiscal year support, LKR formatting, business hours

### Production Readiness
- Automated report generation
- Email delivery with retry logic
- Error handling and logging
- Performance tested
- Fully documented API
- Comprehensive test coverage

### Next Steps
This completes SubPhase-11 Financial Reports. Proceed to [SubPhase-12_Tax-Reporting](../../SubPhase-12_Tax-Reporting/) for Sri Lankan tax compliance features including VAT, NBT, and withholding tax calculations.

---

**Document Status:** ✅ Complete  
**Total Tasks:** 6  
**Total Lines:** ~990
