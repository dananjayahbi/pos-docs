# Group D: Invoice Management

> **Phase:** 07 - Frontend Infrastructure & ERP Dashboard  
> **SubPhase:** 10 - Sales & Orders UI  
> **Group:** D of F  
> **Tasks Covered:** 51-66  
> **Group Goal:** Build invoice listing, details with PDF preview, and send capabilities

---

## Navigation

- **↑ Parent:** [00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [Group-C_Order-Details-Timeline](../Group-C_Order-Details-Timeline/)
- **→ Next Group:** [Group-E_Quotes-Conversion](../Group-E_Quotes-Conversion/)

---

## Group Overview

This group creates the invoice management functionality. Creates invoices list page with header and create action. Builds summary cards showing total, paid, and outstanding amounts. Creates filter bar for status, date, and customer. Creates invoices table with columns for invoice number, customer, date, amount, and status. Adds invoice status badge and actions cell (view, download, send, void). Creates invoice details page with header section showing invoice number, dates, and status. Builds PDF preview component with embedded viewer. Adds download PDF button and print action. Creates send invoice modal for email delivery. Creates payment history section showing payments made against invoice. Connects to invoices API.

### Key Outcomes

- Invoices list page component
- Invoices header with action
- Invoice summary cards
- Invoice filters
- Invoices table
- Table columns defined
- Invoice status badge
- Invoice actions cell
- Invoice details page
- Invoice header section
- Invoice PDF preview
- Download PDF button
- Print invoice action
- Send invoice modal
- Payment history section
- Connected to invoices API

### Technology Context

- **PDF:** Embedded PDF viewer
- **Table:** TanStack Table
- **Email:** Send invoice modal
- **Currency:** LKR formatting

---

## Documents in This Group

| # | Document | Description | Tasks Covered |
|---|----------|-------------|---------------|
| 01 | `01_Tasks-51-58_List-Table.md` | Create invoice list and table | 51-58 |
| 02 | `02_Tasks-59-66_Details-PDF-Send.md` | Create details, PDF preview, and send | 59-66 |

---

## Task Summary

| Task # | Task Name | Complexity | Dependencies |
|--------|-----------|------------|--------------|
| 51 | Create Invoices List Page | Low | Task 14 |
| 52 | Create Invoices Header | Low | Task 51 |
| 53 | Create Invoice Summary Cards | Medium | Task 51 |
| 54 | Create Invoice Filters | Low | Task 51 |
| 55 | Create Invoices Table | Medium | Task 51 |
| 56 | Define Invoice Table Columns | Medium | Task 55 |
| 57 | Create Invoice Status Badge | Low | Task 56 |
| 58 | Create Invoice Actions Cell | Low | Task 56 |
| 59 | Create Invoice Details Page | Medium | Task 14 |
| 60 | Create Invoice Header Section | Low | Task 59 |
| 61 | Create Invoice PDF Preview | Medium | Task 59 |
| 62 | Create Download PDF Button | Low | Task 61 |
| 63 | Create Print Invoice Action | Low | Task 61 |
| 64 | Create Send Invoice Modal | Medium | Task 59 |
| 65 | Create Payment History Section | Medium | Task 59 |
| 66 | Connect Invoices to API | Medium | Task 65 |

---

## Execution Order

```
Task 51: Invoices List Page
    │
    ├──────────────────────────────────────────────────┐
    ▼                                                  │
Task 52: Invoices Header                               │
    │                                                  │
    ▼                                                  │
Task 53: Summary Cards                                 │
    │                                                  │
    ▼                                                  │
Task 54: Invoice Filters                               │
    │                                                  │
    ▼                                                  │
Task 55: Invoices Table                                │
    │                                                  │
    ▼                                                  │
Task 56: Table Columns                                 │
    │                                                  │
    ├──────────┬──────────┐                            │
    ▼          ▼          │                            │
Task 57    Task 58       │                            │
(Badge)    (Actions)     │                            │
    │          │          │                            │
    └──────────┴──────────┴────────────────────────────┘
                          │
                          ▼
                    Task 59: Invoice Details Page
                          │
                          ▼
                    Task 60: Header Section
                          │
                          ▼
                    Task 61: PDF Preview
                          │
                    ┌─────┴─────┐
                    ▼           ▼
                 Task 62    Task 63
                 (Download) (Print)
                    │           │
                    └─────┬─────┘
                          │
               ┌──────────┴──────────┐
               ▼                     ▼
         Task 64: Send         Task 65: History
               │                     │
               └──────────┬──────────┘
                          ▼
                    Task 66: API
```

---

## Expected Deliverables

```
frontend/
└── components/
    └── modules/
        └── sales/
            └── Invoices/
                ├── InvoicesList.tsx
                ├── InvoicesHeader.tsx
                ├── InvoiceSummaryCards.tsx
                ├── InvoiceFilters.tsx
                ├── InvoicesTable.tsx
                ├── InvoiceTableColumns.tsx
                ├── InvoiceStatusBadge.tsx
                ├── InvoiceActionsCell.tsx
                ├── InvoiceDetails/
                │   ├── InvoiceDetails.tsx
                │   ├── InvoiceHeaderSection.tsx
                │   ├── InvoicePDFPreview.tsx
                │   ├── DownloadPDFButton.tsx
                │   ├── PrintInvoiceButton.tsx
                │   ├── SendInvoiceModal.tsx
                │   ├── PaymentHistory.tsx
                │   └── index.ts
                └── index.ts
```

---

## Notes for AI Agents

### Invoice Summary Cards (Task 53)
| Card | Icon | Value |
|------|------|-------|
| Total | FileText | Sum of all invoices |
| Paid | CheckCircle | Sum of paid invoices |
| Outstanding | AlertCircle | Sum of unpaid |

### Invoice Filters (Task 54)
| Filter | Type |
|--------|------|
| Status | Select |
| Date Range | Date picker |
| Customer | Search select |

### Invoice Table Columns (Task 56)
| Column | Width | Sortable |
|--------|-------|----------|
| Invoice # | 120px | Yes |
| Customer | 200px | Yes |
| Date | 120px | Yes |
| Due Date | 120px | Yes |
| Amount (LKR) | 120px | Yes |
| Status | 100px | Yes |
| Actions | 80px | No |

### Invoice Status (Task 57)
| Status | Color | Description |
|--------|-------|-------------|
| Draft | Gray | Not sent |
| Sent | Blue | Sent to customer |
| Paid | Green | Fully paid |
| Partial | Yellow | Partially paid |
| Overdue | Red | Past due date |
| Void | Black | Cancelled |

### Invoice Actions (Task 58)
| Action | Icon | Description |
|--------|------|-------------|
| View | Eye | Open details |
| Download | Download | Get PDF |
| Send | Mail | Email invoice |
| Void | X | Cancel invoice |

### PDF Preview (Task 61)
| Feature | Description |
|---------|-------------|
| Viewer | Embedded PDF viewer |
| Zoom | +/- controls |
| Pages | Navigation |
| Size | Responsive container |

### Send Invoice Modal (Task 64)
| Field | Type |
|-------|------|
| Email | Prefilled customer email |
| CC | Optional additional emails |
| Subject | Editable subject line |
| Message | Optional message |
| Attach PDF | Checkbox (default on) |

### Payment History (Task 65)
| Column | Content |
|--------|---------|
| Date | Payment date |
| Method | Cash/Card/Transfer |
| Amount | LKR amount |
| Reference | Transaction ref |
| Balance | Remaining balance |
