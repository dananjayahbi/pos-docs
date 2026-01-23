# Tasks 19-24: LineItem Model & Core Fields

> **Phase:** 05 - ERP Core Modules Part 2  
> **SubPhase:** 06 - Invoice System  
> **Group:** B - Invoice Line Items & Tax Calculation  
> **Document:** 01 of 03  
> **Tasks Covered:** 19, 20, 21, 22, 23, 24

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **→ Next Document:** [02_Tasks-25-28_Tax-HSN-Total-Migration.md](02_Tasks-25-28_Tax-HSN-Total-Migration.md)

---

## Document Overview

This document covers the creation of the InvoiceLineItem model with core fields including product references, descriptions, quantity, pricing, and line-level discounts.

### Tasks in This Document
| Task # | Task Name | Complexity |
|--------|-----------|------------|
| 19 | Create InvoiceLineItem Model | Medium |
| 20 | Add Line Item Product Reference | Medium |
| 21 | Add Line Item Description Fields | Medium |
| 22 | Add Line Item Quantity Fields | Medium |
| 23 | Add Line Item Pricing Fields | Medium |
| 24 | Add Line Item Discount Fields | Medium |

---

## Task 19: Create InvoiceLineItem Model

### Overview
Create the InvoiceLineItem model to store individual line items on an invoice, with foreign key relationship to Invoice and position ordering.

### Dependencies
- Group A: Invoice model must be complete
- Phase 04: Product model must exist

### Instructions

1. **Create invoice_line_item.py in models directory**
   - Navigate to apps/invoices/models/
   - Create file named `invoice_line_item.py`
   - Import necessary Django modules

2. **Import required dependencies**
   - Import Django models module
   - Import UUID for primary key
   - Import Invoice model from same app
   - Import tenant-aware base model if applicable

3. **Create InvoiceLineItem model class**
   - Inherit from appropriate base model
   - Add class docstring explaining purpose
   - Note that this represents itemized charges

4. **Add id field**
   - Use UUIDField as primary key
   - Set default to uuid.uuid4
   - Set editable=False
   - Provides globally unique line item identifiers

5. **Add invoice foreign key field**
   - Use ForeignKey to Invoice model
   - Set on_delete=models.CASCADE (delete lines when invoice deleted)
   - Set related_name='line_items'
   - Add db_index=True for query performance
   - Add help_text: "Invoice this line item belongs to"

6. **Add position field**
   - Use PositiveIntegerField
   - Purpose: Display order of line items
   - Set default=0
   - Add help_text: "Display position/order of line item"
   - Allow manual reordering

7. **Add created_at and updated_at fields**
   - Use DateTimeField with auto_now_add and auto_now
   - Track line item creation and modification

8. **Add __str__ method**
   - Return meaningful representation
   - Example: "Line 1: Product Name × 5"
   - Include position and description

9. **Add Meta class**
   - Set db_table name
   - Set verbose names
   - Add ordering by position
   - Add unique_together constraint on invoice + position if needed

### Model Structure
```python
import uuid
from django.db import models
from apps.invoices.models import Invoice

class InvoiceLineItem(models.Model):
    """
    Line item representing individual products or services on an invoice.
    Supports product references or custom descriptions for flexible invoicing.
    """
    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False
    )
    invoice = models.ForeignKey(
        Invoice,
        on_delete=models.CASCADE,
        related_name='line_items',
        db_index=True,
        help_text="Invoice this line item belongs to"
    )
    position = models.PositiveIntegerField(
        default=0,
        help_text="Display position/order of line item"
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'invoice_line_items'
        verbose_name = 'Invoice Line Item'
        verbose_name_plural = 'Invoice Line Items'
        ordering = ['position']
    
    def __str__(self):
        return f"Line {self.position}: {self.description or 'Item'}"
```

### Line Item Relationship
```
Invoice (INV-2026-00001)
├── LineItem 1 (position=1)
├── LineItem 2 (position=2)
├── LineItem 3 (position=3)
└── LineItem 4 (position=4)
```

