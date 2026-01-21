# Group A: Vendor Bill Model & Core

> **Phase:** 05 - ERP Core Modules Part 2  
> **SubPhase:** 12 - Vendor Bills & Payments  
> **Group:** A of F  
> **Tasks Covered:** 01-16  
> **Group Goal:** Create vendor_bills Django app with VendorBill model and core fields

---

## Navigation

- **↑ Parent:** [SubPhase-12 Summary](../00_TASKS_SUMMARY.md)
- **→ Next Group:** [Group B: Bill Line Items & Matching](../Group-B_Bill-Line-Items-Matching/)

---

## Group Overview

### Key Outcomes

1. **Vendor Bills Django App** - New Django app for vendor bills
2. **App Registration** - Register vendor_bills in TENANT_APPS
3. **BillStatus Choices** - DRAFT, PENDING, APPROVED, PARTIAL_PAID, PAID, CANCELLED, DISPUTED
4. **VendorBill Model Core** - bill_number, status, created_at, updated_at
5. **Bill Vendor Fields** - vendor FK, vendor_invoice_number
6. **Bill PO Reference** - purchase_order FK (optional for manual bills)
7. **Bill Date Fields** - bill_date, received_date, due_date
8. **Bill Financial Fields** - subtotal, tax_amount, discount_amount, total, currency
9. **Bill Payment Fields** - amount_paid, amount_due, payment_terms
10. **Bill User Fields** - created_by, approved_by ForeignKeys
11. **Bill Notes Fields** - notes, internal_notes, dispute_reason
12. **Bill Document Fields** - attachment FileField for invoice scan
13. **Bill Matching Fields** - is_matched, matched_at, matching_variance
14. **Bill Number Generator** - Auto-generate BILL-{YEAR}-{SEQUENCE}
15. **Bill Model Indexes** - Indexes for status, vendor, bill_number, due_date
16. **Initial Bill Migrations** - Generate and apply migrations

### Technology Context

| Technology | Purpose |
|------------|---------|
| Django ORM | VendorBill model definition |
| PostgreSQL | Indexes and constraints |
| FileField | Invoice attachment storage |
| Sequence Generator | Bill number generation |

---

## Documents in This Group

| # | Document | Tasks | Description |
|---|----------|-------|-------------|
| 01 | `01_Tasks-01-06_App-Setup-Model-Core.md` | 01-06 | Django app, registration, status choices, core/vendor/PO fields |
| 02 | `02_Tasks-07-12_Date-Financial-User-Notes-Document.md` | 07-12 | Date, financial, payment, user, notes, document fields |
| 03 | `03_Tasks-13-16_Matching-Number-Index-Migration.md` | 13-16 | Matching fields, number generator, indexes, migrations |

---

## Task Summary

| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 01 | Create vendor_bills Django App | Low | 15 min |
| 02 | Register vendor_bills App | Low | 10 min |
| 03 | Define BillStatus Choices | Low | 15 min |
| 04 | Create VendorBill Model Core | Medium | 25 min |
| 05 | Add Bill Vendor Fields | Medium | 20 min |
| 06 | Add Bill PO Reference | Medium | 20 min |
| 07 | Add Bill Date Fields | Medium | 20 min |
| 08 | Add Bill Financial Fields | Medium | 25 min |
| 09 | Add Bill Payment Fields | Medium | 20 min |
| 10 | Add Bill User Fields | Medium | 20 min |
| 11 | Add Bill Notes Fields | Low | 15 min |
| 12 | Add Bill Document Fields | Low | 15 min |
| 13 | Add Bill Matching Fields | Medium | 20 min |
| 14 | Create Bill Number Generator | Medium | 25 min |
| 15 | Create Bill Model Indexes | Medium | 20 min |
| 16 | Run Initial Bill Migrations | Low | 15 min |

---

## Execution Order

```
[Tasks 01-06: Django app setup, status, core fields]
         │
         ▼
[Tasks 07-12: Date, financial, user, document fields]
         │
         ▼
[Tasks 13-16: Matching, number gen, indexes, migrations]
```

---

## Expected Deliverables

```
apps/vendor_bills/
├── __init__.py
├── apps.py                       # Tasks 01-02
├── models/
│   ├── __init__.py
│   └── vendor_bill.py            # Tasks 04-15
├── constants.py                  # Task 03
├── services/
│   └── number_generator.py       # Task 14
└── migrations/
    └── 0001_initial.py           # Task 16
```

---

## Notes for AI Agents

### BillStatus Choices
- **DRAFT**: Initial state, editable
- **PENDING**: Submitted for approval
- **APPROVED**: Ready for payment
- **PARTIAL_PAID**: Partial payment made
- **PAID**: Fully paid
- **CANCELLED**: Cancelled bill
- **DISPUTED**: Under dispute

### Bill Status Flow
```
DRAFT → PENDING → APPROVED → PARTIAL_PAID → PAID
                     ↓
               DISPUTED
                     ↓
              CANCELLED
```

### Bill Number Format
```
BILL-{YEAR}-{SEQUENCE}
Example: BILL-2026-00001

Sequence resets annually.
Prefix configurable in BillSettings.
```

### VendorBill Key Fields
- bill_number: CharField (unique, auto-generated)
- vendor: FK to Vendor
- vendor_invoice_number: CharField (vendor's reference)
- purchase_order: FK to PurchaseOrder (optional)
- status: Choice field
- bill_date: Date
- received_date: Date
- due_date: Date
- subtotal: Decimal
- tax_amount: Decimal
- discount_amount: Decimal
- total: Decimal
- currency: CharField (default LKR)
- amount_paid: Decimal
- amount_due: Decimal (computed)
- attachment: FileField

### Payment Terms Options
| Term | Days |
|------|------|
| CIA | 0 (Cash in Advance) |
| COD | 0 (Cash on Delivery) |
| Net 15 | 15 |
| Net 30 | 30 |
| Net 45 | 45 |
| Net 60 | 60 |

### User Fields
- created_by: FK to User (required)
- approved_by: FK to User (nullable)

### Database Indexes
- bill_number (unique)
- status
- vendor
- due_date
- bill_date
- (status, vendor) composite
- (status, due_date) composite

### Matching Fields
- is_matched: Boolean
- matched_at: DateTime
- matching_variance: Decimal (difference from PO/GRN)
