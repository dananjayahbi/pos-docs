# Group A: Order Model & Status System

> **Phase:** 05 - ERP Core Modules Part 2  
> **SubPhase:** 05 - Order Management  
> **Group:** A of F  
> **Tasks Covered:** 01-18  
> **Group Goal:** Create Order model with comprehensive status lifecycle

---

## Navigation

- **↑ Parent:** [SubPhase-05 Summary](../00_TASKS_SUMMARY.md)
- **→ Next Group:** [Group B: Order Line Items & Pricing](../Group-B_Order-Line-Items-Pricing/)

---

## Group Overview

### Key Outcomes

1. **Orders Django App** - New Django app for orders module
2. **App Registration** - Register orders in TENANT_APPS
3. **OrderStatus Choices** - PENDING, CONFIRMED, PROCESSING, SHIPPED, DELIVERED, COMPLETED, CANCELLED, RETURNED
4. **OrderSource Choices** - POS, WEBSTORE, QUOTE, MANUAL, IMPORT
5. **Order Model Core Fields** - order_number, status, source, timestamps
6. **Order Customer Fields** - Customer FK, guest contact details
7. **Order Address Fields** - Shipping/billing address as JSON or FK
8. **Order Date Fields** - order_date, confirmed_at, shipped_at, delivered_at, completed_at
9. **Order Financial Fields** - subtotal, discount, tax, shipping, total
10. **Order Payment Status** - UNPAID, PARTIAL, PAID, REFUNDED status
11. **Order Reference Fields** - Links to quote, POS session, external ref
12. **Order Metadata Fields** - notes, internal_notes, tags, priority
13. **Order User References** - created_by, assigned_to, confirmed_by FKs
14. **Order Currency Field** - LKR default with exchange rate support
15. **Order Number Generator** - Auto-generation with yearly sequence
16. **Model Indexes** - Database indexes for performance
17. **Model Constraints** - Validation and transition rules
18. **Initial Migrations** - Generate and apply migrations

### Technology Context

| Technology | Purpose |
|------------|---------|
| Django ORM | Order model definition |
| PostgreSQL | Indexes and constraints |
| JSONField | Address and metadata storage |
| Sequence Generator | Order number generation |

---

## Documents in This Group

| # | Document | Tasks | Description |
|---|----------|-------|-------------|
| 01 | `01_Tasks-01-06_App-Setup-Model-Core.md` | 01-06 | Django app, registration, status/source choices, core fields, customer |
| 02 | `02_Tasks-07-12_Address-Dates-Financial-Metadata.md` | 07-12 | Address, dates, financial, payment status, references, metadata |
| 03 | `03_Tasks-13-18_Users-Currency-Number-Index-Migration.md` | 13-18 | User refs, currency, number gen, indexes, constraints, migrations |

---

## Task Summary

| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 01 | Create orders Django App | Low | 15 min |
| 02 | Register orders App | Low | 10 min |
| 03 | Define OrderStatus Choices | Low | 15 min |
| 04 | Define OrderSource Choices | Low | 10 min |
| 05 | Create Order Model Core Fields | Medium | 25 min |
| 06 | Add Order Customer Fields | Medium | 20 min |
| 07 | Add Order Address Fields | Medium | 25 min |
| 08 | Add Order Date Fields | Medium | 20 min |
| 09 | Add Order Financial Fields | Medium | 25 min |
| 10 | Add Order Payment Status Fields | Medium | 20 min |
| 11 | Add Order Reference Fields | Medium | 20 min |
| 12 | Add Order Metadata Fields | Medium | 20 min |
| 13 | Add Order User Reference Fields | Medium | 20 min |
| 14 | Add Order Currency Field | Low | 15 min |
| 15 | Create Order Number Generator | Medium | 25 min |
| 16 | Create Order Model Indexes | Medium | 20 min |
| 17 | Create Order Model Constraints | Medium | 25 min |
| 18 | Run Initial Order Migrations | Low | 15 min |

---

## Execution Order

```
[Tasks 01-04: Django app setup and choice enums]
         │
         ▼
[Tasks 05-08: Core model fields, customer, address, dates]
         │
         ▼
[Tasks 09-14: Financial, payment, references, metadata, currency]
         │
         ▼
[Tasks 15-18: Number generator, indexes, constraints, migrations]
```

---

## Expected Deliverables

```
apps/orders/
├── __init__.py
├── apps.py                       # Tasks 01-02
├── models/
│   ├── __init__.py
│   └── order.py                  # Tasks 05-17
├── constants.py                  # Tasks 03-04
├── services/
│   └── number_generator.py       # Task 15
└── migrations/
    └── 0001_initial.py           # Task 18
```

---

## Notes for AI Agents

### OrderStatus Choices
- **PENDING**: Order created, awaiting confirmation
- **CONFIRMED**: Order confirmed, stock reserved
- **PROCESSING**: Order being picked/packed
- **SHIPPED**: Order dispatched
- **DELIVERED**: Order delivered to customer
- **COMPLETED**: Order finalized, no further action
- **CANCELLED**: Order cancelled before fulfillment
- **RETURNED**: Order returned after delivery

### OrderSource Choices
- **POS**: Created from POS terminal
- **WEBSTORE**: Created from webstore
- **QUOTE**: Converted from quote
- **MANUAL**: Manually created by staff
- **IMPORT**: Imported from external system

### Order Number Format
```
ORD-{YEAR}-{SEQUENCE}
Example: ORD-2026-00001
```

### Status Transition Matrix
| From State | Allowed Transitions |
|------------|---------------------|
| PENDING | CONFIRMED, CANCELLED |
| CONFIRMED | PROCESSING, CANCELLED |
| PROCESSING | SHIPPED, CANCELLED |
| SHIPPED | DELIVERED |
| DELIVERED | COMPLETED, RETURNED |
| COMPLETED | RETURNED |
| CANCELLED | (terminal) |
| RETURNED | (terminal) |

### Payment Status
- **UNPAID**: No payment received
- **PARTIAL**: Partial payment received
- **PAID**: Full payment received
- **REFUNDED**: Payment refunded

### Database Indexes
- order_number (unique)
- status
- source
- customer_id
- created_at
- order_date
