# Tasks 74-78: Task Queues

> **Phase:** 03 - Core Backend Infrastructure  
> **SubPhase:** 08 - Celery Task Queue  
> **Group:** E - Monitoring & Retry  
> **Document:** 03 of 03  
> **Tasks Covered:** 74, 75, 76, 77, 78

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [02_Tasks-67-73_Retry-Policies.md](02_Tasks-67-73_Retry-Policies.md)
- **→ Next Group:** [../Group-F_Testing-Documentation/00_GROUP_OVERVIEW.md](../Group-F_Testing-Documentation/00_GROUP_OVERVIEW.md)

---

## Document Overview

This document covers the configuration of priority queues for task routing, allowing critical tasks to be processed faster than background tasks.

### Tasks in This Document
| Task # | Task Name | Complexity |
|--------|-----------|------------|
| 74 | Configure Task Queues | Simple |
| 75 | Create High Priority Queue | Simple |
| 76 | Create Default Queue | Simple |
| 77 | Create Low Priority Queue | Simple |
| 78 | Document Queue Strategy | Simple |

---

## Task 74: Configure Task Queues

### Overview
Set up the infrastructure for multiple task queues, allowing tasks to be categorized and routed based on priority and characteristics.

### Dependencies
- Task 17: Celery broker configured
- Task 25: Celery settings complete

### Instructions

1. **Understand queue architecture**
   - Queues separate task categories
   - Workers listen to specific queues
   - Tasks routed to appropriate queue
   - Enables priority processing

2. **Define queue strategy for LCC**
   - high_priority: Critical, time-sensitive
   - default: Normal operations
   - low_priority: Background, bulk operations
   - Three-tier system balances priorities

3. **Add CELERY_TASK_QUEUES setting**
   - Define in config/settings/celery.py
   - List all available queues
   - Specify routing keys
   - Set exchange settings

4. **Import required classes**
   - from kombu import Queue, Exchange
   - Defines queue structures
   - Enables routing configuration

5. **Create default exchange**
   - Name: 'default'
   - Type: 'direct'
   - Used by all queues

6. **Configure default queue**
   - CELERY_TASK_DEFAULT_QUEUE = 'default'
   - Tasks go here unless routed elsewhere
   - Most tasks use default

7. **Enable task routing**
   - Add CELERY_TASK_ROUTES
   - Map tasks to queues
   - Can use patterns or explicit mapping

8. **Document queue purpose**
   - When to use each queue
   - How to route tasks
   - Worker configuration needed

### Queue Architecture
```
Redis Broker
    ├─→ high_priority queue → High priority workers
    ├─→ default queue → Standard workers
    └─→ low_priority queue → Background workers
```

### Queue Strategy
| Queue | Priority | Use Cases | Workers |
|-------|----------|-----------|---------|
| high_priority | High | Payments, critical alerts | Dedicated |
| default | Normal | Email, reports, notifications | Standard |
| low_priority | Low | Bulk operations, cleanup | Background |

### Kombu Queue Configuration
```python
from kombu import Queue, Exchange

default_exchange = Exchange('default', type='direct')

CELERY_TASK_QUEUES = (
    Queue('high_priority', exchange=default_exchange, routing_key='high'),
    Queue('default', exchange=default_exchange, routing_key='default'),
    Queue('low_priority', exchange=default_exchange, routing_key='low'),
)
```

### Task Routing Options
| Method | Use Case | Example |
|--------|----------|---------|
| CELERY_TASK_ROUTES | Explicit mapping | 'app.tasks.pay': {'queue': 'high_priority'} |
| Task decorator | Per-task routing | @task(queue='high_priority') |
| apply_async | Runtime routing | task.apply_async(queue='high_priority') |

### Worker Queue Listening
```bash
# Listen to all queues
celery -A config worker -Q high_priority,default,low_priority

# Listen to high priority only
celery -A config worker -Q high_priority

# Listen to default and low
celery -A config worker -Q default,low_priority
```

