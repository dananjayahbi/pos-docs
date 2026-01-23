# Tasks 87-88: URLs & Admin Configuration

> **Phase:** 03 - Core Backend Infrastructure  
> **SubPhase:** 05 - Role & Permission System  
> **Group:** F - API Endpoints & Testing  
> **Document:** 03 of 04  
> **Tasks Covered:** 87, 88

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [02_Tasks-81-86_API-Views.md](02_Tasks-81-86_API-Views.md)
- **→ Next Document:** [04_Tasks-89-92_Test-Suite.md](04_Tasks-89-92_Test-Suite.md)

---

## Document Overview

This document covers the creation of URL routing for the role management API and Django admin configuration for all role and permission models. These components expose the API views through RESTful endpoints and provide administrative interfaces for managing roles, permissions, and user-role assignments.

### Tasks in This Document
| Task # | Task Name | Complexity |
|--------|-----------|------------|
| 87 | Create Role URLs | Medium |
| 88 | Register in Admin | Simple |

---

## Task 87: Create Role URLs

### Overview
Create URL routing configuration that maps role management API endpoints to their corresponding views. Use Django REST framework URL patterns with proper versioning and namespacing.

### Dependencies
- Task 81: Create RoleListView
- Task 82: Create RoleDetailView
- Task 83: Create RoleCreateView
- Task 84: Create AssignRoleView
- Task 85: Create RevokeRoleView
- Task 86: Create MyPermissionsView

### Instructions

1. **Update/Create the users app urls.py**
   - Update file `backend/apps/users/urls.py` (or create if not exists)
   - Import necessary views from role_views.py
   - Use Django REST framework URL patterns

2. **Add role API endpoints**
   - Path: `/api/v1/roles/` - List all roles (GET) and create role (POST)
   - Path: `/api/v1/roles/<int:pk>/` - Get, update, delete specific role
   - Use proper URL pattern naming for reverse lookups

3. **Add role action endpoints**
   - Path: `/api/v1/roles/assign/` - Assign role to user (POST)
   - Path: `/api/v1/roles/revoke/` - Remove role from user (POST)
   - These are action endpoints separate from CRUD operations

4. **Add user permission endpoint**
   - Path: `/api/v1/me/permissions/` - Get current user's roles and permissions
   - Use `me` for current authenticated user convention

5. **Configure URL namespacing**
   - Use `app_name = 'users'` for namespace
   - Assign names to all URL patterns
   - Follow naming convention: `role-list`, `role-detail`, `role-assign`, etc.

6. **Include in project urls.py**
   - Ensure users app URLs are included in main project `urls.py`
   - Use proper API version prefix (`api/v1/`)
   - Maintain consistent routing structure

7. **Add URL documentation comments**
   - Document each endpoint with method, path, and purpose
   - Include authentication requirements
   - Note any permission restrictions

### URL Pattern Structure

| Endpoint | View | Methods | Name | Description |
|----------|------|---------|------|-------------|
| `/api/v1/roles/` | RoleListView, RoleCreateView | GET, POST | `role-list` | List/create roles |
| `/api/v1/roles/<int:pk>/` | RoleDetailView | GET, PUT, PATCH, DELETE | `role-detail` | Role CRUD operations |
| `/api/v1/roles/assign/` | AssignRoleView | POST | `role-assign` | Assign role to user |
| `/api/v1/roles/revoke/` | RevokeRoleView | POST | `role-revoke` | Remove role from user |
| `/api/v1/me/permissions/` | MyPermissionsView | GET | `my-permissions` | Current user permissions |

### URL Configuration Example

