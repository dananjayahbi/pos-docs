# Tasks 41-46: Extensions Installation

> **Phase:** 01 - Project Foundation & Setup  
> **SubPhase:** 02 - Backend Project Initialization  
> **Group:** D - Core Dependencies Installation  
> **Document:** 02 of 03  
> **Tasks Covered:** 41, 42, 43, 44, 45, 46

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [01_Tasks-36-40_Core-Packages.md](01_Tasks-36-40_Core-Packages.md)
- **→ Next Document:** [03_Tasks-47-50_Support-Compile.md](03_Tasks-47-50_Support-Compile.md)

---

## Document Overview

This document covers installing DRF extensions (filtering, JWT, OpenAPI) and Celery packages for task queue functionality.

### Tasks in This Document
| Task # | Task Name | Complexity |
|--------|-----------|------------|
| 41 | Install django-filter | Simple |
| 42 | Install djangorestframework-simplejwt | Simple |
| 43 | Install drf-spectacular | Simple |
| 44 | Install celery | Simple |
| 45 | Install django-celery-beat | Simple |
| 46 | Install django-celery-results | Simple |

---

## Task 41: Install django-filter

### Overview
Install django-filter for queryset filtering in Django REST Framework endpoints.

### Dependencies
- Task 36: Install djangorestframework

### Instructions

1. **Add to base.in**
   - Add django-filter to requirements/base.in

2. **Add to INSTALLED_APPS**
   - Add 'django_filters' to THIRD_PARTY_APPS

3. **Configure DRF integration**
   - Add to REST_FRAMEWORK DEFAULT_FILTER_BACKENDS

### Package Information

| Package | Version | Purpose |
|---------|---------|---------|
| `django-filter` | >=23.5 | Query filtering |

### DRF Integration

Add to REST_FRAMEWORK settings:

| Setting | Value |
|---------|-------|
| `DEFAULT_FILTER_BACKENDS` | ['django_filters.rest_framework.DjangoFilterBackend'] |

### Filter Features

| Feature | Description |
|---------|-------------|
| Field filters | Filter by exact, contains, gt, lt |
| Search | Text search across fields |
| Ordering | Sort by fields |
| Custom filters | Complex query logic |

### Usage Example (Reference)

FilterSets allow:
- Filtering products by category
- Searching orders by customer
- Date range queries
- Price range filtering

### Expected Outcome
- django-filter installed
- DRF filter backend configured

### Verification Checklist
- [ ] django-filter in base.in
- [ ] django_filters in INSTALLED_APPS
- [ ] Filter backend in REST_FRAMEWORK

---

## Task 42: Install djangorestframework-simplejwt

### Overview
Install Simple JWT for JSON Web Token authentication in the API.

### Dependencies
- Task 36: Install djangorestframework

### Instructions

1. **Add to base.in**
   - Add djangorestframework-simplejwt to requirements/base.in

2. **Add to INSTALLED_APPS**
   - Add 'rest_framework_simplejwt' to THIRD_PARTY_APPS

3. **Configure authentication**
   - Add JWTAuthentication to DEFAULT_AUTHENTICATION_CLASSES

4. **Add SIMPLE_JWT settings**
   - Configure token lifetimes
   - Set token signing algorithm

### Package Information

| Package | Version | Purpose |
|---------|---------|---------|
| `djangorestframework-simplejwt` | >=5.3 | JWT authentication |

### Authentication Configuration

Add to REST_FRAMEWORK:

| Setting | Value |
|---------|-------|
| `DEFAULT_AUTHENTICATION_CLASSES` | JWTAuthentication, SessionAuthentication |

### SIMPLE_JWT Settings

| Setting | Value | Purpose |
|---------|-------|---------|
| `ACCESS_TOKEN_LIFETIME` | 15 minutes | Short-lived access |
| `REFRESH_TOKEN_LIFETIME` | 7 days | Longer refresh |
| `ROTATE_REFRESH_TOKENS` | True | New refresh on use |
| `BLACKLIST_AFTER_ROTATION` | True | Invalidate old |
| `ALGORITHM` | HS256 | Signing algorithm |

### Token Types

| Token | Purpose | Lifetime |
|-------|---------|----------|
| Access | API authentication | 15 min |
| Refresh | Get new access | 7 days |

### JWT URL Patterns (Preview)

Will add endpoints:
- `/api/v1/auth/token/` - Obtain token pair
- `/api/v1/auth/token/refresh/` - Refresh access token
- `/api/v1/auth/token/verify/` - Verify token

### Expected Outcome
- JWT authentication configured
- Token settings defined

