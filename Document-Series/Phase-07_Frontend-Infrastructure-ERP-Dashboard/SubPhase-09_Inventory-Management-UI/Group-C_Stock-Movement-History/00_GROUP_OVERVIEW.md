# Group C: Stock Movement History

> **Phase:** 07 - Frontend Infrastructure & ERP Dashboard  
> **SubPhase:** 09 - Inventory Management UI  
> **Group:** C of F  
> **Tasks Covered:** 33-48  
> **Group Goal:** Build stock movement history page with timeline, table views, filters, and export

---

## Navigation

- **↑ Parent:** [00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [Group-B_Stock-Levels-Overview](../Group-B_Stock-Levels-Overview/)
- **→ Next Group:** [Group-D_Stock-Adjustments](../Group-D_Stock-Adjustments/)

---

## Group Overview

This group creates the stock movement history page with multiple views. Creates movements page and header with export action. Builds filter toolbar with date range, movement type (in/out/adjustment/transfer), product filter, and warehouse filter. Creates timeline view with movement items showing direction icons. Creates alternative table view with columns for date, product, type, quantity, reference, and user. Adds view toggle between timeline and table. Creates movement detail modal. Connects to movements API. Implements export to CSV/Excel.

### Key Outcomes

- Movements page component
- Movements header with export
- Movements filter toolbar
- Date range filter
- Movement type filter
- Product filter
- Warehouse filter
- Timeline view
- Timeline item component
- Movement direction icon
- Table view alternative
- Movement table columns
- View toggle (timeline/table)
- Movement detail modal
- Connected to movements API
- Export movements function

### Technology Context

- **Timeline:** Vertical timeline layout
- **Table:** TanStack Table
- **Filters:** Date range picker
- **Export:** CSV/Excel download

---

## Documents in This Group

| # | Document | Description | Tasks Covered |
|---|----------|-------------|---------------|
| 01 | `01_Tasks-33-42_Filters-Timeline.md` | Create filters and timeline view | 33-42 |
| 02 | `02_Tasks-43-48_Table-Modal-Export.md` | Create table view, modal, and export | 43-48 |

---

## Task Summary

| Task # | Task Name | Complexity | Dependencies |
|--------|-----------|------------|--------------|
| 33 | Create Movements Page | Low | Task 14 |
| 34 | Create Movements Header | Low | Task 33 |
| 35 | Create Movements Filters | Medium | Task 33 |
| 36 | Create Date Range Filter | Medium | Task 35 |
| 37 | Create Movement Type Filter | Low | Task 35 |
| 38 | Create Product Filter | Low | Task 35 |
| 39 | Create Warehouse Filter | Low | Task 35 |
| 40 | Create Movements Timeline | Medium | Task 33 |
| 41 | Create Movement Timeline Item | Medium | Task 40 |
| 42 | Create Movement Direction Icon | Low | Task 41 |
| 43 | Create Movements Table View | Medium | Task 33 |
| 44 | Define Movement Table Columns | Medium | Task 43 |
| 45 | Create View Toggle | Low | Task 43 |
| 46 | Create Movement Detail Modal | Medium | Task 41 |
| 47 | Connect to Movements API | Medium | Task 44 |
| 48 | Create Export Movements | Medium | Task 47 |

---

## Execution Order

```
Task 33: Movements Page
    │
    ├──────────────────────────────────────────────────┐
    ▼                                                  │
Task 34: Movements Header                              │
    │                                                  │
    ▼                                                  │
Task 35: Movements Filters                             │
    │                                                  │
    ├──────────┬──────────┬──────────┬──────────┐      │
    ▼          ▼          ▼          ▼          │      │
Task 36    Task 37    Task 38    Task 39       │      │
(Date)     (Type)     (Product)  (Warehouse)   │      │
    │          │          │          │          │      │
    └──────────┴──────────┴──────────┘          │      │
               │                                │      │
               └────────────────────────────────┘      │
                              │                        │
               ┌──────────────┴──────────────┐         │
               ▼                             ▼         │
         Task 40: Timeline            Task 43: Table   │
               │                             │         │
               ▼                             ▼         │
         Task 41: Item                Task 44: Columns │
               │                             │         │
               ▼                             │         │
         Task 42: Icon                       │         │
               │                             │         │
               ▼                             │         │
         Task 46: Modal                      │         │
               │                             │         │
               └──────────────┬──────────────┘         │
                              ▼
                        Task 45: Toggle
                              │
                              ▼
                        Task 47: API
                              │
                              ▼
                        Task 48: Export
```

---

## Expected Deliverables

```
frontend/
└── components/
    └── modules/
        └── inventory/
            └── Movements/
                ├── MovementsPage.tsx
                ├── MovementsHeader.tsx
                ├── MovementsFilters.tsx
                ├── MovementsTimeline.tsx
                ├── MovementTimelineItem.tsx
                ├── MovementDirectionIcon.tsx
                ├── MovementsTable.tsx
                ├── MovementTableColumns.tsx
                ├── ViewToggle.tsx
                ├── MovementDetailModal.tsx
                └── index.ts
```

---

## Notes for AI Agents

### Date Range Filter (Task 36)
| Preset | Range |
|--------|-------|
| Today | Current day |
| Yesterday | Previous day |
| Last 7 days | Past week |
| Last 30 days | Past month |
| This month | Current month |
| Custom | Date picker |

### Movement Type Filter (Task 37)
| Type | Icon | Description |
|------|------|-------------|
| All | - | All movements |
| In | ArrowDown | Stock received |
| Out | ArrowUp | Stock sold/used |
| Adjustment | Edit | Manual correction |
| Transfer | ArrowLeftRight | Warehouse transfer |

### Timeline Item (Task 41)
| Element | Content |
|---------|---------|
| Icon | Direction icon (in/out) |
| Title | Product name + quantity |
| Type | Movement type badge |
| Reference | Reference number |
| User | Who performed it |
| Time | Relative timestamp |

### Direction Icon (Task 42)
| Direction | Icon | Color |
|-----------|------|-------|
| In | ArrowDown | Green |
| Out | ArrowUp | Red |
| Adjustment+ | Plus | Green |
| Adjustment- | Minus | Red |
| Transfer | ArrowLeftRight | Blue |

### Movement Table Columns (Task 44)
| Column | Width | Sortable |
|--------|-------|----------|
| Date/Time | 150px | Yes |
| Product | 200px | Yes |
| Type | 100px | Yes |
| Quantity | 100px | Yes |
| Reference | 150px | No |
| Warehouse | 120px | Yes |
| User | 120px | No |
| Actions | 60px | No |

### View Toggle (Task 45)
| View | Icon | Description |
|------|------|-------------|
| Timeline | List | Chronological |
| Table | Table2 | Tabular data |

### Movement Detail Modal (Task 46)
| Section | Content |
|---------|---------|
| Header | Type + Reference |
| Product | Name, SKU, image |
| Details | Before, After, Change |
| Meta | Date, User, Notes |

### Export Options (Task 48)
| Format | Extension |
|--------|-----------|
| CSV | .csv |
| Excel | .xlsx |
