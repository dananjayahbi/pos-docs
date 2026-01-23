# Tasks 19-23: TaxCalculator Service

> **Phase:** 04 - ERP Core Modules Part 1  
> **SubPhase:** 06 - Product Pricing  
> **Group:** B - Tax Integration & Calculation  
> **Document:** 01 of 03  
> **Tasks Covered:** 19, 20, 21, 22, 23

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **→ Next Document:** [02_Tasks-24-28_Price-Methods-SVAT.md](02_Tasks-24-28_Price-Methods-SVAT.md)

---

## Document Overview

This document establishes the tax calculation infrastructure for the pricing system, including TaxClass model verification, TaxCalculator service creation, tax-inclusive to tax-exclusive conversion, tax-exclusive to tax-inclusive conversion, and compound tax handling for Sri Lankan VAT and NBT scenarios.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 19 | Review TaxClass model | Low | 15 min |
| 20 | Create TaxCalculator service | High | 35 min |
| 21 | Implement tax-inclusive to exclusive | Medium | 25 min |
| 22 | Implement tax-exclusive to inclusive | Low | 20 min |
| 23 | Handle compound tax scenarios | High | 30 min |

---

## Task 19: Review TaxClass Model

### Overview
Review and verify the TaxClass model from Phase-03 to ensure it provides all necessary tax configuration data for pricing calculations, including VAT rates, SVAT handling, and zero-rated tax scenarios for Sri Lankan tax compliance.

### Dependencies
- Phase-03: Core Backend Infrastructure (TaxClass model created)
- Multi-tenancy configured

### Instructions

1. **Locate TaxClass model**
   - Navigate to `backend/apps/core/models/` or appropriate location
   - Open file containing TaxClass model
   - Review model definition

2. **Verify required fields exist**
   - `name` - CharField for tax class name (e.g., "Standard VAT 12%")
   - `code` - CharField for unique tax identifier (e.g., "VAT_12")
   - `rate` - DecimalField for tax rate percentage (e.g., 12.00)
   - `is_active` - BooleanField for enabling/disabling
   - `description` - TextField for explanation

3. **Verify tax type field**
   - Check for `tax_type` CharField with choices
   - Expected values: VAT, SVAT, ZERO_RATED, EXEMPT
   - Used to categorize different tax types
   - Essential for SVAT exemption logic

4. **Verify compound tax support**
   - Check for `compound_tax` BooleanField or ForeignKey
   - Indicates if tax is applied on top of another tax
   - Example: NBT applied after VAT
   - Used for sequential tax calculations

5. **Verify tenant isolation**
   - Ensure TaxClass is in TENANT_APPS
   - Each tenant can define their own tax classes
   - Tax rates may vary per business type

6. **Check calculated properties**
   - Verify `decimal_rate` property if needed
   - Converts percentage to decimal (12.00% → 0.12)
   - Simplifies tax calculations

7. **Review manager methods**
   - Check for `active()` queryset method
   - Check for `by_type()` filtering method
   - Check for `get_default_vat()` convenience method

8. **Verify Meta configuration**
   - Check `unique_together` for (tenant, code)
   - Check ordering by name or rate
   - Check indexes for performance

9. **Document any missing fields**
   - If critical fields are missing, note for addition
   - Common additions needed:
     - `priority` for compound tax order
     - `applies_to` for product category filtering
     - `inclusive_in_price` default behavior

10. **Test TaxClass creation**
    - Verify you can create tax class instances
    - Test with Sri Lankan tax rates:
      - Standard VAT: 12%
      - SVAT: 0% (B2B)
      - Zero-rated: 0%
      - Exempt: 0%

### Expected TaxClass Structure

| Field | Type | Purpose | Example |
|-------|------|---------|---------|
| `name` | CharField | Display name | "Standard VAT (12%)" |
| `code` | CharField | Unique code | "VAT_12" |
| `rate` | DecimalField | Tax percentage | 12.00 |
| `tax_type` | CharField | Tax category | "VAT" |
| `is_active` | BooleanField | Enabled status | True |
| `description` | TextField | Explanation | "Standard VAT rate 2025" |
| `compound_tax` | BooleanField | Sequential tax | False |

### Sri Lankan Tax Classes

| Tax Class | Code | Rate | Type | Description |
|-----------|------|------|------|-------------|
| Standard VAT | VAT_12 | 12% | VAT | Default tax for goods/services |
| SVAT | SVAT_0 | 0% | SVAT | B2B registered customers |
| Zero-rated | ZERO | 0% | ZERO_RATED | Exports, essentials |
| Exempt | EXEMPT | 0% | EXEMPT | Financial services, education |
| NBT | NBT_2 | 2% | VAT | Nation Building Tax (historical) |

### Tax Type Differences

| Type | Rate | Applies To | Exemptions |
|------|------|------------|------------|
| **VAT** | 12% | Most goods/services | Food essentials |
| **SVAT** | 0% | B2B transactions | Requires registration |
| **ZERO_RATED** | 0% | Exports, essentials | By product category |
| **EXEMPT** | 0% | Specific services | By service type |

### Decimal Rate Calculation

