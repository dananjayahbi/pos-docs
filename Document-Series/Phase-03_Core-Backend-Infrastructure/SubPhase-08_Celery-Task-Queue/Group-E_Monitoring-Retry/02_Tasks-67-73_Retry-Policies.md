# Tasks 67-73: Retry Policies

> **Phase:** 03 - Core Backend Infrastructure  
> **SubPhase:** 08 - Celery Task Queue  
> **Group:** E - Monitoring & Retry  
> **Document:** 02 of 03  
> **Tasks Covered:** 67, 68, 69, 70, 71, 72, 73

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [01_Tasks-63-66_Flower-Configuration.md](01_Tasks-63-66_Flower-Configuration.md)
- **→ Next Document:** [03_Tasks-74-78_Task-Queues.md](03_Tasks-74-78_Task-Queues.md)

---

## Document Overview

This document covers the implementation of comprehensive retry policies with exponential backoff, jitter, and failure notifications to ensure resilient task execution.

### Tasks in This Document
| Task # | Task Name | Complexity |
|--------|-----------|------------|
| 67 | Create Retry Policy | Simple |
| 68 | Configure max_retries | Simple |
| 69 | Configure retry_backoff | Simple |
| 70 | Configure retry_backoff_max | Simple |
| 71 | Configure retry_jitter | Simple |
| 72 | Create Task Error Handler | Medium |
| 73 | Send Failure Notifications | Medium |

---

## Task 67: Create Retry Policy

### Overview
Establish a default retry policy for tasks that defines how Celery handles task failures, including automatic retries with intelligent backoff strategies.

### Dependencies
- Task 25: Celery configuration complete
- Understanding of task failure scenarios

### Instructions

1. **Understand retry policy components**
   - max_retries: Maximum retry attempts
   - retry_backoff: Exponential backoff calculation
   - retry_backoff_max: Maximum delay between retries
   - retry_jitter: Random variation to prevent thundering herd
   - countdown: Initial delay before first retry

2. **Decide on default retry strategy**
   - LCC: 3 retries with exponential backoff
   - Suitable for transient failures
   - Network issues, temporary outages
   - Not for permanent errors (bad data)

3. **Create retry policy in Celery settings**
   - Add to config/settings/celery.py
   - Define as default task configuration
   - Can be overridden per task

4. **Set task_default_retry_delay**
   - Initial delay before first retry
   - Recommended: 60 seconds
   - Gives time for transient issues to resolve

5. **Document retry policy rationale**
   - Explain why these values
   - When to override defaults
   - Task-specific considerations

6. **Consider task categories**
   - Critical tasks: More retries
   - Idempotent tasks: Safe to retry
   - Non-idempotent: Careful with retries
   - Side-effect tasks: May need special handling

### Retry Policy Components
| Component | Purpose | Default Value |
|-----------|---------|---------------|
| max_retries | Maximum retry attempts | 3 |
| retry_backoff | Enable exponential backoff | True |
| retry_backoff_max | Maximum delay (seconds) | 600 (10 min) |
| retry_jitter | Add random delay | True |
| countdown | Initial retry delay | 60 seconds |

### Retry Strategy Comparison
| Strategy | Pros | Cons | Use Case |
|----------|------|------|----------|
| Fixed delay | Simple, predictable | Can overwhelm on mass failure | Stable systems |
| Exponential backoff | Reduces load, adaptive | More complex | Transient failures |
| No retry | Fast failure | Requires manual intervention | Testing, non-critical |

LCC uses exponential backoff with jitter

### Retry Attempt Timeline Example
```
Attempt 1: Immediate
Attempt 2: +60 seconds (countdown)
Attempt 3: +120 seconds (backoff)
Attempt 4: +240 seconds (exponential)
Final Failure: Task marked as failed
```

### Task Categories & Retry Considerations
| Category | Retry Safe | Max Retries | Notes |
|----------|------------|-------------|-------|
| Email sending | Yes | 3 | Idempotent |
| Payment processing | No | 0-1 | Financial transactions |
| Report generation | Yes | 3 | No side effects |
| Data synchronization | Yes | 5 | Eventually consistent |
| Database writes | Depends | 2 | Check idempotency |

