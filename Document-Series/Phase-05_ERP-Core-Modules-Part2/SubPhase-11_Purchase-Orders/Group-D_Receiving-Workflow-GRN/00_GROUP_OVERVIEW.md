# Group D: Receiving Workflow & GRN

> **Phase:** 05 - ERP Core Modules Part 2  
> **SubPhase:** 11 - Purchase Orders  
> **Group:** D of F  
> **Tasks Covered:** 51-68  
> **Group Goal:** Implement receiving workflow with GRN and stock updates

---

## Navigation

- **↑ Parent:** [SubPhase-11 Summary](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [Group C: PO Creation & Sending](../Group-C_PO-Creation-Sending/)
- **→ Next Group:** [Group E: PO PDF, Email & Notifications](../Group-E_PO-PDF-Email-Notifications/)

---

## Group Overview

### Key Outcomes

1. **GoodsReceipt Model** - Model for Goods Receipt Note (GRN)
2. **GRN Core Fields** - grn_number, purchase_order FK, received_by, received_at
3. **GRN Delivery Fields** - delivery_note_number, carrier, delivery_date
4. **GRN Inspection Fields** - inspection_status, inspection_notes
5. **GRN Number Generator** - Auto-generate GRN-{YEAR}-{SEQUENCE}
6. **GRNLineItem Model** - Line items with quantities
7. **GRN Line Fields** - po_line FK, quantity_received, quantity_rejected
8. **GRN Line Quality Fields** - condition, rejection_reason, notes
9. **GRN Migrations** - Apply migrations
10. **ReceivingService Class** - Receiving workflow service
11. **Full Receiving** - Receive all items in PO
12. **Partial Receiving** - Receive subset, create back-order
13. **Update PO Line Status** - Update quantity_received, status
14. **Update PO Status** - Update to PARTIAL_RECEIVED or RECEIVED
15. **Stock Update on Receive** - Add received items to inventory
16. **Back-Order Tracking** - Track items not yet received
17. **Quality Rejection** - Handle rejected items
18. **Receiving Celery Tasks** - Async stock updates

### Technology Context

| Technology | Purpose |
|------------|---------|
| Django ORM | GRN models |
| Service Layer | Receiving logic |
| Celery | Async stock updates |
| Transactions | Atomic operations |

---

## Documents in This Group

| # | Document | Tasks | Description |
|---|----------|-------|-------------|
| 01 | `01_Tasks-51-59_GRN-Model.md` | 51-59 | GoodsReceipt, GRNLineItem models, fields, migrations |
| 02 | `02_Tasks-60-68_Receiving-Service.md` | 60-68 | ReceivingService, full/partial, stock update, back-order, tasks |

---

## Task Summary

| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 51 | Create GoodsReceipt Model | Medium | 25 min |
| 52 | Add GRN Core Fields | Medium | 20 min |
| 53 | Add GRN Delivery Fields | Medium | 20 min |
| 54 | Add GRN Inspection Fields | Medium | 20 min |
| 55 | Create GRN Number Generator | Medium | 25 min |
| 56 | Create GRNLineItem Model | Medium | 25 min |
| 57 | Add GRN Line Fields | Medium | 20 min |
| 58 | Add GRN Line Quality Fields | Medium | 20 min |
| 59 | Run GRN Migrations | Low | 15 min |
| 60 | Create ReceivingService Class | High | 30 min |
| 61 | Implement Full Receiving | Medium | 25 min |
| 62 | Implement Partial Receiving | High | 30 min |
| 63 | Implement Update PO Line Status | Medium | 25 min |
| 64 | Implement Update PO Status | Medium | 25 min |
| 65 | Implement Stock Update on Receive | High | 30 min |
| 66 | Create Back-Order Tracking | Medium | 25 min |
| 67 | Implement Quality Rejection | Medium | 25 min |
| 68 | Create Receiving Celery Tasks | Medium | 25 min |

---

## Execution Order

```
[Tasks 51-59: GRN models]
         │
         ▼
[Tasks 60-68: Receiving service and tasks]
```

---

## Expected Deliverables

```
apps/purchases/
├── models/
│   ├── __init__.py
│   ├── goods_receipt.py          # Tasks 51-55
│   └── grn_line_item.py          # Tasks 56-58
├── services/
│   ├── __init__.py
│   └── receiving_service.py      # Tasks 60-67
├── tasks/
│   ├── __init__.py
│   └── stock_tasks.py            # Task 68
└── migrations/
    └── 0004_grn.py               # Task 59
```

---

## Notes for AI Agents

### GRN Number Format
```
GRN-{YEAR}-{SEQUENCE}
Example: GRN-2026-00001

Sequence resets annually.
```

### GoodsReceipt Fields
- grn_number: CharField (unique, auto-generated)
- purchase_order: FK to PurchaseOrder
- received_by: FK to User
- received_at: DateTime
- delivery_note_number: CharField
- carrier: CharField
- delivery_date: Date
- inspection_status: Choice (PENDING, PASSED, FAILED)
- inspection_notes: TextField
- notes: TextField

### GRNLineItem Fields
- goods_receipt: FK to GoodsReceipt
- po_line: FK to POLineItem
- quantity_received: Integer
- quantity_rejected: Integer
- condition: Choice (GOOD, DAMAGED, DEFECTIVE)
- rejection_reason: TextField
- notes: TextField
- received_warehouse: FK to Warehouse
- received_location: FK to WarehouseLocation

### GRN Structure Example
```
GRN: GRN-2026-00001
├── Purchase Order: PO-2026-00015
├── Vendor: ABC Electronics
├── Received By: John Doe
├── Received At: 2026-01-17 10:30
├── Delivery Note: DN-12345
│
├── Line Items:
│   ├── Samsung TV 55" × 10 (Ordered: 15)
│   │   ├── Received: 10
│   │   ├── Rejected: 0
│   │   └── Pending: 5 (Back-order)
│   │
│   └── LG Soundbar × 20 (Ordered: 20)
│       ├── Received: 18
│       ├── Rejected: 2 (Damaged)
│       └── Pending: 0
│
└── Inspection: PASSED
```

### ReceivingService Methods
- receive_full(po_id, grn_data, lines, user)
- receive_partial(po_id, grn_data, lines, user)
- update_po_line_status(po_line_id, quantity_received)
- update_po_status(po_id)
- add_to_stock(grn_id)
- get_back_orders(po_id)
- reject_items(grn_line_id, quantity, reason)

### Stock Update Flow
```
On GRN creation:
1. For each GRN line item
2. Find product and warehouse
3. Get or create StockItem
4. Add quantity_received to stock
5. Create StockMovement (type: RECEIPT)
6. Update product.quantity_on_hand
```

### Back-Order Tracking
```json
{
  "po_id": "uuid",
  "po_number": "PO-2026-00001",
  "back_orders": [
    {
      "product": "Samsung TV 55\"",
      "ordered": 15,
      "received": 10,
      "pending": 5,
      "expected_date": "2026-01-25"
    }
  ]
}
```

### Quality Rejection Flow
```
If quantity_rejected > 0:
1. Don't add rejected items to stock
2. Log rejection reason
3. Notify vendor (optional)
4. Create quality report
```
