# Tasks 79-84: Admin API Endpoints

> **Phase:** 06 - ERP Advanced Modules  
> **SubPhase:** 07 - Payslip Generation  
> **Group:** F - API, Testing & Documentation  
> **Document:** 01 of 02  
> **Tasks Covered:** 79, 80, 81, 82, 83, 84

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **→ Next Document:** [02_Tasks-85-88_Tests-Documentation.md](02_Tasks-85-88_Tests-Documentation.md)

---

## Document Overview

This document covers the admin API endpoints for payslip management, including full CRUD operations, PDF generation triggers, and bulk processing capabilities. These endpoints provide administrators with comprehensive control over payslip lifecycle operations through a REST API interface.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 79 | Create Admin Payslip ViewSet | High | 30 min |
| 80 | Add Generate Single Endpoint | Medium | 20 min |
| 81 | Add Bulk Generate Endpoint | Medium | 25 min |
| 82 | Add Send Email Endpoint | Medium | 20 min |
| 83 | Add Bulk Send Email Endpoint | Medium | 25 min |
| 84 | Add Generation Status Endpoint | Medium | 20 min |

---

## Task 79: Create Admin Payslip ViewSet

### Overview
Implement a comprehensive Django REST Framework ViewSet that provides full CRUD (Create, Read, Update, Delete) operations for payslip management. This ViewSet serves as the foundation for all admin-level payslip API interactions and enforces appropriate permissions and filtering.

### Dependencies
- Payslip model (Task 01)
- Payslip serializers (Task 43-49)
- DRF installed and configured
- Authentication system configured

### Instructions

1. **Create admin views module**
   - Navigate to `apps/payslip/views/` directory
   - Create `admin.py` file for admin-specific ViewSets
   - Add module docstring explaining admin API purpose

2. **Import required dependencies**
   - Import ViewSet from `rest_framework.viewsets`
   - Import permissions classes (IsAdminUser, IsAuthenticated)
   - Import Payslip model and related models
   - Import serializers (PayslipSerializer, PayslipListSerializer, PayslipDetailSerializer)
   - Import filters and pagination classes

3. **Define AdminPayslipViewSet class**
   - Inherit from `viewsets.ModelViewSet`
   - ModelViewSet provides list, create, retrieve, update, partial_update, destroy actions
   - Add class docstring explaining ViewSet purpose

4. **Configure ViewSet attributes**
   - Set `permission_classes` to `[IsAuthenticated, IsAdminUser]`
   - Set `filterset_fields` for query parameter filtering
   - Set `search_fields` for search functionality
   - Set `ordering_fields` for result sorting
   - Set `ordering` for default sort order

5. **Implement get_queryset method**
   - Override to filter by tenant context
   - Use `self.request.tenant` from tenant middleware
   - Filter by tenant using `Payslip.objects.filter(tenant=self.request.tenant)`
   - Apply select_related and prefetch_related for optimization
   - Include employee, period, line items in prefetch

6. **Implement get_serializer_class method**
   - Override to return different serializers per action
   - Return PayslipListSerializer for list action
   - Return PayslipDetailSerializer for retrieve action
   - Return PayslipSerializer for create, update, partial_update actions
   - Provides optimized serialization per use case

7. **Add filtering configuration**
   - Configure FilterSet for complex filtering
   - Allow filtering by employee, period, status
   - Allow filtering by date ranges (generated_at, sent_at)
   - Allow filtering by approval status
   - Support combining multiple filters

8. **Add pagination configuration**
   - Set `pagination_class` to PageNumberPagination
   - Configure page size (default 50 items)
   - Allow page_size query parameter override
   - Maximum page size limit (100 items)

9. **Add search configuration**
   - Configure search_fields for full-text search
   - Enable search on payslip number
   - Enable search on employee name (employee__user__first_name, employee__user__last_name)
   - Enable search on employee code (employee__employee_code)

10. **Add ordering configuration**
    - Set default ordering to newest first
    - Allow ordering by slip_number, generated_at, sent_at
    - Allow ordering by employee name
    - Allow ordering by period start/end dates

### ViewSet Architecture

| Component | Purpose |
|-----------|---------|
| ModelViewSet | Provides standard CRUD operations |
| get_queryset | Filters by tenant, optimizes queries |
| get_serializer_class | Returns appropriate serializer per action |
| permission_classes | Enforces admin-only access |
| filterset_fields | Enables query parameter filtering |
| search_fields | Enables text search functionality |
| ordering_fields | Enables result sorting |
| pagination_class | Handles result pagination |

### ViewSet Actions

| Action | HTTP Method | URL Pattern | Purpose |
|--------|-------------|-------------|---------|
| list | GET | `/api/v1/payslip/admin/payslips/` | List all payslips |
| create | POST | `/api/v1/payslip/admin/payslips/` | Create new payslip |
| retrieve | GET | `/api/v1/payslip/admin/payslips/{id}/` | Get single payslip |
| update | PUT | `/api/v1/payslip/admin/payslips/{id}/` | Full update payslip |
| partial_update | PATCH | `/api/v1/payslip/admin/payslips/{id}/` | Partial update payslip |
| destroy | DELETE | `/api/v1/payslip/admin/payslips/{id}/` | Delete payslip |

### Request/Response Examples

**List Payslips (GET)**
```
GET /api/v1/payslip/admin/payslips/?period={period_id}&status=GENERATED

Response (200 OK):
{
  "count": 50,
  "next": "/api/v1/payslip/admin/payslips/?page=2",
  "previous": null,
  "results": [
    {
      "id": "uuid",
      "slip_number": "PAY-2026-01-001",
      "employee": {
        "id": "uuid",
        "code": "EMP001",
        "name": "John Doe"
      },
      "period": {
        "id": "uuid",
        "name": "January 2026"
      },
      "status": "GENERATED",
      "generated_at": "2026-01-20T10:00:00Z",
      "pdf_url": "/media/payslips/.../PAY-2026-01-001.pdf"
    }
  ]
}
```

**Retrieve Payslip (GET)**
```
GET /api/v1/payslip/admin/payslips/{id}/

Response (200 OK):
{
  "id": "uuid",
  "slip_number": "PAY-2026-01-001",
  "employee": { ... },
  "period": { ... },
  "status": "GENERATED",
  "line_items": [
    {
      "category": "EARNING",
      "label": "Basic Salary",
      "amount": "50000.00"
    }
  ],
  "gross_pay": "75000.00",
  "total_deductions": "15000.00",
  "net_pay": "60000.00",
  "ytd_gross": "150000.00",
  "ytd_net": "120000.00"
}
```

