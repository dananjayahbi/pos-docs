# Tasks 45-50: BOMItem Base Fields

> **Phase:** 04 - ERP Core Modules Part 1  
> **SubPhase:** 05 - Bundle & Composite Products  
> **Group:** C - Composite Product & BOM  
> **Document:** 02 of 03  
> **Tasks Covered:** 45, 46, 47, 48, 49, 50

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [01_Tasks-37-44_BOM-Model-Setup.md](01_Tasks-37-44_BOM-Model-Setup.md)
- **→ Next Document:** [03_Tasks-51-56_BOMItem-Advanced-Manager.md](03_Tasks-51-56_BOMItem-Advanced-Manager.md)

---

## Document Overview

This document creates the BOMItem model representing individual raw materials in a manufacturing recipe. Each BOMItem specifies which material is needed, the quantity required, unit of measure, and wastage allowance for realistic cost calculations.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 45 | Define BOMItem Class | Medium | 10 min |
| 46 | Add bom Field | Low | 5 min |
| 47 | Add raw_material Field | Low | 5 min |
| 48 | Add quantity Field | Low | 5 min |
| 49 | Add unit_of_measure Field | Low | 5 min |
| 50 | Add wastage_percent Field | Low | 5 min |

---

## Task 45: Define BOMItem Class

### Overview
Create BOMItem model representing a raw material component in the BOM recipe.

### Dependencies
- Task 44: Export BillOfMaterials

### Instructions

1. **Define BOMItem class in bom.py**
   - Inherit from TenantAwareModel, models.Model
   - Represents one material in recipe

2. **Add class docstring**
   - "Raw material component in BOM"
   - Example: "Flour 500g in Cake BOM"

3. **Add Meta class**
   - verbose_name: "BOM Item"
   - verbose_name_plural: "BOM Items"
   - db_table: "products_bom_item"

4. **Plan structure**
   - Links to BOM (parent)
   - Links to raw material Product
   - Has quantity and unit
   - Has wastage percentage

### Expected Outcome
BOMItem class defined and ready for fields.

### Verification Checklist
- [ ] Class defined
- [ ] Proper inheritance
- [ ] Meta configured
- [ ] Docstring present

---

## Task 46: Add bom Field

### Overview
Link BOMItem to parent BillOfMaterials.

### Dependencies
- Task 45: Define BOMItem Class

### Instructions

1. **Add bom ForeignKey**
   - Field: bom
   - Type: models.ForeignKey to BillOfMaterials
   - on_delete: models.CASCADE
   - related_name: "items"

2. **Add help text**
   - "The BOM this item belongs to"

3. **Add database index**
   - db_index=True

4. **CASCADE deletion behavior**
   - When BOM deleted, items deleted automatically

### Expected Outcome
BOMItem linked to parent BOM.

### Verification Checklist
- [ ] FK to BillOfMaterials
- [ ] CASCADE delete
- [ ] related_name set
- [ ] Indexed

---

## Task 47: Add raw_material Field

### Overview
Link to Product representing the raw material ingredient.

### Dependencies
- Task 46: Add bom Field

### Instructions

1. **Add raw_material ForeignKey**
   - Field: raw_material
   - Type: models.ForeignKey to Product
   - on_delete: models.PROTECT
   - related_name: "bom_usages"

2. **Add help text**
   - "The raw material product used"

3. **Add index**
   - db_index=True

4. **PROTECT behavior**
   - Prevents deleting materials in active BOMs

### Expected Outcome
BOMItem references raw material product.

### Verification Checklist
- [ ] FK to Product
- [ ] PROTECT delete
- [ ] related_name set
- [ ] Indexed

---

## Task 48: Add quantity Field

### Overview
Define amount of raw material needed.

### Dependencies
- Task 47: Add raw_material Field

### Instructions

1. **Add quantity DecimalField**
   - Field: quantity
   - Type: models.DecimalField
   - max_digits: 10
   - decimal_places: 3
   - MinValueValidator(0.001)

