# Tasks 73-75: View Mixins for Permission Checks

> **Phase:** 03 - Core Backend Infrastructure  
> **SubPhase:** 05 - Role & Permission System  
> **Group:** E - Permission Decorators & Mixins  
> **Document:** 03 of 04  
> **Tasks Covered:** 73, 74, 75

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [02_Tasks-68-72_DRF-Permission-Classes.md](02_Tasks-68-72_DRF-Permission-Classes.md)
- **→ Next Document:** [04_Tasks-76-78_JWT-Response.md](04_Tasks-76-78_JWT-Response.md)

---

## Document Overview

This document covers the creation of view mixins for class-based views (CBV) that provide permission and role checking functionality. These mixins integrate with Django's dispatch method to enforce access control before view execution.

### Tasks in This Document
| Task # | Task Name | Complexity |
|--------|-----------|------------|
| 73 | Create PermissionMixin | Medium |
| 74 | Create RoleMixin | Medium |
| 75 | Create TenantPermissionMixin | Medium |

---

## Task 73: Create PermissionMixin

### Overview
Create a mixin for class-based views that checks required permissions in the dispatch method. Views that use this mixin must define a `required_permissions` attribute listing the permissions needed to access the view.

### Dependencies
- Task 61: Create Permission model
- Task 62: Extend User model with permission methods

### Instructions

1. **Create mixins.py file**
   - Create file `backend/apps/core/mixins.py`
   - Import required dependencies

2. **Import dependencies**
   ```python
   from django.core.exceptions import PermissionDenied
   from django.views import View
   ```

3. **Create PermissionMixin class**
   - Inherit from object (mixin pattern)
   - Document the purpose and usage

4. **Add required_permissions attribute**
   - Class attribute for permission list
   - Default to empty list
   - Can be string or list of strings

5. **Override dispatch method**
   - Call parent's dispatch method
   - Check permissions before proceeding
   - Raise PermissionDenied if check fails

6. **Implement check_permissions method**
   - Extract required permissions
   - Support single permission (string) or multiple (list)
   - Check if user has all required permissions
   - Return boolean result

7. **Add docstrings**
   - Explain mixin purpose
   - Provide usage example
   - Document required_permissions attribute

8. **Handle permission format**
   - Support both string and list formats
   - Normalize to list internally
   - Handle empty permissions list (allow access)

### Implementation Approach

**Check Logic:**
```python
def dispatch(self, request, *args, **kwargs):
    """Check permissions before dispatching to view method."""
    if not self.check_permissions(request):
        raise PermissionDenied("You do not have permission to access this resource.")
    return super().dispatch(request, *args, **kwargs)

def check_permissions(self, request):
    """Check if user has all required permissions."""
    if not self.required_permissions:
        return True  # No permissions required
    
    # Normalize to list
    permissions = self.required_permissions
    if isinstance(permissions, str):
        permissions = [permissions]
    
    # Check all permissions
    return all(
        request.user.has_perm(perm)
        for perm in permissions
    )
```

### Usage Example
```python
from django.views.generic import ListView
from apps.core.mixins import PermissionMixin
from apps.inventory.models import Product

class ProductListView(PermissionMixin, ListView):
    model = Product
    required_permissions = 'inventory.view_product'
    # OR multiple permissions
    # required_permissions = ['inventory.view_product', 'inventory.list_products']
```

### Permission Format
| Format | Example | Description |
|--------|---------|-------------|
| Single string | `'inventory.view_product'` | One permission required |
| List of strings | `['inventory.view_product', 'inventory.list_products']` | All permissions required |
| Empty list | `[]` | No permissions required (allow all) |

### Error Handling
- **User not authenticated:** Should be handled by LoginRequiredMixin
- **Missing permissions:** Raise PermissionDenied with clear message
- **Invalid permission format:** Log warning, treat as no permissions

### Expected Outcome
```
backend/apps/core/
└── mixins.py
    └── class PermissionMixin
        ├── required_permissions = []
        ├── dispatch(request, *args, **kwargs)
        └── check_permissions(request)
```

### Verification Checklist
- [ ] `mixins.py` file created in `apps/core/`
- [ ] PermissionMixin class implemented
- [ ] dispatch() method overridden
- [ ] check_permissions() method implemented
- [ ] Supports string and list permission formats
- [ ] Raises PermissionDenied on failure
- [ ] Docstrings and usage examples included
- [ ] Empty permissions list allows access

---

