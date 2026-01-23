# Tasks 03-10: Role Model Definition

> **Phase:** 03 - Core Backend Infrastructure  
> **SubPhase:** 05 - Role & Permission System  
> **Group:** A - Role Model Foundation  
> **Document:** 02 of 04  
> **Tasks Covered:** 03, 04, 05, 06, 07, 08, 09, 10

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [01_Tasks-01-02_Role-App-Setup.md](01_Tasks-01-02_Role-App-Setup.md)
- **→ Next Document:** [03_Tasks-11-12_RoleManager-Meta.md](03_Tasks-11-12_RoleManager-Meta.md)

---

## Document Overview

This document covers the creation of the Role model with all required fields. The model implements a hierarchical role structure with tenant-scoping and support for system-defined roles.

### Tasks in This Document
| Task # | Task Name | Complexity |
|--------|-----------|------------|
| 03 | Create Role Model Class | Simple |
| 04 | Add name Field | Simple |
| 05 | Add slug Field | Simple |
| 06 | Add description Field | Simple |
| 07 | Add is_system_role Field | Simple |
| 08 | Add hierarchy_level Field | Medium |
| 09 | Add parent ForeignKey | Medium |
| 10 | Add tenant ForeignKey | Medium |

---

## Task 03: Create Role Model Class

### Overview
Define the Role model class that extends BaseModel and serves as the foundation for the role-based access control system.

### Dependencies
- Task 02: Create Role Model File
- SubPhase-03: Base Models & Mixins (BaseModel available)

### Instructions

1. **Open the role.py file**
   - Navigate to `backend/apps/users/models/role.py`
   - Locate the placeholder section for Role model

2. **Define the Role model class**
   - Create class `Role` extending `BaseModel`
   - BaseModel provides: id, created_at, updated_at, is_active fields

3. **Add class docstring**
   - Document the role model purpose
   - Explain hierarchy levels (0-4)
   - Describe tenant-scoping behavior
   - Note system role protections

4. **Add initial class attributes placeholder**
   - Comment for objects manager (will be set later)
   - Comment for field definitions (next tasks)

### Class Definition Structure

```python
# Structure outline for Role model class

class Role(BaseModel):
    """
    Role model for RBAC system.
    
    Hierarchy Levels:
    - 0: Super Admin - Platform-wide access
    - 1: Tenant Admin - Full tenant access
    - 2: Manager - Department-level access
    - 3: Staff - Basic CRUD operations
    - 4: Customer - Webstore access only
    
    Features:
    - Hierarchical structure with parent relationships
    - Tenant-scoped (except Super Admin)
    - System roles cannot be deleted
    - Auto-generated slug from name
    """
    
    # Fields will be added in next tasks
    # Manager will be added in Task 11
    # Meta will be added in Task 12
```

### Expected Outcome

After completing this task:
- Role model class is defined extending BaseModel
- Class docstring documents hierarchy and features
- Structure is ready for field definitions

### Verification Checklist
- [ ] `class Role(BaseModel):` is defined
- [ ] Class docstring is comprehensive
- [ ] Docstring includes all 5 hierarchy levels
- [ ] Docstring mentions tenant-scoping
- [ ] Docstring notes system role protections

---

## Task 04: Add name Field

### Overview
Add the name field to store the role's display name. This field must be unique per tenant.

### Dependencies
- Task 03: Create Role Model Class

### Instructions

1. **Add name CharField**
   - Type: `CharField`
   - max_length: 100
   - Constraint: Cannot be blank
   - Indexed: Yes (for query performance)

2. **Add field constraints**
   - Set `blank=False`
   - Set `null=False`
   - Set `db_index=True`

3. **Add verbose name**
   - Set `verbose_name='Role Name'`
   - Set `help_text='Display name of the role'`

4. **Add uniqueness note**
   - Note: Uniqueness enforced via Meta.unique_together with tenant
   - Do not set `unique=True` on this field alone

### Field Definition Structure

```python
# Structure for name field

name = models.CharField(
    max_length=100,
    blank=False,
    null=False,
    db_index=True,
    verbose_name='Role Name',
    help_text='Display name of the role (e.g., "Manager", "Staff")'
)
```

