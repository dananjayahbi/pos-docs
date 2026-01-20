# Group D: Variant Managers & QuerySets

> **Phase:** 04 - ERP Core Modules Part 1  
> **SubPhase:** 04 - Product Variants  
> **Group:** D of F  
> **Tasks Covered:** 55-66  
> **Group Goal:** Create custom managers and querysets for variant operations

---

## Navigation

- **↑ Parent:** [00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [Group-C_Variant-Generation-Logic](../Group-C_Variant-Generation-Logic/)
- **→ Next Group:** [Group-E_Serializers-Views](../Group-E_Serializers-Views/)

---

## Group Overview

### Key Outcomes
- VariantQuerySet with chainable filter methods
- VariantManager with lookup methods
- Filter by product, option, stock status
- Prefetch optimization for prices and stock

### Technology Context
- Django QuerySet patterns
- Prefetch for related data
- Filter by ManyToMany options
- Tenant-scoped queries

---

## Documents in This Group

| # | Document | Tasks | Description |
|---|----------|-------|-------------|
| 01 | 01_Tasks-55-62_VariantQuerySet-Methods.md | 55-62 | Create VariantQuerySet with filters |
| 02 | 02_Tasks-63-66_VariantManager-Assignment.md | 63-66 | Create manager and assign to model |

---

## Task Summary

| Task # | Task Name | Complexity |
|--------|-----------|------------|
| 55 | Create variant_managers.py | Low |
| 56 | Create VariantQuerySet | Medium |
| 57 | Add active Method | Low |
| 58 | Add in_stock Method | Medium |
| 59 | Add for_product Method | Low |
| 60 | Add by_option Method | Medium |
| 61 | Add with_prices Method | Medium |
| 62 | Add with_stock Method | Medium |
| 63 | Create VariantManager | Medium |
| 64 | Add get_by_options Method | High |
| 65 | Assign Manager to Model | Low |
| 66 | Test Manager Methods | Medium |

---

## Execution Order

```
Tasks 55-62: VariantQuerySet Methods
    │
    ▼
Tasks 63-66: VariantManager & Testing
```

---

## Expected Deliverables

```
backend/apps/products/
└── models/
    ├── __init__.py
    ├── variant_option.py
    ├── product_variant.py
    └── variant_managers.py
```

---

## Notes for AI Agents

1. active filters is_active=True variants
2. for_product filters by parent product ID
3. by_option filters variants having specific option values
4. get_by_options finds exact variant matching option combination
5. with_prices/with_stock use prefetch_related
6. All methods should be chainable
