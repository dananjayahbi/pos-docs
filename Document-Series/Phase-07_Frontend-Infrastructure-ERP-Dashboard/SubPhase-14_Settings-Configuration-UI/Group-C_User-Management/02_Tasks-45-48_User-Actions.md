# Tasks 45-48: User Actions & API Integration

> **Phase:** 07 - Frontend Infrastructure & ERP Dashboard  
> **SubPhase:** 14 - Settings & Configuration UI  
> **Group:** C - User Management  
> **Document:** 02 of 02  
> **Tasks Covered:** 45, 46, 47, 48

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [01_Tasks-33-44_User-List-Profile.md](01_Tasks-33-44_User-List-Profile.md)
- **→ Next Group:** [Group-D_Roles-Permissions](../Group-D_Roles-Permissions/)

---

## Document Overview

This document covers user account actions (disable, remove), pending invitations management with resend capability, and API integration for user management functionality.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 45 | Create Change Role Action | Medium | 25 min |
| 46 | Create Disable User Action | Low | 20 min |
| 47 | Create Remove User Dialog | Low | 20 min |
| 48 | Create Pending Invitations List | Medium | 30 min |

---

## Task 45: Create Change Role Action

### Overview
Implement the change role action within the edit user modal to allow administrators to update user roles.

### Dependencies
- Task 44: Edit User Modal created

### Instructions

1. **Add to EditUserModal component**
2. **Create change role handler**: Function to handle role selection change
3. **Update form state**: Store new role selection
4. **Implement save action**: 
   - API call: `PATCH /api/users/{userId}` with new roleId
   - Handle loading state
   - Show success/error feedback
5. **Update user list**: Refresh after successful change
6. **Add confirmation**: Optional confirmation for role changes

### API Request
```
PATCH /api/users/{userId}
{
  "roleId": "new-role-uuid"
}
```

### Expected Outcome
Users can have their roles changed with immediate effect after save.

### Verification Checklist
- [ ] Change role handler implemented
- [ ] API integration working
- [ ] Success feedback displayed
- [ ] User list refreshed

---

## Task 46: Create Disable User Action

### Overview
Create the disable/enable user action to deactivate or reactivate user accounts without deleting them.

### Dependencies
- Task 38: User Actions Cell created

### Instructions

1. **Create component file** at `frontend/components/modules/settings/Users/DisableUserAction.tsx`
2. **Accept user prop**: User object with status
3. **Determine action**: Show "Disable" for active users, "Enable" for disabled
4. **Add confirmation dialog**: Confirm before disabling
5. **Implement API call**: 
   - `PATCH /api/users/{userId}/status`
   - Set status to "disabled" or "active"
6. **Handle response**: Show toast, update user list
7. **Update UI**: Change button text based on status

### Disable vs Enable
| Current Status | Action | New Status | Button Text |
|---------------|--------|------------|-------------|
| Active | Disable | Disabled | "Disable User" |
| Disabled | Enable | Active | "Enable User" |

### Confirmation Message
**Disable:** "Are you sure you want to disable this user? They will not be able to access the system."
**Enable:** "Are you sure you want to enable this user? They will regain access."

### Expected Outcome
Users can be disabled (lose access) or enabled (regain access) with confirmation.

### Verification Checklist
- [ ] DisableUserAction.tsx component created
- [ ] Confirmation dialog shown
- [ ] API integration working
- [ ] Status updates correctly

---

## Task 47: Create Remove User Dialog

### Overview
Create a confirmation dialog for permanently removing users from the system with warning about data implications.

### Dependencies
- Task 38: User Actions Cell created

### Instructions

1. **Create component file** at `frontend/components/modules/settings/Users/RemoveUserDialog.tsx`
2. **Import AlertDialog components**: AlertDialog, AlertDialogContent, etc.
3. **Accept props**: user (User object), open, onClose, onConfirm
4. **Display warning message**: Explain that this action is permanent
5. **List implications**: What data will be affected
6. **Add confirmation input**: Type "DELETE" or user email to confirm
7. **Implement remove action**:
   - API call: `DELETE /api/users/{userId}`
   - Show loading state
   - Handle success/error
8. **Close dialog**: After successful removal or cancel

