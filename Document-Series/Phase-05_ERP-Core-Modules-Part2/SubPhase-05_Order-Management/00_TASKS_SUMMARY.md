# SubPhase 05: Order Management - Tasks Summary

> **Phase:** 05 - ERP Core Modules Part 2  
> **SubPhase Index:** 05 of 12  
> **SubPhase Goal:** Process and fulfill sales orders with complete lifecycle management from creation to delivery  
> **Total Tasks:** 92 | **Status:** Planning  
> **Estimated Duration:** 14-18 hours

---

## Navigation

- **↑ Parent:** [00_SUBPHASES_SUMMARY.md](../00_SUBPHASES_SUMMARY.md)
- **← Previous SubPhase:** [SubPhase-04_Quote-Management](../SubPhase-04_Quote-Management/)
- **→ Next SubPhase:** [SubPhase-06_Invoice-System](../SubPhase-06_Invoice-System/)

---

## SubPhase Overview

This sub-phase implements a complete sales order management system supporting multiple order sources (POS, webstore, manual), status tracking, fulfillment workflow, partial fulfillment, returns, and order history. This is the central hub connecting quotes, inventory, invoices, and payments.

### Key Outcomes
- Order model with comprehensive status lifecycle
- Multi-source order creation (POS, webstore, quote conversion, manual)
- Order line items with product linking and customization
- Fulfillment workflow with picking, packing, shipping
- Partial fulfillment support
- Order cancellation with stock restoration
- Return and refund processing
- Order timeline with full audit trail
- Order dashboard with advanced filtering

### Technology Context
- **Backend:** Django 5.x with DRF for API
- **Async Tasks:** Celery for stock reservation, notifications
- **Frontend:** Next.js 14+ with TypeScript
- **Order Number Format:** `ORD-{YEAR}-{SEQUENCE}` (e.g., ORD-2026-00001)

### Dependencies
- Phase-04: Products, Inventory, Stock Management
- Phase-05 SubPhase-04: Quote Management (for quote conversion)
- Phase-05 SubPhase-08: Customer Module (for customer linking)

---

## Task Execution Order

```
TASK GROUP A: Order Model & Status System (Tasks 01-18)
        │
        ▼
TASK GROUP B: Order Line Items & Pricing (Tasks 19-34)
        │
        ▼
TASK GROUP C: Order Creation & Sources (Tasks 35-50)
        │
        ▼
TASK GROUP D: Fulfillment Workflow (Tasks 51-66)
        │
        ▼
TASK GROUP E: Returns & Cancellations (Tasks 67-80)
        │
        ▼
TASK GROUP F: Order API, Testing & Documentation (Tasks 81-92)
```

---

## Task Index

### Group A: Order Model & Status System (Tasks 01-18)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 01 | **Create orders Django App** | Create new Django app for orders module with proper structure | None | 🔴 Not Created |
| 02 | **Register orders App** | Add orders app to TENANT_APPS in Django settings | Task 01 | 🔴 Not Created |
| 03 | **Define OrderStatus Choices** | Create enum for statuses: PENDING, CONFIRMED, PROCESSING, SHIPPED, DELIVERED, COMPLETED, CANCELLED, RETURNED | Task 01 | 🔴 Not Created |
| 04 | **Define OrderSource Choices** | Create enum for sources: POS, WEBSTORE, QUOTE, MANUAL, IMPORT | Task 01 | 🔴 Not Created |
| 05 | **Create Order Model Core Fields** | Define Order model with order_number, status, source, created_at, updated_at | Task 04 | 🔴 Not Created |
| 06 | **Add Order Customer Fields** | Add customer FK (nullable), guest_name, guest_email, guest_phone for guest orders | Task 05 | 🔴 Not Created |
| 07 | **Add Order Address Fields** | Add shipping_address, billing_address as JSONField or FK to Address model | Task 05 | 🔴 Not Created |
| 08 | **Add Order Date Fields** | Add order_date, confirmed_at, shipped_at, delivered_at, completed_at | Task 05 | 🔴 Not Created |
| 09 | **Add Order Financial Fields** | Add subtotal, discount_amount, tax_amount, shipping_amount, total DecimalFields | Task 05 | 🔴 Not Created |
| 10 | **Add Order Payment Status Fields** | Add payment_status (UNPAID, PARTIAL, PAID, REFUNDED), amount_paid, balance_due | Task 05 | 🔴 Not Created |
| 11 | **Add Order Reference Fields** | Add quote FK (if from quote), pos_session FK (if from POS), external_reference | Task 05 | 🔴 Not Created |
| 12 | **Add Order Metadata Fields** | Add notes, internal_notes, tags JSONField, priority field | Task 05 | 🔴 Not Created |
| 13 | **Add Order User Reference Fields** | Add created_by, assigned_to, confirmed_by ForeignKeys to User | Task 05 | 🔴 Not Created |
| 14 | **Add Order Currency Field** | Add currency field defaulting to LKR with exchange_rate if applicable | Task 05 | 🔴 Not Created |
| 15 | **Create Order Number Generator** | Implement auto-generation of order numbers with yearly sequence | Task 05 | 🔴 Not Created |
| 16 | **Create Order Model Indexes** | Add database indexes for status, source, customer, order_number, created_at | Task 05 | 🔴 Not Created |
| 17 | **Create Order Model Constraints** | Add validation for status transitions, prevent duplicate order numbers | Task 05 | 🔴 Not Created |
| 18 | **Run Initial Order Migrations** | Generate and apply migrations for Order model | Task 17 | 🔴 Not Created |

