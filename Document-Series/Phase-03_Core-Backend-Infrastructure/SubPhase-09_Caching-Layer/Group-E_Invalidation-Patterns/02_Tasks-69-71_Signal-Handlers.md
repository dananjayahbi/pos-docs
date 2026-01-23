# Tasks 69-71: Signal Handlers

> **Phase:** 03 - Core Backend Infrastructure  
> **SubPhase:** 09 - Caching Layer  
> **Group:** E - Invalidation Patterns  
> **Document:** 02 of 04  
> **Tasks Covered:** 69, 70, 71

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [01_Tasks-63-68_CacheInvalidator-Class.md](01_Tasks-63-68_CacheInvalidator-Class.md)
- **→ Next Document:** [03_Tasks-72-73_CacheMixin-Rules.md](03_Tasks-72-73_CacheMixin-Rules.md)

---

## Document Overview

This document covers implementation of Django signal handlers (post_save, post_delete) for automatic cache invalidation when models change.

### Tasks in This Document
| Task # | Task Name | Complexity |
|--------|-----------|------------|
| 69 | Create Model Signals | Medium |
| 70 | Create post_save Handler | Medium |
| 71 | Create post_delete Handler | Simple |

---

## Task 69: Create Model Signals

### Overview
Set up Django model signals for automatic cache invalidation.

### Dependencies
- Task 68: Add invalidate_related Method

### Instructions

1. **Create signals.py file**
   - Location: apps/core/cache/signals.py
   - Add module docstring

2. **Import Django signals**
   - Import post_save signal
   - Import post_delete signal
   - Import receiver decorator

3. **Import invalidation classes**
   - Import CacheInvalidator
   - Import get_tenant_cache

4. **Plan signal connection**
   - Connect to all models (or specific models)
   - Use weak=False for reliable connections
   - Document signal registration

### Signal Structure
```
signals.py contains:
├── Imports
├── post_save handler
├── post_delete handler
└── Signal connection instructions
```

### Verification
- signals.py created
- Signal imports configured

---

## Task 70: Create post_save Handler

### Overview
Implement post_save signal handler to invalidate cache when models are saved.

### Dependencies
- Task 69: Create Model Signals

### Instructions

1. **Define invalidate_on_save function**
   - Accept sender, instance, created, **kwargs
   - Invalidate appropriate caches

2. **Handle created vs updated**
   - If created: invalidate list caches
   - If updated: invalidate list and detail caches

3. **Invalidate model caches**
   - Call CacheInvalidator.invalidate_list()
   - Call CacheInvalidator.invalidate_detail() if updated

4. **Invalidate related models**
   - Call CacheInvalidator.invalidate_related()
   - Clear related model caches

5. **Use transaction.on_commit**
   - Wrap invalidation in on_commit
   - Ensures DB transaction complete
   - Prevents premature invalidation

6. **Connect signal**
   - Use @receiver decorator
   - Connect to post_save signal
   - Apply to specific models or all

7. **Add logging**
   - Log save events
   - Log invalidation operations

### Signal Handler Pattern
```
@receiver(post_save)
def invalidate_on_save(sender, instance, created, **kwargs):
    def do_invalidation():
        if created:
            CacheInvalidator.invalidate_list(sender)
        else:
            CacheInvalidator.invalidate_model(sender)
        CacheInvalidator.invalidate_related(sender, instance)
    
    transaction.on_commit(do_invalidation)
```

### Why transaction.on_commit?
- Waits for DB commit
- Prevents caching uncommitted data
- Handles rollbacks gracefully
- Critical for data consistency

### Verification
- post_save handler created
- Uses transaction.on_commit
- Invalidates appropriate caches

---

## Task 71: Create post_delete Handler

### Overview
Implement post_delete signal handler to invalidate cache when models are deleted.

### Dependencies
- Task 70: Create post_save Handler

### Instructions

1. **Define invalidate_on_delete function**
   - Accept sender, instance, **kwargs
   - Invalidate caches for deleted instance

2. **Invalidate model caches**
   - Clear list caches (deleted instance no longer in lists)
   - Clear detail cache for deleted instance
   - Clear search caches

3. **Invalidate related models**
   - Call invalidate_related()
   - Related models may reference deleted instance

4. **Use transaction.on_commit**
   - Same pattern as post_save
   - Wait for deletion to complete

5. **Connect signal**
   - Use @receiver decorator
   - Connect to post_delete signal

6. **Add logging**
   - Log deletion events
   - Log invalidation

### Delete Handler Pattern
```
@receiver(post_delete)
def invalidate_on_delete(sender, instance, **kwargs):
    def do_invalidation():
        CacheInvalidator.invalidate_model(sender)
        CacheInvalidator.invalidate_related(sender, instance)
    
    transaction.on_commit(do_invalidation)
```

### Verification
- post_delete handler created
- Invalidates caches on deletion
- Uses transaction.on_commit

---

## Expected Outcome After This Document

```
backend/apps/core/cache/
├── signals.py            # Signal handlers
    ├── invalidate_on_save
    └── invalidate_on_delete
```

---

## Signal Registration

Signals must be imported in app's ready() method:
```
class CoreConfig(AppConfig):
    def ready(self):
        import apps.core.cache.signals  # noqa
```

---

## Notes for AI Agents

1. **transaction.on_commit:** Critical for consistency
2. **Signal Connection:** Must import signals in AppConfig.ready()
3. **Performance:** Signal handlers should be fast
4. **Selective:** Can connect to specific models only
5. **Testing:** Test with DB transactions
6. **Git Commit:** Commit signal handlers

---

## Validation Checklist

- [ ] signals.py created
- [ ] post_save handler implemented
- [ ] post_delete handler implemented
- [ ] transaction.on_commit used
- [ ] Signals connected
- [ ] Logging configured
- [ ] Signal registration documented
- [ ] Changes committed to Git

---

## Next Steps

Proceed to [03_Tasks-72-73_CacheMixin-Rules.md](03_Tasks-72-73_CacheMixin-Rules.md) for CacheMixin implementation.
