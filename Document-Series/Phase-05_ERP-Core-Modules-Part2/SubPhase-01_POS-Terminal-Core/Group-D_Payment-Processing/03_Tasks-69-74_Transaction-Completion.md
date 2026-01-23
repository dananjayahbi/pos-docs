# Tasks 69-74: Transaction Completion & Receipt

> **Phase:** 05 - ERP Core Modules Part 2  
> **SubPhase:** 01 - POS Terminal Core  
> **Group:** D - Payment Processing  
> **Document:** 03 of 03  
> **Tasks Covered:** 69, 70, 71, 72, 73, 74

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [02_Tasks-62-68_Payment-Service-Methods.md](02_Tasks-62-68_Payment-Service-Methods.md)
- **→ Next Group:** [../Group-E_POS-API-Frontend-Integration/](../Group-E_POS-API-Frontend-Integration/)

---

## Document Overview

This document covers transaction completion, voiding transactions, cash drawer integration, receipt generation, payment audit logging, and held cart functionality.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 69 | Create complete_transaction | High | 35 min |
| 70 | Implement void_transaction | Medium | 25 min |
| 71 | Add cash drawer trigger | Medium | 20 min |
| 72 | Create payment receipt data | Medium | 25 min |
| 73 | Add payment audit logging | Medium | 20 min |
| 74 | Create held cart functionality | Medium | 25 min |

---

## Task 69: Create complete_transaction

### Overview
Implement the complete_transaction method that finalizes the cart, updates inventory, creates order records, and triggers receipt generation.

### Dependencies
- Task 68: Create payment validation
- POSPayment model complete
- Inventory management system
- Order model (for transaction history)

### Instructions

1. **Add complete_transaction method to PaymentService**
   - Method name: `complete_transaction`
   - Parameters: None (uses self.cart and self.user)
   - Returns: Completed cart and order record
   - Decorator: `@transaction.atomic`

2. **Validate cart can be completed**
   - Call `can_complete_cart()` method
   - Check all payments are COMPLETED
   - Check total payments equal cart total
   - Raise ValueError if validation fails

3. **Update cart status**
   - Change cart.status to COMPLETED
   - Set cart.completed_at timestamp
   - Save cart record

4. **Create order record**
   - Create Order instance from cart data
   - Copy cart items to order items
   - Store payment information
   - Link to customer if exists
   - Set order number (unique, sequential)

5. **Update inventory levels**
   - For each cart item:
     - Reduce product.stock_quantity by item quantity
     - Use F() expression for atomic updates
     - Log stock movement
   - Handle out-of-stock scenarios gracefully

6. **Update session totals**
   - Increment session.transaction_count
   - Add cart.total to session.total_sales
   - Update session.last_transaction_at
   - Use F() expressions for atomic updates

7. **Trigger receipt generation**
   - Call receipt generation service (Task 72)
   - Store receipt data with order
   - Return receipt for printing

8. **Handle errors gracefully**
   - Use try-except blocks
   - Rollback on any error (atomic transaction)
   - Log error details
   - Provide clear error messages

9. **Return completion data**
   - Return dict with: order, cart, receipt_data
   - Caller can use for display/printing

### Transaction Completion Flow Diagram

```
┌────────────────────────────────────────────────────────┐
│         complete_transaction() Flow                     │
└────────────────────────────────────────────────────────┘

    [Start Transaction]
            │
            ▼
    ┌─────────────────────┐
    │ Validate Payments   │
    │ - All COMPLETED?    │
    │ - Total correct?    │
    └─────────────────────┘
            │
            ▼
    ┌─────────────────────┐
    │ Update Cart Status  │
    │ → COMPLETED         │
    │ Set completed_at    │
    └─────────────────────┘
            │
            ▼
    ┌─────────────────────┐
    │ Create Order Record │
    │ - Copy cart data    │
    │ - Generate order #  │
    └─────────────────────┘
            │
            ▼
    ┌─────────────────────┐
    │ Update Inventory    │
    │ - Reduce stock      │
    │ - Log movements     │
    └─────────────────────┘
            │
            ▼
    ┌─────────────────────┐
    │ Update Session      │
    │ - Increment count   │
    │ - Add to total      │
    └─────────────────────┘
            │
            ▼
    ┌─────────────────────┐
    │ Generate Receipt    │
    │ - Collect data      │
    │ - Format receipt    │
    └─────────────────────┘
            │
            ▼
    [Commit Transaction]
            │
            ▼
    [Return: order, receipt]
```

### Cart to Order Conversion

**Cart Data → Order Data Mapping:**

| Cart Field | Order Field | Notes |
|------------|-------------|-------|
| `cart.id` | `order.cart_id` | Reference to original cart |
| `cart.session` | `order.session` | Link to POS session |
| `cart.customer` | `order.customer` | Customer if any |
| `cart.total` | `order.total` | Final total |
| `cart.discount_total` | `order.discount_amount` | Discounts applied |
| `cart.tax_total` | `order.tax_amount` | Tax amount |
| `cart.items` | `order.items` | Copy each item |
| `cart.payments` | `order.payments` | Link existing payments |
| `cart.completed_at` | `order.created_at` | Order timestamp |

### Order Number Generation

**Format:** `POS-{SESSION_ID}-{SEQUENCE}`

**Example:** `POS-SES20260123001-0015`

**Components:**
- Prefix: "POS" (identifies as POS order)
- Session ID: Unique session identifier
- Sequence: Sequential number within session (0001, 0002, etc.)

**Alternative Format:** `{STORE_CODE}-{DATE}-{SEQUENCE}`

**Example:** `CMB01-20260123-1234`

**Components:**
- Store Code: "CMB01" (Colombo store 01)
- Date: YYYYMMDD
- Sequence: Daily sequence number

### Inventory Update Strategy

```
For each cart item:
┌────────────────────────────────────────┐
│ Get product                            │
├────────────────────────────────────────┤
│ Current Stock: 100 units               │
│ Cart Quantity: 5 units                 │
│                                        │
│ New Stock = 100 - 5 = 95 units        │
│                                        │
│ Update using F() expression:           │
│ Product.objects.filter(                │
│   pk=product.pk                        │
│ ).update(                              │
│   stock_quantity=F('stock_quantity')-5 │
│ )                                      │
│                                        │
│ Log stock movement:                    │
│ - Type: SALE                           │
│ - Quantity: -5                         │
│ - Reference: Order #                   │
│ - Timestamp: now()                     │
└────────────────────────────────────────┘
```