### Field Constraints
| Constraint | Value | Reason |
|-----------|-------|--------|
| **max_length** | 100 | Sufficient for role names |
| **blank** | False | Name is required |
| **null** | False | Database constraint |
| **db_index** | True | Improve query performance |
| **unique** | False | Unique per tenant (in Meta) |

### Expected Outcome
- name field added to Role model
- Field properly constrained and indexed
- Ready to store role display names

### Verification Checklist
- [ ] name field is CharField with max_length=100
- [ ] blank=False and null=False are set
- [ ] db_index=True for performance
- [ ] verbose_name and help_text are descriptive
- [ ] No unique=True constraint (handled in Meta)

---

## Task 05: Add slug Field

### Overview
Add a slug field to store URL-safe identifiers for roles. This field will be auto-generated from the name field.

### Dependencies
- Task 04: Add name Field

### Instructions

1. **Add slug SlugField**
   - Type: `SlugField`
   - max_length: 100
   - Allow blank initially (auto-generated)
   - Indexed for lookups

2. **Set field attributes**
   - Set `blank=True` (auto-filled)
   - Set `null=False`
   - Set `db_index=True`
   - Set `editable=False` (auto-generated)

3. **Add verbose name and help text**
   - Set `verbose_name='Slug'`
   - Set `help_text='URL-safe identifier (auto-generated from name)'`

4. **Plan slug generation**
   - Note: Slug will be generated in save() method override
   - Use `slugify()` function from django.utils.text
   - Ensure uniqueness per tenant

### Field Definition Structure

```python
# Structure for slug field

slug = models.SlugField(
    max_length=100,
    blank=True,
    null=False,
    db_index=True,
    editable=False,
    verbose_name='Slug',
    help_text='URL-safe identifier (auto-generated from name)'
)
```

### Slug Generation Logic
| Aspect | Implementation |
|--------|----------------|
| **Generation** | Auto-generate in save() method |
| **Source** | Derived from name field |
| **Function** | Use slugify() from django.utils.text |
| **Uniqueness** | Check against tenant roles |
| **Format** | Lowercase, hyphen-separated |

### Examples
| Name | Generated Slug |
|------|----------------|
| Super Admin | super-admin |
| Tenant Admin | tenant-admin |
| Store Manager | store-manager |
| Sales Staff | sales-staff |
| Web Customer | web-customer |

### Expected Outcome
- slug field added to Role model
- Field configured for auto-generation
- Ready for save() method implementation

### Verification Checklist
- [ ] slug field is SlugField with max_length=100
- [ ] blank=True to allow auto-generation
- [ ] editable=False to prevent manual editing
- [ ] db_index=True for lookups
- [ ] help_text explains auto-generation

---

## Task 06: Add description Field

### Overview
Add a description field to provide detailed information about the role's purpose and capabilities.

### Dependencies
- Task 05: Add slug Field

### Instructions

1. **Add description TextField**
   - Type: `TextField`
   - Allow blank (optional field)
   - No max_length constraint

2. **Set field attributes**
   - Set `blank=True`
   - Set `null=True`
   - Set `default=''`

3. **Add verbose name and help text**
   - Set `verbose_name='Description'`
   - Set `help_text='Detailed description of the role and its responsibilities'`

### Field Definition Structure

```python
# Structure for description field

description = models.TextField(
    blank=True,
    null=True,
    default='',
    verbose_name='Description',
    help_text='Detailed description of the role and its responsibilities'
)
```

### Description Usage
| Purpose | Content |
|---------|---------|
| **Role Definition** | Explain what this role can do |
| **Responsibilities** | List key responsibilities |
| **Access Level** | Describe access scope |
| **Use Cases** | When to assign this role |

