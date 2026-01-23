# Tasks 81-86: API Views

> **Phase:** 03 - Core Backend Infrastructure  
> **SubPhase:** 05 - Role & Permission System  
> **Group:** F - API Endpoints & Testing  
> **Document:** 02 of 04  
> **Tasks Covered:** 81, 82, 83, 84, 85, 86

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [01_Tasks-79-80_Serializers.md](01_Tasks-79-80_Serializers.md)
- **→ Next Document:** [03_Tasks-87-88_URLs-Admin.md](03_Tasks-87-88_URLs-Admin.md)

---

## Document Overview

This document covers the creation of REST API views for role and permission management. These views provide endpoints for listing roles, viewing role details, creating custom roles, assigning/revoking roles, and viewing current user permissions.

### Tasks in This Document
| Task # | Task Name | Complexity |
|--------|-----------|------------|
| 81 | Create RoleListView | Medium |
| 82 | Create RoleDetailView | Medium |
| 83 | Create RoleCreateView | Medium |
| 84 | Create AssignRoleView | Complex |
| 85 | Create RevokeRoleView | Medium |
| 86 | Create MyPermissionsView | Simple |

---

## Task 81: Create RoleListView

### Overview
Create an API view to list all roles available in the current tenant, accessible to authenticated users.

### Dependencies
- Task 79: Create Role Serializers
- Task 58: Create Permission Classes

### Instructions

1. **Create role_views.py file**
   - Create file at `backend/apps/users/views/role_views.py`
   - Import required DRF modules

2. **Import dependencies**
   ```python
   from rest_framework import generics, status
   from rest_framework.views import APIView
   from rest_framework.response import Response
   from rest_framework.permissions import IsAuthenticated
   from django.shortcuts import get_object_or_404
   
   from apps.users.models import Role, UserRole
   from apps.users.serializers.role_serializers import (
       RoleSerializer, 
       RoleDetailSerializer,
       AssignRoleSerializer,
       RevokeRoleSerializer
   )
   from apps.users.permissions import IsTenantAdmin
   ```

3. **Create RoleListView class**
   - Extend `generics.ListAPIView`
   - Use `RoleSerializer` for serialization
   - Apply `IsAuthenticated` permission class

4. **Implement get_queryset method**
   - Filter roles by current tenant
   - Order by hierarchy_level and name
   - Include only active roles

5. **Add filtering and search capabilities**
   - Support filtering by hierarchy_level
   - Support filtering by is_system_role
   - Support search by name and description

6. **Add pagination**
   - Use default pagination class
   - Support page_size query parameter

7. **Add query parameter documentation**
   - Document available filters in docstring
   - Include usage examples

### Implementation Details

**View Class Structure:**
```python
class RoleListView(generics.ListAPIView):
    """
    List all roles for the current tenant.
    
    Query Parameters:
    - hierarchy_level: Filter by hierarchy level (int)
    - is_system: Filter system roles (true/false)
    - search: Search in name and description
    - page: Page number
    - page_size: Results per page
    """
    serializer_class = RoleSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        tenant = self.request.user.tenant
        queryset = Role.objects.filter(
            tenant=tenant
        ).order_by('hierarchy_level', 'name')
        
        # Apply filters
        hierarchy_level = self.request.query_params.get('hierarchy_level')
        if hierarchy_level:
            queryset = queryset.filter(hierarchy_level=hierarchy_level)
        
        is_system = self.request.query_params.get('is_system')
        if is_system is not None:
            is_system_bool = is_system.lower() == 'true'
            queryset = queryset.filter(is_system_role=is_system_bool)
        
        search = self.request.query_params.get('search')
        if search:
            queryset = queryset.filter(
                Q(name__icontains=search) | 
                Q(description__icontains=search)
            )
        
        return queryset
```

### Expected Outcome
```
backend/apps/users/views/
└── role_views.py              # Created
    └── class RoleListView     # Implemented
```

### Verification Checklist
- [ ] `role_views.py` file created
- [ ] RoleListView class implemented
- [ ] Tenant filtering applied
- [ ] IsAuthenticated permission applied
- [ ] Query parameters supported
- [ ] Proper ordering implemented
- [ ] Docstring documentation added
- [ ] Imports are correct

