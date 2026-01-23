# Tasks 15-20: BundleItem Fields & Migration

> **Phase:** 04 - ERP Core Modules Part 1  
> **SubPhase:** 05 - Bundle & Composite Products  
> **Group:** A - Bundle Product Models  
> **Document:** 04 of 04  
> **Tasks Covered:** 15, 16, 17, 18, 19, 20

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [03_Tasks-10-14_BundleItem-Base.md](03_Tasks-10-14_BundleItem-Base.md)
- **→ Next Group:** [../Group-B_Bundle-Stock-Pricing-Logic/](../Group-B_Bundle-Stock-Pricing-Logic/)

---

## Document Overview

This document completes the BundleItem model by adding optional item functionality, display ordering, string representations, and database constraints. It also creates the database migration to apply both ProductBundle and BundleItem models to the schema. These final tasks ensure data integrity through unique constraints and proper model exports.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 15 | Add is_optional Field | Low | 5 min |
| 16 | Add sort_order Field | Low | 3 min |
| 17 | Add __str__ Method | Low | 3 min |
| 18 | Add Meta Class | Low | 5 min |
| 19 | Export BundleItem | Low | 3 min |
| 20 | Create Bundle Migration | Low | 5 min |

---

## Task 15: Add is_optional Field

### Overview
Add a boolean flag to mark bundle items as optional, allowing customers to customize bundles by including or excluding optional components. This enables flexible bundle configurations where some items are required and others are optional add-ons.

### Dependencies
- Task 14: Add quantity Field

### Instructions

1. **Add is_optional BooleanField**
   - Field name: is_optional
   - Type: models.BooleanField
   - default: False (items are required by default)

2. **Add help text**
   - Explain: "Whether this item is optional in the bundle"
   - Note: "Optional items can be excluded by customer"
   - Mention: "Required items are always included"

3. **Add field docstring comment**
   - Document optional vs required items
   - Required items: always included, affect stock calculation
   - Optional items: customer choice, may affect price
   - Use cases: customizable bundles, add-ons, upgrades

4. **Add database index**
   - Set db_index=True
   - Useful for filtering required vs optional items
   - Helps in stock calculation queries

5. **Consider business logic implications**
   - Stock calculation: only required items determine availability
   - Pricing: optional items may be added to base price
   - Display: show optional items separately in UI
   - Validation: ensure at least one required item exists

6. **Support for optional item scenarios**
   - Gift wrapping option
   - Greeting card add-on
   - Premium packaging upgrade
   - Extra portions (e.g., extra sauce packets)

### Optional Item Examples

**Required Items:**
```
Bundle: "Tea Gift Set"
Items:
  - Tea Box (is_optional=False) ← always included
  - Cookies (is_optional=False) ← always included
  - Gift Bag (is_optional=False) ← always included
```

**With Optional Items:**
```
Bundle: "Customizable Tea Set"
Items:
  - Tea Box (is_optional=False) ← required
  - Cookies (is_optional=True) ← customer choice
  - Gift Card (is_optional=True) ← customer choice
  - Premium Wrapping (is_optional=True) ← customer choice
```

### Expected Outcome
The BundleItem model now has an is_optional field that allows marking items as optional or required.

### Verification Checklist
- [ ] is_optional BooleanField is defined
- [ ] default is set to False
- [ ] help_text explains usage
- [ ] db_index is set to True
- [ ] Field documentation comment is present
- [ ] Use cases are documented

---

## Task 16: Add sort_order Field

### Overview
Add an integer field to control the display order of bundle items. This ensures items are presented consistently in the UI (e.g., main items first, add-ons last) and allows merchants to highlight important components.

### Dependencies
- Task 15: Add is_optional Field

### Instructions

1. **Add sort_order PositiveIntegerField**
   - Field name: sort_order
   - Type: models.PositiveIntegerField
   - default: 0

2. **Add help text**
   - Explain: "Order in which items are displayed"
   - Note: "Lower numbers appear first"
   - Mention: "Items with same order are sorted alphabetically"

3. **Add field docstring comment**
   - Document display ordering purpose
   - Used in bundle detail views
   - Used in cart/checkout displays
   - Merchant can prioritize important items

4. **Add database index**
   - Set db_index=True
   - Used in ORDER BY clauses
   - Improves query performance for ordered lists

5. **Update Meta class ordering**
   - Will be added to Meta.ordering in next task
   - Ensure consistent ordering across application

6. **Consider ordering strategies**
   - Group by type: main items (0-9), add-ons (10-19), optional (20-29)
   - By importance: featured items first
   - By price: highest value first
   - By category: beverages, snacks, accessories

