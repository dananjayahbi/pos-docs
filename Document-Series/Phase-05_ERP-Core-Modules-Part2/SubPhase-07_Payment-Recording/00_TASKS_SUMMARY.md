# SubPhase 07: Payment Recording - Tasks Summary

> **Phase:** 05 - ERP Core Modules Part 2  
> **SubPhase Index:** 07 of 12  
> **SubPhase Goal:** Track all payment transactions including full, partial, split payments, and refunds  
> **Total Tasks:** 86 | **Status:** Planning  
> **Estimated Duration:** 12-14 hours

---

## Navigation

- **↑ Parent:** [00_SUBPHASES_SUMMARY.md](../00_SUBPHASES_SUMMARY.md)
- **← Previous SubPhase:** [SubPhase-06_Invoice-System](../SubPhase-06_Invoice-System/)
- **→ Next SubPhase:** [SubPhase-08_Customer-Module](../SubPhase-08_Customer-Module/)

---

## SubPhase Overview

This sub-phase implements comprehensive payment recording and tracking for all financial transactions. Supports multiple payment methods popular in Sri Lanka, partial payments, split payments across methods, payment plans, refund processing, and payment receipts. Integrates with invoices, orders, and customer accounts.

### Key Outcomes
- Payment model supporting multiple payment methods
- Record full, partial, and split payments
- Payment method configuration per tenant
- Refund processing with reason tracking
- Payment receipt generation
- Payment allocation to invoices
- Outstanding balance tracking
- Payment plan/installment support
- Payment dashboard with reconciliation

### Technology Context
- **Backend:** Django 5.x with DRF for API
- **Payment Methods:** Cash, Card, Bank Transfer, Mobile (FriMi, etc.), Check, Store Credit
- **Frontend:** Next.js 14+ with TypeScript
- **Receipt Number Format:** `PAY-{YEAR}-{SEQUENCE}`

### Dependencies
- Phase-05 SubPhase-05: Order Management (for order payments)
- Phase-05 SubPhase-06: Invoice System (for invoice payments)
- Phase-05 SubPhase-08: Customer Module (for customer balance)

---

## Task Execution Order

```
TASK GROUP A: Payment Model & Methods (Tasks 01-18)
        │
        ▼
TASK GROUP B: Payment Recording Services (Tasks 19-36)
        │
        ▼
TASK GROUP C: Partial & Split Payments (Tasks 37-50)
        │
        ▼
TASK GROUP D: Refunds & Adjustments (Tasks 51-64)
        │
        ▼
TASK GROUP E: Payment Receipts & Notifications (Tasks 65-76)
        │
        ▼
TASK GROUP F: Payment API, Testing & Documentation (Tasks 77-86)
```

---

## Task Index

### Group A: Payment Model & Methods (Tasks 01-18)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 01 | **Create payments Django App** | Create new Django app for payments module with proper structure | None | 🔴 Not Created |
| 02 | **Register payments App** | Add payments app to TENANT_APPS in Django settings | Task 01 | 🔴 Not Created |
| 03 | **Define PaymentMethod Choices** | Create enum: CASH, CARD, BANK_TRANSFER, MOBILE, CHECK, STORE_CREDIT | Task 01 | 🔴 Not Created |
| 04 | **Define PaymentStatus Choices** | Create enum: PENDING, COMPLETED, FAILED, CANCELLED, REFUNDED | Task 01 | 🔴 Not Created |
| 05 | **Create Payment Model Core Fields** | Define Payment with payment_number, method, status, amount, created_at | Task 04 | 🔴 Not Created |
| 06 | **Add Payment Reference Fields** | Add invoice FK, order FK, customer FK for payment context | Task 05 | 🔴 Not Created |
| 07 | **Add Payment Date Fields** | Add payment_date, processed_at, cancelled_at | Task 05 | 🔴 Not Created |
| 08 | **Add Payment Currency Fields** | Add currency (default LKR), exchange_rate, amount_in_base_currency | Task 05 | 🔴 Not Created |
| 09 | **Add Payment Method Details** | Add method_details JSONField for card last 4, bank name, etc. | Task 05 | 🔴 Not Created |
| 10 | **Add Payment Reference Number** | Add reference_number for bank transfer, check number, etc. | Task 05 | 🔴 Not Created |
| 11 | **Add Payment User Fields** | Add received_by, approved_by ForeignKeys to User | Task 05 | 🔴 Not Created |
| 12 | **Add Payment Notes Fields** | Add notes, internal_notes for payment details | Task 05 | 🔴 Not Created |
| 13 | **Create Payment Number Generator** | Auto-generate payment numbers with yearly sequence | Task 05 | 🔴 Not Created |
| 14 | **Create PaymentMethod Configuration Model** | Model for configuring available payment methods per tenant | Task 05 | 🔴 Not Created |
| 15 | **Add Payment Method Settings** | Enable/disable methods, set limits, add processing fees | Task 14 | 🔴 Not Created |
| 16 | **Create Payment Model Indexes** | Add indexes for status, method, customer, payment_date | Task 05 | 🔴 Not Created |
| 17 | **Create Payment Model Constraints** | Add validation for amount > 0, valid method for tenant | Task 05 | 🔴 Not Created |
| 18 | **Run Initial Payment Migrations** | Generate and apply migrations for Payment model | Task 17 | 🔴 Not Created |

