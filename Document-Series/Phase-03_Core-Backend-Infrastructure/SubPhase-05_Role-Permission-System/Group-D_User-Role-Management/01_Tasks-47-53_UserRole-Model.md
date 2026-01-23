# Tasks 47-53: UserRole Model

> **Phase:** 03 - Core Backend Infrastructure  
> **SubPhase:** 05 - Role & Permission System  
> **Group:** D - User-Role Management  
> **Document:** 01 of 04  
> **Tasks Covered:** 47, 48, 49, 50, 51, 52, 53

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Group:** [../Group-C_Role-Permission-Assignment/](../Group-C_Role-Permission-Assignment/)
- **→ Next Document:** [02_Tasks-54-57_UserRoleManager.md](02_Tasks-54-57_UserRoleManager.md)

---

## Document Overview

This document covers the creation of the UserRole junction model that links Users to Roles. This is a many-to-many relationship table with additional audit fields and a primary role flag.

### Tasks in This Document
| Task # | Task Name | Complexity |
|--------|-----------|------------|
| 47 | Create UserRole Model Class | Medium |
| 48 | Add user ForeignKey | Simple |
| 49 | Add role ForeignKey | Simple |
| 50 | Add assigned_at DateTimeField | Simple |
| 51 | Add assigned_by ForeignKey | Medium |
| 52 | Add is_primary BooleanField | Simple |
| 53 | Create Unique Constraint | Medium |

---

## Task 47: Create UserRole Model Class

### Overview
Create the UserRole model class that serves as a junction table between User and Role models. This model enables a many-to-many relationship with additional assignment metadata.

### Dependencies
- Task 03: Create Role Model (from Group A)
- BaseModel (from SubPhase-03_Base-Models-Mixins)
- User model (from SubPhase-04_User-Model-Authentication)

### Instructions

1. **Create the user_role.py file**
   - Navigate to `backend/apps/users/models/` directory
   - Create file named `user_role.py`

2. **Add required imports**
   ```python
   from django.db import models
   from django.conf import settings
   from apps.core.models import BaseModel
   ```

3. **Create UserRole model class**
   - Inherit from `BaseModel` for UUID, timestamps, soft-delete
   - Name the class `UserRole`

4. **Add docstring**
   - Document the purpose: User-Role junction table
   - Note: tracks role assignments to users
   - Mention audit fields and primary role flag

5. **Add model Meta options (placeholder)**
   - Set `db_table` to `'users_user_role'`
   - Set `ordering` to `['-assigned_at']`
   - Set `verbose_name` to `'User Role'`
   - Set `verbose_name_plural` to `'User Roles'`
   - Note: unique_together will be added in Task 53

6. **Add __str__ method**
   - Return format: `"{user.username} - {role.name}"`
   - Include primary indicator if is_primary is True

### Model Purpose

| Purpose | Description |
|---------|-------------|
| **Junction Table** | Links User and Role models (many-to-many) |
| **Assignment Tracking** | Records when and by whom role was assigned |
| **Primary Role** | Marks the user's default/primary role |
| **Audit Trail** | Maintains assignment history and soft-delete support |

### Expected Outcome
```python
# backend/apps/users/models/user_role.py
from django.db import models
from django.conf import settings
from apps.core.models import BaseModel


class UserRole(BaseModel):
    """
    Junction model for User-Role many-to-many relationship.
    
    Tracks role assignments to users with audit information.
    Supports primary role designation for default permissions.
    """
    # Fields will be added in subsequent tasks
    
    class Meta:
        db_table = 'users_user_role'
        ordering = ['-assigned_at']
        verbose_name = 'User Role'
        verbose_name_plural = 'User Roles'
    
    def __str__(self):
        primary_tag = " (Primary)" if self.is_primary else ""
        return f"{self.user.username} - {self.role.name}{primary_tag}"
```

### Verification Checklist
- [ ] File `user_role.py` created in `backend/apps/users/models/`
- [ ] Class named `UserRole` created
- [ ] Inherits from `BaseModel`
- [ ] Docstring documents purpose and features
- [ ] Meta options configured (db_table, ordering, verbose names)
- [ ] `__str__` method returns readable format

