# Tasks 05-09: Price Fields & Manager

> **Phase:** 04 - ERP Core Modules Part 1  
> **SubPhase:** 06 - Product Pricing  
> **Group:** A - Price Type Models  
> **Document:** 02 of 04  
> **Tasks Covered:** 05, 06, 07, 08, 09

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [01_Tasks-01-04_Pricing-App-Setup.md](01_Tasks-01-04_Pricing-App-Setup.md)
- **→ Next Document:** [03_Tasks-10-14_Variant-Price-History.md](03_Tasks-10-14_Variant-Price-History.md)

---

## Document Overview

This document extends the ProductPrice model with additional pricing fields including sale prices with date ranges, wholesale pricing, tax handling configuration, and custom model manager for advanced pricing queries. These additions support promotional pricing, B2B pricing, and multi-tenant tax compliance for the LankaCommerce Cloud ERP system.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 05 | Add sale price fields | Low | 20 min |
| 06 | Add wholesale price field | Low | 15 min |
| 07 | Add tax handling fields | Low | 20 min |
| 08 | Create ProductPrice Meta class | Low | 15 min |
| 09 | Add ProductPrice model manager | Medium | 25 min |

---

## Task 05: Add Sale Price Fields

### Overview
Add sale price functionality to the ProductPrice model with start and end datetime fields. This enables time-bound promotional pricing, seasonal sales, and flash sales for the multi-tenant ERP system.

### Dependencies
- Task 04: Create ProductPrice model

### Instructions

1. **Open `product_price.py` file**
   - File located at `backend/apps/products/pricing/models/product_price.py`

2. **Add sale_price field**
   - Add `PriceField` named `sale_price`
   - Set `null=True`, `blank=True`
   - Set `verbose_name='Sale Price'`
   - Set `help_text` explaining promotional price
   - Optional field - only set when product is on sale

3. **Add sale_price_start field**
   - Add `DateTimeField` named `sale_price_start`
   - Set `null=True`, `blank=True`
   - Set `verbose_name='Sale Start Date'`
   - Set `help_text` explaining when sale begins
   - Use timezone-aware datetime (Asia/Colombo)

4. **Add sale_price_end field**
   - Add `DateTimeField` named `sale_price_end`
   - Set `null=True`, `blank=True`
   - Set `verbose_name='Sale End Date'`
   - Set `help_text` explaining when sale ends
   - Use timezone-aware datetime

5. **Add is_on_sale property method**
   - Create `@property` decorated method
   - Check if `sale_price` is set
   - Check if current datetime is between `sale_price_start` and `sale_price_end`
   - Import `timezone.now()` from `django.utils`
   - Return `True` if all conditions met, `False` otherwise

6. **Add get_current_price method**
   - Create instance method (not property)
   - Return `sale_price` if `is_on_sale` is True
   - Otherwise return `base_price`
   - This is the currently applicable price

7. **Add discount_amount property**
   - Create `@property` decorated method
   - Calculate: `base_price - sale_price`
   - Return `Decimal('0.00')` if not on sale
   - Return difference if on sale

8. **Add discount_percentage property**
   - Create `@property` decorated method
   - Calculate: `((base_price - sale_price) / base_price) * 100`
   - Return `Decimal('0.00')` if not on sale
   - Round to 2 decimal places

9. **Add sale validation**
   - Create `clean` method
   - Check if `sale_price` is less than `base_price`
   - Check if `sale_price_start` is before `sale_price_end`
   - Raise `ValidationError` if validation fails
   - Import `ValidationError` from `django.core.exceptions`

### Sale Price Fields

| Field | Type | Purpose | Required |
|-------|------|---------|----------|
| `sale_price` | PriceField | Promotional price | No |
| `sale_price_start` | DateTimeField | Sale begins | No |
| `sale_price_end` | DateTimeField | Sale ends | No |

### Sale Price Logic Flow

```
Check is_on_sale:
  1. Is sale_price set?
  2. Is current time >= sale_price_start?
  3. Is current time <= sale_price_end?
  
If all True → use sale_price
Otherwise → use base_price
```

### Business Examples

**Example 1: Weekend Flash Sale**
- Product: Smartphone
- Base Price: ₨ 45,000.00
- Sale Price: ₨ 39,999.00
- Sale Start: 2026-01-24 00:00:00
- Sale End: 2026-01-26 23:59:59
- Discount: ₨ 5,001.00 (11.11%)

