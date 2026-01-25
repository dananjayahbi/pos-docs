# Tasks 85-91: Admin, ViewSet & URL Routes

> **Phase:** 06 - ERP Advanced Modules  
> **SubPhase:** 14 - Analytics & Reports  
> **Group:** F - API, Testing & Documentation  
> **Document:** 01 of 02  
> **Tasks Covered:** 85, 86, 87, 88, 89, 90, 91

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **→ Next Document:** [02_Tasks-92-94_Tests-Documentation.md](02_Tasks-92-94_Tests-Documentation.md)

---

## Document Overview

This document covers the API layer of the analytics and reports system, including Django admin configuration for report management, DRF serializers for API responses, a unified ViewSet for all analytics operations, and URL routing. Creates endpoints for listing available reports, generating reports with parameters, and downloading generated report files.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 85 | Create Report Admin | Medium | 45 min |
| 86 | Create Report Serializers | Medium | 40 min |
| 87 | Create ReportViewSet | High | 60 min |
| 88 | Add List Available Reports | Low | 20 min |
| 89 | Add Generate Report Endpoint | Medium | 35 min |
| 90 | Add Download Report Endpoint | Medium | 30 min |
| 91 | Add Analytics URL Routes | Low | 15 min |

---

## Task 85: Create Report Admin

### Overview
Configure Django admin interfaces for managing ReportDefinition, ReportInstance, SavedReport, and ScheduledReport models. Include list displays, filters, search capabilities, and custom actions for activating/deactivating scheduled reports.

### Dependencies
- Task 84 (Report scheduler and API utilities) completed
- All report models created (Tasks 67-73, 83-84)
- Django admin site configured

### Instructions

1. **Create admin module structure**
   - Navigate to `apps/analytics/` directory
   - Create or open `admin.py` file
   - Import required models and admin components

2. **Configure ReportDefinition admin**
   - Create `ReportDefinitionAdmin` class inheriting from `admin.ModelAdmin`
   - Set `list_display` to show: code, name, category, is_active, created_at
   - Add `list_filter` for: category, is_active, created_at
   - Set `search_fields` for: code, name, description
   - Add `readonly_fields` for: code, created_at, updated_at
   - Set `fieldsets` to organize: Basic Info, Parameters Schema, Settings, Metadata
   - Add `ordering` by: category, name
   - Set `list_per_page` to 25

3. **Configure ReportInstance admin**
   - Create `ReportInstanceAdmin` class
   - Set `list_display` to show: id, report_name, format, status, generated_by, generated_at
   - Add `list_filter` for: status, format, generated_at, report_definition
   - Set `search_fields` for: report_definition__name, generated_by__username
   - Add `readonly_fields` for all fields (instances are read-only)
   - Set `ordering` by: -generated_at
   - Override `has_add_permission` to return False
   - Override `has_change_permission` to return False
   - Add custom method `report_name` to display report definition name
   - Set `list_per_page` to 50

4. **Configure SavedReport admin**
   - Create `SavedReportAdmin` class
   - Set `list_display` to show: name, report_name, owner, is_public, created_at
   - Add `list_filter` for: is_public, created_at, report_definition
   - Set `search_fields` for: name, description, owner__username
   - Add `readonly_fields` for: created_at, updated_at
   - Set `fieldsets` to organize: Basic Info, Report Configuration, Sharing Settings, Metadata
   - Set `ordering` by: -created_at
   - Override `get_queryset` to include select_related for report_definition and owner
   - Set `list_per_page` to 25

5. **Configure ScheduledReport admin**
   - Create `ScheduledReportAdmin` class
   - Set `list_display` to show: name, report_name, schedule_type, is_active, next_run_at, owner
   - Add `list_filter` for: is_active, schedule_type, created_at
   - Set `search_fields` for: name, description, owner__username
   - Add `readonly_fields` for: created_at, updated_at, last_run_at, next_run_at
   - Set `fieldsets` to organize: Basic Info, Report Configuration, Schedule Settings, Recipients, Status, Metadata
   - Set `ordering` by: -created_at
   - Add custom action `activate_schedules` to activate selected schedules
   - Add custom action `deactivate_schedules` to deactivate selected schedules
   - Override `get_queryset` to include select_related for report_definition and owner
   - Set `list_per_page` to 25

6. **Register admin classes**
   - Register ReportDefinitionAdmin with ReportDefinition model
   - Register ReportInstanceAdmin with ReportInstance model
   - Register SavedReportAdmin with SavedReport model
   - Register ScheduledReportAdmin with ScheduledReport model

### Admin Features Table

| Admin Class | Key Features | Custom Actions |
|-------------|--------------|----------------|
| ReportDefinitionAdmin | Category filter, active status, parameter schema display | None |
| ReportInstanceAdmin | Read-only, status filter, format filter, custom report name | None |
| SavedReportAdmin | Public filter, owner filter, parameter display | None |
| ScheduledReportAdmin | Schedule type filter, active/inactive, next run display | Activate, Deactivate |

### List Filters Configuration

| Model | Filters |
|-------|---------|
| ReportDefinition | category, is_active, created_at |
| ReportInstance | status, format, generated_at, report_definition |
| SavedReport | is_public, created_at, report_definition |
| ScheduledReport | is_active, schedule_type, created_at |

