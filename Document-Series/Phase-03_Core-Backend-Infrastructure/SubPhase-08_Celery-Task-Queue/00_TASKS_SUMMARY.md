# SubPhase 08: Celery Task Queue - Tasks Summary

> **Phase:** 03 - Core Backend Infrastructure  
> **SubPhase Index:** 08 of 12  
> **SubPhase Goal:** Set up asynchronous task processing  
> **Total Tasks:** 90 | **Status:** Planning  
> **Estimated Duration:** 7-8 hours

---

## Navigation

- **↑ Parent:** [00_SUBPHASES_SUMMARY.md](../00_SUBPHASES_SUMMARY.md)
- **← Previous SubPhase:** [SubPhase-07_Exception-Handling](../SubPhase-07_Exception-Handling/)
- **→ Next SubPhase:** [SubPhase-09_Caching-Layer](../SubPhase-09_Caching-Layer/)

---

## SubPhase Overview

This sub-phase sets up Celery for asynchronous task processing in the LankaCommerce Cloud platform. Celery handles background jobs like email sending, report generation, and scheduled tasks using Redis as the message broker.

### Key Outcomes
- Celery fully configured
- Redis as message broker
- Celery Beat for scheduling
- Task monitoring (Flower)
- Retry policies implemented
- Tenant-aware tasks working

### Use Cases
- **Email Sending:** Transactional emails
- **Report Generation:** Large report exports
- **Inventory Updates:** Bulk stock adjustments
- **Payment Processing:** Async payment workflows
- **Scheduled Tasks:** Stock alerts, daily reports

### Dependencies
- **Requires:** SubPhase-01 (Django Apps Structure)
- **Requires:** Docker setup (Redis)

---

## Task Execution Order

```
TASK GROUP A: Celery Installation (Tasks 01-14)
        │
        ▼
TASK GROUP B: Celery Configuration (Tasks 15-30)
        │
        ▼
TASK GROUP C: Task Infrastructure (Tasks 31-46)
        │
        ▼
TASK GROUP D: Celery Beat Scheduling (Tasks 47-62)
        │
        ▼
TASK GROUP E: Monitoring & Retry (Tasks 63-78)
        │
        ▼
TASK GROUP F: Testing & Documentation (Tasks 79-90)
```

---

## Task Index

### Group A: Celery Installation (Tasks 01-14)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 01 | **Install celery Package** | pip install celery | SubPhase-01 | 🔴 Not Created |
| 02 | **Pin Celery Version** | Add to requirements.txt | Task 01 | 🔴 Not Created |
| 03 | **Install redis Package** | Redis client library | Task 02 | 🔴 Not Created |
| 04 | **Install django-celery-beat** | Scheduling extension | Task 03 | 🔴 Not Created |
| 05 | **Install django-celery-results** | Result backend | Task 04 | 🔴 Not Created |
| 06 | **Install flower** | Task monitoring | Task 05 | 🔴 Not Created |
| 07 | **Add django_celery_beat to INSTALLED_APPS** | Register beat | Task 04 | 🔴 Not Created |
| 08 | **Add django_celery_results to INSTALLED_APPS** | Register results | Task 05 | 🔴 Not Created |
| 09 | **Verify Redis Running** | Docker Redis service | Task 03 | 🔴 Not Created |
| 10 | **Test Redis Connection** | Connection test | Task 09 | 🔴 Not Created |
| 11 | **Update requirements.txt** | All Celery deps | Task 06 | 🔴 Not Created |
| 12 | **Generate Beat Migrations** | Create migrations | Task 07 | 🔴 Not Created |
| 13 | **Generate Results Migrations** | Create migrations | Task 08 | 🔴 Not Created |
| 14 | **Apply Migrations** | Run migrate | Task 13 | 🔴 Not Created |

---

### Group B: Celery Configuration (Tasks 15-30)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 15 | **Create celery.py File** | config/celery.py | Task 14 | 🔴 Not Created |
| 16 | **Create Celery App Instance** | app = Celery() | Task 15 | 🔴 Not Created |
| 17 | **Configure Django Settings** | config_from_object | Task 16 | 🔴 Not Created |
| 18 | **Configure Task Autodiscover** | autodiscover_tasks | Task 17 | 🔴 Not Created |
| 19 | **Update config __init__.py** | Import celery app | Task 18 | 🔴 Not Created |
| 20 | **Create Celery Settings File** | settings/celery.py | Task 19 | 🔴 Not Created |
| 21 | **Configure CELERY_BROKER_URL** | Redis URL | Task 20 | 🔴 Not Created |
| 22 | **Configure CELERY_RESULT_BACKEND** | Django DB or Redis | Task 21 | 🔴 Not Created |
| 23 | **Configure CELERY_ACCEPT_CONTENT** | JSON only | Task 22 | 🔴 Not Created |
| 24 | **Configure CELERY_TASK_SERIALIZER** | JSON serialization | Task 23 | 🔴 Not Created |
| 25 | **Configure CELERY_RESULT_SERIALIZER** | JSON results | Task 24 | 🔴 Not Created |
| 26 | **Configure CELERY_TIMEZONE** | Asia/Colombo | Task 25 | 🔴 Not Created |
| 27 | **Configure CELERY_TASK_TRACK_STARTED** | Track progress | Task 26 | 🔴 Not Created |
| 28 | **Configure CELERY_TASK_TIME_LIMIT** | Task timeout | Task 27 | 🔴 Not Created |
| 29 | **Import Celery Settings** | In base.py | Task 28 | 🔴 Not Created |
| 30 | **Test Celery Config** | Verify configuration | Task 29 | 🔴 Not Created |

