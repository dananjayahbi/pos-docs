# Tasks 35-38: ProductOptionConfig and Export

> **Phase:** 04 - ERP Core Modules Part 1  
> **SubPhase:** 04 - Product Variants  
> **Group:** B - ProductVariant Model  
> **Document:** 03 of 03  
> **Tasks Covered:** 35, 36, 37, 38

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [02_Tasks-27-34_Override-Fields-Properties.md](02_Tasks-27-34_Override-Fields-Properties.md)
- **→ Next Group:** [../Group-C_Variant-Generation-Logic/](../Group-C_Variant-Generation-Logic/)

---

## Document Overview

This document covers creating the ProductOptionConfig model, which links products to their applicable option types, and exporting all models.

### Tasks in This Document
| Task # | Task Name | Complexity |
|--------|-----------|------------|
| 35 | Create ProductOptionConfig | Medium |
| 36 | Add product Field to Config | Low |
| 37 | Add option_type Field to Config | Low |
| 38 | Export ProductVariant | Low |

---

## Business Context

### Why ProductOptionConfig?

Not all option types apply to all products:
- T-Shirts use: Size, Color
- Laptops use: RAM, Storage, Color
- Rice uses: Type, Weight

ProductOptionConfig defines which option types are applicable for each product.

**Example Configuration:**
```
Product: Classic T-Shirt
Option Types Configured:
  - Size (with values: XS, S, M, L, XL)
  - Color (with values: Red, Blue, Green)

Product: Laptop
Option Types Configured:
  - RAM (with values: 8GB, 16GB, 32GB)
  - Storage (with values: 256GB, 512GB, 1TB)
```

---

## Task 35: Create ProductOptionConfig

### Overview
Create ProductOptionConfig model to link products with their applicable option types.

### Dependencies
- Product model exists
- VariantOptionType model exists (Group A)

### Instructions

1. **Define ProductOptionConfig class**
   - Location: Same file as ProductVariant (product_variant.py)
   - Inherit from TenantAwareModel
   - Class name: `ProductOptionConfig`

2. **Add class docstring**
   - Purpose: "Links product to applicable option types"
   - Example: T-Shirt can have Size and Color options

3. **Add display_order field**
   - PositiveIntegerField
   - Default: 0
   - Controls order of option types in UI

4. **Add to __all__ export list**

### Model Purpose

ProductOptionConfig serves to:
- Define which option types apply to a product
- Control order of option selection UI
- Validate variant option combinations
- Guide variant generation process

### Configuration Examples

**T-Shirt Product Configuration:**

| Product | Option Type | display_order | UI Position |
|---------|-------------|---------------|-------------|
| Classic T-Shirt | Size | 0 | First selector |
| Classic T-Shirt | Color | 10 | Second selector |

**Laptop Product Configuration:**

| Product | Option Type | display_order | UI Position |
|---------|-------------|---------------|-------------|
| Dell XPS 15 | RAM | 0 | First selector |
| Dell XPS 15 | Storage | 10 | Second selector |
| Dell XPS 15 | Color | 20 | Third selector |

**Rice Product Configuration (Sri Lanka):**

| Product | Option Type | display_order | UI Position |
|---------|-------------|---------------|-------------|
| Basmati Rice | Type | 0 | First selector |
| Basmati Rice | Weight | 10 | Second selector |
| Basmati Rice | Origin | 20 | Third selector |

### Model Relationships

```
Product (1) ─→ (Many) ProductOptionConfig ─→ (1) VariantOptionType
                                                    │
                                                    └─→ (Many) VariantOptionValue
```

### Verification Checklist
- [ ] ProductOptionConfig class defined
- [ ] Inherits from TenantAwareModel
- [ ] Class docstring added
- [ ] display_order field added
- [ ] Added to __all__ list

---

## Task 36: Add product Field to Config

### Overview
Add ForeignKey to link ProductOptionConfig to Product.

### Dependencies
- Task 35: ProductOptionConfig class defined

### Instructions

1. **Add product field as ForeignKey**
   - Field name: `product`
   - Links to: Product model
   - on_delete: CASCADE
   - related_name: 'option_configs'

2. **Add field help text**
   - "Product this option configuration applies to"

