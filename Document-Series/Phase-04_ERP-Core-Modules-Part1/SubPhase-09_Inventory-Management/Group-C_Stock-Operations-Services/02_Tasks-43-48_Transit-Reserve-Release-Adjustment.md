# Tasks 43-48: Transit, Reserve, Release & Adjustment Services

> **Phase:** 04 - ERP Core Modules Part 1  
> **SubPhase:** 09 - Inventory Management  
> **Group:** C - Stock Operations Services  
> **Tasks:** 43-48 of 92  
> **Status:** Planning

---

## Navigation

- **↑ Parent:** [Group C Overview](00_GROUP_OVERVIEW.md)
- **← Previous:** [Tasks 37-42: Stock Service In/Out/Transfer](01_Tasks-37-42_Stock-Service-In-Out-Transfer.md)
- **→ Next:** [Tasks 49-52: Authorization & Batch Operations](03_Tasks-49-52_Authorization-Batch-Operations.md)

---

## Task 43: Handle In-Transit Stock

**Complexity:** High | **Time Estimate:** 30 min

### Objective
Create intermediate TRANSFER_IN_TRANSIT state to track stock that has been dispatched from source warehouse but not yet received at destination.

### Instructions

#### 1. Define Transit Status Constants
- Add `TRANSFER_IN_TRANSIT` to movement type constants
- Define in `apps/inventory/constants.py` or `stock/constants.py`
- Include: `IN_TRANSIT`, `DISPATCHED`, `RECEIVED`

#### 2. Add Transit Tracking Fields
- Add to StockMovement model: `transit_status` CharField with choices
- Add `dispatched_at` DateTimeField (auto_set on transfer initiation)
- Add `received_at` DateTimeField (set on receiving confirmation)
- Add `dispatched_by` FK to User
- Add `received_by` FK to User

#### 3. Create Transit State Methods
- Implement `mark_as_dispatched(user)` method
  - Set `transit_status = 'DISPATCHED'`
  - Set `dispatched_at = timezone.now()`
  - Set `dispatched_by = user`
  - Reduce stock at source warehouse
  - Create outbound movement record

#### 4. Implement Receiving Confirmation
- Implement `mark_as_received(user)` method
  - Set `transit_status = 'RECEIVED'`
  - Set `received_at = timezone.now()`
  - Set `received_by = user`
  - Increase stock at destination warehouse
  - Create inbound movement record

#### 5. Add In-Transit Quantity Tracking
- Create method to query in-transit quantity
- `get_in_transit_quantity(product, from_warehouse=None, to_warehouse=None)`
- Return total quantity in transit for product between warehouses
- Include in product availability calculations

#### 6. Handle Transit Exceptions
- Create `mark_as_lost()` method for lost shipments
  - Adjust stock at source (if needed)
  - Create adjustment movement with reason=LOST_IN_TRANSIT
  - Require authorization for loss confirmation

### Validation Checklist
- [ ] Transit status transitions are atomic
- [ ] Stock levels accurate at each transit stage
- [ ] In-transit quantity queryable by product/warehouse
- [ ] Lost shipments handled with audit trail
- [ ] Transit times tracked for reporting
- [ ] User accountability at dispatch and receiving

---

## Task 44: Implement Reserve Stock Operation

**Complexity:** Medium | **Time Estimate:** 25 min

### Objective
Reserve specific quantity of stock for pending orders without physically moving stock, preventing overselling.

### Instructions

#### 1. Create Reserve Stock Method
- In StockService, implement `reserve_stock(product, warehouse, quantity, order_id, user)`
- Check if sufficient available quantity exists
- Calculate: `available = quantity - reserved_quantity`
- Raise InsufficientStockError if not available

#### 2. Update Reserved Quantity
- Use select_for_update() to lock StockLevel row
- Increment `reserved_quantity` field by reservation amount
- Ensure atomic operation within transaction

#### 3. Create Reserve Movement Record
- Create StockMovement with `movement_type = 'RESERVED'`
- Set `reference_type = 'ORDER'` and `reference_id = order_id`
- Set quantity to reserved amount (positive value)
- Include `created_by = user`

#### 4. Add Expiration Handling
- Add `reserved_until` DateTimeField to movement
- Set default expiration (e.g., 24 hours from creation)
- Create Celery task to auto-release expired reservations

