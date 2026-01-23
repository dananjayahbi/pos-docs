# Tasks 25-30: Default Permissions

> **Phase:** 03 - Core Backend Infrastructure  
> **SubPhase:** 05 - Role & Permission System  
> **Group:** B - Permission Model  
> **Document:** 04 of 04  
> **Tasks Covered:** 25, 26, 27, 28, 29, 30

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [03_Tasks-23-24_Constants-Definition.md](03_Tasks-23-24_Constants-Definition.md)
- **→ Next Group:** [../Group-C_Role-Permission-Assignment/](../Group-C_Role-Permission-Assignment/)

---

## Document Overview

This document covers the creation of default permissions for all major modules in the system through a data migration. Each module receives a set of CRUD permissions (view, add, change, delete) that follow a standardized naming convention. This migration establishes the foundation for role-based access control across the platform.

### Tasks in This Document
| Task # | Task Name | Complexity |
|--------|-----------|------------|
| 25 | Create Default Permissions Migration | Medium |
| 26 | Products Module Permissions | Simple |
| 27 | Inventory Module Permissions | Simple |
| 28 | Sales Module Permissions | Simple |
| 29 | Reports Module Permissions | Medium |
| 30 | Document Permissions | Simple |

---

## Task 25: Create Default Permissions Migration

### Overview
Create a Django data migration that will populate the Permission table with all default permissions for the system. This migration creates permissions systematically for each module following the codename format: `{module}.{action}_{resource}`.

### Dependencies
- Task 19: Add action Field (Permission Model)
- Task 23: Define Module Constants
- Task 24: Define Action Constants

### Instructions

1. **Generate the empty migration file**
   - Navigate to `backend/` directory
   - Run: `python manage.py makemigrations users --empty --name create_default_permissions`
   - Locate the new migration file in `backend/apps/users/migrations/`

2. **Import required modules**
   - Add imports at the top of the migration file:
   ```python
   from django.db import migrations
   from django.utils import timezone
   ```

3. **Create the forward migration function**
   - Define function: `def create_default_permissions(apps, schema_editor)`
   - Get the Permission model: `Permission = apps.get_model('users', 'Permission')`
   - Create a list to hold all permission instances

4. **Define permission creation helper**
   - Create helper function to construct permission dictionaries
   - Parameters: module, action, resource, description
   - Return dictionary with: codename, name, module, action, description

5. **Set up batch creation**
   - Collect all permissions in a list
   - Use `Permission.objects.bulk_create()` for efficiency
   - Include timestamp fields: created_at, updated_at

6. **Create the reverse migration function**
   - Define function: `def delete_default_permissions(apps, schema_editor)`
   - Get the Permission model
   - Delete all created permissions: `Permission.objects.filter(codename__in=[...]).delete()`

7. **Register the migration operations**
   - Add to operations list:
   ```python
   operations = [
       migrations.RunPython(
           create_default_permissions,
           reverse_code=delete_default_permissions
       ),
   ]
   ```

8. **Add migration metadata**
   - Set appropriate dependencies
   - Add docstring explaining the migration purpose

### Permission Creation Pattern

```python
def create_permission(module, action, resource, description):
    """Helper to create permission dictionary."""
    return {
        'codename': f'{module}.{action}_{resource}',
        'name': f'Can {action} {resource}',
        'module': module,
        'action': action,
        'description': description,
        'created_at': timezone.now(),
        'updated_at': timezone.now(),
    }
```

### Expected Outcome
```
backend/apps/users/migrations/
├── 0001_initial.py
├── 0002_create_role_model.py
├── 0003_create_permission_model.py
└── 0004_create_default_permissions.py    # New migration
```

### Verification Checklist
- [ ] Migration file exists with correct name
- [ ] Forward function creates all permissions
- [ ] Reverse function deletes created permissions
- [ ] Helper function follows naming convention
- [ ] Bulk create is used for efficiency
- [ ] All required imports are present
- [ ] Migration has proper dependencies

---

## Task 26: Products Module Permissions

### Overview
Define and create all permissions for the Products module, which manages product catalog, pricing, categories, and product information. This includes CRUD operations and specialized permissions for product management.

### Dependencies
- Task 25: Create Default Permissions Migration

### Instructions

1. **Add products permissions to migration**
   - In the `create_default_permissions` function
   - Create permissions for products module

2. **Define standard CRUD permissions**
   - **view_product:** View product list and details
   - **add_product:** Create new products
   - **change_product:** Edit product information
   - **delete_product:** Delete products

3. **Add product category permissions**
   - **view_category:** View product categories
   - **add_category:** Create new categories
   - **change_category:** Edit categories
   - **delete_category:** Delete categories

4. **Add product pricing permissions**
   - **view_pricing:** View product prices
   - **change_pricing:** Update product prices
   - **approve_pricing:** Approve price changes

5. **Add product inventory link permissions**
   - **view_product_stock:** View product stock levels
   - **adjust_product_stock:** Adjust stock for products