### Expected Outcome
- Queue infrastructure defined
- Three queues configured
- Default queue set
- Routing enabled

### Verification Checklist
- [ ] Queue strategy defined
- [ ] kombu imported
- [ ] Exchange created
- [ ] CELERY_TASK_QUEUES configured
- [ ] CELERY_TASK_DEFAULT_QUEUE set
- [ ] Queue purposes documented
- [ ] Worker commands documented

---

## Task 75: Create High Priority Queue

### Overview
Configure a dedicated high-priority queue for critical, time-sensitive tasks that need immediate processing, such as payment processing and urgent alerts.

### Dependencies
- Task 74: Queue infrastructure configured

### Instructions

1. **Add high_priority queue to CELERY_TASK_QUEUES**
   - Name: 'high_priority'
   - Routing key: 'high'
   - Use default exchange
   - Highest priority

2. **Define queue characteristics**
   - Fast processing required
   - Low latency
   - Dedicated workers recommended
   - Limited task types

3. **Identify high priority tasks**
   - Payment processing
   - Critical system alerts
   - Real-time notifications
   - User-facing operations

4. **Configure task routing**
   - Add to CELERY_TASK_ROUTES
   - Map critical tasks to high_priority
   - Use explicit routing

5. **Set queue priority**
   - While Celery doesn't have built-in priorities
   - Dedicated workers simulate priority
   - Workers process high_priority first

6. **Document high priority criteria**
   - When to use high priority
   - What qualifies as critical
   - Guidelines for developers

7. **Plan worker allocation**
   - Dedicated workers for high_priority
   - Separate from other workloads
   - Scale based on load

8. **Consider resource allocation**
   - More worker concurrency for high queue
   - Shorter timeouts
   - Higher resource priority

### High Priority Task Examples
| Task | Reason | Impact of Delay |
|------|--------|-----------------|
| Payment processing | Financial transaction | Customer dissatisfaction |
| Stock critical alert | Inventory issue | Lost sales |
| System failure alert | Infrastructure problem | Downtime |
| User registration | First impression | Abandoned signups |
| Password reset | Security access | Support tickets |

### Queue Configuration
```python
Queue(
    'high_priority',
    exchange=default_exchange,
    routing_key='high',
    priority=10,  # Hint for broker
)
```

### Task Routing to High Priority
```python
CELERY_TASK_ROUTES = {
    # Payment tasks
    'apps.payments.tasks.process_payment': {'queue': 'high_priority'},
    'apps.payments.tasks.refund_payment': {'queue': 'high_priority'},
    
    # Critical alerts
    'apps.inventory.tasks.stock_critical_alert': {'queue': 'high_priority'},
    'apps.system.tasks.system_failure_alert': {'queue': 'high_priority'},
    
    # User-facing
    'apps.users.tasks.send_verification_email': {'queue': 'high_priority'},
}
```

### Task Decorator Approach
```python
@shared_task(queue='high_priority')
def process_payment(payment_id):
    """Process payment immediately"""
    pass
```

### High Priority Worker
```bash
# Dedicated high priority worker
celery -A config worker \
    -Q high_priority \
    --concurrency=4 \
    --hostname=high@%h \
    --loglevel=info
```

### High Priority Guidelines
| Criterion | Guideline |
|-----------|-----------|
| Latency tolerance | < 5 seconds preferred |
| User waiting | User is actively waiting |
| Financial | Involves money |
| Critical business | Core business operation |
| System health | System stability affected |

### Resource Allocation
| Aspect | High Priority | Other Queues |
|--------|---------------|--------------|
| Workers | Dedicated | Shared |
| Concurrency | Higher (4-8) | Standard (2-4) |
| Timeout | Shorter | Standard |
| Monitoring | More frequent | Standard |

### Expected Outcome
- High priority queue configured
- Critical tasks routed
- Dedicated workers planned
- Guidelines documented

