# Tasks 54-58: Schedule Definitions

> **Phase:** 03 - Core Backend Infrastructure  
> **SubPhase:** 08 - Celery Task Queue  
> **Group:** D - Celery Beat Scheduling  
> **Document:** 03 of 04  
> **Tasks Covered:** 54, 55, 56, 57, 58

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [02_Tasks-49-53_Scheduled-Tasks.md](02_Tasks-49-53_Scheduled-Tasks.md)
- **→ Next Document:** [04_Tasks-59-62_Admin-Documentation.md](04_Tasks-59-62_Admin-Documentation.md)

---

## Document Overview

This document covers the configuration of CELERY_BEAT_SCHEDULE with crontab definitions for all scheduled tasks, establishing when and how frequently each task executes.

### Tasks in This Document
| Task # | Task Name | Complexity |
|--------|-----------|------------|
| 54 | Configure CELERY_BEAT_SCHEDULE | Simple |
| 55 | Add Daily Report Schedule | Simple |
| 56 | Add Low Stock Check Schedule | Simple |
| 57 | Add Session Cleanup Schedule | Simple |
| 58 | Add Token Cleanup Schedule | Simple |

---

## Task 54: Configure CELERY_BEAT_SCHEDULE

### Overview
Configure the CELERY_BEAT_SCHEDULE setting that defines all periodic task schedules in code, serving as the default schedule configuration for the LCC platform.

### Dependencies
- Tasks 49-53: All scheduled tasks implemented
- Task 47: CELERY_BEAT_SCHEDULER configured

### Instructions

1. **Locate Celery settings file**
   - Open config/settings/celery.py
   - This contains all Celery configuration

2. **Import schedule helpers**
   - Import crontab from celery.schedules
   - Import timedelta for interval schedules
   - These define schedule patterns

3. **Create CELERY_BEAT_SCHEDULE dictionary**
   - Define as Python dictionary
   - Each key is a unique schedule name
   - Each value is schedule configuration dict

4. **Add configuration structure comment**
   - Document schedule format
   - Explain schedule types
   - Note timezone usage (Asia/Colombo)

5. **Understand schedule precedence**
   - Code schedules (CELERY_BEAT_SCHEDULE)
   - Database schedules (via admin)
   - Database schedules override code schedules

### Schedule Configuration Structure
```python
from celery.schedules import crontab
from datetime import timedelta

CELERY_BEAT_SCHEDULE = {
    'schedule-name': {
        'task': 'app.tasks.task_name',
        'schedule': crontab(...),
        'args': (...),
        'kwargs': {...},
        'options': {...},
    },
}
```

### Schedule Components
| Component | Required | Purpose |
|-----------|----------|---------|
| task | Yes | Full task name path |
| schedule | Yes | crontab or timedelta |
| args | No | Positional arguments |
| kwargs | No | Keyword arguments |
| options | No | Queue, priority, etc. |

### Schedule Types
| Type | Class | Use Case |
|------|-------|----------|
| Crontab | crontab() | Specific times |
| Interval | timedelta() | Fixed intervals |
| Solar | solar() | Sun-based |

For LCC: Primarily crontab schedules

### Crontab Parameters
| Parameter | Values | Example |
|-----------|--------|---------|
| minute | 0-59 | minute=0 (top of hour) |
| hour | 0-23 | hour=6 (6 AM) |
| day_of_week | 0-6 | day_of_week=1 (Monday) |
| day_of_month | 1-31 | day_of_month=1 (1st) |
| month_of_year | 1-12 | month_of_year=1 (Jan) |

### Expected Outcome
- CELERY_BEAT_SCHEDULE dictionary created
- Required imports added
- Structure documented
- Ready for schedule definitions

### Verification Checklist
- [ ] crontab imported from celery.schedules
- [ ] CELERY_BEAT_SCHEDULE dictionary created
- [ ] Structure documented
- [ ] Ready for schedule entries

---

## Task 55: Add Daily Report Schedule