---

## Task 48: Add user ForeignKey

### Overview
Add the ForeignKey field that links the UserRole to the User model. This establishes which user has been assigned a role.

### Dependencies
- Task 47: Create UserRole Model Class

### Instructions

1. **Add user ForeignKey field**
   - Field name: `user`
   - Type: `models.ForeignKey`
   - Related model: `settings.AUTH_USER_MODEL` (not direct User import)
   - `on_delete`: `models.CASCADE` (delete UserRole if User deleted)
   - `related_name`: `'user_roles'` (access from User: `user.user_roles.all()`)

2. **Add field help text**
   - `help_text`: `"User to whom the role is assigned"`

3. **Add database indexing**
   - `db_index`: `True` (for query performance)

4. **Update docstring**
   - Document the user field in class docstring
   - Note: CASCADE delete behavior

### Field Configuration

| Parameter | Value | Reason |
|-----------|-------|--------|
| `to` | `settings.AUTH_USER_MODEL` | Reference User via settings (flexible) |
| `on_delete` | `CASCADE` | Remove role assignment if user deleted |
| `related_name` | `'user_roles'` | Reverse query from User model |
| `db_index` | `True` | Index for query performance |

### Usage Example
```python
# Get all roles for a user
user_roles = user.user_roles.all()

# Get active roles (using soft-delete from BaseModel)
active_roles = user.user_roles.filter(deleted_at__isnull=True)

# Get primary role
primary_role = user.user_roles.filter(is_primary=True).first()
```

### Expected Outcome
```python
class UserRole(BaseModel):
    """
    Junction model for User-Role many-to-many relationship.
    
    Fields:
    - user: User to whom the role is assigned (CASCADE on delete)
    """
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='user_roles',
        db_index=True,
        help_text="User to whom the role is assigned"
    )
    
    # ... Meta and __str__ ...
```

### Verification Checklist
- [ ] `user` ForeignKey field added to UserRole model
- [ ] Uses `settings.AUTH_USER_MODEL` reference
- [ ] `on_delete=models.CASCADE` configured
- [ ] `related_name='user_roles'` set
- [ ] `db_index=True` for performance
- [ ] Help text is descriptive
- [ ] Docstring updated

---

## Task 49: Add role ForeignKey

### Overview
Add the ForeignKey field that links the UserRole to the Role model. This establishes which role is being assigned to the user.

### Dependencies
- Task 48: Add user ForeignKey

### Instructions

1. **Add role ForeignKey field**
   - Field name: `role`
   - Type: `models.ForeignKey`
   - Related model: `'Role'` (string reference, same app)
   - `on_delete`: `models.CASCADE` (delete UserRole if Role deleted)
   - `related_name`: `'user_assignments'` (access from Role: `role.user_assignments.all()`)

2. **Add field help text**
   - `help_text`: `"Role assigned to the user"`

3. **Add database indexing**
   - `db_index`: `True` (for query performance)

4. **Update docstring**
   - Document the role field in class docstring
   - Note: CASCADE delete behavior

### Field Configuration

| Parameter | Value | Reason |
|-----------|-------|--------|
| `to` | `'Role'` | String reference to Role model |
| `on_delete` | `CASCADE` | Remove assignment if role deleted |
| `related_name` | `'user_assignments'` | Reverse query from Role model |
| `db_index` | `True` | Index for query performance |

### Usage Example
```python
# Get all users with a specific role
admin_users = role.user_assignments.filter(
    role__slug='admin',
    deleted_at__isnull=True
).select_related('user')

# Check if user has specific role
has_manager_role = user.user_roles.filter(role__slug='manager').exists()

# Get all roles for a user
user_roles = user.user_roles.select_related('role').all()
```

### Expected Outcome
```python
class UserRole(BaseModel):
    """
    Junction model for User-Role many-to-many relationship.
    
    Fields:
    - user: User to whom the role is assigned (CASCADE on delete)
    - role: Role assigned to the user (CASCADE on delete)
    """
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='user_roles',
        db_index=True,
        help_text="User to whom the role is assigned"
    )
    
    role = models.ForeignKey(
        'Role',
        on_delete=models.CASCADE,
        related_name='user_assignments',
        db_index=True,
        help_text="Role assigned to the user"
    )
    
    # ... Meta and __str__ ...
```

