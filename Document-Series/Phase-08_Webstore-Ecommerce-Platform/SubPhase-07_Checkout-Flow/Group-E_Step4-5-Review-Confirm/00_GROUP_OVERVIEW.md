# Group E: Step 4 & 5 - Review & Confirm

> **Phase:** 08 - Webstore & E-Commerce Platform  
> **SubPhase:** 07 - Checkout Flow  
> **Group:** E of F  
> **Tasks Covered:** 69-84  
> **Group Goal:** Create order review step with summaries and confirmation page with WhatsApp notification

---

## Navigation

- **↑ Parent:** [00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [Group-D_Step3-Payment](../Group-D_Step3-Payment/)
- **→ Next Group:** [Group-F_Order-Sidebar-Testing](../Group-F_Order-Sidebar-Testing/)

---

## Group Overview

This group creates review and confirmation steps (steps 4 and 5). Creates review page with contact summary, shipping summary, and payment summary each with edit links back to respective steps. Creates order items review section. Creates place order button with order processing state. Creates confirmation page with order number display and success animation. Creates WhatsApp confirmation info and continue shopping CTA. Verifies complete step 4 and 5 flow.

### Key Outcomes

- Review page component
- Contact summary (step 1)
- Edit contact link
- Shipping summary (step 2)
- Edit shipping link
- Payment summary (step 3)
- Edit payment link
- Order items review
- Place order button
- Order processing state
- Confirmation page
- Order number display
- Success animation
- WhatsApp confirmation info
- Continue shopping CTA
- Step 4 & 5 flow verified

### Technology Context

- **Review:** All info before submit
- **Edit:** Quick jump to any step
- **Submit:** API order creation
- **WhatsApp:** Order notification

---

## Documents in This Group

| # | Document | Description | Tasks Covered |
|---|----------|-------------|---------------|
| 01 | `01_Tasks-69-77_Review-Page.md` | Create review page with summaries | 69-77 |
| 02 | `02_Tasks-78-84_Confirmation-Verify.md` | Create confirmation page and verification | 78-84 |

---

## Task Summary

| Task # | Task Name | Complexity | Dependencies |
|--------|-----------|------------|--------------|
| 69 | Create Review Page | Low | Task 68 |
| 70 | Create Contact Summary | Low | Task 69 |
| 71 | Create Edit Contact Link | Low | Task 70 |
| 72 | Create Shipping Summary | Low | Task 69 |
| 73 | Create Edit Shipping Link | Low | Task 72 |
| 74 | Create Payment Summary | Low | Task 69 |
| 75 | Create Edit Payment Link | Low | Task 74 |
| 76 | Create Order Items Review | Low | Task 69 |
| 77 | Create Place Order Button | Medium | Task 69 |
| 78 | Create Order Processing State | Low | Task 77 |
| 79 | Create Confirmation Page | Low | Task 78 |
| 80 | Create Order Number Display | Low | Task 79 |
| 81 | Create Success Animation | Low | Task 79 |
| 82 | Create WhatsApp Confirm | Low | Task 79 |
| 83 | Create Continue Shopping CTA | Low | Task 79 |
| 84 | Verify Step 4 & 5 Flow | Low | Task 83 |

---

## Execution Order

```
Task 69: Review Page
    │
    ├──────────────────────────────────────────────────┐
    │                                                  │
    ├────────┬────────┬────────┬────────┐              │
    ▼        ▼        ▼        ▼        │              │
T-70     T-72     T-74     T-76     T-77              │
(Contact)(Ship)  (Pay)   (Items) (Place)             │
    │        │        │        │        │              │
    ▼        ▼        ▼        │        │              │
T-71     T-73     T-75        │        │              │
(Edit)   (Edit)  (Edit)       │        │              │
    │        │        │        │        │              │
    └────────┴────────┴────────┴────────┘              │
                          │                            │
                          ▼                            │
                    Task 78: Processing                │
                          │                            │
                          ▼                            │
                    Task 79: Confirmation              │
                          │                            │
                     ┌────┴────┬────────┬────────┐     │
                     ▼         ▼        ▼        │     │
                  T-80      T-81     T-82     T-83    │
                 (Order)   (Anim) (WhatsApp)(Shop)   │
                     │         │        │        │     │
                     └─────────┴────────┴────────┘     │
                                   │                   │
                                   ▼
                             Task 84: Verify
```

---

## Expected Deliverables

```
frontend/
├── components/
│   └── storefront/
│       └── checkout/
│           ├── Review/
│           │   ├── ReviewStep.tsx
│           │   ├── ContactSummary.tsx
│           │   ├── ShippingSummary.tsx
│           │   ├── PaymentSummary.tsx
│           │   ├── OrderItemsReview.tsx
│           │   ├── PlaceOrderButton.tsx
│           │   └── index.ts
│           └── Confirmation/
│               ├── ConfirmationStep.tsx
│               ├── OrderNumber.tsx
│               ├── SuccessAnimation.tsx
│               ├── WhatsAppConfirm.tsx
│               ├── ContinueShoppingCTA.tsx
│               └── index.ts
```

---

## Notes for AI Agents

### Review Page (Task 69)
| Section | Order |
|---------|-------|
| 1 | Contact summary |
| 2 | Shipping summary |
| 3 | Payment summary |
| 4 | Order items |
| 5 | Place order button |

### Contact Summary (Task 70)
| Field | Display |
|-------|---------|
| Email | user@email.com |
| Phone | +94 77 123 4567 |
| Name | John Doe |
| WhatsApp | ✓ Enabled |

### Edit Links (Tasks 71, 73, 75)
| Feature | Description |
|---------|-------------|
| Text | "Edit" |
| Position | Top right of section |
| Action | Navigate to step |

### Shipping Summary (Task 72)
| Field | Display |
|-------|---------|
| Address | Full formatted address |
| Method | Standard Shipping |
| Cost | ₨350 |
| Estimate | 3-5 days |

### Payment Summary (Task 74)
| Field | Display |
|-------|---------|
| Method | PayHere / COD / Bank |
| Icon | Payment method logo |
| Details | Last 4 digits if card |

### Order Items Review (Task 76)
| Element | Display |
|---------|---------|
| Image | Small thumbnail |
| Name | Product name |
| Variant | Size: M, Color: Red |
| Qty | × 2 |
| Price | ₨3,000 |

### Place Order Button (Task 77)
| State | Text |
|-------|------|
| Default | "Place Order" |
| Processing | "Placing Order..." |
| Style | Primary, large |
| Disabled | If processing |

### Order Processing State (Task 78)
| Element | Description |
|---------|-------------|
| Overlay | Full page overlay |
| Spinner | Loading animation |
| Text | "Processing your order..." |
| Timeout | Handle errors |

### Confirmation Page (Task 79)
| Element | Order |
|---------|-------|
| 1 | Success animation |
| 2 | Order number |
| 3 | Thank you message |
| 4 | WhatsApp info |
| 5 | Continue shopping |

### Order Number Display (Task 80)
| Format | Example |
|--------|---------|
| Prefix | LCC- |
| Number | LCC-2024-12345 |
| Style | Large, bold |
| Copy | Copy button |

### Success Animation (Task 81)
| Feature | Description |
|---------|-------------|
| Type | Checkmark animation |
| Duration | 1-2 seconds |
| Color | Green/success |
| Library | Lottie or CSS |

### WhatsApp Confirm (Task 82)
| Element | Content |
|---------|---------|
| Icon | WhatsApp icon |
| Text | "Confirmation sent to WhatsApp" |
| Number | Show phone number |
| Action | Open WhatsApp link |

### Continue Shopping CTA (Task 83)
| Button | Action |
|--------|--------|
| Primary | "Continue Shopping" |
| Link | /products |
| Secondary | "View Order" → /account/orders |
