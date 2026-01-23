# Tasks 01-05: App Structure & Warehouse Model

> **Phase:** 04 - ERP Core Modules Part 1  
> **SubPhase:** 08 - Warehouse & Locations  
> **Group:** A - Warehouse Model & Configuration  
> **Document:** 01 of 04  
> **Tasks Covered:** 01, 02, 03, 04, 05

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **→ Next Document:** [02_Tasks-06-10_Address-Contact-Status.md](02_Tasks-06-10_Address-Contact-Status.md)

---

## Document Overview

This document covers the creation of the inventory app structure, warehouse submodule, and the core Warehouse model with essential fields. The warehouse system serves as the foundation for physical inventory management, enabling multi-location tracking and Sri Lanka-specific address handling.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 01 | Create inventory app structure | Low | 15 min |
| 02 | Create warehouse submodule | Low | 10 min |
| 03 | Define warehouse status constants | Low | 10 min |
| 04 | Define warehouse type constants | Low | 10 min |
| 05 | Create Warehouse model | Medium | 30 min |

---

## Task 01: Create Inventory App Structure

### Overview
Create the Django app structure for inventory management. This app will house all inventory-related functionality including warehouses, stock levels, transfers, and adjustments.

### Dependencies
- Phase 03: Core Backend Infrastructure complete
- Django project initialized

### Instructions

1. **Create the inventory app directory**
   - Navigate to `backend/apps/` directory
   - Create new directory named `inventory`
   - Ensure parent directories exist

2. **Create app initialization file**
   - Create `__init__.py` in `inventory/` directory
   - Keep file empty initially

3. **Create app configuration file**
   - Create `apps.py` in `inventory/` directory
   - Define `InventoryConfig` class
   - Set app name to `apps.inventory`
   - Set verbose name to `Inventory Management`
   - Set default_auto_field to `django.db.models.BigAutoField`

4. **Register the app**
   - Add `apps.inventory` to INSTALLED_APPS in settings
   - Position after core apps, before webstore

5. **Create migrations directory**
   - Create `migrations/` directory inside `inventory/`
   - Create empty `__init__.py` inside migrations

### Expected Outcome
```
backend/apps/inventory/
├── __init__.py
├── apps.py
└── migrations/
    └── __init__.py
```

### Verification Checklist
- [ ] inventory app directory exists
- [ ] `apps.py` contains InventoryConfig class
- [ ] App registered in INSTALLED_APPS
- [ ] migrations directory created

---

## Task 02: Create Warehouse Submodule

### Overview
Create a dedicated submodule for warehouse management within the inventory app. This organizational structure allows for clean separation of warehouse logic from other inventory components.

### Dependencies
- Task 01: Create inventory app structure

### Instructions

1. **Create warehouses submodule directory**
   - Create `warehouses/` directory inside `inventory/`
   - This will hold all warehouse-related code

2. **Create submodule initialization**
   - Create `__init__.py` in `warehouses/` directory
   - Keep empty for now

3. **Create models directory structure**
   - Create `models/` directory inside `warehouses/`
   - Create `__init__.py` in `models/` directory
   - Keep empty for now

4. **Create managers directory**
   - Create `managers/` directory inside `warehouses/`
   - Create `__init__.py` in `managers/` directory
   - For custom QuerySet managers

5. **Create constants file**
   - Create `constants.py` in `warehouses/` directory
   - This will hold warehouse-related constants
   - Add module-level docstring explaining purpose

### Expected Outcome
```
backend/apps/inventory/warehouses/
├── __init__.py
├── constants.py
├── models/
│   └── __init__.py
└── managers/
    └── __init__.py
```

### Verification Checklist
- [ ] warehouses submodule directory created
- [ ] models and managers directories exist
- [ ] constants.py file created
- [ ] All __init__.py files present

---

## Task 03: Define Warehouse Status Constants

### Overview
Define status constants for warehouse operational states. These constants standardize warehouse lifecycle management across the system.

### Dependencies
- Task 02: Create warehouse submodule

### Instructions

1. **Open constants.py file**
   - Navigate to `inventory/warehouses/constants.py`

2. **Add module docstring**
   - Describe the purpose: warehouse constants and choices
   - Mention multi-tenant context

3. **Define status constant values**
   - Create WAREHOUSE_STATUS_ACTIVE constant with value `'active'`
   - Create WAREHOUSE_STATUS_INACTIVE constant with value `'inactive'`
   - Create WAREHOUSE_STATUS_MAINTENANCE constant with value `'maintenance'`

4. **Create status choices tuple**
   - Define WAREHOUSE_STATUS_CHOICES as tuple of tuples
   - Format: (constant_value, display_label)
   - Use proper capitalization for display labels
   - Order: Active, Inactive, Maintenance

5. **Add inline comments**
   - Explain each status meaning
   - ACTIVE: Warehouse operational, can receive/ship
   - INACTIVE: Warehouse disabled, no operations
   - MAINTENANCE: Temporary closure for maintenance

### Content Structure

The constants should support these operational scenarios:
- **ACTIVE:** Normal warehouse operations, inventory movements allowed
- **INACTIVE:** Warehouse deactivated, no new operations (historical data preserved)
- **MAINTENANCE:** Temporary status during repairs, scheduled maintenance, or upgrades

### Expected Outcome
Constants file with:
- Three status constants
- Status choices tuple for model field
- Clear documentation of each status

### Verification Checklist
- [ ] Three status constants defined
- [ ] WAREHOUSE_STATUS_CHOICES tuple created
- [ ] Comments explain each status
- [ ] Follows Python naming conventions (UPPER_CASE)

