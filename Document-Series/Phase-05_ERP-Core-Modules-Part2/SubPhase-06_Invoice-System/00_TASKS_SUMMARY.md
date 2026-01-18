# SubPhase 06: Invoice System - Tasks Summary

> **Phase:** 05 - ERP Core Modules Part 2  
> **SubPhase Index:** 06 of 12  
> **SubPhase Goal:** Generate Sri Lanka compliant invoices with SVAT/VAT support, credit notes, and debit notes  
> **Total Tasks:** 90 | **Status:** Planning  
> **Estimated Duration:** 14-16 hours

---

## Navigation

- **↑ Parent:** [00_SUBPHASES_SUMMARY.md](../00_SUBPHASES_SUMMARY.md)
- **← Previous SubPhase:** [SubPhase-05_Order-Management](../SubPhase-05_Order-Management/)
- **→ Next SubPhase:** [SubPhase-07_Payment-Recording](../SubPhase-07_Payment-Recording/)

---

## SubPhase Overview

This sub-phase implements a comprehensive invoicing system compliant with Sri Lanka tax regulations. Supports standard invoices, Simplified VAT (SVAT) invoices, credit notes for returns/adjustments, and debit notes for additional charges. Includes PDF generation with proper formatting, sequential numbering, and integration with orders and payments.

### Key Outcomes
- Invoice model with Sri Lanka compliance fields (BRN, VAT number)
- Support for Standard Invoice, SVAT Invoice, Credit Note, Debit Note
- Auto-generation from orders with line item copying
- PDF generation with customizable templates
- Sequential invoice numbering per fiscal year
- Invoice aging and overdue tracking
- Credit note linking to original invoice
- Email delivery with PDF attachment
- Invoice dashboard with financial summaries

### Technology Context
- **Backend:** Django 5.x with DRF for API
- **PDF Generation:** ReportLab or WeasyPrint
- **Email:** Django email with Celery async
- **Frontend:** Next.js 14+ with TypeScript
- **Invoice Number Format:** `INV-{YEAR}-{SEQUENCE}` (e.g., INV-2026-00001)

### Dependencies
- Phase-05 SubPhase-05: Order Management (for order-to-invoice)
- Phase-05 SubPhase-08: Customer Module (for customer details)

---

## Task Execution Order

```
TASK GROUP A: Invoice Model & Types (Tasks 01-18)
        │
        ▼
TASK GROUP B: Invoice Line Items & Tax Calculation (Tasks 19-34)
        │
        ▼
TASK GROUP C: Invoice Generation Services (Tasks 35-50)
        │
        ▼
TASK GROUP D: Credit Notes & Debit Notes (Tasks 51-66)
        │
        ▼
TASK GROUP E: Invoice PDF & Email (Tasks 67-80)
        │
        ▼
TASK GROUP F: Invoice API, Testing & Documentation (Tasks 81-90)
```

---

## Task Index

### Group A: Invoice Model & Types (Tasks 01-18)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 01 | **Create invoices Django App** | Create new Django app for invoices module with proper structure | None | 🔴 Not Created |
| 02 | **Register invoices App** | Add invoices app to TENANT_APPS in Django settings | Task 01 | 🔴 Not Created |
| 03 | **Define InvoiceType Choices** | Create enum for types: STANDARD, SVAT, CREDIT_NOTE, DEBIT_NOTE | Task 01 | 🔴 Not Created |
| 04 | **Define InvoiceStatus Choices** | Create enum for statuses: DRAFT, ISSUED, SENT, PAID, PARTIAL, OVERDUE, CANCELLED, VOID | Task 01 | 🔴 Not Created |
| 05 | **Create Invoice Model Core Fields** | Define Invoice model with invoice_number, type, status, created_at | Task 04 | 🔴 Not Created |
| 06 | **Add Invoice Customer Fields** | Add customer FK, customer_name, customer_email, customer_phone, customer_address | Task 05 | 🔴 Not Created |
| 07 | **Add Invoice Business Fields** | Add business_name, business_address, business_phone, business_email | Task 05 | 🔴 Not Created |
| 08 | **Add Invoice Compliance Fields** | Add business_registration_number (BRN), vat_registration_number, svat_number | Task 05 | 🔴 Not Created |
| 09 | **Add Invoice Date Fields** | Add issue_date, due_date, paid_date, cancelled_date | Task 05 | 🔴 Not Created |
| 10 | **Add Invoice Financial Fields** | Add subtotal, discount_amount, tax_amount, total, amount_paid, balance_due | Task 05 | 🔴 Not Created |
| 11 | **Add Invoice Tax Breakdown Fields** | Add tax_breakdown JSONField for multiple tax rates summary | Task 05 | 🔴 Not Created |
| 12 | **Add Invoice Reference Fields** | Add order FK, related_invoice FK (for credit/debit notes), external_reference | Task 05 | 🔴 Not Created |
| 13 | **Add Invoice Metadata Fields** | Add notes, terms_and_conditions, internal_notes | Task 05 | 🔴 Not Created |
| 14 | **Add Invoice Currency Field** | Add currency field defaulting to LKR, exchange_rate | Task 05 | 🔴 Not Created |
| 15 | **Create Invoice Number Generator** | Auto-generate invoice numbers with yearly sequence per type | Task 05 | 🔴 Not Created |
| 16 | **Add Invoice PDF Storage Field** | Add FileField for generated PDF, pdf_generated_at timestamp | Task 05 | 🔴 Not Created |
| 17 | **Create Invoice Model Indexes** | Add indexes for status, type, customer, invoice_number, issue_date | Task 05 | 🔴 Not Created |
| 18 | **Run Initial Invoice Migrations** | Generate and apply migrations for Invoice model | Task 17 | 🔴 Not Created |

