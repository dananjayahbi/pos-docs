# Group A: Cart State & Store

> **Phase:** 08 - Webstore & E-Commerce Platform  
> **SubPhase:** 06 - Shopping Cart  
> **Group:** A of F  
> **Tasks Covered:** 01-18  
> **Group Goal:** Create cart route, Zustand store with actions, selectors, and TypeScript types

---

## Navigation

- **↑ Parent:** [00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous Group:** None (First Group)
- **→ Next Group:** [Group-B_Mini-Cart-Component](../Group-B_Mini-Cart-Component/)

---

## Group Overview

This group creates the cart route and Zustand store. Creates cart directory, page route, layout, and loading state. Creates cart store directory and Zustand cart store setup. Creates CartItem and Cart state TypeScript interfaces. Creates cart actions: addItem, removeItem, updateQuantity, clearCart. Creates computed selectors for total, item count, and subtotal. Creates variant key generator for unique item identification. Creates cart context provider. Verifies all cart store actions work correctly.

### Key Outcomes

- Cart directory (/cart route)
- Cart page route
- Cart page layout
- Cart loading skeleton
- Cart store directory
- Zustand cart store
- CartItem TypeScript type
- Cart state TypeScript type
- Add to cart action
- Remove from cart action
- Update quantity action
- Clear cart action
- Cart total selector
- Item count selector
- Subtotal selector
- Variant key generator
- Cart context provider
- Cart store verified

### Technology Context

- **State:** Zustand store
- **Types:** TypeScript interfaces
- **Key:** productId-size-color
- **Currency:** LKR (₨)

---

## Documents in This Group

| # | Document | Description | Tasks Covered |
|---|----------|-------------|---------------|
| 01 | `01_Tasks-01-09_Route-Store-Actions.md` | Create route, store, and initial actions | 01-09 |
| 02 | `02_Tasks-10-18_Actions-Selectors-Verify.md` | Create remaining actions, selectors, and verification | 10-18 |

---

## Task Summary

| Task # | Task Name | Complexity | Dependencies |
|--------|-----------|------------|--------------|
| 01 | Create Cart Directory | Low | SubPhase-05 |
| 02 | Create Cart Page Route | Low | Task 01 |
| 03 | Create Cart Page Layout | Low | Task 01 |
| 04 | Create Cart Loading State | Low | Task 02 |
| 05 | Create Cart Store Directory | Low | Task 01 |
| 06 | Create Cart Store | Medium | Task 05 |
| 07 | Create CartItem Type | Low | Task 06 |
| 08 | Create Cart State Type | Low | Task 07 |
| 09 | Create Add to Cart Action | Medium | Task 06 |
| 10 | Create Remove from Cart Action | Low | Task 06 |
| 11 | Create Update Quantity Action | Low | Task 06 |
| 12 | Create Clear Cart Action | Low | Task 06 |
| 13 | Create Cart Total Selector | Medium | Task 06 |
| 14 | Create Cart Item Count Selector | Low | Task 06 |
| 15 | Create Cart Subtotal Selector | Low | Task 13 |
| 16 | Create Variant Key Generator | Low | Task 07 |
| 17 | Create Cart Context Provider | Low | Task 06 |
| 18 | Verify Cart Store | Low | Task 17 |

---

## Execution Order

```
Task 01: Cart Directory
    │
    ├──────────┬──────────┐
    ▼          ▼          │
Task 02    Task 03    Task 05
(Route)    (Layout)  (Store Dir)
    │          │          │
    ▼          │          ▼
Task 04       │     Task 06: Zustand Store
(Loading)     │          │
    │          │     ┌────┴────┬────────┬────────┐
    └──────────┘     ▼         ▼        ▼        │
         │       Task 07   Task 09  Task 10      │
         │      (Type)    (Add)   (Remove)      │
         │          │         │        │         │
         │          ▼         │        │         │
         │     Task 08       │        │         │
         │    (State)        │        │         │
         │          │         │        │         │
         │          ▼         │        │         │
         │     Task 16       │        │         │
         │    (Key Gen)      │        │         │
         │          │         │        │         │
         └──────────┴─────────┴────────┘         │
                          │                      │
    ┌─────────────────────┴──────────────────────┘
    │
    ├────────┬────────┬────────┐
    ▼        ▼        ▼        │
T-11     T-12     T-13        │
(Update)(Clear)  (Total)      │
    │        │        │        │
    │        │        ▼        │
    │        │     T-14       │
    │        │    (Count)     │
    │        │        │        │
    │        │        ▼        │
    │        │     T-15       │
    │        │   (Subtotal)   │
    │        │        │        │
    └────────┴────────┘        │
               │               │
               ▼               │
         Task 17: Context      │
               │               │
               ▼
         Task 18: Verify
```

---

## Expected Deliverables

```
frontend/
├── app/
│   └── (storefront)/
│       └── cart/
│           ├── page.tsx
│           ├── layout.tsx
│           └── loading.tsx
├── stores/
│   └── storefront/
│       └── cartStore.ts
├── types/
│   └── storefront/
│       └── cart.types.ts
└── providers/
    └── CartProvider.tsx
```

---

## Notes for AI Agents

### Cart Directory (Task 01)
| Path | Purpose |
|------|---------|
| /cart | Cart page route |
| Route Group | (storefront) |

### Cart Store (Task 06)
| Feature | Description |
|---------|-------------|
| Library | Zustand |
| Name | useCartStore |
| Persist | With middleware |
| DevTools | Enable in dev |

### CartItem Type (Task 07)
| Property | Type | Description |
|----------|------|-------------|
| id | string | Cart item ID |
| productId | string | Product ID |
| variantId | string | Variant ID |
| name | string | Product name |
| image | string | Image URL |
| price | number | Unit price |
| quantity | number | Quantity |
| variant | object | Size, color, etc |
| maxQuantity | number | Stock limit |

### Cart State Type (Task 08)
| Property | Type | Description |
|----------|------|-------------|
| items | CartItem[] | Cart items |
| coupon | Coupon | null | Applied coupon |
| isLoading | boolean | Loading state |
| error | string | null | Error message |

### Add to Cart Action (Task 09)
| Logic | Description |
|-------|-------------|
| Existing | Increase quantity |
| New | Add to items array |
| Max | Check stock limit |
| Key | Use variant key |

### Variant Key Generator (Task 16)
| Format | Example |
|--------|---------|
| Pattern | productId-size-color |
| Example | prod123-M-red |
| Use | Unique item ID |

### Cart Total Selector (Task 13)
| Calculation | Description |
|-------------|-------------|
| Subtotal | Sum of line totals |
| Discount | Apply coupon |
| Total | Subtotal - discount |

### Item Count Selector (Task 14)
| Type | Count |
|------|-------|
| Items | Unique products |
| Units | Total quantities |
