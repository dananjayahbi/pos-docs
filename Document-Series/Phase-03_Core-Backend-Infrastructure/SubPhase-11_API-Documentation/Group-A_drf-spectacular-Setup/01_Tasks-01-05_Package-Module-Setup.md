# Tasks 01-05: Package & Module Setup

> **Phase:** 03 - Core Backend Infrastructure  
> **SubPhase:** 11 - API Documentation  
> **Group:** A - drf-spectacular Setup  
> **Document:** 01 of 03  
> **Tasks Covered:** 01, 02, 03, 04, 05

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** None (First Document)
- **→ Next Document:** [02_Tasks-06-10_Settings-URLs.md](02_Tasks-06-10_Settings-URLs.md)

---

## Document Overview

This document covers the installation and initial setup of drf-spectacular, including package installation, version pinning, Django integration, and the creation of the api_docs module structure.

### Tasks in This Document
| Task # | Task Name | Complexity |
|--------|-----------|------------|
| 01 | Install drf-spectacular | Simple |
| 02 | Pin drf-spectacular Version | Simple |
| 03 | Add to INSTALLED_APPS | Simple |
| 04 | Create api_docs Module | Simple |
| 05 | Create api_docs __init__.py | Simple |

---

## Task 01: Install drf-spectacular

### Overview
Install the drf-spectacular package to enable OpenAPI 3.0 schema generation for Django REST Framework APIs.

### Dependencies
- SubPhase-02 (DRF installed and configured)

### Instructions

1. **Navigate to backend requirements directory**
   - Open the backend requirements directory
   - Locate the `base.txt` file for base dependencies

2. **Add drf-spectacular to requirements**
   - Open `backend/requirements/base.txt`
   - Add drf-spectacular after Django REST Framework
   - Ensure it's in the API/REST section

3. **Install the package**
   - Run pip install command in backend directory
   - Use the appropriate Python environment
   - Verify installation completes successfully

4. **Verify installation**
   - Check that drf-spectacular is installed
   - Verify importable from Python shell
   - Check for any installation errors

### Expected Outcome
```
backend/
└── requirements/
    └── base.txt              # drf-spectacular added
```

### Verification Checklist
- [ ] drf-spectacular added to requirements/base.txt
- [ ] Package installed successfully
- [ ] No installation errors
- [ ] Package importable in Python shell

---

## Task 02: Pin drf-spectacular Version

### Overview
Pin the drf-spectacular version to ensure consistent installations across environments and prevent breaking changes from automatic updates.

### Dependencies
- Task 01: Install drf-spectacular

### Instructions

1. **Determine appropriate version**
   - Check current stable version
   - Review version changelog
   - Verify compatibility with Django and DRF versions
   - Choose version >= 0.27.0

2. **Add version specification**
   - Open `backend/requirements/base.txt`
   - Update drf-spectacular entry with version pin
   - Use >= constraint for flexibility with patches

3. **Document version choice**
   - Add comment explaining version choice
   - Note any specific features required
   - Reference compatibility matrix if relevant

4. **Update installed package**
   - Reinstall with pinned version
   - Verify correct version installed
   - Update requirements.lock if using lock files

### Version Considerations
- **Minimum:** 0.27.0 for OpenAPI 3.0.3 support
- **Style:** Use >= for patch flexibility
- **Updates:** Review changelog before upgrading major versions

### Expected Outcome
```
# backend/requirements/base.txt
drf-spectacular>=0.27.0        # OpenAPI schema generation
```

### Verification Checklist
- [ ] Version constraint added to requirements
- [ ] Version >= 0.27.0
- [ ] Comment documenting purpose added
- [ ] Correct version installed and verified

---

## Task 03: Add to INSTALLED_APPS

### Overview
Register drf-spectacular in Django's INSTALLED_APPS to enable its functionality throughout the application.

### Dependencies
- Task 02: Pin drf-spectacular Version

### Instructions

1. **Locate INSTALLED_APPS configuration**
   - Open `backend/config/settings/base.py`
   - Find the INSTALLED_APPS list
   - Identify the third-party apps section

2. **Add drf-spectacular to INSTALLED_APPS**
   - Add 'drf_spectacular' to the list
   - Place after 'rest_framework'
   - Add in the third-party apps section

3. **Add configuration comment**
   - Add inline comment describing purpose
   - Note relationship to API documentation
   - Group with other API-related apps

4. **Verify Django recognizes the app**
   - Run Django check command
   - Verify no configuration errors
   - Check that spectacular commands are available

