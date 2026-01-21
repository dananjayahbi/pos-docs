# Group E: POS API & Frontend Integration

> **Phase:** 05 - ERP Core Modules Part 2  
> **SubPhase:** 01 - POS Terminal Core  
> **Group:** E of F  
> **Tasks Covered:** 75-86  
> **Group Goal:** Create DRF serializers, viewsets, and frontend integration

---

## Navigation

- **↑ Parent:** [SubPhase-01 Summary](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [Group D: Payment Processing](../Group-D_Payment-Processing/)
- **→ Next Group:** [Group F: Testing & Documentation](../Group-F_Testing-Documentation/)

---

## Group Overview

### Key Outcomes

1. **POSTerminalSerializer** - Terminal config with current session
2. **POSSessionSerializer** - Session with totals and transaction count
3. **POSCartSerializer** - Cart with nested items and totals
4. **CartItemSerializer** - Item with product details
5. **ProductSearchSerializer** - Search results with price, stock
6. **POSPaymentSerializer** - Payment request/response
7. **POSTerminalViewSet** - Terminal management API
8. **POSSessionViewSet** - Session with open/close actions
9. **POSCartViewSet** - Cart with add/update/remove/discount actions
10. **ProductSearchView** - Combined search endpoint
11. **PaymentView** - Payment processing endpoint
12. **WebSocket Events** - Real-time cart updates

### Technology Context

| Technology | Purpose |
|------------|---------|
| Django REST Framework | Serializers, ViewSets, routers |
| django-filter | Filter backends for queries |
| Custom Actions | ViewSet actions for operations |
| Django Channels | WebSocket for real-time updates |

---

## Documents in This Group

| # | Document | Tasks | Description |
|---|----------|-------|-------------|
| 01 | `01_Tasks-75-80_Serializers.md` | 75-80 | Terminal, Session, Cart, CartItem, Search, Payment serializers |
| 02 | `02_Tasks-81-84_ViewSets-Search.md` | 81-84 | Terminal, Session, Cart ViewSets, ProductSearchView |
| 03 | `03_Tasks-85-86_Payment-WebSocket.md` | 85-86 | PaymentView, WebSocket events |

---

## Task Summary

| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 75 | Create POSTerminalSerializer | Medium | 25 min |
| 76 | Create POSSessionSerializer | Medium | 25 min |
| 77 | Create POSCartSerializer | High | 30 min |
| 78 | Create CartItemSerializer | Medium | 25 min |
| 79 | Create ProductSearchSerializer | Medium | 25 min |
| 80 | Create POSPaymentSerializer | Medium | 20 min |
| 81 | Create POSTerminalViewSet | Medium | 25 min |
| 82 | Create POSSessionViewSet | High | 30 min |
| 83 | Create POSCartViewSet | High | 35 min |
| 84 | Create ProductSearchView | Medium | 25 min |
| 85 | Create PaymentView | High | 30 min |
| 86 | Add POS WebSocket events | High | 35 min |

---

## Execution Order

```
[Tasks 75-80: All serializers]
         │
         ▼
[Tasks 81-82: Terminal and Session ViewSets]
         │
         ▼
[Tasks 83-84: Cart ViewSet and Search View]
         │
         ▼
[Tasks 85-86: Payment View and WebSocket]
```

---

## Expected Deliverables

```
apps/pos/
├── terminal/
│   ├── serializers.py            # Tasks 75-76
│   └── views.py                  # Tasks 81-82
├── cart/
│   ├── serializers.py            # Tasks 77-78
│   └── views.py                  # Task 83
├── search/
│   ├── serializers.py            # Task 79
│   └── views.py                  # Task 84
├── payment/
│   ├── serializers.py            # Task 80
│   └── views.py                  # Task 85
├── urls.py                       # All routes
└── consumers.py                  # Task 86 (WebSocket)
```

---

## Notes for AI Agents

### API Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/pos/terminals/ | List terminals |
| GET | /api/pos/terminals/{id}/ | Terminal details |
| POST | /api/pos/sessions/ | Open new session |
| POST | /api/pos/sessions/{id}/close/ | Close session |
| GET | /api/pos/sessions/current/ | Current session |
| POST | /api/pos/cart/ | Create new cart |
| POST | /api/pos/cart/{id}/add/ | Add item |
| PATCH | /api/pos/cart/{id}/items/{item_id}/ | Update quantity |
| DELETE | /api/pos/cart/{id}/items/{item_id}/ | Remove item |
| POST | /api/pos/cart/{id}/discount/ | Apply cart discount |
| POST | /api/pos/cart/{id}/hold/ | Hold cart |
| GET | /api/pos/search/ | Product search |
| POST | /api/pos/payment/ | Process payment |
| POST | /api/pos/payment/complete/ | Complete transaction |

### POSCartSerializer Structure
```json
{
    "id": "uuid",
    "reference_number": "POS-2024-T01-000123",
    "status": "ACTIVE",
    "customer": null,
    "items": [
        {
            "id": "uuid",
            "product": {"id": "...", "name": "...", "sku": "..."},
            "variant": null,
            "quantity": 2,
            "unit_price": "1500.00",
            "original_price": "1500.00",
            "line_total": "3000.00",
            "discount": null
        }
    ],
    "subtotal": "3000.00",
    "discount_total": "0.00",
    "tax_total": "0.00",
    "grand_total": "3000.00"
}
```

### POSSessionViewSet Actions
- `open_session`: Create new session with opening cash
- `close_session`: End session with actual cash count
- `current`: Get current open session for terminal

### POSCartViewSet Actions
- `add`: Add product to cart
- `update_quantity`: Update item quantity
- `remove`: Remove item from cart
- `apply_line_discount`: Discount specific item
- `apply_cart_discount`: Discount entire cart
- `hold`: Park cart for later
- `recall`: Get held cart

### WebSocket Events
| Event | Direction | Description |
|-------|-----------|-------------|
| cart.updated | Server → Client | Cart contents changed |
| cart.item.added | Server → Client | New item added |
| cart.item.removed | Server → Client | Item removed |
| cart.completed | Server → Client | Transaction complete |
| session.opened | Server → Client | New session started |
| session.closed | Server → Client | Session ended |

### Permissions
- POSTerminal: Requires POS admin permission
- POSSession: Requires cashier role
- POSCart: Requires active session
- Payment: Requires active session