---

## Task 82: Create RoleDetailView

### Overview
Create an API view to retrieve detailed information about a specific role, including its permissions.

### Dependencies
- Task 79: Create Role Serializers
- Task 81: Create RoleListView

### Instructions

1. **Create RoleDetailView class**
   - Add to `role_views.py`
   - Extend `generics.RetrieveAPIView`
   - Use `RoleDetailSerializer` for detailed info

2. **Configure view properties**
   - Set serializer_class to RoleDetailSerializer
   - Apply IsAuthenticated permission
   - Use 'pk' as lookup field

3. **Implement get_queryset method**
   - Filter by tenant
   - Include permissions prefetch
   - Optimize query with select_related

4. **Add permission checks**
   - Verify role belongs to user's tenant
   - Return 404 if not found or wrong tenant

5. **Handle system roles**
   - Include is_system_role flag in response
   - Add parent role information if exists

### Implementation Details

**View Class Structure:**
```python
class RoleDetailView(generics.RetrieveAPIView):
    """
    Retrieve detailed information about a specific role.
    
    Returns:
    - Role details
    - Associated permissions
    - Parent role information (if applicable)
    """
    serializer_class = RoleDetailSerializer
    permission_classes = [IsAuthenticated]
    lookup_field = 'pk'
    
    def get_queryset(self):
        tenant = self.request.user.tenant
        return Role.objects.filter(
            tenant=tenant
        ).prefetch_related(
            'permissions'
        ).select_related('parent')
    
    def get_object(self):
        obj = super().get_object()
        # Ensure role belongs to user's tenant
        if obj.tenant != self.request.user.tenant:
            raise Http404("Role not found")
        return obj
```

### Security Considerations
- **Tenant Isolation:** Always verify role belongs to requester's tenant
- **Permission Visibility:** Only show permissions for roles in user's tenant
- **System Role Protection:** Mark system roles as read-only

### Expected Outcome
```
backend/apps/users/views/role_views.py
├── class RoleListView          # Already exists
└── class RoleDetailView        # Added
```

### Verification Checklist
- [ ] RoleDetailView class created
- [ ] RoleDetailSerializer used
- [ ] Tenant filtering enforced
- [ ] Permissions prefetched
- [ ] Parent role included
- [ ] 404 handling implemented
- [ ] Docstring added

---

## Task 83: Create RoleCreateView

### Overview
Create an API view to create custom roles. Only tenant administrators can create roles. System roles cannot be created via API.

### Dependencies
- Task 79: Create Role Serializers
- Task 58: Create IsTenantAdmin Permission

### Instructions

1. **Create RoleCreateView class**
   - Add to `role_views.py`
   - Extend `generics.CreateAPIView`
   - Use RoleSerializer for creation

2. **Apply permission classes**
   - Require IsAuthenticated
   - Require IsTenantAdmin
   - Only tenant admins can create roles

3. **Implement perform_create method**
   - Auto-assign current tenant
   - Set is_system_role to False
   - Validate hierarchy_level
   - Generate slug from name

4. **Add validation logic**
   - Prevent duplicate role names per tenant
   - Validate hierarchy_level range (1-100)
   - Validate parent role exists in same tenant
   - Ensure parent hierarchy_level < current

5. **Handle permissions assignment**
   - Accept permissions list in request
   - Validate permissions exist
   - Only assign permissions for current tenant

6. **Add error handling**
   - Return 400 for validation errors
   - Return 403 if not tenant admin
   - Return 409 for duplicate names

### Implementation Details