## Task 74: Create RoleMixin

### Overview
Create a mixin for class-based views that checks required roles in the dispatch method. Views that use this mixin must define a `required_roles` attribute listing the role slugs needed to access the view.

### Dependencies
- Task 58: Create Role model
- Task 62: Extend User model with role methods

### Instructions

1. **Add RoleMixin to mixins.py**
   - Same file as PermissionMixin
   - Keep consistent structure

2. **Create RoleMixin class**
   - Inherit from object (mixin pattern)
   - Document the purpose and usage

3. **Add required_roles attribute**
   - Class attribute for role slug list
   - Default to empty list
   - Can be string or list of strings

4. **Override dispatch method**
   - Call parent's dispatch method
   - Check roles before proceeding
   - Raise PermissionDenied if check fails

5. **Implement check_roles method**
   - Extract required roles
   - Support single role (string) or multiple (list)
   - Check if user has ANY of the required roles (OR logic)
   - Return boolean result

6. **Add docstrings**
   - Explain mixin purpose
   - Provide usage example
   - Document required_roles attribute

7. **Handle role format**
   - Support both string and list formats
   - Normalize to list internally
   - Handle empty roles list (allow access)

8. **Implement OR logic**
   - User needs ANY role, not all roles
   - More flexible than permission checks
   - Typical role hierarchy pattern

### Implementation Approach

**Check Logic:**
```python
def dispatch(self, request, *args, **kwargs):
    """Check roles before dispatching to view method."""
    if not self.check_roles(request):
        raise PermissionDenied("You do not have the required role to access this resource.")
    return super().dispatch(request, *args, **kwargs)

def check_roles(self, request):
    """Check if user has any of the required roles."""
    if not self.required_roles:
        return True  # No roles required
    
    # Normalize to list
    roles = self.required_roles
    if isinstance(roles, str):
        roles = [roles]
    
    # Check any role (OR logic)
    return any(
        request.user.has_role(role_slug)
        for role_slug in roles
    )
```

### Usage Example
```python
from django.views.generic import UpdateView
from apps.core.mixins import RoleMixin
from apps.inventory.models import Product

class ProductUpdateView(RoleMixin, UpdateView):
    model = Product
    required_roles = 'manager'
    # OR multiple roles (user needs ANY one)
    # required_roles = ['tenant-admin', 'manager']
```

### Role Format
| Format | Example | Description |
|--------|---------|-------------|
| Single string | `'manager'` | One role required |
| List of strings | `['tenant-admin', 'manager']` | Any role required (OR) |
| Empty list | `[]` | No roles required (allow all) |

### OR vs AND Logic
- **RoleMixin:** Uses OR logic (any role matches)
- **PermissionMixin:** Uses AND logic (all permissions required)
- **Rationale:** Roles are hierarchical, permissions are granular

### Role Hierarchy
| Role | Includes | Example Access |
|------|----------|----------------|
| `super-admin` | All permissions | System-wide access |
| `tenant-admin` | Tenant permissions | Tenant management |
| `manager` | Department permissions | Inventory, Sales |
| `staff` | Basic permissions | View data, create orders |

### Expected Outcome
```
backend/apps/core/
└── mixins.py
    ├── class PermissionMixin
    └── class RoleMixin
        ├── required_roles = []
        ├── dispatch(request, *args, **kwargs)
        └── check_roles(request)
```

### Verification Checklist
- [ ] RoleMixin class implemented in `mixins.py`
- [ ] dispatch() method overridden
- [ ] check_roles() method implemented
- [ ] Supports string and list role formats
- [ ] Uses OR logic (any role matches)
- [ ] Raises PermissionDenied on failure
- [ ] Docstrings and usage examples included
- [ ] Empty roles list allows access

---

## Task 75: Create TenantPermissionMixin

### Overview
Create a mixin for class-based views that enforces tenant-scoped access control. This mixin ensures that users can only access data belonging to their own tenant, preventing cross-tenant data leaks.

### Dependencies
- Task 62: Extend User model with permission methods
- Multi-tenancy middleware (from Phase 02)

### Instructions

1. **Add TenantPermissionMixin to mixins.py**
   - Same file as other mixins
   - More complex than previous mixins

2. **Create TenantPermissionMixin class**
   - Inherit from object (mixin pattern)
   - Document tenant-scoping purpose

3. **Add tenant_required attribute**
   - Boolean flag to enforce tenant check
   - Default to True
   - Allow disabling for public views

