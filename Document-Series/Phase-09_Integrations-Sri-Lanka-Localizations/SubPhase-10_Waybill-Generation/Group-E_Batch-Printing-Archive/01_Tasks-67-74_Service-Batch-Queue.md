# Tasks 67-74: Service Batch Queue

> **Phase:** 09 - Integrations & Sri Lanka Localizations  
> **SubPhase:** 10 - Waybill Generation  
> **Group:** E - Batch Printing & Archive  
> **Document:** 01 of 02  
> **Tasks Covered:** 67, 68, 69, 70, 71, 72, 73, 74

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **→ Next Document:** [02_Tasks-75-80_Archive-Reprint-Verify.md](02_Tasks-75-80_Archive-Reprint-Verify.md)

---

## Document Overview

This document covers the creation of the WaybillService with single and batch generation methods, implementation of BatchWaybillJob as a Celery task with progress tracking, batch download as ZIP files, and print queue management with ordering and sequencing for Sri Lankan business workflows.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 67 | Create WaybillService | High | 45 min |
| 68 | Create generate_single | Medium | 30 min |
| 69 | Create generate_batch | Medium | 35 min |
| 70 | Create BatchWaybillJob | Medium | 40 min |
| 71 | Create Batch Progress | Low | 20 min |
| 72 | Create Batch Download | Medium | 35 min |
| 73 | Create Print Queue | Medium | 30 min |
| 74 | Create Print Order | Low | 25 min |

---

## Task 67: Create WaybillService

### Overview
Create the WaybillService as the central service class for all waybill operations. This service handles waybill generation, validation, storage, and coordination with other shipping services. It serves as the main interface for waybill-related operations throughout the system.

### Dependencies
- Task 66: Create Waybill Templates must be complete
- PostgreSQL database is configured
- Django models are set up
- Courier integrations are available

### Instructions

1. **Create service directory structure**
   - Navigate to `backend/apps/shipping/` directory
   - Create `services` directory if it doesn't exist
   - This will contain all shipping-related service classes

2. **Create WaybillService class file**
   - Create `waybill_service.py` in `services` directory
   - Set up class structure with proper imports
   - Import necessary Django models and utilities

3. **Define service initialization**
   - Create `__init__` method with tenant context
   - Initialize database connections
   - Set up logging for service operations

4. **Implement courier integration handling**
   - Create method to determine courier service
   - Handle courier-specific configurations
   - Manage API credentials and endpoints

5. **Create validation methods**
   - Implement address validation for Sri Lankan formats
   - Validate phone numbers (+94 XX XXX XXXX format)
   - Check order data completeness and accuracy

6. **Set up error handling framework**
   - Create custom exception classes
   - Implement retry mechanisms
   - Add comprehensive error logging

7. **Configure service registration**
   - Register service with Django dependency injection
   - Set up service caching if needed
   - Ensure proper tenant isolation

### Service Architecture

| Component | Purpose | Implementation |
|-----------|---------|----------------|
| Initialization | Service setup | __init__ method with tenant context |
| Validation | Data verification | validate_order_data() |
| Courier Selection | Service routing | select_courier_service() |
| Error Handling | Exception management | Custom exception classes |
| Logging | Operation tracking | Python logging framework |

### Class Structure

```
WaybillService
├── __init__(self, tenant)
├── validate_order_data(self, order)
├── select_courier_service(self, order)
├── generate_single(self, order_id)      # Task 68
├── generate_batch(self, order_ids)      # Task 69
└── _handle_service_error(self, error)
```

### Validation Framework

| Validation Type | Sri Lankan Context | Implementation |
|-----------------|-------------------|----------------|
| Phone Numbers | +94 XX XXX XXXX format | Regex validation |
| Addresses | Local area codes | Address normalization |
| COD Amounts | LKR currency format | Decimal validation |
| Postal Codes | Sri Lankan postal system | Code verification |

