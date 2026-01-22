# Tasks 21-25: Backend Core Directories

> **Phase:** 01 - Project Foundation & Setup  
> **SubPhase:** 01 - Monorepo Structure Setup  
> **Group:** C - Backend Directory Scaffold  
> **Document:** 01 of 03  
> **Tasks Covered:** 21, 22, 23, 24, 25

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Group:** [../Group-B_Root-Directory-Structure/](../Group-B_Root-Directory-Structure/)
- **→ Next Document:** [02_Tasks-26-30_Support-Directories.md](02_Tasks-26-30_Support-Directories.md)

---

## Document Overview

This document covers the creation of the core backend directories that form the foundation of the Django application structure. These directories house the Django apps, configuration, utilities, and asset storage.

### Tasks in This Document
| Task # | Task Name | Complexity |
|--------|-----------|------------|
| 21 | Create backend/apps/ Directory | Simple |
| 22 | Create backend/config/ Directory | Simple |
| 23 | Create backend/core/ Directory | Simple |
| 24 | Create backend/static/ Directory | Simple |
| 25 | Create backend/media/ Directory | Simple |

---

## Task 21: Create backend/apps/ Directory

### Overview
Create the apps directory that will contain all Django applications for the LankaCommerce Cloud platform.

### Dependencies
- Task 11: Create backend/ Directory (Group B)

### Instructions

1. **Create the apps directory**
   - Create a directory named `apps/` inside `backend/`
   - This will contain all Django application modules

2. **Add .gitkeep file**
   - Create an empty `.gitkeep` file inside the directory
   - This ensures Git tracks the empty directory

3. **Purpose of this directory**
   - Houses all Django apps (modular components)
   - Each app represents a distinct feature/domain
   - Apps follow Django's app architecture pattern

### Planned Django Apps Reference

| App (Future) | Purpose | Domain |
|--------------|---------|--------|
| `tenants` | Multi-tenancy management | Core |
| `users` | User authentication & profiles | Core |
| `products` | Product catalog | ERP |
| `inventory` | Stock management | ERP |
| `orders` | Order processing | ERP |
| `customers` | Customer management | ERP |
| `suppliers` | Supplier management | ERP |
| `pos` | Point of Sale operations | POS |
| `webstore` | E-commerce storefront | Webstore |
| `payments` | Payment processing | Finance |
| `reports` | Reporting engine | Analytics |
| `ai` | AI/ML features | AI |

### Django App Structure (Each App)
```
apps/
├── products/
│   ├── __init__.py
│   ├── admin.py
│   ├── apps.py
│   ├── models.py
│   ├── serializers.py
│   ├── views.py
│   ├── urls.py
│   ├── tests/
│   └── migrations/
└── ...
```

### Expected Outcome
```
backend/
├── apps/
│   └── .gitkeep
└── .gitkeep
```

### Verification Checklist
- [ ] `backend/apps/` directory exists
- [ ] `.gitkeep` file exists inside `apps/`
- [ ] Directory is tracked by Git

---

## Task 22: Create backend/config/ Directory

### Overview
Create the config directory that will contain Django project-level settings and configuration.

### Dependencies
- Task 11: Create backend/ Directory (Group B)

### Instructions

1. **Create the config directory**
   - Create a directory named `config/` inside `backend/`
   - This replaces the default Django project folder pattern

2. **Add .gitkeep file**
   - Create an empty `.gitkeep` file inside the directory
   - This ensures Git tracks the empty directory

3. **Purpose of this directory**
   - Django settings modules (split by environment)
   - URL configuration (root urls.py)
   - WSGI/ASGI application entry points
   - Celery configuration

### Planned Configuration Files Reference

