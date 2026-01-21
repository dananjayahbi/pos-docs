# Group C: Product Information

> **Phase:** 08 - Webstore & E-Commerce Platform  
> **SubPhase:** 04 - Product Detail Page  
> **Group:** C of F  
> **Tasks Covered:** 35-52  
> **Group Goal:** Create product information section with title, price, rating, stock, and share buttons

---

## Navigation

- **↑ Parent:** [00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [Group-B_Image-Gallery](../Group-B_Image-Gallery/)
- **→ Next Group:** [Group-D_Variant-Cart-Actions](../Group-D_Variant-Cart-Actions/)

---

## Group Overview

This group creates product information display. Creates product info container. Creates product title and SKU display. Creates rating summary with star rating display and review count link. Creates price display with original price, discount badge, and tax info. Creates short description. Creates stock status with low stock warning. Creates delivery estimate with free shipping note. Creates share buttons for WhatsApp and Facebook.

### Key Outcomes

- Product info container
- Product title
- Product SKU
- Rating summary
- Star rating display
- Review count link
- Price display (LKR ₨)
- Original price (strikethrough)
- Discount badge (-XX% OFF)
- Tax info text
- Short description
- Stock status
- Low stock warning
- Delivery estimate
- Free shipping note
- Share buttons container
- WhatsApp share
- Facebook share

### Technology Context

- **Currency:** LKR with ₨ symbol
- **Rating:** 5-star visual
- **Share:** Web Share API + fallbacks
- **WhatsApp:** Sri Lanka primary

---

## Documents in This Group

| # | Document | Description | Tasks Covered |
|---|----------|-------------|---------------|
| 01 | `01_Tasks-35-44_Info-Rating-Price.md` | Create info container, rating, and price | 35-44 |
| 02 | `02_Tasks-45-52_Description-Stock-Share.md` | Create description, stock, and share buttons | 45-52 |

---

## Task Summary

| Task # | Task Name | Complexity | Dependencies |
|--------|-----------|------------|--------------|
| 35 | Create Product Info Container | Low | Task 16 |
| 36 | Create Product Title | Low | Task 35 |
| 37 | Create Product SKU | Low | Task 35 |
| 38 | Create Rating Summary | Low | Task 35 |
| 39 | Create Star Rating Display | Low | Task 38 |
| 40 | Create Review Count Link | Low | Task 38 |
| 41 | Create Price Display | Medium | Task 35 |
| 42 | Create Original Price | Low | Task 41 |
| 43 | Create Discount Badge | Low | Task 41 |
| 44 | Create Tax Info | Low | Task 41 |
| 45 | Create Short Description | Low | Task 35 |
| 46 | Create Stock Status | Low | Task 35 |
| 47 | Create Low Stock Warning | Low | Task 46 |
| 48 | Create Delivery Estimate | Low | Task 35 |
| 49 | Create Free Shipping Note | Low | Task 48 |
| 50 | Create Share Buttons | Low | Task 35 |
| 51 | Create WhatsApp Share | Low | Task 50 |
| 52 | Create Facebook Share | Low | Task 50 |

---

## Execution Order

```
Task 35: Product Info Container
    │
    ├──────────────────────────────────────────────────┐
    ▼                                                  │
Task 36: Product Title                                 │
    │                                                  │
    ▼                                                  │
Task 37: Product SKU                                   │
    │                                                  │
    ▼                                                  │
Task 38: Rating Summary                                │
    │                                                  │
    ├──────────┬──────────┐                            │
    ▼          ▼          │                            │
Task 39    Task 40       │                            │
(Stars)    (Count)       │                            │
    │          │          │                            │
    └──────────┘          │                            │
         │                │                            │
         ▼                │                            │
   Task 41: Price Display │                            │
         │                │                            │
    ┌────┼────┬──────────┐│                            │
    ▼    ▼    ▼          ││                            │
T-42  T-43  T-44         ││                            │
(Orig)(Disc)(Tax)        ││                            │
    │    │    │          ││                            │
    └────┴────┘          ││                            │
         │               ││                            │
         ▼               ││                            │
   Task 45: Description  ││                            │
         │               ││                            │
         ▼               ││                            │
   Task 46: Stock Status ││                            │
         │               ││                            │
         ▼               ││                            │
   Task 47: Low Stock    ││                            │
         │               ││                            │
         ▼               ││                            │
   Task 48: Delivery     ││                            │
         │               ││                            │
         ▼               ││                            │
   Task 49: Free Shipping││                            │
         │               ││                            │
         ▼               ││                            │
   Task 50: Share Buttons││                            │
         │               ││                            │
    ┌────┴────┐          ││                            │
    ▼         ▼          ││                            │
Task 51   Task 52        ││                            │
(WhatsApp)(Facebook)     ││                            │
```

---

## Expected Deliverables

```
frontend/
├── components/
│   └── storefront/
│       └── product/
│           └── ProductInfo/
│               ├── ProductInfo.tsx
│               ├── ProductTitle.tsx
│               ├── ProductSKU.tsx
│               ├── RatingSummary.tsx
│               ├── StarRating.tsx
│               ├── ReviewCountLink.tsx
│               ├── PriceDisplay.tsx
│               ├── OriginalPrice.tsx
│               ├── DiscountBadge.tsx
│               ├── TaxInfo.tsx
│               ├── ShortDescription.tsx
│               ├── StockStatus.tsx
│               ├── LowStockWarning.tsx
│               ├── DeliveryEstimate.tsx
│               ├── FreeShippingNote.tsx
│               ├── ShareButtons.tsx
│               ├── WhatsAppShare.tsx
│               ├── FacebookShare.tsx
│               └── index.ts
```

---

## Notes for AI Agents

### Product Info Layout (Task 35)
| Order | Component |
|-------|-----------|
| 1 | Title |
| 2 | SKU |
| 3 | Rating |
| 4 | Price |
| 5 | Description |
| 6 | Stock |
| 7 | Delivery |
| 8 | Variants (next group) |
| 9 | Actions (next group) |
| 10 | Share |

### Product Title (Task 36)
| Element | Style |
|---------|-------|
| Tag | H1 |
| Size | 24-32px |
| Weight | Bold |
| Color | Primary text |

### Product SKU (Task 37)
| Element | Content |
|---------|---------|
| Label | "SKU:" |
| Value | ABC123 |
| Style | Small, muted |

### Star Rating (Task 39)
| Feature | Description |
|---------|-------------|
| Stars | 5 total |
| Filled | Gold color |
| Empty | Gray outline |
| Half | Partial fill |
| Size | 16-20px |

### Review Count Link (Task 40)
| Feature | Description |
|---------|-------------|
| Text | "(25 reviews)" |
| Action | Scroll to reviews tab |
| Style | Link underline |

### Price Display (Task 41)
| Scenario | Display |
|----------|---------|
| Regular | ₨ 2,500.00 |
| Sale | ~~₨ 3,000~~ ₨ 2,500 |
| Size | Large, prominent |

### Discount Badge (Task 43)
| Feature | Value |
|---------|-------|
| Format | -20% OFF |
| Color | Red/accent |
| Position | After price |

### Tax Info (Task 44)
| Text | "Inclusive of all taxes" |
| Style | Small, muted |
| Visible | Always |

### Stock Status (Task 46)
| Status | Display |
|--------|---------|
| In Stock | Green "In Stock" |
| Low Stock | Orange "Only X left" |
| Out of Stock | Red "Out of Stock" |

### Delivery Estimate (Task 48)
| Feature | Content |
|---------|---------|
| Icon | Truck icon |
| Text | "Delivery by Mon, Jan 20" |
| Location | Based on IP/address |

### Free Shipping (Task 49)
| Condition | Text |
|-----------|------|
| Eligible | "Free shipping on this item" |
| Threshold | "Free shipping on orders over ₨5,000" |

### WhatsApp Share (Task 51)
| Feature | Value |
|---------|-------|
| Icon | WhatsApp icon |
| Text | Pre-filled message |
| URL | wa.me share link |
| Message | "Check out this product: [Name] - [URL]" |

### Facebook Share (Task 52)
| Feature | Value |
|---------|-------|
| Icon | Facebook icon |
| URL | Facebook share URL |
| Dialog | Share dialog popup |
