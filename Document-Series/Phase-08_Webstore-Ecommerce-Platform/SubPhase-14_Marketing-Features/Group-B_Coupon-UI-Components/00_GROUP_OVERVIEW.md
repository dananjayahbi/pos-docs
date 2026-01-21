# Group B: Coupon UI Components

> **Phase:** 08 - Webstore & E-Commerce Platform  
> **SubPhase:** 14 - Marketing Features  
> **Group:** B of F  
> **Tasks Covered:** 19-34  
> **Group Goal:** Build coupon input, applied badge, and available coupons display components

---

## Navigation

- **↑ Parent:** [00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [Group-A_Coupon-System-Backend](../Group-A_Coupon-System-Backend/)
- **→ Next Group:** [Group-C_Flash-Sales-System](../Group-C_Flash-Sales-System/)

---

## Group Overview

This group builds coupon UI components. Creates CouponInput component with real-time validation, loading state, error display, and success state. Creates AppliedCouponBadge to show applied coupon with remove button and discount display. Creates cart and checkout coupon sections. Creates order summary discount row. Creates available coupons list with CouponCard component, copy code button, and expiry display. Verifies all coupon UI components work correctly.

### Key Outcomes

- CouponInput component
- CouponInput validation UI
- CouponInput loading state
- CouponInput error display
- CouponInput success state
- Applied coupon badge
- Coupon remove button
- Discount display
- Cart coupon section
- Checkout coupon section
- Order summary discount
- Available coupons list
- CouponCard component
- Copy coupon code
- Coupon expiry display
- Coupon UI verified

### Technology Context

- **Form:** React Hook Form or uncontrolled
- **Validation:** Real-time debounce
- **Animation:** Success/error transitions
- **Copy:** Clipboard API

---

## Documents in This Group

| # | Document | Description | Tasks Covered |
|---|----------|-------------|---------------|
| 01 | `01_Tasks-19-27_Input-Badge-Sections.md` | Create input, badge, and sections | 19-27 |
| 02 | `02_Tasks-28-34_Summary-List-Verify.md` | Create summary, list, and verification | 28-34 |

---

## Task Summary

| Task # | Task Name | Complexity | Dependencies |
|--------|-----------|------------|--------------|
| 19 | Create CouponInput Component | Medium | Task 18 |
| 20 | Create CouponInput Validation | Medium | Task 19 |
| 21 | Create CouponInput Loading | Low | Task 19 |
| 22 | Create CouponInput Error | Low | Task 19 |
| 23 | Create CouponInput Success | Low | Task 19 |
| 24 | Create Applied Coupon Badge | Medium | Task 19 |
| 25 | Create Coupon Remove Button | Low | Task 24 |
| 26 | Create Discount Display | Low | Task 24 |
| 27 | Create Cart Coupon Section | Medium | Task 19 |
| 28 | Create Checkout Coupon Section | Medium | Task 27 |
| 29 | Create Order Summary Discount | Low | Task 26 |
| 30 | Create Available Coupons List | Medium | Task 19 |
| 31 | Create Coupon Card | Medium | Task 30 |
| 32 | Create Copy Coupon Code | Low | Task 31 |
| 33 | Create Coupon Expiry Display | Low | Task 31 |
| 34 | Verify Coupon UI | Low | Task 33 |

---

## Execution Order

```
Task 19: CouponInput Component
    │
    ├────────┬────────┬────────┬────────┐
    ▼        ▼        ▼        ▼        ▼
T-20     T-21     T-22     T-23     T-24  T-27  T-30
(Valid) (Load)  (Error)(Success)(Badge)(Cart)(List)
    │        │        │        │        │    │    │
    └────────┴────────┴────────┘        │    │    │
                   │                    │    │    │
                   └────────────────────┘    │    │
                              │              │    │
                         ┌────┴────┐         │    │
                         ▼         ▼         │    │
                      T-25      T-26        │    │
                    (Remove)  (Display)     │    │
                         │         │         │    │
                         └────┬────┘         │    │
                              │              │    │
                              └──────────────┘    │
                                     │            │
                                     ▼            │
                                  T-28           ▼
                               (Checkout)     T-31
                                     │      (Card)
                                     ▼            │
                                  T-29       ┌────┴────┐
                               (Summary)     ▼         ▼
                                     │      T-32     T-33
                                     │    (Copy)   (Expiry)
                                     │         │         │
                                     └─────────┴─────────┘
                                              │
                                              ▼
                                        Task 34: Verify
```

---

## Expected Deliverables

```
frontend/
└── components/
    └── marketing/
        └── coupons/
            ├── CouponInput.tsx
            ├── AppliedCouponBadge.tsx
            ├── DiscountDisplay.tsx
            ├── CartCouponSection.tsx
            ├── CheckoutCouponSection.tsx
            ├── OrderSummaryDiscount.tsx
            ├── AvailableCoupons.tsx
            ├── CouponCard.tsx
            └── index.ts
```

---

## Notes for AI Agents

### CouponInput Component (Task 19)
| Props | Type |
|-------|------|
| onApply | (code: string) => void |
| isLoading | boolean |
| placeholder | string |

### CouponInput Validation (Task 20)
| Behavior | Value |
|----------|-------|
| Debounce | 500ms |
| Real-time | Validate on type |
| Display | Valid/invalid icon |

### CouponInput Loading (Task 21)
| State | Display |
|-------|---------|
| isLoading | Spinner in button |
| Disabled | Input and button |

### CouponInput Error (Task 22)
| Display | Style |
|---------|-------|
| Message | Below input |
| Color | Red text |
| Icon | Error icon |

### CouponInput Success (Task 23)
| Display | Style |
|---------|-------|
| Message | "Coupon applied!" |
| Color | Green text |
| Transition | Fade to badge |

### Applied Coupon Badge (Task 24)
| Content | Display |
|---------|---------|
| Code | AVURUDU20 |
| Discount | -₨500 |
| Remove | X button |

### Discount Display (Task 26)
| Format | Example |
|--------|---------|
| Percentage | 20% off |
| Fixed | ₨500 off |
| Free ship | Free shipping |

### Cart Coupon Section (Task 27)
| Location | Position |
|----------|----------|
| Cart page | Before totals |
| Collapsible | Optional accordion |

### Checkout Coupon Section (Task 28)
| Location | Position |
|----------|----------|
| Checkout | In order summary |
| Compact | Smaller than cart |

### Order Summary Discount (Task 29)
| Row | Display |
|-----|---------|
| Label | Discount (AVURUDU20) |
| Value | -₨500 |
| Color | Green negative |

### Available Coupons List (Task 30)
| Source | Display |
|--------|---------|
| API | Fetch available |
| Filter | User-specific |
| Sort | By expiry date |

### CouponCard (Task 31)
| Content | Display |
|---------|---------|
| Code | Large text |
| Description | Discount details |
| Expiry | Date display |
| CTA | Apply/Copy button |

### Copy Coupon Code (Task 32)
| Action | Feedback |
|--------|----------|
| Click | Copy to clipboard |
| Toast | "Code copied!" |
| Icon | Clipboard icon |

### Coupon Expiry Display (Task 33)
| Format | Example |
|--------|---------|
| Days | "Expires in 5 days" |
| Date | "Valid until Dec 31" |
| Urgent | Red if < 3 days |
