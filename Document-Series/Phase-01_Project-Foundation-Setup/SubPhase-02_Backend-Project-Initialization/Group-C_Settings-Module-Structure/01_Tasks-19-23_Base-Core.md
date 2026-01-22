# Tasks 19-23: Base Settings Core

> **Phase:** 01 - Project Foundation & Setup  
> **SubPhase:** 02 - Backend Project Initialization  
> **Group:** C - Settings Module Structure  
> **Document:** 01 of 04  
> **Tasks Covered:** 19, 20, 21, 22, 23

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Group:** [../Group-B_Django-Project-Creation/](../Group-B_Django-Project-Creation/)
- **→ Next Document:** [02_Tasks-24-28_Base-Config.md](02_Tasks-24-28_Base-Config.md)

---

## Document Overview

This document covers the core sections of base.py including imports, installed apps, middleware, templates, and database placeholder configuration.

### Tasks in This Document
| Task # | Task Name | Complexity |
|--------|-----------|------------|
| 19 | Create base.py - Imports Section | Simple |
| 20 | Create base.py - Installed Apps | Medium |
| 21 | Create base.py - Middleware | Medium |
| 22 | Create base.py - Templates | Simple |
| 23 | Create base.py - Database Placeholder | Simple |

---

## Task 19: Create base.py - Imports Section

### Overview
Set up the imports section and base path configuration at the top of base.py.

### Dependencies
- Task 11: Rename settings.py (Group B)

### Instructions

1. **Add standard library imports**
   - Import pathlib for Path operations
   - Import os for environment variables

2. **Add third-party imports placeholder**
   - Add comment for future decouple import
   - Prepare for environment variable reading

3. **Configure BASE_DIR**
   - Use Path(__file__).resolve() pattern
   - Account for settings module depth

4. **Add configuration comments**
   - Document file purpose
   - Add section separators

### BASE_DIR Configuration

| Level | Path | Description |
|-------|------|-------------|
| `__file__` | base.py | Current file |
| `.parent` | settings/ | Settings module |
| `.parent` | config/ | Config package |
| `.parent` | backend/ | Project root |

### Path Resolution

The BASE_DIR must point to `backend/` directory:
- Three `.parent` calls from base.py location
- Used for static files, media, templates paths

### Secret Key Handling

| Environment | Source | Method |
|-------------|--------|--------|
| Development | .env file | decouple |
| Production | Environment | os.environ |
| Test | Hardcoded | Fixed test key |

### Expected Imports Structure

The imports section should include:
- Path from pathlib
- os module
- Comment placeholder for decouple
- Comment placeholder for dj_database_url

### Verification Checklist
- [ ] pathlib.Path imported
- [ ] os imported
- [ ] BASE_DIR correctly configured
- [ ] Comments for future imports

---

## Task 20: Create base.py - Installed Apps

### Overview
Configure the INSTALLED_APPS setting with Django's built-in apps, third-party apps, and local apps structure.

### Dependencies
- Task 19: Create base.py - Imports Section

### Instructions

1. **Create DJANGO_APPS list**
   - Include all Django built-in apps
   - Maintain order for dependencies

2. **Create THIRD_PARTY_APPS list**
   - Add placeholders for future packages
   - REST framework, django-tenants, etc.

3. **Create LOCAL_APPS list**
   - Placeholder for project apps
   - Will add core, users, etc. later

4. **Combine into INSTALLED_APPS**
   - Concatenate all three lists
   - DJANGO_APPS + THIRD_PARTY_APPS + LOCAL_APPS

### Django Built-in Apps

| App | Purpose |
|-----|---------|
| `django.contrib.admin` | Admin interface |
| `django.contrib.auth` | Authentication |
| `django.contrib.contenttypes` | Content type framework |
| `django.contrib.sessions` | Session management |
| `django.contrib.messages` | Message framework |
| `django.contrib.staticfiles` | Static file serving |

### Third-Party Apps (Planned)

| App | Purpose | When Added |
|-----|---------|------------|
| `django_tenants` | Multi-tenancy | Phase 2 |
| `rest_framework` | REST API | Group D |
| `corsheaders` | CORS handling | Group D |
| `django_filters` | Filtering | Group D |

### Local Apps (Planned)

| App | Purpose | When Added |
|-----|---------|------------|
| `core` | Core utilities | Phase 3 |
| `users` | User management | Phase 3 |
| `tenants` | Tenant models | Phase 2 |
| `inventory` | Inventory module | Phase 4 |

### Expected Outcome
- INSTALLED_APPS with three-part structure
- Placeholders for future apps

### Verification Checklist
- [ ] DJANGO_APPS list defined
- [ ] THIRD_PARTY_APPS list defined
- [ ] LOCAL_APPS list defined
- [ ] INSTALLED_APPS combines all three

---

## Task 21: Create base.py - Middleware

### Overview
Configure the MIDDLEWARE setting with Django's default middleware and prepare for custom middleware additions.

### Dependencies
- Task 19: Create base.py - Imports Section

### Instructions

1. **Include Django default middleware**
   - SecurityMiddleware first
   - Session, auth, messages middleware
   - CSRF protection

2. **Add comment placeholders**
   - Tenant middleware (future)
   - CORS middleware (future)
   - Custom middleware

3. **Document middleware order**
   - Order matters for middleware
   - Comment explaining sequence

### Django Default Middleware

| Middleware | Purpose | Order |
|------------|---------|-------|
| `SecurityMiddleware` | HTTPS, headers | 1st |
| `SessionMiddleware` | Session handling | 2nd |
| `CommonMiddleware` | URL normalization | 3rd |
| `CsrfViewMiddleware` | CSRF protection | 4th |
| `AuthenticationMiddleware` | User auth | 5th |
| `MessageMiddleware` | Flash messages | 6th |
| `ClickjackingMiddleware` | X-Frame-Options | 7th |

