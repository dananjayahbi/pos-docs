# Tasks 31-34: TenantCache Core Implementation

> **Phase:** 03 - Core Backend Infrastructure  
> **SubPhase:** 09 - Caching Layer  
> **Group:** C - Tenant-Scoped Caching  
> **Document:** 01 of 04  
> **Tasks Covered:** 31, 32, 33, 34

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Group:** [../Group-B_Cache-Backend-Configuration/](../Group-B_Cache-Backend-Configuration/)
- **→ Next Document:** [02_Tasks-35-38_Basic-Operations.md](02_Tasks-35-38_Basic-Operations.md)

---

## Document Overview

This document covers the core implementation of the TenantCache class, which provides tenant-aware caching with automatic key prefixing for multi-tenant data isolation.

### Tasks in This Document
| Task # | Task Name | Complexity |
|--------|-----------|------------|
| 31 | Create cache Module | Simple |
| 32 | Create cache __init__.py | Simple |
| 33 | Create TenantCache Class | Medium |
| 34 | Add make_key Method | Medium |

---

## Task 31: Create cache Module

### Overview
Create the cache module structure within apps/core/ for tenant-aware caching functionality.

### Dependencies
- Task 30: Define LONG_CACHE (Group B)

### Instructions

1. **Verify module exists**
   - Module created in Task 27
   - Location: apps/core/cache/

2. **Plan module files**
   - __init__.py: Exports
   - constants.py: Timeout constants (exists)
   - tenant_cache.py: TenantCache class (new)
   - decorators.py: Cache decorators (Group D)
   - utils.py: Utility functions (Group D)
   - invalidation.py: Invalidation logic (Group E)

3. **Document module purpose**
   - Update __init__.py docstring
   - Describe tenant-scoped caching
   - Reference multi-tenancy isolation

### Module Structure
```
apps/core/cache/
├── __init__.py           # Exports
├── constants.py          # Timeout constants
└── tenant_cache.py       # TenantCache class (create now)
```

### Verification
- cache module exists
- Structure planned
- Purpose documented

---

## Task 32: Create cache __init__.py

### Overview
Update the cache module __init__.py to export caching utilities.

### Dependencies
- Task 31: Create cache Module

### Instructions

1. **Update existing __init__.py**
   - Already created in Task 27
   - Add more exports

2. **Export timeout constants**
   - Already exports SHORT_CACHE, MEDIUM_CACHE, LONG_CACHE
   - Verify exports working

3. **Plan future exports**
   - TenantCache class (Task 33)
   - get_tenant_cache function (Task 43)
   - Cache decorators (Group D)
   - Add TODO comments for future exports

4. **Add module docstring**
   - Describe cache module features
   - List exported items
   - Provide usage examples

### Export Plan
```
__init__.py exports:
├── From constants: SHORT_CACHE, MEDIUM_CACHE, LONG_CACHE
├── From tenant_cache: TenantCache, get_tenant_cache (add later)
├── From decorators: cache_response, etc (Group D)
└── From utils: utility functions (Group D)
```

### Verification
- __init__.py updated
- Constants exported
- Future exports planned

---

## Task 33: Create TenantCache Class

### Overview
Create the TenantCache class that wraps Django's cache with tenant-aware key management.

### Dependencies
- Task 32: Create cache __init__.py

### Instructions

1. **Create tenant_cache.py file**
   - Location: apps/core/cache/tenant_cache.py
   - Add module docstring

2. **Import required modules**
   - Import Django cache framework
   - Import connection for tenant context
   - Import logging for debug

3. **Define TenantCache class**
   - Inherits from object (or no parent)
   - Wraps Django cache operations
   - Adds tenant scoping to keys

4. **Add __init__ method**
   - Accept cache_alias parameter (default: 'default')
   - Store cache backend reference
   - Initialize logger

5. **Store cache backend**
   - Get cache from Django caches
   - Store as instance variable
   - Handle cache not found error

6. **Add _get_tenant_schema method**
   - Extract current tenant from connection
   - Return tenant schema_name
   - Handle no tenant context (public schema)

7. **Document tenant isolation**
   - Explain key prefixing approach
   - Document format: lcc:tenant:{schema}:{key}
   - Note benefits of isolation

### TenantCache Class Structure
```
class TenantCache:
    def __init__(self, cache_alias='default'):
        # Initialize cache backend
        
    def _get_tenant_schema(self):
        # Get current tenant schema
        
    def make_key(self, key):
        # Generate tenant-prefixed key
        
    # Additional methods in next tasks
```

