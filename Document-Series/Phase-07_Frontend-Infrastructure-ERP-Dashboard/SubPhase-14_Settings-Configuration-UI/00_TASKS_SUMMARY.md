# SubPhase 14: Settings & Configuration UI - Tasks Summary

> **Phase:** 07 - Frontend Infrastructure & ERP Dashboard  
> **SubPhase Index:** 14 of 14  
> **SubPhase Goal:** Build settings and configuration interfaces including company profile, user management, roles, integrations, and billing  
> **Total Tasks:** 92 | **Status:** Planning  
> **Estimated Duration:** 10-12 hours

---

## Navigation

- **↑ Parent:** [00_SUBPHASES_SUMMARY.md](../00_SUBPHASES_SUMMARY.md)
- **← Previous SubPhase:** [SubPhase-13_HR-Payroll-UI](../SubPhase-13_HR-Payroll-UI/)
- **→ Next Phase:** [Phase-08_Webstore-Ecommerce-Platform](../../Phase-08_Webstore-Ecommerce-Platform/)

---

## SubPhase Overview

This sub-phase creates the complete Settings & Configuration module UI for the ERP dashboard. It includes general settings, company profile, user management, role permissions, integrations, and billing management.

### Key Outcomes
- General settings page
- Company profile with logo upload
- User management with invitations
- Role permission matrix
- Third-party integrations
- Subscription and billing
- API key management
- Audit log viewer

### Technology Context
- **Data Display:** Tables, forms, permission matrix
- **Forms:** React Hook Form + Zod
- **File Upload:** Logo and document uploads
- **State:** TanStack Query for server state
- **API:** Settings service from SubPhase-04

### Settings Concepts
- **Tenant Settings:** Business-specific configuration
- **User Roles:** Permission-based access control
- **Integrations:** Third-party service connections
- **Billing:** Subscription management

---

## Task Execution Order

```
TASK GROUP A: Settings Routes & Layout (Tasks 01-14)
        │
        ▼
TASK GROUP B: General & Company Settings (Tasks 15-30)
        │
        ▼
TASK GROUP C: User Management (Tasks 31-48)
        │
        ▼
TASK GROUP D: Roles & Permissions (Tasks 49-64)
        │
        ▼
TASK GROUP E: Integrations & API Keys (Tasks 65-78)
        │
        ▼
TASK GROUP F: Billing & Testing (Tasks 79-92)
```

---

## Task Index

### Group A: Settings Routes & Layout (Tasks 01-14)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 01 | **Create Settings Route Directory** | Set up app/(dashboard)/settings/ | SubPhase-07 | 🔴 Not Created |
| 02 | **Create Settings Layout** | Layout with sidebar navigation | Task 01 | 🔴 Not Created |
| 03 | **Create Settings Sidebar** | Navigation for settings sections | Task 02 | 🔴 Not Created |
| 04 | **Create General Settings Page Route** | Create settings/page.tsx | Task 01 | 🔴 Not Created |
| 05 | **Create Company Page Route** | Create settings/company/page.tsx | Task 01 | 🔴 Not Created |
| 06 | **Create Users Page Route** | Create settings/users/page.tsx | Task 01 | 🔴 Not Created |
| 07 | **Create Roles Page Route** | Create settings/roles/page.tsx | Task 01 | 🔴 Not Created |
| 08 | **Create Integrations Page Route** | Create settings/integrations/page.tsx | Task 01 | 🔴 Not Created |
| 09 | **Create API Keys Page Route** | Create settings/api-keys/page.tsx | Task 01 | 🔴 Not Created |
| 10 | **Create Billing Page Route** | Create settings/billing/page.tsx | Task 01 | 🔴 Not Created |
| 11 | **Create Audit Log Page Route** | Create settings/audit-log/page.tsx | Task 01 | 🔴 Not Created |
| 12 | **Configure Page Metadata** | Set up SEO metadata for settings | Task 01 | 🔴 Not Created |
| 13 | **Create Settings Loading States** | Loading.tsx for settings pages | Task 01 | 🔴 Not Created |
| 14 | **Verify Route Structure** | Test all settings routes | Task 13 | 🔴 Not Created |