### Expected Outcome
- Functional WaybillService class with proper initialization
- Comprehensive validation for Sri Lankan business context
- Error handling and logging framework
- Foundation for single and batch generation methods

### Verification Checklist
- [ ] `backend/apps/shipping/services/waybill_service.py` file created
- [ ] Service class properly initialized with tenant context
- [ ] Validation methods for Sri Lankan address and phone formats
- [ ] Courier integration framework established
- [ ] Error handling and logging implemented
- [ ] Service registered with Django container

---

## Task 68: Create generate_single

### Overview
Implement the generate_single method in WaybillService for creating individual waybills. This method handles the complete workflow of generating a single waybill, including validation, courier API calls, PDF generation, and database storage.

### Dependencies
- Task 67: Create WaybillService

### Instructions

1. **Add method signature to WaybillService**
   - Define generate_single method with order_id parameter
   - Add type hints for parameters and return values
   - Include optional parameters for customization

2. **Implement order data retrieval**
   - Fetch order details from database
   - Validate order exists and belongs to current tenant
   - Ensure order is in valid state for waybill generation

3. **Perform pre-generation validation**
   - Use validation methods from Task 67
   - Check delivery address completeness
   - Verify customer contact information

4. **Select and configure courier service**
   - Determine appropriate courier based on order details
   - Load courier-specific configuration
   - Prepare API request parameters

5. **Generate waybill number**
   - Create unique waybill identifier
   - Follow Sri Lankan courier numbering conventions
   - Ensure number uniqueness across tenant

6. **Make courier API call**
   - Send waybill creation request to courier API
   - Handle API response and extract tracking details
   - Manage API rate limits and timeouts

7. **Generate PDF waybill**
   - Use template from Task 66
   - Populate template with order and courier data
   - Generate high-quality PDF for printing

8. **Store waybill record**
   - Create waybill database record
   - Link to original order
   - Store tracking number and courier details

9. **Handle success and error scenarios**
   - Return waybill instance on success
   - Implement rollback on failure
   - Log all operations for audit trail

### Method Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| order_id | int | Yes | Primary key of order |
| template_id | int | No | Custom template override |
| priority | str | No | Processing priority level |

### Generation Workflow

```
Order Retrieval
    ↓
Data Validation
    ↓
Courier Selection
    ↓
Waybill Number Generation
    ↓
Courier API Call
    ↓
PDF Generation
    ↓
Database Storage
    ↓
Return Waybill Instance
```

### Error Handling Scenarios

| Error Type | Handling Strategy | Recovery Action |
|------------|-------------------|-----------------|
| Order Not Found | Raise ValidationError | Return error message |
| Invalid Address | Raise ValidationError | Request address correction |
| Courier API Failure | Retry with backoff | Fall back to manual process |
| PDF Generation Failure | Log error | Regenerate with basic template |
| Database Error | Rollback transaction | Retry operation |

### Expected Outcome
- Functional single waybill generation
- Complete workflow from order to PDF
- Proper error handling and rollback
- Database record creation and linking

### Verification Checklist
- [ ] generate_single method added to WaybillService
- [ ] Order retrieval and validation implemented
- [ ] Courier API integration working
- [ ] PDF generation using templates
- [ ] Database record creation
- [ ] Error handling and rollback logic
- [ ] Method returns proper Waybill instance

---

## Task 69: Create generate_batch

### Overview
Implement the generate_batch method in WaybillService for creating multiple waybills simultaneously. This method processes a list of orders, generates waybills for each, and returns a collection of generated waybills with proper error handling for individual failures.

### Dependencies
- Task 67: Create WaybillService
- Task 68: Create generate_single

### Instructions

1. **Add batch method to WaybillService**
   - Define generate_batch method accepting list of order IDs
   - Add parameters for batch configuration
   - Include progress callback for tracking

2. **Implement order list validation**
   - Validate all order IDs exist and belong to tenant
   - Check for duplicate order IDs in the batch
   - Verify batch size limits for performance

