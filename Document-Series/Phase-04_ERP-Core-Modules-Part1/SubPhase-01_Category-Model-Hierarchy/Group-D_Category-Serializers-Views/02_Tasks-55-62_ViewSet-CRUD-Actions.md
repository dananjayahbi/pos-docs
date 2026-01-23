# Tasks 55-62: ViewSet & CRUD Actions

> **Phase:** 04 - ERP Core Modules Part 1  
> **SubPhase:** 01 - Category Model & Hierarchy  
> **Group:** D - Category Serializers & Views  
> **Document:** 02 of 03  
> **Tasks Covered:** 55, 56, 57, 58, 59, 60, 61, 62

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [01_Tasks-47-54_Serializer-Definitions.md](01_Tasks-47-54_Serializer-Definitions.md)
- **→ Next Document:** [03_Tasks-63-64_URL-Routing.md](03_Tasks-63-64_URL-Routing.md)

---

## Document Overview

This document covers creating the CategoryViewSet with all CRUD operations (Create, Read, Update, Delete) and custom actions like tree retrieval.

### Tasks in This Document
| Task # | Task Name | Complexity |
|--------|-----------|------------|
| 55 | Create views.py File | Low |
| 56 | Create CategoryViewSet | Medium |
| 57 | Add list Action | Low |
| 58 | Add retrieve Action | Low |
| 59 | Add create Action | Medium |
| 60 | Add update Action | Medium |
| 61 | Add destroy Action | Medium |
| 62 | Add tree Action | High |

---

## Task 55-56: Create ViewSet Base

### Overview
Create views.py and define CategoryViewSet with base configuration.

### Instructions

1. **Create views.py file**
2. **Import required modules** (ViewSet, permissions, filters)
3. **Define CategoryViewSet** inheriting from ModelViewSet
4. **Set queryset** using Category.objects.active()
5. **Configure permission_classes**
6. **Configure filter_backends**
7. **Add search_fields** (name, description)
8. **Add ordering_fields**

### ViewSet Configuration
```
queryset: Category.objects.active()
permission_classes: IsAuthenticated
filter_backends: DjangoFilterBackend, SearchFilter, OrderingFilter
filterset_fields: ['parent', 'is_active']
search_fields: ['name', 'description']
ordering_fields: ['name', 'display_order', 'created_at']
ordering: ['display_order', 'name']
```

---

## Task 57-58: List & Retrieve Actions

### Overview
Configure list and retrieve actions with appropriate serializers.

### Instructions

1. **Override get_serializer_class method**
   - Return different serializer based on action
   - list → CategoryListSerializer
   - retrieve → CategoryDetailSerializer

2. **Optimize list queryset**
   - Use select_related for parent
   - Use prefetch_related for optimization

3. **Add pagination**
   - Configure page size
   - Enable pagination for list

### Serializer Selection Logic
```
if action == 'list':
    return CategoryListSerializer
elif action == 'retrieve':
    return CategoryDetailSerializer
elif action in ['create', 'update', 'partial_update']:
    return CategoryCreateSerializer
return CategorySerializer
```

---

## Task 59-60: Create & Update Actions

### Overview
Implement create and update actions with validation.

### Instructions

1. **Use CategoryCreateSerializer** for both create and update
2. **Add perform_create override**
   - Set created_by from request.user
   - Auto-generate slug if not provided

3. **Add perform_update override**
   - Set updated_by from request.user
   - Handle slug regeneration

4. **Validate parent relationships**
   - Prevent circular references
   - Check parent exists

### Create/Update Flow
```
1. Validate input data
2. Check permissions
3. Validate parent (not self, not descendant)
4. Generate slug if needed
5. Set audit fields (created_by, updated_by)
6. Save to database
7. Return serialized response
```

---

## Task 61: Destroy Action

### Overview
Implement category deletion with cascade handling.

### Instructions

1. **Use default destroy action**
   - ModelViewSet provides this
   - CASCADE deletes children automatically

2. **Add soft delete option** (future consideration)
   - Alternative to hard delete
   - Set is_active=False instead

3. **Check for dependencies**
   - Check if products exist (when Product model added)
   - Prevent deletion if products exist
   - Or cascade to products

4. **Add permission check**
   - Require admin permission for delete
   - Protect against accidental deletion

### Deletion Considerations
| Approach | Pros | Cons |
|----------|------|------|
| **Hard Delete** | Clean database | Data loss |
| **Soft Delete** | Preserve history | Database bloat |
| **Cascade** | Clean tree | Lose children |
| **Prevent** | Safe | Requires cleanup |

---

## Task 62: Tree Action

### Overview
Add custom tree action to retrieve complete category hierarchy.

### Instructions

1. **Define tree custom action**
   - Use @action decorator
   - detail=False (collection action)
   - methods=['get']

2. **Implement tree retrieval logic**
   - Use CategoryManager.get_tree()
   - Return CategoryTreeSerializer

3. **Add filtering options**
   - active_only parameter
   - root_id parameter (subtree only)

4. **Optimize query**
   - Single query for tree structure
   - Prefetch children relationships

### Tree Action Implementation Concept
```
@action(detail=False, methods=['get'])
def tree(request):
    """
    Get complete category tree structure.
    
    Query params:
    - active_only: Filter active categories
    - root_id: Get subtree from specific root
    """
    active_only = request.query_params.get('active_only', 'true') == 'true'
    tree = Category.objects.get_tree(active_only=active_only)
    serializer = CategoryTreeSerializer(tree, many=True)
    return Response(serializer.data)
```

### Tree Endpoint Features
- Returns nested JSON structure
- Supports filtering by active status
- Can retrieve full tree or subtree
- Single database query
- Efficient with MPTT

---

## Summary

### Tasks Completed
All CRUD operations and tree action implemented:
- list: GET /categories/
- retrieve: GET /categories/{id}/
- create: POST /categories/
- update: PUT/PATCH /categories/{id}/
- destroy: DELETE /categories/{id}/
- tree: GET /categories/tree/

### ViewSet Features
```
CategoryViewSet:
├── Queryset optimization (select/prefetch)
├── Serializer selection by action
├── Permission control
├── Filtering & search
├── Ordering
├── Pagination
├── Audit fields (created_by, updated_by)
└── Custom tree action
```

### Next Steps
Proceed to [03_Tasks-63-64_URL-Routing.md](03_Tasks-63-64_URL-Routing.md) to configure URL patterns.

---

## Notes for AI Agents

1. **ModelViewSet:** Provides all CRUD actions by default
2. **Serializer Selection:** Different serializers per action
3. **Queryset Optimization:** Use select_related and prefetch_related
4. **Audit Fields:** Set created_by and updated_by from request.user
5. **Custom Actions:** Use @action decorator
6. **Tree Action:** Returns nested structure
7. **Permissions:** Configure appropriately for security
8. **Validation:** Handled by serializers
9. **CASCADE:** Deleting parent deletes children
10. **Performance:** Optimize queries for large datasets
