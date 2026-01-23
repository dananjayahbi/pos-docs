# Tasks 41-46: Stock Reservation & Order Editing

> **Phase:** 05 - ERP Core Modules Part 2  
> **SubPhase:** 05 - Order Management  
> **Group:** C - Order Creation & Sources  
> **Document:** 02 of 03  
> **Tasks Covered:** 41, 42, 43, 44, 45, 46

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [01_Tasks-35-40_Service-Creation-Sources.md](01_Tasks-35-40_Service-Creation-Sources.md)
- **→ Next Document:** [03_Tasks-47-50_History-Settings-Migration.md](03_Tasks-47-50_History-Settings-Migration.md)
- **→ Next Group:** [../Group-D_Fulfillment-Workflow/](../Group-D_Fulfillment-Workflow/)

---

## Document Overview

This document covers stock reservation logic when orders are confirmed, asynchronous stock reservation tasks using Celery, handling insufficient stock scenarios, order duplication, order editing capabilities, and edit locking rules.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 41 | Create Stock Reservation Logic | High | 30 min |
| 42 | Create Stock Reservation Celery Task | Medium | 25 min |
| 43 | Implement Stock Insufficient Handling | Medium | 25 min |
| 44 | Implement Order Duplication | Medium | 25 min |
| 45 | Implement Order Editing | Medium | 25 min |
| 46 | Add Edit Lock Logic | Medium | 20 min |

---

## Task 41: Create Stock Reservation Logic

### Overview
Implement stock reservation logic that reserves inventory when an order is confirmed. This prevents overselling by creating soft locks on inventory until the order is fulfilled.

### Dependencies
- Task 35: OrderService Class
- Inventory module (assumed to exist)

### Instructions

1. **Create stock service module**
   - Navigate to `apps/orders/services/` directory
   - Create `stock_service.py` file
   - This service coordinates with inventory module

2. **Import required dependencies**
   - Import InventoryItem model from inventory app
   - Import StockReservation model from inventory app
   - Import transaction decorators from Django
   - Import F expression for atomic updates
   - Import timezone utilities

3. **Define StockService class**
   - Create class named `StockService`
   - Add docstring explaining stock reservation purpose
   - This service handles all stock-related operations for orders

4. **Add stock availability check method**
   - Create method `check_availability(order)`
   - Query all line items for the order
   - For each line item:
     - Get product from line item
     - If product has track_inventory = False, skip
     - Query InventoryItem for product and tenant
     - Calculate available: quantity_on_hand - quantity_reserved
     - Compare available vs. line item quantity
     - Collect results: {line_item: available_quantity}
   - Return dict with availability per line item

5. **Add full availability verification**
   - Create method `is_fully_available(order)`
   - Call check_availability(order)
   - Loop through results
   - If any line item has insufficient stock, return False
   - If all items have sufficient stock, return True

6. **Add stock reservation method**
   - Create method `reserve_stock(order, user)`
   - Decorate with `@transaction.atomic`
   - Add select_for_update lock on inventory rows
   - Query line items for order
   - For each line item:
     - Get product
     - Skip if not tracking inventory
     - Lock InventoryItem row with select_for_update()
     - Check available stock again (within lock)
     - If sufficient: increment quantity_reserved by line quantity
     - Create StockReservation record
     - If insufficient: raise InsufficientStockError
   - Update order.stock_reserved_at timestamp
   - Save order
   - Return True

7. **Add stock release method**
   - Create method `release_stock(order, user)`
   - Decorate with `@transaction.atomic`
   - Query all StockReservation for order
   - For each reservation:
     - Get related InventoryItem
     - Decrement quantity_reserved by reservation quantity
     - Save InventoryItem
     - Delete or mark reservation as released
   - Clear order.stock_reserved_at
   - Save order
   - Return True

8. **Add partial reservation method**
   - Create method `reserve_partial(order, user)`
   - Similar to reserve_stock but doesn't raise error
   - Reserve what's available
   - Return dict: {reserved: [], unavailable: []}
   - Unavailable items list for backordering

9. **Add stock check with location method**
   - Create method `check_availability_by_location(order, location)`
   - Query InventoryItem filtered by location
   - Return availability per location
   - Useful for fulfillment planning

10. **Export StockService**
    - Add to services/__init__.py
    - Import StockService
    - Add to __all__ list

### Stock Reservation Flow

```
Order Confirmation Triggered
    │
    ▼
Check Stock Availability
    │
    ├─ All Available ──→ Reserve All Items
    │                         │
    │                         ▼
    │                   Lock Inventory Rows
    │                         │
    │                         ▼
    │                   Increment Reserved Qty
    │                         │
    │                         ▼
    │                   Create Reservation Records
    │                         │
    │                         ▼
    │                   Update Order Timestamp
    │                         │
    │                         ▼
    │                   Return Success
    │
    └─ Insufficient ──→ Handle (Task 43)
```

### Inventory Calculations

```
Available Stock = quantity_on_hand - quantity_reserved

Example:
Product: Widget A
- Quantity on hand: 100 units
- Quantity reserved: 30 units (from other orders)
- Available: 70 units

Order requests: 50 units
Result: ✅ Can reserve (50 <= 70)

Order requests: 80 units
Result: ❌ Insufficient (80 > 70)
```

### StockReservation Model Reference

```
StockReservation Model:
─────────────────────────────────────────
- id: UUID
- order: FK to Order
- order_line_item: FK to OrderLineItem
- inventory_item: FK to InventoryItem
- quantity: DecimalField
- reserved_at: DateTimeField
- reserved_by: FK to User
- released_at: DateTimeField (null)
- notes: TextField
```

