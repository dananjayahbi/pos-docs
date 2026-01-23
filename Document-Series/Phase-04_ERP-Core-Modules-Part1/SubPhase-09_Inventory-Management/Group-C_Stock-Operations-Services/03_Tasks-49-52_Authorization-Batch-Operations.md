# Tasks 49-52: Authorization, Batch Operations & Result Model

> **Phase:** 04 - ERP Core Modules Part 1  
> **SubPhase:** 09 - Inventory Management  
> **Group:** C - Stock Operations Services  
> **Tasks:** 49-52 of 92  
> **Status:** Planning

---

## Navigation

- **↑ Parent:** [Group C Overview](00_GROUP_OVERVIEW.md)
- **← Previous:** [Tasks 43-48: Transit, Reserve, Release & Adjustment](02_Tasks-43-48_Transit-Reserve-Release-Adjustment.md)
- **→ Next:** [Tasks 53-56: Logging, Events & Costing](04_Tasks-53-56_Logging-Events-Costing.md)

---

## Task 49: Implement Negative Adjustment

**Complexity:** Medium | **Time Estimate:** 25 min

### Objective
Implement method to decrease stock quantity through adjustment when system records exceed physical stock.

### Instructions

#### 1. Create Adjust Down Method
- In StockAdjustmentService, implement `adjust_down(product, warehouse, quantity, reason, notes, user)`
- Validate inputs: quantity > 0 (will be subtracted), valid reason
- Check authorization requirements (typically stricter than positive)

#### 2. Validate Available Stock
- Check if sufficient quantity exists to adjust down
- Compare against available quantity (not just total)
- Consider: should reserved stock be adjustable?
- Raise InsufficientStockError if quantity too high

#### 3. Update Stock Level
- Use select_for_update() to lock StockLevel
- Decrement `quantity` by adjustment amount
- Ensure quantity doesn't go negative (unless allowed by settings)
- Set `last_updated = timezone.now()`

#### 4. Create Adjustment Movement
- Create StockMovement with `movement_type = 'ADJUSTMENT'`
- Set negative quantity value (e.g., -10)
- Set `adjustment_reason = reason` (DAMAGE, THEFT, EXPIRED, etc.)
- Include detailed notes explaining loss

#### 5. Handle High-Value Adjustments
- Define threshold for "high value" adjustments
- Based on: quantity, cost per unit, or total value
- Automatically require manager approval above threshold
- Escalate to director for very high values

#### 6. Create Adjustment Documentation
- Allow file attachments (photos of damaged goods, police reports, etc.)
- Store attachment references in movement or separate model
- Link to external systems (insurance claims, incident reports)

### Validation Checklist
- [ ] Stock quantity decreased correctly
- [ ] Negative adjustments properly validated
- [ ] High-value adjustments require approval
- [ ] Documentation attachments supported
- [ ] Reason codes comprehensive
- [ ] Cannot adjust below zero (unless configured)

---

## Task 50: Require Adjustment Authorization

**Complexity:** Medium | **Time Estimate:** 25 min

### Objective
Implement authorization rules and approval workflow for stock adjustments based on value, reason, and user role.

### Instructions

#### 1. Define Authorization Rules
- Create `AdjustmentAuthorizationRules` class or configuration
- Define thresholds by:
  - Adjustment value (quantity × cost)
  - Adjustment reason (theft/loss more sensitive than count errors)
  - User role (stock clerk vs warehouse manager)

#### 2. Implement Authorization Check Method
- Create `requires_authorization(adjustment_data, user)` method
- Input: product, quantity, reason, cost, user
- Output: boolean + required permission level
- Consider cumulative adjustments over time period

#### 3. Create Permission Levels
- Define permission hierarchy:
  - LEVEL_1: Stock clerk (up to $100, count errors only)
  - LEVEL_2: Supervisor (up to $500, most reasons)
  - LEVEL_3: Warehouse Manager (up to $2000, all reasons)
  - LEVEL_4: Operations Director (unlimited)

#### 4. Implement Approval Queue
- Create view/endpoint to list pending adjustment requests
- Filter by required permission level
- Show: requester, product, quantity, value, reason, date
- Allow approve/reject actions

#### 5. Add Multi-Level Approval
- Support chain approval for very high value
- E.g., >$5000 requires both Manager AND Director
- Track approval chain in AdjustmentRequest model
- Send notifications at each level

#### 6. Create Denial Handling
- When adjustment denied, notify requester
- Record denial reason from approver
- Allow requester to revise and resubmit
- Maintain full approval/denial history

### Validation Checklist
- [ ] Authorization rules clearly defined
- [ ] Permission levels mapped to roles
- [ ] Approval queue functional
- [ ] Multi-level approval works correctly
- [ ] Denials handled gracefully
- [ ] Audit trail includes all approvals/denials

---

## Task 51: Create Batch Stock Operations

**Complexity:** High | **Time Estimate:** 30 min

### Objective
Enable processing multiple stock operations in a single atomic transaction for efficiency and data consistency.

### Instructions

#### 1. Create BatchStockOperation Model
- Define model to represent batch operation
- Fields: `operation_type` (IN, OUT, TRANSFER, ADJUST), `status`, `started_at`, `completed_at`
- Add `total_items`, `processed_items`, `failed_items` counters
- Include `created_by` FK to User