**Example 2: Seasonal Sale**
- Product: Air Conditioner
- Base Price: ₨ 125,000.00
- Sale Price: ₨ 99,999.00
- Sale Start: 2026-04-01 00:00:00 (Sinhala New Year)
- Sale End: 2026-04-14 23:59:59
- Discount: ₨ 25,001.00 (20.00%)

**Example 3: Clearance Sale**
- Product: Last Season Fashion
- Base Price: ₨ 3,500.00
- Sale Price: ₨ 1,750.00
- Sale Start: 2026-02-01 00:00:00
- Sale End: 2026-02-28 23:59:59
- Discount: ₨ 1,750.00 (50.00%)

### Sri Lanka Context

- **Festive Sales:** Sinhala New Year (April), Vesak (May), Christmas
- **Flash Sales:** Weekend sales, Pay Day sales (end of month)
- **Clearance Sales:** End of season inventory clearance
- **Timezone:** All dates in Asia/Colombo timezone
- **Display:** Show countdown timers for active sales

### Validation Rules

| Validation | Rule | Error Message |
|------------|------|---------------|
| Sale Price | Must be < base_price | "Sale price must be less than base price" |
| Date Range | start < end | "Sale start must be before sale end" |
| Date Logic | All three fields set together | "Sale price requires start and end dates" |

### Expected Outcome

ProductPrice model extended with sale price functionality including time-bound pricing, discount calculations, and validation logic.

### Verification Checklist

- [ ] `sale_price` field added with PriceField type
- [ ] `sale_price_start` and `sale_price_end` DateTimeFields added
- [ ] `is_on_sale` property checks date range and sale_price
- [ ] `get_current_price()` method returns appropriate price
- [ ] `discount_amount` property calculates difference
- [ ] `discount_percentage` property calculates percentage
- [ ] `clean()` method validates sale price and dates
- [ ] Timezone-aware datetime handling implemented

---

## Task 06: Add Wholesale Price Field

### Overview
Add wholesale pricing functionality to support B2B customers and bulk purchasers who receive discounted pricing. This is essential for distributors, retailers, and corporate customers in the multi-tenant ERP system.

### Dependencies
- Task 05: Add sale price fields

### Instructions

1. **Open `product_price.py` file**
   - Continue editing the ProductPrice model

2. **Add wholesale_price field**
   - Add `PriceField` named `wholesale_price`
   - Set `null=True`, `blank=True`
   - Set `verbose_name='Wholesale Price'`
   - Set `help_text` explaining B2B pricing
   - Optional field - only for products sold to wholesalers

3. **Add minimum_wholesale_quantity field**
   - Add `PositiveIntegerField`
   - Set `null=True`, `blank=True`
   - Set `verbose_name='Minimum Wholesale Quantity'`
   - Set `help_text` explaining minimum order quantity
   - Set `default=1`
   - Minimum quantity to qualify for wholesale price

4. **Add wholesale_discount_percentage property**
   - Create `@property` decorated method
   - Calculate: `((base_price - wholesale_price) / base_price) * 100`
   - Return `Decimal('0.00')` if wholesale_price not set
   - Shows discount offered to wholesale customers

5. **Add is_wholesale_eligible method**
   - Create instance method accepting `quantity` parameter
   - Check if `wholesale_price` is set
   - Check if `quantity >= minimum_wholesale_quantity`
   - Return `True` if both conditions met
   - Used for cart/order price calculations

6. **Add get_price_for_customer_type method**
   - Create instance method accepting `customer_type` parameter
   - Accept `customer_type` as string: 'retail', 'wholesale', 'b2b'
   - Return `wholesale_price` if customer_type is 'wholesale' or 'b2b'
   - Return current price (considering sale) for 'retail'
   - Fallback to `base_price`

7. **Update clean method**
   - Add validation: wholesale_price must be < base_price
   - Add validation: wholesale_price must be >= cost_price (if set)
   - Add validation: minimum_wholesale_quantity must be > 0
   - Raise appropriate ValidationError messages

### Wholesale Price Fields

| Field | Type | Purpose | Required |
|-------|------|---------|----------|
| `wholesale_price` | PriceField | B2B discount price | No |
| `minimum_wholesale_quantity` | PositiveIntegerField | Min qty for wholesale | No |

### Wholesale Price Logic

