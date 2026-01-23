# Tasks 78-80: Order Cancellation

> **Phase:** 05 - ERP Core Modules Part 2  
> **SubPhase:** 05 - Order Management  
> **Group:** E - Returns & Cancellations  
> **Document:** 03 of 03  
> **Tasks Covered:** 78, 79, 80

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [02_Tasks-73-77_Return-Service-Workflow.md](02_Tasks-73-77_Return-Service-Workflow.md)
- **→ Next Group:** [../Group-F_Order-API-Testing-Documentation/](../Group-F_Order-API-Testing-Documentation/)

---

## Document Overview

This document covers order cancellation functionality allowing customers or staff to cancel orders under certain conditions.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 78 | Implement Order Cancellation | High | 30 min |
| 79 | Add Cancellation Validation | Medium | 25 min |
| 80 | Implement Partial Cancellation | High | 30 min |

---

## Task 78: Implement Order Cancellation

### Overview
Implement full order cancellation allowing users to cancel entire orders before shipment.

### Dependencies
- Order model
- OrderService or create CancellationService

### Instructions

1. **Create cancellation service (or add to OrderService)**
   - Option A: Create `apps/orders/services/cancellation_service.py`
   - Option B: Add to existing OrderService
   - We'll use Option A for clarity

2. **Import dependencies**
   - Import Order, OrderLineItem models
   - Import transaction utilities
   - Import StockService

3. **Define CancellationService class**

4. **Implement cancel_order method**
   - Parameters: order_id, cancelled_by, cancellation_reason, cancellation_notes
   - Use `@transaction.atomic`

5. **Fetch and validate order**
   - Get order by ID with lock
   - Call validation (Task 79 will add detailed validation)

6. **Release stock reservations**
   - For each line item
   - Call StockService.release_stock()

7. **Process refund if paid**
   - Check payment_status
   - If PAID, initiate refund
   - If PENDING, void authorization

8. **Update order status**
   - Set status to CANCELLED
   - Set cancelled_at timestamp
   - Set cancelled_by user
   - Set cancellation_reason and notes

9. **Cancel related records**
   - Cancel pending fulfillments
   - Cancel scheduled tasks

10. **Send notification**
    - Notify customer of cancellation
    - Notify finance team if refund needed

11. **Log cancellation event**

12. **Return updated order**

### Cancellation Service Structure