---

### Group B: Order Line Items & Pricing (Tasks 19-34)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 19 | **Create OrderLineItem Model** | Define line item model with FK to Order, position/order field | Task 18 | 🔴 Not Created |
| 20 | **Add Line Item Product Reference** | Add product FK, variant FK for linked products | Task 19 | 🔴 Not Created |
| 21 | **Add Line Item Description Fields** | Add item_name, item_sku, item_description for snapshot/custom items | Task 19 | 🔴 Not Created |
| 22 | **Add Line Item Quantity Fields** | Add quantity_ordered, quantity_fulfilled, quantity_returned fields | Task 19 | 🔴 Not Created |
| 23 | **Add Line Item Pricing Fields** | Add unit_price, original_price, cost_price fields | Task 19 | 🔴 Not Created |
| 24 | **Add Line Item Discount Fields** | Add discount_type, discount_value, discount_amount for line-level discounts | Task 19 | 🔴 Not Created |
| 25 | **Add Line Item Tax Fields** | Add tax_rate, tax_amount, is_taxable fields | Task 19 | 🔴 Not Created |
| 26 | **Add Line Item Total Field** | Add computed line_total field | Task 19 | 🔴 Not Created |
| 27 | **Add Line Item Status Field** | Add status: PENDING, ALLOCATED, PICKED, PACKED, SHIPPED, DELIVERED | Task 19 | 🔴 Not Created |
| 28 | **Add Line Item Warehouse Reference** | Add warehouse FK, location FK for fulfillment source | Task 19 | 🔴 Not Created |
| 29 | **Run OrderLineItem Migrations** | Generate and apply migrations for OrderLineItem model | Task 28 | 🔴 Not Created |
| 30 | **Create Order Calculation Service** | Create service class to calculate subtotal, tax, shipping, total | Task 29 | 🔴 Not Created |
| 31 | **Implement Line Total Calculator** | Method to calculate individual line totals with discounts | Task 30 | 🔴 Not Created |
| 32 | **Implement Order Tax Calculator** | Method to calculate tax based on line items and tax config | Task 30 | 🔴 Not Created |
| 33 | **Implement Shipping Calculator** | Method to calculate shipping based on weight, destination, method | Task 30 | 🔴 Not Created |
| 34 | **Create Order Recalculation Signal** | Auto-recalculate order totals when line items change | Task 33 | 🔴 Not Created |

---

