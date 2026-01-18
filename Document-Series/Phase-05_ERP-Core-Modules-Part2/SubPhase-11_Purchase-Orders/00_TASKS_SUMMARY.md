# SubPhase 11: Purchase Orders - Tasks Summary

> **Phase:** 05 - ERP Core Modules Part 2  
> **SubPhase Index:** 11 of 12  
> **SubPhase Goal:** Create and manage purchase orders with receiving workflow and goods receipt notes  
> **Total Tasks:** 92 | **Status:** Planning  
> **Estimated Duration:** 14-16 hours

---

## Navigation

- **↑ Parent:** [00_SUBPHASES_SUMMARY.md](../00_SUBPHASES_SUMMARY.md)
- **← Previous SubPhase:** [SubPhase-10_Vendor-Module](../SubPhase-10_Vendor-Module/)
- **→ Next SubPhase:** [SubPhase-12_Vendor-Bills-Payments](../SubPhase-12_Vendor-Bills-Payments/)

---

## SubPhase Overview

This sub-phase implements a complete purchase order management system for procurement. Supports PO creation from reorder suggestions or manual entry, sending to vendors, tracking acknowledgment, partial and full receiving, Goods Receipt Notes (GRN), and back-order handling for items not yet received.

### Key Outcomes
- Purchase Order model with lifecycle management
- Multi-line item support with product linking
- PO creation from stock reorder suggestions
- PO PDF generation for vendor sending
- Email sending with PDF attachment
- Receiving workflow with partial receiving
- Goods Receipt Note (GRN) generation
- Back-order tracking for pending items
- PO-to-Bill matching preparation
- Purchase dashboard with status overview

### Technology Context
- **Backend:** Django 5.x with DRF for API
- **PDF Generation:** ReportLab or WeasyPrint
- **Email:** Django email with Celery async
- **Frontend:** Next.js 14+ with TypeScript
- **PO Number Format:** `PO-{YEAR}-{SEQUENCE}` (e.g., PO-2026-00001)

### Dependencies
- Phase-04: Products, Inventory (for product and stock updates)
- Phase-05 SubPhase-10: Vendor Module (for vendor selection)

---

## Task Execution Order

```
TASK GROUP A: Purchase Order Model & Status (Tasks 01-18)
        │
        ▼
TASK GROUP B: PO Line Items & Calculations (Tasks 19-34)
        │
        ▼
TASK GROUP C: PO Creation & Sending (Tasks 35-50)
        │
        ▼
TASK GROUP D: Receiving Workflow & GRN (Tasks 51-68)
        │
        ▼
TASK GROUP E: PO PDF, Email & Notifications (Tasks 69-82)
        │
        ▼
TASK GROUP F: API, Testing & Documentation (Tasks 83-92)
```

---

## Task Index

