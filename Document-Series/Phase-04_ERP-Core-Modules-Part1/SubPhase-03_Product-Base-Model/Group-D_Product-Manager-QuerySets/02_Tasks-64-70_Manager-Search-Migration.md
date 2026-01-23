# Tasks 64-70: Manager, Search & Migration

> **Phase:** 04 - ERP Core Modules Part 1  
> **SubPhase:** 03 - Product Base Model  
> **Group:** D - Product Manager & QuerySets  
> **Document:** 02 of 02  
> **Tasks Covered:** 64, 65, 66, 67, 68, 69, 70

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [01_Tasks-57-63_ProductQuerySet-Filters.md](01_Tasks-57-63_ProductQuerySet-Filters.md)
- **→ Next Group:** [../Group-E_Serializers-Views/](../Group-E_Serializers-Views/)

---

## Document Overview

This document covers adding product type filters, creating the ProductManager with search functionality, and generating migrations.

### Tasks in This Document
| Task # | Task Name | Complexity |
|--------|-----------|------------|
| 64 | Add simple_products Method | Low |
| 65 | Add variable_products Method | Low |
| 66 | Add featured Method | Low |
| 67 | Create ProductManager | Medium |
| 68 | Add search Method | High |
| 69 | Assign Manager to Model | Low |
| 70 | Create Migration | Low |

---

## Tasks 64-66: Product Type and Featured Filters

### Overview
Add filter methods for product types and featured products.

### Dependencies
- Task 63: Add by_brand Method

### Instructions for Task 64: simple_products

1. **Define simple_products method**
   - Filter by product_type=PRODUCT_TYPES.SIMPLE
   - Return self for chaining

### Instructions for Task 65: variable_products

1. **Define variable_products method**
   - Filter by product_type=PRODUCT_TYPES.VARIABLE
   - Return self for chaining

### Instructions for Task 66: featured

1. **Define featured method**
   - Filter by featured=True
   - Usually combined with active() or published()
   - Return self for chaining

### Expected Outcome
```python
    def by_brand(self, brand):
        """[docstring]"""
        return self.filter(brand_id=brand_id)
    
    def simple_products(self):
        """Filter products with type=SIMPLE."""
        return self.filter(product_type=PRODUCT_TYPES.SIMPLE)
    
    def variable_products(self):
        """Filter products with type=VARIABLE (products with variants)."""
        return self.filter(product_type=PRODUCT_TYPES.VARIABLE)
    
    def featured(self):
        """Filter featured products only."""
        return self.filter(featured=True)
```

### Verification Checklist
- [ ] All three methods defined
- [ ] Filter by appropriate constants
- [ ] Return self for chaining
- [ ] Have docstrings

---

## Task 67: Create ProductManager

### Overview
Create the ProductManager class that uses ProductQuerySet.

### Dependencies
- Task 66: Add featured Method

### Instructions

1. **Define ProductManager class**
   - Inherit from models.Manager
   - Use ProductQuerySet as the base queryset
   - Override get_queryset() method

2. **Configure manager to use QuerySet**
   - Return ProductQuerySet in get_queryset()
   - All QuerySet methods become available on manager

3. **Add manager docstring**
   - Explain manager purpose
   - List available methods
   - Show usage examples

### Expected Outcome
```python
class ProductManager(models.Manager):
    """
    Custom manager for Product model.
    
    Uses ProductQuerySet to provide chainable filter methods directly on
    the manager (Product.objects.active(), etc.).
    
    Available methods:
    - active(): Active products
    - published(): Published in webstore
    - in_stock(): Products with inventory
    - by_category(): Filter by category
    - by_brand(): Filter by brand
    - simple_products(), variable_products()
    - featured(): Featured products
    - search(): Full-text search
    
    Usage:
        Product.objects.active()
        Product.objects.published().featured()
        Product.objects.search("laptop")
    """
    
    def get_queryset(self):
        """Return ProductQuerySet as base queryset."""
        return ProductQuerySet(self.model, using=self._db)
```

### Verification Checklist
- [ ] ProductManager class defined
- [ ] Inherits from models.Manager
- [ ] get_queryset() returns ProductQuerySet
- [ ] Has comprehensive docstring

---

## Task 68: Add search Method

### Overview
Add full-text search functionality to ProductManager.

### Dependencies
- Task 67: Create ProductManager

### Instructions

1. **Define search method**
   - Accept search query string
   - Use PostgreSQL SearchVector
   - Search name, description, SKU
   - Weight name higher than description

2. **Configure search fields**
   - SearchVector on name (weight='A')
   - SearchVector on description (weight='B')
   - SearchVector on SKU (weight='A')
   - Combine with SearchQuery

3. **Implement search logic**
   - If query is empty, return all
   - Split query into terms
   - Use SearchVector + SearchQuery
   - Order by relevance (SearchRank)

4. **Add fallback for non-PostgreSQL**
   - Use icontains if SearchVector not available
   - Simple Q object filtering

