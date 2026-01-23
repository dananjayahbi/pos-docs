# Tasks 19-24: QuoteLineItem Model Core Fields

> **Phase:** 05 - ERP Core Modules Part 2  
> **SubPhase:** 04 - Quote Management  
> **Group:** B - Quote Line Items & Calculations  
> **Document:** 01 of 03  
> **Tasks Covered:** 19, 20, 21, 22, 23, 24

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **→ Next Document:** [02_Tasks-25-29_Tax-Total-Notes-Migration.md](02_Tasks-25-29_Tax-Total-Notes-Migration.md)

---

## Document Overview

This document covers the creation of the QuoteLineItem model with its core fields including product references, custom descriptions, quantity, pricing, and discount fields. These line items represent individual products or services within a quote.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 19 | Create QuoteLineItem Model | Medium | 25 min |
| 20 | Add Line Item Product Reference | Medium | 20 min |
| 21 | Add Line Item Custom Description | Medium | 20 min |
| 22 | Add Line Item Quantity Fields | Low | 15 min |
| 23 | Add Line Item Pricing Fields | Medium | 20 min |
| 24 | Add Line Item Discount Fields | Medium | 20 min |

---

## Task 19: Create QuoteLineItem Model

### Overview
Create the QuoteLineItem model that represents individual line items within a quote, establishing the base structure with ForeignKey to Quote and position ordering.

### Dependencies
- Group A: Quote model exists
- Phase 03: Product models exist

### Instructions

1. **Create line_item.py model file**
   - Navigate to `apps/quotes/models/`
   - Create new file `line_item.py`

2. **Import required modules**
   - Import Django model classes
   - Import DecimalField, CharField, TextField
   - Import ForeignKey, PositiveIntegerField
   - Import ValidationError
   - Import Quote model

3. **Define QuoteLineItem model class**
   - Inherit from models.Model
   - Add clear docstring explaining purpose

4. **Add quote relationship field**
   - ForeignKey to Quote model
   - related_name='line_items'
   - on_delete=models.CASCADE
   - Help text explaining relationship

5. **Add position field for ordering**
   - PositiveIntegerField
   - default=0
   - db_index=True for sorting performance
   - Help text: "Display order of line item"

6. **Add created_at/updated_at timestamps**
   - created_at: DateTimeField(auto_now_add=True)
   - updated_at: DateTimeField(auto_now=True)

7. **Add Meta class**
   - ordering = ['position', 'created_at']
   - verbose_name = "Quote Line Item"
   - verbose_name_plural = "Quote Line Items"
   - indexes on quote + position

8. **Add __str__ method**
   - Return string like "Quote QT-001 - Line 1"
   - Include quote number and position

9. **Update models __init__.py**
   - Import QuoteLineItem
   - Add to __all__

### Expected Outcome
```
apps/quotes/models/
├── __init__.py
├── quote.py
└── line_item.py              # New file created
```

### Verification Checklist
- [ ] line_item.py file created
- [ ] QuoteLineItem model defined with base fields
- [ ] ForeignKey to Quote with CASCADE delete
- [ ] position field for ordering
- [ ] Timestamps added
- [ ] Meta class with ordering
- [ ] __str__ method implemented
- [ ] Imported in models __init__.py

---

## Task 20: Add Line Item Product Reference

### Overview
Add optional ForeignKey fields to Product and ProductVariant to link line items to catalog products while supporting custom/non-product items.

### Dependencies
- Task 19: QuoteLineItem model exists

### Instructions

1. **Open line_item.py model**
   - Navigate to `apps/quotes/models/line_item.py`

2. **Import Product and ProductVariant models**
   - From apps.products.models import Product, ProductVariant

3. **Add product ForeignKey field**
   - ForeignKey to Product model
   - null=True, blank=True (optional)
   - on_delete=models.PROTECT (prevent deleting products in use)
   - related_name='quote_line_items'
   - Help text: "Linked product (if item is from catalog)"

4. **Add variant ForeignKey field**
   - ForeignKey to ProductVariant model
   - null=True, blank=True (optional)
   - on_delete=models.PROTECT
   - related_name='quote_line_items'
   - Help text: "Product variant (if applicable)"

