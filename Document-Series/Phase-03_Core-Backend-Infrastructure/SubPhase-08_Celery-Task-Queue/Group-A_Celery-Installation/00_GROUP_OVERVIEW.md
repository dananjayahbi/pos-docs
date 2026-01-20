# Group A: Celery Installation

> **Phase:** 03 - Core Backend Infrastructure  
> **SubPhase:** 08 - Celery Task Queue  
> **Group:** A of F  
> **Tasks Covered:** 01-14  
> **Group Goal:** Install and set up Celery with all required dependencies

---

## Navigation

- **↑ Parent:** [00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous Group:** None (First Group)
- **→ Next Group:** [Group-B_Celery-Configuration](../Group-B_Celery-Configuration/)

---

## Group Overview

This group handles the installation of Celery and all its dependencies including Redis client, Django Celery Beat for scheduling, Django Celery Results for result storage, and Flower for monitoring.

### Key Components
- **celery:** Core Celery package
- **redis:** Redis client library
- **django-celery-beat:** Database-backed periodic task scheduler
- **django-celery-results:** Store task results in Django database
- **flower:** Web-based monitoring tool

### Required Packages
| Package | Purpose |
|---------|---------|
| celery | Distributed task queue |
| redis | Redis client for Python |
| django-celery-beat | Periodic task scheduling |
| django-celery-results | Task result backend |
| flower | Task monitoring UI |

---

## Documents in This Group

| Document # | Document Name | Tasks Covered | Description |
|------------|---------------|---------------|-------------|
| DOC-01 | Package Installation | Tasks 01-06 | Install all Celery packages |
| DOC-02 | Django App Registration | Tasks 07-08 | Add to INSTALLED_APPS |
| DOC-03 | Redis Verification | Tasks 09-10 | Verify Redis connection |
| DOC-04 | Migrations | Tasks 11-14 | Generate and apply migrations |

---

## Task Summary

| Task # | Task Name | Key Points |
|--------|-----------|------------|
| 01 | Install celery Package | pip install celery |
| 02 | Pin Celery Version | Add version to requirements |
| 03 | Install redis Package | Redis client library |
| 04 | Install django-celery-beat | Scheduling extension |
| 05 | Install django-celery-results | Result backend |
| 06 | Install flower | Task monitoring |
| 07 | Add django_celery_beat to INSTALLED_APPS | Register beat app |
| 08 | Add django_celery_results to INSTALLED_APPS | Register results app |
| 09 | Verify Redis Running | Docker Redis service check |
| 10 | Test Redis Connection | Connection test |
| 11 | Update requirements.txt | All Celery dependencies |
| 12 | Generate Beat Migrations | Create beat migrations |
| 13 | Generate Results Migrations | Create results migrations |
| 14 | Apply Migrations | Run python manage.py migrate |

---

## Execution Order

```
[Tasks 01-06: Package Installation]
        │
        ▼
[Tasks 07-08: Django Registration]
        │
        ▼
[Tasks 09-10: Redis Verification]
        │
        ▼
[Tasks 11-14: Migrations]
```

---

## Expected Deliverables

### Requirements File Updates
- requirements/base.txt or requirements.txt should include all Celery packages with pinned versions

### Settings Update
- INSTALLED_APPS should include django_celery_beat and django_celery_results

### Database Tables Created
- django_celery_beat tables for periodic tasks
- django_celery_results tables for task results

### Redis Connection Verified
- Redis accessible from Django application
- Connection test passes

---

## Notes for AI Agents

1. **Pin Versions:** Always pin package versions for reproducibility
2. **Docker Redis:** Ensure Redis container is running
3. **Order Matters:** Install packages before adding to INSTALLED_APPS
4. **Migration Order:** Generate migrations after adding to INSTALLED_APPS
5. **Environment Variables:** Redis URL should come from environment
6. **Test Connection:** Verify Redis before proceeding to configuration
