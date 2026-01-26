# Tasks 01-07: Settings Routes & Layout Structure

> **Phase:** 07 - Frontend Infrastructure & ERP Dashboard  
> **SubPhase:** 14 - Settings & Configuration UI  
> **Group:** A - Settings Routes & Layout  
> **Document:** 01 of 02  
> **Tasks Covered:** 01, 02, 03, 04, 05, 06, 07

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **→ Next Document:** [02_Tasks-08-14_Layout-Navigation.md](02_Tasks-08-14_Layout-Navigation.md)

---

## Document Overview

This document covers the creation of the settings module route structure with the settings directory, layout component with sidebar navigation, and the initial page routes (general settings, company, users, and roles). It establishes the foundational routing architecture for all settings pages.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 01 | Create Settings Route Directory | Low | 15 min |
| 02 | Create Settings Layout | Medium | 30 min |
| 03 | Create Settings Sidebar | Medium | 30 min |
| 04 | Create General Settings Page Route | Low | 15 min |
| 05 | Create Company Page Route | Low | 15 min |
| 06 | Create Users Page Route | Low | 15 min |
| 07 | Create Roles Page Route | Low | 15 min |

---

## Task 01: Create Settings Route Directory

### Overview
Create the settings route directory within the dashboard route group. This directory will contain all settings-related pages and the shared layout with sidebar navigation. The settings section provides access to general settings, company profile, user management, roles and permissions, integrations, API keys, billing, and audit log.

### Dependencies
- SubPhase-07 (Dashboard Layout) must be complete
- Dashboard route group exists at `frontend/app/(dashboard)/`
- Next.js App Router structure is established

### Instructions

1. **Navigate to dashboard directory**
   - Go to `frontend/app/(dashboard)/` directory
   - This is within the dashboard route group

2. **Create settings directory**
   - Create new directory named `settings`
   - This creates the `/settings` route within the dashboard

3. **Understand directory purpose**
   - Contains all settings-related pages
   - Houses the settings layout with sidebar
   - Organizes nested settings routes

4. **Verify directory structure**
   - Confirm `frontend/app/(dashboard)/settings/` exists
   - Directory is properly nested within dashboard

### Directory Structure
```
frontend/app/
└── (dashboard)/
    ├── layout.tsx              # Dashboard layout
    ├── page.tsx               # Dashboard home
    └── settings/              # ← New settings directory
        └── (pages will be added in subsequent tasks)
```

### URL Mapping

| Directory Path | URL Path |
|----------------|----------|
| `app/(dashboard)/settings/` | `/settings` |
| `app/(dashboard)/settings/company/` | `/settings/company` |
| `app/(dashboard)/settings/users/` | `/settings/users` |

### Expected Outcome
- Settings directory created at correct location
- Foundation for all settings pages established
- Ready for layout and page route creation

### Verification Checklist
- [ ] `frontend/app/(dashboard)/settings/` directory exists
- [ ] Directory is within the dashboard route group
- [ ] No extra files or subdirectories yet created

---

## Task 02: Create Settings Layout

### Overview
Create the settings layout component that wraps all settings pages. This layout provides a consistent structure with a sidebar navigation on the left and content area on the right. The sidebar remains visible across all settings pages, allowing easy navigation between different settings sections.

### Dependencies
- Task 01: Create Settings Route Directory

### Instructions

1. **Create layout.tsx file**
   - Navigate to `frontend/app/(dashboard)/settings/`
   - Create new file named `layout.tsx`
   - This layout applies to all pages in settings directory

2. **Import required dependencies**
   - Import React types (ReactNode)
   - Import SettingsSidebar component (created in Task 03)
   - Import necessary UI components

3. **Define layout metadata**
   - Export metadata object for SEO
   - Set title template: "Settings - LankaCommerce Cloud"
   - Configure description about settings management

4. **Create layout component structure**
   - Define default export function `SettingsLayout`
   - Accept `children` prop of type `ReactNode`
   - Return two-column layout structure

5. **Implement sidebar and content layout**
   - Left column: Fixed width sidebar (256px or 280px)
   - Right column: Flexible content area
   - Responsive design for mobile (sidebar as drawer)

6. **Add proper spacing and styling**
   - Use consistent padding and gaps
   - Ensure proper scrolling behavior
   - Apply background colors for separation

### Layout Structure

