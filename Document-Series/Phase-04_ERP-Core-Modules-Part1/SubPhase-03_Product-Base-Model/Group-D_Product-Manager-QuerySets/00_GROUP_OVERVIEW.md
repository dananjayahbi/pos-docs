# Group D: Product Manager & QuerySets

> **Phase:** 04 - ERP Core Modules Part 1  
> **SubPhase:** 03 - Product Base Model  
> **Group:** D of F  
> **Tasks Covered:** 57-70  
> **Group Goal:** Create custom managers and querysets for product operations

---

## Navigation

- **↑ Parent:** [00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [Group-C_Product-Model-Definition](../Group-C_Product-Model-Definition/)
- **→ Next Group:** [Group-E_Serializers-Views](../Group-E_Serializers-Views/)

---

## Group Overview

### Key Outcomes
- ProductQuerySet with chainable filter methods
- ProductManager with search functionality
- Methods for active, published, in_stock filtering
- Category and brand filtering
- Product type filtering

### Technology Context
- Django QuerySet for chainable filters
- PostgreSQL full-text search integration
- Prefetch optimization for related objects
- Tenant-scoped queries

---

## Documents in This Group

| # | Document | Tasks | Description |
|---|----------|-------|-------------|
| 01 | 01_Tasks-57-63_ProductQuerySet-Filters.md | 57-63 | Create ProductQuerySet with filter methods |
| 02 | 02_Tasks-64-70_Manager-Search-Migration.md | 64-70 | Create manager with search and migration |

---

## Task Summary

| Task # | Task Name | Complexity |
|--------|-----------|------------|
| 57 | Create managers.py File | Low |
| 58 | Create ProductQuerySet | Medium |
| 59 | Add active Method | Low |
| 60 | Add published Method | Medium |
| 61 | Add in_stock Method | Medium |
| 62 | Add by_category Method | Medium |
| 63 | Add by_brand Method | Low |
| 64 | Add simple_products Method | Low |
| 65 | Add variable_products Method | Low |
| 66 | Add featured Method | Low |
| 67 | Create ProductManager | Medium |
| 68 | Add search Method | High |
| 69 | Assign Manager to Model | Low |
| 70 | Create Migration | Low |

---

## Execution Order

```
Tasks 57-63: ProductQuerySet Methods
    │
    ▼
Tasks 64-66: Type & Featured Filters
    │
    ▼
Tasks 67-69: ProductManager & Search
    │
    ▼
Task 70: Migration
```

---

## Expected Deliverables

```
backend/apps/products/
└── models/
    ├── __init__.py
    ├── brand.py
    ├── tax_class.py
    ├── unit_of_measure.py
    ├── product.py
    └── managers.py
```

---

## Notes for AI Agents

1. active filters by status=ACTIVE
2. published filters by status=ACTIVE and is_webstore_visible=True
3. in_stock requires inventory integration (placeholder for now)
4. by_category should include child categories via MPTT
5. search uses PostgreSQL SearchVector for name, description, SKU
6. All methods should be chainable