6. **Add product image permissions**
   - **upload_product_image:** Upload product images
   - **delete_product_image:** Remove product images

7. **Add product bulk operations permissions**
   - **import_products:** Bulk import products
   - **export_products:** Export product data

8. **Build the permissions list**
   ```python
   products_permissions = [
       create_permission('products', 'view', 'product', 
           'Can view product list and details'),
       create_permission('products', 'add', 'product', 
           'Can create new products in catalog'),
       create_permission('products', 'change', 'product', 
           'Can edit existing product information'),
       create_permission('products', 'delete', 'product', 
           'Can delete products from catalog'),
       # Add remaining permissions...
   ]
   ```

### Products Module Permission Summary

| Codename | Description | Typical Roles |
|----------|-------------|---------------|
| products.view_product | View products | All staff |
| products.add_product | Create products | Manager, Admin |
| products.change_product | Edit products | Manager, Admin |
| products.delete_product | Delete products | Admin only |
| products.view_category | View categories | All staff |
| products.add_category | Create categories | Manager, Admin |
| products.change_category | Edit categories | Manager, Admin |
| products.delete_category | Delete categories | Admin only |
| products.view_pricing | View prices | All staff |
| products.change_pricing | Update prices | Manager, Admin |
| products.approve_pricing | Approve prices | Admin only |
| products.view_product_stock | View stock levels | All staff |
| products.adjust_product_stock | Adjust stock | Manager, Admin |
| products.upload_product_image | Upload images | Manager, Admin |
| products.delete_product_image | Delete images | Manager, Admin |
| products.import_products | Bulk import | Admin only |
| products.export_products | Export data | Manager, Admin |

### Expected Outcome
- 17 permissions created for Products module
- All follow the `products.{action}_{resource}` format
- Permissions stored in database via migration

### Verification Checklist
- [ ] All CRUD permissions are defined
- [ ] Category permissions are included
- [ ] Pricing permissions are added
- [ ] Stock link permissions are present
- [ ] Image management permissions exist
- [ ] Bulk operation permissions are defined
- [ ] Descriptions are clear and accurate

---

## Task 27: Inventory Module Permissions

### Overview
Define and create all permissions for the Inventory module, which manages stock levels, warehouses, stock movements, and inventory adjustments. This module is critical for tracking product availability.

### Dependencies
- Task 25: Create Default Permissions Migration

### Instructions

1. **Add inventory permissions to migration**
   - In the `create_default_permissions` function
   - Create permissions for inventory module

2. **Define standard CRUD permissions**
   - **view_stock:** View stock levels and inventory
   - **add_stock:** Create stock entries
   - **change_stock:** Update stock information
   - **delete_stock:** Remove stock entries

3. **Add warehouse management permissions**
   - **view_warehouse:** View warehouse list
   - **add_warehouse:** Create new warehouses
   - **change_warehouse:** Edit warehouse details
   - **delete_warehouse:** Delete warehouses

4. **Add stock movement permissions**
   - **view_stock_movement:** View stock movements
   - **create_stock_movement:** Record stock movements
   - **approve_stock_movement:** Approve movements

5. **Add stock adjustment permissions**
   - **create_stock_adjustment:** Create adjustments
   - **approve_stock_adjustment:** Approve adjustments
   - **view_stock_adjustment:** View adjustment history

6. **Add stock transfer permissions**
   - **create_stock_transfer:** Transfer between warehouses
   - **approve_stock_transfer:** Approve transfers
   - **receive_stock_transfer:** Receive transfers

7. **Add stock count permissions**
   - **initiate_stock_count:** Start stock count
   - **perform_stock_count:** Perform counting
   - **approve_stock_count:** Approve count results

8. **Add inventory reporting permissions**
   - **view_stock_report:** View stock reports
   - **export_stock_data:** Export inventory data

9. **Build the permissions list**
   ```python
   inventory_permissions = [
       create_permission('inventory', 'view', 'stock', 
           'Can view stock levels and inventory'),
       create_permission('inventory', 'add', 'stock', 
           'Can create new stock entries'),
       create_permission('inventory', 'change', 'stock', 
           'Can update stock information'),
       create_permission('inventory', 'delete', 'stock', 
           'Can delete stock entries'),
       # Add remaining permissions...
   ]
   ```

### Inventory Module Permission Summary

| Codename | Description | Typical Roles |
|----------|-------------|---------------|
| inventory.view_stock | View stock levels | All staff |
| inventory.add_stock | Create stock entries | Manager, Admin |
| inventory.change_stock | Update stock | Manager, Admin |
| inventory.delete_stock | Delete stock entries | Admin only |
| inventory.view_warehouse | View warehouses | All staff |
| inventory.add_warehouse | Create warehouses | Admin only |
| inventory.change_warehouse | Edit warehouses | Admin only |
| inventory.delete_warehouse | Delete warehouses | Admin only |
| inventory.view_stock_movement | View movements | All staff |
| inventory.create_stock_movement | Record movements | Manager, Admin |
| inventory.approve_stock_movement | Approve movements | Admin only |
| inventory.create_stock_adjustment | Create adjustments | Manager, Admin |
| inventory.approve_stock_adjustment | Approve adjustments | Admin only |
| inventory.view_stock_adjustment | View adjustments | All staff |
| inventory.create_stock_transfer | Create transfers | Manager, Admin |
| inventory.approve_stock_transfer | Approve transfers | Admin only |
| inventory.receive_stock_transfer | Receive transfers | Manager, Admin |
| inventory.initiate_stock_count | Start stock count | Manager, Admin |
| inventory.perform_stock_count | Perform counting | All staff |
| inventory.approve_stock_count | Approve count | Admin only |
| inventory.view_stock_report | View reports | Manager, Admin |
| inventory.export_stock_data | Export data | Manager, Admin |

