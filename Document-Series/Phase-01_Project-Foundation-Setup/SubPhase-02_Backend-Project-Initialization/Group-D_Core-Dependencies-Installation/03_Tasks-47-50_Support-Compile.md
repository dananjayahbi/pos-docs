# Tasks 47-50: Support Packages & Compilation

> **Phase:** 01 - Project Foundation & Setup  
> **SubPhase:** 02 - Backend Project Initialization  
> **Group:** D - Core Dependencies Installation  
> **Document:** 03 of 03  
> **Tasks Covered:** 47, 48, 49, 50

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [02_Tasks-41-46_Extensions.md](02_Tasks-41-46_Extensions.md)
- **→ Next Document:** [../Group-E_Django-Apps-Directory-Setup/00_GROUP_OVERVIEW.md](../Group-E_Django-Apps-Directory-Setup/00_GROUP_OVERVIEW.md)

---

## Document Overview

This document covers installing support packages (Redis, Pillow, WhiteNoise) and compiling all requirements files.

### Tasks in This Document
| Task # | Task Name | Complexity |
|--------|-----------|------------|
| 47 | Install redis client | Simple |
| 48 | Install Pillow | Simple |
| 49 | Install whitenoise | Simple |
| 50 | Compile all requirements files | Medium |

---

## Task 47: Install redis Client

### Overview
Install the Redis Python client for caching and Celery broker connectivity.

### Dependencies
- Task 05: Create requirements/base.in (Group A)

### Instructions

1. **Add to base.in**
   - Add redis to requirements/base.in
   - Include hiredis for performance

2. **Note Redis usage**
   - Celery broker
   - Django caching backend
   - Session storage option

### Package Information

| Package | Version | Purpose |
|---------|---------|---------|
| `redis` | >=5.0 | Redis client |
| `hiredis` | >=2.0 | C parser for speed |

### Redis Use Cases

| Use Case | Configuration |
|----------|---------------|
| Cache backend | CACHES setting |
| Celery broker | CELERY_BROKER_URL |
| Celery results | CELERY_RESULT_BACKEND |
| Session storage | SESSION_ENGINE |

### Cache Configuration (Preview)

Will configure in base.py:

| Setting | Value |
|---------|-------|
| `BACKEND` | django_redis.cache.RedisCache |
| `LOCATION` | redis://redis:6379/1 |

### Connection Details

| Environment | Redis URL |
|-------------|-----------|
| Development | redis://redis:6379/0 |
| Testing | redis://redis:6379/15 |
| Production | From environment variable |

### Expected Outcome
- Redis client ready
- Caching and broker connectivity available

### Verification Checklist
- [ ] redis in base.in
- [ ] hiredis in base.in

---

## Task 48: Install Pillow

### Overview
Install Pillow for image processing, required for ImageField in Django models.

### Dependencies
- Task 05: Create requirements/base.in (Group A)

### Instructions

1. **Add to base.in**
   - Add Pillow to requirements/base.in

2. **Understand usage**
   - Product images
   - User avatars
   - Logo uploads

### Package Information

| Package | Version | Purpose |
|---------|---------|---------|
| `Pillow` | >=10.0 | Image processing |

### Image Processing Capabilities

| Feature | Use Case |
|---------|----------|
| Resize | Thumbnail generation |
| Format conversion | WebP optimization |
| Validation | Verify image uploads |
| EXIF | Remove metadata |

### Django Integration

| Field | Purpose |
|-------|---------|
| `ImageField` | Product images |
| `ImageField` | User avatars |
| `ImageField` | Company logos |

### Image Optimization

| Format | Use Case |
|--------|----------|
| WebP | Modern browsers |
| JPEG | Product photos |
| PNG | Logos, icons |

### Expected Outcome
- Image handling ready
- ImageField support enabled

### Verification Checklist
- [ ] Pillow in base.in
- [ ] Version >= 10.0 specified

---

## Task 49: Install whitenoise

### Overview
Install WhiteNoise for serving static files directly from Django/Gunicorn.

### Dependencies
- Task 05: Create requirements/base.in (Group A)

### Instructions

1. **Add to base.in**
   - Add whitenoise to requirements/base.in

2. **Add to MIDDLEWARE**
   - Insert after SecurityMiddleware
   - Before other middleware

3. **Configure static files**
   - STATICFILES_STORAGE setting

### Package Information

| Package | Version | Purpose |
|---------|---------|---------|
| `whitenoise` | >=6.6 | Static file serving |

### Middleware Position

WhiteNoise middleware order:

| Position | Middleware |
|----------|------------|
| 1 | SecurityMiddleware |
| 2 | **WhiteNoiseMiddleware** |
| 3 | SessionMiddleware |
| 4 | CommonMiddleware |
| ... | Other middleware |

### Production Configuration

| Setting | Value |
|---------|-------|
| `STATICFILES_STORAGE` | whitenoise.storage.CompressedManifestStaticFilesStorage |

### WhiteNoise Features

| Feature | Benefit |
|---------|---------|
| Compression | Gzip/Brotli |
| Caching | Cache-Control headers |
| Immutable | Fingerprinted files |
| Self-serve | No nginx needed |

