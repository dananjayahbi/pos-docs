# Tasks 65-72: Quote List, Form, and Customer Selection

> **Phase:** 07 - Frontend Infrastructure & ERP Dashboard  
> **SubPhase:** 10 - Sales & Orders UI  
> **Group:** E - Quotes & Conversion  
> **Document:** 01 of 02  
> **Tasks Covered:** 65, 66, 67, 68, 69, 70, 71, 72

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Group:** [Group-D_Invoice-Management](../Group-D_Invoice-Management/)
- **→ Next Document:** [02_Tasks-73-80_Quote-Convert.md](02_Tasks-73-80_Quote-Convert.md)

---

## Document Overview

This document covers the creation of quotes list page with filters and table, new quote form with validation schema, customer selection, quote items section, and validity settings. These components establish the quote creation and management interface.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 65 | Create Quotes List Page | Low | 30 min |
| 66 | Create Quotes Header | Low | 20 min |
| 67 | Create Quote Filters | Low | 25 min |
| 68 | Create Quotes Table | Medium | 40 min |
| 69 | Define Quote Table Columns | Medium | 35 min |
| 70 | Create Quote Status Badge | Low | 20 min |
| 71 | Create New Quote Page | Medium | 40 min |
| 72 | Create Quote Form Schema | Medium | 35 min |

---

## Task 65: Create Quotes List Page

### Overview
Create the main quotes list page displaying all quotes with filters and table. Similar to orders and invoices list pages, providing comprehensive quote management interface.

### Dependencies
- Sales module routing configured
- Quote type definitions

### Instructions

1. **Create quotes page route**
   - Navigate to `frontend/app/(dashboard)/quotes/` directory
   - Create file `page.tsx`

2. **Build page structure**
   - Header with create button
   - Filters section
   - Quotes table
   - Pagination controls

3. **Set up state management**
   - Filter state (status, date, customer)
   - Pagination state
   - Sorting state

4. **Fetch quotes data**
   - Use useQuotes hook
   - Apply filters
   - Handle loading/error states

5. **Implement filter handlers**
   - Status filter callback
   - Date range filter callback
   - Customer filter callback

6. **Add breadcrumb navigation**
   - Path: Sales > Quotes
   - Position above header

### Expected Outcome
- Functional quotes list page
- All sections rendering
- Data fetching working
- Filters functional

### Verification Checklist
- [ ] Page created
- [ ] Layout renders
- [ ] Data fetches
- [ ] Filters work
- [ ] Pagination functions

---

## Task 66: Create Quotes Header

### Overview
Create QuotesHeader component with page title, quote count, and Create Quote button.

### Dependencies
- Task 65: Quotes List Page

### Instructions

1. **Create header component**
   - Navigate to `frontend/components/modules/sales/Quotes/`
   - Create file `QuotesHeader.tsx`

2. **Build header layout**
   - Title: "Quotes"
   - Count display
   - Create button

3. **Add Create Quote button**
   - Primary style
   - Plus icon
   - Navigate to /quotes/new

### Expected Outcome
- Clean header component
- Count displays
- Button navigates correctly

### Verification Checklist
- [ ] Header created
- [ ] Title shows
- [ ] Count accurate
- [ ] Button works

---

## Task 67: Create Quote Filters

### Overview
Create QuoteFilters component with status, date range, and customer filters for narrowing quote results.

### Dependencies
- Task 65: Quotes List Page
- Filter components

### Instructions

1. **Create filters component**
   - Navigate to `frontend/components/modules/sales/Quotes/`
   - Create file `QuoteFilters.tsx`

2. **Add Status filter**
   - Options: All, Draft, Sent, Accepted, Rejected, Expired
   - Select component

3. **Add Date Range filter**
   - DateRangePicker component
   - Include presets

4. **Add Customer filter**
   - Searchable select
   - Load from API

5. **Add Clear All button**
   - Reset all filters
   - Show when filters applied

### Filter Options

| Filter | Type | Options |
|--------|------|---------|
| Status | Select | All, Draft, Sent, Accepted, Rejected, Expired |
| Date | DateRange | Custom picker with presets |
| Customer | Search | Searchable customer list |

### Expected Outcome
- All filters working
- Clear functionality
- Filter changes update results

### Verification Checklist
- [ ] Filters created
- [ ] Status filter works
- [ ] Date range works
- [ ] Customer search works
- [ ] Clear all functions

---

## Task 68: Create Quotes Table

### Overview
Create QuotesTable component using TanStack Table to display quote data with sorting and pagination.

### Dependencies
- Task 65: Quotes List Page
- TanStack Table
- QuoteTableColumns (Task 69)

