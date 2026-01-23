# Tasks 10-14: BundleItem Base

> **Phase:** 04 - ERP Core Modules Part 1  
> **SubPhase:** 05 - Bundle & Composite Products  
> **Group:** A - Bundle Product Models  
> **Document:** 03 of 04  
> **Tasks Covered:** 10, 11, 12, 13, 14

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [02_Tasks-06-09_Bundle-Discount-Fields.md](02_Tasks-06-09_Bundle-Discount-Fields.md)
- **→ Next Document:** [04_Tasks-15-20_BundleItem-Fields-Migration.md](04_Tasks-15-20_BundleItem-Fields-Migration.md)

---

## Document Overview

This document creates the BundleItem model, which represents the many-to-many relationship between bundles and products. Each BundleItem specifies which product (or product variant) is included in a bundle, along with the quantity required. This model enables flexible bundle composition where merchants can include any combination of products, including specific variants.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 10 | Define BundleItem Class | Medium | 10 min |
| 11 | Add bundle Field | Low | 5 min |
| 12 | Add product Field | Low | 5 min |
| 13 | Add variant Field | Low | 5 min |
| 14 | Add quantity Field | Low | 5 min |

---

## Task 10: Define BundleItem Class

### Overview
Create the BundleItem model that acts as a through model for the many-to-many relationship between ProductBundle and Product. This model tracks which products are in each bundle and in what quantities.

### Dependencies
- Task 09: Export ProductBundle

### Instructions

1. **Define the BundleItem class**
   - Create class named BundleItem in bundle.py
   - Inherit from TenantAwareModel (for multi-tenancy)
   - Inherit from models.Model
   - Place after ProductBundle class in the file

2. **Add class-level docstring**
   - Describe: "Represents a product included in a bundle"
   - Explain: "Through model for ProductBundle to Product relationship"
   - Note: "Each item specifies product/variant and quantity"
   - Example: "Gift Set contains: Tea Box (qty: 1), Cookies (qty: 2)"

3. **Plan model relationships**
   - Will have FK to ProductBundle
   - Will have FK to Product (the product included)
   - Optional FK to ProductVariant (specific variant)
   - Quantity field for how many units

4. **Add Meta class placeholder**
   - Define inner Meta class
   - Set verbose_name to "Bundle Item"
   - Set verbose_name_plural to "Bundle Items"
   - Set db_table to "products_bundle_item"
   - Ordering will be by sort_order (added later)

5. **Consider use cases**
   - Standard bundles: include base products
   - Variant-specific bundles: include specific variants
   - Example: "Tea Gift Set" might include "Premium Tea - Green" variant
   - Quantity allows for multiple units of same product

### Model Concept
```
BundleItem:
  ├── Links to ProductBundle (which bundle)
  ├── Links to Product (which product is included)
  ├── Optional: Links to ProductVariant (specific variant)
  ├── Quantity (how many units)
  └── Optional flag (customer can opt-out)
```

### Expected Outcome
A BundleItem class is defined with proper inheritance and Meta configuration, ready to receive field definitions.

### Verification Checklist
- [ ] BundleItem class is defined after ProductBundle
- [ ] Inherits from TenantAwareModel and models.Model
- [ ] Class docstring explains purpose
- [ ] Meta class is defined with proper settings
- [ ] verbose_name and db_table are configured

---

## Task 11: Add bundle Field

### Overview
Create a foreign key relationship linking each BundleItem to its parent ProductBundle. This establishes which bundle the item belongs to.

### Dependencies
- Task 10: Define BundleItem Class

### Instructions

1. **Add bundle ForeignKey field**
   - Field name: bundle
   - Type: models.ForeignKey
   - Related model: ProductBundle
   - Use on_delete=models.CASCADE (delete items when bundle deleted)

2. **Configure reverse relationship**
   - Set related_name="items"
   - Allows accessing items from bundle: bundle.items.all()
   - Common query pattern for retrieving bundle contents

3. **Add help text**
   - Explain: "The bundle this item belongs to"
   - Note cascade behavior: "Items are deleted when bundle is deleted"

4. **Add field docstring comment**
   - Document the parent relationship
   - Each BundleItem belongs to exactly one ProductBundle
   - One ProductBundle can have many BundleItems
   - CASCADE deletion ensures orphaned items are removed

5. **Add database index**
   - Set db_index=True
   - Items will be queried by bundle frequently
   - Critical for bundle detail page performance

6. **Consider query patterns**
   - Common query: bundle.items.select_related('product', 'variant')
   - Manager methods will optimize these queries
   - Prefetching reduces N+1 query problems

### Relationship Diagram
```
ProductBundle (id=1, name="Holiday Gift Set")
   ↓ (one-to-many)
   ├── BundleItem (bundle_id=1, product_id=5, qty=1)
   ├── BundleItem (bundle_id=1, product_id=8, qty=2)
   └── BundleItem (bundle_id=1, product_id=12, qty=1)
```

