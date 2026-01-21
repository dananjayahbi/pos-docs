# Group B: Sidebar Component

> **Phase:** 07 - Frontend Infrastructure & ERP Dashboard  
> **SubPhase:** 07 - Dashboard Layout  
> **Group:** B of F  
> **Tasks Covered:** 15-32  
> **Group Goal:** Build collapsible sidebar with navigation, icons, tooltips, and permission-based visibility

---

## Navigation

- **↑ Parent:** [00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [Group-A_Dashboard-Route-Group-Layout](../Group-A_Dashboard-Route-Group-Layout/)
- **→ Next Group:** [Group-C_Header-Component](../Group-C_Header-Component/)

---

## Group Overview

This group creates the complete sidebar component with navigation. Creates main sidebar container and header with logo and collapse toggle. Connects to Zustand UI store for state. Builds navigation with NavItem, NavGroup, and SubNavItem components. Defines menu items array with icons, labels, and paths. Implements active state highlighting and collapsed state with icons only. Adds tooltips for collapsed state. Creates sidebar footer with user info. Implements permission-based menu visibility and keyboard navigation.

### Key Outcomes

- Sidebar container component
- Sidebar header with logo
- Logo expanded/collapsed variants
- Collapse toggle button
- Connected to UI store
- Sidebar navigation container
- Menu items definition
- NavItem component
- NavGroup component (collapsible)
- SubNavItem component
- Active state styling
- Lucide icons assigned
- Collapsed state (icons only)
- Collapsed tooltips
- Sidebar footer
- Permission-based visibility
- Resize animation
- Keyboard navigation

### Technology Context

- **State:** Zustand sidebarStore
- **Icons:** Lucide React
- **Animation:** CSS transitions
- **Tooltips:** Radix Tooltip
- **A11y:** Keyboard navigation

---

## Documents in This Group

| # | Document | Description | Tasks Covered |
|---|----------|-------------|---------------|
| 01 | `01_Tasks-15-23_Sidebar-Navigation.md` | Create sidebar structure and navigation | 15-23 |
| 02 | `02_Tasks-24-32_States-Features.md` | Add states, permissions, and keyboard navigation | 24-32 |

---

## Task Summary

| Task # | Task Name | Complexity | Dependencies |
|--------|-----------|------------|--------------|
| 15 | Create Sidebar Component | Low | Task 14 |
| 16 | Create Sidebar Header | Low | Task 15 |
| 17 | Create Logo Component | Low | Task 16 |
| 18 | Create Collapse Toggle Button | Low | Task 16 |
| 19 | Connect Sidebar to UI Store | Low | Task 18 |
| 20 | Create Sidebar Navigation | Low | Task 15 |
| 21 | Define Navigation Menu Items | Medium | Task 20 |
| 22 | Create NavItem Component | Low | Task 21 |
| 23 | Create NavGroup Component | Medium | Task 22 |
| 24 | Create SubNavItem Component | Low | Task 23 |
| 25 | Implement Active State Styling | Low | Task 22 |
| 26 | Add Navigation Icons | Low | Task 22 |
| 27 | Implement Collapsed State | Medium | Task 19 |
| 28 | Add Collapsed Tooltip | Low | Task 27 |
| 29 | Create Sidebar Footer | Low | Task 15 |
| 30 | Add Permission-Based Visibility | Medium | Task 21 |
| 31 | Add Sidebar Resize Animation | Low | Task 27 |
| 32 | Create Sidebar Keyboard Navigation | Medium | Task 20 |

---

## Execution Order

```
Task 15: Create Sidebar Component
    │
    ├────────────────────────────────┐
    ▼                                ▼
Task 16: Sidebar Header          Task 20: Navigation
    │                                │
    ├────────┐                       ▼
    ▼        ▼                   Task 21: Menu Items
Task 17   Task 18                    │
(Logo)    (Toggle)                   ├────────────────────┐
    │        │                       ▼                    │
    │        ▼                   Task 22: NavItem         │
    │     Task 19: UI Store          │                    │
    │        │                       ├────────────────────┤
    │        ▼                       ▼                    ▼
    │     Task 27: Collapsed     Task 23: NavGroup    Task 25
    │        │                       │                (Active)
    │        ├────────┐              ▼                    │
    │        ▼        ▼          Task 24: SubNavItem      │
    │     Task 28  Task 31           │                    │
    │     (Tooltip) (Animation)      │                    │
    │        │        │              │                    │
    │        └────────┴──────────────┴────────────────────┘
    │                                │
    ▼                                │
Task 29: Footer                      │
    │                                │
    ├──────────────┬─────────────────┤
    ▼              ▼                 │
Task 26        Task 30               │
(Icons)        (Permissions)         │
    │              │                 │
    └──────────────┴─────────────────┘
                   │
                   ▼
             Task 32: Keyboard Nav
```

---

## Expected Deliverables

```
frontend/
└── components/
    └── layout/
        └── Sidebar/
            ├── Sidebar.tsx
            ├── SidebarHeader.tsx
            ├── SidebarNav.tsx
            ├── NavItem.tsx
            ├── NavGroup.tsx
            ├── SubNavItem.tsx
            ├── SidebarFooter.tsx
            ├── Logo.tsx
            └── index.ts
```

---

## Notes for AI Agents

### Menu Items Structure (Task 21)
| Property | Type | Description |
|----------|------|-------------|
| id | string | Unique identifier |
| label | string | Display text |
| icon | LucideIcon | Lucide icon component |
| path | string | Route path |
| children | NavItem[] | Sub-items (optional) |
| permission | string | Required permission |

### NavItem Props (Task 22)
| Prop | Type | Description |
|------|------|-------------|
| item | NavItem | Menu item data |
| isCollapsed | boolean | Sidebar collapsed |
| isActive | boolean | Current route match |

### NavGroup Props (Task 23)
| Prop | Type | Description |
|------|------|-------------|
| item | NavItem | Group data with children |
| isCollapsed | boolean | Sidebar collapsed |
| defaultOpen | boolean | Initially expanded |

### Active State (Task 25)
| State | Style |
|-------|-------|
| Normal | bg-transparent |
| Hover | bg-muted |
| Active | bg-primary/10, text-primary |

### Collapsed State (Task 27)
| Element | Collapsed | Expanded |
|---------|-----------|----------|
| Width | 72px | 240px |
| Logo | Icon only | Full logo |
| Labels | Hidden | Visible |
| Groups | Icons only | Expandable |

### Permission Check (Task 30)
- Filter menu items by permission
- Use hasPermission from auth store
- Hide items without permission
- Show placeholder if no items

### Keyboard Navigation (Task 32)
| Key | Action |
|-----|--------|
| ArrowUp | Previous item |
| ArrowDown | Next item |
| Enter | Navigate or expand |
| Escape | Collapse group |
