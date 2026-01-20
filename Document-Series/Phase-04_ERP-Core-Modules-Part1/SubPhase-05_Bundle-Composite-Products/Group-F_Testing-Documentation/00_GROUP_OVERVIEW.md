# Group F: Testing & Documentation

> **Phase:** 04 - ERP Core Modules Part 1  
> **SubPhase:** 05 - Bundle & Composite Products  
> **Group:** F of F  
> **Tasks Covered:** 81-90  
> **Group Goal:** Comprehensive testing and documentation for bundles and BOM

---

## Navigation

- **↑ Parent:** [00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [Group-E_Serializers-Views](../Group-E_Serializers-Views/)
- **→ Next SubPhase:** [SubPhase-06_Product-Pricing](../../SubPhase-06_Product-Pricing/)

---

## Group Overview

### Key Outcomes
- Bundle model and service tests
- Bundle creation and configuration tests
- Bundle stock calculation tests
- Bundle pricing logic tests
- BOM model and service tests
- BOM creation tests
- Manufacturing cost calculation tests
- Tenant isolation verification
- Usage documentation for bundles
- Usage documentation for BOM
- Full integration test across modules

### Technology Context
- **Testing:** pytest with Django fixtures
- **Factory:** Factory Boy for test data
- **Coverage:** Aim for 90%+ coverage
- **Documentation:** Markdown with examples

---

## Documents in This Group

| # | Document | Tasks | Description |
|---|----------|-------|-------------|
| 01 | 01_Tasks-81-84_Bundle-Tests.md | 81-84 | Bundle creation, stock, and pricing tests |
| 02 | 02_Tasks-85-88_BOM-Tests.md | 85-88 | BOM creation, cost, and tenant tests |
| 03 | 03_Tasks-89-90_Documentation-Integration.md | 89-90 | README documentation and integration tests |

---

## Task Summary

| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 81 | Create test_bundles.py | Low | 5 min |
| 82 | Test Bundle Creation | Medium | 15 min |
| 83 | Test Bundle Stock Calc | High | 20 min |
| 84 | Test Bundle Pricing | High | 20 min |
| 85 | Create test_bom.py | Low | 5 min |
| 86 | Test BOM Creation | Medium | 15 min |
| 87 | Test Cost Calculation | High | 20 min |
| 88 | Test Tenant Isolation | High | 20 min |
| 89 | Create Bundle/BOM README | Medium | 15 min |
| 90 | Verify Full Integration | High | 25 min |

---

## Execution Order

```
Tasks 81-84: Bundle Tests
    │ (test_bundles.py, creation, stock calc,
    │  pricing tests)
    ▼
Tasks 85-88: BOM Tests
    │ (test_bom.py, creation, cost calc,
    │  tenant isolation)
    ▼
Tasks 89-90: Documentation & Integration
    │ (README, full integration test)
```

---

## Expected Deliverables

```
backend/apps/products/
├── tests/
│   ├── __init__.py
│   ├── test_bundles.py (NEW)
│   ├── test_bom.py (NEW)
│   └── factories/
│       ├── bundle_factories.py (NEW)
│       └── bom_factories.py (NEW)
└── docs/
    ├── bundles.md (NEW)
    └── bom.md (NEW)
```

---

## Notes for AI Agents

1. **Bundle Tests:**
   - Creating bundles with items
   - Fixed vs dynamic pricing
   - Discount calculation
   - Stock availability based on components
   - Limiting item detection
2. **BOM Tests:**
   - Creating BOM with items
   - Version management (only one active)
   - Cost calculation accuracy
   - Wastage inclusion
   - Substitute material handling
3. **Tenant Isolation:**
   - Bundles/BOMs not visible across tenants
   - Cross-tenant operations blocked
4. **Integration Tests:**
   - Bundle with variant components
   - BOM with multiple material types
   - Full order flow with bundles
5. **Documentation:**
   - How to create bundles
   - How to set up BOM
   - Pricing strategies
   - Manufacturing workflow
6. **SubPhase Complete:** Ready for Product Pricing (SubPhase-06)
