# Tasks 15-19: Permission Model Definition

> **Phase:** 03 - Core Backend Infrastructure  
> **SubPhase:** 05 - Role & Permission System  
> **Group:** B - Permission Model  
> **Document:** 01 of 04  
> **Tasks Covered:** 15, 16, 17, 18, 19

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Group:** [../Group-A_Role-Model-Foundation/](../Group-A_Role-Model-Foundation/)
- **→ Next Document:** [02_Tasks-20-22_PermissionGroup-Model.md](02_Tasks-20-22_PermissionGroup-Model.md)

---

## Document Overview

This document covers the creation of the Permission model with all required fields. The model defines granular access rights organized by module and action type with a unique codename identifier.

### Tasks in This Document
| Task # | Task Name | Complexity |
|--------|-----------|------------|
| 15 | Create Permission Model Class | Simple |
| 16 | Add codename Field | Medium |
| 17 | Add name Field | Simple |
| 18 | Add module Field | Medium |
| 19 | Add action Field | Medium |

---

## Task 15: Create Permission Model Class

### Overview
Define the Permission model class that extends BaseModel and serves as the foundation for the granular permission system.

### Dependencies
- SubPhase-03: Base Models & Mixins (BaseModel available)
- Group-A: Role Model Foundation (understanding of RBAC architecture)

### Instructions

1. **Create the permission.py file**
   - Navigate to `backend/apps/users/models/`
   - Create new file named `permission.py`

2. **Add necessary imports**
   - Import Django model components
   - Import BaseModel from core.models
   - Import validation utilities

3. **Define the Permission model class**
   - Create class `Permission` extending `BaseModel`
   - BaseModel provides: id, created_at, updated_at, is_active fields

4. **Add class docstring**
   - Document the permission model purpose
   - Explain codename format: `{module}.{action}_{resource}`
   - Describe module and action organization
   - Note unique constraints

5. **Add initial class attributes placeholder**
   - Comment for objects manager
   - Comment for field definitions (next tasks)

### Class Definition Structure

```python
from django.db import models
from django.core.exceptions import ValidationError
from core.models import BaseModel


class Permission(BaseModel):
    """
    Permission model for granular access control.
    
    Codename Format: {module}.{action}_{resource}
    Example: 'products.view_product', 'sales.add_order'
    
    Features:
    - Unique codename for each permission
    - Organized by module (products, sales, inventory)
    - Action-based (view, add, change, delete)
    - Human-readable name for UI display
    - Module and action choices from constants
    
    Usage:
    - Assigned to roles via Role.permissions ManyToMany
    - Grouped in PermissionGroup for easier management
    - Used in permission checks throughout the application
    """
    
    # Fields will be added in next tasks
    # Manager will be added later if needed
    # Meta will be added later
```

### Expected Outcome

After completing this task:
- `permission.py` file exists in `backend/apps/users/models/`
- Permission model class is defined extending BaseModel
- Class docstring documents codename format and features
- Structure is ready for field definitions

### Verification Checklist
- [ ] `permission.py` file created in models directory
- [ ] Permission class extends BaseModel
- [ ] Comprehensive docstring is included
- [ ] Imports are correct and complete
- [ ] File follows project code style

---

## Task 16: Add codename Field

### Overview
Add the codename field that serves as the unique identifier for each permission, following the format `{module}.{action}_{resource}`.

### Dependencies
- Task 15: Create Permission Model Class

### Instructions

1. **Define the codename field**
   - Type: `CharField`
   - Max length: 100 characters
   - Unique constraint: True
   - Database index: True for fast lookups

2. **Add validation**
   - Format: `{module}.{action}_{resource}`
   - Must contain exactly one period
   - Module prefix must be valid
   - Action must be valid CRUD operation

3. **Add field docstring**
   - Explain format requirements
   - Provide examples
   - Note uniqueness constraint

4. **Add verbose name**
   - Set verbose_name for admin display

### Field Definition

```python
class Permission(BaseModel):
    """[Previous docstring]"""
    
    codename = models.CharField(
        max_length=100,
        unique=True,
        db_index=True,
        verbose_name='Permission Codename',
        help_text=(
            'Unique permission identifier. '
            'Format: {module}.{action}_{resource} '
            'Example: products.view_product, sales.add_order'
        )
    )
```

### Codename Format Examples