3. **Set up batch processing loop**
   - Iterate through order IDs list
   - Call generate_single for each order
   - Handle individual order failures gracefully

4. **Implement progress tracking**
   - Calculate completion percentage
   - Update progress in Redis or database
   - Provide callbacks for UI updates

5. **Handle partial success scenarios**
   - Continue processing even if individual orders fail
   - Collect successful and failed waybills separately
   - Return comprehensive result summary

6. **Implement batch optimization**
   - Group orders by courier for API efficiency
   - Use bulk database operations where possible
   - Implement parallel processing for large batches

7. **Configure batch limits and timeouts**
   - Set maximum batch size (e.g., 100 orders)
   - Implement processing timeouts
   - Add rate limiting for courier APIs

8. **Create batch result structure**
   - Return object with successful waybills list
   - Include failed orders with error details
   - Provide summary statistics

### Method Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| order_ids | List[int] | Yes | List of order primary keys |
| batch_size | int | No | Processing chunk size (default: 50) |
| progress_callback | Callable | No | Function to call with progress updates |

### Batch Processing Flow

```
Order IDs Validation
    ↓
Batch Size Check
    ↓
┌─────────────────────────┐
│   For Each Order ID     │
│         ↓               │
│   Call generate_single  │
│         ↓               │
│   Update Progress       │
│         ↓               │
│   Handle Result         │
└─────────────────────────┘
    ↓
Compile Results
    ↓
Return Batch Summary
```

### Batch Result Structure

| Field | Type | Description |
|-------|------|-------------|
| successful | List[Waybill] | Successfully generated waybills |
| failed | List[dict] | Failed orders with error details |
| total_processed | int | Total number of orders processed |
| success_count | int | Number of successful generations |
| failure_count | int | Number of failed generations |
| processing_time | float | Total time taken in seconds |

### Error Handling Strategy

| Error Level | Handling | Impact |
|-------------|----------|--------|
| Individual Order | Log error, continue batch | Partial success |
| Courier API Limit | Pause, retry with backoff | Temporary delay |
| System Resource | Break batch into smaller chunks | Reduced throughput |
| Critical System | Abort entire batch | Complete failure |

### Performance Considerations

| Aspect | Implementation | Benefit |
|--------|----------------|---------|
| Chunking | Process in smaller batches | Memory management |
| Parallel Processing | Use ThreadPoolExecutor | Faster execution |
| API Batching | Group by courier | Reduced API calls |
| Progress Updates | Every 10% completion | User feedback |

### Expected Outcome
- Functional batch waybill generation
- Robust error handling for partial failures
- Progress tracking and reporting
- Optimized performance for large batches

### Verification Checklist
- [ ] generate_batch method added to WaybillService
- [ ] Order list validation implemented
- [ ] Progress tracking functionality
- [ ] Individual error handling without batch abort
- [ ] Batch result structure returned
- [ ] Performance optimization for large batches
- [ ] Proper logging and audit trail

---

## Task 70: Create BatchWaybillJob

### Overview
Create BatchWaybillJob as a Celery task for asynchronous batch waybill generation. This task enables background processing of large waybill batches without blocking the main application, providing progress tracking and result management through Celery's task infrastructure.

### Dependencies
- Task 69: Create generate_batch
- Celery is configured and running
- Redis is configured for task results

### Instructions

1. **Create Celery task file**
   - Create `tasks` directory in `backend/apps/shipping/`
   - Create `batch_waybill_task.py` file
   - Import necessary Celery and Django components

2. **Define BatchWaybillJob task**
   - Use `@shared_task` decorator for task definition
   - Set task name and queue configuration
   - Configure task routing and priority

3. **Implement task parameters**
   - Accept tenant_id for multi-tenant isolation
   - Accept order_ids list for batch processing
   - Include optional parameters for customization

4. **Set up tenant context in task**
   - Switch to correct tenant schema
   - Initialize database connections
   - Set up tenant-specific configurations