#### 5. Implement Partial Reservation
- Support partial quantity if full amount unavailable
- Return result with `reserved_quantity` and `remaining_quantity`
- Allow caller to decide if partial acceptable

#### 6. Create Multi-Warehouse Reservation
- Implement `reserve_stock_multi_warehouse()` method
- Attempt reservation across multiple warehouses
- Return list of reservations by warehouse
- Use in order fulfillment to optimize shipping

### Validation Checklist
- [ ] Concurrent reservations handled correctly
- [ ] Reserved quantity accurately tracked
- [ ] Reservations linked to orders
- [ ] Expired reservations auto-released
- [ ] Partial reservations supported
- [ ] Available quantity calculations accurate

---

## Task 45: Implement Release Stock Operation

**Complexity:** Medium | **Time Estimate:** 20 min

### Objective
Release previously reserved stock back to available inventory when order is cancelled or modified.

### Instructions

#### 1. Create Release Stock Method
- In StockService, implement `release_stock(movement_id, user, reason=None)`
- Accept reservation movement ID to reverse
- Validate that movement exists and is of type RESERVED

#### 2. Update Reserved Quantity
- Use select_for_update() to lock StockLevel row
- Decrement `reserved_quantity` by release amount
- Ensure reserved_quantity doesn't go negative

#### 3. Create Release Movement Record
- Create StockMovement with `movement_type = 'RELEASED'`
- Set negative quantity (opposite of reservation)
- Link to original reservation via `reversed_movement_id` FK
- Include reason: CANCELLED, MODIFIED, EXPIRED

#### 4. Handle Order-Level Releases
- Implement `release_all_for_order(order_id, user)` method
- Find all RESERVED movements for order
- Release each reservation
- Return summary of released quantities by product

#### 5. Add Partial Release Support
- Support releasing portion of reservation
- Update remaining reservation quantity
- Create release movement for partial amount

#### 6. Trigger Reallocation Events
- Emit signal when stock released
- Allow other pending orders to claim released stock
- Integrate with order queue/waitlist system

### Validation Checklist
- [ ] Reserved quantity correctly decreased
- [ ] Release movements linked to original reservations
- [ ] Partial releases handled accurately
- [ ] Order-level bulk release works correctly
- [ ] Available quantity immediately updated
- [ ] Reallocation events triggered

---

## Task 46: Implement Commit Reserved Operation

**Complexity:** Medium | **Time Estimate:** 25 min

### Objective
Convert reserved stock to sold/consumed when order is fulfilled or completed, finalizing the stock reduction.

### Instructions

#### 1. Create Commit Reserved Method
- In StockService, implement `commit_reserved(movement_id, user)`
- Accept reservation movement ID
- Validate movement is RESERVED and linked to order

#### 2. Update Stock Quantities
- Use select_for_update() to lock StockLevel row
- Decrement `quantity` (actual stock) by committed amount
- Decrement `reserved_quantity` by committed amount
- Net effect: total stock reduced, reserved released

#### 3. Create Committed Movement Record
- Create StockMovement with `movement_type = 'STOCK_OUT'`
- Set `movement_reason = 'SALE'` or appropriate reason
- Link to original reservation via FK
- Reference order details

#### 4. Handle Partial Commits
- Support committing portion of reservation
- Update remaining reservation quantity
- Create committed movement for partial amount
- Maintain link to original reservation

#### 5. Implement Order-Level Commit
- Create `commit_all_for_order(order_id, user)` method
- Find all RESERVED movements for order
- Commit each reservation
- Return summary of committed quantities

#### 6. Update Cost Tracking
- Use FIFO/LIFO or weighted average cost from reservation
- Set `cost_per_unit` on committed movement
- Update COGS (Cost of Goods Sold) tracking

### Validation Checklist
- [ ] Both quantity and reserved_quantity updated correctly
- [ ] Committed movements linked to reservations
- [ ] Partial commits handled accurately
- [ ] Order-level bulk commit works
- [ ] Cost properly tracked on commitment
- [ ] No negative stock quantities

---

## Task 47: Create StockAdjustmentService

**Complexity:** Medium | **Time Estimate:** 30 min

### Objective
Create dedicated service class for manual stock corrections and adjustments with proper authorization and audit trail.

### Instructions