```
Rate Percentage → Decimal Rate
12.00% → 0.12
18.00% → 0.18
2.50% → 0.025

Formula: decimal_rate = rate / 100
```

### Compound Tax Example

```
Product Price: ₨ 10,000.00

Step 1: Apply VAT (12%)
  Tax: 10,000 × 0.12 = ₨ 1,200
  Subtotal: 10,000 + 1,200 = ₨ 11,200

Step 2: Apply NBT (2%) on subtotal
  Tax: 11,200 × 0.02 = ₨ 224
  Final Total: 11,200 + 224 = ₨ 11,424

Total Tax: ₨ 1,424 (14.24% effective rate)
```

### TaxClass Usage Example

```python
# Get standard VAT
vat_class = TaxClass.objects.get(code='VAT_12')

# Check rate
vat_class.rate  # 12.00
vat_class.decimal_rate  # 0.12

# Apply to product
product_price.tax_class = vat_class
product_price.save()
```

### Expected Outcome

Complete understanding of TaxClass model structure and verification that it supports all required tax calculation scenarios for the pricing system.

### Verification Checklist

- [ ] TaxClass model located and reviewed
- [ ] All required fields (name, code, rate, tax_type) exist
- [ ] `tax_type` field has appropriate choices (VAT, SVAT, ZERO_RATED, EXEMPT)
- [ ] Tenant isolation configured (in TENANT_APPS)
- [ ] `decimal_rate` property available or can be calculated
- [ ] Manager methods for filtering (active, by_type) exist
- [ ] Meta configuration includes unique_together constraint
- [ ] Sri Lankan tax rates can be represented (VAT 12%, SVAT 0%)
- [ ] Compound tax support available
- [ ] Test tax classes created successfully

---

## Task 20: Create TaxCalculator Service

### Overview
Create a comprehensive TaxCalculator service class that handles all tax calculation logic including VAT computation, SVAT exemptions, tax-inclusive/exclusive conversions, and compound tax scenarios for the multi-tenant ERP system.

### Dependencies
- Task 19: TaxClass model reviewed and verified
- ProductPrice model exists with tax configuration

### Instructions

1. **Create `tax_calculator.py` file**
   - Create in `backend/apps/products/pricing/services/`
   - This service contains tax calculation business logic

2. **Import required modules**
   - Import `Decimal` from `decimal`
   - Import `TaxClass` model
   - Import pricing constants
   - Import rounding utilities

3. **Define TaxCalculator class**
   - Create class with comprehensive docstring
   - This is a service class (no model inheritance)
   - Can be instantiated or use class methods

4. **Add __init__ method**
   - Accept optional `tax_class` parameter
   - Accept optional `customer` parameter for SVAT checking
   - Store as instance variables
   - Allow flexibility for different calculation contexts

5. **Create get_decimal_rate method**
   - Accept `tax_class` parameter
   - Return decimal rate (rate / 100)
   - Handle None tax_class (return 0)
   - Cache calculation if needed

6. **Create calculate_tax_amount method**
   - Accept `base_amount`, `tax_rate` parameters
   - Calculate: `base_amount * (tax_rate / 100)`
   - Round to 2 decimal places
   - Return tax amount as Decimal

7. **Create calculate_price_with_tax method**
   - Accept `base_amount`, `tax_rate` parameters
   - Calculate: `base_amount + (base_amount * tax_rate / 100)`
   - Round to 2 decimal places
   - Return total price as Decimal

8. **Create calculate_price_without_tax method**
   - Accept `total_amount`, `tax_rate` parameters
   - Calculate: `total_amount / (1 + tax_rate / 100)`
   - Round to 2 decimal places
   - Return base price as Decimal

9. **Create extract_tax_from_inclusive_price method**
   - Accept `inclusive_price`, `tax_rate` parameters
   - Calculate tax component from inclusive price
   - Formula: `inclusive_price - (inclusive_price / (1 + tax_rate / 100))`
   - Return tax amount as Decimal

10. **Add get_effective_tax_rate method**
    - Accept `tax_class`, `customer` parameters
    - Check if customer is SVAT exempt
    - Return 0 if exempt, otherwise return tax_class.rate
    - Handles SVAT logic for B2B customers

11. **Add validate_tax_calculation method**
    - Accept calculated values
    - Verify: base + tax = total
    - Check for rounding errors
    - Raise exception if validation fails

12. **Add get_tax_breakdown method**
    - Accept `price`, `tax_rate`, `is_inclusive` parameters
    - Return dictionary with:
      - base_price
      - tax_amount
      - total_price
      - tax_rate
      - is_inclusive
    - Complete breakdown for display

### TaxCalculator Methods

| Method | Purpose | Returns |
|--------|---------|---------|
| `get_decimal_rate(tax_class)` | Convert % to decimal | Decimal (0.12) |
| `calculate_tax_amount(base, rate)` | Tax on amount | Decimal |
| `calculate_price_with_tax(base, rate)` | Add tax to base | Decimal |
| `calculate_price_without_tax(total, rate)` | Extract base | Decimal |
| `extract_tax_from_inclusive_price(price, rate)` | Get tax component | Decimal |
| `get_effective_tax_rate(tax_class, customer)` | Apply SVAT logic | Decimal |
| `validate_tax_calculation(values)` | Check correctness | Boolean |
| `get_tax_breakdown(price, rate, inclusive)` | Full breakdown | Dict |

