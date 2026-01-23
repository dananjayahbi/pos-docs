# Tasks 01-05: MPTT Installation & App Creation

> **Phase:** 04 - ERP Core Modules Part 1  
> **SubPhase:** 01 - Category Model & Hierarchy  
> **Group:** A - MPTT Setup  
> **Document:** 01 of 03  
> **Tasks Covered:** 01, 02, 03, 04, 05

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **→ Next Document:** [02_Tasks-06-10_App-Configuration-Models-Module.md](02_Tasks-06-10_App-Configuration-Models-Module.md)

---

## Document Overview

This document covers the installation of django-mptt library and creation of the categories Django app. These tasks establish the foundation for building a hierarchical category system using Modified Preorder Tree Traversal.

### Tasks in This Document
| Task # | Task Name | Complexity |
|--------|-----------|------------|
| 01 | Install django-mptt | Low |
| 02 | Pin django-mptt Version | Low |
| 03 | Add to INSTALLED_APPS | Low |
| 04 | Create categories App | Low |
| 05 | Add categories to TENANT_APPS | Medium |

---

## Technology Context

### What is MPTT?
Modified Preorder Tree Traversal is an algorithm for storing hierarchical data in a flat database structure. It enables efficient tree queries without recursive database calls.

### Why django-mptt?
- Pre-built MPTT implementation for Django models
- Automatic management of tree structure fields
- Efficient tree traversal methods
- Admin integration with tree display
- Well-maintained and widely adopted

### MPTT vs Other Approaches
| Approach | Pros | Cons |
|----------|------|------|
| **MPTT** | Fast reads, efficient queries | Slower writes, complex updates |
| **Adjacency List** | Simple structure, fast writes | Slow tree queries, recursive queries |
| **Nested Sets** | Similar to MPTT | Manual implementation needed |
| **Materialized Path** | Easy breadcrumbs | String operations, limited depth |

---

## Task 01: Install django-mptt

### Overview
Install the django-mptt package which provides MPTT functionality for Django models.

### Dependencies
- Python virtual environment activated
- pip package manager available
- Backend project initialized from Phase-03

### Instructions

1. **Activate virtual environment**
   - Navigate to project root directory
   - Activate the Python virtual environment

2. **Install django-mptt package**
   - Use pip to install the django-mptt package
   - This installs the latest stable version from PyPI

3. **Verify installation**
   - Check that django-mptt appears in pip freeze output
   - Verify version number is displayed

### Expected Outcome
- django-mptt package installed in virtual environment
- Package accessible to Django project

### Verification Steps
- Run command to show installed package version
- Confirm no installation errors occurred

---

## Task 02: Pin django-mptt Version

### Overview
Add django-mptt to requirements.txt with version pinning for reproducible builds.

### Dependencies
- Task 01: Install django-mptt

### Instructions

1. **Locate requirements file**
   - Find the main requirements.txt file
   - This should be in backend/requirements/ or backend/ directory

2. **Determine installed version**
   - Check which version was installed in Task 01
   - Note the major, minor, and patch version numbers

3. **Add version-pinned entry**
   - Add django-mptt with version constraint
   - Use compatible release clause for automatic patch updates
   - Format: package-name~=X.Y.Z

4. **Add explanatory comment**
   - Include comment explaining package purpose
   - Note: "Hierarchical category tree structure"

5. **Organize placement**
   - Place in Django apps section
   - Keep requirements file alphabetically organized

### Version Pinning Strategy
| Constraint | Format | Allows |
|------------|--------|--------|
| Exact | django-mptt==0.15.0 | Only 0.15.0 |
| Compatible | django-mptt~=0.15.0 | 0.15.x patches |
| Minor | django-mptt>=0.15,<0.16 | 0.15.x only |

**Recommended:** Use compatible release (~=) for automatic security patches

### Expected Outcome
```
backend/
└── requirements/
    └── base.txt (or requirements.txt)
```

Entry added:
```
# Tree structure for hierarchical categories
django-mptt~=0.15.0
```

### Verification Steps
- Confirm entry exists in requirements file
- Verify version format is correct
- Check comment is descriptive

---

## Task 03: Add to INSTALLED_APPS

### Overview
Register django-mptt in Django settings INSTALLED_APPS to enable its functionality.

### Dependencies
- Task 02: Pin django-mptt Version

### Instructions

1. **Locate Django settings file**
   - Navigate to backend settings module
   - Find base.py or common settings file

2. **Find INSTALLED_APPS list**
   - Locate the INSTALLED_APPS configuration list
   - Identify Django core apps and third-party apps sections

3. **Add mptt to third-party apps section**
   - Add 'mptt' string to INSTALLED_APPS
   - Place in third-party libraries section
   - Position after Django core apps, before project apps

4. **Add inline comment**
   - Include comment: "# Hierarchical tree structure"
   - This helps developers understand package purpose

5. **Verify formatting**
   - Ensure proper indentation
   - Maintain consistent quote style (single or double)
   - Keep trailing comma if project uses them

### INSTALLED_APPS Organization
```
INSTALLED_APPS = [
    # Django Core
    'django.contrib.admin',
    'django.contrib.auth',
    ...
    
    # Third-Party Apps
    'rest_framework',
    'mptt',  # Hierarchical tree structure
    'corsheaders',
    ...
    
    # Tenant Framework
    'django_tenants',
    
    # Project Apps
    ...
]
```

### Expected Outcome
- 'mptt' registered in INSTALLED_APPS
- Django recognizes mptt as installed application

### Verification Steps
- Check syntax of INSTALLED_APPS list
- Confirm 'mptt' string is present
- Verify no duplicate entries

