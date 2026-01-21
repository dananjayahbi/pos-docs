# Group E: Store State Management

> **Phase:** 08 - Webstore & E-Commerce Platform  
> **SubPhase:** 01 - Webstore Project Structure  
> **Group:** E of F  
> **Tasks Covered:** 61-76  
> **Group Goal:** Set up Zustand stores and TanStack Query hooks for store state management

---

## Navigation

- **↑ Parent:** [00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [Group-D_Store-API-Client](../Group-D_Store-API-Client/)
- **→ Next Group:** [Group-F_Store-Utilities-Testing](../Group-F_Store-Utilities-Testing/)

---

## Group Overview

This group creates all store state management. Configures Zustand for the store. Creates cart store with actions for add, update, remove, and clear. Creates cart persistence using localStorage. Creates wishlist store, customer auth store, UI state store (mobile menu, etc.), recently viewed store, and comparison store. Configures TanStack Query client. Creates product query hooks and category query hooks. Verifies all stores and hooks work correctly.

### Key Outcomes

- Store Zustand configuration
- Cart store created
- Add to cart action
- Update cart action
- Remove from cart action
- Clear cart action
- Cart persistence (localStorage)
- Wishlist store
- Customer auth store
- UI state store
- Recently viewed store
- Comparison store
- TanStack Query configuration
- Product query hooks
- Category query hooks
- State management verified

### Technology Context

- **State:** Zustand with persistence
- **Server State:** TanStack Query v5
- **Persistence:** localStorage middleware
- **Devtools:** Redux DevTools compatible

---

## Documents in This Group

| # | Document | Description | Tasks Covered |
|---|----------|-------------|---------------|
| 01 | `01_Tasks-61-70_Zustand-Stores.md` | Create Zustand stores | 61-70 |
| 02 | `02_Tasks-71-76_Extended-Stores-Query.md` | Create extended stores and query hooks | 71-76 |

---

## Task Summary

| Task # | Task Name | Complexity | Dependencies |
|--------|-----------|------------|--------------|
| 61 | Create Store Zustand Config | Low | Task 60 |
| 62 | Create Cart Store | Medium | Task 61 |
| 63 | Create Add to Cart Action | Low | Task 62 |
| 64 | Create Update Cart Action | Low | Task 62 |
| 65 | Create Remove from Cart Action | Low | Task 62 |
| 66 | Create Clear Cart Action | Low | Task 62 |
| 67 | Create Cart Persistence | Medium | Task 62 |
| 68 | Create Wishlist Store | Medium | Task 61 |
| 69 | Create Customer Store | Medium | Task 61 |
| 70 | Create UI Store | Low | Task 61 |
| 71 | Create Recently Viewed Store | Low | Task 61 |
| 72 | Create Comparison Store | Medium | Task 61 |
| 73 | Create TanStack Query Config | Medium | Task 61 |
| 74 | Create Product Query Hooks | Medium | Task 73 |
| 75 | Create Category Query Hooks | Low | Task 73 |
| 76 | Verify State Management | Low | Task 75 |

---

## Execution Order

```
Task 61: Store Zustand Config
    │
    ├──────────────────────────────────────────────────┐
    ▼                                                  │
Task 62: Cart Store                                    │
    │                                                  │
    ├──────────┬──────────┬──────────┬──────────┐      │
    ▼          ▼          ▼          ▼          │      │
Task 63    Task 64    Task 65    Task 66       │      │
(Add)      (Update)   (Remove)   (Clear)       │      │
    │          │          │          │          │      │
    └──────────┴──────────┴──────────┘          │      │
               │                                │      │
               ▼                                │      │
         Task 67: Cart Persistence              │      │
               │                                │      │
               └────────────────────────────────┘      │
                          │                            │
    ┌──────────┬──────────┼──────────┬──────────┐      │
    ▼          ▼          ▼          ▼          │      │
Task 68    Task 69    Task 70    Task 71       │      │
(Wishlist) (Customer) (UI)     (Recent)        │      │
    │          │          │          │          │      │
    └──────────┴──────────┴──────────┘          │      │
               │                                │      │
               ▼                                │      │
         Task 72: Comparison Store              │      │
               │                                │      │
               ▼                                │      │
         Task 73: Query Config                  │      │
               │                                │      │
         ┌─────┴─────┐                          │      │
         ▼           ▼                          │      │
      Task 74    Task 75                        │      │
     (Products) (Categories)                    │      │
         │           │                          │      │
         └─────┬─────┘                          │      │
               ▼
         Task 76: Verify
```

---

## Expected Deliverables

```
frontend/
├── store/
│   ├── cart.ts                   # Cart store
│   ├── wishlist.ts               # Wishlist store
│   ├── customer.ts               # Customer auth store
│   ├── ui.ts                     # UI state store
│   ├── recently-viewed.ts        # Recently viewed
│   ├── comparison.ts             # Product comparison
│   └── index.ts                  # Export all
├── hooks/
│   └── store/
│       ├── useCart.ts            # Cart hook
│       ├── useWishlist.ts        # Wishlist hook
│       ├── useCustomer.ts        # Customer hook
│       ├── useProducts.ts        # Products query
│       ├── useCategories.ts      # Categories query
│       └── index.ts
├── lib/
│   └── store/
│       └── query-client.ts       # Query config
```

---

## Notes for AI Agents

### Cart Store State (Task 62)
| Property | Type | Description |
|----------|------|-------------|
| items | CartItem[] | Cart items |
| itemCount | number | Total quantity |
| subtotal | number | Before shipping |
| total | number | Final total |

### Cart Item Type
| Property | Type |
|----------|------|
| id | string |
| productId | string |
| name | string |
| price | number |
| quantity | number |
| image | string |
| variant | object? |

### Add to Cart (Task 63)
| Parameter | Type | Required |
|-----------|------|----------|
| product | Product | Yes |
| quantity | number | No (default 1) |
| variant | Variant | No |

### Cart Persistence (Task 67)
| Feature | Implementation |
|---------|----------------|
| Storage | localStorage |
| Key | lcc-store-cart |
| Sync | On hydration |
| Clear | On checkout complete |

### Wishlist Store (Task 68)
| Property | Type |
|----------|------|
| items | Product[] |
| add | (product) => void |
| remove | (id) => void |
| isInWishlist | (id) => boolean |

### Customer Store (Task 69)
| Property | Type |
|----------|------|
| customer | Customer | null |
| isLoggedIn | boolean |
| login | (credentials) => Promise |
| logout | () => void |
| register | (data) => Promise |

### UI Store (Task 70)
| Property | Type | Default |
|----------|------|---------|
| mobileMenuOpen | boolean | false |
| cartDrawerOpen | boolean | false |
| searchOpen | boolean | false |
| quickViewProduct | Product? | null |

### Recently Viewed (Task 71)
| Property | Type |
|----------|------|
| products | Product[] |
| maxItems | 10 |
| add | (product) => void |
| clear | () => void |

### Comparison Store (Task 72)
| Property | Type |
|----------|------|
| products | Product[] |
| maxItems | 4 |
| add | (product) => void |
| remove | (id) => void |

### TanStack Query Config (Task 73)
| Setting | Value |
|---------|-------|
| staleTime | 60000 |
| cacheTime | 300000 |
| refetchOnWindowFocus | false |
| retry | 1 |

### Product Query Hooks (Task 74)
| Hook | Description |
|------|-------------|
| useProducts | List products |
| useProduct | Single product |
| useFeaturedProducts | Featured products |
| useSaleProducts | Sale products |
| useRelatedProducts | Related products |

### Category Query Hooks (Task 75)
| Hook | Description |
|------|-------------|
| useCategories | List categories |
| useCategory | Single category |
| useCategoryProducts | Category products |
