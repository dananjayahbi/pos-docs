# Tasks 81-84: POS ViewSets and Product Search

> **Phase:** 05 - ERP Core Modules Part 2  
> **SubPhase:** 01 - POS Terminal Core  
> **Group:** E - POS API & Frontend Integration  
> **Document:** 02 of 03  
> **Tasks Covered:** 81, 82, 83, 84

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [01_Tasks-75-80_Serializers.md](01_Tasks-75-80_Serializers.md)
- **→ Next Document:** [03_Tasks-85-86_Payment-WebSocket.md](03_Tasks-85-86_Payment-WebSocket.md)

---

## Document Overview

This document covers the creation of Django REST Framework ViewSets and API views for the POS system. ViewSets provide CRUD operations and custom actions for terminals, sessions, and carts, while the search view enables efficient product lookup with filtering and barcode scanning support.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 81 | Create POSTerminalViewSet | Medium | 25 min |
| 82 | Create POSSessionViewSet | High | 30 min |
| 83 | Create POSCartViewSet | High | 35 min |
| 84 | Create ProductSearchView | Medium | 25 min |

---

## ViewSet Architecture

### POS API Structure

```
┌─────────────────────────────────────────────────────────┐
│              POS API Architecture                       │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ┌──────────────────────────────────────────┐          │
│  │         URL Router                       │          │
│  │  /api/pos/                               │          │
│  └────────┬─────────────────────────────────┘          │
│           │                                             │
│  ┌────────┴──────────┬──────────────┬──────────────┐   │
│  │                   │              │              │   │
│  ▼                   ▼              ▼              ▼   │
│ terminals/        sessions/      cart/        search/  │
│  │                   │              │              │   │
│  ▼                   ▼              ▼              ▼   │
│ POSTerminal       POSSession    POSCart     ProductSearch│
│ ViewSet           ViewSet        ViewSet        View   │
│  │                   │              │              │   │
│  │                   │              │              │   │
│  ▼                   ▼              ▼              ▼   │
│ - list            - list         - create      - search│
│ - retrieve        - retrieve     - retrieve    - filter│
│ - create          - create       - update      - barcode│
│ - update          @open_session  - destroy            │
│ - partial_update  @close_session @add                 │
│ - destroy         @current       @update_quantity     │
│                                  @remove               │
│                                  @apply_discount       │
│                                  @hold                 │
│                                  @recall               │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### ViewSet Design Principles

| Principle | Implementation |
|-----------|----------------|
| **DRY** | Reusable querysets and permissions |
| **Custom Actions** | @action decorator for business logic |
| **Permissions** | Permission classes for access control |
| **Filtering** | django-filter for queryset filtering |
| **Pagination** | PageNumberPagination for large lists |
| **Throttling** | Rate limiting for API protection |
| **Caching** | Cache frequently accessed data |

---

## Task 81: Create POSTerminalViewSet

### Overview
Create a ViewSet for managing POS terminals with CRUD operations and custom actions for terminal-specific operations.

### Dependencies
- POSTerminal model (Group A, Task 01)
- POSTerminalSerializer (Task 75)
- DRF ViewSet base classes

### Instructions

#### 1. Create Terminal Views File

1. **Open or create views file**
   - Location: `apps/pos/terminal/views.py`
   - Import required DRF components

2. **Add required imports**
   - Import viewsets from rest_framework
   - Import action, Response, status from rest_framework
   - Import permissions classes
   - Import POSTerminal model
   - Import POSTerminalSerializer
   - Import django-filter components
   - Import Q for complex queries

#### 2. Create Terminal Filter Class

1. **Define POSTerminalFilter class**
   - Inherit from django_filters.FilterSet
   - Enable filtering by common fields

2. **Define filterset fields**
   - `status` (ChoiceFilter)
   - `is_active` (BooleanFilter)
   - `location` (CharFilter with icontains lookup)
   - `terminal_code` (CharFilter with iexact lookup)
   - `has_open_session` (BooleanFilter, custom method)

3. **Implement filter_has_open_session method**
   - Custom filter method
   - Filter terminals with/without open sessions
   - Query POSSession with terminal and status=OPEN

4. **Set Meta configuration**
   - Set model to POSTerminal
   - Set fields list

#### 3. Create POSTerminalViewSet

1. **Define POSTerminalViewSet class**
   - Inherit from ModelViewSet
   - Full CRUD operations for terminals

2. **Set class attributes**
   - `queryset` - get all active terminals
   - `serializer_class` - POSTerminalSerializer
   - `permission_classes` - appropriate permissions
   - `filterset_class` - POSTerminalFilter
   - `search_fields` - terminal_code, terminal_name, location
   - `ordering_fields` - terminal_code, terminal_name, created_at
   - `ordering` - default ordering by terminal_code

3. **Define get_queryset method**
   - Override to add tenant filtering
   - Filter by current tenant
   - Optionally filter by user permissions
   - Use select_related for terminal relationships

#### 4. Add Permission Control

1. **Define get_permissions method**
   - Different permissions for different actions
   - List/retrieve: view_posterminal permission
   - Create/update/destroy: manage_posterminal permission
   - Custom actions: specific permissions

2. **Create permission classes**
   - `IsPOSAdmin` - for create/update/delete
   - `IsCashier` - for list/retrieve
   - Use DRF's built-in permission classes where appropriate

#### 5. Implement Custom Actions

1. **Create activate action**
   - @action(detail=True, methods=['post'])
   - Set terminal status to ACTIVE
   - Validate terminal can be activated
   - Return updated terminal

2. **Create deactivate action**
   - @action(detail=True, methods=['post'])
   - Set terminal status to INACTIVE
   - Check no open session exists
   - Return updated terminal

3. **Create maintenance_mode action**
   - @action(detail=True, methods=['post'])
   - Set terminal status to MAINTENANCE
   - Check no open session exists
   - Return updated terminal

4. **Create available_terminals action**
   - @action(detail=False, methods=['get'])
   - List only available terminals (ACTIVE, no open session)
   - Used for session opening selection
   - Return filtered list

#### 6. Implement Action Methods

1. **Implement activate method**
   - Get terminal instance
   - Check if already ACTIVE
   - Set status to ACTIVE
   - Save and log change
   - Return serialized terminal with 200 status

2. **Implement deactivate method**
   - Get terminal instance
   - Check for open session (prevent deactivation if exists)
   - Set status to INACTIVE
   - Save and log change
   - Return serialized terminal

3. **Implement maintenance_mode method**
   - Get terminal instance
   - Check for open session
   - Set status to MAINTENANCE
   - Add maintenance notes if provided
   - Save and log change
   - Return serialized terminal

4. **Implement available_terminals method**
   - Query active terminals
   - Exclude terminals with open sessions
   - Apply any additional filters
   - Serialize and return list

#### 7. Add Query Optimization

1. **Update get_queryset**
   - Use select_related for related fields
   - Use prefetch_related for reverse relations
   - Annotate with computed fields if needed

2. **Add caching for list view**
   - Cache terminal list for short duration
   - Invalidate cache on create/update/delete
   - Use Django cache framework

#### 8. Add Response Formatting

1. **Override list method (optional)**
   - Add pagination info
   - Add filter summary
   - Add metadata (total count, available count)

2. **Override retrieve method (optional)**
   - Add current session details
   - Add recent activity summary
   - Add terminal statistics

#### 9. Add Error Handling

1. **Add custom exception handling**
   - Handle terminal not found
   - Handle permission denied
   - Handle validation errors
   - Return appropriate error responses

2. **Add logging**
   - Log terminal status changes
   - Log terminal creation/updates
   - Log permission denials

### POSTerminalViewSet Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/pos/terminals/` | List all terminals (with filters) |
| POST | `/api/pos/terminals/` | Create new terminal |
| GET | `/api/pos/terminals/{id}/` | Get terminal details |
| PUT | `/api/pos/terminals/{id}/` | Update terminal |
| PATCH | `/api/pos/terminals/{id}/` | Partial update |
| DELETE | `/api/pos/terminals/{id}/` | Delete terminal |
| POST | `/api/pos/terminals/{id}/activate/` | Activate terminal |
| POST | `/api/pos/terminals/{id}/deactivate/` | Deactivate terminal |
| POST | `/api/pos/terminals/{id}/maintenance_mode/` | Set maintenance mode |
| GET | `/api/pos/terminals/available_terminals/` | Get available terminals |