### Database Locking Strategy

```sql
-- Use select_for_update to prevent race conditions
SELECT * FROM inventory_inventoryitem
WHERE product_id = 'xxx' AND tenant_id = 'yyy'
FOR UPDATE;

-- Then atomically update
UPDATE inventory_inventoryitem
SET quantity_reserved = quantity_reserved + 10
WHERE id = 'zzz';
```

### Error Handling

| Error Scenario | Handling |
|----------------|----------|
| Insufficient stock | Raise InsufficientStockError with details |
| Inventory not found | Raise ValueError |
| Reservation already exists | Skip or update |
| Database deadlock | Retry with exponential backoff |

### Multi-Location Consideration

```
Order: 50 units needed

Location A: 30 units available
Location B: 25 units available
Total: 55 units available across locations

Decision:
- Reserve from Location A: 30 units
- Reserve from Location B: 20 units
- Total reserved: 50 units
```

### Expected Outcomes
- StockService class created
- Stock availability checking implemented
- Atomic stock reservation working
- Stock release method functional
- Database locks preventing race conditions
- Reservation records created and linked

---

## Task 42: Create Stock Reservation Celery Task

### Overview
Create an asynchronous Celery task for stock reservation to handle long-running reservations without blocking the web request. This is especially important for high-traffic scenarios.

### Dependencies
- Task 41: Stock Reservation Logic
- Celery configuration (from Phase 03)

### Instructions

1. **Create tasks directory**
   - Navigate to `apps/orders/` directory
   - Create `tasks/` directory if not exists
   - Create `__init__.py` file
   - Create `stock_tasks.py` file

2. **Import required dependencies**
   - Import shared_task from celery
   - Import Order model
   - Import StockService
   - Import logging
   - Import timezone utilities

3. **Configure task logger**
   - Get logger instance: `logger = logging.getLogger(__name__)`
   - This logs task execution details

4. **Define reserve stock task**
   - Create function decorated with `@shared_task(bind=True, max_retries=3)`
   - Function signature: `reserve_stock_async(self, order_id, user_id=None)`
   - bind=True provides access to task instance
   - max_retries=3 allows retry on failure

5. **Implement task logic**
   - Try block:
     - Query Order by order_id
     - If not found, raise ValueError
     - Check order status is CONFIRMED
     - If not CONFIRMED, log warning and return
     - Query User by user_id if provided
     - Create StockService instance
     - Call stock_service.reserve_stock(order, user)
     - Log success: "Stock reserved for order {order_number}"
     - Return success dict with order details
   - Except InsufficientStockError:
     - Log error with order details
     - Update order notes with stock issue
     - Don't retry (stock won't appear)
     - Return failure dict
   - Except Exception as exc:
     - Log error with traceback
     - Retry with countdown: self.retry(exc=exc, countdown=30)
     - Countdown increases with each retry

6. **Add task progress tracking**
   - Update task state during execution
   - self.update_state(state='PROGRESS', meta={'current': step, 'total': total_steps})
   - This allows UI to show progress

7. **Add timeout handling**
   - Set task timeout: soft_time_limit=300, time_limit=330
   - If task exceeds limit, raise SoftTimeLimitExceeded
   - Catch and handle timeout gracefully

8. **Define release stock task**
   - Create function `release_stock_async(self, order_id, user_id=None)`
   - Similar structure to reserve task
   - Calls stock_service.release_stock(order, user)
   - Logs release actions

9. **Add bulk reservation task**
   - Create function `reserve_stock_bulk(self, order_ids)`
   - Loop through order_ids
   - Call reserve_stock_async.delay() for each
   - Use Celery group for parallel execution
   - Return task group ID for tracking

10. **Export tasks**
    - Add to tasks/__init__.py
    - Import all task functions
    - Add to __all__ list

### Celery Task Flow

```
Order Confirmation
    │
    ▼
Trigger Celery Task
    │
    └─→ reserve_stock_async.delay(order_id)
              │
              ▼
        Task Queued
              │
              ▼
        Worker Picks Up Task
              │
              ▼
        Execute Stock Reservation
              │
              ├─ Success ──→ Update Order
              │                    │
              │                    └─→ Log Success
              │
              ├─ Insufficient ──→ Log Error, Don't Retry
              │
              └─ Other Error ──→ Retry (max 3 times)
                                      │
                                      ├─ Retry 1 (wait 30s)
                                      ├─ Retry 2 (wait 60s)
                                      └─ Retry 3 (wait 90s)
                                            │
                                            └─ Max retries → Fail
```

### Task Invocation Examples

```python
# Asynchronous invocation (non-blocking)
task = reserve_stock_async.delay(order_id=order.id, user_id=user.id)
# Returns immediately with task ID

# Synchronous invocation (blocking, for testing)
result = reserve_stock_async.apply(args=[order.id])
# Waits for task to complete

# Scheduled invocation (delayed execution)
task = reserve_stock_async.apply_async(
    args=[order.id],
    countdown=60  # Execute after 60 seconds
)

# Bulk invocation (parallel)
from celery import group
job = group(
    reserve_stock_async.s(order_id) 
    for order_id in order_ids
)
result = job.apply_async()
```

### Task State Tracking

```
Task States:
─────────────────────────────────────────
PENDING    → Task queued, not yet started
STARTED    → Worker picked up task
PROGRESS   → Task executing (with metadata)
SUCCESS    → Task completed successfully
FAILURE    → Task failed (with error details)
RETRY      → Task retrying after failure
```

### Retry Strategy

