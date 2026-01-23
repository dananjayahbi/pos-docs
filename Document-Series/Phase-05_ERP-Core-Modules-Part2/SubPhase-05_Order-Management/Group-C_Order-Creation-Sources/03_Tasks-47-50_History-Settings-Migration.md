# Tasks 47-50: Order History, Settings & Migrations

> **Phase:** 05 - ERP Core Modules Part 2  
> **SubPhase:** 05 - Order Management  
> **Group:** C - Order Creation & Sources  
> **Document:** 03 of 03  
> **Tasks Covered:** 47, 48, 49, 50

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [02_Tasks-41-46_Stock-Reservation-Editing.md](02_Tasks-41-46_Stock-Reservation-Editing.md)
- **→ Next Group:** [../Group-D_Fulfillment-Workflow/](../Group-D_Fulfillment-Workflow/)

---

## Document Overview

This document covers the creation of OrderHistory model for audit trails, implementation of automated history logging, OrderSettings model for tenant-level configuration, and running migrations to apply all database changes.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 47 | Create OrderHistory Model | Medium | 25 min |
| 48 | Implement History Logging | Medium | 25 min |
| 49 | Create Order Settings Model | Medium | 25 min |
| 50 | Run Order Service Migrations | Low | 15 min |

---

## Task 47: Create OrderHistory Model

### Overview
Create the OrderHistory model to track all changes and events throughout an order's lifecycle. This provides a complete audit trail for compliance, debugging, and customer service.

### Dependencies
- Task 18: Order Model

### Instructions

1. **Create order history model file**
   - Navigate to `apps/orders/models/` directory
   - Create `order_history.py` file
   - This model stores all order events and changes

2. **Import required dependencies**
   - Import Django model classes
   - Import UUID for primary key
   - Import JSONField for storing change data
   - Import timezone utilities
   - Import User model for actor tracking

3. **Define OrderHistory model class**
   - Create class `OrderHistory` inheriting from `models.Model`
   - Add comprehensive docstring explaining purpose

4. **Add identification fields**
   - id: UUIDField, primary key, auto-generated
   - order: ForeignKey to Order, related_name='history', on_delete=CASCADE
   - event_type: CharField with choices (defined below)
   - event_timestamp: DateTimeField, auto_now_add=True

5. **Add actor tracking fields**
   - actor: ForeignKey to User, null=True (system actions have no actor)
   - actor_name: CharField to store name at time of action
   - actor_email: EmailField for audit
   - actor_role: CharField for role at time of action

6. **Add change tracking fields**
   - field_name: CharField for specific field changed
   - old_value: TextField for previous value (JSON string)
   - new_value: TextField for new value (JSON string)
   - changes: JSONField for structured change data
   - notes: TextField for additional context

7. **Add metadata fields**
   - ip_address: GenericIPAddressField for security audit
   - user_agent: TextField for browser/client info
   - session_id: CharField for session tracking
   - source: CharField (WEB, API, SYSTEM, IMPORT)

8. **Define event type choices**
   - CREATED: Order created
   - UPDATED: Order details updated
   - CONFIRMED: Order confirmed
   - PROCESSING_STARTED: Processing began
   - STOCK_RESERVED: Stock reserved
   - STOCK_RELEASED: Stock released
   - PAYMENT_RECEIVED: Payment recorded
   - SHIPPED: Order shipped
   - DELIVERED: Order delivered
   - COMPLETED: Order completed
   - CANCELLED: Order cancelled
   - RETURNED: Return initiated
   - REFUND_ISSUED: Refund processed
   - LOCKED: Order locked
   - UNLOCKED: Order unlocked
   - DUPLICATED: Order duplicated

9. **Add model methods**
   - `__str__()`: Return readable string
   - `get_changes_summary()`: Format changes for display
   - `get_actor_display()`: Return actor name or "System"

10. **Add Meta class**
    - ordering: ['-event_timestamp']
    - indexes: order, event_type, event_timestamp
    - verbose_name: 'Order History Entry'
    - verbose_name_plural: 'Order History'

11. **Export model in __init__.py**
    - Add OrderHistory to models/__init__.py
    - Include in __all__ list

### OrderHistory Model Structure

```
OrderHistory Model:
─────────────────────────────────────────────────────
Core Fields:
- id: UUID (PK)
- order: FK to Order
- event_type: Choice field (20+ event types)
- event_timestamp: DateTime (auto)

Actor Fields:
- actor: FK to User (nullable)
- actor_name: CharField (snapshot)
- actor_email: EmailField (snapshot)
- actor_role: CharField (snapshot)

Change Fields:
- field_name: CharField (for field updates)
- old_value: TextField (JSON)
- new_value: TextField (JSON)
- changes: JSONField (structured data)
- notes: TextField (context)

Metadata Fields:
- ip_address: GenericIPAddressField
- user_agent: TextField
- session_id: CharField
- source: Choice (WEB, API, SYSTEM, IMPORT)
```

### Event Types Comprehensive List

