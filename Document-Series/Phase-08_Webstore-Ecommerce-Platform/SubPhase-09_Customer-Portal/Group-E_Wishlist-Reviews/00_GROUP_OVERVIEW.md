# Group E: Wishlist & Reviews

> **Phase:** 08 - Webstore & E-Commerce Platform  
> **SubPhase:** 09 - Customer Portal  
> **Group:** E of F  
> **Tasks Covered:** 69-84  
> **Group Goal:** Create wishlist management and customer reviews section

---

## Navigation

- **↑ Parent:** [00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [Group-D_Addresses](../Group-D_Addresses/)
- **→ Next Group:** [Group-F_Account-Settings-Testing](../Group-F_Account-Settings-Testing/)

---

## Group Overview

This group creates wishlist and reviews pages. Creates wishlist page with header and product grid. Creates wishlist product card with add to cart and remove buttons. Creates empty wishlist state with browse products CTA. Creates reviews page with header and review list. Creates review card showing product, rating, and review text with edit and delete buttons. Creates empty reviews state. Verifies both wishlist and reviews functionality.

### Key Outcomes

- Wishlist page
- Wishlist header
- Wishlist grid
- Wishlist product card
- Add to cart button
- Remove from wishlist button
- Empty wishlist state
- Browse products CTA
- Reviews page
- Reviews header
- Review list
- Review card
- Edit review button
- Delete review button
- Empty reviews state
- Wishlist & reviews verified

### Technology Context

- **Wishlist:** Synced with store
- **Reviews:** Customer's reviews
- **Grid:** Product card layout
- **Actions:** Add to cart, delete

---

## Documents in This Group

| # | Document | Description | Tasks Covered |
|---|----------|-------------|---------------|
| 01 | `01_Tasks-69-76_Wishlist.md` | Create wishlist components | 69-76 |
| 02 | `02_Tasks-77-84_Reviews.md` | Create reviews components | 77-84 |

---

## Task Summary

| Task # | Task Name | Complexity | Dependencies |
|--------|-----------|------------|--------------|
| 69 | Create Wishlist Page | Low | Task 68 |
| 70 | Create Wishlist Header | Low | Task 69 |
| 71 | Create Wishlist Grid | Low | Task 69 |
| 72 | Create Wishlist Product Card | Medium | Task 71 |
| 73 | Create Add to Cart Button | Low | Task 72 |
| 74 | Create Remove from Wishlist | Low | Task 72 |
| 75 | Create Empty Wishlist State | Low | Task 71 |
| 76 | Create Browse Products CTA | Low | Task 75 |
| 77 | Create Reviews Page | Low | Task 68 |
| 78 | Create Reviews Header | Low | Task 77 |
| 79 | Create Review List | Low | Task 77 |
| 80 | Create Review Card | Medium | Task 79 |
| 81 | Create Edit Review Button | Low | Task 80 |
| 82 | Create Delete Review Button | Low | Task 80 |
| 83 | Create Empty Reviews State | Low | Task 79 |
| 84 | Verify Wishlist & Reviews | Low | Task 83 |

---

## Execution Order

```
Task 69: Wishlist Page          Task 77: Reviews Page
    │                               │
    ├────────┐                      ├────────┐
    ▼        ▼                      ▼        ▼
T-70     T-71                    T-78     T-79
(Header) (Grid)                 (Header) (List)
    │        │                      │        │
    │   ┌────┴────┐                 │   ┌────┴────┐
    │   ▼         ▼                 │   ▼         ▼
    │ T-72      T-75               │ T-80      T-83
    │ (Card)   (Empty)             │ (Card)   (Empty)
    │   │         │                 │   │         │
    │ ┌─┴──┐      ▼                 │ ┌─┴──┐      │
    │ ▼    ▼   T-76                │ ▼    ▼      │
    │T-73 T-74 (CTA)               │T-81 T-82    │
    │(Cart)(Remove)                 │(Edit)(Del) │
    │ │    │    │                   │ │    │     │
    └─┴────┴────┘                   └─┴────┴─────┘
           │                              │
           └──────────────┬───────────────┘
                          │
                          ▼
                    Task 84: Verify
```

---

## Expected Deliverables

```
frontend/
├── components/
│   └── storefront/
│       └── portal/
│           ├── Wishlist/
│           │   ├── WishlistPage.tsx
│           │   ├── WishlistHeader.tsx
│           │   ├── WishlistGrid.tsx
│           │   ├── WishlistCard.tsx
│           │   ├── AddToCartButton.tsx
│           │   ├── RemoveWishlist.tsx
│           │   ├── EmptyWishlist.tsx
│           │   └── index.ts
│           └── Reviews/
│               ├── ReviewsPage.tsx
│               ├── ReviewsHeader.tsx
│               ├── ReviewList.tsx
│               ├── ReviewCard.tsx
│               ├── EditReviewButton.tsx
│               ├── DeleteReviewButton.tsx
│               ├── EmptyReviews.tsx
│               └── index.ts
└── services/
    └── storefront/
        └── portal/
            ├── wishlistService.ts
            └── reviewService.ts
```

---

## Notes for AI Agents

### Wishlist Page (Task 69)
| Section | Order |
|---------|-------|
| 1 | Header with count |
| 2 | Product grid |
| 3 | Empty state if none |

### Wishlist Grid (Task 71)
| Layout | Columns |
|--------|---------|
| Desktop | 4 |
| Tablet | 3 |
| Mobile | 2 |

### Wishlist Product Card (Task 72)
| Element | Position |
|---------|----------|
| Image | Top |
| Name | Below image |
| Price | Below name |
| Actions | Bottom |

### Add to Cart Button (Task 73)
| Feature | Description |
|---------|-------------|
| Text | "Add to Cart" |
| Icon | ShoppingCart |
| Action | Add to cart store |
| Success | Toast confirmation |

### Remove from Wishlist (Task 74)
| Feature | Description |
|---------|-------------|
| Style | Icon button |
| Icon | X or Trash |
| Position | Top right of card |
| Confirm | Optional toast |

### Empty Wishlist State (Task 75)
| Element | Content |
|---------|---------|
| Icon | Heart outline |
| Title | "Your wishlist is empty" |
| Message | "Save items for later" |
| CTA | Browse products button |

### Reviews Page (Task 77)
| Section | Order |
|---------|-------|
| 1 | Header with count |
| 2 | Review list |
| 3 | Empty state if none |

### Review Card (Task 80)
| Element | Position |
|---------|----------|
| Product image | Left |
| Product name | Top |
| Rating stars | Below name |
| Review text | Middle |
| Date | Bottom left |
| Actions | Bottom right |

### Edit Review Button (Task 81)
| Feature | Description |
|---------|-------------|
| Text | "Edit" |
| Action | Open edit modal |
| Modal | Same as write review |

### Delete Review Button (Task 82)
| Feature | Description |
|---------|-------------|
| Text | "Delete" |
| Action | Confirm then delete |
| Confirm | Modal or toast |

### Empty Reviews State (Task 83)
| Element | Content |
|---------|---------|
| Icon | Star outline |
| Title | "No reviews yet" |
| Message | "Review your purchased products" |
