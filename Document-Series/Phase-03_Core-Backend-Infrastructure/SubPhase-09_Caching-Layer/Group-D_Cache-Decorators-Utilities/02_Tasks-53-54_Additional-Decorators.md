# Tasks 53-54: Additional Decorators

> **Phase:** 03 - Core Backend Infrastructure  
> **SubPhase:** 09 - Caching Layer  
> **Group:** D - Cache Decorators & Utilities  
> **Document:** 02 of 04  
> **Tasks Covered:** 53, 54

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [01_Tasks-47-52_Cache-Response-Decorator.md](01_Tasks-47-52_Cache-Response-Decorator.md)
- **→ Next Document:** [03_Tasks-55-60_Utility-Functions.md](03_Tasks-55-60_Utility-Functions.md)

---

## Document Overview

This document covers implementation of cache_queryset and cache_method decorators for caching QuerySet results and method outputs.

### Tasks in This Document
| Task # | Task Name | Complexity |
|--------|-----------|------------|
| 53 | Create cache_queryset Decorator | Complex |
| 54 | Create cache_method Decorator | Medium |

---

## Task 53: Create cache_queryset Decorator

### Overview
Implement cache_queryset decorator for caching Django QuerySet results with automatic key generation.

### Dependencies
- Task 52: Add vary_on_user

### Instructions

1. **Define cache_queryset decorator**
   - Add to decorators.py
   - Accept timeout and cache_key parameters
   - Wrap QuerySet-returning functions

2. **Generate cache key**
   - Use model name
   - Include filter parameters
   - Include ordering information
   - Hash complex parameters

3. **Serialize QuerySet**
   - Convert QuerySet to list
   - Cache serialized data
   - Preserve query information

4. **Return cached or execute**
   - Check cache first
   - If hit: return cached list
   - If miss: execute query, cache, return

5. **Handle QuerySet methods**
   - Support filter(), exclude(), order_by()
   - Preserve QuerySet chaining where possible
   - Document limitations

6. **Add invalidation note**
   - Document that cache won't auto-invalidate
   - Need manual invalidation on data changes
   - Reference invalidation patterns (Group E)

### QuerySet Caching Pattern
```
@cache_queryset(timeout=MEDIUM_CACHE)
def get_active_products():
    return Product.objects.filter(active=True).select_related('category')

# Usage
products = get_active_products()  # Cached after first call
```

### Key Generation Logic
```
Cache key format:
queryset:{model}:{filters_hash}:{ordering}

Example:
queryset:Product:filters_abc123:name
```

### Important Considerations
- QuerySet becomes list after caching
- Loses lazy evaluation benefit
- Best for frequently accessed, stable queries
- Consider cache invalidation strategy

### Verification
- cache_queryset decorator created
- Caches query results
- Key generation handles complex queries
- Documented limitations

---

## Task 54: Create cache_method Decorator

### Overview
Implement cache_method decorator for caching method return values with instance-specific keys.

### Dependencies
- Task 53: Create cache_queryset Decorator

### Instructions

1. **Define cache_method decorator**
   - Add to decorators.py
   - Work with class methods
   - Support instance methods

2. **Generate instance-specific key**
   - Include class name
   - Include method name
   - Include instance identifier (pk if model)
   - Include method arguments

3. **Handle method arguments**
   - Include args in cache key
   - Include kwargs in cache key
   - Hash complex arguments
   - Support varargs and kwargs

4. **Cache method result**
   - Check cache first
   - Call method if miss
   - Cache result
   - Return result

5. **Support different timeout per method**
   - Accept timeout parameter
   - Default: MEDIUM_CACHE
   - Allow None

6. **Document method caching**
   - Best practices
   - When to use
   - Invalidation considerations

### Method Caching Pattern
```
class Product(models.Model):
    @cache_method(timeout=LONG_CACHE)
    def get_related_products(self):
        # Expensive computation
        return Product.objects.filter(category=self.category).exclude(pk=self.pk)[:5]

# Usage
product = Product.objects.get(pk=1)
related = product.get_related_products()  # Cached per product instance
```

### Key Generation for Methods
```
Cache key format:
method:{class}:{instance_id}:{method}:{args_hash}

Example:
method:Product:123:get_related_products:abc
```

### Use Cases
| Use Case | Example |
|----------|---------|
| **Model methods** | Computed properties, related objects |
| **Expensive calculations** | Price calculations, recommendations |
| **API calls** | External service results |
| **Aggregations** | Statistics, summaries |

### Verification
- cache_method decorator created
- Instance-specific caching works
- Arguments included in key
- Works with model instances

---

## Expected Outcome After This Document

```
backend/apps/core/cache/decorators.py now has:
├── cache_response
├── cache_queryset
└── cache_method
```

---

## Sri Lanka-Specific Considerations

- **QuerySet Caching:** Useful for product catalogs in Sri Lankan stores
- **Method Caching:** Good for price calculations with LKR currency conversions
- **Invalidation:** Important for inventory updates in POS system

---

## Notes for AI Agents

1. **QuerySet Limitation:** Returns list, not QuerySet after caching
2. **Method Caching:** Must include instance ID for proper isolation
3. **Key Generation:** Hash long/complex parameters
4. **Invalidation:** Decorators don't auto-invalidate; manual needed
5. **Git Commit:** Commit additional decorators

---

## Validation Checklist

Before proceeding to the next document:

- [ ] cache_queryset decorator implemented
- [ ] QuerySet caching works
- [ ] Key generation handles filters and ordering
- [ ] cache_method decorator implemented
- [ ] Instance-specific caching works
- [ ] Arguments included in keys
- [ ] Documentation complete
- [ ] Tested with model instances
- [ ] Changes committed to Git

---

## Next Steps

Proceed to [03_Tasks-55-60_Utility-Functions.md](03_Tasks-55-60_Utility-Functions.md) to implement cache utility functions.
