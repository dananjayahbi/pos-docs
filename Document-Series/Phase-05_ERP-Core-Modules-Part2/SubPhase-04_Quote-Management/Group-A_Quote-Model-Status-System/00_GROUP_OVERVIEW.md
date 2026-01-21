# Group A: Quote Model & Status System

> **Phase:** 05 - ERP Core Modules Part 2  
> **SubPhase:** 04 - Quote Management  
> **Group:** A of F  
> **Tasks Covered:** 01-18  
> **Group Goal:** Create Quote model with lifecycle status management

---

## Navigation

- **↑ Parent:** [SubPhase-04 Summary](../00_TASKS_SUMMARY.md)
- **→ Next Group:** [Group B: Quote Line Items & Calculations](../Group-B_Quote-Line-Items-Calculations/)

---

## Group Overview

### Key Outcomes

1. **Quotes Django App** - New Django app for quotes module
2. **App Registration** - Register quotes in TENANT_APPS
3. **QuoteStatus Choices** - DRAFT, SENT, ACCEPTED, REJECTED, EXPIRED, CONVERTED
4. **Quote Model Core Fields** - quote_number, status, title, timestamps
5. **Quote Customer Fields** - Customer FK, guest contact details
6. **Quote Date Fields** - issue_date, valid_until, status timestamps
7. **Quote Financial Summary** - subtotal, discount, tax, total fields
8. **Quote Metadata Fields** - notes, terms, internal_notes, tags
9. **Quote User References** - created_by, sent_by, accepted_by FKs
10. **Quote Currency Field** - LKR default with USD support
11. **Quote Discount Fields** - Header-level discount type and value
12. **Quote Number Generator** - Auto-generation with yearly sequence
13. **PDF Storage Field** - FileField for generated PDF
14. **Email Tracking Fields** - sent_at, sent_to, opened_at
15. **Conversion Reference** - FK to converted Order
16. **Model Indexes** - Database indexes for performance
17. **Model Constraints** - Validation rules and constraints
18. **Initial Migrations** - Generate and apply migrations

### Technology Context

| Technology | Purpose |
|------------|---------|
| Django ORM | Quote model definition |
| PostgreSQL | Database indexes and constraints |
| Sequence Generator | Quote number generation |
| FileField | PDF storage |

---

## Documents in This Group

| # | Document | Tasks | Description |
|---|----------|-------|-------------|
| 01 | `01_Tasks-01-06_App-Setup-Model-Core.md` | 01-06 | Django app, registration, status choices, core fields, customer, dates |
| 02 | `02_Tasks-07-12_Financial-Metadata-Discount.md` | 07-12 | Financial summary, metadata, user refs, currency, discount, number gen |
| 03 | `03_Tasks-13-18_PDF-Email-Conversion-Migration.md` | 13-18 | PDF storage, email tracking, conversion ref, indexes, constraints, migrations |

---

## Task Summary

| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 01 | Create quotes Django App | Low | 15 min |
| 02 | Register quotes App | Low | 10 min |
| 03 | Define QuoteStatus Choices | Low | 15 min |
| 04 | Create Quote Model Core Fields | Medium | 25 min |
| 05 | Add Quote Customer Fields | Medium | 20 min |
| 06 | Add Quote Date Fields | Medium | 20 min |
| 07 | Add Quote Financial Summary Fields | Medium | 20 min |
| 08 | Add Quote Metadata Fields | Medium | 20 min |
| 09 | Add Quote User Reference Fields | Medium | 20 min |
| 10 | Add Quote Currency Field | Low | 15 min |
| 11 | Add Quote Discount Fields | Medium | 20 min |
| 12 | Create Quote Number Generator | Medium | 25 min |
| 13 | Add Quote PDF Storage Field | Low | 15 min |
| 14 | Add Quote Email Tracking Fields | Medium | 20 min |
| 15 | Add Quote Conversion Reference | Low | 15 min |
| 16 | Create Quote Model Indexes | Medium | 20 min |
| 17 | Create Quote Model Constraints | Medium | 25 min |
| 18 | Run Initial Quote Migrations | Low | 15 min |

---

## Execution Order

```
[Tasks 01-03: Django app setup and status choices]
         │
         ▼
[Tasks 04-06: Core model fields]
         │
         ▼
[Tasks 07-12: Financial, metadata, user fields]
         │
         ▼
[Tasks 13-15: PDF, email, conversion fields]
         │
         ▼
[Tasks 16-18: Indexes, constraints, migrations]
```

---

## Expected Deliverables

```
apps/quotes/
├── __init__.py
├── apps.py                       # Task 01-02
├── models/
│   ├── __init__.py
│   └── quote.py                  # Tasks 04-17
├── constants.py                  # Task 03
├── services/
│   └── number_generator.py       # Task 12
└── migrations/
    └── 0001_initial.py           # Task 18
```

---

## Notes for AI Agents

### QuoteStatus Choices
- **DRAFT**: Initial state, editable
- **SENT**: Sent to customer, locked
- **ACCEPTED**: Customer accepted quote
- **REJECTED**: Customer rejected quote
- **EXPIRED**: Validity period passed
- **CONVERTED**: Converted to sales order

### Quote Number Format
```
QT-{YEAR}-{SEQUENCE}
Example: QT-2026-00001
```

### Quote Model Key Fields
- quote_number: Unique, auto-generated
- status: Choice field with default DRAFT
- title: Optional descriptive title
- customer: FK to Customer (nullable)
- guest_name, guest_email, guest_phone: Guest details
- issue_date: Date quote was created
- valid_until: Quote expiry date
- subtotal, discount_amount, tax_amount, total

### Status Transition Matrix
| From State | Allowed Transitions |
|------------|---------------------|
| DRAFT | SENT |
| SENT | ACCEPTED, REJECTED, EXPIRED |
| ACCEPTED | CONVERTED |
| REJECTED | (terminal) |
| EXPIRED | (terminal) |
| CONVERTED | (terminal) |

### Database Indexes
- quote_number (unique)
- status
- customer_id
- created_at
- valid_until

### Model Constraints
- valid_until > issue_date
- total >= 0
- Cannot edit if status in [SENT, ACCEPTED, CONVERTED]