### Instructions

1. **Create table component**
   - Navigate to `frontend/components/modules/sales/Quotes/`
   - Create file `QuotesTable.tsx`

2. **Set up TanStack Table**
   - Configure with data and columns
   - Enable sorting
   - Enable pagination

3. **Render table structure**
   - Table header with columns
   - Table body with rows
   - Sort indicators

4. **Add row click handling**
   - Navigate to quote details
   - Apply hover effect

5. **Add pagination**
   - Previous/Next buttons
   - Page size selector

6. **Add loading/empty states**
   - Skeleton rows when loading
   - Empty message when no quotes

### Expected Outcome
- Functional quotes table
- Sorting works
- Pagination functional
- Row navigation working

### Verification Checklist
- [ ] Table created
- [ ] Data renders
- [ ] Sorting works
- [ ] Pagination works
- [ ] Row click navigates
- [ ] Loading state shows
- [ ] Empty state displays

---

## Task 69: Define Quote Table Columns

### Overview
Define column configuration for quotes table including quote number, customer, date, expiry, amount, status, and actions.

### Dependencies
- Task 68: Quotes Table
- ColumnDef type

### Instructions

1. **Create columns file**
   - Navigate to `frontend/components/modules/sales/Quotes/`
   - Create file `QuoteTableColumns.tsx`

2. **Define Quote Number column**
   - accessorKey: 'quote_number'
   - Format: QUO-XXXX
   - Sortable, linkable

3. **Define Customer column**
   - accessorKey: 'customer_name'
   - Sortable
   - Truncate long names

4. **Define Date column**
   - accessorKey: 'quote_date'
   - Format: MMM dd, yyyy
   - Sortable

5. **Define Expiry column**
   - accessorKey: 'expiry_date'
   - Format: MMM dd, yyyy
   - Sortable
   - Highlight if expired

6. **Define Amount column**
   - accessorKey: 'total_amount'
   - Format: LKR currency
   - Right align, sortable

7. **Define Status column**
   - accessorKey: 'status'
   - Use QuoteStatusBadge (Task 70)
   - Sortable

8. **Define Actions column**
   - View, Edit, Convert, Delete actions
   - Dropdown menu

### Column Configuration

| Column | Width | Sortable | Format |
|--------|-------|----------|--------|
| Quote # | 120px | Yes | QUO-XXXX |
| Customer | 200px | Yes | Name |
| Date | 120px | Yes | MMM dd, yyyy |
| Expiry | 120px | Yes | MMM dd, yyyy |
| Amount | 120px | Yes | LKR X,XXX.XX |
| Status | 100px | Yes | Badge |
| Actions | 80px | No | Dropdown |

### Expected Outcome
- All columns defined
- Formatting correct
- Sorting enabled
- Cell renderers working

### Verification Checklist
- [ ] Columns file created
- [ ] All 7 columns defined
- [ ] Quote number links
- [ ] Dates format correctly
- [ ] Amount shows LKR
- [ ] Status badge renders
- [ ] Actions dropdown shows

---

## Task 70: Create Quote Status Badge

### Overview
Create QuoteStatusBadge component displaying quote status with color coding: Draft, Sent, Accepted, Rejected, Expired.

### Dependencies
- Task 69: Quote Table Columns
- Badge component

### Instructions

1. **Create badge component**
   - Navigate to `frontend/components/modules/sales/Quotes/`
   - Create file `QuoteStatusBadge.tsx`

2. **Define status configurations**
   - Draft: Gray, FileText icon
   - Sent: Blue, Send icon
   - Accepted: Green, CheckCircle icon
   - Rejected: Red, XCircle icon
   - Expired: Orange, Clock icon

3. **Build badge component**
   - Render Badge with variant
   - Include icon and label
   - Apply status-specific styling

4. **Add accessibility**
   - Aria-label
   - Title attribute

### Status Configurations

| Status | Color | Icon | Label |
|--------|-------|------|-------|
| draft | Gray | FileText | Draft |
| sent | Blue | Send | Sent |
| accepted | Green | CheckCircle | Accepted |
| rejected | Red | XCircle | Rejected |
| expired | Orange | Clock | Expired |

### Expected Outcome
- Status badge component
- All statuses styled
- Icons display
- Accessible

### Verification Checklist
- [ ] Badge created
- [ ] All 5 statuses supported
- [ ] Colors correct
- [ ] Icons display
- [ ] Aria attributes present

---

## Task 71: Create New Quote Page

### Overview
Create the new quote page with form for creating quotes including customer selection, items, validity period, and terms.