```
┌─────────────────────────────────────────────────┐
│           Settings Layout                       │
├──────────────┬──────────────────────────────────┤
│              │                                  │
│  Settings    │                                  │
│  Sidebar     │        Content Area              │
│              │        ({children})              │
│  - General   │                                  │
│  - Company   │                                  │
│  - Users     │                                  │
│  - Roles     │                                  │
│  - Integr.   │                                  │
│  - API Keys  │                                  │
│  - Billing   │                                  │
│  - Audit     │                                  │
│              │                                  │
└──────────────┴──────────────────────────────────┘
```

### Layout Component Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| children | ReactNode | Yes | Page content to render |

### Layout Sections

| Section | Width | Position | Behavior |
|---------|-------|----------|----------|
| Sidebar | Fixed 256px | Left | Sticky positioning |
| Content | Flex-1 | Right | Scrollable |

### Responsive Behavior

| Breakpoint | Sidebar | Content |
|------------|---------|---------|
| Desktop (≥1024px) | Fixed left column | Right column |
| Tablet (768-1023px) | Collapsible drawer | Full width |
| Mobile (<768px) | Mobile drawer (hidden) | Full width |

### Expected Outcome
- Functional settings layout component
- Two-column structure (sidebar + content)
- Responsive design for all screen sizes
- Ready to receive page content

### Verification Checklist
- [ ] `frontend/app/(dashboard)/settings/layout.tsx` exists
- [ ] Layout component exports correctly
- [ ] Children prop properly typed
- [ ] Two-column structure defined
- [ ] Responsive behavior implemented

---

## Task 03: Create Settings Sidebar

### Overview
Create the settings sidebar component that displays navigation links to all settings pages. The sidebar groups settings into logical categories and highlights the active page. It provides quick access to general settings, company profile, user management, roles, integrations, API keys, billing, and audit log.

### Dependencies
- Task 02: Create Settings Layout

### Instructions

1. **Create component file**
   - Navigate to `frontend/components/modules/settings/`
   - Create directory structure if it doesn't exist
   - Create new file `SettingsSidebar.tsx`

2. **Import dependencies**
   - Import Link component from Next.js
   - Import usePathname hook for active state
   - Import icon components (from lucide-react)
   - Import UI components (for styling)

3. **Define navigation structure**
   - Create array of navigation items
   - Each item has: label, href, icon, description (optional)
   - Organize items in logical order

4. **Implement sidebar component**
   - Map through navigation items
   - Render link for each item
   - Apply active state styling based on current path
   - Show icon and label for each link

5. **Add section headers (optional)**
   - Group related items (e.g., "Account", "System")
   - Add visual separation between groups
   - Use subtle typography for headers

6. **Implement active state detection**
   - Use usePathname hook to get current route
   - Match current path with link href
   - Apply distinct styling for active link

7. **Style the sidebar**
   - Consistent padding and spacing
   - Hover effects for links
   - Clear visual hierarchy
   - Accessible color contrast

### Settings Navigation Items

| Label | Route | Icon | Section |
|-------|-------|------|---------|
| General Settings | `/settings` | Settings | Account |
| Company Profile | `/settings/company` | Building2 | Account |
| User Management | `/settings/users` | Users | Account |
| Roles & Permissions | `/settings/roles` | Shield | Account |
| Integrations | `/settings/integrations` | Link2 | System |
| API Keys | `/settings/api-keys` | Key | System |
| Billing & Plans | `/settings/billing` | CreditCard | System |
| Audit Log | `/settings/audit-log` | FileText | System |

### Sidebar Structure

```
Settings
─────────────────
Account
  ◉ General Settings
  ○ Company Profile
  ○ User Management
  ○ Roles & Permissions

System
  ○ Integrations
  ○ API Keys
  ○ Billing & Plans
  ○ Audit Log
```

### Active State Indicators

| State | Visual Indicator |
|-------|-----------------|
| Active | Background color, bold text, primary color |
| Hover | Light background, slight opacity change |
| Default | Normal text, no background |

### Component Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| className | string | No | Additional CSS classes |

### Sidebar Styling Guidelines

| Element | Style |
|---------|-------|
| Container | Fixed width, full height, border-right |
| Section Header | Small text, muted color, spacing |
| Link Item | Padding, rounded corners, flex layout |
| Icon | 20px, consistent spacing |
| Active Link | Primary background, primary text |