### Expected Outcome
```python
from django.contrib.postgres.search import SearchVector, SearchQuery, SearchRank

class ProductManager(models.Manager):
    """[docstring]"""
    
    def get_queryset(self):
        """[docstring]"""
        return ProductQuerySet(self.model, using=self._db)
    
    def search(self, query):
        """
        Full-text search on products.
        
        Searches name, SKU, and description with weighted relevance.
        Uses PostgreSQL full-text search for best performance.
        
        Args:
            query (str): Search query string
            
        Returns:
            QuerySet of products ordered by relevance
            
        Usage:
            Product.objects.search("apple iphone")
            Product.objects.search("PRD-ELEC-001")
        """
        if not query:
            return self.get_queryset()
        
        # Try PostgreSQL full-text search
        try:
            search_vector = SearchVector('name', weight='A') + \
                          SearchVector('description', weight='B') + \
                          SearchVector('sku', weight='A')
            search_query = SearchQuery(query)
            
            return self.get_queryset().annotate(
                rank=SearchRank(search_vector, search_query)
            ).filter(
                rank__gte=0.1
            ).order_by('-rank')
        
        except Exception:
            # Fallback for non-PostgreSQL databases
            return self.get_queryset().filter(
                Q(name__icontains=query) |
                Q(description__icontains=query) |
                Q(sku__icontains=query)
            )
```

### Verification Checklist
- [ ] search() method defined
- [ ] Uses PostgreSQL SearchVector
- [ ] Weighted search (name and SKU > description)
- [ ] Has fallback for non-PostgreSQL
- [ ] Comprehensive docstring

---

## Task 69: Assign Manager to Model

### Overview
Assign the ProductManager to the Product model.

### Dependencies
- Task 68: Add search Method

### Instructions

1. **Import managers in product.py**
   - Add import statement at top of file
   - Import ProductManager

2. **Assign manager to Product model**
   - Add class attribute: objects = ProductManager()
   - Replaces default manager
   - All QuerySet methods now available

3. **Place manager assignment**
   - After all fields, before methods
   - Before __str__() method
   - Standard Django convention

### Expected Outcome
```python
# In product.py
from .managers import ProductManager

class Product(BaseModel):
    """[docstring]"""
    
    # All fields...
    featured = models.BooleanField(...)
    
    # Manager
    objects = ProductManager()
    
    def __str__(self):
        return self.name
    
    class Meta:
        # ...
```

### Verification Checklist
- [ ] ProductManager imported in product.py
- [ ] objects = ProductManager() assigned
- [ ] Placed before methods
- [ ] No syntax errors

---

## Task 70: Create Migration

### Overview
Generate Django migration for all product models.

### Dependencies
- Task 69: Assign Manager to Model

### Instructions

1. **Run makemigrations command**
   - Execute: `python manage.py makemigrations products`
   - From backend directory
   - Generates migration file

2. **Review migration file**
   - Check all models included (Brand, TaxClass, UnitOfMeasure, Product)
   - Verify all fields present
   - Check foreign key relationships
   - Review indexes and constraints

3. **Understand migration contents**
   - CreateModel operations for each model
   - Field definitions with types
   - Indexes and constraints
   - ForeignKey relationships

4. **Prepare for migration execution**
   - Migration will run separately per tenant
   - django-tenants handles tenant schemas
   - Run migrate command separately

5. **Migration naming**
   - Django auto-names: 0001_initial.py
   - Contains all product models
   - First migration for products app

### Expected Migration Structure
```
products/migrations/
├── __init__.py
└── 0001_initial.py  # Contains Brand, TaxClass, UoM, Product
```

### Verification Checklist
- [ ] Migration file generated
- [ ] All models included
- [ ] Foreign keys configured correctly
- [ ] Indexes present
- [ ] No migration errors

---

## Summary of Deliverables

After completing Group D, managers and querysets are complete:

### Complete Manager System
```python
# managers.py
class ProductQuerySet(models.QuerySet):
    - active()
    - published()
    - in_stock()
    - by_category()
    - by_brand()
    - simple_products()
    - variable_products()
    - featured()

class ProductManager(models.Manager):
    - get_queryset() → ProductQuerySet
    - search(query) → Full-text search

# product.py
class Product(BaseModel):
    # ...fields...
    objects = ProductManager()
```

### Migration Created
✓ 0001_initial.py with all product models  
✓ All fields, indexes, and constraints  
✓ Ready for database schema creation

---

## Notes for Implementation

1. **Full-Text Search Configuration**
   - Create GIN index for search performance
   - Add search vector column if needed
   - Configure PostgreSQL text search
   - Consider language-specific configurations

2. **Search Optimization**
   - Trigram similarity for fuzzy search
   - Search vector updates on save
   - Materialized search columns
   - Search result caching

3. **Manager Methods Usage**
   - Chain methods: .published().featured()
   - Combine with standard QuerySet methods
   - Use in views and serializers
   - Performance monitoring

4. **Migration Execution**
   - Run migrations per tenant schema
   - Test in development first
   - Backup before production migration
   - Monitor migration performance

---
