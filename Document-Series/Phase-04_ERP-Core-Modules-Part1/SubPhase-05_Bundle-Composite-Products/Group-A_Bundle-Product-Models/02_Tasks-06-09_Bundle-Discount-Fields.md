# Tasks 06-09: Bundle Discount Fields

> **Phase:** 04 - ERP Core Modules Part 1  
> **SubPhase:** 05 - Bundle & Composite Products  
> **Group:** A - Bundle Product Models  
> **Document:** 02 of 04  
> **Tasks Covered:** 06, 07, 08, 09

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [01_Tasks-01-05_Bundle-File-Setup.md](01_Tasks-01-05_Bundle-File-Setup.md)
- **→ Next Document:** [03_Tasks-10-14_BundleItem-Base.md](03_Tasks-10-14_BundleItem-Base.md)

---

## Document Overview

This document adds discount functionality to the ProductBundle model for dynamic pricing scenarios. When a bundle uses dynamic pricing (price calculated from component prices), merchants can apply discounts to incentivize bundle purchases. This group of tasks implements discount type selection (percentage vs. fixed amount), discount value storage, and active status management.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 06 | Add discount_type Field | Low | 5 min |
| 07 | Add discount_value Field | Low | 5 min |
| 08 | Add is_active Field | Low | 3 min |
| 09 | Export ProductBundle | Low | 3 min |

---

## Task 06: Add discount_type Field

### Overview
Create a choice field that defines how the discount is applied to dynamic bundles. Merchants can choose between percentage-based discounts (e.g., "10% off") or fixed amount discounts (e.g., "Rs. 500 off").

### Dependencies
- Task 05: Add fixed_price Field

### Instructions

1. **Define discount type choices**
   - Create a tuple of tuples at class level
   - Choice name: DISCOUNT_TYPE_CHOICES
   - Option 1: ('percentage', 'Percentage Discount')
   - Option 2: ('fixed', 'Fixed Amount Discount')
   - Option 3: ('none', 'No Discount')

2. **Add discount_type CharField**
   - Field name: discount_type
   - Type: models.CharField
   - max_length: 20 characters
   - choices: DISCOUNT_TYPE_CHOICES
   - default: 'none'
   - blank: True (optional)

3. **Add help text**
   - Explain: "How discount is calculated for dynamic bundles"
   - Note percentage: "Percentage off the total component prices"
   - Note fixed: "Fixed amount deducted from total"
   - Note none: "No discount applied"

4. **Add field docstring comment**
   - Document discount type options
   - Percentage example: 10% off Rs. 2,500 = Rs. 2,250
   - Fixed example: Rs. 500 off Rs. 2,500 = Rs. 2,000
   - Note: Only applicable when bundle_type='dynamic'

5. **Add database index**
   - Set db_index=True
   - Helps filter active discounted bundles
   - Improves reporting query performance

6. **Consider validation rules**
   - When bundle_type='fixed', discount_type should be 'none'
   - When bundle_type='dynamic', any discount_type is valid
   - Validation logic will be in model clean() method

### Discount Type Examples

**Percentage Discount:**
```
Component Total: Rs. 2,500
Discount Type: percentage
Discount Value: 10
Final Price: Rs. 2,500 - (Rs. 2,500 × 10%) = Rs. 2,250
```

**Fixed Amount Discount:**
```
Component Total: Rs. 2,500
Discount Type: fixed
Discount Value: 500
Final Price: Rs. 2,500 - Rs. 500 = Rs. 2,000
```

**No Discount:**
```
Component Total: Rs. 2,500
Discount Type: none
Final Price: Rs. 2,500
```

### Expected Outcome
The ProductBundle model now has a discount_type field that determines how discounts are calculated for dynamic bundles.

### Verification Checklist
- [ ] DISCOUNT_TYPE_CHOICES tuple is defined
- [ ] discount_type CharField is created
- [ ] max_length is set to 20
- [ ] choices references DISCOUNT_TYPE_CHOICES
- [ ] default is set to 'none'
- [ ] blank is set to True
- [ ] help_text explains discount types
- [ ] db_index is set to True
- [ ] Field documentation comment is present

---

## Task 07: Add discount_value Field

### Overview
Add a decimal field to store the discount value. This field's interpretation depends on the discount_type: for percentage discounts, it represents the percentage (e.g., 10.00 for 10%), and for fixed discounts, it represents the amount in LKR.

### Dependencies
- Task 06: Add discount_type Field

### Instructions

1. **Add discount_value DecimalField**
   - Field name: discount_value
   - Type: models.DecimalField
   - max_digits: 10
   - decimal_places: 2
   - null: True (not required)
   - blank: True (optional in forms)
   - default: 0.00