### Verification Checklist
- [ ] `role` ForeignKey field added to UserRole model
- [ ] Uses string reference `'Role'`
- [ ] `on_delete=models.CASCADE` configured
- [ ] `related_name='user_assignments'` set
- [ ] `db_index=True` for performance
- [ ] Help text is descriptive
- [ ] Docstring updated

---

## Task 50: Add assigned_at DateTimeField

### Overview
Add the assigned_at timestamp field that records when the role was assigned to the user. This provides audit trail information.

### Dependencies
- Task 49: Add role ForeignKey

### Instructions

1. **Add assigned_at DateTimeField**
   - Field name: `assigned_at`
   - Type: `models.DateTimeField`
   - `auto_now_add`: `True` (automatically set on creation)

2. **Add field help text**
   - `help_text`: `"Timestamp when role was assigned to user"`

3. **Add database indexing**
   - `db_index`: `True` (for filtering and ordering by date)

4. **Update docstring**
   - Document the assigned_at field in class docstring
   - Note: auto-populated on creation

### Field Configuration

| Parameter | Value | Reason |
|-----------|-------|--------|
| `auto_now_add` | `True` | Automatically set on creation |
| `db_index` | `True` | Index for date-based queries |
| `help_text` | Descriptive | Documents field purpose |

### Usage Example
```python
# Get recently assigned roles
recent_assignments = UserRole.objects.filter(
    assigned_at__gte=timezone.now() - timedelta(days=7)
).order_by('-assigned_at')

# Get assignment history for a user
assignment_history = user.user_roles.order_by('-assigned_at')

# Get roles assigned in a date range
roles_in_range = UserRole.objects.filter(
    assigned_at__range=[start_date, end_date]
)
```

### Audit Trail Benefits

| Benefit | Description |
|---------|-------------|
| **History Tracking** | Know when each role was assigned |
| **Compliance** | Audit trail for role-based access control |
| **Debugging** | Troubleshoot permission issues by date |
| **Reporting** | Generate role assignment reports |

### Expected Outcome
```python
class UserRole(BaseModel):
    """
    Junction model for User-Role many-to-many relationship.
    
    Fields:
    - user: User to whom the role is assigned (CASCADE on delete)
    - role: Role assigned to the user (CASCADE on delete)
    - assigned_at: Timestamp when role was assigned (auto-set)
    """
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='user_roles',
        db_index=True,
        help_text="User to whom the role is assigned"
    )
    
    role = models.ForeignKey(
        'Role',
        on_delete=models.CASCADE,
        related_name='user_assignments',
        db_index=True,
        help_text="Role assigned to the user"
    )
    
    assigned_at = models.DateTimeField(
        auto_now_add=True,
        db_index=True,
        help_text="Timestamp when role was assigned to user"
    )
    
    # ... Meta and __str__ ...
```

### Verification Checklist
- [ ] `assigned_at` DateTimeField added to UserRole model
- [ ] `auto_now_add=True` configured (auto-set on creation)
- [ ] `db_index=True` for date queries
- [ ] Help text is descriptive
- [ ] Docstring updated

---

## Task 51: Add assigned_by ForeignKey

### Overview
Add the assigned_by ForeignKey that records which user assigned the role. This provides accountability and audit trail for role assignments.

### Dependencies
- Task 50: Add assigned_at DateTimeField

### Instructions

1. **Add assigned_by ForeignKey field**
   - Field name: `assigned_by`
   - Type: `models.ForeignKey`
   - Related model: `settings.AUTH_USER_MODEL`
   - `on_delete`: `models.SET_NULL` (keep record if assigner deleted)
   - `related_name`: `'role_assignments_made'`
   - `null`: `True` (allow null if assigner is deleted)
   - `blank`: `True` (allow empty in forms)

2. **Add field help text**
   - `help_text`: `"User who assigned this role (null if user deleted)"`

