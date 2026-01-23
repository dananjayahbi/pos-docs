# Tasks 33-39: Base Task Classes

> **Phase:** 03 - Core Backend Infrastructure  
> **SubPhase:** 08 - Celery Task Queue  
> **Group:** C - Task Infrastructure  
> **Document:** 02 of 04  
> **Tasks Covered:** 33, 34, 35, 36, 37, 38, 39

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [01_Tasks-31-32_Tasks-Module-Setup.md](01_Tasks-31-32_Tasks-Module-Setup.md)
- **→ Next Document:** [03_Tasks-40-44_Common-Tasks.md](03_Tasks-40-44_Common-Tasks.md)

---

## Document Overview

This document covers the creation of base task classes that provide shared functionality for all Celery tasks, including lifecycle hooks and tenant-aware task execution for the LankaCommerce Cloud multi-tenant platform.

### Tasks in This Document
| Task # | Task Name | Complexity |
|--------|-----------|------------|
| 33 | Create BaseTask Class | Medium |
| 34 | Add on_success Hook | Medium |
| 35 | Add on_failure Hook | Medium |
| 36 | Add on_retry Hook | Medium |
| 37 | Create TenantAwareTask | Complex |
| 38 | Pass Tenant ID to Task | Medium |
| 39 | Restore Tenant in Task | Complex |

---

## Task 33: Create BaseTask Class

### Overview
Create an abstract base task class that all LCC Celery tasks will inherit from, providing common functionality, logging, and lifecycle hook integration.

### Dependencies
- Task 32: Create tasks __init__.py

### Instructions

1. **Create base.py file**
   - Create file in tasks/ package
   - For LCC: `backend/apps/core/tasks/base.py`
   - This will contain base task classes

2. **Import required modules**
   - Import Celery Task class
   - Import logging module
   - Import any Django utilities needed

3. **Define BaseTask class**
   - Inherit from celery.Task
   - Mark as abstract base class
   - Add class docstring explaining purpose

4. **Add abstract flag**
   - Set `abstract = True` class attribute
   - This prevents BaseTask from being registered as a task
   - Only subclasses will be actual tasks

5. **Add logging setup**
   - Get logger for task operations
   - Configure appropriate log level
   - Use task name in log messages

6. **Add common attributes**
   - Define any shared task attributes
   - Set default values (max_retries, etc.)
   - Document attribute purposes

### BaseTask Purpose
| Responsibility | Description |
|----------------|-------------|
| Lifecycle Hooks | on_success, on_failure, on_retry |
| Logging | Standard logging for all tasks |
| Error Handling | Common error handling patterns |
| Metrics | Task performance tracking |
| Utilities | Shared helper methods |

### Class Structure
The class should be abstract and provide:
- abstract = True attribute
- Logger instance
- Lifecycle hook methods (to be added in next tasks)
- Common utility methods
- Documentation

### Abstract Class Benefits
| Benefit | Explanation |
|---------|-------------|
| Code Reuse | Shared functionality |
| Consistency | All tasks behave similarly |
| Maintainability | Update once, affects all |
| Standards | Enforce best practices |
| Extension Points | Hook system for customization |

### Logging Strategy
| Log Level | Use Case |
|-----------|----------|
| DEBUG | Task arguments, detailed flow |
| INFO | Task start, completion |
| WARNING | Retries, recoverable errors |
| ERROR | Task failures |
| CRITICAL | System-level issues |

### Expected Outcome
- BaseTask class created in base.py
- Class is abstract (not registered as task)
- Logging configured
- Ready for lifecycle hooks
- Documented purpose

### Verification Checklist
- [ ] base.py file created in tasks/
- [ ] BaseTask class defined
- [ ] Inherits from celery.Task
- [ ] abstract = True is set
- [ ] Logger is configured
- [ ] Class has docstring
- [ ] File path: backend/apps/core/tasks/base.py

---

## Task 34: Add on_success Hook

### Overview
Implement the on_success lifecycle hook in BaseTask that is called after a task completes successfully, enabling logging, metrics, and cleanup operations.