### Expected Outcome
- 22 permissions created for Inventory module
- All follow the `inventory.{action}_{resource}` format
- Covers warehouses, movements, adjustments, transfers, and counts

### Verification Checklist
- [ ] All CRUD permissions are defined
- [ ] Warehouse permissions are included
- [ ] Stock movement permissions are added
- [ ] Stock adjustment permissions are present
- [ ] Stock transfer permissions exist
- [ ] Stock count permissions are defined
- [ ] Reporting permissions are included

---

## Task 28: Sales Module Permissions

### Overview
Define and create all permissions for the Sales module, which handles orders, invoices, payments, refunds, and customer transactions. This module is essential for revenue operations.

### Dependencies
- Task 25: Create Default Permissions Migration

### Instructions

1. **Add sales permissions to migration**
   - In the `create_default_permissions` function
   - Create permissions for sales module

2. **Define standard CRUD permissions**
   - **view_order:** View sales orders
   - **add_order:** Create new orders
   - **change_order:** Edit order details
   - **delete_order:** Delete orders

3. **Add order status permissions**
   - **confirm_order:** Confirm pending orders
   - **cancel_order:** Cancel orders
   - **complete_order:** Mark orders complete

4. **Add invoice permissions**
   - **view_invoice:** View invoices
   - **create_invoice:** Generate invoices
   - **void_invoice:** Void invoices
   - **send_invoice:** Send invoices to customers

5. **Add payment permissions**
   - **view_payment:** View payment records
   - **record_payment:** Record payments
   - **void_payment:** Void payments
   - **refund_payment:** Process refunds

6. **Add quotation permissions**
   - **view_quotation:** View quotations
   - **create_quotation:** Create quotes
   - **approve_quotation:** Approve quotes
   - **convert_quotation:** Convert to order

7. **Add discount permissions**
   - **apply_discount:** Apply discounts to orders
   - **approve_discount:** Approve large discounts

8. **Add sales reporting permissions**
   - **view_sales_report:** View sales reports
   - **export_sales_data:** Export sales data

9. **Build the permissions list**
   ```python
   sales_permissions = [
       create_permission('sales', 'view', 'order', 
           'Can view sales orders and details'),
       create_permission('sales', 'add', 'order', 
           'Can create new sales orders'),
       create_permission('sales', 'change', 'order', 
           'Can edit existing orders'),
       create_permission('sales', 'delete', 'order', 
           'Can delete sales orders'),
       # Add remaining permissions...
   ]
   ```

### Sales Module Permission Summary

| Codename | Description | Typical Roles |
|----------|-------------|---------------|
| sales.view_order | View orders | All staff |
| sales.add_order | Create orders | Cashier, Manager |
| sales.change_order | Edit orders | Manager, Admin |
| sales.delete_order | Delete orders | Admin only |
| sales.confirm_order | Confirm orders | Manager, Admin |
| sales.cancel_order | Cancel orders | Manager, Admin |
| sales.complete_order | Complete orders | All staff |
| sales.view_invoice | View invoices | All staff |
| sales.create_invoice | Generate invoices | Cashier, Manager |
| sales.void_invoice | Void invoices | Manager, Admin |
| sales.send_invoice | Send invoices | All staff |
| sales.view_payment | View payments | All staff |
| sales.record_payment | Record payments | Cashier, Manager |
| sales.void_payment | Void payments | Manager, Admin |
| sales.refund_payment | Process refunds | Manager, Admin |
| sales.view_quotation | View quotes | All staff |
| sales.create_quotation | Create quotes | Cashier, Manager |
| sales.approve_quotation | Approve quotes | Manager, Admin |
| sales.convert_quotation | Convert to order | Manager, Admin |
| sales.apply_discount | Apply discounts | Cashier, Manager |
| sales.approve_discount | Approve discounts | Manager, Admin |
| sales.view_sales_report | View reports | Manager, Admin |
| sales.export_sales_data | Export data | Manager, Admin |

### Expected Outcome
- 23 permissions created for Sales module
- All follow the `sales.{action}_{resource}` format
- Covers orders, invoices, payments, quotations, and discounts

### Verification Checklist
- [ ] All CRUD permissions are defined
- [ ] Order status permissions are included
- [ ] Invoice permissions are added
- [ ] Payment permissions are present
- [ ] Quotation permissions exist
- [ ] Discount permissions are defined
- [ ] Reporting permissions are included

