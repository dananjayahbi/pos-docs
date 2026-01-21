# Group B: Bill Line Items & Matching

> **Phase:** 05 - ERP Core Modules Part 2  
> **SubPhase:** 12 - Vendor Bills & Payments  
> **Group:** B of F  
> **Tasks Covered:** 17-32  
> **Group Goal:** Create bill line items with 3-way matching (PO → GRN → Bill)

---

## Navigation

- **↑ Parent:** [SubPhase-12 Summary](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [Group A: Vendor Bill Model & Core](../Group-A_Vendor-Bill-Model-Core/)
- **→ Next Group:** [Group C: Bill Services & Processing](../Group-C_Bill-Services-Processing/)

---

## Group Overview

### Key Outcomes

1. **BillLineItem Model** - Line items with FK to VendorBill
2. **Line Item Product Fields** - product FK, variant FK, vendor_sku
3. **Line Item Description** - item_description for non-product items
4. **Line Item Quantity Fields** - quantity, quantity_ordered, quantity_received
5. **Line Item Pricing Fields** - unit_price, billed_price, tax_rate
6. **Line Item Total Field** - line_total computed field
7. **Line Item PO Reference** - po_line FK for matching
8. **Line Item GRN Reference** - grn_line FK for matching
9. **BillLineItem Migrations** - Apply migrations
10. **MatchingService Class** - Service for 3-way matching logic
11. **PO-to-Bill Matching** - Match bill lines to PO lines
12. **GRN-to-Bill Matching** - Match bill lines to GRN received
13. **3-Way Match Validation** - Validate PO qty = GRN qty = Bill qty
14. **Match Variance Handler** - Handle variances with tolerance threshold
15. **MatchingResult Model** - Store matching results, variances, status
16. **MatchingResult Migrations** - Apply migrations

### Technology Context

| Technology | Purpose |
|------------|---------|
| Django ORM | BillLineItem, MatchingResult models |
| Decimal | Precision for pricing |
| Service Layer | Matching logic |
| Tolerance Threshold | Variance handling |

---

## Documents in This Group

| # | Document | Tasks | Description |
|---|----------|-------|-------------|
| 01 | `01_Tasks-17-25_Line-Item-Model.md` | 17-25 | BillLineItem model, all fields, migrations |
| 02 | `02_Tasks-26-32_Matching-Service.md` | 26-32 | MatchingService, PO/GRN matching, variance, MatchingResult |

---

## Task Summary

| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 17 | Create BillLineItem Model | Medium | 25 min |
| 18 | Add Line Item Product Fields | Medium | 20 min |
| 19 | Add Line Item Description | Low | 15 min |
| 20 | Add Line Item Quantity Fields | Medium | 20 min |
| 21 | Add Line Item Pricing Fields | Medium | 20 min |
| 22 | Add Line Item Total Field | Medium | 20 min |
| 23 | Add Line Item PO Reference | Medium | 20 min |
| 24 | Add Line Item GRN Reference | Medium | 20 min |
| 25 | Run BillLineItem Migrations | Low | 15 min |
| 26 | Create MatchingService Class | High | 30 min |
| 27 | Implement PO-to-Bill Matching | High | 30 min |
| 28 | Implement GRN-to-Bill Matching | High | 30 min |
| 29 | Implement 3-Way Match Validation | High | 35 min |
| 30 | Create Match Variance Handler | Medium | 25 min |
| 31 | Create MatchingResult Model | Medium | 25 min |
| 32 | Run MatchingResult Migrations | Low | 15 min |

---

## Execution Order

```
[Tasks 17-25: BillLineItem model and fields]
         │
         ▼
[Tasks 26-32: Matching service and MatchingResult]
```

---

## Expected Deliverables

```
apps/vendor_bills/
├── models/
│   ├── __init__.py
│   ├── vendor_bill.py
│   ├── bill_line_item.py         # Tasks 17-24
│   └── matching_result.py        # Task 31
├── services/
│   ├── __init__.py
│   └── matching_service.py       # Tasks 26-30
└── migrations/
    ├── 0002_line_item.py         # Task 25
    └── 0003_matching.py          # Task 32
```

---

## Notes for AI Agents

### BillLineItem Fields
- vendor_bill: FK to VendorBill
- product: FK to Product (nullable)
- variant: FK to ProductVariant (nullable)
- vendor_sku: CharField
- item_description: TextField (for non-product items)
- quantity: Integer (billed quantity)
- quantity_ordered: Integer (from PO)
- quantity_received: Integer (from GRN)
- unit_price: Decimal (expected price from PO)
- billed_price: Decimal (actual billed price)
- tax_rate: Decimal
- line_total: Decimal (computed)
- po_line: FK to POLineItem (nullable)
- grn_line: FK to GRNLineItem (nullable)

### 3-Way Matching Diagram
```
┌─────────────────────────────────────────────────────────────┐
│                      3-WAY MATCHING                         │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│   PURCHASE ORDER          GOODS RECEIPT          BILL       │
│   ┌─────────────┐        ┌─────────────┐    ┌───────────┐  │
│   │ Ordered: 100│───────▶│ Received:100│───▶│ Billed:100│  │
│   │ Price: $10  │        │ Inspected:OK│    │ Price: $10│  │
│   └─────────────┘        └─────────────┘    └───────────┘  │
│         │                       │                  │        │
│         └───────────────────────┴──────────────────┘        │
│                         │                                   │
│                         ▼                                   │
│               ┌──────────────────┐                          │
│               │  MATCH RESULT    │                          │
│               ├──────────────────┤                          │
│               │ Qty: ✅ MATCHED  │                          │
│               │ Price: ✅ MATCHED│                          │
│               │ Total: ✅ MATCHED│                          │
│               └──────────────────┘                          │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Variance Scenarios
| PO Qty | GRN Qty | Bill Qty | Result |
|--------|---------|----------|--------|
| 100 | 100 | 100 | ✅ MATCHED |
| 100 | 80 | 80 | ✅ MATCHED (partial receipt) |
| 100 | 100 | 105 | ⚠️ VARIANCE (overbilled) |
| 100 | 100 | 95 | ⚠️ VARIANCE (underbilled) |

### MatchingService Methods
- match_bill(bill_id)
- match_to_po(bill_id, po_id)
- match_to_grn(bill_id, grn_id)
- validate_3way_match(bill_id)
- handle_variance(bill_line_id, variance)
- get_matching_status(bill_id)
- auto_match_lines(bill_id)

### MatchingResult Fields
- vendor_bill: FK to VendorBill
- bill_line: FK to BillLineItem
- po_line: FK to POLineItem
- grn_line: FK to GRNLineItem
- match_status: Choice (MATCHED, VARIANCE, UNMATCHED)
- quantity_variance: Integer
- price_variance: Decimal
- total_variance: Decimal
- variance_percentage: Decimal
- is_within_tolerance: Boolean
- matched_at: DateTime
- matched_by: FK to User
- notes: TextField

### Tolerance Configuration
```
Settings in BillSettings:
- quantity_tolerance_percentage: 2%
- price_tolerance_percentage: 1%

If variance <= tolerance:
    → MATCHED (with note)
If variance > tolerance:
    → VARIANCE (requires approval)
```

### Line Total Calculation
```
line_total = billed_price × quantity
```
