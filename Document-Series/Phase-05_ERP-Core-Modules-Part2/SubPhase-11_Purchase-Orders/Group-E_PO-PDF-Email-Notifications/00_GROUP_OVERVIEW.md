# Group E: PO PDF, Email & Notifications

> **Phase:** 05 - ERP Core Modules Part 2  
> **SubPhase:** 11 - Purchase Orders  
> **Group:** E of F  
> **Tasks Covered:** 69-82  
> **Group Goal:** Implement PDF generation, email sending, and notifications

---

## Navigation

- **↑ Parent:** [SubPhase-11 Summary](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [Group D: Receiving Workflow & GRN](../Group-D_Receiving-Workflow-GRN/)
- **→ Next Group:** [Group F: API, Testing & Documentation](../Group-F_API-Testing-Documentation/)

---

## Group Overview

### Key Outcomes

1. **POTemplate Model** - PO PDF template configuration
2. **Template Header Fields** - logo, company_name, address
3. **Template Styling Fields** - colors, fonts, layout
4. **POTemplate Migrations** - Apply migrations
5. **POPDFGenerator Service** - Generate PO PDFs
6. **PDF Header Section** - Company, PO number
7. **PDF Vendor Section** - Vendor details
8. **PDF Line Items Table** - Itemized table
9. **PDF Totals Section** - Subtotal, tax, shipping, total
10. **PDF Terms Section** - Payment terms, delivery instructions
11. **POEmailService** - Send PO emails
12. **PO Email Template** - HTML template for PO delivery
13. **PO Email Celery Task** - Async email sending
14. **Delivery Reminder Task** - Reminder for overdue deliveries

### Technology Context

| Technology | Purpose |
|------------|---------|
| ReportLab/WeasyPrint | PDF generation |
| Django Email | Email sending |
| Celery | Async tasks |
| HTML Templates | Email templates |

---

## Documents in This Group

| # | Document | Tasks | Description |
|---|----------|-------|-------------|
| 01 | `01_Tasks-69-72_Template-Model.md` | 69-72 | POTemplate model, header/styling fields, migrations |
| 02 | `02_Tasks-73-78_PDF-Generator.md` | 73-78 | POPDFGenerator service, all PDF sections |
| 03 | `03_Tasks-79-82_Email-Notifications.md` | 79-82 | POEmailService, template, email/reminder tasks |

---

## Task Summary

| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 69 | Create POTemplate Model | Medium | 25 min |
| 70 | Add Template Header Fields | Medium | 20 min |
| 71 | Add Template Styling Fields | Medium | 20 min |
| 72 | Run POTemplate Migrations | Low | 15 min |
| 73 | Create POPDFGenerator Service | High | 35 min |
| 74 | Implement PDF Header Section | Medium | 25 min |
| 75 | Implement PDF Vendor Section | Medium | 25 min |
| 76 | Implement PDF Line Items Table | High | 30 min |
| 77 | Implement PDF Totals Section | Medium | 25 min |
| 78 | Implement PDF Terms Section | Medium | 20 min |
| 79 | Create POEmailService | Medium | 25 min |
| 80 | Create PO Email Template | Medium | 25 min |
| 81 | Create PO Email Celery Task | Medium | 25 min |
| 82 | Create Delivery Reminder Task | Medium | 25 min |

---

## Execution Order

```
[Tasks 69-72: POTemplate model]
         │
         ▼
[Tasks 73-78: PDF generation]
         │
         ▼
[Tasks 79-82: Email and notifications]
```

---

## Expected Deliverables

```
apps/purchases/
├── models/
│   ├── __init__.py
│   └── po_template.py            # Tasks 69-71
├── services/
│   ├── __init__.py
│   ├── pdf_generator.py          # Tasks 73-78
│   └── email_service.py          # Task 79
├── templates/
│   └── email/
│       ├── po_delivery.html      # Task 80
│       └── delivery_reminder.html
├── tasks/
│   ├── __init__.py
│   ├── email_tasks.py            # Task 81
│   └── reminder_tasks.py         # Task 82
└── migrations/
    └── 0005_template.py          # Task 72
```

---

## Notes for AI Agents

### POTemplate Fields
- tenant: OneToOne to Tenant
- logo: ImageField
- company_name: CharField
- company_address: TextField
- company_phone: CharField
- company_email: EmailField
- header_color: CharField (hex)
- accent_color: CharField (hex)
- font_family: CharField
- show_vendor_address: Boolean
- show_delivery_address: Boolean
- footer_text: TextField
- terms_text: TextField

### PDF Structure
```
┌─────────────────────────────────────────────┐
│ [LOGO]              PURCHASE ORDER          │
│ Company Name         PO-2026-00001          │
│ Company Address      Date: 2026-01-15       │
├─────────────────────────────────────────────┤
│ VENDOR:              SHIP TO:               │
│ ABC Electronics      Main Warehouse         │
│ 123 Main Street      456 Storage Road       │
│ Colombo              Colombo                │
├─────────────────────────────────────────────┤
│ # │ Description │ Qty │ Price │ Total      │
├─────────────────────────────────────────────┤
│ 1 │ Samsung TV  │ 10  │85,000 │ 850,000    │
│ 2 │ LG Soundbar │ 20  │15,000 │ 300,000    │
├─────────────────────────────────────────────┤
│                      Subtotal: Rs.1,150,000 │
│                      Tax (18%): Rs. 207,000 │
│                      Shipping:  Rs.   5,000 │
│                      TOTAL:    Rs.1,362,000 │
├─────────────────────────────────────────────┤
│ Payment Terms: Net 30                       │
│ Expected Delivery: 2026-01-25               │
│ Notes: Please ensure quality packaging      │
├─────────────────────────────────────────────┤
│ Footer: Thank you for your business         │
└─────────────────────────────────────────────┘
```

### POPDFGenerator Methods
- generate_pdf(po_id) → bytes
- save_pdf(po_id) → file_path
- render_header(po, template)
- render_vendor_section(po, template)
- render_line_items(po, template)
- render_totals(po, template)
- render_terms(po, template)
- render_footer(template)

### PO Email Structure
```
Subject: Purchase Order PO-2026-00001 from [Company]

Dear [Vendor Contact],

Please find attached Purchase Order PO-2026-00001.

Order Summary:
- Total Items: 30
- Total Value: Rs. 1,362,000
- Expected Delivery: 2026-01-25
- Payment Terms: Net 30

Please acknowledge receipt of this order.

[Attached: PO-2026-00001.pdf]

Thank you,
[Company Name]
```

### Delivery Reminder Schedule
| Days Overdue | Action |
|--------------|--------|
| 0 (due date) | "Expected delivery today" |
| 3 days | First overdue reminder |
| 7 days | Second overdue reminder |
| 14 days | Escalation to manager |

### Email Task Flow
```
send_po_email.delay(po_id):
1. Generate PDF if not exists
2. Load email template
3. Get vendor primary contact email
4. Send email with PDF attachment
5. Log communication
6. Update po.sent_at
```
