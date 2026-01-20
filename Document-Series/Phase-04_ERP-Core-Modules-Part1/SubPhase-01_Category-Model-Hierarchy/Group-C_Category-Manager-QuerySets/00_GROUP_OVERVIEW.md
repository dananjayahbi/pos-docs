# Group C: Category Manager & QuerySets

> **Phase:** 04 - ERP Core Modules Part 1  
> **SubPhase:** 01 - Category Model & Hierarchy  
> **Group:** C of F  
> **Tasks Covered:** 33-46  
> **Group Goal:** Create custom managers and querysets for category operations

---

## Navigation

- **↑ Parent:** [00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [Group-B_Category-Model-Definition](../Group-B_Category-Model-Definition/)
- **→ Next Group:** [Group-D_Category-Serializers-Views](../Group-D_Category-Serializers-Views/)

---

## Group Overview

### Key Outcomes
- Custom CategoryQuerySet with chainable methods
- CategoryManager for complex tree operations
- Efficient methods for tree traversal
- Breadcrumb generation for navigation
- Node movement for reordering

### Technology Context
- Django QuerySet for chainable filters
- MPTT TreeManager integration
- Prefetch for N+1 query prevention
- get_ancestors() and get_descendants() from MPTT

---

## Documents in This Group

| # | Document | Tasks | Description |
|---|----------|-------|-------------|
| 01 | 01_Tasks-33-38_QuerySet-Definition.md | 33-38 | Create CategoryQuerySet with filter methods |
| 02 | 02_Tasks-39-43_Manager-Tree-Methods.md | 39-43 | Create CategoryManager with tree operations |
| 03 | 03_Tasks-44-46_Assignment-Properties-Testing.md | 44-46 | Assign manager and add model properties |

---

## Task Summary

| Task # | Task Name | Complexity |
|--------|-----------|------------|
| 33 | Create managers.py File | Low |
| 34 | Create CategoryQuerySet | Medium |
| 35 | Add active Method | Low |
| 36 | Add root_nodes Method | Medium |
| 37 | Add with_children Method | Medium |
| 38 | Add with_products Method | Medium |
| 39 | Create CategoryManager | Medium |
| 40 | Add get_tree Method | High |
| 41 | Add get_breadcrumbs Method | Medium |
| 42 | Add get_descendants_ids Method | Medium |
| 43 | Add move_node Method | High |
| 44 | Assign Manager to Model | Low |
| 45 | Add Model Properties | Medium |
| 46 | Test Manager Methods | Medium |

---

## Execution Order

```
Task 33: Create managers.py
    │
    ▼
Tasks 34-38: CategoryQuerySet Methods
    │
    ▼
Tasks 39-43: CategoryManager Tree Methods
    │
    ▼
Tasks 44-45: Model Assignment & Properties
    │
    ▼
Task 46: Testing
```

---

## Expected Deliverables

```
backend/apps/categories/
└── models/
    ├── __init__.py
    ├── category.py
    └── managers.py
```

---

## Notes for AI Agents

1. CategoryQuerySet enables chainable filter methods
2. Use TreeQuerySet as base for MPTT compatibility
3. with_children uses prefetch_related for efficiency
4. get_breadcrumbs returns ancestor path for navigation
5. move_node must properly update MPTT fields
6. get_descendants_ids is useful for product filtering
