# Group C: Cart Management

> **Phase:** 07 - Frontend Infrastructure & ERP Dashboard  
> **SubPhase:** 11 - POS Interface  
> **Group:** C of F  
> **Tasks Covered:** 35-52  
> **Group Goal:** Build shopping cart with quantity management, item options, and state persistence

---

## Navigation

- **↑ Parent:** [00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [Group-B_Product-Search-Quick-Buttons](../Group-B_Product-Search-Quick-Buttons/)
- **→ Next Group:** [Group-D_Discount-Tax-Calculations](../Group-D_Discount-Tax-Calculations/)

---

## Group Overview

This group creates the complete shopping cart functionality. Creates cart container and scrollable items list. Creates cart item row with product name/variant display, quantity controls (+/- buttons), direct quantity input, line price display, and remove button. Creates item options button for additional actions including line item discount. Creates empty cart state display. Creates Zustand cart state store with actions for add, update quantity, remove, and clear cart. Creates clear cart confirmation dialog. Implements cart persistence in localStorage for offline capability.

### Key Outcomes

- Cart container component
- Cart items list (scrollable)
- Cart item row component
- Item name/variant display
- Quantity controls (+/-)
- Direct quantity input
- Item price display
- Remove item button
- Item options button
- Item discount input
- Empty cart state
- Cart state store (Zustand)
- Add to cart action
- Update quantity action
- Remove from cart action
- Clear cart action
- Clear cart confirmation
- Cart localStorage persistence

### Technology Context

- **State:** Zustand store
- **Persistence:** localStorage
- **Scroll:** Virtual scroll for many items
- **Actions:** Quantity +/- controls

---

## Documents in This Group

| # | Document | Description | Tasks Covered |
|---|----------|-------------|---------------|
| 01 | `01_Tasks-35-44_CartUI-Items.md` | Create cart UI and item components | 35-44 |
| 02 | `02_Tasks-45-52_State-Persistence.md` | Create cart state and persistence | 45-52 |

---

## Task Summary

| Task # | Task Name | Complexity | Dependencies |
|--------|-----------|------------|--------------|
| 35 | Create Cart Container | Low | Task 11 |
| 36 | Create Cart Items List | Low | Task 35 |
| 37 | Create Cart Item Row | Medium | Task 36 |
| 38 | Create Item Name Display | Low | Task 37 |
| 39 | Create Item Quantity Controls | Medium | Task 37 |
| 40 | Create Quantity Input Field | Low | Task 39 |
| 41 | Create Item Price Display | Low | Task 37 |
| 42 | Create Remove Item Button | Low | Task 37 |
| 43 | Create Item Options Button | Low | Task 37 |
| 44 | Create Item Discount Input | Medium | Task 43 |
| 45 | Create Empty Cart State | Low | Task 36 |
| 46 | Create Cart State Store | Medium | Task 35 |
| 47 | Create Add to Cart Action | Medium | Task 46 |
| 48 | Create Update Quantity Action | Low | Task 46 |
| 49 | Create Remove from Cart Action | Low | Task 46 |
| 50 | Create Clear Cart Action | Low | Task 46 |
| 51 | Create Clear Cart Dialog | Low | Task 50 |
| 52 | Create Cart Persistence | Medium | Task 46 |

---

## Execution Order

```
Task 35: Cart Container
    │
    ├──────────────────────────────────────────────────┐
    ▼                                                  │
Task 36: Cart Items List                               │
    │                                                  │
    ▼                                                  │
Task 37: Cart Item Row                                 │
    │                                                  │
    ├──────────┬──────────┬──────────┬──────────┐      │
    ▼          ▼          ▼          ▼          │      │
Task 38    Task 39    Task 41    Task 42       │      │
(Name)     (Qty)      (Price)    (Remove)      │      │
    │          │          │          │          │      │
    │          ▼          │          │          │      │
    │       Task 40       │          │          │      │
    │       (Input)       │          │          │      │
    │          │          │          │          │      │
    └──────────┴──────────┴──────────┘          │      │
               │                                │      │
               ▼                                │      │
         Task 43: Item Options                  │      │
               │                                │      │
               ▼                                │      │
         Task 44: Item Discount                 │      │
               │                                │      │
               ▼                                │      │
         Task 45: Empty State                   │      │
               │                                │      │
               └────────────────────────────────┘      │
                              │                        │
                              ▼                        │
                        Task 46: Cart Store            │
                              │                        │
                        ┌─────┼─────┬─────┬─────┐      │
                        ▼     ▼     ▼     ▼     │      │
                     Task 47 Task 48 Task 49 Task 50   │
                     (Add)   (Update)(Remove)(Clear)   │
                        │     │     │     │     │      │
                        └─────┴─────┴─────┘     │      │
                              │                 │      │
                              │                 ▼      │
                              │          Task 51       │
                              │          (Dialog)      │
                              │                 │      │
                              └─────────┬───────┘      │
                                        ▼
                                  Task 52: Persistence
```

---

## Expected Deliverables

```
frontend/
├── components/
│   └── modules/
│       └── pos/
│           └── Cart/
│               ├── CartPanel.tsx
│               ├── CartContainer.tsx
│               ├── CartItemsList.tsx
│               ├── CartItem.tsx
│               ├── ItemName.tsx
│               ├── QuantityControls.tsx
│               ├── QuantityInput.tsx
│               ├── ItemPrice.tsx
│               ├── RemoveItemButton.tsx
│               ├── ItemOptionsMenu.tsx
│               ├── ItemDiscount.tsx
│               ├── EmptyCart.tsx
│               ├── ClearCartDialog.tsx
│               └── index.ts
└── store/
    └── pos/
        ├── cart.ts
        └── index.ts
```

---

## Notes for AI Agents

### Cart Container (Task 35)
| Feature | Description |
|---------|-------------|
| Height | Fill available space |
| Scroll | Items list scrollable |
| Fixed | Totals at bottom |

### Cart Item Row (Task 37)
| Element | Position | Content |
|---------|----------|---------|
| Name | Left | Product + variant |
| Qty | Center | +/- and input |
| Price | Right | Line total |
| Remove | Far right | X button |

### Quantity Controls (Task 39)
| Button | Action |
|--------|--------|
| - | Decrease by 1 |
| + | Increase by 1 |
| Input | Direct entry |
| Min | 1 (or remove) |

### Item Options (Task 43)
| Option | Action |
|--------|--------|
| Discount | Open discount input |
| Note | Add item note |
| Remove | Remove item |

### Item Discount (Task 44)
| Field | Type |
|-------|------|
| Type | % or Fixed |
| Value | Number input |
| Apply | Save discount |

### Empty Cart (Task 45)
| Element | Content |
|---------|---------|
| Icon | ShoppingCart |
| Text | "Cart is empty" |
| Hint | "Search or select products" |

### Cart State (Task 46)
| State | Type |
|-------|------|
| items | CartItem[] |
| discount | CartDiscount |
| customer | Customer | null |

### Cart Actions (Tasks 47-50)
| Action | Parameters |
|--------|------------|
| addItem | product, variant?, qty |
| updateQty | itemId, qty |
| removeItem | itemId |
| clearCart | - |

### Clear Cart Dialog (Task 51)
| Element | Content |
|---------|---------|
| Title | Clear Cart? |
| Message | Remove all items? |
| Cancel | Close dialog |
| Confirm | Clear and close |

### Cart Persistence (Task 52)
| Feature | Description |
|---------|-------------|
| Key | pos_cart |
| Storage | localStorage |
| Sync | On cart change |
| Restore | On mount |
