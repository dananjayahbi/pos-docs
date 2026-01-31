# Tasks 81-90: API Components and Integration Tests

> **Phase:** 09 - Integrations & Sri Lanka Localizations  
> **SubPhase:** 10 - Waybill Generation  
> **Group:** F - API & Frontend  
> **Document:** 01 of 01  
> **Tasks Covered:** 81, 82, 83, 84, 85, 86, 87, 88, 89, 90

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **→ Next Document:** None (Last Document in Group)

---

## Document Overview

This document covers the creation of comprehensive waybill API endpoints, TypeScript types, React components, and integration tests for the complete waybill generation workflow. It establishes the Django REST Framework ViewSets for waybill operations, frontend API client with error handling, user interface components for single and batch printing, and end-to-end testing coverage.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 81 | Create Waybill API Views | Medium | 45 min |
| 82 | Create Generate Endpoint | Medium | 35 min |
| 83 | Create Batch Endpoint | Medium | 40 min |
| 84 | Create Download Endpoint | Low | 25 min |
| 85 | Create Waybill TypeScript Types | Low | 20 min |
| 86 | Create Waybill API Client | Medium | 35 min |
| 87 | Create WaybillPrintButton Component | Medium | 30 min |
| 88 | Create BatchPrintDialog Component | Medium | 45 min |
| 89 | Create WaybillHistory UI Component | Medium | 40 min |
| 90 | Create Integration Tests | Medium | 50 min |

---

## Task 81: Create Waybill API Views

### Overview
Create the Django REST Framework ViewSet for waybill operations. This ViewSet provides the foundation for all waybill-related API endpoints, including CRUD operations, custom actions, and proper tenant isolation. The ViewSet handles waybill model interactions with proper permissions and serialization.

### Dependencies
- Task 80: Waybill Template Engine (from Group E)
- PostgreSQL multi-tenant configuration
- Django REST Framework setup
- Waybill model implementation

### Instructions

1. **Navigate to shipping app API directory**
   - Go to `backend/apps/shipping/api/` directory
   - Create the directory if it doesn't exist
   - This houses all shipping-related API views

2. **Create waybill_views.py file**
   - Create new file `waybill_views.py` in the API directory
   - Import required DRF components and models
   - Import tenant-aware utilities and permissions

3. **Import necessary dependencies**
   - Import Django REST Framework viewsets and decorators
   - Import waybill models from shipping app
   - Import tenant middleware components
   - Import authentication and permission classes

4. **Define WaybillViewSet class**
   - Extend `ModelViewSet` from DRF
   - Set proper model as `Waybill` model
   - Configure tenant-aware queryset filtering
   - Apply appropriate permission classes

5. **Configure ViewSet properties**
   - Set `queryset` to tenant-filtered waybill objects
   - Define `serializer_class` for API responses
   - Set `permission_classes` for access control
   - Configure `filter_backends` for search/filtering

6. **Implement tenant isolation**
   - Ensure ViewSet only shows current tenant's waybills
   - Filter queryset by tenant schema context
   - Apply proper foreign key constraints

7. **Add ordering and pagination**
   - Set default ordering by creation date (newest first)
   - Configure pagination class for large datasets
   - Enable search fields (waybill_number, order reference)

### ViewSet Configuration

| Property | Value | Purpose |
|----------|-------|---------|
| queryset | `Waybill.objects.all()` | Base query (filtered by tenant) |
| serializer_class | `WaybillSerializer` | Response serialization |
| permission_classes | `[IsAuthenticated, TenantPermission]` | Access control |
| filter_backends | Search, filtering support |
| ordering | `['-created_at']` | Newest first |

### ViewSet Methods

| Method | HTTP | Endpoint | Purpose |
|--------|------|----------|---------|
| list | GET | `/api/waybills/` | List tenant waybills |
| retrieve | GET | `/api/waybills/{id}/` | Get specific waybill |
| create | POST | `/api/waybills/` | Generate new waybill |
| update | PUT/PATCH | `/api/waybills/{id}/` | Update waybill |
| destroy | DELETE | `/api/waybills/{id}/` | Delete waybill |

### Tenant Filtering Implementation

```
Tenant Context Flow
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   Request   │───▶│  Middleware │───▶│  ViewSet    │
│             │    │ (Set Schema)│    │ (Filter)    │
└─────────────┘    └─────────────┘    └─────────────┘
                           │                  │
                           ▼                  ▼
                   Tenant Schema      Filtered Queryset
```

### Expected Outcome
- Functional ViewSet for waybill CRUD operations
- Proper tenant isolation and security
- Base foundation for custom endpoints
- Integrated with DRF permission system

### Verification Checklist
- [ ] `backend/apps/shipping/api/waybill_views.py` file created
- [ ] WaybillViewSet class defined properly
- [ ] Tenant-aware queryset filtering implemented
- [ ] Permission classes configured
- [ ] Ordering and pagination set up
- [ ] ViewSet exports correctly for URL routing

---

## Task 82: Create Generate Endpoint

### Overview
Implement the generate endpoint as a custom action in the WaybillViewSet. This endpoint accepts order details and courier preferences, generates the waybill using the template engine, creates a PDF file, and returns the complete waybill object with downloadable PDF URL.

### Dependencies
- Task 81: Create Waybill API Views
- Task 80: Template engine implementation
- PDF generation library setup

### Instructions

1. **Add generate custom action decorator**
   - Use `@action` decorator from DRF
   - Set `methods=['post']` for POST requests
   - Set `detail=False` for collection-level endpoint
   - Set `url_path='generate'` for custom URL

2. **Define endpoint function signature**
   - Create `generate` method in WaybillViewSet
   - Accept `request` and any additional parameters
   - Return DRF Response object

