# Group C: Order Details & Tracking

> **Phase:** 08 - Webstore & E-Commerce Platform  
> **SubPhase:** 09 - Customer Portal  
> **Group:** C of F  
> **Tasks Covered:** 37-52  
> **Group Goal:** Create order detail page with visual tracking progress and action buttons

---

## Navigation

- **↑ Parent:** [00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [Group-B_Dashboard-Orders](../Group-B_Dashboard-Orders/)
- **→ Next Group:** [Group-D_Addresses](../Group-D_Addresses/)

---

## Group Overview

This group creates the order detail page with tracking. Creates order detail page with header showing order number and date. Creates status section with visual order tracking progress. Creates tracking steps with completed and pending states. Creates order items section with item rows. Creates shipping address card and payment info card. Creates order summary showing subtotal, shipping, and total. Creates action buttons: reorder, download invoice, and WhatsApp support. Verifies complete order detail page.

### Key Outcomes

- Order detail page
- Order header
- Order status section
- Order tracking progress
- Tracking step component
- Step completed state
- Step pending state
- Order items section
- Order item row
- Shipping address card
- Payment info card
- Order summary card
- Reorder button
- Download invoice button
- Contact support (WhatsApp)
- Order details verified

### Technology Context

- **Tracking:** 5-step visual progress
- **Data:** TanStack Query fetch
- **Invoice:** PDF generation
- **Support:** WhatsApp link

---

## Documents in This Group

| # | Document | Description | Tasks Covered |
|---|----------|-------------|---------------|
| 01 | `01_Tasks-37-45_Detail-Tracking.md` | Create detail page with tracking | 37-45 |
| 02 | `02_Tasks-46-52_Cards-Actions-Verify.md` | Create info cards and actions | 46-52 |

---

## Task Summary

| Task # | Task Name | Complexity | Dependencies |
|--------|-----------|------------|--------------|
| 37 | Create Order Detail Page | Medium | Task 36 |
| 38 | Create Order Header | Low | Task 37 |
| 39 | Create Order Status Section | Low | Task 37 |
| 40 | Create Order Tracking | Medium | Task 39 |
| 41 | Create Tracking Step | Low | Task 40 |
| 42 | Create Step Completed State | Low | Task 41 |
| 43 | Create Step Pending State | Low | Task 41 |
| 44 | Create Order Items Section | Low | Task 37 |
| 45 | Create Order Item Row | Low | Task 44 |
| 46 | Create Shipping Address Card | Low | Task 37 |
| 47 | Create Payment Info Card | Low | Task 37 |
| 48 | Create Order Summary Card | Low | Task 37 |
| 49 | Create Reorder Button | Medium | Task 37 |
| 50 | Create Download Invoice | Medium | Task 37 |
| 51 | Create Contact Support | Low | Task 37 |
| 52 | Verify Order Details | Low | Task 51 |

---

## Execution Order

```
Task 37: Order Detail Page
    │
    ├──────────────────────────────────────────────────┐
    │                                                  │
    ├────────┬────────┬────────┬────────┬────────┬────────┬────────┬────────┐
    ▼        ▼        ▼        ▼        ▼        ▼        ▼        ▼        │
T-38     T-39     T-44     T-46     T-47     T-48     T-49     T-50     T-51
(Header)(Status)(Items) (Ship)  (Pay)   (Summary)(Reorder)(Invoice)(Support)
    │        │        │        │        │        │        │        │        │
    │        ▼        ▼        │        │        │        │        │        │
    │     T-40     T-45        │        │        │        │        │        │
    │   (Tracking)(Row)        │        │        │        │        │        │
    │        │        │        │        │        │        │        │        │
    │        ▼        │        │        │        │        │        │        │
    │     T-41        │        │        │        │        │        │        │
    │    (Step)       │        │        │        │        │        │        │
    │        │        │        │        │        │        │        │        │
    │   ┌────┴────┐   │        │        │        │        │        │        │
    │   ▼         ▼   │        │        │        │        │        │        │
    │ T-42      T-43 │        │        │        │        │        │        │
    │(Complete)(Pending)       │        │        │        │        │        │
    │   │         │   │        │        │        │        │        │        │
    └───┴─────────┴───┴────────┴────────┴────────┴────────┴────────┴────────┘
                                         │
                                         ▼
                                   Task 52: Verify
```

---

## Expected Deliverables

```
frontend/
├── components/
│   └── storefront/
│       └── portal/
│           └── OrderDetail/
│               ├── OrderDetailPage.tsx
│               ├── OrderHeader.tsx
│               ├── OrderStatusSection.tsx
│               ├── OrderTracking.tsx
│               ├── TrackingStep.tsx
│               ├── OrderItemsSection.tsx
│               ├── OrderItemRow.tsx
│               ├── ShippingAddressCard.tsx
│               ├── PaymentInfoCard.tsx
│               ├── OrderSummaryCard.tsx
│               ├── ReorderButton.tsx
│               ├── DownloadInvoice.tsx
│               ├── ContactSupport.tsx
│               └── index.ts
└── services/
    └── storefront/
        └── portal/
            └── invoiceService.ts
```

---

## Notes for AI Agents

### Order Header (Task 38)
| Element | Content |
|---------|---------|
| Order # | LCC-2024-12345 |
| Date | Placed on Jan 15, 2026 |
| Back | "← Back to Orders" |

### Order Status Section (Task 39)
| Element | Content |
|---------|---------|
| Current | "Shipped" |
| Description | "Your order is on the way" |
| Date | Status updated date |

### Order Tracking (Task 40)
| Step | Label |
|------|-------|
| 1 | Order Placed |
| 2 | Confirmed |
| 3 | Shipped |
| 4 | Out for Delivery |
| 5 | Delivered |

### Tracking Step (Task 41)
| Element | Description |
|---------|-------------|
| Circle | Status indicator |
| Line | Connect to next step |
| Label | Step name |
| Date | When completed |

### Step Completed State (Task 42)
| Feature | Style |
|---------|-------|
| Circle | Filled with checkmark |
| Line | Solid color |
| Color | Primary/green |

### Step Pending State (Task 43)
| Feature | Style |
|---------|-------|
| Circle | Empty/outlined |
| Line | Dashed/gray |
| Color | Gray |

### Order Item Row (Task 45)
| Element | Content |
|---------|---------|
| Image | Product thumbnail |
| Name | Product name |
| Variant | Size, Color |
| Qty | ×2 |
| Price | ₨3,000 |

### Shipping Address Card (Task 46)
| Field | Display |
|-------|---------|
| Name | John Doe |
| Address | Full address |
| City | Colombo |
| Phone | +94 77 123 4567 |

### Payment Info Card (Task 47)
| Field | Display |
|-------|---------|
| Method | PayHere / COD |
| Status | Paid / Pending |
| Last 4 | **** 1234 (if card) |

### Order Summary Card (Task 48)
| Row | Value |
|-----|-------|
| Subtotal | ₨5,000 |
| Shipping | ₨350 |
| Discount | -₨500 |
| Total | ₨4,850 |

### Reorder Button (Task 49)
| Feature | Description |
|---------|-------------|
| Action | Add all items to cart |
| Check | Stock availability |
| Alert | Out of stock items |

### Download Invoice (Task 50)
| Feature | Description |
|---------|-------------|
| Format | PDF |
| Content | Order details, totals |
| Name | invoice-LCC-12345.pdf |

### Contact Support (Task 51)
| Feature | Description |
|---------|-------------|
| Channel | WhatsApp |
| Link | wa.me with message |
| Message | "Hi, order #12345" |