### Request/Response Examples

#### List Terminals with Filters
```
GET /api/pos/terminals/?status=ACTIVE&has_open_session=false
```

Response:
```json
{
    "count": 5,
    "next": null,
    "previous": null,
    "results": [
        {
            "id": "uuid",
            "terminal_code": "POS-T01",
            "terminal_name": "Main Counter",
            "location": "Ground Floor",
            "status": "ACTIVE",
            "is_active": true,
            "has_open_session": false,
            "can_open_session": true,
            "current_session": null
        }
    ]
}
```

#### Activate Terminal
```
POST /api/pos/terminals/{id}/activate/
```

Response:
```json
{
    "id": "uuid",
    "terminal_code": "POS-T01",
    "status": "ACTIVE",
    "message": "Terminal activated successfully"
}
```

### Permissions Matrix

| Action | Required Permission | Role |
|--------|-------------------|------|
| list | view_posterminal | Cashier |
| retrieve | view_posterminal | Cashier |
| create | add_posterminal | POS Admin |
| update | change_posterminal | POS Admin |
| delete | delete_posterminal | POS Admin |
| activate/deactivate | change_posterminal | POS Admin |

### Expected Outcome
```
apps/pos/terminal/
├── models.py
├── serializers.py
├── views.py                     # POSTerminalViewSet created
└── filters.py (optional)
```

### Verification Checklist
- [ ] POSTerminalViewSet class created
- [ ] POSTerminalFilter class created
- [ ] Queryset with tenant filtering
- [ ] Permission classes configured
- [ ] Search and filter fields defined
- [ ] Custom actions implemented (activate, deactivate, maintenance)
- [ ] available_terminals action implemented
- [ ] Query optimization (select_related)
- [ ] Error handling added
- [ ] Logging implemented

---

## Task 82: Create POSSessionViewSet

### Overview
Create a ViewSet for managing POS sessions with custom actions for opening, closing, and retrieving current sessions.

### Dependencies
- POSSession model (Group A, Task 02)
- POSSessionSerializer (Task 76)
- POSTerminalViewSet (Task 81)

### Instructions

#### 1. Update Terminal Views File

1. **Open terminal views file**
   - Location: `apps/pos/terminal/views.py`
   - Add to existing file

2. **Add additional imports**
   - Import POSSession model
   - Import POSSessionSerializer
   - Import transaction from django.db
   - Import F, Q for queries
   - Import timezone utilities

#### 2. Create Session Filter Class

1. **Define POSSessionFilter class**
   - Enable filtering by session attributes

2. **Define filterset fields**
   - `status` (ChoiceFilter)
   - `terminal` (UUIDFilter)
   - `operator` (UUIDFilter)
   - `opened_at_after` (DateTimeFilter)
   - `opened_at_before` (DateTimeFilter)
   - `closed_at_after` (DateTimeFilter)
   - `closed_at_before` (DateTimeFilter)

3. **Set Meta configuration**
   - Set model to POSSession
   - Set fields list

#### 3. Create POSSessionViewSet

1. **Define POSSessionViewSet class**
   - Inherit from ModelViewSet
   - Handle session lifecycle

2. **Set class attributes**
   - `queryset` - all sessions ordered by opened_at descending
   - `serializer_class` - POSSessionSerializer
   - `permission_classes` - cashier or above
   - `filterset_class` - POSSessionFilter
   - `search_fields` - session_number, terminal__terminal_code
   - `ordering_fields` - opened_at, closed_at, session_number
   - `ordering` - default ordering by -opened_at

3. **Define get_queryset method**
   - Filter by tenant
   - Optionally filter by user (operator)
   - Use select_related for terminal and operator
   - Use prefetch_related for carts

#### 4. Implement Session Opening

1. **Create open_session action**
   - @action(detail=False, methods=['post'])
   - Create new session for terminal
   - Validate no existing open session
   - Set operator from request user
   - Return created session

2. **Implement open_session method**
   - Extract terminal and opening_cash from request
   - Validate terminal is ACTIVE and available
   - Check no existing open session for terminal
   - Use database transaction
   - Create POSSession instance
   - Generate session_number
   - Set status to OPEN
   - Save and return serialized session

3. **Add opening validation**
   - Validate terminal exists and is active
   - Validate opening_cash is provided and valid
   - Validate user has permission to open session
   - Validate user is assigned to terminal (if applicable)

