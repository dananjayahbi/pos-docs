# Tasks 73-77: Return Service & Workflow

> **Phase:** 05 - ERP Core Modules Part 2  
> **SubPhase:** 05 - Order Management  
> **Group:** E - Returns & Cancellations  
> **Document:** 02 of 03  
> **Tasks Covered:** 73, 74, 75, 76, 77

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [01_Tasks-67-72_Return-Models.md](01_Tasks-67-72_Return-Models.md)
- **→ Next Document:** [03_Tasks-78-80_Cancellation.md](03_Tasks-78-80_Cancellation.md)

---

## Document Overview

This document covers the return service layer that handles the complete return workflow from initial request through refund completion.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 73 | Create ReturnService Class | High | 30 min |
| 74 | Implement Return Request | Medium | 25 min |
| 75 | Implement Return Approval | Medium | 25 min |
| 76 | Implement Return Receipt | Medium | 25 min |
| 77 | Implement Stock Restoration | High | 30 min |

---

## Task 73: Create ReturnService Class

### Overview
Create the ReturnService class to encapsulate all return-related business logic.

### Dependencies
- OrderReturn models (Group E, Tasks 67-72)

### Instructions

1. **Create return service file**
   - Create `apps/orders/services/return_service.py`

2. **Import dependencies**
   - Import Django components
   - Import OrderReturn, ReturnLineItem models
   - Import Order model
   - Import transaction utilities

3. **Define ReturnService class**
   - No inheritance needed

4. **Add initialization**
   - Store order instance if provided
   - Store user context

5. **Add utility methods**
   - `_validate_return_eligibility(order)`
   - `_calculate_return_window(order)`
   - `_check_return_policy(order, reason)`

6. **Plan method stubs**
   - `create_return_request()` - Task 74
   - `approve_return()` - Task 75
   - `reject_return()` - Task 75
   - `receive_return()` - Task 76
   - `restore_stock()` - Task 77
   - `process_refund()` - Future

7. **Export service**

### Service Structure

```python
# apps/orders/services/return_service.py

from django.db import transaction
from django.utils import timezone
from django.core.exceptions import ValidationError
from apps.orders.models import Order, OrderReturn, ReturnLineItem
from apps.orders.services.history_service import HistoryService

class ReturnService:
    """
    Service for managing order returns and RMA workflow.
    Handles return requests, approvals, receipts, and refunds.
    """
    
    def __init__(self, order=None, user=None):
        """
        Initialize return service.
        
        Args:
            order: Order instance (optional)
            user: User performing actions
        """
        self.order = order
        self.user = user
    
    # Utility Methods
    
    def _validate_return_eligibility(self, order):
        """
        Check if order is eligible for returns.
        
        Raises:
            ValidationError if not eligible
        """
        # Check order status
        if order.status not in ['DELIVERED', 'COMPLETED']:
            raise ValidationError(
                "Order must be delivered before returns can be initiated."
            )
        
        # Check return window
        days_since_delivery = (timezone.now().date() - order.delivered_at.date()).days
        return_window = 30  # days (could be from settings)
        
        if days_since_delivery > return_window:
            raise ValidationError(
                f"Return window of {return_window} days has expired. "
                f"Order was delivered {days_since_delivery} days ago."
            )
        
        # Check if order was paid
        if order.payment_status != 'PAID':
            raise ValidationError("Only paid orders can be returned.")
        
        return True
    
    def _calculate_return_window(self, order):
        """Calculate remaining days in return window."""
        if not order.delivered_at:
            return 0
        
        days_since_delivery = (timezone.now().date() - order.delivered_at.date()).days
        return_window = 30
        return max(0, return_window - days_since_delivery)
    
    def _check_return_policy(self, order, reason):
        """
        Check if return reason is allowed per return policy.
        
        Some reasons may have different policies.
        """
        # Example: CHANGED_MIND may have shorter window
        if reason == OrderReturn.REASON_CHANGED_MIND:
            days_since_delivery = (timezone.now().date() - order.delivered_at.date()).days
            if days_since_delivery > 14:
                raise ValidationError(
                    "Returns for 'Changed Mind' are only accepted within 14 days."
                )
        
        return True
    
    # Method stubs (implemented in Tasks 74-77)
    
    def create_return_request(self, **kwargs):
        """Task 74: Create return request."""
        pass
    
    def approve_return(self, **kwargs):
        """Task 75: Approve return."""
        pass
    
    def reject_return(self, **kwargs):
        """Task 75: Reject return."""
        pass
    
    def receive_return(self, **kwargs):
        """Task 76: Mark return as received."""
        pass
    
    def restore_stock(self, **kwargs):
        """Task 77: Restore items to inventory."""
        pass
```