### Dependencies
- Task 33: Create BaseTask Class

### Instructions

1. **Define on_success method**
   - Add method to BaseTask class
   - Follow Celery's on_success signature
   - Accept retval, task_id, args, kwargs

2. **Add method docstring**
   - Explain when this hook is called
   - Document parameters
   - Provide usage examples

3. **Implement logging**
   - Log successful task completion
   - Include task ID and name
   - Log execution time if available

4. **Add metrics tracking (optional)**
   - Track successful task count
   - Record execution time
   - Update success statistics

5. **Handle cleanup**
   - Close any open resources
   - Clear temporary data
   - Update task status if needed

6. **Error handling**
   - Wrap in try-except
   - Hooks should not raise exceptions
   - Log any hook errors

### on_success Signature
| Parameter | Type | Description |
|-----------|------|-------------|
| self | Task | Task instance (bind=True) |
| retval | Any | Task return value |
| task_id | str | Unique task ID |
| args | tuple | Task positional arguments |
| kwargs | dict | Task keyword arguments |

### Hook Execution Order
```
Task Execution Flow:
1. Task starts
2. Task logic executes
3. Task completes successfully
4. on_success is called    ← This hook
5. Result stored
```

### Use Cases for on_success
| Use Case | Action |
|----------|--------|
| Logging | Log completion with details |
| Metrics | Update success counters |
| Notifications | Notify of completion |
| Cleanup | Close files, connections |
| Chaining | Trigger dependent tasks |
| State Updates | Mark related records complete |

### Implementation Considerations
| Aspect | Consideration |
|--------|---------------|
| Performance | Keep hook lightweight |
| Errors | Must not raise exceptions |
| Side Effects | Avoid modifying retval |
| Logging | Log at INFO level |
| Metrics | Send to monitoring system |

### Logging Example Output
```
INFO: Task send_email_task[abc-123] succeeded in 2.5s
INFO: Task result: {'sent': True, 'message_id': 'xyz'}
```

### Expected Outcome
- on_success method implemented
- Logs successful completions
- Handles errors gracefully
- No exceptions raised from hook
- Appropriate detail level

### Verification Checklist
- [ ] on_success method added to BaseTask
- [ ] Correct method signature
- [ ] Logs task success
- [ ] Includes task ID and name
- [ ] Does not raise exceptions
- [ ] Documented with docstring

---

## Task 35: Add on_failure Hook

### Overview
Implement the on_failure lifecycle hook in BaseTask that is called when a task fails after exhausting all retries, enabling error logging, alerting, and failure handling.

### Dependencies
- Task 33: Create BaseTask Class
- Task 34: Add on_success Hook

### Instructions

1. **Define on_failure method**
   - Add method to BaseTask class
   - Follow Celery's on_failure signature
   - Accept exc, task_id, args, kwargs, einfo

2. **Add method docstring**
   - Explain when this hook is called
   - Note this is final failure (after all retries)
   - Document parameters

3. **Implement error logging**
   - Log failure with ERROR level
   - Include exception details
   - Log stack trace
   - Include task ID and arguments

4. **Add failure notifications**
   - Send alerts for critical failures
   - Email administrators
   - Slack/webhook notifications
   - Include failure context

5. **Store failure information**
   - Save to database if needed
   - Update related records
   - Mark operations as failed

6. **Error handling**
   - Wrap in try-except
   - Hooks must not raise exceptions
   - Log hook errors separately

### on_failure Signature
| Parameter | Type | Description |
|-----------|------|-------------|
| self | Task | Task instance (bind=True) |
| exc | Exception | Exception that caused failure |
| task_id | str | Unique task ID |
| args | tuple | Task positional arguments |
| kwargs | dict | Task keyword arguments |
| einfo | ExceptionInfo | Exception information with traceback |

### Hook Execution in Failure
```
Task Failure Flow:
1. Task starts
2. Task logic executes
3. Exception raised
4. Retry logic exhausted
5. on_failure is called    ← This hook
6. Failure recorded
```