| File (Future) | Purpose |
|---------------|---------|
| `__init__.py` | Makes config a Python package |
| `settings/` | Settings module directory |
| `settings/base.py` | Base settings shared across environments |
| `settings/development.py` | Development-specific settings |
| `settings/production.py` | Production-specific settings |
| `settings/testing.py` | Test environment settings |
| `urls.py` | Root URL configuration |
| `wsgi.py` | WSGI application entry point |
| `asgi.py` | ASGI application entry point |
| `celery.py` | Celery application configuration |

### Settings Organization Strategy
| Setting Type | Location |
|--------------|----------|
| Database | base.py with env overrides |
| Debug mode | environment-specific |
| Allowed hosts | environment-specific |
| Static files | base.py |
| Installed apps | base.py |
| Middleware | base.py |
| REST Framework | base.py |
| Celery | base.py + celery.py |
| Multi-tenancy | base.py |

### Expected Outcome
```
backend/
├── apps/
│   └── .gitkeep
├── config/
│   └── .gitkeep
└── .gitkeep
```

### Verification Checklist
- [ ] `backend/config/` directory exists
- [ ] `.gitkeep` file exists inside `config/`
- [ ] Directory is tracked by Git

---

## Task 23: Create backend/core/ Directory

### Overview
Create the core directory that will contain shared utilities, base models, mixins, and helper functions used across all Django apps.

### Dependencies
- Task 11: Create backend/ Directory (Group B)

### Instructions

1. **Create the core directory**
   - Create a directory named `core/` inside `backend/`
   - This contains reusable components shared by all apps

2. **Add .gitkeep file**
   - Create an empty `.gitkeep` file inside the directory
   - This ensures Git tracks the empty directory

3. **Purpose of this directory**
   - Base model classes with common fields (timestamps, soft delete)
   - Mixins for common functionality
   - Custom exception classes
   - Utility functions and helpers
   - Permission classes for DRF
   - Pagination classes
   - Validators and serializer mixins

### Planned Core Components Reference

| Component (Future) | Purpose |
|--------------------|---------|
| `models.py` | Base models with timestamps, UUID, soft delete |
| `mixins.py` | Reusable model mixins |
| `exceptions.py` | Custom exception classes |
| `permissions.py` | DRF permission classes |
| `pagination.py` | Custom pagination classes |
| `validators.py` | Custom validators (LKR, phone, NIC) |
| `serializers.py` | Base serializer classes |
| `views.py` | Base view classes |
| `utils/` | Utility function modules |
| `middleware/` | Custom middleware classes |

### Base Model Fields (Planned)
| Field | Type | Purpose |
|-------|------|---------|
| `id` | UUID | Primary key (UUID4) |
| `created_at` | DateTime | Record creation timestamp |
| `updated_at` | DateTime | Last modification timestamp |
| `is_active` | Boolean | Soft delete flag |
| `created_by` | ForeignKey | User who created record |
| `updated_by` | ForeignKey | User who last modified |

### Expected Outcome
```
backend/
├── apps/
│   └── .gitkeep
├── config/
│   └── .gitkeep
├── core/
│   └── .gitkeep
└── .gitkeep
```

### Verification Checklist
- [ ] `backend/core/` directory exists
- [ ] `.gitkeep` file exists inside `core/`
- [ ] Directory is tracked by Git

---

## Task 24: Create backend/static/ Directory

### Overview
Create the static directory that will contain static files for the Django admin and other server-rendered pages.

### Dependencies
- Task 11: Create backend/ Directory (Group B)

### Instructions

1. **Create the static directory**
   - Create a directory named `static/` inside `backend/`
   - This holds static assets for Django (not frontend)

2. **Add .gitkeep file**
   - Create an empty `.gitkeep` file inside the directory
   - This ensures Git tracks the empty directory

3. **Purpose of this directory**
   - Django admin customizations (CSS, JS, images)
   - Email template assets
   - API documentation styling
   - Any server-rendered page assets

### Planned Subdirectories Reference