**View Class Structure:**
```python
class RoleCreateView(generics.CreateAPIView):
    """
    Create a new custom role (tenant admin only).
    
    Body:
    {
        "name": "Custom Manager",
        "description": "Custom role description",
        "hierarchy_level": 50,
        "parent": 1,  // optional
        "permissions": [1, 2, 3]  // optional
    }
    
    Restrictions:
    - Only tenant admins can create roles
    - Cannot create system roles via API
    - Role name must be unique within tenant
    """
    serializer_class = RoleSerializer
    permission_classes = [IsAuthenticated, IsTenantAdmin]
    
    def perform_create(self, serializer):
        # Auto-assign tenant
        tenant = self.request.user.tenant
        
        # Validate parent role if provided
        parent = serializer.validated_data.get('parent')
        if parent and parent.tenant != tenant:
            raise ValidationError("Parent role must belong to the same tenant")
        
        # Ensure not creating system role
        if serializer.validated_data.get('is_system_role', False):
            raise ValidationError("Cannot create system roles via API")
        
        # Save role with tenant
        role = serializer.save(
            tenant=tenant,
            is_system_role=False,
            created_by=self.request.user
        )
        
        # Assign permissions if provided
        permission_ids = self.request.data.get('permissions', [])
        if permission_ids:
            permissions = Permission.objects.filter(
                id__in=permission_ids,
                tenant=tenant
            )
            role.permissions.set(permissions)
        
        return role
```

### Validation Rules

| Field | Rule | Error Message |
|-------|------|---------------|
| **name** | Unique per tenant | "Role name already exists" |
| **hierarchy_level** | Between 1-100 | "Hierarchy level must be 1-100" |
| **parent** | Same tenant | "Parent must be in same tenant" |
| **parent.hierarchy_level** | Less than current | "Parent must have lower hierarchy" |
| **is_system_role** | Must be False | "Cannot create system roles" |

### Expected Outcome
```
backend/apps/users/views/role_views.py
├── class RoleListView          # Already exists
├── class RoleDetailView        # Already exists
└── class RoleCreateView        # Added
```

### Verification Checklist
- [ ] RoleCreateView class created
- [ ] IsTenantAdmin permission applied
- [ ] Tenant auto-assigned
- [ ] System role creation blocked
- [ ] Name uniqueness validated
- [ ] Hierarchy level validated
- [ ] Parent role validated
- [ ] Permissions assignment handled
- [ ] Error messages clear

---

## Task 84: Create AssignRoleView

### Overview
Create an API view to assign a role to a user within the same tenant. Handles primary role logic and hierarchy validation.

### Dependencies
- Task 79: Create AssignRoleSerializer
- Task 55: Create UserRole Model

### Instructions

1. **Create AssignRoleView class**
   - Add to `role_views.py`
   - Extend `APIView` for custom logic
   - Use POST method

2. **Apply permission classes**
   - Require IsAuthenticated
   - Require IsTenantAdmin
   - Only admins can assign roles

3. **Implement post method**
   - Accept user_id, role_id, is_primary
   - Validate user belongs to tenant
   - Validate role belongs to tenant
   - Check role hierarchy rules

4. **Handle primary role logic**
   - If is_primary=True, unset other primary roles
   - User can have only one primary role
   - Prevent primary role removal if it's the only role

5. **Validate hierarchy constraints**
   - Users cannot assign roles higher than their own
   - Tenant admins can assign any role
   - Superusers bypass all checks

6. **Create UserRole record**
   - Create UserRole with tenant reference
   - Set is_primary flag
   - Set assigned_by to current user
   - Set assigned_at timestamp

7. **Handle duplicate assignments**
   - Check if role already assigned
   - Update is_primary if already exists
   - Return existing assignment

8. **Return response**
   - Return 201 Created on success
   - Include created UserRole details
   - Return 400 for validation errors

### Implementation Details