5. **Integrate with WaybillService**
   - Create WaybillService instance within task
   - Call generate_batch method
   - Handle service-level errors

6. **Implement progress reporting**
   - Use Celery's update_state for progress updates
   - Store progress information in task metadata
   - Enable frontend progress tracking

7. **Configure task retry logic**
   - Set automatic retry parameters
   - Implement exponential backoff
   - Define maximum retry attempts

8. **Handle task result storage**
   - Store successful waybills information
   - Store error details for failed orders
   - Set appropriate result expiration

9. **Add comprehensive logging**
   - Log task start and completion
   - Log individual order processing
   - Include tenant and user context

### Task Configuration

| Setting | Value | Purpose |
|---------|-------|---------|
| Queue | 'waybill' | Dedicated queue for waybill tasks |
| Routing Key | 'waybill.batch' | Task routing |
| Max Retries | 3 | Failure recovery |
| Retry Delay | 60 seconds | Backoff between retries |
| Task Timeout | 3600 seconds | Maximum execution time |

### Task Signature

```python
@shared_task(bind=True, name='shipping.batch_waybill')
def batch_waybill_task(self, tenant_id, order_ids, **kwargs)
```

### Progress Tracking Structure

| State | Progress % | Metadata |
|-------|------------|----------|
| PENDING | 0% | Task queued |
| PROGRESS | 1-99% | Current order being processed |
| SUCCESS | 100% | Batch completion summary |
| FAILURE | N/A | Error details |
| RETRY | N/A | Retry attempt information |

### Task Execution Flow

```
Task Starts
    ↓
Setup Tenant Context
    ↓
Initialize WaybillService
    ↓
Update State: PROGRESS 0%
    ↓
┌─────────────────────────┐
│   Process Batch         │
│   Update Progress       │
│   (10%, 20%, 30%...)   │
└─────────────────────────┘
    ↓
Store Results
    ↓
Update State: SUCCESS 100%
    ↓
Task Completes
```

### Error Handling

| Error Type | Action | Retry |
|------------|--------|-------|
| Tenant Not Found | Fail immediately | No |
| Database Connection | Retry with backoff | Yes |
| Service Error | Retry with backoff | Yes |
| Timeout | Fail and log | No |
| Resource Exhaustion | Retry after delay | Yes |

### Expected Outcome
- Functional Celery task for batch processing
- Progress tracking and reporting
- Proper tenant isolation
- Robust error handling and retry logic

### Verification Checklist
- [ ] `backend/apps/shipping/tasks/batch_waybill_task.py` created
- [ ] Task properly decorated with @shared_task
- [ ] Tenant context switching implemented
- [ ] Progress reporting functionality
- [ ] Integration with WaybillService
- [ ] Retry logic and error handling
- [ ] Task registration with Celery

---

## Task 71: Create Batch Progress

### Overview
Implement batch progress tracking system that provides real-time updates on waybill generation progress. This system enables frontend applications to display progress bars and status information during long-running batch operations.

### Dependencies
- Task 70: Create BatchWaybillJob
- Redis is configured for caching

### Instructions

1. **Create progress tracking module**
   - Create `progress.py` in `backend/apps/shipping/services/`
   - Define BatchProgressTracker class
   - Import Redis and Celery utilities

2. **Implement progress storage**
   - Use Redis for fast progress storage
   - Create progress key structure with tenant isolation
   - Set appropriate TTL for progress data

3. **Define progress data structure**
   - Include current progress percentage
   - Add current operation description
   - Store start time and estimated completion

4. **Create progress update methods**
   - Method to start progress tracking
   - Method to update progress with percentage
   - Method to mark completion or failure

5. **Implement progress retrieval**
   - Method to get current progress status
   - Include detailed progress information
   - Handle missing or expired progress data

6. **Integrate with BatchWaybillJob**
   - Update task to use progress tracker
   - Call progress updates during batch processing
   - Ensure proper cleanup on completion

