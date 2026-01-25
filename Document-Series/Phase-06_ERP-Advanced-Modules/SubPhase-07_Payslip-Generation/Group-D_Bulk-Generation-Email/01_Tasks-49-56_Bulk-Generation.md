# Tasks 49-56: Bulk Generation with Celery and Batch Tracking

> **Phase:** 06 - ERP Advanced Modules  
> **SubPhase:** 07 - Payslip Generation  
> **Group:** D - Bulk Generation & Email  
> **Document:** 01 of 02  
> **Tasks Covered:** 49, 50, 51, 52, 53, 54, 55, 56

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **→ Next Document:** [02_Tasks-57-64_Email-Distribution.md](02_Tasks-57-64_Email-Distribution.md)

---

## Document Overview

This document covers the bulk payslip generation infrastructure, including Celery task implementation for asynchronous batch processing, Redis-based progress tracking, comprehensive error handling, and the PayslipBatch model for tracking generation operations. These elements enable efficient generation of payslips for entire payroll periods with real-time progress monitoring and robust failure recovery.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 49 | Create Bulk Generation Celery Task | High | 35 min |
| 50 | Add Period-Based Generation | Medium | 25 min |
| 51 | Add Generation Progress Tracking | Medium | 25 min |
| 52 | Add Generation Error Handling | Medium | 20 min |
| 53 | Create PayslipBatch Model | Medium | 25 min |
| 54 | Add Batch Status Fields | Low | 15 min |
| 55 | Add Batch Timing Fields | Low | 15 min |
| 56 | Run Batch Migrations | Low | 15 min |

---

## Task 49: Create Bulk Generation Celery Task

### Overview
Create a Celery task that handles bulk payslip generation for entire payroll periods. This task executes asynchronously in the background, processing multiple payslips in sequence while tracking progress and handling individual failures without stopping the overall batch operation.

### Dependencies
- Celery infrastructure configured in project
- PayslipGenerator service from Group C
- PayrollPeriod and EmployeePayroll models
- Payslip model from Group A

### Celery Task Concepts

**Task Decorator and Binding**
Celery tasks are decorated with `@shared_task` to make them available across the Django project. The `bind=True` parameter provides access to the task instance itself through the `self` parameter, enabling task-level metadata like task ID, retry behavior, and state updates.

**Task State Management**
Celery tasks can report their state during execution using `self.update_state()`. This allows external processes to monitor task progress by querying the task's current state and metadata. States include PENDING, STARTED, SUCCESS, FAILURE, and custom states for domain-specific progress tracking.

**Background Execution Model**
When a Celery task is triggered with `.delay()` or `.apply_async()`, it returns immediately with an AsyncResult object containing the task ID. The actual execution happens in a separate worker process, allowing the web request to complete quickly while intensive work proceeds in the background.

### Instructions

1. **Create tasks module**
   - Navigate to `apps/payslip/` directory
   - Create `tasks.py` file for Celery tasks
   - Import necessary dependencies

2. **Import Celery decorators**
   - Import `shared_task` from `celery`
   - Import task utilities and exceptions
   - Import time and logging modules

3. **Import payslip components**
   - Import PayslipGenerator service
   - Import Payslip, PayrollPeriod models
   - Import EmployeePayroll from payroll app
   - Import Client model for tenant context

4. **Define task signature**
   - Create function named `generate_payslips_bulk`
   - Accept `self` parameter (from bind=True)
   - Accept `tenant_id` to set tenant context
   - Accept `period_id` to identify payroll period
   - Accept `batch_id` for tracking record
   - Accept `initiated_by_id` for audit trail

5. **Set tenant context**
   - Retrieve Client instance using tenant_id
   - Set connection schema to tenant schema
   - This ensures all database queries target correct tenant
   - Wrap entire task logic in tenant context

6. **Retrieve payroll period**
   - Query PayrollPeriod by period_id
   - Verify period exists and is finalized
   - Raise exception if period not ready for payslip generation
   - Log period information for tracking

7. **Retrieve employee payroll records**
   - Query all EmployeePayroll for this period
   - Filter to only active, non-void records
   - Order by employee code for consistent processing
   - Count total records for progress tracking

8. **Initialize processing counters**
   - Set processed_count to zero
   - Set success_count to zero
   - Set failed_count to zero
   - Create error_log list for failure details

9. **Iterate through employees**
   - Loop through each EmployeePayroll record
   - Process one employee at a time sequentially
   - Maintain order for predictable progress reporting
   - Continue processing even if individual failures occur

10. **Generate individual payslip**
    - Call PayslipGenerator service for employee
    - Pass employee_payroll and period information
    - Service creates/updates Payslip record
    - Service generates and saves PDF
    - Captures any exceptions during generation

11. **Update progress counters**
    - Increment processed_count after each attempt
    - Increment success_count on successful generation
    - Increment failed_count on exception
    - Record error details in error_log

12. **Report progress updates**
    - Calculate percentage complete
    - Call update_state() with custom state
    - Include processed, total, success, failed counts
    - Include current employee being processed
    - Allows real-time progress monitoring

13. **Handle completion**
    - Return summary dictionary with final counts
    - Include success_count, failed_count, total_count
    - Include error_log with failure details
    - Celery automatically sets task state to SUCCESS

### Asynchronous Processing Benefits

| Benefit | Description |
|---------|-------------|
| **Non-Blocking UI** | Web requests return immediately, users don't wait |
| **Scalable Processing** | Multiple workers handle concurrent batches |
| **Progress Monitoring** | Real-time updates via task state queries |
| **Fault Isolation** | Worker failures don't crash web application |
| **Resource Optimization** | CPU-intensive work doesn't block request handling |

### Task Execution Flow

**Phase 1: Task Initialization**
The task begins by setting the tenant context, ensuring all database operations target the correct tenant schema. It retrieves the payroll period record and validates it's in a finalized state suitable for payslip generation. The task then queries all employee payroll records for the period and initializes counters.

**Phase 2: Sequential Processing**
The task processes each employee sequentially, calling the PayslipGenerator service to create and store the payslip PDF. Each generation attempt is wrapped in exception handling to capture failures without stopping the batch. After each employee, counters are updated and progress is reported.