```python
EVENT_TYPE_CHOICES = [
    # Creation & Setup
    ('CREATED', 'Order Created'),
    ('DUPLICATED', 'Order Duplicated'),
    
    # Status Changes
    ('UPDATED', 'Order Updated'),
    ('CONFIRMED', 'Order Confirmed'),
    ('PROCESSING_STARTED', 'Processing Started'),
    ('PICKING_STARTED', 'Picking Started'),
    ('PACKING_STARTED', 'Packing Started'),
    ('SHIPPED', 'Order Shipped'),
    ('DELIVERED', 'Order Delivered'),
    ('COMPLETED', 'Order Completed'),
    ('CANCELLED', 'Order Cancelled'),
    
    # Stock Management
    ('STOCK_RESERVED', 'Stock Reserved'),
    ('STOCK_RELEASED', 'Stock Released'),
    ('STOCK_ADJUSTED', 'Stock Adjusted'),
    
    # Payment Events
    ('PAYMENT_PENDING', 'Payment Pending'),
    ('PAYMENT_RECEIVED', 'Payment Received'),
    ('PAYMENT_FAILED', 'Payment Failed'),
    ('REFUND_INITIATED', 'Refund Initiated'),
    ('REFUND_COMPLETED', 'Refund Completed'),
    
    # Returns
    ('RETURN_REQUESTED', 'Return Requested'),
    ('RETURN_APPROVED', 'Return Approved'),
    ('RETURN_REJECTED', 'Return Rejected'),
    ('RETURN_RECEIVED', 'Return Received'),
    
    # Security & Admin
    ('LOCKED', 'Order Locked'),
    ('UNLOCKED', 'Order Unlocked'),
    ('ASSIGNED', 'Order Assigned'),
    ('PRIORITY_CHANGED', 'Priority Changed'),
    
    # Communication
    ('EMAIL_SENT', 'Email Sent'),
    ('SMS_SENT', 'SMS Sent'),
    ('NOTIFICATION_SENT', 'Notification Sent'),
]
```

### Changes JSON Structure

```python
# Example 1: Order update
changes = {
    'action': 'update',
    'fields': {
        'shipping_address': {
            'old': '123 Old Street, Colombo',
            'new': '456 New Avenue, Colombo'
        },
        'priority': {
            'old': 'MEDIUM',
            'new': 'HIGH'
        }
    },
    'reason': 'Customer requested address change',
    'metadata': {
        'request_id': 'req-12345',
        'api_version': 'v1'
    }
}

# Example 2: Line item change
changes = {
    'action': 'line_item_update',
    'line_item_id': 'uuid-of-line-item',
    'product_sku': 'PROD-123',
    'product_name': 'Widget Pro',
    'field': 'quantity',
    'old_quantity': 5,
    'new_quantity': 10,
    'unit_price': '1000.00',
    'total_change': '5000.00'
}

# Example 3: Status change
changes = {
    'action': 'status_change',
    'old_status': 'PENDING',
    'new_status': 'CONFIRMED',
    'reason': 'Payment verified',
    'automated': False,
    'requires_approval': False
}

# Example 4: Stock reservation
changes = {
    'action': 'stock_reserved',
    'items': [
        {
            'product_sku': 'PROD-123',
            'product_name': 'Widget Pro',
            'quantity': 10,
            'location': 'Warehouse A',
            'reservation_id': 'uuid'
        }
    ],
    'total_items': 2,
    'total_quantity': 15
}
```

### Actor Snapshot Example

```python
# At time of event, capture actor details
actor_snapshot = {
    'actor': user_instance,
    'actor_name': 'John Doe',  # Full name at time
    'actor_email': 'john@example.com',  # Email at time
    'actor_role': 'Sales Manager'  # Role at time
}

# Even if user is deleted later, we have snapshot
# Even if user changes name/email, history preserved
```

### History Query Examples

```python
# Get all history for an order
history = OrderHistory.objects.filter(order=order).order_by('event_timestamp')

# Get status change events
status_changes = OrderHistory.objects.filter(
    order=order,
    event_type__in=['CONFIRMED', 'PROCESSING_STARTED', 'SHIPPED', 'DELIVERED']
)

# Get all updates by specific user
user_actions = OrderHistory.objects.filter(
    order=order,
    actor=user
)

# Get recent events (last 24 hours)
recent = OrderHistory.objects.filter(
    order=order,
    event_timestamp__gte=timezone.now() - timedelta(days=1)
)

# Get payment events
payments = OrderHistory.objects.filter(
    order=order,
    event_type__contains='PAYMENT'
)
```

### Expected Outcomes
- OrderHistory model created
- All event types defined
- Actor tracking fields added
- Change tracking with JSON structure
- Metadata fields for audit
- Model exported and accessible

---

## Task 48: Implement History Logging

### Overview
Implement automated history logging throughout the order lifecycle. This includes logging methods, signal handlers, and integration with all order operations.

### Dependencies
- Task 47: OrderHistory Model
- Task 35: OrderService Class

### Instructions

1. **Create history service module**
   - Navigate to `apps/orders/services/` directory
   - Create `history_service.py` file
   - This centralizes all history logging logic

2. **Import required dependencies**
   - Import OrderHistory model
   - Import Order model
   - Import timezone utilities
   - Import get_current_request (for IP and user agent)
   - Import logging

3. **Define HistoryService class**
   - Create class `HistoryService`
   - Add docstring explaining centralized history logging

4. **Add main logging method**
   - Create method `log_event(order, event_type, actor=None, notes='', changes=None, metadata=None)`
   - This is the primary method for creating history entries
   - Validates inputs
   - Creates OrderHistory instance
   - Returns created history entry

