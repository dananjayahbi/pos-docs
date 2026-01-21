# Group D: Stock Adjustments

> **Phase:** 07 - Frontend Infrastructure & ERP Dashboard  
> **SubPhase:** 09 - Inventory Management UI  
> **Group:** D of F  
> **Tasks Covered:** 49-64  
> **Group Goal:** Build stock adjustment list and multi-step adjustment wizard

---

## Navigation

- **↑ Parent:** [00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [Group-C_Stock-Movement-History](../Group-C_Stock-Movement-History/)
- **→ Next Group:** [Group-E_Warehouse-Transfers](../Group-E_Warehouse-Transfers/)

---

## Group Overview

This group creates the stock adjustment functionality. Creates adjustments list page with header and new adjustment button. Creates adjustments table with columns for date, reference, items count, status, and created by. Adds adjustment status badge. Creates new adjustment page as multi-step wizard. Creates Zod schema for validation. Builds header form with reference number, warehouse selection, and reason code dropdown. Creates items section where users can search and add products. Creates adjustment item row showing current quantity, new quantity input, and difference display. Adds notes input for each item. Implements submit with confirmation dialog.

### Key Outcomes

- Adjustments list page
- Adjustments header with button
- Adjustments table
- Table columns defined
- Adjustment status badge
- New adjustment page
- Adjustment form schema
- Adjustment header form
- Reason code select
- Adjustment items section
- Product search for adjustment
- Adjustment item row
- Quantity difference display
- Notes input field
- Submit adjustment
- Confirmation dialog

### Technology Context

- **Form:** React Hook Form + Zod
- **Table:** TanStack Table
- **Wizard:** Multi-step form
- **Validation:** Prevent negative stock

---

## Documents in This Group

| # | Document | Description | Tasks Covered |
|---|----------|-------------|---------------|
| 01 | `01_Tasks-49-57_List-HeaderForm.md` | Create adjustment list and header form | 49-57 |
| 02 | `02_Tasks-58-64_Items-Submit.md` | Create items section and submission | 58-64 |

---

## Task Summary

| Task # | Task Name | Complexity | Dependencies |
|--------|-----------|------------|--------------|
| 49 | Create Adjustments List Page | Low | Task 14 |
| 50 | Create Adjustments Header | Low | Task 49 |
| 51 | Create Adjustments Table | Medium | Task 49 |
| 52 | Define Adjustment Table Columns | Medium | Task 51 |
| 53 | Create Adjustment Status Badge | Low | Task 52 |
| 54 | Create New Adjustment Page | Medium | Task 14 |
| 55 | Create Adjustment Form Schema | Medium | Task 54 |
| 56 | Create Adjustment Header Form | Medium | Task 55 |
| 57 | Create Reason Code Select | Low | Task 56 |
| 58 | Create Adjustment Items Section | Medium | Task 54 |
| 59 | Create Product Search for Adjustment | Medium | Task 58 |
| 60 | Create Adjustment Item Row | Medium | Task 58 |
| 61 | Create Quantity Difference Display | Low | Task 60 |
| 62 | Create Notes Input | Low | Task 60 |
| 63 | Create Submit Adjustment | Medium | Task 58 |
| 64 | Create Adjustment Confirmation | Low | Task 63 |

---

## Execution Order

```
Task 49: Adjustments List Page
    │
    ├──────────────────────────────────────────────────┐
    ▼                                                  │
Task 50: Adjustments Header                            │
    │                                                  │
    ▼                                                  │
Task 51: Adjustments Table                             │
    │                                                  │
    ▼                                                  │
Task 52: Table Columns                                 │
    │                                                  │
    ▼                                                  │
Task 53: Status Badge                                  │
    │                                                  │
    └──────────────────────────────────────────────────┘
               │
               ▼
         Task 54: New Adjustment Page
               │
               ▼
         Task 55: Form Schema
               │
               ▼
         Task 56: Header Form
               │
               ▼
         Task 57: Reason Code
               │
               ▼
         Task 58: Items Section
               │
               ▼
         Task 59: Product Search
               │
               ▼
         Task 60: Item Row
               │
         ┌─────┴─────┐
         ▼           ▼
      Task 61    Task 62
      (Diff)     (Notes)
         │           │
         └─────┬─────┘
               ▼
         Task 63: Submit
               │
               ▼
         Task 64: Confirmation
```

---

## Expected Deliverables

```
frontend/
├── app/
│   └── (dashboard)/
│       └── inventory/
│           └── adjustments/
│               ├── page.tsx
│               └── new/
│                   └── page.tsx
├── components/
│   └── modules/
│       └── inventory/
│           └── Adjustments/
│               ├── AdjustmentsList.tsx
│               ├── AdjustmentsHeader.tsx
│               ├── AdjustmentsTable.tsx
│               ├── AdjustmentTableColumns.tsx
│               ├── AdjustmentStatusBadge.tsx
│               ├── AdjustmentForm.tsx
│               ├── AdjustmentHeaderForm.tsx
│               ├── ReasonCodeSelect.tsx
│               ├── AdjustmentItems.tsx
│               ├── AdjustmentItemRow.tsx
│               ├── QuantityDiff.tsx
│               ├── ConfirmAdjustmentDialog.tsx
│               └── index.ts
└── lib/
    └── validations/
        └── adjustment.ts
```

---

## Notes for AI Agents

### Adjustment Table Columns (Task 52)
| Column | Width | Sortable |
|--------|-------|----------|
| Date | 150px | Yes |
| Reference | 150px | Yes |
| Warehouse | 150px | Yes |
| Items | 80px | No |
| Status | 100px | Yes |
| Created By | 120px | No |
| Actions | 60px | No |

### Adjustment Status (Task 53)
| Status | Color | Description |
|--------|-------|-------------|
| Draft | Gray | Not submitted |
| Pending | Yellow | Awaiting approval |
| Approved | Green | Applied to stock |
| Rejected | Red | Declined |

### Adjustment Form Schema (Task 55)
| Field | Type | Validation |
|-------|------|------------|
| reference | string | Auto-generated |
| warehouse_id | string | Required UUID |
| reason_code | string | Required |
| notes | string | Optional |
| items | array | Min 1 item |

### Reason Codes (Task 57)
| Code | Description |
|------|-------------|
| DAMAGED | Damaged goods |
| EXPIRED | Expired items |
| COUNT | Physical count correction |
| THEFT | Loss due to theft |
| FOUND | Found inventory |
| OTHER | Other reason |

### Adjustment Item Row (Task 60)
| Field | Type | Description |
|-------|------|-------------|
| Product | Display | Name + SKU |
| Current | Display | Current quantity |
| New | Input | New quantity |
| Difference | Display | +/- change |
| Notes | Input | Item notes |

### Quantity Difference (Task 61)
| Change | Display |
|--------|---------|
| Increase | +X (Green) |
| Decrease | -X (Red) |
| No change | 0 (Gray) |

### Confirmation Dialog (Task 64)
| Element | Content |
|---------|---------|
| Title | Confirm Adjustment |
| Summary | X items, Total change |
| Warning | Cannot be undone |
| Actions | Cancel, Confirm |