5. **Add product snapshot fields**
   - product_name: CharField(max_length=255)
   - Stores product name at quote creation
   - Help text: "Product name snapshot"

6. **Add model validation**
   - Create clean() method
   - Validate: if variant is set, product must be set
   - Validate: variant must belong to product
   - Raise ValidationError for invalid combinations

7. **Add is_product_based property**
   - @property decorator
   - Return True if product is not None
   - Use for conditional logic

8. **Update __str__ method**
   - Include product_name if present
   - Return "Quote QT-001 - Product Name"

### Field Specifications

| Field | Type | Constraints |
|-------|------|-------------|
| product | ForeignKey(Product) | null=True, blank=True, on_delete=PROTECT |
| variant | ForeignKey(ProductVariant) | null=True, blank=True, on_delete=PROTECT |
| product_name | CharField | max_length=255, snapshot field |

### Validation Rules
```
IF variant IS SET:
    THEN product MUST BE SET
    AND variant.product MUST EQUAL product
```

### Expected Outcome
```python
# Line item linked to catalog product
line = QuoteLineItem.objects.create(
    quote=quote,
    product=product,
    variant=variant,
    product_name=product.name,
    position=1
)

# Line item for custom service (no product)
line = QuoteLineItem.objects.create(
    quote=quote,
    product=None,
    product_name="Custom Consultation Service",
    position=2
)
```

### Verification Checklist
- [ ] product ForeignKey added
- [ ] variant ForeignKey added
- [ ] product_name snapshot field added
- [ ] clean() method validates relationships
- [ ] PROTECT on_delete prevents product deletion
- [ ] is_product_based property implemented
- [ ] __str__ method updated

---

## Task 21: Add Line Item Custom Description

### Overview
Add fields for custom descriptions and SKU codes to support non-catalog items and custom services that don't link to products.

### Dependencies
- Task 20: Product reference fields exist

### Instructions

1. **Open line_item.py model**
   - Navigate to `apps/quotes/models/line_item.py`

2. **Add custom_description field**
   - TextField
   - blank=True (optional)
   - Help text: "Custom description for non-product items"
   - Use when product is None

3. **Add custom_sku field**
   - CharField(max_length=100)
   - blank=True (optional)
   - Help text: "Custom SKU for non-product items"
   - Use for tracking custom items

4. **Add is_custom_item property**
   - @property decorator
   - Return True if product is None
   - Return False if product is set

5. **Add get_description method**
   - Return product.description if product exists
   - Return custom_description if product is None
   - Return empty string as fallback

6. **Add get_sku method**
   - Return product.sku if product exists
   - Return variant.sku if variant exists
   - Return custom_sku if product is None
   - Return empty string as fallback

7. **Update validation in clean() method**
   - If product is None, custom_description is required
   - Raise ValidationError: "Custom items require description"

8. **Add helper method get_display_name**
   - Return product_name if set
   - Use for UI display

### Field Specifications

| Field | Type | Constraints |
|-------|------|-------------|
| custom_description | TextField | blank=True, for non-product items |
| custom_sku | CharField | max_length=100, blank=True |

### Usage Examples

```python
# Product-based line item
line = QuoteLineItem(
    quote=quote,
    product=product,
    product_name=product.name,
    # custom_description remains blank
)

# Custom service line item
line = QuoteLineItem(
    quote=quote,
    product=None,
    product_name="Website Design Service",
    custom_description="10 page responsive website with CMS",
    custom_sku="SVC-WEB-001"
)
```

### Validation Rules
```
IF product IS NULL:
    THEN custom_description MUST NOT BE BLANK
```

### Expected Outcome
Support for two types of line items:
1. **Catalog items**: Linked to product, uses product data
2. **Custom items**: No product link, uses custom fields

### Verification Checklist
- [ ] custom_description TextField added
- [ ] custom_sku CharField added
- [ ] is_custom_item property implemented
- [ ] get_description() method returns appropriate value
- [ ] get_sku() method returns appropriate value
- [ ] get_display_name() method implemented
- [ ] Validation requires description for custom items

---

## Task 22: Add Line Item Quantity Fields