7. **Add progress validation**
   - Validate progress percentage ranges (0-100)
   - Ensure progress only moves forward
   - Handle edge cases and invalid states

8. **Create frontend API endpoint**
   - API endpoint to retrieve progress status
   - Include security checks and tenant isolation
   - Return standardized progress format

### Progress Data Structure

| Field | Type | Description |
|-------|------|-------------|
| task_id | str | Celery task identifier |
| tenant_id | str | Current tenant context |
| current_progress | int | Percentage complete (0-100) |
| current_operation | str | Current operation description |
| start_time | datetime | Task start timestamp |
| estimated_completion | datetime | Estimated completion time |
| processed_count | int | Number of orders processed |
| total_count | int | Total orders in batch |
| errors | List[str] | Error messages if any |

### Redis Key Structure

```
Progress Key Format: "batch_progress:{tenant_id}:{task_id}"
Expiration: 3600 seconds (1 hour)
```

### Progress Update Flow

```
Batch Task Starts
    ↓
Initialize Progress (0%)
    ↓
┌─────────────────────────┐
│   For Each Order        │
│         ↓               │
│   Process Order         │
│         ↓               │
│   Calculate Progress    │
│         ↓               │
│   Update Redis          │
│         ↓               │
│   Update Celery State   │
└─────────────────────────┘
    ↓
Mark Completion (100%)
    ↓
Set Expiration Timer
```

### Progress Calculation

| Formula | Purpose | Example |
|---------|---------|---------|
| (processed / total) * 100 | Overall percentage | (25/100) * 100 = 25% |
| start_time + (elapsed / progress) * 100 | ETA calculation | Estimate completion time |

### API Response Format

```json
{
  "task_id": "abc123-def456",
  "status": "PROGRESS",
  "progress": 65,
  "current_operation": "Processing order #12345",
  "processed_count": 65,
  "total_count": 100,
  "start_time": "2026-01-31T10:00:00Z",
  "estimated_completion": "2026-01-31T10:15:00Z",
  "errors": []
}
```

### Expected Outcome
- Real-time progress tracking for batch operations
- Redis-based fast progress storage
- Integration with Celery task system
- Frontend API for progress retrieval

### Verification Checklist
- [ ] BatchProgressTracker class created
- [ ] Redis integration for progress storage
- [ ] Progress update methods implemented
- [ ] Integration with BatchWaybillJob
- [ ] Frontend API endpoint created
- [ ] Progress validation and error handling
- [ ] Proper cleanup and expiration

---

## Task 72: Create Batch Download

### Overview
Implement batch download functionality that packages multiple waybill PDFs into a ZIP file for convenient bulk download. This feature enables users to download all generated waybills from a batch operation in a single compressed file.

### Dependencies
- Task 70: Create BatchWaybillJob
- File storage system is configured

### Instructions

1. **Create batch download service**
   - Create `batch_download.py` in `services` directory
   - Define BatchDownloadService class
   - Import ZIP handling and file utilities

2. **Implement PDF collection method**
   - Method to gather all waybill PDFs from batch
   - Filter by tenant and batch job ID
   - Handle missing or corrupted PDF files

3. **Create ZIP file generation**
   - Use Python zipfile library for compression
   - Create organized directory structure within ZIP
   - Include meaningful filenames for each waybill

4. **Configure file naming convention**
   - ZIP filename: `waybills_batch_{job_id}_{date}.zip`
   - Individual PDFs: `waybill_{waybill_number}_{order_id}.pdf`
   - Include date and time in ISO format

5. **Implement temporary file management**
   - Create temporary ZIP files for processing
   - Clean up temporary files after download
   - Handle concurrent download requests

6. **Add download metadata**
   - Include batch summary text file in ZIP
   - List all included waybills with details
   - Add generation timestamp and user information

7. **Create download API endpoint**
   - Endpoint to request batch ZIP download
   - Stream large ZIP files for better performance
   - Include proper HTTP headers for download

