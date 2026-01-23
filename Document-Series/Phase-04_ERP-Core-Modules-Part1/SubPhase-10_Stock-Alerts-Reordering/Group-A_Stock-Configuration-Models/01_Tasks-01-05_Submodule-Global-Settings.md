# Tasks 01-05: Alerts Submodule & Global Settings

> **Phase:** 04 - ERP Core Modules Part 1  
> **SubPhase:** 10 - Stock Alerts & Reordering  
> **Group:** A - Stock Configuration Models  
> **Document:** 01 of 03  
> **Tasks Covered:** 01, 02, 03, 04, 05

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **→ Next Document:** [02_Tasks-06-10_Category-Product-Config.md](02_Tasks-06-10_Category-Product-Config.md)

---

## Document Overview

This document covers the foundation of the stock alerts and reordering system: creating the alerts submodule package structure, defining threshold and status constants, and implementing the GlobalStockSettings model for tenant-wide default alert configurations.

### Tasks in This Document
| Task # | Task Name | Complexity |
|--------|-----------|------------|
| 01 | Create alerts submodule | Low |
| 02 | Define threshold type constants | Low |
| 03 | Define stock status constants | Low |
| 04 | Create GlobalStockSettings model | Medium |
| 05 | Add global threshold fields | Low |

---

## Task 01: Create Alerts Submodule

### Overview
Create the `apps/inventory/alerts/` package structure to organize all stock alert and reordering functionality.

### Dependencies
- SubPhase-03: Products (parent inventory app)

### Instructions

1. **Create the alerts submodule directory**
   - Navigate to `apps/inventory/`
   - Create new directory named `alerts`

2. **Create package initialization file**
   - Create `__init__.py` in `alerts/` directory
   - Mark directory as Python package

3. **Create models directory structure**
   - Create `models/` subdirectory in `alerts/`
   - Create `models/__init__.py` file

4. **Create services directory structure**
   - Create `services/` subdirectory in `alerts/`
   - Create `services/__init__.py` file

5. **Create tasks directory structure**
   - Create `tasks/` subdirectory in `alerts/`
   - Create `tasks/__init__.py` file

6. **Create constants file**
   - Create `constants.py` in `alerts/` directory
   - This will hold all alert-related constants

7. **Create admin file**
   - Create `admin.py` in `alerts/` directory
   - Will register admin interfaces for alert models

8. **Create URLs file**
   - Create `urls.py` in `alerts/` directory
   - Will define API routes for alerts

9. **Create serializers directory**
   - Create `serializers/` subdirectory in `alerts/`
   - Create `serializers/__init__.py` file

10. **Create views directory**
    - Create `views/` subdirectory in `alerts/`
    - Create `views/__init__.py` file

### Directory Structure

```
apps/inventory/alerts/
├── __init__.py
├── constants.py
├── admin.py
├── urls.py
├── models/
│   └── __init__.py
├── serializers/
│   └── __init__.py
├── views/
│   └── __init__.py
├── services/
│   └── __init__.py
└── tasks/
    └── __init__.py
```

### Multi-Tenancy Considerations
- All alert models will be tenant-scoped
- Alert configurations respect schema isolation
- Monitoring tasks run per-tenant

### Expected Outcome
- Clean package structure for alerts functionality
- Organized separation of concerns (models, services, tasks)
- Ready for adding alert components

### Verification Checklist
- [ ] `alerts/` directory exists in `apps/inventory/`
- [ ] All subdirectories created with `__init__.py` files
- [ ] Package structure follows Django best practices
- [ ] Ready to add models, services, tasks

---

## Task 02: Define Threshold Type Constants

### Overview
Create constants to identify the level at which stock thresholds are configured: global (tenant-wide), category-level, or product-specific.

### Dependencies
- Task 01: Create alerts submodule

### Instructions

1. **Open constants.py file**
   - Navigate to `apps/inventory/alerts/constants.py`

2. **Add threshold type constants section**
   - Add comment header for threshold types
   - Organize constants in logical grouping

3. **Define GLOBAL threshold constant**
   - Name: `THRESHOLD_TYPE_GLOBAL`
   - Value: `'global'`
   - Represents tenant-wide default settings

4. **Define CATEGORY threshold constant**
   - Name: `THRESHOLD_TYPE_CATEGORY`
   - Value: `'category'`
   - Represents category-level overrides

5. **Define PRODUCT threshold constant**
   - Name: `THRESHOLD_TYPE_PRODUCT`
   - Value: `'product'`
   - Represents product-specific settings

6. **Create threshold type choices tuple**
   - Name: `THRESHOLD_TYPE_CHOICES`
   - Include all three types with human-readable labels
   - Format: `(value, display_name)` pairs