```
Attempt 1: Execute immediately
    │
    Fail
    │
    ▼
Attempt 2: Wait 30 seconds, retry
    │
    Fail
    │
    ▼
Attempt 3: Wait 60 seconds, retry
    │
    Fail
    │
    ▼
Attempt 4: Wait 90 seconds, retry
    │
    Fail
    │
    ▼
Max Retries Exceeded → Mark as Failed
```

### Task Result Structure

```python
# Success result
{
    'status': 'SUCCESS',
    'order_id': 'uuid',
    'order_number': 'ORD-2026-00123',
    'reserved_items': 5,
    'reserved_at': '2026-01-23T10:30:00Z'
}

# Failure result
{
    'status': 'FAILED',
    'order_id': 'uuid',
    'order_number': 'ORD-2026-00123',
    'error': 'Insufficient stock for Product ABC',
    'details': {
        'product': 'ABC',
        'requested': 10,
        'available': 5
    }
}
```

### Monitoring and Logging

```python
# Task execution logging
logger.info(f"Starting stock reservation for order {order.order_number}")
logger.debug(f"Reserving {line_items.count()} line items")
logger.info(f"Stock reserved successfully for order {order.order_number}")
logger.error(f"Stock reservation failed: {error}", exc_info=True)
```

### Expected Outcomes
- Celery task for async stock reservation created
- Task retry logic implemented
- Task progress tracking functional
- Timeout handling implemented
- Task results structure defined
- Bulk reservation task working

---

## Task 43: Implement Stock Insufficient Handling

### Overview
Implement logic to handle scenarios where stock is insufficient to fulfill an order. Provide options for backordering, partial fulfillment, or order cancellation based on business rules.

### Dependencies
- Task 41: Stock Reservation Logic
- Task 42: Stock Reservation Celery Task

### Instructions

1. **Add insufficient stock exception**
   - Create `apps/orders/exceptions.py` file
   - Define custom exception: `InsufficientStockError`
   - Include details: product, requested, available
   - Include order line item reference

2. **Add handling method to StockService**
   - Open `stock_service.py`
   - Create method `handle_insufficient_stock(order, availability_dict, user)`
   - availability_dict from check_availability() method
   - Returns handling result with actions taken

3. **Check order settings for handling strategy**
   - Query OrderSettings for tenant
   - Get allow_backorder setting (default True)
   - Get allow_partial_fulfillment setting (default True)
   - Get cancel_on_insufficient_stock setting (default False)

4. **Implement backorder strategy**
   - If allow_backorder is True:
     - Create backorder for unavailable quantities
     - Reserve available stock immediately
     - Mark unavailable items as backordered
     - Set order status to PARTIALLY_CONFIRMED or BACKORDERED
     - Create backorder notification
     - Return success with backorder details

5. **Implement partial fulfillment strategy**
   - If allow_partial_fulfillment is True:
     - Reserve available stock
     - Split order into multiple parts
     - Create fulfillment for available items
     - Keep remaining items as pending
     - Update order status to PARTIALLY_FULFILLED
     - Return partial fulfillment details

6. **Implement cancellation strategy**
   - If cancel_on_insufficient_stock is True:
     - Don't reserve any stock
     - Set order status to CANCELLED
     - Set cancellation reason to INSUFFICIENT_STOCK
     - Release any reserved stock
     - Notify customer of cancellation
     - Return cancellation details

7. **Implement manual review strategy**
   - Default strategy if no auto-handling
   - Don't reserve any stock
   - Set order status to PENDING_REVIEW
   - Assign to inventory manager for review
   - Create notification for review queue
   - Return pending review status

8. **Add low stock warning method**
   - Create method `check_low_stock_warnings(order)`
   - For each line item, check if stock falls below threshold
   - OrderSettings.low_stock_threshold (default 10)
   - Create warning notifications for inventory team
   - Don't block order, just notify

9. **Add alternative product suggestions**
   - Create method `suggest_alternatives(order, unavailable_items)`
   - For each unavailable item, query similar products
   - Check if alternatives have stock
   - Return list of suggestions
   - This can be shown to customer for substitution

10. **Add notification creation**
    - Create method `notify_insufficient_stock(order, details)`
    - Send email to customer with details
    - Send notification to inventory team
    - Log to OrderHistory
    - Details include: what's unavailable, expected restock date

### Handling Strategy Decision Tree

```
Insufficient Stock Detected
    │
    ▼
Check OrderSettings Strategy
    │
    ├─ allow_backorder = True
    │       │
    │       ▼
    │   Reserve Available Stock
    │       │
    │       ▼
    │   Create Backorder for Rest
    │       │
    │       ▼
    │   Status: BACKORDERED
    │
    ├─ allow_partial_fulfillment = True
    │       │
    │       ▼
    │   Reserve Available Stock
    │       │
    │       ▼
    │   Split Order
    │       │
    │       ▼
    │   Status: PARTIALLY_FULFILLED
    │
    ├─ cancel_on_insufficient_stock = True
    │       │
    │       ▼
    │   Don't Reserve
    │       │
    │       ▼
    │   Cancel Order
    │       │
    │       ▼
    │   Status: CANCELLED
    │
    └─ Default (Manual Review)
            │
            ▼
        Don't Reserve
            │
            ▼
        Status: PENDING_REVIEW
            │
            ▼
        Assign to Manager
```

### Backorder Implementation

```
Order: 100 units requested
Available: 60 units

Backorder Strategy:
─────────────────────────────────────────
1. Reserve 60 units immediately
2. Create Backorder record:
   - Quantity: 40 units
   - Expected date: Restock date
   - Status: PENDING
3. Update order status: BACKORDERED
4. Notify customer:
   "60 units will ship immediately
    40 units backordered (ETA: 2026-02-01)"
```

