# Tasks 36-40: Core Packages Installation

> **Phase:** 01 - Project Foundation & Setup  
> **SubPhase:** 02 - Backend Project Initialization  
> **Group:** D - Core Dependencies Installation  
> **Document:** 01 of 03  
> **Tasks Covered:** 36, 37, 38, 39, 40

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Group:** [../Group-C_Settings-Module-Structure/](../Group-C_Settings-Module-Structure/)
- **→ Next Document:** [02_Tasks-41-46_Extensions.md](02_Tasks-41-46_Extensions.md)

---

## Document Overview

This document covers installing the essential core packages: Django REST Framework, django-tenants, PostgreSQL adapter, CORS headers, and environment variable management.

### Tasks in This Document
| Task # | Task Name | Complexity |
|--------|-----------|------------|
| 36 | Install djangorestframework | Simple |
| 37 | Install django-tenants | Simple |
| 38 | Install psycopg[binary] | Simple |
| 39 | Install django-cors-headers | Simple |
| 40 | Install django-environ | Simple |

---

## Task 36: Install djangorestframework

### Overview
Install Django REST Framework (DRF), the toolkit for building Web APIs with Django.

### Dependencies
- Task 09: Install Django (Group B)

### Instructions

1. **Add to base.in**
   - Add djangorestframework to requirements/base.in
   - Specify version constraint

2. **Add to INSTALLED_APPS**
   - Add 'rest_framework' to THIRD_PARTY_APPS in base.py

3. **Add REST_FRAMEWORK settings**
   - Add DEFAULT settings dictionary
   - Configure default authentication, permissions, pagination

### Package Information

| Package | Version | Purpose |
|---------|---------|---------|
| `djangorestframework` | >=3.14 | REST API toolkit |

### Settings to Add

Add REST_FRAMEWORK dictionary to base.py:

| Setting | Value | Purpose |
|---------|-------|---------|
| `DEFAULT_AUTHENTICATION_CLASSES` | JWT, Session | Auth methods |
| `DEFAULT_PERMISSION_CLASSES` | IsAuthenticated | Default permission |
| `DEFAULT_PAGINATION_CLASS` | PageNumberPagination | Pagination style |
| `PAGE_SIZE` | 20 | Items per page |

### INSTALLED_APPS Addition

Add to THIRD_PARTY_APPS:
- `'rest_framework'`

### REST Framework Features

| Feature | Description |
|---------|-------------|
| Serializers | Object ↔ JSON conversion |
| ViewSets | CRUD operations |
| Routers | URL auto-generation |
| Authentication | Built-in auth classes |
| Permissions | Access control |
| Throttling | Rate limiting |

### Expected Outcome
- DRF installed
- Settings configured
- Ready for API development

### Verification Checklist
- [ ] djangorestframework in base.in
- [ ] rest_framework in INSTALLED_APPS
- [ ] REST_FRAMEWORK settings added

---

## Task 37: Install django-tenants

### Overview
Install django-tenants for PostgreSQL schema-based multi-tenancy support.

### Dependencies
- Task 09: Install Django (Group B)

### Instructions

1. **Add to base.in**
   - Add django-tenants to requirements/base.in
   - Specify version constraint

2. **Prepare for Phase 2**
   - Add comment about Phase 2 configuration
   - Will be configured in Phase 2

3. **Note: Do NOT add to INSTALLED_APPS yet**
   - Requires tenant models first
   - Will be enabled in Phase 2

### Package Information

| Package | Version | Purpose |
|---------|---------|---------|
| `django-tenants` | >=3.6 | Multi-tenancy |

### Multi-Tenancy Strategy

| Aspect | Implementation |
|--------|----------------|
| **Schema Type** | Schema-per-tenant |
| **Database** | Single PostgreSQL |
| **Isolation** | Schema-level |
| **Shared Data** | Public schema |

### Phase 2 Configuration (Preview)

Settings to be added in Phase 2:

| Setting | Purpose |
|---------|---------|
| `TENANT_MODEL` | Tenant model path |
| `TENANT_DOMAIN_MODEL` | Domain model path |
| `SHARED_APPS` | Apps in public schema |
| `TENANT_APPS` | Apps in tenant schemas |
| `DATABASE_ROUTERS` | Tenant-aware routing |

### Database Engine Change

In Phase 2, change:
- FROM: `django.db.backends.postgresql`
- TO: `django_tenants.postgresql_backend`

### Expected Outcome
- django-tenants in requirements
- Ready for Phase 2 setup

### Verification Checklist
- [ ] django-tenants in base.in
- [ ] Comment noting Phase 2 configuration
- [ ] NOT added to INSTALLED_APPS yet

---

## Task 38: Install psycopg[binary]

### Overview
Install psycopg version 3, the modern PostgreSQL database adapter for Python.

### Dependencies
- Task 09: Install Django (Group B)

### Instructions

1. **Add to base.in**
   - Add psycopg[binary] to requirements/base.in
   - Use version 3.x (not psycopg2)

2. **Verify Python compatibility**
   - psycopg 3.x requires Python 3.8+
   - Supports async operations

3. **Note binary vs source**
   - [binary] includes pre-compiled wheels
   - Faster installation, no C compiler needed

### Package Information

| Package | Version | Purpose |
|---------|---------|---------|
| `psycopg[binary]` | >=3.1 | PostgreSQL adapter |

### psycopg vs psycopg2

| Feature | psycopg (v3) | psycopg2 |
|---------|--------------|----------|
| Python version | 3.8+ | 2.7+ |
| Async support | Native | Wrapper |
| Type hints | Yes | Limited |
| Performance | Better | Good |
| Maintenance | Active | Maintenance |

