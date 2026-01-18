# SubPhase 07: Dashboard Layout - Tasks Summary

> **Phase:** 07 - Frontend Infrastructure & ERP Dashboard  
> **SubPhase Index:** 07 of 14  
> **SubPhase Goal:** Create the main ERP dashboard layout with sidebar navigation, header, breadcrumbs, and responsive design  
> **Total Tasks:** 94 | **Status:** Planning  
> **Estimated Duration:** 10-12 hours

---

## Navigation

- **↑ Parent:** [00_SUBPHASES_SUMMARY.md](../00_SUBPHASES_SUMMARY.md)
- **← Previous SubPhase:** [SubPhase-06_Authentication-UI](../SubPhase-06_Authentication-UI/)
- **→ Next SubPhase:** [SubPhase-08_Product-Management-UI](../SubPhase-08_Product-Management-UI/)

---

## SubPhase Overview

This sub-phase creates the main dashboard layout that wraps all ERP module pages. It includes a collapsible sidebar with navigation, a header with user menu and notifications, breadcrumb navigation, and responsive design for tablet and desktop screens.

### Key Outcomes
- Main dashboard layout component
- Collapsible sidebar with module navigation
- Header with search, notifications, user menu
- Breadcrumb navigation system
- Mobile/tablet responsive behavior
- Role-based menu visibility
- Keyboard navigation support
- Quick search/command palette integration

### Technology Context
- **Layout:** Next.js App Router layout.tsx
- **State:** Zustand for sidebar state
- **Icons:** Lucide React
- **Animation:** CSS transitions, Framer Motion (optional)
- **Responsive:** Tailwind CSS breakpoints

### Layout Structure
```
┌─────────────────────────────────────────────────────────────┐
│ HEADER (64px)                                               │
│ [≡] [Logo] [Search]              [Notifications] [User] ▼   │
├─────────────┬───────────────────────────────────────────────┤
│ SIDEBAR     │ MAIN CONTENT                                  │
│ (240px)     │ ┌───────────────────────────────────────────┐ │
│             │ │ Breadcrumb: Dashboard > Products          │ │
│ Dashboard   │ ├───────────────────────────────────────────┤ │
│ Products ▼  │ │                                           │ │
│  - List     │ │     Page Content                          │ │
│  - Create   │ │                                           │ │
│ Inventory   │ │                                           │ │
│ Sales       │ │                                           │ │
│ Customers   │ │                                           │ │
│ HR          │ │                                           │ │
│ Settings    │ └───────────────────────────────────────────┘ │
└─────────────┴───────────────────────────────────────────────┘
```

---

## Task Execution Order

```
TASK GROUP A: Dashboard Route Group & Layout (Tasks 01-14)
        │
        ▼
TASK GROUP B: Sidebar Component (Tasks 15-32)
        │
        ▼
TASK GROUP C: Header Component (Tasks 33-50)
        │
        ▼
TASK GROUP D: Navigation & Breadcrumbs (Tasks 51-66)
        │
        ▼
TASK GROUP E: Responsive Design & Mobile (Tasks 67-82)
        │
        ▼
TASK GROUP F: Dashboard Home Page (Tasks 83-94)
```

---

## Task Index

### Group A: Dashboard Route Group & Layout (Tasks 01-14)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 01 | **Create (dashboard) Route Group** | Set up app/(dashboard)/ directory structure | SubPhase-06 | 🔴 Not Created |
| 02 | **Create Dashboard Layout Component** | Create layout.tsx with sidebar and header slots | Task 01 | 🔴 Not Created |
| 03 | **Define Layout Grid Structure** | CSS grid for sidebar, header, content areas | Task 02 | 🔴 Not Created |
| 04 | **Create Main Content Container** | Scrollable content area with padding | Task 02 | 🔴 Not Created |
| 05 | **Add Layout State Provider** | Wrap layout with UI store context | Task 02 | 🔴 Not Created |
| 06 | **Create Layout Loading State** | Skeleton loading for initial render | Task 02 | 🔴 Not Created |
| 07 | **Create Layout Error Boundary** | Error boundary for dashboard pages | Task 02 | 🔴 Not Created |
| 08 | **Configure Layout Metadata** | Default metadata for dashboard pages | Task 02 | 🔴 Not Created |
| 09 | **Add Auth Guard to Layout** | Protect dashboard with ProtectedRoute | Task 02 | 🔴 Not Created |
| 10 | **Create Layout Transition Animation** | Page transition animations | Task 02 | 🔴 Not Created |
| 11 | **Define Layout CSS Variables** | CSS vars for sidebar width, header height | Task 03 | 🔴 Not Created |
| 12 | **Create Layout Hooks** | Custom hooks for layout dimensions | Task 11 | 🔴 Not Created |
| 13 | **Add Skip Navigation Link** | Accessibility skip to main content link | Task 02 | 🔴 Not Created |
| 14 | **Verify Layout Structure** | Test layout renders with placeholder content | Task 13 | 🔴 Not Created |