### Planned Middleware Additions

| Middleware | Purpose | Position |
|------------|---------|----------|
| `TenantMainMiddleware` | Multi-tenancy | After Security |
| `CorsMiddleware` | CORS handling | After Tenant |
| `RequestLogMiddleware` | Logging | Custom |

### Middleware Order Importance

| Position | Why It Matters |
|----------|----------------|
| **Security first** | Apply security before processing |
| **Session before auth** | Auth needs session |
| **CSRF before views** | Protect form submissions |
| **Tenant early** | Set tenant context first |

### Expected Outcome
- MIDDLEWARE list with correct order
- Placeholders for future additions

### Verification Checklist
- [ ] All Django default middleware included
- [ ] Correct order maintained
- [ ] Comment placeholders for future
- [ ] SecurityMiddleware is first

---

## Task 22: Create base.py - Templates

### Overview
Configure the TEMPLATES setting for Django's template engine.

### Dependencies
- Task 19: Create base.py - Imports Section

### Instructions

1. **Configure template engine**
   - Use Django template backend
   - Set DIRS to templates folder

2. **Enable APP_DIRS**
   - Allow templates in app directories
   - Find templates in installed apps

3. **Configure context processors**
   - Include Django defaults
   - Add request processor

4. **Set template options**
   - String_if_invalid for debugging
   - Future: template caching

### Template Configuration Options

| Option | Value | Purpose |
|--------|-------|---------|
| `BACKEND` | DjangoTemplates | Template engine |
| `DIRS` | [BASE_DIR / 'templates'] | Custom templates |
| `APP_DIRS` | True | App template dirs |
| `OPTIONS` | context_processors | Template context |

### Context Processors

| Processor | Purpose |
|-----------|---------|
| `debug` | Debug context variable |
| `request` | Request object in templates |
| `auth` | User and permissions |
| `messages` | Flash messages |

### Template Search Order

Django searches for templates in this order:
1. DIRS (project templates/ folder)
2. App directories (if APP_DIRS=True)
3. Installed apps in INSTALLED_APPS order

### Expected Outcome
- TEMPLATES configured correctly
- Template directory set to templates/

### Verification Checklist
- [ ] TEMPLATES list configured
- [ ] DIRS points to templates folder
- [ ] APP_DIRS is True
- [ ] All context processors included

---

## Task 23: Create base.py - Database Placeholder

### Overview
Create a placeholder database configuration that will be overridden by environment-specific settings.

### Dependencies
- Task 19: Create base.py - Imports Section

### Instructions

1. **Create DATABASES placeholder**
   - Empty or minimal configuration
   - Will be overridden in local.py/production.py

2. **Add comment documentation**
   - Explain override strategy
   - Reference environment files

3. **Prepare for PostgreSQL**
   - Comment showing expected format
   - django-tenants requirements

4. **Default to empty/SQLite**
   - Safe default for base
   - Override in environment settings

### Database Strategy

| Environment | Database | Configuration Location |
|-------------|----------|----------------------|
| Development | PostgreSQL (Docker) | local.py |
| Production | PostgreSQL (Managed) | production.py |
| Testing | PostgreSQL/SQLite | test.py |

### django-tenants Database Structure

For multi-tenant setup (Phase 2):

| Key | Purpose |
|-----|---------|
| `default` | Tenant database |
| `ENGINE` | django_tenants.postgresql_backend |
| `NAME`, `USER`, `PASSWORD` | From environment |

### Placeholder Format

The DATABASES in base.py should:
- Be empty or minimal
- Include comments about overrides
- Not hard-code credentials

### Expected Outcome
- DATABASES placeholder in base.py
- Clear comments about environment overrides

### Verification Checklist
- [ ] DATABASES setting exists
- [ ] No hardcoded credentials
- [ ] Comments explain override strategy
- [ ] Ready for environment-specific config

---

## Summary

### Tasks Completed in This Document
| Task # | Task Name | Key Deliverable |
|--------|-----------|-----------------|
| 19 | Create base.py - Imports Section | Path and imports |
| 20 | Create base.py - Installed Apps | Three-part app structure |
| 21 | Create base.py - Middleware | Middleware stack |
| 22 | Create base.py - Templates | Template configuration |
| 23 | Create base.py - Database Placeholder | Database placeholder |

### base.py Progress

```
base.py
├── Imports Section             ✅ Task 19
├── SECRET_KEY (placeholder)    ✅ Task 19
├── DEBUG (placeholder)         ✅ Task 19
├── ALLOWED_HOSTS (placeholder) ✅ Task 19
├── INSTALLED_APPS              ✅ Task 20
├── MIDDLEWARE                  ✅ Task 21
├── ROOT_URLCONF                ✅ (standard)
├── TEMPLATES                   ✅ Task 22
├── WSGI_APPLICATION            ✅ (standard)
├── DATABASES                   ✅ Task 23
├── AUTH_PASSWORD_VALIDATORS    → Task 24
├── LANGUAGE/TIME               → Task 25
├── STATIC                      → Task 26
├── MEDIA                       → Task 27
└── SECURITY                    → Task 28
```

### Next Steps
Proceed to [02_Tasks-24-28_Base-Config.md](02_Tasks-24-28_Base-Config.md) to complete base.py configuration.

---

## Notes for AI Agents

1. **Three-Part Apps:** DJANGO_APPS + THIRD_PARTY_APPS + LOCAL_APPS pattern
2. **Middleware Order:** Order is critical, security first
3. **BASE_DIR:** Three .parent calls from base.py location
4. **No Credentials:** Database credentials come from environment
5. **Git Commit:** Do NOT commit yet - complete all Group C tasks first
