# Tasks 31-36: RolePermission Model

> **Phase:** 03 - Core Backend Infrastructure  
> **SubPhase:** 05 - Role & Permission System  
> **Group:** C - Role-Permission Assignment  
> **Document:** 01 of 03  
> **Tasks Covered:** 31, 32, 33, 34, 35, 36

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Group:** [../Group-B_Permission-Model/](../Group-B_Permission-Model/)
- **→ Next Document:** [02_Tasks-37-40_RolePermissionManager.md](02_Tasks-37-40_RolePermissionManager.md)

---

## Document Overview

This document covers the creation of the RolePermission junction model that links Role and Permission models. This model serves as the many-to-many relationship table with additional audit fields to track when and by whom permissions were granted.

### Tasks in This Document
| Task # | Task Name | Complexity |
|--------|-----------|------------|
| 31 | Create RolePermission Model Class | Medium |
| 32 | Add role ForeignKey | Simple |
| 33 | Add permission ForeignKey | Simple |
| 34 | Add granted_at DateTimeField | Simple |
| 35 | Add granted_by ForeignKey | Simple |
| 36 | Create Unique Constraint | Simple |

---

## Task 31: Create RolePermission Model Class

### Overview
Create the RolePermission junction model that connects Role and Permission models, enabling flexible role-based permission assignment.

### Dependencies
- Group A: Role Model (Tasks 11-18)
- Group B: Permission Model (Tasks 21-28)
- Core Models: BaseModel with tenant support

### Instructions

1. **Create the model file**
   - Create file `role_permission.py` in `backend/apps/users/models/`
   - Import necessary dependencies

2. **Import required modules**
   ```python
   from django.db import models
   from django.conf import settings
   from backend.apps.core.models.base import BaseModel
   ```

3. **Define RolePermission model class**
   - Inherit from BaseModel for tenant support and audit fields
   - Name: `RolePermission`
   - Purpose: Junction table for Role-Permission many-to-many

4. **Add docstring**
   - Explain the junction table purpose
   - Mention role-permission relationship
   - Note audit field tracking

5. **Prepare for fields (Tasks 32-35)**
   - Leave space for role ForeignKey
   - Leave space for permission ForeignKey
   - Leave space for granted_at DateTimeField
   - Leave space for granted_by ForeignKey

6. **Add Meta class placeholder**
   - Prepare for unique_together constraint (Task 36)
   - Set appropriate database table name
   - Add ordering preferences

7. **Add __str__ method**
   - Return format: "{role.name} → {permission.codename}"
   - Clearly shows the relationship

8. **Add __repr__ method**
   - Return detailed representation
   - Include role, permission, and granted info

### Model Structure

| Component | Purpose |
|-----------|---------|
| **BaseModel** | Provides tenant support and audit fields |
| **role** | Links to Role model (Task 32) |
| **permission** | Links to Permission model (Task 33) |
| **granted_at** | Timestamp when assigned (Task 34) |
| **granted_by** | User who assigned permission (Task 35) |
| **Meta** | Database constraints (Task 36) |

### Junction Table Concept
```
Role (1) ←─── RolePermission (M) ───→ (N) Permission
             ↓
             Audit: granted_at, granted_by
```

### Expected Outcome
```python
# backend/apps/users/models/role_permission.py

from django.db import models
from django.conf import settings
from backend.apps.core.models.base import BaseModel


class RolePermission(BaseModel):
    """
    Junction model connecting Role and Permission models.
    
    This model creates a many-to-many relationship between roles
    and permissions with additional audit fields to track when
    and by whom permissions were granted to roles.
    
    Attributes:
        role: The role receiving the permission
        permission: The permission being granted
        granted_at: Timestamp when permission was assigned
        granted_by: User who assigned the permission
    """
    
    # Fields will be added in Tasks 32-35
    
    class Meta:
        db_table = 'users_role_permissions'
        ordering = ['role', 'permission']
        verbose_name = 'Role Permission'
        verbose_name_plural = 'Role Permissions'
        # unique_together will be added in Task 36
    
    def __str__(self):
        return f"{self.role.name} → {self.permission.codename}"
    
    def __repr__(self):
        return (
            f"<RolePermission: {self.role.name} → "
            f"{self.permission.codename} "
            f"(granted: {self.granted_at})>"
        )
```

