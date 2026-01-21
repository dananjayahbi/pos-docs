# Group E: Price Serializers & API Views

> **Phase:** 04 - ERP Core Modules Part 1  
> **SubPhase:** 06 - Product Pricing  
> **Group:** E of F  
> **Tasks Covered:** 69-80  
> **Group Goal:** Create DRF serializers and viewsets for price management

---

## Navigation

- **↑ Parent:** [00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [Group-D_Scheduled-Promotional-Pricing](../Group-D_Scheduled-Promotional-Pricing/)
- **→ Next Group:** [Group-F_Testing-Documentation](../Group-F_Testing-Documentation/)

---

## Group Overview

### Key Outcomes
- ProductPriceSerializer with LKR formatting
- Calculated fields (effective_price, discount_percentage)
- VariantPriceSerializer with inheritance logic
- TieredPricingSerializer with validation
- ScheduledPriceSerializer with datetime handling
- PriceBreakdownSerializer (read-only)
- ProductPriceViewSet with CRUD
- Price update permissions (manage_pricing)
- TieredPricingViewSet with validation
- ScheduledPriceViewSet with activation endpoints
- Price lookup endpoint (/products/{id}/price/)
- Bulk price update endpoint

### Technology Context
- **Framework:** Django REST Framework 3.15+
- **Pattern:** ModelViewSet with ModelSerializer
- **Permissions:** Require 'manage_pricing' permission
- **Calculated Fields:** SerializerMethodField

---

## Documents in This Group

| # | Document | Tasks | Description |
|---|----------|-------|-------------|
| 01 | 01_Tasks-69-73_Price-Serializers.md | 69-73 | ProductPrice, VariantPrice, Tiered, Scheduled serializers |
| 02 | 02_Tasks-74-77_ViewSets-Permissions.md | 74-77 | PriceBreakdown, ProductPriceViewSet, permissions, TieredPricingViewSet |
| 03 | 03_Tasks-78-80_Schedule-Lookup-Bulk.md | 78-80 | ScheduledPriceViewSet, price lookup, bulk update |

---

## Task Summary

| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 69 | Create ProductPriceSerializer | Medium | 25 min |
| 70 | Add price calculation fields | Low | 20 min |
| 71 | Create VariantPriceSerializer | Medium | 25 min |
| 72 | Create TieredPricingSerializer | Low | 20 min |
| 73 | Create ScheduledPriceSerializer | Low | 20 min |
| 74 | Create PriceBreakdownSerializer | Medium | 25 min |
| 75 | Create ProductPriceViewSet | High | 30 min |
| 76 | Add price update permissions | Low | 20 min |
| 77 | Create TieredPricingViewSet | Medium | 25 min |
| 78 | Create ScheduledPriceViewSet | Medium | 25 min |
| 79 | Add price lookup endpoint | Medium | 25 min |
| 80 | Create bulk price update endpoint | High | 30 min |

---

## Execution Order

```
Tasks 69-73: Serializers
    │ (ProductPrice, VariantPrice, Tiered, Scheduled)
    ▼
Tasks 74-77: ViewSets & Permissions
    │ (PriceBreakdown, ProductPriceViewSet,
    │  permissions, TieredPricingViewSet)
    ▼
Tasks 78-80: Advanced Endpoints
    │ (ScheduledPriceViewSet, price lookup, bulk update)
```

---

## Expected Deliverables

```
backend/apps/products/pricing/
├── serializers/
│   ├── __init__.py (NEW)
│   ├── product_price.py (NEW)
│   ├── variant_price.py (NEW)
│   ├── tiered_pricing.py (NEW)
│   └── scheduled_price.py (NEW)
├── views/
│   ├── __init__.py (NEW)
│   ├── product_price.py (NEW)
│   ├── tiered_pricing.py (NEW)
│   └── scheduled_price.py (NEW)
└── urls.py (NEW)
```

---

## Notes for AI Agents

1. **LKR Formatting:** Use format_lkr() for display fields
2. **Calculated Fields:**
   - effective_price: Current applicable price
   - discount_percentage: (base - sale) / base * 100
   - is_on_sale: Boolean based on dates
3. **VariantPrice:** Handle use_product_price inheritance
4. **PriceBreakdown:** {base, tax, total, discount_amount, tier_info}
5. **Permissions:** Check 'manage_pricing' for create/update/delete
6. **Price Lookup:** GET /products/{id}/price/ with optional quantity param
7. **Bulk Update Format:**
   ```
   POST /products/prices/bulk-update/
   [{"product_id": 1, "base_price": "1000.00"}, ...]
   ```
8. **ScheduledPrice Actions:** /activate/, /deactivate/, /extend/
9. **Filtering:** Filter by product, is_active, date range
10. **Next Group:** Testing & Documentation (Group F)
