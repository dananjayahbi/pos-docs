# Tasks 26-30: Backend Support Directories

> **Phase:** 01 - Project Foundation & Setup  
> **SubPhase:** 01 - Monorepo Structure Setup  
> **Group:** C - Backend Directory Scaffold  
> **Document:** 02 of 03  
> **Tasks Covered:** 26, 27, 28, 29, 30

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [01_Tasks-21-25_Core-Directories.md](01_Tasks-21-25_Core-Directories.md)
- **→ Next Document:** [03_Tasks-31-35_Config-Files.md](03_Tasks-31-35_Config-Files.md)

---

## Document Overview

This document covers the creation of backend support directories for templates, testing, fixtures, localization, and dependency management.

### Tasks in This Document
| Task # | Task Name | Complexity |
|--------|-----------|------------|
| 26 | Create backend/templates/ Directory | Simple |
| 27 | Create backend/tests/ Directory | Simple |
| 28 | Create backend/fixtures/ Directory | Simple |
| 29 | Create backend/locale/ Directory | Simple |
| 30 | Create backend/requirements/ Directory | Simple |

---

## Task 26: Create backend/templates/ Directory

### Overview
Create the templates directory for Django server-rendered templates used in emails, admin customizations, and error pages.

### Dependencies
- Task 11: Create backend/ Directory (Group B)

### Instructions

1. **Create the templates directory**
   - Create a directory named `templates/` inside `backend/`
   - This holds Django HTML templates

2. **Add .gitkeep file**
   - Create an empty `.gitkeep` file inside the directory
   - This ensures Git tracks the empty directory

3. **Purpose of this directory**
   - Email templates (HTML and plain text)
   - Django admin customizations
   - Error pages (404, 500)
   - PDF generation templates
   - Any server-rendered HTML

### Planned Subdirectories Reference

| Subdirectory (Future) | Purpose |
|----------------------|---------|
| `emails/` | Email templates (transactional, marketing) |
| `admin/` | Django admin overrides |
| `errors/` | Custom error pages (404, 500, 403) |
| `pdf/` | PDF generation templates (invoices, receipts) |
| `partials/` | Reusable template fragments |

### Email Template Categories

| Category | Examples |
|----------|----------|
| **Authentication** | Welcome, password reset, email verification |
| **Orders** | Order confirmation, shipping notification |
| **Payments** | Payment receipt, refund notification |
| **Notifications** | Low stock alert, new review |
| **Marketing** | Promotional, abandoned cart |

### Sri Lanka-Specific Templates
- Support for Sinhala content in emails
- LKR (₨) currency formatting
- Local date/time formatting (Asia/Colombo)
- Right-to-left (RTL) support not needed (Sinhala is LTR)

### Expected Outcome
```
backend/
├── apps/
│   └── .gitkeep
├── config/
│   └── .gitkeep
├── core/
│   └── .gitkeep
├── media/
│   └── .gitkeep
├── static/
│   └── .gitkeep
├── templates/
│   └── .gitkeep
└── .gitkeep
```

### Verification Checklist
- [ ] `backend/templates/` directory exists
- [ ] `.gitkeep` file exists inside `templates/`
- [ ] Directory is tracked by Git

---

## Task 27: Create backend/tests/ Directory

### Overview
Create the tests directory for backend unit tests, integration tests, and test utilities.

### Dependencies
- Task 11: Create backend/ Directory (Group B)

### Instructions

1. **Create the tests directory**
   - Create a directory named `tests/` inside `backend/`
   - This holds all backend test files

2. **Add .gitkeep file**
   - Create an empty `.gitkeep` file inside the directory
   - This ensures Git tracks the empty directory

3. **Purpose of this directory**
   - Unit tests for models, serializers, views
   - Integration tests for APIs
   - Test configuration and fixtures
   - Test utilities and helpers
   - Factory classes for test data

### Planned Subdirectories Reference

| Subdirectory (Future) | Purpose |
|----------------------|---------|
| `unit/` | Unit tests by app |
| `integration/` | API integration tests |
| `factories/` | Factory Boy factories |
| `conftest.py` | Pytest fixtures and configuration |
| `utils/` | Test helper utilities |

### Testing Framework Stack

| Tool | Purpose |
|------|---------|
| **pytest** | Test runner and framework |
| **pytest-django** | Django integration for pytest |
| **pytest-cov** | Code coverage reporting |
| **factory_boy** | Test data generation |
| **faker** | Fake data generation |
| **pytest-asyncio** | Async test support |
| **responses** | Mock HTTP requests |

### Test File Naming Convention
| Pattern | Purpose |
|---------|---------|
| `test_*.py` | Test files (pytest discovery) |
| `*_test.py` | Alternative test file pattern |
| `conftest.py` | Pytest fixtures (per-directory) |
| `factories.py` | Factory definitions |

