# Tasks 05-08: Storage Module Setup

> **Phase:** 03 - Core Backend Infrastructure  
> **SubPhase:** 10 - File Storage Configuration  
> **Group:** A - Storage Backend Setup  
> **Document:** 02 of 03  
> **Tasks Covered:** 05, 06, 07, 08

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [01_Tasks-01-04_Package-Installation.md](01_Tasks-01-04_Package-Installation.md)
- **→ Next Document:** [03_Tasks-09-14_Static-Media-Config.md](03_Tasks-09-14_Static-Media-Config.md)

---

## Document Overview

This document covers the creation of the storage module and initial configuration of media URL settings. The storage module will house all file storage-related configurations, custom storage backends, and utility functions for file management.

### Tasks in This Document
| Task # | Task Name | Complexity |
|--------|-----------|------------|
| 05 | Create storage Module | Simple |
| 06 | Create storage __init__.py | Simple |
| 07 | Create Storage Settings File | Medium |
| 08 | Configure MEDIA_URL | Simple |

---

## Task 05: Create storage Module

### Overview
Create a dedicated storage module within the core app to organize all file storage functionality, including storage backends, upload handlers, and file validators.

### Dependencies
- Task 04: Pin Pillow Version
- SubPhase-01: Django Apps Structure (apps/core/ exists)

### Instructions

1. **Verify core app structure**
   - Confirm `backend/apps/core/` directory exists
   - Check that core app is registered in INSTALLED_APPS

2. **Create storage directory**
   - Navigate to `backend/apps/core/` directory
   - Create new directory named `storage`

3. **Plan module structure**
   - Identify storage-related components needed
   - Plan for backends, validators, handlers subdirectories
   - Consider future expansion needs

4. **Document module purpose**
   - Prepare README or docstring explaining module purpose
   - List planned submodules
   - Note future storage backends to support

### Storage Module Organization

| Component | Purpose | Location |
|-----------|---------|----------|
| **Backends** | Custom storage classes | storage/backends/ |
| **Validators** | File validation logic | storage/validators/ |
| **Handlers** | Upload handling | storage/handlers/ |
| **Utils** | Helper functions | storage/utils.py |
| **Settings** | Configuration | config/settings/storage.py |

### Module Purpose
The storage module centralizes all file storage functionality:
- Abstract storage backend selection
- Enforce tenant isolation for file uploads
- Validate file types and sizes
- Generate secure file paths
- Handle image processing and thumbnails
- Manage storage quotas per tenant

### Expected Outcome
```
backend/
└── apps/
    └── core/
        └── storage/              # New storage module
```

### Verification Checklist
- [ ] storage directory created in apps/core/
- [ ] Directory structure is clean and empty
- [ ] Module purpose is documented

---

## Task 06: Create storage __init__.py

### Overview
Create the `__init__.py` file for the storage module to make it a Python package and define the module's public API.

### Dependencies
- Task 05: Create storage Module

### Instructions

1. **Create __init__.py file**
   - Navigate to `backend/apps/core/storage/` directory
   - Create new file named `__init__.py`

2. **Add module docstring**
   - Add comprehensive docstring at the top
   - Explain module purpose
   - List main components
   - Provide usage examples

3. **Plan future exports**
   - Consider what will be exported from this module
   - Plan for storage backend classes
   - Plan for validator functions
   - Plan for utility functions

4. **Add version information**
   - Include module version (optional)
   - Add maintainer information (optional)
   - Reference related documentation

### Module Docstring Structure

```
File Storage Module
-------------------
Purpose:
- Centralized file storage management
- Multi-tenant file isolation
- Secure file upload handling
- Image processing and optimization

Components:
- backends: Custom storage backends
- validators: File validation logic
- handlers: Upload request handlers
- utils: Helper functions

Usage:
- Import storage backends for custom storage
- Use validators for file type checking
- Apply handlers for secure uploads
```

### Future Exports Plan

