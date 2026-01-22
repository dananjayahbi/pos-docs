# Tasks 29-31: Local Settings

> **Phase:** 01 - Project Foundation & Setup  
> **SubPhase:** 02 - Backend Project Initialization  
> **Group:** C - Settings Module Structure  
> **Document:** 03 of 04  
> **Tasks Covered:** 29, 30, 31

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [02_Tasks-24-28_Base-Config.md](02_Tasks-24-28_Base-Config.md)
- **→ Next Document:** [04_Tasks-32-35_Production-Test.md](04_Tasks-32-35_Production-Test.md)

---

## Document Overview

This document covers creating local.py for development environment with debug settings, local database configuration, and development email backend.

### Tasks in This Document
| Task # | Task Name | Complexity |
|--------|-----------|------------|
| 29 | Create local.py - Debug Settings | Medium |
| 30 | Create local.py - Database | Simple |
| 31 | Create local.py - Email | Simple |

---

## Task 29: Create local.py - Debug Settings

### Overview
Create local.py file that extends base settings with development-specific configurations including debug mode and development tools.

### Dependencies
- Task 19: Create base.py - Imports Section

### Instructions

1. **Create local.py file**
   - Create file in `config/settings/`
   - Import everything from base.py

2. **Enable DEBUG mode**
   - Set DEBUG = True
   - Enable detailed error pages

3. **Configure ALLOWED_HOSTS**
   - Include localhost, 127.0.0.1
   - Include Docker host if needed

4. **Add INTERNAL_IPS**
   - Required for debug toolbar
   - Add localhost IPs

5. **Add development apps**
   - django-debug-toolbar
   - django-extensions

6. **Add development middleware**
   - Debug toolbar middleware

### Debug Settings

| Setting | Value | Purpose |
|---------|-------|---------|
| `DEBUG` | True | Enable debug mode |
| `ALLOWED_HOSTS` | ['localhost', '127.0.0.1'] | Dev hosts |
| `INTERNAL_IPS` | ['127.0.0.1'] | Debug toolbar |

### Development Apps to Add

| App | Purpose |
|-----|---------|
| `debug_toolbar` | SQL and request inspection |
| `django_extensions` | Enhanced management commands |

### Development Middleware

| Middleware | Position | Purpose |
|------------|----------|---------|
| `debug_toolbar.middleware.DebugToolbarMiddleware` | After security | Debug panel |

### INTERNAL_IPS Configuration

For Docker environments, add Docker host IP:
- Standard: 127.0.0.1
- Docker: Host machine IP (varies)

### Expected Outcome
```
config/settings/
├── __init__.py
├── base.py
└── local.py          # Development settings
```

### Verification Checklist
- [ ] local.py created
- [ ] Imports from base.py
- [ ] DEBUG = True
- [ ] ALLOWED_HOSTS configured
- [ ] INTERNAL_IPS set

---

## Task 30: Create local.py - Database

### Overview
Configure the local development database connection to PostgreSQL running in Docker.

### Dependencies
- Task 29: Create local.py - Debug Settings

### Instructions

1. **Configure DATABASES**
   - Override base.py placeholder
   - Connect to Docker PostgreSQL

2. **Set database engine**
   - Use PostgreSQL backend
   - Prepare for django-tenants (Phase 2)

3. **Configure connection details**
   - Database name, user, password
   - Host (docker service name)
   - Port (5432)

4. **Use environment variables**
   - Read from .env file
   - Default values for local dev

### Database Configuration

| Setting | Value | Source |
|---------|-------|--------|
| `ENGINE` | django.db.backends.postgresql | Standard PostgreSQL |
| `NAME` | lankacommerce | Database name |
| `USER` | postgres | Database user |
| `PASSWORD` | postgres | Dev password |
| `HOST` | db | Docker service name |
| `PORT` | 5432 | PostgreSQL port |

### Docker Database Service

The database connects to Docker Compose service:

| Docker Service | Internal Host | Port |
|----------------|---------------|------|
| `db` | db | 5432 |

### Environment Variable Pattern

| Variable | Default | Purpose |
|----------|---------|---------|
| `DATABASE_NAME` | lankacommerce | DB name |
| `DATABASE_USER` | postgres | DB user |
| `DATABASE_PASSWORD` | postgres | DB password |
| `DATABASE_HOST` | db | Host (Docker) |
| `DATABASE_PORT` | 5432 | Port |

