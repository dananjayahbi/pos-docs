# Tasks 37-40: RolePermissionManager

> **Phase:** 03 - Core Backend Infrastructure  
> **SubPhase:** 05 - Role & Permission System  
> **Group:** C - Role-Permission Assignment  
> **Document:** 02 of 03  
> **Tasks Covered:** 37, 38, 39, 40

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [01_Tasks-31-36_RolePermission-Model.md](01_Tasks-31-36_RolePermission-Model.md)
- **→ Next Document:** [03_Tasks-41-46_Default-Assignments.md](03_Tasks-41-46_Default-Assignments.md)

---

## Document Overview

This document covers the creation of the RolePermissionManager class that provides methods for managing role-permission assignments. The manager includes methods for assigning permissions to roles, revoking permissions, and checking if a role has specific permissions with support for permission inheritance from parent roles.

### Tasks in This Document
| Task # | Task Name | Complexity |
|--------|-----------|------------|
| 37 | Create RolePermissionManager Class | Medium |
| 38 | Add assign_permission Method | Medium |
| 39 | Add revoke_permission Method | Simple |
| 40 | Add has_permission Method | Medium |

---

## Task 37: Create RolePermissionManager Class

### Overview
Create a custom manager class for the RolePermission model that will provide helper methods for managing role-permission assignments, including inheritance from parent roles.

### Dependencies
- Task 31: Create RolePermission Model
- Task 36: Create Unique Constraint

### Instructions

1. **Create the manager module**
   - Create directory: `backend/apps/users/managers/`
   - Create file: `backend/apps/users/managers/__init__.py`
   - Create file: `backend/apps/users/managers/role_permission_manager.py`

2. **Import required dependencies**
   ```python
   from django.db import models
   from django.core.exceptions import ValidationError
   from typing import Optional, Set
   ```

3. **Create the RolePermissionManager class**
   - Inherit from `models.Manager`
   - Add docstring explaining the manager's purpose

4. **Add class-level documentation**
   - Explain the manager's role in permission management
   - Document that it handles permission inheritance
   - Note the audit trail capabilities

5. **Define the manager structure**
   ```python
   class RolePermissionManager(models.Manager):
       """
       Custom manager for RolePermission model.
       
       Provides methods for:
       - Assigning permissions to roles
       - Revoking permissions from roles
       - Checking permission existence
       - Handling permission inheritance from parent roles
       """
       pass
   ```

6. **Export the manager in __init__.py**
   ```python
   from .role_permission_manager import RolePermissionManager
   
   __all__ = ['RolePermissionManager']
   ```

7. **Update the RolePermission model**
   - Add the custom manager to the model
   - Set it as the default manager

8. **Add type hints**
   - Ensure all method signatures will use proper type hints
   - Import necessary types from typing module

### Manager Structure

```python
class RolePermissionManager(models.Manager):
    """
    Manager for RolePermission model with assignment and checking methods.
    
    Features:
    - Permission assignment with audit trail
    - Permission revocation
    - Permission checking with inheritance
    - Bulk assignment support
    """
    
    def assign_permission(self, role, permission, granted_by=None):
        """Assign a permission to a role."""
        pass
    
    def revoke_permission(self, role, permission):
        """Remove a permission from a role."""
        pass
    
    def has_permission(self, role, permission_codename):
        """Check if role has permission (including inherited)."""
        pass
```

### Expected Outcome
```
backend/apps/users/
├── managers/
│   ├── __init__.py
│   └── role_permission_manager.py
└── models/
    └── role_permission.py (updated to use manager)
```

### Verification Checklist
- [ ] `managers/` directory exists
- [ ] `role_permission_manager.py` file created
- [ ] RolePermissionManager class defined
- [ ] Manager inherits from `models.Manager`
- [ ] Class docstring is comprehensive
- [ ] Manager exported in `__init__.py`
- [ ] RolePermission model uses the custom manager

---

## Task 38: Add assign_permission Method

