# SubPhase 10: Sales & Orders UI - Tasks Summary

> **Phase:** 07 - Frontend Infrastructure & ERP Dashboard  
> **SubPhase Index:** 10 of 14  
> **SubPhase Goal:** Build sales management interfaces including orders, invoices, quotes, and payment recording  
> **Total Tasks:** 94 | **Status:** Planning  
> **Estimated Duration:** 10-12 hours

---

## Navigation

- **↑ Parent:** [00_SUBPHASES_SUMMARY.md](../00_SUBPHASES_SUMMARY.md)
- **← Previous SubPhase:** [SubPhase-09_Inventory-Management-UI](../SubPhase-09_Inventory-Management-UI/)
- **→ Next SubPhase:** [SubPhase-11_POS-Interface](../SubPhase-11_POS-Interface/)

---

## SubPhase Overview

This sub-phase creates the complete sales management module UI for the ERP dashboard. It includes order management, invoice handling, quote creation, payment recording, and shipping integration.

### Key Outcomes
- Order listing with advanced filters
- Order details with status timeline
- Invoice listing and PDF preview
- Quote creation and conversion
- Payment recording modal
- Shipping label generation
- Order notes and activity timeline
- Sales reports integration

### Technology Context
- **Data Display:** Tables, cards, timeline
- **Forms:** React Hook Form + Zod
- **PDF:** PDF preview component
- **State:** TanStack Query for server state
- **API:** Sales service from SubPhase-04

### Order Lifecycle
- **Draft** → **Confirmed** → **Processing** → **Shipped** → **Delivered** / **Returned**
- **Cancelled** can occur from Draft/Confirmed/Processing

---

## Task Execution Order

```
TASK GROUP A: Sales Routes & Pages Structure (Tasks 01-14)
        │
        ▼
TASK GROUP B: Order Listing & Filters (Tasks 15-32)
        │
        ▼
TASK GROUP C: Order Details & Timeline (Tasks 33-50)
        │
        ▼
TASK GROUP D: Invoice Management (Tasks 51-66)
        │
        ▼
TASK GROUP E: Quotes & Conversion (Tasks 67-80)
        │
        ▼
TASK GROUP F: Payment, Shipping & Testing (Tasks 81-94)
```

---

## Task Index

### Group A: Sales Routes & Pages Structure (Tasks 01-14)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 01 | **Create Sales Route Directories** | Set up app/(dashboard)/orders/, invoices/, quotes/ | SubPhase-07 | 🔴 Not Created |
| 02 | **Create Orders Layout** | Layout with tabs for order sections | Task 01 | 🔴 Not Created |
| 03 | **Create Orders List Page Route** | Create orders/page.tsx for order listing | Task 01 | 🔴 Not Created |
| 04 | **Create Order Details Page Route** | Create orders/[id]/page.tsx | Task 01 | 🔴 Not Created |
| 05 | **Create New Order Page Route** | Create orders/new/page.tsx | Task 01 | 🔴 Not Created |
| 06 | **Create Invoices List Page Route** | Create invoices/page.tsx | Task 01 | 🔴 Not Created |
| 07 | **Create Invoice Details Page Route** | Create invoices/[id]/page.tsx | Task 06 | 🔴 Not Created |
| 08 | **Create Quotes List Page Route** | Create quotes/page.tsx | Task 01 | 🔴 Not Created |
| 09 | **Create Quote Details Page Route** | Create quotes/[id]/page.tsx | Task 08 | 🔴 Not Created |
| 10 | **Create New Quote Page Route** | Create quotes/new/page.tsx | Task 08 | 🔴 Not Created |
| 11 | **Configure Page Metadata** | Set up SEO metadata for sales pages | Task 01 | 🔴 Not Created |
| 12 | **Create Sales Loading States** | Loading.tsx for sales pages | Task 01 | 🔴 Not Created |
| 13 | **Create Sales Error Boundaries** | Error.tsx for sales pages | Task 01 | 🔴 Not Created |
| 14 | **Verify Route Structure** | Test all sales routes are accessible | Task 13 | 🔴 Not Created |

---

