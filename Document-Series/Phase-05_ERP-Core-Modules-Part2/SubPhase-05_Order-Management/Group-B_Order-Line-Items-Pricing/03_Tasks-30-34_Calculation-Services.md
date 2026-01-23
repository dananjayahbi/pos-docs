# Tasks 30-34: Calculation Services

> **Phase:** 05 - ERP Core Modules Part 2  
> **SubPhase:** 05 - Order Management  
> **Group:** B - Order Line Items & Pricing  
> **Document:** 03 of 03  
> **Tasks Covered:** 30, 31, 32, 33, 34

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [02_Tasks-25-29_Tax-Status-Warehouse-Migration.md](02_Tasks-25-29_Tax-Status-Warehouse-Migration.md)
- **→ Next Group:** [../Group-C_Order-Creation-Sources/](../Group-C_Order-Creation-Sources/)

---

## Document Overview

This document covers creating calculation services for order line items and orders. These services handle complex financial calculations including line totals, taxes, shipping costs, and automatic recalculation when order data changes.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 30 | Create Order Calculation Service | Medium | 25 min |
| 31 | Implement Line Total Calculator | Medium | 25 min |
| 32 | Implement Order Tax Calculator | Medium | 25 min |
| 33 | Implement Shipping Calculator | Medium | 25 min |
| 34 | Create Order Recalculation Signal | Medium | 25 min |

---

## Task 30: Create Order Calculation Service

### Overview
Create a centralized calculation service that orchestrates all order-related calculations. This service coordinates line item calculations, tax calculations, shipping costs, and order totals.

### Dependencies
- OrderLineItem model with all fields (Tasks 19-29)
- Order model from Group A

### Instructions

1. **Create service file structure**
   - Navigate to `apps/orders/` directory
   - Create `services/` directory if it doesn't exist
   - Create `services/__init__.py` file
   - Create `services/calculation_service.py` file

2. **Import required modules**
   - Import Decimal from decimal module
   - Import Order and OrderLineItem models
   - Import Django transaction utilities
   - Import Q and F from django.db.models for queries

3. **Create OrderCalculationService class**
   - Define main service class
   - Add class docstring explaining purpose
   - Make it a utility class (no instances needed)
   - All methods should be class methods or static methods

4. **Add calculate_order method**
   - Main entry point for order calculation
   - Takes order instance as parameter
   - Orchestrates all calculations in correct order
   - Returns calculated totals dictionary
   - Wraps in transaction for data consistency

5. **Add calculate_all_line_items method**
   - Iterates through all line items in order
   - Calls line total calculator for each (Task 31)
   - Updates line_total field for each item
   - Returns sum of all line totals

6. **Add calculate_order_subtotal method**
   - Sums all line_total values from line items
   - Returns subtotal before order-level adjustments
   - Handles empty order case

7. **Add calculate_order_tax method**
   - Calculates order-level tax (if applicable)
   - Delegates to tax calculator (Task 32)
   - Returns total tax amount
   - May be sum of line taxes or order-level calculation

8. **Add calculate_shipping method**
   - Calculates shipping cost for order
   - Delegates to shipping calculator (Task 33)
   - Returns shipping amount
   - Considers order total, weight, destination

9. **Add calculate_grand_total method**
   - Combines all components into final total
   - Formula: subtotal + tax + shipping - order_discount
   - Returns final order total
   - Ensures non-negative result

10. **Add update_order_totals method**
    - Updates Order model fields with calculated values
    - Sets order.subtotal, order.tax_amount, order.shipping_fee, order.total
    - Saves order instance
    - Logs calculation for audit

11. **Add validation methods**
    - Validate that all line items have valid prices
    - Check for negative totals
    - Verify tax calculations
    - Ensure data consistency

12. **Export service in __init__.py**
    - Import OrderCalculationService in services/__init__.py
    - Add to __all__ list

### Service Architecture

```
OrderCalculationService
├── calculate_order(order)
│   ├── calculate_all_line_items(order)
│   │   └── LineItemCalculator.calculate(line_item) → line_total
│   ├── calculate_order_subtotal(order)
│   │   └── Sum of all line_totals
│   ├── calculate_order_tax(order)
│   │   └── TaxCalculator.calculate(order) → tax_amount
│   ├── calculate_shipping(order)
│   │   └── ShippingCalculator.calculate(order) → shipping_fee
│   ├── calculate_grand_total(...)
│   │   └── subtotal + tax + shipping - discount
│   └── update_order_totals(order, totals)
│       └── Save to Order model
```

### Calculation Flow Diagram

```
Order Calculation Sequence

1. Start with Order instance
   │
   ├──→ 2. Calculate all line item totals
   │        ├── For each line_item:
   │        │   ├── Calculate discount
   │        │   ├── Calculate tax
   │        │   └── Calculate line_total
   │        └── Update line_item.line_total
   │
   ├──→ 3. Calculate order subtotal
   │        └── Sum all line_item.line_total
   │
   ├──→ 4. Apply order-level discount (if any)
   │        └── order_discount from Order model
   │
   ├──→ 5. Calculate order tax
   │        └── Based on tax configuration
   │
   ├──→ 6. Calculate shipping cost
   │        └── Based on weight/destination
   │
   ├──→ 7. Calculate grand total
   │        └── subtotal - order_discount + tax + shipping
   │
   └──→ 8. Update Order model
        ├── order.subtotal = calculated subtotal
        ├── order.tax_amount = calculated tax
        ├── order.shipping_fee = calculated shipping
        └── order.total = calculated grand total
```

### Calculation Order Importance

The order of operations matters:

**Correct Order:**
1. Line discounts → unit_price
2. Line quantities × unit_price → line subtotal
3. Line tax on line subtotal → line tax_amount
4. Line subtotal + line tax → line_total
5. Sum all line_totals → order subtotal
6. Order discount on subtotal → discounted subtotal
7. Order tax (if different from line taxes) → order tax
8. Add shipping → grand total

**Why Order Matters:**
- Tax should apply to discounted prices
- Order discount applies to subtotal, not grand total
- Shipping may depend on subtotal for free shipping thresholds
- Rounding happens at each step for accuracy

### Transaction Management

All calculations should occur within a transaction:

```python
from django.db import transaction

@classmethod
def calculate_order(cls, order):
    """Calculate all order totals with transaction."""
    with transaction.atomic():
        # Lock order row to prevent concurrent modifications
        order = Order.objects.select_for_update().get(pk=order.pk)
        
        # Perform all calculations
        line_totals = cls.calculate_all_line_items(order)
        subtotal = cls.calculate_order_subtotal(order)
        tax = cls.calculate_order_tax(order)
        shipping = cls.calculate_shipping(order)
        grand_total = cls.calculate_grand_total(
            subtotal, tax, shipping, order.discount_amount
        )
        
        # Update order
        cls.update_order_totals(order, {
            'subtotal': subtotal,
            'tax_amount': tax,
            'shipping_fee': shipping,
            'total': grand_total
        })
        
        return order
```

### Service Usage Examples

**Example 1: Calculate on Order Creation**
```python
from apps.orders.services import OrderCalculationService

# After creating order and line items
order = Order.objects.get(pk=order_id)
OrderCalculationService.calculate_order(order)

# Order totals now updated
print(f"Subtotal: {order.subtotal}")
print(f"Tax: {order.tax_amount}")
print(f"Shipping: {order.shipping_fee}")
print(f"Total: {order.total}")
```