### Overview
Implement the `assign_permission` method that creates a RolePermission record linking a role to a permission, with audit trail tracking who granted the permission.

### Dependencies
- Task 37: Create RolePermissionManager Class

### Instructions

1. **Define the method signature**
   ```python
   def assign_permission(
       self,
       role: 'Role',
       permission: 'Permission',
       granted_by: Optional['User'] = None
   ) -> 'RolePermission':
   ```

2. **Add method docstring**
   - Explain the method's purpose
   - Document parameters
   - Document return value
   - Include usage examples

3. **Add parameter validation**
   - Validate that role is not None
   - Validate that permission is not None
   - Check that both objects are saved (have PKs)

4. **Check for existing assignment**
   - Use `filter()` to check if the role-permission pair exists
   - Return existing record if found (idempotent behavior)

5. **Create the RolePermission record**
   - Use `get_or_create()` to avoid duplicates
   - Set the `granted_by` field if provided
   - Set `granted_at` automatically (model default)

6. **Add logging**
   - Log successful permission assignments
   - Include role name, permission codename, and granted_by user

7. **Handle exceptions**
   - Catch IntegrityError for race conditions
   - Wrap in try-except block
   - Return existing record on duplicate creation

8. **Return the created record**
   - Return the RolePermission instance
   - Include boolean flag indicating if it was created

### Method Implementation

```python
def assign_permission(
    self,
    role: 'Role',
    permission: 'Permission',
    granted_by: Optional['User'] = None
) -> 'RolePermission':
    """
    Assign a permission to a role.
    
    Args:
        role: The Role to assign the permission to
        permission: The Permission to assign
        granted_by: User who is granting the permission (for audit trail)
    
    Returns:
        RolePermission instance
    
    Raises:
        ValidationError: If role or permission is invalid
    
    Example:
        >>> role = Role.objects.get(name='Manager')
        >>> permission = Permission.objects.get(codename='inventory.view')
        >>> admin_user = User.objects.get(username='admin')
        >>> rp = RolePermission.objects.assign_permission(
        ...     role=role,
        ...     permission=permission,
        ...     granted_by=admin_user
        ... )
    """
    # Validate inputs
    if not role or not role.pk:
        raise ValidationError("Role must be a saved instance")
    if not permission or not permission.pk:
        raise ValidationError("Permission must be a saved instance")
    
    # Get or create the assignment
    role_permission, created = self.get_or_create(
        role=role,
        permission=permission,
        defaults={'granted_by': granted_by}
    )
    
    # Log the assignment
    if created:
        logger.info(
            f"Permission '{permission.codename}' assigned to role '{role.name}' "
            f"by {granted_by.username if granted_by else 'system'}"
        )
    
    return role_permission
```

### Audit Trail Fields
| Field | Purpose | Example |
|-------|---------|---------|
| `granted_by` | Who assigned the permission | admin_user |
| `granted_at` | When it was assigned | 2026-01-23 10:30:00 |

### Idempotent Behavior
- Calling `assign_permission` multiple times is safe
- Returns existing record if already assigned
- Only creates once due to unique constraint
- No duplicate assignments possible

### Expected Outcome
- Method creates RolePermission records
- Audit trail is captured (granted_by, granted_at)
- Method is idempotent (safe to call multiple times)
- Proper validation and error handling
- Comprehensive logging

### Verification Checklist
- [ ] Method signature includes type hints
- [ ] Comprehensive docstring with examples
- [ ] Input validation for role and permission
- [ ] Uses `get_or_create()` for idempotency
- [ ] Sets `granted_by` field correctly
- [ ] Includes logging for assignments
- [ ] Handles exceptions gracefully
- [ ] Returns RolePermission instance

---

## Task 39: Add revoke_permission Method

### Overview
Implement the `revoke_permission` method that removes a permission from a role by deleting the corresponding RolePermission record.

### Dependencies
- Task 37: Create RolePermissionManager Class
- Task 38: Add assign_permission Method

### Instructions

1. **Define the method signature**
   ```python
   def revoke_permission(
       self,
       role: 'Role',
       permission: 'Permission'
   ) -> bool:
   ```