### Expected Outcomes
- ReturnService class created
- Utility methods for validation
- Method stubs for workflow
- Service structure established

---

## Task 74: Implement Return Request

### Overview
Implement the return request creation method for customers or staff to initiate returns.

### Dependencies
- Task 73: ReturnService Class

### Instructions

1. **Implement create_return_request method**
   - Parameters: order_id, items_data, reason, reason_notes, requested_by
   - items_data format: `[{'line_item_id': X, 'quantity': Y}, ...]`

2. **Fetch and validate order**
   - Get order by ID
   - Call `_validate_return_eligibility(order)`

3. **Validate items data**
   - Check all line items belong to order
   - Verify quantities don't exceed ordered
   - Check items haven't been fully returned already

4. **Create OrderReturn instance**
   - Use `@transaction.atomic`
   - Set order, reason, reason_notes, requested_by
   - Status defaults to REQUESTED

5. **Create ReturnLineItem instances**
   - For each item in items_data
   - Link to order_return and order_line_item
   - Set quantity

6. **Send notification**
   - Notify staff of new return request
   - Notify customer of request received

7. **Log return request event**
   - Use HistoryService

8. **Return created OrderReturn instance**

### Return Request Flow

```
Customer/Staff Initiates Return
    │
    ▼
Select Items to Return
    │
    ├─ Item A: 2 units
    ├─ Item B: 1 unit
    └─ Item C: 5 units
        │
        ▼
Select Return Reason
    │
    ├─ DEFECTIVE
    ├─ WRONG_ITEM
    └─ CHANGED_MIND
        │
        ▼
Provide Additional Notes
        │
        ▼
Create Return Request
        │
        ├─→ Generate RET-2026-00001
        ├─→ Create ReturnLineItems
        └─→ Set Status = REQUESTED
            │
            ▼
        Notify Staff for Approval
```

### Implementation Example

```python
@transaction.atomic
def create_return_request(self, order_id, items_data, reason, reason_notes='', requested_by=None):
    """
    Create a new return request.
    
    Args:
        order_id: ID of order being returned
        items_data: List of dicts with line_item_id and quantity
        reason: Return reason (one of REASON_CHOICES)
        reason_notes: Additional explanation
        requested_by: User creating the request
    
    Returns:
        OrderReturn instance
    """
    # Fetch order
    order = Order.objects.select_for_update().get(pk=order_id)
    
    # Validate eligibility
    self._validate_return_eligibility(order)
    self._check_return_policy(order, reason)
    
    # Validate items
    for item_data in items_data:
        line_item = OrderLineItem.objects.get(
            pk=item_data['line_item_id'],
            order=order
        )
        
        # Check quantity
        if item_data['quantity'] > line_item.quantity:
            raise ValidationError(
                f"Cannot return {item_data['quantity']} of {line_item.product.name}. "
                f"Only {line_item.quantity} were ordered."
            )
        
        # Check already returned
        already_returned = ReturnLineItem.objects.filter(
            order_line_item=line_item,
            order_return__status__in=['APPROVED', 'RECEIVED', 'REFUNDED']
        ).aggregate(total=Sum('quantity'))['total'] or 0
        
        available = line_item.quantity - already_returned
        if item_data['quantity'] > available:
            raise ValidationError(
                f"Only {available} of {line_item.product.name} available to return."
            )
    
    # Create return
    order_return = OrderReturn.objects.create(
        order=order,
        reason=reason,
        reason_notes=reason_notes,
        requested_by=requested_by or self.user,
        status=OrderReturn.STATUS_REQUESTED
    )
    
    # Create line items
    for item_data in items_data:
        line_item = OrderLineItem.objects.get(pk=item_data['line_item_id'])
        
        ReturnLineItem.objects.create(
            order_return=order_return,
            order_line_item=line_item,
            quantity=item_data['quantity'],
            refund_amount=line_item.unit_price * item_data['quantity']
        )
    
    # Send notifications
    self._send_return_request_notification(order_return)
    
    # Log event
    HistoryService.log_return_requested(
        order=order,
        order_return=order_return,
        user=requested_by or self.user
    )
    
    return order_return
```

