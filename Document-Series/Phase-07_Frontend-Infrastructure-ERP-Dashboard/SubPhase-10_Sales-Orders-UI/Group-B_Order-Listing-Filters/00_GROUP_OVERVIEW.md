# Group B: Order Listing & Filters

> **Phase:** 07 - Frontend Infrastructure & ERP Dashboard  
> **SubPhase:** 10 - Sales & Orders UI  
> **Group:** B of F  
> **Tasks Covered:** 15-32  
> **Group Goal:** Build order listing page with summary cards, advanced filters, and data table

---

## Navigation

- **↑ Parent:** [00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [Group-A_Sales-Routes-Pages-Structure](../Group-A_Sales-Routes-Pages-Structure/)
- **→ Next Group:** [Group-C_Order-Details-Timeline](../Group-C_Order-Details-Timeline/)

---

## Group Overview

This group creates the order listing page with comprehensive filtering. Creates main orders page and header with create order action. Builds summary cards: total orders, pending orders, shipped today, and revenue (LKR). Creates filter bar with order search (order number, customer), status filter, date range filter, and payment status filter (paid, partial, unpaid). Creates orders table with columns for order number, customer, date, items count, total, and status. Adds order status badge and actions cell. Implements table sorting. Connects to orders API.

### Key Outcomes

- Orders list page component
- Orders header with action
- Order summary cards
- Total orders card
- Pending orders card
- Shipped today card
- Revenue card (LKR)
- Order filters bar
- Order search input
- Status filter dropdown
- Date range filter
- Payment status filter
- Orders table
- Table columns defined
- Order status badge
- Order actions cell
- Table sorting implemented
- Connected to orders API

### Technology Context

- **Data Table:** TanStack Table
- **State:** TanStack Query useOrders
- **Cards:** Summary statistics
- **Currency:** LKR (Sri Lankan Rupees)

---

## Documents in This Group

| # | Document | Description | Tasks Covered |
|---|----------|-------------|---------------|
| 01 | `01_Tasks-15-26_Page-Cards-Filters.md` | Create orders page, cards, and filters | 15-26 |
| 02 | `02_Tasks-27-32_Table-API.md` | Create orders table and API connection | 27-32 |

---

## Task Summary

| Task # | Task Name | Complexity | Dependencies |
|--------|-----------|------------|--------------|
| 15 | Create Orders List Page | Low | Task 14 |
| 16 | Create Orders Header | Low | Task 15 |
| 17 | Create Order Summary Cards | Medium | Task 15 |
| 18 | Create Total Orders Card | Low | Task 17 |
| 19 | Create Pending Orders Card | Low | Task 17 |
| 20 | Create Shipped Today Card | Low | Task 17 |
| 21 | Create Revenue Card | Low | Task 17 |
| 22 | Create Order Filters Bar | Low | Task 15 |
| 23 | Create Order Search | Low | Task 22 |
| 24 | Create Status Filter | Low | Task 22 |
| 25 | Create Date Range Filter | Medium | Task 22 |
| 26 | Create Payment Status Filter | Low | Task 22 |
| 27 | Create Orders Table | Medium | Task 15 |
| 28 | Define Order Table Columns | Medium | Task 27 |
| 29 | Create Order Status Badge | Low | Task 28 |
| 30 | Create Order Actions Cell | Low | Task 28 |
| 31 | Implement Table Sorting | Medium | Task 27 |
| 32 | Connect to Orders API | Medium | Task 31 |

---

## Execution Order

```
Task 15: Orders List Page
    │
    ├──────────────────────────────────────────────────┐
    ▼                                                  │
Task 16: Orders Header                                 │
    │                                                  │
    ▼                                                  │
Task 17: Summary Cards                                 │
    │                                                  │
    ├──────────┬──────────┬──────────┬──────────┐      │
    ▼          ▼          ▼          ▼          │      │
Task 18    Task 19    Task 20    Task 21       │      │
(Total)    (Pending)  (Shipped)  (Revenue)     │      │
    │          │          │          │          │      │
    └──────────┴──────────┴──────────┘          │      │
               │                                │      │
               ▼                                │      │
         Task 22: Filters Bar                   │      │
               │                                │      │
         ┌─────┼─────┬─────┬─────┐              │      │
         ▼     ▼     ▼     ▼     │              │      │
      Task 23 Task 24 Task 25 Task 26           │      │
      (Search) (Status) (Date) (Payment)        │      │
         │     │     │     │     │              │      │
         └─────┴─────┴─────┴─────┘              │      │
               │                                │      │
               └────────────────────────────────┘      │
                              │                        │
                              ▼                        │
                        Task 27: Orders Table          │
                              │                        │
                              ▼                        │
                        Task 28: Columns               │
                              │                        │
                        ┌─────┴─────┐                  │
                        ▼           ▼                  │
                     Task 29    Task 30                │
                     (Badge)    (Actions)              │
                        │           │                  │
                        └─────┬─────┘                  │
                              ▼
                        Task 31: Sorting
                              │
                              ▼
                        Task 32: API
```

---

## Expected Deliverables

```
frontend/
└── components/
    └── modules/
        └── sales/
            └── Orders/
                ├── OrdersList.tsx
                ├── OrdersHeader.tsx
                ├── OrderSummaryCards.tsx
                ├── TotalOrdersCard.tsx
                ├── PendingOrdersCard.tsx
                ├── ShippedTodayCard.tsx
                ├── RevenueCard.tsx
                ├── OrderFilters.tsx
                ├── OrdersTable.tsx
                ├── OrderTableColumns.tsx
                ├── cells/
                │   ├── OrderStatusBadge.tsx
                │   └── OrderActionsCell.tsx
                └── index.ts
```

---

## Notes for AI Agents

### Summary Cards (Task 17)
| Card | Icon | Value |
|------|------|-------|
| Total Orders | Package | Count of all orders |
| Pending | Clock | Count with pending status |
| Shipped Today | Truck | Orders shipped today |
| Revenue | DollarSign | Today's revenue (LKR) |

### Status Filter Options (Task 24)
| Option | Value |
|--------|-------|
| All | - |
| Draft | draft |
| Confirmed | confirmed |
| Processing | processing |
| Shipped | shipped |
| Delivered | delivered |
| Cancelled | cancelled |

### Payment Status Filter (Task 26)
| Option | Value |
|--------|-------|
| All | - |
| Paid | paid |
| Partial | partial |
| Unpaid | unpaid |

### Order Table Columns (Task 28)
| Column | Width | Sortable |
|--------|-------|----------|
| Order # | 120px | Yes |
| Customer | 200px | Yes |
| Date | 120px | Yes |
| Items | 80px | No |
| Total (LKR) | 120px | Yes |
| Status | 100px | Yes |
| Payment | 100px | No |
| Actions | 80px | No |

### Order Status Badge (Task 29)
| Status | Color |
|--------|-------|
| Draft | Gray |
| Confirmed | Blue |
| Processing | Yellow |
| Shipped | Purple |
| Delivered | Green |
| Cancelled | Red |

### Order Actions Cell (Task 30)
| Action | Icon | Description |
|--------|------|-------------|
| View | Eye | Open order details |
| Edit | Pencil | Edit order |
| Print | Printer | Print order |
| Cancel | X | Cancel order |
