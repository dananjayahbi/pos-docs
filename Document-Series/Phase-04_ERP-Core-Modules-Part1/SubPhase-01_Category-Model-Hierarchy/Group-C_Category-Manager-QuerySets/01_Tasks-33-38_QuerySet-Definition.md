# Tasks 33-38: QuerySet Definition

> **Phase:** 04 - ERP Core Modules Part 1  
> **SubPhase:** 01 - Category Model & Hierarchy  
> **Group:** C - Category Manager & QuerySets  
> **Document:** 01 of 03  
> **Tasks Covered:** 33, 34, 35, 36, 37, 38

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Group:** [../Group-B_Category-Model-Definition/](../Group-B_Category-Model-Definition/)
- **→ Next Document:** [02_Tasks-39-43_Manager-Tree-Methods.md](02_Tasks-39-43_Manager-Tree-Methods.md)

---

## Document Overview

This document covers creating a custom CategoryQuerySet with chainable filter methods for common category queries.

### Tasks in This Document
| Task # | Task Name | Complexity |
|--------|-----------|------------|
| 33 | Create managers.py File | Low |
| 34 | Create CategoryQuerySet | Medium |
| 35 | Add active Method | Low |
| 36 | Add root_nodes Method | Medium |
| 37 | Add with_children Method | Medium |
| 38 | Add with_products Method | Medium |

---

## Technology Context

### Why Custom QuerySets?
Custom QuerySets enable chainable, reusable query methods:
- Cleaner code: Category.objects.active() instead of filter(is_active=True)
- Reusable logic: Centralized query patterns
- Chainable: .active().root_nodes()
- Maintainable: Change logic in one place

### TreeQuerySet Integration
Must inherit from TreeQuerySet for MPTT compatibility:
- Maintains tree structure awareness
- Enables MPTT methods
- Compatible with tree operations

---

## Task 33: Create managers.py File

### Overview
Create managers.py file in the models module to hold custom managers and querysets.

### Dependencies
- Task 32: Export Category Model

### Instructions

1. **Create managers.py in models directory**
   - Path: backend/apps/categories/models/managers.py
   - Will contain CategoryQuerySet and CategoryManager

2. **Add file docstring**
   - Explain purpose: Custom managers and querysets
   - Mention MPTT integration

3. **Prepare import section**
   - Will import Django QuerySet
   - Will import MPTT TreeQuerySet
   - Will import Category model

4. **Plan file structure**
   - CategoryQuerySet class first
   - CategoryManager class second
   - Clear separation between concerns

### Expected Outcome
```
backend/apps/categories/models/
├── __init__.py
├── category.py
└── managers.py              # NEW: Managers and querysets
```

### Verification Steps
- Confirm managers.py exists
- Check file in correct directory
- Verify docstring is present

---

## Task 34: Create CategoryQuerySet

### Overview
Define CategoryQuerySet class inheriting from TreeQuerySet with chainable methods.

### Dependencies
- Task 33: Create managers.py File

### Instructions

1. **Import required classes**
   - Import TreeQuerySet from mptt.querysets
   - This maintains MPTT compatibility

2. **Define CategoryQuerySet class**
   - Inherit from TreeQuerySet
   - Add class docstring

3. **Add class docstring**
   - Explain purpose of custom queryset
   - List available methods
   - Mention chainable nature

4. **Prepare for methods**
   - Methods will be added in next tasks
   - Each method returns self for chaining

### TreeQuerySet Base
| Feature | Provided by TreeQuerySet |
|---------|-------------------------|
| **Tree Methods** | get_ancestors(), get_descendants() |
| **Tree Filters** | Filter by tree structure |
| **Compatibility** | Works with MPTT managers |
| **Chainable** | Returns queryset for chaining |

### Chainable Methods Pattern
```
# Chainable usage examples:
Category.objects.active().root_nodes()
Category.objects.root_nodes().with_children()
Category.objects.active().root_nodes().with_children()
```

### Expected Outcome
```
class CategoryQuerySet(TreeQuerySet):
    """
    Custom queryset for Category model.
    
    Provides chainable methods for common category queries.
    Inherits from TreeQuerySet for MPTT compatibility.
    """
    pass  # Methods added in next tasks
```

### Verification Steps
- Check class inherits TreeQuerySet
- Verify docstring is present
- Confirm class definition syntax

---

## Task 35: Add active Method

### Overview
Add method to filter only active categories.

