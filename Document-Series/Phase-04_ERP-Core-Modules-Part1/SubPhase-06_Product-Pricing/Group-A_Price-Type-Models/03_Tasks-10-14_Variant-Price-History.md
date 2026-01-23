# Tasks 10-14: Variant Price & History Models

> **Phase:** 04 - ERP Core Modules Part 1  
> **SubPhase:** 06 - Product Pricing  
> **Group:** A - Price Type Models  
> **Document:** 03 of 04  
> **Tasks Covered:** 10, 11, 12, 13, 14

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [02_Tasks-05-09_Price-Fields-Manager.md](02_Tasks-05-09_Price-Fields-Manager.md)
- **→ Next Document:** [04_Tasks-15-18_Signals-Utils-Admin.md](04_Tasks-15-18_Signals-Utils-Admin.md)

---

## Document Overview

This document covers variant-level pricing for products with multiple variations (size, color, etc.), price override logic, validation methods, and price history tracking for audit compliance. These features enable flexible pricing at the SKU level and maintain a complete audit trail of all price changes in the multi-tenant ERP system.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 10 | Create VariantPrice model | Medium | 30 min |
| 11 | Add VariantPrice override logic | Low | 15 min |
| 12 | Create price validation methods | Medium | 25 min |
| 13 | Add profit margin calculation | Low | 20 min |
| 14 | Create price history model | Medium | 30 min |

---

## Task 10: Create VariantPrice Model

### Overview
Create the VariantPrice model to handle pricing for product variants (different sizes, colors, configurations). Variants can either inherit the parent product's pricing or define their own specific prices, supporting flexible pricing strategies for multi-option products.

### Dependencies
- Task 04: ProductPrice model exists
- ProductVariant model exists (from SubPhase-02)

### Instructions

1. **Create `variant_price.py` file**
   - Create in `backend/apps/products/pricing/models/`
   - This file contains the VariantPrice model

2. **Import required modules**
   - Import Django model classes and fields
   - Import `PriceField` from `..fields`
   - Import `BaseModel` from core models
   - Import `ProductVariant` from products app

3. **Define VariantPrice class**
   - Inherit from `BaseModel` for tenant isolation
   - Add comprehensive docstring explaining variant pricing

4. **Add variant relationship field**
   - Create `OneToOneField` to `ProductVariant` model
   - Set `on_delete=models.CASCADE`
   - Set `related_name='price'`
   - Set `verbose_name='Product Variant'`
   - One variant has one price configuration

5. **Add use_product_price field**
   - Use `BooleanField`
   - Set `default=True`
   - Set `verbose_name='Use Product Price'`
   - Set `help_text` explaining inheritance
   - If True, inherits all prices from parent product

6. **Add variant-specific price fields**
   - Add `base_price` - PriceField, null=True, blank=True
   - Add `sale_price` - PriceField, null=True, blank=True
   - Add `wholesale_price` - PriceField, null=True, blank=True
   - Add `cost_price` - PriceField, null=True, blank=True
   - All optional - only used if use_product_price=False

7. **Add sale date fields**
   - Add `sale_price_start` - DateTimeField, null=True, blank=True
   - Add `sale_price_end` - DateTimeField, null=True, blank=True
   - Variant-specific sale periods

8. **Add price_adjustment_type field**
   - Use `CharField` with choices
   - Choices: 'FIXED', 'PERCENTAGE'
   - Set `max_length=20`
   - Set `null=True`, `blank=True`
   - Defines how variant price differs from product

9. **Add price_adjustment_value field**
   - Use `DecimalField`
   - Set `max_digits=12`, `decimal_places=2`
   - Set `null=True`, `blank=True`
   - Value for fixed amount or percentage adjustment
   - Example: +₨100 or +10%

10. **Add variant pricing notes field**
    - Use `TextField`
    - Set `blank=True`, `null=True`
    - Set `verbose_name='Variant Pricing Notes'`
    - Internal notes about variant-specific pricing

### VariantPrice Model Fields

| Field | Type | Purpose | Required |
|-------|------|---------|----------|
| `variant` | OneToOneField | Link to ProductVariant | Yes |
| `use_product_price` | BooleanField | Inherit parent pricing | Yes |
| `base_price` | PriceField | Variant-specific base price | No |
| `sale_price` | PriceField | Variant-specific sale price | No |
| `wholesale_price` | PriceField | Variant-specific wholesale | No |
| `cost_price` | PriceField | Variant-specific cost | No |
| `sale_price_start` | DateTimeField | Variant sale start | No |
| `sale_price_end` | DateTimeField | Variant sale end | No |
| `price_adjustment_type` | CharField | FIXED or PERCENTAGE | No |
| `price_adjustment_value` | DecimalField | Adjustment amount/percent | No |

