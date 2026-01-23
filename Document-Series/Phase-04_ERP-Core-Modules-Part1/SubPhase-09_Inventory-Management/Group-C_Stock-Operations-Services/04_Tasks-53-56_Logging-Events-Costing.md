# Tasks 53-56: Logging, Events & Costing Methods

> **Phase:** 04 - ERP Core Modules Part 1  
> **SubPhase:** 09 - Inventory Management  
> **Group:** C - Stock Operations Services  
> **Tasks:** 53-56 of 92  
> **Status:** Planning

---

## Navigation

- **↑ Parent:** [Group C Overview](00_GROUP_OVERVIEW.md)
- **← Previous:** [Tasks 49-52: Authorization & Batch Operations](03_Tasks-49-52_Authorization-Batch-Operations.md)
- **→ Next Group:** [Group D: Stock Take & Adjustments](../Group-D_Stock-Take-Adjustments/)

---

## Task 53: Create Stock Operation Logging

**Complexity:** Medium | **Time Estimate:** 20 min

### Objective
Implement comprehensive logging system for all stock operations to provide detailed audit trail and debugging capability.

### Instructions

#### 1. Set Up Stock Operation Logger
- Create dedicated logger in Django settings
- Name: `inventory.stock.operations`
- Configure separate log file: `logs/stock_operations.log`
- Use rotating file handler (max 50MB per file, keep 10 files)

#### 2. Define Log Entry Structure
- Standard format for all operation logs:
  - Timestamp (ISO 8601 format)
  - Operation type (STOCK_IN, STOCK_OUT, TRANSFER, etc.)
  - User ID and username
  - Tenant/Company ID
  - Product ID and SKU
  - Warehouse ID(s)
  - Quantity change
  - Operation result (SUCCESS/FAILURE)
  - Error details if failed

#### 3. Implement Operation Logging Decorator
- Create `@log_stock_operation` decorator
- Automatically log entry/exit of operation methods
- Capture method arguments
- Log execution time
- Handle exceptions and log error details

#### 4. Add Context Logging
- Use contextvars to maintain operation context
- Include request ID for tracing
- Link related operations (e.g., batch items)
- Track operation chain (reserve → commit)

#### 5. Create Critical Event Logging
- Log critical events at WARNING or ERROR level:
  - Negative stock adjustments
  - Large value adjustments
  - Failed authorization checks
  - Concurrent operation conflicts
  - Stock discrepancies detected

#### 6. Implement Log Analysis Tools
- Create management command to analyze stock logs
- Identify patterns: frequent adjustments, failed operations
- Generate reports on operation volumes
- Alert on suspicious patterns

### Validation Checklist
- [ ] All stock operations logged
- [ ] Log format consistent and parseable
- [ ] Critical events highlighted
- [ ] Performance impact minimal
- [ ] Logs rotated to prevent disk full
- [ ] Analysis tools functional

---

## Task 54: Add Stock Operation Events

**Complexity:** Medium | **Time Estimate:** 25 min

### Objective
Emit signals/events for stock operations to enable loose coupling and integration with external systems.

### Instructions

#### 1. Define Stock Operation Signals
- Create `apps/inventory/stock/signals.py`
- Define Django signals:
  - `stock_level_changed` - fired when quantity changes
  - `stock_movement_created` - fired on any movement
  - `stock_reserved` - fired on reservation
  - `stock_transferred` - fired on successful transfer
  - `stock_adjustment_created` - fired on adjustment

#### 2. Add Signal Arguments
- Each signal provides:
  - `sender` - service class that emitted signal
  - `instance` - model instance (StockLevel, StockMovement)
  - `operation_type` - specific operation performed
  - `user` - user who initiated operation
  - `metadata` - dict with operation-specific data

#### 3. Connect Built-in Signal Handlers
- Create `stock_level_update_handler` to update product totals
- Connect to `stock_level_changed` signal
- Update Product model's `total_stock` field
- Trigger reorder alerts if below threshold