---

### Group B: Invoice Line Items & Tax Calculation (Tasks 19-34)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 19 | **Create InvoiceLineItem Model** | Define line item model with FK to Invoice, position field | Task 18 | 🔴 Not Created |
| 20 | **Add Line Item Product Reference** | Add product FK (nullable), variant FK for product tracking | Task 19 | 🔴 Not Created |
| 21 | **Add Line Item Description Fields** | Add description, sku for custom/service items | Task 19 | 🔴 Not Created |
| 22 | **Add Line Item Quantity Fields** | Add quantity, unit_of_measure fields | Task 19 | 🔴 Not Created |
| 23 | **Add Line Item Pricing Fields** | Add unit_price, original_price for comparison | Task 19 | 🔴 Not Created |
| 24 | **Add Line Item Discount Fields** | Add discount_type, discount_value, discount_amount | Task 19 | 🔴 Not Created |
| 25 | **Add Line Item Tax Fields** | Add tax_rate, tax_amount, is_taxable, tax_code | Task 19 | 🔴 Not Created |
| 26 | **Add Line Item HSN/SAC Code** | Add hsn_code field for goods classification | Task 19 | 🔴 Not Created |
| 27 | **Add Line Item Total Field** | Add computed line_total field | Task 19 | 🔴 Not Created |
| 28 | **Run InvoiceLineItem Migrations** | Generate and apply migrations for InvoiceLineItem | Task 27 | 🔴 Not Created |
| 29 | **Create Invoice Calculation Service** | Service class to calculate subtotal, tax, discounts, total | Task 28 | 🔴 Not Created |
| 30 | **Implement VAT Calculation** | Calculate standard VAT at 12% rate | Task 29 | 🔴 Not Created |
| 31 | **Implement SVAT Calculation** | Calculate Simplified VAT with different rules | Task 29 | 🔴 Not Created |
| 32 | **Implement Tax Breakdown Generator** | Generate tax breakdown by rate for invoice footer | Task 29 | 🔴 Not Created |
| 33 | **Implement Header Discount Applicator** | Apply invoice-level discount before tax | Task 29 | 🔴 Not Created |
| 34 | **Create Invoice Recalculation Signal** | Auto-recalculate invoice totals when line items change | Task 33 | 🔴 Not Created |

---