### Verification Checklist
- [ ] `role_permission.py` file created in `backend/apps/users/models/`
- [ ] RolePermission class inherits from BaseModel
- [ ] Comprehensive docstring included
- [ ] Meta class with db_table and ordering defined
- [ ] `__str__` method returns readable relationship
- [ ] `__repr__` method provides detailed info
- [ ] Ready for field additions (Tasks 32-35)

---

## Task 32: Add role ForeignKey

### Overview
Add the role ForeignKey field that links the RolePermission to a specific Role.

### Dependencies
- Task 31: Create RolePermission Model Class
- Group A: Role Model exists

### Instructions

1. **Add role ForeignKey field**
   - Field name: `role`
   - Type: `models.ForeignKey`
   - Link to: `'users.Role'` (string reference for circular imports)
   - on_delete: `models.CASCADE` (remove assignments when role deleted)

2. **Configure relationship**
   - related_name: `'role_permissions'`
   - Allows reverse lookup: `role.role_permissions.all()`

3. **Add help text**
   - Describe: "The role that is granted this permission"

4. **Add database index**
   - db_index: `True`
   - Improves query performance for role lookups

5. **Add validation**
   - Ensure role belongs to same tenant (validated by BaseModel)

### Field Configuration

| Property | Value | Purpose |
|----------|-------|---------|
| to | `'users.Role'` | Link to Role model |
| on_delete | CASCADE | Delete assignments with role |
| related_name | `role_permissions` | Reverse relationship name |
| db_index | True | Query optimization |
| help_text | Role receiving permission | Field documentation |

### Relationship Flow
```
Role.role_permissions.all()
    ↓
[RolePermission, RolePermission, ...]
    ↓
Each links to a Permission
```

### Expected Outcome
```python
class RolePermission(BaseModel):
    """
    Junction model connecting Role and Permission models.
    ...
    """
    
    role = models.ForeignKey(
        'users.Role',
        on_delete=models.CASCADE,
        related_name='role_permissions',
        db_index=True,
        help_text='The role that is granted this permission'
    )
    
    # Other fields...
```

### Verification Checklist
- [ ] role ForeignKey field added
- [ ] Links to 'users.Role' model
- [ ] on_delete set to CASCADE
- [ ] related_name set to 'role_permissions'
- [ ] db_index enabled for performance
- [ ] help_text provided
- [ ] Field properly indented in model

---

## Task 33: Add permission ForeignKey

### Overview
Add the permission ForeignKey field that links the RolePermission to a specific Permission.

### Dependencies
- Task 31: Create RolePermission Model Class
- Group B: Permission Model exists

### Instructions

1. **Add permission ForeignKey field**
   - Field name: `permission`
   - Type: `models.ForeignKey`
   - Link to: `'users.Permission'` (string reference)
   - on_delete: `models.CASCADE` (remove assignments when permission deleted)

2. **Configure relationship**
   - related_name: `'permission_roles'`
   - Allows reverse lookup: `permission.permission_roles.all()`

3. **Add help text**
   - Describe: "The permission being granted to the role"

4. **Add database index**
   - db_index: `True`
   - Improves query performance for permission lookups

5. **Add validation**
   - Ensure permission scope aligns with role level
   - System-level permissions only for system roles

### Field Configuration

| Property | Value | Purpose |
|----------|-------|---------|
| to | `'users.Permission'` | Link to Permission model |
| on_delete | CASCADE | Delete assignments with permission |
| related_name | `permission_roles` | Reverse relationship name |
| db_index | True | Query optimization |
| help_text | Permission being granted | Field documentation |

### Relationship Flow
```
Permission.permission_roles.all()
    ↓
[RolePermission, RolePermission, ...]
    ↓
Each links to a Role
```

### Expected Outcome
```python
class RolePermission(BaseModel):
    """
    Junction model connecting Role and Permission models.
    ...
    """
    
    role = models.ForeignKey(
        'users.Role',
        on_delete=models.CASCADE,
        related_name='role_permissions',
        db_index=True,
        help_text='The role that is granted this permission'
    )
    
    permission = models.ForeignKey(
        'users.Permission',
        on_delete=models.CASCADE,
        related_name='permission_roles',
        db_index=True,
        help_text='The permission being granted to the role'
    )
    
    # Other fields...
```