#### 5. Implement Session Closing

1. **Create close_session action**
   - @action(detail=True, methods=['post'])
   - Close specified session
   - Validate session is OPEN
   - Require actual_cash count
   - Calculate cash difference
   - Return closed session with totals

2. **Implement close_session method**
   - Get session instance
   - Validate session belongs to current user (or admin override)
   - Validate session is OPEN
   - Extract actual_cash from request
   - Use database transaction
   - Calculate expected_cash from payments
   - Calculate cash_difference
   - Set closed_at timestamp
   - Set status to CLOSED
   - Save and return serialized session

3. **Add closing validation**
   - Validate session is OPEN
   - Validate no active carts exist
   - Validate actual_cash is provided
   - Warn if large cash discrepancy
   - Allow force close with admin permission

#### 6. Implement Current Session Retrieval

1. **Create current action**
   - @action(detail=False, methods=['get'])
   - Get current open session for user's terminal
   - Return session with statistics
   - Return 404 if no open session

2. **Implement current method**
   - Determine terminal from request (query param or user assignment)
   - Query for OPEN session with terminal
   - Filter by operator if not admin
   - Serialize with full statistics
   - Return session or 404

3. **Add terminal detection**
   - Check query parameter: ?terminal={id}
   - Check user's assigned terminal
   - Check recent session history
   - Return error if terminal cannot be determined

#### 7. Implement Additional Actions

1. **Create session_summary action**
   - @action(detail=True, methods=['get'])
   - Get detailed session statistics
   - Include transaction list
   - Include payment breakdown
   - Return enhanced summary

2. **Implement session_summary method**
   - Get session instance
   - Query all completed carts for session
   - Query all payments for session
   - Calculate detailed statistics
   - Group by payment method
   - Group by hour (hourly breakdown)
   - Return comprehensive summary

3. **Create my_sessions action**
   - @action(detail=False, methods=['get'])
   - List current user's sessions
   - Filter by date range
   - Return paginated list

#### 8. Add Session Statistics

1. **Enhance retrieve method**
   - Add real-time statistics
   - Calculate current session totals
   - Include transaction count
   - Include payment method breakdown

2. **Create statistics computation**
   - Use Django aggregation (Sum, Count, Avg)
   - Cache computed values when possible
   - Update cache on cart completion

#### 9. Add Concurrency Control

1. **Add session locking**
   - Use select_for_update on session operations
   - Prevent concurrent opens/closes
   - Handle race conditions

2. **Add optimistic locking**
   - Use version field or updated_at
   - Detect concurrent modifications
   - Return appropriate error

#### 10. Add Error Handling

1. **Handle session errors**
   - Terminal already has open session
   - Session not found
   - Session already closed
   - Invalid cash count
   - Permission denied

2. **Add specific error responses**
   - Return clear error messages
   - Include resolution steps
   - Log errors for debugging

### POSSessionViewSet Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/pos/sessions/` | List all sessions (filtered) |
| POST | `/api/pos/sessions/` | Deprecated (use open_session) |
| GET | `/api/pos/sessions/{id}/` | Get session details |
| POST | `/api/pos/sessions/open_session/` | Open new session |
| POST | `/api/pos/sessions/{id}/close_session/` | Close session |
| GET | `/api/pos/sessions/current/` | Get current open session |
| GET | `/api/pos/sessions/{id}/session_summary/` | Detailed statistics |
| GET | `/api/pos/sessions/my_sessions/` | User's session history |

### Request/Response Examples

#### Open Session
```
POST /api/pos/sessions/open_session/
Content-Type: application/json

{
    "terminal": "terminal-uuid",
    "opening_cash": "10000.00"
}
```

Response:
```json
{
    "id": "session-uuid",
    "session_number": "S-20260123-0001",
    "terminal_detail": {
        "id": "terminal-uuid",
        "terminal_code": "POS-T01",
        "terminal_name": "Main Counter"
    },
    "operator": {
        "id": "user-uuid",
        "username": "cashier01",
        "full_name": "John Doe"
    },
    "status": "OPEN",
    "opened_at": "2026-01-23T09:00:00Z",
    "opening_cash": "10000.00",
    "expected_cash": "10000.00",
    "transaction_count": 0,
    "total_sales_amount": "0.00"
}
```

#### Close Session
```
POST /api/pos/sessions/{id}/close_session/
Content-Type: application/json

{
    "actual_cash": "55250.75"
}
```

Response:
```json
{
    "id": "session-uuid",
    "session_number": "S-20260123-0001",
    "status": "CLOSED",
    "opened_at": "2026-01-23T09:00:00Z",
    "closed_at": "2026-01-23T17:00:00Z",
    "opening_cash": "10000.00",
    "expected_cash": "55300.00",
    "actual_cash": "55250.75",
    "cash_difference": "-49.25",
    "transaction_count": 45,
    "total_sales_amount": "125500.00",
    "total_cash_amount": "45300.00",
    "total_card_amount": "60200.00",
    "total_other_amount": "20000.00",
    "session_duration": "8:00"
}
```

#### Get Current Session
```
GET /api/pos/sessions/current/?terminal=terminal-uuid
```

Response: Same as session detail with real-time statistics

#### Get Session Summary
```
GET /api/pos/sessions/{id}/session_summary/
```

Response:
```json
{
    "session": { /* session details */ },
    "statistics": {
        "total_transactions": 45,
        "total_sales": "125500.00",
        "average_transaction": "2788.89",
        "payment_methods": {
            "CASH": {"count": 20, "amount": "45300.00"},
            "CARD": {"count": 18, "amount": "60200.00"},
            "MOBILE": {"count": 7, "amount": "20000.00"}
        },
        "hourly_breakdown": [
            {"hour": "09:00", "transactions": 5, "amount": "12000.00"},
            {"hour": "10:00", "transactions": 8, "amount": "18500.00"}
        ],
        "top_products": [ /* list of top selling products */ ]
    },
    "transactions": [ /* list of all transactions */ ]
}
```

### Session Workflow