**Create Payslip (POST)**
```
POST /api/v1/payslip/admin/payslips/

Request:
{
  "employee": "employee_uuid",
  "period": "period_uuid",
  "line_items": [
    {
      "category": "EARNING",
      "label": "Basic Salary",
      "amount": "50000.00"
    }
  ]
}

Response (201 Created):
{
  "id": "new_uuid",
  "slip_number": "PAY-2026-01-050",
  "employee": { ... },
  "period": { ... },
  "status": "DRAFT",
  "created_at": "2026-01-20T11:00:00Z"
}
```

### Query Parameter Options

| Parameter | Type | Example | Purpose |
|-----------|------|---------|---------|
| period | UUID | `?period={uuid}` | Filter by payroll period |
| employee | UUID | `?employee={uuid}` | Filter by employee |
| status | Choice | `?status=GENERATED` | Filter by status |
| generated_after | Date | `?generated_after=2026-01-01` | Generated after date |
| search | Text | `?search=John` | Search by name/number |
| ordering | Field | `?ordering=-generated_at` | Sort results |
| page_size | Integer | `?page_size=100` | Results per page |

### Permission Requirements

| Requirement | Implementation |
|-------------|----------------|
| Authentication | IsAuthenticated permission class |
| Admin Access | IsAdminUser permission class |
| Tenant Isolation | Filtered in get_queryset method |
| Action-Level | Can add method decorators for specific actions |

### Performance Optimizations

| Optimization | Purpose |
|--------------|---------|
| select_related | Reduce queries for employee, period |
| prefetch_related | Efficiently load line items |
| Pagination | Limit result set size |
| Field selection | Different serializers per action |
| Query filtering | Database-level filtering |

### Expected Outcome
- Complete CRUD API for payslip management
- Admin-only access with proper permissions
- Optimized queries with prefetching
- Flexible filtering and search capabilities
- Paginated results for large datasets

### Verification Checklist
- [ ] `apps/payslip/views/admin.py` file created
- [ ] AdminPayslipViewSet class defined
- [ ] All CRUD actions working (list, create, retrieve, update, delete)
- [ ] Permission classes enforced (IsAdminUser)
- [ ] Tenant filtering applied in get_queryset
- [ ] Select_related and prefetch_related configured
- [ ] Filtering by period, employee, status working
- [ ] Search by name and number working
- [ ] Ordering by various fields working
- [ ] Pagination working correctly
- [ ] Different serializers per action

---

## Task 80: Add Generate Single Endpoint

### Overview
Implement a custom action endpoint that triggers PDF generation for a single payslip. This endpoint initiates the PDF generation process asynchronously and returns immediate feedback about the operation status.

### Dependencies
- Task 79: AdminPayslipViewSet created
- Payslip model with status field
- PDF generator service (Task 25-30)
- Celery task queue configured

### Instructions

1. **Import action decorator**
   - Import `action` decorator from `rest_framework.decorators`
   - Import Response from `rest_framework.response`
   - Import status from `rest_framework`
   - Import Celery task for PDF generation

2. **Define generate custom action**
   - Add `@action` decorator to method
   - Set `detail=True` (operates on single instance)
   - Set `methods=['post']` (POST request required)
   - Set `url_path='generate'` (custom URL segment)

3. **Implement generate method**
   - Accept self and request parameters
   - Get payslip instance using `self.get_object()`
   - Checks permissions and tenant automatically via ViewSet

4. **Validate payslip state**
   - Check if payslip already has PDF generated
   - Optionally allow regeneration based on business rules
   - Return 400 Bad Request if already generated and regeneration not allowed

5. **Update payslip status**
   - Set status to GENERATING
   - Save payslip instance
   - Prepare for async processing

6. **Trigger async PDF generation**
   - Import generate_payslip_pdf Celery task
   - Call task.delay(payslip.id) for async execution
   - Task will update status to GENERATED when complete
   - Task will set pdf_file field with generated file

7. **Return success response**
   - Create response with 202 Accepted status
   - Include payslip ID, slip number
   - Include status (GENERATING)
   - Include message indicating async processing
   - Return Response object

8. **Handle error cases**
   - Wrap in try/except block
   - Catch model validation errors
   - Catch task queue errors
   - Return appropriate error responses (400, 500)

9. **Add method docstring**
   - Explain endpoint purpose
   - Document request format (empty body)
   - Document response format
   - Note async processing behavior

10. **Register endpoint in router**
    - ViewSet automatically registers custom actions
    - Endpoint available at `/api/v1/payslip/admin/payslips/{id}/generate/`
    - No additional router configuration needed

### Action Decorator Configuration

| Parameter | Value | Purpose |
|-----------|-------|---------|
| detail | True | Operates on single instance (requires ID) |
| methods | ['post'] | Only POST requests allowed |
| url_path | 'generate' | URL segment (becomes /generate/) |
| permission_classes | Inherits from ViewSet | Admin-only access |

### Endpoint Details

| Aspect | Value |
|--------|-------|
| URL Pattern | `/api/v1/payslip/admin/payslips/{id}/generate/` |
| HTTP Method | POST |
| Request Body | Empty (operation on URL resource) |
| Response Code | 202 Accepted (async operation) |
| Authentication | Required (admin user) |
| Permissions | IsAdminUser |

### Request/Response Flow

1. **Request Received**
   - POST to `/payslips/{id}/generate/`
   - ViewSet retrieves payslip by ID
   - Checks user has admin permission
   - Checks payslip belongs to user's tenant

2. **Validation**
   - Verify payslip exists and accessible
   - Check if PDF already generated
   - Validate payslip in appropriate state

3. **Async Task Trigger**
   - Update status to GENERATING
   - Queue Celery task with payslip ID
   - Task executes in background worker

4. **Immediate Response**
   - Return 202 Accepted
   - Include payslip details
   - Indicate processing status

5. **Background Processing**
   - Celery worker picks up task
   - Generates PDF using PayslipPDFGenerator
   - Saves PDF to storage
   - Updates payslip status to GENERATED
   - Sets pdf_file field

### Request Example

```
POST /api/v1/payslip/admin/payslips/550e8400-e29b-41d4-a716-446655440000/generate/

Headers:
  Authorization: Bearer {token}
  Content-Type: application/json

Body: (empty)
```

### Success Response Example

