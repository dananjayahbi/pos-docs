# Tasks 54-57: UserRoleManager

> **Phase:** 03 - Core Backend Infrastructure  
> **SubPhase:** 05 - Role & Permission System  
> **Group:** D - User-Role Management  
> **Document:** 02 of 04  
> **Tasks Covered:** 54, 55, 56, 57

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [01_Tasks-47-53_UserRole-Model.md](01_Tasks-47-53_UserRole-Model.md)
- **→ Next Document:** [03_Tasks-58-61_User-Permission-Methods.md](03_Tasks-58-61_User-Permission-Methods.md)

---

## Document Overview

This document covers the creation of the UserRoleManager custom manager class. This manager provides convenient methods for assigning and removing roles from users, handling primary role logic, and querying user roles.

### Tasks in This Document
| Task # | Task Name | Complexity |
|--------|-----------|------------|
| 54 | Create UserRoleManager Class | Simple |
| 55 | Add assign_role Method | Medium |
| 56 | Add remove_role Method | Medium |
| 57 | Add get_roles Method | Simple |

---

## Task 54: Create UserRoleManager Class

### Overview
Create a custom manager for the UserRole model to provide business logic for role assignment operations.

### Dependencies
- Task 47-53: UserRole Model must exist

### Instructions

1. **Create the manager file**
   - Create file: `backend/apps/users/managers/user_role_manager.py`
   - Import necessary Django modules

2. **Import required modules**
   ```python
   from django.db import models, transaction
   from django.core.exceptions import ValidationError
   from django.utils import timezone
   ```

3. **Create UserRoleManager class**
   - Inherit from `models.Manager`
   - Add docstring explaining purpose
   - Prepare for custom methods

4. **Add class structure**
   ```python
   class UserRoleManager(models.Manager):
       """
       Custom manager for UserRole model.
       
       Provides methods for:
       - Assigning roles to users
       - Removing roles from users
       - Querying user roles
       - Managing primary role logic
       """
       pass
   ```

5. **Update UserRole model**
   - Add custom manager to UserRole model
   - Set as default manager: `objects = UserRoleManager()`

### Expected Code Structure
```python
# backend/apps/users/managers/user_role_manager.py

from django.db import models, transaction
from django.core.exceptions import ValidationError
from django.utils import timezone


class UserRoleManager(models.Manager):
    """
    Custom manager for UserRole model.
    
    Provides methods for managing user-role assignments including:
    - Role assignment with primary role handling
    - Role removal with validation
    - Role querying
    """
    
    # Methods will be added in next tasks
    pass
```

### UserRole Model Update
```python
# backend/apps/users/models/user_role.py

from apps.users.managers.user_role_manager import UserRoleManager


class UserRole(BaseModel):
    # ... existing fields ...
    
    objects = UserRoleManager()
    
    # ... rest of model ...
```

### Manager Benefits
| Benefit | Description |
|---------|-------------|
| **Encapsulation** | Business logic in one place |
| **Reusability** | Methods used across codebase |
| **Transaction Safety** | Atomic operations |
| **Validation** | Centralized rule enforcement |
| **Primary Role Logic** | Handles complex role constraints |

### Expected Outcome
```
backend/apps/users/managers/
└── user_role_manager.py         # Custom manager created
    └── class UserRoleManager(models.Manager)
```

### Verification Checklist
- [ ] `user_role_manager.py` file created
- [ ] UserRoleManager class inherits from models.Manager
- [ ] Docstring explains manager purpose
- [ ] Manager added to UserRole model
- [ ] File structure follows Django conventions

---

## Task 55: Add assign_role Method

### Overview
Create the assign_role method that assigns a role to a user, handles primary role logic, and tracks who assigned the role.

### Dependencies
- Task 54: UserRoleManager Class must exist
- Tasks 47-53: UserRole Model must exist
- Task 15-23: Role Model must exist

### Instructions

1. **Add assign_role method signature**
   ```python
   def assign_role(self, user, role, assigned_by, is_primary=False):
   ```

2. **Add method docstring**
   - Explain method purpose
   - Document parameters
   - Document return value
   - Note exceptions raised

3. **Implement parameter validation**
   - Validate user is not None
   - Validate role is not None
   - Validate assigned_by is not None
   - Raise ValidationError for invalid inputs