### Expected Outcome
- Retry policy defined
- Default values set
- Strategy documented
- Ready for specific configuration

### Verification Checklist
- [ ] Retry policy components understood
- [ ] Default strategy decided
- [ ] Retry policy documented
- [ ] Task categories considered
- [ ] Ready for specific settings

---

## Task 68: Configure max_retries

### Overview
Set the maximum number of retry attempts for tasks, balancing between giving tasks a chance to succeed and avoiding infinite retry loops.

### Dependencies
- Task 67: Retry policy created

### Instructions

1. **Add max_retries to Celery settings**
   - Set in CELERY_TASK_MAX_RETRIES
   - Or in task_default_retries
   - Default: 3 retries

2. **Set default max_retries**
   - CELERY_TASK_DEFAULT_MAX_RETRIES = 3
   - Applied to all tasks unless overridden
   - Reasonable default for most tasks

3. **Consider per-task overrides**
   - Critical tasks: 5 retries
   - Quick tasks: 2 retries
   - Expensive tasks: 1 retry
   - Configured in BaseTask class

4. **Document max_retries values**
   - Default: 3 retries
   - When to increase
   - When to decrease
   - Task-specific recommendations

5. **Set autoretry_for exceptions**
   - List of exceptions to auto-retry
   - Network errors
   - Temporary failures
   - Not business logic errors

6. **Configure retry_for in BaseTask**
   - Override in BaseTask class
   - Inherited by all tasks
   - Can override per task

### max_retries Values
| Value | Use Case | Total Attempts |
|-------|----------|----------------|
| 0 | No retry, fail fast | 1 (original) |
| 1 | Quick retry for transient issues | 2 |
| 3 | Standard retry (recommended) | 4 |
| 5 | Critical tasks, more resilience | 6 |
| None | Retry forever (not recommended) | Unlimited |

### Retry Calculation
```
Total attempts = Original attempt + max_retries
max_retries = 3 → 4 total attempts
```

### Auto-Retry Exceptions
| Exception Type | Auto-Retry | Reason |
|----------------|------------|--------|
| ConnectionError | Yes | Temporary network issue |
| TimeoutError | Yes | Temporary unavailability |
| RedisConnectionError | Yes | Broker connectivity |
| DatabaseError (some) | Yes | Transient DB issues |
| ValidationError | No | Bad data, won't fix with retry |
| PermissionDenied | No | Authorization issue |

### Celery Settings Configuration
```python
# Default max retries for all tasks
CELERY_TASK_DEFAULT_MAX_RETRIES = 3

# Exceptions that trigger auto-retry
CELERY_TASK_AUTORETRY_FOR = (
    ConnectionError,
    TimeoutError,
    redis.exceptions.ConnectionError,
)
```

### BaseTask max_retries Override
```python
class BaseTask(Task):
    max_retries = 3
    autoretry_for = (
        ConnectionError,
        TimeoutError,
    )
```

### Task-Specific Overrides
| Task Type | max_retries | Rationale |
|-----------|-------------|-----------|
| Send email | 3 | Standard retry |
| Process payment | 1 | Financial safety |
| Generate report | 3 | Can retry safely |
| Sync data | 5 | Eventually consistent |
| Send notification | 2 | Not critical |

### Expected Outcome
- max_retries configured
- Default value set (3)
- Auto-retry exceptions defined
- Task-specific overrides planned

### Verification Checklist
- [ ] CELERY_TASK_DEFAULT_MAX_RETRIES set
- [ ] Value is reasonable (3 recommended)
- [ ] CELERY_TASK_AUTORETRY_FOR configured
- [ ] Appropriate exceptions listed
- [ ] BaseTask configured
- [ ] Task-specific overrides documented
- [ ] Rationale documented

---

## Task 69: Configure retry_backoff

### Overview
Enable exponential backoff for retries, which increases the delay between retry attempts exponentially, reducing system load during failures.

### Dependencies
- Task 68: max_retries configured

### Instructions

1. **Enable retry_backoff**
   - Set CELERY_TASK_RETRY_BACKOFF = True
   - Enables exponential backoff calculation
   - Applied to all tasks