3. **Implement request validation**
   - Extract order_id, courier_type, template from request data
   - Validate required fields are present
   - Check order exists and belongs to current tenant
   - Validate courier_type against available options

4. **Integrate with template engine**
   - Call template engine from Task 80
   - Pass order data and courier configuration
   - Generate waybill content and barcode
   - Handle template engine errors gracefully

5. **Create waybill record**
   - Generate unique waybill number
   - Create Waybill model instance
   - Link to order and set courier details
   - Set initial status as 'generated'

6. **Generate PDF file**
   - Use PDF generation library (ReportLab/WeasyPrint)
   - Render template with order and courier data
   - Save PDF to configured storage location
   - Generate accessible download URL

7. **Return response with waybill data**
   - Serialize waybill object with all fields
   - Include PDF download URL in response
   - Set HTTP 201 status for creation
   - Handle and return validation errors

### Endpoint Specifications

| Property | Value |
|----------|-------|
| URL | `POST /api/waybills/generate/` |
| Content-Type | `application/json` |
| Response Type | `application/json` |
| Status Code | `201 Created` / `400 Bad Request` |

### Request Body Format

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| order_id | integer | Yes | Order ID to generate waybill for |
| courier_type | string | Yes | Courier service (domex/koombiyo/pronto) |
| template | string | No | Template variant (default/express) |

### Response Body Format

| Field | Type | Description |
|-------|------|-------------|
| id | integer | Waybill database ID |
| waybill_number | string | Generated waybill number |
| order_id | integer | Associated order ID |
| courier_type | string | Courier service used |
| status | string | Current waybill status |
| pdf_url | string | Download URL for PDF |
| created_at | datetime | Generation timestamp |

### Generate Workflow

```
Request Processing Flow
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   Validate  │───▶│   Template  │───▶│   Create    │
│   Request   │    │   Engine    │    │   Record    │
└─────────────┘    └─────────────┘    └─────────────┘
       │                   │                   │
       ▼                   ▼                   ▼
   Validation         PDF Generation      Database
     Error              Success             Storage
       │                   │                   │
       ▼                   ▼                   ▼
   Error 400          PDF Storage         Response 201
```

### Error Handling

| Error Type | Status Code | Response |
|------------|-------------|----------|
| Missing order_id | 400 | `{"error": "order_id is required"}` |
| Invalid order | 404 | `{"error": "Order not found"}` |
| Invalid courier | 400 | `{"error": "Invalid courier type"}` |
| Template error | 500 | `{"error": "PDF generation failed"}` |

### Expected Outcome
- Functional generate endpoint accepting order data
- Complete waybill generation with PDF creation
- Proper error handling and validation
- RESTful response format with all waybill details

### Verification Checklist
- [ ] `@action` decorator configured properly
- [ ] Request validation implemented
- [ ] Template engine integration working
- [ ] PDF generation and storage functional
- [ ] Waybill record creation successful
- [ ] Error handling covers all scenarios
- [ ] Response format matches specification

---

## Task 83: Create Batch Endpoint

### Overview
Implement the batch generation endpoint for processing multiple waybills simultaneously. This endpoint accepts an array of order IDs, processes them asynchronously using Celery tasks, and returns a task ID for progress tracking. Clients can poll the progress endpoint to monitor batch generation status.

### Dependencies
- Task 81: Create Waybill API Views
- Task 82: Generate endpoint implementation
- Celery task queue configuration
- Redis for task result storage

### Instructions

1. **Add batch custom action decorator**
   - Use `@action` decorator with `methods=['post']`
   - Set `detail=False` for collection-level endpoint
   - Set `url_path='batch'` for batch processing
   - Add proper permission requirements

2. **Define batch endpoint function**
   - Create `batch` method in WaybillViewSet
   - Accept request with array of order IDs
   - Return immediate response with task ID

3. **Implement request validation**
   - Extract order_ids array from request data
   - Validate array is not empty (max 50 orders)
   - Check all orders exist and belong to tenant
   - Validate courier_type is provided and valid

4. **Create Celery task for batch processing**
   - Create new file `backend/apps/shipping/tasks.py`
   - Define `generate_batch_waybills` Celery task
   - Task accepts order_ids, courier_type, tenant_id
   - Task generates waybills sequentially with progress updates

5. **Implement batch task logic**
   - Set up progress tracking (0-100%)
   - Iterate through order_ids list
   - Generate waybill for each order
   - Update progress after each completion
   - Handle individual order failures gracefully

6. **Configure task result storage**
   - Store progress updates in Redis
   - Include completed waybill IDs in results
   - Track failed orders with error messages
   - Set task result expiration time (24 hours)

7. **Return task ID and polling endpoint**
   - Start Celery task asynchronously
   - Return task UUID to client
   - Include polling endpoint URL in response
   - Set HTTP 202 status for accepted processing

### Endpoint Specifications

| Property | Value |
|----------|-------|
| URL | `POST /api/waybills/batch/` |
| Content-Type | `application/json` |
| Response Type | `application/json` |
| Status Code | `202 Accepted` / `400 Bad Request` |

### Request Body Format

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| order_ids | array[integer] | Yes | Array of order IDs (max 50) |
| courier_type | string | Yes | Courier service for all orders |
| template | string | No | Template variant for all orders |

### Response Body Format

| Field | Type | Description |
|-------|------|-------------|
| task_id | string | Celery task UUID |
| status | string | "processing" |
| polling_url | string | URL to check progress |
| estimated_time | integer | Estimated seconds to completion |
| total_orders | integer | Number of orders to process |

### Batch Processing Workflow