**Phase 3: Completion and Reporting**
Once all employees are processed, the task returns a summary dictionary containing success/failure counts and detailed error information. This return value is stored by Celery and can be retrieved by the calling code for batch finalization.

### Progress State Structure

| Field | Type | Purpose |
|-------|------|---------|
| `state` | String | Custom state name (e.g., "PROCESSING") |
| `current` | Integer | Number processed so far |
| `total` | Integer | Total records to process |
| `success` | Integer | Successfully generated count |
| `failed` | Integer | Failed generation count |
| `employee_code` | String | Current employee being processed |
| `percentage` | Float | Completion percentage |

### Error Handling Strategy

**Continue-on-Error Approach**
The task uses a try-except pattern around individual payslip generation. If one employee's payslip fails to generate, the exception is caught, logged to the error_log, and the failed_count is incremented. The loop continues to the next employee rather than aborting the entire batch.

**Error Information Capture**
For each failure, the task records the employee identifier, the exception message, and a timestamp. This detailed error log is included in the task result, enabling administrators to diagnose and fix specific issues without losing track of which employees succeeded.

**Task State on Partial Failure**
Even if some payslips fail, the task completes successfully from Celery's perspective if it finishes processing all employees. The calling code checks the success vs. failed counts to determine if manual intervention is needed. A task only enters FAILURE state if unhandled exceptions occur at the batch level.

### Expected Outcome
- Celery task accepts batch generation parameters
- Task processes all employees in payroll period
- Individual failures don't stop batch processing
- Progress updates available during execution
- Task returns comprehensive summary on completion

### Verification Checklist
- [ ] `apps/payslip/tasks.py` file created
- [ ] `generate_payslips_bulk` task defined
- [ ] Task decorated with `@shared_task(bind=True)`
- [ ] Tenant context set using tenant_id
- [ ] PayrollPeriod retrieved and validated
- [ ] All EmployeePayroll records queried
- [ ] Sequential processing loop implemented
- [ ] PayslipGenerator service called per employee
- [ ] Exception handling for individual failures
- [ ] Progress updates with update_state()
- [ ] Final summary dictionary returned

---

## Task 50: Add Period-Based Generation

### Overview
Implement a high-level function that initiates bulk payslip generation for an entire payroll period. This function validates the period is ready for processing, creates a tracking batch record, and dispatches the Celery task asynchronously, returning the batch ID for progress monitoring.

### Dependencies
- Task 49: Bulk Generation Celery Task
- Task 53: PayslipBatch Model (implemented in parallel)
- PayrollPeriod model with finalized status
- User authentication context

### Instructions

1. **Create services module**
   - Navigate to `apps/payslip/` directory
   - Create `services/` subdirectory if not exists
   - Create `services/__init__.py` for package
   - Create `services/batch_generator.py`

2. **Import dependencies**
   - Import PayrollPeriod and EmployeePayroll models
   - Import PayslipBatch model from models
   - Import generate_payslips_bulk from tasks
   - Import tenant and user utilities

3. **Define service class**
   - Create `PayslipBatchGenerator` class
   - Initialize with tenant and user context
   - Store these for audit trail and schema routing
   - Provide clean interface for batch operations

4. **Implement generate_for_period method**
   - Accept payroll_period_id as parameter
   - Return PayslipBatch instance
   - Method orchestrates validation, creation, and dispatch
   - Primary entry point for bulk generation

5. **Validate payroll period**
   - Query PayrollPeriod by ID
   - Check period exists in current tenant
   - Verify status is FINALIZED
   - Raise validation error if not ready
   - Only finalized periods can generate payslips

6. **Check existing batches**
   - Query PayslipBatch for this period
   - Check for PROCESSING or PENDING batches
   - Prevent duplicate concurrent generation
   - Raise error if batch already in progress
   - Ensures single active batch per period

7. **Count employees to process**
   - Query EmployeePayroll for this period
   - Filter to active, non-void records
   - Count total records
   - Validate at least one employee exists
   - Total count stored in batch record

8. **Create PayslipBatch record**
   - Instantiate PayslipBatch model
   - Set tenant to current tenant
   - Set payroll_period to period instance
   - Set batch_type to GENERATION
   - Set status to PENDING
   - Set total_count from employee count
   - Set initiated_by to current user
   - Save record to database

9. **Dispatch Celery task**
   - Call generate_payslips_bulk.delay()
   - Pass tenant_id for schema routing
   - Pass period_id for data lookup
   - Pass batch_id for tracking updates
   - Pass initiated_by_id for audit
   - Receive AsyncResult with task_id

10. **Store task ID in batch**
    - Update batch record with celery_task_id
    - Store AsyncResult.id in task_id field
    - Enables task status queries later
    - Save batch record again

11. **Return batch instance**
    - Return the PayslipBatch object
    - Caller can access batch.id for tracking
    - Caller can poll batch status
    - Batch record is authoritative source for progress

### Period-Based Generation Concepts

**Finalization Requirement**
Payroll periods must be finalized before payslip generation. Finalization indicates all calculations are complete, all approvals obtained, and the data is locked. Attempting to generate payslips from a draft period would produce incorrect or incomplete documents.

**Single-Batch-Per-Period Enforcement**
The service prevents multiple concurrent generation batches for the same period. This avoids duplicate payslip records, conflicting file writes, and confusing progress reporting. Users must wait for current batch to complete before retrying.

**Asynchronous Dispatch Pattern**
The service creates the batch record first, then dispatches the task. This ordering ensures the task can immediately find and update the batch record when it starts execution. The service returns quickly while heavy processing occurs in the background.

### Service Layer Responsibilities

| Responsibility | Rationale |
|----------------|-----------|
| **Validation** | Ensures business rules before costly processing |
| **Idempotency Checks** | Prevents duplicate operations |
| **Record Creation** | Establishes tracking infrastructure |
| **Task Dispatch** | Delegates to background worker layer |
| **Return Tracking Handle** | Enables caller to monitor progress |

### Batch Record Initialization

**Essential Fields Set at Creation**
The batch record is created with initial values that reflect the operation about to begin. The tenant and period are set for query filtering. The batch_type distinguishes generation from email batches. The status starts as PENDING until the task begins processing. The total_count provides the denominator for progress percentages.

**Task ID Association**
After task dispatch, the Celery task ID is stored in the batch record. This bidirectional linking allows the batch record to query task state, and the task to query and update the batch record. The task ID is essential for monitoring and cancellation operations.