---

### Group B: Payment Recording Services (Tasks 19-36)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 19 | **Create PaymentService Class** | Main service class for payment business operations | Task 18 | 🔴 Not Created |
| 20 | **Implement Cash Payment Recording** | Record cash payment with amount tendered, change | Task 19 | 🔴 Not Created |
| 21 | **Implement Card Payment Recording** | Record card payment with card type, last 4 digits | Task 19 | 🔴 Not Created |
| 22 | **Implement Bank Transfer Recording** | Record bank transfer with bank name, reference | Task 19 | 🔴 Not Created |
| 23 | **Implement Mobile Payment Recording** | Record mobile payment (FriMi, etc.) with transaction ID | Task 19 | 🔴 Not Created |
| 24 | **Implement Check Payment Recording** | Record check with check number, bank, dated check handling | Task 19 | 🔴 Not Created |
| 25 | **Implement Store Credit Payment** | Record store credit usage, deduct from customer balance | Task 19 | 🔴 Not Created |
| 26 | **Implement Payment Validation** | Validate payment amount, method availability, limits | Task 19 | 🔴 Not Created |
| 27 | **Implement Invoice Payment Allocation** | Allocate payment to invoice, update balance due | Task 19 | 🔴 Not Created |
| 28 | **Implement Order Payment Recording** | Record payment against order, update payment status | Task 19 | 🔴 Not Created |
| 29 | **Implement Payment Status Updates** | Update payment status: complete, fail, cancel | Task 19 | 🔴 Not Created |
| 30 | **Create PaymentAllocation Model** | Model to track payment allocation across invoices | Task 18 | 🔴 Not Created |
| 31 | **Implement Multi-Invoice Payment** | Allocate single payment to multiple invoices | Task 30 | 🔴 Not Created |
| 32 | **Create PaymentHistory Model** | Model to track payment changes and events | Task 18 | 🔴 Not Created |
| 33 | **Implement History Logging** | Log all payment actions with user, timestamp | Task 32 | 🔴 Not Created |
| 34 | **Create PaymentSettings Model** | Tenant settings for payment methods, defaults | Task 18 | 🔴 Not Created |
| 35 | **Implement Processing Fee Calculator** | Calculate processing fees for card, mobile payments | Task 34 | 🔴 Not Created |
| 36 | **Run Payment Service Migrations** | Generate migrations for Allocation, History, Settings | Task 35 | 🔴 Not Created |

---