3. **Add database indexing**
   - `db_index`: `True` (for filtering by assigner)

4. **Update docstring**
   - Document the assigned_by field in class docstring
   - Note: SET_NULL behavior preserves audit record

### Field Configuration

| Parameter | Value | Reason |
|-----------|-------|--------|
| `to` | `settings.AUTH_USER_MODEL` | Reference User via settings |
| `on_delete` | `SET_NULL` | Preserve record if assigner deleted |
| `null` | `True` | Allow null in database |
| `blank` | `True` | Allow empty in forms |
| `related_name` | `'role_assignments_made'` | Track assignments made by user |
| `db_index` | `True` | Index for query performance |

### Usage Example
```python
# Get all role assignments made by an admin
assignments_by_admin = admin.role_assignments_made.all()

# Track who assigned a specific role
user_role = UserRole.objects.get(id=some_id)
assigner = user_role.assigned_by  # May be None if deleted

# Get assignment audit trail
audit_trail = UserRole.objects.select_related(
    'user', 'role', 'assigned_by'
).order_by('-assigned_at')

# Count assignments per admin
admin_counts = UserRole.objects.values('assigned_by__username').annotate(
    count=models.Count('id')
)
```

### Audit Trail Benefits

| Benefit | Description |
|---------|-------------|
| **Accountability** | Know who made each role assignment |
| **Compliance** | Meet audit requirements for access control |
| **Investigation** | Track down source of incorrect permissions |
| **Historical Data** | Preserve assignment history even if assigner leaves |

### Expected Outcome
```python
class UserRole(BaseModel):
    """
    Junction model for User-Role many-to-many relationship.
    
    Fields:
    - user: User to whom the role is assigned (CASCADE on delete)
    - role: Role assigned to the user (CASCADE on delete)
    - assigned_at: Timestamp when role was assigned (auto-set)
    - assigned_by: User who assigned the role (SET_NULL on delete)
    """
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='user_roles',
        db_index=True,
        help_text="User to whom the role is assigned"
    )
    
    role = models.ForeignKey(
        'Role',
        on_delete=models.CASCADE,
        related_name='user_assignments',
        db_index=True,
        help_text="Role assigned to the user"
    )
    
    assigned_at = models.DateTimeField(
        auto_now_add=True,
        db_index=True,
        help_text="Timestamp when role was assigned to user"
    )
    
    assigned_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        related_name='role_assignments_made',
        null=True,
        blank=True,
        db_index=True,
        help_text="User who assigned this role (null if user deleted)"
    )
    
    # ... Meta and __str__ ...
```

### Verification Checklist
- [ ] `assigned_by` ForeignKey field added to UserRole model
- [ ] Uses `settings.AUTH_USER_MODEL` reference
- [ ] `on_delete=models.SET_NULL` configured
- [ ] `related_name='role_assignments_made'` set
- [ ] `null=True` and `blank=True` configured
- [ ] `db_index=True` for performance
- [ ] Help text is descriptive
- [ ] Docstring updated

---

## Task 52: Add is_primary BooleanField

### Overview
Add the is_primary flag that marks which role is the user's primary/default role. Each user should have exactly one primary role for default permission context.

### Dependencies
- Task 51: Add assigned_by ForeignKey

### Instructions

1. **Add is_primary BooleanField**
   - Field name: `is_primary`
   - Type: `models.BooleanField`
   - `default`: `False` (not primary by default)

2. **Add field help text**
   - `help_text`: `"Mark this as the user's primary/default role"`

3. **Add database indexing**
   - `db_index`: `True` (for filtering primary roles)

4. **Update docstring**
   - Document the is_primary field in class docstring
   - Note: only one primary role per user (enforced in manager)

5. **Update __str__ method**
   - Add " (Primary)" suffix when is_primary is True
   - Already implemented in Task 47 structure

### Field Configuration

| Parameter | Value | Reason |
|-----------|-------|--------|
| `default` | `False` | Not primary by default |
| `db_index` | `True` | Index for filtering primary roles |
| `help_text` | Descriptive | Documents field purpose |

### Primary Role Usage

