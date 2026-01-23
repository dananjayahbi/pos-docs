# Tasks 76-78: JWT Claims & Permission Response

> **Phase:** 03 - Core Backend Infrastructure  
> **SubPhase:** 05 - Role & Permission System  
> **Group:** E - Permission Decorators & Mixins  
> **Document:** 04 of 04  
> **Tasks Covered:** 76, 77, 78

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [03_Tasks-73-75_View-Mixins.md](03_Tasks-73-75_View-Mixins.md)
- **→ Next Group:** [../Group-F_API-Endpoints-Testing/](../Group-F_API-Endpoints-Testing/)

---

## Document Overview

This document covers JWT claim integration and standardized permission denied responses. Tasks 76-78 add roles and permissions to JWT tokens and create consistent 403 error responses for authorization failures.

### Tasks in This Document
| Task # | Task Name | Complexity |
|--------|-----------|------------|
| 76 | Add Roles to JWT Claims | Medium |
| 77 | Create Permission Denied Response | Simple |
| 78 | Document Decorators & Mixins | Medium |

---

## Task 76: Add Roles to JWT Claims

### Overview
Extend JWT token payload to include user roles and permissions. This enables client-side role checks and permission validation without additional API calls.

### Dependencies
- Task 59: Create UserRole Model
- Task 60: Create RolePermission Model
- SubPhase-04: User Authentication (JWT setup)

### Instructions

1. **Create JWT claims module**
   - Create file `backend/apps/core/jwt_claims.py`
   - Import SimpleJWT token serializers

2. **Create CustomTokenObtainPairSerializer**
   - Extend `TokenObtainPairSerializer` from rest_framework_simplejwt
   - Override `get_token` classmethod
   - Call parent `get_token` to get base token

3. **Add roles to token claims**
   - Query user's active roles via `user.user_roles` relationship
   - Extract role slugs using `values_list('role__slug', flat=True)`
   - Convert QuerySet to list
   - Add to token: `token['roles'] = list(role_slugs)`

4. **Add permissions to token claims**
   - Use `user.get_all_permissions()` method
   - Convert to list format
   - Add to token: `token['permissions'] = list(user.get_all_permissions())`

5. **Add tenant information (if applicable)**
   - Check if user has active tenant
   - Add tenant ID: `token['tenant_id'] = user.tenant_id if user.tenant_id else None`
   - Add tenant slug: `token['tenant_slug'] = user.tenant.slug if user.tenant else None`

6. **Add user display information**
   - Add full name: `token['full_name'] = user.get_full_name()`
   - Add email: `token['email'] = user.email`
   - Add username: `token['username'] = user.username`

7. **Update settings.py configuration**
   - Import custom serializer in JWT settings
   - Set `TOKEN_OBTAIN_SERIALIZER` to custom class
   - Update `SIMPLE_JWT` configuration

8. **Test token claims**
   - Obtain JWT token for test user
   - Decode token and verify roles array
   - Verify permissions array
   - Verify tenant information
   - Verify user information

### JWT Token Structure

```python
{
    # Standard JWT claims
    "token_type": "access",
    "exp": 1705996800,
    "iat": 1705993200,
    "jti": "abc123def456",
    "user_id": 42,
    
    # Custom role claims
    "roles": [
        "tenant-admin",
        "manager"
    ],
    
    # Custom permission claims
    "permissions": [
        "inventory.view_product",
        "inventory.add_product",
        "inventory.change_product",
        "sales.view_order"
    ],
    
    # Tenant information
    "tenant_id": 15,
    "tenant_slug": "acme-corp",
    
    # User information
    "username": "john.doe",
    "email": "john@acme.com",
    "full_name": "John Doe"
}
```

### Implementation Example

