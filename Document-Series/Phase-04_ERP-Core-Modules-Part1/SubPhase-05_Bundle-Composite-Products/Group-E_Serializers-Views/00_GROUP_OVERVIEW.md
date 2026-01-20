# Group E: Serializers & Views

> **Phase:** 04 - ERP Core Modules Part 1  
> **SubPhase:** 05 - Bundle & Composite Products  
> **Group:** E of F  
> **Tasks Covered:** 69-80  
> **Group Goal:** Create API serializers and viewsets for bundles and BOM

---

## Navigation

- **↑ Parent:** [00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [Group-D_Manufacturing-Cost-Calculation](../Group-D_Manufacturing-Cost-Calculation/)
- **→ Next Group:** [Group-F_Testing-Documentation](../Group-F_Testing-Documentation/)

---

## Group Overview

### Key Outcomes
- ProductBundleSerializer for bundle data
- BundleItemSerializer for bundle components
- BundleDetailSerializer with nested items
- BillOfMaterialsSerializer for BOM data
- BOMItemSerializer for BOM components
- ProductBundleViewSet with CRUD operations
- BillOfMaterialsViewSet with CRUD operations
- API URL routing for bundle and BOM endpoints

### Technology Context
- **Framework:** Django REST Framework 3.15+
- **Pattern:** ViewSet with ModelSerializer
- **Nested Serializers:** Bundle/BOM with items
- **Permissions:** Tenant-aware access control

---

## Documents in This Group

| # | Document | Tasks | Description |
|---|----------|-------|-------------|
| 01 | 01_Tasks-69-72_Bundle-Serializers.md | 69-72 | Bundle and BundleItem serializers |
| 02 | 02_Tasks-73-75_BOM-Serializers.md | 73-75 | BOM and BOMItem serializers |
| 03 | 03_Tasks-76-80_ViewSets-URLs.md | 76-80 | ViewSets and URL configuration |

---

## Task Summary

| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 69 | Create bundle_serializers.py | Low | 3 min |
| 70 | Create ProductBundleSerializer | Medium | 10 min |
| 71 | Create BundleItemSerializer | Medium | 10 min |
| 72 | Create BundleDetailSerializer | Medium | 10 min |
| 73 | Create bom_serializers.py | Low | 3 min |
| 74 | Create BillOfMaterialsSerializer | Medium | 10 min |
| 75 | Create BOMItemSerializer | Medium | 10 min |
| 76 | Create bundle_views.py | Low | 3 min |
| 77 | Create ProductBundleViewSet | High | 15 min |
| 78 | Create bom_views.py | Low | 3 min |
| 79 | Create BillOfMaterialsViewSet | High | 15 min |
| 80 | Update urls.py | Medium | 10 min |

---

## Execution Order

```
Tasks 69-72: Bundle Serializers
    │ (bundle_serializers.py, ProductBundleSerializer,
    │  BundleItemSerializer, BundleDetailSerializer)
    ▼
Tasks 73-75: BOM Serializers
    │ (bom_serializers.py, BillOfMaterialsSerializer,
    │  BOMItemSerializer)
    ▼
Tasks 76-77: Bundle ViewSet
    │ (bundle_views.py, ProductBundleViewSet)
    ▼
Tasks 78-79: BOM ViewSet
    │ (bom_views.py, BillOfMaterialsViewSet)
    ▼
Task 80: Update urls.py
```

---

## Expected Deliverables

```
backend/apps/products/
├── serializers/
│   ├── __init__.py (updated)
│   ├── bundle_serializers.py (NEW)
│   └── bom_serializers.py (NEW)
├── views/
│   ├── __init__.py (updated)
│   ├── bundle_views.py (NEW)
│   └── bom_views.py (NEW)
└── urls.py (updated)
```

---

## Notes for AI Agents

1. **BundleDetailSerializer:** Include nested items with product info
2. **Calculated Fields:** Include calculated_price, available_stock, savings
3. **Nested Creation:** Support creating bundle with items in one request
4. **BOM Detail:** Include total_cost, unit_cost in read response
5. **ViewSet Actions:** Consider custom actions for availability, cost
6. **Permissions:** Use TenantPermission mixin
7. **Filtering:** Filter by product, is_active, bundle_type
8. **URL Patterns:** /api/v1/bundles/, /api/v1/bom/
9. **Router:** Use DRF DefaultRouter
10. **Next Group:** Testing & Documentation (Group F)