```python
# backend/apps/users/urls.py
from django.urls import path
from .views.role_views import (
    RoleListView,
    RoleDetailView,
    RoleCreateView,
    AssignRoleView,
    RevokeRoleView,
    MyPermissionsView,
)

app_name = 'users'

urlpatterns = [
    # Role CRUD endpoints
    path('roles/', RoleListView.as_view(), name='role-list'),
    path('roles/<int:pk>/', RoleDetailView.as_view(), name='role-detail'),
    
    # Role action endpoints
    path('roles/assign/', AssignRoleView.as_view(), name='role-assign'),
    path('roles/revoke/', RevokeRoleView.as_view(), name='role-revoke'),
    
    # User permission endpoints
    path('me/permissions/', MyPermissionsView.as_view(), name='my-permissions'),
]
```

### Main Project URLs Integration

```python
# backend/config/urls.py
from django.urls import path, include

urlpatterns = [
    path('api/v1/', include('apps.users.urls', namespace='users')),
    # ... other app URLs
]
```

### API Versioning Strategy

| Version | Path Prefix | Description |
|---------|-------------|-------------|
| v1 | `/api/v1/` | Current stable API |
| Future v2 | `/api/v2/` | Breaking changes (planned) |

### URL Naming Conventions

| Pattern | Example | Purpose |
|---------|---------|---------|
| `<model>-list` | `role-list` | List/create endpoint |
| `<model>-detail` | `role-detail` | Detail CRUD endpoint |
| `<model>-<action>` | `role-assign` | Custom action endpoint |
| `my-<resource>` | `my-permissions` | Current user resource |

### Expected Outcome
```
backend/apps/users/
├── models/
├── serializers/
├── views/
│   └── role_views.py
├── urls.py                  # Role API routes (NEW)
└── admin.py
```

### Verification Checklist
- [ ] `urls.py` exists in `backend/apps/users/`
- [ ] All role views are imported
- [ ] URL patterns for roles CRUD are defined
- [ ] URL patterns for assign/revoke actions are defined
- [ ] My permissions endpoint is defined
- [ ] All URL patterns have names
- [ ] App namespace is configured
- [ ] URLs are included in main project urls
- [ ] URL documentation comments are added
- [ ] API versioning is implemented (v1)

---

## Task 88: Register in Admin

### Overview
Create Django admin configuration for Role, Permission, RolePermission, and UserRole models to provide administrative interfaces for managing the role-permission system.

### Dependencies
- Task 76: Create RolePermission Model
- Task 77: Create UserRole Model

### Instructions

1. **Update the admin.py file**
   - Open file `backend/apps/users/admin.py`
   - Import all role and permission models
   - Import Django admin components

2. **Create RoleAdmin class**
   - Register Role model with custom ModelAdmin
   - Configure list_display: name, slug, hierarchy_level, is_system_role
   - Add search_fields: name, description
   - Add list_filter: is_system_role, tenant
   - Add readonly_fields: slug, created_at, updated_at
   - Order by hierarchy_level descending

3. **Create PermissionAdmin class**
   - Register Permission model with custom ModelAdmin
   - Configure list_display: name, codename, content_type, is_tenant_specific
   - Add search_fields: name, codename
   - Add list_filter: content_type, is_tenant_specific
   - Add readonly_fields: codename
   - Order by content_type, name

4. **Create RolePermissionInline**
   - Create TabularInline for RolePermission
   - Use in RoleAdmin to show permissions inline
   - Configure fields: permission, granted_at
   - Add readonly_fields: granted_at
   - Set extra = 1 for adding new permissions

5. **Create UserRoleInline**
   - Create TabularInline for UserRole
   - Show user-role assignments inline in RoleAdmin
   - Configure fields: user, is_primary, assigned_at
   - Add readonly_fields: assigned_at
   - Set extra = 0 (no empty rows by default)

6. **Register RolePermission model**
   - Register RolePermission with simple admin
   - Configure list_display: role, permission, granted_at
   - Add list_filter: role, granted_at
   - Add search_fields: role__name, permission__name

