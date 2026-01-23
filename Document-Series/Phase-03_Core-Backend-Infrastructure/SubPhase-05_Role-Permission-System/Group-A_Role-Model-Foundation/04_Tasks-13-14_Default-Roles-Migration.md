# Tasks 13-14: Default Roles Migration

> **Phase:** 03 - Core Backend Infrastructure  
> **SubPhase:** 05 - Role & Permission System  
> **Group:** A - Role Model Foundation  
> **Document:** 04 of 04  
> **Tasks Covered:** 13, 14

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [03_Tasks-11-12_RoleManager-Meta.md](03_Tasks-11-12_RoleManager-Meta.md)
- **→ Next Group:** [../Group-B_Permission-Model/](../Group-B_Permission-Model/)

---

## Document Overview

This document covers the creation of a data migration to populate default system roles and the documentation of the Role model. These tasks complete the Role model foundation.

### Tasks in This Document
| Task # | Task Name | Complexity |
|--------|-----------|------------|
| 13 | Create Default Roles Migration | Medium |
| 14 | Document Role Model | Simple |

---

## Task 13: Create Default Roles Migration

### Overview
Create a data migration that creates the five default system roles. This migration will be run after tenant provisioning to populate each tenant with standard roles.

### Dependencies
- Tasks 03-12: Complete Role model with fields and Meta
- Role model migrations applied

### Instructions

1. **Generate empty migration file**
   - Run Django command: `python manage.py makemigrations --empty users`
   - Or manually create migration file with timestamp
   - Name it appropriately (e.g., `0002_create_default_roles.py`)

2. **Import required modules**
   - Import Role model
   - Import RunPython from django.db.migrations
   - Import slugify from django.utils.text

3. **Define role data structure**
   - Create DEFAULT_ROLES list with role definitions
   - Include: name, slug, hierarchy_level, description, is_system_role

4. **Create forward migration function**
   - Function name: `create_default_roles`
   - Parameters: apps, schema_editor
   - Iterate through DEFAULT_ROLES
   - Create each role using get_or_create

5. **Create reverse migration function**
   - Function name: `remove_default_roles`
   - Parameters: apps, schema_editor
   - Delete created system roles
   - Use Role.objects.filter(is_system_role=True).delete()

6. **Define migration operations**
   - Use RunPython operation
   - Link forward and reverse functions
   - Add descriptive comments

7. **Handle Super Admin separately**
   - Super Admin has tenant=None
   - Create only once (not per tenant)
   - Other roles are tenant-scoped

### Migration File Structure

