# Tasks 09-16: Status, Tracking Fields, and Migrations

> **Phase:** 06 - ERP Advanced Modules  
> **SubPhase:** 07 - Payslip Generation  
> **Group:** A - Payslip Data Models  
> **Document:** 02 of 02  
> **Tasks Covered:** 09, 10, 11, 12, 13, 14, 15, 16

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [01_Tasks-01-08_App-Model-Core.md](01_Tasks-01-08_App-Model-Core.md)

---

## Document Overview

This document covers the completion of the Payslip model with status tracking, PDF file storage, email distribution tracking, employee engagement tracking (views and downloads), database migrations, and model-level constraints. These fields enable full lifecycle management of payslip documents.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 09 | Add Payslip Status Field | Low | 15 min |
| 10 | Add Payslip Generation Fields | Low | 15 min |
| 11 | Add Payslip PDF File Field | Medium | 20 min |
| 12 | Add Payslip Sent Fields | Medium | 20 min |
| 13 | Add Payslip View Tracking | Low | 15 min |
| 14 | Add Payslip Download Tracking | Low | 15 min |
| 15 | Run Payslip Migrations | Low | 15 min |
| 16 | Add Payslip Model Constraints | Low | 15 min |

---

## Task 09: Add Payslip Status Field

### Overview
Add a status field to track the lifecycle stage of each payslip document, from initial draft through generation, distribution, viewing, and downloading. This field uses the PayslipStatus choices defined earlier.

### Dependencies
- Task 04: Create Payslip Model
- Task 03: Define PayslipStatus Choices

### Instructions

1. **Open payslip model file**
   - Navigate to `apps/payslip/models/payslip.py`
   - Locate Payslip model class
   - Prepare to add status field

2. **Import PayslipStatus**
   - Import PayslipStatus from constants module
   - Ensure TextChoices or similar is properly imported

3. **Add status CharField**
   - Field name: status
   - Type: CharField
   - Max length: 20 characters
   - Choices: PayslipStatus.choices

4. **Set default value**
   - Default to PayslipStatus.DRAFT
   - New payslips start in DRAFT status
   - Will progress through lifecycle

5. **Configure field options**
   - Set verbose_name='Status'
   - Add help_text explaining status values
   - Add db_index=True for filtering

6. **Document status transitions**
   - Add comment explaining status flow
   - Document when each status is set
   - Note business logic implications

### Status Field Configuration

| Property | Value | Purpose |
|----------|-------|---------|
| Field Name | status | Track payslip lifecycle stage |
| Type | CharField | Store status value |
| Max Length | 20 | Accommodate status values |
| Choices | PayslipStatus.choices | Limit to defined statuses |
| Default | PayslipStatus.DRAFT | Initial state |
| Database Index | True | Fast filtering by status |

### Status Lifecycle Flow

```
DRAFT
  │ Initial creation
  │
  ├─→ [PDF Generation triggered]
  │
  ▼
GENERATED
  │ PDF successfully created
  │
  ├─→ [Email sent]
  │
  ▼
SENT
  │ Email delivered
  │
  ├─→ [Employee opens payslip]
  │
  ▼
VIEWED
  │ Employee viewed content
  │
  ├─→ [Employee downloads PDF]
  │
  ▼
DOWNLOADED
    Final state (normal flow)
```

### Status Update Triggers

| Status | Set When | Set By |
|--------|----------|--------|
| DRAFT | Record created | Bulk generation process |
| GENERATED | PDF successfully saved | PayslipGenerator service |
| SENT | Email successfully sent | PayslipEmailer service |
| VIEWED | Employee opens payslip | ViewSet tracking logic |
| DOWNLOADED | Employee downloads PDF | Download endpoint |

### Usage Scenarios

#### Admin Filtering
```
Filter payslips by status:
- Show all DRAFT payslips (pending generation)
- Show all GENERATED (ready to send)
- Show all SENT (awaiting employee action)
- Show VIEWED/DOWNLOADED (completed)
```

#### Bulk Operations
```
Bulk status queries:
- Count by status for reporting
- Filter for bulk email (GENERATED status)
- Track completion (DOWNLOADED status)
```

#### Status Reporting
```
Period completion metrics:
- Total payslips: 50
- Generated: 50 (100%)
- Sent: 48 (96%)
- Viewed: 42 (84%)
- Downloaded: 38 (76%)
```

### Status Validation

1. **One-Way Progression**
   - Status generally moves forward
   - DRAFT → GENERATED → SENT → VIEWED → DOWNLOADED
   - Regeneration returns to DRAFT then GENERATED

2. **Skip Scenarios**
   - GENERATED → VIEWED (direct portal access, no email)
   - VIEWED may skip to DOWNLOADED immediately

3. **Business Rules**
   - Cannot send email if status is DRAFT
   - Cannot mark VIEWED if not GENERATED
   - Download requires GENERATED or later status

### Expected Outcome
- Status field added to track lifecycle
- Default to DRAFT for new records
- Indexed for efficient filtering
- Foundation for workflow management

### Verification Checklist
- [ ] status CharField added to Payslip model
- [ ] choices=PayslipStatus.choices configured
- [ ] default=PayslipStatus.DRAFT set
- [ ] db_index=True for performance
- [ ] max_length=20 sufficient
- [ ] Docstring comments added

---

## Task 10: Add Payslip Generation Fields

### Overview
Add fields to track when the payslip PDF was generated and who generated it. These fields provide audit trail and accountability for payslip generation activities.

### Dependencies
- Task 04: Create Payslip Model

### Instructions

1. **Open payslip model file**
   - Navigate to `apps/payslip/models/payslip.py`
   - Locate Payslip model class
   - Prepare to add generation tracking fields

2. **Import User model**
   - Import Django User model or custom user
   - Use settings.AUTH_USER_MODEL reference

3. **Add generated_at field**
   - Field name: generated_at
   - Type: DateTimeField
   - Set null=True, blank=True
   - Will be set when PDF generated

4. **Add generated_by field**
   - Field name: generated_by
   - Type: ForeignKey to User
   - Set null=True, blank=True
   - SET_NULL on delete
   - Add related_name='generated_payslips'

5. **Configure field options**
   - Set verbose_name for each field
   - Add help_text explaining purpose
   - generated_at: 'When PDF was generated'
   - generated_by: 'User who triggered generation'

6. **Document usage**
   - Add comments explaining when fields are set
   - Note that fields are null until generation
   - Explain audit trail purpose

### Generation Fields Configuration

