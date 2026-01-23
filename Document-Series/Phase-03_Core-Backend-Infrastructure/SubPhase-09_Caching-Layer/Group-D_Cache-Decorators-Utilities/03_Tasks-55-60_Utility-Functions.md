# Tasks 55-60: Utility Functions

> **Phase:** 03 - Core Backend Infrastructure  
> **SubPhase:** 09 - Caching Layer  
> **Group:** D - Cache Decorators & Utilities  
> **Document:** 03 of 04  
> **Tasks Covered:** 55, 56, 57, 58, 59, 60

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [02_Tasks-53-54_Additional-Decorators.md](02_Tasks-53-54_Additional-Decorators.md)
- **→ Next Document:** [04_Tasks-61-62_Export-Test.md](04_Tasks-61-62_Export-Test.md)

---

## Document Overview

This document covers implementation of cache utility functions for key generation, hashing, get-or-set pattern, cache clearing, and statistics.

### Tasks in This Document
| Task # | Task Name | Complexity |
|--------|-----------|------------|
| 55 | Create utils.py File | Simple |
| 56 | Create make_cache_key Function | Medium |
| 57 | Create hash_key Function | Simple |
| 58 | Create cache_get_or_set | Medium |
| 59 | Create clear_cache Function | Simple |
| 60 | Create cache_stats Function | Medium |

---

## Task 55: Create utils.py File

### Overview
Create the utils module for cache utility functions.

### Dependencies
- Task 54: Create cache_method Decorator

### Instructions

1. **Create utils.py**
   - Location: apps/core/cache/utils.py
   - Add module docstring

2. **Import required modules**
   - Import hashlib for key hashing
   - Import TenantCache
   - Import logging

3. **Document utility patterns**
   - Explain each utility purpose
   - Provide usage examples

### Verification
- utils.py created
- Imports configured

---

## Task 56: Create make_cache_key Function

### Overview
Implement make_cache_key function for generating standardized cache keys from components.

### Dependencies
- Task 55: Create utils.py File

### Instructions

1. **Define make_cache_key function**
   - Accept variable arguments
   - Join components with colons
   - Return formatted key

2. **Handle different types**
   - Convert non-strings to strings
   - Handle None values
   - Handle lists/tuples

3. **Apply key length limit**
   - Check if key > 200 chars
   - Call hash_key if too long
   - Return manageable key

4. **Add validation**
   - Ensure no empty components
   - Remove invalid characters
   - Sanitize input

### Usage
```
make_cache_key('products', 'list', category_id)
# Returns: 'products:list:5'

make_cache_key('user', user.id, 'permissions')
# Returns: 'user:123:permissions'
```

### Verification
- make_cache_key function created
- Handles various input types
- Limits key length

---

## Task 57: Create hash_key Function

### Overview
Implement hash_key function for hashing long cache keys into fixed-length identifiers.

### Dependencies
- Task 56: Create make_cache_key Function

### Instructions

1. **Define hash_key function**
   - Accept key string
   - Return MD5 hash

2. **Use MD5 hashing**
   - Fast hashing algorithm
   - 32-character hex output
   - Sufficient for cache keys

3. **Preserve prefix**
   - Keep first part readable
   - Hash remaining part
   - Format: prefix:hash:md5_value

4. **Add comment about collisions**
   - MD5 collision unlikely for cache keys
   - Document assumption
   - Note alternatives if needed

### Usage
```
hash_key('very:long:key:with:many:components:...')
# Returns: 'very:long:key:hash:a1b2c3d4...'
```

### Verification
- hash_key function created
- Returns fixed-length hash
- Preserves readability

---

## Task 58: Create cache_get_or_set

### Overview
Implement cache_get_or_set function for lazy cache computation (get from cache or compute and set).

### Dependencies
- Task 57: Create hash_key Function

### Instructions

1. **Define cache_get_or_set function**
   - Accept key, callable, timeout
   - Get from cache or call function
   - Cache result before returning

2. **Try to get from cache**
   - Use TenantCache.get()
   - If hit: return value
   - If miss: continue to compute