### Use Cases for on_failure
| Use Case | Action |
|----------|--------|
| Error Logging | Log with full context |
| Alerting | Notify administrators |
| Monitoring | Update error metrics |
| Compensation | Rollback operations |
| State Updates | Mark records as failed |
| Debugging | Save debug information |

### Failure Context to Log
| Information | Purpose |
|-------------|---------|
| Task Name | Which task failed |
| Task ID | Unique identifier |
| Exception Type | What went wrong |
| Exception Message | Error details |
| Stack Trace | Where it failed |
| Task Arguments | Input data |
| Retry Count | How many attempts |
| Timestamp | When it failed |

### Notification Strategy
| Failure Type | Action |
|--------------|--------|
| Payment Task | Immediate alert |
| Email Task | Log only |
| Report Task | Daily summary |
| Critical Task | Page on-call |

### Expected Outcome
- on_failure method implemented
- Comprehensive error logging
- Failure notifications configured
- No exceptions from hook
- Useful debugging information

### Verification Checklist
- [ ] on_failure method added to BaseTask
- [ ] Correct method signature
- [ ] Logs failure with ERROR level
- [ ] Includes exception details
- [ ] Includes stack trace
- [ ] Does not raise exceptions
- [ ] Documented with docstring

---

## Task 36: Add on_retry Hook

### Overview
Implement the on_retry lifecycle hook in BaseTask that is called before each retry attempt, enabling retry logging, backoff tracking, and retry-specific handling.

### Dependencies
- Task 33: Create BaseTask Class
- Task 34: Add on_success Hook
- Task 35: Add on_failure Hook

### Instructions

1. **Define on_retry method**
   - Add method to BaseTask class
   - Follow Celery's on_retry signature
   - Accept exc, task_id, args, kwargs, einfo

2. **Add method docstring**
   - Explain when this hook is called
   - Note this is before retry, not final failure
   - Document retry parameters

3. **Implement retry logging**
   - Log retry attempt with WARNING level
   - Include retry count
   - Log reason for retry
   - Log when retry will occur (countdown/eta)

4. **Track retry metrics**
   - Count retry attempts
   - Track retry reasons
   - Monitor retry patterns

5. **Add retry-specific logic**
   - Cleanup before retry
   - Update retry state
   - Adjust retry parameters if needed

6. **Error handling**
   - Wrap in try-except
   - Hook must not raise exceptions
   - Log hook errors

### on_retry Signature
| Parameter | Type | Description |
|-----------|------|-------------|
| self | Task | Task instance (bind=True) |
| exc | Exception | Exception that triggered retry |
| task_id | str | Unique task ID |
| args | tuple | Task positional arguments |
| kwargs | dict | Task keyword arguments |
| einfo | ExceptionInfo | Exception information |

### Hook Execution in Retry
```
Task Retry Flow:
1. Task starts
2. Task logic executes
3. Exception raised
4. Retry decision made
5. on_retry is called      ← This hook
6. Task queued for retry
7. Wait for countdown/eta
8. Task executed again
```

### Use Cases for on_retry
| Use Case | Action |
|----------|--------|
| Logging | Log retry attempt |
| Metrics | Track retry rates |
| Cleanup | Reset state before retry |
| Throttling | Adjust backoff |
| Circuit Breaking | Detect cascading failures |
| Debugging | Track retry patterns |

### Retry Information to Log
| Information | Purpose |
|-------------|---------|
| Retry Count | Which attempt |
| Max Retries | How many total |
| Exception | Why retrying |
| Countdown | When next attempt |
| Task ID | Track across retries |
| Arguments | Context |

### Retry Scenarios
| Scenario | Logging |
|----------|---------|
| Transient Network Error | WARNING level |
| Rate Limit | INFO level |
| Database Lock | WARNING level |
| External API Down | WARNING level |

### Exponential Backoff
Retry delays typically increase:
- Attempt 1: 60 seconds
- Attempt 2: 120 seconds
- Attempt 3: 240 seconds
- Logs should show increasing delays