2. **Understand backoff calculation**
   - Formula: countdown * (2 ^ retry_number)
   - First retry: countdown (e.g., 60s)
   - Second retry: 120s
   - Third retry: 240s
   - Grows exponentially

3. **Set in BaseTask class**
   - retry_backoff = True
   - Inherited by all tasks
   - Can override if needed

4. **Document backoff behavior**
   - Explain exponential growth
   - Show retry timeline
   - Explain benefits

5. **Consider backoff implications**
   - Delays increase rapidly
   - Good for transient failures
   - May delay recovery
   - Reduces thundering herd

### Exponential Backoff Calculation
```
Delay = base_delay * (2 ^ retry_attempt)

With base_delay = 60 seconds:
Retry 1: 60 * (2^0) = 60 seconds
Retry 2: 60 * (2^1) = 120 seconds
Retry 3: 60 * (2^2) = 240 seconds
Retry 4: 60 * (2^3) = 480 seconds
```

### Retry Timeline with Backoff
| Attempt | Time Since Original | Delay Before This Attempt |
|---------|---------------------|---------------------------|
| 0 (original) | 0:00 | N/A |
| 1 | +1:00 | 60s |
| 2 | +3:00 | 120s |
| 3 | +7:00 | 240s |
| 4 | +15:00 | 480s |

### Backoff Benefits
| Benefit | Description |
|---------|-------------|
| Reduces load | Less aggressive retrying |
| Prevents thundering herd | Spreads out retry attempts |
| Allows recovery time | Service has time to recover |
| Adapts to failure duration | Longer failures get longer delays |

### Backoff Configuration
```python
# Enable exponential backoff
CELERY_TASK_RETRY_BACKOFF = True

# Base delay for first retry
CELERY_TASK_DEFAULT_RETRY_DELAY = 60  # seconds
```

### BaseTask Configuration
```python
class BaseTask(Task):
    retry_backoff = True
    default_retry_delay = 60
```

### Backoff vs Fixed Delay
| Strategy | Retry 1 | Retry 2 | Retry 3 | Total Time |
|----------|---------|---------|---------|------------|
| Fixed (60s) | +60s | +60s | +60s | 180s |
| Exponential | +60s | +120s | +240s | 420s |

Exponential provides more recovery time

### Expected Outcome
- Exponential backoff enabled
- Retry delays increase exponentially
- System load reduced during failures
- Recovery time improved

### Verification Checklist
- [ ] CELERY_TASK_RETRY_BACKOFF enabled
- [ ] Base delay configured
- [ ] BaseTask retry_backoff set
- [ ] Backoff calculation understood
- [ ] Timeline documented
- [ ] Benefits understood

---

## Task 70: Configure retry_backoff_max

### Overview
Set a maximum limit for retry backoff delays to prevent excessively long delays while maintaining the benefits of exponential backoff.

### Dependencies
- Task 69: retry_backoff enabled

### Instructions

1. **Set retry_backoff_max**
   - CELERY_TASK_RETRY_BACKOFF_MAX = 600
   - Maximum 10 minutes between retries
   - Caps exponential growth

2. **Choose appropriate maximum**
   - LCC: 600 seconds (10 minutes)
   - Balances patience vs responsiveness
   - Prevents delays of hours

3. **Understand capping behavior**
   - Backoff grows until max reached
   - Then stays at max
   - Example: 60s, 120s, 240s, 480s, 600s, 600s...

4. **Configure in BaseTask**
   - retry_backoff_max = 600
   - Applied to all tasks
   - Can override per task

5. **Document max backoff rationale**
   - Why 10 minutes
   - When tasks give up
   - Total time calculations

### retry_backoff_max Values
| Value | Max Delay | Use Case |
|-------|-----------|----------|
| 60 | 1 minute | Quick tasks, short-lived issues |
| 300 | 5 minutes | Standard tasks |
| 600 | 10 minutes | Longer outages (recommended) |
| 1800 | 30 minutes | Critical tasks, patient retry |
| 3600 | 1 hour | Very patient (rarely needed) |

