# Group B: Customer Listing & Filters

> **Phase:** 07 - Frontend Infrastructure & ERP Dashboard  
> **SubPhase:** 12 - Customer & Vendor UI  
> **Group:** B of F  
> **Tasks Covered:** 15-30  
> **Group Goal:** Build customer listing page with summary cards, filters, and data table

---

## Navigation

- **↑ Parent:** [00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [Group-A_CRM-Routes-Pages-Structure](../Group-A_CRM-Routes-Pages-Structure/)
- **→ Next Group:** [Group-C_Customer-Profile-360-View](../Group-C_Customer-Profile-360-View/)

---

## Group Overview

This group creates the customer listing page with comprehensive filtering. Creates main customers page and header with add customer action. Builds summary cards: total customers, active customers, and credit outstanding (LKR). Creates filter bar with customer search (name, phone, email), status filter (active/inactive), customer type filter, and credit status filter. Creates customers table with columns for name, phone, email, orders count, balance, and status. Adds customer actions cell. Implements table sorting. Connects to customers API.

### Key Outcomes

- Customers list page component
- Customers header with action
- Customer summary cards
- Total customers card
- Active customers card
- Credit outstanding card
- Customer filters bar
- Customer search input
- Status filter dropdown
- Type filter dropdown
- Credit status filter
- Customers table
- Table columns defined
- Customer actions cell
- Table sorting implemented
- Connected to customers API

### Technology Context

- **Data Table:** TanStack Table
- **State:** TanStack Query useCustomers
- **Cards:** Summary statistics
- **Currency:** LKR (Sri Lankan Rupees)

---

## Documents in This Group

| # | Document | Description | Tasks Covered |
|---|----------|-------------|---------------|
| 01 | `01_Tasks-15-25_Page-Cards-Filters.md` | Create customers page, cards, and filters | 15-25 |
| 02 | `02_Tasks-26-30_Table-API.md` | Create customers table and API connection | 26-30 |

---

## Task Summary

| Task # | Task Name | Complexity | Dependencies |
|--------|-----------|------------|--------------|
| 15 | Create Customers List Page | Low | Task 14 |
| 16 | Create Customers Header | Low | Task 15 |
| 17 | Create Customer Summary Cards | Medium | Task 15 |
| 18 | Create Total Customers Card | Low | Task 17 |
| 19 | Create Active Customers Card | Low | Task 17 |
| 20 | Create Credit Outstanding Card | Low | Task 17 |
| 21 | Create Customer Filters Bar | Low | Task 15 |
| 22 | Create Customer Search | Low | Task 21 |
| 23 | Create Status Filter | Low | Task 21 |
| 24 | Create Type Filter | Low | Task 21 |
| 25 | Create Credit Status Filter | Low | Task 21 |
| 26 | Create Customers Table | Medium | Task 15 |
| 27 | Define Customer Table Columns | Medium | Task 26 |
| 28 | Create Customer Actions Cell | Low | Task 27 |
| 29 | Implement Table Sorting | Medium | Task 26 |
| 30 | Connect to Customers API | Medium | Task 29 |

---

## Execution Order

```
Task 15: Customers List Page
    │
    ├──────────────────────────────────────────────────┐
    ▼                                                  │
Task 16: Customers Header                              │
    │                                                  │
    ▼                                                  │
Task 17: Summary Cards                                 │
    │                                                  │
    ├──────────┬──────────┬──────────┐                 │
    ▼          ▼          ▼          │                 │
Task 18    Task 19    Task 20       │                 │
(Total)    (Active)   (Credit)      │                 │
    │          │          │          │                 │
    └──────────┴──────────┘          │                 │
               │                     │                 │
               ▼                     │                 │
         Task 21: Filters Bar        │                 │
               │                     │                 │
         ┌─────┼─────┬─────┬─────┐   │                 │
         ▼     ▼     ▼     ▼     │   │                 │
      Task 22 Task 23 Task 24 Task 25                  │
      (Search) (Status) (Type) (Credit)                │
         │     │     │     │     │   │                 │
         └─────┴─────┴─────┴─────┘   │                 │
               │                     │                 │
               └─────────────────────┘                 │
                          │                            │
                          ▼                            │
                    Task 26: Customers Table           │
                          │                            │
                          ▼                            │
                    Task 27: Table Columns             │
                          │                            │
                          ▼                            │
                    Task 28: Actions Cell              │
                          │                            │
                          ▼                            │
                    Task 29: Sorting                   │
                          │                            │
                          ▼
                    Task 30: API
```

---

## Expected Deliverables

```
frontend/
└── components/
    └── modules/
        └── crm/
            └── Customers/
                ├── CustomersList.tsx
                ├── CustomersHeader.tsx
                ├── CustomerSummaryCards.tsx
                ├── TotalCustomersCard.tsx
                ├── ActiveCustomersCard.tsx
                ├── CreditOutstandingCard.tsx
                ├── CustomerFilters.tsx
                ├── CustomersTable.tsx
                ├── CustomerTableColumns.tsx
                ├── CustomerActionsCell.tsx
                └── index.ts
```

---

## Notes for AI Agents

### Summary Cards (Task 17)
| Card | Icon | Value |
|------|------|-------|
| Total Customers | Users | Count of all customers |
| Active | UserCheck | Count with active status |
| Credit Outstanding | CreditCard | Total outstanding (LKR) |

### Status Filter (Task 23)
| Option | Value |
|--------|-------|
| All | - |
| Active | active |
| Inactive | inactive |

### Type Filter (Task 24)
| Option | Value |
|--------|-------|
| All | - |
| Individual | individual |
| Business | business |
| Wholesale | wholesale |

### Credit Status Filter (Task 25)
| Option | Value |
|--------|-------|
| All | - |
| No Credit | no_credit |
| Good Standing | good |
| Near Limit | near_limit |
| Over Limit | over_limit |

### Customer Table Columns (Task 27)
| Column | Width | Sortable |
|--------|-------|----------|
| Name | 200px | Yes |
| Phone | 140px | No |
| Email | 200px | No |
| Orders | 80px | Yes |
| Balance (LKR) | 120px | Yes |
| Status | 100px | Yes |
| Actions | 80px | No |

### Customer Actions (Task 28)
| Action | Icon | Description |
|--------|------|-------------|
| View | Eye | Open profile |
| Edit | Pencil | Edit customer |
| Delete | Trash | Delete (if no orders) |
