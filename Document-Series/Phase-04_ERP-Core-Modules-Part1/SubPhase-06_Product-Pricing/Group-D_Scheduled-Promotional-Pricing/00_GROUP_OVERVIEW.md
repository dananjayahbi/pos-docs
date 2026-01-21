# Group D: Scheduled & Promotional Pricing

> **Phase:** 04 - ERP Core Modules Part 1  
> **SubPhase:** 06 - Product Pricing  
> **Group:** D of F  
> **Tasks Covered:** 53-68  
> **Group Goal:** Implement time-based sales, flash sales, and promotional pricing rules

---

## Navigation

- **↑ Parent:** [00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [Group-C_Tiered-Volume-Pricing](../Group-C_Tiered-Volume-Pricing/)
- **→ Next Group:** [Group-E_Price-Serializers-API-Views](../Group-E_Price-Serializers-API-Views/)

---

## Group Overview

### Key Outcomes
- ScheduledPrice model with start/end datetime
- Schedule validation (no overlaps, start < end)
- Schedule status field (PENDING, ACTIVE, EXPIRED)
- Celery task for schedule activation/deactivation
- Schedule priority for overlap resolution
- FlashSale model with max_quantity limit
- Flash sale quantity tracking and auto-end
- Promotional pricing rules (percentage off, fixed off, fixed price)
- Promotional conditions (min_quantity, category, customer_group)
- get_effective_price service for price resolution
- Price priority resolution order
- Schedule expiry cleanup task
- Promotion analytics tracking
- Promotional calendar API endpoint
- Bulk schedule operations
- Comprehensive scheduled pricing tests

### Technology Context
- **Priority Order:** Flash Sale > Scheduled > Sale Price > Base Price
- **Celery:** Async tasks for activation/deactivation
- **Analytics:** Track views, conversions, revenue

---

## Documents in This Group

| # | Document | Tasks | Description |
|---|----------|-------|-------------|
| 01 | 01_Tasks-53-58_ScheduledPrice-FlashSale.md | 53-58 | ScheduledPrice model, validation, status, Celery, FlashSale |
| 02 | 02_Tasks-59-63_Promotional-Rules-Effective.md | 59-63 | Quantity tracking, promo rules, conditions, effective price, priority |
| 03 | 03_Tasks-64-68_Cleanup-Analytics-Tests.md | 64-68 | Expiry cleanup, analytics, calendar, bulk ops, tests |

---

## Task Summary

| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 53 | Create ScheduledPrice model | Medium | 30 min |
| 54 | Add schedule validation | Medium | 25 min |
| 55 | Add schedule status field | Low | 15 min |
| 56 | Create schedule activation task | High | 30 min |
| 57 | Add schedule priority field | Low | 20 min |
| 58 | Create FlashSale model | Medium | 25 min |
| 59 | Add flash sale quantity tracking | Medium | 25 min |
| 60 | Create promotional pricing rules | High | 30 min |
| 61 | Add promotional condition logic | High | 30 min |
| 62 | Create get_effective_price service | High | 35 min |
| 63 | Add price priority resolution | Medium | 25 min |
| 64 | Create schedule expiry cleanup | Medium | 25 min |
| 65 | Add promotion analytics | High | 30 min |
| 66 | Create promotional calendar view | Medium | 25 min |
| 67 | Add schedule bulk operations | Medium | 25 min |
| 68 | Write scheduled pricing tests | High | 30 min |

---

## Execution Order

```
Tasks 53-58: ScheduledPrice & FlashSale
    │ (model, validation, status, Celery task,
    │  priority, FlashSale model)
    ▼
Tasks 59-63: Promotional Rules & Resolution
    │ (quantity tracking, promo rules, conditions,
    │  get_effective_price, priority resolution)
    ▼
Tasks 64-68: Cleanup, Analytics & Testing
    │ (expiry cleanup, analytics, calendar,
    │  bulk ops, tests)
```

---

## Expected Deliverables

```
backend/apps/products/pricing/
├── models/
│   ├── __init__.py (updated)
│   ├── scheduled_price.py (NEW)
│   └── flash_sale.py (NEW)
├── services/
│   ├── __init__.py (updated)
│   └── effective_price.py (NEW)
├── tasks/
│   ├── __init__.py (NEW)
│   ├── schedule_activation.py (NEW)
│   └── schedule_cleanup.py (NEW)
└── tests/
    └── test_scheduled_pricing.py (NEW)
```

---

## Notes for AI Agents

1. **ScheduledPrice Fields:** product FK, scheduled_price, start_datetime, end_datetime
2. **Status Values:** PENDING (future), ACTIVE (now), EXPIRED (past)
3. **Priority Order:**
   - Flash Sale (if active and quantity remaining)
   - Scheduled Price (highest priority wins)
   - Sale Price (within sale dates)
   - Tiered Price (if quantity threshold met)
   - Wholesale Price (if eligible)
   - Base Price (fallback)
4. **FlashSale:** max_quantity, units_sold, auto-end when sold out
5. **Promo Rules:** PERCENTAGE_OFF, FIXED_AMOUNT_OFF, FIXED_PRICE
6. **Conditions:** min_quantity, specific_category, customer_group
7. **Celery Tasks:** Run every minute to activate/expire schedules
8. **Analytics:** product_id, promotion_type, views, conversions, revenue
9. **Calendar:** GET /api/v1/promotions/calendar/
10. **Next Group:** Price Serializers & API Views (Group E)
