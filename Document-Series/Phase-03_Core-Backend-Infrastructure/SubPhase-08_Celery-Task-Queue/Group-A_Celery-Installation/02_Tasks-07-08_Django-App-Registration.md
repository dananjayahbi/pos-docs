# Tasks 07-08: Django App Registration

> **Phase:** 03 - Core Backend Infrastructure  
> **SubPhase:** 08 - Celery Task Queue  
> **Group:** A - Celery Installation  
> **Document:** 02 of 04  
> **Tasks Covered:** 07, 08

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [01_Tasks-01-06_Package-Installation.md](01_Tasks-01-06_Package-Installation.md)
- **→ Next Document:** [03_Tasks-09-10_Redis-Verification.md](03_Tasks-09-10_Redis-Verification.md)

---

## Document Overview

This document covers the registration of Celery-related Django applications in the INSTALLED_APPS setting. These apps provide database models for periodic task scheduling and task result storage.

### Tasks in This Document
| Task # | Task Name | Complexity |
|--------|-----------|------------|
| 07 | Add django_celery_beat to INSTALLED_APPS | Simple |
| 08 | Add django_celery_results to INSTALLED_APPS | Simple |

---

## Task 07: Add django_celery_beat to INSTALLED_APPS

### Overview
Register the django_celery_beat application in Django's INSTALLED_APPS setting to enable database-backed periodic task scheduling with models for storing cron schedules.

### Dependencies
- Task 04: Install django-celery-beat

### Instructions

1. **Locate Django settings file**
   - Find the main settings file or settings module
   - For LCC: `backend/config/settings/base.py`
   - This is where INSTALLED_APPS is defined

2. **Add django_celery_beat to INSTALLED_APPS**
   - Add `'django_celery_beat'` to the INSTALLED_APPS list
   - Place it after Django's core apps but before custom apps
   - Maintain proper ordering for dependencies

3. **Verify app registration**
   - Ensure there are no typos in the app name
   - Check that the app is properly formatted as a string
   - Verify Django can discover the app

### INSTALLED_APPS Ordering
Place django_celery_beat in this order:
1. Django built-in apps (django.contrib.*)
2. Third-party apps (includes django_celery_beat)
3. LCC custom apps

### App Configuration Details
| Property | Value |
|----------|-------|
| App Name | django_celery_beat |
| Models Created | PeriodicTask, IntervalSchedule, CrontabSchedule, SolarSchedule, ClockedSchedule |
| Admin Interface | Yes (automatic) |
| Migrations Required | Yes |

### Database Models Provided
| Model | Purpose |
|-------|---------|
| PeriodicTask | Stores periodic task definitions |
| IntervalSchedule | Fixed interval schedules (every N seconds) |
| CrontabSchedule | Cron-style schedules (specific times) |
| SolarSchedule | Sun-based schedules (sunrise/sunset) |
| ClockedSchedule | One-time scheduled tasks |
| PeriodicTasks | Schedule change tracking |

### Expected Outcome
- django_celery_beat appears in INSTALLED_APPS
- Django can discover and load the app
- Models are available for migration
- Admin interface automatically registers

### Verification Checklist
- [ ] django_celery_beat is added to INSTALLED_APPS
- [ ] App name is spelled correctly
- [ ] App is in correct position in INSTALLED_APPS
- [ ] Django can import the app without errors
- [ ] Ready for migrations

---

## Task 08: Add django_celery_results to INSTALLED_APPS

### Overview
Register the django_celery_results application in Django's INSTALLED_APPS setting to enable database storage for Celery task results and execution history.

### Dependencies
- Task 05: Install django-celery-results

### Instructions

1. **Add django_celery_results to INSTALLED_APPS**
   - Add `'django_celery_results'` to the INSTALLED_APPS list
   - Place it immediately after django_celery_beat
   - Maintain consistent ordering with other Celery apps

2. **Verify app registration**
   - Ensure there are no typos in the app name
   - Check that the app is properly formatted as a string
   - Verify Django can discover the app

