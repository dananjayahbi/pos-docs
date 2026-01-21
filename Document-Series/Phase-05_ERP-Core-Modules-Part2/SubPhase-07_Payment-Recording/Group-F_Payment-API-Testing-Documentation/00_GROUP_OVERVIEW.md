# Group F: Payment API, Testing & Documentation

> **Phase:** 05 - ERP Core Modules Part 2  
> **SubPhase:** 07 - Payment Recording  
> **Group:** F of F  
> **Tasks Covered:** 77-86  
> **Group Goal:** Create API endpoints, tests, and documentation

---

## Navigation

- **↑ Parent:** [SubPhase-07 Summary](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [Group E: Payment Receipts & Notifications](../Group-E_Payment-Receipts-Notifications/)

---

## Group Overview

### Key Outcomes

1. **PaymentSerializer** - DRF serializer with method details
2. **RefundSerializer** - Serializer with validation
3. **PaymentListSerializer** - Lightweight list serializer
4. **PaymentViewSet** - ViewSet with CRUD and custom actions
5. **Payment Filtering** - Filter by method, status, date, customer
6. **Payment Actions** - record, allocate, refund actions
7. **Payment Reports Endpoint** - Summary, reconciliation reports
8. **API URL Registration** - Register all endpoints
9. **Payment Module Tests** - Unit and integration tests
10. **Payment Module Documentation** - API docs, payment flow guide

### Technology Context

| Technology | Purpose |
|------------|---------|
| Django REST Framework | API serializers and viewsets |
| django-filter | Payment filtering |
| pytest | Testing framework |
| MkDocs | Documentation generation |

---

## Documents in This Group

| # | Document | Tasks | Description |
|---|----------|-------|-------------|
| 01 | `01_Tasks-77-83_Serializers-ViewSet-Reports.md` | 77-83 | Serializers, PaymentViewSet, filtering, actions, reports |
| 02 | `02_Tasks-84-86_URLs-Tests-Documentation.md` | 84-86 | URL registration, tests, documentation |

---

## Task Summary

| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 77 | Create PaymentSerializer | Medium | 25 min |
| 78 | Create RefundSerializer | Medium | 25 min |
| 79 | Create PaymentListSerializer | Low | 20 min |
| 80 | Create PaymentViewSet | High | 30 min |
| 81 | Implement Payment Filtering | Medium | 25 min |
| 82 | Add Payment Actions | High | 30 min |
| 83 | Create Payment Reports Endpoint | Medium | 30 min |
| 84 | Register Payment API URLs | Low | 20 min |
| 85 | Create Payment Module Tests | High | 45 min |
| 86 | Create Payment Module Documentation | Medium | 40 min |

---

## Execution Order

```
[Tasks 77-79: Serializers]
         │
         ▼
[Tasks 80-83: ViewSet, filtering, actions, reports]
         │
         ▼
[Tasks 84-86: URLs, tests, documentation]
```

---

## Expected Deliverables

```
apps/payments/
├── serializers/
│   ├── __init__.py
│   ├── payment_serializer.py     # Tasks 77, 79
│   └── refund_serializer.py      # Task 78
├── views/
│   ├── __init__.py
│   ├── payment_viewset.py        # Tasks 80-82
│   ├── refund_viewset.py
│   └── report_views.py           # Task 83
├── filters.py                    # Task 81
├── urls.py                       # Task 84
├── tests/
│   ├── __init__.py
│   ├── test_models.py
│   ├── test_services.py
│   ├── test_refunds.py
│   └── test_api.py               # Task 85
└── docs/
    └── README.md                 # Task 86

docs/
└── modules/
    └── payments/
        ├── index.md              # Task 86
        ├── models.md
        ├── api.md
        ├── refunds.md
        └── reports.md
```

---

## Notes for AI Agents

### API Endpoints
```
/api/v1/payments/
├── GET /                         # List payments
├── POST /                        # Record payment
├── GET /{id}/                    # Get payment detail
├── DELETE /{id}/                 # Delete (pending only)
├── POST /{id}/complete/          # Complete payment
├── POST /{id}/cancel/            # Cancel payment
├── GET /{id}/receipt/            # Download receipt PDF
├── POST /record-cash/            # Record cash payment
├── POST /record-card/            # Record card payment
├── POST /record-transfer/        # Record bank transfer
├── POST /record-mobile/          # Record mobile payment
├── POST /record-split/           # Record split payment

/api/v1/payments/refunds/
├── GET /                         # List refunds
├── POST /                        # Create refund request
├── GET /{id}/                    # Get refund detail
├── POST /{id}/approve/           # Approve refund
├── POST /{id}/reject/            # Reject refund
├── POST /{id}/process/           # Process refund

/api/v1/payments/plans/
├── GET /                         # List payment plans
├── POST /                        # Create payment plan
├── GET /{id}/                    # Get plan detail
├── POST /{id}/installments/{num}/pay/  # Pay installment

/api/v1/payments/reports/
├── GET /summary/                 # Payment summary
├── GET /by-method/               # Payments by method
├── GET /reconciliation/          # Reconciliation report
```

### Payment Filtering Options
```
GET /payments/?method=CASH&status=COMPLETED
GET /payments/?customer=uuid
GET /payments/?invoice=uuid
GET /payments/?date_from=2026-01-01&date_to=2026-01-31
GET /payments/?amount_min=1000&amount_max=10000
```

### Payment Reports Response
```json
{
  "summary": {
    "total_collected": 1500000,
    "total_refunded": 50000,
    "net_collected": 1450000,
    "payment_count": 250
  },
  "by_method": [
    {"method": "CASH", "amount": 800000, "count": 150},
    {"method": "CARD", "amount": 500000, "count": 80},
    {"method": "MOBILE", "amount": 200000, "count": 20}
  ],
  "by_status": [
    {"status": "COMPLETED", "amount": 1400000, "count": 240},
    {"status": "PENDING", "amount": 100000, "count": 10}
  ]
}
```

### Test Categories
- Model unit tests (Payment, Refund, PaymentPlan, SplitPayment)
- Service tests (PaymentService, RefundService, AllocationService)
- API tests (all endpoints, permissions, filtering)
- Integration tests (payment → invoice update → receipt)
- Split payment tests (validation, components)
- Payment plan tests (installments, reminders)

### Documentation Sections
- **Overview**: Module purpose, payment methods
- **Models**: All model diagrams and fields
- **Payment Methods**: Sri Lanka specific methods
- **Recording Payments**: Step-by-step flows
- **Refund Processing**: Refund workflow guide
- **Split Payments**: Multi-method payments
- **Payment Plans**: Installment setup
- **API Reference**: Endpoint documentation
- **Reports**: Available reports and usage

### Reconciliation Report
- Date range selection
- Expected vs actual by method
- Outstanding payments
- Failed payment details
- Unallocated payments
