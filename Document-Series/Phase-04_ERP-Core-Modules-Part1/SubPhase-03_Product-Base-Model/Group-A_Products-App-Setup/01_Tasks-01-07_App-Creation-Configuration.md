# Tasks 01-07: App Creation & Configuration

> **Phase:** 04 - ERP Core Modules Part 1  
> **SubPhase:** 03 - Product Base Model  
> **Group:** A - Products App Setup  
> **Document:** 01 of 02  
> **Tasks Covered:** 01, 02, 03, 04, 05, 06, 07

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **→ Next Document:** [02_Tasks-08-14_Constants-Product-Types-Status.md](02_Tasks-08-14_Constants-Product-Types-Status.md)

---

## Document Overview

This document covers the initial setup of the products Django app and its configuration. These tasks establish the foundational app structure for managing products, including proper multi-tenant registration and models directory setup.

### Tasks in This Document
| Task # | Task Name | Complexity |
|--------|-----------|------------|
| 01 | Create products App | Low |
| 02 | Add products to TENANT_APPS | Medium |
| 03 | Create products __init__.py | Low |
| 04 | Create products apps.py | Low |
| 05 | Configure App Label | Low |
| 06 | Create models Module | Low |
| 07 | Create models __init__.py | Low |

---

## Task 01: Create products App

### Overview
Create a new Django application named `products` within the backend apps directory. This app will manage all product-related functionality for the ERP system.

### Dependencies
- Phase-03 Core Backend Infrastructure must be complete
- SubPhase-01 Category Model must exist
- SubPhase-02 Attribute System must exist

### Instructions

1. **Navigate to the apps directory**
   - Change to the backend apps directory: `backend/apps/`
   - This is where all Django applications are located

2. **Create the products app**
   - Use Django's startapp command to create the products app
   - Command should be executed from the backend directory
   - App name must be exactly `products` (lowercase)

3. **Verify app directory structure**
   - Confirm the following files were created:
     - `__init__.py`
     - `admin.py`
     - `apps.py`
     - `models.py`
     - `tests.py`
     - `views.py`
   - Confirm `migrations/` directory was created

4. **Remove default models.py**
   - Delete the default `models.py` file
   - We will create a models module (directory) instead
   - This allows better organization of multiple model files

### Expected Outcome
```
backend/apps/products/
├── __init__.py
├── admin.py
├── apps.py
├── migrations/
│   └── __init__.py
├── tests.py
└── views.py
```

### Verification Checklist
- [ ] products directory exists in `backend/apps/`
- [ ] All default Django app files are present
- [ ] migrations directory exists with __init__.py
- [ ] models.py has been removed

---

## Task 02: Add products to TENANT_APPS

### Overview
Register the products app as a tenant-specific application in Django settings. This ensures product data is isolated per tenant schema.

### Dependencies
- Task 01: Create products App

### Instructions

1. **Locate the settings file**
   - Open the Django settings file
   - Find the `TENANT_APPS` configuration list
   - This should be in settings/base.py or settings.py

2. **Add products to TENANT_APPS**
   - Add `'apps.products'` to the TENANT_APPS list
   - Place it after the categories and attributes apps
   - Maintain alphabetical or logical ordering

3. **Verify TENANT_APPS vs SHARED_APPS**
   - Confirm products is in TENANT_APPS, not SHARED_APPS
   - Products must be tenant-specific for data isolation
   - Each tenant will have separate product tables

4. **Understand tenant implications**
   - Product models will be created in each tenant schema
   - Migrations will run for each tenant
   - Products are isolated between tenants

### Configuration Structure

| Setting | Purpose |
|---------|---------|
| **SHARED_APPS** | Apps shared across all tenants (e.g., public schema) |
| **TENANT_APPS** | Apps with tenant-specific data (e.g., products) |
| **INSTALLED_APPS** | Combined list of all apps |

### Expected Outcome
```python
TENANT_APPS = [
    'apps.core',
    'apps.categories',
    'apps.attributes',
    'apps.products',  # ← Added
    # ... other tenant apps
]
```

### Verification Checklist
- [ ] products added to TENANT_APPS list
- [ ] products is NOT in SHARED_APPS
- [ ] Placement is logical (after categories/attributes)
- [ ] No syntax errors in settings file

---

## Task 03: Create products __init__.py

### Overview
Set up the main `__init__.py` file for the products app with proper metadata and version information.

### Dependencies
- Task 02: Add products to TENANT_APPS

### Instructions

