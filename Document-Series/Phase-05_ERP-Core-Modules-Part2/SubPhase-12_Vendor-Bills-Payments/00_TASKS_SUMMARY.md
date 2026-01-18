# SubPhase 12: Vendor Bills & Payments - Tasks Summary

> **Phase:** 05 - ERP Core Modules Part 2  
> **SubPhase Index:** 12 of 12  
> **SubPhase Goal:** Track vendor bills, match with purchase orders, and record payments  
> **Total Tasks:** 90 | **Status:** Planning  
> **Estimated Duration:** 14-16 hours

---

## Navigation

- **↑ Parent:** [00_SUBPHASES_SUMMARY.md](../00_SUBPHASES_SUMMARY.md)
- **← Previous SubPhase:** [SubPhase-11_Purchase-Orders](../SubPhase-11_Purchase-Orders/)
- **→ Next Phase:** [Phase-06_ERP-Advanced-Modules](../../Phase-06_ERP-Advanced-Modules/)

---

## SubPhase Overview

This sub-phase implements vendor bill management and payment tracking to complete the procure-to-pay cycle. Supports creating bills from purchase orders, manual bill entry, 3-way matching (PO → GRN → Bill), payment scheduling, and vendor statement generation.

### Key Outcomes
- Vendor Bill model with complete lifecycle
- Bill creation from PO with auto-fill
- Manual bill entry for non-PO purchases
- 3-way matching: PO → GRN → Bill
- Payment scheduling with reminders
- Multiple payment methods support
- Partial and full payment recording
- Vendor statement generation
- Bill aging report
- Payment history tracking

### Technology Context
- **Backend:** Django 5.x with DRF for API
- **Payments:** Bank transfer, check, online payment
- **PDF Generation:** Vendor statement PDF
- **Frontend:** Next.js 14+ with TypeScript
- **Bill Number Format:** `BILL-{YEAR}-{SEQUENCE}` (e.g., BILL-2026-00001)

### Dependencies
- Phase-05 SubPhase-10: Vendor Module (vendor data)
- Phase-05 SubPhase-11: Purchase Orders (PO and GRN data)

---

## Task Execution Order

```
TASK GROUP A: Vendor Bill Model & Core (Tasks 01-16)
        │
        ▼
TASK GROUP B: Bill Line Items & Matching (Tasks 17-32)
        │
        ▼
TASK GROUP C: Bill Services & Processing (Tasks 33-48)
        │
        ▼
TASK GROUP D: Payment Recording & Scheduling (Tasks 49-66)
        │
        ▼
TASK GROUP E: Statements, Reports & Aging (Tasks 67-80)
        │
        ▼
TASK GROUP F: API, Testing & Documentation (Tasks 81-90)
```

---

## Task Index