### Group C: Partial & Split Payments (Tasks 37-50)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 37 | **Implement Partial Payment** | Record payment less than invoice total | Task 36 | 🔴 Not Created |
| 38 | **Implement Balance Calculation** | Calculate remaining balance after partial payment | Task 37 | 🔴 Not Created |
| 39 | **Update Invoice Payment Status** | Mark invoice as PARTIAL when partially paid | Task 37 | 🔴 Not Created |
| 40 | **Create SplitPayment Model** | Model for recording split payment transactions | Task 36 | 🔴 Not Created |
| 41 | **Add Split Payment Components** | Link multiple Payment records to single transaction | Task 40 | 🔴 Not Created |
| 42 | **Implement Split Payment Recording** | Record payment with multiple methods (e.g., cash + card) | Task 41 | 🔴 Not Created |
| 43 | **Validate Split Payment Totals** | Ensure split components equal total amount | Task 42 | 🔴 Not Created |
| 44 | **Create PaymentPlan Model** | Model for installment payment plans | Task 36 | 🔴 Not Created |
| 45 | **Add Payment Plan Schedule** | Define installment dates and amounts | Task 44 | 🔴 Not Created |
| 46 | **Implement Payment Plan Creation** | Create payment plan for invoice | Task 45 | 🔴 Not Created |
| 47 | **Implement Installment Payment** | Record payment against specific installment | Task 46 | 🔴 Not Created |
| 48 | **Implement Payment Plan Tracking** | Track paid/pending installments | Task 47 | 🔴 Not Created |
| 49 | **Create Payment Plan Reminder Task** | Celery task for upcoming installment reminders | Task 48 | 🔴 Not Created |
| 50 | **Run Partial/Split Payment Migrations** | Generate migrations for SplitPayment, PaymentPlan | Task 49 | 🔴 Not Created |

---

### Group D: Refunds & Adjustments (Tasks 51-64)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 51 | **Define RefundReason Choices** | Enum: RETURN, OVERCHARGE, CANCELLED, DUPLICATE, OTHER | Task 50 | 🔴 Not Created |
| 52 | **Create Refund Model** | Model for refund transactions linked to original payment | Task 51 | 🔴 Not Created |
| 53 | **Add Refund Amount Fields** | Add amount, original_payment FK, reason | Task 52 | 🔴 Not Created |
| 54 | **Add Refund Method Fields** | Add refund_method (original method, store credit, cash) | Task 52 | 🔴 Not Created |
| 55 | **Add Refund Status Fields** | Add status: PENDING, APPROVED, PROCESSED, REJECTED | Task 52 | 🔴 Not Created |
| 56 | **Add Refund Approval Fields** | Add requested_by, approved_by, approval_notes | Task 52 | 🔴 Not Created |
| 57 | **Run Refund Model Migrations** | Generate and apply migrations for Refund model | Task 56 | 🔴 Not Created |
| 58 | **Create RefundService Class** | Service for handling refund workflow | Task 57 | 🔴 Not Created |
| 59 | **Implement Refund Request** | Create refund request with reason | Task 58 | 🔴 Not Created |
| 60 | **Implement Refund Approval** | Approve/reject refund request | Task 59 | 🔴 Not Created |
| 61 | **Implement Refund Processing** | Process approved refund, update balances | Task 60 | 🔴 Not Created |
| 62 | **Implement Store Credit Refund** | Issue store credit instead of cash refund | Task 61 | 🔴 Not Created |
| 63 | **Update Invoice on Refund** | Adjust invoice balance after refund | Task 61 | 🔴 Not Created |
| 64 | **Implement Refund Limits** | Validate refund doesn't exceed original payment | Task 61 | 🔴 Not Created |

---

### Group E: Payment Receipts & Notifications (Tasks 65-76)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 65 | **Create PaymentReceipt Model** | Model for payment receipt records | Task 64 | 🔴 Not Created |
| 66 | **Add Receipt Number Generator** | Generate receipt numbers: REC-{YEAR}-{SEQUENCE} | Task 65 | 🔴 Not Created |
| 67 | **Add Receipt PDF Storage** | FileField for generated receipt PDF | Task 65 | 🔴 Not Created |
| 68 | **Run Receipt Model Migrations** | Generate and apply migrations for PaymentReceipt | Task 67 | 🔴 Not Created |
| 69 | **Create ReceiptPDFGenerator Service** | Service for generating payment receipt PDFs | Task 68 | 🔴 Not Created |
| 70 | **Implement Receipt Header Section** | Business info, receipt number, date | Task 69 | 🔴 Not Created |
| 71 | **Implement Receipt Payment Details** | Payment method, amount, reference | Task 69 | 🔴 Not Created |
| 72 | **Implement Receipt Invoice Link** | Show which invoice(s) payment applies to | Task 69 | 🔴 Not Created |
| 73 | **Implement Receipt Footer** | Thank you message, contact info | Task 69 | 🔴 Not Created |
| 74 | **Create PaymentEmailService** | Service for sending payment confirmations | Task 68 | 🔴 Not Created |
| 75 | **Create Payment Email Templates** | Templates for payment received, refund processed | Task 74 | 🔴 Not Created |
| 76 | **Create Payment Celery Tasks** | Async tasks for receipt generation, email | Task 75 | 🔴 Not Created |

