# Tasks 68-72: DRF Permission Classes

> **Phase:** 03 - Core Backend Infrastructure  
> **SubPhase:** 05 - Role & Permission System  
> **Group:** E - Permission Decorators & Mixins  
> **Document:** 02 of 04  
> **Tasks Covered:** 68, 69, 70, 71, 72

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [01_Tasks-63-67_Function-Decorators.md](01_Tasks-63-67_Function-Decorators.md)
- **→ Next Document:** [03_Tasks-73-75_View-Mixins.md](03_Tasks-73-75_View-Mixins.md)

---

## Document Overview

This document covers the creation of Django REST Framework (DRF) permission classes for role-based and permission-based access control. These classes extend `rest_framework.permissions.BasePermission` and provide declarative permission checking for DRF API views.

### Tasks in This Document
| Task # | Task Name | Complexity |
|--------|-----------|------------|
| 68 | Create IsRolePermission Base Class | Medium |
| 69 | Create IsSuperAdmin Permission | Simple |
| 70 | Create IsTenantAdmin Permission | Simple |
| 71 | Create IsManager Permission | Simple |
| 72 | Create IsStaff Permission | Simple |

---

## Task 68: Create IsRolePermission Base Class

### Overview
Create a base DRF permission class that checks if a user has a specific permission. This class serves as the foundation for permission-based access control in DRF views.

### Dependencies
- Task 63: Create Permissions Module
- Task 49: User Model has_perm() Method

### Instructions

1. **Open permissions module**
   - Open `backend/apps/core/permissions.py`
   - Locate section for DRF permission classes

2. **Import DRF BasePermission**
   ```python
   from rest_framework.permissions import BasePermission
   ```

3. **Create IsRolePermission class**
   - Extend `BasePermission`
   - Accept `permission_codename` in constructor
   - Store permission codename as instance variable

4. **Implement has_permission method**
   - Check if user is authenticated
   - Check if user has the specified permission
   - Return boolean result
   - This method is called for view-level permission checks

5. **Implement has_object_permission method**
   - Check if user is authenticated
   - Check if user has the specified permission
   - Optionally check object-level permissions
   - Return boolean result
   - This method is called for object-level permission checks

6. **Add docstring**
   - Explain purpose of the class
   - Describe how to instantiate with permission codename
   - Provide usage example in DRF views

7. **Add error message customization**
   - Override `message` attribute
   - Provide clear permission denied message

### Implementation Structure

```python
class IsRolePermission(BasePermission):
    """
    Permission class to check if user has a specific permission.
    
    Usage:
        permission_classes = [IsRolePermission('inventory.view_product')]
    """
    
    def __init__(self, permission_codename):
        """
        Initialize with permission codename.
        
        Args:
            permission_codename: String in format 'app.codename'
        """
        self.permission_codename = permission_codename
        self.message = f"User does not have '{permission_codename}' permission."
    
    def has_permission(self, request, view):
        """
        Check view-level permission.
        
        Args:
            request: DRF request object
            view: DRF view instance
            
        Returns:
            bool: True if user has permission
        """
        return (
            request.user and
            request.user.is_authenticated and
            request.user.has_perm(self.permission_codename)
        )
    
    def has_object_permission(self, request, view, obj):
        """
        Check object-level permission.
        
        Args:
            request: DRF request object
            view: DRF view instance
            obj: Object being accessed
            
        Returns:
            bool: True if user has permission
        """
        return self.has_permission(request, view)
```

### Usage Examples

**API View with IsRolePermission:**
```python
from rest_framework.views import APIView
from rest_framework.response import Response
from apps.core.permissions import IsRolePermission

class ProductListView(APIView):
    permission_classes = [IsRolePermission('inventory.view_product')]
    
    def get(self, request):
        products = Product.objects.all()
        return Response({'products': products})
```

**ViewSet with IsRolePermission:**
```python
from rest_framework import viewsets
from apps.core.permissions import IsRolePermission

class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    
    def get_permissions(self):
        if self.action == 'list':
            return [IsRolePermission('inventory.view_product')()]
        elif self.action == 'create':
            return [IsRolePermission('inventory.add_product')()]
        return super().get_permissions()
```

### Permission Check Flow
```
Request ──► DRF View
              │
              ▼
         permission_classes
              │
              ▼
       IsRolePermission
              │
              ├──► has_permission()
              │       │
              │       ├── Check authenticated
              │       ├── Check has_perm()
              │       └── Return True/False
              │
              └──► has_object_permission() (if object access)
                      │
                      ├── Check authenticated
                      ├── Check has_perm()
                      └── Return True/False
```

