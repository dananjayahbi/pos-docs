# Tasks 57-63: ProductQuerySet Filters

> **Phase:** 04 - ERP Core Modules Part 1  
> **SubPhase:** 03 - Product Base Model  
> **Group:** D - Product Manager & QuerySets  
> **Document:** 01 of 02  
> **Tasks Covered:** 57, 58, 59, 60, 61, 62, 63

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **→ Next Document:** [02_Tasks-64-70_Manager-Search-Migration.md](02_Tasks-64-70_Manager-Search-Migration.md)

---

## Document Overview

This document covers creating a custom ProductQuerySet with chainable filter methods for common product queries.

### Tasks in This Document
| Task # | Task Name | Complexity |
|--------|-----------|------------|
| 57 | Create managers.py File | Low |
| 58 | Create ProductQuerySet | Medium |
| 59 | Add active Method | Low |
| 60 | Add published Method | Medium |
| 61 | Add in_stock Method | Medium |
| 62 | Add by_category Method | Medium |
| 63 | Add by_brand Method | Low |

---

## Task 57: Create managers.py File

### Overview
Create a managers module for custom product querysets and managers.

### Dependencies
- Task 56: Export Product Model

### Instructions

1. **Create managers.py file**
   - Create at: `backend/apps/products/models/managers.py`
   - This file contains custom queryset and manager classes

2. **Add file docstring**
   - Explain custom querysets and managers
   - List querysets and managers to be defined
   - Document common query patterns

3. **Import required dependencies**
   - Import Django models and Q
   - Import PRODUCT_TYPES and PRODUCT_STATUS constants
   - Import SearchVector for full-text search (Task 68)

### Expected Outcome
```python
"""
Custom managers and querysets for Product model.

Provides chainable query methods for common product filtering:
- active(): Products with status=ACTIVE
- published(): Active and webstore-visible
- in_stock(): Products with available inventory
- by_category(): Filter by category (includes descendants)
- by_brand(): Filter by brand
- Product type filters: simple_products(), variable_products()
- featured(): Featured products only

Usage:
    Product.objects.active().by_category(category_id)
    Product.objects.published().featured()
"""

from django.db import models
from django.db.models import Q
from apps.products.constants import PRODUCT_TYPES, PRODUCT_STATUS


# QuerySets and Managers will be defined below
```

### Verification Checklist
- [ ] managers.py file created
- [ ] File has descriptive docstring
- [ ] Required imports are present

---

## Task 58: Create ProductQuerySet

### Overview
Define the ProductQuerySet class with chainable filter methods.

### Dependencies
- Task 57: Create managers.py File

### Instructions

1. **Create ProductQuerySet class**
   - Inherit from models.QuerySet
   - Add class docstring
   - Methods will be added in subsequent tasks

2. **Understand QuerySet patterns**
   - Methods return self for chaining
   - Use filter() not get()
   - Combine multiple filters
   - Optimize with select_related, prefetch_related

### Expected Outcome
```python
class ProductQuerySet(models.QuerySet):
    """
    Custom QuerySet for Product model with chainable filter methods.
    
    All methods return QuerySet for chaining.
    """
    
    # Filter methods will be added in next tasks
```

### Verification Checklist
- [ ] ProductQuerySet class defined
- [ ] Inherits from models.QuerySet
- [ ] Has class docstring

---

## Task 59: Add active Method

### Overview
Add the active() method to filter products with status=ACTIVE.

### Dependencies
- Task 58: Create ProductQuerySet

### Instructions

1. **Define active method**
   - Filter by status=PRODUCT_STATUS.ACTIVE
   - Return self for chaining
   - Add method docstring

2. **Understand active filter**
   - Most common filter
   - Excludes draft, archived, discontinued
   - Used as base for other filters

### Expected Outcome
```python
class ProductQuerySet(models.QuerySet):
    """[docstring]"""
    
    def active(self):
        """Filter products with status=ACTIVE."""
        return self.filter(status=PRODUCT_STATUS.ACTIVE)
```

### Verification Checklist
- [ ] active() method defined
- [ ] Filters by ACTIVE status
- [ ] Returns self for chaining

---

## Task 60: Add published Method

### Overview
Add the published() method to filter products visible in webstore.

### Dependencies
- Task 59: Add active Method

### Instructions

1. **Define published method**
   - Filter by status=ACTIVE AND is_webstore_visible=True
   - Can chain with active() or filter directly
   - Add method docstring

2. **Understand published criteria**
   - Must be ACTIVE
   - Must have is_webstore_visible=True
   - Ready for customer viewing
   - Used in webstore queries

### Expected Outcome
```python
    def active(self):
        """[docstring]"""
        return self.filter(status=PRODUCT_STATUS.ACTIVE)
    
    def published(self):
        """
        Filter products published in webstore.
        
        Returns products that are:
        - Status: ACTIVE
        - Webstore visible: True
        """
        return self.filter(
            status=PRODUCT_STATUS.ACTIVE,
            is_webstore_visible=True
        )
```