### Dependencies
- Task 34: Create CategoryQuerySet

### Instructions

1. **Define active method**
   - Returns queryset filtered by is_active=True
   - Chainable (returns self)

2. **Implement filter logic**
   - Filter: is_active=True
   - Return filtered queryset

3. **Add method docstring**
   - Explain purpose
   - Show usage example
   - Note chainable

4. **Consider cascade behavior**
   - This method only filters current level
   - Parent inactive handled by separate logic
   - Can be combined with other filters

### Filter Logic
```
Returns only categories where is_active=True
Does not check parent active status (handled elsewhere)
```

### Usage Examples
```
# Get all active categories
Category.objects.active()

# Get active root categories
Category.objects.active().root_nodes()

# Chained with other filters
Category.objects.active().filter(parent=electronics)
```

### Expected Outcome
```
def active(self):
    """
    Filter active categories only.
    
    Returns:
        CategoryQuerySet: Filtered queryset
        
    Example:
        Category.objects.active()
    """
    return self.filter(is_active=True)
```

### Verification Steps
- Check method is defined
- Verify returns filtered queryset
- Confirm docstring with example
- Ensure chainable (returns queryset)

---

## Task 36: Add root_nodes Method

### Overview
Add method to get only root-level categories (no parent).

### Dependencies
- Task 35: Add active Method

### Instructions

1. **Define root_nodes method**
   - Filters categories with parent=None
   - Returns top-level categories only

2. **Implement filter logic**
   - Filter: parent__isnull=True
   - Or use MPTT's level=0

3. **Add method docstring**
   - Explain root node concept
   - Show usage examples
   - Note chainable

4. **MPTT alternative**
   - Can filter by level=0
   - Both approaches equivalent
   - parent__isnull more semantic

### Root Categories Concept
```
Root categories have no parent:
├── Electronics (parent=None) ✓ ROOT
├── Clothing (parent=None) ✓ ROOT
└── Food (parent=None) ✓ ROOT

Children have parent:
    ├── Mobile Phones (parent=Electronics) ✗ Not root
    └── Laptops (parent=Electronics) ✗ Not root
```

### Filter Options
| Method | Filter | Equivalent |
|--------|--------|------------|
| **Option 1** | parent__isnull=True | Semantic |
| **Option 2** | level=0 | MPTT-specific |

**Recommendation:** Use parent__isnull=True for clarity

### Usage Examples
```
# All root categories
Category.objects.root_nodes()

# Active root categories only
Category.objects.active().root_nodes()

# Root categories with children prefetched
Category.objects.root_nodes().with_children()
```

### Expected Outcome
```
def root_nodes(self):
    """
    Filter root categories (no parent).
    
    Returns:
        CategoryQuerySet: Root categories only
        
    Example:
        Category.objects.root_nodes()
    """
    return self.filter(parent__isnull=True)
```

### Verification Steps
- Check method filters parent=None
- Verify returns queryset
- Confirm docstring present
- Ensure chainable

---

## Task 37: Add with_children Method

### Overview
Add method to prefetch children relationships for efficient loading.

### Dependencies
- Task 36: Add root_nodes Method

### Instructions

1. **Define with_children method**
   - Uses prefetch_related for efficiency
   - Loads children in single additional query
   - Prevents N+1 query problem

2. **Implement prefetch_related**
   - Prefetch: 'children' related name
   - Returns queryset with prefetched data

3. **Add method docstring**
   - Explain N+1 problem prevention
   - Show usage example
   - Note performance benefit

4. **Understand N+1 problem**
   - Without prefetch: Query for each parent's children
   - With prefetch: Single query for all children
   - Significant performance improvement

### N+1 Query Problem
```
Without with_children():
Query 1: Get all categories
Query 2: Get children of category 1
Query 3: Get children of category 2
Query 4: Get children of category 3
... (N queries for N categories)

With with_children():
Query 1: Get all categories
Query 2: Get all children in one query
... (2 queries total)
```

### Performance Impact
| Approach | Queries | Performance |
|----------|---------|-------------|
| **Without Prefetch** | 1 + N | Slow for many categories |
| **With Prefetch** | 2 | Fast, constant queries |

### Usage Examples
```
# Get root categories with children loaded
roots = Category.objects.root_nodes().with_children()
for category in roots:
    for child in category.children.all():  # No extra query!
        print(child.name)

# Active categories with children
Category.objects.active().with_children()
```