```
HTTP/1.1 202 Accepted

{
  "success": true,
  "message": "Payslip PDF generation initiated",
  "payslip_id": "550e8400-e29b-41d4-a716-446655440000",
  "slip_number": "PAY-2026-01-001",
  "status": "GENERATING",
  "initiated_at": "2026-01-20T10:00:00Z"
}
```

### Error Response Examples

**Already Generated**
```
HTTP/1.1 400 Bad Request

{
  "error": "Payslip PDF already generated",
  "current_status": "GENERATED",
  "pdf_url": "/media/payslips/.../PAY-2026-01-001.pdf",
  "generated_at": "2026-01-19T15:00:00Z"
}
```

**Invalid State**
```
HTTP/1.1 400 Bad Request

{
  "error": "Payslip must be approved before generation",
  "current_status": "DRAFT"
}
```

### Status Code Reference

| Code | Meaning | When Used |
|------|---------|-----------|
| 202 | Accepted | Generation initiated successfully |
| 400 | Bad Request | Already generated, invalid state |
| 401 | Unauthorized | Not authenticated |
| 403 | Forbidden | Not admin user |
| 404 | Not Found | Payslip ID doesn't exist |
| 500 | Server Error | Task queue failure |

### Async Processing Benefits

| Benefit | Explanation |
|---------|-------------|
| Immediate Response | API responds instantly, doesn't wait for PDF |
| Scalability | Multiple PDFs can generate simultaneously |
| Fault Tolerance | Task retries on failure |
| Progress Tracking | Status field tracks generation state |
| Resource Management | PDF generation doesn't block API workers |

### Expected Outcome
- Custom action endpoint for PDF generation
- Asynchronous processing via Celery
- Immediate API response with status
- Background PDF generation
- Proper error handling

### Verification Checklist
- [ ] generate action method added to AdminPayslipViewSet
- [ ] @action decorator configured correctly
- [ ] Method accepts POST requests only
- [ ] Payslip status validation implemented
- [ ] Status updated to GENERATING before task queued
- [ ] Celery task triggered with payslip ID
- [ ] Success response returns 202 Accepted
- [ ] Response includes payslip details and status
- [ ] Error handling for already generated
- [ ] Error handling for task queue failures
- [ ] Endpoint accessible at /payslips/{id}/generate/

---

## Task 81: Add Bulk Generate Endpoint

### Overview
Implement a bulk PDF generation endpoint that processes multiple payslips in a single request. This endpoint queues batch processing tasks and returns a batch tracking ID for monitoring progress.

### Dependencies
- Task 79: AdminPayslipViewSet created
- Task 80: Single generation endpoint
- Payslip model and PayrollPeriod model
- Celery task for bulk generation
- BatchOperation model (optional, for tracking)

### Instructions

1. **Import batch processing dependencies**
   - Import bulk generation Celery task
   - Import BatchOperation model (if using)
   - Import validators for request data
   - Import Q objects for complex queries

2. **Define generate_bulk custom action**
   - Add `@action` decorator to method
   - Set `detail=False` (operates on collection, not single instance)
   - Set `methods=['post']` (POST request required)
   - Set `url_path='generate-bulk'` (custom URL segment)

3. **Implement generate_bulk method**
   - Accept self and request parameters
   - Does not require payslip ID (operates on collection)
   - Receives filter criteria in request body

4. **Parse request data**
   - Extract period_id from request.data (required)
   - Extract status filter (optional, default to APPROVED)
   - Extract employee_ids list (optional, for selective generation)
   - Validate all required fields present

5. **Build queryset for bulk operation**
   - Start with base queryset filtered by tenant
   - Filter by period using period_id
   - Filter by status (only generate approved payslips)
   - Optionally filter by employee_ids if provided
   - Exclude already generated (pdf_file__isnull=False) unless regeneration allowed

6. **Validate queryset**
   - Check queryset has results
   - Return 400 Bad Request if no payslips match criteria
   - Count total payslips to be processed

7. **Create batch tracking record**
   - Create BatchOperation instance (if using tracking model)
   - Set batch_type to GENERATION
   - Set total_count to queryset count
   - Set status to PENDING
   - Save and get batch ID

8. **Queue bulk processing task**
   - Call bulk_generate_payslips.delay(batch_id, payslip_ids)
   - Pass list of payslip IDs to process
   - Task will process each payslip sequentially or in chunks
   - Task updates batch progress as it runs

9. **Return batch response**
   - Return 202 Accepted status
   - Include batch_id for progress tracking
   - Include total_count of payslips
   - Include status (PROCESSING)
   - Include message indicating async processing

10. **Handle error cases**
    - Validate period exists
    - Validate tenant has access to period
    - Handle no matching payslips scenario
    - Handle task queue errors
    - Return appropriate error responses

### Action Decorator Configuration

| Parameter | Value | Purpose |
|-----------|-------|---------|
| detail | False | Operates on collection (no ID required) |
| methods | ['post'] | Only POST requests allowed |
| url_path | 'generate-bulk' | URL segment |
| permission_classes | Inherits from ViewSet | Admin-only access |

### Endpoint Details

| Aspect | Value |
|--------|-------|
| URL Pattern | `/api/v1/payslip/admin/generate-bulk/` |
| HTTP Method | POST |
| Request Body | JSON with period_id and filters |
| Response Code | 202 Accepted (async batch operation) |
| Authentication | Required (admin user) |
| Permissions | IsAdminUser |

### Request Format

```
POST /api/v1/payslip/admin/generate-bulk/

Request Body:
{
  "period_id": "uuid",              // Required: payroll period
  "status": "APPROVED",             // Optional: filter by status
  "employee_ids": ["uuid1", "uuid2"], // Optional: specific employees
  "regenerate": false               // Optional: allow regeneration
}
```

### Filter Options

| Field | Type | Required | Purpose |
|-------|------|----------|---------|
| period_id | UUID | Yes | Payroll period to process |
| status | Choice | No | Filter by payslip status (default: APPROVED) |
| employee_ids | Array[UUID] | No | Specific employees only |
| regenerate | Boolean | No | Allow regenerating existing PDFs |

### Response Format

```
HTTP/1.1 202 Accepted

{
  "success": true,
  "message": "Bulk PDF generation initiated",
  "batch_id": "batch_uuid",
  "total_count": 50,
  "status": "PROCESSING",
  "started_at": "2026-01-20T10:00:00Z",
  "estimated_completion": "2026-01-20T10:05:00Z"
}
```

### Batch Processing Flow

1. **Request Validation**
   - Validate period_id provided
   - Validate period exists and accessible
   - Validate optional filters