### Expected Outcome
- `IsRolePermission` class available in `permissions.py`
- Can be instantiated with any permission codename
- Works with DRF APIView and ViewSet
- Provides clear error messages when permission denied

### Verification Checklist
- [ ] `IsRolePermission` class exists in `permissions.py`
- [ ] Extends `BasePermission` from DRF
- [ ] Accepts `permission_codename` in constructor
- [ ] Implements `has_permission()` method
- [ ] Implements `has_object_permission()` method
- [ ] Checks user authentication
- [ ] Calls `user.has_perm()` method
- [ ] Has clear docstring with usage examples
- [ ] Custom error message included

---

## Task 69: Create IsSuperAdmin Permission

### Overview
Create a DRF permission class that allows access only to users with the "super-admin" role. This is the highest level of access in the system.

### Dependencies
- Task 68: Create IsRolePermission Base Class
- Task 49: User Model has_role() Method

### Instructions

1. **Open permissions module**
   - Open `backend/apps/core/permissions.py`
   - Locate section after IsRolePermission class

2. **Create IsSuperAdmin class**
   - Extend `BasePermission`
   - Override `message` attribute with clear error message

3. **Implement has_permission method**
   - Check if user is authenticated
   - Check if user has "super-admin" role using `has_role('super-admin')`
   - Return boolean result

4. **Implement has_object_permission method**
   - Call `has_permission()` method
   - Super admins have access to all objects
   - Return same result as has_permission

5. **Add docstring**
   - Explain that only super admins can access
   - Provide usage examples

### Implementation Structure

```python
class IsSuperAdmin(BasePermission):
    """
    Permission class that allows access only to super admins.
    
    Usage:
        permission_classes = [IsSuperAdmin]
    """
    
    message = "Only super administrators can perform this action."
    
    def has_permission(self, request, view):
        """
        Check if user is a super admin.
        
        Args:
            request: DRF request object
            view: DRF view instance
            
        Returns:
            bool: True if user is super admin
        """
        return (
            request.user and
            request.user.is_authenticated and
            request.user.has_role('super-admin')
        )
    
    def has_object_permission(self, request, view, obj):
        """
        Check object-level permission for super admin.
        
        Args:
            request: DRF request object
            view: DRF view instance
            obj: Object being accessed
            
        Returns:
            bool: True if user is super admin
        """
        return self.has_permission(request, view)
```

### Usage Examples

**Restrict entire view to super admins:**
```python
from rest_framework.views import APIView
from apps.core.permissions import IsSuperAdmin

class SystemSettingsView(APIView):
    permission_classes = [IsSuperAdmin]
    
    def get(self, request):
        # Only super admins can access system settings
        settings = SystemSettings.objects.all()
        return Response({'settings': settings})
```

**Restrict specific actions:**
```python
from rest_framework import viewsets
from apps.core.permissions import IsSuperAdmin

class TenantViewSet(viewsets.ModelViewSet):
    queryset = Tenant.objects.all()
    
    def get_permissions(self):
        if self.action in ['create', 'delete']:
            return [IsSuperAdmin()]
        return super().get_permissions()
```

### Super Admin Access Scope
| Resource | Access Level |
|----------|--------------|
| All Tenants | Full access |
| System Settings | Full access |
| User Management | Full access |
| All Modules | Full access |
| Tenant Creation | Can create |
| Tenant Deletion | Can delete |

### Expected Outcome
- `IsSuperAdmin` class available in `permissions.py`
- Checks for "super-admin" role
- Works with DRF views and viewsets
- Provides clear error message

### Verification Checklist
- [ ] `IsSuperAdmin` class exists in `permissions.py`
- [ ] Extends `BasePermission` from DRF
- [ ] Implements `has_permission()` method
- [ ] Implements `has_object_permission()` method
- [ ] Checks for "super-admin" role using `has_role()`
- [ ] Has clear error message
- [ ] Has docstring with usage examples

---

## Task 70: Create IsTenantAdmin Permission

### Overview
Create a DRF permission class that allows access only to users with the "tenant-admin" role. Tenant admins have full control within their tenant.

### Dependencies
- Task 68: Create IsRolePermission Base Class
- Task 49: User Model has_role() Method

### Instructions

