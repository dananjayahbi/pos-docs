# SubPhase-09: Inventory Management - Tasks Summary

> **Phase:** 04 - ERP Core Modules Part 1  
> **SubPhase:** 09 of 10  
> **SubPhase Goal:** Implement complete inventory tracking with stock movements and adjustments  
> **Total Tasks:** 92 | **Status:** Planning

---

## Navigation

- **↑ Parent:** [Phase-04 Summary](../00_SUBPHASES_SUMMARY.md)
- **← Previous SubPhase:** [SubPhase-08: Warehouse & Locations](../SubPhase-08_Warehouse-Locations/)
- **→ Next SubPhase:** [SubPhase-10: Stock Alerts & Reordering](../SubPhase-10_Stock-Alerts-Reordering/)

---

## SubPhase Overview

This sub-phase implements the complete inventory management system for LankaCommerce Cloud. The system tracks stock levels across multiple warehouses and locations, records all stock movements with full audit trail, supports stock transfers between warehouses, handles adjustments and corrections, and provides stock take (physical counting) functionality. This is the core of inventory control for both ERP and POS operations.

### Key Outcomes
- StockLevel model tracking quantity by product/warehouse
- StockMovement model for complete movement audit trail
- Stock operations: IN, OUT, TRANSFER, ADJUSTMENT, RESERVED
- Stock take functionality with variance tracking
- Reserved quantity management for orders
- Real-time stock availability calculations

### Dependencies
- SubPhase-04: Product Variants (Product/Variant FKs)
- SubPhase-08: Warehouse & Locations (Warehouse/Location FKs)
- Phase-03: Base models, signals, Celery for async operations

---

## Execution Flow Diagram

```
[Group A: Stock Level Models]
         │
         ▼
[Group B: Stock Movement Tracking]
         │
         ▼
[Group C: Stock Operations Services]
         │
         ▼
[Group D: Stock Take & Adjustments]
         │
         ▼
[Group E: Serializers & API Views]
         │
         ▼
[Group F: Testing & Documentation]
```

---

## Task Index

### Group A: Stock Level Models (Tasks 01-18)

Core models for tracking stock quantities.

| Task # | Task Name | Description | Est. Time |
|--------|-----------|-------------|-----------|
| 01 | Create stock submodule | Create `apps/inventory/stock/` package with __init__.py | 10 min |
| 02 | Define stock status constants | Create constants for IN_STOCK, LOW_STOCK, OUT_OF_STOCK | 10 min |
| 03 | Create StockLevel model | Define model with product FK, warehouse FK, quantity fields | 30 min |
| 04 | Add variant FK option | Add optional variant FK for variant-level stock tracking | 20 min |
| 05 | Add location FK | Add optional storage_location FK for bin-level tracking | 15 min |
| 06 | Add reserved_quantity field | Track quantity reserved for pending orders | 15 min |
| 07 | Add available_quantity property | Calculate: quantity - reserved_quantity | 15 min |
| 08 | Add incoming_quantity field | Track expected quantity from pending POs | 15 min |
| 09 | Create StockLevel Meta class | Define unique_together (product, variant, warehouse, location), indexes | 20 min |
| 10 | Add StockLevel model manager | Create manager with get_for_product(), get_total_stock() methods | 25 min |
| 11 | Add get_available_by_warehouse | Return available stock grouped by warehouse | 25 min |
| 12 | Create stock status property | Return status based on quantity vs thresholds | 20 min |
| 13 | Add last_updated tracking | Auto-update timestamp on any stock change | 10 min |
| 14 | Create StockLevel signals | Signal to update product's total_stock on level change | 25 min |
| 15 | Add stock aggregation methods | Sum stock across all warehouses for product | 20 min |
| 16 | Create negative stock prevention | Validate quantity >= 0 (or allow based on settings) | 20 min |
| 17 | Add stock cost tracking | Track weighted average cost per unit at each level | 25 min |
| 18 | Create StockLevel admin | Register admin with filters, search, stock status indicators | 25 min |

---

### Group B: Stock Movement Tracking (Tasks 19-36)

Complete movement history for audit trail.

