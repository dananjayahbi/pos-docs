# Tasks 15-18: Signals, Utils & Admin

> **Phase:** 04 - ERP Core Modules Part 1  
> **SubPhase:** 06 - Product Pricing  
> **Group:** A - Price Type Models  
> **Document:** 04 of 04  
> **Tasks Covered:** 15, 16, 17, 18

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [03_Tasks-10-14_Variant-Price-History.md](03_Tasks-10-14_Variant-Price-History.md)
- **→ Next Group:** [../Group-B_Tax-Integration-Calculation/](../Group-B_Tax-Integration-Calculation/)

---

## Document Overview

This document completes Group A by implementing Django signals for automatic price history tracking, currency formatting utilities for consistent LKR display, price comparison helper methods, and Django admin configuration for managing pricing data through the admin interface.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 15 | Add PriceHistory signals | Medium | 25 min |
| 16 | Create currency formatting utility | Low | 15 min |
| 17 | Add price comparison methods | Low | 20 min |
| 18 | Create ProductPrice admin | Low | 20 min |

---

## Task 15: Add PriceHistory Signals

### Overview
Implement Django signals to automatically create PriceHistory records whenever ProductPrice or VariantPrice models are updated. This ensures complete audit trail without manual intervention, tracking all price changes automatically across the multi-tenant ERP system.

### Dependencies
- Task 14: Create price history model
- ProductPrice and VariantPrice models complete

### Instructions

1. **Create `signals.py` file**
   - Create in `backend/apps/products/pricing/`
   - This file contains signal handlers for price tracking

2. **Import required modules**
   - Import `post_save` signal from `django.db.models.signals`
   - Import `receiver` decorator from `django.dispatch`
   - Import `ProductPrice`, `VariantPrice`, `PriceHistory` models
   - Import `ContentType` from `django.contrib.contenttypes.models`

