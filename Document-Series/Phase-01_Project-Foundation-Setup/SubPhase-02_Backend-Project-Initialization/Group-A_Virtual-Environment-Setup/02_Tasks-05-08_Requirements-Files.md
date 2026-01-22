# Tasks 05-08: Requirements Files Setup

> **Phase:** 01 - Project Foundation & Setup  
> **SubPhase:** 02 - Backend Project Initialization  
> **Group:** A - Virtual Environment Setup  
> **Document:** 02 of 02  
> **Tasks Covered:** 05, 06, 07, 08

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [01_Tasks-01-04_Venv-Setup.md](01_Tasks-01-04_Venv-Setup.md)
- **→ Next Group:** [../Group-B_Django-Project-Creation/](../Group-B_Django-Project-Creation/)

---

## Document Overview

This document covers the creation of requirements input files (.in) for different environments using pip-tools workflow.

### Tasks in This Document
| Task # | Task Name | Complexity |
|--------|-----------|------------|
| 05 | Create requirements/base.in | Medium |
| 06 | Create requirements/local.in | Simple |
| 07 | Create requirements/production.in | Simple |
| 08 | Create requirements/test.in | Simple |

---

## Task 05: Create requirements/base.in

### Overview
Create the base requirements input file containing core dependencies used across all environments.

### Dependencies
- Task 04: Install pip-tools

### Instructions

1. **Create base.in file**
   - Create a file named `base.in` in `backend/requirements/`
   - This contains core dependencies needed everywhere

2. **Add Django and extensions**
   - Django 5.x as web framework
   - Django REST Framework for API
   - django-tenants for multi-tenancy

3. **Add database dependencies**
   - psycopg (PostgreSQL adapter, version 3)
   - dj-database-url for database configuration

4. **Add authentication packages**
   - djangorestframework-simplejwt for JWT auth
   - django-cors-headers for CORS handling

5. **Add utility packages**
   - python-decouple for environment variables
   - django-filter for queryset filtering
   - Pillow for image handling

6. **Add async/task packages**
   - celery for background tasks
   - redis for caching and broker

7. **Add comment headers**
   - Organize dependencies by category
   - Add comments explaining each section

### Core Dependencies Categories

| Category | Packages |
|----------|----------|
| **Django Core** | Django, djangorestframework |
| **Multi-Tenancy** | django-tenants |
| **Database** | psycopg[binary], dj-database-url |
| **Authentication** | djangorestframework-simplejwt, django-cors-headers |
| **Task Queue** | celery, redis |
| **Utilities** | python-decouple, django-filter, Pillow |

### Package Versions (Minimum)

| Package | Minimum Version | Reason |
|---------|-----------------|--------|
| Django | 5.0 | Latest LTS features |
| djangorestframework | 3.14 | Latest stable |
| django-tenants | 3.6 | PostgreSQL 15 support |
| psycopg | 3.1 | Async support, Python 3.12 |
| celery | 5.3 | Python 3.12 support |

### base.in File Structure

```
# Django Core
Django>=5.0,<6.0
djangorestframework>=3.14

# Multi-Tenancy
django-tenants>=3.6

# Database
psycopg[binary]>=3.1
dj-database-url>=2.1

# Authentication
djangorestframework-simplejwt>=5.3
django-cors-headers>=4.3

# Task Queue
celery>=5.3
redis>=5.0

# Utilities
python-decouple>=3.8
django-filter>=23.5
Pillow>=10.0
```

### Expected Outcome
```
backend/requirements/
├── base.in                  # Core dependencies
└── .gitkeep
```

### Verification Checklist
- [ ] `requirements/base.in` file exists
- [ ] Django and DRF are listed
- [ ] django-tenants is included
- [ ] Database packages are listed
- [ ] Comments organize dependencies

---

## Task 06: Create requirements/local.in

### Overview
Create the local development requirements file extending base with development-specific tools.

### Dependencies
- Task 05: Create requirements/base.in

### Instructions

1. **Create local.in file**
   - Create a file named `local.in` in `backend/requirements/`
   - This contains development-only dependencies

2. **Add base reference**
   - First line should reference base.in
   - All base dependencies will be included

3. **Add development server tools**
   - django-extensions for management commands
   - Werkzeug for enhanced development server

4. **Add debugging tools**
   - django-debug-toolbar for SQL and request inspection
   - ipdb for enhanced debugger

5. **Add code quality tools**
   - ruff for linting and formatting
   - pre-commit for git hooks