8. **Implement access control**
   - Verify user has access to requested batch
   - Check tenant isolation for security
   - Log download activities for audit

### ZIP File Structure

```
waybills_batch_12345_2026-01-31.zip
├── batch_summary.txt
├── waybills/
│   ├── waybill_WB001_12345.pdf
│   ├── waybill_WB002_12346.pdf
│   └── waybill_WB003_12347.pdf
└── metadata/
    └── batch_info.json
```

### Batch Summary Content

| Information | Format | Example |
|-------------|--------|---------|
| Batch ID | Text | Batch Job ID: 12345 |
| Generation Date | ISO Date | Generated: 2026-01-31T14:30:00Z |
| Total Waybills | Number | Total Waybills: 25 |
| Successful | Number | Successful: 23 |
| Failed | Number | Failed: 2 |
| Total Size | MB/KB | Total Size: 2.5 MB |

### Download Service Methods

| Method | Purpose | Parameters |
|--------|---------|------------|
| create_batch_zip() | Generate ZIP file | batch_job_id, tenant_id |
| get_batch_files() | Collect PDF files | waybill_ids |
| generate_summary() | Create summary file | batch_results |
| stream_download() | Stream ZIP to client | zip_file_path |

### Performance Considerations

| Aspect | Implementation | Benefit |
|--------|----------------|---------|
| Streaming | Stream large files | Reduced memory usage |
| Compression | Standard ZIP compression | Smaller download size |
| Temporary Files | Auto-cleanup after download | Storage management |
| Concurrent Handling | File locking mechanisms | Prevent conflicts |

### Download API Endpoint

```
GET /api/shipping/waybills/batch/{job_id}/download
Headers:
  - Authorization: Bearer {token}
  - Accept: application/zip
Response:
  - Content-Type: application/zip
  - Content-Disposition: attachment; filename="waybills_batch_12345.zip"
  - Content-Length: {file_size}
```

### Expected Outcome
- Functional batch ZIP download system
- Organized ZIP file structure with metadata
- Streaming download for performance
- Proper access control and audit logging

### Verification Checklist
- [ ] BatchDownloadService class created
- [ ] ZIP file generation functionality
- [ ] PDF collection and organization
- [ ] Batch summary and metadata inclusion
- [ ] Download API endpoint implemented
- [ ] Streaming download capability
- [ ] Access control and security checks
- [ ] Temporary file cleanup

---

## Task 73: Create Print Queue

### Overview
Implement a print queue system for managing waybill printing operations. This system organizes waybills in a queue structure, tracks printing status, and enables ordered printing workflows for physical waybill labels.

### Dependencies
- Task 69: Create generate_batch
- Django models are set up

### Instructions

1. **Create print queue model**
   - Navigate to `backend/apps/shipping/models/`
   - Create `PrintQueueItem` model
   - Include fields for waybill, status, priority, timestamps

2. **Define queue status options**
   - PENDING: Waiting to be printed
   - PRINTING: Currently being printed
   - COMPLETED: Successfully printed
   - FAILED: Print job failed
   - CANCELLED: Manually cancelled

3. **Implement queue management service**
   - Create `PrintQueueService` in services directory
   - Methods for adding items to queue
   - Methods for updating queue status

4. **Create queue ordering logic**
   - Priority levels: URGENT, HIGH, NORMAL, LOW
   - FIFO ordering within same priority level
   - Timestamp-based sorting for fairness

5. **Add queue manipulation methods**
   - Method to add single waybill to queue
   - Method to add multiple waybills (bulk)
   - Method to remove items from queue

6. **Implement queue status tracking**
   - Track print attempts and retry counts
   - Store error messages for failed prints
   - Log print completion timestamps

7. **Create queue filtering and search**
   - Filter by status, priority, date range
   - Search by waybill number or order ID
   - Support for tenant-specific queues

8. **Add queue statistics**
   - Count items by status
   - Calculate average processing time
   - Track daily/weekly print volumes