### Expected Outcome
```
backend/
├── apps/
│   └── .gitkeep
├── config/
│   └── .gitkeep
├── core/
│   └── .gitkeep
├── media/
│   └── .gitkeep
├── static/
│   └── .gitkeep
├── templates/
│   └── .gitkeep
├── tests/
│   └── .gitkeep
└── .gitkeep
```

### Verification Checklist
- [ ] `backend/tests/` directory exists
- [ ] `.gitkeep` file exists inside `tests/`
- [ ] Directory is tracked by Git

---

## Task 28: Create backend/fixtures/ Directory

### Overview
Create the fixtures directory for test data fixtures and database seed data.

### Dependencies
- Task 11: Create backend/ Directory (Group B)

### Instructions

1. **Create the fixtures directory**
   - Create a directory named `fixtures/` inside `backend/`
   - This holds JSON/YAML fixtures for data loading

2. **Add .gitkeep file**
   - Create an empty `.gitkeep` file inside the directory
   - This ensures Git tracks the empty directory

3. **Purpose of this directory**
   - Initial seed data for development
   - Test fixtures for automated tests
   - Sample data for demos
   - Default configuration data

### Planned Fixture Categories

| Category | Purpose | Format |
|----------|---------|--------|
| **users** | Demo users and superuser | JSON |
| **products** | Sample product catalog | JSON |
| **categories** | Product categories | JSON |
| **settings** | Default system settings | JSON |
| **locations** | Sri Lanka regions/districts | JSON |
| **taxes** | Sri Lanka tax configurations | JSON |

### Sri Lanka-Specific Fixtures

| Fixture | Content |
|---------|---------|
| `districts.json` | All 25 districts of Sri Lanka |
| `provinces.json` | All 9 provinces |
| `postal_codes.json` | Common postal codes |
| `banks.json` | Sri Lankan banks for payments |
| `tax_rates.json` | VAT and other tax rates |

### Fixture Loading Commands
- Development seeding: `python manage.py loaddata <fixture>`
- Test fixtures: Loaded via pytest fixtures
- Order matters: Load dependencies first (users before orders)

### Expected Outcome
```
backend/
├── apps/
│   └── .gitkeep
├── config/
│   └── .gitkeep
├── core/
│   └── .gitkeep
├── fixtures/
│   └── .gitkeep
├── media/
│   └── .gitkeep
├── static/
│   └── .gitkeep
├── templates/
│   └── .gitkeep
├── tests/
│   └── .gitkeep
└── .gitkeep
```

### Verification Checklist
- [ ] `backend/fixtures/` directory exists
- [ ] `.gitkeep` file exists inside `fixtures/`
- [ ] Directory is tracked by Git

---

## Task 29: Create backend/locale/ Directory

### Overview
Create the locale directory for internationalization (i18n) and translation files supporting English, Sinhala, and Tamil.

### Dependencies
- Task 11: Create backend/ Directory (Group B)

### Instructions

1. **Create the locale directory**
   - Create a directory named `locale/` inside `backend/`
   - This holds translation files for multi-language support

2. **Add .gitkeep file**
   - Create an empty `.gitkeep` file inside the directory
   - This ensures Git tracks the empty directory

3. **Purpose of this directory**
   - Django translation files (.po, .mo)
   - Support for English, Sinhala, Tamil
   - Sinhaglish transliteration mappings
   - Localized content and messages

### Language Support

| Language | Code | Script | Status |
|----------|------|--------|--------|
| English | `en` | Latin | Primary |
| Sinhala | `si` | Sinhala | Supported |
| Tamil | `ta` | Tamil | Supported |
| Sinhaglish | - | Latin (transliteration) | Search feature |

### Planned Directory Structure

```
locale/
├── en/
│   └── LC_MESSAGES/
│       ├── django.po
│       └── django.mo
├── si/
│   └── LC_MESSAGES/
│       ├── django.po
│       └── django.mo
└── ta/
    └── LC_MESSAGES/
        ├── django.po
        └── django.mo
```

### Translation Workflow
1. Mark strings with `gettext()` or `_()` in Python code
2. Run `python manage.py makemessages -l si` to extract strings
3. Translate strings in `.po` files
4. Run `python manage.py compilemessages` to create `.mo` files

### Sinhaglish Context
- Sinhaglish is romanized Sinhala (e.g., "sari" for සාරි)
- Used primarily for search functionality
- Not a translation - handled separately via AI/mapping

### Expected Outcome
```
backend/
├── apps/
│   └── .gitkeep
├── config/
│   └── .gitkeep
├── core/
│   └── .gitkeep
├── fixtures/
│   └── .gitkeep
├── locale/
│   └── .gitkeep
├── media/
│   └── .gitkeep
├── static/
│   └── .gitkeep
├── templates/
│   └── .gitkeep
├── tests/
│   └── .gitkeep
└── .gitkeep
```