### Expected Outcome
The BundleItem model now has a bundle field that establishes the parent-child relationship with ProductBundle.

### Verification Checklist
- [ ] bundle field is defined as ForeignKey to ProductBundle
- [ ] on_delete is set to models.CASCADE
- [ ] related_name is set to "items"
- [ ] help_text explains the relationship
- [ ] db_index is set to True
- [ ] Comment documentation is present

---

## Task 12: Add product Field

### Overview
Create a foreign key relationship linking each BundleItem to a Product. This specifies which product is included in the bundle. The product can be any product type (simple, variant, etc.).

### Dependencies
- Task 11: Add bundle Field

### Instructions

1. **Add product ForeignKey field**
   - Field name: product
   - Type: models.ForeignKey
   - Related model: Product
   - Use on_delete=models.PROTECT (prevent deletion of products in bundles)

2. **Configure reverse relationship**
   - Set related_name="bundle_items"
   - Allows checking which bundles contain a product
   - Useful for impact analysis when changing products

3. **Add help text**
   - Explain: "The product included in this bundle"
   - Note: "Can be overridden by variant field for specific variant"
   - Mention PROTECT: "Products in active bundles cannot be deleted"

4. **Add field docstring comment**
   - Document that this is the base product reference
   - If variant is specified, that overrides this for specificity
   - If variant is null, any variant of this product can be used
   - PROTECT prevents accidental deletion of bundled products

5. **Add database index**
   - Set db_index=True
   - Queries for "which bundles contain this product"
   - Impact analysis for price changes

6. **Consider validation rules**
   - Product should belong to same tenant as bundle
   - Product can be any type (not necessarily the bundle itself)
   - Circular references should be prevented (bundle containing itself)

### Product Reference Examples

**Without Variant Specification:**
```
bundle: "Tea Gift Set"
product: "Premium Tea" (base product)
variant: null
→ Any variant of Premium Tea can be included
```

**With Variant Specification:**
```
bundle: "Tea Gift Set"
product: "Premium Tea" (base product)
variant: "Premium Tea - Green" (specific variant)
→ Only Green variant is included
```

### Expected Outcome
The BundleItem model now has a product field that specifies which product is included in the bundle.

### Verification Checklist
- [ ] product field is defined as ForeignKey to Product
- [ ] on_delete is set to models.PROTECT
- [ ] related_name is set to "bundle_items"
- [ ] help_text explains the relationship
- [ ] db_index is set to True
- [ ] Comment documentation is present

---

## Task 13: Add variant Field

### Overview
Create an optional foreign key to ProductVariant that allows specifying a particular variant of the product to include in the bundle. This enables bundles with specific variant requirements (e.g., "Green Tea" specifically rather than any tea variant).

### Dependencies
- Task 12: Add product Field

### Instructions

1. **Add variant ForeignKey field**
   - Field name: variant
   - Type: models.ForeignKey
   - Related model: ProductVariant (from products.models)
   - Use on_delete=models.PROTECT
   - null: True (variant is optional)
   - blank: True (optional in forms)

2. **Configure reverse relationship**
   - Set related_name="bundle_items"
   - Allows checking which bundles require specific variant
   - Useful for inventory planning

3. **Add help text**
   - Explain: "Optional: Specific variant to include"
   - Note: "If specified, only this variant is used"
   - Note: "If null, any variant of the product is acceptable"

4. **Add field docstring comment**
   - Document the optional nature
   - When specified: bundle requires this exact variant
   - When null: bundle can use any variant of the product
   - Must be a variant of the specified product (validation needed)

5. **Add database index**
   - Set db_index=True
   - Queries for variant usage in bundles
   - Stock calculation for variant-specific bundles

6. **Consider validation rules**
   - If variant is specified, it must belong to the product
   - Validation: variant.product == product
   - This check will be in model clean() method

### Variant Usage Examples

**Generic Product (no variant):**
```
product: "Gift Bag"
variant: null
→ Any gift bag variant can be used
```

**Specific Variant Required:**
```
product: "Premium Tea"
variant: "Premium Tea - Green"
→ Only Green Tea variant can be used
```

**Size-Specific Bundle:**
```
product: "T-Shirt"
variant: "T-Shirt - Large - Blue"
→ Only Large Blue T-Shirt is included
```

### Expected Outcome
The BundleItem model now has an optional variant field that allows specifying exact variants in bundles.

### Verification Checklist
- [ ] variant field is defined as ForeignKey to ProductVariant
- [ ] on_delete is set to models.PROTECT
- [ ] null and blank are set to True
- [ ] related_name is set to "bundle_items"
- [ ] help_text explains optional usage
- [ ] db_index is set to True
- [ ] Comment documents validation requirement

---

## Task 14: Add quantity Field