```
Price Selection for Customer:
  1. Wholesale/B2B customer?
     → Check quantity >= minimum_wholesale_quantity
     → Use wholesale_price if eligible
  
  2. Retail customer?
     → Check is_on_sale
     → Use sale_price if active
     → Otherwise use base_price
```

### Business Examples

**Example 1: Electronics Distributor**
- Product: LED Bulb 15W
- Base Price: ₨ 500.00
- Wholesale Price: ₨ 350.00
- Min Wholesale Qty: 50 units
- Wholesale Discount: 30%
- Target: Electrical shops buying in bulk

**Example 2: Food Distributor**
- Product: Cooking Oil 1L
- Base Price: ₨ 850.00
- Wholesale Price: ₨ 720.00
- Min Wholesale Qty: 24 units (1 carton)
- Wholesale Discount: 15.29%
- Target: Small grocery stores

**Example 3: Textile Wholesaler**
- Product: T-Shirt
- Base Price: ₨ 1,200.00
- Wholesale Price: ₨ 800.00
- Min Wholesale Qty: 100 units
- Wholesale Discount: 33.33%
- Target: Clothing retail shops

### Customer Type Mapping

| Customer Type | Price Used | Conditions |
|--------------|------------|------------|
| Retail | Sale price (if active) → Base price | Default customers |
| Wholesale | Wholesale price | Qty >= min_wholesale_quantity |
| B2B | Wholesale price | Registered B2B customer |
| Corporate | Wholesale price | Corporate account |

### Sri Lanka Business Context

- **Wholesale Markets:** Pettah, Manning Market (Colombo)
- **Distributor Model:** Common in FMCG, electronics, textiles
- **Min Quantities:** Often based on carton/box quantities
- **Payment Terms:** Wholesale customers get 30-60 day credit terms
- **Registration:** B2B customers register with BR/VAT numbers

### Validation Rules

| Validation | Rule | Purpose |
|------------|------|---------|
| Wholesale < Base | wholesale_price < base_price | Ensure discount |
| Wholesale >= Cost | wholesale_price >= cost_price | Prevent loss |
| Min Quantity | minimum_wholesale_quantity > 0 | Logical minimum |

### Expected Outcome

ProductPrice model with wholesale pricing support, customer type-based price selection, and minimum quantity requirements.

### Verification Checklist

- [ ] `wholesale_price` field added with PriceField type
- [ ] `minimum_wholesale_quantity` field added
- [ ] `wholesale_discount_percentage` property calculates discount
- [ ] `is_wholesale_eligible(quantity)` method validates eligibility
- [ ] `get_price_for_customer_type(customer_type)` method added
- [ ] `clean()` method validates wholesale price constraints
- [ ] Wholesale price less than base price enforced
- [ ] Wholesale price greater than cost price enforced

---

## Task 07: Add Tax Handling Fields

### Overview
Add tax configuration fields to the ProductPrice model to support Sri Lankan VAT/SVAT compliance, tax-inclusive/exclusive pricing, and integration with tax calculation services.

### Dependencies
- Task 06: Add wholesale price field
- TaxClass model exists (from Phase-03)

### Instructions

1. **Open `product_price.py` file**
   - Continue editing the ProductPrice model

2. **Add tax_class foreign key**
   - Add `ForeignKey` to `TaxClass` model
   - Set `on_delete=models.PROTECT`
   - Set `null=True`, `blank=True`
   - Set `related_name='product_prices'`
   - Set `verbose_name='Tax Class'`
   - Set `help_text` explaining tax classification
   - Import TaxClass from appropriate module

3. **Add is_taxable field**
   - Add `BooleanField`
   - Set `default=True`
   - Set `verbose_name='Is Taxable'`
   - Set `help_text` explaining if product subject to tax
   - Some products are tax-exempt (essentials, exports)

4. **Add tax_exemption_reason field**
   - Add `CharField`
   - Set `max_length=200`
   - Set `null=True`, `blank=True`
   - Set `verbose_name='Tax Exemption Reason'`
   - Set `help_text` for documentation/audit purposes
   - Required if is_taxable=False

5. **Update is_tax_inclusive field documentation**
   - This field already exists from Task 04
   - Update help_text to clarify usage with tax_class
   - Explains whether stored prices include VAT

6. **Add get_price_with_tax method**
   - Create instance method
   - Accept optional `customer` parameter for SVAT checking
   - If `is_tax_inclusive` is True, return base_price
   - If False, calculate: base_price + (base_price * tax_rate)
   - Return calculated price as Decimal
   - Use tax_class.rate if available

