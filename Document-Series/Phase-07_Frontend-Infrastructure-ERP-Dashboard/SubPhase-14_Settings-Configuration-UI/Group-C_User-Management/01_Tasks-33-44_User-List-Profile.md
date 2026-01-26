# Tasks 33-44: User List & Profile Management

> **Phase:** 07 - Frontend Infrastructure & ERP Dashboard  
> **SubPhase:** 14 - Settings & Configuration UI  
> **Group:** C - User Management  
> **Document:** 01 of 02  
> **Tasks Covered:** 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **→ Next Document:** [02_Tasks-45-48_User-Actions.md](02_Tasks-45-48_User-Actions.md)

---

## Document Overview

This document covers user management including users table with status badges and actions, user invitation system with email and role selection, and user editing capabilities with role changes.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 33 | Create Users Page | Low | 20 min |
| 34 | Create Users Header | Low | 15 min |
| 35 | Create Users Table | Medium | 35 min |
| 36 | Define Users Table Columns | Medium | 25 min |
| 37 | Create User Status Badge | Low | 15 min |
| 38 | Create User Actions Cell | Low | 20 min |
| 39 | Create Invite User Modal | Medium | 30 min |
| 40 | Create Invite Form Schema | Medium | 20 min |
| 41 | Create Email Input | Low | 15 min |
| 42 | Create Role Select | Low | 20 min |
| 43 | Create Send Invitation Action | Medium | 25 min |
| 44 | Create Edit User Modal | Medium | 30 min |

---

## Task 33: Create Users Page

### Overview
Create the main users management page component that serves as the container for user listing, invitations, and management actions.

### Dependencies
- Group A: Users route created

### Instructions

1. **Create component file** at `frontend/components/modules/settings/Users/UsersPage.tsx`
2. **Import dependencies**: UsersHeader, UsersTable, PendingInvitations
3. **Define page structure**: Header, users table, pending invitations section
4. **Fetch users data**: Use server component or client-side fetch
5. **Handle loading states**: Show skeleton during data fetch
6. **Add error handling**: Display error message if fetch fails

### Expected Outcome
Users page component with header, table, and pending invitations sections organized vertically.

### Verification Checklist
- [ ] UsersPage.tsx component created
- [ ] Page structure implemented
- [ ] Data fetching working
- [ ] Loading and error states handled

---

## Task 34: Create Users Header

### Overview
Create the users page header with title, description, and invite user button.

### Dependencies
- Task 33: Users Page created

### Instructions

1. **Create component file** at `frontend/components/modules/settings/Users/UsersHeader.tsx`
2. **Add title**: "User Management"
3. **Add description**: "Manage users and invitations"
4. **Add invite button**: Primary button with "Invite User" text and UserPlus icon
5. **Handle invite click**: Open invite user modal (Task 39)
6. **Make responsive**: Stack title and button on mobile

### Expected Outcome
Header component with title on left and invite button on right, responsive for mobile.

### Verification Checklist
- [ ] UsersHeader.tsx component created
- [ ] Title and description displayed
- [ ] Invite button functional
- [ ] Responsive layout

---

## Task 35: Create Users Table

### Overview
Create the users data table using TanStack Table library to display all users with sortable columns and pagination.

### Dependencies
- Task 34: Users Header created

### Instructions

1. **Create component file** at `frontend/components/modules/settings/Users/UsersTable.tsx`
2. **Import TanStack Table**: useReactTable, getCoreRowModel, getSortedRowModel
3. **Define table structure**: Columns, data, sorting, pagination
4. **Implement table rendering**: Table header, body, rows, cells
5. **Add sorting**: Enable column sorting with sort indicators
6. **Add pagination**: Page controls at bottom
7. **Handle empty state**: Show message when no users

### Expected Outcome
Fully functional data table with sorting, pagination, and proper styling.

### Verification Checklist
- [ ] UsersTable.tsx component created
- [ ] TanStack Table integrated
- [ ] Sorting working
- [ ] Pagination functional

---

## Task 36: Define Users Table Columns

### Overview
Define the column configuration for the users table including name, email, role, status, last login, and actions.

### Dependencies
- Task 35: Users Table created

### Instructions