3. **Call callable if miss**
   - Execute provided callable
   - Pass any args/kwargs
   - Get computed value

4. **Cache computed value**
   - Use TenantCache.set()
   - Set with specified timeout
   - Then return value

5. **Handle exceptions**
   - Don't cache exceptions
   - Log errors
   - Return computed value even if caching fails

### Usage
```
def expensive_calculation():
    return sum(range(1000000))

result = cache_get_or_set(
    'expensive:sum',
    expensive_calculation,
    timeout=LONG_CACHE
)
```

### Verification
- cache_get_or_set function created
- Lazy evaluation works
- Caches computed results

---

## Task 59: Create clear_cache Function

### Overview
Implement clear_cache function for manually clearing cache by pattern or key.

### Dependencies
- Task 58: Create cache_get_or_set

### Instructions

1. **Define clear_cache function**
   - Accept pattern or specific key
   - Clear matching keys
   - Return count of cleared keys

2. **Support patterns**
   - Use TenantCache.delete_pattern()
   - Support wildcard matching
   - Apply tenant scoping

3. **Support specific keys**
   - Use TenantCache.delete()
   - Delete single key
   - Return success status

4. **Add logging**
   - Log cache clearing operations
   - Include pattern and count
   - Help debugging

5. **Document usage**
   - Explain pattern syntax
   - Provide examples
   - Note tenant scoping

### Usage
```
# Clear all product cache
clear_cache('products:*')

# Clear specific key
clear_cache('products:list')

# Clear user-specific cache
clear_cache(f'user:{user_id}:*')
```

### Verification
- clear_cache function created
- Pattern clearing works
- Logs operations

---

## Task 60: Create cache_stats Function

### Overview
Implement cache_stats function for retrieving Redis cache statistics.

### Dependencies
- Task 59: Create clear_cache Function

### Instructions

1. **Define cache_stats function**
   - Connect to Redis
   - Get INFO statistics
   - Return relevant metrics

2. **Extract key metrics**
   - Used memory
   - Total keys
   - Hit rate
   - Evicted keys
   - Connected clients

3. **Calculate derived metrics**
   - Hit rate percentage
   - Memory usage MB
   - Keys per database

4. **Format output**
   - Return dictionary
   - Human-readable values
   - Include units

5. **Handle errors**
   - Catch connection errors
   - Return empty dict on failure
   - Log errors

### Stats Output Example
```
{
    'used_memory_mb': 25.6,
    'total_keys': 1523,
    'hit_rate': 0.87,
    'evicted_keys': 12,
    'connected_clients': 5,
    'uptime_days': 15
}
```

### Verification
- cache_stats function created
- Returns Redis metrics
- Handles errors gracefully

---

## Expected Outcome After This Document

```
backend/apps/core/cache/
├── utils.py              # Utility functions
    ├── make_cache_key
    ├── hash_key
    ├── cache_get_or_set
    ├── clear_cache
    └── cache_stats
```

---

## Sri Lanka-Specific Considerations

- **Cache Stats:** Monitor cache performance for Sri Lankan traffic patterns
- **Clear Cache:** Useful for price updates in LKR
- **Key Generation:** Support Sinhala/Tamil in identifiers

---

## Notes for AI Agents

1. **make_cache_key:** Standardizes key format across application
2. **hash_key:** Use MD5 for speed; collisions extremely rare
3. **cache_get_or_set:** Prevents cache stampede
4. **clear_cache:** Manual invalidation utility
5. **cache_stats:** Monitoring and debugging tool
6. **Git Commit:** Commit utility functions

---

## Validation Checklist

Before proceeding to the next document:

- [ ] utils.py file created
- [ ] make_cache_key function implemented
- [ ] hash_key function implemented
- [ ] cache_get_or_set function implemented
- [ ] clear_cache function implemented
- [ ] cache_stats function implemented
- [ ] All functions tested
- [ ] Documentation complete
- [ ] Changes committed to Git

---

## Next Steps

Proceed to [04_Tasks-61-62_Export-Test.md](04_Tasks-61-62_Export-Test.md) to export decorators and write tests.