### Dependencies
- Quote routing configured
- QuoteForm components (Tasks 72-76)

### Instructions

1. **Create new quote page route**
   - Navigate to `frontend/app/(dashboard)/quotes/new/` directory
   - Create file `page.tsx`

2. **Build page structure**
   - Page header with title
   - Quote form sections:
     - Customer selection (Task 73)
     - Quote items (Task 74)
     - Validity section (Task 75)
   - Action buttons (Save, Send)

3. **Initialize form**
   - Use React Hook Form
   - Apply validation schema (Task 72)
   - Set default values

4. **Implement form submission**
   - Validate all sections
   - Call create quote API
   - Handle success/error
   - Navigate to quote details

5. **Add breadcrumb**
   - Path: Sales > Quotes > New Quote
   - Position above header

### Page Layout

```
┌─────────────────────────────────┐
│ New Quote                       │
├─────────────────────────────────┤
│                                 │
│ ┌─────────────────────────────┐ │
│ │ Customer Selection          │ │
│ └─────────────────────────────┘ │
│                                 │
│ ┌─────────────────────────────┐ │
│ │ Quote Items                 │ │
│ └─────────────────────────────┘ │
│                                 │
│ ┌─────────────────────────────┐ │
│ │ Validity & Terms            │ │
│ └─────────────────────────────┘ │
│                                 │
│ [Cancel] [Save Draft] [Send]    │
│                                 │
└─────────────────────────────────┘
```

### Expected Outcome
- New quote page functional
- Form renders correctly
- Sections organized
- Submission works

### Verification Checklist
- [ ] Page route created
- [ ] Layout renders
- [ ] Form initializes
- [ ] All sections display
- [ ] Submission works
- [ ] Validation applies
- [ ] Navigation functional

---

## Task 72: Create Quote Form Schema

### Overview
Create Zod validation schema for quote form ensuring all required fields are validated with proper constraints.

### Dependencies
- Task 71: New Quote Page
- Zod validation library

### Instructions

1. **Create validation schema file**
   - Navigate to `frontend/lib/validations/` directory
   - Create file `quote.ts`

2. **Define quote schema**
   - customer_id: Required UUID
   - items: Array, min 1 item
   - expiry_date: Required, future date
   - terms: Optional string
   - notes: Optional string

3. **Define quote item schema**
   - product_id: Required UUID
   - variant_id: Optional UUID
   - quantity: Required, min 1
   - unit_price: Required, > 0
   - discount: Optional, 0-100%

4. **Add custom validations**
   - Expiry date must be future
   - At least one item required
   - Valid price calculations

5. **Export schema**
   - Export quoteSchema
   - Export quoteItemSchema
   - Export TypeScript types

### Schema Structure

```typescript
quoteSchema = z.object({
  customer_id: z.string().uuid(),
  items: z.array(quoteItemSchema).min(1),
  expiry_date: z.date().min(tomorrow),
  validity_days: z.number().min(1).max(365),
  terms: z.string().optional(),
  notes: z.string().optional()
});

quoteItemSchema = z.object({
  product_id: z.string().uuid(),
  variant_id: z.string().uuid().optional(),
  quantity: z.number().min(1),
  unit_price: z.number().positive(),
  discount_percentage: z.number().min(0).max(100)
});
```

### Validation Rules

| Field | Rule | Message |
|-------|------|---------|
| customer_id | Required, UUID | "Customer is required" |
| items | Min 1 item | "Add at least one item" |
| expiry_date | Future date | "Expiry must be in future" |
| quantity | Min 1 | "Quantity must be at least 1" |
| unit_price | Positive | "Price must be positive" |

### Expected Outcome
- Validation schema created
- All fields validated
- Custom rules working
- Types exported

### Verification Checklist
- [ ] Schema file created
- [ ] quoteSchema defined
- [ ] quoteItemSchema defined
- [ ] Custom validations added
- [ ] Types exported
- [ ] Validation messages clear

---

## Summary

This document covered the creation of quotes list page with filters and table, quote form structure, validation schema, and supporting components for quote management.

### Completed Components

1. **QuotesListPage** - Main list page
2. **QuotesHeader** - Page header
3. **QuoteFilters** - Filter controls
4. **QuotesTable** - Data table
5. **QuoteTableColumns** - Column definitions
6. **QuoteStatusBadge** - Status indicators
7. **NewQuotePage** - Quote creation page
8. **QuoteFormSchema** - Validation schema

### Next Steps

Proceed to **Document 02** to create customer selection, quote items section, validity settings, quote details page, and quote-to-order conversion.

---

**End of Document 01**