### Expected Outcome
- Service class provides clean API for bulk generation
- Period validation ensures data integrity
- Duplicate batch prevention implemented
- Batch record created with initial state
- Celery task dispatched asynchronously
- Batch ID returned for tracking

### Verification Checklist
- [ ] `apps/payslip/services/batch_generator.py` created
- [ ] `PayslipBatchGenerator` class defined
- [ ] `generate_for_period` method implemented
- [ ] PayrollPeriod validation logic added
- [ ] Existing batch check implemented
- [ ] Employee count query added
- [ ] PayslipBatch record creation logic added
- [ ] Celery task dispatch with delay() added
- [ ] Task ID stored in batch record
- [ ] Batch instance returned to caller

---

## Task 51: Add Generation Progress Tracking

### Overview
Implement Redis-based progress tracking for bulk payslip generation, enabling real-time monitoring of batch progress without repeatedly querying the database. This system uses Redis for fast, low-latency progress updates that can be polled by frontend clients.

### Dependencies
- Task 49: Bulk Generation Celery Task
- Redis server configured and running
- Django Redis client configured
- PayslipBatch model

### Redis Progress Tracking Concepts

**Why Redis for Progress Tracking**
Redis is an in-memory data store that provides microsecond-level read and write latency. For progress tracking that may be polled every second by multiple clients, Redis prevents database query overload and provides instant updates. Redis keys automatically expire, preventing stale data accumulation.

**Key-Value Structure for Progress**
Progress data is stored in Redis using a predictable key pattern and JSON-encoded values. The key incorporates the batch ID, making it unique per operation. The value contains current counts, percentages, and metadata. This structure enables atomic updates and straightforward polling.

**TTL and Automatic Cleanup**
Redis keys are set with a Time-To-Live (TTL) that causes automatic deletion after a specified duration. For batch progress tracking, a TTL of 24-48 hours is typical. This ensures abandoned or completed batches don't accumulate forever without manual cleanup.

### Instructions

1. **Import Redis client**
   - In `tasks.py`, import Django's Redis cache
   - Import JSON for serialization
   - Import datetime for timestamps
   - Cache instance provides Redis operations

2. **Define progress key function**
   - Create helper function `get_progress_key(batch_id)`
   - Return formatted string: `payslip_batch:{batch_id}:progress`
   - Consistent key pattern enables easy lookup
   - Namespace prevents collision with other Redis keys

3. **Create progress update function**
   - Define `update_batch_progress()` helper
   - Accept batch_id, total, processed, success, failed
   - Accept optional current_employee parameter
   - Accept optional stage parameter (e.g., "generating", "finalizing")

4. **Calculate progress percentage**
   - Compute percentage as (processed / total) * 100
   - Round to two decimal places for readability
   - Handle division by zero if total is zero
   - Percentage enables progress bars in UI

5. **Build progress data dictionary**
   - Create dictionary with all progress fields
   - Include total, processed, success, failed counts
   - Include percentage calculation
   - Include current_employee if provided
   - Include stage if provided
   - Add timestamp for freshness tracking

6. **Serialize to JSON**
   - Convert dictionary to JSON string
   - JSON allows complex nested data structures
   - Enables direct parsing in JavaScript clients
   - Use compact encoding to minimize memory

7. **Set Redis key with TTL**
   - Use cache.set() with progress key
   - Store JSON string as value
   - Set TTL to 86400 seconds (24 hours)
   - TTL ensures automatic cleanup after completion

8. **Integrate into Celery task**
   - Call update_batch_progress() at task start
   - Call after each employee processed
   - Pass current counts from task variables
   - Include current employee code for detailed tracking

9. **Update at key milestones**
   - Call with stage="initializing" at task start
   - Call with stage="processing" during loop
   - Call with stage="finalizing" at task end
   - Stage information improves user experience

10. **Create progress retrieval function**
    - Define `get_batch_progress(batch_id)` helper
    - Retrieve value from Redis using progress key
    - Deserialize JSON to dictionary
    - Return None if key doesn't exist (not started or expired)

11. **Handle missing progress gracefully**
    - If Redis key missing, check batch record in database
    - If batch completed, return final counts from database
    - If batch pending, return initialized progress (0/total)
    - Fallback ensures progress always available

### Progress Data Structure

| Field | Type | Description |
|-------|------|-------------|
| `total` | Integer | Total employees to process |
| `processed` | Integer | Employees processed so far |
| `success` | Integer | Successfully generated payslips |
| `failed` | Integer | Failed generation attempts |
| `percentage` | Float | Completion percentage (0-100) |
| `current_employee` | String | Employee code currently processing |
| `stage` | String | Current operation stage |
| `timestamp` | ISO String | Last update time |

### Redis Key Patterns

**Progress Key Format**
```
payslip_batch:{batch_id}:progress
```

**Example Keys**
```
payslip_batch:42:progress
payslip_batch:157:progress
payslip_batch:3891:progress
```

**TTL Configuration**
Keys expire after 24 hours (86400 seconds), balancing availability for monitoring with resource conservation. For long-running batches, the TTL can be extended during task execution.

### Polling Strategy

**Frontend Polling Pattern**
Frontend clients poll the progress endpoint every 1-2 seconds while a batch is active. Each poll retrieves the progress from Redis and updates the UI. Polling stops when percentage reaches 100 or batch status shows completion.

**Load Considerations**
Redis can handle thousands of reads per second, making frequent polling feasible. Database polling would create excessive load and slower response times. Redis enables responsive progress tracking without infrastructure strain.

### Progress Update Frequency

**Update Timing in Task**
Progress updates occur after each employee is processed. For a batch of 100 employees, this means 100 Redis writes. Given Redis write speeds (microseconds), this overhead is negligible compared to PDF generation time (hundreds of milliseconds per payslip).

**Throttling Considerations**
For extremely large batches (thousands of employees), consider updating every N employees or every N seconds rather than every single employee. This reduces Redis write operations while maintaining sufficient granularity for user feedback.

### Expected Outcome
- Redis keys created for batch progress
- Progress updated throughout task execution
- Real-time progress available via Redis queries
- Automatic cleanup with TTL
- Graceful fallback to database if Redis unavailable