### Expected Outcome
- Full admin interfaces for all report models
- Intuitive list views with appropriate filters
- Search functionality for quick lookups
- Custom actions for schedule management
- Read-only instance display
- Organized fieldsets for data entry

### Verification Checklist
- [ ] `admin.py` file created in analytics app
- [ ] ReportDefinitionAdmin configured with all fields
- [ ] ReportInstanceAdmin configured as read-only
- [ ] SavedReportAdmin configured with sharing settings
- [ ] ScheduledReportAdmin configured with schedule actions
- [ ] All admin classes registered
- [ ] List displays show relevant information
- [ ] Filters and search work correctly
- [ ] Custom actions function properly
- [ ] Fieldsets organize data logically

---

## Task 86: Create Report Serializers

### Overview
Create Django REST Framework serializers for all report models to handle API requests and responses. Include nested representations for related objects, proper validation, and custom fields for computed values.

### Dependencies
- Task 85 (Report admin) completed
- Django REST Framework installed
- All report models available

### Instructions

1. **Create serializers module**
   - Navigate to `apps/analytics/api/` directory (create if needed)
   - Create `__init__.py` to mark as package
   - Create `serializers.py` file

2. **Create ReportDefinition serializer**
   - Create `ReportDefinitionSerializer` class inheriting from `serializers.ModelSerializer`
   - Set Meta model to ReportDefinition
   - Include fields: id, code, name, description, category, parameters_schema, is_active, created_at, updated_at
   - Add `read_only_fields` for: id, code, created_at, updated_at
   - Validate parameters_schema is valid JSON

3. **Create ReportDefinition list serializer**
   - Create `ReportDefinitionListSerializer` for list views
   - Include minimal fields: id, code, name, category, is_active
   - Optimize for performance with fewer fields

4. **Create ReportInstance serializer**
   - Create `ReportInstanceSerializer` class
   - Set Meta model to ReportInstance
   - Include fields: id, report_definition, report_definition_name, parameters, format, status, file_path, file_url, error_message, generated_by, generated_by_name, generated_at, expires_at
   - Add computed field `report_definition_name` using SerializerMethodField
   - Add computed field `generated_by_name` using SerializerMethodField
   - Add computed field `file_url` using SerializerMethodField to return download URL
   - Set all fields as read_only except for filtering purposes

5. **Create ReportGeneration request serializer**
   - Create `ReportGenerationSerializer` for POST requests
   - Include fields: report_code, parameters, format
   - Validate report_code exists in ReportDefinition
   - Validate parameters match report's schema
   - Validate format is in allowed choices (PDF, EXCEL, CSV)
   - Add custom validation method for parameter schema matching

6. **Create SavedReport serializer**
   - Create `SavedReportSerializer` class
   - Set Meta model to SavedReport
   - Include fields: id, name, description, report_definition, report_definition_name, parameters, default_format, is_public, owner, owner_name, created_at, updated_at
   - Add computed field `report_definition_name` using SerializerMethodField
   - Add computed field `owner_name` using SerializerMethodField
   - Validate parameters match report definition schema
   - Set owner automatically from request user in create

7. **Create ScheduledReport serializer**
   - Create `ScheduledReportSerializer` class
   - Set Meta model to ScheduledReport
   - Include fields: id, name, description, report_definition, report_definition_name, parameters, format, schedule_type, day_of_week, day_of_month, time_of_day, is_active, recipients, owner, owner_name, last_run_at, next_run_at, created_at, updated_at
   - Add computed field `report_definition_name` using SerializerMethodField
   - Add computed field `owner_name` using SerializerMethodField
   - Validate schedule parameters based on schedule_type
   - Validate recipients is list of valid email addresses
   - Set owner automatically from request user in create

8. **Create ScheduledReport create serializer**
   - Create `ScheduledReportCreateSerializer` for POST requests
   - Exclude computed fields: last_run_at, next_run_at
   - Add validation for schedule consistency
   - Calculate next_run_at on creation

### Serializer Hierarchy

```
ReportDefinitionSerializer
    ├── Used for detail views
    └── Full field representation

ReportDefinitionListSerializer
    ├── Used for list views
    └── Minimal fields for performance

ReportInstanceSerializer
    ├── Read-only serializer
    ├── Includes download URL
    └── Computed fields for display

ReportGenerationSerializer
    ├── Write-only for POST
    ├── Validates report code
    └── Validates parameters

SavedReportSerializer
    ├── Full CRUD operations
    ├── Nested report definition
    └── Sharing controls

ScheduledReportSerializer
    ├── Read operations
    └── Full schedule details

ScheduledReportCreateSerializer
    ├── Create operations
    └── Schedule validation
```

### Validation Rules

| Serializer | Validation Rules |
|------------|------------------|
| ReportDefinitionSerializer | Valid JSON schema for parameters |
| ReportGenerationSerializer | Valid report code, parameters match schema, valid format |
| SavedReportSerializer | Parameters match schema, valid sharing settings |
| ScheduledReportSerializer | Schedule consistency (day/time based on type), valid emails |

### Expected Outcome
- Complete serializer set for all models
- Nested representations for related objects
- Proper validation for all inputs
- Computed fields for display purposes
- Optimized list serializers
- Request/response separation where needed

