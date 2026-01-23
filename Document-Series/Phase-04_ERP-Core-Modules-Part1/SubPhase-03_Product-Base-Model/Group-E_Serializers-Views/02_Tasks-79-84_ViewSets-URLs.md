# Tasks 79-84: ViewSets & URLs

> **Phase:** 04 - ERP Core Modules Part 1  
> **SubPhase:** 03 - Product Base Model  
> **Group:** E - Serializers & Views  
> **Document:** 02 of 03  
> **Tasks Covered:** 79, 80, 81, 82, 83, 84

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [01_Tasks-71-78_Serializer-Definitions.md](01_Tasks-71-78_Serializer-Definitions.md)
- **→ Next Document:** [03_Tasks-85-86_Admin-Configuration.md](03_Tasks-85-86_Admin-Configuration.md)

---

## Document Overview

This document covers creating DRF ViewSets for CRUD operations, filters, and URL routing.

### Tasks in This Document
| Task # | Task Name | Complexity |
|--------|-----------|------------|
| 79 | Create views.py File | Low |
| 80 | Create BrandViewSet | Medium |
| 81 | Create TaxClassViewSet | Medium |
| 82 | Create ProductViewSet | High |
| 83 | Add ProductFilter | Medium |
| 84 | Create urls.py File | Low |

---

## Task 79: Create views.py File

### Overview
Create the views module for DRF API views.

### Dependencies
- Task 78: Add Auto SKU Generation

### Instructions

1. **Create views.py file**
   - At: `backend/apps/products/views.py`
   - Contains all ViewSets

2. **Import dependencies**
   - DRF viewsets and filters
   - django-filter
   - Product models and serializers

### Expected Outcome
```python
"""
DRF ViewSets for products app API.
"""

from rest_framework import viewsets, filters
from django_filters.rest_framework import DjangoFilterBackend

from apps.products.models import Brand, TaxClass, UnitOfMeasure, Product
from apps.products.serializers import (
    BrandSerializer,
    TaxClassSerializer,
    UnitOfMeasureSerializer,
    ProductListSerializer,
    ProductDetailSerializer,
    ProductCreateSerializer
)


# ViewSets will be defined below
```

### Verification Checklist
- [ ] views.py created
- [ ] All imports present

---

## Tasks 80-81: Supporting Model ViewSets

### Overview
Create ViewSets for Brand and TaxClass models.

### Instructions

**Task 80: BrandViewSet**
1. ModelViewSet for full CRUD
2. Use BrandSerializer
3. queryset filters active brands
4. Add search on name
5. Add filtering on is_active

**Task 81: TaxClassViewSet**
1. ModelViewSet for full CRUD
2. Use TaxClassSerializer
3. All tax classes in queryset
4. Filter on is_default

### Expected Outcome
```python
class BrandViewSet(viewsets.ModelViewSet):
    """
    ViewSet for Brand CRUD operations.
    
    Endpoints:
    - GET /brands/ - List brands
    - POST /brands/ - Create brand
    - GET /brands/{id}/ - Retrieve brand
    - PUT /brands/{id}/ - Update brand
    - DELETE /brands/{id}/ - Delete brand
    
    Filters: is_active
    Search: name
    """
    queryset = Brand.objects.filter(is_active=True)
    serializer_class = BrandSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['is_active']
    search_fields = ['name']


class TaxClassViewSet(viewsets.ModelViewSet):
    """
    ViewSet for TaxClass CRUD operations.
    
    Endpoints:
    - GET /tax-classes/ - List tax classes
    - POST /tax-classes/ - Create tax class
    - GET /tax-classes/{id}/ - Retrieve tax class
    - PUT /tax-classes/{id}/ - Update tax class
    - DELETE /tax-classes/{id}/ - Delete tax class
    
    Filters: is_default
    """
    queryset = TaxClass.objects.all()
    serializer_class = TaxClassSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['is_default']
```

### Verification Checklist
- [ ] Both ViewSets created
- [ ] Inherit from ModelViewSet
- [ ] Querysets configured
- [ ] Filters configured

---

## Task 82: Create ProductViewSet

### Overview
Create comprehensive ProductViewSet with multiple serializers and actions.

