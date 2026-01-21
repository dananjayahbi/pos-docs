# Group F: Related Products & Testing

> **Phase:** 08 - Webstore & E-Commerce Platform  
> **SubPhase:** 04 - Product Detail Page  
> **Group:** F of F  
> **Tasks Covered:** 83-94  
> **Group Goal:** Create related products, recently viewed, cross-sell sections, and final testing

---

## Navigation

- **↑ Parent:** [00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [Group-E_Tabs-Reviews](../Group-E_Tabs-Reviews/)
- **→ Next Group:** None (Last Group) | **Next SubPhase:** [SubPhase-05_Search-Functionality](../../SubPhase-05_Search-Functionality/)

---

## Group Overview

This group creates related products and testing. Creates related products section with header and horizontal product grid. Creates related product card. Creates related products data fetcher. Creates recently viewed section with localStorage storage. Creates cross-sell section ("Frequently bought together"). Performs comprehensive testing: gallery on mobile, variant selection, add to cart flow, and responsive layout.

### Key Outcomes

- Related products section
- Related products header
- Related products grid (horizontal scroll)
- Related product card
- Related products data fetcher
- Recently viewed section
- Recently viewed localStorage storage
- Cross-sell section
- Mobile gallery tested
- Variant selection tested
- Add to cart flow tested
- Responsive layout tested

### Technology Context

- **Scroll:** Horizontal scroll container
- **Storage:** localStorage for recent
- **Data:** TanStack Query
- **Testing:** Manual + E2E

---

## Documents in This Group

| # | Document | Description | Tasks Covered |
|---|----------|-------------|---------------|
| 01 | `01_Tasks-83-90_Related-Recent-CrossSell.md` | Create related, recently viewed, and cross-sell | 83-90 |
| 02 | `02_Tasks-91-94_Final-Testing.md` | Perform final testing across all features | 91-94 |

---

## Task Summary

| Task # | Task Name | Complexity | Dependencies |
|--------|-----------|------------|--------------|
| 83 | Create Related Products Section | Medium | Task 68 |
| 84 | Create Related Products Header | Low | Task 83 |
| 85 | Create Related Products Grid | Low | Task 83 |
| 86 | Create Related Product Card | Low | Task 85 |
| 87 | Create Related Products Fetch | Medium | Task 83 |
| 88 | Create Recently Viewed Section | Medium | Task 83 |
| 89 | Create Recently Viewed Storage | Low | Task 88 |
| 90 | Create Cross-sell Section | Medium | Task 83 |
| 91 | Test Gallery on Mobile | Low | Task 34 |
| 92 | Test Variant Selection | Low | Task 68 |
| 93 | Test Add to Cart | Low | Task 68 |
| 94 | Test Responsive Layout | Low | Task 93 |

---

## Execution Order

```
Task 83: Related Products Section
    │
    ├──────────────────────────────────────────────────┐
    ▼                                                  │
Task 84: Related Products Header                       │
    │                                                  │
    ▼                                                  │
Task 85: Related Products Grid                         │
    │                                                  │
    ▼                                                  │
Task 86: Related Product Card                          │
    │                                                  │
    ▼                                                  │
Task 87: Related Products Fetch                        │
    │                                                  │
    └──────────────────────────────────────────────────┘
               │
         ┌─────┴─────┐
         ▼           ▼
      Task 88    Task 90
    (Recently) (Cross-sell)
         │           │
         ▼           │
      Task 89       │
     (Storage)      │
         │           │
         └─────┬─────┘
               │
    ┌──────────┼──────────┬──────────┐
    ▼          ▼          ▼          │
Task 91    Task 92    Task 93       │
(Gallery)  (Variant)  (Cart)        │
    │          │          │          │
    └──────────┴──────────┘          │
               │                     │
               ▼
         Task 94: Responsive Test
```

---

## Expected Deliverables

```
frontend/
├── components/
│   └── storefront/
│       └── product/
│           └── RelatedProducts/
│               ├── RelatedProducts.tsx
│               ├── RelatedProductsHeader.tsx
│               ├── RelatedProductsGrid.tsx
│               ├── RelatedProductCard.tsx
│               ├── RecentlyViewed.tsx
│               ├── CrossSell.tsx
│               └── index.ts
├── hooks/
│   └── store/
│       ├── useRelatedProducts.ts
│       └── useRecentlyViewed.ts
└── tests/
    └── e2e/
        └── product-detail.spec.ts
```

---

## Notes for AI Agents

### Related Products Section (Task 83)
| Feature | Description |
|---------|-------------|
| Title | "You May Also Like" |
| Products | 4-8 related products |
| Source | Same category/tags |
| Scroll | Horizontal on mobile |

### Related Products Header (Task 84)
| Element | Content |
|---------|---------|
| Title | "You May Also Like" |
| Link | "View All" (optional) |
| Style | Section header |

### Related Products Grid (Task 85)
| Device | Layout |
|--------|--------|
| Desktop | 4 columns |
| Tablet | 3 columns |
| Mobile | Horizontal scroll |

### Related Product Card (Task 86)
| Element | Content |
|---------|---------|
| Image | Product thumbnail |
| Title | Product name |
| Price | Price display |
| Rating | Star rating |
| Size | Smaller than main card |

### Related Products Fetch (Task 87)
| Endpoint | Parameters |
|----------|------------|
| /api/products/{id}/related | product_id |
| /api/products?category={id} | Fallback |
| Limit | 8 products |

### Recently Viewed Section (Task 88)
| Feature | Description |
|---------|-------------|
| Title | "Recently Viewed" |
| Products | User's browsing history |
| Limit | Max 8 products |
| Exclude | Current product |

### Recently Viewed Storage (Task 89)
| Feature | Value |
|---------|-------|
| Storage | localStorage |
| Key | lcc-recently-viewed |
| Max Items | 20 products |
| Data | Product ID + timestamp |
| Expire | 30 days |

### Cross-sell Section (Task 90)
| Feature | Description |
|---------|-------------|
| Title | "Frequently Bought Together" |
| Products | 2-3 complementary items |
| Bundle | Combined price option |
| Source | AI recommendation |

### Test Gallery on Mobile (Task 91)
| Test | Expectation |
|------|-------------|
| Swipe | Images slide |
| Dots | Indicator updates |
| Tap | Opens lightbox |
| Pinch | Zooms image |
| Portrait | Full width |

### Test Variant Selection (Task 92)
| Test | Expectation |
|------|-------------|
| Size click | Size selected |
| Color click | Image changes |
| Unavailable | Cannot select |
| Price | Updates if different |
| Stock | Updates per variant |

### Test Add to Cart (Task 93)
| Test | Expectation |
|------|-------------|
| Without variant | Shows error |
| With variant | Adds to cart |
| Loading | Shows spinner |
| Success | Shows toast |
| Cart count | Increments |
| Buy Now | Redirects to checkout |

### Test Responsive Layout (Task 94)
| Breakpoint | Test |
|------------|------|
| Mobile (<640px) | Stack layout |
| Tablet (640-1024px) | 2-column |
| Desktop (>1024px) | Full layout |
| Images | Responsive sizing |
| Tabs | Full width |
| Related | Scroll on mobile |