---

## Task 29: Reports Module Permissions

### Overview
Define and create all permissions for the Reports module, which provides analytics, business intelligence, and reporting capabilities across all modules. Report permissions are primarily view-based with export capabilities.

### Dependencies
- Task 25: Create Default Permissions Migration

### Instructions

1. **Add reports permissions to migration**
   - In the `create_default_permissions` function
   - Create permissions for reports module

2. **Add sales report permissions**
   - **view_sales_report:** View sales analytics
   - **view_revenue_report:** View revenue reports
   - **view_sales_by_product:** Product sales analysis
   - **view_sales_by_customer:** Customer sales analysis

3. **Add inventory report permissions**
   - **view_inventory_report:** View inventory reports
   - **view_stock_level_report:** Current stock levels
   - **view_stock_movement_report:** Stock movement history
   - **view_reorder_report:** Reorder point alerts

4. **Add financial report permissions**
   - **view_financial_report:** View financial reports
   - **view_profit_loss_report:** P&L statements
   - **view_cashflow_report:** Cash flow reports
   - **view_tax_report:** Tax reports

5. **Add customer report permissions**
   - **view_customer_report:** Customer analytics
   - **view_customer_purchase_history:** Purchase history
   - **view_customer_loyalty_report:** Loyalty analytics

6. **Add employee report permissions**
   - **view_employee_report:** Employee reports
   - **view_attendance_report:** Attendance tracking
   - **view_performance_report:** Performance metrics

7. **Add custom report permissions**
   - **create_custom_report:** Create custom reports
   - **save_report_template:** Save report templates
   - **share_report:** Share reports with others

8. **Add report export permissions**
   - **export_report_pdf:** Export as PDF
   - **export_report_excel:** Export as Excel
   - **export_report_csv:** Export as CSV
   - **schedule_report:** Schedule automated reports

9. **Add dashboard permissions**
   - **view_sales_dashboard:** View sales dashboard
   - **view_inventory_dashboard:** View inventory dashboard
   - **view_executive_dashboard:** View executive dashboard
   - **customize_dashboard:** Customize dashboard layout

10. **Build the permissions list**
    ```python
    reports_permissions = [
        create_permission('reports', 'view', 'sales_report', 
            'Can view sales analytics and reports'),
        create_permission('reports', 'view', 'revenue_report', 
            'Can view revenue and earnings reports'),
        create_permission('reports', 'view', 'sales_by_product', 
            'Can view product-wise sales analysis'),
        # Add remaining permissions...
    ]
    ```

### Reports Module Permission Summary

| Codename | Description | Typical Roles |
|----------|-------------|---------------|
| reports.view_sales_report | View sales analytics | Manager, Admin |
| reports.view_revenue_report | View revenue reports | Admin only |
| reports.view_sales_by_product | Product sales analysis | Manager, Admin |
| reports.view_sales_by_customer | Customer sales analysis | Manager, Admin |
| reports.view_inventory_report | View inventory reports | Manager, Admin |
| reports.view_stock_level_report | Current stock levels | All staff |
| reports.view_stock_movement_report | Stock movement history | Manager, Admin |
| reports.view_reorder_report | Reorder alerts | Manager, Admin |
| reports.view_financial_report | View financial reports | Admin only |
| reports.view_profit_loss_report | P&L statements | Admin only |
| reports.view_cashflow_report | Cash flow reports | Admin only |
| reports.view_tax_report | Tax reports | Admin, Accountant |
| reports.view_customer_report | Customer analytics | Manager, Admin |
| reports.view_customer_purchase_history | Purchase history | Manager, Admin |
| reports.view_customer_loyalty_report | Loyalty analytics | Manager, Admin |
| reports.view_employee_report | Employee reports | Admin only |
| reports.view_attendance_report | Attendance tracking | Manager, Admin |
| reports.view_performance_report | Performance metrics | Admin only |
| reports.create_custom_report | Create custom reports | Admin only |
| reports.save_report_template | Save templates | Manager, Admin |
| reports.share_report | Share reports | Manager, Admin |
| reports.export_report_pdf | Export as PDF | Manager, Admin |
| reports.export_report_excel | Export as Excel | Manager, Admin |
| reports.export_report_csv | Export as CSV | Manager, Admin |
| reports.schedule_report | Schedule reports | Admin only |
| reports.view_sales_dashboard | Sales dashboard | Manager, Admin |
| reports.view_inventory_dashboard | Inventory dashboard | Manager, Admin |
| reports.view_executive_dashboard | Executive dashboard | Admin only |
| reports.customize_dashboard | Customize layout | Manager, Admin |

### Expected Outcome
- 29 permissions created for Reports module
- All follow the `reports.{action}_{resource}` format
- Comprehensive coverage of analytics and reporting

### Verification Checklist
- [ ] Sales report permissions are defined
- [ ] Inventory report permissions are included
- [ ] Financial report permissions are added
- [ ] Customer report permissions are present
- [ ] Employee report permissions exist
- [ ] Custom report permissions are defined
- [ ] Export permissions are included
- [ ] Dashboard permissions are added

