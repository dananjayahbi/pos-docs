# Tasks 11-12: RoleManager & Meta

> **Phase:** 03 - Core Backend Infrastructure  
> **SubPhase:** 05 - Role & Permission System  
> **Group:** A - Role Model Foundation  
> **Document:** 03 of 04  
> **Tasks Covered:** 11, 12

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [02_Tasks-03-10_Role-Model-Definition.md](02_Tasks-03-10_Role-Model-Definition.md)
- **→ Next Document:** [04_Tasks-13-14_Default-Roles-Migration.md](04_Tasks-13-14_Default-Roles-Migration.md)

---

## Document Overview

This document covers the creation of the custom RoleManager and the Meta class configuration for the Role model. These components provide custom query methods and database-level constraints.

### Tasks in This Document
| Task # | Task Name | Complexity |
|--------|-----------|------------|
| 11 | Create RoleManager | Medium |
| 12 | Add Meta class | Medium |

---

## Task 11: Create RoleManager

### Overview
Create a custom manager for the Role model that provides convenient query methods for common role operations, hierarchy queries, and tenant-scoped lookups.

### Dependencies
- Tasks 03-10: Role Model Fields defined

### Instructions

1. **Define RoleManager class**
   - Create class `RoleManager` extending `models.Manager`
   - Place before the Role model class definition
   - Add class docstring

2. **Add get_system_roles method**
   - Return QuerySet of system roles (is_system_role=True)
   - Accept optional tenant parameter
   - Filter by tenant if provided

3. **Add get_custom_roles method**
   - Return QuerySet of user-created roles (is_system_role=False)
   - Require tenant parameter
   - Filter by tenant

4. **Add get_by_level method**
   - Accept hierarchy_level parameter
   - Return roles at specified level
   - Accept optional tenant parameter

5. **Add get_hierarchical_roles method**
   - Accept role parameter
   - Return all roles at same or lower hierarchy level
   - Used for permission inheritance queries

6. **Add get_available_parents method**
   - Accept current_role parameter
   - Return roles that can be parent (lower hierarchy_level)
   - Filter by tenant
   - Exclude self to prevent circular reference

7. **Add get_or_create_default method**
   - Accept role_name and tenant parameters
   - Get existing role or create with defaults
   - Used during tenant provisioning

### RoleManager Class Structure

```python
# Structure for RoleManager class

class RoleManager(models.Manager):
    """
    Custom manager for Role model.
    
    Provides methods for:
    - Querying system vs custom roles
    - Hierarchy-based filtering
    - Tenant-scoped queries
    - Parent role selection
    """
    
    def get_system_roles(self, tenant=None):
        """
        Get all system-defined roles.
        
        Args:
            tenant: Optional tenant to filter by
            
        Returns:
            QuerySet of system roles
        """
        queryset = self.filter(is_system_role=True)
        if tenant:
            queryset = queryset.filter(tenant=tenant)
        return queryset
    
    def get_custom_roles(self, tenant):
        """
        Get user-created roles for a tenant.
        
        Args:
            tenant: Tenant instance
            
        Returns:
            QuerySet of custom roles
        """
        return self.filter(
            is_system_role=False,
            tenant=tenant
        )
    
    def get_by_level(self, hierarchy_level, tenant=None):
        """
        Get roles at specific hierarchy level.
        
        Args:
            hierarchy_level: Integer 0-4
            tenant: Optional tenant to filter by
            
        Returns:
            QuerySet of roles at specified level
        """
        queryset = self.filter(hierarchy_level=hierarchy_level)
        if tenant:
            queryset = queryset.filter(tenant=tenant)
        return queryset
    
    def get_hierarchical_roles(self, role):
        """
        Get all roles at same or lower hierarchy level.
        
        Args:
            role: Role instance
            
        Returns:
            QuerySet of roles at same or lower level
        """
        return self.filter(
            hierarchy_level__gte=role.hierarchy_level,
            tenant=role.tenant
        )
    
    def get_available_parents(self, current_role):
        """
        Get roles that can be parent (higher hierarchy).
        
        Args:
            current_role: Role instance
            
        Returns:
            QuerySet of potential parent roles
        """
        queryset = self.filter(
            hierarchy_level__lt=current_role.hierarchy_level,
            tenant=current_role.tenant
        )
        if current_role.pk:
            queryset = queryset.exclude(pk=current_role.pk)
        return queryset
    
    def get_or_create_default(self, role_name, tenant, defaults=None):
        """
        Get or create a default system role.
        
        Args:
            role_name: Name of the role
            tenant: Tenant instance
            defaults: Optional dict of default values
            
        Returns:
            Tuple of (role, created)
        """
        defaults = defaults or {}
        return self.get_or_create(
            name=role_name,
            tenant=tenant,
            defaults=defaults
        )
```

### Manager Method Usage Examples

