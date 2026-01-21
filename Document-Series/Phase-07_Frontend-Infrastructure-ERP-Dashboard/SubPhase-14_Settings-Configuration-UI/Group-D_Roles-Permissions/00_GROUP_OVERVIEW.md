# Group D: Roles & Permissions

> **Phase:** 07 - Frontend Infrastructure & ERP Dashboard  
> **SubPhase:** 14 - Settings & Configuration UI  
> **Group:** D of F  
> **Tasks Covered:** 49-64  
> **Group Goal:** Build role management with permission matrix and role CRUD

---

## Navigation

- **↑ Parent:** [00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [Group-C_User-Management](../Group-C_User-Management/)
- **→ Next Group:** [Group-E_Integrations-API-Keys](../Group-E_Integrations-API-Keys/)

---

## Group Overview

This group creates the complete role and permission management interface. Creates roles page with header and add role button. Creates roles list with role cards. Each role card shows role info, user count, and actions. Creates add role modal with form schema, name input, and description input. Creates permission matrix with permission groups and individual checkboxes. Creates edit role page for modifying permissions. Creates delete role dialog. Connects to roles API.

### Key Outcomes

- Roles management page
- Roles header with add button
- Roles list
- Role card component
- Role user count
- Role actions
- Add role modal
- Role form schema
- Role name input
- Role description input
- Permission matrix
- Permission group component
- Permission checkbox component
- Edit role page
- Delete role dialog
- Connected to roles API

### Technology Context

- **Layout:** Role cards list
- **Matrix:** Permission grid
- **Form:** React Hook Form + Zod
- **Checkbox:** Grouped permissions

---

## Documents in This Group

| # | Document | Description | Tasks Covered |
|---|----------|-------------|---------------|
| 01 | `01_Tasks-49-58_List-Form.md` | Create roles list and form | 49-58 |
| 02 | `02_Tasks-59-64_Matrix-Edit-API.md` | Create permission matrix, edit, and API | 59-64 |

---

## Task Summary

| Task # | Task Name | Complexity | Dependencies |
|--------|-----------|------------|--------------|
| 49 | Create Roles Page | Low | Task 14 |
| 50 | Create Roles Header | Low | Task 49 |
| 51 | Create Roles List | Medium | Task 49 |
| 52 | Create Role Card | Medium | Task 51 |
| 53 | Create Role User Count | Low | Task 52 |
| 54 | Create Role Actions | Low | Task 52 |
| 55 | Create Add Role Modal | Medium | Task 49 |
| 56 | Create Role Form Schema | Medium | Task 55 |
| 57 | Create Role Name Input | Low | Task 56 |
| 58 | Create Role Description Input | Low | Task 56 |
| 59 | Create Permission Matrix | High | Task 55 |
| 60 | Create Permission Group | Medium | Task 59 |
| 61 | Create Permission Checkbox | Low | Task 60 |
| 62 | Create Edit Role Page | Medium | Task 49 |
| 63 | Create Delete Role Dialog | Low | Task 54 |
| 64 | Connect Roles to API | Medium | Task 63 |

---

## Execution Order

```
Task 49: Roles Page
    │
    ├──────────────────────────────────────────────────┐
    ▼                                                  │
Task 50: Roles Header                                  │
    │                                                  │
    ▼                                                  │
Task 51: Roles List                                    │
    │                                                  │
    ▼                                                  │
Task 52: Role Card                                     │
    │                                                  │
    ├──────────┬──────────┐                            │
    ▼          ▼          │                            │
Task 53    Task 54       │                            │
(Count)    (Actions)      │                            │
    │          │          │                            │
    └──────────┘          │                            │
               │          │                            │
               ▼          │                            │
         Task 55: Add Role Modal                       │
               │          │                            │
               ▼          │                            │
         Task 56: Form Schema                          │
               │          │                            │
         ┌─────┴─────┐    │                            │
         ▼           ▼    │                            │
      Task 57    Task 58  │                            │
      (Name)   (Description)                           │
         │           │    │                            │
         └─────┬─────┘    │                            │
               │          │                            │
               └──────────┘                            │
                          │                            │
                          ▼                            │
                    Task 59: Permission Matrix         │
                          │                            │
                          ▼                            │
                    Task 60: Permission Group          │
                          │                            │
                          ▼                            │
                    Task 61: Checkbox                  │
                          │                            │
                          ▼                            │
                    Task 62: Edit Role Page            │
                          │                            │
                          ▼                            │
                    Task 63: Delete Dialog             │
                          │                            │
                          ▼
                    Task 64: API
```

---

## Expected Deliverables

```
frontend/
├── app/
│   └── (dashboard)/
│       └── settings/
│           └── roles/
│               ├── page.tsx
│               └── [id]/
│                   └── page.tsx
├── components/
│   └── modules/
│       └── settings/
│           └── Roles/
│               ├── RolesPage.tsx
│               ├── RolesHeader.tsx
│               ├── RolesList.tsx
│               ├── RoleCard.tsx
│               ├── RoleUserCount.tsx
│               ├── RoleActions.tsx
│               ├── AddRoleModal.tsx
│               ├── RoleForm.tsx
│               ├── RoleNameInput.tsx
│               ├── RoleDescriptionInput.tsx
│               ├── PermissionMatrix.tsx
│               ├── PermissionGroup.tsx
│               ├── PermissionCheckbox.tsx
│               ├── EditRolePage.tsx
│               ├── DeleteRoleDialog.tsx
│               └── index.ts
└── lib/
    └── validations/
        └── role.ts
```

---

## Notes for AI Agents

### Role Card (Task 52)
| Element | Content |
|---------|---------|
| Name | Role name |
| Description | Role description |
| Users | User count badge |
| Actions | Edit, Delete |
| System | Badge if system role |

### Default Roles
| Role | Description | System |
|------|-------------|--------|
| Admin | Full access | Yes |
| Manager | Management access | Yes |
| Cashier | POS access only | Yes |
| Staff | Limited access | Yes |
| Viewer | Read-only | No |

### Role Form Schema (Task 56)
| Field | Type | Validation |
|-------|------|------------|
| name | string | Required, 2-50 chars |
| description | string | Optional |
| permissions | array | At least 1 |
| is_default | boolean | Optional |

### Permission Groups (Task 60)
| Group | Permissions |
|-------|-------------|
| Dashboard | view_dashboard |
| Products | view, create, edit, delete |
| Inventory | view, adjust, transfer |
| Sales | view, create, void |
| Customers | view, create, edit, delete |
| Vendors | view, create, edit, delete |
| Reports | view, export |
| Settings | view, edit |
| Users | view, invite, edit, remove |
| Roles | view, create, edit, delete |

### Permission Checkbox (Task 61)
| State | Display |
|-------|---------|
| Checked | Blue checkbox |
| Unchecked | Empty checkbox |
| Disabled | Gray checkbox |

### Permission Matrix Layout (Task 59)
| Module | View | Create | Edit | Delete |
|--------|------|--------|------|--------|
| Products | ☑ | ☑ | ☑ | ☐ |
| Inventory | ☑ | ☑ | ☑ | ☐ |
| Sales | ☑ | ☑ | ☐ | ☐ |
| ... | ... | ... | ... | ... |

### Delete Role Dialog (Task 63)
| Element | Content |
|---------|---------|
| Title | Delete Role? |
| Warning | Users will lose access |
| Reassign | Select new role |
| Confirm | Type role name |
