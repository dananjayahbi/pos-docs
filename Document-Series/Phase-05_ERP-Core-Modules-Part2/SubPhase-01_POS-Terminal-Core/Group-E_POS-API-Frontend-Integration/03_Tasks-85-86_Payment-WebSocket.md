# Tasks 85-86: Payment Processing and WebSocket Events

> **Phase:** 05 - ERP Core Modules Part 2  
> **SubPhase:** 01 - POS Terminal Core  
> **Group:** E - POS API & Frontend Integration  
> **Document:** 03 of 03  
> **Tasks Covered:** 85, 86

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [02_Tasks-81-84_ViewSets-Search.md](02_Tasks-81-84_ViewSets-Search.md)
- **→ Next Group:** [../Group-F_Testing-Documentation/](../Group-F_Testing-Documentation/)

---

## Document Overview

This document covers the creation of payment processing endpoints and WebSocket event handling for real-time POS updates. The payment view handles transaction processing with multiple payment methods, while WebSocket consumers enable live cart updates and session notifications across connected clients.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 85 | Create PaymentView | High | 30 min |
| 86 | Add POS WebSocket events | High | 35 min |

---

## Payment and WebSocket Architecture

### Overall Architecture

```
┌─────────────────────────────────────────────────────────┐
│        POS Payment & Real-time Architecture             │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ┌──────────────────┐                                   │
│  │   Frontend POS   │                                   │
│  │   Application    │                                   │
│  └────────┬─────────┘                                   │
│           │                                             │
│  ┌────────┴──────────┬──────────────────┐              │
│  │                   │                  │              │
│  ▼                   ▼                  ▼              │
│ HTTP API         WebSocket          WebSocket          │
│ (Payment)        (Cart Events)    (Session Events)     │
│  │                   │                  │              │
│  ▼                   ▼                  ▼              │
│ PaymentView      CartConsumer    SessionConsumer       │
│  │                   │                  │              │
│  ├─ Validate         ├─ cart.updated   ├─ session.opened│
│  ├─ Process          ├─ item.added     ├─ session.closed│
│  ├─ Record           ├─ item.removed   └─ stats.updated│
│  └─ Broadcast        └─ cart.completed                 │
│      (via WS)                                           │
│                                                         │
│  ┌──────────────────────────────────────────────┐      │
│  │          Channel Layers (Redis)              │      │
│  │  - cart_{cart_id}                            │      │
│  │  - session_{session_id}                      │      │
│  │  - terminal_{terminal_id}                    │      │
│  └──────────────────────────────────────────────┘      │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### Design Principles

| Principle | Implementation |
|-----------|----------------|
| **Atomic Transactions** | Payment processing in database transactions |
| **Idempotency** | Duplicate payment prevention |
| **Real-time Updates** | WebSocket broadcasts for state changes |
| **Security** | Payment validation and authorization |
| **Error Handling** | Graceful failure and rollback |
| **Audit Trail** | Complete payment history logging |

---

## Task 85: Create PaymentView

### Overview
Create API views for processing POS payments, supporting multiple payment methods (cash, card, mobile) and split payments with full validation and transaction management.

### Dependencies
- POSPayment model (Group D, Task 67)
- POSCart model (Group B, Task 09)
- POSPaymentSerializer (Task 80)
- Payment integration services

### Instructions

#### 1. Create Payment Views File

1. **Create payment app views file**
   - Location: `apps/pos/payment/views.py`
   - Import required DRF components

2. **Add required imports**
   - Import APIView, Response, status from rest_framework
   - Import permissions classes
   - Import POSPayment, POSCart, POSSession models
   - Import POSPaymentSerializer, POSPaymentRequestSerializer
   - Import transaction from django.db
   - Import Decimal, timezone
   - Import payment service integrations
   - Import channel layers for WebSocket

#### 2. Create Payment Service Layer

1. **Create payment service file**
   - Location: `apps/pos/payment/services.py`
   - Encapsulate payment processing logic

2. **Define PaymentService class**
   - Static methods for payment operations
   - Separate concerns from view logic

3. **Implement payment method handlers**
   - `process_cash_payment(cart, amount, tendered_amount)`
   - `process_card_payment(cart, amount, card_details)`
   - `process_mobile_payment(cart, amount, reference)`
   - `process_online_payment(cart, amount, reference)`

4. **Implement validation methods**
   - `validate_payment_amount(cart, amount)`
   - `validate_payment_method(method)`
   - `validate_cart_state(cart)`
   - `check_duplicate_payment(cart)`

#### 3. Create Payment Initiation View

1. **Define PaymentInitiateView class**
   - Inherit from APIView
   - Handle POST requests for payment initiation

2. **Set class attributes**
   - `permission_classes` - requires active session

3. **Implement post method**
   - Extract cart_id and payment details from request
   - Validate request data using POSPaymentRequestSerializer
   - Validate cart exists and is ACTIVE
   - Validate payment amount
   - Create payment record with PENDING status
   - Return payment details with transaction ID

4. **Add request validation**
   - Validate cart belongs to current session
   - Validate cart has items
   - Validate cart not already paid
   - Validate session is OPEN
   - Validate payment method is enabled

#### 4. Create Payment Processing View

1. **Define PaymentProcessView class**
   - Inherit from APIView
   - Handle POST requests for payment execution

2. **Implement post method**
   - Extract payment_id from request
   - Get payment record by ID
   - Validate payment is PENDING
   - Call appropriate payment service method
   - Update payment status
   - Complete transaction if successful
   - Return payment result

3. **Add transaction management**
   - Wrap in database transaction (atomic)
   - On success: commit and complete cart
   - On failure: rollback and update payment status
   - Log all operations

#### 5. Implement Cash Payment Processing

1. **Create process_cash_payment method**
   - Accept cart, amount, tendered_amount
   - Validate amount <= tendered_amount
   - Calculate change amount
   - Mark payment as COMPLETED
   - Update cart status to COMPLETED
   - Record payment details

2. **Add cash handling**
   - Store tendered_amount
   - Calculate change
   - Update session expected_cash
   - Record in cash register log

3. **Add validation**
   - Validate tendered_amount >= amount
   - Validate reasonable cash limits
   - Warn on large bills

#### 6. Implement Card Payment Processing

1. **Create process_card_payment method**
   - Accept cart, amount, card_details
   - Integrate with payment gateway
   - Process authorization
   - Handle response
   - Store transaction details

2. **Add payment gateway integration**
   - Call payment gateway API
   - Handle authorization codes
   - Handle declined cards
   - Store card_last_four, card_type
   - Store authorization_code

3. **Add error handling**
   - Handle gateway timeout
   - Handle declined cards
   - Handle network errors
   - Retry logic for transient failures

4. **Add security measures**
   - Never store full card number
   - Store only last 4 digits
   - Use tokenization if available
   - PCI compliance considerations

#### 7. Implement Mobile Payment Processing

1. **Create process_mobile_payment method**
   - Accept cart, amount, mobile_reference
   - Validate mobile payment reference
   - Check payment status with provider
   - Confirm payment received
   - Mark as COMPLETED

2. **Add mobile payment integrations**
   - Integrate with PayHere (Sri Lanka)
   - Integrate with other mobile wallets
   - Webhook for payment confirmation
   - Polling for payment status

3. **Add reference validation**
   - Validate reference format
   - Check reference not already used
   - Verify with payment provider

#### 8. Implement Split Payment Support

1. **Create PaymentSplitView class**
   - Handle multiple payments for one cart
   - Validate total equals cart total
   - Process each payment individually

2. **Implement post method**
   - Extract cart_id and payments array
   - Validate sum of payments equals cart.grand_total
   - Process each payment in sequence
   - Use database transaction
   - If any fails, rollback all
   - Return split payment summary

3. **Add split payment logic**
   - Create multiple POSPayment records
   - Link all to same cart
   - Mark as split_payment
   - Process in order
   - Complete cart only when all successful

#### 9. Create Payment Completion View

1. **Define PaymentCompleteView class**
   - Finalize transaction after payment
   - Generate receipt
   - Update inventory
   - Trigger WebSocket events

2. **Implement post method**
   - Get payment_id or cart_id
   - Verify payment is COMPLETED
   - Finalize cart (status = COMPLETED)
   - Update inventory (reduce stock)
   - Generate receipt reference
   - Trigger completion events
   - Return receipt data

3. **Add completion actions**
   - Update inventory quantities
   - Update customer loyalty points
   - Generate receipt/invoice
   - Send to receipt printer
   - Broadcast completion event via WebSocket

#### 10. Create Payment Refund View

1. **Define PaymentRefundView class**
   - Handle payment refunds
   - Partial or full refunds

2. **Implement post method**
   - Extract payment_id and refund_amount
   - Validate payment is COMPLETED
   - Validate refund_amount <= original amount
   - Process refund with payment gateway
   - Create refund record
   - Update inventory if needed
   - Return refund details

3. **Add refund logic**
   - For cash: record cash out
   - For card: process gateway refund
   - For mobile: process provider refund
   - Update payment record
   - Update cart if full refund

#### 11. Add Payment History View

1. **Define PaymentHistoryView class**
   - List payments for session or cart
   - Filter by date, method, status

2. **Implement get method**
   - Filter by session, cart, or date range
   - Order by created_at descending
   - Paginate results
   - Return serialized payments

#### 12. Add Payment Status Check View

1. **Define PaymentStatusView class**
   - Check payment status
   - For async payment methods (mobile, online)

2. **Implement get method**
   - Extract payment_id or reference
   - Query payment status
   - Check with provider if needed
   - Return current status

#### 13. Implement WebSocket Broadcasting

1. **Import channel layers**
   - From channels.layers import get_channel_layer
   - From asgiref.sync import async_to_sync

2. **Create broadcast helper methods**
   - `broadcast_payment_initiated(cart, payment)`
   - `broadcast_payment_completed(cart, payment)`
   - `broadcast_payment_failed(cart, payment)`

3. **Implement broadcast logic**
   - Get channel layer
   - Send to cart group
   - Send to session group
   - Send to terminal group
   - Include payment details

#### 14. Add Error Handling

1. **Handle payment errors**
   - Invalid cart state
   - Insufficient amount
   - Payment method unavailable
   - Gateway errors
   - Duplicate payments
   - Network timeouts

2. **Create error responses**
   - Return appropriate status codes
   - Include error messages
   - Suggest resolution steps
   - Log errors for debugging

3. **Add rollback logic**
   - Rollback on any failure
   - Revert inventory updates
   - Revert cart status
   - Mark payment as FAILED

#### 15. Add Logging and Auditing

1. **Log all payment operations**
   - Payment initiated
   - Payment processing
   - Payment completed
   - Payment failed
   - Refunds

2. **Add audit trail**
   - Store complete payment history
   - Store gateway responses
   - Store user actions
   - Store timestamps
   - Store IP addresses

### Payment View Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/pos/payment/initiate/` | Initiate payment for cart |
| POST | `/api/pos/payment/process/` | Process pending payment |
| POST | `/api/pos/payment/complete/` | Complete and finalize transaction |
| POST | `/api/pos/payment/split/` | Process split payment |
| POST | `/api/pos/payment/{id}/refund/` | Refund payment |
| GET | `/api/pos/payment/history/` | Payment history for session |
| GET | `/api/pos/payment/{id}/status/` | Check payment status |