```
┌─────────────────────────────────────────────────────────┐
│             Session Lifecycle                           │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  1. Terminal Available                                  │
│     (ACTIVE, no open session)                           │
│              │                                           │
│              ▼                                           │
│  2. POST /sessions/open_session/                        │
│     - terminal: uuid                                    │
│     - opening_cash: decimal                             │
│              │                                           │
│              ▼                                           │
│  3. Session Created (OPEN)                              │
│     - session_number generated                          │
│     - operator assigned                                 │
│              │                                           │
│              ▼                                           │
│  4. POS Operations                                      │
│     - Create carts                                      │
│     - Process payments                                  │
│     - Complete transactions                             │
│              │                                           │
│              ▼                                           │
│  5. POST /sessions/{id}/close_session/                  │
│     - actual_cash: decimal                              │
│              │                                           │
│              ▼                                           │
│  6. Session Closed (CLOSED)                             │
│     - closed_at timestamp                               │
│     - cash_difference calculated                        │
│     - statistics finalized                              │
│              │                                           │
│              ▼                                           │
│  7. Terminal Available Again                            │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### Validation Rules

| Operation | Validation |
|-----------|------------|
| **Open Session** | Terminal ACTIVE, no open session, opening_cash >= 0 |
| **Close Session** | Session OPEN, no active carts, actual_cash provided |
| **Current Session** | Terminal specified or user has assigned terminal |
| **Modify Session** | User is operator or has admin permission |

### Permissions Matrix

| Action | Required Permission | Notes |
|--------|-------------------|-------|
| open_session | start_pos_session | Cashier role |
| close_session | close_pos_session | Must be operator or admin |
| current | view_pos_session | Own session or admin |
| list | view_pos_session | Admin can see all |
| session_summary | view_pos_session | Detailed view |

### Expected Outcome
```
apps/pos/terminal/
├── models.py
├── serializers.py
├── views.py                     # POSSessionViewSet added
└── filters.py
```

### Verification Checklist
- [ ] POSSessionViewSet class created
- [ ] POSSessionFilter class created
- [ ] open_session action implemented
- [ ] close_session action implemented
- [ ] current action implemented
- [ ] session_summary action implemented
- [ ] my_sessions action implemented
- [ ] Session opening validation
- [ ] Session closing validation
- [ ] Concurrency control (locking)
- [ ] Statistics calculation
- [ ] Error handling for all scenarios
- [ ] Permission checks enforced

---

## Task 83: Create POSCartViewSet

### Overview
Create a comprehensive ViewSet for managing POS carts with custom actions for adding items, applying discounts, and cart operations.

### Dependencies
- POSCart model (Group B, Task 09)
- CartItem model (Group B, Task 10)
- POSCartSerializer (Task 77)
- CartItemSerializer (Task 78)

### Instructions

#### 1. Create Cart Views File

1. **Create cart app views file**
   - Location: `apps/pos/cart/views.py`
   - Import required DRF components

2. **Add required imports**
   - Import viewsets, action, Response, status from rest_framework
   - Import permissions classes
   - Import POSCart, CartItem models
   - Import Product, ProductVariant models
   - Import POSCartSerializer, CartItemSerializer
   - Import transaction from django.db
   - Import F, Q, Sum for queries
   - Import Decimal

#### 2. Create Cart Filter Class

1. **Define POSCartFilter class**
   - Enable filtering by cart attributes

2. **Define filterset fields**
   - `status` (ChoiceFilter)
   - `session` (UUIDFilter)
   - `customer` (UUIDFilter)
   - `created_at_after` (DateTimeFilter)
   - `created_at_before` (DateTimeFilter)
   - `reference_number` (CharFilter)

3. **Set Meta configuration**
   - Set model to POSCart
   - Set fields list

#### 3. Create POSCartViewSet

1. **Define POSCartViewSet class**
   - Inherit from ModelViewSet
   - Handle cart operations

2. **Set class attributes**
   - `queryset` - active carts with items
   - `serializer_class` - POSCartSerializer
   - `permission_classes` - requires active session
   - `filterset_class` - POSCartFilter
   - `search_fields` - reference_number
   - `ordering_fields` - created_at, updated_at
   - `ordering` - default -created_at

3. **Define get_queryset method**
   - Filter by current session
   - Use select_related for session, customer
   - Use prefetch_related for items and products
   - Optimize query for performance

#### 4. Override CRUD Methods

1. **Override create method**
   - Automatically set session from request context
   - Validate session is OPEN
   - Create cart with reference_number
   - Return created cart

2. **Override retrieve method**
   - Add real-time total calculations
   - Include item count
   - Return complete cart data

3. **Override update method**
   - Allow only customer assignment
   - Prevent status changes via update
   - Validate cart is ACTIVE

4. **Override destroy method**
   - Allow only ACTIVE carts to be deleted
   - Soft delete (change status to CANCELLED)
   - Log cart cancellation

#### 5. Implement Add Item Action

1. **Create add action**
   - @action(detail=True, methods=['post'])
   - Add product to cart
   - Validate product and quantity
   - Check stock availability
   - Return updated cart

2. **Implement add method**
   - Extract product, variant, quantity, unit_price from request
   - Validate cart is ACTIVE
   - Validate product exists and is sellable
   - Check if item already in cart:
     - If exists: increase quantity
     - If new: create new CartItem
   - Use database transaction
   - Recalculate cart totals
   - Return serialized cart with success message

3. **Add item validation**
   - Product must be active and sellable
   - Variant must belong to product (if provided)
   - Quantity must be > 0
   - Check stock availability
   - Unit price should match product price

#### 6. Implement Update Quantity Action

1. **Create update_quantity action**
   - @action(detail=True, methods=['patch'], url_path='items/(?P<item_id>[^/.]+)')
   - Update existing cart item quantity
   - Allow increase or decrease
   - Return updated cart

2. **Implement update_quantity method**
   - Get cart instance
   - Get cart item by item_id
   - Extract new quantity from request
   - Validate quantity > 0
   - Check stock availability for increase
   - Update item quantity
   - Recalculate totals
   - Return serialized cart

3. **Add quantity validation**
   - New quantity must be > 0
   - Cannot exceed stock quantity
   - Cannot reduce below 1 (use remove instead)

#### 7. Implement Remove Item Action

1. **Create remove action**
   - @action(detail=True, methods=['delete'], url_path='items/(?P<item_id>[^/.]+)')
   - Remove item from cart
   - Return updated cart

2. **Implement remove method**
   - Get cart instance
   - Get cart item by item_id
   - Validate item belongs to cart
   - Delete cart item
   - Recalculate cart totals
   - If cart empty, optionally mark as CANCELLED
   - Return serialized cart

#### 8. Implement Discount Actions

1. **Create apply_line_discount action**
   - @action(detail=True, methods=['post'], url_path='items/(?P<item_id>[^/.]+)/discount')
   - Apply discount to specific cart item
   - Support PERCENTAGE and FIXED discount types
   - Return updated cart

2. **Implement apply_line_discount method**
   - Get cart and cart item
   - Extract discount_type and discount_value from request
   - Validate discount parameters
   - Validate discount doesn't exceed item price
   - Apply discount to item
   - Recalculate cart totals
   - Return serialized cart

3. **Create apply_cart_discount action**
   - @action(detail=True, methods=['post'], url_path='discount')
   - Apply discount to entire cart
   - Support PERCENTAGE and FIXED discount types
   - Return updated cart

4. **Implement apply_cart_discount method**
   - Get cart instance
   - Extract discount_type and discount_value
   - Validate discount parameters
   - Validate discount doesn't exceed subtotal
   - Save discount to cart
   - Recalculate cart totals
   - Return serialized cart

5. **Create remove_discount action**
   - @action(detail=True, methods=['delete'], url_path='discount')
   - Remove cart-level discount
   - Return updated cart

#### 9. Implement Hold and Recall Actions

1. **Create hold action**
   - @action(detail=True, methods=['post'])
   - Park cart for later retrieval
   - Change status to ON_HOLD
   - Add hold timestamp
   - Return success message

2. **Implement hold method**
   - Get cart instance
   - Validate cart is ACTIVE and has items
   - Set status to ON_HOLD
   - Set held_at timestamp
   - Optionally add hold_reason
   - Save cart
   - Return success response

3. **Create recall action**
   - @action(detail=False, methods=['get'], url_path='recall')
   - List held carts for current session
   - Allow selecting cart to reactivate
   - Return list of held carts

4. **Implement recall method**
   - Query ON_HOLD carts for current session
   - Optional: filter by customer or reference
   - Return paginated list

5. **Create reactivate action**
   - @action(detail=True, methods=['post'])
   - Reactivate held cart
   - Change status from ON_HOLD to ACTIVE
   - Return reactivated cart

6. **Implement reactivate method**
   - Get cart instance
   - Validate cart is ON_HOLD
   - Validate no other ACTIVE cart in session (or allow multiple)
   - Set status to ACTIVE
   - Clear held_at timestamp
   - Return serialized cart

#### 10. Implement Customer Actions

1. **Create add_customer action**
   - @action(detail=True, methods=['post'], url_path='customer')
   - Assign customer to cart
   - Apply customer discounts if applicable
   - Return updated cart

2. **Implement add_customer method**
   - Get cart instance
   - Extract customer_id from request
   - Validate customer exists and is active
   - Assign customer to cart
   - Apply any customer-specific pricing
   - Apply loyalty discounts if applicable
   - Recalculate totals
   - Return serialized cart

3. **Create remove_customer action**
   - @action(detail=True, methods=['delete'], url_path='customer')
   - Remove customer from cart
   - Remove customer-specific discounts
   - Return updated cart

#### 11. Add Cart Statistics

1. **Create cart_summary action**
   - @action(detail=True, methods=['get'])
   - Get detailed cart summary
   - Include item-by-item breakdown
   - Include tax calculations
   - Return comprehensive summary

2. **Implement cart_summary method**
   - Get cart instance
   - Calculate detailed statistics
   - Group items by category
   - Calculate tax breakdown
   - Calculate discount breakdown
   - Return detailed summary

#### 12. Add Error Handling

1. **Handle cart errors**
   - Cart not found
   - Cart not ACTIVE
   - Item not in cart
   - Insufficient stock
   - Invalid discount
   - Session closed
   - Permission denied

2. **Add validation helpers**
   - validate_cart_is_active
   - validate_item_in_cart
   - validate_stock_availability
   - validate_discount_parameters

### POSCartViewSet Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/pos/cart/` | List carts (current session) |
| POST | `/api/pos/cart/` | Create new cart |
| GET | `/api/pos/cart/{id}/` | Get cart details |
| PATCH | `/api/pos/cart/{id}/` | Update cart (customer) |
| DELETE | `/api/pos/cart/{id}/` | Cancel cart |
| POST | `/api/pos/cart/{id}/add/` | Add item to cart |
| PATCH | `/api/pos/cart/{id}/items/{item_id}/` | Update item quantity |
| DELETE | `/api/pos/cart/{id}/items/{item_id}/` | Remove item |
| POST | `/api/pos/cart/{id}/items/{item_id}/discount/` | Apply line discount |
| POST | `/api/pos/cart/{id}/discount/` | Apply cart discount |
| DELETE | `/api/pos/cart/{id}/discount/` | Remove cart discount |
| POST | `/api/pos/cart/{id}/hold/` | Hold cart |
| GET | `/api/pos/cart/recall/` | List held carts |
| POST | `/api/pos/cart/{id}/reactivate/` | Reactivate held cart |
| POST | `/api/pos/cart/{id}/customer/` | Add customer |
| DELETE | `/api/pos/cart/{id}/customer/` | Remove customer |
| GET | `/api/pos/cart/{id}/cart_summary/` | Detailed summary |