---

## Task 04: Define Warehouse Type Constants

### Overview
Define warehouse type constants to categorize warehouses by their primary function. This enables proper routing, reporting, and operational workflows.

### Dependencies
- Task 03: Define warehouse status constants

### Instructions

1. **Add warehouse type constants**
   - Add to existing `constants.py` file
   - Create WAREHOUSE_TYPE_MAIN constant with value `'main'`
   - Create WAREHOUSE_TYPE_DISTRIBUTION constant with value `'distribution'`
   - Create WAREHOUSE_TYPE_RETAIL constant with value `'retail'`
   - Create WAREHOUSE_TYPE_RETURNS constant with value `'returns'`

2. **Create type choices tuple**
   - Define WAREHOUSE_TYPE_CHOICES as tuple of tuples
   - Format: (constant_value, display_label)
   - Use descriptive labels
   - Order: Main, Distribution, Retail, Returns

3. **Add inline comments explaining types**
   - MAIN: Primary central warehouse
   - DISTRIBUTION: Regional fulfillment centers
   - RETAIL: Store-attached warehouse
   - RETURNS: Dedicated RMA/returns processing

4. **Add usage notes**
   - Comment on typical use cases
   - Note Sri Lankan context (Colombo main, regional distribution)
   - Explain transfer routing implications

### Type Definitions

| Type | Purpose | Typical Operations |
|------|---------|-------------------|
| **MAIN** | Central storage facility | Bulk receiving, storage, large transfers |
| **DISTRIBUTION** | Regional fulfillment | Order fulfillment, local deliveries |
| **RETAIL** | Store inventory | Retail sales, customer pickup |
| **RETURNS** | RMA processing | Returns intake, refurbishment, disposal |

### Expected Outcome
Constants file containing:
- Four warehouse type constants
- Type choices tuple
- Documentation of each type

### Verification Checklist
- [ ] Four type constants defined
- [ ] WAREHOUSE_TYPE_CHOICES tuple created
- [ ] Comments explain each type
- [ ] Usage notes included

---

## Task 05: Create Warehouse Model

### Overview
Create the core Warehouse model with essential identification fields. This model represents physical warehouse locations within the multi-tenant system.

### Dependencies
- Task 02: Create warehouse submodule
- Task 03: Define warehouse status constants
- Task 04: Define warehouse type constants
- Phase 03: Base model mixins available

### Instructions

1. **Create warehouse model file**
   - Create `warehouse.py` in `warehouses/models/` directory
   - Add module docstring

2. **Import required dependencies**
   - Import Django models and fields
   - Import base model mixins (TimestampMixin, TenantMixin)
   - Import warehouse constants from constants.py
   - Import validators if needed

3. **Define Warehouse model class**
   - Inherit from TenantMixin, TimestampMixin, models.Model
   - Add class-level docstring explaining purpose
   - Note multi-tenant isolation

4. **Add basic identification fields**
   - **name:** CharField(max_length=200)
     - Verbose name: Warehouse Name
     - Help text: e.g., "Colombo Main Warehouse"
     - Required field (blank=False)
   
   - **code:** CharField(max_length=50, unique for tenant)
     - Verbose name: Warehouse Code
     - Help text: Unique code like "WH-CMB-01"
     - Uppercase storage
     - Required field
     - Add validation for alphanumeric with hyphens

5. **Add warehouse_type field**
   - Use CharField with max_length=20
   - Choices from WAREHOUSE_TYPE_CHOICES
   - Default to WAREHOUSE_TYPE_MAIN
   - Indexed field (db_index=True)

6. **Add __str__ method**
   - Return format: "{name} ({code})"
   - Handles None values gracefully

7. **Add __repr__ method**
   - Return technical representation with id and code

### Multi-Tenant Considerations

The warehouse model must enforce tenant isolation:
- All queries automatically filtered by tenant (via TenantMixin)
- Warehouse codes unique within tenant, but can repeat across tenants
- Each tenant has independent warehouse namespace
- Cross-tenant transfer validation required

### Sri Lankan Context

Consider these local requirements:
- Warehouse naming often includes city/region (Colombo, Kandy, Galle)
- Codes may follow patterns: WH-{CITY}-{NUMBER}
- Support for both Sinhala and English names in future
- Time zone: Asia/Colombo for all operations

### Expected Outcome
```
backend/apps/inventory/warehouses/models/
├── __init__.py
└── warehouse.py (NEW - basic model with name, code, type)
```

### Verification Checklist
- [ ] warehouse.py file created
- [ ] Warehouse model defined with proper inheritance
- [ ] name field with max_length=200
- [ ] code field with uniqueness constraint
- [ ] warehouse_type field with choices
- [ ] __str__ and __repr__ methods implemented
- [ ] Model docstring present
- [ ] Imports organized properly

---

## Summary

These first five tasks establish the foundation of the warehouse management system:

1. **Inventory app structure** created with proper Django organization
2. **Warehouse submodule** provides clean namespace separation
3. **Status constants** (ACTIVE, INACTIVE, MAINTENANCE) standardize warehouse states
4. **Type constants** (MAIN, DISTRIBUTION, RETAIL, RETURNS) categorize warehouse functions
5. **Warehouse model** created with name, code, and type fields

### What's Next?

The next document covers address fields, contact information, and status management for warehouses.

**→ Continue to:** [02_Tasks-06-10_Address-Contact-Status.md](02_Tasks-06-10_Address-Contact-Status.md)