2. **Queryset Building**
   - Filter payslips by tenant
   - Filter by period
   - Apply status filter
   - Apply employee filter if provided
   - Exclude already generated unless regenerate=true

3. **Batch Creation**
   - Count matching payslips
   - Create BatchOperation record
   - Generate unique batch ID
   - Set initial status PENDING

4. **Task Queuing**
   - Extract payslip IDs from queryset
   - Queue Celery task with batch_id and payslip_ids
   - Task begins processing in background

5. **Immediate Response**
   - Return 202 Accepted
   - Provide batch_id for tracking
   - Include total count and estimated time

6. **Background Processing**
   - Worker processes payslips in chunks
   - Generates PDF for each payslip
   - Updates batch progress after each chunk
   - Handles individual failures gracefully
   - Updates batch status to COMPLETED when done

### Batch Processing Strategy

| Strategy | Description |
|----------|-------------|
| Chunked Processing | Process payslips in groups of 10-20 |
| Progress Updates | Update batch record after each chunk |
| Individual Task Spawning | Spawn separate task per payslip |
| Parallel Processing | Use Celery chord for parallel execution |
| Error Handling | Continue processing despite individual failures |

### Error Response Examples

**Missing Period ID**
```
HTTP/1.1 400 Bad Request

{
  "error": "period_id is required",
  "field": "period_id"
}
```

**No Matching Payslips**
```
HTTP/1.1 400 Bad Request

{
  "error": "No payslips found matching criteria",
  "period": "January 2026",
  "filters": {
    "status": "APPROVED",
    "employee_ids": ["uuid1"]
  }
}
```

**Invalid Period**
```
HTTP/1.1 404 Not Found

{
  "error": "Payroll period not found",
  "period_id": "invalid_uuid"
}
```

### Status Tracking Integration

| Aspect | Implementation |
|--------|----------------|
| Batch ID | Unique identifier for tracking |
| Status Endpoint | Separate endpoint (Task 84) |
| Progress Updates | Real-time percentage completion |
| WebSocket Updates | Optional real-time notifications |
| Completion Callback | Notify admins when complete |

### Performance Considerations

| Consideration | Approach |
|---------------|----------|
| Large Batches | Chunk processing (10-20 at a time) |
| Memory Management | Process in batches, not all at once |
| Task Timeout | Set reasonable timeout per payslip |
| Retry Logic | Retry failed individual generations |
| Progress Tracking | Update after each chunk, not each payslip |

### Expected Outcome
- Bulk generation endpoint for batch processing
- Batch tracking with unique ID
- Asynchronous processing via Celery
- Progress tracking capability
- Proper error handling for bulk operations

### Verification Checklist
- [ ] generate_bulk action method added
- [ ] @action decorator configured correctly (detail=False)
- [ ] Method accepts POST requests only
- [ ] Request data parsing for period_id and filters
- [ ] Queryset building with tenant and filter application
- [ ] Queryset validation (check for results)
- [ ] BatchOperation record creation
- [ ] Celery task queued with batch_id
- [ ] Success response returns 202 Accepted
- [ ] Response includes batch_id and total_count
- [ ] Error handling for missing period_id
- [ ] Error handling for no matching payslips
- [ ] Error handling for invalid period
- [ ] Endpoint accessible at /generate-bulk/

---

## Task 82: Add Send Email Endpoint

### Overview
Implement a custom action endpoint that triggers email delivery for a single payslip. This endpoint sends the generated payslip PDF to the employee's email address and tracks email delivery status.

### Dependencies
- Task 79: AdminPayslipViewSet created
- Task 80: Generate single endpoint
- Payslip model with email tracking fields
- Email distribution service (Task 37-42)
- Email configuration (SMTP settings)

### Instructions

1. **Import email service dependencies**
   - Import PayslipEmailer class
   - Import email validation utilities
   - Import status codes for responses
   - Import logging for email tracking

2. **Define send_email custom action**
   - Add `@action` decorator to method
   - Set `detail=True` (operates on single payslip)
   - Set `methods=['post']` (POST request required)
   - Set `url_path='send'` (custom URL segment)

3. **Implement send_email method**
   - Accept self and request parameters
   - Get payslip instance using `self.get_object()`
   - Automatically checks permissions and tenant

4. **Validate email prerequisites**
   - Check if PDF has been generated (pdf_file field not null)
   - Return 400 if PDF not generated yet
   - Check if employee has valid email address
   - Return 400 if no email address configured

5. **Check if already sent**
   - Check email_sent boolean field
   - Optionally allow resending based on business rules
   - If already sent, return information about previous send

6. **Initialize email service**
   - Create PayslipEmailer instance with tenant context
   - Service accesses email configuration from tenant settings
   - Service uses email template from settings

7. **Trigger email sending**
   - Call emailer.send_single(payslip.id)
   - Method sends email synchronously
   - Attaches PDF file to email
   - Uses employee's email address
   - Applies email template

8. **Update payslip email tracking**
   - Set email_sent to True
   - Set sent_at timestamp
   - Increment sent_count if tracking resends
   - Save payslip instance

9. **Return success response**
   - Return 200 OK status
   - Include payslip ID and slip number
   - Include recipient email address
   - Include sent_at timestamp
   - Include success message

10. **Handle error cases**
    - Catch SMTP connection errors
    - Catch email validation errors
    - Catch file not found errors (PDF missing)
    - Return appropriate error responses
    - Log all errors for troubleshooting

### Action Decorator Configuration

| Parameter | Value | Purpose |
|-----------|-------|---------|
| detail | True | Operates on single instance |
| methods | ['post'] | Only POST requests allowed |
| url_path | 'send' | URL segment (becomes /send/) |
| permission_classes | Inherits from ViewSet | Admin-only access |

### Endpoint Details

| Aspect | Value |
|--------|-------|
| URL Pattern | `/api/v1/payslip/admin/payslips/{id}/send/` |
| HTTP Method | POST |
| Request Body | Empty (optional: custom email address) |
| Response Code | 200 OK (synchronous operation) |
| Authentication | Required (admin user) |
| Permissions | IsAdminUser |

### Request/Response Flow

1. **Request Received**
   - POST to `/payslips/{id}/send/`
   - ViewSet retrieves payslip by ID
   - Checks admin permission and tenant

2. **Validation**
   - Verify PDF exists
   - Verify employee email configured
   - Check if already sent

3. **Email Composition**
   - Load email template
   - Render with payslip context
   - Attach PDF file
   - Set recipient and subject

4. **Email Sending**
   - Connect to SMTP server
   - Send email with attachment
   - Handle delivery confirmation

