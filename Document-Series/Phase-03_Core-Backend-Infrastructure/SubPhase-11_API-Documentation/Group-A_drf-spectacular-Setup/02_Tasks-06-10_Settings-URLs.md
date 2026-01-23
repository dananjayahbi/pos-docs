# Tasks 06-10: Settings & URLs

> **Phase:** 03 - Core Backend Infrastructure  
> **SubPhase:** 11 - API Documentation  
> **Group:** A - drf-spectacular Setup  
> **Document:** 02 of 03  
> **Tasks Covered:** 06, 07, 08, 09, 10

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [01_Tasks-01-05_Package-Module-Setup.md](01_Tasks-01-05_Package-Module-Setup.md)
- **→ Next Document:** [03_Tasks-11-14_Integration-Testing.md](03_Tasks-11-14_Integration-Testing.md)

---

## Document Overview

This document covers the configuration of drf-spectacular settings, including creating the settings file, configuring the default schema class, and setting up URL patterns for schema access.

### Tasks in This Document
| Task # | Task Name | Complexity |
|--------|-----------|------------|
| 06 | Create Settings File | Medium |
| 07 | Configure DEFAULT_SCHEMA_CLASS | Simple |
| 08 | Import API Docs Settings | Simple |
| 09 | Create Schema URLs File | Simple |
| 10 | Add Schema URL Pattern | Simple |

---

## Task 06: Create Settings File

### Overview
Create a dedicated settings file for API documentation configuration to keep schema-related settings organized and maintainable.

### Dependencies
- Task 05: Create api_docs __init__.py

### Instructions

1. **Create api_docs.py in settings**
   - Navigate to `backend/config/settings/`
   - Create new file named `api_docs.py`
   - Initialize with file docstring

2. **Add file header and documentation**
   - Add comprehensive docstring
   - Explain purpose of API documentation settings
   - Note OpenAPI 3.0 schema generation
   - Reference drf-spectacular documentation

3. **Add import statements**
   - Import necessary modules
   - Keep minimal at this stage
   - Will add more as configuration grows

4. **Prepare for SPECTACULAR_SETTINGS**
   - Add comment indicating settings will be added
   - Note that configuration will expand in Group B
   - Keep file structure clean and organized

5. **Add configuration notes**
   - Document that settings extend drf-spectacular
   - Note relationship to REST_FRAMEWORK settings
   - Reference where schema will be accessible

### File Structure
```python
"""
API Documentation Settings

Configuration for drf-spectacular OpenAPI 3.0 schema generation.
These settings control how API documentation is generated and displayed
in Swagger UI and ReDoc interfaces.

Documentation: https://drf-spectacular.readthedocs.io/
"""

# More settings will be added in subsequent tasks
```

### Expected Outcome
```
backend/config/settings/
└── api_docs.py              # New settings file
```

### Verification Checklist
- [ ] api_docs.py created in config/settings/
- [ ] File has comprehensive docstring
- [ ] Explains OpenAPI 3.0 schema purpose
- [ ] Prepared for SPECTACULAR_SETTINGS
- [ ] Clean and organized structure

---

## Task 07: Configure DEFAULT_SCHEMA_CLASS

### Overview
Configure Django REST Framework to use drf-spectacular's AutoSchema for generating OpenAPI 3.0 schemas instead of the default schema generator.

### Dependencies
- Task 06: Create Settings File

### Instructions

1. **Open REST framework settings**
   - Navigate to `backend/config/settings/base.py`
   - Locate the REST_FRAMEWORK configuration dictionary
   - Find or create the schema class setting

2. **Add DEFAULT_SCHEMA_CLASS**
   - Add or update DEFAULT_SCHEMA_CLASS key
   - Set value to drf-spectacular's AutoSchema
   - Use full import path for clarity

3. **Add configuration comment**
   - Add comment explaining schema class
   - Note OpenAPI 3.0 generation
   - Reference drf-spectacular documentation