2. **Add method docstring**
   - Explain the method's purpose
   - Document parameters
   - Document return value (True if revoked, False if not found)
   - Include usage examples

3. **Add parameter validation**
   - Validate that role is not None
   - Validate that permission is not None

4. **Query for existing assignment**
   - Use `filter()` to find the role-permission pair
   - Check if it exists

5. **Delete the RolePermission record**
   - Call `delete()` on the queryset
   - Capture the number of deleted records

6. **Add logging**
   - Log successful revocations
   - Include role name and permission codename

7. **Return deletion status**
   - Return `True` if record was deleted
   - Return `False` if no record was found

8. **Handle exceptions**
   - Catch and log any unexpected errors
   - Don't fail if permission wasn't assigned

### Method Implementation

```python
def revoke_permission(
    self,
    role: 'Role',
    permission: 'Permission'
) -> bool:
    """
    Revoke a permission from a role.
    
    Args:
        role: The Role to revoke the permission from
        permission: The Permission to revoke
    
    Returns:
        bool: True if permission was revoked, False if it wasn't assigned
    
    Example:
        >>> role = Role.objects.get(name='Manager')
        >>> permission = Permission.objects.get(codename='inventory.delete')
        >>> revoked = RolePermission.objects.revoke_permission(role, permission)
        >>> if revoked:
        ...     print("Permission revoked successfully")
    """
    # Validate inputs
    if not role or not role.pk:
        raise ValidationError("Role must be a saved instance")
    if not permission or not permission.pk:
        raise ValidationError("Permission must be a saved instance")
    
    # Delete the assignment
    deleted_count, _ = self.filter(
        role=role,
        permission=permission
    ).delete()
    
    # Log the revocation
    if deleted_count > 0:
        logger.info(
            f"Permission '{permission.codename}' revoked from role '{role.name}'"
        )
    
    return deleted_count > 0
```

### Revocation Behavior
- Deletes the RolePermission record
- Returns `False` if permission wasn't assigned (not an error)
- Safe to call even if permission isn't assigned
- Logging shows what was revoked

### Use Cases
| Scenario | Behavior |
|----------|----------|
| Permission is assigned | Delete record, return True |
| Permission not assigned | No action, return False |
| Role doesn't exist | Raise ValidationError |
| Permission doesn't exist | Raise ValidationError |

### Expected Outcome
- Method removes RolePermission records
- Returns boolean indicating success
- Safe to call even if not assigned
- Proper logging of revocations

### Verification Checklist
- [ ] Method signature includes type hints
- [ ] Returns boolean for success/failure
- [ ] Comprehensive docstring with examples
- [ ] Input validation for role and permission
- [ ] Uses `filter().delete()` pattern
- [ ] Includes logging for revocations
- [ ] Returns False if not assigned (not an error)
- [ ] Handles exceptions gracefully

---

## Task 40: Add has_permission Method

### Overview
Implement the `has_permission` method that checks if a role has a specific permission, including checking inherited permissions from parent roles in the role hierarchy.

### Dependencies
- Task 37: Create RolePermissionManager Class
- Task 38: Add assign_permission Method
- Role model with parent relationship

### Instructions

1. **Define the method signature**
   ```python
   def has_permission(
       self,
       role: 'Role',
       permission_codename: str,
       check_inheritance: bool = True
   ) -> bool:
   ```

2. **Add method docstring**
   - Explain the method's purpose
   - Document parameters
   - Document return value
   - Explain inheritance checking
   - Include usage examples

3. **Add parameter validation**
   - Validate that role is not None
   - Validate that permission_codename is not empty

4. **Check direct permission assignment**
   - Query for RolePermission with matching role and permission codename
   - Use `filter()` with joins to Permission model
   - Check if any records exist

5. **Implement inheritance checking**
   - If `check_inheritance=True` and direct check fails
   - Recursively check parent roles
   - Walk up the role hierarchy
   - Stop at root (role with no parent)

