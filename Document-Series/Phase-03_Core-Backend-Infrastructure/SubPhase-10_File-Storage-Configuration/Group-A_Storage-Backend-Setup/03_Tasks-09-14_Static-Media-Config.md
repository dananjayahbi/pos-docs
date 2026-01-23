# Tasks 09-14: Static and Media Configuration

> **Phase:** 03 - Core Backend Infrastructure  
> **SubPhase:** 10 - File Storage Configuration  
> **Group:** A - Storage Backend Setup  
> **Document:** 03 of 03  
> **Tasks Covered:** 09, 10, 11, 12, 13, 14

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [02_Tasks-05-08_Storage-Module-Setup.md](02_Tasks-05-08_Storage-Module-Setup.md)
- **→ Next Group:** [../../Group-B_Tenant-Isolated-Storage/](../../Group-B_Tenant-Isolated-Storage/)

---

## Document Overview

This document completes the basic storage configuration by setting up MEDIA_ROOT for local file storage, configuring static files, creating the media directory structure, and testing basic file upload functionality.

### Tasks in This Document
| Task # | Task Name | Complexity |
|--------|-----------|------------|
| 09 | Configure MEDIA_ROOT | Simple |
| 10 | Configure STATIC_URL | Simple |
| 11 | Configure STATIC_ROOT | Simple |
| 12 | Create Media Directory | Simple |
| 13 | Import Storage Settings | Simple |
| 14 | Test Basic File Upload | Simple |

---

## Task 09: Configure MEDIA_ROOT

### Overview
Configure MEDIA_ROOT, which defines the absolute filesystem path where user-uploaded media files will be stored during development.

### Dependencies
- Task 08: Configure MEDIA_URL

### Instructions

1. **Open storage settings file**
   - Navigate to `backend/config/settings/storage.py`
   - Locate where MEDIA_URL is defined

2. **Import required utilities**
   - Ensure os module is imported
   - Import BASE_DIR from base settings

3. **Add MEDIA_ROOT setting**
   - Define MEDIA_ROOT below MEDIA_URL
   - Set path relative to BASE_DIR
   - Point to backend/media/ directory

4. **Add directory structure comment**
   - Document expected subdirectory structure
   - Note tenant isolation pattern
   - Explain public vs tenant directories

5. **Verify path construction**
   - Ensure path uses OS-independent joining
   - Confirm path is absolute
   - Test that path resolves correctly

### MEDIA_ROOT Configuration

| Setting | Value | Purpose |
|---------|-------|---------|
| **MEDIA_ROOT** | BASE_DIR / 'media' | Absolute path to media files |
| **Path Type** | Absolute | Required by Django |
| **Structure** | Tenant-isolated | Separate directories per tenant |

### Directory Structure Planning

```
backend/media/
├── tenant_<schema_name>/       # Tenant-specific uploads
│   ├── products/               # Product images
│   ├── invoices/               # Invoice PDFs
│   ├── receipts/               # Receipt documents
│   └── profile_pics/           # User profile pictures
├── public/                     # Public shared files
│   ├── logos/                  # Company logos
│   └── assets/                 # Public assets
└── .gitkeep                    # Keep directory in git
```

### Tenant Isolation Pattern

| Pattern | Example | Use Case |
|---------|---------|----------|
| `tenant_{schema}/products/` | tenant_shop123/products/img1.jpg | Product images |
| `tenant_{schema}/invoices/` | tenant_cafe456/invoices/inv001.pdf | Invoice PDFs |
| `tenant_{schema}/profile/` | tenant_store789/profile/user1.jpg | User avatars |
| `public/` | public/logos/platform_logo.png | Shared public files |

### Path Construction Methods

| Method | Example | Notes |
|--------|---------|-------|
| **os.path.join()** | os.path.join(BASE_DIR, 'media') | Python 2/3 compatible |
| **Path() / operator** | BASE_DIR / 'media' | Python 3.4+ pathlib |
| **String format** | f"{BASE_DIR}/media" | OS-specific issues |

### Expected Outcome
```python
# In config/settings/storage.py:

# Local File Storage (Development)
# ================================
MEDIA_URL = '/media/'
MEDIA_ROOT = BASE_DIR / 'media'  # Absolute path to media directory

# Directory structure:
# media/
#   tenant_<schema>/  - Tenant-isolated uploads
#   public/          - Public shared files
```