---

### Group F: Payment API, Testing & Documentation (Tasks 77-86)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 77 | **Create PaymentSerializer** | DRF serializer for Payment with method details | Task 76 | 🔴 Not Created |
| 78 | **Create RefundSerializer** | DRF serializer for Refund with validation | Task 77 | 🔴 Not Created |
| 79 | **Create PaymentListSerializer** | Lightweight serializer for list view | Task 77 | 🔴 Not Created |
| 80 | **Create PaymentViewSet** | ViewSet with CRUD, record_payment, refund actions | Task 79 | 🔴 Not Created |
| 81 | **Implement Payment Filtering** | Filter by method, status, date range, customer | Task 80 | 🔴 Not Created |
| 82 | **Add Payment Actions** | Custom actions: record, allocate, refund | Task 80 | 🔴 Not Created |
| 83 | **Create Payment Reports Endpoint** | API for payment summary, reconciliation reports | Task 80 | 🔴 Not Created |
| 84 | **Register Payment API URLs** | Add all payment endpoints to URL configuration | Task 83 | 🔴 Not Created |
| 85 | **Create Payment Module Tests** | Unit and integration tests for models, services, API | Task 84 | 🔴 Not Created |
| 86 | **Create Payment Module Documentation** | API documentation, payment flow guide | Task 85 | 🔴 Not Created |

---

## Expected File Structure

```
backend/apps/payments/
├── __init__.py
├── admin.py                    # Admin for Payment, Refund, PaymentPlan
├── apps.py                     # App configuration
├── models/
│   ├── __init__.py
│   ├── payment.py             # Payment model with method handling
│   ├── payment_allocation.py  # PaymentAllocation for multi-invoice
│   ├── split_payment.py       # SplitPayment for multi-method
│   ├── payment_plan.py        # PaymentPlan for installments
│   ├── refund.py              # Refund model with workflow
│   ├── payment_receipt.py     # PaymentReceipt model
│   ├── payment_method.py      # PaymentMethod configuration
│   ├── payment_history.py     # PaymentHistory for audit
│   └── payment_settings.py    # PaymentSettings for tenant config
├── services/
│   ├── __init__.py
│   ├── payment_service.py     # Main payment business logic
│   ├── refund_service.py      # Refund workflow service
│   ├── allocation_service.py  # Payment allocation service
│   ├── receipt_generator.py   # Receipt PDF generation
│   └── email_service.py       # Payment email service
├── serializers/
│   ├── __init__.py
│   ├── payment_serializer.py  # Full payment serializer
│   ├── refund_serializer.py
│   └── plan_serializer.py
├── views/
│   ├── __init__.py
│   ├── payment_viewset.py     # Payment CRUD ViewSet
│   ├── refund_viewset.py      # Refund ViewSet
│   └── report_views.py        # Payment reports
├── tasks/
│   ├── __init__.py
│   ├── receipt_tasks.py       # Async receipt generation
│   ├── email_tasks.py         # Payment email tasks
│   └── reminder_tasks.py      # Payment plan reminders
├── filters.py                  # Payment filtering
├── urls.py                     # URL routing
├── signals.py                  # Payment signals
├── permissions.py              # Payment-specific permissions
├── templates/
│   └── emails/
│       ├── payment_received.html
│       └── refund_processed.html
├── tests/
│   ├── __init__.py
│   ├── test_models.py
│   ├── test_services.py
│   ├── test_refunds.py
│   └── test_api.py
└── migrations/
```

---

## Payment Methods

| Method | Code | Details Captured | Sri Lanka Popular |
|--------|------|------------------|-------------------|
| **Cash** | CASH | Amount tendered, change | ✅ Primary |
| **Card (Visa/Master)** | CARD | Card type, last 4, approval code | ✅ Common |
| **Bank Transfer** | BANK_TRANSFER | Bank name, reference number | ✅ Common |
| **Mobile Payment** | MOBILE | Provider (FriMi, etc.), transaction ID | ✅ Growing |
| **Check** | CHECK | Check number, bank, date | ✅ Business |
| **Store Credit** | STORE_CREDIT | Balance before, after | ✅ Loyalty |