| Use Case | Description |
|----------|-------------|
| **Default Context** | Determines default permissions when user logs in |
| **UI Display** | Show primary role badge in user interface |
| **Permission Context** | Use primary role for permission checks when context unclear |
| **Navigation** | Determine default landing page based on primary role |

### Usage Example
```python
# Get user's primary role
primary_user_role = user.user_roles.filter(is_primary=True).first()
primary_role = primary_user_role.role if primary_user_role else None

# Set a role as primary (ensure only one)
def set_primary_role(user, role):
    # Remove primary flag from all user's roles
    user.user_roles.update(is_primary=False)
    # Set the specified role as primary
    user.user_roles.filter(role=role).update(is_primary=True)

# Check if role is primary for user
is_primary = user.user_roles.filter(
    role__slug='manager', 
    is_primary=True
).exists()

# Get all non-primary roles
secondary_roles = user.user_roles.filter(is_primary=False)
```

### Business Rules

| Rule | Enforcement |
|------|-------------|
| **One Primary Role** | Enforced in UserRoleManager (Task 55) |
| **Primary Required** | Every active user should have one primary role |
| **Primary Cannot Delete** | Prevent deletion of user's only/primary role |
| **Auto-Primary** | First role assigned becomes primary automatically |

### Expected Outcome
```python
class UserRole(BaseModel):
    """
    Junction model for User-Role many-to-many relationship.
    
    Fields:
    - user: User to whom the role is assigned (CASCADE on delete)
    - role: Role assigned to the user (CASCADE on delete)
    - assigned_at: Timestamp when role was assigned (auto-set)
    - assigned_by: User who assigned the role (SET_NULL on delete)
    - is_primary: Mark as user's primary/default role (only one per user)
    """
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='user_roles',
        db_index=True,
        help_text="User to whom the role is assigned"
    )
    
    role = models.ForeignKey(
        'Role',
        on_delete=models.CASCADE,
        related_name='user_assignments',
        db_index=True,
        help_text="Role assigned to the user"
    )
    
    assigned_at = models.DateTimeField(
        auto_now_add=True,
        db_index=True,
        help_text="Timestamp when role was assigned to user"
    )
    
    assigned_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        related_name='role_assignments_made',
        null=True,
        blank=True,
        db_index=True,
        help_text="User who assigned this role (null if user deleted)"
    )
    
    is_primary = models.BooleanField(
        default=False,
        db_index=True,
        help_text="Mark this as the user's primary/default role"
    )
    
    # ... Meta and __str__ ...
```

### Verification Checklist
- [ ] `is_primary` BooleanField added to UserRole model
- [ ] `default=False` configured
- [ ] `db_index=True` for filtering
- [ ] Help text is descriptive
- [ ] Docstring updated
- [ ] `__str__` method shows " (Primary)" tag

---

## Task 53: Create Unique Constraint

### Overview
Add a unique_together constraint on the user and role fields to prevent duplicate role assignments. A user should not have the same role assigned twice.

### Dependencies
- Task 52: Add is_primary BooleanField

### Instructions

1. **Update Meta class**
   - Add `unique_together` constraint
   - Combine fields: `['user', 'role']`

2. **Update Meta indexes**
   - Add compound index for user + role queries
   - Format: `models.Index(fields=['user', 'role'])`

3. **Add constraint name**
   - Add `constraints` list to Meta
   - Use `models.UniqueConstraint` with custom name
   - Name: `'unique_user_role'`
   - Fields: `['user', 'role']`

4. **Update docstring**
   - Document the unique constraint in class docstring
   - Note: prevents duplicate role assignments

5. **Add validation considerations**
   - Note: soft-delete (deleted_at) does not affect uniqueness
   - User can have same role multiple times if previous is soft-deleted

### Constraint Configuration

| Approach | Method | Reason |
|----------|--------|--------|
| **Option 1** | `unique_together` in Meta | Simple, database-level enforcement |
| **Option 2** | `UniqueConstraint` in Meta | Modern approach, better error messages |
| **Recommended** | Use both for compatibility | Ensures constraint across Django versions |

### Database Behavior