### Sort Order Examples

**Ordered Display:**
```
Bundle: "Premium Tea Set"
Items:
  - Tea Box (sort_order=0) ← shown first
  - Cookies (sort_order=5)
  - Gift Bag (sort_order=10)
  - Gift Card (sort_order=15, optional) ← shown last
```

**Grouped by Type:**
```
Bundle: "Meal Combo"
Main Items:
  - Main Dish (sort_order=0)
  - Side Dish (sort_order=5)
Beverages:
  - Drink (sort_order=10)
Add-ons:
  - Dessert (sort_order=20, optional)
  - Extra Sauce (sort_order=25, optional)
```

### Expected Outcome
The BundleItem model now has a sort_order field that controls display ordering.

### Verification Checklist
- [ ] sort_order PositiveIntegerField is defined
- [ ] default is set to 0
- [ ] help_text explains usage
- [ ] db_index is set to True
- [ ] Field documentation comment is present

---

## Task 17: Add __str__ Method

### Overview
Implement string representation methods for the BundleItem model to provide human-readable output in admin interfaces, logs, and debugging.

### Dependencies
- Task 16: Add sort_order Field

### Instructions

1. **Define __str__ method**
   - Method name: __str__
   - Return format: f"{self.bundle.product.name} - {self.product.name} (x{self.quantity})"
   - Shows bundle name, product name, and quantity
   - Handles variant if present

2. **Handle variant in string representation**
   - If variant exists: include variant name
   - Format with variant: f"{self.bundle.product.name} - {self.variant.name} (x{self.quantity})"
   - Format without variant: f"{self.bundle.product.name} - {self.product.name} (x{self.quantity})"

3. **Add __repr__ method for debugging**
   - Method name: __repr__
   - Return format: f"<BundleItem: {self.bundle.product.name} contains {self.product.name}>"
   - More technical representation for developers

4. **Handle optional flag in representation (optional)**
   - Consider adding "(optional)" suffix if is_optional=True
   - Format: f"{self.product.name} (x{self.quantity}) - Optional"
   - Helps identify optional items in logs

5. **Consider null safety**
   - Handle case where related objects might not be loaded
   - Use try-except or hasattr checks if needed
   - Prevent errors during model initialization

6. **Test representations**
   - Ensure readable output in Django admin
   - Check log file clarity
   - Verify debugging usefulness

### String Representation Examples

**Standard Item:**
```python
str(item) → "Holiday Gift Set - Premium Tea (x1)"
repr(item) → "<BundleItem: Holiday Gift Set contains Premium Tea>"
```

**With Variant:**
```python
str(item) → "Holiday Gift Set - Premium Tea - Green (x2)"
repr(item) → "<BundleItem: Holiday Gift Set contains Premium Tea - Green>"
```

**Optional Item:**
```python
str(item) → "Meal Combo - Extra Sauce (x1) - Optional"
```

### Expected Outcome
The BundleItem model now has __str__ and __repr__ methods that provide clear, readable representations.

### Verification Checklist
- [ ] __str__ method is defined
- [ ] Includes bundle name, product name, quantity
- [ ] Handles variant if present
- [ ] __repr__ method is defined for debugging
- [ ] Optional flag handling (if implemented)
- [ ] Null safety considerations addressed

---

## Task 18: Add Meta Class

### Overview
Configure the Meta class for BundleItem with proper ordering, constraints, and database settings. This ensures data integrity through unique constraints and consistent query results.

### Dependencies
- Task 17: Add __str__ Method

### Instructions

1. **Define or update Meta class**
   - Inner class: Meta
   - Located inside BundleItem class definition

2. **Set verbose names**
   - verbose_name: "Bundle Item"
   - verbose_name_plural: "Bundle Items"
   - Used in Django admin interface

3. **Set database table name**
   - db_table: "products_bundle_item"
   - Explicit table naming for clarity
   - Follows naming convention

4. **Set default ordering**
   - ordering: ['sort_order', 'product__name']
   - Primary sort by sort_order (ascending)
   - Secondary sort by product name alphabetically
   - Ensures consistent display order

5. **Add unique constraint**
   - Use constraints with UniqueConstraint
   - Fields: ['bundle', 'product', 'variant']
   - Name: 'unique_bundle_product_variant'
   - Prevents duplicate items in same bundle
   - Allows null variants (multiple items with same product, different variants)

6. **Add indexes configuration**
   - Use indexes for composite lookups
   - Index: ['bundle', 'is_optional'] for filtering
   - Index: ['product'] for reverse lookups
   - Improves query performance

