# Tasks 47-48: Beat Configuration

> **Phase:** 03 - Core Backend Infrastructure  
> **SubPhase:** 08 - Celery Task Queue  
> **Group:** D - Celery Beat Scheduling  
> **Document:** 01 of 04  
> **Tasks Covered:** 47, 48

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **→ Next Document:** [02_Tasks-49-53_Scheduled-Tasks.md](02_Tasks-49-53_Scheduled-Tasks.md)

---

## Document Overview

This document covers the configuration of Celery Beat scheduler and the creation of the scheduled tasks module for periodic task execution in the LankaCommerce Cloud platform.

### Tasks in This Document
| Task # | Task Name | Complexity |
|--------|-----------|------------|
| 47 | Configure CELERY_BEAT_SCHEDULER | Simple |
| 48 | Create Scheduled Tasks Module | Simple |

---

## Task 47: Configure CELERY_BEAT_SCHEDULER

### Overview
Configure Celery to use the database-backed scheduler from django-celery-beat, enabling dynamic schedule management through the Django admin interface.

### Dependencies
- Group A: django-celery-beat installed and migrated
- Group B: Celery settings configured

### Instructions

1. **Locate Celery settings file**
   - Find config/settings/celery.py
   - This file contains all CELERY_* settings
   - Add Beat scheduler configuration here

2. **Add CELERY_BEAT_SCHEDULER setting**
   - Define CELERY_BEAT_SCHEDULER constant
   - Set to 'django_celery_beat.schedulers:DatabaseScheduler'
   - This enables database-backed scheduling

3. **Understand scheduler options**
   - Default: PersistentScheduler (file-based)
   - Database: DatabaseScheduler (django-celery-beat)
   - Redis: RedisScheduler (custom)
   - For LCC: Use DatabaseScheduler

4. **Add configuration comment**
   - Document why database scheduler is chosen
   - Note benefits of dynamic scheduling
   - Explain admin interface access

### Scheduler Options Comparison
| Scheduler | Storage | Dynamic | Admin | Multi-Node |
|-----------|---------|---------|-------|------------|
| PersistentScheduler | File | No | No | No |
| DatabaseScheduler | Database | Yes | Yes | Yes |
| RedisScheduler | Redis | Yes | No | Yes |

### Database Scheduler Benefits
| Benefit | Explanation |
|---------|-------------|
| Dynamic Schedules | Modify schedules without restart |
| Admin Interface | Manage via Django admin |
| Multi-Node | Share schedules across nodes |
| Persistent | Survives restarts |
| Tenant-Aware | Can be tenant-specific |

### Configuration Setting
```python
# Celery Beat Scheduler
# Use database scheduler for dynamic schedule management
CELERY_BEAT_SCHEDULER = 'django_celery_beat.schedulers:DatabaseScheduler'
```

### How It Works
| Step | Action |
|------|--------|
| 1 | Beat reads schedules from database |
| 2 | Evaluates schedule conditions |
| 3 | Sends task to broker when due |
| 4 | Updates last run time in database |
| 5 | Repeats for next schedule |

### Admin Interface Access
With DatabaseScheduler:
- Access via /admin/django_celery_beat/
- View all periodic tasks
- Add new schedules
- Modify existing schedules
- Enable/disable tasks
- View run history

### Multi-Tenancy Considerations
| Aspect | Consideration |
|--------|---------------|
| Schedule Location | Public or tenant schema |
| Tenant-Specific Tasks | Pass tenant_id in task kwargs |
| Global Tasks | System maintenance schedules |
| Isolation | Consider tenant-specific schedules |

For LCC:
- System schedules in public schema
- Tenant tasks receive tenant_id parameter
- Beat iterates tenants for tenant-specific schedules

### Expected Outcome
- CELERY_BEAT_SCHEDULER configured
- Database scheduler enabled
- Dynamic schedule management available
- Admin interface ready for use
- Multi-node safe

### Verification Checklist
- [ ] CELERY_BEAT_SCHEDULER is defined in celery.py
- [ ] Set to 'django_celery_beat.schedulers:DatabaseScheduler'
- [ ] Setting is properly formatted
- [ ] Documentation comment added
- [ ] Ready for scheduled tasks

---

## Task 48: Create Scheduled Tasks Module

### Overview
Create a dedicated module for scheduled task implementations that will be executed periodically by Celery Beat in the LankaCommerce Cloud platform.

### Dependencies
- Group C: Task infrastructure created
- Task 47: Configure CELERY_BEAT_SCHEDULER

### Instructions

1. **Create scheduled_tasks.py file**
   - Create in apps/core/tasks/ directory
   - For LCC: `backend/apps/core/tasks/scheduled_tasks.py`
   - This will contain all scheduled task implementations

2. **Add file docstring**
   - Document file purpose
   - List scheduled task types
   - Provide scheduling examples

3. **Import required modules**
   - Import shared_task decorator
   - Import BaseTask or TenantAwareTask
   - Import models and utilities needed
   - Import logging

4. **Plan scheduled task categories**
   - Daily reports
   - Stock alerts
   - Cleanup tasks
   - Backup tasks
   - Monitoring tasks

5. **Add file-level constants**
   - Task execution times
   - Batch sizes for processing
   - Retention periods
   - Alert thresholds

### Scheduled Tasks Purpose
| Category | Purpose |
|----------|---------|
| Reports | Daily sales, inventory reports |
| Alerts | Low stock, payment due reminders |
| Cleanup | Session cleanup, log rotation |
| Backups | Database backups, file backups |
| Monitoring | Health checks, metrics collection |