```python
# Structure for default roles data migration

from django.db import migrations
from django.utils.text import slugify

# Default role definitions
DEFAULT_ROLES = [
    {
        'name': 'Super Admin',
        'slug': 'super-admin',
        'hierarchy_level': 0,
        'description': (
            'Platform-wide administrator with full access to all tenants '
            'and system settings. Can manage tenant provisioning, system '
            'configurations, and global settings.'
        ),
        'is_system_role': True,
        'parent': None,
        'tenant': None,  # Platform-wide
    },
    {
        'name': 'Tenant Admin',
        'slug': 'tenant-admin',
        'hierarchy_level': 1,
        'description': (
            'Full administrative access within the tenant. Can manage all '
            'modules, users, roles, and tenant-specific settings.'
        ),
        'is_system_role': True,
        'parent_slug': 'super-admin',  # Will be resolved to parent instance
        # tenant will be set during tenant provisioning
    },
    {
        'name': 'Manager',
        'slug': 'manager',
        'hierarchy_level': 2,
        'description': (
            'Department or store manager with access to inventory, sales '
            'reports, and staff management within their assigned scope.'
        ),
        'is_system_role': True,
        'parent_slug': 'tenant-admin',
    },
    {
        'name': 'Staff',
        'slug': 'staff',
        'hierarchy_level': 3,
        'description': (
            'Standard user with access to daily operations like sales, '
            'inventory updates, and customer management.'
        ),
        'is_system_role': True,
        'parent_slug': 'manager',
    },
    {
        'name': 'Customer',
        'slug': 'customer',
        'hierarchy_level': 4,
        'description': (
            'External user with access to webstore features only. Can '
            'place orders, view order history, and manage their account.'
        ),
        'is_system_role': True,
        'parent_slug': 'staff',
    },
]


def create_default_roles(apps, schema_editor):
    """
    Create default system roles.
    
    Note: This creates the Super Admin role only.
    Tenant-scoped roles are created during tenant provisioning.
    """
    Role = apps.get_model('users', 'Role')
    
    # Create Super Admin (platform-wide, tenant=None)
    super_admin_data = DEFAULT_ROLES[0]
    Role.objects.get_or_create(
        slug=super_admin_data['slug'],
        tenant=None,
        defaults={
            'name': super_admin_data['name'],
            'hierarchy_level': super_admin_data['hierarchy_level'],
            'description': super_admin_data['description'],
            'is_system_role': super_admin_data['is_system_role'],
            'parent': None,
        }
    )
    
    # Note: Other roles are created per-tenant during provisioning
    # See: apps.tenants.services.provision_tenant_roles()


def remove_default_roles(apps, schema_editor):
    """
    Remove default system roles.
    
    This is the reverse operation for migration rollback.
    """
    Role = apps.get_model('users', 'Role')
    
    # Delete Super Admin
    Role.objects.filter(
        slug='super-admin',
        tenant=None
    ).delete()


class Migration(migrations.Migration):
    """Migration to create default system roles."""
    
    dependencies = [
        ('users', '0001_initial'),  # Adjust to your previous migration
    ]
    
    operations = [
        migrations.RunPython(
            create_default_roles,
            remove_default_roles
        ),
    ]
```

### Tenant Provisioning Service

The migration creates only Super Admin. Create a service function for tenant role provisioning:

```python
# File: backend/apps/users/services/role_service.py

from django.utils.text import slugify
from apps.users.models import Role

# Use DEFAULT_ROLES from migration (or define here)
TENANT_DEFAULT_ROLES = [
    {
        'name': 'Tenant Admin',
        'slug': 'tenant-admin',
        'hierarchy_level': 1,
        'description': '...',
        'is_system_role': True,
        'parent_slug': None,  # Will be Super Admin if needed
    },
    # ... other tenant roles
]


def provision_tenant_roles(tenant):
    """
    Create default roles for a new tenant.
    
    Args:
        tenant: Tenant instance
        
    Returns:
        dict: Created role instances keyed by slug
    """
    created_roles = {}
    
    # Create roles in hierarchy order
    for role_data in TENANT_DEFAULT_ROLES:
        # Resolve parent if specified
        parent = None
        if role_data.get('parent_slug'):
            parent = created_roles.get(role_data['parent_slug'])
        
        # Create or get role
        role, created = Role.objects.get_or_create(
            slug=role_data['slug'],
            tenant=tenant,
            defaults={
                'name': role_data['name'],
                'hierarchy_level': role_data['hierarchy_level'],
                'description': role_data['description'],
                'is_system_role': role_data['is_system_role'],
                'parent': parent,
            }
        )
        
        created_roles[role_data['slug']] = role
    
    return created_roles
```

### Migration Strategy

| Stage | Roles Created | Location |
|-------|---------------|----------|
| **Initial Migration** | Super Admin only | Data migration |
| **Tenant Provisioning** | Tenant Admin, Manager, Staff, Customer | Provisioning service |
| **Runtime** | Custom roles | Admin/API |

### Role Hierarchy After Migration

```
Platform Level:
    └── Super Admin (tenant=None)

Tenant Level (created per tenant):
    └── Tenant Admin
            ├── Manager
            │       └── Staff
            │               └── Customer
            └── (Custom Roles...)
```