---

### Group B: General & Company Settings (Tasks 15-30)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 15 | **Create General Settings Page** | Main settings page | Task 14 | 🔴 Not Created |
| 16 | **Create Settings Section Card** | Reusable settings section | Task 15 | 🔴 Not Created |
| 17 | **Create Localization Settings** | Language, timezone, currency | Task 15 | 🔴 Not Created |
| 18 | **Create Timezone Select** | Asia/Colombo default | Task 17 | 🔴 Not Created |
| 19 | **Create Currency Select** | LKR default | Task 17 | 🔴 Not Created |
| 20 | **Create Date Format Select** | Date format preference | Task 17 | 🔴 Not Created |
| 21 | **Create Notification Settings** | Email, push notifications | Task 15 | 🔴 Not Created |
| 22 | **Create Company Settings Page** | Company profile page | Task 14 | 🔴 Not Created |
| 23 | **Create Company Form Schema** | Zod schema for company | Task 22 | 🔴 Not Created |
| 24 | **Create Company Name Input** | Business name input | Task 23 | 🔴 Not Created |
| 25 | **Create Logo Upload** | Company logo uploader | Task 22 | 🔴 Not Created |
| 26 | **Create Logo Preview** | Preview uploaded logo | Task 25 | 🔴 Not Created |
| 27 | **Create Company Address Form** | Business address fields | Task 23 | 🔴 Not Created |
| 28 | **Create Tax Information Section** | TIN, VAT registration | Task 22 | 🔴 Not Created |
| 29 | **Create Contact Information** | Business phone, email | Task 22 | 🔴 Not Created |
| 30 | **Create Save Company Settings** | Submit company changes | Task 29 | 🔴 Not Created |

---

### Group C: User Management (Tasks 31-48)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 31 | **Create Users Page** | User management page | Task 14 | 🔴 Not Created |
| 32 | **Create Users Header** | Header with invite button | Task 31 | 🔴 Not Created |
| 33 | **Create Users Table** | Table of tenant users | Task 31 | 🔴 Not Created |
| 34 | **Define Users Table Columns** | Name, Email, Role, Status, Last Login | Task 33 | 🔴 Not Created |
| 35 | **Create User Status Badge** | Active, Pending, Disabled | Task 34 | 🔴 Not Created |
| 36 | **Create User Actions Cell** | Edit, Disable, Remove | Task 34 | 🔴 Not Created |
| 37 | **Create Invite User Modal** | Modal to invite new user | Task 31 | 🔴 Not Created |
| 38 | **Create Invite Form Schema** | Zod schema for invite | Task 37 | 🔴 Not Created |
| 39 | **Create Email Input** | Invitee email input | Task 38 | 🔴 Not Created |
| 40 | **Create Role Select** | Assign role on invite | Task 38 | 🔴 Not Created |
| 41 | **Create Send Invitation Action** | Send invite email | Task 40 | 🔴 Not Created |
| 42 | **Create Edit User Modal** | Edit user details | Task 33 | 🔴 Not Created |
| 43 | **Create Change Role Action** | Update user role | Task 42 | 🔴 Not Created |
| 44 | **Create Disable User Action** | Disable user account | Task 36 | 🔴 Not Created |
| 45 | **Create Remove User Dialog** | Confirm user removal | Task 36 | 🔴 Not Created |
| 46 | **Create Pending Invitations List** | List pending invites | Task 31 | 🔴 Not Created |
| 47 | **Create Resend Invitation Action** | Resend invite email | Task 46 | 🔴 Not Created |
| 48 | **Connect Users to API** | Use useUsers hook | Task 47 | 🔴 Not Created |

---