### Expected Outcome
- Functional sidebar navigation component
- All settings pages linked correctly
- Active state properly highlighted
- Clean, organized visual hierarchy

### Verification Checklist
- [ ] `SettingsSidebar.tsx` component created
- [ ] All 8 navigation items defined
- [ ] Icons imported and displayed
- [ ] Active state detection working
- [ ] Hover effects implemented
- [ ] Component exported correctly

---

## Task 04: Create General Settings Page Route

### Overview
Create the general settings page route, which serves as the default settings page. This page will contain general application settings like localization (timezone, currency, date format) and notification preferences. It's the landing page when users navigate to `/settings`.

### Dependencies
- Task 01: Create Settings Route Directory
- Task 02: Create Settings Layout

### Instructions

1. **Create page file**
   - Navigate to `frontend/app/(dashboard)/settings/`
   - Create new file named `page.tsx`
   - This becomes the default route for `/settings`

2. **Import dependencies**
   - Import Metadata type from Next.js
   - Import GeneralSettings component (to be created in Group B)
   - Import any necessary utilities

3. **Define page metadata**
   - Export metadata object
   - Set title: "General Settings - LankaCommerce Cloud"
   - Add description about general settings

4. **Create page component**
   - Define default export function `GeneralSettingsPage`
   - Mark as async if data fetching is needed
   - Return GeneralSettings component

5. **Add page structure**
   - Include page header with title and description
   - Add container for proper spacing
   - Ensure responsive layout

6. **Handle loading states**
   - Wrap in Suspense if using React Server Components
   - Display loading skeleton or spinner
   - Provide feedback during data fetching

### Page Structure

```
General Settings Page
─────────────────────────────────────
┌─────────────────────────────────┐
│ General Settings                │
│ Manage your account preferences │
├─────────────────────────────────┤
│                                 │
│  [Localization Settings]        │
│  - Timezone: Asia/Colombo       │
│  - Currency: LKR                │
│  - Date Format: DD/MM/YYYY      │
│                                 │
│  [Notification Settings]        │
│  - Email Notifications          │
│  - Push Notifications           │
│  - Marketing Emails             │
│                                 │
└─────────────────────────────────┘
```

### Page Metadata

| Property | Value |
|----------|-------|
| Title | "General Settings - LankaCommerce Cloud" |
| Description | "Configure general application settings" |
| URL | `/settings` |

### Expected Outcome
- General settings page route created
- Page accessible at `/settings`
- Metadata properly configured
- Ready to display settings content

### Verification Checklist
- [ ] `frontend/app/(dashboard)/settings/page.tsx` created
- [ ] Metadata exported correctly
- [ ] Page component defined and exported
- [ ] Imports are correct
- [ ] Page renders without errors

---

## Task 05: Create Company Page Route

### Overview
Create the company settings page route where administrators can configure company profile information. This includes company name, logo, address, tax information, and contact details. The page is accessible at `/settings/company`.

### Dependencies
- Task 01: Create Settings Route Directory
- Task 02: Create Settings Layout

### Instructions

1. **Create company directory**
   - Navigate to `frontend/app/(dashboard)/settings/`
   - Create new directory named `company`
   - This creates the `/settings/company` route

2. **Create page file**
   - Inside `company/` directory
   - Create new file named `page.tsx`
   - This is the company settings page

3. **Import dependencies**
   - Import Metadata type
   - Import CompanySettings component (to be created in Group B)
   - Import utilities as needed

4. **Define page metadata**
   - Export metadata object
   - Set title: "Company Settings - LankaCommerce Cloud"
   - Add description about company profile configuration

5. **Create page component**
   - Define default export function `CompanySettingsPage`
   - Fetch company data if needed (server component)
   - Return CompanySettings component with data

6. **Add proper structure**
   - Include page header
   - Add breadcrumbs (optional)
   - Ensure proper spacing and layout

### Page Structure

```
Company Settings Page
─────────────────────────────────────
┌─────────────────────────────────┐
│ Company Profile                 │
│ Manage your company information │
├─────────────────────────────────┤
│                                 │
│  [Company Information]          │
│  - Company Name                 │
│  - Company Logo                 │
│                                 │
│  [Business Address]             │
│  - Street Address               │
│  - City, Province, Postal Code  │
│                                 │
│  [Tax Information]              │
│  - Tax ID / VAT Number          │
│  - Tax Registration             │
│                                 │
│  [Contact Details]              │
│  - Phone, Email, Website        │
│                                 │
│  [Save Changes]                 │
│                                 │
└─────────────────────────────────┘
```