---

## Task 04: Create categories App

### Overview
Create a new Django app called 'categories' that will contain the category model and related functionality.

### Dependencies
- Task 03: Add to INSTALLED_APPS

### Instructions

1. **Navigate to apps directory**
   - Go to backend/apps/ directory
   - This is where all Django apps are located

2. **Create Django app**
   - Use Django management command to create new app
   - App name: categories
   - Use startapp command

3. **Verify app structure created**
   - Check that categories directory was created
   - Confirm standard Django app files exist:
     - migrations/ directory with __init__.py
     - __init__.py
     - admin.py
     - apps.py
     - models.py
     - tests.py
     - views.py

4. **Review default files**
   - Examine apps.py for app configuration
   - Note the default app name setting
   - Check models.py has been created

### Standard Django App Structure
```
categories/
├── __init__.py           # Package marker
├── admin.py              # Admin site configuration
├── apps.py               # App configuration class
├── models.py             # Data models (will be converted to module)
├── tests.py              # Test cases (will be converted to module)
├── views.py              # View functions/classes
└── migrations/           # Database migrations
    └── __init__.py
```

### Expected Outcome
```
backend/apps/
└── categories/
    ├── __init__.py
    ├── admin.py
    ├── apps.py
    ├── models.py
    ├── tests.py
    ├── views.py
    └── migrations/
        └── __init__.py
```

### Verification Steps
- Confirm categories directory exists
- Check all default files are present
- Verify migrations directory was created

---

## Task 05: Add categories to TENANT_APPS

### Overview
Register the categories app as a tenant-specific app, ensuring category data is isolated per tenant schema.

### Dependencies
- Task 04: Create categories App

### Instructions

1. **Understand tenant vs shared apps**
   - Review multi-tenancy architecture from Phase-02
   - TENANT_APPS: Data stored in tenant schemas (isolated per tenant)
   - SHARED_APPS: Data stored in public schema (shared across tenants)
   - Categories must be tenant-specific for data isolation

2. **Locate tenant configuration**
   - Find TENANT_APPS setting in Django settings
   - This was configured during Phase-02 multi-tenancy setup
   - Usually in base.py or tenant-specific settings file

3. **Add categories to TENANT_APPS**
   - Add 'apps.categories' to TENANT_APPS list
   - Place in logical order with other ERP apps
   - Use full path: 'apps.categories' or 'categories' based on project structure

4. **Add descriptive comment**
   - Include inline comment: "# Product category hierarchy"
   - Helps identify purpose in app list

5. **Verify SHARED_APPS unchanged**
   - Confirm categories is NOT in SHARED_APPS
   - Double-check authentication, tenants apps remain in SHARED_APPS

### Multi-Tenancy App Configuration
```
SHARED_APPS = [
    'django_tenants',        # Tenant framework
    'django.contrib.auth',   # User authentication
    'django.contrib.admin',  # Admin site
    'apps.tenants',          # Tenant models
    ...
]

TENANT_APPS = [
    'django.contrib.contenttypes',  # Content types per tenant
    'apps.categories',              # Product category hierarchy
    'apps.products',                # Product catalog
    'apps.inventory',               # Stock management
    ...
]

INSTALLED_APPS = SHARED_APPS + TENANT_APPS
```

### Why TENANT_APPS?
| Reason | Explanation |
|--------|-------------|
| **Data Isolation** | Each tenant has separate category structure |
| **Schema Separation** | Categories stored in tenant-specific schema |
| **No Cross-Tenant Access** | Tenant A cannot see Tenant B's categories |
| **Independent Operations** | Delete/modify without affecting other tenants |

### Expected Outcome
- categories app registered in TENANT_APPS
- App will create tables in tenant schemas
- Category data isolated per tenant

### Verification Steps
- Confirm 'apps.categories' in TENANT_APPS list
- Verify NOT in SHARED_APPS
- Check INSTALLED_APPS includes both lists

---

## Summary

### Tasks Completed in This Document
| Task # | Task Name | Key Deliverable |
|--------|-----------|-----------------|
| 01 | Install django-mptt | django-mptt package installed |
| 02 | Pin django-mptt Version | Version pinned in requirements.txt |
| 03 | Add to INSTALLED_APPS | mptt registered in Django |
| 04 | Create categories App | Django app structure created |
| 05 | Add categories to TENANT_APPS | App configured for multi-tenancy |

### What Was Accomplished
- django-mptt library installed and configured
- Categories Django app created with standard structure
- App registered as tenant-specific for data isolation
- Foundation ready for category model development

### Dependencies Satisfied for Next Document
- Django app structure exists
- django-mptt library available
- Multi-tenancy configuration complete
- Ready for app configuration and models module creation

### Next Steps
Proceed to [02_Tasks-06-10_App-Configuration-Models-Module.md](02_Tasks-06-10_App-Configuration-Models-Module.md) to configure the app and create the models directory structure.

---

## Notes for AI Agents

1. **Installation Context:** Ensure virtual environment is activated before pip install
2. **Version Selection:** Use latest stable django-mptt version at time of implementation
3. **Multi-Tenancy Critical:** Categories MUST be in TENANT_APPS, not SHARED_APPS
4. **App Location:** Categories app goes in backend/apps/ directory
5. **Naming Convention:** Use lowercase 'categories' (plural) for consistency
6. **No Code Yet:** These tasks are setup only; category model comes in Group B
7. **Verification:** Test that migrations system recognizes the new app
8. **Dependencies:** Requires Phase-02 multi-tenancy setup to be complete
