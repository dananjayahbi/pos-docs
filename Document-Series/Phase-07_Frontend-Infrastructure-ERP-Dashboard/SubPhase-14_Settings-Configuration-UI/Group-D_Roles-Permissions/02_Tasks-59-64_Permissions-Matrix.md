# Tasks 59-64: Permission Matrix & Role Editing

> **Phase:** 07 - Frontend Infrastructure & ERP Dashboard  
> **SubPhase:** 14 - Settings & Configuration UI  
> **Group:** D - Roles & Permissions  
> **Document:** 02 of 02  
> **Tasks Covered:** 59, 60, 61, 62, 63, 64

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [01_Tasks-49-58_Roles-List.md](01_Tasks-49-58_Roles-List.md)
- **→ Next Group:** [Group-E_Integrations-API-Keys](../Group-E_Integrations-API-Keys/)

---

## Document Overview

This document covers permission matrix for selecting granular permissions, role editing page, role deletion, and API integration for roles management.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 59 | Create Permission Matrix | High | 45 min |
| 60 | Create Permission Group | Medium | 30 min |
| 61 | Create Permission Checkbox | Low | 20 min |
| 62 | Create Edit Role Page | Medium | 35 min |
| 63 | Create Delete Role Dialog | Low | 20 min |
| 64 | Connect Roles to API | Medium | 30 min |

---

## Task 59: Create Permission Matrix

### Overview
Create permission matrix component displaying all available permissions grouped by module with checkboxes for selection.

### Dependencies
- Task 55: Add Role Modal created

### Instructions

1. **Create component file** at `frontend/components/modules/settings/Roles/PermissionMatrix.tsx`
2. **Fetch available permissions**: GET `/api/permissions`
3. **Group permissions by module**: Products, Orders, Customers, Reports, etc.
4. **Render permission groups**: Use PermissionGroup component (Task 60)
5. **Handle selection**: Track selected permission IDs
6. **Implement select all**: For each group
7. **Connect to form**: Update form state when permissions change

### Permission Groups
| Module | Permissions |
|--------|-------------|
| Products | View, Create, Edit, Delete |
| Orders | View, Create, Edit, Delete, Refund |
| Customers | View, Create, Edit, Delete |
| Inventory | View, Adjust, Transfer |
| Reports | View, Export |
| Settings | View, Edit |

### Expected Outcome
Matrix of permissions organized by module with checkboxes.

### Verification Checklist
- [ ] PermissionMatrix.tsx component created
- [ ] Permissions fetched and grouped
- [ ] Selection tracking working
- [ ] Form integration complete

---

## Task 60: Create Permission Group

### Overview
Create permission group component displaying permissions for a specific module.

### Dependencies
- Task 59: Permission Matrix created

### Instructions

1. **Create component file** at `frontend/components/modules/settings/Roles/PermissionGroup.tsx`
2. **Accept props**: groupName, permissions array, selectedIds, onChange
3. **Display group header**: Module name with select all checkbox
4. **Render permission checkboxes**: Use PermissionCheckbox component (Task 61)
5. **Implement select all**: Toggle all permissions in group
6. **Add indeterminate state**: When some but not all selected

### Group Structure
```
Products
☑ Select All
  ☑ View Products
  ☑ Create Products
  ☐ Edit Products
  ☐ Delete Products
```

### Expected Outcome
Permission group with header and individual permission checkboxes.

### Verification Checklist
- [ ] PermissionGroup.tsx component created
- [ ] Group header displayed
- [ ] Select all functional
- [ ] Individual checkboxes shown

---

## Task 61: Create Permission Checkbox

### Overview
Create individual permission checkbox component.

### Dependencies
- Task 60: Permission Group created

### Instructions

1. **Create component file** at `frontend/components/modules/settings/Roles/PermissionCheckbox.tsx`
2. **Accept props**: permission object, checked, onChange
3. **Display checkbox**: With label from permission.name
4. **Add description**: Show permission.description on hover (tooltip)
5. **Handle change**: Call onChange with permission ID
6. **Apply styling**: Proper spacing and alignment

### Expected Outcome
Checkbox for individual permission with label and description.

### Verification Checklist
- [ ] PermissionCheckbox.tsx component created
- [ ] Checkbox functional
- [ ] Label displayed
- [ ] Tooltip working

---

## Task 62: Create Edit Role Page

### Overview
Create edit role page for modifying existing role details and permissions.

### Dependencies
- Tasks 59-61: Permission matrix components created

### Instructions