### Price Inheritance Logic

```
Get Variant Price:
  1. Check use_product_price flag
  
  2. If True:
     → Use product.price.base_price
     → Use product.price.sale_price
     → Use product.price.wholesale_price
  
  3. If False:
     → Use variant.price.base_price
     → Use variant.price.sale_price
     → Use variant.price.wholesale_price
  
  4. Apply price_adjustment if set:
     → FIXED: base_price + adjustment_value
     → PERCENTAGE: base_price * (1 + adjustment_value/100)
```

### Business Examples

**Example 1: T-Shirt with Size Variants**
- Product: Cotton T-Shirt
- Product Base Price: ₨ 1,000.00
- Small/Medium: use_product_price=True (₨ 1,000.00)
- Large: adjustment_type=FIXED, adjustment_value=100 (₨ 1,100.00)
- XL: adjustment_type=PERCENTAGE, adjustment_value=20 (₨ 1,200.00)

**Example 2: Phone with Storage Variants**
- Product: Smartphone
- 64GB: use_product_price=True (₨ 45,000.00)
- 128GB: use_product_price=False, base_price=₨ 55,000.00
- 256GB: use_product_price=False, base_price=₨ 65,000.00

**Example 3: Laptop with Configuration**
- Product: Laptop Base Model
- i5/8GB: use_product_price=True (₨ 120,000.00)
- i7/16GB: adjustment_type=FIXED, adjustment_value=25000 (₨ 145,000.00)
- i7/32GB: use_product_price=False, base_price=₨ 180,000.00

### Price Adjustment Types

| Type | Description | Example |
|------|-------------|---------|
| **FIXED** | Add/subtract fixed amount | +₨ 500.00 |
| **PERCENTAGE** | Add/subtract percentage | +15% |
| **None** | Use explicit variant price | Direct price |

### Sri Lanka Business Context

- **Clothing:** Size premiums common (XL, XXL +10-20%)
- **Electronics:** Storage/memory upgrades have fixed increments
- **Furniture:** Custom sizes have percentage-based pricing
- **Food:** Package size affects unit pricing differently

### Validation Rules

| Rule | Validation |
|------|------------|
| Price Override | If use_product_price=False, base_price required |
| Adjustment Logic | If adjustment set, calculate from product price |
| Sale Dates | Variant sale dates override product sale dates |
| Cost Tracking | Variant cost_price overrides product cost_price |

### Expected Outcome

A complete VariantPrice model that enables flexible variant-level pricing with inheritance options, price adjustments, and override capabilities.

### Verification Checklist

- [ ] `variant_price.py` file created in models directory
- [ ] `VariantPrice` class inherits from `BaseModel`
- [ ] `variant` OneToOneField to ProductVariant
- [ ] `use_product_price` BooleanField with default True
- [ ] All price fields (base, sale, wholesale, cost) added as optional
- [ ] Sale date fields added for variant-specific sales
- [ ] `price_adjustment_type` with FIXED/PERCENTAGE choices
- [ ] `price_adjustment_value` DecimalField for adjustments
- [ ] Model imported in `models/__init__.py`

---

## Task 11: Add VariantPrice Override Logic

### Overview
Implement methods in the VariantPrice model to handle price inheritance logic, calculate effective prices with adjustments, and determine which price source to use (product vs variant).

### Dependencies
- Task 10: Create VariantPrice model

### Instructions

1. **Open `variant_price.py` file**
   - Continue editing the VariantPrice model

2. **Add get_base_price method**
   - Create instance method
   - If `use_product_price` is True:
     - Return `variant.product.price.base_price`
   - If False and `base_price` is set:
     - Return `self.base_price`
   - If `price_adjustment_type` is set:
     - Apply adjustment to product price
   - Return calculated/inherited price

3. **Add get_sale_price method**
   - Create instance method
   - Check if variant has active sale (own sale dates)
   - If `use_product_price` and no variant sale:
     - Check product sale dates
     - Return `variant.product.price.sale_price`
   - If variant has sale_price and active dates:
     - Return `self.sale_price`
   - Return None if no active sale

