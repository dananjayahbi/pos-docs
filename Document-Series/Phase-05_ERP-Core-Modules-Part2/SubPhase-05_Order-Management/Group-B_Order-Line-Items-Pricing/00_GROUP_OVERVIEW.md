# Group B: Order Line Items & Pricing

> **Phase:** 05 - ERP Core Modules Part 2  
> **SubPhase:** 05 - Order Management  
> **Group:** B of F  
> **Tasks Covered:** 19-34  
> **Group Goal:** Implement order line items and calculation services

---

## Navigation

- **↑ Parent:** [SubPhase-05 Summary](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [Group A: Order Model & Status System](../Group-A_Order-Model-Status-System/)
- **→ Next Group:** [Group C: Order Creation & Sources](../Group-C_Order-Creation-Sources/)

---

## Group Overview

### Key Outcomes

1. **OrderLineItem Model** - Line item with FK to Order, position field
2. **Product Reference Fields** - Product/variant FK for linked items
3. **Description Fields** - item_name, item_sku, item_description for snapshot
4. **Quantity Fields** - quantity_ordered, quantity_fulfilled, quantity_returned
5. **Pricing Fields** - unit_price, original_price, cost_price
6. **Line Discount Fields** - discount_type, discount_value, discount_amount
7. **Line Tax Fields** - tax_rate, tax_amount, is_taxable
8. **Line Total Field** - Computed line total
9. **Line Status Field** - PENDING, ALLOCATED, PICKED, PACKED, SHIPPED, DELIVERED
10. **Warehouse Reference** - warehouse FK, location FK for fulfillment
11. **Line Item Migrations** - Apply migrations
12. **Order Calculation Service** - Service for calculating totals
13. **Line Total Calculator** - Individual line total calculation
14. **Order Tax Calculator** - Tax calculation based on config
15. **Shipping Calculator** - Shipping based on weight/destination
16. **Recalculation Signal** - Auto-recalculate on line changes

### Technology Context

| Technology | Purpose |
|------------|---------|
| Django ORM | OrderLineItem model |
| Django Signals | Auto-recalculation triggers |
| Decimal | Precise financial calculations |
| Service Layer | Calculation logic separation |

---

## Documents in This Group

| # | Document | Tasks | Description |
|---|----------|-------|-------------|
| 01 | `01_Tasks-19-24_LineItem-Model-Core.md` | 19-24 | OrderLineItem model, product ref, description, quantity, pricing, discounts |
| 02 | `02_Tasks-25-29_Tax-Status-Warehouse-Migration.md` | 25-29 | Tax fields, line total, status, warehouse ref, migrations |
| 03 | `03_Tasks-30-34_Calculation-Services.md` | 30-34 | Calculation service, line/tax/shipping calculators, recalculation signal |

---

## Task Summary

| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 19 | Create OrderLineItem Model | Medium | 25 min |
| 20 | Add Line Item Product Reference | Medium | 20 min |
| 21 | Add Line Item Description Fields | Medium | 20 min |
| 22 | Add Line Item Quantity Fields | Medium | 20 min |
| 23 | Add Line Item Pricing Fields | Medium | 20 min |
| 24 | Add Line Item Discount Fields | Medium | 20 min |
| 25 | Add Line Item Tax Fields | Medium | 20 min |
| 26 | Add Line Item Total Field | Medium | 20 min |
| 27 | Add Line Item Status Field | Medium | 20 min |
| 28 | Add Line Item Warehouse Reference | Medium | 20 min |
| 29 | Run OrderLineItem Migrations | Low | 15 min |
| 30 | Create Order Calculation Service | Medium | 25 min |
| 31 | Implement Line Total Calculator | Medium | 25 min |
| 32 | Implement Order Tax Calculator | Medium | 25 min |
| 33 | Implement Shipping Calculator | Medium | 25 min |
| 34 | Create Order Recalculation Signal | Medium | 25 min |

---

## Execution Order

```
[Tasks 19-24: OrderLineItem core fields]
         │
         ▼
[Tasks 25-29: Tax, status, warehouse, migrations]
         │
         ▼
[Tasks 30-34: Calculation services and signals]
```

---

## Expected Deliverables

```
apps/orders/
├── models/
│   ├── __init__.py
│   ├── order.py
│   └── order_line_item.py        # Tasks 19-28
├── services/
│   ├── __init__.py
│   └── calculation_service.py    # Tasks 30-33
├── signals.py                    # Task 34
└── migrations/
    └── 0002_orderlineitem.py     # Task 29
```

---

## Notes for AI Agents

### OrderLineItem Key Fields
- order: FK to Order
- position: Integer for ordering
- product: FK to Product (nullable for custom items)
- variant: FK to ProductVariant (nullable)
- item_name: Snapshotted product name
- item_sku: Snapshotted SKU
- item_description: Product description snapshot
- quantity_ordered: Original quantity
- quantity_fulfilled: Quantity shipped
- quantity_returned: Quantity returned
- unit_price: Price per unit (snapshotted)
- original_price: Price before discounts
- cost_price: Cost for margin calculation
- discount_type: PERCENTAGE, FIXED
- discount_value, discount_amount
- tax_rate, tax_amount, is_taxable
- line_total: Computed total
- status: Line fulfillment status
- warehouse: FK to Warehouse
- location: FK to WarehouseLocation

### Line Item Status
- **PENDING**: Not yet allocated
- **ALLOCATED**: Stock reserved
- **PICKED**: Picked from location
- **PACKED**: Packed for shipping
- **SHIPPED**: Dispatched
- **DELIVERED**: Received by customer

### Quantity Tracking
```
quantity_ordered = 10
quantity_fulfilled = 8  (shipped)
quantity_returned = 2   (returned after delivery)
quantity_remaining = quantity_ordered - quantity_fulfilled
```

### Line Total Calculation
```
line_total = (quantity_ordered * unit_price) - discount_amount + tax_amount
```

### Shipping Calculation Factors
- Total order weight
- Package dimensions
- Destination zone
- Shipping method (standard, express)
- Free shipping threshold