| Field | Type | Null | Default | Purpose |
|-------|------|------|---------|---------|
| generated_at | DateTimeField | True | None | Timestamp of PDF generation |
| generated_by | ForeignKey(User) | True | None | User who triggered generation |

### Field Update Logic

```
Generation Workflow:

1. Payslip Created (DRAFT)
   - generated_at: None
   - generated_by: None
   - status: DRAFT

2. Generation Triggered
   - Admin action or bulk process
   - Capture current user
   - Capture current timestamp

3. PDF Successfully Generated
   - Set generated_at = timezone.now()
   - Set generated_by = request.user
   - Update status to GENERATED
   
4. Regeneration
   - Update generated_at to new timestamp
   - Update generated_by to new user
   - Status: DRAFT → GENERATED (again)
```

### Usage Scenarios

#### Audit Trail
```
Track generation history:
- Who generated payslip: generated_by.username
- When generated: generated_at
- Time from creation to generation
- Regeneration tracking
```

#### Admin Display
```
Payslip List View:
| Slip Number | Employee | Generated | Generated By |
|-------------|----------|-----------|--------------|
| PAY-2026-01-001 | John Doe | 2026-01-20 10:00 | admin_user |
| PAY-2026-01-002 | Jane Smith | 2026-01-20 10:02 | admin_user |
```

#### Performance Monitoring
```
Generation metrics:
- Average time per payslip
- Bulk generation duration
- Generation failures and retries
- Peak generation times
```

#### User Attribution
```
From User to Generated Payslips:
- user.generated_payslips.all()
- user.generated_payslips.count()
- user.generated_payslips.filter(created_at__date=today)
```

### ForeignKey Delete Behavior

```
On User Deletion:

generated_by uses SET_NULL:
- User deleted
- generated_by set to NULL
- Payslip preserved
- Audit trail maintained (partial)

Alternative: PROTECT
- Prevent user deletion if payslips exist
- Force reassignment before deletion
- Stronger audit requirements
```

### Bulk Generation Context

```
Bulk Generation Task:

for employee_payroll in employee_payrolls:
    payslip, created = Payslip.objects.get_or_create(
        employee=employee_payroll.employee,
        payroll_period=period,
        defaults={'status': 'DRAFT'}
    )
    
    # Generate PDF
    generator.save(payslip.id)
    
    # Generator service sets:
    payslip.generated_at = timezone.now()
    payslip.generated_by = initiated_by_user
    payslip.status = 'GENERATED'
    payslip.save()
```

### Timestamp Considerations

1. **Timezone Awareness**
   - Use timezone.now() for current time
   - Store in UTC
   - Display in user's timezone

2. **Null Handling**
   - generated_at is null until PDF created
   - Check for null in templates/APIs
   - Display "Not Generated" if null

3. **Regeneration**
   - Update timestamp on regeneration
   - Previous timestamp lost (consider logging)
   - Track via updated_at for history

### Expected Outcome
- Generation tracking fields added
- Audit trail for PDF generation
- User attribution for accountability
- Timestamp tracking for metrics

### Verification Checklist
- [ ] generated_at DateTimeField added
- [ ] generated_by ForeignKey to User added
- [ ] Both fields allow null=True, blank=True
- [ ] on_delete=SET_NULL for generated_by
- [ ] related_name='generated_payslips' set
- [ ] Verbose names and help text added
- [ ] Docstring comments added

---

## Task 11: Add Payslip PDF File Field

### Overview
Add a FileField to store the generated PDF payslip document. This field handles file upload, storage, and retrieval, supporting both local filesystem and cloud storage (S3).

### Dependencies
- Task 04: Create Payslip Model
- Django storage backend configured

### Instructions

1. **Open payslip model file**
   - Navigate to `apps/payslip/models/payslip.py`
   - Locate Payslip model class
   - Prepare to add pdf_file field

2. **Add pdf_file FileField**
   - Field name: pdf_file
   - Type: FileField
   - Set upload_to with callable function
   - Set null=True, blank=True (until generated)

3. **Create upload_to function**
   - Define function before model class
   - Accept instance and filename parameters
   - Return dynamic storage path
   - Format: payslips/{tenant_id}/{year}/{month}/{slip_number}.pdf

4. **Configure field options**
   - Set verbose_name='PDF File'
   - Add help_text explaining file storage
   - Set max_length for path if needed

5. **Add PDF URL property**
   - Create @property method pdf_url
   - Return pdf_file.url if file exists
   - Return None if no file

6. **Add file existence check**
   - Create @property method has_pdf
   - Return bool(pdf_file)
   - Use in templates and APIs

7. **Document storage structure**
   - Add comment explaining path format
   - Note tenant isolation
   - Explain year/month organization

### PDF File Field Configuration

| Property | Value | Purpose |
|----------|-------|---------|
| Field Name | pdf_file | Store PDF document |
| Type | FileField | Handle file storage |
| Null Allowed | True | No file until generated |
| Upload To | Dynamic function | Organize by tenant/date |

### Storage Path Structure

```
Media Root:
└── payslips/
    └── {tenant_id}/
        └── {year}/
            └── {month}/
                ├── PAY-2026-01-001.pdf
                ├── PAY-2026-01-002.pdf
                ├── PAY-2026-01-003.pdf
                └── ...

Example Path:
payslips/t_abc123/2026/01/PAY-2026-01-001.pdf

Components:
├── payslips/          (base directory)
├── t_abc123/          (tenant ID for isolation)
├── 2026/              (year for organization)
├── 01/                (month for organization)
└── PAY-2026-01-001.pdf (slip number as filename)
```

### Upload To Function

```
Function signature:
def payslip_upload_to(instance, filename):
    # Extract date from payroll period
    period_date = instance.payroll_period.start_date
    year = period_date.year
    month = period_date.month
    
    # Use slip number as filename
    filename = f"{instance.slip_number}.pdf"
    
    # Build path with tenant isolation
    return f"payslips/{instance.tenant.id}/{year}/{month:02d}/{filename}"

Usage in model:
pdf_file = FileField(upload_to=payslip_upload_to, null=True, blank=True)
```

### File Management Operations

#### Save PDF After Generation
```
Save generated PDF:
1. Generate PDF content
2. Create BytesIO buffer with PDF
3. Create ContentFile from buffer
4. Save to payslip.pdf_file
5. Update status to GENERATED

payslip.pdf_file.save(
    name=f"{payslip.slip_number}.pdf",
    content=ContentFile(pdf_bytes),
    save=True
)
```