4. **Check if role already assigned**
   - Query existing UserRole record
   - If exists and is_primary matches, return existing
   - If exists but is_primary differs, update and return

5. **Handle primary role logic**
   - If is_primary=True, unset other primary roles
   - Use filter().update() for efficiency
   - Ensure user has exactly one primary role

6. **Create UserRole record**
   - Use transaction.atomic() for safety
   - Create new UserRole instance
   - Set all fields (user, role, assigned_by, is_primary, assigned_at)
   - Save and return

7. **Add cache invalidation**
   - Import cache utility
   - Invalidate user permissions cache
   - Clear user roles cache

8. **Add error handling**
   - Catch database errors
   - Provide meaningful error messages
   - Log errors for debugging

### Method Implementation
```python
@transaction.atomic
def assign_role(self, user, role, assigned_by, is_primary=False):
    """
    Assign a role to a user.
    
    Args:
        user: User instance to assign role to
        role: Role instance to assign
        assigned_by: User instance who is assigning the role
        is_primary: Boolean indicating if this is the primary role
    
    Returns:
        UserRole instance
    
    Raises:
        ValidationError: If parameters are invalid
    
    Notes:
        - If is_primary=True, other primary roles are unset
        - If role already assigned, updates is_primary if needed
        - Clears user permissions cache
    """
    # Validate parameters
    if not user or not role or not assigned_by:
        raise ValidationError("user, role, and assigned_by are required")
    
    # Check if role already assigned
    try:
        user_role = self.get(user=user, role=role)
        # Update is_primary if needed
        if user_role.is_primary != is_primary:
            if is_primary:
                # Unset other primary roles
                self.filter(user=user, is_primary=True).update(is_primary=False)
            user_role.is_primary = is_primary
            user_role.save()
        return user_role
    except self.model.DoesNotExist:
        pass
    
    # Handle primary role logic
    if is_primary:
        # Unset other primary roles
        self.filter(user=user, is_primary=True).update(is_primary=False)
    
    # Create new UserRole
    user_role = self.create(
        user=user,
        role=role,
        assigned_by=assigned_by,
        is_primary=is_primary,
        assigned_at=timezone.now()
    )
    
    # Invalidate cache
    from apps.users.cache.permission_cache import invalidate_user_cache
    invalidate_user_cache(user.id)
    
    return user_role
```

### Primary Role Logic
```
User has roles: [Admin, Manager, Staff]

assign_role(user, Supervisor, user, is_primary=True)
    ↓
1. Check existing: Admin (primary), Manager, Staff
2. Unset all primary: Admin (not primary), Manager, Staff
3. Create new: Admin, Manager, Staff, Supervisor (primary)
    ↓
Result: User has 4 roles, Supervisor is primary
```

### Business Rules
| Rule | Enforcement |
|------|-------------|
| **Unique Assignment** | User-role pair is unique (constraint) |
| **Primary Role** | User can have only one primary role |
| **Audit Trail** | Track assigned_by and assigned_at |
| **Cache Invalidation** | Clear cache on assignment |
| **Transaction Safety** | Use @transaction.atomic |

### Expected Outcome
```python
# Usage example
from apps.users.models import User, UserRole
from apps.roles.models import Role

admin_role = Role.objects.get(slug='admin')
user = User.objects.get(email='john@example.com')
assigner = User.objects.get(email='manager@example.com')

user_role = UserRole.objects.assign_role(
    user=user,
    role=admin_role,
    assigned_by=assigner,
    is_primary=True
)

print(user_role.is_primary)  # True
```

### Verification Checklist
- [ ] assign_role method implemented
- [ ] Parameter validation included
- [ ] Primary role logic handles correctly
- [ ] Existing role assignment handled
- [ ] Transaction decorator applied
- [ ] Cache invalidation implemented
- [ ] Docstring complete with examples
- [ ] Method returns UserRole instance

---

## Task 56: Add remove_role Method

### Overview
Create the remove_role method that removes a role from a user with validation to ensure the user retains at least one role.

### Dependencies
- Task 54: UserRoleManager Class must exist
- Task 55: assign_role method (for context)
- Tasks 47-53: UserRole Model must exist

### Instructions

1. **Add remove_role method signature**
   ```python
   def remove_role(self, user, role):
   ```