### Dependencies
- Task 81: Create TaxClassViewSet

### Instructions

1. **Create ProductViewSet**
   - ModelViewSet for full CRUD
   - Use different serializers for different actions
   - Optimize querysets with select_related
   - Add search and filtering

2. **Configure get_serializer_class**
   - ProductListSerializer for list action
   - ProductDetailSerializer for retrieve action
   - ProductCreateSerializer for create/update/partial_update

3. **Optimize queryset**
   - select_related for ForeignKeys
   - prefetch_related if needed
   - Use manager methods (active(), published())

4. **Add custom actions**
   - published() - return published products
   - featured() - return featured products

### Expected Outcome
```python
class ProductViewSet(viewsets.ModelViewSet):
    """
    ViewSet for Product CRUD operations.
    
    Endpoints:
    - GET /products/ - List products
    - POST /products/ - Create product
    - GET /products/{id}/ - Retrieve product
    - PUT /products/{id}/ - Update product
    - PATCH /products/{id}/ - Partial update
    - DELETE /products/{id}/ - Delete product
    
    Custom Actions:
    - GET /products/published/ - Published products
    - GET /products/featured/ - Featured products
    
    Filters: category, brand, product_type, status, is_webstore_visible
    Search: name, sku, barcode, description
    """
    
    filter_backends = [
        DjangoFilterBackend,
        filters.SearchFilter,
        filters.OrderingFilter
    ]
    search_fields = ['name', 'sku', 'barcode', 'description']
    ordering_fields = ['name', 'created_at', 'updated_at']
    ordering = ['-created_at']
    
    def get_queryset(self):
        """Optimize queryset with select_related."""
        return Product.objects.select_related(
            'category',
            'brand',
            'tax_class',
            'unit_of_measure'
        )
    
    def get_serializer_class(self):
        """Return appropriate serializer based on action."""
        if self.action == 'list':
            return ProductListSerializer
        elif self.action == 'retrieve':
            return ProductDetailSerializer
        else:  # create, update, partial_update
            return ProductCreateSerializer
    
    @action(detail=False, methods=['get'])
    def published(self, request):
        """Return published products (active + webstore visible)."""
        queryset = self.get_queryset().published()
        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def featured(self, request):
        """Return featured products."""
        queryset = self.get_queryset().active().featured()
        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)
```

### Verification Checklist
- [ ] ProductViewSet created
- [ ] get_serializer_class() implemented
- [ ] get_queryset() optimized
- [ ] Custom actions added
- [ ] Search and filters configured

---

## Task 83: Add ProductFilter

### Overview
Create a django-filter FilterSet for advanced product filtering.

### Dependencies
- Task 82: Create ProductViewSet

### Instructions

1. **Create filters.py file**
   - At: `backend/apps/products/filters.py`
   - Contains django-filter FilterSets

2. **Define ProductFilter**
   - Filter by category (including children)
   - Filter by brand
   - Filter by product_type
   - Filter by status
   - Filter by visibility flags
   - Price range filters (when pricing added)

3. **Import in views.py**
   - Add ProductFilter to ProductViewSet
   - Configure filterset_class

### Expected Outcome
```python
# filters.py
"""
Django-filter FilterSets for products app.
"""

import django_filters
from apps.products.models import Product


class ProductFilter(django_filters.FilterSet):
    """
    Advanced filtering for Product model.
    
    Filters:
    - category: Filter by category ID
    - brand: Filter by brand ID
    - product_type: Filter by product type
    - status: Filter by status
    - is_webstore_visible: Filter webstore visibility
    - is_pos_visible: Filter POS visibility
    - featured: Filter featured products
    - search: Search in name, SKU, description
    """
    
    category = django_filters.NumberFilter(field_name='category__id')
    brand = django_filters.NumberFilter(field_name='brand__id')
    product_type = django_filters.ChoiceFilter(choices=Product._meta.get_field('product_type').choices)
    status = django_filters.ChoiceFilter(choices=Product._meta.get_field('status').choices)
    is_webstore_visible = django_filters.BooleanFilter()
    is_pos_visible = django_filters.BooleanFilter()
    featured = django_filters.BooleanFilter()
    
    class Meta:
        model = Product
        fields = [
            'category',
            'brand',
            'product_type',
            'status',
            'is_webstore_visible',
            'is_pos_visible',
            'featured'
        ]


# In views.py - update ProductViewSet:
from apps.products.filters import ProductFilter

class ProductViewSet(viewsets.ModelViewSet):
    # ...existing code...
    filterset_class = ProductFilter
```