### Overview
Configure the schedule for the daily sales report task to run automatically every morning at 6:00 AM Sri Lankan time.

### Dependencies
- Task 49: Create Daily Report Task
- Task 54: Configure CELERY_BEAT_SCHEDULE

### Instructions

1. **Add daily report entry to CELERY_BEAT_SCHEDULE**
   - Use descriptive key name
   - Configure for daily execution
   - Set appropriate time (6 AM)

2. **Configure crontab schedule**
   - minute: 0
   - hour: 6
   - Runs daily at 6:00 AM
   - Timezone: Asia/Colombo (from CELERY_TIMEZONE)

3. **Set task path**
   - Use full import path
   - Format: 'apps.core.tasks.scheduled_tasks.daily_sales_report_task'
   - Ensure task name is correct

4. **Add documentation comment**
   - Explain schedule timing
   - Note business reasoning (before business hours)
   - Document any dependencies

### Schedule Configuration
```python
CELERY_BEAT_SCHEDULE = {
    'daily-sales-report': {
        'task': 'apps.core.tasks.scheduled_tasks.daily_sales_report_task',
        'schedule': crontab(hour=6, minute=0),  # 6:00 AM daily
        'options': {
            'expires': 3600,  # Expire if not run within 1 hour
        }
    },
}
```

### Schedule Timing Rationale
| Time | Rationale |
|------|-----------|
| 6:00 AM | Before business hours start |
| Daily | Standard reporting frequency |
| Early | Gives time for review before operations |

### Schedule Parameters Explained
| Parameter | Value | Purpose |
|-----------|-------|---------|
| hour | 6 | 6:00 AM Sri Lankan time |
| minute | 0 | Top of the hour |
| expires | 3600 | Don't run if delayed > 1 hour |

### Expected Outcome
- Daily report scheduled for 6 AM
- Runs automatically every day
- Properly configured in Beat schedule
- Documented reasoning

### Verification Checklist
- [ ] Entry added to CELERY_BEAT_SCHEDULE
- [ ] Schedule uses crontab(hour=6, minute=0)
- [ ] Task path is correct
- [ ] Schedule name is descriptive
- [ ] Documentation comment added

---

## Task 56: Add Low Stock Check Schedule

### Overview
Configure the schedule for the inventory check task to run every 4 hours throughout the day, ensuring timely stock level alerts.

### Dependencies
- Task 50: Create Low Stock Alert Task
- Task 54: Configure CELERY_BEAT_SCHEDULE

### Instructions

1. **Add low stock check entry**
   - Use descriptive key name
   - Configure for 4-hour intervals
   - Runs 6 times per day

2. **Configure crontab schedule**
   - Option 1: crontab(minute=0, hour='*/4')
   - Option 2: Multiple specific times
   - Choose appropriate for business needs

3. **Set task path**
   - Full import path to check_low_stock_task
   - Verify task name spelling

4. **Consider business hours**
   - Run during business hours only?
   - Or 24/7 for urgent cases?
   - For LCC: 24/7 recommended

### Schedule Configuration
```python
'check-low-stock': {
    'task': 'apps.core.tasks.scheduled_tasks.check_low_stock_task',
    'schedule': crontab(minute=0, hour='*/4'),  # Every 4 hours
    'options': {
        'expires': 7200,  # 2 hour expiry
    }
},
```

### Schedule Options
| Pattern | Times | Use Case |
|---------|-------|----------|
| hour='*/4' | 0, 4, 8, 12, 16, 20 | Even intervals |
| hour='8,12,16,20' | Specific times | Business hours |
| hour='*' (every hour) | All hours | More frequent |

For LCC: Every 4 hours (*/4) recommended

### Frequency Rationale
| Frequency | Pros | Cons |
|-----------|------|------|
| Every hour | More responsive | More load |
| Every 4 hours | Balanced | Acceptable delay |
| Every 8 hours | Less load | Longer delay |

### Expected Outcome
- Stock check scheduled every 4 hours
- Runs automatically 24/7
- Timely alerts generated
- Load balanced