---

## Payment Status Flow

```
                    ┌───────────────┐
                    │    PENDING    │ ← Payment initiated
                    └───────┬───────┘
                            │ process()
                            ▼
          ┌─────────────────┼─────────────────┐
          │                                   │
          ▼                                   ▼
  ┌───────────────┐                   ┌───────────────┐
  │   COMPLETED   │                   │    FAILED     │
  └───────┬───────┘                   └───────────────┘
          │ refund()
          ▼
  ┌───────────────┐
  │   REFUNDED    │ (Full or partial)
  └───────────────┘

  CANCELLATION:
  ┌───────────────┐
  │   CANCELLED   │ ← Before processing
  └───────────────┘
```

---

## Refund Status Flow

```
                    ┌───────────────┐
                    │    PENDING    │ ← Refund requested
                    └───────┬───────┘
                            │
          ┌─────────────────┼─────────────────┐
          │                                   │
          ▼                                   ▼
  ┌───────────────┐                   ┌───────────────┐
  │   APPROVED    │                   │   REJECTED    │
  └───────┬───────┘                   └───────────────┘
          │ process()
          ▼
  ┌───────────────┐
  │   PROCESSED   │ ← Refund completed
  └───────────────┘
```

---

## Payment Number Formats

```
Payment:  PAY-{YEAR}-{SEQUENCE}
Receipt:  REC-{YEAR}-{SEQUENCE}
Refund:   REF-{YEAR}-{SEQUENCE}

Examples:
- PAY-2026-00001  (First payment of 2026)
- REC-2026-00150  (150th receipt of 2026)
- REF-2026-00025  (25th refund of 2026)

Sequence resets annually per type.
```

---

## Split Payment Example

```
Invoice Total: Rs. 10,000.00

Split Payment:
├── Cash:        Rs. 5,000.00
├── Card (Visa): Rs. 3,000.00
└── Store Credit: Rs. 2,000.00
    ─────────────────────────
    Total:       Rs. 10,000.00 ✓
```

---

## Payment Plan Example

```
Invoice Total: Rs. 30,000.00
Plan: 3 installments

Installment Schedule:
├── Installment 1: Rs. 10,000.00 - Due: 2026-02-01 - PAID
├── Installment 2: Rs. 10,000.00 - Due: 2026-03-01 - PENDING
└── Installment 3: Rs. 10,000.00 - Due: 2026-04-01 - PENDING
```

---

## Key Business Rules

1. **Amount Validation:** Payment amount must be positive
2. **Method Availability:** Only tenant-enabled methods can be used
3. **Split Balance:** Split components must equal total amount
4. **Refund Limit:** Cannot refund more than original payment
5. **Invoice Update:** Invoice status updated on payment (PAID, PARTIAL)
6. **Check Handling:** Track check clearance status
7. **Store Credit:** Deduct from customer balance on use
8. **Processing Fees:** Optionally add fees for card/mobile payments

---

## Sri Lanka Specific Considerations

- **Currency:** Default LKR, format as "Rs. 1,234.56"
- **Popular Methods:** Cash dominant, mobile payments growing (FriMi, Genie)
- **Bank Transfers:** CEFT, SLIPS common for B2B
- **Checks:** Still used for larger business payments
- **Store Credit:** Common in local retail

---

## Progress Tracking

| Metric | Count |
|--------|-------|
| Total Tasks | 86 |
| Tasks Completed | 0 |
| Tasks In Progress | 0 |
| Completion Percentage | 0% |

**Last Updated:** 2026-01-17  
**Next Action:** Create Task 01 (payments Django App)

---

## Notes for AI Agents

- Use database transactions for payment recording and balance updates
- Implement idempotency for payment operations (prevent double charging)
- Payment receipts should be generated immediately after completion
- Consider PCI compliance for card payment details (don't store full card)
- Track payment timing for cash flow analysis
- Implement overpayment handling (apply to future invoices or refund)
- SMS notifications popular in Sri Lanka for payment confirmations
- Support back-dated payments for reconciliation scenarios

---

*End of SubPhase 07 Tasks Summary*