### Verification Checklist
- [ ] Redis cache imported in tasks module
- [ ] `get_progress_key()` helper defined
- [ ] `update_batch_progress()` function created
- [ ] Progress dictionary structure defined
- [ ] JSON serialization implemented
- [ ] Redis set operation with TTL added
- [ ] Progress updates integrated in Celery task
- [ ] Stage indicators added for milestones
- [ ] `get_batch_progress()` retrieval function created
- [ ] Fallback to database for missing keys

---

## Task 52: Add Generation Error Handling

### Overview
Implement comprehensive error handling for the bulk generation process, including individual payslip generation failures, task-level exceptions, retry logic, and detailed error logging. This ensures robust batch processing that recovers from transient failures and provides diagnostic information for permanent errors.

### Dependencies
- Task 49: Bulk Generation Celery Task
- Task 51: Generation Progress Tracking
- Task 53: PayslipBatch Model

### Error Handling Concepts

**Partial Failure Tolerance**
In bulk operations, individual item failures should not abort the entire batch. The system distinguishes between item-level errors (one payslip fails) and batch-level errors (entire task crashes). Item-level errors are logged and counted, but processing continues. Batch-level errors cause task failure and potential retry.

**Error Classification**
Errors are categorized by type and severity. Validation errors (missing data) are permanent and should not be retried. Network errors (file storage timeout) are transient and may succeed on retry. Critical errors (database connection lost) should fail the task immediately for operator attention.

**Retry Strategies**
Celery supports automatic task retries with exponential backoff. For payslip generation, network and storage errors warrant retry, but data validation errors do not. The retry configuration balances quick recovery with avoiding infinite retry loops.

### Instructions

1. **Configure task retry behavior**
   - Add `autoretry_for` parameter to task decorator
   - Include common transient exception types
   - Examples: connection errors, timeout errors, storage errors
   - Excludes validation and data errors (permanent failures)

2. **Set retry parameters**
   - Set `retry_kwargs` with `max_retries` (e.g., 3)
   - Set exponential backoff (default_retry_delay)
   - First retry after 60 seconds, then 120, then 240
   - Prevents immediate retry of likely-persistent issues

3. **Wrap task body in try-except**
   - Entire task logic wrapped in broad exception handler
   - Catches unexpected errors at batch level
   - Distinguishes from expected item-level exceptions
   - Logs critical errors before re-raising

4. **Handle individual generation errors**
   - Wrap PayslipGenerator call in try-except
   - Catch specific exceptions (template errors, storage errors)
   - Log error with employee context
   - Increment failed_count
   - Continue to next employee

5. **Build error log structure**
   - Create list of error dictionaries
   - Each error includes employee_id or employee_code
   - Include error message and exception type
   - Include timestamp of failure
   - Include stack trace for debugging (optional, in development)

6. **Store errors in batch record**
   - Update PayslipBatch.error_log field
   - Field is JSONField storing error list
   - Enables querying and displaying specific failures
   - Updated at task completion

7. **Handle task-level exceptions**
   - Catch exceptions after employee loop
   - Log to application logger with ERROR level
   - Update batch status to FAILED
   - Update batch error_log with task-level error
   - Re-raise exception to trigger Celery retry

8. **Implement graceful degradation**
   - If Redis unavailable, log warning but continue task
   - Progress tracking becomes unavailable but generation continues
   - Ensures batch completes even if monitoring fails
   - Core functionality prioritized over convenience features

9. **Add timeout protection**
   - Set task time_limit parameter (e.g., 3600 seconds)
   - Prevents runaway tasks consuming resources
   - If limit exceeded, task terminated and marked FAILURE
   - Time limit based on expected batch size and duration

10. **Log detailed context on failure**
    - Include tenant_id, period_id, batch_id in logs
    - Include counts processed before failure
    - Include current employee if known
    - Enables quick diagnosis from logs

11. **Update batch status on exception**
    - In except block, update PayslipBatch status to FAILED
    - Set completed_at timestamp even on failure
    - Store exception message in error_log
    - Ensures batch record reflects failure state

12. **Implement idempotency for retries**
    - Check if payslip already exists before generating
    - Skip or update existing payslips
    - Prevents duplicate PDF generation on retry
    - Ensures retried tasks don't create duplicate records

### Error Classification Matrix

| Error Type | Category | Retry? | Action |
|------------|----------|--------|--------|
| Missing employee data | Validation | No | Log and skip |
| Invalid template syntax | Configuration | No | Fail batch |
| File storage timeout | Transient | Yes | Retry task |
| Database connection lost | Transient | Yes | Retry task |
| Insufficient storage space | Resource | No | Fail batch |
| PDF rendering error | Validation | No | Log and skip |

### Error Log JSON Structure

**Individual Item Errors**
```json
{
  "errors": [
    {
      "employee_id": 245,
      "employee_code": "EMP-0245",
      "error_type": "FileStorageError",
      "message": "S3 upload timeout after 30 seconds",
      "timestamp": "2026-01-24T10:15:32Z"
    },
    {
      "employee_id": 312,
      "employee_code": "EMP-0312",
      "error_type": "TemplateError",
      "message": "Missing variable: department_name",
      "timestamp": "2026-01-24T10:17:45Z"
    }
  ]
}
```

**Task-Level Error**
```json
{
  "batch_error": {
    "error_type": "DatabaseError",
    "message": "Connection to database lost",
    "processed_before_failure": 47,
    "total": 150,
    "timestamp": "2026-01-24T10:20:15Z"
  }
}
```

### Retry Behavior

**Exponential Backoff Pattern**
First retry occurs after 60 seconds, second after 120 seconds, third after 240 seconds. This pattern allows transient issues (temporary network problems, brief storage outages) to resolve before the next attempt. The increasing delay prevents overwhelming a struggling service with repeated requests.

**Max Retries Limit**
After three retries, the task is marked as permanently failed. This prevents infinite retry loops for errors that will never resolve (misconfiguration, insufficient permissions). Administrators receive notification of permanent failures for manual intervention.

**Retry Context Preservation**
When a task retries, the same parameters (tenant_id, period_id, batch_id) are passed to the new attempt. The batch record persists, so the retry can check which employees were already processed successfully and skip them, avoiding duplicate work.

### Logging Strategy