1. **Create columns file** at `frontend/components/modules/settings/Users/UserTableColumns.tsx`
2. **Define Name column**: Display user full name with avatar, sortable
3. **Define Email column**: Display email address, sortable
4. **Define Role column**: Display user role name, sortable
5. **Define Status column**: Display UserStatusBadge component (Task 37)
6. **Define Last Login column**: Display relative time, sortable
7. **Define Actions column**: Display UserActionsCell component (Task 38)
8. **Configure column widths**: Name (200px), Email (200px), Role (120px), Status (100px), Last Login (140px), Actions (80px)

### Expected Outcome
Column definitions with proper types, rendering functions, and sorting configuration.

### Verification Checklist
- [ ] UserTableColumns.tsx file created
- [ ] All 6 columns defined
- [ ] Sorting configured
- [ ] Widths set appropriately

---

## Task 37: Create User Status Badge

### Overview
Create a status badge component to display user status (Active, Pending, Disabled) with appropriate colors.

### Dependencies
- Task 36: Table columns defined

### Instructions

1. **Create component file** at `frontend/components/modules/settings/Users/UserStatusBadge.tsx`
2. **Define status prop**: Accept "active" | "pending" | "disabled"
3. **Implement color scheme**:
   - Active: Green badge with checkmark
   - Pending: Yellow/Orange badge with clock
   - Disabled: Red badge with ban icon
4. **Use Badge component**: From UI library
5. **Add icon**: Display appropriate icon for each status

### Status Colors
| Status | Background | Text | Icon |
|--------|-----------|------|------|
| Active | bg-green-100 | text-green-700 | CheckCircle |
| Pending | bg-yellow-100 | text-yellow-700 | Clock |
| Disabled | bg-red-100 | text-red-700 | Ban |

### Expected Outcome
Status badge component displaying correct color and icon based on user status.

### Verification Checklist
- [ ] UserStatusBadge.tsx component created
- [ ] All three statuses supported
- [ ] Colors applied correctly
- [ ] Icons displayed

---

## Task 38: Create User Actions Cell

### Overview
Create the actions cell component with dropdown menu for user actions (Edit, Disable, Remove).

### Dependencies
- Task 36: Table columns defined

### Instructions

1. **Create component file** at `frontend/components/modules/settings/Users/UserActionsCell.tsx`
2. **Import dropdown components**: DropdownMenu from UI library
3. **Add trigger button**: Three-dot menu icon (MoreVertical)
4. **Define menu items**:
   - Edit: Opens edit modal
   - Disable/Enable: Toggle user status
   - Remove: Opens confirmation dialog
5. **Handle actions**: Trigger appropriate modals or actions
6. **Conditional items**: Show "Enable" instead of "Disable" for disabled users

### Expected Outcome
Actions dropdown menu with edit, disable/enable, and remove options.

### Verification Checklist
- [ ] UserActionsCell.tsx component created
- [ ] Dropdown menu functional
- [ ] All actions available
- [ ] Conditional items working

---

## Task 39: Create Invite User Modal

### Overview
Create a modal dialog for inviting new users via email with role selection.

### Dependencies
- Task 34: Users Header created (triggers modal)

### Instructions

1. **Create component file** at `frontend/components/modules/settings/Users/InviteUserModal.tsx`
2. **Import dialog components**: Dialog, DialogContent, DialogHeader from UI library
3. **Accept props**: open (boolean), onClose (function)
4. **Include form**: InviteForm component (Task 40)
5. **Handle close**: Close modal on cancel or successful invitation
6. **Add loading state**: Disable form during submission

### Expected Outcome
Modal dialog that opens/closes properly and contains invitation form.

### Verification Checklist
- [ ] InviteUserModal.tsx component created
- [ ] Modal opens and closes correctly
- [ ] Form included
- [ ] Loading state handled

---

## Task 40: Create Invite Form Schema

### Overview
Create Zod validation schema for user invitation form.

### Dependencies
- Task 39: Invite modal created

### Instructions

1. **Create schema file** at `frontend/lib/validations/user-invite.ts`
2. **Import Zod**: `import { z } from 'zod'`
3. **Define schema**:
   - email: Required, valid email format
   - roleId: Required, UUID string
   - message: Optional, personal message
4. **Export schema and type**
5. **Add error messages**: Clear, user-friendly messages