**View Class Structure:**
```python
class AssignRoleView(APIView):
    """
    Assign a role to a user (tenant admin only).
    
    POST Body:
    {
        "user_id": 123,
        "role_id": 456,
        "is_primary": false
    }
    
    Hierarchy Rules:
    - Admins cannot assign roles higher than their own
    - Tenant admins can assign any role
    - Superusers bypass all checks
    """
    permission_classes = [IsAuthenticated, IsTenantAdmin]
    
    def post(self, request):
        serializer = AssignRoleSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        tenant = request.user.tenant
        user_id = serializer.validated_data['user_id']
        role_id = serializer.validated_data['role_id']
        is_primary = serializer.validated_data.get('is_primary', False)
        
        # Validate user
        try:
            user = User.objects.get(id=user_id, tenant=tenant)
        except User.DoesNotExist:
            return Response(
                {'error': 'User not found in your tenant'},
                status=status.HTTP_404_NOT_FOUND
            )
        
        # Validate role
        try:
            role = Role.objects.get(id=role_id, tenant=tenant)
        except Role.DoesNotExist:
            return Response(
                {'error': 'Role not found in your tenant'},
                status=status.HTTP_404_NOT_FOUND
            )
        
        # Check hierarchy constraints
        if not request.user.is_superuser:
            current_user_max_hierarchy = request.user.get_roles().aggregate(
                max_level=Max('hierarchy_level')
            )['max_level'] or 0
            
            if role.hierarchy_level < current_user_max_hierarchy:
                return Response(
                    {'error': 'Cannot assign role with higher privileges than your own'},
                    status=status.HTTP_403_FORBIDDEN
                )
        
        # Check if already assigned
        user_role, created = UserRole.objects.get_or_create(
            user=user,
            role=role,
            tenant=tenant,
            defaults={
                'is_primary': is_primary,
                'assigned_by': request.user
            }
        )
        
        if not created:
            # Update is_primary if needed
            if is_primary and not user_role.is_primary:
                # Unset other primary roles
                UserRole.objects.filter(
                    user=user,
                    tenant=tenant,
                    is_primary=True
                ).update(is_primary=False)
                
                user_role.is_primary = True
                user_role.save()
        else:
            # New assignment
            if is_primary:
                # Unset other primary roles
                UserRole.objects.filter(
                    user=user,
                    tenant=tenant,
                    is_primary=True
                ).exclude(id=user_role.id).update(is_primary=False)
        
        # Clear user permissions cache
        if hasattr(user, '_cached_permissions'):
            delattr(user, '_cached_permissions')
        
        return Response(
            {
                'message': 'Role assigned successfully',
                'user_role': {
                    'id': user_role.id,
                    'user': user.email,
                    'role': role.name,
                    'is_primary': user_role.is_primary,
                    'assigned_at': user_role.assigned_at
                }
            },
            status=status.HTTP_201_CREATED if created else status.HTTP_200_OK
        )
```

### Hierarchy Validation Logic

```
User's Max Hierarchy Level: 30
Attempting to Assign Role with Level: 20

20 < 30? YES → FORBIDDEN
(Lower hierarchy number = Higher privilege)

Tenant Admin → Can assign any role
Superuser → Bypasses all checks
```

### Primary Role Logic

```
User has roles: [Manager(primary), Cashier]
Assign: Supervisor(primary=True)

Result:
- Manager(primary=False)
- Cashier(primary=False)
- Supervisor(primary=True) ← New primary
```

### Expected Outcome
```
backend/apps/users/views/role_views.py
├── class RoleListView          # Already exists
├── class RoleDetailView        # Already exists
├── class RoleCreateView        # Already exists
└── class AssignRoleView        # Added
```

### Verification Checklist
- [ ] AssignRoleView class created
- [ ] User validation implemented
- [ ] Role validation implemented
- [ ] Tenant isolation enforced
- [ ] Hierarchy validation working
- [ ] Primary role logic correct
- [ ] Duplicate handling works
- [ ] Permission cache cleared
- [ ] Proper HTTP status codes
- [ ] Error messages clear

---

## Task 85: Create RevokeRoleView

### Overview
Create an API view to remove a role assignment from a user. Prevents removal of last role or system role assignments under certain conditions.

### Dependencies
- Task 79: Create RevokeRoleSerializer
- Task 84: Create AssignRoleView

### Instructions

1. **Create RevokeRoleView class**
   - Add to `role_views.py`
   - Extend `APIView`
   - Use POST method

2. **Apply permission classes**
   - Require IsAuthenticated
   - Require IsTenantAdmin

3. **Implement post method**
   - Accept user_id and role_id
   - Validate both exist in tenant
   - Check if role is assigned

