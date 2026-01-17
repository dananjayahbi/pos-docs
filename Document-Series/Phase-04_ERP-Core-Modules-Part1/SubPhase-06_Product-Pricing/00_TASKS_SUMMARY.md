# SubPhase-06: Product Pricing - Tasks Summary

> **Phase:** 04 - ERP Core Modules Part 1  
> **SubPhase:** 06 of 10  
> **SubPhase Goal:** Implement comprehensive pricing system with LKR currency support  
> **Total Tasks:** 88 | **Status:** Planning

---

## Navigation

- **↑ Parent:** [Phase-04 Summary](../00_SUBPHASES_SUMMARY.md)
- **← Previous SubPhase:** [SubPhase-05: Bundle & Composite Products](../SubPhase-05_Bundle-Composite-Products/)
- **→ Next SubPhase:** [SubPhase-07: Product Media](../SubPhase-07_Product-Media/)

---

## SubPhase Overview

This sub-phase implements the complete pricing architecture for the LankaCommerce Cloud platform. The pricing system supports multiple price types (base, sale, cost, wholesale), tiered/quantity-based pricing, and Sri Lanka-specific tax handling including VAT and SVAT. All prices are stored and displayed in LKR (Sri Lankan Rupees).

### Key Outcomes
- ProductPrice model with base, sale, cost, and wholesale prices
- Tax-inclusive and tax-exclusive price handling
- TieredPricing model for quantity-based discounts
- ScheduledPricing for time-based promotions
- Price calculation services with proper tax integration
- API endpoints for price management and retrieval

### Dependencies
- SubPhase-03: Product Base Model (Product FK)
- SubPhase-04: Product Variants (Variant-level pricing)
- Phase-03: Tax configuration and TaxClass model

---

## Execution Flow Diagram

```
[Group A: Price Type Models]
         │
         ▼
[Group B: Tax Integration & Calculation]
         │
         ▼
[Group C: Tiered & Volume Pricing]
         │
         ▼
[Group D: Scheduled & Promotional Pricing]
         │
         ▼
[Group E: Price Serializers & API Views]
         │
         ▼
[Group F: Testing & Documentation]
```

---

## Task Index

### Group A: Price Type Models (Tasks 01-18)

Core pricing models defining base, sale, cost, and wholesale prices.

| Task # | Task Name | Description | Est. Time |
|--------|-----------|-------------|-----------|
| 01 | Create pricing app structure | Initialize `apps/products/pricing/` module with __init__, apps.py configuration | 15 min |
| 02 | Define currency constants | Create constants for LKR formatting, decimal places (2), thousand separators | 10 min |
| 03 | Create PriceField custom field | Build DecimalField subclass with LKR-specific validation (max 12 digits, 2 decimal) | 25 min |
| 04 | Create ProductPrice model | Define model with product FK, base_price, cost_price fields | 30 min |
| 05 | Add sale price fields | Add sale_price, sale_price_start, sale_price_end to ProductPrice | 20 min |
| 06 | Add wholesale price field | Add wholesale_price and wholesale_min_quantity fields | 15 min |
| 07 | Add tax handling fields | Add is_tax_inclusive boolean and tax_class FK | 20 min |
| 08 | Create ProductPrice Meta class | Define db_table, indexes on product, ordering by product | 15 min |
| 09 | Add ProductPrice model manager | Create manager with get_active_price(), get_effective_price() methods | 25 min |
| 10 | Create VariantPrice model | Define variant-level pricing with variant FK, overrides product price | 30 min |
| 11 | Add VariantPrice override logic | Add use_product_price boolean for price inheritance | 15 min |
| 12 | Create price validation methods | Add clean() method to validate sale_price < base_price, cost_price < base_price | 25 min |
| 13 | Add profit margin calculation | Create property to calculate margin: (base_price - cost_price) / base_price | 20 min |
| 14 | Create price history model | Define PriceHistory model to track all price changes with timestamps | 30 min |
| 15 | Add PriceHistory signals | Create post_save signal to log price changes automatically | 25 min |
| 16 | Create currency formatting utility | Build format_lkr() function for display (e.g., "LKR 1,250.00") | 15 min |
| 17 | Add price comparison methods | Create is_on_sale(), get_discount_percentage() methods | 20 min |
| 18 | Create ProductPrice admin | Register admin with list display, filters, search by product name | 20 min |