```python
# backend/apps/core/jwt_claims.py
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    """
    Custom JWT serializer that adds roles and permissions to token claims.
    """
    
    @classmethod
    def get_token(cls, user):
        """
        Add custom claims to JWT token.
        
        Args:
            user: User instance
            
        Returns:
            Token with custom claims
        """
        token = super().get_token(user)
        
        # Add user roles
        token['roles'] = list(
            user.user_roles.filter(is_active=True)
            .values_list('role__slug', flat=True)
        )
        
        # Add user permissions
        token['permissions'] = list(user.get_all_permissions())
        
        # Add tenant information
        if hasattr(user, 'tenant') and user.tenant:
            token['tenant_id'] = user.tenant.id
            token['tenant_slug'] = user.tenant.slug
        else:
            token['tenant_id'] = None
            token['tenant_slug'] = None
        
        # Add user display information
        token['username'] = user.username
        token['email'] = user.email
        token['full_name'] = user.get_full_name()
        token['is_superadmin'] = user.has_role('super-admin')
        
        return token


class CustomTokenObtainPairView(TokenObtainPairView):
    """
    Custom token view using our custom serializer.
    """
    serializer_class = CustomTokenObtainPairSerializer
```

### Settings Configuration

```python
# backend/config/settings/base.py

from datetime import timedelta

SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(hours=1),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=7),
    'ROTATE_REFRESH_TOKENS': True,
    'BLACKLIST_AFTER_ROTATION': True,
    'UPDATE_LAST_LOGIN': True,
    
    'ALGORITHM': 'HS256',
    'SIGNING_KEY': SECRET_KEY,
    'VERIFYING_KEY': None,
    'AUDIENCE': None,
    'ISSUER': None,
    
    'AUTH_HEADER_TYPES': ('Bearer',),
    'AUTH_HEADER_NAME': 'HTTP_AUTHORIZATION',
    'USER_ID_FIELD': 'id',
    'USER_ID_CLAIM': 'user_id',
    
    'AUTH_TOKEN_CLASSES': ('rest_framework_simplejwt.tokens.AccessToken',),
    'TOKEN_TYPE_CLAIM': 'token_type',
    
    # Use custom serializer
    'TOKEN_OBTAIN_SERIALIZER': 'apps.core.jwt_claims.CustomTokenObtainPairSerializer',
}
```

### URL Configuration

```python
# backend/apps/core/urls.py
from django.urls import path
from .jwt_claims import CustomTokenObtainPairView
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    path('auth/token/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('auth/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]
```

### Client-Side Usage

```typescript
// frontend/src/utils/auth.ts

interface JWTPayload {
    user_id: number;
    username: string;
    email: string;
    full_name: string;
    roles: string[];
    permissions: string[];
    tenant_id: number | null;
    tenant_slug: string | null;
    is_superadmin: boolean;
    exp: number;
    iat: number;
}

export function decodeToken(token: string): JWTPayload | null {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const payload = JSON.parse(window.atob(base64));
        return payload as JWTPayload;
    } catch (error) {
        console.error('Failed to decode token:', error);
        return null;
    }
}

export function hasRole(token: string, role: string): boolean {
    const payload = decodeToken(token);
    return payload?.roles.includes(role) || false;
}

export function hasPermission(token: string, permission: string): boolean {
    const payload = decodeToken(token);
    return payload?.permissions.includes(permission) || false;
}

export function hasAnyRole(token: string, roles: string[]): boolean {
    const payload = decodeToken(token);
    return roles.some(role => payload?.roles.includes(role)) || false;
}

export function hasAllPermissions(token: string, permissions: string[]): boolean {
    const payload = decodeToken(token);
    return permissions.every(perm => payload?.permissions.includes(perm)) || false;
}
```

### Expected Outcome
```
backend/apps/core/
├── jwt_claims.py              # NEW: Custom JWT serializer
└── urls.py                    # Updated with token endpoints
```

