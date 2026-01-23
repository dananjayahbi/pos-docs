# Tasks 87-90: Documentation & Verification

> **Phase:** 03 - Core Backend Infrastructure  
> **SubPhase:** 08 - Celery Task Queue  
> **Group:** F - Testing & Documentation  
> **Document:** 03 of 03  
> **Tasks Covered:** 87, 88, 89, 90

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [02_Tasks-82-86_Task-Tests.md](02_Tasks-82-86_Task-Tests.md)
- **→ Next SubPhase:** [../../SubPhase-09_Caching-Layer/00_SUBPHASE_OVERVIEW.md](../../SubPhase-09_Caching-Layer/00_SUBPHASE_OVERVIEW.md)

---

## Document Overview

This document covers the creation of comprehensive documentation for the Celery system, including usage guides, task creation guides, Docker commands, and final system verification.

### Tasks in This Document
| Task # | Task Name | Complexity |
|--------|-----------|------------|
| 87 | Create Celery README | Simple |
| 88 | Document Task Creation | Simple |
| 89 | Create Docker Commands | Simple |
| 90 | Verify Full Integration | Medium |

---

## Task 87: Create Celery README

### Overview
Create a comprehensive README documenting the Celery setup, configuration, and usage for the LCC platform.

### Dependencies
- All previous Celery tasks completed
- Documentation standards established

### Instructions

1. **Create Celery documentation directory**
   - Create docs/backend/celery/
   - Organize Celery documentation
   - Separate from other docs

2. **Create main README file**
   - Create docs/backend/celery/README.md
   - Overview of Celery in LCC
   - Table of contents
   - Link to detailed guides

3. **Add overview section**
   - What is Celery
   - Why LCC uses Celery
   - Architecture overview
   - Key components

4. **Document installation**
   - Package installation
   - Dependencies
   - Version requirements
   - Compatibility notes

5. **Document configuration**
   - Settings location
   - Key configuration options
   - Environment variables
   - Multi-tenancy integration

6. **List available tasks**
   - Email tasks
   - Report tasks
   - Scheduled tasks
   - Brief description each

7. **Document worker management**
   - Starting workers
   - Stopping workers
   - Scaling workers
   - Monitoring workers

8. **Document Beat scheduler**
   - Starting Beat
   - Scheduled tasks
   - Managing schedules
   - Admin interface

9. **Document Flower monitoring**
   - Accessing Flower
   - Key features
   - Authentication
   - Monitoring tasks

10. **Add troubleshooting section**
    - Common issues
    - Solutions
    - Debugging tips
    - Log locations

11. **Add quick start section**
    - Minimal setup
    - First task
    - Running worker
    - Testing

12. **Document best practices**
    - Task design
    - Idempotency
    - Error handling
    - Performance tips

### README Structure
```markdown
# Celery Task Queue - LCC Platform

## Overview
[Introduction to Celery in LCC]

## Quick Start
[Get started quickly]

## Installation
[Package installation]

## Configuration
[Settings and setup]

## Available Tasks
[List of tasks]

## Worker Management
[Running workers]

## Celery Beat
[Scheduled tasks]

## Monitoring
[Flower and logging]

## Troubleshooting
[Common issues]

## Best Practices
[Guidelines]

## Further Reading
[Links to detailed docs]
```

### Overview Section Content
```markdown
## Overview

LCC uses Celery as its distributed task queue system for:
- **Asynchronous Processing:** Email sending, report generation
- **Scheduled Tasks:** Daily reports, cleanup operations
- **Background Jobs:** Long-running operations
- **Multi-Tenancy:** Tenant-aware task execution

### Architecture
- **Broker:** Redis (message queue)
- **Workers:** Python processes executing tasks
- **Beat:** Scheduler for periodic tasks
- **Flower:** Web-based monitoring
- **Result Backend:** Redis (optional)

### Key Features
- Exponential backoff retry policy
- Three-tier priority queues (high, default, low)
- Multi-tenant context handling
- Comprehensive monitoring
```

### Quick Start Section
```markdown
## Quick Start

### 1. Start Services
bash
docker-compose up -d redis
docker-compose up -d backend

### 2. Start Worker
bash
celery -A config worker -l info

### 3. Start Beat (for scheduled tasks)
bash
celery -A config beat -l info

### 4. Start Flower (monitoring)
bash
celery -A config flower

### 5. Run Your First Task
python
from apps.core.tasks import send_email_task
result = send_email_task.delay('user@example.com', 'Hello', 'World')
```

