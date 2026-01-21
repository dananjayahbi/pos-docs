# Group B: Cart & Line Item Management

> **Phase:** 05 - ERP Core Modules Part 2  
> **SubPhase:** 01 - POS Terminal Core  
> **Group:** B of F  
> **Tasks Covered:** 19-38  
> **Group Goal:** Implement shopping cart and transaction building functionality

---

## Navigation

- **↑ Parent:** [SubPhase-01 Summary](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [Group A: POS Terminal & Session Models](../Group-A_POS-Terminal-Session-Models/)
- **→ Next Group:** [Group C: Product Search & Barcode](../Group-C_Product-Search-Barcode/)

---

## Group Overview

### Key Outcomes

1. **Cart Submodule** - Organized `apps/pos/cart/` package structure
2. **Cart Status Constants** - ACTIVE, HELD, COMPLETED, VOIDED, ABANDONED
3. **POSCart Model** - Transaction cart with session and customer links
4. **Cart Reference Number** - Auto-generated unique reference
5. **Cart Totals** - Subtotal, discount_total, tax_total, grand_total
6. **Cart Discounts** - Cart-level discounts (percent or fixed)
7. **POSCartItem Model** - Line items with product, variant, quantity
8. **Item Pricing** - Unit price, original price, line total
9. **Item Discounts** - Line-level discounts with reason tracking
10. **CartService** - Service for cart operations
11. **Cart Operations** - Add, update, remove items
12. **Discount Operations** - Apply line and cart discounts
13. **Total Calculation** - Automatic recalculation of all totals

### Technology Context

| Technology | Purpose |
|------------|---------|
| Django ORM | POSCart and POSCartItem models |
| Service Layer | CartService for business logic |
| Decimal | Precise currency calculations |
| Django Signals | Auto-recalculate totals on changes |

---

## Documents in This Group

| # | Document | Tasks | Description |
|---|----------|-------|-------------|
| 01 | `01_Tasks-19-25_Cart-Submodule-Model.md` | 19-25 | Cart submodule, constants, POSCart model, reference, timestamps, discounts |
| 02 | `02_Tasks-26-31_Cart-Items-Model.md` | 26-31 | Notes field, POSCartItem model, quantity, price, discount, tax fields |
| 03 | `03_Tasks-32-38_Cart-Service-Operations.md` | 32-38 | CartService, add/update/remove, line/cart discounts, calculate totals |

---

## Task Summary

| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 19 | Create cart submodule | Low | 10 min |
| 20 | Define cart status constants | Low | 10 min |
| 21 | Create POSCart model | Medium | 30 min |
| 22 | Add cart reference number | Medium | 20 min |
| 23 | Add cart timestamps | Low | 15 min |
| 24 | Add cart totals fields | Medium | 20 min |
| 25 | Add cart discount fields | Low | 15 min |
| 26 | Add notes field | Low | 10 min |
| 27 | Create POSCartItem model | Medium | 30 min |
| 28 | Add item quantity field | Low | 15 min |
| 29 | Add item price fields | Medium | 20 min |
| 30 | Add item discount fields | Medium | 20 min |
| 31 | Add item tax fields | Low | 15 min |
| 32 | Create CartService | Medium | 25 min |
| 33 | Implement add_to_cart | Medium | 25 min |
| 34 | Implement update_quantity | Medium | 25 min |
| 35 | Implement remove_from_cart | Medium | 20 min |
| 36 | Implement apply_line_discount | Medium | 25 min |
| 37 | Implement apply_cart_discount | Medium | 25 min |
| 38 | Implement calculate_totals | High | 30 min |

---

## Execution Order

```
[Tasks 19-20: Cart submodule and status constants]
         │
         ▼
[Tasks 21-26: POSCart model with all fields]
         │
         ▼
[Tasks 27-31: POSCartItem model with all fields]
         │
         ▼
[Tasks 32-35: CartService with add/update/remove]
         │
         ▼
[Tasks 36-38: Discount and total calculation]
```

---

## Expected Deliverables

```
apps/pos/
├── cart/
│   ├── __init__.py
│   ├── models/
│   │   ├── __init__.py
│   │   ├── pos_cart.py           # Tasks 21-26
│   │   └── cart_item.py          # Tasks 27-31
│   └── services/
│       ├── __init__.py
│       └── cart_service.py       # Tasks 32-38
└── constants.py                  # Task 20 (added)
```

---

## Notes for AI Agents

### Cart Status
- **ACTIVE**: Current transaction being built
- **HELD**: Parked for later completion
- **COMPLETED**: Transaction finalized with payment
- **VOIDED**: Transaction cancelled before payment
- **ABANDONED**: Cart timeout or session closed

### Cart Reference Format
```
POS-{YEAR}-{TERMINAL_CODE}-{SEQUENCE}
Example: POS-2024-T01-000123
```

### Cart Discount Types
- **PERCENT**: Percentage off (e.g., 10% off entire cart)
- **FIXED**: Fixed amount off (e.g., LKR 500 off)

### POSCart Fields
- session FK: Link to POSSession
- customer FK: Optional customer link
- status: Cart status
- reference_number: Auto-generated unique reference
- subtotal: Sum of line totals before cart discount
- discount_total: Total discounts applied
- tax_total: Total tax
- grand_total: Final amount to pay
- cart_discount_type, cart_discount_value: Cart-level discount
- notes: Special instructions

### POSCartItem Fields
- cart FK: Link to POSCart
- product FK: Link to Product
- variant FK: Optional variant link
- quantity: Number of units
- unit_price: Price per unit after line discount
- original_price: Price before any discount
- line_total: quantity × unit_price
- discount_type, discount_value, discount_reason
- tax_rate, tax_amount

### Total Calculation Order
1. Calculate line totals (quantity × unit_price)
2. Sum all line totals = subtotal
3. Apply cart discount to subtotal
4. Calculate tax on discounted subtotal
5. grand_total = subtotal - cart_discount + tax_total

### Stock Validation
- Check stock availability on add_to_cart
- Check on update_quantity
- Reserve stock on transaction complete (not during cart building)