### Verification Checklist
- [ ] `jwt_claims.py` file created with CustomTokenObtainPairSerializer
- [ ] Roles array added to token claims
- [ ] Permissions array added to token claims
- [ ] Tenant information added to token claims
- [ ] User display information added to token
- [ ] Settings.py updated with custom serializer
- [ ] Token endpoint configured in urls.py
- [ ] Token decoding works correctly
- [ ] Client-side helper functions created

---

## Task 77: Create Permission Denied Response

### Overview
Create a standardized 403 Forbidden response format for permission denied errors. This provides consistent error messages across all permission checks.

### Dependencies
- Task 64: Create permission_required Decorator
- Task 68: Create DRF Permission Classes

### Instructions

1. **Create response utilities module**
   - Create file `backend/apps/core/responses.py`
   - Import DRF Response and status codes

2. **Create PermissionDeniedResponse class**
   - Create class extending dictionary or custom response
   - Define standard error structure
   - Include error code, message, and details

3. **Define standard error format**
   - Status code: 403
   - Error code: "permission_denied"
   - Message: Human-readable description
   - Details: Missing permissions or roles
   - Timestamp: ISO format timestamp

4. **Create helper function**
   - Function: `permission_denied_response(message, details)`
   - Returns DRF Response with 403 status
   - Uses standard error format

5. **Add permission detail helpers**
   - Function: `format_missing_permissions(required, actual)`
   - Function: `format_missing_roles(required, actual)`
   - Returns structured difference

6. **Integrate with decorators**
   - Update `permission_required` decorator
   - Use custom response instead of generic PermissionDenied
   - Include specific permission that was checked

7. **Integrate with DRF permission classes**
   - Override `has_permission` method error
   - Return detailed error response
   - Include required role or permission

8. **Add logging for denied requests**
   - Log permission denials with user info
   - Log attempted permission/role
   - Include request path and method

### Response Format

```json
{
    "error": {
        "code": "permission_denied",
        "message": "You do not have permission to perform this action",
        "details": {
            "required_permission": "inventory.add_product",
            "user_permissions": [
                "inventory.view_product",
                "inventory.change_product"
            ],
            "missing_permissions": [
                "inventory.add_product"
            ]
        },
        "timestamp": "2026-01-23T10:30:00Z",
        "path": "/api/v1/inventory/products/",
        "method": "POST"
    }
}
```

### Implementation Example

```python
# backend/apps/core/responses.py
from rest_framework.response import Response
from rest_framework import status
from datetime import datetime
import logging

logger = logging.getLogger(__name__)


class PermissionDeniedError:
    """
    Standard permission denied error structure.
    """
    
    def __init__(
        self,
        message="You do not have permission to perform this action",
        required_permission=None,
        required_role=None,
        user_permissions=None,
        user_roles=None,
        path=None,
        method=None
    ):
        self.message = message
        self.required_permission = required_permission
        self.required_role = required_role
        self.user_permissions = user_permissions or []
        self.user_roles = user_roles or []
        self.path = path
        self.method = method
        self.timestamp = datetime.utcnow().isoformat() + 'Z'
    
    def to_dict(self):
        """Convert error to dictionary format."""
        details = {}
        
        if self.required_permission:
            details['required_permission'] = self.required_permission
            details['user_permissions'] = list(self.user_permissions)
            details['missing_permissions'] = [self.required_permission]
        
        if self.required_role:
            details['required_role'] = self.required_role
            details['user_roles'] = list(self.user_roles)
            details['missing_roles'] = [self.required_role]
        
        return {
            "error": {
                "code": "permission_denied",
                "message": self.message,
                "details": details,
                "timestamp": self.timestamp,
                "path": self.path,
                "method": self.method
            }
        }


def permission_denied_response(
    message="You do not have permission to perform this action",
    required_permission=None,
    required_role=None,
    user_permissions=None,
    user_roles=None,
    request=None
):
    """
    Create standardized permission denied response.
    
    Args:
        message: Error message
        required_permission: Permission that was required
        required_role: Role that was required
        user_permissions: User's actual permissions
        user_roles: User's actual roles
        request: Django request object
    
    Returns:
        DRF Response with 403 status
    """
    error = PermissionDeniedError(
        message=message,
        required_permission=required_permission,
        required_role=required_role,
        user_permissions=user_permissions,
        user_roles=user_roles,
        path=request.path if request else None,
        method=request.method if request else None
    )
    
    # Log permission denial
    logger.warning(
        f"Permission denied: {message}",
        extra={
            'user': request.user.username if request and request.user.is_authenticated else 'anonymous',
            'required_permission': required_permission,
            'required_role': required_role,
            'path': request.path if request else None,
            'method': request.method if request else None
        }
    )
    
    return Response(error.to_dict(), status=status.HTTP_403_FORBIDDEN)


def format_missing_permissions(required_permissions, user_permissions):
    """
    Calculate and format missing permissions.
    
    Args:
        required_permissions: Set or list of required permissions
        user_permissions: Set or list of user's permissions
    
    Returns:
        List of missing permissions
    """
    required = set(required_permissions) if not isinstance(required_permissions, set) else required_permissions
    actual = set(user_permissions) if not isinstance(user_permissions, set) else user_permissions
    return list(required - actual)


def format_missing_roles(required_roles, user_roles):
    """
    Calculate and format missing roles.
    
    Args:
        required_roles: Set or list of required roles
        user_roles: Set or list of user's roles
    
    Returns:
        List of missing roles
    """
    required = set(required_roles) if not isinstance(required_roles, set) else required_roles
    actual = set(user_roles) if not isinstance(user_roles, set) else user_roles
    return list(required - actual)
```