### Available Tasks Section
```markdown
## Available Tasks

### Email Tasks
- **send_email_task:** Send single email
- **send_bulk_email_task:** Send to multiple recipients
- **send_template_email_task:** Send templated email

### Report Tasks
- **generate_sales_report_task:** Generate sales report
- **generate_inventory_report_task:** Generate inventory report

### Scheduled Tasks
- **daily_sales_report_task:** Daily sales summary (6 AM)
- **check_low_stock_task:** Stock level alerts (every 4 hours)
- **cleanup_expired_sessions_task:** Session cleanup (midnight)
- **cleanup_expired_tokens_task:** Token cleanup (2 AM)

### Utility Tasks
- **example_task:** Example/test task
```

### Expected Outcome
- Comprehensive README created
- All major topics covered
- Quick start guide included
- Troubleshooting section added
- Best practices documented

### Verification Checklist
- [ ] docs/backend/celery/ directory created
- [ ] README.md file created
- [ ] Overview section written
- [ ] Quick start guide added
- [ ] Installation documented
- [ ] Configuration documented
- [ ] Available tasks listed
- [ ] Worker management documented
- [ ] Beat scheduler documented
- [ ] Flower monitoring documented
- [ ] Troubleshooting section added
- [ ] Best practices included
- [ ] Links to detailed docs
- [ ] Examples are accurate
- [ ] Formatting is consistent

---

## Task 88: Document Task Creation

### Overview
Create a comprehensive guide for developers on how to create new Celery tasks in the LCC platform, following best practices and conventions.

### Dependencies
- Task 87: README created
- Task creation patterns established

### Instructions

1. **Create task creation guide**
   - Create docs/backend/celery/task-creation-guide.md
   - Step-by-step instructions
   - Code examples

2. **Document basic task creation**
   - Import shared_task decorator
   - Define task function
   - Add docstring
   - Basic example

3. **Document task with BaseTask**
   - Inherit from BaseTask
   - Access to common features
   - Logging, error handling
   - Example

4. **Document tenant-aware tasks**
   - Use TenantAwareTask
   - Tenant context handling
   - Schema switching
   - Example

5. **Document task configuration**
   - name parameter
   - queue routing
   - retry configuration
   - time limits
   - rate limits

6. **Document task best practices**
   - Idempotency
   - Parameter validation
   - Error handling
   - Logging
   - Documentation

7. **Provide complete examples**
   - Simple task
   - Task with retry
   - Tenant-aware task
   - Scheduled task

8. **Document testing**
   - How to test tasks
   - Mock services
   - Tenant fixtures
   - Eager mode

9. **Document common patterns**
   - Email sending
   - Report generation
   - Data processing
   - Cleanup operations

10. **Add troubleshooting**
    - Common mistakes
    - Debugging tasks
    - Performance issues

### Task Creation Guide Structure
```markdown
# Task Creation Guide

## Overview
[Introduction to creating tasks]

## Basic Task Creation
[Simple task example]

## Using BaseTask
[Task with base class]

## Tenant-Aware Tasks
[Multi-tenancy support]

## Task Configuration
[Configuring task options]

## Testing Tasks
[How to test]

## Common Patterns
[Reusable patterns]

## Best Practices
[Guidelines]

## Examples
[Complete examples]

## Troubleshooting
[Common issues]
```

### Basic Task Example
```markdown
## Basic Task Creation

### Simple Task
python
from celery import shared_task

@shared_task
def send_email_task(to, subject, body):
    """
    Send an email.
    
    Args:
        to: Recipient email address
        subject: Email subject
        body: Email body
        
    Returns:
        bool: True if sent successfully
    """
    from apps.core.services.email import send_email
    return send_email(to, subject, body)

### Usage
python
# Asynchronous execution
result = send_email_task.delay('user@example.com', 'Hello', 'World')

# Wait for result
success = result.get()
```

