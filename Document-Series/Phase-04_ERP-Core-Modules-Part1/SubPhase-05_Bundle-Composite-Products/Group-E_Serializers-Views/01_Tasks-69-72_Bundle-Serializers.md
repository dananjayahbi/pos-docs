# Tasks 69-72: Bundle Serializers

> **Phase:** 04 - ERP Core Modules Part 1  
> **SubPhase:** 05 - Bundle & Composite Products  
> **Group:** E - Serializers & Views  
> **Document:** 01 of 03  
> **Tasks Covered:** 69, 70, 71, 72

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **→ Next Document:** [02_Tasks-73-75_BOM-Serializers.md](02_Tasks-73-75_BOM-Serializers.md)

---

## Document Overview

This document creates DRF serializers for bundle functionality, enabling API endpoints to expose bundle data in JSON format. Serializers handle validation, transformation, and nested relationships for ProductBundle and BundleItem models.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 69 | Create bundle_serializers.py | Low | 3 min |
| 70 | Create ProductBundleSerializer | Medium | 10 min |
| 71 | Create BundleItemSerializer | Medium | 10 min |
| 72 | Create BundleDetailSerializer | Medium | 10 min |

---

## Task 69: Create bundle_serializers.py

### Overview
Create serializer file for bundle models.

### Dependencies
- Group D: Manufacturing Cost Calculation

### Instructions

1. **Create file**
   - Path: serializers/bundle_serializers.py
   - Will contain bundle serializers

2. **Add imports**
   - Django REST Framework serializers
   - ProductBundle, BundleItem models
   - Product, ProductVariant models
   - BundleStockService, BundlePricingService

3. **Add file docstring**
   - Serializers for bundle products

### Expected Outcome
File structure ready for serializers.

### Verification Checklist
- [ ] File created
- [ ] Imports added
- [ ] Docstring present

---

## Task 70: Create ProductBundleSerializer

### Overview
Create serializer for ProductBundle model with basic fields.

### Dependencies
- Task 69: Create bundle_serializers.py

### Instructions

1. **Define ProductBundleSerializer class**
   - Inherit from serializers.ModelSerializer
   - For ProductBundle model

2. **Configure Meta class**
   - model = ProductBundle
   - fields = all relevant fields
   - Exclude tenant-specific fields

3. **Add read-only fields**
   - id, created_at, updated_at
   - Read-only by default

4. **Add calculated fields**
   - calculated_price (using pricing service)
   - available_stock (using stock service)
   - savings (using pricing service)

5. **Add field customization**
   - product: show product name/id
   - bundle_type: choice field
   - discount_type: choice field

### Serializer Structure
```python
class ProductBundleSerializer(serializers.ModelSerializer):
    calculated_price = serializers.SerializerMethodField()
    available_stock = serializers.SerializerMethodField()
    savings = serializers.SerializerMethodField()
    
    class Meta:
        model = ProductBundle
        fields = [
            'id', 'product', 'bundle_type',
            'fixed_price', 'discount_type', 'discount_value',
            'is_active', 'calculated_price',
            'available_stock', 'savings',
            'created_at', 'updated_at'
        ]
```

### Expected Outcome
Basic bundle serializer for list/create operations.

### Verification Checklist
- [ ] Serializer defined
- [ ] Meta configured
- [ ] Calculated fields added
- [ ] Field customizations done

---

## Task 71: Create BundleItemSerializer

### Overview
Create serializer for BundleItem model.

### Dependencies
- Task 70: Create ProductBundleSerializer

### Instructions

1. **Define BundleItemSerializer class**
   - ModelSerializer for BundleItem

2. **Configure Meta class**
   - model = BundleItem
   - fields = all item fields

3. **Nested product representation**
   - Show product name, sku, price
   - Show variant info if present

4. **Read-only vs writable**
   - Read-only: id, timestamps
   - Writable: bundle, product, variant, quantity

5. **Add validation**
   - Validate variant belongs to product
   - Validate quantity > 0
   - Validate unique constraint

