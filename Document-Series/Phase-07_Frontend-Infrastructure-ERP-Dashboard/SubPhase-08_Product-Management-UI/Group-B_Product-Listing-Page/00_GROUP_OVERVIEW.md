# Group B: Product Listing Page

> **Phase:** 07 - Frontend Infrastructure & ERP Dashboard  
> **SubPhase:** 08 - Product Management UI  
> **Group:** B of F  
> **Tasks Covered:** 15-34  
> **Group Goal:** Build product listing page with data table, filters, sorting, pagination, and bulk actions

---

## Navigation

- **↑ Parent:** [00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [Group-A_Product-Routes-Pages-Structure](../Group-A_Product-Routes-Pages-Structure/)
- **→ Next Group:** [Group-C_Product-Form-Creation](../Group-C_Product-Form-Creation/)

---

## Group Overview

This group creates the product listing page with full data table functionality. Creates main list page component and header with create button. Builds filter bar with search, status filter, category filter, stock filter, and clear filters button. Creates TanStack Table with columns: name with thumbnail, SKU, category, price (LKR), stock level with indicator, status badge, and actions. Implements server-side sorting and pagination. Adds row selection with checkboxes and bulk actions bar for delete and status update. Connects table to useProducts hook.

### Key Outcomes

- Product list page component
- Product list header
- Product filters bar
- Search input
- Status filter dropdown
- Category filter dropdown
- Stock filter dropdown
- Clear filters button
- Product data table
- Table columns defined
- Product name cell (thumbnail + name)
- Price cell (LKR formatted)
- Stock cell with indicator
- Status badge cell
- Actions cell (edit, delete, view)
- Table sorting implemented
- Table pagination implemented
- Row selection with checkboxes
- Bulk actions bar
- Table connected to API

### Technology Context

- **Data Table:** TanStack Table v8
- **State:** TanStack Query useProducts
- **Server-side:** Sorting, filtering, pagination
- **Bulk Actions:** Multi-select operations

---

## Documents in This Group

| # | Document | Description | Tasks Covered |
|---|----------|-------------|---------------|
| 01 | `01_Tasks-15-22_Page-Filters.md` | Create list page and filter components | 15-22 |
| 02 | `02_Tasks-23-34_DataTable-BulkActions.md` | Create data table and bulk actions | 23-34 |

---

## Task Summary

| Task # | Task Name | Complexity | Dependencies |
|--------|-----------|------------|--------------|
| 15 | Create Product List Page Component | Low | Task 14 |
| 16 | Create Product List Header | Low | Task 15 |
| 17 | Create Product Filters Bar | Low | Task 15 |
| 18 | Create Search Input | Low | Task 17 |
| 19 | Create Status Filter | Low | Task 17 |
| 20 | Create Category Filter | Low | Task 17 |
| 21 | Create Stock Filter | Low | Task 17 |
| 22 | Create Clear Filters Button | Low | Task 17 |
| 23 | Create Product Data Table | Medium | Task 15 |
| 24 | Define Product Table Columns | Medium | Task 23 |
| 25 | Create Product Name Cell | Low | Task 24 |
| 26 | Create Price Cell | Low | Task 24 |
| 27 | Create Stock Cell | Low | Task 24 |
| 28 | Create Status Badge Cell | Low | Task 24 |
| 29 | Create Actions Cell | Low | Task 24 |
| 30 | Implement Table Sorting | Medium | Task 23 |
| 31 | Implement Table Pagination | Medium | Task 23 |
| 32 | Implement Row Selection | Medium | Task 23 |
| 33 | Create Bulk Actions Bar | Medium | Task 32 |
| 34 | Connect Table to API | Medium | Task 31 |

---

## Execution Order

```
Task 15: Product List Page Component
    │
    ├──────────────────────────────────────────┐
    ▼                                          │
Task 16: List Header                           │
    │                                          │
    ▼                                          │
Task 17: Filters Bar                           │
    │                                          │
    ├──────────┬──────────┬──────────┬─────────┤
    ▼          ▼          ▼          ▼         │
Task 18    Task 19    Task 20    Task 21       │
(Search)   (Status)   (Category) (Stock)       │
    │          │          │          │         │
    └──────────┴──────────┴──────────┘         │
               │                               │
               ▼                               │
         Task 22: Clear Filters                │
               │                               │
               ▼                               │
         Task 23: Data Table                   │
               │                               │
               ▼                               │
         Task 24: Define Columns               │
               │                               │
    ┌──────────┼──────────┬──────────┬─────────┤
    ▼          ▼          ▼          ▼         ▼
Task 25    Task 26    Task 27    Task 28    Task 29
(Name)     (Price)    (Stock)    (Status)   (Actions)
    │          │          │          │          │
    └──────────┴──────────┴──────────┴──────────┘
               │
    ┌──────────┼──────────┬──────────┐
    ▼          ▼          ▼          │
Task 30    Task 31    Task 32       │
(Sorting)  (Pagination)(Selection)   │
    │          │          │          │
    │          │          ▼          │
    │          │     Task 33         │
    │          │     (Bulk Actions)  │
    │          │          │          │
    └──────────┴──────────┘          │
               │
               ▼
         Task 34: Connect API
```

---

## Expected Deliverables

```
frontend/
└── components/
    └── modules/
        └── products/
            └── ProductList/
                ├── ProductList.tsx
                ├── ProductListHeader.tsx
                ├── ProductFilters.tsx
                ├── ProductTable.tsx
                ├── ProductTableColumns.tsx
                ├── cells/
                │   ├── ProductNameCell.tsx
                │   ├── PriceCell.tsx
                │   ├── StockCell.tsx
                │   ├── StatusBadgeCell.tsx
                │   └── ActionsCell.tsx
                ├── BulkActionsBar.tsx
                └── index.ts
```

---

## Notes for AI Agents

### Filter Bar (Task 17)
| Filter | Type | Options |
|--------|------|---------|
| Search | Input | Name, SKU, description |
| Status | Select | Active, Draft, Archived |
| Category | Select | All categories |
| Stock | Select | All, Low Stock, Out of Stock |

### Table Columns (Task 24)
| Column | Width | Sortable |
|--------|-------|----------|
| Checkbox | 40px | No |
| Product | 300px | Yes (name) |
| SKU | 120px | Yes |
| Category | 150px | No |
| Price | 120px | Yes |
| Stock | 100px | Yes |
| Status | 100px | No |
| Actions | 80px | No |

### Product Name Cell (Task 25)
| Element | Description |
|---------|-------------|
| Thumbnail | 40x40 product image |
| Name | Product name (linked) |
| SKU | Small text below name |

### Price Cell (Task 26)
- Format as LKR with commas
- Right-aligned
- Example: LKR 2,500.00

### Stock Cell (Task 27)
| Level | Indicator |
|-------|-----------|
| Normal (>10) | Green dot |
| Low (1-10) | Yellow dot |
| Out (0) | Red dot |

### Status Badge (Task 28)
| Status | Color |
|--------|-------|
| Active | Green |
| Draft | Yellow |
| Archived | Gray |

### Actions Cell (Task 29)
| Action | Icon |
|--------|------|
| View | Eye |
| Edit | Pencil |
| Delete | Trash |

### Bulk Actions (Task 33)
| Action | Description |
|--------|-------------|
| Delete Selected | Delete multiple products |
| Set Active | Activate selected |
| Set Draft | Draft selected |
| Archive | Archive selected |