#### 2. Implement Batch Input Validation
- Create `BatchStockService` class
- Method: `validate_batch(operations_list)` 
- Check each operation for:
  - Valid products and warehouses
  - Sufficient stock for outs/transfers
  - Data type and format correctness
- Return validation results with errors per operation

#### 3. Create Batch Execution Method
- Implement `execute_batch(operations_list, user, fail_fast=False)`
- Wrap entire batch in database transaction
- If `fail_fast=True`, rollback on first error
- If `fail_fast=False`, skip failed items but continue

#### 4. Implement Atomic Transaction Handling
- Use `transaction.atomic()` decorator
- For fail_fast=False, use savepoints for each item
- Rollback individual item on error, continue batch
- Commit successful items at end

#### 5. Add Progress Tracking
- For large batches, implement progress reporting
- Use cache or database to store progress
- Allow querying batch status: PENDING, PROCESSING, COMPLETED, FAILED
- Show percentage complete and estimated time remaining

#### 6. Create Batch Results Export
- Generate detailed report of batch execution
- Include: successful items, failed items with reasons
- Export as CSV or Excel for review
- Store batch logs for audit purposes

### Validation Checklist
- [ ] Batch operations are atomic (all or nothing) when required
- [ ] Individual failures don't corrupt batch data
- [ ] Progress tracking accurate and accessible
- [ ] Results exportable and detailed
- [ ] Large batches (1000+ items) perform well
- [ ] Concurrent batch executions handled safely

---

## Task 52: Add Operation Result Model

**Complexity:** Medium | **Time Estimate:** 20 min

### Objective
Create structured result object to return from stock operations with success status, data, and error details.

### Instructions

#### 1. Define OperationResult Class
- Create `apps/inventory/stock/results.py`
- Define dataclass or simple class for operation results
- Fields: `success` (bool), `operation_type`, `timestamp`, `data`, `errors`, `warnings`

#### 2. Add Success Result Factory
- Class method: `OperationResult.success(operation_type, data=None, warnings=None)`
- Set success=True
- Include operation-specific data (movement ID, updated quantity, etc.)
- Optional warnings for non-critical issues

#### 3. Add Failure Result Factory
- Class method: `OperationResult.failure(operation_type, errors)`
- Set success=False
- Include structured error information
- Error structure: code, message, field (if applicable)

#### 4. Create Batch Result Class
- Define `BatchOperationResult` for batch operations
- Fields: `total_count`, `success_count`, `failure_count`, `results_list`
- Method: `get_failed_items()` returns list of failures
- Method: `get_summary()` returns aggregate statistics

#### 5. Add Result Serialization
- Implement `to_dict()` method for JSON serialization
- Support for API responses
- Include all relevant data for client consumption
- Sanitize sensitive information

#### 6. Create Result Helper Methods
- `has_warnings()` - check if operation succeeded with warnings
- `get_error_messages()` - extract error messages list
- `raise_if_failed()` - raise exception if operation failed
- `merge_results()` - combine multiple operation results

### Validation Checklist
- [ ] Result objects clearly indicate success/failure
- [ ] Error information detailed and actionable
- [ ] Warnings properly distinguished from errors
- [ ] Batch results aggregate individual results
- [ ] Serialization works for API responses
- [ ] Helper methods simplify result handling

---

## Expected Outcomes

After completing Tasks 49-52:

### Files Created
- `apps/inventory/stock/services/adjustment.py` (extended)
- `apps/inventory/stock/services/batch.py` (new)
- `apps/inventory/stock/results.py` (new)
- `apps/inventory/stock/authorization.py` (new)

### New Functionality
1. **Negative Adjustments** - Stock reduction with strict controls
2. **Authorization System** - Multi-level approval workflow
3. **Batch Operations** - Process hundreds/thousands of operations efficiently
4. **Result Model** - Consistent operation response structure

### Authorization Matrix Example

| User Role | Max Value | Allowed Reasons | Approval Required |
|-----------|-----------|----------------|-------------------|
| Stock Clerk | $100 | Count errors | No |
| Supervisor | $500 | Count errors, Found | Manager approval >$500 |
| Warehouse Manager | $2,000 | All except theft | Director approval >$2,000 |
| Operations Director | Unlimited | All | No |

### Batch Operation Flow

```
[Receive batch request]
         │
         ▼
[Validate all operations]
         │
         ▼
[Begin transaction]
         │
         ▼
[Process each operation]
    │         │
    ▼         ▼
[Success] [Failure]
    │         │
    └────┬────┘
         ▼
[Commit/Rollback based on strategy]
         │
         ▼
[Return BatchOperationResult]
```

### Integration Points
- Permission/Role system for authorization
- Notification service for approval requests
- File storage for adjustment documentation
- Queue system for async batch processing

### Performance Considerations
- Batch operations use bulk_create/bulk_update where possible
- Lock contention minimized with select_for_update(nowait=True)
- Large batches processed asynchronously with Celery
- Progress tracking uses cache instead of repeated DB queries

---

## Progress Tracking

- [ ] Task 49: Negative adjustment implementation
- [ ] Task 50: Authorization and approval workflow
- [ ] Task 51: Batch stock operations
- [ ] Task 52: Operation result model

**Document Status:** Complete | **Ready for Implementation:** Yes