---

### Group C: Task Infrastructure (Tasks 31-46)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 31 | **Create tasks Module** | apps/core/tasks/ | Task 30 | 🔴 Not Created |
| 32 | **Create tasks __init__.py** | Export tasks | Task 31 | 🔴 Not Created |
| 33 | **Create BaseTask Class** | Abstract base task | Task 32 | 🔴 Not Created |
| 34 | **Add on_success Hook** | Success callback | Task 33 | 🔴 Not Created |
| 35 | **Add on_failure Hook** | Failure callback | Task 34 | 🔴 Not Created |
| 36 | **Add on_retry Hook** | Retry callback | Task 35 | 🔴 Not Created |
| 37 | **Create TenantAwareTask** | Tenant context in task | Task 36 | 🔴 Not Created |
| 38 | **Pass Tenant ID to Task** | In apply_async | Task 37 | 🔴 Not Created |
| 39 | **Restore Tenant in Task** | Set schema in task | Task 38 | 🔴 Not Created |
| 40 | **Create Email Tasks** | email_tasks.py | Task 39 | 🔴 Not Created |
| 41 | **Add send_email_task** | Generic email task | Task 40 | 🔴 Not Created |
| 42 | **Create Report Tasks** | report_tasks.py | Task 41 | 🔴 Not Created |
| 43 | **Add generate_report_task** | Report generation | Task 42 | 🔴 Not Created |
| 44 | **Create Notification Tasks** | notification_tasks.py | Task 43 | 🔴 Not Created |
| 45 | **Export All Tasks** | In __init__.py | Task 44 | 🔴 Not Created |
| 46 | **Test Task Infrastructure** | Task tests | Task 45 | 🔴 Not Created |

---

### Group D: Celery Beat Scheduling (Tasks 47-62)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 47 | **Configure CELERY_BEAT_SCHEDULER** | Database scheduler | Task 46 | 🔴 Not Created |
| 48 | **Create Scheduled Tasks Module** | scheduled_tasks.py | Task 47 | 🔴 Not Created |
| 49 | **Create Daily Report Task** | Generate daily reports | Task 48 | 🔴 Not Created |
| 50 | **Create Low Stock Alert Task** | Check inventory | Task 49 | 🔴 Not Created |
| 51 | **Create Cleanup Old Sessions Task** | Session cleanup | Task 50 | 🔴 Not Created |
| 52 | **Create Token Cleanup Task** | Remove expired tokens | Task 51 | 🔴 Not Created |
| 53 | **Create Database Backup Task** | Scheduled backups | Task 52 | 🔴 Not Created |
| 54 | **Configure CELERY_BEAT_SCHEDULE** | Static schedule | Task 53 | 🔴 Not Created |
| 55 | **Add Daily Report Schedule** | Crontab definition | Task 54 | 🔴 Not Created |
| 56 | **Add Low Stock Check Schedule** | Every 4 hours | Task 55 | 🔴 Not Created |
| 57 | **Add Session Cleanup Schedule** | Daily at midnight | Task 56 | 🔴 Not Created |
| 58 | **Add Token Cleanup Schedule** | Daily at 2am | Task 57 | 🔴 Not Created |
| 59 | **Create Beat Admin Interface** | Admin for schedules | Task 58 | 🔴 Not Created |
| 60 | **Register PeriodicTask in Admin** | Admin registration | Task 59 | 🔴 Not Created |
| 61 | **Test Beat Scheduling** | Scheduling tests | Task 60 | 🔴 Not Created |
| 62 | **Document Scheduled Tasks** | Schedule documentation | Task 61 | 🔴 Not Created |

---

### Group E: Monitoring & Retry (Tasks 63-78)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 63 | **Configure Flower** | Task monitoring UI | Task 62 | 🔴 Not Created |
| 64 | **Add Flower to Docker** | Docker service | Task 63 | 🔴 Not Created |
| 65 | **Configure Flower Auth** | Basic auth setup | Task 64 | 🔴 Not Created |
| 66 | **Configure Flower URL** | flower.domain.com | Task 65 | 🔴 Not Created |
| 67 | **Create Retry Policy** | Default retry config | Task 66 | 🔴 Not Created |
| 68 | **Configure max_retries** | Maximum retry count | Task 67 | 🔴 Not Created |
| 69 | **Configure retry_backoff** | Exponential backoff | Task 68 | 🔴 Not Created |
| 70 | **Configure retry_backoff_max** | Maximum delay | Task 69 | 🔴 Not Created |
| 71 | **Configure retry_jitter** | Random jitter | Task 70 | 🔴 Not Created |
| 72 | **Create Task Error Handler** | Error notifications | Task 71 | 🔴 Not Created |
| 73 | **Send Failure Notifications** | Slack/email on fail | Task 72 | 🔴 Not Created |
| 74 | **Configure Task Queues** | Priority queues | Task 73 | 🔴 Not Created |
| 75 | **Create High Priority Queue** | Critical tasks | Task 74 | 🔴 Not Created |
| 76 | **Create Default Queue** | Normal tasks | Task 75 | 🔴 Not Created |
| 77 | **Create Low Priority Queue** | Background tasks | Task 76 | 🔴 Not Created |
| 78 | **Document Queue Strategy** | Queue documentation | Task 77 | 🔴 Not Created |