**Structured Logging Fields**
All log messages include structured fields for filtering and analysis. Fields include tenant identifier, batch identifier, task ID, and employee identifier. This enables quick location of relevant logs when investigating failures.

**Log Levels by Severity**
- DEBUG: Progress milestones, normal operation steps
- INFO: Batch started, batch completed, employee processed
- WARNING: Individual payslip failed, Redis unavailable, minor issues
- ERROR: Task-level exception, batch failed, requires attention

### Expected Outcome
- Individual payslip failures don't stop batch
- Detailed error information logged and stored
- Transient errors trigger task retry
- Batch record reflects failure state
- Administrators have diagnostic information

### Verification Checklist
- [ ] Task decorator includes retry configuration
- [ ] `autoretry_for` parameter with exception types
- [ ] `max_retries` and backoff configured
- [ ] Try-except around entire task body
- [ ] Try-except around individual generation
- [ ] Error log structure defined
- [ ] Error details captured with context
- [ ] Batch status updated to FAILED on exception
- [ ] Error log stored in batch record
- [ ] Idempotency checks for retries implemented
- [ ] Time limit set to prevent runaway tasks

---

## Task 53: Create PayslipBatch Model

### Overview
Create the PayslipBatch model to track and manage bulk payslip generation operations. This model serves as the authoritative record for batch operations, storing metadata, progress counts, status, and error information. It enables monitoring, auditing, and historical analysis of payslip generation activities.

### Dependencies
- Tenant model (Client) for multi-tenancy
- PayrollPeriod model for period association
- User model for audit trail
- Base models and mixins from core infrastructure

### Instructions

1. **Create model file**
   - Navigate to `apps/payslip/models/` directory
   - Create `payslip_batch.py` file
   - File will contain PayslipBatch model definition
   - Import necessary Django model components

2. **Import dependencies**
   - Import Django model fields and base Model class
   - Import Client model from tenant app
   - Import User model from authentication
   - Import PayrollPeriod from payroll app
   - Import timezone utilities for datetime handling

3. **Import base mixins**
   - Import TimestampMixin for created/updated fields
   - Import TenantMixin if available for tenant field
   - Import SoftDeleteMixin if soft deletes needed
   - Mixins provide consistent field patterns

4. **Define batch type choices**
   - Create BATCH_TYPE_CHOICES constant
   - Include GENERATION choice ('generation', 'Payslip Generation')
   - Include EMAIL choice ('email', 'Email Distribution')
   - Enum pattern ensures valid type values
   - Enables filtering and reporting by type

5. **Define batch status choices**
   - Create BATCH_STATUS_CHOICES constant
   - Include PENDING ('pending', 'Pending')
   - Include PROCESSING ('processing', 'Processing')
   - Include COMPLETED ('completed', 'Completed')
   - Include FAILED ('failed', 'Failed')
   - Include CANCELLED ('cancelled', 'Cancelled') for user cancellation

6. **Define model class**
   - Create PayslipBatch class inheriting from Model
   - Apply mixins if using (TimestampMixin, etc.)
   - Define in apps/payslip/models/payslip_batch.py
   - Class represents single batch operation

7. **Add tenant relationship**
   - ForeignKey to Client model
   - on_delete=CASCADE (delete batches with tenant)
   - related_name='payslip_batches'
   - Enables tenant filtering and multi-tenancy support

8. **Add payroll period relationship**
   - ForeignKey to PayrollPeriod model
   - on_delete=CASCADE (delete batches with period)
   - related_name='payslip_batches'
   - Links batch to specific payroll period
   - Enables period-based batch queries

9. **Add batch type field**
   - CharField with max_length=20
   - choices=BATCH_TYPE_CHOICES
   - default=BATCH_TYPE_GENERATION
   - Distinguishes generation from email batches

10. **Add status field**
    - CharField with max_length=20
    - choices=BATCH_STATUS_CHOICES
    - default=BATCH_STATUS_PENDING
    - Tracks current state of batch operation
    - Indexed for status-based queries

11. **Add celery_task_id field**
    - CharField with max_length=255
    - null=True, blank=True
    - Stores Celery AsyncResult task ID
    - Enables task status queries
    - Links batch to background task

12. **Add initiated_by field**
    - ForeignKey to User model
    - on_delete=SET_NULL (preserve batch if user deleted)
    - null=True (system-initiated batches possible)
    - related_name='initiated_payslip_batches'
    - Audit trail for who started batch

13. **Add error_log field**
    - JSONField with default=dict
    - Stores list of error dictionaries
    - Each error includes employee, message, timestamp
    - Enables detailed failure analysis
    - Default empty dict prevents null checks

14. **Add model metadata**
    - Set Meta class with verbose names
    - Set default ordering by created_at descending
    - Add indexes on tenant, period, status
    - Add unique_together constraint if needed

15. **Implement __str__ method**
    - Return meaningful string representation
    - Include batch type, period, and status
    - Example: "Generation Batch for Jan 2026 - Completed"
    - Improves admin interface readability

16. **Add property methods**
    - Add `is_complete` property returning boolean
    - True if status is COMPLETED or FAILED
    - Add `is_active` property for PENDING or PROCESSING
    - Simplifies status checks in code

17. **Update models __init__.py**
    - Import PayslipBatch in `models/__init__.py`
    - Add to `__all__` list for clean imports
    - Makes model available via `from payslip.models import PayslipBatch`

### Model Field Summary

| Field | Type | Purpose |
|-------|------|---------|
| `tenant` | ForeignKey(Client) | Multi-tenancy association |
| `payroll_period` | ForeignKey(PayrollPeriod) | Period being processed |
| `batch_type` | CharField(choices) | Generation vs Email |
| `status` | CharField(choices) | Current operation state |
| `celery_task_id` | CharField | Background task identifier |
| `initiated_by` | ForeignKey(User) | User who started batch |
| `error_log` | JSONField | Detailed error information |

### Batch Type Patterns

**GENERATION Batches**
Generation batches are created when initiating payslip PDF creation for a payroll period. They track the progress of the PayslipGenerator service across all employees. The batch records how many payslips were created successfully and which failed.

**EMAIL Batches**
Email batches are created when distributing generated payslips via email to employees. They track email sending progress, delivery status, and failures. Email batches reference an already-completed generation batch to ensure payslips exist before emailing.

