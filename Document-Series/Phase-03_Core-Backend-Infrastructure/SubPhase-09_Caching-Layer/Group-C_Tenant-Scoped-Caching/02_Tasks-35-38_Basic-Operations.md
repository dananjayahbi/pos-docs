# Tasks 35-38: Basic Operations

> **Phase:** 03 - Core Backend Infrastructure  
> **SubPhase:** 09 - Caching Layer  
> **Group:** C - Tenant-Scoped Caching  
> **Document:** 02 of 04  
> **Tasks Covered:** 35, 36, 37, 38

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [01_Tasks-31-34_TenantCache-Core.md](01_Tasks-31-34_TenantCache-Core.md)
- **→ Next Document:** [03_Tasks-39-42_Bulk-Counter-Operations.md](03_Tasks-39-42_Bulk-Counter-Operations.md)

---

## Document Overview

This document covers implementation of basic TenantCache operations: get, set, delete, and pattern-based deletion.

### Tasks in This Document
| Task # | Task Name | Complexity |
|--------|-----------|------------|
| 35 | Add get Method | Simple |
| 36 | Add set Method | Simple |
| 37 | Add delete Method | Simple |
| 38 | Add delete_pattern Method | Medium |

---

## Task 35: Add get Method

### Overview
Implement the get method for retrieving cached values with tenant scoping.

### Dependencies
- Task 34: Add make_key Method

### Instructions

1. **Define get method**
   - Accept key and default parameters
   - Wrap Django cache.get()
   - Apply tenant prefix automatically

2. **Generate tenant key**
   - Call self.make_key(key)
   - Get tenant-prefixed version

3. **Retrieve from cache**
   - Call cache.get(tenant_key, default)
   - Return cached value or default

4. **Add method signature**
   - Same as Django cache API
   - get(key, default=None)

5. **Add docstring**
   - Document parameters
   - Provide usage examples
   - Note tenant scoping

### Verification
- get method implemented
- Returns cached values
- Applies tenant prefix
- Handles cache misses

---

## Task 36: Add set Method

### Overview
Implement the set method for storing values in cache with tenant scoping.

### Dependencies
- Task 35: Add get Method

### Instructions

1. **Define set method**
   - Accept key, value, timeout parameters
   - Wrap Django cache.set()

2. **Generate tenant key**
   - Call self.make_key(key)

3. **Store in cache**
   - Call cache.set(tenant_key, value, timeout)

4. **Handle timeout**
   - Support None (no expiration)
   - Support integer seconds
   - Support timeout constants

5. **Return status**
   - Return True on success
   - Match Django cache API

### Verification
- set method implemented
- Stores values with tenant prefix
- Timeout parameter works

---

## Task 37: Add delete Method

### Overview
Implement the delete method for removing cached values.

### Dependencies
- Task 36: Add set Method

### Instructions

1. **Define delete method**
   - Accept key parameter
   - Wrap Django cache.delete()

2. **Generate tenant key**
   - Call self.make_key(key)

3. **Delete from cache**
   - Call cache.delete(tenant_key)

4. **Return status**
   - Return True if deleted
   - Return False if key didn't exist

### Verification
- delete method implemented
- Removes tenant-scoped keys
- Returns appropriate status

---

## Task 38: Add delete_pattern Method

### Overview
Implement pattern-based deletion for clearing multiple keys matching a pattern.

### Dependencies
- Task 37: Add delete Method

### Instructions

1. **Define delete_pattern method**
   - Accept pattern parameter
   - Delete all keys matching pattern
   - Apply tenant scoping

2. **Build tenant pattern**
   - Prefix pattern with tenant scope
   - Format: f"tenant:{schema}:{pattern}"

3. **Use Redis SCAN command**
   - Iterate keys matching pattern
   - Never use KEYS command (blocks Redis)
   - Use SCAN for production safety

4. **Delete matched keys**
   - Iterate over matched keys
   - Delete each key
   - Count deletions

5. **Return count**
   - Return number of keys deleted
   - Log deletion count

6. **Add warning comment**
   - Note SCAN is cursor-based
   - Document Redis version requirement
   - Warn about performance on large datasets

### Pattern Examples
```
Pattern usage:
delete_pattern('products:*')     # All product keys
delete_pattern('products:list')  # Specific list key
delete_pattern('user:*:profile') # All user profiles
```

### Verification
- delete_pattern method implemented
- Uses SCAN not KEYS
- Applies tenant scoping
- Returns deletion count

---

## Expected Outcome
TenantCache class now has get, set, delete, delete_pattern methods with tenant isolation.

---

## Next Steps
Proceed to [03_Tasks-39-42_Bulk-Counter-Operations.md](03_Tasks-39-42_Bulk-Counter-Operations.md) for bulk operations and counters.