### Cascade Delete Behavior
```
Invoice Deleted
       │
       ▼
All LineItems Automatically Deleted
       │
       ├─ LineItem 1 (deleted)
       ├─ LineItem 2 (deleted)
       ├─ LineItem 3 (deleted)
       └─ LineItem 4 (deleted)
```

### Position Management
- Position determines display order on invoice
- Position 1 appears first, position 2 second, etc.
- Gaps in position numbers are allowed (1, 2, 5, 10)
- Can be reordered by updating position values
- Useful for drag-and-drop reordering in UI

### Verification Checklist
- [ ] invoice_line_item.py file created in models/
- [ ] InvoiceLineItem model class defined
- [ ] id field is UUID primary key
- [ ] invoice ForeignKey with CASCADE delete
- [ ] position field for ordering
- [ ] created_at and updated_at fields present
- [ ] __str__ method returns meaningful representation
- [ ] Meta class defines table name and ordering
- [ ] related_name='line_items' on invoice FK

---

## Task 20: Add Line Item Product Reference

### Overview
Add fields to link line items to Product and ProductVariant models, allowing for proper inventory tracking while supporting custom line items.

### Dependencies
- Task 19: Create InvoiceLineItem Model
- Product and ProductVariant models from Phase 04

### Instructions

1. **Open invoice_line_item.py model file**
   - Navigate to apps/invoices/models/invoice_line_item.py
   - Locate InvoiceLineItem model class

2. **Import Product and ProductVariant models**
   - Add imports from products app
   - Example: `from apps.products.models import Product, ProductVariant`

3. **Add product foreign key field**
   - Use ForeignKey to Product model
   - Set on_delete=models.SET_NULL (preserve line if product deleted)
   - Set null=True, blank=True (allow custom line items without product)
   - Set related_name='invoice_line_items'
   - Add db_index=True
   - Add help_text: "Product reference (optional for custom items)"

4. **Add variant foreign key field**
   - Use ForeignKey to ProductVariant model
   - Set on_delete=models.SET_NULL
   - Set null=True, blank=True
   - Set related_name='invoice_line_items'
   - Add db_index=True
   - Add help_text: "Product variant reference (if applicable)"

5. **Add product_snapshot field**
   - Use JSONField
   - Purpose: Store product data at time of invoicing
   - Set default=dict
   - Set blank=True
   - Add help_text: "Product data snapshot at time of invoice"

### Product Reference Structure
```python
# Product Reference Fields
product = models.ForeignKey(
    'products.Product',
    on_delete=models.SET_NULL,
    null=True,
    blank=True,
    related_name='invoice_line_items',
    db_index=True,
    help_text="Product reference (optional for custom items)"
)
variant = models.ForeignKey(
    'products.ProductVariant',
    on_delete=models.SET_NULL,
    null=True,
    blank=True,
    related_name='invoice_line_items',
    db_index=True,
    help_text="Product variant reference (if applicable)"
)
product_snapshot = models.JSONField(
    default=dict,
    blank=True,
    help_text="Product data snapshot at time of invoice"
)
```

### Line Item Types

| Type | product | variant | Description | Use Case |
|------|---------|---------|-------------|----------|
| Product Line | ✓ | null | Standard product | Simple product |
| Variant Line | ✓ | ✓ | Product with variant | T-shirt (size L, red) |
| Custom Line | null | null | Custom description | Service, ad-hoc item |

### Product Snapshot Structure
```json
{
  "product_id": "uuid",
  "product_name": "Laptop Computer",
  "product_sku": "LAP-001",
  "variant_id": "uuid",
  "variant_name": "15-inch, 16GB RAM",
  "variant_sku": "LAP-001-15-16",
  "cost_price": 85000.00,
  "sale_price": 125000.00,
  "category": "Electronics",
  "brand": "Dell"
}
```

### Why Snapshot Product Data?
- **Historical Accuracy**: Product details may change after invoice creation
- **Data Independence**: Invoice valid even if product deleted
- **Audit Trail**: Shows exact product state at invoice time
- **Reporting**: Analyze what was actually sold
- **Legal Compliance**: Invoice reflects exact terms agreed upon

