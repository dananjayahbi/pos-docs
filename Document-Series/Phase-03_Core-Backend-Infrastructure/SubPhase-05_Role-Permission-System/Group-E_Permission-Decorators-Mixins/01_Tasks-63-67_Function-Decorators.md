# Tasks 63-67: Function Decorators for Permission Checks

> **Phase:** 03 - Core Backend Infrastructure  
> **SubPhase:** 05 - Role & Permission System  
> **Group:** E - Permission Decorators & Mixins  
> **Document:** 01 of 04  
> **Tasks Covered:** 63, 64, 65, 66, 67

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Group:** [../Group-D_User-Role-Management/](../Group-D_User-Role-Management/)
- **→ Next Document:** [02_Tasks-68-72_DRF-Permission-Classes.md](02_Tasks-68-72_DRF-Permission-Classes.md)

---

## Document Overview

This document covers the creation of function decorators for permission and role checking. These decorators provide a simple way to protect function-based views by checking user permissions before allowing access to the view.

### Tasks in This Document
| Task # | Task Name | Complexity |
|--------|-----------|------------|
| 63 | Create Permissions Module | Simple |
| 64 | Create permission_required Decorator | Medium |
| 65 | Create role_required Decorator | Medium |
| 66 | Create any_permission_required Decorator | Medium |
| 67 | Create all_permissions_required Decorator | Medium |

---

## Task 63: Create Permissions Module

### Overview
Create the permissions module at `apps/core/permissions.py` that will contain all permission-related decorators and utilities.

### Dependencies
- Task 59: Create User Model with Permission Methods

### Instructions

1. **Create the permissions.py file**
   - Create file named `permissions.py` in `backend/apps/core/`
   - This will be the central module for permission enforcement

2. **Add module imports**
   - Import `functools.wraps` for decorator preservation
   - Import `PermissionDenied` from `django.core.exceptions`
   - Import necessary types for type hints

3. **Add module docstring**
   - Describe purpose: permission decorators for function-based views
   - Mention decorator types available
   - Include usage examples

4. **Set up for decorator definitions**
   - Initialize module structure for upcoming decorators
   - Plan for function-based decorators (tasks 64-67)
   - Plan for DRF classes (tasks 68-72)

### Module Structure
```python
"""
Permission decorators and utilities for access control.

This module provides decorators for function-based views and
DRF permission classes for class-based views.

Available Decorators:
- permission_required: Check single permission
- role_required: Check user role
- any_permission_required: OR logic for permissions
- all_permissions_required: AND logic for permissions

Usage:
    @permission_required('products.view_product')
    def product_list(request):
        ...
    
    @role_required('manager')
    def manager_dashboard(request):
        ...
"""
```

### Expected File Location
```
backend/apps/core/
├── models.py
├── permissions.py           # NEW: Permission decorators module
├── admin.py
└── ...
```

### Verification Checklist
- [ ] `permissions.py` file created in `backend/apps/core/`
- [ ] Module docstring is present
- [ ] Necessary imports are added
- [ ] File is ready for decorator definitions

---

## Task 64: Create permission_required Decorator

### Overview
Create a decorator that checks if a user has a single specific permission before allowing access to a view function.

### Dependencies
- Task 63: Create Permissions Module
- Task 59: User Model with has_perm() method

### Instructions

1. **Define the permission_required decorator**
   - Create function that accepts permission string as parameter
   - Return inner decorator function
   - Use functools.wraps to preserve function metadata

2. **Implement permission check logic**
   - Check if user is authenticated
   - Call `request.user.has_perm(perm)` to verify permission
   - Raise `PermissionDenied` if check fails
   - Return view function result if check passes

3. **Add decorator docstring**
   - Explain purpose and usage
   - Document parameters
   - Include code examples
   - Note exception behavior

4. **Handle edge cases**
   - Anonymous users (not authenticated)
   - Invalid permission strings
   - Ensure clear error messages

