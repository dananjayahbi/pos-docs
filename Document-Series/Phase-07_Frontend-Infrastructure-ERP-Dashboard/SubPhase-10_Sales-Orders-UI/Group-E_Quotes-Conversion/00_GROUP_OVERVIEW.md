# Group E: Quotes & Conversion

> **Phase:** 07 - Frontend Infrastructure & ERP Dashboard  
> **SubPhase:** 10 - Sales & Orders UI  
> **Group:** E of F  
> **Tasks Covered:** 67-80  
> **Group Goal:** Build quote listing, creation form, and quote-to-order conversion

---

## Navigation

- **↑ Parent:** [00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [Group-D_Invoice-Management](../Group-D_Invoice-Management/)
- **→ Next Group:** [Group-F_Payment-Shipping-Testing](../Group-F_Payment-Shipping-Testing/)

---

## Group Overview

This group creates quote management and conversion functionality. Creates quotes list page with header and create action. Creates quote filters for status, date, and customer. Creates quotes table with columns for quote number, customer, date, amount, status, and expiry. Adds quote status badge (draft, sent, accepted, rejected, expired). Creates new quote page with form. Creates Zod schema for quote validation. Builds customer select (existing or new). Creates quote items section to add products. Creates validity section with expiry date and terms. Creates quote details page for viewing/editing. Adds convert to order button. Implements quote-to-order conversion logic.

### Key Outcomes

- Quotes list page component
- Quotes header with action
- Quote filters
- Quotes table
- Table columns defined
- Quote status badge
- New quote page
- Quote form schema
- Quote customer select
- Quote items section
- Quote validity section
- Quote details page
- Convert to order button
- Quote conversion logic

### Technology Context

- **Form:** React Hook Form + Zod
- **Table:** TanStack Table
- **Date:** Date picker for expiry
- **Conversion:** Quote to order

---

## Documents in This Group

| # | Document | Description | Tasks Covered |
|---|----------|-------------|---------------|
| 01 | `01_Tasks-67-76_List-Form.md` | Create quote list and form | 67-76 |
| 02 | `02_Tasks-77-80_Details-Conversion.md` | Create details and conversion | 77-80 |

---

## Task Summary

| Task # | Task Name | Complexity | Dependencies |
|--------|-----------|------------|--------------|
| 67 | Create Quotes List Page | Low | Task 14 |
| 68 | Create Quotes Header | Low | Task 67 |
| 69 | Create Quote Filters | Low | Task 67 |
| 70 | Create Quotes Table | Medium | Task 67 |
| 71 | Define Quote Table Columns | Medium | Task 70 |
| 72 | Create Quote Status Badge | Low | Task 71 |
| 73 | Create New Quote Page | Medium | Task 14 |
| 74 | Create Quote Form Schema | Medium | Task 73 |
| 75 | Create Quote Customer Select | Medium | Task 74 |
| 76 | Create Quote Items Section | Medium | Task 73 |
| 77 | Create Quote Validity Section | Low | Task 73 |
| 78 | Create Quote Details Page | Medium | Task 73 |
| 79 | Create Convert to Order Button | Low | Task 78 |
| 80 | Create Quote Conversion Logic | Medium | Task 79 |

---

## Execution Order

```
Task 67: Quotes List Page
    │
    ├──────────────────────────────────────────────────┐
    ▼                                                  │
Task 68: Quotes Header                                 │
    │                                                  │
    ▼                                                  │
Task 69: Quote Filters                                 │
    │                                                  │
    ▼                                                  │
Task 70: Quotes Table                                  │
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
         Task 73: New Quote Page
               │
               ▼
         Task 74: Form Schema
               │
         ┌─────┼─────┬─────┐
         ▼     ▼     ▼     │
      Task 75 Task 76 Task 77
      (Customer)(Items)(Validity)
         │     │     │     │
         └─────┴─────┴─────┘
               │
               ▼
         Task 78: Quote Details Page
               │
               ▼
         Task 79: Convert Button
               │
               ▼
         Task 80: Conversion Logic
```

---

## Expected Deliverables

```
frontend/
├── app/
│   └── (dashboard)/
│       └── quotes/
│           ├── page.tsx
│           ├── new/
│           │   └── page.tsx
│           └── [id]/
│               └── page.tsx
├── components/
│   └── modules/
│       └── sales/
│           └── Quotes/
│               ├── QuotesList.tsx
│               ├── QuotesHeader.tsx
│               ├── QuoteFilters.tsx
│               ├── QuotesTable.tsx
│               ├── QuoteTableColumns.tsx
│               ├── QuoteStatusBadge.tsx
│               ├── QuoteForm.tsx
│               ├── QuoteCustomerSelect.tsx
│               ├── QuoteItems.tsx
│               ├── QuoteValidity.tsx
│               ├── QuoteDetails.tsx
│               ├── ConvertToOrderButton.tsx
│               └── index.ts
└── lib/
    └── validations/
        └── quote.ts
```

---

## Notes for AI Agents

### Quote Filters (Task 69)
| Filter | Type |
|--------|------|
| Status | Select |
| Date Range | Date picker |
| Customer | Search select |

### Quote Table Columns (Task 71)
| Column | Width | Sortable |
|--------|-------|----------|
| Quote # | 120px | Yes |
| Customer | 200px | Yes |
| Date | 120px | Yes |
| Expiry | 120px | Yes |
| Amount (LKR) | 120px | Yes |
| Status | 100px | Yes |
| Actions | 80px | No |

### Quote Status (Task 72)
| Status | Color | Description |
|--------|-------|-------------|
| Draft | Gray | Not sent |
| Sent | Blue | Sent to customer |
| Accepted | Green | Customer accepted |
| Rejected | Red | Customer declined |
| Expired | Orange | Past expiry date |

### Quote Form Schema (Task 74)
| Field | Type | Validation |
|-------|------|------------|
| customer_id | string | Required UUID |
| items | array | Min 1 item |
| expiry_date | date | Future date |
| terms | string | Optional |
| notes | string | Optional |

### Customer Select (Task 75)
| Feature | Description |
|---------|-------------|
| Search | Search existing customers |
| Create | Option to create new |
| Display | Name + email |

### Quote Items (Task 76)
| Field | Description |
|-------|-------------|
| Product | Search and select |
| Variant | Select if applicable |
| Quantity | Number input |
| Price | Unit price (editable) |
| Total | Calculated |

### Validity Section (Task 77)
| Field | Type |
|-------|------|
| Expiry Date | Date picker |
| Valid Days | Preset (7, 14, 30) |
| Terms | Textarea |

### Convert to Order (Task 79-80)
| Step | Action |
|------|--------|
| 1 | Click Convert button |
| 2 | Confirm dialog |
| 3 | Create order from quote |
| 4 | Update quote status |
| 5 | Navigate to order |

### Conversion Logic (Task 80)
| Source | Target |
|--------|--------|
| Quote customer | Order customer |
| Quote items | Order items |
| Quote prices | Order prices |
| Quote status | Accepted → Converted |
| New order | Status = Confirmed |