### Meta Class Configuration
```python
class Meta:
    verbose_name = "Bundle Item"
    verbose_name_plural = "Bundle Items"
    db_table = "products_bundle_item"
    ordering = ['sort_order', 'product__name']
    constraints = [
        models.UniqueConstraint(
            fields=['bundle', 'product', 'variant'],
            name='unique_bundle_product_variant'
        )
    ]
    indexes = [
        models.Index(fields=['bundle', 'is_optional']),
        models.Index(fields=['product']),
    ]
```

### Constraint Examples

**Valid: Different Variants**
```
Bundle: "Size Options Set"
Item 1: T-Shirt / Variant: Small ✓
Item 2: T-Shirt / Variant: Large ✓
```

**Invalid: Duplicate**
```
Bundle: "Gift Set"
Item 1: Tea Box / Variant: Green
Item 2: Tea Box / Variant: Green ✗ (duplicate)
```

**Valid: Same Product, No Variant**
```
Bundle: "Multi-Pack"
Item 1: Generic Tea / Variant: null
Item 2: Generic Tea / Variant: null ✗ (would be duplicate)
```

### Expected Outcome
The BundleItem Meta class is properly configured with ordering, constraints, and indexes.

### Verification Checklist
- [ ] Meta class is defined inside BundleItem
- [ ] verbose_name and verbose_name_plural are set
- [ ] db_table is explicitly set
- [ ] ordering includes sort_order and product name
- [ ] UniqueConstraint is defined
- [ ] Indexes are configured for performance
- [ ] Constraint name follows convention

---

## Task 19: Export BundleItem

### Overview
Export the BundleItem model from the bundle.py module and update the models package __init__.py to make both bundle models accessible throughout the application.

### Dependencies
- Task 18: Add Meta Class

### Instructions

1. **Update __all__ list in bundle.py**
   - Add 'BundleItem' to __all__ list
   - Should now include both models
   - Format: __all__ = ['ProductBundle', 'BundleItem']

2. **Update models/__init__.py**
   - Add import: from .bundle import BundleItem
   - Or update existing: from .bundle import ProductBundle, BundleItem
   - Add 'BundleItem' to __all__ list in __init__.py

3. **Verify import paths**
   - Should import as: from products.models import BundleItem
   - Or as: from products.models.bundle import BundleItem
   - Both import paths should work correctly

4. **Add model admin registration preparation**
   - Models are now ready for admin registration
   - Will be registered in products/admin.py
   - Consider inline admin for BundleItem in ProductBundle admin

5. **Update model relationships exports**
   - Ensure ProductBundle can access items via bundle.items.all()
   - Ensure Product can access bundle_items via product.bundle_items.all()
   - Reverse relationships should work correctly

6. **Document import usage**
   - Add comments in __init__.py about bundle models
   - Helps developers understand model organization
   - Reference documentation for usage examples

### Import Structure
```python
# In bundle.py
__all__ = ['ProductBundle', 'BundleItem']

# In models/__init__.py
from .product import Product
from .bundle import ProductBundle, BundleItem

__all__ = ['Product', 'ProductBundle', 'BundleItem']
```

### Expected Outcome
Both bundle models are properly exported and can be imported cleanly throughout the application.

### Verification Checklist
- [ ] __all__ in bundle.py includes both models
- [ ] models/__init__.py imports both models
- [ ] __all__ in __init__.py includes both models
- [ ] Import paths are verified
- [ ] Reverse relationships work correctly
- [ ] Documentation comments added

---

## Task 20: Create Bundle Migration

### Overview
Generate and apply a Django migration to create the ProductBundle and BundleItem tables in the database with all fields, constraints, and indexes.

### Dependencies
- Task 19: Export BundleItem

### Instructions

1. **Generate migration file**
   - Use Django's makemigrations command
   - Command: python manage.py makemigrations products
   - Migration will detect both new models
   - File will be created in products/migrations/

2. **Review migration file**
   - Open the generated migration file
   - Verify ProductBundle model creation
   - Verify BundleItem model creation
   - Check all fields are included
   - Verify foreign key relationships
   - Confirm constraints and indexes

3. **Check migration dependencies**
   - Should depend on previous products migration
   - Should reference tenant schema migration
   - Verify dependency chain is correct

4. **Apply migration**
   - Use migrate command
   - Command: python manage.py migrate products
   - Migration creates tables in public schema (for tenant creation)
   - Tables will be replicated to tenant schemas

5. **Verify database tables**
   - Check products_bundle table exists
   - Check products_bundle_item table exists
   - Verify columns match model fields
   - Confirm foreign key constraints
   - Check indexes are created