2. **Add method docstring**
   - Explain method purpose
   - Document parameters
   - Document return value
   - Note exceptions raised

3. **Implement parameter validation**
   - Validate user is not None
   - Validate role is not None
   - Raise ValidationError for invalid inputs

4. **Check if role is assigned**
   - Query UserRole record
   - If not found, raise ValidationError
   - Cannot remove role that user doesn't have

5. **Validate minimum roles constraint**
   - Count user's total roles
   - If only one role, prevent removal
   - Raise ValidationError with clear message
   - User must have at least one role

6. **Handle primary role removal**
   - Check if removing primary role
   - If yes, promote another role to primary
   - Select oldest or first role as new primary
   - Update is_primary flag

7. **Delete UserRole record**
   - Use transaction.atomic() for safety
   - Delete the UserRole instance
   - Return True for success

8. **Add cache invalidation**
   - Clear user permissions cache
   - Clear user roles cache

### Method Implementation
```python
@transaction.atomic
def remove_role(self, user, role):
    """
    Remove a role from a user.
    
    Args:
        user: User instance to remove role from
        role: Role instance to remove
    
    Returns:
        bool: True if role removed successfully
    
    Raises:
        ValidationError: If parameters invalid or role not assigned
        ValidationError: If user would have no roles after removal
    
    Notes:
        - User must have at least one role
        - If removing primary role, another role becomes primary
        - Clears user permissions cache
    """
    # Validate parameters
    if not user or not role:
        raise ValidationError("user and role are required")
    
    # Check if role is assigned
    try:
        user_role = self.get(user=user, role=role)
    except self.model.DoesNotExist:
        raise ValidationError(f"User does not have role: {role.name}")
    
    # Check minimum roles constraint
    total_roles = self.filter(user=user).count()
    if total_roles <= 1:
        raise ValidationError(
            "Cannot remove role. User must have at least one role."
        )
    
    # Handle primary role removal
    was_primary = user_role.is_primary
    
    # Delete the role
    user_role.delete()
    
    # If was primary, promote another role
    if was_primary:
        new_primary = self.filter(user=user).order_by('assigned_at').first()
        if new_primary:
            new_primary.is_primary = True
            new_primary.save()
    
    # Invalidate cache
    from apps.users.cache.permission_cache import invalidate_user_cache
    invalidate_user_cache(user.id)
    
    return True
```

### Primary Role Promotion Logic
```
User has roles: [Admin (primary), Manager, Staff]

remove_role(user, Admin)
    ↓
1. Check: Admin is assigned ✓
2. Count roles: 3 total ✓
3. Admin is primary → need to promote another
4. Delete Admin role
5. Promote Manager (oldest) to primary
    ↓
Result: [Manager (primary), Staff]
```

### Validation Rules
| Rule | Enforcement |
|------|-------------|
| **Role Exists** | User must have the role |
| **Minimum Roles** | User must keep at least one role |
| **Primary Promotion** | Auto-promote if removing primary |
| **Transaction Safety** | Use @transaction.atomic |
| **Cache Invalidation** | Clear cache after removal |

### Error Scenarios
| Scenario | Validation | Error Message |
|----------|------------|---------------|
| User doesn't have role | Raise error | "User does not have role: {role}" |
| Only one role left | Prevent removal | "User must have at least one role" |
| Invalid parameters | Raise error | "user and role are required" |

### Expected Outcome
```python
# Usage example
from apps.users.models import User, UserRole
from apps.roles.models import Role

staff_role = Role.objects.get(slug='staff')
user = User.objects.get(email='john@example.com')

# User has: [Admin (primary), Manager, Staff]
success = UserRole.objects.remove_role(user=user, role=staff_role)
# Result: [Admin (primary), Manager]

# Try to remove last role
admin = Role.objects.get(slug='admin')
manager = Role.objects.get(slug='manager')
UserRole.objects.remove_role(user, manager)  # OK
UserRole.objects.remove_role(user, admin)    # Raises ValidationError
```

### Verification Checklist
- [ ] remove_role method implemented
- [ ] Parameter validation included
- [ ] Role existence checked
- [ ] Minimum roles constraint enforced
- [ ] Primary role promotion logic works
- [ ] Transaction decorator applied
- [ ] Cache invalidation implemented
- [ ] Docstring complete with examples
- [ ] Returns boolean for success