### Request/Response Examples

#### Initiate Cash Payment
```
POST /api/pos/payment/initiate/
Content-Type: application/json

{
    "cart": "cart-uuid",
    "payment_method": "CASH",
    "amount": "125000.00",
    "tendered_amount": "150000.00"
}
```

Response:
```json
{
    "payment_id": "payment-uuid",
    "status": "PENDING",
    "amount": "125000.00",
    "change_amount": "25000.00",
    "message": "Payment initiated. Please confirm to complete."
}
```

#### Process Card Payment
```
POST /api/pos/payment/process/
Content-Type: application/json

{
    "payment_id": "payment-uuid",
    "card_last_four": "4532",
    "card_type": "VISA",
    "authorization_code": "AUTH123456"
}
```

Response:
```json
{
    "payment_id": "payment-uuid",
    "status": "COMPLETED",
    "amount": "125000.00",
    "payment_method": "CARD",
    "card_last_four": "4532",
    "authorization_code": "AUTH123456",
    "processed_at": "2026-01-23T14:45:30Z",
    "message": "Payment processed successfully"
}
```

#### Complete Transaction
```
POST /api/pos/payment/complete/
Content-Type: application/json

{
    "payment_id": "payment-uuid"
}
```

Response:
```json
{
    "payment_id": "payment-uuid",
    "cart": {
        "id": "cart-uuid",
        "reference_number": "POS-2024-T01-000123",
        "status": "COMPLETED",
        "grand_total": "125000.00"
    },
    "receipt": {
        "receipt_number": "REC-20260123-0123",
        "receipt_url": "/api/receipts/REC-20260123-0123/"
    },
    "inventory_updated": true,
    "message": "Transaction completed successfully"
}
```

