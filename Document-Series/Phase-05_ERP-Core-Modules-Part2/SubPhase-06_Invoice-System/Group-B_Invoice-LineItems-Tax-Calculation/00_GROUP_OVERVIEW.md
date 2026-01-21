# Group B: Invoice Line Items & Tax Calculation

> **Phase:** 05 - ERP Core Modules Part 2  
> **SubPhase:** 06 - Invoice System  
> **Group:** B of F  
> **Tasks Covered:** 19-34  
> **Group Goal:** Implement invoice line items and Sri Lanka tax calculations

---

## Navigation

- **↑ Parent:** [SubPhase-06 Summary](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [Group A: Invoice Model & Types](../Group-A_Invoice-Model-Types/)
- **→ Next Group:** [Group C: Invoice Generation Services](../Group-C_Invoice-Generation-Services/)

---

## Group Overview

### Key Outcomes

1. **InvoiceLineItem Model** - Line item with FK to Invoice, position field
2. **Product Reference Fields** - Product/variant FK for product tracking
3. **Description Fields** - description, sku for custom/service items
4. **Quantity Fields** - quantity, unit_of_measure
5. **Pricing Fields** - unit_price, original_price
6. **Line Discount Fields** - discount_type, discount_value, discount_amount
7. **Line Tax Fields** - tax_rate, tax_amount, is_taxable, tax_code
8. **HSN/SAC Code** - hsn_code for goods classification
9. **Line Total Field** - Computed line total
10. **Line Item Migrations** - Apply migrations
11. **Invoice Calculation Service** - Subtotal, tax, discounts, total
12. **VAT Calculation** - Standard VAT at 12% rate
13. **SVAT Calculation** - Simplified VAT with different rules
14. **Tax Breakdown Generator** - Tax breakdown by rate for footer
15. **Header Discount Applicator** - Invoice-level discount before tax
16. **Recalculation Signal** - Auto-recalculate on line changes

### Technology Context

| Technology | Purpose |
|------------|---------|
| Django ORM | InvoiceLineItem model |
| Django Signals | Auto-recalculation triggers |
| Decimal | Precise financial calculations |
| Service Layer | Calculation logic separation |

---

## Documents in This Group

| # | Document | Tasks | Description |
|---|----------|-------|-------------|
| 01 | `01_Tasks-19-24_LineItem-Model-Core.md` | 19-24 | InvoiceLineItem model, product ref, description, quantity, pricing, discounts |
| 02 | `02_Tasks-25-28_Tax-HSN-Total-Migration.md` | 25-28 | Tax fields, HSN code, line total, migrations |
| 03 | `03_Tasks-29-34_Calculation-Services.md` | 29-34 | Calculation service, VAT/SVAT, tax breakdown, header discount, signal |

---

## Task Summary

| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 19 | Create InvoiceLineItem Model | Medium | 25 min |
| 20 | Add Line Item Product Reference | Medium | 20 min |
| 21 | Add Line Item Description Fields | Medium | 20 min |
| 22 | Add Line Item Quantity Fields | Medium | 20 min |
| 23 | Add Line Item Pricing Fields | Medium | 20 min |
| 24 | Add Line Item Discount Fields | Medium | 20 min |
| 25 | Add Line Item Tax Fields | Medium | 20 min |
| 26 | Add Line Item HSN/SAC Code | Low | 15 min |
| 27 | Add Line Item Total Field | Medium | 20 min |
| 28 | Run InvoiceLineItem Migrations | Low | 15 min |
| 29 | Create Invoice Calculation Service | High | 30 min |
| 30 | Implement VAT Calculation | Medium | 25 min |
| 31 | Implement SVAT Calculation | Medium | 25 min |
| 32 | Implement Tax Breakdown Generator | Medium | 25 min |
| 33 | Implement Header Discount Applicator | Medium | 25 min |
| 34 | Create Invoice Recalculation Signal | Medium | 25 min |

---

## Execution Order

```
[Tasks 19-24: InvoiceLineItem core fields]
         │
         ▼
[Tasks 25-28: Tax, HSN, total, migrations]
         │
         ▼
[Tasks 29-34: Calculation services and signals]
```

---

## Expected Deliverables

```
apps/invoices/
├── models/
│   ├── __init__.py
│   ├── invoice.py
│   └── invoice_line_item.py      # Tasks 19-27
├── services/
│   ├── __init__.py
│   └── calculation_service.py    # Tasks 29-33
├── signals.py                    # Task 34
└── migrations/
    └── 0002_invoicelineitem.py   # Task 28
```

---

## Notes for AI Agents

### InvoiceLineItem Key Fields
- invoice: FK to Invoice
- position: Integer for ordering
- product: FK to Product (nullable for custom/service items)
- variant: FK to ProductVariant (nullable)
- description: Item description
- sku: Stock keeping unit
- quantity: DecimalField
- unit_of_measure: CharField (e.g., "pcs", "kg", "hrs")
- unit_price: Price per unit
- original_price: Price before discounts
- discount_type: PERCENTAGE, FIXED
- discount_value, discount_amount
- tax_rate: Percentage (e.g., 12 for 12%)
- tax_amount: Calculated tax
- is_taxable: Boolean
- tax_code: Tax category code
- hsn_code: Harmonized System Nomenclature code
- line_total: Computed total

### Sri Lanka Tax Rates
| Tax Type | Rate | Description |
|----------|------|-------------|
| Standard VAT | 12% | Standard value-added tax |
| SVAT | 0% | Simplified VAT (zero-rated for eligible businesses) |
| Exempt | 0% | Tax-exempt items |
| NBT | 2% | Nation Building Tax (if applicable) |

### VAT Calculation
```
line_total = (quantity * unit_price) - discount_amount
tax_amount = line_total * (tax_rate / 100) if is_taxable else 0
final_total = line_total + tax_amount
```

### SVAT Rules
- Simplified VAT for registered businesses
- Different documentation requirements
- Specific invoice format requirements
- Quarterly/annual filing options

### Tax Breakdown Format
```json
{
  "rates": [
    {"rate": 12, "taxable_amount": 50000, "tax_amount": 6000},
    {"rate": 0, "taxable_amount": 10000, "tax_amount": 0}
  ],
  "total_taxable": 60000,
  "total_tax": 6000
}
```

### Header Discount Application
```
subtotal = sum(line_totals)
header_discount = apply_discount(subtotal, discount_type, discount_value)
taxable_amount = subtotal - header_discount
tax = calculate_tax(taxable_amount)
total = taxable_amount + tax
```