### Status Lifecycle

**PENDING → PROCESSING**
When batch record is created, status is PENDING. When the Celery task starts execution and updates progress for the first time, status changes to PROCESSING. This indicates active work.

**PROCESSING → COMPLETED**
When the task finishes processing all employees successfully (even if some individual payslips failed), status changes to COMPLETED. The success/failed counts indicate how many of the total actually succeeded.

**PROCESSING → FAILED**
If a task-level exception occurs (database connection lost, storage system down), status changes to FAILED. This indicates the batch could not complete processing due to a critical error. Manual intervention or retry needed.

**User-Initiated CANCELLED**
If an administrator cancels a batch mid-processing, status changes to CANCELLED. The task is terminated and partial results may exist. Cancelled batches can be restarted.

### Database Indexing

**Index on Tenant and Period**
Most queries for batches filter by tenant (for multi-tenancy) and payroll_period (to find batches for a specific period). A composite index on (tenant, payroll_period) optimizes these common queries.

**Index on Status**
Dashboard queries often filter by status to show active batches (PENDING, PROCESSING) or recently completed batches. An index on status enables efficient status-based filtering.

### Expected Outcome
- PayslipBatch model defined with all core fields
- Batch types and statuses enumerated
- Relationships to tenant, period, user established
- Error logging infrastructure in place
- Model ready for migration creation

### Verification Checklist
- [ ] `apps/payslip/models/payslip_batch.py` created
- [ ] PayslipBatch class defined
- [ ] BATCH_TYPE_CHOICES constant defined
- [ ] BATCH_STATUS_CHOICES constant defined
- [ ] tenant ForeignKey added
- [ ] payroll_period ForeignKey added
- [ ] batch_type CharField added
- [ ] status CharField added
- [ ] celery_task_id CharField added
- [ ] initiated_by ForeignKey added
- [ ] error_log JSONField added
- [ ] Meta class with ordering and indexes
- [ ] `__str__` method implemented
- [ ] Property methods for status checks added
- [ ] Model imported in `models/__init__.py`

---

## Task 54: Add Batch Status Fields

### Overview
Add count and tracking fields to the PayslipBatch model to store progress metrics and operational statistics. These fields enable real-time status reporting, progress calculation, and historical analysis without querying related records.

### Dependencies
- Task 53: PayslipBatch Model

### Instructions

1. **Add total_count field**
   - PositiveIntegerField type
   - default=0 for safety
   - Stores total number of items in batch
   - Set when batch is created based on employee count
   - Denominator for percentage calculations

2. **Add processed_count field**
   - PositiveIntegerField type
   - default=0 initial value
   - Incremented as each item is processed
   - Used to calculate progress percentage
   - Updated frequently during task execution

3. **Add success_count field**
   - PositiveIntegerField type
   - default=0 initial value
   - Incremented when item processed successfully
   - Measures actual successful completions
   - Enables success rate calculation

4. **Add failed_count field**
   - PositiveIntegerField type
   - default=0 initial value
   - Incremented when item processing fails
   - Measures error rate
   - Enables failure analysis

5. **Add validation constraint**
   - Ensure processed = success + failed mathematically
   - Can add database check constraint
   - Or validate in model clean() method
   - Ensures data integrity

6. **Update task to set total_count**
   - When creating batch, set total_count from query
   - Query count of employees in period
   - Store in batch.total_count
   - Save batch record

7. **Update task to increment counters**
   - After each successful generation, increment success_count
   - After each failed generation, increment failed_count
   - Increment processed_count in both cases
   - Use atomic database updates for concurrency safety

8. **Add progress calculation property**
   - Add `progress_percentage` property to model
   - Calculate (processed_count / total_count) * 100
   - Handle division by zero case
   - Return float rounded to 2 decimal places

9. **Add success rate property**
   - Add `success_rate` property to model
   - Calculate (success_count / processed_count) * 100
   - Handle zero processed case
   - Return float rounded to 2 decimal places
   - Useful for quality metrics

10. **Update admin display**
    - Add count fields to admin list_display
    - Show total, success, failed visually
    - Use color coding for success rate (green high, red low)
    - Enables quick status overview in admin

### Status Field Patterns

**Counter Initialization**
All count fields start at zero when the batch record is created. The total_count is immediately set based on the query of employees to process. As the task progresses, processed_count, success_count, and failed_count increment.

**Atomic Updates**
To prevent race conditions if multiple processes access the batch (unlikely but possible), use Django's F() expressions for increments. This ensures the increment operation is atomic at the database level, preventing lost updates.

**Final State Consistency**
When the batch completes, processed_count should equal total_count, and processed_count should equal success_count + failed_count. Validate this consistency when marking batch as COMPLETED.

### Count Fields Matrix

| Field | Updated When | Purpose |
|-------|--------------|---------|
| `total_count` | Batch creation | Total items to process |
| `processed_count` | After each item | Items attempted so far |
| `success_count` | After success | Successfully completed items |
| `failed_count` | After failure | Failed items |

### Property Methods

**progress_percentage Property**
Returns the completion percentage as a float between 0 and 100. Frontend progress bars bind to this value. Formula: (processed_count / total_count) * 100. If total_count is zero, returns 0 to avoid division error.

**success_rate Property**
Returns the success rate of processed items as a percentage. Formula: (success_count / processed_count) * 100. If processed_count is zero, returns 0. If processed_count equals total_count and success_rate is 100%, the batch is fully successful.

### Dashboard Visualization

**Progress Display**
Dashboards display progress as: "Processing: 47/150 (31.3%)". The counts provide exact numbers while percentage offers quick visual assessment. Progress bars fill from left to right as percentage increases.

**Status Summary**
Summary cards show: "Success: 45, Failed: 2, Remaining: 103". Users immediately understand batch health. High failure count triggers alerts for administrator attention.

### Expected Outcome
- Count fields added to PayslipBatch model
- Counters initialized to zero
- Task updates counters during processing
- Progress and success rate calculable
- Admin displays counts for visibility

### Verification Checklist
- [ ] `total_count` field added as PositiveIntegerField
- [ ] `processed_count` field added with default=0
- [ ] `success_count` field added with default=0
- [ ] `failed_count` field added with default=0
- [ ] `progress_percentage` property method added
- [ ] `success_rate` property method added
- [ ] Task sets total_count on batch creation
- [ ] Task increments success_count on success
- [ ] Task increments failed_count on failure
- [ ] Task increments processed_count always
- [ ] Admin display includes count fields