### Verification Checklist
- [ ] `api/serializers.py` file created
- [ ] ReportDefinitionSerializer created with validation
- [ ] ReportDefinitionListSerializer optimized
- [ ] ReportInstanceSerializer with computed fields
- [ ] ReportGenerationSerializer with schema validation
- [ ] SavedReportSerializer with sharing logic
- [ ] ScheduledReportSerializer with schedule validation
- [ ] ScheduledReportCreateSerializer created
- [ ] All SerializerMethodFields implemented
- [ ] Validation methods test edge cases

---

## Task 87: Create ReportViewSet

### Overview
Create a unified ViewSet that handles all analytics operations including listing available reports, viewing report details, generating new reports, listing generated instances, and managing saved/scheduled reports. Use DRF's ViewSet with custom actions for specialized endpoints.

### Dependencies
- Task 86 (Report serializers) completed
- Django REST Framework ViewSets configured
- Authentication middleware in place

### Instructions

1. **Create ViewSet module structure**
   - Navigate to `apps/analytics/api/` directory
   - Create `views.py` file
   - Import required ViewSet classes, permissions, and utilities

2. **Create base ReportViewSet class**
   - Create `ReportViewSet` class inheriting from `viewsets.ViewSet`
   - Set permission_classes to require authentication
   - Add get_queryset method for report definitions
   - Add get_serializer_class method to return appropriate serializer
   - Configure pagination for list views

3. **Configure ViewSet permissions**
   - Import and configure permission classes
   - Require IsAuthenticated for all operations
   - Add custom permission for tenant isolation
   - Ensure users only see their tenant's reports

4. **Add error handling**
   - Import DRF exceptions
   - Create helper method for error responses
   - Handle invalid report codes
   - Handle parameter validation errors
   - Handle file generation errors
   - Return appropriate HTTP status codes

5. **Configure ViewSet routing**
   - Use @action decorator for custom endpoints
   - Set detail=True for single-object actions
   - Set detail=False for list/create actions
   - Configure methods (GET, POST) per action
   - Set url_path for clean endpoint URLs

6. **Add ViewSet documentation**
   - Use docstrings for each action
   - Describe expected parameters
   - Document response formats
   - Include example requests
   - Note authentication requirements

### ViewSet Action Structure

```
ReportViewSet
│
├── list_available_reports (GET)
│   └── Returns all available report definitions
│
├── retrieve_report_definition (GET)
│   └── Returns single report definition with parameters schema
│
├── generate_report (POST)
│   └── Creates new report instance with provided parameters
│
├── list_instances (GET)
│   └── Returns user's generated report instances
│
├── download_report (GET)
│   └── Returns report file as FileResponse
│
├── list_saved_reports (GET)
│   └── Returns user's saved report configurations
│
├── create_saved_report (POST)
│   └── Saves report configuration for reuse
│
├── list_scheduled_reports (GET)
│   └── Returns user's scheduled reports
│
└── create_scheduled_report (POST)
    └── Creates new scheduled report
```

### Permission Configuration

| Action | Permission | Tenant Filter |
|--------|-----------|---------------|
| list_available_reports | IsAuthenticated | Yes |
| retrieve_report_definition | IsAuthenticated | Yes |
| generate_report | IsAuthenticated | Yes |
| list_instances | IsAuthenticated | Yes (owner) |
| download_report | IsAuthenticated | Yes (owner) |
| list_saved_reports | IsAuthenticated | Yes (owner or public) |
| create_saved_report | IsAuthenticated | Yes |
| list_scheduled_reports | IsAuthenticated | Yes (owner) |
| create_scheduled_report | IsAuthenticated | Yes |

### Expected Outcome
- Single ViewSet handling all analytics operations
- Custom actions for specialized endpoints
- Proper permission enforcement
- Tenant isolation for all queries
- Error handling for all edge cases
- Well-documented API actions

### Verification Checklist
- [ ] `api/views.py` file created
- [ ] ReportViewSet class created
- [ ] Permission classes configured
- [ ] Custom actions defined with @action
- [ ] Error handling implemented
- [ ] Tenant filtering applied
- [ ] Docstrings added for all actions
- [ ] get_serializer_class returns correct serializer
- [ ] get_queryset filters by tenant

---

## Task 88: Add List Available Reports

### Overview
Implement the endpoint to list all available report definitions that users can generate. Return report metadata including code, name, category, and parameters schema. Filter by category and active status.

### Dependencies
- Task 87 (ReportViewSet) created
- Report definitions exist in database
- User authentication working

### Instructions

1. **Create list_available_reports action**
   - Open `apps/analytics/api/views.py`
   - Add @action decorator to ReportViewSet
   - Set detail=False (list operation)
   - Set methods=['get']
   - Set url_path='reports'
   - Set url_name='list-reports'

2. **Implement queryset filtering**
   - Get all active ReportDefinition objects
   - Filter by current tenant
   - Order by category, then name
   - Apply category filter from query params if provided
   - Use select_related to optimize queries

3. **Configure serializer**
   - Use ReportDefinitionListSerializer for response
   - Include minimal fields for performance
   - Add category display value
   - Return is_active status