| Module | Action | Resource | Full Codename |
|--------|--------|----------|---------------|
| products | view | product | `products.view_product` |
| products | add | product | `products.add_product` |
| products | change | product | `products.change_product` |
| products | delete | product | `products.delete_product` |
| inventory | view | stock | `inventory.view_stock` |
| inventory | change | stock | `inventory.change_stock` |
| sales | view | order | `sales.view_order` |
| sales | add | order | `sales.add_order` |
| reports | view | sales_report | `reports.view_sales_report` |
| settings | change | tenant_settings | `settings.change_tenant_settings` |

### Validation Rules

| Rule | Description | Example |
|------|-------------|---------|
| Format | Must contain exactly one period | ✓ `products.add_product` ✗ `products_add_product` |
| Length | Maximum 100 characters | ✓ `reports.view_sales_report` ✗ Too long |
| Uniqueness | No duplicate codenames | ✓ Unique across all permissions |
| Lowercase | Codename should be lowercase | ✓ `products.view_product` ✗ `Products.View_Product` |

### Expected Outcome

After completing this task:
- codename field is defined with proper constraints
- Field has unique and db_index attributes
- Help text explains format requirements
- Field is ready for data validation

### Verification Checklist
- [ ] codename field added with CharField type
- [ ] max_length is 100
- [ ] unique constraint is True
- [ ] db_index is True for performance
- [ ] help_text explains format with examples
- [ ] Field follows Django naming conventions

---

## Task 17: Add name Field

### Overview
Add the name field that provides a human-readable description of the permission for display in user interfaces.

### Dependencies
- Task 16: Add codename Field

### Instructions

1. **Define the name field**
   - Type: `CharField`
   - Max length: 255 characters
   - Allow blank: False (required)
   - Database index: False (not needed for lookups)

2. **Add field docstring**
   - Explain purpose: human-readable display
   - Provide examples
   - Note usage in admin and UI

3. **Add verbose name**
   - Set verbose_name for admin display

### Field Definition

```python
class Permission(BaseModel):
    """[Previous docstring]"""
    
    codename = models.CharField(...)  # From Task 16
    
    name = models.CharField(
        max_length=255,
        verbose_name='Permission Name',
        help_text=(
            'Human-readable permission name for display in UI. '
            'Example: "View Product", "Add Sales Order", "Delete Customer"'
        )
    )
```

### Name Examples

| Codename | Name | Usage Context |
|----------|------|---------------|
| `products.view_product` | View Product | Display in role editor |
| `products.add_product` | Add Product | Permission selection dropdown |
| `products.change_product` | Edit Product | User permission list |
| `products.delete_product` | Delete Product | Role assignment interface |
| `inventory.view_stock` | View Stock Level | Admin panel |
| `sales.add_order` | Create Sales Order | Permission group UI |
| `reports.view_sales_report` | View Sales Report | Access control display |
| `customers.delete_customer` | Delete Customer | Audit log display |

### Naming Conventions

| Convention | Description | Example |
|------------|-------------|---------|
| **Action First** | Start with action verb | ✓ "View Product" ✗ "Product View" |
| **Title Case** | Capitalize each word | ✓ "View Sales Report" ✗ "view sales report" |
| **Descriptive** | Clear and specific | ✓ "Edit Customer Details" ✗ "Edit" |
| **Consistent** | Follow same pattern | ✓ "View/Add/Edit/Delete" not "Read/Create/Modify" |

### Expected Outcome

After completing this task:
- name field is defined for human-readable display
- Field has appropriate max_length
- Help text provides clear examples
- Field is ready for UI rendering

### Verification Checklist
- [ ] name field added with CharField type
- [ ] max_length is 255
- [ ] Field is required (blank=False)
- [ ] help_text explains purpose with examples
- [ ] verbose_name is set appropriately
- [ ] Field follows naming conventions

---

## Task 18: Add module Field

### Overview
Add the module field that categorizes permissions by functional module (e.g., products, sales, inventory).

### Dependencies
- Task 17: Add name Field
- Task 23: Define Module Constants (forward reference)

### Instructions

1. **Define the module field**
   - Type: `CharField`
   - Max length: 50 characters
   - Choices: From ModuleChoices (will be defined in Task 23)
   - Database index: True for filtering
   - Allow blank: False (required)

2. **Add field docstring**
   - Explain module grouping purpose
   - Reference ModuleChoices
   - Provide module examples

3. **Add verbose name**
   - Set verbose_name for admin display

