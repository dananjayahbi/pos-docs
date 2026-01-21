# Group D: PDF & Email Receipts

> **Phase:** 05 - ERP Core Modules Part 2  
> **SubPhase:** 03 - Receipt Generation  
> **Group:** D of F  
> **Tasks Covered:** 53-68  
> **Group Goal:** Implement digital receipt formats (PDF, email, SMS)

---

## Navigation

- **↑ Parent:** [SubPhase-03 Summary](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [Group C: Thermal Printer Integration](../Group-C_Thermal-Printer-Integration/)
- **→ Next Group:** [Group E: Receipt API & Storage](../Group-E_Receipt-API-Storage/)

---

## Group Overview

### Key Outcomes

1. **PDF Receipt Template** - Design matching thermal layout
2. **Tenant Branding in PDF** - Logo, colors, fonts from settings
3. **PDF Generator Service** - Generate PDF from receipt data
4. **PDF Metadata** - Title, author, creation date
5. **A4 Invoice-Style PDF** - Full-page format for email/download
6. **Thermal-Style PDF** - Narrow PDF mimicking thermal receipt
7. **PDF Storage** - Store PDFs in tenant storage
8. **Email Receipt Template** - HTML email template design
9. **Email Styling** - Responsive HTML for email clients
10. **Email Sending Service** - Send receipt emails to customers
11. **PDF Attachment Option** - Attach PDF to receipt email
12. **Receipt Lookup Page** - Web page for QR code access
13. **Receipt Verification** - Verify authenticity via hash
14. **Digital Receipt Sharing** - Generate shareable links
15. **SMS Receipt Option** - Send receipt link via SMS
16. **Receipt Preferences** - Customer receipt format preference

### Technology Context

| Technology | Purpose |
|------------|---------|
| ReportLab / WeasyPrint | PDF generation |
| Django Email | Email delivery |
| Jinja2 Templates | Email HTML templates |
| MJML | Responsive email design |
| Twilio / SMS Gateway | SMS delivery |

---

## Documents in This Group

| # | Document | Tasks | Description |
|---|----------|-------|-------------|
| 01 | `01_Tasks-53-59_PDF-Generation.md` | 53-59 | PDF template, branding, generator, metadata, styles, storage |
| 02 | `02_Tasks-60-64_Email-Receipts.md` | 60-64 | Email template, styling, sending service, PDF attachment, lookup page |
| 03 | `03_Tasks-65-68_Verification-Sharing-Prefs.md` | 65-68 | Verification, sharing, SMS option, customer preferences |

---

## Task Summary

| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 53 | Create PDF receipt template | High | 35 min |
| 54 | Add tenant branding to PDF | Medium | 25 min |
| 55 | Implement PDF generator service | High | 35 min |
| 56 | Add PDF metadata | Low | 15 min |
| 57 | Create A4 invoice-style PDF | Medium | 30 min |
| 58 | Create thermal-style PDF | Medium | 25 min |
| 59 | Add PDF storage | Medium | 25 min |
| 60 | Create email receipt template | Medium | 30 min |
| 61 | Add email styling | Medium | 25 min |
| 62 | Implement email sending service | Medium | 25 min |
| 63 | Add PDF attachment option | Medium | 20 min |
| 64 | Create receipt lookup page | Medium | 30 min |
| 65 | Add receipt verification | Medium | 25 min |
| 66 | Create digital receipt sharing | Medium | 20 min |
| 67 | Add SMS receipt option | Medium | 25 min |
| 68 | Create receipt preferences | Medium | 20 min |

---

## Execution Order

```
[Tasks 53-56: PDF template, branding, generator, metadata]
         │
         ▼
[Tasks 57-59: A4 and thermal PDFs, storage]
         │
         ▼
[Tasks 60-63: Email template, styling, sending, attachment]
         │
         ▼
[Tasks 64-68: Lookup page, verification, sharing, SMS, prefs]
```

---

## Expected Deliverables

```
apps/pos/receipts/
├── services/
│   ├── pdf_generator.py          # Tasks 53-59
│   ├── email_service.py          # Tasks 60-63
│   ├── sms_service.py            # Task 67
│   └── verification.py           # Task 65
├── templates/
│   └── receipts/
│       ├── pdf/
│       │   ├── a4_invoice.html   # Task 57
│       │   └── thermal_style.html # Task 58
│       ├── email/
│       │   └── receipt.html      # Tasks 60-61
│       └── web/
│           └── lookup.html       # Task 64
└── views/
    └── lookup.py                 # Task 64

frontend/
├── app/
│   └── receipt/
│       └── [id]/
│           └── page.tsx          # Task 64
└── components/
    └── receipts/
        └── ShareModal.tsx        # Task 66
```

---

## Notes for AI Agents

### PDF Generation Options
| Library | Pros | Cons |
|---------|------|------|
| ReportLab | Native Python, fast | Complex API |
| WeasyPrint | HTML to PDF, easy styling | Requires system deps |
| pdfkit | wkhtmltopdf wrapper | External binary |

### PDF Styles
- **A4 Invoice**: Full page, formal layout, good for accounting
- **Thermal Style**: Narrow (80mm), mimics physical receipt

### PDF Metadata Fields
```python
{
    "title": f"Receipt {receipt_number}",
    "author": tenant.business_name,
    "subject": "Sales Receipt",
    "creator": "LankaCommerce Cloud",
    "producer": "LCC Receipt Generator",
    "creation_date": datetime.now()
}
```

### Email Template Structure
```html
<!-- Header with logo -->
<!-- Transaction summary -->
<!-- Itemized list -->
<!-- Totals -->
<!-- Footer with links -->
<!-- Unsubscribe link -->
```

### Email Responsiveness
- Use table-based layout for email clients
- Inline CSS (email clients strip <style>)
- Max width: 600px
- Mobile-friendly breakpoints

### Receipt Lookup URL
```
https://{tenant}.lcc.app/receipt/{receipt_id}?token={verification_token}
```

### Verification Hash
```python
hash = hmac.new(
    key=settings.RECEIPT_SECRET_KEY,
    msg=f"{receipt_id}:{receipt_number}:{amount}",
    digestmod="sha256"
).hexdigest()[:16]
```

### Customer Receipt Preferences
- PRINT: Print thermal receipt
- EMAIL: Send email only
- BOTH: Print and email
- NONE: No receipt (eco mode)

### SMS Message Template
```
Your receipt from {business_name}:
Total: Rs. {amount}
View: {short_url}
```