4. **Add query parameter filters**
   - Support 'category' query parameter for filtering
   - Support 'search' query parameter for name/description search
   - Support 'is_active' query parameter (default True)
   - Document all query parameters in docstring

5. **Apply pagination**
   - Use DRF's pagination classes
   - Set page_size to 25
   - Return paginated response with count, next, previous
   - Allow page_size override via query parameter

6. **Add response documentation**
   - Document response structure in docstring
   - Include example response JSON
   - Note filter parameters
   - Describe pagination format

### Endpoint Specification

| Property | Value |
|----------|-------|
| Method | GET |
| Path | `/api/v1/analytics/reports/` |
| Authentication | Required |
| Query Parameters | category, search, is_active, page, page_size |
| Response Format | Paginated list of report definitions |

### Query Parameters

| Parameter | Type | Description | Default |
|-----------|------|-------------|---------|
| category | string | Filter by report category | None (all) |
| search | string | Search in name/description | None |
| is_active | boolean | Filter active reports | True |
| page | integer | Page number | 1 |
| page_size | integer | Items per page | 25 |

### Response Structure

```
{
  "count": <total_count>,
  "next": "<next_page_url>",
  "previous": "<previous_page_url>",
  "results": [
    {
      "id": <uuid>,
      "code": "<report_code>",
      "name": "<report_name>",
      "category": "<category_code>",
      "category_display": "<category_name>",
      "is_active": <boolean>
    },
    ...
  ]
}
```

### Expected Outcome
- Endpoint returns all available reports
- Filtering by category works correctly
- Search functionality works
- Pagination applied properly
- Only active reports shown by default
- Tenant isolation enforced

### Verification Checklist
- [ ] list_available_reports action added to ViewSet
- [ ] @action decorator configured correctly
- [ ] Queryset filters by tenant and active status
- [ ] Category filter from query params applied
- [ ] Search filter applied
- [ ] Pagination configured
- [ ] Response uses ReportDefinitionListSerializer
- [ ] Query parameters documented in docstring
- [ ] Response format documented

---

## Task 89: Add Generate Report Endpoint

### Overview
Implement the POST endpoint to generate a new report with provided parameters. Validate report code and parameters against schema, create ReportInstance object, trigger background job for generation, and return instance details with generation status.

### Dependencies
- Task 88 (List available reports) completed
- Report generators implemented (Tasks 57-66)
- Celery task queue configured
- Background job system working

### Instructions

1. **Create generate_report action**
   - Open `apps/analytics/api/views.py`
   - Add @action decorator to ReportViewSet
   - Set detail=False (not on specific report)
   - Set methods=['post']
   - Set url_path='generate'
   - Set url_name='generate-report'

2. **Implement request validation**
   - Use ReportGenerationSerializer for request data
   - Validate serializer data
   - Extract report_code, parameters, format
   - Return 400 Bad Request if validation fails
   - Include error details in response

3. **Validate report definition**
   - Query ReportDefinition by code
   - Ensure report is active
   - Ensure report belongs to current tenant
   - Return 404 if report not found
   - Return 403 if report inactive

4. **Validate parameters against schema**
   - Get parameters_schema from ReportDefinition
   - Validate provided parameters match schema structure
   - Check required parameters are present
   - Validate parameter data types
   - Validate date ranges if applicable
   - Return 400 with validation errors if invalid

5. **Create ReportInstance object**
   - Create new ReportInstance
   - Set report_definition reference
   - Set parameters from request
   - Set format from request
   - Set status to 'pending'
   - Set generated_by to current user
   - Set tenant reference
   - Calculate expires_at (e.g., 7 days from now)
   - Save instance to database

6. **Trigger background generation job**
   - Import report generation Celery task
   - Call task asynchronously with instance ID
   - Pass report code and parameters to task
   - Handle task submission errors
   - Update instance status if task fails to submit

7. **Return response**
   - Serialize created ReportInstance
   - Use ReportInstanceSerializer
   - Return HTTP 202 Accepted
   - Include instance ID and status
   - Include message about background processing

8. **Add error handling**
   - Wrap in try/except blocks
   - Handle report not found
   - Handle validation errors
   - Handle database errors
   - Handle task queue errors
   - Return appropriate status codes and messages

### Endpoint Specification

| Property | Value |
|----------|-------|
| Method | POST |
| Path | `/api/v1/analytics/generate/` |
| Authentication | Required |
| Request Format | JSON with report_code, parameters, format |
| Response Status | 202 Accepted on success |

### Request Body

```
{
  "report_code": "<report_code>",
  "parameters": {
    "start_date": "YYYY-MM-DD",
    "end_date": "YYYY-MM-DD",
    ... (other parameters based on report schema)
  },
  "format": "PDF|EXCEL|CSV"
}
```

### Response Structure

```
{
  "id": "<instance_uuid>",
  "report_definition": "<definition_id>",
  "report_definition_name": "<report_name>",
  "status": "pending",
  "format": "<requested_format>",
  "parameters": { ... },
  "generated_by": "<user_id>",
  "generated_by_name": "<username>",
  "generated_at": "<timestamp>",
  "expires_at": "<expiry_timestamp>",
  "message": "Report generation started. Check status or wait for completion."
}
```

### Validation Flow

