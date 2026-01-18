# SubPhase-03: Receipt Generation - Tasks Summary

> **Phase:** 05 - ERP Core Modules Part 2  
> **SubPhase:** 03 of 12  
> **SubPhase Goal:** Generate customizable POS receipts with thermal printing and digital formats  
> **Total Tasks:** 82 | **Status:** Planning

---

## Navigation

- **↑ Parent:** [Phase-05 Summary](../00_SUBPHASES_SUMMARY.md)
- **← Previous SubPhase:** [SubPhase-02: POS Offline Mode](../SubPhase-02_POS-Offline-Mode/)
- **→ Next SubPhase:** [SubPhase-04: Quote Management](../SubPhase-04_Quote-Management/)

---

## SubPhase Overview

This sub-phase implements the receipt generation system for POS transactions in LankaCommerce Cloud. The system supports customizable receipt templates with tenant branding, multiple output formats (thermal printer, PDF, email), and Sri Lanka-specific compliance requirements. Receipts include business details, itemized purchases, tax breakdown, and configurable footer messages.

### Key Outcomes
- ReceiptTemplate model with customizable sections
- Thermal printer support (80mm, 58mm paper widths)
- PDF receipt generation with branding
- Email receipt delivery
- QR code for digital receipt lookup
- Receipt reprint functionality
- Sri Lanka tax compliance (VAT breakdown)

### Dependencies
- SubPhase-01: POS Terminal Core (POSCart, POSPayment)
- Phase-03: Email service, PDF generation utilities

---

## Execution Flow Diagram

```
[Group A: Receipt Template Models]
         │
         ▼
[Group B: Receipt Data Generation]
         │
         ▼
[Group C: Thermal Printer Integration]
         │
         ▼
[Group D: PDF & Email Receipts]
         │
         ▼
[Group E: Receipt API & Storage]
         │
         ▼
[Group F: Testing & Documentation]
```

---

## Task Index

### Group A: Receipt Template Models (Tasks 01-16)

Customizable receipt template configuration.

| Task # | Task Name | Description | Est. Time |
|--------|-----------|-------------|-----------|
| 01 | Create receipt submodule | Create `apps/pos/receipts/` package with __init__.py | 10 min |
| 02 | Define receipt type constants | Create constants: SALE, REFUND, VOID, REPRINT | 10 min |
| 03 | Define paper size constants | Create constants: THERMAL_80MM, THERMAL_58MM, A4 | 10 min |
| 04 | Create ReceiptTemplate model | Define model with name, paper_size, is_default fields | 30 min |
| 05 | Add header configuration | Add show_logo, logo_size, business_name_override fields | 25 min |
| 06 | Add header text fields | Add header_line_1, header_line_2, header_line_3 for custom text | 20 min |
| 07 | Add address display settings | Add show_address, show_phone, show_email flags | 15 min |
| 08 | Add item display settings | Add show_sku, show_barcode, show_tax_per_item flags | 20 min |
| 09 | Add totals display settings | Add show_subtotal, show_tax_breakdown, show_savings flags | 20 min |
| 10 | Add payment display settings | Add show_payment_method, show_change, show_balance_due | 15 min |
| 11 | Add footer configuration | Add footer_line_1, footer_line_2, footer_line_3 fields | 20 min |
| 12 | Add return policy field | Add return_policy_text with default template | 15 min |
| 13 | Add QR code settings | Add show_qr_code, qr_code_content_type (URL/receipt_id) | 20 min |
| 14 | Add font settings | Add font_size, bold_totals, use_separator_lines flags | 15 min |
| 15 | Create template inheritance | Default template with tenant-specific overrides | 25 min |
| 16 | Create ReceiptTemplate admin | Admin with preview, clone template action | 30 min |

---

### Group B: Receipt Data Generation (Tasks 17-34)

Build receipt data structure from transaction.

