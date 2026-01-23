# Tasks 26-31: Cart Items Model

> **Phase:** 05 - ERP Core Modules Part 2  
> **SubPhase:** 01 - POS Terminal Core  
> **Group:** B - Cart & Line Item Management  
> **Document:** 02 of 03  
> **Tasks Covered:** 26, 27, 28, 29, 30, 31

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [01_Tasks-19-25_Cart-Submodule-Model.md](01_Tasks-19-25_Cart-Submodule-Model.md)
- **→ Next Document:** [03_Tasks-32-38_Cart-Service-Operations.md](03_Tasks-32-38_Cart-Service-Operations.md)

---

## Document Overview

This document covers the creation of the POSCartItem model and related fields. Cart items represent individual line items in a shopping cart, storing product details, quantities, pricing, discounts, and tax calculations.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 26 | Add notes field | Low | 10 min |
| 27 | Create POSCartItem model | Medium | 30 min |
| 28 | Add item quantity field | Low | 15 min |
| 29 | Add item price fields | Medium | 20 min |
| 30 | Add item discount fields | Medium | 20 min |
| 31 | Add item tax fields | Low | 15 min |

**Total Estimated Time:** 1 hour 50 minutes

---

## Task 26: Add Notes Field

### Overview
Add a notes field to the POSCart model for storing special instructions, customer requests, or internal comments about the cart. This field supports order customization and communication.

### Dependencies
- Task 25: Cart discount fields completed
- POSCart model exists

### Purpose
Notes field enables:
- Customer special requests
- Delivery instructions
- Gift messages
- Internal staff notes
- Order customization details

### Instructions

1. **Open pos_cart.py**
   - Navigate to `apps/pos/cart/models/pos_cart.py`
   - Locate the POSCart model class

2. **Add notes field**
   - Field name: `notes`
   - Type: TextField
   - blank: True (optional field)
   - default: '' (empty string)
   - help_text: "Special instructions or notes for this cart"

3. **Position in model**
   - Add after discount fields
   - Before Meta class
   - Logical grouping with cart metadata

4. **Add character limit consideration**
   - While TextField has no max_length
   - Consider validation for reasonable length
   - Suggest 1000-2000 character limit in validation

5. **Add notes display property**
   - Property: `has_notes`
   - Returns: Boolean
   - Checks if notes field is not empty

6. **Add notes preview property**
   - Property: `notes_preview`
   - Returns: First 50 characters of notes + "..."
   - Used for list displays

### Notes Field Use Cases

```
┌────────────────────────────────────────────────┐
│              Notes Field Examples               │
└────────────────────────────────────────────────┘

Customer Requests:
  "Please deliver between 2-4 PM"
  "Gift wrap requested - birthday celebration"
  "Leave package with security guard"

Customization:
  "Extra spicy - customer request"
  "No onions in burger"
  "Allergic to nuts - verify ingredients"

Internal Notes:
  "VIP customer - priority handling"
  "Partial payment received - ₨500"
  "Manager approval for discount"

Special Instructions:
  "Assembly required - customer notified"
  "Fragile items - handle with care"
  "Include invoice copy"
```

### Implementation Pattern

```python
class POSCart(TenantAwareModel, TimestampedModel):
    # ... existing fields ...
    
    # Discount fields
    cart_discount_type = models.CharField(...)
    cart_discount_value = models.DecimalField(...)
    coupon_code = models.CharField(...)
    
    # Notes field - NEW
    notes = models.TextField(
        blank=True,
        default='',
        help_text="Special instructions or notes for this cart"
    )
    
    # ... Meta class, methods ...
    
    @property
    def has_notes(self):
        """Check if cart has notes"""
        return bool(self.notes and self.notes.strip())
    
    @property
    def notes_preview(self):
        """Return preview of notes for display"""
        if not self.notes:
            return ""
        if len(self.notes) <= 50:
            return self.notes
        return f"{self.notes[:50]}..."
```

### Validation Considerations

```python
def clean(self):
    """Validate cart fields"""
    super().clean()
    
    # ... existing validations ...
    
    # Validate notes length
    if self.notes and len(self.notes) > 2000:
        raise ValidationError({
            'notes': 'Notes cannot exceed 2000 characters'
        })
```

### Display Properties

| Property | Returns | Purpose |
|----------|---------|---------|
| **has_notes** | Boolean | Quick check if notes exist |
| **notes_preview** | String | Short preview for lists |
| **notes** | String | Full notes content |

### Business Rules

1. **Optional Field**
   - Notes are completely optional
   - Empty string default
   - Not required for cart creation

2. **Character Limit**
   - Recommended max: 2000 characters
   - Enforced in clean method
   - Prevents database bloat

3. **Display**
   - Full notes in detail view
   - Preview in list view
   - Truncate long notes appropriately

4. **Security**
   - Sanitize input to prevent XSS
   - Validate content if needed
   - Store as plain text (not HTML)

### Expected Outcome
```python
# POSCart model now includes:
notes = models.TextField(
    blank=True,
    default='',
    help_text="Special instructions or notes"
)

@property
def has_notes(self):
    return bool(self.notes and self.notes.strip())

@property
def notes_preview(self):
    if not self.notes:
        return ""
    if len(self.notes) <= 50:
        return self.notes
    return f"{self.notes[:50]}..."
```

### Verification Checklist
- [ ] notes field added to POSCart model
- [ ] Field type is TextField
- [ ] Field is optional (blank=True)
- [ ] Default value is empty string
- [ ] has_notes property implemented
- [ ] notes_preview property implemented
- [ ] Character limit validation added to clean method

---

## Task 27: Create POSCartItem Model

### Overview
Create the POSCartItem model to represent individual line items within a shopping cart. Each cart item links to a product (and optional variant), storing quantity, pricing, and line-specific details.

### Dependencies
- Task 26: Notes field added to POSCart
- POSCart model completed
- Product model exists (from Phase 04)
- ProductVariant model exists (from Phase 04)

### Purpose
POSCartItem model:
- Represents individual products in cart
- Links to product and variant
- Stores quantity and pricing
- Tracks line-level discounts
- Calculates line totals
- Supports product variants

### Instructions

1. **Create cart_item.py file**
   - Navigate to `apps/pos/cart/models/`
   - Create `cart_item.py` file
   - This will contain the POSCartItem model

2. **Import required dependencies**
   - Import Django model components
   - Import base models (TenantAwareModel, TimestampedModel)
   - Import POSCart from pos.cart.models
   - Import Product and ProductVariant from products app
   - Import Decimal for currency
   - Import validators

3. **Define POSCartItem model class**
   - Inherit from TenantAwareModel and TimestampedModel
   - Provides tenant isolation and timestamps
   - Ensures item is tenant-specific

4. **Add cart foreign key**
   - Field name: `cart`
   - Type: ForeignKey to POSCart
   - on_delete: CASCADE (items deleted when cart deleted)
   - related_name: `'items'`
   - db_index: True
   - help_text: "Cart this item belongs to"

5. **Add product foreign key**
   - Field name: `product`
   - Type: ForeignKey to Product
   - on_delete: PROTECT (cannot delete product if in cart)
   - related_name: `'cart_items'`
   - db_index: True
   - help_text: "Product in this cart item"

6. **Add variant foreign key**
   - Field name: `variant`
   - Type: ForeignKey to ProductVariant
   - on_delete: PROTECT
   - null: True, blank: True (variant optional)
   - related_name: `'cart_items'`
   - help_text: "Product variant if applicable"

