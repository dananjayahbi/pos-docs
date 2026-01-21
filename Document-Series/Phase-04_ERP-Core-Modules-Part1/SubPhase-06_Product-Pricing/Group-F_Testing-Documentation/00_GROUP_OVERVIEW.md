# Group F: Testing & Documentation

> **Phase:** 04 - ERP Core Modules Part 1  
> **SubPhase:** 06 - Product Pricing  
> **Group:** F of F  
> **Tasks Covered:** 81-88  
> **Group Goal:** Comprehensive testing and documentation for pricing system

---

## Navigation

- **↑ Parent:** [00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [Group-E_Price-Serializers-API-Views](../Group-E_Price-Serializers-API-Views/)
- **→ Next SubPhase:** [SubPhase-07_Product-Media](../../SubPhase-07_Product-Media/)

---

## Group Overview

### Key Outcomes
- ProductPrice model tests (creation, validation, properties)
- Tax calculation tests (all scenarios with known inputs/outputs)
- Tiered pricing tests (lookup, incremental vs all-units, edge cases)
- Scheduled pricing tests (activation, overlap, expiry, flash sale limits)
- API endpoint tests (all ViewSet actions with auth)
- Price calculation integration tests (end-to-end flow)
- Pricing module documentation (models, services, endpoints)
- Pricing configuration guide (user-facing setup instructions)

### Technology Context
- **Testing:** pytest with Django fixtures
- **Factory:** Factory Boy for test data
- **Coverage:** Aim for 90%+ coverage
- **Documentation:** Markdown with examples

---

## Documents in This Group

| # | Document | Tasks | Description |
|---|----------|-------|-------------|
| 01 | 01_Tasks-81-84_Model-Tax-Tier-Tests.md | 81-84 | ProductPrice, tax, tiered, scheduled tests |
| 02 | 02_Tasks-85-88_API-Integration-Docs.md | 85-88 | API tests, integration tests, documentation, guide |

---

## Task Summary

| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 81 | Create ProductPrice model tests | High | 30 min |
| 82 | Create tax calculation tests | High | 30 min |
| 83 | Create tiered pricing tests | High | 30 min |
| 84 | Create scheduled pricing tests | High | 30 min |
| 85 | Create API endpoint tests | High | 35 min |
| 86 | Create price calculation integration tests | High | 35 min |
| 87 | Write pricing module documentation | Medium | 40 min |
| 88 | Create pricing configuration guide | Medium | 30 min |

---

## Execution Order

```
Tasks 81-84: Unit Tests
    │ (ProductPrice, tax, tiered, scheduled)
    ▼
Tasks 85-86: API & Integration Tests
    │ (endpoints, end-to-end flow)
    ▼
Tasks 87-88: Documentation
    │ (module docs, configuration guide)
```

---

## Expected Deliverables

```
backend/apps/products/pricing/
├── tests/
│   ├── __init__.py (NEW)
│   ├── test_models.py (NEW)
│   ├── test_tax_calculation.py (NEW)
│   ├── test_tiered_pricing.py (NEW)
│   ├── test_scheduled_pricing.py (NEW)
│   ├── test_api.py (NEW)
│   ├── test_integration.py (NEW)
│   └── factories/
│       └── price_factories.py (NEW)
└── docs/
    ├── pricing_module.md (NEW)
    └── pricing_guide.md (NEW)
```

---

## Notes for AI Agents

1. **Model Tests:**
   - Create ProductPrice with all fields
   - Validate sale_price < base_price
   - Test profit margin calculation
   - Test is_on_sale() with various dates
2. **Tax Tests:**
   - Test 12% VAT calculation
   - Test inclusive to exclusive conversion
   - Test SVAT exemption
   - Test zero-rated products
3. **Tiered Tests:**
   - Test tier lookup at exact boundaries
   - Test incremental vs all-units
   - Test tier inheritance for variants
4. **Scheduled Tests:**
   - Test activation at start_datetime
   - Test expiry at end_datetime
   - Test priority resolution
   - Test flash sale quantity limit
5. **API Tests:**
   - Test CRUD operations
   - Test permission enforcement
   - Test bulk update validation
6. **Integration Tests:**
   - Complete price resolution flow
   - Cart with tiered pricing
   - Order with scheduled sale price
7. **Documentation:**
   - All models with field descriptions
   - Service methods with examples
   - API endpoints with request/response
8. **Configuration Guide:**
   - How to set up tiered pricing
   - How to create flash sales
   - How to configure tax classes
9. **SubPhase Complete:** Ready for Product Media (SubPhase-07)
