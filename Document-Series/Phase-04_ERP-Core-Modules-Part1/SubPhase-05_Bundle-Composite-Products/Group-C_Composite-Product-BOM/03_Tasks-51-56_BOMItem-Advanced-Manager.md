# Tasks 51-56: BOMItem Advanced & Manager

> **Phase:** 04 - ERP Core Modules Part 1  
> **SubPhase:** 05 - Bundle & Composite Products  
> **Group:** C - Composite Product & BOM  
> **Document:** 03 of 03  
> **Tasks Covered:** 51, 52, 53, 54, 55, 56

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [02_Tasks-45-50_BOMItem-Base-Fields.md](02_Tasks-45-50_BOMItem-Base-Fields.md)
- **→ Next Group:** [../Group-D_Manufacturing-Cost-Calculation/](../Group-D_Manufacturing-Cost-Calculation/)

---

## Document Overview

This document completes the BOMItem model with advanced features: critical component flagging, substitute material support, display ordering, and database migration. It also creates a custom manager for BOM queries.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 51 | Add is_critical Field | Low | 3 min |
| 52 | Add substitute Field | Medium | 8 min |
| 53 | Add sort_order Field | Low | 3 min |
| 54 | Export BOMItem | Low | 3 min |
| 55 | Create BOM Migration | Low | 5 min |
| 56 | Create BOM Manager | Medium | 10 min |

---

## Task 51: Add is_critical Field

### Overview
Flag critical components that have no substitutes and are essential for production.

### Dependencies
- Task 50: Add wastage_percent Field

### Instructions

1. **Add is_critical BooleanField**
   - Field: is_critical
   - default: False

2. **Add help text**
   - "Critical component with no alternatives"

3. **Use in production planning**
   - Check critical items first
   - Alert when critical stock low
   - Priority ordering for critical items

### Critical Item Examples
```
Cake BOM:
  - Eggs: is_critical=True (no substitute)
  - Vanilla Extract: is_critical=True (defines flavor)
  - Sugar: is_critical=False (can use honey)
```

### Expected Outcome
is_critical field identifies essential components.

### Verification Checklist
- [ ] BooleanField added
- [ ] Default False
- [ ] Help text present

---

## Task 52: Add substitute Field

### Overview
Support alternative materials when primary unavailable.

### Dependencies
- Task 51: Add is_critical Field

### Instructions

1. **Add substitute ForeignKey**
   - Field: substitute
   - Type: models.ForeignKey to Product
   - null=True, blank=True
   - on_delete: models.SET_NULL
   - related_name: "substituted_for"

2. **Add help text**
   - "Alternative material if primary unavailable"

3. **Self-referential option**
   - Could also be FK to BOMItem itself
   - Current: FK to Product for simplicity

4. **Business logic**
   - Use substitute if primary out of stock
   - May affect cost calculation
   - May affect quality

### Substitute Examples
```
Butter (primary) → Margarine (substitute)
Whole Milk → Skim Milk
White Sugar → Brown Sugar
Brand A Flour → Brand B Flour
```

### Expected Outcome
substitute field provides material alternatives.

### Verification Checklist
- [ ] FK to Product
- [ ] Nullable
- [ ] SET_NULL on delete
- [ ] Help text added

---

## Task 53: Add sort_order Field

### Overview
Control display order of BOM items.

### Dependencies
- Task 52: Add substitute Field

### Instructions

1. **Add sort_order PositiveIntegerField**
   - Field: sort_order
   - default: 0

2. **Add help text**
   - "Display order in BOM listing"

3. **Add to Meta ordering**
   - ordering: ['sort_order', 'raw_material__name']

4. **Update Meta class**
   - Add __str__ and __repr__ methods
   - Add unique constraint

### Expected Outcome
sort_order controls item display sequence.

### Verification Checklist
- [ ] Field added
- [ ] Default set
- [ ] Meta ordering updated

---

## Task 54: Export BOMItem

### Overview
Export BOMItem model with proper string representations.

### Dependencies
- Task 53: Add sort_order Field

### Instructions

1. **Add __str__ method**
   - Format: f"{self.bom.product.name}: {self.raw_material.name} ({self.quantity} {self.unit_of_measure})"
   - Example: "Cake BOM: Flour (0.5 kg)"

2. **Add __repr__ method**
   - Format: f"<BOMItem: {self.raw_material.name} for {self.bom.product.name}>"

