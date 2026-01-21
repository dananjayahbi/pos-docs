# Group A: Coupon System Backend Integration

> **Phase:** 08 - Webstore & E-Commerce Platform  
> **SubPhase:** 14 - Marketing Features  
> **Group:** A of F  
> **Tasks Covered:** 01-18  
> **Group Goal:** Implement coupon system with types, API integration, and validation logic

---

## Navigation

- **↑ Parent:** [00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous Group:** None (First Group)
- **→ Next Group:** [Group-B_Coupon-UI-Components](../Group-B_Coupon-UI-Components/)

---

## Group Overview

This group implements the coupon system backend integration. Creates coupon type interfaces with different discount types. Creates coupon API client with validate, apply, and remove endpoints. Creates TanStack Query hooks for coupon validation and apply mutation. Creates Zustand coupon store for cart-coupon state. Creates discount logic for percentage, fixed amount, and free shipping. Creates validation for minimum order, expiry date, usage limits, product-specific, category-specific, and first-order coupons. Verifies coupon API integration works correctly.

### Key Outcomes

- Coupon types interface
- Coupon API client
- Validate coupon API
- Apply coupon API
- Remove coupon API
- useCouponValidation hook
- useApplyCoupon mutation
- Coupon Zustand store
- Percentage discount logic
- Fixed discount logic
- Free shipping logic
- Minimum order validation
- Coupon expiry check
- Usage limit check
- Product-specific coupon
- Category coupon
- First order coupon
- Coupon API verified

### Technology Context

- **Types:** TypeScript interfaces
- **API:** TanStack Query mutations
- **State:** Zustand coupon store
- **Currency:** LKR (₨)

---

## Documents in This Group

| # | Document | Description | Tasks Covered |
|---|----------|-------------|---------------|
| 01 | `01_Tasks-01-10_Types-API-Store.md` | Create types, API, and store | 01-10 |
| 02 | `02_Tasks-11-18_Validation-Verify.md` | Create validation and verification | 11-18 |

---

## Task Summary

| Task # | Task Name | Complexity | Dependencies |
|--------|-----------|------------|--------------|
| 01 | Create Coupon Types Interface | Medium | SubPhase-13 |
| 02 | Create Coupon API Client | Medium | Task 01 |
| 03 | Create Validate Coupon API | Medium | Task 02 |
| 04 | Create Apply Coupon API | Medium | Task 03 |
| 05 | Create Remove Coupon API | Low | Task 04 |
| 06 | Create Coupon Query Hook | Medium | Task 03 |
| 07 | Create Apply Coupon Mutation | Medium | Task 04 |
| 08 | Create Coupon Store | Medium | Task 01 |
| 09 | Create Percentage Discount | Low | Task 08 |
| 10 | Create Fixed Discount | Low | Task 08 |
| 11 | Create Free Shipping Coupon | Low | Task 08 |
| 12 | Create Minimum Order Validation | Low | Task 08 |
| 13 | Create Coupon Expiry Check | Low | Task 08 |
| 14 | Create Usage Limit Check | Medium | Task 08 |
| 15 | Create Product-Specific Coupon | Medium | Task 08 |
| 16 | Create Category Coupon | Medium | Task 08 |
| 17 | Create First Order Coupon | Medium | Task 08 |
| 18 | Verify Coupon API Integration | Low | Task 17 |

---

## Execution Order

```
Task 01: Coupon Types Interface
    │
    ├────────┐
    ▼        ▼
T-02     T-08
(API)   (Store)
    │        │
    ▼        ├────────┬────────┬────────┬────────┬────────┐
T-03        ▼        ▼        ▼        ▼        ▼        ▼
(Validate) T-09     T-10     T-11     T-12     T-13     T-14
    │     (%)    (Fixed)(FreeShip)(MinOrder)(Expiry)(Usage)
    │        │        │        │        │        │        │
    ├────────┴────────┴────────┴────────┴────────┴────────┘
    ▼                              │
T-04                              ▼
(Apply)                     ┌────────┬────────┐
    │                       ▼        ▼        ▼
    ├────────┐           T-15     T-16     T-17
    ▼        ▼         (Product)(Category)(FirstOrder)
T-05     T-07             │        │        │
(Remove)(Mutation)        └────────┴────────┘
    │        │                     │
    └────────┘                     │
         │                         │
         ▼                         │
    T-06 (Query Hook)              │
         │                         │
         └─────────────────────────┘
                   │
                   ▼
             Task 18: Verify
```

---

## Expected Deliverables

```
frontend/
├── types/
│   └── marketing/
│       └── coupon.types.ts
├── lib/
│   └── marketing/
│       └── coupon.ts
├── store/
│   └── coupon-store.ts
└── hooks/
    └── marketing/
        └── useCoupon.ts
```

---

## Notes for AI Agents

### Coupon Types Interface (Task 01)
| Type | Fields |
|------|--------|
| Coupon | code, type, value, minOrder |
| Discount Type | percentage, fixed, free_shipping |
| Restrictions | products, categories, firstOrder |

### Coupon API Client (Task 02)
| Endpoint | Method |
|----------|--------|
| /api/coupons/validate | POST |
| /api/coupons/apply | POST |
| /api/coupons/remove | DELETE |

### Validate Coupon API (Task 03)
| Request | Response |
|---------|----------|
| code, cartTotal | valid, discount, message |

### Coupon Store (Task 08)
| State | Type |
|-------|------|
| appliedCoupon | Coupon or null |
| discount | number (LKR) |
| isLoading | boolean |
| error | string or null |

### Percentage Discount (Task 09)
| Calculation | Formula |
|-------------|---------|
| Discount | cartTotal * (percentage / 100) |
| Max | Optional max discount |

### Fixed Discount (Task 10)
| Calculation | Formula |
|-------------|---------|
| Discount | Fixed amount in LKR |
| Limit | Cannot exceed total |

### Free Shipping Coupon (Task 11)
| Effect | Value |
|--------|-------|
| Shipping | ₨0 |
| Cart total | Unchanged |

### Minimum Order Validation (Task 12)
| Check | Message |
|-------|---------|
| cartTotal < minOrder | "Minimum order ₨X required" |

### Coupon Expiry Check (Task 13)
| Check | Message |
|-------|---------|
| Date.now() > expiryDate | "Coupon expired" |

### Usage Limit Check (Task 14)
| Check | Message |
|-------|---------|
| userUsageCount >= limit | "Usage limit reached" |
| totalUsageCount >= max | "Coupon exhausted" |

### Product-Specific Coupon (Task 15)
| Check | Condition |
|-------|-----------|
| Valid | Cart has allowed products |
| Apply | Only to matching products |

### Category Coupon (Task 16)
| Check | Condition |
|-------|-----------|
| Valid | Cart has category products |
| Apply | Only to category products |

### First Order Coupon (Task 17)
| Check | Condition |
|-------|-----------|
| Valid | User has no previous orders |
| Message | "First order only" |