### Group C: Invoice Generation Services (Tasks 35-50)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 35 | **Create InvoiceService Class** | Main service class for invoice business operations | Task 34 | 🔴 Not Created |
| 36 | **Implement Invoice from Order** | Auto-generate invoice from completed order | Task 35 | 🔴 Not Created |
| 37 | **Implement Copy Order Line Items** | Copy order line items to invoice with price snapshot | Task 36 | 🔴 Not Created |
| 38 | **Implement Manual Invoice Creation** | Create invoice without linked order (services, etc.) | Task 35 | 🔴 Not Created |
| 39 | **Implement Invoice Duplication** | Duplicate existing invoice as new draft | Task 35 | 🔴 Not Created |
| 40 | **Implement Invoice Status Transitions** | Methods for issue(), send(), mark_paid(), cancel(), void() | Task 35 | 🔴 Not Created |
| 41 | **Add Status Transition Validation** | Validate allowed status transitions | Task 40 | 🔴 Not Created |
| 42 | **Implement Invoice Overdue Check** | Service to check and mark overdue invoices | Task 35 | 🔴 Not Created |
| 43 | **Create Overdue Celery Task** | Daily task to mark overdue invoices | Task 42 | 🔴 Not Created |
| 44 | **Implement Invoice Aging Calculator** | Calculate invoice age and aging buckets (30/60/90 days) | Task 35 | 🔴 Not Created |
| 45 | **Create InvoiceHistory Model** | Model to track all invoice changes | Task 35 | 🔴 Not Created |
| 46 | **Implement History Logging** | Log all invoice actions with user, timestamp | Task 45 | 🔴 Not Created |
| 47 | **Create InvoiceSettings Model** | Tenant settings for numbering, due days, tax rates | Task 35 | 🔴 Not Created |
| 48 | **Implement Default Due Date** | Apply default payment terms from settings | Task 47 | 🔴 Not Created |
| 49 | **Implement Payment Terms Text** | Generate payment terms text (Net 30, etc.) | Task 47 | 🔴 Not Created |
| 50 | **Run Invoice Service Migrations** | Generate migrations for InvoiceHistory and InvoiceSettings | Task 49 | 🔴 Not Created |

---

### Group D: Credit Notes & Debit Notes (Tasks 51-66)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 51 | **Define CreditNoteReason Choices** | Enum for reasons: RETURN, OVERCHARGE, DISCOUNT, DAMAGED, OTHER | Task 50 | 🔴 Not Created |
| 52 | **Define DebitNoteReason Choices** | Enum for reasons: UNDERCHARGE, ADDITIONAL_CHARGE, ADJUSTMENT, OTHER | Task 51 | 🔴 Not Created |
| 53 | **Implement Credit Note Creation** | Create credit note linked to original invoice | Task 35 | 🔴 Not Created |
| 54 | **Add Credit Note Number Generator** | Generate CN-{YEAR}-{SEQUENCE} format | Task 53 | 🔴 Not Created |
| 55 | **Implement Credit Note Line Items** | Copy/select line items from original invoice | Task 53 | 🔴 Not Created |
| 56 | **Implement Credit Note Application** | Apply credit note amount to invoice balance | Task 55 | 🔴 Not Created |
| 57 | **Implement Debit Note Creation** | Create debit note linked to original invoice | Task 35 | 🔴 Not Created |
| 58 | **Add Debit Note Number Generator** | Generate DN-{YEAR}-{SEQUENCE} format | Task 57 | 🔴 Not Created |
| 59 | **Implement Debit Note Line Items** | Add line items for additional charges | Task 57 | 🔴 Not Created |
| 60 | **Implement Debit Note Application** | Add debit note amount to invoice balance | Task 59 | 🔴 Not Created |
| 61 | **Link Credit/Debit to Original Invoice** | Maintain related_invoice FK and linkage | Task 60 | 🔴 Not Created |
| 62 | **Implement Invoice Balance Recalculation** | Recalculate invoice balance with credit/debit notes | Task 61 | 🔴 Not Created |
| 63 | **Create Credit Note PDF Template** | PDF template for credit notes | Task 53 | 🔴 Not Created |
| 64 | **Create Debit Note PDF Template** | PDF template for debit notes | Task 57 | 🔴 Not Created |
| 65 | **Implement Credit Limit Check** | Validate credit note doesn't exceed invoice total | Task 56 | 🔴 Not Created |
| 66 | **Run Credit/Debit Note Migrations** | Generate migrations for reason fields | Task 65 | 🔴 Not Created |

---