4. **Override dispatch method**
   - Get current tenant from request
   - Verify user belongs to tenant
   - Call parent's dispatch method

5. **Implement get_tenant method**
   - Extract tenant from request
   - Tenant should be set by middleware
   - Handle missing tenant gracefully

6. **Implement check_tenant_access method**
   - Verify user belongs to request tenant
   - Check user.tenant matches request.tenant
   - Return boolean result

7. **Add override capability**
   - Allow super admins to bypass tenant check
   - Check for super-admin role
   - Useful for system administration

8. **Handle edge cases**
   - No tenant on request (public API)
   - User without tenant (system user)
   - Super admin access across tenants

### Implementation Approach

**Check Logic:**
```python
def dispatch(self, request, *args, **kwargs):
    """Check tenant access before dispatching to view method."""
    if self.tenant_required and not self.check_tenant_access(request):
        raise PermissionDenied("You do not have access to this tenant's data.")
    return super().dispatch(request, *args, **kwargs)

def get_tenant(self, request):
    """Get current tenant from request."""
    return getattr(request, 'tenant', None)

def check_tenant_access(self, request):
    """Check if user has access to current tenant."""
    # Super admins can access all tenants
    if request.user.has_role('super-admin'):
        return True
    
    # Get tenant from request
    tenant = self.get_tenant(request)
    if not tenant:
        return False  # No tenant on request
    
    # Check user belongs to tenant
    return request.user.tenant_id == tenant.id
```

### Usage Example
```python
from django.views.generic import DetailView
from apps.core.mixins import TenantPermissionMixin, PermissionMixin
from apps.inventory.models import Product

class ProductDetailView(TenantPermissionMixin, PermissionMixin, DetailView):
    model = Product
    required_permissions = 'inventory.view_product'
    tenant_required = True  # Default, can be omitted
```

### Combining Mixins
```python
# All three mixins together
class SecureProductView(TenantPermissionMixin, RoleMixin, PermissionMixin, UpdateView):
    model = Product
    required_roles = ['tenant-admin', 'manager']
    required_permissions = 'inventory.change_product'
    tenant_required = True
```

### Mixin Order (MRO)
- **Correct Order:** TenantPermissionMixin, RoleMixin, PermissionMixin, BaseView
- **Execution Order:** Left to right in dispatch method
- **Best Practice:** Most restrictive first (tenant → role → permission)

### Tenant Check Flow
```
Request ──► Middleware sets tenant
              │
              ▼
         TenantPermissionMixin
              │
              ├── Super admin? ──► Allow
              │
              ├── User.tenant == Request.tenant? ──► Allow
              │
              └── Else ──► PermissionDenied
```

### Super Admin Bypass
- Super admins can access any tenant
- Useful for system administration
- Should be logged for audit purposes
- Consider adding audit logging in future

### Expected Outcome
```
backend/apps/core/
└── mixins.py
    ├── class PermissionMixin
    ├── class RoleMixin
    └── class TenantPermissionMixin
        ├── tenant_required = True
        ├── dispatch(request, *args, **kwargs)
        ├── get_tenant(request)
        └── check_tenant_access(request)
```

### Verification Checklist
- [ ] TenantPermissionMixin class implemented
- [ ] dispatch() method overridden
- [ ] get_tenant() method implemented
- [ ] check_tenant_access() method implemented
- [ ] Super admin bypass logic included
- [ ] Raises PermissionDenied on failure
- [ ] tenant_required attribute configurable
- [ ] Docstrings and usage examples included
- [ ] Works correctly with other mixins

---

## Summary

### Tasks Completed in This Document
| Task # | Task Name | Key Deliverable |
|--------|-----------|-----------------|
| 73 | Create PermissionMixin | Permission checking mixin for CBVs |
| 74 | Create RoleMixin | Role checking mixin for CBVs |
| 75 | Create TenantPermissionMixin | Tenant-scoped access control mixin |

