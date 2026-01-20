# Group E: Serializers & Views

> **Phase:** 04 - ERP Core Modules Part 1  
> **SubPhase:** 03 - Product Base Model  
> **Group:** E of F  
> **Tasks Covered:** 71-86  
> **Group Goal:** Create API serializers, viewsets, and admin for products

---

## Navigation

- **↑ Parent:** [00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [Group-D_Product-Manager-QuerySets](../Group-D_Product-Manager-QuerySets/)
- **→ Next Group:** [Group-F_Testing-Documentation](../Group-F_Testing-Documentation/)

---

## Group Overview

### Key Outcomes
- Serializers for all product-related models
- Auto SKU generation in create serializer
- ProductViewSet with filtering
- ProductFilter for advanced filtering
- Admin configuration with rich features

### Technology Context
- DRF ModelSerializer with nested relationships
- ModelViewSet for CRUD operations
- django-filter integration for filtering
- Admin with list display, filters, search

---

## Documents in This Group

| # | Document | Tasks | Description |
|---|----------|-------|-------------|
| 01 | 01_Tasks-71-78_Serializer-Definitions.md | 71-78 | Create all product serializers |
| 02 | 02_Tasks-79-84_ViewSets-URLs.md | 79-84 | Create ViewSets and URL routing |
| 03 | 03_Tasks-85-86_Admin-Configuration.md | 85-86 | Configure admin with filters |

---

## Task Summary

| Task # | Task Name | Complexity |
|--------|-----------|------------|
| 71 | Create serializers.py File | Low |
| 72 | Create BrandSerializer | Low |
| 73 | Create TaxClassSerializer | Low |
| 74 | Create UnitOfMeasureSerializer | Low |
| 75 | Create ProductListSerializer | Medium |
| 76 | Create ProductDetailSerializer | Medium |
| 77 | Create ProductCreateSerializer | High |
| 78 | Add Auto SKU Generation | High |
| 79 | Create views.py File | Low |
| 80 | Create BrandViewSet | Medium |
| 81 | Create TaxClassViewSet | Medium |
| 82 | Create ProductViewSet | High |
| 83 | Add ProductFilter | Medium |
| 84 | Create urls.py File | Low |
| 85 | Create admin.py File | Medium |
| 86 | Configure Admin Filters | Low |

---

## Execution Order

```
Tasks 71-78: Serializers
    │
    ▼
Tasks 79-83: ViewSets & Filters
    │
    ▼
Task 84: URL Routing
    │
    ▼
Tasks 85-86: Admin Configuration
```

---

## Expected Deliverables

```
backend/apps/products/
├── serializers.py
├── views.py
├── urls.py
├── filters.py
└── admin.py
```

---

## Notes for AI Agents

1. ProductListSerializer should be lightweight for list views
2. ProductDetailSerializer includes nested category, brand
3. Auto SKU format: PREFIX-CATEGORY-NUMBER (e.g., PRD-ELEC-00001)
4. ProductFilter supports category, brand, status, type, search
5. Admin should include inline editing for common fields
6. Use select_related for category, brand in views