2. **Add help text**
   - Explain: "Discount value - percentage or amount in LKR"
   - Note percentage: "For percentage type: 10.00 means 10%"
   - Note fixed: "For fixed type: 500.00 means Rs. 500"
   - Note: "Only applies to dynamic bundles"

3. **Add field docstring comment**
   - Document dual purpose of this field
   - When discount_type='percentage', value is percentage (0-100)
   - When discount_type='fixed', value is LKR amount
   - When discount_type='none', this field is ignored

4. **Add validators**
   - Import MinValueValidator, MaxValueValidator
   - Add MinValueValidator(0.00) - non-negative values
   - Note: MaxValueValidator for percentage will be in model clean()

5. **Consider decimal precision**
   - Supports percentages like 12.50 (12.5%)
   - Supports amounts like 1,250.75 (Rs. 1,250.75)
   - Max value: 99,999,999.99

6. **Handle validation logic**
   - For percentage type: value should be 0-100
   - For fixed type: value should be less than component total
   - Validation will be in model clean() method or service layer

### Field Usage Examples

**Percentage Discount:**
```
discount_type: "percentage"
discount_value: 15.00
→ Means 15% discount on component total
```

**Fixed Amount Discount:**
```
discount_type: "fixed"
discount_value: 750.50
→ Means Rs. 750.50 off component total
```

**No Discount:**
```
discount_type: "none"
discount_value: 0.00 (ignored)
→ No discount applied
```

### Expected Outcome
The ProductBundle model now has a discount_value field that stores the numerical discount value for both percentage and fixed discount types.

### Verification Checklist
- [ ] discount_value DecimalField is defined
- [ ] max_digits is set to 10
- [ ] decimal_places is set to 2
- [ ] null and blank are set to True
- [ ] default is set to 0.00
- [ ] help_text explains dual purpose
- [ ] MinValueValidator(0.00) is added
- [ ] Field documentation comment is present

---

## Task 08: Add is_active Field

### Overview
Add a boolean flag to control whether a bundle is currently active and available for purchase. This allows merchants to temporarily disable bundles without deleting them, useful for seasonal promotions or inventory management.

### Dependencies
- Task 07: Add discount_value Field

### Instructions

1. **Add is_active BooleanField**
   - Field name: is_active
   - Type: models.BooleanField
   - default: True (bundles are active by default)

2. **Add help text**
   - Explain: "Whether this bundle is currently active"
   - Note: "Inactive bundles are not displayed to customers"
   - Mention: "Use to temporarily disable bundles"

3. **Add field docstring comment**
   - Document usage for bundle lifecycle management
   - Active bundles appear in product listings
   - Inactive bundles are hidden but not deleted
   - Useful for seasonal bundles, promotions, inventory issues

4. **Add database index**
   - Set db_index=True
   - Frequently filtered in queries (show only active)
   - Critical for storefront performance

5. **Consider status management**
   - Bundles can be deactivated for various reasons:
     - Seasonal/promotional period ended
     - Component products out of stock
     - Price changes pending
     - Quality/compliance issues
   - Inactive bundles retain all data for reactivation

6. **Add query manager support**
   - Note: Custom manager will have .active() method
   - Will be implemented in later tasks
   - Filters for is_active=True automatically

### Active Status Use Cases

**Seasonal Bundle:**
```
"Christmas Gift Set"
is_active: True (Dec 1 - Dec 31)
is_active: False (rest of year)
```

**Promotional Bundle:**
```
"Back to School Bundle"
is_active: True (during promotion)
is_active: False (after promotion ends)
```

**Stock-Dependent Bundle:**
```
"Premium Tea Set"
is_active: True (when all components available)
is_active: False (when key component out of stock)
```

### Expected Outcome
The ProductBundle model now has an is_active field that controls bundle visibility and availability.

### Verification Checklist
- [ ] is_active BooleanField is defined
- [ ] default is set to True
- [ ] help_text explains purpose
- [ ] db_index is set to True
- [ ] Field documentation comment is present
- [ ] Use cases are documented

---

## Task 09: Export ProductBundle

### Overview
Export the ProductBundle model from the bundle.py module and update the models package __init__.py to make the model accessible throughout the application.

### Dependencies
- Task 08: Add is_active Field

### Instructions

1. **Update __all__ list in bundle.py**
   - Add 'ProductBundle' to the __all__ list
   - This controls what gets exported from the module
   - List format: __all__ = ['ProductBundle']

2. **Add __str__ method to ProductBundle**
   - Define __str__ method for model representation
   - Return format: f"{self.product.name} (Bundle)"
   - This provides readable representation in admin and logs

