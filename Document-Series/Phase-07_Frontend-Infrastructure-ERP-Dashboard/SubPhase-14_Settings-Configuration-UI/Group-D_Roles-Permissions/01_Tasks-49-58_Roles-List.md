# Tasks 49-58: Roles List & Form

> **Phase:** 07 - Frontend Infrastructure & ERP Dashboard  
> **SubPhase:** 14 - Settings & Configuration UI  
> **Group:** D - Roles & Permissions  
> **Document:** 01 of 02  
> **Tasks Covered:** 49, 50, 51, 52, 53, 54, 55, 56, 57, 58

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **→ Next Document:** [02_Tasks-59-64_Permissions-Matrix.md](02_Tasks-59-64_Permissions-Matrix.md)

---

## Document Overview

This document covers roles management including roles list with cards, role creation form with name and description, and role display components.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 49 | Create Roles Page | Low | 20 min |
| 50 | Create Roles Header | Low | 15 min |
| 51 | Create Roles List | Medium | 30 min |
| 52 | Create Role Card | Medium | 30 min |
| 53 | Create Role User Count | Low | 15 min |
| 54 | Create Role Actions | Low | 20 min |
| 55 | Create Add Role Modal | Medium | 25 min |
| 56 | Create Role Form Schema | Medium | 20 min |
| 57 | Create Role Name Input | Low | 15 min |
| 58 | Create Role Description Input | Low | 15 min |

---

## Task 49: Create Roles Page

### Overview
Create the main roles management page component displaying all roles as cards with actions.

### Dependencies
- Group A: Roles route created

### Instructions

1. **Create component file** at `frontend/components/modules/settings/Roles/RolesPage.tsx`
2. **Import dependencies**: RolesHeader, RolesList components
3. **Fetch roles data**: GET `/api/roles`
4. **Handle loading**: Show skeleton cards
5. **Handle errors**: Display error message
6. **Organize layout**: Header at top, roles list below

### Expected Outcome
Roles page with header and grid of role cards.

### Verification Checklist
- [ ] RolesPage.tsx component created
- [ ] Data fetching implemented
- [ ] Loading and error states
- [ ] Layout organized

---

## Task 50: Create Roles Header

### Overview
Create roles page header with title and add role button.

### Dependencies
- Task 49: Roles Page created

### Instructions

1. **Create component file** at `frontend/components/modules/settings/Roles/RolesHeader.tsx`
2. **Add title**: "Roles & Permissions"
3. **Add description**: "Manage user roles and permission settings"
4. **Add button**: "Add Role" with Plus icon
5. **Handle click**: Open add role modal

### Expected Outcome
Header with title on left and add button on right.

### Verification Checklist
- [ ] RolesHeader.tsx component created
- [ ] Title and description shown
- [ ] Add button functional
- [ ] Responsive layout

---

## Task 51: Create Roles List

### Overview
Create roles list component displaying roles as grid of cards.

### Dependencies
- Task 50: Roles Header created

### Instructions

1. **Create component file** at `frontend/components/modules/settings/Roles/RolesList.tsx`
2. **Accept roles prop**: Array of Role objects
3. **Implement grid layout**: 2-3 columns responsive
4. **Map roles to cards**: Use RoleCard component (Task 52)
5. **Handle empty state**: Show message when no roles
6. **Add spacing**: Gap between cards

### Grid Layout
| Breakpoint | Columns |
|------------|---------|
| Mobile (<768px) | 1 column |
| Tablet (768-1023px) | 2 columns |
| Desktop (≥1024px) | 3 columns |

### Expected Outcome
Grid of role cards with responsive columns.

### Verification Checklist
- [ ] RolesList.tsx component created
- [ ] Grid layout implemented
- [ ] Cards displayed correctly
- [ ] Responsive behavior

---

## Task 52: Create Role Card

### Overview
Create role card component displaying role information with actions.

### Dependencies
- Task 51: Roles List created

### Instructions

1. **Create component file** at `frontend/components/modules/settings/Roles/RoleCard.tsx`
2. **Accept role prop**: Role object with name, description, userCount, isSystem
3. **Display role name**: As card title
4. **Display description**: Below name
5. **Add system badge**: If role.isSystem is true
6. **Include user count**: Show RoleUserCount component
7. **Add actions**: Show RoleActions component
8. **Apply card styling**: Border, padding, hover effect

### Card Structure
```
┌─────────────────────────────────┐
│ Administrator    [SYSTEM ROLE]  │
│ Full access to all features     │
│                                 │
│ 👥 3 users    [Edit] [Delete]   │
└─────────────────────────────────┘
```

### Expected Outcome
Card displaying role details with user count and actions.

### Verification Checklist
- [ ] RoleCard.tsx component created
- [ ] All role info displayed
- [ ] System badge shown when applicable
- [ ] Actions functional

---

## Task 53: Create Role User Count

### Overview
Create component to display count of users assigned to a role.

### Dependencies
- Task 52: Role Card created

### Instructions