```python
# apps/orders/services/cancellation_service.py

from django.db import transaction
from django.utils import timezone
from django.core.exceptions import ValidationError
from apps.orders.models import Order, Fulfillment
from apps.orders.services.stock_service import StockService
from apps.orders.services.history_service import HistoryService

class CancellationService:
    """
    Service for handling order cancellations.
    Manages full and partial order cancellations with stock release.
    """
    
    def __init__(self, user=None):
        """
        Initialize cancellation service.
        
        Args:
            user: User performing cancellation
        """
        self.user = user
    
    @transaction.atomic
    def cancel_order(self, order_id, cancelled_by, cancellation_reason, cancellation_notes=''):
        """
        Cancel entire order.
        
        Args:
            order_id: ID of order to cancel
            cancelled_by: User cancelling the order
            cancellation_reason: Reason for cancellation
            cancellation_notes: Additional notes
        
        Returns:
            Cancelled Order instance
        
        Raises:
            ValidationError if cancellation not allowed
        """
        # Fetch order with lock
        order = Order.objects.select_for_update().get(pk=order_id)
        
        # Validate cancellation is allowed (Task 79)
        self._validate_cancellation(order)
        
        # Release stock for all items
        for line_item in order.line_items.all():
            StockService.release_stock(
                product=line_item.product,
                quantity=line_item.quantity,
                reservation_ref=f"Order-{order.order_number}"
            )
        
        # Handle payment refund
        if order.payment_status == 'PAID':
            self._initiate_refund(order)
        elif order.payment_status == 'AUTHORIZED':
            self._void_authorization(order)
        
        # Update order status
        order.status = Order.STATUS_CANCELLED
        order.cancelled_at = timezone.now()
        order.cancelled_by = cancelled_by
        order.cancellation_reason = cancellation_reason
        order.cancellation_notes = cancellation_notes
        order.save()
        
        # Cancel related fulfillments
        Fulfillment.objects.filter(
            order=order,
            status__in=['PENDING', 'PROCESSING']
        ).update(
            status='CANCELLED',
            updated_at=timezone.now()
        )
        
        # Cancel Celery tasks
        self._cancel_scheduled_tasks(order)
        
        # Send notifications
        self._send_cancellation_notification(order)
        
        # Log event
        HistoryService.log_order_cancelled(
            order=order,
            user=cancelled_by,
            reason=cancellation_reason
        )
        
        return order
    
    def _validate_cancellation(self, order):
        """Validate order can be cancelled."""
        # Basic validation here, detailed in Task 79
        if order.status in [Order.STATUS_DELIVERED, Order.STATUS_COMPLETED]:
            raise ValidationError(
                "Cannot cancel delivered orders. Please use return process."
            )
        
        if order.status == Order.STATUS_CANCELLED:
            raise ValidationError("Order is already cancelled.")
    
    def _initiate_refund(self, order):
        """Initiate refund for paid order."""
        # Call payment gateway to refund
        # Implementation depends on payment integration
        pass
    
    def _void_authorization(self, order):
        """Void payment authorization."""
        # Call payment gateway to void
        pass
    
    def _cancel_scheduled_tasks(self, order):
        """Cancel any Celery tasks for this order."""
        # Revoke tasks if possible
        pass
    
    def _send_cancellation_notification(self, order):
        """Send cancellation notification to customer."""
        # Email/SMS notification
        pass
```

### Cancellation Flow

```
Customer/Staff Requests Cancellation
    │
    ▼
Validate Cancellation Allowed
    │
    ├─→ Not Allowed → Reject
    │
    └─→ Allowed → Proceed
            │
            ▼
    Release Stock Reservations
            │
            ├─ Item A: Release 5 units
            ├─ Item B: Release 3 units
            └─ Item C: Release 10 units
                │
                ▼
    Handle Payment
            │
            ├─ PAID → Refund
            ├─ AUTHORIZED → Void
            └─ PENDING → No action
                │
                ▼
    Update Order Status (CANCELLED)
                │
                ▼
    Cancel Related Records
                │
                ├─→ Fulfillments
                └─→ Scheduled tasks
                    │
                    ▼
            Send Notifications
```

### Expected Outcomes
- Cancel order method functional
- Stock released properly
- Payment handled appropriately
- Order status updated
- Notifications sent

---

## Task 79: Add Cancellation Validation

### Overview
Add comprehensive validation logic to determine when orders can or cannot be cancelled.

### Dependencies
- Task 78: Cancel Order

### Instructions

1. **Enhance _validate_cancellation method**
   - Add detailed validation rules
   - Check order status
   - Check fulfillment status
   - Check payment status
   - Check business rules

2. **Define cancellation rules by status**
   - PENDING: Always cancellable
   - CONFIRMED: Cancellable (release stock)
   - PROCESSING: Requires manager approval
   - PICKED/PACKED: Requires manager approval
   - SHIPPED: Not cancellable (use return)
   - DELIVERED: Not cancellable (use return)

3. **Check time constraints**
   - After certain time, may require approval
   - Business hours vs after hours

4. **Check user permissions**
   - Customer can cancel own orders (with rules)
   - Staff can cancel with proper permissions
   - Manager override for special cases

5. **Create can_cancel property on Order model**
   - Add to Order model
   - Quick check if cancellable

6. **Create get_cancellation_restrictions method**
   - Returns why order can't be cancelled
   - Or confirms it can be cancelled

### Validation Logic