1. **Open permissions module**
   - Open `backend/apps/core/permissions.py`
   - Locate section after IsSuperAdmin class

2. **Create IsTenantAdmin class**
   - Extend `BasePermission`
   - Override `message` attribute

3. **Implement has_permission method**
   - Check if user is authenticated
   - Check if user has "tenant-admin" role
   - Return boolean result

4. **Implement has_object_permission method**
   - Call `has_permission()` method
   - Optionally check if object belongs to user's tenant
   - Return boolean result

5. **Add docstring**
   - Explain tenant admin access
   - Note tenant-scoped access
   - Provide usage examples

### Implementation Structure

```python
class IsTenantAdmin(BasePermission):
    """
    Permission class that allows access only to tenant admins.
    
    Tenant admins have full access within their tenant scope.
    
    Usage:
        permission_classes = [IsTenantAdmin]
    """
    
    message = "Only tenant administrators can perform this action."
    
    def has_permission(self, request, view):
        """
        Check if user is a tenant admin.
        
        Args:
            request: DRF request object
            view: DRF view instance
            
        Returns:
            bool: True if user is tenant admin
        """
        return (
            request.user and
            request.user.is_authenticated and
            request.user.has_role('tenant-admin')
        )
    
    def has_object_permission(self, request, view, obj):
        """
        Check object-level permission for tenant admin.
        
        Ensures object belongs to user's tenant.
        
        Args:
            request: DRF request object
            view: DRF view instance
            obj: Object being accessed
            
        Returns:
            bool: True if user is tenant admin and object in tenant
        """
        if not self.has_permission(request, view):
            return False
        
        # Check if object has tenant attribute
        if hasattr(obj, 'tenant'):
            return obj.tenant == request.user.tenant
        
        return True
```

### Usage Examples

**Tenant settings management:**
```python
from rest_framework.views import APIView
from apps.core.permissions import IsTenantAdmin

class TenantSettingsView(APIView):
    permission_classes = [IsTenantAdmin]
    
    def get(self, request):
        # Only tenant admins can view tenant settings
        settings = request.user.tenant.settings
        return Response({'settings': settings})
```

**User management within tenant:**
```python
from rest_framework import viewsets
from apps.core.permissions import IsTenantAdmin

class TenantUserViewSet(viewsets.ModelViewSet):
    permission_classes = [IsTenantAdmin]
    
    def get_queryset(self):
        # Return users from admin's tenant
        return User.objects.filter(tenant=self.request.user.tenant)
```

### Tenant Admin Access Scope
| Resource | Access Level |
|----------|--------------|
| Own Tenant | Full access |
| Tenant Users | Full management |
| Tenant Settings | Full access |
| Tenant Data | Full access |
| Other Tenants | No access |
| System Settings | No access |

### Expected Outcome
- `IsTenantAdmin` class available in `permissions.py`
- Checks for "tenant-admin" role
- Optionally validates tenant scope
- Works with DRF views and viewsets

### Verification Checklist
- [ ] `IsTenantAdmin` class exists in `permissions.py`
- [ ] Extends `BasePermission` from DRF
- [ ] Implements `has_permission()` method
- [ ] Implements `has_object_permission()` method
- [ ] Checks for "tenant-admin" role
- [ ] Optionally checks tenant scope
- [ ] Has clear error message
- [ ] Has docstring with usage examples

---

## Task 71: Create IsManager Permission

### Overview
Create a DRF permission class that allows access only to users with the "manager" role. Managers typically have access to operational features and reports.

### Dependencies
- Task 68: Create IsRolePermission Base Class
- Task 49: User Model has_role() Method

### Instructions

1. **Open permissions module**
   - Open `backend/apps/core/permissions.py`
   - Locate section after IsTenantAdmin class

2. **Create IsManager class**
   - Extend `BasePermission`
   - Override `message` attribute

3. **Implement has_permission method**
   - Check if user is authenticated
   - Check if user has "manager" role
   - Return boolean result

4. **Implement has_object_permission method**
   - Call `has_permission()` method
   - Optionally check tenant scope
   - Return boolean result

5. **Add docstring**
   - Explain manager access level
   - Provide usage examples

### Implementation Structure