| Task # | Task Name | Description | Est. Time |
|--------|-----------|-------------|-----------|
| 19 | Define movement type constants | Create constants: STOCK_IN, STOCK_OUT, TRANSFER, ADJUSTMENT, RESERVED, RELEASED | 10 min |
| 20 | Define movement reason constants | Create constants: PURCHASE, SALE, RETURN, DAMAGE, THEFT, CORRECTION, EXPIRED | 15 min |
| 21 | Create StockMovement model | Define model with product FK, quantity, movement_type fields | 30 min |
| 22 | Add variant FK | Add optional variant FK for variant-level movements | 15 min |
| 23 | Add source warehouse FK | Add from_warehouse FK (nullable for stock IN) | 15 min |
| 24 | Add destination warehouse FK | Add to_warehouse FK (nullable for stock OUT) | 15 min |
| 25 | Add location FKs | Add from_location, to_location for bin-level tracking | 20 min |
| 26 | Add reason field | Add movement_reason for categorization | 15 min |
| 27 | Add reference fields | Add reference_type (ORDER, PO, ADJUSTMENT) and reference_id | 20 min |
| 28 | Add notes field | Add notes TextField for additional context | 10 min |
| 29 | Add cost_per_unit field | Track cost at time of movement | 15 min |
| 30 | Add created_by FK | Track user who created the movement | 15 min |
| 31 | Create StockMovement Meta class | Define indexes on product, warehouse, created_at, ordering by -created_at | 15 min |
| 32 | Add StockMovement manager | Create manager with filter methods by type, date range, product | 25 min |
| 33 | Create movement validation | Validate quantity > 0, appropriate warehouses for type | 25 min |
| 34 | Add movement reversal support | Create reverse_movement() method for corrections | 30 min |
| 35 | Create movement summary methods | Sum movements by type for reporting | 20 min |
| 36 | Create StockMovement admin | Admin with date filters, movement type filters, read-only fields | 25 min |

---

### Group C: Stock Operations Services (Tasks 37-56)

Business logic services for stock operations.

| Task # | Task Name | Description | Est. Time |
|--------|-----------|-------------|-----------|
| 37 | Create StockService base class | Abstract service with common stock operation methods | 25 min |
| 38 | Implement stock_in operation | Add stock to warehouse, create STOCK_IN movement | 30 min |
| 39 | Implement stock_out operation | Remove stock from warehouse, create STOCK_OUT movement | 30 min |
| 40 | Validate stock availability | Check available quantity before stock_out | 20 min |
| 41 | Implement stock_transfer operation | Move stock between warehouses, create TRANSFER movements | 35 min |
| 42 | Create transfer validation | Ensure source has sufficient stock, valid route exists | 25 min |
| 43 | Handle in-transit stock | Create intermediate TRANSFER_IN_TRANSIT state | 30 min |
| 44 | Implement reserve_stock operation | Reserve quantity for order, update reserved_quantity | 25 min |
| 45 | Implement release_stock operation | Release reserved quantity (order cancelled) | 20 min |
| 46 | Implement commit_reserved operation | Convert reserved to sold (order completed) | 25 min |
| 47 | Create StockAdjustmentService | Service for manual stock corrections | 30 min |
| 48 | Implement positive_adjustment | Add stock with ADJUSTMENT type, reason | 25 min |
| 49 | Implement negative_adjustment | Remove stock with ADJUSTMENT type, reason | 25 min |
| 50 | Require adjustment authorization | Require manager approval for adjustments above threshold | 25 min |
| 51 | Create batch stock operations | Process multiple stock operations in transaction | 30 min |
| 52 | Add operation result model | Return structured result with success/failure details | 20 min |
| 53 | Create stock operation logging | Log all operations with details for audit | 20 min |
| 54 | Add stock operation events | Emit signals/events for external system integration | 25 min |
| 55 | Implement FIFO/LIFO support | Track lot/batch for FIFO/LIFO costing | 35 min |
| 56 | Create weighted average cost calc | Update weighted average cost on stock_in | 30 min |

---

### Group D: Stock Take & Adjustments (Tasks 57-72)

Physical inventory counting and variance handling.

| Task # | Task Name | Description | Est. Time |
|--------|-----------|-------------|-----------|
| 57 | Create StockTake model | Define model with warehouse FK, status, started_at, completed_at | 30 min |
| 58 | Add stock take status field | Status: DRAFT, IN_PROGRESS, COUNTING, REVIEW, COMPLETED, CANCELLED | 15 min |
| 59 | Add stock take scope | Define scope: FULL (all products) or PARTIAL (selected) | 15 min |
| 60 | Create StockTakeItem model | Track counted items: product, expected_qty, counted_qty | 30 min |
| 61 | Add variance calculation | Calculate variance: counted_qty - expected_qty | 15 min |
| 62 | Add variance percentage | Calculate percentage variance for reporting | 15 min |
| 63 | Add counted_by FK | Track who counted each item | 10 min |
| 64 | Add counted_at timestamp | Track when each item was counted | 10 min |
| 65 | Create StockTakeService | Service to manage stock take lifecycle | 30 min |
| 66 | Implement start_stock_take | Create stock take, populate items with expected quantities | 30 min |
| 67 | Implement record_count | Record counted quantity for item | 20 min |
| 68 | Implement complete_stock_take | Finalize and create adjustments for variances | 35 min |
| 69 | Create variance approval workflow | Require approval for variances above threshold | 30 min |
| 70 | Generate stock take report | Create PDF/Excel report with all variances | 35 min |
| 71 | Add blind count support | Option to hide expected quantity during counting | 20 min |
| 72 | Create cycle count scheduling | Schedule partial counts on rotating basis | 30 min |