### Product Line Item Flow
```
Product Selection
       │
       ├─ Set product FK
       ├─ Set variant FK (if applicable)
       ├─ Copy product.name → description
       ├─ Copy product.sku → sku
       ├─ Copy variant.sale_price → unit_price
       ├─ Snapshot product data → product_snapshot
       └─ Calculate tax based on product.tax_category
```

### Custom Line Item Flow
```
Custom Item Entry
       │
       ├─ product = null
       ├─ variant = null
       ├─ Enter description manually
       ├─ Enter sku manually (optional)
       ├─ Enter unit_price manually
       └─ Set tax rate manually
```

### Verification Checklist
- [ ] product ForeignKey field is added
- [ ] variant ForeignKey field is added
- [ ] Both FKs have SET_NULL on_delete behavior
- [ ] Both FKs are optional (null=True, blank=True)
- [ ] product_snapshot JSONField is added
- [ ] db_index=True on both FK fields
- [ ] related_name='invoice_line_items' on both FKs
- [ ] Help text explains optional nature

---

## Task 21: Add Line Item Description Fields

### Overview
Add fields for line item text description and SKU, which can be populated from product or entered manually for custom items.

### Dependencies
- Task 20: Add Line Item Product Reference

### Instructions

1. **Open invoice_line_item.py model file**
   - Navigate to apps/invoices/models/invoice_line_item.py
   - Add description fields after product reference fields

2. **Add description field**
   - Use TextField
   - Purpose: Line item description appearing on invoice
   - Set blank=False (description is required)
   - Add help_text: "Line item description"
   - This is what customer sees on invoice

3. **Add sku field**
   - Use CharField with max_length=100
   - Purpose: Stock Keeping Unit or product code
   - Set blank=True, null=True (optional)
   - Add help_text: "Product SKU or code"
   - Used for internal reference and inventory tracking

### Description Fields Structure
```python
# Description Fields
description = models.TextField(
    help_text="Line item description appearing on invoice"
)
sku = models.CharField(
    max_length=100,
    blank=True,
    null=True,
    help_text="Product SKU or code"
)
```

### Description Field Usage

| Scenario | description Source | sku Source |
|----------|-------------------|------------|
| Product Line | product.name | product.sku |
| Variant Line | product.name + variant.name | variant.sku |
| Custom Line | Manual entry | Manual entry (optional) |
| Service Line | Manual entry | Service code (optional) |

### Example Line Item Descriptions
```
Product Line:
description: "Dell Latitude 5520 Laptop"
sku: "LAP-DEL-5520"

Variant Line:
description: "Cotton T-Shirt - Size L - Blue"
sku: "TSH-COT-L-BLU"

Custom Line:
description: "Installation and Setup Service"
sku: "SRV-INST-001"

Service Line:
description: "Consulting Services - 10 hours @ LKR 5,000/hour"
sku: null
```

### Description on Invoice
```
┌────────────────────────────────────────────────────────┐
│ # │ Description              │ SKU          │ Qty │ ... │
├───┼─────────────────────────┼──────────────┼─────┼────┤
│ 1 │ Dell Latitude 5520      │ LAP-DEL-5520 │ 2   │ ... │
│   │ Laptop                  │              │     │     │
├───┼─────────────────────────┼──────────────┼─────┼────┤
│ 2 │ Installation Service    │ SRV-INST-001 │ 1   │ ... │
├───┼─────────────────────────┼──────────────┼─────┼────┤
│ 3 │ Shipping and Handling   │              │ 1   │ ... │
└───┴─────────────────────────┴──────────────┴─────┴────┘
```

### Multi-Line Descriptions
- description is TextField, allowing multiple lines
- Can include:
  - Product name
  - Product specifications
  - Additional notes
  - Custom instructions

Example:
```
description:
"Dell Latitude 5520 Laptop
- Intel Core i7 Processor
- 16GB RAM, 512GB SSD
- 15.6\" Full HD Display
- Windows 11 Pro"
```

### Verification Checklist
- [ ] description TextField is added
- [ ] description is required (not null/blank)
- [ ] sku CharField is added
- [ ] sku is optional (blank=True, null=True)
- [ ] Help text explains purpose of each field
- [ ] description allows multi-line text

---

## Task 22: Add Line Item Quantity Fields

### Overview
Add fields for quantity and unit of measure to specify how much of an item is being invoiced.