```
1. Validate request format (serializer)
   ↓
2. Check report code exists
   ↓
3. Check report is active
   ↓
4. Validate parameters against schema
   ↓
5. Create ReportInstance (pending)
   ↓
6. Submit background job
   ↓
7. Return 202 with instance details
```

### Expected Outcome
- POST endpoint accepts report generation requests
- Validation ensures correct parameters
- Background job triggered for generation
- ReportInstance created with pending status
- Response includes tracking information
- Errors handled gracefully

### Verification Checklist
- [ ] generate_report action added to ViewSet
- [ ] @action decorator configured for POST
- [ ] ReportGenerationSerializer used for validation
- [ ] Report definition lookup and validation
- [ ] Parameter schema validation implemented
- [ ] ReportInstance created successfully
- [ ] Background job submission working
- [ ] HTTP 202 response returned
- [ ] Error handling for all failure cases
- [ ] Response includes all instance details

---

## Task 90: Add Download Report Endpoint

### Overview
Implement the GET endpoint to download a generated report file. Validate user has permission to access the report, check file exists, serve file using Django's FileResponse with appropriate content type and headers.

### Dependencies
- Task 89 (Generate report endpoint) completed
- Report files stored on filesystem or cloud storage
- File storage configuration complete

### Instructions

1. **Create download_report action**
   - Open `apps/analytics/api/views.py`
   - Add @action decorator to ReportViewSet
   - Set detail=True (operates on specific instance)
   - Set methods=['get']
   - Set url_path='download'
   - Set url_name='download-report'

2. **Implement instance lookup**
   - Get instance ID from URL path parameter
   - Query ReportInstance by ID
   - Ensure instance belongs to current tenant
   - Ensure instance belongs to current user (or is public)
   - Return 404 if instance not found
   - Return 403 if user lacks permission

3. **Validate report status**
   - Check instance status is 'completed'
   - Return 400 if status is 'pending' with message to wait
   - Return 500 if status is 'failed' with error details
   - Only allow download for completed reports

4. **Validate file exists**
   - Get file_path from instance
   - Check file exists on storage backend
   - Return 404 if file not found
   - Handle missing files gracefully

5. **Determine content type**
   - Get format from instance (PDF, EXCEL, CSV)
   - Map format to MIME type:
     - PDF: 'application/pdf'
     - EXCEL: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
     - CSV: 'text/csv'
   - Set appropriate content type header

6. **Generate download filename**
   - Get report definition name
   - Get generation timestamp
   - Format filename: "{report_name}_{timestamp}.{extension}"
   - Sanitize filename (remove special characters)
   - Ensure filename is unique and descriptive

7. **Serve file using FileResponse**
   - Import FileResponse from django.http
   - Open file in binary read mode
   - Create FileResponse with file handle
   - Set content_type based on format
   - Set Content-Disposition header to 'attachment; filename="{filename}"'
   - Return FileResponse

8. **Add security considerations**
   - Verify user authorization
   - Check file path doesn't contain directory traversal
   - Log download activity
   - Update instance last_accessed_at timestamp
   - Implement rate limiting if needed

9. **Handle expiration**
   - Check if instance has expired (expires_at < now)
   - Return 410 Gone if expired
   - Include message about retention policy
   - Clean up expired files (optional, via separate task)

### Endpoint Specification

| Property | Value |
|----------|-------|
| Method | GET |
| Path | `/api/v1/analytics/download/{instance_id}/` |
| Authentication | Required |
| Response | Binary file with headers |

### Content Type Mapping

| Format | MIME Type | File Extension |
|--------|-----------|----------------|
| PDF | application/pdf | .pdf |
| EXCEL | application/vnd.openxmlformats-officedocument.spreadsheetml.sheet | .xlsx |
| CSV | text/csv | .csv |

### Response Headers

| Header | Value |
|--------|-------|
| Content-Type | Based on format |
| Content-Disposition | attachment; filename="{report_name}_{timestamp}.{ext}" |
| Content-Length | File size in bytes |

### Status Validation Flow

```
GET /api/v1/analytics/download/{id}/
   ↓
Check instance exists → 404 if not found
   ↓
Check user permission → 403 if denied
   ↓
Check status = 'completed' → 400 if pending, 500 if failed
   ↓
Check not expired → 410 if expired
   ↓
Check file exists → 404 if missing
   ↓
Serve FileResponse → 200 with file
```

### Expected Outcome
- GET endpoint serves report files
- Proper authorization enforced
- FileResponse with correct headers
- Appropriate MIME types set
- Descriptive filenames
- Status validation working
- Expiration handling implemented

### Verification Checklist
- [ ] download_report action added to ViewSet
- [ ] @action decorator configured for GET
- [ ] Instance lookup with tenant filtering
- [ ] Permission validation (user is owner or report is public)
- [ ] Status validation (completed, not pending/failed)
- [ ] Expiration check implemented
- [ ] File existence validation
- [ ] Content type mapping correct
- [ ] FileResponse created with headers
- [ ] Filename sanitization implemented
- [ ] Security checks in place

---

## Task 91: Add Analytics URL Routes

### Overview
Configure URL routing for the analytics API endpoints. Register the ReportViewSet with Django REST Framework's router and include the analytics URLs in the project's URL configuration under the `/api/v1/analytics/` path.

