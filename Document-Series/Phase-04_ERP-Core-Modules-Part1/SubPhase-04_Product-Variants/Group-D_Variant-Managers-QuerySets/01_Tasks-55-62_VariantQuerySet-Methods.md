# Tasks 55-62: VariantQuerySet Methods

> **Phase:** 04 - ERP Core Modules Part 1  
> **SubPhase:** 04 - Product Variants  
> **Group:** D - Variant Managers & QuerySets  
> **Document:** 01 of 02  
> **Tasks Covered:** 55, 56, 57, 58, 59, 60, 61, 62

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **→ Next Document:** [02_Tasks-63-66_VariantManager-Assignment.md](02_Tasks-63-66_VariantManager-Assignment.md)

---

## Document Overview

This document covers creating a custom QuerySet for ProductVariant with chainable filter methods for common queries.

### Tasks in This Document
| Task # | Task Name | Complexity |
|--------|-----------|------------|
| 55 | Create variant_managers.py | Low |
| 56 | Create VariantQuerySet | Medium |
| 57 | Add active Method | Low |
| 58 | Add in_stock Method | Medium |
| 59 | Add for_product Method | Low |
| 60 | Add by_option Method | Medium |
| 61 | Add with_prices Method | Medium |
| 62 | Add with_stock Method | Medium |

---

## Business Context

### Why Custom QuerySets?

Custom QuerySets provide:
- **Chainable filters:** `variants.active().in_stock().for_product(product_id)`
- **Reusable logic:** Common queries in one place
- **Performance optimization:** Prefetch related data
- **Cleaner code:** Less repetition

**Example Usage:**
```python
# Without custom QuerySet (verbose)
variants = ProductVariant.objects.filter(
    tenant=tenant,
    is_active=True,
    product=product
).select_related('product').prefetch_related('option_values')

# With custom QuerySet (clean)
variants = ProductVariant.objects.active().for_product(product).with_prices()
```

---

## Task 55: Create variant_managers.py

### Overview
Create file for variant custom managers and querysets.

### Dependencies
- ProductVariant model exists

### Instructions

1. **Create variant_managers.py file**
   - Location: `backend/apps/products/models/variant_managers.py`

2. **Add imports**
   - Django QuerySet, Manager
   - Q objects for complex queries
   - Prefetch, select_related

3. **Add module docstring**

### File Structure
```
backend/apps/products/models/
├── __init__.py
├── product.py
├── variant_option.py
├── product_variant.py
└── variant_managers.py  # NEW
```

### Verification Checklist
- [ ] variant_managers.py file created
- [ ] Required imports added
- [ ] Module docstring present

---

## Task 56: Create VariantQuerySet

### Overview
Create custom QuerySet class with chainable filter methods.

### Dependencies
- Task 55: variant_managers.py exists

### Instructions

1. **Define VariantQuerySet class**
   - Inherit from models.QuerySet
   - Add class docstring

2. **Prepare for method additions**
   - Methods added in subsequent tasks

### QuerySet Purpose

VariantQuerySet provides:
- Tenant-aware filtering
- Product filtering
- Stock filtering
- Option filtering
- Prefetch optimization

### Verification Checklist
- [ ] VariantQuerySet class defined
- [ ] Inherits from models.QuerySet
- [ ] Docstring added

---

## Task 57: Add active Method

### Overview
Add method to filter only active variants.

### Dependencies
- Task 56: VariantQuerySet defined

### Instructions

1. **Add active method**
   - Filters is_active=True
   - Returns filtered QuerySet
   - Chainable

### Method Implementation

```python
def active(self):
    """Return only active variants."""
    return self.filter(is_active=True)
```

### Usage Examples

```python
# Get all active variants
active_variants = ProductVariant.objects.active()

# Chain with other filters
variants = ProductVariant.objects.active().for_product(product_id)
```

### Verification Checklist
- [ ] active method added
- [ ] Filters is_active=True
- [ ] Returns QuerySet (chainable)
- [ ] Docstring added

---

## Task 58: Add in_stock Method

