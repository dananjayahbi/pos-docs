# Tasks 70-77: ViewSets & URLs

> **Phase:** 04 - ERP Core Modules Part 1  
> **SubPhase:** 02 - Attribute System  
> **Group:** E - Serializers & Views  
> **Document:** 02 of 03  
> **Tasks Covered:** 70, 71, 72, 73, 74, 75, 76, 77

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [01_Tasks-63-69_Serializer-Definitions.md](01_Tasks-63-69_Serializer-Definitions.md)
- **→ Next Document:** [03_Tasks-78-80_Admin-Configuration.md](03_Tasks-78-80_Admin-Configuration.md)

---

## Document Overview

This document covers creating DRF ViewSets for CRUD operations, custom actions for filtering, and URL routing configuration.

### Tasks in This Document
| Task # | Task Name | Complexity |
|--------|-----------|------------|
| 70 | Create views.py File | Low |
| 71 | Create AttributeGroupViewSet | Medium |
| 72 | Create AttributeViewSet | Medium |
| 73 | Create AttributeOptionViewSet | Medium |
| 74 | Add by_category Action | High |
| 75 | Add filterable Action | Medium |
| 76 | Create urls.py File | Low |
| 77 | Register Routes | Low |

---

## Task 70: Create views.py File

### Overview
Create the views module for attribute app to house all DRF ViewSets.

### Dependencies
- Task 69: Add Nested Options

### Instructions

1. **Create views.py file**
   - Create: `backend/apps/attributes/views.py`

2. **Import required modules**
   - DRF viewsets, permissions, decorators
   - Serializers from current app
   - Models from current app

3. **Prepare file structure**
   - Module docstring
   - Imports
   - ViewSet classes

### Verification Checklist
- [ ] views.py created
- [ ] Required imports added
- [ ] Valid Python syntax

---

## Task 71: Create AttributeGroupViewSet

### Overview
Create a ViewSet for AttributeGroup with CRUD operations.

### Dependencies
- Task 70: Create views.py File

### Instructions

1. **Create AttributeGroupViewSet class**
   - Inherit from viewsets.ModelViewSet
   - Full CRUD operations

2. **Configure ViewSet**
   - queryset = AttributeGroup.objects.active()
   - serializer_class = AttributeGroupSerializer
   - permission_classes = [IsAuthenticated]
   - lookup_field = 'slug' (optional, use slug for URLs)

3. **Add filtering and ordering**
   - filter_backends: SearchFilter, OrderingFilter
   - search_fields: name, description
   - ordering_fields: display_order, name
   - ordering: ['display_order', 'name']

4. **Add query optimization**
   - Use prefetch_related for attributes

### ViewSet Structure

```python
class AttributeGroupViewSet(viewsets.ModelViewSet):
    """ViewSet for AttributeGroup CRUD operations"""
    queryset = AttributeGroup.objects.active()
    serializer_class = AttributeGroupSerializer
    permission_classes = [IsAuthenticated]
    lookup_field = 'slug'
    filter_backends = [SearchFilter, OrderingFilter]
    search_fields = ['name', 'description']
    ordering_fields = ['display_order', 'name']
    ordering = ['display_order', 'name']
    
    def get_queryset(self):
        return super().get_queryset().prefetch_related('attributes')
```

### API Endpoints Generated

- GET /api/attributes/groups/ - List groups
- POST /api/attributes/groups/ - Create group
- GET /api/attributes/groups/{slug}/ - Retrieve group
- PUT /api/attributes/groups/{slug}/ - Update group
- PATCH /api/attributes/groups/{slug}/ - Partial update
- DELETE /api/attributes/groups/{slug}/ - Delete group

### Verification Checklist
- [ ] AttributeGroupViewSet created
- [ ] queryset configured
- [ ] serializer_class set
- [ ] Permissions configured
- [ ] Filtering added

---

## Task 72: Create AttributeViewSet

### Overview
Create a ViewSet for Attribute with CRUD operations and custom actions.