7. **Add get_price_without_tax method**
   - Create instance method
   - If `is_tax_inclusive` is False, return base_price
   - If True, calculate: base_price / (1 + tax_rate)
   - Return calculated price as Decimal
   - Use tax_class.rate if available

8. **Add get_tax_amount method**
   - Create instance method accepting `price` parameter
   - Calculate tax amount based on is_tax_inclusive
   - If inclusive: tax = price - (price / (1 + rate))
   - If exclusive: tax = price * rate
   - Return tax amount as Decimal

9. **Update clean method**
   - Add validation: if is_taxable=False, require tax_exemption_reason
   - Add validation: if is_taxable=True, tax_class should be set
   - Add business logic warnings

### Tax Configuration Fields

| Field | Type | Purpose | Required |
|-------|------|---------|----------|
| `tax_class` | ForeignKey | Link to tax configuration | No |
| `is_taxable` | BooleanField | Product subject to tax | Yes |
| `tax_exemption_reason` | CharField | Why exempt | If not taxable |
| `is_tax_inclusive` | BooleanField | Price includes tax | Yes (existing) |

### Tax Calculation Logic

```
Tax-Inclusive Price (stored: ₨ 1,120.00, rate: 12%):
  Base Price = 1,120 / 1.12 = ₨ 1,000.00
  Tax Amount = 1,120 - 1,000 = ₨ 120.00
  Total Price = ₨ 1,120.00

Tax-Exclusive Price (stored: ₨ 1,000.00, rate: 12%):
  Base Price = ₨ 1,000.00
  Tax Amount = 1,000 * 0.12 = ₨ 120.00
  Total Price = 1,000 + 120 = ₨ 1,120.00
```

### Sri Lankan Tax Context

| Tax Type | Rate | Description |
|----------|------|-------------|
| **VAT** | 12% | Standard value-added tax (2025) |
| **SVAT** | 0% | Social Value Added Tax (B2B exempt) |
| **Zero-rated** | 0% | Exports, essential goods |
| **Exempt** | 0% | Financial services, education |

### Tax Exemption Examples

| Product | Status | Reason |
|---------|--------|--------|
| Fresh Vegetables | Exempt | Essential food items |
| Rice | Exempt | Staple food |
| Educational Books | Exempt | Educational materials |
| Export Goods | Zero-rated | International trade |
| Medical Equipment | Exempt | Healthcare essentials |

### Business Examples

**Example 1: Electronics (Taxable)**
- Product: Laptop
- Base Price (excl): ₨ 100,000.00
- VAT (12%): ₨ 12,000.00
- Total: ₨ 112,000.00
- Tax Class: Standard VAT
- Is Taxable: Yes

**Example 2: Essential Food (Exempt)**
- Product: Rice 5kg
- Price: ₨ 850.00
- VAT: ₨ 0.00
- Total: ₨ 850.00
- Tax Class: None
- Is Taxable: No
- Exemption Reason: "Essential food item"

**Example 3: B2B Office Supplies (SVAT)**
- Product: Office Desk
- Base Price: ₨ 25,000.00
- SVAT: ₨ 0.00 (B2B customer)
- Total: ₨ 25,000.00
- Tax Class: SVAT
- Is Taxable: Yes (but 0% for B2B)

### Expected Outcome

ProductPrice model with comprehensive tax configuration, tax calculation methods, and support for Sri Lankan tax compliance including VAT and SVAT.

### Verification Checklist

- [ ] `tax_class` ForeignKey added with PROTECT delete
- [ ] `is_taxable` BooleanField added with default True
- [ ] `tax_exemption_reason` CharField added for exempt products
- [ ] `get_price_with_tax()` method calculates inclusive price
- [ ] `get_price_without_tax()` method calculates exclusive price
- [ ] `get_tax_amount(price)` method calculates tax component
- [ ] `clean()` validates tax exemption reason requirement
- [ ] Support for both tax-inclusive and tax-exclusive pricing

---

## Task 08: Create ProductPrice Meta Class

### Overview
Define the Meta class for the ProductPrice model with database configuration, ordering, indexing, permissions, and verbose names for Django admin and API display.

### Dependencies
- Tasks 04-07: ProductPrice model fields complete

### Instructions

1. **Open `product_price.py` file**
   - Locate the ProductPrice class definition

