# Tasks 76-80: ViewSets & URLs

> **Phase:** 04 - ERP Core Modules Part 1  
> **SubPhase:** 05 - Bundle & Composite Products  
> **Group:** E - Serializers & Views  
> **Document:** 03 of 03  
> **Tasks Covered:** 76, 77, 78, 79, 80

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [02_Tasks-73-75_BOM-Serializers.md](02_Tasks-73-75_BOM-Serializers.md)
- **→ Next Group:** [../Group-F_Testing-Documentation/](../Group-F_Testing-Documentation/)

---

## Document Overview

This document creates DRF ViewSets for CRUD operations on bundles and BOMs, and configures URL routing for API endpoints. ViewSets provide list, create, retrieve, update, and delete operations with proper permissions and filtering.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 76 | Create bundle_views.py | Low | 3 min |
| 77 | Create ProductBundleViewSet | High | 15 min |
| 78 | Create bom_views.py | Low | 3 min |
| 79 | Create BillOfMaterialsViewSet | High | 15 min |
| 80 | Update urls.py | Medium | 10 min |

---

## Task 76: Create bundle_views.py

### Overview
Create views file for bundle endpoints.

### Dependencies
- Task 75: Create BOMItemSerializer

### Instructions

1. **Create file**
   - Path: views/bundle_views.py

2. **Add imports**
   - DRF viewsets, permissions, filters
   - Bundle models and serializers
   - Services for calculations

3. **Add docstring**

### Expected Outcome
File ready for bundle ViewSets.

### Verification Checklist
- [ ] File created
- [ ] Imports added

---

## Task 77: Create ProductBundleViewSet

### Overview
Create ViewSet for bundle CRUD operations.

### Dependencies
- Task 76: Create bundle_views.py

### Instructions

1. **Define ProductBundleViewSet**
   - Inherit from viewsets.ModelViewSet
   - Full CRUD operations

2. **Configure basic attributes**
   - queryset: ProductBundle.objects.active().with_items()
   - serializer_class: BundleDetailSerializer (default)
   - permission_classes: tenant permissions
   - filter_backends: search, filter, ordering

3. **Get serializer class method**
   - Use BundleDetailSerializer for retrieve
   - Use ProductBundleSerializer for list/create
   - Optimize queries per action

4. **Add custom actions**
   - @action check_availability
   - @action calculate_price
   - @action get_limiting_item

5. **Override get_queryset**
   - Filter by tenant automatically
   - Prefetch related data
   - Optimize for action type

6. **Add filtering and search**
   - Filter by bundle_type, is_active
   - Search by product name
   - Order by created_at, product

### ViewSet Structure
```python
class ProductBundleViewSet(viewsets.ModelViewSet):
    queryset = ProductBundle.objects.active().with_items()
    permission_classes = [TenantPermission]
    filter_backends = [SearchFilter, DjangoFilterBackend, OrderingFilter]
    search_fields = ['product__name', 'product__sku']
    filterset_fields = ['bundle_type', 'is_active']
    ordering_fields = ['created_at', 'product__name']
    
    def get_serializer_class(self):
        if self.action == 'retrieve':
            return BundleDetailSerializer
        return ProductBundleSerializer
    
    @action(detail=True, methods=['get'])
    def availability(self, request, pk=None):
        # Check stock availability
        pass
```

### Expected Outcome
Full CRUD ViewSet for bundles with custom actions.

### Verification Checklist
- [ ] ViewSet defined
- [ ] Queryset optimized
- [ ] Serializer selection implemented
- [ ] Custom actions added
- [ ] Filtering configured

---

## Task 78: Create bom_views.py

### Overview
Create views file for BOM endpoints.

### Dependencies
- Task 77: Create ProductBundleViewSet

### Instructions

1. **Create file**
   - Path: views/bom_views.py

2. **Add imports**
   - Similar to bundle views

3. **Add docstring**

### Expected Outcome
File ready for BOM ViewSets.

### Verification Checklist
- [ ] File created
- [ ] Imports added

---

## Task 79: Create BillOfMaterialsViewSet

### Overview
Create ViewSet for BOM CRUD operations.

### Dependencies
- Task 78: Create bom_views.py

### Instructions

1. **Define BillOfMaterialsViewSet**
   - ModelViewSet for BillOfMaterials

2. **Configure attributes**
   - queryset: active BOMs with items
   - serializer_class
   - permissions and filters

3. **Add custom actions**
   - @action calculate_cost
   - @action check_materials
   - @action producible_quantity
   - @action suggest_price

4. **Implement actions**
   - Use CostCalculationService
   - Use ManufacturingStockService
   - Return calculated data

5. **Add filtering**
   - Filter by product, is_active, version
   - Search by product name

