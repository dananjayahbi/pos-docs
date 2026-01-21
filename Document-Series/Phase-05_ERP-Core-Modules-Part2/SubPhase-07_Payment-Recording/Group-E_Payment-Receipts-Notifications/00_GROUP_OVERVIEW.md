# Group E: Payment Receipts & Notifications

> **Phase:** 05 - ERP Core Modules Part 2  
> **SubPhase:** 07 - Payment Recording  
> **Group:** E of F  
> **Tasks Covered:** 65-76  
> **Group Goal:** Implement receipt generation and payment notifications

---

## Navigation

- **↑ Parent:** [SubPhase-07 Summary](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [Group D: Refunds & Adjustments](../Group-D_Refunds-Adjustments/)
- **→ Next Group:** [Group F: Payment API, Testing & Documentation](../Group-F_Payment-API-Testing-Documentation/)

---

## Group Overview

### Key Outcomes

1. **PaymentReceipt Model** - Payment receipt records
2. **Receipt Number Generator** - REC-{YEAR}-{SEQUENCE} format
3. **Receipt PDF Storage** - FileField for generated PDF
4. **Receipt Migrations** - Apply migrations
5. **ReceiptPDFGenerator Service** - PDF generation service
6. **Receipt Header Section** - Business info, receipt number, date
7. **Receipt Payment Details** - Method, amount, reference
8. **Receipt Invoice Link** - Show invoice(s) payment applies to
9. **Receipt Footer** - Thank you message, contact info
10. **PaymentEmailService** - Email sending service
11. **Payment Email Templates** - Payment received, refund processed
12. **Payment Celery Tasks** - Async receipt generation, email

### Technology Context

| Technology | Purpose |
|------------|---------|
| ReportLab/WeasyPrint | PDF generation |
| Django Templates | HTML to PDF |
| Django Email | Email sending |
| Celery | Async tasks |

---

## Documents in This Group

| # | Document | Tasks | Description |
|---|----------|-------|-------------|
| 01 | `01_Tasks-65-68_Receipt-Model.md` | 65-68 | PaymentReceipt model, number generator, PDF storage, migrations |
| 02 | `02_Tasks-69-73_Receipt-PDF-Generator.md` | 69-73 | ReceiptPDFGenerator service, header, payment details, invoice link, footer |
| 03 | `03_Tasks-74-76_Email-Service-Tasks.md` | 74-76 | PaymentEmailService, email templates, Celery tasks |

---

## Task Summary

| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 65 | Create PaymentReceipt Model | Medium | 25 min |
| 66 | Add Receipt Number Generator | Medium | 20 min |
| 67 | Add Receipt PDF Storage | Low | 15 min |
| 68 | Run Receipt Model Migrations | Low | 15 min |
| 69 | Create ReceiptPDFGenerator Service | High | 30 min |
| 70 | Implement Receipt Header Section | Medium | 25 min |
| 71 | Implement Receipt Payment Details | Medium | 25 min |
| 72 | Implement Receipt Invoice Link | Medium | 25 min |
| 73 | Implement Receipt Footer | Medium | 20 min |
| 74 | Create PaymentEmailService | Medium | 25 min |
| 75 | Create Payment Email Templates | Medium | 30 min |
| 76 | Create Payment Celery Tasks | Medium | 25 min |

---

## Execution Order

```
[Tasks 65-68: PaymentReceipt model and migrations]
         │
         ▼
[Tasks 69-73: Receipt PDF generation service]
         │
         ▼
[Tasks 74-76: Email service and Celery tasks]
```

---

## Expected Deliverables

```
apps/payments/
├── models/
│   ├── __init__.py
│   └── payment_receipt.py        # Tasks 65-67
├── services/
│   ├── __init__.py
│   ├── receipt_generator.py      # Tasks 69-73
│   └── email_service.py          # Task 74
├── tasks/
│   ├── __init__.py
│   ├── receipt_tasks.py          # Task 76
│   └── email_tasks.py            # Task 76
├── templates/
│   ├── pdf/
│   │   └── payment_receipt.html
│   └── emails/
│       ├── payment_received.html # Task 75
│       └── refund_processed.html # Task 75
└── migrations/
    └── 0005_receipt.py           # Task 68
```

---

## Notes for AI Agents

### PaymentReceipt Model Fields
- receipt_number: Unique identifier
- payment: OneToOne to Payment
- generated_at: DateTimeField
- pdf_file: FileField
- sent_to_email: EmailField (nullable)
- sent_at: DateTimeField (nullable)

### Receipt Number Format
```
REC-{YEAR}-{SEQUENCE}
Example: REC-2026-00001
```

### Receipt PDF Layout
```
┌─────────────────────────────────────┐
│ HEADER                              │
│ [Logo]     PAYMENT RECEIPT          │
│            Receipt #: REC-2026-0001 │
│            Date: 2026-01-15         │
├─────────────────────────────────────┤
│ BUSINESS INFO                       │
│ Lanka Commerce Ltd.                 │
│ Address, Phone, Email               │
│ BRN: XXX  VAT: XXX                  │
├─────────────────────────────────────┤
│ PAYMENT DETAILS                     │
│ Payment Method: CARD (Visa)         │
│ Reference: **** **** **** 1234      │
│ Amount: LKR 10,000.00               │
├─────────────────────────────────────┤
│ APPLIED TO                          │
│ Invoice #INV-2026-00001: LKR 10,000 │
├─────────────────────────────────────┤
│ FOOTER                              │
│ Thank you for your payment!         │
│ Questions? Contact us at...         │
└─────────────────────────────────────┘
```

### Payment Method Display
| Method | Display Format |
|--------|----------------|
| CASH | "Cash" |
| CARD | "Visa/MasterCard (****1234)" |
| BANK_TRANSFER | "Bank Transfer - Ref: {ref}" |
| MOBILE | "FriMi - Transaction: {id}" |
| CHECK | "Check #{number} - {bank}" |
| STORE_CREDIT | "Store Credit" |

### Email Templates
| Template | Purpose | Trigger |
|----------|---------|---------|
| payment_received.html | Confirm payment | On payment complete |
| refund_processed.html | Confirm refund | On refund processed |

### Celery Tasks
```python
@shared_task(bind=True, max_retries=3)
def generate_and_send_receipt(self, payment_id, email):
    try:
        # Generate PDF
        # Attach to email
        # Send email
    except Exception as exc:
        self.retry(exc=exc, countdown=300)

@shared_task
def send_payment_confirmation(payment_id):
    # Send confirmation email
    pass

@shared_task
def send_refund_notification(refund_id):
    # Send refund notification
    pass
```

### LKR Currency Formatting in Receipt
- Format: `LKR 1,234,567.89`
- Thousands separator: comma
- Decimal places: 2
- Right-aligned for amounts
