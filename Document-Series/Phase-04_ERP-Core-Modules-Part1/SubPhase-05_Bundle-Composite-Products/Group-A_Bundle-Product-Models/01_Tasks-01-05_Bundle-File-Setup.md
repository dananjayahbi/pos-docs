# Tasks 01-05: Bundle File Setup

> **Phase:** 04 - ERP Core Modules Part 1  
> **SubPhase:** 05 - Bundle & Composite Products  
> **Group:** A - Bundle Product Models  
> **Document:** 01 of 04  
> **Tasks Covered:** 01, 02, 03, 04, 05

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **→ Next Document:** [02_Tasks-06-09_Bundle-Discount-Fields.md](02_Tasks-06-09_Bundle-Discount-Fields.md)

---

## Document Overview

This document establishes the foundation for bundle products in LankaCommerce Cloud. Bundles allow merchants to group multiple products together and sell them as a single package, such as gift sets, meal combos, or promotional packages. This group of tasks creates the base bundle model file and establishes the core fields for bundle configuration including product relationships and pricing type definitions.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 01 | Create bundle.py File | Low | 3 min |
| 02 | Define ProductBundle Class | Medium | 10 min |
| 03 | Add product Field | Low | 5 min |
| 04 | Add bundle_type Field | Low | 5 min |
| 05 | Add fixed_price Field | Low | 5 min |

---

## Task 01: Create bundle.py File

### Overview
Create a new model file to house all bundle-related models, keeping the codebase organized and following Django's pattern of separating concerns by model type.

### Dependencies
- SubPhase-03: Product Base Model (existing Product model)
- Django 5.x installed and configured
- django-tenants multi-tenancy setup complete

### Instructions

1. **Navigate to the products models directory**
   - Open the backend/apps/products/models/ directory
   - This directory should already contain product.py from previous sub-phases

2. **Create new bundle.py file**
   - Create a new file named `bundle.py` in the models directory
   - This file will contain ProductBundle and BundleItem models

3. **Add file-level imports**
   - Import Django model components
   - Import models.Model, models.ForeignKey, models.DecimalField
   - Import validators for decimal fields
   - Import CharField, TextField, BooleanField, PositiveIntegerField
   - Import timezone utilities from django.utils

4. **Import base model mixins**
   - Import TenantAwareModel from core.models
   - Import TimestampedModel for created_at/updated_at fields
   - Import the Product model from .product

5. **Add file-level docstring**
   - Describe the purpose: Bundle product models for LankaCommerce Cloud
   - Mention that bundles group multiple products sold as packages
   - Note tenant-aware implementation

6. **Define __all__ list**
   - Initially empty list for model exports
   - Will be populated as models are created

### Expected Outcome
```
backend/apps/products/models/
├── __init__.py
├── product.py
└── bundle.py          # NEW FILE
```

### Verification Checklist
- [ ] bundle.py file exists in models directory
- [ ] File contains necessary Django model imports
- [ ] Base mixins are imported (TenantAwareModel, TimestampedModel)
- [ ] Product model is imported
- [ ] File docstring explains bundle purpose
- [ ] __all__ list is defined (can be empty initially)

---

## Task 02: Define ProductBundle Class

### Overview
Create the main ProductBundle model class that represents a collection of products sold together as a single unit. This model acts as the container for bundle configuration.

### Dependencies
- Task 01: Create bundle.py File

### Instructions

1. **Define the ProductBundle class**
   - Create class named ProductBundle
   - Inherit from TenantAwareModel (for multi-tenancy)
   - Inherit from TimestampedModel (for created_at/updated_at)
   - Use multiple inheritance: (TenantAwareModel, TimestampedModel)

2. **Add class-level docstring**
   - Describe the model: Represents a bundle of products sold together
   - Explain use cases: gift sets, combo packages, promotional bundles
   - Note examples: "Tea Gift Set" = Tea Box + Cookies + Gift Bag
   - Mention pricing flexibility: fixed price or sum of components

3. **Plan model structure**
   - This class will link to a Product record
   - The Product represents the bundle as a sellable item
   - BundleItems (next task) will define what's inside the bundle
   - Bundle can have fixed or dynamic pricing

4. **Add Meta class placeholder**
   - Define inner Meta class
   - Set verbose_name to "Product Bundle"
   - Set verbose_name_plural to "Product Bundles"
   - Set db_table to "products_bundle"
   - Set ordering by created_at descending

5. **Prepare for field additions**
   - Fields will be added in subsequent tasks
   - Model structure should support both pricing types
   - Should track active/inactive status

### Model Concept
```
ProductBundle
  ├── Links to base Product (the bundle itself)
  ├── Has bundle_type (fixed or dynamic pricing)
  ├── Contains multiple BundleItems (what's in the bundle)
  └── Can have discount applied to components
```

