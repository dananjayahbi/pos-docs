# Group F: API, Testing & Documentation

> **Phase:** 05 - ERP Core Modules Part 2  
> **SubPhase:** 11 - Purchase Orders  
> **Group:** F of F  
> **Tasks Covered:** 83-92  
> **Group Goal:** Create API endpoints, tests, and module documentation

---

## Navigation

- **↑ Parent:** [SubPhase-11 Summary](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [Group E: PO PDF, Email & Notifications](../Group-E_PO-PDF-Email-Notifications/)

---

## Group Overview

### Key Outcomes

1. **POSerializer** - DRF serializer for PurchaseOrder with nested lines
2. **POLineItemSerializer** - DRF serializer for line items
3. **GRNSerializer** - DRF serializer for GoodsReceipt
4. **POViewSet** - ViewSet with CRUD, send, receive actions
5. **PO Filtering** - Filter by status, vendor, date range
6. **PO Actions** - Custom actions: send, acknowledge, receive, cancel
7. **GRNViewSet** - ViewSet for goods receipt operations
8. **API URL Registration** - All PO, GRN endpoints
9. **Purchase Module Tests** - Unit and integration tests
10. **Module Documentation** - API docs, receiving workflow guide

### Technology Context

| Technology | Purpose |
|------------|---------|
| Django REST Framework | API serializers/views |
| django-filter | Filtering capabilities |
| pytest | Testing framework |
| OpenAPI | API documentation |

---

## Documents in This Group

| # | Document | Tasks | Description |
|---|----------|-------|-------------|
| 01 | `01_Tasks-83-88_Serializers-ViewSet-Actions.md` | 83-88 | PO/GRN serializers, viewsets, filtering, actions |
| 02 | `02_Tasks-89-92_GRN-URLs-Tests-Docs.md` | 89-92 | GRNViewSet, URLs, tests, documentation |

---

## Task Summary

| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 83 | Create POSerializer | Medium | 30 min |
| 84 | Create POLineItemSerializer | Medium | 25 min |
| 85 | Create GRNSerializer | Medium | 25 min |
| 86 | Create POViewSet | High | 35 min |
| 87 | Implement PO Filtering | Medium | 25 min |
| 88 | Add PO Actions | High | 30 min |
| 89 | Create GRNViewSet | Medium | 30 min |
| 90 | Register PO API URLs | Low | 20 min |
| 91 | Create Purchase Module Tests | High | 45 min |
| 92 | Create Purchase Module Documentation | Medium | 35 min |

---

## Execution Order

```
[Tasks 83-88: Serializers, viewset, actions]
         │
         ▼
[Tasks 89-92: GRN viewset, URLs, tests, docs]
```

---

## Expected Deliverables

```
apps/purchases/
├── serializers/
│   ├── __init__.py
│   ├── po_serializer.py          # Task 83
│   ├── line_item_serializer.py   # Task 84
│   └── grn_serializer.py         # Task 85
├── views/
│   ├── __init__.py
│   ├── po_viewset.py             # Tasks 86, 88
│   └── grn_viewset.py            # Task 89
├── filters.py                    # Task 87
├── urls.py                       # Task 90
├── tests/
│   ├── __init__.py
│   ├── test_models.py
│   ├── test_po_service.py
│   ├── test_receiving.py
│   └── test_api.py               # Task 91
└── docs/
    └── README.md                 # Task 92
```

---

## Notes for AI Agents

### PO API Endpoints
```
/api/v1/purchases/
├── GET /orders/                  # List purchase orders
├── POST /orders/                 # Create PO
├── GET /orders/{id}/             # Get PO detail
├── PUT /orders/{id}/             # Update PO (draft only)
├── DELETE /orders/{id}/          # Delete PO (draft only)
├── GET /orders/{id}/lines/       # Get line items
├── POST /orders/{id}/lines/      # Add line item
├── PUT /orders/{id}/lines/{lid}/ # Update line item
├── DELETE /orders/{id}/lines/{lid}/ # Remove line item
├── POST /orders/{id}/send/       # Send to vendor
├── POST /orders/{id}/acknowledge/ # Acknowledge receipt
├── POST /orders/{id}/receive/    # Create GRN (receive items)
├── POST /orders/{id}/cancel/     # Cancel PO
├── POST /orders/{id}/approve/    # Approve PO
├── GET /orders/{id}/pdf/         # Download PDF
├── POST /orders/{id}/email/      # Email to vendor
├── GET /orders/{id}/history/     # Get change history
├── POST /orders/from-suggestions/ # Create from reorder
├── POST /orders/from-low-stock/  # Create from low stock
├── POST /orders/duplicate/{id}/  # Duplicate PO
│
├── GET /grn/                     # List GRNs
├── POST /grn/                    # Create GRN
├── GET /grn/{id}/                # Get GRN detail
├── GET /grn/{id}/lines/          # Get GRN lines
│
├── GET /back-orders/             # List back-orders
├── GET /dashboard/               # Purchase dashboard
```

### PO Filtering Options
```
GET /orders/?status=DRAFT
GET /orders/?status=SENT,ACKNOWLEDGED
GET /orders/?vendor={vendor_id}
GET /orders/?date_from=2026-01-01&date_to=2026-01-31
GET /orders/?expected_delivery_from=2026-01-20
GET /orders/?requires_approval=true
GET /orders/?search=PO-2026
```

### PO Actions
| Action | Method | Description |
|--------|--------|-------------|
| send | POST /send/ | Mark as SENT |
| acknowledge | POST /acknowledge/ | Vendor confirmed |
| receive | POST /receive/ | Create GRN |
| cancel | POST /cancel/ | Cancel PO |
| approve | POST /approve/ | Approve PO |

### POSerializer Nested Structure
```json
{
  "id": "uuid",
  "po_number": "PO-2026-00001",
  "status": "DRAFT",
  "vendor": {...},
  "order_date": "2026-01-15",
  "expected_delivery_date": "2026-01-25",
  "lines": [
    {
      "id": "uuid",
      "product": {...},
      "quantity_ordered": 10,
      "quantity_received": 0,
      "unit_price": 85000,
      "line_total": 850000,
      "status": "PENDING"
    }
  ],
  "subtotal": 1150000,
  "tax_amount": 207000,
  "shipping_cost": 5000,
  "total": 1362000,
  "created_by": {...},
  "created_at": "2026-01-15T10:00:00"
}
```

### Test Categories
| Category | Tests |
|----------|-------|
| Model Tests | PO, POLineItem, GRN |
| PO Service Tests | Creation, status transitions |
| Calculation Tests | Line totals, PO totals |
| Receiving Tests | Full, partial, back-order |
| PDF Tests | Generation, storage |
| Email Tests | Sending, templates |
| API Tests | All endpoints, permissions |
| Integration | End-to-end workflows |

### Documentation Sections
1. **Overview** - Module introduction
2. **PO Lifecycle** - Status flow diagram
3. **Creating POs** - Manual and automated
4. **Sending POs** - PDF and email
5. **Receiving Workflow** - GRN process
6. **Back-Order Handling** - Partial receiving
7. **API Reference** - All endpoints
8. **Configuration** - Settings reference