```python
def _validate_cancellation(self, order, user=None, manager_override=False):
    """
    Comprehensive validation for order cancellation.
    
    Args:
        order: Order to validate
        user: User requesting cancellation
        manager_override: Whether manager is overriding rules
    
    Raises:
        ValidationError with specific reason if not allowed
    """
    # Already cancelled
    if order.status == Order.STATUS_CANCELLED:
        raise ValidationError("Order is already cancelled.")
    
    # Delivered/completed orders must use return process
    if order.status in [Order.STATUS_DELIVERED, Order.STATUS_COMPLETED]:
        raise ValidationError(
            "Cannot cancel delivered orders. Please initiate a return instead."
        )
    
    # Check if shipped
    if order.status == Order.STATUS_SHIPPED:
        if not manager_override:
            raise ValidationError(
                "Cannot cancel shipped orders. Contact manager for assistance."
            )
    
    # Check fulfillment status
    active_fulfillments = order.fulfillments.filter(
        status__in=['PICKED', 'PACKED', 'SHIPPED']
    ).exists()
    
    if active_fulfillments and not manager_override:
        raise ValidationError(
            "Order has active fulfillments. Manager approval required for cancellation."
        )
    
    # Processing orders may need approval
    if order.status == Order.STATUS_PROCESSING:
        # Check if picking has started
        picking_started = order.fulfillments.filter(
            status__in=['PICKING', 'PICKED']
        ).exists()
        
        if picking_started and not manager_override:
            raise ValidationError(
                "Picking has started. Manager approval required for cancellation."
            )
    
    # Check payment refund policies
    if order.payment_status == 'PAID':
        # Check if within cancellation window
        hours_since_payment = (timezone.now() - order.paid_at).total_seconds() / 3600
        
        if hours_since_payment > 24 and not manager_override:
            # Paid orders over 24 hours need approval
            raise ValidationError(
                "Orders paid over 24 hours ago require manager approval to cancel."
            )
    
    # User permission checks
    if user:
        # Customer can only cancel their own orders
        if user == order.customer:
            # Customer restrictions
            if order.status not in [Order.STATUS_PENDING, Order.STATUS_CONFIRMED]:
                raise ValidationError(
                    "You can only cancel orders that haven't started processing. "
                    "Please contact support for assistance."
                )
        elif not user.has_perm('orders.cancel_order'):
            raise ValidationError(
                "You don't have permission to cancel orders."
            )
    
    return True
```

### Cancellation Rules Matrix

| Order Status | Customer Can Cancel | Staff Can Cancel | Notes |
|--------------|---------------------|------------------|-------|
| PENDING | ✅ Yes | ✅ Yes | Anytime |
| CONFIRMED | ✅ Yes (24h window) | ✅ Yes | Release stock |
| PROCESSING | ❌ No | ⚠️ Requires approval | Check if picking started |
| PICKED | ❌ No | ⚠️ Manager only | Items already picked |
| PACKED | ❌ No | ⚠️ Manager only | Package ready |
| SHIPPED | ❌ No | ❌ Use return | Already dispatched |
| DELIVERED | ❌ No | ❌ Use return | Customer received |

### Order Model Enhancement

```python
# Add to Order model

@property
def can_cancel(self):
    """Check if order can be cancelled."""
    try:
        CancellationService()._validate_cancellation(self)
        return True
    except ValidationError:
        return False

def get_cancellation_restrictions(self):
    """
    Get detailed information about cancellation restrictions.
    
    Returns:
        dict with 'can_cancel' and 'reason' keys
    """
    try:
        CancellationService()._validate_cancellation(self)
        return {
            'can_cancel': True,
            'reason': None
        }
    except ValidationError as e:
        return {
            'can_cancel': False,
            'reason': str(e)
        }

# Add cancellation fields
cancelled_at = models.DateTimeField(null=True, blank=True)
cancelled_by = models.ForeignKey(
    settings.AUTH_USER_MODEL,
    on_delete=models.SET_NULL,
    null=True,
    blank=True,
    related_name='cancelled_orders'
)
cancellation_reason = models.CharField(max_length=200, blank=True)
cancellation_notes = models.TextField(blank=True)
```