### Expected Outcome
```python
# In PaymentService class

@transaction.atomic
def complete_transaction(self):
    """
    Complete the transaction: finalize cart, create order, update inventory.
    
    Returns:
        dict: {
            'order': Order instance,
            'cart': Completed cart,
            'receipt_data': Receipt data dict
        }
        
    Raises:
        ValueError: If transaction cannot be completed
        
    Example:
        >>> service = PaymentService(cart=cart, user=user)
        >>> result = service.complete_transaction()
        >>> print(f"Order #{result['order'].order_number} completed")
        Order #POS-SES20260123001-0015 completed
    """
    from django.db.models import F
    from apps.pos.models import POSOrder, POSOrderItem, StockMovement
    from apps.pos.constants import (
        CART_STATUS_COMPLETED,
        STOCK_MOVEMENT_TYPE_SALE
    )
    
    # Validate cart can be completed
    if not self.can_complete_cart():
        raise ValueError(
            "Cart cannot be completed. Ensure all payments are completed "
            "and total payments equal cart total."
        )
    
    # 1. Update cart status
    self.cart.status = CART_STATUS_COMPLETED
    self.cart.completed_at = timezone.now()
    self.cart.save()
    
    # 2. Generate order number
    session = self.cart.session
    session_order_count = POSOrder.objects.filter(session=session).count() + 1
    order_number = f"POS-{session.session_number}-{session_order_count:04d}"
    
    # 3. Create order record
    order = POSOrder.objects.create(
        order_number=order_number,
        session=session,
        cart=self.cart,
        customer=self.cart.customer,
        subtotal=self.cart.subtotal,
        discount_amount=self.cart.discount_total,
        tax_amount=self.cart.tax_total,
        total=self.cart.total,
        cashier=self.user,
        created_at=timezone.now()
    )
    
    # 4. Copy cart items to order items
    for cart_item in self.cart.items.all():
        POSOrderItem.objects.create(
            order=order,
            product=cart_item.product,
            quantity=cart_item.quantity,
            unit_price=cart_item.unit_price,
            discount_amount=cart_item.discount_amount,
            tax_amount=cart_item.tax_amount,
            subtotal=cart_item.subtotal,
            total=cart_item.total
        )
        
        # 5. Update inventory
        product = cart_item.product
        quantity_sold = cart_item.quantity
        
        # Reduce stock using atomic F() expression
        Product.objects.filter(pk=product.pk).update(
            stock_quantity=F('stock_quantity') - quantity_sold
        )
        
        # Log stock movement
        StockMovement.objects.create(
            product=product,
            movement_type=STOCK_MOVEMENT_TYPE_SALE,
            quantity=-quantity_sold,  # Negative for outgoing
            reference_type='order',
            reference_id=order.id,
            notes=f"POS Sale - Order {order.order_number}",
            created_by=self.user
        )
    
    # 6. Update session totals
    session.__class__.objects.filter(pk=session.pk).update(
        transaction_count=F('transaction_count') + 1,
        total_sales=F('total_sales') + self.cart.total,
        last_transaction_at=timezone.now()
    )
    
    # 7. Generate receipt data
    receipt_data = self.generate_receipt_data(order)
    
    # 8. Return completion data
    return {
        'order': order,
        'cart': self.cart,
        'receipt_data': receipt_data
    }
```

### Verification Checklist
- [ ] `complete_transaction` method implemented
- [ ] Payment validation before completion
- [ ] Cart status updated to COMPLETED
- [ ] Order record created with order number
- [ ] Cart items copied to order items
- [ ] Inventory updated atomically with F()
- [ ] Stock movements logged
- [ ] Session totals updated
- [ ] Receipt data generated
- [ ] Method decorated with @transaction.atomic
- [ ] Error handling with rollback

---

## Task 70: Implement void_transaction

### Overview
Implement the ability to void (cancel) a transaction before completion, reversing any partial payments.

### Dependencies
- Task 69: Create complete_transaction
- Payment model with VOIDED status

### Instructions

1. **Add void_transaction method to PaymentService**
   - Method name: `void_transaction`
   - Parameters: `reason` (string, optional)
   - Returns: Voided cart
   - Decorator: `@transaction.atomic`

2. **Validate cart can be voided**
   - Cart must be in OPEN status
   - Cannot void COMPLETED carts (use refund instead)
   - Raise ValueError if already completed

3. **Void all payments**
   - Update all COMPLETED payments to VOIDED
   - Update all PENDING payments to VOIDED
   - Set voided_at timestamp
   - Store void reason in notes

4. **Reverse store credit transactions**
   - For STORE_CREDIT payments:
     - Refund credit back to customer balance
     - Use F() expression for atomic update
     - Log credit reversal

5. **Update cart status**
   - Set cart.status to VOIDED
   - Set cart.voided_at timestamp
   - Store void reason

6. **Log void action**
   - Record who voided the transaction
   - Record when it was voided
   - Record reason for void

7. **Do NOT reverse inventory**
   - Inventory was never deducted (cart not completed)
   - No inventory reversal needed

8. **Return voided cart**
   - Return updated cart instance

### Void Transaction Flow Diagram

```
┌────────────────────────────────────────────────────────┐
│           void_transaction() Flow                       │
└────────────────────────────────────────────────────────┘

    [Input: reason]
            │
            ▼
    ┌─────────────────────┐
    │ Validate Cart       │
    │ - Status: OPEN?     │
    │ - Not COMPLETED?    │
    └─────────────────────┘
            │
            ▼
    ┌─────────────────────┐
    │ Void All Payments   │
    │ → VOIDED status     │
    │ Set voided_at       │
    └─────────────────────┘
            │
            ▼
    ┌─────────────────────┐
    │ Reverse Credits     │
    │ - Refund to balance │
    │ - Log reversal      │
    └─────────────────────┘
            │
            ▼
    ┌─────────────────────┐
    │ Update Cart         │
    │ → VOIDED            │
    │ Set voided_at       │
    │ Store reason        │
    └─────────────────────┘
            │
            ▼
    ┌─────────────────────┐
    │ Log Void Action     │
    │ - Who voided        │
    │ - When              │
    │ - Why               │
    └─────────────────────┘
            │
            ▼
    [Return: voided cart]
```

### Void vs Refund

**Void (Pre-Completion):**
- Transaction not yet completed
- Inventory not deducted
- Simpler process
- No receipt issued yet
- Example: Customer changed mind

**Refund (Post-Completion):**
- Transaction already completed
- Inventory was deducted (may need return)
- More complex process
- Receipt already issued
- Example: Product return

### Common Void Reasons

| Reason | Description | Frequency |
|--------|-------------|-----------|
| Customer cancelled | Customer changed mind before paying | Common |
| Payment declined | All payment methods failed | Common |
| Pricing error | Wrong price entered, need to restart | Occasional |
| Cashier error | Mistake in item entry | Occasional |
| System error | Technical issue during transaction | Rare |
| Duplicate transaction | Accidentally created duplicate cart | Rare |

### Sri Lankan Context: Void Scenarios

**Common Scenarios:**
1. Customer realizes they don't have enough money
2. Mobile payment OTP expired/failed
3. Card declined, customer has no alternative
4. Price discrepancy - customer contests the amount
5. Power outage during transaction
6. Network issues with payment gateway