### Directory Structure

```
frontend/app/(dashboard)/settings/
├── page.tsx           # General settings
└── company/
    └── page.tsx      # ← Company settings page
```

### Page Metadata

| Property | Value |
|----------|-------|
| Title | "Company Settings - LankaCommerce Cloud" |
| Description | "Configure your company profile and information" |
| URL | `/settings/company` |

### Expected Outcome
- Company settings page route created
- Page accessible at `/settings/company`
- Metadata properly configured
- Ready to display company settings form

### Verification Checklist
- [ ] `frontend/app/(dashboard)/settings/company/` directory created
- [ ] `company/page.tsx` file created
- [ ] Metadata exported correctly
- [ ] Page component defined and exported
- [ ] Page renders without errors

---

## Task 06: Create Users Page Route

### Overview
Create the user management page route where administrators can view, invite, edit, and manage user accounts. This page displays a list of all users with their roles, status, and last login information. Accessible at `/settings/users`.

### Dependencies
- Task 01: Create Settings Route Directory
- Task 02: Create Settings Layout

### Instructions

1. **Create users directory**
   - Navigate to `frontend/app/(dashboard)/settings/`
   - Create new directory named `users`
   - This creates the `/settings/users` route

2. **Create page file**
   - Inside `users/` directory
   - Create new file named `page.tsx`
   - This is the user management page

3. **Import dependencies**
   - Import Metadata type
   - Import UsersPage component (to be created in Group C)
   - Import necessary utilities

4. **Define page metadata**
   - Export metadata object
   - Set title: "User Management - LankaCommerce Cloud"
   - Add description about user management

5. **Create page component**
   - Define default export function `UsersManagementPage`
   - Fetch users data if needed
   - Return UsersPage component

6. **Plan for data fetching**
   - Fetch users list from API
   - Include pagination support
   - Handle loading and error states

### Page Structure

```
User Management Page
─────────────────────────────────────
┌─────────────────────────────────────────┐
│ User Management        [Invite User]    │
│ Manage users and invitations            │
├─────────────────────────────────────────┤
│                                         │
│  ┌─────────────────────────────────┐   │
│  │ Name    Email    Role    Status │   │
│  ├─────────────────────────────────┤   │
│  │ John    j@...    Admin   Active │   │
│  │ Jane    jane@    Manager Active │   │
│  │ Bob     bob@     Staff   Pending│   │
│  └─────────────────────────────────┘   │
│                                         │
│  Pending Invitations                    │
│  ┌─────────────────────────────────┐   │
│  │ Email       Role     Sent        │   │
│  ├─────────────────────────────────┤   │
│  │ new@...     Staff    2 days ago │   │
│  └─────────────────────────────────┘   │
│                                         │
└─────────────────────────────────────────┘
```

### Directory Structure

```
frontend/app/(dashboard)/settings/
├── page.tsx           # General settings
├── company/
│   └── page.tsx      # Company settings
└── users/
    └── page.tsx      # ← User management page
```

### Page Metadata

| Property | Value |
|----------|-------|
| Title | "User Management - LankaCommerce Cloud" |
| Description | "Manage users, invitations, and access control" |
| URL | `/settings/users` |

### Data Requirements

| Data | Source | Purpose |
|------|--------|---------|
| Users List | GET /api/users | Display all users |
| Pending Invitations | GET /api/invitations | Show pending invites |
| Current User | Auth Context | Determine permissions |

### Expected Outcome
- User management page route created
- Page accessible at `/settings/users`
- Metadata properly configured
- Ready to display users table

### Verification Checklist
- [ ] `frontend/app/(dashboard)/settings/users/` directory created
- [ ] `users/page.tsx` file created
- [ ] Metadata exported correctly
- [ ] Page component defined and exported
- [ ] Page renders without errors

---

## Task 07: Create Roles Page Route

### Overview
Create the roles and permissions management page route where administrators can create, edit, and delete user roles with custom permissions. This page displays all roles with their descriptions and assigned user counts. Accessible at `/settings/roles`.

### Dependencies
- Task 01: Create Settings Route Directory
- Task 02: Create Settings Layout