### Group B: Order Listing & Filters (Tasks 15-32)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 15 | **Create Orders List Page** | Main order listing page component | Task 14 | 🔴 Not Created |
| 16 | **Create Orders Header** | Page header with create order action | Task 15 | 🔴 Not Created |
| 17 | **Create Order Summary Cards** | Summary cards (total, pending, shipped, revenue) | Task 15 | 🔴 Not Created |
| 18 | **Create Total Orders Card** | Card showing total order count | Task 17 | 🔴 Not Created |
| 19 | **Create Pending Orders Card** | Card with pending orders count | Task 17 | 🔴 Not Created |
| 20 | **Create Shipped Today Card** | Card with orders shipped today | Task 17 | 🔴 Not Created |
| 21 | **Create Revenue Card** | Card with today/month revenue | Task 17 | 🔴 Not Created |
| 22 | **Create Order Filters Bar** | Toolbar with search and filters | Task 15 | 🔴 Not Created |
| 23 | **Create Order Search** | Search by order number, customer | Task 22 | 🔴 Not Created |
| 24 | **Create Status Filter** | Filter by order status | Task 22 | 🔴 Not Created |
| 25 | **Create Date Range Filter** | Filter by order date range | Task 22 | 🔴 Not Created |
| 26 | **Create Payment Status Filter** | Filter (paid, partial, unpaid) | Task 22 | 🔴 Not Created |
| 27 | **Create Orders Table** | Table showing order listing | Task 15 | 🔴 Not Created |
| 28 | **Define Order Table Columns** | Order #, Customer, Date, Items, Total, Status | Task 27 | 🔴 Not Created |
| 29 | **Create Order Status Badge** | Visual status indicator | Task 28 | 🔴 Not Created |
| 30 | **Create Order Actions Cell** | View, Edit, Print, Cancel actions | Task 28 | 🔴 Not Created |
| 31 | **Implement Table Sorting** | Sort by date, total, status | Task 27 | 🔴 Not Created |
| 32 | **Connect to Orders API** | Use useOrders hook for data | Task 31 | 🔴 Not Created |

---

### Group C: Order Details & Timeline (Tasks 33-50)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 33 | **Create Order Details Page** | Complete order details view | Task 14 | 🔴 Not Created |
| 34 | **Create Order Details Header** | Header with order number, actions | Task 33 | 🔴 Not Created |
| 35 | **Create Order Status Banner** | Prominent status display | Task 34 | 🔴 Not Created |
| 36 | **Create Order Actions Dropdown** | Edit, Print, Cancel, Duplicate | Task 34 | 🔴 Not Created |
| 37 | **Create Order Info Card** | Order date, customer, address | Task 33 | 🔴 Not Created |
| 38 | **Create Customer Info Section** | Customer name, email, phone | Task 37 | 🔴 Not Created |
| 39 | **Create Shipping Address Section** | Shipping address display | Task 37 | 🔴 Not Created |
| 40 | **Create Billing Address Section** | Billing address display | Task 37 | 🔴 Not Created |
| 41 | **Create Order Items Table** | Line items with quantities | Task 33 | 🔴 Not Created |
| 42 | **Create Order Item Row** | Product, variant, qty, price | Task 41 | 🔴 Not Created |
| 43 | **Create Order Totals Section** | Subtotal, discount, tax, total | Task 41 | 🔴 Not Created |
| 44 | **Create Order Status Timeline** | Visual timeline of status changes | Task 33 | 🔴 Not Created |
| 45 | **Create Timeline Item Component** | Single timeline entry | Task 44 | 🔴 Not Created |
| 46 | **Create Order Notes Section** | Notes and internal comments | Task 33 | 🔴 Not Created |
| 47 | **Create Add Note Form** | Form to add new note | Task 46 | 🔴 Not Created |
| 48 | **Create Status Update Modal** | Modal to change order status | Task 33 | 🔴 Not Created |
| 49 | **Create Cancel Order Dialog** | Confirmation for cancellation | Task 33 | 🔴 Not Created |
| 50 | **Connect Order Details to API** | Use useOrder hook for data | Task 49 | 🔴 Not Created |

---