---

### Group B: Tax Integration & Calculation (Tasks 19-34)

Tax-inclusive/exclusive calculations with Sri Lanka VAT/SVAT support.

| Task # | Task Name | Description | Est. Time |
|--------|-----------|-------------|-----------|
| 19 | Review TaxClass model | Verify TaxClass from Phase-03 with rate field for VAT (12%), SVAT, zero-rated | 15 min |
| 20 | Create TaxCalculator service | Build service class with calculate_tax(), apply_tax(), remove_tax() methods | 35 min |
| 21 | Implement tax-inclusive to exclusive | Create method to extract base price from tax-inclusive price | 25 min |
| 22 | Implement tax-exclusive to inclusive | Create method to add tax to base price for display | 20 min |
| 23 | Handle compound tax scenarios | Add logic for multiple tax types (VAT + NBT if applicable) | 30 min |
| 24 | Create get_price_with_tax method | Add method on ProductPrice to return final customer-facing price | 20 min |
| 25 | Create get_price_without_tax method | Add method to return base price before tax | 15 min |
| 26 | Add tax exemption handling | Handle products with no tax (tax_class = None or zero-rated) | 20 min |
| 27 | Create price rounding utility | Implement LKR rounding rules (round to nearest 0.01) | 15 min |
| 28 | Add SVAT special handling | Handle SVAT-registered customer exemptions (B2B sales) | 25 min |
| 29 | Create tax breakdown method | Return dict with {base_price, tax_amount, tax_rate, total_price} | 20 min |
| 30 | Add tax calculation caching | Cache tax calculations for frequently accessed products | 25 min |
| 31 | Create PriceCalculationService | Unified service combining price type + tax + discounts | 35 min |
| 32 | Add price calculation for variants | Extend service to handle variant-level pricing with fallback | 25 min |
| 33 | Create tax audit logging | Log all tax calculations for compliance and debugging | 20 min |
| 34 | Write tax calculation unit tests | Test all tax scenarios: inclusive, exclusive, exempt, SVAT | 30 min |

---

### Group C: Tiered & Volume Pricing (Tasks 35-52)

Quantity-based discounts and bulk pricing for wholesale customers.

| Task # | Task Name | Description | Est. Time |
|--------|-----------|-------------|-----------|
| 35 | Create TieredPricing model | Define model with product FK, min_quantity, max_quantity, tier_price | 30 min |
| 36 | Add tier validation | Ensure quantity ranges don't overlap, min < max, tier_price < base_price | 25 min |
| 37 | Create TieredPricing Meta class | Define ordering by min_quantity, unique_together for product + range | 15 min |
| 38 | Add tier lookup method | Create get_tier_for_quantity(product, qty) to find applicable tier | 25 min |
| 39 | Create tiered price calculation | Return price per unit based on quantity tier | 20 min |
| 40 | Add tier display helper | Format tiers for display: "Buy 10+: LKR 90/unit" | 15 min |
| 41 | Create VariantTieredPricing model | Variant-specific tiered pricing with variant FK | 25 min |
| 42 | Add tier inheritance logic | Variant uses product tiers if no variant-specific tiers defined | 20 min |
| 43 | Create bulk pricing service | BulkPricingService to calculate total for mixed quantities | 30 min |
| 44 | Add incremental tier calculation | Option for incremental tiers (first 10 at price A, next 10 at price B) | 30 min |
| 45 | Create all-units tier calculation | Option where entire order uses single tier price | 20 min |
| 46 | Add tier type field | Add tier_type enum: INCREMENTAL, ALL_UNITS to TieredPricing | 15 min |
| 47 | Create tiered pricing admin | Register admin with inline for tiers, validation in admin form | 25 min |
| 48 | Add tier copy functionality | Copy tiers from product to variant or between products | 20 min |
| 49 | Create CartPriceCalculator | Service to calculate cart total with tiered pricing applied | 35 min |
| 50 | Add tier threshold display | Show "Add X more for tier discount" in cart | 20 min |
| 51 | Create tiered pricing report | Generate report of products with tiered pricing configuration | 25 min |
| 52 | Write tiered pricing tests | Test tier lookup, calculation, edge cases (exact boundaries) | 30 min |

