# Tasks 32-35: Production & Test Settings

> **Phase:** 01 - Project Foundation & Setup  
> **SubPhase:** 02 - Backend Project Initialization  
> **Group:** C - Settings Module Structure  
> **Document:** 04 of 04  
> **Tasks Covered:** 32, 33, 34, 35

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [03_Tasks-29-31_Local-Settings.md](03_Tasks-29-31_Local-Settings.md)
- **→ Next Group:** [../Group-D_Core-Dependencies-Installation/](../Group-D_Core-Dependencies-Installation/)

---

## Document Overview

This document covers creating production.py for production security and configuration, and test.py for optimized test execution.

### Tasks in This Document
| Task # | Task Name | Complexity |
|--------|-----------|------------|
| 32 | Create production.py - Security | Complex |
| 33 | Create production.py - Database | Medium |
| 34 | Create production.py - Caching | Medium |
| 35 | Create test.py | Medium |

---

## Task 32: Create production.py - Security

### Overview
Create production.py with strict security settings for production deployment.

### Dependencies
- Task 19: Create base.py - Imports Section

### Instructions

1. **Create production.py file**
   - Create file in `config/settings/`
   - Import everything from base.py

2. **Disable DEBUG**
   - DEBUG = False (critical)
   - Never enable in production

3. **Configure ALLOWED_HOSTS**
   - Read from environment variable
   - Include all production domains

4. **Enable HTTPS security**
   - SECURE_SSL_REDIRECT = True
   - SECURE_PROXY_SSL_HEADER

5. **Configure HSTS**
   - SECURE_HSTS_SECONDS = 31536000
   - SECURE_HSTS_INCLUDE_SUBDOMAINS
   - SECURE_HSTS_PRELOAD

6. **Enable secure cookies**
   - CSRF_COOKIE_SECURE = True
   - SESSION_COOKIE_SECURE = True

7. **Configure SECRET_KEY**
   - Read from environment variable
   - Never hardcode in production

### Security Settings Table

| Setting | Value | Purpose |
|---------|-------|---------|
| `DEBUG` | False | Disable debug |
| `SECRET_KEY` | Environment | From env var |
| `ALLOWED_HOSTS` | Environment | Production domains |
| `SECURE_SSL_REDIRECT` | True | Force HTTPS |
| `SECURE_HSTS_SECONDS` | 31536000 | 1 year HSTS |

### HTTPS Security

| Setting | Value | Purpose |
|---------|-------|---------|
| `SECURE_SSL_REDIRECT` | True | Redirect HTTP to HTTPS |
| `SECURE_PROXY_SSL_HEADER` | ('HTTP_X_FORWARDED_PROTO', 'https') | Behind proxy |

### Cookie Security

| Setting | Value | Purpose |
|---------|-------|---------|
| `CSRF_COOKIE_SECURE` | True | HTTPS only |
| `SESSION_COOKIE_SECURE` | True | HTTPS only |
| `CSRF_COOKIE_HTTPONLY` | True | No JS access |

### HSTS Configuration

| Setting | Value | Purpose |
|---------|-------|---------|
| `SECURE_HSTS_SECONDS` | 31536000 | 1 year |
| `SECURE_HSTS_INCLUDE_SUBDOMAINS` | True | All subdomains |
| `SECURE_HSTS_PRELOAD` | True | Browser preload |

### Environment Variables Required

| Variable | Purpose | Example |
|----------|---------|---------|
| `DJANGO_SECRET_KEY` | Encryption key | Long random string |
| `DJANGO_ALLOWED_HOSTS` | Domains | lcc.lk,*.lcc.lk |
| `SENTRY_DSN` | Error tracking | Sentry URL |

### Expected Outcome
- production.py with strict security
- All secrets from environment

### Verification Checklist
- [ ] production.py created
- [ ] DEBUG = False
- [ ] SECRET_KEY from environment
- [ ] HTTPS settings enabled
- [ ] HSTS configured

---

## Task 33: Create production.py - Database

### Overview
Configure production database connection with proper security and connection pooling.

### Dependencies
- Task 32: Create production.py - Security

