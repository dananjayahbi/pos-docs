# Group F: Testing & Documentation

> **Phase:** 04 - ERP Core Modules Part 1  
> **SubPhase:** 08 - Warehouse & Locations  
> **Group:** F of F  
> **Tasks Covered:** 79-84  
> **Group Goal:** Comprehensive testing and documentation for warehouse system

---

## Navigation

- **↑ Parent:** [00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [Group-E_Serializers-API-Views](../Group-E_Serializers-API-Views/)
- **→ Next SubPhase:** [SubPhase-09_Inventory-Management](../../SubPhase-09_Inventory-Management/)

---

## Group Overview

### Key Outcomes
- Warehouse model tests (creation, is_default constraint, validation)
- StorageLocation tests (hierarchy, path generation, validation)
- Barcode generation tests (format, uniqueness, validation)
- API endpoint tests (all ViewSet actions with auth)
- Warehouse module documentation (models, services, endpoints)
- Warehouse setup guide (user-facing instructions)

### Technology Context
- **Testing:** pytest with Django fixtures
- **Factory:** Factory Boy for test data
- **Coverage:** Aim for 90%+ coverage
- **Documentation:** Markdown with examples

---

## Documents in This Group

| # | Document | Tasks | Description |
|---|----------|-------|-------------|
| 01 | 01_Tasks-79-81_Model-Barcode-Tests.md | 79-81 | Warehouse, StorageLocation, barcode tests |
| 02 | 02_Tasks-82-84_API-Docs-Guide.md | 82-84 | API tests, module documentation, setup guide |

---

## Task Summary

| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 79 | Create Warehouse model tests | High | 30 min |
| 80 | Create StorageLocation tests | High | 30 min |
| 81 | Create barcode generation tests | Medium | 25 min |
| 82 | Create API endpoint tests | High | 35 min |
| 83 | Write warehouse module documentation | Medium | 40 min |
| 84 | Create warehouse setup guide | Medium | 35 min |

---

## Execution Order

```
Tasks 79-81: Unit Tests
    │ (Warehouse, StorageLocation, barcode)
    ▼
Task 82: API Tests
    │ (all ViewSet actions)
    ▼
Tasks 83-84: Documentation
    │ (module docs, setup guide)
```

---

## Expected Deliverables

```
backend/apps/inventory/
├── tests/
│   └── warehouses/
│       ├── __init__.py (NEW)
│       ├── test_models.py (NEW)
│       ├── test_barcodes.py (NEW)
│       ├── test_api.py (NEW)
│       └── factories/
│           └── warehouse_factories.py (NEW)
└── warehouses/
    └── docs/
        ├── warehouse_module.md (NEW)
        └── warehouse_guide.md (NEW)
```

---

## Notes for AI Agents

1. **Warehouse Model Tests:**
   - Create warehouse with all fields
   - Test is_default constraint (only one per tenant)
   - Test code uniqueness within tenant
   - Test phone format validation (+94)
   - Test get_active(), get_default() manager methods
2. **StorageLocation Tests:**
   - Test hierarchy creation (zone → aisle → rack → bin)
   - Test path property generation
   - Test depth calculation
   - Test get_children, get_all_descendants
   - Test hierarchy validation (parent type rules)
   - Test bulk location generator
3. **Barcode Tests:**
   - Test barcode format compliance
   - Test check digit calculation
   - Test uniqueness per tenant
   - Test auto-generation signal
   - Test lookup by barcode
4. **API Tests:**
   - Test CRUD operations for warehouses
   - Test set-default endpoint
   - Test location tree endpoint
   - Test barcode lookup endpoint
   - Test bulk location create
   - Test permission enforcement
5. **Documentation:**
   - All models with field descriptions
   - Barcode format specification
   - API endpoints with examples
   - Transfer route configuration
6. **Setup Guide:**
   - How to create warehouses
   - How to set up location hierarchy
   - How to generate barcodes
   - Best practices for zone layout
7. **SubPhase Complete:** Ready for Inventory Management (SubPhase-09)
