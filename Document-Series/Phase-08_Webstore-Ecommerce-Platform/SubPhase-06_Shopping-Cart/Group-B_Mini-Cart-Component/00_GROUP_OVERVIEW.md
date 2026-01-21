# Group B: Mini Cart Component

> **Phase:** 08 - Webstore & E-Commerce Platform  
> **SubPhase:** 06 - Shopping Cart  
> **Group:** B of F  
> **Tasks Covered:** 19-36  
> **Group Goal:** Create header mini cart with dropdown, item list, and navigation buttons

---

## Navigation

- **↑ Parent:** [00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [Group-A_Cart-State-Store](../Group-A_Cart-State-Store/)
- **→ Next Group:** [Group-C_Cart-Page](../Group-C_Cart-Page/)

---

## Group Overview

This group creates the mini cart dropdown. Creates mini cart directory. Creates cart icon button in header with item count badge. Creates mini cart dropdown container with positioning. Creates mini cart header showing item count. Creates scrollable items list with individual mini cart items showing thumbnail, info, and remove button. Creates mini cart subtotal display. Creates footer with View Cart and Checkout buttons. Creates empty mini cart state. Creates slide-in animation. Verifies complete mini cart UX.

### Key Outcomes

- Mini cart directory
- Cart icon button
- Cart count badge
- Mini cart dropdown
- Dropdown positioning
- Mini cart header
- Mini cart items list
- Mini cart item
- Item thumbnail image
- Item info (name, variant, price)
- Item remove button
- Mini cart subtotal
- Mini cart footer
- View Cart button
- Checkout button
- Empty mini cart state
- Slide-in animation
- Mini cart UX verified

### Technology Context

- **Trigger:** Click cart icon
- **Position:** Dropdown right
- **Max Items:** Show 3-4, scroll
- **Close:** Click outside

---

## Documents in This Group

| # | Document | Description | Tasks Covered |
|---|----------|-------------|---------------|
| 01 | `01_Tasks-19-28_Icon-Dropdown-Items.md` | Create icon, dropdown, and items | 19-28 |
| 02 | `02_Tasks-29-36_Actions-Footer-Verify.md` | Create actions, footer, and verification | 29-36 |

---

## Task Summary

| Task # | Task Name | Complexity | Dependencies |
|--------|-----------|------------|--------------|
| 19 | Create Mini Cart Directory | Low | Task 18 |
| 20 | Create Cart Icon Button | Low | Task 19 |
| 21 | Create Cart Badge | Low | Task 20 |
| 22 | Create Mini Cart Dropdown | Medium | Task 20 |
| 23 | Create Mini Cart Position | Low | Task 22 |
| 24 | Create Mini Cart Header | Low | Task 22 |
| 25 | Create Mini Cart Items List | Low | Task 22 |
| 26 | Create Mini Cart Item | Low | Task 25 |
| 27 | Create Mini Cart Item Image | Low | Task 26 |
| 28 | Create Mini Cart Item Info | Low | Task 26 |
| 29 | Create Mini Cart Item Remove | Low | Task 26 |
| 30 | Create Mini Cart Subtotal | Low | Task 22 |
| 31 | Create Mini Cart Footer | Low | Task 22 |
| 32 | Create View Cart Button | Low | Task 31 |
| 33 | Create Checkout Button | Low | Task 31 |
| 34 | Create Empty Mini Cart | Low | Task 22 |
| 35 | Create Mini Cart Animation | Low | Task 22 |
| 36 | Verify Mini Cart UX | Low | Task 35 |

---

## Execution Order

```
Task 19: Mini Cart Directory
    │
    ▼
Task 20: Cart Icon Button
    │
    ├──────────┐
    ▼          │
Task 21    Task 22: Dropdown
(Badge)        │
    │     ┌────┴────┬────────┬────────┬────────┐
    │     ▼         ▼        ▼        ▼        │
    │  T-23      T-24     T-25     T-30     T-31
    │ (Pos)    (Header) (Items) (Subtotal)(Footer)
    │     │         │        │        │        │
    │     │         │        ▼        │    ┌───┴───┐
    │     │         │     T-26       │    ▼       ▼
    │     │         │    (Item)      │  T-32   T-33
    │     │         │        │        │ (View) (Check)
    │     │         │   ┌────┼────┐   │    │       │
    │     │         │   ▼    ▼    ▼   │    │       │
    │     │         │ T-27 T-28 T-29  │    │       │
    │     │         │(Img)(Info)(Rem) │    │       │
    │     │         │   │    │    │   │    │       │
    └─────┴─────────┴───┴────┴────┴───┴────┴───────┘
                          │
    ┌─────────────────────┘
    │
    ├────────┐
    ▼        │
Task 34   Task 35
(Empty)  (Animation)
    │        │
    └────────┘
         │
         ▼
   Task 36: Verify
```

---

## Expected Deliverables

```
frontend/
├── components/
│   └── storefront/
│       └── cart/
│           └── MiniCart/
│               ├── CartIconButton.tsx
│               ├── CartBadge.tsx
│               ├── MiniCartDropdown.tsx
│               ├── MiniCartHeader.tsx
│               ├── MiniCartItemsList.tsx
│               ├── MiniCartItem.tsx
│               ├── MiniCartSubtotal.tsx
│               ├── MiniCartFooter.tsx
│               ├── EmptyMiniCart.tsx
│               └── index.ts
```

---

## Notes for AI Agents

### Cart Icon Button (Task 20)
| Feature | Description |
|---------|-------------|
| Icon | Shopping cart icon |
| Position | Header right side |
| Badge | Item count overlay |
| Click | Toggle dropdown |

### Cart Badge (Task 21)
| Feature | Value |
|---------|-------|
| Position | Top-right of icon |
| Shape | Circle |
| Color | Primary/accent |
| Content | Item count |
| Max | 99+ for large |
| Hidden | When 0 items |

### Mini Cart Dropdown (Task 22)
| Feature | Description |
|---------|-------------|
| Width | 320-400px |
| Max Height | 400px |
| Scroll | Items list scrolls |
| Shadow | lg shadow |
| Border | Rounded corners |

### Mini Cart Position (Task 23)
| Feature | Value |
|---------|-------|
| Anchor | Cart icon |
| Alignment | Right aligned |
| Offset | 8px below |
| Z-index | 50 |

### Mini Cart Header (Task 24)
| Content | Example |
|---------|---------|
| Title | "Your Cart" |
| Count | "(3 items)" |
| Style | Bold, border bottom |

### Mini Cart Item (Task 26)
| Layout | Description |
|--------|-------------|
| Image | Left, 60x60 |
| Info | Center, stacked |
| Remove | Right, X button |
| Padding | 12px |

### Mini Cart Item Info (Task 28)
| Line | Content |
|------|---------|
| 1 | Product name |
| 2 | Variant (Size: M) |
| 3 | ₨1,500 × 2 |

### Mini Cart Subtotal (Task 30)
| Feature | Description |
|---------|-------------|
| Label | "Subtotal:" |
| Value | ₨5,000 |
| Style | Bold, right aligned |
| Border | Top border |

### View Cart Button (Task 32)
| Feature | Value |
|---------|-------|
| Text | "View Cart" |
| Style | Secondary/outline |
| Link | /cart |
| Width | Half width |

### Checkout Button (Task 33)
| Feature | Value |
|---------|-------|
| Text | "Checkout" |
| Style | Primary filled |
| Link | /checkout |
| Width | Half width |

### Empty Mini Cart (Task 34)
| Element | Content |
|---------|---------|
| Icon | Empty cart icon |
| Text | "Your cart is empty" |
| CTA | "Continue Shopping" |

### Mini Cart Animation (Task 35)
| Feature | Value |
|---------|-------|
| Enter | Fade + slide down |
| Exit | Fade + slide up |
| Duration | 200ms |
| Ease | ease-out |