### Partial Fulfillment Implementation

```
Order: 3 line items
Item A: 100 units (80 available)
Item B: 50 units (50 available)
Item C: 20 units (0 available)

Partial Fulfillment:
─────────────────────────────────────────
Fulfillment 1 (immediate):
- Item A: 80 units
- Item B: 50 units

Fulfillment 2 (pending):
- Item A: 20 units (wait for restock)
- Item C: 20 units (wait for restock)

Status: PARTIALLY_FULFILLED
```

### Backorder Model Reference

```
Backorder Model:
─────────────────────────────────────────
- id: UUID
- order: FK to Order
- order_line_item: FK to OrderLineItem
- quantity_backordered: DecimalField
- quantity_fulfilled: DecimalField
- expected_date: DateField
- status: PENDING, FULFILLED, CANCELLED
- created_at: DateTimeField
- fulfilled_at: DateTimeField
- notes: TextField
```

### Customer Notification Examples

**Backorder Notification:**
```
Subject: Order ORD-2026-00123 - Partial Backorder

Dear Customer,

Your order has been confirmed with the following status:

Available Now:
- Product A: 60 units - Will ship today
- Product B: 20 units - Will ship today

Backordered:
- Product A: 40 units - Expected: Feb 1, 2026

We'll ship the available items immediately and send the 
backordered items as soon as they're in stock.
```

**Insufficient Stock Cancellation:**
```
Subject: Order ORD-2026-00124 - Unable to Fulfill

Dear Customer,

Unfortunately, we cannot fulfill your order due to 
insufficient stock:

Requested:
- Product C: 100 units

Available:
- Product C: 30 units

Your order has been cancelled and no charges were made.

Would you like to order the available 30 units instead?
```

### Alternative Product Suggestions

```python
unavailable_item = {
    'product': 'Widget Pro 2000',
    'requested': 100,
    'available': 0
}

alternatives = [
    {
        'product': 'Widget Pro 2500',  # Newer model
        'available': 150,
        'price_diff': '+LKR 500'
    },
    {
        'product': 'Widget Standard 2000',  # Lower tier
        'available': 200,
        'price_diff': '-LKR 300'
    }
]
```

### Expected Outcomes
- Insufficient stock handling implemented
- Multiple strategies supported (backorder, partial, cancel, review)
- Backorder creation working
- Partial fulfillment logic functional
- Customer notifications sent
- Alternative product suggestions provided

---

## Task 44: Implement Order Duplication

### Overview
Implement order duplication functionality to allow users to create a new order based on an existing one. This is useful for repeat orders with modifications.

### Dependencies
- Task 36: Manual Order Creation

### Instructions

1. **Add duplication method to OrderService**
   - Open `order_service.py`
   - Create method `duplicate_order(order_id, user, modifications=None)`
   - Decorate with `@transaction.atomic`

2. **Fetch and validate source order**
   - Query Order by order_id
   - Raise ValueError if not found
   - Check user has permission to view order
   - Load order with all related data: line items, addresses

3. **Extract order data**
   - Create data dict from source order:
     - customer: same customer
     - notes: f"Duplicated from {source_order.order_number}"
     - shipping_address: copy from source
     - billing_address: copy from source
     - shipping_charges: copy from source
     - discount_amount: Decimal('0.00') (reset discounts)
     - payment_terms: copy from source
     - priority: copy from source

4. **Apply modifications if provided**
   - If modifications dict is provided:
     - Update data dict with modifications
     - Allow changing: customer, addresses, notes, charges
     - Don't allow changing: source, status (always new draft)

5. **Extract line items from source order**
   - Query OrderLineItem for source order
   - Create items_data list
   - For each line item, create dict:
     - product: same product
     - quantity: same quantity
     - unit_price: current product price (not historical)
     - discount_percent: Decimal('0.00') (reset discounts)
     - notes: line_item.notes

6. **Check product availability**
   - For each line item, verify product still exists
   - Verify product is still active
   - If product inactive, skip with warning
   - Collect warnings list for unavailable products

7. **Create new order**
   - Call `create_order(data, items_data, user, auto_confirm=False)`
   - New order starts in PENDING status
   - Returns new order instance

8. **Link to source order**
   - Set new_order.duplicated_from to source_order
   - Save new order

9. **Log duplication event**
   - Log on source order: "Duplicated to {new_order.order_number}"
   - Log on new order: "Duplicated from {source_order.order_number}"

10. **Return new order with warnings**
    - Return tuple: (new_order, warnings_list)
    - Warnings include: unavailable products, price changes

### Order Duplication Flow

```
Source Order (any status)
    │
    ▼
Validate Access Permission
    │
    ▼
Extract Order Data
    │
    ▼
Extract Line Items
    │
    ▼
Apply Modifications (optional)
    │
    ▼
Check Product Availability
    │
    ├─ All Available ──→ Include All
    │
    └─ Some Unavailable ──→ Skip with Warning
                                │
                                ▼
                        Create New Order (PENDING)
                                │
                                ▼
                        Link to Source Order
                                │
                                ▼
                        Return (New Order, Warnings)
```

### Duplication Scenarios

**Scenario 1: Exact Duplicate**
```python
new_order, warnings = OrderService.duplicate_order(
    order_id=source_order.id,
    user=request.user
)
# Creates exact copy with current prices
```