### Field Definition

```python
class Permission(BaseModel):
    """[Previous docstring]"""
    
    codename = models.CharField(...)  # From Task 16
    name = models.CharField(...)      # From Task 17
    
    module = models.CharField(
        max_length=50,
        choices=[],  # Will be set to ModuleChoices.choices in Task 23
        db_index=True,
        verbose_name='Module',
        help_text=(
            'Module that this permission belongs to. '
            'Example: products, sales, inventory, customers'
        )
    )
```

### Module Organization

| Module | Description | Permission Examples |
|--------|-------------|---------------------|
| **products** | Product management | view_product, add_product, change_product |
| **inventory** | Stock management | view_stock, adjust_stock, view_stock_movement |
| **sales** | Sales operations | view_order, add_order, process_payment |
| **customers** | Customer management | view_customer, add_customer, edit_customer |
| **vendors** | Vendor management | view_vendor, add_vendor, manage_purchase_order |
| **hr** | Human resources | view_employee, manage_payroll, view_attendance |
| **accounting** | Financial operations | view_ledger, create_invoice, reconcile_account |
| **reports** | Reporting system | view_sales_report, export_report, view_analytics |
| **settings** | System settings | change_tenant_settings, manage_integrations |

### Module-Based Permission Filtering

```python
# Example: Get all product permissions
product_permissions = Permission.objects.filter(module='products')

# Example: Get all view permissions across modules
view_permissions = Permission.objects.filter(action='view')

# Example: Get permissions for specific module-action combination
product_view_permissions = Permission.objects.filter(
    module='products',
    action='view'
)
```

### Expected Outcome

After completing this task:
- module field is defined with choices placeholder
- Field has db_index for efficient filtering
- Help text explains module grouping
- Field is ready for ModuleChoices integration

### Verification Checklist
- [ ] module field added with CharField type
- [ ] max_length is 50
- [ ] choices parameter included (empty for now)
- [ ] db_index is True for filtering performance
- [ ] help_text explains module purpose
- [ ] Field is required (blank=False)
- [ ] verbose_name is set appropriately

---

## Task 19: Add action Field

### Overview
Add the action field that defines the type of operation (view, add, change, delete) for each permission.

### Dependencies
- Task 18: Add module Field
- Task 24: Define Action Constants (forward reference)

### Instructions

1. **Define the action field**
   - Type: `CharField`
   - Max length: 20 characters
   - Choices: From ActionChoices (will be defined in Task 24)
   - Database index: True for filtering
   - Allow blank: False (required)

2. **Add field docstring**
   - Explain CRUD action types
   - Reference ActionChoices
   - Provide action examples

3. **Add verbose name**
   - Set verbose_name for admin display

### Field Definition

```python
class Permission(BaseModel):
    """[Previous docstring]"""
    
    codename = models.CharField(...)  # From Task 16
    name = models.CharField(...)      # From Task 17
    module = models.CharField(...)    # From Task 18
    
    action = models.CharField(
        max_length=20,
        choices=[],  # Will be set to ActionChoices.choices in Task 24
        db_index=True,
        verbose_name='Action',
        help_text=(
            'Type of action this permission grants. '
            'Example: view, add, change, delete'
        )
    )
```

### Action Types

| Action | Description | Permission Examples | HTTP Methods |
|--------|-------------|---------------------|--------------|
| **view** | Read access to resources | `products.view_product`, `sales.view_order` | GET, HEAD |
| **add** | Create new resources | `products.add_product`, `customers.add_customer` | POST |
| **change** | Update existing resources | `inventory.change_stock`, `sales.change_order` | PUT, PATCH |
| **delete** | Remove resources | `products.delete_product`, `customers.delete_customer` | DELETE |

### Action-Based Permission Patterns

```python
# Pattern 1: All CRUD permissions for a resource
PRODUCT_PERMISSIONS = [
    'products.view_product',
    'products.add_product',
    'products.change_product',
    'products.delete_product',
]

# Pattern 2: Read-only access
READONLY_PERMISSIONS = [
    'products.view_product',
    'inventory.view_stock',
    'sales.view_order',
    'reports.view_sales_report',
]

# Pattern 3: Full management access (excluding delete)
MANAGER_PERMISSIONS = [
    'products.view_product',
    'products.add_product',
    'products.change_product',
    # Delete permission excluded for safety
]
```

### Action Hierarchy (for future role implementation)