### Dependencies
- Task 90 (Download report endpoint) completed
- All ViewSet actions implemented
- DRF router configured in project

### Instructions

1. **Create analytics API URLs module**
   - Navigate to `apps/analytics/api/` directory
   - Create `urls.py` file
   - Import DRF router and ReportViewSet

2. **Configure DRF router**
   - Import DefaultRouter from rest_framework.routers
   - Create router instance
   - Register ReportViewSet with basename 'reports'
   - Use empty prefix since we'll set base path in project URLs

3. **Define URL patterns**
   - Create urlpatterns list
   - Include router.urls using path or include
   - Ensure all ViewSet actions are registered
   - Verify custom actions have correct URL paths

4. **Configure app name**
   - Set app_name = 'analytics_api' for namespacing
   - Allows reversing URLs with 'analytics_api:reports-list' format
   - Prevents naming conflicts with other apps

5. **Update project URL configuration**
   - Open main project `urls.py` (e.g., `config/urls.py`)
   - Import include from django.urls
   - Add path for analytics API with 'api/v1/analytics/' prefix
   - Include analytics app URLs

6. **Verify URL structure**
   - Ensure URL patterns match specifications:
     - GET `/api/v1/analytics/reports/` → list available reports
     - GET `/api/v1/analytics/reports/{code}/` → report definition detail
     - POST `/api/v1/analytics/generate/` → generate report
     - GET `/api/v1/analytics/instances/` → list instances (if added)
     - GET `/api/v1/analytics/download/{id}/` → download report
     - GET `/api/v1/analytics/saved/` → list saved reports (if added)
     - POST `/api/v1/analytics/saved/` → create saved report
     - GET `/api/v1/analytics/scheduled/` → list scheduled reports (if added)
     - POST `/api/v1/analytics/scheduled/` → create scheduled report

7. **Test URL routing**
   - Use Django's `show_urls` command or similar to list all URLs
   - Verify each endpoint is registered
   - Check URL namespaces are correct
   - Ensure no duplicate routes

8. **Add URL documentation**
   - Document URL structure in docstring
   - List all available endpoints
   - Note authentication requirements
   - Include example curl commands

### URL Configuration Structure

```
Project urls.py
│
├── /api/v1/analytics/ (include)
│   │
│   └── apps/analytics/api/urls.py
│       │
│       └── Router: ReportViewSet
│           ├── reports/ (list_available_reports)
│           ├── reports/{code}/ (retrieve_report_definition)
│           ├── generate/ (generate_report)
│           ├── download/{id}/ (download_report)
│           ├── saved/ (list/create saved reports)
│           └── scheduled/ (list/create scheduled reports)
```

### Router Registration

| ViewSet | Basename | URL Prefix | Actions |
|---------|----------|------------|---------|
| ReportViewSet | reports | / | Custom actions defined with @action |

### Complete URL Mapping

| Endpoint | HTTP Method | ViewSet Action | URL Name |
|----------|-------------|----------------|----------|
| `/api/v1/analytics/reports/` | GET | list_available_reports | reports-list-reports |
| `/api/v1/analytics/reports/{code}/` | GET | retrieve_report_definition | reports-detail |
| `/api/v1/analytics/generate/` | POST | generate_report | reports-generate-report |
| `/api/v1/analytics/download/{id}/` | GET | download_report | reports-download-report |
| `/api/v1/analytics/saved/` | GET | list_saved_reports | reports-list-saved |
| `/api/v1/analytics/saved/` | POST | create_saved_report | reports-create-saved |
| `/api/v1/analytics/scheduled/` | GET | list_scheduled_reports | reports-list-scheduled |
| `/api/v1/analytics/scheduled/` | POST | create_scheduled_report | reports-create-scheduled |

### Expected Outcome
- Clean URL structure under `/api/v1/analytics/`
- All ViewSet actions accessible via URLs
- URL namespacing configured
- Routes registered with DRF router
- Project URLs include analytics URLs
- URL patterns documented

### Verification Checklist
- [ ] `api/urls.py` file created in analytics app
- [ ] DRF router instantiated
- [ ] ReportViewSet registered with router
- [ ] app_name set for namespacing
- [ ] urlpatterns defined
- [ ] Project URLs include analytics URLs
- [ ] Base path set to `/api/v1/analytics/`
- [ ] All endpoints accessible
- [ ] URL reversal works correctly
- [ ] show_urls command lists all routes

---

## API Endpoints Summary

### Complete Endpoints Reference

