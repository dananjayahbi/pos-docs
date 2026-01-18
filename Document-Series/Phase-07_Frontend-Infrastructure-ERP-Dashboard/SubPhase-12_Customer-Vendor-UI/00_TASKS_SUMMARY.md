# SubPhase 12: Customer & Vendor UI - Tasks Summary

> **Phase:** 07 - Frontend Infrastructure & ERP Dashboard  
> **SubPhase Index:** 12 of 14  
> **SubPhase Goal:** Build CRM interfaces for customer and vendor management including profiles, purchase orders, and communication  
> **Total Tasks:** 94 | **Status:** Planning  
> **Estimated Duration:** 10-12 hours

---

## Navigation

- **↑ Parent:** [00_SUBPHASES_SUMMARY.md](../00_SUBPHASES_SUMMARY.md)
- **← Previous SubPhase:** [SubPhase-11_POS-Interface](../SubPhase-11_POS-Interface/)
- **→ Next SubPhase:** [SubPhase-13_HR-Payroll-UI](../SubPhase-13_HR-Payroll-UI/)

---

## SubPhase Overview

This sub-phase creates the complete CRM module UI for the ERP dashboard. It includes customer management, vendor management, purchase orders, customer 360 view, credit limit management, and communication logs.

### Key Outcomes
- Customer listing with advanced filters
- Customer 360 profile view
- Customer purchase history timeline
- Credit limit management
- Vendor listing and profiles
- Purchase order management
- Communication log
- Import/Export functionality

### Technology Context
- **Data Display:** Tables, cards, timeline
- **Forms:** React Hook Form + Zod
- **Charts:** Customer analytics
- **State:** TanStack Query for server state
- **API:** CRM service from SubPhase-04

### CRM Concepts
- **Customer 360:** Complete customer view with all related data
- **Credit Limit:** Maximum outstanding balance allowed
- **Purchase Order:** Order to vendor for stock
- **Communication Log:** Record of all customer/vendor interactions

---

## Task Execution Order

```
TASK GROUP A: CRM Routes & Pages Structure (Tasks 01-14)
        │
        ▼
TASK GROUP B: Customer Listing & Filters (Tasks 15-30)
        │
        ▼
TASK GROUP C: Customer Profile & 360 View (Tasks 31-48)
        │
        ▼
TASK GROUP D: Vendor Management (Tasks 49-66)
        │
        ▼
TASK GROUP E: Purchase Orders (Tasks 67-82)
        │
        ▼
TASK GROUP F: Import/Export & Testing (Tasks 83-94)
```

---

## Task Index

### Group A: CRM Routes & Pages Structure (Tasks 01-14)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 01 | **Create CRM Route Directories** | Set up app/(dashboard)/customers/, vendors/, purchase-orders/ | SubPhase-07 | 🔴 Not Created |
| 02 | **Create Customers List Page Route** | Create customers/page.tsx | Task 01 | 🔴 Not Created |
| 03 | **Create Customer Details Page Route** | Create customers/[id]/page.tsx | Task 01 | 🔴 Not Created |
| 04 | **Create New Customer Page Route** | Create customers/new/page.tsx | Task 01 | 🔴 Not Created |
| 05 | **Create Vendors List Page Route** | Create vendors/page.tsx | Task 01 | 🔴 Not Created |
| 06 | **Create Vendor Details Page Route** | Create vendors/[id]/page.tsx | Task 05 | 🔴 Not Created |
| 07 | **Create New Vendor Page Route** | Create vendors/new/page.tsx | Task 05 | 🔴 Not Created |
| 08 | **Create Purchase Orders Page Route** | Create purchase-orders/page.tsx | Task 01 | 🔴 Not Created |
| 09 | **Create PO Details Page Route** | Create purchase-orders/[id]/page.tsx | Task 08 | 🔴 Not Created |
| 10 | **Create New PO Page Route** | Create purchase-orders/new/page.tsx | Task 08 | 🔴 Not Created |
| 11 | **Configure Page Metadata** | Set up SEO metadata for CRM pages | Task 01 | 🔴 Not Created |
| 12 | **Create CRM Loading States** | Loading.tsx for CRM pages | Task 01 | 🔴 Not Created |
| 13 | **Create CRM Error Boundaries** | Error.tsx for CRM pages | Task 01 | 🔴 Not Created |
| 14 | **Verify Route Structure** | Test all CRM routes are accessible | Task 13 | 🔴 Not Created |

