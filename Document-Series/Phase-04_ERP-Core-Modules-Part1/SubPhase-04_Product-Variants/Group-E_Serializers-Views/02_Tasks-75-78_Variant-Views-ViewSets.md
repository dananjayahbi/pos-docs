# Tasks 75-78: Variant Views and ViewSets

> **Phase:** 04 - ERP Core Modules Part 1  
> **SubPhase:** 04 - Product Variants  
> **Group:** E - Serializers & Views  
> **Document:** 02 of 03  
> **Tasks Covered:** 75, 76, 77, 78

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [01_Tasks-67-74_Variant-Serializers.md](01_Tasks-67-74_Variant-Serializers.md)
- **→ Next Document:** [03_Tasks-79-82_Admin-Configuration.md](03_Tasks-79-82_Admin-Configuration.md)

---

## Document Overview

This document covers creating DRF ViewSets for variant CRUD operations and custom actions.

### Tasks in This Document
| Task # | Task Name | Complexity |
|--------|-----------|------------|
| 75 | Create VariantOptionTypeViewSet | Medium |
| 76 | Create VariantOptionValueViewSet | Medium |
| 77 | Create ProductVariantViewSet | High |
| 78 | Add generate_variants Action | High |

---

## Task 75: Create VariantOptionTypeViewSet

### Overview
Create ViewSet for managing variant option types.

### Dependencies
- VariantOptionTypeSerializer (Task 67)

### Instructions

1. **Create variant_views.py**
   - Location: `backend/apps/products/views/variant_views.py`

2. **Define VariantOptionTypeViewSet**
   - Inherit from TenantModelViewSet
   - CRUD operations
   - Filter by active status

### Implementation

```python
from rest_framework import viewsets, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend

from apps.core.views import TenantModelViewSet
from apps.core.permissions import TenantPermission

from ..models import (
    VariantOptionType, VariantOptionValue, ProductVariant
)
from ..serializers.variant_serializers import (
    VariantOptionTypeSerializer,
    VariantOptionValueSerializer,
    ProductVariantSerializer,
    ProductVariantListSerializer,
    ProductVariantDetailSerializer,
)

class VariantOptionTypeViewSet(TenantModelViewSet):
    """
    ViewSet for managing variant option types.
    
    list: Get all option types (Size, Color, etc.)
    create: Create new option type
    retrieve: Get option type details with values
    update: Update option type
    destroy: Delete option type (if no values exist)
    """
    
    queryset = VariantOptionType.objects.all()
    serializer_class = VariantOptionTypeSerializer
    permission_classes = [TenantPermission]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['is_active']
    search_fields = ['name', 'display_name']
    ordering_fields = ['display_order', 'name', 'created_at']
    ordering = ['display_order']
    
    def get_queryset(self):
        """Optimize queryset with annotations."""
        return super().get_queryset().prefetch_related('values')
```

### API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/variant-option-types/ | List all option types |
| POST | /api/variant-option-types/ | Create option type |
| GET | /api/variant-option-types/{id}/ | Get option type details |
| PUT | /api/variant-option-types/{id}/ | Update option type |
| DELETE | /api/variant-option-types/{id}/ | Delete option type |

### Example Request

```bash
# Create option type
POST /api/variant-option-types/
{
  "name": "size",
  "display_name": "Size",
  "display_order": 1,
  "is_active": true
}
```

### Verification Checklist
- [ ] VariantOptionTypeViewSet created
- [ ] CRUD operations working
- [ ] Filtering implemented
- [ ] Search working
- [ ] Ordering working

---

## Task 76: Create VariantOptionValueViewSet

### Overview
Create ViewSet for managing option values.

### Dependencies
- Task 75: VariantOptionTypeViewSet
- VariantOptionValueSerializer (Task 68)

### Instructions

1. **Define VariantOptionValueViewSet**
   - CRUD for option values
   - Filter by option type
   - Handle swatch uploads

### Implementation

```python
class VariantOptionValueViewSet(TenantModelViewSet):
    """
    ViewSet for managing variant option values.
    
    list: Get all option values
    create: Create new option value
    retrieve: Get option value details
    update: Update option value
    destroy: Delete option value (if not used in variants)
    """
    
    queryset = VariantOptionValue.objects.all()
    serializer_class = VariantOptionValueSerializer
    permission_classes = [TenantPermission]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['option_type', 'is_active']
    search_fields = ['value', 'display_value']
    ordering_fields = ['display_order', 'value', 'created_at']
    ordering = ['option_type__display_order', 'display_order']
    
    def get_queryset(self):
        """Optimize queryset."""
        return super().get_queryset().select_related('option_type')
    
    @action(detail=False, methods=['get'])
    def by_type(self, request):
        """Get option values grouped by type."""
        option_type_id = request.query_params.get('type_id')
        
        if not option_type_id:
            return Response({'error': 'type_id required'}, status=400)
        
        values = self.get_queryset().filter(
            option_type_id=option_type_id,
            is_active=True
        )
        
        serializer = self.get_serializer(values, many=True)
        return Response(serializer.data)
```

