# Tasks 63-68: Stock Take Service & Lifecycle Management

> **Phase:** 04 - ERP Core Modules Part 1  
> **SubPhase:** 09 - Inventory Management  
> **Group:** D - Stock Take & Adjustments  
> **Tasks:** 63-68 of 92  
> **Status:** Planning

---

## Navigation

- **↑ Parent:** [Group D Overview](00_GROUP_OVERVIEW.md)
- **← Previous:** [Tasks 57-62: Stock Take Models](01_Tasks-57-62_Stock-Take-Models.md)
- **→ Next:** [Tasks 69-72: Approval, Reports & Scheduling](03_Tasks-69-72_Approval-Reports-Scheduling.md)

---

## Task 63: Add Counted By FK

**Complexity:** Low | **Time Estimate:** 10 min

### Objective
Track which user counted each individual item for accountability and quality control.

### Instructions

#### 1. Add Counted By Field
- Add `counted_by` FK to User on StockTakeItem model
- Set to nullable (null until item is counted)
- Use `on_delete=models.SET_NULL` to preserve history if user deleted
- Add related_name: `counted_items`

#### 2. Set Counted By Automatically
- When `counted_quantity` is set, auto-set `counted_by`
- Accept user parameter in counting methods
- Override in `record_count()` service method

#### 3. Add Counter Performance Tracking
- Create method to get items counted by user: `User.get_counted_items(stock_take)`
- Calculate counter statistics: items counted, accuracy rate
- Generate counter performance report

#### 4. Support Multiple Counters
- Allow different users to count different items in same stock take
- Track who counted what for split counting sessions
- Display counter name in UI for each item

#### 5. Add Verification Support
- Add `verified_by` FK to User (separate from counted_by)
- Support double-check process: one person counts, another verifies
- Require verification for high-value items or significant variances

#### 6. Create Counter Assignment
- Method to assign items to specific counters: `assign_items(user, items)`
- Filter items by assignment in UI: "My Assignments"
- Track assignment vs completion for workload monitoring

### Validation Checklist
- [ ] counted_by FK added to model
- [ ] Field set automatically on count
- [ ] Performance tracking functional
- [ ] Multiple counters supported
- [ ] Verification workflow works
- [ ] Assignment system functional

---

## Task 64: Add Counted At Timestamp

**Complexity:** Low | **Time Estimate:** 10 min

### Objective
Record exact timestamp when each item was physically counted for audit and analysis.

### Instructions

#### 1. Add Counted At Field
- Add `counted_at` DateTimeField to StockTakeItem model
- Set to nullable (null until item is counted)
- Auto-set to `timezone.now()` when count recorded

#### 2. Set Timestamp Automatically
- In `record_count()` method, set counted_at
- Use Django's timezone.now() for accuracy
- Store in UTC, convert to local timezone for display

#### 3. Add Count Duration Tracking
- Calculate time between stock take start and item count
- Property method: `count_delay` - time since stock take started
- Use for identifying slow counts or stale data

#### 4. Support Re-Count Tracking
- If item re-counted, update counted_at to new time
- Optionally log previous count time for audit
- Track number of times item was re-counted

#### 5. Add Time-Based Analytics
- Method to group items by count time (hour-by-hour)
- Identify peak counting periods
- Calculate average counting speed (items per hour)

#### 6. Create Count Freshness Indicator
- Method: `is_count_fresh(hours=24)` - returns boolean
- Flag counts older than threshold as potentially stale
- Require re-count if too old before finalizing

### Validation Checklist
- [ ] counted_at field added
- [ ] Timestamp set automatically
- [ ] Duration calculations work
- [ ] Re-count tracking functional
- [ ] Analytics methods accurate
- [ ] Freshness checks work

---

## Task 65: Create StockTakeService

**Complexity:** Medium | **Time Estimate:** 30 min

### Objective
Create service class to manage stock take lifecycle and enforce business rules.

### Instructions

#### 1. Create Service Class Structure
- Create `apps/inventory/stock/services/stock_take_service.py`
- Define `StockTakeService` class
- Follow service pattern: methods return OperationResult objects

#### 2. Implement Create Stock Take Method
- Method: `create_stock_take(warehouse, scope, name, user, **kwargs)`
- Generate unique reference number
- Validate warehouse access permissions
- Set status to DRAFT
- Return created StockTake instance