1. **Create page file** at `frontend/app/(dashboard)/settings/roles/[id]/page.tsx`
2. **Fetch role data**: GET `/api/roles/{roleId}`
3. **Pre-fill form**: Load role name, description, permissions
4. **Use same components**: RoleNameInput, RoleDescriptionInput, PermissionMatrix
5. **Implement save**: PATCH `/api/roles/{roleId}`
6. **Prevent system role edit**: Disable for system roles except permissions
7. **Add breadcrumbs**: Settings > Roles > Edit Role

### Expected Outcome
Page for editing existing roles with all form fields pre-filled.

### Verification Checklist
- [ ] Edit role page created
- [ ] Role data loaded correctly
- [ ] Form pre-filled
- [ ] Save functionality working
- [ ] System role protection

---

## Task 63: Create Delete Role Dialog

### Overview
Create confirmation dialog for deleting roles with warnings and validations.

### Dependencies
- Task 54: Role Actions created

### Instructions

1. **Create component file** at `frontend/components/modules/settings/Roles/DeleteRoleDialog.tsx`
2. **Accept props**: role, open, onClose, onConfirm
3. **Check system role**: Prevent deleting system roles
4. **Check user assignments**: Warn if users have this role
5. **Display confirmation**: Require typing role name to confirm
6. **Implement delete**: DELETE `/api/roles/{roleId}`
7. **Handle reassignment**: Suggest reassigning users first

### Dialog Structure
```
Delete Role
─────────────────────────────────────
⚠️ Warning: 5 users are assigned to this role.

Please reassign these users before deleting.

[View Users]  [Cancel]
```

### Expected Outcome
Confirmation dialog preventing accidental role deletion.

### Verification Checklist
- [ ] DeleteRoleDialog.tsx component created
- [ ] System role protection
- [ ] User assignment check
- [ ] Confirmation required
- [ ] API integration working

---

## Task 64: Connect Roles to API

### Overview
Integrate all roles components with backend API endpoints for CRUD operations.

### Dependencies
- All previous tasks in Group D

### Instructions

1. **Create API service** at `frontend/lib/api/roles.ts`
2. **Implement endpoints**:
   - GET `/api/roles` - List all roles
   - GET `/api/roles/{id}` - Get single role
   - POST `/api/roles` - Create role
   - PATCH `/api/roles/{id}` - Update role
   - DELETE `/api/roles/{id}` - Delete role
   - GET `/api/permissions` - List permissions
3. **Add error handling**: Catch and display API errors
4. **Implement caching**: Use SWR or React Query
5. **Add optimistic updates**: Update UI before API confirmation
6. **Handle loading states**: Show spinners during API calls

### API Endpoints Summary
| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | /api/roles | List roles |
| GET | /api/roles/{id} | Get role |
| POST | /api/roles | Create role |
| PATCH | /api/roles/{id} | Update role |
| DELETE | /api/roles/{id} | Delete role |
| GET | /api/permissions | List permissions |

### Expected Outcome
All roles features connected to backend with proper error handling.

### Verification Checklist
- [ ] API service created
- [ ] All endpoints implemented
- [ ] Error handling added
- [ ] Loading states working
- [ ] Caching configured

---

## Summary

This document completed roles and permissions features:

1. **Permission Matrix** - Grid of all permissions
2. **Permission Group** - Module-grouped permissions
3. **Permission Checkbox** - Individual permission toggle
4. **Edit Role Page** - Role editing interface
5. **Delete Role Dialog** - Confirmation with safeguards
6. **API Integration** - Complete backend connection

### Complete Roles Management Structure

```
Roles & Permissions (Group D Complete)
├── Roles Page ✓
├── Roles Header ✓
├── Roles List ✓
│   ├── Role Card ✓
│   ├── Role User Count ✓
│   └── Role Actions ✓
├── Add Role ✓
│   ├── Add Role Modal ✓
│   ├── Role Form Schema ✓
│   ├── Role Name Input ✓
│   └── Role Description Input ✓
├── Permissions ✓
│   ├── Permission Matrix ✓
│   ├── Permission Group ✓
│   └── Permission Checkbox ✓
├── Edit Role Page ✓
├── Delete Role Dialog ✓
└── API Integration ✓
```

### Next Steps

Continue to [Group-E_Integrations-API-Keys](../Group-E_Integrations-API-Keys/) to build:
- Integrations management with cards
- Integration connection flow
- API keys management
- Key generation and revocation

---

**End of Document 02 of 02 - Group D Complete**