---

### Group D: Scheduled & Promotional Pricing (Tasks 53-68)

Time-based sales, flash sales, and promotional pricing rules.

| Task # | Task Name | Description | Est. Time |
|--------|-----------|-------------|-----------|
| 53 | Create ScheduledPrice model | Define model with product FK, scheduled_price, start_datetime, end_datetime | 30 min |
| 54 | Add schedule validation | Ensure start < end, no overlapping schedules for same product | 25 min |
| 55 | Add schedule status field | Add status: PENDING, ACTIVE, EXPIRED for quick filtering | 15 min |
| 56 | Create schedule activation task | Celery task to activate/deactivate scheduled prices at timestamps | 30 min |
| 57 | Add schedule priority field | Priority for when multiple schedules overlap (higher wins) | 20 min |
| 58 | Create FlashSale model | Define model for limited-time sales with max_quantity | 25 min |
| 59 | Add flash sale quantity tracking | Track units_sold against max_quantity, auto-end when reached | 25 min |
| 60 | Create promotional pricing rules | Define rules: PERCENTAGE_OFF, FIXED_AMOUNT_OFF, FIXED_PRICE | 30 min |
| 61 | Add promotional condition logic | Conditions: min_quantity, specific_category, customer_group | 30 min |
| 62 | Create get_effective_price service | Service to determine current price considering all rules | 35 min |
| 63 | Add price priority resolution | Priority order: Flash Sale > Scheduled > Sale Price > Base Price | 25 min |
| 64 | Create schedule expiry cleanup | Celery task to mark expired schedules and update product cache | 25 min |
| 65 | Add promotion analytics | Track views, conversions, revenue for promotional prices | 30 min |
| 66 | Create promotional calendar view | API endpoint returning upcoming and active promotions | 25 min |
| 67 | Add schedule bulk operations | Bulk activate/deactivate/extend scheduled prices | 25 min |
| 68 | Write scheduled pricing tests | Test activation, expiry, overlap resolution, flash sale limits | 30 min |

---

### Group E: Price Serializers & API Views (Tasks 69-80)

DRF serializers and viewsets for price management.

| Task # | Task Name | Description | Est. Time |
|--------|-----------|-------------|-----------|
| 69 | Create ProductPriceSerializer | Serializer with all price fields, formatted LKR output | 25 min |
| 70 | Add price calculation fields | SerializerMethodField for effective_price, discount_percentage | 20 min |
| 71 | Create VariantPriceSerializer | Serializer handling variant price with inheritance logic | 25 min |
| 72 | Create TieredPricingSerializer | Serializer for tier configuration with validation | 20 min |
| 73 | Create ScheduledPriceSerializer | Serializer with datetime handling for schedules | 20 min |
| 74 | Create PriceBreakdownSerializer | Read-only serializer returning complete price breakdown | 25 min |
| 75 | Create ProductPriceViewSet | ModelViewSet with CRUD for product prices, tenant filtering | 30 min |
| 76 | Add price update permissions | Ensure only users with 'manage_pricing' permission can update | 20 min |
| 77 | Create TieredPricingViewSet | ViewSet for managing product tiers with validation | 25 min |
| 78 | Create ScheduledPriceViewSet | ViewSet for schedule management with activation endpoints | 25 min |
| 79 | Add price lookup endpoint | GET /products/{id}/price/ returning effective price with breakdown | 25 min |
| 80 | Create bulk price update endpoint | POST /products/prices/bulk-update/ for mass price changes | 30 min |

---

### Group F: Testing & Documentation (Tasks 81-88)

Comprehensive testing and documentation for pricing system.

| Task # | Task Name | Description | Est. Time |
|--------|-----------|-------------|-----------|
| 81 | Create ProductPrice model tests | Test model creation, validation, property calculations | 30 min |
| 82 | Create tax calculation tests | Test all tax scenarios with known inputs/outputs | 30 min |
| 83 | Create tiered pricing tests | Test tier lookup, incremental vs all-units, edge cases | 30 min |
| 84 | Create scheduled pricing tests | Test activation, overlap, expiry, flash sale limits | 30 min |
| 85 | Create API endpoint tests | Test all ViewSet actions with authentication | 35 min |
| 86 | Create price calculation integration tests | End-to-end tests for complete price resolution flow | 35 min |
| 87 | Write pricing module documentation | Document all models, services, and API endpoints | 40 min |
| 88 | Create pricing configuration guide | User guide for setting up tiered, scheduled, promotional pricing | 30 min |