#### 3. Add Validation Methods
- `validate_warehouse_access(warehouse, user)` - check permissions
- `validate_can_start(stock_take)` - check if ready to start counting
- `validate_can_complete(stock_take)` - check if all items counted
- Raise appropriate exceptions for validation failures

#### 4. Create Status Management
- Centralize status transitions in service
- `transition_status(stock_take, new_status, user)` method
- Log all status changes
- Emit signals for status changes

#### 5. Add Error Handling
- Define custom exceptions: `StockTakeError`, `InvalidStockTakeStatus`, `CountingNotComplete`
- Wrap operations in try-except blocks
- Return OperationResult with error details
- Rollback database changes on errors

#### 6. Implement Transaction Management
- Use `@transaction.atomic` decorator for critical operations
- Ensure data consistency across StockTake and StockTakeItem updates
- Use select_for_update() for concurrent access protection

### Validation Checklist
- [ ] Service class follows standard pattern
- [ ] Validation methods comprehensive
- [ ] Status transitions managed centrally
- [ ] Error handling robust
- [ ] Transactions properly managed
- [ ] Results consistently structured

---

## Task 66: Implement Start Stock Take

**Complexity:** Medium | **Time Estimate:** 30 min

### Objective
Implement method to initialize stock take session and populate items with expected quantities.

### Instructions

#### 1. Create Start Stock Take Method
- Method: `start_stock_take(stock_take_id, user)`
- Validate stock_take is in DRAFT or IN_PROGRESS status
- Transition status to COUNTING
- Set started_at timestamp

#### 2. Populate Stock Take Items
- Query products based on scope (FULL or PARTIAL)
- For each product, create StockTakeItem
- Get expected quantity from StockLevel model
- Handle products with variants (create item per variant)
- Handle products in multiple storage locations if tracking bin-level

#### 3. Set Expected Quantities
- Query StockLevel for current quantity
- Store as `expected_quantity` in StockTakeItem
- Also store as `system_quantity` for reference
- Lock stock levels (optional): prevent movements during count

#### 4. Set Cost Per Unit
- Get current cost from StockLevel or Product
- Store in `cost_per_unit` field
- Calculate `expected_value` = expected_quantity × cost_per_unit

#### 5. Assign Count Sequence
- Number items in logical sequence
- Options: by SKU, by location, by category
- Set `count_sequence` field for ordered counting
- Allow customization of sequence strategy

#### 6. Handle Large Stock Takes
- For warehouses with many products (>1000), use Celery task
- Process asynchronously in background
- Show progress indicator to user
- Send notification when ready to count

### Validation Checklist
- [ ] Stock take status transitioned correctly
- [ ] All relevant products included
- [ ] Expected quantities accurate at start time
- [ ] Cost per unit captured correctly
- [ ] Count sequence logical and usable
- [ ] Large stock takes processed efficiently

---

## Task 67: Implement Record Count

**Complexity:** Medium | **Time Estimate:** 20 min

### Objective
Implement method to record physically counted quantity for individual items.

### Instructions

#### 1. Create Record Count Method
- Method: `record_count(stock_take_item_id, counted_quantity, user, notes=None)`
- Validate stock take is in COUNTING status
- Validate counted_quantity is non-negative (or allow negative if configured)

#### 2. Update Stock Take Item
- Set `counted_quantity` on item
- Set `counted_by = user`
- Set `counted_at = timezone.now()`
- Update `status` to COUNTED

#### 3. Calculate Variance
- Call `calculate_variance()` method on item
- Calculate `variance_quantity`
- Calculate `variance_percentage`
- Calculate `variance_value`

#### 4. Update Parent Stock Take Statistics
- Increment `counted_items` counter
- If variance exists, increment `items_with_variance`
- Add variance_value to `total_variance_value`
- Calculate progress percentage

#### 5. Flag for Review if Needed
- If variance exceeds threshold, flag item
- Set `requires_recount = True` if variance very high
- Create alert for warehouse manager
- Add item to review queue

#### 6. Support Bulk Counting
- Method: `record_counts_bulk(counts_list, user)`
- Accept list of {item_id, counted_quantity} dicts
- Process in transaction
- Return summary result

