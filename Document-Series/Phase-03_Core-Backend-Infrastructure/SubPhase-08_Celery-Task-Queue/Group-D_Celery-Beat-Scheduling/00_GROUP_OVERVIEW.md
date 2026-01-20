# Group D: Celery Beat Scheduling

> **Phase:** 03 - Core Backend Infrastructure  
> **SubPhase:** 08 - Celery Task Queue  
> **Group:** D of F  
> **Tasks Covered:** 47-62  
> **Group Goal:** Configure Celery Beat for periodic task scheduling

---

## Navigation

- **↑ Parent:** [00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [Group-C_Task-Infrastructure](../Group-C_Task-Infrastructure/)
- **→ Next Group:** [Group-E_Monitoring-Retry](../Group-E_Monitoring-Retry/)

---

## Group Overview

This group configures Celery Beat for periodic task scheduling including scheduled tasks for reports, alerts, cleanup, and backups. Uses database scheduler for dynamic schedule management.

### Key Components
- **Database Scheduler:** django-celery-beat database backend
- **Scheduled Tasks:** Daily reports, stock alerts, cleanup
- **Crontab Definitions:** Time-based schedules
- **Admin Interface:** Manage schedules via Django admin

### Scheduled Tasks
| Task | Schedule | Purpose |
|------|----------|---------|
| Daily Report | 6:00 AM daily | Generate daily sales report |
| Low Stock Alert | Every 4 hours | Check inventory levels |
| Session Cleanup | Midnight daily | Clear expired sessions |
| Token Cleanup | 2:00 AM daily | Remove expired JWT tokens |
| Database Backup | 3:00 AM daily | Scheduled backups |

---

## Documents in This Group

| Document # | Document Name | Tasks Covered | Description |
|------------|---------------|---------------|-------------|
| DOC-01 | Beat Configuration | Tasks 47-48 | Configure scheduler |
| DOC-02 | Scheduled Tasks | Tasks 49-53 | Create scheduled tasks |
| DOC-03 | Schedule Definitions | Tasks 54-58 | Crontab configurations |
| DOC-04 | Admin & Documentation | Tasks 59-62 | Admin interface and docs |

---

## Task Summary

| Task # | Task Name | Key Points |
|--------|-----------|------------|
| 47 | Configure CELERY_BEAT_SCHEDULER | Database scheduler |
| 48 | Create Scheduled Tasks Module | scheduled_tasks.py |
| 49 | Create Daily Report Task | Generate daily reports |
| 50 | Create Low Stock Alert Task | Check inventory |
| 51 | Create Cleanup Old Sessions Task | Session cleanup |
| 52 | Create Token Cleanup Task | Remove expired tokens |
| 53 | Create Database Backup Task | Scheduled backups |
| 54 | Configure CELERY_BEAT_SCHEDULE | Static schedule config |
| 55 | Add Daily Report Schedule | Crontab definition |
| 56 | Add Low Stock Check Schedule | Every 4 hours |
| 57 | Add Session Cleanup Schedule | Daily at midnight |
| 58 | Add Token Cleanup Schedule | Daily at 2am |
| 59 | Create Beat Admin Interface | Admin for schedules |
| 60 | Register PeriodicTask in Admin | Admin registration |
| 61 | Test Beat Scheduling | Scheduling tests |
| 62 | Document Scheduled Tasks | Schedule documentation |

---

## Execution Order

```
[Tasks 47-48: Beat Configuration]
        │
        ▼
[Tasks 49-53: Scheduled Tasks]
        │
        ▼
[Tasks 54-58: Schedule Definitions]
        │
        ▼
[Tasks 59-62: Admin & Docs]
```

---

## Expected Deliverables

### File Structure
```
backend/
├── apps/core/
│   └── tasks/
│       └── scheduled_tasks.py
└── config/
    └── settings/
        └── celery.py (CELERY_BEAT_SCHEDULE)
```

### Scheduler Configuration
- Use DatabaseScheduler from django-celery-beat
- Allows runtime schedule modification via admin
- Persists schedules across restarts

### Schedule Types
| Type | Use Case |
|------|----------|
| crontab | Time-based schedules (daily at X) |
| schedule | Interval-based (every N seconds) |
| solar | Sunrise/sunset based |

### Admin Features
- View all periodic tasks
- Enable/disable tasks
- Modify schedules without restart
- View task run history

---

## Notes for AI Agents

1. **Database Scheduler:** Use for dynamic schedule management
2. **Timezone Aware:** All schedules use Asia/Colombo timezone
3. **Business Hours:** Consider Sri Lankan business hours
4. **Tenant Isolation:** Scheduled tasks may need to iterate tenants
5. **Admin Access:** Restrict schedule admin to super admins
6. **Crontab Format:** minute, hour, day_of_week, day_of_month, month_of_year
7. **Test Carefully:** Test schedules in development first