#### Retrieve PDF for Download
```
Stream PDF to user:
1. Check if pdf_file exists
2. Open file
3. Create FileResponse
4. Set content type
5. Set filename header

if payslip.pdf_file:
    response = FileResponse(
        payslip.pdf_file.open('rb'),
        content_type='application/pdf',
        as_attachment=True,
        filename=f"{payslip.slip_number}.pdf"
    )
    return response
```

#### Delete and Regenerate
```
Regenerate PDF:
1. Delete old PDF file
2. Generate new PDF
3. Save to same field
4. Old file removed from storage

if payslip.pdf_file:
    old_file = payslip.pdf_file
    old_file.delete(save=False)

payslip.pdf_file.save(...)
```

### Storage Backend Considerations

#### Local Filesystem Storage
```
Settings:
- MEDIA_ROOT = '/path/to/media'
- MEDIA_URL = '/media/'

Access:
- URL: /media/payslips/t_abc/2026/01/PAY-2026-01-001.pdf
- Path: /path/to/media/payslips/t_abc/2026/01/PAY-2026-01-001.pdf
```

#### S3 Storage (Production)
```
Settings:
- DEFAULT_FILE_STORAGE = 'storages.backends.s3boto3.S3Boto3Storage'
- AWS_STORAGE_BUCKET_NAME = 'lcc-payslips'
- AWS_S3_REGION_NAME = 'ap-south-1'

Access:
- URL: https://lcc-payslips.s3.amazonaws.com/payslips/...
- Automatic URL signing for private files
```

### File Access Control

1. **Tenant Isolation**
   - Files stored in tenant-specific directories
   - Path includes tenant ID
   - Prevents cross-tenant access

2. **Authentication Required**
   - API endpoint checks user authentication
   - Verify user belongs to correct tenant
   - Check employee access permissions

3. **Direct URL Protection**
   - Consider private storage
   - Generate signed URLs for S3
   - Expire URLs after time limit

### Model Properties

#### pdf_url Property
```
@property
def pdf_url(self):
    """Return URL for PDF file if it exists."""
    if self.pdf_file:
        return self.pdf_file.url
    return None

Usage:
- Template: {{ payslip.pdf_url }}
- API: response includes pdf_url
```

#### has_pdf Property
```
@property
def has_pdf(self):
    """Check if PDF file exists."""
    return bool(self.pdf_file)

Usage:
- Template: {% if payslip.has_pdf %}
- API: "pdf_available": payslip.has_pdf
```

### File Size and Format

| Property | Value | Notes |
|----------|-------|-------|
| Format | PDF | Portable Document Format |
| Typical Size | 50-200 KB | Depends on content |
| Max Size | Consider limit | e.g., 5 MB |
| Compression | Optional | Reduce storage costs |

### Expected Outcome
- PDF file field added for storage
- Dynamic path generation with tenant isolation
- File management methods implemented
- Storage backend agnostic

### Verification Checklist
- [ ] pdf_file FileField added
- [ ] upload_to function defined
- [ ] null=True, blank=True configured
- [ ] Storage path includes tenant_id/year/month
- [ ] pdf_url property added
- [ ] has_pdf property added
- [ ] Docstring comments added

---

## Task 12: Add Payslip Sent Fields

### Overview
Add fields to track email distribution of payslips, including whether an email was sent, when it was sent, and to which address. These fields enable email status tracking and resend capabilities.

### Dependencies
- Task 04: Create Payslip Model

### Instructions

1. **Open payslip model file**
   - Navigate to `apps/payslip/models/payslip.py`
   - Locate Payslip model class
   - Prepare to add email tracking fields

2. **Add email_sent field**
   - Field name: email_sent
   - Type: BooleanField
   - Default: False
   - Tracks if email was sent

3. **Add sent_at field**
   - Field name: sent_at
   - Type: DateTimeField
   - Set null=True, blank=True
   - Records timestamp of sending

4. **Add sent_to field**
   - Field name: sent_to
   - Type: EmailField
   - Set null=True, blank=True
   - Stores recipient email address

5. **Configure field options**
   - Set verbose_name for each field
   - Add help_text explaining purpose
   - Add db_index to email_sent for filtering

6. **Document email logic**
   - Add comments explaining field updates
   - Note that fields updated by emailer service
   - Explain resend scenarios

### Email Tracking Fields Configuration

| Field | Type | Null | Default | Purpose |
|-------|------|------|---------|---------|
| email_sent | BooleanField | False | False | Whether email was sent |
| sent_at | DateTimeField | True | None | When email was sent |
| sent_to | EmailField | True | None | Recipient email address |

### Email Tracking Workflow

```
Email Distribution Process:

1. Initial State
   - email_sent: False
   - sent_at: None
   - sent_to: None
   - status: GENERATED

2. Email Sending Triggered
   - Get employee email
   - Attach PDF file
   - Send via SMTP

3. Email Successfully Sent
   - Set email_sent = True
   - Set sent_at = timezone.now()
   - Set sent_to = employee.email
   - Update status to SENT

4. Email Send Failure
   - email_sent remains False
   - sent_at remains None
   - Log error for retry
   - Status remains GENERATED
```

### Usage Scenarios

#### Filter Unsent Payslips
```
Query payslips ready for email:
- status = GENERATED
- email_sent = False
- Has PDF file

Payslip.objects.filter(
    status='GENERATED',
    email_sent=False,
    pdf_file__isnull=False
)
```

#### Resend Email
```
Resend scenario:
- User requests resend
- Check if pdf_file exists
- Send email again
- Update sent_at (new timestamp)
- email_sent remains True
- sent_to may update if email changed
```

#### Email Delivery Report
```
Period email report:
- Total payslips: 50
- Email sent: 48 (96%)
- Pending: 2 (4%)
- Average send time: 2 seconds
- Failed sends: 0
```

#### Admin Filters
```
Django Admin filters:
- email_sent (Yes/No)
- sent_at date range
- Compare sent vs viewed
```

### Email Address Handling

```
Determine Recipient Email:

1. Primary: Employee.email
   - Main work email
   - Most common scenario

2. Alternative: Employee.personal_email
   - If employee prefers
   - Configurable in settings

3. Fallback: User.email
   - If employee model has no email
   - Link via employee.user

4. Validation
   - Verify email format
   - Check for bounce history
   - Confirm consent (GDPR)
```

### Resend Scenarios

#### Scenario 1: Employee Requests Resend
```
Flow:
1. Employee: "I didn't receive email"
2. Admin: Verify email address
3. Admin: Click resend action
4. System: Send email again
5. Update: sent_at = new timestamp
6. Update: sent_to = current email
```

