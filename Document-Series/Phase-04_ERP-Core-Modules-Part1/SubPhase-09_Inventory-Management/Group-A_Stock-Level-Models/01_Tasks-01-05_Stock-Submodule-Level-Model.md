# Tasks 01-05: Stock Submodule & StockLevel Model

> **Phase:** 04 - ERP Core Modules Part 1  
> **SubPhase:** 09 - Inventory Management  
> **Group:** A - Stock Level Models  
> **Document:** 01 of 04  
> **Tasks Covered:** 01, 02, 03, 04, 05

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **→ Next Document:** [02_Tasks-06-09_Quantity-Fields-Meta.md](02_Tasks-06-09_Quantity-Fields-Meta.md)

---

## Document Overview

This document covers the foundational setup for stock level tracking, including the stock submodule structure, status constants, and the core StockLevel model with product variant and location relationships.

### Tasks in This Document
| Task # | Task Name | Complexity |
|--------|-----------|------------|
| 01 | Create stock submodule | Low |
| 02 | Define stock status constants | Low |
| 03 | Create StockLevel model | Medium |
| 04 | Add variant FK option | Low |
| 05 | Add location FK | Low |

---

## Task 01: Create Stock Submodule

### Overview
Create the stock submodule package structure within the inventory app to organize all stock-related models, services, and business logic.

### Dependencies
- SubPhase-01: Monorepo structure established
- SubPhase-03: Core backend infrastructure
- Phase-04, SubPhase-01: Inventory app structure

### Instructions

1. **Create stock submodule directory**
   - Navigate to `apps/inventory/` directory
   - Create new directory named `stock/`
   - This will contain all stock-level and movement models

2. **Create package initialization file**
   - Create `__init__.py` in `stock/` directory
   - Add empty file initially (imports will be added later)

3. **Create models subdirectory**
   - Create `models/` directory inside `stock/`
   - Create `__init__.py` in `models/` directory
   - This will contain stock-related model definitions

4. **Plan module structure**
   - Prepare for multiple model files in `models/`:
     - `stock_level.py` - Stock quantity tracking
     - `stock_movement.py` - Stock movement history
     - Additional models as needed

5. **Document module purpose**
   - Add docstring to `stock/__init__.py`
   - Describe: "Stock management module for tracking inventory levels and movements"

### Expected Directory Structure
```
apps/inventory/stock/
├── __init__.py
└── models/
    └── __init__.py
```

### Verification Checklist
- [ ] `stock/` directory exists in `apps/inventory/`
- [ ] `stock/__init__.py` exists with module docstring
- [ ] `stock/models/` directory exists
- [ ] `stock/models/__init__.py` exists
- [ ] Directory structure follows Django app conventions

---

## Task 02: Define Stock Status Constants

### Overview
Define constants for stock availability status to maintain consistency across the system and enable easy status determination.

### Dependencies
- Task 01: Create stock submodule

### Instructions

1. **Create constants file**
   - Create `constants.py` in `stock/` directory
   - Add module-level docstring explaining stock status definitions

2. **Define stock status constants**
   - Create constants for three main status types:
     - IN_STOCK status
     - LOW_STOCK status  
     - OUT_OF_STOCK status
   - Use string values for clarity in database and API responses

3. **Create status choices tuple**
   - Define STOCK_STATUS_CHOICES tuple
   - Include all three statuses with human-readable descriptions
   - Format: `(value, display_name)` pairs

4. **Add status descriptions**
   - IN_STOCK: "In Stock" - Product available in sufficient quantity
   - LOW_STOCK: "Low Stock" - Product below reorder point threshold
   - OUT_OF_STOCK: "Out of Stock" - Product quantity zero or negative

5. **Document status determination logic**
   - Add comments explaining when each status applies:
     - IN_STOCK: quantity > reorder_point
     - LOW_STOCK: 0 < quantity <= reorder_point
     - OUT_OF_STOCK: quantity <= 0

6. **Create movement type constants (for later use)**
   - Define placeholder section for movement types
   - Will be populated in Group B (Stock Movement Tracking)

### Stock Status Reference

| Constant | Value | Condition | Description |
|----------|-------|-----------|-------------|
| IN_STOCK | "in_stock" | quantity > reorder_point | Sufficient stock available |
| LOW_STOCK | "low_stock" | 0 < quantity <= reorder_point | Below recommended level |
| OUT_OF_STOCK | "out_of_stock" | quantity <= 0 | No stock available |

### Expected File Structure
```python
# File: apps/inventory/stock/constants.py

# Module docstring
# Stock status constants
# Status choices tuple
# Movement type constants section (placeholder)
```

### Verification Checklist
- [ ] `constants.py` file exists in `stock/` directory
- [ ] Three stock status constants are defined
- [ ] STOCK_STATUS_CHOICES tuple exists
- [ ] Status descriptions are clear and documented
- [ ] Comments explain status determination logic

---

## Task 03: Create StockLevel Model