### ViewSet Structure
```python
class BillOfMaterialsViewSet(viewsets.ModelViewSet):
    queryset = BillOfMaterials.objects.active().with_items()
    serializer_class = BillOfMaterialsSerializer
    permission_classes = [TenantPermission]
    filterset_fields = ['product', 'is_active']
    
    @action(detail=True, methods=['get'])
    def cost(self, request, pk=None):
        bom = self.get_object()
        service = CostCalculationService(bom)
        return Response({
            'material_cost': service.calculate_material_cost(),
            'total_cost': service.calculate_total_cost(),
            'unit_cost': service.calculate_unit_cost()
        })
    
    @action(detail=True, methods=['get'])
    def producible(self, request, pk=None):
        bom = self.get_object()
        service = ManufacturingStockService(bom)
        return Response({
            'producible_quantity': service.get_producible_quantity()
        })
```

### Expected Outcome
Full CRUD ViewSet for BOMs with cost actions.

### Verification Checklist
- [ ] ViewSet defined
- [ ] Custom actions implemented
- [ ] Services integrated
- [ ] Filtering configured

---

## Task 80: Update urls.py

### Overview
Configure URL routing for bundle and BOM endpoints.

### Dependencies
- Task 79: Create BillOfMaterialsViewSet

### Instructions

1. **Open products/urls.py**
   - Update existing URL configuration

2. **Import ViewSets**
   - Import ProductBundleViewSet
   - Import BillOfMaterialsViewSet

3. **Create router or add to existing**
   - Use DRF DefaultRouter
   - Register bundle viewset
   - Register BOM viewset

4. **Configure URL patterns**
   - /api/v1/bundles/ → ProductBundleViewSet
   - /api/v1/bom/ → BillOfMaterialsViewSet
   - Custom action URLs generated automatically

5. **Add to main urlpatterns**
   - Include router URLs
   - Maintain existing patterns

### URL Configuration
```python
from rest_framework.routers import DefaultRouter
from .views.bundle_views import ProductBundleViewSet
from .views.bom_views import BillOfMaterialsViewSet

router = DefaultRouter()
router.register(r'bundles', ProductBundleViewSet, basename='bundle')
router.register(r'bom', BillOfMaterialsViewSet, basename='bom')

urlpatterns = [
    # Existing patterns...
] + router.urls
```

### Generated Endpoints
```
Bundles:
  GET    /api/v1/bundles/
  POST   /api/v1/bundles/
  GET    /api/v1/bundles/{id}/
  PUT    /api/v1/bundles/{id}/
  PATCH  /api/v1/bundles/{id}/
  DELETE /api/v1/bundles/{id}/
  GET    /api/v1/bundles/{id}/availability/

BOM:
  GET    /api/v1/bom/
  POST   /api/v1/bom/
  GET    /api/v1/bom/{id}/
  PUT    /api/v1/bom/{id}/
  PATCH  /api/v1/bom/{id}/
  DELETE /api/v1/bom/{id}/
  GET    /api/v1/bom/{id}/cost/
  GET    /api/v1/bom/{id}/producible/
```

### Expected Outcome
All bundle and BOM endpoints accessible via REST API.

### Verification Checklist
- [ ] Router configured
- [ ] ViewSets registered
- [ ] URLs included in patterns
- [ ] Endpoints testable

---

## Summary of Tasks 76-80

### What Was Accomplished
- Created bundle views file
- Implemented ProductBundleViewSet with CRUD and custom actions
- Created BOM views file
- Implemented BillOfMaterialsViewSet with cost actions
- Configured URL routing for all endpoints

### API Endpoints Summary
```
Bundle Endpoints:
  - List/Create bundles
  - Retrieve/Update/Delete bundle
  - Check availability
  - Calculate price
  - Get limiting item

BOM Endpoints:
  - List/Create BOMs
  - Retrieve/Update/Delete BOM
  - Calculate costs
  - Check material availability
  - Get producible quantity
  - Suggest selling price
```

### Group E Complete
All serializers, ViewSets, and URL routing implemented for bundles and BOMs. API is fully functional.

---

## Notes for Developers

### Permission Handling
- Use TenantPermission for all ViewSets
- Ensures tenant isolation
- Prevents cross-tenant access

### Query Optimization
- Use select_related for FKs
- Use prefetch_related for reverse FKs
- Optimize per action in get_queryset

### Custom Actions
- Use @action decorator
- Specify methods=['get'] or ['post']
- detail=True for single object
- detail=False for collection

### Error Handling
- Return appropriate HTTP status codes
- Provide clear error messages
- Handle service exceptions gracefully

### API Documentation
- Use DRF schema generation
- Document custom actions
- Provide usage examples
- Include response formats

---
