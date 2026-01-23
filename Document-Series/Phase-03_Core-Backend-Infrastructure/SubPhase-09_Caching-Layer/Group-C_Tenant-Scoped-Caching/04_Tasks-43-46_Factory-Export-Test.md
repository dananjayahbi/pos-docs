# Tasks 43-46: Factory, Export, and Testing

> **Phase:** 03 - Core Backend Infrastructure  
> **SubPhase:** 09 - Caching Layer  
> **Group:** C - Tenant-Scoped Caching  
> **Document:** 04 of 04  
> **Tasks Covered:** 43, 44, 45, 46

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [03_Tasks-39-42_Bulk-Counter-Operations.md](03_Tasks-39-42_Bulk-Counter-Operations.md)
- **→ Next Group:** [../Group-D_Cache-Decorators-Utilities/](../Group-D_Cache-Decorators-Utilities/)

---

## Document Overview

This document covers creating the get_tenant_cache factory function, handling no-tenant scenarios, exporting utilities, and writing unit tests.

### Tasks in This Document
| Task # | Task Name | Complexity |
|--------|-----------|------------|
| 43 | Create get_tenant_cache | Medium |
| 44 | Handle No Tenant Context | Medium |
| 45 | Export TenantCache | Simple |
| 46 | Test Tenant Cache | Medium |

---

## Task 43: Create get_tenant_cache

### Overview
Create a factory function that returns a configured TenantCache instance.

### Dependencies
- Task 42: Add decr Method

### Instructions

1. **Define get_tenant_cache function**
   - Add to tenant_cache.py
   - Accept cache_alias parameter (default: 'default')
   - Return TenantCache instance

2. **Create singleton pattern (optional)**
   - Cache TenantCache instances per alias
   - Avoid creating multiple instances
   - Use module-level dictionary

3. **Initialize TenantCache**
   - Create instance with specified alias
   - Return configured instance

4. **Add docstring**
   - Document function purpose
   - Provide usage examples
   - Note convenience over direct instantiation

### Usage Pattern
```
from apps.core.cache import get_tenant_cache

cache = get_tenant_cache()
cache.set('products:list', products)
value = cache.get('products:list')
```

### Verification
- get_tenant_cache function created
- Returns TenantCache instance
- Works with different cache aliases

---

## Task 44: Handle No Tenant Context

### Overview
Implement fallback behavior when no tenant context is available.

### Dependencies
- Task 43: Create get_tenant_cache

### Instructions

1. **Identify no-tenant scenarios**
   - Management commands
   - Celery tasks (sometimes)
   - Background jobs
   - Public pages

2. **Implement fallback in _get_tenant_schema**
   - Try to get tenant from connection
   - If no tenant, return 'public'
   - Or raise NoTenantError based on configuration

3. **Add configuration option**
   - CACHE_REQUIRE_TENANT setting
   - If True: raise error when no tenant
   - If False: use 'public' prefix

4. **Document shared cache usage**
   - Use 'public' schema for shared data
   - Example: country lists, system config
   - Note isolation from tenant data

5. **Add warning log**
   - Log when using public schema
   - Helps debugging cache issues
   - Can be disabled in production

### No-Tenant Fallback Options
| Option | Behavior | Use Case |
|--------|----------|----------|
| **Use 'public'** | tenant:public:key | Shared data caching |
| **Raise error** | Fail fast | Strict tenant isolation |
| **Use 'shared'** | shared:key | Clear separation |

### Verification
- No-tenant fallback implemented
- Configuration option available
- Documented behavior

---

## Task 45: Export TenantCache

### Overview
Export TenantCache class and get_tenant_cache function from cache module.

### Dependencies
- Task 44: Handle No Tenant Context

### Instructions

1. **Update __init__.py**
   - Import TenantCache class
   - Import get_tenant_cache function
   - Add to __all__ list

