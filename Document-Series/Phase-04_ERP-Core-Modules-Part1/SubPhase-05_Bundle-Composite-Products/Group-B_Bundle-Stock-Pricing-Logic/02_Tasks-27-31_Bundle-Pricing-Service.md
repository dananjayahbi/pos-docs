# Tasks 27-31: Bundle Pricing Service

> **Phase:** 04 - ERP Core Modules Part 1  
> **SubPhase:** 05 - Bundle & Composite Products  
> **Group:** B - Bundle Stock & Pricing Logic  
> **Document:** 02 of 03  
> **Tasks Covered:** 27, 28, 29, 30, 31

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [01_Tasks-21-26_Bundle-Stock-Service.md](01_Tasks-21-26_Bundle-Stock-Service.md)
- **→ Next Document:** [03_Tasks-32-36_Bundle-Manager-Tests.md](03_Tasks-32-36_Bundle-Manager-Tests.md)

---

## Document Overview

This document implements the pricing calculation service for bundle products. Bundle pricing can be fixed (set price) or dynamic (calculated from component prices with optional discounts). The service handles both pricing strategies, applies discounts correctly, and calculates customer savings.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 27 | Create BundlePricingService Class | Medium | 10 min |
| 28 | Add calculate_fixed_price Method | Low | 5 min |
| 29 | Add calculate_dynamic_price Method | Medium | 10 min |
| 30 | Add apply_discount Method | Medium | 10 min |
| 31 | Add get_savings Method | Low | 5 min |

---

## Task 27: Create BundlePricingService Class

### Overview
Define the BundlePricingService class that handles all pricing calculations for bundles, supporting both fixed and dynamic pricing strategies.

### Dependencies
- Task 26: Add reserve_stock Method

### Instructions

1. **Define BundlePricingService class in bundle_services.py**
   - Place after BundleStockService in same file
   - No inheritance needed (utility class)
   - Can use instance or static methods

2. **Add class docstring**
   - Describe pricing calculation service
   - Note support for fixed and dynamic pricing
   - Mention discount application

3. **Add __init__ method structure**
   - Accept bundle parameter
   - Store as self.bundle
   - Alternative: use static methods

4. **Plan method structure**
   - calculate_fixed_price: return fixed price
   - calculate_dynamic_price: sum components
   - apply_discount: apply discount to price
   - get_savings: calculate customer savings

5. **Import Decimal for precision**
   - Use Decimal for all monetary calculations
   - Avoid floating-point precision issues
   - Round to 2 decimal places (LKR paise)

### Expected Outcome
BundlePricingService class is defined and ready for method implementations.

### Verification Checklist
- [ ] BundlePricingService class defined
- [ ] Class docstring present
- [ ] __init__ method planned
- [ ] Decimal import available

---

## Task 28: Add calculate_fixed_price Method

### Overview
Implement method to return the fixed price for bundles with bundle_type='fixed'. This is the simplest pricing strategy where the bundle has a predetermined price.

### Dependencies
- Task 27: Create BundlePricingService Class

### Instructions

1. **Define calculate_fixed_price method**
   - Returns the fixed_price field value
   - No calculations needed
   - Return as Decimal type

2. **Validate bundle configuration**
   - Check bundle_type is 'fixed'
   - Ensure fixed_price is set
   - Raise ValueError if misconfigured

3. **Handle optional items**
   - Note: Optional items in fixed-price bundles
   - May have additional charges (future enhancement)
   - Current: fixed price includes all

4. **Return price as Decimal**
   - Return self.bundle.fixed_price
   - Ensure Decimal type for consistency
   - Round to 2 decimal places

### Method Implementation
```
Fixed Price Logic:
  - Return bundle.fixed_price directly
  - No component price calculation
  - Discounts not applicable (already in fixed price)
```

### Expected Outcome
Method returns fixed price for fixed-type bundles.

### Verification Checklist
- [ ] Method returns fixed_price
- [ ] Validates bundle configuration
- [ ] Returns Decimal type
- [ ] Handles edge cases

---

## Task 29: Add calculate_dynamic_price Method

### Overview
Implement method to calculate bundle price from component product prices. This method sums the prices of all components, considering quantities and variants.

### Dependencies
- Task 28: Add calculate_fixed_price Method

### Instructions

1. **Define calculate_dynamic_price method**
   - Calculate sum of component prices
   - Consider item quantities
   - Handle variant pricing