### Expected Outcome
- Static file serving configured
- Production-ready setup

### Verification Checklist
- [ ] whitenoise in base.in
- [ ] Middleware position noted for later

---

## Task 50: Compile All Requirements Files

### Overview
Use pip-compile to generate locked requirements.txt files from .in files.

### Dependencies
- Task 04: Install pip-tools (Group A)
- Tasks 36-49: All packages added to .in files

### Instructions

1. **Activate virtual environment**
   - Ensure venv is active

2. **Compile base.txt**
   - Run pip-compile on base.in
   - Output to base.txt

3. **Compile local.txt**
   - Run pip-compile on local.in
   - Output to local.txt

4. **Compile production.txt**
   - Run pip-compile on production.in
   - Output to production.txt

5. **Compile test.txt**
   - Run pip-compile on test.in
   - Output to test.txt

6. **Verify all .txt files**
   - Check each compiled file
   - Ensure dependencies resolved

### pip-compile Commands

| Command | Purpose |
|---------|---------|
| `pip-compile requirements/base.in -o requirements/base.txt` | Compile base |
| `pip-compile requirements/local.in -o requirements/local.txt` | Compile local |
| `pip-compile requirements/production.in -o requirements/production.txt` | Compile production |
| `pip-compile requirements/test.in -o requirements/test.txt` | Compile test |

### Compilation Order

| Order | File | Reason |
|-------|------|--------|
| 1 | base.txt | Base dependency |
| 2 | local.txt | Includes base |
| 3 | production.txt | Includes base |
| 4 | test.txt | Includes base |

### Command Flags

| Flag | Purpose |
|------|---------|
| `--generate-hashes` | Security (optional) |
| `--upgrade` | Update to latest |
| `--upgrade-package <pkg>` | Upgrade specific |
| `--resolver=backtracking` | Default resolver |

### Expected Output Structure

requirements/
├── base.in
├── base.txt (compiled)
├── local.in
├── local.txt (compiled)
├── production.in
├── production.txt (compiled)
├── test.in
└── test.txt (compiled)

### Final base.in Content Summary

```
# Django Core
Django>=5.0,<6.0
django-environ>=0.11.2

# Database
psycopg[binary]>=3.1
django-tenants>=3.6

# REST API
djangorestframework>=3.14
django-cors-headers>=4.3
django-filter>=23.5
djangorestframework-simplejwt>=5.3
drf-spectacular>=0.26

# Task Queue
celery>=5.3
django-celery-beat>=2.5
django-celery-results>=2.5

# Caching
redis>=5.0
hiredis>=2.0

# Media
Pillow>=10.0

# Static Files
whitenoise>=6.6
```

### Compiled File Characteristics

| Aspect | Description |
|--------|-------------|
| Pinned versions | Exact versions locked |
| All dependencies | Transitive deps included |
| Hashes | Optional for security |
| Comments | Source .in file noted |

### Expected Outcome
- All .txt files generated
- Dependencies locked
- Ready for installation

### Verification Checklist
- [ ] base.txt exists and complete
- [ ] local.txt exists and complete
- [ ] production.txt exists and complete
- [ ] test.txt exists and complete
- [ ] No compilation errors

---

## Summary

### Tasks Completed in This Document
| Task # | Task Name | Key Deliverable |
|--------|-----------|-----------------|
| 47 | Install redis client | Cache/broker client |
| 48 | Install Pillow | Image processing |
| 49 | Install whitenoise | Static file serving |
| 50 | Compile all requirements files | Locked dependencies |

### Group D Complete Package List

| Category | Packages |
|----------|----------|
| API Core | djangorestframework, django-cors-headers |
| Multi-tenancy | django-tenants |
| Database | psycopg[binary] |
| Environment | django-environ |
| Filtering | django-filter |
| Authentication | djangorestframework-simplejwt |
| Documentation | drf-spectacular |
| Task Queue | celery, django-celery-beat, django-celery-results |
| Caching | redis, hiredis |
| Media | Pillow |
| Static Files | whitenoise |

### Generated Files

| File | Content |
|------|---------|
| base.txt | All production packages locked |
| local.txt | Development tools locked |
| production.txt | Production extras locked |
| test.txt | Testing packages locked |

### Git Commit Message
```
feat(deps): install core dependencies and compile requirements

- Add Django REST Framework and extensions
- Add django-tenants for multi-tenancy
- Add Celery for background tasks
- Add Redis client for caching
- Add media and static file packages
- Compile all requirements files

SubPhase-02 Group D complete
```

### Next Steps
Proceed to [Group E](../Group-E_Django-Apps-Directory-Setup/00_GROUP_OVERVIEW.md) for Django apps directory structure.

---

## Notes for AI Agents

1. **Compilation:** Run pip-compile in order (base first)
2. **Activation:** Ensure venv is active before compiling
3. **Errors:** Resolve any version conflicts during compilation
4. **Hashes:** Optional but recommended for production
5. **Git:** Commit after this document completes Group D
