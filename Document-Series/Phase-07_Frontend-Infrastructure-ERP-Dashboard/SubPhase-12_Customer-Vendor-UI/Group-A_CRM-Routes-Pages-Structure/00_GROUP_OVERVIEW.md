# Group A: CRM Routes & Pages Structure

> **Phase:** 07 - Frontend Infrastructure & ERP Dashboard  
> **SubPhase:** 12 - Customer & Vendor UI  
> **Group:** A of F  
> **Tasks Covered:** 01-14  
> **Group Goal:** Set up CRM module route structure with all pages, loading states, and error boundaries

---

## Navigation

- **↑ Parent:** [00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous Group:** None (First Group)
- **→ Next Group:** [Group-B_Customer-Listing-Filters](../Group-B_Customer-Listing-Filters/)

---

## Group Overview

This group creates the complete route structure for the CRM module. Sets up three main directories: customers/, vendors/, and purchase-orders/. Creates customer list, details ([id]), and new customer routes. Creates vendor list, details ([id]), and new vendor routes. Creates purchase order list, details ([id]), and new PO routes. Configures SEO metadata for all CRM pages. Creates loading states and error boundaries. Verifies all routes are accessible.

### Key Outcomes

- CRM route directories created (customers, vendors, purchase-orders)
- Customers list page route
- Customer details page route
- New customer page route
- Vendors list page route
- Vendor details page route
- New vendor page route
- Purchase orders list page route
- PO details page route
- New PO page route
- Page metadata configured
- Loading states created
- Error boundaries created
- Route structure verified

### Technology Context

- **Routing:** Next.js App Router
- **Dynamic Routes:** [id] for details pages
- **Loading:** Suspense with loading.tsx
- **Error:** Error boundary components

---

## Documents in This Group

| # | Document | Description | Tasks Covered |
|---|----------|-------------|---------------|
| 01 | `01_Tasks-01-07_Customer-Vendor-Routes.md` | Create customer and vendor routes | 01-07 |
| 02 | `02_Tasks-08-14_PO-Routes-Verify.md` | Create PO routes, loading, and verification | 08-14 |

---

## Task Summary

| Task # | Task Name | Complexity | Dependencies |
|--------|-----------|------------|--------------|
| 01 | Create CRM Route Directories | Low | SubPhase-07 |
| 02 | Create Customers List Page Route | Low | Task 01 |
| 03 | Create Customer Details Page Route | Low | Task 01 |
| 04 | Create New Customer Page Route | Low | Task 01 |
| 05 | Create Vendors List Page Route | Low | Task 01 |
| 06 | Create Vendor Details Page Route | Low | Task 05 |
| 07 | Create New Vendor Page Route | Low | Task 05 |
| 08 | Create Purchase Orders Page Route | Low | Task 01 |
| 09 | Create PO Details Page Route | Low | Task 08 |
| 10 | Create New PO Page Route | Low | Task 08 |
| 11 | Configure Page Metadata | Low | Task 01 |
| 12 | Create CRM Loading States | Low | Task 01 |
| 13 | Create CRM Error Boundaries | Low | Task 01 |
| 14 | Verify Route Structure | Low | Task 13 |

---

## Execution Order

```
Task 01: Create CRM Route Directories
    │
    ├──────────────────────────────────────────────────┐
    ▼                                                  │
Task 02: Customers List Route                          │
    │                                                  │
    ├──────────┬──────────┐                            │
    ▼          ▼          │                            │
Task 03    Task 04       │                            │
(Details)  (New)          │                            │
    │          │          │                            │
    └──────────┘          │                            │
               │          │                            │
               ▼          │                            │
         Task 05: Vendors List Route                   │
               │          │                            │
         ┌─────┴─────┐    │                            │
         ▼           ▼    │                            │
      Task 06    Task 07  │                            │
      (Details)  (New)    │                            │
         │           │    │                            │
         └─────┬─────┘    │                            │
               │          │                            │
               ▼          │                            │
         Task 08: PO List Route                        │
               │          │                            │
         ┌─────┴─────┐    │                            │
         ▼           ▼    │                            │
      Task 09    Task 10  │                            │
      (Details)  (New)    │                            │
         │           │    │                            │
         └─────┬─────┘    │                            │
               │          │                            │
               └──────────┴────────────────────────────┘
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
        ├── customers/
        │   ├── page.tsx
        │   ├── loading.tsx
        │   ├── error.tsx
        │   ├── new/
        │   │   └── page.tsx
        │   └── [id]/
        │       └── page.tsx
        ├── vendors/
        │   ├── page.tsx
        │   ├── loading.tsx
        │   ├── error.tsx
        │   ├── new/
        │   │   └── page.tsx
        │   └── [id]/
        │       └── page.tsx
        └── purchase-orders/
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

### Customer Routes (Tasks 02-04)
| Route | Page | Description |
|-------|------|-------------|
| /customers | List | Customer listing |
| /customers/new | Create | New customer form |
| /customers/[id] | Profile | Customer 360 view |

### Vendor Routes (Tasks 05-07)
| Route | Page | Description |
|-------|------|-------------|
| /vendors | List | Vendor listing |
| /vendors/new | Create | New vendor form |
| /vendors/[id] | Profile | Vendor details |

### Purchase Order Routes (Tasks 08-10)
| Route | Page | Description |
|-------|------|-------------|
| /purchase-orders | List | PO listing |
| /purchase-orders/new | Create | New PO form |
| /purchase-orders/[id] | Details | PO details |

### Page Metadata (Task 11)
| Page | Title |
|------|-------|
| Customers | Customers - LCC |
| Vendors | Vendors - LCC |
| Purchase Orders | Purchase Orders - LCC |
| New Customer | New Customer - LCC |
| New Vendor | New Vendor - LCC |
| New PO | New Purchase Order - LCC |