| Scenario | Result |
|----------|--------|
| Assign same role twice | DatabaseError / IntegrityError |
| Assign different roles | Success |
| Re-assign soft-deleted role | Success (deleted_at breaks uniqueness) |
| Assign role to different user | Success |

### Usage Example
```python
# This will work
UserRole.objects.create(user=user1, role=admin_role)
UserRole.objects.create(user=user1, role=manager_role)  # Different role

# This will raise IntegrityError
UserRole.objects.create(user=user1, role=admin_role)  # Duplicate!

# This will work (previous assignment was soft-deleted)
previous_assignment.delete()  # Soft-delete (sets deleted_at)
UserRole.objects.create(user=user1, role=admin_role)  # New assignment

# Handle constraint violation
try:
    UserRole.objects.create(user=user, role=role)
except IntegrityError:
    print("User already has this role assigned")
```

### Validation in Manager

```python
# UserRoleManager.assign_role() method (Task 55) will check:
def assign_role(self, user, role, assigned_by=None):
    # Check if assignment already exists
    existing = self.filter(user=user, role=role).first()
    if existing:
        if existing.deleted_at:
            # Restore soft-deleted assignment
            existing.deleted_at = None
            existing.assigned_by = assigned_by
            existing.save()
            return existing
        else:
            raise ValueError(f"User already has role '{role.name}'")
    
    # Create new assignment
    return self.create(user=user, role=role, assigned_by=assigned_by)
```

### Expected Outcome
```python
class UserRole(BaseModel):
    """
    Junction model for User-Role many-to-many relationship.
    
    Fields:
    - user: User to whom the role is assigned (CASCADE on delete)
    - role: Role assigned to the user (CASCADE on delete)
    - assigned_at: Timestamp when role was assigned (auto-set)
    - assigned_by: User who assigned the role (SET_NULL on delete)
    - is_primary: Mark as user's primary/default role (only one per user)
    
    Constraints:
    - unique_together: [user, role] - prevents duplicate assignments
    """
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='user_roles',
        db_index=True,
        help_text="User to whom the role is assigned"
    )
    
    role = models.ForeignKey(
        'Role',
        on_delete=models.CASCADE,
        related_name='user_assignments',
        db_index=True,
        help_text="Role assigned to the user"
    )
    
    assigned_at = models.DateTimeField(
        auto_now_add=True,
        db_index=True,
        help_text="Timestamp when role was assigned to user"
    )
    
    assigned_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        related_name='role_assignments_made',
        null=True,
        blank=True,
        db_index=True,
        help_text="User who assigned this role (null if user deleted)"
    )
    
    is_primary = models.BooleanField(
        default=False,
        db_index=True,
        help_text="Mark this as the user's primary/default role"
    )
    
    class Meta:
        db_table = 'users_user_role'
        ordering = ['-assigned_at']
        verbose_name = 'User Role'
        verbose_name_plural = 'User Roles'
        unique_together = [['user', 'role']]
        constraints = [
            models.UniqueConstraint(
                fields=['user', 'role'],
                name='unique_user_role'
            )
        ]
        indexes = [
            models.Index(fields=['user', 'role']),
            models.Index(fields=['user', 'is_primary']),
        ]
    
    def __str__(self):
        primary_tag = " (Primary)" if self.is_primary else ""
        return f"{self.user.username} - {self.role.name}{primary_tag}"
```

### Migration Considerations

| Consideration | Action |
|---------------|--------|
| **Existing Data** | Check for duplicates before applying migration |
| **Soft-Deleted** | Uniqueness includes soft-deleted records |
| **Migration Script** | Add data migration to remove duplicates if needed |

### Verification Checklist
- [ ] `unique_together = [['user', 'role']]` added to Meta
- [ ] `UniqueConstraint` with name `'unique_user_role'` added
- [ ] Compound index on `['user', 'role']` added
- [ ] Index on `['user', 'is_primary']` added for primary role queries
- [ ] Docstring updated to mention constraint
- [ ] Database migration created successfully
- [ ] Duplicate assignment attempts raise IntegrityError

---

## Complete UserRole Model

