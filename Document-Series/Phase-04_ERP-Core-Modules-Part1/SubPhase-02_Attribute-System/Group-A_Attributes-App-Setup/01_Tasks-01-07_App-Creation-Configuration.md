# Tasks 01-07: App Creation & Configuration

> **Phase:** 04 - ERP Core Modules Part 1  
> **SubPhase:** 02 - Attribute System  
> **Group:** A - Attributes App Setup  
> **Document:** 01 of 02  
> **Tasks Covered:** 01, 02, 03, 04, 05, 06, 07

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **→ Next Document:** [02_Tasks-08-14_Constants-Attribute-Types.md](02_Tasks-08-14_Constants-Attribute-Types.md)

---

## Document Overview

This document covers the creation and configuration of the attributes Django app. The attributes app manages product attributes, attribute groups, and attribute options for dynamic product specification in a multi-tenant environment.

### Tasks in This Document
| Task # | Task Name | Complexity |
|--------|-----------|------------|
| 01 | Create attributes App | Low |
| 02 | Add attributes to TENANT_APPS | Medium |
| 03 | Create attributes __init__.py | Low |
| 04 | Create attributes apps.py | Low |
| 05 | Configure App Label | Low |
| 06 | Create models Module | Low |
| 07 | Create models __init__.py | Low |

---

## Task 01: Create attributes App

### Overview
Create the attributes Django app within the backend/apps directory to house all attribute-related models, views, and business logic.

### Dependencies
None - First task in the Attribute System subphase

### Instructions

1. **Navigate to the apps directory**
   - Change directory to `backend/apps/`

2. **Create the attributes directory**
   - Create a new directory named `attributes`
   - This directory will contain all attribute app modules

3. **Verify directory location**
   - Ensure the directory is at `backend/apps/attributes/`
   - Directory should be at the same level as other tenant apps

### Business Context

The attributes app enables:
- Dynamic product specification without hardcoding fields
- Flexible attribute definitions (text, number, select, multiselect, boolean, date)
- Organized attribute groups (e.g., "Dimensions", "Technical Specs")
- Product variant differentiation through attribute values
- Filterable and searchable product attributes for webstore
- Category-specific attribute assignments

### Multi-Tenant Considerations

- Attributes are tenant-specific data
- Each tenant defines their own attributes
- Attribute schemas stored in tenant schema, not public schema
- Tenant isolation enforced at database level

### Expected Outcome
```
backend/apps/
├── core/
├── tenants/
├── attributes/              # New directory
└── [other apps]/
```

### Verification Checklist
- [ ] `backend/apps/attributes/` directory exists
- [ ] Directory is at correct location within apps
- [ ] No files created yet (empty directory)

---

## Task 02: Add attributes to TENANT_APPS

### Overview
Register the attributes app in the TENANT_APPS setting to ensure it operates within the multi-tenant architecture using django-tenants.

### Dependencies
- Task 01: Create attributes App

### Instructions

1. **Locate the settings file**
   - Open `backend/config/settings/base.py` or appropriate settings module

2. **Find TENANT_APPS configuration**
   - Locate the `TENANT_APPS` list/tuple in the settings file

3. **Add attributes to TENANT_APPS**
   - Add `'apps.attributes'` to the TENANT_APPS list
   - Place it after core tenant apps but before optional modules
   - Maintain alphabetical or logical grouping

4. **Verify TENANT_APPS vs SHARED_APPS distinction**
   - Ensure attributes is NOT in SHARED_APPS
   - TENANT_APPS = tenant-specific data (attributes belongs here)
   - SHARED_APPS = public schema data (e.g., tenants app)

### Why TENANT_APPS?

| Aspect | Explanation |
|--------|-------------|
| **Tenant Isolation** | Each tenant has unique attribute definitions |
| **Schema Separation** | Attributes stored in tenant schemas |
| **Data Privacy** | One tenant cannot see another's attributes |
| **Migrations** | Migrations run in each tenant schema |

### Settings Structure Example
```
SHARED_APPS = [
    'django_tenants',
    'apps.tenants',  # Tenant management in public schema
    ...
]

TENANT_APPS = [
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'apps.core',
    'apps.attributes',  # Add here
    'apps.categories',
    'apps.products',
    ...
]
```

### Expected Outcome
- Attributes app registered in TENANT_APPS
- App will create models in tenant schemas
- Migrations will run for each tenant