**Example 2: Recalculate After Modification**
```python
# User adds a new line item
line_item = OrderLineItem.objects.create(
    order=order,
    product=product,
    quantity_ordered=2,
    unit_price=product.price
)

# Recalculate entire order
OrderCalculationService.calculate_order(order)
```

**Example 3: Validate Before Checkout**
```python
# Before confirming order
totals = OrderCalculationService.calculate_order(order)

# Check if customer's payment amount matches
if customer_payment != order.total:
    raise ValidationError("Payment amount doesn't match order total")
```

### Return Value Structure

```python
{
    'line_items_calculated': 5,
    'subtotal': Decimal('45000.00'),
    'order_discount': Decimal('5000.00'),
    'discounted_subtotal': Decimal('40000.00'),
    'tax_amount': Decimal('7200.00'),
    'shipping_fee': Decimal('500.00'),
    'grand_total': Decimal('47700.00'),
    'calculations': [
        {
            'line_item_id': 'uuid-1',
            'line_total': Decimal('17700.00')
        },
        {
            'line_item_id': 'uuid-2',
            'line_total': Decimal('8500.00')
        },
        # ... more line items
    ]
}
```

### Error Handling

Service should handle errors gracefully:

```python
class CalculationError(Exception):
    """Raised when calculation fails."""
    pass

@classmethod
def calculate_order(cls, order):
    """Calculate order with error handling."""
    try:
        # Validate order has line items
        if not order.line_items.exists():
            raise CalculationError("Order has no line items")
        
        # Validate all line items have prices
        invalid_items = order.line_items.filter(
            unit_price__isnull=True
        )
        if invalid_items.exists():
            raise CalculationError(
                f"{invalid_items.count()} line items missing unit_price"
            )
        
        # Perform calculations...
        
    except CalculationError as e:
        logger.error(f"Order calculation failed: {e}")
        raise
    except Exception as e:
        logger.exception("Unexpected error during order calculation")
        raise CalculationError(f"Calculation failed: {str(e)}")
```

### Expected Outcome
```
apps/orders/
├── models/
│   ├── order.py
│   └── order_line_item.py
└── services/
    ├── __init__.py
    └── calculation_service.py    # New file - Task 30
```

### Verification Checklist
- [ ] `services/` directory created
- [ ] `calculation_service.py` file created with OrderCalculationService class
- [ ] calculate_order() main method implemented
- [ ] calculate_all_line_items() method implemented
- [ ] calculate_order_subtotal() method implemented
- [ ] calculate_order_tax() method implemented
- [ ] calculate_shipping() method implemented
- [ ] calculate_grand_total() method implemented
- [ ] update_order_totals() method implemented
- [ ] Transaction management implemented
- [ ] Error handling added
- [ ] Service exported in __init__.py

---

## Task 31: Implement Line Total Calculator

### Overview
Implement the calculator logic for individual line item totals. This calculator handles discounts, quantities, and tax to compute the final line total.

### Dependencies
- Task 30: Create Order Calculation Service
- OrderLineItem model with discount and tax fields

### Instructions

1. **Add LineItemCalculator class to calculation_service.py**
   - Create nested class or separate class in same file
   - Add docstring explaining line calculation logic
   - Keep as utility class with static/class methods

2. **Add calculate_discount method**
   - Takes line item as parameter
   - Reads discount_type and discount_value
   - Calculates discount_amount based on type
   - Returns calculated discount amount

3. **Add apply_discount method**
   - Takes original_price and discount amount
   - Calculates unit_price after discount
   - Ensures unit_price >= 0
   - Returns discounted unit_price

4. **Add calculate_line_subtotal method**
   - Takes quantity_ordered and unit_price
   - Calculates: quantity × unit_price
   - Returns subtotal before tax

5. **Add calculate_line_tax method**
   - Takes line subtotal and tax_rate
   - Checks is_taxable flag
   - Calculates: subtotal × (tax_rate / 100)
   - Returns tax_amount

6. **Add calculate method (main entry point)**
   - Orchestrates all line item calculations
   - Calls methods in correct order
   - Updates line item fields
   - Returns line_total

7. **Add validation methods**
   - Validate quantity > 0
   - Validate unit_price >= 0
   - Validate discount doesn't exceed price
   - Validate tax_rate is 0-100

8. **Use Decimal for precision**
   - Import Decimal type
   - Use Decimal.quantize for rounding
   - Round to 2 decimal places
   - Use ROUND_HALF_UP rounding mode

### Line Item Calculation Logic

```
Line Item Calculation Steps

1. Start with original_price (catalog price)
   │
2. Calculate discount_amount
   ├── If PERCENTAGE:
   │   └── discount_amount = original_price × (discount_value / 100)
   └── If FIXED:
       └── discount_amount = discount_value
   │
3. Calculate unit_price
   └── unit_price = original_price - discount_amount
   │
4. Calculate line subtotal
   └── subtotal = quantity_ordered × unit_price
   │
5. Calculate tax_amount
   ├── If is_taxable:
   │   └── tax_amount = subtotal × (tax_rate / 100)
   └── Else:
       └── tax_amount = 0
   │
6. Calculate line_total
   └── line_total = subtotal + tax_amount
```

### Discount Calculation Implementation

```python
@staticmethod
def calculate_discount(line_item):
    """
    Calculate discount amount for line item.
    
    Args:
        line_item: OrderLineItem instance
        
    Returns:
        Decimal: Calculated discount amount per unit
    """
    from decimal import Decimal, ROUND_HALF_UP
    
    original_price = line_item.original_price or line_item.unit_price
    discount_type = line_item.discount_type
    discount_value = line_item.discount_value
    
    if discount_type == 'PERCENTAGE':
        # discount_value is percentage (0-100)
        discount_amount = original_price * (discount_value / Decimal('100'))
    elif discount_type == 'FIXED':
        # discount_value is fixed amount
        discount_amount = discount_value
    else:
        # NONE or unknown
        discount_amount = Decimal('0.00')
    
    # Round to 2 decimal places
    discount_amount = discount_amount.quantize(
        Decimal('0.01'), 
        rounding=ROUND_HALF_UP
    )
    
    # Ensure discount doesn't exceed price
    if discount_amount > original_price:
        discount_amount = original_price
    
    return discount_amount
```

### Tax Calculation Implementation

```python
@staticmethod
def calculate_line_tax(line_item, subtotal):
    """
    Calculate tax amount for line item.
    
    Args:
        line_item: OrderLineItem instance
        subtotal: Line subtotal (quantity × unit_price)
        
    Returns:
        Decimal: Calculated tax amount
    """
    from decimal import Decimal, ROUND_HALF_UP
    
    # Check if item is taxable
    if not line_item.is_taxable:
        return Decimal('0.00')
    
    # Get tax rate
    tax_rate = line_item.tax_rate or Decimal('0.00')
    
    # Calculate tax amount
    tax_amount = subtotal * (tax_rate / Decimal('100'))
    
    # Round to 2 decimal places
    tax_amount = tax_amount.quantize(
        Decimal('0.01'),
        rounding=ROUND_HALF_UP
    )
    
    return tax_amount
```

### Main Calculate Method