```
Batch Processing Flow
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   Validate  │───▶│   Create    │───▶│   Return    │
│   Request   │    │ Celery Task │    │  Task ID    │
└─────────────┘    └─────────────┘    └─────────────┘
                           │
                           ▼
                  ┌─────────────┐
                  │ Async Task  │
                  │ Processing  │
                  └─────────────┘
                           │
           ┌───────────────┼───────────────┐
           ▼               ▼               ▼
    Order 1         Order 2         Order N
   Generate       Generate       Generate
    Update         Update         Update
   Progress       Progress       Progress
```

### Progress Tracking Structure

| Field | Type | Description |
|-------|------|-------------|
| progress | integer | Completion percentage (0-100) |
| completed | integer | Number of completed orders |
| failed | integer | Number of failed orders |
| total | integer | Total number of orders |
| waybill_ids | array | Successfully generated waybill IDs |
| errors | array | Failed orders with error messages |

### Celery Task Configuration

| Setting | Value | Purpose |
|---------|-------|---------|
| bind | True | Access to task instance |
| max_retries | 3 | Retry on failure |
| default_retry_delay | 60 | Retry delay in seconds |
| time_limit | 1800 | 30-minute timeout |

### Expected Outcome
- Functional batch processing endpoint
- Asynchronous task execution with progress tracking
- Proper error handling for individual failures
- Scalable solution for bulk operations

### Verification Checklist
- [ ] Batch endpoint decorated properly
- [ ] Request validation for array handling
- [ ] Celery task created and configured
- [ ] Progress tracking implemented
- [ ] Task result storage working
- [ ] Error handling for individual failures
- [ ] Response includes polling information

---

## Task 84: Create Download Endpoint

### Overview
Implement the PDF download endpoint that serves generated waybill PDF files. This endpoint handles secure file access with proper authentication, supports both inline viewing and attachment downloads, and includes appropriate MIME type headers for browser compatibility.

### Dependencies
- Task 81: Create Waybill API Views
- Task 82: Generate endpoint with PDF creation
- File storage system configuration

### Instructions

1. **Add download custom action decorator**
   - Use `@action` decorator with `methods=['get']`
   - Set `detail=True` for instance-level endpoint
   - Set `url_path='pdf'` for PDF access
   - Configure URL name for reverse URL generation

2. **Define download endpoint function**
   - Create `download_pdf` method in WaybillViewSet
   - Accept request and waybill ID parameter
   - Return HTTP response with PDF file content

3. **Implement waybill lookup and validation**
   - Get waybill instance by ID
   - Verify waybill belongs to current tenant
   - Check waybill has associated PDF file
   - Handle cases where PDF doesn't exist

4. **Configure file serving mechanism**
   - Check if PDF file exists in storage
   - Open file handle for reading
   - Use Django HttpResponse for file serving
   - Set appropriate buffer size for large files

5. **Set proper HTTP headers**
   - Set `Content-Type` to `application/pdf`
   - Configure `Content-Disposition` header
   - Support both inline and attachment modes
   - Set `Content-Length` for file size

6. **Implement security measures**
   - Verify user has permission to access waybill
   - Check tenant isolation constraints
   - Log download activities for audit trail
   - Rate limit to prevent abuse

7. **Add content disposition options**
   - Support `?disposition=inline` for browser viewing
   - Support `?disposition=attachment` for downloads
   - Default to inline for PDF files
   - Generate appropriate filename

### Endpoint Specifications

| Property | Value |
|----------|-------|
| URL | `GET /api/waybills/{id}/pdf/` |
| Response Type | `application/pdf` |
| Status Code | `200 OK` / `404 Not Found` |
| Authentication | Required |

### Query Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| disposition | string | inline | `inline` or `attachment` |
| filename | string | auto | Custom filename for download |

### Response Headers

| Header | Value | Purpose |
|--------|-------|---------|
| Content-Type | application/pdf | PDF MIME type |
| Content-Disposition | inline/attachment | Browser behavior |
| Content-Length | file_size | Download progress |
| Cache-Control | private, max-age=3600 | Caching strategy |

### Download Workflow

```
Download Processing Flow
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   Validate  │───▶│   Locate    │───▶│   Stream    │
│  Waybill ID │    │ PDF File    │    │ PDF File    │
└─────────────┘    └─────────────┘    └─────────────┘
       │                   │                   │
       ▼                   ▼                   ▼
   Permission         File Check          Response
    Check            Success/Fail         Headers
       │                   │                   │
       ▼                   ▼                   ▼
   Authorized         File Stream         PDF Download
```

### Error Handling

| Error Scenario | Status Code | Response |
|----------------|-------------|----------|
| Waybill not found | 404 | `{"error": "Waybill not found"}` |
| No permission | 403 | `{"error": "Access denied"}` |
| PDF not generated | 404 | `{"error": "PDF not available"}` |
| File system error | 500 | `{"error": "File access failed"}` |

### Security Considerations

| Aspect | Implementation |
|--------|----------------|
| Authentication | Required login |
| Authorization | Tenant isolation |
| Rate Limiting | 100 requests/minute |
| Audit Logging | Download tracking |
| File Path | No directory traversal |

### Expected Outcome
- Secure PDF download endpoint
- Proper MIME type and header configuration
- Support for both inline and attachment viewing
- Comprehensive error handling and security

### Verification Checklist
- [ ] Download endpoint created with proper decorator
- [ ] Waybill lookup and validation implemented
- [ ] PDF file serving mechanism working
- [ ] HTTP headers set correctly
- [ ] Security measures implemented
- [ ] Error handling covers all scenarios
- [ ] Disposition parameter support functional

---

## Task 85: Create Waybill TypeScript Types