### Verification Checklist
- [ ] MEDIA_ROOT setting added below MEDIA_URL
- [ ] Path uses BASE_DIR reference
- [ ] Path is absolute (not relative)
- [ ] Comment explains directory structure
- [ ] Path construction is OS-independent

---

## Task 10: Configure STATIC_URL

### Overview
Configure STATIC_URL, which defines the base URL for serving static files (CSS, JavaScript, images) that are part of the application code.

### Dependencies
- Task 09: Configure MEDIA_ROOT

### Instructions

1. **Open storage settings file**
   - Navigate to `backend/config/settings/storage.py`
   - Locate the Static Files Configuration section

2. **Add STATIC_URL setting**
   - Define STATIC_URL constant
   - Set value to '/static/'
   - Add inline comment explaining purpose

3. **Document static vs media difference**
   - Static: Application files (CSS, JS, images)
   - Media: User-uploaded files
   - Different serving mechanisms

4. **Add static files examples**
   - Django admin CSS and JavaScript
   - Custom application stylesheets
   - Frontend framework files
   - Third-party library assets

### Static vs Media Files

| Aspect | Static Files | Media Files |
|--------|--------------|-------------|
| **Purpose** | Application assets | User uploads |
| **Source** | Code repository | User input |
| **Examples** | CSS, JS, icons | Images, PDFs, documents |
| **URL** | /static/ | /media/ |
| **Location** | STATIC_ROOT | MEDIA_ROOT |
| **Management** | collectstatic command | Upload handlers |
| **Version Control** | In git | Not in git |

### STATIC_URL Configuration

| Setting | Value | Purpose |
|---------|-------|---------|
| **STATIC_URL** | '/static/' | Base URL for static files |
| **Trailing Slash** | Required | URL joining |
| **CDN Support** | Future | Can point to CDN |

### Static Files Sources

| Source | Location | Purpose |
|--------|----------|---------|
| **Django Admin** | django/contrib/admin/static/ | Admin interface |
| **App Static** | apps/*/static/ | Application assets |
| **Third-Party** | site-packages/*/static/ | Library assets |
| **Custom** | static/ (root level) | Project-wide static |

### Static File Collection

During deployment:
1. Django collects static files from all apps
2. Files are copied to STATIC_ROOT directory
3. Web server serves files from STATIC_ROOT
4. STATIC_URL points to serving location

### Expected Outcome
```python
# In config/settings/storage.py:

# Static Files Configuration
# ===========================
STATIC_URL = '/static/'  # Base URL for static files (CSS, JS, images)
```

### Verification Checklist
- [ ] STATIC_URL setting added to storage.py
- [ ] Value set to '/static/' with trailing slash
- [ ] Inline comment explains purpose
- [ ] Static vs media difference documented

---

## Task 11: Configure STATIC_ROOT

### Overview
Configure STATIC_ROOT, which defines the absolute filesystem path where Django collects all static files for production deployment.

### Dependencies
- Task 10: Configure STATIC_URL

### Instructions

1. **Open storage settings file**
   - Navigate to `backend/config/settings/storage.py`
   - Locate where STATIC_URL is defined

2. **Add STATIC_ROOT setting**
   - Define STATIC_ROOT below STATIC_URL
   - Set path to backend/staticfiles/ directory
   - Use BASE_DIR for absolute path

3. **Document collectstatic process**
   - Explain Django's collectstatic command
   - Note when to run the command
   - List collected file sources

4. **Add deployment notes**
   - Development: Not typically needed
   - Production: Required for web server
   - Docker: Part of build process

### STATIC_ROOT Configuration

| Setting | Value | Purpose |
|---------|-------|---------|
| **STATIC_ROOT** | BASE_DIR / 'staticfiles' | Collected static files |
| **Used In** | Production | Deployment target |
| **Created By** | collectstatic | Django management command |

### collectstatic Command

The collectstatic management command:
- Searches all STATICFILES_DIRS locations
- Searches all installed apps' static/ directories
- Copies all found static files to STATIC_ROOT
- Overwrites existing files
- Reports number of files collected

### When to Run collectstatic

| Scenario | When to Run | Why |
|----------|-------------|-----|
| **Local Development** | Not needed | Dev server serves directly |
| **Docker Build** | During build | Prepare for production |
| **Production Deploy** | Before starting | Update static assets |
| **After Static Changes** | After changes | Refresh collected files |