### Group D: Invoice Management (Tasks 51-66)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 51 | **Create Invoices List Page** | Invoice listing page | Task 14 | 🔴 Not Created |
| 52 | **Create Invoices Header** | Header with create invoice action | Task 51 | 🔴 Not Created |
| 53 | **Create Invoice Summary Cards** | Total, paid, outstanding amounts | Task 51 | 🔴 Not Created |
| 54 | **Create Invoice Filters** | Filter by status, date, customer | Task 51 | 🔴 Not Created |
| 55 | **Create Invoices Table** | Table of invoice records | Task 51 | 🔴 Not Created |
| 56 | **Define Invoice Table Columns** | Invoice #, Customer, Date, Amount, Status | Task 55 | 🔴 Not Created |
| 57 | **Create Invoice Status Badge** | Paid, Partial, Overdue, Draft | Task 56 | 🔴 Not Created |
| 58 | **Create Invoice Actions Cell** | View, Download, Send, Void | Task 56 | 🔴 Not Created |
| 59 | **Create Invoice Details Page** | Complete invoice view | Task 14 | 🔴 Not Created |
| 60 | **Create Invoice Header Section** | Invoice number, dates, status | Task 59 | 🔴 Not Created |
| 61 | **Create Invoice PDF Preview** | Embedded PDF viewer | Task 59 | 🔴 Not Created |
| 62 | **Create Download PDF Button** | Download invoice as PDF | Task 61 | 🔴 Not Created |
| 63 | **Create Print Invoice Action** | Print invoice directly | Task 61 | 🔴 Not Created |
| 64 | **Create Send Invoice Modal** | Send invoice via email | Task 59 | 🔴 Not Created |
| 65 | **Create Payment History Section** | Payments made against invoice | Task 59 | 🔴 Not Created |
| 66 | **Connect Invoices to API** | Use useInvoices hook | Task 65 | 🔴 Not Created |

---

### Group E: Quotes & Conversion (Tasks 67-80)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 67 | **Create Quotes List Page** | Quote listing page | Task 14 | 🔴 Not Created |
| 68 | **Create Quotes Header** | Header with create quote action | Task 67 | 🔴 Not Created |
| 69 | **Create Quote Filters** | Filter by status, date, customer | Task 67 | 🔴 Not Created |
| 70 | **Create Quotes Table** | Table of quote records | Task 67 | 🔴 Not Created |
| 71 | **Define Quote Table Columns** | Quote #, Customer, Date, Amount, Status, Expiry | Task 70 | 🔴 Not Created |
| 72 | **Create Quote Status Badge** | Draft, Sent, Accepted, Rejected, Expired | Task 71 | 🔴 Not Created |
| 73 | **Create New Quote Page** | Quote creation form | Task 14 | 🔴 Not Created |
| 74 | **Create Quote Form Schema** | Zod schema for quote | Task 73 | 🔴 Not Created |
| 75 | **Create Quote Customer Select** | Select or create customer | Task 74 | 🔴 Not Created |
| 76 | **Create Quote Items Section** | Add products to quote | Task 73 | 🔴 Not Created |
| 77 | **Create Quote Validity Section** | Expiry date, terms | Task 73 | 🔴 Not Created |
| 78 | **Create Quote Details Page** | View/edit quote | Task 73 | 🔴 Not Created |
| 79 | **Create Convert to Order Button** | Convert accepted quote | Task 78 | 🔴 Not Created |
| 80 | **Create Quote Conversion Logic** | Handle quote to order conversion | Task 79 | 🔴 Not Created |

---

### Group F: Payment, Shipping & Testing (Tasks 81-94)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 81 | **Create Record Payment Modal** | Modal to record payment | Task 50 | 🔴 Not Created |
| 82 | **Create Payment Form Schema** | Zod schema for payment | Task 81 | 🔴 Not Created |
| 83 | **Create Payment Method Select** | Cash, Card, Bank Transfer | Task 82 | 🔴 Not Created |
| 84 | **Create Payment Amount Input** | Amount with validation | Task 82 | 🔴 Not Created |
| 85 | **Create Payment Reference Input** | Reference number input | Task 82 | 🔴 Not Created |
| 86 | **Create Submit Payment Action** | Record payment API call | Task 85 | 🔴 Not Created |
| 87 | **Create Shipping Label Modal** | Generate shipping label | Task 50 | 🔴 Not Created |
| 88 | **Create Carrier Selection** | Select shipping carrier | Task 87 | 🔴 Not Created |
| 89 | **Create Tracking Number Input** | Enter tracking number | Task 87 | 🔴 Not Created |
| 90 | **Create Print Shipping Label** | Print label action | Task 89 | 🔴 Not Created |
| 91 | **Create Mark as Shipped Action** | Update order status | Task 90 | 🔴 Not Created |
| 92 | **Create Sales Module Components Index** | Export all components | Task 91 | 🔴 Not Created |
| 93 | **Create Sales Module Documentation** | Document all sales UI | Task 92 | 🔴 Not Created |
| 94 | **Final Verification & Testing** | Test complete sales module | Task 93 | 🔴 Not Created |

