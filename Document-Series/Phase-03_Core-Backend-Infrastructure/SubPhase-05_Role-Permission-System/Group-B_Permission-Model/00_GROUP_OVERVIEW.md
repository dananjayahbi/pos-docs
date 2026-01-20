# Group B: Permission Model

> **Phase:** 03 - Core Backend Infrastructure  
> **SubPhase:** 05 - Role & Permission System  
> **Group:** B of F  
> **Tasks Covered:** 15-30  
> **Group Goal:** Create Permission and PermissionGroup models with module-based organization

---

## Navigation

- **↑ Parent:** [00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [Group-A_Role-Model-Foundation](../Group-A_Role-Model-Foundation/)
- **→ Next Group:** [Group-C_Role-Permission-Assignment](../Group-C_Role-Permission-Assignment/)

---

## Group Overview

This group creates the Permission model that defines granular access rights and the PermissionGroup model for organizing related permissions. Permissions are organized by module and action type.

### Key Components
- **Permission Model:** Individual permission definition
- **PermissionGroup Model:** Group related permissions
- **Module Constants:** Module enum/choices
- **Action Constants:** CRUD action types
- **Default Permissions:** Data migrations per module

### Action Types
| Action | Description |
|--------|-------------|
| view | Read access |
| add | Create new records |
| change | Update existing records |
| delete | Remove records |

### Module Permissions
- Products Module
- Inventory Module
- Sales Module
- Customers Module
- Reports Module

---

## Documents in This Group

| Document # | Document Name | Tasks Covered | Description |
|------------|---------------|---------------|-------------|
| DOC-01 | Permission Model | Tasks 15-19 | Permission model with fields |
| DOC-02 | PermissionGroup Model | Tasks 20-22 | Group model for permissions |
| DOC-03 | Constants Definition | Tasks 23-24 | Module and action enums |
| DOC-04 | Default Permissions | Tasks 25-30 | Module permissions & docs |

---

## Task Summary

| Task # | Task Name | Key Points |
|--------|-----------|------------|
| 15 | Create Permission Model Class | Permission definition |
| 16 | Add codename Field | Permission codename (products.add) |
| 17 | Add name Field | Human-readable name |
| 18 | Add module Field | Module grouping (products, sales) |
| 19 | Add action Field | CRUD action type |
| 20 | Create PermissionGroup Model | Group related permissions |
| 21 | Add group_name Field | Group name |
| 22 | Add permissions ManyToMany | Permissions in group |
| 23 | Define Module Constants | Module enum/choices |
| 24 | Define Action Constants | view, add, change, delete |
| 25 | Create Default Permissions | Data migration for permissions |
| 26 | Products Module Permissions | Product CRUD permissions |
| 27 | Inventory Module Permissions | Inventory CRUD permissions |
| 28 | Sales Module Permissions | Sales CRUD permissions |
| 29 | Reports Module Permissions | Reports access permissions |
| 30 | Document Permissions | Permission documentation |

---

## Execution Order

```
[Tasks 15-19: Permission Model]
        │
        ▼
[Tasks 20-22: PermissionGroup Model]
        │
        ▼
[Tasks 23-24: Constants]
        │
        ▼
[Tasks 25-30: Default Permissions & Docs]
```

---

## Expected Deliverables

### Code Files
```
backend/apps/users/
├── models/
│   └── permission.py
│       ├── class ModuleChoices(TextChoices)
│       ├── class ActionChoices(TextChoices)
│       ├── class Permission(BaseModel)
│       │   ├── codename: CharField
│       │   ├── name: CharField
│       │   ├── module: CharField (choices)
│       │   └── action: CharField (choices)
│       └── class PermissionGroup(BaseModel)
│           ├── group_name: CharField
│           └── permissions: ManyToManyField
└── migrations/
    └── XXXX_create_default_permissions.py
```

### Permission Codename Format
```python
# Format: {module}.{action}_{resource}
PERMISSION_EXAMPLES = [
    'products.view_product',
    'products.add_product',
    'products.change_product',
    'products.delete_product',
    'inventory.view_stock',
    'sales.add_order',
    'reports.view_sales_report',
]
```

### Module Constants
```python
class ModuleChoices(models.TextChoices):
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

---

## Notes for AI Agents

1. **Codename Format:** `{module}.{action}_{resource}`
2. **Unique Constraint:** codename must be unique
3. **ManyToMany:** PermissionGroup has ManyToMany to Permission
4. **Module Grouping:** Organize permissions by module
5. **Action Types:** view, add, change, delete
6. **Data Migration:** Create default permissions via migration
7. **Human-Readable:** name field for display purposes