### Installation Variants

| Variant | Description |
|---------|-------------|
| `psycopg` | Source (needs compiler) |
| `psycopg[binary]` | Pre-compiled binaries |
| `psycopg[c]` | C implementation |
| `psycopg[pool]` | Connection pooling |

### Expected Outcome
- psycopg[binary] installed
- Ready for PostgreSQL connection

### Verification Checklist
- [ ] psycopg[binary] in base.in
- [ ] Version 3.x specified
- [ ] Can import psycopg

---

## Task 39: Install django-cors-headers

### Overview
Install django-cors-headers to handle Cross-Origin Resource Sharing for API requests from frontend applications.

### Dependencies
- Task 09: Install Django (Group B)

### Instructions

1. **Add to base.in**
   - Add django-cors-headers to requirements/base.in

2. **Add to INSTALLED_APPS**
   - Add 'corsheaders' to THIRD_PARTY_APPS

3. **Add middleware**
   - Add CorsMiddleware early in MIDDLEWARE
   - Must be before CommonMiddleware

4. **Configure CORS settings**
   - Set up allowed origins
   - Configure for development and production

### Package Information

| Package | Version | Purpose |
|---------|---------|---------|
| `django-cors-headers` | >=4.3 | CORS handling |

### Middleware Position

CorsMiddleware should be placed:
- AFTER SecurityMiddleware
- BEFORE CommonMiddleware

| Position | Middleware |
|----------|------------|
| 1 | SecurityMiddleware |
| 2 | **CorsMiddleware** |
| 3 | SessionMiddleware |
| 4 | CommonMiddleware |

### CORS Settings

| Setting | Development | Production |
|---------|-------------|------------|
| `CORS_ALLOW_ALL_ORIGINS` | True | False |
| `CORS_ALLOWED_ORIGINS` | - | Specific domains |
| `CORS_ALLOW_CREDENTIALS` | True | True |

### Frontend Origins (Development)

| Frontend | URL |
|----------|-----|
| POS | http://localhost:3000 |
| Webstore | http://localhost:3001 |
| Dashboard | http://localhost:3002 |

### Expected Outcome
- CORS headers configured
- Frontend can access API

### Verification Checklist
- [ ] django-cors-headers in base.in
- [ ] corsheaders in INSTALLED_APPS
- [ ] CorsMiddleware in MIDDLEWARE
- [ ] CORS settings configured

---

## Task 40: Install django-environ

### Overview
Install django-environ (or python-decouple) for environment variable management and .env file support.

### Dependencies
- Task 09: Install Django (Group B)

### Instructions

1. **Add to base.in**
   - Add django-environ (or python-decouple) to base.in
   - Either package works well

2. **Import in settings**
   - Import environ at top of base.py
   - Initialize env reader

3. **Configure .env reading**
   - Point to .env file location
   - Set default values

4. **Update settings to use env**
   - SECRET_KEY from env
   - DEBUG from env
   - DATABASE_URL from env

### Package Options

| Package | Pros | Cons |
|---------|------|------|
| `django-environ` | Django-specific, URL parsing | Larger |
| `python-decouple` | Simple, lightweight | Less URL parsing |

### django-environ Usage

| Method | Purpose | Example |
|--------|---------|---------|
| `env('KEY')` | String value | env('SECRET_KEY') |
| `env.bool('KEY')` | Boolean | env.bool('DEBUG', False) |
| `env.int('KEY')` | Integer | env.int('PORT', 8000) |
| `env.db('KEY')` | Database URL | env.db('DATABASE_URL') |

### Settings Updates

| Setting | Before | After |
|---------|--------|-------|
| `SECRET_KEY` | Hardcoded | env('SECRET_KEY') |
| `DEBUG` | True | env.bool('DEBUG', False) |
| `ALLOWED_HOSTS` | [] | env.list('ALLOWED_HOSTS', []) |

### .env File Structure

```
SECRET_KEY=your-secret-key-here
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1
DATABASE_URL=postgres://user:pass@localhost/db
```

### Expected Outcome
- Environment variables working
- Secrets not in code

### Verification Checklist
- [ ] django-environ in base.in
- [ ] Import in settings
- [ ] Settings use env() calls
- [ ] .env.example updated

---

## Summary

### Tasks Completed in This Document
| Task # | Task Name | Key Deliverable |
|--------|-----------|-----------------|
| 36 | Install djangorestframework | DRF for APIs |
| 37 | Install django-tenants | Multi-tenancy |
| 38 | Install psycopg[binary] | PostgreSQL adapter |
| 39 | Install django-cors-headers | CORS support |
| 40 | Install django-environ | Environment variables |

### Updated base.in

```
# Django Core
Django>=5.0,<6.0

# REST Framework
djangorestframework>=3.14

# Multi-tenancy
django-tenants>=3.6

# Database
psycopg[binary]>=3.1

# CORS
django-cors-headers>=4.3

# Configuration
django-environ>=0.11
```

### INSTALLED_APPS Update

```python
THIRD_PARTY_APPS = [
    'rest_framework',
    'corsheaders',
    # django_tenants added in Phase 2
]
```

### Next Steps
Proceed to [02_Tasks-41-46_Extensions.md](02_Tasks-41-46_Extensions.md) for additional extensions.

---

## Notes for AI Agents

1. **DRF Settings:** Add REST_FRAMEWORK config dict to base.py
2. **django-tenants:** Install only, configure in Phase 2
3. **CORS Middleware:** Must be early in MIDDLEWARE stack
4. **Environment:** Use django-environ OR python-decouple
5. **Git Commit:** Do NOT commit yet - complete all Group D tasks first
