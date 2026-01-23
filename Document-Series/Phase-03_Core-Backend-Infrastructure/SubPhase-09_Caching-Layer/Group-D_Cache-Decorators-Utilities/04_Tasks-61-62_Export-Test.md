# Tasks 61-62: Export and Testing

> **Phase:** 03 - Core Backend Infrastructure  
> **SubPhase:** 09 - Caching Layer  
> **Group:** D - Cache Decorators & Utilities  
> **Document:** 04 of 04  
> **Tasks Covered:** 61, 62

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [03_Tasks-55-60_Utility-Functions.md](03_Tasks-55-60_Utility-Functions.md)
- **→ Next Group:** [../Group-E_Invalidation-Patterns/](../Group-E_Invalidation-Patterns/)

---

## Document Overview

This document covers exporting cache decorators and utilities, and writing comprehensive tests for all decorator functionality.

### Tasks in This Document
| Task # | Task Name | Complexity |
|--------|-----------|------------|
| 61 | Export Decorators | Simple |
| 62 | Test Decorators | Medium |

---

## Task 61: Export Decorators

### Overview
Export all cache decorators and utility functions from the cache module for easy import throughout the application.

### Dependencies
- Task 60: Create cache_stats Function

### Instructions

1. **Update __init__.py exports**
   - Import all decorators
   - Import all utility functions
   - Add to __all__ list

2. **Export decorators**
   - cache_response
   - cache_queryset
   - cache_method

3. **Export utility functions**
   - make_cache_key
   - hash_key
   - cache_get_or_set
   - clear_cache
   - cache_stats

4. **Update module docstring**
   - List all exports
   - Provide usage examples for each
   - Note tenant scoping

5. **Verify import paths**
   - Test imports from apps.core.cache
   - Ensure no circular imports
   - Clean import statements

### Complete Export List
```
From apps.core.cache:

Constants:
- SHORT_CACHE, MEDIUM_CACHE, LONG_CACHE

Classes:
- TenantCache

Functions:
- get_tenant_cache

Decorators:
- cache_response
- cache_queryset
- cache_method

Utilities:
- make_cache_key
- hash_key
- cache_get_or_set
- clear_cache
- cache_stats
```

### Usage Example in Docstring
```
from apps.core.cache import (
    cache_response,
    MEDIUM_CACHE,
    get_tenant_cache,
    clear_cache
)

@cache_response(timeout=MEDIUM_CACHE)
def my_view(request):
    return Response(data)

cache = get_tenant_cache()
clear_cache('products:*')
```

### Verification
- All decorators exported
- All utilities exported
- Imports work correctly
- Documentation updated

---

## Task 62: Test Decorators

### Overview
Write comprehensive unit tests for all cache decorators and utility functions.

### Dependencies
- Task 61: Export Decorators

### Instructions

1. **Create test file**
   - Location: apps/core/tests/test_cache/test_decorators.py
   - Import test utilities
   - Set up test fixtures

2. **Test cache_response decorator**
   - Test basic response caching
   - Test with different timeouts
   - Test cache_key parameter
   - Test vary_on_tenant
   - Test vary_on_user
   - Test cache hits and misses

3. **Test cache_queryset decorator**
   - Test QuerySet caching
   - Test with filters and ordering
   - Test key generation
   - Verify results match query
   - Test cache invalidation

4. **Test cache_method decorator**
   - Test instance method caching
   - Test with different instances
   - Test with method arguments
   - Verify instance-specific caching
   - Test with model instances

5. **Test utility functions**
   - Test make_cache_key with various inputs
   - Test hash_key for long keys
   - Test cache_get_or_set lazy evaluation
   - Test clear_cache pattern matching
   - Test cache_stats retrieval

6. **Test edge cases**
   - Empty cache
   - Cache misses
   - Invalid keys
   - Long keys
   - Special characters
   - Concurrent access

7. **Test integration**
   - Multiple decorators together
   - Decorator with TenantCache
   - Cross-tenant isolation

8. **Add test documentation**
   - Document test scenarios
   - Note coverage percentages
   - List test dependencies

### Test Structure
```
test_decorators.py contains:
├── TestCacheResponseDecorator
│   ├── test_basic_caching
│   ├── test_custom_key
│   ├── test_timeout
│   ├── test_vary_on_tenant
│   └── test_vary_on_user
├── TestCacheQuerysetDecorator
│   ├── test_queryset_caching
│   ├── test_with_filters
│   └── test_key_generation
├── TestCacheMethodDecorator
│   ├── test_method_caching
│   ├── test_instance_specific
│   └── test_with_arguments
└── TestCacheUtilities
    ├── test_make_cache_key
    ├── test_hash_key
    ├── test_cache_get_or_set
    ├── test_clear_cache
    └── test_cache_stats
```

### Key Test Scenarios
| Test Category | Key Scenarios |
|--------------|---------------|
| **cache_response** | Basic caching, custom keys, tenant/user variation |
| **cache_queryset** | Query caching, filter handling, key generation |
| **cache_method** | Instance methods, arguments, model integration |
| **Utilities** | Key generation, hashing, get-or-set, stats |
| **Integration** | Multiple decorators, tenant isolation |

### Test Fixtures Needed
```
Fixtures:
- Mock request objects
- Test user instances
- Test tenant contexts
- Sample QuerySets
- Model instances
- Cache backend (LocMemCache for tests)
```

### Verification
- All decorators tested
- All utilities tested
- Edge cases covered
- Integration tests passing
- Test coverage > 90%
- Documentation complete

---

## Expected Outcome After This Document

```
backend/apps/core/
├── cache/
│   ├── __init__.py           # All exports configured
│   ├── constants.py
│   ├── tenant_cache.py
│   ├── decorators.py         # Complete
│   └── utils.py              # Complete
└── tests/
    └── test_cache/
        ├── __init__.py
        ├── test_tenant_cache.py
        └── test_decorators.py    # Comprehensive tests
```

---

## Sri Lanka-Specific Considerations

- **Decorator Usage:** Test with Sri Lankan tenant data
- **Unicode:** Test with Sinhala/Tamil in keys and data
- **Performance:** Verify decorator overhead acceptable

---

## Notes for AI Agents

1. **Clean Exports:** Well-organized __init__.py improves DX
2. **Test Coverage:** High coverage critical for cache reliability
3. **Integration Tests:** Test decorator combinations
4. **Documentation:** Export docstring guides usage
5. **Git Commit:** Commit complete Group D implementation

---

## Validation Checklist

Before proceeding to the next group:

- [ ] All decorators exported in __init__.py
- [ ] All utilities exported in __init__.py
- [ ] __all__ list updated
- [ ] Module docstring updated with examples
- [ ] test_decorators.py created
- [ ] cache_response tests complete
- [ ] cache_queryset tests complete
- [ ] cache_method tests complete
- [ ] Utility function tests complete
- [ ] Integration tests passing
- [ ] Test coverage > 90%
- [ ] Documentation complete
- [ ] Changes committed to Git
- [ ] Group D complete

---

## Next Steps

After completing Group D:
1. **Git Commit:** Commit cache decorators and utilities
2. **Proceed to Group E:** [Invalidation Patterns](../Group-E_Invalidation-Patterns/)
3. Implement cache invalidation with Django signals
