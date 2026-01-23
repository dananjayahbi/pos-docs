# Tasks 41-46: Default Role Permission Assignments

> **Phase:** 03 - Core Backend Infrastructure  
> **SubPhase:** 05 - Role & Permission System  
> **Group:** C - Role-Permission Assignment  
> **Document:** 03 of 03  
> **Tasks Covered:** 41, 42, 43, 44, 45, 46

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [02_Tasks-37-40_RolePermissionManager.md](02_Tasks-37-40_RolePermissionManager.md)
- **→ Next Group:** [../Group-D_User-Role-Management/](../Group-D_User-Role-Management/)

---

## Document Overview

This document covers the creation of default permission assignments for each system role through Django data migrations. These assignments establish the permission model for the entire platform, from full Super Admin access to minimal Customer access.

### Tasks in This Document
| Task # | Task Name | Complexity |
|--------|-----------|------------|
| 41 | Assign Super Admin Permissions | Medium |
| 42 | Assign Tenant Admin Permissions | Medium |
| 43 | Assign Manager Permissions | Medium |
| 44 | Assign Staff Permissions | Medium |
| 45 | Assign Customer Permissions | Simple |
| 46 | Document Role-Permission System | Medium |

---

## Task 41: Assign Super Admin Permissions

### Overview
Create a data migration that assigns ALL permissions to the Super Admin role. Super Admins have unrestricted access to the entire platform.

### Dependencies
- Task 40: Add has_permission Method
- All permissions created in Group B

### Instructions

1. **Create data migration file**
   - Generate empty migration: `python manage.py makemigrations users --empty`
   - Name: `assign_super_admin_permissions`

2. **Import required models**
   - Import Role, Permission, RolePermission models
   - Import User model for granted_by field

3. **Create forward migration function**
   - Define `assign_super_admin_permissions(apps, schema_editor)`
   - Get Role and Permission models from apps
   - Query all permissions
   - Assign all to Super Admin role

4. **Get Super Admin role**
   - Query Role with `role_type='super_admin'`
   - Handle case if role doesn't exist (skip or create)

5. **Query all permissions**
   - Use `Permission.objects.all()`
   - No filtering - Super Admin gets everything

6. **Bulk create RolePermission records**
   - Loop through all permissions
   - Create RolePermission for each
   - Use `bulk_create` for efficiency

7. **Add granted_by field (optional)**
   - Can be None or system user
   - Set granted_at to current timestamp

8. **Create reverse migration function**
   - Define `remove_super_admin_permissions(apps, schema_editor)`
   - Delete all RolePermission records for Super Admin
   - Use `RolePermission.objects.filter(role=super_admin).delete()`

9. **Add migration operations**
   - Use `migrations.RunPython(assign_super_admin_permissions, remove_super_admin_permissions)`

10. **Test migration**
    - Run migration: `python manage.py migrate users`
    - Verify in Django admin or shell
    - Test reverse: `python manage.py migrate users <previous_migration>`

### Permission Scope
| Scope | Included |
|-------|----------|
| **System Level** | ✓ All system settings |
| **Tenant Level** | ✓ All tenant operations |
| **Module Level** | ✓ All module CRUD |
| **Special** | ✓ Delete, export, audit |

### Super Admin Permission Pattern
```
*.*  (All resources, all actions)
```

**Examples:**
- `users.add_user`
- `users.delete_user`
- `products.add_product`
- `products.delete_product`
- `reports.view_all_reports`
- `system.change_settings`

### Expected Outcome
```
backend/apps/users/migrations/
└── XXXX_assign_super_admin_permissions.py
    ├── assign_super_admin_permissions()
    ├── remove_super_admin_permissions()
    └── operations: RunPython()
```

### Verification Checklist
- [ ] Data migration file created
- [ ] Forward function assigns all permissions
- [ ] Reverse function removes all assignments
- [ ] Super Admin role is queried correctly
- [ ] All permissions are fetched
- [ ] bulk_create used for efficiency
- [ ] Migration runs without errors
- [ ] Reverse migration works correctly