3. **Confirm both Celery apps are registered**
   - Both django_celery_beat and django_celery_results should be in INSTALLED_APPS
   - They should be adjacent for organizational clarity

### App Configuration Details
| Property | Value |
|----------|-------|
| App Name | django_celery_results |
| Models Created | TaskResult, GroupResult, ChordCounter |
| Admin Interface | Yes (automatic) |
| Migrations Required | Yes |

### Database Models Provided
| Model | Purpose |
|-------|---------|
| TaskResult | Stores individual task results |
| GroupResult | Stores results for task groups |
| ChordCounter | Tracks chord callback execution |

### Task Result Storage Fields
| Field | Purpose |
|-------|---------|
| task_id | Unique task identifier (UUID) |
| task_name | Full task name path |
| task_args | Task arguments (JSON) |
| task_kwargs | Task keyword arguments (JSON) |
| status | Task status (PENDING, STARTED, SUCCESS, FAILURE) |
| result | Task return value or exception |
| date_created | Task creation timestamp |
| date_done | Task completion timestamp |
| traceback | Error traceback (if failed) |

### Result Backend Configuration
After adding this app, you'll configure:
- `CELERY_RESULT_BACKEND = 'django-db'`
- Results stored in tenant schema for multi-tenancy
- Can query results using Django ORM

### Expected Outcome
- django_celery_results appears in INSTALLED_APPS
- Django can discover and load the app
- Models are available for migration
- Result backend can use database storage

### Verification Checklist
- [ ] django_celery_results is added to INSTALLED_APPS
- [ ] App name is spelled correctly
- [ ] App is positioned after django_celery_beat
- [ ] Django can import the app without errors
- [ ] Ready for migrations

---

## INSTALLED_APPS Structure

### Recommended Order
```
INSTALLED_APPS = [
    # Django core apps
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    
    # Third-party apps
    'rest_framework',
    'django_tenants',
    'corsheaders',
    'django_celery_beat',        # Added in Task 07
    'django_celery_results',     # Added in Task 08
    
    # LCC custom apps
    'apps.core',
    'apps.users',
    # ... other LCC apps
]
```

### Multi-Tenancy Considerations
| Aspect | Consideration |
|--------|---------------|
| Schema Isolation | Both apps work with django-tenants |
| Model Location | Models in shared schema or tenant schema |
| Admin Access | Admin should be tenant-aware |
| Migration Strategy | Apply to public and tenant schemas |

### Admin Interface Impact
Both apps provide automatic admin interfaces:
- **Beat Admin:** Manage periodic tasks, schedules
- **Results Admin:** View task execution history
- Access via `/admin/django_celery_beat/` and `/admin/django_celery_results/`

---

## Summary

### Tasks Completed in This Document
| Task # | Task Name | Key Deliverable |
|--------|-----------|-----------------|
| 07 | Add django_celery_beat to INSTALLED_APPS | Scheduling models available |
| 08 | Add django_celery_results to INSTALLED_APPS | Result storage models available |

### Apps Registered
- django_celery_beat (periodic task scheduling)
- django_celery_results (task result storage)

### Database Models Now Available
**From django_celery_beat:**
- PeriodicTask
- IntervalSchedule
- CrontabSchedule
- SolarSchedule
- ClockedSchedule

**From django_celery_results:**
- TaskResult
- GroupResult
- ChordCounter

### Next Steps
Proceed to [03_Tasks-09-10_Redis-Verification.md](03_Tasks-09-10_Redis-Verification.md) to verify Redis connection and prepare for migrations.

---

## Notes for AI Agents

1. **App Names:** Use exact strings 'django_celery_beat' and 'django_celery_results'
2. **Ordering Matters:** Place after Django core apps, before custom apps
3. **No Underscore Confusion:** Note the underscore in app names
4. **Multi-Tenancy:** Both apps work with django-tenants
5. **Migrations Next:** After registration, migrations must be generated and applied
6. **Admin Access:** Admin interfaces register automatically
7. **Settings Location:** Modify base.py settings file for all environments