4. **Add get_wholesale_price method**
   - Create instance method
   - If `use_product_price`:
     - Return `variant.product.price.wholesale_price`
   - Else return `self.wholesale_price`
   - Apply adjustments if configured

5. **Add get_cost_price method**
   - Create instance method
   - If `use_product_price`:
     - Return `variant.product.price.cost_price`
   - Else return `self.cost_price`
   - Used for variant-specific profit margins

6. **Add apply_price_adjustment method**
   - Create instance method
   - Accept `base_amount` parameter
   - If `price_adjustment_type` is 'FIXED':
     - Return `base_amount + price_adjustment_value`
   - If `price_adjustment_type` is 'PERCENTAGE':
     - Return `base_amount * (1 + price_adjustment_value / 100)`
   - Return `base_amount` if no adjustment

7. **Add get_effective_price method**
   - Create instance method
   - Accept optional `customer_type` parameter
   - Check for active sale (variant or product)
   - Check wholesale eligibility
   - Return appropriate price based on customer type
   - Priority: variant sale > product sale > wholesale > base

8. **Add is_on_sale property**
   - Create `@property` decorated method
   - Check variant sale dates first
   - Fall back to product sale dates if using product price
   - Return True if currently on sale

9. **Add has_price_override property**
   - Create `@property` decorated method
   - Return True if `use_product_price` is False
   - Or if `price_adjustment_type` is set
   - Indicates variant has custom pricing

10. **Add get_pricing_source method**
    - Create instance method
    - Return string indicating price source
    - Values: 'variant', 'product', 'product_with_adjustment'
    - Useful for display and debugging

### Price Resolution Methods

| Method | Purpose | Returns |
|--------|---------|---------|
| `get_base_price()` | Effective base price | Decimal |
| `get_sale_price()` | Active sale price or None | Decimal/None |
| `get_wholesale_price()` | Wholesale price | Decimal |
| `get_cost_price()` | Cost for margins | Decimal |
| `apply_price_adjustment(amount)` | Apply adjustment | Decimal |
| `get_effective_price(customer_type)` | Final price | Decimal |

### Price Priority Logic

```
Variant Price Resolution:
  1. Has variant-specific sale active?
     → Return variant.sale_price
  
  2. Using product price and product sale active?
     → Return product.sale_price (with adjustment if any)
  
  3. Wholesale customer?
     → Return wholesale_price (variant or product)
  
  4. Default:
     → Return base_price (variant or product with adjustment)
```

### Example Scenarios

**Scenario 1: Full Inheritance**
```
T-Shirt - Medium Size:
  use_product_price = True
  price_adjustment = None
  
  get_base_price() → Product base price
  get_sale_price() → Product sale price (if active)
  Source: 'product'
```

**Scenario 2: With Fixed Adjustment**
```
T-Shirt - XL Size:
  use_product_price = True
  price_adjustment_type = 'FIXED'
  price_adjustment_value = 100.00
  
  get_base_price() → Product base + ₨100
  get_sale_price() → Product sale + ₨100 (if active)
  Source: 'product_with_adjustment'
```

**Scenario 3: Complete Override**
```
Phone - 256GB:
  use_product_price = False
  base_price = ₨65,000.00
  sale_price = ₨59,999.00
  
  get_base_price() → ₨65,000.00
  get_sale_price() → ₨59,999.00
  Source: 'variant'
```

**Scenario 4: Variant Sale, Product Base**
```
Laptop - i7 Config:
  use_product_price = True (base price)
  sale_price = ₨135,000.00 (variant-specific)
  sale_price_start/end = Active
  
  get_base_price() → Product base
  get_sale_price() → Variant sale price
  Priority: Variant sale overrides product sale
```

### Adjustment Calculations

| Base Price | Adjustment Type | Adjustment Value | Result |
|------------|----------------|------------------|--------|
| ₨ 1,000.00 | FIXED | 200.00 | ₨ 1,200.00 |
| ₨ 1,000.00 | PERCENTAGE | 15 | ₨ 1,150.00 |
| ₨ 50,000.00 | FIXED | -5,000.00 | ₨ 45,000.00 |
| ₨ 50,000.00 | PERCENTAGE | 20 | ₨ 60,000.00 |

### Expected Outcome

Complete price inheritance and override logic implemented in VariantPrice model, enabling flexible variant pricing strategies.

### Verification Checklist