---

## Task 42: Assign Tenant Admin Permissions

### Overview
Create a data migration that assigns all tenant-scoped permissions to the Tenant Admin role, excluding system-level permissions.

### Dependencies
- Task 41: Assign Super Admin Permissions

### Instructions

1. **Create data migration file**
   - Generate empty migration: `python manage.py makemigrations users --empty`
   - Name: `assign_tenant_admin_permissions`

2. **Import required models**
   - Import Role, Permission, RolePermission models

3. **Create forward migration function**
   - Define `assign_tenant_admin_permissions(apps, schema_editor)`

4. **Get Tenant Admin role**
   - Query Role with `role_type='tenant_admin'`

5. **Query tenant-scoped permissions**
   - Filter permissions: `Permission.objects.exclude(resource__startswith='system.')`
   - Include all CRUD operations on tenant data
   - Exclude: system settings, cross-tenant operations

6. **Define excluded permissions**
   - `system.change_settings`
   - `system.view_all_tenants`
   - `system.delete_tenant`
   - `users.impersonate_user`

7. **Bulk create RolePermission records**
   - Filter out excluded permissions
   - Create assignments for remaining permissions

8. **Create reverse migration function**
   - Remove all Tenant Admin permission assignments

9. **Add migration operations**
   - Use RunPython with forward and reverse functions

10. **Test migration**
    - Run and verify assignments
    - Ensure system permissions are excluded

### Permission Scope
| Scope | Included | Excluded |
|-------|----------|----------|
| **System Level** | ✗ | System settings, cross-tenant |
| **Tenant Level** | ✓ | All tenant operations |
| **Module Level** | ✓ | All module CRUD |
| **Special** | Partial | Export, reports (not system-wide) |

### Tenant Admin Permission Pattern
```
<module>.<action>  (All modules except system)
```

**Examples Included:**
- `users.add_user`
- `users.change_user`
- `users.view_user`
- `products.delete_product`
- `orders.view_order`
- `reports.view_tenant_reports`

**Examples Excluded:**
- `system.change_settings`
- `system.view_all_tenants`
- `users.impersonate_user`

### Expected Outcome
```
backend/apps/users/migrations/
└── XXXX_assign_tenant_admin_permissions.py
    ├── assign_tenant_admin_permissions()
    ├── remove_tenant_admin_permissions()
    └── operations: RunPython()
```

### Verification Checklist
- [ ] Data migration file created
- [ ] Forward function assigns tenant permissions
- [ ] System permissions are excluded
- [ ] Reverse function removes assignments
- [ ] Tenant Admin role is queried
- [ ] Correct permissions are filtered
- [ ] Migration runs successfully
- [ ] No system permissions assigned

---

## Task 43: Assign Manager Permissions

### Overview
Create a data migration that assigns department-level permissions to the Manager role, including module management and reporting capabilities.

### Dependencies
- Task 42: Assign Tenant Admin Permissions

### Instructions

1. **Create data migration file**
   - Generate empty migration: `python manage.py makemigrations users --empty`
   - Name: `assign_manager_permissions`

2. **Import required models**
   - Import Role, Permission, RolePermission models

3. **Create forward migration function**
   - Define `assign_manager_permissions(apps, schema_editor)`

4. **Get Manager role**
   - Query Role with `role_type='manager'`

5. **Define manager permission modules**
   - Products: full CRUD
   - Inventory: full CRUD
   - Orders: view, change, cancel
   - Customers: view, add, change
   - Reports: view department reports
   - Staff: view only

6. **Query manager-level permissions**
   - Filter by resource and action combinations
   - Include: add, change, view on assigned modules
   - Exclude: delete (except products), system operations

7. **Create permission list**
   - Define list of codenames for manager permissions
   - Example: `['products.add_product', 'products.change_product', ...]`