### Overview
Define comprehensive TypeScript interfaces and types for waybill-related data structures used throughout the frontend application. These types ensure type safety, provide intellisense support, and maintain consistency between API responses and frontend components.

### Dependencies
- Task 81: Waybill API Views structure
- Frontend TypeScript configuration
- API response format definitions

### Instructions

1. **Create waybill types directory**
   - Navigate to `frontend/lib/shipping/waybill/` directory
   - Create the directory structure if it doesn't exist
   - Create new file named `types.ts`

2. **Define base Waybill interface**
   - Create `Waybill` interface matching API response
   - Include all fields returned from ViewSet
   - Use proper TypeScript types for each field
   - Add JSDoc comments for documentation

3. **Define request interfaces**
   - Create `WaybillGenerateRequest` for generate endpoint
   - Create `WaybillBatchRequest` for batch processing
   - Include all required and optional fields
   - Add validation constraints as comments

4. **Define response interfaces**
   - Create `WaybillGenerateResponse` interface
   - Create `WaybillBatchResponse` with task details
   - Create `WaybillListResponse` for pagination
   - Include error response types

5. **Define status and enum types**
   - Create `WaybillStatus` union type for status values
   - Create `CourierType` union type for courier options
   - Create `TemplateType` union type for template variants
   - Add future-proof extensibility

6. **Define progress tracking types**
   - Create `BatchProgress` interface for task monitoring
   - Include progress percentage and status updates
   - Define error tracking structures
   - Add completion callback types

7. **Define component prop types**
   - Create interfaces for React component props
   - Define callback function signatures
   - Include optional and required prop indicators
   - Add generic types for reusability

### Base Type Definitions

| Interface | Purpose | Key Fields |
|-----------|---------|------------|
| Waybill | Main waybill object | id, waybill_number, order_id, status |
| WaybillGenerateRequest | Generate API request | order_id, courier_type, template |
| WaybillBatchRequest | Batch API request | order_ids, courier_type |
| BatchProgress | Progress tracking | progress, completed, errors |

### Status Enumerations

| Type | Values | Usage |
|------|--------|-------|
| WaybillStatus | "generated" \| "printed" \| "shipped" | Status tracking |
| CourierType | "domex" \| "koombiyo" \| "pronto" | Courier selection |
| TemplateType | "default" \| "express" \| "thermal" | Template variants |

### Interface Structure

```
Type Hierarchy
┌─────────────────┐
│   Base Types    │
├─────────────────┤
│   - Waybill     │
│   - Order       │
│   - Courier     │
└─────────────────┘
         │
         ▼
┌─────────────────┐
│ Request Types   │
├─────────────────┤
│ - Generate      │
│ - Batch         │
│ - Download      │
└─────────────────┘
         │
         ▼
┌─────────────────┐
│Response Types   │
├─────────────────┤
│ - Success       │
│ - Error         │
│ - Progress      │
└─────────────────┘
         │
         ▼
┌─────────────────┐
│Component Props  │
├─────────────────┤
│ - Button        │
│ - Dialog        │
│ - History       │
└─────────────────┘
```

### Type Safety Features

| Feature | Implementation | Benefit |
|---------|----------------|---------|
| Optional Fields | `field?:` syntax | Flexible interfaces |
| Union Types | `status: A \| B` | Constrained values |
| Generic Types | `Response<T>` | Reusable patterns |
| Readonly | `readonly id` | Immutable fields |

### API Response Mapping

| API Field | TypeScript Type | Notes |
|-----------|-----------------|-------|
| id | number | Primary key |
| waybill_number | string | Unique identifier |
| created_at | string | ISO date string |
| pdf_url | string \| null | Optional PDF link |
| status | WaybillStatus | Enum constraint |

### Expected Outcome
- Complete TypeScript type definitions
- Type safety throughout frontend application
- Intellisense support in IDE
- Consistent data structures across components

### Verification Checklist
- [ ] `frontend/lib/shipping/waybill/types.ts` file created
- [ ] All core interfaces defined
- [ ] Request and response types complete
- [ ] Status enums and unions defined
- [ ] Component prop types included
- [ ] JSDoc documentation added
- [ ] Types export correctly

---

## Task 86: Create Waybill API Client

### Overview
Implement a comprehensive API client for waybill operations that handles HTTP requests, error management, authentication, and response transformation. The client provides a clean interface for components to interact with waybill endpoints while managing loading states and error conditions.

### Dependencies
- Task 85: Waybill TypeScript Types
- Task 82-84: API endpoints implementation
- Frontend HTTP client configuration (axios/fetch)

### Instructions

1. **Create API client file**
   - Navigate to `frontend/lib/shipping/waybill/` directory
   - Create new file named `client.ts`
   - Import types from types.ts file
   - Import HTTP client and configuration

2. **Define client class structure**
   - Create `WaybillClient` class with methods
   - Include base URL configuration
   - Add authentication header handling
   - Set up default request options

3. **Implement generate method**
   - Create `generate` method accepting WaybillGenerateRequest
   - Make POST request to `/api/waybills/generate/`
   - Handle success and error responses
   - Transform response to match TypeScript types

4. **Implement batch method**
   - Create `generateBatch` method for batch processing
   - Make POST request to `/api/waybills/batch/`
   - Return task ID and polling information
   - Include progress polling helper method

5. **Implement download method**
   - Create `download` method for PDF files
   - Make GET request to `/api/waybills/{id}/pdf/`
   - Handle binary response (PDF blob)
   - Support both inline and attachment modes

6. **Implement history method**
   - Create `getHistory` method for waybill listing
   - Support filtering by order_id
   - Handle pagination parameters
   - Return paginated waybill list