7. **Register UserRole model**
   - Register UserRole with custom admin
   - Configure list_display: user, role, is_primary, assigned_at
   - Add search_fields: user__email, role__name
   - Add list_filter: is_primary, assigned_at, tenant
   - Add readonly_fields: assigned_at

8. **Add custom admin actions**
   - Add action to bulk assign permissions to roles
   - Add action to bulk assign roles to users
   - Include proper authorization checks

9. **Add admin form validations**
   - Validate hierarchy_level constraints
   - Prevent deletion of system roles
   - Validate permission assignments
   - Check user permissions for role assignments

10. **Configure admin permissions**
    - Override has_delete_permission to protect system roles
    - Override has_change_permission for proper authorization
    - Add custom permissions for role management

### ModelAdmin Configuration Reference

| Admin Class | Key Features |
|-------------|--------------|
| **RoleAdmin** | Inline permissions, hierarchy display, system role protection |
| **PermissionAdmin** | Content type filtering, tenant-specific flags |
| **RolePermissionAdmin** | Simple list view with filtering |
| **UserRoleAdmin** | Primary role indicator, tenant filtering |

### Admin List Display Fields

```python
class RoleAdmin(admin.ModelAdmin):
    list_display = ['name', 'slug', 'hierarchy_level', 'is_system_role', 'tenant']
    search_fields = ['name', 'description']
    list_filter = ['is_system_role', 'hierarchy_level', 'tenant']
    readonly_fields = ['slug', 'created_at', 'updated_at']
    ordering = ['-hierarchy_level', 'name']
    inlines = [RolePermissionInline, UserRoleInline]

class PermissionAdmin(admin.ModelAdmin):
    list_display = ['name', 'codename', 'content_type', 'is_tenant_specific']
    search_fields = ['name', 'codename']
    list_filter = ['content_type', 'is_tenant_specific']
    readonly_fields = ['codename']
    ordering = ['content_type', 'name']

class UserRoleAdmin(admin.ModelAdmin):
    list_display = ['user', 'role', 'is_primary', 'assigned_at', 'tenant']
    search_fields = ['user__email', 'user__first_name', 'role__name']
    list_filter = ['is_primary', 'assigned_at', 'tenant']
    readonly_fields = ['assigned_at']
    ordering = ['-assigned_at']
```

### Inline Configuration

```python
class RolePermissionInline(admin.TabularInline):
    model = RolePermission
    extra = 1
    fields = ['permission', 'granted_at']
    readonly_fields = ['granted_at']
    autocomplete_fields = ['permission']

class UserRoleInline(admin.TabularInline):
    model = UserRole
    extra = 0
    fields = ['user', 'is_primary', 'assigned_at']
    readonly_fields = ['assigned_at']
    autocomplete_fields = ['user']
```

### Custom Admin Methods

| Method | Purpose |
|--------|---------|
| `has_delete_permission` | Prevent deletion of system roles |
| `get_readonly_fields` | Make system roles read-only |
| `save_model` | Validate hierarchy and permissions |
| `get_queryset` | Filter by tenant for multi-tenancy |

### Admin Actions

| Action | Description | Target Model |
|--------|-------------|--------------|
| `assign_permissions` | Bulk assign permissions to selected roles | Role |
| `assign_roles` | Bulk assign roles to selected users | User |
| `revoke_permissions` | Bulk remove permissions from roles | RolePermission |

### System Role Protection

```python
def has_delete_permission(self, request, obj=None):
    if obj and obj.is_system_role:
        return False
    return super().has_delete_permission(request, obj)

def get_readonly_fields(self, request, obj=None):
    readonly = list(super().get_readonly_fields(request, obj))
    if obj and obj.is_system_role:
        readonly.extend(['name', 'slug', 'hierarchy_level'])
    return readonly
```