6. **Test multi-tenancy**
   - Verify tables exist in tenant schemas
   - Create test tenant if needed
   - Confirm schema_name prefix works correctly
   - Test tenant isolation

### Migration File Structure
```python
# Generated migration file
class Migration(migrations.Migration):
    dependencies = [
        ('products', 'previous_migration'),
    ]

    operations = [
        migrations.CreateModel(
            name='ProductBundle',
            fields=[...],
        ),
        migrations.CreateModel(
            name='BundleItem',
            fields=[...],
        ),
        migrations.AddConstraint(...),
        migrations.AddIndex(...),
    ]
```

### Expected Database Structure
```
products_bundle:
  - id (PK)
  - tenant_id (FK)
  - product_id (FK)
  - bundle_type
  - fixed_price
  - discount_type
  - discount_value
  - is_active
  - created_at
  - updated_at

products_bundle_item:
  - id (PK)
  - tenant_id (FK)
  - bundle_id (FK)
  - product_id (FK)
  - variant_id (FK, nullable)
  - quantity
  - is_optional
  - sort_order
  - created_at
  - updated_at
```

### Expected Outcome
Database tables for ProductBundle and BundleItem are created with all fields, constraints, and indexes properly applied.

### Verification Checklist
- [ ] Migration file is generated
- [ ] Migration includes ProductBundle model
- [ ] Migration includes BundleItem model
- [ ] All fields are present in migration
- [ ] Foreign keys are correctly defined
- [ ] Constraints are included
- [ ] Indexes are created
- [ ] Migration is applied successfully
- [ ] Tables exist in database
- [ ] Tenant schemas have tables

---

## Summary of Tasks 15-20

### What Was Accomplished
- Added is_optional flag for flexible bundle configurations
- Implemented sort_order for consistent item display
- Created __str__ and __repr__ methods for readable representations
- Configured Meta class with constraints and ordering
- Exported both bundle models properly
- Generated and applied database migration

### Complete Model Structures

**ProductBundle:**
```
Fields:
  - product (FK to Product) - indexed
  - bundle_type (CharField: fixed/dynamic) - indexed
  - fixed_price (DecimalField, nullable)
  - discount_type (CharField: percentage/fixed/none) - indexed
  - discount_value (DecimalField)
  - is_active (BooleanField) - indexed
  - created_at, updated_at (from TimestampedModel)
  - tenant (from TenantAwareModel)

Methods:
  - __str__()
  - __repr__()
```

**BundleItem:**
```
Fields:
  - bundle (FK to ProductBundle, CASCADE) - indexed
  - product (FK to Product, PROTECT) - indexed
  - variant (FK to ProductVariant, PROTECT, nullable) - indexed
  - quantity (PositiveIntegerField, min 1)
  - is_optional (BooleanField) - indexed
  - sort_order (PositiveIntegerField) - indexed
  - created_at, updated_at (from TimestampedModel)
  - tenant (from TenantAwareModel)

Methods:
  - __str__()
  - __repr__()

Meta:
  - ordering: ['sort_order', 'product__name']
  - constraint: unique(bundle, product, variant)
  - indexes: [(bundle, is_optional), (product)]
```

### Database Implementation
- Two new tables created: products_bundle, products_bundle_item
- All foreign keys with proper on_delete behavior
- Unique constraint prevents duplicate items
- Indexes optimize common queries
- Multi-tenant schema support

### Group A Complete
All tasks for Group A are complete. The bundle product models are now ready for business logic implementation in Group B.

---

## Notes for Developers

### Data Integrity
- UniqueConstraint ensures no duplicate items in bundles
- PROTECT on product/variant FKs prevents accidental deletion
- CASCADE on bundle FK ensures cleanup when bundle deleted
- Positive validators ensure valid quantities

### Query Patterns
Common queries for bundle items:
```python
# Get all items in a bundle (ordered)
bundle.items.all()

# Get required items only
bundle.items.filter(is_optional=False)

# Get items with product details
bundle.items.select_related('product', 'variant')

# Check if product is in any bundle
product.bundle_items.exists()
```

### Admin Interface Considerations
- Display items as inline in ProductBundle admin
- Order by sort_order for intuitive display
- Show optional flag clearly
- Allow reordering via sort_order field
- Validate variant belongs to product

### Business Logic Next Steps
- Implement stock calculation service (Group B)
- Calculate bundle pricing (Group B)
- Handle optional item pricing
- Validate bundle configurations
- Create bundle management APIs

### Testing Considerations
- Test unique constraint enforcement
- Verify cascade deletion behavior
- Test ordering by sort_order
- Validate variant-product relationship
- Test tenant isolation
- Verify stock calculations with various quantities

---