### Verification Checklist
- [ ] permission ForeignKey field added
- [ ] Links to 'users.Permission' model
- [ ] on_delete set to CASCADE
- [ ] related_name set to 'permission_roles'
- [ ] db_index enabled for performance
- [ ] help_text provided
- [ ] Field properly positioned after role field

---

## Task 34: Add granted_at DateTimeField

### Overview
Add the granted_at timestamp field to track when a permission was assigned to a role.

### Dependencies
- Task 31: Create RolePermission Model Class

### Instructions

1. **Add granted_at DateTimeField**
   - Field name: `granted_at`
   - Type: `models.DateTimeField`
   - Automatically set when created: `auto_now_add=True`

2. **Configure field properties**
   - auto_now_add: `True` (set once on creation)
   - editable: `False` (cannot be modified after creation)
   - help_text: Explain timestamp purpose

3. **Add database index**
   - db_index: `True`
   - Enable time-based queries and auditing

4. **Document usage**
   - Used for audit logs
   - Used for temporal queries (permissions granted after date X)
   - Used for compliance reporting

### Field Configuration

| Property | Value | Purpose |
|----------|-------|---------|
| Type | DateTimeField | Store timestamp |
| auto_now_add | True | Set on creation |
| editable | False | Immutable after creation |
| db_index | True | Time-based queries |
| help_text | When permission granted | Documentation |

### Audit Trail Usage
```python
# Find all permissions granted today
today_assignments = RolePermission.objects.filter(
    granted_at__date=timezone.now().date()
)

# Find permissions granted in last 30 days
recent = RolePermission.objects.filter(
    granted_at__gte=timezone.now() - timedelta(days=30)
)
```

### Expected Outcome
```python
class RolePermission(BaseModel):
    """
    Junction model connecting Role and Permission models.
    ...
    """
    
    role = models.ForeignKey(
        'users.Role',
        on_delete=models.CASCADE,
        related_name='role_permissions',
        db_index=True,
        help_text='The role that is granted this permission'
    )
    
    permission = models.ForeignKey(
        'users.Permission',
        on_delete=models.CASCADE,
        related_name='permission_roles',
        db_index=True,
        help_text='The permission being granted to the role'
    )
    
    granted_at = models.DateTimeField(
        auto_now_add=True,
        editable=False,
        db_index=True,
        help_text='Timestamp when the permission was granted to the role'
    )
    
    # Other fields...
```

### Verification Checklist
- [ ] granted_at DateTimeField added
- [ ] auto_now_add set to True
- [ ] editable set to False
- [ ] db_index enabled
- [ ] help_text provided
- [ ] Field positioned after permission field

---

## Task 35: Add granted_by ForeignKey

### Overview
Add the granted_by ForeignKey field to track which user assigned the permission to the role.

### Dependencies
- Task 31: Create RolePermission Model Class
- User model exists (from Django or custom User model)

### Instructions

1. **Add granted_by ForeignKey field**
   - Field name: `granted_by`
   - Type: `models.ForeignKey`
   - Link to: `settings.AUTH_USER_MODEL` (dynamic user model reference)
   - Allow NULL: `null=True, blank=True` (system assignments may not have user)

2. **Configure relationship**
   - on_delete: `models.SET_NULL` (preserve record even if user deleted)
   - related_name: `'granted_role_permissions'`

3. **Add help text**
   - Describe: "User who granted this permission to the role"

4. **Add database index**
   - db_index: `True`
   - Enable queries by granting user

5. **Handle NULL cases**
   - NULL means system-assigned (migrations, fixtures)
   - NULL means automated assignment (default roles)

### Field Configuration

| Property | Value | Purpose |
|----------|-------|---------|
| to | `settings.AUTH_USER_MODEL` | Link to User model |
| on_delete | SET_NULL | Preserve record |
| null/blank | True | Allow system assignments |
| related_name | `granted_role_permissions` | Reverse lookup |
| db_index | True | Query optimization |
| help_text | User who granted | Documentation |

### Usage Scenarios

| Scenario | granted_by Value |
|----------|------------------|
| Admin assigns permission via UI | User object (admin) |
| Migration creates defaults | NULL (system) |
| API endpoint assigns | User object (API user) |
| Bulk assignment script | NULL or service account |

### Relationship Flow
```
User.granted_role_permissions.all()
    ↓
[RolePermission, RolePermission, ...]
    ↓
Permissions this user assigned to roles
```