### Group E: Invoice PDF & Email (Tasks 67-80)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 67 | **Create InvoiceTemplate Model** | Model for PDF template configurations | Task 66 | 🔴 Not Created |
| 68 | **Add Template Header Fields** | Fields for logo, business_name, address, BRN, VAT number | Task 67 | 🔴 Not Created |
| 69 | **Add Template Styling Fields** | Fields for primary_color, accent_color, font_family | Task 67 | 🔴 Not Created |
| 70 | **Add Template Footer Fields** | Fields for bank_details, payment_instructions, terms | Task 67 | 🔴 Not Created |
| 71 | **Run InvoiceTemplate Migrations** | Generate and apply migrations for template model | Task 70 | 🔴 Not Created |
| 72 | **Create InvoicePDFGenerator Service** | Service class for generating invoice PDFs | Task 71 | 🔴 Not Created |
| 73 | **Implement PDF Header Section** | Generate header with logo, invoice number, dates | Task 72 | 🔴 Not Created |
| 74 | **Implement PDF Billing Section** | Generate from/to billing addresses | Task 72 | 🔴 Not Created |
| 75 | **Implement PDF Line Items Table** | Generate itemized table with columns | Task 72 | 🔴 Not Created |
| 76 | **Implement PDF Tax Summary Section** | Generate tax breakdown table | Task 72 | 🔴 Not Created |
| 77 | **Implement PDF Footer Section** | Generate bank details, terms, signature | Task 72 | 🔴 Not Created |
| 78 | **Create InvoiceEmailService** | Service for sending invoice emails | Task 72 | 🔴 Not Created |
| 79 | **Create Invoice Email Templates** | HTML templates for invoice, reminder, overdue | Task 78 | 🔴 Not Created |
| 80 | **Create Invoice Email Celery Tasks** | Async tasks for email sending with retries | Task 79 | 🔴 Not Created |

---

### Group F: Invoice API, Testing & Documentation (Tasks 81-90)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 81 | **Create InvoiceSerializer** | DRF serializer for Invoice with nested line items | Task 80 | 🔴 Not Created |
| 82 | **Create InvoiceLineItemSerializer** | DRF serializer for line items with validation | Task 81 | 🔴 Not Created |
| 83 | **Create InvoiceListSerializer** | Lightweight serializer for list view | Task 81 | 🔴 Not Created |
| 84 | **Create InvoiceViewSet** | ViewSet with CRUD, custom actions | Task 83 | 🔴 Not Created |
| 85 | **Implement Invoice Filtering** | Filter by status, type, customer, date range | Task 84 | 🔴 Not Created |
| 86 | **Add Invoice Actions** | Custom actions: issue, send, mark_paid, void | Task 84 | 🔴 Not Created |
| 87 | **Create Aging Report Endpoint** | API endpoint for invoice aging report | Task 84 | 🔴 Not Created |
| 88 | **Register Invoice API URLs** | Add all invoice endpoints to URL configuration | Task 87 | 🔴 Not Created |
| 89 | **Create Invoice Module Tests** | Unit and integration tests for models, services, API | Task 88 | 🔴 Not Created |
| 90 | **Create Invoice Module Documentation** | API documentation, compliance guide | Task 89 | 🔴 Not Created |

---

## Expected File Structure

```
backend/apps/invoices/
├── __init__.py
├── admin.py                    # Admin for Invoice, LineItem, Template
├── apps.py                     # App configuration
├── models/
│   ├── __init__.py
│   ├── invoice.py             # Invoice model with compliance fields
│   ├── invoice_line_item.py   # InvoiceLineItem model
│   ├── invoice_template.py    # InvoiceTemplate for PDF styling
│   ├── invoice_history.py     # InvoiceHistory for audit trail
│   └── invoice_settings.py    # InvoiceSettings for tenant config
├── services/
│   ├── __init__.py
│   ├── invoice_service.py     # Main invoice business logic
│   ├── calculation_service.py # Invoice calculations and tax
│   ├── pdf_generator.py       # PDF generation service
│   ├── email_service.py       # Email sending service
│   └── aging_service.py       # Aging report calculations
├── serializers/
│   ├── __init__.py
│   ├── invoice_serializer.py  # Full invoice serializer
│   ├── line_item_serializer.py
│   └── template_serializer.py
├── views/
│   ├── __init__.py
│   ├── invoice_viewset.py     # Invoice CRUD ViewSet
│   └── report_views.py        # Aging report views
├── tasks/
│   ├── __init__.py
│   ├── email_tasks.py         # Async email tasks
│   └── overdue_tasks.py       # Overdue checker task
├── filters.py                  # Invoice filtering
├── urls.py                     # URL routing
├── signals.py                  # Invoice signals
├── permissions.py              # Invoice-specific permissions
├── templates/
│   └── emails/
│       ├── invoice_email.html
│       ├── reminder_email.html
│       └── overdue_email.html
├── tests/
│   ├── __init__.py
│   ├── test_models.py
│   ├── test_services.py
│   ├── test_pdf.py
│   └── test_api.py
└── migrations/
```

---

## Invoice Types