### Example Descriptions
```
Super Admin:
"Platform-wide administrator with full access to all tenants and system settings. 
Can manage tenant provisioning, system configurations, and global settings."

Tenant Admin:
"Full administrative access within the tenant. Can manage all modules, users, 
and tenant-specific settings."

Manager:
"Department or store manager with access to inventory, sales reports, and staff 
management within their assigned scope."

Staff:
"Standard user with access to daily operations like sales, inventory updates, and 
customer management."

Customer:
"External user with access to webstore features only. Can place orders, view order 
history, and manage their account."
```

### Expected Outcome
- description field added to Role model
- Field is optional with sensible defaults
- Ready to store detailed role information

### Verification Checklist
- [ ] description field is TextField
- [ ] blank=True and null=True for optional field
- [ ] default='' to avoid None values
- [ ] verbose_name and help_text are clear
- [ ] Field can store long text content

---

## Task 07: Add is_system_role Field

### Overview
Add a boolean field to mark system-defined roles that cannot be deleted or modified by users.

### Dependencies
- Task 06: Add description Field

### Instructions

1. **Add is_system_role BooleanField**
   - Type: `BooleanField`
   - Default: False (user-created roles)
   - Indexed for filtering

2. **Set field attributes**
   - Set `default=False`
   - Set `db_index=True`
   - Set `editable=False` (set programmatically)

3. **Add verbose name and help text**
   - Set `verbose_name='System Role'`
   - Set `help_text='System-defined role that cannot be deleted'`

4. **Plan deletion protection**
   - Note: Override delete() method to check this flag
   - System roles (True) cannot be deleted
   - User-created roles (False) can be deleted

### Field Definition Structure

```python
# Structure for is_system_role field

is_system_role = models.BooleanField(
    default=False,
    db_index=True,
    editable=False,
    verbose_name='System Role',
    help_text='System-defined role that cannot be deleted'
)
```

### System Role Protection
| Role Type | is_system_role | Can Delete? | Can Modify? |
|-----------|----------------|-------------|-------------|
| **Super Admin** | True | No | No |
| **Tenant Admin** | True | No | No |
| **Manager** | True | No | Limited |
| **Staff** | True | No | Limited |
| **Customer** | True | No | Limited |
| **Custom Roles** | False | Yes | Yes |

### Deletion Logic
```python
# Pseudo-code for delete protection

def delete(self):
    if self.is_system_role:
        raise ValidationError("System roles cannot be deleted")
    super().delete()
```

### Expected Outcome
- is_system_role field added to Role model
- Field properly indexed for filtering
- Ready for deletion protection logic

### Verification Checklist
- [ ] is_system_role field is BooleanField
- [ ] default=False for user-created roles
- [ ] db_index=True for filtering system roles
- [ ] editable=False to prevent form editing
- [ ] help_text explains protection behavior

---

## Task 08: Add hierarchy_level Field

### Overview
Add an integer field to define the role's position in the hierarchy (0-4). Lower numbers have higher privileges.

### Dependencies
- Task 07: Add is_system_role Field

### Instructions

1. **Add hierarchy_level IntegerField**
   - Type: `IntegerField`
   - Range: 0 (highest) to 4 (lowest)
   - Default: 3 (Staff level)
   - Indexed for hierarchy queries

2. **Add field constraints**
   - Set `default=3`
   - Set `db_index=True`
   - Add validators for range 0-4

3. **Add verbose name and help text**
   - Set `verbose_name='Hierarchy Level'`
   - Set detailed help_text with level descriptions

4. **Import validators**
   - Import `MinValueValidator` from `django.core.validators`
   - Import `MaxValueValidator` from `django.core.validators`

5. **Add validators list**
   - MinValueValidator(0)
   - MaxValueValidator(4)

### Field Definition Structure

```python
# Add to imports section
from django.core.validators import MinValueValidator, MaxValueValidator

# Structure for hierarchy_level field

hierarchy_level = models.IntegerField(
    default=3,
    db_index=True,
    validators=[
        MinValueValidator(0),
        MaxValueValidator(4)
    ],
    verbose_name='Hierarchy Level',
    help_text=(
        'Role hierarchy level: '
        '0=Super Admin, 1=Tenant Admin, 2=Manager, 3=Staff, 4=Customer'
    )
)
```