### django-tenants Preparation

For Phase 2, the ENGINE will change to:
- `django_tenants.postgresql_backend`
- Additional tenant configuration

### Expected Outcome
- Local PostgreSQL connection configured
- Ready for Docker development

### Verification Checklist
- [ ] DATABASES configured in local.py
- [ ] PostgreSQL engine set
- [ ] Connection to Docker db service
- [ ] Environment variables used

---

## Task 31: Create local.py - Email

### Overview
Configure email backend for local development using console or file-based email.

### Dependencies
- Task 29: Create local.py - Debug Settings

### Instructions

1. **Set EMAIL_BACKEND**
   - Use console backend for development
   - Prints emails to terminal

2. **Configure default sender**
   - DEFAULT_FROM_EMAIL setting
   - Local testing address

3. **Add email port settings**
   - For MailHog/MailCatcher if used
   - Alternative to console backend

### Email Backend Options

| Backend | Purpose | When to Use |
|---------|---------|-------------|
| `console.EmailBackend` | Print to terminal | Quick testing |
| `filebased.EmailBackend` | Save to files | Review emails |
| `smtp.EmailBackend` | MailHog/MailCatcher | Full SMTP testing |

### Console Backend (Recommended)

| Setting | Value |
|---------|-------|
| `EMAIL_BACKEND` | django.core.mail.backends.console.EmailBackend |
| `DEFAULT_FROM_EMAIL` | noreply@localhost |

### MailHog Alternative

If using MailHog in Docker:

| Setting | Value |
|---------|-------|
| `EMAIL_BACKEND` | smtp.EmailBackend |
| `EMAIL_HOST` | mailhog |
| `EMAIL_PORT` | 1025 |

### Email Settings Summary

| Setting | Value | Purpose |
|---------|-------|---------|
| `EMAIL_BACKEND` | console | Quick dev testing |
| `DEFAULT_FROM_EMAIL` | noreply@localhost | Sender address |
| `EMAIL_SUBJECT_PREFIX` | [LCC Dev] | Subject prefix |

### File-Based Alternative

If you want to review emails:

| Setting | Value |
|---------|-------|
| `EMAIL_BACKEND` | filebased.EmailBackend |
| `EMAIL_FILE_PATH` | BASE_DIR / 'tmp/emails' |

### Expected Outcome
- Email backend configured for development
- Emails visible in console

### Verification Checklist
- [ ] EMAIL_BACKEND set to console
- [ ] DEFAULT_FROM_EMAIL configured
- [ ] Can be easily switched to MailHog

---

## Summary

### Tasks Completed in This Document
| Task # | Task Name | Key Deliverable |
|--------|-----------|-----------------|
| 29 | Create local.py - Debug Settings | Debug and dev tools |
| 30 | Create local.py - Database | PostgreSQL config |
| 31 | Create local.py - Email | Console email |

### local.py Structure

```python
# local.py structure
from .base import *

# Debug Settings (Task 29)
DEBUG = True
ALLOWED_HOSTS = [...]
INTERNAL_IPS = [...]
INSTALLED_APPS += [...]
MIDDLEWARE += [...]

# Database (Task 30)
DATABASES = {...}

# Email (Task 31)
EMAIL_BACKEND = ...
DEFAULT_FROM_EMAIL = ...
```

### Settings File Progress

```
config/settings/
├── __init__.py      ✅ Task 12
├── base.py          ✅ Tasks 19-28
├── local.py         ✅ Tasks 29-31
├── production.py    → Task 32-34
└── test.py          → Task 35
```

### Development Environment Summary

| Category | Configuration |
|----------|---------------|
| **Debug** | DEBUG=True, debug toolbar |
| **Database** | PostgreSQL via Docker |
| **Email** | Console backend |
| **Hosts** | localhost, 127.0.0.1 |

### Next Steps
Proceed to [04_Tasks-32-35_Production-Test.md](04_Tasks-32-35_Production-Test.md) to create production and test settings.

---

## Notes for AI Agents

1. **Import Pattern:** Start with `from .base import *`
2. **Docker Host:** Database HOST is 'db' (Docker service name)
3. **Debug Toolbar:** Needs INTERNAL_IPS configuration
4. **Email Console:** Simplest for development testing
5. **Git Commit:** Do NOT commit yet - complete all Group C tasks first
