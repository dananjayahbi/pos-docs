# SubPhase 06: Shopping Cart - Tasks Summary

> **Phase:** 08 - Webstore & E-Commerce Platform  
> **SubPhase Index:** 06 of 14  
> **SubPhase Goal:** Build complete shopping cart with mini cart, cart page, quantity management, and stock validation  
> **Total Tasks:** 96 | **Status:** Planning  
> **Estimated Duration:** 12-14 hours

---

## Navigation

- **↑ Parent:** [00_SUBPHASES_SUMMARY.md](../00_SUBPHASES_SUMMARY.md)
- **← Previous SubPhase:** [SubPhase-05_Search-Functionality](../SubPhase-05_Search-Functionality/)
- **→ Next SubPhase:** [SubPhase-07_Checkout-Flow](../SubPhase-07_Checkout-Flow/)

---

## SubPhase Overview

This sub-phase creates the complete shopping cart system including add to cart functionality, mini cart dropdown, full cart page, quantity adjustment, stock validation, and cart persistence.

### Key Outcomes
- Add to cart with variant selection
- Mini cart dropdown in header
- Full cart page with details
- Quantity adjustment (+/-)
- Remove items from cart
- Cart persistence (localStorage + API)
- Real-time stock validation
- Subtotal calculation with LKR
- Coupon code application

### Cart Page Layout
```
┌─────────────────────────────────────────────────────────────┐
│ SHOPPING CART (3 items)                                     │
├─────────────────────────────────────────────────────────────┤
│ ┌──────────────────────────────────────────────────────┐   │
│ │ [img] Product Name - Size: M, Color: Red              │   │
│ │       ₨1,500 × 2 = ₨3,000    [-] 2 [+]   [Remove]    │   │
│ └──────────────────────────────────────────────────────┘   │
│ ┌──────────────────────────────────────────────────────┐   │
│ │ [img] Another Product                                 │   │
│ │       ₨2,000 × 1 = ₨2,000    [-] 1 [+]   [Remove]    │   │
│ └──────────────────────────────────────────────────────┘   │
├─────────────────────────────────────────────────────────────┤
│ Coupon Code: [____________] [Apply]                         │
├─────────────────────────────────────────────────────────────┤
│                              Subtotal: ₨5,000               │
│                              Discount: -₨500                │
│                              Shipping: Calculated at checkout│
│                              ─────────────────              │
│                              Total: ₨4,500                  │
│                                                             │
│                              [Proceed to Checkout]          │
└─────────────────────────────────────────────────────────────┘
```

### Technology Context
- **State:** Zustand cart store
- **Persistence:** localStorage + API sync
- **Validation:** Real-time stock check
- **Currency:** LKR (₨) formatting

---

## Task Execution Order

```
TASK GROUP A: Cart State & Store (Tasks 01-18)
        │
        ▼
TASK GROUP B: Mini Cart Component (Tasks 19-36)
        │
        ▼
TASK GROUP C: Cart Page (Tasks 37-54)
        │
        ▼
TASK GROUP D: Cart Item Management (Tasks 55-70)
        │
        ▼
TASK GROUP E: Coupon & Summary (Tasks 71-84)
        │
        ▼
TASK GROUP F: Persistence & Testing (Tasks 85-96)
```

---

## Task Index

### Group A: Cart State & Store (Tasks 01-18)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 01 | **Create Cart Directory** | Set up cart/ route directory | SubPhase-05 | 🔴 Not Created |
| 02 | **Create Cart Page Route** | Create cart/page.tsx | Task 01 | 🔴 Not Created |
| 03 | **Create Cart Page Layout** | Layout for cart page | Task 01 | 🔴 Not Created |
| 04 | **Create Cart Loading State** | Loading skeleton | Task 02 | 🔴 Not Created |
| 05 | **Create Cart Store Directory** | Zustand store folder | Task 01 | 🔴 Not Created |
| 06 | **Create Cart Store** | Zustand cart store setup | Task 05 | 🔴 Not Created |
| 07 | **Create CartItem Type** | TypeScript CartItem interface | Task 06 | 🔴 Not Created |
| 08 | **Create Cart State Type** | Full cart state interface | Task 07 | 🔴 Not Created |
| 09 | **Create Add to Cart Action** | addItem action | Task 06 | 🔴 Not Created |
| 10 | **Create Remove from Cart Action** | removeItem action | Task 06 | 🔴 Not Created |
| 11 | **Create Update Quantity Action** | updateQuantity action | Task 06 | 🔴 Not Created |
| 12 | **Create Clear Cart Action** | clearCart action | Task 06 | 🔴 Not Created |
| 13 | **Create Cart Total Selector** | Computed total selector | Task 06 | 🔴 Not Created |
| 14 | **Create Cart Item Count Selector** | Count items selector | Task 06 | 🔴 Not Created |
| 15 | **Create Cart Subtotal Selector** | Subtotal calculation | Task 13 | 🔴 Not Created |
| 16 | **Create Variant Key Generator** | Unique key for variants | Task 07 | 🔴 Not Created |
| 17 | **Create Cart Context Provider** | Context wrapper | Task 06 | 🔴 Not Created |
| 18 | **Verify Cart Store** | Test all cart actions | Task 17 | 🔴 Not Created |

