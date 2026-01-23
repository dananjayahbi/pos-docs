# Tasks 39-43: Manager & Tree Methods

> **Phase:** 04 - ERP Core Modules Part 1  
> **SubPhase:** 01 - Category Model & Hierarchy  
> **Group:** C - Category Manager & QuerySets  
> **Document:** 02 of 03  
> **Tasks Covered:** 39, 40, 41, 42, 43

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [01_Tasks-33-38_QuerySet-Definition.md](01_Tasks-33-38_QuerySet-Definition.md)
- **→ Next Document:** [03_Tasks-44-46_Assignment-Properties-Testing.md](03_Tasks-44-46_Assignment-Properties-Testing.md)

---

## Document Overview

This document covers creating the CategoryManager with tree-specific operations like getting tree structure, breadcrumbs, descendants, and node movement.

### Tasks in This Document
| Task # | Task Name | Complexity |
|--------|-----------|------------|
| 39 | Create CategoryManager | Medium |
| 40 | Add get_tree Method | High |
| 41 | Add get_breadcrumbs Method | Medium |
| 42 | Add get_descendants_ids Method | Medium |
| 43 | Add move_node Method | High |

---

## Task 39: Create CategoryManager

### Overview
Define CategoryManager class inheriting from TreeManager with custom queryset.

### Dependencies
- Task 38: Add with_products Method

### Instructions

1. **Import TreeManager**
   - Import from mptt.managers
   - Required for MPTT integration

2. **Define CategoryManager class**
   - Inherit from TreeManager
   - Override get_queryset method

3. **Override get_queryset**
   - Return CategoryQuerySet instance
   - Enables chainable custom methods

4. **Add class docstring**
   - Explain manager purpose
   - List custom methods
   - Note MPTT integration

### TreeManager Integration
CategoryManager must inherit TreeManager to maintain MPTT functionality while adding custom queryset methods.

### Expected Outcome
```
class CategoryManager(TreeManager):
    """
    Custom manager for Category model.
    
    Provides tree-specific operations and uses CategoryQuerySet
    for chainable filter methods.
    """
    
    def get_queryset(self):
        """Return custom queryset."""
        return CategoryQuerySet(self.model, using=self._db)
```

### Verification Steps
- Check inherits TreeManager
- Verify get_queryset returns CategoryQuerySet
- Confirm docstring present

---

## Task 40: Add get_tree Method

### Overview
Add method to retrieve complete tree structure with nested children.

### Dependencies
- Task 39: Create CategoryManager

### Instructions

1. **Define get_tree method**
   - Returns all categories with tree structure
   - Uses MPTT tree_id for grouping
   - Efficient single-query retrieval

2. **Implement tree structure logic**
   - Get all root nodes
   - Use prefetch_related for descendants
   - Return structured data

3. **Add method parameters**
   - active_only: Filter active categories
   - prefetch_children: Load children eagerly

4. **Add method docstring**
   - Explain tree structure
   - Show usage example
   - Document parameters

### Tree Structure Concept
```
Complete tree with all descendants:
Electronics
├── Mobile Phones
│   ├── Smartphones
│   └── Feature Phones
└── Laptops
    ├── Gaming
    └── Business
```

### Implementation Strategy
Use get_cached_trees() from MPTT or custom logic with prefetch_related.

### Expected Outcome
```
def get_tree(self, active_only=True):
    """
    Get complete category tree structure.
    
    Args:
        active_only: Filter active categories only
        
    Returns:
        QuerySet: Root categories with descendants prefetched
        
    Example:
        tree = Category.objects.get_tree()
    """
    queryset = self.get_queryset()
    if active_only:
        queryset = queryset.active()
    return queryset.root_nodes().with_children()
```

### Verification Steps
- Check method accepts parameters
- Verify returns queryset
- Confirm docstring complete

---

## Task 41: Add get_breadcrumbs Method

### Overview
Add method to get ancestor path for breadcrumb navigation.

### Dependencies
- Task 40: Add get_tree Method

### Instructions

1. **Define get_breadcrumbs method**
   - Takes category instance
   - Returns list of ancestors
   - Ordered from root to current

2. **Implement breadcrumb logic**
   - Use get_ancestors() from MPTT
   - Include current category
   - Return ordered list

3. **Add method parameters**
   - category: Category instance
   - include_self: Include current category

4. **Add method docstring**
   - Explain breadcrumb concept
   - Show usage example
   - Document return value

### Breadcrumb Example
```
Category: Smartphones

Breadcrumb path:
Electronics > Mobile Phones > Smartphones
```

### Expected Outcome
```
def get_breadcrumbs(self, category, include_self=True):
    """
    Get breadcrumb path for category.
    
    Args:
        category: Category instance
        include_self: Include current category in path
        
    Returns:
        QuerySet: Ordered ancestors (root to current)
        
    Example:
        breadcrumbs = Category.objects.get_breadcrumbs(smartphone_category)
    """
    ancestors = category.get_ancestors()
    if include_self:
        return ancestors | self.filter(pk=category.pk)
    return ancestors
```

### Verification Steps
- Check accepts category parameter
- Verify returns ordered ancestors
- Confirm include_self works

---