#### 1. Create StockAdjustmentService Class
- Create `apps/inventory/stock/services/adjustment.py`
- Define `StockAdjustmentService` inheriting from base if applicable
- Include methods for positive and negative adjustments

#### 2. Define Adjustment Reasons
- Create constants for adjustment reasons
- Include: DAMAGE, THEFT, EXPIRED, FOUND, LOST, COUNT_ERROR, SYSTEM_ERROR, DATA_MIGRATION
- Store in `stock/constants.py`

#### 3. Add Adjustment Fields
- Ensure StockMovement model has `adjustment_reason` field
- Add `requires_approval` BooleanField
- Add `approved_by` FK to User
- Add `approved_at` DateTimeField

#### 4. Create Adjustment Request Model
- Consider separate AdjustmentRequest model for workflow
- Fields: product, warehouse, quantity_change, reason, notes, requested_by, status
- Status: PENDING, APPROVED, REJECTED, COMPLETED

#### 5. Implement Adjustment Authorization Check
- Method to check if adjustment requires approval based on:
  - Adjustment amount (threshold)
  - User role/permissions
  - Reason type
- Return boolean and required authorization level

#### 6. Create Adjustment Notification System
- Send notification to managers when approval needed
- Include: product, quantity, reason, requester
- Allow approval/rejection from notification

### Validation Checklist
- [ ] Service class properly structured
- [ ] Adjustment reasons comprehensive
- [ ] Authorization levels defined
- [ ] Approval workflow functional
- [ ] Notifications sent correctly
- [ ] Audit trail complete

---

## Task 48: Implement Positive Adjustment

**Complexity:** Medium | **Time Estimate:** 25 min

### Objective
Implement method to increase stock quantity through adjustment when physical stock exceeds system records.

### Instructions

#### 1. Create Adjust Up Method
- In StockAdjustmentService, implement `adjust_up(product, warehouse, quantity, reason, notes, user)`
- Validate inputs: quantity > 0, valid reason
- Check authorization requirements

#### 2. Update Stock Level
- Use select_for_update() to lock StockLevel
- Increment `quantity` by adjustment amount
- Set `last_updated = timezone.now()`

#### 3. Create Adjustment Movement
- Create StockMovement with `movement_type = 'ADJUSTMENT'`
- Set positive quantity value
- Set `adjustment_reason = reason`
- Include detailed notes

#### 4. Handle Authorization Requirement
- If requires approval, create AdjustmentRequest
- Set status to PENDING
- Do NOT update stock until approved
- Send notification to approvers

#### 5. Create Approval Method
- Implement `approve_adjustment(request_id, approver)`
- Verify approver has permission
- Execute stock update
- Mark request as APPROVED and COMPLETED

#### 6. Add Cost Implications
- For positive adjustments, may need cost estimate
- Set `cost_per_unit` if adding inventory value
- Update weighted average cost accordingly

### Validation Checklist
- [ ] Stock quantity increased correctly
- [ ] Adjustment movements created
- [ ] Authorization enforced when required
- [ ] Approval workflow functional
- [ ] Cost implications handled
- [ ] Audit trail complete

---

## Expected Outcomes

After completing Tasks 43-48:

### Files Modified/Created
- `apps/inventory/stock/services/stock_service.py` (extended)
- `apps/inventory/stock/services/adjustment.py` (new)
- `apps/inventory/stock/constants.py` (extended)
- `apps/inventory/stock/models.py` (StockMovement fields added)

### New Functionality
1. **Transit Tracking** - Complete visibility of stock transfers
2. **Reserve/Release/Commit** - Full order fulfillment cycle
3. **Adjustment Service** - Professional correction workflow
4. **Positive Adjustment** - Increase stock with authorization

### Integration Points
- Order management system (reservations)
- Approval workflow system
- Notification service
- Cost accounting system

### Quality Measures
- All stock operations atomic and thread-safe
- Authorization enforced at service layer
- Complete audit trail for all adjustments
- No phantom inventory or overselling

---

## Progress Tracking

- [ ] Task 43: In-transit stock handling
- [ ] Task 44: Reserve stock operation
- [ ] Task 45: Release stock operation
- [ ] Task 46: Commit reserved operation
- [ ] Task 47: StockAdjustmentService
- [ ] Task 48: Positive adjustment

**Document Status:** Complete | **Ready for Implementation:** Yes
