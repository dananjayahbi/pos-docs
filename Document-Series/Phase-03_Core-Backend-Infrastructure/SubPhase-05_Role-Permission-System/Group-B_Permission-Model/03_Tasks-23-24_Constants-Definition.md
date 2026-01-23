# Tasks 23-24: Constants Definition

> **Phase:** 03 - Core Backend Infrastructure  
> **SubPhase:** 05 - Role & Permission System  
> **Group:** B - Permission Model  
> **Document:** 03 of 04  
> **Tasks Covered:** 23, 24

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [02_Tasks-20-22_PermissionGroup-Model.md](02_Tasks-20-22_PermissionGroup-Model.md)
- **→ Next Document:** [04_Tasks-25-30_Default-Permissions.md](04_Tasks-25-30_Default-Permissions.md)

---

## Document Overview

This document covers the creation of constants using Django's TextChoices for module and action types. These constants provide standardized enums for the Permission model's module and action fields, ensuring consistent permission naming and organization across the system.

### Tasks in This Document
| Task # | Task Name | Complexity |
|--------|-----------|------------|
| 23 | Define Module Constants | Simple |
| 24 | Define Action Constants | Simple |

---

## Task 23: Define Module Constants

### Overview
Create the ModuleChoices enum class using Django's TextChoices to define all available modules in the system. These constants are used by the Permission model's module field to categorize permissions.

### Dependencies
- Task 18: Add module Field (Permission Model)

### Instructions

1. **Open the permission.py file**
   - Navigate to `backend/apps/users/models/permission.py`
   - Locate the area before the Permission model class

2. **Import Django's TextChoices**
   - Add import: `from django.db import models`
   - Ensure TextChoices is available from models

3. **Create the ModuleChoices class**
   - Define class inheriting from `models.TextChoices`
   - Add docstring explaining purpose

4. **Define PRODUCTS constant**
   - Value: `'products'`
   - Label: `'Products'`
   - For product management permissions

5. **Define INVENTORY constant**
   - Value: `'inventory'`
   - Label: `'Inventory'`
   - For inventory/stock management permissions

6. **Define SALES constant**
   - Value: `'sales'`
   - Label: `'Sales'`
   - For sales, orders, and invoices permissions

7. **Define CUSTOMERS constant**
   - Value: `'customers'`
   - Label: `'Customers'`
   - For customer management permissions

8. **Define VENDORS constant**
   - Value: `'vendors'`
   - Label: `'Vendors'`
   - For vendor/supplier management permissions

9. **Define HR constant**
   - Value: `'hr'`
   - Label: `'Human Resources'`
   - For employee management permissions

10. **Define ACCOUNTING constant**
    - Value: `'accounting'`
    - Label: `'Accounting'`
    - For financial management permissions

11. **Define REPORTS constant**
    - Value: `'reports'`
    - Label: `'Reports'`
    - For reporting and analytics permissions

12. **Define SETTINGS constant**
    - Value: `'settings'`
    - Label: `'Settings'`
    - For system configuration permissions

### Code Structure

```python
class ModuleChoices(models.TextChoices):
    """
    Enum defining all available modules in the system.
    Used by Permission.module field.
    """
    PRODUCTS = 'products', 'Products'
    INVENTORY = 'inventory', 'Inventory'
    SALES = 'sales', 'Sales'
    CUSTOMERS = 'customers', 'Customers'
    VENDORS = 'vendors', 'Vendors'
    HR = 'hr', 'Human Resources'
    ACCOUNTING = 'accounting', 'Accounting'
    REPORTS = 'reports', 'Reports'
    SETTINGS = 'settings', 'Settings'
```

### Module Descriptions
| Module | Value | Purpose |
|--------|-------|---------|
| **PRODUCTS** | `products` | Product catalog, pricing, categories |
| **INVENTORY** | `inventory` | Stock levels, warehouses, transfers |
| **SALES** | `sales` | Orders, invoices, payments |
| **CUSTOMERS** | `customers` | Customer database, contact management |
| **VENDORS** | `vendors` | Supplier management, purchase orders |
| **HR** | `hr` | Employee records, attendance, payroll |
| **ACCOUNTING** | `accounting` | Chart of accounts, journal entries, financial reports |
| **REPORTS** | `reports` | Analytics, dashboards, custom reports |
| **SETTINGS** | `settings` | System configuration, user preferences |