### Overview
Add a positive integer field to specify how many units of the product/variant are included in the bundle. This allows bundles to contain multiple units of the same item (e.g., "2 cookies" in a gift set).

### Dependencies
- Task 13: Add variant Field

### Instructions

1. **Add quantity PositiveIntegerField**
   - Field name: quantity
   - Type: models.PositiveIntegerField
   - default: 1 (at least one unit)

2. **Add help text**
   - Explain: "Number of units of this product in the bundle"
   - Note: "Must be a positive integer"
   - Example: "2 means two units are included"

3. **Add field docstring comment**
   - Document quantity usage in stock calculation
   - Bundle stock = MIN(component_stock / quantity)
   - Example: If 10 cookies in stock, quantity=2, max 5 bundles
   - Higher quantities reduce maximum bundle availability

4. **Add validators**
   - Import MinValueValidator from django.core.validators
   - Add MinValueValidator(1)
   - Ensures at least one unit is included

5. **Consider business logic**
   - Quantity affects stock calculation
   - Quantity affects bundle weight (if applicable)
   - Higher quantities may justify better discounts

6. **Support for fractional quantities**
   - Current implementation: integer only
   - For fractional quantities (0.5 kg), use DecimalField
   - Integer is sufficient for most products (discrete units)
   - Note: Future enhancement if fractional needed

### Quantity Examples

**Single Unit:**
```
product: "Wine Bottle"
quantity: 1
→ One bottle per bundle
```

**Multiple Units:**
```
product: "Cookies Pack"
quantity: 2
→ Two packs per bundle
```

**Stock Calculation:**
```
Product: "Tea Box"
Available Stock: 30 units
Bundle Quantity: 3 units per bundle
→ Maximum 10 bundles can be created
```

### Expected Outcome
The BundleItem model now has a quantity field that specifies how many units of each product are in the bundle.

### Verification Checklist
- [ ] quantity PositiveIntegerField is defined
- [ ] default is set to 1
- [ ] help_text explains usage
- [ ] MinValueValidator(1) is added
- [ ] Field documentation comment is present
- [ ] Stock calculation impact is documented

---

## Summary of Tasks 10-14

### What Was Accomplished
- Created BundleItem model with proper inheritance
- Linked BundleItem to ProductBundle via bundle field
- Linked BundleItem to Product via product field
- Added optional variant field for variant-specific bundles
- Implemented quantity field for multiple units

### Current BundleItem Structure
```
BundleItem:
  - Inherits: TenantAwareModel, models.Model
  - bundle (FK to ProductBundle, CASCADE) - indexed
  - product (FK to Product, PROTECT) - indexed
  - variant (FK to ProductVariant, PROTECT, nullable) - indexed
  - quantity (PositiveIntegerField, default 1, min 1)
```

### Relationship Overview
```
ProductBundle
   ├─→ BundleItem #1
   │     ├─→ Product: "Tea Box"
   │     ├─→ Variant: null (any variant)
   │     └─→ Quantity: 1
   ├─→ BundleItem #2
   │     ├─→ Product: "Cookies"
   │     ├─→ Variant: "Chocolate Chip"
   │     └─→ Quantity: 2
   └─→ BundleItem #3
         ├─→ Product: "Gift Bag"
         ├─→ Variant: null
         └─→ Quantity: 1
```

### Next Steps
The next document will add optional flag, sort order, string representation, Meta constraints, and create the database migration.

---

## Notes for Developers

### Stock Calculation Impact
- Bundle availability = MIN(product_stock / item_quantity) for all items
- Example:
  - Item 1: 30 units in stock, quantity=3 → max 10 bundles
  - Item 2: 50 units in stock, quantity=2 → max 25 bundles
  - Item 3: 15 units in stock, quantity=1 → max 15 bundles
  - **Bundle availability: MIN(10, 25, 15) = 10 bundles**

### Variant Validation
- Must implement model clean() method
- Check: if variant is set, variant.product must equal product
- Raise ValidationError if mismatch
- This prevents incorrect bundle configurations

### Tenant Isolation
- BundleItem inherits TenantAwareModel
- All related objects (bundle, product, variant) are tenant-scoped
- Cross-tenant references are automatically prevented
- Query filters automatically include tenant

### Query Optimization
- Use select_related('bundle', 'product', 'variant')
- Prefetch related data to avoid N+1 queries
- Manager methods should include prefetch_related
- Critical for bundle detail pages

### Business Rules
- Quantity must be positive (minimum 1)
- Product cannot be the bundle itself (prevent circular reference)
- Variant must belong to the specified product
- All items must be from the same tenant as the bundle

### Use Cases
- **Simple Bundle:** Products without variant specification
- **Variant-Specific Bundle:** Specific colors, sizes required
- **Multi-Quantity Bundle:** Multiple units of same product
- **Mixed Bundle:** Combination of products and variants

---