6. **Add caching consideration**
   - Add comment about future caching opportunity
   - Suggest using `select_related()` for performance

7. **Return boolean result**
   - Return `True` if permission found (directly or inherited)
   - Return `False` if permission not found

8. **Add helper method for recursion**
   - Create `_get_all_parent_roles()` helper method
   - Collect all ancestor roles efficiently
   - Avoid infinite loops

### Method Implementation

```python
def has_permission(
    self,
    role: 'Role',
    permission_codename: str,
    check_inheritance: bool = True
) -> bool:
    """
    Check if a role has a specific permission.
    
    Args:
        role: The Role to check
        permission_codename: The permission codename (e.g., 'inventory.view')
        check_inheritance: Whether to check parent roles (default: True)
    
    Returns:
        bool: True if role has the permission, False otherwise
    
    Example:
        >>> role = Role.objects.get(name='Staff')
        >>> has_perm = RolePermission.objects.has_permission(
        ...     role=role,
        ...     permission_codename='inventory.view'
        ... )
        >>> if has_perm:
        ...     print("User can view inventory")
    """
    # Validate inputs
    if not role or not role.pk:
        raise ValidationError("Role must be a saved instance")
    if not permission_codename:
        raise ValidationError("Permission codename cannot be empty")
    
    # Check direct permission assignment
    has_direct = self.filter(
        role=role,
        permission__codename=permission_codename
    ).exists()
    
    if has_direct:
        return True
    
    # Check inherited permissions from parent roles
    if check_inheritance and role.parent:
        return self.has_permission(
            role=role.parent,
            permission_codename=permission_codename,
            check_inheritance=True
        )
    
    return False

def _get_all_parent_roles(self, role: 'Role') -> Set['Role']:
    """
    Get all parent roles in the hierarchy.
    
    Args:
        role: The Role to get parents for
    
    Returns:
        Set of parent Role instances
    """
    parents = set()
    current = role.parent
    
    while current:
        parents.add(current)
        current = current.parent
    
    return parents
```

### Permission Inheritance Flow

```
┌─────────────────┐
│   Super Admin   │ (has all permissions)
└────────┬────────┘
         │
┌────────▼────────┐
│  Tenant Admin   │ (inherits from Super Admin)
└────────┬────────┘
         │
┌────────▼────────┐
│     Manager     │ (inherits from Tenant Admin)
└────────┬────────┘
         │
┌────────▼────────┐
│      Staff      │ (inherits from Manager)
└─────────────────┘
```

### Checking Logic
1. **Check Direct Assignment:** Query RolePermission for exact match
2. **Check Parent (if enabled):** Recursively check parent.has_permission()
3. **Walk Hierarchy:** Continue until permission found or no more parents
4. **Return Result:** True if found anywhere in chain, False otherwise

### Performance Considerations
| Optimization | Implementation |
|--------------|----------------|
| Select Related | Use `select_related('permission')` |
| Caching | Cache permission checks per request |
| Batch Checking | Prefetch all permissions for role hierarchy |
| Index | Database index on (role, permission) |

### Expected Outcome
- Method checks permission existence
- Supports inheritance from parent roles
- Efficient recursive checking
- Proper validation and error handling
- Returns boolean result

### Verification Checklist
- [ ] Method signature includes type hints
- [ ] Returns boolean result
- [ ] Comprehensive docstring with examples
- [ ] Input validation for role and permission_codename
- [ ] Checks direct permission assignment
- [ ] Implements inheritance checking
- [ ] Includes `check_inheritance` parameter
- [ ] Recursive logic avoids infinite loops
- [ ] Uses `filter().exists()` for efficiency
- [ ] Helper method for getting parent roles

---

## Integration Notes

### Using the Manager

