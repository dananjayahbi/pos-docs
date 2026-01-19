# Group D: Core Dependencies Installation

> **Phase:** 01 - Project Foundation & Setup  
> **SubPhase:** 02 - Backend Project Initialization  
> **Group:** D of G  
> **Tasks Covered:** 36-50  
> **Group Goal:** Install all core Python dependencies for the ERP platform

---

## Navigation

- **↑ Parent:** [../00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [../Group-C_Settings-Module-Structure/](../Group-C_Settings-Module-Structure/)
- **→ Next Group:** [../Group-E_Django-Apps-Directory-Setup/](../Group-E_Django-Apps-Directory-Setup/)

---

## Group Overview

This group installs all the core Python packages required for the LankaCommerce Cloud ERP backend. These include Django REST Framework for API, django-tenants for multi-tenancy, Celery for task queues, and various supporting libraries.

### Key Outcomes
- Django REST Framework and extensions installed
- Multi-tenancy support via django-tenants
- Celery task queue with Redis backend
- JWT authentication configured
- API documentation with drf-spectacular
- All requirements compiled to lock files

### Technology Context
- **API Framework:** Django REST Framework (DRF)
- **Multi-tenancy:** django-tenants with PostgreSQL schemas
- **Task Queue:** Celery with Redis broker
- **Authentication:** JWT via djangorestframework-simplejwt
- **Documentation:** OpenAPI 3.0 via drf-spectacular

---

## Documents in This Group

| # | Document | Tasks | Description |
|---|----------|-------|-------------|
| 01 | 01_Tasks-36-40_Core-Packages.md | 36-40 | DRF, django-tenants, psycopg, CORS, django-environ |
| 02 | 02_Tasks-41-46_Extensions.md | 41-46 | django-filter, JWT, drf-spectacular, Celery packages |
| 03 | 03_Tasks-47-50_Support-Compile.md | 47-50 | Redis, Pillow, whitenoise, compile requirements |

---

## Task Summary

| Task # | Task Name | Dependencies | Complexity |
|--------|-----------|--------------|------------|
| 36 | Install djangorestframework | Task 09 | Simple |
| 37 | Install django-tenants | Task 09 | Simple |
| 38 | Install psycopg[binary] | Task 09 | Simple |
| 39 | Install django-cors-headers | Task 09 | Simple |
| 40 | Install django-environ | Task 09 | Simple |
| 41 | Install django-filter | Task 36 | Simple |
| 42 | Install djangorestframework-simplejwt | Task 36 | Simple |
| 43 | Install drf-spectacular | Task 36 | Simple |
| 44 | Install celery | Task 09 | Simple |
| 45 | Install django-celery-beat | Task 44 | Simple |
| 46 | Install django-celery-results | Task 44 | Simple |
| 47 | Install redis | Task 09 | Simple |
| 48 | Install Pillow | Task 09 | Simple |
| 49 | Install whitenoise | Task 09 | Simple |
| 50 | Compile Requirements | Tasks 36-49 | Medium |

---

## Execution Order

```
01_Tasks-36-40_Core-Packages.md
        │
        ▼
02_Tasks-41-46_Extensions.md
        │
        ▼
03_Tasks-47-50_Support-Compile.md
```

---

## Expected Deliverables

After completing this group:

```
backend/requirements/
├── base.in              # Updated with all dependencies
├── base.txt             # Compiled lock file
├── local.in             # Development dependencies
├── local.txt            # Compiled lock file
├── production.in        # Production dependencies
├── production.txt       # Compiled lock file
├── test.in              # Test dependencies
└── test.txt             # Compiled lock file
```

---

## Package Categories

**API & REST (Tasks 36, 41-43):**
- djangorestframework
- django-filter
- djangorestframework-simplejwt
- drf-spectacular

**Multi-tenancy (Task 37):**
- django-tenants

**Database (Task 38):**
- psycopg[binary] (PostgreSQL adapter)

**Configuration (Tasks 39-40):**
- django-cors-headers
- django-environ

**Task Queue (Tasks 44-46):**
- celery
- django-celery-beat
- django-celery-results

**Support (Tasks 47-49):**
- redis (client)
- Pillow (images)
- whitenoise (static files)

---

## Notes for AI Agents

1. **Dependencies:** Requires Django installed (Task 09)
2. **Install Order:** Some packages depend on DRF being installed first
3. **pip-compile:** Use to generate .txt files from .in files
4. **Binary Packages:** Use psycopg[binary] for easier installation
5. **Verification:** Run `pip list` to verify all packages installed
6. **Git Commit:** Commit both .in and .txt files