### Task with BaseTask Example
```markdown
## Using BaseTask

### Task Definition
python
from apps.core.tasks.base import BaseTask
from celery import shared_task

@shared_task(base=BaseTask, bind=True)
def process_data_task(self, data_id):
    """
    Process data with retry and logging.
    
    Args:
        data_id: ID of data to process
        
    Returns:
        dict: Processing results
    """
    try:
        # Get data
        data = Data.objects.get(id=data_id)
        
        # Process
        result = process(data)
        
        # Log success
        self.logger.info(f"Processed data {data_id}")
        
        return result
        
    except Exception as exc:
        # Log error
        self.logger.error(f"Failed to process {data_id}: {exc}")
        # Retry
        raise self.retry(exc=exc)
```

### Tenant-Aware Task Example
```markdown
## Tenant-Aware Tasks

### Task Definition
python
from apps.core.tasks.base import TenantAwareTask
from celery import shared_task

@shared_task(base=TenantAwareTask, bind=True)
def generate_report_task(self, tenant_id, report_type):
    """
    Generate report for specific tenant.
    
    Args:
        tenant_id: ID of tenant
        report_type: Type of report
        
    Returns:
        dict: Report data
    """
    # TenantAwareTask handles schema switching
    
    # Query tenant data
    products = Product.objects.all()
    
    # Generate report
    report = generate_report(products, report_type)
    
    return report

### Usage
python
result = generate_report_task.delay(
    tenant_id=tenant.id,
    report_type='sales'
)
```

### Task Configuration Example
```markdown
## Task Configuration

### Configuring Task Options
python
@shared_task(
    name='apps.core.send_critical_alert',
    queue='high_priority',
    max_retries=5,
    default_retry_delay=60,
    time_limit=300,
    soft_time_limit=240,
    rate_limit='10/m',
)
def send_critical_alert_task(message):
    """
    Send critical alert with custom configuration.
    
    Configuration:
    - High priority queue
    - 5 retry attempts
    - 60 second retry delay
    - 5 minute hard timeout
    - 4 minute soft timeout
    - Rate limited to 10/minute
    """
    send_alert(message)
```

### Expected Outcome
- Task creation guide created
- Step-by-step instructions
- Code examples provided
- Best practices documented
- Common patterns shown

### Verification Checklist
- [ ] task-creation-guide.md created
- [ ] Basic task creation documented
- [ ] BaseTask usage explained
- [ ] TenantAwareTask explained
- [ ] Task configuration options listed
- [ ] Best practices documented
- [ ] Testing guidance provided
- [ ] Common patterns shown
- [ ] Complete examples provided
- [ ] Troubleshooting added
- [ ] Code examples are accurate
- [ ] Formatting is consistent

---

## Task 89: Create Docker Commands

### Overview
Document all Docker and Docker Compose commands for running Celery services in development and production.

### Dependencies
- Task 87: README created
- Docker setup complete

### Instructions

1. **Create Docker commands document**
   - Create docs/backend/celery/docker-commands.md
   - Comprehensive command reference
   - Development and production

2. **Document development commands**
   - Start all services
   - Start individual services
   - Stop services
   - View logs

3. **Document worker commands**
   - Start worker
   - Multiple workers
   - Worker with specific queues
   - Worker concurrency

4. **Document Beat commands**
   - Start Beat
   - Beat with specific scheduler
   - Beat logging

5. **Document Flower commands**
   - Start Flower
   - Flower with authentication
   - Access Flower UI

6. **Document service management**
   - Restart services
   - Scale workers
   - View service status
   - Health checks

7. **Document log commands**
   - View worker logs
   - View Beat logs
   - View Flower logs
   - Follow logs in real-time

8. **Document debugging commands**
   - Inspect tasks
   - Purge queues
   - Monitor queue length
   - Task status

9. **Document production deployment**
   - Production worker command
   - Process management
   - Systemd integration
   - Supervisor integration

10. **Add command examples**
    - Common scenarios
    - Troubleshooting commands
    - Maintenance commands

### Docker Commands Document Structure
```markdown
# Celery Docker Commands

## Overview
[Introduction]

## Development Commands
[Local development]

## Worker Commands
[Running workers]

## Beat Commands
[Running scheduler]

## Flower Commands
[Monitoring UI]

## Service Management
[Managing services]

## Logging Commands
[Viewing logs]

## Debugging Commands
[Troubleshooting]

## Production Deployment
[Production setup]

## Common Scenarios
[Example workflows]
```