7. **Add error handling and retry logic**
   - Implement comprehensive error handling
   - Add retry logic for network failures
   - Transform API errors to user-friendly messages
   - Include loading state management

8. **Add progress polling for batch operations**
   - Create `pollBatchProgress` method
   - Implement automatic polling with intervals
   - Handle completed, failed, and pending states
   - Provide cancellation mechanism

### Client Method Specifications

| Method | Parameters | Returns | Purpose |
|--------|------------|---------|---------|
| generate | WaybillGenerateRequest | Promise<Waybill> | Single waybill generation |
| generateBatch | WaybillBatchRequest | Promise<BatchTask> | Batch generation |
| download | waybillId, options | Promise<Blob> | PDF download |
| getHistory | filters, pagination | Promise<WaybillList> | Waybill history |
| pollBatchProgress | taskId | Promise<BatchProgress> | Progress monitoring |

### Error Handling Strategy

```
Error Handling Flow
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   Network   │───▶│ Transform   │───▶│   Return    │
│   Error     │    │   Error     │    │ User Error  │
└─────────────┘    └─────────────┘    └─────────────┘
       │                   │                   │
       ▼                   ▼                   ▼
  HTTP Status        Error Message       UI Display
   (400-500)          Translation        Error State
```

### HTTP Configuration

| Setting | Value | Purpose |
|---------|-------|---------|
| baseURL | `/api/waybills/` | API endpoint base |
| timeout | 30000ms | Request timeout |
| withCredentials | true | Cookie authentication |
| headers | Accept: application/json | Content type |

### Response Transformation

| API Response | Client Return | Transformation |
|--------------|---------------|----------------|
| Django dates | Date objects | ISO string parsing |
| Null values | Undefined | Optional field handling |
| Error format | User message | Error code mapping |
| Pagination | Structured object | Count, next, previous |

### Loading State Management

| Method | Loading Indicator | Duration |
|--------|------------------|----------|
| generate | Button spinner | 2-5 seconds |
| generateBatch | Progress dialog | 30-300 seconds |
| download | Download indicator | 1-3 seconds |
| getHistory | Table skeleton | 1-2 seconds |

### Expected Outcome
- Complete API client with all waybill operations
- Proper error handling and user feedback
- Loading state management
- Type-safe method signatures

### Verification Checklist
- [ ] `frontend/lib/shipping/waybill/client.ts` file created
- [ ] WaybillClient class defined
- [ ] All CRUD methods implemented
- [ ] Error handling comprehensive
- [ ] Progress polling functional
- [ ] Loading states managed
- [ ] TypeScript types properly used

---

## Task 87: Create WaybillPrintButton Component

### Overview
Create a React component that provides a simple button interface for generating and downloading single waybills. The component handles the complete workflow from generation request to PDF download, including loading states, error handling, and user feedback.

### Dependencies
- Task 86: Waybill API Client
- Task 85: TypeScript types
- Shadcn/UI button and icon components

### Instructions

1. **Create component file**
   - Navigate to `frontend/components/orders/` directory
   - Create new file named `WaybillPrintButton.tsx`
   - Import required React hooks and types
   - Import Shadcn/UI components and icons

2. **Define component props interface**
   - Create `WaybillPrintButtonProps` interface
   - Include required `orderId` prop
   - Add optional callback props (onSuccess, onError)
   - Include optional styling and configuration props

3. **Implement component state management**
   - Use `useState` for loading state
   - Track generation status (idle, generating, downloading)
   - Manage error state and messages
   - Handle success/completion state

4. **Create waybill generation handler**
   - Import waybill client from Task 86
   - Create async function to handle generation
   - Call client.generate with order ID
   - Update loading state during process

5. **Implement PDF download functionality**
   - Trigger download after successful generation
   - Use client.download method for PDF retrieval
   - Create downloadable blob and URL
   - Trigger browser download automatically

6. **Add error handling and user feedback**
   - Catch and display generation errors
   - Show user-friendly error messages
   - Provide retry capability on failure
   - Clear errors on successful retry

7. **Design button UI and interactions**
   - Use Shadcn/UI Button component
   - Add printer icon from Lucide React
   - Show loading spinner during generation
   - Disable button during processing
   - Add tooltip with current status

8. **Add accessibility features**
   - Include proper ARIA labels
   - Add keyboard navigation support
   - Provide screen reader announcements
   - Ensure proper focus management

### Component Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| orderId | number | Yes | - | Order ID to generate waybill for |
| courierType | CourierType | No | "domex" | Default courier service |
| template | TemplateType | No | "default" | Waybill template variant |
| onSuccess | (waybill) => void | No | - | Success callback |
| onError | (error) => void | No | - | Error callback |
| className | string | No | "" | Additional CSS classes |
| disabled | boolean | No | false | Disable button |

### Button States

| State | Appearance | Behavior | Duration |
|-------|------------|----------|----------|
| Idle | "Print Waybill" with printer icon | Clickable | - |
| Generating | Spinner + "Generating..." | Disabled | 2-5s |
| Downloading | Spinner + "Downloading..." | Disabled | 1-3s |
| Success | Checkmark + "Downloaded" | Brief feedback | 2s |
| Error | Alert icon + "Retry" | Clickable retry | Until retry |

### Component Workflow

```
User Interaction Flow
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   Button    │───▶│  Generate   │───▶│  Download   │
│   Click     │    │  Waybill    │    │    PDF      │
└─────────────┘    └─────────────┘    └─────────────┘
       │                   │                   │
       ▼                   ▼                   ▼
   Loading            API Call           Blob Download
   Spinner           Success/Error       Browser Save
```

### Error States and Messages

