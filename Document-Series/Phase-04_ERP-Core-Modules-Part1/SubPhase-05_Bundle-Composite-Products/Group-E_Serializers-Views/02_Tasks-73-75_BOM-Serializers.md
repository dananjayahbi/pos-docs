# Tasks 73-75: BOM Serializers

> **Phase:** 04 - ERP Core Modules Part 1  
> **SubPhase:** 05 - Bundle & Composite Products  
> **Group:** E - Serializers & Views  
> **Document:** 02 of 03  
> **Tasks Covered:** 73, 74, 75

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [01_Tasks-69-72_Bundle-Serializers.md](01_Tasks-69-72_Bundle-Serializers.md)
- **→ Next Document:** [03_Tasks-76-80_ViewSets-URLs.md](03_Tasks-76-80_ViewSets-URLs.md)

---

## Document Overview

This document creates serializers for Bill of Materials functionality, enabling API access to BOM and manufacturing data. Serializers include cost calculations and production information.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 73 | Create bom_serializers.py | Low | 3 min |
| 74 | Create BillOfMaterialsSerializer | Medium | 10 min |
| 75 | Create BOMItemSerializer | Medium | 10 min |

---

## Task 73: Create bom_serializers.py

### Overview
Create serializer file for BOM models.

### Dependencies
- Task 72: Create BundleDetailSerializer

### Instructions

1. **Create file**
   - Path: serializers/bom_serializers.py
   - BOM serializers

2. **Add imports**
   - DRF serializers
   - BillOfMaterials, BOMItem models
   - CostCalculationService, ManufacturingStockService

3. **Add docstring**

### Expected Outcome
File ready for BOM serializers.

### Verification Checklist
- [ ] File created
- [ ] Imports added

---

## Task 74: Create BillOfMaterialsSerializer

### Overview
Create serializer for BillOfMaterials model with cost data.

### Dependencies
- Task 73: Create bom_serializers.py

### Instructions

1. **Define BillOfMaterialsSerializer**
   - ModelSerializer for BillOfMaterials

2. **Configure Meta**
   - All relevant fields
   - Exclude internal fields

3. **Add calculated cost fields**
   - material_cost
   - total_cost
   - unit_cost
   - suggested_price

4. **Add production fields**
   - producible_quantity
   - materials_available

5. **Implement get_* methods**
   - Use CostCalculationService
   - Use ManufacturingStockService

### Serializer Structure
```python
class BillOfMaterialsSerializer(serializers.ModelSerializer):
    material_cost = serializers.SerializerMethodField()
    total_cost = serializers.SerializerMethodField()
    unit_cost = serializers.SerializerMethodField()
    suggested_price = serializers.SerializerMethodField()
    producible_quantity = serializers.SerializerMethodField()
    
    class Meta:
        model = BillOfMaterials
        fields = [
            'id', 'product', 'version', 'is_active',
            'notes', 'yield_quantity',
            'material_cost', 'total_cost', 'unit_cost',
            'suggested_price', 'producible_quantity',
            'created_at', 'updated_at'
        ]
```

### Expected Outcome
BOM serializer with cost calculations.

### Verification Checklist
- [ ] Serializer defined
- [ ] Cost fields added
- [ ] Service methods implemented

---

## Task 75: Create BOMItemSerializer

### Overview
Create serializer for BOMItem model.

### Dependencies
- Task 74: Create BillOfMaterialsSerializer

### Instructions

1. **Define BOMItemSerializer**
   - ModelSerializer for BOMItem

2. **Configure fields**
   - All BOMItem fields
   - Nested raw_material info
   - Substitute info if present

3. **Add calculated fields**
   - effective_quantity (with wastage)
   - item_cost
   - material_available

4. **Nested material details**
   - Raw material name, price
   - Stock quantity
   - Substitute name if exists

### Serializer Structure
```python
class BOMItemSerializer(serializers.ModelSerializer):
    raw_material_name = serializers.CharField(
        source='raw_material.name',
        read_only=True
    )
    unit_price = serializers.DecimalField(
        source='raw_material.cost_price',
        read_only=True,
        max_digits=10,
        decimal_places=2
    )
    effective_quantity = serializers.SerializerMethodField()
    item_cost = serializers.SerializerMethodField()
    
    class Meta:
        model = BOMItem
        fields = [
            'id', 'bom', 'raw_material', 'raw_material_name',
            'quantity', 'unit_of_measure', 'wastage_percent',
            'effective_quantity', 'unit_price', 'item_cost',
            'is_critical', 'substitute', 'sort_order'
        ]
```

### Expected Outcome
BOMItem serializer with material details.

### Verification Checklist
- [ ] Serializer defined
- [ ] Nested fields added
- [ ] Calculated fields implemented

---

## Summary of Tasks 73-75

### What Was Accomplished
- Created BOM serializers file
- Implemented BillOfMaterialsSerializer with costs
- Created BOMItemSerializer with material details

### API Response Example
```json
{
  "id": 1,
  "product": {
    "id": 10,
    "name": "Custom Birthday Cake"
  },
  "version": "2.0",
  "is_active": true,
  "yield_quantity": 1,
  "material_cost": "439.10",
  "total_cost": "1026.90",
  "unit_cost": "1026.90",
  "suggested_price": "1437.66",
  "producible_quantity": 4,
  "items": [
    {
      "raw_material_name": "Flour",
      "quantity": "0.500",
      "unit_of_measure": "kg",
      "wastage_percent": "5.00",
      "effective_quantity": "0.525",
      "unit_price": "300.00",
      "item_cost": "157.50",
      "is_critical": false
    }
  ]
}
```

### Next Steps
Next document creates ViewSets and URL routing.

---
