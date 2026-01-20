# Group B: Bundle Stock & Pricing Logic

> **Phase:** 04 - ERP Core Modules Part 1  
> **SubPhase:** 05 - Bundle & Composite Products  
> **Group:** B of F  
> **Tasks Covered:** 21-36  
> **Group Goal:** Implement stock availability and pricing calculation services for bundles

---

## Navigation

- **↑ Parent:** [00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [Group-A_Bundle-Product-Models](../Group-A_Bundle-Product-Models/)
- **→ Next Group:** [Group-C_Composite-Product-BOM](../Group-C_Composite-Product-BOM/)

---

## Group Overview

### Key Outcomes
- BundleStockService for calculating available stock
- Stock availability based on component minimums
- Limiting item identification (bottleneck component)
- BundlePricingService for price calculations
- Fixed and dynamic pricing support
- Bundle discount application
- Customer savings calculation
- Custom Bundle Manager with optimized querysets

### Technology Context
- **Pattern:** Service Layer pattern for business logic
- **Stock Logic:** MIN(component_stock / qty_in_bundle)
- **Dynamic Pricing:** Sum of component prices minus discount
- **Manager:** Custom manager for common bundle queries

---

## Documents in This Group

| # | Document | Tasks | Description |
|---|----------|-------|-------------|
| 01 | 01_Tasks-21-26_Bundle-Stock-Service.md | 21-26 | BundleStockService with availability checks |
| 02 | 02_Tasks-27-31_Bundle-Pricing-Service.md | 27-31 | BundlePricingService with discount logic |
| 03 | 03_Tasks-32-36_Bundle-Manager-Tests.md | 32-36 | Custom manager and initial tests |

---

## Task Summary

| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 21 | Create bundle_services.py | Low | 3 min |
| 22 | Create BundleStockService Class | Medium | 10 min |
| 23 | Add get_available_stock Method | High | 15 min |
| 24 | Add check_availability Method | Medium | 10 min |
| 25 | Add get_limiting_item Method | Medium | 10 min |
| 26 | Add reserve_stock Method | High | 15 min |
| 27 | Create BundlePricingService Class | Medium | 10 min |
| 28 | Add calculate_fixed_price Method | Low | 5 min |
| 29 | Add calculate_dynamic_price Method | Medium | 10 min |
| 30 | Add apply_discount Method | Medium | 10 min |
| 31 | Add get_savings Method | Low | 5 min |
| 32 | Create Bundle Manager | Medium | 10 min |
| 33 | Add active Method | Low | 5 min |
| 34 | Add available Method | Medium | 10 min |
| 35 | Add with_items Method | Low | 5 min |
| 36 | Test Bundle Logic | High | 20 min |

---

## Execution Order

```
Task 21: Create bundle_services.py
    │
    ▼
Tasks 22-26: BundleStockService
    │ (get_available_stock, check_availability,
    │  get_limiting_item, reserve_stock)
    ▼
Tasks 27-31: BundlePricingService
    │ (calculate_fixed_price, calculate_dynamic_price,
    │  apply_discount, get_savings)
    ▼
Tasks 32-35: Bundle Manager
    │ (active, available, with_items)
    ▼
Task 36: Test Bundle Logic
```

---

## Expected Deliverables

```
backend/apps/products/
├── services/
│   ├── __init__.py (updated)
│   └── bundle_services.py (NEW)
├── managers/
│   ├── __init__.py (updated)
│   └── bundle_manager.py (NEW or in bundle.py)
└── tests/
    └── test_bundle_services.py (NEW)
```

---

## Notes for AI Agents

1. **Stock Calculation:** Bundle stock = MIN(component_stock / qty_per_bundle)
2. **Limiting Item:** Component that determines max bundle availability
3. **reserve_stock:** Should be transactional and atomic
4. **Fixed Pricing:** Return fixed_price directly
5. **Dynamic Pricing:** Sum component prices, then apply discount
6. **Discount Types:** Support both percentage and fixed amount discounts
7. **Savings:** Individual prices sum minus bundle price
8. **Prefetch:** with_items() should prefetch bundle items and products
9. **Next Group:** Composite Product & BOM (Group C)