**Scenario 2: Duplicate with Customer Change**
```python
modifications = {
    'customer': new_customer,
    'notes': 'For different customer'
}
new_order, warnings = OrderService.duplicate_order(
    order_id=source_order.id,
    user=request.user,
    modifications=modifications
)
```

**Scenario 3: Duplicate with Address Change**
```python
modifications = {
    'shipping_address': new_address,
    'notes': 'Ship to different location'
}
new_order, warnings = OrderService.duplicate_order(
    order_id=source_order.id,
    user=request.user,
    modifications=modifications
)
```

### Price Handling

```
Source Order (created Jan 1, 2026):
- Product A: LKR 1,000 (price at time)
- Product B: LKR 500 (price at time)

Duplicate Order (created Jan 23, 2026):
- Product A: LKR 1,100 (current price) ← Updated
- Product B: LKR 450 (current price) ← Updated

Warning: "Prices have changed since original order"
```

### Warnings List Examples

```python
warnings = [
    {
        'type': 'PRODUCT_UNAVAILABLE',
        'message': 'Product "Widget X" is no longer active',
        'product_sku': 'WGT-X-001'
    },
    {
        'type': 'PRICE_CHANGED',
        'message': 'Price changed from LKR 1,000 to LKR 1,100',
        'product_sku': 'WGT-A-001',
        'old_price': '1000.00',
        'new_price': '1100.00'
    },
    {
        'type': 'PRODUCT_OUT_OF_STOCK',
        'message': 'Product "Widget Y" is out of stock',
        'product_sku': 'WGT-Y-001',
        'available': 0
    }
]
```

### Data Fields Comparison

| Field | Source Order | Duplicated Order |
|-------|--------------|------------------|
| order_number | ORD-2026-00123 | ORD-2026-00789 (new) |
| status | COMPLETED | PENDING (always) |
| customer | John Doe | John Doe (or modified) |
| line items | Copy structure | Copy with current prices |
| unit_price | Historical | Current price |
| discounts | Copy amounts | Reset to 0 |
| addresses | Copy | Copy (or modified) |
| created_at | Jan 1, 2026 | Jan 23, 2026 (current) |
| created_by | User A | User B (duplicator) |
| duplicated_from | null | Order ID (link) |

### Use Cases

**Use Case 1: Monthly Recurring Order**
- Customer orders same items monthly
- Duplicate previous month's order
- Update quantity as needed
- Confirm and process

**Use Case 2: Bulk Order for Multiple Customers**
- Create order for Customer A
- Duplicate for Customer B, C, D
- Modify customer and shipping address
- Process all orders

**Use Case 3: Order Template**
- Create a "template" order with common items
- Duplicate when needed
- Modify quantities
- Add/remove items as needed

### Expected Outcomes
- duplicate_order() method functional
- New order created from source
- Current prices applied
- Source order linkage maintained
- Warnings returned for issues
- Modifications supported

---

## Task 45: Implement Order Editing

### Overview
Implement order editing functionality to allow modifications to orders before they are processed. Different fields are editable based on order status.

### Dependencies
- Task 46: Edit Lock Logic (for validation)

### Instructions

1. **Add edit method to OrderService**
   - Open `order_service.py`
   - Create method `edit_order(order_id, data, items_data, user)`
   - Decorate with `@transaction.atomic`

2. **Fetch and validate order**
   - Query Order by order_id
   - Raise ValueError if not found
   - Check user has permission to edit order
   - Call can_edit() method (Task 46) to check editability
   - Raise PermissionError if not editable

3. **Determine editable fields based on status**
   - PENDING status: all fields editable
   - CONFIRMED status: limited fields (quantity, items, notes)
   - PROCESSING+ status: not editable (locked)
   - Create editable_fields list based on status

4. **Validate edit data**
   - Check if requested changes are allowed
   - For each field in data:
     - If field not in editable_fields, raise ValueError
     - If field is editable, validate new value
   - Validate items_data if provided

5. **Apply order-level changes**
   - Update allowed order fields from data dict:
     - customer (PENDING only)
     - shipping_address
     - billing_address
     - notes (always editable)
     - shipping_charges (PENDING only)
     - discount_amount (PENDING only)
     - payment_terms (PENDING only)
     - priority

6. **Handle line item changes**
   - If items_data is provided:
     - PENDING status: can add, remove, modify items
     - CONFIRMED status: can only modify quantities
     - For each item change:
       - If adding: create new OrderLineItem
       - If removing: delete OrderLineItem
       - If modifying: update existing OrderLineItem
   - Validate each change

7. **Recalculate totals**
   - After all changes applied:
     - Call `_calculate_order_totals(order)`
     - Updates subtotal, tax, grand_total

8. **Handle stock reservation updates**
   - If order is CONFIRMED and items changed:
     - Release old stock reservations
     - Create new stock reservations with updated quantities
     - Call StockService methods
   - If insufficient stock for new quantities:
     - Raise InsufficientStockError
     - Rollback all changes

9. **Log edit event**
   - Create OrderHistory entry
   - Log what changed: field, old value, new value
   - Include user who made edit
   - Include timestamp

10. **Save and return order**
    - Save order with all changes
    - Refresh from database
    - Return updated order instance

### Edit Permissions by Status

```
Order Status         Editable Fields
─────────────────────────────────────────────────────
PENDING             ✅ All fields
                    ✅ Add/remove/modify items
                    ✅ Change customer
                    ✅ Change pricing

CONFIRMED           ⚠️ Limited fields
                    ✅ Notes, priority
                    ⚠️ Quantities (within stock limits)
                    ⚠️ Add items (if stock available)
                    ❌ Cannot change customer
                    ❌ Cannot change pricing

PROCESSING          ❌ Locked
                    ✅ Notes only (with manager override)

SHIPPED             ❌ Fully locked
                    ❌ Use returns instead

DELIVERED           ❌ Fully locked
                    ❌ Use returns instead

COMPLETED           ❌ Fully locked
                    ❌ Historical record

CANCELLED           ❌ Locked
                    ❌ Cannot edit cancelled order
```