### Static Files Directory Structure

```
backend/staticfiles/          # STATIC_ROOT
├── admin/                    # Django admin assets
│   ├── css/
│   ├── js/
│   └── img/
├── rest_framework/           # DRF assets
│   ├── css/
│   └── js/
└── [app_name]/              # Custom app static files
    ├── css/
    ├── js/
    └── images/
```

### Production Serving

| Environment | Configuration |
|-------------|---------------|
| **Development** | Django dev server serves from app static/ dirs |
| **nginx** | Serves from STATIC_ROOT with location /static/ |
| **Apache** | Serves with Alias directive |
| **CDN** | collectstatic + upload to S3/CDN |

### Expected Outcome
```python
# In config/settings/storage.py:

# Static Files Configuration
# ===========================
STATIC_URL = '/static/'
STATIC_ROOT = BASE_DIR / 'staticfiles'  # Collected static files for production

# Run 'python manage.py collectstatic' to collect files
```

### Verification Checklist
- [ ] STATIC_ROOT setting added below STATIC_URL
- [ ] Path points to backend/staticfiles/
- [ ] Comment explains collectstatic usage
- [ ] Path is absolute (uses BASE_DIR)

---

## Task 12: Create Media Directory

### Overview
Create the media directory structure in the backend folder and configure it to be tracked in git while ignoring uploaded files.

### Dependencies
- Task 09: Configure MEDIA_ROOT

### Instructions

1. **Create media directory**
   - Navigate to backend/ directory
   - Create media/ directory
   - Verify directory matches MEDIA_ROOT setting

2. **Create subdirectory structure**
   - Create public/ subdirectory for shared files
   - Consider creating tenant template structure
   - Document planned directory organization

3. **Create .gitkeep file**
   - Create .gitkeep file in media/ directory
   - Ensures empty directory is tracked in git
   - Add comment explaining purpose