#### Split Payment
```
POST /api/pos/payment/split/
Content-Type: application/json

{
    "cart": "cart-uuid",
    "payments": [
        {
            "payment_method": "CASH",
            "amount": "50000.00",
            "tendered_amount": "50000.00"
        },
        {
            "payment_method": "CARD",
            "amount": "75000.00",
            "card_last_four": "4532",
            "authorization_code": "AUTH123456"
        }
    ]
}
```

Response:
```json
{
    "cart": "cart-uuid",
    "total_amount": "125000.00",
    "payments": [
        {
            "id": "payment-uuid-1",
            "payment_method": "CASH",
            "amount": "50000.00",
            "status": "COMPLETED"
        },
        {
            "id": "payment-uuid-2",
            "payment_method": "CARD",
            "amount": "75000.00",
            "status": "COMPLETED"
        }
    ],
    "status": "COMPLETED",
    "message": "Split payment completed successfully"
}
```

#### Refund Payment
```
POST /api/pos/payment/{id}/refund/
Content-Type: application/json

{
    "refund_amount": "125000.00",
    "reason": "Customer return"
}
```

Response:
```json
{
    "refund_id": "refund-uuid",
    "original_payment_id": "payment-uuid",
    "refund_amount": "125000.00",
    "refund_method": "CARD",
    "status": "COMPLETED",
    "processed_at": "2026-01-23T15:30:00Z",
    "message": "Refund processed successfully"
}
```

### Payment Flow Diagram