### Expected Outcome

After running migration:
- Super Admin role exists with tenant=None
- Migration can be reversed (rollback support)
- Tenant provisioning service ready
- Role hierarchy properly established

### Verification Checklist
- [ ] Migration file created in users/migrations/
- [ ] DEFAULT_ROLES constant defined with all 5 roles
- [ ] create_default_roles function implemented
- [ ] remove_default_roles function implemented
- [ ] Super Admin created with tenant=None
- [ ] Migration dependencies set correctly
- [ ] RunPython operation configured
- [ ] Tenant provisioning service created

---

## Task 14: Document Role Model

### Overview
Create comprehensive documentation for the Role model including field descriptions, usage examples, hierarchy explanation, and API integration notes.

### Dependencies
- Tasks 01-13: Complete Role model implementation

### Instructions

1. **Create model documentation file**
   - Create file: `docs/models/role_model.md`
   - Or add to existing model documentation

2. **Add model overview section**
   - Purpose of Role model
   - RBAC system explanation
   - Multi-tenant scoping

3. **Document role hierarchy**
   - All 5 levels with descriptions
   - Hierarchy diagram
   - Permission inheritance flow

4. **Document model fields**
   - Table of all fields with types and purposes
   - Constraints and validations
   - Default values

5. **Document relationships**
   - parent (self-referential FK)
   - tenant (FK to Tenant)
   - Related models (User, Permission)

6. **Add usage examples**
   - Creating roles
   - Assigning roles to users
   - Querying roles by hierarchy
   - Permission checks

7. **Document manager methods**
   - All RoleManager methods
   - Parameters and return types
   - Usage examples

8. **Add API integration notes**
   - Endpoints for role management
   - Serialization considerations
   - Permission requirements

9. **Document migration process**
   - Initial migration
   - Tenant provisioning
   - Custom role creation

10. **Add troubleshooting section**
    - Common issues
    - Validation errors
    - Constraint violations

### Documentation File Structure

```markdown
# Role Model Documentation

## Overview

The Role model is the foundation of LankaCommerce Cloud's Role-Based Access Control (RBAC) system. It defines a hierarchical structure of user roles with 5 levels, supporting multi-tenant isolation and permission inheritance.

## Quick Reference

| Aspect | Details |
|--------|---------|
| **Model Name** | Role |
| **App** | users |
| **Table** | roles |
| **Extends** | BaseModel |
| **Multi-Tenant** | Yes (tenant FK) |

## Role Hierarchy

### Levels

| Level | Role | Scope | Description |
|-------|------|-------|-------------|
| 0 | Super Admin | Platform | Full platform access, all tenants |
| 1 | Tenant Admin | Tenant | Full tenant access, all modules |
| 2 | Manager | Department | Department/store management |
| 3 | Staff | Operations | Daily operations, basic CRUD |
| 4 | Customer | Webstore | Webstore access only |

### Hierarchy Diagram

```
Super Admin (0) [tenant=None]
    └── Tenant Admin (1) [tenant=X]
            ├── Manager (2)
            │       └── Staff (3)
            │               └── Customer (4)
            └── Custom Roles
```

## Model Fields

### Field Reference

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| name | CharField(100) | Yes | Role display name |
| slug | SlugField(100) | Auto | URL-safe identifier |
| description | TextField | No | Role description |
| is_system_role | BooleanField | Yes | System role flag |
| hierarchy_level | IntegerField | Yes | Hierarchy position (0-4) |
| parent | ForeignKey(self) | No | Parent role for inheritance |
| tenant | ForeignKey(Tenant) | Conditional | Tenant scope (null for Super Admin) |

### Inherited from BaseModel

| Field | Type | Description |
|-------|------|-------------|
| id | UUIDField | Primary key |
| created_at | DateTimeField | Creation timestamp |
| updated_at | DateTimeField | Last update timestamp |
| is_active | BooleanField | Active status |

## Constraints

### Database Constraints

| Constraint | Fields | Purpose |
|-----------|--------|---------|
| unique_together | name + tenant | Name unique per tenant |
| check | hierarchy_level 0-4 | Valid level range |

### Validation Rules

| Rule | Implementation |
|------|----------------|
| Super Admin has null tenant | clean() method |
| Other roles require tenant | clean() method |
| System roles cannot be deleted | delete() method |
| Slug auto-generated | save() method |

## Relationships

### Parent (Self-Referential)

```python
# Parent relationship
role = Role.objects.get(slug='staff')
parent_role = role.parent  # Gets Manager role