2. **Create Meta inner class**
   - Add `class Meta:` within ProductPrice class
   - Should be at the bottom of the class, before methods

3. **Set db_table**
   - Set `db_table = 'pricing_product_price'`
   - Explicit table name for clarity
   - Follows tenant schema naming convention

4. **Set verbose names**
   - Set `verbose_name = 'Product Price'`
   - Set `verbose_name_plural = 'Product Prices'`
   - Used in Django admin interface

5. **Set default ordering**
   - Set `ordering = ['product__name']`
   - Orders by product name alphabetically
   - Improves admin and query readability

6. **Add database indexes**
   - Create `indexes` list
   - Add index on `['product']` for FK lookups
   - Add index on `['is_taxable']` for tax filtering
   - Add index on `['sale_price_start', 'sale_price_end']` for active sales
   - Use `models.Index` class

7. **Add constraints**
   - Create `constraints` list
   - Add CheckConstraint: sale_price must be null or < base_price
   - Add CheckConstraint: wholesale_price must be null or < base_price
   - Add CheckConstraint: cost_price must be null or <= base_price
   - Use `models.CheckConstraint` with Q objects

8. **Set permissions**
   - Create `permissions` list
   - Add permission: `('view_cost_price', 'Can view cost prices')`
   - Add permission: `('manage_pricing', 'Can manage all pricing')`
   - Add permission: `('create_promotions', 'Can create promotional pricing')`
   - Restricts sensitive pricing data access

9. **Add model documentation**
   - Update class docstring
   - Document all fields clearly
   - Document all pricing logic
   - Add usage examples in docstring

### Meta Class Configuration

| Setting | Value | Purpose |
|---------|-------|---------|
| `db_table` | `'pricing_product_price'` | Explicit table naming |
| `verbose_name` | `'Product Price'` | Admin display name |
| `ordering` | `['product__name']` | Default sort order |

### Database Indexes

| Index Fields | Purpose |
|-------------|---------|
| `['product']` | Fast product price lookups |
| `['is_taxable']` | Tax report filtering |
| `['sale_price_start', 'sale_price_end']` | Active sales queries |

### Database Constraints

| Constraint | Validation |
|------------|------------|
| Sale Price Check | sale_price < base_price OR sale_price IS NULL |
| Wholesale Check | wholesale_price < base_price OR wholesale_price IS NULL |
| Cost Price Check | cost_price <= base_price OR cost_price IS NULL |

### Custom Permissions

| Permission Code | Display Name | Purpose |
|----------------|--------------|---------|
| `view_cost_price` | Can view cost prices | Restrict cost visibility |
| `manage_pricing` | Can manage all pricing | Full pricing control |
| `create_promotions` | Can create promotional pricing | Sale price management |

### Permission Use Cases

**Finance Manager:**
- Has `view_cost_price` permission
- Can see profit margins and costs
- Can analyze pricing strategies

**Store Manager:**
- Has `manage_pricing` permission
- Can update base prices
- Cannot view costs (sensitive)

**Marketing Team:**
- Has `create_promotions` permission
- Can create sale prices
- Cannot change base prices

### Expected Outcome

Complete Meta class configuration with database optimizations, proper naming, constraints, and granular permissions for pricing data.

### Verification Checklist

- [ ] Meta inner class created in ProductPrice model
- [ ] `db_table` set to `'pricing_product_price'`
- [ ] `verbose_name` and `verbose_name_plural` set
- [ ] `ordering` set to product name
- [ ] Indexes created for product, is_taxable, and sale dates
- [ ] CheckConstraints added for price validations
- [ ] Custom permissions defined (view_cost_price, manage_pricing, create_promotions)
- [ ] Class docstring updated with field documentation

---

## Task 09: Add ProductPrice Model Manager

### Overview
Create a custom model manager for ProductPrice with utility methods for common pricing queries including active sales lookup, wholesale eligibility checking, and multi-tenant price filtering.

### Dependencies
- Tasks 04-08: Complete ProductPrice model

### Instructions

1. **Create `price_manager.py` file**
   - Create in `backend/apps/products/pricing/managers/`
   - This file contains custom manager class

2. **Import required modules**
   - Import `models` from `django.db`
   - Import `Q` from `django.db.models`
   - Import `timezone` from `django.utils`

3. **Define ProductPriceManager class**
   - Create class inheriting from `models.Manager`
   - Add comprehensive docstring