### Expected Outcome
```python
# In PaymentService class

@transaction.atomic
def void_transaction(self, reason=None):
    """
    Void (cancel) the transaction before completion.
    
    This will:
    - Mark all payments as VOIDED
    - Reverse any store credit used
    - Mark cart as VOIDED
    - NOT affect inventory (not yet deducted)
    
    Args:
        reason (str, optional): Reason for voiding transaction
        
    Returns:
        POSCart: Voided cart
        
    Raises:
        ValueError: If cart is already completed or cannot be voided
        
    Example:
        >>> service = PaymentService(cart=cart, user=user)
        >>> voided_cart = service.void_transaction(reason="Customer cancelled")
        >>> print(voided_cart.status)
        VOIDED
    """
    from django.db.models import F
    from apps.pos.constants import (
        CART_STATUS_OPEN,
        CART_STATUS_COMPLETED,
        CART_STATUS_VOIDED,
        PAYMENT_STATUS_VOIDED,
        PAYMENT_STATUS_COMPLETED,
        PAYMENT_STATUS_PENDING,
        PAYMENT_METHOD_STORE_CREDIT
    )
    
    # Validate cart can be voided
    if self.cart.status == CART_STATUS_COMPLETED:
        raise ValueError(
            "Cannot void completed transaction. Use refund process instead."
        )
    
    if self.cart.status != CART_STATUS_OPEN:
        raise ValueError(
            f"Cannot void transaction with status: {self.cart.status}"
        )
    
    void_reason = reason or "Transaction voided"
    
    # 1. Void all payments
    payments_to_void = self.cart.payments.filter(
        status__in=[PAYMENT_STATUS_COMPLETED, PAYMENT_STATUS_PENDING]
    )
    
    for payment in payments_to_void:
        payment.status = PAYMENT_STATUS_VOIDED
        payment.voided_at = timezone.now()
        payment.notes = (payment.notes or '') + f"\nVoided: {void_reason}"
        payment.save()
        
        # 2. Reverse store credit if applicable
        if payment.method == PAYMENT_METHOD_STORE_CREDIT:
            customer = self.cart.customer
            if customer:
                # Refund credit back to customer
                customer.__class__.objects.filter(pk=customer.pk).update(
                    store_credit_balance=F('store_credit_balance') + payment.amount
                )
                payment.notes += (
                    f"\nStore credit reversed: LKR {payment.amount} "
                    f"refunded to customer balance"
                )
                payment.save()
    
    # 3. Update cart status
    self.cart.status = CART_STATUS_VOIDED
    self.cart.voided_at = timezone.now()
    self.cart.voided_by = self.user
    self.cart.void_reason = void_reason
    self.cart.save()
    
    # 4. Log void action (optional audit log)
    # AuditLog.objects.create(
    #     action='void_transaction',
    #     cart_id=self.cart.id,
    #     user=self.user,
    #     details={'reason': void_reason}
    # )
    
    return self.cart
```

### Verification Checklist
- [ ] `void_transaction` method implemented
- [ ] Validation prevents voiding completed carts
- [ ] All payments updated to VOIDED status
- [ ] Store credit reversed atomically
- [ ] Cart status updated to VOIDED
- [ ] Void reason stored
- [ ] voided_at timestamp set
- [ ] Method decorated with @transaction.atomic
- [ ] Clear error messages for invalid voids

---

## Task 71: Add cash_drawer_trigger

### Overview
Implement functionality to trigger cash drawer opening when cash payments are processed.

### Dependencies
- Task 63: Implement process_cash_payment
- Cash drawer hardware integration

### Instructions

1. **Create CashDrawerService class**
   - File: `apps/pos/services/cash_drawer_service.py`
   - Handle cash drawer communication
   - Support multiple drawer types (USB, network)

2. **Define drawer connection types**
   - USB: Direct USB connection
   - Network: TCP/IP network printer with drawer port
   - Serial: Serial port connection
   - Mock: Testing/development mode

3. **Add open_drawer method**
   - Method name: `open_drawer`
   - Parameters: `reason` (string)
   - Sends open command to drawer
   - Logs open event

4. **Implement ESC/POS command**
   - Standard cash drawer open command: ESC p m t1 t2
   - Hex: 0x1B 0x70 0x00 0x32 0xFA
   - Works with most receipt printers

5. **Add drawer status check**
   - Method: `is_drawer_open`
   - Check if drawer is currently open
   - Read status from hardware (if supported)

6. **Integrate with payment processing**
   - Modify `process_cash_payment` to trigger drawer
   - Call `open_drawer()` after COMPLETED status
   - Only open for cash payments

7. **Add configuration settings**
   - Enable/disable drawer feature
   - Drawer connection type
   - Drawer connection string (USB port, IP:port)
   - Auto-open on cash payment

8. **Add error handling**
   - Handle drawer communication failures
   - Log errors but don't fail payment
   - Notify cashier of drawer issues

9. **Add manual open option**
   - Method: `manual_open_drawer`
   - Requires supervisor approval (optional)
   - Logs manual open with reason

### Cash Drawer Flow Diagram

```
┌────────────────────────────────────────────────────────┐
│         Cash Payment with Drawer Open                   │
└────────────────────────────────────────────────────────┘

    [Cash Payment Completed]
            │
            ▼
    ┌─────────────────────┐
    │ Check Settings      │
    │ - Drawer enabled?   │
    │ - Auto-open on?     │
    └─────────────────────┘
            │
            ▼
    ┌─────────────────────┐
    │ Send Open Command   │
    │ ESC p 0 50 250      │
    └─────────────────────┘
            │
        ┌───┴───┐
        │       │
        ▼       ▼
    Success   Failure
        │       │
        ▼       ▼
    ┌──────┐ ┌───────┐
    │ Log  │ │Log    │
    │Event │ │Error  │
    └──────┘ └───────┘
        │       │
        └───┬───┘
            ▼
    [Drawer Opens/Alert]
```

### ESC/POS Cash Drawer Command

**Command Structure:**
```
ESC p m t1 t2

Where:
- ESC = 0x1B (27 decimal)
- p = 0x70 (112 decimal)
- m = Drawer pin number (usually 0)
- t1 = ON time (0-255, units of 2ms)
- t2 = OFF time (0-255, units of 2ms)
```

**Standard Command:**
```
Hex: 1B 70 00 32 FA
Dec: 27 112 0 50 250

Meaning:
- Pin 0
- ON for 100ms (50 * 2ms)
- OFF for 500ms (250 * 2ms)
```

### Cash Drawer Connection Types

**1. USB Connection:**
```python
Connection String: "USB:VID_XXXX&PID_YYYY"
Pros: Direct, reliable
Cons: Requires USB port
```

**2. Network (via Printer):**
```python
Connection String: "TCP:192.168.1.100:9100"
Pros: No cables to terminal
Cons: Network dependency
```

**3. Serial Port:**
```python
Connection String: "COM3" or "/dev/ttyUSB0"
Pros: Traditional, reliable
Cons: Requires serial port
```

**4. Bluetooth:**
```python
Connection String: "BT:XX:XX:XX:XX:XX:XX"
Pros: Wireless
Cons: Pairing complexity
```