### Group C: Order Creation & Sources (Tasks 35-50)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 35 | **Create OrderService Class** | Main service class for order business operations | Task 34 | 🔴 Not Created |
| 36 | **Implement Manual Order Creation** | Method to create order manually with line items | Task 35 | 🔴 Not Created |
| 37 | **Implement Order from Quote Conversion** | Convert accepted quote to order, copy line items | Task 35 | 🔴 Not Created |
| 38 | **Implement POS Order Creation** | Create order from POS transaction (link to POSSession) | Task 35 | 🔴 Not Created |
| 39 | **Implement Webstore Order Creation** | Handle orders from webstore with address validation | Task 35 | 🔴 Not Created |
| 40 | **Implement Bulk Order Import** | Import orders from CSV/Excel for migration scenarios | Task 35 | 🔴 Not Created |
| 41 | **Create Stock Reservation Logic** | Reserve inventory on order confirmation | Task 35 | 🔴 Not Created |
| 42 | **Create Stock Reservation Celery Task** | Async task to reserve stock with timeout | Task 41 | 🔴 Not Created |
| 43 | **Implement Stock Insufficient Handling** | Handle partial stock availability scenarios | Task 42 | 🔴 Not Created |
| 44 | **Implement Order Duplication** | Duplicate existing order as new draft order | Task 35 | 🔴 Not Created |
| 45 | **Implement Order Editing** | Edit order before fulfillment (status: PENDING, CONFIRMED) | Task 35 | 🔴 Not Created |
| 46 | **Add Edit Lock Logic** | Prevent editing once order is PROCESSING or beyond | Task 45 | 🔴 Not Created |
| 47 | **Create OrderHistory Model** | Model to track all order changes and events | Task 35 | 🔴 Not Created |
| 48 | **Implement History Logging** | Log all order actions with user, timestamp, details | Task 47 | 🔴 Not Created |
| 49 | **Create Order Settings Model** | Tenant-level settings for numbering, auto-confirm, notifications | Task 35 | 🔴 Not Created |
| 50 | **Run Order Service Migrations** | Generate migrations for OrderHistory and OrderSettings | Task 49 | 🔴 Not Created |

---

### Group D: Fulfillment Workflow (Tasks 51-66)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 51 | **Create Fulfillment Model** | Model for fulfillment/shipment records linked to order | Task 50 | 🔴 Not Created |
| 52 | **Add Fulfillment Tracking Fields** | Add tracking_number, carrier, shipped_at, delivered_at | Task 51 | 🔴 Not Created |
| 53 | **Add Fulfillment Package Fields** | Add package_weight, package_dimensions, number_of_packages | Task 51 | 🔴 Not Created |
| 54 | **Create FulfillmentLineItem Model** | Link fulfillment to specific line items and quantities | Task 51 | 🔴 Not Created |
| 55 | **Run Fulfillment Migrations** | Generate and apply migrations for Fulfillment models | Task 54 | 🔴 Not Created |
| 56 | **Create FulfillmentService Class** | Service for managing fulfillment workflow | Task 55 | 🔴 Not Created |
| 57 | **Implement Order Confirmation** | Change status from PENDING to CONFIRMED, reserve stock | Task 56 | 🔴 Not Created |
| 58 | **Implement Start Processing** | Change status to PROCESSING, create picking list | Task 56 | 🔴 Not Created |
| 59 | **Implement Pick Order** | Mark items as picked from warehouse locations | Task 58 | 🔴 Not Created |
| 60 | **Implement Pack Order** | Mark items as packed, create fulfillment record | Task 59 | 🔴 Not Created |
| 61 | **Implement Ship Order** | Record shipping details, tracking number, update status | Task 60 | 🔴 Not Created |
| 62 | **Implement Partial Fulfillment** | Ship subset of items, split order if needed | Task 61 | 🔴 Not Created |
| 63 | **Implement Delivery Confirmation** | Mark order as DELIVERED on delivery confirmation | Task 61 | 🔴 Not Created |
| 64 | **Implement Order Completion** | Finalize order, deduct stock permanently | Task 63 | 🔴 Not Created |
| 65 | **Create Delivery Notification** | Send email/SMS on shipping and delivery | Task 64 | 🔴 Not Created |
| 66 | **Create Fulfillment Celery Tasks** | Async tasks for notifications, stock updates | Task 65 | 🔴 Not Created |

---

### Group E: Returns & Cancellations (Tasks 67-80)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 67 | **Create OrderReturn Model** | Model for return/RMA requests linked to order | Task 66 | 🔴 Not Created |
| 68 | **Add Return Reason Fields** | Add reason (DEFECTIVE, WRONG_ITEM, CHANGED_MIND, etc.), notes | Task 67 | 🔴 Not Created |
| 69 | **Add Return Status Fields** | Add status: REQUESTED, APPROVED, RECEIVED, REFUNDED, REJECTED | Task 67 | 🔴 Not Created |
| 70 | **Create ReturnLineItem Model** | Link return to specific line items and quantities | Task 67 | 🔴 Not Created |
| 71 | **Add Return Financial Fields** | Add refund_amount, restocking_fee, refund_method | Task 67 | 🔴 Not Created |
| 72 | **Run Return Migrations** | Generate and apply migrations for Return models | Task 71 | 🔴 Not Created |
| 73 | **Create ReturnService Class** | Service for handling return workflow | Task 72 | 🔴 Not Created |
| 74 | **Implement Return Request** | Customer or staff initiates return request | Task 73 | 🔴 Not Created |
| 75 | **Implement Return Approval** | Staff approves/rejects return request | Task 74 | 🔴 Not Created |
| 76 | **Implement Return Receipt** | Mark items as received, inspect condition | Task 75 | 🔴 Not Created |
| 77 | **Implement Stock Restoration** | Return items to inventory on receipt | Task 76 | 🔴 Not Created |
| 78 | **Implement Order Cancellation** | Cancel order, release reserved stock | Task 73 | 🔴 Not Created |
| 79 | **Add Cancellation Validation** | Validate order can be cancelled (not shipped/delivered) | Task 78 | 🔴 Not Created |
| 80 | **Implement Partial Cancellation** | Cancel specific line items from order | Task 79 | 🔴 Not Created |