---

## Task 30: Document Permissions

### Overview
Create comprehensive documentation for the permission system, including permission naming conventions, module organization, usage guidelines, and examples for developers.

### Dependencies
- Task 26: Products Module Permissions
- Task 27: Inventory Module Permissions
- Task 28: Sales Module Permissions
- Task 29: Reports Module Permissions

### Instructions

1. **Create permissions documentation file**
   - Navigate to `backend/apps/users/docs/`
   - Create file: `permissions_guide.md`

2. **Add overview section**
   - Explain the permission system architecture
   - Describe the role of Permission and PermissionGroup models
   - Reference the migration that creates default permissions

3. **Document permission naming convention**
   - Format: `{module}.{action}_{resource}`
   - Explain each component:
     - **module:** The module/app name (products, inventory, sales, etc.)
     - **action:** The operation type (view, add, change, delete, custom)
     - **resource:** The resource being acted upon (product, stock, order, etc.)

4. **Add module organization section**
   - List all modules with their purposes
   - Products: Product catalog management
   - Inventory: Stock and warehouse management
   - Sales: Orders, invoices, payments
   - Customers: Customer relationship management
   - Vendors: Supplier management
   - HR: Human resources and employee management
   - Accounting: Financial transactions and reporting
   - Reports: Analytics and business intelligence
   - Settings: System configuration

5. **Document standard action types**
   - **view:** Read access to resources
   - **add:** Create new resources
   - **change:** Update existing resources
   - **delete:** Remove resources
   - **custom actions:** Module-specific operations

6. **Add permission usage examples**
   - Checking permissions in views:
   ```python
   from django.contrib.auth.decorators import permission_required
   
   @permission_required('products.view_product')
   def product_list(request):
       # View implementation
       pass
   ```
   
   - Checking permissions in templates:
   ```django
   {% if perms.products.add_product %}
       <a href="{% url 'product_create' %}">Add Product</a>
   {% endif %}
   ```
   
   - Checking permissions programmatically:
   ```python
   if request.user.has_perm('sales.approve_discount'):
       # Allow approval
       pass
   ```

7. **Document permission groups**
   - Explain PermissionGroup model purpose
   - Show how to create permission groups:
   ```python
   from apps.users.models import Permission, PermissionGroup
   
   # Create a group for cashiers
   cashier_group = PermissionGroup.objects.create(
       group_name='Cashier Permissions'
   )
   
   # Add relevant permissions
   cashier_perms = Permission.objects.filter(
       codename__in=[
           'sales.view_order',
           'sales.add_order',
           'sales.record_payment',
       ]
   )
   cashier_group.permissions.add(*cashier_perms)
   ```

8. **Add role-permission mapping examples**
   - **Admin:** All permissions
   - **Manager:** Most permissions except system config
   - **Cashier:** Sales and basic inventory permissions
   - **Stock Keeper:** Inventory-focused permissions
   - **Accountant:** Financial and reporting permissions

9. **Document migration usage**
   - Explain how to run the default permissions migration
   - Show how to verify permissions were created:
   ```python
   from apps.users.models import Permission
   
   # Count permissions by module
   for module in ['products', 'inventory', 'sales', 'reports']:
       count = Permission.objects.filter(module=module).count()
       print(f'{module}: {count} permissions')
   ```

10. **Add best practices section**
    - Always use permission checks in views
    - Use permission groups for role templates
    - Keep permission names consistent
    - Document custom permissions
    - Test permission logic thoroughly
    - Use Django's built-in permission decorators

11. **Include troubleshooting section**
    - Permission not found errors
    - Permission caching issues
    - Migration conflicts
    - Permission inheritance issues

12. **Add API documentation reference**
    - Link to API endpoints for permission management
    - Reference DRF permission classes
    - Document API authentication requirements

### Documentation Structure

| Section | Content |
|---------|---------|
| **Overview** | System architecture |
| **Naming Convention** | Codename format rules |
| **Module Organization** | Module definitions |
| **Action Types** | Standard actions |
| **Usage Examples** | Code examples |
| **Permission Groups** | Group management |
| **Role Mappings** | Common role setups |
| **Migration Guide** | Running migrations |
| **Best Practices** | Development guidelines |
| **Troubleshooting** | Common issues |
| **API Reference** | API documentation |

### Expected Outcome
```
backend/apps/users/docs/
└── permissions_guide.md        # Comprehensive permission docs
```

### Verification Checklist
- [ ] Documentation file created
- [ ] Naming convention is clearly explained
- [ ] All modules are documented
- [ ] Action types are defined
- [ ] Code examples are included
- [ ] Permission groups are explained
- [ ] Role mappings are provided
- [ ] Best practices are listed
- [ ] Troubleshooting section exists
- [ ] API reference is included

---

## Complete Migration Example

### Full Migration File Structure

