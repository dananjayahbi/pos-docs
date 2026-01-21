# Group B: Stock Levels Overview

> **Phase:** 07 - Frontend Infrastructure & ERP Dashboard  
> **SubPhase:** 09 - Inventory Management UI  
> **Group:** B of F  
> **Tasks Covered:** 15-32  
> **Group Goal:** Build stock levels overview page with summary cards, filters, and data table

---

## Navigation

- **↑ Parent:** [00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [Group-A_Inventory-Routes-Pages-Structure](../Group-A_Inventory-Routes-Pages-Structure/)
- **→ Next Group:** [Group-C_Stock-Movement-History](../Group-C_Stock-Movement-History/)

---

## Group Overview

This group creates the stock levels overview page with dashboard and table. Creates main stock overview page and header. Builds summary cards: total products tracked, low stock alert count, out of stock count, and total inventory valuation. Creates filter bar with product search (name/SKU), warehouse filter, and stock level filter (all, low, out, overstocked). Creates stock level table with columns for product, SKU, warehouse, available, reserved, and reorder point. Adds stock level visual indicator and actions cell. Implements sorting and pagination. Connects to inventory API.

### Key Outcomes

- Stock overview page component
- Stock overview header
- Stock summary cards
- Total products card
- Low stock alert card
- Out of stock card
- Total valuation card
- Stock filters bar
- Product search input
- Warehouse filter dropdown
- Stock level filter dropdown
- Stock level table
- Table columns defined
- Stock level indicator cell
- Stock actions cell
- Table sorting implemented
- Table pagination implemented
- Connected to inventory API

### Technology Context

- **Data Table:** TanStack Table
- **State:** TanStack Query useInventory
- **Cards:** Summary statistics
- **Visual:** Stock level indicators

---

## Documents in This Group

| # | Document | Description | Tasks Covered |
|---|----------|-------------|---------------|
| 01 | `01_Tasks-15-25_Overview-Cards-Filters.md` | Create overview page, cards, and filters | 15-25 |
| 02 | `02_Tasks-26-32_StockTable-API.md` | Create stock table and API connection | 26-32 |

---

## Task Summary

| Task # | Task Name | Complexity | Dependencies |
|--------|-----------|------------|--------------|
| 15 | Create Stock Overview Page | Low | Task 14 |
| 16 | Create Stock Overview Header | Low | Task 15 |
| 17 | Create Stock Summary Cards | Medium | Task 15 |
| 18 | Create Total Products Card | Low | Task 17 |
| 19 | Create Low Stock Alert Card | Low | Task 17 |
| 20 | Create Out of Stock Card | Low | Task 17 |
| 21 | Create Total Valuation Card | Low | Task 17 |
| 22 | Create Stock Filters Bar | Low | Task 15 |
| 23 | Create Product Search | Low | Task 22 |
| 24 | Create Warehouse Filter | Low | Task 22 |
| 25 | Create Stock Level Filter | Low | Task 22 |
| 26 | Create Stock Level Table | Medium | Task 15 |
| 27 | Define Stock Table Columns | Medium | Task 26 |
| 28 | Create Stock Level Cell | Low | Task 27 |
| 29 | Create Stock Actions Cell | Low | Task 27 |
| 30 | Implement Table Sorting | Medium | Task 26 |
| 31 | Implement Table Pagination | Medium | Task 26 |
| 32 | Connect to Inventory API | Medium | Task 31 |

---

## Execution Order

```
Task 15: Stock Overview Page
    │
    ├──────────────────────────────────────────────────┐
    ▼                                                  │
Task 16: Overview Header                               │
    │                                                  │
    ▼                                                  │
Task 17: Summary Cards                                 │
    │                                                  │
    ├──────────┬──────────┬──────────┬──────────┐      │
    ▼          ▼          ▼          ▼          │      │
Task 18    Task 19    Task 20    Task 21       │      │
(Total)    (Low)      (Out)      (Value)       │      │
    │          │          │          │          │      │
    └──────────┴──────────┴──────────┘          │      │
               │                                │      │
               ▼                                │      │
         Task 22: Filters Bar                   │      │
               │                                │      │
         ┌─────┼─────┬─────┐                    │      │
         ▼     ▼     ▼     │                    │      │
      Task 23 Task 24 Task 25                   │      │
      (Search) (Warehouse) (Level)              │      │
         │     │     │     │                    │      │
         └─────┴─────┴─────┘                    │      │
               │                                │      │
               └────────────────────────────────┘      │
                              │                        │
                              ▼                        │
                        Task 26: Stock Table           │
                              │                        │
                              ▼                        │
                        Task 27: Columns               │
                              │                        │
                        ┌─────┴─────┐                  │
                        ▼           ▼                  │
                     Task 28    Task 29                │
                     (Level)    (Actions)              │
                        │           │                  │
                        └─────┬─────┘                  │
                              │                        │
                        ┌─────┴─────┐                  │
                        ▼           ▼                  │
                     Task 30    Task 31                │
                     (Sort)     (Page)                 │
                        │           │                  │
                        └─────┬─────┘                  │
                              ▼
                        Task 32: API
```

---

## Expected Deliverables

```
frontend/
└── components/
    └── modules/
        └── inventory/
            └── StockOverview/
                ├── StockOverview.tsx
                ├── StockOverviewHeader.tsx
                ├── StockSummaryCards.tsx
                ├── TotalProductsCard.tsx
                ├── LowStockCard.tsx
                ├── OutOfStockCard.tsx
                ├── ValuationCard.tsx
                ├── StockFilters.tsx
                ├── StockTable.tsx
                ├── StockTableColumns.tsx
                ├── cells/
                │   ├── StockLevelCell.tsx
                │   └── StockActionsCell.tsx
                └── index.ts
```

---

## Notes for AI Agents

### Summary Cards (Task 17)
| Card | Icon | Value |
|------|------|-------|
| Total Products | Package | Count of tracked products |
| Low Stock | AlertTriangle | Count below reorder point |
| Out of Stock | XCircle | Count with 0 quantity |
| Total Value | DollarSign | Sum of stock value (LKR) |

### Stock Level Filter Options (Task 25)
| Option | Description |
|--------|-------------|
| All | All products |
| Low Stock | Below reorder point |
| Out of Stock | Quantity = 0 |
| Overstocked | Above max level |

### Stock Table Columns (Task 27)
| Column | Width | Sortable |
|--------|-------|----------|
| Product | 250px | Yes |
| SKU | 120px | Yes |
| Warehouse | 150px | Yes |
| Available | 100px | Yes |
| Reserved | 100px | No |
| Reorder Point | 100px | No |
| Status | 100px | No |
| Actions | 80px | No |

### Stock Level Cell (Task 28)
| Status | Color | Condition |
|--------|-------|-----------|
| In Stock | Green | qty > reorder_point |
| Low Stock | Yellow | 0 < qty <= reorder_point |
| Out of Stock | Red | qty = 0 |
| Overstocked | Blue | qty > max_level |

### Stock Actions Cell (Task 29)
| Action | Icon | Description |
|--------|------|-------------|
| Adjust | Edit | Quick adjustment |
| Transfer | ArrowLeftRight | Quick transfer |
| History | History | View movements |

### Valuation Card (Task 21)
- Calculate: SUM(quantity * cost_price)
- Format: LKR with commas
- Show trend vs last period
