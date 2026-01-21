# Group B: Receipt Data Generation

> **Phase:** 05 - ERP Core Modules Part 2  
> **SubPhase:** 03 - Receipt Generation  
> **Group:** B of F  
> **Tasks Covered:** 17-34  
> **Group Goal:** Build receipt data structure from transaction data

---

## Navigation

- **↑ Parent:** [SubPhase-03 Summary](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [Group A: Receipt Template Models](../Group-A_Receipt-Template-Models/)
- **→ Next Group:** [Group C: Thermal Printer Integration](../Group-C_Thermal-Printer-Integration/)

---

## Group Overview

### Key Outcomes

1. **Receipt Model** - Store generated receipts with metadata
2. **Receipt Reference Field** - Auto-generated unique receipt number
3. **Transaction Links** - FK to cart and transaction ID reference
4. **Receipt Type Field** - SALE, REFUND, VOID, DUPLICATE types
5. **Generation Timestamps** - generated_at, printed_at, emailed_at
6. **Receipt Data JSON** - Complete archival of receipt data
7. **ReceiptBuilder Service** - Build receipt from cart/transaction
8. **Build Header Method** - Generate header with business info
9. **Build Transaction Info** - Generate date, number, cashier details
10. **Build Items Method** - Generate itemized list with prices
11. **Variant Display Handling** - Show size, color in item names
12. **Build Totals Method** - Generate subtotal, discounts, tax, total
13. **Tax Breakdown** - VAT amount separated for compliance
14. **Build Payments Method** - Payment methods and amounts
15. **Build Footer Method** - Footer with return policy, thank you
16. **Build QR Code** - QR code data for digital receipt
17. **Receipt Number Generator** - Unique per-tenant numbers
18. **Duplicate Receipt Handling** - Mark reprints with original ref

### Technology Context

| Technology | Purpose |
|------------|---------|
| Django ORM | Receipt model with JSONField |
| Service Layer | ReceiptBuilder service class |
| QR Code Library | Generate QR code data |
| Sequence Generator | Unique receipt numbering |

---

## Documents in This Group

| # | Document | Tasks | Description |
|---|----------|-------|-------------|
| 01 | `01_Tasks-17-22_Receipt-Model.md` | 17-22 | Receipt model, reference, links, type, timestamps, data JSON |
| 02 | `02_Tasks-23-28_Builder-Items-Totals.md` | 23-28 | ReceiptBuilder service, header, transaction info, items, variants, totals |
| 03 | `03_Tasks-29-34_Tax-Payments-Footer-QR.md` | 29-34 | Tax breakdown, payments, footer, QR code, receipt number, duplicates |

---

## Task Summary

| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 17 | Create Receipt model | Medium | 30 min |
| 18 | Add receipt reference field | Medium | 20 min |
| 19 | Add transaction links | Low | 15 min |
| 20 | Add receipt type field | Low | 15 min |
| 21 | Add generation timestamp | Low | 15 min |
| 22 | Add receipt data JSON | Medium | 20 min |
| 23 | Create ReceiptBuilder service | Medium | 30 min |
| 24 | Implement build_header method | Medium | 25 min |
| 25 | Implement build_transaction_info | Medium | 25 min |
| 26 | Implement build_items method | Medium | 30 min |
| 27 | Handle variant display | Medium | 20 min |
| 28 | Implement build_totals method | Medium | 25 min |
| 29 | Implement tax breakdown | Medium | 20 min |
| 30 | Implement build_payments method | Medium | 25 min |
| 31 | Implement build_footer method | Medium | 20 min |
| 32 | Implement build_qr_code | Medium | 25 min |
| 33 | Create receipt number generator | Medium | 25 min |
| 34 | Add duplicate receipt handling | Medium | 20 min |

---

## Execution Order

```
[Tasks 17-22: Receipt model with all fields]
         │
         ▼
[Tasks 23-27: ReceiptBuilder with header, items, variants]
         │
         ▼
[Tasks 28-31: Totals, tax, payments, footer]
         │
         ▼
[Tasks 32-34: QR code, number generator, duplicates]
```

---

## Expected Deliverables

```
apps/pos/receipts/
├── models/
│   ├── __init__.py
│   └── receipt.py                # Tasks 17-22
├── services/
│   ├── __init__.py
│   ├── builder.py                # Tasks 23-32
│   └── number_generator.py       # Task 33
└── utils/
    └── duplicate_handler.py      # Task 34
```

---

## Notes for AI Agents

### Receipt Model Fields
- receipt_number: Unique identifier (auto-generated)
- cart: FK to POSCart
- transaction_id: UUID reference
- receipt_type: SALE, REFUND, VOID, DUPLICATE
- generated_at: When receipt was created
- printed_at: When receipt was printed (nullable)
- emailed_at: When receipt was emailed (nullable)
- receipt_data: JSONField with complete receipt data
- original_receipt: FK to original (for duplicates)

### Receipt Number Format
```
{PREFIX}{YYYY}{MM}{DD}-{SEQUENCE}
Example: REC20240115-00042
```

### ReceiptBuilder Flow
```
cart/transaction → ReceiptBuilder
       │
       ├── build_header() → Header section
       ├── build_transaction_info() → Transaction details
       ├── build_items() → Line items
       ├── build_totals() → Summary totals
       ├── build_payments() → Payment details
       ├── build_footer() → Footer text
       └── build_qr_code() → QR data
       │
       ▼
   Complete Receipt Data (JSON)
```

### Receipt Data JSON Structure
```json
{
  "header": {
    "business_name": "ABC Store",
    "address": "...",
    "phone": "...",
    "custom_lines": [...]
  },
  "transaction": {
    "receipt_number": "REC20240115-00042",
    "date": "2024-01-15",
    "time": "14:30:45",
    "cashier": "John",
    "terminal": "POS-01"
  },
  "items": [...],
  "totals": {...},
  "payments": [...],
  "footer": {...},
  "qr_code": {...}
}
```

### Tax Breakdown for Sri Lanka
- Show VAT amount separately
- Include VAT registration number
- Format: "VAT (15%): Rs. X,XXX.XX"

### Duplicate Receipt Marking
- receipt_type = DUPLICATE
- original_receipt = FK to original Receipt
- Add "DUPLICATE RECEIPT" watermark
- Show original receipt date/number
