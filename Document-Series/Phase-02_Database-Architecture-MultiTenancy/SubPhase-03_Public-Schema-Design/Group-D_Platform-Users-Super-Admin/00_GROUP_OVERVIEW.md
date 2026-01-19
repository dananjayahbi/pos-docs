# Group D: Platform Users & Super Admin

> **Phase:** 02 - Database Architecture & Multi-Tenancy  
> **SubPhase:** 03 - Public Schema Design  
> **Group:** D of G  
> **Tasks Covered:** 43-58  
> **Group Goal:** Create platform-level user management and super admin system

---

## Navigation

- **↑ Parent:** [../00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [../Group-C_Platform-Settings-Model/](../Group-C_Platform-Settings-Model/)
- **→ Next Group:** [../Group-E_Feature-Flags-System/](../Group-E_Feature-Flags-System/)

---

## Group Overview

This group creates the PlatformUser model for super admins who manage the entire platform. This includes role-based permissions, two-factor authentication support, and custom user management.

### Key Outcomes
- PlatformUser model created
- AbstractUser extended
- Is platform admin flag
- Phone number field
- Profile photo field
- Last login IP tracking
- Two-factor authentication enabled field
- PlatformRole model created
- Role-based permissions defined
- User-Role M2M relationship
- Custom user manager created
- PlatformUser admin interface
- AUTH_USER_MODEL configured
- Superuser creation command
- Custom permissions defined
- User hierarchy documented

### Technology Context
- **Base:** AbstractUser extension
- **Roles:** Platform-level roles
- **Permissions:** Django permissions system
- **2FA:** Two-factor authentication ready

---

## Documents in This Group

| # | Document | Tasks | Description |
|---|----------|-------|-------------|
| 01 | 01_Tasks-43-49_Platform-User-Model.md | 43-49 | Create PlatformUser, extend AbstractUser, admin flag, phone, photo, IP, 2FA |
| 02 | 02_Tasks-50-54_Roles-Permissions-Admin.md | 50-54 | PlatformRole model, role permissions, User-Role M2M, user manager, admin |
| 03 | 03_Tasks-55-58_Auth-Config-Commands.md | 55-58 | Configure AUTH_USER_MODEL, superuser command, custom permissions, documentation |

---

## Task Summary

| Task # | Task Name | Dependencies | Complexity |
|--------|-----------|--------------|------------|
| 43 | Create PlatformUser Model | Task 07 | Medium |
| 44 | Extend AbstractUser | Task 43 | Medium |
| 45 | Add Is Platform Admin Field | Task 43 | Simple |
| 46 | Add Phone Number Field | Task 43 | Simple |
| 47 | Add Profile Photo Field | Task 43 | Simple |
| 48 | Add Last Login IP Field | Task 43 | Simple |
| 49 | Add Two Factor Enabled | Task 43 | Simple |
| 50 | Create PlatformRole Model | Task 43 | Medium |
| 51 | Add Role Permissions | Task 50 | Medium |
| 52 | Create User-Role M2M | Task 51 | Simple |
| 53 | Create Custom User Manager | Task 44 | Medium |
| 54 | Create PlatformUser Admin | Task 52 | Medium |
| 55 | Configure AUTH_USER_MODEL | Task 54 | Medium |
| 56 | Create Superuser Command | Task 53 | Medium |
| 57 | Create User Permissions | Task 51 | Medium |
| 58 | Document User Hierarchy | Task 57 | Simple |

---

## Execution Order

```
01_Tasks-43-49_Platform-User-Model.md
        │
        ▼
02_Tasks-50-54_Roles-Permissions-Admin.md
        │
        ▼
03_Tasks-55-58_Auth-Config-Commands.md
```

---

## Expected Deliverables

After completing this group:

```
backend/
└── apps/
    └── platform/
        ├── models/
        │   ├── user.py          # PlatformUser, PlatformRole
        │   └── managers.py      # Custom user manager
        ├── admin.py             # Updated with user admin
        └── management/
            └── commands/
                └── create_platform_admin.py

config/
└── settings/
    └── base.py                  # AUTH_USER_MODEL set

docs/
└── users/
    └── user-hierarchy.md        # User types documentation
```

---

## User Hierarchy

| User Type | Location | Scope |
|-----------|----------|-------|
| PlatformUser (Super Admin) | Public schema | All tenants |
| TenantUser (Admin) | Tenant schema | Single tenant |
| TenantUser (Staff) | Tenant schema | Single tenant |

---

## Platform Roles

| Role | Permissions |
|------|-------------|
| Super Admin | All platform operations |
| Support Admin | View tenants, handle support |
| Billing Admin | Manage subscriptions, invoices |
| Content Admin | Manage announcements, docs |

---

## Notes for AI Agents

1. **Dependencies:** Requires Group C complete (settings exist)
2. **AUTH_USER_MODEL:** MUST set before first migration
3. **AbstractUser:** Extend, don't modify
4. **Manager:** Custom manager for user creation
5. **Separate Users:** Platform users ≠ Tenant users
6. **Git Commit:** Commit after completing this group