### Verification Checklist
- [ ] high_priority queue in CELERY_TASK_QUEUES
- [ ] Routing key configured
- [ ] Critical tasks identified
- [ ] Task routing configured
- [ ] Worker command documented
- [ ] Priority guidelines defined
- [ ] Resource allocation planned

---

## Task 76: Create Default Queue

### Overview
Configure the default queue for standard operational tasks that don't require immediate processing but should complete in reasonable time.

### Dependencies
- Task 74: Queue infrastructure configured

### Instructions

1. **Add default queue to CELERY_TASK_QUEUES**
   - Name: 'default'
   - Routing key: 'default'
   - Use default exchange
   - Most common queue

2. **Set as default**
   - CELERY_TASK_DEFAULT_QUEUE = 'default'
   - Tasks without explicit routing go here
   - Handles majority of tasks

3. **Define queue characteristics**
   - Normal processing speed
   - Standard latency (seconds to minutes)
   - Shared workers
   - Most task types

4. **Identify default priority tasks**
   - Email notifications
   - Report generation (non-urgent)
   - Data synchronization
   - Scheduled maintenance

5. **Configure implicit routing**
   - Tasks not explicitly routed
   - Use default automatically
   - No special configuration needed

6. **Document default queue usage**
   - When default is appropriate
   - What types of tasks
   - Expected processing time

7. **Plan worker allocation**
   - Standard worker pool
   - Handles default + low_priority
   - Scale based on overall load

### Default Queue Task Examples
| Task | Reason | Acceptable Delay |
|------|--------|------------------|
| Send email notification | Not time-critical | Minutes |
| Generate daily report | Scheduled, not urgent | Hours |
| Sync customer data | Background sync | Minutes to hours |
| Send newsletter | Bulk operation | Hours |
| Update analytics | Statistics | Hours |

### Queue Configuration
```python
Queue(
    'default',
    exchange=default_exchange,
    routing_key='default',
    priority=5,  # Medium priority
)
```

### Default Queue Setting
```python
# Tasks go to default if not specified
CELERY_TASK_DEFAULT_QUEUE = 'default'
CELERY_TASK_DEFAULT_ROUTING_KEY = 'default'
```

### Implicit Routing
```python
# Task goes to default queue automatically
@shared_task
def send_email_notification(user_id, message):
    """Sends email notification"""
    pass

# No queue specified, uses default
send_email_notification.delay(user_id=123, message="Hello")
```

### Task Routing (Optional)
```python
CELERY_TASK_ROUTES = {
    # Explicitly route to default (usually unnecessary)
    'apps.notifications.tasks.send_email': {'queue': 'default'},
    'apps.reports.tasks.generate_monthly_report': {'queue': 'default'},
}
```

### Default Queue Worker
```bash
# Worker handles default and low priority
celery -A config worker \
    -Q default,low_priority \
    --concurrency=4 \
    --hostname=default@%h \
    --loglevel=info
```

### Default Queue Guidelines
| Criterion | Guideline |
|-----------|-----------|
| Latency tolerance | Minutes acceptable |
| User waiting | User not actively waiting |
| Business impact | Standard operations |
| Frequency | Regular, scheduled |
| Resource use | Moderate |

### Default vs High Priority
| Aspect | High Priority | Default |
|--------|---------------|---------|
| User waiting | Yes | No |
| Financial | Often | Rarely |
| Latency | Seconds | Minutes |
| Workers | Dedicated | Shared |

### Expected Outcome
- Default queue configured
- Set as default for unrouted tasks
- Standard tasks identified
- Worker allocation planned

### Verification Checklist
- [ ] default queue in CELERY_TASK_QUEUES
- [ ] CELERY_TASK_DEFAULT_QUEUE set
- [ ] Routing key configured
- [ ] Standard tasks identified
- [ ] Worker command documented
- [ ] Guidelines defined
- [ ] Distinction from other queues clear

---

## Task 77: Create Low Priority Queue

### Overview
Configure a low-priority queue for background tasks, bulk operations, and maintenance tasks that can be processed when resources are available.