### Expected Outcome
```python
# Usage in Permission model
module = models.CharField(
    max_length=50,
    choices=ModuleChoices.choices,
    help_text="Module this permission belongs to"
)

# Usage in queries
permissions = Permission.objects.filter(module=ModuleChoices.PRODUCTS)
```

### Verification Checklist
- [ ] `ModuleChoices` class created in permission.py
- [ ] Inherits from `models.TextChoices`
- [ ] All 9 modules are defined (PRODUCTS, INVENTORY, SALES, CUSTOMERS, VENDORS, HR, ACCOUNTING, REPORTS, SETTINGS)
- [ ] Each constant has correct value and label
- [ ] Docstring explains purpose
- [ ] Can be imported: `from apps.users.models.permission import ModuleChoices`

---

## Task 24: Define Action Constants

### Overview
Create the ActionChoices enum class using Django's TextChoices to define CRUD action types. These constants are used by the Permission model's action field to specify what operation a permission grants.

### Dependencies
- Task 19: Add action Field (Permission Model)

### Instructions

1. **Open the permission.py file**
   - Navigate to `backend/apps/users/models/permission.py`
   - Locate the area after ModuleChoices class

2. **Create the ActionChoices class**
   - Define class inheriting from `models.TextChoices`
   - Add docstring explaining CRUD actions

3. **Define VIEW constant**
   - Value: `'view'`
   - Label: `'View'`
   - For read/view access permissions
   - Corresponds to HTTP GET operations

4. **Define ADD constant**
   - Value: `'add'`
   - Label: `'Add'`
   - For create/add new records permissions
   - Corresponds to HTTP POST operations

5. **Define CHANGE constant**
   - Value: `'change'`
   - Label: `'Change'`
   - For update/modify existing records permissions
   - Corresponds to HTTP PUT/PATCH operations

6. **Define DELETE constant**
   - Value: `'delete'`
   - Label: `'Delete'`
   - For remove/delete records permissions
   - Corresponds to HTTP DELETE operations

### Code Structure

```python
class ActionChoices(models.TextChoices):
    """
    Enum defining CRUD action types for permissions.
    Used by Permission.action field.
    """
    VIEW = 'view', 'View'      # Read access
    ADD = 'add', 'Add'         # Create access
    CHANGE = 'change', 'Change' # Update access
    DELETE = 'delete', 'Delete' # Delete access
```

### Action Descriptions
| Action | Value | HTTP Method | Description |
|--------|-------|-------------|-------------|
| **VIEW** | `view` | GET | Read access to view records |
| **ADD** | `add` | POST | Create access to add new records |
| **CHANGE** | `change` | PUT/PATCH | Update access to modify existing records |
| **DELETE** | `delete` | DELETE | Delete access to remove records |

### Permission Codename Pattern
When combined with modules, actions form permission codenames:
```
{module}.{action}_{resource}

Examples:
- products.view_product
- products.add_product
- products.change_product
- products.delete_product
- inventory.view_stock
- sales.add_order
- reports.view_sales_report
```

### Expected Outcome
```python
# Usage in Permission model
action = models.CharField(
    max_length=10,
    choices=ActionChoices.choices,
    help_text="CRUD action type"
)

# Usage in permission checks
if user.has_perm('products.add'):
    # User can add products
    pass

# Usage in queries
view_permissions = Permission.objects.filter(action=ActionChoices.VIEW)
```

### Verification Checklist
- [ ] `ActionChoices` class created in permission.py
- [ ] Inherits from `models.TextChoices`
- [ ] All 4 actions are defined (VIEW, ADD, CHANGE, DELETE)
- [ ] Each constant has correct value and label
- [ ] Docstring explains CRUD operations
- [ ] Inline comments indicate HTTP method mapping
- [ ] Can be imported: `from apps.users.models.permission import ActionChoices`

---

## Integration Points