### Dependencies
- Task 21: Add Line Item Description Fields

### Instructions

1. **Open invoice_line_item.py model file**
   - Navigate to apps/invoices/models/invoice_line_item.py
   - Add quantity fields after description fields

2. **Import Decimal**
   - Add `from decimal import Decimal` at top of file
   - Needed for quantity default value

3. **Add quantity field**
   - Use DecimalField with max_digits=10, decimal_places=3
   - Purpose: Quantity of items being invoiced
   - Set default=Decimal('1.000')
   - Add help_text: "Quantity of items"
   - Support fractional quantities (0.500 kg, 1.250 hours)

4. **Add unit_of_measure field**
   - Use CharField with max_length=20
   - Purpose: Unit for quantity (pcs, kg, hours, etc.)
   - Set default='pcs'
   - Set blank=True
   - Add help_text: "Unit of measure (pcs, kg, hours, etc.)"

5. **Add validation for quantity**
   - Note that quantity must be positive
   - Can be enforced in model clean() method or service layer
   - Zero or negative quantities should be rejected

### Quantity Fields Structure
```python
from decimal import Decimal

# Quantity Fields
quantity = models.DecimalField(
    max_digits=10,
    decimal_places=3,
    default=Decimal('1.000'),
    help_text="Quantity of items"
)
unit_of_measure = models.CharField(
    max_length=20,
    default='pcs',
    blank=True,
    help_text="Unit of measure (pcs, kg, hours, etc.)"
)
```

### Common Units of Measure

| Unit | Full Name | Used For | Decimals Needed |
|------|-----------|----------|-----------------|
| pcs | Pieces | Individual items | No (use .000) |
| kg | Kilograms | Weight-based items | Yes (0.500 kg) |
| g | Grams | Small weight items | Yes (250.500 g) |
| l | Liters | Volume/liquids | Yes (1.500 l) |
| m | Meters | Length | Yes (2.750 m) |
| m² | Square meters | Area | Yes (15.250 m²) |
| hrs | Hours | Time/services | Yes (2.500 hrs) |
| box | Box/carton | Packaged items | No |
| set | Set | Item sets | No |

### Quantity Examples
```
Product Line Items:
- 10.000 pcs × Laptop
- 2.500 kg × Coffee Beans
- 150.000 pcs × Screws
- 5.000 box × Paper (500 sheets/box)

Service Line Items:
- 8.500 hrs × Consulting Service
- 1.000 set × Installation Service
- 3.000 pcs × Training Session

Fractional Quantities:
- 0.500 kg × Premium Tea
- 0.250 l × Engine Oil
- 1.750 hrs × Design Work
```

### Quantity Precision
- **max_digits=10**: Supports up to 9,999,999.999
- **decimal_places=3**: Precision to 3 decimal places
- Supports fractional quantities for:
  - Weight-based products
  - Time-based services
  - Length/area measurements
  - Partial units

### Invoice Display
```
┌─────────────────────────────────────────────────┐
│ Description      │ Qty      │ Unit │ Rate │ ... │
├──────────────────┼──────────┼──────┼──────┼────┤
│ Laptop Computer  │ 10.000   │ pcs  │ 125k │ ... │
│ Coffee Beans     │ 2.500    │ kg   │ 1,200│ ... │
│ Consulting Svc   │ 8.500    │ hrs  │ 5,000│ ... │
│ Premium Tea      │ 0.500    │ kg   │ 3,500│ ... │
└──────────────────┴──────────┴──────┴──────┴────┘
```

### Quantity Validation
```python
def clean(self):
    """Validate line item data"""
    super().clean()
    
    if self.quantity <= 0:
        raise ValidationError({
            'quantity': 'Quantity must be greater than zero'
        })
```

### Verification Checklist
- [ ] quantity DecimalField is added
- [ ] Decimal is imported from decimal module
- [ ] quantity has max_digits=10, decimal_places=3
- [ ] quantity default is Decimal('1.000')
- [ ] unit_of_measure CharField is added
- [ ] unit_of_measure default is 'pcs'
- [ ] Help text explains purpose
- [ ] Supports fractional quantities

---