### Expected Outcome
- on_retry method implemented
- Logs retry attempts
- Tracks retry count
- Helpful for debugging
- No exceptions from hook

### Verification Checklist
- [ ] on_retry method added to BaseTask
- [ ] Correct method signature
- [ ] Logs retry with WARNING level
- [ ] Includes retry count
- [ ] Includes exception details
- [ ] Does not raise exceptions
- [ ] Documented with docstring

---

## Task 37: Create TenantAwareTask

### Overview
Create a specialized task class that inherits from BaseTask and adds tenant context awareness, enabling tasks to execute within the correct tenant's database schema in the multi-tenant LCC platform.

### Dependencies
- Task 33: Create BaseTask Class
- Tasks 34-36: All hooks implemented
- django-tenants configured

### Instructions

1. **Define TenantAwareTask class**
   - Create class in base.py
   - Inherit from BaseTask
   - Add class docstring explaining tenant awareness

2. **Add tenant_id parameter requirement**
   - Document that tasks must receive tenant_id
   - Explain how to pass tenant_id
   - Show usage examples

3. **Implement __call__ method**
   - Override __call__ to intercept execution
   - Extract tenant_id from arguments
   - Set tenant context before execution
   - Restore schema after execution

4. **Add tenant retrieval logic**
   - Get tenant from tenant_id
   - Handle tenant not found error
   - Validate tenant is active
   - Log tenant context switch

5. **Implement schema switching**
   - Use django-tenants to switch schema
   - Set current tenant
   - Execute task in tenant context
   - Reset to public schema after

6. **Add error handling**
   - Handle missing tenant_id
   - Handle invalid tenant_id
   - Handle schema switch failures
   - Ensure schema is always restored

7. **Document tenant task usage**
   - Show how to call tenant-aware tasks
   - Explain tenant_id requirement
   - Provide examples

### TenantAwareTask Purpose
| Responsibility | Description |
|----------------|-------------|
| Schema Switching | Switch to tenant database schema |
| Tenant Retrieval | Get tenant object from ID |
| Context Management | Maintain tenant context during execution |
| Error Handling | Handle tenant-specific errors |
| Schema Restoration | Ensure public schema restored |

### Multi-Tenancy Schema Pattern
LCC uses schema-based multi-tenancy:
| Schema | Purpose |
|--------|---------|
| public | Shared tables (Tenant model, users) |
| tenant_abc | Tenant ABC's data |
| tenant_xyz | Tenant XYZ's data |

### Tenant Context Flow
```
Task Execution with Tenant:
1. Task called with tenant_id
2. TenantAwareTask.__call__ invoked
3. Retrieve Tenant from tenant_id
4. Switch to tenant schema
5. Execute task logic
6. Task completes
7. Switch back to public schema
8. Return result
```

### Tenant ID Passing
Tasks receive tenant_id as:
```
# Option 1: Explicit parameter
task.apply_async(args=(arg1,), kwargs={'tenant_id': tenant.id})

# Option 2: From request context
current_tenant = request.tenant
task.apply_async(kwargs={'tenant_id': current_tenant.id})
```

### Schema Isolation Benefits
| Benefit | Explanation |
|---------|-------------|
| Data Privacy | Each tenant sees only their data |
| Security | No cross-tenant data access |
| Compliance | Tenant data isolation |
| Performance | Smaller per-tenant datasets |
| Maintenance | Per-tenant backups |

### Error Scenarios
| Error | Handling |
|-------|---------|
| Tenant not found | Log error, fail task |
| Invalid tenant_id | Log error, fail task |
| Inactive tenant | Skip or fail task |
| Schema switch fails | Restore public, fail task |

### Expected Outcome
- TenantAwareTask class created
- Tenant context management implemented
- Schema switching works correctly
- Errors handled gracefully
- Public schema always restored

### Verification Checklist
- [ ] TenantAwareTask class defined
- [ ] Inherits from BaseTask
- [ ] __call__ method overridden
- [ ] Tenant retrieval implemented
- [ ] Schema switching logic added
- [ ] Error handling in place
- [ ] Schema restoration guaranteed
- [ ] Documented with examples

