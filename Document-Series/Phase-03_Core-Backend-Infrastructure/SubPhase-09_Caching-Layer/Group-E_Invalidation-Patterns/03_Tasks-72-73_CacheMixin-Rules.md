# Tasks 72-73: CacheMixin and Rules

> **Phase:** 03 - Core Backend Infrastructure  
> **SubPhase:** 09 - Caching Layer  
> **Group:** E - Invalidation Patterns  
> **Document:** 03 of 04  
> **Tasks Covered:** 72, 73

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [02_Tasks-69-71_Signal-Handlers.md](02_Tasks-69-71_Signal-Handlers.md)
- **→ Next Document:** [04_Tasks-74-76_Management-Command-Test.md](04_Tasks-74-76_Management-Command-Test.md)

---

## Document Overview

This document covers implementing a CacheMixin for models and defining invalidation rules.

### Tasks in This Document
| Task # | Task Name | Complexity |
|--------|-----------|------------|
| 72 | Create CacheMixin for Models | Complex |
| 73 | Define Invalidation Rules | Medium |

---

## Task 72: Create CacheMixin for Models

### Overview
Create a mixin class that models can inherit to enable automatic cache invalidation with custom rules.

### Dependencies
- Task 71: Create post_delete Handler

### Instructions

1. **Create mixins directory**
   - Location: apps/core/mixins/
   - Create __init__.py
   - Create cache_mixin.py

2. **Define CacheMixin class**
   - Inherit from object (no Django model parent)
   - Designed to be mixed with Django models
   - Provides cache configuration attributes

3. **Add cache configuration attributes**
   - cache_key_prefix: Model's cache key prefix
   - cache_related_models: List of related models to invalidate
   - cache_detail_patterns: Additional detail cache patterns
   - cache_list_patterns: Additional list cache patterns

4. **Add invalidate_cache method**
   - Instance method to manually invalidate cache
   - Calls CacheInvalidator methods
   - Handles own cache and related models

5. **Add get_cache_key method**
   - Generate cache key for instance
   - Use cache_key_prefix and instance pk
   - Return standardized key

6. **Integrate with signals**
   - Mixin works with existing signal handlers
   - Signals check for mixin attributes
   - Use custom rules if mixin present

7. **Document mixin usage**
   - How to add to models
   - How to configure
   - Examples

### CacheMixin Structure
```
class CacheMixin:
    cache_key_prefix = None  # Override in model
    cache_related_models = []
    cache_detail_patterns = []
    cache_list_patterns = []
    
    def invalidate_cache(self):
        # Manual invalidation
    
    def get_cache_key(self):
        # Generate instance cache key
```

### Usage Example
```
class Product(CacheMixin, models.Model):
    cache_key_prefix = 'Product'
    cache_related_models = ['Category', 'Order']
    cache_detail_patterns = ['Product:detail:{pk}', 'Product:full:{pk}']
    
    name = models.CharField(max_length=200)
    category = models.ForeignKey(Category)

# Automatic invalidation on save/delete
# Manual: product.invalidate_cache()
```

### Verification
- CacheMixin class created
- Configuration attributes defined
- invalidate_cache method implemented
- get_cache_key method implemented

---

## Task 73: Define Invalidation Rules

### Overview
Define and document invalidation rules for common model patterns.

### Dependencies
- Task 72: Create CacheMixin for Models

### Instructions

1. **Document standard patterns**
   - List cache: Always invalidate on create/update/delete
   - Detail cache: Invalidate on update/delete only
   - Search cache: Invalidate on any change

2. **Define rules for relationships**
   - ForeignKey: Invalidate parent model lists
   - Reverse ForeignKey: Invalidate related model lists
   - ManyToMany: Invalidate both sides on change

3. **Create invalidation rule documentation**
   - Add to cache module docstring
   - Or create separate rules.md file
   - Provide decision tree

4. **Define per-model-type rules**
   - Content models: Invalidate on publish/unpublish
   - User models: Invalidate on permission changes
   - Inventory models: Invalidate on stock changes

5. **Document performance considerations**
   - When to use selective invalidation
   - When to use full invalidation
   - Trade-offs explained

6. **Create rule examples**
   - Product-Category relationship
   - Order-OrderItem relationship
   - User-Permission relationship

### Invalidation Decision Tree
```
Model Changed:
├── Created?
│   └── Invalidate: List caches only
├── Updated?
│   ├── Invalidate: List + Detail caches
│   └── Check: Related models
├── Deleted?
│   └── Invalidate: All model caches
└── Related models:
    └── Invalidate: Related model list caches
```

### Common Relationship Rules
| Relationship | Action | Invalidation |
|--------------|--------|--------------|
| **ForeignKey** | Save | Parent lists, own lists/detail |
| **Reverse FK** | Save related | Own lists |
| **ManyToMany** | Add/Remove | Both model lists |
| **OneToOne** | Save | Both model caches |

### Model-Specific Rules Example
```
Product model rules:
- On save: Invalidate Product:list*, Category:products:*
- On delete: Invalidate Product:*, Order:products:*
- On stock change: Invalidate Product:detail:{pk}, Product:list*

Category model rules:
- On save: Invalidate Category:*, Product:list*
- On delete: Invalidate Category:*, Product:*

Order model rules:
- On save: Invalidate Order:detail:{pk}, User:orders:*
- On complete: Invalidate Product:stock:*, Inventory:*
```

### Verification
- Invalidation rules documented
- Decision tree created
- Relationship rules defined
- Model-specific examples provided

---

## Expected Outcome After This Document

```
backend/apps/core/
├── mixins/
│   ├── __init__.py
│   └── cache_mixin.py    # CacheMixin class
└── docs/
    └── cache/
        └── invalidation_rules.md  # Documented rules
```

---

## Sri Lanka-Specific Considerations

- **Inventory Models:** Critical invalidation for real-time POS stock
- **Order Models:** Ensure order cache reflects payment status
- **Product Models:** Handle LKR price changes properly

---

## Notes for AI Agents

1. **Mixin Pattern:** Clean separation of cache concerns
2. **Configuration:** Model defines own cache behavior
3. **Signals Integration:** Signals check for mixin attributes
4. **Rules:** Document common patterns for consistency
5. **Performance:** Selective invalidation better than full clear
6. **Git Commit:** Commit mixin and rules documentation

---

## Validation Checklist

- [ ] CacheMixin class created
- [ ] Configuration attributes defined
- [ ] invalidate_cache method works
- [ ] get_cache_key method works
- [ ] Usage documented
- [ ] Invalidation rules documented
- [ ] Decision tree created
- [ ] Relationship rules defined
- [ ] Model-specific examples provided
- [ ] Changes committed to Git

---

## Next Steps

Proceed to [04_Tasks-74-76_Management-Command-Test.md](04_Tasks-74-76_Management-Command-Test.md) for management commands and tests.
