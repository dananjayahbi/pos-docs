# Group E: Coupon & Summary

> **Phase:** 08 - Webstore & E-Commerce Platform  
> **SubPhase:** 06 - Shopping Cart  
> **Group:** E of F  
> **Tasks Covered:** 71-84  
> **Group Goal:** Create coupon code functionality and cart summary with totals

---

## Navigation

- **↑ Parent:** [00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [Group-D_Cart-Item-Management](../Group-D_Cart-Item-Management/)
- **→ Next Group:** [Group-F_Persistence-Testing](../Group-F_Persistence-Testing/)

---

## Group Overview

This group creates coupon and summary functionality. Creates coupon section with text input and apply button. Creates coupon validation API call. Creates coupon success display and error message. Creates remove coupon functionality. Creates cart summary box with subtotal, discount, shipping note, and grand total rows. Creates proceed to checkout button with secure checkout note.

### Key Outcomes

- Coupon section container
- Coupon code input
- Apply coupon button
- Coupon validation API
- Coupon success display
- Coupon error message
- Remove coupon button
- Cart summary box
- Subtotal row (LKR)
- Discount row
- Shipping row
- Grand total row
- Checkout button
- Secure checkout note

### Technology Context

- **API:** Validate coupon endpoint
- **State:** Store applied coupon
- **Currency:** LKR (₨)
- **Shipping:** Calculated at checkout

---

## Documents in This Group

| # | Document | Description | Tasks Covered |
|---|----------|-------------|---------------|
| 01 | `01_Tasks-71-77_Coupon-Functionality.md` | Create coupon input and validation | 71-77 |
| 02 | `02_Tasks-78-84_Summary-Checkout.md` | Create summary box and checkout | 78-84 |

---

## Task Summary

| Task # | Task Name | Complexity | Dependencies |
|--------|-----------|------------|--------------|
| 71 | Create Coupon Section | Low | Task 70 |
| 72 | Create Coupon Input | Low | Task 71 |
| 73 | Create Apply Coupon Button | Low | Task 72 |
| 74 | Create Coupon Validation | Medium | Task 73 |
| 75 | Create Coupon Success | Low | Task 74 |
| 76 | Create Coupon Error | Low | Task 74 |
| 77 | Create Remove Coupon | Low | Task 75 |
| 78 | Create Cart Summary Box | Medium | Task 70 |
| 79 | Create Subtotal Row | Low | Task 78 |
| 80 | Create Discount Row | Low | Task 79 |
| 81 | Create Shipping Row | Low | Task 78 |
| 82 | Create Total Row | Low | Task 80 |
| 83 | Create Checkout Button | Low | Task 78 |
| 84 | Create Secure Checkout Note | Low | Task 83 |

---

## Execution Order

```
Task 71: Coupon Section
    │
    ▼
Task 72: Coupon Input
    │
    ▼
Task 73: Apply Button
    │
    ▼
Task 74: Validation
    │
    ├──────────┐
    ▼          ▼
Task 75    Task 76
(Success)  (Error)
    │          │
    ▼          │
Task 77       │
(Remove)      │
    │          │
    └──────────┘
         │
         │
Task 78: Cart Summary Box
    │
    ├──────────┬──────────┐
    ▼          ▼          │
Task 79    Task 81       │
(Subtotal)(Shipping)     │
    │          │          │
    ▼          │          │
Task 80       │          │
(Discount)    │          │
    │          │          │
    ▼          │          │
Task 82       │          │
(Total)       │          │
    │          │          │
    └──────────┘          │
         │                │
         ▼                │
   Task 83: Checkout      │
         │                │
         ▼
   Task 84: Secure Note
```

---

## Expected Deliverables

```
frontend/
├── components/
│   └── storefront/
│       └── cart/
│           ├── Coupon/
│           │   ├── CouponSection.tsx
│           │   ├── CouponInput.tsx
│           │   ├── ApplyCouponButton.tsx
│           │   ├── AppliedCoupon.tsx
│           │   ├── CouponError.tsx
│           │   └── index.ts
│           └── CartSummary/
│               ├── CartSummaryBox.tsx
│               ├── SubtotalRow.tsx
│               ├── DiscountRow.tsx
│               ├── ShippingRow.tsx
│               ├── TotalRow.tsx
│               ├── CheckoutButton.tsx
│               ├── SecureCheckoutNote.tsx
│               └── index.ts
└── services/
    └── store/
        └── couponService.ts
```

---

## Notes for AI Agents

### Coupon Section (Task 71)
| Layout | Description |
|--------|-------------|
| Container | Card or bordered box |
| Title | "Have a coupon?" |
| Position | Above or in summary |

### Coupon Input (Task 72)
| Feature | Value |
|---------|-------|
| Placeholder | "Enter coupon code" |
| Type | Text |
| Transform | Uppercase |
| Max Length | 20 |

### Apply Button (Task 73)
| State | Text |
|-------|------|
| Default | "Apply" |
| Loading | "Applying..." |
| Success | Hidden (show applied) |

### Coupon Validation (Task 74)
| Endpoint | /api/coupons/validate |
| Method | POST |
| Body | { code, cart_total } |
| Response | { valid, discount, type } |

### Coupon Success (Task 75)
| Display | Content |
|---------|---------|
| Badge | Coupon code (green) |
| Discount | -₨500 or -10% |
| Remove | X button |

### Coupon Error (Task 76)
| Type | Message |
|------|---------|
| Invalid | "Invalid coupon code" |
| Expired | "This coupon has expired" |
| Min Order | "Min order ₨X required" |
| Style | Red text |

### Remove Coupon (Task 77)
| Feature | Description |
|---------|-------------|
| Button | X icon |
| Action | Clear coupon state |
| Recalculate | Update totals |

### Cart Summary Box (Task 78)
| Layout | Description |
|--------|-------------|
| Container | Card with padding |
| Title | "Order Summary" |
| Sticky | Optional on scroll |
| Border | Rounded corners |

### Subtotal Row (Task 79)
| Feature | Value |
|---------|-------|
| Label | "Subtotal" |
| Value | ₨5,000 |
| Align | Space between |

### Discount Row (Task 80)
| Feature | Value |
|---------|-------|
| Label | "Discount" |
| Value | -₨500 |
| Color | Green text |
| Visible | Only if discount |

### Shipping Row (Task 81)
| Feature | Value |
|---------|-------|
| Label | "Shipping" |
| Value | "Calculated at checkout" |
| Alternative | "Free" if eligible |

### Total Row (Task 82)
| Feature | Value |
|---------|-------|
| Label | "Total" |
| Value | ₨4,500 |
| Style | Bold, larger |
| Border | Top border |

### Checkout Button (Task 83)
| Feature | Value |
|---------|-------|
| Text | "Proceed to Checkout" |
| Style | Primary, full width |
| Link | /checkout |
| Disabled | If cart empty |

### Secure Checkout Note (Task 84)
| Feature | Description |
|---------|-------------|
| Icon | Lock icon |
| Text | "Secure Checkout" |
| Badges | Payment icons |
| Position | Below button |