### Implementation Pattern
```python
def permission_required(perm):
    """
    Decorator to check if user has a specific permission.
    
    Args:
        perm (str): Permission string in format 'app_label.permission_codename'
                   Example: 'products.view_product'
    
    Raises:
        PermissionDenied: If user lacks the required permission
    
    Usage:
        @permission_required('products.add_product')
        def create_product(request):
            # Only users with products.add_product can access
            ...
    """
    def decorator(view_func):
        @wraps(view_func)
        def wrapper(request, *args, **kwargs):
            # Check authentication
            if not request.user.is_authenticated:
                raise PermissionDenied("Authentication required")
            
            # Check permission
            if not request.user.has_perm(perm):
                raise PermissionDenied(
                    f"User lacks required permission: {perm}"
                )
            
            # Permission granted, execute view
            return view_func(request, *args, **kwargs)
        return wrapper
    return decorator
```

### Permission String Format
| Format | Example | Description |
|--------|---------|-------------|
| `app.action_model` | `products.view_product` | Standard Django format |
| `app.action_model` | `inventory.add_stockitem` | Inventory permission |
| `app.action_model` | `orders.delete_order` | Order deletion |

### Usage Examples
```python
# Single permission check
@permission_required('products.view_product')
def product_list(request):
    products = Product.objects.all()
    return JsonResponse({'products': list(products.values())})

# Write permission
@permission_required('products.add_product')
def create_product(request):
    # Only users with add permission can create
    product = Product.objects.create(**request.POST)
    return JsonResponse({'id': product.id})

# Delete permission
@permission_required('products.delete_product')
def delete_product(request, product_id):
    product = get_object_or_404(Product, id=product_id)
    product.delete()
    return JsonResponse({'success': True})
```

### Expected Behavior
| Scenario | Action |
|----------|--------|
| **User authenticated + has permission** | Allow access to view |
| **User authenticated + lacks permission** | Raise PermissionDenied |
| **User not authenticated** | Raise PermissionDenied |
| **Invalid permission string** | Raise PermissionDenied |

### Verification Checklist
- [ ] `permission_required` decorator defined
- [ ] Accepts permission string parameter
- [ ] Checks user authentication
- [ ] Calls `user.has_perm()` method
- [ ] Raises `PermissionDenied` on failure
- [ ] Uses `@wraps` to preserve metadata
- [ ] Includes comprehensive docstring
- [ ] Handles anonymous users

---

## Task 65: Create role_required Decorator

### Overview
Create a decorator that checks if a user has a specific role before allowing access to a view function.

### Dependencies
- Task 63: Create Permissions Module
- Task 60: Create has_role() method on User model

### Instructions

1. **Define the role_required decorator**
   - Create function that accepts role slug as parameter
   - Return inner decorator function
   - Use functools.wraps to preserve function metadata

2. **Implement role check logic**
   - Check if user is authenticated
   - Call `request.user.has_role(role_slug)` to verify role
   - Raise `PermissionDenied` if check fails
   - Return view function result if check passes

3. **Add decorator docstring**
   - Explain purpose and usage
   - Document parameters
   - Include code examples
   - Note exception behavior

4. **Handle edge cases**
   - Anonymous users (not authenticated)
   - Invalid role slugs
   - Case sensitivity in role slugs
   - Clear error messages

### Implementation Pattern
```python
def role_required(role_slug):
    """
    Decorator to check if user has a specific role.
    
    Args:
        role_slug (str): Role slug to check
                        Example: 'super-admin', 'tenant-admin', 'manager'
    
    Raises:
        PermissionDenied: If user does not have the required role
    
    Usage:
        @role_required('manager')
        def manager_dashboard(request):
            # Only users with 'manager' role can access
            ...
        
        @role_required('tenant-admin')
        def tenant_settings(request):
            # Only tenant admins can access
            ...
    """
    def decorator(view_func):
        @wraps(view_func)
        def wrapper(request, *args, **kwargs):
            # Check authentication
            if not request.user.is_authenticated:
                raise PermissionDenied("Authentication required")
            
            # Check role
            if not request.user.has_role(role_slug):
                raise PermissionDenied(
                    f"User lacks required role: {role_slug}"
                )
            
            # Role granted, execute view
            return view_func(request, *args, **kwargs)
        return wrapper
    return decorator
```