### Verification Checklist
- [ ] filters.py created
- [ ] ProductFilter defined
- [ ] All filters configured
- [ ] Imported in views.py

---

## Task 84: Create urls.py File

### Overview
Create URL routing for products API using DRF router.

### Dependencies
- Task 83: Add ProductFilter

### Instructions

1. **Create urls.py file**
   - At: `backend/apps/products/urls.py`
   - Use DRF DefaultRouter

2. **Register ViewSets**
   - Register BrandViewSet
   - Register TaxClassViewSet
   - Register ProductViewSet
   - Configure URL paths

3. **Configure router**
   - Use DefaultRouter for automatic URL patterns
   - Generates list, create, retrieve, update, delete URLs
   - Includes custom actions

### Expected Outcome
```python
"""
URL routing for products app API.
"""

from django.urls import path, include
from rest_framework.routers import DefaultRouter

from apps.products.views import (
    BrandViewSet,
    TaxClassViewSet,
    ProductViewSet
)

app_name = 'products'

router = DefaultRouter()
router.register(r'brands', BrandViewSet, basename='brand')
router.register(r'tax-classes', TaxClassViewSet, basename='taxclass')
router.register(r'products', ProductViewSet, basename='product')

urlpatterns = [
    path('', include(router.urls)),
]
```

### URL Patterns Generated
```
GET    /api/v1/products/brands/               - List brands
POST   /api/v1/products/brands/               - Create brand
GET    /api/v1/products/brands/{id}/          - Retrieve brand
PUT    /api/v1/products/brands/{id}/          - Update brand
DELETE /api/v1/products/brands/{id}/          - Delete brand

GET    /api/v1/products/tax-classes/          - List tax classes
POST   /api/v1/products/tax-classes/          - Create tax class
GET    /api/v1/products/tax-classes/{id}/     - Retrieve tax class
PUT    /api/v1/products/tax-classes/{id}/     - Update tax class
DELETE /api/v1/products/tax-classes/{id}/     - Delete tax class

GET    /api/v1/products/products/             - List products
POST   /api/v1/products/products/             - Create product
GET    /api/v1/products/products/{id}/        - Retrieve product
PUT    /api/v1/products/products/{id}/        - Update product
PATCH  /api/v1/products/products/{id}/        - Partial update
DELETE /api/v1/products/products/{id}/        - Delete product
GET    /api/v1/products/products/published/   - Published products
GET    /api/v1/products/products/featured/    - Featured products
```

### Verification Checklist
- [ ] urls.py created
- [ ] Router configured
- [ ] All ViewSets registered
- [ ] app_name set
- [ ] URL patterns generate correctly

---

## Summary of Deliverables

After completing Group E Document 2:

### ViewSets Created
✓ BrandViewSet - Brand CRUD  
✓ TaxClassViewSet - Tax class CRUD  
✓ ProductViewSet - Product CRUD with custom actions

### Features Implemented
✓ Different serializers per action  
✓ Optimized querysets with select_related  
✓ Custom actions (published, featured)  
✓ Advanced filtering with django-filter  
✓ Search on multiple fields  
✓ URL routing with DRF router

---

## Notes for Implementation

1. **ViewSet Optimization**
   - Use select_related for ForeignKeys
   - Use prefetch_related for reverse relations
   - Add pagination (configure in settings)
   - Monitor query counts

2. **Filtering Best Practices**
   - Combine filters efficiently
   - Use database indexes
   - Cache filter results
   - Validate filter parameters

3. **API Documentation**
   - Use drf-spectacular for OpenAPI
   - Document custom actions
   - Include filter parameters
   - Provide usage examples

4. **Performance**
   - Enable pagination (default 25-50)
   - Use database indexes
   - Cache frequently accessed data
   - Monitor slow queries

---