1. **Create component file** at `frontend/components/modules/settings/Roles/RoleUserCount.tsx`
2. **Accept count prop**: Number of users
3. **Display with icon**: Users icon + count
4. **Format text**: "3 users" or "1 user"
5. **Add subtle styling**: Muted color, small text

### Display Format
- 0 users: "No users"
- 1 user: "1 user"
- Multiple: "5 users"

### Expected Outcome
User count displayed with icon and proper pluralization.

### Verification Checklist
- [ ] RoleUserCount.tsx component created
- [ ] Count displayed correctly
- [ ] Icon shown
- [ ] Plural handling

---

## Task 54: Create Role Actions

### Overview
Create role actions component with edit and delete buttons.

### Dependencies
- Task 52: Role Card created

### Instructions

1. **Create component file** at `frontend/components/modules/settings/Roles/RoleActions.tsx`
2. **Accept props**: role object, onEdit, onDelete callbacks
3. **Add Edit button**: Opens edit role page/modal
4. **Add Delete button**: Opens delete dialog (Task 63)
5. **Disable for system roles**: System roles can't be deleted
6. **Add tooltips**: Explain why action is disabled

### Actions Display
| Action | Icon | Condition |
|--------|------|-----------|
| Edit | Pencil | Always available |
| Delete | Trash | Disabled for system roles |

### Expected Outcome
Action buttons for editing and deleting roles with proper permissions.

### Verification Checklist
- [ ] RoleActions.tsx component created
- [ ] Edit button functional
- [ ] Delete button functional
- [ ] System role protection

---

## Task 55: Create Add Role Modal

### Overview
Create modal dialog for adding new roles with name, description, and permissions.

### Dependencies
- Task 50: Roles Header created (triggers modal)

### Instructions

1. **Create component file** at `frontend/components/modules/settings/Roles/AddRoleModal.tsx`
2. **Import dialog components**: Dialog, DialogContent
3. **Include form fields**: RoleNameInput, RoleDescriptionInput
4. **Include permissions**: PermissionMatrix component (Task 59)
5. **Add save button**: Submit form
6. **Handle submission**: POST to `/api/roles`

### Expected Outcome
Modal for creating new roles with permissions.

### Verification Checklist
- [ ] AddRoleModal.tsx component created
- [ ] Form fields included
- [ ] Save functionality working
- [ ] Modal closes on success

---

## Task 56: Create Role Form Schema

### Overview
Create Zod validation schema for role form.

### Dependencies
- Task 55: Add Role Modal created

### Instructions

1. **Create schema file** at `frontend/lib/validations/role.ts`
2. **Define schema**:
   - name: Required, 2-50 chars, unique
   - description: Optional, max 200 chars
   - permissions: Array of permission IDs
3. **Export schema and type**
4. **Add error messages**

### Schema Structure
```typescript
const roleSchema = z.object({
  name: z.string().min(2).max(50),
  description: z.string().max(200).optional(),
  permissions: z.array(z.string().uuid())
});
```

### Expected Outcome
Validation schema for role creation/editing.

### Verification Checklist
- [ ] role.ts schema file created
- [ ] All fields validated
- [ ] Type exported
- [ ] Error messages defined

---

## Task 57: Create Role Name Input

### Overview
Create role name input field component.

### Dependencies
- Task 56: Role Form Schema created

### Instructions

1. **Create component file** at `frontend/components/modules/settings/Roles/RoleNameInput.tsx`
2. **Add input field**: Text input for role name
3. **Add label**: "Role Name *"
4. **Add validation**: Connect to form schema
5. **Add placeholder**: "Enter role name"
6. **Display errors**: Show validation messages

### Expected Outcome
Role name input with validation.

### Verification Checklist
- [ ] RoleNameInput.tsx component created
- [ ] Input functional
- [ ] Validation working
- [ ] Errors displayed

---

## Task 58: Create Role Description Input

### Overview
Create role description textarea component.

### Dependencies
- Task 56: Role Form Schema created

### Instructions

1. **Create component file** at `frontend/components/modules/settings/Roles/RoleDescriptionInput.tsx`
2. **Add textarea**: For role description
3. **Add label**: "Description"
4. **Set max length**: 200 characters
5. **Add character counter**: Show remaining chars
6. **Add placeholder**: "Describe this role..."

### Expected Outcome
Description textarea with character counter.

### Verification Checklist
- [ ] RoleDescriptionInput.tsx component created
- [ ] Textarea functional
- [ ] Character counter working
- [ ] Validation applied

---

## Summary

This document covered roles list and form creation:

1. Roles Page
2. Roles Header
3. Roles List (grid)
4. Role Card
5. Role User Count
6. Role Actions
7. Add Role Modal
8. Role Form Schema
9. Role Name Input
10. Role Description Input

### Next Steps

Continue to [02_Tasks-59-64_Permissions-Matrix.md](02_Tasks-59-64_Permissions-Matrix.md) for permission matrix and role editing.

---

**End of Document 01 of 02**