---

## Task 57: Add get_roles Method

### Overview
Create the get_roles method that returns a QuerySet of all roles assigned to a user, with optional filtering capabilities.

### Dependencies
- Task 54: UserRoleManager Class must exist
- Tasks 47-53: UserRole Model must exist

### Instructions

1. **Add get_roles method signature**
   ```python
   def get_roles(self, user, is_primary=None):
   ```

2. **Add method docstring**
   - Explain method purpose
   - Document parameters
   - Document return value
   - Document filtering options

3. **Implement parameter validation**
   - Validate user is not None
   - Raise ValidationError for invalid input

4. **Build base query**
   - Filter UserRole by user
   - Select related role for efficiency
   - Order by is_primary descending, then assigned_at

5. **Apply optional filters**
   - If is_primary is not None, filter by is_primary
   - Allow filtering for primary role only
   - Allow filtering for non-primary roles only

6. **Return Role QuerySet**
   - Use values_list or annotate to return roles
   - Return Role objects, not UserRole objects
   - Include role details

7. **Add helper method variations**
   - get_primary_role(): Returns single primary role
   - get_non_primary_roles(): Returns all non-primary roles
   - These are convenience wrappers

### Method Implementation
```python
def get_roles(self, user, is_primary=None):
    """
    Get all roles assigned to a user.
    
    Args:
        user: User instance to get roles for
        is_primary: Optional boolean to filter primary/non-primary roles
                   None = all roles (default)
                   True = primary role only
                   False = non-primary roles only
    
    Returns:
        QuerySet of Role instances
    
    Raises:
        ValidationError: If user is None
    
    Notes:
        - Results ordered by is_primary DESC, assigned_at ASC
        - Uses select_related for efficiency
    """
    # Validate parameter
    if not user:
        raise ValidationError("user is required")
    
    # Build query
    queryset = self.filter(user=user).select_related('role')
    
    # Apply optional filter
    if is_primary is not None:
        queryset = queryset.filter(is_primary=is_primary)
    
    # Order by primary first, then assignment date
    queryset = queryset.order_by('-is_primary', 'assigned_at')
    
    # Return Role objects
    return queryset


def get_primary_role(self, user):
    """
    Get the primary role for a user.
    
    Args:
        user: User instance
    
    Returns:
        Role instance or None
    """
    user_role = self.filter(user=user, is_primary=True).select_related('role').first()
    return user_role.role if user_role else None


def get_non_primary_roles(self, user):
    """
    Get all non-primary roles for a user.
    
    Args:
        user: User instance
    
    Returns:
        QuerySet of Role instances
    """
    return self.get_roles(user=user, is_primary=False)
```

### Query Optimization
| Optimization | Benefit |
|--------------|---------|
| **select_related('role')** | Reduces database queries (JOIN) |
| **Order by is_primary** | Primary role appears first |
| **Order by assigned_at** | Chronological order |
| **Reusable queryset** | Can chain further filters |

### Usage Examples
```python
from apps.users.models import User, UserRole

user = User.objects.get(email='john@example.com')

# Get all roles
all_roles = UserRole.objects.get_roles(user)
# Returns: <QuerySet [<UserRole: Admin (primary)>, <UserRole: Manager>, <UserRole: Staff>]>

# Get primary role only
primary_role = UserRole.objects.get_primary_role(user)
# Returns: <Role: Admin>

# Get non-primary roles
other_roles = UserRole.objects.get_non_primary_roles(user)
# Returns: <QuerySet [<UserRole: Manager>, <UserRole: Staff>]>

# Filter in code
admin_roles = UserRole.objects.get_roles(user).filter(role__slug='admin')
```

### Method Variations
```python
# Main method
get_roles(user, is_primary=None)     # All roles or filtered

# Convenience methods
get_primary_role(user)               # Single primary role
get_non_primary_roles(user)          # All non-primary roles
```

### Expected Outcome
```python
# Complete manager with all methods
class UserRoleManager(models.Manager):
    @transaction.atomic
    def assign_role(self, user, role, assigned_by, is_primary=False):
        # ... implementation ...
    
    @transaction.atomic
    def remove_role(self, user, role):
        # ... implementation ...
    
    def get_roles(self, user, is_primary=None):
        # ... implementation ...
    
    def get_primary_role(self, user):
        # ... implementation ...
    
    def get_non_primary_roles(self, user):
        # ... implementation ...
```