| Level | Actions Allowed | Use Case |
|-------|-----------------|----------|
| **Read-Only** | view | Customer, Viewer roles |
| **Basic User** | view, add | Staff creating records |
| **Editor** | view, add, change | Department managers |
| **Full Access** | view, add, change, delete | Admin roles |

### Expected Outcome

After completing this task:
- action field is defined with choices placeholder
- Field has db_index for efficient filtering
- Help text explains CRUD action types
- Field is ready for ActionChoices integration

### Verification Checklist
- [ ] action field added with CharField type
- [ ] max_length is 20
- [ ] choices parameter included (empty for now)
- [ ] db_index is True for filtering performance
- [ ] help_text explains action types
- [ ] Field is required (blank=False)
- [ ] verbose_name is set appropriately

---

## Complete Model Preview

### Permission Model After Tasks 15-19

```python
from django.db import models
from core.models import BaseModel


class Permission(BaseModel):
    """
    Permission model for granular access control.
    
    Codename Format: {module}.{action}_{resource}
    Example: 'products.view_product', 'sales.add_order'
    
    Features:
    - Unique codename for each permission
    - Organized by module (products, sales, inventory)
    - Action-based (view, add, change, delete)
    - Human-readable name for UI display
    - Module and action choices from constants
    
    Usage:
    - Assigned to roles via Role.permissions ManyToMany
    - Grouped in PermissionGroup for easier management
    - Used in permission checks throughout the application
    """
    
    codename = models.CharField(
        max_length=100,
        unique=True,
        db_index=True,
        verbose_name='Permission Codename',
        help_text=(
            'Unique permission identifier. '
            'Format: {module}.{action}_{resource} '
            'Example: products.view_product, sales.add_order'
        )
    )
    
    name = models.CharField(
        max_length=255,
        verbose_name='Permission Name',
        help_text=(
            'Human-readable permission name for display in UI. '
            'Example: "View Product", "Add Sales Order", "Delete Customer"'
        )
    )
    
    module = models.CharField(
        max_length=50,
        choices=[],  # Will be set to ModuleChoices.choices in Task 23
        db_index=True,
        verbose_name='Module',
        help_text=(
            'Module that this permission belongs to. '
            'Example: products, sales, inventory, customers'
        )
    )
    
    action = models.CharField(
        max_length=20,
        choices=[],  # Will be set to ActionChoices.choices in Task 24
        db_index=True,
        verbose_name='Action',
        help_text=(
            'Type of action this permission grants. '
            'Example: view, add, change, delete'
        )
    )
    
    class Meta:
        db_table = 'permissions'
        verbose_name = 'Permission'
        verbose_name_plural = 'Permissions'
        ordering = ['module', 'action', 'codename']
        indexes = [
            models.Index(fields=['module', 'action']),
        ]
    
    def __str__(self):
        return f"{self.name} ({self.codename})"
```

### Expected File Structure

```
backend/apps/users/
├── models/
│   ├── __init__.py
│   ├── role.py                 # From Group A
│   └── permission.py           # New file (this group)
│       └── class Permission(BaseModel)
│           ├── codename: CharField (unique)
│           ├── name: CharField
│           ├── module: CharField (choices)
│           └── action: CharField (choices)
```

---

## Next Steps

After completing Tasks 15-19:
1. Proceed to [02_Tasks-20-22_PermissionGroup-Model.md](02_Tasks-20-22_PermissionGroup-Model.md)
2. Create PermissionGroup model for organizing permissions
3. Add ManyToMany relationship to Permission
4. Define Module and Action constants (Tasks 23-24)
5. Create default permissions via data migration (Tasks 25-30)

---

## Notes for AI Agents

### Implementation Order
1. Create Permission model class
2. Add codename field (unique identifier)
3. Add name field (human-readable)
4. Add module field (for grouping)
5. Add action field (CRUD type)
6. Choices will be populated in Tasks 23-24

### Database Indexes
- codename: unique + indexed
- module: indexed for filtering
- action: indexed for filtering
- Composite index on (module, action)

### Validation Considerations
- Codename format validation can be added later
- Module and action validation handled by choices
- Name should be descriptive and user-friendly
- Consider adding custom validators in future

### Integration Points
- Will be used by Role.permissions ManyToMany
- Will be grouped by PermissionGroup
- Module/Action choices defined in Tasks 23-24
- Default permissions created in Task 25