### Dialog Structure
```
Remove User
─────────────────────────────────────
Are you sure you want to remove user@example.com?

⚠️ Warning: This action cannot be undone.

Implications:
• User will lose all access
• User data will be archived
• Historical records will be preserved

Type "DELETE" to confirm:
[________________]

[Cancel]  [Remove User]
```

### Expected Outcome
Users can be permanently removed with explicit confirmation to prevent accidents.

### Verification Checklist
- [ ] RemoveUserDialog.tsx component created
- [ ] Warning message displayed
- [ ] Confirmation input required
- [ ] API integration working
- [ ] Success feedback shown

---

## Task 48: Create Pending Invitations List

### Overview
Create a component to display pending user invitations with ability to resend or cancel them.

### Dependencies
- Task 33: Users Page created

### Instructions

1. **Create component file** at `frontend/components/modules/settings/Users/PendingInvitations.tsx`
2. **Fetch pending invitations**: GET `/api/users/invitations/pending`
3. **Display as table or list**: Email, Role, Sent date, Expires date, Actions
4. **Add Resend action**: 
   - API: `POST /api/users/invitations/{inviteId}/resend`
   - Show success toast
   - Update sent date
5. **Add Cancel action**:
   - API: `DELETE /api/users/invitations/{inviteId}`
   - Remove from list
   - Show confirmation
6. **Show expiry warning**: Highlight invitations expiring soon (< 2 days)
7. **Handle empty state**: Show message when no pending invitations

### Table Structure
```
Pending Invitations
─────────────────────────────────────
┌─────────────────────────────────────────────────────┐
│ Email         Role     Sent       Expires   Actions │
├─────────────────────────────────────────────────────┤
│ new@...       Staff    2 days ago 5 days   [⟳] [✕] │
│ invite@...    Manager  5 days ago Expires! [⟳] [✕] │
└─────────────────────────────────────────────────────┘
```

### Invitation States
| State | Display | Action |
|-------|---------|--------|
| Normal | Green text | Resend, Cancel |
| Expiring Soon | Yellow text | Resend, Cancel |
| Expired | Red text | Resend (new), Delete |

### Actions
| Action | Icon | API Endpoint |
|--------|------|-------------|
| Resend | RotateCw | POST /invitations/{id}/resend |
| Cancel | X | DELETE /invitations/{id} |

### Expected Outcome
Pending invitations displayed with options to resend or cancel.

### Verification Checklist
- [ ] PendingInvitations.tsx component created
- [ ] Invitations fetched and displayed
- [ ] Resend action working
- [ ] Cancel action working
- [ ] Expiry warnings shown

---

## Summary

This document completed user management features:

1. **Change Role Action** - Update user roles
2. **Disable User Action** - Deactivate/reactivate accounts
3. **Remove User Dialog** - Permanent user removal with confirmation
4. **Pending Invitations** - List with resend and cancel actions

### Complete User Management Structure

```
User Management (Group C Complete)
├── Users Page ✓
├── Users Header ✓
├── Users Table ✓
│   ├── Table Columns ✓
│   ├── Status Badge ✓
│   └── Actions Cell ✓
├── Invite User ✓
│   ├── Invite Modal ✓
│   ├── Invite Schema ✓
│   ├── Email Input ✓
│   ├── Role Select ✓
│   └── Send Invitation ✓
├── Edit User ✓
│   ├── Edit Modal ✓
│   └── Change Role ✓
├── User Actions ✓
│   ├── Disable User ✓
│   └── Remove User ✓
└── Pending Invitations ✓
```

### API Endpoints Used

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | /api/users | List all users |
| POST | /api/users/invite | Send invitation |
| GET | /api/users/invitations/pending | List pending invites |
| POST | /api/users/invitations/{id}/resend | Resend invitation |
| DELETE | /api/users/invitations/{id} | Cancel invitation |
| PATCH | /api/users/{id} | Update user |
| PATCH | /api/users/{id}/status | Change status |
| DELETE | /api/users/{id} | Remove user |

### Next Steps

Continue to [Group-D_Roles-Permissions](../Group-D_Roles-Permissions/) to build:
- Roles listing with cards
- Role creation and editing
- Permission matrix
- Role CRUD operations

---

**End of Document 02 of 02 - Group C Complete**
