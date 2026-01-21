# Group C: Tiered & Volume Pricing

> **Phase:** 04 - ERP Core Modules Part 1  
> **SubPhase:** 06 - Product Pricing  
> **Group:** C of F  
> **Tasks Covered:** 35-52  
> **Group Goal:** Implement quantity-based discounts and bulk pricing for wholesale customers

---

## Navigation

- **↑ Parent:** [00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [Group-B_Tax-Integration-Calculation](../Group-B_Tax-Integration-Calculation/)
- **→ Next Group:** [Group-D_Scheduled-Promotional-Pricing](../Group-D_Scheduled-Promotional-Pricing/)

---

## Group Overview

### Key Outcomes
- TieredPricing model with quantity ranges
- Tier validation (no overlaps, min < max)
- Tier lookup method by quantity
- VariantTieredPricing for variant-specific tiers
- Tier inheritance from product to variant
- BulkPricingService for calculations
- Incremental tier calculation (progressive)
- All-units tier calculation (single tier)
- tier_type field for calculation mode
- CartPriceCalculator for cart totals
- Tier threshold display helpers
- Admin and bulk operations
- Tiered pricing reports

### Technology Context
- **Tier Types:** INCREMENTAL (progressive) vs ALL_UNITS (single tier)
- **Inheritance:** Variants inherit product tiers if none defined
- **Cart Integration:** Calculate totals with tiered pricing

---

## Documents in This Group

| # | Document | Tasks | Description |
|---|----------|-------|-------------|
| 01 | 01_Tasks-35-40_TieredPricing-Model.md | 35-40 | TieredPricing model, validation, lookup, display |
| 02 | 02_Tasks-41-46_Variant-Tiers-Types.md | 41-46 | VariantTieredPricing, inheritance, bulk service, tier types |
| 03 | 03_Tasks-47-52_Admin-Cart-Reports.md | 47-52 | Admin, copy tiers, CartPriceCalculator, threshold, reports, tests |

---

## Task Summary

| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 35 | Create TieredPricing model | Medium | 30 min |
| 36 | Add tier validation | Medium | 25 min |
| 37 | Create TieredPricing Meta class | Low | 15 min |
| 38 | Add tier lookup method | Medium | 25 min |
| 39 | Create tiered price calculation | Low | 20 min |
| 40 | Add tier display helper | Low | 15 min |
| 41 | Create VariantTieredPricing model | Medium | 25 min |
| 42 | Add tier inheritance logic | Low | 20 min |
| 43 | Create bulk pricing service | High | 30 min |
| 44 | Add incremental tier calculation | High | 30 min |
| 45 | Create all-units tier calculation | Low | 20 min |
| 46 | Add tier type field | Low | 15 min |
| 47 | Create tiered pricing admin | Medium | 25 min |
| 48 | Add tier copy functionality | Low | 20 min |
| 49 | Create CartPriceCalculator | High | 35 min |
| 50 | Add tier threshold display | Low | 20 min |
| 51 | Create tiered pricing report | Medium | 25 min |
| 52 | Write tiered pricing tests | High | 30 min |

---

## Execution Order

```
Tasks 35-40: TieredPricing Model
    │ (model, validation, Meta, lookup, calculation, display)
    ▼
Tasks 41-46: Variant Tiers & Types
    │ (VariantTieredPricing, inheritance, bulk service,
    │  incremental, all-units, tier_type)
    ▼
Tasks 47-52: Admin, Cart & Reports
    │ (admin, copy, CartPriceCalculator, threshold,
    │  reports, tests)
```

---

## Expected Deliverables

```
backend/apps/products/pricing/
├── models/
│   ├── __init__.py (updated)
│   └── tiered_pricing.py (NEW)
├── services/
│   ├── __init__.py (updated)
│   ├── bulk_pricing.py (NEW)
│   └── cart_price.py (NEW)
├── admin.py (updated)
└── tests/
    └── test_tiered_pricing.py (NEW)
```

---

## Notes for AI Agents

1. **TieredPricing Fields:** product FK, min_quantity, max_quantity, tier_price
2. **Tier Validation:** No overlapping ranges, min < max
3. **Tier Types:**
   - INCREMENTAL: First 10 at price A, next 10 at price B
   - ALL_UNITS: Entire order at single tier price
4. **Tier Lookup:** get_tier_for_quantity(product, qty)
5. **Inheritance:** If no variant tiers, use product tiers
6. **Display Format:** "Buy 10+: LKR 90/unit"
7. **CartPriceCalculator:** Calculate total with mixed quantities
8. **Threshold Hint:** "Add X more for tier discount"
9. **unique_together:** (product, min_quantity) or (product, min_quantity, max_quantity)
10. **Next Group:** Scheduled & Promotional Pricing (Group D)
