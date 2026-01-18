# SubPhase 04: Quote Management - Tasks Summary

> **Phase:** 05 - ERP Core Modules Part 2  
> **SubPhase Index:** 04 of 12  
> **SubPhase Goal:** Create and manage sales quotations with PDF generation, email sending, and order conversion  
> **Total Tasks:** 88 | **Status:** Planning  
> **Estimated Duration:** 12-15 hours

---

## Navigation

- **↑ Parent:** [00_SUBPHASES_SUMMARY.md](../00_SUBPHASES_SUMMARY.md)
- **← Previous SubPhase:** [SubPhase-03_Receipt-Generation](../SubPhase-03_Receipt-Generation/)
- **→ Next SubPhase:** [SubPhase-05_Order-Management](../SubPhase-05_Order-Management/)

---

## SubPhase Overview

This sub-phase implements a complete quote/estimate management system allowing businesses to create professional quotations, send them to customers, track their status, and convert accepted quotes into sales orders. Supports Sri Lankan business practices including LKR pricing and VAT calculations.

### Key Outcomes
- Quote model with lifecycle management (Draft → Sent → Accepted/Rejected → Converted)
- Quote line items with product/custom item support
- PDF generation with customizable branding
- Email sending with PDF attachment
- Quote validity period and expiry tracking
- Conversion to sales order with inventory checking
- Customer-specific pricing and discounts
- Quote dashboard with filtering and statistics

### Technology Context
- **Backend:** Django 5.x with DRF for API
- **PDF Generation:** ReportLab or WeasyPrint
- **Email:** Django email with Celery async
- **Frontend:** Next.js 14+ with TypeScript
- **Quote Number Format:** `QT-{YEAR}-{SEQUENCE}` (e.g., QT-2026-00001)

### Dependencies
- Phase-04: Products, Pricing, Inventory (for line items)
- Phase-05 SubPhase-08: Customer Module (for customer selection) - *Optional, can use guest details*

---

## Task Execution Order

```
TASK GROUP A: Quote Model & Status System (Tasks 01-18)
        │
        ▼
TASK GROUP B: Quote Line Items & Calculations (Tasks 19-36)
        │
        ▼
TASK GROUP C: Quote Services & Business Logic (Tasks 37-52)
        │
        ▼
TASK GROUP D: Quote PDF Generation (Tasks 53-68)
        │
        ▼
TASK GROUP E: Quote API & Email Integration (Tasks 69-82)
        │
        ▼
TASK GROUP F: Testing & Documentation (Tasks 83-88)
```

---

## Task Index

### Group A: Quote Model & Status System (Tasks 01-18)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 01 | **Create quotes Django App** | Create new Django app for quotes module with proper structure | None | 🔴 Not Created |
| 02 | **Register quotes App** | Add quotes app to TENANT_APPS in Django settings | Task 01 | 🔴 Not Created |
| 03 | **Define QuoteStatus Choices** | Create enum/choices for quote statuses (DRAFT, SENT, ACCEPTED, REJECTED, EXPIRED, CONVERTED) | Task 01 | 🔴 Not Created |
| 04 | **Create Quote Model Core Fields** | Define Quote model with quote_number, status, title, created_at, updated_at | Task 03 | 🔴 Not Created |
| 05 | **Add Quote Customer Fields** | Add customer FK (nullable), guest_name, guest_email, guest_phone, guest_address | Task 04 | 🔴 Not Created |
| 06 | **Add Quote Date Fields** | Add issue_date, valid_until, accepted_at, rejected_at, converted_at | Task 04 | 🔴 Not Created |
| 07 | **Add Quote Financial Summary Fields** | Add subtotal, discount_amount, tax_amount, total fields (all DecimalField) | Task 04 | 🔴 Not Created |
| 08 | **Add Quote Metadata Fields** | Add notes, terms_and_conditions, internal_notes, tags JSONField | Task 04 | 🔴 Not Created |
| 09 | **Add Quote User Reference Fields** | Add created_by, sent_by, accepted_by ForeignKeys to User model | Task 04 | 🔴 Not Created |
| 10 | **Add Quote Currency Field** | Add currency field defaulting to LKR with support for USD | Task 04 | 🔴 Not Created |
| 11 | **Add Quote Discount Fields** | Add discount_type (percentage/fixed), discount_value for header-level discount | Task 04 | 🔴 Not Created |
| 12 | **Create Quote Number Generator** | Implement auto-generation of quote numbers with yearly sequence | Task 04 | 🔴 Not Created |
| 13 | **Add Quote PDF Storage Field** | Add FileField for storing generated PDF, pdf_generated_at timestamp | Task 04 | 🔴 Not Created |
| 14 | **Add Quote Email Tracking Fields** | Add email_sent_at, email_sent_to, email_opened_at (optional tracking) | Task 04 | 🔴 Not Created |
| 15 | **Add Quote Conversion Reference** | Add converted_to_order ForeignKey (nullable) to Order model | Task 04 | 🔴 Not Created |
| 16 | **Create Quote Model Indexes** | Add database indexes for status, customer, created_at, quote_number | Task 04 | 🔴 Not Created |
| 17 | **Create Quote Model Constraints** | Add validation for valid_until > issue_date, prevent edit after conversion | Task 04 | 🔴 Not Created |
| 18 | **Run Initial Quote Migrations** | Generate and apply migrations for Quote model | Task 17 | 🔴 Not Created |