| Task # | Task Name | Description | Est. Time |
|--------|-----------|-------------|-----------|
| 17 | Create Receipt model | Define model to store generated receipts | 30 min |
| 18 | Add receipt reference field | Add receipt_number with auto-generation | 20 min |
| 19 | Add transaction links | Add cart FK, transaction_id reference | 15 min |
| 20 | Add receipt type field | Add type: SALE, REFUND, VOID, DUPLICATE | 15 min |
| 21 | Add generation timestamp | Add generated_at, printed_at, emailed_at | 15 min |
| 22 | Add receipt data JSON | Store complete receipt data as JSON for archival | 20 min |
| 23 | Create ReceiptBuilder service | Service to build receipt data from cart/transaction | 30 min |
| 24 | Implement build_header method | Generate header section with business info | 25 min |
| 25 | Implement build_transaction_info | Generate transaction date, number, cashier | 25 min |
| 26 | Implement build_items method | Generate itemized list with descriptions, prices | 30 min |
| 27 | Handle variant display | Show variant options (size, color) in item name | 20 min |
| 28 | Implement build_totals method | Generate subtotal, discounts, tax, grand total | 25 min |
| 29 | Implement tax breakdown | Show VAT amount separately for compliance | 20 min |
| 30 | Implement build_payments method | Generate payment method(s) and amounts | 25 min |
| 31 | Implement build_footer method | Generate footer with return policy, thank you | 20 min |
| 32 | Implement build_qr_code | Generate QR code data for digital receipt | 25 min |
| 33 | Create receipt number generator | Generate unique receipt numbers per tenant | 25 min |
| 34 | Add duplicate receipt handling | Mark reprints as DUPLICATE with original reference | 20 min |

---

### Group C: Thermal Printer Integration (Tasks 35-52)

ESC/POS thermal printer support.

| Task # | Task Name | Description | Est. Time |
|--------|-----------|-------------|-----------|
| 35 | Create thermal printer service | Service for ESC/POS command generation | 30 min |
| 36 | Define ESC/POS command constants | Initialize, cut, text modes, alignment commands | 25 min |
| 37 | Implement text formatting | Bold, underline, double-width, double-height text | 30 min |
| 38 | Implement alignment commands | Left, center, right alignment | 20 min |
| 39 | Implement line spacing | Configure line spacing for readability | 15 min |
| 40 | Implement paper cutting | Full cut and partial cut commands | 15 min |
| 41 | Implement logo printing | Print logo image using ESC/POS graphics | 35 min |
| 42 | Implement barcode printing | Print receipt barcode for scanning | 30 min |
| 43 | Implement QR code printing | Print QR code using ESC/POS | 30 min |
| 44 | Create 80mm layout formatter | Format receipt for 48-character width | 30 min |
| 45 | Create 58mm layout formatter | Format receipt for 32-character width | 25 min |
| 46 | Implement separator lines | Print dashed separator lines | 15 min |
| 47 | Create cash drawer command | Send pulse to open cash drawer | 20 min |
| 48 | Create ThermalPrintRenderer | Render receipt data to ESC/POS bytes | 35 min |
| 49 | Implement network printer support | Print via TCP/IP to network printers | 30 min |
| 50 | Implement USB printer support | Print via WebUSB API | 35 min |
| 51 | Add print job queue | Queue print jobs for reliability | 25 min |
| 52 | Add print retry logic | Retry failed prints with notification | 20 min |

---

### Group D: PDF & Email Receipts (Tasks 53-68)

Digital receipt formats.

| Task # | Task Name | Description | Est. Time |
|--------|-----------|-------------|-----------|
| 53 | Create PDF receipt template | Design PDF template matching thermal layout | 35 min |
| 54 | Add tenant branding to PDF | Include logo, colors, fonts from tenant settings | 25 min |
| 55 | Implement PDF generator service | Generate PDF from receipt data | 35 min |
| 56 | Add PDF metadata | Add title, author, creation date to PDF | 15 min |
| 57 | Create A4 invoice-style PDF | Full-page format for email/download | 30 min |
| 58 | Create thermal-style PDF | Narrow PDF mimicking thermal receipt | 25 min |
| 59 | Add PDF storage | Store generated PDFs in tenant storage | 25 min |
| 60 | Create email receipt template | HTML email template for receipts | 30 min |
| 61 | Add email styling | Responsive HTML for email clients | 25 min |
| 62 | Implement email sending service | Send receipt email to customer | 25 min |
| 63 | Add PDF attachment option | Attach PDF to email if configured | 20 min |
| 64 | Create receipt lookup page | Web page to view receipt via QR code link | 30 min |
| 65 | Add receipt verification | Verify receipt authenticity via hash | 25 min |
| 66 | Create digital receipt sharing | Generate shareable link for receipt | 20 min |
| 67 | Add SMS receipt option | Send receipt link via SMS (optional) | 25 min |
| 68 | Create receipt preferences | Customer preference for receipt type | 20 min |