### Expected Outcome
```python
class RolePermission(BaseModel):
    """
    Junction model connecting Role and Permission models.
    ...
    """
    
    role = models.ForeignKey(
        'users.Role',
        on_delete=models.CASCADE,
        related_name='role_permissions',
        db_index=True,
        help_text='The role that is granted this permission'
    )
    
    permission = models.ForeignKey(
        'users.Permission',
        on_delete=models.CASCADE,
        related_name='permission_roles',
        db_index=True,
        help_text='The permission being granted to the role'
    )
    
    granted_at = models.DateTimeField(
        auto_now_add=True,
        editable=False,
        db_index=True,
        help_text='Timestamp when the permission was granted to the role'
    )
    
    granted_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='granted_role_permissions',
        db_index=True,
        help_text='User who granted this permission to the role (NULL for system assignments)'
    )
    
    # Meta class...
```

### Verification Checklist
- [ ] granted_by ForeignKey added
- [ ] Links to settings.AUTH_USER_MODEL
- [ ] on_delete set to SET_NULL
- [ ] null and blank set to True
- [ ] related_name set to 'granted_role_permissions'
- [ ] db_index enabled
- [ ] help_text provided

---

## Task 36: Create Unique Constraint

### Overview
Add a unique_together constraint to ensure each role-permission pair is assigned only once, preventing duplicate assignments.

### Dependencies
- Task 32: Add role ForeignKey
- Task 33: Add permission ForeignKey

### Instructions

1. **Update Meta class**
   - Add unique_together constraint
   - Combine role and permission fields

2. **Define unique_together**
   - Fields: `['role', 'permission']`
   - Ensures no duplicate role-permission pairs

3. **Add database constraint name**
   - constraint_name (optional): `'unique_role_permission'`
   - Makes database constraint identifiable

4. **Add index for constraint**
   - unique_together automatically creates index
   - Improves query performance for lookups

5. **Update model docstring**
   - Document the unique constraint
   - Explain prevention of duplicates

6. **Add validation in save method (optional)**
   - Add custom validation if needed
   - Raise ValidationError for duplicates

### Constraint Configuration

| Constraint | Fields | Purpose |
|------------|--------|---------|
| unique_together | role, permission | Prevent duplicates |
| Database index | Automatic | Query optimization |

### Duplicate Prevention
```python
# This will work (first assignment)
RolePermission.objects.create(
    role=admin_role,
    permission=read_perm
)

# This will raise IntegrityError (duplicate)
RolePermission.objects.create(
    role=admin_role,
    permission=read_perm  # Same role-permission pair
)
```

### Database Behavior
```sql
-- PostgreSQL creates unique index automatically
CREATE UNIQUE INDEX unique_role_permission 
ON users_role_permissions (role_id, permission_id);
```

### Expected Outcome
```python
class RolePermission(BaseModel):
    """
    Junction model connecting Role and Permission models.
    
    This model creates a many-to-many relationship between roles
    and permissions with additional audit fields to track when
    and by whom permissions were granted to roles.
    
    The unique_together constraint ensures each role-permission
    pair can only be assigned once, preventing duplicate assignments.
    
    Attributes:
        role: The role receiving the permission
        permission: The permission being granted
        granted_at: Timestamp when permission was assigned
        granted_by: User who assigned the permission
    """
    
    role = models.ForeignKey(
        'users.Role',
        on_delete=models.CASCADE,
        related_name='role_permissions',
        db_index=True,
        help_text='The role that is granted this permission'
    )
    
    permission = models.ForeignKey(
        'users.Permission',
        on_delete=models.CASCADE,
        related_name='permission_roles',
        db_index=True,
        help_text='The permission being granted to the role'
    )
    
    granted_at = models.DateTimeField(
        auto_now_add=True,
        editable=False,
        db_index=True,
        help_text='Timestamp when the permission was granted to the role'
    )
    
    granted_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='granted_role_permissions',
        db_index=True,
        help_text='User who granted this permission to the role (NULL for system assignments)'
    )
    
    class Meta:
        db_table = 'users_role_permissions'
        ordering = ['role', 'permission']
        verbose_name = 'Role Permission'
        verbose_name_plural = 'Role Permissions'
        unique_together = [['role', 'permission']]
        indexes = [
            models.Index(fields=['role', 'permission'], name='idx_role_perm'),
        ]
    
    def __str__(self):
        return f"{self.role.name} → {self.permission.codename}"
    
    def __repr__(self):
        return (
            f"<RolePermission: {self.role.name} → "
            f"{self.permission.codename} "
            f"(granted: {self.granted_at})>"
        )
```