```python
class IsManager(BasePermission):
    """
    Permission class that allows access only to managers.
    
    Managers have access to operational features and reports
    within their tenant.
    
    Usage:
        permission_classes = [IsManager]
    """
    
    message = "Only managers can perform this action."
    
    def has_permission(self, request, view):
        """
        Check if user is a manager.
        
        Args:
            request: DRF request object
            view: DRF view instance
            
        Returns:
            bool: True if user is manager
        """
        return (
            request.user and
            request.user.is_authenticated and
            request.user.has_role('manager')
        )
    
    def has_object_permission(self, request, view, obj):
        """
        Check object-level permission for manager.
        
        Args:
            request: DRF request object
            view: DRF view instance
            obj: Object being accessed
            
        Returns:
            bool: True if user is manager
        """
        if not self.has_permission(request, view):
            return False
        
        # Check tenant scope if object has tenant
        if hasattr(obj, 'tenant'):
            return obj.tenant == request.user.tenant
        
        return True
```

### Usage Examples

**Reports and analytics:**
```python
from rest_framework.views import APIView
from apps.core.permissions import IsManager

class SalesReportView(APIView):
    permission_classes = [IsManager]
    
    def get(self, request):
        # Only managers can view sales reports
        report = generate_sales_report(request.user.tenant)
        return Response({'report': report})
```

**Approve operations:**
```python
from rest_framework.decorators import action
from rest_framework import viewsets
from apps.core.permissions import IsManager

class OrderViewSet(viewsets.ModelViewSet):
    
    @action(detail=True, methods=['post'], permission_classes=[IsManager])
    def approve(self, request, pk=None):
        # Only managers can approve orders
        order = self.get_object()
        order.approve(request.user)
        return Response({'status': 'approved'})
```

### Manager Access Scope
| Resource | Access Level |
|----------|--------------|
| Reports | View & generate |
| Inventory | View & manage |
| Orders | Approve & manage |
| Sales | View & analyze |
| Staff | Limited management |
| Settings | Limited access |

### Expected Outcome
- `IsManager` class available in `permissions.py`
- Checks for "manager" role
- Works with DRF views and viewsets
- Provides clear error message

### Verification Checklist
- [ ] `IsManager` class exists in `permissions.py`
- [ ] Extends `BasePermission` from DRF
- [ ] Implements `has_permission()` method
- [ ] Implements `has_object_permission()` method
- [ ] Checks for "manager" role
- [ ] Optionally checks tenant scope
- [ ] Has clear error message
- [ ] Has docstring with usage examples

---

## Task 72: Create IsStaff Permission

### Overview
Create a DRF permission class that allows access only to users with the "staff" role. Staff members have basic access to operational features.

### Dependencies
- Task 68: Create IsRolePermission Base Class
- Task 49: User Model has_role() Method

### Instructions

1. **Open permissions module**
   - Open `backend/apps/core/permissions.py`
   - Locate section after IsManager class

2. **Create IsStaff class**
   - Extend `BasePermission`
   - Override `message` attribute

3. **Implement has_permission method**
   - Check if user is authenticated
   - Check if user has "staff" role
   - Return boolean result

4. **Implement has_object_permission method**
   - Call `has_permission()` method
   - Optionally check tenant scope
   - Return boolean result

5. **Add docstring**
   - Explain staff access level
   - Provide usage examples

### Implementation Structure

```python
class IsStaff(BasePermission):
    """
    Permission class that allows access only to staff members.
    
    Staff members have basic access to operational features
    within their tenant.
    
    Usage:
        permission_classes = [IsStaff]
    """
    
    message = "Only staff members can perform this action."
    
    def has_permission(self, request, view):
        """
        Check if user is a staff member.
        
        Args:
            request: DRF request object
            view: DRF view instance
            
        Returns:
            bool: True if user is staff
        """
        return (
            request.user and
            request.user.is_authenticated and
            request.user.has_role('staff')
        )
    
    def has_object_permission(self, request, view, obj):
        """
        Check object-level permission for staff.
        
        Args:
            request: DRF request object
            view: DRF view instance
            obj: Object being accessed
            
        Returns:
            bool: True if user is staff
        """
        if not self.has_permission(request, view):
            return False
        
        # Check tenant scope if object has tenant
        if hasattr(obj, 'tenant'):
            return obj.tenant == request.user.tenant
        
        return True
```

### Usage Examples

**Basic data entry:**
```python
from rest_framework.views import APIView
from apps.core.permissions import IsStaff

class ProductListView(APIView):
    permission_classes = [IsStaff]
    
    def get(self, request):
        # Staff can view products
        products = Product.objects.filter(tenant=request.user.tenant)
        return Response({'products': products})
```