### Group A: Vendor Bill Model & Core (Tasks 01-16)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 01 | **Create vendor_bills Django App** | Create new Django app for vendor bills | None | 🔴 Not Created |
| 02 | **Register vendor_bills App** | Add vendor_bills app to TENANT_APPS | Task 01 | 🔴 Not Created |
| 03 | **Define BillStatus Choices** | Create enum: DRAFT, PENDING, APPROVED, PARTIAL_PAID, PAID, CANCELLED, DISPUTED | Task 01 | 🔴 Not Created |
| 04 | **Create VendorBill Model Core** | Define bill with bill_number, status, created_at, updated_at | Task 03 | 🔴 Not Created |
| 05 | **Add Bill Vendor Fields** | Add vendor FK, vendor_invoice_number (vendor's reference) | Task 04 | 🔴 Not Created |
| 06 | **Add Bill PO Reference** | Add purchase_order FK (optional for manual bills) | Task 04 | 🔴 Not Created |
| 07 | **Add Bill Date Fields** | Add bill_date, received_date, due_date | Task 04 | 🔴 Not Created |
| 08 | **Add Bill Financial Fields** | Add subtotal, tax_amount, discount_amount, total, currency | Task 04 | 🔴 Not Created |
| 09 | **Add Bill Payment Fields** | Add amount_paid, amount_due, payment_terms | Task 04 | 🔴 Not Created |
| 10 | **Add Bill User Fields** | Add created_by, approved_by, ForeignKeys | Task 04 | 🔴 Not Created |
| 11 | **Add Bill Notes Fields** | Add notes, internal_notes, dispute_reason | Task 04 | 🔴 Not Created |
| 12 | **Add Bill Document Fields** | Add attachment FileField for vendor invoice scan | Task 04 | 🔴 Not Created |
| 13 | **Add Bill Matching Fields** | Add is_matched, matched_at, matching_variance | Task 04 | 🔴 Not Created |
| 14 | **Create Bill Number Generator** | Auto-generate bill numbers: BILL-{YEAR}-{SEQUENCE} | Task 04 | 🔴 Not Created |
| 15 | **Create Bill Model Indexes** | Add indexes for status, vendor, bill_number, due_date | Task 04 | 🔴 Not Created |
| 16 | **Run Initial Bill Migrations** | Generate and apply migrations for VendorBill | Task 15 | 🔴 Not Created |

---

### Group B: Bill Line Items & Matching (Tasks 17-32)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 17 | **Create BillLineItem Model** | Define line item model with FK to VendorBill | Task 16 | 🔴 Not Created |
| 18 | **Add Line Item Product Fields** | Add product FK, variant FK, vendor_sku | Task 17 | 🔴 Not Created |
| 19 | **Add Line Item Description** | Add item_description for non-product items | Task 17 | 🔴 Not Created |
| 20 | **Add Line Item Quantity Fields** | Add quantity, quantity_ordered (from PO), quantity_received (from GRN) | Task 17 | 🔴 Not Created |
| 21 | **Add Line Item Pricing Fields** | Add unit_price, billed_price, tax_rate | Task 17 | 🔴 Not Created |
| 22 | **Add Line Item Total Field** | Add line_total computed field | Task 17 | 🔴 Not Created |
| 23 | **Add Line Item PO Reference** | Add po_line FK for matching | Task 17 | 🔴 Not Created |
| 24 | **Add Line Item GRN Reference** | Add grn_line FK for matching | Task 17 | 🔴 Not Created |
| 25 | **Run BillLineItem Migrations** | Generate and apply migrations | Task 24 | 🔴 Not Created |
| 26 | **Create MatchingService Class** | Service for 3-way matching logic | Task 25 | 🔴 Not Created |
| 27 | **Implement PO-to-Bill Matching** | Match bill lines to PO lines | Task 26 | 🔴 Not Created |
| 28 | **Implement GRN-to-Bill Matching** | Match bill lines to GRN received | Task 26 | 🔴 Not Created |
| 29 | **Implement 3-Way Match Validation** | Validate PO qty = GRN qty = Bill qty | Task 28 | 🔴 Not Created |
| 30 | **Create Match Variance Handler** | Handle variances with tolerance threshold | Task 29 | 🔴 Not Created |
| 31 | **Create MatchingResult Model** | Store matching results, variances, status | Task 30 | 🔴 Not Created |
| 32 | **Run MatchingResult Migrations** | Generate and apply migrations | Task 31 | 🔴 Not Created |

---

### Group C: Bill Services & Processing (Tasks 33-48)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 33 | **Create BillService Class** | Main service for bill business operations | Task 32 | 🔴 Not Created |
| 34 | **Implement Create Bill from PO** | Auto-create bill from completed PO with GRN | Task 33 | 🔴 Not Created |
| 35 | **Implement Auto-Fill from PO** | Auto-fill line items from PO/GRN data | Task 34 | 🔴 Not Created |
| 36 | **Implement Manual Bill Creation** | Create bill without PO reference | Task 33 | 🔴 Not Created |
| 37 | **Implement Bill Editing** | Edit bill in DRAFT or PENDING status | Task 33 | 🔴 Not Created |
| 38 | **Implement Bill Status Transitions** | Methods for submit(), approve(), dispute(), cancel() | Task 33 | 🔴 Not Created |
| 39 | **Add Status Transition Validation** | Validate allowed status transitions | Task 38 | 🔴 Not Created |
| 40 | **Implement Bill Approval Workflow** | Optional approval before payment | Task 33 | 🔴 Not Created |
| 41 | **Create BillHistory Model** | Model for tracking bill changes | Task 33 | 🔴 Not Created |
| 42 | **Implement History Logging** | Log all bill actions with user, timestamp | Task 41 | 🔴 Not Created |
| 43 | **Create BillSettings Model** | Tenant settings for numbering, approval threshold | Task 33 | 🔴 Not Created |
| 44 | **Implement Approval Threshold** | Require approval for bills above threshold | Task 43 | 🔴 Not Created |
| 45 | **Run Bill Service Migrations** | Generate migrations for BillHistory, BillSettings | Task 44 | 🔴 Not Created |
| 46 | **Implement Bill Duplication** | Duplicate bill for recurring purchases | Task 33 | 🔴 Not Created |
| 47 | **Implement Bill Dispute Workflow** | Mark as disputed, track resolution | Task 33 | 🔴 Not Created |
| 48 | **Implement Bill Calculation Service** | Calculate subtotal, tax, total | Task 33 | 🔴 Not Created |

---

### Group D: Payment Recording & Scheduling (Tasks 49-66)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 49 | **Create VendorPayment Model** | Model for vendor payment records | Task 48 | 🔴 Not Created |
| 50 | **Add Payment Core Fields** | Add payment_number, amount, payment_date | Task 49 | 🔴 Not Created |
| 51 | **Add Payment Method Fields** | Add payment_method: BANK_TRANSFER, CHECK, CASH, ONLINE | Task 49 | 🔴 Not Created |
| 52 | **Add Payment Reference Fields** | Add reference_number, check_number, transaction_id | Task 49 | 🔴 Not Created |
| 53 | **Add Payment Bill FK** | Add vendor_bill FK for linked payment | Task 49 | 🔴 Not Created |
| 54 | **Add Payment Vendor FK** | Add vendor FK for advance payments | Task 49 | 🔴 Not Created |
| 55 | **Add Payment Bank Fields** | Add bank_account, from_account, to_account | Task 49 | 🔴 Not Created |
| 56 | **Add Payment Status Field** | Add status: PENDING, COMPLETED, FAILED, REVERSED | Task 49 | 🔴 Not Created |
| 57 | **Create Payment Number Generator** | Auto-generate: PAY-{YEAR}-{SEQUENCE} | Task 49 | 🔴 Not Created |
| 58 | **Run VendorPayment Migrations** | Generate and apply migrations | Task 57 | 🔴 Not Created |
| 59 | **Create PaymentService Class** | Service for payment operations | Task 58 | 🔴 Not Created |
| 60 | **Implement Full Payment** | Record full payment, mark bill PAID | Task 59 | 🔴 Not Created |
| 61 | **Implement Partial Payment** | Record partial, update amount_paid, amount_due | Task 59 | 🔴 Not Created |
| 62 | **Implement Multi-Bill Payment** | Single payment for multiple bills | Task 59 | 🔴 Not Created |
| 63 | **Implement Advance Payment** | Payment before bill (vendor credit) | Task 59 | 🔴 Not Created |
| 64 | **Create PaymentSchedule Model** | Model for scheduled future payments | Task 59 | 🔴 Not Created |
| 65 | **Implement Payment Reminder Task** | Celery task for upcoming due dates | Task 64 | 🔴 Not Created |
| 66 | **Run Payment Service Migrations** | Generate migrations for PaymentSchedule | Task 65 | 🔴 Not Created |

---

### Group E: Statements, Reports & Aging (Tasks 67-80)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 67 | **Create VendorStatementService** | Service for generating vendor statements | Task 66 | 🔴 Not Created |
| 68 | **Implement Statement Data Aggregation** | Aggregate bills, payments, balance | Task 67 | 🔴 Not Created |
| 69 | **Implement Statement PDF Generator** | Generate PDF vendor statement | Task 68 | 🔴 Not Created |
| 70 | **Create Statement Email Template** | HTML email template for statements | Task 69 | 🔴 Not Created |
| 71 | **Implement Statement Email Celery Task** | Async email sending | Task 70 | 🔴 Not Created |
| 72 | **Create BillAgingService** | Service for aging report calculations | Task 66 | 🔴 Not Created |
| 73 | **Implement Aging Buckets** | Calculate 0-30, 31-60, 61-90, 90+ days | Task 72 | 🔴 Not Created |
| 74 | **Implement Aging Report Generator** | Generate detailed aging report | Task 73 | 🔴 Not Created |
| 75 | **Implement Overdue Bill Alert** | Celery task for overdue notifications | Task 74 | 🔴 Not Created |
| 76 | **Create PaymentHistoryService** | Service for payment history queries | Task 66 | 🔴 Not Created |
| 77 | **Implement Vendor Payment Summary** | Total paid per vendor, per period | Task 76 | 🔴 Not Created |
| 78 | **Implement Accounts Payable Summary** | Total outstanding, due this week/month | Task 76 | 🔴 Not Created |
| 79 | **Create Report Export Service** | Export reports to Excel/CSV | Task 78 | 🔴 Not Created |
| 80 | **Create Payments Dashboard Data** | Aggregate data for dashboard widgets | Task 78 | 🔴 Not Created |

---

### Group F: API, Testing & Documentation (Tasks 81-90)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 81 | **Create VendorBillSerializer** | DRF serializer for VendorBill with nested lines | Task 80 | 🔴 Not Created |
| 82 | **Create BillLineItemSerializer** | DRF serializer for line items | Task 81 | 🔴 Not Created |
| 83 | **Create VendorPaymentSerializer** | DRF serializer for payments | Task 81 | 🔴 Not Created |
| 84 | **Create VendorBillViewSet** | ViewSet with CRUD, approve, pay actions | Task 83 | 🔴 Not Created |
| 85 | **Implement Bill Filtering** | Filter by status, vendor, due_date, date range | Task 84 | 🔴 Not Created |
| 86 | **Add Bill Custom Actions** | Actions: approve, dispute, create_from_po, match | Task 84 | 🔴 Not Created |
| 87 | **Create VendorPaymentViewSet** | ViewSet for payment CRUD operations | Task 84 | 🔴 Not Created |
| 88 | **Register Bill API URLs** | Add all bill, payment endpoints to URL config | Task 87 | 🔴 Not Created |
| 89 | **Create Vendor Bills Module Tests** | Unit and integration tests for all modules | Task 88 | 🔴 Not Created |
| 90 | **Create Vendor Bills Documentation** | API docs, matching workflow guide | Task 89 | 🔴 Not Created |

---

## Expected File Structure

```
backend/apps/vendor_bills/
├── __init__.py
├── admin.py                    # Admin for Bill, Payment
├── apps.py                     # App configuration
├── models/
│   ├── __init__.py
│   ├── vendor_bill.py         # VendorBill model
│   ├── bill_line_item.py      # BillLineItem model
│   ├── vendor_payment.py      # VendorPayment model
│   ├── payment_schedule.py    # PaymentSchedule model
│   ├── matching_result.py     # MatchingResult model
│   ├── bill_history.py        # BillHistory model
│   └── bill_settings.py       # BillSettings model
├── services/
│   ├── __init__.py
│   ├── bill_service.py        # Main bill business logic
│   ├── matching_service.py    # 3-way matching logic
│   ├── payment_service.py     # Payment operations
│   ├── statement_service.py   # Vendor statement generation
│   ├── aging_service.py       # Bill aging calculations
│   └── calculation_service.py # Bill calculations
├── serializers/
│   ├── __init__.py
│   ├── bill_serializer.py     # VendorBill serializer
│   ├── line_item_serializer.py
│   └── payment_serializer.py
├── views/
│   ├── __init__.py
│   ├── bill_viewset.py        # Bill CRUD ViewSet
│   └── payment_viewset.py     # Payment ViewSet
├── tasks/
│   ├── __init__.py
│   ├── reminder_tasks.py      # Payment reminders
│   ├── aging_tasks.py         # Overdue alerts
│   └── email_tasks.py         # Statement emails
├── filters.py                  # Bill filtering
├── urls.py                     # URL routing
├── signals.py                  # Bill signals
├── permissions.py              # Bill-specific permissions
├── tests/
│   ├── __init__.py
│   ├── test_models.py
│   ├── test_bill_service.py
│   ├── test_matching.py
│   ├── test_payments.py
│   └── test_api.py
└── migrations/
```

---

## Bill Status Flow Diagram

```
                    ┌───────────────┐
                    │     DRAFT     │ ← Initial state, editable
                    └───────┬───────┘
                            │ submit()
                            ▼
                    ┌───────────────┐
                    │    PENDING    │ ← Awaiting approval
                    └───────┬───────┘
                            │ approve()
          ┌─────────────────┼─────────────────┐
          │                 │                 │
          ▼                 ▼                 ▼
  ┌───────────────┐ ┌───────────────┐ ┌───────────────┐
  │   APPROVED    │ │   DISPUTED    │ │   CANCELLED   │
  └───────┬───────┘ └───────────────┘ └───────────────┘
          │
          │ pay()
          ▼
  ┌───────────────┐
  │ PARTIAL_PAID  │ ← Partial payment made
  └───────┬───────┘
          │ pay_remaining()
          ▼
  ┌───────────────┐
  │     PAID      │ ← Fully paid
  └───────────────┘
```

---

## 3-Way Matching Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                      3-WAY MATCHING                         │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│   PURCHASE ORDER          GOODS RECEIPT          BILL       │
│   ┌─────────────┐        ┌─────────────┐    ┌───────────┐  │
│   │ Ordered: 100│───────▶│ Received:100│───▶│ Billed:100│  │
│   │ Price: $10  │        │ Inspected:OK│    │ Price: $10│  │
│   └─────────────┘        └─────────────┘    └───────────┘  │
│         │                       │                  │        │
│         └───────────────────────┴──────────────────┘        │
│                         │                                   │
│                         ▼                                   │
│               ┌──────────────────┐                          │
│               │  MATCH RESULT    │                          │
│               ├──────────────────┤                          │
│               │ Qty: ✅ MATCHED  │                          │
│               │ Price: ✅ MATCHED│                          │
│               │ Total: ✅ MATCHED│                          │
│               └──────────────────┘                          │
│                                                             │
└─────────────────────────────────────────────────────────────┘

VARIANCE SCENARIOS:
─────────────────────────────────────────────────────────────
| PO Qty | GRN Qty | Bill Qty | Result                      |
|--------|---------|----------|------------------------------|
|  100   |   100   |   100    | ✅ MATCHED                   |
|  100   |    80   |    80    | ✅ MATCHED (partial receipt) |
|  100   |   100   |   105    | ⚠️ VARIANCE (overbilled)     |
|  100   |   100   |    95    | ⚠️ VARIANCE (underbilled)    |
─────────────────────────────────────────────────────────────
```

---

## Number Formats

```
BILL-{YEAR}-{SEQUENCE}
PAY-{YEAR}-{SEQUENCE}

Examples:
- BILL-2026-00001  (First Bill of 2026)
- BILL-2026-00250  (250th Bill of 2026)
- PAY-2026-00001   (First Payment of 2026)

Sequence resets annually.
Prefix configurable in BillSettings.
```

---

## Key Business Rules

1. **Approved Before Payment:** Bill must be APPROVED to record payment
2. **Matching Optional:** 3-way matching is optional but recommended
3. **Variance Tolerance:** Configurable tolerance for price/qty variances
4. **Partial Payments:** Track remaining balance
5. **Multi-Bill Payment:** One payment can cover multiple bills
6. **Advance Payment:** Vendor credit tracked separately
7. **Due Date Calculation:** From bill_date + payment_terms
8. **Attachment Required:** Optional scan of vendor invoice
9. **Duplicate Detection:** Warn if same vendor invoice exists

---

## Aging Report Buckets

| Bucket | Days Overdue | Description |
|--------|--------------|-------------|
| Current | 0 | Not yet due |
| 1-30 | 1-30 | Overdue 1-30 days |
| 31-60 | 31-60 | Overdue 31-60 days |
| 61-90 | 61-90 | Overdue 61-90 days |
| 90+ | >90 | Severely overdue |

---

## Payment Methods

| Method | Fields Required |
|--------|-----------------|
| BANK_TRANSFER | from_account, to_account, reference_number |
| CHECK | check_number, check_date, bank_name |
| CASH | receipt_number |
| ONLINE | transaction_id, gateway |

---

## Sri Lanka Specific Considerations

- **Currency:** Default LKR, support USD for imports
- **Bank Accounts:** Sri Lankan bank account format
- **Payment Terms:** Common: 30 days, 60 days, COD
- **Withholding Tax:** Consider WHT deductions
- **Exchange Rate:** Track for foreign currency bills

---

## Progress Tracking

| Metric | Count |
|--------|-------|
| Total Tasks | 90 |
| Tasks Completed | 0 |
| Tasks In Progress | 0 |
| Completion Percentage | 0% |

**Last Updated:** 2026-01-17  
**Next Action:** Create Task 01 (vendor_bills Django App)

---

## Notes for AI Agents

- Complete the procure-to-pay cycle with this module
- 3-way matching is industry best practice for fraud prevention
- Integrate with future accounting module for GL posting
- Payment reminders help cash flow management
- Bill aging is critical for vendor relationship management
- Consider batch payment processing for efficiency
- Track foreign currency payments with exchange rates
- Prepare for bank reconciliation integration

---

*End of SubPhase 12 Tasks Summary*

---

## 🎉 Phase 05 Complete!

**Phase 05 Summary:**

| SubPhase | Name | Tasks | Status |
|----------|------|-------|--------|
| 01 | POS Terminal Core | ~90 | ✅ Complete |
| 02 | POS Offline Mode | ~88 | ✅ Complete |
| 03 | Receipt Generation | ~88 | ✅ Complete |
| 04 | Quote Management | 88 | ✅ Complete |
| 05 | Order Management | 92 | ✅ Complete |
| 06 | Invoice System | 90 | ✅ Complete |
| 07 | Payment Recording | 86 | ✅ Complete |
| 08 | Customer Module | 88 | ✅ Complete |
| 09 | Customer Credit & Loyalty | 90 | ✅ Complete |
| 10 | Vendor Module | 86 | ✅ Complete |
| 11 | Purchase Orders | 92 | ✅ Complete |
| 12 | Vendor Bills & Payments | 90 | ✅ Complete |
| **Total** | | **~1,068** | |

**Next Phase:** Phase-06_ERP-Advanced-Modules

---

*End of Phase 05 Documentation*