5. **Status Update**
   - Update payslip email fields
   - Record sent timestamp
   - Save changes

6. **Response**
   - Return success with details
   - Include delivery confirmation

### Request Example

```
POST /api/v1/payslip/admin/payslips/550e8400-e29b-41d4-a716-446655440000/send/

Headers:
  Authorization: Bearer {token}
  Content-Type: application/json

Body: (empty or optional custom_email)
{
  "custom_email": "alternate@email.com"  // Optional override
}
```

### Success Response Example

```
HTTP/1.1 200 OK

{
  "success": true,
  "message": "Payslip email sent successfully",
  "payslip_id": "550e8400-e29b-41d4-a716-446655440000",
  "slip_number": "PAY-2026-01-001",
  "sent_to": "john.doe@company.com",
  "sent_at": "2026-01-20T11:00:00Z"
}
```

### Error Response Examples

**PDF Not Generated**
```
HTTP/1.1 400 Bad Request

{
  "error": "Payslip PDF must be generated before sending",
  "payslip_status": "APPROVED",
  "pdf_generated": false
}
```

**No Email Address**
```
HTTP/1.1 400 Bad Request

{
  "error": "Employee email address not configured",
  "employee": "John Doe",
  "employee_id": "uuid"
}
```

**Already Sent**
```
HTTP/1.1 400 Bad Request

{
  "error": "Payslip email already sent",
  "sent_to": "john.doe@company.com",
  "sent_at": "2026-01-19T15:00:00Z",
  "sent_count": 1
}
```

**SMTP Error**
```
HTTP/1.1 500 Internal Server Error

{
  "error": "Failed to send email",
  "detail": "SMTP connection failed",
  "smtp_error": "Connection timeout"
}
```

### Email Composition Details

| Component | Source |
|-----------|--------|
| Recipient | employee.user.email |
| Subject | Template: "Your Payslip for {period}" |
| Body | HTML template with greeting and summary |
| Attachment | PDF file from payslip.pdf_file |
| From Address | Tenant email configuration |
| Reply-To | Tenant HR email address |

### Email Template Context

| Variable | Value |
|----------|-------|
| employee_name | Employee full name |
| period_name | Payroll period display name |
| slip_number | Payslip number |
| net_pay | Net pay amount formatted |
| company_name | Tenant company name |
| contact_email | HR contact email |

### Synchronous vs Asynchronous

| Aspect | Synchronous (Current) | Asynchronous (Alternative) |
|--------|----------------------|---------------------------|
| Response Time | Waits for email send | Returns immediately |
| Status Code | 200 OK on success | 202 Accepted |
| Error Handling | Direct error response | Status tracked separately |
| Use Case | Single email send | Bulk operations |
| Implementation | Direct email.send() | Celery task.delay() |

### Email Tracking Fields

| Field | Type | Purpose |
|-------|------|---------|
| email_sent | Boolean | Whether sent at least once |
| sent_at | DateTime | Last send timestamp |
| sent_count | Integer | Number of times sent |
| last_sent_to | Email | Last recipient address |
| delivery_status | Choice | Delivery confirmation status |

### Expected Outcome
- Email sending endpoint for single payslip
- Synchronous email delivery with immediate feedback
- PDF attachment included in email
- Email tracking fields updated
- Comprehensive error handling

### Verification Checklist
- [ ] send_email action method added to AdminPayslipViewSet
- [ ] @action decorator configured correctly
- [ ] Method accepts POST requests only
- [ ] PDF existence validation
- [ ] Employee email validation
- [ ] Already sent check implemented
- [ ] PayslipEmailer service integration
- [ ] Email sent successfully with PDF attachment
- [ ] Payslip email tracking fields updated
- [ ] Success response returns 200 OK
- [ ] Response includes recipient and timestamp
- [ ] Error handling for missing PDF
- [ ] Error handling for missing email
- [ ] Error handling for SMTP failures
- [ ] Endpoint accessible at /payslips/{id}/send/

---

## Task 83: Add Bulk Send Email Endpoint

### Overview
Implement a bulk email distribution endpoint that sends payslip emails to multiple employees in a single request. This endpoint processes large batches asynchronously while respecting email throttling limits and providing progress tracking.

### Dependencies
- Task 79: AdminPayslipViewSet created
- Task 82: Single send email endpoint
- Task 81: Bulk generate endpoint (similar pattern)
- Email distribution service with throttling
- BatchOperation model for tracking

### Instructions

1. **Import bulk email dependencies**
   - Import bulk send email Celery task
   - Import email throttling configuration
   - Import BatchOperation model
   - Import email validation utilities

2. **Define send_bulk custom action**
   - Add `@action` decorator to method
   - Set `detail=False` (operates on collection)
   - Set `methods=['post']` (POST request required)
   - Set `url_path='send-bulk'` (custom URL segment)

3. **Implement send_bulk method**
   - Accept self and request parameters
   - Operates on collection, no specific payslip ID
   - Receives filter criteria in request body

4. **Parse request data**
   - Extract period_id from request.data (required)
   - Extract filter option (all, unsent, failed)
   - Extract employee_ids list (optional, selective sending)
   - Validate required fields present

5. **Build queryset for bulk sending**
   - Start with base queryset filtered by tenant
   - Filter by period using period_id
   - Ensure PDF is generated (pdf_file__isnull=False)
   - Apply filter based on filter parameter
   - Filter='unsent': email_sent=False
   - Filter='failed': delivery_status='FAILED'
   - Filter='all': all payslips (including resends)
   - Optionally filter by employee_ids

6. **Validate employee emails**
   - Annotate queryset with employee email existence
   - Exclude payslips where employee.user.email is null
   - Count valid recipients
   - Return 400 if no valid recipients found

7. **Create batch tracking record**
   - Create BatchOperation instance
   - Set batch_type to EMAIL_DISTRIBUTION
   - Set total_count to number of valid recipients
   - Set status to PENDING
   - Save and get batch ID

8. **Queue bulk email task**
   - Call bulk_send_payslip_emails.delay(batch_id, payslip_ids)
   - Pass list of payslip IDs with valid emails
   - Task will respect email throttling limits
   - Task updates batch progress during execution

9. **Return batch response**
   - Return 202 Accepted status
   - Include batch_id for progress tracking
   - Include total_count of emails to send
   - Include estimated_completion based on throttling
   - Include status (PROCESSING)