### Validation Checklist
- [ ] Count recorded accurately
- [ ] User and timestamp captured
- [ ] Variance calculated correctly
- [ ] Parent statistics updated
- [ ] High variances flagged
- [ ] Bulk counting efficient

---

## Task 68: Implement Complete Stock Take

**Complexity:** High | **Time Estimate:** 35 min

### Objective
Finalize stock take session and create stock adjustments for all variances.

### Instructions

#### 1. Create Complete Stock Take Method
- Method: `complete_stock_take(stock_take_id, user, force=False)`
- Validate all items have been counted
- Validate stock take is in REVIEW status
- Transition status to COMPLETED

#### 2. Validate Completion Readiness
- Check that all items have `counted_quantity` set
- Verify no items still flagged for recount (or force complete)
- Ensure high-value variances are approved if required
- Raise exception if not ready (unless force=True)

#### 3. Create Stock Adjustments
- For each item with variance:
  - Create StockMovement with type=ADJUSTMENT
  - Set quantity to variance_quantity (positive or negative)
  - Set reason to STOCK_TAKE
  - Link to stock take via reference fields
- Use transaction to ensure atomicity

#### 4. Update Stock Levels
- Apply each adjustment to corresponding StockLevel
- Increment/decrement quantity based on variance
- Update `last_updated` timestamp
- Lock rows with select_for_update()

#### 5. Generate Completion Report
- Create summary document with:
  - Total items counted
  - Items with variances
  - Total variance value (gain/loss)
  - Top variances by value
  - Completion time and duration
- Store as PDF or in database

#### 6. Send Notifications and Finalize
- Notify warehouse manager of completion
- Send summary email with key statistics
- Set `completed_at` timestamp
- Set `completed_by = user`
- Emit completion signal for integrations

### Validation Checklist
- [ ] Completion validation thorough
- [ ] Adjustments created correctly
- [ ] Stock levels updated accurately
- [ ] All updates atomic (transaction)
- [ ] Completion report generated
- [ ] Notifications sent

---

## Expected Outcomes

After completing Tasks 63-68:

### Files Created
- `apps/inventory/stock/services/stock_take_service.py` (new)
- `apps/inventory/stock/exceptions.py` (custom exceptions)

### Files Modified
- `apps/inventory/stock/models.py` (fields added to StockTakeItem)

### Stock Take Lifecycle Flow

```
[Create Stock Take]
         │
         ▼
[Start Stock Take] ──► Populate items with expected quantities
         │
         ▼
[Record Counts] ──► For each item, record counted quantity
         │                     │
         ▼                     ▼
[Calculate Variances] ◄─ Auto-calculate on each count
         │
         ▼
[Review Variances] ──► Flag items requiring approval
         │
         ▼
[Complete Stock Take] ──► Create adjustments & update stock
         │
         ▼
[COMPLETED]
```

### Service Method Summary

| Method | Purpose | Returns |
|--------|---------|---------|
| `create_stock_take()` | Initialize new stock take | StockTake instance |
| `start_stock_take()` | Begin counting session | OperationResult |
| `record_count()` | Record individual item count | OperationResult |
| `record_counts_bulk()` | Record multiple counts | BatchOperationResult |
| `complete_stock_take()` | Finalize and create adjustments | OperationResult |

### Example Usage

```python
# Create and start stock take
service = StockTakeService()
stock_take = service.create_stock_take(
    warehouse=main_warehouse,
    scope='FULL',
    name='Q1 2026 Full Count',
    user=request.user
)

result = service.start_stock_take(stock_take.id, request.user)
# Items populated with expected quantities

# Record counts
service.record_count(
    stock_take_item_id=item1.id,
    counted_quantity=98,
    user=counter_user,
    notes="Found 2 damaged units"
)

# Complete
result = service.complete_stock_take(stock_take.id, manager_user)
# Adjustments created, stock updated
```

---

## Progress Tracking

- [ ] Task 63: Add counted_by FK
- [ ] Task 64: Add counted_at timestamp
- [ ] Task 65: Create StockTakeService
- [ ] Task 66: Implement start_stock_take
- [ ] Task 67: Implement record_count
- [ ] Task 68: Implement complete_stock_take

**Document Status:** Complete | **Ready for Implementation:** Yes