5. **Add actor extraction method**
   - Create method `_extract_actor_info(actor)`
   - Handles User object, AnonymousUser, or None
   - Returns dict with actor details:
     - actor: User instance or None
     - actor_name: Full name or "Anonymous" or "System"
     - actor_email: Email or empty
     - actor_role: Role name or empty

6. **Add request metadata extraction**
   - Create method `_extract_request_metadata()`
   - Uses thread-local storage to get current request
   - Extracts: IP address, user agent, session ID
   - Returns dict with metadata
   - Handles cases where no request context

7. **Add field change detection**
   - Create method `detect_changes(old_instance, new_instance, fields)`
   - Compares specified fields between old and new
   - Returns dict of changed fields with old and new values
   - Useful for pre-save / post-save comparisons

8. **Add specialized logging methods**
   - `log_creation(order, actor, source)`: Log order creation
   - `log_status_change(order, old_status, new_status, actor)`: Log status change
   - `log_field_update(order, field_name, old_value, new_value, actor)`: Log field change
   - `log_line_item_change(order, line_item, action, actor)`: Log item changes
   - `log_payment(order, amount, method, actor)`: Log payment events
   - `log_shipment(order, tracking_number, carrier, actor)`: Log shipment
   - `log_cancellation(order, reason, actor)`: Log cancellation

9. **Integrate with OrderService**
   - Update OrderService._log_order_event() method
   - Replace placeholder with HistoryService.log_event() call
   - Update all service methods to call history logging

10. **Create Django signals for automatic logging**
    - Create `apps/orders/signals.py` file
    - Define post_save signal for Order model
    - Detect what changed and log automatically
    - Define pre_delete signal for soft delete logging
    - Connect signals in apps.py ready() method

### History Logging Integration Flow

```
Order Operation
    │
    ▼
Service Method (e.g., create_order)
    │
    ▼
Perform Business Logic
    │
    ▼
HistoryService.log_event()
    │
    ├─→ Extract actor info
    ├─→ Extract request metadata
    ├─→ Build changes JSON
    └─→ Create OrderHistory entry
              │
              ▼
        History Saved
              │
              ▼
        Return to Service
```

### Specialized Logging Methods

```python
# Log order creation
HistoryService.log_creation(
    order=order,
    actor=user,
    source='WEBSTORE'
)

# Log status change
HistoryService.log_status_change(
    order=order,
    old_status='PENDING',
    new_status='CONFIRMED',
    actor=user
)

# Log field update
HistoryService.log_field_update(
    order=order,
    field_name='shipping_address',
    old_value={'line1': '123 Old St'},
    new_value={'line1': '456 New Ave'},
    actor=user
)

# Log line item change
HistoryService.log_line_item_change(
    order=order,
    line_item=line_item,
    action='quantity_increased',
    actor=user
)

# Log payment
HistoryService.log_payment(
    order=order,
    amount=Decimal('10000.00'),
    method='CREDIT_CARD',
    actor=user
)

# Log shipment
HistoryService.log_shipment(
    order=order,
    tracking_number='TRACK-12345',
    carrier='DHL',
    actor=user
)

# Log cancellation
HistoryService.log_cancellation(
    order=order,
    reason='Customer requested',
    actor=user
)
```

### Signal-Based Automatic Logging

```python
# signals.py

from django.db.models.signals import post_save, pre_delete
from django.dispatch import receiver
from .models import Order
from .services.history_service import HistoryService

@receiver(post_save, sender=Order)
def log_order_changes(sender, instance, created, **kwargs):
    """Automatically log order changes via signals."""
    
    if created:
        # New order created
        HistoryService.log_event(
            order=instance,
            event_type='CREATED',
            actor=getattr(instance, '_created_by', None),
            notes=f'Order created via {instance.source}'
        )
    else:
        # Existing order updated
        # Compare with previous state (requires old instance)
        if hasattr(instance, '_old_state'):
            changes = HistoryService.detect_changes(
                instance._old_state,
                instance,
                ['status', 'payment_status', 'priority']
            )
            
            if changes:
                HistoryService.log_event(
                    order=instance,
                    event_type='UPDATED',
                    actor=getattr(instance, '_updated_by', None),
                    changes=changes
                )

@receiver(pre_delete, sender=Order)
def log_order_deletion(sender, instance, **kwargs):
    """Log order deletion (should be rare)."""
    
    HistoryService.log_event(
        order=instance,
        event_type='DELETED',
        actor=getattr(instance, '_deleted_by', None),
        notes='Order deleted from system'
    )
```

### Change Detection Example

```python
# Before update
old_order = Order.objects.get(pk=order_id)

# Store old state
order._old_state = old_order

# Make changes
order.priority = 'HIGH'
order.notes = 'Urgent delivery requested'
order.save()

# In signal handler
changes = HistoryService.detect_changes(
    order._old_state,
    order,
    ['priority', 'notes', 'status']
)

# changes = {
#     'priority': {'old': 'MEDIUM', 'new': 'HIGH'},
#     'notes': {
#         'old': 'Standard delivery',
#         'new': 'Urgent delivery requested'
#     }
# }
```

### Integration with Service Methods