2. **Retrieve bundle items**
   - Get all items (required and optional)
   - Use select_related for efficiency
   - Prefetch product/variant data

3. **Calculate component total**
   - For each item:
     - Get product or variant price
     - Multiply by item quantity
     - Add to running total

4. **Handle pricing priority**
   - If variant specified: use variant price
   - Otherwise: use product price
   - Use selling_price or retail_price field

5. **Handle optional items**
   - Include required items always
   - Optional items handled separately
   - Consider includeOptional parameter

6. **Return total as Decimal**
   - Sum all component prices
   - Return before discount application
   - Round to 2 decimal places

### Calculation Algorithm
```
total = Decimal('0.00')

For each BundleItem:
    if item.variant:
        price = item.variant.selling_price
    else:
        price = item.product.selling_price
    
    item_total = price * item.quantity
    total += item_total

return total
```

### Calculation Examples

**Example 1: Simple Components**
```
Bundle Items:
  - Tea Box (Rs. 1,500) × 1 = Rs. 1,500
  - Cookies (Rs. 800) × 2 = Rs. 1,600
  - Gift Bag (Rs. 200) × 1 = Rs. 200

Dynamic Price: Rs. 3,300 (before discount)
```

**Example 2: With Variants**
```
Bundle Items:
  - Tea (variant: Green, Rs. 1,800) × 1 = Rs. 1,800
  - Tea (variant: Black, Rs. 1,600) × 1 = Rs. 1,600
  - Cookies (base: Rs. 800) × 1 = Rs. 800

Dynamic Price: Rs. 4,200 (before discount)
```

### Expected Outcome
Method calculates total price from all bundle components.

### Verification Checklist
- [ ] Sums all component prices
- [ ] Multiplies by quantities
- [ ] Handles variant pricing
- [ ] Returns Decimal type
- [ ] Efficient query usage

---

## Task 30: Add apply_discount Method

### Overview
Implement method to apply discount to the calculated price based on discount_type (percentage or fixed amount).

### Dependencies
- Task 29: Add calculate_dynamic_price Method

### Instructions

1. **Define apply_discount method**
   - Parameters: base_price (Decimal)
   - Returns: discounted price (Decimal)
   - Applies discount based on type

2. **Check discount configuration**
   - Get bundle.discount_type
   - Get bundle.discount_value
   - Handle 'none' discount type

3. **Implement percentage discount**
   - Formula: base_price * (1 - discount_value / 100)
   - Example: Rs. 3,300 - 10% = Rs. 2,970
   - Validate: discount_value should be 0-100

4. **Implement fixed amount discount**
   - Formula: base_price - discount_value
   - Example: Rs. 3,300 - Rs. 500 = Rs. 2,800
   - Validate: result should not be negative

5. **Handle 'none' discount type**
   - Return base_price unchanged
   - No discount applied

6. **Validate final price**
   - Ensure price is not negative
   - Return minimum of 0.00
   - Round to 2 decimal places

### Discount Application Algorithm
```
def apply_discount(base_price):
    if discount_type == 'none':
        return base_price
    
    if discount_type == 'percentage':
        discount_amount = base_price * (discount_value / 100)
        final_price = base_price - discount_amount
    
    elif discount_type == 'fixed':
        final_price = base_price - discount_value
    
    # Ensure non-negative
    final_price = max(final_price, Decimal('0.00'))
    
    return final_price
```

### Discount Examples

**Percentage Discount:**
```
Base Price: Rs. 3,300
Discount: 10% (percentage)
Calculation: Rs. 3,300 - (Rs. 3,300 × 0.10) = Rs. 2,970
Final Price: Rs. 2,970
```

**Fixed Amount Discount:**
```
Base Price: Rs. 3,300
Discount: Rs. 500 (fixed)
Calculation: Rs. 3,300 - Rs. 500 = Rs. 2,800
Final Price: Rs. 2,800
```

**No Discount:**
```
Base Price: Rs. 3,300
Discount: none
Final Price: Rs. 3,300
```

### Expected Outcome
Method correctly applies discounts based on type and value.

### Verification Checklist
- [ ] Handles percentage discounts
- [ ] Handles fixed discounts
- [ ] Handles no discount
- [ ] Validates discount values
- [ ] Prevents negative prices
- [ ] Returns Decimal type

---

## Task 31: Add get_savings Method