### Role Slug Reference
| Role Slug | Description | Typical Use |
|-----------|-------------|-------------|
| `super-admin` | Platform super admin | System configuration |
| `tenant-admin` | Tenant administrator | Tenant management |
| `manager` | Store/department manager | Operational management |
| `staff` | Regular staff member | Daily operations |
| `cashier` | POS cashier | Sales transactions |

### Usage Examples
```python
# Super admin only
@role_required('super-admin')
def platform_settings(request):
    # Only super admins can modify platform settings
    return render(request, 'admin/platform_settings.html')

# Tenant admin only
@role_required('tenant-admin')
def tenant_configuration(request):
    # Only tenant admins can configure their tenant
    tenant = request.user.tenant
    return render(request, 'tenant/config.html', {'tenant': tenant})

# Manager or higher
@role_required('manager')
def view_reports(request):
    # Managers can view operational reports
    reports = Report.objects.filter(tenant=request.user.tenant)
    return render(request, 'reports/list.html', {'reports': reports})

# Cashier role
@role_required('cashier')
def pos_interface(request):
    # Cashiers can access POS system
    return render(request, 'pos/interface.html')
```

### Comparison with permission_required
| Aspect | permission_required | role_required |
|--------|-------------------|---------------|
| **Granularity** | Specific permission | Broader role |
| **Check Method** | `user.has_perm()` | `user.has_role()` |
| **Use Case** | Specific action control | General access level |
| **Example** | `products.add_product` | `manager` |

### Expected Behavior
| Scenario | Action |
|----------|--------|
| **User authenticated + has role** | Allow access to view |
| **User authenticated + lacks role** | Raise PermissionDenied |
| **User not authenticated** | Raise PermissionDenied |
| **Invalid role slug** | Raise PermissionDenied |

### Verification Checklist
- [ ] `role_required` decorator defined
- [ ] Accepts role slug parameter
- [ ] Checks user authentication
- [ ] Calls `user.has_role()` method
- [ ] Raises `PermissionDenied` on failure
- [ ] Uses `@wraps` to preserve metadata
- [ ] Includes comprehensive docstring
- [ ] Handles anonymous users

---

## Task 66: Create any_permission_required Decorator

### Overview
Create a decorator that checks if a user has at least ONE of multiple specified permissions (OR logic). User needs any single permission from the list to gain access.

### Dependencies
- Task 63: Create Permissions Module
- Task 59: User Model with has_perm() method

### Instructions

1. **Define the any_permission_required decorator**
   - Create function that accepts multiple permission strings as *args
   - Return inner decorator function
   - Use functools.wraps to preserve function metadata

2. **Implement OR logic for permissions**
   - Check if user is authenticated
   - Iterate through permissions
   - Use `any()` to check if user has at least one permission
   - Raise `PermissionDenied` if no permissions match
   - Return view function result if any permission matches

3. **Add decorator docstring**
   - Explain OR logic behavior
   - Document parameters
   - Include multiple usage examples
   - Note that only ONE permission is needed

4. **Handle edge cases**
   - Empty permission list
   - Anonymous users
   - All permissions invalid
   - Clear error messages listing checked permissions

### Implementation Pattern
```python
def any_permission_required(*perms):
    """
    Decorator to check if user has ANY of the specified permissions (OR logic).
    
    User needs at least ONE of the listed permissions to access the view.
    
    Args:
        *perms: Variable number of permission strings
                Example: 'products.view_product', 'products.add_product'
    
    Raises:
        PermissionDenied: If user lacks ALL of the specified permissions
    
    Usage:
        @any_permission_required('products.add_product', 'products.change_product')
        def modify_product(request):
            # User can access if they can ADD OR CHANGE products
            ...
        
        @any_permission_required('orders.view_order', 'orders.manage_order')
        def view_order_details(request, order_id):
            # User can view if they have view OR manage permission
            ...
    """
    def decorator(view_func):
        @wraps(view_func)
        def wrapper(request, *args, **kwargs):
            # Check authentication
            if not request.user.is_authenticated:
                raise PermissionDenied("Authentication required")
            
            # Check if empty permission list
            if not perms:
                raise PermissionDenied("No permissions specified")
            
            # Check if user has ANY permission (OR logic)
            if not any(request.user.has_perm(perm) for perm in perms):
                raise PermissionDenied(
                    f"User lacks any of required permissions: {', '.join(perms)}"
                )
            
            # At least one permission granted, execute view
            return view_func(request, *args, **kwargs)
        return wrapper
    return decorator
```