```
┌─────────────────────────────────────────────────────────┐
│              Payment Processing Flow                    │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  1. Frontend: Initiate Payment                          │
│     POST /payment/initiate/                             │
│     → cart_id, payment_method, amount                   │
│              │                                           │
│              ▼                                           │
│  2. Backend: Validate Request                           │
│     → Validate cart state (ACTIVE)                      │
│     → Validate session (OPEN)                           │
│     → Validate amount                                   │
│     → Check no existing payment                         │
│              │                                           │
│              ▼                                           │
│  3. Create Payment Record (PENDING)                     │
│     → POSPayment.objects.create()                       │
│     → status = PENDING                                  │
│     → Return payment_id                                 │
│              │                                           │
│              ▼                                           │
│  4. Frontend: Confirm and Process                       │
│     POST /payment/process/                              │
│     → payment_id, additional_details                    │
│              │                                           │
│              ▼                                           │
│  5. Backend: Process Payment                            │
│     ┌────────┴─────────┐                                │
│     │                  │                                │
│     ▼                  ▼                                │
│   CASH              CARD/MOBILE                         │
│   → Validate        → Call payment gateway              │
│   → Record          → Handle response                   │
│   → Calculate       → Store authorization               │
│     change                                              │
│              │                                           │
│              ▼                                           │
│  6. Update Payment Status                               │
│     → status = COMPLETED (or FAILED)                    │
│     → processed_at = now()                              │
│     → Save payment record                               │
│              │                                           │
│              ▼                                           │
│  7. Complete Transaction                                │
│     POST /payment/complete/                             │
│     → Update cart status = COMPLETED                    │
│     → Update inventory                                  │
│     → Generate receipt                                  │
│     → Broadcast WebSocket event                         │
│              │                                           │
│              ▼                                           │
│  8. Return Success Response                             │
│     → payment details                                   │
│     → receipt information                               │
│     → cart summary                                      │
│                                                         │
│  Error at any step:                                     │
│  → Rollback transaction                                 │
│  → Update payment status = FAILED                       │
│  → Return error response                                │
│  → Log error details                                    │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### Validation Rules

| Validation | Check | Error Message |
|------------|-------|---------------|
| **Cart State** | Cart must be ACTIVE | "Cart is not active" |
| **Session State** | Session must be OPEN | "Session is not open" |
| **Payment Amount** | Amount must equal cart total (or be part of split) | "Invalid payment amount" |
| **Duplicate Check** | No existing COMPLETED payment for cart | "Payment already processed" |
| **Payment Method** | Method must be enabled and valid | "Payment method not available" |
| **Card Details** | Card_last_four required for CARD | "Card details required" |
| **Mobile Reference** | Reference required for MOBILE/ONLINE | "Payment reference required" |
| **Tendered Amount** | Must be >= amount for CASH | "Insufficient cash tendered" |

### Security Considerations

| Security Measure | Implementation |
|------------------|----------------|
| **PCI Compliance** | Never store full card numbers |
| **Tokenization** | Use payment gateway tokens |
| **HTTPS Only** | All payment endpoints require SSL |
| **Idempotency** | Prevent duplicate payment processing |
| **Authorization** | Verify user has permission to process payments |
| **Audit Logging** | Log all payment operations |
| **Rate Limiting** | Prevent payment API abuse |

### Expected Outcome
```
apps/pos/payment/
├── models.py
├── serializers.py
├── views.py                     # Payment views created
├── services.py                  # Payment service layer
└── utils.py                     # Helper functions
```

### Verification Checklist
- [ ] PaymentInitiateView created
- [ ] PaymentProcessView created
- [ ] PaymentCompleteView created
- [ ] PaymentSplitView created
- [ ] PaymentRefundView created
- [ ] PaymentHistoryView created
- [ ] PaymentStatusView created
- [ ] PaymentService class created
- [ ] Cash payment processing implemented
- [ ] Card payment processing implemented
- [ ] Mobile payment processing implemented
- [ ] Split payment support implemented
- [ ] Transaction management (atomic)
- [ ] Duplicate payment prevention
- [ ] WebSocket broadcasting integration
- [ ] Error handling comprehensive
- [ ] Security measures implemented
- [ ] Audit logging implemented

---

## Task 86: Add POS WebSocket Events

### Overview
Implement Django Channels WebSocket consumers for real-time POS updates, including cart changes, session events, and payment notifications.

### Dependencies
- Django Channels installed
- Redis for channel layers
- POSCart, POSSession, POSPayment models
- Serializers from Tasks 75-80

### Instructions

#### 1. Install and Configure Django Channels

1. **Install required packages**
   - Add to requirements: channels, channels-redis
   - Install: `pip install channels channels-redis`

2. **Configure Django settings**
   - Add 'channels' to INSTALLED_APPS
   - Set ASGI_APPLICATION = 'config.asgi.application'
   - Configure CHANNEL_LAYERS with Redis backend

3. **Create ASGI configuration**
   - Location: `config/asgi.py`
   - Import Django ASGI application
   - Import ProtocolTypeRouter, URLRouter
   - Import AuthMiddlewareStack
   - Configure routing

#### 2. Create WebSocket Routing

1. **Create websocket routing file**
   - Location: `apps/pos/routing.py`
   - Define WebSocket URL patterns

2. **Define WebSocket URL patterns**
   - `ws/pos/cart/<cart_id>/` - Cart updates
   - `ws/pos/session/<session_id>/` - Session updates
   - `ws/pos/terminal/<terminal_id>/` - Terminal updates

3. **Update main ASGI routing**
   - Import POS routing
   - Add to URLRouter
   - Apply authentication middleware

#### 3. Create Base POS Consumer

1. **Create consumers file**
   - Location: `apps/pos/consumers.py`
   - Import AsyncWebsocketConsumer from channels

2. **Define BasePOSConsumer class**
   - Inherit from AsyncWebsocketConsumer
   - Common methods for all POS consumers
   - Authentication and authorization

3. **Implement base methods**
   - `connect()` - Accept connection with auth check
   - `disconnect()` - Handle disconnection
   - `receive()` - Handle incoming messages
   - `send_json()` - Send JSON messages
   - `broadcast_to_group()` - Broadcast to group

4. **Add authentication**
   - Check if user is authenticated
   - Verify user has POS access
   - Reject unauthenticated connections

#### 4. Create POSCartConsumer

1. **Define POSCartConsumer class**
   - Inherit from BasePOSConsumer
   - Handle cart-specific events

2. **Implement connect method**
   - Extract cart_id from URL
   - Validate cart exists
   - Verify user has access to cart
   - Join cart group: `cart_{cart_id}`
   - Send connection confirmation

3. **Implement disconnect method**
   - Leave cart group
   - Clean up resources

4. **Implement receive method**
   - Parse incoming JSON messages
   - Handle message types:
     - `ping` - Keep-alive
     - `subscribe_updates` - Subscribe to specific events
     - `request_state` - Request current cart state

5. **Define broadcast methods**
   - `send_cart_updated()` - Full cart update
   - `send_item_added()` - Item added event
   - `send_item_removed()` - Item removed event
   - `send_item_quantity_changed()` - Quantity update
   - `send_discount_applied()` - Discount event
   - `send_cart_completed()` - Transaction complete

#### 5. Implement Cart Event Methods

1. **Create send_cart_updated method**
   - Serialize cart with items
   - Send to cart group
   - Include event type: "cart.updated"
   - Include timestamp

2. **Create send_item_added method**
   - Serialize new item
   - Send to cart group
   - Event type: "cart.item.added"
   - Include item details and updated totals

3. **Create send_item_removed method**
   - Include removed item ID
   - Send to cart group
   - Event type: "cart.item.removed"
   - Include updated totals

4. **Create send_item_quantity_changed method**
   - Include item ID and new quantity
   - Send to cart group
   - Event type: "cart.item.quantity_changed"
   - Include updated line total and cart totals

5. **Create send_discount_applied method**
   - Include discount details
   - Send to cart group
   - Event type: "cart.discount.applied"
   - Include updated totals

6. **Create send_cart_completed method**
   - Include payment details
   - Include receipt information
   - Send to cart group
   - Event type: "cart.completed"

#### 6. Create POSSessionConsumer

1. **Define POSSessionConsumer class**
   - Inherit from BasePOSConsumer
   - Handle session-specific events

2. **Implement connect method**
   - Extract session_id from URL
   - Validate session exists
   - Verify user has access (operator or admin)
   - Join session group: `session_{session_id}`
   - Send connection confirmation with session state

3. **Implement disconnect method**
   - Leave session group
   - Clean up resources

4. **Define broadcast methods**
   - `send_session_opened()` - Session opened event
   - `send_session_closed()` - Session closed event
   - `send_session_stats_updated()` - Real-time statistics
   - `send_transaction_completed()` - New transaction
   - `send_cash_drawer_opened()` - Cash drawer event

#### 7. Implement Session Event Methods

1. **Create send_session_opened method**
   - Include session details
   - Include operator info
   - Send to session and terminal groups
   - Event type: "session.opened"

2. **Create send_session_closed method**
   - Include final session statistics
   - Include cash reconciliation
   - Send to session and terminal groups
   - Event type: "session.closed"

3. **Create send_session_stats_updated method**
   - Include current statistics
   - Transaction count, sales total
   - Send to session group
   - Event type: "session.stats.updated"

4. **Create send_transaction_completed method**
   - Include transaction summary
   - Payment method breakdown
   - Send to session group
   - Event type: "session.transaction.completed"

5. **Create send_cash_drawer_opened method**
   - Include reason (sale, return, no-sale)
   - Include operator info
   - Send to session and terminal groups
   - Event type: "session.cash_drawer.opened"

#### 8. Create POSTerminalConsumer

1. **Define POSTerminalConsumer class**
   - Inherit from BasePOSConsumer
   - Handle terminal-wide events

2. **Implement connect method**
   - Extract terminal_id from URL
   - Validate terminal exists
   - Verify user has access
   - Join terminal group: `terminal_{terminal_id}`
   - Send connection confirmation

3. **Define broadcast methods**
   - `send_terminal_status_changed()` - Status change
   - `send_session_update()` - Session change notification
   - `send_alert()` - Terminal alerts/warnings

#### 9. Integrate WebSocket with Views

1. **Update POSCartViewSet**
   - After item added: broadcast via WebSocket
   - After item removed: broadcast via WebSocket
   - After discount applied: broadcast via WebSocket
   - After cart completed: broadcast via WebSocket

2. **Create broadcast helper in views**
   - `broadcast_cart_event(cart, event_type, data)`
   - Use async_to_sync with channel layer
   - Send to appropriate group

3. **Example integration in add action**
   ```python
   # After adding item
   from channels.layers import get_channel_layer
   from asgiref.sync import async_to_sync
   
   channel_layer = get_channel_layer()
   async_to_sync(channel_layer.group_send)(
       f"cart_{cart.id}",
       {
           "type": "cart.item.added",
           "item": CartItemSerializer(item).data,
           "cart_totals": {
               "subtotal": str(cart.subtotal),
               "grand_total": str(cart.grand_total)
           }
       }
   )
   ```

#### 10. Update Session Views

1. **Update POSSessionViewSet**
   - On session open: broadcast session.opened
   - On session close: broadcast session.closed
   - Periodically: broadcast stats update

2. **Create periodic stats broadcaster**
   - Use Celery task or background thread
   - Every 30 seconds, send stats update
   - To all connected clients in session group

#### 11. Update Payment Views

1. **Update PaymentProcessView**
   - On payment initiated: broadcast to cart group
   - On payment completed: broadcast to cart and session groups
   - On payment failed: broadcast error to cart group

2. **Broadcast payment events**
   - `payment.initiated` - Payment started
   - `payment.completed` - Payment successful
   - `payment.failed` - Payment failed

#### 12. Add Error Handling

1. **Handle connection errors**
   - Invalid cart/session/terminal ID
   - Unauthorized access
   - Connection lost

2. **Handle message errors**
   - Invalid message format
   - Unknown message type
   - Processing errors

3. **Add reconnection logic**
   - Send reconnection instructions
   - Resume from last known state
   - Sync state on reconnect

#### 13. Add Keep-Alive and Heartbeat

1. **Implement ping/pong**
   - Client sends ping every 30 seconds
   - Server responds with pong
   - Detect disconnection if no ping

2. **Server-side heartbeat**
   - Send periodic heartbeat to clients
   - Include current timestamp
   - Verify client is responsive

#### 14. Add Message Queuing

1. **Queue messages for offline clients**
   - Store messages in Redis
   - Send on reconnection
   - Expire after timeout

2. **Implement message acknowledgment**
   - Client acknowledges receipt
   - Retry if not acknowledged
   - Discard after max retries

### WebSocket Event Types

#### Cart Events
| Event Type | Direction | Description | Data Included |
|------------|-----------|-------------|---------------|
| `cart.updated` | Server → Client | Full cart update | Complete cart data |
| `cart.item.added` | Server → Client | Item added | Item details, totals |
| `cart.item.removed` | Server → Client | Item removed | Item ID, totals |
| `cart.item.quantity_changed` | Server → Client | Quantity updated | Item ID, new quantity, totals |
| `cart.discount.applied` | Server → Client | Discount applied | Discount details, totals |
| `cart.completed` | Server → Client | Transaction done | Payment, receipt |
| `cart.request_state` | Client → Server | Request current state | - |

#### Session Events
| Event Type | Direction | Description | Data Included |
|------------|-----------|-------------|---------------|
| `session.opened` | Server → Client | Session started | Session details, operator |
| `session.closed` | Server → Client | Session ended | Final stats, cash reconciliation |
| `session.stats.updated` | Server → Client | Stats refresh | Transaction count, sales total |
| `session.transaction.completed` | Server → Client | New transaction | Transaction summary |
| `session.cash_drawer.opened` | Server → Client | Drawer opened | Reason, operator |

#### Terminal Events
| Event Type | Direction | Description | Data Included |
|------------|-----------|-------------|---------------|
| `terminal.status.changed` | Server → Client | Status change | New status |
| `terminal.session.changed` | Server → Client | Session update | Session details |
| `terminal.alert` | Server → Client | Alert/Warning | Alert message |

#### Payment Events
| Event Type | Direction | Description | Data Included |
|------------|-----------|-------------|---------------|
| `payment.initiated` | Server → Client | Payment started | Payment details |
| `payment.completed` | Server → Client | Payment done | Payment result, receipt |
| `payment.failed` | Server → Client | Payment failed | Error details |

### WebSocket Message Format

#### General Message Structure
```json
{
    "type": "cart.item.added",
    "timestamp": "2026-01-23T14:45:30.123456Z",
    "data": { /* event-specific data */ }
}
```

#### Cart Item Added Event
```json
{
    "type": "cart.item.added",
    "timestamp": "2026-01-23T14:45:30Z",
    "data": {
        "cart_id": "cart-uuid",
        "item": {
            "id": "item-uuid",
            "product_detail": {
                "id": "product-uuid",
                "name": "Product Name",
                "sku": "SKU-123"
            },
            "quantity": 2,
            "unit_price": "1500.00",
            "line_total": "3000.00"
        },
        "cart_totals": {
            "subtotal": "3000.00",
            "discount_total": "0.00",
            "grand_total": "3000.00",
            "item_count": 1
        }
    }
}
```

#### Session Opened Event
```json
{
    "type": "session.opened",
    "timestamp": "2026-01-23T09:00:00Z",
    "data": {
        "session_id": "session-uuid",
        "session_number": "S-20260123-0001",
        "terminal": {
            "id": "terminal-uuid",
            "terminal_code": "POS-T01",
            "terminal_name": "Main Counter"
        },
        "operator": {
            "id": "user-uuid",
            "username": "cashier01",
            "full_name": "John Doe"
        },
        "opening_cash": "10000.00",
        "opened_at": "2026-01-23T09:00:00Z"
    }
}
```

#### Payment Completed Event
```json
{
    "type": "payment.completed",
    "timestamp": "2026-01-23T14:45:30Z",
    "data": {
        "payment_id": "payment-uuid",
        "cart_id": "cart-uuid",
        "payment_method": "CARD",
        "amount": "125000.00",
        "status": "COMPLETED",
        "receipt": {
            "receipt_number": "REC-20260123-0123",
            "receipt_url": "/api/receipts/REC-20260123-0123/"
        }
    }
}
```

### Client-Side WebSocket Usage

#### JavaScript/TypeScript Example
```javascript
// Connect to cart WebSocket
const cartSocket = new WebSocket(
    `ws://localhost:8000/ws/pos/cart/${cartId}/`
);