| Error Type | User Message | Recovery Action |
|------------|--------------|-----------------|
| Network Error | "Connection failed. Please try again." | Retry button |
| Order Not Found | "Order not found. Please refresh." | Disabled until refresh |
| Generation Failed | "Waybill generation failed. Retry?" | Retry button |
| PDF Error | "Download failed. Try again." | Retry download only |

### Loading Indicators

| Phase | Visual Indicator | Text | Icon |
|-------|------------------|------|------|
| Initial | Printer icon | "Print Waybill" | Printer |
| Generating | Spinner | "Generating..." | Loading |
| Downloading | Spinner | "Downloading..." | Download |
| Complete | Checkmark | "Downloaded" | Check |

### Expected Outcome
- Functional print button component
- Complete generation and download workflow
- Proper loading states and error handling
- Accessible and user-friendly interface

### Verification Checklist
- [ ] `frontend/components/orders/WaybillPrintButton.tsx` created
- [ ] Component props interface defined
- [ ] State management implemented
- [ ] Waybill generation handler working
- [ ] PDF download functionality complete
- [ ] Error handling comprehensive
- [ ] Button states and UI proper
- [ ] Accessibility features included

---

## Task 88: Create BatchPrintDialog Component

### Overview
Create a sophisticated dialog component for batch waybill generation that allows users to select multiple orders, choose courier preferences, monitor generation progress, and download the completed waybills as a ZIP file. The component manages complex state transitions and provides real-time feedback.

### Dependencies
- Task 86: Waybill API Client with batch support
- Task 87: WaybillPrintButton (for reference patterns)
- Shadcn/UI dialog, progress, and form components

### Instructions

1. **Create dialog component file**
   - Navigate to `frontend/components/orders/` directory
   - Create new file named `BatchPrintDialog.tsx`
   - Import required React hooks and types
   - Import Shadcn/UI dialog and form components

2. **Define component props interface**
   - Create `BatchPrintDialogProps` interface
   - Include `orderIds` array prop for available orders
   - Add dialog state props (open, onOpenChange)
   - Include callback props for completion and cancellation

3. **Implement multi-step dialog state**
   - Use `useState` for current step tracking
   - Define steps: Selection, Configuration, Processing, Completion
   - Manage transition between steps
   - Handle step validation requirements

4. **Create order selection interface**
   - Display list of available orders with checkboxes
   - Show order details (number, customer, value)
   - Include select all/none functionality
   - Validate minimum selection (1 order)

5. **Implement configuration step**
   - Add courier type selection radio buttons
   - Include template variant selection
   - Add optional delivery instructions
   - Validate configuration before proceeding

6. **Create progress monitoring interface**
   - Display progress bar with percentage
   - Show current operation status
   - List completed and failed orders
   - Provide cancel operation button

7. **Implement batch processing logic**
   - Call waybill client batch generation
   - Set up progress polling mechanism
   - Handle individual order failures
   - Update UI with real-time progress

8. **Add completion and download handling**
   - Display generation summary
   - Show success/failure counts
   - Provide ZIP download button
   - Include individual waybill access

### Dialog Steps

| Step | Purpose | Duration | Actions |
|------|---------|----------|---------|
| Selection | Choose orders | User-controlled | Select, validate |
| Configuration | Set preferences | User-controlled | Configure, validate |
| Processing | Generate waybills | 30-300 seconds | Monitor, cancel |
| Completion | Download results | User-controlled | Download, close |

### Order Selection Interface

| Element | Purpose | Behavior |
|---------|---------|----------|
| Order List | Display available orders | Scrollable, searchable |
| Checkboxes | Individual selection | Toggle order inclusion |
| Select All | Mass selection | Toggle all orders |
| Search Filter | Find orders | Filter by order number/customer |
| Selection Count | Show selected total | Update dynamically |

### Configuration Options

| Setting | Type | Options | Default |
|---------|------|---------|---------|
| Courier Type | Radio | domex, koombiyo, pronto | domex |
| Template | Select | default, express, thermal | default |
| Priority | Checkbox | Express processing | false |
| Instructions | Textarea | Special delivery notes | empty |

### Progress Tracking Display

```
Progress Interface Layout
┌─────────────────────────────────────┐
│  Generating Waybills... 45%         │
│  ████████████░░░░░░░░░░░░░░░░░░░░   │
│                                     │
│  Completed: 18/40                   │
│  Failed: 2/40                       │
│  Current: Order #12345              │
│                                     │
│  [ Cancel Processing ]              │
└─────────────────────────────────────┘
```

### Batch Processing States

| State | UI Display | User Actions |
|-------|------------|--------------|
| Idle | Initial dialog | Configure and start |
| Starting | "Starting batch..." | Cancel before begin |
| Processing | Progress bar and status | Cancel processing |
| Completing | "Finalizing..." | Wait for completion |
| Complete | Summary and download | Download, close |
| Cancelled | "Operation cancelled" | Close dialog |
| Error | Error message | Retry or close |

### Expected Outcome
- Full-featured batch processing dialog
- Multi-step workflow with validation
- Real-time progress monitoring
- Complete error handling and recovery

### Verification Checklist
- [ ] `frontend/components/orders/BatchPrintDialog.tsx` created
- [ ] Multi-step dialog state management
- [ ] Order selection interface functional
- [ ] Configuration step working
- [ ] Progress monitoring implemented
- [ ] Batch processing logic complete
- [ ] Download functionality working
- [ ] Error handling comprehensive

---

## Task 89: Create WaybillHistory UI Component

### Overview
Create a comprehensive history interface that displays all generated waybills for a tenant or specific order. The component provides tabular display with sorting, filtering, pagination, and action buttons for reprint and download operations. It serves as a complete waybill management interface.