---

## Expected File Structure

```
apps/products/pricing/
├── __init__.py
├── apps.py
├── models/
│   ├── __init__.py
│   ├── product_price.py          # Tasks 04-18
│   ├── variant_price.py          # Tasks 10-11
│   ├── price_history.py          # Tasks 14-15
│   ├── tiered_pricing.py         # Tasks 35-48
│   └── scheduled_price.py        # Tasks 53-58
├── services/
│   ├── __init__.py
│   ├── tax_calculator.py         # Tasks 20-28
│   ├── price_calculation.py      # Tasks 31-32
│   ├── bulk_pricing.py           # Tasks 43-50
│   └── effective_price.py        # Tasks 62-63
├── serializers/
│   ├── __init__.py
│   ├── product_price.py          # Tasks 69-70
│   ├── variant_price.py          # Task 71
│   ├── tiered_pricing.py         # Task 72
│   └── scheduled_price.py        # Task 73
├── views/
│   ├── __init__.py
│   ├── product_price.py          # Tasks 75-76
│   ├── tiered_pricing.py         # Task 77
│   └── scheduled_price.py        # Task 78
├── tasks/
│   ├── __init__.py
│   ├── schedule_activation.py    # Task 56
│   └── schedule_cleanup.py       # Task 64
├── admin.py                      # Tasks 18, 47
├── urls.py
├── constants.py                  # Task 02
├── fields.py                     # Task 03
└── utils.py                      # Tasks 16, 27
```

---

## Progress Tracking

| Group | Description | Tasks | Completed | Status |
|-------|-------------|-------|-----------|--------|
| A | Price Type Models | 18 | 0 | 🔴 Not Started |
| B | Tax Integration & Calculation | 16 | 0 | 🔴 Not Started |
| C | Tiered & Volume Pricing | 18 | 0 | 🔴 Not Started |
| D | Scheduled & Promotional Pricing | 16 | 0 | 🔴 Not Started |
| E | Price Serializers & API Views | 12 | 0 | 🔴 Not Started |
| F | Testing & Documentation | 8 | 0 | 🔴 Not Started |
| **Total** | | **88** | **0** | 🔴 |

---

## Notes for AI Agents

### Price Resolution Order
When determining effective price, follow this priority:
1. **Flash Sale** (if active and quantity remaining)
2. **Scheduled Price** (if within date range, highest priority)
3. **Sale Price** (if sale_price_start ≤ now ≤ sale_price_end)
4. **Tiered Price** (if quantity meets tier threshold)
5. **Wholesale Price** (if customer is wholesale and qty ≥ wholesale_min_quantity)
6. **Base Price** (default fallback)

### LKR Currency Rules
- Always store as Decimal with 2 decimal places
- Display format: "LKR 1,250.00" (space after LKR)
- Thousand separator: comma (,)
- Decimal separator: period (.)
- Max value: 999,999,999.99 (12 digits total)

### Tax Calculation Flow
```
If is_tax_inclusive:
    base_price_excl_tax = stored_price / (1 + tax_rate)
    tax_amount = stored_price - base_price_excl_tax
    display_price = stored_price
Else:
    base_price_excl_tax = stored_price
    tax_amount = stored_price * tax_rate
    display_price = stored_price + tax_amount
```

### Sri Lanka Tax Rates (Reference)
- **VAT:** 12% (standard rate, effective 2025)
- **SVAT:** 0% for registered B2B customers
- **Zero-rated:** Exports, essential goods
- **Exempt:** Certain services, agricultural products

### Variant Price Inheritance
```python
def get_variant_effective_price(variant):
    if variant.variant_price and not variant.variant_price.use_product_price:
        return variant.variant_price
    return variant.product.product_price
```

### Key Validations
- sale_price must be < base_price
- cost_price should be < base_price (warning, not error)
- tiered price must be < base_price for same product
- scheduled dates must not overlap for same product
- wholesale_min_quantity must be > 1

---

## Changelog

| Date | Author | Changes |
|------|--------|---------|
| TBD | AI Agent | Initial task summary creation |