3. **Add verbose name**
   - verbose_name: "Product"

### Field Purpose

Links configuration to specific product:
- Defines which product uses which option types
- Enables querying product configurations
- Maintains data integrity

### Query Examples (Conceptual)

**Get configurations for product:**
```python
product = Product.objects.get(sku='TSHIRT-CLASSIC')
configs = product.option_configs.all()
# Returns: Size and Color configurations
```

**Get option types for product:**
```python
product = Product.objects.get(sku='LAPTOP-XPS15')
option_types = [c.option_type for c in product.option_configs.all()]
# Returns: [RAM, Storage, Color]
```

### Verification Checklist
- [ ] product ForeignKey added
- [ ] on_delete=CASCADE set
- [ ] related_name='option_configs' set
- [ ] Help text added
- [ ] Verbose name set

---

## Task 37: Add option_type Field to Config

### Overview
Add ForeignKey to link ProductOptionConfig to VariantOptionType.

### Dependencies
- Task 36: product field exists

### Instructions

1. **Add option_type field as ForeignKey**
   - Field name: `option_type`
   - Links to: VariantOptionType model
   - on_delete: CASCADE
   - related_name: 'product_configs'

2. **Add field help text**
   - "Option type applicable to this product"

3. **Add verbose name**
   - verbose_name: "Option Type"

4. **Add Meta class**
   - unique_together: ['tenant', 'product', 'option_type']
   - ordering: ['product', 'display_order']
   - verbose_name: "Product Option Configuration"

5. **Add __str__ method**
   - Return: "{product} - {option_type}"

6. **Add validation**
   - Ensure product has product_type='VARIABLE'

### Complete Model Structure

```python
ProductOptionConfig:
  - tenant (inherited from TenantAwareModel)
  - product (ForeignKey to Product)
  - option_type (ForeignKey to VariantOptionType)
  - display_order (PositiveIntegerField)
  - created_at, updated_at (inherited)
  
  Meta:
    unique_together: ['tenant', 'product', 'option_type']
    ordering: ['product', 'display_order']
  
  __str__: "{product} - {option_type}"
```

### Configuration Process

**Setting Up Product Variants:**
```
Step 1: Create Product (product_type=VARIABLE)
Step 2: Create/Select VariantOptionTypes (Size, Color)
Step 3: Create ProductOptionConfig entries:
  - Config 1: Product → Size (display_order: 0)
  - Config 2: Product → Color (display_order: 10)
Step 4: Create VariantOptionValues:
  - Size: S, M, L, XL
  - Color: Red, Blue, Green
Step 5: Generate Variants (all combinations)
```

### UI Selection Flow

**Frontend Product Page:**
```
Product: Classic T-Shirt

[Select Size]  ← ProductOptionConfig (display_order: 0)
  ○ S
  ○ M
  ● L
  ○ XL

[Select Color] ← ProductOptionConfig (display_order: 10)
  ○ Red
  ● Blue
  ○ Green

Selected: L / Blue
```

### Validation Rules

**Constraints:**
- Product must be VARIABLE type
- Cannot add same option_type twice to same product
- Option type must exist and be active
- Display order controls UI presentation

**Example Violations:**
```
✗ Add Size twice to same product
✗ Add option to SIMPLE product
✓ Add Size, Color to VARIABLE product
✓ Add RAM, Storage, Color to VARIABLE product
```

### Verification Checklist
- [ ] option_type ForeignKey added
- [ ] on_delete=CASCADE set
- [ ] related_name='product_configs' set
- [ ] Help text added
- [ ] Meta class with unique_together
- [ ] Ordering configured
- [ ] __str__ method added
- [ ] Validation rules understood

---

## Task 38: Export ProductVariant

### Overview
Export all models from the module and update the models package __init__.py.

### Dependencies
- Tasks 19-37: All models complete

### Instructions

1. **Review all models in product_variant.py**
   - ProductVariant: Complete with all fields and methods
   - ProductVariantOption: Through model complete
   - ProductOptionConfig: Configuration model complete

2. **Update __all__ in product_variant.py**
   - Add all model names to module exports

3. **Update models/__init__.py**
   - Import all three models from product_variant
   - Add to package __all__ list