3. **Add Meta constraints**
   - Unique: (bom, raw_material)

4. **Update __all__ in bom.py**
   - Add 'BOMItem'

5. **Update models/__init__.py**
   - Import BOMItem
   - Add to __all__

### Expected Outcome
BOMItem properly exported and accessible.

### Verification Checklist
- [ ] __str__ method added
- [ ] __repr__ method added
- [ ] Constraints defined
- [ ] Exported correctly

---

## Task 55: Create BOM Migration

### Overview
Generate and apply migration for BOM models.

### Dependencies
- Task 54: Export BOMItem

### Instructions

1. **Generate migration**
   - Command: python manage.py makemigrations products
   - Creates BillOfMaterials and BOMItem tables

2. **Review migration file**
   - Verify all fields present
   - Check foreign keys
   - Confirm constraints

3. **Apply migration**
   - Command: python manage.py migrate products
   - Creates tables in all tenant schemas

4. **Verify database**
   - Check products_bom table
   - Check products_bom_item table
   - Verify indexes and constraints

### Expected Database Schema
```
products_bom:
  - id, tenant_id
  - product_id, version
  - is_active, notes, yield_quantity
  - timestamps

products_bom_item:
  - id, tenant_id
  - bom_id, raw_material_id, substitute_id
  - quantity, unit_of_measure
  - wastage_percent, is_critical, sort_order
  - timestamps
```

### Expected Outcome
Database tables created for BOM models.

### Verification Checklist
- [ ] Migration generated
- [ ] Migration applied
- [ ] Tables created
- [ ] Constraints applied

---

## Task 56: Create BOM Manager

### Overview
Create custom manager for BillOfMaterials with common query patterns.

### Dependencies
- Task 55: Create BOM Migration

### Instructions

1. **Create BOMManager class**
   - In bom.py or separate file
   - Inherit from models.Manager

2. **Add active method**
   - Filter: is_active=True
   - Returns active BOMs

3. **Add for_product method**
   - Parameter: product
   - Returns BOMs for specific product

4. **Add active_for_product method**
   - Combines above filters
   - Returns active BOM for product

5. **Add with_items method**
   - Prefetch related items
   - Prefetch raw_materials

6. **Attach to BillOfMaterials**
   - Add: objects = BOMManager()

### Manager Methods
```
BillOfMaterials.objects:
  ├── active() → Active BOMs only
  ├── for_product(product) → BOMs for product
  ├── active_for_product(product) → Active BOM for product
  └── with_items() → Prefetch items
```

### Expected Outcome
BOMManager provides optimized BOM queries.

### Verification Checklist
- [ ] Manager class defined
- [ ] Methods implemented
- [ ] Attached to model
- [ ] Prefetch optimization added

---

## Summary of Tasks 51-56

### What Was Accomplished
- Added critical component flagging
- Implemented substitute material support
- Added sort order for display
- Exported BOMItem model
- Created database migration
- Implemented custom BOM manager

### Complete BOM Model Structure
```
BillOfMaterials:
  - product, version, is_active
  - notes, yield_quantity
  - Custom Manager with optimization

BOMItem:
  - bom, raw_material, substitute
  - quantity, unit_of_measure
  - wastage_percent, is_critical, sort_order
  - Constraints: unique(bom, raw_material)
```

### BOM Features
- Version management for recipe iterations
- Only one active BOM per product
- Wastage tracking for realistic costs
- Critical components flagging
- Substitute materials for flexibility
- Ordered display of ingredients

### Group C Complete
All Bill of Materials models implemented. Next group will add manufacturing cost calculation services.

---

## Notes for Developers

### Production Planning
- Check critical items first
- Use substitutes when primary unavailable
- Calculate wastage in material requirements
- Track BOM versions for audit

### Cost Calculation Preview
```
Material Cost = Σ(item.quantity * (1 + wastage%) * unit_price)
+ Labor Cost
+ Overhead Cost
= Total Manufacturing Cost
```

### Query Patterns
```
# Get active BOM for product
bom = BillOfMaterials.objects.active_for_product(product)

# Get BOM with items
bom = BillOfMaterials.objects.with_items().get(id=bom_id)

# Check material availability
for item in bom.items.all():
    if item.is_critical:
        check_stock(item.raw_material)
```

---