#### 4. Add Webhook Integration
- Create webhook dispatcher for stock events
- Allow configuration of webhook URLs per event type
- Send POST requests with event data as JSON
- Handle webhook failures with retry logic

#### 5. Implement Event Bus Integration
- Support for message queues (RabbitMQ, Redis Pub/Sub)
- Publish events to topics/exchanges
- Format: JSON with event type, timestamp, payload
- Allow external services to subscribe

#### 6. Create Event Replay Capability
- Store events in database for replay
- Create `StockEvent` model with event data
- Implement `replay_events(from_date, to_date)` method
- Useful for rebuilding state or syncing external systems

### Validation Checklist
- [ ] All major operations emit signals
- [ ] Signal handlers registered correctly
- [ ] Webhook integration functional
- [ ] Message queue publishing works
- [ ] Event data complete and accurate
- [ ] Performance acceptable with many subscribers

---

## Task 55: Implement FIFO/LIFO Support

**Complexity:** High | **Time Estimate:** 35 min

### Objective
Implement First-In-First-Out and Last-In-First-Out inventory costing methods with lot/batch tracking.

### Instructions

#### 1. Create StockLot Model
- Define model to track inventory lots/batches
- Fields: `lot_number`, `product` FK, `warehouse` FK, `received_date`, `expiry_date`
- Add `original_quantity`, `remaining_quantity`, `cost_per_unit`
- Add `supplier_reference`, `supplier` FK

#### 2. Modify Stock In to Create Lots
- When stock comes in, create StockLot record
- Generate unique lot number (format: LOT-YYYYMMDD-NNNN)
- Store received date, quantity, cost per unit
- If from purchase order, link supplier information

#### 3. Implement FIFO Allocation
- Create `allocate_stock_fifo(product, warehouse, quantity)` method
- Query StockLots ordered by `received_date` ASC
- Allocate from oldest lots first
- If lot depleted, move to next lot
- Return list of allocations: (lot, quantity, cost)

#### 4. Implement LIFO Allocation
- Create `allocate_stock_lifo(product, warehouse, quantity)` method
- Query StockLots ordered by `received_date` DESC
- Allocate from newest lots first
- Return list of allocations: (lot, quantity, cost)

#### 5. Link Movements to Lots
- Add `StockMovementLot` model for many-to-many relationship
- Fields: `movement` FK, `lot` FK, `quantity`, `cost_per_unit`
- When stock out occurs, create entries for each lot used
- Track which lots contributed to each sale

#### 6. Add Lot Expiry Handling
- Create Celery task to check for expiring lots
- Send alerts when lots approaching expiry (e.g., 30 days)
- Create `get_expiring_lots(days_threshold)` method
- Support FEFO (First-Expired-First-Out) allocation

### Validation Checklist
- [ ] Lot model captures all necessary data
- [ ] FIFO allocation mathematically correct
- [ ] LIFO allocation mathematically correct
- [ ] Movements properly linked to lots
- [ ] Expiry tracking functional
- [ ] Lot queries performant

---

## Task 56: Create Weighted Average Cost Calculation

**Complexity:** High | **Time Estimate:** 30 min

### Objective
Implement weighted average cost method for inventory valuation, updating cost on each stock receipt.

### Instructions

#### 1. Add Cost Fields to StockLevel
- Add `average_cost_per_unit` DecimalField
- Add `total_value` DecimalField (quantity × average_cost)
- Update on every stock in and stock out operation

#### 2. Implement WAC Calculation on Stock In
- When stock added, calculate new weighted average:
  ```
  new_average = (old_quantity × old_avg_cost + new_quantity × new_cost) / (old_quantity + new_quantity)
  ```
- Update StockLevel.average_cost_per_unit
- Handle edge case: first receipt (no old cost)