7. **Add line_number field**
   - Field name: `line_number`
   - Type: PositiveIntegerField
   - default: 0
   - help_text: "Line number in cart for ordering"
   - Used for display order

8. **Add Meta class**
   - Set db_table: `'pos_cart_items'`
   - Set verbose_name: `'POS Cart Item'`
   - Set verbose_name_plural: `'POS Cart Items'`
   - Set ordering: `['line_number', 'created_at']`
   - Add unique_together: (cart, line_number) if using line numbers
   - Add indexes for cart + product queries

9. **Add __str__ method**
   - Return formatted string with product name and quantity
   - Example: "2x Product Name (₨500.00)"
   - Include variant name if present

10. **Add product_display property**
    - Returns product name with variant
    - Format: "Product Name - Variant Name"
    - Just product name if no variant

11. **Add is_variant_item property**
    - Returns True if item has a variant
    - Used for variant-specific logic

12. **Update models __init__.py**
    - Import POSCartItem from cart_item module
    - Add to __all__ list
    - Makes POSCartItem available for imports

### Model Relationships

```
┌────────────────────────────────────────────────┐
│             POSCartItem Relationships           │
└────────────────────────────────────────────────┘

    ┌──────────┐
    │ POSCart  │
    └──────────┘
         │
         │ cart (FK)
         │ CASCADE
         ▼
    ┌──────────────┐
    │ POSCartItem  │
    └──────────────┘
         │    │
         │    └─────────────┐
         │                  │
         │ product (FK)     │ variant (FK, optional)
         │ PROTECT          │ PROTECT
         │                  │
         ▼                  ▼
    ┌─────────┐      ┌────────────────┐
    │ Product │      │ ProductVariant │
    └─────────┘      └────────────────┘
```

### Cart-Items Structure

```
POSCart (ID: 1, Reference: POS-2024-T01-000123)
    │
    ├── POSCartItem (Line 1)
    │   ├── Product: "Rice - Basmati 5kg"
    │   ├── Variant: None
    │   └── Quantity: 2
    │
    ├── POSCartItem (Line 2)
    │   ├── Product: "T-Shirt"
    │   ├── Variant: "Size: L, Color: Blue"
    │   └── Quantity: 1
    │
    └── POSCartItem (Line 3)
        ├── Product: "Milk - Fresh"
        ├── Variant: None
        └── Quantity: 3
```

### Model Fields Summary

| Field | Type | Purpose | Required |
|-------|------|---------|----------|
| **cart** | ForeignKey | Links to POSCart | Yes |
| **product** | ForeignKey | Links to Product | Yes |
| **variant** | ForeignKey | Links to ProductVariant | No |
| **line_number** | PositiveInteger | Display order | Yes |
| **created_at** | DateTime | From TimestampedModel | Auto |
| **updated_at** | DateTime | From TimestampedModel | Auto |
| **tenant** | ForeignKey | From TenantAwareModel | Auto |

### Implementation Pattern

```python
from django.db import models
from django.core.validators import MinValueValidator
from decimal import Decimal

from apps.core.models import TenantAwareModel, TimestampedModel
from apps.pos.cart.models import POSCart
from apps.products.models import Product, ProductVariant


class POSCartItem(TenantAwareModel, TimestampedModel):
    """Individual line item in a POS cart"""
    
    cart = models.ForeignKey(
        POSCart,
        on_delete=models.CASCADE,
        related_name='items',
        db_index=True,
        help_text="Cart this item belongs to"
    )
    
    product = models.ForeignKey(
        Product,
        on_delete=models.PROTECT,
        related_name='cart_items',
        db_index=True,
        help_text="Product in this cart item"
    )
    
    variant = models.ForeignKey(
        ProductVariant,
        on_delete=models.PROTECT,
        related_name='cart_items',
        null=True,
        blank=True,
        help_text="Product variant if applicable"
    )
    
    line_number = models.PositiveIntegerField(
        default=0,
        help_text="Line number for ordering"
    )
    
    class Meta:
        db_table = 'pos_cart_items'
        verbose_name = 'POS Cart Item'
        verbose_name_plural = 'POS Cart Items'
        ordering = ['line_number', 'created_at']
        indexes = [
            models.Index(fields=['cart', 'product']),
            models.Index(fields=['cart', 'line_number']),
        ]
    
    def __str__(self):
        product_name = self.product_display
        return f"{self.quantity}x {product_name}"
    
    @property
    def product_display(self):
        """Get product display name with variant"""
        if self.variant:
            return f"{self.product.name} - {self.variant.name}"
        return self.product.name
    
    @property
    def is_variant_item(self):
        """Check if item has a variant"""
        return self.variant is not None
```

### Business Rules

1. **Cart Linkage**
   - Every item must belong to a cart
   - Items inherit tenant from cart
   - Items deleted when cart deleted (CASCADE)

2. **Product Reference**
   - Product cannot be deleted if in cart (PROTECT)
   - Product must exist and be active
   - Variant optional, depends on product type

3. **Variant Handling**
   - Simple products: variant = None
   - Variable products: variant required
   - Validate variant belongs to product

4. **Line Numbering**
   - Sequential line numbers for display
   - Auto-assigned or manually set
   - Used for receipt printing order

5. **Tenant Isolation**
   - Item inherits tenant from cart
   - Product must belong to same tenant
   - Enforced at creation

### Delete Protection

```
Scenario: Attempting to delete a product in a cart

Product (ID: 123)
    │
    ├── CartItem 1 (Cart: POS-001) ← EXISTS
    │
    └── CartItem 2 (Cart: POS-002) ← EXISTS

Action: Delete Product
Result: ❌ ProtectedError
Reason: Product referenced by cart items

Solution:
1. Remove items from carts first
2. Then delete product
```

### Expected Outcome
```python
# apps/pos/cart/models/cart_item.py
class POSCartItem(TenantAwareModel, TimestampedModel):
    """Individual line item in a POS cart"""
    
    cart = models.ForeignKey(POSCart, ...)
    product = models.ForeignKey(Product, ...)
    variant = models.ForeignKey(ProductVariant, ...)
    line_number = models.PositiveIntegerField(...)
    
    class Meta:
        db_table = 'pos_cart_items'
        ordering = ['line_number', 'created_at']
    
    def __str__(self):
        return f"{self.quantity}x {self.product_display}"
    
    @property
    def product_display(self):
        # Implementation
        pass
```

### Verification Checklist
- [ ] `cart_item.py` file created
- [ ] POSCartItem model class defined
- [ ] Inherits from TenantAwareModel and TimestampedModel
- [ ] cart ForeignKey with CASCADE
- [ ] product ForeignKey with PROTECT
- [ ] variant ForeignKey with PROTECT (nullable)
- [ ] line_number field added
- [ ] Meta class configured
- [ ] __str__ method implemented
- [ ] product_display property added
- [ ] is_variant_item property added
- [ ] Model imported in `models/__init__.py`

---

## Task 28: Add Item Quantity Field

### Overview
Add quantity field to the POSCartItem model to track the number of units of each product in the cart. Include validation to ensure positive quantities and reasonable limits.

### Dependencies
- Task 27: POSCartItem model created

### Purpose
Quantity field enables:
- Multiple units per line item
- Stock validation
- Accurate pricing calculation
- Inventory tracking
- Quantity-based discounts

