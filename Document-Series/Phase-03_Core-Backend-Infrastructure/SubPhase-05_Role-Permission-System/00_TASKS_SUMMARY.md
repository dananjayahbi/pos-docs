# SubPhase 05: Role & Permission System - Tasks Summary

> **Phase:** 03 - Core Backend Infrastructure  
> **SubPhase Index:** 05 of 12  
> **SubPhase Goal:** Implement the platform hierarchy permission system  
> **Total Tasks:** 92 | **Status:** Planning  
> **Estimated Duration:** 7-8 hours

---

## Navigation

- **↑ Parent:** [00_SUBPHASES_SUMMARY.md](../00_SUBPHASES_SUMMARY.md)
- **← Previous SubPhase:** [SubPhase-04_User-Model-Authentication](../SubPhase-04_User-Model-Authentication/)
- **→ Next SubPhase:** [SubPhase-06_Core-Middleware-Stack](../SubPhase-06_Core-Middleware-Stack/)

---

## SubPhase Overview

This sub-phase implements the role-based access control (RBAC) system for the LankaCommerce Cloud platform. The system supports a hierarchical permission structure with tenant-scoped permissions.

### Key Outcomes
- Role hierarchy implemented
- Permission groups defined
- Tenant-scoped permissions working
- API endpoint protection
- Permission decorators ready
- Role assignment API endpoints

### Role Hierarchy
```
Super Admin (Platform Owner)
    └── Tenant Admin (Business Owner)
            └── Manager (Department Head)
                    └── Staff (Employee)
                            └── Customer (Webstore User)
```

### Key Features
- **RBAC:** Role-based access control
- **Tenant Scoped:** Permissions per tenant
- **Hierarchical:** Roles inherit from parent
- **Modular:** Permission groups per module
- **API Protected:** Decorator-based protection

### Dependencies
- **Requires:** SubPhase-04 (User Model & Authentication)

---

## Task Execution Order

```
TASK GROUP A: Role Model Foundation (Tasks 01-14)
        │
        ▼
TASK GROUP B: Permission Model (Tasks 15-30)
        │
        ▼
TASK GROUP C: Role-Permission Assignment (Tasks 31-46)
        │
        ▼
TASK GROUP D: User-Role Management (Tasks 47-62)
        │
        ▼
TASK GROUP E: Permission Decorators & Mixins (Tasks 63-78)
        │
        ▼
TASK GROUP F: API Endpoints & Testing (Tasks 79-92)
```

---

## Task Index

### Group A: Role Model Foundation (Tasks 01-14)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 01 | **Create Roles App Directory** | mkdir apps/roles or in users | SubPhase-04 | 🔴 Not Created |
| 02 | **Create Role Model File** | models.py for roles | Task 01 | 🔴 Not Created |
| 03 | **Create Role Model Class** | Role model definition | Task 02 | 🔴 Not Created |
| 04 | **Add name Field** | Role name (unique per tenant) | Task 03 | 🔴 Not Created |
| 05 | **Add slug Field** | URL-safe identifier | Task 04 | 🔴 Not Created |
| 06 | **Add description Field** | Role description | Task 05 | 🔴 Not Created |
| 07 | **Add is_system_role Field** | Non-deletable flag | Task 06 | 🔴 Not Created |
| 08 | **Add hierarchy_level Field** | Role level (0-4) | Task 07 | 🔴 Not Created |
| 09 | **Add parent ForeignKey** | Parent role reference | Task 08 | 🔴 Not Created |
| 10 | **Add tenant ForeignKey** | Tenant-scoped roles | Task 09 | 🔴 Not Created |
| 11 | **Create RoleManager** | Custom manager | Task 10 | 🔴 Not Created |
| 12 | **Add Meta class** | Unique together constraints | Task 11 | 🔴 Not Created |
| 13 | **Create Default Roles Migration** | System roles data | Task 12 | 🔴 Not Created |
| 14 | **Document Role Model** | Model documentation | Task 13 | 🔴 Not Created |