8. **Bulk create assignments**
   - Filter permissions by codename list
   - Create RolePermission records

9. **Create reverse migration function**
   - Remove all Manager permission assignments

10. **Test migration**
    - Verify correct permissions assigned
    - Ensure Manager can't delete users or access system settings

### Permission Scope
| Module | Add | Change | View | Delete |
|--------|-----|--------|------|--------|
| **Products** | ✓ | ✓ | ✓ | ✓ |
| **Inventory** | ✓ | ✓ | ✓ | ✓ |
| **Orders** | ✗ | ✓ | ✓ | ✗ |
| **Customers** | ✓ | ✓ | ✓ | ✗ |
| **Staff** | ✗ | ✗ | ✓ | ✗ |
| **Reports** | ✗ | ✗ | ✓ | ✗ |
| **Users** | ✗ | ✗ | ✗ | ✗ |
| **System** | ✗ | ✗ | ✗ | ✗ |

### Manager Permission Pattern
```
<module>.<action>  (Limited to department operations)
```

**Examples Included:**
- `products.add_product`
- `products.change_product`
- `products.view_product`
- `products.delete_product`
- `inventory.add_stockmovement`
- `inventory.change_stockmovement`
- `orders.view_order`
- `orders.change_order` (status updates)
- `customers.view_customer`
- `reports.view_department_reports`

**Examples Excluded:**
- `users.add_user`
- `users.delete_user`
- `orders.delete_order`
- `system.change_settings`

### Expected Outcome
```
backend/apps/users/migrations/
└── XXXX_assign_manager_permissions.py
    ├── assign_manager_permissions()
    ├── remove_manager_permissions()
    └── operations: RunPython()
```

### Verification Checklist
- [ ] Data migration file created
- [ ] Manager-level permissions defined
- [ ] Product and inventory full access granted
- [ ] Order view/change access granted
- [ ] Delete permissions limited
- [ ] System access denied
- [ ] Migration runs successfully
- [ ] Reverse migration works

---

## Task 44: Assign Staff Permissions

### Overview
Create a data migration that assigns basic CRUD permissions to the Staff role for their assigned modules, with restrictions on delete and system operations.

### Dependencies
- Task 43: Assign Manager Permissions

### Instructions

1. **Create data migration file**
   - Generate empty migration: `python manage.py makemigrations users --empty`
   - Name: `assign_staff_permissions`

2. **Import required models**
   - Import Role, Permission, RolePermission models

3. **Create forward migration function**
   - Define `assign_staff_permissions(apps, schema_editor)`

4. **Get Staff role**
   - Query Role with `role_type='staff'`

5. **Define staff permission scope**
   - Focus on operational modules
   - Limited to add, change, view
   - No delete permissions

6. **Define staff module access**
   - Products: add, change, view
   - Inventory: add, change, view
   - Orders: view, change (status only)
   - Customers: view only
   - Own profile: change

7. **Create permission codename list**
   - List all staff-level permissions
   - Example: `['products.add_product', 'products.change_product', 'products.view_product', ...]`

8. **Bulk create assignments**
   - Filter permissions by codename list
   - Create RolePermission records

9. **Create reverse migration function**
   - Remove all Staff permission assignments

10. **Test migration**
    - Verify staff can perform basic operations
    - Ensure no delete or system access

### Permission Scope
| Module | Add | Change | View | Delete |
|--------|-----|--------|------|--------|
| **Products** | ✓ | ✓ | ✓ | ✗ |
| **Inventory** | ✓ | ✓ | ✓ | ✗ |
| **Orders** | ✗ | ✓ | ✓ | ✗ |
| **Customers** | ✗ | ✗ | ✓ | ✗ |
| **Own Profile** | ✗ | ✓ | ✓ | ✗ |
| **Reports** | ✗ | ✗ | ✗ | ✗ |
| **Users** | ✗ | ✗ | ✗ | ✗ |
| **System** | ✗ | ✗ | ✗ | ✗ |