1. **Open the products/__init__.py file**
   - This file was created by Django's startapp command
   - It should currently be empty

2. **Add app version information**
   - Define `__version__` variable with semantic version
   - Use format: `'0.1.0'` for initial development
   - This tracks the app's development progress

3. **Add default_app_config (if needed)**
   - For Django versions before 3.2, add default_app_config
   - Point to the AppConfig class
   - For Django 3.2+, this is handled automatically

4. **Add docstring**
   - Add module-level docstring describing the app
   - Include purpose, key features, and product types
   - Keep it concise but informative

### Content Guidelines

| Element | Purpose |
|---------|---------|
| **Docstring** | Describes app purpose and features |
| **__version__** | Tracks app version for releases |
| **default_app_config** | Legacy config (pre-Django 3.2) |

### Expected Outcome
```python
"""
Products app for LankaCommerce Cloud.

Manages product catalog with support for:
- Simple products
- Variable products (with variants)
- Bundle products
- Composite products
"""

__version__ = '0.1.0'
```

### Verification Checklist
- [ ] __init__.py has module docstring
- [ ] __version__ is defined
- [ ] Docstring mentions product types
- [ ] File is properly formatted

---

## Task 04: Create products apps.py

### Overview
Configure the Django AppConfig class for the products app with proper metadata and initialization settings.

### Dependencies
- Task 03: Create products __init__.py

### Instructions

1. **Open the products/apps.py file**
   - This file was created by Django's startapp command
   - Contains a basic AppConfig class

2. **Update the AppConfig class**
   - Set `name` to the full app path: `'apps.products'`
   - Set `verbose_name` to a human-readable name
   - Set `default_auto_field` to use BigAutoField

3. **Add verbose_name**
   - Use a descriptive name for admin display
   - Example: "Products & Inventory"
   - This appears in Django admin site

4. **Configure default_auto_field**
   - Set to 'django.db.models.BigAutoField'
   - This defines the default primary key type
   - Ensures 64-bit integers for auto-increment IDs

5. **Add ready() method (optional)**
   - Use ready() to import signals if needed later
   - Can register signal handlers here
   - Leave empty or add comment for now

### AppConfig Elements

| Field | Purpose |
|-------|---------|
| **name** | Full Python path to the app |
| **verbose_name** | Human-readable name for admin |
| **default_auto_field** | Default primary key field type |
| **ready()** | Initialization code, signal registration |

### Expected Outcome
```python
from django.apps import AppConfig


class ProductsConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'apps.products'
    verbose_name = 'Products & Inventory'

    def ready(self):
        # Import signal handlers when ready
        # import apps.products.signals
        pass
```

### Verification Checklist
- [ ] name is set to 'apps.products'
- [ ] verbose_name is descriptive
- [ ] default_auto_field is configured
- [ ] Class inherits from AppConfig

---

## Task 05: Configure App Label

### Overview
Verify and configure the app label for proper identification within Django's app registry.

### Dependencies
- Task 04: Create products apps.py

### Instructions

1. **Understand app labels**
   - App label is used by Django to identify the app
   - Default label is the last component of the name
   - For 'apps.products', the label is 'products'

2. **Verify default label is acceptable**
   - The default label 'products' is clear and descriptive
   - No conflicts with other apps in the project
   - Lowercase, no special characters

3. **Optionally override label**
   - If needed, add `label = 'products'` to AppConfig
   - Usually not necessary unless there's a naming conflict
   - Keep default if possible for consistency

4. **Understand label usage**
   - Used in migrations: `apps.products.0001_initial`
   - Used in admin URLs: `/admin/products/`
   - Used in template tags and lookups

### When to Override Label

| Scenario | Action |
|----------|--------|
| **No conflict** | Use default label |
| **Name conflict** | Override with unique label |
| **Legacy compatibility** | Match old label |

### Expected Outcome
```python
class ProductsConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'apps.products'
    verbose_name = 'Products & Inventory'
    # label = 'products'  # Default, no need to specify
```

### Verification Checklist
- [ ] App label is 'products'
- [ ] No label conflicts with other apps
- [ ] Label is referenced correctly in settings
- [ ] Label follows Django naming conventions

---

## Task 06: Create models Module

### Overview
Create a models directory to organize multiple model files instead of using a single models.py file.

### Dependencies
- Task 05: Configure App Label

### Instructions

1. **Create models directory**
   - Create a new directory named `models` inside products app
   - This directory will contain all model files
   - Better organization than single models.py