### Development Commands Section
```markdown
## Development Commands

### Start All Services
bash
# Start all services defined in docker-compose.yml
docker-compose up -d

# Start specific services
docker-compose up -d redis postgres backend worker beat flower

### Stop Services
bash
# Stop all services
docker-compose down

# Stop specific service
docker-compose stop worker

### View Service Status
bash
docker-compose ps

### Restart Services
bash
docker-compose restart worker beat
```

### Worker Commands Section
```markdown
## Worker Commands

### Start Single Worker
bash
docker-compose exec backend celery -A config worker -l info

### Start Worker with Specific Queues
bash
# High priority only
docker-compose exec backend celery -A config worker -Q high_priority -l info

# Default and low priority
docker-compose exec backend celery -A config worker -Q default,low_priority -l info

### Start Multiple Workers
bash
# Worker 1: High priority
docker-compose run -d --name worker-high backend celery -A config worker -Q high_priority --concurrency=4

# Worker 2: Default queue
docker-compose run -d --name worker-default backend celery -A config worker -Q default --concurrency=4

# Worker 3: Low priority
docker-compose run -d --name worker-low backend celery -A config worker -Q low_priority --concurrency=2

### Configure Worker Concurrency
bash
# 8 concurrent tasks
docker-compose exec backend celery -A config worker --concurrency=8 -l info

### Worker with Auto-scaling
bash
# Scale between 2-8 workers
docker-compose exec backend celery -A config worker --autoscale=8,2 -l info
```

### Beat Commands Section
```markdown
## Beat Commands

### Start Celery Beat
bash
docker-compose exec backend celery -A config beat -l info

### Start Beat with Database Scheduler
bash
docker-compose exec backend celery -A config beat \
    --scheduler django_celery_beat.schedulers:DatabaseScheduler \
    -l info

### Start Beat in Background
bash
docker-compose run -d --name beat backend celery -A config beat -l info
```

### Flower Commands Section
```markdown
## Flower Commands

### Start Flower
bash
docker-compose exec backend celery -A config flower

### Start Flower with Custom Port
bash
docker-compose exec backend celery -A config flower --port=5555

### Start Flower with Authentication
bash
docker-compose exec backend celery -A config flower \
    --basic_auth=${FLOWER_USER}:${FLOWER_PASSWORD}

### Access Flower UI
Open browser: http://localhost:5555
```

### Logging Commands Section
```markdown
## Logging Commands

### View Worker Logs
bash
# Follow worker logs
docker-compose logs -f worker

# Last 100 lines
docker-compose logs --tail=100 worker

# Logs since timestamp
docker-compose logs --since 2024-01-01T10:00:00 worker

### View Beat Logs
bash
docker-compose logs -f beat

### View All Celery Logs
bash
docker-compose logs -f worker beat flower

### Save Logs to File
bash
docker-compose logs worker > worker.log
```

### Debugging Commands Section
```markdown
## Debugging Commands

### Inspect Active Tasks
bash
docker-compose exec backend celery -A config inspect active

### Inspect Registered Tasks
bash
docker-compose exec backend celery -A config inspect registered

### Inspect Worker Stats
bash
docker-compose exec backend celery -A config inspect stats

### Purge All Tasks
bash
# WARNING: Deletes all pending tasks
docker-compose exec backend celery -A config purge

### Purge Specific Queue
bash
docker-compose exec backend celery -A config purge -Q high_priority

### Check Queue Length
bash
# Using celery inspect
docker-compose exec backend celery -A config inspect active_queues

# Using redis-cli
docker-compose exec redis redis-cli llen celery

### Revoke Task
bash
docker-compose exec backend celery -A config revoke <task-id>
```

### Production Deployment Section
```markdown
## Production Deployment

### Production Worker Command
bash
celery -A config worker \
    --loglevel=info \
    --concurrency=4 \
    --max-tasks-per-child=1000 \
    --time-limit=3600 \
    --soft-time-limit=3540 \
    -Q default,low_priority

### Production Beat Command
bash
celery -A config beat \
    --loglevel=info \
    --scheduler django_celery_beat.schedulers:DatabaseScheduler \
    --pidfile=/var/run/celerybeat.pid

### Systemd Service File
Create /etc/systemd/system/celery-worker.service:
ini
[Unit]
Description=Celery Worker
After=network.target redis.service postgresql.service

[Service]
Type=forking
User=www-data
Group=www-data
WorkingDirectory=/app
ExecStart=/usr/local/bin/celery -A config worker --detach
Restart=always

[Install]
WantedBy=multi-user.target

### Enable and Start
bash
sudo systemctl enable celery-worker
sudo systemctl start celery-worker
sudo systemctl status celery-worker
```