4. **Add protection rules**
   - Prevent removing user's only role
   - Prevent removing primary role without replacement
   - Warn if removing system role

5. **Handle primary role removal**
   - If removing primary role, promote next highest
   - Auto-select new primary based on hierarchy
   - Update user's effective permissions

6. **Delete UserRole record**
   - Remove UserRole assignment
   - Log the removal action
   - Clear permission caches

7. **Return response**
   - Return 200 OK on success
   - Return 400 if last role
   - Return 404 if assignment not found

### Implementation Details

**View Class Structure:**
```python
class RevokeRoleView(APIView):
    """
    Remove a role assignment from a user (tenant admin only).
    
    POST Body:
    {
        "user_id": 123,
        "role_id": 456
    }
    
    Protections:
    - Cannot remove user's only role
    - Automatically promotes new primary if removing primary role
    - Logs all role removals
    """
    permission_classes = [IsAuthenticated, IsTenantAdmin]
    
    def post(self, request):
        serializer = RevokeRoleSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        tenant = request.user.tenant
        user_id = serializer.validated_data['user_id']
        role_id = serializer.validated_data['role_id']
        
        # Validate user
        try:
            user = User.objects.get(id=user_id, tenant=tenant)
        except User.DoesNotExist:
            return Response(
                {'error': 'User not found in your tenant'},
                status=status.HTTP_404_NOT_FOUND
            )
        
        # Validate role assignment exists
        try:
            user_role = UserRole.objects.get(
                user=user,
                role_id=role_id,
                tenant=tenant
            )
        except UserRole.DoesNotExist:
            return Response(
                {'error': 'Role assignment not found'},
                status=status.HTTP_404_NOT_FOUND
            )
        
        # Check if this is the user's only role
        user_role_count = UserRole.objects.filter(
            user=user,
            tenant=tenant
        ).count()
        
        if user_role_count == 1:
            return Response(
                {'error': 'Cannot remove user\'s only role'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Check if removing primary role
        was_primary = user_role.is_primary
        role_name = user_role.role.name
        
        # Delete the role assignment
        user_role.delete()
        
        # If was primary, promote next highest role
        if was_primary:
            next_primary = UserRole.objects.filter(
                user=user,
                tenant=tenant
            ).order_by('role__hierarchy_level').first()
            
            if next_primary:
                next_primary.is_primary = True
                next_primary.save()
        
        # Clear user permissions cache
        if hasattr(user, '_cached_permissions'):
            delattr(user, '_cached_permissions')
        
        return Response(
            {
                'message': f'Role "{role_name}" revoked successfully',
                'user': user.email,
                'new_primary_role': next_primary.role.name if was_primary and next_primary else None
            },
            status=status.HTTP_200_OK
        )
```

### Protection Rules

| Scenario | Action | Response |
|----------|--------|----------|
| **Only Role** | Prevent removal | 400 - Cannot remove only role |
| **Primary Role** | Remove + promote next | 200 - New primary assigned |
| **Non-Primary** | Remove normally | 200 - Role revoked |
| **Not Assigned** | Cannot remove | 404 - Assignment not found |
| **Wrong Tenant** | Prevent access | 404 - User not found |

### Primary Role Promotion Logic

```
Before Removal:
- Manager (primary, level=20) ← Removing
- Supervisor (level=30)
- Cashier (level=40)

After Removal:
- Supervisor (primary, level=30) ← Auto-promoted
- Cashier (level=40)

Selection: Lowest hierarchy_level = Highest privilege
```

### Expected Outcome
```
backend/apps/users/views/role_views.py
├── class RoleListView          # Already exists
├── class RoleDetailView        # Already exists
├── class RoleCreateView        # Already exists
├── class AssignRoleView        # Already exists
└── class RevokeRoleView        # Added
```

### Verification Checklist
- [ ] RevokeRoleView class created
- [ ] User validation implemented
- [ ] Role assignment validation works
- [ ] Last role protection active
- [ ] Primary role promotion works
- [ ] Permission cache cleared
- [ ] Descriptive response messages
- [ ] Proper HTTP status codes