### Expected Outcome
Validation schema for invite form with proper types exported.

### Verification Checklist
- [ ] user-invite.ts schema file created
- [ ] Email validation configured
- [ ] Role ID required
- [ ] Type exported

---

## Task 41: Create Email Input

### Overview
Create email input field component for invitation form.

### Dependencies
- Task 40: Invite form schema created

### Instructions

1. **Create component file** at `frontend/components/modules/settings/Users/EmailInput.tsx`
2. **Import form components**: Input, FormField, FormLabel
3. **Define email input**: Type email, required, placeholder "user@example.com"
4. **Connect to form**: Use React Hook Form control
5. **Display validation errors**: Show error message below input

### Expected Outcome
Email input field with validation and error display.

### Verification Checklist
- [ ] EmailInput.tsx component created
- [ ] Email validation working
- [ ] Errors displayed
- [ ] Connected to form state

---

## Task 42: Create Role Select

### Overview
Create role selection dropdown for invitation form.

### Dependencies
- Task 40: Invite form schema created

### Instructions

1. **Create component file** at `frontend/components/modules/settings/Users/RoleSelect.tsx`
2. **Define role options**: Admin, Manager, Cashier, Staff, Viewer
3. **Create select component**: Use Select from UI library
4. **Display role descriptions**: Show what each role can do
5. **Connect to form**: Use React Hook Form control

### Role Options
| Role | Description |
|------|-------------|
| Admin | Full system access |
| Manager | Manage inventory and staff |
| Cashier | Process sales only |
| Staff | Limited operational access |
| Viewer | Read-only access |

### Expected Outcome
Role dropdown with clear descriptions for each role.

### Verification Checklist
- [ ] RoleSelect.tsx component created
- [ ] All roles listed
- [ ] Descriptions displayed
- [ ] Connected to form

---

## Task 43: Create Send Invitation Action

### Overview
Implement the send invitation action that submits invitation form and sends email to user.

### Dependencies
- Task 41-42: Email and role inputs created

### Instructions

1. **Add to InviteUserModal component**
2. **Create submit handler**: Async function to handle form submission
3. **Validate form data**: Using invite schema
4. **Call API**: POST to `/api/users/invite` with email and roleId
5. **Handle response**:
   - Success: Show toast, close modal, refresh users list
   - Error: Show error toast with message
6. **Add loading state**: Disable submit button during API call

### API Request
```
POST /api/users/invite
{
  "email": "user@example.com",
  "roleId": "role-uuid",
  "message": "Welcome to the team!"
}
```

### Expected Outcome
Invitation sent successfully with email notification to user.

### Verification Checklist
- [ ] Submit handler implemented
- [ ] API integration working
- [ ] Success feedback shown
- [ ] Error handling implemented

---

## Task 44: Create Edit User Modal

### Overview
Create a modal dialog for editing existing user details, primarily for changing roles and status.

### Dependencies
- Task 38: User actions cell created (triggers modal)

### Instructions

1. **Create component file** at `frontend/components/modules/settings/Users/EditUserModal.tsx`
2. **Accept props**: user (User object), open, onClose
3. **Display user info**: Show name and email (read-only)
4. **Add role select**: Allow changing user role
5. **Add status toggle**: Enable/disable user account
6. **Implement save**: PATCH request to update user
7. **Handle response**: Show success/error feedback

### Expected Outcome
Modal for editing user role and status with save functionality.

### Verification Checklist
- [ ] EditUserModal.tsx component created
- [ ] User info displayed
- [ ] Role can be changed
- [ ] Status can be toggled
- [ ] Save functionality working

---

## Summary

This document covered user management list and profile features:

1. Users Page - Main container
2. Users Header - Title and invite button
3. Users Table - Data table with TanStack Table
4. Table Columns - Name, email, role, status, last login, actions
5. Status Badge - Color-coded user status
6. Actions Cell - Dropdown menu
7. Invite Modal - Dialog for invitations
8. Invite Schema - Validation
9. Email Input - Email field
10. Role Select - Role dropdown
11. Send Invitation - API integration
12. Edit User Modal - Edit dialog

### Next Steps

Continue to [02_Tasks-45-48_User-Actions.md](02_Tasks-45-48_User-Actions.md) to complete user management features.

---

**End of Document 01 of 02**