2. **Document exports**
   - Add module docstring
   - List all exported items
   - Provide usage examples

3. **Verify imports**
   - Test importing from apps.core.cache
   - Ensure clean import path
   - No circular imports

### __init__.py Exports
```
From cache module:
- SHORT_CACHE, MEDIUM_CACHE, LONG_CACHE
- TenantCache
- get_tenant_cache
```

### Verification
- TenantCache exported
- get_tenant_cache exported
- Imports work correctly

---

## Task 46: Test Tenant Cache

### Overview
Write comprehensive unit tests for TenantCache class.

### Dependencies
- Task 45: Export TenantCache

### Instructions

1. **Create test file**
   - Location: apps/core/tests/test_cache/test_tenant_cache.py
   - Create test_cache directory if needed

2. **Create test fixtures**
   - Mock tenant context
   - Create test cache backend
   - Set up test data

3. **Test make_key method**
   - Verify tenant prefix added
   - Test with different tenants
   - Test no-tenant fallback

4. **Test basic operations**
   - Test get/set/delete
   - Verify tenant isolation
   - Test cache hits and misses

5. **Test bulk operations**
   - Test get_many/set_many
   - Verify all keys prefixed

6. **Test counter operations**
   - Test incr/decr
   - Verify atomic operations

7. **Test pattern deletion**
   - Test delete_pattern
   - Verify correct keys deleted
   - Test pattern matching

8. **Test tenant isolation**
   - Set key in tenant A
   - Verify not visible in tenant B
   - Critical security test

9. **Test cache alias**
   - Test with different cache aliases
   - Verify correct cache used

10. **Add test documentation**
    - Document test coverage
    - Note tenant isolation verification
    - List test scenarios

### Key Test Scenarios
| Test | Purpose |
|------|---------|
| **Tenant Isolation** | Verify tenant A can't see tenant B's data |
| **No Tenant Fallback** | Test public schema usage |
| **Key Prefixing** | Verify all keys properly prefixed |
| **Bulk Operations** | Test get_many/set_many efficiency |
| **Pattern Deletion** | Test wildcard key deletion |
| **Counter Atomicity** | Verify incr/decr atomic |

### Verification
- Test file created
- All methods tested
- Tenant isolation verified
- Tests passing

---

## Expected Outcome After This Document

```
backend/apps/core/
├── cache/
│   ├── __init__.py           # Exports TenantCache, get_tenant_cache
│   ├── constants.py          # Timeout constants
│   └── tenant_cache.py       # Complete TenantCache class
└── tests/
    └── test_cache/
        ├── __init__.py
        └── test_tenant_cache.py  # Comprehensive tests
```

---

## Sri Lanka-Specific Considerations

- **Tenant Names:** Test with Sri Lankan business names
- **Character Encoding:** Test Sinhala/Tamil in tenant schemas
- **Isolation:** Critical for multi-tenant POS/ERP platform

---

## Notes for AI Agents

1. **Factory Pattern:** get_tenant_cache simplifies usage
2. **No Tenant:** 'public' prefix for shared data is common pattern
3. **Testing:** Tenant isolation test is most critical
4. **Exports:** Clean exports improve developer experience
5. **Git Commit:** Commit complete Group C implementation

---

## Validation Checklist

Before proceeding to the next group:

- [ ] get_tenant_cache function created
- [ ] No-tenant fallback implemented
- [ ] TenantCache exported
- [ ] get_tenant_cache exported
- [ ] Test file created
- [ ] All methods tested
- [ ] Tenant isolation verified
- [ ] Tests passing
- [ ] Documentation complete
- [ ] Changes committed to Git
- [ ] Group C complete

---

## Next Steps

After completing Group C:
1. **Git Commit:** Commit tenant-scoped caching implementation
2. **Proceed to Group D:** [Cache Decorators & Utilities](../Group-D_Cache-Decorators-Utilities/)
3. Implement cache decorators for views and methods
