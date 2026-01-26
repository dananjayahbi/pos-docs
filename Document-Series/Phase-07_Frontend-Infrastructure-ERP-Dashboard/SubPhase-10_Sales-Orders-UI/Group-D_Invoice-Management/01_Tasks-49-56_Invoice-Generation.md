# Tasks 49-56: Invoice List, Summary Cards, Filters, and Table

> **Phase:** 07 - Frontend Infrastructure & ERP Dashboard  
> **SubPhase:** 10 - Sales & Orders UI  
> **Group:** D - Invoice Management  
> **Document:** 01 of 02  
> **Tasks Covered:** 49, 50, 51, 52, 53, 54, 55, 56

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Group:** [Group-C_Order-Details-Timeline](../Group-C_Order-Details-Timeline/)
- **→ Next Document:** [02_Tasks-57-64_PDF-Export.md](02_Tasks-57-64_PDF-Export.md)

---

## Document Overview

This document covers the creation of the invoice listing page with summary cards showing total, paid, and outstanding amounts, invoice filters for status, date range, and customer, and the invoices data table with column definitions and action cells. This establishes the complete invoice management interface for viewing and filtering invoice data.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 49 | Create Invoices List Page | Low | 30 min |
| 50 | Create Invoices Header | Low | 20 min |
| 51 | Create Invoice Summary Cards | Medium | 35 min |
| 52 | Create Invoice Filters | Low | 30 min |
| 53 | Create Invoices Table | Medium | 40 min |
| 54 | Define Invoice Table Columns | Medium | 35 min |
| 55 | Create Invoice Status Badge | Low | 20 min |
| 56 | Create Invoice Actions Cell | Low | 25 min |

---

## Task 49: Create Invoices List Page

### Overview
Create the main invoices list page component displaying all invoices in a structured layout with summary cards, filters, and data table. This page serves as the central interface for invoice management, allowing users to view, filter, search, and access individual invoices.

### Dependencies
- Task 14: Sales module route structure
- SubPhase-05: Table components configured
- Invoice type definitions

### Instructions

1. **Create invoices page route file**
   - Navigate to `frontend/app/(dashboard)/invoices/` directory
   - Create file `page.tsx`
   - Set up client component

2. **Import required dependencies**
   - Import InvoicesHeader from Task 50
   - Import InvoiceSummaryCards from Task 51
   - Import InvoiceFilters from Task 52
   - Import InvoicesTable from Task 53
   - Import useInvoices hook from API queries

3. **Set up page layout structure**
   - Create main container with proper spacing
   - Position header at top
   - Add summary cards section below header
   - Include filters section
   - Place table at bottom

4. **Implement state management**
   - Initialize filter state (status, date range, customer)
   - Set up pagination state (page, pageSize)
   - Initialize sorting state
   - Manage search query state

5. **Fetch invoice data**
   - Use useInvoices hook with filters
   - Pass filter parameters to API
   - Handle loading state
   - Handle error state
   - Cache results appropriately

6. **Implement filter handlers**
   - Create handleStatusFilter function
   - Create handleDateRangeFilter function
   - Create handleCustomerFilter function
   - Create handleSearchFilter function
   - Update filters and refetch data

7. **Connect summary cards to data**
   - Calculate total invoices amount
   - Calculate paid invoices amount
   - Calculate outstanding amount
   - Pass to InvoiceSummaryCards component

8. **Add loading states**
   - Show skeleton for summary cards
   - Display table loading skeleton
   - Maintain layout structure
   - Use shimmer effects

9. **Add empty state**
   - Display when no invoices exist
   - Show "Create Invoice" button
   - Include helpful illustration
   - Provide clear messaging

10. **Implement pagination**
    - Handle page changes
    - Update URL query parameters
    - Maintain filters during pagination
    - Show total count

11. **Add breadcrumb navigation**
    - Show path: Sales > Invoices
    - Make breadcrumb clickable
    - Position above header

12. **Configure page metadata**
    - Set title: "Invoices | LankaCommerce Cloud"
    - Add description for SEO
    - Configure meta tags