### Hierarchy Level Details
| Level | Role Name | Access Scope | Can Manage |
|-------|-----------|--------------|------------|
| **0** | Super Admin | Platform-wide | All tenants, system config |
| **1** | Tenant Admin | Tenant-wide | All modules, users, settings |
| **2** | Manager | Department | Department users, inventory |
| **3** | Staff | Operational | Daily operations, transactions |
| **4** | Customer | Webstore | Own account, orders |

### Permission Inheritance
```
Level 0 (Super Admin)
    ├── Can do everything
    │
    └── Level 1 (Tenant Admin)
            ├── All tenant operations
            │
            └── Level 2 (Manager)
                    ├── Department operations
                    │
                    └── Level 3 (Staff)
                            ├── Basic operations
                            │
                            └── Level 4 (Customer)
                                    └── Webstore only
```

### Expected Outcome
- hierarchy_level field added with validators
- Range constrained to 0-4
- Indexed for hierarchy queries
- Clear documentation of each level

### Verification Checklist
- [ ] hierarchy_level field is IntegerField
- [ ] default=3 for standard staff role
- [ ] Validators enforce 0-4 range
- [ ] db_index=True for hierarchy queries
- [ ] help_text lists all 5 levels
- [ ] MinValueValidator and MaxValueValidator imported

---

## Task 09: Add parent ForeignKey

### Overview
Add a self-referential ForeignKey to support hierarchical role relationships and permission inheritance.

### Dependencies
- Task 08: Add hierarchy_level Field

### Instructions

1. **Add parent ForeignKey field**
   - Type: `ForeignKey`
   - Reference: 'self' (same Role model)
   - Allow null (root roles have no parent)
   - Set cascade behavior

2. **Configure ForeignKey attributes**
   - Set `to='self'`
   - Set `on_delete=models.SET_NULL`
   - Set `null=True`
   - Set `blank=True`
   - Set `related_name='children'`

3. **Add verbose name and help text**
   - Set `verbose_name='Parent Role'`
   - Set `help_text='Parent role for permission inheritance'`

4. **Plan permission inheritance**
   - Note: Child roles inherit permissions from parent
   - Root roles (parent=None) define base permissions
   - Use for hierarchical permission queries

### Field Definition Structure

```python
# Structure for parent field

parent = models.ForeignKey(
    'self',
    on_delete=models.SET_NULL,
    null=True,
    blank=True,
    related_name='children',
    verbose_name='Parent Role',
    help_text='Parent role for permission inheritance'
)
```

### Cascade Behavior
| Action | Behavior | Reason |
|--------|----------|--------|
| **Parent Deleted** | SET_NULL | Preserve child roles |
| **Parent Modified** | No cascade | Independent roles |
| **Child Deleted** | No effect | Parent unaffected |

### Hierarchical Structure Example
```
None (No parent)
    ├── Super Admin (level 0)
    │       └── Tenant Admin (level 1)
    │               ├── Manager (level 2)
    │               │       └── Staff (level 3)
    │               └── Staff (level 3)
    │                       └── Customer (level 4)
```

### Related Name Usage
```python
# Query examples using related_name='children'

# Get all child roles of a role
manager_role = Role.objects.get(slug='manager')
child_roles = manager_role.children.all()

# Get parent role
staff_role = Role.objects.get(slug='staff')
parent_role = staff_role.parent
```

### Expected Outcome
- parent field added as self-referential FK
- Proper cascade behavior configured
- related_name for reverse queries
- Ready for permission inheritance

### Verification Checklist
- [ ] parent field is ForeignKey to 'self'
- [ ] on_delete=models.SET_NULL
- [ ] null=True and blank=True
- [ ] related_name='children' for reverse access
- [ ] verbose_name and help_text are clear

---

## Task 10: Add tenant ForeignKey

### Overview
Add a ForeignKey to the Tenant model to scope roles to specific tenants. Super Admin role (level 0) can have null tenant for platform-wide access.

### Dependencies
- Task 09: Add parent ForeignKey
- Phase 02: Tenant model exists

### Instructions