---

### Group B: Customer Listing & Filters (Tasks 15-30)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 15 | **Create Customers List Page** | Main customer listing page | Task 14 | 🔴 Not Created |
| 16 | **Create Customers Header** | Page header with add customer action | Task 15 | 🔴 Not Created |
| 17 | **Create Customer Summary Cards** | Summary cards (total, active, credit) | Task 15 | 🔴 Not Created |
| 18 | **Create Total Customers Card** | Card showing total customer count | Task 17 | 🔴 Not Created |
| 19 | **Create Active Customers Card** | Card with active customers | Task 17 | 🔴 Not Created |
| 20 | **Create Credit Outstanding Card** | Card with total outstanding | Task 17 | 🔴 Not Created |
| 21 | **Create Customer Filters Bar** | Toolbar with search and filters | Task 15 | 🔴 Not Created |
| 22 | **Create Customer Search** | Search by name, phone, email | Task 21 | 🔴 Not Created |
| 23 | **Create Status Filter** | Filter by active/inactive | Task 21 | 🔴 Not Created |
| 24 | **Create Type Filter** | Filter by customer type | Task 21 | 🔴 Not Created |
| 25 | **Create Credit Status Filter** | Filter by credit status | Task 21 | 🔴 Not Created |
| 26 | **Create Customers Table** | Table showing customer listing | Task 15 | 🔴 Not Created |
| 27 | **Define Customer Table Columns** | Name, Phone, Email, Orders, Balance, Status | Task 26 | 🔴 Not Created |
| 28 | **Create Customer Actions Cell** | View, Edit, Delete actions | Task 27 | 🔴 Not Created |
| 29 | **Implement Table Sorting** | Sort by name, orders, balance | Task 26 | 🔴 Not Created |
| 30 | **Connect to Customers API** | Use useCustomers hook | Task 29 | 🔴 Not Created |

---

### Group C: Customer Profile & 360 View (Tasks 31-48)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 31 | **Create Customer Details Page** | Customer 360 profile view | Task 14 | 🔴 Not Created |
| 32 | **Create Customer Header Section** | Name, status, quick actions | Task 31 | 🔴 Not Created |
| 33 | **Create Customer Avatar** | Avatar with initials or image | Task 32 | 🔴 Not Created |
| 34 | **Create Customer Quick Stats** | Orders, spent, last order | Task 32 | 🔴 Not Created |
| 35 | **Create Customer Tabs** | Tabs for different sections | Task 31 | 🔴 Not Created |
| 36 | **Create Overview Tab** | Overview with key info | Task 35 | 🔴 Not Created |
| 37 | **Create Contact Information Card** | Phone, email, address | Task 36 | 🔴 Not Created |
| 38 | **Create Credit Information Card** | Limit, balance, status | Task 36 | 🔴 Not Created |
| 39 | **Create Orders Tab** | Order history timeline | Task 35 | 🔴 Not Created |
| 40 | **Create Order History Table** | Table of customer orders | Task 39 | 🔴 Not Created |
| 41 | **Create Invoices Tab** | Invoice history | Task 35 | 🔴 Not Created |
| 42 | **Create Invoice History Table** | Table of customer invoices | Task 41 | 🔴 Not Created |
| 43 | **Create Communication Tab** | Communication log | Task 35 | 🔴 Not Created |
| 44 | **Create Communication Timeline** | Timeline of interactions | Task 43 | 🔴 Not Created |
| 45 | **Create Add Communication Entry** | Log new communication | Task 44 | 🔴 Not Created |
| 46 | **Create Edit Customer Modal** | Edit customer details | Task 31 | 🔴 Not Created |
| 47 | **Create Adjust Credit Limit Modal** | Modify credit limit | Task 38 | 🔴 Not Created |
| 48 | **Connect Customer Details to API** | Use useCustomer hook | Task 47 | 🔴 Not Created |

---