### Request/Response Examples

#### Add Item to Cart
```
POST /api/pos/cart/{id}/add/
Content-Type: application/json

{
    "product": "product-uuid",
    "variant": null,
    "quantity": 2,
    "unit_price": "1500.00"
}
```

Response:
```json
{
    "id": "cart-uuid",
    "reference_number": "POS-2024-T01-000123",
    "items": [
        {
            "id": "item-uuid",
            "product_detail": {
                "id": "product-uuid",
                "name": "Product Name",
                "sku": "SKU-123"
            },
            "quantity": 2,
            "unit_price": "1500.00",
            "line_total": "3000.00"
        }
    ],
    "subtotal": "3000.00",
    "grand_total": "3000.00",
    "message": "Item added successfully"
}
```

#### Update Item Quantity
```
PATCH /api/pos/cart/{id}/items/{item_id}/
Content-Type: application/json

{
    "quantity": 5
}
```

#### Apply Cart Discount
```
POST /api/pos/cart/{id}/discount/
Content-Type: application/json

{
    "discount_type": "PERCENTAGE",
    "discount_value": "10.00"
}
```

Response:
```json
{
    "id": "cart-uuid",
    "subtotal": "3000.00",
    "cart_discount_type": "PERCENTAGE",
    "cart_discount_value": "10.00",
    "discount_total": "300.00",
    "grand_total": "2700.00",
    "message": "Discount applied successfully"
}
```