### Overview
Add quantity and unit of measure fields to track how many units of each item are being quoted.

### Dependencies
- Task 21: Description fields exist

### Instructions

1. **Open line_item.py model**
   - Navigate to `apps/quotes/models/line_item.py`

2. **Add quantity field**
   - DecimalField
   - max_digits=12, decimal_places=3
   - default=Decimal('1.000')
   - Validators: MinValueValidator(Decimal('0.001'))
   - Help text: "Quantity of items"

3. **Add unit_of_measure field**
   - CharField(max_length=50)
   - default='unit'
   - Help text: "Unit of measure (unit, kg, hour, sqm, etc.)"

4. **Create UOM_CHOICES constant**
   - Define common units at class level
   - ('unit', 'Unit'), ('kg', 'Kilogram'), ('g', 'Gram')
   - ('m', 'Meter'), ('cm', 'Centimeter')
   - ('sqm', 'Square Meter'), ('hour', 'Hour')
   - ('day', 'Day'), ('month', 'Month')

5. **Add get_quantity_display method**
   - Format quantity with unit
   - Return f"{quantity} {unit_of_measure}"
   - Handle decimal formatting (remove trailing zeros)

6. **Import Decimal and MinValueValidator**
   - from decimal import Decimal
   - from django.core.validators import MinValueValidator

7. **Add validation in clean() method**
   - Ensure quantity > 0
   - Raise ValidationError if quantity <= 0

8. **Update __str__ method**
   - Include quantity: "Quote QT-001 - Product (Qty: 2)"

### Field Specifications

| Field | Type | Constraints |
|-------|------|-------------|
| quantity | DecimalField | max_digits=12, decimal_places=3, min=0.001, default=1 |
| unit_of_measure | CharField | max_length=50, default='unit' |

### Sri Lanka Context
- Support metric system (kg, m, sqm)
- Common in construction: sqm, cubic meters
- Services: hours, days, months

### Usage Examples

```python
# Product quantity
line.quantity = Decimal('5.000')
line.unit_of_measure = 'unit'
# Display: "5 unit"

# Service by hours
line.quantity = Decimal('8.000')
line.unit_of_measure = 'hour'
# Display: "8 hour"

# Fabric by meters
line.quantity = Decimal('12.500')
line.unit_of_measure = 'm'
# Display: "12.5 m"
```

### Expected Outcome
```python
line_item = QuoteLineItem(
    quote=quote,
    product=product,
    product_name="Rice - Basmati",
    quantity=Decimal('50.000'),
    unit_of_measure='kg'
)
print(line_item.get_quantity_display())
# Output: "50 kg"
```

### Verification Checklist
- [ ] quantity DecimalField added with 3 decimal places
- [ ] MinValueValidator prevents zero/negative quantity
- [ ] unit_of_measure CharField added
- [ ] UOM_CHOICES defined
- [ ] get_quantity_display() method implemented
- [ ] Decimal import added
- [ ] Validation prevents invalid quantities
- [ ] __str__ method includes quantity

---

## Task 23: Add Line Item Pricing Fields

### Overview
Add pricing fields to track unit price, original price, and cost price for margin calculations.

### Dependencies
- Task 22: Quantity fields exist

### Instructions

1. **Open line_item.py model**
   - Navigate to `apps/quotes/models/line_item.py`

2. **Add unit_price field**
   - DecimalField
   - max_digits=12, decimal_places=2
   - default=Decimal('0.00')
   - Help text: "Price per unit (LKR)"
   - This is the selling price

3. **Add original_price field**
   - DecimalField
   - max_digits=12, decimal_places=2
   - default=Decimal('0.00')
   - Help text: "Original price before discounts"
   - Used to show savings

4. **Add cost_price field**
   - DecimalField
   - max_digits=12, decimal_places=2
   - null=True, blank=True
   - Help text: "Cost price for margin calculation"
   - Optional, for internal use

5. **Add property get_subtotal**
   - @property decorator
   - Calculate: quantity * unit_price
   - Return Decimal
   - Help text: "Subtotal before discounts and tax"