---

## Task 86: Create MyPermissionsView

### Overview
Create an API view that returns the current authenticated user's roles and effective permissions. This is useful for frontend permission checks.

### Dependencies
- Task 79: Create Role Serializers
- Task 56: Implement User Permission Methods

### Instructions

1. **Create MyPermissionsView class**
   - Add to `role_views.py`
   - Extend `APIView`
   - Use GET method

2. **Apply permission classes**
   - Require IsAuthenticated only
   - Any authenticated user can view their own permissions

3. **Implement get method**
   - Get current user from request
   - Retrieve all user roles
   - Retrieve all effective permissions
   - Include permission inheritance

4. **Structure response data**
   - List of roles with details
   - List of permission codenames
   - Primary role indication
   - Permission source (role hierarchy)

5. **Include role hierarchy**
   - Show inherited permissions
   - Indicate permission source role
   - Display hierarchy level

6. **Optimize queries**
   - Use prefetch_related for roles
   - Use select_related for permissions
   - Cache results if possible

7. **Add helpful metadata**
   - User's primary role
   - Highest hierarchy level
   - Total permission count
   - Is tenant admin flag

### Implementation Details

**View Class Structure:**
```python
class MyPermissionsView(APIView):
    """
    Get current user's roles and effective permissions.
    
    Returns:
    {
        "user": {
            "id": 123,
            "email": "user@example.com",
            "is_tenant_admin": true
        },
        "primary_role": {
            "id": 1,
            "name": "Manager",
            "hierarchy_level": 20
        },
        "roles": [
            {
                "id": 1,
                "name": "Manager",
                "is_primary": true,
                "hierarchy_level": 20
            }
        ],
        "permissions": [
            "view_product",
            "add_product",
            "change_product"
        ],
        "permission_details": [
            {
                "codename": "view_product",
                "source_role": "Manager"
            }
        ]
    }
    """
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        user = request.user
        tenant = user.tenant
        
        # Get user roles with permissions prefetched
        user_roles = UserRole.objects.filter(
            user=user,
            tenant=tenant
        ).select_related('role').prefetch_related('role__permissions')
        
        # Get primary role
        primary_role_obj = user_roles.filter(is_primary=True).first()
        
        # Serialize roles
        roles_data = []
        all_permissions = set()
        permission_details = []
        
        for user_role in user_roles:
            role = user_role.role
            roles_data.append({
                'id': role.id,
                'name': role.name,
                'slug': role.slug,
                'is_primary': user_role.is_primary,
                'hierarchy_level': role.hierarchy_level,
                'is_system_role': role.is_system_role
            })
            
            # Collect permissions from this role
            for perm in role.permissions.all():
                codename = f"{perm.content_type.app_label}.{perm.codename}"
                all_permissions.add(codename)
                permission_details.append({
                    'codename': codename,
                    'name': perm.name,
                    'source_role': role.name,
                    'source_role_level': role.hierarchy_level
                })
        
        # Get highest hierarchy level (lowest number = highest privilege)
        max_hierarchy = min(
            [role.role.hierarchy_level for role in user_roles]
        ) if user_roles else 100
        
        # Check if tenant admin
        is_tenant_admin = user.has_role('tenant_admin')
        
        return Response({
            'user': {
                'id': user.id,
                'email': user.email,
                'full_name': user.get_full_name(),
                'is_tenant_admin': is_tenant_admin,
                'is_superuser': user.is_superuser
            },
            'primary_role': {
                'id': primary_role_obj.role.id,
                'name': primary_role_obj.role.name,
                'hierarchy_level': primary_role_obj.role.hierarchy_level
            } if primary_role_obj else None,
            'roles': roles_data,
            'permissions': sorted(list(all_permissions)),
            'permission_details': permission_details,
            'metadata': {
                'total_roles': len(roles_data),
                'total_permissions': len(all_permissions),
                'highest_hierarchy_level': max_hierarchy
            }
        })
```

### Response Structure