### Order Edit Flow

```
Edit Request
    │
    ▼
Fetch Order
    │
    ▼
Check Edit Permission (can_edit)
    │
    ├─ Not Editable ──→ Raise PermissionError
    │
    └─ Editable ──→ Continue
                        │
                        ▼
                Determine Editable Fields
                        │
                        ▼
                Validate Changes
                        │
                        ▼
                Apply Order Changes
                        │
                        ▼
                Apply Line Item Changes
                        │
                        ▼
                Recalculate Totals
                        │
                        ▼
                Update Stock Reservations (if CONFIRMED)
                        │
                        ▼
                Log Edit Event
                        │
                        ▼
                Save Order
                        │
                        ▼
                Return Updated Order
```

### Edit Request Structure

```python
data = {
    'notes': 'Updated delivery instructions',
    'priority': 'HIGH',
    'shipping_address': new_address_dict,
    # ... other fields
}

items_data = [
    {
        'id': 'line_item_uuid',  # Existing item
        'action': 'UPDATE',
        'quantity': 10  # Changed from 5
    },
    {
        'action': 'CREATE',  # New item
        'product': product_id,
        'quantity': 3,
        'unit_price': Decimal('500.00')
    },
    {
        'id': 'line_item_uuid_2',  # Existing item
        'action': 'DELETE'
    }
]
```

### Line Item Change Handling

**Add New Item (PENDING status):**
```
Order Status: PENDING
Action: Add Product C (5 units)

Steps:
1. Validate product exists and is active
2. Create new OrderLineItem
3. Link to order
4. Recalculate order totals
5. No stock reservation yet (order not confirmed)
```

**Modify Quantity (CONFIRMED status):**
```
Order Status: CONFIRMED
Action: Increase Product A from 5 to 10 units

Steps:
1. Check can modify quantities (Task 46)
2. Check stock availability for +5 units
3. If available:
   - Update line item quantity
   - Update stock reservation (+5 units)
   - Recalculate totals
4. If not available:
   - Raise InsufficientStockError
   - Rollback changes
```

**Remove Item:**
```
Order Status: PENDING
Action: Remove Product B

Steps:
1. Find OrderLineItem for Product B
2. Delete line item
3. Recalculate order totals
4. If CONFIRMED: Release stock reservation
```

### Stock Reservation Update

```
Original Order (CONFIRMED):
- Product A: 5 units (reserved)
- Product B: 10 units (reserved)

Edit Request:
- Product A: 10 units (increase)
- Product B: 5 units (decrease)

Stock Update:
1. Release old reservations
   - Product A: -5 units reserved
   - Product B: -10 units reserved

2. Create new reservations
   - Product A: +10 units reserved
   - Product B: +5 units reserved

Net Change:
- Product A: +5 units reserved
- Product B: -5 units released
```

### History Logging Example

```
OrderHistory Entry:
─────────────────────────────────────────
Event Type: UPDATED
User: john.doe@example.com
Timestamp: 2026-01-23 10:30:00

Changes:
- quantity changed: 5 → 10 (Product A)
- notes changed: "Standard delivery" → "Urgent delivery"
- priority changed: MEDIUM → HIGH

Previous Values (JSON):
{
    "quantity_product_a": 5,
    "notes": "Standard delivery",
    "priority": "MEDIUM"
}

New Values (JSON):
{
    "quantity_product_a": 10,
    "notes": "Urgent delivery",
    "priority": "HIGH"
}
```

### Validation Rules

| Validation | PENDING | CONFIRMED | PROCESSING+ |
|------------|---------|-----------|-------------|
| Customer change | ✅ | ❌ | ❌ |
| Add items | ✅ | ✅ (with stock check) | ❌ |
| Remove items | ✅ | ⚠️ (partial restrictions) | ❌ |
| Increase quantity | ✅ | ✅ (with stock check) | ❌ |
| Decrease quantity | ✅ | ✅ | ❌ |
| Change pricing | ✅ | ❌ | ❌ |
| Change addresses | ✅ | ✅ | ❌ |
| Change notes | ✅ | ✅ | ⚠️ (manager only) |

### Expected Outcomes
- edit_order() method functional
- Status-based field restrictions enforced
- Line item modifications working
- Stock reservations updated
- Totals recalculated
- Edit history logged

---

## Task 46: Add Edit Lock Logic

### Overview
Implement logic to determine when an order can or cannot be edited based on its status and workflow state. This prevents modifications to orders that are being processed or have been fulfilled.

### Dependencies
- Task 18: Order Model with status field

### Instructions

1. **Add can_edit method to Order model**
   - Open `apps/orders/models/order.py`
   - Add instance method `can_edit(user=None, check_permissions=True)`
   - Returns tuple: (can_edit: bool, reason: str)

2. **Define non-editable statuses**
   - Create class constant `NON_EDITABLE_STATUSES`
   - Include: PROCESSING, PICKING, PACKING, SHIPPED, DELIVERED, COMPLETED
   - These statuses lock the order

3. **Check order status**
   - If status in NON_EDITABLE_STATUSES:
     - Return (False, "Order is being processed and cannot be edited")
   - If status is CANCELLED:
     - Return (False, "Cancelled orders cannot be edited")