### Group D: Vendor Management (Tasks 49-66)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 49 | **Create Vendors List Page** | Vendor listing page | Task 14 | 🔴 Not Created |
| 50 | **Create Vendors Header** | Header with add vendor action | Task 49 | 🔴 Not Created |
| 51 | **Create Vendor Summary Cards** | Summary cards (total, active) | Task 49 | 🔴 Not Created |
| 52 | **Create Vendor Filters** | Search and filter toolbar | Task 49 | 🔴 Not Created |
| 53 | **Create Vendors Table** | Table of vendors | Task 49 | 🔴 Not Created |
| 54 | **Define Vendor Table Columns** | Name, Contact, Products, POs, Status | Task 53 | 🔴 Not Created |
| 55 | **Create Vendor Actions Cell** | View, Edit, Delete actions | Task 54 | 🔴 Not Created |
| 56 | **Create Vendor Details Page** | Vendor profile view | Task 14 | 🔴 Not Created |
| 57 | **Create Vendor Header Section** | Name, status, contact | Task 56 | 🔴 Not Created |
| 58 | **Create Vendor Tabs** | Tabs for sections | Task 56 | 🔴 Not Created |
| 59 | **Create Vendor Overview Tab** | Company info, terms | Task 58 | 🔴 Not Created |
| 60 | **Create Vendor Products Tab** | Products from vendor | Task 58 | 🔴 Not Created |
| 61 | **Create Vendor PO History Tab** | Purchase orders history | Task 58 | 🔴 Not Created |
| 62 | **Create New Vendor Page** | Create vendor form | Task 14 | 🔴 Not Created |
| 63 | **Create Vendor Form Schema** | Zod schema for vendor | Task 62 | 🔴 Not Created |
| 64 | **Create Vendor Contact Fields** | Contact information inputs | Task 63 | 🔴 Not Created |
| 65 | **Create Vendor Terms Fields** | Payment terms, lead time | Task 63 | 🔴 Not Created |
| 66 | **Connect Vendors to API** | Use useVendors hook | Task 65 | 🔴 Not Created |

---

### Group E: Purchase Orders (Tasks 67-82)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 67 | **Create PO List Page** | Purchase order listing | Task 14 | 🔴 Not Created |
| 68 | **Create PO Header** | Header with create PO action | Task 67 | 🔴 Not Created |
| 69 | **Create PO Filters** | Filter by vendor, status, date | Task 67 | 🔴 Not Created |
| 70 | **Create PO Table** | Table of purchase orders | Task 67 | 🔴 Not Created |
| 71 | **Define PO Table Columns** | PO #, Vendor, Date, Items, Total, Status | Task 70 | 🔴 Not Created |
| 72 | **Create PO Status Badge** | Draft, Sent, Partial, Received | Task 71 | 🔴 Not Created |
| 73 | **Create PO Details Page** | Complete PO view | Task 14 | 🔴 Not Created |
| 74 | **Create PO Header Section** | PO number, vendor, status | Task 73 | 🔴 Not Created |
| 75 | **Create PO Items Table** | Line items with quantities | Task 73 | 🔴 Not Created |
| 76 | **Create Receive Items Action** | Mark items as received | Task 75 | 🔴 Not Created |
| 77 | **Create New PO Page** | Create purchase order form | Task 14 | 🔴 Not Created |
| 78 | **Create PO Form Schema** | Zod schema for PO | Task 77 | 🔴 Not Created |
| 79 | **Create Vendor Select for PO** | Select vendor | Task 78 | 🔴 Not Created |
| 80 | **Create PO Items Section** | Add products to PO | Task 77 | 🔴 Not Created |
| 81 | **Create Submit PO Action** | Submit purchase order | Task 80 | 🔴 Not Created |
| 82 | **Connect PO to API** | Use usePurchaseOrders hook | Task 81 | 🔴 Not Created |

---

### Group F: Import/Export & Testing (Tasks 83-94)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 83 | **Create Customer Import Modal** | Import customers from CSV | Task 30 | 🔴 Not Created |
| 84 | **Create Customer Import Mapping** | Map CSV columns | Task 83 | 🔴 Not Created |
| 85 | **Create Customer Import Preview** | Preview before import | Task 84 | 🔴 Not Created |
| 86 | **Create Customer Export Action** | Export to CSV/Excel | Task 30 | 🔴 Not Created |
| 87 | **Create Vendor Import Modal** | Import vendors from CSV | Task 66 | 🔴 Not Created |
| 88 | **Create Vendor Export Action** | Export vendors to CSV | Task 66 | 🔴 Not Created |
| 89 | **Create Customer Form Page** | New/Edit customer form | Task 14 | 🔴 Not Created |
| 90 | **Create Customer Form Schema** | Zod validation schema | Task 89 | 🔴 Not Created |
| 91 | **Create Customer Contact Fields** | Name, phone, email inputs | Task 90 | 🔴 Not Created |
| 92 | **Create Customer Address Fields** | Address inputs | Task 90 | 🔴 Not Created |
| 93 | **Create CRM Module Documentation** | Document all CRM components | Task 92 | 🔴 Not Created |
| 94 | **Final Verification & Testing** | Test complete CRM module | Task 93 | 🔴 Not Created |