10. **Handle error cases**
    - Validate period exists and accessible
    - Handle no matching payslips
    - Handle all payslips missing PDFs
    - Handle no valid email addresses
    - Return appropriate error responses

### Action Decorator Configuration

| Parameter | Value | Purpose |
|-----------|-------|---------|
| detail | False | Operates on collection |
| methods | ['post'] | Only POST requests allowed |
| url_path | 'send-bulk' | URL segment |
| permission_classes | Inherits from ViewSet | Admin-only access |

### Endpoint Details

| Aspect | Value |
|--------|-------|
| URL Pattern | `/api/v1/payslip/admin/send-bulk/` |
| HTTP Method | POST |
| Request Body | JSON with period_id and filter |
| Response Code | 202 Accepted (async batch operation) |
| Authentication | Required (admin user) |
| Permissions | IsAdminUser |

### Request Format

```
POST /api/v1/payslip/admin/send-bulk/

Request Body:
{
  "period_id": "uuid",              // Required: payroll period
  "filter": "unsent",               // Optional: all, unsent, failed
  "employee_ids": ["uuid1", "uuid2"], // Optional: specific employees
  "throttle_limit": 50              // Optional: emails per hour
}
```

### Filter Options

| Field | Type | Required | Purpose |
|-------|------|----------|---------|
| period_id | UUID | Yes | Payroll period to process |
| filter | Choice | No | Email selection criteria (default: unsent) |
| employee_ids | Array[UUID] | No | Specific employees only |
| throttle_limit | Integer | No | Override default throttle (emails/hour) |

### Filter Option Details

| Filter Value | Queryset Filter | Use Case |
|-------------|----------------|----------|
| all | No email_sent filter | Resend all payslips |
| unsent | email_sent=False | Send only new payslips |
| failed | delivery_status='FAILED' | Retry failed deliveries |

### Response Format

```
HTTP/1.1 202 Accepted

{
  "success": true,
  "message": "Bulk email distribution initiated",
  "batch_id": "batch_uuid",
  "total_count": 45,
  "status": "PROCESSING",
  "started_at": "2026-01-20T11:00:00Z",
  "estimated_completion": "2026-01-20T11:30:00Z",
  "throttle_info": {
    "limit": 50,
    "estimated_duration_minutes": 30
  }
}
```

### Batch Processing Flow

1. **Request Validation**
   - Validate period_id provided
   - Validate period exists
   - Validate filter option if provided

2. **Recipient Selection**
   - Filter payslips by criteria
   - Ensure PDFs generated
   - Validate employee emails exist
   - Count valid recipients

3. **Batch Creation**
   - Create BatchOperation record
   - Set initial status and counts
   - Calculate estimated completion

4. **Task Queuing**
   - Extract payslip IDs
   - Queue Celery task with batch_id
   - Pass throttle configuration

5. **Immediate Response**
   - Return 202 Accepted
   - Provide batch_id and counts
   - Include timing estimates

6. **Background Processing**
   - Worker processes in throttled chunks
   - Sends emails respecting rate limits
   - Updates batch progress
   - Handles individual failures
   - Completes batch when done

### Email Throttling Strategy

| Aspect | Configuration |
|--------|---------------|
| Default Limit | 50 emails per hour |
| Chunk Size | 10 emails per batch |
| Wait Time | 12 minutes between chunks (for 50/hour) |
| Failure Handling | Retry failed emails separately |
| Progress Updates | After each chunk completion |

### Throttling Calculation

| Total Emails | Throttle Limit | Estimated Time |
|--------------|----------------|----------------|
| 50 | 50/hour | 1 hour |
| 100 | 50/hour | 2 hours |
| 25 | 50/hour | 30 minutes |
| 100 | 100/hour | 1 hour |

### Error Response Examples

**No PDFs Generated**
```
HTTP/1.1 400 Bad Request

{
  "error": "No payslips with generated PDFs found",
  "period": "January 2026",
  "total_payslips": 50,
  "generated_pdfs": 0
}
```

**No Valid Emails**
```
HTTP/1.1 400 Bad Request

{
  "error": "No employees with valid email addresses",
  "period": "January 2026",
  "payslips_with_pdfs": 45,
  "valid_emails": 0
}
```

**Invalid Filter Option**
```
HTTP/1.1 400 Bad Request

{
  "error": "Invalid filter option",
  "provided": "invalid",
  "allowed": ["all", "unsent", "failed"]
}
```

### Batch Processing Strategies

| Strategy | Description | Use Case |
|----------|-------------|----------|
| Throttled Sequential | Send one-by-one with delays | Respects strict rate limits |
| Chunked Parallel | Send chunks in parallel | Faster with higher limits |
| Priority Queue | Send by employee priority | VIP employees first |
| Retry Queue | Separate queue for failures | Don't block success on failures |

### Progress Tracking Details

| Metric | Tracked In | Purpose |
|--------|-----------|---------|
| total_count | BatchOperation | Total emails to send |
| processed_count | BatchOperation | Emails sent so far |
| success_count | BatchOperation | Successfully delivered |
| failed_count | BatchOperation | Delivery failures |
| percentage | Calculated | Progress percentage |

### Delivery Status Tracking

| Status | Meaning | Action |
|--------|---------|--------|
| PENDING | Not yet sent | Will be sent |
| SENDING | Currently sending | In progress |
| SENT | Successfully sent | Complete |
| FAILED | Send failed | Will retry |
| BOUNCED | Email bounced | Investigate email address |

### Expected Outcome
- Bulk email distribution endpoint
- Asynchronous processing with throttling
- Progress tracking via batch ID
- Comprehensive email validation
- Graceful handling of partial failures

### Verification Checklist
- [ ] send_bulk action method added
- [ ] @action decorator configured correctly (detail=False)
- [ ] Method accepts POST requests only
- [ ] Request data parsing for period_id and filter
- [ ] Queryset building with PDF and email validation
- [ ] Filter option implementation (all, unsent, failed)
- [ ] Employee email existence validation
- [ ] BatchOperation record creation
- [ ] Celery task queued with throttle configuration
- [ ] Success response returns 202 Accepted
- [ ] Response includes batch_id and estimates
- [ ] Error handling for missing PDFs
- [ ] Error handling for no valid emails
- [ ] Error handling for invalid filter
- [ ] Endpoint accessible at /send-bulk/

---

## Task 84: Add Generation Status Endpoint

### Overview
Implement a status tracking endpoint that provides real-time progress information for batch operations (both PDF generation and email distribution). This endpoint allows administrators to monitor long-running batch processes and display progress to users.

