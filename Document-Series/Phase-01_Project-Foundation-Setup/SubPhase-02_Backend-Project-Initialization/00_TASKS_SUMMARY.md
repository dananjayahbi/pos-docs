# SubPhase 02: Backend Project Initialization - Tasks Summary

> **Phase:** 01 - Project Foundation & Setup  
> **SubPhase Index:** 02 of 08  
> **SubPhase Goal:** Set up Django project with modular settings and proper app structure  
> **Total Tasks:** 78 | **Status:** Planning  
> **Estimated Duration:** 4-5 hours

---

## Navigation

- **↑ Parent:** [00_SUBPHASES_SUMMARY.md](../00_SUBPHASES_SUMMARY.md)
- **← Previous SubPhase:** [SubPhase-01_Monorepo-Structure-Setup](../SubPhase-01_Monorepo-Structure-Setup/)
- **→ Next SubPhase:** [SubPhase-03_Frontend-Project-Initialization](../SubPhase-03_Frontend-Project-Initialization/)

---

## SubPhase Overview

This sub-phase initializes the Django backend project with a production-ready configuration. The setup includes modular settings, ASGI configuration for async support, and all core dependencies needed for the multi-tenant ERP platform.

### Key Outcomes
- Django 5.x project fully initialized
- Modular settings structure (base, local, production, test)
- ASGI configured for async/WebSocket support
- Core dependencies installed (DRF, django-tenants, Celery, etc.)
- Apps directory structure established
- Base management commands ready

### Technology Context
- **Django Version:** 5.x (latest stable)
- **Python Version:** 3.12+
- **API Framework:** Django REST Framework (DRF)
- **Multi-tenancy:** django-tenants
- **Async Support:** ASGI with Uvicorn/Daphne
- **Task Queue:** Celery with Redis

### Dependencies
- **Requires:** SubPhase-01 (Monorepo Structure Setup) completed
- **Backend directory structure must exist**

---

## Task Execution Order

```
TASK GROUP A: Virtual Environment Setup (Tasks 01-08)
        │
        ▼
TASK GROUP B: Django Project Creation (Tasks 09-18)
        │
        ▼
TASK GROUP C: Settings Module Structure (Tasks 19-35)
        │
        ▼
TASK GROUP D: Core Dependencies Installation (Tasks 36-50)
        │
        ▼
TASK GROUP E: Django Apps Directory Setup (Tasks 51-65)
        │
        ▼
TASK GROUP F: ASGI & Server Configuration (Tasks 66-72)
        │
        ▼
TASK GROUP G: Management Commands & Utilities (Tasks 73-78)
```

---

## Task Index

### Group A: Virtual Environment Setup (Tasks 01-08)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 01 | **Create Python Virtual Environment** | Create venv in backend directory using Python 3.12+ | SubPhase-01 | 🔴 Not Created |
| 02 | **Activate Virtual Environment** | Document activation commands for all OS | Task 01 | 🔴 Not Created |
| 03 | **Upgrade pip** | Ensure latest pip version is installed | Task 01 | 🔴 Not Created |
| 04 | **Install pip-tools** | Install pip-compile for dependency management | Task 03 | 🔴 Not Created |
| 05 | **Create requirements/base.in** | Base requirements input file | Task 04 | 🔴 Not Created |
| 06 | **Create requirements/local.in** | Development requirements input file | Task 05 | 🔴 Not Created |
| 07 | **Create requirements/production.in** | Production requirements input file | Task 05 | 🔴 Not Created |
| 08 | **Create requirements/test.in** | Test requirements input file | Task 05 | 🔴 Not Created |

---

### Group B: Django Project Creation (Tasks 09-18)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 09 | **Install Django** | Install Django 5.x in virtual environment | Task 01 | 🔴 Not Created |
| 10 | **Create Django Project** | Run django-admin startproject config . | Task 09 | 🔴 Not Created |
| 11 | **Rename settings.py** | Move to config/settings/base.py | Task 10 | 🔴 Not Created |
| 12 | **Create settings __init__.py** | Initialize settings module | Task 11 | 🔴 Not Created |
| 13 | **Update manage.py** | Configure for modular settings | Task 12 | 🔴 Not Created |
| 14 | **Update wsgi.py** | Configure for production settings | Task 10 | 🔴 Not Created |
| 15 | **Update asgi.py** | Configure for async support | Task 10 | 🔴 Not Created |
| 16 | **Create urls.py Structure** | Set up URL routing foundation | Task 10 | 🔴 Not Created |
| 17 | **Verify Django Installation** | Run check command to verify setup | Task 16 | 🔴 Not Created |
| 18 | **Create Initial Migration Test** | Ensure migrations work correctly | Task 17 | 🔴 Not Created |