### Backoff with Max Cap Example
```
Base: 60 seconds
Max: 600 seconds (10 minutes)

Retry 1: 60s (60 * 2^0)
Retry 2: 120s (60 * 2^1)
Retry 3: 240s (60 * 2^2)
Retry 4: 480s (60 * 2^3)
Retry 5: 600s (960s capped to 600s)
Retry 6: 600s (capped)
```

### Total Time Calculation
```
With 3 retries, max 600s:
Retry 1: +60s
Retry 2: +120s
Retry 3: +240s
Total: 420 seconds (7 minutes)

With 5 retries, max 600s:
Retry 1: +60s
Retry 2: +120s
Retry 3: +240s
Retry 4: +480s
Retry 5: +600s
Total: 1500 seconds (25 minutes)
```

### Configuration
```python
# Maximum retry backoff delay
CELERY_TASK_RETRY_BACKOFF_MAX = 600  # 10 minutes
```

### BaseTask Configuration
```python
class BaseTask(Task):
    retry_backoff = True
    retry_backoff_max = 600  # 10 minutes
    max_retries = 3
```

### Backoff Timeline with Max
| Attempt | Calculated Delay | Actual Delay | Reason |
|---------|------------------|--------------|--------|
| 1 | 60s | 60s | Under max |
| 2 | 120s | 120s | Under max |
| 3 | 240s | 240s | Under max |
| 4 | 480s | 480s | Under max |
| 5 | 960s | 600s | Capped at max |
| 6 | 1920s | 600s | Capped at max |

### Expected Outcome
- Maximum backoff set to 10 minutes
- Exponential growth capped
- Prevents excessive delays
- Reasonable total retry time

### Verification Checklist
- [ ] CELERY_TASK_RETRY_BACKOFF_MAX configured
- [ ] Value set to 600 seconds
- [ ] BaseTask updated
- [ ] Capping behavior understood
- [ ] Total time calculated
- [ ] Rationale documented

---

## Task 71: Configure retry_jitter

### Overview
Enable retry jitter to add random variation to retry delays, preventing thundering herd problems when many tasks fail simultaneously.

### Dependencies
- Task 70: retry_backoff_max configured

### Instructions

1. **Enable retry_jitter**
   - Set CELERY_TASK_RETRY_JITTER = True
   - Adds randomness to retry delay
   - Prevents synchronized retries

2. **Understand jitter purpose**
   - Prevents thundering herd
   - When many tasks fail at once
   - All retry at different times
   - Reduces synchronized load

3. **Understand jitter calculation**
   - Adds random seconds to delay
   - Typically +/- 10-20% variation
   - Example: 120s becomes 108-132s

4. **Configure in BaseTask**
   - retry_jitter = True
   - Applied to all tasks
   - Randomness is automatic

5. **Document jitter benefits**
   - Prevents thundering herd
   - Spreads out retry attempts
   - Reduces peak load
   - Improves system stability

### Thundering Herd Problem
```
Without Jitter:
100 tasks fail at 10:00:00
All retry at 10:01:00
System overwhelmed again

With Jitter:
100 tasks fail at 10:00:00
Retry spread from 10:00:55 to 10:01:05
System load distributed
```

### Jitter Calculation Example
```
Base delay: 120 seconds
Jitter: ±10% (12 seconds)

Possible actual delays:
- 108 seconds (120 - 12)
- 115 seconds
- 120 seconds
- 125 seconds
- 132 seconds (120 + 12)
```

### Retry Distribution
| Without Jitter | With Jitter |
|----------------|-------------|
| All at T+60s | T+54s to T+66s |
| All at T+120s | T+108s to T+132s |
| All at T+240s | T+216s to T+264s |

Distribution prevents load spikes

### Configuration
```python
# Enable retry jitter
CELERY_TASK_RETRY_JITTER = True
```

### BaseTask Configuration
```python
class BaseTask(Task):
    retry_backoff = True
    retry_backoff_max = 600
    retry_jitter = True
    max_retries = 3
```

### Jitter Benefits
| Benefit | Description |
|---------|-------------|
| Prevents thundering herd | Tasks don't retry simultaneously |
| Reduces peak load | Spreads retries over time |
| Improves stability | System handles load better |
| Natural load balancing | Random distribution |