### Tax Calculation Formulas

**Add Tax (Tax-Exclusive):**
```
Base Price: ₨ 10,000.00
Tax Rate: 12%

Tax Amount = 10,000 × 0.12 = ₨ 1,200.00
Total = 10,000 + 1,200 = ₨ 11,200.00
```

**Remove Tax (Tax-Inclusive):**
```
Total Price: ₨ 11,200.00
Tax Rate: 12%

Base = 11,200 / 1.12 = ₨ 10,000.00
Tax = 11,200 - 10,000 = ₨ 1,200.00
```

**Extract Tax Component:**
```
Inclusive Price: ₨ 11,200.00
Tax Rate: 12%

Base = 11,200 / 1.12 = ₨ 10,000.00
Tax = 11,200 - 10,000 = ₨ 1,200.00
```

### Business Examples

**Example 1: Standard VAT (Tax-Exclusive)**
```python
calculator = TaxCalculator()

base_price = Decimal('10000.00')
tax_rate = Decimal('12.00')

tax_amount = calculator.calculate_tax_amount(base_price, tax_rate)
# Result: ₨ 1,200.00

total = calculator.calculate_price_with_tax(base_price, tax_rate)
# Result: ₨ 11,200.00
```

**Example 2: Tax-Inclusive Price Breakdown**
```python
calculator = TaxCalculator()

inclusive_price = Decimal('11200.00')
tax_rate = Decimal('12.00')

base = calculator.calculate_price_without_tax(inclusive_price, tax_rate)
# Result: ₨ 10,000.00

tax = calculator.extract_tax_from_inclusive_price(inclusive_price, tax_rate)
# Result: ₨ 1,200.00
```

**Example 3: SVAT Exemption**
```python
vat_class = TaxClass.objects.get(code='VAT_12')
b2b_customer = Customer.objects.get(is_svat_registered=True)

calculator = TaxCalculator(tax_class=vat_class, customer=b2b_customer)

effective_rate = calculator.get_effective_tax_rate(vat_class, b2b_customer)
# Result: 0.00 (SVAT exempt)

total = calculator.calculate_price_with_tax(Decimal('10000'), effective_rate)
# Result: ₨ 10,000.00 (no tax added)
```

**Example 4: Tax Breakdown**
```python
breakdown = calculator.get_tax_breakdown(
    price=Decimal('11200.00'),
    tax_rate=Decimal('12.00'),
    is_inclusive=True
)
# Result: {
#   'base_price': Decimal('10000.00'),
#   'tax_amount': Decimal('1200.00'),
#   'total_price': Decimal('11200.00'),
#   'tax_rate': Decimal('12.00'),
#   'is_inclusive': True
# }
```

### Sri Lankan Tax Scenarios

| Scenario | Base | Rate | Tax | Total |
|----------|------|------|-----|-------|
| Electronics | ₨ 100,000 | 12% | ₨ 12,000 | ₨ 112,000 |
| Clothing | ₨ 5,000 | 12% | ₨ 600 | ₨ 5,600 |
| Food (Exempt) | ₨ 850 | 0% | ₨ 0 | ₨ 850 |
| B2B (SVAT) | ₨ 50,000 | 0% | ₨ 0 | ₨ 50,000 |

### Rounding Behavior

```
Tax Calculation: 10,000 × 0.12 = 1,200.00
Total: 10,000 + 1,200 = 11,200.00

Edge Case: 1,234.56 × 0.12 = 148.1472
Rounded: ₨ 148.15 (round to nearest cent)

Total: 1,234.56 + 148.15 = ₨ 1,382.71
```

### Validation Logic

```python
def validate_tax_calculation(self, base, tax, total):
    calculated_total = base + tax
    difference = abs(calculated_total - total)
    
    # Allow 1 cent rounding difference
    if difference > Decimal('0.01'):
        raise ValidationError('Tax calculation mismatch')
    
    return True
```

### Expected Outcome

A comprehensive TaxCalculator service class that handles all tax calculation scenarios including VAT, SVAT, zero-rated, and exempt tax scenarios with proper rounding and validation.

### Verification Checklist

- [ ] `tax_calculator.py` file created in services directory
- [ ] `TaxCalculator` class defined with comprehensive docstring
- [ ] `__init__` method accepts tax_class and customer
- [ ] `get_decimal_rate()` converts percentage to decimal
- [ ] `calculate_tax_amount()` computes tax on base amount
- [ ] `calculate_price_with_tax()` adds tax to base
- [ ] `calculate_price_without_tax()` extracts base from inclusive
- [ ] `extract_tax_from_inclusive_price()` gets tax component
- [ ] `get_effective_tax_rate()` handles SVAT exemptions
- [ ] `validate_tax_calculation()` checks calculation correctness
- [ ] `get_tax_breakdown()` returns complete breakdown dictionary
- [ ] All methods round to 2 decimal places
- [ ] Service class exported from `services/__init__.py`

---