#### Scenario 2: Email Address Change
```
Flow:
1. Employee updates email address
2. Admin: Regenerate or resend
3. System: Send to new email
4. Update: sent_to = new email
5. Update: sent_at = new timestamp
```

#### Scenario 3: Bulk Resend
```
Flow:
1. Email server issue detected
2. Filter: sent_at in problem timeframe
3. Bulk resend to affected payslips
4. Update sent_at for each
5. Track resend count separately
```

### Email Delivery Tracking

```
Tracking Levels:

1. Sent (Basic)
   - email_sent = True
   - Email left our server

2. Delivered (Advanced)
   - Email reached recipient server
   - Requires SMTP tracking
   - Or external service (SendGrid, etc.)

3. Opened (Advanced)
   - Recipient opened email
   - Tracking pixel required
   - Privacy concerns

4. Link Clicked (Current)
   - Employee views payslip
   - Tracked via first_viewed_at
   - More reliable than email opens
```

### Related Status Updates

```
Status Transitions with Email:

GENERATED + email_sent=False
    │
    ├─→ [Send email succeeds]
    │
    ▼
SENT + email_sent=True + sent_at=now
    │
    ├─→ [Employee views]
    │
    ▼
VIEWED
```

### Database Indexes

```
Indexing strategy:

1. email_sent field
   - db_index=True
   - Fast filtering: sent vs unsent
   - Used in bulk email queries

2. sent_at field
   - Optional index
   - If filtering by date range
   - Consider composite index

3. Combined index (optional)
   - (status, email_sent)
   - Optimize: WHERE status='GENERATED' AND email_sent=False
```

### Expected Outcome
- Email tracking fields added
- Distribution status tracked
- Foundation for resend capability
- Email reporting enabled

### Verification Checklist
- [ ] email_sent BooleanField added (default=False)
- [ ] sent_at DateTimeField added (null=True)
- [ ] sent_to EmailField added (null=True)
- [ ] db_index=True on email_sent
- [ ] Verbose names and help text added
- [ ] Docstring comments added

---

## Task 13: Add Payslip View Tracking

### Overview
Add fields to track when employees view their payslips and how many times they've been viewed. This tracking provides engagement metrics and confirms delivery to employees.

### Dependencies
- Task 04: Create Payslip Model

### Instructions

1. **Open payslip model file**
   - Navigate to `apps/payslip/models/payslip.py`
   - Locate Payslip model class
   - Prepare to add view tracking fields

2. **Add first_viewed_at field**
   - Field name: first_viewed_at
   - Type: DateTimeField
   - Set null=True, blank=True
   - Records timestamp of first view

3. **Add view_count field**
   - Field name: view_count
   - Type: PositiveIntegerField
   - Default: 0
   - Counts total views

4. **Configure field options**
   - Set verbose_name for each field
   - Add help_text explaining purpose
   - first_viewed_at: 'When employee first viewed'
   - view_count: 'Number of times viewed'

5. **Document tracking logic**
   - Add comments explaining when fields update
   - Note first view vs subsequent views
   - Explain status transition to VIEWED

### View Tracking Fields Configuration

| Field | Type | Null | Default | Purpose |
|-------|------|------|---------|---------|
| first_viewed_at | DateTimeField | True | None | First view timestamp |
| view_count | PositiveIntegerField | False | 0 | Total view count |

### View Tracking Logic

```
Employee Payslip View Flow:

1. Employee Opens Payslip
   - Authenticate employee
   - Verify payslip ownership
   - Load payslip detail

2. First View Detection
   - Check if first_viewed_at is None
   - If None: This is first view
   - Set first_viewed_at = timezone.now()
   - Update status to VIEWED

3. Increment View Count
   - Always increment view_count
   - view_count += 1
   - Track every access

4. Subsequent Views
   - first_viewed_at unchanged
   - view_count continues incrementing
   - Status remains VIEWED or DOWNLOADED
```

### Implementation in ViewSet

```
PayslipViewSet retrieve method:

def retrieve(self, request, *args, **kwargs):
    payslip = self.get_object()
    
    # Track first view
    if payslip.first_viewed_at is None:
        payslip.first_viewed_at = timezone.now()
        if payslip.status == 'GENERATED' or payslip.status == 'SENT':
            payslip.status = 'VIEWED'
    
    # Increment view count
    payslip.view_count += 1
    payslip.save(update_fields=['first_viewed_at', 'view_count', 'status'])
    
    # Return payslip data
    serializer = self.get_serializer(payslip)
    return Response(serializer.data)
```

### Usage Scenarios

#### Employee Engagement Metrics
```
Calculate engagement:
- Total payslips sent: 50
- Viewed by employees: 42 (84%)
- Not viewed: 8 (16%)
- Average views per payslip: 2.3
```

#### Time to First View
```
Calculate response time:
- sent_at: 2026-01-20 09:00
- first_viewed_at: 2026-01-20 14:30
- Time to view: 5.5 hours
- Track average for all payslips
```

#### Repeated Access Tracking
```
Analyze view patterns:
- view_count = 1: Employee viewed once
- view_count = 5: Employee accessed multiple times
- High count may indicate questions/concerns
```

#### Admin Dashboard Widgets
```
Dashboard metrics:
- Payslips viewed today: 23
- Pending views: 12
- Average view count: 2.1
- Most viewed payslip: 8 times
```

### Status Transition with View

```
Status Update on First View:

GENERATED + first_viewed_at=None
    │
    ├─→ [Employee opens payslip]
    │
    ▼
VIEWED + first_viewed_at=now + view_count=1

SENT + first_viewed_at=None
    │
    ├─→ [Employee opens payslip]
    │
    ▼
VIEWED + first_viewed_at=now + view_count=1
```

### Multiple View Handling

```
Subsequent Views:

VIEWED + view_count=1
    │
    ├─→ [Employee opens again]
    │
    ▼
VIEWED + view_count=2
    │
    ├─→ [Employee opens again]
    │
    ▼
VIEWED + view_count=3

Note: first_viewed_at never changes after initial set
```

### Reporting Queries

#### View Rate by Period
```
Calculate view statistics:

SELECT 
    payroll_period,
    COUNT(*) as total,
    COUNT(first_viewed_at) as viewed,
    AVG(view_count) as avg_views
FROM payslips
GROUP BY payroll_period
```