---

## Task 38: Pass Tenant ID to Task

### Overview
Establish the pattern and helper methods for passing tenant_id to tenant-aware tasks from various calling contexts (views, signals, other tasks).

### Dependencies
- Task 37: Create TenantAwareTask

### Instructions

1. **Document tenant_id requirement**
   - All TenantAwareTask subclasses need tenant_id
   - Add to task parameter documentation
   - Show in docstring examples

2. **Create helper method for extraction**
   - Method to get tenant from request
   - Method to get tenant from current context
   - Method to validate tenant_id

3. **Add to task signatures**
   - Include tenant_id in task kwargs
   - Make it explicit and required
   - Document in task docstrings

4. **Create calling examples**
   - From Django views (with request)
   - From Django signals
   - From other tasks
   - From management commands

5. **Add validation**
   - Check tenant_id is provided
   - Validate tenant_id format
   - Raise clear error if missing

### Tenant ID Sources
| Source | How to Get tenant_id |
|--------|---------------------|
| Request | request.tenant.id |
| Model | instance.tenant_id |
| User | user.tenant_id |
| Parent Task | self.tenant_id |
| Explicit | Passed directly |

### Calling Patterns
```
# From view with request
task.apply_async(kwargs={'tenant_id': request.tenant.id})

# From model instance
task.apply_async(kwargs={'tenant_id': instance.tenant_id})

# From another task
subtask.apply_async(kwargs={'tenant_id': self.tenant_id})

# Explicit value
task.apply_async(kwargs={'tenant_id': 123})
```

### Task Definition Pattern
When defining tenant-aware tasks:
```
@shared_task(base=TenantAwareTask)
def my_tenant_task(arg1, arg2, tenant_id=None):
    # tenant_id is required but with default for signature
    # TenantAwareTask handles it before task runs
    # Task code has access to correct schema
    pass
```

### Validation Helpers
Create utility functions:
| Function | Purpose |
|----------|---------|
| get_tenant_id_from_request | Extract from request |
| get_tenant_id_from_user | Extract from user |
| validate_tenant_id | Check validity |
| require_tenant_id | Decorator to enforce |

### Error Messages
Clear error messages for:
- Missing tenant_id
- Invalid tenant_id format
- Tenant not found
- Inactive tenant

### Expected Outcome
- Clear pattern for passing tenant_id
- Helper methods created
- Documentation with examples
- Validation in place
- Consistent usage across codebase

### Verification Checklist
- [ ] tenant_id passing pattern documented
- [ ] Helper methods created
- [ ] Examples for each calling context
- [ ] Validation implemented
- [ ] Clear error messages
- [ ] Pattern is consistent
- [ ] Easy to use correctly

---

## Task 39: Restore Tenant in Task

### Overview
Implement the logic to retrieve the tenant object from tenant_id and set the correct database schema before task execution, with proper cleanup and error handling.

### Dependencies
- Task 37: Create TenantAwareTask
- Task 38: Pass Tenant ID to Task

### Instructions

1. **Implement tenant retrieval**
   - Get tenant_id from task kwargs
   - Query Tenant model for tenant
   - Handle DoesNotExist exception
   - Validate tenant is active

2. **Implement schema activation**
   - Use django-tenants API to set schema
   - Set connection.set_tenant(tenant)
   - Verify schema switch successful
   - Log schema activation

3. **Add context manager approach**
   - Consider using context manager for schema
   - Ensures cleanup even on exceptions
   - Simplifies error handling

4. **Implement schema restoration**
   - Always restore public schema after execution
   - Use finally block for guarantee
   - Log schema restoration
   - Handle restoration errors

5. **Add comprehensive logging**
   - Log tenant retrieval
   - Log schema switch
   - Log task execution in tenant context
   - Log schema restoration

6. **Test error scenarios**
   - Missing tenant_id
   - Invalid tenant_id
   - Tenant not found
   - Inactive tenant
   - Schema switch failure