### Expected Outcome
```
backend/apps/users/
├── models/
│   ├── role.py
│   ├── permission.py
│   ├── role_permission.py
│   └── user_role.py
├── serializers/
├── views/
├── urls.py
└── admin.py                 # Admin configuration (UPDATED)
    ├── class RoleAdmin
    ├── class PermissionAdmin
    ├── class RolePermissionInline
    ├── class UserRoleInline
    ├── class RolePermissionAdmin
    └── class UserRoleAdmin
```

### Verification Checklist
- [ ] All models are registered in admin
- [ ] RoleAdmin has proper list_display fields
- [ ] PermissionAdmin has content_type filtering
- [ ] RolePermissionInline is added to RoleAdmin
- [ ] UserRoleInline is added to RoleAdmin
- [ ] RolePermission standalone admin is configured
- [ ] UserRoleAdmin has proper list and filters
- [ ] Search fields are configured for all admins
- [ ] Readonly fields prevent modification of system data
- [ ] System roles are protected from deletion
- [ ] Admin permissions enforce role hierarchy
- [ ] Tenant filtering is applied where needed
- [ ] Custom admin actions are implemented
- [ ] Admin interface is accessible at /admin/

---

## Summary

### Tasks Completed in This Document
| Task # | Task Name | Key Deliverable |
|--------|-----------|-----------------|
| 87 | Create Role URLs | `urls.py` with role API routes |
| 88 | Register in Admin | Admin configuration for all models |

### API Endpoints Created
```
GET     /api/v1/roles/                  # List all roles
POST    /api/v1/roles/                  # Create new role
GET     /api/v1/roles/<id>/             # Get role details
PUT     /api/v1/roles/<id>/             # Update role
DELETE  /api/v1/roles/<id>/             # Delete role
POST    /api/v1/roles/assign/           # Assign role to user
POST    /api/v1/roles/revoke/           # Revoke role from user
GET     /api/v1/me/permissions/         # Current user permissions
```

### Admin Interfaces Created
- **Role Admin:** Full role management with inline permissions and user assignments
- **Permission Admin:** Permission management with content type filtering
- **RolePermission Admin:** Direct permission-role relationship management
- **UserRole Admin:** User-role assignment management with tenant filtering

### Final Directory Structure
```
backend/apps/users/
├── models/
│   ├── role.py
│   ├── permission.py
│   ├── role_permission.py
│   └── user_role.py
├── serializers/
│   └── role_serializers.py
├── views/
│   └── role_views.py
├── urls.py                  # NEW: Role API routes
└── admin.py                 # UPDATED: Admin configuration
```

### Integration Points

| Component | Integration | Purpose |
|-----------|-------------|---------|
| **URLs** | Main project urls.py | Include users app URLs with /api/v1/ prefix |
| **Admin** | Django admin site | Auto-registered on app initialization |
| **Views** | URL patterns | Map endpoints to view classes |
| **Serializers** | Views | Used by views for request/response handling |

### Next Steps
1. **Test URL routing** with Django's reverse() function
2. **Access admin interface** at http://localhost:8000/admin/
3. Proceed to [04_Tasks-89-92_Test-Suite.md](04_Tasks-89-92_Test-Suite.md) to create comprehensive tests

---

## Notes for AI Agents

1. **URL Naming:** Use kebab-case for URL pattern names (`role-list`, not `role_list`)
2. **API Versioning:** Always include version prefix (`/api/v1/`)
3. **Admin Inlines:** Use TabularInline for cleaner interface than StackedInline
4. **System Role Protection:** Critical - prevent deletion/modification of system roles
5. **Tenant Filtering:** Apply tenant filtering in admin get_queryset methods
6. **Autocomplete Fields:** Use autocomplete_fields for ForeignKey fields to improve UX
7. **Readonly Fields:** Make timestamp fields (created_at, updated_at) readonly
8. **Search Fields:** Include related model fields using double underscore syntax (user__email)
9. **Permissions:** Override admin permission methods for custom authorization logic
10. **URL Reverse:** Test URL reversing with namespace: `reverse('users:role-list')`