---

### Group C: Settings Module Structure (Tasks 19-35)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 19 | **Create base.py - Imports Section** | Set up base imports and BASE_DIR | Task 11 | 🔴 Not Created |
| 20 | **Create base.py - Installed Apps** | Define INSTALLED_APPS (Django core) | Task 19 | 🔴 Not Created |
| 21 | **Create base.py - Middleware** | Configure middleware stack | Task 19 | 🔴 Not Created |
| 22 | **Create base.py - Templates** | Configure template engine | Task 19 | 🔴 Not Created |
| 23 | **Create base.py - Database Placeholder** | Database config (overridden per env) | Task 19 | 🔴 Not Created |
| 24 | **Create base.py - Auth Settings** | AUTH_PASSWORD_VALIDATORS | Task 19 | 🔴 Not Created |
| 25 | **Create base.py - Internationalization** | LANGUAGE_CODE, TIME_ZONE, USE_TZ | Task 19 | 🔴 Not Created |
| 26 | **Create base.py - Static Files** | STATIC_URL, STATICFILES_DIRS | Task 19 | 🔴 Not Created |
| 27 | **Create base.py - Media Files** | MEDIA_URL, MEDIA_ROOT | Task 19 | 🔴 Not Created |
| 28 | **Create base.py - Security Defaults** | CSRF, XSS, Content-Type options | Task 19 | 🔴 Not Created |
| 29 | **Create local.py - Debug Settings** | DEBUG=True, development overrides | Task 19 | 🔴 Not Created |
| 30 | **Create local.py - Database** | Local PostgreSQL/SQLite config | Task 29 | 🔴 Not Created |
| 31 | **Create local.py - Email** | Console email backend for dev | Task 29 | 🔴 Not Created |
| 32 | **Create production.py - Security** | HTTPS, HSTS, Secure cookies | Task 19 | 🔴 Not Created |
| 33 | **Create production.py - Database** | Production database config | Task 32 | 🔴 Not Created |
| 34 | **Create production.py - Caching** | Redis cache configuration | Task 32 | 🔴 Not Created |
| 35 | **Create test.py** | Test-specific settings (fast passwords, etc.) | Task 19 | 🔴 Not Created |

---

### Group D: Core Dependencies Installation (Tasks 36-50)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 36 | **Install djangorestframework** | Django REST Framework for API | Task 09 | 🔴 Not Created |
| 37 | **Install django-tenants** | Multi-tenancy with PostgreSQL schemas | Task 09 | 🔴 Not Created |
| 38 | **Install psycopg[binary]** | PostgreSQL adapter | Task 09 | 🔴 Not Created |
| 39 | **Install django-cors-headers** | CORS support for API | Task 09 | 🔴 Not Created |
| 40 | **Install django-environ** | Environment variable management | Task 09 | 🔴 Not Created |
| 41 | **Install django-filter** | DRF filtering support | Task 36 | 🔴 Not Created |
| 42 | **Install djangorestframework-simplejwt** | JWT authentication | Task 36 | 🔴 Not Created |
| 43 | **Install drf-spectacular** | OpenAPI/Swagger documentation | Task 36 | 🔴 Not Created |
| 44 | **Install celery** | Distributed task queue | Task 09 | 🔴 Not Created |
| 45 | **Install django-celery-beat** | Periodic tasks scheduling | Task 44 | 🔴 Not Created |
| 46 | **Install django-celery-results** | Celery result backend | Task 44 | 🔴 Not Created |
| 47 | **Install redis** | Redis client for caching/Celery | Task 09 | 🔴 Not Created |
| 48 | **Install Pillow** | Image processing | Task 09 | 🔴 Not Created |
| 49 | **Install whitenoise** | Static file serving | Task 09 | 🔴 Not Created |
| 50 | **Compile Requirements** | Generate .txt files from .in files | Task 36-49 | 🔴 Not Created |

---