- [ ] `get_base_price()` method handles inheritance and adjustments
- [ ] `get_sale_price()` checks variant and product sale dates
- [ ] `get_wholesale_price()` returns appropriate wholesale price
- [ ] `get_cost_price()` returns variant or product cost
- [ ] `apply_price_adjustment()` handles FIXED and PERCENTAGE
- [ ] `get_effective_price()` resolves final price with priority
- [ ] `is_on_sale` property checks variant and product sales
- [ ] `has_price_override` property indicates custom pricing
- [ ] `get_pricing_source()` returns source indicator

---

## Task 12: Create Price Validation Methods

### Overview
Add comprehensive validation methods to both ProductPrice and VariantPrice models to ensure price integrity, business rule compliance, and data consistency across the pricing system.

### Dependencies
- Task 04: ProductPrice model complete
- Task 11: VariantPrice override logic complete

### Instructions

1. **Open `product_price.py` file**
   - Add validation methods to ProductPrice model

2. **Enhance clean method in ProductPrice**
   - Override `clean()` method from Django Model
   - Validate sale_price < base_price if set
   - Validate wholesale_price < base_price if set
   - Validate cost_price <= base_price if set
   - Validate sale date range (start < end)
   - Validate tax exemption logic
   - Raise `ValidationError` with specific messages
   - Import `ValidationError` from `django.core.exceptions`

3. **Add validate_profit_margin method to ProductPrice**
   - Create instance method
   - Accept `minimum_margin` parameter (default 0)
   - Calculate current profit margin
   - Check if margin >= minimum_margin
   - Raise ValidationError if below minimum
   - Used for business rule enforcement

4. **Add validate_sale_price method to ProductPrice**
   - Create instance method
   - Check if sale_price is set
   - Ensure sale dates are also set
   - Ensure sale_price < base_price
   - Ensure sale_price > cost_price (if set)
   - Raise ValidationError with details

5. **Add validate_wholesale_pricing method to ProductPrice**
   - Create instance method
   - If wholesale_price set, validate:
     - wholesale_price < base_price
     - wholesale_price >= cost_price (prevent loss)
     - minimum_wholesale_quantity > 0
   - Raise ValidationError if invalid

6. **Open `variant_price.py` file**
   - Add validation methods to VariantPrice model

7. **Implement clean method in VariantPrice**
   - Override `clean()` method
   - If `use_product_price` is False:
     - Ensure `base_price` is set
   - If `price_adjustment` is set:
     - Validate adjustment_value is set
   - Validate variant sale dates
   - Validate variant prices against limits
   - Raise `ValidationError` with details

8. **Add validate_price_override method to VariantPrice**
   - Create instance method
   - If not using product price:
     - Ensure base_price is provided
     - Validate variant price > variant cost (if set)
   - If using adjustment:
     - Ensure adjustment_type and value both set
     - Validate calculated price is positive

9. **Add validate_against_product_price method to VariantPrice**
   - Create instance method
   - Get product base price
   - Get variant effective price
   - Validate variant price is reasonable vs product
   - Warn if variant price < 50% of product price
   - Warn if variant price > 300% of product price
   - Return validation warnings (not errors)

10. **Add cross-model validation**
    - Create standalone validation function
    - Check pricing consistency across variants
    - Ensure no pricing gaps or anomalies
    - Return list of warnings/errors

### Validation Rules Summary

| Model | Rule | Error Message |
|-------|------|---------------|
| ProductPrice | sale_price < base_price | "Sale price must be less than base price" |
| ProductPrice | wholesale_price < base_price | "Wholesale price must be less than base price" |
| ProductPrice | cost_price <= base_price | "Cost price cannot exceed base price" |
| ProductPrice | sale_start < sale_end | "Sale start must be before sale end" |
| ProductPrice | wholesale_price >= cost_price | "Wholesale price must cover cost" |
| VariantPrice | base_price required if override | "Base price required when not using product price" |
| VariantPrice | adjustment needs value | "Adjustment value required when type is set" |
| VariantPrice | variant price > 0 | "Variant price must be positive" |

### Validation Examples

**Valid ProductPrice:**
```
Base Price: ₨ 10,000.00
Cost Price: ₨ 7,000.00
Sale Price: ₨ 8,500.00
Wholesale Price: ₨ 7,500.00
Profit Margin: 30%
All validations pass ✓
```