```python
# In OrderService

def create_order(self, data, items_data, user, auto_confirm=False):
    with transaction.atomic():
        # Create order
        order = Order(...)
        order.save()
        
        # Create line items
        self._create_line_items(order, items_data, user)
        
        # Calculate totals
        self._calculate_order_totals(order)
        
        # Log creation
        HistoryService.log_creation(
            order=order,
            actor=user,
            source=order.source
        )
        
        return order

def edit_order(self, order_id, data, items_data, user):
    with transaction.atomic():
        order = Order.objects.get(pk=order_id)
        
        # Store old state
        old_state = {
            'priority': order.priority,
            'notes': order.notes,
            'shipping_address': order.shipping_address
        }
        
        # Apply changes
        for field, value in data.items():
            setattr(order, field, value)
        order.save()
        
        # Log changes
        changes = HistoryService.detect_changes(
            old_state,
            order,
            data.keys()
        )
        
        HistoryService.log_event(
            order=order,
            event_type='UPDATED',
            actor=user,
            changes=changes,
            notes='Order edited by user'
        )
        
        return order
```

### Request Context Extraction

```python
# middleware.py
import threading

_thread_locals = threading.local()

def get_current_request():
    return getattr(_thread_locals, 'request', None)

class RequestMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response
    
    def __call__(self, request):
        _thread_locals.request = request
        response = self.get_response(request)
        _thread_locals.request = None
        return response

# In HistoryService
def _extract_request_metadata(self):
    request = get_current_request()
    
    if request:
        return {
            'ip_address': self._get_client_ip(request),
            'user_agent': request.META.get('HTTP_USER_AGENT', ''),
            'session_id': request.session.session_key if hasattr(request, 'session') else ''
        }
    
    return {
        'ip_address': None,
        'user_agent': '',
        'session_id': ''
    }
```

### History Timeline Display

```
Order Timeline (ORD-2026-00123):
─────────────────────────────────────────────────────

2026-01-23 09:00:00 | CREATED
  by: john.doe@example.com (Sales Rep)
  Order created via WEBSTORE
  IP: 192.168.1.100

2026-01-23 09:05:00 | PAYMENT_RECEIVED
  by: System (Automated)
  Payment: LKR 10,000.00 via Credit Card
  Transaction: TXN-12345

2026-01-23 09:10:00 | CONFIRMED
  by: system@example.com (Automated)
  Order confirmed and stock reserved
  Reserved: 15 units across 3 items

2026-01-23 10:00:00 | UPDATED
  by: jane.manager@example.com (Manager)
  Changed priority: MEDIUM → HIGH
  Changed address: 123 Old St → 456 New Ave
  Reason: Customer requested urgent delivery

2026-01-23 14:00:00 | PROCESSING_STARTED
  by: warehouse@example.com (Warehouse)
  Processing started at Warehouse A
  Picking list generated

2026-01-23 15:30:00 | SHIPPED
  by: warehouse@example.com (Warehouse)
  Carrier: DHL
  Tracking: TRACK-12345
  Packages: 2

2026-01-24 10:00:00 | DELIVERED
  by: System (Automated)
  Delivered successfully
  Signed by: Customer
```

### Expected Outcomes
- HistoryService class created
- Specialized logging methods implemented
- Request metadata extraction working
- Change detection functional
- Django signals configured
- Integration with all service methods complete

---

## Task 49: Create Order Settings Model

### Overview
Create the OrderSettings model for tenant-level configuration of order management behavior. This allows each tenant to customize order handling rules.

### Dependencies
- Tenant model (from Phase 02)

### Instructions

1. **Create order settings model file**
   - Navigate to `apps/orders/models/` directory
   - Create `order_settings.py` file
   - This model stores tenant-level order configuration

2. **Import required dependencies**
   - Import Django model classes
   - Import Tenant model
   - Import validators

3. **Define OrderSettings model class**
   - Create class `OrderSettings` inheriting from `models.Model`
   - Add docstring explaining tenant configuration

4. **Add tenant relationship**
   - tenant: OneToOneField to Tenant, primary key
   - This creates one settings record per tenant
   - on_delete=CASCADE (delete with tenant)

5. **Add order numbering settings**
   - order_number_prefix: CharField, max 10 chars (default: 'ORD')
   - order_number_start: IntegerField (default: 1)
   - reset_numbering_yearly: BooleanField (default: True)
   - use_sequential_numbering: BooleanField (default: True)

6. **Add auto-confirmation settings**
   - auto_confirm_pos: BooleanField (default: True)
   - auto_confirm_webstore: BooleanField (default: False)
   - auto_confirm_threshold: DecimalField (max order value for auto-confirm)
   - require_payment_for_confirmation: BooleanField (default: False)

7. **Add stock management settings**
   - require_stock_reservation: BooleanField (default: True)
   - allow_backorder: BooleanField (default: True)
   - allow_partial_fulfillment: BooleanField (default: True)
   - cancel_on_insufficient_stock: BooleanField (default: False)
   - low_stock_threshold: IntegerField (default: 10)

8. **Add pricing settings**
   - allow_manual_price_override: BooleanField (default: False)
   - require_approval_for_discounts: BooleanField (default: False)
   - max_discount_percent: DecimalField (default: 100.00)
   - show_unit_price_to_customer: BooleanField (default: True)