### With Permission Model
```python
class Permission(BaseModel):
    """Individual permission definition."""
    
    codename = models.CharField(
        max_length=100,
        unique=True,
        help_text="Permission codename (e.g., products.view_product)"
    )
    
    name = models.CharField(
        max_length=255,
        help_text="Human-readable permission name"
    )
    
    module = models.CharField(
        max_length=50,
        choices=ModuleChoices.choices,  # Uses ModuleChoices
        help_text="Module this permission belongs to"
    )
    
    action = models.CharField(
        max_length=10,
        choices=ActionChoices.choices,  # Uses ActionChoices
        help_text="CRUD action type"
    )
    
    class Meta:
        db_table = 'users_permission'
        verbose_name = 'Permission'
        verbose_name_plural = 'Permissions'
        unique_together = [['module', 'action', 'codename']]
        ordering = ['module', 'action', 'codename']
```

### With Permission Creation
```python
# Creating permissions using constants
Permission.objects.create(
    codename='products.view_product',
    name='Can view products',
    module=ModuleChoices.PRODUCTS,
    action=ActionChoices.VIEW
)

Permission.objects.create(
    codename='inventory.add_stock',
    name='Can add stock items',
    module=ModuleChoices.INVENTORY,
    action=ActionChoices.ADD
)
```

### With Query Filters
```python
# Filter by module
products_permissions = Permission.objects.filter(
    module=ModuleChoices.PRODUCTS
)

# Filter by action
view_permissions = Permission.objects.filter(
    action=ActionChoices.VIEW
)

# Filter by both
view_product_perms = Permission.objects.filter(
    module=ModuleChoices.PRODUCTS,
    action=ActionChoices.VIEW
)

# Get all modules
all_modules = ModuleChoices.values

# Get all actions
all_actions = ActionChoices.values
```

---

## Testing Considerations

### Unit Tests for ModuleChoices
```python
def test_module_choices_values():
    """Test all module choice values are correct."""
    assert ModuleChoices.PRODUCTS == 'products'
    assert ModuleChoices.INVENTORY == 'inventory'
    assert ModuleChoices.SALES == 'sales'
    assert ModuleChoices.CUSTOMERS == 'customers'
    assert ModuleChoices.VENDORS == 'vendors'
    assert ModuleChoices.HR == 'hr'
    assert ModuleChoices.ACCOUNTING == 'accounting'
    assert ModuleChoices.REPORTS == 'reports'
    assert ModuleChoices.SETTINGS == 'settings'

def test_module_choices_labels():
    """Test all module choice labels are correct."""
    assert ModuleChoices.PRODUCTS.label == 'Products'
    assert ModuleChoices.HR.label == 'Human Resources'
    assert ModuleChoices.ACCOUNTING.label == 'Accounting'
```

### Unit Tests for ActionChoices
```python
def test_action_choices_values():
    """Test all action choice values are correct."""
    assert ActionChoices.VIEW == 'view'
    assert ActionChoices.ADD == 'add'
    assert ActionChoices.CHANGE == 'change'
    assert ActionChoices.DELETE == 'delete'

def test_action_choices_labels():
    """Test all action choice labels are correct."""
    assert ActionChoices.VIEW.label == 'View'
    assert ActionChoices.ADD.label == 'Add'
    assert ActionChoices.CHANGE.label == 'Change'
    assert ActionChoices.DELETE.label == 'Delete'

def test_action_crud_completeness():
    """Test all CRUD operations are covered."""
    actions = [choice[0] for choice in ActionChoices.choices]
    assert 'view' in actions  # Read
    assert 'add' in actions   # Create
    assert 'change' in actions # Update
    assert 'delete' in actions # Delete
```

### Integration Tests
```python
def test_permission_with_module_choices():
    """Test creating permission with ModuleChoices."""
    permission = Permission.objects.create(
        codename='products.view_product',
        name='Can view products',
        module=ModuleChoices.PRODUCTS,
        action=ActionChoices.VIEW
    )
    assert permission.module == 'products'
    assert permission.get_module_display() == 'Products'

def test_permission_with_action_choices():
    """Test creating permission with ActionChoices."""
    permission = Permission.objects.create(
        codename='sales.add_order',
        name='Can add orders',
        module=ModuleChoices.SALES,
        action=ActionChoices.ADD
    )
    assert permission.action == 'add'
    assert permission.get_action_display() == 'Add'
```

---

## Sri Lanka-Specific Considerations