### Verification Checklist
- [ ] `'apps.attributes'` present in TENANT_APPS list
- [ ] NOT present in SHARED_APPS list
- [ ] Proper string format: `'apps.attributes'`
- [ ] Settings file saved without syntax errors

---

## Task 03: Create attributes __init__.py

### Overview
Create the package initializer file for the attributes app to make it a valid Python package.

### Dependencies
- Task 01: Create attributes App

### Instructions

1. **Create __init__.py file**
   - Create file named `__init__.py` in `backend/apps/attributes/`
   - This can be an empty file or contain app initialization code

2. **Add default_app_config (optional)**
   - For Django 3.1 and below, include default_app_config
   - For Django 3.2+, this is optional as apps.py is auto-discovered

3. **Leave empty for now**
   - Modern Django (4.0+, 5.0+) auto-discovers apps.py
   - File can remain empty unless future initialization needed

### Python Package Structure

The `__init__.py` file serves as:
- **Package Marker:** Identifies directory as Python package
- **Initialization Code:** Runs when package is imported
- **Namespace Definition:** Controls what's exposed when importing

### Expected Outcome
```
backend/apps/attributes/
└── __init__.py              # Empty file or minimal config
```

### Verification Checklist
- [ ] `__init__.py` file exists in `backend/apps/attributes/`
- [ ] File is valid Python (no syntax errors)
- [ ] Empty or contains only default_app_config

---

## Task 04: Create attributes apps.py

### Overview
Create the app configuration file that defines the attributes app metadata and configuration.

### Dependencies
- Task 03: Create attributes __init__.py

### Instructions

1. **Create apps.py file**
   - Create file named `apps.py` in `backend/apps/attributes/`

2. **Import AppConfig**
   - Import Django's AppConfig class

3. **Define AttributesConfig class**
   - Create class inheriting from AppConfig
   - Use descriptive class name: `AttributesConfig`

4. **Set name attribute**
   - Set `name` to `'apps.attributes'`
   - This must match the TENANT_APPS entry

5. **Set verbose_name attribute**
   - Set `verbose_name` to `'Attributes'`
   - This is the human-readable name in Django admin

6. **Set default_auto_field attribute**
   - Set to `'django.db.models.BigAutoField'`
   - Ensures consistent primary key field type

7. **Add ready() method (optional for now)**
   - This method runs when app is loaded
   - Used for signal registration (can be added later)

### App Configuration Structure

| Attribute | Purpose | Value |
|-----------|---------|-------|
| `name` | Python import path | `'apps.attributes'` |
| `verbose_name` | Display name in admin | `'Attributes'` |
| `default_auto_field` | Default PK field type | `'django.db.models.BigAutoField'` |

### Expected Outcome
```
backend/apps/attributes/
├── __init__.py
└── apps.py                  # App configuration
```

### Verification Checklist
- [ ] `apps.py` file exists
- [ ] AttributesConfig class defined
- [ ] `name = 'apps.attributes'` matches TENANT_APPS entry
- [ ] verbose_name set to 'Attributes'
- [ ] default_auto_field configured
- [ ] No syntax errors

---

## Task 05: Configure App Label

### Overview
Verify that the app label is correctly configured and can be referenced by Django's app registry.

### Dependencies
- Task 04: Create attributes apps.py

### Instructions

1. **Review app label configuration**
   - App label is derived from the `name` attribute in apps.py
   - Default label is the last component: 'attributes'

2. **Verify label matches conventions**
   - Should be lowercase
   - Should be singular or plural as appropriate
   - Should be unique across all apps

3. **Optionally set explicit label**
   - If needed, add `label = 'attributes'` in AttributesConfig
   - Only necessary if automatic label conflicts

4. **Test app label reference**
   - Django uses app labels for model references: `attributes.Attribute`
   - ContentType framework uses app labels
   - Admin URLs use app labels

### App Label Usage

| Context | Example |
|---------|---------|
| **Model Reference** | `get_model('attributes', 'Attribute')` |
| **ContentType** | `ContentType.objects.get(app_label='attributes')` |
| **Permissions** | `user.has_perm('attributes.add_attribute')` |
| **Admin URL** | `/admin/attributes/attribute/` |

### Expected Outcome
- App label 'attributes' is recognized by Django
- Label can be used for model lookups
- Label appears correctly in admin

### Verification Checklist
- [ ] App label determined from name attribute
- [ ] Label is lowercase: 'attributes'
- [ ] Label is unique across apps
- [ ] Can be used in `apps.get_model('attributes', 'ModelName')`