## Task 23: Add Line Item Pricing Fields

### Overview
Add fields for unit price and original price to support pricing and discount tracking at the line item level.

### Dependencies
- Task 22: Add Line Item Quantity Fields

### Instructions

1. **Open invoice_line_item.py model file**
   - Navigate to apps/invoices/models/invoice_line_item.py
   - Add pricing fields after quantity fields

2. **Add unit_price field**
   - Use DecimalField with max_digits=15, decimal_places=2
   - Purpose: Price per unit (current/final price after any product-level discounts)
   - Set default=Decimal('0.00')
   - Add help_text: "Price per unit"

3. **Add original_price field**
   - Use DecimalField with max_digits=15, decimal_places=2
   - Purpose: Original price before any discounts
   - Set blank=True, null=True
   - Add help_text: "Original price per unit (before discounts)"
   - Used to show strikethrough pricing

4. **Add note about price calculation**
   - Line subtotal = quantity × unit_price
   - If line-level discount exists, it applies to subtotal
   - Document calculation order in comments

### Pricing Fields Structure
```python
from decimal import Decimal

# Pricing Fields
unit_price = models.DecimalField(
    max_digits=15,
    decimal_places=2,
    default=Decimal('0.00'),
    help_text="Price per unit"
)
original_price = models.DecimalField(
    max_digits=15,
    decimal_places=2,
    blank=True,
    null=True,
    help_text="Original price per unit (before discounts)"
)
```

### Price Field Usage

| Scenario | unit_price | original_price | Display |
|----------|-----------|----------------|---------|
| No Discount | LKR 1,000 | null | LKR 1,000 |
| Product Discount | LKR 900 | LKR 1,000 | ~~LKR 1,000~~ LKR 900 |
| Sale Price | LKR 850 | LKR 1,000 | ~~LKR 1,000~~ LKR 850 |
| Custom Price | LKR 1,200 | null | LKR 1,200 |

### Pricing Examples
```
Standard Pricing:
unit_price: 125,000.00
original_price: null
Display: "LKR 125,000 per unit"

Discounted Pricing:
unit_price: 112,500.00
original_price: 125,000.00
Display: "LKR 125,000 112,500 per unit (10% off)"

Promotional Pricing:
unit_price: 99,900.00
original_price: 125,000.00
Display: "LKR 125,000 99,900 per unit (Save LKR 25,100!)"
```

### Line Total Calculation (Before Line Discount)
```python
line_subtotal = quantity * unit_price

# Example:
quantity = 10
unit_price = 125,000.00
line_subtotal = 10 × 125,000.00 = 1,250,000.00
```

### Price Precision
- **max_digits=15**: Supports prices up to 999,999,999,999.99
- **decimal_places=2**: Standard currency precision
- Use Decimal type to avoid floating-point errors
- Store all prices in base currency (LKR)

### Multi-Currency Consideration
- Prices stored in invoice currency
- unit_price in invoice.currency
- Convert to LKR using invoice.exchange_rate for reporting
- Display using invoice.currency_symbol

### Invoice Display with Original Price
```
┌───────────────────────────────────────────────────────┐
│ Description  │ Qty │ Unit Price        │ Amount      │
├──────────────┼─────┼───────────────────┼─────────────┤
│ Laptop       │ 10  │ LKR 112,500.00    │1,125,000.00 │
│              │     │ (was 125,000.00)  │             │
├──────────────┼─────┼───────────────────┼─────────────┤
│ Mouse        │ 10  │ LKR 1,500.00      │   15,000.00 │
└──────────────┴─────┴───────────────────┴─────────────┘
```

### Verification Checklist
- [ ] unit_price DecimalField is added
- [ ] unit_price has max_digits=15, decimal_places=2
- [ ] unit_price default is Decimal('0.00')
- [ ] original_price DecimalField is added
- [ ] original_price is optional (blank=True, null=True)
- [ ] original_price has same precision as unit_price
- [ ] Help text explains purpose of each field
- [ ] Decimal type used for defaults

---

## Task 24: Add Line Item Discount Fields

### Overview
Add fields to support line-level discounts, including discount type (percentage or fixed), discount value, and calculated discount amount.

