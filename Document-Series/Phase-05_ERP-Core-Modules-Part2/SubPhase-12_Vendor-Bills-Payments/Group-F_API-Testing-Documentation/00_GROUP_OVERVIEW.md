# Group F: API, Testing & Documentation

> **Phase:** 05 - ERP Core Modules Part 2  
> **SubPhase:** 12 - Vendor Bills & Payments  
> **Group:** F of F  
> **Tasks Covered:** 81-90  
> **Group Goal:** Create API endpoints, tests, and module documentation

---

## Navigation

- **↑ Parent:** [SubPhase-12 Summary](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [Group E: Statements, Reports & Aging](../Group-E_Statements-Reports-Aging/)

---

## Group Overview

### Key Outcomes

1. **VendorBillSerializer** - DRF serializer for VendorBill with nested lines
2. **BillLineItemSerializer** - DRF serializer for line items
3. **VendorPaymentSerializer** - DRF serializer for payments
4. **VendorBillViewSet** - ViewSet with CRUD, approve, pay actions
5. **Bill Filtering** - Filter by status, vendor, due_date, date range
6. **Bill Custom Actions** - approve, dispute, create_from_po, match
7. **VendorPaymentViewSet** - ViewSet for payment CRUD operations
8. **API URL Registration** - All bill, payment endpoints
9. **Vendor Bills Module Tests** - Unit and integration tests
10. **Module Documentation** - API docs, matching workflow guide

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
| 01 | `01_Tasks-81-86_Serializers-ViewSet-Actions.md` | 81-86 | Bill/Payment serializers, viewsets, filtering, actions |
| 02 | `02_Tasks-87-90_Payment-ViewSet-URLs-Tests-Docs.md` | 87-90 | VendorPaymentViewSet, URLs, tests, documentation |

---

## Task Summary

| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 81 | Create VendorBillSerializer | Medium | 30 min |
| 82 | Create BillLineItemSerializer | Medium | 25 min |
| 83 | Create VendorPaymentSerializer | Medium | 25 min |
| 84 | Create VendorBillViewSet | High | 35 min |
| 85 | Implement Bill Filtering | Medium | 25 min |
| 86 | Add Bill Custom Actions | High | 30 min |
| 87 | Create VendorPaymentViewSet | Medium | 30 min |
| 88 | Register Bill API URLs | Low | 20 min |
| 89 | Create Vendor Bills Module Tests | High | 45 min |
| 90 | Create Vendor Bills Documentation | Medium | 35 min |

---

## Execution Order

```
[Tasks 81-86: Serializers, bill viewset, actions]
         │
         ▼
[Tasks 87-90: Payment viewset, URLs, tests, docs]
```

---

## Expected Deliverables

```
apps/vendor_bills/
├── serializers/
│   ├── __init__.py
│   ├── bill_serializer.py        # Task 81
│   ├── line_item_serializer.py   # Task 82
│   └── payment_serializer.py     # Task 83
├── views/
│   ├── __init__.py
│   ├── bill_viewset.py           # Tasks 84, 86
│   └── payment_viewset.py        # Task 87
├── filters.py                    # Task 85
├── urls.py                       # Task 88
├── tests/
│   ├── __init__.py
│   ├── test_models.py
│   ├── test_bill_service.py
│   ├── test_matching.py
│   ├── test_payments.py
│   └── test_api.py               # Task 89
└── docs/
    └── README.md                 # Task 90
```

---

## Notes for AI Agents

### Bill API Endpoints
```
/api/v1/vendor-bills/
├── GET /bills/                   # List vendor bills
├── POST /bills/                  # Create bill
├── GET /bills/{id}/              # Get bill detail
├── PUT /bills/{id}/              # Update bill (draft/pending only)
├── DELETE /bills/{id}/           # Delete bill (draft only)
├── GET /bills/{id}/lines/        # Get line items
├── POST /bills/{id}/lines/       # Add line item
├── PUT /bills/{id}/lines/{lid}/  # Update line item
├── DELETE /bills/{id}/lines/{lid}/ # Remove line item
├── POST /bills/{id}/submit/      # Submit for approval
├── POST /bills/{id}/approve/     # Approve bill
├── POST /bills/{id}/dispute/     # Mark as disputed
├── POST /bills/{id}/resolve/     # Resolve dispute
├── POST /bills/{id}/cancel/      # Cancel bill
├── POST /bills/{id}/match/       # Run 3-way matching
├── POST /bills/from-po/{po_id}/  # Create from PO
├── GET /bills/{id}/history/      # Get change history
├── GET /bills/{id}/payments/     # Get linked payments
│
├── GET /payments/                # List payments
├── POST /payments/               # Record payment
├── GET /payments/{id}/           # Get payment detail
├── POST /payments/{id}/reverse/  # Reverse payment
├── POST /payments/multi/         # Pay multiple bills
├── POST /payments/advance/       # Record advance payment
│
├── GET /aging/                   # Aging report
├── GET /aging/vendor/{vid}/      # Vendor aging
├── GET /statements/{vid}/        # Vendor statement
├── POST /statements/{vid}/email/ # Email statement
├── GET /dashboard/               # Dashboard data
```

### Bill Filtering Options
```
GET /bills/?status=PENDING
GET /bills/?status=APPROVED,PARTIAL_PAID
GET /bills/?vendor={vendor_id}
GET /bills/?due_from=2026-01-01&due_to=2026-01-31
GET /bills/?overdue=true
GET /bills/?unmatched=true
GET /bills/?search=BILL-2026
```

### Bill Actions
| Action | Method | Description |
|--------|--------|-------------|
| submit | POST /submit/ | Mark as PENDING |
| approve | POST /approve/ | Approve bill |
| dispute | POST /dispute/ | Mark as DISPUTED |
| resolve | POST /resolve/ | Resolve dispute |
| cancel | POST /cancel/ | Cancel bill |
| match | POST /match/ | Run 3-way matching |

### VendorBillSerializer Nested Structure
```json
{
  "id": "uuid",
  "bill_number": "BILL-2026-00001",
  "status": "APPROVED",
  "vendor": {...},
  "vendor_invoice_number": "INV-12345",
  "purchase_order": {...},
  "bill_date": "2026-01-15",
  "due_date": "2026-02-14",
  "lines": [
    {
      "id": "uuid",
      "product": {...},
      "quantity": 100,
      "billed_price": 850,
      "line_total": 85000,
      "po_line": {...},
      "grn_line": {...}
    }
  ],
  "subtotal": 85000,
  "tax_amount": 15300,
  "total": 100300,
  "amount_paid": 0,
  "amount_due": 100300,
  "is_matched": true,
  "matching_variance": 0,
  "created_by": {...},
  "created_at": "2026-01-15T10:00:00"
}
```

### Test Categories
| Category | Tests |
|----------|-------|
| Model Tests | VendorBill, BillLineItem, VendorPayment |
| Bill Service Tests | Creation, status transitions |
| Matching Tests | 3-way matching, variance handling |
| Payment Tests | Full, partial, multi-bill |
| Aging Tests | Bucket calculation, overdue |
| Statement Tests | PDF generation, email |
| API Tests | All endpoints, permissions |
| Integration | End-to-end workflows |

### Documentation Sections
1. **Overview** - Module introduction
2. **Bill Lifecycle** - Status flow diagram
3. **Creating Bills** - From PO and manual
4. **3-Way Matching** - Matching workflow guide
5. **Payment Recording** - Full, partial, multi-bill
6. **Aging & Reports** - Aging buckets, statements
7. **API Reference** - All endpoints
8. **Configuration** - Settings reference