9. **Add workflow settings**
   - require_manager_approval_for_high_value: BooleanField (default: False)
   - high_value_threshold: DecimalField (default: 100000.00)
   - auto_cancel_unpaid_after_days: IntegerField (default: 7)
   - send_confirmation_email: BooleanField (default: True)
   - send_shipping_notifications: BooleanField (default: True)

10. **Add default values settings**
    - default_payment_terms: CharField with choices (NET_30, NET_60, etc.)
    - default_priority: CharField with choices (LOW, MEDIUM, HIGH)
    - default_shipping_method: CharField
    - tax_included_in_price: BooleanField (default: False)

11. **Add model methods**
    - `get_next_order_number()`: Generate next order number
    - `can_auto_confirm(order)`: Check if order qualifies for auto-confirm
    - `requires_approval(order)`: Check if order needs manager approval
    - `__str__()`: Return readable string

12. **Add Meta class**
    - verbose_name: 'Order Settings'
    - verbose_name_plural: 'Order Settings'

13. **Create default settings for new tenants**
    - Create signal handler for tenant creation
    - Automatically create OrderSettings with defaults

14. **Export model in __init__.py**
    - Add OrderSettings to models/__init__.py

### OrderSettings Model Structure

```
OrderSettings Model:
─────────────────────────────────────────────────────
Tenant Relationship:
- tenant: OneToOneField (PK)

Order Numbering:
- order_number_prefix: CharField (default: 'ORD')
- order_number_start: IntegerField (default: 1)
- reset_numbering_yearly: BooleanField (default: True)
- use_sequential_numbering: BooleanField (default: True)

Auto-Confirmation:
- auto_confirm_pos: BooleanField (default: True)
- auto_confirm_webstore: BooleanField (default: False)
- auto_confirm_threshold: DecimalField (nullable)
- require_payment_for_confirmation: BooleanField (default: False)

Stock Management:
- require_stock_reservation: BooleanField (default: True)
- allow_backorder: BooleanField (default: True)
- allow_partial_fulfillment: BooleanField (default: True)
- cancel_on_insufficient_stock: BooleanField (default: False)
- low_stock_threshold: IntegerField (default: 10)

Pricing:
- allow_manual_price_override: BooleanField (default: False)
- require_approval_for_discounts: BooleanField (default: False)
- max_discount_percent: DecimalField (default: 100.00)
- show_unit_price_to_customer: BooleanField (default: True)

Workflow:
- require_manager_approval_for_high_value: BooleanField (default: False)
- high_value_threshold: DecimalField (default: 100000.00)
- auto_cancel_unpaid_after_days: IntegerField (default: 7)
- send_confirmation_email: BooleanField (default: True)
- send_shipping_notifications: BooleanField (default: True)

Defaults:
- default_payment_terms: CharField (choices)
- default_priority: CharField (choices)
- default_shipping_method: CharField
- tax_included_in_price: BooleanField (default: False)
```

### Settings Usage Examples

```python
# Get tenant settings
tenant = get_current_tenant()
settings = OrderSettings.objects.get(tenant=tenant)

# Check if order should auto-confirm
if settings.can_auto_confirm(order):
    order.status = 'CONFIRMED'
    order.save()

# Get next order number
next_number = settings.get_next_order_number()
# Returns: "ORD-2026-00123"

# Check if order requires approval
if settings.requires_approval(order):
    # Send for manager approval
    notify_managers(order)

# Check stock handling
if not settings.allow_backorder and insufficient_stock:
    # Cancel order or require manual review
    handle_insufficient_stock(order)

# Check discount approval
if order.discount_percent > settings.max_discount_percent:
    raise ValidationError("Discount exceeds maximum allowed")

if settings.require_approval_for_discounts and order.discount_amount > 0:
    order.requires_approval = True
    order.save()
```

### Order Number Generation Method

```python
def get_next_order_number(self):
    """Generate next order number based on settings."""
    
    prefix = self.order_number_prefix
    
    if self.use_sequential_numbering:
        # Query last order for tenant
        last_order = Order.objects.filter(
            tenant=self.tenant
        ).order_by('-created_at').first()
        
        if last_order and self.reset_numbering_yearly:
            # Check if last order is from current year
            current_year = timezone.now().year
            last_year = last_order.created_at.year
            
            if current_year != last_year:
                # Reset to start number
                sequence = self.order_number_start
            else:
                # Extract sequence from last order number
                sequence = self._extract_sequence(last_order.order_number) + 1
        else:
            # First order or continue sequence
            sequence = self._extract_sequence(last_order.order_number) + 1 if last_order else self.order_number_start
        
        # Format: ORD-2026-00123
        year = timezone.now().year
        return f"{prefix}-{year}-{sequence:05d}"
    
    else:
        # Use UUID or timestamp-based
        timestamp = timezone.now().strftime('%Y%m%d%H%M%S')
        return f"{prefix}-{timestamp}"

def _extract_sequence(self, order_number):
    """Extract sequence number from order number string."""
    # ORD-2026-00123 → 123
    parts = order_number.split('-')
    if len(parts) >= 3:
        return int(parts[-1])
    return 0
```

### Auto-Confirmation Logic

