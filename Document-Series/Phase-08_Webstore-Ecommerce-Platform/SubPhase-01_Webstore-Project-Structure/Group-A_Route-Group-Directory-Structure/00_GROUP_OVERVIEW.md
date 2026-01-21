# Group A: Route Group & Directory Structure

> **Phase:** 08 - Webstore & E-Commerce Platform  
> **SubPhase:** 01 - Webstore Project Structure  
> **Group:** A of F  
> **Tasks Covered:** 01-14  
> **Group Goal:** Set up storefront route group and directory structure within the Next.js monorepo

---

## Navigation

- **↑ Parent:** [00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous Group:** None (First Group)
- **→ Next Group:** [Group-B_Store-Layout-Foundation](../Group-B_Store-Layout-Foundation/)

---

## Group Overview

This group creates the complete storefront route structure. Creates the (storefront) route group separate from (dashboard). Creates store root layout and homepage route. Creates product, cart, checkout, account, and search directories. Creates store loading state, error boundary, and not-found page. Creates storefront components directory and shared components directory. Verifies all routes are accessible.

### Key Outcomes

- Storefront route group created
- Store root layout
- Store homepage route
- Products directory
- Cart directory
- Checkout directory
- Account directory
- Search page route
- Store loading state
- Store error boundary
- Store not-found page
- Storefront components directory
- Shared components directory
- Directory structure verified

### Technology Context

- **Routing:** Next.js App Router with route groups
- **Separation:** (storefront) vs (dashboard)
- **Loading:** Suspense with loading.tsx
- **Error:** Error boundary components

---

## Documents in This Group

| # | Document | Description | Tasks Covered |
|---|----------|-------------|---------------|
| 01 | `01_Tasks-01-07_Route-Group-Directories.md` | Create route group and page directories | 01-07 |
| 02 | `02_Tasks-08-14_Pages-Components-Verify.md` | Create pages, components, and verification | 08-14 |

---

## Task Summary

| Task # | Task Name | Complexity | Dependencies |
|--------|-----------|------------|--------------|
| 01 | Create Storefront Route Group | Low | Phase-07 |
| 02 | Create Store Root Layout | Medium | Task 01 |
| 03 | Create Store Homepage Route | Low | Task 01 |
| 04 | Create Products Directory | Low | Task 01 |
| 05 | Create Cart Directory | Low | Task 01 |
| 06 | Create Checkout Directory | Low | Task 01 |
| 07 | Create Account Directory | Low | Task 01 |
| 08 | Create Search Page Route | Low | Task 01 |
| 09 | Create Store Loading State | Low | Task 02 |
| 10 | Create Store Error Boundary | Low | Task 02 |
| 11 | Create Store Not Found Page | Low | Task 02 |
| 12 | Create Store Components Directory | Low | Task 01 |
| 13 | Create Shared Components Directory | Low | Task 01 |
| 14 | Verify Directory Structure | Low | Task 13 |

---

## Execution Order

```
Task 01: Create Storefront Route Group
    │
    ├──────────────────────────────────────────────────┐
    ▼                                                  │
Task 02: Create Store Root Layout                      │
    │                                                  │
    ├──────────┬──────────┬──────────┐                 │
    ▼          ▼          ▼          │                 │
Task 09    Task 10    Task 11       │                 │
(Loading)  (Error)    (Not Found)   │                 │
    │          │          │          │                 │
    └──────────┴──────────┘          │                 │
               │                     │                 │
    ┌──────────┴──────────┐          │                 │
    ▼                     │          │                 │
Task 03: Homepage         │          │                 │
    │                     │          │                 │
    ├──────────┬──────────┼──────────┼─────┬─────┐     │
    ▼          ▼          ▼          ▼     ▼     │     │
Task 04    Task 05    Task 06    Task 07  Task 08│     │
(Products) (Cart)    (Checkout) (Account)(Search)│     │
    │          │          │          │     │     │     │
    └──────────┴──────────┴──────────┴─────┘     │     │
               │                                 │     │
               └─────────────────────────────────┘     │
                          │                            │
                    ┌─────┴─────┐                      │
                    ▼           ▼                      │
              Task 12     Task 13                      │
            (Storefront) (Shared)                      │
                    │           │                      │
                    └─────┬─────┘                      │
                          ▼
                    Task 14: Verify
```

---

## Expected Deliverables

```
frontend/
├── app/
│   └── (storefront)/
│       ├── layout.tsx
│       ├── page.tsx
│       ├── loading.tsx
│       ├── error.tsx
│       ├── not-found.tsx
│       ├── products/
│       ├── cart/
│       ├── checkout/
│       ├── account/
│       └── search/
│           └── page.tsx
├── components/
│   ├── storefront/
│   └── shared/
```

---

## Notes for AI Agents

### Route Group Architecture
| Route Group | Path | Purpose |
|-------------|------|---------|
| (dashboard) | /app/(dashboard)/ | ERP Admin |
| (storefront) | /app/(storefront)/ | Customer Store |

### Store Routes (Tasks 03-08)
| Route | Path | Description |
|-------|------|-------------|
| Homepage | / | Store landing page |
| Products | /products | Product listing |
| Cart | /cart | Shopping cart |
| Checkout | /checkout | Checkout flow |
| Account | /account | Customer portal |
| Search | /search | Search results |

### Loading State (Task 09)
| Element | Content |
|---------|---------|
| Type | Full page skeleton |
| Animation | Pulse animation |
| Logo | Store logo centered |

### Error Boundary (Task 10)
| Element | Content |
|---------|---------|
| Message | "Something went wrong" |
| Retry | Try again button |
| Home | Back to home link |

### Not Found (Task 11)
| Element | Content |
|---------|---------|
| Code | 404 |
| Message | "Page not found" |
| Search | Search suggestion |
| Home | Back to home link |

### Component Directories (Tasks 12-13)
| Directory | Purpose |
|-----------|---------|
| /storefront/ | Store-only components |
| /shared/ | Shared ERP + Store |