### Verification Checklist
- [ ] Entry added to CELERY_BEAT_SCHEDULE
- [ ] Schedule uses crontab(hour='*/4')
- [ ] Task path is correct
- [ ] Frequency is appropriate
- [ ] Documentation added

---

## Task 57: Add Session Cleanup Schedule

### Overview
Configure the schedule for session cleanup to run daily at midnight, maintaining database performance by removing expired sessions.

### Dependencies
- Task 51: Create Cleanup Old Sessions Task
- Task 54: Configure CELERY_BEAT_SCHEDULE

### Instructions

1. **Add session cleanup entry**
   - Use descriptive key name
   - Configure for daily midnight execution
   - Low-traffic time ideal

2. **Configure crontab schedule**
   - minute: 0
   - hour: 0
   - Runs at midnight daily

3. **Set task path**
   - Full path to cleanup_expired_sessions_task
   - Verify task name

4. **Add timing rationale**
   - Midnight chosen for low traffic
   - Daily frequency adequate
   - Minimal user impact

### Schedule Configuration
```python
'cleanup-expired-sessions': {
    'task': 'apps.core.tasks.scheduled_tasks.cleanup_expired_sessions_task',
    'schedule': crontab(hour=0, minute=0),  # Midnight daily
    'options': {
        'expires': 1800,  # 30 minute expiry
    }
},
```

### Timing Considerations
| Time | Traffic | Impact |
|------|---------|--------|
| Midnight (00:00) | Very low | Minimal |
| 2:00 AM | Low | Minimal |
| 6:00 AM | Increasing | Moderate |

Midnight optimal for maintenance tasks

### Cleanup Frequency
| Frequency | Database Impact | Session Buildup |
|-----------|----------------|-----------------|
| Daily | Low | Controlled |
| Weekly | Moderate | Higher |
| Hourly | Higher | None |

Daily is optimal balance

### Expected Outcome
- Session cleanup scheduled for midnight
- Runs daily automatically
- Maintains database performance
- Minimal user impact

### Verification Checklist
- [ ] Entry added to CELERY_BEAT_SCHEDULE
- [ ] Schedule uses crontab(hour=0, minute=0)
- [ ] Task path is correct
- [ ] Timing rationale documented

---

## Task 58: Add Token Cleanup Schedule

### Overview
Configure the schedule for token cleanup to run daily at 2:00 AM, removing expired authentication tokens and maintaining security.

### Dependencies
- Task 52: Create Token Cleanup Task
- Task 54: Configure CELERY_BEAT_SCHEDULE

### Instructions

1. **Add token cleanup entry**
   - Use descriptive key name
   - Configure for daily 2 AM execution
   - Separate from session cleanup

2. **Configure crontab schedule**
   - minute: 0
   - hour: 2
   - Runs at 2:00 AM daily

3. **Set task path**
   - Full path to cleanup_expired_tokens_task
   - Verify task name

4. **Add staggering rationale**
   - Separate from midnight tasks
   - Distribute maintenance load
   - Prevent resource contention

### Schedule Configuration
```python
'cleanup-expired-tokens': {
    'task': 'apps.core.tasks.scheduled_tasks.cleanup_expired_tokens_task',
    'schedule': crontab(hour=2, minute=0),  # 2:00 AM daily
    'options': {
        'expires': 1800,  # 30 minute expiry
    }
},
```

### Maintenance Task Staggering
| Time | Task | Purpose |
|------|------|---------|
| 00:00 | Session cleanup | Session management |
| 02:00 | Token cleanup | Security tokens |
| 03:00 | Database backup | Data protection |
| 06:00 | Daily reports | Business reporting |

Stagger prevents resource contention

### Security Considerations
| Aspect | Importance |
|--------|------------|
| Regular cleanup | Prevents token accumulation |
| Daily frequency | Adequate for security |
| Early morning | Minimal disruption |