### Instructions

1. **Open cart_item.py**
   - Navigate to `apps/pos/cart/models/cart_item.py`
   - Locate POSCartItem model class

2. **Add quantity field**
   - Field name: `quantity`
   - Type: DecimalField (allows fractional quantities)
   - max_digits: 10
   - decimal_places: 3 (supports fractional units)
   - default: Decimal('1.000')
   - validators: MinValueValidator(Decimal('0.001'))
   - help_text: "Quantity of product"

3. **Add quantity validation**
   - Add to clean method
   - Ensure quantity > 0
   - Check against reasonable maximum (e.g., 9999)
   - Validate against product UOM (Unit of Measure)

4. **Add MAX_QUANTITY constant**
   - In constants.py or at model level
   - MAX_CART_ITEM_QUANTITY = 9999.999
   - Used for validation

5. **Add quantity display property**
   - Property: `formatted_quantity`
   - Format appropriately for UOM
   - Remove trailing zeros for whole numbers
   - Example: "5" instead of "5.000"

6. **Add quantity change method**
   - Method: `update_quantity(new_quantity)`
   - Validates new quantity
   - Updates quantity field
   - Triggers total recalculation
   - Returns True/False for success

7. **Add stock validation hook**
   - Method: `validate_stock_availability()`
   - Check product stock level
   - Compare with requested quantity
   - Return True if available, False otherwise
   - Will integrate with inventory in later phase

### Quantity Field Types

```
┌────────────────────────────────────────────────┐
│           Quantity Field Scenarios              │
└────────────────────────────────────────────────┘

Whole Units (Most Common):
  ┌──────────────────────────┐
  │ Product: T-Shirt         │
  │ Quantity: 5.000          │
  │ Display: "5"             │
  │ UOM: Pieces              │
  └──────────────────────────┘

Fractional Units:
  ┌──────────────────────────┐
  │ Product: Fabric          │
  │ Quantity: 2.500          │
  │ Display: "2.5"           │
  │ UOM: Meters              │
  └──────────────────────────┘

Weight-Based:
  ┌──────────────────────────┐
  │ Product: Rice            │
  │ Quantity: 0.750          │
  │ Display: "0.75"          │
  │ UOM: Kilograms           │
  └──────────────────────────┘
```

### Quantity Validation Flow

```
┌────────────────────────────────────────────────┐
│          Quantity Validation Flow               │
└────────────────────────────────────────────────┘

[Update Quantity Request]
         │
         ▼
    [Validate > 0?]
         │
         ├── No ──► [Error: Quantity must be positive]
         │
         └── Yes
              │
              ▼
    [Validate <= MAX?]
         │
         ├── No ──► [Error: Quantity exceeds maximum]
         │
         └── Yes
              │
              ▼
    [Check Stock Availability]
         │
         ├── Insufficient ──► [Error: Insufficient stock]
         │
         └── Available
              │
              ▼
    [Update Quantity]
         │
         ▼
    [Recalculate Line Total]
         │
         ▼
    [Recalculate Cart Totals]
```

### Implementation Pattern

```python
from decimal import Decimal
from django.core.validators import MinValueValidator
from django.core.exceptions import ValidationError

class POSCartItem(TenantAwareModel, TimestampedModel):
    # ... existing fields ...
    
    quantity = models.DecimalField(
        max_digits=10,
        decimal_places=3,
        default=Decimal('1.000'),
        validators=[MinValueValidator(Decimal('0.001'))],
        help_text="Quantity of product"
    )
    
    # ... other fields ...
    
    def clean(self):
        """Validate cart item fields"""
        super().clean()
        
        # Validate quantity
        if self.quantity <= 0:
            raise ValidationError({
                'quantity': 'Quantity must be greater than zero'
            })
        
        if self.quantity > Decimal('9999.999'):
            raise ValidationError({
                'quantity': 'Quantity exceeds maximum allowed'
            })
    
    @property
    def formatted_quantity(self):
        """Format quantity for display"""
        # Remove trailing zeros
        qty = self.quantity.normalize()
        return str(qty)
    
    def update_quantity(self, new_quantity):
        """Update item quantity with validation"""
        try:
            new_quantity = Decimal(str(new_quantity))
        except (ValueError, TypeError):
            return False
        
        if new_quantity <= 0:
            return False
        
        if new_quantity > Decimal('9999.999'):
            return False
        
        # Check stock availability
        if not self.validate_stock_availability(new_quantity):
            return False
        
        self.quantity = new_quantity
        self.save()
        
        # Trigger cart total recalculation
        self.cart.recalculate_totals()
        
        return True
    
    def validate_stock_availability(self, quantity=None):
        """Validate if requested quantity is available in stock"""
        check_qty = quantity if quantity is not None else self.quantity
        
        # Get stock level from product/variant
        if self.variant:
            available_stock = self.variant.stock_quantity
        else:
            available_stock = self.product.stock_quantity
        
        # Check availability
        return available_stock >= check_qty
```

### Quantity Field Specifications

| Aspect | Specification | Rationale |
|--------|--------------|-----------|
| **Type** | DecimalField | Precise fractional quantities |
| **Max Digits** | 10 | Support large quantities |
| **Decimal Places** | 3 | Support 0.001 precision |
| **Min Value** | 0.001 | At least minimal unit |
| **Max Value** | 9999.999 | Reasonable upper limit |
| **Default** | 1.000 | Single unit default |

### Quantity Display Examples

```python
# Display formatting examples

Quantity: Decimal('5.000')
Formatted: "5"  # Remove trailing zeros

Quantity: Decimal('2.500')
Formatted: "2.5"  # Show necessary decimals

Quantity: Decimal('0.750')
Formatted: "0.75"  # Show fractional part

Quantity: Decimal('123.456')
Formatted: "123.456"  # Show all precision
```

### Business Rules

1. **Minimum Quantity**
   - Must be greater than 0
   - Minimum: 0.001 (for fractional items)
   - Zero quantity not allowed

2. **Maximum Quantity**
   - Practical limit: 9999.999
   - Prevents data entry errors
   - Reasonable for retail transactions

3. **Fractional Support**
   - 3 decimal places precision
   - Supports weight-based items
   - Supports length-based items
   - Supports bulk items

4. **Stock Validation**
   - Check availability on add/update
   - Prevent overselling
   - Real-time stock checks
   - Graceful error handling

5. **Display Formatting**
   - Remove unnecessary trailing zeros
   - Show decimals only when needed
   - Format according to UOM

### Quantity Update Scenarios

```
Scenario 1: Increase Quantity
Initial: 2 units
Update: 5 units
Actions:
  - Validate new quantity > 0
  - Check stock: 5 units available
  - Update quantity field
  - Recalculate line total
  - Recalculate cart totals
Result: ✅ Success

Scenario 2: Fractional Quantity
Product: Fabric (measured in meters)
Update: 2.5 meters
Actions:
  - Accept decimal input
  - Validate > 0
  - Check stock availability
  - Update and recalculate
Result: ✅ Success

Scenario 3: Insufficient Stock
Current: 1 unit
Update: 10 units
Stock Available: 5 units
Actions:
  - Validate new quantity
  - Check stock: Only 5 available
  - Reject update
Result: ❌ Error: Insufficient stock

Scenario 4: Invalid Quantity
Update: 0 units
Actions:
  - Validate > 0
  - Fails validation
Result: ❌ Error: Invalid quantity
```