### Custom Actions

**GET /api/variant-option-values/by_type/?type_id=1**
Returns all values for a specific option type.

### Example Requests

```bash
# Create color option value
POST /api/variant-option-values/
{
  "option_type": 2,
  "value": "red",
  "display_value": "Red",
  "color_swatch": "#FF0000",
  "display_order": 1
}

# Get values for Size option type
GET /api/variant-option-values/by_type/?type_id=1
```

### Verification Checklist
- [ ] VariantOptionValueViewSet created
- [ ] CRUD operations working
- [ ] by_type action implemented
- [ ] Swatch handling working
- [ ] Filtering by type working

---

## Task 77: Create ProductVariantViewSet

### Overview
Create comprehensive ViewSet for product variants with optimized queries.

### Dependencies
- Task 76: VariantOptionValueViewSet
- ProductVariantSerializer (Task 70)

### Instructions

1. **Define ProductVariantViewSet**
   - Use list/detail serializers
   - Optimize queries with prefetch
   - Filter by product, options, status

2. **Add custom filters**
   - Filter by product
   - Filter by option values
   - Filter by stock status

### Implementation

```python
class ProductVariantViewSet(TenantModelViewSet):
    """
    ViewSet for managing product variants.
    
    list: Get all variants (lightweight)
    create: Create new variant
    retrieve: Get variant details (full data)
    update: Update variant
    destroy: Soft-delete variant
    """
    
    queryset = ProductVariant.objects.all()
    permission_classes = [TenantPermission]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['product', 'is_active']
    search_fields = ['sku', 'barcode']
    ordering_fields = ['sku', 'created_at']
    ordering = ['sku']
    
    def get_serializer_class(self):
        """Use different serializers for list/detail."""
        if self.action == 'list':
            return ProductVariantListSerializer
        elif self.action == 'retrieve':
            return ProductVariantDetailSerializer
        return ProductVariantSerializer
    
    def get_queryset(self):
        """Optimize queryset based on action."""
        queryset = super().get_queryset()
        
        if self.action == 'list':
            # Lightweight for lists
            queryset = queryset.select_related('product')
        
        elif self.action == 'retrieve':
            # Full data for detail
            queryset = queryset.select_related(
                'product'
            ).prefetch_related(
                'variant_options__option_value__option_type',
                'prices',
                'stock_entries'
            )
        
        # Apply custom filters
        product_id = self.request.query_params.get('product')
        if product_id:
            queryset = queryset.filter(product_id=product_id)
        
        in_stock = self.request.query_params.get('in_stock')
        if in_stock:
            queryset = queryset.in_stock()
        
        return queryset
    
    @action(detail=False, methods=['get'])
    def by_options(self, request):
        """Find variant by option combination."""
        product_id = request.query_params.get('product')
        option_values = request.query_params.getlist('options[]')
        
        if not product_id or not option_values:
            return Response({
                'error': 'product and options[] required'
            }, status=400)
        
        try:
            variant = ProductVariant.objects.get_by_options(
                product_id=product_id,
                options=[int(ov) for ov in option_values]
            )
            
            if not variant:
                return Response({
                    'error': 'Variant not found'
                }, status=404)
            
            serializer = self.get_serializer(variant)
            return Response(serializer.data)
        
        except Exception as e:
            return Response({'error': str(e)}, status=400)
```

### API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/product-variants/ | List all variants |
| POST | /api/product-variants/ | Create variant |
| GET | /api/product-variants/{id}/ | Get variant details |
| PUT | /api/product-variants/{id}/ | Update variant |
| DELETE | /api/product-variants/{id}/ | Soft-delete variant |
| GET | /api/product-variants/by_options/ | Find by option combo |

### Example Requests

```bash
# List variants for product
GET /api/product-variants/?product=1

# Find variant by options
GET /api/product-variants/by_options/?product=1&options[]=1&options[]=3

# Create variant
POST /api/product-variants/
{
  "product": 1,
  "sku": "TSHIRT-M-RED",
  "option_value_ids": [1, 3],
  "override_price": "1500.00"
}
```

### Verification Checklist
- [ ] ProductVariantViewSet created
- [ ] List/Detail serializers used
- [ ] Query optimization implemented
- [ ] by_options action working
- [ ] Filtering working
- [ ] CRUD operations working

---

## Task 78: Add generate_variants Action

### Overview
Add custom action to auto-generate all variants for a product.

### Dependencies
- Task 77: ProductVariantViewSet
- VariantGenerator service (Group C)

### Instructions

1. **Add generate_variants action**
   - POST endpoint on product
   - Use VariantGenerator service
   - Return created variants

2. **Add validation**
   - Check product exists
   - Check options configured
   - Prevent duplicate generation