---

### Group E: Receipt API & Storage (Tasks 69-78)

API endpoints and receipt storage.

| Task # | Task Name | Description | Est. Time |
|--------|-----------|-------------|-----------|
| 69 | Create ReceiptSerializer | Serializer with receipt data, download URLs | 25 min |
| 70 | Create ReceiptTemplateSerializer | Serializer for template configuration | 25 min |
| 71 | Create ReceiptViewSet | ViewSet for receipt retrieval and reprint | 30 min |
| 72 | Add generate receipt endpoint | POST /transactions/{id}/receipt/ to generate | 25 min |
| 73 | Add print receipt endpoint | POST /receipts/{id}/print/ to trigger print | 25 min |
| 74 | Add email receipt endpoint | POST /receipts/{id}/email/ to send email | 20 min |
| 75 | Add download PDF endpoint | GET /receipts/{id}/pdf/ to download PDF | 20 min |
| 76 | Create ReceiptTemplateViewSet | ViewSet for template management | 25 min |
| 77 | Add receipt search endpoint | Search receipts by date, customer, amount | 25 min |
| 78 | Create receipt export | Export receipts for accounting integration | 25 min |

---

### Group F: Testing & Documentation (Tasks 79-82)

Comprehensive testing and documentation.

| Task # | Task Name | Description | Est. Time |
|--------|-----------|-------------|-----------|
| 79 | Create receipt generation tests | Test data generation from transactions | 35 min |
| 80 | Create thermal printer tests | Test ESC/POS command generation | 35 min |
| 81 | Create PDF/email tests | Test PDF generation and email delivery | 30 min |
| 82 | Write receipt module documentation | Document templates, API, printer setup | 40 min |

---

## Expected File Structure

```
apps/pos/receipts/
├── __init__.py
├── models/
│   ├── __init__.py
│   ├── receipt_template.py       # Tasks 04-15
│   └── receipt.py                # Tasks 17-22
├── services/
│   ├── __init__.py
│   ├── receipt_builder.py        # Tasks 23-34
│   ├── thermal_printer.py        # Tasks 35-52
│   ├── pdf_generator.py          # Tasks 55-59
│   └── email_service.py          # Tasks 60-63
├── templates/
│   ├── pdf/
│   │   ├── thermal_style.html    # Task 58
│   │   └── a4_invoice.html       # Task 57
│   └── email/
│       └── receipt_email.html    # Task 60
├── serializers/
│   ├── __init__.py
│   ├── receipt.py                # Task 69
│   └── template.py               # Task 70
├── views/
│   ├── __init__.py
│   ├── receipt.py                # Tasks 71-75, 77-78
│   └── template.py               # Task 76
├── admin.py                      # Task 16
├── urls.py
└── constants.py                  # Tasks 02-03
```

---

## Progress Tracking

| Group | Description | Tasks | Completed | Status |
|-------|-------------|-------|-----------|--------|
| A | Receipt Template Models | 16 | 0 | 🔴 Not Started |
| B | Receipt Data Generation | 18 | 0 | 🔴 Not Started |
| C | Thermal Printer Integration | 18 | 0 | 🔴 Not Started |
| D | PDF & Email Receipts | 16 | 0 | 🔴 Not Started |
| E | Receipt API & Storage | 10 | 0 | 🔴 Not Started |
| F | Testing & Documentation | 4 | 0 | 🔴 Not Started |
| **Total** | | **82** | **0** | 🔴 |

---

## Notes for AI Agents

### Receipt Sections Structure
```
┌─────────────────────────────────────────┐
│              HEADER                      │
│  [LOGO]                                  │
│  Business Name                           │
│  Address Line 1                          │
│  Address Line 2                          │
│  Phone: +94 XX XXX XXXX                  │
├─────────────────────────────────────────┤
│         TRANSACTION INFO                 │
│  Receipt: RCP-2024-000123               │
│  Date: 2024-01-15 14:30:00              │
│  Cashier: John                          │
│  Terminal: T01                          │
├─────────────────────────────────────────┤
│              ITEMS                       │
│  T-Shirt (Red, L)           × 2   2,000│
│  Jeans (Blue, 32)           × 1   3,500│
│  ────────────────────────────────       │
├─────────────────────────────────────────┤
│              TOTALS                      │
│  Subtotal:                       5,500  │
│  Discount (10%):                  -550  │
│  ────────────────────────────────       │
│  Taxable Amount:                 4,950  │
│  VAT (12%):                        594  │
│  ════════════════════════════════       │
│  GRAND TOTAL:             LKR    5,544  │
├─────────────────────────────────────────┤
│             PAYMENT                      │
│  Cash:                           6,000  │
│  Change:                           456  │
├─────────────────────────────────────────┤
│              FOOTER                      │
│  Thank you for shopping!                │
│  Returns accepted within 7 days         │
│  with this receipt.                     │
│                                         │
│  [QR CODE]                              │
│  Scan for digital receipt               │
└─────────────────────────────────────────┘
```