### Group A: Purchase Order Model & Status (Tasks 01-18)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 01 | **Create purchases Django App** | Create new Django app for purchase orders with proper structure | None | 🔴 Not Created |
| 02 | **Register purchases App** | Add purchases app to TENANT_APPS in Django settings | Task 01 | 🔴 Not Created |
| 03 | **Define POStatus Choices** | Create enum: DRAFT, SENT, ACKNOWLEDGED, PARTIAL_RECEIVED, RECEIVED, CANCELLED, CLOSED | Task 01 | 🔴 Not Created |
| 04 | **Create PurchaseOrder Model Core** | Define PO with po_number, status, created_at, updated_at | Task 03 | 🔴 Not Created |
| 05 | **Add PO Vendor Fields** | Add vendor FK, vendor_reference (vendor's order number) | Task 04 | 🔴 Not Created |
| 06 | **Add PO Date Fields** | Add order_date, expected_delivery_date, acknowledged_at, received_at | Task 04 | 🔴 Not Created |
| 07 | **Add PO Shipping Fields** | Add ship_to_address (warehouse), shipping_method, shipping_cost | Task 04 | 🔴 Not Created |
| 08 | **Add PO Financial Fields** | Add subtotal, discount_amount, tax_amount, total, currency | Task 04 | 🔴 Not Created |
| 09 | **Add PO Payment Fields** | Add payment_terms, payment_due_date | Task 04 | 🔴 Not Created |
| 10 | **Add PO User Fields** | Add created_by, approved_by, received_by ForeignKeys | Task 04 | 🔴 Not Created |
| 11 | **Add PO Notes Fields** | Add notes, internal_notes, vendor_notes | Task 04 | 🔴 Not Created |
| 12 | **Add PO Approval Fields** | Add requires_approval, approved_at, approval_notes | Task 04 | 🔴 Not Created |
| 13 | **Add PO Warehouse Field** | Add receiving_warehouse FK for stock updates | Task 04 | 🔴 Not Created |
| 14 | **Create PO Number Generator** | Auto-generate PO numbers with yearly sequence | Task 04 | 🔴 Not Created |
| 15 | **Add PO PDF Storage Field** | Add FileField for generated PDF, pdf_generated_at | Task 04 | 🔴 Not Created |
| 16 | **Create PO Model Indexes** | Add indexes for status, vendor, po_number, dates | Task 04 | 🔴 Not Created |
| 17 | **Create PO Model Constraints** | Add validation for status transitions | Task 04 | 🔴 Not Created |
| 18 | **Run Initial PO Migrations** | Generate and apply migrations for PurchaseOrder | Task 17 | 🔴 Not Created |

---

### Group B: PO Line Items & Calculations (Tasks 19-34)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 19 | **Create POLineItem Model** | Define line item model with FK to PurchaseOrder | Task 18 | 🔴 Not Created |
| 20 | **Add Line Item Product Fields** | Add product FK, variant FK, vendor_sku | Task 19 | 🔴 Not Created |
| 21 | **Add Line Item Description** | Add item_description for non-product items | Task 19 | 🔴 Not Created |
| 22 | **Add Line Item Quantity Fields** | Add quantity_ordered, quantity_received, quantity_pending | Task 19 | 🔴 Not Created |
| 23 | **Add Line Item Pricing Fields** | Add unit_price, discount_percentage, tax_rate | Task 19 | 🔴 Not Created |
| 24 | **Add Line Item Total Field** | Add line_total computed field | Task 19 | 🔴 Not Created |
| 25 | **Add Line Item Status Field** | Add status: PENDING, PARTIAL, RECEIVED, CANCELLED | Task 19 | 🔴 Not Created |
| 26 | **Add Line Item Expected Date** | Add expected_delivery_date per line (optional) | Task 19 | 🔴 Not Created |
| 27 | **Add Line Item Warehouse** | Add receiving_warehouse, receiving_location | Task 19 | 🔴 Not Created |
| 28 | **Run POLineItem Migrations** | Generate and apply migrations for POLineItem | Task 27 | 🔴 Not Created |
| 29 | **Create PO Calculation Service** | Service for calculating PO totals | Task 28 | 🔴 Not Created |
| 30 | **Implement Line Total Calculator** | Calculate line totals with discounts | Task 29 | 🔴 Not Created |
| 31 | **Implement PO Tax Calculator** | Calculate tax based on line items | Task 29 | 🔴 Not Created |
| 32 | **Implement PO Grand Total** | Calculate subtotal, shipping, tax, total | Task 29 | 🔴 Not Created |
| 33 | **Create PO Recalculation Signal** | Auto-recalculate PO totals on line changes | Task 32 | 🔴 Not Created |
| 34 | **Implement Vendor Price Lookup** | Auto-fill price from vendor product catalog | Task 29 | 🔴 Not Created |

---

### Group C: PO Creation & Sending (Tasks 35-50)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 35 | **Create POService Class** | Main service for PO business operations | Task 34 | 🔴 Not Created |
| 36 | **Implement Manual PO Creation** | Create PO manually with line items | Task 35 | 🔴 Not Created |
| 37 | **Implement PO from Reorder Suggestions** | Create PO from stock reorder suggestions | Task 35 | 🔴 Not Created |
| 38 | **Implement PO from Low Stock Report** | Create PO based on low stock alerts | Task 35 | 🔴 Not Created |
| 39 | **Implement PO Duplication** | Duplicate existing PO as new draft | Task 35 | 🔴 Not Created |
| 40 | **Implement PO Editing** | Edit PO before sending (DRAFT status) | Task 35 | 🔴 Not Created |
| 41 | **Implement PO Status Transitions** | Methods for send(), acknowledge(), cancel() | Task 35 | 🔴 Not Created |
| 42 | **Add Status Transition Validation** | Validate allowed status transitions | Task 41 | 🔴 Not Created |
| 43 | **Implement PO Approval Workflow** | Optional approval before sending | Task 35 | 🔴 Not Created |
| 44 | **Create POHistory Model** | Model for tracking PO changes | Task 35 | 🔴 Not Created |
| 45 | **Implement History Logging** | Log all PO actions with user, timestamp | Task 44 | 🔴 Not Created |
| 46 | **Create POSettings Model** | Tenant settings for numbering, approval threshold | Task 35 | 🔴 Not Created |
| 47 | **Implement Approval Threshold** | Require approval for POs above threshold | Task 46 | 🔴 Not Created |
| 48 | **Run PO Service Migrations** | Generate migrations for POHistory, POSettings | Task 47 | 🔴 Not Created |
| 49 | **Implement Multi-Vendor PO Split** | Split reorder into separate POs per vendor | Task 37 | 🔴 Not Created |
| 50 | **Implement PO Consolidation** | Combine multiple small orders to one vendor | Task 35 | 🔴 Not Created |

---

### Group D: Receiving Workflow & GRN (Tasks 51-68)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 51 | **Create GoodsReceipt Model** | Model for Goods Receipt Note (GRN) | Task 50 | 🔴 Not Created |
| 52 | **Add GRN Core Fields** | Add grn_number, purchase_order FK, received_by, received_at | Task 51 | 🔴 Not Created |
| 53 | **Add GRN Delivery Fields** | Add delivery_note_number, carrier, delivery_date | Task 51 | 🔴 Not Created |
| 54 | **Add GRN Inspection Fields** | Add inspection_status, inspection_notes | Task 51 | 🔴 Not Created |
| 55 | **Create GRN Number Generator** | Auto-generate GRN numbers: GRN-{YEAR}-{SEQUENCE} | Task 51 | 🔴 Not Created |
| 56 | **Create GRNLineItem Model** | Line items for GRN with quantities | Task 51 | 🔴 Not Created |
| 57 | **Add GRN Line Fields** | Add po_line FK, quantity_received, quantity_rejected | Task 56 | 🔴 Not Created |
| 58 | **Add GRN Line Quality Fields** | Add condition, rejection_reason, notes | Task 56 | 🔴 Not Created |
| 59 | **Run GRN Migrations** | Generate and apply migrations for GRN models | Task 58 | 🔴 Not Created |
| 60 | **Create ReceivingService Class** | Service for receiving workflow | Task 59 | 🔴 Not Created |
| 61 | **Implement Full Receiving** | Receive all items in PO | Task 60 | 🔴 Not Created |
| 62 | **Implement Partial Receiving** | Receive subset of items, create back-order | Task 60 | 🔴 Not Created |
| 63 | **Implement Update PO Line Status** | Update line quantity_received, status | Task 60 | 🔴 Not Created |
| 64 | **Implement Update PO Status** | Update PO to PARTIAL_RECEIVED or RECEIVED | Task 63 | 🔴 Not Created |
| 65 | **Implement Stock Update on Receive** | Add received items to inventory | Task 60 | 🔴 Not Created |
| 66 | **Create Back-Order Tracking** | Track items not yet received | Task 62 | 🔴 Not Created |
| 67 | **Implement Quality Rejection** | Handle rejected items, don't add to stock | Task 60 | 🔴 Not Created |
| 68 | **Create Receiving Celery Tasks** | Async tasks for stock updates | Task 67 | 🔴 Not Created |

---

### Group E: PO PDF, Email & Notifications (Tasks 69-82)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 69 | **Create POTemplate Model** | Model for PO PDF template configuration | Task 68 | 🔴 Not Created |
| 70 | **Add Template Header Fields** | Fields for logo, company_name, address | Task 69 | 🔴 Not Created |
| 71 | **Add Template Styling Fields** | Fields for colors, fonts, layout | Task 69 | 🔴 Not Created |
| 72 | **Run POTemplate Migrations** | Generate and apply migrations | Task 71 | 🔴 Not Created |
| 73 | **Create POPDFGenerator Service** | Service for generating PO PDFs | Task 72 | 🔴 Not Created |
| 74 | **Implement PDF Header Section** | Generate header with company, PO number | Task 73 | 🔴 Not Created |
| 75 | **Implement PDF Vendor Section** | Generate vendor details section | Task 73 | 🔴 Not Created |
| 76 | **Implement PDF Line Items Table** | Generate itemized table | Task 73 | 🔴 Not Created |
| 77 | **Implement PDF Totals Section** | Generate subtotal, tax, shipping, total | Task 73 | 🔴 Not Created |
| 78 | **Implement PDF Terms Section** | Generate payment terms, delivery instructions | Task 73 | 🔴 Not Created |
| 79 | **Create POEmailService** | Service for sending PO emails | Task 73 | 🔴 Not Created |
| 80 | **Create PO Email Template** | HTML template for PO delivery | Task 79 | 🔴 Not Created |
| 81 | **Create PO Email Celery Task** | Async email sending with retry | Task 80 | 🔴 Not Created |
| 82 | **Create Delivery Reminder Task** | Reminder for overdue expected deliveries | Task 81 | 🔴 Not Created |

---

### Group F: API, Testing & Documentation (Tasks 83-92)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 83 | **Create POSerializer** | DRF serializer for PurchaseOrder with nested lines | Task 82 | 🔴 Not Created |
| 84 | **Create POLineItemSerializer** | DRF serializer for line items | Task 83 | 🔴 Not Created |
| 85 | **Create GRNSerializer** | DRF serializer for GoodsReceipt | Task 83 | 🔴 Not Created |
| 86 | **Create POViewSet** | ViewSet with CRUD, send, receive actions | Task 85 | 🔴 Not Created |
| 87 | **Implement PO Filtering** | Filter by status, vendor, date range | Task 86 | 🔴 Not Created |
| 88 | **Add PO Actions** | Custom actions: send, acknowledge, receive, cancel | Task 86 | 🔴 Not Created |
| 89 | **Create GRNViewSet** | ViewSet for goods receipt operations | Task 86 | 🔴 Not Created |
| 90 | **Register PO API URLs** | Add all PO, GRN endpoints to URL configuration | Task 89 | 🔴 Not Created |
| 91 | **Create Purchase Module Tests** | Unit and integration tests for all modules | Task 90 | 🔴 Not Created |
| 92 | **Create Purchase Module Documentation** | API docs, receiving workflow guide | Task 91 | 🔴 Not Created |

---

## Expected File Structure

```
backend/apps/purchases/
├── __init__.py
├── admin.py                    # Admin for PO, GRN
├── apps.py                     # App configuration
├── models/
│   ├── __init__.py
│   ├── purchase_order.py      # PurchaseOrder model
│   ├── po_line_item.py        # POLineItem model
│   ├── goods_receipt.py       # GoodsReceipt model
│   ├── grn_line_item.py       # GRNLineItem model
│   ├── po_template.py         # POTemplate model
│   ├── po_history.py          # POHistory model
│   └── po_settings.py         # POSettings model
├── services/
│   ├── __init__.py
│   ├── po_service.py          # Main PO business logic
│   ├── calculation_service.py # PO calculations
│   ├── receiving_service.py   # Receiving workflow
│   ├── pdf_generator.py       # PDF generation
│   └── email_service.py       # Email sending
├── serializers/
│   ├── __init__.py
│   ├── po_serializer.py       # PO serializer
│   ├── line_item_serializer.py
│   └── grn_serializer.py
├── views/
│   ├── __init__.py
│   ├── po_viewset.py          # PO CRUD ViewSet
│   └── grn_viewset.py         # GRN ViewSet
├── tasks/
│   ├── __init__.py
│   ├── email_tasks.py         # PO email tasks
│   ├── stock_tasks.py         # Stock update tasks
│   └── reminder_tasks.py      # Delivery reminders
├── filters.py                  # PO filtering
├── urls.py                     # URL routing
├── signals.py                  # PO signals
├── permissions.py              # PO-specific permissions
├── tests/
│   ├── __init__.py
│   ├── test_models.py
│   ├── test_po_service.py
│   ├── test_receiving.py
│   └── test_api.py
└── migrations/
```

---

## PO Status Flow Diagram

```
                    ┌───────────────┐
                    │     DRAFT     │ ← Initial state, editable
                    └───────┬───────┘
                            │ send()
                            ▼
                    ┌───────────────┐
                    │     SENT      │ ← Sent to vendor
                    └───────┬───────┘
                            │ acknowledge()
                            ▼
                    ┌───────────────┐
                    │  ACKNOWLEDGED │ ← Vendor confirmed
                    └───────┬───────┘
                            │ receive()
          ┌─────────────────┼─────────────────┐
          │                                   │
          ▼                                   ▼
  ┌─────────────────┐               ┌───────────────┐
  │ PARTIAL_RECEIVED│               │   RECEIVED    │
  └─────────┬───────┘               └───────┬───────┘
            │ receive_remaining()           │
            └───────────┬───────────────────┘
                        │ close()
                        ▼
                ┌───────────────┐
                │    CLOSED     │ ← Final state
                └───────────────┘

  CANCELLATION:
  ┌───────────────┐
  │   CANCELLED   │ ← Before receiving
  └───────────────┘
```

---

## GRN (Goods Receipt Note) Structure

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

---

## PO Number Format

```
PO-{YEAR}-{SEQUENCE}
GRN-{YEAR}-{SEQUENCE}

Examples:
- PO-2026-00001   (First PO of 2026)
- PO-2026-00150   (150th PO of 2026)
- GRN-2026-00001  (First GRN of 2026)

Sequence resets annually.
Prefix configurable in POSettings.
```

---

## Key Business Rules

1. **Draft Only Editing:** PO can only be edited in DRAFT status
2. **Approval Required:** Optional approval for POs above threshold
3. **Partial Receiving:** Track received vs ordered quantities
4. **Back-Order:** Automatically track pending items
5. **Stock Update:** Add to inventory only on GRN creation
6. **Quality Rejection:** Rejected items not added to stock
7. **Vendor Reference:** Store vendor's order number for matching
8. **Multiple GRNs:** One PO can have multiple GRNs (partial)
9. **PDF Lock:** Regenerate PDF only in DRAFT status

---

## Receiving Scenarios

| Scenario | PO Status | Action |
|----------|-----------|--------|
| Full quantity received | RECEIVED | Close PO, update stock |
| Partial quantity received | PARTIAL_RECEIVED | Create back-order |
| Items rejected (quality) | PARTIAL_RECEIVED | Don't add to stock |
| No items received | ACKNOWLEDGED | No change |
| Cancelled before receiving | CANCELLED | No stock impact |

---

## Sri Lanka Specific Considerations

- **Currency:** Default LKR, support USD for imports
- **Import POs:** Consider customs clearance time in lead time
- **Bank Payments:** Prepare payment info for bills
- **Tax:** Include import duties for imported goods
- **Delivery:** Consider local logistics providers

---

## Progress Tracking

| Metric | Count |
|--------|-------|
| Total Tasks | 92 |
| Tasks Completed | 0 |
| Tasks In Progress | 0 |
| Completion Percentage | 0% |

**Last Updated:** 2026-01-17  
**Next Action:** Create Task 01 (purchases Django App)

---

## Notes for AI Agents

- Stock update must only happen on GRN creation, not PO
- Use database transactions for receiving to prevent data inconsistency
- Back-order items should trigger reorder suggestions
- Implement 3-way matching: PO → GRN → Bill (next SubPhase)
- PDF should include all shipping instructions
- Consider barcode scanning for receiving (future)
- Track delivery performance for vendor scoring
- Handle currency conversion for international vendors

---

*End of SubPhase 11 Tasks Summary*