### Verification Checklist
- [ ] `backend/locale/` directory exists
- [ ] `.gitkeep` file exists inside `locale/`
- [ ] Directory is tracked by Git

---

## Task 30: Create backend/requirements/ Directory

### Overview
Create the requirements directory for split Python dependency files organized by environment.

### Dependencies
- Task 11: Create backend/ Directory (Group B)

### Instructions

1. **Create the requirements directory**
   - Create a directory named `requirements/` inside `backend/`
   - This holds split requirements.txt files

2. **Add .gitkeep file**
   - Create an empty `.gitkeep` file inside the directory
   - This ensures Git tracks the empty directory

3. **Purpose of this directory**
   - Separate requirements by environment
   - Easier dependency management
   - Clear distinction between dev and production deps
   - Documentation of all dependencies

### Planned Requirements Files

| File (Future) | Purpose | Inherits From |
|---------------|---------|---------------|
| `base.txt` | Core dependencies for all environments | - |
| `development.txt` | Development tools and utilities | base.txt |
| `production.txt` | Production-specific dependencies | base.txt |
| `testing.txt` | Testing framework dependencies | base.txt |
| `docs.txt` | Documentation generation tools | base.txt |

### Requirements File Pattern
```
# requirements/development.txt
-r base.txt

# Development-only packages
django-debug-toolbar==4.x.x
ipython==8.x.x
```

### Core Dependencies (base.txt - Planned)

| Package | Purpose |
|---------|---------|
| Django | Web framework |
| djangorestframework | REST API framework |
| django-tenants | Multi-tenancy support |
| psycopg | PostgreSQL adapter |
| redis | Redis client |
| celery | Task queue |
| django-cors-headers | CORS handling |
| django-filter | API filtering |
| drf-spectacular | API documentation |
| python-dotenv | Environment variables |

### Development Dependencies (development.txt - Planned)

| Package | Purpose |
|---------|---------|
| django-debug-toolbar | Debug panel |
| ipython | Enhanced Python shell |
| pytest | Testing framework |
| pytest-django | Django pytest plugin |
| factory-boy | Test data factories |
| black | Code formatter |
| flake8 | Linter |
| isort | Import sorter |
| pre-commit | Git hooks |

### Expected Outcome
```
backend/
├── apps/
│   └── .gitkeep
├── config/
│   └── .gitkeep
├── core/
│   └── .gitkeep
├── fixtures/
│   └── .gitkeep
├── locale/
│   └── .gitkeep
├── media/
│   └── .gitkeep
├── requirements/
│   └── .gitkeep
├── static/
│   └── .gitkeep
├── templates/
│   └── .gitkeep
├── tests/
│   └── .gitkeep
└── .gitkeep
```

### Verification Checklist
- [ ] `backend/requirements/` directory exists
- [ ] `.gitkeep` file exists inside `requirements/`
- [ ] Directory is tracked by Git

---

## Summary

### Tasks Completed in This Document
| Task # | Task Name | Key Deliverable |
|--------|-----------|-----------------|
| 26 | Create backend/templates/ Directory | `backend/templates/` with `.gitkeep` |
| 27 | Create backend/tests/ Directory | `backend/tests/` with `.gitkeep` |
| 28 | Create backend/fixtures/ Directory | `backend/fixtures/` with `.gitkeep` |
| 29 | Create backend/locale/ Directory | `backend/locale/` with `.gitkeep` |
| 30 | Create backend/requirements/ Directory | `backend/requirements/` with `.gitkeep` |

### Current Backend Structure
```
backend/
├── apps/
│   └── .gitkeep
├── config/
│   └── .gitkeep
├── core/
│   └── .gitkeep
├── fixtures/
│   └── .gitkeep
├── locale/
│   └── .gitkeep
├── media/
│   └── .gitkeep
├── requirements/
│   └── .gitkeep
├── static/
│   └── .gitkeep
├── templates/
│   └── .gitkeep
├── tests/
│   └── .gitkeep
└── .gitkeep
```

### Next Steps
Proceed to [03_Tasks-31-35_Config-Files.md](03_Tasks-31-35_Config-Files.md) to create backend configuration files.

---

## Notes for AI Agents

1. **Parallel Execution:** Tasks 26-30 can be executed simultaneously
2. **Empty Directories:** Always add `.gitkeep` to ensure Git tracks them
3. **Sri Lanka Focus:** Locale directory prepared for Sinhala and Tamil
4. **No Code Yet:** These are placeholder directories
5. **Git Commit:** Do NOT commit yet - wait until all Group C tasks are complete