---

### Group B: Sidebar Component (Tasks 15-32)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 15 | **Create Sidebar Component** | Main sidebar container component | Task 14 | 🔴 Not Created |
| 16 | **Create Sidebar Header** | Logo and collapse toggle button | Task 15 | 🔴 Not Created |
| 17 | **Create Logo Component** | LCC logo with collapsed/expanded variants | Task 16 | 🔴 Not Created |
| 18 | **Create Collapse Toggle Button** | Button to toggle sidebar collapsed state | Task 16 | 🔴 Not Created |
| 19 | **Connect Sidebar to UI Store** | Use Zustand for sidebar state | Task 18 | 🔴 Not Created |
| 20 | **Create Sidebar Navigation** | Navigation menu container | Task 15 | 🔴 Not Created |
| 21 | **Define Navigation Menu Items** | Array of menu items with icons, labels, paths | Task 20 | 🔴 Not Created |
| 22 | **Create NavItem Component** | Single navigation item with icon and label | Task 21 | 🔴 Not Created |
| 23 | **Create NavGroup Component** | Collapsible group of navigation items | Task 22 | 🔴 Not Created |
| 24 | **Create SubNavItem Component** | Nested navigation item for sub-menus | Task 23 | 🔴 Not Created |
| 25 | **Implement Active State Styling** | Highlight active route in navigation | Task 22 | 🔴 Not Created |
| 26 | **Add Navigation Icons** | Import and assign Lucide icons to menu items | Task 22 | 🔴 Not Created |
| 27 | **Implement Collapsed State** | Sidebar with icons only when collapsed | Task 19 | 🔴 Not Created |
| 28 | **Add Collapsed Tooltip** | Tooltip with label when sidebar collapsed | Task 27 | 🔴 Not Created |
| 29 | **Create Sidebar Footer** | User info and logout at sidebar bottom | Task 15 | 🔴 Not Created |
| 30 | **Add Permission-Based Visibility** | Hide menu items based on user permissions | Task 21 | 🔴 Not Created |
| 31 | **Add Sidebar Resize Animation** | Smooth transition on collapse/expand | Task 27 | 🔴 Not Created |
| 32 | **Create Sidebar Keyboard Navigation** | Arrow keys for menu navigation | Task 20 | 🔴 Not Created |

---

### Group C: Header Component (Tasks 33-50)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 33 | **Create Header Component** | Main header container component | Task 14 | 🔴 Not Created |
| 34 | **Create Mobile Menu Toggle** | Hamburger button for mobile sidebar | Task 33 | 🔴 Not Created |
| 35 | **Create Header Logo (Mobile)** | Logo shown on mobile when sidebar hidden | Task 33 | 🔴 Not Created |
| 36 | **Create Global Search Input** | Search input with keyboard shortcut hint | Task 33 | 🔴 Not Created |
| 37 | **Implement Search Functionality** | Connect search to command palette | Task 36 | 🔴 Not Created |
| 38 | **Create Notifications Bell** | Notification icon with unread count badge | Task 33 | 🔴 Not Created |
| 39 | **Create Notifications Dropdown** | Dropdown with recent notifications list | Task 38 | 🔴 Not Created |
| 40 | **Create Notification Item** | Single notification with icon, message, time | Task 39 | 🔴 Not Created |
| 41 | **Mark Notifications as Read** | Action to mark notifications as read | Task 40 | 🔴 Not Created |
| 42 | **Create User Menu Dropdown** | Dropdown with user avatar and menu | Task 33 | 🔴 Not Created |
| 43 | **Create User Avatar Component** | User avatar with fallback initials | Task 42 | 🔴 Not Created |
| 44 | **Add User Profile Link** | Link to user profile/settings | Task 42 | 🔴 Not Created |
| 45 | **Add Tenant Switcher** | Dropdown to switch between tenants | Task 42 | 🔴 Not Created |
| 46 | **Add Theme Toggle** | Toggle between light/dark theme | Task 42 | 🔴 Not Created |
| 47 | **Add Logout Button** | Button to log out current user | Task 42 | 🔴 Not Created |
| 48 | **Create Help Button** | Button to open help/documentation | Task 33 | 🔴 Not Created |
| 49 | **Create Quick Actions Button** | Button for quick actions (+ New) | Task 33 | 🔴 Not Created |
| 50 | **Test Header Component** | Verify all header elements work | Task 49 | 🔴 Not Created |

---