| # | Endpoint | Method | Action | Description |
|---|----------|--------|--------|-------------|
| 1 | `/api/v1/analytics/reports/` | GET | List | List all available report definitions |
| 2 | `/api/v1/analytics/reports/{code}/` | GET | Detail | Get single report definition with schema |
| 3 | `/api/v1/analytics/generate/` | POST | Create | Generate a new report instance |
| 4 | `/api/v1/analytics/instances/` | GET | List | List user's generated report instances |
| 5 | `/api/v1/analytics/download/{id}/` | GET | Download | Download generated report file |
| 6 | `/api/v1/analytics/saved/` | GET | List | List user's saved report configurations |
| 7 | `/api/v1/analytics/saved/` | POST | Create | Save a report configuration |
| 8 | `/api/v1/analytics/saved/{id}/` | GET | Detail | Get saved report details |
| 9 | `/api/v1/analytics/saved/{id}/` | PUT | Update | Update saved report |
| 10 | `/api/v1/analytics/saved/{id}/` | DELETE | Delete | Delete saved report |
| 11 | `/api/v1/analytics/scheduled/` | GET | List | List user's scheduled reports |
| 12 | `/api/v1/analytics/scheduled/` | POST | Create | Create scheduled report |
| 13 | `/api/v1/analytics/scheduled/{id}/` | GET | Detail | Get scheduled report details |
| 14 | `/api/v1/analytics/scheduled/{id}/` | PUT | Update | Update scheduled report |
| 15 | `/api/v1/analytics/scheduled/{id}/` | DELETE | Delete | Delete scheduled report |

### Authentication & Authorization

All endpoints require:
- Valid authentication token (JWT or session)
- User belongs to an active tenant
- Tenant context in request headers
- Appropriate permissions for operation

### Query Parameters by Endpoint

**GET `/api/v1/analytics/reports/`**
- `category`: Filter by category (optional)
- `search`: Search name/description (optional)
- `is_active`: Filter active status (default: true)
- `page`: Page number (optional)
- `page_size`: Items per page (optional)

**GET `/api/v1/analytics/instances/`**
- `status`: Filter by status (optional)
- `format`: Filter by format (optional)
- `report_definition`: Filter by report code (optional)
- `date_from`: Filter generated_at >= date (optional)
- `date_to`: Filter generated_at <= date (optional)
- `page`: Page number (optional)

**GET `/api/v1/analytics/saved/`**
- `is_public`: Filter public reports (optional)
- `report_definition`: Filter by report code (optional)
- `search`: Search name/description (optional)
- `page`: Page number (optional)

**GET `/api/v1/analytics/scheduled/`**
- `is_active`: Filter active schedules (optional)
- `schedule_type`: Filter by type (optional)
- `report_definition`: Filter by report code (optional)
- `page`: Page number (optional)

### Response Formats

**List Response (Paginated)**
```
{
  "count": 150,
  "next": "https://api.example.com/api/v1/analytics/reports/?page=2",
  "previous": null,
  "results": [ ... array of objects ... ]
}
```

**Detail Response**
```
{
  "id": "uuid-here",
  "field1": "value1",
  ...
}
```

**Error Response**
```
{
  "error": "Error message",
  "details": { ... error details ... },
  "code": "ERROR_CODE"
}
```

### File Download Response

When downloading a report file (GET `/api/v1/analytics/download/{id}/`):
- HTTP Status: 200 OK
- Content-Type: Based on format (PDF/Excel/CSV)
- Content-Disposition: attachment; filename="Report_Name_2026-01-25.pdf"
- Body: Binary file content

---

## Implementation Checklist

### Admin Configuration (Task 85)
- [ ] ReportDefinitionAdmin with filters and search
- [ ] ReportInstanceAdmin read-only with status display
- [ ] SavedReportAdmin with sharing controls
- [ ] ScheduledReportAdmin with activate/deactivate actions
- [ ] All admin classes registered
- [ ] List filters configured properly
- [ ] Search fields defined
- [ ] Custom admin actions working

### Serializers (Task 86)
- [ ] ReportDefinitionSerializer with validation
- [ ] ReportDefinitionListSerializer for performance
- [ ] ReportInstanceSerializer with computed fields
- [ ] ReportGenerationSerializer for POST validation
- [ ] SavedReportSerializer with schema validation
- [ ] ScheduledReportSerializer with schedule validation
- [ ] ScheduledReportCreateSerializer for creation
- [ ] All SerializerMethodFields implemented
- [ ] Validation methods complete

### ViewSet (Task 87)
- [ ] ReportViewSet base class created
- [ ] Permission classes configured
- [ ] get_queryset with tenant filtering
- [ ] get_serializer_class method
- [ ] Error handling helper methods
- [ ] Docstrings for all actions
- [ ] Custom actions defined with @action

### List Reports Endpoint (Task 88)
- [ ] list_available_reports action implemented
- [ ] Query parameter filtering (category, search, is_active)
- [ ] Pagination configured
- [ ] Response uses correct serializer
- [ ] Tenant filtering applied
- [ ] Documentation in docstring

### Generate Report Endpoint (Task 89)
- [ ] generate_report action implemented
- [ ] Request validation with serializer
- [ ] Report definition lookup and validation
- [ ] Parameter schema validation
- [ ] ReportInstance creation
- [ ] Background job submission
- [ ] HTTP 202 response
- [ ] Error handling for all cases

### Download Report Endpoint (Task 90)
- [ ] download_report action implemented
- [ ] Instance lookup with authorization
- [ ] Status validation (completed only)
- [ ] Expiration check
- [ ] File existence validation
- [ ] Content type mapping
- [ ] FileResponse with headers
- [ ] Filename generation and sanitization

### URL Configuration (Task 91)
- [ ] api/urls.py created in analytics app
- [ ] DRF router configured
- [ ] ReportViewSet registered
- [ ] app_name for namespacing
- [ ] Project URLs include analytics
- [ ] Base path `/api/v1/analytics/`
- [ ] All endpoints accessible
- [ ] URL documentation added