### Expected Outcome
```python
# apps/pos/services/cash_drawer_service.py

import logging
from django.conf import settings

logger = logging.getLogger(__name__)


class CashDrawerService:
    """
    Service for controlling cash drawer hardware.
    
    Supports:
    - USB connected drawers
    - Network printer with drawer port
    - Serial port drawers
    - Mock mode for testing
    """
    
    # ESC/POS cash drawer open command
    DRAWER_OPEN_COMMAND = b'\x1B\x70\x00\x32\xFA'  # ESC p 0 50 250
    
    def __init__(self, connection_type=None, connection_string=None):
        """
        Initialize cash drawer service.
        
        Args:
            connection_type: 'USB', 'NETWORK', 'SERIAL', 'MOCK'
            connection_string: Connection details (port, IP, etc.)
        """
        self.connection_type = connection_type or getattr(
            settings, 'CASH_DRAWER_TYPE', 'MOCK'
        )
        self.connection_string = connection_string or getattr(
            settings, 'CASH_DRAWER_CONNECTION', None
        )
        self.enabled = getattr(settings, 'CASH_DRAWER_ENABLED', True)
    
    def open_drawer(self, reason="Cash payment"):
        """
        Open the cash drawer.
        
        Args:
            reason (str): Reason for opening drawer
            
        Returns:
            bool: True if successful, False otherwise
        """
        if not self.enabled:
            logger.info("Cash drawer disabled in settings")
            return False
        
        try:
            if self.connection_type == 'MOCK':
                logger.info(f"[MOCK] Cash drawer opened: {reason}")
                return True
            
            elif self.connection_type == 'USB':
                return self._open_usb_drawer(reason)
            
            elif self.connection_type == 'NETWORK':
                return self._open_network_drawer(reason)
            
            elif self.connection_type == 'SERIAL':
                return self._open_serial_drawer(reason)
            
            else:
                logger.error(f"Unknown drawer type: {self.connection_type}")
                return False
                
        except Exception as e:
            logger.error(f"Failed to open cash drawer: {str(e)}")
            return False
    
    def _open_usb_drawer(self, reason):
        """Open USB connected drawer"""
        # TODO: Implement USB drawer opening
        # Using pyusb or similar library
        logger.info(f"USB drawer opened: {reason}")
        return True
    
    def _open_network_drawer(self, reason):
        """Open network printer drawer"""
        import socket
        
        try:
            # Parse IP and port
            ip, port = self.connection_string.replace('TCP:', '').split(':')
            port = int(port)
            
            # Send command to printer
            sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
            sock.settimeout(5)
            sock.connect((ip, port))
            sock.send(self.DRAWER_OPEN_COMMAND)
            sock.close()
            
            logger.info(f"Network drawer opened: {reason} (IP: {ip})")
            return True
            
        except Exception as e:
            logger.error(f"Network drawer error: {str(e)}")
            return False
    
    def _open_serial_drawer(self, reason):
        """Open serial port drawer"""
        try:
            import serial
            
            port = serial.Serial(
                port=self.connection_string,
                baudrate=9600,
                timeout=1
            )
            port.write(self.DRAWER_OPEN_COMMAND)
            port.close()
            
            logger.info(f"Serial drawer opened: {reason}")
            return True
            
        except Exception as e:
            logger.error(f"Serial drawer error: {str(e)}")
            return False
    
    def manual_open_drawer(self, user, reason):
        """
        Manually open drawer (no sale).
        
        Args:
            user: User requesting manual open
            reason: Reason for manual open
            
        Returns:
            bool: Success status
        """
        # Log manual open for audit
        logger.warning(
            f"Manual drawer open by {user.username}: {reason}"
        )
        
        return self.open_drawer(f"Manual: {reason}")


# Usage in PaymentService
# In process_cash_payment method:

@transaction.atomic
def process_cash_payment(self, amount_tendered):
    """Process cash payment with drawer trigger"""
    # ... existing payment logic ...
    
    payment = self._create_payment_record(
        method=PAYMENT_METHOD_CASH,
        amount=payment_amount,
        status=PAYMENT_STATUS_COMPLETED,
        amount_tendered=amount_tendered,
        change_due=change_due,
        paid_at=timezone.now()
    )
    
    # Trigger cash drawer
    drawer_service = CashDrawerService()
    drawer_opened = drawer_service.open_drawer(
        reason=f"Cash payment: LKR {payment_amount}"
    )
    
    if not drawer_opened:
        # Don't fail payment if drawer doesn't open
        # Just log warning
        logger.warning(f"Cash drawer failed to open for payment #{payment.id}")
    
    return payment
```

### Configuration (settings.py)
```python
# Cash Drawer Settings
CASH_DRAWER_ENABLED = True
CASH_DRAWER_TYPE = 'NETWORK'  # USB, NETWORK, SERIAL, MOCK
CASH_DRAWER_CONNECTION = 'TCP:192.168.1.100:9100'
CASH_DRAWER_AUTO_OPEN = True
```

### Verification Checklist
- [ ] CashDrawerService class created
- [ ] Support for USB, Network, Serial, Mock
- [ ] ESC/POS command implemented correctly
- [ ] open_drawer method sends command
- [ ] Integration with process_cash_payment
- [ ] Error handling doesn't fail payment
- [ ] Manual open option implemented
- [ ] Configuration settings added
- [ ] Logging for audit trail

---

## Task 72: Create payment_receipt_data

### Overview
Implement receipt data generation for printing transaction receipts with all payment details.

### Dependencies
- Task 69: Create complete_transaction
- Receipt printing system

### Instructions

1. **Add generate_receipt_data method to PaymentService**
   - Method name: `generate_receipt_data`
   - Parameters: `order` (POSOrder instance)
   - Returns: Dictionary with receipt data
   - Used by complete_transaction

2. **Collect store information**
   - Store name, address, phone
   - Tax ID / Business registration number
   - Store logo (optional)

3. **Collect transaction information**
   - Order number
   - Date and time
   - Cashier name
   - Session number

4. **Collect customer information**
   - Customer name (if exists)
   - Customer phone/email (if exists)
   - Loyalty points earned (if applicable)

5. **Collect item details**
   - Product name, SKU
   - Quantity, unit price
   - Discounts applied
   - Line totals

6. **Collect payment details**
   - Each payment method and amount
   - Change given (for cash)
   - Last 4 digits of card (for card payments)
   - Authorization codes

7. **Calculate totals**
   - Subtotal
   - Discount total
   - Tax total
   - Grand total

8. **Add footer information**
   - Thank you message
   - Return policy
   - Website/social media
   - Sri Lankan tax notice if required

9. **Format for thermal printer**
   - Consider 80mm or 58mm paper width
   - Line breaks at appropriate points
   - Alignment (left, center, right)

### Receipt Layout Diagram