| Type | Number Format | Description |
|------|---------------|-------------|
| **STANDARD** | INV-{YEAR}-{SEQ} | Regular invoice for goods/services |
| **SVAT** | SVAT-{YEAR}-{SEQ} | Simplified VAT invoice (specific rules) |
| **CREDIT_NOTE** | CN-{YEAR}-{SEQ} | Reduces original invoice amount |
| **DEBIT_NOTE** | DN-{YEAR}-{SEQ} | Increases original invoice amount |

---

## Invoice Status Flow Diagram

```
                    ┌───────────────┐
                    │     DRAFT     │ ← Initial state, editable
                    └───────┬───────┘
                            │ issue()
                            ▼
                    ┌───────────────┐
                    │    ISSUED     │ ← Invoice finalized, number assigned
                    └───────┬───────┘
                            │ send()
                            ▼
                    ┌───────────────┐
                    │     SENT      │ ← Email sent to customer
                    └───────┬───────┘
                            │
          ┌─────────────────┼─────────────────┐
          │                 │                 │
          ▼                 ▼                 ▼
  ┌───────────────┐ ┌───────────────┐ ┌───────────────┐
  │     PAID      │ │   PARTIAL     │ │   OVERDUE     │
  └───────────────┘ └───────────────┘ └───────────────┘

  CANCELLATION:
  ┌───────────────┐ ┌───────────────┐
  │   CANCELLED   │ │     VOID      │
  └───────────────┘ └───────────────┘
  (Before issue)    (After issue, for corrections)
```

---

## Sri Lanka Compliance Requirements

### Required Invoice Fields
1. **Business Registration Number (BRN)** - Mandatory for all businesses
2. **VAT Registration Number** - Required if VAT registered (Rs. 80M+ turnover)
3. **SVAT Number** - For Simplified VAT scheme participants
4. **Invoice Number** - Sequential, unique per fiscal year
5. **Invoice Date** - Date of issue
6. **Customer Details** - Name, address, TIN if applicable
7. **Line Item Details** - Description, quantity, unit price
8. **Tax Breakdown** - VAT amount separately shown
9. **Total Amount** - In words and figures

### VAT Rates (Sri Lanka)
- **Standard Rate:** 12% (as of 2024)
- **Zero Rate:** 0% (exports, essential items)
- **Exempt:** No VAT (financial services, healthcare)

---

## Invoice Number Format

```
Standard Invoice: INV-{YEAR}-{SEQUENCE}
SVAT Invoice:     SVAT-{YEAR}-{SEQUENCE}
Credit Note:      CN-{YEAR}-{SEQUENCE}
Debit Note:       DN-{YEAR}-{SEQUENCE}

Examples:
- INV-2026-00001  (First invoice of 2026)
- CN-2026-00005   (Fifth credit note of 2026)

Sequence resets annually per type.
Prefix configurable in InvoiceSettings.
```

---

## Aging Buckets

| Bucket | Days Overdue |
|--------|--------------|
| Current | 0 days |
| 1-30 days | 1-30 |
| 31-60 days | 31-60 |
| 61-90 days | 61-90 |
| 90+ days | >90 |

---

## Key Business Rules

1. **Number Lock:** Invoice number assigned only on ISSUE (not DRAFT)
2. **Edit Lock:** No editing after ISSUED status
3. **Void vs Cancel:** CANCEL for drafts, VOID for issued with corrections
4. **Credit Note Limit:** Cannot exceed original invoice total
5. **Due Date:** Default from InvoiceSettings (e.g., Net 30)
6. **Overdue Check:** Daily Celery task marks overdue invoices
7. **PDF Regeneration:** Regenerate PDF on any field change (draft only)
8. **Compliance:** BRN mandatory, VAT number if registered

---

## Progress Tracking

| Metric | Count |
|--------|-------|
| Total Tasks | 90 |
| Tasks Completed | 0 |
| Tasks In Progress | 0 |
| Completion Percentage | 0% |

**Last Updated:** 2026-01-17  
**Next Action:** Create Task 01 (invoices Django App)

---

## Notes for AI Agents

- Invoice numbers must be strictly sequential with no gaps (compliance requirement)
- Use database transactions for invoice numbering to prevent duplicates
- Store customer/business details at invoice creation time (snapshot for audit)
- Credit notes must reference original invoice for audit trail
- Consider PDF/A format for long-term archival
- Implement invoice search by multiple fields (number, customer, amount)
- Aging report is critical for accounts receivable management
- Support multi-currency but always show LKR equivalent

---

*End of SubPhase 06 Tasks Summary*