6. **Add documentation tools**
   - mkdocs for documentation (if needed locally)

### Development Dependencies Categories

| Category | Packages |
|----------|----------|
| **Development Server** | django-extensions, Werkzeug |
| **Debugging** | django-debug-toolbar, ipdb |
| **Code Quality** | ruff, pre-commit |
| **Shell Enhancement** | ipython |

### local.in File Structure

```
# Extend base requirements
-r base.in

# Development Server
django-extensions>=3.2
Werkzeug>=3.0

# Debugging
django-debug-toolbar>=4.2
ipdb>=0.13

# Code Quality
ruff>=0.1.0
pre-commit>=3.5

# Enhanced Shell
ipython>=8.0
```

### Why Separate Local Dependencies?

| Reason | Explanation |
|--------|-------------|
| **Security** | Debug tools not in production |
| **Performance** | Smaller production image |
| **Clarity** | Clear what's dev-only |
| **CI/CD** | Different install for each env |

### Expected Outcome
```
backend/requirements/
├── base.in
├── local.in                 # Development dependencies
└── .gitkeep
```

### Verification Checklist
- [ ] `requirements/local.in` file exists
- [ ] First line is `-r base.in`
- [ ] Debug toolbar is included
- [ ] Ruff is included for linting
- [ ] Comments organize dependencies

---

## Task 07: Create requirements/production.in

### Overview
Create the production requirements file extending base with production-specific packages.

### Dependencies
- Task 05: Create requirements/base.in

### Instructions

1. **Create production.in file**
   - Create a file named `production.in` in `backend/requirements/`
   - This contains production-only dependencies

2. **Add base reference**
   - First line should reference base.in
   - All base dependencies will be included

3. **Add WSGI server**
   - gunicorn as production WSGI server
   - Multiple workers for concurrency

4. **Add monitoring tools**
   - sentry-sdk for error tracking
   - django-health-check for health endpoints

5. **Add performance tools**
   - django-redis for Redis cache backend
   - hiredis for faster Redis parsing

6. **Add security tools**
   - django-csp for Content Security Policy
   - django-permissions-policy for security headers

### Production Dependencies Categories

| Category | Packages |
|----------|----------|
| **WSGI Server** | gunicorn |
| **Monitoring** | sentry-sdk, django-health-check |
| **Performance** | django-redis, hiredis |
| **Security** | django-csp, django-permissions-policy |
| **Static Files** | whitenoise |

### production.in File Structure

```
# Extend base requirements
-r base.in

# WSGI Server
gunicorn>=21.0

# Monitoring
sentry-sdk>=1.32
django-health-check>=3.17

# Performance
django-redis>=5.4
hiredis>=2.2

# Security
django-csp>=3.7
django-permissions-policy>=4.18

# Static Files
whitenoise>=6.6
```

### Why Separate Production Dependencies?

| Reason | Explanation |
|--------|-------------|
| **No Debug Tools** | No debug toolbar, etc. |
| **Performance** | Gunicorn instead of dev server |
| **Monitoring** | Sentry for error tracking |
| **Security** | Additional security headers |

### Expected Outcome
```
backend/requirements/
├── base.in
├── local.in
├── production.in            # Production dependencies
└── .gitkeep
```

### Verification Checklist
- [ ] `requirements/production.in` file exists
- [ ] First line is `-r base.in`
- [ ] Gunicorn is included
- [ ] Sentry SDK is included
- [ ] Whitenoise is included

---

## Task 08: Create requirements/test.in

### Overview
Create the test requirements file extending base with testing-specific packages.

### Dependencies
- Task 05: Create requirements/base.in

### Instructions

1. **Create test.in file**
   - Create a file named `test.in` in `backend/requirements/`
   - This contains testing-only dependencies

2. **Add base reference**
   - First line should reference base.in
   - All base dependencies will be included

3. **Add testing frameworks**
   - pytest as primary testing framework
   - pytest-django for Django integration

4. **Add test utilities**
   - factory-boy for test data factories
   - faker for fake data generation

5. **Add coverage tools**
   - pytest-cov for coverage reporting
   - coverage for detailed reports

6. **Add async testing**
   - pytest-asyncio for async tests
   - aiohttp for async HTTP testing

### Test Dependencies Categories

| Category | Packages |
|----------|----------|
| **Framework** | pytest, pytest-django |
| **Factories** | factory-boy, faker |
| **Coverage** | pytest-cov, coverage |
| **Async** | pytest-asyncio |
| **Utilities** | freezegun, responses |

