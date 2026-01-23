# Tasks 74-76: Management Command and Testing

> **Phase:** 03 - Core Backend Infrastructure  
> **SubPhase:** 09 - Caching Layer  
> **Group:** E - Invalidation Patterns  
> **Document:** 04 of 04  
> **Tasks Covered:** 74, 75, 76

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [03_Tasks-72-73_CacheMixin-Rules.md](03_Tasks-72-73_CacheMixin-Rules.md)
- **→ Next Group:** [../Group-F_Testing-Documentation/](../Group-F_Testing-Documentation/)

---

## Document Overview

This document covers creating management commands for cache clearing and comprehensive invalidation testing.

### Tasks in This Document
| Task # | Task Name | Complexity |
|--------|-----------|------------|
| 74 | Create invalidate_tenant_cache | Medium |
| 75 | Create Management Command | Medium |
| 76 | Test Invalidation | Medium |

---

## Task 74: Create invalidate_tenant_cache

### Overview
Create a utility function to invalidate all cache for a specific tenant.

### Dependencies
- Task 73: Define Invalidation Rules

### Instructions

1. **Add to invalidation.py**
   - Define invalidate_tenant_cache function
   - Accept tenant schema parameter

2. **Clear all tenant keys**
   - Use pattern: tenant:{schema}:*
   - Delete all matching keys

3. **Return count**
   - Return number of keys deleted
   - Log operation

4. **Add safety check**
   - Confirm tenant exists
   - Prevent accidental deletion

### Usage
```
invalidate_tenant_cache('acme_store')
# Clears all cache for acme_store tenant
```

### Verification
- invalidate_tenant_cache function created
- Clears all tenant caches

---

## Task 75: Create Management Command

### Overview
Create clearcache management command for manual cache clearing from command line.

### Dependencies
- Task 74: Create invalidate_tenant_cache

### Instructions

1. **Create command file**
   - Location: apps/core/management/commands/clearcache.py
   - Inherit from BaseCommand

2. **Add command arguments**
   - --tenant: Clear specific tenant cache
   - --model: Clear specific model cache
   - --pattern: Clear by pattern
   - --all: Clear all cache

3. **Implement handle method**
   - Parse arguments
   - Call appropriate clear function
   - Display results

4. **Add confirmation for --all**
   - Prompt user to confirm
   - Prevent accidental full clear
   - Use --no-input for scripts

5. **Display summary**
   - Show what was cleared
   - Show count of keys
   - Show success/failure

### Command Usage Examples
```
# Clear specific tenant
python manage.py clearcache --tenant acme_store

# Clear specific model
python manage.py clearcache --model Product

# Clear by pattern
python manage.py clearcache --pattern "Product:list*"

# Clear all cache
python manage.py clearcache --all --no-input
```

### Verification
- clearcache command created
- All options work
- Confirmation for --all

---

## Task 76: Test Invalidation

### Overview
Write comprehensive tests for cache invalidation patterns.

### Dependencies
- Task 75: Create Management Command

### Instructions

1. **Create test file**
   - Location: apps/core/tests/test_cache/test_invalidation.py

2. **Test CacheInvalidator methods**
   - Test invalidate_model
   - Test invalidate_list
   - Test invalidate_detail
   - Test invalidate_related

3. **Test signal handlers**
   - Test post_save invalidation
   - Test post_delete invalidation
   - Test transaction.on_commit behavior

4. **Test CacheMixin**
   - Test mixin attributes
   - Test invalidate_cache method
   - Test custom rules

5. **Test management command**
   - Test each command option
   - Test output
   - Test confirmation

6. **Test invalidation scenarios**
   - Create model: list cache cleared
   - Update model: list + detail cleared
   - Delete model: all caches cleared
   - Related models: related caches cleared

7. **Test edge cases**
   - No cache present
   - Invalid model
   - Circular relationships
   - Transaction rollback

### Test Structure
```
test_invalidation.py:
├── TestCacheInvalidator
│   ├── test_invalidate_model
│   ├── test_invalidate_list
│   ├── test_invalidate_detail
│   └── test_invalidate_related
├── TestSignalHandlers
│   ├── test_post_save
│   ├── test_post_delete
│   └── test_transaction_commit
├── TestCacheMixin
│   ├── test_mixin_attributes
│   ├── test_invalidate_cache
│   └── test_custom_rules
└── TestManagementCommand
    ├── test_clear_tenant
    ├── test_clear_model
    └── test_clear_all
```

### Verification
- All invalidation tests pass
- Signal behavior verified
- Mixin tested
- Command tested

---

## Expected Outcome After This Document

```
backend/apps/core/
├── cache/
│   └── invalidation.py       # + invalidate_tenant_cache
├── management/
│   └── commands/
│       └── clearcache.py     # Management command
└── tests/
    └── test_cache/
        └── test_invalidation.py  # Comprehensive tests
```

---

## Notes for AI Agents

1. **Management Command:** Useful for deployments and debugging
2. **invalidate_tenant_cache:** Use carefully, clears all tenant data
3. **Testing:** Verify transaction.on_commit behavior
4. **Git Commit:** Commit complete Group E implementation

---

## Validation Checklist

- [ ] invalidate_tenant_cache function created
- [ ] clearcache management command created
- [ ] All command options work
- [ ] test_invalidation.py created
- [ ] CacheInvalidator tested
- [ ] Signal handlers tested
- [ ] CacheMixin tested
- [ ] Management command tested
- [ ] All tests passing
- [ ] Changes committed to Git
- [ ] Group E complete

---

## Next Steps

After completing Group E:
1. **Git Commit:** Commit invalidation patterns implementation
2. **Proceed to Group F:** [Testing & Documentation](../Group-F_Testing-Documentation/)
3. Complete final testing and documentation