### Overview
Create the core StockLevel model to track product inventory quantities across different warehouses, serving as the foundation for all stock operations.

### Dependencies
- Task 02: Define stock status constants
- SubPhase-04: Product models (Product FK required)
- SubPhase-08: Warehouse model (Warehouse FK required)

### Instructions

1. **Create stock_level.py model file**
   - Create `stock_level.py` in `stock/models/` directory
   - Add file-level docstring explaining model purpose

2. **Import required dependencies**
   - Import Django models and fields
   - Import base model mixins from core app
   - Import Product and Warehouse models
   - Import stock status constants

3. **Define StockLevel model class**
   - Inherit from appropriate base model (TenantAwareModel or TimeStampedModel)
   - Add class-level docstring describing the model

4. **Add product foreign key**
   - Create ForeignKey to Product model
   - Set on_delete behavior to PROTECT (prevent deletion if stock exists)
   - Add related_name for reverse lookup: "stock_levels"
   - Add db_index for query performance

5. **Add warehouse foreign key**
   - Create ForeignKey to Warehouse model
   - Set on_delete to PROTECT
   - Add related_name: "stock_levels"
   - Add db_index for performance
   - This tracks which warehouse holds the stock

6. **Add quantity field**
   - Use DecimalField for precise quantity tracking
   - Set max_digits to 15
   - Set decimal_places to 3 (for fractional units)
   - Set default to 0
   - Add validation to ensure non-negative value

7. **Add reorder point field**
   - Use DecimalField with same precision as quantity
   - This defines the LOW_STOCK threshold
   - Set default to 10 (configurable per product/warehouse)
   - Add help text explaining purpose

8. **Add model string representation**
   - Define `__str__` method
   - Return format: "Product Name - Warehouse Name: Quantity"
   - Provides clear identification in admin and logs

9. **Add verbose names**
   - Set verbose_name to "Stock Level"
   - Set verbose_name_plural to "Stock Levels"

### Model Fields Overview

| Field | Type | Purpose | Constraints |
|-------|------|---------|-------------|
| product | ForeignKey | Product being tracked | on_delete=PROTECT, indexed |
| warehouse | ForeignKey | Storage location | on_delete=PROTECT, indexed |
| quantity | DecimalField | Current quantity on hand | max_digits=15, decimal_places=3, >=0 |
| reorder_point | DecimalField | Low stock threshold | Same as quantity, default=10 |

### Expected File Structure
```python
# File: apps/inventory/stock/models/stock_level.py

# Imports
# StockLevel model class
#   - Foreign keys (product, warehouse)
#   - Quantity field
#   - Reorder point field
#   - String representation
#   - Meta class (added in Task 09)
```

### Verification Checklist
- [ ] `stock_level.py` file exists in `stock/models/`
- [ ] StockLevel model inherits from base model
- [ ] Product FK exists with PROTECT and index
- [ ] Warehouse FK exists with PROTECT and index
- [ ] Quantity field uses DecimalField with appropriate precision
- [ ] Reorder_point field exists with default value
- [ ] `__str__` method returns meaningful representation
- [ ] Verbose names are defined

---

## Task 04: Add Variant FK Option

### Overview
Add support for product variants in stock tracking, allowing warehouses to maintain separate stock levels for different variants of the same product.

### Dependencies
- Task 03: Create StockLevel model
- SubPhase-04: Product Variants model

### Instructions

1. **Add variant foreign key field**
   - Add ForeignKey to ProductVariant model
   - Set field to be nullable/optional: `null=True, blank=True`
   - Set on_delete to CASCADE (if variant deleted, its stock records cascade)
   - Add related_name: "stock_levels"

2. **Add database index**
   - Include db_index=True for query performance
   - Variant will be frequently used in filtering operations

3. **Update help text**
   - Add help_text explaining variant usage
   - Mention: "Optional. If product has variants, specify which variant this stock level tracks"

4. **Document variant handling logic**
   - Add comments explaining NULL vs populated variant:
     - NULL variant: Stock tracked at product level (no variants)
     - Populated variant: Stock tracked at variant level
   - Product with variants must have variant specified in stock levels

5. **Consider unique constraint implications**
   - Note: Will be enforced in Task 09 with unique_together
   - Constraint: (product, variant, warehouse, location) must be unique
   - NULL values in unique constraints require special handling

### Variant Tracking Scenarios

| Scenario | Product | Variant | Stock Tracking |
|----------|---------|---------|----------------|
| Simple product | Product A | NULL | Track by product only |
| Product with variants | Product B | Variant 1 | Track separately per variant |
| Product with variants | Product B | Variant 2 | Track separately per variant |
| Product with variants | Product B | NULL | Invalid - must specify variant |

### Expected Field Addition
```python
# Add to StockLevel model:
# variant = ForeignKey(
#     ProductVariant,
#     null=True,
#     blank=True,
#     on_delete=CASCADE,
#     related_name="stock_levels",
#     db_index=True,
#     help_text="..."
# )
```