**Invalid ProductPrice:**
```
Base Price: ₨ 10,000.00
Cost Price: ₨ 7,000.00
Sale Price: ₨ 12,000.00  ← Error: exceeds base
Wholesale Price: ₨ 6,500.00  ← Error: below cost
Validation fails ✗
```

**Valid VariantPrice:**
```
use_product_price: True
price_adjustment_type: FIXED
price_adjustment_value: 500.00
Calculated price: ₨ 10,500.00
All validations pass ✓
```

**Invalid VariantPrice:**
```
use_product_price: False
base_price: None  ← Error: required
price_adjustment_type: PERCENTAGE
price_adjustment_value: None  ← Error: required
Validation fails ✗
```

### Profit Margin Validation

| Product Type | Minimum Margin | Reason |
|-------------|---------------|--------|
| Grocery/FMCG | 10% | Low margin, high volume |
| Electronics | 15% | Standard retail margin |
| Fashion | 40% | Higher markup expected |
| Luxury | 60% | Premium pricing |

### Business Rule Validations

**Rule 1: Loss Prevention**
- Wholesale price must cover cost price
- Prevents selling at a loss
- Alert if margin < 5%

**Rule 2: Sale Logic**
- Sale price must have start and end dates
- Prevents perpetual "sales"
- Ensures promotional integrity

**Rule 3: Variant Consistency**
- Variant prices should be within reasonable range of product price
- Alert if variant is 3x product price
- Prevents data entry errors

### Expected Outcome

Comprehensive validation methods in both ProductPrice and VariantPrice models ensuring data integrity and business rule compliance.

### Verification Checklist

- [ ] `clean()` method in ProductPrice validates all price relationships
- [ ] `validate_profit_margin()` enforces minimum margin
- [ ] `validate_sale_price()` checks sale price logic
- [ ] `validate_wholesale_pricing()` ensures profitability
- [ ] `clean()` method in VariantPrice validates override logic
- [ ] `validate_price_override()` checks variant pricing
- [ ] `validate_against_product_price()` warns of anomalies
- [ ] All ValidationError messages are clear and actionable
- [ ] Business rules enforced (cost < wholesale < sale < base)

---

## Task 13: Add Profit Margin Calculation

### Overview
Implement comprehensive profit margin calculation methods for both product-level and variant-level pricing, including gross margin, markup percentage, and break-even analysis for business intelligence.

### Dependencies
- Task 12: Price validation methods complete

### Instructions

1. **Open `product_price.py` file**
   - Add profit calculation methods to ProductPrice

2. **Enhance profit_margin property**
   - This property already exists from Task 04
   - Enhance to handle edge cases
   - Return None if cost_price is None
   - Return 0 if base_price is 0
   - Return percentage with 2 decimal precision

3. **Add markup_percentage property**
   - Create `@property` decorated method
   - Calculate: `((base_price - cost_price) / cost_price) * 100`
   - Different from margin - uses cost as base
   - Return None if cost_price is None or 0

4. **Add profit_per_unit property**
   - Create `@property` decorated method
   - Calculate: `base_price - cost_price`
   - Return absolute profit amount
   - Return None if cost_price is None

5. **Add sale_profit_margin property**
   - Create `@property` decorated method
   - Calculate margin using sale_price instead of base_price
   - Only applicable when is_on_sale is True
   - Return None if not on sale or no cost_price

6. **Add wholesale_profit_margin property**
   - Create `@property` decorated method
   - Calculate margin using wholesale_price
   - Return None if wholesale_price or cost_price not set

7. **Add break_even_quantity method**
   - Create instance method
   - Accept `fixed_costs` parameter (overhead, expenses)
   - Calculate: `fixed_costs / profit_per_unit`
   - Return number of units needed to cover fixed costs
   - Return None if no profit per unit

8. **Add get_margin_for_price method**
   - Create instance method
   - Accept `selling_price` parameter
   - Calculate margin for any given selling price
   - Useful for "what-if" scenarios
   - Return calculated margin percentage

9. **Open `variant_price.py` file**
   - Add profit calculations for variants

10. **Add profit_margin property to VariantPrice**
    - Create `@property` decorated method
    - Get effective base price (variant or product)
    - Get effective cost price (variant or product)
    - Calculate margin: `((base - cost) / base) * 100`
    - Return None if cost not available

11. **Add variant_vs_product_margin method to VariantPrice**
    - Create instance method
    - Compare variant margin to product margin
    - Return difference in margin percentage
    - Positive means variant is more profitable
    - Useful for variant profitability analysis

