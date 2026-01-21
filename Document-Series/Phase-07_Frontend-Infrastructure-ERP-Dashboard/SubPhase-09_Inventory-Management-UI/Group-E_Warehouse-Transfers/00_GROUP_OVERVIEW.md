# Group E: Warehouse Transfers

> **Phase:** 07 - Frontend Infrastructure & ERP Dashboard  
> **SubPhase:** 09 - Inventory Management UI  
> **Group:** E of F  
> **Tasks Covered:** 65-78  
> **Group Goal:** Build warehouse transfer list and transfer creation form with availability checks

---

## Navigation

- **↑ Parent:** [00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [Group-D_Stock-Adjustments](../Group-D_Stock-Adjustments/)
- **→ Next Group:** [Group-F_Warehouse-Management-Testing](../Group-F_Warehouse-Management-Testing/)

---

## Group Overview

This group creates warehouse transfer functionality. Creates transfers list page with header and new transfer button. Creates transfers table with columns for date, reference, from warehouse, to warehouse, items count, and status. Adds transfer status badge. Creates new transfer page with form. Creates Zod schema for validation. Builds source and destination warehouse selects (prevents same selection). Creates transfer items section with product search, stock availability check at source, and quantity input. Implements submit transfer. Adds receive transfer action for destination warehouse to confirm receipt.

### Key Outcomes

- Transfers list page
- Transfers header with button
- Transfers table
- Table columns defined
- Transfer status badge
- New transfer page
- Transfer form schema
- Source warehouse select
- Destination warehouse select
- Transfer items section
- Stock availability check
- Transfer quantity input
- Submit transfer
- Receive transfer action

### Technology Context

- **Form:** React Hook Form + Zod
- **Table:** TanStack Table
- **Validation:** Source != Destination
- **Stock Check:** Available quantity display

---

## Documents in This Group

| # | Document | Description | Tasks Covered |
|---|----------|-------------|---------------|
| 01 | `01_Tasks-65-73_List-WarehouseSelects.md` | Create transfer list and warehouse selects | 65-73 |
| 02 | `02_Tasks-74-78_Items-Actions.md` | Create items section and actions | 74-78 |

---

## Task Summary

| Task # | Task Name | Complexity | Dependencies |
|--------|-----------|------------|--------------|
| 65 | Create Transfers List Page | Low | Task 14 |
| 66 | Create Transfers Header | Low | Task 65 |
| 67 | Create Transfers Table | Medium | Task 65 |
| 68 | Define Transfer Table Columns | Medium | Task 67 |
| 69 | Create Transfer Status Badge | Low | Task 68 |
| 70 | Create New Transfer Page | Medium | Task 14 |
| 71 | Create Transfer Form Schema | Medium | Task 70 |
| 72 | Create Source Warehouse Select | Low | Task 71 |
| 73 | Create Destination Warehouse Select | Low | Task 71 |
| 74 | Create Transfer Items Section | Medium | Task 70 |
| 75 | Create Stock Availability Check | Medium | Task 74 |
| 76 | Create Transfer Quantity Input | Low | Task 74 |
| 77 | Create Submit Transfer | Medium | Task 74 |
| 78 | Create Receive Transfer Action | Medium | Task 67 |

---

## Execution Order

```
Task 65: Transfers List Page
    │
    ├──────────────────────────────────────────────────┐
    ▼                                                  │
Task 66: Transfers Header                              │
    │                                                  │
    ▼                                                  │
Task 67: Transfers Table                               │
    │                                                  │
    ▼                                                  │
Task 68: Table Columns                                 │
    │                                                  │
    ▼                                                  │
Task 69: Status Badge                                  │
    │                                                  │
    ▼                                                  │
Task 78: Receive Action                                │
    │                                                  │
    └──────────────────────────────────────────────────┘
               │
               ▼
         Task 70: New Transfer Page
               │
               ▼
         Task 71: Form Schema
               │
         ┌─────┴─────┐
         ▼           ▼
      Task 72    Task 73
      (Source)   (Destination)
         │           │
         └─────┬─────┘
               ▼
         Task 74: Items Section
               │
         ┌─────┴─────┐
         ▼           ▼
      Task 75    Task 76
      (Check)    (Quantity)
         │           │
         └─────┬─────┘
               ▼
         Task 77: Submit
```

---

## Expected Deliverables

```
frontend/
├── app/
│   └── (dashboard)/
│       └── inventory/
│           └── transfers/
│               ├── page.tsx
│               └── new/
│                   └── page.tsx
├── components/
│   └── modules/
│       └── inventory/
│           └── Transfers/
│               ├── TransfersList.tsx
│               ├── TransfersHeader.tsx
│               ├── TransfersTable.tsx
│               ├── TransferTableColumns.tsx
│               ├── TransferStatusBadge.tsx
│               ├── TransferForm.tsx
│               ├── WarehouseSelect.tsx
│               ├── TransferItems.tsx
│               ├── StockAvailability.tsx
│               ├── TransferQuantityInput.tsx
│               └── index.ts
└── lib/
    └── validations/
        └── transfer.ts
```

---

## Notes for AI Agents

### Transfer Table Columns (Task 68)
| Column | Width | Sortable |
|--------|-------|----------|
| Date | 150px | Yes |
| Reference | 150px | Yes |
| From | 150px | Yes |
| To | 150px | Yes |
| Items | 80px | No |
| Status | 100px | Yes |
| Actions | 80px | No |

### Transfer Status (Task 69)
| Status | Color | Description |
|--------|-------|-------------|
| Pending | Yellow | Not yet shipped |
| In Transit | Blue | Shipped, not received |
| Received | Green | Completed |
| Cancelled | Gray | Cancelled |

### Transfer Form Schema (Task 71)
| Field | Type | Validation |
|-------|------|------------|
| reference | string | Auto-generated |
| source_warehouse_id | string | Required UUID |
| destination_warehouse_id | string | Required, != source |
| notes | string | Optional |
| items | array | Min 1 item |

### Source Warehouse Select (Task 72)
| Feature | Description |
|---------|-------------|
| Options | All warehouses with stock |
| Display | Name + code |
| Filter | Exclude destination |

### Destination Warehouse Select (Task 73)
| Feature | Description |
|---------|-------------|
| Options | All warehouses |
| Display | Name + code |
| Filter | Exclude source |
| Validation | Cannot equal source |

### Stock Availability (Task 75)
| Display | Description |
|---------|-------------|
| Available | Quantity at source |
| Reserved | Already allocated |
| Transferable | Available - Reserved |

### Transfer Quantity (Task 76)
| Validation | Rule |
|------------|------|
| Min | 1 |
| Max | Available at source |
| Type | Integer |

### Receive Transfer (Task 78)
| Step | Action |
|------|--------|
| 1 | Click Receive button |
| 2 | Confirm receipt |
| 3 | Update destination stock |
| 4 | Mark as Received |