---

## Testing Considerations

### Manual Testing Steps

1. **Admin Interface Testing**
   - Access Django admin
   - Navigate to each report model admin
   - Test filters and search
   - Test custom actions on scheduled reports
   - Verify fieldsets display correctly

2. **List Reports Testing**
   - GET `/api/v1/analytics/reports/`
   - Test without filters
   - Test with category filter
   - Test with search parameter
   - Verify pagination
   - Check only active reports returned

3. **Report Generation Testing**
   - POST `/api/v1/analytics/generate/` with valid data
   - Verify 202 response
   - Check ReportInstance created
   - Verify background job triggered
   - Test with invalid report code
   - Test with invalid parameters
   - Test with missing required parameters

4. **Download Testing**
   - Generate a report and wait for completion
   - GET `/api/v1/analytics/download/{id}/`
   - Verify file downloads correctly
   - Check Content-Type header
   - Check Content-Disposition header
   - Test with pending report (should fail)
   - Test with expired report (should return 410)
   - Test with another user's report (should return 403)

5. **URL Routing Testing**
   - Use `python manage.py show_urls` or equivalent
   - Verify all endpoints listed
   - Test URL reversal with `reverse()`
   - Check namespacing works

### Integration Testing

- Test complete flow: list → generate → check status → download
- Test with different report types
- Test with various parameter combinations
- Test permission boundaries (tenant isolation)
- Test error scenarios

### Performance Testing

- Test list endpoint with large number of reports
- Test pagination performance
- Test file download with large files
- Test concurrent report generation
- Monitor database query count

---

## Notes for AI Agents

### Code Generation Guidelines

When implementing these tasks:

1. **Import Statements**
   - Import from Django admin, models, DRF serializers, viewsets
   - Use absolute imports for project modules
   - Group imports: standard library, Django, third-party, local

2. **Serializer Methods**
   - Use SerializerMethodField for computed values
   - Name methods as `get_{field_name}`
   - Handle None values gracefully
   - Cache related object lookups when possible

3. **ViewSet Actions**
   - Always use @action decorator for custom actions
   - Set appropriate detail, methods, url_path parameters
   - Return Response objects with status codes
   - Handle exceptions with try/except blocks

4. **Permission Checks**
   - Verify user authentication
   - Check tenant context
   - Validate object ownership where required
   - Return 403 Forbidden for unauthorized access

5. **File Handling**
   - Use Django's storage backend abstraction
   - Handle file not found errors
   - Set proper MIME types and headers
   - Clean up file handles after use

6. **Error Responses**
   - Return appropriate HTTP status codes
   - Include descriptive error messages
   - Provide actionable error details
   - Log errors for debugging

### Common Patterns

**Admin List Filter**
```python
list_filter = ('category', 'is_active', 'created_at')
search_fields = ('name', 'description', 'code')
readonly_fields = ('created_at', 'updated_at')
```

**Serializer Computed Field**
```python
field_name = serializers.SerializerMethodField()

def get_field_name(self, obj):
    return obj.related_object.name if obj.related_object else None
```

**ViewSet Custom Action**
```python
@action(detail=False, methods=['post'], url_path='custom-action')
def custom_action(self, request):
    # Implementation
    return Response(data, status=status.HTTP_200_OK)
```

**FileResponse Usage**
```python
from django.http import FileResponse
import os

file_path = instance.file_path
if not os.path.exists(file_path):
    return Response({'error': 'File not found'}, status=404)

response = FileResponse(open(file_path, 'rb'))
response['Content-Type'] = 'application/pdf'
response['Content-Disposition'] = f'attachment; filename="{filename}"'
return response
```

### Tenant Isolation Pattern

Always filter queries by tenant:
```python
def get_queryset(self):
    return Model.objects.filter(tenant=self.request.tenant)
```

For user-owned resources:
```python
def get_queryset(self):
    return Model.objects.filter(
        tenant=self.request.tenant,
        owner=self.request.user
    )
```

### Parameter Validation Pattern

When validating parameters against schema:
```python
def validate_parameters(self, report_definition, parameters):
    schema = report_definition.parameters_schema
    required = schema.get('required', [])
    
    for field in required:
        if field not in parameters:
            raise ValidationError(f"Required parameter '{field}' missing")
    
    # Additional type and value validation
```

---

## Related Documentation

- Django Admin Documentation: Custom admin configurations
- DRF Serializers Guide: Nested serializers and validation
- DRF ViewSets Guide: Custom actions and routing
- File Handling in Django: FileResponse and storage backends
- API Design Best Practices: RESTful endpoint design

---

## Next Steps

After completing these tasks:

1. Proceed to [02_Tasks-92-94_Tests-Documentation.md](02_Tasks-92-94_Tests-Documentation.md)
2. Implement comprehensive unit tests for all components
3. Test all API endpoints with various scenarios
4. Create API documentation using drf-spectacular
5. Perform security review of file download endpoint
6. Conduct performance testing with large datasets
7. Review and optimize database queries

---

**Document Status:** Ready for Implementation  
**Last Updated:** 2026-01-25  
**Total Estimated Time:** 3 hours 45 minutes