### Instructions

1. **Configure database from environment**
   - Use dj-database-url
   - Parse DATABASE_URL environment variable

2. **Enable SSL connections**
   - sslmode=require for production
   - Secure database communication

3. **Configure connection settings**
   - CONN_MAX_AGE for connection pooling
   - CONN_HEALTH_CHECKS for reliability

4. **Prepare for django-tenants**
   - Comment for Phase 2 engine change
   - Multi-tenant database setup

### Database Configuration

| Setting | Source | Purpose |
|---------|--------|---------|
| `DATABASE_URL` | Environment | Full connection string |
| `CONN_MAX_AGE` | 60 | Connection pooling |
| `sslmode` | require | Secure connection |

### DATABASE_URL Format

```
postgres://USER:PASSWORD@HOST:PORT/DBNAME?sslmode=require
```

| Component | Example |
|-----------|---------|
| USER | lcc_user |
| PASSWORD | secure_password |
| HOST | db.example.com |
| PORT | 5432 |
| DBNAME | lankacommerce |

### Connection Pooling

| Setting | Value | Purpose |
|---------|-------|---------|
| `CONN_MAX_AGE` | 60 | Reuse connections |
| `CONN_HEALTH_CHECKS` | True | Check before use |

### SSL Configuration

| Setting | Value | Purpose |
|---------|-------|---------|
| `sslmode` | require | Enforce SSL |
| `sslrootcert` | Optional | CA certificate |

### Expected Outcome
- Production database from environment
- Secure SSL connection
- Connection pooling enabled

### Verification Checklist
- [ ] DATABASE_URL from environment
- [ ] SSL mode enabled
- [ ] Connection pooling configured
- [ ] Ready for django-tenants

---

## Task 34: Create production.py - Caching

### Overview
Configure Redis caching for production performance.

### Dependencies
- Task 32: Create production.py - Security

### Instructions

1. **Configure cache backend**
   - Use Redis for caching
   - django-redis backend

2. **Read Redis URL from environment**
   - REDIS_URL environment variable
   - SSL support for production

3. **Configure cache settings**
   - Default timeout
   - Key prefix for multi-tenancy

4. **Configure session backend**
   - Use cache for sessions
   - Faster than database

### Cache Configuration

| Setting | Value | Purpose |
|---------|-------|---------|
| `BACKEND` | django_redis.cache.RedisCache | Redis backend |
| `LOCATION` | Environment REDIS_URL | Redis server |
| `OPTIONS` | CLIENT_CLASS | redis.Redis settings |

### Redis URL Format

```
redis://[:password@]host:port/db
rediss://[:password@]host:port/db  # SSL
```

| Scheme | Purpose |
|--------|---------|
| `redis://` | Standard Redis |
| `rediss://` | Redis with SSL |

### Cache Settings

| Setting | Value | Purpose |
|---------|-------|---------|
| `TIMEOUT` | 300 | 5 minute default |
| `KEY_PREFIX` | lcc | Namespace prefix |
| `VERSION` | 1 | Cache version |

### Session Cache

| Setting | Value | Purpose |
|---------|-------|---------|
| `SESSION_ENGINE` | cache | Cache-backed sessions |
| `SESSION_CACHE_ALIAS` | default | Use default cache |

### Celery Broker

Redis also serves as Celery broker:

| Setting | Source | Purpose |
|---------|--------|---------|
| `CELERY_BROKER_URL` | REDIS_URL | Task queue |
| `CELERY_RESULT_BACKEND` | REDIS_URL | Task results |

### Expected Outcome
- Redis caching configured
- Session caching enabled
- Celery broker ready

### Verification Checklist
- [ ] CACHES configured with Redis
- [ ] REDIS_URL from environment
- [ ] SESSION_ENGINE set to cache
- [ ] Celery broker configured

---

## Task 35: Create test.py

### Overview
Create test.py with optimized settings for fast test execution.

### Dependencies
- Task 19: Create base.py - Imports Section

### Instructions

1. **Create test.py file**
   - Create file in `config/settings/`
   - Import everything from base.py