---

### Group B: Mini Cart Component (Tasks 19-36)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 19 | **Create Mini Cart Directory** | Components folder | Task 18 | 🔴 Not Created |
| 20 | **Create Cart Icon Button** | Header cart icon with count | Task 19 | 🔴 Not Created |
| 21 | **Create Cart Badge** | Item count badge | Task 20 | 🔴 Not Created |
| 22 | **Create Mini Cart Dropdown** | Dropdown container | Task 20 | 🔴 Not Created |
| 23 | **Create Mini Cart Position** | Position below icon | Task 22 | 🔴 Not Created |
| 24 | **Create Mini Cart Header** | "Your Cart (X items)" | Task 22 | 🔴 Not Created |
| 25 | **Create Mini Cart Items List** | Scrollable items list | Task 22 | 🔴 Not Created |
| 26 | **Create Mini Cart Item** | Single item display | Task 25 | 🔴 Not Created |
| 27 | **Create Mini Cart Item Image** | Product thumbnail | Task 26 | 🔴 Not Created |
| 28 | **Create Mini Cart Item Info** | Name, variant, price | Task 26 | 🔴 Not Created |
| 29 | **Create Mini Cart Item Remove** | Remove button | Task 26 | 🔴 Not Created |
| 30 | **Create Mini Cart Subtotal** | Subtotal display | Task 22 | 🔴 Not Created |
| 31 | **Create Mini Cart Footer** | Bottom buttons | Task 22 | 🔴 Not Created |
| 32 | **Create View Cart Button** | Link to cart page | Task 31 | 🔴 Not Created |
| 33 | **Create Checkout Button** | Link to checkout | Task 31 | 🔴 Not Created |
| 34 | **Create Empty Mini Cart** | Empty state message | Task 22 | 🔴 Not Created |
| 35 | **Create Mini Cart Animation** | Slide-in animation | Task 22 | 🔴 Not Created |
| 36 | **Verify Mini Cart UX** | Test mini cart flow | Task 35 | 🔴 Not Created |

---

### Group C: Cart Page (Tasks 37-54)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 37 | **Create Cart Page Container** | Main cart page wrapper | Task 36 | 🔴 Not Created |
| 38 | **Create Cart Page Header** | "Shopping Cart" title | Task 37 | 🔴 Not Created |
| 39 | **Create Cart Item Count Header** | "(X items)" count | Task 38 | 🔴 Not Created |
| 40 | **Create Cart Two Column Layout** | Items left, summary right | Task 37 | 🔴 Not Created |
| 41 | **Create Cart Items Container** | Left column wrapper | Task 40 | 🔴 Not Created |
| 42 | **Create Cart Summary Container** | Right column wrapper | Task 40 | 🔴 Not Created |
| 43 | **Create Cart Item Row** | Full cart item display | Task 41 | 🔴 Not Created |
| 44 | **Create Cart Item Image** | Product image | Task 43 | 🔴 Not Created |
| 45 | **Create Cart Item Details** | Name, variant info | Task 43 | 🔴 Not Created |
| 46 | **Create Cart Item Variant Tags** | Size: M, Color: Red | Task 45 | 🔴 Not Created |
| 47 | **Create Cart Item Price** | Unit price × quantity | Task 43 | 🔴 Not Created |
| 48 | **Create Cart Item Line Total** | Line total calculation | Task 47 | 🔴 Not Created |
| 49 | **Create Continue Shopping Link** | Link back to products | Task 37 | 🔴 Not Created |
| 50 | **Create Empty Cart Page** | Empty state with CTA | Task 37 | 🔴 Not Created |
| 51 | **Create Empty Cart Illustration** | Empty cart graphic | Task 50 | 🔴 Not Created |
| 52 | **Create Shop Now Button** | CTA to browse products | Task 50 | 🔴 Not Created |
| 53 | **Create Mobile Cart Layout** | Stacked for mobile | Task 40 | 🔴 Not Created |
| 54 | **Verify Cart Page Layout** | Test responsive layout | Task 53 | 🔴 Not Created |