1. **Add tenant ForeignKey field**
   - Type: `ForeignKey`
   - Reference: Tenant model
   - Allow null for Super Admin role
   - Set cascade behavior

2. **Configure ForeignKey attributes**
   - Set `to='tenants.Tenant'` (or correct tenant model path)
   - Set `on_delete=models.CASCADE`
   - Set `null=True` (for Super Admin)
   - Set `blank=True`
   - Set `related_name='roles'`

3. **Add verbose name and help text**
   - Set `verbose_name='Tenant'`
   - Set `help_text='Tenant this role belongs to (null for Super Admin)'`

4. **Add indexing**
   - Set `db_index=True` for tenant filtering

5. **Plan tenant scoping**
   - Note: All roles except Super Admin must have tenant
   - Enforce in save() method or model validation
   - Use for multi-tenant data isolation

### Field Definition Structure

```python
# Structure for tenant field

tenant = models.ForeignKey(
    'tenants.Tenant',  # Adjust path based on your tenant app name
    on_delete=models.CASCADE,
    null=True,
    blank=True,
    db_index=True,
    related_name='roles',
    verbose_name='Tenant',
    help_text='Tenant this role belongs to (null for Super Admin)'
)
```

### Tenant Scoping Rules
| Role Level | Tenant Required? | Reason |
|-----------|------------------|--------|
| **0 - Super Admin** | No (null) | Platform-wide access |
| **1 - Tenant Admin** | Yes | Tenant-scoped |
| **2 - Manager** | Yes | Tenant-scoped |
| **3 - Staff** | Yes | Tenant-scoped |
| **4 - Customer** | Yes | Tenant-scoped |

### Cascade Behavior
| Event | Behavior | Impact |
|-------|----------|--------|
| **Tenant Deleted** | CASCADE | All tenant roles deleted |
| **Role Deleted** | No cascade | Tenant unaffected |
| **Tenant Modified** | No cascade | Roles unaffected |

### Validation Logic
```python
# Pseudo-code for tenant validation

def clean(self):
    if self.hierarchy_level > 0 and self.tenant is None:
        raise ValidationError(
            "Only Super Admin (level 0) can have null tenant"
        )
    if self.hierarchy_level == 0 and self.tenant is not None:
        raise ValidationError(
            "Super Admin must have null tenant for platform-wide access"
        )
```

### Related Name Usage
```python
# Query examples using related_name='roles'

# Get all roles for a tenant
tenant = Tenant.objects.get(slug='example-tenant')
tenant_roles = tenant.roles.all()

# Filter system roles for a tenant
system_roles = tenant.roles.filter(is_system_role=True)

# Count custom roles
custom_role_count = tenant.roles.filter(is_system_role=False).count()
```

### Expected Outcome
- tenant field added as FK to Tenant
- Proper cascade and indexing configured
- Null allowed for Super Admin
- Ready for multi-tenant isolation

### Verification Checklist
- [ ] tenant field is ForeignKey to Tenant model
- [ ] on_delete=models.CASCADE
- [ ] null=True and blank=True
- [ ] db_index=True for filtering
- [ ] related_name='roles'
- [ ] help_text explains Super Admin exception

---

## Group A Next Steps

After completing Tasks 03-10, proceed to:
- **Next Document:** [03_Tasks-11-12_RoleManager-Meta.md](03_Tasks-11-12_RoleManager-Meta.md)
- Create RoleManager for custom query methods
- Add Meta class with unique_together constraint
- Configure ordering and indexes

---

## Notes for AI Agents

1. **Field Order:** Follow Django convention (regular fields, then ForeignKeys)
2. **Validators:** Import at module level, use in field definitions
3. **help_text:** Be descriptive - helps with auto-generated admin and API docs
4. **Indexing:** Index fields used in frequent queries (name, slug, tenant)
5. **Uniqueness:** Don't set unique=True on name - handled in Meta
6. **Cascade:** CASCADE for tenant (tenant deletion removes roles)
7. **SET_NULL:** For parent (preserve child roles if parent deleted)
8. **Tenant Path:** Adjust 'tenants.Tenant' to match your project structure
