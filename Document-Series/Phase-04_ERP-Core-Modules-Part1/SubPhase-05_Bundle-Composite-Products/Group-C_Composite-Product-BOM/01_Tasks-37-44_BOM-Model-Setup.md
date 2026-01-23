# Tasks 37-44: BOM Model Setup

> **Phase:** 04 - ERP Core Modules Part 1  
> **SubPhase:** 05 - Bundle & Composite Products  
> **Group:** C - Composite Product & BOM  
> **Document:** 01 of 03  
> **Tasks Covered:** 37, 38, 39, 40, 41, 42, 43, 44

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **→ Next Document:** [02_Tasks-45-50_BOMItem-Base-Fields.md](02_Tasks-45-50_BOMItem-Base-Fields.md)

---

## Document Overview

This document establishes Bill of Materials (BOM) functionality for composite/manufactured products. Unlike bundles (which group existing products), BOM defines recipes for creating new products from raw materials. This enables manufacturing cost calculation, production planning, and inventory management for made-to-order or manufactured items.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 37 | Create bom.py File | Low | 3 min |
| 38 | Define BillOfMaterials Class | Medium | 10 min |
| 39 | Add product Field | Low | 5 min |
| 40 | Add version Field | Low | 5 min |
| 41 | Add is_active Field | Low | 3 min |
| 42 | Add notes Field | Low | 3 min |
| 43 | Add yield_quantity Field | Low | 5 min |
| 44 | Export BillOfMaterials | Low | 3 min |

---

## Task 37: Create bom.py File

### Overview
Create new model file for Bill of Materials models, separating manufacturing concerns from bundle logic.

### Dependencies
- Group B: Bundle Stock & Pricing Logic

### Instructions

1. **Create bom.py in models directory**
   - File: backend/apps/products/models/bom.py
   - Contains BillOfMaterials and BOMItem models

2. **Add file-level imports**
   - Django model components
   - TenantAwareModel, TimestampedModel
   - Product model reference
   - Validators for fields

3. **Add docstring**
   - Purpose: Manufacturing Bill of Materials
   - Note: Recipes for composite products

4. **Define __all__ list**
   - Initially empty, populated as models created

### Expected Outcome
```
backend/apps/products/models/
├── __init__.py
├── product.py
├── bundle.py
└── bom.py          # NEW FILE
```

### Verification Checklist
- [ ] bom.py file created
- [ ] Imports present
- [ ] Docstring added
- [ ] __all__ list defined

---

## Task 38: Define BillOfMaterials Class

### Overview
Create main BOM model representing a manufacturing recipe for a product.

### Dependencies
- Task 37: Create bom.py File

### Instructions

1. **Define BillOfMaterials class**
   - Inherit from TenantAwareModel, TimestampedModel
   - Container for manufacturing recipe

2. **Add class docstring**
   - Describe: Manufacturing recipe for composite product
   - Example: "Cake BOM: flour + sugar + eggs + labor"
   - Note versioning support

3. **Add Meta class**
   - verbose_name: "Bill of Materials"
   - verbose_name_plural: "Bills of Materials"
   - db_table: "products_bom"

4. **Plan structure**
   - Links to Product (the manufactured item)
   - Has version for recipe iterations
   - Contains BOMItems (raw materials)

### BOM Concept
```
BillOfMaterials:
  Product: "Custom Birthday Cake"
  Version: "1.0"
  Yield: 1 cake
  Items:
    - Flour (500g)
    - Sugar (200g)
    - Eggs (4 units)
    - Labor (2 hours)
```

### Expected Outcome
BillOfMaterials class defined with proper inheritance.

### Verification Checklist
- [ ] Class defined
- [ ] Proper inheritance
- [ ] Meta class configured
- [ ] Docstring present

---

## Task 39: Add product Field

### Overview
Link BOM to the product being manufactured.

### Dependencies
- Task 38: Define BillOfMaterials Class

### Instructions

1. **Add product ForeignKey**
   - Field: product
   - Type: models.ForeignKey to Product
   - on_delete: models.PROTECT
   - related_name: "boms"

2. **Add help text**
   - "The product manufactured using this BOM"

3. **Add database index**
   - db_index=True for queries

4. **Consider constraints**
   - One product can have multiple BOMs (versions)
   - Only one active BOM per product

### Expected Outcome
BOM linked to manufactured product.

### Verification Checklist
- [ ] Field defined
- [ ] Proper FK configuration
- [ ] Help text added
- [ ] Index added

---

## Task 40: Add version Field

### Overview
Add version field to support multiple BOM recipes for same product (e.g., "1.0", "1.1", "2.0").

### Dependencies
- Task 39: Add product Field

### Instructions

1. **Add version CharField**
   - Field: version
   - Type: models.CharField
   - max_length: 20
   - default: "1.0"

2. **Add help text**
   - "BOM version (e.g., 1.0, 1.1)"

3. **Support version formats**
   - Semantic versioning: "1.0", "2.1"
   - Date-based: "2026-01"
   - Custom labels: "standard", "premium"

4. **Add unique constraint (later)**
   - Unique together: (product, version)
   - Prevents duplicate versions

### Version Usage
```
Product: "Custom Cake"
  - BOM v1.0 (original recipe)
  - BOM v1.1 (reduced sugar)
  - BOM v2.0 (new ingredients)
```