4. **Verify syntax**
   - Check dictionary syntax is correct
   - Ensure proper string quoting
   - Verify no trailing commas issues

5. **Consider existing schema settings**
   - Remove any old schema class configurations
   - Remove coreapi or deprecated schema settings
   - Ensure clean migration to drf-spectacular

### Configuration
```python
REST_FRAMEWORK = {
    # ... other settings ...
    
    'DEFAULT_SCHEMA_CLASS': 'drf_spectacular.openapi.AutoSchema',
    
    # ... other settings ...
}
```

### Schema Class Details
| Aspect | Value |
|--------|-------|
| **Package** | drf-spectacular |
| **Class** | AutoSchema |
| **Module** | drf_spectacular.openapi |
| **Purpose** | OpenAPI 3.0 schema generation |
| **Replaces** | CoreAPI schema (deprecated) |

### Expected Outcome
```
backend/config/settings/
└── base.py                  # DEFAULT_SCHEMA_CLASS configured
```

### Verification Checklist
- [ ] DEFAULT_SCHEMA_CLASS added to REST_FRAMEWORK
- [ ] Set to 'drf_spectacular.openapi.AutoSchema'
- [ ] Comment added explaining purpose
- [ ] Old schema classes removed
- [ ] Dictionary syntax correct

---

## Task 08: Import API Docs Settings

### Overview
Import the api_docs settings into the main settings file to ensure they are loaded and available to the application.

### Dependencies
- Task 07: Configure DEFAULT_SCHEMA_CLASS

### Instructions

1. **Locate settings import section**
   - Open `backend/config/settings/base.py`
   - Find the section where other settings files are imported
   - Typically near the end of the file

2. **Import api_docs settings**
   - Add import statement for api_docs settings
   - Use wildcard import or explicit imports
   - Place after other app-specific imports

3. **Add import comment**
   - Add comment explaining import purpose
   - Note that it loads API documentation configuration
   - Reference OpenAPI schema settings

4. **Verify import order**
   - Ensure api_docs imported after base settings
   - Check for any dependency conflicts
   - Maintain logical import ordering

5. **Test settings load**
   - Run Django check command
   - Verify settings import correctly
   - Check for import errors

### Import Statement
```python
# API Documentation Settings
from .api_docs import *
```

### Import Considerations
- **Wildcard Import:** Acceptable for settings files
- **Order:** Import after base Django settings
- **Conflicts:** Check for setting name collisions
- **Testing:** Verify with Django check command

### Expected Outcome
```
backend/config/settings/
├── base.py                  # api_docs settings imported
└── api_docs.py              # Settings available
```

### Verification Checklist
- [ ] Import statement added to base.py
- [ ] Import placed in appropriate section
- [ ] Comment added explaining purpose
- [ ] Django check command passes
- [ ] No import errors occur

---

## Task 09: Create Schema URLs File

### Overview
Create a URLs file in the api_docs module to define URL patterns for accessing the OpenAPI schema.

### Dependencies
- Task 08: Import API Docs Settings

### Instructions

1. **Create urls.py in api_docs**
   - Navigate to `backend/apps/core/api_docs/`
   - Create new file named `urls.py`
   - Initialize with standard URL configuration imports

2. **Add file docstring**
   - Document purpose of URL configuration
   - Note schema endpoint definitions
   - Reference Swagger UI and ReDoc endpoints (to be added)

3. **Import required components**
   - Import Django's path function
   - Import drf-spectacular views
   - Import SpectacularAPIView for schema

4. **Initialize urlpatterns list**
   - Create empty urlpatterns list
   - Add comment about schema endpoint
   - Prepare for URL pattern additions

5. **Add app_name for namespacing**
   - Set app_name to 'api_docs'
   - Enables URL namespacing
   - Allows reverse URL lookups

