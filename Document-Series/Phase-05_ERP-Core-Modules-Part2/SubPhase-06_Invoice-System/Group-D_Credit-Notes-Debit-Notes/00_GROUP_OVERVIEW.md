# Group D: Credit Notes & Debit Notes

> **Phase:** 05 - ERP Core Modules Part 2  
> **SubPhase:** 06 - Invoice System  
> **Group:** D of F  
> **Tasks Covered:** 51-66  
> **Group Goal:** Implement credit notes and debit notes for invoice adjustments

---

## Navigation

- **↑ Parent:** [SubPhase-06 Summary](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [Group C: Invoice Generation Services](../Group-C_Invoice-Generation-Services/)
- **→ Next Group:** [Group E: Invoice PDF & Email](../Group-E_Invoice-PDF-Email/)

---

## Group Overview

### Key Outcomes

1. **CreditNoteReason Choices** - RETURN, OVERCHARGE, DISCOUNT, DAMAGED, OTHER
2. **DebitNoteReason Choices** - UNDERCHARGE, ADDITIONAL_CHARGE, ADJUSTMENT, OTHER
3. **Credit Note Creation** - Create linked to original invoice
4. **Credit Note Number Generator** - CN-{YEAR}-{SEQUENCE} format
5. **Credit Note Line Items** - Copy/select from original invoice
6. **Credit Note Application** - Apply to invoice balance
7. **Debit Note Creation** - Create linked to original invoice
8. **Debit Note Number Generator** - DN-{YEAR}-{SEQUENCE} format
9. **Debit Note Line Items** - Add line items for additional charges
10. **Debit Note Application** - Add to invoice balance
11. **Link to Original Invoice** - Maintain related_invoice FK
12. **Balance Recalculation** - Recalculate with credit/debit notes
13. **Credit Note PDF Template** - PDF template for credit notes
14. **Debit Note PDF Template** - PDF template for debit notes
15. **Credit Limit Check** - Validate credit doesn't exceed total
16. **Credit/Debit Migrations** - Apply migrations

### Technology Context

| Technology | Purpose |
|------------|---------|
| Django ORM | Credit/Debit note models |
| Service Layer | Note creation and application |
| PDF Generation | Note PDF templates |
| Balance Tracking | Invoice balance recalculation |

---

## Documents in This Group

| # | Document | Tasks | Description |
|---|----------|-------|-------------|
| 01 | `01_Tasks-51-56_Credit-Note-System.md` | 51-56 | CreditNoteReason, creation, number gen, line items, application |
| 02 | `02_Tasks-57-62_Debit-Note-Balance.md` | 57-62 | DebitNoteReason, creation, number gen, line items, application, linkage, balance |
| 03 | `03_Tasks-63-66_PDF-Templates-Validation-Migration.md` | 63-66 | Credit/Debit PDF templates, credit limit check, migrations |

---

## Task Summary

| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 51 | Define CreditNoteReason Choices | Low | 15 min |
| 52 | Define DebitNoteReason Choices | Low | 15 min |
| 53 | Implement Credit Note Creation | High | 30 min |
| 54 | Add Credit Note Number Generator | Medium | 20 min |
| 55 | Implement Credit Note Line Items | Medium | 25 min |
| 56 | Implement Credit Note Application | Medium | 25 min |
| 57 | Implement Debit Note Creation | High | 30 min |
| 58 | Add Debit Note Number Generator | Medium | 20 min |
| 59 | Implement Debit Note Line Items | Medium | 25 min |
| 60 | Implement Debit Note Application | Medium | 25 min |
| 61 | Link Credit/Debit to Original Invoice | Medium | 20 min |
| 62 | Implement Invoice Balance Recalculation | Medium | 25 min |
| 63 | Create Credit Note PDF Template | Medium | 30 min |
| 64 | Create Debit Note PDF Template | Medium | 30 min |
| 65 | Implement Credit Limit Check | Medium | 25 min |
| 66 | Run Credit/Debit Note Migrations | Low | 15 min |

---

## Execution Order

```
[Tasks 51-56: Credit note system]
         │
         ▼
[Tasks 57-62: Debit note system and balance]
         │
         ▼
[Tasks 63-66: PDF templates, validation, migrations]
```

---

## Expected Deliverables

```
apps/invoices/
├── models/
│   ├── __init__.py
│   ├── invoice.py                # Updated with credit/debit fields
│   └── invoice_line_item.py
├── constants.py                  # Updated with reason choices
├── services/
│   ├── __init__.py
│   ├── invoice_service.py
│   ├── credit_note_service.py    # Tasks 53-56
│   └── debit_note_service.py     # Tasks 57-60
├── templates/
│   └── pdf/
│       ├── credit_note.html      # Task 63
│       └── debit_note.html       # Task 64
└── migrations/
    └── 0004_credit_debit.py      # Task 66
```

---

## Notes for AI Agents

### CreditNoteReason Choices
- **RETURN**: Customer returned goods
- **OVERCHARGE**: Overcharged on original invoice
- **DISCOUNT**: Post-invoice discount applied
- **DAMAGED**: Goods received damaged
- **OTHER**: Other reason (requires notes)

### DebitNoteReason Choices
- **UNDERCHARGE**: Undercharged on original invoice
- **ADDITIONAL_CHARGE**: Additional charges incurred
- **ADJUSTMENT**: Price adjustment
- **OTHER**: Other reason (requires notes)

### Credit Note Workflow
```
Original Invoice (INV-2026-00001)
       │ Total: LKR 50,000
       │
       ▼
Create Credit Note (CN-2026-00001)
       │ Reason: RETURN
       │ Amount: LKR 10,000
       │
       ▼
Apply to Invoice
       │ New Balance: LKR 40,000
       │
       ▼
Invoice Balance Updated
```

### Debit Note Workflow
```
Original Invoice (INV-2026-00001)
       │ Total: LKR 50,000
       │
       ▼
Create Debit Note (DN-2026-00001)
       │ Reason: ADDITIONAL_CHARGE
       │ Amount: LKR 5,000
       │
       ▼
Apply to Invoice
       │ New Balance: LKR 55,000
       │
       ▼
Invoice Balance Updated
```

### Balance Recalculation Formula
```
balance_due = original_total 
            - amount_paid 
            - sum(credit_notes) 
            + sum(debit_notes)
```

### Credit Limit Validation
```python
def validate_credit_note_amount(invoice, credit_amount):
    max_credit = invoice.total - invoice.total_credits_applied
    if credit_amount > max_credit:
        raise ValidationError(
            f"Credit note cannot exceed remaining balance of {max_credit}"
        )
```

### Credit/Debit Note Fields
Both types use the Invoice model with:
- type: CREDIT_NOTE or DEBIT_NOTE
- related_invoice: FK to original invoice
- reason: Choice field
- reason_notes: TextField

### PDF Template Differences

| Element | Credit Note | Debit Note |
|---------|-------------|------------|
| Title | "CREDIT NOTE" | "DEBIT NOTE" |
| Color | Green accent | Orange accent |
| Reference | "Credit for Invoice #{ref}" | "Additional charges for Invoice #{ref}" |
| Amount | Shows reduction | Shows addition |

### Linkage Requirements
- Credit/Debit notes MUST reference original invoice
- Original invoice tracks all related notes
- Notes cannot be created for DRAFT invoices
- Notes cannot exceed original invoice total (for credit)