### Verification Checklist
- [ ] simplejwt in base.in
- [ ] rest_framework_simplejwt in INSTALLED_APPS
- [ ] JWTAuthentication in REST_FRAMEWORK
- [ ] SIMPLE_JWT settings added

---

## Task 43: Install drf-spectacular

### Overview
Install drf-spectacular for OpenAPI 3.0 schema generation and API documentation.

### Dependencies
- Task 36: Install djangorestframework

### Instructions

1. **Add to base.in**
   - Add drf-spectacular to requirements/base.in

2. **Add to INSTALLED_APPS**
   - Add 'drf_spectacular' to THIRD_PARTY_APPS

3. **Configure DRF schema class**
   - Set DEFAULT_SCHEMA_CLASS to AutoSchema

4. **Add SPECTACULAR_SETTINGS**
   - Configure API title, version, description

### Package Information

| Package | Version | Purpose |
|---------|---------|---------|
| `drf-spectacular` | >=0.26 | OpenAPI documentation |

### DRF Schema Configuration

Add to REST_FRAMEWORK:

| Setting | Value |
|---------|-------|
| `DEFAULT_SCHEMA_CLASS` | 'drf_spectacular.openapi.AutoSchema' |

### SPECTACULAR_SETTINGS

| Setting | Value | Purpose |
|---------|-------|---------|
| `TITLE` | LankaCommerce Cloud API | API title |
| `DESCRIPTION` | Multi-tenant ERP API | Description |
| `VERSION` | 1.0.0 | API version |
| `SERVE_INCLUDE_SCHEMA` | False | Schema security |

### Documentation Endpoints (Preview)

Will add endpoints:
- `/api/schema/` - OpenAPI JSON/YAML
- `/api/docs/` - Swagger UI
- `/api/redoc/` - ReDoc interface

### Documentation Features

| Feature | Description |
|---------|-------------|
| Auto-generation | Schema from code |
| Swagger UI | Interactive testing |
| ReDoc | Clean documentation |
| Export | OpenAPI JSON/YAML |

### Expected Outcome
- OpenAPI schema generation ready
- API documentation configured

### Verification Checklist
- [ ] drf-spectacular in base.in
- [ ] drf_spectacular in INSTALLED_APPS
- [ ] DEFAULT_SCHEMA_CLASS configured
- [ ] SPECTACULAR_SETTINGS added

---

## Task 44: Install celery

### Overview
Install Celery for distributed task queue and background job processing.

### Dependencies
- Task 09: Install Django (Group B)

### Instructions

1. **Add to base.in**
   - Add celery to requirements/base.in
   - Specify version 5.x