#### Hold Cart
```
POST /api/pos/cart/{id}/hold/
Content-Type: application/json

{
    "reason": "Customer needs to check something"
}
```

Response:
```json
{
    "message": "Cart held successfully",
    "cart": {
        "id": "cart-uuid",
        "reference_number": "POS-2024-T01-000123",
        "status": "ON_HOLD",
        "held_at": "2026-01-23T14:30:00Z"
    }
}
```

#### Recall Held Carts
```
GET /api/pos/cart/recall/?session=session-uuid
```

Response:
```json
{
    "count": 3,
    "results": [
        {
            "id": "cart-uuid",
            "reference_number": "POS-2024-T01-000120",
            "status": "ON_HOLD",
            "held_at": "2026-01-23T14:15:00Z",
            "item_count": 5,
            "grand_total": "12500.00",
            "customer": {"name": "John Doe"}
        }
    ]
}
```

### Cart Operations Workflow

```
┌─────────────────────────────────────────────────────────┐
│             Cart Lifecycle                              │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  1. POST /cart/ (Create)                                │
│     → Status: ACTIVE                                    │
│              │                                           │
│              ▼                                           │
│  2. POST /cart/{id}/add/ (Add Items)                    │
│     → Items added to cart                               │
│     → Totals recalculated                               │
│              │                                           │
│              ├──────────────┐                            │
│              ▼              ▼                            │
│     Optional Actions:   Optional: Hold                  │
│     - Update quantity   POST /cart/{id}/hold/           │
│     - Apply discount    → Status: ON_HOLD               │
│     - Add customer              │                        │
│              │                  ▼                        │
│              │          POST /cart/{id}/reactivate/     │
│              │          → Status: ACTIVE                │
│              ▼                                           │
│  3. POST /payment/ (Process Payment)                    │
│     → Status: COMPLETED                                 │
│     → Cart locked                                       │
│              │                                           │
│              ▼                                           │
│  4. Transaction Complete                                │
│                                                         │
│  Alternative: DELETE /cart/{id}/                        │
│  → Status: CANCELLED                                    │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### Validation Rules

| Operation | Validation |
|-----------|------------|
| **Add Item** | Cart ACTIVE, product sellable, stock available |
| **Update Quantity** | Cart ACTIVE, quantity > 0, stock available |
| **Remove Item** | Cart ACTIVE, item exists in cart |
| **Apply Discount** | Cart ACTIVE, discount valid, not exceeding total |
| **Hold Cart** | Cart ACTIVE, has items |
| **Reactivate** | Cart ON_HOLD, session OPEN |

### Expected Outcome
```
apps/pos/cart/
├── models.py
├── serializers.py
├── views.py                     # POSCartViewSet created
└── filters.py
```

### Verification Checklist
- [ ] POSCartViewSet class created
- [ ] POSCartFilter class created
- [ ] CRUD methods overridden appropriately
- [ ] add action implemented
- [ ] update_quantity action implemented
- [ ] remove action implemented
- [ ] apply_line_discount action implemented
- [ ] apply_cart_discount action implemented
- [ ] remove_discount action implemented
- [ ] hold action implemented
- [ ] recall action implemented
- [ ] reactivate action implemented
- [ ] add_customer action implemented
- [ ] remove_customer action implemented
- [ ] cart_summary action implemented
- [ ] All validations implemented
- [ ] Error handling comprehensive
- [ ] Query optimization (prefetch)

---

## Task 84: Create ProductSearchView

### Overview
Create a specialized API view for product search in POS with support for name/SKU/barcode search, filtering, and quick-add functionality.

### Dependencies
- Product model
- ProductVariant model
- ProductSearchSerializer (Task 79)

### Instructions

#### 1. Create Search Views File

1. **Create search app views file**
   - Location: `apps/pos/search/views.py`
   - Import required DRF components

2. **Add required imports**
   - Import APIView, ListAPIView from rest_framework.views
   - Import Response, status from rest_framework
   - Import permissions classes
   - Import Product, ProductVariant models
   - Import ProductSearchSerializer
   - Import Q for complex queries
   - Import django-filter components

#### 2. Create Product Search Filter

1. **Define ProductSearchFilter class**
   - Inherit from django_filters.FilterSet
   - Enable comprehensive filtering

2. **Define filterset fields**
   - `category` (UUIDFilter or CharFilter)
   - `min_price` (NumberFilter)
   - `max_price` (NumberFilter)
   - `in_stock` (BooleanFilter, custom method)
   - `is_sellable` (BooleanFilter)
   - `is_active` (BooleanFilter)
   - `has_variants` (BooleanFilter, custom method)

3. **Implement custom filter methods**
   - `filter_in_stock`: Filter products with stock > 0
   - `filter_has_variants`: Filter products with/without variants

4. **Set Meta configuration**
   - Set model to Product
   - Set fields list

#### 3. Create ProductSearchView

1. **Define ProductSearchView class**
   - Inherit from ListAPIView
   - Optimized for search performance

2. **Set class attributes**
   - `serializer_class` - ProductSearchSerializer
   - `permission_classes` - requires authenticated user
   - `filterset_class` - ProductSearchFilter
   - `search_fields` - name, sku, barcode, description
   - `ordering_fields` - name, price, created_at
   - `ordering` - default by name

3. **Define get_queryset method**
   - Base queryset: active, sellable products
   - Apply search filters
   - Apply stock filters
   - Optimize with select_related and prefetch_related

#### 4. Implement Search Logic

1. **Override get_queryset for search**
   - Get search query from query params: ?q=search_term
   - If q parameter exists, perform search
   - Search across: name, sku, barcode, description
   - Use Q objects for OR logic
   - Case-insensitive search (icontains)

2. **Add barcode exact match priority**
   - If query matches barcode exactly, return that product first
   - Then include other matches
   - Use annotate and Case/When for priority sorting

3. **Add fuzzy search support (optional)**
   - Use PostgreSQL trigram similarity
   - Use Django's full-text search
   - Rank results by relevance

#### 5. Implement Barcode Search

1. **Create barcode-specific endpoint**
   - Add barcode query parameter: ?barcode=8801234567890
   - Exact match only for barcode
   - Return single product or 404

2. **Implement barcode search logic**
   - Check if barcode parameter exists
   - Query for exact barcode match
   - If found, return as single-item list
   - If not found, return empty list or 404

3. **Add barcode validation**
   - Validate barcode format (if applicable)
   - Check barcode length
   - Support multiple barcode standards (EAN-13, UPC-A, etc.)

#### 6. Add Query Optimization

1. **Optimize queryset**
   - Use select_related for category, brand
   - Use prefetch_related for variants, images
   - Use only() to limit fields if needed
   - Use defer() for large fields not needed

2. **Add result caching**
   - Cache common search queries
   - Cache product data for short duration
   - Invalidate cache on product updates

3. **Add pagination**
   - Use PageNumberPagination
   - Set page_size to reasonable value (20-50)
   - Allow page_size customization

#### 7. Implement Category Filtering

1. **Add category parameter**
   - Filter by single category: ?category=uuid
   - Filter by multiple categories: ?category=uuid1,uuid2
   - Include subcategories optionally

2. **Implement category filter logic**
   - If category parameter exists, filter by category
   - If include_subcategories=true, include child categories
   - Use category tree traversal

#### 8. Implement Price Range Filtering

1. **Add price range parameters**
   - Minimum price: ?min_price=1000
   - Maximum price: ?max_price=50000
   - Filter products within range

2. **Implement price filter logic**
   - Filter by base product price
   - Or filter by variant price range
   - Handle products with multiple variant prices

#### 9. Implement Stock Filtering

1. **Add stock filter parameter**
   - In stock only: ?in_stock=true
   - Low stock: ?low_stock=true
   - Out of stock: ?out_of_stock=true

2. **Implement stock filter logic**
   - Query inventory for stock levels
   - Filter based on stock quantity
   - Handle products with variants (sum variant stock)

#### 10. Add Response Enhancement

1. **Override list method**
   - Add search metadata
   - Include total count
   - Include filter summary
   - Add suggestions for no results

2. **Implement search suggestions**
   - If no results, suggest alternatives
   - Check for typos (fuzzy matching)
   - Suggest popular products
   - Suggest related categories

3. **Add response structure**
   - Include search_query
   - Include applied_filters
   - Include result_count
   - Include suggestions (if no results)

#### 11. Add Performance Monitoring

1. **Add query counting**
   - Count database queries
   - Warn if too many queries (N+1 problem)
   - Log slow queries

2. **Add response time tracking**
   - Measure search execution time
   - Log slow searches
   - Optimize slow queries

### ProductSearchView Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/pos/search/` | General product search |
| GET | `/api/pos/search/?q=term` | Search by name/SKU |
| GET | `/api/pos/search/?barcode=123` | Search by barcode |
| GET | `/api/pos/search/?category=uuid` | Filter by category |
| GET | `/api/pos/search/?in_stock=true` | Only in-stock products |
| GET | `/api/pos/search/?min_price=1000&max_price=5000` | Price range |