### Localization Support
```python
# Future: Add Sinhala/Tamil translations
class ModuleChoices(models.TextChoices):
    PRODUCTS = 'products', _('Products')  # භාණ්ඩ / பொருட்கள்
    INVENTORY = 'inventory', _('Inventory')  # තොග / சரக்கு
    SALES = 'sales', _('Sales')  # විකුණුම් / விற்பனை
    # ... etc
```

### Module Priority
For Sri Lankan SME context, typical importance order:
1. **SALES** - Primary business function
2. **PRODUCTS** - Core inventory items
3. **INVENTORY** - Stock management
4. **CUSTOMERS** - Customer relationships
5. **ACCOUNTING** - Financial compliance
6. **REPORTS** - Business insights
7. **VENDORS** - Supplier management
8. **HR** - Staff management
9. **SETTINGS** - System configuration

---

## Common Patterns

### Creating Permissions for a Module
```python
def create_module_permissions(module, resource_name):
    """Create all CRUD permissions for a module resource."""
    permissions = []
    
    for action in ActionChoices:
        permission = Permission.objects.create(
            codename=f'{module}.{action.value}_{resource_name}',
            name=f'Can {action.label.lower()} {resource_name}',
            module=module,
            action=action.value
        )
        permissions.append(permission)
    
    return permissions

# Usage
product_permissions = create_module_permissions(
    ModuleChoices.PRODUCTS,
    'product'
)
```

### Permission Check Helper
```python
def check_module_action_permission(user, module, action):
    """Check if user has permission for module and action."""
    # Check user's role permissions
    return user.role.permissions.filter(
        module=module,
        action=action
    ).exists()

# Usage
if check_module_action_permission(user, ModuleChoices.PRODUCTS, ActionChoices.VIEW):
    # User can view products
    pass
```

---

## Expected File Structure

```
backend/apps/users/models/
├── __init__.py
└── permission.py
    ├── ModuleChoices (TextChoices)
    │   ├── PRODUCTS = 'products', 'Products'
    │   ├── INVENTORY = 'inventory', 'Inventory'
    │   ├── SALES = 'sales', 'Sales'
    │   ├── CUSTOMERS = 'customers', 'Customers'
    │   ├── VENDORS = 'vendors', 'Vendors'
    │   ├── HR = 'hr', 'Human Resources'
    │   ├── ACCOUNTING = 'accounting', 'Accounting'
    │   ├── REPORTS = 'reports', 'Reports'
    │   └── SETTINGS = 'settings', 'Settings'
    ├── ActionChoices (TextChoices)
    │   ├── VIEW = 'view', 'View'
    │   ├── ADD = 'add', 'Add'
    │   ├── CHANGE = 'change', 'Change'
    │   └── DELETE = 'delete', 'Delete'
    ├── Permission (Model)
    │   ├── codename: CharField
    │   ├── name: CharField
    │   ├── module: CharField (choices=ModuleChoices.choices)
    │   └── action: CharField (choices=ActionChoices.choices)
    └── PermissionGroup (Model)
        ├── group_name: CharField
        └── permissions: ManyToManyField
```

---

## Summary

This document defined the constants for the Permission system:

### ModuleChoices (Task 23)
- **Purpose:** Define all system modules
- **Implementation:** Django TextChoices enum
- **Modules:** 9 total (products, inventory, sales, customers, vendors, hr, accounting, reports, settings)
- **Usage:** Permission.module field choices

### ActionChoices (Task 24)
- **Purpose:** Define CRUD action types
- **Implementation:** Django TextChoices enum
- **Actions:** 4 total (view, add, change, delete)
- **Usage:** Permission.action field choices

These constants provide type safety, consistency, and autocomplete support throughout the codebase. They enable standardized permission naming and organization across all modules.

---

## Next Steps

1. **DOC-04:** Create default permissions for each module (Tasks 25-30)
   - Implement data migration
   - Create permission sets per module
   - Document permission structure
   - Add admin interface support

---

## Related Documentation

- **Previous:** [02_Tasks-20-22_PermissionGroup-Model.md](02_Tasks-20-22_PermissionGroup-Model.md)
- **Next:** [04_Tasks-25-30_Default-Permissions.md](04_Tasks-25-30_Default-Permissions.md)
- **Group Overview:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **SubPhase Overview:** [../00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