#### Unviewed Payslips
```
Find payslips not yet viewed:

Payslip.objects.filter(
    status__in=['GENERATED', 'SENT'],
    first_viewed_at__isnull=True,
    email_sent=True,
    sent_at__lt=timezone.now() - timedelta(days=3)
)

Alert HR: "12 payslips sent 3+ days ago not yet viewed"
```

#### High View Count Investigation
```
Find repeatedly accessed payslips:

Payslip.objects.filter(
    view_count__gte=5
).select_related('employee')

Possible reasons:
- Employee confused about content
- Checking multiple times
- Issues with payroll calculation
```

### Privacy and Data Considerations

1. **Employee Privacy**
   - Tracking is for metrics only
   - Don't use punitively
   - Aggregate for reporting

2. **Data Retention**
   - Keep view history
   - Part of audit trail
   - Comply with data laws

3. **Transparency**
   - Inform employees of tracking
   - Include in privacy policy
   - Display view count to employee

### Performance Optimization

```
Atomic Update for View Count:

from django.db.models import F

# Increment without race conditions
Payslip.objects.filter(id=payslip_id).update(
    view_count=F('view_count') + 1
)

Benefits:
- No race condition
- Database-level increment
- Better for concurrent access
```

### Expected Outcome
- View tracking fields added
- Employee engagement measurable
- First view timestamp captured
- Multiple view counting enabled

### Verification Checklist
- [ ] first_viewed_at DateTimeField added (null=True)
- [ ] view_count PositiveIntegerField added (default=0)
- [ ] Verbose names and help text added
- [ ] Docstring comments explain tracking logic
- [ ] Status transition logic documented

---

## Task 14: Add Payslip Download Tracking

### Overview
Add fields to track when employees download their payslip PDFs and how many times they've been downloaded. This tracking confirms final delivery and provides additional engagement metrics.

### Dependencies
- Task 04: Create Payslip Model
- Task 11: Add Payslip PDF File Field

### Instructions

1. **Open payslip model file**
   - Navigate to `apps/payslip/models/payslip.py`
   - Locate Payslip model class
   - Prepare to add download tracking fields

2. **Add download_count field**
   - Field name: download_count
   - Type: PositiveIntegerField
   - Default: 0
   - Counts total downloads

3. **Add last_downloaded_at field**
   - Field name: last_downloaded_at
   - Type: DateTimeField
   - Set null=True, blank=True
   - Records timestamp of most recent download

4. **Configure field options**
   - Set verbose_name for each field
   - Add help_text explaining purpose
   - download_count: 'Number of times downloaded'
   - last_downloaded_at: 'Most recent download time'

5. **Document tracking logic**
   - Add comments explaining when fields update
   - Note download vs view distinction
   - Explain status transition to DOWNLOADED

### Download Tracking Fields Configuration

| Field | Type | Null | Default | Purpose |
|-------|------|------|---------|---------|
| download_count | PositiveIntegerField | False | 0 | Total download count |
| last_downloaded_at | DateTimeField | True | None | Latest download timestamp |

### Download Tracking Logic

```
Employee PDF Download Flow:

1. Employee Clicks Download
   - Authenticated and authorized
   - Verify PDF file exists
   - Prepare file response

2. Track Download
   - Increment download_count
   - Update last_downloaded_at = timezone.now()
   - Update status to DOWNLOADED (if not already)

3. Serve PDF File
   - Stream file to browser
   - Set content-disposition: attachment
   - Set filename

4. Subsequent Downloads
   - download_count continues incrementing
   - last_downloaded_at updates to latest
   - Status remains DOWNLOADED
```

### Implementation in ViewSet

```
Download endpoint:

@action(detail=True, methods=['get'])
def download(self, request, pk=None):
    payslip = self.get_object()
    
    # Verify PDF exists
    if not payslip.pdf_file:
        return Response(
            {'error': 'PDF not available'},
            status=404
        )
    
    # Track download
    payslip.download_count += 1
    payslip.last_downloaded_at = timezone.now()
    if payslip.status in ['GENERATED', 'SENT', 'VIEWED']:
        payslip.status = 'DOWNLOADED'
    payslip.save(update_fields=[
        'download_count', 
        'last_downloaded_at', 
        'status'
    ])
    
    # Serve file
    response = FileResponse(
        payslip.pdf_file.open('rb'),
        content_type='application/pdf',
        as_attachment=True,
        filename=f"{payslip.slip_number}.pdf"
    )
    return response
```

### Usage Scenarios

#### Download Confirmation
```
Verify delivery:
- Payslips with download_count > 0: 38 (76%)
- Payslips never downloaded: 12 (24%)
- Employee has PDF copy confirmed
```

#### Download Patterns
```
Analyze download behavior:
- Average downloads per payslip: 1.5
- Multiple downloads: 18 payslips (36%)
- Reasons for multiple:
  * Lost file
  * Downloaded to multiple devices
  * Printed multiple copies
```

#### Recent Activity
```
Track recent downloads:
- Downloads in last 24 hours: 15
- Downloads in last 7 days: 42
- Most recent: PAY-2026-01-045 (2 minutes ago)
```

#### Delivery Confirmation Report
```
Period delivery report:
- Total payslips: 50
- Downloaded: 38 (76%)
- Viewed but not downloaded: 4 (8%)
- Not viewed: 8 (16%)
```

### Status Transition with Download

```
Status Update on Download:

VIEWED + download_count=0
    │
    ├─→ [Employee downloads PDF]
    │
    ▼
DOWNLOADED + download_count=1 + last_downloaded_at=now

SENT + download_count=0
    │
    ├─→ [Employee downloads PDF directly]
    │
    ▼
DOWNLOADED + download_count=1 + last_downloaded_at=now
```

### View vs Download Distinction

```
View: Employee opens payslip in browser/app
- first_viewed_at set
- view_count incremented
- Status → VIEWED
- No file downloaded

Download: Employee downloads PDF file
- download_count incremented
- last_downloaded_at set
- Status → DOWNLOADED
- File saved to device

Typical Flow:
1. View first (in browser)
2. Download later (save copy)
```

### Reporting Queries

#### Download Rate by Period
```
Calculate download statistics:

SELECT 
    payroll_period,
    COUNT(*) as total,
    COUNT(CASE WHEN download_count > 0 THEN 1 END) as downloaded,
    AVG(download_count) as avg_downloads
FROM payslips
GROUP BY payroll_period
```

#### Never Downloaded
```
Find payslips never downloaded:

Payslip.objects.filter(
    download_count=0,
    email_sent=True,
    sent_at__lt=timezone.now() - timedelta(days=7)
).select_related('employee')

Alert: "15 payslips sent 7+ days ago never downloaded"
```

