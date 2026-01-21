# Group C: Order Creation & Sources

> **Phase:** 05 - ERP Core Modules Part 2  
> **SubPhase:** 05 - Order Management  
> **Group:** C of F  
> **Tasks Covered:** 35-50  
> **Group Goal:** Implement multi-source order creation and stock management

---

## Navigation

- **↑ Parent:** [SubPhase-05 Summary](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [Group B: Order Line Items & Pricing](../Group-B_Order-Line-Items-Pricing/)
- **→ Next Group:** [Group D: Fulfillment Workflow](../Group-D_Fulfillment-Workflow/)

---

## Group Overview

### Key Outcomes

1. **OrderService Class** - Main service for order operations
2. **Manual Order Creation** - Create order manually with line items
3. **Quote Conversion** - Convert accepted quote to order
4. **POS Order Creation** - Create order from POS transaction
5. **Webstore Order Creation** - Handle webstore orders with validation
6. **Bulk Order Import** - Import orders from CSV/Excel
7. **Stock Reservation Logic** - Reserve inventory on confirmation
8. **Stock Reservation Task** - Async Celery task with timeout
9. **Stock Insufficient Handling** - Handle partial availability
10. **Order Duplication** - Duplicate order as new draft
11. **Order Editing** - Edit order before fulfillment
12. **Edit Lock Logic** - Prevent editing after processing
13. **OrderHistory Model** - Track all changes and events
14. **History Logging** - Log actions with user, timestamp
15. **Order Settings Model** - Tenant-level configuration
16. **Service Migrations** - Apply migrations

### Technology Context

| Technology | Purpose |
|------------|---------|
| Service Layer | Business logic encapsulation |
| Celery | Async stock reservation |
| Django Signals | History logging |
| CSV/pandas | Bulk import processing |

---

## Documents in This Group

| # | Document | Tasks | Description |
|---|----------|-------|-------------|
| 01 | `01_Tasks-35-40_Service-Creation-Sources.md` | 35-40 | OrderService, manual/quote/POS/webstore creation, bulk import |
| 02 | `02_Tasks-41-46_Stock-Reservation-Editing.md` | 41-46 | Stock reservation, Celery task, insufficient handling, duplication, editing, lock |
| 03 | `03_Tasks-47-50_History-Settings-Migration.md` | 47-50 | OrderHistory model, logging, OrderSettings, migrations |

---

## Task Summary

| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 35 | Create OrderService Class | High | 30 min |
| 36 | Implement Manual Order Creation | Medium | 25 min |
| 37 | Implement Order from Quote Conversion | Medium | 30 min |
| 38 | Implement POS Order Creation | Medium | 25 min |
| 39 | Implement Webstore Order Creation | Medium | 30 min |
| 40 | Implement Bulk Order Import | High | 35 min |
| 41 | Create Stock Reservation Logic | High | 30 min |
| 42 | Create Stock Reservation Celery Task | Medium | 25 min |
| 43 | Implement Stock Insufficient Handling | Medium | 25 min |
| 44 | Implement Order Duplication | Medium | 25 min |
| 45 | Implement Order Editing | Medium | 25 min |
| 46 | Add Edit Lock Logic | Medium | 20 min |
| 47 | Create OrderHistory Model | Medium | 25 min |
| 48 | Implement History Logging | Medium | 25 min |
| 49 | Create Order Settings Model | Medium | 25 min |
| 50 | Run Order Service Migrations | Low | 15 min |

---

## Execution Order

```
[Tasks 35-40: OrderService with all creation sources]
         │
         ▼
[Tasks 41-46: Stock reservation, editing, locking]
         │
         ▼
[Tasks 47-50: History, settings, migrations]
```

---

## Expected Deliverables

```
apps/orders/
├── models/
│   ├── __init__.py
│   ├── order.py
│   ├── order_line_item.py
│   ├── order_history.py          # Task 47
│   └── order_settings.py         # Task 49
├── services/
│   ├── __init__.py
│   ├── order_service.py          # Tasks 35-46
│   ├── stock_service.py          # Task 41
│   └── import_service.py         # Task 40
├── tasks/
│   ├── __init__.py
│   └── stock_tasks.py            # Task 42
└── migrations/
    └── 0003_history_settings.py  # Task 50
```

---

## Notes for AI Agents

### OrderService Methods
- create_order(data, items, user, source)
- create_from_quote(quote_id, user)
- create_from_pos(session_id, cart_id, user)
- create_from_webstore(cart_data, customer_id)
- import_orders(file, user)
- duplicate_order(order_id, user)
- edit_order(order_id, data, user)
- confirm_order(order_id, user)

### Order Source Mapping
| Source | Creation Method | Auto Confirm |
|--------|-----------------|--------------|
| MANUAL | create_order() | No |
| QUOTE | create_from_quote() | Optional |
| POS | create_from_pos() | Yes |
| WEBSTORE | create_from_webstore() | Optional |
| IMPORT | import_orders() | No |

### Stock Reservation Flow
```
Order Confirmation
       │
       ▼
Check Stock Availability
       │
       ├─ All Available → Reserve All → CONFIRMED
       │
       └─ Partial/None → Handle Insufficient
                              │
                              ├─ Allow Backorder → Reserve Available
                              ├─ Wait for Stock → PENDING
                              └─ Cancel Order → CANCELLED
```

### Celery Stock Reservation
```python
@shared_task(bind=True, max_retries=3)
def reserve_stock(self, order_id):
    try:
        # Lock rows, reserve stock
    except Exception as exc:
        self.retry(exc=exc, countdown=30)
```

### Edit Lock Rules
| Status | Editable |
|--------|----------|
| PENDING | ✅ Full edit |
| CONFIRMED | ⚠️ Limited (qty, items) |
| PROCESSING | ❌ Locked |
| SHIPPED+ | ❌ Locked |

### OrderHistory Event Types
- CREATED, UPDATED, CONFIRMED
- PROCESSING_STARTED, SHIPPED, DELIVERED
- COMPLETED, CANCELLED, RETURNED
- STOCK_RESERVED, STOCK_RELEASED
- PAYMENT_RECEIVED, REFUND_ISSUED

### OrderSettings Fields
- tenant: OneToOne to Tenant
- order_number_prefix: CharField
- auto_confirm_pos: BooleanField
- auto_confirm_webstore: BooleanField
- low_stock_threshold: IntegerField
- require_stock_reservation: BooleanField
