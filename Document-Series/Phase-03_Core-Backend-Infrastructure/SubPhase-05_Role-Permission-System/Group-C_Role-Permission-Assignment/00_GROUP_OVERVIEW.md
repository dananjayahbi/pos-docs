# Group C: Role-Permission Assignment

> **Phase:** 03 - Core Backend Infrastructure  
> **SubPhase:** 05 - Role & Permission System  
> **Group:** C of F  
> **Tasks Covered:** 31-46  
> **Group Goal:** Create the junction table for role-permission assignments and default role configurations

---

## Navigation

- **↑ Parent:** [00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [Group-B_Permission-Model](../Group-B_Permission-Model/)
- **→ Next Group:** [Group-D_User-Role-Management](../Group-D_User-Role-Management/)

---

## Group Overview

This group creates the RolePermission junction model that links roles to permissions. It includes the manager methods for assigning and revoking permissions, and sets up default permission assignments for each system role.

### Key Components
- **RolePermission Model:** Junction table for Role-Permission
- **RolePermissionManager:** Custom manager with helper methods
- **Default Assignments:** Permission sets for each role level
- **Audit Fields:** Track who assigned permissions and when

### Assignment Flow
```
Role ──┬── RolePermission ──┬── Permission
       │                    │
       └── granted_by ──────┘
           granted_at
```

---

## Documents in This Group

| Document # | Document Name | Tasks Covered | Description |
|------------|---------------|---------------|-------------|
| DOC-01 | RolePermission Model | Tasks 31-36 | Junction model with fields |
| DOC-02 | RolePermissionManager | Tasks 37-40 | Manager with assignment methods |
| DOC-03 | Default Assignments | Tasks 41-46 | Role-level permission sets |

---

## Task Summary

| Task # | Task Name | Key Points |
|--------|-----------|------------|
| 31 | Create RolePermission Model | Junction table |
| 32 | Add role ForeignKey | Link to Role |
| 33 | Add permission ForeignKey | Link to Permission |
| 34 | Add granted_at Field | Assignment timestamp |
| 35 | Add granted_by ForeignKey | Who assigned (User) |
| 36 | Create Unique Constraint | Role-Permission unique |
| 37 | Create RolePermissionManager | Assignment manager |
| 38 | Add assign_permission Method | Assign to role |
| 39 | Add revoke_permission Method | Remove from role |
| 40 | Add has_permission Method | Check role has permission |
| 41 | Assign Super Admin Permissions | All permissions |
| 42 | Assign Tenant Admin Permissions | Tenant-level perms |
| 43 | Assign Manager Permissions | Department-level |
| 44 | Assign Staff Permissions | Basic CRUD |
| 45 | Assign Customer Permissions | Minimal access |
| 46 | Document Role-Permission | Assignment docs |

---

## Execution Order

```
[Tasks 31-36: RolePermission Model]
        │
        ▼
[Tasks 37-40: RolePermissionManager]
        │
        ▼
[Tasks 41-46: Default Assignments & Docs]
```

---

## Expected Deliverables

### Code Files
```
backend/apps/users/
├── models/
│   └── role_permission.py
│       └── class RolePermission(BaseModel):
│           ├── role: ForeignKey (Role)
│           ├── permission: ForeignKey (Permission)
│           ├── granted_at: DateTimeField
│           ├── granted_by: ForeignKey (User)
│           └── class Meta: unique_together
├── managers/
│   └── role_permission_manager.py
│       └── class RolePermissionManager(Manager):
│           ├── assign_permission()
│           ├── revoke_permission()
│           └── has_permission()
└── migrations/
    └── XXXX_assign_default_permissions.py
```

### Manager Methods
```python
class RolePermissionManager(models.Manager):
    def assign_permission(self, role, permission, granted_by=None):
        """Assign a permission to a role."""
        pass
    
    def revoke_permission(self, role, permission):
        """Remove a permission from a role."""
        pass
    
    def has_permission(self, role, permission_codename):
        """Check if role has a specific permission."""
        pass
```

### Default Permission Sets
| Role | Permission Level |
|------|------------------|
| Super Admin | All permissions (*.*) |
| Tenant Admin | All tenant-scoped permissions |
| Manager | Module management + reports |
| Staff | Basic CRUD (own records) |
| Customer | View own orders/profile |

---

## Notes for AI Agents

1. **Junction Table:** RolePermission links Role and Permission
2. **Unique Constraint:** Each role-permission pair is unique
3. **Audit Trail:** Track granted_at and granted_by
4. **Super Admin:** Gets all permissions automatically
5. **Inheritance:** Child roles can inherit parent permissions
6. **Bulk Assignment:** Use bulk_create for efficiency
7. **Data Migration:** Assign defaults in migration