// Connection opened
cartSocket.onopen = function(e) {
    console.log("Connected to cart updates");
    
    // Send subscription message
    cartSocket.send(JSON.stringify({
        type: "subscribe_updates",
        events: ["cart.item.added", "cart.item.removed", "cart.updated"]
    }));
};

// Message received
cartSocket.onmessage = function(e) {
    const message = JSON.parse(e.data);
    
    switch(message.type) {
        case "cart.item.added":
            handleItemAdded(message.data);
            break;
        case "cart.item.removed":
            handleItemRemoved(message.data);
            break;
        case "cart.updated":
            handleCartUpdated(message.data);
            break;
        case "cart.completed":
            handleCartCompleted(message.data);
            break;
    }
};

// Error handling
cartSocket.onerror = function(error) {
    console.error("WebSocket error:", error);
};

// Connection closed
cartSocket.onclose = function(e) {
    console.log("Disconnected from cart updates");
    // Implement reconnection logic
    setTimeout(() => reconnect(), 3000);
};

// Keep-alive ping
setInterval(() => {
    if (cartSocket.readyState === WebSocket.OPEN) {
        cartSocket.send(JSON.stringify({type: "ping"}));
    }
}, 30000);
```

### WebSocket Architecture

```
┌─────────────────────────────────────────────────────────┐
│          WebSocket Real-time Architecture               │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ┌──────────────┐         ┌──────────────┐             │
│  │   Client 1   │         │   Client 2   │             │
│  │  (Terminal)  │         │  (Manager)   │             │
│  └───────┬──────┘         └───────┬──────┘             │
│          │                        │                     │
│          └────────────┬───────────┘                     │
│                       │                                 │
│                       ▼                                 │
│            ┌─────────────────────┐                      │
│            │   Django Channels   │                      │
│            │   (ASGI Server)     │                      │
│            └──────────┬──────────┘                      │
│                       │                                 │
│          ┌────────────┼────────────┐                    │
│          │            │            │                    │
│          ▼            ▼            ▼                    │
│    CartConsumer  SessionConsumer  TerminalConsumer     │
│          │            │            │                    │
│          └────────────┼────────────┘                    │
│                       │                                 │
│                       ▼                                 │
│            ┌─────────────────────┐                      │
│            │   Channel Layer     │                      │
│            │   (Redis)           │                      │
│            │                     │                      │
│            │  Groups:            │                      │
│            │  - cart_{id}        │                      │
│            │  - session_{id}     │                      │
│            │  - terminal_{id}    │                      │
│            └──────────┬──────────┘                      │
│                       │                                 │
│                       ▼                                 │
│            ┌─────────────────────┐                      │
│            │   Django Views      │                      │
│            │   (HTTP Triggers)   │                      │
│            │                     │                      │
│            │  - CartViewSet      │                      │
│            │  - SessionViewSet   │                      │
│            │  - PaymentView      │                      │
│            └─────────────────────┘                      │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### Expected Outcome
```
apps/pos/
├── consumers.py                 # WebSocket consumers
├── routing.py                   # WebSocket URL routing
├── cart/
│   └── views.py                 # Updated with broadcasts
├── terminal/
│   └── views.py                 # Updated with broadcasts
└── payment/
    └── views.py                 # Updated with broadcasts

config/
└── asgi.py                      # ASGI configuration
```

