# Group D: Quote PDF Generation

> **Phase:** 05 - ERP Core Modules Part 2  
> **SubPhase:** 04 - Quote Management  
> **Group:** D of F  
> **Tasks Covered:** 53-68  
> **Group Goal:** Generate professional PDF quotations with branding

---

## Navigation

- **↑ Parent:** [SubPhase-04 Summary](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [Group C: Quote Services & Business Logic](../Group-C_Quote-Services-Business-Logic/)
- **→ Next Group:** [Group E: Quote API & Email Integration](../Group-E_Quote-API-Email-Integration/)

---

## Group Overview

### Key Outcomes

1. **QuoteTemplate Model** - PDF template configurations
2. **Template Header Fields** - logo, business name, address, contact
3. **Template Styling Fields** - colors, fonts, theme
4. **Template Content Fields** - footer, terms, messages
5. **Template Layout Options** - show/hide columns configuration
6. **Template Migrations** - Apply migrations
7. **QuotePDFGenerator Service** - PDF generation service
8. **PDF Header Section** - Business logo, quote number, date
9. **PDF Customer Section** - Customer/recipient details
10. **PDF Line Items Table** - Itemized table with prices
11. **PDF Totals Section** - Subtotal, discount, tax, total
12. **PDF Footer Section** - Terms, validity, signature
13. **PDF QR Code** - QR code for online view
14. **PDF Storage** - Save to FileField
15. **PDF Regeneration** - Regenerate on quote changes
16. **PDF Download Endpoint** - API for downloading PDF

### Technology Context

| Technology | Purpose |
|------------|---------|
| ReportLab/WeasyPrint | PDF generation |
| Pillow | Logo image processing |
| qrcode | QR code generation |
| Django FileField | PDF storage |

---

## Documents in This Group

| # | Document | Tasks | Description |
|---|----------|-------|-------------|
| 01 | `01_Tasks-53-58_Template-Model.md` | 53-58 | QuoteTemplate model, header, styling, content, layout, migrations |
| 02 | `02_Tasks-59-64_PDF-Generator-Sections.md` | 59-64 | PDFGenerator service, header, customer, items, totals, footer sections |
| 03 | `03_Tasks-65-68_QR-Storage-Regeneration-Download.md` | 65-68 | QR code, PDF storage, regeneration logic, download endpoint |

---

## Task Summary

| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 53 | Create QuoteTemplate Model | Medium | 25 min |
| 54 | Add Template Header Fields | Medium | 20 min |
| 55 | Add Template Styling Fields | Medium | 20 min |
| 56 | Add Template Content Fields | Medium | 20 min |
| 57 | Add Template Layout Options | Medium | 20 min |
| 58 | Run QuoteTemplate Migrations | Low | 15 min |
| 59 | Create QuotePDFGenerator Service | High | 30 min |
| 60 | Implement PDF Header Section | Medium | 25 min |
| 61 | Implement PDF Customer Section | Medium | 25 min |
| 62 | Implement PDF Line Items Table | High | 30 min |
| 63 | Implement PDF Totals Section | Medium | 25 min |
| 64 | Implement PDF Footer Section | Medium | 25 min |
| 65 | Add PDF QR Code | Medium | 25 min |
| 66 | Implement PDF Storage | Medium | 25 min |
| 67 | Create PDF Regeneration Logic | Medium | 25 min |
| 68 | Implement PDF Download Endpoint | Medium | 25 min |

---

## Execution Order

```
[Tasks 53-58: QuoteTemplate model with all fields]
         │
         ▼
[Tasks 59-64: PDF generator with sections]
         │
         ▼
[Tasks 65-68: QR code, storage, regeneration, download]
```

---

## Expected Deliverables

```
apps/quotes/
├── models/
│   ├── __init__.py
│   └── template.py               # Tasks 53-57
├── services/
│   ├── __init__.py
│   └── pdf_generator.py          # Tasks 59-67
├── views/
│   └── pdf_download.py           # Task 68
└── migrations/
    └── 0004_quotetemplate.py     # Task 58
```

---

## Notes for AI Agents

### QuoteTemplate Key Fields
- name: Template name
- is_default: Boolean
- logo_url: FileField/URLField
- business_name: CharField
- address_line_1, address_line_2: CharField
- phone, email, website: CharField
- primary_color: CharField (hex color)
- accent_color: CharField (hex color)
- font_family: CharField
- footer_text: TextField
- terms_text: TextField
- thank_you_message: TextField
- show_images: BooleanField
- show_sku: BooleanField
- show_discount_column: BooleanField
- show_tax_column: BooleanField

### PDF Layout Structure
```
┌─────────────────────────────────────────┐
│ [LOGO]           QUOTATION              │
│              QT-2026-00001              │
│ Business Name    Date: 15-Jan-2026      │
│ Address          Valid Until: 14-Feb    │
├─────────────────────────────────────────┤
│ QUOTE TO:                               │
│ Customer Name                           │
│ Address                                 │
│ Phone / Email                           │
├─────────────────────────────────────────┤
│ # │ Description │ Qty │ Price │ Total   │
│───┼─────────────┼─────┼───────┼─────────│
│ 1 │ Product A   │  2  │ 1,000 │  2,000  │
│ 2 │ Service B   │  1  │ 5,000 │  5,000  │
├─────────────────────────────────────────┤
│                    Subtotal:    7,000   │
│                    Discount:     -700   │
│                    VAT (15%):    945    │
│                    TOTAL:      7,245    │
├─────────────────────────────────────────┤
│ Terms & Conditions:                     │
│ - Payment due within 30 days            │
│ - Prices valid for 30 days              │
├─────────────────────────────────────────┤
│ [QR Code]    Signature: ____________    │
└─────────────────────────────────────────┘
```

### QR Code Content
```
https://{tenant}.lcc.app/quote/{quote_id}?token={access_token}
```

### PDF Storage Path
```
quotes/{tenant_id}/{year}/{month}/{quote_number}.pdf
```

### PDF Regeneration Triggers
- Quote line items changed
- Quote header discount changed
- Quote details (notes, terms) changed
- Manual regeneration request