3. **Add __repr__ method for debugging**
   - Define __repr__ method
   - Return format: f"<ProductBundle: {self.product.name} [{self.bundle_type}]>"
   - Includes bundle type for developer clarity

4. **Update models/__init__.py**
   - Open backend/apps/products/models/__init__.py
   - Add import: from .bundle import ProductBundle
   - Add 'ProductBundle' to the __all__ list in __init__.py
   - Maintains clean import paths

5. **Verify import paths**
   - Model should be importable as: from products.models import ProductBundle
   - Or as: from products.models.bundle import ProductBundle
   - Both paths should work

6. **Add model properties (optional but recommended)**
   - Consider adding @property methods for common calculations
   - Example: is_fixed_price property returning bundle_type == 'fixed'
   - Example: is_dynamic_price property
   - Example: has_discount property checking discount_type != 'none'

### String Representation Examples

**__str__ method output:**
```
"Holiday Gift Set (Bundle)"
"Premium Tea Collection (Bundle)"
"Back to School Bundle (Bundle)"
```

**__repr__ method output:**
```
<ProductBundle: Holiday Gift Set [fixed]>
<ProductBundle: Premium Tea Collection [dynamic]>
<ProductBundle: Back to School Bundle [dynamic]>
```

### Expected Outcome
The ProductBundle model is properly exported and can be imported throughout the application with clean import paths.

### Verification Checklist
- [ ] __all__ list in bundle.py includes 'ProductBundle'
- [ ] __str__ method is defined
- [ ] __repr__ method is defined
- [ ] models/__init__.py imports ProductBundle
- [ ] ProductBundle is in __all__ list in __init__.py
- [ ] Import paths are verified
- [ ] Optional properties are considered

---

## Summary of Tasks 06-09

### What Was Accomplished
- Added discount_type field with percentage/fixed/none options
- Implemented discount_value field for storing discount amounts
- Created is_active flag for bundle lifecycle management
- Exported ProductBundle model with proper string representations

### Complete ProductBundle Model Structure
```
ProductBundle:
  - Inherits: TenantAwareModel, TimestampedModel
  - product (FK to Product) - indexed
  - bundle_type (CharField: 'fixed' or 'dynamic') - indexed
  - fixed_price (DecimalField, nullable)
  - discount_type (CharField: 'percentage', 'fixed', or 'none') - indexed
  - discount_value (DecimalField, default 0.00)
  - is_active (BooleanField, default True) - indexed
  - __str__ method
  - __repr__ method
```

### Pricing Logic Summary

**Fixed Price Bundle:**
```
bundle_type = 'fixed'
fixed_price = 5000.00
→ Price: Rs. 5,000 (discount fields ignored)
```

**Dynamic Bundle with Percentage Discount:**
```
bundle_type = 'dynamic'
discount_type = 'percentage'
discount_value = 10.00
Components: Rs. 2,500
→ Price: Rs. 2,500 - 10% = Rs. 2,250
```

**Dynamic Bundle with Fixed Discount:**
```
bundle_type = 'dynamic'
discount_type = 'fixed'
discount_value = 500.00
Components: Rs. 2,500
→ Price: Rs. 2,500 - Rs. 500 = Rs. 2,000
```

### Next Steps
The next document will create the BundleItem model that defines which products and quantities are included in each bundle.

---

## Notes for Developers

### Discount Validation Rules
- Fixed price bundles should not have discounts (discount_type='none')
- Dynamic bundles can have any discount type
- Percentage discounts: 0-100 range
- Fixed discounts: should not exceed component total
- Validation should be in model.clean() method

### Business Logic Considerations
- is_active allows soft-disabling bundles
- Inactive bundles should not appear in storefront
- Admin interface should clearly show active status
- Consider audit trail for status changes

### Database Indexing Strategy
- product field: indexed (FK lookup)
- bundle_type: indexed (filtering)
- discount_type: indexed (reporting)
- is_active: indexed (critical for queries)
- Composite indexes may be beneficial for common queries

### Price Calculation Flow
1. Check bundle_type
2. If 'fixed': return fixed_price
3. If 'dynamic':
   - Calculate sum of component prices
   - Apply discount based on discount_type
   - Return final calculated price

### Sri Lanka Localization
- All amounts in LKR
- Display with Rs. or ₨ prefix
- Format: Rs. 1,250.75
- Support for high-value bundles (up to billions)

### Model Validation
- Implement clean() method to validate:
  - fixed_price required when bundle_type='fixed'
  - discount_value range based on discount_type
  - discount_type='none' when bundle_type='fixed'
- Use django.core.exceptions.ValidationError

---
