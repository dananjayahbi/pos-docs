# Group F: Persistence & Testing

> **Phase:** 08 - Webstore & E-Commerce Platform  
> **SubPhase:** 06 - Shopping Cart  
> **Group:** F of F  
> **Tasks Covered:** 85-96  
> **Group Goal:** Create cart persistence with localStorage and API sync, plus comprehensive testing

---

## Navigation

- **↑ Parent:** [00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [Group-E_Coupon-Summary](../Group-E_Coupon-Summary/)
- **→ Next Group:** None (Last Group) | **Next SubPhase:** [SubPhase-07_Checkout-Flow](../../SubPhase-07_Checkout-Flow/)

---

## Group Overview

This group creates cart persistence and testing. Creates localStorage persistence using Zustand persist middleware. Creates hydration hook for loading cart on app start. Creates cart merge logic for combining guest cart with logged-in user cart. Creates API cart sync for backend persistence. Creates cart expiry for old items. Creates stock re-validation and price update checks on page load. Performs comprehensive testing: add to cart flow, quantity updates, mini cart, mobile cart, and cart persistence.

### Key Outcomes

- localStorage persistence
- Cart hydration hook
- Cart merge logic (guest + user)
- API cart sync
- Cart item expiry
- Stock re-validation
- Price update check
- Add to cart flow tested
- Quantity updates tested
- Mini cart tested
- Cart page mobile tested
- Cart persistence tested

### Technology Context

- **localStorage:** Guest users
- **API Sync:** Logged-in users
- **Zustand:** Persist middleware
- **Merge:** On login event

---

## Documents in This Group

| # | Document | Description | Tasks Covered |
|---|----------|-------------|---------------|
| 01 | `01_Tasks-85-91_Persistence-Sync.md` | Create persistence and sync | 85-91 |
| 02 | `02_Tasks-92-96_Comprehensive-Testing.md` | Perform comprehensive testing | 92-96 |

---

## Task Summary

| Task # | Task Name | Complexity | Dependencies |
|--------|-----------|------------|--------------|
| 85 | Create localStorage Persist | Medium | Task 84 |
| 86 | Create Hydration Hook | Low | Task 85 |
| 87 | Create Cart Merge Logic | Medium | Task 86 |
| 88 | Create API Cart Sync | Medium | Task 86 |
| 89 | Create Cart Expiry | Low | Task 85 |
| 90 | Create Stock Re-validation | Medium | Task 88 |
| 91 | Create Price Update Check | Medium | Task 90 |
| 92 | Test Add to Cart Flow | Low | Task 70 |
| 93 | Test Quantity Updates | Low | Task 70 |
| 94 | Test Mini Cart | Low | Task 36 |
| 95 | Test Cart Page Mobile | Low | Task 54 |
| 96 | Test Cart Persistence | Low | Task 91 |

---

## Execution Order

```
Task 85: localStorage Persist
    │
    ├──────────┐
    ▼          │
Task 86    Task 89
(Hydration)(Expiry)
    │          │
    ├──────────┘
    │
    ├──────────┐
    ▼          │
Task 87    Task 88
(Merge)   (API Sync)
    │          │
    └──────────┘
         │
         ▼
   Task 90: Stock Re-validation
         │
         ▼
   Task 91: Price Check
         │
         │
    ┌────┴────┬────────┬────────┬────────┐
    ▼         ▼        ▼        ▼        │
Task 92   Task 93  Task 94  Task 95      │
(Add)    (Qty)   (Mini)  (Mobile)        │
    │         │        │        │         │
    └─────────┴────────┴────────┘         │
                   │                      │
                   ▼
             Task 96: Persistence Test
```

---

## Expected Deliverables

```
frontend/
├── stores/
│   └── storefront/
│       └── cartStore.ts (with persist)
├── hooks/
│   └── store/
│       ├── useCartHydration.ts
│       ├── useCartSync.ts
│       └── useCartMerge.ts
├── services/
│   └── store/
│       └── cartService.ts
└── tests/
    └── e2e/
        └── cart.spec.ts
```

---

## Notes for AI Agents

### localStorage Persist (Task 85)
| Feature | Value |
|---------|-------|
| Library | Zustand persist |
| Key | lcc-cart |
| Storage | localStorage |
| Serialize | JSON |

### Hydration Hook (Task 86)
| Feature | Description |
|---------|-------------|
| Trigger | On app mount |
| Action | Load persisted cart |
| Delay | After hydration |
| SSR | Handle properly |

### Cart Merge Logic (Task 87)
| Scenario | Action |
|----------|--------|
| Guest → Login | Merge carts |
| Same item | Sum quantities |
| New item | Add to user cart |
| Conflict | User cart priority |

### API Cart Sync (Task 88)
| Endpoint | Purpose |
|----------|---------|
| GET /api/cart | Fetch user cart |
| POST /api/cart | Update cart |
| DELETE /api/cart/item | Remove item |
| Trigger | On cart change |

### Cart Expiry (Task 89)
| Feature | Value |
|---------|-------|
| Duration | 7-30 days |
| Check | On load |
| Remove | Expired items |
| Notify | Optional toast |

### Stock Re-validation (Task 90)
| Trigger | Action |
|---------|--------|
| Page load | Check all items |
| Stale data | Update quantities |
| Out of stock | Alert user |
| Remove | Option to remove |

### Price Update Check (Task 91)
| Trigger | Display |
|---------|---------|
| Price changed | "Price updated" badge |
| Higher | Show old + new |
| Lower | Highlight savings |
| User action | Acknowledge |

### Test Add to Cart Flow (Task 92)
| Step | Verify |
|------|--------|
| 1 | Click Add to Cart |
| 2 | Toast appears |
| 3 | Mini cart updates |
| 4 | Count increments |
| 5 | Cart page shows item |

### Test Quantity Updates (Task 93)
| Test | Expectation |
|------|-------------|
| Increase | Quantity goes up |
| Decrease | Quantity goes down |
| Min = 1 | Cannot go below |
| Max = stock | Cannot exceed |
| Total updates | Recalculated |

### Test Mini Cart (Task 94)
| Test | Expectation |
|------|-------------|
| Click icon | Dropdown opens |
| Items shown | Max 3-4 items |
| Remove | Item removed |
| View Cart | Navigates |
| Checkout | Navigates |

### Test Cart Page Mobile (Task 95)
| Test | Expectation |
|------|-------------|
| Layout | Single column |
| Summary | Below items |
| Touch | Quantity works |
| Remove | Swipe or button |
| Checkout | Visible button |

### Test Cart Persistence (Task 96)
| Test | Expectation |
|------|-------------|
| Add item | Persists |
| Refresh page | Cart restored |
| Close browser | Cart restored |
| Login | Carts merged |
| Logout | Guest cart kept |