### Paper Width Specifications
| Paper | Width | Characters | Use Case |
|-------|-------|------------|----------|
| 80mm | 80mm | 48 chars | Standard thermal |
| 58mm | 58mm | 32 chars | Compact thermal |
| A4 | 210mm | N/A | PDF/Email |

### ESC/POS Command Reference
| Command | Hex | Description |
|---------|-----|-------------|
| Initialize | 1B 40 | Reset printer |
| Bold On | 1B 45 01 | Enable bold |
| Bold Off | 1B 45 00 | Disable bold |
| Center | 1B 61 01 | Center align |
| Left | 1B 61 00 | Left align |
| Right | 1B 61 02 | Right align |
| Double Width | 1B 21 20 | Wide text |
| Cut Paper | 1D 56 00 | Full cut |
| Open Drawer | 1B 70 00 | Pulse drawer |

### Receipt Number Format
```
RCP-{YEAR}-{TERMINAL}-{SEQUENCE}
Example: RCP-2024-T01-000123

For refunds: REF-2024-T01-000001
For voids:   VOD-2024-T01-000001
For reprints: Original number + "(DUPLICATE)"
```

### QR Code Content Options
```
Option 1: Receipt URL
https://tenant.lankacommerce.lk/receipts/RCP-2024-T01-000123

Option 2: Receipt Verification
{
  "id": "RCP-2024-T01-000123",
  "amount": 5544.00,
  "date": "2024-01-15",
  "hash": "a1b2c3d4..."
}

Option 3: Simple Receipt ID
RCP-2024-T01-000123
```

### Tax Display (Sri Lanka Compliance)
```
For VAT-registered businesses:
┌─────────────────────────────────────────┐
│  Net Amount (Excl. VAT):         4,950  │
│  VAT @ 12%:                        594  │
│  ────────────────────────────────       │
│  Total (Incl. VAT):              5,544  │
│                                         │
│  VAT Reg No: VATXXXXXXXX                │
└─────────────────────────────────────────┘
```

### Thermal Printer Column Layout (80mm)
```
Col:  1       12      24      36      48
      |       |       |       |       |
      Product Name............  Qty  Price
      xxxxxxxxxxxxxxxxxxxxxxxxxx  99  99,999
      
Left margin: 2 chars
Price column: 8 chars (right-aligned)
Qty column: 4 chars (right-aligned)
Product: Remaining space (truncate/wrap)
```

### Email Receipt Template Variables
```html
{{business_name}}
{{receipt_number}}
{{transaction_date}}
{{items_table}}
{{subtotal}}
{{discount_amount}}
{{tax_amount}}
{{grand_total}}
{{payment_method}}
{{customer_name}}
{{receipt_url}}
{{support_email}}
{{unsubscribe_link}}
```

### Print Job Queue Structure
```javascript
{
  job_id: 'PJ-001',
  printer_ip: '192.168.1.100',
  receipt_id: 'RCP-2024-T01-000123',
  data: '<ESC/POS bytes>',
  status: 'PENDING', // PENDING, PRINTING, COMPLETED, FAILED
  created_at: '2024-01-15T14:30:00Z',
  attempts: 0,
  last_error: null
}
```

### Receipt Storage Path
```
media/tenants/{schema}/receipts/
├── 2024/
│   ├── 01/
│   │   ├── RCP-2024-T01-000123.pdf
│   │   └── RCP-2024-T01-000124.pdf
│   └── 02/
│       └── ...
└── ...
```

---

## Changelog

| Date | Author | Changes |
|------|--------|---------|
| TBD | AI Agent | Initial task summary creation |