### When Jitter Matters Most
| Scenario | Impact |
|----------|--------|
| Mass failure (DB down) | High - many tasks fail together |
| Network partition | High - synchronized failure |
| Single task failure | Low - isolated incident |
| Rate limiting | High - prevents synchronized hits |

### Expected Outcome
- Jitter enabled
- Random variation added to retries
- Thundering herd prevented
- System stability improved

### Verification Checklist
- [ ] CELERY_TASK_RETRY_JITTER enabled
- [ ] BaseTask configured
- [ ] Thundering herd understood
- [ ] Benefits documented
- [ ] Applied to all tasks

---

## Task 72: Create Task Error Handler

### Overview
Implement a comprehensive error handler that captures task failures, logs detailed error information, and prepares for failure notifications.

### Dependencies
- Task 33: BaseTask class created
- Logging configured

### Instructions

1. **Add on_failure method to BaseTask**
   - Override Task.on_failure()
   - Called when task fails permanently
   - After all retries exhausted

2. **Capture error information**
   - Exception type and message
   - Full traceback
   - Task name and ID
   - Task arguments
   - Tenant context
   - Timestamp

3. **Log failure details**
   - Use appropriate log level (ERROR)
   - Include all context
   - Format for readability
   - Include tenant ID

4. **Extract tenant information**
   - Get from task context
   - Get from arguments
   - Include in error report
   - Critical for multi-tenant debugging

5. **Format error message**
   - Clear, informative message
   - Include task name
   - Include error summary
   - Include retry information

6. **Store error context**
   - Prepare for notification
   - Store in task result (optional)
   - Make available for alerting

7. **Handle sensitive data**
   - Don't log passwords
   - Don't log API keys
   - Sanitize user data
   - Follow GDPR if applicable

8. **Consider error categories**
   - Transient errors (network)
   - Permanent errors (bad data)
   - System errors (configuration)
   - Different handling per category

### on_failure Method Structure
```python
def on_failure(self, exc, task_id, args, kwargs, einfo):
    """
    Handle task failure after all retries exhausted.
    
    Args:
        exc: Exception instance
        task_id: Unique task ID
        args: Task positional arguments
        kwargs: Task keyword arguments
        einfo: ExceptionInfo instance with traceback
    """
    # Implementation
```

### Error Information to Capture
| Information | Source | Purpose |
|-------------|--------|---------|
| Exception type | exc.__class__.__name__ | Error categorization |
| Exception message | str(exc) | Error details |
| Traceback | einfo.traceback | Debugging |
| Task name | self.name | Identify task |
| Task ID | task_id | Track specific execution |
| Arguments | args, kwargs | Reproduce issue |
| Tenant | kwargs or context | Multi-tenancy |
| Timestamp | datetime.now() | When it happened |
| Retry count | self.request.retries | How many attempts |

### Error Logging Format
```python
logger.error(
    f"Task {task_name} [{task_id}] failed permanently",
    extra={
        'task_name': task_name,
        'task_id': task_id,
        'tenant': tenant_id,
        'exception': exc_type,
        'message': exc_message,
        'retries': retry_count,
        'args': sanitized_args,
        'traceback': traceback_string,
    }
)
```

### Data Sanitization
| Data Type | Action |
|-----------|--------|
| Passwords | Remove completely |
| API keys | Mask (show first 4 chars) |
| Email addresses | Mask domain |
| Credit cards | Remove |
| User data | Depends on policy |

### Error Categories
| Category | Characteristics | Handling |
|----------|----------------|----------|
| Transient | Network, timeout | Already retried |
| Permanent | Validation, not found | Alert immediately |
| System | Config, dependencies | Alert + escalate |
| Business | Logic errors | Log + investigate |

### Expected Outcome
- on_failure method implemented
- Error information captured
- Logging comprehensive
- Tenant context included
- Sensitive data protected

### Verification Checklist
- [ ] on_failure method added to BaseTask
- [ ] Exception captured
- [ ] Traceback captured
- [ ] Task information logged
- [ ] Tenant context included
- [ ] Timestamp recorded
- [ ] Retry count included
- [ ] Sensitive data sanitized
- [ ] Log format clear and informative
- [ ] Error categories considered

---

## Task 73: Send Failure Notifications

