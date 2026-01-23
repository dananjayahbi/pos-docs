# Tasks 17-21: Django-Filter Setup & Installation

> **Phase:** 03 - Core Backend Infrastructure  
> **SubPhase:** 12 - Core Utilities & Helpers  
> **Group:** B - Filter Backends  
> **Document:** 01 of 03  
> **Tasks Covered:** 17, 18, 19, 20, 21

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Group:** [../Group-A_Pagination-Classes/](../Group-A_Pagination-Classes/)
- **→ Next Document:** [02_Tasks-22-27_Custom-Filter-Backends.md](02_Tasks-22-27_Custom-Filter-Backends.md)

---

## Document Overview

This document covers the installation and configuration of django-filter library, which provides declarative filtering for Django REST Framework APIs. This establishes the foundation for all filter backends used in LankaCommerce Cloud.

### Tasks in This Document
| Task # | Task Name | Complexity |
|--------|-----------|------------|
| 17 | Install django-filter | Low |
| 18 | Pin django-filter Version | Low |
| 19 | Add to INSTALLED_APPS | Low |
| 20 | Create filters Module | Low |
| 21 | Create filters __init__.py | Low |

---

## Task 17: Install django-filter

### Overview
Install the django-filter package which provides advanced filtering capabilities for Django REST Framework, including field lookups, custom filter classes, and declarative FilterSet definitions.

### Dependencies
- SubPhase-02: API Framework Setup (DRF installed)
- Group A: Pagination Classes (completed)

### Instructions

1. **Navigate to backend directory**
   - Go to `backend/` directory where requirements files are located

2. **Identify correct requirements file**
   - Determine environment (development, production)
   - Primary file: `requirements/base.txt` for core dependencies
   - Or: `requirements.txt` if using single file

3. **Run pip install command**
   - Execute: `pip install django-filter`
   - This installs the latest stable version
   - Verify installation completes without errors

4. **Verify installation**
   - Check installed version: `pip show django-filter`
   - Confirm package is available in Python environment
   - Note the installed version number for Task 18

5. **Test import**
   - Test in Django shell: `import django_filters`
   - Should import without errors
   - Confirms successful installation

### django-filter Features

| Feature | Description |
|---------|-------------|
| **FilterSet Classes** | Declarative filter definitions |
| **Field Lookups** | exact, icontains, gte, lte, etc. |
| **Filter Types** | CharFilter, NumberFilter, DateFilter, etc. |
| **Boolean Filters** | BooleanFilter for is_active fields |
| **Relationship Filters** | Filter by related model fields |
| **DRF Integration** | Native REST Framework support |

### Use Cases in LankaCommerce Cloud

| Module | Filter Example |
|--------|---------------|
| **Products** | Filter by category, price range, is_active |
| **Orders** | Filter by status, date range, customer |
| **Inventory** | Filter by warehouse, stock level, product |
| **Customers** | Filter by province, active status |
| **Invoices** | Filter by payment status, date issued |

### Installation Verification
```bash
# Check installation
pip show django-filter

# Expected output:
Name: django-filter
Version: 24.x.x
Summary: Django-filter is a...
Location: /path/to/site-packages
Requires: Django
```

### Django Shell Test
```python
# Test import
python manage.py shell

>>> import django_filters
>>> print(django_filters.__version__)
'24.x.x'
>>> print("django-filter installed successfully!")
```

### Expected Outcome
- django-filter package installed in Python environment
- Package version identified (e.g., 24.3)
- Import successful in Django shell
- Ready for requirements file update in Task 18

### Verification Checklist
- [ ] django-filter installed via pip
- [ ] Installation completed without errors
- [ ] Package version identified
- [ ] Import test successful in Django shell
- [ ] Ready for version pinning

---

## Task 18: Pin django-filter Version

### Overview
Add django-filter to the requirements file with version pinning to ensure consistent installations across all environments and prevent breaking changes from automatic updates.

### Dependencies
- Task 17: Install django-filter

### Instructions

