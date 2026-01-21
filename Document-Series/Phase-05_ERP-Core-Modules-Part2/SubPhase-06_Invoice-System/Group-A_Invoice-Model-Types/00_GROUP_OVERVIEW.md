# Group A: Invoice Model & Types

> **Phase:** 05 - ERP Core Modules Part 2  
> **SubPhase:** 06 - Invoice System  
> **Group:** A of F  
> **Tasks Covered:** 01-18  
> **Group Goal:** Create Invoice model with Sri Lanka compliance fields

---

## Navigation

- **↑ Parent:** [SubPhase-06 Summary](../00_TASKS_SUMMARY.md)
- **→ Next Group:** [Group B: Invoice Line Items & Tax Calculation](../Group-B_Invoice-LineItems-Tax-Calculation/)

---

## Group Overview

### Key Outcomes

1. **Invoices Django App** - New Django app for invoices module
2. **App Registration** - Register invoices in TENANT_APPS
3. **InvoiceType Choices** - STANDARD, SVAT, CREDIT_NOTE, DEBIT_NOTE
4. **InvoiceStatus Choices** - DRAFT, ISSUED, SENT, PAID, PARTIAL, OVERDUE, CANCELLED, VOID
5. **Invoice Core Fields** - invoice_number, type, status, created_at
6. **Invoice Customer Fields** - Customer FK, name, email, phone, address
7. **Invoice Business Fields** - business_name, address, phone, email
8. **Invoice Compliance Fields** - BRN, VAT registration, SVAT number
9. **Invoice Date Fields** - issue_date, due_date, paid_date, cancelled_date
10. **Invoice Financial Fields** - subtotal, discount, tax, total, amount_paid, balance
11. **Invoice Tax Breakdown** - JSONField for multiple tax rates
12. **Invoice Reference Fields** - Order FK, related_invoice FK, external_reference
13. **Invoice Metadata Fields** - notes, terms, internal_notes
14. **Invoice Currency Field** - LKR default with exchange rate
15. **Invoice Number Generator** - Auto-generation with yearly sequence per type
16. **Invoice PDF Storage** - FileField for generated PDF
17. **Model Indexes** - Database indexes for performance
18. **Initial Migrations** - Generate and apply migrations

### Technology Context

| Technology | Purpose |
|------------|---------|
| Django ORM | Invoice model definition |
| PostgreSQL | Indexes and constraints |
| JSONField | Tax breakdown storage |
| Sequence Generator | Invoice number generation |

---

## Documents in This Group

| # | Document | Tasks | Description |
|---|----------|-------|-------------|
| 01 | `01_Tasks-01-06_App-Setup-Model-Core.md` | 01-06 | Django app, registration, type/status choices, core fields, customer |
| 02 | `02_Tasks-07-12_Business-Compliance-Financial.md` | 07-12 | Business, compliance, dates, financial, tax breakdown, references |
| 03 | `03_Tasks-13-18_Metadata-Currency-Number-Migration.md` | 13-18 | Metadata, currency, number gen, PDF storage, indexes, migrations |

---

## Task Summary

| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 01 | Create invoices Django App | Low | 15 min |
| 02 | Register invoices App | Low | 10 min |
| 03 | Define InvoiceType Choices | Low | 15 min |
| 04 | Define InvoiceStatus Choices | Low | 15 min |
| 05 | Create Invoice Model Core Fields | Medium | 25 min |
| 06 | Add Invoice Customer Fields | Medium | 20 min |
| 07 | Add Invoice Business Fields | Medium | 20 min |
| 08 | Add Invoice Compliance Fields | Medium | 20 min |
| 09 | Add Invoice Date Fields | Medium | 20 min |
| 10 | Add Invoice Financial Fields | Medium | 25 min |
| 11 | Add Invoice Tax Breakdown Fields | Medium | 20 min |
| 12 | Add Invoice Reference Fields | Medium | 20 min |
| 13 | Add Invoice Metadata Fields | Medium | 20 min |
| 14 | Add Invoice Currency Field | Low | 15 min |
| 15 | Create Invoice Number Generator | Medium | 25 min |
| 16 | Add Invoice PDF Storage Field | Low | 15 min |
| 17 | Create Invoice Model Indexes | Medium | 20 min |
| 18 | Run Initial Invoice Migrations | Low | 15 min |

---

## Execution Order

```
[Tasks 01-04: Django app setup and choice enums]
         │
         ▼
[Tasks 05-08: Core fields, customer, business, compliance]
         │
         ▼
[Tasks 09-14: Dates, financial, tax, references, metadata, currency]
         │
         ▼
[Tasks 15-18: Number generator, PDF storage, indexes, migrations]
```

---

## Expected Deliverables

```
apps/invoices/
├── __init__.py
├── apps.py                       # Tasks 01-02
├── models/
│   ├── __init__.py
│   └── invoice.py                # Tasks 05-17
├── constants.py                  # Tasks 03-04
├── services/
│   └── number_generator.py       # Task 15
└── migrations/
    └── 0001_initial.py           # Task 18
```

---

## Notes for AI Agents

### InvoiceType Choices
- **STANDARD**: Regular invoice for goods/services (INV-{YEAR}-{SEQ})
- **SVAT**: Simplified VAT invoice (SVAT-{YEAR}-{SEQ})
- **CREDIT_NOTE**: Reduces original invoice amount (CN-{YEAR}-{SEQ})
- **DEBIT_NOTE**: Increases original invoice amount (DN-{YEAR}-{SEQ})

### InvoiceStatus Choices
- **DRAFT**: Initial state, editable
- **ISSUED**: Invoice finalized, number assigned
- **SENT**: Email sent to customer
- **PAID**: Full payment received
- **PARTIAL**: Partial payment received
- **OVERDUE**: Past due date, unpaid/partial
- **CANCELLED**: Cancelled before issue
- **VOID**: Voided after issue (for corrections)

### Sri Lanka Compliance Fields
- **business_registration_number (BRN)**: Company registration
- **vat_registration_number**: VAT registration number
- **svat_number**: Simplified VAT registration

### Invoice Number Format by Type
| Type | Format | Example |
|------|--------|---------|
| STANDARD | INV-{YEAR}-{SEQ} | INV-2026-00001 |
| SVAT | SVAT-{YEAR}-{SEQ} | SVAT-2026-00001 |
| CREDIT_NOTE | CN-{YEAR}-{SEQ} | CN-2026-00001 |
| DEBIT_NOTE | DN-{YEAR}-{SEQ} | DN-2026-00001 |

### Status Transition Matrix
| From State | Allowed Transitions |
|------------|---------------------|
| DRAFT | ISSUED, CANCELLED |
| ISSUED | SENT, PAID, PARTIAL, VOID |
| SENT | PAID, PARTIAL, OVERDUE, VOID |
| PARTIAL | PAID, OVERDUE, VOID |
| OVERDUE | PAID, PARTIAL, VOID |
| PAID | (terminal) |
| CANCELLED | (terminal) |
| VOID | (terminal) |

### Database Indexes
- invoice_number (unique)
- type
- status
- customer_id
- issue_date
- due_date
- order_id