```
┌────────────────────────────────────┐
│          STORE NAME                │ (Center, Large)
│       Store Address Line 1         │ (Center)
│       Store Address Line 2         │ (Center)
│       Tel: 011-1234567             │ (Center)
│   Business Reg: BRN-123456789      │ (Center)
├────────────────────────────────────┤
│ Order #: POS-SES001-0015           │ (Left)
│ Date: 2026-01-23 14:35:22          │ (Left)
│ Cashier: John Doe                  │ (Left)
│ Customer: Jane Smith               │ (Left)
├────────────────────────────────────┤
│ ITEMS                              │
├────────────────────────────────────┤
│ 2x Product Name               1000 │
│   @ LKR 500.00                     │
│                                    │
│ 1x Another Product             750 │
│   @ LKR 750.00                     │
│   Discount: -50.00                 │
├────────────────────────────────────┤
│ Subtotal:                     1700 │
│ Discount:                      -50 │
│ Tax (8%):                      132 │
├────────────────────────────────────┤
│ TOTAL:                    LKR 1782 │ (Bold/Large)
├────────────────────────────────────┤
│ PAYMENTS                           │
├────────────────────────────────────┤
│ Cash (Tendered):              2000 │
│ Change:                        218 │
├────────────────────────────────────┤
│ Thank you for your purchase!       │ (Center)
│ Returns within 7 days with receipt │ (Center)
│ www.example.lk                     │ (Center)
│                                    │
│ [QR Code or Barcode]               │ (Center)
└────────────────────────────────────┘
```

### Sri Lankan Receipt Requirements

**Legal Requirements:**
- Business registration number (if registered)
- TIN (Tax Identification Number) for tax purposes
- VAT/NBT details if applicable
- Date and time of transaction

**Optional but Recommended:**
- Store logo
- Return policy statement
- Warranty information
- Customer hotline
- Website/social media

**Language:**
- English is standard
- Sinhala/Tamil option for local customers
- Numeric amounts in LKR

### Expected Outcome
```python
# In PaymentService class

def generate_receipt_data(self, order):
    """
    Generate receipt data for printing.
    
    Args:
        order (POSOrder): Completed order
        
    Returns:
        dict: Receipt data with all required information
        
    Example:
        >>> receipt = service.generate_receipt_data(order)
        >>> print(receipt['total'])
        1782.00
    """
    from django.conf import settings
    
    # Get store information
    store_info = {
        'name': getattr(settings, 'STORE_NAME', 'Store Name'),
        'address_line1': getattr(settings, 'STORE_ADDRESS_1', ''),
        'address_line2': getattr(settings, 'STORE_ADDRESS_2', ''),
        'phone': getattr(settings, 'STORE_PHONE', ''),
        'email': getattr(settings, 'STORE_EMAIL', ''),
        'business_reg': getattr(settings, 'BUSINESS_REG_NUMBER', ''),
        'tin': getattr(settings, 'TAX_ID_NUMBER', ''),
    }
    
    # Get transaction information
    transaction_info = {
        'order_number': order.order_number,
        'date': order.created_at.strftime('%Y-%m-%d'),
        'time': order.created_at.strftime('%H:%M:%S'),
        'datetime': order.created_at.strftime('%Y-%m-%d %H:%M:%S'),
        'cashier': order.cashier.get_full_name() or order.cashier.username,
        'session_number': order.session.session_number if order.session else 'N/A',
    }
    
    # Get customer information
    customer_info = {}
    if order.customer:
        customer_info = {
            'name': order.customer.name or order.customer.email,
            'phone': getattr(order.customer, 'phone', None),
            'email': getattr(order.customer, 'email', None),
        }
    
    # Get items
    items = []
    for item in order.items.all():
        items.append({
            'product_name': item.product.name,
            'sku': item.product.sku,
            'quantity': float(item.quantity),
            'unit_price': float(item.unit_price),
            'discount': float(item.discount_amount) if item.discount_amount else 0,
            'tax': float(item.tax_amount) if item.tax_amount else 0,
            'subtotal': float(item.subtotal),
            'total': float(item.total),
        })
    
    # Get payments
    payments = []
    for payment in order.cart.payments.filter(
        status=PAYMENT_STATUS_COMPLETED
    ):
        payment_data = {
            'method': payment.get_method_display(),
            'amount': float(payment.amount),
        }
        
        # Add method-specific details
        if payment.method == PAYMENT_METHOD_CASH:
            payment_data['tendered'] = float(payment.amount_tendered or 0)
            payment_data['change'] = float(payment.change_due or 0)
        
        elif payment.method == PAYMENT_METHOD_CARD:
            payment_data['card_type'] = 'Card'
            payment_data['last4'] = payment.notes[-4:] if payment.notes else '****'
            payment_data['auth_code'] = payment.authorization_code
        
        elif payment.method == PAYMENT_METHOD_MOBILE:
            payment_data['reference'] = payment.reference_number
        
        payments.append(payment_data)
    
    # Calculate totals
    totals = {
        'subtotal': float(order.subtotal),
        'discount': float(order.discount_amount) if order.discount_amount else 0,
        'tax': float(order.tax_amount) if order.tax_amount else 0,
        'total': float(order.total),
    }
    
    # Footer information
    footer = {
        'thank_you_message': 'Thank you for your purchase!',
        'return_policy': 'Returns within 7 days with receipt',
        'website': getattr(settings, 'STORE_WEBSITE', ''),
        'support_phone': getattr(settings, 'SUPPORT_PHONE', store_info['phone']),
    }
    
    # Compile receipt data
    receipt_data = {
        'store': store_info,
        'transaction': transaction_info,
        'customer': customer_info,
        'items': items,
        'payments': payments,
        'totals': totals,
        'footer': footer,
        'metadata': {
            'print_time': timezone.now().isoformat(),
            'paper_width': 80,  # mm
            'currency': 'LKR',
        }
    }
    
    return receipt_data
```

### Receipt Printing Service (Separate)
```python
# apps/pos/services/receipt_printer.py

class ReceiptPrinter:
    """
    Service for formatting and printing receipts.
    Handles thermal printer commands (ESC/POS).
    """
    
    def print_receipt(self, receipt_data):
        """
        Print receipt to thermal printer.
        
        Args:
            receipt_data (dict): Receipt data from generate_receipt_data
            
        Returns:
            bool: Success status
        """
        # Format receipt with ESC/POS commands
        commands = self._format_receipt(receipt_data)
        
        # Send to printer
        return self._send_to_printer(commands)
    
    def _format_receipt(self, data):
        """Format receipt data as ESC/POS commands"""
        # TODO: Implement ESC/POS formatting
        # Center text, bold, sizes, etc.
        pass
    
    def _send_to_printer(self, commands):
        """Send commands to printer"""
        # TODO: Send to actual printer
        pass
```

### Verification Checklist
- [ ] `generate_receipt_data` method implemented
- [ ] Store information included
- [ ] Transaction details included
- [ ] Customer information (if exists)
- [ ] All items with details
- [ ] All payment methods with details
- [ ] Calculated totals correct
- [ ] Footer with policies
- [ ] Formatted for thermal printer
- [ ] Sri Lankan requirements met

---

## Task 73: Add payment_audit_logging

### Overview
Implement comprehensive audit logging for all payment operations to track transactions, failures, and user actions.

### Dependencies
- All payment processing methods
- Django logging configured

### Instructions

1. **Create PaymentAuditLog model**
   - File: `apps/pos/models/payment_audit_log.py`
   - Store all payment-related events
   - Immutable records for compliance

