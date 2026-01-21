# Group C: Order Details & Timeline

> **Phase:** 07 - Frontend Infrastructure & ERP Dashboard  
> **SubPhase:** 10 - Sales & Orders UI  
> **Group:** C of F  
> **Tasks Covered:** 33-50  
> **Group Goal:** Build order details page with status timeline, items, totals, and actions

---

## Navigation

- **↑ Parent:** [00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [Group-B_Order-Listing-Filters](../Group-B_Order-Listing-Filters/)
- **→ Next Group:** [Group-D_Invoice-Management](../Group-D_Invoice-Management/)

---

## Group Overview

This group creates the complete order details page. Creates order details page and header with order number and actions. Adds prominent status banner. Creates actions dropdown (edit, print, cancel, duplicate). Creates order info card with customer info, shipping address, and billing address sections. Creates order items table with item rows showing product, variant, quantity, and price. Creates order totals section (subtotal, discount, tax, total). Builds order status timeline with visual timeline entries. Creates notes section with add note form. Adds status update modal and cancel order dialog. Connects to order API.

### Key Outcomes

- Order details page component
- Order details header
- Order status banner
- Order actions dropdown
- Order info card
- Customer info section
- Shipping address section
- Billing address section
- Order items table
- Order item row component
- Order totals section
- Order status timeline
- Timeline item component
- Order notes section
- Add note form
- Status update modal
- Cancel order dialog
- Connected to order API

### Technology Context

- **Timeline:** Vertical status history
- **Sections:** Card-based layout
- **Modals:** Dialog components
- **Forms:** React Hook Form

---

## Documents in This Group

| # | Document | Description | Tasks Covered |
|---|----------|-------------|---------------|
| 01 | `01_Tasks-33-43_Details-Items-Totals.md` | Create order details, items, and totals | 33-43 |
| 02 | `02_Tasks-44-50_Timeline-Notes-Modals.md` | Create timeline, notes, and modals | 44-50 |

---

## Task Summary

| Task # | Task Name | Complexity | Dependencies |
|--------|-----------|------------|--------------|
| 33 | Create Order Details Page | Medium | Task 14 |
| 34 | Create Order Details Header | Low | Task 33 |
| 35 | Create Order Status Banner | Low | Task 34 |
| 36 | Create Order Actions Dropdown | Low | Task 34 |
| 37 | Create Order Info Card | Medium | Task 33 |
| 38 | Create Customer Info Section | Low | Task 37 |
| 39 | Create Shipping Address Section | Low | Task 37 |
| 40 | Create Billing Address Section | Low | Task 37 |
| 41 | Create Order Items Table | Medium | Task 33 |
| 42 | Create Order Item Row | Medium | Task 41 |
| 43 | Create Order Totals Section | Medium | Task 41 |
| 44 | Create Order Status Timeline | Medium | Task 33 |
| 45 | Create Timeline Item Component | Medium | Task 44 |
| 46 | Create Order Notes Section | Low | Task 33 |
| 47 | Create Add Note Form | Low | Task 46 |
| 48 | Create Status Update Modal | Medium | Task 33 |
| 49 | Create Cancel Order Dialog | Low | Task 33 |
| 50 | Connect Order Details to API | Medium | Task 49 |

---

## Execution Order

```
Task 33: Order Details Page
    │
    ├──────────────────────────────────────────────────┐
    ▼                                                  │
Task 34: Order Header                                  │
    │                                                  │
    ├──────────┬──────────┐                            │
    ▼          ▼          │                            │
Task 35    Task 36       │                            │
(Banner)   (Actions)     │                            │
    │          │          │                            │
    └──────────┴──────────┘                            │
               │                                       │
               ▼                                       │
         Task 37: Order Info Card                      │
               │                                       │
         ┌─────┼─────┬─────┐                           │
         ▼     ▼     ▼     │                           │
      Task 38 Task 39 Task 40                          │
      (Customer)(Ship) (Bill)                          │
         │     │     │     │                           │
         └─────┴─────┴─────┘                           │
               │                                       │
               ▼                                       │
         Task 41: Items Table                          │
               │                                       │
               ▼                                       │
         Task 42: Item Row                             │
               │                                       │
               ▼                                       │
         Task 43: Totals                               │
               │                                       │
               └───────────────────────────────────────┘
                              │
               ┌──────────────┴──────────────┐
               ▼                             ▼
         Task 44: Timeline            Task 46: Notes
               │                             │
               ▼                             ▼
         Task 45: Item                Task 47: Form
               │                             │
               └──────────────┬──────────────┘
                              │
               ┌──────────────┴──────────────┐
               ▼                             ▼
         Task 48: Status Modal        Task 49: Cancel
               │                             │
               └──────────────┬──────────────┘
                              ▼
                        Task 50: API
```

---

## Expected Deliverables

```
frontend/
└── components/
    └── modules/
        └── sales/
            └── Orders/
                ├── OrderDetails/
                │   ├── OrderDetails.tsx
                │   ├── OrderDetailsHeader.tsx
                │   ├── OrderStatusBanner.tsx
                │   ├── OrderActionsDropdown.tsx
                │   ├── OrderInfoCard.tsx
                │   ├── CustomerInfoSection.tsx
                │   ├── ShippingAddressSection.tsx
                │   ├── BillingAddressSection.tsx
                │   ├── OrderItemsTable.tsx
                │   ├── OrderItemRow.tsx
                │   ├── OrderTotals.tsx
                │   ├── OrderTimeline.tsx
                │   ├── TimelineItem.tsx
                │   ├── OrderNotes.tsx
                │   ├── AddNoteForm.tsx
                │   ├── StatusUpdateModal.tsx
                │   ├── CancelOrderDialog.tsx
                │   └── index.ts
                └── index.ts
```

---

## Notes for AI Agents

### Order Status Banner (Task 35)
| Status | Color | Icon |
|--------|-------|------|
| Draft | Gray | FileText |
| Confirmed | Blue | CheckCircle |
| Processing | Yellow | Clock |
| Shipped | Purple | Truck |
| Delivered | Green | Package |
| Cancelled | Red | XCircle |

### Actions Dropdown (Task 36)
| Action | Icon | Condition |
|--------|------|-----------|
| Edit | Pencil | Not shipped |
| Print | Printer | Always |
| Cancel | X | Not cancelled |
| Duplicate | Copy | Always |

### Customer Info (Task 38)
| Field | Display |
|-------|---------|
| Name | Customer name |
| Email | customer@email.com |
| Phone | +94 XX XXX XXXX |

### Address Display (Tasks 39-40)
| Field | Display |
|-------|---------|
| Line 1 | Street address |
| Line 2 | Building/apt |
| City | City name |
| District | Sri Lankan district |
| Postal | Postal code |

### Order Item Row (Task 42)
| Column | Content |
|--------|---------|
| Product | Image + Name |
| Variant | Size/Color |
| Quantity | X units |
| Unit Price | ₨ X,XXX |
| Total | ₨ X,XXX |

### Order Totals (Task 43)
| Line | Calculation |
|------|-------------|
| Subtotal | Sum of line items |
| Discount | - discount amount |
| Tax | + tax amount |
| **Total** | **Final amount (LKR)** |

### Timeline Entry (Task 45)
| Element | Content |
|---------|---------|
| Icon | Status icon |
| Title | Status change |
| User | Who made change |
| Time | Timestamp |
| Note | Optional note |

### Status Update Modal (Task 48)
| Field | Type |
|-------|------|
| New Status | Select dropdown |
| Note | Optional textarea |
| Notify Customer | Checkbox |

### Cancel Dialog (Task 49)
| Field | Type |
|-------|------|
| Reason | Select or input |
| Refund | Checkbox (if paid) |
| Confirm | Type order # |