### Expected Outcomes
- Return request creation working
- Validation preventing invalid returns
- Line items linked correctly
- Notifications sent

---

## Task 75: Implement Return Approval

### Overview
Implement return approval and rejection methods for staff to review and decide on return requests.

### Dependencies
- Task 74: Return Request

### Instructions

1. **Implement approve_return method**
   - Parameters: return_id, approved_by, approval_notes
   - Use `@transaction.atomic`

2. **Fetch and validate return**
   - Get OrderReturn by ID
   - Check status is REQUESTED

3. **Update return status**
   - Set status to APPROVED
   - Set approved_at timestamp
   - Set approved_by user
   - Set approval_notes

4. **Calculate refund amount**
   - Call `calculate_refund_amount()`
   - Update refund_amount field

5. **Generate return instructions**
   - Create return shipping label
   - Generate RMA documentation

6. **Send notification**
   - Notify customer of approval
   - Include return instructions

7. **Log approval event**

8. **Return updated OrderReturn**

9. **Implement reject_return method**
   - Similar structure for rejection
   - Set status to REJECTED
   - Set rejection_reason

### Approval Implementation

```python
@transaction.atomic
def approve_return(self, return_id, approved_by, approval_notes=''):
    """
    Approve a return request.
    
    Args:
        return_id: ID of return to approve
        approved_by: User approving the return
        approval_notes: Optional notes about approval
    
    Returns:
        Updated OrderReturn instance
    """
    # Fetch return
    order_return = OrderReturn.objects.select_for_update().get(pk=return_id)
    
    # Validate status
    if order_return.status != OrderReturn.STATUS_REQUESTED:
        raise ValidationError(
            f"Cannot approve return with status {order_return.status}."
        )
    
    # Update status
    order_return.status = OrderReturn.STATUS_APPROVED
    order_return.approved_at = timezone.now()
    order_return.approved_by = approved_by
    order_return.approval_notes = approval_notes
    
    # Calculate refund
    order_return.refund_amount = order_return.calculate_refund_amount()
    
    order_return.save()
    
    # Generate return label
    return_label = self._generate_return_label(order_return)
    
    # Send notification
    self._send_approval_notification(order_return, return_label)
    
    # Log event
    HistoryService.log_return_approved(
        order=order_return.order,
        order_return=order_return,
        user=approved_by
    )
    
    return order_return

@transaction.atomic
def reject_return(self, return_id, rejected_by, rejection_reason):
    """
    Reject a return request.
    
    Args:
        return_id: ID of return to reject
        rejected_by: User rejecting the return
        rejection_reason: Reason for rejection
    
    Returns:
        Updated OrderReturn instance
    """
    # Fetch return
    order_return = OrderReturn.objects.select_for_update().get(pk=return_id)
    
    # Validate status
    if order_return.status != OrderReturn.STATUS_REQUESTED:
        raise ValidationError(
            f"Cannot reject return with status {order_return.status}."
        )
    
    # Update status
    order_return.status = OrderReturn.STATUS_REJECTED
    order_return.rejected_at = timezone.now()
    order_return.rejection_reason = rejection_reason
    
    order_return.save()
    
    # Send notification
    self._send_rejection_notification(order_return)
    
    # Log event
    HistoryService.log_return_rejected(
        order=order_return.order,
        order_return=order_return,
        user=rejected_by,
        reason=rejection_reason
    )
    
    return order_return
```

### Approval Decision Flow

```
Return Request (REQUESTED)
    │
    ▼
Staff Review
    │
    ├─→ Valid Request?
    │    │
    │    ├─ Yes → APPROVE
    │    │    │
    │    │    ├─→ Calculate refund
    │    │    ├─→ Generate return label
    │    │    ├─→ Send instructions
    │    │    └─→ Status = APPROVED
    │    │
    │    └─ No → REJECT
    │         │
    │         ├─→ Record reason
    │         ├─→ Notify customer
    │         └─→ Status = REJECTED
    │
    └─ Review Checklist:
         □ Items match order
         □ Within return window
         □ Valid return reason
         □ Return policy met
         □ No abuse/fraud detected
```