1. **Determine installed version**
   - Use version from Task 17 verification
   - Check: `pip show django-filter`
   - Note exact version number (e.g., 24.3)

2. **Open requirements file**
   - Edit `backend/requirements/base.txt` (preferred)
   - Or edit `backend/requirements.txt` (if using single file)

3. **Locate Django section**
   - Find section with Django and DRF packages
   - Group related packages together for organization

4. **Add django-filter entry**
   - Add line: `django-filter==24.3`
   - Use exact version pinning with `==`
   - Place after Django REST Framework entry

5. **Add inline comment**
   - Add comment explaining purpose
   - Example: `# Advanced filtering for DRF`
   - Helps other developers understand dependency

6. **Verify syntax**
   - Ensure proper formatting
   - No typos in package name
   - Version number is valid

7. **Test installation from requirements**
   - In clean environment, run: `pip install -r requirements/base.txt`
   - Verify django-filter installs correctly
   - Confirm specified version is installed

### Version Pinning Strategies

| Strategy | Format | Use Case |
|----------|--------|----------|
| **Exact version** | `==24.3` | Production (recommended) |
| **Minimum version** | `>=24.3` | Development flexibility |
| **Compatible version** | `~=24.3` | Patch updates only |
| **Version range** | `>=24.3,<25.0` | Major version lock |

### Recommended: Exact Version Pinning
For production stability, use exact version pinning:
```
django-filter==24.3
```

### Requirements File Structure
```
# backend/requirements/base.txt

# Django Core
Django==5.0.1

# Django REST Framework
djangorestframework==3.14.0
drf-spectacular==0.27.0      # API documentation

# Filtering
django-filter==24.3           # Advanced filtering for DRF

# Multi-tenancy
django-tenants==3.5.0

# Database
psycopg2-binary==2.9.9

# ... other dependencies
```

### Version Compatibility

| django-filter | Django | DRF | Python |
|---------------|--------|-----|--------|
| 24.x | 4.2+ | 3.14+ | 3.8+ |
| 23.x | 3.2+ | 3.12+ | 3.7+ |

### Testing Requirements Installation
```bash
# Create new virtual environment
python -m venv test_env
source test_env/bin/activate  # On Windows: test_env\Scripts\activate

# Install from requirements
pip install -r backend/requirements/base.txt

# Verify django-filter version
pip show django-filter
# Should show: Version: 24.3 (or pinned version)
```

### Expected Outcome
```
backend/
├── requirements/
│   └── base.txt            # django-filter==24.3 added
└── requirements.txt        # Or single file with entry
```

### Verification Checklist
- [ ] django-filter added to requirements file
- [ ] Version is pinned with `==` operator
- [ ] Inline comment explains purpose
- [ ] Entry placed in appropriate section
- [ ] Test installation from requirements succeeds
- [ ] Specified version installs correctly

---

## Task 19: Add to INSTALLED_APPS

### Overview
Register django_filters in Django's INSTALLED_APPS setting to enable its functionality throughout the project, including admin integration and template filters.

### Dependencies
- Task 18: Pin django-filter Version

### Instructions

1. **Open Django settings file**
   - Navigate to `backend/config/settings/base.py`
   - Or `backend/config/settings.py` (if using single settings file)

2. **Locate INSTALLED_APPS list**
   - Find the `INSTALLED_APPS` configuration
   - Identify the Django apps section

3. **Find appropriate section**
   - Look for third-party apps section
   - Place after `rest_framework` entry
   - Maintain logical grouping

4. **Add django_filters entry**
   - Add string: `'django_filters',`
   - Note: package name uses underscore, not hyphen
   - Include trailing comma

5. **Add inline comment**
   - Add comment: `# Advanced DRF filtering`
   - Or group comment for filtering section

6. **Verify syntax**
   - Ensure proper string formatting
   - Check comma placement
   - Verify no typos

7. **Test Django startup**
   - Run: `python manage.py check`
   - Should complete without errors
   - Confirms successful registration

### INSTALLED_APPS Configuration