---

## Expected Final Structure

```
frontend/
├── app/
│   └── (dashboard)/
│       ├── customers/
│       │   ├── page.tsx              # Customer listing
│       │   ├── loading.tsx
│       │   ├── error.tsx
│       │   ├── new/
│       │   │   └── page.tsx          # New customer
│       │   └── [id]/
│       │       └── page.tsx          # Customer profile
│       ├── vendors/
│       │   ├── page.tsx              # Vendor listing
│       │   ├── new/
│       │   │   └── page.tsx          # New vendor
│       │   └── [id]/
│       │       └── page.tsx          # Vendor profile
│       └── purchase-orders/
│           ├── page.tsx              # PO listing
│           ├── new/
│           │   └── page.tsx          # New PO
│           └── [id]/
│               └── page.tsx          # PO details
├── components/
│   └── modules/
│       └── crm/
│           ├── Customers/
│           │   ├── CustomersList.tsx
│           │   ├── CustomerFilters.tsx
│           │   ├── CustomersTable.tsx
│           │   ├── CustomerProfile.tsx
│           │   ├── CustomerTabs.tsx
│           │   ├── CustomerForm.tsx
│           │   ├── CreditLimitModal.tsx
│           │   └── index.ts
│           ├── Vendors/
│           │   ├── VendorsList.tsx
│           │   ├── VendorProfile.tsx
│           │   ├── VendorForm.tsx
│           │   └── index.ts
│           ├── PurchaseOrders/
│           │   ├── POList.tsx
│           │   ├── PODetails.tsx
│           │   ├── POForm.tsx
│           │   ├── ReceiveItemsModal.tsx
│           │   └── index.ts
│           ├── Import/
│           │   ├── CustomerImport.tsx
│           │   ├── VendorImport.tsx
│           │   └── index.ts
│           ├── Communication/
│           │   ├── CommunicationLog.tsx
│           │   ├── AddCommunication.tsx
│           │   └── index.ts
│           └── index.ts
└── lib/
    └── validations/
        ├── customer.ts
        ├── vendor.ts
        └── purchase-order.ts
```

---

## Customer 360 View Layout

```
┌─────────────────────────────────────────────────────────────┐
│ [← Back] Customer: John Doe                    [Edit] [⋮]   │
├─────────────────────────────────────────────────────────────┤
│ [Avatar]  John Doe              Total Spent: ₨ 125,000      │
│           Active Customer       Orders: 45                  │
│           +94 77 123 4567       Last Order: 2 days ago      │
├─────────────────────────────────────────────────────────────┤
│ [Overview] [Orders] [Invoices] [Communication] [Notes]      │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────────────┐  ┌─────────────────────┐          │
│  │ Contact Info        │  │ Credit Status       │          │
│  │ Phone: +94 77...    │  │ Limit: ₨ 50,000     │          │
│  │ Email: john@...     │  │ Used: ₨ 12,500      │          │
│  │ Address: 123...     │  │ Available: ₨ 37,500 │          │
│  └─────────────────────┘  └─────────────────────┘          │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Purchase Order Status Flow

```
┌────────┐    ┌────────┐    ┌─────────┐    ┌──────────┐
│ Draft  │ -> │  Sent  │ -> │ Partial │ -> │ Received │
└────────┘    └────────┘    └─────────┘    └──────────┘
     │
     ▼
┌───────────┐
│ Cancelled │
└───────────┘
```

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
2. **Customer 360:** Show complete customer view with all data
3. **Credit Limit:** Track and enforce credit limits
4. **LKR Currency:** All amounts in Sri Lankan Rupees (₨)
5. **Communication Log:** Record calls, emails, meetings
6. **Import/Export:** Support CSV import with column mapping
7. **Dependencies:** This sub-phase depends on SubPhase-07 and Phase-05 CRM APIs
8. **No Code Snippets in Tasks:** Individual task documents should focus on descriptions, not implementation code
9. **Phone Format:** Sri Lankan phone format (+94)
10. **Address:** Sri Lankan address format
11. **Forms:** Use React Hook Form with Zod for all forms
12. **PO Receiving:** Support partial receiving of items