### Expected Outcome
```python
# POSCartItem model now includes:
quantity = models.DecimalField(
    max_digits=10,
    decimal_places=3,
    default=Decimal('1.000'),
    validators=[MinValueValidator(Decimal('0.001'))],
    help_text="Quantity of product"
)

@property
def formatted_quantity(self):
    return str(self.quantity.normalize())

def update_quantity(self, new_quantity):
    # Implementation
    pass

def validate_stock_availability(self, quantity=None):
    # Implementation
    pass
```

### Verification Checklist
- [ ] quantity field added to POSCartItem
- [ ] Field type is DecimalField
- [ ] max_digits=10, decimal_places=3
- [ ] Default value is Decimal('1.000')
- [ ] MinValueValidator added
- [ ] Validation in clean method
- [ ] MAX_QUANTITY constant defined
- [ ] formatted_quantity property added
- [ ] update_quantity method implemented
- [ ] validate_stock_availability method added
- [ ] Fractional quantities supported

---

## Task 29: Add Item Price Fields

### Overview
Add price fields to the POSCartItem model for tracking unit price, original price, and calculated line total. These fields store the pricing information at the time of cart creation, preserving transaction integrity.

### Dependencies
- Task 28: Quantity field added

### Purpose
Price fields enable:
- Accurate line total calculation
- Price history preservation
- Discount tracking
- Pricing at transaction time
- Financial reporting

### Instructions

1. **Open cart_item.py**
   - Navigate to `apps/pos/cart/models/cart_item.py`
   - Locate POSCartItem model class

2. **Add unit_price field**
   - Field name: `unit_price`
   - Type: DecimalField
   - max_digits: 12
   - decimal_places: 2
   - validators: MinValueValidator(Decimal('0.00'))
   - help_text: "Price per unit after line discount"
   - The actual selling price per unit

3. **Add original_price field**
   - Field name: `original_price`
   - Type: DecimalField
   - max_digits: 12
   - decimal_places: 2
   - validators: MinValueValidator(Decimal('0.00'))
   - help_text: "Original price per unit before discount"
   - Stores the base price

4. **Add line_total field**
   - Field name: `line_total`
   - Type: DecimalField
   - max_digits: 12
   - decimal_places: 2
   - default: Decimal('0.00')
   - validators: MinValueValidator(Decimal('0.00'))
   - help_text: "Total for this line (quantity × unit_price)"
   - Calculated and stored value

5. **Add price calculation method**
   - Method: `calculate_line_total()`
   - Formula: quantity × unit_price
   - Round to 2 decimal places
   - Update line_total field
   - Return calculated value

6. **Add price initialization method**
   - Method: `set_prices_from_product()`
   - Get price from product or variant
   - Set original_price
   - Set unit_price (initially same as original)
   - Called on cart item creation

7. **Add price display properties**
   - Property: `formatted_unit_price` returns "₨ 500.00"
   - Property: `formatted_line_total` returns "₨ 1,000.00"
   - Property: `price_difference` returns original_price - unit_price
   - Use Sri Lankan Rupee symbol

8. **Override save method**
   - Calculate line_total before save
   - Ensure prices are set
   - Trigger cart total recalculation if needed

9. **Add price validation**
   - Add to clean method
   - Validate unit_price > 0
   - Validate original_price >= unit_price
   - Validate line_total matches calculation

### Price Fields Relationship

```
┌────────────────────────────────────────────────┐
│             Price Fields Flow                   │
└────────────────────────────────────────────────┘

[Product/Variant]
      │
      │ Get selling price
      ▼
┌──────────────┐
│original_price│ = ₨500.00
└──────────────┘
      │
      │ Apply line discount (if any)
      ▼
┌──────────────┐
│  unit_price  │ = ₨450.00
└──────────────┘
      │
      │ × quantity (2)
      ▼
┌──────────────┐
│  line_total  │ = ₨900.00
└──────────────┘

Price Difference: ₨50.00 per unit
Total Discount: ₨100.00 for line
```

### Price Calculation Examples

```
Example 1: No Discount
Product: T-Shirt
Original Price: ₨1,500.00
Line Discount: None
Unit Price: ₨1,500.00
Quantity: 2
Line Total: ₨3,000.00

Example 2: With Discount
Product: Shoes
Original Price: ₨5,000.00
Line Discount: 10%
Unit Price: ₨4,500.00
Quantity: 1
Line Total: ₨4,500.00
Savings: ₨500.00

Example 3: Fractional Quantity
Product: Fabric
Original Price: ₨800.00 per meter
Line Discount: ₨50.00 off
Unit Price: ₨750.00
Quantity: 2.5 meters
Line Total: ₨1,875.00
```

### Implementation Pattern

```python
from decimal import Decimal, ROUND_HALF_UP
from django.core.validators import MinValueValidator

class POSCartItem(TenantAwareModel, TimestampedModel):
    # ... existing fields ...
    
    original_price = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        validators=[MinValueValidator(Decimal('0.00'))],
        help_text="Original price per unit before discount"
    )
    
    unit_price = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        validators=[MinValueValidator(Decimal('0.00'))],
        help_text="Price per unit after line discount"
    )
    
    line_total = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        default=Decimal('0.00'),
        validators=[MinValueValidator(Decimal('0.00'))],
        help_text="Total for this line"
    )
    
    def set_prices_from_product(self):
        """Initialize prices from product/variant"""
        if self.variant:
            price = self.variant.price
        else:
            price = self.product.price
        
        self.original_price = price
        self.unit_price = price
        self.calculate_line_total()
    
    def calculate_line_total(self):
        """Calculate and set line total"""
        if not self.unit_price or not self.quantity:
            self.line_total = Decimal('0.00')
            return self.line_total
        
        # Calculate: quantity × unit_price
        total = self.quantity * self.unit_price
        
        # Round to 2 decimal places
        self.line_total = total.quantize(
            Decimal('0.01'),
            rounding=ROUND_HALF_UP
        )
        
        return self.line_total
    
    def save(self, *args, **kwargs):
        """Override save to calculate line total"""
        # Ensure line total is calculated
        self.calculate_line_total()
        
        super().save(*args, **kwargs)
        
        # Trigger cart total recalculation
        if hasattr(self, 'cart'):
            self.cart.recalculate_totals()
    
    def clean(self):
        """Validate price fields"""
        super().clean()
        
        # Validate unit price
        if self.unit_price and self.unit_price < 0:
            raise ValidationError({
                'unit_price': 'Unit price cannot be negative'
            })
        
        # Validate original price >= unit price
        if self.original_price and self.unit_price:
            if self.original_price < self.unit_price:
                raise ValidationError({
                    'unit_price': 
                    'Unit price cannot exceed original price'
                })
    
    @property
    def formatted_unit_price(self):
        """Format unit price with currency symbol"""
        return f"₨ {self.unit_price:,.2f}"
    
    @property
    def formatted_line_total(self):
        """Format line total with currency symbol"""
        return f"₨ {self.line_total:,.2f}"
    
    @property
    def price_difference(self):
        """Calculate discount amount per unit"""
        return self.original_price - self.unit_price
    
    @property
    def total_discount_amount(self):
        """Calculate total discount for this line"""
        return self.price_difference * self.quantity
```

### Price Field Specifications