```python
def can_auto_confirm(self, order):
    """Check if order can be auto-confirmed."""
    
    # Check source-specific settings
    if order.source == 'POS' and not self.auto_confirm_pos:
        return False
    
    if order.source == 'WEBSTORE' and not self.auto_confirm_webstore:
        return False
    
    # Check threshold
    if self.auto_confirm_threshold:
        if order.grand_total > self.auto_confirm_threshold:
            return False
    
    # Check payment requirement
    if self.require_payment_for_confirmation:
        if order.payment_status != 'PAID':
            return False
    
    return True
```

### Manager Approval Check

```python
def requires_approval(self, order):
    """Check if order requires manager approval."""
    
    # Check high value threshold
    if self.require_manager_approval_for_high_value:
        if order.grand_total >= self.high_value_threshold:
            return True
    
    # Check discount approval
    if self.require_approval_for_discounts:
        if order.discount_amount > 0:
            return True
    
    # Check custom rules (can be extended)
    if hasattr(order, 'requires_manual_review') and order.requires_manual_review:
        return True
    
    return False
```

### Default Settings Creation

```python
# signals.py

from django.db.models.signals import post_save
from django.dispatch import receiver
from apps.tenants.models import Tenant
from .models import OrderSettings

@receiver(post_save, sender=Tenant)
def create_default_order_settings(sender, instance, created, **kwargs):
    """Create default OrderSettings for new tenants."""
    
    if created:
        OrderSettings.objects.create(
            tenant=instance,
            order_number_prefix='ORD',
            order_number_start=1,
            reset_numbering_yearly=True,
            use_sequential_numbering=True,
            auto_confirm_pos=True,
            auto_confirm_webstore=False,
            require_stock_reservation=True,
            allow_backorder=True,
            allow_partial_fulfillment=True,
            cancel_on_insufficient_stock=False,
            low_stock_threshold=10,
            allow_manual_price_override=False,
            require_approval_for_discounts=False,
            max_discount_percent=Decimal('100.00'),
            show_unit_price_to_customer=True,
            require_manager_approval_for_high_value=False,
            high_value_threshold=Decimal('100000.00'),
            auto_cancel_unpaid_after_days=7,
            send_confirmation_email=True,
            send_shipping_notifications=True,
            default_payment_terms='NET_30',
            default_priority='MEDIUM',
            tax_included_in_price=False
        )
```

### Configuration Scenarios

**Scenario 1: Conservative (Default)**
```
- Auto-confirm POS: Yes
- Auto-confirm Webstore: No (manual review)
- Require stock reservation: Yes
- Allow backorder: Yes
- Require approval for high value: No
- High value threshold: LKR 100,000
```

**Scenario 2: Aggressive (High Volume)**
```
- Auto-confirm POS: Yes
- Auto-confirm Webstore: Yes (if paid)
- Require stock reservation: Yes
- Allow backorder: Yes
- Allow partial fulfillment: Yes
- Require approval for high value: No
```

**Scenario 3: Strict (High Security)**
```
- Auto-confirm POS: No (manual review)
- Auto-confirm Webstore: No
- Require stock reservation: Yes
- Allow backorder: No (cancel if insufficient)
- Require approval for discounts: Yes
- Require approval for high value: Yes
- High value threshold: LKR 50,000
```

### Expected Outcomes
- OrderSettings model created
- All configuration fields defined
- Helper methods implemented
- Default settings creation automated
- Settings integrated with order workflow

---

## Task 50: Run Order Service Migrations

### Overview
Create and run Django migrations to apply all database changes for OrderHistory, OrderSettings, and any additional fields added to Order model.

### Dependencies
- Task 47: OrderHistory Model
- Task 49: OrderSettings Model
- Task 46: Edit lock fields on Order model

### Instructions

1. **Review all model changes**
   - OrderHistory model (new)
   - OrderSettings model (new)
   - Order model additions:
     - is_locked field
     - locked_at, locked_by, lock_reason, lock_notes
     - stock_reserved_at field
     - duplicated_from field
     - Any other additions from previous tasks

2. **Create migration file**
   - Navigate to project root
   - Run command: `python manage.py makemigrations orders`
   - This creates migration file in `apps/orders/migrations/`
   - Review generated migration file

3. **Verify migration file contents**
   - Check OrderHistory table creation
   - Check OrderSettings table creation
   - Check Order model field additions
   - Check indexes are created
   - Check foreign key relationships
   - Check default values are set

4. **Add custom migration operations if needed**
   - Add data migration for OrderSettings defaults
   - Add indexes for performance
   - Add constraints if needed

5. **Test migration in development**
   - Run: `python manage.py migrate orders --plan`
   - This shows migration plan without applying
   - Review planned operations

6. **Apply migration**
   - Run: `python manage.py migrate orders`
   - Monitor output for errors
   - Verify successful completion

7. **Verify database schema**
   - Use database client or Django shell
   - Check tables exist:
     - orders_order
     - orders_orderlineitem
     - orders_orderhistory
     - orders_ordersettings
   - Check fields exist on orders_order:
     - is_locked
     - locked_at
     - locked_by_id
     - stock_reserved_at
     - duplicated_from_id

8. **Create initial OrderSettings for existing tenants**
   - Create data migration or management command
   - For each existing tenant without OrderSettings:
     - Create OrderSettings with defaults
   - Run: `python manage.py create_order_settings`

9. **Test model imports**
   - Open Django shell: `python manage.py shell`
   - Import models: `from apps.orders.models import Order, OrderHistory, OrderSettings`
   - Verify no import errors
   - Create test instances