### Dependencies
- Task 71: Create AttributeGroupViewSet

### Instructions

1. **Create AttributeViewSet class**
   - Inherit from viewsets.ModelViewSet
   - Use different serializers for list/detail

2. **Configure serializer selection**
   - get_serializer_class() method
   - Use AttributeListSerializer for list action
   - Use AttributeDetailSerializer for retrieve action
   - Use AttributeSerializer for other actions

3. **Add filtering**
   - filter_backends: DjangoFilterBackend, SearchFilter, OrderingFilter
   - filterset_fields: attribute_type, is_required, is_filterable, group
   - search_fields: name, description

4. **Add query optimization**
   - prefetch_related for options, categories
   - select_related for group

### ViewSet Structure

```python
class AttributeViewSet(viewsets.ModelViewSet):
    """ViewSet for Attribute CRUD operations"""
    queryset = Attribute.objects.all()
    permission_classes = [IsAuthenticated]
    lookup_field = 'slug'
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['attribute_type', 'is_required', 'is_filterable', 'group']
    search_fields = ['name']
    ordering_fields = ['display_order', 'name']
    ordering = ['group__display_order', 'display_order', 'name']
    
    def get_serializer_class(self):
        if self.action == 'list':
            return AttributeListSerializer
        elif self.action == 'retrieve':
            return AttributeDetailSerializer
        return AttributeSerializer
    
    def get_queryset(self):
        return super().get_queryset().select_related('group').prefetch_related('options', 'categories')
```

### Verification Checklist
- [ ] AttributeViewSet created
- [ ] Multi-serializer setup
- [ ] Filtering configured
- [ ] Query optimization added

---

## Task 73: Create AttributeOptionViewSet

### Overview
Create a ViewSet for AttributeOption with CRUD operations.

### Dependencies
- Task 72: Create AttributeViewSet

### Instructions

1. **Create AttributeOptionViewSet class**
   - Inherit from viewsets.ModelViewSet
   - Full CRUD operations

2. **Configure ViewSet**
   - queryset = AttributeOption.objects.all()
   - serializer_class = AttributeOptionSerializer
   - permission_classes = [IsAuthenticated]

3. **Add filtering**
   - filterset_fields: attribute, is_default
   - ordering: display_order, label

4. **Add query optimization**
   - select_related for attribute

### ViewSet Structure

```python
class AttributeOptionViewSet(viewsets.ModelViewSet):
    """ViewSet for AttributeOption CRUD operations"""
    queryset = AttributeOption.objects.all()
    serializer_class = AttributeOptionSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, OrderingFilter]
    filterset_fields = ['attribute', 'is_default']
    ordering = ['display_order', 'label']
    
    def get_queryset(self):
        return super().get_queryset().select_related('attribute')
```

### Verification Checklist
- [ ] AttributeOptionViewSet created
- [ ] queryset and serializer configured
- [ ] Filtering added
- [ ] Optimization added

---

## Task 74: Add by_category Action

### Overview
Add a custom action to AttributeViewSet that returns attributes for a specific category, including inherited attributes from parent categories.

### Dependencies
- Task 73: Create AttributeOptionViewSet

### Instructions

1. **Add by_category method to AttributeViewSet**
   - Use @action decorator
   - detail=False (collection action)
   - methods=['get']
   - url_path='by-category'

2. **Implement category filtering logic**
   - Accept category_id as query parameter
   - Get category and all parent categories
   - Return attributes assigned to any of these categories
   - Include inherited attributes

3. **Add query optimization**
   - Prefetch options for SELECT/MULTISELECT types
   - Use DetailSerializer for full data

4. **Handle errors**
   - Validate category_id parameter
   - Return 400 if invalid/missing
   - Return 404 if category not found

### Action Implementation

