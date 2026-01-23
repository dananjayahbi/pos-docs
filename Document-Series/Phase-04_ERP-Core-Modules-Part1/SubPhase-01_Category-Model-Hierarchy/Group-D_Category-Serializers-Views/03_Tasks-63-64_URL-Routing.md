# Tasks 63-64: URL Routing

> **Phase:** 04 - ERP Core Modules Part 1  
> **SubPhase:** 01 - Category Model & Hierarchy  
> **Group:** D - Category Serializers & Views  
> **Document:** 03 of 03  
> **Tasks Covered:** 63, 64

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [02_Tasks-55-62_ViewSet-CRUD-Actions.md](02_Tasks-55-62_ViewSet-CRUD-Actions.md)
- **→ Next Group:** [../Group-E_Admin-Management-Commands/](../Group-E_Admin-Management-Commands/)

---

## Document Overview

This document covers creating URL patterns and registering the CategoryViewSet with Django REST Framework router.

### Tasks in This Document
| Task # | Task Name | Complexity |
|--------|-----------|------------|
| 63 | Create urls.py File | Low |
| 64 | Register Routes | Low |

---

## Task 63: Create urls.py File

### Overview
Create urls.py file in categories app to define URL patterns.

### Dependencies
- Task 62: Add tree Action

### Instructions

1. **Create urls.py in categories app**
   - Path: backend/apps/categories/urls.py
   - Will contain router configuration

2. **Import required modules**
   - Import DefaultRouter from DRF
   - Import CategoryViewSet from views
   - Import path from django.urls

3. **Add file docstring**
   - Explain URL patterns for categories API
   - List available endpoints

4. **Prepare router configuration**
   - Create router instance
   - Will register viewset in Task 64

### URL File Structure
```
File contents:
1. Docstring
2. Imports (router, viewset, path)
3. Router instantiation
4. ViewSet registration
5. urlpatterns export
```

### Expected Outcome
```
backend/apps/categories/
├── models/
├── serializers.py
├── views.py
└── urls.py                  # NEW: URL routing
```

### Verification Steps
- Check urls.py file exists
- Verify imports are correct
- Confirm docstring present

---

## Task 64: Register Routes

### Overview
Register CategoryViewSet with DRF router to auto-generate RESTful URLs.

### Dependencies
- Task 63: Create urls.py File

### Instructions

1. **Create DefaultRouter instance**
   - from rest_framework.routers import DefaultRouter
   - router = DefaultRouter()

2. **Register CategoryViewSet**
   - router.register(r'categories', CategoryViewSet, basename='category')
   - Generates all CRUD endpoints automatically

3. **Create urlpatterns**
   - urlpatterns = router.urls
   - Exports for inclusion in main URLs

4. **Add app_name for namespacing** (optional)
   - app_name = 'categories'
   - Enables reverse URL lookups

### Router-Generated URLs
| HTTP Method | URL Pattern | View Action | Name |
|-------------|-------------|-------------|------|
| GET | /categories/ | list | category-list |
| POST | /categories/ | create | category-list |
| GET | /categories/{id}/ | retrieve | category-detail |
| PUT | /categories/{id}/ | update | category-detail |
| PATCH | /categories/{id}/ | partial_update | category-detail |
| DELETE | /categories/{id}/ | destroy | category-detail |
| GET | /categories/tree/ | tree (custom) | category-tree |

### URL Configuration Pattern
```
# backend/apps/categories/urls.py

from django.urls import path
from rest_framework.routers import DefaultRouter
from .views import CategoryViewSet

# Create router instance
router = DefaultRouter()

# Register viewset
router.register(r'', CategoryViewSet, basename='category')

# Export URL patterns
urlpatterns = router.urls
```

### Main URLs Integration
This categories urls.py will be included in main API urls:
```
# backend/config/urls.py (or api/urls.py)

from django.urls import path, include

urlpatterns = [
    path('api/v1/categories/', include('apps.categories.urls')),
]
```

### Complete API Endpoints
```
Base URL: /api/v1/categories/

Endpoints:
├── GET    /                      # List all categories
├── POST   /                      # Create category
├── GET    /{id}/                 # Get category detail
├── PUT    /{id}/                 # Update category (full)
├── PATCH  /{id}/                 # Update category (partial)
├── DELETE /{id}/                 # Delete category
└── GET    /tree/                 # Get tree structure
```

### Query Parameters
```
List endpoint supports:
?search=mobile          # Search in name/description
?parent={id}            # Filter by parent
?is_active=true         # Filter by status
?ordering=name          # Order results
?page=2                 # Pagination
```

### Expected Outcome
Complete URL configuration with:
- Router configured
- ViewSet registered
- All REST endpoints available
- Custom tree action included
- Ready for API access

### Verification Steps
- Check router registration syntax
- Verify basename is set
- Confirm urlpatterns exported
- Test endpoint accessibility

---

## Summary

### Tasks Completed in This Document
| Task # | Task Name | Key Deliverable |
|--------|-----------|-----------------|
| 63 | Create urls.py File | URL patterns file created |
| 64 | Register Routes | ViewSet registered with router |

### Complete API Structure
```
Category API (Complete):
├── Models: Category (with MPTT)
├── Managers: CategoryManager (with QuerySet)
├── Serializers:
│   ├── CategorySerializer (base)
│   ├── CategoryListSerializer (list)
│   ├── CategoryDetailSerializer (detail)
│   ├── CategoryTreeSerializer (tree)
│   └── CategoryCreateSerializer (create/update)
├── Views: CategoryViewSet (CRUD + tree action)
└── URLs: Router-based RESTful endpoints
```

### Group D Complete
All 18 tasks in Group D documented:
- Serializers for all use cases
- ViewSet with CRUD operations
- Custom tree action
- URL routing configured

### API Endpoints Available
```
GET    /api/v1/categories/          # List categories
POST   /api/v1/categories/          # Create category
GET    /api/v1/categories/{id}/     # Category detail
PUT    /api/v1/categories/{id}/     # Update category
PATCH  /api/v1/categories/{id}/     # Partial update
DELETE /api/v1/categories/{id}/     # Delete category
GET    /api/v1/categories/tree/     # Tree structure
```

### Dependencies Satisfied for Group E
- Complete API layer exists
- Ready for admin interface
- Ready for management commands

### Next Steps
Proceed to [../Group-E_Admin-Management-Commands/](../Group-E_Admin-Management-Commands/) to create Django admin configuration and management commands.

---

## Notes for AI Agents

1. **DefaultRouter:** Auto-generates RESTful URLs
2. **basename:** Used for URL name generation
3. **urlpatterns:** Export for inclusion in main URLs
4. **Registration:** Single line registers all CRUD endpoints
5. **Custom Actions:** Automatically included by router
6. **Namespacing:** app_name enables reverse lookups
7. **Main URLs:** Include categories URLs in API URLs
8. **Testing:** Test all endpoints after registration
9. **Documentation:** Router generates API documentation
10. **Next Group:** Admin and management commands
