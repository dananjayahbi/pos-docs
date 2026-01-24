# Tasks 60-68: Receiving Service and Stock Updates

> **Phase:** 05 - ERP Core Modules Part 2  
> **SubPhase:** 11 - Purchase Orders  
> **Group:** D - Receiving Workflow & GRN  
> **Document:** 02 of 02  
> **Tasks Covered:** 60, 61, 62, 63, 64, 65, 66, 67, 68

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [01_Tasks-51-59_GRN-Model.md](01_Tasks-51-59_GRN-Model.md)

---

## Document Overview

This document implements the ReceivingService that handles the complete receiving workflow including full and partial receiving, GRN creation, stock updates, and back-order management.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
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

## Task 60: Create ReceivingService Class

### Instructions
1. Create `receiving_service.py` in services
2. Define ReceivingService class
3. Import GoodsReceipt, GRNLineItem, PurchaseOrder
4. Add service structure for receiving operations
5. Add error handling exceptions
6. Export service

### Service Methods
```
ReceivingService:
├── receive_full(po_id, grn_data, user)
├── receive_partial(po_id, lines_data, grn_data, user)
├── update_po_line_status(po_line_id, qty_received)
├── update_po_status(po_id)
├── add_to_stock(grn_id)
├── get_back_orders(po_id)
└── reject_items(grn_line_id, qty, reason)
```

---

## Task 61: Implement Full Receiving

### Instructions
1. Add receive_full method
2. Accept po_id, grn_data, user
3. Validate PO status (SENT or ACKNOWLEDGED)
4. Create GoodsReceipt
5. Create GRNLineItem for each PO line with full quantities
6. Update PO line quantities_received
7. Update PO status to RECEIVED
8. Trigger stock update
9. Return GRN

### Full Receiving Flow
```
Input: PO-2026-00001
├── Line 1: 10 units ordered
├── Line 2: 20 units ordered
└── Line 3: 15 units ordered

Process:
├── Create GRN-2026-00001
├── Receive Line 1: 10 units
├── Receive Line 2: 20 units
├── Receive Line 3: 15 units
└── Update PO status: RECEIVED
```

---

## Task 62: Implement Partial Receiving

### Instructions
1. Add receive_partial method
2. Accept po_id, lines_data (with quantities), grn_data, user
3. Validate quantities <= ordered
4. Create GoodsReceipt
5. Create GRNLineItem for specified quantities
6. Update PO line quantities_received
7. Update line status (PENDING/PARTIAL/RECEIVED)
8. Update PO status (PARTIAL_RECEIVED or RECEIVED if complete)
9. Calculate back-orders
10. Return GRN and back-order info

### Partial Receiving Example
```
Ordered: 100 units
First Receipt: 60 units
├── quantity_received = 60
├── quantity_pending = 40
└── status = PARTIAL

Second Receipt: 30 units
├── quantity_received = 90
├── quantity_pending = 10
└── status = PARTIAL

Third Receipt: 10 units
├── quantity_received = 100
├── quantity_pending = 0
└── status = RECEIVED
```

---

## Task 63: Implement Update PO Line Status

### Instructions
1. Add update_po_line_status method
2. Accept po_line_id, quantity_received
3. Load POLineItem
4. Update quantity_received (increment)
5. Calculate quantity_pending
6. Determine line status (PENDING/PARTIAL/RECEIVED)
7. Update line status field
8. Save POLineItem

### Line Status Logic
```python
if quantity_received == 0:
    status = 'PENDING'
elif quantity_received >= quantity_ordered:
    status = 'RECEIVED'
else:
    status = 'PARTIAL'
```

---

## Task 64: Implement Update PO Status

### Instructions
1. Add update_po_status method
2. Accept po_id
3. Load PurchaseOrder with line_items
4. Check all line statuses
5. Determine PO status
6. Update PO.status field
7. Save PurchaseOrder

### PO Status Determination
| Line Statuses | PO Status |
|---------------|-----------|
| All PENDING | ACKNOWLEDGED |
| Mix of PARTIAL/PENDING | PARTIAL_RECEIVED |
| All RECEIVED | RECEIVED |

---

## Task 65: Implement Stock Update on Receive

### Instructions
1. Add add_to_stock method
2. Accept grn_id
3. Load GoodsReceipt with line_items
4. For each GRN line:
   - Get product and warehouse
   - Get or create StockItem
   - Add quantity_accepted to stock
   - Create StockMovement (type: RECEIPT)
5. Use database transaction
6. Log stock updates
7. Trigger inventory sync

### Stock Update Flow
```
GRN Line: Samsung TV × 10
├── Load StockItem (Main Warehouse, Samsung TV)
├── Current Stock: 25
├── Add Received: 10
├── New Stock: 35
├── Create StockMovement:
│   ├── Type: RECEIPT
│   ├── Quantity: 10
│   ├── Reference: GRN-2026-00001
│   └── PO: PO-2026-00001
└── Update Product.quantity_on_hand
```

---

## Task 66: Create Back-Order Tracking

### Instructions
1. Add get_back_orders method
2. Accept po_id
3. Query PO line_items where quantity_pending > 0
4. Return list of back-ordered items with details
5. Include expected_delivery_date
6. Calculate value of back-orders

### Back-Order Structure
```json
{
  "po_number": "PO-2026-00001",
  "back_orders": [
    {
      "product": "Samsung TV",
      "ordered": 100,
      "received": 60,
      "pending": 40,
      "expected_date": "2026-02-15",
      "value": 340000.00
    }
  ],
  "total_back_order_value": 340000.00
}
```

---

## Task 67: Implement Quality Rejection

### Instructions
1. Add reject_items method
2. Accept grn_line_id, quantity, reason
3. Update GRNLineItem.quantity_rejected
4. Update condition to DAMAGED/DEFECTIVE
5. Set rejection_reason
6. Do NOT add rejected items to stock
7. Log rejection
8. Optionally create vendor return

### Rejection Flow
```
Received: 100 units
Inspection finds: 5 damaged

GRN Line:
├── quantity_received = 100
├── quantity_rejected = 5
├── quantity_accepted = 95 (to stock)
├── condition = DAMAGED
└── rejection_reason = "Packaging damage"

Stock Update:
└── Add only 95 units to inventory
```

---

## Task 68: Create Receiving Celery Tasks

### Instructions
1. Create `stock_tasks.py` in tasks directory
2. Define async_stock_update task
3. Accept grn_id parameter
4. Call ReceivingService.add_to_stock(grn_id)
5. Handle errors and retries
6. Send notifications on completion
7. Update task in POService.receive_full/partial

### Celery Task
```python
@shared_task(bind=True, max_retries=3)
def async_stock_update(self, grn_id):
    """Asynchronous stock update from GRN"""
    try:
        receiving_service = ReceivingService()
        receiving_service.add_to_stock(grn_id)
        
        # Notify completion
        send_receiving_notification(grn_id)
        
        return {'status': 'success', 'grn_id': grn_id}
    except Exception as exc:
        self.retry(exc=exc, countdown=60)
```

---

## Summary

Group D Complete - All 18 tasks:
- ✅ GoodsReceipt model
- ✅ GRN number generation
- ✅ GRNLineItem model
- ✅ Full receiving workflow
- ✅ Partial receiving
- ✅ Stock updates
- ✅ Back-order tracking
- ✅ Quality rejection
- ✅ Async processing

### Next Steps
- **Group E**: Implement PDF generation and email notifications