---

## Task 06: Create models Module

### Overview
Create a models module directory to organize multiple model files instead of using a single models.py file.

### Dependencies
- Task 04: Create attributes apps.py

### Instructions

1. **Create models directory**
   - Create directory named `models` in `backend/apps/attributes/`
   - This allows splitting models into separate files

2. **Rationale for directory approach**
   - Attributes app will have multiple models (AttributeGroup, Attribute, AttributeOption)
   - Separate files improve code organization
   - Easier to navigate and maintain
   - Reduces merge conflicts in teams

3. **Verify directory structure**
   - Ensure directory is at `backend/apps/attributes/models/`
   - Directory should be empty initially

### Module vs Directory Approach

| Approach | When to Use |
|----------|-------------|
| **Single models.py** | 1-3 simple models |
| **models/ directory** | 4+ models or complex relationships |

### Attributes App Model Count
- **AttributeGroup:** Organizes attributes into logical groups
- **Attribute:** Defines attribute specifications
- **AttributeOption:** Stores predefined choices for SELECT/MULTISELECT

Total: 3 models → Directory approach is appropriate

### Expected Outcome
```
backend/apps/attributes/
├── __init__.py
├── apps.py
└── models/                  # Models directory (empty)
```

### Verification Checklist
- [ ] `models/` directory exists in `backend/apps/attributes/`
- [ ] Directory is empty (no files yet)
- [ ] Properly named (lowercase, plural)

---

## Task 07: Create models __init__.py

### Overview
Create the models package initializer that will export all model classes for easy importing.

### Dependencies
- Task 06: Create models Module

### Instructions

1. **Create __init__.py file**
   - Create file named `__init__.py` in `backend/apps/attributes/models/`

2. **Leave empty initially**
   - File should exist but can be empty for now
   - Models will be imported here in future tasks

3. **Understand future structure**
   - Will contain imports: `from .attribute_group import AttributeGroup`
   - Will export models in `__all__` list
   - Enables clean imports: `from apps.attributes.models import Attribute`

### Future Import Pattern

```python
# Instead of:
from apps.attributes.models.attribute import Attribute
from apps.attributes.models.attribute_group import AttributeGroup

# Use:
from apps.attributes.models import Attribute, AttributeGroup
```

### Expected Outcome
```
backend/apps/attributes/
├── __init__.py
├── apps.py
└── models/
    └── __init__.py          # Empty for now
```

### Verification Checklist
- [ ] `__init__.py` exists in `models/` directory
- [ ] File is valid Python (no syntax errors)
- [ ] File is empty or contains only comments
- [ ] Django can recognize models as a Python package

---

## Summary

### Tasks Completed in This Document
| Task # | Task Name | Key Deliverable |
|--------|-----------|-----------------|
| 01 | Create attributes App | `backend/apps/attributes/` directory |
| 02 | Add attributes to TENANT_APPS | Setting updated in base.py |
| 03 | Create attributes __init__.py | Package initializer |
| 04 | Create attributes apps.py | AttributesConfig class |
| 05 | Configure App Label | App label 'attributes' |
| 06 | Create models Module | `models/` directory |
| 07 | Create models __init__.py | Models package initializer |

### Final Directory Structure
```
backend/apps/attributes/
├── __init__.py              # App package marker
├── apps.py                  # App configuration
└── models/                  # Models module
    └── __init__.py          # Models package marker
```

### Settings Configuration
```python
TENANT_APPS = [
    ...
    'apps.attributes',       # Added
    ...
]
```

### Tasks 01-07 Completion

All foundational tasks for the attributes app are complete:
- ✅ App directory created
- ✅ Registered in TENANT_APPS for multi-tenancy
- ✅ Package structure established
- ✅ App configuration defined
- ✅ Models module prepared

### Next Steps
1. Proceed to [02_Tasks-08-14_Constants-Attribute-Types.md](02_Tasks-08-14_Constants-Attribute-Types.md) to define attribute type constants
2. These constants will be used for model choices in subsequent tasks

---

## Notes for AI Agents

1. **Execution Order:** Tasks 01-07 must be executed sequentially
2. **Multi-Tenancy Critical:** Attributes MUST be in TENANT_APPS, not SHARED_APPS
3. **Directory Approach:** Models directory preferred over single models.py
4. **No Code Yet:** Only directory and configuration files created
5. **Dependencies Clear:** Each task builds on previous tasks
6. **Verification Essential:** Check each step before proceeding
