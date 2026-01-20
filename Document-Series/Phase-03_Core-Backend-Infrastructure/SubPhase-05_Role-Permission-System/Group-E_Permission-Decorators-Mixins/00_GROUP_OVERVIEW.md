# Group E: Permission Decorators & Mixins

> **Phase:** 03 - Core Backend Infrastructure  
> **SubPhase:** 05 - Role & Permission System  
> **Group:** E of F  
> **Tasks Covered:** 63-78  
> **Group Goal:** Create decorators, DRF permission classes, and view mixins for access control

---

## Navigation

- **↑ Parent:** [00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [Group-D_User-Role-Management](../Group-D_User-Role-Management/)
- **→ Next Group:** [Group-F_API-Endpoints-Testing](../Group-F_API-Endpoints-Testing/)

---

## Group Overview

This group creates the permission enforcement layer including function decorators, DRF permission classes, view mixins, and JWT claim integration. These tools make it easy to protect API endpoints and views.

### Key Components
- **Function Decorators:** permission_required, role_required
- **DRF Permission Classes:** Custom permission classes
- **View Mixins:** Reusable permission mixins
- **JWT Integration:** Add roles to token claims
- **Permission Denied Response:** Standard 403 format

### Protection Layers
```
Request ──► Decorator/Mixin ──► DRF Permission Class ──► View
                │                       │
                └── permission_required ─┘
                    role_required
```

---

## Documents in This Group

| Document # | Document Name | Tasks Covered | Description |
|------------|---------------|---------------|-------------|
| DOC-01 | Function Decorators | Tasks 63-67 | View function decorators |
| DOC-02 | DRF Permission Classes | Tasks 68-72 | IsRolePermission classes |
| DOC-03 | View Mixins | Tasks 73-75 | Permission and role mixins |
| DOC-04 | JWT & Response | Tasks 76-78 | Token claims & 403 response |

---

## Task Summary

| Task # | Task Name | Key Points |
|--------|-----------|------------|
| 63 | Create Permissions Module | apps/core/permissions.py |
| 64 | Create permission_required Decorator | View function decorator |
| 65 | Create role_required Decorator | Role check decorator |
| 66 | Create any_permission_required | OR logic decorator |
| 67 | Create all_permissions_required | AND logic decorator |
| 68 | Create DRF Permission Class | IsRolePermission base |
| 69 | Create IsSuperAdmin Permission | Super admin check |
| 70 | Create IsTenantAdmin Permission | Tenant admin check |
| 71 | Create IsManager Permission | Manager check |
| 72 | Create IsStaff Permission | Staff check |
| 73 | Create PermissionMixin | View mixin |
| 74 | Create RoleMixin | Role view mixin |
| 75 | Create TenantPermissionMixin | Tenant-scoped perms |
| 76 | Add to JWT Claims | Add roles to token |
| 77 | Create Permission Denied Response | Standard 403 response |
| 78 | Document Decorators | Decorator documentation |

---

## Execution Order

```
[Task 63: Create Permissions Module]
        │
        ▼
[Tasks 64-67: Function Decorators]
        │
        ▼
[Tasks 68-72: DRF Permission Classes]
        │
        ▼
[Tasks 73-75: View Mixins]
        │
        ▼
[Tasks 76-78: JWT Claims & Response]
```

---

## Expected Deliverables

### Code Files
```
backend/apps/core/
├── permissions.py
│   ├── # Function Decorators
│   ├── def permission_required(perm)
│   ├── def role_required(role_slug)
│   ├── def any_permission_required(*perms)
│   ├── def all_permissions_required(*perms)
│   ├── # DRF Permission Classes
│   ├── class IsRolePermission(BasePermission)
│   ├── class IsSuperAdmin(BasePermission)
│   ├── class IsTenantAdmin(BasePermission)
│   ├── class IsManager(BasePermission)
│   ├── class IsStaff(BasePermission)
│   └── # Response
│   └── class PermissionDeniedResponse
├── mixins.py
│   ├── class PermissionMixin
│   ├── class RoleMixin
│   └── class TenantPermissionMixin
└── jwt_claims.py
    └── add_role_claims(token, user)
```

### Function Decorators
```python
def permission_required(perm):
    """Decorator to check single permission."""
    def decorator(view_func):
        @wraps(view_func)
        def wrapper(request, *args, **kwargs):
            if not request.user.has_perm(perm):
                raise PermissionDenied
            return view_func(request, *args, **kwargs)
        return wrapper
    return decorator

def role_required(role_slug):
    """Decorator to check user role."""
    def decorator(view_func):
        @wraps(view_func)
        def wrapper(request, *args, **kwargs):
            if not request.user.has_role(role_slug):
                raise PermissionDenied
            return view_func(request, *args, **kwargs)
        return wrapper
    return decorator
```

### DRF Permission Classes
```python
class IsSuperAdmin(BasePermission):
    """Allows access only to super admins."""
    def has_permission(self, request, view):
        return (
            request.user.is_authenticated and
            request.user.has_role('super-admin')
        )

class IsTenantAdmin(BasePermission):
    """Allows access only to tenant admins."""
    def has_permission(self, request, view):
        return (
            request.user.is_authenticated and
            request.user.has_role('tenant-admin')
        )
```

### JWT Claims Extension
```python
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        # Add custom claims
        token['roles'] = list(user.user_roles.values_list('role__slug', flat=True))
        token['permissions'] = list(user.get_all_permissions())
        return token
```

---

## Notes for AI Agents

1. **Decorator Order:** Apply permission decorators after login_required
2. **DRF Classes:** Extend BasePermission from rest_framework
3. **OR Logic:** any_permission_required uses any()
4. **AND Logic:** all_permissions_required uses all()
5. **JWT Claims:** Add roles and permissions to token
6. **Tenant Scoping:** TenantPermissionMixin checks tenant
7. **403 Response:** Consistent error format
8. **Caching:** Permission checks use cached permissions