7. **Add docstring documentation**
   - Explain the inheritance chain
   - Note: Product overrides Category overrides Global

### Threshold Inheritance Chain
```
GlobalStockSettings (Tenant-wide)
         │
         ▼
CategoryStockConfig (Category override)
         │
         ▼
ProductStockConfig (Product override)
```

### Constants Definition
| Constant | Value | Purpose |
|----------|-------|---------|
| THRESHOLD_TYPE_GLOBAL | `'global'` | Tenant-wide defaults |
| THRESHOLD_TYPE_CATEGORY | `'category'` | Category overrides |
| THRESHOLD_TYPE_PRODUCT | `'product'` | Product-specific settings |

### Expected Outcome
- Threshold type constants available for import
- Clear hierarchy documentation
- Ready for use in configuration models

### Verification Checklist
- [ ] All three threshold types defined
- [ ] THRESHOLD_TYPE_CHOICES tuple created
- [ ] Docstrings explain inheritance
- [ ] Constants follow naming conventions

---

## Task 03: Define Stock Status Constants

### Overview
Create constants to represent different stock level statuses that trigger various alert levels and webstore behaviors.

### Dependencies
- Task 01: Create alerts submodule

### Instructions

1. **Add stock status constants section**
   - Add comment header in `constants.py`
   - Separate from threshold type constants

2. **Define NORMAL status constant**
   - Name: `STOCK_STATUS_NORMAL`
   - Value: `'normal'`
   - Stock level is healthy, above all thresholds

3. **Define LOW status constant**
   - Name: `STOCK_STATUS_LOW`
   - Value: `'low'`
   - Stock at or below low_stock_threshold

4. **Define CRITICAL status constant**
   - Name: `STOCK_STATUS_CRITICAL`
   - Value: `'critical'`
   - Stock at or below 50% of low_stock_threshold

5. **Define OUT_OF_STOCK status constant**
   - Name: `STOCK_STATUS_OUT_OF_STOCK`
   - Value: `'out_of_stock'`
   - Available quantity is zero or negative

6. **Create stock status choices tuple**
   - Name: `STOCK_STATUS_CHOICES`
   - Include all four statuses with labels
   - Format for Django model choices

7. **Add status calculation logic documentation**
   - Document threshold calculations
   - Note priority: OOS > Critical > Low > Normal

### Stock Status Levels
| Status | Condition | Priority | Action |
|--------|-----------|----------|--------|
| NORMAL | stock > low_stock_threshold | None | No alert |
| LOW | stock ≤ low_stock_threshold | Medium | Generate alert |
| CRITICAL | stock ≤ low_stock_threshold × 0.5 | High | Generate urgent alert |
| OUT_OF_STOCK | available_quantity ≤ 0 | Critical | Hide from webstore (optional) |

### Status Calculation Order
```
if available_quantity <= 0:
    status = OUT_OF_STOCK
elif stock <= (low_stock_threshold * 0.5):
    status = CRITICAL
elif stock <= low_stock_threshold:
    status = LOW
else:
    status = NORMAL
```

### Expected Outcome
- Four stock status constants defined
- Status choices tuple for models
- Clear calculation documentation

### Verification Checklist
- [ ] All four stock statuses defined
- [ ] STOCK_STATUS_CHOICES tuple created
- [ ] Status priority documented
- [ ] Calculation logic explained

---

## Task 04: Create GlobalStockSettings Model

### Overview
Create the GlobalStockSettings model to store tenant-wide default stock thresholds and alert configurations. This model provides fallback values when products don't have specific threshold settings.

### Dependencies
- Task 01: Create alerts submodule
- Phase-02: Multi-tenancy (tenant-scoped model)
- Phase-03: TenantAwareModel base class

### Instructions

1. **Create global_settings.py model file**
   - Create file in `apps/inventory/alerts/models/`
   - Name: `global_settings.py`

2. **Import required modules**
   - Import Django model classes
   - Import TenantAwareModel base class
   - Import validators (MinValueValidator, MaxValueValidator)
   - Import timezone utilities

3. **Define GlobalStockSettings model class**
   - Inherit from TenantAwareModel
   - Add docstring explaining purpose and scope

4. **Add tenant relationship**
   - Already provided by TenantAwareModel
   - OneToOne relationship with Tenant
   - Auto-scoped to current tenant schema

5. **Add model Meta class**
   - Set verbose_name: "Global Stock Settings"
   - Set verbose_name_plural: "Global Stock Settings"
   - Add db_table name: "inventory_global_stock_settings"

6. **Add __str__ method**
   - Return: f"Stock Settings - {self.tenant.name}"
   - Provides readable admin representation

7. **Add timestamps**
   - created_at: Auto-now-add timestamp
   - updated_at: Auto-now timestamp