---

## Expected Final Structure

```
frontend/
├── app/
│   └── (dashboard)/
│       ├── orders/
│       │   ├── page.tsx              # Order listing
│       │   ├── loading.tsx
│       │   ├── error.tsx
│       │   ├── new/
│       │   │   └── page.tsx          # New order
│       │   └── [id]/
│       │       └── page.tsx          # Order details
│       ├── invoices/
│       │   ├── page.tsx              # Invoice listing
│       │   └── [id]/
│       │       └── page.tsx          # Invoice details
│       └── quotes/
│           ├── page.tsx              # Quote listing
│           ├── new/
│           │   └── page.tsx          # New quote
│           └── [id]/
│               └── page.tsx          # Quote details
├── components/
│   └── modules/
│       └── sales/
│           ├── Orders/
│           │   ├── OrdersList.tsx
│           │   ├── OrderFilters.tsx
│           │   ├── OrdersTable.tsx
│           │   ├── OrderDetails.tsx
│           │   ├── OrderTimeline.tsx
│           │   ├── OrderStatusBadge.tsx
│           │   └── index.ts
│           ├── Invoices/
│           │   ├── InvoicesList.tsx
│           │   ├── InvoiceDetails.tsx
│           │   ├── InvoicePDFViewer.tsx
│           │   ├── SendInvoiceModal.tsx
│           │   └── index.ts
│           ├── Quotes/
│           │   ├── QuotesList.tsx
│           │   ├── QuoteForm.tsx
│           │   ├── QuoteDetails.tsx
│           │   └── index.ts
│           ├── Payments/
│           │   ├── RecordPaymentModal.tsx
│           │   ├── PaymentHistory.tsx
│           │   └── index.ts
│           ├── Shipping/
│           │   ├── ShippingLabelModal.tsx
│           │   └── index.ts
│           └── index.ts
└── lib/
    └── validations/
        ├── order.ts
        ├── invoice.ts
        ├── quote.ts
        └── payment.ts
```

---

## Order Status Flow

```
┌──────────┐    ┌───────────┐    ┌────────────┐    ┌─────────┐    ┌───────────┐
│  Draft   │ -> │ Confirmed │ -> │ Processing │ -> │ Shipped │ -> │ Delivered │
└──────────┘    └───────────┘    └────────────┘    └─────────┘    └───────────┘
     │               │                 │                              │
     │               │                 │                              ▼
     │               │                 │                        ┌──────────┐
     └───────────────┴─────────────────┴───────────────────────>│ Cancelled│
                                                                └──────────┘
```

---

## Status Badge Colors

| Status | Color | Context |
|--------|-------|---------|
| Draft | Gray | Order not yet confirmed |
| Confirmed | Blue | Order confirmed, awaiting processing |
| Processing | Yellow | Order being prepared |
| Shipped | Purple | Order shipped, in transit |
| Delivered | Green | Order delivered successfully |
| Cancelled | Red | Order cancelled |
| Paid | Green | Invoice fully paid |
| Partial | Yellow | Invoice partially paid |
| Overdue | Red | Invoice past due date |

---

## Progress Tracking

| Metric | Count |
|--------|-------|
| Total Tasks | 94 |
| Tasks Completed | 0 |
| Tasks In Progress | 0 |
| Tasks Not Started | 94 |

**Last Updated:** 2026-01-17  
**Current Status:** Ready for task document creation

---

## Notes for AI Agents

1. **Execution Order:** Tasks must be executed in numerical order within each group
2. **LKR Currency:** All amounts displayed in Sri Lankan Rupees (₨)
3. **PDF Preview:** Use embedded PDF viewer for invoices
4. **Status Timeline:** Show chronological status changes with timestamps
5. **Payment Recording:** Support multiple partial payments per order
6. **Quote Expiry:** Track and highlight expired quotes
7. **Dependencies:** This sub-phase depends on SubPhase-07 and Phase-05 Sales APIs
8. **No Code Snippets in Tasks:** Individual task documents should focus on descriptions, not implementation code
9. **Order Notes:** Support internal notes not visible to customer
10. **Shipping Integration:** Prepare for future carrier API integration
11. **Forms:** Use React Hook Form with Zod for all forms
12. **Print Support:** Ensure invoice and shipping label print properly