### Instructions

1. **Create roles directory**
   - Navigate to `frontend/app/(dashboard)/settings/`
   - Create new directory named `roles`
   - This creates the `/settings/roles` route

2. **Create page file**
   - Inside `roles/` directory
   - Create new file named `page.tsx`
   - This is the roles management page

3. **Import dependencies**
   - Import Metadata type
   - Import RolesPage component (to be created in Group D)
   - Import utilities as needed

4. **Define page metadata**
   - Export metadata object
   - Set title: "Roles & Permissions - LankaCommerce Cloud"
   - Add description about role management

5. **Create page component**
   - Define default export function `RolesManagementPage`
   - Fetch roles data if needed
   - Return RolesPage component

6. **Plan for nested routes (optional)**
   - Consider `/settings/roles/[id]` for editing
   - Plan for role detail view
   - Structure for permission matrix

### Page Structure

```
Roles & Permissions Page
─────────────────────────────────────
┌─────────────────────────────────────────┐
│ Roles & Permissions    [Add Role]       │
│ Manage roles and permission settings    │
├─────────────────────────────────────────┤
│                                         │
│  ┌──────────────────────────────────┐  │
│  │ Administrator                    │  │
│  │ Full access to all features      │  │
│  │ 3 users    [Edit] [Delete]       │  │
│  │ SYSTEM ROLE                      │  │
│  └──────────────────────────────────┘  │
│                                         │
│  ┌──────────────────────────────────┐  │
│  │ Manager                          │  │
│  │ Manage inventory and staff       │  │
│  │ 5 users    [Edit] [Delete]       │  │
│  └──────────────────────────────────┘  │
│                                         │
│  ┌──────────────────────────────────┐  │
│  │ Cashier                          │  │
│  │ Process sales and transactions   │  │
│  │ 12 users   [Edit] [Delete]       │  │
│  │ SYSTEM ROLE                      │  │
│  └──────────────────────────────────┘  │
│                                         │
└─────────────────────────────────────────┘
```

### Directory Structure

```
frontend/app/(dashboard)/settings/
├── page.tsx           # General settings
├── company/
│   └── page.tsx      # Company settings
├── users/
│   └── page.tsx      # User management
└── roles/
    ├── page.tsx      # ← Roles list page
    └── [id]/         # (Optional: for editing)
        └── page.tsx  # Role edit page
```

### Page Metadata

| Property | Value |
|----------|-------|
| Title | "Roles & Permissions - LankaCommerce Cloud" |
| Description | "Manage user roles and permissions" |
| URL | `/settings/roles` |

### Default System Roles

| Role | Description | Editable |
|------|-------------|----------|
| Administrator | Full system access | No |
| Manager | Inventory and staff management | No |
| Cashier | POS and sales only | No |
| Staff | Limited operational access | No |
| Custom Roles | User-defined roles | Yes |

### Expected Outcome
- Roles management page route created
- Page accessible at `/settings/roles`
- Metadata properly configured
- Ready to display roles list

### Verification Checklist
- [ ] `frontend/app/(dashboard)/settings/roles/` directory created
- [ ] `roles/page.tsx` file created
- [ ] Metadata exported correctly
- [ ] Page component defined and exported
- [ ] Page renders without errors

---

## Summary

This document covered the creation of the settings module foundation including:

1. **Settings Route Directory** - Base directory for all settings pages
2. **Settings Layout** - Two-column layout with sidebar and content
3. **Settings Sidebar** - Navigation component with all settings links
4. **General Settings Route** - Default settings page
5. **Company Settings Route** - Company profile configuration page
6. **Users Management Route** - User listing and management page
7. **Roles Management Route** - Roles and permissions page

### Completed Structure

```
frontend/app/(dashboard)/settings/
├── layout.tsx          # Settings layout with sidebar
├── page.tsx           # General settings
├── company/
│   └── page.tsx      # Company settings
├── users/
│   └── page.tsx      # User management
└── roles/
    └── page.tsx      # Roles management
```

### Next Steps

Continue to [02_Tasks-08-14_Layout-Navigation.md](02_Tasks-08-14_Layout-Navigation.md) to:
- Create remaining page routes (integrations, API keys, billing, audit log)
- Configure page metadata
- Create loading states
- Verify complete route structure

---

**End of Document 01 of 02**