---

### Group E: Serializers & API Views (Tasks 73-84)

DRF serializers and viewsets for inventory management.

| Task # | Task Name | Description | Est. Time |
|--------|-----------|-------------|-----------|
| 73 | Create StockLevelSerializer | Serializer with product info, quantities, status | 25 min |
| 74 | Add available stock field | SerializerMethodField for calculated availability | 15 min |
| 75 | Create StockMovementSerializer | Serializer with movement details, reference info | 25 min |
| 76 | Create StockOperationSerializer | Write serializer for stock operations | 25 min |
| 77 | Create StockTakeSerializer | Serializer for stock take with nested items | 30 min |
| 78 | Create StockLevelViewSet | ReadOnly ViewSet with filters by product, warehouse | 25 min |
| 79 | Create StockMovementViewSet | ReadOnly ViewSet for movement history | 25 min |
| 80 | Create stock operation endpoints | POST endpoints for in, out, transfer, adjust | 35 min |
| 81 | Create StockTakeViewSet | ViewSet with start, count, complete actions | 35 min |
| 82 | Add bulk count endpoint | POST /stock-takes/{id}/bulk-count/ for batch counting | 25 min |
| 83 | Add stock availability endpoint | GET /products/{id}/availability/ for all warehouses | 25 min |
| 84 | Add stock history endpoint | GET /products/{id}/movements/ with date range filter | 25 min |

---

### Group F: Testing & Documentation (Tasks 85-92)

Comprehensive testing and documentation for inventory system.

| Task # | Task Name | Description | Est. Time |
|--------|-----------|-------------|-----------|
| 85 | Create StockLevel model tests | Test model creation, constraints, calculations | 30 min |
| 86 | Create StockMovement tests | Test movement creation, validation, reversal | 30 min |
| 87 | Create stock operation tests | Test in, out, transfer, reserve, commit operations | 40 min |
| 88 | Create stock take tests | Test stock take lifecycle, variance calculations | 35 min |
| 89 | Create API endpoint tests | Test all ViewSet actions with authentication | 35 min |
| 90 | Create concurrency tests | Test concurrent stock operations handling | 35 min |
| 91 | Write inventory module documentation | Document all models, services, API endpoints | 45 min |
| 92 | Create inventory management guide | User guide for stock operations, take, adjustments | 40 min |

---

## Expected File Structure

```
apps/inventory/stock/
├── __init__.py
├── models/
│   ├── __init__.py
│   ├── stock_level.py            # Tasks 03-18
│   ├── stock_movement.py         # Tasks 21-35
│   ├── stock_take.py             # Tasks 57-64
│   └── stock_take_item.py        # Task 60
├── services/
│   ├── __init__.py
│   ├── stock_service.py          # Tasks 37-46
│   ├── adjustment_service.py     # Tasks 47-50
│   ├── batch_operations.py       # Task 51
│   ├── stock_take_service.py     # Tasks 65-69
│   ├── costing.py                # Tasks 55-56
│   └── reports.py                # Task 70
├── serializers/
│   ├── __init__.py
│   ├── stock_level.py            # Tasks 73-74
│   ├── stock_movement.py         # Task 75
│   ├── stock_operation.py        # Task 76
│   └── stock_take.py             # Task 77
├── views/
│   ├── __init__.py
│   ├── stock_level.py            # Task 78
│   ├── stock_movement.py         # Task 79
│   ├── stock_operations.py       # Task 80
│   └── stock_take.py             # Task 81
├── admin.py                      # Tasks 18, 36
├── urls.py
├── constants.py                  # Tasks 02, 19, 20
└── signals.py                    # Task 14
```

---

## Progress Tracking

| Group | Description | Tasks | Completed | Status |
|-------|-------------|-------|-----------|--------|
| A | Stock Level Models | 18 | 0 | 🔴 Not Started |
| B | Stock Movement Tracking | 18 | 0 | 🔴 Not Started |
| C | Stock Operations Services | 20 | 0 | 🔴 Not Started |
| D | Stock Take & Adjustments | 16 | 0 | 🔴 Not Started |
| E | Serializers & API Views | 12 | 0 | 🔴 Not Started |
| F | Testing & Documentation | 8 | 0 | 🔴 Not Started |
| **Total** | | **92** | **0** | 🔴 |

---

## Notes for AI Agents