```python
# backend/apps/users/migrations/0004_create_default_permissions.py
"""
Data migration to create default permissions for all modules.

This migration populates the Permission table with standard CRUD permissions
and module-specific permissions following the format: {module}.{action}_{resource}

Modules covered:
- Products: Product catalog management
- Inventory: Stock and warehouse management
- Sales: Orders, invoices, payments
- Reports: Analytics and reporting
"""

from django.db import migrations
from django.utils import timezone


def create_permission(module, action, resource, description):
    """
    Helper function to create a permission dictionary.
    
    Args:
        module: The module name (e.g., 'products', 'inventory')
        action: The action type (e.g., 'view', 'add', 'change', 'delete')
        resource: The resource name (e.g., 'product', 'stock', 'order')
        description: Human-readable description of the permission
        
    Returns:
        Dictionary with permission fields
    """
    return {
        'codename': f'{module}.{action}_{resource}',
        'name': f'Can {action} {resource}',
        'module': module,
        'action': action,
        'description': description,
        'created_at': timezone.now(),
        'updated_at': timezone.now(),
    }


def create_default_permissions(apps, schema_editor):
    """Create all default permissions for the system."""
    Permission = apps.get_model('users', 'Permission')
    
    # Collect all permissions
    all_permissions = []
    
    # Products Module Permissions (17 permissions)
    products_permissions = [
        create_permission('products', 'view', 'product', 
            'Can view product list and details'),
        create_permission('products', 'add', 'product', 
            'Can create new products in catalog'),
        create_permission('products', 'change', 'product', 
            'Can edit existing product information'),
        create_permission('products', 'delete', 'product', 
            'Can delete products from catalog'),
        create_permission('products', 'view', 'category', 
            'Can view product categories'),
        create_permission('products', 'add', 'category', 
            'Can create new product categories'),
        create_permission('products', 'change', 'category', 
            'Can edit product categories'),
        create_permission('products', 'delete', 'category', 
            'Can delete product categories'),
        create_permission('products', 'view', 'pricing', 
            'Can view product prices'),
        create_permission('products', 'change', 'pricing', 
            'Can update product prices'),
        create_permission('products', 'approve', 'pricing', 
            'Can approve product price changes'),
        create_permission('products', 'view', 'product_stock', 
            'Can view product stock levels'),
        create_permission('products', 'adjust', 'product_stock', 
            'Can adjust stock levels for products'),
        create_permission('products', 'upload', 'product_image', 
            'Can upload product images'),
        create_permission('products', 'delete', 'product_image', 
            'Can delete product images'),
        create_permission('products', 'import', 'products', 
            'Can bulk import products'),
        create_permission('products', 'export', 'products', 
            'Can export product data'),
    ]
    
    # Inventory Module Permissions (22 permissions)
    inventory_permissions = [
        create_permission('inventory', 'view', 'stock', 
            'Can view stock levels and inventory'),
        create_permission('inventory', 'add', 'stock', 
            'Can create new stock entries'),
        create_permission('inventory', 'change', 'stock', 
            'Can update stock information'),
        create_permission('inventory', 'delete', 'stock', 
            'Can delete stock entries'),
        create_permission('inventory', 'view', 'warehouse', 
            'Can view warehouse list and details'),
        create_permission('inventory', 'add', 'warehouse', 
            'Can create new warehouses'),
        create_permission('inventory', 'change', 'warehouse', 
            'Can edit warehouse information'),
        create_permission('inventory', 'delete', 'warehouse', 
            'Can delete warehouses'),
        create_permission('inventory', 'view', 'stock_movement', 
            'Can view stock movement history'),
        create_permission('inventory', 'create', 'stock_movement', 
            'Can record new stock movements'),
        create_permission('inventory', 'approve', 'stock_movement', 
            'Can approve stock movements'),
        create_permission('inventory', 'create', 'stock_adjustment', 
            'Can create stock adjustments'),
        create_permission('inventory', 'approve', 'stock_adjustment', 
            'Can approve stock adjustments'),
        create_permission('inventory', 'view', 'stock_adjustment', 
            'Can view stock adjustment history'),
        create_permission('inventory', 'create', 'stock_transfer', 
            'Can create stock transfers between warehouses'),
        create_permission('inventory', 'approve', 'stock_transfer', 
            'Can approve stock transfers'),
        create_permission('inventory', 'receive', 'stock_transfer', 
            'Can receive stock transfers'),
        create_permission('inventory', 'initiate', 'stock_count', 
            'Can initiate stock count process'),
        create_permission('inventory', 'perform', 'stock_count', 
            'Can perform stock counting'),
        create_permission('inventory', 'approve', 'stock_count', 
            'Can approve stock count results'),
        create_permission('inventory', 'view', 'stock_report', 
            'Can view inventory reports'),
        create_permission('inventory', 'export', 'stock_data', 
            'Can export inventory data'),
    ]
    
    # Sales Module Permissions (23 permissions)
    sales_permissions = [
        create_permission('sales', 'view', 'order', 
            'Can view sales orders and details'),
        create_permission('sales', 'add', 'order', 
            'Can create new sales orders'),
        create_permission('sales', 'change', 'order', 
            'Can edit existing sales orders'),
        create_permission('sales', 'delete', 'order', 
            'Can delete sales orders'),
        create_permission('sales', 'confirm', 'order', 
            'Can confirm pending sales orders'),
        create_permission('sales', 'cancel', 'order', 
            'Can cancel sales orders'),
        create_permission('sales', 'complete', 'order', 
            'Can mark orders as complete'),
        create_permission('sales', 'view', 'invoice', 
            'Can view invoices'),
        create_permission('sales', 'create', 'invoice', 
            'Can generate customer invoices'),
        create_permission('sales', 'void', 'invoice', 
            'Can void issued invoices'),
        create_permission('sales', 'send', 'invoice', 
            'Can send invoices to customers'),
        create_permission('sales', 'view', 'payment', 
            'Can view payment records'),
        create_permission('sales', 'record', 'payment', 
            'Can record customer payments'),
        create_permission('sales', 'void', 'payment', 
            'Can void payment records'),
        create_permission('sales', 'refund', 'payment', 
            'Can process payment refunds'),
        create_permission('sales', 'view', 'quotation', 
            'Can view sales quotations'),
        create_permission('sales', 'create', 'quotation', 
            'Can create sales quotations'),
        create_permission('sales', 'approve', 'quotation', 
            'Can approve sales quotations'),
        create_permission('sales', 'convert', 'quotation', 
            'Can convert quotations to orders'),
        create_permission('sales', 'apply', 'discount', 
            'Can apply discounts to orders'),
        create_permission('sales', 'approve', 'discount', 
            'Can approve large discounts'),
        create_permission('sales', 'view', 'sales_report', 
            'Can view sales reports'),
        create_permission('sales', 'export', 'sales_data', 
            'Can export sales data'),
    ]
    
    # Reports Module Permissions (29 permissions)
    reports_permissions = [
        create_permission('reports', 'view', 'sales_report', 
            'Can view sales analytics and reports'),
        create_permission('reports', 'view', 'revenue_report', 
            'Can view revenue and earnings reports'),
        create_permission('reports', 'view', 'sales_by_product', 
            'Can view product-wise sales analysis'),
        create_permission('reports', 'view', 'sales_by_customer', 
            'Can view customer-wise sales analysis'),
        create_permission('reports', 'view', 'inventory_report', 
            'Can view inventory analysis reports'),
        create_permission('reports', 'view', 'stock_level_report', 
            'Can view current stock level reports'),
        create_permission('reports', 'view', 'stock_movement_report', 
            'Can view stock movement history reports'),
        create_permission('reports', 'view', 'reorder_report', 
            'Can view reorder point alerts'),
        create_permission('reports', 'view', 'financial_report', 
            'Can view financial reports'),
        create_permission('reports', 'view', 'profit_loss_report', 
            'Can view profit and loss statements'),
        create_permission('reports', 'view', 'cashflow_report', 
            'Can view cash flow reports'),
        create_permission('reports', 'view', 'tax_report', 
            'Can view tax reports and calculations'),
        create_permission('reports', 'view', 'customer_report', 
            'Can view customer analytics'),
        create_permission('reports', 'view', 'customer_purchase_history', 
            'Can view customer purchase history'),
        create_permission('reports', 'view', 'customer_loyalty_report', 
            'Can view customer loyalty analytics'),
        create_permission('reports', 'view', 'employee_report', 
            'Can view employee reports'),
        create_permission('reports', 'view', 'attendance_report', 
            'Can view employee attendance reports'),
        create_permission('reports', 'view', 'performance_report', 
            'Can view employee performance metrics'),
        create_permission('reports', 'create', 'custom_report', 
            'Can create custom report definitions'),
        create_permission('reports', 'save', 'report_template', 
            'Can save report templates'),
        create_permission('reports', 'share', 'report', 
            'Can share reports with other users'),
        create_permission('reports', 'export', 'report_pdf', 
            'Can export reports as PDF'),
        create_permission('reports', 'export', 'report_excel', 
            'Can export reports as Excel'),
        create_permission('reports', 'export', 'report_csv', 
            'Can export reports as CSV'),
        create_permission('reports', 'schedule', 'report', 
            'Can schedule automated report generation'),
        create_permission('reports', 'view', 'sales_dashboard', 
            'Can view sales dashboard'),
        create_permission('reports', 'view', 'inventory_dashboard', 
            'Can view inventory dashboard'),
        create_permission('reports', 'view', 'executive_dashboard', 
            'Can view executive dashboard'),
        create_permission('reports', 'customize', 'dashboard', 
            'Can customize dashboard layout'),
    ]
    
    # Combine all permissions
    all_permissions.extend(products_permissions)
    all_permissions.extend(inventory_permissions)
    all_permissions.extend(sales_permissions)
    all_permissions.extend(reports_permissions)
    
    # Create all permissions in bulk
    Permission.objects.bulk_create([
        Permission(**perm) for perm in all_permissions
    ])


def delete_default_permissions(apps, schema_editor):
    """Reverse migration - delete all created permissions."""
    Permission = apps.get_model('users', 'Permission')
    
    # Delete all permissions created by this migration
    codenames = [
        # Products
        'products.view_product', 'products.add_product',
        'products.change_product', 'products.delete_product',
        'products.view_category', 'products.add_category',
        'products.change_category', 'products.delete_category',
        'products.view_pricing', 'products.change_pricing',
        'products.approve_pricing', 'products.view_product_stock',
        'products.adjust_product_stock', 'products.upload_product_image',
        'products.delete_product_image', 'products.import_products',
        'products.export_products',
        
        # Inventory
        'inventory.view_stock', 'inventory.add_stock',
        'inventory.change_stock', 'inventory.delete_stock',
        'inventory.view_warehouse', 'inventory.add_warehouse',
        'inventory.change_warehouse', 'inventory.delete_warehouse',
        'inventory.view_stock_movement', 'inventory.create_stock_movement',
        'inventory.approve_stock_movement', 'inventory.create_stock_adjustment',
        'inventory.approve_stock_adjustment', 'inventory.view_stock_adjustment',
        'inventory.create_stock_transfer', 'inventory.approve_stock_transfer',
        'inventory.receive_stock_transfer', 'inventory.initiate_stock_count',
        'inventory.perform_stock_count', 'inventory.approve_stock_count',
        'inventory.view_stock_report', 'inventory.export_stock_data',
        
        # Sales
        'sales.view_order', 'sales.add_order',
        'sales.change_order', 'sales.delete_order',
        'sales.confirm_order', 'sales.cancel_order',
        'sales.complete_order', 'sales.view_invoice',
        'sales.create_invoice', 'sales.void_invoice',
        'sales.send_invoice', 'sales.view_payment',
        'sales.record_payment', 'sales.void_payment',
        'sales.refund_payment', 'sales.view_quotation',
        'sales.create_quotation', 'sales.approve_quotation',
        'sales.convert_quotation', 'sales.apply_discount',
        'sales.approve_discount', 'sales.view_sales_report',
        'sales.export_sales_data',
        
        # Reports
        'reports.view_sales_report', 'reports.view_revenue_report',
        'reports.view_sales_by_product', 'reports.view_sales_by_customer',
        'reports.view_inventory_report', 'reports.view_stock_level_report',
        'reports.view_stock_movement_report', 'reports.view_reorder_report',
        'reports.view_financial_report', 'reports.view_profit_loss_report',
        'reports.view_cashflow_report', 'reports.view_tax_report',
        'reports.view_customer_report', 'reports.view_customer_purchase_history',
        'reports.view_customer_loyalty_report', 'reports.view_employee_report',
        'reports.view_attendance_report', 'reports.view_performance_report',
        'reports.create_custom_report', 'reports.save_report_template',
        'reports.share_report', 'reports.export_report_pdf',
        'reports.export_report_excel', 'reports.export_report_csv',
        'reports.schedule_report', 'reports.view_sales_dashboard',
        'reports.view_inventory_dashboard', 'reports.view_executive_dashboard',
        'reports.customize_dashboard',
    ]
    
    Permission.objects.filter(codename__in=codenames).delete()


class Migration(migrations.Migration):
    
    dependencies = [
        ('users', '0003_create_permission_model'),
    ]
    
    operations = [
        migrations.RunPython(
            create_default_permissions,
            reverse_code=delete_default_permissions
        ),
    ]
```

