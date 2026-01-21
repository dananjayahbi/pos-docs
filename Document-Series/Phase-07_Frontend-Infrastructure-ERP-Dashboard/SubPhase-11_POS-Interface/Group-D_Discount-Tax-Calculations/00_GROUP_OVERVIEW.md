# Group D: Discount & Tax Calculations

> **Phase:** 07 - Frontend Infrastructure & ERP Dashboard  
> **SubPhase:** 11 - POS Interface  
> **Group:** D of F  
> **Tasks Covered:** 53-66  
> **Group Goal:** Build cart totals section with discount modal and tax calculations

---

## Navigation

- **↑ Parent:** [00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [Group-C_Cart-Management](../Group-C_Cart-Management/)
- **→ Next Group:** [Group-E_Payment-Processing](../Group-E_Payment-Processing/)

---

## Group Overview

This group creates the cart totals section with all calculations. Creates totals section at bottom of cart. Displays subtotal (sum of line items). Creates discount section with apply discount button. Creates discount modal with percentage/fixed toggle, value input, and optional reason select. Creates tax calculation based on applicable rates. Displays tax row. Creates prominent grand total display. Creates total calculator utility for all calculations. Adds items count display. Creates pending amount display for partial payments.

### Key Outcomes

- Cart totals section component
- Subtotal display
- Discount section
- Apply discount button
- Discount modal
- Discount type toggle (% / fixed)
- Discount value input
- Discount reason select
- Tax calculation
- Tax display row
- Grand total display (prominent)
- Total calculator utility
- Items count display
- Pending amount display

### Technology Context

- **Calculation:** Client-side totals
- **Tax:** Configurable rates
- **Currency:** LKR formatting
- **Display:** Clear visual hierarchy

---

## Documents in This Group

| # | Document | Description | Tasks Covered |
|---|----------|-------------|---------------|
| 01 | `01_Tasks-53-60_Totals-Discount.md` | Create totals section and discount modal | 53-60 |
| 02 | `02_Tasks-61-66_Tax-Calculator.md` | Create tax calculation and utilities | 61-66 |

---

## Task Summary

| Task # | Task Name | Complexity | Dependencies |
|--------|-----------|------------|--------------|
| 53 | Create Cart Totals Section | Medium | Task 35 |
| 54 | Create Subtotal Display | Low | Task 53 |
| 55 | Create Discount Section | Low | Task 53 |
| 56 | Create Apply Discount Button | Low | Task 55 |
| 57 | Create Discount Modal | Medium | Task 56 |
| 58 | Create Discount Type Toggle | Low | Task 57 |
| 59 | Create Discount Value Input | Low | Task 57 |
| 60 | Create Discount Reason Select | Low | Task 57 |
| 61 | Create Tax Calculation | Medium | Task 53 |
| 62 | Create Tax Display Row | Low | Task 61 |
| 63 | Create Grand Total Display | Low | Task 53 |
| 64 | Create Total Calculator Utility | Medium | Task 63 |
| 65 | Create Items Count Display | Low | Task 53 |
| 66 | Create Pending Amount Display | Low | Task 53 |

---

## Execution Order

```
Task 53: Cart Totals Section
    │
    ├──────────────────────────────────────────────────┐
    ▼                                                  │
Task 54: Subtotal Display                              │
    │                                                  │
    ▼                                                  │
Task 55: Discount Section                              │
    │                                                  │
    ▼                                                  │
Task 56: Apply Discount Button                         │
    │                                                  │
    ▼                                                  │
Task 57: Discount Modal                                │
    │                                                  │
    ├──────────┬──────────┬──────────┐                 │
    ▼          ▼          ▼          │                 │
Task 58    Task 59    Task 60       │                 │
(Type)     (Value)    (Reason)      │                 │
    │          │          │          │                 │
    └──────────┴──────────┘          │                 │
               │                     │                 │
               └─────────────────────┘                 │
                          │                            │
                          ▼                            │
                    Task 61: Tax Calculation           │
                          │                            │
                          ▼                            │
                    Task 62: Tax Display               │
                          │                            │
                          ▼                            │
                    Task 63: Grand Total               │
                          │                            │
                          ▼                            │
                    Task 64: Calculator Utility        │
                          │                            │
                    ┌─────┴─────┐                      │
                    ▼           ▼                      │
                 Task 65    Task 66                    │
                 (Count)    (Pending)                  │
                    │           │                      │
                    └───────────┴──────────────────────┘
```

---

## Expected Deliverables

```
frontend/
├── components/
│   └── modules/
│       └── pos/
│           └── Cart/
│               ├── CartTotals.tsx
│               ├── SubtotalDisplay.tsx
│               ├── DiscountSection.tsx
│               ├── ApplyDiscountButton.tsx
│               ├── DiscountModal.tsx
│               ├── DiscountTypeToggle.tsx
│               ├── DiscountValueInput.tsx
│               ├── DiscountReasonSelect.tsx
│               ├── TaxDisplay.tsx
│               ├── GrandTotal.tsx
│               ├── ItemsCount.tsx
│               ├── PendingAmount.tsx
│               └── index.ts
└── lib/
    └── pos/
        └── calculator.ts
```

---

## Notes for AI Agents

### Cart Totals Layout (Task 53)
| Row | Content |
|-----|---------|
| 1 | Items count |
| 2 | Subtotal |
| 3 | Discount |
| 4 | Tax |
| 5 | **Grand Total** |
| 6 | Pending (if partial) |

### Subtotal Display (Task 54)
| Element | Content |
|---------|---------|
| Label | Subtotal |
| Value | Sum of line items |
| Format | ₨ X,XXX.XX |

### Apply Discount (Task 56)
| State | Display |
|-------|---------|
| No Discount | "+ Add Discount" link |
| Has Discount | Amount + Edit link |

### Discount Modal (Task 57)
| Element | Description |
|---------|-------------|
| Title | Apply Discount |
| Type | % or Fixed toggle |
| Value | Amount input |
| Reason | Optional select |
| Apply | Save discount |

### Discount Type (Task 58)
| Type | Calculation |
|------|-------------|
| Percentage | subtotal × (value / 100) |
| Fixed | Direct amount |

### Discount Reasons (Task 60)
| Reason | Code |
|--------|------|
| Manager Discount | MANAGER |
| Loyalty | LOYALTY |
| Promotion | PROMO |
| Damaged Item | DAMAGED |
| Other | OTHER |

### Tax Calculation (Task 61)
| Setting | Value |
|---------|-------|
| Rate | Configurable (e.g., 8%) |
| Base | Subtotal - Discount |
| Round | 2 decimal places |

### Grand Total (Task 63)
| Style | Description |
|-------|-------------|
| Size | Larger font |
| Weight | Bold |
| Color | Primary color |
| Format | ₨ X,XXX.XX |

### Calculator Utility (Task 64)
| Function | Returns |
|----------|---------|
| calcSubtotal | Sum of items |
| calcDiscount | Discount amount |
| calcTax | Tax amount |
| calcTotal | Final total |
| calcPending | Total - paid |

### Items Count (Task 65)
| Display | Content |
|---------|---------|
| Format | "X items" |
| Position | Top of totals |

### Pending Amount (Task 66)
| Visibility | Condition |
|------------|-----------|
| Show | After partial payment |
| Hide | No payment or fully paid |