### Verification Checklist
- [ ] variant FK added to StockLevel model
- [ ] Field is nullable and optional
- [ ] on_delete=CASCADE is set
- [ ] related_name is "stock_levels"
- [ ] db_index is True
- [ ] Help text explains variant usage
- [ ] Comments document NULL vs populated logic

---

## Task 05: Add Location FK

### Overview
Add support for tracking stock at specific locations within a warehouse, enabling more granular inventory control and efficient picking operations.

### Dependencies
- Task 03: Create StockLevel model
- SubPhase-08: WarehouseLocation model

### Instructions

1. **Add location foreign key field**
   - Add ForeignKey to WarehouseLocation model
   - Set field to be nullable/optional: `null=True, blank=True`
   - Set on_delete to SET_NULL (if location deleted, stock remains at warehouse level)
   - Add related_name: "stock_levels"

2. **Add database index**
   - Include db_index=True for query performance
   - Location frequently used in warehouse operations

3. **Add help text**
   - Add help_text: "Optional. Specific location within the warehouse where stock is stored"
   - Clarify that NULL means stock tracked at warehouse level only

4. **Document location tracking levels**
   - Add comments explaining tracking granularity:
     - Warehouse level only: location = NULL
     - Location level: location populated
   - Location must belong to the specified warehouse (validate in service layer)

5. **Consider location validation logic**
   - Note: Will implement validation in service layer
   - Ensure location.warehouse == stock_level.warehouse
   - Prevents assigning location from wrong warehouse

6. **Update string representation** (if needed)
   - Consider including location in `__str__` method
   - Format: "Product - Warehouse [Location]: Quantity"
   - Show location only if populated

### Location Tracking Levels

| Level | Warehouse | Location | Use Case |
|-------|-----------|----------|----------|
| Warehouse | Specified | NULL | Small warehouses, bulk storage |
| Location | Specified | Specified | Large warehouses, bin tracking |

### Location Relationship Validation
```
Location → Warehouse relationship must match StockLevel → Warehouse
Validation: stock_level.location.warehouse == stock_level.warehouse
```

### Expected Field Addition
```python
# Add to StockLevel model:
# location = ForeignKey(
#     WarehouseLocation,
#     null=True,
#     blank=True,
#     on_delete=SET_NULL,
#     related_name="stock_levels",
#     db_index=True,
#     help_text="..."
# )
```

### Verification Checklist
- [ ] location FK added to StockLevel model
- [ ] Field is nullable and optional
- [ ] on_delete=SET_NULL is set
- [ ] related_name is "stock_levels"
- [ ] db_index is True
- [ ] Help text explains location usage
- [ ] Comments document warehouse-location relationship
- [ ] String representation updated (if including location)

---

## Summary

### Tasks Completed in This Document
| Task # | Task Name | Key Deliverable |
|--------|-----------|-----------------|
| 01 | Create stock submodule | `stock/` package with models subdirectory |
| 02 | Define stock status constants | `constants.py` with status definitions |
| 03 | Create StockLevel model | Core model with product, warehouse, quantity fields |
| 04 | Add variant FK option | Variant-level stock tracking support |
| 05 | Add location FK | Location-level stock tracking support |

### Current Progress
```
apps/inventory/stock/
├── __init__.py
├── constants.py              # Task 02 ✓
└── models/
    ├── __init__.py
    └── stock_level.py        # Tasks 03-05 ✓
```

### StockLevel Model Status
✓ **Completed Fields:**
- product (ForeignKey to Product)
- warehouse (ForeignKey to Warehouse)
- variant (ForeignKey to ProductVariant, optional)
- location (ForeignKey to WarehouseLocation, optional)
- quantity (DecimalField)
- reorder_point (DecimalField)

⏳ **Pending (Next Documents):**
- reserved_quantity, incoming_quantity, available_quantity (Tasks 06-08)
- Meta class with unique constraints (Task 09)
- Model manager and methods (Tasks 10-13)
- Signals and validation (Tasks 14-16)
- Cost tracking and admin (Tasks 17-18)

### Next Steps
Proceed to [02_Tasks-06-09_Quantity-Fields-Meta.md](02_Tasks-06-09_Quantity-Fields-Meta.md) to add additional quantity fields and model metadata.

---

## Notes for AI Agents

1. **Decimal Precision:** Use DecimalField for all quantity fields to avoid floating-point errors in financial calculations
2. **Foreign Key Protection:** Use PROTECT on product/warehouse to prevent accidental deletion of products with stock
3. **Variant Logic:** Products with variants MUST specify variant in stock levels; simple products have NULL variant
4. **Location Validation:** Location must belong to the same warehouse as the stock level (validate in service layer)
5. **Indexing Strategy:** Index all foreign keys for query performance, especially product and warehouse
6. **Multi-Tenancy:** Ensure StockLevel inherits from TenantAwareModel for schema isolation
7. **Next Document:** Continue with quantity field additions and Meta class configuration