### Group D: Navigation & Breadcrumbs (Tasks 51-66)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 51 | **Create Breadcrumb Component** | Breadcrumb navigation component | Task 14 | 🔴 Not Created |
| 52 | **Create BreadcrumbItem Component** | Single breadcrumb item with link | Task 51 | 🔴 Not Created |
| 53 | **Create BreadcrumbSeparator** | Separator between breadcrumb items | Task 51 | 🔴 Not Created |
| 54 | **Create useBreadcrumbs Hook** | Hook to generate breadcrumbs from route | Task 51 | 🔴 Not Created |
| 55 | **Define Route-to-Breadcrumb Mapping** | Map routes to breadcrumb labels | Task 54 | 🔴 Not Created |
| 56 | **Handle Dynamic Route Segments** | Display dynamic segment values (e.g., product name) | Task 55 | 🔴 Not Created |
| 57 | **Add Breadcrumb to Page Container** | Include breadcrumb in page layout | Task 56 | 🔴 Not Created |
| 58 | **Create Page Header Component** | Page title with actions slot | Task 57 | 🔴 Not Created |
| 59 | **Create Page Title Component** | H1 title with optional subtitle | Task 58 | 🔴 Not Created |
| 60 | **Create Page Actions Slot** | Area for primary page actions | Task 58 | 🔴 Not Created |
| 61 | **Create Back Button Component** | Button to navigate back | Task 58 | 🔴 Not Created |
| 62 | **Create Tab Navigation Component** | Horizontal tabs for sub-pages | Task 58 | 🔴 Not Created |
| 63 | **Create Page Section Component** | Section wrapper with title | Task 58 | 🔴 Not Created |
| 64 | **Create Keyboard Shortcuts** | Define global keyboard shortcuts | Task 33 | 🔴 Not Created |
| 65 | **Create Shortcuts Help Modal** | Modal showing all keyboard shortcuts | Task 64 | 🔴 Not Created |
| 66 | **Test Navigation Components** | Verify breadcrumbs and navigation work | Task 65 | 🔴 Not Created |

---

### Group E: Responsive Design & Mobile (Tasks 67-82)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 67 | **Define Responsive Breakpoints** | Configure lg (1024px) as mobile/desktop threshold | Task 03 | 🔴 Not Created |
| 68 | **Create Mobile Sidebar Drawer** | Sidebar as slide-out drawer on mobile | Task 15 | 🔴 Not Created |
| 69 | **Create Sidebar Overlay** | Overlay background when mobile sidebar open | Task 68 | 🔴 Not Created |
| 70 | **Implement Sidebar Swipe Gesture** | Swipe to open/close on mobile | Task 68 | 🔴 Not Created |
| 71 | **Hide Sidebar on Mobile** | Auto-hide sidebar on screens < 1024px | Task 68 | 🔴 Not Created |
| 72 | **Show Mobile Header Toggle** | Show hamburger on mobile only | Task 34 | 🔴 Not Created |
| 73 | **Create Responsive Header** | Adjust header layout for mobile | Task 33 | 🔴 Not Created |
| 74 | **Hide Search on Small Screens** | Show search icon instead on mobile | Task 36 | 🔴 Not Created |
| 75 | **Adjust Content Padding** | Reduce padding on mobile screens | Task 04 | 🔴 Not Created |
| 76 | **Create Mobile Bottom Navigation** | Optional bottom nav for key actions | Task 71 | 🔴 Not Created |
| 77 | **Test Tablet Layout (768-1024px)** | Verify layout on tablet screens | Task 75 | 🔴 Not Created |
| 78 | **Test Desktop Layout (1024px+)** | Verify layout on desktop screens | Task 77 | 🔴 Not Created |
| 79 | **Test Large Desktop (1440px+)** | Verify layout on wide screens | Task 78 | 🔴 Not Created |
| 80 | **Create Print Styles** | Hide sidebar/header for printing | Task 03 | 🔴 Not Created |
| 81 | **Test Touch Interactions** | Verify touch-friendly on mobile | Task 70 | 🔴 Not Created |
| 82 | **Document Responsive Behavior** | Document breakpoint behaviors | Task 81 | 🔴 Not Created |

---

