# Group B: Header Components

> **Phase:** 08 - Webstore & E-Commerce Platform  
> **SubPhase:** 02 - Storefront Layout  
> **Group:** B of F  
> **Tasks Covered:** 15-34  
> **Group Goal:** Create header with logo, search, account menu, cart icon, and wishlist

---

## Navigation

- **↑ Parent:** [00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [Group-A_Layout-Shell-Structure](../Group-A_Layout-Shell-Structure/)
- **→ Next Group:** [Group-C_Navigation-Mega-Menu](../Group-C_Navigation-Mega-Menu/)

---

## Group Overview

This group creates all header components. Creates main header component and header TypeScript types. Creates header container. Creates logo component with image handler and link. Creates header search with mobile search icon and overlay. Creates account link with dropdown for guest/logged-in users. Creates cart icon button with count badge. Creates mini cart dropdown with items and footer. Creates wishlist icon. Creates header actions group container.

### Key Outcomes

- Header component
- Header TypeScript types
- Header container
- Logo component
- Logo image handler
- Logo link to homepage
- Header search input
- Search icon button (mobile)
- Search overlay (mobile)
- Account link
- Account dropdown menu
- Login/Register links (guest)
- Logged-in menu (customer)
- Cart icon button
- Cart count badge
- Mini cart dropdown
- Mini cart item
- Mini cart footer
- Wishlist icon
- Header actions group

### Technology Context

- **Icons:** Lucide React
- **State:** Zustand for cart/wishlist
- **Dropdown:** Headless UI or custom
- **Animation:** Framer Motion

---

## Documents in This Group

| # | Document | Description | Tasks Covered |
|---|----------|-------------|---------------|
| 01 | `01_Tasks-15-24_Header-Logo-Search-Account.md` | Create header, logo, search, and account | 15-24 |
| 02 | `02_Tasks-25-34_Account-Menu-Cart-Actions.md` | Create account menu, cart, and header actions | 25-34 |

---

## Task Summary

| Task # | Task Name | Complexity | Dependencies |
|--------|-----------|------------|--------------|
| 15 | Create Header Component | Medium | Task 14 |
| 16 | Create Header Types | Low | Task 15 |
| 17 | Create Header Container | Low | Task 15 |
| 18 | Create Logo Component | Low | Task 15 |
| 19 | Create Logo Image Handler | Low | Task 18 |
| 20 | Create Logo Link | Low | Task 18 |
| 21 | Create Header Search | Medium | Task 15 |
| 22 | Create Search Icon Button | Low | Task 21 |
| 23 | Create Search Overlay | Medium | Task 22 |
| 24 | Create Account Link | Low | Task 15 |
| 25 | Create Account Dropdown | Medium | Task 24 |
| 26 | Create Login/Register Links | Low | Task 25 |
| 27 | Create Logged In Menu | Low | Task 25 |
| 28 | Create Cart Icon Button | Low | Task 15 |
| 29 | Create Cart Count Badge | Low | Task 28 |
| 30 | Create Mini Cart Dropdown | Medium | Task 28 |
| 31 | Create Mini Cart Item | Low | Task 30 |
| 32 | Create Mini Cart Footer | Low | Task 30 |
| 33 | Create Wishlist Icon | Low | Task 15 |
| 34 | Create Header Actions Group | Low | Task 33 |

---

## Execution Order

```
Task 15: Header Component
    │
    ├──────────────────────────────────────────────────┐
    ▼                                                  │
Task 16: Header Types                                  │
    │                                                  │
    ▼                                                  │
Task 17: Header Container                              │
    │                                                  │
    ├──────────┬──────────┬──────────┬──────────┐      │
    ▼          ▼          ▼          ▼          │      │
Task 18    Task 21    Task 24    Task 28       │      │
(Logo)    (Search)   (Account)  (Cart)         │      │
    │          │          │          │          │      │
    ├────┐     │          │          │          │      │
    ▼    ▼     │          │          │          │      │
T-19  T-20    │          │          │          │      │
(Img) (Link)  │          │          │          │      │
    │    │     │          │          │          │      │
    └────┘     │          │          │          │      │
         │     │          │          │          │      │
         │     ├────┐     │          │          │      │
         │     ▼    ▼     │          │          │      │
         │  T-22  T-23   │          │          │      │
         │  (Icon)(Overlay)│         │          │      │
         │     │    │     │          │          │      │
         │     └────┘     │          │          │      │
         │           │     │          │          │      │
         │           │     ├────┬────┐│          │      │
         │           │     ▼    ▼    │▼          │      │
         │           │  T-25  T-26  T-27        │      │
         │           │ (Drop)(Login)(Logged)    │      │
         │           │     │    │    │          │      │
         │           │     └────┴────┘          │      │
         │           │          │               │      │
         │           │          │    ┌──────────┘      │
         │           │          │    │                 │
         │           │          │    ├────┬────┐       │
         │           │          │    ▼    ▼    ▼       │
         │           │          │  T-29  T-30  T-33    │
         │           │          │ (Badge)(Mini)(Wish)  │
         │           │          │    │    │    │       │
         │           │          │    │  ┌─┴─┐  │       │
         │           │          │    │  ▼   ▼  │       │
         │           │          │    │ T-31 T-32│       │
         │           │          │    │(Item)(Foot)     │
         │           │          │    │  │   │  │       │
         └───────────┴──────────┴────┴──┴───┴──┘       │
                          │                            │
                          ▼
                    Task 34: Header Actions Group
```

---

## Expected Deliverables

```
frontend/
├── components/
│   └── storefront/
│       └── layout/
│           └── Header/
│               ├── Header.tsx
│               ├── HeaderContainer.tsx
│               ├── Logo.tsx
│               ├── HeaderSearch.tsx
│               ├── SearchOverlay.tsx
│               ├── AccountMenu.tsx
│               ├── AccountDropdown.tsx
│               ├── CartIcon.tsx
│               ├── CartBadge.tsx
│               ├── MiniCart.tsx
│               ├── MiniCartItem.tsx
│               ├── MiniCartFooter.tsx
│               ├── WishlistIcon.tsx
│               ├── HeaderActions.tsx
│               └── index.ts
└── types/
    └── store/
        └── header.ts
```

---

## Notes for AI Agents

### Header Layout (Task 15)
| Section | Mobile | Desktop |
|---------|--------|---------|
| Left | Menu, Logo | Logo |
| Center | - | Navigation |
| Right | Search, Cart | Search, Account, Wishlist, Cart |

### Logo Component (Task 18)
| Prop | Type | Default |
|------|------|---------|
| src | string | /logo.svg |
| alt | string | Store name |
| width | number | 150 |
| height | number | 40 |

### Header Search (Task 21)
| Feature | Description |
|---------|-------------|
| Desktop | Inline search input |
| Mobile | Icon button |
| Placeholder | "Search products..." |
| Submit | On enter or click |

### Search Overlay (Task 23)
| Feature | Description |
|---------|-------------|
| Trigger | Mobile search icon |
| Style | Full width below header |
| Focus | Auto-focus input |
| Close | On submit or blur |

### Account Dropdown (Task 25)
| State | Menu Items |
|-------|------------|
| Guest | Login, Register |
| Logged | Profile, Orders, Wishlist, Logout |

### Cart Count Badge (Task 29)
| Condition | Display |
|-----------|---------|
| Empty | Hidden |
| 1-99 | Show count |
| 100+ | Show 99+ |
| Style | Red circle |

### Mini Cart (Task 30)
| Section | Content |
|---------|---------|
| Header | "Cart (3 items)" |
| Items | Product list (max 3) |
| Empty | "Your cart is empty" |
| Footer | Subtotal, View Cart, Checkout |

### Mini Cart Item (Task 31)
| Element | Content |
|---------|---------|
| Image | Product thumbnail |
| Name | Product name |
| Price | ₨ X,XXX.XX |
| Qty | Quantity |
| Remove | X button |

### Mini Cart Footer (Task 32)
| Element | Content |
|---------|---------|
| Subtotal | "Subtotal: ₨ X,XXX.XX" |
| View Cart | Link to /cart |
| Checkout | Button to /checkout |

### Wishlist Icon (Task 33)
| Feature | Description |
|---------|-------------|
| Icon | Heart outline |
| Count | Badge if items |
| Link | /wishlist |
| Auth | Require login |