### Updated Decorator with Custom Response

```python
# backend/apps/core/permissions.py (updated)
from functools import wraps
from .responses import permission_denied_response


def permission_required(perm):
    """
    Decorator to check if user has specific permission.
    Returns standardized 403 response if permission is missing.
    """
    def decorator(view_func):
        @wraps(view_func)
        def wrapper(request, *args, **kwargs):
            if not request.user.is_authenticated:
                return permission_denied_response(
                    message="Authentication required",
                    request=request
                )
            
            if not request.user.has_perm(perm):
                return permission_denied_response(
                    message=f"Permission '{perm}' required",
                    required_permission=perm,
                    user_permissions=request.user.get_all_permissions(),
                    request=request
                )
            
            return view_func(request, *args, **kwargs)
        return wrapper
    return decorator


def role_required(role_slug):
    """
    Decorator to check if user has specific role.
    Returns standardized 403 response if role is missing.
    """
    def decorator(view_func):
        @wraps(view_func)
        def wrapper(request, *args, **kwargs):
            if not request.user.is_authenticated:
                return permission_denied_response(
                    message="Authentication required",
                    request=request
                )
            
            if not request.user.has_role(role_slug):
                user_roles = list(
                    request.user.user_roles.values_list('role__slug', flat=True)
                )
                return permission_denied_response(
                    message=f"Role '{role_slug}' required",
                    required_role=role_slug,
                    user_roles=user_roles,
                    request=request
                )
            
            return view_func(request, *args, **kwargs)
        return wrapper
    return decorator
```

### Updated DRF Permission Class

```python
# backend/apps/core/permissions.py (continued)
from rest_framework.permissions import BasePermission


class IsSuperAdmin(BasePermission):
    """
    Allows access only to super admins.
    Provides detailed error message on denial.
    """
    
    message = "Super admin role required"
    
    def has_permission(self, request, view):
        if not request.user.is_authenticated:
            self.message = "Authentication required"
            return False
        
        has_perm = request.user.has_role('super-admin')
        if not has_perm:
            user_roles = list(
                request.user.user_roles.values_list('role__slug', flat=True)
            )
            self.message = {
                "code": "permission_denied",
                "message": "Super admin role required",
                "details": {
                    "required_role": "super-admin",
                    "user_roles": user_roles
                }
            }
        
        return has_perm
```

