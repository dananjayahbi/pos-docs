# Group B: Dashboard & Orders

> **Phase:** 08 - Webstore & E-Commerce Platform  
> **SubPhase:** 09 - Customer Portal  
> **Group:** B of F  
> **Tasks Covered:** 17-36  
> **Group Goal:** Create dashboard overview and orders list with filtering and pagination

---

## Navigation

- **↑ Parent:** [00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [Group-A_Portal-Routes-Layout](../Group-A_Portal-Routes-Layout/)
- **→ Next Group:** [Group-C_Order-Details-Tracking](../Group-C_Order-Details-Tracking/)

---

## Group Overview

This group creates the dashboard and orders list. Creates dashboard page with welcome card, stats summary showing order and wishlist counts, recent orders preview, and quick action buttons. Creates loading skeleton for dashboard. Creates orders page with header, status filter, and paginated order list. Creates order card showing date, status badge, total in LKR, and view button. Creates empty orders state with start shopping CTA. Verifies orders list display and interactions.

### Key Outcomes

- Dashboard page
- Welcome card
- Stats summary
- Recent orders card
- View all orders link
- Quick actions
- Dashboard loading skeleton
- Orders page
- Orders header
- Orders status filter
- Orders list
- Order card
- Order date display
- Order status badge
- Order total (LKR)
- View order button
- Orders pagination
- Empty orders state
- Start shopping CTA
- Orders list verified

### Technology Context

- **Data:** TanStack Query
- **Stats:** Order counts
- **Filter:** Status tabs
- **Pagination:** Cursor or offset

---

## Documents in This Group

| # | Document | Description | Tasks Covered |
|---|----------|-------------|---------------|
| 01 | `01_Tasks-17-23_Dashboard.md` | Create dashboard components | 17-23 |
| 02 | `02_Tasks-24-36_Orders-List.md` | Create orders list components | 24-36 |

---

## Task Summary

| Task # | Task Name | Complexity | Dependencies |
|--------|-----------|------------|--------------|
| 17 | Create Dashboard Page | Low | Task 16 |
| 18 | Create Welcome Card | Low | Task 17 |
| 19 | Create Stats Summary | Medium | Task 17 |
| 20 | Create Recent Orders Card | Medium | Task 17 |
| 21 | Create View All Orders Link | Low | Task 20 |
| 22 | Create Quick Actions | Low | Task 17 |
| 23 | Create Dashboard Loading | Low | Task 17 |
| 24 | Create Orders Page | Low | Task 16 |
| 25 | Create Orders Header | Low | Task 24 |
| 26 | Create Orders Filter | Medium | Task 24 |
| 27 | Create Orders List | Medium | Task 24 |
| 28 | Create Order Card | Medium | Task 27 |
| 29 | Create Order Date | Low | Task 28 |
| 30 | Create Order Status Badge | Low | Task 28 |
| 31 | Create Order Total | Low | Task 28 |
| 32 | Create View Order Button | Low | Task 28 |
| 33 | Create Orders Pagination | Medium | Task 27 |
| 34 | Create Empty Orders State | Low | Task 27 |
| 35 | Create Start Shopping CTA | Low | Task 34 |
| 36 | Verify Orders List | Low | Task 35 |

---

## Execution Order

```
Task 17: Dashboard Page
    │
    ├────────┬────────┬────────┬────────┐
    ▼        ▼        ▼        ▼        │
T-18     T-19     T-20     T-22     T-23
(Welcome)(Stats) (Recent)(Quick) (Load)
    │        │        │        │        │
    │        │        ▼        │        │
    │        │     T-21        │        │
    │        │  (View All)     │        │
    │        │        │        │        │
    └────────┴────────┴────────┴────────┘
                   │
Task 24: Orders Page
    │
    ├────────┬────────┐
    ▼        ▼        │
T-25     T-26     T-27
(Header)(Filter) (List)
    │        │        │
    │        │   ┌────┴────┬────────┐
    │        │   ▼         ▼        │
    │        │ T-28      T-33    T-34
    │        │ (Card)   (Pagi)  (Empty)
    │        │   │         │        │
    │        │ ┌─┴──┬──┬──┐│        ▼
    │        │ ▼   ▼  ▼  ▼││     T-35
    │        │T-29 30 31 32││    (CTA)
    │        │(Date)(Sta)(Tot)(View)   │
    │        │ │   │  │  │ │        │
    └────────┴─┴───┴──┴──┴─┴────────┘
                   │
                   ▼
             Task 36: Verify
```

---

## Expected Deliverables

```
frontend/
├── components/
│   └── storefront/
│       └── portal/
│           ├── Dashboard/
│           │   ├── Dashboard.tsx
│           │   ├── WelcomeCard.tsx
│           │   ├── StatsSummary.tsx
│           │   ├── RecentOrders.tsx
│           │   ├── QuickActions.tsx
│           │   ├── DashboardSkeleton.tsx
│           │   └── index.ts
│           └── Orders/
│               ├── OrdersPage.tsx
│               ├── OrdersHeader.tsx
│               ├── OrdersFilter.tsx
│               ├── OrdersList.tsx
│               ├── OrderCard.tsx
│               ├── OrderDate.tsx
│               ├── OrderStatusBadge.tsx
│               ├── OrderTotal.tsx
│               ├── OrdersPagination.tsx
│               ├── EmptyOrders.tsx
│               └── index.ts
└── services/
    └── storefront/
        └── portal/
            └── orderService.ts
```

---

## Notes for AI Agents

### Dashboard Page (Task 17)
| Section | Order |
|---------|-------|
| 1 | Welcome card |
| 2 | Stats summary |
| 3 | Recent orders |
| 4 | Quick actions |

### Welcome Card (Task 18)
| Element | Content |
|---------|---------|
| Greeting | "Welcome back, [Name]!" |
| Message | "Here's what's happening" |
| Style | Large card, accent bg |

### Stats Summary (Task 19)
| Stat | Icon | Description |
|------|------|-------------|
| Total Orders | Package | All-time orders |
| Pending | Clock | Orders in progress |
| Wishlist | Heart | Saved items |
| Reviews | Star | Reviews written |

### Recent Orders (Task 20)
| Feature | Value |
|---------|-------|
| Count | 3 most recent |
| Display | Compact list |
| Empty | "No orders yet" |
| Link | View all |

### Quick Actions (Task 22)
| Action | Icon | Link |
|--------|------|------|
| Browse Products | ShoppingBag | /products |
| View Cart | ShoppingCart | /cart |
| Track Order | Package | /account/orders |

### Orders Filter (Task 26)
| Status | Filter |
|--------|--------|
| All | Show all |
| Pending | Processing orders |
| Shipped | In transit |
| Delivered | Completed |
| Cancelled | Cancelled orders |

### Order Card (Task 28)
| Element | Position |
|---------|----------|
| Order # | Top left |
| Date | Below order # |
| Status badge | Top right |
| Items count | Middle |
| Total | Bottom left |
| View button | Bottom right |

### Order Status Badge (Task 30)
| Status | Color |
|--------|-------|
| Pending | Yellow |
| Confirmed | Blue |
| Shipped | Purple |
| Delivered | Green |
| Cancelled | Red |

### Order Total (Task 31)
| Format | Example |
|--------|---------|
| Currency | ₨5,000 |
| Style | Bold text |

### Orders Pagination (Task 33)
| Feature | Value |
|---------|-------|
| Per page | 10 orders |
| Controls | Prev, Next, Pages |
| Style | Bottom center |
