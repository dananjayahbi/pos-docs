# Group D: Cache Decorators & Utilities

> **Phase:** 03 - Core Backend Infrastructure  
> **SubPhase:** 09 - Caching Layer  
> **Group:** D of F  
> **Tasks Covered:** 47-62  
> **Group Goal:** Create reusable cache decorators and utility functions

---

## Navigation

- **↑ Parent:** [../00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [../Group-C_Tenant-Scoped-Caching/](../Group-C_Tenant-Scoped-Caching/)
- **→ Next Group:** [../Group-E_Invalidation-Patterns/](../Group-E_Invalidation-Patterns/)

---

## Group Overview

This group implements cache decorators and utility functions that simplify caching across the application. Decorators provide declarative caching for views, methods, and querysets, while utilities offer programmatic cache management.

### Key Outcomes
- @cache_response decorator for view caching
- @cache_queryset decorator for QuerySet caching
- @cache_method decorator for method result caching
- Tenant and user variation in cache keys supported
- Utility functions for cache management
- Long key hashing implemented

### Technology Context
- **Module:** apps/core/cache/decorators.py
- **Utilities:** apps/core/cache/utils.py
- **Key Parameters:** cache_key, timeout, vary_on_tenant, vary_on_user
- **Hash Algorithm:** MD5 for keys > 200 chars

---

## Documents in This Group

| # | Document | Tasks | Description |
|---|----------|-------|-------------|
| 01 | 01_Tasks-47-52_Cache-Response-Decorator.md | 47-52 | Create decorators.py, cache_response decorator, cache_key, timeout, vary_on_tenant, vary_on_user |
| 02 | 02_Tasks-53-54_Additional-Decorators.md | 53-54 | Create cache_queryset, cache_method decorators |
| 03 | 03_Tasks-55-60_Utility-Functions.md | 55-60 | Create utils.py, make_cache_key, hash_key, cache_get_or_set, clear_cache, cache_stats |
| 04 | 04_Tasks-61-62_Export-Test.md | 61-62 | Export decorators in __init__.py, write decorator tests |

---

## Task Summary

| Task # | Task Name | Dependencies | Complexity |
|--------|-----------|--------------|------------|
| 47 | Create decorators.py File | Task 46 | Simple |
| 48 | Create cache_response Decorator | Task 47 | Complex |
| 49 | Add cache_key Parameter | Task 48 | Simple |
| 50 | Add timeout Parameter | Task 49 | Simple |
| 51 | Add vary_on_tenant | Task 50 | Medium |
| 52 | Add vary_on_user | Task 51 | Medium |
| 53 | Create cache_queryset Decorator | Task 52 | Complex |
| 54 | Create cache_method Decorator | Task 53 | Medium |
| 55 | Create utils.py File | Task 54 | Simple |
| 56 | Create make_cache_key Function | Task 55 | Medium |
| 57 | Create hash_key Function | Task 56 | Simple |
| 58 | Create cache_get_or_set | Task 57 | Medium |
| 59 | Create clear_cache Function | Task 58 | Simple |
| 60 | Create cache_stats Function | Task 59 | Medium |
| 61 | Export Decorators | Task 60 | Simple |
| 62 | Test Decorators | Task 61 | Medium |

---

## Execution Order

```
01_Tasks-47-52_Cache-Response-Decorator.md
        │
        ▼
02_Tasks-53-54_Additional-Decorators.md
        │
        ▼
03_Tasks-55-60_Utility-Functions.md
        │
        ▼
04_Tasks-61-62_Export-Test.md
```

---

## Expected Deliverables

After completing this group:

```
backend/apps/core/
├── cache/
│   ├── __init__.py           # Updated with decorator exports
│   ├── decorators.py         # cache_response, cache_queryset, cache_method
│   └── utils.py              # make_cache_key, hash_key, cache_get_or_set
└── tests/
    └── test_cache/
        └── test_decorators.py
```

---

## Notes for AI Agents

1. **functools.wraps:** Use to preserve function metadata
2. **vary_on_tenant:** Default True for tenant isolation
3. **Hash Keys:** MD5 hash for keys > 200 characters
4. **cache_response:** Works with DRF APIView and ViewSet
5. **cache_get_or_set:** Uses callable for lazy computation
6. **cache_stats:** Uses Redis INFO command
7. **Git Commit:** Commit after completing this group