### Overview
Add method to filter variants that have available stock.

### Dependencies
- Task 56: VariantQuerySet defined
- VariantStock model exists (future)

### Instructions

1. **Add in_stock method**
   - Filters variants with stock > 0
   - Joins with VariantStock model
   - Returns filtered QuerySet

2. **Handle missing stock records**
   - Variants with no stock record = out of stock
   - Use LEFT JOIN with filter

### Method Implementation

```python
def in_stock(self):
    """Return variants with available stock."""
    return self.annotate(
        stock_qty=Sum('stock__quantity')
    ).filter(stock_qty__gt=0)
```

### Usage Examples

```python
# Active variants with stock
variants = ProductVariant.objects.active().in_stock()

# Product variants in stock
variants = ProductVariant.objects.for_product(product_id).in_stock()
```

### Verification Checklist
- [ ] in_stock method added
- [ ] Annotates stock quantity
- [ ] Filters quantity > 0
- [ ] Handles no stock records

---

## Task 59: Add for_product Method

### Overview
Add method to filter variants for a specific product.

### Dependencies
- Task 56: VariantQuerySet defined

### Instructions

1. **Add for_product method**
   - Accepts product_id parameter
   - Filters by product
   - Returns filtered QuerySet

### Method Implementation

```python
def for_product(self, product_id):
    """Return variants for specific product."""
    return self.filter(product_id=product_id)
```

### Usage Examples

```python
# Get all variants for product
variants = ProductVariant.objects.for_product(product.id)

# Active variants for product
variants = ProductVariant.objects.active().for_product(product.id)

# In-stock variants for product
variants = ProductVariant.objects.for_product(product.id).in_stock()
```

### Verification Checklist
- [ ] for_product method added
- [ ] Accepts product_id parameter
- [ ] Filters correctly
- [ ] Chainable with other methods

---

## Task 60: Add by_option Method

### Overview
Add method to filter variants by specific option value.

### Dependencies
- Task 56: VariantQuerySet defined

### Instructions

1. **Add by_option method**
   - Accepts option_value parameter
   - Filters through ProductVariantOption
   - Returns filtered QuerySet

2. **Support multiple options**
   - Accept single value or list
   - AND logic for multiple options

### Method Implementation

```python
def by_option(self, option_value):
    """
    Return variants with specific option value.
    Can accept single value or list for AND filtering.
    """
    if isinstance(option_value, list):
        qs = self
        for val in option_value:
            qs = qs.filter(option_values=val)
        return qs
    return self.filter(option_values=option_value)
```

### Usage Examples

```python
# Find all Medium variants
medium = VariantOptionValue.objects.get(value='m')
variants = ProductVariant.objects.by_option(medium)

# Find Medium AND Red variants
red = VariantOptionValue.objects.get(value='red')
variants = ProductVariant.objects.by_option([medium, red])

# Active, in-stock, specific option
variants = (ProductVariant.objects
    .active()
    .in_stock()
    .by_option(medium))
```

### Business Use Cases

**Use Case 1: Filter by Size**
```
Customer selects: Size = Medium
Query: Show all Medium variants
Result: All products with Medium option
```

**Use Case 2: Filter by Multiple Options**
```
Customer selects: Size = Medium, Color = Red
Query: Show exact match
Result: Only Medium + Red variants
```

### Verification Checklist
- [ ] by_option method added
- [ ] Accepts single or list of values
- [ ] AND logic for multiple options
- [ ] Chainable

---

## Task 61: Add with_prices Method

### Overview
Add method to prefetch price-related data for performance.

### Dependencies
- Task 56: VariantQuerySet defined
- VariantPrice model exists (future)

### Instructions

1. **Add with_prices method**
   - Prefetches variant prices
   - Includes price tiers
   - Optimizes N+1 queries

### Method Implementation

```python
def with_prices(self):
    """Prefetch price data to optimize queries."""
    return self.prefetch_related(
        'prices',
        'prices__price_tier'
    )
```

### Usage Examples

