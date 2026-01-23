# Tasks 20-22: PermissionGroup Model

> **Phase:** 03 - Core Backend Infrastructure  
> **SubPhase:** 05 - Role & Permission System  
> **Group:** B - Permission Model  
> **Document:** 02 of 04  
> **Tasks Covered:** 20, 21, 22

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [01_Tasks-15-19_Permission-Model.md](01_Tasks-15-19_Permission-Model.md)
- **→ Next Document:** [03_Tasks-23-24_Constants-Definition.md](03_Tasks-23-24_Constants-Definition.md)

---

## Document Overview

This document covers the creation of the PermissionGroup model, which groups related permissions together for easier management and assignment. Permission groups simplify the process of granting multiple related permissions to roles or users.

### Tasks in This Document
| Task # | Task Name | Complexity |
|--------|-----------|------------|
| 20 | Create PermissionGroup Model Class | Medium |
| 21 | Add group_name Field | Simple |
| 22 | Add permissions ManyToManyField | Medium |

---

## Task 20: Create PermissionGroup Model Class

### Overview
Create the PermissionGroup model class that extends BaseModel and serves as a container for grouping related permissions.

### Dependencies
- Task 15: Create Permission Model Class
- BaseModel implementation from SubPhase-03

### Instructions

1. **Open the permission.py file**
   - Navigate to `backend/apps/users/models/`
   - Open `permission.py` file

2. **Import required modules**
   - Import Django model components
   - Import BaseModel from core
   - Ensure Permission model is defined first

3. **Create PermissionGroup model class**
   - Define class `PermissionGroup` that extends `BaseModel`
   - Add class Meta configuration
   - Set appropriate database table name

4. **Add class Meta configuration**
   - Set `db_table = 'users_permission_group'`
   - Set `verbose_name = 'Permission Group'`
   - Set `verbose_name_plural = 'Permission Groups'`
   - Add ordering by group_name

5. **Add __str__ method**
   - Return group_name for string representation
   - Ensures readable display in admin and logs

6. **Add docstring**
   - Explain purpose of PermissionGroup
   - Document relationship to Permission model
   - Provide usage examples

### Model Structure

```python
class PermissionGroup(BaseModel):
    """
    Model for grouping related permissions together.
    
    Permission groups simplify permission management by allowing
    administrators to assign multiple related permissions at once.
    
    Examples:
        - Product Management: groups all product-related permissions
        - Sales Operations: groups order and payment permissions
        - Inventory Control: groups stock and warehouse permissions
    
    Attributes:
        group_name: Unique name for the permission group
        permissions: Many-to-many relationship to Permission model
    
    Inherits:
        created_at, updated_at, is_active from BaseModel
    """
    
    class Meta:
        db_table = 'users_permission_group'
        verbose_name = 'Permission Group'
        verbose_name_plural = 'Permission Groups'
        ordering = ['group_name']
    
    def __str__(self):
        return self.group_name
```

### Expected Outcome
```
backend/apps/users/models/permission.py
├── Permission model (Tasks 15-19)
└── PermissionGroup model class defined
```

### Verification Checklist
- [ ] PermissionGroup class extends BaseModel
- [ ] Class Meta is properly configured
- [ ] db_table name follows naming convention
- [ ] __str__ method returns group_name
- [ ] Comprehensive docstring is included
- [ ] Model is defined after Permission model

---

## Task 21: Add group_name Field

### Overview
Add the group_name field to store the unique name of the permission group.

### Dependencies
- Task 20: Create PermissionGroup Model Class

### Instructions

1. **Add group_name field**
   - Use `models.CharField` for the field type
   - Set `max_length=100`
   - Make it unique with `unique=True`
   - Set `verbose_name='Group Name'`

2. **Add field validation**
   - Ensure field is required (no blank=True)
   - Add help_text for clarity

3. **Add database indexing**
   - Add `db_index=True` for query optimization
   - Groups will be frequently queried by name

4. **Document the field**
   - Add inline comment explaining purpose
   - Include examples of group names

### Field Implementation

```python
group_name = models.CharField(
    max_length=100,
    unique=True,
    db_index=True,
    verbose_name='Group Name',
    help_text='Unique name for this permission group (e.g., "Product Management", "Sales Operations")'
)
```

### Group Name Examples

| Group Name | Purpose |
|------------|---------|
| Product Management | All product-related permissions |
| Sales Operations | Order, payment, invoice permissions |
| Inventory Control | Stock, warehouse, transfer permissions |
| Customer Service | Customer, support, refund permissions |
| Financial Operations | Payment, accounting, tax permissions |
| Report Access | All reporting permissions |
| User Management | User, role, permission administration |
| System Settings | Configuration and settings permissions |