4. **Add get_queryset method**
   - Override base `get_queryset` method
   - Apply select_related for product and tax_class
   - Optimize database queries
   - Return optimized queryset

5. **Add active_sales method**
   - Create method returning products currently on sale
   - Filter: sale_price is not null
   - Filter: sale_price_start <= now
   - Filter: sale_price_end >= now
   - Use `timezone.now()` for current time
   - Return filtered queryset

6. **Add upcoming_sales method**
   - Create method returning future scheduled sales
   - Filter: sale_price is not null
   - Filter: sale_price_start > now
   - Order by sale_price_start
   - Return filtered queryset

7. **Add expired_sales method**
   - Create method returning past sales
   - Filter: sale_price is not null
   - Filter: sale_price_end < now
   - Order by sale_price_end descending
   - Return filtered queryset

8. **Add with_wholesale_pricing method**
   - Create method returning products with wholesale prices
   - Filter: wholesale_price is not null
   - Exclude null wholesale prices
   - Return filtered queryset

9. **Add taxable_products method**
   - Create method returning taxable products
   - Filter: is_taxable=True
   - Optionally filter by tax_class if parameter provided
   - Return filtered queryset

10. **Add tax_exempt_products method**
    - Create method returning tax-exempt products
    - Filter: is_taxable=False
    - Return filtered queryset

11. **Add for_customer_type method**
    - Accept `customer_type` parameter ('retail', 'wholesale', 'b2b')
    - Return appropriate product prices based on customer type
    - Annotate with effective_price for sorting
    - Return queryset with calculated fields

12. **Add profitable_products method**
    - Create method returning products with profit margin
    - Filter: cost_price is not null
    - Annotate with calculated profit_margin
    - Accept optional `min_margin` parameter
    - Return products above minimum margin threshold

13. **Add products_in_price_range method**
    - Accept `min_price` and `max_price` parameters
    - Filter by base_price range
    - Return filtered queryset
    - Useful for category filtering

14. **Update ProductPrice model**
    - Open `product_price.py`
    - Import ProductPriceManager
    - Add manager: `objects = ProductPriceManager()`
    - Replace default manager

15. **Export manager from `managers/__init__.py`**
    - Import and export ProductPriceManager
    - Make available for import

### ProductPriceManager Methods

| Method | Purpose | Returns |
|--------|---------|---------|
| `get_queryset()` | Optimized base queryset | QuerySet |
| `active_sales()` | Currently active sales | QuerySet |
| `upcoming_sales()` | Future scheduled sales | QuerySet |
| `expired_sales()` | Past sales | QuerySet |
| `with_wholesale_pricing()` | Products with wholesale prices | QuerySet |
| `taxable_products()` | Taxable products | QuerySet |
| `tax_exempt_products()` | Tax-exempt products | QuerySet |
| `for_customer_type(type)` | Prices for customer type | QuerySet |
| `profitable_products(min_margin)` | Products above margin | QuerySet |
| `products_in_price_range(min, max)` | Products in price range | QuerySet |

### Usage Examples

**Example 1: Get Active Sales**
```python
# Get all products currently on sale
on_sale = ProductPrice.objects.active_sales()

# Display in POS
for price in on_sale:
    print(f"{price.product.name}: {price.sale_price}")
```

**Example 2: Wholesale Customer View**
```python
# Get products with wholesale pricing
wholesale_products = ProductPrice.objects.with_wholesale_pricing()

# Show wholesale catalog
for price in wholesale_products:
    print(f"{price.product.name}")
    print(f"Retail: {price.base_price}")
    print(f"Wholesale: {price.wholesale_price}")
```

**Example 3: Tax Reporting**
```python
# Get all taxable products for VAT report
taxable = ProductPrice.objects.taxable_products()
total_tax = sum(price.get_tax_amount(price.base_price) for price in taxable)

# Get exempt products
exempt = ProductPrice.objects.tax_exempt_products()
```

**Example 4: Profit Analysis**
```python
# Get products with at least 20% margin
profitable = ProductPrice.objects.profitable_products(min_margin=20)

# Analyze profitability
for price in profitable:
    print(f"{price.product.name}: {price.profit_margin}%")
```

**Example 5: Price Range Filter**
```python
# Get mid-range products (₨ 1,000 - ₨ 5,000)
mid_range = ProductPrice.objects.products_in_price_range(
    Decimal('1000.00'),
    Decimal('5000.00')
)
```

### Query Optimization

