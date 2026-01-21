# Group B: PO Line Items & Calculations

> **Phase:** 05 - ERP Core Modules Part 2  
> **SubPhase:** 11 - Purchase Orders  
> **Group:** B of F  
> **Tasks Covered:** 19-34  
> **Group Goal:** Create PO line items with pricing and calculation services

---

## Navigation

- **↑ Parent:** [SubPhase-11 Summary](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [Group A: Purchase Order Model & Status](../Group-A_Purchase-Order-Model-Status/)
- **→ Next Group:** [Group C: PO Creation & Sending](../Group-C_PO-Creation-Sending/)

---

## Group Overview

### Key Outcomes

1. **POLineItem Model** - Line items with FK to PurchaseOrder
2. **Line Item Product Fields** - product FK, variant FK, vendor_sku
3. **Line Item Description** - item_description for non-product items
4. **Line Item Quantity Fields** - quantity_ordered, quantity_received, quantity_pending
5. **Line Item Pricing Fields** - unit_price, discount_percentage, tax_rate
6. **Line Item Total Field** - line_total computed field
7. **Line Item Status Field** - PENDING, PARTIAL, RECEIVED, CANCELLED
8. **Line Item Expected Date** - Optional per-line delivery date
9. **Line Item Warehouse** - receiving_warehouse, receiving_location
10. **POLineItem Migrations** - Apply migrations
11. **PO Calculation Service** - Calculate PO totals
12. **Line Total Calculator** - Calculate line totals with discounts
13. **PO Tax Calculator** - Calculate tax based on line items
14. **PO Grand Total** - Calculate subtotal, shipping, tax, total
15. **PO Recalculation Signal** - Auto-recalculate on line changes
16. **Vendor Price Lookup** - Auto-fill from vendor product catalog

### Technology Context

| Technology | Purpose |
|------------|---------|
| Django ORM | POLineItem model |
| Decimal | Precision for pricing |
| Signals | Auto-recalculation |
| Service Layer | Calculation logic |

---

## Documents in This Group

| # | Document | Tasks | Description |
|---|----------|-------|-------------|
| 01 | `01_Tasks-19-28_Line-Item-Model.md` | 19-28 | POLineItem model, all fields, migrations |
| 02 | `02_Tasks-29-34_Calculation-Service.md` | 29-34 | Calculation service, line/tax/total, signals, price lookup |

---

## Task Summary

| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 19 | Create POLineItem Model | Medium | 25 min |
| 20 | Add Line Item Product Fields | Medium | 20 min |
| 21 | Add Line Item Description | Low | 15 min |
| 22 | Add Line Item Quantity Fields | Medium | 20 min |
| 23 | Add Line Item Pricing Fields | Medium | 20 min |
| 24 | Add Line Item Total Field | Medium | 20 min |
| 25 | Add Line Item Status Field | Low | 15 min |
| 26 | Add Line Item Expected Date | Low | 15 min |
| 27 | Add Line Item Warehouse | Medium | 20 min |
| 28 | Run POLineItem Migrations | Low | 15 min |
| 29 | Create PO Calculation Service | High | 30 min |
| 30 | Implement Line Total Calculator | Medium | 25 min |
| 31 | Implement PO Tax Calculator | Medium | 25 min |
| 32 | Implement PO Grand Total | Medium | 25 min |
| 33 | Create PO Recalculation Signal | Medium | 25 min |
| 34 | Implement Vendor Price Lookup | Medium | 25 min |

---

## Execution Order

```
[Tasks 19-28: POLineItem model and fields]
         │
         ▼
[Tasks 29-34: Calculation service and signals]
```

---

## Expected Deliverables

```
apps/purchases/
├── models/
│   ├── __init__.py
│   ├── purchase_order.py
│   └── po_line_item.py           # Tasks 19-27
├── services/
│   ├── __init__.py
│   └── calculation_service.py    # Tasks 29-34
├── signals.py                    # Task 33
└── migrations/
    └── 0002_line_item.py         # Task 28
```

---

## Notes for AI Agents

### POLineItem Fields
- purchase_order: FK to PurchaseOrder
- product: FK to Product (nullable)
- variant: FK to ProductVariant (nullable)
- vendor_sku: CharField
- item_description: TextField (for non-product items)
- quantity_ordered: Integer
- quantity_received: Integer (default 0)
- quantity_pending: Property (ordered - received)
- unit_price: Decimal
- discount_percentage: Decimal
- tax_rate: Decimal
- line_total: Decimal (computed)
- status: Choice field
- expected_delivery_date: Date (optional)
- receiving_warehouse: FK to Warehouse
- receiving_location: FK to WarehouseLocation

### Line Item Status Choices
- **PENDING**: Not yet received
- **PARTIAL**: Partially received
- **RECEIVED**: Fully received
- **CANCELLED**: Cancelled

### Line Total Calculation
```
discount_amount = unit_price × (discount_percentage / 100)
price_after_discount = unit_price - discount_amount
tax_amount = price_after_discount × (tax_rate / 100)
line_total = (price_after_discount + tax_amount) × quantity_ordered
```

### PO Total Calculation
```
subtotal = sum(line.line_total for line in po.lines)
tax_amount = sum(line.tax_amount for line in po.lines)
total = subtotal + shipping_cost
```

### Vendor Price Lookup
```
When adding product to PO:
1. Get VendorProduct for (vendor, product)
2. Auto-fill unit_price from VendorProduct.unit_cost
3. Auto-fill vendor_sku from VendorProduct.vendor_sku
4. Auto-fill expected_delivery_date based on lead_time_days
```

### Recalculation Signal
```
On POLineItem save/delete:
1. Recalculate all line totals
2. Sum to get subtotal
3. Add shipping cost
4. Update PurchaseOrder totals
```

### Example Line Item
```
Line 1:
├── Product: Samsung TV 55"
├── Vendor SKU: ABC-TV-55
├── Qty Ordered: 10
├── Qty Received: 0
├── Unit Price: Rs. 85,000
├── Discount: 5%
├── Tax Rate: 18%
├── Line Total: Rs. 952,150
└── Status: PENDING
```