### Verification Checklist
- [ ] Django Channels installed and configured
- [ ] Channel layers configured (Redis)
- [ ] ASGI application configured
- [ ] WebSocket routing created
- [ ] BasePOSConsumer created
- [ ] POSCartConsumer created
- [ ] POSSessionConsumer created
- [ ] POSTerminalConsumer created
- [ ] Cart event methods implemented
- [ ] Session event methods implemented
- [ ] Payment event methods implemented
- [ ] ViewSets updated with broadcast calls
- [ ] Authentication for WebSocket connections
- [ ] Error handling for WebSocket
- [ ] Keep-alive/heartbeat implemented
- [ ] Reconnection logic
- [ ] Testing with WebSocket clients

---

## Summary

### Tasks Completed in This Document
| Task # | Task Name | Key Deliverable |
|--------|-----------|-----------------|
| 85 | Create PaymentView | Payment processing with multiple methods |
| 86 | Add POS WebSocket events | Real-time updates via WebSocket |

### Key Components Created

#### Payment Processing
- PaymentInitiateView
- PaymentProcessView
- PaymentCompleteView
- PaymentSplitView
- PaymentRefundView
- PaymentHistoryView
- PaymentStatusView
- PaymentService layer

#### WebSocket Consumers
- BasePOSConsumer
- POSCartConsumer
- POSSessionConsumer
- POSTerminalConsumer