### Expected Outcome
```
def with_children(self):
    """
    Prefetch children relationships.
    
    Prevents N+1 queries when accessing category.children.all()
    
    Returns:
        CategoryQuerySet: Queryset with children prefetched
        
    Example:
        Category.objects.root_nodes().with_children()
    """
    return self.prefetch_related('children')
```

### Verification Steps
- Check uses prefetch_related
- Verify prefetches 'children'
- Confirm docstring explains N+1
- Ensure returns queryset

---

## Task 38: Add with_products Method

### Overview
Add method to prefetch product relationships (for future use when Product model exists).

### Dependencies
- Task 37: Add with_children Method

### Instructions

1. **Define with_products method**
   - Prefetch products relationship
   - Prepares for Product model (created later)
   - Uses prefetch_related

2. **Implement prefetch_related**
   - Prefetch: 'products' or 'product_set'
   - Relationship defined in Product model
   - Currently no products exist (future)

3. **Add method docstring**
   - Note this is for future use
   - Explain products relationship
   - Show usage example

4. **Handle non-existent relationship**
   - Products don't exist yet (created in SubPhase-03)
   - Method prepared for future
   - Will work once Product model created

### Product Relationship (Future)
```
When Product model exists:
- Product will have: category = ForeignKey(Category)
- Category will have: products.all() or product_set.all()
- Reverse relationship enables prefetch
```

### Usage Examples (Future)
```
# When Product model exists:
categories = Category.objects.active().with_products()
for category in categories:
    for product in category.products.all():  # No extra query
        print(product.name)

# Combined prefetch
Category.objects.root_nodes().with_children().with_products()
```

### Related Name Options
| Pattern | Access Method |
|---------|---------------|
| **Default** | category.product_set.all() |
| **related_name='products'** | category.products.all() |

**Assumption:** Product model will use related_name='products'

### Expected Outcome
```
def with_products(self):
    """
    Prefetch products relationships (for future use).
    
    Note: Requires Product model with category ForeignKey.
    Prevents N+1 queries when accessing category.products.all()
    
    Returns:
        CategoryQuerySet: Queryset with products prefetched
        
    Example:
        Category.objects.active().with_products()
    """
    return self.prefetch_related('products')
```

### Verification Steps
- Check uses prefetch_related
- Verify prefetches 'products'
- Confirm docstring notes future use
- Ensure returns queryset

---

## Summary

### Tasks Completed in This Document
| Task # | Task Name | Key Deliverable |
|--------|-----------|-----------------|
| 33 | Create managers.py File | managers.py created |
| 34 | Create CategoryQuerySet | Base queryset class |
| 35 | Add active Method | Filter active categories |
| 36 | Add root_nodes Method | Get root categories |
| 37 | Add with_children Method | Prefetch children |
| 38 | Add with_products Method | Prefetch products (future) |

### CategoryQuerySet Methods
```
CategoryQuerySet:
├── active() → Filter is_active=True
├── root_nodes() → Filter parent=None
├── with_children() → Prefetch children
└── with_products() → Prefetch products (future)

All methods are chainable!
```

### Usage Examples
```
# Single method
Category.objects.active()

# Chained methods
Category.objects.active().root_nodes()

# Multiple prefetches
Category.objects.active().root_nodes().with_children()

# Complex query
Category.objects.active()
    .root_nodes()
    .with_children()
    .with_products()
```

### Dependencies Satisfied for Next Document
- CategoryQuerySet defined
- Basic filter methods implemented
- Prefetch methods added
- Ready for CategoryManager

### Next Steps
Proceed to [02_Tasks-39-43_Manager-Tree-Methods.md](02_Tasks-39-43_Manager-Tree-Methods.md) to create CategoryManager with tree-specific operations.

---

## Notes for AI Agents

1. **TreeQuerySet:** Must inherit for MPTT compatibility
2. **Chainable:** All methods return queryset for chaining
3. **active Method:** Only filters current level, not parents
4. **root_nodes:** Use parent__isnull=True for clarity
5. **Prefetch:** Prevents N+1 queries for relationships
6. **with_products:** Prepared for future Product model
7. **Performance:** Prefetch methods critical for tree displays
8. **Related Name:** Assumes 'children' and 'products' relations
9. **Documentation:** Include usage examples in docstrings
10. **Next Task:** CategoryManager adds tree-specific operations