### Verification Checklist
- [ ] unique_together constraint added to Meta class
- [ ] Combines role and permission fields
- [ ] Docstring updated to mention constraint
- [ ] Model complete with all fields and constraints
- [ ] __str__ and __repr__ methods work correctly
- [ ] Ready for migration creation

---

## Complete Model Code

### Full Implementation
```python
# backend/apps/users/models/role_permission.py

"""
RolePermission model for managing role-permission assignments.

This module defines the junction model that connects Role and Permission
models in a many-to-many relationship with additional audit tracking.
"""

from django.db import models
from django.conf import settings
from backend.apps.core.models.base import BaseModel


class RolePermission(BaseModel):
    """
    Junction model connecting Role and Permission models.
    
    This model creates a many-to-many relationship between roles
    and permissions with additional audit fields to track when
    and by whom permissions were granted to roles.
    
    The unique_together constraint ensures each role-permission
    pair can only be assigned once, preventing duplicate assignments.
    
    Attributes:
        role: The role receiving the permission
        permission: The permission being granted
        granted_at: Timestamp when permission was assigned
        granted_by: User who assigned the permission
    
    Example:
        >>> admin_role = Role.objects.get(name='Admin')
        >>> read_perm = Permission.objects.get(codename='inventory.read')
        >>> assignment = RolePermission.objects.create(
        ...     role=admin_role,
        ...     permission=read_perm,
        ...     granted_by=request.user
        ... )
    """
    
    role = models.ForeignKey(
        'users.Role',
        on_delete=models.CASCADE,
        related_name='role_permissions',
        db_index=True,
        help_text='The role that is granted this permission'
    )
    
    permission = models.ForeignKey(
        'users.Permission',
        on_delete=models.CASCADE,
        related_name='permission_roles',
        db_index=True,
        help_text='The permission being granted to the role'
    )
    
    granted_at = models.DateTimeField(
        auto_now_add=True,
        editable=False,
        db_index=True,
        help_text='Timestamp when the permission was granted to the role'
    )
    
    granted_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='granted_role_permissions',
        db_index=True,
        help_text='User who granted this permission to the role (NULL for system assignments)'
    )
    
    class Meta:
        db_table = 'users_role_permissions'
        ordering = ['role', 'permission']
        verbose_name = 'Role Permission'
        verbose_name_plural = 'Role Permissions'
        unique_together = [['role', 'permission']]
        indexes = [
            models.Index(fields=['role', 'permission'], name='idx_role_perm'),
            models.Index(fields=['granted_at'], name='idx_granted_at'),
        ]
    
    def __str__(self):
        return f"{self.role.name} → {self.permission.codename}"
    
    def __repr__(self):
        granted_by_name = self.granted_by.username if self.granted_by else 'System'
        return (
            f"<RolePermission: {self.role.name} → "
            f"{self.permission.codename} "
            f"(granted by: {granted_by_name}, at: {self.granted_at})>"
        )
    
    def clean(self):
        """Validate role-permission assignment."""
        from django.core.exceptions import ValidationError
        
        # Ensure permission scope matches role level
        if self.permission.scope == 'system' and self.role.level != 'super_admin':
            raise ValidationError(
                'System-scoped permissions can only be assigned to Super Admin roles'
            )
```

### File Location
```
backend/apps/users/models/
├── __init__.py
├── role.py
├── permission.py
└── role_permission.py         # This file (Tasks 31-36)
```

### Update __init__.py
```python
# backend/apps/users/models/__init__.py

from .role import Role
from .permission import Permission
from .role_permission import RolePermission

__all__ = [
    'Role',
    'Permission',
    'RolePermission',
]
```

---

## Testing Guidelines