## Task 21: Implement Tax-Inclusive to Exclusive Conversion

### Overview
Implement methods in the TaxCalculator service to convert tax-inclusive prices to tax-exclusive prices, breaking down the inclusive price into its base and tax components. This is essential for displaying pre-tax prices and calculating margins on tax-inclusive pricing.

### Dependencies
- Task 20: TaxCalculator service created

### Instructions

1. **Open `tax_calculator.py` file**
   - Continue editing TaxCalculator class

2. **Create convert_inclusive_to_exclusive method**
   - Accept `inclusive_price`, `tax_rate` parameters
   - Calculate base price: `inclusive_price / (1 + tax_rate / 100)`
   - Calculate tax amount: `inclusive_price - base_price`
   - Round both to 2 decimal places
   - Return tuple: `(base_price, tax_amount)`

3. **Add get_base_from_inclusive method**
   - Convenience method accepting same parameters
   - Return only base price component
   - Calls convert_inclusive_to_exclusive internally
   - Used when only base is needed

4. **Add get_tax_from_inclusive method**
   - Convenience method accepting same parameters
   - Return only tax component
   - Calls convert_inclusive_to_exclusive internally
   - Used when only tax is needed

5. **Create batch_convert_inclusive_to_exclusive method**
   - Accept list of inclusive prices and tax_rate
   - Convert all prices in batch
   - Return list of tuples with (base, tax) for each
   - Optimized for bulk operations

6. **Add convert_inclusive_with_tax_class method**
   - Accept `inclusive_price`, `tax_class` object
   - Get tax rate from tax_class
   - Call conversion logic
   - Return breakdown with tax class info

7. **Create validate_inclusive_conversion method**
   - Accept `inclusive_price`, `base_price`, `tax_amount`
   - Verify: base + tax = inclusive (within rounding tolerance)
   - Raise ValidationError if mismatch
   - Ensures calculation accuracy

8. **Add get_inclusive_breakdown_display method**
   - Accept `inclusive_price`, `tax_rate`
   - Return formatted dictionary for display:
     - formatted_total
     - formatted_base
     - formatted_tax
     - tax_rate
     - tax_percentage_display
   - Uses currency formatting utilities

### Tax-Inclusive Conversion Formula

```
Tax-Inclusive Price → Tax-Exclusive Components

Given:
  Inclusive Price (P) = ₨ 11,200.00
  Tax Rate (R) = 12%

Calculate:
  Base Price (B) = P / (1 + R/100)
  Base Price = 11,200 / 1.12
  Base Price = ₨ 10,000.00
  
  Tax Amount (T) = P - B
  Tax Amount = 11,200 - 10,000
  Tax Amount = ₨ 1,200.00

Verify:
  B + T = 10,000 + 1,200 = 11,200 ✓
```

### Conversion Examples

| Inclusive Price | Tax Rate | Base Price | Tax Amount |
|----------------|----------|------------|------------|
| ₨ 11,200.00 | 12% | ₨ 10,000.00 | ₨ 1,200.00 |
| ₨ 5,600.00 | 12% | ₨ 5,000.00 | ₨ 600.00 |
| ₨ 1,120.00 | 12% | ₨ 1,000.00 | ₨ 120.00 |
| ₨ 112.00 | 12% | ₨ 100.00 | ₨ 12.00 |

### Business Examples

**Example 1: Retail Price Breakdown**
```python
calculator = TaxCalculator()

# Product priced at ₨ 11,200 (tax-inclusive)
inclusive_price = Decimal('11200.00')
tax_rate = Decimal('12.00')

base, tax = calculator.convert_inclusive_to_exclusive(
    inclusive_price, tax_rate
)

# Result:
# base = ₨ 10,000.00
# tax = ₨ 1,200.00

# Display to customer:
# "Total: ₨ 11,200 (includes VAT of ₨ 1,200)"
```

**Example 2: Profit Margin Calculation**
```python
# Retail price (tax-inclusive): ₨ 11,200
# Cost price: ₨ 8,000

inclusive_price = Decimal('11200.00')
cost_price = Decimal('8000.00')

base_price = calculator.get_base_from_inclusive(inclusive_price, Decimal('12'))
# base_price = ₨ 10,000.00

margin = ((base_price - cost_price) / base_price) * 100
# margin = ((10,000 - 8,000) / 10,000) * 100 = 20%
```

**Example 3: Invoice Breakdown**
```python
# Invoice with multiple items (all tax-inclusive)
items = [
    {'name': 'Laptop', 'price': Decimal('112000.00')},
    {'name': 'Mouse', 'price': Decimal('1120.00')},
    {'name': 'Keyboard', 'price': Decimal('5600.00')}
]

for item in items:
    base, tax = calculator.convert_inclusive_to_exclusive(
        item['price'], Decimal('12')
    )
    item['base'] = base
    item['tax'] = tax

# Result:
# Laptop: Base ₨ 100,000, Tax ₨ 12,000
# Mouse: Base ₨ 1,000, Tax ₨ 120
# Keyboard: Base ₨ 5,000, Tax ₨ 600
# Total Base: ₨ 106,000, Total Tax: ₨ 12,720
```