---

### Group B: Permission Model (Tasks 15-30)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 15 | **Create Permission Model Class** | Permission definition | Task 14 | 🔴 Not Created |
| 16 | **Add codename Field** | Permission codename | Task 15 | 🔴 Not Created |
| 17 | **Add name Field** | Human-readable name | Task 16 | 🔴 Not Created |
| 18 | **Add module Field** | Module grouping | Task 17 | 🔴 Not Created |
| 19 | **Add action Field** | CRUD action type | Task 18 | 🔴 Not Created |
| 20 | **Create PermissionGroup Model** | Group permissions | Task 19 | 🔴 Not Created |
| 21 | **Add group_name Field** | Group name | Task 20 | 🔴 Not Created |
| 22 | **Add permissions ManyToMany** | Permissions in group | Task 21 | 🔴 Not Created |
| 23 | **Define Module Constants** | Module enum/choices | Task 22 | 🔴 Not Created |
| 24 | **Define Action Constants** | view, add, change, delete | Task 23 | 🔴 Not Created |
| 25 | **Create Default Permissions** | Data migration | Task 24 | 🔴 Not Created |
| 26 | **Products Module Permissions** | Product CRUD | Task 25 | 🔴 Not Created |
| 27 | **Inventory Module Permissions** | Inventory CRUD | Task 26 | 🔴 Not Created |
| 28 | **Sales Module Permissions** | Sales CRUD | Task 27 | 🔴 Not Created |
| 29 | **Reports Module Permissions** | Reports access | Task 28 | 🔴 Not Created |
| 30 | **Document Permissions** | Permission documentation | Task 29 | 🔴 Not Created |

---

### Group C: Role-Permission Assignment (Tasks 31-46)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 31 | **Create RolePermission Model** | Junction table | Task 30 | 🔴 Not Created |
| 32 | **Add role ForeignKey** | Link to Role | Task 31 | 🔴 Not Created |
| 33 | **Add permission ForeignKey** | Link to Permission | Task 32 | 🔴 Not Created |
| 34 | **Add granted_at Field** | Assignment timestamp | Task 33 | 🔴 Not Created |
| 35 | **Add granted_by ForeignKey** | Who assigned | Task 34 | 🔴 Not Created |
| 36 | **Create Unique Constraint** | Role-Permission unique | Task 35 | 🔴 Not Created |
| 37 | **Create RolePermissionManager** | Assignment manager | Task 36 | 🔴 Not Created |
| 38 | **Add assign_permission Method** | Assign to role | Task 37 | 🔴 Not Created |
| 39 | **Add revoke_permission Method** | Remove from role | Task 38 | 🔴 Not Created |
| 40 | **Add has_permission Method** | Check role permission | Task 39 | 🔴 Not Created |
| 41 | **Assign Super Admin Permissions** | All permissions | Task 40 | 🔴 Not Created |
| 42 | **Assign Tenant Admin Permissions** | Tenant-level perms | Task 41 | 🔴 Not Created |
| 43 | **Assign Manager Permissions** | Department-level | Task 42 | 🔴 Not Created |
| 44 | **Assign Staff Permissions** | Basic CRUD | Task 43 | 🔴 Not Created |
| 45 | **Assign Customer Permissions** | Minimal access | Task 44 | 🔴 Not Created |
| 46 | **Document Role-Permission** | Assignment docs | Task 45 | 🔴 Not Created |

---

