# Tasks 47-52: Cache Response Decorator

> **Phase:** 03 - Core Backend Infrastructure  
> **SubPhase:** 09 - Caching Layer  
> **Group:** D - Cache Decorators & Utilities  
> **Document:** 01 of 04  
> **Tasks Covered:** 47, 48, 49, 50, 51, 52

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Group:** [../Group-C_Tenant-Scoped-Caching/](../Group-C_Tenant-Scoped-Caching/)
- **→ Next Document:** [02_Tasks-53-54_Additional-Decorators.md](02_Tasks-53-54_Additional-Decorators.md)

---

## Document Overview

This document covers implementation of the cache_response decorator for caching view responses with tenant and user variation support.

### Tasks in This Document
| Task # | Task Name | Complexity |
|--------|-----------|------------|
| 47 | Create decorators.py File | Simple |
| 48 | Create cache_response Decorator | Complex |
| 49 | Add cache_key Parameter | Simple |
| 50 | Add timeout Parameter | Simple |
| 51 | Add vary_on_tenant | Medium |
| 52 | Add vary_on_user | Medium |

---

## Task 47: Create decorators.py File

### Overview
Create the decorators module for cache decorators.

### Dependencies
- Task 46: Test Tenant Cache (Group C)

### Instructions

1. **Create decorators.py**
   - Location: apps/core/cache/decorators.py
   - Add module docstring

2. **Import required modules**
   - Import functools for wraps
   - Import TenantCache
   - Import timeout constants

3. **Document decorator patterns**
   - Explain decorator usage
   - Provide examples
   - Note DRF compatibility

### Verification
- decorators.py created
- Imports configured
- Documented

---

## Task 48: Create cache_response Decorator

### Overview
Implement the main cache_response decorator for caching view responses.

### Dependencies
- Task 47: Create decorators.py File

### Instructions

1. **Define cache_response function**
   - Accept configuration parameters
   - Return decorator function
   - Support both class-based and function-based views

2. **Create wrapper function**
   - Use functools.wraps to preserve metadata
   - Wrap view function
   - Handle request processing

3. **Generate cache key**
   - Build key from view name and parameters
   - Include request path or custom key
   - Apply tenant scoping automatically

4. **Check cache**
   - Try to get cached response
   - Return if cache hit
   - Continue to view if cache miss

5. **Execute view and cache**
   - Call original view function
   - Cache the response
   - Return response

6. **Handle exceptions**
   - Don't cache error responses
   - Log caching errors
   - Always return response even if caching fails

7. **Support DRF views**
   - Handle DRF Response objects
   - Work with APIView and ViewSets
   - Serialize response data

### Decorator Structure
```
@cache_response(timeout=MEDIUM_CACHE)
def my_view(request):
    # View logic
    return response
```

### Verification
- cache_response decorator created
- Caches view responses
- Works with functions and classes

---

## Task 49: Add cache_key Parameter

### Overview
Add cache_key parameter to allow custom cache key specification.

### Dependencies
- Task 48: Create cache_response Decorator

### Instructions

1. **Add cache_key parameter**
   - Optional parameter (default: None)
   - Accept string or callable

2. **Use custom key if provided**
   - If string: use as-is
   - If callable: call with request
   - If None: auto-generate from view

3. **Auto-generate key logic**
   - Use view name or path
   - Include query parameters if needed
   - Keep keys concise

4. **Document key format**
   - Add examples of custom keys
   - Show callable usage
   - Note tenant prefix added automatically

### Cache Key Examples
```
Auto-generated:
view:product_list

Custom string:
@cache_response(cache_key='products:featured')

Custom callable:
@cache_response(cache_key=lambda request: f'products:category:{request.GET.get("cat")}')
```

### Verification
- cache_key parameter works
- Custom keys used correctly
- Auto-generation works

---

## Task 50: Add timeout Parameter

### Overview
Add timeout parameter to control cache duration.

### Dependencies
- Task 49: Add cache_key Parameter

### Instructions

1. **Add timeout parameter**
   - Optional parameter
   - Default: MEDIUM_CACHE
   - Accept integer seconds

2. **Pass to cache.set()**
   - Use specified timeout
   - Support None (no expiration)
   - Support constants

3. **Document timeout usage**
   - Show using constants
   - Show custom values
   - Explain None behavior

### Timeout Usage
```
@cache_response(timeout=SHORT_CACHE)
@cache_response(timeout=3600)
@cache_response(timeout=None)  # No expiration
```

### Verification
- timeout parameter works
- Different timeouts respected

---

## Task 51: Add vary_on_tenant

### Overview
Add vary_on_tenant parameter to control tenant-based key variation.

### Dependencies
- Task 50: Add timeout Parameter

### Instructions

1. **Add vary_on_tenant parameter**
   - Boolean parameter
   - Default: True (tenant isolation)
   - Control tenant scoping

2. **Apply tenant variation**
   - If True: use TenantCache (default)
   - If False: use regular cache
   - Tenant prefix added automatically when True

3. **Document use cases**
   - True: Tenant-specific data (default)
   - False: Shared data across tenants

### Tenant Variation Examples
```
# Tenant-specific (default)
@cache_response(vary_on_tenant=True)
def my_products(request):
    ...

# Shared across tenants
@cache_response(vary_on_tenant=False)
def currency_list(request):
    ...
```

### Verification
- vary_on_tenant parameter works
- Tenant isolation when True
- Shared cache when False

---

## Task 52: Add vary_on_user

### Overview
Add vary_on_user parameter to include user ID in cache key for per-user caching.

### Dependencies
- Task 51: Add vary_on_tenant

### Instructions

1. **Add vary_on_user parameter**
   - Boolean parameter
   - Default: False
   - Include user ID in key

2. **Include user in key**
   - If True: add user ID to cache key
   - If False: ignore user
   - Handle anonymous users

3. **Get user ID**
   - Extract from request.user
   - Use 'anonymous' for not authenticated
   - Handle custom user models

4. **Document use cases**
   - User-specific data
   - Personalized content
   - User preferences

### User Variation Examples
```
# User-specific dashboard
@cache_response(vary_on_user=True, timeout=SHORT_CACHE)
def user_dashboard(request):
    ...

# Same for all users
@cache_response(vary_on_user=False)
def product_list(request):
    ...
```

### Verification
- vary_on_user parameter works
- Per-user caching when True
- Shared when False

---

## Expected Outcome

```
backend/apps/core/cache/
├── decorators.py         # cache_response decorator
```

cache_response decorator with:
- Custom cache_key support
- Configurable timeout
- vary_on_tenant (default: True)
- vary_on_user (default: False)

---

## Next Steps
Proceed to [02_Tasks-53-54_Additional-Decorators.md](02_Tasks-53-54_Additional-Decorators.md) for cache_queryset and cache_method decorators.
