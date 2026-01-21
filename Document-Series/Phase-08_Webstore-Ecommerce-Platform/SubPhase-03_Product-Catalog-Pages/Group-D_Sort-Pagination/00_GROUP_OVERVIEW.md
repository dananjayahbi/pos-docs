# Group D: Sort & Pagination

> **Phase:** 08 - Webstore & E-Commerce Platform  
> **SubPhase:** 03 - Product Catalog Pages  
> **Group:** D of F  
> **Tasks Covered:** 55-70  
> **Group Goal:** Create toolbar with sorting, view toggle, active filters, and pagination

---

## Navigation

- **↑ Parent:** [00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [Group-C_Filter-Sidebar](../Group-C_Filter-Sidebar/)
- **→ Next Group:** [Group-E_Category-Collection-Pages](../Group-E_Category-Collection-Pages/)

---

## Group Overview

This group creates toolbar and pagination. Creates toolbar component with active filters display (tags with remove action). Creates sort dropdown with sort options and change handler. Creates view toggle for grid/list views. Creates list view layout. Creates mobile filter button and mobile filter drawer. Creates pagination component with page numbers and previous/next buttons. Creates load more button alternative. Creates URL state sync for shareable filter URLs.

### Key Outcomes

- Toolbar component
- Active filters display
- Active filter tag
- Remove filter action
- Sort dropdown
- Sort options defined
- Sort change handler
- View toggle (grid/list)
- List view layout
- Mobile filter button
- Mobile filter drawer
- Pagination component
- Page numbers
- Previous/Next buttons
- Load more button
- URL state sync

### Technology Context

- **URL State:** nuqs or custom hook
- **Pagination:** Server-side
- **Drawer:** Mobile filter overlay
- **Sync:** Bi-directional URL sync

---

## Documents in This Group

| # | Document | Description | Tasks Covered |
|---|----------|-------------|---------------|
| 01 | `01_Tasks-55-63_Toolbar-Sort-View.md` | Create toolbar, sorting, and view toggle | 55-63 |
| 02 | `02_Tasks-64-70_Mobile-Pagination-URL.md` | Create mobile drawer, pagination, and URL sync | 64-70 |

---

## Task Summary

| Task # | Task Name | Complexity | Dependencies |
|--------|-----------|------------|--------------|
| 55 | Create Toolbar Component | Medium | Task 16 |
| 56 | Create Active Filters Display | Low | Task 55 |
| 57 | Create Active Filter Tag | Low | Task 56 |
| 58 | Create Remove Filter Action | Low | Task 57 |
| 59 | Create Sort Dropdown | Low | Task 55 |
| 60 | Define Sort Options | Low | Task 59 |
| 61 | Create Sort Change Handler | Low | Task 59 |
| 62 | Create View Toggle | Low | Task 55 |
| 63 | Create List View Layout | Medium | Task 62 |
| 64 | Create Mobile Filter Button | Low | Task 55 |
| 65 | Create Mobile Filter Drawer | Medium | Task 64 |
| 66 | Create Pagination Component | Medium | Task 16 |
| 67 | Create Page Numbers | Low | Task 66 |
| 68 | Create Previous/Next Buttons | Low | Task 66 |
| 69 | Create Load More Button | Low | Task 66 |
| 70 | Create URL State Sync | Medium | Task 69 |

---

## Execution Order

```
Task 55: Toolbar Component
    │
    ├──────────────────────────────────────────────────┐
    ▼                                                  │
Task 56: Active Filters Display                        │
    │                                                  │
    ▼                                                  │
Task 57: Active Filter Tag                             │
    │                                                  │
    ▼                                                  │
Task 58: Remove Filter Action                          │
    │                                                  │
    ▼                                                  │
Task 59: Sort Dropdown                                 │
    │                                                  │
    ├──────────┬──────────┐                            │
    ▼          ▼          │                            │
Task 60    Task 61       │                            │
(Options)  (Handler)     │                            │
    │          │          │                            │
    └──────────┘          │                            │
         │                │                            │
         ▼                │                            │
   Task 62: View Toggle   │                            │
         │                │                            │
         ▼                │                            │
   Task 63: List View     │                            │
         │                │                            │
         ▼                │                            │
   Task 64: Mobile Filter Button                       │
         │                │                            │
         ▼                │                            │
   Task 65: Mobile Filter Drawer                       │
         │                │                            │
         └────────────────┘                            │
                   │                                   │
                   ▼                                   │
             Task 66: Pagination                       │
                   │                                   │
             ┌─────┴─────┐                             │
             ▼           ▼                             │
          Task 67    Task 68                           │
         (Numbers)  (Prev/Next)                        │
             │           │                             │
             └─────┬─────┘                             │
                   ▼                                   │
             Task 69: Load More                        │
                   │                                   │
                   ▼
             Task 70: URL Sync
```

---

## Expected Deliverables

```
frontend/
├── components/
│   └── storefront/
│       └── catalog/
│           ├── Toolbar/
│           │   ├── CatalogToolbar.tsx
│           │   ├── ActiveFilters.tsx
│           │   ├── FilterTag.tsx
│           │   ├── SortDropdown.tsx
│           │   ├── ViewToggle.tsx
│           │   ├── MobileFilterButton.tsx
│           │   └── index.ts
│           ├── Filters/
│           │   └── MobileFilterDrawer.tsx
│           ├── Pagination/
│           │   ├── Pagination.tsx
│           │   ├── PageNumbers.tsx
│           │   ├── PrevNextButtons.tsx
│           │   ├── LoadMoreButton.tsx
│           │   └── index.ts
│           └── ListView.tsx
├── hooks/
│   └── store/
│       ├── useFilters.ts
│       └── useURLState.ts
```

---

## Notes for AI Agents

### Toolbar Layout (Task 55)
| Section | Content |
|---------|---------|
| Left | Active filters, count |
| Right | Sort, View, Filter (mobile) |
| Mobile | Stacked layout |

### Active Filter Tag (Task 57)
| Element | Content |
|---------|---------|
| Label | "Category: Electronics" |
| Remove | X button |
| Style | Pill/chip style |

### Sort Options (Task 60)
| Value | Label | API Param |
|-------|-------|-----------|
| newest | Newest First | -created_at |
| price_low | Price: Low to High | price |
| price_high | Price: High to Low | -price |
| popular | Most Popular | -sales_count |
| rating | Highest Rated | -avg_rating |

### View Toggle (Task 62)
| View | Icon | Grid Cols |
|------|------|-----------|
| Grid | Grid icon | 2-4 |
| List | List icon | 1 |

### List View Layout (Task 63)
| Section | Layout |
|---------|--------|
| Image | Left 30% |
| Content | Right 70% |
| Actions | Right side |
| Mobile | Stack |

### Mobile Filter Button (Task 64)
| Feature | Value |
|---------|-------|
| Visible | < 1024px |
| Icon | Filter icon |
| Badge | Active filter count |
| Action | Open drawer |

### Mobile Filter Drawer (Task 65)
| Feature | Value |
|---------|-------|
| Position | Right slide-in |
| Width | 100% or 80% |
| Header | "Filters" + Close |
| Footer | Apply + Clear buttons |

### Pagination (Task 66)
| Element | Description |
|---------|-------------|
| Per Page | 24 products |
| Display | Page X of Y |
| Max Pages | Show 5 numbers |
| Ellipsis | ... for gaps |

### Load More (Task 69)
| State | Button Text |
|-------|-------------|
| Default | Load More Products |
| Loading | Loading... |
| No More | All products loaded |

### URL State Sync (Task 70)
| Parameter | Example |
|-----------|---------|
| category | ?category=electronics |
| min_price | ?min_price=1000 |
| max_price | ?max_price=5000 |
| sort | ?sort=price_low |
| page | ?page=2 |
| colors | ?colors=red,blue |