### Staff Permission Pattern
```
<module>.<view|add|change>  (No delete, no system)
```

**Examples Included:**
- `products.add_product`
- `products.change_product`
- `products.view_product`
- `inventory.add_stockmovement`
- `inventory.change_stockmovement`
- `inventory.view_stockmovement`
- `orders.view_order`
- `orders.change_order` (limited to status)
- `customers.view_customer`
- `users.change_own_profile`

**Examples Excluded:**
- `products.delete_product`
- `inventory.delete_stockmovement`
- `orders.delete_order`
- `customers.add_customer`
- `users.add_user`
- `reports.view_report`
- `system.change_settings`

### Expected Outcome
```
backend/apps/users/migrations/
└── XXXX_assign_staff_permissions.py
    ├── assign_staff_permissions()
    ├── remove_staff_permissions()
    └── operations: RunPython()
```

### Verification Checklist
- [ ] Data migration file created
- [ ] Staff-level permissions defined
- [ ] Basic CRUD access granted (no delete)
- [ ] Order status change allowed
- [ ] Customer view-only access
- [ ] No delete permissions
- [ ] No system access
- [ ] Migration runs successfully

---

## Task 45: Assign Customer Permissions

### Overview
Create a data migration that assigns minimal permissions to the Customer role, limited to viewing their own orders and managing their profile in the webstore.

### Dependencies
- Task 44: Assign Staff Permissions

### Instructions

1. **Create data migration file**
   - Generate empty migration: `python manage.py makemigrations users --empty`
   - Name: `assign_customer_permissions`

2. **Import required models**
   - Import Role, Permission, RolePermission models

3. **Create forward migration function**
   - Define `assign_customer_permissions(apps, schema_editor)`

4. **Get Customer role**
   - Query Role with `role_type='customer'`

5. **Define customer permission scope**
   - Minimal webstore access only
   - Own data only (orders, profile, cart)

6. **Create permission codename list**
   - Define minimal permission set
   - Focus on webstore self-service

7. **Define customer permissions**
   - `orders.view_own_order`
   - `orders.add_order` (place order)
   - `users.view_own_profile`
   - `users.change_own_profile`
   - `cart.add_item`
   - `cart.change_item`
   - `cart.delete_item`
   - `products.view_product` (catalog)

8. **Bulk create assignments**
   - Filter permissions by codename list
   - Create RolePermission records

9. **Create reverse migration function**
   - Remove all Customer permission assignments

10. **Test migration**
    - Verify customer can only access own data
    - Ensure no backend/ERP access

### Permission Scope
| Resource | Add | Change | View | Delete |
|----------|-----|--------|------|--------|
| **Own Orders** | ✓ | ✗ | ✓ | ✗ |
| **Own Profile** | ✗ | ✓ | ✓ | ✗ |
| **Own Cart** | ✓ | ✓ | ✓ | ✓ |
| **Products** | ✗ | ✗ | ✓ | ✗ |
| **All Orders** | ✗ | ✗ | ✗ | ✗ |
| **All Users** | ✗ | ✗ | ✗ | ✗ |
| **Inventory** | ✗ | ✗ | ✗ | ✗ |
| **Reports** | ✗ | ✗ | ✗ | ✗ |

### Customer Permission Pattern
```
<module>.view_product
<module>.<action>_own_<resource>
```

**Examples Included:**
- `orders.view_own_order`
- `orders.add_order`
- `users.view_own_profile`
- `users.change_own_profile`
- `cart.add_cart_item`
- `cart.change_cart_item`
- `cart.delete_cart_item`
- `products.view_product`

**Examples Excluded:**
- `orders.view_order` (all orders)
- `orders.change_order`
- `orders.delete_order`
- `users.view_user` (all users)
- `products.add_product`
- `inventory.view_stockmovement`
- `reports.view_report`

