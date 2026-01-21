# Group D: Cart Item Management

> **Phase:** 08 - Webstore & E-Commerce Platform  
> **SubPhase:** 06 - Shopping Cart  
> **Group:** D of F  
> **Tasks Covered:** 55-70  
> **Group Goal:** Create quantity selector, stock validation, remove functionality, and save for later

---

## Navigation

- **↑ Parent:** [00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [Group-C_Cart-Page](../Group-C_Cart-Page/)
- **→ Next Group:** [Group-E_Coupon-Summary](../Group-E_Coupon-Summary/)

---

## Group Overview

This group creates cart item management. Creates quantity selector with decrease and increase buttons plus editable input. Creates min quantity check (min 1 or remove) and max quantity check (max = stock). Creates stock validation, low stock warning, and out of stock alert. Creates remove item button with optional confirmation modal. Creates undo remove toast notification. Creates save for later (move to wishlist) option. Creates update cart toast and debounced quantity changes. Verifies all quantity management flows.

### Key Outcomes

- Quantity selector component
- Decrease button (minus)
- Increase button (plus)
- Quantity input (editable)
- Min quantity check (1)
- Max quantity check (stock)
- Stock validation
- Low stock warning
- Out of stock alert
- Remove item button
- Remove confirmation (optional)
- Undo remove toast
- Save for later option
- Update cart toast
- Debounced quantity updates
- Quantity management verified

### Technology Context

- **Validation:** Real-time stock
- **Debounce:** 500ms delay
- **Toast:** Sonner notifications
- **Wishlist:** Move item option

---

## Documents in This Group

| # | Document | Description | Tasks Covered |
|---|----------|-------------|---------------|
| 01 | `01_Tasks-55-62_Quantity-Stock-Validation.md` | Create quantity selector and stock validation | 55-62 |
| 02 | `02_Tasks-63-70_Remove-Save-Verify.md` | Create remove, save for later, and verification | 63-70 |

---

## Task Summary

| Task # | Task Name | Complexity | Dependencies |
|--------|-----------|------------|--------------|
| 55 | Create Quantity Selector | Medium | Task 54 |
| 56 | Create Decrease Button | Low | Task 55 |
| 57 | Create Increase Button | Low | Task 55 |
| 58 | Create Quantity Input | Low | Task 55 |
| 59 | Create Min Quantity Check | Low | Task 55 |
| 60 | Create Max Quantity Check | Low | Task 55 |
| 61 | Create Stock Validation | Medium | Task 60 |
| 62 | Create Low Stock Warning | Low | Task 61 |
| 63 | Create Out of Stock Alert | Low | Task 61 |
| 64 | Create Remove Item Button | Low | Task 43 |
| 65 | Create Remove Confirmation | Low | Task 64 |
| 66 | Create Undo Remove | Medium | Task 64 |
| 67 | Create Save for Later | Medium | Task 43 |
| 68 | Create Update Cart Toast | Low | Task 55 |
| 69 | Create Debounced Quantity | Low | Task 55 |
| 70 | Verify Quantity Management | Low | Task 69 |

---

## Execution Order

```
Task 55: Quantity Selector
    │
    ├────────┬────────┬────────┬────────┬────────┐
    ▼        ▼        ▼        ▼        ▼        │
T-56     T-57     T-58     T-59     T-60        │
(Dec)   (Inc)   (Input)  (Min)   (Max)         │
    │        │        │        │        │        │
    └────────┴────────┴────────┴────────┘        │
                          │                      │
                          ▼                      │
                    Task 61: Stock Validation    │
                          │                      │
                     ┌────┴────┐                 │
                     ▼         ▼                 │
                  T-62      T-63                │
                 (Low)    (Out)                 │
                     │         │                 │
                     └────┬────┘                 │
                          │                      │
    ┌─────────────────────┘                      │
    │                                            │
    ├────────┬────────┐                          │
    ▼        ▼        │                          │
T-64     T-67        │                          │
(Remove)(Save)       │                          │
    │        │        │                          │
    ├────────┤        │                          │
    ▼        │        │                          │
T-65        │        │                          │
(Confirm)   │        │                          │
    │        │        │                          │
    ▼        │        │                          │
T-66        │        │                          │
(Undo)      │        │                          │
    │        │        │                          │
    └────────┴────────┘                          │
               │                                 │
    ┌──────────┴─────────────────────────────────┘
    │
    ├────────┐
    ▼        │
T-68     T-69
(Toast) (Debounce)
    │        │
    └────────┘
         │
         ▼
   Task 70: Verify
```

---

## Expected Deliverables

```
frontend/
├── components/
│   └── storefront/
│       └── cart/
│           ├── QuantitySelector/
│           │   ├── QuantitySelector.tsx
│           │   ├── DecreaseButton.tsx
│           │   ├── IncreaseButton.tsx
│           │   ├── QuantityInput.tsx
│           │   └── index.ts
│           ├── CartItem/
│           │   ├── RemoveItemButton.tsx
│           │   ├── SaveForLaterButton.tsx
│           │   ├── LowStockWarning.tsx
│           │   ├── OutOfStockAlert.tsx
│           │   └── index.ts
│           └── Modals/
│               └── RemoveConfirmModal.tsx
└── hooks/
    └── store/
        └── useQuantityDebounce.ts
```

---

## Notes for AI Agents

### Quantity Selector (Task 55)
| Element | Description |
|---------|-------------|
| Layout | Inline flex |
| Minus | Left button |
| Input | Center number |
| Plus | Right button |
| Border | Group border |

### Decrease Button (Task 56)
| State | Action |
|-------|--------|
| Qty > 1 | Decrease by 1 |
| Qty = 1 | Disabled or remove |
| Style | Minus icon |

### Increase Button (Task 57)
| State | Action |
|-------|--------|
| Qty < Max | Increase by 1 |
| Qty = Max | Disabled |
| Style | Plus icon |

### Quantity Input (Task 58)
| Feature | Value |
|---------|-------|
| Type | Number input |
| Width | 40-50px |
| Center | Text center |
| Editable | Yes, with blur validate |

### Min Quantity Check (Task 59)
| Rule | Action |
|------|--------|
| < 1 | Set to 1 |
| 0 | Prompt remove |
| Negative | Prevent |

### Max Quantity Check (Task 60)
| Rule | Action |
|------|--------|
| > Stock | Set to max stock |
| At Max | Disable increase |
| Show | Max available tooltip |

### Stock Validation (Task 61)
| Check | When |
|-------|------|
| Add to cart | Before adding |
| Quantity change | On update |
| Page load | Re-validate |

### Low Stock Warning (Task 62)
| Trigger | Display |
|---------|---------|
| Stock < 5 | "Only X left!" |
| Color | Orange/warning |
| Position | Below quantity |

### Out of Stock Alert (Task 63)
| Trigger | Display |
|---------|---------|
| Stock = 0 | "Out of Stock" |
| Action | Suggest remove |
| Style | Red alert |

### Remove Item Button (Task 64)
| Feature | Value |
|---------|-------|
| Icon | Trash or X |
| Text | "Remove" |
| Position | Right side |
| Hover | Show text |

### Remove Confirmation (Task 65)
| Feature | Description |
|---------|-------------|
| Type | Optional modal |
| Title | "Remove item?" |
| Actions | Cancel, Remove |

### Undo Remove (Task 66)
| Feature | Value |
|---------|-------|
| Toast | "Item removed" |
| Action | "Undo" button |
| Duration | 5 seconds |
| Restore | Re-add item |

### Save for Later (Task 67)
| Feature | Description |
|---------|-------------|
| Text | "Save for Later" |
| Action | Move to wishlist |
| Auth | Requires login |
| Confirm | Remove from cart |

### Debounced Quantity (Task 69)
| Feature | Value |
|---------|-------|
| Delay | 500ms |
| Cancel | On new change |
| API | Sync after debounce |