```python
@classmethod
def calculate(cls, line_item):
    """
    Calculate all totals for a line item.
    
    Args:
        line_item: OrderLineItem instance
        
    Returns:
        Decimal: Calculated line_total
        
    Updates line_item fields:
        - discount_amount
        - unit_price (if original_price exists)
        - tax_amount
        - line_total
    """
    from decimal import Decimal, ROUND_HALF_UP
    
    # Step 1: Calculate discount
    discount_amount = cls.calculate_discount(line_item)
    line_item.discount_amount = discount_amount
    
    # Step 2: Calculate unit price after discount
    if line_item.original_price:
        line_item.unit_price = line_item.original_price - discount_amount
    
    # Step 3: Calculate subtotal
    subtotal = line_item.quantity_ordered * line_item.unit_price
    subtotal = subtotal.quantize(Decimal('0.01'), rounding=ROUND_HALF_UP)
    
    # Step 4: Calculate tax
    tax_amount = cls.calculate_line_tax(line_item, subtotal)
    line_item.tax_amount = tax_amount
    
    # Step 5: Calculate line total
    line_total = subtotal + tax_amount
    line_total = line_total.quantize(Decimal('0.01'), rounding=ROUND_HALF_UP)
    line_item.line_total = line_total
    
    return line_total
```

### Calculation Examples

**Example 1: Simple Item with Tax**
```
Input:
├── original_price = ₨ 10,000
├── quantity_ordered = 1
├── discount_type = 'NONE'
├── is_taxable = True
└── tax_rate = 18.0

Calculation:
├── discount_amount = ₨ 0
├── unit_price = ₨ 10,000
├── subtotal = 1 × ₨ 10,000 = ₨ 10,000
├── tax_amount = ₨ 10,000 × 0.18 = ₨ 1,800
└── line_total = ₨ 10,000 + ₨ 1,800 = ₨ 11,800
```

**Example 2: Multiple Quantity with Percentage Discount**
```
Input:
├── original_price = ₨ 5,000
├── quantity_ordered = 3
├── discount_type = 'PERCENTAGE'
├── discount_value = 10.0
├── is_taxable = True
└── tax_rate = 18.0

Calculation:
├── discount_amount = ₨ 5,000 × 0.10 = ₨ 500
├── unit_price = ₨ 5,000 - ₨ 500 = ₨ 4,500
├── subtotal = 3 × ₨ 4,500 = ₨ 13,500
├── tax_amount = ₨ 13,500 × 0.18 = ₨ 2,430
└── line_total = ₨ 13,500 + ₨ 2,430 = ₨ 15,930
```

**Example 3: Fixed Discount, Tax-Exempt**
```
Input:
├── original_price = ₨ 8,000
├── quantity_ordered = 2
├── discount_type = 'FIXED'
├── discount_value = ₨ 1,000
├── is_taxable = False
└── tax_rate = 0.0

Calculation:
├── discount_amount = ₨ 1,000
├── unit_price = ₨ 8,000 - ₨ 1,000 = ₨ 7,000
├── subtotal = 2 × ₨ 7,000 = ₨ 14,000
├── tax_amount = ₨ 0 (tax-exempt)
└── line_total = ₨ 14,000 + ₨ 0 = ₨ 14,000
```

### Decimal Rounding Strategy

Use banker's rounding (ROUND_HALF_UP):

```python
from decimal import Decimal, ROUND_HALF_UP

value = Decimal('10.555')
rounded = value.quantize(Decimal('0.01'), rounding=ROUND_HALF_UP)
# Result: Decimal('10.56')

value = Decimal('10.554')
rounded = value.quantize(Decimal('0.01'), rounding=ROUND_HALF_UP)
# Result: Decimal('10.55')
```

**Why Banker's Rounding:**
- Reduces cumulative rounding errors
- Standard in financial calculations
- Unbiased for statistical purposes
- Matches accounting practices

### Validation Rules

Before calculation, validate:

```python
@classmethod
def validate_line_item(cls, line_item):
    """Validate line item before calculation."""
    errors = []
    
    # Validate quantity
    if line_item.quantity_ordered <= 0:
        errors.append("Quantity must be greater than 0")
    
    # Validate unit price
    if line_item.unit_price < 0:
        errors.append("Unit price cannot be negative")
    
    # Validate discount
    if line_item.discount_type == 'PERCENTAGE':
        if not 0 <= line_item.discount_value <= 100:
            errors.append("Percentage discount must be 0-100")
    
    # Validate tax rate
    if not 0 <= line_item.tax_rate <= 100:
        errors.append("Tax rate must be 0-100")
    
    if errors:
        raise ValidationError(errors)
```

### Integration with OrderCalculationService

```python
class OrderCalculationService:
    @classmethod
    def calculate_all_line_items(cls, order):
        """Calculate all line items in order."""
        from decimal import Decimal
        
        total = Decimal('0.00')
        
        for line_item in order.line_items.all():
            # Validate line item
            LineItemCalculator.validate_line_item(line_item)
            
            # Calculate line total
            line_total = LineItemCalculator.calculate(line_item)
            
            # Save updated line item
            line_item.save()
            
            # Add to order total
            total += line_total
        
        return total
```

### Expected Outcome
```python
# calculation_service.py now includes:

class LineItemCalculator:
    @staticmethod
    def calculate_discount(line_item):
        """Calculate discount amount."""
        # Implementation
    
    @staticmethod
    def calculate_line_tax(line_item, subtotal):
        """Calculate tax amount."""
        # Implementation
    
    @classmethod
    def calculate(cls, line_item):
        """Main calculation method."""
        # Implementation
    
    @classmethod
    def validate_line_item(cls, line_item):
        """Validate before calculation."""
        # Implementation
```

### Verification Checklist
- [ ] LineItemCalculator class created
- [ ] calculate_discount() method implemented
- [ ] apply_discount() method implemented
- [ ] calculate_line_subtotal() method implemented
- [ ] calculate_line_tax() method implemented
- [ ] calculate() main method implemented
- [ ] validate_line_item() method implemented
- [ ] Decimal type used for all calculations
- [ ] Proper rounding (2 decimal places) applied
- [ ] Discount validation prevents negative prices
- [ ] Tax-exempt items handled correctly
- [ ] All discount types (PERCENTAGE, FIXED, NONE) supported

---

## Task 32: Implement Order Tax Calculator

### Overview
Implement tax calculation logic for the entire order. This calculator handles order-level tax calculations, supporting both line-item-based and order-level tax approaches.

### Dependencies
- Task 31: Implement Line Total Calculator
- Tax configuration models (if any from Phase 04)

### Instructions

1. **Add TaxCalculator class to calculation_service.py**
   - Create class for order-level tax calculations
   - Add docstring explaining tax calculation strategies
   - Support multiple tax calculation methods

2. **Add tax calculation strategy selection**
   - Define TAX_STRATEGY_CHOICES
   - LINE_ITEM_TAX: Sum of individual line item taxes
   - ORDER_LEVEL_TAX: Single tax calculation on order subtotal
   - MIXED: Combination of both

3. **Add calculate_line_item_tax_total method**
   - Sums tax_amount from all line items
   - Returns total tax from line items
   - This is the default strategy

4. **Add calculate_order_level_tax method**
   - Calculates tax on order subtotal
   - Uses order-level tax rate
   - Applies to subtotal after order discount
   - Returns calculated order tax