### File Structure
```python
"""
API Documentation URLs

URL patterns for OpenAPI schema and documentation interfaces.
"""

from django.urls import path
from drf_spectacular.views import SpectacularAPIView

app_name = 'api_docs'

urlpatterns = [
    # Schema endpoint will be added in next task
]
```

### Expected Outcome
```
backend/apps/core/api_docs/
├── __init__.py
└── urls.py                  # URL configuration file
```

### Verification Checklist
- [ ] urls.py created in api_docs directory
- [ ] File docstring added
- [ ] Required imports included
- [ ] app_name set to 'api_docs'
- [ ] urlpatterns list initialized

---

## Task 10: Add Schema URL Pattern

### Overview
Add a URL pattern to serve the OpenAPI schema JSON at a dedicated endpoint.

### Dependencies
- Task 09: Create Schema URLs File

### Instructions

1. **Add schema URL pattern**
   - Open `backend/apps/core/api_docs/urls.py`
   - Add path for schema endpoint
   - Use SpectacularAPIView for handling

2. **Configure schema path**
   - Use path 'schema/' for the endpoint
   - Map to SpectacularAPIView.as_view()
   - Assign name 'schema' for URL reversing

3. **Add pattern comment**
   - Comment explaining schema endpoint
   - Note it returns OpenAPI 3.0 JSON
   - Reference usage with Swagger UI and ReDoc

4. **Consider URL structure**
   - Schema will be at /api/schema/
   - JSON format for machine reading
   - Can be downloaded or consumed by tools

5. **Verify URL configuration**
   - Check syntax is correct
   - Ensure SpectacularAPIView is imported
   - Verify URL pattern structure

### URL Pattern
```python
urlpatterns = [
    path(
        'schema/',
        SpectacularAPIView.as_view(),
        name='schema'
    ),
    # Swagger UI and ReDoc URLs will be added in later groups
]
```

### Schema Endpoint Details
| Aspect | Value |
|--------|-------|
| **Path** | schema/ |
| **Full URL** | /api/schema/ (after main inclusion) |
| **View** | SpectacularAPIView |
| **Name** | schema |
| **Format** | OpenAPI 3.0 JSON |
| **Purpose** | Machine-readable API specification |

### Expected Outcome
```
backend/apps/core/api_docs/
└── urls.py                  # Schema URL pattern added
```

### Verification Checklist
- [ ] Schema URL pattern added to urlpatterns
- [ ] Path set to 'schema/'
- [ ] SpectacularAPIView used as view
- [ ] URL name set to 'schema'
- [ ] Comment added explaining endpoint
- [ ] URL configuration syntax correct

---

## Summary

After completing these tasks, the API documentation settings will be configured and the schema URL endpoint will be ready to serve OpenAPI 3.0 schemas.

### What We Accomplished
1. ✅ Created dedicated settings file for API docs
2. ✅ Configured DEFAULT_SCHEMA_CLASS to use AutoSchema
3. ✅ Imported api_docs settings into main settings
4. ✅ Created URLs file in api_docs module
5. ✅ Added schema endpoint URL pattern

### Next Steps
- Include api_docs URLs in main URL configuration
- Test schema generation at /api/schema/
- Verify OpenAPI 3.0 format compliance
- Test schema download functionality

### Directory Structure
```
backend/
├── config/
│   ├── settings/
│   │   ├── base.py           # DEFAULT_SCHEMA_CLASS + import
│   │   └── api_docs.py       # API docs settings
│   └── urls.py               # (Will include api_docs URLs)
└── apps/
    └── core/
        └── api_docs/
            ├── __init__.py
            └── urls.py       # Schema URL pattern
```

### Git Commit Message
```
feat(api-docs): configure drf-spectacular settings and schema URLs

- Create config/settings/api_docs.py for documentation settings
- Configure DEFAULT_SCHEMA_CLASS to use AutoSchema
- Import api_docs settings in base settings
- Create api_docs/urls.py with schema endpoint
- Add schema URL pattern at /api/schema/

Part of SubPhase-11 Group A (Tasks 06-10)
```