6. **Add property get_margin**
   - @property decorator
   - If cost_price is None, return None
   - Calculate: unit_price - cost_price
   - Return Decimal (margin per unit)

7. **Add property get_margin_percentage**
   - @property decorator
   - If cost_price is None or 0, return None
   - Calculate: ((unit_price - cost_price) / cost_price) * 100
   - Return Decimal (percentage)

8. **Add snapshot_product_prices method**
   - Method to copy prices from product
   - Set unit_price = product.selling_price or variant.price
   - Set original_price = unit_price
   - Set cost_price = product.cost_price
   - Called when line item created from product

9. **Add validation in clean() method**
   - original_price >= unit_price (original can't be less)
   - unit_price >= 0
   - cost_price >= 0 if set

### Field Specifications

| Field | Type | Constraints |
|-------|------|-------------|
| unit_price | DecimalField | max_digits=12, decimal_places=2, default=0 |
| original_price | DecimalField | max_digits=12, decimal_places=2, default=0 |
| cost_price | DecimalField | max_digits=12, decimal_places=2, null=True, blank=True |

### Pricing Logic

```
Subtotal = quantity × unit_price
Margin = unit_price - cost_price
Margin % = ((unit_price - cost_price) / cost_price) × 100
```

### Sri Lanka Context
- All prices in LKR (₨)
- 2 decimal places (standard currency)
- Margin calculation for profitability tracking

### Usage Examples

```python
# From product catalog
line = QuoteLineItem(
    quantity=Decimal('5'),
    unit_price=Decimal('1000.00'),
    original_price=Decimal('1200.00'),
    cost_price=Decimal('750.00')
)

print(line.get_subtotal)  # 5000.00 LKR
print(line.get_margin)    # 250.00 LKR per unit
print(line.get_margin_percentage)  # 33.33%
```

### Price Snapshotting Strategy
- Capture product prices when quote created
- Protect quote from future price changes
- original_price shows customer the "regular price"
- unit_price is the quoted price (may have discount)

### Expected Outcome
```python
# Snapshot prices from product
product.selling_price = Decimal('1500.00')
product.cost_price = Decimal('1000.00')

line_item.snapshot_product_prices(product)
# line_item.unit_price = 1500.00
# line_item.original_price = 1500.00
# line_item.cost_price = 1000.00
```

### Verification Checklist
- [ ] unit_price field added
- [ ] original_price field added
- [ ] cost_price field added (nullable)
- [ ] get_subtotal property calculates correctly
- [ ] get_margin property calculates correctly
- [ ] get_margin_percentage property calculates correctly
- [ ] snapshot_product_prices() method implemented
- [ ] Validation ensures price constraints
- [ ] All prices use 2 decimal places (LKR standard)

---

## Task 24: Add Line Item Discount Fields

### Overview
Add discount fields to support line-level discounts (percentage or fixed amount) applied to individual items.

### Dependencies
- Task 23: Pricing fields exist

### Instructions

1. **Open line_item.py model**
   - Navigate to `apps/quotes/models/line_item.py`

2. **Define DISCOUNT_TYPE_CHOICES**
   - Add at class level before fields
   - PERCENTAGE = 'PERCENTAGE'
   - FIXED = 'FIXED'
   - DISCOUNT_TYPE_CHOICES as tuple

3. **Add discount_type field**
   - CharField(max_length=20)
   - choices=DISCOUNT_TYPE_CHOICES
   - null=True, blank=True
   - Help text: "Type of discount"

4. **Add discount_value field**
   - DecimalField
   - max_digits=12, decimal_places=2
   - default=Decimal('0.00')
   - Help text: "Discount percentage or amount"

5. **Add discount_amount field**
   - DecimalField
   - max_digits=12, decimal_places=2
   - default=Decimal('0.00')
   - editable=False (calculated field)
   - Help text: "Calculated discount amount in LKR"

6. **Add calculate_discount_amount method**
   - Calculate based on discount_type
   - If PERCENTAGE: (quantity * unit_price) * (discount_value / 100)
   - If FIXED: discount_value
   - If None: return Decimal('0.00')
   - Store result in discount_amount field

7. **Add property get_discounted_price**
   - @property decorator
   - Calculate: unit_price - (discount_amount / quantity)
   - Return price per unit after discount
   - Handle division by zero

8. **Add property get_line_subtotal_with_discount**
   - @property decorator
   - Calculate: (quantity * unit_price) - discount_amount
   - Return subtotal after discount, before tax

9. **Update validation in clean() method**
   - If discount_type is set, discount_value must be > 0
   - If PERCENTAGE, discount_value must be <= 100
   - If FIXED, discount_amount must be <= subtotal
   - Raise ValidationError for invalid combinations

10. **Add has_discount property**
    - @property decorator
    - Return True if discount_amount > 0

11. **Override save method**
    - Call calculate_discount_amount() before saving
    - Then call super().save()

### Field Specifications

| Field | Type | Constraints |
|-------|------|-------------|
| discount_type | CharField | max_length=20, choices, null=True |
| discount_value | DecimalField | max_digits=12, decimal_places=2, default=0 |
| discount_amount | DecimalField | max_digits=12, decimal_places=2, calculated |

### Discount Calculation Logic

```python
IF discount_type == 'PERCENTAGE':
    discount_amount = subtotal × (discount_value / 100)
    
ELIF discount_type == 'FIXED':
    discount_amount = discount_value
    
ELSE:
    discount_amount = 0
```

### Usage Examples

```python
# Percentage discount
line = QuoteLineItem(
    quantity=Decimal('10'),
    unit_price=Decimal('1000.00'),
    discount_type='PERCENTAGE',
    discount_value=Decimal('15.00')  # 15%
)
line.calculate_discount_amount()
# discount_amount = 1,500.00 LKR
# Discounted subtotal = 8,500.00 LKR

# Fixed amount discount
line = QuoteLineItem(
    quantity=Decimal('5'),
    unit_price=Decimal('2000.00'),
    discount_type='FIXED',
    discount_value=Decimal('500.00')
)
line.calculate_discount_amount()
# discount_amount = 500.00 LKR
# Discounted subtotal = 9,500.00 LKR
```

### Sri Lanka Context
- Common: Percentage discounts (10%, 15%, 25% off)
- Festival discounts (Sinhala New Year, etc.)
- Bulk discounts for wholesale

### Validation Rules

```
IF discount_type IS SET:
    discount_value MUST BE > 0
    
IF discount_type == 'PERCENTAGE':
    discount_value MUST BE <= 100
    
IF discount_type == 'FIXED':
    discount_amount MUST BE <= line_subtotal
```

### Expected Outcome

Line items support:
1. No discount (discount_type=None)
2. Percentage discount (e.g., 10% off)
3. Fixed amount discount (e.g., ₨500 off)

### Verification Checklist
- [ ] DISCOUNT_TYPE_CHOICES defined
- [ ] discount_type CharField with choices
- [ ] discount_value DecimalField
- [ ] discount_amount calculated field
- [ ] calculate_discount_amount() method implemented
- [ ] get_discounted_price property
- [ ] get_line_subtotal_with_discount property
- [ ] has_discount property
- [ ] Validation prevents invalid discounts
- [ ] save() method auto-calculates discount
- [ ] Percentage discount capped at 100%
- [ ] Fixed discount validated against subtotal

---

## Summary

After completing Tasks 19-24, the QuoteLineItem model will have:

### Core Structure
- ForeignKey to Quote
- Position field for ordering
- Timestamps

### Product Linking
- Optional product/variant references
- Support for catalog items
- Support for custom items
- Product name snapshotting

### Descriptions
- Custom description field
- Custom SKU field
- Helper methods for display

### Quantity
- Decimal quantity field (3 decimal places)
- Unit of measure
- Common UOM choices

### Pricing
- unit_price (selling price)
- original_price (before discount)
- cost_price (for margins)
- Calculated subtotal
- Margin calculations

### Discounts
- Line-level discounts
- Percentage or fixed amount
- Auto-calculated discount_amount
- Validation rules

### Next Steps
Proceed to [02_Tasks-25-29_Tax-Total-Notes-Migration.md](02_Tasks-25-29_Tax-Total-Notes-Migration.md) to add tax fields, totals, notes, and run migrations.