```python
# backend/config/settings/base.py

INSTALLED_APPS = [
    # Django core apps
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    
    # Third-party apps
    'rest_framework',              # Django REST Framework
    'django_filters',              # Advanced DRF filtering
    'drf_spectacular',             # API documentation
    'django_tenants',              # Multi-tenancy
    'corsheaders',                 # CORS headers
    
    # Local apps
    'apps.core',
    'apps.accounts',
    # ... other apps
]
```

### Package Name Note

| Installation | Settings | Template |
|-------------|----------|----------|
| `django-filter` | `django_filters` | Uses underscore |
| pip package | Python import | In INSTALLED_APPS |

### What INSTALLED_APPS Registration Enables

| Feature | Description |
|---------|-------------|
| **FilterSet Classes** | Available for import and use |
| **Template Filters** | django_filters template tags |
| **Admin Integration** | FilterSet in Django admin |
| **Migrations** | If package has migrations |
| **Apps Config** | Load app configuration |

### Verification Command
```bash
# Check Django configuration
python manage.py check

# Expected output:
System check identified no issues (0 silenced).

# Test django_filters import
python manage.py shell
>>> from django_filters import FilterSet
>>> print("django_filters registered successfully!")
```

### Troubleshooting

| Issue | Cause | Solution |
|-------|-------|----------|
| Module not found | Package not installed | Run Task 17 again |
| Import error | Wrong name in INSTALLED_APPS | Use `django_filters`, not `django-filter` |
| Check command fails | Syntax error | Check comma and quotes |

### Expected Outcome
- `django_filters` added to INSTALLED_APPS
- Django starts without errors
- Package functionality available throughout project
- FilterSet classes importable

### Verification Checklist
- [ ] `django_filters` added to INSTALLED_APPS
- [ ] Entry uses correct name (underscore, not hyphen)
- [ ] Proper placement in third-party apps section
- [ ] Inline comment added
- [ ] `python manage.py check` passes
- [ ] django_filters importable in Django shell

---

## Task 20: Create filters Module

### Overview
Create the filters module directory within the core app to house all custom filter backends and FilterSet classes used across the LankaCommerce Cloud API.

### Dependencies
- Task 19: Add to INSTALLED_APPS

### Instructions

1. **Navigate to core app directory**
   - Go to `backend/apps/core/` directory

2. **Create filters directory**
   - Create new directory named `filters`
   - This will contain all filter-related code

3. **Verify directory structure**
   - Ensure the directory is created at correct location
   - Path should be `backend/apps/core/filters/`

4. **Plan module organization**
   - `backends.py`: Custom filter backend classes
   - `filtersets.py`: Reusable FilterSet classes
   - `__init__.py`: Package initialization and exports

### Expected Directory Structure
```
backend/apps/core/
├── __init__.py
├── models.py
├── admin.py
├── pagination/
│   ├── __init__.py
│   └── paginators.py
└── filters/                 # New directory
```

### Module Organization Plan

| File | Purpose | Content |
|------|---------|---------|
| `__init__.py` | Package initialization | Exports all filters |
| `backends.py` | Filter backend classes | TenantFilterBackend, etc. |
| `filtersets.py` | FilterSet classes | BaseFilterSet, common filters |

### Filters Module Purpose

The filters module will provide:
- **Tenant-aware filtering**: Automatic tenant isolation
- **Date range filters**: Start/end date filtering
- **Search filters**: Full-text search capabilities
- **Ordering filters**: Dynamic result ordering
- **BaseFilterSet**: Reusable filter configuration

### Use in Other Apps

Other apps can use these filters:
```python
# In products app
from apps.core.filters import BaseFilterSet, TenantFilterBackend

class ProductFilter(BaseFilterSet):
    class Meta:
        model = Product
        fields = ['category', 'is_active', 'price']
```

### Verification Checklist
- [ ] `filters/` directory exists at `backend/apps/core/filters/`
- [ ] Directory is empty and ready for module files
- [ ] Path is accessible from core app
- [ ] Module purpose is clear