2. **Define log event types**
   - PAYMENT_INITIATED
   - PAYMENT_COMPLETED
   - PAYMENT_FAILED
   - PAYMENT_VOIDED
   - PAYMENT_REFUNDED
   - TRANSACTION_COMPLETED
   - TRANSACTION_VOIDED
   - MANUAL_DRAWER_OPEN

3. **Add log fields**
   - event_type: Type of event
   - cart: Reference to cart
   - payment: Reference to payment (if applicable)
   - user: User who performed action
   - timestamp: When event occurred
   - ip_address: User's IP address
   - details: JSON field with event details
   - success: Boolean indicating success/failure

4. **Create audit logging methods**
   - `log_payment_initiated`
   - `log_payment_completed`
   - `log_payment_failed`
   - `log_transaction_completed`
   - `log_transaction_voided`

5. **Integrate with payment methods**
   - Add logging calls in:
     - process_cash_payment
     - process_card_payment
     - process_mobile_payment
     - process_store_credit
     - complete_transaction
     - void_transaction

6. **Add security logging**
   - Failed payment attempts (potential fraud)
   - Multiple void attempts
   - Unusual refund patterns
   - Large transactions
   - Manual drawer opens

7. **Add query methods**
   - Get logs by cart
   - Get logs by user
   - Get logs by date range
   - Get failed payment logs
   - Get security events

8. **Configure log retention**
   - Keep audit logs for 7 years (compliance)
   - Archive old logs
   - Separate from application logs

### Audit Log Flow Diagram

```
┌────────────────────────────────────────────────────────┐
│           Payment Audit Logging                         │
└────────────────────────────────────────────────────────┘

Every Payment Event:
        │
        ▼
┌──────────────────┐
│ Create Audit Log │
├──────────────────┤
│ - event_type     │
│ - timestamp      │
│ - user           │
│ - cart/payment   │
│ - ip_address     │
│ - details (JSON) │
│ - success        │
└──────────────────┘
        │
        ▼
┌──────────────────┐
│ Store in DB      │
│ (Immutable)      │
└──────────────────┘
        │
        ▼
┌──────────────────┐
│ Also Log to File │
│ (Redundancy)     │
└──────────────────┘
```

### Expected Outcome
```python
# apps/pos/models/payment_audit_log.py

from django.db import models
from django.conf import settings


class PaymentAuditLog(models.Model):
    """
    Immutable audit log for all payment-related events.
    Required for compliance and security.
    """
    
    # Event types
    EVENT_PAYMENT_INITIATED = 'PAYMENT_INITIATED'
    EVENT_PAYMENT_COMPLETED = 'PAYMENT_COMPLETED'
    EVENT_PAYMENT_FAILED = 'PAYMENT_FAILED'
    EVENT_PAYMENT_VOIDED = 'PAYMENT_VOIDED'
    EVENT_PAYMENT_REFUNDED = 'PAYMENT_REFUNDED'
    EVENT_TRANSACTION_COMPLETED = 'TRANSACTION_COMPLETED'
    EVENT_TRANSACTION_VOIDED = 'TRANSACTION_VOIDED'
    EVENT_DRAWER_OPENED = 'DRAWER_OPENED'
    
    EVENT_TYPE_CHOICES = (
        (EVENT_PAYMENT_INITIATED, 'Payment Initiated'),
        (EVENT_PAYMENT_COMPLETED, 'Payment Completed'),
        (EVENT_PAYMENT_FAILED, 'Payment Failed'),
        (EVENT_PAYMENT_VOIDED, 'Payment Voided'),
        (EVENT_PAYMENT_REFUNDED, 'Payment Refunded'),
        (EVENT_TRANSACTION_COMPLETED, 'Transaction Completed'),
        (EVENT_TRANSACTION_VOIDED, 'Transaction Voided'),
        (EVENT_DRAWER_OPENED, 'Cash Drawer Opened'),
    )
    
    event_type = models.CharField(
        max_length=50,
        choices=EVENT_TYPE_CHOICES,
        help_text="Type of payment event"
    )
    
    cart = models.ForeignKey(
        'pos.POSCart',
        on_delete=models.PROTECT,  # Never delete audit logs
        related_name='audit_logs',
        help_text="Associated cart"
    )
    
    payment = models.ForeignKey(
        'pos.POSPayment',
        on_delete=models.PROTECT,
        null=True,
        blank=True,
        related_name='audit_logs',
        help_text="Associated payment (if applicable)"
    )
    
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.PROTECT,
        help_text="User who performed the action"
    )
    
    timestamp = models.DateTimeField(
        auto_now_add=True,
        help_text="When the event occurred"
    )
    
    ip_address = models.GenericIPAddressField(
        null=True,
        blank=True,
        help_text="IP address of the user"
    )
    
    details = models.JSONField(
        default=dict,
        help_text="Event-specific details (JSON)"
    )
    
    success = models.BooleanField(
        default=True,
        help_text="Whether the operation succeeded"
    )
    
    error_message = models.TextField(
        null=True,
        blank=True,
        help_text="Error message if failed"
    )
    
    class Meta:
        db_table = 'pos_payment_audit_log'
        ordering = ['-timestamp']
        verbose_name = 'Payment Audit Log'
        verbose_name_plural = 'Payment Audit Logs'
        indexes = [
            models.Index(fields=['cart', 'timestamp']),
            models.Index(fields=['user', 'timestamp']),
            models.Index(fields=['event_type', 'timestamp']),
            models.Index(fields=['success']),
        ]
    
    def __str__(self):
        return f"{self.event_type} - Cart #{self.cart_id} - {self.timestamp}"


# Helper function for creating audit logs
def log_payment_event(event_type, cart, user, payment=None, success=True, 
                      error_message=None, ip_address=None, **details):
    """
    Create payment audit log entry.
    
    Args:
        event_type: Event type constant
        cart: POSCart instance
        user: User performing action
        payment: POSPayment instance (optional)
        success: Whether operation succeeded
        error_message: Error message if failed
        ip_address: User's IP address
        **details: Additional event-specific details
        
    Returns:
        PaymentAuditLog instance
    """
    return PaymentAuditLog.objects.create(
        event_type=event_type,
        cart=cart,
        payment=payment,
        user=user,
        success=success,
        error_message=error_message,
        ip_address=ip_address,
        details=details
    )


# Integration with PaymentService
# Add to each payment method:

@transaction.atomic
def process_cash_payment(self, amount_tendered):
    """Process cash payment with audit logging"""
    
    # Log initiation
    log_payment_event(
        event_type=PaymentAuditLog.EVENT_PAYMENT_INITIATED,
        cart=self.cart,
        user=self.user,
        amount=float(amount_tendered),
        method='CASH'
    )
    
    try:
        # ... existing payment logic ...
        
        payment = self._create_payment_record(...)
        
        # Log completion
        log_payment_event(
            event_type=PaymentAuditLog.EVENT_PAYMENT_COMPLETED,
            cart=self.cart,
            user=self.user,
            payment=payment,
            amount=float(payment.amount),
            change=float(payment.change_due),
            method='CASH'
        )
        
        return payment
        
    except Exception as e:
        # Log failure
        log_payment_event(
            event_type=PaymentAuditLog.EVENT_PAYMENT_FAILED,
            cart=self.cart,
            user=self.user,
            success=False,
            error_message=str(e),
            method='CASH'
        )
        raise
```