---

### Group F: Order API, Testing & Documentation (Tasks 81-92)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 81 | **Create OrderSerializer** | DRF serializer for Order model with nested line items | Task 80 | 🔴 Not Created |
| 82 | **Create OrderLineItemSerializer** | DRF serializer for line items with validation | Task 81 | 🔴 Not Created |
| 83 | **Create OrderListSerializer** | Lightweight serializer for list view (summary only) | Task 81 | 🔴 Not Created |
| 84 | **Create OrderViewSet** | ViewSet with CRUD, list, retrieve, custom actions | Task 83 | 🔴 Not Created |
| 85 | **Implement Order Filtering** | Filter by status, source, customer, date range, payment_status | Task 84 | 🔴 Not Created |
| 86 | **Implement Order Search** | Search by order_number, customer name, product name | Task 84 | 🔴 Not Created |
| 87 | **Add Order Status Actions** | Custom actions: confirm, process, ship, deliver, cancel | Task 84 | 🔴 Not Created |
| 88 | **Create FulfillmentViewSet** | ViewSet for fulfillment operations | Task 84 | 🔴 Not Created |
| 89 | **Create ReturnViewSet** | ViewSet for return operations | Task 84 | 🔴 Not Created |
| 90 | **Register Order API URLs** | Add all order, fulfillment, return endpoints to URL configuration | Task 89 | 🔴 Not Created |
| 91 | **Create Order Module Tests** | Unit and integration tests for models, services, API | Task 90 | 🔴 Not Created |
| 92 | **Create Order Module Documentation** | API documentation, workflow guide, configuration | Task 91 | 🔴 Not Created |

---

## Expected File Structure

```
backend/apps/orders/
├── __init__.py
├── admin.py                    # Admin for Order, LineItem, Fulfillment, Return
├── apps.py                     # App configuration
├── models/
│   ├── __init__.py
│   ├── order.py               # Order model with status system
│   ├── order_line_item.py     # OrderLineItem model
│   ├── fulfillment.py         # Fulfillment and FulfillmentLineItem models
│   ├── order_return.py        # OrderReturn and ReturnLineItem models
│   ├── order_history.py       # OrderHistory for audit trail
│   └── order_settings.py      # OrderSettings for tenant config
├── services/
│   ├── __init__.py
│   ├── order_service.py       # Main order business logic
│   ├── calculation_service.py # Order total calculations
│   ├── fulfillment_service.py # Fulfillment workflow service
│   ├── return_service.py      # Return workflow service
│   └── stock_service.py       # Stock reservation/release
├── serializers/
│   ├── __init__.py
│   ├── order_serializer.py    # Full order serializer
│   ├── line_item_serializer.py
│   ├── fulfillment_serializer.py
│   └── return_serializer.py
├── views/
│   ├── __init__.py
│   ├── order_viewset.py       # Order CRUD ViewSet
│   ├── fulfillment_viewset.py # Fulfillment ViewSet
│   └── return_viewset.py      # Return ViewSet
├── tasks/
│   ├── __init__.py
│   ├── stock_tasks.py         # Async stock operations
│   └── notification_tasks.py  # Email/SMS notifications
├── filters.py                  # Order filtering
├── urls.py                     # URL routing
├── signals.py                  # Order signals
├── permissions.py              # Order-specific permissions
├── tests/
│   ├── __init__.py
│   ├── test_models.py
│   ├── test_order_service.py
│   ├── test_fulfillment.py
│   ├── test_returns.py
│   └── test_api.py
└── migrations/
```