### OR Logic Behavior
| Permissions Checked | User Has | Result |
|-------------------|----------|--------|
| A, B, C | A only | ✅ **Allow** (has one) |
| A, B, C | B only | ✅ **Allow** (has one) |
| A, B, C | A and B | ✅ **Allow** (has multiple) |
| A, B, C | None | ❌ **Deny** (has none) |

### Usage Examples
```python
# Product modification (add OR change)
@any_permission_required('products.add_product', 'products.change_product')
def modify_product(request, product_id=None):
    # User can access if they can add OR change products
    if product_id:
        # Editing existing product
        product = get_object_or_404(Product, id=product_id)
        # ... update logic
    else:
        # Creating new product
        # ... create logic
    return JsonResponse({'success': True})

# Order viewing (view OR manage)
@any_permission_required('orders.view_order', 'orders.manage_order')
def order_details(request, order_id):
    # Managers and viewers can both access
    order = get_object_or_404(Order, id=order_id)
    return render(request, 'orders/detail.html', {'order': order})

# Financial reports (multiple access levels)
@any_permission_required(
    'finance.view_reports',
    'finance.manage_reports',
    'finance.full_access'
)
def financial_report(request):
    # Any financial permission grants access
    return render(request, 'finance/reports.html')

# Customer support (view OR manage customers)
@any_permission_required('customers.view_customer', 'customers.manage_customer')
def customer_profile(request, customer_id):
    # Support staff with any customer permission can view
    customer = get_object_or_404(Customer, id=customer_id)
    return render(request, 'customers/profile.html', {'customer': customer})
```

### Common Use Cases
| Use Case | Permissions | Logic |
|----------|-------------|-------|
| **Content modification** | `add_item`, `change_item` | Create OR edit |
| **Report access** | `view_reports`, `manage_reports` | View OR manage |
| **Multi-level access** | `basic_access`, `advanced_access`, `full_access` | Any access level |
| **Support roles** | `view_customer`, `manage_customer` | Read OR write |

### Expected Behavior
| Scenario | Action |
|----------|--------|
| **User has at least one permission** | Allow access to view |
| **User has multiple permissions** | Allow access to view |
| **User has none of the permissions** | Raise PermissionDenied |
| **User not authenticated** | Raise PermissionDenied |
| **Empty permission list** | Raise PermissionDenied |

### Verification Checklist
- [ ] `any_permission_required` decorator defined
- [ ] Accepts multiple permission strings via *args
- [ ] Checks user authentication
- [ ] Uses `any()` for OR logic
- [ ] Raises `PermissionDenied` if no permissions match
- [ ] Uses `@wraps` to preserve metadata
- [ ] Includes comprehensive docstring
- [ ] Handles empty permission list
- [ ] Error message lists all checked permissions

---

## Task 67: Create all_permissions_required Decorator

### Overview
Create a decorator that checks if a user has ALL of multiple specified permissions (AND logic). User must have every permission in the list to gain access.

### Dependencies
- Task 63: Create Permissions Module
- Task 59: User Model with has_perm() method

### Instructions

1. **Define the all_permissions_required decorator**
   - Create function that accepts multiple permission strings as *args
   - Return inner decorator function
   - Use functools.wraps to preserve function metadata

2. **Implement AND logic for permissions**
   - Check if user is authenticated
   - Iterate through permissions
   - Use `all()` to check if user has every permission
   - Raise `PermissionDenied` if any permission is missing
   - Return view function result if all permissions match

3. **Add decorator docstring**
   - Explain AND logic behavior
   - Document parameters
   - Include multiple usage examples
   - Note that ALL permissions are required

4. **Handle edge cases**
   - Empty permission list
   - Anonymous users
   - Partial permission matches
   - Clear error messages listing missing permissions