2. **Add help text**
   - "Quantity of raw material required"

3. **Support fractional quantities**
   - Example: 0.5 kg, 2.5 liters
   - 3 decimal places for precision

### Quantity Examples
```
Flour: 0.500 kg
Sugar: 0.200 kg
Eggs: 4.000 units
Milk: 0.250 liters
```

### Expected Outcome
quantity field stores material amounts.

### Verification Checklist
- [ ] DecimalField defined
- [ ] 3 decimal places
- [ ] Validator for positive
- [ ] Help text added

---

## Task 49: Add unit_of_measure Field

### Overview
Specify the unit for the quantity (kg, liters, units, etc.).

### Dependencies
- Task 48: Add quantity Field

### Instructions

1. **Add unit_of_measure CharField**
   - Field: unit_of_measure
   - Type: models.CharField
   - max_length: 20

2. **Add help text**
   - "Unit of measure (kg, liters, units, etc.)"

3. **Common units**
   - Weight: kg, g, mg
   - Volume: liters, ml
   - Count: units, pieces
   - Length: meters, cm

4. **Future enhancement**
   - Consider FK to UnitOfMeasure model
   - Support unit conversions

### Unit Examples
```
Flour: 0.500 kg
Sugar: 200 g
Eggs: 4 units
Milk: 250 ml
Labor: 2 hours
```

### Expected Outcome
unit_of_measure specifies quantity unit.

### Verification Checklist
- [ ] CharField defined
- [ ] max_length set
- [ ] Help text added

---

## Task 50: Add wastage_percent Field

### Overview
Track expected material wastage during production (spillage, trimming, etc.).

### Dependencies
- Task 49: Add unit_of_measure Field

### Instructions

1. **Add wastage_percent DecimalField**
   - Field: wastage_percent
   - Type: models.DecimalField
   - max_digits: 5
   - decimal_places: 2
   - default: 0.00
   - MinValueValidator(0.00)
   - MaxValueValidator(100.00)

2. **Add help text**
   - "Expected wastage percentage (0-100)"

3. **Use in cost calculation**
   - Actual usage: quantity * (1 + wastage_percent/100)
   - Example: 500g flour + 5% wastage = 525g needed

4. **Common wastage scenarios**
   - Food prep: 2-10%
   - Fabric cutting: 5-15%
   - Wood working: 10-20%

### Wastage Examples
```
Flour: 500g base + 5% wastage = 525g needed
Sugar: 200g base + 2% wastage = 204g needed
Eggs: 4 units + 0% wastage = 4 units (discrete items)
```

### Expected Outcome
wastage_percent field tracks production losses.

### Verification Checklist
- [ ] DecimalField defined
- [ ] Range 0-100
- [ ] Default 0.00
- [ ] Validators added
- [ ] Help text present

---

## Summary of Tasks 45-50

### What Was Accomplished
- Defined BOMItem model
- Linked to parent BOM
- Referenced raw material Product
- Added quantity with precision
- Specified unit of measure
- Tracked wastage percentage

### Current BOMItem Structure
```
BOMItem:
  - bom (FK to BillOfMaterials, CASCADE) - indexed
  - raw_material (FK to Product, PROTECT) - indexed
  - quantity (DecimalField, 3 decimal places)
  - unit_of_measure (CharField, max 20)
  - wastage_percent (DecimalField, 0-100, default 0)
  - created_at, updated_at (from TimestampedModel)
  - tenant (from TenantAwareModel)
```

### Next Steps
Next document adds critical flag, substitutes, sort order, and migration.

---

## Notes for Developers

### Wastage Calculation
```
Base Quantity: 500g
Wastage: 5%
Actual Needed: 500 * 1.05 = 525g
Extra Cost: material_cost * 0.05
```

### Unit Standardization
- Store in standard units (kg, liters)
- Convert for display if needed
- Consider UoM conversion table

### Cost Calculation
```
Material Cost = 
  (quantity * unit_price) * (1 + wastage_percent/100)
```

---