### PrintQueueItem Model Fields

| Field | Type | Description |
|-------|------|-------------|
| id | AutoField | Primary key |
| tenant | ForeignKey | Tenant isolation |
| waybill | ForeignKey | Associated waybill |
| status | CharField | Current queue status |
| priority | CharField | Print priority level |
| created_at | DateTimeField | Queue entry timestamp |
| updated_at | DateTimeField | Last status change |
| print_attempts | IntegerField | Number of print attempts |
| error_message | TextField | Error details if failed |
| completed_at | DateTimeField | Print completion time |

### Priority Levels

| Priority | Value | Use Case |
|----------|-------|----------|
| URGENT | 1 | Same-day delivery orders |
| HIGH | 2 | Next-day delivery orders |
| NORMAL | 3 | Standard orders |
| LOW | 4 | Bulk or non-urgent orders |

### Queue Management Methods

| Method | Purpose | Parameters |
|--------|---------|------------|
| add_to_queue() | Add waybill to print queue | waybill_id, priority |
| bulk_add_to_queue() | Add multiple waybills | waybill_ids, priority |
| get_next_item() | Get next item to print | None |
| update_status() | Change item status | queue_id, new_status |
| retry_failed() | Retry failed print jobs | max_attempts |

### Queue Ordering Logic

```
Queue Retrieval Order:
1. Priority (URGENT → HIGH → NORMAL → LOW)
2. Within same priority: FIFO (created_at ASC)
3. Failed items: Retry after delay
4. Cancelled items: Excluded from queue
```

### Queue Service Architecture

```
PrintQueueService
├── add_to_queue(waybill, priority)
├── bulk_add(waybill_ids, priority)
├── get_next_item()
├── update_status(item_id, status)
├── get_queue_statistics()
└── cleanup_completed_items()
```

### Expected Outcome
- Functional print queue system with status tracking
- Priority-based ordering with FIFO within priorities
- Bulk queue operations support
- Comprehensive status and error tracking

### Verification Checklist
- [ ] PrintQueueItem model created
- [ ] Queue status choices defined
- [ ] PrintQueueService class implemented
- [ ] Priority-based ordering logic
- [ ] Bulk add functionality
- [ ] Status tracking and error handling
- [ ] Queue filtering and search methods
- [ ] Database migrations created

---

## Task 74: Create Print Order

### Overview
Implement print ordering and sequencing functionality that determines the optimal order for printing waybills based on various criteria such as delivery routes, urgency, and resource optimization for Sri Lankan logistics workflows.

### Dependencies
- Task 73: Create Print Queue

### Instructions

1. **Create print ordering service**
   - Create `PrintOrderService` in services directory
   - Define ordering algorithms and strategies
   - Import queue service and waybill models

2. **Implement route-based ordering**
   - Group waybills by delivery area/district
   - Order by postal codes for efficient route planning
   - Consider Sri Lankan geographic districts

3. **Add urgency-based sequencing**
   - Prioritize same-day and next-day deliveries
   - Consider COD (Cash on Delivery) orders
   - Factor in customer service levels

4. **Create courier-based grouping**
   - Group waybills by courier service
   - Optimize for courier pickup schedules
   - Handle courier-specific requirements

5. **Implement time-slot optimization**
   - Consider courier pickup time windows
   - Optimize for printer resource utilization
   - Handle peak and off-peak periods

6. **Add manual override capability**
   - Allow manual reordering by supervisors
   - Provide drag-and-drop interface support
   - Maintain audit trail for manual changes

7. **Create ordering algorithms**
   - Geographic clustering algorithm
   - Time-based priority algorithm
   - Resource optimization algorithm
   - Combined scoring algorithm

8. **Implement batch ordering**
   - Order entire print queue optimally
   - Handle large queue volumes efficiently
   - Provide ordering progress feedback

### Ordering Criteria