### Dependencies
- Task 86: Waybill API Client
- Task 85: TypeScript types
- Shadcn/UI table, pagination, and filter components

### Instructions

1. **Create history component file**
   - Navigate to `frontend/components/orders/` directory
   - Create new file named `WaybillHistory.tsx`
   - Import required React hooks and types
   - Import Shadcn/UI table and pagination components

2. **Define component props interface**
   - Create `WaybillHistoryProps` interface
   - Add optional `orderId` prop for order-specific view
   - Include filtering and display configuration props
   - Add callback props for actions (reprint, download)

3. **Implement data fetching and state management**
   - Use `useEffect` for initial data loading
   - Manage loading, error, and data states
   - Implement pagination state tracking
   - Handle filter and sort state management

4. **Create table structure with columns**
   - Define table columns for waybill data
   - Include waybill number, order reference, courier
   - Add generation date, status, and actions columns
   - Implement sortable column headers

5. **Implement filtering capabilities**
   - Add date range filter for generation date
   - Include courier type filter dropdown
   - Add status filter with multiple selection
   - Implement search by waybill number

6. **Create action buttons for each row**
   - Add download button for PDF access
   - Include reprint button for regeneration
   - Add view details button for full information
   - Implement batch action checkboxes

7. **Add pagination and performance optimization**
   - Implement pagination with page size options
   - Add "Load More" functionality for large datasets
   - Use virtual scrolling for thousands of records
   - Implement debounced search and filtering

8. **Handle error states and empty data**
   - Display loading skeletons during fetch
   - Show empty state when no waybills found
   - Handle API errors with retry options
   - Provide helpful messages and actions

### Table Columns

| Column | Width | Sortable | Description |
|--------|--------|----------|-------------|
| Waybill # | 120px | Yes | Waybill number |
| Order | 100px | Yes | Order reference |
| Customer | 180px | Yes | Customer name |
| Courier | 100px | Yes | Courier service |
| Generated | 120px | Yes | Date and time |
| Status | 100px | Yes | Current status |
| Actions | 120px | No | Download, reprint |

### Filter Options

| Filter | Type | Options | Purpose |
|--------|------|---------|---------|
| Date Range | Date picker | From/To dates | Generation period |
| Courier | Multi-select | All available couriers | Service filter |
| Status | Multi-select | All status values | Progress filter |
| Search | Text input | Waybill/Order number | Quick lookup |

### Table Layout

```
WaybillHistory Table Layout
┌──────────────────────────────────────────────────────────────┐
│ 🔍 Search [________] | Courier [▼] | Status [▼] | Date [▼]   │
├──────────────────────────────────────────────────────────────┤
│ Waybill#  | Order    | Customer      | Courier | Date | ⚙️    │
├──────────────────────────────────────────────────────────────┤
│ WAY001    | ORD-123  | John Smith    | Domex   | 2026 | [📄]  │
│ WAY002    | ORD-124  | Jane Doe      | Koomb   | 2026 | [📄]  │
│ WAY003    | ORD-125  | Bob Johnson   | Pronto  | 2026 | [📄]  │
├──────────────────────────────────────────────────────────────┤
│ « Previous | Page 1 of 5 | Next »     | 50 per page [▼]     │
└──────────────────────────────────────────────────────────────┘
```

### Action Button Functionality

| Button | Icon | Action | Confirmation |
|--------|------|--------|--------------|
| Download | 📄 | Download PDF | None |
| Reprint | 🖨️ | Generate new PDF | "Regenerate waybill?" |
| View | 👁️ | Show details dialog | None |
| Delete | 🗑️ | Remove waybill | "Delete permanently?" |

### Loading and Error States

| State | Display | Action Available |
|-------|---------|------------------|
| Loading | Skeleton table | Cancel request |
| Error | Error message | Retry button |
| Empty | "No waybills found" | Clear filters |
| Search Empty | "No matches found" | Clear search |

### Responsive Behavior

| Screen Size | Columns Shown | Navigation |
|-------------|---------------|------------|
| Mobile | Waybill, Status, Actions | Stack layout |
| Tablet | Add Order, Courier | Horizontal scroll |
| Desktop | All columns | Full table |

### Expected Outcome
- Complete waybill history management interface
- Advanced filtering and search capabilities
- Efficient pagination and performance
- Comprehensive action buttons and workflows

### Verification Checklist
- [ ] `frontend/components/orders/WaybillHistory.tsx` created
- [ ] Data fetching and state management working
- [ ] Table structure with all columns
- [ ] Filtering and search functional
- [ ] Pagination implemented
- [ ] Action buttons working
- [ ] Error handling comprehensive
- [ ] Responsive design complete

---

## Task 90: Create Integration Tests

### Overview
Develop comprehensive integration tests that verify the complete waybill generation workflow from API endpoints through frontend components. The tests cover end-to-end scenarios, error conditions, performance requirements, and multi-tenant isolation to ensure system reliability.

### Dependencies
- Task 81-89: All previous tasks completed
- Django test framework setup
- Jest/React Testing Library configuration
- Test database with sample data

### Instructions

1. **Create test file structure**
   - Navigate to `tests/shipping/` directory
   - Create new file named `test_waybill_e2e.py`
   - Set up Django test case classes
   - Import all necessary models and utilities

2. **Set up test data and fixtures**
   - Create tenant test setup with sample data
   - Generate test orders with complete information
   - Set up courier configurations
   - Create user accounts with proper permissions

3. **Write API endpoint integration tests**
   - Test waybill generation endpoint with valid data
   - Test batch generation with multiple orders
   - Test PDF download endpoint functionality
   - Test error conditions and validation