#### Multiple Downloads
```
Find repeatedly downloaded payslips:

Payslip.objects.filter(
    download_count__gte=3
).order_by('-download_count')

Investigate high count:
- Technical issues?
- Employee lost file?
- Printing multiple copies?
```

### Timestamp Tracking

```
Download Timestamps:

First download:
- download_count: 0 → 1
- last_downloaded_at: None → 2026-01-20 15:00

Second download:
- download_count: 1 → 2
- last_downloaded_at: 2026-01-20 15:00 → 2026-01-22 09:30

Third download:
- download_count: 2 → 3
- last_downloaded_at: 2026-01-22 09:30 → 2026-01-25 14:15

Note: Only most recent timestamp stored
      (not full download history)
```

### Atomic Update for Concurrency

```
Handle concurrent downloads:

from django.db.models import F

Payslip.objects.filter(id=payslip_id).update(
    download_count=F('download_count') + 1,
    last_downloaded_at=timezone.now()
)

Benefits:
- Race condition safe
- Database-level increment
- Accurate count even with simultaneous downloads
```

### Download Analytics

1. **Delivery Verification**
   - Confirm employee received payslip
   - Downloaded = tangible confirmation
   - More reliable than email open tracking

2. **Engagement Measurement**
   - Download rate indicates engagement
   - Time from send to download
   - Multiple downloads pattern

3. **Technical Issues**
   - No downloads may indicate problems
   - Email not received
   - Link not working
   - PDF not accessible

### Expected Outcome
- Download tracking fields added
- PDF download confirmation available
- Download patterns measurable
- Final delivery status tracked

### Verification Checklist
- [ ] download_count PositiveIntegerField added (default=0)
- [ ] last_downloaded_at DateTimeField added (null=True)
- [ ] Verbose names and help text added
- [ ] Docstring comments explain tracking logic
- [ ] Status transition to DOWNLOADED documented

---

## Task 15: Run Payslip Migrations

### Overview
Generate and apply Django migrations to create the Payslip model and related tables in the database. This task translates the model definitions into database schema changes.

### Dependencies
- Task 04: Create Payslip Model
- All model fields added (Tasks 05-14)
- Task 16: Constraints (can be separate migration)

### Instructions

1. **Verify model is complete**
   - Review `apps/payslip/models/payslip.py`
   - Ensure all fields from Tasks 04-14 are added
   - Check imports are correct
   - Verify no syntax errors

2. **Run makemigrations command**
   - Open terminal in project root
   - Activate virtual environment
   - Run: `python manage.py makemigrations payslip`
   - Review generated migration file

3. **Review migration file**
   - Navigate to `apps/payslip/migrations/`
   - Open generated file (e.g., 0001_payslip.py)
   - Verify all fields present
   - Check foreign key relationships

4. **Test migration on development database**
   - Backup database first (if existing data)
   - Run: `python manage.py migrate payslip`
   - Verify no errors
   - Check migration applied successfully

5. **Verify schema in database**
   - Use database client or Django shell
   - Inspect payslip table structure
   - Verify all columns created
   - Check indexes and constraints

6. **Test in multi-tenant context**
   - Verify migration runs for tenant schemas
   - Check public schema not affected
   - Test with sample tenant

7. **Document migration**
   - Add comments to migration file if needed
   - Note any special considerations
   - Update deployment documentation

### Migration Process Overview

```
Migration Workflow:

1. Model Definition
   ├── apps/payslip/models/payslip.py
   └── All fields defined

2. Generate Migration
   ├── Run: makemigrations payslip
   ├── Django detects changes
   └── Creates: 0001_payslip.py

3. Review Migration File
   ├── Check CreateModel operation
   ├── Verify all fields listed
   └── Confirm dependencies correct

4. Apply Migration
   ├── Run: migrate payslip
   ├── Creates database table
   └── Applies indexes and constraints

5. Verification
   ├── Inspect database schema
   ├── Test model in Django shell
   └── Confirm multi-tenant isolation
```

### Expected Migration File Structure

```python
# Generated migration file: 0001_payslip.py

from django.db import migrations, models
import django.db.models.deletion
import uuid

class Migration(migrations.Migration):
    
    initial = True
    
    dependencies = [
        ('hr', '0001_initial'),
        ('payroll', '0010_employee_payroll'),
        ('core', '0001_initial'),  # for Client/tenant
    ]
    
    operations = [
        migrations.CreateModel(
            name='Payslip',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, primary_key=True)),
                ('slip_number', models.CharField(max_length=50, unique=True)),
                ('status', models.CharField(max_length=20, choices=[...], default='DRAFT')),
                ('generated_at', models.DateTimeField(null=True, blank=True)),
                ('pdf_file', models.FileField(upload_to=..., null=True, blank=True)),
                ('email_sent', models.BooleanField(default=False, db_index=True)),
                ('sent_at', models.DateTimeField(null=True, blank=True)),
                ('sent_to', models.EmailField(null=True, blank=True)),
                ('first_viewed_at', models.DateTimeField(null=True, blank=True)),
                ('view_count', models.PositiveIntegerField(default=0)),
                ('download_count', models.PositiveIntegerField(default=0)),
                ('last_downloaded_at', models.DateTimeField(null=True, blank=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('tenant', models.ForeignKey(..., to='core.Client')),
                ('employee', models.ForeignKey(..., to='hr.Employee')),
                ('payroll_period', models.ForeignKey(..., to='payroll.PayrollPeriod')),
                ('employee_payroll', models.ForeignKey(..., to='payroll.EmployeePayroll')),
                ('generated_by', models.ForeignKey(..., to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'verbose_name': 'Payslip',
                'verbose_name_plural': 'Payslips',
                'db_table': 'payslip_payslip',
                'ordering': ['-created_at'],
            },
        ),
    ]
```

### Multi-Tenant Migration Considerations

```
Tenant Schema Behavior:

1. TENANT_APPS Migration
   - Payslip is in TENANT_APPS
   - Migration creates table in each tenant schema
   - Not created in public schema

2. Running Migrations
   - Run on template schema first
   - New tenants get schema from template
   - Existing tenants migrate individually

3. Commands
   - Migrate all tenants: migrate_schemas --shared
   - Migrate specific tenant: migrate_schemas --tenant=<id>
   - Migrate template: migrate
```

### Database Table Structure