```python
# Get all system roles for a tenant
system_roles = Role.objects.get_system_roles(tenant=my_tenant)

# Get custom roles created by tenant admin
custom_roles = Role.objects.get_custom_roles(tenant=my_tenant)

# Get all Manager-level roles
managers = Role.objects.get_by_level(hierarchy_level=2, tenant=my_tenant)

# Get roles that a Manager can assign (same or lower level)
assignable_roles = Role.objects.get_hierarchical_roles(manager_role)

# Get roles that can be parent of Staff role
parent_options = Role.objects.get_available_parents(staff_role)

# Get or create Tenant Admin during provisioning
admin_role, created = Role.objects.get_or_create_default(
    role_name='Tenant Admin',
    tenant=new_tenant,
    defaults={'hierarchy_level': 1, 'is_system_role': True}
)
```

### Method Design Patterns
| Method | Pattern | Purpose |
|--------|---------|---------|
| **get_system_roles** | Filter query | System role management |
| **get_custom_roles** | Filter query | User role management |
| **get_by_level** | Filter query | Hierarchy queries |
| **get_hierarchical_roles** | Range query | Permission checks |
| **get_available_parents** | Exclusion query | Parent selection |
| **get_or_create_default** | Get or create | Tenant provisioning |

### Expected Outcome
- RoleManager class defined with 6+ methods
- Methods support common role queries
- Hierarchy-aware filtering
- Tenant-scoped operations
- Ready for use in views and services

### Verification Checklist
- [ ] RoleManager class extends models.Manager
- [ ] get_system_roles method implemented
- [ ] get_custom_roles method implemented
- [ ] get_by_level method implemented
- [ ] get_hierarchical_roles method implemented
- [ ] get_available_parents method implemented
- [ ] get_or_create_default method implemented
- [ ] All methods have docstrings
- [ ] Methods handle optional tenant parameter

---

## Task 12: Add Meta class

### Overview
Add the Meta class to the Role model to configure database table name, ordering, indexes, and constraints including the unique_together constraint.

### Dependencies
- Tasks 03-10: Role Model Fields defined
- Task 11: RoleManager created

### Instructions

1. **Add objects manager assignment**
   - Before Meta class, assign custom manager
   - `objects = RoleManager()`

2. **Create Meta class**
   - Define `class Meta:` inside Role model
   - Add at end of model definition

3. **Set database table name**
   - Set `db_table = 'roles'`
   - Or use app prefix: `db_table = 'users_roles'`

4. **Set verbose names**
   - Set `verbose_name = 'Role'`
   - Set `verbose_name_plural = 'Roles'`

5. **Set default ordering**
   - Order by hierarchy_level (ascending)
   - Then by name (alphabetically)
   - `ordering = ['hierarchy_level', 'name']`

6. **Add unique_together constraint**
   - Ensure role name unique per tenant
   - `unique_together = [['name', 'tenant']]`

7. **Add indexes**
   - Composite index for tenant + hierarchy_level queries
   - Composite index for tenant + is_system_role queries
   - Use `indexes` list

8. **Add permissions**
   - Define custom Django permissions
   - manage_system_roles, assign_roles, etc.

### Meta Class Structure

```python
# Structure for Meta class and manager assignment

class Role(BaseModel):
    """Role model fields here"""
    
    # Field definitions (from previous tasks)
    name = models.CharField(...)
    slug = models.SlugField(...)
    # ... other fields ...
    
    # Custom manager
    objects = RoleManager()
    
    class Meta:
        db_table = 'roles'
        verbose_name = 'Role'
        verbose_name_plural = 'Roles'
        ordering = ['hierarchy_level', 'name']
        
        unique_together = [
            ['name', 'tenant'],
        ]
        
        indexes = [
            models.Index(
                fields=['tenant', 'hierarchy_level'],
                name='role_tenant_level_idx'
            ),
            models.Index(
                fields=['tenant', 'is_system_role'],
                name='role_tenant_system_idx'
            ),
            models.Index(
                fields=['tenant', 'slug'],
                name='role_tenant_slug_idx'
            ),
        ]
        
        permissions = [
            ('manage_system_roles', 'Can manage system roles'),
            ('assign_roles', 'Can assign roles to users'),
            ('create_custom_roles', 'Can create custom roles'),
        ]
```

### Meta Configuration Details

| Setting | Value | Purpose |
|---------|-------|---------|
| **db_table** | 'roles' | Database table name |
| **verbose_name** | 'Role' | Singular display name |
| **verbose_name_plural** | 'Roles' | Plural display name |
| **ordering** | ['hierarchy_level', 'name'] | Default query order |
| **unique_together** | [['name', 'tenant']] | Name unique per tenant |

### Index Strategy

| Index Name | Fields | Query Pattern |
|-----------|--------|---------------|
| **role_tenant_level_idx** | tenant + hierarchy_level | Get roles by level for tenant |
| **role_tenant_system_idx** | tenant + is_system_role | Filter system/custom roles |
| **role_tenant_slug_idx** | tenant + slug | Lookup by slug per tenant |