### App Placement
```
INSTALLED_APPS = [
    # Django apps...
    
    # Third-party apps
    'rest_framework',
    'drf_spectacular',  # OpenAPI schema generation
    
    # Local apps...
]
```

### Expected Outcome
```
backend/config/settings/
└── base.py                   # drf_spectacular in INSTALLED_APPS
```

### Verification Checklist
- [ ] 'drf_spectacular' added to INSTALLED_APPS
- [ ] Placed after 'rest_framework'
- [ ] Comment added explaining purpose
- [ ] Django check command passes
- [ ] Spectacular management commands available

---

## Task 04: Create api_docs Module

### Overview
Create a dedicated Django module for API documentation configuration, views, and utilities.

### Dependencies
- Task 03: Add to INSTALLED_APPS

### Instructions

1. **Navigate to core app**
   - Open `backend/apps/core/` directory
   - Verify core app exists from SubPhase-01
   - Prepare to create new module

2. **Create api_docs directory**
   - Create `api_docs` directory inside `apps/core/`
   - Use lowercase with underscore naming
   - Ensure directory is created successfully

3. **Verify directory structure**
   - Check that directory exists
   - Verify correct location under core app
   - Prepare for adding module files

4. **Document module purpose**
   - Note module handles API documentation
   - Will contain schema configuration
   - Will contain URL patterns for docs endpoints

### Module Structure
```
backend/apps/core/
├── __init__.py
├── models.py
├── views.py
└── api_docs/              # New module
    └── (files to be added)
```

### Expected Outcome
```
backend/apps/core/
└── api_docs/              # New directory created
```

### Verification Checklist
- [ ] api_docs directory created in apps/core/
- [ ] Directory name is lowercase with underscore
- [ ] Location correct under core app
- [ ] Ready to add Python module files

---

## Task 05: Create api_docs __init__.py

### Overview
Create the `__init__.py` file to make api_docs a proper Python package and expose key components.

### Dependencies
- Task 04: Create api_docs Module

### Instructions

1. **Create __init__.py file**
   - Create file in `backend/apps/core/api_docs/`
   - Start with module docstring
   - Initialize as Python package

2. **Add module docstring**
   - Document module purpose
   - Describe OpenAPI schema generation
   - Note Swagger UI and ReDoc support

3. **Add app configuration**
   - Set default_app_config if needed
   - Add version information
   - Document module metadata

4. **Add exports placeholder**
   - Add __all__ list for future exports
   - Will export views and utilities later
   - Keep empty for now

5. **Verify module importable**
   - Test importing the module
   - Verify Python recognizes as package
   - Check for import errors

### File Structure
```python
"""
API Documentation Module

This module provides OpenAPI 3.0 schema generation
and documentation interfaces (Swagger UI, ReDoc) for
the LankaCommerce Cloud API.
"""

__all__ = []
```

### Expected Outcome
```
backend/apps/core/
└── api_docs/
    └── __init__.py        # Module initialized
```

### Verification Checklist
- [ ] __init__.py created in api_docs directory
- [ ] Module docstring added
- [ ] Describes OpenAPI and documentation purpose
- [ ] __all__ list added (empty)
- [ ] Module importable without errors

---

## Summary

After completing these tasks, the drf-spectacular package will be installed, configured, and the api_docs module structure will be ready for schema configuration and URL setup.

### What We Accomplished
1. ✅ Installed drf-spectacular package
2. ✅ Pinned version for consistency
3. ✅ Registered in INSTALLED_APPS
4. ✅ Created api_docs module structure
5. ✅ Initialized module as Python package

### Next Steps
- Configure settings in `config/settings/api_docs.py`
- Set DEFAULT_SCHEMA_CLASS in REST framework settings
- Create schema URL patterns
- Test schema generation endpoint

### Directory Structure
```
backend/
├── requirements/
│   └── base.txt              # drf-spectacular>=0.27.0
├── config/
│   └── settings/
│       └── base.py           # drf_spectacular in INSTALLED_APPS
└── apps/
    └── core/
        └── api_docs/
            └── __init__.py   # Module initialized
```

### Git Commit Message
```
feat(api-docs): install drf-spectacular and create api_docs module

- Add drf-spectacular>=0.27.0 to requirements
- Register drf_spectacular in INSTALLED_APPS
- Create apps/core/api_docs/ module structure
- Initialize module with docstring

Part of SubPhase-11 Group A (Tasks 01-05)
```