### Query Parameters

| Parameter | Type | Description | Example |
|-----------|------|-------------|---------|
| **q** | string | Search term (name, SKU, description) | `?q=iphone` |
| **barcode** | string | Exact barcode match | `?barcode=8801234567890` |
| **category** | uuid | Filter by category | `?category=uuid` |
| **min_price** | decimal | Minimum price | `?min_price=10000` |
| **max_price** | decimal | Maximum price | `?max_price=200000` |
| **in_stock** | boolean | Only in-stock items | `?in_stock=true` |
| **is_sellable** | boolean | Only sellable items | `?is_sellable=true` |
| **has_variants** | boolean | Has variants filter | `?has_variants=true` |
| **page** | integer | Page number | `?page=2` |
| **page_size** | integer | Results per page | `?page_size=50` |

### Request/Response Examples

#### General Search
```
GET /api/pos/search/?q=iphone
```

Response:
```json
{
    "count": 5,
    "next": null,
    "previous": null,
    "search_metadata": {
        "query": "iphone",
        "applied_filters": [],
        "result_count": 5,
        "execution_time": "0.045s"
    },
    "results": [
        {
            "id": "product-uuid",
            "name": "Apple iPhone 15",
            "sku": "IP15-128-BLK",
            "barcode": "8801234567890",
            "price": "125000.00",
            "stock_quantity": 15,
            "is_in_stock": true,
            "can_sell": true,
            "requires_variant_selection": true,
            "image_url": "https://...",
            "variants": [...]
        }
    ]
}
```

#### Barcode Search
```
GET /api/pos/search/?barcode=8801234567890
```

Response:
```json
{
    "count": 1,
    "results": [
        {
            "id": "product-uuid",
            "name": "Apple iPhone 15",
            "sku": "IP15-128-BLK",
            "barcode": "8801234567890",
            "price": "125000.00",
            "is_in_stock": true,
            "can_sell": true
        }
    ]
}
```

#### Filtered Search
```
GET /api/pos/search/?q=phone&category=smartphones&in_stock=true&min_price=50000&max_price=150000
```

Response includes filtered results with metadata showing applied filters.

#### No Results with Suggestions
```
GET /api/pos/search/?q=iphne
```

Response:
```json
{
    "count": 0,
    "results": [],
    "search_metadata": {
        "query": "iphne",
        "did_you_mean": "iphone",
        "suggestions": [
            {
                "id": "product-uuid",
                "name": "Apple iPhone 15",
                "relevance": 0.85
            }
        ]
    }
}
```

### Search Algorithm

