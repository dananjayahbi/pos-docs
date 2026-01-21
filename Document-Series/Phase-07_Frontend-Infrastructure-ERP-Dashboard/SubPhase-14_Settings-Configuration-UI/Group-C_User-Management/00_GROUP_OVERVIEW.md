# Group C: User Management

> **Phase:** 07 - Frontend Infrastructure & ERP Dashboard  
> **SubPhase:** 14 - Settings & Configuration UI  
> **Group:** C of F  
> **Tasks Covered:** 31-48  
> **Group Goal:** Build user management with listing, invitations, and account controls

---

## Navigation

- **↑ Parent:** [00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [Group-B_General-Company-Settings](../Group-B_General-Company-Settings/)
- **→ Next Group:** [Group-D_Roles-Permissions](../Group-D_Roles-Permissions/)

---

## Group Overview

This group creates the complete user management interface. Creates users page with header and invite button. Creates users table with columns for name, email, role, status, and last login. Adds user status badge (Active, Pending, Disabled) and user actions cell. Creates invite user modal with form schema, email input, and role select. Creates send invitation action. Creates edit user modal and change role action. Creates disable user action and remove user dialog. Creates pending invitations list with resend invitation action. Connects to users API.

### Key Outcomes

- Users management page
- Users header with invite button
- Users table
- Table columns defined
- User status badge
- User actions cell
- Invite user modal
- Invite form schema
- Email input
- Role select
- Send invitation action
- Edit user modal
- Change role action
- Disable user action
- Remove user dialog
- Pending invitations list
- Resend invitation action
- Connected to users API

### Technology Context

- **Data Table:** TanStack Table
- **Form:** React Hook Form + Zod
- **Modal:** Dialog components
- **Email:** Invitation emails

---

## Documents in This Group

| # | Document | Description | Tasks Covered |
|---|----------|-------------|---------------|
| 01 | `01_Tasks-31-41_List-Invite.md` | Create users list and invitation | 31-41 |
| 02 | `02_Tasks-42-48_Edit-Pending-API.md` | Create edit, pending invites, and API | 42-48 |

---

## Task Summary

| Task # | Task Name | Complexity | Dependencies |
|--------|-----------|------------|--------------|
| 31 | Create Users Page | Low | Task 14 |
| 32 | Create Users Header | Low | Task 31 |
| 33 | Create Users Table | Medium | Task 31 |
| 34 | Define Users Table Columns | Medium | Task 33 |
| 35 | Create User Status Badge | Low | Task 34 |
| 36 | Create User Actions Cell | Low | Task 34 |
| 37 | Create Invite User Modal | Medium | Task 31 |
| 38 | Create Invite Form Schema | Medium | Task 37 |
| 39 | Create Email Input | Low | Task 38 |
| 40 | Create Role Select | Low | Task 38 |
| 41 | Create Send Invitation Action | Medium | Task 40 |
| 42 | Create Edit User Modal | Medium | Task 33 |
| 43 | Create Change Role Action | Medium | Task 42 |
| 44 | Create Disable User Action | Low | Task 36 |
| 45 | Create Remove User Dialog | Low | Task 36 |
| 46 | Create Pending Invitations List | Medium | Task 31 |
| 47 | Create Resend Invitation Action | Low | Task 46 |
| 48 | Connect Users to API | Medium | Task 47 |

---

## Execution Order

```
Task 31: Users Page
    │
    ├──────────────────────────────────────────────────┐
    ▼                                                  │
Task 32: Users Header                                  │
    │                                                  │
    ▼                                                  │
Task 33: Users Table                                   │
    │                                                  │
    ▼                                                  │
Task 34: Table Columns                                 │
    │                                                  │
    ├──────────┬──────────┐                            │
    ▼          ▼          │                            │
Task 35    Task 36       │                            │
(Status)   (Actions)      │                            │
    │          │          │                            │
    └──────────┘          │                            │
               │          │                            │
               ▼          │                            │
         Task 37: Invite Modal                         │
               │          │                            │
               ▼          │                            │
         Task 38: Invite Schema                        │
               │          │                            │
         ┌─────┴─────┐    │                            │
         ▼           ▼    │                            │
      Task 39    Task 40  │                            │
      (Email)    (Role)   │                            │
         │           │    │                            │
         └─────┬─────┘    │                            │
               ▼          │                            │
         Task 41: Send    │                            │
               │          │                            │
               └──────────┘                            │
                          │                            │
                          ▼                            │
                    Task 42: Edit Modal                │
                          │                            │
                          ▼                            │
                    Task 43: Change Role               │
                          │                            │
                    ┌─────┴─────┐                      │
                    ▼           ▼                      │
              Task 44     Task 45                      │
             (Disable)   (Remove)                      │
                    │           │                      │
                    └─────┬─────┘                      │
                          ▼                            │
                    Task 46: Pending List              │
                          │                            │
                          ▼                            │
                    Task 47: Resend                    │
                          │                            │
                          ▼
                    Task 48: API
```

---

## Expected Deliverables

```
frontend/
├── components/
│   └── modules/
│       └── settings/
│           └── Users/
│               ├── UsersPage.tsx
│               ├── UsersHeader.tsx
│               ├── UsersTable.tsx
│               ├── UserTableColumns.tsx
│               ├── UserStatusBadge.tsx
│               ├── UserActionsCell.tsx
│               ├── InviteUserModal.tsx
│               ├── InviteForm.tsx
│               ├── EmailInput.tsx
│               ├── RoleSelect.tsx
│               ├── EditUserModal.tsx
│               ├── DisableUserAction.tsx
│               ├── RemoveUserDialog.tsx
│               ├── PendingInvitations.tsx
│               └── index.ts
└── lib/
    └── validations/
        └── user-invite.ts
```

---

## Notes for AI Agents

### Users Table Columns (Task 34)
| Column | Width | Sortable |
|--------|-------|----------|
| Name | 200px | Yes |
| Email | 200px | Yes |
| Role | 120px | Yes |
| Status | 100px | Yes |
| Last Login | 140px | Yes |
| Actions | 80px | No |

### User Status Badge (Task 35)
| Status | Color | Description |
|--------|-------|-------------|
| Active | Green | Can access |
| Pending | Yellow | Awaiting acceptance |
| Disabled | Red | Account disabled |

### User Actions (Task 36)
| Action | Icon | Description |
|--------|------|-------------|
| Edit | Pencil | Edit user |
| Disable | Ban | Disable account |
| Remove | Trash | Remove user |

### Invite Form Schema (Task 38)
| Field | Type | Validation |
|-------|------|------------|
| email | string | Required, valid email |
| role_id | uuid | Required |
| message | string | Optional |

### Role Select (Task 40)
| Option | Value |
|--------|-------|
| Admin | admin |
| Manager | manager |
| Cashier | cashier |
| Staff | staff |
| Viewer | viewer |

### Edit User Modal (Task 42)
| Field | Type |
|-------|------|
| Name | Display (readonly) |
| Email | Display (readonly) |
| Role | Select (editable) |
| Status | Toggle |

### User Status Flow
| From | To | Action |
|------|-----|--------|
| Pending | Active | Accept invite |
| Active | Disabled | Disable |
| Disabled | Active | Re-enable |
| Any | Removed | Remove |

### Pending Invitations (Task 46)
| Column | Content |
|--------|---------|
| Email | Invitee email |
| Role | Assigned role |
| Sent | Date sent |
| Expires | Expiry date |
| Actions | Resend, Cancel |