| Field | Max Digits | Decimals | Min Value | Purpose |
|-------|------------|----------|-----------|---------|
| **original_price** | 12 | 2 | 0.00 | Base price |
| **unit_price** | 12 | 2 | 0.00 | Selling price |
| **line_total** | 12 | 2 | 0.00 | Line amount |

### Price Calculation Formula

```
Line Total = Quantity × Unit Price

Where:
- Quantity: Number of units (can be fractional)
- Unit Price: Price per unit after line discount
- Result: Rounded to 2 decimal places

Example:
Quantity: 2.5
Unit Price: ₨750.00
Line Total: 2.5 × 750.00 = ₨1,875.00
```

### Business Rules

1. **Price Capture**
   - Prices captured at cart creation
   - Prices frozen for transaction
   - Not affected by future price changes
   - Preserves transaction integrity

2. **Price Hierarchy**
   - original_price: Base price
   - unit_price: After line discount
   - line_total: Final line amount
   - original_price >= unit_price always

3. **Calculation**
   - Always use Decimal for precision
   - Round to 2 decimal places
   - Use ROUND_HALF_UP rounding
   - Recalculate on quantity change

4. **Validation**
   - All prices must be non-negative
   - unit_price <= original_price
   - line_total = quantity × unit_price
   - Prevent negative totals

5. **Display**
   - Show Sri Lankan Rupee symbol (₨)
   - Use thousand separators
   - Always 2 decimal places
   - Format consistently

### Price Update Scenarios

```
Scenario 1: Price from Product
Product Price: ₨1,000.00
Action: Add to cart
Result:
  - original_price: ₨1,000.00
  - unit_price: ₨1,000.00
  - line_total: ₨1,000.00 (qty: 1)

Scenario 2: Apply Line Discount
Original: ₨1,000.00
Discount: 10%
Action: Apply discount
Result:
  - original_price: ₨1,000.00 (unchanged)
  - unit_price: ₨900.00 (discounted)
  - line_total: ₨900.00 (qty: 1)

Scenario 3: Update Quantity
Unit Price: ₨900.00
Quantity: 1 → 3
Action: Update quantity
Result:
  - original_price: ₨1,000.00
  - unit_price: ₨900.00
  - line_total: ₨2,700.00 (recalculated)

Scenario 4: Price Change After Add
Product Price: ₨1,000.00 → ₨1,200.00
Cart Item Price: ₨1,000.00
Action: Product price increases
Result:
  - Cart item price: ₨1,000.00 (unchanged)
  - Reason: Price frozen at cart creation
```

### Expected Outcome
```python
# POSCartItem model now includes:
original_price = models.DecimalField(...)
unit_price = models.DecimalField(...)
line_total = models.DecimalField(...)

def set_prices_from_product(self):
    # Implementation
    pass

def calculate_line_total(self):
    # Implementation
    pass

def save(self, *args, **kwargs):
    self.calculate_line_total()
    super().save(*args, **kwargs)
    self.cart.recalculate_totals()

@property
def formatted_unit_price(self):
    return f"₨ {self.unit_price:,.2f}"

@property
def price_difference(self):
    return self.original_price - self.unit_price
```

### Verification Checklist
- [ ] original_price field added
- [ ] unit_price field added
- [ ] line_total field added
- [ ] All fields use DecimalField(12, 2)
- [ ] MinValueValidator added to all price fields
- [ ] set_prices_from_product method implemented
- [ ] calculate_line_total method implemented
- [ ] save method overridden to calculate total
- [ ] Price validation in clean method
- [ ] formatted_unit_price property added
- [ ] formatted_line_total property added
- [ ] price_difference property added
- [ ] Decimal rounding implemented correctly

---

## Task 30: Add Item Discount Fields

### Overview
Add discount fields to the POSCartItem model for tracking line-level discounts. These discounts apply to individual cart items before cart-level discounts, providing flexibility for item-specific promotions.

### Dependencies
- Task 29: Price fields added

### Purpose
Line item discounts enable:
- Product-specific promotions
- Bundle deals
- Clearance pricing
- Manager overrides
- Loyalty discounts per item

### Instructions

1. **Open cart_item.py**
   - Navigate to `apps/pos/cart/models/cart_item.py`
   - Locate POSCartItem model class

2. **Verify discount type constants**
   - Ensure DISCOUNT_TYPE_PERCENT and DISCOUNT_TYPE_FIXED exist
   - In `apps/pos/constants.py`
   - Reuse same constants as cart discount

3. **Add discount_type field**
   - Field name: `discount_type`
   - Type: CharField
   - max_length: 10
   - choices: DISCOUNT_TYPE_CHOICES
   - null: True, blank: True
   - help_text: "Type of discount (PERCENT or FIXED)"

4. **Add discount_value field**
   - Field name: `discount_value`
   - Type: DecimalField
   - max_digits: 10
   - decimal_places: 2
   - null: True, blank: True
   - default: Decimal('0.00')
   - help_text: "Discount value (percentage or fixed amount)"

5. **Add discount_reason field**
   - Field name: `discount_reason`
   - Type: CharField
   - max_length: 200
   - null: True, blank: True
   - help_text: "Reason for applying discount"

6. **Add discount_amount field**
   - Field name: `discount_amount`
   - Type: DecimalField
   - max_digits: 12
   - decimal_places: 2
   - default: Decimal('0.00')
   - help_text: "Calculated discount amount per unit in currency"

7. **Add apply_discount method**
   - Method: `apply_discount(discount_type, discount_value, reason=None)`
   - Validates discount parameters
   - Calculates discount_amount
   - Updates unit_price from original_price
   - Recalculates line_total
   - Saves changes

8. **Add remove_discount method**
   - Method: `remove_discount()`
   - Resets discount fields to None/0
   - Restores unit_price to original_price
   - Recalculates line_total
   - Saves changes

9. **Add discount calculation method**
   - Method: `calculate_discount_amount()`
   - Based on discount_type and discount_value
   - PERCENT: original_price × (value / 100)
   - FIXED: value directly
   - Updates discount_amount field

10. **Add discount validation**
    - Add to clean method
    - If PERCENT: value must be 0-100
    - If FIXED: value must be <= original_price
    - Ensure unit_price >= 0 after discount

11. **Add discount display properties**
    - Property: `formatted_discount` returns "10% (₨50.00)"
    - Property: `has_discount` returns boolean
    - Property: `total_discount_for_line` returns discount × quantity

### Line Discount Types

```
┌────────────────────────────────────────────────┐
│          Line Item Discount Types               │
└────────────────────────────────────────────────┘

1. PERCENT Discount:
   ┌──────────────────────────────┐
   │ Original Price:  ₨1,000.00   │
   │ Discount:        10%          │
   │ Discount Amount: ₨100.00      │
   │ Unit Price:      ₨900.00      │
   │ Quantity:        2             │
   │ Line Total:      ₨1,800.00    │
   │ Total Savings:   ₨200.00      │
   └──────────────────────────────┘

2. FIXED Discount:
   ┌──────────────────────────────┐
   │ Original Price:  ₨1,000.00   │
   │ Discount:        ₨150.00      │
   │ Discount Amount: ₨150.00      │
   │ Unit Price:      ₨850.00      │
   │ Quantity:        2             │
   │ Line Total:      ₨1,700.00    │
   │ Total Savings:   ₨300.00      │
   └──────────────────────────────┘
```

### Discount Application Flow