2. **Remove old models.py (if exists)**
   - Delete the default models.py file created by startapp
   - Ensure it's completely removed
   - We're replacing it with a models module

3. **Understand models directory structure**
   - Each model class will be in its own file
   - Files named after the model: brand.py, product.py, etc.
   - __init__.py will import and export all models

4. **Plan model organization**
   - Supporting models: brand.py, tax_class.py, unit_of_measure.py
   - Core model: product.py
   - Managers: managers.py
   - Each file focuses on one model

### Models Directory Structure

```
models/
├── __init__.py          # Imports and exports all models
├── brand.py             # Brand model
├── tax_class.py         # TaxClass model
├── unit_of_measure.py   # UnitOfMeasure model
├── product.py           # Product model
└── managers.py          # Custom managers and querysets
```

### Benefits of Models Module

| Benefit | Description |
|---------|-------------|
| **Organization** | Each model in separate file |
| **Clarity** | Easier to navigate large codebases |
| **Maintenance** | Changes isolated to specific files |
| **Git History** | Better change tracking |

### Expected Outcome
```
backend/apps/products/
├── __init__.py
├── apps.py
├── admin.py
├── models/              # ← Created
│   └── (empty for now)
└── migrations/
    └── __init__.py
```

### Verification Checklist
- [ ] models/ directory exists
- [ ] Old models.py file is removed
- [ ] models/ directory is at correct location
- [ ] No models.pyc or __pycache__ remnants

---

## Task 07: Create models __init__.py

### Overview
Create the `__init__.py` file for the models module. This file will import and export all model classes for easy access throughout the application.

### Dependencies
- Task 06: Create models Module

### Instructions

1. **Create models/__init__.py file**
   - Create a new file named `__init__.py` in models directory
   - This makes models a proper Python package
   - Initially, it should have a docstring only

2. **Add module docstring**
   - Describe the purpose of the models module
   - List the models that will be defined
   - Mention the product types supported

3. **Prepare import structure**
   - Add comments for future imports
   - Structure imports by category: supporting models, core models
   - Use explicit imports for clarity

4. **Define __all__ list**
   - Create an empty __all__ list for now
   - This will list all exported model names
   - Models will be added as they're created

5. **Add import comments**
   - Add commented import statements as placeholders
   - Shows what will be imported in future tasks
   - Helps with planning and documentation

### Import Organization

| Section | Models |
|---------|--------|
| **Supporting Models** | Brand, TaxClass, UnitOfMeasure |
| **Core Models** | Product |
| **Managers** | ProductManager, ProductQuerySet |

### Expected Outcome
```python
"""
Product models for LankaCommerce Cloud.

This module contains:
- Brand: Product brand/manufacturer
- TaxClass: Tax rate configuration
- UnitOfMeasure: Product measurement units
- Product: Core product model
"""

# Supporting models
# from .brand import Brand
# from .tax_class import TaxClass
# from .unit_of_measure import UnitOfMeasure

# Core models
# from .product import Product

# Managers
# from .managers import ProductManager, ProductQuerySet

__all__ = [
    # Models will be added here as they're created
]
```

### Verification Checklist
- [ ] models/__init__.py file exists
- [ ] Module has descriptive docstring
- [ ] Import structure is planned
- [ ] __all__ list is defined (empty for now)

---

## Summary of Deliverables

After completing these tasks, the following structure should exist:

```
backend/apps/products/
├── __init__.py                    # App metadata with version
├── apps.py                        # AppConfig with proper settings
├── admin.py                       # Default Django file
├── models/                        # Models module (directory)
│   └── __init__.py               # Models package init with planned imports
├── migrations/
│   └── __init__.py
├── tests.py
└── views.py
```

### Key Achievements
✓ Products app created and properly structured  
✓ App registered in TENANT_APPS for multi-tenancy  
✓ Models organized as module instead of single file  
✓ AppConfig properly configured with metadata  
✓ Foundation ready for model development

---

## Notes for Implementation

1. **Multi-Tenancy Critical**
   - Products must be in TENANT_APPS, not SHARED_APPS
   - This ensures data isolation between tenants
   - Migrations run separately for each tenant schema

2. **Models Module Benefits**
   - Easier to manage multiple related models
   - Better code organization and readability
   - Simplifies version control and code reviews

3. **App Configuration**
   - verbose_name appears in Django admin
   - default_auto_field ensures consistent ID types
   - ready() method for future signal registration

4. **Next Steps**
   - Define product type and status constants
   - Create supporting models (Brand, TaxClass, UoM)
   - Implement the Product model with all fields

---