5. **Add get_applicable_tax_rate method**
   - Determines tax rate for order
   - Consider customer tax exemption status
   - Consider product tax categories
   - Consider delivery destination (tax jurisdiction)
   - Return applicable tax rate

6. **Add apply_tax_exemptions method**
   - Check if customer is tax-exempt
   - Check if order qualifies for exemption
   - Apply exemption rules
   - Return adjusted tax amount

7. **Add calculate method (main entry point)**
   - Determines calculation strategy
   - Calls appropriate calculation method
   - Applies exemptions if applicable
   - Returns final tax amount

8. **Add Sri Lanka-specific tax logic**
   - Support 18% standard VAT rate
   - Support 0% for exempt items
   - Support 8% reduced rate for specific categories
   - Handle export orders (0% VAT)

### Tax Calculation Strategies

```
Tax Strategy Options

1. LINE_ITEM_TAX (Default)
   ├── Each line item calculates own tax
   ├── Sum all line_item.tax_amount
   └── Use Case: Different tax rates per product

2. ORDER_LEVEL_TAX
   ├── Calculate tax on order subtotal
   ├── Single tax rate for entire order
   └── Use Case: Uniform tax rate, simpler calculation

3. MIXED
   ├── Some items taxed individually
   ├── Some calculated at order level
   └── Use Case: Complex tax rules
```

### Line Item Tax Total Calculation

```python
@staticmethod
def calculate_line_item_tax_total(order):
    """
    Sum all line item tax amounts.
    
    Args:
        order: Order instance
        
    Returns:
        Decimal: Total tax from all line items
    """
    from decimal import Decimal
    from django.db.models import Sum
    
    # Sum all line item tax amounts
    total_tax = order.line_items.aggregate(
        total=Sum('tax_amount')
    )['total'] or Decimal('0.00')
    
    return total_tax
```

### Order Level Tax Calculation

```python
@classmethod
def calculate_order_level_tax(cls, order, subtotal):
    """
    Calculate tax on order subtotal.
    
    Args:
        order: Order instance
        subtotal: Order subtotal (after order discount)
        
    Returns:
        Decimal: Calculated tax amount
    """
    from decimal import Decimal, ROUND_HALF_UP
    
    # Get applicable tax rate
    tax_rate = cls.get_applicable_tax_rate(order)
    
    # Calculate tax
    tax_amount = subtotal * (tax_rate / Decimal('100'))
    
    # Round to 2 decimal places
    tax_amount = tax_amount.quantize(
        Decimal('0.01'),
        rounding=ROUND_HALF_UP
    )
    
    return tax_amount
```

### Tax Rate Determination Logic

```python
@staticmethod
def get_applicable_tax_rate(order):
    """
    Determine applicable tax rate for order.
    
    Args:
        order: Order instance
        
    Returns:
        Decimal: Tax rate percentage
    """
    from decimal import Decimal
    
    # Check customer tax exemption
    if hasattr(order.customer, 'is_tax_exempt') and order.customer.is_tax_exempt:
        return Decimal('0.00')
    
    # Check delivery destination
    # (Future: Different rates for different regions)
    
    # Check order type
    if order.order_type == 'EXPORT':
        return Decimal('0.00')  # Export orders are 0-rated
    
    # Default: Sri Lanka standard VAT
    return Decimal('18.00')
```

### Tax Exemption Handling

```python
@classmethod
def apply_tax_exemptions(cls, order, tax_amount):
    """
    Apply any applicable tax exemptions.
    
    Args:
        order: Order instance
        tax_amount: Calculated tax amount
        
    Returns:
        Decimal: Tax amount after exemptions
    """
    from decimal import Decimal
    
    # Customer-level exemption
    if hasattr(order.customer, 'is_tax_exempt') and order.customer.is_tax_exempt:
        return Decimal('0.00')
    
    # Order-level exemption (e.g., charitable donation)
    if order.is_tax_exempt:
        return Decimal('0.00')
    
    # Threshold-based exemption (if applicable)
    # Example: Orders under ₨ 5,000 may be exempt
    # if order.subtotal < Decimal('5000.00'):
    #     return Decimal('0.00')
    
    # No exemption applies
    return tax_amount
```

### Main Calculate Method

```python
@classmethod
def calculate(cls, order, strategy='LINE_ITEM_TAX'):
    """
    Calculate total tax for order.
    
    Args:
        order: Order instance
        strategy: Tax calculation strategy
        
    Returns:
        Decimal: Total tax amount
    """
    from decimal import Decimal
    
    if strategy == 'LINE_ITEM_TAX':
        # Sum tax from all line items
        tax_amount = cls.calculate_line_item_tax_total(order)
        
    elif strategy == 'ORDER_LEVEL_TAX':
        # Calculate tax on order subtotal
        subtotal = order.subtotal - (order.discount_amount or Decimal('0.00'))
        tax_amount = cls.calculate_order_level_tax(order, subtotal)
        
    else:
        # Default to line item tax
        tax_amount = cls.calculate_line_item_tax_total(order)
    
    # Apply exemptions
    tax_amount = cls.apply_tax_exemptions(order, tax_amount)
    
    return tax_amount
```

### Sri Lanka Tax Scenarios

**Scenario 1: Standard VAT (18%)**
```
Product Type: Electronics
Customer: Regular business
Location: Colombo

Tax Rate: 18%
Subtotal: ₨ 100,000
Tax: ₨ 100,000 × 0.18 = ₨ 18,000
Total: ₨ 118,000
```

**Scenario 2: Tax-Exempt Customer**
```
Product Type: Any
Customer: Government entity (tax-exempt)
Location: Any

Tax Rate: 0%
Subtotal: ₨ 100,000
Tax: ₨ 0
Total: ₨ 100,000
```

**Scenario 3: Export Order (0-Rated)**
```
Product Type: Any
Customer: International
Location: Export

Tax Rate: 0%
Subtotal: ₨ 100,000
Tax: ₨ 0 (zero-rated, not exempt)
Total: ₨ 100,000
Note: Customer can claim input tax credit
```

**Scenario 4: Essential Items (Reduced Rate)**
```
Product Type: Essential food items
Customer: Regular consumer
Location: Colombo

Tax Rate: 8% (hypothetical reduced rate)
Subtotal: ₨ 50,000
Tax: ₨ 50,000 × 0.08 = ₨ 4,000
Total: ₨ 54,000
```

**Scenario 5: Mixed Tax Rates**
```
Line Item 1: Electronics (₨ 50,000, 18% VAT)
├── Tax: ₨ 9,000

Line Item 2: Food Items (₨ 10,000, 0% VAT)
├── Tax: ₨ 0

Line Item 3: Books (₨ 5,000, 8% VAT)
├── Tax: ₨ 400

Order Total:
├── Subtotal: ₨ 65,000
├── Total Tax: ₨ 9,000 + ₨ 0 + ₨ 400 = ₨ 9,400
└── Grand Total: ₨ 74,400
```

### Tax Rounding Rules

Different jurisdictions have different rounding rules:

```python
# Sri Lanka: Round to nearest cent (standard banker's rounding)
from decimal import Decimal, ROUND_HALF_UP

tax_amount = Decimal('1234.555')
rounded = tax_amount.quantize(Decimal('0.01'), rounding=ROUND_HALF_UP)
# Result: ₨ 1,234.56

# Some jurisdictions: Always round up for tax
from decimal import ROUND_UP

tax_amount = Decimal('1234.551')
rounded = tax_amount.quantize(Decimal('0.01'), rounding=ROUND_UP)
# Result: ₨ 1,234.56 (rounded up)
```