### Unit Tests
```python
# backend/apps/users/tests/test_role_permission.py

from django.test import TestCase
from django.db import IntegrityError
from backend.apps.users.models import Role, Permission, RolePermission


class RolePermissionModelTest(TestCase):
    
    def setUp(self):
        """Create test role and permissions."""
        self.role = Role.objects.create(
            name='Test Manager',
            level='manager'
        )
        self.permission1 = Permission.objects.create(
            codename='inventory.read',
            name='Read Inventory',
            scope='tenant'
        )
        self.permission2 = Permission.objects.create(
            codename='inventory.write',
            name='Write Inventory',
            scope='tenant'
        )
    
    def test_role_permission_creation(self):
        """Test creating role-permission assignment."""
        rp = RolePermission.objects.create(
            role=self.role,
            permission=self.permission1
        )
        self.assertEqual(str(rp), 'Test Manager → inventory.read')
        self.assertIsNotNone(rp.granted_at)
    
    def test_unique_constraint(self):
        """Test unique_together constraint prevents duplicates."""
        RolePermission.objects.create(
            role=self.role,
            permission=self.permission1
        )
        
        with self.assertRaises(IntegrityError):
            RolePermission.objects.create(
                role=self.role,
                permission=self.permission1  # Duplicate
            )
    
    def test_cascade_delete_role(self):
        """Test CASCADE delete when role is deleted."""
        rp = RolePermission.objects.create(
            role=self.role,
            permission=self.permission1
        )
        rp_id = rp.id
        
        self.role.delete()
        
        self.assertFalse(
            RolePermission.objects.filter(id=rp_id).exists()
        )
    
    def test_cascade_delete_permission(self):
        """Test CASCADE delete when permission is deleted."""
        rp = RolePermission.objects.create(
            role=self.role,
            permission=self.permission1
        )
        rp_id = rp.id
        
        self.permission1.delete()
        
        self.assertFalse(
            RolePermission.objects.filter(id=rp_id).exists()
        )
```

---

## Migration Notes

### Create Migration
```bash
# Generate migration for RolePermission model
python manage.py makemigrations users --name create_role_permission_model

# Review migration file
cat backend/apps/users/migrations/XXXX_create_role_permission_model.py

# Apply migration
python manage.py migrate users
```

### Expected Migration Structure
```python
# backend/apps/users/migrations/XXXX_create_role_permission_model.py

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):
    
    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('users', 'XXXX_create_permission_model'),
    ]
    
    operations = [
        migrations.CreateModel(
            name='RolePermission',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('granted_at', models.DateTimeField(auto_now_add=True, db_index=True, editable=False)),
                ('permission', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='permission_roles', to='users.permission')),
                ('role', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='role_permissions', to='users.role')),
                ('granted_by', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='granted_role_permissions', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'verbose_name': 'Role Permission',
                'verbose_name_plural': 'Role Permissions',
                'db_table': 'users_role_permissions',
                'ordering': ['role', 'permission'],
                'unique_together': {('role', 'permission')},
            },
        ),
    ]
```

---

## Next Steps

After completing Tasks 31-36 (RolePermission Model), proceed to:

1. **Tasks 37-40:** RolePermissionManager
   - Create custom manager class
   - Add assign_permission() method
   - Add revoke_permission() method
   - Add has_permission() method

2. **Tasks 41-46:** Default Permission Assignments
   - Assign Super Admin permissions (all)
   - Assign Tenant Admin permissions
   - Assign Manager permissions
   - Assign Staff permissions
   - Assign Customer permissions
   - Document role-permission mappings

---

## Related Documentation

- **Previous Group:** [Group B - Permission Model](../Group-B_Permission-Model/)
- **Next Document:** [02_Tasks-37-40_RolePermissionManager.md](02_Tasks-37-40_RolePermissionManager.md)
- **Role Model:** [Group A - Role Model](../Group-A_Role-Model-Foundation/)
- **SubPhase Summary:** [00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)

---

## Summary

This document covered the creation of the RolePermission junction model (Tasks 31-36):

✅ **Task 31:** Created RolePermission model class with proper inheritance  
✅ **Task 32:** Added role ForeignKey linking to Role model  
✅ **Task 33:** Added permission ForeignKey linking to Permission model  
✅ **Task 34:** Added granted_at DateTimeField for audit tracking  
✅ **Task 35:** Added granted_by ForeignKey for user tracking  
✅ **Task 36:** Created unique_together constraint on role-permission pair  

The RolePermission model is now ready to serve as the junction table for role-permission assignments, with full audit trail support and duplicate prevention.