### Expected Outcome
A ProductBundle class definition is present in bundle.py with proper inheritance and Meta configuration, ready to receive field definitions.

### Verification Checklist
- [ ] ProductBundle class is defined
- [ ] Inherits from TenantAwareModel and TimestampedModel
- [ ] Class docstring explains bundle concept
- [ ] Meta class is defined with proper settings
- [ ] verbose_name and db_table are configured
- [ ] Ordering is set appropriately

---

## Task 03: Add product Field

### Overview
Create a foreign key relationship linking the ProductBundle to the base Product model. This connection allows the bundle to be treated as a regular product in the system (with its own SKU, name, images, etc.).

### Dependencies
- Task 02: Define ProductBundle Class

### Instructions

1. **Add product ForeignKey field**
   - Field name: product
   - Type: models.ForeignKey
   - Related model: Product
   - Use on_delete=models.PROTECT (prevent deletion of products in active bundles)

2. **Configure reverse relationship**
   - Set related_name="bundles"
   - This allows accessing bundles from a Product: product.bundles.all()
   - Useful for checking if a product is part of any bundles

3. **Add help text**
   - Explain: "The product record representing this bundle"
   - Note that the bundle itself is a product in the catalog
   - Mention that bundle items are separate (defined in BundleItem)

4. **Add field docstring comment**
   - Document above the field
   - Explain that the bundle is a product itself
   - The bundle has its own SKU, name, description, images
   - BundleItems define what products are inside the bundle

5. **Consider database index**
   - Add db_index=True for query performance
   - Bundles will be frequently queried by product

6. **Ensure tenant isolation**
   - Product model already handles tenant filtering
   - The foreign key will inherit tenant awareness
   - Cross-tenant bundle access is automatically prevented

### Relationship Diagram
```
Product (id=1, name="Holiday Gift Set")
   ↓ (one-to-one or one-to-many)
ProductBundle (product_id=1, bundle_type="fixed")
   ↓ (one-to-many)
BundleItem (bundle_id=1, product_id=5, qty=1)  # Tea Box
BundleItem (bundle_id=1, product_id=8, qty=2)  # Cookies
BundleItem (bundle_id=1, product_id=12, qty=1) # Gift Bag
```

### Expected Outcome
The ProductBundle model now has a product field that links each bundle to its corresponding Product record in the catalog.

### Verification Checklist
- [ ] product field is defined as ForeignKey to Product
- [ ] on_delete is set to models.PROTECT
- [ ] related_name is set to "bundles"
- [ ] help_text explains the relationship
- [ ] db_index is set to True
- [ ] Comment documentation is present

---

## Task 04: Add bundle_type Field

### Overview
Define a choice field that determines how the bundle's price is calculated. This field enables two distinct pricing strategies: fixed pricing (bundle has a set price regardless of component prices) and dynamic pricing (bundle price is calculated from component prices).

### Dependencies
- Task 03: Add product Field

### Instructions

1. **Define bundle type choices**
   - Create a tuple of tuples at class level
   - Choice name: BUNDLE_TYPE_CHOICES
   - Option 1: ('fixed', 'Fixed Price')
   - Option 2: ('dynamic', 'Dynamic Price')

2. **Add bundle_type CharField**
   - Field name: bundle_type
   - Type: models.CharField
   - max_length: 20 characters
   - choices: BUNDLE_TYPE_CHOICES
   - default: 'dynamic'

3. **Add help text**
   - Explain fixed: "Bundle has a set price regardless of component prices"
   - Explain dynamic: "Price is calculated from component prices with optional discount"

4. **Add field docstring comment**
   - Document the two pricing strategies
   - Fixed example: Gift Set = Rs. 5,000 (fixed)
   - Dynamic example: Gift Set = (Tea Rs. 1,500 + Cookies Rs. 800) - 10% = Rs. 2,070

5. **Add database index**
   - Set db_index=True
   - Bundles will be filtered by type frequently
   - Improves query performance for pricing calculations

6. **Consider validation**
   - CharField with choices automatically validates
   - Only 'fixed' or 'dynamic' values are allowed
   - Database constraint is automatically created

### Pricing Strategy Examples

**Fixed Pricing:**
- Bundle: "Holiday Gift Set" = Rs. 5,000
- Components: Tea (Rs. 1,500) + Cookies (Rs. 800) + Bag (Rs. 200)
- Customer pays: Rs. 5,000 (regardless of component price changes)
- Merchant can change component prices without affecting bundle price

**Dynamic Pricing:**
- Bundle: "Holiday Gift Set" with 10% discount
- Components: Tea (Rs. 1,500) + Cookies (Rs. 800) + Bag (Rs. 200) = Rs. 2,500
- Customer pays: Rs. 2,500 - 10% = Rs. 2,250
- If Tea price increases to Rs. 1,800, bundle price becomes Rs. 2,430