### Expected Outcomes
- Approval method functional
- Rejection method functional
- Status transitions correct
- Notifications sent

---

## Task 76: Implement Return Receipt

### Overview
Implement return receipt marking to record when returned items are physically received and inspected.

### Dependencies
- Task 75: Return Approval

### Instructions

1. **Implement receive_return method**
   - Parameters: return_id, inspection_data, received_by
   - inspection_data format: `[{'line_item_id': X, 'condition': Y, 'notes': Z}, ...]`

2. **Fetch and validate return**
   - Get OrderReturn by ID
   - Check status is APPROVED

3. **Inspect and update line items**
   - For each line item in inspection_data
   - Update condition (UNOPENED/OPENED/DAMAGED)
   - Add inspection_notes
   - Set inspected_by and inspected_at

4. **Update return status**
   - Set status to RECEIVED
   - Set received_at timestamp

5. **Recalculate refund if needed**
   - Adjust for damaged items
   - Apply restocking fees

6. **Trigger stock restoration**
   - Call Task 77 method
   - Restore based on condition

7. **Send notification**
   - Notify customer items received

8. **Log receipt event**

9. **Return updated OrderReturn**

### Receipt Implementation

```python
@transaction.atomic
def receive_return(self, return_id, inspection_data, received_by):
    """
    Mark return as received and inspect items.
    
    Args:
        return_id: ID of return being received
        inspection_data: List of inspection details per line item
        received_by: User receiving the return
    
    Returns:
        Updated OrderReturn instance
    """
    # Fetch return
    order_return = OrderReturn.objects.select_for_update().get(pk=return_id)
    
    # Validate status
    if order_return.status != OrderReturn.STATUS_APPROVED:
        raise ValidationError(
            f"Cannot receive return with status {order_return.status}."
        )
    
    # Inspect line items
    for inspection in inspection_data:
        return_line_item = order_return.line_items.get(
            pk=inspection['line_item_id']
        )
        
        return_line_item.condition = inspection.get('condition', 'UNOPENED')
        return_line_item.inspection_notes = inspection.get('notes', '')
        return_line_item.inspected_by = received_by
        return_line_item.inspected_at = timezone.now()
        
        # Adjust refund based on condition
        if return_line_item.condition == ReturnLineItem.CONDITION_DAMAGED:
            # Reduce refund for damaged items
            return_line_item.refund_amount *= Decimal('0.5')  # 50% refund
        elif return_line_item.condition == ReturnLineItem.CONDITION_OPENED:
            # Apply restocking fee
            order_return.restocking_fee += return_line_item.refund_amount * Decimal('0.15')
        
        return_line_item.save()
    
    # Update return status
    order_return.status = OrderReturn.STATUS_RECEIVED
    order_return.received_at = timezone.now()
    
    # Recalculate refund
    order_return.refund_amount = order_return.calculate_refund_amount()
    order_return.save()
    
    # Restore stock (Task 77)
    self.restore_stock(return_id)
    
    # Send notification
    self._send_receipt_notification(order_return)
    
    # Log event
    HistoryService.log_return_received(
        order=order_return.order,
        order_return=order_return,
        user=received_by
    )
    
    return order_return
```

### Inspection Process

```
Package Arrives
    │
    ▼
Open Package
    │
    ▼
Inspect Each Item
    │
    ├─ Item A: UNOPENED
    │    └─→ Full refund, restore to inventory
    │
    ├─ Item B: OPENED
    │    └─→ 15% restocking fee, restore after cleaning
    │
    └─ Item C: DAMAGED
         └─→ 50% refund, mark as defective
             │
             ▼
        Update Return Status (RECEIVED)
             │
             ▼
        Recalculate Final Refund
             │
             ▼
        Restore Stock (Task 77)
```

### Expected Outcomes
- Receipt marking functional
- Inspection recorded per item
- Refund adjusted based on condition
- Stock restoration triggered

---

## Task 77: Implement Stock Restoration

### Overview
Implement stock restoration logic to return items back to inventory based on their condition.

### Dependencies
- Task 76: Return Receipt
- Inventory module

### Instructions

1. **Implement restore_stock method**
   - Parameters: return_id
   - Use `@transaction.atomic`