```python
from django.shortcuts import get_object_or_404
from rest_framework.decorators import action
from rest_framework.response import Response
from apps.categories.models import Category

class AttributeViewSet(viewsets.ModelViewSet):
    # ... existing code ...
    
    @action(detail=False, methods=['get'], url_path='by-category')
    def by_category(self, request):
        """Get attributes for a category including inherited from parents"""
        category_id = request.query_params.get('category_id')
        if not category_id:
            return Response(
                {'error': 'category_id parameter is required'},
                status=400
            )
        
        category = get_object_or_404(Category, pk=category_id)
        
        # Get all parent categories
        categories = []
        current = category
        while current:
            categories.append(current.id)
            current = current.parent
        
        # Get attributes for all categories
        attributes = self.get_queryset().filter(
            categories__id__in=categories
        ).distinct()
        
        serializer = AttributeDetailSerializer(attributes, many=True)
        return Response(serializer.data)
```

### API Usage

```
GET /api/attributes/attributes/by-category/?category_id=5
```

### Response Example

```json
[
  {
    "id": 1,
    "name": "Color",
    "slug": "color",
    "attribute_type": "select",
    "options": [
      {"value": "red", "label": "Bright Red", "color_code": "#FF0000"},
      {"value": "blue", "label": "Navy Blue", "color_code": "#000080"}
    ]
  },
  {
    "id": 2,
    "name": "Size",
    "slug": "size",
    "attribute_type": "select",
    "options": [
      {"value": "s", "label": "Small"},
      {"value": "m", "label": "Medium"},
      {"value": "l", "label": "Large"}
    ]
  }
]
```

### Verification Checklist
- [ ] by_category action added
- [ ] Category inheritance handled
- [ ] Error handling implemented
- [ ] Proper serializer used

---

## Task 75: Add filterable Action

### Overview
Add a custom action to AttributeViewSet that returns only filterable attributes (is_filterable=True) for use in webstore filters.

### Dependencies
- Task 74: Add by_category Action

### Instructions

1. **Add filterable method to AttributeViewSet**
   - Use @action decorator
   - detail=False
   - methods=['get']
   - url_path='filterable'

2. **Implement filterable logic**
   - Filter attributes where is_filterable=True
   - Optionally filter by category_id parameter
   - Include options for SELECT/MULTISELECT types
   - Order by group and display_order

3. **Use optimized serializer**
   - Use DetailSerializer to include options
   - Prefetch options

### Action Implementation

```python
@action(detail=False, methods=['get'], url_path='filterable')
def filterable(self, request):
    """Get filterable attributes for webstore filters"""
    queryset = self.get_queryset().filter(is_filterable=True)
    
    # Optional category filtering
    category_id = request.query_params.get('category_id')
    if category_id:
        queryset = queryset.filter(categories__id=category_id).distinct()
    
    serializer = AttributeDetailSerializer(queryset, many=True)
    return Response(serializer.data)
```

### API Usage

```
GET /api/attributes/attributes/filterable/
GET /api/attributes/attributes/filterable/?category_id=5
```

### Use Case

Used by webstore frontend to build filter sidebar:
- Color filter (with color swatches)
- Size filter (with size options)
- Brand filter (text search)
- Price range filter (min/max)

### Verification Checklist
- [ ] filterable action added
- [ ] is_filterable filter applied
- [ ] Optional category filter
- [ ] Options included

---

## Task 76: Create urls.py File

### Overview
Create the URL configuration file for attribute app to define API routes.

### Dependencies
- Task 75: Add filterable Action

### Instructions

1. **Create urls.py file**
   - Create: `backend/apps/attributes/urls.py`

2. **Import required modules**
   - Django REST Framework routers
   - ViewSets from current app

3. **Create router instance**
   - DefaultRouter from DRF
   - Register all ViewSets

4. **Configure app_name**
   - Set app_name = 'attributes' for namespacing

### URL Configuration Structure

```python
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import AttributeGroupViewSet, AttributeViewSet, AttributeOptionViewSet

app_name = 'attributes'

router = DefaultRouter()
# ViewSets will be registered in next task

urlpatterns = [
    path('', include(router.urls)),
]
```

### Verification Checklist
- [ ] urls.py created
- [ ] Router imported and created
- [ ] app_name set
- [ ] urlpatterns defined