4. **Create migration**
   - Run makemigrations command
   - Review generated migration
   - Verify all fields, relationships, constraints

5. **Test imports**
   - Verify models can be imported
   - Test from products.models import ProductVariant

### Models to Export

**From product_variant.py:**
```python
__all__ = [
    'ProductVariant',
    'ProductVariantOption',
    'ProductOptionConfig',
]
```

**In models/__init__.py:**
```python
from .product_variant import (
    ProductVariant,
    ProductVariantOption,
    ProductOptionConfig,
)

__all__ = [
    # ... existing models
    'ProductVariant',
    'ProductVariantOption',
    'ProductOptionConfig',
]
```

### Migration Checklist

**Verify migration includes:**
- [ ] ProductVariant model creation
- [ ] All fields (product, sku, barcode, name, etc.)
- [ ] Override fields (weight, dimensions)
- [ ] ProductVariantOption through model
- [ ] ProductOptionConfig model
- [ ] All ForeignKey relationships
- [ ] unique_together constraints
- [ ] Indexes on common query fields

### Model Summary

**ProductVariant:**
- Links to Product (parent)
- Links to VariantOptionValue (many-to-many)
- Has unique SKU per tenant
- Can override weight/dimensions
- Controls active status
- Maintains display order

**ProductVariantOption (Through Model):**
- Links ProductVariant to VariantOptionValue
- Maintains option display order
- Ensures option uniqueness per variant

**ProductOptionConfig:**
- Links Product to VariantOptionType
- Defines applicable options for product
- Controls option selection order
- Unique per product-option_type combination

### Testing Import

**Test in Django shell:**
```python
from products.models import ProductVariant, ProductOptionConfig
print(ProductVariant._meta.fields)
print(ProductOptionConfig._meta.fields)
```

### Verification Checklist
- [ ] All models exported in product_variant.py
- [ ] Models imported in __init__.py
- [ ] __all__ lists updated
- [ ] Migration generated successfully
- [ ] Migration reviewed and correct
- [ ] No migration errors
- [ ] Models importable from products.models
- [ ] Admin can see models (if registered)

---

## Summary

### Tasks Completed in This Document
| Task # | Task Name | Key Deliverable |
|--------|-----------|-----------------|
| 35 | Create ProductOptionConfig | Model class and structure |
| 36 | Add product Field to Config | product ForeignKey |
| 37 | Add option_type Field to Config | option_type ForeignKey, Meta |
| 38 | Export ProductVariant | All models exported |

### Group B Complete

All tasks in Group B (ProductVariant Model) are now complete:
- ✅ ProductVariant model with basic fields
- ✅ Override fields (weight, dimensions)
- ✅ ProductVariantOption through model
- ✅ ProductOptionConfig model
- ✅ All models exported
- ✅ Migration ready

### Models Created

**ProductVariant:**
- Represents specific product configurations
- 18 fields including overrides
- Multiple methods and properties
- Full tenant isolation

**ProductVariantOption:**
- M2M through model
- Links variants to option values
- Maintains display order

**ProductOptionConfig:**
- Links products to option types
- Defines applicable options
- Controls UI presentation order

### Database Schema

**Tables Created:**
- products_productvariant
- products_productvariantoption
- products_productoptionconfig

**Relationships:**
- Product → ProductVariant (1:Many)
- ProductVariant ↔ VariantOptionValue (M:M via ProductVariantOption)
- Product → ProductOptionConfig → VariantOptionType (1:Many:1)

### Next Steps
1. Proceed to [Group-C_Variant-Generation-Logic](../Group-C_Variant-Generation-Logic/) to create variant generation service

---

## Notes for AI Agents

1. **ProductOptionConfig Purpose:** Defines which option types apply to each product
2. **Display Order:** Controls UI order - lower numbers appear first
3. **Validation:** Only VARIABLE products can have option configs
4. **Uniqueness:** One config per product-option_type combination
5. **Cascading:** Deleting product removes all configs and variants
6. **Migration:** Large migration with multiple models and relationships
7. **Testing:** Test complete workflow: Product → Config → Options → Variants
8. **Multi-Tenant:** All queries auto-filter by tenant
