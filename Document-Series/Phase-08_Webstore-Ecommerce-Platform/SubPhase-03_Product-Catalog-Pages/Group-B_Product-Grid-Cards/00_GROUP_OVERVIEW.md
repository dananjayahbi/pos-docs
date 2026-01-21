# Group B: Product Grid & Cards

> **Phase:** 08 - Webstore & E-Commerce Platform  
> **SubPhase:** 03 - Product Catalog Pages  
> **Group:** B of F  
> **Tasks Covered:** 17-36  
> **Group Goal:** Create responsive product grid with feature-rich product cards

---

## Navigation

- **↑ Parent:** [00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [Group-A_Catalog-Routes-Pages](../Group-A_Catalog-Routes-Pages/)
- **→ Next Group:** [Group-C_Filter-Sidebar](../Group-C_Filter-Sidebar/)

---

## Group Overview

This group creates product grid and cards. Creates product grid component with responsive layout config. Creates product card component with image section (hover, badges, quick actions). Creates card content section with category, title, rating, and price (regular, sale, discount percentage). Creates card add to cart button with variant select. Creates product card skeleton. Verifies all product cards render correctly.

### Key Outcomes

- Product grid component
- Grid layout config (2/3/4 columns)
- Product card component
- Card image section
- Card image with lazy loading
- Card image hover (secondary)
- Card badge (Sale/New/Out of Stock)
- Card quick actions (wishlist, quick view)
- Card content section
- Card category link
- Card title with link
- Card rating display
- Card price component
- Regular price display
- Sale price display
- Discount percentage badge
- Card add to cart button
- Card variant select
- Product card skeleton
- Product cards verified

### Technology Context

- **Grid:** CSS Grid responsive
- **Images:** Next.js Image optimization
- **Lazy Loading:** Intersection Observer
- **Animation:** Framer Motion hover

---

## Documents in This Group

| # | Document | Description | Tasks Covered |
|---|----------|-------------|---------------|
| 01 | `01_Tasks-17-27_Grid-Card-Image-Content.md` | Create grid, card structure, image, and content | 17-27 |
| 02 | `02_Tasks-28-36_Rating-Price-Cart-Skeleton.md` | Create rating, price, add to cart, and skeleton | 28-36 |

---

## Task Summary

| Task # | Task Name | Complexity | Dependencies |
|--------|-----------|------------|--------------|
| 17 | Create Product Grid Component | Medium | Task 16 |
| 18 | Create Grid Layout Config | Low | Task 17 |
| 19 | Create Product Card Component | Medium | Task 17 |
| 20 | Create Card Image Section | Low | Task 19 |
| 21 | Create Card Image Component | Low | Task 20 |
| 22 | Create Card Image Hover | Low | Task 20 |
| 23 | Create Card Badge | Low | Task 20 |
| 24 | Create Card Quick Actions | Medium | Task 20 |
| 25 | Create Card Content Section | Low | Task 19 |
| 26 | Create Card Category | Low | Task 25 |
| 27 | Create Card Title | Low | Task 25 |
| 28 | Create Card Rating | Low | Task 25 |
| 29 | Create Card Price | Medium | Task 25 |
| 30 | Create Regular Price Display | Low | Task 29 |
| 31 | Create Sale Price Display | Low | Task 29 |
| 32 | Create Discount Percentage | Low | Task 29 |
| 33 | Create Card Add to Cart | Medium | Task 19 |
| 34 | Create Card Variant Select | Medium | Task 33 |
| 35 | Create Product Card Skeleton | Low | Task 19 |
| 36 | Verify Product Cards | Low | Task 35 |

---

## Execution Order

```
Task 17: Product Grid Component
    │
    ├──────────┐
    ▼          │
Task 18: Grid Layout Config
    │          │
    ▼          │
Task 19: Product Card Component
    │
    ├──────────────────────────────────────────────────┐
    ▼                                                  │
Task 20: Card Image Section                            │
    │                                                  │
    ├──────────┬──────────┬──────────┐                 │
    ▼          ▼          ▼          ▼                 │
Task 21    Task 22    Task 23    Task 24              │
(Image)    (Hover)    (Badge)   (Quick)               │
    │          │          │          │                 │
    └──────────┴──────────┴──────────┘                 │
               │                                       │
               ▼                                       │
         Task 25: Card Content Section                 │
               │                                       │
    ┌──────────┼──────────┬──────────┐                 │
    ▼          ▼          ▼          │                 │
Task 26    Task 27    Task 28       │                 │
(Category) (Title)    (Rating)      │                 │
    │          │          │          │                 │
    └──────────┴──────────┘          │                 │
               │                     │                 │
               ▼                     │                 │
         Task 29: Card Price         │                 │
               │                     │                 │
    ┌──────────┼──────────┐          │                 │
    ▼          ▼          ▼          │                 │
Task 30    Task 31    Task 32       │                 │
(Regular)  (Sale)   (Discount)      │                 │
    │          │          │          │                 │
    └──────────┴──────────┘          │                 │
               │                     │                 │
               ▼                     │                 │
         Task 33: Add to Cart        │                 │
               │                     │                 │
               ▼                     │                 │
         Task 34: Variant Select     │                 │
               │                     │                 │
               ▼                     │                 │
         Task 35: Skeleton           │                 │
               │                     │
               ▼
         Task 36: Verify
```

---

## Expected Deliverables

```
frontend/
├── components/
│   └── storefront/
│       └── catalog/
│           └── ProductGrid/
│               ├── ProductGrid.tsx
│               ├── GridConfig.ts
│               ├── ProductCard.tsx
│               ├── CardImage.tsx
│               ├── CardBadge.tsx
│               ├── CardQuickActions.tsx
│               ├── CardContent.tsx
│               ├── CardCategory.tsx
│               ├── CardTitle.tsx
│               ├── CardRating.tsx
│               ├── CardPrice.tsx
│               ├── CardAddToCart.tsx
│               ├── VariantSelect.tsx
│               ├── ProductCardSkeleton.tsx
│               └── index.ts
```

---

## Notes for AI Agents

### Grid Layout Config (Task 18)
| Breakpoint | Columns | Gap |
|------------|---------|-----|
| Mobile | 2 | 12px |
| Tablet | 3 | 16px |
| Desktop | 4 | 20px |

### Card Image Section (Task 20)
| Feature | Description |
|---------|-------------|
| Ratio | 1:1 or 3:4 |
| Hover | Show secondary image |
| Overlay | Quick action icons |
| Badge | Top-left corner |

### Card Badges (Task 23)
| Badge | Color | Condition |
|-------|-------|-----------|
| Sale | Red | On sale |
| New | Green | < 7 days |
| Out of Stock | Gray | Stock = 0 |

### Card Quick Actions (Task 24)
| Action | Icon | Description |
|--------|------|-------------|
| Wishlist | Heart | Add to wishlist |
| Quick View | Eye | Open quick view modal |
| Compare | Layers | Add to compare |

### Card Rating (Task 28)
| Element | Display |
|---------|---------|
| Stars | 5 stars (filled/empty) |
| Average | 4.5 rating |
| Count | (123 reviews) |

### Price Display (Task 29-32)
| Scenario | Display |
|----------|---------|
| Regular | ₨ 2,500.00 |
| Sale | ~~₨ 3,000~~ ₨ 2,500 |
| Discount | -17% badge |
| Free | Free |

### Add to Cart (Task 33)
| State | Button Text |
|-------|-------------|
| Available | Add to Cart |
| Out of Stock | Out of Stock (disabled) |
| Has Variants | Select Options |
| Adding | Adding... |

### Variant Select (Task 34)
| Feature | Description |
|---------|-------------|
| Type | Dropdown or swatches |
| Display | Show on card hover |
| Required | Must select before add |

### Card Skeleton (Task 35)
| Element | Animation |
|---------|-----------|
| Image | Pulse rectangle |
| Title | Pulse lines |
| Price | Pulse block |
| Button | Pulse block |
