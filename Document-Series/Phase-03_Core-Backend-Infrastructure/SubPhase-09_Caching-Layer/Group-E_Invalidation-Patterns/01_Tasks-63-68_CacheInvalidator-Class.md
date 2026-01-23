# Tasks 63-68: CacheInvalidator Class

> **Phase:** 03 - Core Backend Infrastructure  
> **SubPhase:** 09 - Caching Layer  
> **Group:** E - Invalidation Patterns  
> **Document:** 01 of 04  
> **Tasks Covered:** 63, 64, 65, 66, 67, 68

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Group:** [../Group-D_Cache-Decorators-Utilities/](../Group-D_Cache-Decorators-Utilities/)
- **→ Next Document:** [02_Tasks-69-71_Signal-Handlers.md](02_Tasks-69-71_Signal-Handlers.md)

---

## Document Overview

This document covers implementation of the CacheInvalidator class for managing cache invalidation patterns when model data changes.

### Tasks in This Document
| Task # | Task Name | Complexity |
|--------|-----------|------------|
| 63 | Create invalidation.py File | Simple |
| 64 | Create CacheInvalidator Class | Medium |
| 65 | Add invalidate_model Method | Medium |
| 66 | Add invalidate_list Method | Simple |
| 67 | Add invalidate_detail Method | Simple |
| 68 | Add invalidate_related Method | Complex |

---

## Task 63: Create invalidation.py File

### Overview
Create the invalidation module for cache invalidation logic.

### Dependencies
- Task 62: Test Decorators (Group D)

### Instructions

1. **Create invalidation.py**
   - Location: apps/core/cache/invalidation.py
   - Add module docstring

2. **Import required modules**
   - Import TenantCache, get_tenant_cache
   - Import logging
   - Import Django model utilities

3. **Document invalidation patterns**
   - Explain automatic invalidation
   - Note signal-based approach
   - Provide usage examples

### Verification
- invalidation.py created
- Imports configured

---

## Task 64: Create CacheInvalidator Class

### Overview
Create CacheInvalidator class to manage invalidation operations.

### Dependencies
- Task 63: Create invalidation.py File

### Instructions

1. **Define CacheInvalidator class**
   - Class-based approach
   - Static or class methods
   - No instance state needed

2. **Add __init__ if needed**
   - Or make all methods static
   - Store tenant cache reference

3. **Plan invalidation methods**
   - invalidate_model: All caches for model
   - invalidate_list: List caches
   - invalidate_detail: Detail caches
   - invalidate_related: Related model caches

4. **Add logging**
   - Log all invalidation operations
   - Include model and key patterns
   - Debug level logging

5. **Document usage**
   - Explain each invalidation method
   - Provide examples
   - Note tenant scoping

### Class Structure
```
class CacheInvalidator:
    @staticmethod
    def invalidate_model(model_class):
        # Clear all cache for model
    
    @staticmethod
    def invalidate_list(model_class):
        # Clear list caches
    
    @staticmethod
    def invalidate_detail(model_class, instance_id):
        # Clear detail cache
    
    @staticmethod
    def invalidate_related(model_class, instance):
        # Clear related model caches
```

### Verification
- CacheInvalidator class created
- Method structure defined
- Logging configured

---

## Task 65: Add invalidate_model Method

### Overview
Implement invalidate_model method to clear all cached data for a specific model.

### Dependencies
- Task 64: Create CacheInvalidator Class

### Instructions

1. **Define invalidate_model method**
   - Accept model_class parameter
   - Get model name
   - Clear all related keys

2. **Generate cache key pattern**
   - Pattern: {model_name}:*
   - Example: Product:*
   - Includes all product-related keys

3. **Use delete_pattern**
   - Call TenantCache.delete_pattern()
   - Tenant scoping applied automatically
   - Return count of deleted keys

4. **Log invalidation**
   - Log model name
   - Log pattern used
   - Log keys deleted count

5. **Handle errors**
   - Catch and log errors
   - Don't fail if cache unavailable
   - Continue operation even if cache fails

### Usage Example
```
CacheInvalidator.invalidate_model(Product)
# Clears: Product:list, Product:detail:*, Product:search:*, etc.
```

### Verification
- invalidate_model method implemented
- Clears all model caches
- Logs operations

---

## Task 66: Add invalidate_list Method

### Overview
Implement invalidate_list method to clear list/collection caches for a model.

### Dependencies
- Task 65: Add invalidate_model Method

### Instructions

1. **Define invalidate_list method**
   - Accept model_class parameter
   - Clear list caches only
   - Preserve detail caches

2. **Generate list patterns**
   - Pattern: {model_name}:list*
   - Example: Product:list, Product:list:filtered, etc.