### test.in File Structure

```
# Extend base requirements
-r base.in

# Testing Framework
pytest>=7.4
pytest-django>=4.5

# Test Factories
factory-boy>=3.3
faker>=19.0

# Coverage
pytest-cov>=4.1
coverage>=7.3

# Async Testing
pytest-asyncio>=0.21

# Test Utilities
freezegun>=1.2
responses>=0.23
```

### Why pytest Over Django's Test Runner?

| Feature | Django unittest | pytest |
|---------|-----------------|--------|
| **Fixtures** | setUp/tearDown | Powerful fixture system |
| **Assertions** | assertEqual, etc. | Plain assert |
| **Plugins** | Limited | Rich ecosystem |
| **Parametrization** | Manual | Built-in |
| **Output** | Basic | Detailed, colorful |

### Expected Outcome
```
backend/requirements/
├── base.in
├── local.in
├── production.in
├── test.in                  # Test dependencies
└── .gitkeep
```

### Verification Checklist
- [ ] `requirements/test.in` file exists
- [ ] First line is `-r base.in`
- [ ] pytest and pytest-django included
- [ ] factory-boy included
- [ ] coverage tools included

---

## Summary

### Tasks Completed in This Document
| Task # | Task Name | Key Deliverable |
|--------|-----------|-----------------|
| 05 | Create requirements/base.in | Core dependencies |
| 06 | Create requirements/local.in | Development dependencies |
| 07 | Create requirements/production.in | Production dependencies |
| 08 | Create requirements/test.in | Test dependencies |

### Final Requirements Structure
```
backend/requirements/
├── base.in                  # Core (Django, DRF, etc.)
├── local.in                 # Development (debug toolbar, ruff)
├── production.in            # Production (gunicorn, sentry)
├── test.in                  # Testing (pytest, factory-boy)
└── .gitkeep
```

### Requirements Inheritance

```
        base.in
       /   |   \
      /    |    \
local.in test.in production.in
```

### Compilation Workflow

After creating `.in` files, compile them to `.txt`:

| Command | Input | Output |
|---------|-------|--------|
| `pip-compile requirements/base.in` | base.in | base.txt |
| `pip-compile requirements/local.in` | local.in (+ base) | local.txt |
| `pip-compile requirements/production.in` | production.in (+ base) | production.txt |
| `pip-compile requirements/test.in` | test.in (+ base) | test.txt |

### All Dependencies Summary

| Environment | Key Packages |
|-------------|--------------|
| **Base** | Django 5.x, DRF, django-tenants, psycopg, celery, redis |
| **Local** | debug-toolbar, ruff, ipdb, django-extensions |
| **Production** | gunicorn, sentry-sdk, whitenoise, django-health-check |
| **Test** | pytest, factory-boy, faker, pytest-cov |

---

## Group A Complete

### All Group A Tasks Completed
| Task # | Task Name | Status |
|--------|-----------|--------|
| 01 | Create Python Virtual Environment | ✅ Complete |
| 02 | Activate Virtual Environment | ✅ Complete |
| 03 | Upgrade pip | ✅ Complete |
| 04 | Install pip-tools | ✅ Complete |
| 05 | Create requirements/base.in | ✅ Complete |
| 06 | Create requirements/local.in | ✅ Complete |
| 07 | Create requirements/production.in | ✅ Complete |
| 08 | Create requirements/test.in | ✅ Complete |

### Group A Deliverables
```
backend/
├── .venv/
│   ├── bin/ (Scripts/)
│   │   ├── activate
│   │   ├── pip
│   │   ├── pip-compile
│   │   ├── pip-sync
│   │   └── python
│   └── pyvenv.cfg
└── requirements/
    ├── base.in
    ├── local.in
    ├── production.in
    ├── test.in
    └── .gitkeep
```

### Next Steps
Proceed to [Group B: Django Project Creation](../Group-B_Django-Project-Creation/) to initialize the Django project.

---

## Notes for AI Agents

1. **pip-tools Workflow:** .in files are human-written, .txt files are generated
2. **Compilation:** Run pip-compile after creating .in files to generate .txt
3. **Git Strategy:** Commit both .in and .txt files
4. **Version Ranges:** Use `>=X.Y,<Z.0` for major version constraints
5. **Git Commit:** After Group A complete, commit with message: "feat(backend): Set up virtual environment and requirements structure"