### Expected Outcomes
- Comprehensive validation logic
- Status-based cancellation rules
- Permission checks
- Order model properties added

---

## Task 80: Implement Partial Cancellation

### Overview
Implement partial order cancellation allowing cancellation of specific line items while keeping others active.

### Dependencies
- Task 78: Cancel Order
- Task 79: Cancellation Validation

### Instructions

1. **Add cancel_line_items method**
   - Parameters: order_id, line_item_ids, cancelled_by, reason, notes
   - Use `@transaction.atomic`

2. **Fetch and validate order**
   - Get order by ID
   - Validate partial cancellation allowed

3. **Validate line items**
   - Check line items belong to order
   - Check not already fulfilled/shipped
   - Check quantities

4. **Release stock for cancelled items**
   - For each cancelled line item
   - Call StockService.release_stock()

5. **Update line item status**
   - Mark line items as CANCELLED
   - Track cancellation details

6. **Recalculate order totals**
   - Subtract cancelled items from order total
   - Update order.grand_total
   - Update payment amount if needed

7. **Update order status**
   - If all items cancelled → CANCELLED
   - If some items cancelled → PARTIALLY_CANCELLED
   - If remaining items intact → Keep current status

8. **Process partial refund if paid**
   - Calculate refund for cancelled items
   - Initiate partial refund

9. **Send notification**
   - Notify customer of partial cancellation

10. **Log event**

11. **Return updated order**

### Partial Cancellation Implementation

```python
@transaction.atomic
def cancel_line_items(self, order_id, line_item_ids, cancelled_by, cancellation_reason, cancellation_notes=''):
    """
    Cancel specific line items from an order.
    
    Args:
        order_id: ID of order
        line_item_ids: List of OrderLineItem IDs to cancel
        cancelled_by: User performing cancellation
        cancellation_reason: Reason for cancellation
        cancellation_notes: Additional notes
    
    Returns:
        Updated Order instance
    
    Raises:
        ValidationError if partial cancellation not allowed
    """
    # Fetch order with lock
    order = Order.objects.select_for_update().get(pk=order_id)
    
    # Validate partial cancellation allowed
    self._validate_partial_cancellation(order, line_item_ids)
    
    # Fetch line items
    line_items = order.line_items.filter(id__in=line_item_ids)
    
    if line_items.count() != len(line_item_ids):
        raise ValidationError("Some line items not found or don't belong to this order.")
    
    cancelled_total = Decimal('0')
    
    # Process each line item
    for line_item in line_items:
        # Release stock
        StockService.release_stock(
            product=line_item.product,
            quantity=line_item.quantity,
            reservation_ref=f"Order-{order.order_number}"
        )
        
        # Update line item
        line_item.status = 'CANCELLED'
        line_item.cancelled_at = timezone.now()
        line_item.cancelled_by = cancelled_by
        line_item.cancellation_reason = cancellation_reason
        line_item.save()
        
        # Track cancelled amount
        cancelled_total += line_item.total
    
    # Recalculate order totals
    order.subtotal -= cancelled_total
    order.grand_total = order.subtotal + order.tax_amount + order.shipping_cost - order.discount_amount
    
    # Update order status
    remaining_items = order.line_items.exclude(status='CANCELLED').count()
    
    if remaining_items == 0:
        # All items cancelled
        order.status = Order.STATUS_CANCELLED
        order.cancelled_at = timezone.now()
    else:
        # Some items remain
        order.status = Order.STATUS_PARTIALLY_CANCELLED
    
    order.save()
    
    # Process partial refund if paid
    if order.payment_status == 'PAID':
        self._process_partial_refund(order, cancelled_total)
    
    # Send notification
    self._send_partial_cancellation_notification(order, line_items, cancelled_total)
    
    # Log event
    HistoryService.log_partial_cancellation(
        order=order,
        line_items=line_items,
        user=cancelled_by,
        reason=cancellation_reason,
        amount=cancelled_total
    )
    
    return order

def _validate_partial_cancellation(self, order, line_item_ids):
    """Validate partial cancellation is allowed."""
    # Can't partially cancel if fully cancelled
    if order.status == Order.STATUS_CANCELLED:
        raise ValidationError("Order is already fully cancelled.")
    
    # Can't partially cancel delivered orders
    if order.status in [Order.STATUS_DELIVERED, Order.STATUS_COMPLETED]:
        raise ValidationError("Cannot cancel items from delivered orders.")
    
    # Check if any items are already fulfilled
    fulfilled_items = order.line_items.filter(
        id__in=line_item_ids,
        fulfillment_line_items__fulfillment__status__in=['SHIPPED', 'DELIVERED']
    )
    
    if fulfilled_items.exists():
        raise ValidationError(
            "Cannot cancel items that have already been shipped. "
            f"Items already shipped: {', '.join(item.product.name for item in fulfilled_items)}"
        )
    
    return True

def _process_partial_refund(self, order, refund_amount):
    """Process refund for partially cancelled items."""
    # Calculate refund including proportional tax
    tax_rate = order.tax_amount / order.subtotal if order.subtotal > 0 else Decimal('0')
    total_refund = refund_amount + (refund_amount * tax_rate)
    
    # Initiate refund through payment gateway
    # Implementation depends on payment integration
    pass
```