### Schema Management API
| Method | Purpose |
|--------|---------|
| connection.set_tenant(tenant) | Set active tenant schema |
| connection.set_schema_to_public() | Reset to public schema |
| get_tenant_model() | Get Tenant model class |

### Implementation Pattern
```
1. Extract tenant_id from kwargs
2. Validate tenant_id is present
3. Retrieve Tenant object
4. Store current schema (if needed)
5. Switch to tenant schema
6. Execute task logic
7. (finally) Restore public schema
8. Return result
```

### Error Handling Strategy
| Error | Action |
|-------|--------|
| No tenant_id | Raise ValueError with clear message |
| Tenant not found | Raise DoesNotExist, fail task |
| Inactive tenant | Log warning, optionally skip |
| Schema switch fails | Raise exception, fail task |
| Task error | Restore schema, re-raise |

### Context Manager Pattern
Using context manager ensures cleanup:
```
with tenant_context(tenant_id):
    # Task executes here
    # Schema is automatically restored after
```

### Logging Example
```
INFO: Retrieving tenant for task: tenant_id=123
INFO: Switching to tenant schema: tenant_abc
INFO: Executing task in tenant context
INFO: Task completed successfully
INFO: Restoring public schema
```

### Schema State Tracking
| State | Description |
|-------|-------------|
| Initial | Public schema |
| Retrieved | Tenant object fetched |
| Switched | Tenant schema active |
| Executing | Task running |
| Restoring | Switching back |
| Final | Public schema restored |

### Expected Outcome
- Tenant retrieval implemented
- Schema switching works
- Schema always restored
- Comprehensive error handling
- Good logging for debugging
- Tasks execute in correct schema

### Verification Checklist
- [ ] Tenant retrieval logic implemented
- [ ] Schema activation implemented
- [ ] Schema restoration guaranteed
- [ ] Error handling comprehensive
- [ ] Logging at appropriate points
- [ ] Public schema always restored
- [ ] Tested with various scenarios
- [ ] Works with django-tenants

---

## Summary

### Tasks Completed in This Document
| Task # | Task Name | Key Deliverable |
|--------|-----------|-----------------|
| 33 | Create BaseTask Class | Abstract base task |
| 34 | Add on_success Hook | Success logging |
| 35 | Add on_failure Hook | Failure handling |
| 36 | Add on_retry Hook | Retry tracking |
| 37 | Create TenantAwareTask | Multi-tenant task class |
| 38 | Pass Tenant ID to Task | Tenant ID patterns |
| 39 | Restore Tenant in Task | Schema management |

### Base Classes Created
```
BaseTask (abstract)
├── Lifecycle hooks (on_success, on_failure, on_retry)
├── Common logging
└── Error handling

TenantAwareTask (extends BaseTask)
├── Tenant context management
├── Schema switching
└── Tenant isolation
```

### File Structure
```
backend/apps/core/tasks/
├── __init__.py
└── base.py              # BaseTask and TenantAwareTask
```

### Usage Patterns Established
- All tasks inherit from BaseTask or TenantAwareTask
- Lifecycle hooks provide observability
- Tenant-aware tasks use tenant_id parameter
- Schema switching ensures data isolation

### Next Steps
Proceed to [03_Tasks-40-44_Common-Tasks.md](03_Tasks-40-44_Common-Tasks.md) to create common task implementations for email, reports, and notifications.

---

## Notes for AI Agents

1. **Abstract Base:** BaseTask must have abstract = True
2. **Hook Safety:** Hooks must never raise exceptions
3. **Tenant Schema:** Use django-tenants API for schema switching
4. **Schema Restoration:** Always restore in finally block
5. **Error Messages:** Provide clear, actionable error messages
6. **Logging Levels:** INFO for success, WARNING for retry, ERROR for failure
7. **tenant_id Required:** All TenantAwareTask calls need tenant_id
8. **Context Manager:** Consider using for cleaner schema management
9. **Validation:** Validate tenant_id before using
10. **Testing:** Test all error scenarios thoroughly