12. **Add get_margin_comparison method to VariantPrice**
    - Create instance method
    - Return dictionary with:
      - variant_margin
      - product_margin
      - difference
      - percentage_change
    - Comprehensive margin analysis

### Profit Calculation Formulas

| Metric | Formula | Example |
|--------|---------|---------|
| **Profit Margin** | ((Price - Cost) / Price) × 100 | ((1000 - 700) / 1000) × 100 = 30% |
| **Markup %** | ((Price - Cost) / Cost) × 100 | ((1000 - 700) / 700) × 100 = 42.86% |
| **Profit per Unit** | Price - Cost | 1000 - 700 = ₨ 300 |
| **Break-even Qty** | Fixed Costs / Profit per Unit | 50,000 / 300 = 167 units |

### Margin vs Markup

| Price | Cost | Margin | Markup |
|-------|------|--------|--------|
| ₨ 1,000 | ₨ 700 | 30% | 42.86% |
| ₨ 5,000 | ₨ 3,000 | 40% | 66.67% |
| ₨ 850 | ₨ 500 | 41.18% | 70% |

**Key Difference:**
- **Margin:** Based on selling price (what you keep)
- **Markup:** Based on cost (how much you add)

### Business Examples

**Example 1: Electronics Store**
```
Product: Laptop
Base Price: ₨ 120,000.00
Cost Price: ₨ 90,000.00
Profit Margin: 25%
Markup: 33.33%
Profit per Unit: ₨ 30,000.00

Fixed Costs: ₨ 500,000/month
Break-even: 17 units/month
```

**Example 2: Grocery Store**
```
Product: Rice 5kg
Base Price: ₨ 1,250.00
Cost Price: ₨ 1,000.00
Profit Margin: 20%
Markup: 25%
Profit per Unit: ₨ 250.00

Sale Price: ₨ 1,150.00
Sale Margin: 13.04%
```

**Example 3: Clothing Store**
```
Product: T-Shirt
Product Margin: 40%

Variant: Small - Same cost
Variant Margin: 40%
Difference: 0%

Variant: XL - Higher cost (+₨100)
Variant Margin: 35%
Difference: -5%
```

### Profitability Analysis

| Product | Margin | Target | Status |
|---------|--------|--------|--------|
| Laptops | 25% | 20% | ✓ Above target |
| Rice | 13% | 10% | ✓ Above target |
| Fashion | 45% | 40% | ✓ Above target |
| Promo Item | 8% | 10% | ✗ Below target |

### Variant Margin Comparison

```
Product: Smartphone
Product Margin: 20%

Variants:
- 64GB:  Margin 20% (±0%)
- 128GB: Margin 22% (+2%)
- 256GB: Margin 24% (+4%)

Higher storage variants are more profitable
```

### Expected Outcome

Comprehensive profit margin calculations for products and variants, enabling detailed profitability analysis and business intelligence.

### Verification Checklist

- [ ] `profit_margin` property in ProductPrice handles edge cases
- [ ] `markup_percentage` property calculates cost-based markup
- [ ] `profit_per_unit` property returns absolute profit
- [ ] `sale_profit_margin` property for sale pricing
- [ ] `wholesale_profit_margin` property for B2B pricing
- [ ] `break_even_quantity()` method calculates break-even
- [ ] `get_margin_for_price()` method for what-if analysis
- [ ] `profit_margin` property added to VariantPrice
- [ ] `variant_vs_product_margin()` compares margins
- [ ] `get_margin_comparison()` returns comprehensive analysis

---

## Task 14: Create Price History Model

### Overview
Create the PriceHistory model to maintain a complete audit trail of all price changes, tracking what changed, when, who made the change, and the reason. Essential for compliance, analysis, and dispute resolution in the multi-tenant ERP system.

### Dependencies
- Task 04: ProductPrice model complete
- Task 10: VariantPrice model complete

### Instructions

1. **Create `price_history.py` file**
   - Create in `backend/apps/products/pricing/models/`
   - Contains the PriceHistory model

2. **Import required modules**
   - Import Django model classes
   - Import `PriceField` from `..fields`
   - Import `BaseModel`
   - Import User model from auth
   - Import `GenericForeignKey` from contenttypes

3. **Define PriceHistory class**
   - Inherit from `BaseModel`
   - Add comprehensive docstring
   - Tracks history for both ProductPrice and VariantPrice