```
┌────────────────────────────────────────────────┐
│        Line Discount Application                │
└────────────────────────────────────────────────┘

[Item Added to Cart]
         │
         ▼
   ┌──────────────┐
   │Original Price│ = ₨1,000.00
   └──────────────┘
         │
         ▼
   [Apply Discount?]
         │
    ┌────┴────┐
    │         │
 [No]      [Yes]
    │         │
    │         ▼
    │    [Discount Type?]
    │         │
    │    ┌────┴────┐
    │    │         │
    │    ▼         ▼
    │ [PERCENT] [FIXED]
    │    │         │
    │   10%      ₨150
    │    │         │
    │    ▼         ▼
    │  ₨100      ₨150
    │    │         │
    │    └────┬────┘
    │         │
    ▼         ▼
[Unit Price = Original Price]
    │         │
[₨1,000.00] [₨850.00 or ₨900.00]
    │         │
    └────┬────┘
         │
         ▼
   [Calculate Line Total]
   (Unit Price × Quantity)
```

### Implementation Pattern

```python
from decimal import Decimal, ROUND_HALF_UP
from django.core.exceptions import ValidationError
from apps.pos.constants import (
    DISCOUNT_TYPE_PERCENT,
    DISCOUNT_TYPE_FIXED,
    DISCOUNT_TYPE_CHOICES
)

class POSCartItem(TenantAwareModel, TimestampedModel):
    # ... existing fields ...
    
    discount_type = models.CharField(
        max_length=10,
        choices=DISCOUNT_TYPE_CHOICES,
        null=True,
        blank=True,
        help_text="Type of discount"
    )
    
    discount_value = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        null=True,
        blank=True,
        default=Decimal('0.00'),
        help_text="Discount value"
    )
    
    discount_reason = models.CharField(
        max_length=200,
        null=True,
        blank=True,
        help_text="Reason for discount"
    )
    
    discount_amount = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        default=Decimal('0.00'),
        help_text="Calculated discount amount"
    )
    
    def calculate_discount_amount(self):
        """Calculate discount amount based on type and value"""
        if not self.discount_type or not self.discount_value:
            self.discount_amount = Decimal('0.00')
            return self.discount_amount
        
        if self.discount_type == DISCOUNT_TYPE_PERCENT:
            # Calculate percentage of original price
            discount = self.original_price * (self.discount_value / 100)
        else:  # FIXED
            # Use fixed amount directly
            discount = self.discount_value
        
        # Round to 2 decimal places
        self.discount_amount = discount.quantize(
            Decimal('0.01'),
            rounding=ROUND_HALF_UP
        )
        
        return self.discount_amount
    
    def apply_discount(self, discount_type, discount_value, reason=None):
        """Apply discount to this cart item"""
        # Validate discount type
        if discount_type not in [DISCOUNT_TYPE_PERCENT, DISCOUNT_TYPE_FIXED]:
            raise ValueError("Invalid discount type")
        
        # Validate discount value
        if discount_type == DISCOUNT_TYPE_PERCENT:
            if not (0 <= discount_value <= 100):
                raise ValueError("Percentage must be between 0 and 100")
        else:  # FIXED
            if discount_value > self.original_price:
                raise ValueError("Discount exceeds original price")
        
        # Set discount fields
        self.discount_type = discount_type
        self.discount_value = discount_value
        self.discount_reason = reason
        
        # Calculate discount amount
        self.calculate_discount_amount()
        
        # Update unit price
        self.unit_price = self.original_price - self.discount_amount
        
        # Recalculate line total
        self.calculate_line_total()
        
        # Save changes
        self.save()
        
        return self.discount_amount
    
    def remove_discount(self):
        """Remove discount from this cart item"""
        # Reset discount fields
        self.discount_type = None
        self.discount_value = Decimal('0.00')
        self.discount_reason = None
        self.discount_amount = Decimal('0.00')
        
        # Restore unit price to original
        self.unit_price = self.original_price
        
        # Recalculate line total
        self.calculate_line_total()
        
        # Save changes
        self.save()
    
    def clean(self):
        """Validate discount fields"""
        super().clean()
        
        # Validate discount if present
        if self.discount_type:
            if self.discount_type == DISCOUNT_TYPE_PERCENT:
                if not (0 <= self.discount_value <= 100):
                    raise ValidationError({
                        'discount_value': 
                        'Percentage must be between 0 and 100'
                    })
            elif self.discount_type == DISCOUNT_TYPE_FIXED:
                if self.discount_value > self.original_price:
                    raise ValidationError({
                        'discount_value': 
                        'Discount cannot exceed original price'
                    })
            
            # Validate unit price after discount
            if self.unit_price < 0:
                raise ValidationError({
                    'unit_price': 
                    'Unit price cannot be negative after discount'
                })
    
    @property
    def formatted_discount(self):
        """Format discount for display"""
        if not self.discount_type:
            return "No discount"
        
        if self.discount_type == DISCOUNT_TYPE_PERCENT:
            return f"{self.discount_value}% (₨ {self.discount_amount:,.2f})"
        else:  # FIXED
            return f"₨ {self.discount_amount:,.2f}"
    
    @property
    def has_discount(self):
        """Check if item has a discount"""
        return bool(self.discount_type and self.discount_value)
    
    @property
    def total_discount_for_line(self):
        """Total discount for this line (discount × quantity)"""
        return self.discount_amount * self.quantity
```

### Discount Field Specifications

| Field | Type | Purpose | Example |
|-------|------|---------|---------|
| **discount_type** | CharField | Discount type | 'PERCENT' |
| **discount_value** | DecimalField | Discount value | 10.00 |
| **discount_reason** | CharField | Discount reason | 'Clearance Sale' |
| **discount_amount** | DecimalField | Calculated amount | 100.00 |

### Discount Validation Rules

```python
Validation Rules:

1. Percent Discount:
   - Value must be 0-100
   - discount_amount = original_price × (value / 100)
   - unit_price = original_price - discount_amount

2. Fixed Discount:
   - Value must be <= original_price
   - discount_amount = value
   - unit_price = original_price - discount_amount

3. Unit Price:
   - Must be >= 0 after discount
   - Cannot exceed original_price
   - Must be positive value

4. Total Discount:
   - Calculated as discount_amount × quantity
   - Affects line total
   - Included in cart discount_total
```

### Business Rules

1. **Discount Priority**
   - Line discounts applied first
   - Cart discounts applied after
   - Both can coexist
   - Track separately for reporting

2. **Discount Types**
   - PERCENT: Proportional to price
   - FIXED: Absolute amount
   - Only one type per line
   - Reason tracking for audit

3. **Price Calculation**
   - Original price preserved
   - Discount calculated from original
   - Unit price = original - discount
   - Line total = unit_price × quantity

4. **Validation**
   - Percent: 0-100 range
   - Fixed: Cannot exceed original price
   - Result: unit_price must be >= 0
   - All discounts auditable

5. **Display**
   - Show discount type and amount
   - Calculate total savings
   - Format with currency symbol
   - Include reason if present

### Discount Examples