### Overview
Implement automated notifications for task failures, alerting the development team via Slack, email, or other channels when tasks fail permanently.

### Dependencies
- Task 72: Error handler created
- Notification infrastructure

### Instructions

1. **Choose notification channels**
   - Slack: Real-time alerts
   - Email: Detailed reports
   - PagerDuty: Critical issues (future)
   - LCC: Start with logging, add Slack later

2. **Implement notification in on_failure**
   - Call notification service
   - Pass error context
   - Don't fail if notification fails
   - Wrap in try/except

3. **Create notification message**
   - Task name and ID
   - Error summary
   - Tenant information
   - Link to logs/Flower
   - Retry information

4. **Format for channel**
   - Slack: Rich message with blocks
   - Email: HTML with details
   - Include action items
   - Make urgent issues obvious

5. **Implement rate limiting**
   - Don't spam on mass failures
   - Aggregate similar errors
   - Send summary periodically
   - Prevent alert fatigue

6. **Set notification thresholds**
   - Not every failure
   - Critical tasks only (initially)
   - Or failure rate threshold
   - Configurable per task

7. **Include context in notification**
   - Environment (prod/staging)
   - Tenant name/ID
   - Recent changes (git commit)
   - Similar recent failures

8. **Add action links**
   - Link to Flower task details
   - Link to tenant admin
   - Link to logs dashboard
   - Link to runbook if available

9. **Test notification system**
   - Trigger test failure
   - Verify notification received
   - Check formatting
   - Verify all details present

10. **Document notification policy**
    - What triggers notifications
    - Who receives them
    - How to configure
    - How to silence if needed

### Notification Channels
| Channel | Use Case | Priority | Setup Complexity |
|---------|----------|----------|------------------|
| Logs | All errors | Always | Low - already exists |
| Slack | Dev team alerts | Medium | Medium |
| Email | Detailed reports | Low | Medium |
| PagerDuty | Critical on-call | Critical only | High |
| SMS | Emergency | Rare | High |

LCC initial: Logs + Slack for critical

### Notification Message Structure
```python
{
    'text': 'Task Failed: daily_sales_report_task',
    'blocks': [
        {
            'type': 'header',
            'text': '❌ Task Failure Alert'
        },
        {
            'type': 'section',
            'fields': [
                {'type': 'mrkdwn', 'text': f'*Task:* {task_name}'},
                {'type': 'mrkdwn', 'text': f'*Status:* Failed'},
                {'type': 'mrkdwn', 'text': f'*Tenant:* {tenant_name}'},
                {'type': 'mrkdwn', 'text': f'*Retries:* {retry_count}'},
                {'type': 'mrkdwn', 'text': f'*Error:* {error_message}'},
            ]
        },
        {
            'type': 'actions',
            'elements': [
                {'type': 'button', 'text': 'View in Flower', 'url': flower_url},
                {'type': 'button', 'text': 'View Logs', 'url': logs_url},
            ]
        }
    ]
}
```

### Notification Implementation
```python
def on_failure(self, exc, task_id, args, kwargs, einfo):
    # ... capture error info ...
    
    # Send notification (don't fail if this fails)
    try:
        if should_notify(self.name, exc):
            send_task_failure_notification(
                task_name=self.name,
                task_id=task_id,
                error=exc,
                traceback=einfo.traceback,
                tenant_id=tenant_id,
                retry_count=self.request.retries,
            )
    except Exception as notify_error:
        logger.error(f"Failed to send notification: {notify_error}")
```

### Notification Rate Limiting
| Strategy | Purpose |
|----------|---------|
| Deduplication | Don't send duplicate alerts within time window |
| Aggregation | Batch similar errors into summary |
| Threshold | Only alert after N failures |
| Time window | Max N alerts per hour |

### Notification Thresholds
| Task Criticality | Threshold | Channel |
|------------------|-----------|---------|
| Critical | First failure | Slack + Email |
| High | 3 failures in 1 hour | Slack |
| Medium | 5 failures in 1 hour | Email |
| Low | 10 failures in 1 hour | Logs only |