### Tax Reporting Support

The tax calculator should support reporting:

```python
@classmethod
def get_tax_breakdown(cls, order):
    """
    Get detailed tax breakdown for reporting.
    
    Returns:
        dict: Tax breakdown by rate
    """
    from decimal import Decimal
    from django.db.models import Sum, Q
    
    breakdown = {}
    
    # Group line items by tax rate
    tax_rates = order.line_items.values('tax_rate').distinct()
    
    for rate_dict in tax_rates:
        rate = rate_dict['tax_rate']
        
        # Sum tax for this rate
        rate_tax = order.line_items.filter(
            tax_rate=rate
        ).aggregate(
            total=Sum('tax_amount')
        )['total'] or Decimal('0.00')
        
        breakdown[f"{rate}%"] = rate_tax
    
    return breakdown

# Example output:
# {
#     "18%": Decimal("9000.00"),
#     "8%": Decimal("400.00"),
#     "0%": Decimal("0.00")
# }
```

### Expected Outcome
```python
# calculation_service.py now includes:

class TaxCalculator:
    @staticmethod
    def calculate_line_item_tax_total(order):
        """Sum line item taxes."""
        # Implementation
    
    @classmethod
    def calculate_order_level_tax(cls, order, subtotal):
        """Calculate order-level tax."""
        # Implementation
    
    @staticmethod
    def get_applicable_tax_rate(order):
        """Determine tax rate."""
        # Implementation
    
    @classmethod
    def apply_tax_exemptions(cls, order, tax_amount):
        """Apply exemptions."""
        # Implementation
    
    @classmethod
    def calculate(cls, order, strategy='LINE_ITEM_TAX'):
        """Main tax calculation."""
        # Implementation
    
    @classmethod
    def get_tax_breakdown(cls, order):
        """Get tax breakdown for reporting."""
        # Implementation
```

### Verification Checklist
- [ ] TaxCalculator class created
- [ ] calculate_line_item_tax_total() method implemented
- [ ] calculate_order_level_tax() method implemented
- [ ] get_applicable_tax_rate() method implemented
- [ ] apply_tax_exemptions() method implemented
- [ ] calculate() main method implemented
- [ ] get_tax_breakdown() reporting method implemented
- [ ] Sri Lanka VAT rates (18%, 0%, 8%) supported
- [ ] Tax-exempt customer handling implemented
- [ ] Export order 0-rating supported
- [ ] Proper rounding applied
- [ ] Multiple tax strategies supported

---

## Task 33: Implement Shipping Calculator

### Overview
Implement shipping cost calculation logic based on order characteristics such as weight, dimensions, destination, and shipping method. Support multiple shipping methods and carriers.

### Dependencies
- Task 30: Create Order Calculation Service
- Shipping configuration models (if any)

### Instructions

1. **Add ShippingCalculator class to calculation_service.py**
   - Create class for shipping calculations
   - Add docstring explaining shipping logic
   - Support multiple calculation methods

2. **Add shipping method choices**
   - Define SHIPPING_METHOD_CHOICES
   - STANDARD: Regular shipping (3-5 days)
   - EXPRESS: Fast shipping (1-2 days)
   - OVERNIGHT: Next day delivery
   - PICKUP: Customer pickup (no shipping)
   - FREE: Free shipping promotion

3. **Add calculate_by_weight method**
   - Calculate shipping based on total order weight
   - Use weight tiers/brackets
   - Returns shipping cost

4. **Add calculate_by_destination method**
   - Calculate shipping based on delivery location
   - Use zone-based pricing
   - Consider distance from warehouse
   - Returns shipping cost

5. **Add calculate_by_order_value method**
   - Calculate shipping based on order subtotal
   - Support free shipping thresholds
   - Percentage-based shipping fees
   - Returns shipping cost

6. **Add calculate_flat_rate method**
   - Fixed shipping cost regardless of order
   - Simplest calculation method
   - Returns flat rate amount

7. **Add apply_shipping_promotions method**
   - Check for free shipping promotions
   - Apply shipping discounts
   - Check minimum order thresholds
   - Returns adjusted shipping cost

8. **Add calculate method (main entry point)**
   - Determines calculation method
   - Calls appropriate calculator
   - Applies promotions
   - Returns final shipping cost

9. **Add Sri Lanka-specific shipping logic**
   - Support Colombo metro delivery (standard)
   - Support outer-province delivery (higher cost)
   - Integration with local carriers (Pronto, Domex)
   - Island-wide delivery zones

### Shipping Calculation Methods

```
Shipping Calculation Strategies

1. WEIGHT_BASED
   ├── 0-1 kg: ₨ 200
   ├── 1-5 kg: ₨ 400
   ├── 5-10 kg: ₨ 600
   └── 10+ kg: ₨ 800

2. DESTINATION_BASED
   ├── Colombo Metro: ₨ 300
   ├── Western Province: ₨ 500
   ├── Other Provinces: ₨ 700
   └── Remote Areas: ₨ 1,000

3. ORDER_VALUE_BASED
   ├── < ₨ 5,000: ₨ 500
   ├── ₨ 5,000 - ₨ 10,000: ₨ 300
   └── > ₨ 10,000: ₨ 0 (free)

4. FLAT_RATE
   └── Fixed: ₨ 400 (all orders)

5. CARRIER_RATE
   └── Real-time API call to carrier
```

### Weight-Based Calculation

```python
@staticmethod
def calculate_by_weight(order):
    """
    Calculate shipping based on total order weight.
    
    Args:
        order: Order instance
        
    Returns:
        Decimal: Shipping cost
    """
    from decimal import Decimal
    from django.db.models import Sum
    
    # Get total weight from line items
    # Assumes product has weight field
    total_weight = Decimal('0.00')
    
    for line_item in order.line_items.select_related('product'):
        if line_item.product and line_item.product.weight:
            item_weight = (
                line_item.product.weight * 
                line_item.quantity_ordered
            )
            total_weight += item_weight
    
    # Weight-based pricing tiers (in kg)
    if total_weight <= Decimal('1.0'):
        return Decimal('200.00')
    elif total_weight <= Decimal('5.0'):
        return Decimal('400.00')
    elif total_weight <= Decimal('10.0'):
        return Decimal('600.00')
    else:
        # ₨ 800 base + ₨ 50 per additional kg
        excess_weight = total_weight - Decimal('10.0')
        additional_cost = excess_weight * Decimal('50.00')
        return Decimal('800.00') + additional_cost
```

### Destination-Based Calculation

```python
@staticmethod
def calculate_by_destination(order):
    """
    Calculate shipping based on delivery destination.
    
    Args:
        order: Order instance
        
    Returns:
        Decimal: Shipping cost
    """
    from decimal import Decimal
    
    # Get delivery address
    if not order.shipping_address:
        return Decimal('0.00')
    
    province = order.shipping_address.province
    district = order.shipping_address.district
    
    # Colombo Metro (districts)
    colombo_metro = ['Colombo', 'Dehiwala-Mount Lavinia', 'Moratuwa']
    
    if district in colombo_metro:
        return Decimal('300.00')
    
    # Western Province (outside Colombo Metro)
    if province == 'Western':
        return Decimal('500.00')
    
    # Other major cities
    major_cities = ['Kandy', 'Galle', 'Jaffna', 'Negombo']
    if district in major_cities:
        return Decimal('600.00')
    
    # Remote areas
    remote_areas = ['Mullaitivu', 'Kilinochchi', 'Mannar']
    if district in remote_areas:
        return Decimal('1000.00')
    
    # All other areas
    return Decimal('700.00')
```