---

## Summary

### Total Permissions Created
| Module | Count | Description |
|--------|-------|-------------|
| Products | 17 | Product catalog and pricing |
| Inventory | 22 | Stock and warehouse management |
| Sales | 23 | Orders, invoices, payments |
| Reports | 29 | Analytics and dashboards |
| **Total** | **91** | Complete permission set |

### Key Achievements
- ✅ Created data migration for default permissions
- ✅ Defined 91 permissions across 4 modules
- ✅ Established consistent naming convention
- ✅ Documented permission system comprehensively
- ✅ Prepared foundation for role-permission assignment

### Next Steps
- Proceed to Group-C: Role-Permission Assignment
- Create RolePermission junction model
- Implement permission assignment methods
- Build default role configurations

---

## Notes for AI Agents

### Context
This is the final document in Group-B (Permission Model). All permissions are created through a single data migration file that should be run after the Permission model is established. The migration includes both forward (create) and reverse (delete) operations.

### Code Quality Requirements
- Use bulk_create for efficiency
- Include descriptive permission names
- Follow codename format strictly: `{module}.{action}_{resource}`
- Add comprehensive descriptions
- Test both forward and reverse migrations

### Testing Requirements
- Verify all 91 permissions are created
- Check codename uniqueness
- Validate module and action values
- Test reverse migration cleanup
- Confirm no foreign key violations

### Next Group Preview
Group-C will create the RolePermission model to assign these permissions to roles, establishing the many-to-many relationship between roles and permissions with optional context-specific constraints.