### Group E: Django Apps Directory Setup (Tasks 51-65)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 51 | **Create apps/ Package** | Initialize apps directory as Python package | Task 10 | 🔴 Not Created |
| 52 | **Create apps/core/ App** | Core utilities and base models | Task 51 | 🔴 Not Created |
| 53 | **Create apps/tenants/ App** | Multi-tenancy models | Task 51 | 🔴 Not Created |
| 54 | **Create apps/users/ App** | User authentication and profiles | Task 51 | 🔴 Not Created |
| 55 | **Create apps/products/ Placeholder** | Product management (empty) | Task 51 | 🔴 Not Created |
| 56 | **Create apps/inventory/ Placeholder** | Inventory management (empty) | Task 51 | 🔴 Not Created |
| 57 | **Create apps/sales/ Placeholder** | Sales and orders (empty) | Task 51 | 🔴 Not Created |
| 58 | **Create apps/customers/ Placeholder** | Customer CRM (empty) | Task 51 | 🔴 Not Created |
| 59 | **Create apps/vendors/ Placeholder** | Vendor management (empty) | Task 51 | 🔴 Not Created |
| 60 | **Create apps/hr/ Placeholder** | HR and payroll (empty) | Task 51 | 🔴 Not Created |
| 61 | **Create apps/accounting/ Placeholder** | Accounting (empty) | Task 51 | 🔴 Not Created |
| 62 | **Create apps/webstore/ Placeholder** | Webstore API (empty) | Task 51 | 🔴 Not Created |
| 63 | **Create apps/integrations/ Placeholder** | Third-party integrations (empty) | Task 51 | 🔴 Not Created |
| 64 | **Create apps/reports/ Placeholder** | Reporting module (empty) | Task 51 | 🔴 Not Created |
| 65 | **Update INSTALLED_APPS** | Register all created apps in settings | Task 52-64 | 🔴 Not Created |

---

### Group F: ASGI & Server Configuration (Tasks 66-72)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 66 | **Install uvicorn** | ASGI server for development | Task 09 | 🔴 Not Created |
| 67 | **Install daphne** | ASGI server with WebSocket support | Task 09 | 🔴 Not Created |
| 68 | **Configure ASGI Application** | Set up asgi.py with channel layers | Task 15 | 🔴 Not Created |
| 69 | **Install channels** | Django Channels for WebSocket | Task 09 | 🔴 Not Created |
| 70 | **Configure Channel Layers** | Redis channel layer for WebSocket | Task 69 | 🔴 Not Created |
| 71 | **Create Procfile** | Define process types for deployment | Task 66 | 🔴 Not Created |
| 72 | **Create runtime.txt** | Specify Python version | Task 01 | 🔴 Not Created |

---

### Group G: Management Commands & Utilities (Tasks 73-78)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 73 | **Create wait_for_db Command** | Wait for database availability | Task 52 | 🔴 Not Created |
| 74 | **Create create_superuser Command** | Non-interactive superuser creation | Task 54 | 🔴 Not Created |
| 75 | **Create seed_data Command** | Initial data seeding command | Task 52 | 🔴 Not Created |
| 76 | **Create health_check View** | Health check endpoint for monitoring | Task 52 | 🔴 Not Created |
| 77 | **Create conftest.py** | Pytest configuration and fixtures | Task 35 | 🔴 Not Created |
| 78 | **Verify Full Setup** | Run tests and verify all configurations | Task 73-77 | 🔴 Not Created |

---

## Task Details

### Task 01: Create Python Virtual Environment

**Goal:** Isolate Python dependencies for the project.

**Implementation:**
```bash
cd backend
python3.12 -m venv .venv
```

**Verification:**
- [ ] `.venv/` directory exists
- [ ] Python version is 3.12+

---

### Task 10: Create Django Project

**Goal:** Initialize Django project with custom config directory.

**Implementation:**
```bash
cd backend
source .venv/bin/activate
django-admin startproject config .
```

**Result Structure:**
```
backend/
├── config/
│   ├── __init__.py
│   ├── asgi.py
│   ├── settings.py  # Will be restructured
│   ├── urls.py
│   └── wsgi.py
└── manage.py
```

---

### Task 11: Rename settings.py

**Goal:** Convert single settings file to modular structure.

**Steps:**
1. Create `config/settings/` directory
2. Move `settings.py` to `config/settings/base.py`
3. Create `__init__.py` in settings directory

**Result:**
```
config/
└── settings/
    ├── __init__.py
    ├── base.py
    ├── local.py
    ├── production.py
    └── test.py
```

---

### Task 20: Create base.py - Installed Apps

**Goal:** Define core Django apps.

