# Tasks 79-80: Role & Permission Serializers

> **Phase:** 03 - Core Backend Infrastructure  
> **SubPhase:** 05 - Role & Permission System  
> **Group:** F - API Endpoints & Testing  
> **Document:** 01 of 04  
> **Tasks Covered:** 79, 80

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Group:** [../Group-E_Permission-Decorators-Mixins/](../Group-E_Permission-Decorators-Mixins/)
- **→ Next Document:** [02_Tasks-81-86_API-Views.md](02_Tasks-81-86_API-Views.md)

---

## Document Overview

This document covers the creation of Django REST Framework serializers for the Role and Permission models. These serializers handle API input validation, output formatting, and data transformation for role and permission management endpoints.

### Tasks in This Document
| Task # | Task Name | Complexity |
|--------|-----------|------------|
| 79 | Create Role Serializers | Medium |
| 80 | Create Permission Serializers | Medium |

---

## Task 79: Create Role Serializers

### Overview
Create Django REST Framework serializers for the Role model, including a basic serializer for listings, a detailed serializer for single role views, and a specialized serializer for role assignment operations.

### Dependencies
- Task 57: Create Role Model
- Task 58: Create Permission Model
- Django REST Framework installed
- apps/users/serializers/ directory created

### Instructions

1. **Create the role_serializers.py file**
   - Navigate to `backend/apps/users/serializers/`
   - Create a new file named `role_serializers.py`

2. **Add necessary imports**
   ```python
   from rest_framework import serializers
   from apps.users.models import Role, Permission, UserRole
   from django.contrib.auth import get_user_model
   
   User = get_user_model()
   ```

3. **Create RoleSerializer (basic listing)**
   - Extends `serializers.ModelSerializer`
   - Used for role list views
   - Include only essential fields
   - Read-only by default

4. **Define RoleSerializer fields**
   - `id` - Primary key (read-only)
   - `name` - Role display name
   - `slug` - URL-friendly identifier
   - `description` - Brief role description
   - `hierarchy_level` - Position in role hierarchy
   - `is_system_role` - Whether role is protected
   - `created_at` - Creation timestamp
   - `updated_at` - Last modification timestamp

5. **Create RoleDetailSerializer (full detail view)**
   - Extends `serializers.ModelSerializer`
   - Used for single role detail views
   - Includes related permissions
   - Includes parent role information

6. **Define RoleDetailSerializer fields**
   - All fields from RoleSerializer
   - `permissions` - Nested PermissionSerializer (many=True)
   - `parent` - Nested parent role information
   - `parent_id` - Parent role ID (writable)
   - `permission_count` - Number of assigned permissions (read-only)
   - `user_count` - Number of users with this role (read-only)

7. **Add calculated fields to RoleDetailSerializer**
   - `permission_count` - Use SerializerMethodField
   - `user_count` - Use SerializerMethodField
   - Implement `get_permission_count()` method
   - Implement `get_user_count()` method

8. **Create AssignRoleSerializer (role assignment)**
   - Extends `serializers.Serializer`
   - Used for assigning roles to users
   - Validates user and role existence
   - Validates role hierarchy rules

9. **Define AssignRoleSerializer fields**
   - `user_id` - IntegerField (required)
   - `role_id` - IntegerField (required)
   - `is_primary` - BooleanField (default=False)
   - `assigned_by` - IntegerField (read-only)