```
Table: payslip_payslip (in each tenant schema)

Columns:
├── id (uuid, PK)
├── tenant_id (uuid, FK → client)
├── employee_id (uuid, FK → employee)
├── payroll_period_id (uuid, FK → payroll_period)
├── employee_payroll_id (uuid, FK → employee_payroll)
├── slip_number (varchar(50), unique)
├── status (varchar(20))
├── generated_at (timestamp, nullable)
├── generated_by_id (uuid, FK → user, nullable)
├── pdf_file (varchar(100), nullable)
├── email_sent (boolean, default=false, indexed)
├── sent_at (timestamp, nullable)
├── sent_to (varchar(254), nullable)
├── first_viewed_at (timestamp, nullable)
├── view_count (integer, default=0)
├── download_count (integer, default=0)
├── last_downloaded_at (timestamp, nullable)
├── created_at (timestamp)
└── updated_at (timestamp)

Indexes:
├── PRIMARY KEY (id)
├── UNIQUE (slip_number)
├── INDEX (tenant_id)
├── INDEX (employee_id)
├── INDEX (payroll_period_id)
├── INDEX (employee_payroll_id)
└── INDEX (email_sent)

Foreign Keys:
├── tenant_id → core_client.id
├── employee_id → hr_employee.id
├── payroll_period_id → payroll_payrollperiod.id
├── employee_payroll_id → payroll_employeepayroll.id
└── generated_by_id → auth_user.id
```

### Verification Steps

#### 1. Django Shell Verification
```python
python manage.py shell

from apps.payslip.models import Payslip
from apps.hr.models import Employee
from apps.payroll.models import PayrollPeriod, EmployeePayroll

# Test model import
print(Payslip._meta.fields)

# Test creation (with valid FKs)
payslip = Payslip.objects.create(
    tenant=tenant,
    employee=employee,
    payroll_period=period,
    employee_payroll=emp_payroll,
    slip_number='TEST-2026-01-001',
    status='DRAFT'
)
print(payslip)
```

#### 2. Database Client Verification
```sql
-- Check table exists
SELECT * FROM payslip_payslip LIMIT 1;

-- Check indexes
SELECT indexname FROM pg_indexes 
WHERE tablename = 'payslip_payslip';

-- Check constraints
SELECT conname FROM pg_constraint 
WHERE conrelid = 'payslip_payslip'::regclass;
```

### Migration Dependencies

```
Payslip migration depends on:

1. hr app migrations
   - Employee model must exist
   - Required for employee FK

2. payroll app migrations
   - PayrollPeriod model must exist
   - EmployeePayroll model must exist
   - Required for period and payroll FKs

3. core app migrations
   - Client model must exist
   - Required for tenant FK

4. auth migrations
   - User model must exist
   - Required for generated_by FK

Dependencies order:
core → hr → payroll → payslip
```

### Rollback Procedure

```
If migration needs rollback:

1. Identify migration number
   python manage.py showmigrations payslip

2. Rollback to previous
   python manage.py migrate payslip 0000_previous

3. Delete migration file
   rm apps/payslip/migrations/0001_payslip.py

4. Fix model issues

5. Regenerate migration
   python manage.py makemigrations payslip

6. Apply again
   python manage.py migrate payslip
```

### Expected Outcome
- Migration file generated
- Database table created in tenant schemas
- All fields and indexes present
- Model ready for use

### Verification Checklist
- [ ] `python manage.py makemigrations payslip` executed successfully
- [ ] Migration file created in migrations/ directory
- [ ] `python manage.py migrate payslip` executed successfully
- [ ] No migration errors
- [ ] Database table exists in tenant schema
- [ ] All columns present in database
- [ ] Foreign keys correctly configured
- [ ] Indexes created (slip_number, employee_id, etc.)
- [ ] Model accessible in Django shell

---

## Task 16: Add Payslip Model Constraints

### Overview
Add model-level constraints to enforce business rules, including a unique constraint ensuring only one payslip per employee per payroll period. This prevents duplicate payslip generation and maintains data integrity.

### Dependencies
- Task 04: Create Payslip Model
- Task 05: Add Employee FK
- Task 06: Add Period FK

### Instructions

1. **Open payslip model file**
   - Navigate to `apps/payslip/models/payslip.py`
   - Locate Payslip model Meta class
   - Prepare to add constraints

2. **Add unique_together constraint**
   - In Meta class, add unique_together
   - Combine: ['employee', 'payroll_period']
   - Ensures one payslip per employee per period

3. **Add alternative: UniqueConstraint**
   - Modern approach using constraints attribute
   - More flexible and descriptive
   - Can add condition (e.g., exclude deleted)

4. **Add database indexes**
   - Add indexes list to Meta class
   - Composite index for common queries
   - Optimize filtering and lookups

5. **Document constraint purpose**
   - Add comments explaining business rule
   - Note regeneration handling
   - Explain uniqueness scope

6. **Generate migration for constraints**
   - Run makemigrations again
   - Creates new migration with AlterUniqueTogether
   - Apply migration

7. **Test constraint enforcement**
   - Attempt to create duplicate payslip
   - Verify IntegrityError raised
   - Confirm constraint working

### Unique Constraint Configuration

```
Business Rule:
One payslip per employee per payroll period

Implementation Options:

Option 1: unique_together (Classic)
class Meta:
    unique_together = ['employee', 'payroll_period']

Option 2: UniqueConstraint (Modern)
class Meta:
    constraints = [
        models.UniqueConstraint(
            fields=['employee', 'payroll_period'],
            name='unique_payslip_per_employee_period'
        )
    ]
```

### Constraint Rationale

```
Why One Payslip Per Employee Per Period?

1. Data Integrity
   - Each period has one finalized payroll calc
   - One official payslip document
   - Prevents duplicate records

2. Historical Accuracy
   - Clear audit trail
   - One record per period
   - Update existing for changes

3. Regeneration Handling
   - Update same payslip record
   - Replace PDF file
   - Update timestamps
   - No duplicate creation

4. Query Simplicity
   - Predictable: get() instead of filter()
   - No ambiguity in "latest" payslip
   - Clean relationship structure
```

### Create or Update Pattern

```
Safe payslip creation with constraint:

from django.core.exceptions import IntegrityError

def create_or_update_payslip(employee, period, payroll):
    try:
        # Try to get existing
        payslip = Payslip.objects.get(
            employee=employee,
            payroll_period=period
        )
        # Update existing
        payslip.employee_payroll = payroll
        payslip.status = 'DRAFT'  # Reset for regeneration
        payslip.save()
        
    except Payslip.DoesNotExist:
        # Create new
        payslip = Payslip.objects.create(
            tenant=employee.tenant,
            employee=employee,
            payroll_period=period,
            employee_payroll=payroll,
            status='DRAFT'
        )
    
    return payslip
```