### Expected Outcome
- Docker commands documented
- Development commands included
- Production commands included
- Examples provided
- Quick reference available

### Verification Checklist
- [ ] docker-commands.md created
- [ ] Development commands documented
- [ ] Worker commands documented
- [ ] Beat commands documented
- [ ] Flower commands documented
- [ ] Service management documented
- [ ] Logging commands documented
- [ ] Debugging commands documented
- [ ] Production deployment documented
- [ ] Common scenarios included
- [ ] All commands tested
- [ ] Examples are accurate

---

## Task 90: Verify Full Integration

### Overview
Perform comprehensive end-to-end testing of the entire Celery system to verify all components work together correctly.

### Dependencies
- All previous tasks completed
- All services configured

### Instructions

1. **Create verification checklist**
   - List all components to verify
   - Step-by-step verification
   - Expected outcomes

2. **Verify Redis connection**
   - Redis service running
   - Celery can connect
   - Messages can be sent/received

3. **Verify worker startup**
   - Worker starts without errors
   - Discovers tasks
   - Listens to queues

4. **Verify task execution**
   - Run simple task
   - Task executes successfully
   - Result returned correctly

5. **Verify task routing**
   - Send to high priority queue
   - Send to default queue
   - Send to low priority queue
   - Verify correct queue handling

6. **Verify Beat scheduler**
   - Beat starts correctly
   - Schedules loaded
   - Tasks execute on schedule

7. **Verify Flower monitoring**
   - Flower accessible
   - Shows connected workers
   - Displays task history
   - Authentication works

8. **Verify multi-tenancy**
   - Create test tenant
   - Run tenant-aware task
   - Verify correct schema used
   - Verify data isolation

9. **Verify retry logic**
   - Trigger task failure
   - Verify retry attempts
   - Verify backoff delays
   - Verify max retries

10. **Verify scheduled tasks**
    - Trigger daily report manually
    - Verify execution
    - Check results

11. **Verify error handling**
    - Trigger task error
    - Verify error logged
    - Verify notification sent (if configured)

12. **Verify performance**
    - Run multiple tasks
    - Check execution time
    - Verify concurrency
    - Check resource usage

13. **Document verification results**
    - Create verification report
    - List all tests performed
    - Document any issues
    - Sign off on completion

### Verification Checklist Template
```markdown
# Celery System Verification Checklist

## Infrastructure
- [ ] Redis service running
- [ ] PostgreSQL service running
- [ ] Backend service running

## Celery Components
- [ ] Worker starts successfully
- [ ] Beat starts successfully
- [ ] Flower starts successfully

## Task Execution
- [ ] Simple task executes
- [ ] Email task executes
- [ ] Report task executes
- [ ] Result returned correctly

## Task Routing
- [ ] High priority queue works
- [ ] Default queue works
- [ ] Low priority queue works
- [ ] Routing configuration correct

## Scheduled Tasks
- [ ] Beat schedules loaded
- [ ] Daily report executes
- [ ] Cleanup tasks execute
- [ ] Schedules accurate

## Multi-Tenancy
- [ ] Tenant context passed
- [ ] Schema switching works
- [ ] Data isolation verified
- [ ] No data leakage

## Retry Logic
- [ ] Retries on failure
- [ ] Max retries respected
- [ ] Backoff working
- [ ] Error handling correct

## Monitoring
- [ ] Flower accessible
- [ ] Workers visible
- [ ] Tasks visible
- [ ] Statistics accurate
- [ ] Authentication works

## Error Handling
- [ ] Errors logged
- [ ] Notifications sent
- [ ] Graceful degradation

## Performance
- [ ] Acceptable latency
- [ ] Good throughput
- [ ] Resource usage normal
- [ ] No memory leaks

## Documentation
- [ ] README complete
- [ ] Task guide complete
- [ ] Docker commands complete
- [ ] All docs accurate
```

