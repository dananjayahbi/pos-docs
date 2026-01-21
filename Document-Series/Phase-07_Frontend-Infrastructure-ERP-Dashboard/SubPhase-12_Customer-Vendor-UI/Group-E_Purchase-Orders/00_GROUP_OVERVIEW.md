# Group E: Purchase Orders

> **Phase:** 07 - Frontend Infrastructure & ERP Dashboard  
> **SubPhase:** 12 - Customer & Vendor UI  
> **Group:** E of F  
> **Tasks Covered:** 67-82  
> **Group Goal:** Build purchase order listing, details, creation form, and receiving

---

## Navigation

- **↑ Parent:** [00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [Group-D_Vendor-Management](../Group-D_Vendor-Management/)
- **→ Next Group:** [Group-F_Import-Export-Testing](../Group-F_Import-Export-Testing/)

---

## Group Overview

This group creates the purchase order management functionality. Creates PO list page with header and create action. Creates filters for vendor, status, and date. Creates PO table with columns for PO number, vendor, date, items count, total, and status. Adds PO status badge (Draft, Sent, Partial, Received). Creates PO details page with header section showing PO number, vendor, and status. Creates PO items table with line items. Adds receive items action for marking items as received. Creates new PO page with form. Creates Zod schema for PO. Builds vendor select and items section. Implements submit PO action. Connects to purchase orders API.

### Key Outcomes

- PO list page component
- PO header with action
- PO filters
- PO table
- Table columns defined
- PO status badge
- PO details page
- PO header section
- PO items table
- Receive items action
- New PO page
- PO form schema
- Vendor select for PO
- PO items section
- Submit PO action
- Connected to PO API

### Technology Context

- **Data Table:** TanStack Table
- **Form:** React Hook Form + Zod
- **Receiving:** Partial receiving support
- **State:** TanStack Query usePurchaseOrders

---

## Documents in This Group

| # | Document | Description | Tasks Covered |
|---|----------|-------------|---------------|
| 01 | `01_Tasks-67-76_List-Details.md` | Create PO list and details | 67-76 |
| 02 | `02_Tasks-77-82_Form-API.md` | Create PO form and API connection | 77-82 |

---

## Task Summary

| Task # | Task Name | Complexity | Dependencies |
|--------|-----------|------------|--------------|
| 67 | Create PO List Page | Low | Task 14 |
| 68 | Create PO Header | Low | Task 67 |
| 69 | Create PO Filters | Low | Task 67 |
| 70 | Create PO Table | Medium | Task 67 |
| 71 | Define PO Table Columns | Medium | Task 70 |
| 72 | Create PO Status Badge | Low | Task 71 |
| 73 | Create PO Details Page | Medium | Task 14 |
| 74 | Create PO Header Section | Low | Task 73 |
| 75 | Create PO Items Table | Medium | Task 73 |
| 76 | Create Receive Items Action | Medium | Task 75 |
| 77 | Create New PO Page | Medium | Task 14 |
| 78 | Create PO Form Schema | Medium | Task 77 |
| 79 | Create Vendor Select for PO | Low | Task 78 |
| 80 | Create PO Items Section | Medium | Task 77 |
| 81 | Create Submit PO Action | Medium | Task 80 |
| 82 | Connect PO to API | Medium | Task 81 |

---

## Execution Order

```
Task 67: PO List Page
    │
    ├──────────────────────────────────────────────────┐
    ▼                                                  │
Task 68: PO Header                                     │
    │                                                  │
    ▼                                                  │
Task 69: PO Filters                                    │
    │                                                  │
    ▼                                                  │
Task 70: PO Table                                      │
    │                                                  │
    ▼                                                  │
Task 71: Table Columns                                 │
    │                                                  │
    ▼                                                  │
Task 72: Status Badge                                  │
    │                                                  │
    └──────────────────────────────────────────────────┘
               │
               ▼
         Task 73: PO Details Page
               │
               ▼
         Task 74: PO Header Section
               │
               ▼
         Task 75: PO Items Table
               │
               ▼
         Task 76: Receive Items
               │
               ▼
         Task 77: New PO Page
               │
               ▼
         Task 78: Form Schema
               │
         ┌─────┴─────┐
         ▼           ▼
      Task 79    Task 80
      (Vendor)   (Items)
         │           │
         └─────┬─────┘
               ▼
         Task 81: Submit PO
               │
               ▼
         Task 82: API
```

---

## Expected Deliverables

```
frontend/
├── app/
│   └── (dashboard)/
│       └── purchase-orders/
│           ├── page.tsx
│           ├── new/
│           │   └── page.tsx
│           └── [id]/
│               └── page.tsx
├── components/
│   └── modules/
│       └── crm/
│           └── PurchaseOrders/
│               ├── POList.tsx
│               ├── POHeader.tsx
│               ├── POFilters.tsx
│               ├── POTable.tsx
│               ├── POTableColumns.tsx
│               ├── POStatusBadge.tsx
│               ├── PODetails/
│               │   ├── PODetails.tsx
│               │   ├── POHeaderSection.tsx
│               │   ├── POItemsTable.tsx
│               │   ├── ReceiveItemsModal.tsx
│               │   └── index.ts
│               ├── POForm.tsx
│               ├── VendorSelectForPO.tsx
│               ├── POItemsSection.tsx
│               └── index.ts
└── lib/
    └── validations/
        └── purchase-order.ts
```

---

## Notes for AI Agents

### PO Filters (Task 69)
| Filter | Type |
|--------|------|
| Vendor | Search select |
| Status | Select |
| Date Range | Date picker |

### PO Table Columns (Task 71)
| Column | Width | Sortable |
|--------|-------|----------|
| PO # | 120px | Yes |
| Vendor | 200px | Yes |
| Date | 100px | Yes |
| Items | 80px | No |
| Total (LKR) | 120px | Yes |
| Status | 100px | Yes |
| Actions | 80px | No |

### PO Status (Task 72)
| Status | Color | Description |
|--------|-------|-------------|
| Draft | Gray | Not sent |
| Sent | Blue | Sent to vendor |
| Partial | Yellow | Partially received |
| Received | Green | Fully received |
| Cancelled | Red | Cancelled |

### PO Header Section (Task 74)
| Element | Content |
|---------|---------|
| PO Number | PO-XXXX |
| Vendor | Vendor name + link |
| Status | Status badge |
| Date | Created date |
| Expected | Expected delivery |

### PO Items Table (Task 75)
| Column | Width |
|--------|-------|
| Product | 250px |
| SKU | 120px |
| Ordered | 80px |
| Received | 80px |
| Pending | 80px |
| Unit Cost | 100px |
| Total | 120px |
| Action | 60px |

### Receive Items (Task 76)
| Field | Type |
|-------|------|
| Product | Display |
| Ordered | Display |
| Previously Received | Display |
| Receiving Now | Number input |
| Notes | Text |

### PO Form Schema (Task 78)
| Field | Type | Validation |
|-------|------|------------|
| vendor_id | string | Required UUID |
| expected_date | date | Future date |
| items | array | Min 1 item |
| notes | string | Optional |

### Vendor Select (Task 79)
| Feature | Description |
|---------|-------------|
| Search | Search by name |
| Display | Name + contact |
| Create | Link to new vendor |

### PO Items Section (Task 80)
| Field | Type |
|-------|------|
| Product | Search select |
| Quantity | Number input |
| Unit Cost | Number input |
| Total | Calculated |
