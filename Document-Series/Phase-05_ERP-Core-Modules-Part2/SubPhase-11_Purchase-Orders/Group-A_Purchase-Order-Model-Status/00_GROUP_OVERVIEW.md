# Group A: Purchase Order Model & Status

> **Phase:** 05 - ERP Core Modules Part 2  
> **SubPhase:** 11 - Purchase Orders  
> **Group:** A of F  
> **Tasks Covered:** 01-18  
> **Group Goal:** Create purchases Django app with PurchaseOrder model and status management

---

## Navigation

- **↑ Parent:** [SubPhase-11 Summary](../00_TASKS_SUMMARY.md)
- **→ Next Group:** [Group B: PO Line Items & Calculations](../Group-B_PO-Line-Items-Calculations/)

---

## Group Overview

### Key Outcomes

1. **Purchases Django App** - New Django app for purchase orders
2. **App Registration** - Register purchases in TENANT_APPS
3. **POStatus Choices** - DRAFT, SENT, ACKNOWLEDGED, PARTIAL_RECEIVED, RECEIVED, CANCELLED, CLOSED
4. **PurchaseOrder Model Core** - po_number, status, created_at, updated_at
5. **PO Vendor Fields** - vendor FK, vendor_reference
6. **PO Date Fields** - order_date, expected_delivery_date, acknowledged_at, received_at
7. **PO Shipping Fields** - ship_to_address, shipping_method, shipping_cost
8. **PO Financial Fields** - subtotal, discount_amount, tax_amount, total, currency
9. **PO Payment Fields** - payment_terms, payment_due_date
10. **PO User Fields** - created_by, approved_by, received_by ForeignKeys
11. **PO Notes Fields** - notes, internal_notes, vendor_notes
12. **PO Approval Fields** - requires_approval, approved_at, approval_notes
13. **PO Warehouse Field** - receiving_warehouse FK
14. **PO Number Generator** - Auto-generate PO-{YEAR}-{SEQUENCE}
15. **PO PDF Storage Field** - FileField for generated PDF
16. **PO Model Indexes** - Indexes for status, vendor, po_number, dates
17. **PO Model Constraints** - Status transition validation
18. **Initial PO Migrations** - Generate and apply migrations

### Technology Context

| Technology | Purpose |
|------------|---------|
| Django ORM | PurchaseOrder model definition |
| PostgreSQL | Indexes and constraints |
| FileField | PDF storage |
| Sequence Generator | PO number generation |

---

## Documents in This Group

| # | Document | Tasks | Description |
|---|----------|-------|-------------|
| 01 | `01_Tasks-01-06_App-Setup-Model-Core.md` | 01-06 | Django app, registration, status choices, core/vendor/date fields |
| 02 | `02_Tasks-07-12_Shipping-Financial-User-Notes.md` | 07-12 | Shipping, financial, payment, user, notes, approval fields |
| 03 | `03_Tasks-13-18_Warehouse-Number-PDF-Index-Migration.md` | 13-18 | Warehouse, number generator, PDF, indexes, constraints, migrations |

---

## Task Summary

| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 01 | Create purchases Django App | Low | 15 min |
| 02 | Register purchases App | Low | 10 min |
| 03 | Define POStatus Choices | Low | 15 min |
| 04 | Create PurchaseOrder Model Core | Medium | 25 min |
| 05 | Add PO Vendor Fields | Medium | 20 min |
| 06 | Add PO Date Fields | Medium | 20 min |
| 07 | Add PO Shipping Fields | Medium | 20 min |
| 08 | Add PO Financial Fields | Medium | 25 min |
| 09 | Add PO Payment Fields | Medium | 20 min |
| 10 | Add PO User Fields | Medium | 20 min |
| 11 | Add PO Notes Fields | Low | 15 min |
| 12 | Add PO Approval Fields | Medium | 20 min |
| 13 | Add PO Warehouse Field | Medium | 15 min |
| 14 | Create PO Number Generator | Medium | 25 min |
| 15 | Add PO PDF Storage Field | Low | 15 min |
| 16 | Create PO Model Indexes | Medium | 20 min |
| 17 | Create PO Model Constraints | Medium | 20 min |
| 18 | Run Initial PO Migrations | Low | 15 min |

---

## Execution Order

```
[Tasks 01-06: Django app setup, status, core fields]
         │
         ▼
[Tasks 07-12: Shipping, financial, user, notes, approval]
         │
         ▼
[Tasks 13-18: Warehouse, number gen, PDF, indexes, migrations]
```

---

## Expected Deliverables

```
apps/purchases/
├── __init__.py
├── apps.py                       # Tasks 01-02
├── models/
│   ├── __init__.py
│   └── purchase_order.py         # Tasks 04-17
├── constants.py                  # Task 03
├── services/
│   └── po_number_generator.py    # Task 14
└── migrations/
    └── 0001_initial.py           # Task 18
```

---

## Notes for AI Agents

### POStatus Choices
- **DRAFT**: Initial state, editable
- **SENT**: Sent to vendor
- **ACKNOWLEDGED**: Vendor confirmed receipt
- **PARTIAL_RECEIVED**: Some items received
- **RECEIVED**: All items received
- **CANCELLED**: Cancelled before receiving
- **CLOSED**: Final state, no more actions

### PO Status Flow
```
DRAFT → SENT → ACKNOWLEDGED → PARTIAL_RECEIVED/RECEIVED → CLOSED
                     ↓
              CANCELLED (before receiving)
```

### PO Number Format
```
PO-{YEAR}-{SEQUENCE}
Example: PO-2026-00001

Sequence resets annually.
Prefix configurable in POSettings.
```

### PurchaseOrder Key Fields
- po_number: CharField (unique, auto-generated)
- vendor: FK to Vendor
- vendor_reference: CharField (vendor's order number)
- status: Choice field
- order_date: Date
- expected_delivery_date: Date
- subtotal: Decimal
- tax_amount: Decimal
- shipping_cost: Decimal
- total: Decimal
- currency: CharField (default LKR)

### Payment Terms Options
| Term | Days |
|------|------|
| CIA | 0 (Cash in Advance) |
| COD | 0 (Cash on Delivery) |
| Net 15 | 15 |
| Net 30 | 30 |
| Net 45 | 45 |
| Net 60 | 60 |

### User Fields
- created_by: FK to User (required)
- approved_by: FK to User (nullable)
- received_by: FK to User (nullable)

### Database Indexes
- po_number (unique)
- status
- vendor
- order_date
- expected_delivery_date
- (status, vendor) composite
- (status, order_date) composite

### Approval Fields
- requires_approval: Boolean
- approved_at: DateTime
- approval_notes: TextField