4. **Add content type fields for generic relation**
   - Add `content_type` - ForeignKey to ContentType
   - Add `object_id` - PositiveIntegerField
   - Add `content_object` - GenericForeignKey
   - Enables tracking of both ProductPrice and VariantPrice

5. **Add product reference field**
   - Add `product` - ForeignKey to Product
   - Set `on_delete=models.CASCADE`
   - Set `related_name='price_history'`
   - Direct product reference for queries
   - Denormalized for performance

6. **Add variant reference field**
   - Add `variant` - ForeignKey to ProductVariant
   - Set `on_delete=models.CASCADE`, `null=True`, `blank=True`
   - Set `related_name='price_history'`
   - Optional - only for variant price changes

7. **Add price_type field**
   - Add `CharField` with choices
   - Choices: 'BASE', 'SALE', 'WHOLESALE', 'COST'
   - Set `max_length=20`
   - Indicates which price field changed

8. **Add old_value field**
   - Use `PriceField`
   - Set `null=True`, `blank=True`
   - Set `verbose_name='Old Price'`
   - Previous price value

9. **Add new_value field**
   - Use `PriceField`
   - Set `null=True`, `blank=True`
   - Set `verbose_name='New Price'`
   - Current price value

10. **Add change_amount field**
    - Use `DecimalField`
    - Set `max_digits=12`, `decimal_places=2`
    - Calculate: `new_value - old_value`
    - Can be negative

11. **Add change_percentage field**
    - Use `DecimalField`
    - Set `max_digits=6`, `decimal_places=2`
    - Calculate: `((new - old) / old) * 100`
    - Percentage change

12. **Add changed_by field**
    - ForeignKey to User model
    - Set `on_delete=models.SET_NULL`, `null=True`
    - Set `related_name='price_changes'`
    - Track who made the change

13. **Add change_reason field**
    - Use `TextField`
    - Set `blank=True`, `null=True`
    - Set `verbose_name='Reason for Change'`
    - Audit documentation

14. **Add automated_change field**
    - Use `BooleanField`
    - Set `default=False`
    - Set `verbose_name='Automated Change'`
    - Distinguish manual from system changes

15. **Add change_source field**
    - Use `CharField`
    - Set `max_length=50`
    - Values: 'manual', 'import', 'api', 'scheduled', 'promotion'
    - Track source of change

16. **Add Meta class**
    - Set `db_table = 'pricing_price_history'`
    - Set `verbose_name = 'Price History'`
    - Set `verbose_name_plural = 'Price Histories'`
    - Set `ordering = ['-created_at']` (newest first)
    - Add indexes on product, variant, price_type, created_at

17. **Add __str__ method**
    - Return formatted string with product, price type, change
    - Format: "Product - BASE: ₨ 1,000 → ₨ 1,200 (+20%)"

18. **Add get_change_summary method**
    - Create instance method
    - Return human-readable change description
    - Include direction (increase/decrease)
    - Include percentage and amount

### PriceHistory Model Fields

| Field | Type | Purpose |
|-------|------|---------|
| `content_type` | ForeignKey | Generic relation |
| `object_id` | PositiveIntegerField | Generic relation |
| `content_object` | GenericForeignKey | Link to price object |
| `product` | ForeignKey | Product reference |
| `variant` | ForeignKey | Variant reference (optional) |
| `price_type` | CharField | Which price changed |
| `old_value` | PriceField | Previous price |
| `new_value` | PriceField | New price |
| `change_amount` | DecimalField | Absolute change |
| `change_percentage` | DecimalField | Percentage change |
| `changed_by` | ForeignKey | User who changed |
| `change_reason` | TextField | Why changed |
| `automated_change` | BooleanField | System vs manual |
| `change_source` | CharField | Source of change |

### Price Types

| Type | Description | Example |
|------|-------------|---------|
| BASE | Base price changed | Regular price update |
| SALE | Sale price changed | Promotion started/ended |
| WHOLESALE | Wholesale price changed | B2B pricing adjusted |
| COST | Cost price changed | Supplier price changed |

### Change Sources

| Source | Description |
|--------|-------------|
| manual | User edit in admin/UI |
| import | Bulk CSV import |
| api | API update |
| scheduled | Automated schedule |
| promotion | Promotion system |

### Business Examples

**Example 1: Manual Price Increase**
```
Product: Samsung TV
Price Type: BASE
Old Value: ₨ 85,000.00
New Value: ₨ 89,900.00
Change: +₨ 4,900.00 (+5.76%)
Changed By: finance_manager
Change Reason: "Supplier cost increase"
Source: manual
```

