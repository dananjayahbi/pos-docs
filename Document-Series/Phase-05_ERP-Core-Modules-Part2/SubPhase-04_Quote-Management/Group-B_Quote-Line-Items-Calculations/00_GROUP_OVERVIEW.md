# Group B: Quote Line Items & Calculations

> **Phase:** 05 - ERP Core Modules Part 2  
> **SubPhase:** 04 - Quote Management  
> **Group:** B of F  
> **Tasks Covered:** 19-36  
> **Group Goal:** Implement quote line items and calculation services

---

## Navigation

- **↑ Parent:** [SubPhase-04 Summary](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [Group A: Quote Model & Status System](../Group-A_Quote-Model-Status-System/)
- **→ Next Group:** [Group C: Quote Services & Business Logic](../Group-C_Quote-Services-Business-Logic/)

---

## Group Overview

### Key Outcomes

1. **QuoteLineItem Model** - Line item with FK to Quote, position field
2. **Product Reference Fields** - Product/variant FK for linked items
3. **Custom Description Fields** - Custom description, SKU for non-product items
4. **Quantity Fields** - Quantity, unit of measure
5. **Pricing Fields** - unit_price, original_price, cost_price
6. **Line Discount Fields** - discount_type, discount_value, discount_amount
7. **Line Tax Fields** - tax_rate, tax_amount, is_taxable
8. **Line Total Field** - Computed line total
9. **Line Notes Field** - Line-specific notes
10. **Line Ordering** - Position field for drag-drop reordering
11. **Line Item Migrations** - Apply migrations
12. **Quote Calculation Service** - Service for calculating totals
13. **Line Total Calculator** - Calculate individual line totals
14. **Tax Calculator** - Calculate tax based on rates
15. **Header Discount Applicator** - Apply header discounts
16. **Grand Total Calculator** - Calculate final total
17. **Recalculation Signal** - Auto-recalculate on line changes
18. **Price Snapshotting** - Capture product prices at creation

### Technology Context

| Technology | Purpose |
|------------|---------|
| Django ORM | QuoteLineItem model |
| Django Signals | Auto-recalculation triggers |
| Decimal | Precise financial calculations |
| Service Layer | Calculation logic separation |

---

## Documents in This Group

| # | Document | Tasks | Description |
|---|----------|-------|-------------|
| 01 | `01_Tasks-19-24_LineItem-Model-Core.md` | 19-24 | QuoteLineItem model, product ref, custom desc, quantity, pricing, discounts |
| 02 | `02_Tasks-25-29_Tax-Total-Notes-Migration.md` | 25-29 | Tax fields, line total, notes, ordering, migrations |
| 03 | `03_Tasks-30-36_Calculation-Services.md` | 30-36 | Calculation service, line/tax/discount/total calculators, signals, snapshots |

---

## Task Summary

| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 19 | Create QuoteLineItem Model | Medium | 25 min |
| 20 | Add Line Item Product Reference | Medium | 20 min |
| 21 | Add Line Item Custom Description | Medium | 20 min |
| 22 | Add Line Item Quantity Fields | Low | 15 min |
| 23 | Add Line Item Pricing Fields | Medium | 20 min |
| 24 | Add Line Item Discount Fields | Medium | 20 min |
| 25 | Add Line Item Tax Fields | Medium | 20 min |
| 26 | Add Line Item Total Field | Medium | 20 min |
| 27 | Add Line Item Notes Field | Low | 15 min |
| 28 | Create Line Item Ordering | Medium | 20 min |
| 29 | Run QuoteLineItem Migrations | Low | 15 min |
| 30 | Create Quote Calculation Service | Medium | 25 min |
| 31 | Implement Line Total Calculator | Medium | 25 min |
| 32 | Implement Tax Calculator | Medium | 25 min |
| 33 | Implement Header Discount Applicator | Medium | 25 min |
| 34 | Implement Grand Total Calculator | Medium | 25 min |
| 35 | Create Quote Recalculation Signal | Medium | 25 min |
| 36 | Add Price Snapshotting | Medium | 25 min |

---

## Execution Order

```
[Tasks 19-24: QuoteLineItem core fields]
         │
         ▼
[Tasks 25-29: Tax, totals, notes, ordering, migrations]
         │
         ▼
[Tasks 30-34: Calculation service and methods]
         │
         ▼
[Tasks 35-36: Signals and price snapshotting]
```

---

## Expected Deliverables

```
apps/quotes/
├── models/
│   ├── __init__.py
│   ├── quote.py
│   └── line_item.py              # Tasks 19-29
├── services/
│   ├── __init__.py
│   └── calculation.py            # Tasks 30-34
├── signals/
│   ├── __init__.py
│   └── recalculation.py          # Task 35
└── migrations/
    └── 0002_quotelineitem.py     # Task 29
```

---

## Notes for AI Agents

### QuoteLineItem Key Fields
- quote: FK to Quote
- position: Integer for ordering
- product: FK to Product (nullable)
- variant: FK to ProductVariant (nullable)
- custom_description: Text for non-product items
- custom_sku: Custom SKU for non-product items
- quantity: DecimalField
- unit_of_measure: CharField
- unit_price: DecimalField (snapshotted)
- original_price: DecimalField (original before discount)
- cost_price: DecimalField (for margin calculation)
- discount_type: PERCENTAGE, FIXED
- discount_value: DecimalField
- discount_amount: DecimalField (calculated)
- tax_rate: DecimalField (percentage)
- tax_amount: DecimalField (calculated)
- is_taxable: BooleanField
- line_total: DecimalField (calculated)
- notes: TextField

### Line Total Calculation
```
line_total = (quantity * unit_price) - discount_amount + tax_amount
```

### Tax Calculation
```
taxable_amount = (quantity * unit_price) - discount_amount
tax_amount = taxable_amount * (tax_rate / 100) if is_taxable else 0
```

### Header Discount Application
```
# After summing line items
subtotal = sum(line.line_total for line in lines)
if discount_type == 'PERCENTAGE':
    discount_amount = subtotal * (discount_value / 100)
else:
    discount_amount = discount_value
```

### Grand Total
```
total = subtotal - header_discount + additional_tax
```

### Price Snapshotting
- Capture unit_price from product at quote creation
- Store original_price for comparison
- Price changes after creation don't affect quote