### Dependencies
- Task 81: Bulk generate endpoint (creates batches)
- Task 83: Bulk send email endpoint (creates batches)
- BatchOperation model with progress fields
- Celery task progress updates

### Instructions

1. **Import status tracking dependencies**
   - Import BatchOperation model
   - Import serializer for batch status
   - Import response utilities
   - Import time calculation utilities

2. **Define batch_status custom action**
   - Add `@action` decorator to method
   - Set `detail=True` (requires batch ID)
   - Set `methods=['get']` (GET request)
   - Set `url_path='batches/(?P<batch_id>[^/.]+)/status'` (custom nested URL)
   - Alternatively create separate ViewSet for BatchOperation

3. **Implement batch_status method**
   - Accept self, request, and batch_id parameters
   - Retrieve BatchOperation by batch_id
   - Check tenant ownership of batch

4. **Retrieve batch operation**
   - Query BatchOperation.objects.get(id=batch_id, tenant=request.tenant)
   - Handle DoesNotExist exception
   - Return 404 if batch not found or not accessible

5. **Calculate progress metrics**
   - Calculate percentage complete: (processed / total) * 100
   - Calculate success rate: (success / processed) * 100
   - Calculate failure rate: (failed / processed) * 100
   - Calculate estimated time remaining

6. **Estimate completion time**
   - Calculate elapsed time: now - started_at
   - Calculate average time per item: elapsed / processed
   - Calculate remaining items: total - processed
   - Calculate ETA: remaining * average_time + now

7. **Gather batch details**
   - Include batch_id, batch_type, status
   - Include total_count, processed_count, success_count, failed_count
   - Include percentage complete
   - Include started_at timestamp
   - Include estimated_completion timestamp
   - Include error_messages if any failures

8. **Handle different batch statuses**
   - PENDING: Not started yet, show queued message
   - PROCESSING: Show current progress
   - COMPLETED: Show final results
   - FAILED: Show error information
   - CANCELLED: Show cancellation info

9. **Return status response**
   - Return 200 OK with batch details
   - Format timestamps in ISO 8601
   - Include all progress metrics
   - Include actionable information (retry options)

10. **Add real-time update support**
    - Consider polling interval recommendations
    - Add Last-Modified header
    - Consider WebSocket upgrade path
    - Document recommended polling frequency

### Alternative Implementation: Separate ViewSet

Instead of custom action on AdminPayslipViewSet, create dedicated BatchOperationViewSet:

1. **Create BatchOperationViewSet**
   - Separate ViewSet for batch management
   - Cleaner URL structure
   - More extensible for batch operations

2. **URL Pattern**
   - `/api/v1/payslip/admin/batches/` (list batches)
   - `/api/v1/payslip/admin/batches/{id}/` (batch detail)
   - `/api/v1/payslip/admin/batches/{id}/status/` (status endpoint)

3. **Benefits**
   - Better separation of concerns
   - Easier to add batch management features
   - Cleaner API design

### Endpoint Details

| Aspect | Value |
|--------|-------|
| URL Pattern | `/api/v1/payslip/admin/batches/{batch_id}/status/` |
| HTTP Method | GET |
| Request Body | None |
| Response Code | 200 OK |
| Authentication | Required (admin user) |
| Permissions | IsAdminUser |

### Request Example

```
GET /api/v1/payslip/admin/batches/batch-uuid-here/status/

Headers:
  Authorization: Bearer {token}
```

### Success Response Example

```
HTTP/1.1 200 OK

{
  "batch_id": "batch-uuid-here",
  "batch_type": "GENERATION",
  "status": "PROCESSING",
  "progress": {
    "total": 50,
    "processed": 35,
    "success": 33,
    "failed": 2,
    "pending": 15,
    "percentage": 70
  },
  "rates": {
    "success_rate": 94.3,
    "failure_rate": 5.7
  },
  "timing": {
    "started_at": "2026-01-20T10:00:00Z",
    "current_time": "2026-01-20T10:03:30Z",
    "elapsed_seconds": 210,
    "estimated_completion": "2026-01-20T10:05:00Z",
    "estimated_remaining_seconds": 90
  },
  "items_per_second": 0.17,
  "errors": [
    {
      "item_id": "payslip-uuid-1",
      "error": "PDF generation failed: Template not found"
    },
    {
      "item_id": "payslip-uuid-2",
      "error": "Employee data incomplete"
    }
  ]
}
```

### Completed Batch Response

```
HTTP/1.1 200 OK

{
  "batch_id": "batch-uuid-here",
  "batch_type": "EMAIL_DISTRIBUTION",
  "status": "COMPLETED",
  "progress": {
    "total": 45,
    "processed": 45,
    "success": 43,
    "failed": 2,
    "pending": 0,
    "percentage": 100
  },
  "rates": {
    "success_rate": 95.6,
    "failure_rate": 4.4
  },
  "timing": {
    "started_at": "2026-01-20T11:00:00Z",
    "completed_at": "2026-01-20T11:28:45Z",
    "elapsed_seconds": 1725
  },
  "summary": "Successfully sent 43 of 45 emails",
  "failed_items": [
    {
      "payslip_id": "uuid1",
      "employee": "John Doe",
      "error": "Email bounced: Invalid address"
    },
    {
      "payslip_id": "uuid2",
      "employee": "Jane Smith",
      "error": "SMTP timeout"
    }
  ],
  "actions": [
    {
      "label": "Retry Failed",
      "endpoint": "/api/v1/payslip/admin/batches/{id}/retry/"
    }
  ]
}
```

### Failed Batch Response

```
HTTP/1.1 200 OK

{
  "batch_id": "batch-uuid-here",
  "batch_type": "GENERATION",
  "status": "FAILED",
  "progress": {
    "total": 50,
    "processed": 10,
    "success": 8,
    "failed": 2,
    "pending": 40,
    "percentage": 20
  },
  "timing": {
    "started_at": "2026-01-20T10:00:00Z",
    "failed_at": "2026-01-20T10:02:00Z",
    "elapsed_seconds": 120
  },
  "error": "Critical error: Database connection lost",
  "message": "Batch processing stopped due to critical error",
  "actions": [
    {
      "label": "Restart Batch",
      "endpoint": "/api/v1/payslip/admin/batches/{id}/restart/"
    }
  ]
}
```

### Response Structure

| Section | Fields | Purpose |
|---------|--------|---------|
| Batch Info | batch_id, batch_type, status | Basic identification |
| Progress | total, processed, success, failed, percentage | Completion tracking |
| Rates | success_rate, failure_rate | Quality metrics |
| Timing | started_at, elapsed, estimated_completion | Time tracking |
| Errors | List of individual failures | Troubleshooting |
| Actions | Available operations | Next steps |

