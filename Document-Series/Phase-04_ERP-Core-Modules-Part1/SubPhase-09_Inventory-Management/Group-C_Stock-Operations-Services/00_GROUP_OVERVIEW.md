# Group C: Stock Operations Services

> **Phase:** 04 - ERP Core Modules Part 1  
> **SubPhase:** 09 - Inventory Management  
> **Group:** C of F  
> **Tasks Covered:** 37-56  
> **Group Goal:** Implement business logic services for all stock operations

---

## Navigation

- **↑ Parent:** [SubPhase-09 Summary](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [Group B: Stock Movement Tracking](../Group-B_Stock-Movement-Tracking/)
- **→ Next Group:** [Group D: Stock Take & Adjustments](../Group-D_Stock-Take-Adjustments/)

---

## Group Overview

### Key Outcomes

1. **StockService Base Class** - Abstract service with common operation methods
2. **Stock In Operation** - Add stock to warehouse with movement tracking
3. **Stock Out Operation** - Remove stock with availability validation
4. **Stock Transfer Operation** - Move stock between warehouses with transit state
5. **Reserve/Release Operations** - Manage reserved quantities for orders
6. **Commit Reserved Operation** - Convert reserved to sold on order completion
7. **StockAdjustmentService** - Service for manual corrections with authorization
8. **Batch Operations** - Process multiple operations in single transaction
9. **FIFO/LIFO Support** - Track lot/batch for costing methods
10. **Weighted Average Cost** - Calculate and update on stock in

### Technology Context

| Technology | Purpose |
|------------|---------|
| Django ORM | Transaction-safe stock operations with select_for_update |
| Django Signals | Emit events for external system integration |
| Celery | Async processing for batch operations |
| Decimal | Precise cost calculations |

---

## Documents in This Group

| # | Document | Tasks | Description |
|---|----------|-------|-------------|
| 01 | `01_Tasks-37-42_Stock-Service-In-Out-Transfer.md` | 37-42 | StockService base, stock_in, stock_out, transfer operations |
| 02 | `02_Tasks-43-48_Transit-Reserve-Release-Adjustment.md` | 43-48 | In-transit handling, reserve/release/commit, adjustment service |
| 03 | `03_Tasks-49-52_Authorization-Batch-Operations.md` | 49-52 | Adjustment authorization, batch operations, result model |
| 04 | `04_Tasks-53-56_Logging-Events-Costing.md` | 53-56 | Operation logging, events, FIFO/LIFO, weighted average cost |

---

## Task Summary

| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 37 | Create StockService base class | Medium | 25 min |
| 38 | Implement stock_in operation | Medium | 30 min |
| 39 | Implement stock_out operation | Medium | 30 min |
| 40 | Validate stock availability | Medium | 20 min |
| 41 | Implement stock_transfer operation | High | 35 min |
| 42 | Create transfer validation | Medium | 25 min |
| 43 | Handle in-transit stock | High | 30 min |
| 44 | Implement reserve_stock operation | Medium | 25 min |
| 45 | Implement release_stock operation | Medium | 20 min |
| 46 | Implement commit_reserved operation | Medium | 25 min |
| 47 | Create StockAdjustmentService | Medium | 30 min |
| 48 | Implement positive_adjustment | Medium | 25 min |
| 49 | Implement negative_adjustment | Medium | 25 min |
| 50 | Require adjustment authorization | Medium | 25 min |
| 51 | Create batch stock operations | High | 30 min |
| 52 | Add operation result model | Medium | 20 min |
| 53 | Create stock operation logging | Medium | 20 min |
| 54 | Add stock operation events | Medium | 25 min |
| 55 | Implement FIFO/LIFO support | High | 35 min |
| 56 | Create weighted average cost calc | High | 30 min |

---

## Execution Order

```
[Task 37: StockService base class]
         │
         ▼
[Tasks 38-40: Stock in/out operations with validation]
         │
         ▼
[Tasks 41-43: Transfer operations with in-transit handling]
         │
         ▼
[Tasks 44-46: Reserve, release, commit operations]
         │
         ▼
[Tasks 47-50: Adjustment service with authorization]
         │
         ▼
[Tasks 51-52: Batch operations and result model]
         │
         ▼
[Tasks 53-54: Logging and events]
         │
         ▼
[Tasks 55-56: FIFO/LIFO and weighted average cost]
```

---

## Expected Deliverables

```
apps/inventory/stock/
├── services/
│   ├── __init__.py
│   ├── stock_service.py          # Tasks 37-46
│   ├── adjustment_service.py     # Tasks 47-50
│   ├── batch_operations.py       # Task 51
│   ├── costing.py                # Tasks 55-56
│   └── results.py                # Task 52
└── signals.py                    # Task 54 (events)
```

---

## Notes for AI Agents

### Stock Operation Flow (Order Lifecycle)
1. **Order Placement**: Check available_quantity >= order_qty
2. **Reserve Stock**: reserve_stock(product, qty) - reserved_quantity += qty
3. **Order Completed**: commit_reserved(product, qty) - quantity -= qty, reserved_quantity -= qty
4. **Order Cancelled**: release_stock(product, qty) - reserved_quantity -= qty

### Transfer Flow
1. **Source Warehouse**: transfer_out() - quantity -= qty
2. **In Transit**: Create TRANSFER_IN_TRANSIT state (optional)
3. **Destination Warehouse**: transfer_in() - quantity += qty

### Concurrency Handling
- Use `select_for_update()` to prevent race conditions
- Wrap all operations in `transaction.atomic()`
- Check availability again after acquiring lock

### Adjustment Authorization
- Define threshold for auto-approval (e.g., 5 units or 2%)
- Require manager approval for larger adjustments
- Log all adjustments with reason and approver

### Weighted Average Cost Formula
```
new_avg_cost = (old_qty * old_cost + new_qty * new_cost) / (old_qty + new_qty)
```

### Operation Result Model
- success: Boolean
- message: String
- movement_id: Reference to created movement
- new_quantity: Updated stock quantity
- errors: List of error details