### Custom Permissions

```python
# Custom permission usage examples

# Check if user can manage system roles
if user.has_perm('users.manage_system_roles'):
    # Allow system role management
    pass

# Check if user can assign roles
if user.has_perm('users.assign_roles'):
    # Allow role assignment to other users
    pass

# Check if user can create custom roles
if user.has_perm('users.create_custom_roles'):
    # Allow custom role creation
    pass
```

### Unique Together Constraint

The `unique_together` constraint ensures:
- Role names are unique within each tenant
- Same role name can exist in different tenants
- Super Admin (tenant=null) is globally unique

```python
# Constraint behavior examples

# Valid: Same name, different tenants
tenant1_manager = Role(name='Manager', tenant=tenant1)  # OK
tenant2_manager = Role(name='Manager', tenant=tenant2)  # OK

# Invalid: Same name, same tenant
Role(name='Manager', tenant=tenant1)  # OK
Role(name='Manager', tenant=tenant1)  # Error: Duplicate

# Super Admin: Only one with tenant=null
Role(name='Super Admin', tenant=None)  # OK
Role(name='Super Admin', tenant=None)  # Error: Duplicate
```

### Expected Outcome
- Objects manager using RoleManager
- Meta class with all configurations
- Unique constraint on name + tenant
- Composite indexes for performance
- Custom permissions defined
- Default ordering by hierarchy

### Verification Checklist
- [ ] objects = RoleManager() assigned
- [ ] Meta class defined inside Role model
- [ ] db_table set to appropriate name
- [ ] verbose_name and verbose_name_plural set
- [ ] ordering = ['hierarchy_level', 'name']
- [ ] unique_together = [['name', 'tenant']]
- [ ] At least 2-3 composite indexes defined
- [ ] Custom permissions defined
- [ ] Index names follow naming convention

---

## Additional Model Methods

### Overview
After Meta class, add utility methods to the Role model for common operations.

### Recommended Methods

```python
def __str__(self):
    """String representation of role."""
    if self.tenant:
        return f"{self.name} ({self.tenant.name})"
    return self.name

def save(self, *args, **kwargs):
    """Override save to auto-generate slug."""
    if not self.slug:
        self.slug = slugify(self.name)
    super().save(*args, **kwargs)

def clean(self):
    """Validate role constraints."""
    from django.core.exceptions import ValidationError
    
    # Super Admin must have null tenant
    if self.hierarchy_level == 0 and self.tenant is not None:
        raise ValidationError(
            "Super Admin must have null tenant for platform-wide access"
        )
    
    # Other roles must have tenant
    if self.hierarchy_level > 0 and self.tenant is None:
        raise ValidationError(
            "Only Super Admin (level 0) can have null tenant"
        )
    
    super().clean()

def delete(self, *args, **kwargs):
    """Prevent deletion of system roles."""
    if self.is_system_role:
        raise ValidationError(
            "System roles cannot be deleted"
        )
    super().delete(*args, **kwargs)

def get_inherited_permissions(self):
    """Get all permissions including inherited from parent."""
    permissions = set(self.permissions.all())
    
    if self.parent:
        permissions.update(
            self.parent.get_inherited_permissions()
        )
    
    return permissions

@property
def is_super_admin(self):
    """Check if this is Super Admin role."""
    return self.hierarchy_level == 0

@property
def is_tenant_admin(self):
    """Check if this is Tenant Admin role."""
    return self.hierarchy_level == 1

def can_be_assigned_by(self, user_role):
    """Check if this role can be assigned by another role."""
    return user_role.hierarchy_level < self.hierarchy_level
```

### Method Categories
| Category | Methods | Purpose |
|----------|---------|---------|
| **Representation** | `__str__` | Display in admin/logs |
| **Lifecycle** | save, clean, delete | Validation and constraints |
| **Permissions** | get_inherited_permissions | Permission queries |
| **Properties** | is_super_admin, is_tenant_admin | Quick checks |
| **Authorization** | can_be_assigned_by | Role assignment rules |

---

## Group A Next Steps

After completing Tasks 11-12, proceed to:
- **Next Document:** [04_Tasks-13-14_Default-Roles-Migration.md](04_Tasks-13-14_Default-Roles-Migration.md)
- Create data migration for default system roles
- Document the Role model
- Test role creation and constraints

---

## Notes for AI Agents

1. **Manager Placement:** Define RoleManager before Role model class
2. **Manager Assignment:** Use `objects = RoleManager()` inside model
3. **Meta Placement:** Meta class goes at end of model definition
4. **Index Naming:** Use descriptive names with _idx suffix
5. **Unique Together:** List of lists to allow multiple constraints
6. **Permissions:** Use Django's permission system for authorization
7. **Ordering:** Hierarchy level first ensures admin roles listed first
8. **Custom Methods:** Add after Meta class for better organization
9. **Slug Generation:** Auto-generate in save() to prevent duplicates
10. **Validation:** Use clean() for complex business logic validation
