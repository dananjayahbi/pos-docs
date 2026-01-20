# Group E: Invalidation Patterns

> **Phase:** 03 - Core Backend Infrastructure  
> **SubPhase:** 09 - Caching Layer  
> **Group:** E of F  
> **Tasks Covered:** 63-76  
> **Group Goal:** Implement cache invalidation patterns using signals

---

## Navigation

- **↑ Parent:** [../00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [../Group-D_Cache-Decorators-Utilities/](../Group-D_Cache-Decorators-Utilities/)
- **→ Next Group:** [../Group-F_Testing-Documentation/](../Group-F_Testing-Documentation/)

---

## Group Overview

This group implements cache invalidation patterns to ensure cache consistency when data changes. Using Django signals, cache entries are automatically invalidated when models are created, updated, or deleted, preventing stale data from being served.

### Key Outcomes
- CacheInvalidator class for managing invalidation
- Model, list, detail, and related cache invalidation
- Django signals for automatic invalidation
- CacheMixin for models requiring caching
- Management command for manual cache clearing
- Per-model invalidation rules defined

### Technology Context
- **Module:** apps/core/cache/invalidation.py
- **Signals:** post_save, post_delete
- **Mixin:** CacheMixin for model auto-invalidation
- **Command:** python manage.py clearcache

---

## Documents in This Group

| # | Document | Tasks | Description |
|---|----------|-------|-------------|
| 01 | 01_Tasks-63-68_CacheInvalidator-Class.md | 63-68 | Create invalidation.py, CacheInvalidator class, invalidate_model, list, detail, related methods |
| 02 | 02_Tasks-69-71_Signal-Handlers.md | 69-71 | Create model signals module, post_save handler, post_delete handler |
| 03 | 03_Tasks-72-73_CacheMixin-Rules.md | 72-73 | Create CacheMixin for models, define invalidation rules |
| 04 | 04_Tasks-74-76_Management-Command-Test.md | 74-76 | Create invalidate_tenant_cache, clearcache management command, invalidation tests |

---

## Task Summary

| Task # | Task Name | Dependencies | Complexity |
|--------|-----------|--------------|------------|
| 63 | Create invalidation.py File | Task 62 | Simple |
| 64 | Create CacheInvalidator Class | Task 63 | Medium |
| 65 | Add invalidate_model Method | Task 64 | Medium |
| 66 | Add invalidate_list Method | Task 65 | Simple |
| 67 | Add invalidate_detail Method | Task 66 | Simple |
| 68 | Add invalidate_related Method | Task 67 | Complex |
| 69 | Create Model Signals | Task 68 | Medium |
| 70 | Create post_save Handler | Task 69 | Medium |
| 71 | Create post_delete Handler | Task 70 | Simple |
| 72 | Create CacheMixin for Models | Task 71 | Complex |
| 73 | Define Invalidation Rules | Task 72 | Medium |
| 74 | Create invalidate_tenant_cache | Task 73 | Medium |
| 75 | Create Management Command | Task 74 | Medium |
| 76 | Test Invalidation | Task 75 | Medium |

---

## Execution Order

```
01_Tasks-63-68_CacheInvalidator-Class.md
        │
        ▼
02_Tasks-69-71_Signal-Handlers.md
        │
        ▼
03_Tasks-72-73_CacheMixin-Rules.md
        │
        ▼
04_Tasks-74-76_Management-Command-Test.md
```

---

## Expected Deliverables

After completing this group:

```
backend/apps/core/
├── cache/
│   ├── __init__.py           # Updated with invalidation exports
│   ├── invalidation.py       # CacheInvalidator class
│   └── signals.py            # post_save, post_delete handlers
├── mixins/
│   └── cache_mixin.py        # CacheMixin for models
├── management/
│   └── commands/
│       └── clearcache.py     # Cache clearing command
└── tests/
    └── test_cache/
        └── test_invalidation.py
```

---

## Notes for AI Agents

1. **Signal Connection:** Use weak=False for signal connections
2. **CacheMixin:** Define cache_key_prefix and related_models
3. **transaction.on_commit:** Use for safe invalidation
4. **clearcache Flags:** Support --tenant and --model options
5. **Bulk Operations:** Handle bulk_update signal
6. **Logging:** Log invalidation operations for debugging
7. **Git Commit:** Commit after completing this group
