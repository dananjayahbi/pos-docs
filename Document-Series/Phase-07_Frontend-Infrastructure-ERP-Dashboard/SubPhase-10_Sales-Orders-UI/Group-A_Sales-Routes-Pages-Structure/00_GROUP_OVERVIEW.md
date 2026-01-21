# Group A: Sales Routes & Pages Structure

> **Phase:** 07 - Frontend Infrastructure & ERP Dashboard  
> **SubPhase:** 10 - Sales & Orders UI  
> **Group:** A of F  
> **Tasks Covered:** 01-14  
> **Group Goal:** Set up sales module route structure with all pages, loading states, and error boundaries

---

## Navigation

- **↑ Parent:** [00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous Group:** None (First Group)
- **→ Next Group:** [Group-B_Order-Listing-Filters](../Group-B_Order-Listing-Filters/)

---

## Group Overview

This group creates the complete route structure for the sales management module. Sets up three main directories: orders/, invoices/, and quotes/. Creates orders layout with tabs. Creates routes for orders list, order details ([id]), and new order. Creates invoice list and invoice details ([id]) routes. Creates quotes list, quote details ([id]), and new quote routes. Configures SEO metadata for all sales pages. Creates loading states and error boundaries. Verifies all routes are accessible.

### Key Outcomes

- Sales route directories created (orders, invoices, quotes)
- Orders layout with tabs
- Orders list page route
- Order details page route
- New order page route
- Invoices list page route
- Invoice details page route
- Quotes list page route
- Quote details page route
- New quote page route
- Page metadata configured
- Loading states created
- Error boundaries created
- Route structure verified

### Technology Context

- **Routing:** Next.js App Router
- **Layout:** Shared orders layout
- **Dynamic Routes:** [id] for details pages
- **Loading:** Suspense with loading.tsx

---

## Documents in This Group

| # | Document | Description | Tasks Covered |
|---|----------|-------------|---------------|
| 01 | `01_Tasks-01-07_Sales-Routes.md` | Create sales route directories and pages | 01-07 |
| 02 | `02_Tasks-08-14_Quotes-Loading-Verify.md` | Create quotes routes, loading states, and verification | 08-14 |

---

## Task Summary

| Task # | Task Name | Complexity | Dependencies |
|--------|-----------|------------|--------------|
| 01 | Create Sales Route Directories | Low | SubPhase-07 |
| 02 | Create Orders Layout | Low | Task 01 |
| 03 | Create Orders List Page Route | Low | Task 01 |
| 04 | Create Order Details Page Route | Low | Task 01 |
| 05 | Create New Order Page Route | Low | Task 01 |
| 06 | Create Invoices List Page Route | Low | Task 01 |
| 07 | Create Invoice Details Page Route | Low | Task 06 |
| 08 | Create Quotes List Page Route | Low | Task 01 |
| 09 | Create Quote Details Page Route | Low | Task 08 |
| 10 | Create New Quote Page Route | Low | Task 08 |
| 11 | Configure Page Metadata | Low | Task 01 |
| 12 | Create Sales Loading States | Low | Task 01 |
| 13 | Create Sales Error Boundaries | Low | Task 01 |
| 14 | Verify Route Structure | Low | Task 13 |

---

## Execution Order

```
Task 01: Create Sales Route Directories
    │
    ├──────────────────────────────────────────────────┐
    ▼                                                  │
Task 02: Orders Layout                                 │
    │                                                  │
    ▼                                                  │
Task 03: Orders List Route                             │
    │                                                  │
    ▼                                                  │
Task 04: Order Details Route                           │
    │                                                  │
    ▼                                                  │
Task 05: New Order Route                               │
    │                                                  │
    ▼                                                  │
Task 06: Invoices List Route                           │
    │                                                  │
    ▼                                                  │
Task 07: Invoice Details Route                         │
    │                                                  │
    ▼                                                  │
Task 08: Quotes List Route                             │
    │                                                  │
    ▼                                                  │
Task 09: Quote Details Route                           │
    │                                                  │
    ▼                                                  │
Task 10: New Quote Route                               │
    │                                                  │
    └──────────────────────────────────────────────────┘
                          │
                    ┌─────┴─────┬─────┐
                    ▼           ▼     ▼
              Task 11     Task 12   Task 13
             (Metadata)  (Loading) (Error)
                    │           │     │
                    └─────┬─────┴─────┘
                          ▼
                    Task 14: Verify
```

---

## Expected Deliverables

```
frontend/
└── app/
    └── (dashboard)/
        ├── orders/
        │   ├── layout.tsx
        │   ├── page.tsx
        │   ├── loading.tsx
        │   ├── error.tsx
        │   ├── new/
        │   │   └── page.tsx
        │   └── [id]/
        │       └── page.tsx
        ├── invoices/
        │   ├── page.tsx
        │   ├── loading.tsx
        │   ├── error.tsx
        │   └── [id]/
        │       └── page.tsx
        └── quotes/
            ├── page.tsx
            ├── loading.tsx
            ├── error.tsx
            ├── new/
            │   └── page.tsx
            └── [id]/
                └── page.tsx
```

---

## Notes for AI Agents

### Orders Layout Tabs (Task 02)
| Tab | Path | Label |
|-----|------|-------|
| All Orders | /orders | All Orders |
| Pending | /orders?status=pending | Pending |
| Processing | /orders?status=processing | Processing |
| Shipped | /orders?status=shipped | Shipped |

### Order Routes (Tasks 03-05)
| Route | Page | Description |
|-------|------|-------------|
| /orders | List | Order listing with filters |
| /orders/new | Create | New order form |
| /orders/[id] | Details | Order details view |

### Invoice Routes (Tasks 06-07)
| Route | Page | Description |
|-------|------|-------------|
| /invoices | List | Invoice listing |
| /invoices/[id] | Details | Invoice view + PDF |

### Quote Routes (Tasks 08-10)
| Route | Page | Description |
|-------|------|-------------|
| /quotes | List | Quote listing |
| /quotes/new | Create | New quote form |
| /quotes/[id] | Details | Quote view + actions |

### Page Metadata (Task 11)
| Page | Title |
|------|-------|
| Orders | Orders - LCC |
| Invoices | Invoices - LCC |
| Quotes | Quotes - LCC |
| New Order | New Order - LCC |
| New Quote | New Quote - LCC |
