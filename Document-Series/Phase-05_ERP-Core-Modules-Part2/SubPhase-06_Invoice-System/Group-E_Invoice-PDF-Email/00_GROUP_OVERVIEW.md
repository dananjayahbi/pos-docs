# Group E: Invoice PDF & Email

> **Phase:** 05 - ERP Core Modules Part 2  
> **SubPhase:** 06 - Invoice System  
> **Group:** E of F  
> **Tasks Covered:** 67-80  
> **Group Goal:** Implement PDF generation and email delivery for invoices

---

## Navigation

- **↑ Parent:** [SubPhase-06 Summary](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [Group D: Credit Notes & Debit Notes](../Group-D_Credit-Notes-Debit-Notes/)
- **→ Next Group:** [Group F: Invoice API, Testing & Documentation](../Group-F_Invoice-API-Testing-Documentation/)

---

## Group Overview

### Key Outcomes

1. **InvoiceTemplate Model** - PDF template configurations
2. **Template Header Fields** - logo, business_name, address, BRN, VAT
3. **Template Styling Fields** - primary_color, accent_color, font_family
4. **Template Footer Fields** - bank_details, payment_instructions, terms
5. **Template Migrations** - Apply migrations
6. **InvoicePDFGenerator Service** - PDF generation service
7. **PDF Header Section** - Logo, invoice number, dates
8. **PDF Billing Section** - From/to billing addresses
9. **PDF Line Items Table** - Itemized table with columns
10. **PDF Tax Summary Section** - Tax breakdown table
11. **PDF Footer Section** - Bank details, terms, signature
12. **InvoiceEmailService** - Email sending service
13. **Invoice Email Templates** - HTML templates for various emails
14. **Email Celery Tasks** - Async email with retries

### Technology Context

| Technology | Purpose |
|------------|---------|
| ReportLab/WeasyPrint | PDF generation |
| Django Templates | HTML to PDF |
| Django Email | Email sending |
| Celery | Async email tasks |

---

## Documents in This Group

| # | Document | Tasks | Description |
|---|----------|-------|-------------|
| 01 | `01_Tasks-67-71_Template-Model.md` | 67-71 | InvoiceTemplate model, header, styling, footer, migrations |
| 02 | `02_Tasks-72-77_PDF-Generator.md` | 72-77 | PDFGenerator service, header, billing, line items, tax, footer sections |
| 03 | `03_Tasks-78-80_Email-Service.md` | 78-80 | InvoiceEmailService, email templates, Celery tasks |

---

## Task Summary

| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 67 | Create InvoiceTemplate Model | Medium | 25 min |
| 68 | Add Template Header Fields | Medium | 20 min |
| 69 | Add Template Styling Fields | Medium | 20 min |
| 70 | Add Template Footer Fields | Medium | 20 min |
| 71 | Run InvoiceTemplate Migrations | Low | 15 min |
| 72 | Create InvoicePDFGenerator Service | High | 35 min |
| 73 | Implement PDF Header Section | Medium | 25 min |
| 74 | Implement PDF Billing Section | Medium | 25 min |
| 75 | Implement PDF Line Items Table | Medium | 30 min |
| 76 | Implement PDF Tax Summary Section | Medium | 25 min |
| 77 | Implement PDF Footer Section | Medium | 25 min |
| 78 | Create InvoiceEmailService | Medium | 30 min |
| 79 | Create Invoice Email Templates | Medium | 30 min |
| 80 | Create Invoice Email Celery Tasks | Medium | 25 min |

---

## Execution Order

```
[Tasks 67-71: InvoiceTemplate model and migrations]
         │
         ▼
[Tasks 72-77: PDF generation service and sections]
         │
         ▼
[Tasks 78-80: Email service and Celery tasks]
```

---

## Expected Deliverables

```
apps/invoices/
├── models/
│   ├── __init__.py
│   └── invoice_template.py       # Tasks 67-70
├── services/
│   ├── __init__.py
│   ├── pdf_generator.py          # Tasks 72-77
│   └── email_service.py          # Task 78
├── tasks/
│   ├── __init__.py
│   └── email_tasks.py            # Task 80
├── templates/
│   ├── pdf/
│   │   ├── invoice_base.html
│   │   ├── invoice_header.html   # Task 73
│   │   ├── invoice_billing.html  # Task 74
│   │   ├── invoice_items.html    # Task 75
│   │   ├── invoice_tax.html      # Task 76
│   │   └── invoice_footer.html   # Task 77
│   └── emails/
│       ├── invoice_email.html    # Task 79
│       ├── reminder_email.html
│       └── overdue_email.html
└── migrations/
    └── 0005_template.py          # Task 71
```

---

## Notes for AI Agents

### InvoiceTemplate Fields
**Header Fields:**
- tenant: FK to Tenant
- logo: ImageField
- business_name: CharField
- business_address: TextField
- business_phone: CharField
- business_email: EmailField
- business_registration_number: CharField
- vat_registration_number: CharField

**Styling Fields:**
- primary_color: CharField (hex color)
- accent_color: CharField (hex color)
- font_family: CharField
- show_logo: BooleanField
- show_brn: BooleanField
- show_vat: BooleanField

**Footer Fields:**
- bank_name: CharField
- account_name: CharField
- account_number: CharField
- branch: CharField
- swift_code: CharField
- payment_instructions: TextField
- terms_and_conditions: TextField
- signature_image: ImageField
- authorized_signatory: CharField

### PDF Layout Structure
```
┌─────────────────────────────────────┐
│ HEADER                              │
│ [Logo]     INVOICE                  │
│            Invoice #: INV-2026-0001 │
│            Date: 2026-01-15         │
│            Due: 2026-02-14          │
├─────────────────────────────────────┤
│ BILLING                             │
│ From:              To:              │
│ Business Name      Customer Name    │
│ Address            Address          │
│ BRN: XXX           Email            │
│ VAT: XXX           Phone            │
├─────────────────────────────────────┤
│ LINE ITEMS                          │
│ # │ Description │ Qty │ Rate │ Amt │
│ 1 │ Product A   │ 10  │ 500  │5000 │
│ 2 │ Product B   │ 5   │ 200  │1000 │
├─────────────────────────────────────┤
│ TAX SUMMARY                         │
│                   Subtotal: 6,000   │
│                   VAT (12%):  720   │
│                   TOTAL:    6,720   │
├─────────────────────────────────────┤
│ FOOTER                              │
│ Bank Details:                       │
│ Bank: XYZ Bank                      │
│ A/C: 123456789                      │
│                                     │
│ Terms & Conditions                  │
│ [Signature]                         │
└─────────────────────────────────────┘
```

### Email Templates
| Template | Purpose | Trigger |
|----------|---------|---------|
| invoice_email.html | Send invoice to customer | On send() action |
| reminder_email.html | Payment reminder | Before due date |
| overdue_email.html | Overdue notification | After due date |

### Celery Email Tasks
```python
@shared_task(bind=True, max_retries=3)
def send_invoice_email(self, invoice_id, to_email):
    try:
        # Generate PDF, attach, send
    except Exception as exc:
        self.retry(exc=exc, countdown=300)  # Retry in 5 minutes

@shared_task
def send_overdue_reminders():
    """Daily task to send overdue reminders"""
    # Find overdue invoices, send reminders
```

### PDF Generation Libraries
| Library | Pros | Cons |
|---------|------|------|
| WeasyPrint | HTML/CSS support, modern | External dependencies |
| ReportLab | Native Python, fast | Complex layouts |
| xhtml2pdf | Simple HTML to PDF | Limited CSS support |

### LKR Currency Formatting
- Format: `LKR 1,234,567.89`
- Thousands separator: comma
- Decimal places: 2
- Currency symbol: LKR (prefix)