### Order Value-Based Calculation

```python
@staticmethod
def calculate_by_order_value(order, subtotal):
    """
    Calculate shipping based on order value.
    
    Args:
        order: Order instance
        subtotal: Order subtotal
        
    Returns:
        Decimal: Shipping cost
    """
    from decimal import Decimal
    
    # Free shipping threshold
    if subtotal >= Decimal('10000.00'):
        return Decimal('0.00')
    
    # Tiered pricing
    if subtotal >= Decimal('5000.00'):
        return Decimal('300.00')
    
    # Standard shipping for smaller orders
    return Decimal('500.00')
```

### Flat Rate Calculation

```python
@staticmethod
def calculate_flat_rate(order):
    """
    Calculate flat rate shipping.
    
    Args:
        order: Order instance
        
    Returns:
        Decimal: Flat shipping cost
    """
    from decimal import Decimal
    
    # Check shipping method
    if order.shipping_method == 'PICKUP':
        return Decimal('0.00')
    elif order.shipping_method == 'EXPRESS':
        return Decimal('800.00')
    elif order.shipping_method == 'OVERNIGHT':
        return Decimal('1500.00')
    else:  # STANDARD
        return Decimal('400.00')
```

### Shipping Promotions

```python
@classmethod
def apply_shipping_promotions(cls, order, base_shipping):
    """
    Apply shipping promotions and discounts.
    
    Args:
        order: Order instance
        base_shipping: Calculated base shipping cost
        
    Returns:
        Decimal: Adjusted shipping cost
    """
    from decimal import Decimal
    
    # Check for free shipping promotion
    if hasattr(order, 'has_free_shipping') and order.has_free_shipping:
        return Decimal('0.00')
    
    # Check coupon code for shipping discount
    if order.coupon_code:
        # Example: "FREESHIP" coupon
        if order.coupon_code.code == 'FREESHIP':
            return Decimal('0.00')
        
        # Example: "SHIP50" for 50% off shipping
        if order.coupon_code.code == 'SHIP50':
            return base_shipping * Decimal('0.5')
    
    # Member shipping discount
    if hasattr(order.customer, 'membership_tier'):
        if order.customer.membership_tier == 'PLATINUM':
            return Decimal('0.00')  # Free for platinum
        elif order.customer.membership_tier == 'GOLD':
            return base_shipping * Decimal('0.5')  # 50% off for gold
    
    # No promotion applies
    return base_shipping
```

### Main Calculate Method

```python
@classmethod
def calculate(cls, order, subtotal, method='DESTINATION'):
    """
    Calculate shipping cost for order.
    
    Args:
        order: Order instance
        subtotal: Order subtotal (for value-based calculation)
        method: Calculation method to use
        
    Returns:
        Decimal: Final shipping cost
    """
    from decimal import Decimal
    
    # Customer pickup - no shipping
    if order.shipping_method == 'PICKUP':
        return Decimal('0.00')
    
    # Calculate base shipping
    if method == 'WEIGHT':
        base_shipping = cls.calculate_by_weight(order)
    elif method == 'DESTINATION':
        base_shipping = cls.calculate_by_destination(order)
    elif method == 'ORDER_VALUE':
        base_shipping = cls.calculate_by_order_value(order, subtotal)
    elif method == 'FLAT_RATE':
        base_shipping = cls.calculate_flat_rate(order)
    else:
        # Default: destination-based
        base_shipping = cls.calculate_by_destination(order)
    
    # Apply promotions
    final_shipping = cls.apply_shipping_promotions(order, base_shipping)
    
    return final_shipping
```

### Sri Lanka Shipping Zones

```
Sri Lanka Shipping Zones

Zone 1: Colombo Metro
├── Colombo
├── Dehiwala-Mount Lavinia
├── Moratuwa
├── Kotte
└── Cost: ₨ 300

Zone 2: Western Province (Other)
├── Gampaha
├── Kalutara
├── Negombo
├── Ja-Ela
└── Cost: ₨ 500

Zone 3: Major Cities
├── Kandy
├── Galle
├── Matara
├── Jaffna
├── Kurunegala
└── Cost: ₨ 600

Zone 4: Other Areas
├── All other districts
└── Cost: ₨ 700

Zone 5: Remote Areas
├── Mullaitivu
├── Kilinochchi
├── Mannar
├── Vavuniya
└── Cost: ₨ 1,000
```

### Shipping Method Pricing

```
Shipping Method Costs

STANDARD (3-5 days):
├── Colombo: ₨ 300
├── Western Province: ₨ 500
└── Island-wide: ₨ 700

EXPRESS (1-2 days):
├── Base cost × 2
├── Colombo: ₨ 600
├── Western Province: ₨ 1,000
└── Island-wide: ₨ 1,400

OVERNIGHT:
├── Base cost × 3.75
├── Colombo only: ₨ 1,500
└── Not available for remote areas

PICKUP (Customer collects):
├── All locations: ₨ 0
```

### Carrier Integration (Future)

```python
@staticmethod
def get_carrier_rate(order, carrier='PRONTO'):
    """
    Get shipping rate from carrier API.
    
    Args:
        order: Order instance
        carrier: Carrier name (PRONTO, DOMEX, etc.)
        
    Returns:
        Decimal: Quoted shipping cost
    """
    from decimal import Decimal
    
    # Future: Implement carrier API integration
    # For now, return estimated rate
    
    if carrier == 'PRONTO':
        # Pronto Logistics API call
        # rate = pronto_api.get_rate(order)
        pass
    elif carrier == 'DOMEX':
        # DHL Domex API call
        # rate = domex_api.get_rate(order)
        pass
    
    # Fallback to destination-based
    return ShippingCalculator.calculate_by_destination(order)
```

### Expected Outcome
```python
# calculation_service.py now includes:

class ShippingCalculator:
    SHIPPING_METHOD_CHOICES = [
        ('STANDARD', '3-5 days'),
        ('EXPRESS', '1-2 days'),
        ('OVERNIGHT', 'Next day'),
        ('PICKUP', 'Customer pickup'),
    ]
    
    @staticmethod
    def calculate_by_weight(order):
        """Weight-based shipping."""
        # Implementation
    
    @staticmethod
    def calculate_by_destination(order):
        """Destination-based shipping."""
        # Implementation
    
    @staticmethod
    def calculate_by_order_value(order, subtotal):
        """Value-based shipping."""
        # Implementation
    
    @staticmethod
    def calculate_flat_rate(order):
        """Flat rate shipping."""
        # Implementation
    
    @classmethod
    def apply_shipping_promotions(cls, order, base_shipping):
        """Apply shipping discounts."""
        # Implementation
    
    @classmethod
    def calculate(cls, order, subtotal, method='DESTINATION'):
        """Main shipping calculation."""
        # Implementation
```