### Scheduled vs On-Demand Tasks
| Task Type | Trigger | Examples |
|-----------|---------|----------|
| Scheduled | Time-based, cron | Daily reports |
| On-Demand | User action | Send email |

Scheduled tasks go in this file.

### Required Imports
| Module | Purpose |
|--------|---------|
| shared_task | Task decorator |
| BaseTask | For system tasks |
| TenantAwareTask | For tenant tasks |
| Tenant model | Iterate tenants |
| datetime | Time operations |
| logger | Logging |

### File Structure
```python
"""
Scheduled Celery tasks for periodic execution.

Tasks in this file are executed by Celery Beat on defined schedules:
- Daily reports: 6:00 AM daily
- Stock alerts: Every 4 hours
- Cleanup tasks: Midnight daily
- Backup tasks: 3:00 AM daily

Schedules are defined in CELERY_BEAT_SCHEDULE or via Django admin.
"""

import logging
from datetime import datetime, timedelta
from celery import shared_task
from .base import BaseTask, TenantAwareTask

logger = logging.getLogger(__name__)

# Task implementations will be added here
```

### Task Naming Convention
| Pattern | Example | Purpose |
|---------|---------|---------|
| scheduled_{action} | scheduled_daily_report | Indicates scheduled task |
| {frequency}_{action} | daily_sales_report | Clear frequency |
| cleanup_{target} | cleanup_old_sessions | Clear purpose |

### Scheduling Patterns
| Pattern | Use Case |
|---------|----------|
| Cron | Specific times (daily at 6 AM) |
| Interval | Fixed intervals (every 30 minutes) |
| Solar | Sun-based (sunrise, sunset) |
| Clocked | One-time future execution |

### Multi-Tenant Scheduled Tasks
Pattern for tenant iteration:
```python
@shared_task(base=BaseTask)
def scheduled_tenant_report():
    tenants = Tenant.objects.filter(is_active=True)
    for tenant in tenants:
        # Execute task for each tenant
        generate_report_task.apply_async(
            kwargs={'tenant_id': tenant.id}
        )
```

### Expected Outcome
- scheduled_tasks.py file created
- File properly documented
- Required imports in place
- Constants defined
- Ready for task implementations
- Clear structure for scheduled tasks

### Verification Checklist
- [ ] scheduled_tasks.py created in tasks/
- [ ] File has comprehensive docstring
- [ ] Required imports added
- [ ] File structure established
- [ ] Path: backend/apps/core/tasks/scheduled_tasks.py

---

## Scheduling Architecture

### Beat Process
| Component | Role |
|-----------|------|
| Celery Beat | Schedule evaluation engine |
| DatabaseScheduler | Reads schedules from database |
| Broker (Redis) | Receives scheduled tasks |
| Workers | Execute scheduled tasks |

### Schedule Flow
```
Database (schedules)
        ↓
Celery Beat (evaluates)
        ↓
Broker/Redis (task queue)
        ↓
Workers (execute)
        ↓
Results (database/redis)
```

### Schedule Types
| Type | Use Case | Example |
|------|----------|---------|
| Crontab | Specific times | Daily at 6 AM |
| Interval | Fixed periods | Every 30 minutes |
| Solar | Sun events | At sunrise |
| Clocked | One-time | Specific datetime |

### Crontab Schedule Format
| Field | Values | Example |
|-------|--------|---------|
| minute | 0-59 | 0 (top of hour) |
| hour | 0-23 | 6 (6 AM) |
| day_of_week | 0-6 | 1 (Monday) |
| day_of_month | 1-31 | 1 (first day) |
| month_of_year | 1-12 | 1 (January) |

### Timezone Awareness
| Aspect | Configuration |
|--------|---------------|
| Timezone | Asia/Colombo (configured in Task 26) |
| DST | Not applicable for Sri Lanka |
| Time Reference | Local time, not UTC |

### Beat Worker Requirements
| Requirement | Purpose |
|-------------|---------|
| Single Instance | Only one Beat process needed |
| Always Running | Must run continuously |
| Database Access | Reads schedules from database |
| Broker Access | Sends tasks to broker |

---

## Summary

### Tasks Completed in This Document
| Task # | Task Name | Key Deliverable |
|--------|-----------|-----------------|
| 47 | Configure CELERY_BEAT_SCHEDULER | Database scheduler configured |
| 48 | Create Scheduled Tasks Module | scheduled_tasks.py file |

### Configuration Status
- Database scheduler enabled
- Dynamic schedule management available
- Admin interface accessible
- Scheduled tasks module created

### Scheduler Benefits
- Modify schedules without restart
- Manage via Django admin
- Multi-node safe
- Persistent storage
- Tenant-aware capability

### File Created
```
backend/apps/core/tasks/
└── scheduled_tasks.py   # Scheduled task implementations
```

### Next Steps
Proceed to [02_Tasks-49-53_Scheduled-Tasks.md](02_Tasks-49-53_Scheduled-Tasks.md) to implement specific scheduled tasks for reports, alerts, and maintenance.

---

## Notes for AI Agents

1. **Database Scheduler:** Always use for dynamic schedule management
2. **Single Beat:** Only run one Beat process per environment
3. **Timezone:** Schedules use Asia/Colombo timezone
4. **Tenant Iteration:** Scheduled tasks often iterate all tenants
5. **Admin Access:** Schedules manageable via Django admin
6. **File Organization:** Separate scheduled tasks from on-demand tasks
7. **Naming Convention:** Use scheduled_ or frequency_ prefix
8. **Multi-Node:** Database scheduler is safe for multiple nodes
9. **Documentation:** Document schedule expectations in docstrings
10. **Testing:** Test scheduled tasks in eager mode
