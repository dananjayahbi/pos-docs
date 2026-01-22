# Tasks 24-28: Base Settings Configuration

> **Phase:** 01 - Project Foundation & Setup  
> **SubPhase:** 02 - Backend Project Initialization  
> **Group:** C - Settings Module Structure  
> **Document:** 02 of 04  
> **Tasks Covered:** 24, 25, 26, 27, 28

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [01_Tasks-19-23_Base-Core.md](01_Tasks-19-23_Base-Core.md)
- **→ Next Document:** [03_Tasks-29-31_Local-Settings.md](03_Tasks-29-31_Local-Settings.md)

---

## Document Overview

This document covers authentication settings, internationalization (including Sri Lanka localization), static files, media files, and security defaults.

### Tasks in This Document
| Task # | Task Name | Complexity |
|--------|-----------|------------|
| 24 | Create base.py - Auth Settings | Simple |
| 25 | Create base.py - Internationalization | Simple |
| 26 | Create base.py - Static Files | Simple |
| 27 | Create base.py - Media Files | Simple |
| 28 | Create base.py - Security Defaults | Medium |

---

## Task 24: Create base.py - Auth Settings

### Overview
Configure authentication settings including password validators and user model placeholder.

### Dependencies
- Task 19: Create base.py - Imports Section

### Instructions

1. **Configure password validators**
   - Include Django's default validators
   - User attribute similarity
   - Minimum length (8+ characters)
   - Common password check
   - Numeric password check

2. **Add AUTH_USER_MODEL placeholder**
   - Comment for custom user model
   - Will be set to users.User later

3. **Add authentication backends placeholder**
   - Comment for future backends
   - JWT, social auth considerations

### Password Validators

| Validator | Purpose |
|-----------|---------|
| `UserAttributeSimilarityValidator` | Prevent username-like passwords |
| `MinimumLengthValidator` | Minimum 8 characters |
| `CommonPasswordValidator` | Block common passwords |
| `NumericPasswordValidator` | Prevent all-numeric passwords |

### Custom User Model (Future)

| Setting | Value | When |
|---------|-------|------|
| `AUTH_USER_MODEL` | `users.User` | Phase 3 |
| Purpose | Custom user fields | Tenant-aware users |

### Password Validation Settings

| Setting | Value | Purpose |
|---------|-------|---------|
| `MIN_LENGTH` | 8 | Minimum password length |
| Custom validators | Future | Strength requirements |

### Expected Outcome
- AUTH_PASSWORD_VALIDATORS configured
- Placeholder for AUTH_USER_MODEL

### Verification Checklist
- [ ] All four password validators included
- [ ] AUTH_USER_MODEL placeholder comment
- [ ] AUTHENTICATION_BACKENDS placeholder

---

## Task 25: Create base.py - Internationalization

### Overview
Configure language, timezone, and localization settings with Sri Lanka-specific defaults.

### Dependencies
- Task 19: Create base.py - Imports Section

### Instructions

1. **Set default language**
   - LANGUAGE_CODE to 'en-us' or 'en'
   - Will support multiple languages

2. **Configure timezone**
   - TIME_ZONE to 'Asia/Colombo'
   - Sri Lanka timezone (UTC+5:30)

3. **Enable internationalization**
   - USE_I18N = True
   - USE_TZ = True for timezone-aware datetimes

4. **Configure supported languages**
   - English (primary)
   - Sinhala (si)
   - Tamil (ta)

### Sri Lanka Localization

| Setting | Value | Description |
|---------|-------|-------------|
| `TIME_ZONE` | Asia/Colombo | Sri Lanka timezone |
| `LANGUAGE_CODE` | en | Default language |
| `LANGUAGES` | en, si, ta | Supported languages |

### Language Configuration

| Code | Language | Script |
|------|----------|--------|
| `en` | English | Latin |
| `si` | Sinhala | Sinhala script |
| `ta` | Tamil | Tamil script |

### Timezone Settings

| Setting | Value | Purpose |
|---------|-------|---------|
| `TIME_ZONE` | Asia/Colombo | Default timezone |
| `USE_TZ` | True | Timezone-aware datetimes |
| `USE_I18N` | True | Enable internationalization |
| `USE_L10N` | True | Localized formatting |

### Locale Path

