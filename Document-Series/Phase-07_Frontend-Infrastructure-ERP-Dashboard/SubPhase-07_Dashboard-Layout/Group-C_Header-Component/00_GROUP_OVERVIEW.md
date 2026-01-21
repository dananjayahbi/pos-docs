# Group C: Header Component

> **Phase:** 07 - Frontend Infrastructure & ERP Dashboard  
> **SubPhase:** 07 - Dashboard Layout  
> **Group:** C of F  
> **Tasks Covered:** 33-50  
> **Group Goal:** Build header with search, notifications, user menu, tenant switcher, and theme toggle

---

## Navigation

- **↑ Parent:** [00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [Group-B_Sidebar-Component](../Group-B_Sidebar-Component/)
- **→ Next Group:** [Group-D_Navigation-Breadcrumbs](../Group-D_Navigation-Breadcrumbs/)

---

## Group Overview

This group creates the complete header component with all features. Creates main header container and mobile menu toggle. Adds header logo for mobile view. Implements global search input with keyboard shortcut and command palette connection. Creates notifications bell with unread badge, dropdown with recent notifications, and mark as read action. Builds user menu dropdown with avatar, profile link, tenant switcher, theme toggle, and logout button. Adds help button and quick actions button.

### Key Outcomes

- Header container component
- Mobile menu toggle
- Header logo (mobile)
- Global search input
- Search command palette
- Notification bell with badge
- Notification dropdown
- Notification item component
- Mark as read action
- User menu dropdown
- User avatar component
- Profile link
- Tenant switcher
- Theme toggle
- Logout button
- Help button
- Quick actions button
- Header component tested

### Technology Context

- **Dropdowns:** Radix DropdownMenu
- **Search:** Command palette (cmdk)
- **State:** Notifications store, theme store
- **Icons:** Lucide React

---

## Documents in This Group

| # | Document | Description | Tasks Covered |
|---|----------|-------------|---------------|
| 01 | `01_Tasks-33-41_Header-Search-Notifications.md` | Create header, search, and notifications | 33-41 |
| 02 | `02_Tasks-42-50_UserMenu-Actions.md` | Create user menu, tenant switcher, and actions | 42-50 |

---

## Task Summary

| Task # | Task Name | Complexity | Dependencies |
|--------|-----------|------------|--------------|
| 33 | Create Header Component | Low | Task 14 |
| 34 | Create Mobile Menu Toggle | Low | Task 33 |
| 35 | Create Header Logo (Mobile) | Low | Task 33 |
| 36 | Create Global Search Input | Medium | Task 33 |
| 37 | Implement Search Functionality | Medium | Task 36 |
| 38 | Create Notifications Bell | Low | Task 33 |
| 39 | Create Notifications Dropdown | Medium | Task 38 |
| 40 | Create Notification Item | Low | Task 39 |
| 41 | Mark Notifications as Read | Low | Task 40 |
| 42 | Create User Menu Dropdown | Medium | Task 33 |
| 43 | Create User Avatar Component | Low | Task 42 |
| 44 | Add User Profile Link | Low | Task 42 |
| 45 | Add Tenant Switcher | Medium | Task 42 |
| 46 | Add Theme Toggle | Low | Task 42 |
| 47 | Add Logout Button | Low | Task 42 |
| 48 | Create Help Button | Low | Task 33 |
| 49 | Create Quick Actions Button | Low | Task 33 |
| 50 | Test Header Component | Low | Task 49 |

---

## Execution Order

```
Task 33: Create Header Component
    │
    ├────────────────────────────────────────────────────┐
    ▼                                                    │
Task 34: Mobile Toggle                                   │
    │                                                    │
    ▼                                                    │
Task 35: Header Logo (Mobile)                            │
    │                                                    │
    ├──────────┬──────────┬──────────┬──────────────────┐│
    ▼          ▼          ▼          ▼                  ││
Task 36    Task 38    Task 42    Task 48    Task 49    ││
(Search)   (Bell)     (UserMenu)  (Help)    (Quick)    ││
    │          │          │          │          │       ││
    ▼          ▼          │          │          │       ││
Task 37    Task 39       │          │          │       ││
(Palette)  (Dropdown)    ├──────────┤          │       ││
    │          │          ▼          │          │       ││
    │          ▼      Task 43       │          │       ││
    │      Task 40    (Avatar)       │          │       ││
    │      (Item)         │          │          │       ││
    │          │          ├──────────┼──────────────────┘│
    │          ▼          ▼          │                   │
    │      Task 41    Tasks 44-47   │                   │
    │      (Read)     (Profile,     │                   │
    │          │       Tenant,      │                   │
    │          │       Theme,       │                   │
    │          │       Logout)      │                   │
    │          │          │          │                   │
    └──────────┴──────────┴──────────┴───────────────────┘
                          │
                          ▼
                    Task 50: Test
```

---

## Expected Deliverables

```
frontend/
└── components/
    └── layout/
        └── Header/
            ├── Header.tsx
            ├── GlobalSearch.tsx
            ├── NotificationBell.tsx
            ├── NotificationDropdown.tsx
            ├── NotificationItem.tsx
            ├── UserMenu.tsx
            ├── UserAvatar.tsx
            ├── TenantSwitcher.tsx
            ├── ThemeToggle.tsx
            ├── HelpButton.tsx
            ├── QuickActions.tsx
            └── index.ts
```

---

## Notes for AI Agents

### Header Structure (Task 33)
| Section | Position | Content |
|---------|----------|---------|
| Left | flex start | Mobile toggle, Logo (mobile), Search |
| Right | flex end | Notifications, Help, Quick Actions, User Menu |

### Global Search (Task 36)
| Feature | Description |
|---------|-------------|
| Shortcut | Cmd/Ctrl + K |
| Hint | Show shortcut in input |
| Icon | Search icon |
| Width | 240px expanded |

### Search Functionality (Task 37)
| Search Type | Results |
|-------------|---------|
| Pages | Navigate to page |
| Products | Product search |
| Customers | Customer search |
| Commands | Run command |

### Notification Bell (Task 38)
| State | Display |
|-------|---------|
| No unread | Bell icon only |
| Unread | Bell + red badge with count |
| 10+ unread | Badge shows "9+" |

### Notification Item (Task 40)
| Property | Description |
|----------|-------------|
| icon | Notification type icon |
| title | Short title |
| message | Notification content |
| time | Relative time (2m ago) |
| isRead | Read state |

### User Menu Items (Task 42)
| Item | Icon | Action |
|------|------|--------|
| Profile | User | Navigate to profile |
| Settings | Settings | Navigate to settings |
| Tenant | Building | Open tenant switcher |
| Theme | Sun/Moon | Toggle theme |
| Logout | LogOut | Logout action |

### Tenant Switcher (Task 45)
- Show only if user has multiple tenants
- Dropdown with tenant names
- Current tenant highlighted
- Switch triggers API call

### Theme Toggle (Task 46)
| Theme | Icon | Label |
|-------|------|-------|
| Light | Sun | Light mode |
| Dark | Moon | Dark mode |
| System | Monitor | System |