### Dependencies
- Task 74: Queue infrastructure configured

### Instructions

1. **Add low_priority queue to CELERY_TASK_QUEUES**
   - Name: 'low_priority'
   - Routing key: 'low'
   - Use default exchange
   - Lowest priority

2. **Define queue characteristics**
   - Slow processing acceptable
   - High latency tolerance (hours)
   - Shared workers (with default)
   - Resource-intensive tasks

3. **Identify low priority tasks**
   - Bulk data exports
   - Database maintenance
   - Log cleanup
   - Analytics processing
   - Large report generation

4. **Configure task routing**
   - Add to CELERY_TASK_ROUTES
   - Map background tasks to low_priority
   - Explicit routing required

5. **Document low priority criteria**
   - When to use low priority
   - What qualifies as background
   - Resource-intensive tasks

6. **Plan worker allocation**
   - Share workers with default queue
   - Process when resources available
   - Throttle if needed

7. **Consider rate limiting**
   - Limit bulk operations
   - Prevent resource exhaustion
   - Protect other queues

8. **Set longer timeouts**
   - Tasks may take longer
   - Allow sufficient time
   - Monitor for stuck tasks

### Low Priority Task Examples
| Task | Reason | Acceptable Delay |
|------|--------|------------------|
| Bulk product export | Large dataset | Hours to days |
| Database cleanup | Maintenance | Hours |
| Log archiving | Historical data | Days |
| Full system backup | Resource-intensive | Hours |
| Analytics recalculation | Background processing | Hours to days |

### Queue Configuration
```python
Queue(
    'low_priority',
    exchange=default_exchange,
    routing_key='low',
    priority=1,  # Lowest priority
)
```

### Task Routing to Low Priority
```python
CELERY_TASK_ROUTES = {
    # Bulk operations
    'apps.products.tasks.export_all_products': {'queue': 'low_priority'},
    'apps.orders.tasks.export_order_history': {'queue': 'low_priority'},
    
    # Maintenance
    'apps.core.tasks.cleanup_old_logs': {'queue': 'low_priority'},
    'apps.core.tasks.database_maintenance': {'queue': 'low_priority'},
    
    # Analytics
    'apps.analytics.tasks.recalculate_all_metrics': {'queue': 'low_priority'},
    'apps.analytics.tasks.generate_annual_report': {'queue': 'low_priority'},
}
```

### Task Decorator Approach
```python
@shared_task(queue='low_priority', time_limit=3600)
def export_all_products():
    """Export all products - can take long time"""
    pass
```

### Low Priority Worker
```bash
# Same workers handle default and low priority
# Low priority processed after default
celery -A config worker \
    -Q default,low_priority \
    --concurrency=2 \
    --hostname=worker@%h \
    --loglevel=info
```

### Low Priority Guidelines
| Criterion | Guideline |
|-----------|-----------|
| Latency tolerance | Hours to days acceptable |
| User waiting | Never |
| Resource use | Can be high |
| Frequency | Infrequent, bulk |
| Business impact | Low, non-critical |

### Rate Limiting
```python
# Limit low priority tasks
@shared_task(queue='low_priority', rate_limit='10/h')
def bulk_export_task():
    """Rate limited to 10 per hour"""
    pass
```

### Priority Comparison
| Aspect | High | Default | Low |
|--------|------|---------|-----|
| Latency | Seconds | Minutes | Hours |
| User impact | Direct | Indirect | None |
| Workers | Dedicated | Shared | Shared |
| Rate limits | No | Maybe | Yes |
| Timeout | Short | Standard | Long |

### Expected Outcome
- Low priority queue configured
- Background tasks routed
- Worker sharing planned
- Rate limiting considered

### Verification Checklist
- [ ] low_priority queue in CELERY_TASK_QUEUES
- [ ] Routing key configured
- [ ] Background tasks identified
- [ ] Task routing configured
- [ ] Worker strategy defined
- [ ] Rate limiting planned
- [ ] Timeout settings adjusted
- [ ] Guidelines defined