Add LOCALE_PATHS for translation files:
- Point to `backend/locale/` directory
- Created in SubPhase-01

### Expected Outcome
- Internationalization fully configured
- Sri Lanka timezone set
- Multiple languages supported

### Verification Checklist
- [ ] TIME_ZONE is Asia/Colombo
- [ ] USE_TZ is True
- [ ] LANGUAGES includes en, si, ta
- [ ] LOCALE_PATHS configured

---

## Task 26: Create base.py - Static Files

### Overview
Configure static files settings for CSS, JavaScript, and image assets.

### Dependencies
- Task 19: Create base.py - Imports Section

### Instructions

1. **Set STATIC_URL**
   - URL prefix for static files
   - Usually '/static/'

2. **Configure STATICFILES_DIRS**
   - Additional static file locations
   - Point to static/ directory

3. **Set STATIC_ROOT**
   - Directory for collectstatic
   - Production static file location

4. **Configure finders**
   - FileSystemFinder for STATICFILES_DIRS
   - AppDirectoriesFinder for app static/

### Static Files Settings

| Setting | Value | Purpose |
|---------|-------|---------|
| `STATIC_URL` | /static/ | URL prefix |
| `STATICFILES_DIRS` | [BASE_DIR / 'static'] | Dev static dir |
| `STATIC_ROOT` | BASE_DIR / 'staticfiles' | Collected static |

### Static File Finders

| Finder | Purpose |
|--------|---------|
| `FileSystemFinder` | Finds files in STATICFILES_DIRS |
| `AppDirectoriesFinder` | Finds files in app/static/ |

### Static Files Workflow

| Environment | Serving Method |
|-------------|----------------|
| Development | Django serves directly |
| Production | Nginx/WhiteNoise |
| Docker | Volume mounted or collected |

### Directory Purpose

| Directory | Contents |
|-----------|----------|
| `static/` | Source static files |
| `staticfiles/` | Collected output (gitignored) |

### Expected Outcome
- Static files configured for dev and prod
- STATIC_ROOT for collectstatic

### Verification Checklist
- [ ] STATIC_URL set to /static/
- [ ] STATICFILES_DIRS includes static/
- [ ] STATIC_ROOT configured
- [ ] Finders configured

---

## Task 27: Create base.py - Media Files

### Overview
Configure media file settings for user-uploaded content like images and documents.

### Dependencies
- Task 19: Create base.py - Imports Section

### Instructions

1. **Set MEDIA_URL**
   - URL prefix for media files
   - Usually '/media/'

2. **Set MEDIA_ROOT**
   - Filesystem path for uploads
   - Point to media/ directory

3. **Add upload size limits**
   - DATA_UPLOAD_MAX_MEMORY_SIZE
   - FILE_UPLOAD_MAX_MEMORY_SIZE

4. **Document storage strategy**
   - Local storage for development
   - Cloud storage for production (future)

### Media Files Settings

| Setting | Value | Purpose |
|---------|-------|---------|
| `MEDIA_URL` | /media/ | URL prefix |
| `MEDIA_ROOT` | BASE_DIR / 'media' | Upload directory |

### Upload Size Limits

| Setting | Value | Purpose |
|---------|-------|---------|
| `DATA_UPLOAD_MAX_MEMORY_SIZE` | 10MB | Max form data |
| `FILE_UPLOAD_MAX_MEMORY_SIZE` | 10MB | Max file in memory |

### Media File Types (Expected)

| Type | Examples | Module |
|------|----------|--------|
| **Product Images** | JPG, PNG, WebP | Inventory |
| **Documents** | PDF, receipts | POS, Sales |
| **User Avatars** | JPG, PNG | Users |
| **Tenant Logos** | PNG, SVG | Tenants |

### Storage Backends (Future)

| Environment | Backend |
|-------------|---------|
| Development | FileSystemStorage |
| Production | S3/CloudStorage |
| Docker | Volume storage |

### Expected Outcome
- Media files configured
- Upload limits set

### Verification Checklist
- [ ] MEDIA_URL set to /media/
- [ ] MEDIA_ROOT points to media/
- [ ] Upload size limits configured
- [ ] Storage backend commented

---

## Task 28: Create base.py - Security Defaults