10. **Document migration**
    - Add migration notes to CHANGELOG
    - Document any manual steps required
    - Note database indexes created

### Migration File Structure

```python
# Generated migration file: 0003_history_settings.py

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion
import uuid

class Migration(migrations.Migration):

    dependencies = [
        ('orders', '0002_orderlineitem_fields'),
        ('tenants', '0001_initial'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        # Create OrderHistory model
        migrations.CreateModel(
            name='OrderHistory',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True)),
                ('event_type', models.CharField(choices=[...], max_length=50)),
                ('event_timestamp', models.DateTimeField(auto_now_add=True)),
                ('actor_name', models.CharField(max_length=255)),
                ('actor_email', models.EmailField()),
                ('field_name', models.CharField(blank=True, max_length=100)),
                ('old_value', models.TextField(blank=True)),
                ('new_value', models.TextField(blank=True)),
                ('changes', models.JSONField(default=dict)),
                ('notes', models.TextField(blank=True)),
                ('ip_address', models.GenericIPAddressField(null=True)),
                ('user_agent', models.TextField(blank=True)),
                ('session_id', models.CharField(blank=True, max_length=255)),
                ('source', models.CharField(choices=[...], max_length=20)),
                ('actor', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to=settings.AUTH_USER_MODEL)),
                ('order', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='history', to='orders.order')),
            ],
            options={
                'verbose_name': 'Order History Entry',
                'verbose_name_plural': 'Order History',
                'ordering': ['-event_timestamp'],
            },
        ),
        
        # Create OrderSettings model
        migrations.CreateModel(
            name='OrderSettings',
            fields=[
                ('tenant', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, primary_key=True, to='tenants.tenant')),
                ('order_number_prefix', models.CharField(default='ORD', max_length=10)),
                ('order_number_start', models.IntegerField(default=1)),
                ('reset_numbering_yearly', models.BooleanField(default=True)),
                ('use_sequential_numbering', models.BooleanField(default=True)),
                ('auto_confirm_pos', models.BooleanField(default=True)),
                ('auto_confirm_webstore', models.BooleanField(default=False)),
                ('auto_confirm_threshold', models.DecimalField(blank=True, decimal_places=2, max_digits=12, null=True)),
                ('require_payment_for_confirmation', models.BooleanField(default=False)),
                ('require_stock_reservation', models.BooleanField(default=True)),
                ('allow_backorder', models.BooleanField(default=True)),
                ('allow_partial_fulfillment', models.BooleanField(default=True)),
                ('cancel_on_insufficient_stock', models.BooleanField(default=False)),
                ('low_stock_threshold', models.IntegerField(default=10)),
                # ... more fields
            ],
            options={
                'verbose_name': 'Order Settings',
                'verbose_name_plural': 'Order Settings',
            },
        ),
        
        # Add fields to Order model
        migrations.AddField(
            model_name='order',
            name='is_locked',
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name='order',
            name='locked_at',
            field=models.DateTimeField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='order',
            name='locked_by',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='locked_orders', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AddField(
            model_name='order',
            name='lock_reason',
            field=models.CharField(blank=True, max_length=50),
        ),
        migrations.AddField(
            model_name='order',
            name='lock_notes',
            field=models.TextField(blank=True),
        ),
        migrations.AddField(
            model_name='order',
            name='stock_reserved_at',
            field=models.DateTimeField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='order',
            name='duplicated_from',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='duplicates', to='orders.order'),
        ),
        
        # Add indexes
        migrations.AddIndex(
            model_name='orderhistory',
            index=models.Index(fields=['order', 'event_timestamp'], name='orders_hist_order_idx'),
        ),
        migrations.AddIndex(
            model_name='orderhistory',
            index=models.Index(fields=['event_type'], name='orders_hist_type_idx'),
        ),
    ]
```

### Management Command for OrderSettings

```python
# management/commands/create_order_settings.py

from django.core.management.base import BaseCommand
from apps.tenants.models import Tenant
from apps.orders.models import OrderSettings

class Command(BaseCommand):
    help = 'Create OrderSettings for all tenants that don\'t have one'

    def handle(self, *args, **options):
        tenants = Tenant.objects.all()
        created_count = 0
        
        for tenant in tenants:
            settings, created = OrderSettings.objects.get_or_create(
                tenant=tenant,
                defaults={
                    'order_number_prefix': 'ORD',
                    'order_number_start': 1,
                    'reset_numbering_yearly': True,
                    'auto_confirm_pos': True,
                    'auto_confirm_webstore': False,
                    # ... other defaults
                }
            )
            
            if created:
                created_count += 1
                self.stdout.write(
                    self.style.SUCCESS(f'Created OrderSettings for tenant: {tenant.name}')
                )
        
        self.stdout.write(
            self.style.SUCCESS(f'Successfully created {created_count} OrderSettings')
        )
```

### Migration Verification Steps

