# Group A: Stock Level Models

> **Phase:** 04 - ERP Core Modules Part 1  
> **SubPhase:** 09 - Inventory Management  
> **Group:** A of F  
> **Tasks Covered:** 01-18  
> **Group Goal:** Create core models for tracking stock quantities across warehouses and locations

---

## Navigation

- **↑ Parent:** [SubPhase-09 Summary](../00_TASKS_SUMMARY.md)
- **→ Next Group:** [Group B: Stock Movement Tracking](../Group-B_Stock-Movement-Tracking/)

---

## Group Overview

### Key Outcomes

1. **Stock Submodule Package** - Organized `apps/inventory/stock/` package structure
2. **Stock Status Constants** - Defined IN_STOCK, LOW_STOCK, OUT_OF_STOCK statuses
3. **StockLevel Model** - Core model tracking quantity by product/warehouse/location
4. **Quantity Fields** - Quantity, reserved_quantity, incoming_quantity, available_quantity
5. **Stock Level Manager** - Custom manager with get_for_product(), get_total_stock() methods
6. **Stock Status Property** - Dynamic status calculation based on quantity thresholds
7. **Negative Stock Prevention** - Validation to prevent negative quantities
8. **Stock Cost Tracking** - Weighted average cost per unit tracking
9. **StockLevel Admin** - Admin interface with filters and stock status indicators

### Technology Context

| Technology | Purpose |
|------------|---------|
| Django ORM | StockLevel model with unique_together constraints |
| PostgreSQL | Indexes on product, warehouse, variant, location |
| Django Signals | Update product's total_stock on level change |
| Model Managers | Custom manager for stock aggregation queries |

---

## Documents in This Group

| # | Document | Tasks | Description |
|---|----------|-------|-------------|
| 01 | `01_Tasks-01-05_Stock-Submodule-Level-Model.md` | 01-05 | Stock submodule, constants, StockLevel model, variant/location FKs |
| 02 | `02_Tasks-06-09_Quantity-Fields-Meta.md` | 06-09 | Reserved, available, incoming quantities, Meta class |
| 03 | `03_Tasks-10-13_Manager-Aggregation-Methods.md` | 10-13 | Model manager, get_available_by_warehouse, aggregation |
| 04 | `04_Tasks-14-18_Signals-Validation-Admin.md` | 14-18 | Signals, negative prevention, cost tracking, admin |

---

## Task Summary

| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 01 | Create stock submodule | Low | 10 min |
| 02 | Define stock status constants | Low | 10 min |
| 03 | Create StockLevel model | Medium | 30 min |
| 04 | Add variant FK option | Low | 20 min |
| 05 | Add location FK | Low | 15 min |
| 06 | Add reserved_quantity field | Low | 15 min |
| 07 | Add available_quantity property | Low | 15 min |
| 08 | Add incoming_quantity field | Low | 15 min |
| 09 | Create StockLevel Meta class | Medium | 20 min |
| 10 | Add StockLevel model manager | Medium | 25 min |
| 11 | Add get_available_by_warehouse | Medium | 25 min |
| 12 | Create stock status property | Medium | 20 min |
| 13 | Add last_updated tracking | Low | 10 min |
| 14 | Create StockLevel signals | Medium | 25 min |
| 15 | Add stock aggregation methods | Medium | 20 min |
| 16 | Create negative stock prevention | Medium | 20 min |
| 17 | Add stock cost tracking | Medium | 25 min |
| 18 | Create StockLevel admin | Medium | 25 min |

---

## Execution Order

```
[Task 01: Stock submodule package]
         │
         ▼
[Task 02: Stock status constants]
         │
         ▼
[Tasks 03-05: StockLevel model with variant/location FKs]
         │
         ▼
[Tasks 06-08: Quantity fields (reserved, available, incoming)]
         │
         ▼
[Task 09: StockLevel Meta class with constraints]
         │
         ▼
[Tasks 10-13: Manager, aggregation methods, status property]
         │
         ▼
[Tasks 14-15: Signals and stock aggregation]
         │
         ▼
[Tasks 16-18: Validation, cost tracking, admin]
```

---

## Expected Deliverables

```
apps/inventory/stock/
├── __init__.py
├── models/
│   ├── __init__.py
│   └── stock_level.py            # Tasks 03-17
├── constants.py                  # Task 02
├── signals.py                    # Task 14
└── admin.py                      # Task 18
```

---

## Notes for AI Agents

### Stock Level Calculation
- **quantity**: Physical stock on hand
- **reserved_quantity**: Stock reserved for pending orders
- **incoming_quantity**: Expected quantity from pending POs
- **available_quantity**: Calculated as `quantity - reserved_quantity`

### Unique Constraints
- Define unique_together on (product, variant, warehouse, location)
- Allow NULL variant and location for warehouse-level tracking
- Handle unique constraint with NULL values appropriately

### Stock Status Thresholds
- IN_STOCK: quantity > reorder_point
- LOW_STOCK: 0 < quantity <= reorder_point
- OUT_OF_STOCK: quantity <= 0

### Manager Methods
- `get_for_product(product, variant=None)`: Get stock levels for product
- `get_total_stock(product)`: Sum quantity across all warehouses
- `get_available_by_warehouse(product)`: Available stock per warehouse

### Dependencies
- SubPhase-04: Product Variants (Product/Variant FKs)
- SubPhase-08: Warehouse & Locations (Warehouse/Location FKs)
- Phase-03: Base models and mixins