### Overview
Implement method to calculate how much customer saves by purchasing the bundle compared to buying items individually.

### Dependencies
- Task 30: Add apply_discount Method

### Instructions

1. **Define get_savings method**
   - Calculate savings from bundle purchase
   - Compare individual vs bundle price
   - Return savings amount

2. **Calculate individual total**
   - Sum of all component prices
   - Same as dynamic price calculation
   - Use calculate_dynamic_price method

3. **Calculate bundle price**
   - For fixed bundles: use fixed_price
   - For dynamic bundles: use dynamic price with discount
   - Apply appropriate pricing logic

4. **Calculate savings**
   - Formula: individual_total - bundle_price
   - Positive value indicates savings
   - Zero or negative means no savings

5. **Return savings as Decimal**
   - Return absolute savings amount
   - Include in bundle display
   - Useful for marketing

6. **Handle edge cases**
   - Fixed bundle may be more expensive
   - Return 0 if no savings
   - Consider returning negative (extra cost)

### Savings Calculation
```
individual_total = calculate_dynamic_price()

if bundle_type == 'fixed':
    bundle_price = fixed_price
else:
    bundle_price = apply_discount(individual_total)

savings = individual_total - bundle_price
return max(savings, Decimal('0.00'))
```

### Savings Examples

**Example 1: Dynamic with Discount**
```
Individual Total: Rs. 3,300
Bundle Price: Rs. 2,970 (with 10% discount)
Savings: Rs. 330
Percentage: 10%
```

**Example 2: Fixed Price Bundle**
```
Individual Total: Rs. 3,300
Bundle Price: Rs. 2,999 (fixed)
Savings: Rs. 301
Percentage: 9.1%
```

**Example 3: No Savings**
```
Individual Total: Rs. 3,300
Bundle Price: Rs. 3,300 (no discount)
Savings: Rs. 0
```

### Expected Outcome
Method calculates customer savings from bundle purchase.

### Verification Checklist
- [ ] Calculates individual total
- [ ] Determines bundle price correctly
- [ ] Returns savings amount
- [ ] Handles both bundle types
- [ ] Returns Decimal type
- [ ] Handles no-savings case

---

## Summary of Tasks 27-31

### What Was Accomplished
- Created BundlePricingService class
- Implemented fixed price retrieval
- Developed dynamic price calculation
- Added discount application logic
- Calculated customer savings

### BundlePricingService Methods
```
BundlePricingService:
  ├── calculate_fixed_price() → Decimal
  │     Return fixed price for fixed-type bundles
  │
  ├── calculate_dynamic_price() → Decimal
  │     Sum component prices × quantities
  │
  ├── apply_discount(base_price) → Decimal
  │     Apply percentage or fixed discount
  │
  └── get_savings() → Decimal
        Calculate customer savings from bundle
```

### Pricing Formulas

**Fixed Pricing:**
```
Bundle Price = fixed_price
Savings = sum(component_prices) - fixed_price
```

**Dynamic Pricing with Percentage Discount:**
```
Base Price = sum(component_price × quantity)
Discount = Base Price × (discount_value / 100)
Bundle Price = Base Price - Discount
Savings = Base Price - Bundle Price
```

**Dynamic Pricing with Fixed Discount:**
```
Base Price = sum(component_price × quantity)
Bundle Price = Base Price - discount_value
Savings = discount_value
```

### Next Steps
The next document will create a custom Bundle Manager for optimized queries and add initial tests.

---

## Notes for Developers

### Decimal Precision
- Always use Decimal for monetary values
- Avoid float for currency calculations
- Round to 2 decimal places (LKR paise)
- Use string initialization: Decimal('10.00')

### Pricing Priority
- Variant price overrides product price
- Use selling_price or retail_price field
- Handle missing prices gracefully
- Default to zero if price not set

### Discount Validation
- Percentage: 0-100 range
- Fixed: should not exceed base price
- Prevent negative final prices
- Validate in model clean() method

### Sri Lanka Currency
- Currency: LKR (Sri Lankan Rupees)
- Symbol: Rs. or ₨
- Format: Rs. 1,250.75
- No decimal for whole amounts: Rs. 1,250

### Testing Requirements
- Test fixed pricing
- Test dynamic pricing
- Test percentage discounts
- Test fixed discounts
- Test savings calculation
- Test edge cases (zero prices, large discounts)

---