4. **Create frontend component integration tests**
   - Test WaybillPrintButton component workflow
   - Test BatchPrintDialog multi-step process
   - Test WaybillHistory data display and interactions
   - Mock API responses for consistent testing

5. **Implement end-to-end workflow tests**
   - Test complete generation from order to PDF
   - Test batch processing with progress tracking
   - Test download and file handling
   - Test error recovery and retry mechanisms

6. **Add multi-tenant isolation tests**
   - Verify tenant data separation
   - Test cross-tenant access prevention
   - Validate schema isolation in database
   - Test permission and authentication requirements

7. **Create performance and load tests**
   - Test single waybill generation speed
   - Test batch processing with large datasets
   - Test concurrent user scenarios
   - Validate memory usage and cleanup

8. **Add barcode and template validation tests**
   - Test barcode generation and format
   - Validate template rendering accuracy
   - Test PDF structure and content
   - Verify courier-specific formatting

### Test Categories

| Category | Purpose | Test Count | Coverage |
|----------|---------|------------|----------|
| API Endpoints | Verify REST API functionality | 8 tests | All endpoints |
| Frontend Components | Test React component behavior | 6 tests | All components |
| End-to-End | Complete workflow validation | 4 tests | Full scenarios |
| Multi-Tenant | Isolation and security | 5 tests | Tenant safety |
| Performance | Speed and load testing | 3 tests | Performance SLAs |
| Error Handling | Failure scenarios | 6 tests | Error recovery |

### API Test Scenarios

| Test Name | Scenario | Expected Result |
|-----------|----------|-----------------|
| test_generate_waybill | Valid order generation | 201 Created with PDF |
| test_generate_invalid_order | Non-existent order | 404 Not Found |
| test_batch_generation | Multiple orders | 202 Accepted with task |
| test_batch_empty_list | Empty order list | 400 Bad Request |
| test_download_pdf | Valid waybill PDF | 200 OK with PDF content |
| test_download_missing | Non-existent waybill | 404 Not Found |
| test_tenant_isolation | Cross-tenant access | 403 Forbidden |
| test_permission_required | Unauthenticated access | 401 Unauthorized |

### Frontend Test Scenarios

| Test Name | Component | Scenario | Expected Behavior |
|-----------|-----------|----------|-------------------|
| test_print_button_success | WaybillPrintButton | Successful generation | Shows success state |
| test_print_button_error | WaybillPrintButton | API error | Shows error message |
| test_batch_dialog_flow | BatchPrintDialog | Complete workflow | Processes all steps |
| test_batch_cancel | BatchPrintDialog | User cancellation | Stops processing |
| test_history_loading | WaybillHistory | Data fetching | Shows loading state |
| test_history_filtering | WaybillHistory | Apply filters | Updates table data |

### End-to-End Test Workflow

```
E2E Test Flow
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   Create    │───▶│   Generate  │───▶│   Verify    │
│ Test Order  │    │   Waybill   │    │   Result    │
└─────────────┘    └─────────────┘    └─────────────┘
       │                   │                   │
       ▼                   ▼                   ▼
   Database           API Call            PDF Check
    Setup             Success            Content Valid
       │                   │                   │
       ▼                   ▼                   ▼
  Order Ready        Waybill Created      Test Complete
```

### Performance Test Requirements

| Metric | Requirement | Test Method |
|--------|-------------|-------------|
| Single Generation | < 5 seconds | Time measurement |
| Batch Processing | < 2 min for 50 orders | Progress monitoring |
| PDF Download | < 3 seconds | Response time |
| Concurrent Users | 10 users simultaneously | Load testing |

### Multi-Tenant Test Scenarios

| Test | Setup | Action | Expected Result |
|------|-------|--------|-----------------|
| Cross-tenant access | Two tenants | Access other's waybill | 403 Forbidden |
| Schema isolation | Different schemas | Query wrong schema | No data returned |
| User permissions | Limited user | Admin operation | 403 Forbidden |
| Data leakage | Shared request | Filter by tenant | Only own data |

### Expected Outcome
- Comprehensive test coverage for all components
- Verified end-to-end functionality
- Performance benchmarks validated
- Security and isolation confirmed

### Verification Checklist
- [ ] `tests/shipping/test_waybill_e2e.py` file created
- [ ] Test data and fixtures set up
- [ ] API endpoint tests complete
- [ ] Frontend component tests working
- [ ] End-to-end workflow tests functional
- [ ] Multi-tenant isolation verified
- [ ] Performance tests passing
- [ ] Error handling tests comprehensive

---

## Summary

This document established the complete waybill API and frontend integration, including Django REST Framework ViewSets for waybill operations, comprehensive TypeScript interfaces, React components for user interactions, and thorough integration testing coverage. These elements provide a robust, scalable solution for waybill generation and management.

### Completed Tasks
1. ✓ Created Waybill API ViewSet with proper tenant isolation
2. ✓ Implemented generate endpoint for single waybill creation
3. ✓ Created batch endpoint with asynchronous processing
4. ✓ Added secure PDF download endpoint
5. ✓ Defined comprehensive TypeScript type interfaces
6. ✓ Built API client with error handling and progress tracking
7. ✓ Created WaybillPrintButton component for single operations
8. ✓ Developed BatchPrintDialog for bulk processing
9. ✓ Implemented WaybillHistory UI for management interface
10. ✓ Established comprehensive integration test coverage

### Next Steps
This completes Group F (API & Frontend) and SubPhase 10 (Waybill Generation). Proceed to SubPhase-11 (WhatsApp Business API) to continue with advanced notification and communication features for the LankaCommerce Cloud platform.