| Export | Type | Purpose |
|--------|------|---------|
| `TenantMediaStorage` | Class | Tenant-isolated media storage |
| `PublicMediaStorage` | Class | Public media storage |
| `validate_file_type` | Function | File type validation |
| `validate_file_size` | Function | File size validation |
| `generate_upload_path` | Function | Secure path generation |

### Expected Outcome
```
backend/
└── apps/
    └── core/
        └── storage/
            └── __init__.py       # Module initialization
```

### Verification Checklist
- [ ] __init__.py file created
- [ ] Module docstring is comprehensive
- [ ] File is properly formatted
- [ ] Module is importable

---

## Task 07: Create Storage Settings File

### Overview
Create a dedicated settings file for all storage-related configuration, separating storage concerns from the main settings file for better organization.

### Dependencies
- Task 06: Create storage __init__.py
- SubPhase-07: Environment Configuration (settings structure exists)

### Instructions

1. **Create storage.py settings file**
   - Navigate to `backend/config/settings/` directory
   - Create new file named `storage.py`

2. **Add file header and imports**
   - Add module docstring explaining purpose
   - Import os and Path utilities
   - Import settings that may be needed (BASE_DIR)

3. **Document settings organization**
   - Add section comments for different setting groups
   - Plan for local storage settings
   - Plan for S3 storage settings
   - Plan for image processing settings

4. **Add settings structure template**
   - Create sections for each storage backend
   - Add placeholders for future configuration
   - Include inline documentation

5. **Prepare for environment variables**
   - Plan which settings come from environment
   - Document expected environment variables
   - Add fallback values

### Storage Settings Organization

| Section | Settings | Purpose |
|---------|----------|---------|
| **Local Storage** | MEDIA_URL, MEDIA_ROOT | Development file storage |
| **Static Files** | STATIC_URL, STATIC_ROOT | Static assets |
| **S3 Storage** | AWS credentials, bucket | Production storage |
| **Image Processing** | Thumbnail sizes, quality | Image optimization |
| **File Validation** | Max size, allowed types | Security |
| **Storage Backend** | DEFAULT_FILE_STORAGE | Backend selection |

### Settings File Structure

```
# Storage Configuration
# =====================
# Centralized file storage settings for LankaCommerce Cloud
#
# Sections:
# 1. Local File Storage (Development)
# 2. Static Files Configuration
# 3. AWS S3 Storage (Production)
# 4. Image Processing Settings
# 5. File Upload Validation
# 6. Storage Backend Selection

[Storage settings will be added here]
```

### Environment Variables Planning

| Variable | Purpose | Default | Required |
|----------|---------|---------|----------|
| STORAGE_BACKEND | Backend to use | 'local' | No |
| AWS_ACCESS_KEY_ID | S3 credentials | None | Production only |
| AWS_SECRET_ACCESS_KEY | S3 credentials | None | Production only |
| AWS_STORAGE_BUCKET_NAME | S3 bucket | None | Production only |
| AWS_S3_REGION_NAME | S3 region | 'ap-south-1' | No |
| MAX_UPLOAD_SIZE | File size limit | 10MB | No |

### Expected Outcome
```
backend/
└── config/
    └── settings/
        ├── base.py
        ├── development.py
        ├── production.py
        └── storage.py            # New storage settings
```

### Verification Checklist
- [ ] storage.py file created in config/settings/
- [ ] File has comprehensive docstring
- [ ] Settings sections are planned and documented
- [ ] Environment variables are documented
- [ ] File follows project settings structure

---

## Task 08: Configure MEDIA_URL

### Overview
Configure the MEDIA_URL setting, which defines the base URL for serving user-uploaded media files in development and production environments.

### Dependencies
- Task 07: Create Storage Settings File

### Instructions

1. **Open storage settings file**
   - Navigate to `backend/config/settings/storage.py`
   - Locate the Local File Storage section

2. **Add MEDIA_URL setting**
   - Define MEDIA_URL constant
   - Set value to '/media/'
   - Add inline comment explaining purpose