### Group D: Roles & Permissions (Tasks 49-64)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 49 | **Create Roles Page** | Role management page | Task 14 | 🔴 Not Created |
| 50 | **Create Roles Header** | Header with add role | Task 49 | 🔴 Not Created |
| 51 | **Create Roles List** | List of available roles | Task 49 | 🔴 Not Created |
| 52 | **Create Role Card** | Single role display | Task 51 | 🔴 Not Created |
| 53 | **Create Role User Count** | Number of users in role | Task 52 | 🔴 Not Created |
| 54 | **Create Role Actions** | Edit, Delete role | Task 52 | 🔴 Not Created |
| 55 | **Create Add Role Modal** | Create new role | Task 49 | 🔴 Not Created |
| 56 | **Create Role Form Schema** | Zod schema for role | Task 55 | 🔴 Not Created |
| 57 | **Create Role Name Input** | Role name input | Task 56 | 🔴 Not Created |
| 58 | **Create Role Description Input** | Role description | Task 56 | 🔴 Not Created |
| 59 | **Create Permission Matrix** | Grid of permissions | Task 55 | 🔴 Not Created |
| 60 | **Create Permission Group** | Group of related permissions | Task 59 | 🔴 Not Created |
| 61 | **Create Permission Checkbox** | Individual permission toggle | Task 60 | 🔴 Not Created |
| 62 | **Create Edit Role Page** | Edit role permissions | Task 49 | 🔴 Not Created |
| 63 | **Create Delete Role Dialog** | Confirm role deletion | Task 54 | 🔴 Not Created |
| 64 | **Connect Roles to API** | Use useRoles hook | Task 63 | 🔴 Not Created |

---

### Group E: Integrations & API Keys (Tasks 65-78)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 65 | **Create Integrations Page** | Third-party integrations | Task 14 | 🔴 Not Created |
| 66 | **Create Integrations Grid** | Grid of integration cards | Task 65 | 🔴 Not Created |
| 67 | **Create Integration Card** | Single integration display | Task 66 | 🔴 Not Created |
| 68 | **Create Integration Status** | Connected/Disconnected | Task 67 | 🔴 Not Created |
| 69 | **Create Connect Integration** | Connect to service | Task 67 | 🔴 Not Created |
| 70 | **Create Integration Settings Modal** | Configure integration | Task 69 | 🔴 Not Created |
| 71 | **Create Disconnect Integration** | Remove connection | Task 67 | 🔴 Not Created |
| 72 | **Create API Keys Page** | API key management | Task 14 | 🔴 Not Created |
| 73 | **Create API Keys Table** | List of API keys | Task 72 | 🔴 Not Created |
| 74 | **Define API Key Columns** | Name, Key (masked), Created, Last Used | Task 73 | 🔴 Not Created |
| 75 | **Create Generate API Key Modal** | Create new API key | Task 72 | 🔴 Not Created |
| 76 | **Create API Key Display** | Show key once on creation | Task 75 | 🔴 Not Created |
| 77 | **Create Revoke API Key Action** | Revoke existing key | Task 73 | 🔴 Not Created |
| 78 | **Connect Integrations to API** | Use useIntegrations hook | Task 77 | 🔴 Not Created |

---

### Group F: Billing & Testing (Tasks 79-92)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 79 | **Create Billing Page** | Subscription management | Task 14 | 🔴 Not Created |
| 80 | **Create Current Plan Card** | Display current subscription | Task 79 | 🔴 Not Created |
| 81 | **Create Plan Features List** | Features of current plan | Task 80 | 🔴 Not Created |
| 82 | **Create Upgrade Plan Button** | Upgrade subscription | Task 80 | 🔴 Not Created |
| 83 | **Create Plan Selection Modal** | Choose new plan | Task 82 | 🔴 Not Created |
| 84 | **Create Billing History Table** | Invoice history | Task 79 | 🔴 Not Created |
| 85 | **Create Download Invoice Action** | Download invoice PDF | Task 84 | 🔴 Not Created |
| 86 | **Create Payment Method Section** | Saved payment methods | Task 79 | 🔴 Not Created |
| 87 | **Create Add Payment Method** | Add new card/method | Task 86 | 🔴 Not Created |
| 88 | **Create Audit Log Page** | System audit trail | Task 14 | 🔴 Not Created |
| 89 | **Create Audit Log Table** | Table of audit events | Task 88 | 🔴 Not Created |
| 90 | **Create Audit Log Filters** | Filter by user, action, date | Task 89 | 🔴 Not Created |
| 91 | **Create Settings Module Documentation** | Document all settings UI | Task 90 | 🔴 Not Created |
| 92 | **Final Verification & Testing** | Test complete settings module | Task 91 | 🔴 Not Created |