### Final mixins.py Structure
```python
# backend/apps/core/mixins.py

from django.core.exceptions import PermissionDenied

class PermissionMixin:
    """
    Mixin for class-based views to check required permissions.
    
    Usage:
        class MyView(PermissionMixin, View):
            required_permissions = 'app.permission_name'
    """
    required_permissions = []
    
    def dispatch(self, request, *args, **kwargs):
        if not self.check_permissions(request):
            raise PermissionDenied("You do not have permission to access this resource.")
        return super().dispatch(request, *args, **kwargs)
    
    def check_permissions(self, request):
        # Implementation
        pass

class RoleMixin:
    """
    Mixin for class-based views to check required roles.
    
    Usage:
        class MyView(RoleMixin, View):
            required_roles = 'manager'
    """
    required_roles = []
    
    def dispatch(self, request, *args, **kwargs):
        if not self.check_roles(request):
            raise PermissionDenied("You do not have the required role to access this resource.")
        return super().dispatch(request, *args, **kwargs)
    
    def check_roles(self, request):
        # Implementation
        pass

class TenantPermissionMixin:
    """
    Mixin for class-based views to enforce tenant-scoped access.
    
    Usage:
        class MyView(TenantPermissionMixin, View):
            tenant_required = True
    """
    tenant_required = True
    
    def dispatch(self, request, *args, **kwargs):
        if self.tenant_required and not self.check_tenant_access(request):
            raise PermissionDenied("You do not have access to this tenant's data.")
        return super().dispatch(request, *args, **kwargs)
    
    def get_tenant(self, request):
        # Implementation
        pass
    
    def check_tenant_access(self, request):
        # Implementation
        pass
```

### Mixin Comparison
| Mixin | Purpose | Logic | Bypass |
|-------|---------|-------|--------|
| PermissionMixin | Check permissions | AND (all required) | Empty list |
| RoleMixin | Check roles | OR (any required) | Empty list |
| TenantPermissionMixin | Check tenant access | Exact match | Super admin |

### Usage Patterns

**Single Mixin:**
```python
class ProductListView(PermissionMixin, ListView):
    required_permissions = 'inventory.view_product'
```

**Multiple Mixins:**
```python
class ProductUpdateView(TenantPermissionMixin, RoleMixin, PermissionMixin, UpdateView):
    required_roles = ['tenant-admin', 'manager']
    required_permissions = 'inventory.change_product'
    tenant_required = True
```

**With LoginRequiredMixin:**
```python
from django.contrib.auth.mixins import LoginRequiredMixin

class SecureView(LoginRequiredMixin, TenantPermissionMixin, RoleMixin, ListView):
    # LoginRequiredMixin should be first
    required_roles = 'manager'
```

### Best Practices

1. **Mixin Order:** Always use consistent order for predictable behavior
2. **LoginRequiredMixin First:** Ensure authentication before authorization
3. **Tenant First:** Check tenant before roles/permissions
4. **Role Before Permission:** Check broad access before specific permissions
5. **Empty Lists:** Allow defining views without restrictions when needed
6. **Super Admin Bypass:** Consider security implications of bypassing checks
7. **Error Messages:** Provide clear, specific error messages
8. **Audit Logging:** Log all permission denials for security monitoring

### Common Combinations

| View Type | Mixins | Purpose |
|-----------|--------|---------|
| Public List | None | Anyone can view |
| Authenticated List | LoginRequiredMixin | Logged in users only |
| Permission List | LoginRequiredMixin, PermissionMixin | Specific permission required |
| Role List | LoginRequiredMixin, RoleMixin | Role-based access |
| Tenant List | LoginRequiredMixin, TenantPermissionMixin | Tenant data only |
| Secure Update | LoginRequiredMixin, TenantPermissionMixin, RoleMixin, PermissionMixin | Full protection |

### Next Steps
1. Proceed to [04_Tasks-76-78_JWT-Response.md](04_Tasks-76-78_JWT-Response.md) to add roles to JWT claims and create permission denied response
2. Test mixin combinations with various view types
3. Document view protection patterns for development team

---

## Notes for AI Agents

1. **Mixin Pattern:** Mixins don't inherit from View, they inherit from object
2. **Method Resolution Order (MRO):** Python's MRO determines dispatch order
3. **Super Calls:** Always call super().dispatch() to continue chain
4. **Permission Format:** Normalize string/list to avoid type errors
5. **OR vs AND:** RoleMixin uses OR, PermissionMixin uses AND
6. **Tenant Middleware:** Assumes tenant is set on request by middleware
7. **Super Admin:** Special handling for cross-tenant access
8. **Empty Defaults:** Empty lists mean no restrictions, not block all
9. **Error Messages:** Use specific, helpful error messages
10. **Testing:** Test each mixin individually and in combination
11. **Documentation:** Provide clear usage examples in docstrings
12. **Django CBV:** Works with any Django class-based view (ListView, DetailView, etc.)