### Expected Outcome
The ProductBundle model now has a bundle_type field that controls pricing calculation strategy, with clear choices and proper indexing.

### Verification Checklist
- [ ] BUNDLE_TYPE_CHOICES tuple is defined
- [ ] bundle_type CharField is created
- [ ] max_length is set to 20
- [ ] choices references BUNDLE_TYPE_CHOICES
- [ ] default is set to 'dynamic'
- [ ] help_text explains both pricing types
- [ ] db_index is set to True
- [ ] Field documentation comment is present

---

## Task 05: Add fixed_price Field

### Overview
Add a decimal field to store the fixed price for bundles using the 'fixed' pricing type. This field is optional and only used when bundle_type is 'fixed'.

### Dependencies
- Task 04: Add bundle_type Field

### Instructions

1. **Add fixed_price DecimalField**
   - Field name: fixed_price
   - Type: models.DecimalField
   - max_digits: 12 (supports up to 9,999,999,999.99)
   - decimal_places: 2 (for currency precision)
   - null: True (not required for dynamic bundles)
   - blank: True (optional in forms)

2. **Add help text**
   - Explain: "Fixed price in LKR for this bundle"
   - Note: "Only applicable when bundle_type is 'fixed'"
   - Mention: "Leave empty for dynamic pricing"

3. **Add field docstring comment**
   - Document that this field is for fixed pricing only
   - When bundle_type='fixed', this price is used
   - When bundle_type='dynamic', this field is ignored
   - Price is in Sri Lankan Rupees (LKR)

4. **Add validators**
   - Import MinValueValidator from django.core.validators
   - Add validator: MinValueValidator(0.01)
   - Ensure price is positive (greater than 0)

5. **Consider currency format**
   - This field stores numerical value only
   - Currency symbol (Rs. or ₨) is added in display/serialization
   - Decimal precision matches LKR standards (2 decimal places)

6. **Handle business logic**
   - Note: Validation to ensure fixed_price is set when bundle_type='fixed'
   - This validation will be in model clean() method (later task)
   - Serializer will handle validation as well

### Field Usage Examples

**Fixed Price Bundle:**
```
bundle_type: "fixed"
fixed_price: 5000.00
→ Customer pays: Rs. 5,000.00
```

**Dynamic Price Bundle:**
```
bundle_type: "dynamic"
fixed_price: null
→ Price calculated from components + discount
```

### Expected Outcome
The ProductBundle model now has a fixed_price field that stores the bundle price when using fixed pricing strategy.

### Verification Checklist
- [ ] fixed_price DecimalField is defined
- [ ] max_digits is set to 12
- [ ] decimal_places is set to 2
- [ ] null and blank are set to True
- [ ] help_text explains usage
- [ ] MinValueValidator(0.01) is added
- [ ] Field documentation comment is present
- [ ] Comment notes validation requirements

---

## Summary of Tasks 01-05

### What Was Accomplished
- Created bundle.py file with proper structure
- Defined ProductBundle model with inheritance
- Linked bundle to Product model via ForeignKey
- Implemented bundle_type field with fixed/dynamic pricing options
- Added fixed_price field for fixed pricing strategy

### Current Model Structure
```
ProductBundle:
  - Inherits: TenantAwareModel, TimestampedModel
  - product (FK to Product)
  - bundle_type (CharField: 'fixed' or 'dynamic')
  - fixed_price (DecimalField, nullable)
```

### Next Steps
The next document will add discount-related fields (discount_type, discount_value) and the is_active flag to complete the ProductBundle model configuration.

---

## Notes for Developers

### Bundle Concept
- A bundle is a Product that contains other Products
- The bundle itself has a Product record (with SKU, name, images)
- BundleItems define which products/variants are inside
- Bundle can be priced in two ways:
  - **Fixed:** Set price regardless of component costs
  - **Dynamic:** Calculate from component prices with optional discount

### Sri Lanka Localization
- All prices in LKR (Sri Lankan Rupees)
- Use Rs. or ₨ symbol in display
- Decimal precision: 2 places (Rs. 1,250.75)
- Max price: Rs. 9,999,999,999.99

### Tenant Isolation
- ProductBundle inherits TenantAwareModel
- Bundles are automatically scoped to tenant
- Cross-tenant access is prevented
- Product FK also respects tenant boundaries

### Pricing Strategies
- **Fixed Pricing:** Best for promotions, gift sets, special offers
- **Dynamic Pricing:** Best for flexible combos, customizable bundles
- Choice affects how price is calculated and displayed
- Dynamic pricing updates automatically when component prices change

### Database Performance
- Foreign key fields have db_index=True
- bundle_type has db_index for filtering
- Queries will be optimized for tenant + bundle_type lookups

---