### Expected Outcome
Version field supports multiple BOM recipes.

### Verification Checklist
- [ ] version CharField added
- [ ] Default version set
- [ ] Help text present

---

## Task 41: Add is_active Field

### Overview
Flag to mark the currently active BOM version (only one active per product).

### Dependencies
- Task 40: Add version Field

### Instructions

1. **Add is_active BooleanField**
   - Field: is_active
   - Type: models.BooleanField
   - default: True

2. **Add help text**
   - "Active BOM version for production"
   - "Only one BOM should be active per product"

3. **Add database index**
   - db_index=True
   - Filter active BOMs frequently

4. **Add validation logic**
   - Ensure only one active BOM per product
   - Implement in model clean() method

### Active BOM Logic
```
Product: "Cake"
  BOM v1.0: is_active=False (deprecated)
  BOM v1.1: is_active=False (superseded)
  BOM v2.0: is_active=True (current)
```

### Expected Outcome
is_active flag controls which BOM is used.

### Verification Checklist
- [ ] Field defined
- [ ] Default is True
- [ ] Indexed
- [ ] Validation planned

---

## Task 42: Add notes Field

### Overview
Add text field for manufacturing instructions and notes.

### Dependencies
- Task 41: Add is_active Field

### Instructions

1. **Add notes TextField**
   - Field: notes
   - Type: models.TextField
   - blank: True, null: True

2. **Add help text**
   - "Manufacturing instructions and notes"

3. **Usage examples**
   - Production steps
   - Quality requirements
   - Special handling instructions
   - Equipment needed

### Notes Examples
```
"Preheat oven to 180°C. Mix dry ingredients first.
Bake for 30 minutes. Allow to cool before decorating."

"Use premium grade flour for best results.
Temperature critical - monitor closely."
```

### Expected Outcome
notes field stores manufacturing instructions.

### Verification Checklist
- [ ] TextField defined
- [ ] Nullable and blank
- [ ] Help text added

---

## Task 43: Add yield_quantity Field

### Overview
Define how many output units one production run creates.

### Dependencies
- Task 42: Add notes Field

### Instructions

1. **Add yield_quantity PositiveIntegerField**
   - Field: yield_quantity
   - Type: models.PositiveIntegerField
   - default: 1

2. **Add help text**
   - "Number of units produced per batch"

3. **Add validator**
   - MinValueValidator(1)
   - At least one unit produced

4. **Use in cost calculation**
   - Total cost / yield_quantity = unit cost
   - Important for pricing

### Yield Examples
```
BOM: "Cookies"
  Yield: 12 cookies per batch
  Total cost: Rs. 600
  Unit cost: Rs. 50 per cookie

BOM: "Cake"
  Yield: 1 cake
  Total cost: Rs. 1,440
  Unit cost: Rs. 1,440 per cake
```

### Expected Outcome
yield_quantity defines production output.

### Verification Checklist
- [ ] Field defined
- [ ] Default is 1
- [ ] Validator added
- [ ] Help text present

---

## Task 44: Export BillOfMaterials

### Overview
Export BOM model and add string representations.

### Dependencies
- Task 43: Add yield_quantity Field

### Instructions

1. **Add __str__ method**
   - Format: f"{self.product.name} BOM v{self.version}"
   - Example: "Custom Cake BOM v2.0"

2. **Add __repr__ method**
   - Format: f"<BOM: {self.product.name} v{self.version} [{'active' if self.is_active else 'inactive'}]>"

3. **Update __all__ in bom.py**
   - Add 'BillOfMaterials'

4. **Update models/__init__.py**
   - Import: from .bom import BillOfMaterials
   - Add to __all__

### Expected Outcome
BillOfMaterials model is exported and accessible.

### Verification Checklist
- [ ] __str__ method added
- [ ] __repr__ method added
- [ ] Exported from bom.py
- [ ] Imported in __init__.py

---

## Summary of Tasks 37-44

### What Was Accomplished
- Created bom.py file for manufacturing models
- Defined BillOfMaterials container model
- Linked BOM to manufactured product
- Added version support for recipe iterations
- Implemented active status for current BOM
- Added notes for manufacturing instructions
- Defined yield quantity for batch production
- Exported model properly

### Current BillOfMaterials Structure
```
BillOfMaterials:
  - product (FK to Product) - indexed
  - version (CharField, e.g., "1.0")
  - is_active (BooleanField) - indexed
  - notes (TextField, nullable)
  - yield_quantity (PositiveIntegerField, default 1)
  - created_at, updated_at (from TimestampedModel)
  - tenant (from TenantAwareModel)
```

### Next Steps
Next document will create BOMItem model defining raw materials and quantities.

---

## Notes for Developers

### BOM vs Bundle
- **Bundle:** Group existing products for sale
- **BOM:** Recipe to manufacture new product from raw materials

### Versioning Strategy
- Support multiple BOM versions per product
- Only one active version at a time
- Historical versions preserved for audit
- Version when recipe changes

### Use Cases
- **Manufacturing:** Made-to-order products
- **Food Service:** Recipes with ingredients
- **Assembly:** Products assembled from parts
- **Crafts:** Handmade items with materials

### Database Considerations
- Unique constraint: (product, version)
- Unique constraint: (product) WHERE is_active=True
- Index on is_active for filtering

---
