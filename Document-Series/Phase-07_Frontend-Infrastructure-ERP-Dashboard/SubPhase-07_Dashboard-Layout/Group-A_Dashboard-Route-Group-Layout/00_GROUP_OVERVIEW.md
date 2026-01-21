# Group A: Dashboard Route Group & Layout

> **Phase:** 07 - Frontend Infrastructure & ERP Dashboard  
> **SubPhase:** 07 - Dashboard Layout  
> **Group:** A of F  
> **Tasks Covered:** 01-14  
> **Group Goal:** Create the (dashboard) route group with main layout, auth guard, and accessibility features

---

## Navigation

- **↑ Parent:** [00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous Group:** None (First Group)
- **→ Next Group:** [Group-B_Sidebar-Component](../Group-B_Sidebar-Component/)

---

## Group Overview

This group creates the dashboard route group and main layout component. Sets up app/(dashboard)/ directory structure. Creates layout.tsx with CSS grid for sidebar, header, and content areas. Adds main content container with scrolling. Wraps layout with UI store context. Creates loading skeleton and error boundary for dashboard pages. Configures default metadata. Adds ProtectedRoute auth guard. Implements page transition animations. Defines CSS variables for dimensions. Creates layout hooks. Adds skip navigation link for accessibility.

### Key Outcomes

- (dashboard) route group created
- Dashboard layout component
- CSS grid layout structure
- Main content container
- Layout state provider
- Layout loading skeleton
- Layout error boundary
- Dashboard metadata
- Auth guard (ProtectedRoute)
- Page transition animations
- Layout CSS variables
- Layout dimension hooks
- Skip navigation link
- Layout structure verified

### Technology Context

- **Routing:** Next.js App Router route groups
- **Layout:** CSS Grid
- **State:** Zustand UI store
- **Auth:** ProtectedRoute wrapper
- **A11y:** Skip navigation

---

## Documents in This Group

| # | Document | Description | Tasks Covered |
|---|----------|-------------|---------------|
| 01 | `01_Tasks-01-07_Route-Group-Structure.md` | Create route group and layout structure | 01-07 |
| 02 | `02_Tasks-08-14_Layout-Features-A11y.md` | Add auth, animations, hooks, and accessibility | 08-14 |

---

## Task Summary

| Task # | Task Name | Complexity | Dependencies |
|--------|-----------|------------|--------------|
| 01 | Create (dashboard) Route Group | Low | SubPhase-06 |
| 02 | Create Dashboard Layout Component | Medium | Task 01 |
| 03 | Define Layout Grid Structure | Medium | Task 02 |
| 04 | Create Main Content Container | Low | Task 02 |
| 05 | Add Layout State Provider | Low | Task 02 |
| 06 | Create Layout Loading State | Low | Task 02 |
| 07 | Create Layout Error Boundary | Medium | Task 02 |
| 08 | Configure Layout Metadata | Low | Task 02 |
| 09 | Add Auth Guard to Layout | Low | Task 02 |
| 10 | Create Layout Transition Animation | Low | Task 02 |
| 11 | Define Layout CSS Variables | Low | Task 03 |
| 12 | Create Layout Hooks | Low | Task 11 |
| 13 | Add Skip Navigation Link | Low | Task 02 |
| 14 | Verify Layout Structure | Low | Task 13 |

---

## Execution Order

```
Task 01: Create (dashboard) Route Group
    │
    ▼
Task 02: Dashboard Layout Component
    │
    ├────────────────────────────────────────┐
    ▼                                        │
Task 03: Grid Structure                      │
    │                                        │
    ▼                                        │
Task 11: CSS Variables                       │
    │                                        │
    ▼                                        │
Task 12: Layout Hooks                        │
    │                                        │
    ├──────────┬────────┬────────┬───────────┤
    ▼          ▼        ▼        ▼           │
Task 04    Task 05   Task 06   Task 07       │
(Content)  (Provider) (Loading) (Error)      │
    │          │        │        │           │
    └──────────┴────────┴────────┘           │
               │                             │
               ├──────────┬──────────────────┤
               ▼          ▼                  │
           Task 08    Task 09                │
           (Metadata)  (Auth)                │
               │          │                  │
               └──────────┴──────────────────┤
                          │                  │
               ┌──────────┴──────────┐       │
               ▼                     ▼       │
           Task 10              Task 13      │
           (Animation)          (Skip Link)  │
               │                     │       │
               └─────────┬───────────┘       │
                         ▼
                    Task 14: Verify
```

---

## Expected Deliverables

```
frontend/
├── app/
│   └── (dashboard)/
│       ├── layout.tsx
│       ├── loading.tsx
│       └── error.tsx
├── components/
│   └── layout/
│       ├── DashboardLayout.tsx
│       ├── MainContent.tsx
│       ├── SkipNavigation.tsx
│       └── index.ts
└── hooks/
    └── useLayout.ts
```

---

## Notes for AI Agents

### Route Group Purpose (Task 01)
- Parentheses exclude from URL
- app/(dashboard)/ directory
- Shared layout for all ERP pages
- Separate from auth layout

### Layout Grid Structure (Task 03)
| Area | Position | Size |
|------|----------|------|
| Header | Top | 64px height |
| Sidebar | Left | 240px (expanded), 72px (collapsed) |
| Content | Right | Remaining |

### Layout CSS Variables (Task 11)
| Variable | Value |
|----------|-------|
| --sidebar-width | 240px |
| --sidebar-collapsed | 72px |
| --header-height | 64px |
| --content-padding | 24px |

### Layout Hooks (Task 12)
| Hook | Returns |
|------|---------|
| useLayout | sidebarWidth, headerHeight, isMobile |
| useSidebarState | isCollapsed, toggle |

### Auth Guard (Task 09)
- Wrap with ProtectedRoute
- Redirect unauthenticated to /login
- Check permissions for routes

### Skip Navigation (Task 13)
- Hidden until focused
- "Skip to main content" link
- Jumps to main content area
- Accessibility requirement