### Expected Outcome
```
backend/apps/core/
├── responses.py               # NEW: Permission denied responses
└── permissions.py             # Updated with custom responses
```

### Verification Checklist
- [ ] `responses.py` file created
- [ ] PermissionDeniedError class defined
- [ ] permission_denied_response function created
- [ ] Standard error format includes all required fields
- [ ] Decorators updated to use custom response
- [ ] DRF permission classes updated
- [ ] Logging added for permission denials
- [ ] Response format matches specification
- [ ] Client can parse error details

---

## Task 78: Document Decorators & Mixins

### Overview
Create comprehensive documentation for all decorators, permission classes, and mixins. This documentation serves as a reference guide for developers using the permission system.

### Dependencies
- Tasks 63-77: All previous tasks in Group E

### Instructions

1. **Create documentation directory**
   - Create `backend/docs/permissions/` directory
   - Create `README.md` as main index

2. **Create decorator documentation**
   - Create `backend/docs/permissions/decorators.md`
   - Document each decorator with examples
   - Include usage patterns and best practices

3. **Create permission class documentation**
   - Create `backend/docs/permissions/permission_classes.md`
   - Document all DRF permission classes
   - Include usage in ViewSets and APIViews

4. **Create mixin documentation**
   - Create `backend/docs/permissions/mixins.md`
   - Document all view mixins
   - Include class hierarchy and inheritance

5. **Create JWT claims documentation**
   - Create `backend/docs/permissions/jwt_claims.md`
   - Document token structure
   - Include client-side usage examples

6. **Create response format documentation**
   - Create `backend/docs/permissions/error_responses.md`
   - Document 403 response format
   - Include error handling guidelines

7. **Add code examples**
   - Provide working examples for each component
   - Include both function-based and class-based views
   - Show integration with React/Next.js frontend

8. **Create quick reference guide**
   - Create `backend/docs/permissions/quick_reference.md`
   - Summary table of all decorators
   - Summary table of all permission classes
   - Summary table of all mixins

9. **Add troubleshooting section**
   - Common issues and solutions
   - Debugging permission problems
   - Testing permission logic

10. **Update main project documentation**
    - Link to permission docs from main README
    - Add to developer guide
    - Include in API documentation

### Documentation Structure

```
backend/docs/permissions/
├── README.md                      # Main index
├── decorators.md                  # Function decorators
├── permission_classes.md          # DRF permission classes
├── mixins.md                      # View mixins
├── jwt_claims.md                  # JWT token claims
├── error_responses.md             # 403 error format
├── quick_reference.md             # Quick lookup tables
└── examples/
    ├── function_based_views.md    # FBV examples
    ├── class_based_views.md       # CBV examples
    ├── viewsets.md                # ViewSet examples
    └── frontend_integration.md    # Client-side examples
```

### Main Index Example

```markdown
# Permission System Documentation

Complete guide to the LankaCommerce Cloud permission system including decorators, permission classes, mixins, and JWT integration.

## Table of Contents

1. [Overview](#overview)
2. [Function Decorators](decorators.md)
3. [DRF Permission Classes](permission_classes.md)
4. [View Mixins](mixins.md)
5. [JWT Token Claims](jwt_claims.md)
6. [Error Responses](error_responses.md)
7. [Quick Reference](quick_reference.md)
8. [Examples](examples/)

## Overview

The permission system provides multiple layers of access control:

- **Function Decorators:** For function-based views
- **Permission Classes:** For DRF class-based views
- **View Mixins:** Reusable permission logic
- **JWT Claims:** Client-side role/permission checks

## Quick Start

### Function-Based View
```python
from apps.core.permissions import permission_required, role_required

@permission_required('inventory.add_product')
def create_product(request):
    # Your view logic
    pass

@role_required('manager')
def manager_dashboard(request):
    # Your view logic
    pass