# Children relationship (reverse)
manager_role = Role.objects.get(slug='manager')
child_roles = manager_role.children.all()
```

### Tenant

```python
# Get all roles for a tenant
tenant = Tenant.objects.get(slug='example-store')
roles = tenant.roles.all()

# Filter system roles
system_roles = tenant.roles.filter(is_system_role=True)
```

## RoleManager Methods

### get_system_roles(tenant=None)

Get all system-defined roles, optionally filtered by tenant.

```python
# Get all system roles
system_roles = Role.objects.get_system_roles()

# Get system roles for specific tenant
tenant_system_roles = Role.objects.get_system_roles(tenant=my_tenant)
```

### get_custom_roles(tenant)

Get user-created roles for a tenant.

```python
custom_roles = Role.objects.get_custom_roles(tenant=my_tenant)
```

### get_by_level(hierarchy_level, tenant=None)

Get roles at specific hierarchy level.

```python
# Get all Manager-level roles
managers = Role.objects.get_by_level(2, tenant=my_tenant)
```

### get_hierarchical_roles(role)

Get all roles at same or lower hierarchy level.

```python
# Get roles a Manager can assign
manager = Role.objects.get(slug='manager', tenant=my_tenant)
assignable = Role.objects.get_hierarchical_roles(manager)
```

## Usage Examples

### Creating Roles

```python
# Create custom role
custom_role = Role.objects.create(
    name='Store Supervisor',
    slug='store-supervisor',
    description='Supervises store operations',
    hierarchy_level=2,
    parent=manager_role,
    tenant=my_tenant,
    is_system_role=False
)
```

### Role Assignment

```python
# Assign role to user
user.role = Role.objects.get(slug='staff', tenant=user.tenant)
user.save()
```

### Permission Checks

```python
# Check if role can be assigned by another role
if target_role.can_be_assigned_by(current_user.role):
    # Allow assignment
    pass
```

## API Integration

### Endpoints

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | /api/roles/ | List roles |
| POST | /api/roles/ | Create custom role |
| GET | /api/roles/{id}/ | Get role details |
| PUT | /api/roles/{id}/ | Update role |
| DELETE | /api/roles/{id}/ | Delete custom role |

### Permissions

| Action | Required Permission |
|--------|---------------------|
| List roles | Authenticated |
| Create custom role | create_custom_roles |
| Update role | manage_system_roles or is_owner |
| Delete role | manage_system_roles |

## Migrations

### Initial Setup

1. Run migrations to create Role table
2. Run data migration to create Super Admin
3. During tenant provisioning, create tenant roles

### Tenant Provisioning

```python
from apps.users.services import provision_tenant_roles