---

### Group D: Cart Item Management (Tasks 55-70)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 55 | **Create Quantity Selector** | [-] quantity [+] buttons | Task 54 | 🔴 Not Created |
| 56 | **Create Decrease Button** | Minus button | Task 55 | 🔴 Not Created |
| 57 | **Create Increase Button** | Plus button | Task 55 | 🔴 Not Created |
| 58 | **Create Quantity Input** | Editable quantity input | Task 55 | 🔴 Not Created |
| 59 | **Create Min Quantity Check** | Min 1, or remove | Task 55 | 🔴 Not Created |
| 60 | **Create Max Quantity Check** | Max = stock available | Task 55 | 🔴 Not Created |
| 61 | **Create Stock Validation** | Validate against stock | Task 60 | 🔴 Not Created |
| 62 | **Create Low Stock Warning** | "Only X left" warning | Task 61 | 🔴 Not Created |
| 63 | **Create Out of Stock Alert** | Item became unavailable | Task 61 | 🔴 Not Created |
| 64 | **Create Remove Item Button** | Remove from cart | Task 43 | 🔴 Not Created |
| 65 | **Create Remove Confirmation** | Optional confirm modal | Task 64 | 🔴 Not Created |
| 66 | **Create Undo Remove** | Undo toast notification | Task 64 | 🔴 Not Created |
| 67 | **Create Save for Later** | Move to wishlist option | Task 43 | 🔴 Not Created |
| 68 | **Create Update Cart Toast** | Quantity updated toast | Task 55 | 🔴 Not Created |
| 69 | **Create Debounced Quantity** | Debounce quantity changes | Task 55 | 🔴 Not Created |
| 70 | **Verify Quantity Management** | Test all quantity flows | Task 69 | 🔴 Not Created |

---

### Group E: Coupon & Summary (Tasks 71-84)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 71 | **Create Coupon Section** | Coupon code input area | Task 70 | 🔴 Not Created |
| 72 | **Create Coupon Input** | Text input for code | Task 71 | 🔴 Not Created |
| 73 | **Create Apply Coupon Button** | Apply button | Task 72 | 🔴 Not Created |
| 74 | **Create Coupon Validation** | Validate coupon API | Task 73 | 🔴 Not Created |
| 75 | **Create Coupon Success** | Applied coupon display | Task 74 | 🔴 Not Created |
| 76 | **Create Coupon Error** | Invalid coupon message | Task 74 | 🔴 Not Created |
| 77 | **Create Remove Coupon** | Remove applied coupon | Task 75 | 🔴 Not Created |
| 78 | **Create Cart Summary Box** | Summary container | Task 70 | 🔴 Not Created |
| 79 | **Create Subtotal Row** | Subtotal in LKR | Task 78 | 🔴 Not Created |
| 80 | **Create Discount Row** | Discount amount | Task 79 | 🔴 Not Created |
| 81 | **Create Shipping Row** | "Calculated at checkout" | Task 78 | 🔴 Not Created |
| 82 | **Create Total Row** | Grand total | Task 80 | 🔴 Not Created |
| 83 | **Create Checkout Button** | Proceed to checkout | Task 78 | 🔴 Not Created |
| 84 | **Create Secure Checkout Note** | Security badge/text | Task 83 | 🔴 Not Created |

---