### Serializer Fields
```python
class BundleItemSerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(
        source='product.name',
        read_only=True
    )
    variant_name = serializers.CharField(
        source='variant.name',
        read_only=True,
        allow_null=True
    )
    
    class Meta:
        model = BundleItem
        fields = [
            'id', 'bundle', 'product', 'product_name',
            'variant', 'variant_name', 'quantity',
            'is_optional', 'sort_order'
        ]
```

### Expected Outcome
Bundle item serializer for nested use.

### Verification Checklist
- [ ] Serializer defined
- [ ] Nested fields added
- [ ] Validation implemented
- [ ] Read-only fields configured

---

## Task 72: Create BundleDetailSerializer

### Overview
Create detailed serializer with nested items for retrieve operations.

### Dependencies
- Task 71: Create BundleItemSerializer

### Instructions

1. **Define BundleDetailSerializer class**
   - Extend ProductBundleSerializer
   - Add nested items

2. **Add items field**
   - Use BundleItemSerializer(many=True)
   - Nested representation of items
   - Read-only for detail view

3. **Add full product details**
   - Include product images
   - Include product descriptions
   - Useful for storefront display

4. **Support nested writes (optional)**
   - Allow creating bundle with items in one request
   - Implement create() method
   - Handle transaction for atomicity

5. **Add extra calculated fields**
   - component_count
   - total_savings
   - limiting_item

### Detail Serializer Structure
```python
class BundleDetailSerializer(ProductBundleSerializer):
    items = BundleItemSerializer(many=True, read_only=True)
    product_details = ProductSerializer(
        source='product',
        read_only=True
    )
    component_count = serializers.SerializerMethodField()
    limiting_item = serializers.SerializerMethodField()
    
    class Meta(ProductBundleSerializer.Meta):
        fields = ProductBundleSerializer.Meta.fields + [
            'items', 'product_details',
            'component_count', 'limiting_item'
        ]
```

### Expected Outcome
Comprehensive serializer for bundle details.

### Verification Checklist
- [ ] Extends base serializer
- [ ] Nested items included
- [ ] Extra fields added
- [ ] Nested writes supported (optional)

---

## Summary of Tasks 69-72

### What Was Accomplished
- Created bundle serializers file
- Implemented ProductBundleSerializer
- Created BundleItemSerializer
- Developed BundleDetailSerializer with nesting

### Serializer Hierarchy
```
ProductBundleSerializer (base)
  ├── Basic fields
  ├── Calculated price
  ├── Available stock
  └── Savings

BundleItemSerializer
  ├── Item fields
  ├── Product/variant references
  └── Quantity and options

BundleDetailSerializer (extended)
  ├── All base fields
  ├── Nested items
  ├── Full product details
  └── Additional calculations
```

### API Response Example
```json
{
  "id": 1,
  "product": {
    "id": 5,
    "name": "Holiday Gift Set"
  },
  "bundle_type": "dynamic",
  "discount_type": "percentage",
  "discount_value": "10.00",
  "calculated_price": "2970.00",
  "available_stock": 25,
  "savings": "330.00",
  "items": [
    {
      "product_name": "Tea Box",
      "quantity": 1,
      "is_optional": false
    },
    {
      "product_name": "Cookies",
      "variant_name": "Chocolate Chip",
      "quantity": 2,
      "is_optional": false
    }
  ]
}
```

### Next Steps
Next document creates BOM serializers.

---

## Notes for Developers

### Serializer Best Practices
- Use SerializerMethodField for calculations
- Avoid N+1 queries with select_related
- Validate business rules in serializer
- Keep serializers focused and composable

### Performance Optimization
- Prefetch items in viewset queryset
- Cache calculated values when appropriate
- Use read-only fields for derived data
- Minimize nested serializer depth

### Nested Writes
- Implement carefully with transactions
- Validate relationships thoroughly
- Consider using separate endpoints
- Document clearly in API docs

---
