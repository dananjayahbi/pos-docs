# Group A: Catalog Routes & Pages

> **Phase:** 08 - Webstore & E-Commerce Platform  
> **SubPhase:** 03 - Product Catalog Pages  
> **Group:** A of F  
> **Tasks Covered:** 01-16  
> **Group Goal:** Create catalog route structure with layout, header, breadcrumbs, and container components

---

## Navigation

- **↑ Parent:** [00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous Group:** None (First Group)
- **→ Next Group:** [Group-B_Product-Grid-Cards](../Group-B_Product-Grid-Cards/)

---

## Group Overview

This group creates the catalog route structure. Creates products directory under (storefront). Creates all products page route, category page route, and collection page route. Creates products layout wrapper. Creates products loading state and error state. Creates catalog page component wrapper. Creates catalog header with breadcrumb component. Creates catalog title and product count display. Creates catalog main content container with sidebar and grid containers. Verifies complete route structure.

### Key Outcomes

- Products directory created
- All products page route
- Category page route (/category/[slug])
- Collection page route (/collection/[slug])
- Products layout component
- Products loading state
- Products error state
- Catalog page component
- Catalog header
- Breadcrumb component
- Catalog title
- Product count display
- Catalog main content
- Sidebar container
- Grid container
- Route structure verified

### Technology Context

- **Routing:** Next.js App Router
- **Data:** Server Components + TanStack Query
- **Layout:** Two-column (sidebar + grid)
- **SEO:** Dynamic meta tags

---

## Documents in This Group

| # | Document | Description | Tasks Covered |
|---|----------|-------------|---------------|
| 01 | `01_Tasks-01-08_Routes-Layout-Page.md` | Create routes, layout, and page component | 01-08 |
| 02 | `02_Tasks-09-16_Header-Containers-Verify.md` | Create header, containers, and verification | 09-16 |

---

## Task Summary

| Task # | Task Name | Complexity | Dependencies |
|--------|-----------|------------|--------------|
| 01 | Create Products Directory | Low | SubPhase-02 |
| 02 | Create All Products Page Route | Low | Task 01 |
| 03 | Create Category Page Route | Low | Task 01 |
| 04 | Create Collection Page Route | Low | Task 01 |
| 05 | Create Products Layout | Medium | Task 01 |
| 06 | Create Products Loading State | Low | Task 02 |
| 07 | Create Products Error State | Low | Task 02 |
| 08 | Create Catalog Page Component | Medium | Task 02 |
| 09 | Create Catalog Header | Low | Task 08 |
| 10 | Create Breadcrumb Component | Low | Task 09 |
| 11 | Create Catalog Title | Low | Task 09 |
| 12 | Create Product Count Display | Low | Task 08 |
| 13 | Create Catalog Main Content | Low | Task 08 |
| 14 | Create Sidebar Container | Low | Task 13 |
| 15 | Create Grid Container | Low | Task 13 |
| 16 | Verify Route Structure | Low | Task 15 |

---

## Execution Order

```
Task 01: Products Directory
    │
    ├──────────┬──────────┬──────────┬──────────┐
    ▼          ▼          ▼          ▼          │
Task 02    Task 03    Task 04    Task 05       │
(All)     (Category)(Collection)(Layout)       │
    │          │          │          │          │
    ├──────────┴──────────┘          │          │
    │                                 │          │
    ├──────────┬──────────┐          │          │
    ▼          ▼          │          │          │
Task 06    Task 07       │          │          │
(Loading)  (Error)       │          │          │
    │          │          │          │          │
    └──────────┘          │          │          │
         │                │          │          │
         ▼                │          │          │
   Task 08: Catalog Page  │          │          │
         │                │          │          │
    ┌────┴────┬──────────┐│          │          │
    ▼         ▼          ▼│          │          │
Task 09   Task 12   Task 13          │          │
(Header)  (Count)   (Content)        │          │
    │         │          │           │          │
    ├────┐    │     ┌────┴────┐      │          │
    ▼    ▼    │     ▼         ▼      │          │
T-10  T-11   │  Task 14   Task 15   │          │
(Bread)(Title)│ (Sidebar)  (Grid)    │          │
    │    │    │     │         │      │          │
    └────┴────┴─────┴─────────┘      │          │
               │                     │
               ▼
         Task 16: Verify
```

---

## Expected Deliverables

```
frontend/
├── app/
│   └── (storefront)/
│       └── products/
│           ├── page.tsx
│           ├── layout.tsx
│           ├── loading.tsx
│           ├── error.tsx
│           ├── category/
│           │   └── [slug]/
│           │       └── page.tsx
│           └── collection/
│               └── [slug]/
│                   └── page.tsx
├── components/
│   └── storefront/
│       └── catalog/
│           ├── CatalogPage.tsx
│           ├── CatalogHeader.tsx
│           ├── CatalogTitle.tsx
│           ├── ProductCount.tsx
│           ├── CatalogContent.tsx
│           ├── Breadcrumb.tsx
│           ├── SidebarContainer.tsx
│           ├── GridContainer.tsx
│           └── index.ts
```

---

## Notes for AI Agents

### Route Structure (Tasks 01-04)
| Route | Path | Description |
|-------|------|-------------|
| All Products | /products | All products listing |
| Category | /products/category/[slug] | Category products |
| Collection | /products/collection/[slug] | Collection products |

### Products Layout (Task 05)
| Feature | Description |
|---------|-------------|
| Title | Page title meta |
| Container | Max width wrapper |
| Children | Render page content |

### Loading State (Task 06)
| Element | Content |
|---------|---------|
| Header | Title skeleton |
| Filters | Filter skeleton |
| Grid | Card skeletons |
| Count | Hidden |

### Error State (Task 07)
| Element | Content |
|---------|---------|
| Message | "Failed to load products" |
| Retry | Try again button |
| Home | Back to home link |

### Catalog Header (Task 09)
| Element | Content |
|---------|---------|
| Breadcrumb | Home > Products > Category |
| Title | "All Products" or category name |
| Count | "124 products found" |

### Breadcrumb Structure (Task 10)
| Level | Example |
|-------|---------|
| 1 | Home |
| 2 | Products |
| 3 | Category (optional) |
| 4 | Subcategory (optional) |

### Catalog Layout (Task 13)
| Section | Width | Content |
|---------|-------|---------|
| Sidebar | 280px | Filters |
| Grid | Remaining | Products |
| Mobile | 100% | Stack |