### Dependencies
- Task 23: Add Line Item Pricing Fields

### Instructions

1. **Open invoice_line_item.py model file**
   - Navigate to apps/invoices/models/invoice_line_item.py
   - Add discount fields after pricing fields

2. **Add discount_type field**
   - Use CharField with max_length=20
   - Choices: PERCENTAGE, FIXED, NONE
   - Set default='NONE'
   - Add help_text: "Type of line-level discount"

3. **Add discount_value field**
   - Use DecimalField with max_digits=10, decimal_places=2
   - Purpose: Discount percentage or fixed amount
   - Set default=Decimal('0.00')
   - Add help_text: "Discount value (percentage or fixed amount)"
   - For PERCENTAGE: 10 means 10%
   - For FIXED: actual discount amount

4. **Add discount_amount field**
   - Use DecimalField with max_digits=15, decimal_places=2
   - Purpose: Calculated discount in currency
   - Set default=Decimal('0.00')
   - Add help_text: "Calculated discount amount"
   - Auto-calculated by service layer

5. **Create DiscountType choices**
   - Add to constants.py or define in model file
   - NONE: No discount
   - PERCENTAGE: Percentage-based discount
   - FIXED: Fixed amount discount

### Discount Fields Structure
```python
from decimal import Decimal

# Discount Type Choices
class DiscountType(models.TextChoices):
    NONE = 'NONE', 'No Discount'
    PERCENTAGE = 'PERCENTAGE', 'Percentage'
    FIXED = 'FIXED', 'Fixed Amount'

# Discount Fields
discount_type = models.CharField(
    max_length=20,
    choices=DiscountType.choices,
    default=DiscountType.NONE,
    help_text="Type of line-level discount"
)
discount_value = models.DecimalField(
    max_digits=10,
    decimal_places=2,
    default=Decimal('0.00'),
    help_text="Discount value (percentage or fixed amount)"
)
discount_amount = models.DecimalField(
    max_digits=15,
    decimal_places=2,
    default=Decimal('0.00'),
    help_text="Calculated discount amount in currency"
)
```

### Discount Calculation

**No Discount:**
```python
discount_type = 'NONE'
discount_value = 0.00
discount_amount = 0.00
line_total = quantity × unit_price - 0 = quantity × unit_price
```

**Percentage Discount:**
```python
discount_type = 'PERCENTAGE'
discount_value = 10.00  # 10%
line_subtotal = quantity × unit_price
discount_amount = line_subtotal × (discount_value / 100)
line_total = line_subtotal - discount_amount

# Example:
# quantity = 10, unit_price = 125,000
# line_subtotal = 1,250,000
# discount_amount = 1,250,000 × 0.10 = 125,000
# line_total = 1,250,000 - 125,000 = 1,125,000
```

**Fixed Discount:**
```python
discount_type = 'FIXED'
discount_value = 50,000.00  # Fixed LKR 50,000 discount
discount_amount = discount_value
line_total = (quantity × unit_price) - discount_amount

# Example:
# quantity = 10, unit_price = 125,000
# line_subtotal = 1,250,000
# discount_amount = 50,000
# line_total = 1,250,000 - 50,000 = 1,200,000
```

### Discount Examples

| Scenario | Type | Value | Qty | Unit Price | Subtotal | Discount Amt | Line Total |
|----------|------|-------|-----|------------|----------|--------------|------------|
| No Discount | NONE | 0 | 10 | 5,000 | 50,000 | 0 | 50,000 |
| 10% Discount | PERCENTAGE | 10 | 10 | 5,000 | 50,000 | 5,000 | 45,000 |
| Bulk Discount | PERCENTAGE | 15 | 100 | 1,000 | 100,000 | 15,000 | 85,000 |
| Fixed Discount | FIXED | 2,000 | 5 | 10,000 | 50,000 | 2,000 | 48,000 |