### Progress Calculation

| Metric | Formula | Purpose |
|--------|---------|---------|
| Percentage | (processed / total) × 100 | Overall progress |
| Success Rate | (success / processed) × 100 | Quality metric |
| Items/Second | processed / elapsed_seconds | Processing speed |
| ETA | remaining × avg_time + now | Completion estimate |

### Batch Status Values

| Status | Meaning | Progress % | Actions Available |
|--------|---------|-----------|-------------------|
| PENDING | Not started | 0% | Cancel |
| PROCESSING | In progress | 1-99% | Monitor, Cancel |
| COMPLETED | Finished successfully | 100% | View results, Export |
| FAILED | Encountered critical error | Variable | Retry, Investigate |
| CANCELLED | Manually stopped | Variable | Restart |
| PARTIAL | Completed with failures | 100% | Retry failed |

### Batch Type Values

| Type | Description | Typical Duration |
|------|-------------|-----------------|
| GENERATION | PDF generation batch | 5-30 minutes |
| EMAIL_DISTRIBUTION | Email sending batch | 30-120 minutes (throttled) |
| REGENERATION | Re-generate existing PDFs | 5-30 minutes |
| RESEND | Re-send emails | 30-120 minutes |

### Polling Recommendations

| Scenario | Recommended Interval | Reason |
|----------|---------------------|---------|
| Small Batch (<50) | 2 seconds | Fast completion |
| Medium Batch (50-200) | 5 seconds | Balanced |
| Large Batch (>200) | 10 seconds | Reduce server load |
| Email Batch (throttled) | 30 seconds | Slow by design |

### Real-Time Updates

| Method | Implementation | Pros | Cons |
|--------|---------------|------|------|
| Polling | Client requests status periodically | Simple, works everywhere | Increased load |
| WebSockets | Server pushes updates | Real-time, efficient | Complex setup |
| Server-Sent Events | Server streams updates | Simpler than WebSockets | One-way only |
| Long Polling | Client waits for changes | Better than polling | Still inefficient |

### Error Handling

**Batch Not Found**
```
HTTP/1.1 404 Not Found

{
  "error": "Batch not found",
  "batch_id": "invalid-uuid"
}
```

**Access Denied**
```
HTTP/1.1 403 Forbidden

{
  "error": "Batch belongs to different tenant",
  "batch_id": "uuid"
}
```

### Performance Considerations

| Consideration | Implementation |
|---------------|----------------|
| Database Load | Cache batch status for 2-5 seconds |
| Calculation Overhead | Pre-calculate metrics when updating batch |
| Concurrent Requests | Use database locking or caching |
| Historical Data | Archive old batches after 30 days |

### Expected Outcome
- Status tracking endpoint for batch operations
- Real-time progress information
- Completion time estimates
- Error reporting and troubleshooting
- Support for monitoring UI

### Verification Checklist
- [ ] batch_status action method added (or BatchOperationViewSet created)
- [ ] Endpoint accepts GET requests
- [ ] BatchOperation retrieved by batch_id
- [ ] Tenant ownership verification
- [ ] Progress metrics calculated correctly
- [ ] Success/failure rates calculated
- [ ] ETA calculation implemented
- [ ] Response includes all progress details
- [ ] Error list included for failed items
- [ ] Status-specific response handling
- [ ] 404 error handling for invalid batch_id
- [ ] 403 error handling for wrong tenant
- [ ] Response format matches documentation
- [ ] Endpoint accessible at /batches/{id}/status/
- [ ] Polling interval recommendations documented

---

## Document Summary

### All Tasks Completed

| Task # | Task Name | Status |
|--------|-----------|--------|
| 79 | Create Admin Payslip ViewSet | ✓ Documented |
| 80 | Add Generate Single Endpoint | ✓ Documented |
| 81 | Add Bulk Generate Endpoint | ✓ Documented |
| 82 | Add Send Email Endpoint | ✓ Documented |
| 83 | Add Bulk Send Email Endpoint | ✓ Documented |
| 84 | Add Generation Status Endpoint | ✓ Documented |

### API Endpoint Summary

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/admin/payslips/` | GET | List all payslips |
| `/admin/payslips/` | POST | Create payslip |
| `/admin/payslips/{id}/` | GET | Get payslip detail |
| `/admin/payslips/{id}/` | PUT/PATCH | Update payslip |
| `/admin/payslips/{id}/` | DELETE | Delete payslip |
| `/admin/payslips/{id}/generate/` | POST | Generate single PDF |
| `/admin/payslips/{id}/send/` | POST | Send single email |
| `/admin/generate-bulk/` | POST | Bulk generate PDFs |
| `/admin/send-bulk/` | POST | Bulk send emails |
| `/admin/batches/{id}/status/` | GET | Get batch progress |

### Key Architectural Patterns

| Pattern | Usage |
|---------|-------|
| ModelViewSet | Full CRUD operations |
| Custom Actions | Additional endpoints (@action decorator) |
| Async Processing | Celery tasks for bulk operations |
| Batch Tracking | BatchOperation model for progress |
| Tenant Isolation | Filtering in get_queryset |
| Permission Enforcement | IsAdminUser class |
| Throttling | Email rate limiting |
| Progress Tracking | Real-time status updates |

### Integration Points

| Component | Integration |
|-----------|------------|
| Payslip Model | CRUD operations |
| PDF Generator | Async task invocation |
| Email Service | Async task invocation |
| Batch Tracker | Progress monitoring |
| Serializers | Request/response formatting |
| Permissions | Access control |
| Tenant System | Multi-tenancy isolation |

### Next Steps

1. **Implement the ViewSet and endpoints** following documented specifications
2. **Create serializers** for request/response formatting (if not done in Tasks 43-49)
3. **Implement Celery tasks** for bulk operations
4. **Create BatchOperation model** for progress tracking
5. **Configure URL routing** in Django REST Framework router
6. **Write comprehensive tests** (covered in next document)
7. **Document API** using OpenAPI/Swagger (covered in next document)

### Total Estimated Time
- Task 79: 30 minutes
- Task 80: 20 minutes
- Task 81: 25 minutes
- Task 82: 20 minutes
- Task 83: 25 minutes
- Task 84: 20 minutes
- **Total: 140 minutes (2 hours 20 minutes)**

---

**End of Document 01 - Admin API Endpoints**