```python
# Get variants with prices in single query
variants = ProductVariant.objects.active().with_prices()

for variant in variants:
    price = variant.prices.first()  # No additional query
    print(f"{variant.name}: LKR {price.amount}")
```

### Performance Impact

**Without prefetch:**
```
1 query: Get 100 variants
100 queries: Get price for each variant (N+1 problem)
Total: 101 queries
```

**With prefetch:**
```
1 query: Get 100 variants
1 query: Get all variant prices
Total: 2 queries
```

### Verification Checklist
- [ ] with_prices method added
- [ ] Prefetches variant prices
- [ ] Optimizes N+1 queries
- [ ] Chainable

---

## Task 62: Add with_stock Method

### Overview
Add method to prefetch stock-related data for performance.

### Dependencies
- Task 56: VariantQuerySet defined
- VariantStock model exists (future)

### Instructions

1. **Add with_stock method**
   - Prefetches stock records
   - Includes warehouse data
   - Optimizes queries

### Method Implementation

```python
def with_stock(self):
    """Prefetch stock data to optimize queries."""
    return self.prefetch_related(
        'stock',
        'stock__warehouse'
    ).annotate(
        total_stock=Sum('stock__quantity')
    )
```

### Usage Examples

```python
# Get variants with stock data
variants = ProductVariant.objects.active().with_stock()

for variant in variants:
    print(f"{variant.name}: {variant.total_stock} in stock")
    for stock in variant.stock.all():  # No additional query
        print(f"  - {stock.warehouse.name}: {stock.quantity}")
```

### Performance Benefits

**Product Listing with Stock:**
```python
# Efficient: 3 queries total
variants = (ProductVariant.objects
    .active()
    .for_product(product_id)
    .with_stock()
    .with_prices())

# Inefficient: 1 + (N × 2) queries
variants = ProductVariant.objects.filter(product_id=product_id)
for v in variants:
    stock = v.stock.all()  # N queries
    prices = v.prices.all()  # N queries
```

### Verification Checklist
- [ ] with_stock method added
- [ ] Prefetches stock records
- [ ] Annotates total stock
- [ ] Optimizes queries
- [ ] Chainable

---

## Summary

### Tasks Completed in This Document
| Task # | Task Name | Key Deliverable |
|--------|-----------|-----------------|
| 55 | Create variant_managers.py | File created |
| 56 | Create VariantQuerySet | Base QuerySet class |
| 57 | Add active Method | Active filter |
| 58 | Add in_stock Method | Stock filter |
| 59 | Add for_product Method | Product filter |
| 60 | Add by_option Method | Option filter |
| 61 | Add with_prices Method | Price prefetch |
| 62 | Add with_stock Method | Stock prefetch |

### VariantQuerySet Complete

The QuerySet now provides:
- **Filters:** active, in_stock, for_product, by_option
- **Optimization:** with_prices, with_stock
- **Chainability:** All methods return QuerySet
- **Performance:** Reduced N+1 queries

### Usage Patterns

**Pattern 1: Product Page Variants**
```python
variants = (ProductVariant.objects
    .active()
    .for_product(product_id)
    .with_prices()
    .with_stock())
```

**Pattern 2: Search by Options**
```python
variants = (ProductVariant.objects
    .active()
    .in_stock()
    .by_option([size_medium, color_red]))
```

**Pattern 3: Admin Listing**
```python
variants = (ProductVariant.objects
    .for_product(product_id)
    .with_stock()
    .with_prices())
```

### Next Steps
1. Proceed to [02_Tasks-63-66_VariantManager-Assignment.md](02_Tasks-63-66_VariantManager-Assignment.md) for VariantManager

---

## Notes for AI Agents

1. **Chainability:** All methods return QuerySet for chaining
2. **Prefetch:** Use with_prices/with_stock for listings
3. **Tenant Filtering:** Handled by TenantAwareModel automatically
4. **N+1 Prevention:** Always prefetch related data in list views
5. **Type Hints:** Add type hints for better IDE support
6. **Docstrings:** Document each method with examples
7. **Testing:** Test each method and method combinations
8. **Performance:** Measure query count in tests