---

## Order Status Flow Diagram

```
                    ┌───────────────┐
                    │    PENDING    │ ← New order, awaiting confirmation
                    └───────┬───────┘
                            │ confirm()
                            ▼
                    ┌───────────────┐
                    │   CONFIRMED   │ ← Stock reserved, ready for processing
                    └───────┬───────┘
                            │ start_processing()
                            ▼
                    ┌───────────────┐
                    │  PROCESSING   │ ← Being picked and packed
                    └───────┬───────┘
                            │ ship()
                            ▼
                    ┌───────────────┐
                    │    SHIPPED    │ ← In transit to customer
                    └───────┬───────┘
                            │ deliver()
                            ▼
                    ┌───────────────┐
                    │   DELIVERED   │ ← Received by customer
                    └───────┬───────┘
                            │ complete()
                            ▼
                    ┌───────────────┐
                    │   COMPLETED   │ ← Finalized, stock deducted
                    └───────────────┘

    ┌─────────────────────────────────────────────────┐
    │ CANCELLATION (from PENDING/CONFIRMED/PROCESSING)│
    │           └──→ CANCELLED (stock released)       │
    └─────────────────────────────────────────────────┘

    ┌─────────────────────────────────────────────────┐
    │ RETURN (from DELIVERED/COMPLETED)               │
    │           └──→ RETURNED (stock restored)        │
    └─────────────────────────────────────────────────┘
```

---

## Payment Status Flow

```
    ┌───────────────┐
    │    UNPAID     │ ← No payments received
    └───────┬───────┘
            │ record_payment()
            ▼
    ┌───────────────┐
    │   PARTIAL     │ ← Some payment received
    └───────┬───────┘
            │ record_payment() (full amount)
            ▼
    ┌───────────────┐
    │     PAID      │ ← Fully paid
    └───────┬───────┘
            │ refund()
            ▼
    ┌───────────────┐
    │   REFUNDED    │ ← Refund issued
    └───────────────┘
```

---

## Order Number Format

```
ORD-{YEAR}-{SEQUENCE}

Examples:
- ORD-2026-00001  (First order of 2026)
- ORD-2026-01500  (1500th order of 2026)

Sequence resets annually.
Prefix configurable in OrderSettings.

For POS orders: POS-{TERMINAL_ID}-{SEQUENCE}
```

---

## Key Business Rules

1. **Stock Reservation:** Reserve inventory on CONFIRMED, release on CANCELLED
2. **Edit Lock:** Orders locked for editing after PROCESSING
3. **Fulfillment:** Only CONFIRMED orders can start processing
4. **Partial Fulfillment:** Track quantity_fulfilled per line item
5. **Payment Required:** Option to require payment before processing
6. **Return Window:** Configurable return window (e.g., 7 days from delivery)
7. **Cancellation Window:** Cannot cancel after SHIPPED
8. **Auto-Complete:** Option to auto-complete orders after X days from delivery

---

## Order Sources

| Source | Description | Auto-Confirm |
|--------|-------------|--------------|
| **POS** | Created from POS terminal, immediate payment | Yes |
| **WEBSTORE** | Online customer orders | Optional |
| **QUOTE** | Converted from accepted quote | Optional |
| **MANUAL** | Staff-created orders | No |
| **IMPORT** | Bulk imported orders | No |

---

## Sri Lanka Specific Considerations

- **Currency:** Default LKR, format as "Rs. 1,234.56"
- **Tax:** Standard VAT rate 12% (configurable)
- **Addresses:** Province, District, City format
- **Delivery:** Consider local courier services integration
- **SMS:** Order status notifications via SMS (popular in Sri Lanka)

---

## Progress Tracking

| Metric | Count |
|--------|-------|
| Total Tasks | 92 |
| Tasks Completed | 0 |
| Tasks In Progress | 0 |
| Completion Percentage | 0% |

**Last Updated:** 2026-01-17  
**Next Action:** Create Task 01 (orders Django App)

---

## Notes for AI Agents

- Stock reservation must use database transactions to prevent overselling
- Implement optimistic locking for concurrent order updates
- Order history should capture all state changes for audit
- Consider WebSocket for real-time order status updates
- Fulfillment can be from multiple warehouses for a single order
- Return flow should integrate with refund processing in Payment module
- POS orders typically skip PENDING status and start as CONFIRMED

---

*End of SubPhase 05 Tasks Summary*