### Using get_or_create

```
Simplified with get_or_create:

payslip, created = Payslip.objects.get_or_create(
    employee=employee,
    payroll_period=period,
    defaults={
        'tenant': employee.tenant,
        'employee_payroll': payroll,
        'status': 'DRAFT'
    }
)

if not created:
    # Existing payslip found, update if needed
    payslip.employee_payroll = payroll
    payslip.status = 'DRAFT'  # Reset for regeneration
    payslip.save()
```

### Regeneration Workflow

```
Regenerate Payslip Scenario:

1. Payroll Data Corrected
   - Employee overtime hours adjusted
   - EmployeePayroll recalculated
   - Need to regenerate payslip

2. Get Existing Payslip
   - Use unique constraint to fetch
   - payslip = Payslip.objects.get(
       employee=emp, payroll_period=period)

3. Update and Regenerate
   - Keep same payslip record
   - Update employee_payroll FK if changed
   - Delete old PDF file
   - Generate new PDF
   - Update generated_at timestamp
   - Update status to GENERATED

4. Maintain History
   - created_at unchanged (original creation)
   - updated_at reflects regeneration
   - Slip number unchanged
   - Audit trail preserved
```

### Additional Indexes

```
Optimize Common Queries:

class Meta:
    indexes = [
        # Composite index for tenant + period filtering
        models.Index(
            fields=['tenant', 'payroll_period'],
            name='payslip_tenant_period_idx'
        ),
        
        # Index for status filtering
        models.Index(
            fields=['status', 'email_sent'],
            name='payslip_status_email_idx'
        ),
        
        # Index for date range queries
        models.Index(
            fields=['created_at'],
            name='payslip_created_idx'
        ),
    ]

Optimizes queries like:
- Payslip.objects.filter(tenant=t, payroll_period=p)
- Payslip.objects.filter(status='GENERATED', email_sent=False)
- Payslip.objects.filter(created_at__gte=date)
```

### Complete Meta Class

```python
class Meta:
    verbose_name = 'Payslip'
    verbose_name_plural = 'Payslips'
    db_table = 'payslip_payslip'
    ordering = ['-created_at']
    
    # Unique constraint: one payslip per employee per period
    constraints = [
        models.UniqueConstraint(
            fields=['employee', 'payroll_period'],
            name='unique_payslip_per_employee_period'
        )
    ]
    
    # Indexes for query optimization
    indexes = [
        models.Index(
            fields=['tenant', 'payroll_period'],
            name='payslip_tenant_period_idx'
        ),
        models.Index(
            fields=['status', 'email_sent'],
            name='payslip_status_email_idx'
        ),
    ]
```

### Migration for Constraints

```
Generate and apply migration:

1. Generate
   python manage.py makemigrations payslip
   
   Creates: 0002_payslip_constraints.py

2. Review
   Check AddConstraint operations
   Verify index creations

3. Apply
   python manage.py migrate payslip
   
   Creates database constraint
   Creates indexes

4. Verify
   Check database for constraint:
   \d payslip_payslip (PostgreSQL)
```

### Constraint Violation Handling

```
Handle duplicate attempts:

from django.db import IntegrityError

try:
    payslip = Payslip.objects.create(
        employee=employee,
        payroll_period=period,
        # ... other fields
    )
except IntegrityError as e:
    # Constraint violated
    if 'unique_payslip_per_employee_period' in str(e):
        # Duplicate employee-period combination
        # Fetch and update existing instead
        payslip = Payslip.objects.get(
            employee=employee,
            payroll_period=period
        )
        # Update as needed
```

### Testing Constraints

```
Test constraint enforcement:

from django.test import TestCase
from django.db import IntegrityError

class PayslipConstraintTest(TestCase):
    
    def test_unique_employee_period(self):
        # Create first payslip
        payslip1 = Payslip.objects.create(
            tenant=self.tenant,
            employee=self.employee,
            payroll_period=self.period,
            employee_payroll=self.emp_payroll
        )
        
        # Attempt duplicate
        with self.assertRaises(IntegrityError):
            payslip2 = Payslip.objects.create(
                tenant=self.tenant,
                employee=self.employee,  # Same employee
                payroll_period=self.period,  # Same period
                employee_payroll=self.emp_payroll
            )
    
    def test_different_period_allowed(self):
        # Same employee, different periods - should succeed
        payslip1 = Payslip.objects.create(
            employee=self.employee,
            payroll_period=self.period1,
            # ...
        )
        
        payslip2 = Payslip.objects.create(
            employee=self.employee,
            payroll_period=self.period2,  # Different period
            # ...
        )
        
        # Should succeed
        self.assertIsNotNone(payslip2.id)
```

### Expected Outcome
- Unique constraint enforces one payslip per employee-period
- Database-level integrity maintained
- Duplicate prevention automatic
- Regeneration pattern supported

### Verification Checklist
- [ ] unique_together or UniqueConstraint added to Meta
- [ ] Constraint on ['employee', 'payroll_period']
- [ ] Migration generated for constraints
- [ ] Migration applied successfully
- [ ] Database constraint visible in schema
- [ ] Duplicate creation raises IntegrityError
- [ ] get_or_create pattern works correctly
- [ ] Additional indexes added if needed

---

## Summary

This document completed the Payslip model with all tracking and management fields:

1. **Status Field** - Lifecycle tracking (DRAFT → GENERATED → SENT → VIEWED → DOWNLOADED)
2. **Generation Fields** - Timestamp and user attribution for PDF creation
3. **PDF File Field** - Storage for generated payslip documents with dynamic paths
4. **Email Tracking** - Sent status, timestamp, and recipient tracking
5. **View Tracking** - First view timestamp and total view count
6. **Download Tracking** - Download count and last download timestamp
7. **Migrations** - Database schema created with all fields and indexes
8. **Constraints** - Unique constraint ensuring one payslip per employee per period

The Payslip model is now complete with:
- Full lifecycle status tracking
- Comprehensive audit trail
- PDF storage and delivery
- Email distribution tracking  
- Employee engagement metrics (views and downloads)
- Data integrity constraints
- Multi-tenant isolation
- Performance-optimized indexes

The model supports:
- Bulk payslip generation for periods
- Email distribution campaigns
- Employee self-service access
- Regeneration without duplication
- Reporting and analytics
- Compliance and audit requirements

Next phase will implement line item models (earnings, deductions, contributions) and template configuration.