**Example 4: Batch Conversion**
```python
# Multiple products to convert
inclusive_prices = [
    Decimal('11200.00'),
    Decimal('5600.00'),
    Decimal('1120.00')
]

results = calculator.batch_convert_inclusive_to_exclusive(
    inclusive_prices, Decimal('12')
)

# Result: [
#   (Decimal('10000.00'), Decimal('1200.00')),
#   (Decimal('5000.00'), Decimal('600.00')),
#   (Decimal('1000.00'), Decimal('120.00'))
# ]
```

### Display Breakdown Example

```python
breakdown = calculator.get_inclusive_breakdown_display(
    Decimal('11200.00'), Decimal('12')
)

# Result: {
#   'formatted_total': '₨ 11,200.00',
#   'formatted_base': '₨ 10,000.00',
#   'formatted_tax': '₨ 1,200.00',
#   'tax_rate': Decimal('12.00'),
#   'tax_percentage_display': '12%'
# }

# Display:
# Total: ₨ 11,200.00
# Base Price: ₨ 10,000.00
# VAT (12%): ₨ 1,200.00
```

### Rounding Edge Cases

```
Inclusive: ₨ 1,234.56
Tax Rate: 12%

Base = 1,234.56 / 1.12 = 1,102.285714...
Rounded Base = ₨ 1,102.29

Tax = 1,234.56 - 1,102.29 = 132.27
Rounded Tax = ₨ 132.27

Verify: 1,102.29 + 132.27 = 1,234.56 ✓
```

### Sri Lankan Retail Context

- Most Sri Lankan retail prices are displayed tax-inclusive
- Customers see final price including VAT
- Invoices must show tax breakdown
- B2B customers need base price for accounting
- Tax authority requires proper tax separation in records

### Expected Outcome

Complete implementation of tax-inclusive to tax-exclusive conversion with batch processing, validation, and formatted display options.

### Verification Checklist

- [ ] `convert_inclusive_to_exclusive()` method implemented
- [ ] Returns tuple of (base_price, tax_amount)
- [ ] `get_base_from_inclusive()` convenience method added
- [ ] `get_tax_from_inclusive()` convenience method added
- [ ] `batch_convert_inclusive_to_exclusive()` for bulk operations
- [ ] `convert_inclusive_with_tax_class()` accepts TaxClass object
- [ ] `validate_inclusive_conversion()` checks calculation accuracy
- [ ] `get_inclusive_breakdown_display()` returns formatted breakdown
- [ ] All methods round to 2 decimal places
- [ ] Validation ensures base + tax = inclusive (within tolerance)

---

## Task 22: Implement Tax-Exclusive to Inclusive Conversion

### Overview
Implement methods in the TaxCalculator service to convert tax-exclusive prices to tax-inclusive prices, adding the appropriate tax amount to the base price. This is used when prices are stored without tax and need to be displayed with tax included.

### Dependencies
- Task 21: Tax-inclusive to exclusive conversion complete

### Instructions

1. **Continue in `tax_calculator.py` file**
   - Add tax-exclusive to inclusive methods

2. **Create convert_exclusive_to_inclusive method**
   - Accept `base_price`, `tax_rate` parameters
   - Calculate tax amount: `base_price * (tax_rate / 100)`
   - Calculate total price: `base_price + tax_amount`
   - Round both to 2 decimal places
   - Return tuple: `(total_price, tax_amount)`

3. **Add get_total_from_exclusive method**
   - Convenience method accepting same parameters
   - Return only total price (inclusive)
   - Calls convert_exclusive_to_inclusive internally
   - Most commonly used method

4. **Add apply_tax_to_price method**
   - Alias for convert_exclusive_to_inclusive
   - More intuitive name for some contexts
   - Same functionality

5. **Create batch_convert_exclusive_to_inclusive method**
   - Accept list of base prices and tax_rate
   - Convert all prices in batch
   - Return list of tuples with (total, tax) for each
   - Optimized for bulk price updates

6. **Add convert_exclusive_with_tax_class method**
   - Accept `base_price`, `tax_class` object
   - Get tax rate from tax_class
   - Check for SVAT exemption if customer provided
   - Call conversion logic
   - Return breakdown with tax class info

7. **Create get_exclusive_breakdown_display method**
   - Accept `base_price`, `tax_rate`
   - Return formatted dictionary for display:
     - formatted_base
     - formatted_tax
     - formatted_total
     - tax_rate
   - Uses currency formatting utilities

8. **Add compare_inclusive_exclusive method**
   - Accept price and tax_rate
   - Show side-by-side comparison
   - Return dict showing both perspectives
   - Educational/debugging tool

### Tax-Exclusive Conversion Formula

```
Tax-Exclusive Price → Tax-Inclusive Price

Given:
  Base Price (B) = ₨ 10,000.00
  Tax Rate (R) = 12%

Calculate:
  Tax Amount (T) = B × (R / 100)
  Tax Amount = 10,000 × 0.12
  Tax Amount = ₨ 1,200.00
  
  Total Price (P) = B + T
  Total Price = 10,000 + 1,200
  Total Price = ₨ 11,200.00
```

### Conversion Examples