### Final Implementation
```python
# backend/apps/users/models/user_role.py
"""
UserRole Model - User-Role Junction Table

This module defines the UserRole model that manages the many-to-many
relationship between Users and Roles with additional assignment metadata.
"""
from django.db import models
from django.conf import settings
from apps.core.models import BaseModel


class UserRole(BaseModel):
    """
    Junction model for User-Role many-to-many relationship.
    
    This model represents role assignments to users with full audit trail.
    It tracks when roles were assigned, who assigned them, and supports
    marking a user's primary/default role.
    
    Fields:
    - user: User to whom the role is assigned (CASCADE on delete)
    - role: Role assigned to the user (CASCADE on delete)
    - assigned_at: Timestamp when role was assigned (auto-set)
    - assigned_by: User who assigned the role (SET_NULL on delete)
    - is_primary: Mark as user's primary/default role (only one per user)
    
    Constraints:
    - unique_together: [user, role] - prevents duplicate assignments
    
    Inherits from BaseModel:
    - id: UUID primary key
    - created_at: Creation timestamp
    - updated_at: Last update timestamp
    - deleted_at: Soft-delete timestamp (null if active)
    """
    
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='user_roles',
        db_index=True,
        help_text="User to whom the role is assigned"
    )
    
    role = models.ForeignKey(
        'Role',
        on_delete=models.CASCADE,
        related_name='user_assignments',
        db_index=True,
        help_text="Role assigned to the user"
    )
    
    assigned_at = models.DateTimeField(
        auto_now_add=True,
        db_index=True,
        help_text="Timestamp when role was assigned to user"
    )
    
    assigned_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        related_name='role_assignments_made',
        null=True,
        blank=True,
        db_index=True,
        help_text="User who assigned this role (null if user deleted)"
    )
    
    is_primary = models.BooleanField(
        default=False,
        db_index=True,
        help_text="Mark this as the user's primary/default role"
    )
    
    class Meta:
        db_table = 'users_user_role'
        ordering = ['-assigned_at']
        verbose_name = 'User Role'
        verbose_name_plural = 'User Roles'
        unique_together = [['user', 'role']]
        constraints = [
            models.UniqueConstraint(
                fields=['user', 'role'],
                name='unique_user_role'
            )
        ]
        indexes = [
            models.Index(fields=['user', 'role']),
            models.Index(fields=['user', 'is_primary']),
            models.Index(fields=['role', 'is_primary']),
        ]
    
    def __str__(self):
        """String representation showing user, role, and primary status."""
        primary_tag = " (Primary)" if self.is_primary else ""
        return f"{self.user.username} - {self.role.name}{primary_tag}"
    
    def save(self, *args, **kwargs):
        """
        Override save to ensure primary role business rules.
        
        If this is marked as primary, ensure no other role for this user
        is marked as primary.
        """
        if self.is_primary:
            # Remove primary flag from other roles for this user
            UserRole.objects.filter(
                user=self.user,
                is_primary=True
            ).exclude(id=self.id).update(is_primary=False)
        
        super().save(*args, **kwargs)
```

### Model Relationships Diagram
```
┌─────────────┐         ┌─────────────┐         ┌─────────────┐
│    User     │         │  UserRole   │         │    Role     │
├─────────────┤         ├─────────────┤         ├─────────────┤
│ id          │────┐    │ id          │    ┌────│ id          │
│ username    │    │    │ user_id     │    │    │ name        │
│ email       │    └───→│ role_id     │←───┘    │ slug        │
│ ...         │         │ assigned_at │         │ ...         │
└─────────────┘         │ assigned_by │         └─────────────┘
                        │ is_primary  │
      ┌─────────────────┤             │
      │ assigned_by     └─────────────┘
      │ (tracks who assigned)
      └─────────────────→ User.id
```

### Usage Examples