---

### Group B: Quote Line Items & Calculations (Tasks 19-36)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 19 | **Create QuoteLineItem Model** | Define line item model with FK to Quote, position/order field | Task 18 | 🔴 Not Created |
| 20 | **Add Line Item Product Reference** | Add product FK (nullable), variant FK for linked products | Task 19 | 🔴 Not Created |
| 21 | **Add Line Item Custom Description** | Add custom_description, custom_sku for non-product items | Task 19 | 🔴 Not Created |
| 22 | **Add Line Item Quantity Fields** | Add quantity (DecimalField), unit_of_measure fields | Task 19 | 🔴 Not Created |
| 23 | **Add Line Item Pricing Fields** | Add unit_price, original_price, cost_price fields | Task 19 | 🔴 Not Created |
| 24 | **Add Line Item Discount Fields** | Add discount_type, discount_value, discount_amount for line-level discounts | Task 19 | 🔴 Not Created |
| 25 | **Add Line Item Tax Fields** | Add tax_rate, tax_amount, is_taxable boolean | Task 19 | 🔴 Not Created |
| 26 | **Add Line Item Total Field** | Add computed line_total field (quantity * unit_price - discount + tax) | Task 19 | 🔴 Not Created |
| 27 | **Add Line Item Notes Field** | Add notes TextField for line-specific notes/instructions | Task 19 | 🔴 Not Created |
| 28 | **Create Line Item Ordering** | Implement ordering field for drag-drop reordering of lines | Task 19 | 🔴 Not Created |
| 29 | **Run QuoteLineItem Migrations** | Generate and apply migrations for QuoteLineItem model | Task 28 | 🔴 Not Created |
| 30 | **Create Quote Calculation Service** | Create service class to calculate subtotal, tax, discounts, total | Task 29 | 🔴 Not Created |
| 31 | **Implement Line Total Calculator** | Method to calculate individual line totals with discounts | Task 30 | 🔴 Not Created |
| 32 | **Implement Tax Calculator** | Method to calculate tax based on line items and tax rates | Task 30 | 🔴 Not Created |
| 33 | **Implement Header Discount Applicator** | Apply header-level discount to subtotal before tax | Task 30 | 🔴 Not Created |
| 34 | **Implement Grand Total Calculator** | Calculate final total: subtotal - discounts + taxes | Task 30 | 🔴 Not Created |
| 35 | **Create Quote Recalculation Signal** | Auto-recalculate quote totals when line items change | Task 34 | 🔴 Not Created |
| 36 | **Add Price Snapshotting** | Snapshot product prices at quote creation time | Task 29 | 🔴 Not Created |

---