### Partial Cancellation Flow

```
Order with 5 Items
    │
    ├─ Item A: $50
    ├─ Item B: $30
    ├─ Item C: $20
    ├─ Item D: $40
    └─ Item E: $60
        │
        ▼
Customer Requests Cancellation of Items B & C
        │
        ▼
Validate Items Not Shipped
        │
        ▼
Release Stock
        │
        ├─ Item B: Release 2 units
        └─ Item C: Release 5 units
            │
            ▼
    Update Line Items (CANCELLED)
            │
            ▼
    Recalculate Order Total
            │
            Original: $200
            Cancel: $50 (B+C)
            New Total: $150
                │
                ▼
        Process Partial Refund
                │
                ▼
        Update Order Status (PARTIALLY_CANCELLED)
                │
                ▼
        Continue with Remaining Items (A, D, E)
```

### OrderLineItem Enhancement

```python
# Add to OrderLineItem model

status = models.CharField(
    max_length=20,
    choices=[
        ('PENDING', 'Pending'),
        ('CONFIRMED', 'Confirmed'),
        ('CANCELLED', 'Cancelled'),
        ('FULFILLED', 'Fulfilled'),
    ],
    default='PENDING'
)

cancelled_at = models.DateTimeField(null=True, blank=True)
cancelled_by = models.ForeignKey(
    settings.AUTH_USER_MODEL,
    on_delete=models.SET_NULL,
    null=True,
    blank=True,
    related_name='cancelled_line_items'
)
cancellation_reason = models.CharField(max_length=200, blank=True)

@property
def can_cancel(self):
    """Check if line item can be cancelled."""
    return (
        self.status not in ['CANCELLED', 'FULFILLED'] and
        not self.fulfillment_line_items.filter(
            fulfillment__status__in=['SHIPPED', 'DELIVERED']
        ).exists()
    )
```

### Expected Outcomes
- Partial cancellation method functional
- Line item status tracking
- Order totals recalculated
- Partial refunds processed
- Remaining items continue normally

---

## Summary

This document completed order cancellation functionality:

**Completed:**
- ✅ Full order cancellation with stock release
- ✅ Comprehensive validation rules
- ✅ Status-based cancellation matrix
- ✅ Partial cancellation for specific items
- ✅ Refund handling (full and partial)

**Key Achievements:**
- Complete cancellation workflow
- Permission-based validation
- Manager override capability
- Line item level cancellation
- Proper stock and payment handling

**Group E Complete:**
All returns and cancellation tasks (67-80) completed

**Next Steps:**
- Proceed to [Group F: Order API, Testing & Documentation](../Group-F_Order-API-Testing-Documentation/) for API endpoints and testing