8. **Register model in models/__init__.py**
   - Import GlobalStockSettings
   - Add to `__all__` list

### Model Structure
```python
class GlobalStockSettings(TenantAwareModel):
    """
    Tenant-wide default stock thresholds and alert settings.
    Provides fallback configuration when products don't have 
    specific threshold settings.
    """
    # Threshold fields (Task 05)
    # Alert settings fields (Task 06)
    # Timestamps
```

### Multi-Tenancy Considerations
- OneToOne relationship with Tenant (via TenantAwareModel)
- Automatically scoped to current tenant schema
- Each tenant has exactly one GlobalStockSettings instance
- Created automatically during tenant provisioning

### Expected Outcome
```
apps/inventory/alerts/models/
├── __init__.py
└── global_settings.py        # GlobalStockSettings model
```

### Verification Checklist
- [ ] GlobalStockSettings model created
- [ ] Inherits from TenantAwareModel
- [ ] Meta class with proper names
- [ ] __str__ method implemented
- [ ] Model registered in __init__.py

---

## Task 05: Add Global Threshold Fields

### Overview
Add default threshold fields to GlobalStockSettings model for low stock alerts, reorder points, and reorder quantities.

### Dependencies
- Task 04: Create GlobalStockSettings model

### Instructions

1. **Add default_low_threshold field**
   - Type: PositiveIntegerField
   - Description: Default low stock alert threshold
   - Default value: 10
   - Validators: MinValueValidator(0)
   - Help text: "Default threshold for low stock alerts"

2. **Add default_reorder_point field**
   - Type: PositiveIntegerField
   - Description: Default reorder point for all products
   - Default value: 15
   - Validators: MinValueValidator(0)
   - Help text: "Default stock level to trigger reorder suggestions"

3. **Add default_reorder_qty field**
   - Type: PositiveIntegerField
   - Description: Default quantity to reorder
   - Default value: 50
   - Validators: MinValueValidator(1)
   - Help text: "Default quantity to suggest when reordering"

4. **Add enable_auto_reorder field**
   - Type: BooleanField
   - Description: Enable automatic reorder suggestions
   - Default: True
   - Help text: "Automatically generate reorder suggestions"

5. **Add critical_threshold_multiplier field**
   - Type: DecimalField
   - Max digits: 3, Decimal places: 2
   - Description: Multiplier for critical threshold
   - Default: Decimal('0.50')
   - Validators: MinValueValidator(0.1), MaxValueValidator(1.0)
   - Help text: "Critical threshold = low_threshold × this value"

6. **Add days_of_history_for_velocity field**
   - Type: PositiveIntegerField
   - Description: Days of sales history for velocity calculation
   - Default: 30
   - Validators: MinValueValidator(7), MaxValueValidator(365)
   - Help text: "Number of days to analyze for sales velocity"

7. **Add default_lead_time_days field**
   - Type: PositiveIntegerField
   - Description: Default supplier lead time in days
   - Default: 7
   - Validators: MinValueValidator(1), MaxValueValidator(180)
   - Help text: "Default time from order to delivery"

8. **Add clean method for validation**
   - Validate reorder_point > low_threshold
   - Validate reorder_qty > 0
   - Raise ValidationError if invalid

### Threshold Fields Summary
| Field | Type | Default | Purpose |
|-------|------|---------|---------|
| default_low_threshold | PositiveIntegerField | 10 | Low stock alert trigger |
| default_reorder_point | PositiveIntegerField | 15 | Reorder suggestion trigger |
| default_reorder_qty | PositiveIntegerField | 50 | Suggested order quantity |
| enable_auto_reorder | BooleanField | True | Enable auto suggestions |
| critical_threshold_multiplier | DecimalField | 0.50 | Critical = Low × this |
| days_of_history_for_velocity | PositiveIntegerField | 30 | Sales analysis period |
| default_lead_time_days | PositiveIntegerField | 7 | Supplier delivery time |

### Validation Rules
- reorder_point should be ≥ low_threshold
- reorder_qty must be > 0
- critical_threshold_multiplier between 0.1 and 1.0
- days_of_history between 7 and 365 days

### Sri Lanka-Specific Defaults
- Default lead times reflect local supplier timelines
- Reorder quantities suitable for SME inventory levels
- Thresholds aligned with common business practices

### Expected Outcome
- GlobalStockSettings model with complete threshold configuration
- Sensible defaults for Sri Lankan SMEs
- Validation ensures logical threshold relationships

### Verification Checklist
- [ ] All seven threshold fields added
- [ ] Appropriate validators on each field
- [ ] Sensible default values set
- [ ] clean() method validates relationships
- [ ] Help text explains each field