### Expected Outcome
```
backend/apps/users/migrations/
└── XXXX_assign_customer_permissions.py
    ├── assign_customer_permissions()
    ├── remove_customer_permissions()
    └── operations: RunPython()
```

### Verification Checklist
- [ ] Data migration file created
- [ ] Customer permissions defined
- [ ] Own orders view/add access
- [ ] Own profile view/change access
- [ ] Cart full access
- [ ] Product catalog view access
- [ ] No access to others' data
- [ ] No backend/ERP access
- [ ] Migration runs successfully

---

## Task 46: Document Role-Permission System

### Overview
Create comprehensive documentation for the role-permission system, including architecture diagrams, usage examples, and maintenance guidelines.

### Dependencies
- Task 45: Assign Customer Permissions

### Instructions

1. **Create documentation file**
   - Create `ROLE_PERMISSION_SYSTEM.md` in `backend/apps/users/docs/`
   - Create directory if it doesn't exist

2. **Add system overview section**
   - Explain role-based access control (RBAC)
   - Describe RolePermission junction model
   - Explain multi-tenant scoping

3. **Add architecture diagram**
   - Show User → Role → Permission relationship
   - Include RolePermission junction
   - Show audit fields (granted_by, granted_at)

4. **Add role hierarchy section**
   - List all system roles
   - Show permission levels for each
   - Create comparison table

5. **Create permission matrix**
   - Table showing all roles and their permissions
   - Modules as rows, roles as columns
   - Use ✓/✗ for access indicators

6. **Add usage examples section**
   - Check user permissions
   - Assign permissions to role
   - Revoke permissions from role
   - Check role has permission
   - Bulk permission assignment

7. **Add default permission sets**
   - Document Super Admin permissions
   - Document Tenant Admin permissions
   - Document Manager permissions
   - Document Staff permissions
   - Document Customer permissions

8. **Add custom permission creation**
   - How to create new permissions
   - Naming conventions
   - Migration patterns

9. **Add best practices section**
   - Use roles, not direct user permissions
   - Principle of least privilege
   - Audit trail importance
   - Testing permission logic

10. **Add maintenance guidelines**
    - How to modify role permissions
    - Data migration patterns
    - Testing strategy
    - Security considerations

11. **Add API examples**
    - Django admin integration
    - REST API permission checks
    - View-level decorators
    - Model-level checks

12. **Add troubleshooting section**
    - Common permission issues
    - Debug techniques
    - Testing in Django shell

### Documentation Structure

| Section | Content |
|---------|---------|
| **Overview** | System purpose and architecture |
| **Architecture** | Models and relationships |
| **Role Hierarchy** | All roles and their levels |
| **Permission Matrix** | Complete permission mapping |
| **Usage Examples** | Code examples |
| **Default Assignments** | Migration details |
| **Custom Permissions** | How to extend |
| **Best Practices** | Development guidelines |
| **API Integration** | Usage in views/APIs |
| **Troubleshooting** | Common issues and solutions |

### Permission Matrix Example
```markdown
| Module | Super Admin | Tenant Admin | Manager | Staff | Customer |
|--------|-------------|--------------|---------|-------|----------|
| Products | CRUD | CRUD | CRUD | CRV | V |
| Orders | CRUD | CRUD | CRV | CV | V (own) |
| Users | CRUD | CRUD | V | V (own) | V (own) |
| System | CRUD | ✗ | ✗ | ✗ | ✗ |

Legend: C=Create, R=Read/View, U=Update/Change, D=Delete, V=View only
```

### Code Examples to Include

**Check User Permission:**
```python
user = User.objects.get(email='john@example.com')
if user.role.has_permission('products.add_product'):
    # User can add products
    pass
```

**Assign Permission to Role:**
```python
from apps.users.models import Role, Permission
role = Role.objects.get(role_type='staff')
permission = Permission.objects.get(codename='products.add_product')
role.permissions.assign_permission(role, permission)
```