### Invoice Display with Line Discount
```
┌────────────────────────────────────────────────────────────┐
│ Description   │ Qty │ Unit Price │ Discount │ Amount      │
├───────────────┼─────┼────────────┼──────────┼─────────────┤
│ Laptop        │ 10  │ 125,000.00 │ 10%      │ 1,125,000.00│
│               │     │            │ -125,000 │             │
├───────────────┼─────┼────────────┼──────────┼─────────────┤
│ Mouse         │ 10  │ 1,500.00   │ -        │    15,000.00│
├───────────────┼─────┼────────────┼──────────┼─────────────┤
│ Keyboard      │ 5   │ 3,000.00   │ 1,000    │    14,000.00│
│               │     │            │ Fixed    │             │
└───────────────┴─────┴────────────┴──────────┴─────────────┘
```

### Discount vs Original Price
- **original_price**: Product-level discount (sale price)
- **discount_**: Line-level discount (bulk discount, special offer)
- Both can be applied together:

```
Product has sale price:
original_price: 125,000
unit_price: 112,500 (10% product discount)

Add line discount (5% bulk discount):
quantity: 10
line_subtotal: 10 × 112,500 = 1,125,000
discount_type: PERCENTAGE
discount_value: 5.00
discount_amount: 1,125,000 × 0.05 = 56,250
line_total: 1,125,000 - 56,250 = 1,068,750
```

### Discount Validation
```python
def clean(self):
    """Validate discount fields"""
    super().clean()
    
    if self.discount_type == 'PERCENTAGE':
        if self.discount_value < 0 or self.discount_value > 100:
            raise ValidationError({
                'discount_value': 'Percentage must be between 0 and 100'
            })
    
    if self.discount_type == 'FIXED':
        line_subtotal = self.quantity * self.unit_price
        if self.discount_value > line_subtotal:
            raise ValidationError({
                'discount_value': 'Fixed discount cannot exceed line subtotal'
            })
```

### Verification Checklist
- [ ] DiscountType choices are defined
- [ ] discount_type CharField is added
- [ ] discount_type uses DiscountType.choices
- [ ] discount_type default is NONE
- [ ] discount_value DecimalField is added
- [ ] discount_value default is Decimal('0.00')
- [ ] discount_amount DecimalField is added
- [ ] discount_amount default is Decimal('0.00')
- [ ] Help text explains each field's purpose
- [ ] Comments document calculation formulas

---

## Summary

### Tasks Completed in This Document
| Task # | Task Name | Key Deliverable |
|--------|-----------|-----------------|
| 19 | Create InvoiceLineItem Model | Model with invoice FK and position |
| 20 | Add Line Item Product Reference | Product and variant FKs with snapshot |
| 21 | Add Line Item Description Fields | Description and SKU fields |
| 22 | Add Line Item Quantity Fields | Quantity with UOM support |
| 23 | Add Line Item Pricing Fields | Unit price and original price |
| 24 | Add Line Item Discount Fields | Line-level discount support |

### Current InvoiceLineItem Model Structure
```python
InvoiceLineItem Model:
├── Core Fields (Task 19)
│   ├── id (UUID, PK)
│   ├── invoice (FK)
│   ├── position
│   ├── created_at
│   └── updated_at
├── Product Reference (Task 20)
│   ├── product (FK)
│   ├── variant (FK)
│   └── product_snapshot (JSON)
├── Description (Task 21)
│   ├── description
│   └── sku
├── Quantity (Task 22)
│   ├── quantity
│   └── unit_of_measure
├── Pricing (Task 23)
│   ├── unit_price
│   └── original_price
└── Discount (Task 24)
    ├── discount_type
    ├── discount_value
    └── discount_amount
```

### Next Steps
Proceed to [02_Tasks-25-28_Tax-HSN-Total-Migration.md](02_Tasks-25-28_Tax-HSN-Total-Migration.md) to add:
- Tax fields (tax_rate, tax_amount, is_taxable)
- HSN/SAC code for product classification
- Line total calculation field
- InvoiceLineItem migrations

---

## Notes for AI Agents

1. **Cascade Delete**: LineItems deleted when Invoice deleted
2. **Optional Product FK**: Supports custom line items without product reference
3. **Decimal Precision**: 3 decimals for quantity, 2 for prices
4. **Snapshot Pattern**: product_snapshot preserves product data at invoice time
5. **Discount Calculation**: Applied after quantity × unit_price
6. **No Migrations Yet**: Wait until Task 28 after all fields added