### Implementation Pattern
```python
def all_permissions_required(*perms):
    """
    Decorator to check if user has ALL of the specified permissions (AND logic).
    
    User must have EVERY listed permission to access the view.
    
    Args:
        *perms: Variable number of permission strings
                Example: 'products.view_product', 'products.delete_product'
    
    Raises:
        PermissionDenied: If user lacks ANY of the specified permissions
    
    Usage:
        @all_permissions_required('products.change_product', 'products.delete_product')
        def dangerous_product_operation(request):
            # User must have BOTH change AND delete permissions
            ...
        
        @all_permissions_required('orders.view_order', 'finance.view_reports')
        def order_financial_report(request):
            # User must have permissions for BOTH orders AND finance
            ...
    """
    def decorator(view_func):
        @wraps(view_func)
        def wrapper(request, *args, **kwargs):
            # Check authentication
            if not request.user.is_authenticated:
                raise PermissionDenied("Authentication required")
            
            # Check if empty permission list
            if not perms:
                raise PermissionDenied("No permissions specified")
            
            # Check if user has ALL permissions (AND logic)
            missing_perms = [
                perm for perm in perms 
                if not request.user.has_perm(perm)
            ]
            
            if missing_perms:
                raise PermissionDenied(
                    f"User lacks required permissions: {', '.join(missing_perms)}"
                )
            
            # All permissions granted, execute view
            return view_func(request, *args, **kwargs)
        return wrapper
    return decorator
```

### AND Logic Behavior
| Permissions Required | User Has | Result |
|---------------------|----------|--------|
| A, B, C | A, B, C | ✅ **Allow** (has all) |
| A, B, C | A, B only | ❌ **Deny** (missing C) |
| A, B, C | A only | ❌ **Deny** (missing B, C) |
| A, B, C | None | ❌ **Deny** (missing all) |

### Usage Examples
```python
# Dangerous product operations (change AND delete)
@all_permissions_required('products.change_product', 'products.delete_product')
def bulk_delete_products(request):
    # User must have BOTH change AND delete permissions
    # This ensures only fully authorized users can perform bulk deletions
    product_ids = request.POST.getlist('product_ids')
    Product.objects.filter(id__in=product_ids).delete()
    return JsonResponse({'success': True})

# Cross-module reporting (orders AND finance)
@all_permissions_required('orders.view_order', 'finance.view_reports')
def order_financial_report(request):
    # User must have permissions for BOTH modules
    # Ensures comprehensive access for cross-module reporting
    orders = Order.objects.all()
    financial_data = FinancialReport.objects.all()
    return render(request, 'reports/order_finance.html', {
        'orders': orders,
        'financial_data': financial_data
    })

# Complex approval workflow (view AND approve AND execute)
@all_permissions_required(
    'orders.view_order',
    'orders.approve_order',
    'finance.process_payment'
)
def approve_and_process_order(request, order_id):
    # User must have view, approval, AND payment processing permissions
    # Required for complete order fulfillment workflow
    order = get_object_or_404(Order, id=order_id)
    order.approve()
    order.process_payment()
    return JsonResponse({'success': True})

# Administrative operations (multiple system permissions)
@all_permissions_required(
    'users.change_user',
    'users.view_user',
    'tenants.manage_tenant'
)
def manage_tenant_users(request, tenant_id):
    # User must have user management AND tenant management permissions
    # Ensures proper authorization for cross-entity administration
    tenant = get_object_or_404(Tenant, id=tenant_id)
    users = User.objects.filter(tenant=tenant)
    return render(request, 'admin/tenant_users.html', {
        'tenant': tenant,
        'users': users
    })
```

### Common Use Cases
| Use Case | Permissions | Logic |
|----------|-------------|-------|
| **Dangerous operations** | `change_item`, `delete_item` | Modify AND delete |
| **Cross-module access** | `view_orders`, `view_finance` | Multiple modules |
| **Complex workflows** | `view`, `approve`, `execute` | Multi-step process |
| **Admin operations** | `manage_users`, `manage_tenant` | Multiple admin rights |

### Comparison: any_permission_required vs all_permissions_required
| Aspect | any_permission_required | all_permissions_required |
|--------|------------------------|-------------------------|
| **Logic** | OR (at least one) | AND (every single one) |
| **Use Case** | Flexible access levels | Strict security requirements |
| **Typical Scenario** | View OR edit content | Delete AND modify together |
| **Permission Count** | Needs 1+ of N | Needs N of N |
| **Security Level** | More permissive | More restrictive |