3. **Create track_product_price_change signal handler**
   - Use `@receiver` decorator with `post_save` signal
   - Specify `sender=ProductPrice`
   - Accept `sender`, `instance`, `created`, `update_fields`, `**kwargs`
   - Skip if `created=True` (new records don't need history)
   - Skip if no fields updated

4. **Detect which price fields changed**
   - Check if `update_fields` contains price fields
   - Price fields: base_price, sale_price, wholesale_price, cost_price
   - Get old values from database using `pk`
   - Compare old vs new values

5. **Create history record for each changed price**
   - For each changed price field:
     - Determine price_type (BASE, SALE, WHOLESALE, COST)
     - Get old_value from database
     - Get new_value from instance
     - Calculate change_amount and change_percentage
     - Create PriceHistory record with ContentType

6. **Set change metadata**
   - Try to get current user from middleware/context
   - Set `changed_by` if user available
   - Set `automated_change=False` for manual edits
   - Set `change_source` based on context
   - Generate `change_reason` if not provided

7. **Create track_variant_price_change signal handler**
   - Similar to ProductPrice handler
   - Use `@receiver` with `sender=VariantPrice`
   - Track same price fields
   - Include variant reference in history

8. **Add helper function get_price_change_details**
   - Accept `old_value`, `new_value` parameters
   - Calculate change_amount
   - Calculate change_percentage (handle division by zero)
   - Return dictionary with calculated values

9. **Add helper function get_current_user**
   - Try to get user from thread-local storage
   - Fallback to None if not available
   - Used for tracking who made changes

10. **Register signals in apps.py**
    - Open `apps.py`
    - Import signals in `ready()` method
    - Ensure signals are connected when app loads

11. **Create middleware for user tracking**
    - Create `middleware.py` file
    - Implement `CurrentUserMiddleware` class
    - Store current user in thread-local storage
    - Makes user available to signals

### Signal Flow Diagram

```
User Updates Price
       ↓
Django Model Save
       ↓
post_save Signal Triggered
       ↓
Signal Handler Executes
       ↓
Get Old Value from DB
       ↓
Compare Old vs New
       ↓
Calculate Changes
       ↓
Create PriceHistory Record
       ↓
History Saved to DB
```

### Price Change Detection Logic

```python
# Pseudocode for signal handler
def handle_price_change(instance, update_fields):
    if created:
        return  # No history for new records
    
    price_fields = {
        'base_price': 'BASE',
        'sale_price': 'SALE',
        'wholesale_price': 'WHOLESALE',
        'cost_price': 'COST'
    }
    
    for field_name, price_type in price_fields.items():
        if field_name in update_fields:
            old_value = get_old_value(instance, field_name)
            new_value = getattr(instance, field_name)
            
            if old_value != new_value:
                create_history(
                    instance=instance,
                    price_type=price_type,
                    old_value=old_value,
                    new_value=new_value
                )
```

### History Record Creation

| Scenario | History Created | Details |
|----------|----------------|---------|
| New product price | No | No old value to compare |
| Base price updated | Yes | BASE type history |
| Sale price added | Yes | SALE type, old_value=None |
| Sale price removed | Yes | SALE type, new_value=None |
| Multiple prices updated | Yes (multiple) | One record per price type |
| No price changed | No | No history needed |

### Business Examples

**Example 1: Simple Price Update**
```
User: finance_manager
Action: Update base price
Product: Laptop
Old Base Price: ₨ 120,000.00
New Base Price: ₨ 125,000.00

Signal triggered → History created:
  - price_type: BASE
  - old_value: 120,000.00
  - new_value: 125,000.00
  - change_amount: +5,000.00
  - change_percentage: +4.17%
  - changed_by: finance_manager
  - change_source: manual
```

**Example 2: Multiple Prices Updated**
```
Action: Bulk price adjustment
Product: Smartphone

Changes:
1. Base: ₨ 45,000 → ₨ 48,000
2. Sale: ₨ 42,000 → ₨ 45,000
3. Wholesale: ₨ 40,000 → ₨ 43,000

Signal creates 3 history records:
  - One for BASE
  - One for SALE
  - One for WHOLESALE
All timestamped identically
```

**Example 3: Sale Price Added**
```
Action: Start promotion
Product: T-Shirt
Old Sale Price: None
New Sale Price: ₨ 850.00

History created:
  - price_type: SALE
  - old_value: None
  - new_value: 850.00
  - change_amount: N/A
  - change_percentage: N/A
  - change_reason: "Weekend flash sale"
```

**Example 4: Automated Import**
```
Action: CSV bulk import
Changed By: system (None)
Source: import
Automated: True

Multiple products updated:
  - Each creates history
  - All marked as automated
  - Source indicates import
  - No user attribution
```

### Thread-Local User Storage

**Middleware Implementation:**
```python
# Conceptual structure
class CurrentUserMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response
    
    def __call__(self, request):
        # Store user in thread-local
        set_current_user(request.user)
        
        response = self.get_response(request)
        
        # Clean up thread-local
        clear_current_user()
        
        return response
```

### Signal Registration

```python
# In apps.py
class PricingConfig(AppConfig):
    name = 'apps.products.pricing'
    
    def ready(self):
        # Import signals to register handlers
        import apps.products.pricing.signals
```

### Expected Outcome

Automatic price history tracking via Django signals, capturing all price changes with metadata including who changed it, when, and how much.

### Verification Checklist

- [ ] `signals.py` file created in pricing app
- [ ] `track_product_price_change` signal handler implemented
- [ ] `track_variant_price_change` signal handler implemented
- [ ] Signal handlers use `@receiver` decorator with `post_save`
- [ ] Old values fetched from database for comparison
- [ ] Change calculations (amount and percentage) implemented
- [ ] PriceHistory records created with ContentType
- [ ] `get_price_change_details` helper function created
- [ ] `get_current_user` helper function for user tracking
- [ ] Signals imported in `apps.py` `ready()` method
- [ ] `CurrentUserMiddleware` created for user context
- [ ] Middleware registered in Django settings

---

## Task 16: Create Currency Formatting Utility

### Overview
Create utility functions for consistent LKR currency formatting throughout the application, including display formatting, parsing, rounding, and localization for Sri Lankan rupee formatting conventions.

### Dependencies
- Task 02: Currency constants defined

### Instructions

1. **Open `utils.py` file**
   - File in `backend/apps/products/pricing/`
   - Add currency formatting utilities

2. **Import required modules**
   - Import `Decimal` from `decimal`
   - Import currency constants from `.constants`
   - Import `format_html` from `django.utils.html`

3. **Create format_lkr function**
   - Accept `amount` parameter (Decimal or float)
   - Accept optional `include_symbol` parameter (default True)
   - Convert amount to Decimal if needed
   - Format with comma thousand separator
   - Add currency symbol if requested
   - Return formatted string: "₨ 1,250.00"

4. **Create format_lkr_html function**
   - Accept same parameters as format_lkr
   - Return HTML-safe formatted string
   - Use `format_html` for safety
   - Useful for Django templates and admin
   - Can include CSS classes for styling

5. **Create parse_lkr function**
   - Accept `value` parameter (string)
   - Remove currency symbol if present
   - Remove comma separators
   - Convert to Decimal
   - Handle invalid inputs gracefully
   - Return Decimal or None

6. **Create round_lkr function**
   - Accept `amount` parameter
   - Round to 2 decimal places (LKR cents)
   - Use ROUND_HALF_UP rounding mode
   - Return Decimal
   - Ensures consistent rounding

7. **Create format_price_range function**
   - Accept `min_price` and `max_price` parameters
   - Format as range: "₨ 1,000 - ₨ 5,000"
   - Handle None values
   - Return formatted range string

8. **Create format_discount function**
   - Accept `original_price`, `discounted_price` parameters
   - Calculate discount amount and percentage
   - Format as: "₨ 500 off (20%)"
   - Return formatted discount string

9. **Create get_price_display function**
   - Accept `product_price` or `variant_price` object
   - Return appropriate price with formatting
   - Check for active sales
   - Show strikethrough for original price if on sale
   - Return HTML string for display

10. **Create compare_prices function**
    - Accept two price values
    - Calculate difference (amount and percentage)
    - Return comparison result
    - Positive means increase, negative means decrease

11. **Add localization support**
    - Create `format_lkr_localized` function
    - Accept `locale` parameter (si_LK, ta_LK, en_LK)
    - Format according to Sri Lankan locales
    - Handle Sinhala numerals if needed

### Formatting Functions

| Function | Purpose | Example Output |
|----------|---------|----------------|
| `format_lkr(amount)` | Basic formatting | "₨ 1,250.00" |
| `format_lkr_html(amount)` | HTML-safe format | `<span class="price">₨ 1,250.00</span>` |
| `parse_lkr(value)` | String to Decimal | "₨1,250.00" → Decimal('1250.00') |
| `round_lkr(amount)` | Round to cents | 1250.555 → 1250.56 |
| `format_price_range(min, max)` | Range display | "₨ 100 - ₨ 500" |
| `format_discount(orig, disc)` | Discount display | "₨ 200 off (20%)" |

### Formatting Examples

**Basic Formatting:**
```python
format_lkr(Decimal('1250.50'))
→ "₨ 1,250.50"

format_lkr(Decimal('1250.50'), include_symbol=False)
→ "1,250.50"

format_lkr(Decimal('1500000.75'))
→ "₨ 1,500,000.75"
```

**HTML Formatting:**
```python
format_lkr_html(Decimal('1250.00'))
→ '<span class="lkr-price">₨ 1,250.00</span>'
```

**Parsing:**
```python
parse_lkr("₨ 1,250.50")
→ Decimal('1250.50')

parse_lkr("1,250.50")
→ Decimal('1250.50')

parse_lkr("invalid")
→ None
```

**Price Range:**
```python
format_price_range(
    Decimal('1000.00'),
    Decimal('5000.00')
)
→ "₨ 1,000 - ₨ 5,000"
```

**Discount Display:**
```python
format_discount(
    Decimal('10000.00'),
    Decimal('8000.00')
)
→ "₨ 2,000 off (20%)"
```

**Sale Price Display:**
```python
get_price_display(product_price)
→ '<del>₨ 10,000</del> <strong>₨ 8,000</strong>'
```

### Rounding Behavior

| Value | Rounded | Rounding Rule |
|-------|---------|---------------|
| 1250.554 | 1250.55 | Down (< 0.5) |
| 1250.555 | 1250.56 | Up (≥ 0.5) |
| 1250.5049 | 1250.50 | Down |
| 1250.5050 | 1250.51 | Up |

### Sri Lanka Localization

**Number Format:**
- Western numerals: 1, 2, 3, 4, 5
- Comma thousand separator: 1,250
- Period decimal separator: 1,250.00
- Currency symbol before amount: ₨ 1,250

**Optional Sinhala Numerals:**
- ෧, ෨, ෩, ෪, ෫, ෬, ෭, ෮, ෯, ෰
- Rarely used for prices
- Mainly for cultural/traditional contexts

### Template Usage

**Django Template:**
```django
{{ product.price.base_price|format_lkr }}
→ Displays: ₨ 1,250.00

{% if product.price.is_on_sale %}
    <del>{{ product.price.base_price|format_lkr }}</del>
    <strong>{{ product.price.sale_price|format_lkr }}</strong>
{% endif %}
```

### API Response Formatting

**JSON Response:**
```json
{
    "base_price": "1250.00",
    "base_price_formatted": "₨ 1,250.00",
    "sale_price": "1000.00",
    "sale_price_formatted": "₨ 1,000.00",
    "discount": "₨ 250 off (20%)"
}
```

### Expected Outcome

Comprehensive currency formatting utilities ensuring consistent LKR display throughout the application with proper comma separators, symbols, and rounding.

### Verification Checklist

- [ ] `format_lkr()` function formats with symbol and commas
- [ ] `format_lkr_html()` returns HTML-safe formatted price
- [ ] `parse_lkr()` converts string to Decimal
- [ ] `round_lkr()` rounds to 2 decimal places
- [ ] `format_price_range()` displays min-max range
- [ ] `format_discount()` shows amount and percentage
- [ ] `get_price_display()` handles sale price display
- [ ] `compare_prices()` calculates difference
- [ ] All functions handle None and invalid inputs gracefully
- [ ] Functions accept both Decimal and numeric types

---

## Task 17: Add Price Comparison Methods

### Overview
Create utility methods for comparing prices, detecting price changes, analyzing price trends, and generating price comparison reports for business intelligence and display purposes.

### Dependencies
- Task 16: Currency formatting utility complete

### Instructions

1. **Continue in `utils.py` file**
   - Add price comparison utilities

2. **Create calculate_price_difference function**
   - Accept `old_price`, `new_price` parameters
   - Calculate absolute difference
   - Calculate percentage change
   - Determine direction (increase/decrease)
   - Return dictionary with all details

3. **Create is_price_higher function**
   - Accept two price parameters
   - Return True if first price > second price
   - Handle None values
   - Simple boolean comparison

4. **Create is_significant_change function**
   - Accept `old_price`, `new_price` parameters
   - Accept `threshold_percentage` parameter (default 5%)
   - Calculate percentage change
   - Return True if change exceeds threshold
   - Used to flag notable price changes

5. **Create get_price_trend function**
   - Accept list of price values with timestamps
   - Analyze trend: increasing, decreasing, stable
   - Calculate average change
   - Return trend analysis dictionary

6. **Create compare_product_prices function**
   - Accept two `ProductPrice` objects
   - Compare all price types (base, sale, wholesale)
   - Return comprehensive comparison report
   - Include differences and recommendations

7. **Create get_price_statistics function**
   - Accept QuerySet of ProductPrice objects
   - Calculate min, max, average, median
   - Return statistical summary
   - Useful for category analysis

8. **Create find_pricing_anomalies function**
   - Accept ProductPrice queryset
   - Detect anomalies:
     - Sale price > base price
     - Wholesale > base
     - Negative margins
     - Extreme outliers
   - Return list of anomalies with details

9. **Create calculate_optimal_price function**
   - Accept cost_price, target_margin
   - Calculate recommended price
   - Round to reasonable amount
   - Consider psychological pricing

10. **Create suggest_price_tiers function**
    - Accept base_price
    - Generate suggested tiered pricing
    - Example: Buy 10+, 50+, 100+
    - Return dictionary of quantity:price pairs

### Comparison Functions

| Function | Purpose | Returns |
|----------|---------|---------|
| `calculate_price_difference()` | Full difference analysis | Dict with amount, %, direction |
| `is_price_higher()` | Simple comparison | Boolean |
| `is_significant_change()` | Threshold check | Boolean |
| `get_price_trend()` | Analyze price history | Trend analysis |
| `compare_product_prices()` | Compare two products | Comparison report |
| `get_price_statistics()` | Category stats | Min, max, avg, median |
| `find_pricing_anomalies()` | Detect errors | List of issues |
| `calculate_optimal_price()` | Price recommendation | Suggested price |
| `suggest_price_tiers()` | Tiered pricing | Dict of tiers |

### Price Difference Analysis

```python
calculate_price_difference(
    old_price=Decimal('10000.00'),
    new_price=Decimal('12000.00')
)
→ {
    'old_price': Decimal('10000.00'),
    'new_price': Decimal('12000.00'),
    'difference': Decimal('2000.00'),
    'percentage': Decimal('20.00'),
    'direction': 'increase',
    'formatted_difference': '₨ 2,000.00',
    'formatted_percentage': '+20%'
}
```

### Significant Change Detection

| Old Price | New Price | Threshold | Significant? |
|-----------|-----------|-----------|--------------|
| ₨ 1,000 | ₨ 1,040 | 5% | No (4% change) |
| ₨ 1,000 | ₨ 1,060 | 5% | Yes (6% change) |
| ₨ 10,000 | ₨ 15,000 | 5% | Yes (50% change) |

### Price Trend Analysis

```python
get_price_trend([
    {'price': 1000, 'date': '2026-01-01'},
    {'price': 1100, 'date': '2026-01-08'},
    {'price': 1200, 'date': '2026-01-15'},
    {'price': 1300, 'date': '2026-01-22'}
])
→ {
    'trend': 'increasing',
    'average_change': 100.00,
    'total_change': 300.00,
    'percentage_change': 30.00,
    'is_volatile': False
}
```

### Product Comparison

```python
compare_product_prices(laptop_price, desktop_price)
→ {
    'base_price_diff': '₨ 20,000 higher',
    'sale_price_diff': '₨ 15,000 higher',
    'wholesale_diff': '₨ 18,000 higher',
    'better_deal': 'Desktop (if wholesale)',
    'recommendation': 'Laptop has higher premium'
}
```

### Price Statistics

```python
get_price_statistics(Electronics.objects.all())
→ {
    'min_price': '₨ 5,000',
    'max_price': '₨ 200,000',
    'avg_price': '₨ 45,000',
    'median_price': '₨ 35,000',
    'total_products': 150,
    'price_range': '₨ 195,000'
}
```

### Pricing Anomalies

```python
find_pricing_anomalies(ProductPrice.objects.all())
→ [
    {
        'product': 'Laptop X',
        'issue': 'sale_price_higher_than_base',
        'details': 'Sale: ₨12,000, Base: ₨10,000'
    },
    {
        'product': 'TV Y',
        'issue': 'negative_margin',
        'details': 'Base: ₨50,000, Cost: ₨55,000'
    }
]
```

### Optimal Price Calculation

```python
calculate_optimal_price(
    cost_price=Decimal('700.00'),
    target_margin=30  # 30% margin
)
→ Decimal('999.00')  # Rounded to psychological price

# Calculation:
# Required price = 700 / (1 - 0.30) = 1000.00
# Rounded to 999.00 (psychological pricing)
```

### Suggested Price Tiers

```python
suggest_price_tiers(base_price=Decimal('100.00'))
→ {
    1: Decimal('100.00'),   # Retail
    10: Decimal('95.00'),   # 5% off
    50: Decimal('90.00'),   # 10% off
    100: Decimal('85.00'),  # 15% off
    500: Decimal('80.00')   # 20% off
}
```

### Business Examples

**Example 1: Price Increase Alert**
```
Old Price: ₨ 10,000
New Price: ₨ 11,500
Change: +15%
is_significant_change(threshold=10%) → True
Action: Notify customers, update marketing
```

**Example 2: Competitive Analysis**
```
Our Product: ₨ 45,000
Competitor: ₨ 42,000
Difference: ₨ 3,000 higher (7.1%)
Recommendation: Consider price match or highlight features
```

**Example 3: Category Pricing Review**
```
Category: Electronics
Avg Price: ₨ 35,000
Outliers: 3 products > ₨ 100,000
Anomalies: 2 products with negative margins
Action: Review outliers and fix anomalies
```

### Expected Outcome

Comprehensive price comparison utilities for analysis, anomaly detection, and business intelligence reporting.

### Verification Checklist

- [ ] `calculate_price_difference()` returns full analysis
- [ ] `is_price_higher()` compares two prices
- [ ] `is_significant_change()` checks threshold
- [ ] `get_price_trend()` analyzes price history
- [ ] `compare_product_prices()` compares products
- [ ] `get_price_statistics()` calculates category stats
- [ ] `find_pricing_anomalies()` detects errors
- [ ] `calculate_optimal_price()` suggests price
- [ ] `suggest_price_tiers()` generates tier structure
- [ ] All functions handle edge cases and None values

---

## Task 18: Create ProductPrice Admin

### Overview
Configure Django admin interface for managing ProductPrice, VariantPrice, and PriceHistory models with custom views, filters, actions, and permissions for efficient pricing management.

### Dependencies
- All previous Group A tasks complete
- Django admin framework available

### Instructions

1. **Open `admin.py` file**
   - File in `backend/apps/products/pricing/`

2. **Import required modules**
   - Import `admin` from `django.contrib`
   - Import all pricing models
   - Import formatting utilities
   - Import `format_html` from `django.utils.html`

3. **Create ProductPriceAdmin class**
   - Inherit from `admin.ModelAdmin`
   - Register with `@admin.register(ProductPrice)` decorator

4. **Configure list display**
   - Set `list_display` tuple:
     - product (linked)
     - formatted_base_price
     - formatted_sale_price
     - is_on_sale_badge
     - profit_margin_display
     - is_taxable
     - last_cost_update

5. **Configure list filters**
   - Set `list_filter` tuple:
     - is_taxable
     - is_tax_inclusive
     - Custom filter for is_on_sale
     - tax_class
     - created_at (date hierarchy)

6. **Configure search fields**
   - Set `search_fields`:
     - product__name
     - product__sku
     - pricing_notes

7. **Configure readonly fields**
   - Set `readonly_fields` for calculated fields:
     - profit_margin_display
     - profit_amount_display
     - discount_percentage_display
     - created_at, updated_at

8. **Add custom display methods**
   - Create `formatted_base_price` method
   - Create `formatted_sale_price` method
   - Create `is_on_sale_badge` method (colored badge)
   - Create `profit_margin_display` method (colored by range)
   - Mark methods with `short_description` attribute

9. **Configure fieldsets**
   - Group related fields:
     - Basic Info (product)
     - Base Pricing (base_price, cost_price)
     - Sale Pricing (sale_price, dates)
     - Wholesale Pricing (wholesale_price, min_qty)
     - Tax Configuration (tax_class, is_taxable, etc.)
     - Calculated Fields (readonly)
     - Metadata (notes, timestamps)

10. **Add custom actions**
    - Create `activate_sale` action
    - Create `deactivate_sale` action
    - Create `apply_margin_increase` action (with percentage input)
    - Create `export_pricing_report` action

11. **Add permissions checks**
    - Override `has_add_permission`
    - Override `has_change_permission`
    - Check for `manage_pricing` permission
    - Restrict cost_price view with `view_cost_price` permission

12. **Create VariantPriceInline**
    - Inherit from `admin.TabularInline`
    - Set `model = VariantPrice`
    - Display in ProductPrice admin
    - Show variant pricing alongside product pricing

13. **Create PriceHistoryAdmin class**
    - Register with `@admin.register(PriceHistory)`
    - Set as readonly (history shouldn't be edited)
    - Display all history fields
    - Link to product and variant
    - Color-code by price_type

14. **Add custom admin views**
    - Create pricing dashboard view
    - Show pricing statistics
    - Display anomalies
    - Link from admin index

### Admin Configuration

| Setting | Value | Purpose |
|---------|-------|---------|
| `list_display` | 7 fields | Quick overview |
| `list_filter` | 5 filters | Easy filtering |
| `search_fields` | 3 fields | Search capability |
| `readonly_fields` | Calculated fields | Prevent manual edit |
| `fieldsets` | 7 groups | Organized form |
| `actions` | 4 custom | Bulk operations |

### List Display Columns

| Column | Content | Format |
|--------|---------|--------|
| Product | Product name (link) | Text link |
| Base Price | Formatted price | ₨ 1,250.00 |
| Sale Price | Formatted sale price | ₨ 999.00 |
| On Sale | Badge | 🔴 Active / ⚪ Inactive |
| Profit Margin | Percentage (colored) | 30% (green if >20%) |
| Taxable | Boolean icon | ✓ / ✗ |
| Last Update | Date | 2026-01-22 |

### Custom Display Methods

**Formatted Price:**
```python
@admin.display(description='Base Price')
def formatted_base_price(self, obj):
    return format_lkr_html(obj.base_price)
```

**On Sale Badge:**
```python
@admin.display(description='On Sale', boolean=True)
def is_on_sale_badge(self, obj):
    if obj.is_on_sale:
        return format_html(
            '<span style="color: green;">●</span> Active'
        )
    return format_html(
        '<span style="color: gray;">○</span> Inactive'
    )
```

**Profit Margin (Colored):**
```python
@admin.display(description='Profit Margin')
def profit_margin_display(self, obj):
    margin = obj.profit_margin
    if margin is None:
        return '-'
    
    color = 'green' if margin > 20 else 'orange' if margin > 10 else 'red'
    return format_html(
        '<span style="color: {};">{:.2f}%</span>',
        color, margin
    )
```

### Fieldsets Organization

```python
fieldsets = (
    ('Product Information', {
        'fields': ('product',)
    }),
    ('Base Pricing', {
        'fields': ('base_price', 'cost_price', 'last_cost_update')
    }),
    ('Sale Pricing', {
        'fields': ('sale_price', 'sale_price_start', 'sale_price_end'),
        'classes': ('collapse',)
    }),
    ('Wholesale Pricing', {
        'fields': ('wholesale_price', 'minimum_wholesale_quantity'),
        'classes': ('collapse',)
    }),
    ('Tax Configuration', {
        'fields': ('tax_class', 'is_taxable', 'is_tax_inclusive', 'tax_exemption_reason')
    }),
    ('Calculated Fields (Read-only)', {
        'fields': ('profit_margin_display', 'profit_amount_display', 'discount_percentage_display'),
        'classes': ('collapse',)
    }),
    ('Additional Information', {
        'fields': ('pricing_notes', 'created_at', 'updated_at', 'is_active'),
        'classes': ('collapse',)
    })
)
```

### Custom Actions

**Activate Sale Action:**
```python
@admin.action(description='Activate selected sales')
def activate_sale(self, request, queryset):
    for price in queryset:
        if price.sale_price:
            price.sale_price_start = timezone.now()
            price.save()
    self.message_user(request, f'Activated {queryset.count()} sales')
```

**Apply Margin Action:**
```python
@admin.action(description='Apply 10% margin increase')
def apply_margin_increase(self, request, queryset):
    for price in queryset:
        price.base_price = price.base_price * Decimal('1.10')
        price.save()
    self.message_user(request, f'Updated {queryset.count()} prices')
```

### Permission Checks

```python
def has_change_permission(self, request, obj=None):
    return request.user.has_perm('pricing.manage_pricing')

def get_readonly_fields(self, request, obj=None):
    readonly = list(super().get_readonly_fields(request, obj))
    if not request.user.has_perm('pricing.view_cost_price'):
        readonly.append('cost_price')
    return readonly
```

### Price History Display

```python
@admin.register(PriceHistory)
class PriceHistoryAdmin(admin.ModelAdmin):
    list_display = [
        'product',
        'price_type_badge',
        'old_value_display',
        'new_value_display',
        'change_display',
        'changed_by',
        'created_at'
    ]
    list_filter = ['price_type', 'automated_change', 'change_source']
    search_fields = ['product__name', 'change_reason']
    readonly_fields = [...]  # All fields
    
    def has_add_permission(self, request):
        return False  # History is auto-generated
    
    def has_delete_permission(self, request, obj=None):
        return False  # Preserve audit trail
```

### Expected Outcome

Fully configured Django admin interface for pricing management with custom displays, filters, actions, and permission controls.

### Verification Checklist

- [ ] `ProductPriceAdmin` class registered
- [ ] `list_display` with 7+ formatted fields
- [ ] `list_filter` with relevant filters
- [ ] `search_fields` for product search
- [ ] Custom display methods with formatting
- [ ] Fieldsets organized logically
- [ ] Custom admin actions (activate sale, apply margin)
- [ ] Permission checks implemented
- [ ] Cost price visibility restricted
- [ ] `PriceHistoryAdmin` registered as readonly
- [ ] Colored badges for status indicators
- [ ] Links to related objects functional

---

## Summary

### Tasks Completed in This Document

| Task # | Task Name | Key Deliverable |
|--------|-----------|-----------------|
| 15 | Add PriceHistory signals | Automatic history tracking |
| 16 | Create currency formatting utility | LKR formatting functions |
| 17 | Add price comparison methods | Comparison and analysis utilities |
| 18 | Create ProductPrice admin | Django admin configuration |

### Group A Complete Deliverables

```
backend/apps/products/pricing/
├── __init__.py
├── apps.py
├── admin.py (ProductPrice, VariantPrice, PriceHistory admins)
├── constants.py (LKR constants)
├── fields.py (PriceField)
├── signals.py (Automatic history tracking)
├── utils.py (Formatting, comparison utilities)
├── middleware.py (CurrentUserMiddleware)
├── models/
│   ├── __init__.py
│   ├── product_price.py (Complete with all fields, methods)
│   ├── variant_price.py (With inheritance logic)
│   └── price_history.py (Audit trail)
├── managers/
│   ├── __init__.py
│   └── price_manager.py (Custom query methods)
└── tests/
    └── __init__.py
```

### Key Achievements - Group A

- ✅ Complete pricing app structure
- ✅ LKR currency support with proper formatting
- ✅ ProductPrice model with base, sale, wholesale, cost prices
- ✅ VariantPrice model with inheritance and overrides
- ✅ PriceHistory model for complete audit trail
- ✅ Automatic history tracking via Django signals
- ✅ Custom model manager with query optimizations
- ✅ Profit margin and discount calculations
- ✅ Comprehensive validation and business rules
- ✅ Currency formatting utilities
- ✅ Price comparison and analysis tools
- ✅ Django admin with custom views and actions
- ✅ Permission-based access control
- ✅ Multi-tenant isolation maintained throughout

### Next Group

Proceed to [../Group-B_Tax-Integration-Calculation/](../Group-B_Tax-Integration-Calculation/) to implement:
- TaxCalculator service for VAT/SVAT calculations
- Tax-inclusive/exclusive conversions
- SVAT exemption for B2B customers
- Compound tax handling (VAT + NBT)
- Tax calculation caching
- Tax audit logging

---

## Notes for AI Agents

1. **Signals:** Register in apps.py ready() method
2. **Middleware:** Add to MIDDLEWARE setting for user tracking
3. **Formatting:** Always use format_lkr() for display
4. **Admin:** Restrict cost_price view with custom permission
5. **History:** Never allow manual editing of PriceHistory
6. **Badges:** Use format_html() for colored admin displays
7. **Actions:** Bulk actions should use QuerySet.update() when possible
8. **Permissions:** Check manage_pricing for price changes
9. **Thread-Local:** Clean up after request to prevent leaks
10. **Group A Complete:** All 18 tasks finished, ready for Group B