**Check in View:**
```python
from apps.users.decorators import permission_required

@permission_required('products.add_product')
def create_product(request):
    # Only users with add_product permission can access
    pass
```

### Expected Outcome
```
backend/apps/users/docs/
└── ROLE_PERMISSION_SYSTEM.md
    ├── Overview
    ├── Architecture Diagram
    ├── Role Hierarchy
    ├── Permission Matrix
    ├── Usage Examples
    ├── Default Assignments
    ├── Custom Permissions
    ├── Best Practices
    ├── API Integration
    └── Troubleshooting
```

### Verification Checklist
- [ ] Documentation file created
- [ ] System overview included
- [ ] Architecture diagram added
- [ ] Role hierarchy documented
- [ ] Permission matrix completed
- [ ] Usage examples provided
- [ ] Default assignments documented
- [ ] Best practices listed
- [ ] API integration examples included
- [ ] Troubleshooting section added
- [ ] Code examples tested
- [ ] Markdown formatting correct

---

## Summary

### Tasks Completed in This Document
| Task # | Task Name | Key Deliverable |
|--------|-----------|-----------------|
| 41 | Assign Super Admin Permissions | Migration for all permissions |
| 42 | Assign Tenant Admin Permissions | Migration for tenant permissions |
| 43 | Assign Manager Permissions | Migration for department permissions |
| 44 | Assign Staff Permissions | Migration for basic CRUD permissions |
| 45 | Assign Customer Permissions | Migration for minimal webstore permissions |
| 46 | Document Role-Permission System | Comprehensive system documentation |

### Final Group C File Structure
```
backend/apps/users/
├── migrations/
│   ├── XXXX_assign_super_admin_permissions.py
│   ├── XXXX_assign_tenant_admin_permissions.py
│   ├── XXXX_assign_manager_permissions.py
│   ├── XXXX_assign_staff_permissions.py
│   └── XXXX_assign_customer_permissions.py
└── docs/
    └── ROLE_PERMISSION_SYSTEM.md
```

### Permission Assignment Summary

| Role | Permission Count | Key Characteristics |
|------|------------------|---------------------|
| **Super Admin** | ALL (~200+) | Unrestricted system access |
| **Tenant Admin** | ~180 | All tenant operations, no system |
| **Manager** | ~50 | Department-level, module management |
| **Staff** | ~25 | Basic CRUD, no delete/system |
| **Customer** | ~8 | Own data only, webstore access |

### Default Permission Sets

**Super Admin:** `*.*`  
**Tenant Admin:** All except `system.*`  
**Manager:** Module CRUD + reports  
**Staff:** Module CR (no delete)  
**Customer:** Own data view/edit only

### Group C Completion
All 16 tasks in Group C are now complete. The role-permission assignment system has been implemented with:
- RolePermission junction model
- RolePermissionManager with helper methods
- Default permission assignments for all 5 system roles
- Comprehensive documentation

### Next Steps
1. **Run all migrations** to create database records
2. **Test permissions** in Django shell/admin
3. **Verify role assignments** match specifications
4. Proceed to [../Group-D_User-Role-Management/](../Group-D_User-Role-Management/) to implement user-role relationships

---

## Notes for AI Agents

1. **Migration Order:** Execute migrations in task order (41→42→43→44→45)
2. **Data Integrity:** Use `bulk_create` for efficiency, handle role existence checks
3. **Permission Filtering:** Use `exclude()` and `filter()` to scope permissions correctly
4. **Reverse Migrations:** Always provide reverse operations for rollback
5. **Testing:** Test each migration in isolation before proceeding
6. **Documentation:** Keep ROLE_PERMISSION_SYSTEM.md updated as system evolves
7. **Security:** Follow principle of least privilege - grant minimum necessary permissions
8. **Audit Trail:** Consider adding granted_by field for accountability
9. **Naming Convention:** Permission codenames follow `<app>.<action>_<model>` pattern
10. **Own Data Permissions:** Customer role uses special `_own_` pattern for data isolation