**Without Manager:**
```python
# Multiple database queries
prices = ProductPrice.objects.filter(
    sale_price__isnull=False,
    sale_price_start__lte=timezone.now(),
    sale_price_end__gte=timezone.now()
)
# N+1 queries when accessing product and tax_class
```

**With Manager:**
```python
# Optimized single query
prices = ProductPrice.objects.active_sales()
# select_related already applied, no N+1 problem
```

### Multi-Tenancy Considerations

- Manager methods automatically respect tenant isolation
- All queries operate within current tenant schema
- No cross-tenant data leakage
- Tenant context provided by django-tenants middleware

### Expected Outcome

A custom ProductPriceManager with utility methods for common pricing queries, reducing code duplication and improving query performance across the pricing system.

### Verification Checklist

- [ ] `price_manager.py` created in managers directory
- [ ] `ProductPriceManager` class inherits from `models.Manager`
- [ ] `get_queryset()` applies select_related optimization
- [ ] `active_sales()` method filters current sales
- [ ] `upcoming_sales()` method returns future sales
- [ ] `expired_sales()` method returns past sales
- [ ] `with_wholesale_pricing()` method filters wholesale products
- [ ] `taxable_products()` and `tax_exempt_products()` methods added
- [ ] `for_customer_type()` method handles customer types
- [ ] `profitable_products()` method filters by margin
- [ ] `products_in_price_range()` method added
- [ ] Manager assigned to ProductPrice.objects
- [ ] Manager exported from `managers/__init__.py`

---

## Summary

### Tasks Completed in This Document

| Task # | Task Name | Key Deliverable |
|--------|-----------|-----------------|
| 05 | Add sale price fields | Sale price with date range, discount calculations |
| 06 | Add wholesale price field | B2B pricing with minimum quantities |
| 07 | Add tax handling fields | Tax configuration, calculations, VAT/SVAT support |
| 08 | Create ProductPrice Meta class | Database indexes, constraints, permissions |
| 09 | Add ProductPrice model manager | Custom manager with pricing query methods |

### ProductPrice Model Complete Fields

```python
ProductPrice Model:
├── Relationships
│   ├── product (OneToOneField)
│   └── tax_class (ForeignKey)
├── Base Pricing
│   ├── base_price (PriceField)
│   └── cost_price (PriceField, optional)
├── Sale Pricing
│   ├── sale_price (PriceField, optional)
│   ├── sale_price_start (DateTimeField)
│   └── sale_price_end (DateTimeField)
├── Wholesale Pricing
│   ├── wholesale_price (PriceField, optional)
│   └── minimum_wholesale_quantity (PositiveIntegerField)
├── Tax Configuration
│   ├── is_taxable (BooleanField)
│   ├── is_tax_inclusive (BooleanField)
│   └── tax_exemption_reason (CharField)
├── Metadata
│   ├── pricing_notes (TextField)
│   └── last_cost_update (DateTimeField)
└── From BaseModel
    ├── created_at
    ├── updated_at
    └── is_active
```

### Key Achievements

- ✅ Sale pricing with time-bound promotions
- ✅ Wholesale pricing for B2B customers
- ✅ Sri Lankan VAT/SVAT tax configuration
- ✅ Database indexes and constraints
- ✅ Custom permissions for pricing data
- ✅ Optimized custom manager with query methods
- ✅ Profit margin and discount calculations
- ✅ Multi-tenant isolation maintained

### Next Steps

Proceed to [03_Tasks-10-14_Variant-Price-History.md](03_Tasks-10-14_Variant-Price-History.md) to add:
- VariantPrice model for product variant pricing
- Price override logic for variants
- Price validation methods
- Profit margin calculations for variants
- PriceHistory model for audit trail

---

## Notes for AI Agents

1. **Sale Dates:** Always use timezone-aware datetimes (Asia/Colombo)
2. **Wholesale Min Qty:** Often based on carton/box quantities in Sri Lanka
3. **Tax Inclusive:** Sri Lankan retail prices typically include VAT (12%)
4. **SVAT:** B2B customers with SVAT registration pay 0% VAT
5. **Manager Optimization:** select_related prevents N+1 queries
6. **Permissions:** view_cost_price is sensitive, restrict carefully
7. **Price Validation:** All price checks in clean() method
8. **Customer Types:** retail, wholesale, b2b mapping
9. **Active Sales:** Check both date range AND sale_price not null
10. **Next Document:** VariantPrice and PriceHistory models