### Overview
Configure security settings with sensible defaults that can be overridden in environment-specific settings.

### Dependencies
- Task 19: Create base.py - Imports Section

### Instructions

1. **Configure CSRF settings**
   - CSRF_COOKIE_SECURE placeholder
   - CSRF_TRUSTED_ORIGINS placeholder

2. **Configure session security**
   - SESSION_COOKIE_SECURE placeholder
   - SESSION_COOKIE_HTTPONLY

3. **Add security headers**
   - X_FRAME_OPTIONS (DENY)
   - SECURE_CONTENT_TYPE_NOSNIFF
   - SECURE_BROWSER_XSS_FILTER

4. **Add HTTPS settings (placeholders)**
   - SECURE_SSL_REDIRECT (False default)
   - SECURE_HSTS_SECONDS (0 default)

### Security Settings Overview

| Setting | Base Value | Local | Production |
|---------|------------|-------|------------|
| `DEBUG` | False | True | False |
| `CSRF_COOKIE_SECURE` | False | False | True |
| `SESSION_COOKIE_SECURE` | False | False | True |
| `SECURE_SSL_REDIRECT` | False | False | True |
| `SECURE_HSTS_SECONDS` | 0 | 0 | 31536000 |

### CSRF Configuration

| Setting | Development | Production |
|---------|-------------|------------|
| `CSRF_COOKIE_SECURE` | False | True |
| `CSRF_COOKIE_HTTPONLY` | False | True |
| `CSRF_TRUSTED_ORIGINS` | localhost | domain list |

### Session Security

| Setting | Value | Purpose |
|---------|-------|---------|
| `SESSION_COOKIE_HTTPONLY` | True | Prevent JS access |
| `SESSION_COOKIE_SECURE` | Env-based | HTTPS only |
| `SESSION_COOKIE_AGE` | 1209600 | 2 weeks default |

### Security Headers

| Setting | Value | Purpose |
|---------|-------|---------|
| `X_FRAME_OPTIONS` | DENY | Prevent clickjacking |
| `SECURE_CONTENT_TYPE_NOSNIFF` | True | Prevent MIME sniffing |
| `SECURE_BROWSER_XSS_FILTER` | True | XSS protection |

### HSTS Settings (Production Only)

| Setting | Value | Purpose |
|---------|-------|---------|
| `SECURE_HSTS_SECONDS` | 31536000 | 1 year |
| `SECURE_HSTS_INCLUDE_SUBDOMAINS` | True | All subdomains |
| `SECURE_HSTS_PRELOAD` | True | Preload list |

### Expected Outcome
- Security defaults configured
- Easy to override in environment settings

### Verification Checklist
- [ ] CSRF settings included
- [ ] Session security configured
- [ ] Security headers set
- [ ] HTTPS settings as placeholders

---

## Summary

### Tasks Completed in This Document
| Task # | Task Name | Key Deliverable |
|--------|-----------|-----------------|
| 24 | Create base.py - Auth Settings | Password validators |
| 25 | Create base.py - Internationalization | Sri Lanka localization |
| 26 | Create base.py - Static Files | Static file config |
| 27 | Create base.py - Media Files | Media file config |
| 28 | Create base.py - Security Defaults | Security settings |

### base.py Complete

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
├── AUTH_PASSWORD_VALIDATORS    ✅ Task 24
├── LANGUAGE/TIME               ✅ Task 25
├── STATIC                      ✅ Task 26
├── MEDIA                       ✅ Task 27
└── SECURITY                    ✅ Task 28
```

### Sri Lanka Configuration Summary

| Setting | Value |
|---------|-------|
| Timezone | Asia/Colombo |
| Languages | English, Sinhala, Tamil |
| Currency | LKR (handled in code) |

### Next Steps
Proceed to [03_Tasks-29-31_Local-Settings.md](03_Tasks-29-31_Local-Settings.md) to create local development settings.

---

## Notes for AI Agents

1. **Sri Lanka Focus:** TIME_ZONE must be Asia/Colombo
2. **Languages:** Support en, si (Sinhala), ta (Tamil)
3. **Security Defaults:** Conservative in base, relaxed in local
4. **Static/Media:** Different handling in dev vs prod
5. **Git Commit:** Do NOT commit yet - complete all Group C tasks first