#### 3. Use WAC on Stock Out
- When stock removed, use current average_cost_per_unit
- Do not recalculate on stock out (cost already averaged)
- Set cost_per_unit on movement to current average
- Calculate COGS: quantity × average_cost_per_unit

#### 4. Handle Stock Adjustments
- For positive adjustments, need cost input
- If no cost provided, use current average cost
- For negative adjustments, reduce total_value proportionally
- Recalculate average cost if needed

#### 5. Create Cost Reconciliation Method
- Implement `reconcile_costs(product, warehouse)` method
- Recalculate weighted average from all movements
- Compare to current average_cost_per_unit
- Identify and log discrepancies
- Optionally correct to calculated value

#### 6. Add Cost History Tracking
- Create `StockCostHistory` model
- Track cost changes over time
- Fields: `stock_level` FK, `date`, `average_cost`, `quantity`, `total_value`
- Create daily snapshot for reporting and analysis

### Validation Checklist
- [ ] WAC calculation mathematically correct
- [ ] Cost updated on every stock in
- [ ] Cost used correctly on stock out
- [ ] Adjustments handled properly
- [ ] Reconciliation finds discrepancies
- [ ] Cost history maintained

---

## Expected Outcomes

After completing Tasks 53-56:

### Files Created/Modified
- `apps/inventory/stock/logging.py` (new)
- `apps/inventory/stock/signals.py` (new)
- `apps/inventory/stock/models.py` (StockLot, StockMovementLot models added)
- `apps/inventory/stock/services/costing.py` (new)
- `apps/inventory/stock/services/stock_service.py` (extended with costing)

### New Functionality
1. **Comprehensive Logging** - Full audit trail of all operations
2. **Event System** - Signals and webhooks for integrations
3. **FIFO/LIFO** - Lot-based costing methods
4. **Weighted Average Cost** - Continuous cost averaging

### Costing Methods Comparison

| Method | Best For | Complexity | Accuracy |
|--------|----------|------------|----------|
| Weighted Average | General merchandise, stable costs | Low | Good |
| FIFO | Perishables, inflation environment | High | Excellent |
| LIFO | Deflation, tax optimization (some jurisdictions) | High | Excellent |
| FEFO | Food, pharmaceuticals with expiry | High | Excellent |

### Logging Example Output

```
2026-01-23 14:32:15 INFO [inventory.stock.operations] STOCK_OUT operation started
  User: john.doe (ID: 123)
  Tenant: ACME-CORP
  Product: WIDGET-001 (ID: 456)
  Warehouse: MAIN (ID: 789)
  Quantity: -50
  Reference: ORDER-1234

2026-01-23 14:32:15 DEBUG [inventory.stock.operations] Stock allocation: FIFO
  Lot LOT-20260115-0023: 30 units @ $10.50
  Lot LOT-20260118-0041: 20 units @ $10.75
  Total cost: $530.00

2026-01-23 14:32:16 INFO [inventory.stock.operations] STOCK_OUT operation completed
  Duration: 0.234s
  Movement ID: 98765
  New quantity: 150
```

### Event Payload Example

```json
{
  "event_type": "stock_level_changed",
  "timestamp": "2026-01-23T14:32:16Z",
  "tenant_id": "ACME-CORP",
  "data": {
    "product_id": 456,
    "product_sku": "WIDGET-001",
    "warehouse_id": 789,
    "previous_quantity": 200,
    "new_quantity": 150,
    "change": -50,
    "operation": "STOCK_OUT",
    "user_id": 123,
    "reference": "ORDER-1234"
  }
}
```

### Integration Points
- External monitoring systems via webhooks
- BI/analytics platforms via events
- Accounting systems for COGS calculation
- ERP modules for inventory valuation

---

## Progress Tracking

- [ ] Task 53: Stock operation logging system
- [ ] Task 54: Stock operation events and signals
- [ ] Task 55: FIFO/LIFO support with lot tracking
- [ ] Task 56: Weighted average cost calculation

**Group C Status:** Complete | **Ready for Group D:** Yes