### Verification Checklist
- [ ] get_roles method implemented
- [ ] Parameter validation included
- [ ] Optional is_primary filter works
- [ ] select_related optimization applied
- [ ] Results ordered correctly
- [ ] get_primary_role helper added
- [ ] get_non_primary_roles helper added
- [ ] Docstrings complete
- [ ] Returns QuerySet of UserRole objects

---

## Summary

### Completed Tasks
- [x] **Task 54:** Created UserRoleManager class
- [x] **Task 55:** Implemented assign_role method with primary role logic
- [x] **Task 56:** Implemented remove_role method with validation
- [x] **Task 57:** Implemented get_roles method with filtering

### Manager Methods Overview
| Method | Purpose | Complexity |
|--------|---------|------------|
| **assign_role** | Assign role to user | Medium |
| **remove_role** | Remove role from user | Medium |
| **get_roles** | Query user roles | Simple |
| **get_primary_role** | Get primary role | Simple |
| **get_non_primary_roles** | Get non-primary roles | Simple |

### Business Logic Summary
```python
UserRoleManager:
    ├── assign_role()
    │   ├── Validates parameters
    │   ├── Handles duplicate assignments
    │   ├── Manages primary role logic
    │   ├── Creates UserRole record
    │   └── Invalidates cache
    │
    ├── remove_role()
    │   ├── Validates role exists
    │   ├── Enforces minimum role constraint
    │   ├── Promotes new primary if needed
    │   ├── Deletes UserRole record
    │   └── Invalidates cache
    │
    └── get_roles()
        ├── Filters by user
        ├── Optional primary filter
        ├── Optimized query (select_related)
        └── Returns QuerySet
```

### Key Features
- **Transaction Safety:** All mutations wrapped in @transaction.atomic
- **Primary Role Logic:** Automatically manages single primary role
- **Validation:** Comprehensive parameter and business rule validation
- **Cache Integration:** Invalidates user cache on changes
- **Query Optimization:** Uses select_related to reduce queries
- **Convenience Methods:** Helper methods for common operations

### File Structure
```
backend/apps/users/managers/
└── user_role_manager.py
    └── class UserRoleManager(models.Manager):
        ├── assign_role(user, role, assigned_by, is_primary)
        ├── remove_role(user, role)
        ├── get_roles(user, is_primary=None)
        ├── get_primary_role(user)
        └── get_non_primary_roles(user)
```

### Next Steps
1. Extend User model with permission checking methods (Tasks 58-61)
2. Implement has_perm, has_role methods on User
3. Add Redis caching for permissions
4. Create permission utility functions

---

## Notes for AI Agents

### Implementation Guidelines
1. **Manager Pattern:** Use custom managers for complex business logic
2. **Transaction Safety:** Wrap mutations in atomic transactions
3. **Primary Role:** User must have exactly one primary role at all times
4. **Minimum Roles:** User must have at least one role (never zero)
5. **Cache Invalidation:** Clear cache after any role change
6. **Query Optimization:** Use select_related for foreign keys
7. **Validation:** Validate all parameters before processing
8. **Error Messages:** Provide clear, actionable error messages

### Common Patterns
```python
# Assign first role as primary
UserRole.objects.assign_role(user, role, admin, is_primary=True)

# Add additional roles (non-primary)
UserRole.objects.assign_role(user, other_role, admin, is_primary=False)

# Change primary role
UserRole.objects.assign_role(user, new_role, admin, is_primary=True)
# This automatically unsets the old primary role

# Remove role
UserRole.objects.remove_role(user, old_role)
# If this was primary, another role is automatically promoted

# Query roles
all_roles = UserRole.objects.get_roles(user)
primary = UserRole.objects.get_primary_role(user)
others = UserRole.objects.get_non_primary_roles(user)
```

### Testing Considerations
- Test primary role assignment and reassignment
- Test role removal with minimum role validation
- Test primary role promotion on removal
- Test cache invalidation
- Test concurrent role assignments
- Test edge cases (single role, multiple roles)

---

**End of Document**