```

### Class-Based View
```python
from rest_framework.views import APIView
from apps.core.permissions import IsTenantAdmin

class ProductListView(APIView):
    permission_classes = [IsTenantAdmin]
    
    def get(self, request):
        # Your view logic
        pass
```

### ViewSet
```python
from rest_framework.viewsets import ModelViewSet
from apps.core.mixins import TenantPermissionMixin

class ProductViewSet(TenantPermissionMixin, ModelViewSet):
    required_permissions = {
        'list': ['inventory.view_product'],
        'create': ['inventory.add_product'],
        'update': ['inventory.change_product'],
        'destroy': ['inventory.delete_product']
    }
```

## Available Components

### Function Decorators
| Decorator | Purpose |
|-----------|---------|
| `permission_required(perm)` | Single permission check |
| `role_required(role)` | Single role check |
| `any_permission_required(*perms)` | OR logic for permissions |
| `all_permissions_required(*perms)` | AND logic for permissions |

### DRF Permission Classes
| Class | Required Role |
|-------|---------------|
| `IsSuperAdmin` | super-admin |
| `IsTenantAdmin` | tenant-admin |
| `IsManager` | manager |
| `IsStaff` | staff |

### View Mixins
| Mixin | Purpose |
|-------|---------|
| `PermissionMixin` | Permission checks in views |
| `RoleMixin` | Role checks in views |
| `TenantPermissionMixin` | Tenant-scoped permissions |

## Next Steps

- Read [Function Decorators](decorators.md) for decorator details
- Read [Permission Classes](permission_classes.md) for DRF integration
- Read [View Mixins](mixins.md) for mixin usage
- Check [Quick Reference](quick_reference.md) for lookup tables
```

### Decorator Documentation Example

```markdown
# Function Decorators

Function decorators provide an easy way to add permission checks to function-based views.

## permission_required

Check if user has a specific permission.

### Signature
```python
def permission_required(perm: str) -> Callable
```

### Parameters
- `perm` (str): Permission in format 'app_label.permission_codename'

### Returns
- Decorator function that wraps the view

### Raises
- Returns 403 response if permission check fails
- Returns 401 response if user is not authenticated

### Example
```python
from apps.core.permissions import permission_required

@permission_required('inventory.add_product')
def create_product(request):
    """View to create a new product."""
    # Permission check happens automatically
    product = Product.objects.create(
        name=request.POST['name'],
        price=request.POST['price']
    )
    return JsonResponse({'id': product.id})
```

### With Django URLs
```python
from django.urls import path
from . import views

urlpatterns = [
    path('products/create/', views.create_product, name='create_product'),
]
```

### Error Response
When permission is denied, returns:
```json
{
    "error": {
        "code": "permission_denied",
        "message": "Permission 'inventory.add_product' required",
        "details": {
            "required_permission": "inventory.add_product",
            "user_permissions": ["inventory.view_product"],
            "missing_permissions": ["inventory.add_product"]
        },
        "timestamp": "2026-01-23T10:30:00Z",
        "path": "/api/products/create/",
        "method": "POST"
    }
}
```

## role_required

Check if user has a specific role.

### Signature
```python
def role_required(role_slug: str) -> Callable
```

### Parameters
- `role_slug` (str): Role slug (e.g., 'manager', 'staff')

### Example
```python
from apps.core.permissions import role_required

@role_required('manager')
def manager_dashboard(request):
    """Manager-only dashboard view."""
    stats = calculate_sales_stats()
    return render(request, 'dashboard.html', {'stats': stats})
```

## Combining Decorators

You can stack multiple decorators:

```python
from django.contrib.auth.decorators import login_required
from apps.core.permissions import role_required, permission_required

@login_required
@role_required('manager')
@permission_required('sales.view_report')
def sales_report(request):
    """View requiring login, manager role, and report permission."""
    report = generate_sales_report()
    return render(request, 'report.html', {'report': report})