### Group D: User-Role Management (Tasks 47-62)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 47 | **Create UserRole Model** | User-Role junction | Task 46 | 🔴 Not Created |
| 48 | **Add user ForeignKey** | Link to User | Task 47 | 🔴 Not Created |
| 49 | **Add role ForeignKey** | Link to Role | Task 48 | 🔴 Not Created |
| 50 | **Add assigned_at Field** | Assignment timestamp | Task 49 | 🔴 Not Created |
| 51 | **Add assigned_by ForeignKey** | Who assigned | Task 50 | 🔴 Not Created |
| 52 | **Add is_primary Field** | Primary role flag | Task 51 | 🔴 Not Created |
| 53 | **Create Unique Constraint** | User-Role unique | Task 52 | 🔴 Not Created |
| 54 | **Create UserRoleManager** | User role manager | Task 53 | 🔴 Not Created |
| 55 | **Add assign_role Method** | Assign role to user | Task 54 | 🔴 Not Created |
| 56 | **Add remove_role Method** | Remove role from user | Task 55 | 🔴 Not Created |
| 57 | **Add get_roles Method** | Get user's roles | Task 56 | 🔴 Not Created |
| 58 | **Add User.has_perm Method** | Permission check | Task 57 | 🔴 Not Created |
| 59 | **Add User.has_role Method** | Role check | Task 58 | 🔴 Not Created |
| 60 | **Add User.get_permissions** | All permissions | Task 59 | 🔴 Not Created |
| 61 | **Cache User Permissions** | Redis caching | Task 60 | 🔴 Not Created |
| 62 | **Document User Roles** | User-role docs | Task 61 | 🔴 Not Created |

---

### Group E: Permission Decorators & Mixins (Tasks 63-78)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 63 | **Create Permissions Module** | apps/core/permissions.py | Task 62 | 🔴 Not Created |
| 64 | **Create permission_required Decorator** | View decorator | Task 63 | 🔴 Not Created |
| 65 | **Create role_required Decorator** | Role check decorator | Task 64 | 🔴 Not Created |
| 66 | **Create any_permission_required** | OR logic decorator | Task 65 | 🔴 Not Created |
| 67 | **Create all_permissions_required** | AND logic decorator | Task 66 | 🔴 Not Created |
| 68 | **Create DRF Permission Class** | IsRolePermission | Task 67 | 🔴 Not Created |
| 69 | **Create IsSuperAdmin Permission** | Super admin check | Task 68 | 🔴 Not Created |
| 70 | **Create IsTenantAdmin Permission** | Tenant admin check | Task 69 | 🔴 Not Created |
| 71 | **Create IsManager Permission** | Manager check | Task 70 | 🔴 Not Created |
| 72 | **Create IsStaff Permission** | Staff check | Task 71 | 🔴 Not Created |
| 73 | **Create PermissionMixin** | View mixin | Task 72 | 🔴 Not Created |
| 74 | **Create RoleMixin** | Role view mixin | Task 73 | 🔴 Not Created |
| 75 | **Create TenantPermissionMixin** | Tenant-scoped perms | Task 74 | 🔴 Not Created |
| 76 | **Add to JWT Claims** | Add roles to token | Task 75 | 🔴 Not Created |
| 77 | **Create Permission Denied Response** | Standard 403 response | Task 76 | 🔴 Not Created |
| 78 | **Document Decorators** | Decorator documentation | Task 77 | 🔴 Not Created |

---

### Group F: API Endpoints & Testing (Tasks 79-92)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 79 | **Create Role Serializers** | Role API serializers | Task 78 | 🔴 Not Created |
| 80 | **Create Permission Serializers** | Permission serializers | Task 79 | 🔴 Not Created |
| 81 | **Create RoleListView** | List roles API | Task 80 | 🔴 Not Created |
| 82 | **Create RoleDetailView** | Role detail API | Task 81 | 🔴 Not Created |
| 83 | **Create RoleCreateView** | Create role API | Task 82 | 🔴 Not Created |
| 84 | **Create AssignRoleView** | Assign role API | Task 83 | 🔴 Not Created |
| 85 | **Create RevokeRoleView** | Remove role API | Task 84 | 🔴 Not Created |
| 86 | **Create MyPermissionsView** | Current user perms | Task 85 | 🔴 Not Created |
| 87 | **Create Role URLs** | Role API routes | Task 86 | 🔴 Not Created |
| 88 | **Register in Admin** | Admin for roles | Task 87 | 🔴 Not Created |
| 89 | **Create Role Model Tests** | Model unit tests | Task 88 | 🔴 Not Created |
| 90 | **Create Permission Tests** | Permission tests | Task 89 | 🔴 Not Created |
| 91 | **Create Decorator Tests** | Decorator tests | Task 90 | 🔴 Not Created |
| 92 | **Document Role System** | Complete documentation | Task 91 | 🔴 Not Created |

