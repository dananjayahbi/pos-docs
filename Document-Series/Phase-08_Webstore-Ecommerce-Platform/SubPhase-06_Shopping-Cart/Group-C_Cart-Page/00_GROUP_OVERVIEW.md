# Group C: Cart Page

> **Phase:** 08 - Webstore & E-Commerce Platform  
> **SubPhase:** 06 - Shopping Cart  
> **Group:** C of F  
> **Tasks Covered:** 37-54  
> **Group Goal:** Create full cart page with two-column layout, item details, and empty state

---

## Navigation

- **↑ Parent:** [00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [Group-B_Mini-Cart-Component](../Group-B_Mini-Cart-Component/)
- **→ Next Group:** [Group-D_Cart-Item-Management](../Group-D_Cart-Item-Management/)

---

## Group Overview

This group creates the full cart page. Creates cart page container with header showing "Shopping Cart" and item count. Creates two-column layout with items on left and summary on right. Creates cart items container and cart summary container. Creates cart item row with product image, details, variant tags, price, and line total. Creates continue shopping link. Creates empty cart state with illustration and Shop Now button. Creates mobile cart layout with stacked columns. Verifies responsive cart page layout.

### Key Outcomes

- Cart page container
- Cart page header
- Item count in header
- Two-column layout
- Cart items container (left)
- Cart summary container (right)
- Cart item row
- Cart item image
- Cart item details
- Cart item variant tags
- Cart item price
- Cart item line total
- Continue shopping link
- Empty cart page state
- Empty cart illustration
- Shop Now button
- Mobile cart layout
- Responsive layout verified

### Technology Context

- **Layout:** Grid 2 columns
- **Mobile:** Stacked layout
- **Sticky:** Summary on scroll
- **Currency:** LKR (₨)

---

## Documents in This Group

| # | Document | Description | Tasks Covered |
|---|----------|-------------|---------------|
| 01 | `01_Tasks-37-46_Container-Layout-Items.md` | Create container, layout, and items | 37-46 |
| 02 | `02_Tasks-47-54_Price-Empty-Mobile.md` | Create price, empty state, and mobile | 47-54 |

---

## Task Summary

| Task # | Task Name | Complexity | Dependencies |
|--------|-----------|------------|--------------|
| 37 | Create Cart Page Container | Low | Task 36 |
| 38 | Create Cart Page Header | Low | Task 37 |
| 39 | Create Cart Item Count Header | Low | Task 38 |
| 40 | Create Cart Two Column Layout | Medium | Task 37 |
| 41 | Create Cart Items Container | Low | Task 40 |
| 42 | Create Cart Summary Container | Low | Task 40 |
| 43 | Create Cart Item Row | Medium | Task 41 |
| 44 | Create Cart Item Image | Low | Task 43 |
| 45 | Create Cart Item Details | Low | Task 43 |
| 46 | Create Cart Item Variant Tags | Low | Task 45 |
| 47 | Create Cart Item Price | Low | Task 43 |
| 48 | Create Cart Item Line Total | Low | Task 47 |
| 49 | Create Continue Shopping Link | Low | Task 37 |
| 50 | Create Empty Cart Page | Medium | Task 37 |
| 51 | Create Empty Cart Illustration | Low | Task 50 |
| 52 | Create Shop Now Button | Low | Task 50 |
| 53 | Create Mobile Cart Layout | Medium | Task 40 |
| 54 | Verify Cart Page Layout | Low | Task 53 |

---

## Execution Order

```
Task 37: Cart Page Container
    │
    ├──────────┬──────────┬──────────┐
    ▼          ▼          ▼          │
Task 38    Task 40    Task 49    Task 50
(Header)  (2-Col)  (Continue)  (Empty)
    │          │          │          │
    ▼          │          │     ┌────┴────┐
Task 39       │          │     ▼         ▼
(Count)       │          │  T-51      T-52
    │          │          │ (Illust)  (Shop)
    │          │          │     │         │
    │     ┌────┴────┐     │     └────┬────┘
    │     ▼         ▼     │          │
    │  T-41      T-42     │          │
    │ (Items)  (Summary)  │          │
    │     │         │     │          │
    │     ▼         │     │          │
    │  Task 43     │     │          │
    │  (Row)       │     │          │
    │     │         │     │          │
    │  ┌──┴──┬──────┐     │          │
    │  ▼     ▼      ▼     │          │
    │T-44  T-45   T-47    │          │
    │(Img)(Details)(Price)│          │
    │  │     │      │     │          │
    │  │     ▼      ▼     │          │
    │  │  T-46   T-48     │          │
    │  │ (Tags)(Total)    │          │
    │  │     │      │     │          │
    └──┴─────┴──────┴─────┴──────────┘
                          │
                          ▼
                    Task 53: Mobile Layout
                          │
                          ▼
                    Task 54: Verify
```

---

## Expected Deliverables

```
frontend/
├── components/
│   └── storefront/
│       └── cart/
│           └── CartPage/
│               ├── CartPage.tsx
│               ├── CartPageHeader.tsx
│               ├── CartTwoColumnLayout.tsx
│               ├── CartItemsContainer.tsx
│               ├── CartSummaryContainer.tsx
│               ├── CartItemRow.tsx
│               ├── CartItemImage.tsx
│               ├── CartItemDetails.tsx
│               ├── CartItemVariantTags.tsx
│               ├── CartItemPrice.tsx
│               ├── CartItemLineTotal.tsx
│               ├── ContinueShoppingLink.tsx
│               ├── EmptyCart.tsx
│               └── index.ts
```

---

## Notes for AI Agents

### Cart Page Container (Task 37)
| Feature | Value |
|---------|-------|
| Max Width | 1200px |
| Padding | 24-32px |
| Center | mx-auto |

### Cart Page Header (Task 38)
| Element | Content |
|---------|---------|
| Title | "Shopping Cart" |
| Tag | H1 |
| Size | 24-32px |
| Weight | Bold |

### Item Count Header (Task 39)
| Format | Example |
|--------|---------|
| Pattern | "(X items)" |
| Zero | "(0 items)" |
| One | "(1 item)" |
| Style | Normal weight |

### Two Column Layout (Task 40)
| Column | Width | Content |
|--------|-------|---------|
| Left | 65-70% | Cart items |
| Right | 30-35% | Summary |
| Gap | 32px | Between |

### Cart Item Row (Task 43)
| Layout | Description |
|--------|-------------|
| Direction | Horizontal flex |
| Padding | 16-24px |
| Border | Bottom border |
| Gap | 16px |

### Cart Item Image (Task 44)
| Feature | Value |
|---------|-------|
| Size | 100-120px |
| Aspect | 1:1 |
| Border | Rounded |
| Link | To product page |

### Cart Item Details (Task 45)
| Line | Content |
|------|---------|
| 1 | Product name (link) |
| 2 | Variant tags |
| 3 | SKU (optional) |

### Variant Tags (Task 46)
| Format | Example |
|--------|---------|
| Style | Pill badges |
| Content | Size: M, Color: Red |
| Separator | Comma or badges |

### Cart Item Price (Task 47)
| Display | Example |
|---------|---------|
| Unit Price | ₨1,500 |
| Quantity | × 2 |
| Style | Inline |

### Line Total (Task 48)
| Feature | Value |
|---------|-------|
| Calculation | Price × Quantity |
| Format | ₨3,000 |
| Style | Bold |

### Continue Shopping (Task 49)
| Feature | Description |
|---------|-------------|
| Text | "← Continue Shopping" |
| Link | /products |
| Position | Below items or header |

### Empty Cart (Task 50)
| Element | Content |
|---------|---------|
| Illustration | Empty cart SVG |
| Title | "Your cart is empty" |
| Subtitle | "Add items to get started" |
| CTA | "Shop Now" button |

### Mobile Cart Layout (Task 53)
| Feature | Description |
|---------|-------------|
| Breakpoint | < 1024px |
| Layout | Single column |
| Order | Items, then Summary |
| Summary | Sticky bottom option |