| Criterion | Weight | Sri Lankan Context |
|-----------|--------|-------------------|
| Delivery Urgency | 30% | Same-day, next-day priority |
| Geographic Route | 25% | District-based clustering |
| Courier Schedule | 20% | Pickup time windows |
| COD Priority | 15% | Cash collection efficiency |
| Customer Tier | 10% | VIP customer priority |

### Geographic Ordering (Sri Lanka)

| Region | Districts | Ordering Strategy |
|--------|-----------|-------------------|
| Western | Colombo, Gampaha, Kalutara | Urban density clustering |
| Central | Kandy, Matale, Nuwara Eliya | Mountain route optimization |
| Southern | Galle, Matara, Hambantota | Coastal route sequencing |
| Northern | Jaffna, Kilinochchi, Mannar | Remote area prioritization |
| Eastern | Batticaloa, Ampara, Trincomalee | Distance-based ordering |

### Ordering Algorithms

```
Geographic Clustering:
1. Group by district/postal code
2. Sort by delivery route efficiency
3. Consider traffic patterns

Priority Scoring:
1. Calculate urgency score (0-100)
2. Calculate route efficiency (0-100)
3. Calculate resource utilization (0-100)
4. Combine with weighted average

Time Window Optimization:
1. Identify courier pickup windows
2. Schedule printing before pickup
3. Buffer time for queue processing
```

### Service Methods

| Method | Purpose | Algorithm |
|--------|---------|-----------|
| order_by_route() | Geographic ordering | Clustering + TSP |
| order_by_priority() | Urgency ordering | Priority scoring |
| order_by_courier() | Courier grouping | Service grouping |
| optimal_order() | Combined ordering | Multi-criteria optimization |

### Manual Override Features

| Feature | Description | Access Level |
|---------|-------------|--------------|
| Priority Boost | Move item to top | Supervisor |
| Route Override | Change geographic order | Manager |
| Hold Item | Temporarily skip printing | Operator |
| Rush Order | Emergency prioritization | Manager |

### Ordering Result Structure

```json
{
  "total_items": 150,
  "ordering_strategy": "combined_optimal",
  "processing_time": 2.3,
  "ordered_items": [
    {
      "queue_id": 123,
      "waybill_number": "WB001",
      "priority_score": 95,
      "route_cluster": "colombo_central",
      "estimated_print_time": "14:30"
    }
  ],
  "statistics": {
    "route_clusters": 8,
    "urgent_items": 25,
    "cod_items": 67
  }
}
```

### Expected Outcome
- Intelligent print ordering system
- Geographic and priority-based optimization
- Sri Lankan logistics context integration
- Manual override capabilities

### Verification Checklist
- [ ] PrintOrderService class created
- [ ] Route-based ordering algorithm
- [ ] Priority and urgency scoring
- [ ] Courier schedule integration
- [ ] Manual override functionality
- [ ] Geographic clustering for Sri Lanka
- [ ] Combined optimization algorithm
- [ ] Audit trail for ordering changes

---

## Summary

This document established the core waybill service infrastructure and batch processing capabilities, including the WaybillService with single and batch generation methods, BatchWaybillJob for asynchronous processing, progress tracking, batch downloads, and print queue management with intelligent ordering for Sri Lankan logistics workflows.

### Completed Tasks
1. ✓ Created WaybillService as central service class
2. ✓ Implemented generate_single method for individual waybills
3. ✓ Created generate_batch method for multiple waybills
4. ✓ Implemented BatchWaybillJob as Celery task
5. ✓ Added batch progress tracking with Redis
6. ✓ Created batch download as ZIP files
7. ✓ Implemented print queue system with status tracking
8. ✓ Added print ordering with geographic and priority optimization

### Next Steps
Proceed to [02_Tasks-75-80_Archive-Reprint-Verify.md](02_Tasks-75-80_Archive-Reprint-Verify.md) to implement archive management with S3 storage, retention policies, cleanup tasks, reprint functionality, and comprehensive verification procedures.