### Invoices Page Layout

```
┌─────────────────────────────────────────────────────────────────┐
│ Breadcrumb: Sales > Invoices                                    │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│ ┌─────────────────────────────────────────────────────────────┐ │
│ │ Invoices Header                         [+ Create Invoice] │ │
│ └─────────────────────────────────────────────────────────────┘ │
│                                                                 │
│ ┌───────────────────────────────────────────────────────────┐   │
│ │ Summary Cards                                             │   │
│ │ ┌──────────┐ ┌──────────┐ ┌──────────┐                   │   │
│ │ │ Total    │ │ Paid     │ │Outstanding│                  │   │
│ │ │ 245,000  │ │ 180,000  │ │ 65,000   │                   │   │
│ │ └──────────┘ └──────────┘ └──────────┘                   │   │
│ └───────────────────────────────────────────────────────────┘   │
│                                                                 │
│ ┌─────────────────────────────────────────────────────────────┐ │
│ │ Filters: [Status ▼] [Date Range] [Customer]  [Search...] │ │
│ └─────────────────────────────────────────────────────────────┘ │
│                                                                 │
│ ┌─────────────────────────────────────────────────────────────┐ │
│ │ Invoices Table                                              │ │
│ │ ┌─────────────────────────────────────────────────────────┐ │ │
│ │ │ Invoice# │ Customer │ Date   │ Amount  │ Status │ Act  │ │ │
│ │ ├─────────────────────────────────────────────────────────┤ │ │
│ │ │ INV-1001 │ John Doe │ Jan 24 │ 25,000  │ [Paid] │ ... │ │ │
│ │ │ INV-1002 │ Jane S.  │ Jan 23 │ 15,000  │ [Sent] │ ... │ │ │
│ │ └─────────────────────────────────────────────────────────┘ │ │
│ │ Pagination: [←] Page 1 of 5 [→]                            │ │
│ └─────────────────────────────────────────────────────────────┘ │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Expected Outcome
- Complete invoices list page
- All sections properly positioned
- Data fetching working
- Filters functional
- Pagination working
- Loading and empty states

### Verification Checklist
- [ ] Page route created
- [ ] All components imported
- [ ] Layout renders correctly
- [ ] Data fetches on load
- [ ] Filters update results
- [ ] Pagination works
- [ ] Loading states display
- [ ] Empty state shows
- [ ] Breadcrumb navigation works
- [ ] Metadata configured

---

## Task 50: Create Invoices Header

### Overview
Create the InvoicesHeader component displaying the page title and primary action button to create new invoices. This header provides quick access to invoice creation and shows the total count of invoices.

### Dependencies
- Task 49: Create Invoices List Page
- Button component

### Instructions

1. **Create header component file**
   - Navigate to `frontend/components/modules/sales/Invoices/` directory
   - Create file `InvoicesHeader.tsx`

2. **Build header layout**
   - Create flex container with space-between
   - Left side: Title and count
   - Right side: Create button
   - Responsive stacking on mobile

3. **Display page title**
   - Show "Invoices" as main heading
   - Use large font (text-2xl or text-3xl)
   - Apply bold font weight

4. **Show invoice count**
   - Display total count below title
   - Format: "X invoices"
   - Use muted color
   - Smaller font size

5. **Add Create Invoice button**
   - Primary button styling
   - Label: "Create Invoice"
   - Plus icon
   - Navigate to /invoices/new

6. **Make responsive**
   - Stack on mobile
   - Full-width button on mobile
   - Proper spacing

### Expected Outcome
- Clean header with title
- Count displays accurately
- Create button functional
- Responsive design

### Verification Checklist
- [ ] Header component created
- [ ] Title displays
- [ ] Count shows correctly
- [ ] Create button works
- [ ] Navigation functional
- [ ] Responsive on mobile

---

## Task 51: Create Invoice Summary Cards

### Overview
Create the InvoiceSummaryCards component displaying three key metrics: total invoices amount, paid invoices amount, and outstanding amount. These cards provide quick financial overview of all invoices.

### Dependencies
- Task 49: Create Invoices List Page
- Card components

### Instructions

1. **Create summary cards component file**
   - Navigate to `frontend/components/modules/sales/Invoices/` directory
   - Create file `InvoiceSummaryCards.tsx`

2. **Build three-card layout**
   - Use grid layout (3 columns desktop, 1 mobile)
   - Equal-width cards
   - Proper spacing between cards

3. **Create Total Invoices card**
   - Icon: FileText
   - Label: "Total Invoices"
   - Value: Sum of all invoice amounts (LKR)
   - Trend indicator (optional)

4. **Create Paid Invoices card**
   - Icon: CheckCircle
   - Label: "Paid"
   - Value: Sum of paid invoices (LKR)
   - Green accent color

5. **Create Outstanding card**
   - Icon: AlertCircle
   - Label: "Outstanding"
   - Value: Sum of unpaid/partial (LKR)
   - Orange/Red accent color

6. **Format currency values**
   - Use LKR formatting
   - Show thousands separator
   - Two decimal places
   - Large, prominent display

7. **Add loading skeletons**
   - Show skeleton cards while loading
   - Maintain layout structure

### Summary Cards Layout

```
┌──────────────┐ ┌──────────────┐ ┌──────────────┐
│ 📄 Total     │ │ ✓ Paid       │ │ ⚠ Outstanding│
│ Invoices     │ │              │ │              │
│              │ │              │ │              │
│ LKR 245,000  │ │ LKR 180,000  │ │ LKR 65,000   │
│              │ │              │ │              │
└──────────────┘ └──────────────┘ └──────────────┘
```

### Expected Outcome
- Three summary cards displayed
- Accurate calculations
- Proper currency formatting
- Visual hierarchy clear

### Verification Checklist
- [ ] Component created
- [ ] Three cards display
- [ ] Total calculates correctly
- [ ] Paid sum accurate
- [ ] Outstanding accurate
- [ ] LKR formatting works
- [ ] Icons display
- [ ] Loading skeletons show
- [ ] Responsive grid works

---

## Task 52: Create Invoice Filters

### Overview
Create the InvoiceFilters component providing filter controls for status, date range, and customer selection. These filters allow users to narrow down invoice results based on multiple criteria.

### Dependencies
- Task 49: Create Invoices List Page
- Filter components (Select, DatePicker)

### Instructions

1. **Create filters component file**
   - Navigate to `frontend/components/modules/sales/Invoices/` directory
   - Create file `InvoiceFilters.tsx`

2. **Build filters layout**
   - Create flex container with gap
   - Align filters horizontally
   - Stack on mobile

3. **Create Status filter**
   - Use Select component
   - Options: All, Draft, Sent, Paid, Partial, Overdue, Void
   - Default: All
   - Update on change

4. **Create Date Range filter**
   - Use DateRangePicker component
   - Allow selecting start and end dates
   - Include presets (This Month, Last Month, This Year)
   - Clear option

5. **Create Customer filter**
   - Use searchable Select component
   - Load customers from API
   - Allow typing to search
   - Clear option

6. **Add Clear All button**
   - Reset all filters to default
   - Show only when filters applied
   - Icon: X or RotateCcw

7. **Emit filter changes**
   - Call onChange callback
   - Pass filter object
   - Debounce rapid changes

### Filters Layout

```
┌─────────────────────────────────────────────────────────────┐
│ [Status: All ▼] [Date Range] [Customer] [Search...] [Clear]│
└─────────────────────────────────────────────────────────────┘
```

### Expected Outcome
- All filter controls working
- Filters update results
- Clear functionality works
- Responsive layout

### Verification Checklist
- [ ] Filters component created
- [ ] Status filter works
- [ ] Date range picker works
- [ ] Customer filter works
- [ ] Clear all works
- [ ] onChange callback fires
- [ ] Responsive on mobile

---

## Task 53: Create Invoices Table

### Overview
Create the InvoicesTable component using TanStack Table to display invoice data in a sortable, paginated table. This table shows invoice number, customer, dates, amount, status, and actions.

### Dependencies
- Task 49: Create Invoices List Page
- TanStack Table library
- InvoiceTableColumns from Task 54

### Instructions

1. **Create table component file**
   - Navigate to `frontend/components/modules/sales/Invoices/` directory
   - Create file `InvoicesTable.tsx`

2. **Set up TanStack Table**
   - Import useReactTable
   - Configure with data and columns
   - Enable sorting and pagination
   - Set up table state

3. **Render table structure**
   - TableHeader with column headers
   - TableBody with data rows
   - Sort indicators on headers
   - Clickable rows to view details

4. **Add row click handling**
   - Navigate to invoice details on click
   - Apply hover effect
   - Show cursor pointer

5. **Implement sorting**
   - Enable column sorting
   - Show sort indicators
   - Handle sort state

6. **Add pagination controls**
   - Previous/Next buttons
   - Page size selector
   - Total count display

7. **Add loading state**
   - Show skeleton rows
   - Maintain table structure

8. **Add empty state**
   - Display when no invoices
   - Show helpful message
   - Include create button

### Expected Outcome
- Functional invoices table
- Sorting working
- Pagination functional
- Row navigation working

### Verification Checklist
- [ ] Table component created
- [ ] TanStack Table configured
- [ ] Columns render correctly
- [ ] Sorting works
- [ ] Pagination works
- [ ] Row click navigates
- [ ] Loading state shows
- [ ] Empty state displays

---

## Task 54: Define Invoice Table Columns

### Overview
Define the column configuration for the invoices table including invoice number, customer, date, due date, amount, status, and actions columns with proper formatting and sorting.

### Dependencies
- Task 53: Create Invoices Table
- ColumnDef type from TanStack Table

### Instructions

1. **Create columns definition file**
   - Navigate to `frontend/components/modules/sales/Invoices/` directory
   - Create file `InvoiceTableColumns.tsx`

2. **Define Invoice Number column**
   - accessorKey: 'invoice_number'
   - Format: INV-XXXX
   - Sortable: Yes
   - Link to details page

3. **Define Customer column**
   - accessorKey: 'customer_name'
   - Sortable: Yes
   - Truncate long names

4. **Define Date column**
   - accessorKey: 'invoice_date'
   - Format: MMM dd, yyyy
   - Sortable: Yes

5. **Define Due Date column**
   - accessorKey: 'due_date'
   - Format: MMM dd, yyyy
   - Sortable: Yes
   - Highlight if overdue

6. **Define Amount column**
   - accessorKey: 'total_amount'
   - Format: LKR currency
   - Sortable: Yes
   - Right align

7. **Define Status column**
   - accessorKey: 'status'
   - Use InvoiceStatusBadge (Task 55)
   - Sortable: Yes
   - Center align

8. **Define Actions column**
   - Use InvoiceActionsCell (Task 56)
   - Not sortable
   - Right align

### Column Configuration

| Column | Width | Sortable | Format |
|--------|-------|----------|--------|
| Invoice # | 120px | Yes | INV-XXXX |
| Customer | 200px | Yes | Name |
| Date | 120px | Yes | MMM dd, yyyy |
| Due Date | 120px | Yes | MMM dd, yyyy |
| Amount | 120px | Yes | LKR X,XXX.XX |
| Status | 100px | Yes | Badge |
| Actions | 80px | No | Dropdown |

### Expected Outcome
- All columns defined
- Proper formatting applied
- Sorting configured
- Cell renderers working

### Verification Checklist
- [ ] Columns file created
- [ ] All 7 columns defined
- [ ] Invoice number links
- [ ] Customer displays
- [ ] Dates format correctly
- [ ] Amount shows LKR
- [ ] Status badge renders
- [ ] Actions cell shows
- [ ] Sorting enabled
- [ ] TypeScript types correct

---

## Task 55: Create Invoice Status Badge

### Overview
Create the InvoiceStatusBadge component displaying invoice status with appropriate color coding. Statuses include Draft, Sent, Paid, Partial, Overdue, and Void.

### Dependencies
- Task 54: Define Invoice Table Columns
- Badge component

### Instructions

1. **Create badge component file**
   - Navigate to `frontend/components/modules/sales/Invoices/` directory
   - Create file `InvoiceStatusBadge.tsx`

2. **Define status configurations**
   - Draft: Gray, FileText icon
   - Sent: Blue, Send icon
   - Paid: Green, CheckCircle icon
   - Partial: Yellow, AlertCircle icon
   - Overdue: Red, AlertTriangle icon
   - Void: Black, XCircle icon

3. **Build badge component**
   - Render Badge with variant
   - Include icon and label
   - Apply status-specific styling

4. **Add accessibility**
   - Aria-label with full status
   - Title attribute for tooltip

### Status Configurations

| Status | Color | Icon | Label |
|--------|-------|------|-------|
| draft | Gray | FileText | Draft |
| sent | Blue | Send | Sent |
| paid | Green | CheckCircle | Paid |
| partial | Yellow | AlertCircle | Partial |
| overdue | Red | AlertTriangle | Overdue |
| void | Black | XCircle | Void |

### Expected Outcome
- Status badge component
- All statuses styled correctly
- Icons display
- Accessible

### Verification Checklist
- [ ] Badge component created
- [ ] All 6 statuses supported
- [ ] Colors correct
- [ ] Icons display
- [ ] Aria attributes present
- [ ] Component typed

---

## Task 56: Create Invoice Actions Cell

### Overview
Create the InvoiceActionsCell component providing a dropdown menu with actions: View, Download PDF, Send Email, and Void. Actions are conditionally available based on invoice status.

### Dependencies
- Task 54: Define Invoice Table Columns
- DropdownMenu component

### Instructions

1. **Create actions cell component file**
   - Navigate to `frontend/components/modules/sales/Invoices/` directory
   - Create file `InvoiceActionsCell.tsx`

2. **Build dropdown menu**
   - Use MoreVertical icon as trigger
   - Include View, Download, Send, Void actions
   - Conditional availability

3. **Implement View action**
   - Navigate to invoice details
   - Always available

4. **Implement Download action**
   - Download invoice PDF
   - Available for sent/paid invoices

5. **Implement Send action**
   - Open send invoice modal
   - Available for draft/sent/overdue

6. **Implement Void action**
   - Open confirmation dialog
   - Available for draft/sent/partial
   - Destructive styling

7. **Add action handlers**
   - Handle click events
   - Show loading states
   - Display success/error toasts

### Actions Availability

| Action | Draft | Sent | Paid | Partial | Overdue | Void |
|--------|-------|------|------|---------|---------|------|
| View | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Download | ✗ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Send | ✓ | ✓ | ✗ | ✗ | ✓ | ✗ |
| Void | ✓ | ✓ | ✗ | ✓ | ✗ | ✗ |

### Expected Outcome
- Actions dropdown functional
- All actions working
- Conditional logic correct
- Navigation and handlers work

### Verification Checklist
- [ ] Actions cell created
- [ ] Dropdown renders
- [ ] View navigates
- [ ] Download works
- [ ] Send opens modal
- [ ] Void shows confirmation
- [ ] Availability logic correct
- [ ] Component typed

---

## Summary

This document covered the creation of the invoices list page with header, summary cards showing financial metrics, comprehensive filters, and a complete data table with column definitions, status badges, and action cells.

### Completed Components

1. **InvoicesListPage** - Main page layout
2. **InvoicesHeader** - Page title and create button
3. **InvoiceSummaryCards** - Financial metrics cards
4. **InvoiceFilters** - Filter controls
5. **InvoicesTable** - Data table with TanStack Table
6. **InvoiceTableColumns** - Column definitions
7. **InvoiceStatusBadge** - Status visual indicators
8. **InvoiceActionsCell** - Action dropdown menu

### Next Steps

Proceed to **Document 02** to create invoice details page, PDF preview, download, print, send invoice modal, and payment history.

---

**End of Document 01**