#### Event Types
- 6 Cart events
- 5 Session events
- 3 Terminal events
- 3 Payment events

### Files Created/Updated
```
apps/pos/
├── payment/
│   ├── views.py                 # Payment views (7 views)
│   ├── services.py              # Payment service layer
│   └── utils.py                 # Helper functions
├── consumers.py                 # WebSocket consumers (3 consumers)
├── routing.py                   # WebSocket routing
├── cart/
│   └── views.py                 # Updated with WebSocket broadcasts
├── terminal/
│   └── views.py                 # Updated with WebSocket broadcasts
config/
└── asgi.py                      # ASGI configuration
```

### Integration Flow

```
┌─────────────────────────────────────────────────────────┐
│        Complete POS Transaction Flow                    │
│         (HTTP + WebSocket)                              │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  1. Open Session (HTTP)                                 │
│     POST /api/pos/sessions/open_session/               │
│     → Broadcast: session.opened (WebSocket)            │
│              │                                           │
│              ▼                                           │
│  2. Create Cart (HTTP)                                  │
│     POST /api/pos/cart/                                 │
│              │                                           │
│              ▼                                           │
│  3. Add Items (HTTP)                                    │
│     POST /api/pos/cart/{id}/add/                        │
│     → Broadcast: cart.item.added (WebSocket)           │
│     (Repeat for each item)                              │
│              │                                           │
│              ▼                                           │
│  4. Apply Discount (HTTP, optional)                     │
│     POST /api/pos/cart/{id}/discount/                   │
│     → Broadcast: cart.discount.applied (WebSocket)     │
│              │                                           │
│              ▼                                           │
│  5. Initiate Payment (HTTP)                             │
│     POST /api/pos/payment/initiate/                     │
│     → Broadcast: payment.initiated (WebSocket)         │
│              │                                           │
│              ▼                                           │
│  6. Process Payment (HTTP)                              │
│     POST /api/pos/payment/process/                      │
│     → Payment gateway interaction                       │
│              │                                           │
│              ▼                                           │
│  7. Complete Transaction (HTTP)                         │
│     POST /api/pos/payment/complete/                     │
│     → Update inventory                                  │
│     → Generate receipt                                  │
│     → Broadcast: payment.completed (WebSocket)         │
│     → Broadcast: cart.completed (WebSocket)            │
│     → Broadcast: session.transaction.completed (WS)    │
│              │                                           │
│              ▼                                           │
│  8. Close Session (HTTP, end of day)                    │
│     POST /api/pos/sessions/{id}/close_session/         │
│     → Broadcast: session.closed (WebSocket)            │
│                                                         │
│  All connected clients receive real-time updates       │
│  throughout the entire flow via WebSocket.             │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### Group E Completion

All tasks in Group E (POS API & Frontend Integration) are now complete:
- ✅ **Serializers** (Tasks 75-80) - Data validation and transformation
- ✅ **ViewSets** (Tasks 81-84) - API endpoints and business logic
- ✅ **Payment** (Task 85) - Transaction processing
- ✅ **WebSocket** (Task 86) - Real-time updates

### Next Steps

1. **Proceed to Group F:** [../Group-F_Testing-Documentation/](../Group-F_Testing-Documentation/)
2. **Create URL configuration** - Wire all endpoints
3. **Test integration** - End-to-end transaction testing
4. **Frontend integration** - Connect React/Next.js frontend
5. **Performance testing** - Load testing and optimization

---

## Notes for AI Agents

### Payment Processing Best Practices

1. **Always use database transactions** for payment operations
2. **Implement idempotency** to prevent duplicate charges
3. **Never store sensitive card data** - use tokenization
4. **Log all payment operations** for audit trail
5. **Handle errors gracefully** with rollback
6. **Validate everything** before processing
7. **Use async for external API calls** (payment gateways)
8. **Implement retry logic** for transient failures

### WebSocket Best Practices

1. **Authenticate connections** before accepting
2. **Use groups** for efficient broadcasting
3. **Implement heartbeat** to detect disconnections
4. **Handle reconnections** gracefully
5. **Queue messages** for offline clients (optional)
6. **Optimize message size** - send only necessary data
7. **Use async operations** in consumers
8. **Error handling** for all operations
9. **Rate limiting** to prevent abuse
10. **Monitor connection count** and resource usage

### Testing Approach

#### Payment Testing
1. Test each payment method separately
2. Test split payments
3. Test failure scenarios
4. Test refunds
5. Test concurrent payments (locking)
6. Test idempotency

#### WebSocket Testing
1. Test connection and disconnection
2. Test message broadcasting
3. Test group membership
4. Test authentication
5. Test multiple clients
6. Test reconnection
7. Test message ordering
8. Load testing for many concurrent connections

### Security Checklist

- [ ] Payment endpoints require authentication
- [ ] WebSocket connections require authentication
- [ ] PCI compliance for card payments
- [ ] Never log sensitive payment data
- [ ] Use HTTPS/WSS for all connections
- [ ] Validate all input data
- [ ] Rate limiting on payment endpoints
- [ ] Audit logging for all operations

