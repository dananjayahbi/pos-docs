# Group C: Inventory & Stock Models

> **Phase:** 02 - Database Architecture & Multi-Tenancy  
> **SubPhase:** 05 - Tenant Schema Template  
> **Group:** C of G  
> **Tasks Covered:** 31-44  
> **Group Goal:** Create inventory management and stock tracking models

---

## Navigation

- **↑ Parent:** [../00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [../Group-B_Product-Category-Models/](../Group-B_Product-Category-Models/)
- **→ Next Group:** [../Group-D_Customer-Supplier-Models/](../Group-D_Customer-Supplier-Models/)

---

## Group Overview

This group creates the inventory management system including stock locations (warehouses/stores), stock levels per product per location, and stock movement tracking for full audit trail.

### Key Outcomes
- StockLocation model created
- Location name field
- Location type field (warehouse, store)
- Location address fields
- Location active field
- Stock model for levels
- Stock product FK
- Stock location FK
- Stock quantity field
- Reorder level threshold
- StockMovement model
- Movement type field (in, out, transfer)
- Movement quantity field
- Movement reference field

### Technology Context
- **Multi-Location:** Support multiple warehouses/stores
- **Stock Levels:** Track per product per location
- **Movements:** Full audit trail of stock changes
- **Reorder:** Low stock alerts

---

## Documents in This Group

| # | Document | Tasks | Description |
|---|----------|-------|-------------|
| 01 | 01_Tasks-31-35_Stock-Location.md | 31-35 | StockLocation model, name, type, address, active |
| 02 | 02_Tasks-36-40_Stock-Levels.md | 36-40 | Stock model, product/location FKs, quantity, reorder level |
| 03 | 03_Tasks-41-44_Stock-Movement.md | 41-44 | StockMovement model, type, quantity, reference |

---

## Task Summary

| Task # | Task Name | Dependencies | Complexity |
|--------|-----------|--------------|------------|
| 31 | Create StockLocation Model | Task 11 | Medium |
| 32 | Add Location Name Field | Task 31 | Simple |
| 33 | Add Location Type Field | Task 31 | Simple |
| 34 | Add Location Address Fields | Task 31 | Simple |
| 35 | Add Location Active Field | Task 31 | Simple |
| 36 | Create Stock Model | Task 35 | Medium |
| 37 | Add Stock Product FK | Task 36 | Simple |
| 38 | Add Stock Location FK | Task 36 | Simple |
| 39 | Add Stock Quantity Field | Task 36 | Simple |
| 40 | Add Stock Reorder Level | Task 36 | Simple |
| 41 | Create StockMovement Model | Task 40 | Medium |
| 42 | Add Movement Type Field | Task 41 | Simple |
| 43 | Add Movement Quantity Field | Task 41 | Simple |
| 44 | Add Movement Reference Field | Task 41 | Simple |

---

## Execution Order

```
01_Tasks-31-35_Stock-Location.md
        │
        ▼
02_Tasks-36-40_Stock-Levels.md
        │
        ▼
03_Tasks-41-44_Stock-Movement.md
```

---

## Expected Deliverables

After completing this group:

```
backend/
└── apps/
    └── inventory/
        ├── models/
        │   ├── __init__.py
        │   ├── location.py       # StockLocation model
        │   ├── stock.py          # Stock model
        │   └── movement.py       # StockMovement model
        └── constants.py          # Location types, movement types
```

---

## Location Types

| Type | Description |
|------|-------------|
| WAREHOUSE | Central warehouse |
| STORE | Retail store |
| TRANSIT | In-transit location |
| VIRTUAL | Virtual/dropship |

---

## Movement Types

| Type | Description |
|------|-------------|
| IN | Stock received |
| OUT | Stock sold/consumed |
| TRANSFER | Between locations |
| ADJUSTMENT | Manual adjustment |
| RETURN | Customer return |

---

## Notes for AI Agents

1. **Dependencies:** Requires Group B complete (Product exists)
2. **Unique Constraint:** Stock unique on (product, location)
3. **Movement Audit:** Every stock change creates movement
4. **Reference:** Link to order/invoice/adjustment
5. **Reorder Alert:** Trigger when qty < reorder_level
6. **Git Commit:** Commit after completing this group