2. **Fetch return with line items**
   - Get OrderReturn by ID
   - Prefetch line items

3. **For each line item, determine restoration**
   - Check condition
   - UNOPENED → Restore to sellable stock
   - OPENED → Restore to open-box stock
   - DAMAGED → Mark as damaged/write-off

4. **Call inventory service**
   - Use StockService or InventoryService
   - Restore quantities to appropriate locations

5. **Update inventory records**
   - Create inventory adjustment entries
   - Link to return for traceability

6. **Update product availability**
   - Increment available_quantity
   - Update stock status

7. **Log stock restoration**
   - Use HistoryService
   - Record quantities restored

8. **Return restoration summary**

### Stock Restoration Logic

```python
@transaction.atomic
def restore_stock(self, return_id):
    """
    Restore returned items to inventory based on condition.
    
    Args:
        return_id: ID of return with items to restore
    
    Returns:
        dict: Summary of restored quantities
    """
    from apps.inventory.services import StockService
    
    # Fetch return
    order_return = OrderReturn.objects.select_related('order').prefetch_related(
        'line_items__order_line_item__product'
    ).get(pk=return_id)
    
    restoration_summary = {
        'sellable': 0,
        'open_box': 0,
        'damaged': 0
    }
    
    # Process each line item
    for return_line in order_return.line_items.all():
        product = return_line.order_line_item.product
        quantity = return_line.quantity
        condition = return_line.condition
        
        if condition == ReturnLineItem.CONDITION_UNOPENED:
            # Restore to sellable inventory
            StockService.restore_stock(
                product=product,
                quantity=quantity,
                condition='SELLABLE',
                reference=f"Return {order_return.return_number}",
                location=order_return.order.warehouse  # Original warehouse
            )
            restoration_summary['sellable'] += quantity
            
        elif condition == ReturnLineItem.CONDITION_OPENED:
            # Restore to open-box inventory
            StockService.restore_stock(
                product=product,
                quantity=quantity,
                condition='OPEN_BOX',
                reference=f"Return {order_return.return_number}",
                location=order_return.order.warehouse
            )
            restoration_summary['open_box'] += quantity
            
        elif condition == ReturnLineItem.CONDITION_DAMAGED:
            # Mark as damaged/write-off
            StockService.record_damage(
                product=product,
                quantity=quantity,
                reason='CUSTOMER_RETURN',
                reference=f"Return {order_return.return_number}",
                location=order_return.order.warehouse
            )
            restoration_summary['damaged'] += quantity
    
    # Log restoration
    HistoryService.log_stock_restored(
        order=order_return.order,
        order_return=order_return,
        summary=restoration_summary,
        user=self.user
    )
    
    return restoration_summary
```

### Stock Restoration Flow

```
Return Received & Inspected
    │
    ▼
For Each Returned Item
    │
    ├─→ UNOPENED
    │    │
    │    └─→ Restore to Sellable Stock
    │         └─→ Available for new orders
    │
    ├─→ OPENED
    │    │
    │    └─→ Restore to Open-Box Stock
    │         └─→ Sell at discount
    │
    └─→ DAMAGED
         │
         └─→ Mark as Damaged
              └─→ Write-off or repair
```

### Inventory Adjustment Example

```
Product: Laptop XYZ
Current Stock: 50 units

Return Received:
────────────────
Return #1: 5 units
  - 3 UNOPENED → Add 3 to sellable
  - 1 OPENED → Add 1 to open-box
  - 1 DAMAGED → Add 1 to damaged

New Stock:
────────────────
Sellable: 53 units
Open-box: 1 unit
Damaged: 1 unit
Total: 55 units
```

### Expected Outcomes
- Stock restoration method functional
- Inventory updated by condition
- Traceability maintained
- Stock availability updated

---

## Summary

This document completed return workflow implementation:

**Completed:**
- ✅ ReturnService class structure
- ✅ Return request creation
- ✅ Return approval/rejection
- ✅ Return receipt and inspection
- ✅ Stock restoration by condition

**Key Achievements:**
- Complete return workflow
- Multi-stage approval process
- Condition-based stock handling
- Refund adjustment logic

**Next Steps:**
- Proceed to [03_Tasks-78-80_Cancellation.md](03_Tasks-78-80_Cancellation.md) for order cancellation
