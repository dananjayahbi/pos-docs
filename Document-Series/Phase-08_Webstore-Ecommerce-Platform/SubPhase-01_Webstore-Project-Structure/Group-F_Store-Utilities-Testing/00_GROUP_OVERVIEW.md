# Group F: Store Utilities & Testing

> **Phase:** 08 - Webstore & E-Commerce Platform  
> **SubPhase:** 01 - Webstore Project Structure  
> **Group:** F of F  
> **Tasks Covered:** 77-88  
> **Group Goal:** Create store utilities, TypeScript types, and final verification

---

## Navigation

- **↑ Parent:** [00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [Group-E_Store-State-Management](../Group-E_Store-State-Management/)
- **→ Next Group:** None (Last Group) | **Next SubPhase:** [SubPhase-02_Storefront-Layout](../../SubPhase-02_Storefront-Layout/)

---

## Group Overview

This group creates store utilities and types. Creates currency formatter for LKR amounts. Creates price display utility for sale/regular prices. Creates discount calculator. Creates image URL helper, product URL helper, and category URL helper. Creates cart total calculator. Creates stock checker utility. Creates store TypeScript types and exports. Creates store project documentation. Performs final verification testing.

### Key Outcomes

- Currency formatter (LKR)
- Price display utility
- Discount calculator
- Image URL helper
- Product URL helper
- Category URL helper
- Cart total calculator
- Stock checker utility
- Store TypeScript types
- Store type exports
- Store project documentation
- Final verification complete

### Technology Context

- **Currency:** LKR formatting
- **URLs:** SEO-friendly slugs
- **Types:** Strong TypeScript typing
- **Testing:** Integration testing

---

## Documents in This Group

| # | Document | Description | Tasks Covered |
|---|----------|-------------|---------------|
| 01 | `01_Tasks-77-84_Utilities.md` | Create store utilities | 77-84 |
| 02 | `02_Tasks-85-88_Types-Testing.md` | Create types and final testing | 85-88 |

---

## Task Summary

| Task # | Task Name | Complexity | Dependencies |
|--------|-----------|------------|--------------|
| 77 | Create Currency Formatter | Low | Task 76 |
| 78 | Create Price Display Utility | Low | Task 77 |
| 79 | Create Discount Calculator | Low | Task 77 |
| 80 | Create Image URL Helper | Low | Task 76 |
| 81 | Create Product URL Helper | Low | Task 76 |
| 82 | Create Category URL Helper | Low | Task 76 |
| 83 | Create Cart Total Calculator | Medium | Task 76 |
| 84 | Create Stock Checker Utility | Low | Task 76 |
| 85 | Create Store TypeScript Types | Medium | Task 76 |
| 86 | Create Store Type Exports | Low | Task 85 |
| 87 | Create Store Project Documentation | Low | Task 86 |
| 88 | Final Verification & Testing | Low | Task 87 |

---

## Execution Order

```
Task 77: Currency Formatter
    │
    ├──────────┬──────────┐
    ▼          ▼          │
Task 78    Task 79       │
(Price)    (Discount)    │
    │          │          │
    └──────────┘          │
               │          │
    ┌──────────┴──────────┼──────────┬──────────┐
    ▼                     ▼          ▼          │
Task 80              Task 81    Task 82        │
(Image URL)          (Product)  (Category)     │
    │                     │          │          │
    └─────────────────────┴──────────┘          │
               │                                │
         ┌─────┴─────┐                          │
         ▼           ▼                          │
      Task 83    Task 84                        │
     (Cart Total)(Stock)                        │
         │           │                          │
         └─────┬─────┘                          │
               ▼                                │
         Task 85: Types                         │
               │                                │
               ▼                                │
         Task 86: Exports                       │
               │                                │
               ▼                                │
         Task 87: Documentation                 │
               │                                │
               ▼
         Task 88: Testing
```

---

## Expected Deliverables

```
frontend/
├── lib/
│   └── store/
│       ├── utils/
│       │   ├── currency.ts         # Currency formatter
│       │   ├── price.ts            # Price display
│       │   ├── discount.ts         # Discount calculator
│       │   ├── images.ts           # Image URL helper
│       │   ├── urls.ts             # Product/category URLs
│       │   ├── cart.ts             # Cart calculations
│       │   ├── stock.ts            # Stock checker
│       │   └── index.ts
│       └── index.ts
├── types/
│   └── store/
│       ├── product.ts
│       ├── category.ts
│       ├── cart.ts
│       ├── customer.ts
│       ├── order.ts
│       ├── checkout.ts
│       └── index.ts
└── docs/
    └── STORE_PROJECT.md
```

---

## Notes for AI Agents

### Currency Formatter (Task 77)
| Function | Input | Output |
|----------|-------|--------|
| formatCurrency | 1500.50 | ₨ 1,500.50 |
| formatCurrency | 999 | ₨ 999.00 |
| formatCurrency | 150000 | ₨ 150,000.00 |

### Price Display (Task 78)
| Scenario | Display |
|----------|---------|
| Regular | ₨ 1,500.00 |
| Sale | ~~₨ 2,000~~ ₨ 1,500 |
| Range | ₨ 1,000 - ₨ 2,000 |
| Free | Free |

### Discount Calculator (Task 79)
| Function | Input | Output |
|----------|-------|--------|
| calculateDiscount | 2000, 1500 | 25 (%) |
| calculateSaveAmount | 2000, 1500 | 500 |
| applyDiscount | 2000, 25 | 1500 |

### Image URL Helper (Task 80)
| Size | Function | Output |
|------|----------|--------|
| thumb | getImageUrl(img, 'thumb') | /images/thumb/img.jpg |
| medium | getImageUrl(img, 'medium') | /images/medium/img.jpg |
| large | getImageUrl(img, 'large') | /images/large/img.jpg |

### Product URL Helper (Task 81)
| Function | Input | Output |
|----------|-------|--------|
| getProductUrl | product | /products/product-slug |
| getProductsUrl | filters | /products?category=x |

### Category URL Helper (Task 82)
| Function | Input | Output |
|----------|-------|--------|
| getCategoryUrl | category | /categories/cat-slug |
| getBreadcrumbs | category | [{name, url}...] |

### Cart Calculations (Task 83)
| Function | Description |
|----------|-------------|
| calculateSubtotal | Sum of item totals |
| calculateTax | Tax amount |
| calculateShipping | Shipping cost |
| calculateTotal | Final total |
| calculateItemTotal | price * quantity |

### Stock Checker (Task 84)
| Function | Output |
|----------|--------|
| isInStock | boolean |
| getStockLevel | number |
| getStockStatus | 'in_stock' | 'low' | 'out' |
| getStockMessage | "In Stock", "Only 3 left", etc |

### Store Types (Task 85)
| Type | Properties |
|------|------------|
| Product | id, name, slug, price, images... |
| Category | id, name, slug, parent, products |
| CartItem | id, product, quantity, total |
| Customer | id, name, email, addresses... |
| Order | id, items, total, status... |

### Documentation (Task 87)
| Section | Content |
|---------|---------|
| Architecture | Route groups, separation |
| Config | All config files |
| API | API client usage |
| State | Zustand stores |
| Utilities | Utility functions |
| Types | TypeScript types |

### Final Testing (Task 88)
| Test Case | Scenario |
|-----------|----------|
| Routes | All routes accessible |
| Layout | Layout renders correctly |
| Config | All config values valid |
| API | API client works |
| Stores | State management works |
| Utilities | Formatters work correctly |