### Group F: Dashboard Home Page (Tasks 83-94)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 83 | **Create Dashboard Home Page** | Create app/(dashboard)/page.tsx | Task 14 | 🔴 Not Created |
| 84 | **Create Welcome Banner** | Personalized welcome message | Task 83 | 🔴 Not Created |
| 85 | **Create KPI Summary Cards** | Cards showing key business metrics | Task 83 | 🔴 Not Created |
| 86 | **Create Sales KPI Card** | Today's sales amount and trend | Task 85 | 🔴 Not Created |
| 87 | **Create Orders KPI Card** | Today's orders count and trend | Task 85 | 🔴 Not Created |
| 88 | **Create Low Stock Alert Card** | Count of low stock items | Task 85 | 🔴 Not Created |
| 89 | **Create Pending Tasks Card** | Count of pending approvals/tasks | Task 85 | 🔴 Not Created |
| 90 | **Create Quick Actions Grid** | Grid of quick action buttons | Task 83 | 🔴 Not Created |
| 91 | **Create Recent Activity Feed** | List of recent business activities | Task 83 | 🔴 Not Created |
| 92 | **Create Sales Chart Widget** | Line/bar chart of recent sales | Task 83 | 🔴 Not Created |
| 93 | **Connect Dashboard to API** | Fetch real data for dashboard widgets | Task 92 | 🔴 Not Created |
| 94 | **Final Verification & Testing** | Test complete dashboard layout | Task 93 | 🔴 Not Created |

---

## Expected Final Structure

```
frontend/
├── app/
│   └── (dashboard)/
│       ├── layout.tsx            # Dashboard layout
│       ├── page.tsx              # Dashboard home
│       ├── loading.tsx           # Dashboard loading
│       └── error.tsx             # Dashboard error
├── components/
│   └── layout/
│       ├── DashboardLayout.tsx
│       ├── Sidebar/
│       │   ├── Sidebar.tsx
│       │   ├── SidebarHeader.tsx
│       │   ├── SidebarNav.tsx
│       │   ├── NavItem.tsx
│       │   ├── NavGroup.tsx
│       │   ├── SubNavItem.tsx
│       │   ├── SidebarFooter.tsx
│       │   └── index.ts
│       ├── Header/
│       │   ├── Header.tsx
│       │   ├── GlobalSearch.tsx
│       │   ├── NotificationBell.tsx
│       │   ├── NotificationDropdown.tsx
│       │   ├── UserMenu.tsx
│       │   ├── TenantSwitcher.tsx
│       │   ├── ThemeToggle.tsx
│       │   └── index.ts
│       ├── Breadcrumb/
│       │   ├── Breadcrumb.tsx
│       │   ├── BreadcrumbItem.tsx
│       │   └── index.ts
│       ├── Page/
│       │   ├── PageContainer.tsx
│       │   ├── PageHeader.tsx
│       │   ├── PageTitle.tsx
│       │   ├── PageActions.tsx
│       │   ├── PageSection.tsx
│       │   └── index.ts
│       └── index.ts
├── hooks/
│   ├── useBreadcrumbs.ts
│   ├── useLayout.ts
│   └── useKeyboardShortcuts.ts
└── lib/
    └── navigation.ts            # Menu items, route mappings
```

---

## Navigation Menu Structure

| Menu Item | Icon | Path | Sub-Items |
|-----------|------|------|-----------|
| Dashboard | Home | / | - |
| Products | Package | /products | List, Create, Categories |
| Inventory | Warehouse | /inventory | Stock, Movements, Adjustments |
| Sales | ShoppingCart | /sales | Orders, Invoices, Quotes |
| POS | Monitor | /pos | - |
| Customers | Users | /customers | List, Groups |
| Vendors | Truck | /vendors | List, Purchase Orders |
| HR | Users2 | /hr | Employees, Attendance, Payroll |
| Accounting | Calculator | /accounting | Chart of Accounts, Journals |
| Reports | BarChart | /reports | Sales, Inventory, Financial |
| Settings | Settings | /settings | General, Users, Roles |

---

## Progress Tracking

| Metric | Count |
|--------|-------|
| Total Tasks | 94 |
| Tasks Completed | 0 |
| Tasks In Progress | 0 |
| Tasks Not Started | 94 |

**Last Updated:** 2026-01-17  
**Current Status:** Ready for task document creation

---

## Notes for AI Agents

1. **Execution Order:** Tasks must be executed in numerical order within each group
2. **Sidebar State:** Use Zustand UI store for sidebar collapsed state
3. **Responsive:** Mobile sidebar should be a drawer overlay
4. **Permissions:** Filter menu items based on user permissions from auth store
5. **Accessibility:** All navigation must be keyboard accessible
6. **Active State:** Highlight active route in sidebar navigation
7. **Breadcrumbs:** Generate from route path with human-readable labels
8. **Dependencies:** This sub-phase depends on SubPhase-03, SubPhase-05, SubPhase-06
9. **No Code Snippets in Tasks:** Individual task documents should focus on descriptions, not implementation code
10. **Layout Variables:** Use CSS variables for sidebar width (240px/64px) and header height (64px)
11. **Print Mode:** Hide navigation elements when printing
12. **Touch Support:** Ensure touch-friendly interactions on tablet