### Implementation

```python
from ..services.variant_generator import VariantGenerator

class ProductVariantViewSet(TenantModelViewSet):
    # ... existing code ...
    
    @action(detail=False, methods=['post'])
    def generate_variants(self, request):
        """
        Auto-generate all variants for a product.
        
        POST /api/product-variants/generate_variants/
        {
            "product_id": 1,
            "options": {
                "Size": ["S", "M", "L"],
                "Color": ["Red", "Blue"]
            }
        }
        
        Generates: S-Red, S-Blue, M-Red, M-Blue, L-Red, L-Blue
        """
        product_id = request.data.get('product_id')
        options = request.data.get('options')
        
        if not product_id:
            return Response({
                'error': 'product_id required'
            }, status=400)
        
        if not options:
            return Response({
                'error': 'options required (dict of type: [values])'
            }, status=400)
        
        try:
            from ..models import Product
            product = Product.objects.get(id=product_id)
        except Product.DoesNotExist:
            return Response({
                'error': 'Product not found'
            }, status=404)
        
        # Check if variants already exist
        existing_count = ProductVariant.objects.filter(
            product=product
        ).count()
        
        if existing_count > 0:
            return Response({
                'error': f'Product already has {existing_count} variants. Delete them first.'
            }, status=400)
        
        try:
            # Generate variants
            generator = VariantGenerator(product)
            variants = generator.generate_all_combinations(options)
            
            # Serialize response
            serializer = ProductVariantListSerializer(
                variants,
                many=True
            )
            
            return Response({
                'message': f'Generated {len(variants)} variants',
                'variants': serializer.data
            }, status=201)
        
        except Exception as e:
            return Response({
                'error': f'Generation failed: {str(e)}'
            }, status=400)
```

### Example Usage

```bash
# Generate all variants
POST /api/product-variants/generate_variants/
{
  "product_id": 1,
  "options": {
    "Size": ["S", "M", "L", "XL"],
    "Color": ["Red", "Blue", "Black"]
  }
}

# Response
{
  "message": "Generated 12 variants",
  "variants": [
    {
      "id": 1,
      "sku": "TSHIRT-S-RED",
      "option_display": "Size: S, Color: Red",
      "price": "1200.00",
      "is_active": true
    },
    // ... 11 more variants
  ]
}
```

### Business Use Cases

**Use Case 1: New Product Launch**
```
1. Create base product: T-Shirt
2. Call generate_variants with Size/Color options
3. System creates all 12 combinations
4. Review and adjust prices per variant
```

**Use Case 2: Expand Options**
```
1. Delete old variants (if needed)
2. Generate with expanded options (add XL size)
3. System creates new combinations
```

### Verification Checklist
- [ ] generate_variants action added
- [ ] VariantGenerator integrated
- [ ] Validation implemented
- [ ] Duplicate prevention working
- [ ] Response includes created variants
- [ ] Error handling complete

---

## Summary

### Tasks Completed
| Task # | Task Name | Key Deliverable |
|--------|-----------|-----------------|
| 75 | VariantOptionTypeViewSet | Option type API |
| 76 | VariantOptionValueViewSet | Option value API |
| 77 | ProductVariantViewSet | Variant CRUD API |
| 78 | generate_variants Action | Auto-generation API |

### API Endpoints Summary

**Option Types:**
- GET/POST `/api/variant-option-types/`
- GET/PUT/DELETE `/api/variant-option-types/{id}/`

**Option Values:**
- GET/POST `/api/variant-option-values/`
- GET/PUT/DELETE `/api/variant-option-values/{id}/`
- GET `/api/variant-option-values/by_type/?type_id=1`

**Product Variants:**
- GET/POST `/api/product-variants/`
- GET/PUT/DELETE `/api/product-variants/{id}/`
- GET `/api/product-variants/by_options/?product=1&options[]=1&options[]=3`
- POST `/api/product-variants/generate_variants/`

### Features Delivered

- ✅ Full CRUD for all variant models
- ✅ Optimized queries (select_related/prefetch_related)
- ✅ Custom actions (by_options, generate_variants)
- ✅ Filtering and search
- ✅ List/Detail serializer optimization
- ✅ Bulk variant generation

### Next Steps
1. Proceed to [03_Tasks-79-82_Admin-Configuration.md](03_Tasks-79-82_Admin-Configuration.md) for Django Admin

---

## Notes for AI Agents

1. **ViewSet Optimization:** Use different serializers for list/detail
2. **Query Optimization:** Always prefetch related data
3. **Custom Actions:** Use @action decorator for custom endpoints
4. **Permissions:** All viewsets use TenantPermission
5. **Filtering:** Use DjangoFilterBackend for complex filters
6. **generate_variants:** Critical for bulk operations, must validate existing variants
7. **by_options:** Critical for e-commerce cart/checkout
8. **Error Handling:** Return clear error messages with appropriate status codes