## Task 42: Add get_descendants_ids Method

### Overview
Add method to get all descendant IDs for efficient filtering.

### Dependencies
- Task 41: Add get_breadcrumbs Method

### Instructions

1. **Define get_descendants_ids method**
   - Returns list of descendant IDs
   - Useful for product filtering
   - Efficient for WHERE IN queries

2. **Implement descendants logic**
   - Use get_descendants() from MPTT
   - Extract IDs only
   - Return as list

3. **Add method parameters**
   - category: Category instance
   - include_self: Include current category ID

4. **Add method docstring**
   - Explain use case (product filtering)
   - Show usage example

### Use Case: Product Filtering
```
Get all products in Electronics and subcategories:
electronics_id = electronics_category.id
descendant_ids = Category.objects.get_descendants_ids(electronics_category)
products = Product.objects.filter(category_id__in=descendant_ids)
```

### Expected Outcome
```
def get_descendants_ids(self, category, include_self=True):
    """
    Get list of descendant category IDs.
    
    Useful for filtering products by category tree.
    
    Args:
        category: Category instance
        include_self: Include current category ID
        
    Returns:
        list: Category IDs
        
    Example:
        ids = Category.objects.get_descendants_ids(electronics)
        products = Product.objects.filter(category_id__in=ids)
    """
    descendants = category.get_descendants(include_self=include_self)
    return list(descendants.values_list('id', flat=True))
```

### Verification Steps
- Check returns list of IDs
- Verify include_self parameter works
- Confirm efficient query

---

## Task 43: Add move_node Method

### Overview
Add method to move categories to different parents or reorder within same parent.

### Dependencies
- Task 42: Add get_descendants_ids Method

### Instructions

1. **Define move_node method**
   - Moves category to new parent
   - Updates tree structure
   - Handles MPTT field updates

2. **Implement move logic**
   - Use MPTT's move_to method
   - Validate move is allowed
   - Update tree structure

3. **Add method parameters**
   - category: Category to move
   - target: New parent (or None for root)
   - position: Where to place (first-child, last-child, etc.)

4. **Add validation**
   - Prevent moving to descendant (circular reference)
   - Check target exists
   - Validate position

5. **Add method docstring**
   - Explain move concept
   - Show usage examples
   - Document parameters

### Move Operations
| Operation | Example |
|-----------|---------|
| **Change Parent** | Move Smartphones from Mobile to Electronics |
| **Make Root** | Move Mobile Phones to root level |
| **Reorder** | Change order within same parent |

### Position Options
- 'first-child': First child of target
- 'last-child': Last child of target
- 'left': Before target (sibling)
- 'right': After target (sibling)

### Expected Outcome
```
def move_node(self, category, target, position='last-child'):
    """
    Move category to new position in tree.
    
    Args:
        category: Category to move
        target: New parent category (or None for root)
        position: Where to place ('first-child', 'last-child', etc.)
        
    Returns:
        Category: Updated category instance
        
    Example:
        Category.objects.move_node(smartphone_cat, electronics_cat)
    """
    # Validate move is allowed
    if target and category.is_ancestor_of(target):
        raise ValueError("Cannot move category to its own descendant")
    
    # Use MPTT move_to method
    category.move_to(target, position=position)
    category.refresh_from_db()
    return category
```

### Verification Steps
- Check prevents circular moves
- Verify MPTT fields updated
- Confirm docstring complete

---

## Summary

### Tasks Completed in This Document
| Task # | Task Name | Key Deliverable |
|--------|-----------|-----------------|
| 39 | Create CategoryManager | Manager class with custom queryset |
| 40 | Add get_tree Method | Complete tree retrieval |
| 41 | Add get_breadcrumbs Method | Ancestor path generation |
| 42 | Add get_descendants_ids Method | Descendant ID list |
| 43 | Add move_node Method | Category movement |

### CategoryManager Methods
```
CategoryManager:
├── get_tree() → Complete tree structure
├── get_breadcrumbs() → Ancestor path
├── get_descendants_ids() → Descendant IDs
└── move_node() → Move categories
```

### Combined with QuerySet Methods
```
# Manager + QuerySet methods available:
Category.objects.active()  # QuerySet method
Category.objects.get_tree()  # Manager method
Category.objects.active().root_nodes()  # Chained
```

### Dependencies Satisfied for Next Document
- CategoryManager defined
- Tree operation methods implemented
- Ready for model assignment

### Next Steps
Proceed to [03_Tasks-44-46_Assignment-Properties-Testing.md](03_Tasks-44-46_Assignment-Properties-Testing.md) to assign manager to model and add properties.

---

## Notes for AI Agents

1. **TreeManager:** Must inherit for MPTT compatibility
2. **get_queryset:** Returns CategoryQuerySet for custom methods
3. **get_tree:** Efficient single-query tree retrieval
4. **Breadcrumbs:** Use get_ancestors() from MPTT
5. **Descendant IDs:** Useful for product filtering
6. **move_node:** Validate to prevent circular references
7. **Position:** Support MPTT position options
8. **Validation:** Check moves are valid before executing
9. **Efficiency:** Use prefetch for tree operations
10. **Next Task:** Assign manager to Category model