| Base Price | Tax Rate | Tax Amount | Total (Inclusive) |
|------------|----------|------------|-------------------|
| ₨ 10,000.00 | 12% | ₨ 1,200.00 | ₨ 11,200.00 |
| ₨ 5,000.00 | 12% | ₨ 600.00 | ₨ 5,600.00 |
| ₨ 1,000.00 | 12% | ₨ 120.00 | ₨ 1,120.00 |
| ₨ 100.00 | 12% | ₨ 12.00 | ₨ 112.00 |

### Business Examples

**Example 1: Price Display with Tax**
```python
calculator = TaxCalculator()

# Cost + desired margin = base price
base_price = Decimal('10000.00')
tax_rate = Decimal('12.00')

total, tax = calculator.convert_exclusive_to_inclusive(
    base_price, tax_rate
)

# Result:
# total = ₨ 11,200.00
# tax = ₨ 1,200.00

# Display to customer:
# "Price: ₨ 11,200 (includes VAT)"
```

**Example 2: Import Price with Tax**
```python
# Imported product cost (tax-exclusive)
import_cost = Decimal('50000.00')
markup = Decimal('1.5')  # 50% markup

base_price = import_cost * markup  # ₨ 75,000
retail_price = calculator.get_total_from_exclusive(
    base_price, Decimal('12')
)

# retail_price = ₨ 84,000.00
# Display: "₨ 84,000 (including VAT)"
```

**Example 3: Bulk Price Update**
```python
# Update all product prices with tax
base_prices = [
    Decimal('1000.00'),
    Decimal('5000.00'),
    Decimal('10000.00')
]

results = calculator.batch_convert_exclusive_to_inclusive(
    base_prices, Decimal('12')
)

# Result: [
#   (Decimal('1120.00'), Decimal('120.00')),
#   (Decimal('5600.00'), Decimal('600.00')),
#   (Decimal('11200.00'), Decimal('1200.00'))
# ]
```

**Example 4: Tax-Free vs Taxed Comparison**
```python
base_price = Decimal('10000.00')

comparison = calculator.compare_inclusive_exclusive(
    base_price, Decimal('12')
)

# Result: {
#   'base_price': '₨ 10,000.00',
#   'tax_amount': '₨ 1,200.00',
#   'with_tax': '₨ 11,200.00',
#   'tax_rate': '12%',
#   'difference': '₨ 1,200.00'
# }
```

### Display Breakdown Example

```python
breakdown = calculator.get_exclusive_breakdown_display(
    Decimal('10000.00'), Decimal('12')
)

# Result: {
#   'formatted_base': '₨ 10,000.00',
#   'formatted_tax': '₨ 1,200.00',
#   'formatted_total': '₨ 11,200.00',
#   'tax_rate': Decimal('12.00')
# }

# Display:
# Base Price: ₨ 10,000.00
# VAT (12%): + ₨ 1,200.00
# Total: ₨ 11,200.00
```

### Reverse Validation

```python
# Forward conversion
base = Decimal('10000.00')
total, tax = calculator.convert_exclusive_to_inclusive(base, Decimal('12'))

# Reverse conversion (should return to original)
calculated_base, calculated_tax = calculator.convert_inclusive_to_exclusive(
    total, Decimal('12')
)

# Verify:
assert calculated_base == base  # ₨ 10,000.00
assert calculated_tax == tax    # ₨ 1,200.00
```

### Sri Lankan Wholesale Context

- Wholesale prices often quoted tax-exclusive
- Retailers add VAT for final customer
- B2B transactions may be SVAT-exempt
- Import prices are tax-exclusive + customs duty
- Distributors calculate retail price including tax

### Expected Outcome

Complete implementation of tax-exclusive to tax-inclusive conversion with batch processing and formatted display options.

### Verification Checklist

- [ ] `convert_exclusive_to_inclusive()` method implemented
- [ ] Returns tuple of (total_price, tax_amount)
- [ ] `get_total_from_exclusive()` convenience method added
- [ ] `apply_tax_to_price()` alias method created
- [ ] `batch_convert_exclusive_to_inclusive()` for bulk operations
- [ ] `convert_exclusive_with_tax_class()` accepts TaxClass object
- [ ] `get_exclusive_breakdown_display()` returns formatted breakdown
- [ ] `compare_inclusive_exclusive()` shows both perspectives
- [ ] All methods round to 2 decimal places
- [ ] Conversion reversible (forward and backward match)

---

## Task 23: Handle Compound Tax Scenarios

### Overview
Implement support for compound tax calculations where multiple taxes are applied sequentially (e.g., VAT + NBT), including proper calculation order, effective rate computation, and breakdown display for Sri Lankan compound tax scenarios.

### Dependencies
- Task 22: Tax-exclusive to inclusive conversion complete
- TaxClass model supports compound tax flag

### Instructions

1. **Continue in `tax_calculator.py` file**
   - Add compound tax calculation methods

2. **Create calculate_compound_tax method**
   - Accept `base_price`, `tax_classes` list parameters
   - Apply taxes sequentially in order
   - Each tax calculated on cumulative total
   - Return total price and list of tax amounts