3. **Delete list caches**
   - Use delete_pattern with list pattern
   - Tenant-scoped automatically

4. **Common list patterns**
   - model:list (main list)
   - model:list:filtered (filtered lists)
   - model:list:search:* (search results)

5. **Log operation**
   - Log list invalidation
   - Include model and count

### Usage Example
```
CacheInvalidator.invalidate_list(Product)
# Clears: Product:list, Product:list:category:5, etc.
# Keeps: Product:detail:123
```

### Verification
- invalidate_list method implemented
- Clears only list caches
- Preserves detail caches

---

## Task 67: Add invalidate_detail Method

### Overview
Implement invalidate_detail method to clear cache for a specific model instance.

### Dependencies
- Task 66: Add invalidate_list Method

### Instructions

1. **Define invalidate_detail method**
   - Accept model_class and instance_id
   - Clear detail cache for specific instance
   - Precise invalidation

2. **Generate detail key**
   - Pattern: {model_name}:detail:{instance_id}
   - Example: Product:detail:123

3. **Delete detail cache**
   - Use delete() for specific key
   - More efficient than pattern

4. **Support multiple detail patterns**
   - model:detail:id
   - model:id (shorthand)
   - model:get:id

5. **Log operation**
   - Log instance invalidation
   - Include model and ID

### Usage Example
```
CacheInvalidator.invalidate_detail(Product, 123)
# Clears: Product:detail:123
# Keeps: Product:list, Product:detail:456
```

### Verification
- invalidate_detail method implemented
- Clears specific instance cache
- Efficient operation

---

## Task 68: Add invalidate_related Method

### Overview
Implement invalidate_related method to clear caches of related models when a model instance changes.

### Dependencies
- Task 67: Add invalidate_detail Method

### Instructions

1. **Define invalidate_related method**
   - Accept model_class and instance
   - Invalidate related model caches
   - Handle relationships

2. **Identify related models**
   - Check model's ForeignKey fields
   - Check reverse relationships
   - Check ManyToMany fields

3. **Invalidate each related model**
   - Get related model class
   - Call invalidate_list for related model
   - Handle circular dependencies

4. **Support custom relations**
   - Allow model to define cache_related_models
   - Attribute listing related models to invalidate
   - Override default relationship detection

5. **Prevent infinite loops**
   - Track already invalidated models
   - Don't follow circular relationships
   - Set maximum depth

6. **Log cascading invalidation**
   - Log each related model
   - Show invalidation chain
   - Help debugging

### Example Scenario
```
Product updated -> invalidate:
- Product caches (direct)
- Category caches (ForeignKey)
- Order caches (reverse relation)
- Review caches (reverse relation)
```

### Custom Relations Definition
```
class Product(models.Model):
    category = models.ForeignKey(Category)
    
    class Meta:
        cache_related_models = ['Category', 'Review', 'Order']
```

### Verification
- invalidate_related method implemented
- Handles model relationships
- Prevents infinite loops
- Logs cascading invalidation

---

## Expected Outcome After This Document

```
backend/apps/core/cache/
├── invalidation.py       # CacheInvalidator class
```

CacheInvalidator with methods:
- invalidate_model: Clear all model caches
- invalidate_list: Clear list caches
- invalidate_detail: Clear instance cache
- invalidate_related: Clear related model caches

---

## Sri Lanka-Specific Considerations

- **Related Models:** Important for inventory/order relationships in Lankan stores
- **Cascading:** Handle product-category-order hierarchies
- **Performance:** Efficient invalidation critical for real-time POS

---

## Notes for AI Agents

1. **Invalidation Patterns:** Match cache key patterns from decorators
2. **Tenant Scoping:** TenantCache handles tenant isolation automatically
3. **Performance:** delete() faster than delete_pattern() when possible
4. **Related Models:** Careful with circular relationships
5. **Logging:** Debug logs help troubleshoot cache issues
6. **Git Commit:** Commit CacheInvalidator implementation

---

## Validation Checklist

Before proceeding to the next document:

- [ ] invalidation.py file created
- [ ] CacheInvalidator class defined
- [ ] invalidate_model method implemented
- [ ] invalidate_list method implemented
- [ ] invalidate_detail method implemented
- [ ] invalidate_related method implemented
- [ ] Relationship detection works
- [ ] Circular relationship prevention works
- [ ] Logging configured
- [ ] Documentation complete
- [ ] Changes committed to Git

---

## Next Steps

Proceed to [02_Tasks-69-71_Signal-Handlers.md](02_Tasks-69-71_Signal-Handlers.md) to implement Django signal handlers for automatic invalidation.
