# Group D: Navigation & Breadcrumbs

> **Phase:** 07 - Frontend Infrastructure & ERP Dashboard  
> **SubPhase:** 07 - Dashboard Layout  
> **Group:** D of F  
> **Tasks Covered:** 51-66  
> **Group Goal:** Build breadcrumb navigation, page header components, and keyboard shortcuts system

---

## Navigation

- **↑ Parent:** [00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [Group-C_Header-Component](../Group-C_Header-Component/)
- **→ Next Group:** [Group-E_Responsive-Design-Mobile](../Group-E_Responsive-Design-Mobile/)

---

## Group Overview

This group creates breadcrumb navigation and page layout components. Creates Breadcrumb, BreadcrumbItem, and BreadcrumbSeparator components. Implements useBreadcrumbs hook with route-to-label mapping and dynamic segment handling. Creates PageContainer, PageHeader, PageTitle, PageActions, BackButton, TabNavigation, and PageSection components. Defines global keyboard shortcuts and creates shortcuts help modal.

### Key Outcomes

- Breadcrumb component
- BreadcrumbItem component
- BreadcrumbSeparator component
- useBreadcrumbs hook
- Route-to-breadcrumb mapping
- Dynamic segment display
- Breadcrumb in page container
- PageHeader component
- PageTitle component
- PageActions slot
- BackButton component
- TabNavigation component
- PageSection component
- Global keyboard shortcuts
- Shortcuts help modal
- Navigation components tested

### Technology Context

- **Routing:** Next.js usePathname, useParams
- **Breadcrumbs:** Semantic nav element
- **Shortcuts:** Custom hook with event listeners
- **Modal:** Radix Dialog

---

## Documents in This Group

| # | Document | Description | Tasks Covered |
|---|----------|-------------|---------------|
| 01 | `01_Tasks-51-58_Breadcrumbs-PageHeader.md` | Create breadcrumbs and page header components | 51-58 |
| 02 | `02_Tasks-59-66_PageComponents-Shortcuts.md` | Create page components and keyboard shortcuts | 59-66 |

---

## Task Summary

| Task # | Task Name | Complexity | Dependencies |
|--------|-----------|------------|--------------|
| 51 | Create Breadcrumb Component | Low | Task 14 |
| 52 | Create BreadcrumbItem Component | Low | Task 51 |
| 53 | Create BreadcrumbSeparator | Low | Task 51 |
| 54 | Create useBreadcrumbs Hook | Medium | Task 51 |
| 55 | Define Route-to-Breadcrumb Mapping | Medium | Task 54 |
| 56 | Handle Dynamic Route Segments | Medium | Task 55 |
| 57 | Add Breadcrumb to Page Container | Low | Task 56 |
| 58 | Create Page Header Component | Low | Task 57 |
| 59 | Create Page Title Component | Low | Task 58 |
| 60 | Create Page Actions Slot | Low | Task 58 |
| 61 | Create Back Button Component | Low | Task 58 |
| 62 | Create Tab Navigation Component | Medium | Task 58 |
| 63 | Create Page Section Component | Low | Task 58 |
| 64 | Create Keyboard Shortcuts | Medium | Task 33 |
| 65 | Create Shortcuts Help Modal | Low | Task 64 |
| 66 | Test Navigation Components | Low | Task 65 |

---

## Execution Order

```
Task 51: Create Breadcrumb Component
    │
    ├──────────┬──────────┐
    ▼          ▼          ▼
Task 52    Task 53    Task 54
(Item)     (Separator) (Hook)
    │          │          │
    └──────────┴──────────┘
               │
               ▼
         Task 55: Route Mapping
               │
               ▼
         Task 56: Dynamic Segments
               │
               ▼
         Task 57: Add to Container
               │
               ▼
         Task 58: Page Header
               │
    ┌──────────┼──────────┬──────────┬──────────┐
    ▼          ▼          ▼          ▼          ▼
Task 59    Task 60    Task 61    Task 62    Task 63
(Title)    (Actions)  (Back)     (Tabs)     (Section)
    │          │          │          │          │
    └──────────┴──────────┴──────────┴──────────┘
                          │
                          ▼
                    Task 64: Shortcuts
                          │
                          ▼
                    Task 65: Shortcuts Modal
                          │
                          ▼
                    Task 66: Test
```

---

## Expected Deliverables

```
frontend/
├── components/
│   └── layout/
│       ├── Breadcrumb/
│       │   ├── Breadcrumb.tsx
│       │   ├── BreadcrumbItem.tsx
│       │   ├── BreadcrumbSeparator.tsx
│       │   └── index.ts
│       └── Page/
│           ├── PageContainer.tsx
│           ├── PageHeader.tsx
│           ├── PageTitle.tsx
│           ├── PageActions.tsx
│           ├── BackButton.tsx
│           ├── TabNavigation.tsx
│           ├── PageSection.tsx
│           └── index.ts
├── hooks/
│   ├── useBreadcrumbs.ts
│   └── useKeyboardShortcuts.ts
└── lib/
    └── navigation.ts
```

---

## Notes for AI Agents

### Breadcrumb Structure (Task 51)
- nav element with aria-label="Breadcrumb"
- ol with list items
- Separator between items
- Last item not a link

### Route Mapping (Task 55)
| Route | Label |
|-------|-------|
| /dashboard | Dashboard |
| /products | Products |
| /products/[id] | Product Details |
| /products/create | Create Product |
| /inventory | Inventory |
| /sales | Sales |

### Dynamic Segments (Task 56)
| Segment | Source |
|---------|--------|
| [id] | Fetch entity name from API or cache |
| [slug] | Use slug value |

### PageHeader Props (Task 58)
| Prop | Type | Description |
|------|------|-------------|
| title | string | Page title |
| subtitle | string? | Optional subtitle |
| actions | ReactNode? | Action buttons |
| backHref | string? | Back button link |

### PageActions (Task 60)
- Right-aligned buttons
- Primary action emphasized
- Dropdown for overflow

### TabNavigation Props (Task 62)
| Prop | Type | Description |
|------|------|-------------|
| tabs | Tab[] | Tab items |
| activeTab | string | Current tab id |
| onChange | (id) => void | Tab change handler |

### Keyboard Shortcuts (Task 64)
| Shortcut | Action |
|----------|--------|
| Cmd/Ctrl + K | Open search |
| Cmd/Ctrl + / | Toggle sidebar |
| Cmd/Ctrl + ? | Show shortcuts |
| Escape | Close modal/dropdown |

### Shortcuts Modal (Task 65)
- Triggered by Cmd/Ctrl + ?
- List all available shortcuts
- Grouped by category
- Close with Escape