3. **Add get_compound_tax_breakdown method**
   - Accept same parameters as calculate_compound_tax
   - Return detailed breakdown:
     - original_base
     - tax_layers (list of each tax step)
     - final_total
     - total_tax_amount
     - effective_tax_rate

4. **Create calculate_effective_compound_rate method**
   - Accept list of tax rates
   - Calculate combined effective rate
   - Formula: `(1 + r1) × (1 + r2) - 1`
   - Return effective rate percentage

5. **Add apply_compound_taxes_in_order method**
   - Accept `base_price`, list of `(tax_name, tax_rate)` tuples
   - Process in specified order
   - Track cumulative amount at each step
   - Return list of intermediate values

6. **Create validate_compound_calculation method**
   - Accept base, tax layers, final total
   - Verify each step correct
   - Ensure final total matches expected
   - Raise ValidationError if mismatch

7. **Add get_compound_tax_display method**
   - Accept compound calculation result
   - Format for display with each tax layer shown
   - Show cumulative effect
   - Use currency formatting

8. **Create decompose_compound_price method**
   - Accept final price with compound taxes
   - Extract base and each tax component
   - Reverse calculation from compound total
   - Return breakdown dictionary

9. **Add common_compound_scenarios method**
   - Provide presets for Sri Lankan scenarios:
     - VAT + NBT
     - VAT + Service Charge
   - Return appropriate tax class configurations

### Compound Tax Formula

```
Compound Tax (Sequential Application)

Base Price: ₨ 10,000.00

Step 1: Apply Tax 1 (VAT 12%)
  Tax1 = 10,000 × 0.12 = ₨ 1,200
  Subtotal = 10,000 + 1,200 = ₨ 11,200

Step 2: Apply Tax 2 (NBT 2%) on Subtotal
  Tax2 = 11,200 × 0.02 = ₨ 224
  Final Total = 11,200 + 224 = ₨ 11,424

Total Tax: 1,200 + 224 = ₨ 1,424
Effective Rate: (11,424 - 10,000) / 10,000 = 14.24%
```

### Effective Compound Rate

```
Given individual rates: r1 = 12%, r2 = 2%

Effective Rate = [(1 + 0.12) × (1 + 0.02)] - 1
               = [1.12 × 1.02] - 1
               = 1.1424 - 1
               = 0.1424
               = 14.24%

NOT simply r1 + r2 (which would be 14%)
```

### Compound Tax Examples

| Base | Tax 1 (12%) | Subtotal | Tax 2 (2%) | Total | Effective Rate |
|------|-------------|----------|------------|-------|----------------|
| ₨ 10,000 | ₨ 1,200 | ₨ 11,200 | ₨ 224 | ₨ 11,424 | 14.24% |
| ₨ 5,000 | ₨ 600 | ₨ 5,600 | ₨ 112 | ₨ 5,712 | 14.24% |
| ₨ 1,000 | ₨ 120 | ₨ 1,120 | ₨ 22.40 | ₨ 1,142.40 | 14.24% |

### Business Examples

**Example 1: VAT + NBT Scenario**
```python
calculator = TaxCalculator()

base_price = Decimal('10000.00')
tax_classes = [
    {'name': 'VAT', 'rate': Decimal('12.00')},
    {'name': 'NBT', 'rate': Decimal('2.00')}
]

total, taxes = calculator.calculate_compound_tax(base_price, tax_classes)

# Result:
# total = ₨ 11,424.00
# taxes = [
#   {'name': 'VAT', 'amount': Decimal('1200.00')},
#   {'name': 'NBT', 'amount': Decimal('224.00')}
# ]
```

**Example 2: Compound Breakdown Display**
```python
breakdown = calculator.get_compound_tax_breakdown(
    Decimal('10000.00'),
    [
        {'name': 'VAT 12%', 'rate': Decimal('12')},
        {'name': 'NBT 2%', 'rate': Decimal('2')}
    ]
)

# Result: {
#   'original_base': '₨ 10,000.00',
#   'tax_layers': [
#     {'name': 'VAT 12%', 'amount': '₨ 1,200.00', 'cumulative': '₨ 11,200.00'},
#     {'name': 'NBT 2%', 'amount': '₨ 224.00', 'cumulative': '₨ 11,424.00'}
#   ],
#   'final_total': '₨ 11,424.00',
#   'total_tax_amount': '₨ 1,424.00',
#   'effective_tax_rate': '14.24%'
# }
```

**Example 3: Restaurant Bill (VAT + Service Charge)**
```python
# Restaurant scenario
food_cost = Decimal('5000.00')

taxes = [
    {'name': 'VAT', 'rate': Decimal('12')},
    {'name': 'Service Charge', 'rate': Decimal('10')}
]

breakdown = calculator.get_compound_tax_breakdown(food_cost, taxes)

# Calculation:
# Base: ₨ 5,000
# VAT (12%): ₨ 600 → Subtotal: ₨ 5,600
# Service (10%): ₨ 560 → Total: ₨ 6,160
# Effective Rate: 23.2%
```