---

## Task 21: Create filters __init__.py

### Overview
Create the `__init__.py` file in the filters module to make it a Python package and prepare for exports. Full exports will be added in Task 31.

### Dependencies
- Task 20: Create filters Module

### Instructions

1. **Create __init__.py file**
   - Create file named `__init__.py` in `filters/` directory
   - Location: `backend/apps/core/filters/__init__.py`

2. **Add module docstring**
   - Add descriptive docstring explaining the module's purpose
   - State that it provides DRF filter backends and FilterSet classes
   - Mention tenant-aware filtering capabilities

3. **Add version information**
   - Add `__version__` attribute
   - Set to '1.0.0'

4. **Prepare import section**
   - Add comment section for future imports
   - Will import filter classes once created
   - Leave the actual imports commented out for now

5. **Prepare __all__ export list**
   - Define empty `__all__` list
   - Will populate with class names in Task 31
   - Leave as placeholder for now

### File Structure
```python
"""
Filter backends and FilterSet classes for LankaCommerce Cloud API.

Provides:
- TenantFilterBackend: Automatic tenant isolation
- DateRangeFilter: Start/end date filtering
- SearchFilter: Full-text search
- OrderingFilter: Dynamic ordering
- BaseFilterSet: Reusable filter configuration
"""

__version__ = '1.0.0'

# Imports will be added in Task 31
# from .backends import ...
# from .filtersets import ...

__all__ = [
    # Class names will be added in Task 31
]
```

### Module Documentation

The docstring should clarify:
- What the module provides
- Main filter backend classes
- FilterSet classes available
- Tenant-aware filtering mention
- Integration with DRF

### Expected Outcome
```
backend/apps/core/
└── filters/
    └── __init__.py          # Package initialization
```

### Verification Checklist
- [ ] `__init__.py` file exists in `filters/` directory
- [ ] Module docstring is present and descriptive
- [ ] `__version__` attribute is defined
- [ ] `__all__` list is prepared (empty for now)
- [ ] Import section is prepared with comments
- [ ] Module can be imported without errors

---

## Summary

### Tasks Completed in This Document
| Task # | Task Name | Key Deliverable |
|--------|-----------|-----------------|
| 17 | Install django-filter | Package installed in environment |
| 18 | Pin django-filter Version | Version added to requirements file |
| 19 | Add to INSTALLED_APPS | Registered in Django settings |
| 20 | Create filters Module | `filters/` directory created |
| 21 | Create filters __init__.py | Package initialization file |

### Module Structure After This Document
```
backend/
├── requirements/
│   └── base.txt              # django-filter==24.3
├── config/
│   └── settings/
│       └── base.py           # django_filters in INSTALLED_APPS
└── apps/
    └── core/
        └── filters/
            └── __init__.py   # Package initialization (empty exports)
```

### django-filter Integration Status
- ✅ Package installed
- ✅ Version pinned in requirements
- ✅ Registered in INSTALLED_APPS
- ✅ filters module created
- ✅ Package initialized
- ⏳ Filter backends (next document)
- ⏳ FilterSet classes (next document)

### Next Steps
Proceed to [02_Tasks-22-27_Custom-Filter-Backends.md](02_Tasks-22-27_Custom-Filter-Backends.md) to implement:
- TenantFilterBackend for multi-tenancy
- DateRangeFilter for time-based queries
- SearchFilter for full-text search
- OrderingFilter for dynamic sorting
- IsActiveFilter and CreatedByFilter

---

## Notes for AI Agents

1. **Execution Order:** Tasks 17-21 must be executed in strict sequence
2. **Package Name:** Use `django-filter` for pip, `django_filters` in code
3. **Version Pinning:** Use exact version (==) for production stability
4. **Module Organization:** Separate backends.py and filtersets.py for clarity
5. **Tenant Awareness:** Critical filter backend will be implemented next
6. **Export Classes:** Actual exports to `__init__.py` happen in Task 31
7. **Testing:** Full unit tests will be added in Group F (Task 81)