```
┌─────────────────────────────────────────────────────────┐
│           Product Search Algorithm                      │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  1. Check for barcode parameter                         │
│     → If exists, exact match search                     │
│     → Return immediately if found                       │
│              │                                           │
│              ▼                                           │
│  2. Check for general search (q parameter)              │
│     → Search name (icontains)                           │
│     → Search SKU (icontains)                            │
│     → Search description (icontains)                    │
│     → Combine with OR logic (Q objects)                 │
│              │                                           │
│              ▼                                           │
│  3. Apply filters                                       │
│     → Category filter                                   │
│     → Price range filter                                │
│     → Stock availability filter                         │
│     → Active/Sellable filter                            │
│              │                                           │
│              ▼                                           │
│  4. Optimize query                                      │
│     → select_related (category, brand)                  │
│     → prefetch_related (variants, images)               │
│              │                                           │
│              ▼                                           │
│  5. Sort results                                        │
│     → Exact matches first                               │
│     → Barcode matches prioritized                       │
│     → Then by relevance/name                            │
│              │                                           │
│              ▼                                           │
│  6. Paginate and return                                 │
│     → Apply pagination                                  │
│     → Serialize results                                 │
│     → Add metadata                                      │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### Performance Optimization

| Optimization | Implementation |
|--------------|----------------|
| **Database Indexes** | Index on name, sku, barcode, is_active |
| **Query Optimization** | select_related and prefetch_related |
| **Caching** | Cache search results for common queries |
| **Pagination** | Limit results per page |
| **Field Selection** | Only fetch required fields |
| **Full-Text Search** | PostgreSQL full-text search for large datasets |

### Expected Outcome
```
apps/pos/search/
├── __init__.py
├── serializers.py
├── views.py                     # ProductSearchView created
└── filters.py
```

### Verification Checklist
- [ ] ProductSearchView class created
- [ ] ProductSearchFilter class created
- [ ] General search implemented (q parameter)
- [ ] Barcode search implemented
- [ ] Category filtering implemented
- [ ] Price range filtering implemented
- [ ] Stock filtering implemented
- [ ] Query optimization (select_related, prefetch_related)
- [ ] Pagination configured
- [ ] Search metadata in response
- [ ] Barcode exact match prioritization
- [ ] No results suggestions (optional)
- [ ] Performance monitoring

---

## Summary

### Tasks Completed in This Document
| Task # | Task Name | Key Deliverable |
|--------|-----------|-----------------|
| 81 | Create POSTerminalViewSet | Terminal management with custom actions |
| 82 | Create POSSessionViewSet | Session lifecycle with open/close actions |
| 83 | Create POSCartViewSet | Cart operations with item management |
| 84 | Create ProductSearchView | Product search with filtering |

### ViewSets and Views Created
```
apps/pos/
├── terminal/
│   ├── views.py                 # POSTerminalViewSet, POSSessionViewSet
│   └── filters.py               # Terminal and Session filters
├── cart/
│   ├── views.py                 # POSCartViewSet
│   └── filters.py               # Cart filters
└── search/
    ├── views.py                 # ProductSearchView
    └── filters.py               # Product search filters
```

### API Endpoints Summary

#### Terminal Endpoints (8)
- List, create, retrieve, update, delete terminals
- Activate, deactivate, maintenance mode
- Get available terminals

#### Session Endpoints (8)
- List, retrieve sessions
- Open session, close session
- Get current session
- Session summary, my sessions

#### Cart Endpoints (13)
- List, create, retrieve, update, delete carts
- Add, update, remove items
- Apply/remove discounts (line and cart level)
- Hold, recall, reactivate carts
- Add/remove customer
- Cart summary

#### Search Endpoints (1 with multiple query patterns)
- General search, barcode search, filtered search

### Custom Actions Matrix

| ViewSet | Action | Method | URL Pattern |
|---------|--------|--------|-------------|
| **Terminal** | activate | POST | `/terminals/{id}/activate/` |
| | deactivate | POST | `/terminals/{id}/deactivate/` |
| | maintenance_mode | POST | `/terminals/{id}/maintenance_mode/` |
| | available_terminals | GET | `/terminals/available_terminals/` |
| **Session** | open_session | POST | `/sessions/open_session/` |
| | close_session | POST | `/sessions/{id}/close_session/` |
| | current | GET | `/sessions/current/` |
| | session_summary | GET | `/sessions/{id}/session_summary/` |
| | my_sessions | GET | `/sessions/my_sessions/` |
| **Cart** | add | POST | `/cart/{id}/add/` |
| | update_quantity | PATCH | `/cart/{id}/items/{item_id}/` |
| | remove | DELETE | `/cart/{id}/items/{item_id}/` |
| | apply_line_discount | POST | `/cart/{id}/items/{item_id}/discount/` |
| | apply_cart_discount | POST | `/cart/{id}/discount/` |
| | remove_discount | DELETE | `/cart/{id}/discount/` |
| | hold | POST | `/cart/{id}/hold/` |
| | recall | GET | `/cart/recall/` |
| | reactivate | POST | `/cart/{id}/reactivate/` |
| | add_customer | POST | `/cart/{id}/customer/` |
| | remove_customer | DELETE | `/cart/{id}/customer/` |
| | cart_summary | GET | `/cart/{id}/cart_summary/` |

### Next Steps

All ViewSets and search views are now complete. Proceed to:
1. [03_Tasks-85-86_Payment-WebSocket.md](03_Tasks-85-86_Payment-WebSocket.md) - Payment processing and WebSocket events
2. Create URL routing configuration
3. Test all endpoints
4. Add API documentation

---

## Notes for AI Agents

### DRF ViewSet Best Practices Applied

1. **Custom Actions**: Use @action decorator for business logic endpoints
2. **Permission Classes**: Different permissions for different actions
3. **Query Optimization**: select_related and prefetch_related in get_queryset
4. **Filtering**: django-filter for comprehensive filtering
5. **Pagination**: Standard DRF pagination for list views
6. **Error Handling**: Consistent error responses
7. **Validation**: Validate in serializers, enforce in views
8. **Transactions**: Use database transactions for multi-step operations

### Testing Approach

1. **Unit Tests**: Test each action method separately
2. **Integration Tests**: Test complete workflows (open session → add to cart → checkout)
3. **Permission Tests**: Verify permission enforcement
4. **Edge Cases**: Test error conditions and validations
5. **Performance Tests**: Verify query counts and response times

### Common Patterns Used

| Pattern | Usage |
|---------|-------|
| **@action decorator** | Custom endpoints beyond CRUD |
| **get_queryset override** | Tenant filtering and optimization |
| **Database transactions** | Multi-step operations (add item, recalculate) |
| **SerializerMethodField** | Computed fields in responses |
| **Custom permissions** | Fine-grained access control |
| **Filter backends** | Filtering, searching, ordering |

### URL Router Configuration Next

After completing ViewSets, configure URL routing:
- Use DefaultRouter for ViewSets
- Register all ViewSets
- Add custom action URLs
- Configure URL patterns
- Add API versioning if needed