2. **Optimize password hashing**
   - Use fast hasher for tests
   - MD5PasswordHasher for speed

3. **Configure test database**
   - SQLite for speed (or PostgreSQL)
   - In-memory if possible

4. **Disable unnecessary features**
   - No debug toolbar
   - Simpler email backend

5. **Speed optimizations**
   - Disable migrations if possible
   - Reduce password iterations

### Test Settings

| Setting | Value | Purpose |
|---------|-------|---------|
| `DEBUG` | False | Match production |
| `PASSWORD_HASHERS` | MD5 | Fast hashing |
| `EMAIL_BACKEND` | locmem | In-memory email |

### Password Hasher for Tests

Use fast hasher (not secure, tests only):

| Hasher | Purpose |
|--------|---------|
| `MD5PasswordHasher` | Fast, insecure |
| Default Argon2 | Slow, secure |

### Test Database Options

| Option | Pros | Cons |
|--------|------|------|
| SQLite in-memory | Fastest | No PostgreSQL features |
| PostgreSQL | Matches prod | Slower |
| PostgreSQL + keepdb | Balance | Needs setup |

### Test Email Backend

| Backend | Purpose |
|---------|---------|
| `locmem.EmailBackend` | In-memory, testable |
| `mail.outbox` | Access sent emails |

### Disabled Features

| Feature | Reason |
|---------|--------|
| Debug toolbar | Not needed |
| Logging | Reduce noise |
| Staticfiles finders | Faster |

### Expected Outcome
- test.py optimized for speed
- Fast password hashing
- Simple email backend

### Verification Checklist
- [ ] test.py created
- [ ] Fast password hasher
- [ ] Test email backend
- [ ] Database configured

---

## Summary

### Tasks Completed in This Document
| Task # | Task Name | Key Deliverable |
|--------|-----------|-----------------|
| 32 | Create production.py - Security | Strict security settings |
| 33 | Create production.py - Database | Production database |
| 34 | Create production.py - Caching | Redis caching |
| 35 | Create test.py | Fast test settings |

### Final Settings Structure

```
config/settings/
├── __init__.py      # Environment detection
├── base.py          # Common settings
├── local.py         # Development
├── production.py    # Production security
└── test.py          # Test optimization
```

---

## Group C Complete

### All Group C Tasks Completed
| Task # | Task Name | Status |
|--------|-----------|--------|
| 19 | Create base.py - Imports Section | ✅ |
| 20 | Create base.py - Installed Apps | ✅ |
| 21 | Create base.py - Middleware | ✅ |
| 22 | Create base.py - Templates | ✅ |
| 23 | Create base.py - Database Placeholder | ✅ |
| 24 | Create base.py - Auth Settings | ✅ |
| 25 | Create base.py - Internationalization | ✅ |
| 26 | Create base.py - Static Files | ✅ |
| 27 | Create base.py - Media Files | ✅ |
| 28 | Create base.py - Security Defaults | ✅ |
| 29 | Create local.py - Debug Settings | ✅ |
| 30 | Create local.py - Database | ✅ |
| 31 | Create local.py - Email | ✅ |
| 32 | Create production.py - Security | ✅ |
| 33 | Create production.py - Database | ✅ |
| 34 | Create production.py - Caching | ✅ |
| 35 | Create test.py | ✅ |

### Environment Comparison

| Setting | Local | Production | Test |
|---------|-------|------------|------|
| DEBUG | True | False | False |
| Database | Docker PG | Managed PG | SQLite/PG |
| Cache | None/Redis | Redis | locmem |
| Email | Console | SMTP | locmem |
| Security | Relaxed | Strict | Minimal |

### Next Steps
Proceed to [Group D: Core Dependencies Installation](../Group-D_Core-Dependencies-Installation/) to install and configure core packages.

---

## Notes for AI Agents

1. **Production Security:** Never set DEBUG=True in production
2. **Environment Variables:** All secrets from environment
3. **Test Speed:** Use MD5PasswordHasher for fast tests
4. **Redis:** Used for both caching and Celery broker
5. **Git Commit:** After Group C complete, commit with message: "feat(backend): Add modular settings for all environments"