10. **Add validation to AssignRoleSerializer**
    - Validate that user exists and belongs to tenant
    - Validate that role exists and belongs to tenant
    - Validate that assigner has permission to assign this role
    - Validate role hierarchy rules (can't assign higher-level roles)
    - Override `validate()` method for cross-field validation

11. **Implement validate_user_id method**
    - Check user exists
    - Check user belongs to current tenant
    - Raise ValidationError if invalid

12. **Implement validate_role_id method**
    - Check role exists
    - Check role belongs to current tenant
    - Check role is not system-protected (if applicable)
    - Raise ValidationError if invalid

13. **Implement validate method**
    - Check assigner's hierarchy level vs role being assigned
    - Check user doesn't already have this role
    - Check role assignment limits
    - Return validated data

14. **Add create method to AssignRoleSerializer**
    - Create UserRole instance
    - Set assigned_by from request.user
    - Set tenant from request context
    - Handle primary role logic (unset other primary roles)
    - Return created UserRole instance

15. **Create RevokeRoleSerializer**
    - Similar structure to AssignRoleSerializer
    - Used for removing roles from users
    - Validates user_id and role_id

16. **Add Meta options to all serializers**
    - Define read_only_fields
    - Set ordering for nested serializers
    - Configure depth for nested relationships

### Serializer Structure

| Serializer | Purpose | Key Features |
|------------|---------|--------------|
| **RoleSerializer** | List view | Basic fields, fast query |
| **RoleDetailSerializer** | Detail view | Includes permissions, calculated fields |
| **AssignRoleSerializer** | Assignment | Validation, hierarchy checks |
| **RevokeRoleSerializer** | Revocation | Validation, protection checks |

### Field Validation Rules

| Field | Type | Required | Validation |
|-------|------|----------|------------|
| `user_id` | Integer | Yes | User exists, in tenant |
| `role_id` | Integer | Yes | Role exists, in tenant |
| `is_primary` | Boolean | No | Default False |
| `parent_id` | Integer | No | Valid role, hierarchy level |

### Expected File Structure
```
backend/apps/users/
└── serializers/
    ├── __init__.py
    └── role_serializers.py         # NEW
        ├── class RoleSerializer
        ├── class RoleDetailSerializer
        ├── class AssignRoleSerializer
        └── class RevokeRoleSerializer
```

### Code Example: RoleSerializer
```python
class RoleSerializer(serializers.ModelSerializer):
    """Basic serializer for role listing."""
    
    class Meta:
        model = Role
        fields = [
            'id', 
            'name', 
            'slug', 
            'description', 
            'hierarchy_level',
            'is_system_role',
            'created_at',
            'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']
```

### Code Example: RoleDetailSerializer
```python
class RoleDetailSerializer(serializers.ModelSerializer):
    """Detailed serializer including permissions and stats."""
    
    permissions = PermissionSerializer(many=True, read_only=True)
    permission_count = serializers.SerializerMethodField()
    user_count = serializers.SerializerMethodField()
    parent = RoleSerializer(read_only=True)
    
    class Meta:
        model = Role
        fields = [
            'id', 
            'name', 
            'slug', 
            'description', 
            'hierarchy_level',
            'is_system_role',
            'parent',
            'parent_id',
            'permissions',
            'permission_count',
            'user_count',
            'created_at',
            'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']
    
    def get_permission_count(self, obj):
        """Get total permission count for this role."""
        return obj.permissions.count()
    
    def get_user_count(self, obj):
        """Get total users assigned this role."""
        return obj.userrole_set.count()
```

### Code Example: AssignRoleSerializer
```python
class AssignRoleSerializer(serializers.Serializer):
    """Serializer for assigning roles to users."""
    
    user_id = serializers.IntegerField(required=True)
    role_id = serializers.IntegerField(required=True)
    is_primary = serializers.BooleanField(default=False)
    
    def validate_user_id(self, value):
        """Validate user exists and belongs to tenant."""
        request = self.context.get('request')
        try:
            user = User.objects.get(
                id=value,
                tenant=request.user.tenant
            )
        except User.DoesNotExist:
            raise serializers.ValidationError(
                "User not found or does not belong to your tenant."
            )
        return value
    
    def validate_role_id(self, value):
        """Validate role exists and belongs to tenant."""
        request = self.context.get('request')
        try:
            role = Role.objects.get(
                id=value,
                tenant=request.user.tenant
            )
        except Role.DoesNotExist:
            raise serializers.ValidationError(
                "Role not found or does not belong to your tenant."
            )
        return value
    
    def validate(self, attrs):
        """Cross-field validation for role assignment."""
        request = self.context.get('request')
        user = User.objects.get(id=attrs['user_id'])
        role = Role.objects.get(id=attrs['role_id'])
        
        # Check if assigner can assign this role
        assigner_roles = request.user.get_roles()
        max_hierarchy = max(
            [r.hierarchy_level for r in assigner_roles], 
            default=0
        )
        
        if role.hierarchy_level >= max_hierarchy:
            raise serializers.ValidationError(
                "You cannot assign a role at or above your hierarchy level."
            )
        
        # Check if user already has this role
        if UserRole.objects.filter(user=user, role=role).exists():
            raise serializers.ValidationError(
                "User already has this role."
            )
        
        return attrs
    
    def create(self, validated_data):
        """Create UserRole assignment."""
        request = self.context.get('request')
        user = User.objects.get(id=validated_data['user_id'])
        role = Role.objects.get(id=validated_data['role_id'])
        
        # Handle primary role logic
        if validated_data.get('is_primary', False):
            UserRole.objects.filter(
                user=user, 
                tenant=request.user.tenant
            ).update(is_primary=False)
        
        user_role = UserRole.objects.create(
            user=user,
            role=role,
            tenant=request.user.tenant,
            assigned_by=request.user,
            is_primary=validated_data.get('is_primary', False)
        )
        
        return user_role
```

### Verification Checklist
- [ ] `role_serializers.py` file created in `apps/users/serializers/`
- [ ] RoleSerializer class implemented with basic fields
- [ ] RoleDetailSerializer includes permissions and parent
- [ ] Calculated fields (permission_count, user_count) implemented
- [ ] AssignRoleSerializer with validation implemented
- [ ] RevokeRoleSerializer created
- [ ] User validation checks tenant membership
- [ ] Role validation checks tenant membership
- [ ] Hierarchy validation prevents privilege escalation
- [ ] Primary role logic handles mutual exclusion
- [ ] All serializers include proper docstrings
- [ ] Import statements are complete

---

## Task 80: Create Permission Serializers

### Overview
Create Django REST Framework serializers for the Permission model. These serializers will be used in API views for listing and displaying permission information.

### Dependencies
- Task 58: Create Permission Model
- Task 79: Create Role Serializers (for nested usage)
- Django REST Framework installed

### Instructions

1. **Update role_serializers.py file**
   - Add Permission serializers to the same file
   - Or create separate `permission_serializers.py` if preferred

2. **Add necessary imports (if not already present)**
   ```python
   from apps.users.models import Permission
   ```

3. **Create PermissionSerializer (basic listing)**
   - Extends `serializers.ModelSerializer`
   - Used for permission list views
   - Used as nested serializer in RoleDetailSerializer
   - Read-only serializer

4. **Define PermissionSerializer fields**
   - `id` - Primary key
   - `name` - Permission display name
   - `codename` - Unique code identifier
   - `description` - Brief description
   - `module` - Module/app this permission belongs to
   - `action` - Action type (view, add, change, delete)

5. **Create PermissionDetailSerializer (full detail view)**
   - Extends `serializers.ModelSerializer`
   - Used for single permission detail views
   - Includes related roles
   - Includes usage statistics

6. **Define PermissionDetailSerializer fields**
   - All fields from PermissionSerializer
   - `roles` - Nested roles that have this permission (many=True)
   - `role_count` - Number of roles with this permission (read-only)
   - `user_count` - Approximate users with this permission (read-only)
   - `created_at` - Creation timestamp
   - `updated_at` - Last modification timestamp

7. **Add calculated fields to PermissionDetailSerializer**
   - `role_count` - Use SerializerMethodField
   - `user_count` - Use SerializerMethodField
   - Implement `get_role_count()` method
   - Implement `get_user_count()` method

8. **Implement get_role_count method**
   - Count roles that have this permission
   - Return integer count

9. **Implement get_user_count method**
   - Count distinct users through roles
   - Use `UserRole` model to count
   - Return integer count

10. **Create PermissionBulkSerializer**
    - Used for bulk permission operations
    - Accepts list of permission codenames
    - Validates all permissions exist

11. **Define PermissionBulkSerializer fields**
    - `permission_codenames` - ListField of strings
    - Validate each codename exists
    - Return permission IDs for processing

12. **Add validation to PermissionBulkSerializer**
    - Check all codenames exist
    - Check permissions belong to tenant (if applicable)
    - Raise ValidationError for invalid codenames

13. **Create PermissionGroupSerializer**
    - Groups permissions by module
    - Used for organized permission display
    - Read-only serializer

14. **Define PermissionGroupSerializer structure**
    - `module` - Module name
    - `permissions` - List of PermissionSerializer
    - Group by module field

15. **Add ordering to serializers**
    - Order permissions by module, then action
    - Order roles by hierarchy_level
    - Ensure consistent API responses

16. **Update __init__.py in serializers directory**
    - Export all serializers
    - Make imports cleaner for views

### Serializer Structure

| Serializer | Purpose | Key Features |
|------------|---------|--------------|
| **PermissionSerializer** | List view | Basic fields, fast query |
| **PermissionDetailSerializer** | Detail view | Includes roles, statistics |
| **PermissionBulkSerializer** | Bulk ops | Validates multiple permissions |
| **PermissionGroupSerializer** | Organized view | Groups by module |

### Permission Module Categories

| Module | Description | Example Actions |
|--------|-------------|-----------------|
| `inventory` | Inventory management | view, add, change, delete |
| `sales` | Sales operations | view, add, change, approve |
| `finance` | Financial operations | view, add, change, reconcile |
| `users` | User management | view, add, change, delete |
| `reports` | Report access | view, export, schedule |

### Expected File Structure
```
backend/apps/users/
└── serializers/
    ├── __init__.py                 # UPDATED
    └── role_serializers.py         # UPDATED
        ├── class RoleSerializer
        ├── class RoleDetailSerializer
        ├── class AssignRoleSerializer
        ├── class RevokeRoleSerializer
        ├── class PermissionSerializer         # NEW
        ├── class PermissionDetailSerializer   # NEW
        ├── class PermissionBulkSerializer     # NEW
        └── class PermissionGroupSerializer    # NEW
```

### Code Example: PermissionSerializer
```python
class PermissionSerializer(serializers.ModelSerializer):
    """Basic serializer for permission listing."""
    
    class Meta:
        model = Permission
        fields = [
            'id',
            'name',
            'codename',
            'description',
            'module',
            'action'
        ]
        read_only_fields = ['id']
```

### Code Example: PermissionDetailSerializer
```python
class PermissionDetailSerializer(serializers.ModelSerializer):
    """Detailed serializer including roles and stats."""
    
    roles = RoleSerializer(many=True, read_only=True)
    role_count = serializers.SerializerMethodField()
    user_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Permission
        fields = [
            'id',
            'name',
            'codename',
            'description',
            'module',
            'action',
            'roles',
            'role_count',
            'user_count',
            'created_at',
            'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']
    
    def get_role_count(self, obj):
        """Get count of roles with this permission."""
        return obj.roles.count()
    
    def get_user_count(self, obj):
        """Get approximate count of users with this permission."""
        return UserRole.objects.filter(
            role__permissions=obj
        ).values('user').distinct().count()
```

### Code Example: PermissionBulkSerializer
```python
class PermissionBulkSerializer(serializers.Serializer):
    """Serializer for bulk permission operations."""
    
    permission_codenames = serializers.ListField(
        child=serializers.CharField(),
        required=True
    )
    
    def validate_permission_codenames(self, value):
        """Validate all permission codenames exist."""
        request = self.context.get('request')
        
        # Get tenant-specific permissions
        permissions = Permission.objects.filter(
            codename__in=value,
            tenant=request.user.tenant
        )
        
        found_codenames = set(permissions.values_list('codename', flat=True))
        invalid_codenames = set(value) - found_codenames
        
        if invalid_codenames:
            raise serializers.ValidationError(
                f"Invalid permission codenames: {', '.join(invalid_codenames)}"
            )
        
        return value
    
    def get_permission_ids(self):
        """Return list of permission IDs for validated codenames."""
        codenames = self.validated_data['permission_codenames']
        request = self.context.get('request')
        
        return list(Permission.objects.filter(
            codename__in=codenames,
            tenant=request.user.tenant
        ).values_list('id', flat=True))
```

### Code Example: PermissionGroupSerializer
```python
class PermissionGroupSerializer(serializers.Serializer):
    """Serializer for grouped permissions by module."""
    
    module = serializers.CharField()
    permissions = PermissionSerializer(many=True)
    
    @staticmethod
    def get_grouped_permissions(tenant):
        """Group permissions by module for a tenant."""
        from itertools import groupby
        from operator import attrgetter
        
        permissions = Permission.objects.filter(
            tenant=tenant
        ).order_by('module', 'action')
        
        grouped = []
        for module, group in groupby(permissions, key=attrgetter('module')):
            grouped.append({
                'module': module,
                'permissions': list(group)
            })
        
        return grouped
```

### Code Example: __init__.py Update
```python
# backend/apps/users/serializers/__init__.py

from .role_serializers import (
    RoleSerializer,
    RoleDetailSerializer,
    AssignRoleSerializer,
    RevokeRoleSerializer,
    PermissionSerializer,
    PermissionDetailSerializer,
    PermissionBulkSerializer,
    PermissionGroupSerializer,
)

__all__ = [
    'RoleSerializer',
    'RoleDetailSerializer',
    'AssignRoleSerializer',
    'RevokeRoleSerializer',
    'PermissionSerializer',
    'PermissionDetailSerializer',
    'PermissionBulkSerializer',
    'PermissionGroupSerializer',
]
```

### Verification Checklist
- [ ] PermissionSerializer class implemented
- [ ] PermissionDetailSerializer includes roles
- [ ] Calculated fields (role_count, user_count) implemented
- [ ] PermissionBulkSerializer validates codenames
- [ ] PermissionGroupSerializer groups by module
- [ ] Tenant filtering applied to all queries
- [ ] Serializers use proper read_only_fields
- [ ] get_role_count method implemented correctly
- [ ] get_user_count method counts distinct users
- [ ] __init__.py updated with all exports
- [ ] All serializers include docstrings
- [ ] Ordering specified for consistent results

---

## Summary

### Tasks Completed in This Document
| Task # | Task Name | Key Deliverable |
|--------|-----------|-----------------|
| 79 | Create Role Serializers | `role_serializers.py` with 4 serializers |
| 80 | Create Permission Serializers | Additional 4 serializers in same file |

### Final Serializer Inventory
```
backend/apps/users/serializers/
└── role_serializers.py
    ├── RoleSerializer                    # Basic role listing
    ├── RoleDetailSerializer              # Detailed role + permissions
    ├── AssignRoleSerializer              # Role assignment validation
    ├── RevokeRoleSerializer              # Role revocation validation
    ├── PermissionSerializer              # Basic permission listing
    ├── PermissionDetailSerializer        # Detailed permission + roles
    ├── PermissionBulkSerializer          # Bulk permission operations
    └── PermissionGroupSerializer         # Grouped permission display
```

### Key Features Implemented
| Feature | Description |
|---------|-------------|
| **Tenant Filtering** | All serializers filter by request.user.tenant |
| **Hierarchy Validation** | AssignRoleSerializer prevents privilege escalation |
| **Calculated Fields** | Permission count, user count via SerializerMethodField |
| **Nested Serializers** | Permissions in roles, roles in permissions |
| **Primary Role Logic** | Mutual exclusion for primary role flag |
| **Bulk Operations** | Support for multiple permission operations |
| **Grouped Display** | Permissions organized by module |
| **Read-Only Protection** | System fields marked as read_only |

### Serializer Usage Map
```
API Endpoint                    Serializer Used
──────────────────────────────────────────────────────────
GET  /api/v1/roles/            → RoleSerializer (many)
GET  /api/v1/roles/{id}/       → RoleDetailSerializer
POST /api/v1/roles/assign/     → AssignRoleSerializer
POST /api/v1/roles/revoke/     → RevokeRoleSerializer
GET  /api/v1/permissions/      → PermissionSerializer (many)
GET  /api/v1/permissions/{id}/ → PermissionDetailSerializer
POST /api/v1/permissions/bulk/ → PermissionBulkSerializer
GET  /api/v1/permissions/grouped/ → PermissionGroupSerializer
```

### Validation Rules Summary
| Validation | Purpose |
|------------|---------|
| `validate_user_id` | Ensure user exists and in tenant |
| `validate_role_id` | Ensure role exists and in tenant |
| `validate()` | Check hierarchy, existing assignments |
| `validate_permission_codenames` | Verify all codenames valid |

### Next Steps
1. Proceed to [02_Tasks-81-86_API-Views.md](02_Tasks-81-86_API-Views.md) to create API views
2. Use these serializers in ViewSets and APIViews
3. Apply proper permission classes to views
4. Test serializer validation logic

---

## Notes for AI Agents

1. **Tenant Filtering:** Always filter by `request.user.tenant` in validation
2. **Circular Import:** PermissionSerializer used in RoleDetailSerializer - define first
3. **Context Required:** Pass `request` in serializer context for validation
4. **Hierarchy Check:** Prevent users from assigning roles above their level
5. **Primary Role:** Only one primary role per user per tenant
6. **System Roles:** May need additional protection in validation
7. **Performance:** Use `select_related()` and `prefetch_related()` in views
8. **Error Messages:** Provide clear, user-friendly validation errors
9. **Testing:** Write tests for all validation scenarios
10. **Documentation:** Add OpenAPI schema annotations in views