### Key Format
```
Format: lcc:tenant:{schema_name}:{key}

Examples:
lcc:tenant:acme_store:products:list
lcc:tenant:acme_store:products:detail:123
lcc:tenant:fashion_lk:categories:tree
```

### Verification
- tenant_cache.py created
- TenantCache class defined
- __init__ method implemented
- _get_tenant_schema method implemented

---

## Task 34: Add make_key Method

### Overview
Implement the make_key method that generates tenant-prefixed cache keys for data isolation.

### Dependencies
- Task 33: Create TenantCache Class

### Instructions

1. **Define make_key method**
   - Accept key parameter
   - Return tenant-prefixed key
   - Handle string and non-string keys

2. **Get tenant schema**
   - Call _get_tenant_schema()
   - Get current tenant identifier

3. **Build tenant key**
   - Format: f"tenant:{schema}:{key}"
   - Use tenant schema as prefix
   - Maintain original key structure

4. **Handle no tenant context**
   - Use "public" schema for shared data
   - Or raise error if tenant required
   - Document fallback behavior

5. **Handle long keys**
   - Check key length
   - If > 200 chars, hash the key part
   - Keep tenant prefix readable

6. **Add key validation**
   - Ensure key is string
   - Convert if necessary
   - Handle special characters

7. **Document key format**
   - Add docstring with examples
   - Explain tenant isolation
   - Note Redis key best practices

8. **Add logging**
   - Log generated keys (debug level)
   - Help debugging cache issues
   - Include tenant and original key

### make_key Implementation Logic
```
make_key logic:
├── Get tenant schema from connection
├── Handle no tenant (use "public" or error)
├── Convert key to string if needed
├── Build: f"tenant:{schema}:{key}"
├── Check length (hash if > 200 chars)
├── Log generated key (debug)
└── Return tenant-prefixed key
```

### Key Length Handling
| Key Length | Action | Example |
|------------|--------|---------|
| **< 200 chars** | Use as-is | tenant:acme:products:list |
| **> 200 chars** | Hash key part | tenant:acme:hash:md5_hash |
| **Special chars** | Sanitize | Replace spaces, special chars |

### Tenant Context Scenarios
| Scenario | Tenant Schema | Generated Key |
|----------|--------------|---------------|
| **Normal request** | acme_store | tenant:acme_store:products:list |
| **Public schema** | public | tenant:public:countries:list |
| **No tenant** | None | shared:countries:list OR error |

### Verification
- make_key method implemented
- Tenant schema extraction works
- Key prefixing correct
- Long key handling implemented
- No tenant fallback defined
- Logging added

---

## Expected Outcome After This Document

```
backend/apps/core/cache/
├── __init__.py
├── constants.py
└── tenant_cache.py       # TenantCache class with make_key
```

### TenantCache Class Status
```
TenantCache class has:
├── __init__(cache_alias)
├── _get_tenant_schema()
└── make_key(key)
```

---

## Sri Lanka-Specific Considerations

- **Tenant Naming:** Schema names may include Sri Lankan business names (Sinhala transliterations)
- **Key Format:** Ensure UTF-8 support for tenant identifiers
- **Isolation:** Critical for multi-tenant SaaS serving Sri Lankan SMEs

---

## Notes for AI Agents

1. **Tenant Context:** Always available in request context via django-tenants
2. **Key Format:** Consistent format critical for pattern-based invalidation
3. **Public Schema:** Use for data shared across all tenants
4. **Logging:** Debug logging helps troubleshoot tenant isolation issues
5. **Testing:** Test with multiple tenants to ensure isolation
6. **Git Commit:** Commit TenantCache core implementation

---

## Validation Checklist

Before proceeding to the next document:

- [ ] tenant_cache.py file created
- [ ] TenantCache class defined
- [ ] __init__ method implemented
- [ ] _get_tenant_schema method works
- [ ] make_key method implemented
- [ ] Tenant prefixing works correctly
- [ ] Long key handling implemented
- [ ] No tenant fallback defined
- [ ] Logging added
- [ ] Class imports successfully
- [ ] Changes committed to Git

---

## Next Steps

Proceed to [02_Tasks-35-38_Basic-Operations.md](02_Tasks-35-38_Basic-Operations.md) to implement basic cache operations (get, set, delete, delete_pattern).