### Verification Script Example
```bash
#!/bin/bash
# verify-celery-integration.sh

echo "=== Celery Integration Verification ==="
echo

echo "1. Checking Redis..."
docker-compose exec redis redis-cli ping
echo

echo "2. Starting Worker..."
docker-compose up -d worker
sleep 5
echo

echo "3. Checking Worker Status..."
docker-compose exec backend celery -A config inspect ping
echo

echo "4. Running Test Task..."
docker-compose exec backend python -c "
from apps.core.tasks import example_task
result = example_task.delay(5)
print(f'Task ID: {result.id}')
print(f'Task Status: {result.status}')
print(f'Task Result: {result.get(timeout=10)}')
"
echo

echo "5. Checking Beat..."
docker-compose up -d beat
sleep 5
docker-compose logs --tail=50 beat
echo

echo "6. Checking Flower..."
curl -I http://localhost:5555
echo

echo "=== Verification Complete ==="
```

### Expected Outcome
- All components verified
- End-to-end test passed
- Documentation complete
- System ready for use

### Verification Checklist
- [ ] Verification checklist created
- [ ] Redis connection verified
- [ ] Worker startup verified
- [ ] Task execution verified
- [ ] Task routing verified
- [ ] Beat scheduler verified
- [ ] Flower monitoring verified
- [ ] Multi-tenancy verified
- [ ] Retry logic verified
- [ ] Scheduled tasks verified
- [ ] Error handling verified
- [ ] Performance verified
- [ ] All tests passed
- [ ] Verification report created
- [ ] Sign-off obtained

---

## Summary

### Tasks Completed in This Document
| Task # | Task Name | Key Deliverable |
|--------|-----------|-----------------|
| 87 | Create Celery README | Comprehensive guide |
| 88 | Document Task Creation | Task creation guide |
| 89 | Create Docker Commands | Docker command reference |
| 90 | Verify Full Integration | System verification |

### Documentation Created
| Document | Purpose | Status |
|----------|---------|--------|
| README.md | Overview and quick start | ✅ Complete |
| task-creation-guide.md | Developer guide | ✅ Complete |
| docker-commands.md | Command reference | ✅ Complete |
| verification-checklist.md | System verification | ✅ Complete |

### SubPhase-08 Complete

All tasks in SubPhase-08 (Celery Task Queue) are now complete:

**Group A: Celery Installation (Tasks 01-14)** ✅
- Celery packages installed
- Django apps registered
- Redis verified
- Migrations complete

**Group B: Celery Configuration (Tasks 15-30)** ✅
- Celery app created
- Settings configured
- Broker and result backend set
- Timezone configured

**Group C: Task Infrastructure (Tasks 31-46)** ✅
- BaseTask class created
- TenantAwareTask implemented
- Common tasks created
- Task exports verified

**Group D: Celery Beat Scheduling (Tasks 47-62)** ✅
- Beat configured
- Scheduled tasks implemented
- Schedules defined
- Admin interface configured

**Group E: Monitoring & Retry (Tasks 63-78)** ✅
- Flower configured
- Retry policies implemented
- Task queues configured
- Priority system established

**Group F: Testing & Documentation (Tasks 79-90)** ✅
- Test utilities created
- Comprehensive tests written
- Documentation complete
- System verified

### System Status
```
✅ Celery installed and configured
✅ Redis broker connected
✅ Workers operational
✅ Beat scheduler running
✅ Flower monitoring accessible
✅ Tasks executing correctly
✅ Multi-tenancy functional
✅ Retry policies active
✅ Priority queues working
✅ Tests passing (>80% coverage)
✅ Documentation complete
✅ System verified
```

### Next Steps
Proceed to **SubPhase-09: Caching Layer** to implement Redis caching for improved performance.

---

## Notes for AI Agents

1. **Documentation:** Keep documentation updated with code changes
2. **Verification:** Perform full integration test before sign-off
3. **Examples:** Ensure all code examples are tested and accurate
4. **Commands:** Verify all Docker commands work as documented
5. **Checklists:** Use checklists to ensure nothing is missed
6. **Best Practices:** Document patterns and best practices clearly
7. **Troubleshooting:** Include common issues and solutions
8. **Updates:** Review and update documentation quarterly
9. **Feedback:** Gather developer feedback on documentation usefulness
10. **Maintenance:** Keep documentation in sync with code evolution