### Verification Checklist
- [ ] ShippingCalculator class created
- [ ] SHIPPING_METHOD_CHOICES defined
- [ ] calculate_by_weight() method implemented
- [ ] calculate_by_destination() method implemented
- [ ] calculate_by_order_value() method implemented
- [ ] calculate_flat_rate() method implemented
- [ ] apply_shipping_promotions() method implemented
- [ ] calculate() main method implemented
- [ ] Sri Lanka shipping zones defined
- [ ] Free shipping threshold logic implemented
- [ ] Customer pickup (₨ 0) handled
- [ ] Multiple shipping methods supported

---

## Task 34: Create Order Recalculation Signal

### Overview
Implement Django signals to automatically recalculate order totals when line items or order data changes. This ensures data consistency without manual recalculation calls.

### Dependencies
- Task 30-33: All calculation services
- Django signals framework

### Instructions

1. **Create signals.py file in orders app**
   - Navigate to `apps/orders/` directory
   - Create `signals.py` file
   - Import necessary signal decorators

2. **Import required modules**
   - Import post_save, post_delete from django.db.models.signals
   - Import receiver decorator
   - Import Order and OrderLineItem models
   - Import OrderCalculationService

3. **Create line item save signal**
   - Create `@receiver(post_save, sender=OrderLineItem)`
   - Handler function: `recalculate_on_line_item_save`
   - Trigger recalculation when line item is saved
   - Avoid infinite recursion

4. **Create line item delete signal**
   - Create `@receiver(post_delete, sender=OrderLineItem)`
   - Handler function: `recalculate_on_line_item_delete`
   - Trigger recalculation when line item is deleted
   - Update order totals

5. **Create order modification signal**
   - Create `@receiver(post_save, sender=Order)`
   - Handler function: `recalculate_on_order_save`
   - Only recalculate on specific field changes
   - Check if discount or shipping changed

6. **Add signal registration in apps.py**
   - Import signals in OrdersConfig.ready() method
   - Ensure signals are registered on app startup
   - Add comment explaining signal registration

7. **Implement recursion prevention**
   - Use flag to prevent signal loops
   - Check if calculation is already in progress
   - Use update() instead of save() when updating from signal

8. **Add selective recalculation logic**
   - Only recalculate when necessary fields change
   - Skip recalculation for status-only updates
   - Optimize performance

9. **Document signal behavior**
   - Add comments explaining when signals fire
   - Document side effects
   - Note performance implications

### Signal Architecture

```
Signal Flow

Line Item Created/Updated
├── post_save signal fires
├── recalculate_on_line_item_save()
│   ├── Calculate line item totals
│   ├── Calculate order subtotal
│   ├── Calculate order tax
│   ├── Calculate shipping
│   └── Update order totals
└── Order.save() (update only)

Line Item Deleted
├── post_delete signal fires
├── recalculate_on_line_item_delete()
│   ├── Recalculate order without deleted item
│   └── Update order totals
└── Order.save() (update only)

Order Updated
├── post_save signal fires
├── Check if recalculation needed
│   ├── If discount changed: Recalculate
│   ├── If shipping method changed: Recalculate
│   └── If status only changed: Skip
└── Update if needed
```

### Line Item Save Signal

```python
from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from django.db import transaction
from .models import Order, OrderLineItem
from .services import OrderCalculationService

@receiver(post_save, sender=OrderLineItem)
def recalculate_on_line_item_save(sender, instance, created, **kwargs):
    """
    Recalculate order totals when line item is saved.
    
    Args:
        sender: OrderLineItem model class
        instance: The line item that was saved
        created: Boolean indicating if this is a new instance
        kwargs: Additional signal kwargs
    """
    # Avoid recursion: Check if we're already in a calculation
    if getattr(instance, '_skip_recalculation', False):
        return
    
    # Get the order
    order = instance.order
    
    # Perform calculation in transaction
    with transaction.atomic():
        # Lock the order to prevent concurrent modifications
        order = Order.objects.select_for_update().get(pk=order.pk)
        
        # Set flag to prevent recursion
        order._skip_recalculation = True
        
        # Recalculate order totals
        OrderCalculationService.calculate_order(order)
        
        # Remove flag
        order._skip_recalculation = False
```

### Line Item Delete Signal

```python
@receiver(post_delete, sender=OrderLineItem)
def recalculate_on_line_item_delete(sender, instance, **kwargs):
    """
    Recalculate order totals when line item is deleted.
    
    Args:
        sender: OrderLineItem model class
        instance: The line item that was deleted
        kwargs: Additional signal kwargs
    """
    # Get the order
    order = instance.order
    
    # Check if order still exists
    if not order:
        return
    
    # Perform calculation in transaction
    with transaction.atomic():
        # Lock the order
        order = Order.objects.select_for_update().get(pk=order.pk)
        
        # Set flag to prevent recursion
        order._skip_recalculation = True
        
        # Recalculate order totals
        # (will automatically skip the deleted line item)
        OrderCalculationService.calculate_order(order)
        
        # Remove flag
        order._skip_recalculation = False
```

### Order Save Signal (Selective)

```python
@receiver(post_save, sender=Order)
def recalculate_on_order_save(sender, instance, created, update_fields, **kwargs):
    """
    Recalculate order totals when certain order fields change.
    
    Args:
        sender: Order model class
        instance: The order that was saved
        created: Boolean indicating if this is a new instance
        update_fields: Set of fields that were updated
        kwargs: Additional signal kwargs
    """
    # Skip if this is a calculation-triggered save
    if getattr(instance, '_skip_recalculation', False):
        return
    
    # Skip if order is being created (no line items yet)
    if created:
        return
    
    # Fields that should trigger recalculation
    recalc_fields = {
        'discount_type',
        'discount_value',
        'discount_amount',
        'shipping_method',
        'coupon_code',
    }
    
    # Check if any recalc fields were updated
    if update_fields:
        should_recalc = any(field in update_fields for field in recalc_fields)
    else:
        # If update_fields is None, assume all fields updated
        should_recalc = True
    
    if should_recalc:
        with transaction.atomic():
            # Lock the order
            order = Order.objects.select_for_update().get(pk=instance.pk)
            
            # Set flag
            order._skip_recalculation = True
            
            # Recalculate
            OrderCalculationService.calculate_order(order)
            
            # Remove flag
            order._skip_recalculation = False
```

### Signal Registration in apps.py

```python
# apps/orders/apps.py

from django.apps import AppConfig

class OrdersConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'apps.orders'
    verbose_name = 'Orders'
    
    def ready(self):
        """
        Import signal handlers when app is ready.
        
        This ensures signals are registered and will fire when
        Order or OrderLineItem instances are saved/deleted.
        """
        import apps.orders.signals  # noqa
```

### Recursion Prevention Strategy

```
Recursion Problem:
1. Line item saved
2. Signal fires → calculate_order()
3. calculate_order() saves line item (updates line_total)
4. Signal fires again → infinite loop

Solution:
1. Line item saved
2. Signal fires → set _skip_recalculation flag
3. calculate_order() runs
4. When saving, check flag
5. If flag set, skip signal handler
6. Clear flag after calculation
```

### Performance Optimization