4. **Check if order has shipments**
   - Query Fulfillment records for order
   - If any fulfillment exists with status != CANCELLED:
     - Return (False, "Order has active shipments and cannot be edited")

5. **Check if order has payments**
   - Query PaymentTransaction for order
   - If payment status is COMPLETED:
     - Allow only limited edits
     - Return (True, "Limited edits allowed - payment received")
   - Full edits require payment reversal

6. **Check user permissions if requested**
   - If check_permissions is True and user provided:
     - Check if user has 'orders.change_order' permission
     - If not, return (False, "User does not have permission to edit orders")
     - Check if user is order creator or has manager role
     - Managers can override some restrictions

7. **Check if order is locked manually**
   - Add 'is_locked' boolean field to Order model (migration needed)
   - If is_locked is True:
     - Return (False, "Order is manually locked")
   - Locked by user/admin for specific reasons

8. **Define editable fields by status**
   - Create method `get_editable_fields()`
   - Returns list of field names editable in current status
   - PENDING: all fields
   - CONFIRMED: limited fields
   - PROCESSING+: none (or notes only with override)

9. **Add manager override capability**
   - Create method `can_edit_with_override(user)`
   - Checks if user is manager/admin
   - Managers can edit notes and priority even when locked
   - Requires audit log entry

10. **Add edit lock toggle methods**
    - Add method `lock_order(user, reason)`
    - Sets is_locked to True
    - Records lock reason and user
    - Add method `unlock_order(user, reason)`
    - Sets is_locked to False
    - Requires manager permission

### Edit Lock Decision Tree

```
Can Order Be Edited?
    │
    ├─ Status in [PROCESSING, SHIPPED, DELIVERED, COMPLETED]?
    │       │
    │       Yes → ❌ Locked (being fulfilled/completed)
    │
    ├─ Status = CANCELLED?
    │       │
    │       Yes → ❌ Locked (cannot edit cancelled order)
    │
    ├─ Has Active Fulfillments?
    │       │
    │       Yes → ❌ Locked (shipments in progress)
    │
    ├─ Payment COMPLETED?
    │       │
    │       Yes → ⚠️ Limited Edit (payment constraints)
    │
    ├─ Manually Locked?
    │       │
    │       Yes → ❌ Locked (admin override)
    │
    ├─ User Has Permission?
    │       │
    │       No → ❌ Locked (permission denied)
    │
    └─ Default → ✅ Editable
```

### Editable Fields by Status

```python
def get_editable_fields(self):
    """Returns list of editable fields based on order status."""
    
    if self.status == 'PENDING':
        return [
            'customer', 'shipping_address', 'billing_address',
            'notes', 'priority', 'payment_terms',
            'shipping_charges', 'discount_amount',
            'line_items'  # Full control
        ]
    
    elif self.status == 'CONFIRMED':
        return [
            'shipping_address', 'billing_address',
            'notes', 'priority',
            'line_items_quantity'  # Limited control
        ]
    
    elif self.status in ['PROCESSING', 'PICKING', 'PACKING']:
        # Only with manager override
        return ['notes', 'priority']
    
    else:
        # SHIPPED, DELIVERED, COMPLETED, CANCELLED
        return []  # Not editable
```

### Lock Reasons

```
Manual Lock Reasons:
─────────────────────────────────────────
FRAUD_REVIEW      - Order flagged for fraud review
PAYMENT_PENDING   - Awaiting payment confirmation
CUSTOMER_REQUEST  - Customer requested order hold
INVENTORY_ISSUE   - Stock verification needed
CUSTOM_WORK       - Custom work in progress
MANAGEMENT_REVIEW - Requires management approval
```

### Manager Override Scenarios

**Scenario 1: Emergency Address Change**
```
Order Status: PROCESSING
Lock Status: Locked (being picked)
Manager Request: Change shipping address

Action:
1. Check user is manager
2. Allow address change with override
3. Log: "Manager override - address change during processing"
4. Notify warehouse team
```

**Scenario 2: Add Urgent Notes**
```
Order Status: SHIPPED
Lock Status: Locked (in transit)
Manager Request: Add delivery instructions

Action:
1. Check user is manager
2. Allow notes field edit only
3. Log: "Manager override - added delivery notes"
4. Notify delivery team
```

### Order Model Additions

```python
class Order(models.Model):
    # ... existing fields ...
    
    # Lock fields
    is_locked = models.BooleanField(default=False)
    locked_at = models.DateTimeField(null=True, blank=True)
    locked_by = models.ForeignKey(User, null=True, on_delete=models.SET_NULL)
    lock_reason = models.CharField(max_length=50, choices=LOCK_REASONS)
    lock_notes = models.TextField(blank=True)
    
    def can_edit(self, user=None, check_permissions=True):
        """Check if order can be edited."""
        # Implementation from instructions above
        pass
    
    def get_editable_fields(self):
        """Get list of editable fields for current status."""
        # Implementation from instructions above
        pass
    
    def lock_order(self, user, reason, notes=''):
        """Manually lock order from editing."""
        if not user.has_perm('orders.lock_order'):
            raise PermissionError("User cannot lock orders")
        
        self.is_locked = True
        self.locked_at = timezone.now()
        self.locked_by = user
        self.lock_reason = reason
        self.lock_notes = notes
        self.save()
        
        # Log lock event
        self._log_event('LOCKED', f'Order locked: {reason}', user)
    
    def unlock_order(self, user, reason=''):
        """Unlock order for editing."""
        if not user.has_perm('orders.unlock_order'):
            raise PermissionError("User cannot unlock orders")
        
        self.is_locked = False
        self.locked_at = None
        self.locked_by = None
        self.lock_reason = ''
        self.lock_notes = reason
        self.save()
        
        # Log unlock event
        self._log_event('UNLOCKED', f'Order unlocked: {reason}', user)
```