### Expected Outcome
- Token cleanup scheduled for 2 AM
- Runs daily automatically
- Maintains security
- Staggered with other tasks

### Verification Checklist
- [ ] Entry added to CELERY_BEAT_SCHEDULE
- [ ] Schedule uses crontab(hour=2, minute=0)
- [ ] Task path is correct
- [ ] Staggering rationale documented

---

## Complete Schedule Configuration

### Full CELERY_BEAT_SCHEDULE Example
```python
from celery.schedules import crontab

CELERY_BEAT_SCHEDULE = {
    # Daily Sales Report - 6:00 AM
    'daily-sales-report': {
        'task': 'apps.core.tasks.scheduled_tasks.daily_sales_report_task',
        'schedule': crontab(hour=6, minute=0),
        'options': {'expires': 3600},
    },
    
    # Low Stock Check - Every 4 hours
    'check-low-stock': {
        'task': 'apps.core.tasks.scheduled_tasks.check_low_stock_task',
        'schedule': crontab(minute=0, hour='*/4'),
        'options': {'expires': 7200},
    },
    
    # Session Cleanup - Midnight
    'cleanup-expired-sessions': {
        'task': 'apps.core.tasks.scheduled_tasks.cleanup_expired_sessions_task',
        'schedule': crontab(hour=0, minute=0),
        'options': {'expires': 1800},
    },
    
    # Token Cleanup - 2:00 AM
    'cleanup-expired-tokens': {
        'task': 'apps.core.tasks.scheduled_tasks.cleanup_expired_tokens_task',
        'schedule': crontab(hour=2, minute=0),
        'options': {'expires': 1800},
    },
    
    # Database Backup - 3:00 AM (added in next task)
    # ... will be added in admin/documentation
}
```

### Schedule Timeline
```
00:00 - Session Cleanup
02:00 - Token Cleanup
03:00 - Database Backup
04:00 - Low Stock Check
06:00 - Daily Sales Report
08:00 - Low Stock Check
12:00 - Low Stock Check
16:00 - Low Stock Check
20:00 - Low Stock Check
```

### Timezone Note
All times are in Asia/Colombo timezone (configured in CELERY_TIMEZONE)

---

## Summary

### Tasks Completed in This Document
| Task # | Task Name | Key Deliverable |
|--------|-----------|-----------------|
| 54 | Configure CELERY_BEAT_SCHEDULE | Schedule dictionary |
| 55 | Add Daily Report Schedule | 6 AM daily |
| 56 | Add Low Stock Check Schedule | Every 4 hours |
| 57 | Add Session Cleanup Schedule | Midnight daily |
| 58 | Add Token Cleanup Schedule | 2 AM daily |

### Schedules Configured
| Task | Schedule | Frequency |
|------|----------|-----------|
| Daily Sales Report | crontab(hour=6, minute=0) | Daily at 6 AM |
| Low Stock Check | crontab(hour='*/4') | Every 4 hours |
| Session Cleanup | crontab(hour=0, minute=0) | Daily at midnight |
| Token Cleanup | crontab(hour=2, minute=0) | Daily at 2 AM |

### Schedule Characteristics
- All times in Asia/Colombo timezone
- Tasks staggered to avoid contention
- Appropriate expiry times set
- Business-hour alignment considered

### Next Steps
Proceed to [04_Tasks-59-62_Admin-Documentation.md](04_Tasks-59-62_Admin-Documentation.md) to configure Django admin interface and document scheduled tasks.

---

## Notes for AI Agents

1. **Crontab Format:** Use crontab() from celery.schedules
2. **Task Paths:** Full import path required
3. **Timezone:** All times in Asia/Colombo
4. **Staggering:** Distribute maintenance tasks
5. **Expiry:** Set appropriate task expiry
6. **Documentation:** Comment each schedule
7. **Testing:** Test schedules in development
8. **Admin Override:** Database schedules can override code
9. **Multiple Frequencies:** Can define multiple schedules for same task
10. **Business Hours:** Consider business impact of timing