### Verification Checklist
- [ ] published() method defined
- [ ] Filters by ACTIVE and is_webstore_visible
- [ ] Has descriptive docstring

---

## Task 61: Add in_stock Method

### Overview
Add the in_stock() method to filter products with available inventory.

### Dependencies
- Task 60: Add published Method

### Instructions

1. **Define in_stock method**
   - Placeholder for inventory integration
   - Currently returns all (inventory comes later)
   - Add TODO comment for future implementation
   - Add method docstring

2. **Plan future implementation**
   - Will check inventory levels
   - Filter products with stock > 0
   - Consider reserved quantities
   - Join with inventory table

### Expected Outcome
```python
    def published(self):
        """[docstring]"""
        return self.filter(...)
    
    def in_stock(self):
        """
        Filter products with available inventory.
        
        TODO: Implement when inventory module is ready.
        Currently returns all products as placeholder.
        
        Future: Will filter products where stock quantity > 0
        """
        # Placeholder - inventory integration in Phase-05
        return self
```

### Verification Checklist
- [ ] in_stock() method defined
- [ ] Has placeholder implementation
- [ ] Includes TODO comment
- [ ] Returns self for chaining

---

## Task 62: Add by_category Method

### Overview
Add the by_category() method to filter products by category.

### Dependencies
- Task 61: Add in_stock Method

### Instructions

1. **Define by_category method**
   - Accept category_id or category object
   - Filter products in that category
   - Consider including child categories (MPTT)
   - Add method docstring

2. **Plan category filtering**
   - Support category object or ID
   - Include descendant categories if MPTT
   - Efficient querying with select_related

3. **Handle category parameter**
   - If Category object, use its ID
   - If integer, use directly
   - Validate parameter type

### Expected Outcome
```python
    def in_stock(self):
        """[docstring]"""
        return self
    
    def by_category(self, category):
        """
        Filter products by category.
        
        Args:
            category: Category object or category ID
            
        Returns:
            QuerySet of products in the specified category.
            
        TODO: Include child categories when MPTT is fully integrated.
        """
        if hasattr(category, 'pk'):
            category_id = category.pk
        else:
            category_id = category
        
        return self.filter(category_id=category_id)
```

### Verification Checklist
- [ ] by_category() method defined
- [ ] Handles category object or ID
- [ ] Has descriptive docstring
- [ ] TODO for MPTT child categories

---

## Task 63: Add by_brand Method

### Overview
Add the by_brand() method to filter products by brand.

### Dependencies
- Task 62: Add by_category Method

### Instructions

1. **Define by_brand method**
   - Accept brand_id or brand object
   - Filter products with that brand
   - Handle null brands (some products have no brand)
   - Add method docstring

2. **Handle brand parameter**
   - If Brand object, use its ID
   - If integer, use directly
   - Validate parameter type

### Expected Outcome
```python
    def by_category(self, category):
        """[docstring]"""
        return self.filter(...)
    
    def by_brand(self, brand):
        """
        Filter products by brand.
        
        Args:
            brand: Brand object or brand ID
            
        Returns:
            QuerySet of products with the specified brand.
        """
        if hasattr(brand, 'pk'):
            brand_id = brand.pk
        else:
            brand_id = brand
        
        return self.filter(brand_id=brand_id)
```

### Verification Checklist
- [ ] by_brand() method defined
- [ ] Handles brand object or ID
- [ ] Has descriptive docstring
- [ ] Filters correctly

---

## Summary of Progress

After completing these tasks, ProductQuerySet has core filter methods:

### QuerySet Methods Added
✓ active() - Filter by ACTIVE status  
✓ published() - Active and webstore-visible  
✓ in_stock() - Placeholder for inventory  
✓ by_category() - Filter by category  
✓ by_brand() - Filter by brand

### Usage Examples
```python
# Get all active products
Product.objects.active()

# Get published products in a category
Product.objects.published().by_category(category_id)

# Get active products by brand
Product.objects.active().by_brand(brand_id)

# Chain multiple filters
Product.objects.published().by_category(1).by_brand(2)
```

---

## Notes for Implementation

1. **Query Optimization**
   - Use select_related for ForeignKeys (category, brand)
   - Use prefetch_related for reverse relations
   - Add only() and defer() for large querysets
   - Monitor query count with django-debug-toolbar

2. **MPTT Category Integration**
   - Implement get_descendants() for child categories
   - Filter: category__in=category.get_descendants(include_self=True)
   - Requires django-mptt or similar

3. **Inventory Integration**
   - in_stock() will annotate with stock quantity
   - Join with inventory table
   - Filter where annotated stock > 0
   - Consider reserved quantities

4. **Performance Considerations**
   - Index status, is_webstore_visible, category_id
   - Composite index on (status, is_webstore_visible)
   - Use database-level indexes
   - Cache frequently accessed queries

---