---

## Task 55: Add Batch Timing Fields

### Overview
Add timestamp fields to the PayslipBatch model to track batch operation duration, measure performance, and enable timing-based analysis. These fields capture when batches start and complete, enabling SLA monitoring and performance optimization.

### Dependencies
- Task 53: PayslipBatch Model

### Instructions

1. **Add started_at field**
   - DateTimeField type
   - null=True, blank=True initially
   - Set when task begins processing
   - Marks actual start of work (not creation time)
   - Used to calculate duration

2. **Add completed_at field**
   - DateTimeField type
   - null=True, blank=True until completion
   - Set when task finishes (success or failure)
   - Marks end of processing
   - Used to calculate duration

3. **Update task to set started_at**
   - At beginning of Celery task execution
   - Query batch record
   - Set started_at to timezone.now()
   - Update status to PROCESSING simultaneously
   - Save batch record

4. **Update task to set completed_at**
   - At end of task, in finally block
   - Set completed_at to timezone.now()
   - Set regardless of success or failure
   - Ensures duration always calculable

5. **Add duration calculation property**
   - Add `duration` property to model
   - Calculate completed_at - started_at
   - Return timedelta object
   - Return None if not completed
   - Enables duration queries and display

6. **Add duration_seconds property**
   - Add `duration_seconds` property
   - Convert duration to total seconds
   - Return integer for easy comparison
   - Return None if duration not available

7. **Add duration display method**
   - Add `duration_display` method
   - Format duration as human-readable string
   - Examples: "2 minutes", "45 seconds", "1 hour 15 minutes"
   - Used in admin and UI displays

8. **Add is_stalled check**
   - Add `is_stalled` property
   - Check if started but not completed
   - Check if time since started exceeds threshold
   - Threshold based on expected duration (e.g., 2x average)
   - Identifies stuck tasks

9. **Add estimated completion property**
   - Add `estimated_completion` property
   - Calculate based on current progress rate
   - If 50% done in 5 minutes, estimate 10 minutes total
   - Return estimated completed_at datetime
   - Useful for user expectations

10. **Update admin display**
    - Add started_at and completed_at to list_display
    - Add duration_display as computed field
    - Format timestamps for readability
    - Show duration in seconds or minutes

11. **Add timing indexes**
    - Add index on started_at for time-range queries
    - Add index on completed_at for completion analysis
    - Enables performance metric queries
    - Supports reporting dashboards

### Timing Field Patterns

**started_at vs created_at**
If using TimestampMixin, the model already has a created_at field for when the record was created. The started_at field captures when the actual processing began, which may be seconds or minutes later depending on Celery queue depth. The difference between created_at and started_at represents queue wait time.

**completed_at for Success and Failure**
The completed_at field is set whether the batch succeeds or fails. A failed batch still completes (unsuccessfully) at a specific time. The combination of status and completed_at indicates the outcome and timing.

### Timing Calculation

**Duration Formula**
Duration = completed_at - started_at. This timedelta represents actual processing time, excluding queue wait time. For a batch that started at 10:00:00 and completed at 10:15:30, duration is 15 minutes and 30 seconds.

**Average Processing Time**
Aggregate duration across many batches to calculate average processing time. This metric helps with capacity planning and performance tuning. If average duration increases over time, it may indicate growing data volume or system degradation.

**Percentile Analysis**
Calculate 50th, 90th, and 99th percentile durations to understand typical and worst-case performance. Most batches complete quickly, but a few may take much longer due to size or complexity.

### Performance Monitoring

**SLA Tracking**
If the business defines an SLA that batches should complete within 30 minutes, query for batches where duration exceeds 30 minutes. Alert administrators when SLA violations occur frequently.

**Stalled Task Detection**
Tasks may hang due to deadlocks, infinite loops, or external service failures. The is_stalled property checks if a task has been processing for an unreasonable duration (e.g., 3x the average). Stalled tasks can be manually cancelled and restarted.

### Estimated Completion

**Rate-Based Prediction**
If 30% of items are processed in 3 minutes, the rate is 10% per minute, suggesting 10 minutes total duration. Add current time plus remaining time to get estimated completion timestamp. Display as "Expected completion: 10:15 AM".

**Accuracy Considerations**
Early estimates (5% complete) are less accurate than later estimates (80% complete). Processing rate may not be constant if items vary in complexity. Display estimate with confidence qualifier: "Approximately 5 minutes remaining".

### Admin Display

**List Display Format**
In admin list view, display timing information concisely:
- Started: "10:05:23 AM"
- Completed: "10:17:45 AM"
- Duration: "12m 22s"

Color-code duration based on thresholds: green for fast, yellow for normal, red for slow.

### Expected Outcome
- Timing fields added to PayslipBatch model
- Task sets started_at when beginning
- Task sets completed_at when finishing
- Duration calculated from timestamps
- Performance monitoring enabled

### Verification Checklist
- [ ] `started_at` field added as DateTimeField
- [ ] `completed_at` field added as DateTimeField
- [ ] Task sets started_at at execution start
- [ ] Task sets completed_at at execution end
- [ ] `duration` property method added
- [ ] `duration_seconds` property method added
- [ ] `duration_display` method for formatting added
- [ ] `is_stalled` property for hung task detection added
- [ ] `estimated_completion` property for prediction added
- [ ] Admin display includes timing fields
- [ ] Database indexes on timing fields added

---

## Task 56: Run Batch Migrations

### Overview
Create and apply Django migrations for the PayslipBatch model and its associated fields. This task generates the database schema changes and applies them to create the necessary tables, columns, and constraints in the database.

### Dependencies
- Task 53: PayslipBatch Model complete
- Task 54: Batch Status Fields added
- Task 55: Batch Timing Fields added
- PostgreSQL database configured

### Instructions

1. **Review model completeness**
   - Verify all fields added to PayslipBatch model
   - Confirm relationships defined correctly
   - Check field types and constraints
   - Ensure no pending model changes

2. **Generate migration file**
   - Open terminal in project root
   - Run: `python manage.py makemigrations payslip`
   - Django generates migration file in migrations folder
   - Review migration file for correctness

