# Group F: Dashboard Home Page

> **Phase:** 07 - Frontend Infrastructure & ERP Dashboard  
> **SubPhase:** 07 - Dashboard Layout  
> **Group:** F of F  
> **Tasks Covered:** 83-94  
> **Group Goal:** Create dashboard home page with KPIs, charts, quick actions, and activity feed

---

## Navigation

- **↑ Parent:** [00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [Group-E_Responsive-Design-Mobile](../Group-E_Responsive-Design-Mobile/)
- **→ Next Group:** None (Last Group) | **Next SubPhase:** [SubPhase-08_Product-Management-UI](../../SubPhase-08_Product-Management-UI/)

---

## Group Overview

This group creates the dashboard home page with business widgets. Creates main dashboard page at app/(dashboard)/page.tsx. Adds personalized welcome banner with user name. Creates KPI summary cards grid for key metrics: Sales KPI (today's amount, trend), Orders KPI (count, trend), Low Stock Alert (item count), and Pending Tasks (approval count). Creates quick actions grid with shortcut buttons. Adds recent activity feed listing business events. Creates sales chart widget (line/bar). Connects all widgets to API. Performs final verification and testing.

### Key Outcomes

- Dashboard home page
- Welcome banner
- KPI summary cards
- Sales KPI card
- Orders KPI card
- Low stock alert card
- Pending tasks card
- Quick actions grid
- Recent activity feed
- Sales chart widget
- API data connection
- Final verification complete

### Technology Context

- **Charts:** Recharts or Chart.js
- **Data:** TanStack Query hooks
- **Cards:** Shadcn Card components
- **Layout:** CSS Grid

---

## Documents in This Group

| # | Document | Description | Tasks Covered |
|---|----------|-------------|---------------|
| 01 | `01_Tasks-83-89_KPI-Cards.md` | Create dashboard page and KPI cards | 83-89 |
| 02 | `02_Tasks-90-94_Widgets-API.md` | Create widgets and connect to API | 90-94 |

---

## Task Summary

| Task # | Task Name | Complexity | Dependencies |
|--------|-----------|------------|--------------|
| 83 | Create Dashboard Home Page | Low | Task 14 |
| 84 | Create Welcome Banner | Low | Task 83 |
| 85 | Create KPI Summary Cards | Medium | Task 83 |
| 86 | Create Sales KPI Card | Low | Task 85 |
| 87 | Create Orders KPI Card | Low | Task 85 |
| 88 | Create Low Stock Alert Card | Low | Task 85 |
| 89 | Create Pending Tasks Card | Low | Task 85 |
| 90 | Create Quick Actions Grid | Low | Task 83 |
| 91 | Create Recent Activity Feed | Medium | Task 83 |
| 92 | Create Sales Chart Widget | Medium | Task 83 |
| 93 | Connect Dashboard to API | Medium | Task 92 |
| 94 | Final Verification & Testing | Low | Task 93 |

---

## Execution Order

```
Task 83: Dashboard Home Page
    │
    ├────────────────────────────────────────┐
    ▼                                        │
Task 84: Welcome Banner                      │
    │                                        │
    ▼                                        │
Task 85: KPI Summary Cards                   │
    │                                        │
    ├──────────┬──────────┬──────────┐       │
    ▼          ▼          ▼          ▼       │
Task 86    Task 87    Task 88    Task 89     │
(Sales)    (Orders)   (Stock)    (Tasks)     │
    │          │          │          │       │
    └──────────┴──────────┴──────────┘       │
               │                             │
    ┌──────────┼──────────┬──────────────────┤
    ▼          ▼          ▼                  │
Task 90    Task 91    Task 92                │
(Actions)  (Activity)  (Chart)               │
    │          │          │                  │
    └──────────┴──────────┘                  │
               │
               ▼
         Task 93: Connect API
               │
               ▼
         Task 94: Final Test
```

---

## Expected Deliverables

```
frontend/
├── app/
│   └── (dashboard)/
│       └── page.tsx
└── components/
    └── dashboard/
        ├── WelcomeBanner.tsx
        ├── KPICard.tsx
        ├── KPISummary.tsx
        ├── SalesKPI.tsx
        ├── OrdersKPI.tsx
        ├── LowStockAlert.tsx
        ├── PendingTasks.tsx
        ├── QuickActions.tsx
        ├── ActivityFeed.tsx
        ├── SalesChart.tsx
        └── index.ts
```

---

## Notes for AI Agents

### Dashboard Layout (Task 83)
- Grid layout for widgets
- Responsive columns
- Consistent spacing
- Loading skeletons

### Welcome Banner (Task 84)
| Element | Content |
|---------|---------|
| Greeting | Good morning, {firstName}! |
| Date | Today is {formattedDate} |
| Weather | Optional weather info |

### KPI Card Structure (Task 85)
| Element | Description |
|---------|-------------|
| Icon | Metric icon |
| Title | Metric name |
| Value | Current value |
| Trend | Up/down arrow + percentage |
| Period | vs. yesterday / last week |

### Sales KPI (Task 86)
| Field | Value |
|-------|-------|
| Title | Today's Sales |
| Value | LKR 245,000 |
| Trend | +12% vs yesterday |
| Icon | DollarSign |

### Orders KPI (Task 87)
| Field | Value |
|-------|-------|
| Title | Today's Orders |
| Value | 24 |
| Trend | +5 vs yesterday |
| Icon | ShoppingBag |

### Low Stock Alert (Task 88)
| Field | Value |
|-------|-------|
| Title | Low Stock Items |
| Value | 8 items |
| Action | View all link |
| Icon | AlertTriangle |
| Color | Warning (yellow) |

### Pending Tasks (Task 89)
| Field | Value |
|-------|-------|
| Title | Pending Approvals |
| Value | 3 tasks |
| Action | View all link |
| Icon | ClipboardList |

### Quick Actions (Task 90)
| Action | Icon | Path |
|--------|------|------|
| New Sale | Plus | /pos |
| Add Product | Package | /products/create |
| Create Invoice | FileText | /sales/invoices/create |
| Add Customer | UserPlus | /customers/create |

### Activity Feed (Task 91)
| Field | Description |
|-------|-------------|
| icon | Activity type icon |
| title | Activity title |
| description | Details |
| timestamp | Relative time |
| user | Who performed it |

### Sales Chart (Task 92)
| Config | Value |
|--------|-------|
| Type | Line or Bar |
| Period | Last 7 days |
| Data | Daily sales amounts |
| Axis | Date (x), Amount (y) |

### API Connection (Task 93)
| Widget | Endpoint |
|--------|----------|
| KPIs | /api/dashboard/kpis |
| Activity | /api/dashboard/activity |
| Chart | /api/dashboard/sales-chart |