### Verification Checklist
- [ ] PaymentAuditLog model created
- [ ] All event types defined
- [ ] Log fields comprehensive
- [ ] `log_payment_event` helper function
- [ ] Integration with all payment methods
- [ ] Security events logged
- [ ] Query methods for reporting
- [ ] Logs immutable (PROTECT on delete)
- [ ] Indexed for fast queries

---

## Task 74: Create held_cart_functionality

### Overview
Implement the ability to "hold" a cart (park it temporarily) and retrieve it later for completion.

### Dependencies
- Task 69: Create complete_transaction
- Cart status constants

### Instructions

1. **Add HELD status to cart constants**
   - Constant: `CART_STATUS_HELD`
   - Value: `'HELD'`
   - Add to CART_STATUS_CHOICES

2. **Add held cart fields to POSCart model**
   - Field: `held_at` (DateTimeField, nullable)
   - Field: `held_by` (ForeignKey to User, nullable)
   - Field: `held_reason` (TextField, nullable)
   - Field: `held_identifier` (CharField, unique, nullable)

3. **Add hold_cart method to CartService**
   - Method name: `hold_cart`
   - Parameters: `cart`, `user`, `reason` (optional)
   - Updates cart status to HELD
   - Generates held_identifier for retrieval

4. **Add retrieve_held_cart method**
   - Method name: `retrieve_held_cart`
   - Parameters: `held_identifier` or search criteria
   - Returns held cart for completion
   - Updates status back to OPEN

5. **Add list_held_carts method**
   - Returns all held carts for session or user
   - Ordered by held_at
   - Shows held_identifier, customer, total

6. **Add auto-void held carts on session close**
   - Configuration: MAX_HELD_CART_HOURS
   - Carts held > X hours are auto-voided
   - Occurs during session close

7. **Add held cart UI indicators**
   - Count of held carts in session
   - Quick access to held carts
   - Visual identifier display

8. **Add held cart limitations**
   - Maximum held carts per session (e.g., 10)
   - Maximum hold time (e.g., 24 hours)
   - Cannot hold empty carts

### Held Cart Flow Diagram

```
┌────────────────────────────────────────────────────────┐
│              Held Cart Workflow                         │
└────────────────────────────────────────────────────────┘

[Active Cart with Items]
        │
        ▼
┌──────────────────┐
│ Customer Steps   │
│ Away / Hold      │
└──────────────────┘
        │
        ▼
┌──────────────────┐
│ hold_cart()      │
│ - Status: HELD   │
│ - Generate ID    │
│ - Store reason   │
└──────────────────┘
        │
        ▼
┌──────────────────┐
│ Cart Parked      │
│ (Held Carts      │
│  List)           │
└──────────────────┘
        │
        ▼ (Later...)
┌──────────────────┐
│ Customer Returns │
│ retrieve_held()  │
└──────────────────┘
        │
        ▼
┌──────────────────┐
│ Cart Restored    │
│ Status: OPEN     │
│ Continue Sale    │
└──────────────────┘
        │
        ▼
[Complete or Hold Again]
```

### Held Cart Use Cases

**Scenario 1: Customer Steps Away**
```
- Customer at checkout
- Realizes they forgot an item
- Cashier holds cart
- Customer retrieves item
- Cashier recalls cart
- Complete transaction
```

**Scenario 2: Price Check Needed**
```
- Scan item without price
- Need manager to verify price
- Hold cart temporarily
- Manager checks price
- Recall cart
- Complete transaction
```

**Scenario 3: Payment Issue**
```
- Card declined
- Customer needs to get cash/another card
- Hold cart
- Customer returns with payment
- Recall cart
- Complete transaction
```

**Scenario 4: Queue Management**
```
- Long transaction in progress
- Quick customer waiting
- Hold first transaction
- Serve quick customer
- Recall held transaction
- Complete both
```

### Held Identifier Format

**Format:** `HELD-{SESSION_NO}-{SEQUENCE}`

**Example:** `HELD-SES20260123001-003`

**Alternative:** Display on receipt slip with QR code