3. **Name migration appropriately**
   - Django auto-generates name like `0004_payslipbatch.py`
   - Can customize with `--name` flag if desired
   - Migration includes model creation and fields
   - Dependencies set automatically

4. **Review migration operations**
   - Open generated migration file
   - Verify CreateModel operation present
   - Check all fields listed with correct types
   - Verify ForeignKey relationships correct
   - Confirm indexes specified

5. **Check migration dependencies**
   - Migration depends on previous payslip migrations
   - Migration depends on tenant app migrations (Client model)
   - Migration depends on payroll migrations (PayrollPeriod)
   - Dependencies listed in migration class

6. **Test migration in development**
   - Run: `python manage.py migrate payslip`
   - Verify migration applies without errors
   - Check database for new table
   - Verify table columns match model fields

7. **Verify table creation**
   - Connect to PostgreSQL database
   - Query table list: `\dt` in psql
   - Confirm `payslip_payslipbatch` table exists
   - Check table schema: `\d payslip_payslipbatch`

8. **Verify foreign key constraints**
   - Check constraints: `\d+ payslip_payslipbatch`
   - Confirm FK to Client table
   - Confirm FK to PayrollPeriod table
   - Confirm FK to User table
   - Verify on_delete behaviors

9. **Verify indexes created**
   - Check indexes: `\di` in psql
   - Confirm index on tenant field
   - Confirm index on payroll_period field
   - Confirm index on status field
   - Confirm indexes on timing fields if added

10. **Test model in Django shell**
    - Run: `python manage.py shell`
    - Import PayslipBatch model
    - Create test instance
    - Save to database
    - Query back from database
    - Verify fields persist correctly

11. **Test model relationships**
    - Create batch linked to tenant
    - Access batch.tenant
    - Access batch.payroll_period
    - Verify reverse relationships work
    - Test period.payslip_batches.all()

12. **Add migration to version control**
    - Stage migration file: `git add apps/payslip/migrations/`
    - Commit with descriptive message
    - Migration file must be in repository
    - Required for other developers and deployment

13. **Document migration in changelog**
    - Add entry to project changelog or release notes
    - Note new PayslipBatch model
    - Mention bulk generation support
    - Important for deployment coordination

### Migration File Structure

**CreateModel Operation**
The migration file contains a CreateModel operation that defines the table name, all fields with their types and options, and Meta options like ordering and indexes. Django translates this to SQL CREATE TABLE statement.

**Field Definitions**
Each model field appears in the migration with its field type, max_length, null, blank, default, and choices. ForeignKey fields include to parameter, on_delete behavior, and related_name. All field details transfer to database schema.

**Index Definitions**
If Meta.indexes or Meta.index_together specified in model, the migration includes index creation. Django generates appropriate CREATE INDEX statements for the database system (PostgreSQL in this case).

### Database Table Structure

**Table Name Convention**
Django generates table name as `{app_label}_{model_name_lowercase}`. For PayslipBatch in payslip app, table name is `payslip_payslipbatch`. This naming prevents collisions across apps.

**Column Name Convention**
Model fields map directly to column names. ForeignKey fields append `_id` suffix. For example, `tenant` field becomes `tenant_id` column storing the integer primary key of the referenced Client.

**Multi-Tenancy Considerations**
In django-tenants or similar multi-tenant architecture, this migration creates the table in the public schema (shared across tenants) or in tenant schemas depending on model configuration. PayslipBatch likely belongs in tenant schemas since it's tenant-specific data.

### Migration Dependencies

**Cross-App Dependencies**
The PayslipBatch migration depends on migrations from other apps that define referenced models. Dependencies include the latest migration from tenant app (Client model), payroll app (PayrollPeriod model), and auth app (User model). Django resolves these dependencies automatically.

**Migration Order**
Django ensures dependent migrations run before this migration. If another developer has created a newer migration in the payroll app, you must pull and apply it before applying the payslipbatch migration. Migration conflicts are detected and flagged.

### Testing Strategy

**Verify Schema Correctness**
After migration, connect to database and inspect the table schema. Verify column types match expected types (VARCHAR, INTEGER, TIMESTAMP, JSONB for error_log). Verify nullable columns allow NULL and non-nullable columns have NOT NULL constraint.

**Test Data Insertion**
Create a PayslipBatch instance programmatically and save it. Verify the record appears in the database with correct values. Update the record and verify changes persist. Delete the record and verify it's removed. This confirms ORM mappings are correct.

**Test Relationships**
Create a batch linked to a real PayrollPeriod. Query the period and access its payslip_batches relationship. Verify the created batch appears in the results. This confirms ForeignKey relationships and reverse relationships function properly.

### Expected Outcome
- Migration file generated in migrations folder
- Migration applied to database
- Table created with correct schema
- Foreign keys and indexes established
- Model operational and tested

### Verification Checklist
- [ ] `python manage.py makemigrations payslip` executed
- [ ] Migration file generated (e.g., `0004_payslipbatch.py`)
- [ ] Migration file reviewed for correctness
- [ ] `python manage.py migrate payslip` executed
- [ ] Migration applied successfully
- [ ] `payslip_payslipbatch` table exists in database
- [ ] Table columns match model fields
- [ ] Foreign key constraints created
- [ ] Indexes on key fields created
- [ ] Test instance created and saved successfully
- [ ] Relationships tested and working
- [ ] Migration file committed to version control

---

## Summary

This document covered the implementation of bulk payslip generation infrastructure including:

1. **Celery Task Architecture** - Asynchronous batch processing with progress reporting and error handling
2. **Period-Based Generation** - Service layer for initiating bulk operations with validation
3. **Redis Progress Tracking** - Real-time monitoring with low-latency updates and automatic cleanup
4. **Comprehensive Error Handling** - Partial failure tolerance, retry logic, and detailed diagnostics
5. **PayslipBatch Model** - Tracking record with status, counts, timing, and error logging
6. **Database Migration** - Schema creation and deployment of the batch tracking infrastructure

These components work together to enable efficient, monitored, and resilient bulk payslip generation for entire payroll periods.

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **→ Next Document:** [02_Tasks-57-64_Email-Distribution.md](02_Tasks-57-64_Email-Distribution.md)