```python
# Avoid signal firing for bulk operations
@classmethod
def bulk_create_line_items(cls, order, line_items_data):
    """
    Create multiple line items without triggering signals.
    
    Args:
        order: Order instance
        line_items_data: List of line item data dicts
        
    Returns:
        List of created OrderLineItem instances
    """
    from django.db import transaction
    
    line_items = []
    
    with transaction.atomic():
        # Create all line items with signal disabled
        for data in line_items_data:
            line_item = OrderLineItem(**data, order=order)
            line_item._skip_recalculation = True
            line_items.append(line_item)
        
        # Bulk create (doesn't fire post_save signals)
        created_items = OrderLineItem.objects.bulk_create(line_items)
        
        # Single recalculation after all items created
        OrderCalculationService.calculate_order(order)
    
    return created_items
```

### Signal Testing Considerations

When testing, signals will fire automatically:

```python
# In tests
def test_order_recalculation_on_line_item_save():
    """Test that order recalculates when line item is saved."""
    
    # Create order
    order = Order.objects.create(customer=customer)
    
    # Create line item (signal will fire)
    line_item = OrderLineItem.objects.create(
        order=order,
        product=product,
        quantity_ordered=2,
        unit_price=Decimal('5000.00'),
        tax_rate=Decimal('18.00')
    )
    
    # Refresh order from database
    order.refresh_from_db()
    
    # Order should have calculated totals
    assert order.subtotal > 0
    assert order.tax_amount > 0
    assert order.total > 0
```

### Disabling Signals in Tests

```python
# If needed, disable signals in specific tests
from django.test import TestCase
from django.db.models import signals

class OrderCalculationTestCase(TestCase):
    def test_manual_calculation_without_signals(self):
        """Test calculation without automatic signals."""
        
        # Disconnect signals
        signals.post_save.disconnect(
            recalculate_on_line_item_save,
            sender=OrderLineItem
        )
        
        try:
            # Test without signals
            order = Order.objects.create(customer=customer)
            line_item = OrderLineItem.objects.create(
                order=order,
                product=product,
                quantity_ordered=1,
                unit_price=Decimal('1000.00')
            )
            
            # Order not automatically calculated
            assert order.total == 0
            
            # Manual calculation
            OrderCalculationService.calculate_order(order)
            
            # Now order has totals
            assert order.total > 0
            
        finally:
            # Reconnect signals
            signals.post_save.connect(
                recalculate_on_line_item_save,
                sender=OrderLineItem
            )
```

### Expected Outcome
```
apps/orders/
├── apps.py                  # Signal registration added
├── models/
│   ├── order.py
│   └── order_line_item.py
├── services/
│   └── calculation_service.py
└── signals.py               # New file - Task 34
```

### Verification Checklist
- [ ] `signals.py` file created
- [ ] post_save signal for OrderLineItem implemented
- [ ] post_delete signal for OrderLineItem implemented
- [ ] post_save signal for Order implemented (selective)
- [ ] Recursion prevention flag implemented
- [ ] Signal registration in apps.py ready() method
- [ ] Transaction management for thread safety
- [ ] Selective recalculation based on changed fields
- [ ] Performance optimization for bulk operations
- [ ] Signal behavior documented in comments

---

## Summary

### Tasks Completed in This Document
| Task # | Task Name | Key Deliverable |
|--------|-----------|-----------------|
| 30 | Create Order Calculation Service | OrderCalculationService class |
| 31 | Implement Line Total Calculator | LineItemCalculator class |
| 32 | Implement Order Tax Calculator | TaxCalculator class |
| 33 | Implement Shipping Calculator | ShippingCalculator class |
| 34 | Create Order Recalculation Signal | signals.py with auto-recalc |

### Complete Service Architecture

```
services/calculation_service.py
│
├── OrderCalculationService
│   ├── calculate_order()
│   ├── calculate_all_line_items()
│   ├── calculate_order_subtotal()
│   ├── calculate_order_tax()
│   ├── calculate_shipping()
│   ├── calculate_grand_total()
│   └── update_order_totals()
│
├── LineItemCalculator
│   ├── calculate_discount()
│   ├── calculate_line_tax()
│   ├── calculate()
│   └── validate_line_item()
│
├── TaxCalculator
│   ├── calculate_line_item_tax_total()
│   ├── calculate_order_level_tax()
│   ├── get_applicable_tax_rate()
│   ├── apply_tax_exemptions()
│   └── calculate()
│
└── ShippingCalculator
    ├── calculate_by_weight()
    ├── calculate_by_destination()
    ├── calculate_by_order_value()
    ├── calculate_flat_rate()
    ├── apply_shipping_promotions()
    └── calculate()

signals.py
├── recalculate_on_line_item_save()
├── recalculate_on_line_item_delete()
└── recalculate_on_order_save()
```

### Calculation Flow Summary

```
1. User adds/modifies line item
   ↓
2. Signal fires automatically
   ↓
3. OrderCalculationService.calculate_order()
   ↓
4. For each line item:
   ├── LineItemCalculator.calculate()
   │   ├── Calculate discount
   │   ├── Apply to unit_price
   │   ├── Calculate subtotal (qty × price)
   │   ├── Calculate tax
   │   └── Store line_total
   └── Save line item
   ↓
5. Sum all line_totals → order.subtotal
   ↓
6. TaxCalculator.calculate() → order.tax_amount
   ↓
7. ShippingCalculator.calculate() → order.shipping_fee
   ↓
8. Calculate grand total:
   subtotal - discount + tax + shipping
   ↓
9. Update Order model fields
   ↓
10. Order saved with current totals
```

### Group B Complete Deliverables

```
apps/orders/
├── models/
│   ├── __init__.py
│   ├── order.py              # From Group A
│   └── order_line_item.py    # Tasks 19-28 ✓
├── services/
│   ├── __init__.py
│   └── calculation_service.py  # Tasks 30-33 ✓
├── signals.py                  # Task 34 ✓
├── apps.py                     # Signal registration ✓
└── migrations/
    └── 0002_orderlineitem.py   # Task 29 ✓
```

### Key Features Implemented

1. **Complete Line Item Model:** 40+ fields for comprehensive order tracking
2. **Snapshot Pattern:** Prices and descriptions frozen at order time
3. **Flexible Discounts:** Percentage and fixed amount support
4. **Tax Calculations:** Sri Lanka VAT with exemptions
5. **Shipping Logic:** Multiple methods and zones
6. **Auto-Recalculation:** Signals keep totals synchronized
7. **Transaction Safety:** Atomic operations prevent data corruption
8. **Decimal Precision:** Accurate financial calculations

### Next Steps

1. **Proceed to Group C:** Order creation and source tracking
2. **Test Calculation Services:** Unit tests for all calculators
3. **Admin Integration:** Register models in Django admin
4. **API Endpoints:** Create APIs for order management
5. **UI Integration:** Connect frontend to order services

---

## Notes for AI Agents

1. **Service Layer:** All business logic in services, not models
2. **Decimal Usage:** Always use Decimal for money/quantity calculations
3. **Signal Caution:** Prevent infinite recursion with flags
4. **Transaction Management:** Use atomic() for data consistency
5. **Performance:** Optimize queries with select_related/prefetch_related
6. **Testing:** Test all calculation scenarios with edge cases
7. **Sri Lanka Context:** Tax rates and shipping zones specific to SL
8. **Error Handling:** Graceful handling of missing data
9. **Documentation:** Inline comments explain business logic
10. **Extensibility:** Easy to add new calculation methods or tax rules