**Content:**
```python
DJANGO_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
]

THIRD_PARTY_APPS = [
    'rest_framework',
    'corsheaders',
    'django_filters',
    'drf_spectacular',
    'django_celery_beat',
    'django_celery_results',
]

LOCAL_APPS = [
    'apps.core',
    'apps.tenants',
    'apps.users',
]

INSTALLED_APPS = DJANGO_APPS + THIRD_PARTY_APPS + LOCAL_APPS
```

---

### Task 37: Install django-tenants

**Goal:** Add multi-tenancy support.

**Command:**
```bash
pip install django-tenants
```

**Configuration Required:**
```python
# base.py
DATABASES = {
    'default': {
        'ENGINE': 'django_tenants.postgresql_backend',
        ...
    }
}

DATABASE_ROUTERS = [
    'django_tenants.routers.TenantSyncRouter',
]

TENANT_MODEL = 'tenants.Tenant'
TENANT_DOMAIN_MODEL = 'tenants.Domain'
```

---

### Task 52: Create apps/core/ App

**Goal:** Create core app with base models and utilities.

**Command:**
```bash
cd backend
python manage.py startapp core apps/core
```

**Contents:**
```
apps/core/
├── __init__.py
├── admin.py
├── apps.py
├── migrations/
├── models.py         # BaseModel, TimeStampedModel
├── mixins.py         # Common model mixins
├── utils.py          # Utility functions
├── validators.py     # Custom validators
└── tests/
```

---

### Task 68: Configure ASGI Application

**Goal:** Set up async support.

**Content (config/asgi.py):**
```python
import os
from django.core.asgi import get_asgi_application
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.auth import AuthMiddlewareStack

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings.production')

django_asgi_app = get_asgi_application()

application = ProtocolTypeRouter({
    'http': django_asgi_app,
    'websocket': AuthMiddlewareStack(
        URLRouter([
            # WebSocket routes will be added here
        ])
    ),
})
```

---

### Task 73: Create wait_for_db Command

**Goal:** Ensure database is available before running migrations.

**File:** `apps/core/management/commands/wait_for_db.py`

```python
import time
from django.core.management.base import BaseCommand
from django.db import connections
from django.db.utils import OperationalError

class Command(BaseCommand):
    help = 'Wait for database to be available'

    def handle(self, *args, **options):
        self.stdout.write('Waiting for database...')
        db_conn = None
        while not db_conn:
            try:
                db_conn = connections['default']
                db_conn.ensure_connection()
            except OperationalError:
                self.stdout.write('Database unavailable, waiting 1 second...')
                time.sleep(1)
        self.stdout.write(self.style.SUCCESS('Database available!'))
```

---

## Expected Final Structure

```
backend/
├── .venv/
├── config/
│   ├── __init__.py
│   ├── asgi.py
│   ├── urls.py
│   ├── wsgi.py
│   └── settings/
│       ├── __init__.py
│       ├── base.py
│       ├── local.py
│       ├── production.py
│       └── test.py
├── apps/
│   ├── __init__.py
│   ├── core/
│   ├── tenants/
│   ├── users/
│   ├── products/
│   ├── inventory/
│   ├── sales/
│   ├── customers/
│   ├── vendors/
│   ├── hr/
│   ├── accounting/
│   ├── webstore/
│   ├── integrations/
│   └── reports/
├── requirements/
│   ├── base.in
│   ├── base.txt
│   ├── local.in
│   ├── local.txt
│   ├── production.in
│   ├── production.txt
│   ├── test.in
│   └── test.txt
├── .env.example
├── conftest.py
├── manage.py
├── Procfile
├── pyproject.toml
├── README.md
└── runtime.txt
```

---

## Progress Tracking

| Metric | Count |
|--------|-------|
| Total Tasks | 78 |
| Tasks Completed | 0 |
| Tasks In Progress | 0 |
| Tasks Not Started | 78 |

**Last Updated:** 2026-01-17  
**Current Status:** Ready for task document creation

---

## Notes for AI Agents

1. **Execution Order:** Tasks must be executed in numerical order within groups
2. **Dependencies:** Verify SubPhase-01 is complete before starting
3. **Virtual Environment:** Always activate venv before running Python commands
4. **Settings Module:** Use DJANGO_SETTINGS_MODULE environment variable
5. **Git Commits:** Commit after completing each task group
6. **Verification:** Test Django runserver after completing this sub-phase