```

### Decorator Order
1. `@login_required` - First (outermost)
2. `@role_required` - Second
3. `@permission_required` - Third (innermost)
```

### Quick Reference Guide Example

```markdown
# Quick Reference Guide

## Function Decorators

| Decorator | Purpose | Example |
|-----------|---------|---------|
| `@permission_required('perm')` | Single permission | `@permission_required('inventory.add_product')` |
| `@role_required('role')` | Single role | `@role_required('manager')` |
| `@any_permission_required('p1', 'p2')` | OR logic | `@any_permission_required('inv.add', 'inv.change')` |
| `@all_permissions_required('p1', 'p2')` | AND logic | `@all_permissions_required('inv.view', 'inv.add')` |

## DRF Permission Classes

| Class | Checks | Usage |
|-------|--------|-------|
| `IsSuperAdmin` | User has 'super-admin' role | `permission_classes = [IsSuperAdmin]` |
| `IsTenantAdmin` | User has 'tenant-admin' role | `permission_classes = [IsTenantAdmin]` |
| `IsManager` | User has 'manager' role | `permission_classes = [IsManager]` |
| `IsStaff` | User has 'staff' role | `permission_classes = [IsStaff]` |

## View Mixins

| Mixin | Purpose | Usage |
|-------|---------|-------|
| `PermissionMixin` | Permission checks | `class MyView(PermissionMixin, View)` |
| `RoleMixin` | Role checks | `class MyView(RoleMixin, View)` |
| `TenantPermissionMixin` | Tenant-scoped perms | `class MyViewSet(TenantPermissionMixin, ViewSet)` |

## JWT Token Claims

| Claim | Type | Example |
|-------|------|---------|
| `roles` | Array | `["tenant-admin", "manager"]` |
| `permissions` | Array | `["inventory.view_product", "sales.add_order"]` |
| `tenant_id` | Number | `15` |
| `tenant_slug` | String | `"acme-corp"` |
| `full_name` | String | `"John Doe"` |

## Error Codes

| Code | Status | Meaning |
|------|--------|---------|
| `permission_denied` | 403 | Missing permission or role |
| `authentication_required` | 401 | Not authenticated |
| `tenant_required` | 403 | Tenant context required |

## Common Patterns

### Protect All Actions in ViewSet
```python
class ProductViewSet(ModelViewSet):
    permission_classes = [IsTenantAdmin]
```

### Different Permissions per Action
```python
class ProductViewSet(TenantPermissionMixin, ModelViewSet):
    required_permissions = {
        'list': ['inventory.view_product'],
        'create': ['inventory.add_product'],
        'update': ['inventory.change_product'],
        'destroy': ['inventory.delete_product']
    }
```

### Multiple Permission Classes
```python
from rest_framework.permissions import IsAuthenticated

class ProductView(APIView):
    permission_classes = [IsAuthenticated, IsManager]
```

### Client-Side Role Check
```typescript
import { hasRole } from '@/utils/auth';

if (hasRole(token, 'manager')) {
    // Show manager features
}
```
```

### Expected Outcome
```
backend/docs/permissions/
├── README.md                      # NEW: Main index
├── decorators.md                  # NEW: Decorator docs
├── permission_classes.md          # NEW: Permission class docs
├── mixins.md                      # NEW: Mixin docs
├── jwt_claims.md                  # NEW: JWT documentation
├── error_responses.md             # NEW: Error format docs
├── quick_reference.md             # NEW: Quick lookup
└── examples/
    ├── function_based_views.md    # NEW: FBV examples
    ├── class_based_views.md       # NEW: CBV examples
    ├── viewsets.md                # NEW: ViewSet examples
    └── frontend_integration.md    # NEW: Frontend examples
```

### Documentation Sections

Each documentation file should include:

1. **Overview:** Purpose and use cases
2. **API Reference:** Signatures and parameters
3. **Examples:** Working code samples
4. **Best Practices:** Recommended patterns
5. **Common Pitfalls:** What to avoid
6. **Troubleshooting:** Problem solving
7. **Related Topics:** Cross-references

### Verification Checklist
- [ ] Documentation directory structure created
- [ ] Main README.md created with index
- [ ] Decorator documentation complete with examples
- [ ] Permission class documentation complete
- [ ] Mixin documentation complete
- [ ] JWT claims documented with payload structure
- [ ] Error response format documented
- [ ] Quick reference guide created
- [ ] Code examples provided for all components
- [ ] Frontend integration examples included
- [ ] Troubleshooting section added
- [ ] Links added to main project documentation

---

## Summary

### Tasks Completed
✅ **Task 76:** JWT token extended with roles, permissions, and tenant info  
✅ **Task 77:** Standardized 403 response format created  
✅ **Task 78:** Comprehensive documentation for all decorators and mixins

### Key Deliverables
1. **JWT Claims Integration**
   - Custom token serializer with role/permission claims
   - Tenant information in token payload
   - Client-side token decoding utilities

2. **Permission Denied Response**
   - Standard 403 error format
   - Detailed error information
   - Integration with decorators and permission classes

3. **Complete Documentation**
   - Decorator reference guide
   - Permission class documentation
   - Mixin usage guide
   - JWT claims documentation
   - Quick reference tables
   - Code examples

### Files Created
```
backend/apps/core/
├── jwt_claims.py                  # Custom JWT serializer
├── responses.py                   # Permission denied responses
└── permissions.py                 # Updated with custom responses

backend/docs/permissions/
├── README.md                      # Documentation index
├── decorators.md                  # Decorator documentation
├── permission_classes.md          # Permission class docs
├── mixins.md                      # Mixin documentation
├── jwt_claims.md                  # JWT documentation
├── error_responses.md             # Error format docs
├── quick_reference.md             # Quick reference
└── examples/                      # Code examples
    ├── function_based_views.md
    ├── class_based_views.md
    ├── viewsets.md
    └── frontend_integration.md
```

### Integration Points
- JWT tokens now include role and permission arrays
- Frontend can perform client-side authorization checks
- Consistent 403 error format across all endpoints
- Comprehensive documentation for all permission tools

### Next Steps
Continue to **Group F: API Endpoints & Testing** to:
- Create API endpoints for role/permission management
- Build role assignment views
- Implement permission checking endpoints
- Write comprehensive tests
- Create API documentation

---

## Notes for AI Agents

### JWT Claims Best Practices
1. **Token Size:** Keep claims minimal to reduce token size
2. **Sensitive Data:** Never include passwords or sensitive data
3. **Client Validation:** Always validate permissions on backend too
4. **Token Refresh:** Refresh tokens when roles/permissions change
5. **Expiration:** Set appropriate token lifetimes

### Response Format Guidelines
1. **Consistency:** Always use standard 403 format
2. **Detail Level:** Include enough info for debugging
3. **Security:** Don't expose sensitive system details
4. **Logging:** Log all permission denials for audit
5. **User Messaging:** Provide clear user-friendly messages

### Documentation Standards
1. **Keep Updated:** Update docs when code changes
2. **Code Examples:** Provide working examples
3. **Version Notes:** Document version-specific features
4. **Cross-Links:** Link related documentation
5. **Search Terms:** Include keywords for searchability

### Testing Requirements
1. **Token Claims:** Verify all claims present
2. **Token Decoding:** Test client-side decoding
3. **Error Format:** Validate 403 response structure
4. **Permission Checks:** Test with various roles
5. **Edge Cases:** Test invalid tokens, expired tokens

---

**Document Status:** ✅ Complete  
**Last Updated:** 2026-01-23  
**Next Document:** [../Group-F_API-Endpoints-Testing/](../Group-F_API-Endpoints-Testing/)