---

## Expected Final Structure

```
frontend/
├── app/
│   └── (dashboard)/
│       └── settings/
│           ├── layout.tsx            # Settings layout with sidebar
│           ├── page.tsx              # General settings
│           ├── loading.tsx
│           ├── company/
│           │   └── page.tsx          # Company profile
│           ├── users/
│           │   └── page.tsx          # User management
│           ├── roles/
│           │   └── page.tsx          # Role management
│           ├── integrations/
│           │   └── page.tsx          # Integrations
│           ├── api-keys/
│           │   └── page.tsx          # API keys
│           ├── billing/
│           │   └── page.tsx          # Billing
│           └── audit-log/
│               └── page.tsx          # Audit log
├── components/
│   └── modules/
│       └── settings/
│           ├── Layout/
│           │   ├── SettingsLayout.tsx
│           │   ├── SettingsSidebar.tsx
│           │   └── index.ts
│           ├── General/
│           │   ├── GeneralSettings.tsx
│           │   ├── LocalizationSettings.tsx
│           │   ├── NotificationSettings.tsx
│           │   └── index.ts
│           ├── Company/
│           │   ├── CompanySettings.tsx
│           │   ├── LogoUpload.tsx
│           │   └── index.ts
│           ├── Users/
│           │   ├── UsersList.tsx
│           │   ├── InviteUserModal.tsx
│           │   ├── EditUserModal.tsx
│           │   └── index.ts
│           ├── Roles/
│           │   ├── RolesList.tsx
│           │   ├── RoleForm.tsx
│           │   ├── PermissionMatrix.tsx
│           │   └── index.ts
│           ├── Integrations/
│           │   ├── IntegrationsGrid.tsx
│           │   ├── IntegrationCard.tsx
│           │   └── index.ts
│           ├── APIKeys/
│           │   ├── APIKeysList.tsx
│           │   ├── GenerateKeyModal.tsx
│           │   └── index.ts
│           ├── Billing/
│           │   ├── BillingOverview.tsx
│           │   ├── PlanSelection.tsx
│           │   ├── PaymentMethods.tsx
│           │   └── index.ts
│           ├── AuditLog/
│           │   ├── AuditLogTable.tsx
│           │   └── index.ts
│           └── index.ts
└── lib/
    └── validations/
        ├── company.ts
        ├── user-invite.ts
        └── role.ts
```

---

## Settings Sidebar Navigation

```
┌─────────────────────────┐
│ ⚙️ Settings             │
├─────────────────────────┤
│ 📋 General              │
│ 🏢 Company              │
│ 👥 Users                │
│ 🔐 Roles & Permissions  │
│ 🔗 Integrations         │
│ 🔑 API Keys             │
│ 💳 Billing              │
│ 📜 Audit Log            │
└─────────────────────────┘
```

---

## User Status Flow

```
┌──────────┐    ┌────────┐    ┌──────────┐
│ Invited  │ -> │ Active │ -> │ Disabled │
└──────────┘    └────────┘    └──────────┘
     │                             │
     └──────── Expired ────────────┘
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

1. **Execution Order:** Tasks must be executed in numerical order within each group
2. **Permission Matrix:** Show all permissions grouped by module
3. **Logo Upload:** Support image preview and cropping
4. **API Key Security:** Show key only once on creation
5. **Audit Trail:** Log all sensitive operations
6. **LKR Currency:** Billing in Sri Lankan Rupees
7. **Dependencies:** This sub-phase depends on SubPhase-07
8. **No Code Snippets in Tasks:** Individual task documents should focus on descriptions, not implementation code
9. **Role Based:** Hide settings based on user permissions
10. **Timezone:** Default to Asia/Colombo
11. **Forms:** Use React Hook Form with Zod for all forms
12. **Invitation Flow:** Email-based user invitation