### Group F: Persistence & Testing (Tasks 85-96)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 85 | **Create localStorage Persist** | Persist cart to localStorage | Task 84 | 🔴 Not Created |
| 86 | **Create Hydration Hook** | Hydrate cart on load | Task 85 | 🔴 Not Created |
| 87 | **Create Cart Merge Logic** | Merge guest + logged in | Task 86 | 🔴 Not Created |
| 88 | **Create API Cart Sync** | Sync cart with backend | Task 86 | 🔴 Not Created |
| 89 | **Create Cart Expiry** | Expire old cart items | Task 85 | 🔴 Not Created |
| 90 | **Create Stock Re-validation** | Re-check stock on load | Task 88 | 🔴 Not Created |
| 91 | **Create Price Update Check** | Check if prices changed | Task 90 | 🔴 Not Created |
| 92 | **Test Add to Cart Flow** | Full add to cart test | Task 70 | 🔴 Not Created |
| 93 | **Test Quantity Updates** | Test quantity changes | Task 70 | 🔴 Not Created |
| 94 | **Test Mini Cart** | Test mini cart interactions | Task 36 | 🔴 Not Created |
| 95 | **Test Cart Page Mobile** | Mobile responsiveness | Task 54 | 🔴 Not Created |
| 96 | **Test Cart Persistence** | Test localStorage + API | Task 91 | 🔴 Not Created |

---

## Expected Final Structure

```
frontend/
└── app/
    └── (storefront)/
        └── cart/
            ├── page.tsx                        # Cart page (Task 02)
            ├── layout.tsx                      # Cart layout (Task 03)
            └── loading.tsx                     # Loading state (Task 04)
└── components/
    └── storefront/
        └── cart/
            ├── MiniCart/
            │   ├── CartIconButton.tsx          # Header icon (Task 20)
            │   ├── CartBadge.tsx               # Count badge (Task 21)
            │   ├── MiniCartDropdown.tsx        # Dropdown (Task 22)
            │   ├── MiniCartItem.tsx            # Mini item (Task 26)
            │   └── EmptyMiniCart.tsx           # Empty state (Task 34)
            ├── CartPage/
            │   ├── CartPage.tsx                # Main container (Task 37)
            │   ├── CartItemsList.tsx           # Items list (Task 41)
            │   ├── CartItemRow.tsx             # Item row (Task 43)
            │   ├── CartSummary.tsx             # Summary box (Task 78)
            │   └── EmptyCart.tsx               # Empty state (Task 50)
            ├── CartItem/
            │   ├── CartItemImage.tsx           # Image (Task 44)
            │   ├── CartItemDetails.tsx         # Details (Task 45)
            │   ├── CartItemPrice.tsx           # Price (Task 47)
            │   └── CartItemActions.tsx         # Remove (Task 64)
            ├── QuantitySelector/
            │   ├── QuantitySelector.tsx        # Quantity UI (Task 55)
            │   ├── DecreaseButton.tsx          # Minus (Task 56)
            │   ├── IncreaseButton.tsx          # Plus (Task 57)
            │   └── QuantityInput.tsx           # Input (Task 58)
            └── Coupon/
                ├── CouponSection.tsx           # Coupon area (Task 71)
                ├── CouponInput.tsx             # Input (Task 72)
                └── AppliedCoupon.tsx           # Applied (Task 75)
└── stores/
    └── storefront/
        └── cartStore.ts                        # Zustand store (Task 06)
└── hooks/
    └── storefront/
        ├── useCart.ts                          # Cart hook wrapper (Task 17)
        └── useCartPersist.ts                   # Persistence (Task 85)
└── services/
    └── storefront/
        └── cart/
            ├── cartService.ts                  # Cart API (Task 88)
            └── couponService.ts                # Coupon API (Task 74)
└── types/
    └── storefront/
        └── cart.types.ts                       # Cart types (Task 07)
```

---

## Progress Tracking

| Group | Name | Tasks | Completed | Progress |
|-------|------|-------|-----------|----------|
| A | Cart State & Store | 18 | 0 | 0% |
| B | Mini Cart Component | 18 | 0 | 0% |
| C | Cart Page | 18 | 0 | 0% |
| D | Cart Item Management | 16 | 0 | 0% |
| E | Coupon & Summary | 14 | 0 | 0% |
| F | Persistence & Testing | 12 | 0 | 0% |
| **Total** | | **96** | **0** | **0%** |

---

## Notes for AI Agents

1. **Execute tasks in order** - Follow Group A → F sequence
2. **Zustand for state** - Cart state managed by Zustand store
3. **Variant key** - Unique key: `productId-size-color` for variants
4. **LKR currency** - Format all prices with ₨ symbol
5. **Stock validation** - Re-check stock before checkout
6. **localStorage + API** - Guest: localStorage, logged in: API sync
7. **Debounce quantity** - 500ms debounce on quantity changes
8. **Merge carts** - Merge guest cart when user logs in
9. **Price change alert** - Notify if price changed since added