**Order processing:**
```python
from rest_framework import viewsets
from apps.core.permissions import IsStaff

class OrderViewSet(viewsets.ModelViewSet):
    permission_classes = [IsStaff]
    
    def get_queryset(self):
        # Staff can access orders in their tenant
        return Order.objects.filter(tenant=self.request.user.tenant)
```

### Staff Access Scope
| Resource | Access Level |
|----------|--------------|
| Products | View & edit |
| Orders | View & process |
| Customers | View & edit |
| Inventory | View & update |
| Reports | Limited view |
| Settings | No access |

### Expected Outcome
- `IsStaff` class available in `permissions.py`
- Checks for "staff" role
- Works with DRF views and viewsets
- Provides clear error message

### Verification Checklist
- [ ] `IsStaff` class exists in `permissions.py`
- [ ] Extends `BasePermission` from DRF
- [ ] Implements `has_permission()` method
- [ ] Implements `has_object_permission()` method
- [ ] Checks for "staff" role
- [ ] Optionally checks tenant scope
- [ ] Has clear error message
- [ ] Has docstring with usage examples

---

## Complete DRF Permission Classes Structure

### Module Organization
```python
# backend/apps/core/permissions.py

from rest_framework.permissions import BasePermission

# ============================================================================
# Base Permission Class
# ============================================================================

class IsRolePermission(BasePermission):
    """Check specific permission by codename."""
    # ... implementation ...

# ============================================================================
# Role-Based Permission Classes
# ============================================================================

class IsSuperAdmin(BasePermission):
    """Allow access only to super admins."""
    # ... implementation ...

class IsTenantAdmin(BasePermission):
    """Allow access only to tenant admins."""
    # ... implementation ...

class IsManager(BasePermission):
    """Allow access only to managers."""
    # ... implementation ...

class IsStaff(BasePermission):
    """Allow access only to staff members."""
    # ... implementation ...
```

### Permission Hierarchy
```
IsSuperAdmin (Highest Access)
    │
    ├── Access: All tenants, system settings
    │
    ▼
IsTenantAdmin
    │
    ├── Access: Own tenant, tenant users, tenant settings
    │
    ▼
IsManager
    │
    ├── Access: Operations, reports, approvals
    │
    ▼
IsStaff (Basic Access)
    │
    └── Access: Basic operations, data entry
```

### Combining Permissions
```python
from rest_framework.permissions import OR, AND

# Allow either tenant admin or super admin
permission_classes = [IsTenantAdmin | IsSuperAdmin]

# Require both staff role AND specific permission
permission_classes = [IsStaff & IsRolePermission('inventory.add_product')]
```

### Testing Permission Classes
```python
from rest_framework.test import APITestCase
from apps.core.permissions import IsSuperAdmin

class SuperAdminPermissionTest(APITestCase):
    def test_super_admin_has_access(self):
        """Test super admin can access protected view."""
        user = self.create_super_admin()
        self.client.force_authenticate(user=user)
        response = self.client.get('/api/system-settings/')
        self.assertEqual(response.status_code, 200)
    
    def test_regular_user_denied(self):
        """Test regular user is denied access."""
        user = self.create_regular_user()
        self.client.force_authenticate(user=user)
        response = self.client.get('/api/system-settings/')
        self.assertEqual(response.status_code, 403)
```

---

## Notes for AI Agents

1. **BasePermission:** All classes extend DRF's BasePermission
2. **Authentication Check:** Always check `is_authenticated` first
3. **Role Check:** Use `user.has_role()` method from User model
4. **Tenant Scope:** Object-level checks should validate tenant
5. **Error Messages:** Provide clear, specific error messages
6. **OR Logic:** Use `|` operator to combine permissions (OR)
7. **AND Logic:** Use `&` operator to combine permissions (AND)
8. **has_permission:** Called first for view-level checks
9. **has_object_permission:** Called second for object-level checks
10. **Return Boolean:** Always return True or False

---

## Summary

This document covered the creation of DRF permission classes:
- **IsRolePermission:** Base class for checking specific permissions
- **IsSuperAdmin:** Super admin access (highest level)
- **IsTenantAdmin:** Tenant admin access (tenant-scoped)
- **IsManager:** Manager access (operational level)
- **IsStaff:** Staff access (basic operations)

These permission classes provide a declarative way to protect DRF API views and can be combined using OR (`|`) and AND (`&`) operators for complex permission requirements.