4. **Update .gitignore**
   - Open .gitignore file in backend/ directory
   - Add media/* to ignore uploaded files
   - Add !media/.gitkeep to track .gitkeep file
   - Verify other media paths are ignored

5. **Set appropriate permissions**
   - Ensure media directory is writable
   - Check permissions in Docker context
   - Verify web server can write files

### Media Directory Structure

```
backend/media/
├── .gitkeep                  # Track empty directory
├── public/                   # Public shared files
│   └── .gitkeep
└── README.md                 # Documentation (optional)

# Tenant directories created dynamically:
# tenant_<schema>/            # Created on first upload
#   ├── products/
#   ├── invoices/
#   └── profile_pics/
```

### .gitkeep File Purpose

| Purpose | Why Important |
|---------|---------------|
| **Track Empty Dirs** | Git doesn't track empty directories |
| **Preserve Structure** | Maintains directory in repository |
| **Deployment Ready** | Directory exists on fresh clone |
| **Permission Setup** | Allows permission configuration |

### .gitignore Configuration

```
# In backend/.gitignore:

# Media files (user uploads)
media/*
!media/.gitkeep
!media/public/
media/public/*
!media/public/.gitkeep

# Static files (collected)
staticfiles/
```

### Gitignore Pattern Explanation

| Pattern | Effect |
|---------|--------|
| `media/*` | Ignore all files in media/ |
| `!media/.gitkeep` | Track .gitkeep file |
| `!media/public/` | Don't ignore public/ directory itself |
| `media/public/*` | Ignore files inside public/ |
| `!media/public/.gitkeep` | Track public/.gitkeep file |

### Directory Permissions

| Environment | Permissions | Owner | Notes |
|-------------|-------------|-------|-------|
| **Local Dev** | 755 | Current user | Standard permissions |
| **Docker** | 755 | www-data | Web server user |
| **Production** | 755 | nginx/apache | Web server user |

### Expected Outcome
```
backend/
├── media/                    # MEDIA_ROOT directory
│   ├── .gitkeep             # Track directory in git
│   └── public/              # Public files
│       └── .gitkeep
└── .gitignore               # Updated to ignore uploads
```

### Verification Checklist
- [ ] media/ directory created in backend/
- [ ] .gitkeep file created in media/
- [ ] public/ subdirectory created
- [ ] .gitkeep file created in public/
- [ ] .gitignore updated to ignore media files
- [ ] .gitkeep files are tracked in git
- [ ] Directory has correct permissions

---

## Task 13: Import Storage Settings

### Overview
Import the storage settings module into the base settings file to make storage configuration active across the entire application.

### Dependencies
- Task 12: Create Media Directory
- Task 07: Create Storage Settings File

### Instructions

1. **Open base settings file**
   - Navigate to `backend/config/settings/base.py`
   - Locate the imports section or end of file

2. **Add storage settings import**
   - Import all settings from storage module
   - Use `from .storage import *` syntax
   - Place after Django default settings

3. **Add import comment**
   - Add comment explaining storage import
   - Note that storage.py contains file storage config
   - Reference storage.py for modifications

4. **Verify import order**
   - Import storage after base Django settings
   - Import before environment-specific overrides
   - Ensure no circular import issues

5. **Test settings access**
   - Verify MEDIA_URL is accessible
   - Verify MEDIA_ROOT is accessible
   - Confirm no import errors

### Settings Import Structure

```
base.py:
├── Django core settings
├── Third-party app settings
├── Custom app settings
├── Storage settings (import)        # ← Add here
└── Additional custom settings
```

### Import Placement Strategy

| Location | Purpose | Example |
|----------|---------|---------|
| **Top of file** | Core Django overrides | SECRET_KEY, DEBUG |
| **Middle** | App configurations | INSTALLED_APPS, MIDDLEWARE |
| **After apps** | Module imports | Storage, cache, celery |
| **End** | Environment overrides | Development/production |

### Import Statement

```python
# In config/settings/base.py:

# File Storage Configuration
# ==========================
from .storage import *  # MEDIA_URL, MEDIA_ROOT, STATIC_URL, STATIC_ROOT
```

### Verifying the Import

Test in Django shell:
1. Start Django shell: `python manage.py shell`
2. Import settings: `from django.conf import settings`
3. Check MEDIA_URL: `print(settings.MEDIA_URL)`
4. Check MEDIA_ROOT: `print(settings.MEDIA_ROOT)`
5. Verify paths are correct

### Import Best Practices

| Practice | Reason |
|----------|--------|
| **Use from .module import *** | Import all module settings |
| **Add comments** | Explain what's being imported |
| **Group imports** | Related settings together |
| **Avoid circular imports** | Keep imports in correct order |

### Expected Outcome
```python
# In config/settings/base.py (excerpt):

# ... other settings ...

# File Storage Configuration
# ==========================
from .storage import *  # Media and static file settings
```

### Verification Checklist
- [ ] Storage settings import added to base.py
- [ ] Import uses `from .storage import *` syntax
- [ ] Comment explains what's imported
- [ ] No import errors occur
- [ ] MEDIA_URL accessible in settings
- [ ] MEDIA_ROOT accessible in settings
- [ ] Settings load correctly

---

## Task 14: Test Basic File Upload

### Overview
Verify that the basic file storage configuration is working by testing file upload functionality in Django shell or admin interface.

### Dependencies
- Task 13: Import Storage Settings

### Instructions

1. **Start Django development server**
   - Navigate to backend/ directory
   - Start server with `python manage.py runserver`
   - Verify server starts without errors

2. **Create test model with file field (optional)**
   - Define simple model with FileField or ImageField
   - Run migrations if creating new model
   - Or use existing model with file field

3. **Test file upload in Django shell**
   - Open Django shell: `python manage.py shell`
   - Import necessary models
   - Create test file upload
   - Verify file is saved to MEDIA_ROOT

4. **Verify file storage location**
   - Check that file appears in media/ directory
   - Verify correct subdirectory structure
   - Confirm file permissions are correct

5. **Test file URL access**
   - Get file URL from object
   - Verify URL matches MEDIA_URL + path
   - Test accessing file in browser (if server running)

6. **Clean up test files**
   - Delete test files from media/ directory
   - Remove test database entries
   - Verify cleanup is complete

### File Upload Test Methods

| Method | Complexity | Use Case |
|--------|------------|----------|
| **Django Shell** | Low | Quick verification |
| **Admin Interface** | Low | Visual confirmation |
| **Test Case** | Medium | Automated testing |
| **API Endpoint** | Medium | Integration testing |

### Django Shell Test

```python
# In Django shell:

from django.core.files.base import ContentFile
from django.core.files.storage import default_storage

# Test file save
path = default_storage.save('test/test.txt', ContentFile(b'test content'))
print(f"File saved to: {path}")

# Test file exists
exists = default_storage.exists(path)
print(f"File exists: {exists}")

# Test file URL
url = default_storage.url(path)
print(f"File URL: {url}")

# Cleanup
default_storage.delete(path)
```

### Verification Points

| Check | Expected Result |
|-------|-----------------|
| **File Created** | File exists in media/ directory |
| **Correct Path** | File in expected subdirectory |
| **Correct URL** | URL starts with MEDIA_URL |
| **Accessible** | Can access file via URL (dev server) |
| **Permissions** | File is readable |

### Common Issues and Solutions

| Issue | Cause | Solution |
|-------|-------|----------|
| **File not created** | Permission error | Check directory permissions |
| **Wrong location** | MEDIA_ROOT misconfigured | Verify MEDIA_ROOT path |
| **404 on access** | URL not configured | Check MEDIA_URL in urls.py |
| **Import error** | Settings not loaded | Verify storage import in base.py |

### Development URL Configuration

For file access in development, ensure urls.py includes:
```python
# In config/urls.py (development only):

if settings.DEBUG:
    from django.conf.urls.static import static
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
```

### Expected Outcome
```
backend/media/
├── .gitkeep
├── public/
└── test/                     # Test directory (temporary)
    └── test.txt              # Test file (to be deleted)

✓ File upload successful
✓ File stored in correct location
✓ File accessible via URL
✓ No errors in Django logs
```

### Verification Checklist
- [ ] Django server starts without errors
- [ ] Test file successfully created
- [ ] File appears in media/ directory
- [ ] File path matches MEDIA_ROOT
- [ ] File URL matches MEDIA_URL + path
- [ ] File accessible via browser (if server running)
- [ ] Test files cleaned up
- [ ] No errors in console

---

## Summary

### Tasks Completed in This Document
| Task # | Task Name | Key Deliverable |
|--------|-----------|-----------------|
| 09 | Configure MEDIA_ROOT | MEDIA_ROOT = BASE_DIR / 'media' |
| 10 | Configure STATIC_URL | STATIC_URL = '/static/' |
| 11 | Configure STATIC_ROOT | STATIC_ROOT = BASE_DIR / 'staticfiles' |
| 12 | Create Media Directory | media/ directory with .gitkeep |
| 13 | Import Storage Settings | Storage settings imported in base.py |
| 14 | Test Basic File Upload | File upload verified working |

### Final Storage Configuration
```
backend/
├── config/
│   └── settings/
│       ├── base.py           # Imports storage settings
│       └── storage.py        # Complete storage configuration
├── apps/
│   └── core/
│       └── storage/
│           └── __init__.py
├── media/                    # MEDIA_ROOT
│   ├── .gitkeep
│   └── public/
│       └── .gitkeep
└── .gitignore               # Ignores media files
```

### Configuration Summary

| Setting | Value | Purpose |
|---------|-------|---------|
| MEDIA_URL | '/media/' | Media file URLs |
| MEDIA_ROOT | BASE_DIR / 'media' | Media file storage |
| STATIC_URL | '/static/' | Static file URLs |
| STATIC_ROOT | BASE_DIR / 'staticfiles' | Collected static files |

### Group A Completion
All 14 tasks in Group A are now complete. The basic storage infrastructure is ready:
- ✓ Storage packages installed
- ✓ Storage module created
- ✓ Storage settings configured
- ✓ Media directory structure created
- ✓ Basic file upload tested

### Next Steps
1. **Commit changes** with message: `feat(storage): configure basic file storage infrastructure`
2. Proceed to [../../Group-B_Tenant-Isolated-Storage/](../../Group-B_Tenant-Isolated-Storage/) to implement tenant isolation

---

## Notes for AI Agents

1. **Execution Order:** Tasks 09-14 must be executed sequentially
2. **Path Format:** Use pathlib Path() / operator for OS-independent paths
3. **Gitignore:** Critical to ignore media/* but track .gitkeep
4. **Testing:** Always test file upload after configuration
5. **Import Order:** Storage settings must be imported in base.py
6. **Development URLs:** Add media URL serving for DEBUG=True
7. **Cleanup:** Remove test files after verification
