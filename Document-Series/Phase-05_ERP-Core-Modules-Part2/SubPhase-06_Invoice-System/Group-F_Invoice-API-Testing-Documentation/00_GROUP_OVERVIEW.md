# Group F: Invoice API, Testing & Documentation

> **Phase:** 05 - ERP Core Modules Part 2  
> **SubPhase:** 06 - Invoice System  
> **Group:** F of F  
> **Tasks Covered:** 81-90  
> **Group Goal:** Create API endpoints, tests, and compliance documentation

---

## Navigation

- **↑ Parent:** [SubPhase-06 Summary](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [Group E: Invoice PDF & Email](../Group-E_Invoice-PDF-Email/)

---

## Group Overview

### Key Outcomes

1. **InvoiceSerializer** - DRF serializer with nested line items
2. **InvoiceLineItemSerializer** - Serializer with validation
3. **InvoiceListSerializer** - Lightweight list serializer
4. **InvoiceViewSet** - ViewSet with CRUD and custom actions
5. **Invoice Filtering** - Filter by status, type, customer, date
6. **Invoice Actions** - issue, send, mark_paid, void
7. **Aging Report Endpoint** - API for invoice aging report
8. **API URL Registration** - Register all endpoints
9. **Invoice Module Tests** - Unit and integration tests
10. **Invoice Module Documentation** - API docs, compliance guide

### Technology Context

| Technology | Purpose |
|------------|---------|
| Django REST Framework | API serializers and viewsets |
| django-filter | Invoice filtering |
| pytest | Testing framework |
| MkDocs | Documentation generation |

---

## Documents in This Group

| # | Document | Tasks | Description |
|---|----------|-------|-------------|
| 01 | `01_Tasks-81-87_Serializers-ViewSet-Actions.md` | 81-87 | Serializers, InvoiceViewSet, filtering, actions, aging report |
| 02 | `02_Tasks-88-90_URLs-Tests-Documentation.md` | 88-90 | URL registration, tests, documentation |

---

## Task Summary

| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 81 | Create InvoiceSerializer | Medium | 25 min |
| 82 | Create InvoiceLineItemSerializer | Medium | 25 min |
| 83 | Create InvoiceListSerializer | Low | 20 min |
| 84 | Create InvoiceViewSet | High | 30 min |
| 85 | Implement Invoice Filtering | Medium | 25 min |
| 86 | Add Invoice Actions | High | 30 min |
| 87 | Create Aging Report Endpoint | Medium | 30 min |
| 88 | Register Invoice API URLs | Low | 20 min |
| 89 | Create Invoice Module Tests | High | 45 min |
| 90 | Create Invoice Module Documentation | Medium | 40 min |

---

## Execution Order

```
[Tasks 81-83: Serializers]
         │
         ▼
[Tasks 84-87: ViewSet, filtering, actions, aging report]
         │
         ▼
[Tasks 88-90: URLs, tests, documentation]
```

---

## Expected Deliverables

```
apps/invoices/
├── serializers/
│   ├── __init__.py
│   ├── invoice_serializer.py     # Tasks 81, 83
│   └── line_item_serializer.py   # Task 82
├── views/
│   ├── __init__.py
│   ├── invoice_viewset.py        # Tasks 84-86
│   └── report_views.py           # Task 87
├── filters.py                    # Task 85
├── urls.py                       # Task 88
├── tests/
│   ├── __init__.py
│   ├── test_models.py
│   ├── test_services.py
│   ├── test_pdf.py
│   └── test_api.py               # Task 89
└── docs/
    └── README.md                 # Task 90

docs/
└── modules/
    └── invoices/
        ├── index.md              # Task 90
        ├── models.md
        ├── api.md
        ├── compliance.md
        └── pdf-generation.md
```

---

## Notes for AI Agents

### API Endpoints
```
/api/v1/invoices/
├── GET /                         # List invoices
├── POST /                        # Create invoice
├── GET /{id}/                    # Get invoice detail
├── PUT /{id}/                    # Update invoice (draft only)
├── DELETE /{id}/                 # Delete (draft only)
├── POST /{id}/issue/             # Issue invoice
├── POST /{id}/send/              # Send invoice email
├── POST /{id}/mark-paid/         # Mark as paid
├── POST /{id}/void/              # Void invoice
├── GET /{id}/pdf/                # Download PDF
├── GET /{id}/history/            # Get invoice history
├── POST /from-order/{order_id}/  # Create from order
└── POST /{id}/credit-note/       # Create credit note

/api/v1/invoices/reports/
├── GET /aging/                   # Aging report
└── GET /summary/                 # Financial summary
```

### Invoice Filtering Options
```
GET /invoices/?status=ISSUED&type=STANDARD
GET /invoices/?customer=uuid
GET /invoices/?issue_date_from=2026-01-01&issue_date_to=2026-01-31
GET /invoices/?due_date_from=2026-01-01&due_date_to=2026-02-28
GET /invoices/?overdue=true
GET /invoices/?order=uuid
```

### Aging Report Response
```json
{
  "summary": {
    "total_outstanding": 500000,
    "current": 200000,
    "30_days": 150000,
    "60_days": 100000,
    "90_days_plus": 50000
  },
  "by_customer": [
    {
      "customer_id": "uuid",
      "customer_name": "ABC Company",
      "current": 50000,
      "30_days": 30000,
      "60_days": 0,
      "90_days_plus": 0,
      "total": 80000
    }
  ]
}
```

### Test Categories
- Model unit tests (Invoice, LineItem, Template)
- Service tests (InvoiceService, PDFGenerator, EmailService)
- API tests (all endpoints, permissions, filtering)
- Integration tests (order-to-invoice, email sending)
- PDF generation tests (template rendering)
- Tax calculation tests (VAT, SVAT)

### Documentation Sections
- **Overview**: Module purpose, Sri Lanka compliance
- **Models**: All model diagrams and fields
- **Invoice Types**: Standard, SVAT, Credit/Debit notes
- **Status Lifecycle**: State machine diagrams
- **Tax Compliance**: VAT/SVAT calculation rules
- **API Reference**: Endpoint documentation
- **PDF Customization**: Template configuration
- **Email Setup**: SMTP configuration, templates

### Sri Lanka Compliance Documentation
- BRN (Business Registration Number) requirements
- VAT registration requirements
- SVAT eligibility and rules
- Invoice numbering requirements
- Required invoice fields
- Tax calculation rules
- Record retention requirements