```bash
# 1. Show migration plan
python manage.py migrate orders --plan

# Expected output:
# Planned operations:
# orders.0003_history_settings
#   Create model OrderHistory
#   Create model OrderSettings
#   Add field is_locked to order
#   Add field locked_at to order
#   ...

# 2. Apply migration
python manage.py migrate orders

# Expected output:
# Operations to perform:
#   Apply all migrations: orders
# Running migrations:
#   Applying orders.0003_history_settings... OK

# 3. Verify in Django shell
python manage.py shell

>>> from apps.orders.models import Order, OrderHistory, OrderSettings
>>> OrderHistory.objects.count()
0
>>> OrderSettings.objects.count()
0  # Will be populated by management command

# 4. Create OrderSettings for existing tenants
python manage.py create_order_settings

# 5. Verify creation
python manage.py shell

>>> OrderSettings.objects.count()
5  # Or however many tenants exist

# 6. Check database schema
python manage.py dbshell

\d orders_order
\d orders_orderhistory
\d orders_ordersettings
```

### Rollback Plan

```bash
# If migration fails, rollback to previous state
python manage.py migrate orders 0002_orderlineitem_fields

# This will:
# - Drop orders_orderhistory table
# - Drop orders_ordersettings table
# - Remove new fields from orders_order table

# After fixing issues, re-run:
python manage.py migrate orders
```

### Post-Migration Verification

```python
# Test OrderHistory creation
from apps.orders.models import Order, OrderHistory
from apps.orders.services.history_service import HistoryService

order = Order.objects.first()
HistoryService.log_event(
    order=order,
    event_type='UPDATED',
    notes='Test history entry'
)

history_count = OrderHistory.objects.filter(order=order).count()
print(f"History entries: {history_count}")  # Should be > 0

# Test OrderSettings
from apps.orders.models import OrderSettings

settings = OrderSettings.objects.first()
print(f"Order prefix: {settings.order_number_prefix}")
print(f"Auto-confirm POS: {settings.auto_confirm_pos}")

next_number = settings.get_next_order_number()
print(f"Next order number: {next_number}")  # ORD-2026-00001

# Test Order lock fields
order = Order.objects.first()
order.is_locked = False
print(f"Can edit: {order.can_edit()}")  # (True, '')
```

### Expected Outcomes
- Migration file created successfully
- All models migrated to database
- Tables and indexes created
- OrderSettings created for all tenants
- Database schema verified
- Models importable and functional

---

## Cross-Group Integration

### History Logging Throughout Workflow

```
Order Creation (Task 36)
    │
    └─→ Log CREATED event (Task 48)

Order Confirmation (Task 57)
    │
    └─→ Log CONFIRMED event (Task 48)

Stock Reservation (Task 41)
    │
    └─→ Log STOCK_RESERVED event (Task 48)

Order Editing (Task 45)
    │
    └─→ Log UPDATED event with changes (Task 48)

Order Shipment (Group D)
    │
    └─→ Log SHIPPED event (Task 48)

Order Completion (Group D)
    │
    └─→ Log COMPLETED event (Task 48)
```

### Settings Integration with Order Workflow

```
Order Creation
    │
    ▼
Get OrderSettings for Tenant
    │
    ├─→ Generate order number (settings.get_next_order_number)
    ├─→ Set default priority (settings.default_priority)
    └─→ Set default payment terms (settings.default_payment_terms)

Order Confirmation
    │
    ▼
Check Auto-Confirmation (settings.can_auto_confirm)
    │
    ├─→ Yes: Auto-confirm
    └─→ No: Manual review

Stock Reservation
    │
    ▼
Check Stock Settings
    │
    ├─→ Allow backorder (settings.allow_backorder)
    ├─→ Allow partial (settings.allow_partial_fulfillment)
    └─→ Cancel if insufficient (settings.cancel_on_insufficient_stock)
```

---

## Testing Checklist

### Task 47: OrderHistory Model
- [ ] Model creates successfully
- [ ] All event types defined
- [ ] Actor tracking fields work
- [ ] Changes JSON structure validates
- [ ] Metadata fields populate
- [ ] Model queries work

### Task 48: History Logging
- [ ] HistoryService logs events
- [ ] Specialized methods work
- [ ] Request metadata extracted
- [ ] Change detection works
- [ ] Django signals fire correctly
- [ ] Integration with services complete

### Task 49: OrderSettings Model
- [ ] Model creates successfully
- [ ] OneToOne relationship with Tenant
- [ ] Default settings created
- [ ] get_next_order_number() works
- [ ] can_auto_confirm() logic correct
- [ ] requires_approval() logic correct

### Task 50: Migrations
- [ ] Migration file generated
- [ ] Migration applies successfully
- [ ] Tables created in database
- [ ] Indexes created
- [ ] OrderSettings created for tenants
- [ ] Models import without errors

---

## Summary

This document completed Order History tracking, Settings management, and database migrations:

**Completed:**
- ✅ OrderHistory model for complete audit trail
- ✅ Automated history logging throughout workflow
- ✅ OrderSettings model for tenant configuration
- ✅ Database migrations applied successfully

**Key Achievements:**
- Complete audit trail for compliance
- Automatic logging of all order events
- Flexible tenant-level configuration
- Database schema updated and verified

**Group C Complete:**
All tasks for Order Creation & Sources completed:
- Tasks 35-40: OrderService and creation sources
- Tasks 41-46: Stock reservation and editing
- Tasks 47-50: History, settings, and migrations

**Next Steps:**
- Proceed to [Group D: Fulfillment Workflow](../Group-D_Fulfillment-Workflow/) to implement order fulfillment, shipping, and delivery processes