### Usage Examples

```python
# Check if order can be edited
can_edit, reason = order.can_edit(user=request.user)
if not can_edit:
    raise PermissionError(reason)

# Get editable fields
editable_fields = order.get_editable_fields()
# Only update fields in editable_fields list

# Manager override
if user.is_manager and order.status == 'PROCESSING':
    # Allow limited edit with audit
    order.notes = "Urgent: Deliver to back entrance"
    order.save()
    log_manager_override(order, user, 'notes_update')

# Manual lock
order.lock_order(
    user=admin_user,
    reason='FRAUD_REVIEW',
    notes='Suspicious transaction flagged by system'
)

# Manual unlock
order.unlock_order(
    user=manager_user,
    reason='Fraud review completed - order verified'
)
```

### Permission Checks

```python
# Required permissions
PERMISSIONS = [
    'orders.view_order',        # View orders
    'orders.add_order',         # Create orders
    'orders.change_order',      # Edit orders
    'orders.delete_order',      # Delete draft orders
    'orders.lock_order',        # Lock orders
    'orders.unlock_order',      # Unlock orders
    'orders.override_lock',     # Override lock restrictions
]

# Permission checks
if user.has_perm('orders.change_order'):
    # User can edit orders (if not locked)
    pass

if user.has_perm('orders.override_lock'):
    # Manager can override lock restrictions
    pass
```

### Expected Outcomes
- can_edit() method implemented
- Edit locks enforced by status
- Manual lock/unlock functionality
- Manager override capability
- Editable fields defined by status
- Permission checks integrated

---

## Cross-Task Integration

### Stock Reservation Workflow

```
Order Confirmation (Task 57)
    │
    ▼
Check Stock Availability (Task 41)
    │
    ├─ All Available ──→ Reserve Stock (Task 41)
    │                         │
    │                         └─→ Create Reservations
    │
    └─ Insufficient ──→ Handle (Task 43)
                            │
                            ├─→ Backorder
                            ├─→ Partial Fulfill
                            ├─→ Cancel
                            └─→ Manual Review
```

### Order Editing with Stock Updates

```
Edit Order (Task 45)
    │
    ▼
Check Can Edit (Task 46)
    │
    ├─ Locked ──→ Reject Edit
    │
    └─ Editable ──→ Apply Changes
                        │
                        ▼
                    Items Changed?
                        │
                        ├─ No ──→ Save Order
                        │
                        └─ Yes ──→ Update Stock (Task 41)
                                        │
                                        ├─→ Release Old
                                        └─→ Reserve New
```

### Async Reservation Flow

```
Order Confirmed
    │
    ▼
Trigger Async Task (Task 42)
    │
    └─→ reserve_stock_async.delay(order_id)
              │
              ▼
        Task Queue (Celery)
              │
              ▼
        Worker Executes
              │
              ├─→ Success: Update Order
              ├─→ Insufficient: Handle (Task 43)
              └─→ Error: Retry (max 3)
```

---

## Testing Checklist

### Task 41: Stock Reservation Logic
- [ ] Stock availability check accurate
- [ ] Full reservation creates records
- [ ] Partial reservation handles correctly
- [ ] Stock release removes reservations
- [ ] Database locks prevent race conditions
- [ ] Multi-location reservation works

### Task 42: Celery Stock Task
- [ ] Task queues successfully
- [ ] Task executes reservation
- [ ] Task retries on failure
- [ ] Task handles timeout
- [ ] Task results structure correct
- [ ] Bulk reservation works

### Task 43: Insufficient Stock Handling
- [ ] Backorder strategy works
- [ ] Partial fulfillment works
- [ ] Cancellation strategy works
- [ ] Manual review strategy works
- [ ] Notifications sent
- [ ] Alternative suggestions provided

### Task 44: Order Duplication
- [ ] Order duplicates successfully
- [ ] Current prices applied
- [ ] Modifications applied
- [ ] Warnings returned
- [ ] Source linkage maintained
- [ ] Inactive products skipped

### Task 45: Order Editing
- [ ] Edit allowed when editable
- [ ] Edit rejected when locked
- [ ] Field restrictions enforced
- [ ] Line items update correctly
- [ ] Stock reservations update
- [ ] Totals recalculate
- [ ] History logged

### Task 46: Edit Lock Logic
- [ ] can_edit() returns correct status
- [ ] Status locks enforced
- [ ] Manual lock/unlock works
- [ ] Manager override works
- [ ] Editable fields correct per status
- [ ] Permissions checked

---

## Summary

This document implemented stock reservation and order editing capabilities:

**Completed:**
- ✅ Stock reservation logic with database locking
- ✅ Async Celery tasks for reservation
- ✅ Insufficient stock handling strategies
- ✅ Order duplication with modifications
- ✅ Order editing with status restrictions
- ✅ Edit locking based on workflow state

**Key Achievements:**
- Stock reservation prevents overselling
- Async processing for high traffic
- Multiple handling strategies for stock issues
- Order duplication for repeat orders
- Flexible editing with safety locks
- Audit trail for all changes

**Next Steps:**
- Proceed to [03_Tasks-47-50_History-Settings-Migration.md](03_Tasks-47-50_History-Settings-Migration.md) for history tracking and settings
- Implement OrderHistory model
- Add automated history logging
- Configure tenant-level order settings