2. **Create celery.py in config/**
   - Create Celery application configuration
   - Auto-discover tasks from apps

3. **Update config/__init__.py**
   - Import celery app on Django start

4. **Add CELERY settings to base.py**
   - Configure broker and result backend
   - Set task settings

### Package Information

| Package | Version | Purpose |
|---------|---------|---------|
| `celery` | >=5.3 | Task queue |

### Celery Configuration

| Setting | Value | Purpose |
|---------|-------|---------|
| `CELERY_BROKER_URL` | redis://redis:6379/0 | Message broker |
| `CELERY_RESULT_BACKEND` | redis://redis:6379/0 | Result storage |
| `CELERY_ACCEPT_CONTENT` | ['json'] | Content types |
| `CELERY_TASK_SERIALIZER` | json | Serialization |
| `CELERY_TIMEZONE` | Asia/Colombo | Task timezone |

### Celery App Structure

Create `config/celery.py`:
- Initialize Celery app
- Load config from Django settings
- Auto-discover tasks

### Update config/__init__.py

Import celery app:
- Ensures app loads on Django startup
- Makes @shared_task decorator work

### Use Cases

| Task Type | Example |
|-----------|---------|
| Email sending | Order confirmations |
| Report generation | Daily sales reports |
| Data processing | Inventory sync |
| Scheduled jobs | Nightly cleanup |

### Expected Outcome
- Celery configured
- Ready for background tasks

### Verification Checklist
- [ ] celery in base.in
- [ ] config/celery.py created
- [ ] CELERY settings in base.py
- [ ] config/__init__.py updated

---

## Task 45: Install django-celery-beat

### Overview
Install django-celery-beat for database-backed periodic task scheduling.

### Dependencies
- Task 44: Install celery

### Instructions

1. **Add to base.in**
   - Add django-celery-beat to requirements/base.in

2. **Add to INSTALLED_APPS**
   - Add 'django_celery_beat' to THIRD_PARTY_APPS

3. **Note: Run migrations later**
   - Creates database tables for schedules
   - Will run in database setup phase

4. **Configure beat scheduler**
   - Set CELERY_BEAT_SCHEDULER

### Package Information

| Package | Version | Purpose |
|---------|---------|---------|
| `django-celery-beat` | >=2.5 | Periodic tasks |

### Settings Configuration

| Setting | Value |
|---------|-------|
| `CELERY_BEAT_SCHEDULER` | 'django_celery_beat.schedulers:DatabaseScheduler' |

### Database Tables Created

| Table | Purpose |
|-------|---------|
| `django_celery_beat_periodictask` | Scheduled tasks |
| `django_celery_beat_crontabschedule` | Cron schedules |
| `django_celery_beat_intervalschedule` | Interval schedules |
| `django_celery_beat_solarschedule` | Solar schedules |

### Periodic Task Types

| Type | Example |
|------|---------|
| **Crontab** | Run at 2 AM daily |
| **Interval** | Every 5 minutes |
| **Solar** | At sunrise/sunset |

### Admin Integration

django-celery-beat adds:
- Periodic tasks in admin
- Schedule management
- Task enable/disable

### Expected Outcome
- Periodic task scheduling ready
- Admin interface available

### Verification Checklist
- [ ] django-celery-beat in base.in
- [ ] django_celery_beat in INSTALLED_APPS
- [ ] CELERY_BEAT_SCHEDULER configured

---

## Task 46: Install django-celery-results

### Overview
Install django-celery-results to store task results in the database.

### Dependencies
- Task 44: Install celery

### Instructions

1. **Add to base.in**
   - Add django-celery-results to requirements/base.in

2. **Add to INSTALLED_APPS**
   - Add 'django_celery_results' to THIRD_PARTY_APPS

3. **Configure result backend**
   - Set CELERY_RESULT_BACKEND to django-db

4. **Note: Run migrations later**
   - Creates task result tables

### Package Information

| Package | Version | Purpose |
|---------|---------|---------|
| `django-celery-results` | >=2.5 | Task result storage |

### Settings Configuration

| Setting | Value |
|---------|-------|
| `CELERY_RESULT_BACKEND` | 'django-db' |
| `CELERY_RESULT_EXTENDED` | True |

### Database Tables Created

| Table | Purpose |
|-------|---------|
| `django_celery_results_taskresult` | Task results |
| `django_celery_results_groupresult` | Group results |
| `django_celery_results_chordcounter` | Chord tracking |

### Result Tracking Benefits

| Benefit | Description |
|---------|-------------|
| Persistence | Results survive restarts |
| Queryable | Filter, search results |
| Admin view | View in Django admin |
| Debugging | Track failed tasks |

### Expected Outcome
- Task results stored in database
- Queryable task history

### Verification Checklist
- [ ] django-celery-results in base.in
- [ ] django_celery_results in INSTALLED_APPS
- [ ] CELERY_RESULT_BACKEND configured

---

## Summary

### Tasks Completed in This Document
| Task # | Task Name | Key Deliverable |
|--------|-----------|-----------------|
| 41 | Install django-filter | Query filtering |
| 42 | Install djangorestframework-simplejwt | JWT auth |
| 43 | Install drf-spectacular | API documentation |
| 44 | Install celery | Task queue |
| 45 | Install django-celery-beat | Periodic tasks |
| 46 | Install django-celery-results | Result storage |

### Updated base.in (Extensions)

```
# DRF Extensions
django-filter>=23.5
djangorestframework-simplejwt>=5.3
drf-spectacular>=0.26

# Task Queue
celery>=5.3
django-celery-beat>=2.5
django-celery-results>=2.5
```

### Updated THIRD_PARTY_APPS

```python
THIRD_PARTY_APPS = [
    'rest_framework',
    'corsheaders',
    'django_filters',
    'rest_framework_simplejwt',
    'drf_spectacular',
    'django_celery_beat',
    'django_celery_results',
]
```

### Next Steps
Proceed to [03_Tasks-47-50_Support-Compile.md](03_Tasks-47-50_Support-Compile.md) for support packages and compilation.

---

## Notes for AI Agents

1. **Filter Backend:** Add to REST_FRAMEWORK DEFAULT_FILTER_BACKENDS
2. **JWT:** Configure SIMPLE_JWT settings with proper lifetimes
3. **Celery:** Create config/celery.py file
4. **Migrations:** Beat and results need migrations (later)
5. **Git Commit:** Do NOT commit yet - complete all Group D tasks first