3. **Document URL structure**
   - Explain how media URLs are constructed
   - Provide examples of media file URLs
   - Note trailing slash requirement

4. **Consider environment differences**
   - Development: Local file serving
   - Production: CDN or S3 URL (future)
   - Document how MEDIA_URL changes per environment

5. **Add configuration notes**
   - Document URL serving in development
   - Note production considerations
   - Reference Django's media serving documentation

### MEDIA_URL Configuration

| Setting | Value | Purpose |
|---------|-------|---------|
| **MEDIA_URL** | '/media/' | Base URL for media files |
| **Trailing Slash** | Required | Ensures proper URL joining |
| **Development** | Served by Django | DEBUG=True only |
| **Production** | Served by web server | nginx/CDN |

### URL Structure Examples

| File Path (relative to MEDIA_ROOT) | Resulting URL |
|-------------------------------------|---------------|
| tenant_123/products/image.jpg | /media/tenant_123/products/image.jpg |
| tenant_456/uploads/doc.pdf | /media/tenant_456/uploads/doc.pdf |
| public/logo.png | /media/public/logo.png |

### Development vs Production

| Environment | MEDIA_URL | Served By | Notes |
|-------------|-----------|-----------|-------|
| **Development** | /media/ | Django dev server | DEBUG=True only |
| **Staging** | /media/ | nginx | Static file serving |
| **Production** | https://cdn.example.com/media/ | CloudFront + S3 | CDN for performance |

### Django Media Serving

In development with DEBUG=True:
- Django automatically serves media files
- Uses django.views.static.serve view
- Only for development - insecure for production
- URL pattern added to urlpatterns

In production with DEBUG=False:
- Django does NOT serve media files
- Must configure web server (nginx/Apache)
- Or use cloud storage (S3) with django-storages
- MEDIA_URL points to storage location

### Security Considerations

| Aspect | Consideration |
|--------|---------------|
| **Debug Mode** | Never serve media in production with DEBUG=True |
| **Web Server** | Use nginx/Apache for production media serving |
| **File Validation** | Always validate uploads before saving |
| **Tenant Isolation** | Ensure tenant prefix in all upload paths |

### Expected Outcome
```python
# In config/settings/storage.py:

# Local File Storage (Development)
# ================================
MEDIA_URL = '/media/'  # Base URL for user-uploaded media files
```

### Verification Checklist
- [ ] MEDIA_URL setting added to storage.py
- [ ] Value set to '/media/' with trailing slash
- [ ] Inline comment explains purpose
- [ ] Documentation notes added
- [ ] Environment considerations documented

---

## Summary

### Tasks Completed in This Document
| Task # | Task Name | Key Deliverable |
|--------|-----------|-----------------|
| 05 | Create storage Module | storage directory created |
| 06 | Create storage __init__.py | Module initialization file |
| 07 | Create Storage Settings File | config/settings/storage.py |
| 08 | Configure MEDIA_URL | MEDIA_URL = '/media/' |

### Final Storage Module Structure
```
backend/
├── apps/
│   └── core/
│       └── storage/
│           └── __init__.py       # Storage module
└── config/
    └── settings/
        └── storage.py            # Storage configuration
```

### Configuration Summary

| Setting | Value | Location |
|---------|-------|----------|
| MEDIA_URL | '/media/' | config/settings/storage.py |

### Next Steps
1. Configure MEDIA_ROOT for local file storage
2. Proceed to [03_Tasks-09-14_Static-Media-Config.md](03_Tasks-09-14_Static-Media-Config.md) to complete storage configuration

---

## Notes for AI Agents

1. **Execution Order:** Tasks 05-08 must be executed sequentially
2. **Module Structure:** Create clean directory structure before adding files
3. **Documentation:** Add comprehensive docstrings to all files
4. **Future Planning:** Consider tenant isolation in all storage design
5. **Settings Import:** storage.py will be imported in base.py later
6. **URL Format:** Always use trailing slash for MEDIA_URL
