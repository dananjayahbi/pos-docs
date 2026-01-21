# Group F: Order Sidebar & Testing

> **Phase:** 08 - Webstore & E-Commerce Platform  
> **SubPhase:** 07 - Checkout Flow  
> **Group:** F of F  
> **Tasks Covered:** 85-98  
> **Group Goal:** Create order summary sidebar and perform comprehensive checkout testing

---

## Navigation

- **↑ Parent:** [00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [Group-E_Step4-5-Review-Confirm](../Group-E_Step4-5-Review-Confirm/)
- **→ Next Group:** None (Last Group) | **Next SubPhase:** [SubPhase-08_Customer-Authentication](../../SubPhase-08_Customer-Authentication/)

---

## Group Overview

This group creates the order sidebar and testing. Creates order sidebar with items list and item rows. Creates sidebar subtotal, shipping cost, discount, and grand total in LKR. Creates collapsible sidebar for mobile. Creates order API service for submitting orders. Performs comprehensive testing: guest checkout flow, logged-in checkout flow, address cascade (Province→District→City), payment method selection, and mobile checkout responsiveness.

### Key Outcomes

- Order sidebar component
- Sidebar items list
- Sidebar item row
- Sidebar subtotal
- Sidebar shipping cost
- Sidebar discount
- Sidebar grand total
- Collapsible sidebar (mobile)
- Order API service
- Guest checkout tested
- Logged-in checkout tested
- Address cascade tested
- Payment selection tested
- Mobile checkout tested

### Technology Context

- **Sidebar:** Sticky on desktop
- **Mobile:** Collapsible accordion
- **API:** Order submission
- **Testing:** Manual + E2E

---

## Documents in This Group

| # | Document | Description | Tasks Covered |
|---|----------|-------------|---------------|
| 01 | `01_Tasks-85-93_Sidebar-API.md` | Create sidebar and order API | 85-93 |
| 02 | `02_Tasks-94-98_Comprehensive-Testing.md` | Perform comprehensive testing | 94-98 |

---

## Task Summary

| Task # | Task Name | Complexity | Dependencies |
|--------|-----------|------------|--------------|
| 85 | Create Order Sidebar | Medium | Task 84 |
| 86 | Create Sidebar Items List | Low | Task 85 |
| 87 | Create Sidebar Item Row | Low | Task 86 |
| 88 | Create Sidebar Subtotal | Low | Task 85 |
| 89 | Create Sidebar Shipping | Low | Task 85 |
| 90 | Create Sidebar Discount | Low | Task 85 |
| 91 | Create Sidebar Total | Low | Task 85 |
| 92 | Create Collapsible Sidebar | Medium | Task 85 |
| 93 | Create Order API Service | Medium | Task 77 |
| 94 | Test Guest Checkout | Low | Task 84 |
| 95 | Test Logged In Checkout | Low | Task 84 |
| 96 | Test Address Cascade | Low | Task 52 |
| 97 | Test Payment Selection | Low | Task 68 |
| 98 | Test Mobile Checkout | Low | Task 92 |

---

## Execution Order

```
Task 85: Order Sidebar
    │
    ├──────────────────────────────────────────────────┐
    │                                                  │
    ├────────┬────────┬────────┬────────┬────────┐     │
    ▼        ▼        ▼        ▼        ▼        │     │
T-86     T-88     T-89     T-90     T-91     T-92    │
(Items) (Sub)   (Ship)  (Disc)  (Total)(Collapse)   │
    │        │        │        │        │        │     │
    ▼        │        │        │        │        │     │
T-87        │        │        │        │        │     │
(Row)       │        │        │        │        │     │
    │        │        │        │        │        │     │
    └────────┴────────┴────────┴────────┴────────┘     │
                          │                            │
                          ▼                            │
                    Task 93: Order API                 │
                          │                            │
                          │                            │
    ┌─────────────────────┴──────────────────────┐     │
    │                                            │     │
    ├────────┬────────┬────────┬────────┐        │     │
    ▼        ▼        ▼        ▼        │        │     │
T-94     T-95     T-96     T-97     T-98        │     │
(Guest) (Login) (Addr)  (Pay)   (Mobile)        │     │
    │        │        │        │        │        │     │
    └────────┴────────┴────────┴────────┘        │     │
                          │                      │     │
                          └──────────────────────┘     │
```

---

## Expected Deliverables

```
frontend/
├── components/
│   └── storefront/
│       └── checkout/
│           └── OrderSidebar/
│               ├── OrderSidebar.tsx
│               ├── SidebarItemsList.tsx
│               ├── SidebarItemRow.tsx
│               ├── SidebarSubtotal.tsx
│               ├── SidebarShipping.tsx
│               ├── SidebarDiscount.tsx
│               ├── SidebarTotal.tsx
│               ├── CollapsibleSidebar.tsx
│               └── index.ts
├── services/
│   └── storefront/
│       └── checkout/
│           └── orderService.ts
└── tests/
    └── e2e/
        └── checkout.spec.ts
```

---

## Notes for AI Agents

### Order Sidebar (Task 85)
| Feature | Description |
|---------|-------------|
| Position | Right column |
| Width | 30-35% |
| Sticky | Yes, on scroll |
| Background | Light gray |

### Sidebar Items List (Task 86)
| Feature | Value |
|---------|-------|
| Max Show | 3-4 items |
| Scroll | If more items |
| Compact | Smaller than cart |

### Sidebar Item Row (Task 87)
| Element | Content |
|---------|---------|
| Image | 50x50 thumbnail |
| Name | Product name |
| Variant | Size/color |
| Qty | ×2 (badge) |
| Price | ₨3,000 |

### Sidebar Subtotal (Task 88)
| Feature | Value |
|---------|-------|
| Label | "Subtotal" |
| Value | ₨5,000 |
| Items | "3 items" |

### Sidebar Shipping (Task 89)
| State | Display |
|-------|---------|
| Not selected | "Calculated next step" |
| Selected | ₨350 |
| Free | "Free" (green) |

### Sidebar Discount (Task 90)
| Feature | Value |
|---------|-------|
| Label | "Discount" |
| Value | -₨500 |
| Color | Green text |
| Visible | Only if applied |

### Sidebar Total (Task 91)
| Feature | Value |
|---------|-------|
| Label | "Total" |
| Value | ₨4,850 |
| Style | Bold, larger |
| Border | Top border |

### Collapsible Sidebar (Task 92)
| Feature | Description |
|---------|-------------|
| Trigger | < 1024px |
| Header | "Order Summary (3)" |
| Expand | Chevron, click |
| Default | Collapsed |

### Order API Service (Task 93)
| Endpoint | Method | Purpose |
|----------|--------|---------|
| /api/orders | POST | Create order |
| Payload | - | Contact, shipping, payment, items |
| Response | - | Order ID, status |

### Test Guest Checkout (Task 94)
| Step | Verify |
|------|--------|
| 1 | Enter info without login |
| 2 | Complete shipping |
| 3 | Select payment |
| 4 | Place order |
| 5 | Receive confirmation |

### Test Logged In Checkout (Task 95)
| Step | Verify |
|------|--------|
| 1 | Data pre-filled |
| 2 | Saved addresses shown |
| 3 | Complete checkout |
| 4 | Order in account |

### Test Address Cascade (Task 96)
| Test | Expectation |
|------|-------------|
| Select province | Districts filtered |
| Select district | Cities filtered |
| Change province | Reset district/city |
| All required | Validation works |

### Test Payment Selection (Task 97)
| Test | Expectation |
|------|-------------|
| Select PayHere | Method saved |
| Select COD | Conditions shown |
| Select Bank | Details shown |
| Change method | State updates |

### Test Mobile Checkout (Task 98)
| Test | Expectation |
|------|-------------|
| Layout | Single column |
| Sidebar | Collapsible |
| Steps | Full width |
| Buttons | Touch-friendly |
| Forms | Mobile keyboard |
