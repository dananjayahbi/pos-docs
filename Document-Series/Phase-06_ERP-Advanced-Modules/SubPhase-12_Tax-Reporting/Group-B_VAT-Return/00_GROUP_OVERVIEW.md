# Group B: VAT Return

> **Phase:** 06 - ERP Advanced Modules  
> **SubPhase:** 12 - Tax Reporting  
> **Group:** B of F  
> **Tasks Covered:** 17-34  
> **Group Goal:** Implement VAT return generation with output VAT, input VAT, and IRD-compliant exports

---

## Navigation

- **↑ Parent:** [00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [Group-A_Tax-Configuration](../Group-A_Tax-Configuration/)
- **→ Next Group:** [Group-C_PAYE-Reporting](../Group-C_PAYE-Reporting/)

---

## Group Overview

This group implements the VAT return generation system for Sri Lanka's 8% VAT. Creates the VATReturn model to store return data including output VAT (sales), input VAT (purchases), and net VAT payable/refundable. Implements VATReturnGenerator service to calculate VAT from sales and purchase invoices, handle zero-rated and exempt transactions, and support SVAT adjustments. Generates IRD-compliant PDF and CSV exports.

### Key Outcomes

- VATReturn model with period link
- Output VAT field (VAT on sales)
- Input VAT field (VAT on purchases)
- Net VAT payable calculation
- Return line items JSONField
- Filed date and user tracking
- VATReturnGenerator service class
- Get sales VAT method (output VAT)
- Get purchase VAT method (input VAT)
- Zero-rated sales calculation
- Exempt sales calculation
- SVAT adjustment handling
- VAT return PDF template (IRD format)
- CSV export for IRD portal upload
- VAT summary grouped by rate
- API endpoint for VAT returns

### Technology Context

- **VAT Rate:** 8% standard rate (2024)
- **SVAT:** Simplified VAT for exports
- **IRD Format:** Inland Revenue Department templates
- **Calculation:** From sales/purchase invoice lines

---

## Documents in This Group

| # | Document | Description | Tasks Covered |
|---|----------|-------------|---------------|
| 01 | `01_Tasks-17-24_VATReturn-Model.md` | Create VATReturn model with all fields | 17-24 |
| 02 | `02_Tasks-25-34_VATReturn-Generator.md` | Create VATReturnGenerator with calculations and exports | 25-34 |

---

## Task Summary

| Task # | Task Name | Complexity | Dependencies |
|--------|-----------|------------|--------------|
| 17 | Create VATReturn Model | Medium | Task 16 |
| 18 | Add Return Period FK | Low | Task 17 |
| 19 | Add Output VAT Field | Low | Task 17 |
| 20 | Add Input VAT Field | Low | Task 17 |
| 21 | Add Net VAT Payable | Low | Task 17 |
| 22 | Add Return Line Items | Medium | Task 17 |
| 23 | Add Filed Date | Low | Task 17 |
| 24 | Run VATReturn Migrations | Low | Task 23 |
| 25 | Create VATReturnGenerator | High | Task 24 |
| 26 | Add Get Sales VAT Method | Medium | Task 25 |
| 27 | Add Get Purchase VAT Method | Medium | Task 26 |
| 28 | Add Get Zero-Rated Sales | Medium | Task 27 |
| 29 | Add Get Exempt Sales | Medium | Task 28 |
| 30 | Add SVAT Calculation | High | Task 29 |
| 31 | Create VAT Return PDF Template | Medium | Task 30 |
| 32 | Create VAT Return CSV Export | Medium | Task 31 |
| 33 | Add VAT Summary by Rate | Low | Task 32 |
| 34 | Create VAT Return API Endpoint | Low | Task 33 |

---

## Execution Order

```
Task 17: Create VATReturn Model
    │
    ├─────────────────────────────────────────────────────────┐
    ▼                                                         ▼
Task 18: Period FK    Tasks 19-22: VAT Fields           Task 23: Filed Date
    │                 (Output, Input, Net, Line Items)        │
    └─────────────────────────┬───────────────────────────────┘
                              ▼
                         Task 24: Run Migrations
                              │
                              ▼
                         Task 25: Create VATReturnGenerator
                              │
                              ▼
                         Task 26: Get Sales VAT
                              │
                              ▼
                         Task 27: Get Purchase VAT
                              │
                              ▼
                         Task 28: Zero-Rated Sales
                              │
                              ▼
                         Task 29: Exempt Sales
                              │
                              ▼
                         Task 30: SVAT Calculation
                              │
                              ▼
                         Task 31: PDF Template
                              │
                              ▼
                         Task 32: CSV Export
                              │
                              ▼
                         Task 33: Summary by Rate
                              │
                              ▼
                         Task 34: API Endpoint
```

---

## Expected Deliverables

```
apps/accounting/
├── tax/
│   ├── __init__.py
│   ├── enums.py
│   └── generators/
│       ├── __init__.py
│       └── vat_return.py      # VATReturnGenerator
├── models/
│   └── vat_return.py          # VATReturn model
├── templates/
│   └── tax/
│       └── vat_return.html    # IRD format PDF template
├── views/
│   └── tax.py                 # Add VAT endpoint
├── serializers/
│   └── vat_return.py          # VATReturn serializer
└── migrations/
    └── 0019_vatreturn.py
```

---

## Notes for AI Agents

### Sri Lanka VAT Rates (2024)
- Standard Rate: 8%
- Zero Rate: 0% (exports, certain goods)
- Exempt: Not subject to VAT

### VAT Return Structure
```
VAT RETURN FOR PERIOD: January 2026

SECTION A: OUTPUT VAT (Sales)
1. Standard-rated supplies (8%)     1,000,000    80,000
2. Zero-rated supplies (0%)           500,000         0
3. Exempt supplies                    200,000         -
   TOTAL OUTPUT VAT                              80,000

SECTION B: INPUT VAT (Purchases)
4. Local purchases (8%)               600,000    48,000
5. Imports                            100,000     8,000
   TOTAL INPUT VAT                               56,000

SECTION C: NET VAT
6. Net VAT Payable (A - B)                       24,000
   (or Refund if negative)
```

### SVAT (Simplified VAT) Rules
- For registered exporters
- Input VAT claims on zero-rated exports
- Requires SVAT certificate
- Special calculation adjustments

### Filing Deadlines
- Monthly filers: 20th of following month
- Quarterly filers: 20th of month after quarter

### Line Items JSONField Structure
```json
{
  "standard_rated": [
    {"invoice": "INV-001", "taxable": 50000, "vat": 4000}
  ],
  "zero_rated": [...],
  "exempt": [...],
  "purchases": [...]
}
```

### VAT Calculation From Invoices
- Sales Invoices: Sum VAT from tax_amount field
- Purchase Invoices: Sum VAT from supplier invoices
- Group by VAT rate for summary