| Subdirectory (Future) | Purpose |
|----------------------|---------|
| `admin/` | Django admin customizations |
| `css/` | Custom stylesheets |
| `js/` | Custom JavaScript |
| `images/` | Images for server pages |
| `fonts/` | Custom fonts |

### Static Files Configuration Notes
- **STATIC_URL:** `/static/`
- **STATICFILES_DIRS:** Points to this directory
- **STATIC_ROOT:** Separate directory for collectstatic output
- **Collection:** Use `python manage.py collectstatic` for production

### Expected Outcome
```
backend/
├── apps/
│   └── .gitkeep
├── config/
│   └── .gitkeep
├── core/
│   └── .gitkeep
├── static/
│   └── .gitkeep
└── .gitkeep
```

### Verification Checklist
- [ ] `backend/static/` directory exists
- [ ] `.gitkeep` file exists inside `static/`
- [ ] Directory is tracked by Git

---

## Task 25: Create backend/media/ Directory

### Overview
Create the media directory that will contain user-uploaded files during development. In production, files are stored in cloud storage (S3/MinIO).

### Dependencies
- Task 11: Create backend/ Directory (Group B)

### Instructions

1. **Create the media directory**
   - Create a directory named `media/` inside `backend/`
   - This is for local development file storage only

2. **Add .gitkeep file**
   - Create an empty `.gitkeep` file inside the directory
   - This ensures Git tracks the empty directory

3. **Purpose of this directory**
   - User-uploaded images (products, profiles)
   - Document uploads (invoices, reports)
   - Temporary file storage during development
   - NOT for production use (use S3/MinIO instead)

### Planned Subdirectories Reference

| Subdirectory (Future) | Purpose |
|----------------------|---------|
| `products/` | Product images |
| `users/` | User profile pictures |
| `documents/` | Uploaded documents |
| `temp/` | Temporary uploads |

### Media Configuration Notes
- **MEDIA_URL:** `/media/`
- **MEDIA_ROOT:** Points to this directory (development)
- **Production:** Use `django-storages` with S3/MinIO
- **Security:** Never serve media directly from production server

### Important Considerations
| Environment | Storage | Configuration |
|-------------|---------|---------------|
| Development | Local filesystem | `media/` directory |
| Staging | MinIO (S3-compatible) | `AWS_S3_*` env vars |
| Production | AWS S3 or MinIO | `AWS_S3_*` env vars |

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
└── .gitkeep
```

### Verification Checklist
- [ ] `backend/media/` directory exists
- [ ] `.gitkeep` file exists inside `media/`
- [ ] Directory is tracked by Git
- [ ] Directory is ignored in `.gitignore` (except .gitkeep)

---

## Summary

### Tasks Completed in This Document
| Task # | Task Name | Key Deliverable |
|--------|-----------|-----------------|
| 21 | Create backend/apps/ Directory | `backend/apps/` with `.gitkeep` |
| 22 | Create backend/config/ Directory | `backend/config/` with `.gitkeep` |
| 23 | Create backend/core/ Directory | `backend/core/` with `.gitkeep` |
| 24 | Create backend/static/ Directory | `backend/static/` with `.gitkeep` |
| 25 | Create backend/media/ Directory | `backend/media/` with `.gitkeep` |

### Current Backend Structure
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
└── .gitkeep
```

### Next Steps
Proceed to [02_Tasks-26-30_Support-Directories.md](02_Tasks-26-30_Support-Directories.md) to create support directories for templates, tests, fixtures, locale, and requirements.

---

## Notes for AI Agents

1. **Parallel Execution:** Tasks 21-25 can be executed simultaneously
2. **Empty Directories:** Always add `.gitkeep` to ensure Git tracks them
3. **Media Ignored:** Ensure `media/` contents (except .gitkeep) are in `.gitignore`
4. **No Code Yet:** These are placeholder directories; actual Django setup is in SubPhase-02
5. **Git Commit:** Do NOT commit yet - wait until all Group C tasks are complete