### Expected Behavior
| Scenario | Action |
|----------|--------|
| **User has all permissions** | Allow access to view |
| **User missing one permission** | Raise PermissionDenied |
| **User missing multiple permissions** | Raise PermissionDenied |
| **User has none of the permissions** | Raise PermissionDenied |
| **User not authenticated** | Raise PermissionDenied |
| **Empty permission list** | Raise PermissionDenied |

### Verification Checklist
- [ ] `all_permissions_required` decorator defined
- [ ] Accepts multiple permission strings via *args
- [ ] Checks user authentication
- [ ] Uses `all()` or list comprehension for AND logic
- [ ] Raises `PermissionDenied` if any permissions missing
- [ ] Uses `@wraps` to preserve metadata
- [ ] Includes comprehensive docstring
- [ ] Handles empty permission list
- [ ] Error message lists missing permissions specifically

---

## Summary

### Tasks Completed in This Document
| Task # | Task Name | Key Deliverable |
|--------|-----------|-----------------|
| 63 | Create Permissions Module | `apps/core/permissions.py` module |
| 64 | Create permission_required Decorator | Single permission check |
| 65 | Create role_required Decorator | Role-based access check |
| 66 | Create any_permission_required Decorator | OR logic (any permission) |
| 67 | Create all_permissions_required Decorator | AND logic (all permissions) |

### Final permissions.py Structure
```python
# backend/apps/core/permissions.py

"""Permission decorators and utilities for access control."""

from functools import wraps
from django.core.exceptions import PermissionDenied

# Function Decorators (Tasks 64-67)
def permission_required(perm):
    """Check single permission."""
    # Implementation...

def role_required(role_slug):
    """Check user role."""
    # Implementation...

def any_permission_required(*perms):
    """Check if user has ANY permission (OR logic)."""
    # Implementation...

def all_permissions_required(*perms):
    """Check if user has ALL permissions (AND logic)."""
    # Implementation...
```

### Decorator Comparison Matrix
| Decorator | Parameters | Logic | Use Case |
|-----------|-----------|-------|----------|
| **permission_required** | Single permission | Single check | Specific action protection |
| **role_required** | Single role | Single check | Role-level protection |
| **any_permission_required** | Multiple permissions | OR (any) | Flexible access levels |
| **all_permissions_required** | Multiple permissions | AND (all) | Strict security requirements |

### Usage Pattern Examples
```python
# Single permission
@permission_required('products.add_product')
def create_product(request):
    pass

# Single role
@role_required('manager')
def manager_dashboard(request):
    pass

# Any permission (OR)
@any_permission_required('products.add_product', 'products.change_product')
def modify_product(request):
    pass

# All permissions (AND)
@all_permissions_required('products.change_product', 'products.delete_product')
def dangerous_operation(request):
    pass
```

### Group E Progress
Tasks 63-67 complete. Next steps:
1. **Tasks 68-72:** Create DRF permission classes
2. **Tasks 73-75:** Create view mixins
3. **Tasks 76-78:** JWT claims and permission denied response

### Next Steps
Proceed to [02_Tasks-68-72_DRF-Permission-Classes.md](02_Tasks-68-72_DRF-Permission-Classes.md) to create Django REST Framework permission classes for API endpoint protection.

---

## Notes for AI Agents

1. **Decorator Order:** Apply permission decorators AFTER `@login_required` if both are used
2. **Error Handling:** All decorators raise `PermissionDenied` exception from Django core
3. **OR vs AND Logic:** Use `any()` for OR, `all()` or list comprehension for AND
4. **Metadata Preservation:** Always use `@wraps(view_func)` to preserve function metadata
5. **Authentication Check:** All decorators must check authentication before permission checks
6. **Empty Lists:** Handle empty permission lists gracefully with clear error messages
7. **Error Messages:** Include specific permission/role names in error messages for debugging
8. **Combination Usage:** Decorators can be stacked (e.g., role + specific permission)
9. **Testing:** Each decorator should be tested with authenticated, unauthenticated, and partial permission scenarios
10. **DRF Compatibility:** These decorators are for function-based views; DRF views use permission classes (next document)