---

## Expected Final Structure

```
backend/apps/users/
├── models.py
│   ├── User
│   ├── Role
│   ├── Permission
│   ├── PermissionGroup
│   ├── RolePermission
│   └── UserRole
├── managers.py
│   ├── RoleManager
│   ├── PermissionManager
│   ├── RolePermissionManager
│   └── UserRoleManager
├── permissions.py
│   ├── permission_required
│   ├── role_required
│   ├── IsSuperAdmin
│   ├── IsTenantAdmin
│   ├── IsManager
│   └── IsStaff
├── serializers.py
│   ├── RoleSerializer
│   ├── PermissionSerializer
│   └── UserRoleSerializer
├── views.py
│   ├── RoleListView
│   ├── RoleDetailView
│   ├── AssignRoleView
│   └── MyPermissionsView
└── tests/
    ├── test_roles.py
    ├── test_permissions.py
    └── test_decorators.py
```

---

## Role Hierarchy Diagram

```
┌─────────────────────────────────────────────────────┐
│               ROLE HIERARCHY                        │
├─────────────────────────────────────────────────────┤
│                                                     │
│  Level 0: SUPER_ADMIN                               │
│  ┌─────────────────────────────────────────────┐   │
│  │ Platform-wide access                        │   │
│  │ Manages all tenants                         │   │
│  │ System configuration                        │   │
│  └─────────────────────────────────────────────┘   │
│           │                                         │
│           ▼                                         │
│  Level 1: TENANT_ADMIN                              │
│  ┌─────────────────────────────────────────────┐   │
│  │ Full tenant access                          │   │
│  │ User management                             │   │
│  │ Settings configuration                      │   │
│  └─────────────────────────────────────────────┘   │
│           │                                         │
│           ▼                                         │
│  Level 2: MANAGER                                   │
│  ┌─────────────────────────────────────────────┐   │
│  │ Department-level access                     │   │
│  │ Staff management                            │   │
│  │ Reports access                              │   │
│  └─────────────────────────────────────────────┘   │
│           │                                         │
│           ▼                                         │
│  Level 3: STAFF                                     │
│  ┌─────────────────────────────────────────────┐   │
│  │ Basic CRUD operations                       │   │
│  │ Limited module access                       │   │
│  └─────────────────────────────────────────────┘   │
│           │                                         │
│           ▼                                         │
│  Level 4: CUSTOMER                                  │
│  ┌─────────────────────────────────────────────┐   │
│  │ Webstore access only                        │   │
│  │ Own orders and profile                      │   │
│  └─────────────────────────────────────────────┘   │
│                                                     │
└─────────────────────────────────────────────────────┘
```

---

## Progress Tracking

| Metric | Count |
|--------|-------|
| Total Tasks | 92 |
| Tasks Completed | 0 |
| Tasks In Progress | 0 |
| Tasks Not Started | 92 |

**Last Updated:** 2026-01-17  
**Current Status:** Ready for task document creation

---

## Notes for AI Agents

1. **Execution Order:** Complete Group A before B, etc.
2. **Hierarchy Levels:** 0=Super Admin, 4=Customer
3. **Tenant Scoped:** Roles are tenant-specific (except Super Admin)
4. **System Roles:** Cannot be deleted
5. **Permission Caching:** Cache in Redis for performance
6. **JWT Claims:** Include roles in token
7. **DRF Permissions:** Use custom permission classes
8. **Testing Required:** Test all permission combinations
9. **Default Roles:** Create via data migration