```python
# 1. Assign role to user
user_role = UserRole.objects.create(
    user=user,
    role=admin_role,
    assigned_by=request.user,
    is_primary=True
)

# 2. Get user's roles
roles = user.user_roles.filter(
    deleted_at__isnull=True
).select_related('role')

# 3. Get primary role
primary = user.user_roles.filter(is_primary=True).first()

# 4. Get all users with a specific role
admin_users = UserRole.objects.filter(
    role__slug='admin',
    deleted_at__isnull=True
).select_related('user')

# 5. Check if user has role
has_role = user.user_roles.filter(
    role__slug='manager',
    deleted_at__isnull=True
).exists()

# 6. Get assignment audit trail
audit = UserRole.objects.filter(
    user=user
).select_related('role', 'assigned_by').order_by('-assigned_at')

# 7. Soft-delete role assignment
user_role.delete()  # Sets deleted_at, keeps record

# 8. Count role assignments per user
from django.db.models import Count
user_role_counts = User.objects.annotate(
    role_count=Count('user_roles', filter=models.Q(user_roles__deleted_at__isnull=True))
)
```

### Next Steps

1. **Create UserRoleManager** (Tasks 54-57)
   - Implement `assign_role()` method
   - Implement `remove_role()` method
   - Implement `get_roles()` method
   - Handle primary role logic

2. **Update User Model** (Tasks 58-60)
   - Add `has_perm()` method
   - Add `has_role()` method
   - Add `get_all_permissions()` method

3. **Add Caching** (Task 61)
   - Cache user permissions in Redis
   - Invalidate cache on role change

4. **Create Documentation** (Task 62)
   - Document user-role system
   - Add usage examples

---

## Summary

### What Was Built
- **UserRole Model:** Complete junction table for User-Role relationship
- **Audit Fields:** assigned_at, assigned_by for tracking
- **Primary Role:** is_primary flag for default role designation
- **Constraints:** Unique constraint on user + role to prevent duplicates
- **Indexes:** Performance indexes on key query fields

### Key Features
| Feature | Description |
|---------|-------------|
| **Junction Table** | Many-to-many User ↔ Role with metadata |
| **Audit Trail** | Track when/who assigned each role |
| **Primary Role** | Mark default role per user |
| **Soft Delete** | Inherited from BaseModel |
| **Uniqueness** | Prevent duplicate role assignments |

### Database Table
```sql
CREATE TABLE users_user_role (
    id UUID PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth_user(id) ON DELETE CASCADE,
    role_id UUID NOT NULL REFERENCES users_role(id) ON DELETE CASCADE,
    assigned_at TIMESTAMP NOT NULL DEFAULT NOW(),
    assigned_by_id UUID REFERENCES auth_user(id) ON DELETE SET NULL,
    is_primary BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMP NULL,
    UNIQUE(user_id, role_id),
    INDEX idx_user_role (user_id, role_id),
    INDEX idx_user_primary (user_id, is_primary)
);
```

### Files Created
```
backend/apps/users/models/
└── user_role.py                # UserRole model (Tasks 47-53)
```

### Integration Points
- **User Model:** Via `user.user_roles` reverse relation
- **Role Model:** Via `role.user_assignments` reverse relation
- **BaseModel:** Inherits UUID PK, timestamps, soft-delete
- **Next:** UserRoleManager for assignment logic (Tasks 54-57)

---

## Questions & Troubleshooting

### Q: Why use soft-delete for UserRole?
**A:** Preserve audit trail. Even if a role assignment is "deleted", we keep the historical record showing the user had that role previously.

### Q: Can a user have multiple primary roles?
**A:** No. The `save()` method ensures only one role is marked as primary per user.

### Q: What happens if assigned_by user is deleted?
**A:** The `assigned_by` field is set to NULL (SET_NULL), but the role assignment remains with audit trail intact.

### Q: How does unique_together interact with soft-delete?
**A:** Soft-deleted records (deleted_at != NULL) still count toward uniqueness. This prevents re-assigning the same role without first permanently deleting the old assignment.

### Q: Should we add a custom manager to UserRole?
**A:** Yes! Task 54 creates UserRoleManager with helper methods like `assign_role()`, `remove_role()`, and `get_roles()`.

---

**Document Status:** ✅ Complete  
**Next Document:** [02_Tasks-54-57_UserRoleManager.md](02_Tasks-54-57_UserRoleManager.md)  
**Last Updated:** 2026-01-23
