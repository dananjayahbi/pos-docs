# Group C: Flash Sales System

> **Phase:** 08 - Webstore & E-Commerce Platform  
> **SubPhase:** 14 - Marketing Features  
> **Group:** C of F  
> **Tasks Covered:** 35-52  
> **Group Goal:** Implement flash sales with countdown timers, special pricing, and dedicated sale pages

---

## Navigation

- **↑ Parent:** [00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [Group-B_Coupon-UI-Components](../Group-B_Coupon-UI-Components/)
- **→ Next Group:** [Group-D_WhatsApp-Integration](../Group-D_WhatsApp-Integration/)

---

## Group Overview

This group implements the flash sales system. Creates flash sale types and API client. Creates useActiveFlashSales hook and Zustand flash sale store. Creates useCountdown hook with precise timing. Creates CountdownTimer component with flip/slide animation and expired state. Creates FlashSaleBanner and FlashSaleSection for homepage. Creates FlashSaleProductCard with original/sale price, discount badge, and limited stock counter. Creates dedicated flash sales page with category filtering. Creates sale end notification. Verifies flash sales work correctly.

### Key Outcomes

- Flash sale types
- Flash sale API client
- Active sales query hook
- Flash sale Zustand store
- useCountdown hook
- CountdownTimer component
- CountdownTimer digits animation
- CountdownTimer expired state
- Flash sale banner
- Flash sale section
- Flash sale product card
- Sale price display
- Discount percentage badge
- Stock counter
- Flash sale page
- Sale category filter
- Sale end notification
- Flash sales verified

### Technology Context

- **Timer:** requestAnimationFrame
- **State:** Zustand for active sales
- **Animation:** CSS transitions
- **Sri Lanka:** Avurudu, Vesak sales

---

## Documents in This Group

| # | Document | Description | Tasks Covered |
|---|----------|-------------|---------------|
| 01 | `01_Tasks-35-44_Types-Timer-Section.md` | Create types, timer, and section | 35-44 |
| 02 | `02_Tasks-45-52_Cards-Page-Verify.md` | Create cards, page, and verification | 45-52 |

---

## Task Summary

| Task # | Task Name | Complexity | Dependencies |
|--------|-----------|------------|--------------|
| 35 | Create Flash Sale Types | Medium | Task 34 |
| 36 | Create Flash Sale API | Medium | Task 35 |
| 37 | Create Active Sales Query | Medium | Task 36 |
| 38 | Create Flash Sale Store | Medium | Task 35 |
| 39 | Create Countdown Timer Hook | High | Task 35 |
| 40 | Create CountdownTimer Component | Medium | Task 39 |
| 41 | Create CountdownTimer Digits | Medium | Task 40 |
| 42 | Create CountdownTimer Expired | Low | Task 40 |
| 43 | Create Flash Sale Banner | Medium | Task 40 |
| 44 | Create Flash Sale Section | Medium | Task 43 |
| 45 | Create Flash Sale ProductCard | Medium | Task 44 |
| 46 | Create Sale Price Display | Low | Task 45 |
| 47 | Create Discount Badge | Low | Task 45 |
| 48 | Create Stock Counter | Medium | Task 45 |
| 49 | Create Flash Sale Page | Medium | Task 44 |
| 50 | Create Sale Category Filter | Medium | Task 49 |
| 51 | Create Sale End Notification | Medium | Task 39 |
| 52 | Verify Flash Sales | Low | Task 51 |

---

## Execution Order

```
Task 35: Flash Sale Types
    │
    ├────────┬────────┐
    ▼        ▼        ▼
T-36     T-38     T-39
(API)   (Store)  (Timer Hook)
    │        │        │
    ▼        │        ▼
T-37        │     T-40
(Query)     │   (Timer Component)
    │        │        │
    │        │   ┌────┼────┐
    │        │   ▼    ▼    ▼
    │        │  T-41  T-42  T-51
    │        │ (Digits)(Exp)(Notify)
    │        │   │    │    │
    │        │   └────┴────┘
    │        │        │
    └────────┴────────┘
              │
              ▼
        T-43 (Banner)
              │
              ▼
        T-44 (Section)
              │
         ┌────┴────┐
         ▼         ▼
      T-45      T-49
     (Card)    (Page)
         │         │
    ┌────┼────┐    ▼
    ▼    ▼    ▼   T-50
 T-46  T-47  T-48 (Filter)
(Price)(Badge)(Stock)
    │    │    │    │
    └────┴────┴────┘
              │
              ▼
        Task 52: Verify
```

---

## Expected Deliverables

```
frontend/
├── app/
│   └── (storefront)/
│       └── flash-sales/
│           └── page.tsx
├── components/
│   └── marketing/
│       └── flash-sales/
│           ├── CountdownTimer.tsx
│           ├── FlashSaleBanner.tsx
│           ├── FlashSaleSection.tsx
│           ├── FlashSaleProductCard.tsx
│           ├── SalePriceDisplay.tsx
│           ├── DiscountBadge.tsx
│           ├── StockCounter.tsx
│           └── index.ts
├── lib/
│   └── marketing/
│       └── flash-sale.ts
├── store/
│   └── flash-sale-store.ts
└── hooks/
    └── marketing/
        ├── useFlashSale.ts
        └── useCountdown.ts
```

---

## Notes for AI Agents

### Flash Sale Types (Task 35)
| Type | Fields |
|------|--------|
| FlashSale | id, name, startTime, endTime |
| Products | Array of sale products |
| Discount | percentage or fixed |

### Flash Sale API (Task 36)
| Endpoint | Method |
|----------|--------|
| /api/flash-sales/active | GET |
| /api/flash-sales/:id | GET |

### Active Sales Query (Task 37)
| Hook | Return |
|------|--------|
| useActiveFlashSales | Array of active sales |
| Refetch | On timer end |

### Flash Sale Store (Task 38)
| State | Type |
|-------|------|
| activeSales | FlashSale[] |
| currentSale | FlashSale or null |
| timeRemaining | number (ms) |

### Countdown Timer Hook (Task 39)
| Return | Type |
|--------|------|
| days | number |
| hours | number |
| minutes | number |
| seconds | number |
| isExpired | boolean |

### CountdownTimer Component (Task 40)
| Props | Type |
|-------|------|
| endTime | Date or timestamp |
| onExpire | () => void |
| size | sm, md, lg |

### CountdownTimer Digits (Task 41)
| Animation | Type |
|-----------|------|
| Flip | 3D card flip |
| Slide | Vertical slide |
| Fade | Simple fade |

### CountdownTimer Expired (Task 42)
| Display | Content |
|---------|---------|
| Message | "Sale Ended" |
| Action | Hide or redirect |

### Flash Sale Banner (Task 43)
| Content | Display |
|---------|---------|
| Title | Sale name |
| Timer | Countdown |
| CTA | "Shop Now" |

### Flash Sale Section (Task 44)
| Content | Display |
|---------|---------|
| Header | Title + Timer |
| Products | Grid of sale items |
| Link | "View All" |

### Flash Sale ProductCard (Task 45)
| Content | Display |
|---------|---------|
| Image | Product image |
| Title | Product name |
| Price | Original + Sale |
| Badge | % off |
| Stock | Limited stock |

### Sale Price Display (Task 46)
| Format | Display |
|--------|---------|
| Original | ₨2,500 (strikethrough) |
| Sale | ₨1,999 (red/bold) |
| Savings | You save ₨501 |

### Discount Badge (Task 47)
| Position | Style |
|----------|-------|
| Top-right | Absolute |
| Color | Red/orange |
| Text | -20% or "20% OFF" |

### Stock Counter (Task 48)
| Display | Style |
|---------|-------|
| Text | "Only 5 left!" |
| Progress | Stock bar |
| Urgency | Red if < 5 |

### Flash Sale Page (Task 49)
| Content | Display |
|---------|---------|
| Hero | Sale banner |
| Timer | Large countdown |
| Products | Full grid |
| Filters | Category filter |

### Sale Category Filter (Task 50)
| Options | Display |
|---------|---------|
| All | All sale items |
| Categories | Active sale categories |
| Sort | By discount, price |

### Sale End Notification (Task 51)
| Trigger | Action |
|---------|--------|
| 1 hour before | Show toast |
| 10 min before | More urgent |
| On end | "Sale ended" |