**Example 4: Reverse Compound Calculation**
```python
# Customer sees final price ₨ 11,424
# Need to extract base and tax components

final_price = Decimal('11424.00')
tax_rates = [Decimal('12'), Decimal('2')]

breakdown = calculator.decompose_compound_price(final_price, tax_rates)

# Result: {
#   'base_price': Decimal('10000.00'),
#   'tax_1': Decimal('1200.00'),
#   'tax_2': Decimal('224.00'),
#   'total_tax': Decimal('1424.00')
# }
```

### Sri Lankan Compound Tax Scenarios

| Scenario | Tax 1 | Tax 2 | Common In |
|----------|-------|-------|-----------|
| VAT + NBT | 12% | 2% | Luxury goods (historical) |
| VAT + Service | 12% | 10% | Restaurants, hotels |
| Import Duty + VAT | 15% | 12% | Imported goods |

### Display Format

```
Invoice Breakdown:
-----------------------------------
Item Price:              ₨ 10,000.00
VAT (12%):              +₨  1,200.00
                        ------------
Subtotal:                ₨ 11,200.00
NBT (2%):               +₨    224.00
                        ============
TOTAL:                   ₨ 11,424.00
-----------------------------------
Total Tax: ₨ 1,424.00 (14.24%)
```

### Expected Outcome

Complete implementation of compound tax calculations supporting multiple sequential taxes with proper calculation order and detailed breakdown display.

### Verification Checklist

- [ ] `calculate_compound_tax()` applies taxes sequentially
- [ ] `get_compound_tax_breakdown()` returns detailed step-by-step breakdown
- [ ] `calculate_effective_compound_rate()` calculates combined rate
- [ ] `apply_compound_taxes_in_order()` processes in specified order
- [ ] `validate_compound_calculation()` verifies each step
- [ ] `get_compound_tax_display()` formats for display
- [ ] `decompose_compound_price()` reverse calculation implemented
- [ ] `common_compound_scenarios()` provides Sri Lankan presets
- [ ] Effective rate calculated correctly (not simple addition)
- [ ] All intermediate steps tracked and available

---

## Summary

### Tasks Completed in This Document

| Task # | Task Name | Key Deliverable |
|--------|-----------|-----------------|
| 19 | Review TaxClass model | Verified tax configuration support |
| 20 | Create TaxCalculator service | Core tax calculation service |
| 21 | Implement tax-inclusive to exclusive | Inclusive → Exclusive conversion |
| 22 | Implement tax-exclusive to inclusive | Exclusive → Inclusive conversion |
| 23 | Handle compound tax scenarios | Sequential compound tax support |

### TaxCalculator Service Complete Methods

```
TaxCalculator Service:
├── Core Calculations
│   ├── get_decimal_rate()
│   ├── calculate_tax_amount()
│   ├── calculate_price_with_tax()
│   └── calculate_price_without_tax()
├── Inclusive to Exclusive
│   ├── convert_inclusive_to_exclusive()
│   ├── get_base_from_inclusive()
│   ├── get_tax_from_inclusive()
│   └── batch_convert_inclusive_to_exclusive()
├── Exclusive to Inclusive
│   ├── convert_exclusive_to_inclusive()
│   ├── get_total_from_exclusive()
│   ├── apply_tax_to_price()
│   └── batch_convert_exclusive_to_inclusive()
├── Compound Tax
│   ├── calculate_compound_tax()
│   ├── get_compound_tax_breakdown()
│   ├── calculate_effective_compound_rate()
│   └── decompose_compound_price()
├── SVAT & Exemptions
│   └── get_effective_tax_rate()
└── Validation & Display
    ├── validate_tax_calculation()
    ├── get_tax_breakdown()
    └── get_compound_tax_display()
```

### Key Achievements

- ✅ Comprehensive TaxCalculator service created
- ✅ Tax-inclusive to exclusive conversion
- ✅ Tax-exclusive to inclusive conversion
- ✅ Compound tax calculation (VAT + NBT)
- ✅ Effective compound rate calculation
- ✅ SVAT exemption logic
- ✅ Batch conversion operations
- ✅ Validation and rounding
- ✅ Formatted display methods
- ✅ Sri Lankan tax scenarios supported

### Next Steps

Proceed to [02_Tasks-24-28_Price-Methods-SVAT.md](02_Tasks-24-28_Price-Methods-SVAT.md) to add:
- get_price_with_tax() and get_price_without_tax() methods
- Tax exemption handling
- Price rounding utility
- SVAT special handling for B2B customers

---

## Notes for AI Agents

1. **Tax Rounding:** Always round to 2 decimal places (LKR cents)
2. **Compound Tax:** Apply sequentially, not additively
3. **Effective Rate:** Use formula (1+r1)×(1+r2)-1, not r1+r2
4. **SVAT:** B2B customers with SVAT registration pay 0%
5. **Validation:** Allow 1 cent rounding tolerance
6. **Sri Lanka Rates:** Standard VAT 12%, NBT 2% (historical), SVAT 0%
7. **Inclusive Prices:** Most retail prices displayed tax-inclusive
8. **Batch Operations:** Optimize for bulk price updates
9. **Reverse Calculation:** Support decomposing inclusive prices
10. **Next Document:** Price methods and SVAT handling