---

### Group F: Testing & Documentation (Tasks 79-90)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 79 | **Create Celery Test Utils** | Test utilities | Task 78 | 🔴 Not Created |
| 80 | **Create Celery Test Settings** | Test configuration | Task 79 | 🔴 Not Created |
| 81 | **Configure CELERY_ALWAYS_EAGER** | Sync execution | Task 80 | 🔴 Not Created |
| 82 | **Test Email Task** | Email task tests | Task 81 | 🔴 Not Created |
| 83 | **Test Report Task** | Report task tests | Task 82 | 🔴 Not Created |
| 84 | **Test Scheduled Tasks** | Schedule tests | Task 83 | 🔴 Not Created |
| 85 | **Test Retry Logic** | Retry tests | Task 84 | 🔴 Not Created |
| 86 | **Test Tenant Context** | Tenant in task tests | Task 85 | 🔴 Not Created |
| 87 | **Create Celery README** | Usage documentation | Task 86 | 🔴 Not Created |
| 88 | **Document Task Creation** | How to create tasks | Task 87 | 🔴 Not Created |
| 89 | **Create Docker Commands** | Celery start commands | Task 88 | 🔴 Not Created |
| 90 | **Verify Full Integration** | End-to-end test | Task 89 | 🔴 Not Created |

---

## Expected Final Structure

```
backend/
├── config/
│   ├── celery.py
│   └── settings/
│       └── celery.py
├── apps/core/
│   └── tasks/
│       ├── __init__.py
│       ├── base.py
│       ├── email_tasks.py
│       ├── report_tasks.py
│       ├── notification_tasks.py
│       └── scheduled_tasks.py
├── tests/
│   └── test_tasks/
│       ├── __init__.py
│       ├── test_email_tasks.py
│       ├── test_report_tasks.py
│       └── test_scheduled_tasks.py
└── docs/
    └── celery/
        ├── configuration.md
        ├── task_creation.md
        └── monitoring.md
```

---

## Queue Architecture

```
┌─────────────────────────────────────────────────────┐
│              CELERY QUEUE ARCHITECTURE              │
├─────────────────────────────────────────────────────┤
│                                                     │
│  ┌─────────────┐    ┌─────────────┐                │
│  │   Django    │───►│    Redis    │                │
│  │   App       │    │   Broker    │                │
│  └─────────────┘    └──────┬──────┘                │
│                            │                        │
│         ┌─────────────────┼─────────────────┐      │
│         │                 │                 │      │
│         ▼                 ▼                 ▼      │
│  ┌─────────────┐   ┌─────────────┐   ┌─────────┐  │
│  │ high_queue  │   │default_queue│   │low_queue│  │
│  │ (Critical)  │   │  (Normal)   │   │  (Bulk) │  │
│  └──────┬──────┘   └──────┬──────┘   └────┬────┘  │
│         │                 │               │        │
│         └────────────────┼───────────────┘        │
│                          │                         │
│                          ▼                         │
│                   ┌─────────────┐                  │
│                   │   Celery    │                  │
│                   │   Workers   │                  │
│                   └─────────────┘                  │
│                          │                         │
│         ┌────────────────┼────────────────┐       │
│         ▼                ▼                ▼       │
│  ┌─────────────┐  ┌─────────────┐  ┌──────────┐  │
│  │   Email     │  │   Report    │  │ Cleanup  │  │
│  │   Tasks     │  │   Tasks     │  │  Tasks   │  │
│  └─────────────┘  └─────────────┘  └──────────┘  │
│                                                    │
└────────────────────────────────────────────────────┘
```

---

## Progress Tracking

| Metric | Count |
|--------|-------|
| Total Tasks | 90 |
| Tasks Completed | 0 |
| Tasks In Progress | 0 |
| Tasks Not Started | 90 |

**Last Updated:** 2026-01-17  
**Current Status:** Ready for task document creation

---

## Notes for AI Agents

1. **Execution Order:** Complete Group A before B, etc.
2. **Redis Required:** Ensure Redis is running
3. **Tenant Aware:** Pass tenant_id to tasks
4. **Retry Policies:** Configure sensible defaults
5. **Queues:** Use priority queues for critical tasks
6. **Flower:** Monitoring for production
7. **Beat Scheduler:** Use database scheduler
8. **Testing:** Use CELERY_ALWAYS_EAGER for sync tests
9. **Timezone:** Asia/Colombo for Sri Lanka