```json
{
  "user": {
    "id": 123,
    "email": "manager@store.com",
    "full_name": "John Doe",
    "is_tenant_admin": false,
    "is_superuser": false
  },
  "primary_role": {
    "id": 2,
    "name": "Store Manager",
    "hierarchy_level": 30
  },
  "roles": [
    {
      "id": 2,
      "name": "Store Manager",
      "slug": "store-manager",
      "is_primary": true,
      "hierarchy_level": 30,
      "is_system_role": false
    },
    {
      "id": 5,
      "name": "Cashier",
      "slug": "cashier",
      "is_primary": false,
      "hierarchy_level": 50,
      "is_system_role": false
    }
  ],
  "permissions": [
    "inventory.view_product",
    "inventory.add_product",
    "inventory.change_product",
    "sales.view_order",
    "sales.create_order"
  ],
  "permission_details": [
    {
      "codename": "inventory.view_product",
      "name": "Can view product",
      "source_role": "Store Manager",
      "source_role_level": 30
    }
  ],
  "metadata": {
    "total_roles": 2,
    "total_permissions": 5,
    "highest_hierarchy_level": 30
  }
}
```

### Frontend Usage Example

```javascript
// Check if user has permission
const checkPermission = (permission) => {
  return myPermissions.permissions.includes(permission);
}

// Check if user has role
const hasRole = (roleName) => {
  return myPermissions.roles.some(role => role.name === roleName);
}

// Get primary role
const primaryRole = myPermissions.primary_role?.name;

// Usage
if (checkPermission('inventory.add_product')) {
  // Show "Add Product" button
}
```

### Performance Optimization
- **Caching:** Consider caching response for 5 minutes
- **Prefetch:** Use prefetch_related for roles and permissions
- **Select Related:** Use select_related for ForeignKeys
- **Lazy Loading:** Only load what's needed

### Expected Outcome
```
backend/apps/users/views/role_views.py
├── class RoleListView          # Already exists
├── class RoleDetailView        # Already exists
├── class RoleCreateView        # Already exists
├── class AssignRoleView        # Already exists
├── class RevokeRoleView        # Already exists
└── class MyPermissionsView     # Added
```

### Verification Checklist
- [ ] MyPermissionsView class created
- [ ] IsAuthenticated permission applied
- [ ] All roles retrieved
- [ ] All permissions collected
- [ ] Primary role identified
- [ ] Permission details included
- [ ] Metadata included
- [ ] Query optimization applied
- [ ] Response structure complete
- [ ] Frontend-friendly format

---

## Summary

### Tasks Completed in This Document
| Task # | Task Name | Key Deliverable | HTTP Method | Endpoint |
|--------|-----------|-----------------|-------------|----------|
| 81 | Create RoleListView | List roles | GET | /api/v1/roles/ |
| 82 | Create RoleDetailView | Role details | GET | /api/v1/roles/{id}/ |
| 83 | Create RoleCreateView | Create role | POST | /api/v1/roles/ |
| 84 | Create AssignRoleView | Assign role | POST | /api/v1/roles/assign/ |
| 85 | Create RevokeRoleView | Revoke role | POST | /api/v1/roles/revoke/ |
| 86 | Create MyPermissionsView | User permissions | GET | /api/v1/me/permissions/ |