### Stock Movement Types
| Type | Description | From WH | To WH |
|------|-------------|---------|-------|
| STOCK_IN | Receiving goods | None | ✓ |
| STOCK_OUT | Selling/shipping | ✓ | None |
| TRANSFER | Between warehouses | ✓ | ✓ |
| ADJUSTMENT | Correction | ✓ or None | ✓ or None |
| RESERVED | Reserved for order | N/A | N/A |
| RELEASED | Released reservation | N/A | N/A |

### Movement Reasons
| Reason | Description | Movement Types |
|--------|-------------|----------------|
| PURCHASE | Goods received from supplier | STOCK_IN |
| SALE | Goods sold to customer | STOCK_OUT |
| RETURN | Customer/supplier returns | STOCK_IN, STOCK_OUT |
| DAMAGE | Damaged goods write-off | STOCK_OUT (ADJUSTMENT) |
| THEFT | Theft/loss write-off | STOCK_OUT (ADJUSTMENT) |
| CORRECTION | Manual correction | ADJUSTMENT |
| EXPIRED | Expired goods write-off | STOCK_OUT (ADJUSTMENT) |
| TRANSFER | Warehouse transfer | TRANSFER |

### Stock Level Calculation
```
Available Quantity = quantity - reserved_quantity

Where:
- quantity: Physical stock on hand
- reserved_quantity: Stock reserved for pending orders
- available_quantity: Stock available for new orders
```

### Stock Operation Flow
```
┌─────────────────────────────────────────────────────────────┐
│                     ORDER PLACEMENT                          │
├─────────────────────────────────────────────────────────────┤
│  1. Check available_quantity >= order_qty                    │
│  2. reserve_stock(product, qty)                              │
│     - reserved_quantity += qty                               │
│     - Create RESERVED movement                               │
├─────────────────────────────────────────────────────────────┤
│                     ORDER COMPLETED                          │
├─────────────────────────────────────────────────────────────┤
│  3. commit_reserved(product, qty)                            │
│     - quantity -= qty                                        │
│     - reserved_quantity -= qty                               │
│     - Create STOCK_OUT movement (SALE)                       │
├─────────────────────────────────────────────────────────────┤
│                     ORDER CANCELLED                          │
├─────────────────────────────────────────────────────────────┤
│  3. release_stock(product, qty)                              │
│     - reserved_quantity -= qty                               │
│     - Create RELEASED movement                               │
└─────────────────────────────────────────────────────────────┘
```

### Transfer Flow
```
Source Warehouse                      Destination Warehouse
      │                                       │
      │ 1. transfer_out()                     │
      │    - quantity -= qty                  │
      │    - Create TRANSFER movement         │
      ├──────────────────────────────────────►│
      │                                       │
      │           IN_TRANSIT                  │
      │                                       │
      │                        2. transfer_in()
      │                           - quantity += qty
      │                           - Update movement status
      │◄──────────────────────────────────────┤
```

### Stock Take Process
```
DRAFT → IN_PROGRESS → COUNTING → REVIEW → COMPLETED
  │                                          │
  └─────────► CANCELLED ◄────────────────────┘

States:
- DRAFT: Stock take created, items being added
- IN_PROGRESS: Active counting session
- COUNTING: Physical counting in progress
- REVIEW: Variances under review
- COMPLETED: Adjustments applied
- CANCELLED: Stock take cancelled
```

### Variance Handling
```python
variance = counted_qty - expected_qty
variance_percentage = (variance / expected_qty) * 100 if expected_qty else 0

# Auto-approval rules (configurable):
AUTO_APPROVE_THRESHOLD = 5  # units
AUTO_APPROVE_PERCENTAGE = 2  # percent

if abs(variance) <= AUTO_APPROVE_THRESHOLD or abs(variance_percentage) <= AUTO_APPROVE_PERCENTAGE:
    auto_approve()
else:
    require_manager_approval()
```

### Weighted Average Cost
```python
def update_weighted_average_cost(stock_level, qty_in, cost_per_unit):
    old_qty = stock_level.quantity
    old_cost = stock_level.weighted_avg_cost or Decimal('0')
    
    total_old_value = old_qty * old_cost
    new_value = qty_in * cost_per_unit
    
    new_total_qty = old_qty + qty_in
    if new_total_qty > 0:
        stock_level.weighted_avg_cost = (total_old_value + new_value) / new_total_qty
    
    stock_level.quantity = new_total_qty
    stock_level.save()
```

### Concurrency Handling
```python
# Use select_for_update() to prevent race conditions
with transaction.atomic():
    stock_level = StockLevel.objects.select_for_update().get(
        product=product,
        warehouse=warehouse
    )
    
    if stock_level.available_quantity >= qty:
        stock_level.reserved_quantity += qty
        stock_level.save()
    else:
        raise InsufficientStockError()
```

---

## Changelog

| Date | Author | Changes |
|------|--------|---------|
| TBD | AI Agent | Initial task summary creation |