### Expected Outcome
```python
class PermissionGroup(BaseModel):
    group_name = models.CharField(
        max_length=100,
        unique=True,
        db_index=True,
        verbose_name='Group Name',
        help_text='...'
    )
    
    class Meta:
        db_table = 'users_permission_group'
        verbose_name = 'Permission Group'
        verbose_name_plural = 'Permission Groups'
        ordering = ['group_name']
```

### Verification Checklist
- [ ] group_name field is CharField
- [ ] max_length is set to 100
- [ ] unique=True is set
- [ ] db_index=True is set
- [ ] verbose_name is descriptive
- [ ] help_text provides clear guidance

---

## Task 22: Add permissions ManyToManyField

### Overview
Add the permissions field as a ManyToManyField to establish the relationship between permission groups and individual permissions.

### Dependencies
- Task 21: Add group_name Field
- Task 15: Create Permission Model Class

### Instructions

1. **Add permissions field**
   - Use `models.ManyToManyField` type
   - Reference the Permission model
   - Set `related_name='permission_groups'`
   - Set `verbose_name='Permissions'`

2. **Configure field options**
   - Set `blank=True` to allow empty groups initially
   - Add comprehensive help_text

3. **Add related_name**
   - Use `related_name='permission_groups'`
   - Enables reverse lookup from Permission to PermissionGroup

4. **Add helper methods**
   - Create `add_permission()` method
   - Create `remove_permission()` method
   - Create `get_permission_codenames()` method

5. **Document relationships**
   - Add comments explaining the M2M relationship
   - Document usage patterns

### Field Implementation

```python
permissions = models.ManyToManyField(
    'Permission',
    related_name='permission_groups',
    blank=True,
    verbose_name='Permissions',
    help_text='Select permissions to include in this group'
)
```

### Helper Methods

```python
def add_permission(self, permission):
    """
    Add a permission to this group.
    
    Args:
        permission: Permission instance or codename string
    """
    if isinstance(permission, str):
        permission = Permission.objects.get(codename=permission)
    self.permissions.add(permission)

def remove_permission(self, permission):
    """
    Remove a permission from this group.
    
    Args:
        permission: Permission instance or codename string
    """
    if isinstance(permission, str):
        permission = Permission.objects.get(codename=permission)
    self.permissions.remove(permission)

def get_permission_codenames(self):
    """
    Get list of all permission codenames in this group.
    
    Returns:
        list: List of permission codenames
    """
    return list(self.permissions.values_list('codename', flat=True))
```

### Complete Model

```python
class PermissionGroup(BaseModel):
    """
    Model for grouping related permissions together.
    
    Permission groups simplify permission management by allowing
    administrators to assign multiple related permissions at once.
    
    Examples:
        - Product Management: groups all product-related permissions
        - Sales Operations: groups order and payment permissions
        - Inventory Control: groups stock and warehouse permissions
    
    Attributes:
        group_name: Unique name for the permission group
        permissions: Many-to-many relationship to Permission model
    
    Inherits:
        created_at, updated_at, is_active from BaseModel
    """
    
    group_name = models.CharField(
        max_length=100,
        unique=True,
        db_index=True,
        verbose_name='Group Name',
        help_text='Unique name for this permission group (e.g., "Product Management", "Sales Operations")'
    )
    
    permissions = models.ManyToManyField(
        'Permission',
        related_name='permission_groups',
        blank=True,
        verbose_name='Permissions',
        help_text='Select permissions to include in this group'
    )
    
    class Meta:
        db_table = 'users_permission_group'
        verbose_name = 'Permission Group'
        verbose_name_plural = 'Permission Groups'
        ordering = ['group_name']
    
    def __str__(self):
        return self.group_name
    
    def add_permission(self, permission):
        """
        Add a permission to this group.
        
        Args:
            permission: Permission instance or codename string
        """
        if isinstance(permission, str):
            permission = Permission.objects.get(codename=permission)
        self.permissions.add(permission)
    
    def remove_permission(self, permission):
        """
        Remove a permission from this group.
        
        Args:
            permission: Permission instance or codename string
        """
        if isinstance(permission, str):
            permission = Permission.objects.get(codename=permission)
        self.permissions.remove(permission)
    
    def get_permission_codenames(self):
        """
        Get list of all permission codenames in this group.
        
        Returns:
            list: List of permission codenames
        """
        return list(self.permissions.values_list('codename', flat=True))
```

### Usage Examples

```python
# Create a permission group
product_group = PermissionGroup.objects.create(
    group_name='Product Management'
)

# Add permissions to the group
product_group.add_permission('products.view_product')
product_group.add_permission('products.add_product')
product_group.add_permission('products.change_product')

# Get all permissions in the group
codenames = product_group.get_permission_codenames()
# Returns: ['products.view_product', 'products.add_product', 'products.change_product']

# Access permission groups from a permission (reverse relationship)
permission = Permission.objects.get(codename='products.view_product')
groups = permission.permission_groups.all()
```