---

## Task 78: Document Queue Strategy

### Overview
Create comprehensive documentation of the queue strategy, routing rules, and operational guidelines for the LCC task queue system.

### Dependencies
- Tasks 74-77: All queues configured

### Instructions

1. **Create queue documentation file**
   - Create docs/backend/celery-queues.md
   - Comprehensive queue guide
   - For developers and operators

2. **Document queue overview**
   - Three-tier queue system
   - Purpose of each queue
   - When to use each

3. **Create queue comparison table**
   - Compare all three queues
   - Characteristics of each
   - Decision criteria

4. **Document routing configuration**
   - How to route tasks
   - Decorator approach
   - CELERY_TASK_ROUTES approach
   - Runtime routing

5. **Provide task examples**
   - Example for each queue
   - Real LCC tasks
   - Code snippets

6. **Document worker configuration**
   - Worker commands for each queue
   - Recommended concurrency
   - Scaling guidance

7. **Add decision flowchart**
   - Help developers choose queue
   - Visual decision tree
   - Common scenarios

8. **Document best practices**
   - Task design for queues
   - Idempotency importance
   - Resource considerations

9. **Add monitoring guidance**
   - How to monitor queues
   - Using Flower
   - Queue length alerts

10. **Include troubleshooting**
    - Common queue issues
    - Backed up queues
    - Task starvation

11. **Document deployment**
    - Production worker setup
    - Scaling strategy
    - Resource allocation

12. **Add examples section**
    - Complete task implementations
    - Routing configurations
    - Worker commands

### Documentation Structure
```markdown
# Celery Task Queues

## Overview
[Three-tier system explanation]

## Queue Comparison
[Table comparing queues]

## High Priority Queue
[Detailed high priority guide]

## Default Queue
[Detailed default guide]

## Low Priority Queue
[Detailed low priority guide]

## Task Routing
[How to route tasks]

## Worker Configuration
[Worker setup for each queue]

## Best Practices
[Guidelines and recommendations]

## Monitoring
[Queue monitoring]

## Troubleshooting
[Common issues]

## Examples
[Complete examples]
```

### Queue Comparison Table
| Aspect | High Priority | Default | Low Priority |
|--------|---------------|---------|--------------|
| **Use Case** | Critical, time-sensitive | Standard operations | Background, bulk |
| **Latency** | Seconds | Minutes | Hours to days |
| **User Impact** | Direct (waiting) | Indirect | None |
| **Examples** | Payments, alerts | Emails, reports | Exports, cleanup |
| **Workers** | Dedicated | Shared | Shared |
| **Concurrency** | High (4-8) | Medium (2-4) | Low (1-2) |
| **Rate Limits** | No | Optional | Yes |
| **Timeout** | Short (30s) | Standard (5min) | Long (1hour+) |
| **Retry** | Quick (3x) | Standard (3x) | Patient (5x) |

### Task Routing Decision Flowchart
```
Is user actively waiting?
    ├─ Yes → High Priority
    └─ No → Continue
    
Does it involve money?
    ├─ Yes → High Priority
    └─ No → Continue

Is it a bulk operation?
    ├─ Yes → Low Priority
    └─ No → Continue

Is it maintenance/cleanup?
    ├─ Yes → Low Priority
    └─ No → Default
```

### Worker Configuration Examples
```bash
# Production Setup - 3 workers

# Worker 1: High priority only
celery -A config worker \
    -Q high_priority \
    --concurrency=4 \
    --hostname=high@%h

# Worker 2: Default queue
celery -A config worker \
    -Q default \
    --concurrency=4 \
    --hostname=default@%h

# Worker 3: Low priority
celery -A config worker \
    -Q low_priority \
    --concurrency=2 \
    --hostname=low@%h
```