### Expected Outcome
```python
# Add to apps/pos/constants.py
CART_STATUS_HELD = 'HELD'

# Add to CART_STATUS_CHOICES
CART_STATUS_CHOICES = (
    (CART_STATUS_OPEN, 'Open'),
    (CART_STATUS_COMPLETED, 'Completed'),
    (CART_STATUS_HELD, 'Held'),
    (CART_STATUS_VOIDED, 'Voided'),
)

# Add fields to POSCart model
held_at = models.DateTimeField(
    null=True,
    blank=True,
    help_text="When cart was held"
)

held_by = models.ForeignKey(
    settings.AUTH_USER_MODEL,
    on_delete=models.SET_NULL,
    null=True,
    blank=True,
    related_name='held_carts',
    help_text="User who held the cart"
)

held_reason = models.TextField(
    null=True,
    blank=True,
    help_text="Reason for holding cart"
)

held_identifier = models.CharField(
    max_length=50,
    null=True,
    blank=True,
    unique=True,
    help_text="Unique identifier for retrieving held cart"
)


# apps/pos/services/cart_service.py

class CartService:
    """Service for cart operations including hold/retrieve"""
    
    @transaction.atomic
    def hold_cart(self, cart, user, reason=None):
        """
        Hold (park) a cart for later retrieval.
        
        Args:
            cart: POSCart instance
            user: User holding the cart
            reason: Optional reason for holding
            
        Returns:
            dict: {
                'cart': Updated cart,
                'held_identifier': Identifier for retrieval
            }
            
        Raises:
            ValueError: If cart cannot be held
        """
        from apps.pos.constants import CART_STATUS_OPEN, CART_STATUS_HELD
        
        # Validate cart can be held
        if cart.status != CART_STATUS_OPEN:
            raise ValueError(
                f"Can only hold OPEN carts. Current status: {cart.status}"
            )
        
        if not cart.items.exists():
            raise ValueError("Cannot hold empty cart")
        
        # Check held cart limits
        session = cart.session
        held_count = session.carts.filter(status=CART_STATUS_HELD).count()
        max_held = getattr(settings, 'MAX_HELD_CARTS_PER_SESSION', 10)
        
        if held_count >= max_held:
            raise ValueError(
                f"Maximum {max_held} held carts per session reached"
            )
        
        # Generate held identifier
        session_held_count = held_count + 1
        held_identifier = f"HELD-{session.session_number}-{session_held_count:03d}"
        
        # Update cart
        cart.status = CART_STATUS_HELD
        cart.held_at = timezone.now()
        cart.held_by = user
        cart.held_reason = reason or "Cart held by cashier"
        cart.held_identifier = held_identifier
        cart.save()
        
        # Log event
        log_payment_event(
            event_type='CART_HELD',
            cart=cart,
            user=user,
            held_identifier=held_identifier,
            reason=reason
        )
        
        return {
            'cart': cart,
            'held_identifier': held_identifier
        }
    
    @transaction.atomic
    def retrieve_held_cart(self, held_identifier=None, cart_id=None):
        """
        Retrieve a held cart for completion.
        
        Args:
            held_identifier: Held cart identifier
            cart_id: Cart ID (alternative to identifier)
            
        Returns:
            POSCart: Retrieved cart (status changed to OPEN)
            
        Raises:
            ValueError: If cart not found or cannot be retrieved
        """
        from apps.pos.constants import CART_STATUS_HELD, CART_STATUS_OPEN
        
        # Find cart
        if held_identifier:
            try:
                cart = POSCart.objects.get(
                    held_identifier=held_identifier,
                    status=CART_STATUS_HELD
                )
            except POSCart.DoesNotExist:
                raise ValueError(
                    f"Held cart not found: {held_identifier}"
                )
        elif cart_id:
            try:
                cart = POSCart.objects.get(
                    id=cart_id,
                    status=CART_STATUS_HELD
                )
            except POSCart.DoesNotExist:
                raise ValueError(f"Held cart not found: {cart_id}")
        else:
            raise ValueError("Must provide held_identifier or cart_id")
        
        # Check if cart is too old
        max_hours = getattr(settings, 'MAX_HELD_CART_HOURS', 24)
        if cart.held_at:
            hours_held = (timezone.now() - cart.held_at).total_seconds() / 3600
            if hours_held > max_hours:
                raise ValueError(
                    f"Held cart expired (held for {hours_held:.1f} hours)"
                )
        
        # Restore cart to OPEN
        cart.status = CART_STATUS_OPEN
        cart.save()
        
        return cart
    
    def list_held_carts(self, session=None, user=None):
        """
        List all held carts.
        
        Args:
            session: Filter by session
            user: Filter by user who held
            
        Returns:
            QuerySet: Held carts ordered by held_at
        """
        from apps.pos.constants import CART_STATUS_HELD
        
        held_carts = POSCart.objects.filter(status=CART_STATUS_HELD)
        
        if session:
            held_carts = held_carts.filter(session=session)
        
        if user:
            held_carts = held_carts.filter(held_by=user)
        
        return held_carts.order_by('held_at')
    
    @transaction.atomic
    def auto_void_expired_held_carts(self, session):
        """
        Auto-void held carts that have expired.
        Called during session close.
        
        Args:
            session: POS session being closed
            
        Returns:
            int: Number of carts voided
        """
        from apps.pos.constants import CART_STATUS_HELD, CART_STATUS_VOIDED
        from datetime import timedelta
        
        max_hours = getattr(settings, 'MAX_HELD_CART_HOURS', 24)
        cutoff_time = timezone.now() - timedelta(hours=max_hours)
        
        expired_carts = session.carts.filter(
            status=CART_STATUS_HELD,
            held_at__lt=cutoff_time
        )
        
        count = 0
        for cart in expired_carts:
            cart.status = CART_STATUS_VOIDED
            cart.voided_at = timezone.now()
            cart.void_reason = "Auto-voided: Held too long"
            cart.save()
            count += 1
        
        return count
```

### Configuration (settings.py)
```python
# Held Cart Settings
MAX_HELD_CARTS_PER_SESSION = 10
MAX_HELD_CART_HOURS = 24
AUTO_VOID_HELD_ON_SESSION_CLOSE = True
```

### Verification Checklist
- [ ] CART_STATUS_HELD constant added
- [ ] Held cart fields added to POSCart model
- [ ] `hold_cart` method implemented
- [ ] `retrieve_held_cart` method implemented
- [ ] `list_held_carts` method for viewing
- [ ] `auto_void_expired_held_carts` for cleanup
- [ ] Held identifier generation
- [ ] Validation and error handling
- [ ] Configuration settings
- [ ] Audit logging for hold/retrieve

---

## Summary

### Tasks Completed in This Document
| Task # | Task Name | Key Deliverable |
|--------|-----------|-----------------|
| 69 | Create complete_transaction | Transaction finalization with inventory updates |
| 70 | Implement void_transaction | Cancel transaction before completion |
| 71 | Add cash drawer trigger | Cash drawer hardware integration |
| 72 | Create payment receipt data | Receipt generation for printing |
| 73 | Add payment audit logging | Comprehensive audit trail |
| 74 | Create held cart functionality | Park and retrieve carts |

### Transaction Lifecycle Complete

```
Cart Created (OPEN)
        │
        ▼
    Add Items
        │
        ▼
    Process Payments
        │
        ├──→ Hold Cart (HELD) ──→ Retrieve ──┐
        │                                     │
        ▼                                     ▼
Complete Transaction              Resume from Hold
        │
        ▼
Cart COMPLETED → Order Created
                 Inventory Updated
                 Receipt Generated
                 
OR
        │
        ▼
    Void Transaction
        │
        ▼
    Cart VOIDED
```

### Files Created/Modified in This Document

```
apps/pos/
├── services/
│   ├── payment_service.py         # MODIFIED (Tasks 69-70)
│   ├── cash_drawer_service.py     # NEW (Task 71)
│   └── cart_service.py            # NEW (Task 74)
├── models/
│   ├── payment_audit_log.py       # NEW (Task 73)
│   └── pos_cart.py                # MODIFIED (Task 74 - held fields)
└── constants.py                   # MODIFIED (Task 74 - HELD status)
```

### Group D Complete: Payment Processing Summary

**All 20 tasks completed:**
1. Payment submodule structure ✓
2. Payment constants (methods and status) ✓
3. POSPayment model with all fields ✓
4. PaymentService with all payment methods ✓
5. Split payment support ✓
6. Payment validation ✓
7. Transaction completion ✓
8. Void transaction ✓
9. Cash drawer integration ✓
10. Receipt generation ✓
11. Audit logging ✓
12. Held cart functionality ✓

### Next Steps
1. **Test payment processing** with unit and integration tests
2. **Configure payment gateways** (PayHere, bank APIs)
3. **Set up receipt printers** and cash drawers
4. Proceed to [../Group-E_POS-API-Frontend-Integration/](../Group-E_POS-API-Frontend-Integration/) for API development

---

## Notes for AI Agents

1. **Transaction Safety:** All completion/void operations use @transaction.atomic
2. **Inventory Updates:** Use F() expressions for atomic stock updates
3. **Audit Trail:** Every payment event logged to PaymentAuditLog
4. **Sri Lankan Context:** Receipt should include business registration number
5. **Cash Drawer:** ESC/POS command (1B 70 00 32 FA) is standard
6. **Receipt Format:** 80mm thermal printer standard
7. **Held Carts:** Auto-void after 24 hours (configurable)
8. **Order Numbers:** Format POS-{SESSION}-{SEQ} for uniqueness
9. **Payment Reversal:** Store credit reversed on void, inventory not affected
10. **Compliance:** Keep audit logs for 7 years minimum