### Expected Outcome
```
backend/apps/users/models/permission.py
├── Permission model (Tasks 15-19)
└── PermissionGroup model (Tasks 20-22) ✓
    ├── group_name field ✓
    ├── permissions ManyToManyField ✓
    └── Helper methods ✓
```

### Verification Checklist
- [ ] permissions field is ManyToManyField
- [ ] References Permission model correctly
- [ ] related_name is set to 'permission_groups'
- [ ] blank=True allows empty groups
- [ ] add_permission() method implemented
- [ ] remove_permission() method implemented
- [ ] get_permission_codenames() method implemented
- [ ] Usage examples are documented

---

## Integration Points

### Database Schema
```sql
-- Permission Groups table
CREATE TABLE users_permission_group (
    id BIGSERIAL PRIMARY KEY,
    group_name VARCHAR(100) UNIQUE NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Many-to-many relationship table
CREATE TABLE users_permission_group_permissions (
    id BIGSERIAL PRIMARY KEY,
    permissiongroup_id BIGINT REFERENCES users_permission_group(id),
    permission_id BIGINT REFERENCES users_permission(id),
    UNIQUE(permissiongroup_id, permission_id)
);

-- Indexes
CREATE INDEX idx_permission_group_name ON users_permission_group(group_name);
```

### Admin Integration
- Register PermissionGroup in admin
- Display permissions inline
- Add filter by group_name
- Add search by group_name

### API Integration
- PermissionGroupSerializer with nested permissions
- List/Create/Update/Delete endpoints
- Bulk permission assignment endpoints

---

## Testing Requirements

### Unit Tests
```python
class PermissionGroupModelTest(TestCase):
    def test_create_permission_group(self):
        """Test creating a permission group"""
        group = PermissionGroup.objects.create(
            group_name='Product Management'
        )
        self.assertEqual(group.group_name, 'Product Management')
    
    def test_unique_group_name(self):
        """Test group_name uniqueness constraint"""
        PermissionGroup.objects.create(group_name='Product Management')
        with self.assertRaises(IntegrityError):
            PermissionGroup.objects.create(group_name='Product Management')
    
    def test_add_permission_to_group(self):
        """Test adding permission to group"""
        group = PermissionGroup.objects.create(
            group_name='Product Management'
        )
        permission = Permission.objects.create(
            codename='products.view_product',
            name='View Product',
            module='products',
            action='view'
        )
        group.add_permission(permission)
        self.assertIn(permission, group.permissions.all())
    
    def test_get_permission_codenames(self):
        """Test getting permission codenames"""
        group = PermissionGroup.objects.create(
            group_name='Product Management'
        )
        p1 = Permission.objects.create(
            codename='products.view_product',
            name='View Product',
            module='products',
            action='view'
        )
        p2 = Permission.objects.create(
            codename='products.add_product',
            name='Add Product',
            module='products',
            action='add'
        )
        group.permissions.add(p1, p2)
        
        codenames = group.get_permission_codenames()
        self.assertIn('products.view_product', codenames)
        self.assertIn('products.add_product', codenames)
```

---

## Notes for AI Agents

### When Implementing
1. **Ensure Permission model exists first** - PermissionGroup references Permission
2. **Use related_name correctly** - Enables reverse lookups
3. **Add helper methods** - Simplifies permission management
4. **Test thoroughly** - Test all CRUD operations and relationships
5. **Document usage** - Provide clear examples

### Common Patterns
```python
# Pattern 1: Create group with permissions
group = PermissionGroup.objects.create(group_name='Sales Operations')
group.permissions.add(*Permission.objects.filter(module='sales'))

# Pattern 2: Assign group permissions to role
role.permissions.add(*permission_group.permissions.all())

# Pattern 3: Get all groups containing a permission
groups = permission.permission_groups.all()
```

### Potential Issues
- **Circular imports** - Ensure proper import order
- **M2M table naming** - Django auto-generates intermediate table
- **Query optimization** - Use prefetch_related() for permissions

---

## Summary

This document covered the creation of the PermissionGroup model (Tasks 20-22), which provides:

✓ **PermissionGroup Model** - Container for grouping related permissions  
✓ **group_name Field** - Unique identifier for permission groups  
✓ **permissions ManyToManyField** - Relationship to Permission model  
✓ **Helper Methods** - Easy permission management  
✓ **Usage Examples** - Clear implementation patterns

**Next Steps:** Proceed to [03_Tasks-23-24_Constants-Definition.md](03_Tasks-23-24_Constants-Definition.md) to define module and action constants.