**Example 2: Sale Activation**
```
Product: Laptop
Price Type: SALE
Old Value: None
New Value: ₨ 115,000.00
Change: N/A (new sale)
Changed By: marketing_user
Change Reason: "Weekend flash sale"
Source: promotion
Automated: False
```

**Example 3: Cost Update**
```
Product: Rice 5kg
Price Type: COST
Old Value: ₨ 950.00
New Value: ₨ 1,000.00
Change: +₨ 50.00 (+5.26%)
Changed By: None (system)
Change Reason: "Supplier invoice update"
Source: import
Automated: True
```

**Example 4: Variant Price Adjustment**
```
Product: T-Shirt
Variant: XL Size
Price Type: BASE
Old Value: ₨ 1,000.00
New Value: ₨ 1,100.00
Change: +₨ 100.00 (+10%)
Changed By: store_manager
Change Reason: "Premium size adjustment"
Source: manual
```

### Audit Trail Benefits

1. **Compliance:** Track all price changes for regulations
2. **Analysis:** Understand pricing trends over time
3. **Disputes:** Resolve customer complaints about prices
4. **Attribution:** Know who changed what and why
5. **Rollback:** Ability to see and revert changes
6. **Patterns:** Identify frequent price adjustments

### Sri Lanka Context

- **Regulatory:** Consumer Affairs Authority may require price history
- **Tax Audits:** IRD may request pricing documentation
- **Disputes:** Evidence for pricing claims
- **Analysis:** Track impact of rupee fluctuations on pricing

### Expected Outcome

A complete PriceHistory model that automatically tracks all price changes with full audit information, enabling compliance and analysis.

### Verification Checklist

- [ ] `price_history.py` file created
- [ ] `PriceHistory` class with generic foreign key
- [ ] `product` and `variant` reference fields
- [ ] `price_type` field with BASE/SALE/WHOLESALE/COST choices
- [ ] `old_value` and `new_value` price fields
- [ ] `change_amount` and `change_percentage` calculated fields
- [ ] `changed_by` user reference
- [ ] `change_reason` documentation field
- [ ] `automated_change` and `change_source` tracking
- [ ] Meta class with proper ordering and indexes
- [ ] `__str__` method returns formatted summary
- [ ] `get_change_summary()` method for readable description
- [ ] Model imported in `models/__init__.py`

---

## Summary

### Tasks Completed in This Document

| Task # | Task Name | Key Deliverable |
|--------|-----------|-----------------|
| 10 | Create VariantPrice model | Variant-level pricing with inheritance |
| 11 | Add VariantPrice override logic | Price resolution methods |
| 12 | Create price validation methods | Comprehensive validation |
| 13 | Add profit margin calculation | Margin, markup, break-even |
| 14 | Create price history model | Complete audit trail |

### Files Created

```
backend/apps/products/pricing/models/
├── product_price.py (updated with validation)
├── variant_price.py (NEW)
└── price_history.py (NEW)
```

### Key Achievements

- ✅ Variant-level pricing with product inheritance
- ✅ Price adjustment logic (fixed amount and percentage)
- ✅ Comprehensive validation for price integrity
- ✅ Profit margin and markup calculations
- ✅ Break-even analysis
- ✅ Complete price change audit trail
- ✅ Generic foreign key for flexible history tracking
- ✅ Multi-tenant isolation maintained

### Next Steps

Proceed to [04_Tasks-15-18_Signals-Utils-Admin.md](04_Tasks-15-18_Signals-Utils-Admin.md) to add:
- Django signals for automatic price history logging
- Currency formatting utilities
- Price comparison helper methods
- Django admin configuration for price management

---

## Notes for AI Agents

1. **Variant Inheritance:** Most variants inherit product pricing by default
2. **Price Adjustments:** Common for size/storage variants (+10-30%)
3. **Validation:** Enforce wholesale >= cost to prevent losses
4. **Margin vs Markup:** Different formulas, both useful
5. **Break-even:** Requires fixed cost input from user
6. **History Tracking:** Use signals (next document) for automation
7. **Generic FK:** Allows history for both ProductPrice and VariantPrice
8. **Change Source:** Track whether manual or automated
9. **Audit Compliance:** Sri Lankan businesses need price history
10. **Next Document:** Signals, utilities, and admin configuration