```
Example 1: Clearance Sale
Product: Winter Jacket
Original Price: ₨5,000.00
Discount: 30% (Clearance)
Discount Amount: ₨1,500.00
Unit Price: ₨3,500.00
Quantity: 1
Line Total: ₨3,500.00
Savings: ₨1,500.00

Example 2: Bundle Discount
Product: Smartphone
Original Price: ₨50,000.00
Discount: ₨5,000.00 (Bundle with accessories)
Discount Amount: ₨5,000.00
Unit Price: ₨45,000.00
Quantity: 1
Line Total: ₨45,000.00
Savings: ₨5,000.00

Example 3: Damaged Item
Product: Laptop
Original Price: ₨75,000.00
Discount: ₨10,000.00 (Minor scratch)
Discount Amount: ₨10,000.00
Unit Price: ₨65,000.00
Quantity: 1
Line Total: ₨65,000.00
Savings: ₨10,000.00

Example 4: Multi-Quantity
Product: Notebook
Original Price: ₨200.00
Discount: 25% (Buy 5+ discount)
Discount Amount: ₨50.00
Unit Price: ₨150.00
Quantity: 10
Line Total: ₨1,500.00
Total Savings: ₨500.00
```

### Expected Outcome
```python
# POSCartItem model now includes:
discount_type = models.CharField(...)
discount_value = models.DecimalField(...)
discount_reason = models.CharField(...)
discount_amount = models.DecimalField(...)

def calculate_discount_amount(self):
    # Implementation
    pass

def apply_discount(self, discount_type, discount_value, reason=None):
    # Implementation
    pass

def remove_discount(self):
    # Implementation
    pass

@property
def formatted_discount(self):
    # Implementation
    pass

@property
def total_discount_for_line(self):
    return self.discount_amount * self.quantity
```

### Verification Checklist
- [ ] discount_type field added with choices
- [ ] discount_value field added
- [ ] discount_reason field added
- [ ] discount_amount field added
- [ ] calculate_discount_amount method implemented
- [ ] apply_discount method implemented
- [ ] remove_discount method implemented
- [ ] Validation in clean method
- [ ] formatted_discount property added
- [ ] has_discount property added
- [ ] total_discount_for_line property added
- [ ] Both PERCENT and FIXED types supported

---

## Task 31: Add Item Tax Fields

### Overview
Add tax fields to the POSCartItem model for tracking tax rate and calculated tax amount. These fields support tax calculation, reporting, and compliance with Sri Lankan tax regulations.

### Dependencies
- Task 30: Discount fields added

### Purpose
Tax fields enable:
- VAT/GST calculation
- Tax reporting and compliance
- Invoice generation
- Tax breakdown display
- Multi-rate tax support

### Instructions

1. **Open cart_item.py**
   - Navigate to `apps/pos/cart/models/cart_item.py`
   - Locate POSCartItem model class

2. **Add tax_rate field**
   - Field name: `tax_rate`
   - Type: DecimalField
   - max_digits: 5
   - decimal_places: 2
   - default: Decimal('0.00')
   - validators: MinValueValidator(Decimal('0.00')), MaxValueValidator(Decimal('100.00'))
   - help_text: "Tax rate as percentage (e.g., 12.00 for 12%)"

3. **Add tax_amount field**
   - Field name: `tax_amount`
   - Type: DecimalField
   - max_digits: 12
   - decimal_places: 2
   - default: Decimal('0.00')
   - help_text: "Calculated tax amount for this line"

4. **Add is_taxable field**
   - Field name: `is_taxable`
   - Type: BooleanField
   - default: True
   - help_text: "Whether this item is subject to tax"

5. **Add calculate_tax method**
   - Method: `calculate_tax()`
   - Check if is_taxable
   - Calculate: line_total × (tax_rate / 100)
   - Round to 2 decimal places
   - Update tax_amount field
   - Return calculated tax

6. **Add set_tax_from_product method**
   - Method: `set_tax_from_product()`
   - Get tax_rate from product or variant
   - Get is_taxable from product
   - Set fields accordingly
   - Called on cart item creation

7. **Update calculate_line_total method**
   - Modify existing method
   - After calculating line_total
   - Call calculate_tax()
   - Ensure tax updated with total

8. **Add tax display properties**
   - Property: `formatted_tax_amount` returns "₨ 120.00"
   - Property: `formatted_tax_rate` returns "12%"
   - Property: `line_total_with_tax` returns line_total + tax_amount

9. **Update save method**
   - Ensure tax calculated before save
   - Recalculate if line_total changes
   - Trigger cart total recalculation

### Sri Lankan Tax Context

```
┌────────────────────────────────────────────────┐
│         Sri Lankan Tax Rates (2024)             │
└────────────────────────────────────────────────┘

Standard VAT Rate: 18%
  - Applied to most goods and services
  - Businesses with turnover > LKR 12M

Reduced Rate: 0%
  - Essential food items
  - Educational materials
  - Healthcare services

Exempt Items:
  - Unprocessed agricultural products
  - Financial services
  - Residential rent
```

### Tax Calculation Flow

```
┌────────────────────────────────────────────────┐
│            Tax Calculation Flow                 │
└────────────────────────────────────────────────┘

[Item Added to Cart]
         │
         ▼
   [Get Tax Rate from Product]
         │
         ▼
   [Check is_taxable?]
         │
    ┌────┴────┐
    │         │
  [No]      [Yes]
    │         │
    ▼         ▼
[Tax = 0] [Calculate Tax]
    │         │
    │   Line Total × (Tax Rate / 100)
    │         │
    │         ▼
    │   [Example: ₨1,000 × 12% = ₨120]
    │         │
    └────┬────┘
         │
         ▼
   [Set tax_amount]
         │
         ▼
   [Line Total with Tax]
   (For display purposes)
```

### Tax Calculation Examples

```
Example 1: Standard VAT (18%)
Product: Electronics
Line Total: ₨10,000.00
Tax Rate: 18%
Tax Amount: ₨1,800.00
Total with Tax: ₨11,800.00

Example 2: No Tax (Essential Item)
Product: Rice (unprocessed)
Line Total: ₨2,500.00
Tax Rate: 0%
Tax Amount: ₨0.00
Total with Tax: ₨2,500.00
is_taxable: False

Example 3: Fractional Quantity with Tax
Product: Fabric
Unit Price: ₨750.00
Quantity: 2.5 meters
Line Total: ₨1,875.00
Tax Rate: 18%
Tax Amount: ₨337.50
Total with Tax: ₨2,212.50

Example 4: Discounted Item with Tax
Product: Laptop
Original Price: ₨75,000.00
Discount: ₨5,000.00
Unit Price: ₨70,000.00
Quantity: 1
Line Total: ₨70,000.00
Tax Rate: 18%
Tax Amount: ₨12,600.00
Total with Tax: ₨82,600.00
```

### Implementation Pattern