### Best Practices Summary
| Practice | Rationale |
|----------|-----------|
| Design for idempotency | Tasks may retry |
| Use appropriate queue | Ensures proper prioritization |
| Set timeouts | Prevent runaway tasks |
| Monitor queue length | Detect backlogs |
| Rate limit low priority | Prevent resource exhaustion |
| Test routing | Verify tasks go to correct queue |
| Document task queue | Help other developers |

### Monitoring Checklist
- [ ] Queue lengths in Flower
- [ ] Task processing rate
- [ ] Worker utilization
- [ ] Failed task rate
- [ ] Average task duration
- [ ] Queue-specific metrics

### Common Issues & Solutions
| Issue | Cause | Solution |
|-------|-------|----------|
| High queue backed up | Too few workers | Add more high priority workers |
| Default tasks delayed | High priority overload | Dedicated high workers |
| Low priority starved | Never processed | Ensure workers listen to low |
| Tasks in wrong queue | Incorrect routing | Check CELERY_TASK_ROUTES |

### Expected Outcome
- Comprehensive queue documentation
- Decision flowcharts
- Worker configuration guide
- Best practices documented
- Monitoring guidance provided

### Verification Checklist
- [ ] celery-queues.md created
- [ ] Overview section written
- [ ] Queue comparison table added
- [ ] Each queue documented in detail
- [ ] Routing guide complete
- [ ] Worker commands provided
- [ ] Decision flowchart added
- [ ] Best practices listed
- [ ] Monitoring guidance included
- [ ] Troubleshooting section added
- [ ] Examples provided
- [ ] Deployment guidance added

---

## Summary

### Tasks Completed in This Document
| Task # | Task Name | Key Deliverable |
|--------|-----------|-----------------|
| 74 | Configure Task Queues | Queue infrastructure |
| 75 | Create High Priority Queue | Critical task queue |
| 76 | Create Default Queue | Standard task queue |
| 77 | Create Low Priority Queue | Background task queue |
| 78 | Document Queue Strategy | Comprehensive guide |

### Complete Queue Configuration
| Queue | Routing Key | Priority | Use Case |
|-------|-------------|----------|----------|
| high_priority | high | High | Payments, alerts |
| default | default | Medium | Emails, reports |
| low_priority | low | Low | Exports, cleanup |

### Worker Allocation Strategy
```
Production: 3 Workers

Worker 1: high_priority (concurrency=4)
Worker 2: default (concurrency=4)
Worker 3: low_priority (concurrency=2)

Total capacity: 10 concurrent tasks
```

### Queue Routing Summary
```python
CELERY_TASK_ROUTES = {
    # High Priority
    'apps.payments.tasks.*': {'queue': 'high_priority'},
    'apps.alerts.tasks.critical_*': {'queue': 'high_priority'},
    
    # Low Priority
    'apps.exports.tasks.*': {'queue': 'low_priority'},
    'apps.maintenance.tasks.*': {'queue': 'low_priority'},
    
    # Everything else goes to default (implicit)
}
```

### Group E Completion
All tasks in Group E (Monitoring & Retry) are now complete:
- Tasks 63-66: Flower configuration ✅
- Tasks 67-73: Retry policies ✅
- Tasks 74-78: Task queues ✅

### Next Steps
Proceed to [Group F: Testing & Documentation](../Group-F_Testing-Documentation/00_GROUP_OVERVIEW.md) to create comprehensive tests and final documentation for the Celery task queue system.

---

## Notes for AI Agents

1. **Queue Strategy:** Three-tier (high, default, low) balances priorities
2. **Default Queue:** Use for tasks not explicitly routed
3. **High Priority:** Only for truly critical, time-sensitive tasks
4. **Low Priority:** Bulk operations and maintenance
5. **Worker Allocation:** Dedicate workers to high priority
6. **Rate Limiting:** Essential for low priority bulk tasks
7. **Monitoring:** Watch queue lengths in Flower
8. **Routing:** Use CELERY_TASK_ROUTES for centralized config
9. **Testing:** Test routing to ensure correct queue
10. **Documentation:** Help developers choose appropriate queue
