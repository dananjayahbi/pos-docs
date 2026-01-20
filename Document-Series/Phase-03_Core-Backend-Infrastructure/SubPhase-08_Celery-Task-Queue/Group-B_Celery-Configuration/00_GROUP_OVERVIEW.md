# Group B: Celery Configuration

> **Phase:** 03 - Core Backend Infrastructure  
> **SubPhase:** 08 - Celery Task Queue  
> **Group:** B of F  
> **Tasks Covered:** 15-30  
> **Group Goal:** Configure Celery application with proper settings

---

## Navigation

- **↑ Parent:** [00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [Group-A_Celery-Installation](../Group-A_Celery-Installation/)
- **→ Next Group:** [Group-C_Task-Infrastructure](../Group-C_Task-Infrastructure/)

---

## Group Overview

This group creates the Celery application configuration including the main celery.py file, settings file, and all necessary configuration options for the LankaCommerce Cloud platform.

### Key Components
- **celery.py:** Main Celery application file
- **settings/celery.py:** Celery configuration settings
- **Broker Configuration:** Redis as message broker
- **Result Backend:** Django database or Redis
- **Task Autodiscovery:** Automatic task registration

### Configuration Settings
| Setting | Purpose |
|---------|---------|
| CELERY_BROKER_URL | Redis broker connection |
| CELERY_RESULT_BACKEND | Task result storage |
| CELERY_ACCEPT_CONTENT | Allowed content types |
| CELERY_TASK_SERIALIZER | Task serialization format |
| CELERY_TIMEZONE | Timezone for scheduling |
| CELERY_TASK_TRACK_STARTED | Track task start state |
| CELERY_TASK_TIME_LIMIT | Maximum task runtime |

---

## Documents in This Group

| Document # | Document Name | Tasks Covered | Description |
|------------|---------------|---------------|-------------|
| DOC-01 | Celery App Creation | Tasks 15-19 | Create celery.py and __init__.py |
| DOC-02 | Celery Settings | Tasks 20-28 | All CELERY_* settings |
| DOC-03 | Settings Integration | Tasks 29-30 | Import and test configuration |

---

## Task Summary

| Task # | Task Name | Key Points |
|--------|-----------|------------|
| 15 | Create celery.py File | config/celery.py |
| 16 | Create Celery App Instance | Celery application object |
| 17 | Configure Django Settings | config_from_object call |
| 18 | Configure Task Autodiscover | autodiscover_tasks call |
| 19 | Update config __init__.py | Import celery_app |
| 20 | Create Celery Settings File | settings/celery.py |
| 21 | Configure CELERY_BROKER_URL | Redis URL |
| 22 | Configure CELERY_RESULT_BACKEND | django-db or redis |
| 23 | Configure CELERY_ACCEPT_CONTENT | JSON only |
| 24 | Configure CELERY_TASK_SERIALIZER | json |
| 25 | Configure CELERY_RESULT_SERIALIZER | json |
| 26 | Configure CELERY_TIMEZONE | Asia/Colombo |
| 27 | Configure CELERY_TASK_TRACK_STARTED | True |
| 28 | Configure CELERY_TASK_TIME_LIMIT | 30 minutes default |
| 29 | Import Celery Settings | In base.py settings |
| 30 | Test Celery Config | Verify configuration works |

---

## Execution Order

```
[Tasks 15-19: Celery App Creation]
        │
        ▼
[Tasks 20-28: Celery Settings]
        │
        ▼
[Tasks 29-30: Integration & Testing]
```

---

## Expected Deliverables

### File Structure
```
backend/
├── config/
│   ├── __init__.py (exports celery_app)
│   ├── celery.py (Celery app definition)
│   └── settings/
│       └── celery.py (Celery settings)
```

### Celery App Requirements
- Use namespace 'CELERY' for settings
- Load settings from Django configuration
- Autodiscover tasks from all installed apps
- Export celery_app from config __init__.py

### Settings Requirements
- CELERY_BROKER_URL from environment variable
- JSON serialization for security
- Asia/Colombo timezone for Sri Lanka
- Reasonable time limits for tasks

---

## Notes for AI Agents

1. **Namespace:** Use 'CELERY' prefix for settings in Django
2. **Broker URL:** Use environment variable, not hardcoded
3. **JSON Only:** Accept only JSON for security
4. **Timezone:** Asia/Colombo for Sri Lanka business hours
5. **Track Started:** Enable for progress monitoring
6. **Time Limit:** 30 minutes reasonable default
7. **Export App:** Must export from __init__.py for Django