```python
from decimal import Decimal, ROUND_HALF_UP
from django.core.validators import MinValueValidator, MaxValueValidator

class POSCartItem(TenantAwareModel, TimestampedModel):
    # ... existing fields ...
    
    is_taxable = models.BooleanField(
        default=True,
        help_text="Whether this item is subject to tax"
    )
    
    tax_rate = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        default=Decimal('0.00'),
        validators=[
            MinValueValidator(Decimal('0.00')),
            MaxValueValidator(Decimal('100.00'))
        ],
        help_text="Tax rate as percentage"
    )
    
    tax_amount = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        default=Decimal('0.00'),
        help_text="Calculated tax amount"
    )
    
    def set_tax_from_product(self):
        """Initialize tax settings from product/variant"""
        if self.variant and hasattr(self.variant, 'tax_rate'):
            self.tax_rate = self.variant.tax_rate
            self.is_taxable = self.variant.is_taxable
        elif hasattr(self.product, 'tax_rate'):
            self.tax_rate = self.product.tax_rate
            self.is_taxable = self.product.is_taxable
        else:
            # Default VAT rate for Sri Lanka
            self.tax_rate = Decimal('18.00')
            self.is_taxable = True
        
        self.calculate_tax()
    
    def calculate_tax(self):
        """Calculate tax amount for this line"""
        if not self.is_taxable or not self.tax_rate:
            self.tax_amount = Decimal('0.00')
            return self.tax_amount
        
        # Calculate tax: line_total × (tax_rate / 100)
        tax = self.line_total * (self.tax_rate / 100)
        
        # Round to 2 decimal places
        self.tax_amount = tax.quantize(
            Decimal('0.01'),
            rounding=ROUND_HALF_UP
        )
        
        return self.tax_amount
    
    def calculate_line_total(self):
        """Calculate line total and tax"""
        if not self.unit_price or not self.quantity:
            self.line_total = Decimal('0.00')
            self.tax_amount = Decimal('0.00')
            return self.line_total
        
        # Calculate line total
        total = self.quantity * self.unit_price
        self.line_total = total.quantize(
            Decimal('0.01'),
            rounding=ROUND_HALF_UP
        )
        
        # Calculate tax
        self.calculate_tax()
        
        return self.line_total
    
    @property
    def formatted_tax_rate(self):
        """Format tax rate for display"""
        return f"{self.tax_rate}%"
    
    @property
    def formatted_tax_amount(self):
        """Format tax amount with currency symbol"""
        return f"₨ {self.tax_amount:,.2f}"
    
    @property
    def line_total_with_tax(self):
        """Calculate line total including tax"""
        return self.line_total + self.tax_amount
    
    @property
    def formatted_line_total_with_tax(self):
        """Format total with tax"""
        return f"₨ {self.line_total_with_tax:,.2f}"
```

### Tax Field Specifications

| Field | Type | Purpose | Example |
|-------|------|---------|---------|
| **is_taxable** | BooleanField | Tax applicability | True |
| **tax_rate** | DecimalField | Tax percentage | 18.00 |
| **tax_amount** | DecimalField | Calculated tax | 1800.00 |

### Tax Calculation Formula

```
Tax Amount = Line Total × (Tax Rate / 100)

Where:
- Line Total: quantity × unit_price (after discount)
- Tax Rate: Percentage (e.g., 18 for 18%)
- Result: Rounded to 2 decimal places

Example:
Line Total: ₨10,000.00
Tax Rate: 18%
Tax Amount: ₨10,000.00 × 0.18 = ₨1,800.00
```

### Business Rules

1. **Tax Application**
   - Applied after all discounts
   - Based on discounted price
   - Not applied to tax-exempt items
   - Rate from product settings

2. **Tax Rates**
   - Standard: 18% (Sri Lanka VAT)
   - Reduced: 0% for essentials
   - Range: 0-100% validated
   - Product-specific rates supported

3. **Calculation Order**
   1. Calculate line total (qty × unit_price)
   2. Apply line discount
   3. Calculate tax on discounted amount
   4. Add to cart tax_total

4. **Tax Exemptions**
   - Essential foods
   - Healthcare items
   - Educational materials
   - Set is_taxable = False

5. **Display**
   - Show tax rate and amount
   - Display total with and without tax
   - Format with Sri Lankan Rupee symbol
   - Support invoice generation

### Tax Scenarios

```
Scenario 1: Standard Taxable Item
Product: Laptop
Line Total: ₨75,000.00
is_taxable: True
Tax Rate: 18%
Tax Amount: ₨13,500.00
Total with Tax: ₨88,500.00

Scenario 2: Tax-Exempt Item
Product: Fresh Vegetables
Line Total: ₨1,500.00
is_taxable: False
Tax Rate: 0%
Tax Amount: ₨0.00
Total with Tax: ₨1,500.00

Scenario 3: Discounted + Tax
Product: TV
Original Price: ₨100,000.00
Discount: 10% (₨10,000)
Line Total: ₨90,000.00
Tax Rate: 18%
Tax Amount: ₨16,200.00
Total with Tax: ₨106,200.00
Note: Tax calculated on discounted price

Scenario 4: Multi-Item with Different Rates
Item 1: Electronics (18% VAT)
  Line Total: ₨50,000.00
  Tax: ₨9,000.00

Item 2: Books (0% VAT)
  Line Total: ₨2,000.00
  Tax: ₨0.00

Cart Totals:
  Subtotal: ₨52,000.00
  Tax Total: ₨9,000.00
  Grand Total: ₨61,000.00
```

### Expected Outcome
```python
# POSCartItem model now includes:
is_taxable = models.BooleanField(default=True)
tax_rate = models.DecimalField(max_digits=5, decimal_places=2, default=Decimal('0.00'))
tax_amount = models.DecimalField(max_digits=12, decimal_places=2, default=Decimal('0.00'))

def set_tax_from_product(self):
    # Implementation
    pass

def calculate_tax(self):
    # Implementation
    pass

def calculate_line_total(self):
    # Calculate total
    # Calculate tax
    pass

@property
def formatted_tax_rate(self):
    return f"{self.tax_rate}%"

@property
def line_total_with_tax(self):
    return self.line_total + self.tax_amount
```

### Verification Checklist
- [ ] is_taxable field added
- [ ] tax_rate field added with validators
- [ ] tax_amount field added
- [ ] Tax rate range validated (0-100)
- [ ] set_tax_from_product method implemented
- [ ] calculate_tax method implemented
- [ ] calculate_line_total updated to include tax
- [ ] formatted_tax_rate property added
- [ ] formatted_tax_amount property added
- [ ] line_total_with_tax property added
- [ ] Tax calculated on discounted price
- [ ] Save method includes tax calculation

---

## Summary

This document covered the POSCartItem model and all its fields:

### Completed Tasks
1. ✅ Task 26: Notes field added to POSCart
2. ✅ Task 27: POSCartItem model created with cart, product, variant links
3. ✅ Task 28: Quantity field with fractional support
4. ✅ Task 29: Price fields (original_price, unit_price, line_total)
5. ✅ Task 30: Discount fields (type, value, reason, amount)
6. ✅ Task 31: Tax fields (is_taxable, tax_rate, tax_amount)

### Key Deliverables
```
apps/pos/cart/models/
├── __init__.py
├── pos_cart.py         # POSCart with notes field
└── cart_item.py        # POSCartItem with all fields
```

### POSCartItem Complete Structure
- **Core Fields**: cart, product, variant, line_number
- **Quantity**: Decimal field with 3 decimal places
- **Pricing**: original_price, unit_price, line_total
- **Discounts**: type, value, reason, amount
- **Tax**: is_taxable, tax_rate, tax_amount
- **Timestamps**: created_at, updated_at (inherited)

### Next Steps
Proceed to [03_Tasks-32-38_Cart-Service-Operations.md](03_Tasks-32-38_Cart-Service-Operations.md) to implement:
- CartService business logic
- Add to cart operations
- Update and remove operations
- Discount application methods
- Total calculation logic

---

**Document Status:** Complete  
**Last Updated:** 2026-01-23  
**Next Document:** [03_Tasks-32-38_Cart-Service-Operations.md](03_Tasks-32-38_Cart-Service-Operations.md)
