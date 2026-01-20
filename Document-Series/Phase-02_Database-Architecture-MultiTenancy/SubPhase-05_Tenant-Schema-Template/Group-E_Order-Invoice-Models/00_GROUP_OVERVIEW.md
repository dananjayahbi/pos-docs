# Group E: Order & Invoice Models

> **Phase:** 02 - Database Architecture & Multi-Tenancy  
> **SubPhase:** 05 - Tenant Schema Template  
> **Group:** E of G  
> **Tasks Covered:** 57-72  
> **Group Goal:** Create order management and invoicing models

---

## Navigation

- **↑ Parent:** [../00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [../Group-D_Customer-Supplier-Models/](../Group-D_Customer-Supplier-Models/)
- **→ Next Group:** [../Group-F_Employee-Accounting-Models/](../Group-F_Employee-Accounting-Models/)

---

## Group Overview

This group creates the Order, OrderItem, Invoice, and Payment models that power the sales and billing workflow. Orders track customer purchases, invoices handle billing, and payments record all transactions.

### Key Outcomes
- Order model created
- Order number field (unique, auto-generated)
- Order customer FK
- Order status field (pending, confirmed, shipped, etc.)
- Order date field
- Order total fields (subtotal, tax, discount, total)
- OrderItem model created
- OrderItem product FK
- OrderItem quantity field
- OrderItem price fields
- Invoice model created
- Invoice number field
- Invoice order FK
- Invoice status field (draft, sent, paid, overdue)
- Payment model created
- Payment method field

### Technology Context
- **Order Workflow:** Pending → Confirmed → Shipped → Delivered
- **Invoice Status:** Draft → Sent → Paid
- **Payment Methods:** Cash, card, bank transfer
- **Currency:** LKR (Sri Lankan Rupee)

---

## Documents in This Group

| # | Document | Tasks | Description |
|---|----------|-------|-------------|
| 01 | 01_Tasks-57-62_Order-Model.md | 57-62 | Order model, number, customer FK, status, date, totals |
| 02 | 02_Tasks-63-66_Order-Item.md | 63-66 | OrderItem model, product FK, quantity, price fields |
| 03 | 03_Tasks-67-72_Invoice-Payment.md | 67-72 | Invoice model, Payment model, statuses, methods |

---

## Task Summary

| Task # | Task Name | Dependencies | Complexity |
|--------|-----------|--------------|------------|
| 57 | Create Order Model | Task 50 | Medium |
| 58 | Add Order Number Field | Task 57 | Simple |
| 59 | Add Order Customer FK | Task 57 | Simple |
| 60 | Add Order Status Field | Task 57 | Simple |
| 61 | Add Order Date Field | Task 57 | Simple |
| 62 | Add Order Total Fields | Task 57 | Medium |
| 63 | Create OrderItem Model | Task 62 | Medium |
| 64 | Add OrderItem Product FK | Task 63 | Simple |
| 65 | Add OrderItem Quantity Field | Task 63 | Simple |
| 66 | Add OrderItem Price Fields | Task 63 | Simple |
| 67 | Create Invoice Model | Task 66 | Medium |
| 68 | Add Invoice Number Field | Task 67 | Simple |
| 69 | Add Invoice Order FK | Task 67 | Simple |
| 70 | Add Invoice Status Field | Task 67 | Simple |
| 71 | Create Payment Model | Task 70 | Medium |
| 72 | Add Payment Method Field | Task 71 | Simple |

---

## Execution Order

```
01_Tasks-57-62_Order-Model.md
        │
        ▼
02_Tasks-63-66_Order-Item.md
        │
        ▼
03_Tasks-67-72_Invoice-Payment.md
```

---

## Expected Deliverables

After completing this group:

```
backend/
└── apps/
    ├── orders/
    │   ├── models/
    │   │   ├── __init__.py
    │   │   ├── order.py         # Order model
    │   │   └── order_item.py    # OrderItem model
    │   └── constants.py         # Order statuses
    └── invoices/
        ├── models/
        │   ├── __init__.py
        │   ├── invoice.py       # Invoice model
        │   └── payment.py       # Payment model
        └── constants.py         # Invoice statuses, payment methods
```

---

## Order Statuses

| Status | Description |
|--------|-------------|
| PENDING | Awaiting confirmation |
| CONFIRMED | Order confirmed |
| PROCESSING | Being prepared |
| SHIPPED | Dispatched |
| DELIVERED | Successfully delivered |
| CANCELLED | Order cancelled |
| RETURNED | Items returned |

---

## Payment Methods

| Method | Description |
|--------|-------------|
| CASH | Cash payment |
| CARD | Credit/debit card |
| BANK_TRANSFER | Bank transfer |
| CHEQUE | Cheque payment |
| MOBILE | Mobile payment (FriMi, etc.) |

---

## Notes for AI Agents

1. **Dependencies:** Requires Group D complete (Customer exists)
2. **Order Number:** Use TenantSettings prefix + sequence
3. **Total Calculation:** Signals or model methods
4. **Invoice Link:** Optional FK to Order
5. **Partial Payments:** Support multiple payments per invoice
6. **Git Commit:** Commit after completing this group