```python
from apps.users.models import Role, Permission, RolePermission

# Get models
manager_role = Role.objects.get(name='Manager')
view_inventory = Permission.objects.get(codename='inventory.view')
admin_user = User.objects.get(username='admin')

# Assign permission
RolePermission.objects.assign_permission(
    role=manager_role,
    permission=view_inventory,
    granted_by=admin_user
)

# Check permission
can_view = RolePermission.objects.has_permission(
    role=manager_role,
    permission_codename='inventory.view'
)

# Revoke permission
RolePermission.objects.revoke_permission(
    role=manager_role,
    permission=view_inventory
)
```

### Bulk Assignment Pattern

```python
# Assign multiple permissions to a role
permissions_to_assign = [
    'inventory.view',
    'inventory.create',
    'inventory.update',
]

role = Role.objects.get(name='Staff')
admin = User.objects.get(username='admin')

for perm_code in permissions_to_assign:
    permission = Permission.objects.get(codename=perm_code)
    RolePermission.objects.assign_permission(
        role=role,
        permission=permission,
        granted_by=admin
    )
```

### Checking with Inheritance

```python
staff_role = Role.objects.get(name='Staff')  # parent = Manager
manager_role = Role.objects.get(name='Manager')  # parent = Tenant Admin

# Permission assigned to Manager only
view_reports = Permission.objects.get(codename='reports.view')
RolePermission.objects.assign_permission(manager_role, view_reports)

# Check on Staff role (should inherit from Manager)
can_view = RolePermission.objects.has_permission(
    role=staff_role,
    permission_codename='reports.view',
    check_inheritance=True  # Will check parent Manager role
)
# Result: True (inherited from Manager)
```

---

## Testing Considerations

### Unit Tests Required

```python
class RolePermissionManagerTests(TestCase):
    """Test the RolePermissionManager methods."""
    
    def test_assign_permission_creates_record(self):
        """Test that assign_permission creates RolePermission record."""
        pass
    
    def test_assign_permission_is_idempotent(self):
        """Test that calling assign_permission twice doesn't duplicate."""
        pass
    
    def test_revoke_permission_deletes_record(self):
        """Test that revoke_permission removes RolePermission."""
        pass
    
    def test_revoke_nonexistent_returns_false(self):
        """Test that revoking non-assigned permission returns False."""
        pass
    
    def test_has_permission_direct_assignment(self):
        """Test checking directly assigned permission."""
        pass
    
    def test_has_permission_inherited(self):
        """Test checking permission inherited from parent role."""
        pass
    
    def test_has_permission_without_inheritance(self):
        """Test checking with check_inheritance=False."""
        pass
    
    def test_validation_errors(self):
        """Test that invalid inputs raise ValidationError."""
        pass
```

### Test Scenarios
| Test Case | Expected Behavior |
|-----------|-------------------|
| Assign new permission | Creates record, returns instance |
| Assign existing permission | Returns existing, no duplicate |
| Revoke assigned permission | Deletes record, returns True |
| Revoke non-assigned | No error, returns False |
| Check direct permission | Returns True |
| Check inherited permission | Returns True (with inheritance) |
| Check without inheritance | Returns False (parent ignored) |
| Invalid inputs | Raises ValidationError |

---

## Files Modified in This Document

```
backend/apps/users/
├── managers/
│   ├── __init__.py                    # CREATED
│   └── role_permission_manager.py     # CREATED
│       └── class RolePermissionManager:
│           ├── assign_permission()
│           ├── revoke_permission()
│           ├── has_permission()
│           └── _get_all_parent_roles()
└── models/
    └── role_permission.py             # MODIFIED
        └── objects = RolePermissionManager()
```

---

## Next Steps

After completing these tasks, proceed to:
- **Document 03:** [03_Tasks-41-46_Default-Assignments.md](03_Tasks-41-46_Default-Assignments.md) - Set up default permission assignments for each system role

---

## Summary

This document implements the RolePermissionManager class with three core methods:

1. **assign_permission:** Creates role-permission links with audit trail
2. **revoke_permission:** Removes role-permission links safely
3. **has_permission:** Checks permission existence with inheritance support

The manager provides a clean API for permission management and supports hierarchical role inheritance, making it easy to check if a role has access to specific functionality either directly or through parent roles.