# After tenant created
roles = provision_tenant_roles(new_tenant)
```

## Troubleshooting

### Common Issues

**IntegrityError: duplicate key value violates unique constraint**
- Cause: Attempting to create role with duplicate name in same tenant
- Solution: Check existing roles or use get_or_create

**ValidationError: Only Super Admin can have null tenant**
- Cause: Creating non-Super Admin role without tenant
- Solution: Always provide tenant for roles with level > 0

**ValidationError: System roles cannot be deleted**
- Cause: Attempting to delete role with is_system_role=True
- Solution: Only delete custom roles (is_system_role=False)

## Best Practices

1. **Use Manager Methods:** Leverage RoleManager methods for queries
2. **Tenant Scoping:** Always filter by tenant except for Super Admin
3. **System Roles:** Don't modify or delete system roles
4. **Custom Roles:** Use hierarchy_level 2 or 3 for custom roles
5. **Permissions:** Assign permissions at role level, not user level
6. **Hierarchy:** Respect hierarchy when assigning roles
7. **Validation:** Always call full_clean() before saving

## See Also

- [Permission Model Documentation](permission_model.md)
- [User Model Documentation](user_model.md)
- [RBAC System Overview](../rbac_overview.md)
- [API Documentation](../api/roles.md)
```

### Documentation Sections
| Section | Content |
|---------|---------|
| **Overview** | Model purpose and key features |
| **Hierarchy** | Level descriptions and diagram |
| **Fields** | Complete field reference |
| **Constraints** | Database and validation rules |
| **Relationships** | FK relationships and usage |
| **Manager** | Custom manager methods |
| **Usage** | Code examples |
| **API** | Endpoint and permission info |
| **Migrations** | Setup and provisioning |
| **Troubleshooting** | Common issues and solutions |

### Expected Outcome

After completing documentation:
- Comprehensive Role model reference
- Usage examples for developers
- API integration guide
- Troubleshooting information
- Migration instructions

### Verification Checklist
- [ ] Documentation file created
- [ ] Overview section complete
- [ ] All 5 hierarchy levels documented
- [ ] All fields documented with types
- [ ] Relationships explained with examples
- [ ] Manager methods documented
- [ ] Usage examples provided
- [ ] API integration notes included
- [ ] Migration process documented
- [ ] Troubleshooting section added
- [ ] Code examples are accurate

---

## Group A Completion

### Deliverables Summary

After completing all tasks in Group A:

| Deliverable | Status |
|------------|--------|
| **Role App Structure** | ✓ Created |
| **Role Model File** | ✓ Created |
| **Model Fields** | ✓ All 8 fields defined |
| **RoleManager** | ✓ 6+ methods implemented |
| **Meta Class** | ✓ Constraints and indexes |
| **Data Migration** | ✓ Super Admin created |
| **Provisioning Service** | ✓ Tenant role creation |
| **Documentation** | ✓ Comprehensive reference |

### Model Structure

```python
# Final Role model structure

class RoleManager(models.Manager):
    # 6+ custom query methods
    pass

class Role(BaseModel):
    # Fields
    name = CharField(max_length=100)
    slug = SlugField(max_length=100)
    description = TextField()
    is_system_role = BooleanField()
    hierarchy_level = IntegerField(validators=[...])
    parent = ForeignKey('self')
    tenant = ForeignKey('tenants.Tenant')
    
    # Manager
    objects = RoleManager()
    
    # Meta
    class Meta:
        db_table = 'roles'
        unique_together = [['name', 'tenant']]
        ordering = ['hierarchy_level', 'name']
        indexes = [...]
    
    # Methods
    def __str__(self): ...
    def save(self): ...
    def clean(self): ...
    def delete(self): ...
```

### Next Steps

Proceed to **Group-B: Permission Model**
- Create Permission model
- Define permission categories
- Implement permission validation
- Set up permission-role relationships

---

## Notes for AI Agents

1. **Migration Timing:** Run immediately after model migrations
2. **Super Admin Only:** Only create Super Admin in data migration
3. **Tenant Roles:** Create during tenant provisioning, not in migration
4. **Rollback Support:** Always provide reverse migration function
5. **Service Function:** Create reusable function for tenant provisioning
6. **Documentation:** Keep in sync with model changes
7. **Examples:** Provide working code examples in documentation
8. **Troubleshooting:** Document common errors developers will encounter
9. **API Docs:** Link to API documentation if available
10. **Version Control:** Document any breaking changes in migrations