---

## Task 77: Register Routes

### Overview
Register all attribute ViewSets with the router to generate API endpoints.

### Dependencies
- Task 76: Create urls.py File

### Instructions

1. **Register AttributeGroupViewSet**
   - router.register('groups', AttributeGroupViewSet, basename='attributegroup')

2. **Register AttributeViewSet**
   - router.register('attributes', AttributeViewSet, basename='attribute')

3. **Register AttributeOptionViewSet**
   - router.register('options', AttributeOptionViewSet, basename='attributeoption')

4. **Verify route generation**
   - Groups: /api/attributes/groups/
   - Attributes: /api/attributes/attributes/
   - Options: /api/attributes/options/

5. **Include in main URLs**
   - Add to main project urls.py
   - path('api/attributes/', include('apps.attributes.urls'))

### Complete URL Configuration

```python
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import AttributeGroupViewSet, AttributeViewSet, AttributeOptionViewSet

app_name = 'attributes'

router = DefaultRouter()
router.register('groups', AttributeGroupViewSet, basename='attributegroup')
router.register('attributes', AttributeViewSet, basename='attribute')
router.register('options', AttributeOptionViewSet, basename='attributeoption')

urlpatterns = [
    path('', include(router.urls)),
]
```

### Generated API Endpoints

**Groups:**
- GET/POST /api/attributes/groups/
- GET/PUT/PATCH/DELETE /api/attributes/groups/{slug}/

**Attributes:**
- GET/POST /api/attributes/attributes/
- GET/PUT/PATCH/DELETE /api/attributes/attributes/{slug}/
- GET /api/attributes/attributes/by-category/?category_id=X
- GET /api/attributes/attributes/filterable/
- GET /api/attributes/attributes/filterable/?category_id=X

**Options:**
- GET/POST /api/attributes/options/
- GET/PUT/PATCH/DELETE /api/attributes/options/{id}/
- GET /api/attributes/options/?attribute=X

### Main URLs Integration

```python
# backend/config/urls.py
urlpatterns = [
    # ... other patterns ...
    path('api/attributes/', include('apps.attributes.urls')),
]
```

### Verification Checklist
- [ ] All ViewSets registered
- [ ] Basenames set correctly
- [ ] Routes verified
- [ ] Included in main URLs

---

## Summary

### Tasks Completed in This Document
| Task # | Task Name | Key Deliverable |
|--------|-----------|-----------------|
| 70 | Create views.py File | Views module created |
| 71 | Create AttributeGroupViewSet | Group CRUD operations |
| 72 | Create AttributeViewSet | Attribute CRUD operations |
| 73 | Create AttributeOptionViewSet | Option CRUD operations |
| 74 | Add by_category Action | Category-based filtering |
| 75 | Add filterable Action | Webstore filter endpoint |
| 76 | Create urls.py File | URL configuration |
| 77 | Register Routes | All routes registered |

### API Endpoints Summary

```
/api/attributes/groups/
  - List, create, retrieve, update, delete groups

/api/attributes/attributes/
  - List, create, retrieve, update, delete attributes
  - /by-category/?category_id=X
  - /filterable/
  - /filterable/?category_id=X

/api/attributes/options/
  - List, create, retrieve, update, delete options
  - ?attribute=X (filter by attribute)
```

### Next Steps
1. Proceed to [03_Tasks-78-80_Admin-Configuration.md](03_Tasks-78-80_Admin-Configuration.md)
2. Configure Django admin interfaces
3. Add inline options editing
4. Add admin filters and search

---

## Notes for AI Agents

1. **ViewSets:** ModelViewSet for full CRUD
2. **Custom Actions:** @action decorator for custom endpoints
3. **Serializer Selection:** Different serializers for list/detail
4. **Query Optimization:** prefetch_related, select_related
5. **Filtering:** DjangoFilterBackend for field filtering
6. **Permissions:** IsAuthenticated for all endpoints
7. **No Code:** Instructions only