### Group C: Quote Services & Business Logic (Tasks 37-52)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 37 | **Create QuoteService Class** | Main service class for quote business operations | Task 36 | 🔴 Not Created |
| 38 | **Implement Quote Creation** | Method to create new quote with initial line items | Task 37 | 🔴 Not Created |
| 39 | **Implement Quote Duplication** | Method to duplicate existing quote as new draft | Task 37 | 🔴 Not Created |
| 40 | **Implement Quote Status Transitions** | Methods for send(), accept(), reject(), expire() operations | Task 37 | 🔴 Not Created |
| 41 | **Add Status Transition Validation** | Validate allowed status transitions (e.g., can't accept expired) | Task 40 | 🔴 Not Created |
| 42 | **Implement Quote Expiry Check** | Service method to check and mark expired quotes | Task 37 | 🔴 Not Created |
| 43 | **Create Expiry Celery Task** | Celery task to periodically check and expire old quotes | Task 42 | 🔴 Not Created |
| 44 | **Implement Quote to Order Conversion** | Convert accepted quote to sales order with line items | Task 37 | 🔴 Not Created |
| 45 | **Add Inventory Validation on Conversion** | Check stock availability before converting to order | Task 44 | 🔴 Not Created |
| 46 | **Implement Quote Revision** | Create new version of quote while linking to original | Task 37 | 🔴 Not Created |
| 47 | **Add Quote Locking Logic** | Lock quote for editing when sent/accepted/converted | Task 40 | 🔴 Not Created |
| 48 | **Create Quote History Model** | Model to track all changes and status transitions | Task 37 | 🔴 Not Created |
| 49 | **Implement History Logging** | Log all quote actions with user, timestamp, old/new values | Task 48 | 🔴 Not Created |
| 50 | **Create Quote Settings Model** | Tenant-level settings for default validity, numbering prefix | Task 37 | 🔴 Not Created |
| 51 | **Implement Default Validity Period** | Apply default validity days from settings on creation | Task 50 | 🔴 Not Created |
| 52 | **Run Service Layer Migrations** | Generate migrations for QuoteHistory and QuoteSettings | Task 50 | 🔴 Not Created |

---

### Group D: Quote PDF Generation (Tasks 53-68)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 53 | **Create QuoteTemplate Model** | Model for storing PDF template configurations | Task 52 | 🔴 Not Created |
| 54 | **Add Template Header Fields** | Fields for logo_url, business_name, address, phone, email | Task 53 | 🔴 Not Created |
| 55 | **Add Template Styling Fields** | Fields for primary_color, accent_color, font_family | Task 53 | 🔴 Not Created |
| 56 | **Add Template Content Fields** | Fields for footer_text, terms_text, thank_you_message | Task 53 | 🔴 Not Created |
| 57 | **Add Template Layout Options** | Fields for show_images, show_sku, show_discount_column | Task 53 | 🔴 Not Created |
| 58 | **Run QuoteTemplate Migrations** | Generate and apply migrations for template model | Task 57 | 🔴 Not Created |
| 59 | **Create QuotePDFGenerator Service** | Service class for generating quote PDFs | Task 58 | 🔴 Not Created |
| 60 | **Implement PDF Header Section** | Generate header with business logo, name, quote number, date | Task 59 | 🔴 Not Created |
| 61 | **Implement PDF Customer Section** | Generate customer/recipient details section | Task 59 | 🔴 Not Created |
| 62 | **Implement PDF Line Items Table** | Generate itemized table with columns, quantities, prices | Task 59 | 🔴 Not Created |
| 63 | **Implement PDF Totals Section** | Generate subtotal, discount, tax, grand total section | Task 59 | 🔴 Not Created |
| 64 | **Implement PDF Footer Section** | Generate terms, conditions, validity, signature line | Task 59 | 🔴 Not Created |
| 65 | **Add PDF QR Code** | Generate QR code linking to online quote view | Task 59 | 🔴 Not Created |
| 66 | **Implement PDF Storage** | Save generated PDF to FileField, update generated_at | Task 59 | 🔴 Not Created |
| 67 | **Create PDF Regeneration Logic** | Regenerate PDF when quote is modified | Task 66 | 🔴 Not Created |
| 68 | **Implement PDF Download Endpoint** | API endpoint to download quote PDF | Task 66 | 🔴 Not Created |

---

### Group E: Quote API & Email Integration (Tasks 69-82)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 69 | **Create QuoteSerializer** | DRF serializer for Quote model with nested line items | Task 68 | 🔴 Not Created |
| 70 | **Create QuoteLineItemSerializer** | DRF serializer for line items with validation | Task 69 | 🔴 Not Created |
| 71 | **Create QuoteListSerializer** | Lightweight serializer for list view (without line items) | Task 69 | 🔴 Not Created |
| 72 | **Create QuoteViewSet** | ViewSet with CRUD, list, retrieve, custom actions | Task 71 | 🔴 Not Created |
| 73 | **Implement Quote Filtering** | Filter by status, customer, date range, created_by | Task 72 | 🔴 Not Created |
| 74 | **Implement Quote Search** | Search by quote_number, customer name, title | Task 72 | 🔴 Not Created |
| 75 | **Add Quote Status Actions** | Custom actions: send, accept, reject, convert_to_order | Task 72 | 🔴 Not Created |
| 76 | **Create QuoteEmailService** | Service for sending quote emails with PDF attachment | Task 68 | 🔴 Not Created |
| 77 | **Create Quote Email Template** | HTML email template for quote delivery | Task 76 | 🔴 Not Created |
| 78 | **Implement Email Sending Endpoint** | API endpoint to trigger email sending | Task 77 | 🔴 Not Created |
| 79 | **Create Celery Task for Email** | Async email sending with retry logic | Task 78 | 🔴 Not Created |
| 80 | **Implement Quote Public View** | Unauthenticated endpoint for customer to view quote via token | Task 72 | 🔴 Not Created |
| 81 | **Add Quote Accept/Reject Actions** | Allow customer to accept/reject from public view | Task 80 | 🔴 Not Created |
| 82 | **Register Quote API URLs** | Add all quote endpoints to URL configuration | Task 81 | 🔴 Not Created |

---

### Group F: Testing & Documentation (Tasks 83-88)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 83 | **Create Quote Model Unit Tests** | Test Quote and QuoteLineItem models, validations | Task 82 | 🔴 Not Created |
| 84 | **Create Quote Service Tests** | Test QuoteService methods, status transitions, conversion | Task 82 | 🔴 Not Created |
| 85 | **Create Quote API Tests** | Test all API endpoints, permissions, filtering | Task 82 | 🔴 Not Created |
| 86 | **Create PDF Generation Tests** | Test PDF generation, template rendering | Task 82 | 🔴 Not Created |
| 87 | **Create Email Integration Tests** | Test email sending, async tasks | Task 82 | 🔴 Not Created |
| 88 | **Create Quote Module Documentation** | API documentation, usage guide, configuration | Task 82 | 🔴 Not Created |

---

## Expected File Structure

```
backend/apps/quotes/
├── __init__.py
├── admin.py                    # Admin configuration for Quote, LineItem
├── apps.py                     # App configuration
├── models/
│   ├── __init__.py
│   ├── quote.py               # Quote model with status system
│   ├── quote_line_item.py     # QuoteLineItem model
│   ├── quote_template.py      # QuoteTemplate for PDF styling
│   ├── quote_history.py       # QuoteHistory for audit trail
│   └── quote_settings.py      # QuoteSettings for tenant config
├── services/
│   ├── __init__.py
│   ├── quote_service.py       # Main business logic service
│   ├── calculation_service.py # Quote total calculations
│   ├── pdf_generator.py       # PDF generation service
│   └── email_service.py       # Email sending service
├── serializers/
│   ├── __init__.py
│   ├── quote_serializer.py    # Full quote serializer
│   ├── line_item_serializer.py
│   └── template_serializer.py
├── views/
│   ├── __init__.py
│   ├── quote_viewset.py       # Quote CRUD ViewSet
│   └── public_views.py        # Public quote view/accept
├── tasks/
│   ├── __init__.py
│   ├── email_tasks.py         # Async email tasks
│   └── expiry_tasks.py        # Quote expiry checker
├── filters.py                  # Quote filtering
├── urls.py                     # URL routing
├── signals.py                  # Auto-recalculation signals
├── permissions.py              # Quote-specific permissions
├── templates/
│   └── emails/
│       └── quote_email.html   # Quote email template
├── tests/
│   ├── __init__.py
│   ├── test_models.py
│   ├── test_services.py
│   ├── test_api.py
│   ├── test_pdf.py
│   └── test_email.py
└── migrations/
```

---

## Quote Lifecycle Diagram

```
                    ┌───────────────┐
                    │    DRAFT      │ ← Initial state
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
  │   ACCEPTED    │ │   REJECTED    │ │   EXPIRED     │
  └───────┬───────┘ └───────────────┘ └───────────────┘
          │ convert()
          ▼
  ┌───────────────┐
  │   CONVERTED   │ ← Linked to Order
  └───────────────┘
```

---

## Quote Number Format

```
QT-{YEAR}-{SEQUENCE}

Examples:
- QT-2026-00001  (First quote of 2026)
- QT-2026-00150  (150th quote of 2026)

Sequence resets annually.
Prefix configurable in QuoteSettings.
```

---

## Key Business Rules

1. **Draft Editing:** Only DRAFT quotes can be freely edited
2. **Sent Lock:** SENT quotes require revision (creates new version)
3. **Validity:** Quotes auto-expire after valid_until date
4. **Conversion:** Only ACCEPTED quotes can convert to orders
5. **Stock Check:** Validate inventory before conversion
6. **Price Snapshot:** Line item prices frozen at creation time
7. **Customer Optional:** Quotes can be created for guest customers

---

## Sri Lanka Specific Considerations

- **Currency:** Default LKR with Rs. symbol formatting
- **Tax:** Standard VAT rate 12% (configurable per line)
- **Number Format:** Thousands separator as comma
- **Date Format:** DD/MM/YYYY in PDF
- **PDF Language:** Support Sinhala, Tamil, English

---

## Progress Tracking

| Metric | Count |
|--------|-------|
| Total Tasks | 88 |
| Tasks Completed | 0 |
| Tasks In Progress | 0 |
| Completion Percentage | 0% |

**Last Updated:** 2026-01-17  
**Next Action:** Create Task 01 (quotes Django App)

---

## Notes for AI Agents

- Always recalculate totals after any line item modification
- Use Celery for PDF generation and email sending (can be slow)
- Implement proper locking to prevent race conditions on conversion
- Quote PDF should be regenerated if any field changes
- Public quote view requires secure token (UUID-based)
- Handle product price changes gracefully (snapshot vs. live price option)
- Consider quote versioning for audit trail

---

*End of SubPhase 04 Tasks Summary*