### should_notify() Logic
```python
def should_notify(task_name, exception):
    # Critical tasks always notify
    if task_name in CRITICAL_TASKS:
        return True
    
    # Check failure rate
    recent_failures = get_recent_failures(task_name, minutes=60)
    if len(recent_failures) > THRESHOLD:
        return True
    
    # Check exception type
    if isinstance(exception, CRITICAL_EXCEPTIONS):
        return True
    
    return False
```

### Slack Message Example
```
❌ Task Failure Alert

Task: daily_sales_report_task
Environment: Production
Tenant: ABC Corp (abc123)
Error: ConnectionError: Failed to connect to database
Retries: 3 (all exhausted)
Task ID: 550e8400-e29b-41d4-a716-446655440000

[View in Flower] [View Logs] [View Tenant Admin]
```

### Email Template Structure
```html
<h2>Task Failure: {task_name}</h2>

<h3>Summary</h3>
<ul>
    <li>Task: {task_name}</li>
    <li>Environment: {environment}</li>
    <li>Tenant: {tenant_name} ({tenant_id})</li>
    <li>Time: {timestamp}</li>
</ul>

<h3>Error Details</h3>
<pre>{exception_type}: {exception_message}</pre>

<h3>Stack Trace</h3>
<pre>{traceback}</pre>

<h3>Actions</h3>
<ul>
    <li><a href="{flower_url}">View in Flower</a></li>
    <li><a href="{logs_url}">View Logs</a></li>
</ul>
```

### Expected Outcome
- Failure notifications implemented
- Slack integration configured
- Rate limiting in place
- Comprehensive error context included
- Team alerted to critical failures

### Verification Checklist
- [ ] Notification channels chosen
- [ ] Notification in on_failure method
- [ ] Message format designed
- [ ] Slack formatting implemented
- [ ] Rate limiting implemented
- [ ] Threshold logic created
- [ ] Context included in notifications
- [ ] Action links added
- [ ] Try/except around notification
- [ ] Notification tested
- [ ] Policy documented
- [ ] Team trained on alerts

---

## Summary

### Tasks Completed in This Document
| Task # | Task Name | Key Deliverable |
|--------|-----------|-----------------|
| 67 | Create Retry Policy | Retry strategy defined |
| 68 | Configure max_retries | 3 retries default |
| 69 | Configure retry_backoff | Exponential backoff enabled |
| 70 | Configure retry_backoff_max | 10-minute maximum |
| 71 | Configure retry_jitter | Jitter enabled |
| 72 | Create Task Error Handler | on_failure implemented |
| 73 | Send Failure Notifications | Slack alerts configured |

### Complete Retry Policy
| Setting | Value | Purpose |
|---------|-------|---------|
| max_retries | 3 | Maximum attempts |
| retry_backoff | True | Exponential delays |
| retry_backoff_max | 600s | 10-minute cap |
| retry_jitter | True | Prevent thundering herd |
| default_retry_delay | 60s | Initial delay |

### Retry Timeline Example
```
Attempt 0: Original execution (fails)
Attempt 1: +60s ±6s (backoff + jitter)
Attempt 2: +120s ±12s
Attempt 3: +240s ±24s
Final: Task marked as failed → notification sent
Total: ~7 minutes from first failure
```

### Error Handling Flow
```
Task Fails → BaseTask.on_failure()
    ├─→ Log error details
    ├─→ Capture tenant context
    ├─→ Check notification threshold
    └─→ Send Slack/email notification
```

### Next Steps
Proceed to [03_Tasks-74-78_Task-Queues.md](03_Tasks-74-78_Task-Queues.md) to configure priority queues for task categorization and routing.

---

## Notes for AI Agents

1. **Retry Strategy:** Exponential backoff with jitter is best practice
2. **Max Retries:** 3 is reasonable default, adjust per task
3. **Backoff Max:** 10 minutes prevents excessive delays
4. **Jitter:** Critical for preventing thundering herd
5. **Auto-Retry:** Only for transient, retryable exceptions
6. **Error Logging:** Include full context, especially tenant
7. **Notifications:** Rate limit to prevent alert fatigue
8. **Sensitive Data:** Always sanitize before logging
9. **Idempotency:** Ensure tasks can be safely retried
10. **Testing:** Test retry behavior with failure scenarios