### Final role_views.py Structure
```python
backend/apps/users/views/role_views.py
├── Imports
│   ├── DRF modules (generics, APIView, Response, status)
│   ├── Django modules (get_object_or_404, Q, Max)
│   ├── Models (Role, UserRole, User, Permission)
│   ├── Serializers (Role, RoleDetail, Assign, Revoke)
│   └── Permissions (IsAuthenticated, IsTenantAdmin)
│
├── class RoleListView(generics.ListAPIView)
│   ├── serializer_class = RoleSerializer
│   ├── permission_classes = [IsAuthenticated]
│   ├── get_queryset() → Filter by tenant, support filters
│   └── Query params: hierarchy_level, is_system, search
│
├── class RoleDetailView(generics.RetrieveAPIView)
│   ├── serializer_class = RoleDetailSerializer
│   ├── permission_classes = [IsAuthenticated]
│   ├── lookup_field = 'pk'
│   ├── get_queryset() → Prefetch permissions, select parent
│   └── get_object() → Verify tenant ownership
│
├── class RoleCreateView(generics.CreateAPIView)
│   ├── serializer_class = RoleSerializer
│   ├── permission_classes = [IsAuthenticated, IsTenantAdmin]
│   ├── perform_create() → Assign tenant, validate parent
│   └── Validations: unique name, hierarchy, system role
│
├── class AssignRoleView(APIView)
│   ├── permission_classes = [IsAuthenticated, IsTenantAdmin]
│   ├── post() → Assign role to user
│   ├── Validations: user exists, role exists, hierarchy
│   ├── Primary role logic
│   └── Clear permission cache
│
├── class RevokeRoleView(APIView)
│   ├── permission_classes = [IsAuthenticated, IsTenantAdmin]
│   ├── post() → Remove role from user
│   ├── Protections: last role, primary promotion
│   └── Clear permission cache
│
└── class MyPermissionsView(APIView)
    ├── permission_classes = [IsAuthenticated]
    ├── get() → Current user's permissions
    ├── Returns: roles, permissions, primary role
    └── Optimized queries with prefetch_related
```

### API Endpoints Summary

| Endpoint | Method | Permission | Purpose |
|----------|--------|------------|---------|
| `/api/v1/roles/` | GET | IsAuthenticated | List all tenant roles |
| `/api/v1/roles/{id}/` | GET | IsAuthenticated | Get role details |
| `/api/v1/roles/` | POST | IsTenantAdmin | Create custom role |
| `/api/v1/roles/assign/` | POST | IsTenantAdmin | Assign role to user |
| `/api/v1/roles/revoke/` | POST | IsTenantAdmin | Remove role from user |
| `/api/v1/me/permissions/` | GET | IsAuthenticated | Get my permissions |

### Permission Matrix

| View | Authenticated | Tenant Admin | Superuser | Notes |
|------|--------------|--------------|-----------|-------|
| RoleListView | ✓ | ✓ | ✓ | All users see tenant roles |
| RoleDetailView | ✓ | ✓ | ✓ | All users see role details |
| RoleCreateView | ✗ | ✓ | ✓ | Only admins create roles |
| AssignRoleView | ✗ | ✓ | ✓ | Only admins assign roles |
| RevokeRoleView | ✗ | ✓ | ✓ | Only admins revoke roles |
| MyPermissionsView | ✓ | ✓ | ✓ | All users see own permissions |

### Tenant Isolation
All views enforce tenant isolation:
- Filter all queries by `request.user.tenant`
- Validate cross-references within tenant
- Prevent access to other tenants' data
- Return 404 for out-of-tenant resources

### Hierarchy Validation
Role hierarchy rules:
- Lower number = Higher privilege
- Users cannot assign roles higher than their own
- Tenant admins can assign any role
- Superusers bypass all hierarchy checks
- Parent role must have lower hierarchy level

### Primary Role Logic
- User can have only one primary role
- Assigning new primary unsets others
- Removing primary auto-promotes next highest
- Cannot remove user's only role

### Next Steps
1. Create API URLs in Task 87
2. Register models in Django admin (Task 88)
3. Create comprehensive tests (Tasks 89-92)

---

## Notes for AI Agents

1. **Tenant Filtering:** ALWAYS filter by request.user.tenant in all views
2. **Permission Classes:** Use IsTenantAdmin for role management, IsAuthenticated for viewing
3. **Hierarchy Validation:** Lower hierarchy_level number = Higher privilege
4. **Primary Role:** Enforce single primary role per user
5. **System Roles:** Block creation/deletion of system roles via API
6. **Cache Clearing:** Clear user permission cache after role changes
7. **Query Optimization:** Use prefetch_related and select_related
8. **Error Handling:** Return descriptive error messages with proper HTTP status codes
9. **Validation:** Validate all cross-tenant references
10. **Security:** Always verify tenant ownership before operations
11. **Response Format:** Return consistent JSON structure
12. **Documentation:** Include docstrings with usage examples
