# Group D: Variant & Cart Actions

> **Phase:** 08 - Webstore & E-Commerce Platform  
> **SubPhase:** 04 - Product Detail Page  
> **Group:** D of F  
> **Tasks Covered:** 53-68  
> **Group Goal:** Create variant selection (size, color), quantity selector, and add to cart/wishlist actions

---

## Navigation

- **↑ Parent:** [00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [Group-C_Product-Information](../Group-C_Product-Information/)
- **→ Next Group:** [Group-E_Tabs-Reviews](../Group-E_Tabs-Reviews/)

---

## Group Overview

This group creates variant selection and cart actions. Creates variant selection container with option groups. Creates size selector and color selector with color swatches. Creates variant unavailable state styling. Creates variant selection logic and price update on variant change. Creates quantity selector with min/max limits. Creates add to cart button with loading and success states. Creates buy now button. Creates wishlist toggle button. Verifies all cart actions work correctly.

### Key Outcomes

- Variant selection container
- Variant option group
- Size selector (S, M, L, XL)
- Color selector
- Color swatch component
- Variant unavailable state
- Variant selection logic
- Price update on variant
- Quantity selector
- Quantity min/max limits
- Add to cart button
- Buy now button
- Add to cart loading state
- Add to cart success toast
- Wishlist button
- Cart actions verified

### Technology Context

- **State:** Local state + Zustand cart
- **Variants:** Price/stock per combination
- **Toast:** Sonner notifications
- **Auth:** Wishlist requires login

---

## Documents in This Group

| # | Document | Description | Tasks Covered |
|---|----------|-------------|---------------|
| 01 | `01_Tasks-53-60_Variants-Selection.md` | Create variant selectors and logic | 53-60 |
| 02 | `02_Tasks-61-68_Quantity-Cart-Wishlist.md` | Create quantity, cart actions, and wishlist | 61-68 |

---

## Task Summary

| Task # | Task Name | Complexity | Dependencies |
|--------|-----------|------------|--------------|
| 53 | Create Variant Selection Container | Low | Task 35 |
| 54 | Create Variant Option Group | Low | Task 53 |
| 55 | Create Size Selector | Low | Task 54 |
| 56 | Create Color Selector | Medium | Task 54 |
| 57 | Create Color Swatch | Low | Task 56 |
| 58 | Create Variant Unavailable State | Low | Task 54 |
| 59 | Create Variant Selection Logic | Medium | Task 53 |
| 60 | Create Price Update on Variant | Medium | Task 59 |
| 61 | Create Quantity Selector | Low | Task 35 |
| 62 | Create Quantity Min/Max Limits | Low | Task 61 |
| 63 | Create Add to Cart Button | Medium | Task 59 |
| 64 | Create Buy Now Button | Low | Task 63 |
| 65 | Create Add to Cart Loading | Low | Task 63 |
| 66 | Create Add to Cart Success | Low | Task 65 |
| 67 | Create Wishlist Button | Medium | Task 35 |
| 68 | Verify Cart Actions | Low | Task 67 |

---

## Execution Order

```
Task 53: Variant Selection Container
    │
    ├──────────────────────────────────────────────────┐
    ▼                                                  │
Task 54: Variant Option Group                          │
    │                                                  │
    ├──────────┬──────────┬──────────┐                 │
    ▼          ▼          ▼          │                 │
Task 55    Task 56    Task 58       │                 │
(Size)     (Color)   (Unavail)      │                 │
    │          │          │          │                 │
    │          ▼          │          │                 │
    │     Task 57        │          │                 │
    │    (Swatch)        │          │                 │
    │          │          │          │                 │
    └──────────┴──────────┘          │                 │
               │                     │                 │
               ▼                     │                 │
         Task 59: Variant Logic      │                 │
               │                     │                 │
               ▼                     │                 │
         Task 60: Price Update       │                 │
               │                     │                 │
               └─────────────────────┘                 │
                          │                            │
                          ▼                            │
                    Task 61: Quantity Selector         │
                          │                            │
                          ▼                            │
                    Task 62: Quantity Limits           │
                          │                            │
                          ▼                            │
                    Task 63: Add to Cart Button        │
                          │                            │
                    ┌─────┴─────┐                      │
                    ▼           ▼                      │
                 Task 64    Task 65                    │
                (Buy Now)  (Loading)                   │
                    │           │                      │
                    │           ▼                      │
                    │     Task 66                      │
                    │    (Success)                     │
                    │           │                      │
                    └─────┬─────┘                      │
                          ▼                            │
                    Task 67: Wishlist Button           │
                          │                            │
                          ▼
                    Task 68: Verify
```

---

## Expected Deliverables

```
frontend/
├── components/
│   └── storefront/
│       └── product/
│           ├── VariantSelector/
│           │   ├── VariantSelector.tsx
│           │   ├── VariantOptionGroup.tsx
│           │   ├── SizeSelector.tsx
│           │   ├── ColorSelector.tsx
│           │   ├── ColorSwatch.tsx
│           │   └── index.ts
│           ├── QuantitySelector/
│           │   ├── QuantitySelector.tsx
│           │   └── index.ts
│           └── CartActions/
│               ├── AddToCartButton.tsx
│               ├── BuyNowButton.tsx
│               ├── WishlistButton.tsx
│               └── index.ts
├── hooks/
│   └── store/
│       └── useVariantSelection.ts
```

---

## Notes for AI Agents

### Variant Selection Container (Task 53)
| Layout | Description |
|--------|-------------|
| Stack | Vertical stack |
| Gap | 16px between groups |
| Label | Variant type label |

### Size Selector (Task 55)
| Size | Display |
|------|---------|
| XS | Extra Small |
| S | Small |
| M | Medium |
| L | Large |
| XL | Extra Large |
| XXL | 2X Large |

### Size Button States
| State | Style |
|-------|-------|
| Available | Border, clickable |
| Selected | Filled, primary color |
| Unavailable | Strikethrough, disabled |

### Color Selector (Task 56)
| Feature | Description |
|---------|-------------|
| Swatches | Circle color buttons |
| Selected | Border ring |
| Tooltip | Color name on hover |
| Update | Gallery image changes |

### Color Swatch (Task 57)
| Feature | Value |
|---------|-------|
| Size | 32-40px circle |
| Border | 2px on select |
| Check | Checkmark if selected |
| Pattern | Gradient if multi-color |

### Variant Unavailable (Task 58)
| Style | Description |
|-------|-------------|
| Visual | Strikethrough line |
| Cursor | not-allowed |
| Opacity | 50% |
| Click | Disabled |

### Variant Logic (Task 59)
| Feature | Description |
|---------|-------------|
| State | Track selected options |
| Validation | All required selected |
| Availability | Check stock per combo |
| SKU | Update selected SKU |

### Price Update (Task 60)
| Trigger | Action |
|---------|--------|
| Variant change | Update price display |
| Different price | Show new price |
| Same price | No change needed |

### Quantity Selector (Task 61)
| Element | Description |
|---------|-------------|
| Minus | Decrease button |
| Input | Number display |
| Plus | Increase button |
| Style | Inline group |

### Quantity Limits (Task 62)
| Limit | Value |
|-------|-------|
| Minimum | 1 |
| Maximum | Stock quantity |
| Disabled | At limits |

### Add to Cart Button (Task 63)
| State | Text | Style |
|-------|------|-------|
| Default | Add to Cart | Primary |
| Disabled | Select Options | Muted |
| Loading | Adding... | Spinner |
| Out of Stock | Out of Stock | Disabled |

### Buy Now Button (Task 64)
| Action | Description |
|--------|-------------|
| Click | Add to cart + redirect |
| Redirect | /checkout |
| Style | Secondary button |

### Add to Cart Success (Task 66)
| Element | Content |
|---------|---------|
| Toast | "Added to cart" |
| Image | Product thumbnail |
| Action | "View Cart" link |
| Duration | 4 seconds |

### Wishlist Button (Task 67)
| State | Icon | Text |
|-------|------|------|
| Not Added | Heart outline | Add to Wishlist |
| Added | Heart filled | In Wishlist |
| Auth | - | Login required |
