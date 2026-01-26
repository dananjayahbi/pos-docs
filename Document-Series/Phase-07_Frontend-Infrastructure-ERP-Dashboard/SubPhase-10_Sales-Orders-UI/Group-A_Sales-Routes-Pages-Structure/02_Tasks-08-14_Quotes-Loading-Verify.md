# Tasks 08-14: Quotes Routes, Loading States & Verification

> **Phase:** 07 - Frontend Infrastructure & ERP Dashboard  
> **SubPhase:** 10 - Sales & Orders UI  
> **Group:** A - Sales Routes & Pages Structure  
> **Document:** 02 of 02  
> **Tasks Covered:** 08, 09, 10, 11, 12, 13, 14

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [01_Tasks-01-07_Sales-Routes.md](01_Tasks-01-07_Sales-Routes.md)

---

## Document Overview

This document completes the sales module route structure by implementing the quotes functionality, configuring page metadata for SEO, creating loading states for asynchronous operations, implementing error boundaries for graceful error handling, and verifying the entire route structure. These final tasks ensure a professional, user-friendly experience with proper loading indicators, error handling, and optimized search engine visibility.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 08 | Create Quotes List Page Route | Low | 25 min |
| 09 | Create Quote Details Page Route | Low | 25 min |
| 10 | Create New Quote Page Route | Low | 25 min |
| 11 | Configure Page Metadata | Low | 30 min |
| 12 | Create Sales Loading States | Low | 35 min |
| 13 | Create Sales Error Boundaries | Medium | 40 min |
| 14 | Verify Route Structure | Low | 30 min |

---

## Task 08: Create Quotes List Page Route

### Overview
Create the quotes listing page that displays all quotes in a searchable, filterable table. This page serves as the main entry point for the quotes module, showing quote status, customer information, amounts, and action buttons for viewing, editing, or converting quotes to orders.

### Dependencies
- Task 01: Create Sales Route Directories
- SubPhase-09 (Products & Inventory UI) for understanding list patterns

### Instructions

1. **Create the quotes page file**
   - Navigate to `frontend/app/(dashboard)/quotes/` directory
   - Create new file named `page.tsx`
   - This becomes the route for `/quotes`

2. **Import required dependencies**
   - Import React and Next.js types
   - Import layout components (Page, PageHeader, PageContent)
   - Import data table components from UI library
   - Import quote-related types and interfaces

3. **Define page metadata**
   - Set page title to "Quotes | LankaCommerce Cloud"
   - Add description for SEO purposes
   - Configure Open Graph tags if applicable

4. **Create async page component**
   - Define async function component `QuotesPage`
   - Accept searchParams prop for URL query parameters
   - Use searchParams to handle filtering and pagination

5. **Implement data fetching logic**
   - Fetch quotes data from API using Server Component pattern
   - Apply filters based on searchParams (status, customer, date range)
   - Handle pagination parameters (page, limit)
   - Implement proper error handling for failed requests

6. **Design page header section**
   - Add page title "Quotes"
   - Include quote count or summary statistics
   - Add "Create Quote" button linking to `/quotes/new`
   - Include optional breadcrumb navigation

7. **Implement filter controls**
   - Status filter (Draft, Sent, Accepted, Rejected, Expired)
   - Customer search/select filter
   - Date range filter (created date, expiry date)
   - Amount range filter (min/max)
   - Clear filters button

8. **Create quotes data table**
   - Define columns: Quote Number, Customer, Date, Expiry Date, Amount, Status, Actions
   - Implement sortable columns where appropriate
   - Add row actions: View Details, Edit, Convert to Order, Delete
   - Show empty state when no quotes exist

9. **Add pagination controls**
   - Implement pagination component at bottom of table
   - Show current page, total pages, and total quote count
   - Include page size selector (10, 25, 50, 100)
   - Use URL-based pagination for browser history support

10. **Implement responsive design**
    - Table should scroll horizontally on mobile devices
    - Consider card-based layout for very small screens
    - Ensure filter controls stack properly on mobile

### Quote Status Options

| Status | Color | Description |
|--------|-------|-------------|
| Draft | Gray | Quote being prepared |
| Sent | Blue | Quote sent to customer |
| Accepted | Green | Customer accepted quote |
| Rejected | Red | Customer rejected quote |
| Expired | Orange | Quote past expiry date |

### Table Columns

| Column | Sortable | Width | Content |
|--------|----------|-------|---------|
| Quote # | Yes | 120px | QUO-001, QUO-002, etc. |
| Customer | Yes | 200px | Customer name |
| Date | Yes | 110px | Created date (formatted) |
| Expiry | Yes | 110px | Expiry date (formatted) |
| Amount | Yes | 130px | Total amount with currency |
| Status | Yes | 120px | Status badge |
| Actions | No | 100px | Action buttons/menu |

### Filter Configuration

```
Filters Panel
├── Status Filter (Multi-select dropdown)
│   ├── Draft
│   ├── Sent
│   ├── Accepted
│   ├── Rejected
│   └── Expired
├── Customer Filter (Searchable select)
├── Date Range Filter (Date picker)
│   ├── Start Date
│   └── End Date
└── Amount Range Filter
    ├── Min Amount
    └── Max Amount
```

### Row Actions

| Action | Icon | Condition | Destination |
|--------|------|-----------|-------------|
| View Details | Eye | Always | `/quotes/[id]` |
| Edit | Pencil | Status: Draft | `/quotes/[id]` (edit mode) |
| Convert to Order | ShoppingCart | Status: Accepted | `/orders/new?from=QUO-XXX` |
| Duplicate | Copy | Always | `/quotes/new?duplicate=QUO-XXX` |
| Delete | Trash | Status: Draft | Delete confirmation modal |

### Empty State

```
┌─────────────────────────────────────┐
│                                     │
│        [No Quotes Icon]             │
│                                     │
│     No quotes found                 │
│     Create your first quote to      │
│     get started                     │
│                                     │
│     [+ Create Quote Button]         │
│                                     │
└─────────────────────────────────────┘
```

### Expected Outcome
- Functional quotes listing page at `/quotes`
- Searchable and filterable data table
- Proper pagination controls
- Responsive design for all devices
- Action buttons for viewing and managing quotes

### Verification Checklist
- [ ] `frontend/app/(dashboard)/quotes/page.tsx` file created
- [ ] Page accessible at `/quotes` route
- [ ] Data table displays quote information
- [ ] Filters work correctly (status, customer, date, amount)
- [ ] Pagination functions properly
- [ ] "Create Quote" button navigates to `/quotes/new`
- [ ] Row actions (view, edit, convert, delete) work
- [ ] Empty state displays when no quotes exist
- [ ] Responsive design on mobile and tablet
- [ ] Loading states handled appropriately

---

## Task 09: Create Quote Details Page Route

### Overview
Create the dynamic quote details page that displays comprehensive information about a specific quote. This page shows quote header information, line items with products and pricing, customer details, terms and conditions, notes, and actions for editing, sending, converting to order, or downloading as PDF.

### Dependencies
- Task 08: Create Quotes List Page Route
- Task 01: Create Sales Route Directories (for [id] directory)

### Instructions

1. **Create the quote details page file**
   - Navigate to `frontend/app/(dashboard)/quotes/[id]/` directory
   - Create new file named `page.tsx`
   - This creates dynamic route for `/quotes/[id]`

2. **Import required dependencies**
   - Import React and Next.js types
   - Import layout components
   - Import quote display components
   - Import quote-related types and interfaces
   - Import PDF generation utilities (if applicable)

3. **Define page props interface**
   - Create `QuoteDetailsPageProps` interface
   - Include params prop with id parameter
   - Include searchParams for optional query parameters

4. **Create async page component**
   - Define async function `QuoteDetailsPage`
   - Extract quote ID from params
   - Fetch quote data using Server Component pattern

5. **Implement quote data fetching**
   - Fetch quote details from API endpoint
   - Include related data (customer, line items, products)
   - Handle 404 if quote not found
   - Implement proper error handling

6. **Design quote header section**
   - Display quote number prominently
   - Show quote status badge
   - Include created date and expiry date
   - Add customer name and contact information
   - Show quote validity period indicator

7. **Create action buttons section**
   - Edit button (if status is Draft)
   - Send to Customer button (if status is Draft)
   - Convert to Order button (if status is Accepted)
   - Download PDF button
   - Duplicate Quote button
   - Delete button (if status is Draft)

8. **Implement quote summary section**
   - Display quote metadata (dates, reference numbers)
   - Show customer billing and shipping addresses
   - Include payment terms
   - Display delivery terms
   - Show salesperson/agent information

9. **Create line items table**
   - Columns: Item, Description, Quantity, Unit Price, Tax, Discount, Total
   - Display all products/services in the quote
   - Show line-level notes if any
   - Highlight any special pricing or discounts

10. **Implement pricing breakdown**
    - Subtotal (sum of line items)
    - Tax breakdown by rate (if multiple tax rates)
    - Discount amount (if applicable)
    - Shipping/delivery charges (if applicable)
    - Grand total (prominent display)

11. **Add terms and conditions section**
    - Display quote-specific terms
    - Include payment terms
    - Show return/refund policy
    - Include validity period and conditions

12. **Create notes and attachments section**
    - Internal notes (visible only to staff)
    - Customer notes (visible on PDF)
    - File attachments (if supported)
    - Quote history/activity log

13. **Implement related information section**
    - Show converted order (if quote was accepted and converted)
    - Display related quotes (versions, duplicates)
    - Link to customer details page
    - Show sales pipeline stage (if applicable)

14. **Add responsive design**
    - Stack sections vertically on mobile
    - Ensure tables scroll horizontally if needed
    - Optimize button layouts for touch screens

### Quote Header Layout

```
┌────────────────────────────────────────────────┐
│ Quote #QUO-001              [Status Badge]     │
│ Customer: ABC Company                          │
│ Created: Jan 15, 2026  |  Expires: Feb 15     │
│                                                │
│ [Edit] [Send] [Convert] [PDF] [Duplicate]     │
└────────────────────────────────────────────────┘
```

### Quote Information Sections

| Section | Content | Priority |
|---------|---------|----------|
| Header | Quote #, Status, Customer, Dates | High |
| Actions | Edit, Send, Convert, PDF, etc. | High |
| Summary | Addresses, Terms, Salesperson | Medium |
| Line Items | Product table with pricing | High |
| Pricing | Subtotal, Tax, Discount, Total | High |
| Terms | Terms and conditions text | Medium |
| Notes | Internal and customer notes | Low |
| Related | Converted order, history | Low |

### Line Items Table

| Column | Content | Alignment | Width |
|--------|---------|-----------|-------|
| Item | Product code/name | Left | 250px |
| Description | Product description | Left | 300px |
| Quantity | Number with unit | Right | 100px |
| Unit Price | Price per unit | Right | 120px |
| Tax | Tax percentage | Right | 80px |
| Discount | Discount amount/% | Right | 100px |
| Total | Line total | Right | 130px |

### Pricing Breakdown

```
┌────────────────────────────────┐
│  Subtotal:          ₨10,000.00 │
│  Tax (10%):          ₨1,000.00 │
│  Discount (5%):       -₨500.00 │
│  Shipping:              ₨50.00 │
│  ──────────────────────────── │
│  TOTAL:             ₨10,550.00 │
└────────────────────────────────┘
```

### Action Button Behavior

| Action | Condition | Result |
|--------|-----------|--------|
| Edit | Status = Draft | Navigate to edit mode |
| Send | Status = Draft | Open send modal, update status |
| Convert | Status = Accepted | Create order, navigate to `/orders/new` |
| PDF | Always | Download/preview PDF |
| Duplicate | Always | Create copy, navigate to edit |
| Delete | Status = Draft | Confirmation modal, delete, redirect |

### Status-Based Actions

```
Draft Quote
├── Edit ✓
├── Send ✓
├── Convert ✗
└── Delete ✓

Sent Quote
├── Edit ✗
├── Send ✓ (Resend)
├── Convert ✗
└── Delete ✗

Accepted Quote
├── Edit ✗
├── Send ✗
├── Convert ✓
└── Delete ✗

Expired Quote
├── Edit ✗
├── Send ✗
├── Convert ✗
└── Delete ✓ (with warning)
```

### Expected Outcome
- Functional quote details page at `/quotes/[id]`
- Complete quote information displayed
- Contextual action buttons based on quote status
- Detailed line items with pricing
- Professional layout suitable for printing/PDF
- Related information and history visible

### Verification Checklist
- [ ] `frontend/app/(dashboard)/quotes/[id]/page.tsx` file created
- [ ] Page accessible at `/quotes/QUO-001` (example)
- [ ] Quote header displays number, status, customer, dates
- [ ] Action buttons render based on quote status
- [ ] Customer information displays correctly
- [ ] Line items table shows all products
- [ ] Pricing breakdown calculates correctly
- [ ] Terms and conditions display properly
- [ ] Notes and attachments visible
- [ ] Edit button navigates to edit mode
- [ ] PDF download works (if implemented)
- [ ] Convert to Order creates order correctly
- [ ] 404 error for non-existent quote IDs
- [ ] Responsive design on all devices

---

## Task 10: Create New Quote Page Route

### Overview
Create the new quote creation page with a comprehensive form for building quotes. This page includes customer selection, product/service line items, pricing calculations, terms configuration, and quote options. The interface supports adding multiple line items, applying discounts, calculating taxes, and saving quotes as drafts or sending them directly to customers.

### Dependencies
- Task 08: Create Quotes List Page Route
- Task 01: Create Sales Route Directories (for new/ subdirectory)
- SubPhase-05 (Form Components & Validation) for form patterns

### Instructions

1. **Create the new quote page file**
   - Navigate to `frontend/app/(dashboard)/quotes/new/` directory
   - Create new file named `page.tsx`
   - This creates route for `/quotes/new`

2. **Import required dependencies**
   - Import React, useState, useForm hooks
   - Import form components (inputs, selects, date pickers)
   - Import product search/select components
   - Import pricing calculation utilities
   - Import quote creation API functions

3. **Define quote form data structure**
   - Create interface for quote form data
   - Include customer information
   - Include line items array
   - Include pricing and discount fields
   - Include terms and notes fields
   - Include quote settings (validity period, etc.)

4. **Create page component with form state**
   - Define `NewQuotePage` component
   - Initialize form state with default values
   - Set up form validation rules
   - Implement form submission handler

5. **Design page header section**
   - Display "Create New Quote" title
   - Include breadcrumb navigation
   - Add form action buttons (Save Draft, Send, Cancel)
   - Show form status indicator

6. **Implement customer selection section**
   - Create searchable customer dropdown
   - Include "Add New Customer" quick action
   - Display selected customer details
   - Show billing and shipping addresses
   - Allow address editing if needed

7. **Create quote details section**
   - Quote number (auto-generated or manual)
   - Quote date (default: today, editable)
   - Expiry date (default: +30 days, editable)
   - Reference number (optional)
   - Salesperson selection
   - Currency selection

8. **Implement line items builder**
   - Product/service search and select
   - Quantity input with increment/decrement
   - Unit price input (editable)
   - Tax rate selection per line
   - Discount input (amount or percentage)
   - Line description/notes field
   - Remove line button
   - Add line button
   - Reorder lines functionality (drag and drop)

9. **Create pricing calculations panel**
   - Real-time subtotal calculation
   - Tax calculation (sum of line taxes)
   - Discount application (line and quote level)
   - Shipping/handling charges input
   - Grand total display (prominent)
   - Currency formatting

10. **Add terms and conditions section**
    - Payment terms selection (Net 30, Net 60, etc.)
    - Delivery terms input
    - Warranty information
    - Return policy
    - Custom terms textarea
    - Template selection for common terms

11. **Implement notes section**
    - Internal notes (not visible to customer)
    - Customer notes (visible on quote and PDF)
    - Attachments upload (if supported)

12. **Create form actions section**
    - Save as Draft button (validates and saves)
    - Send to Customer button (validates, saves, sends email)
    - Cancel button (confirmation if unsaved changes)
    - Form validation error display

13. **Add form validation**
    - Required fields: Customer, at least one line item
    - Date validation (expiry must be after quote date)
    - Quantity validation (must be positive)
    - Price validation (must be non-negative)
    - Total validation (must be positive)

14. **Implement duplicate quote feature**
    - Accept URL parameter `?duplicate=QUO-XXX`
    - Pre-fill form with data from existing quote
    - Clear quote number to generate new one
    - Update dates to current

### Form Layout Structure

```
┌─────────────────────────────────────────┐
│ Create New Quote          [Save] [Send] │
├─────────────────────────────────────────┤
│ 1. Customer Selection                   │
│    [Search Customer Dropdown]           │
│    Customer: ABC Company                │
│    Contact: John Doe                    │
│                                         │
│ 2. Quote Details                        │
│    Quote #: [Auto]  Date: [Today]      │
│    Expiry: [+30 days]  Ref: [Optional] │
│                                         │
│ 3. Line Items                           │
│    ┌────────────────────────────────┐  │
│    │ Product | Qty | Price | Total  │  │
│    │ Item 1  | 10  | ₨50   | ₨500   │  │
│    │ Item 2  | 5   | ₨100  | ₨500   │  │
│    └────────────────────────────────┘  │
│    [+ Add Line Item]                   │
│                                         │
│ 4. Pricing                              │
│    Subtotal:     ₨1,000.00             │
│    Tax (10%):      ₨100.00             │
│    Total:        ₨1,100.00             │
│                                         │
│ 5. Terms & Conditions                   │
│    [Terms textarea]                     │
│                                         │
│ 6. Notes                                │
│    [Notes textarea]                     │
└─────────────────────────────────────────┘
```

### Form Sections

| Section | Fields | Required | Validation |
|---------|--------|----------|------------|
| Customer | Customer select | Yes | Must exist |
| Quote Info | Date, Expiry, Ref | Partial | Valid dates |
| Line Items | Product, Qty, Price | Yes | ≥1 item |
| Pricing | Subtotal, Tax, Total | Auto | Calculated |
| Terms | Payment, Delivery | No | Text length |
| Notes | Internal, Customer | No | Text length |

### Line Item Fields

| Field | Type | Required | Default | Validation |
|-------|------|----------|---------|------------|
| Product | Select | Yes | None | Must exist |
| Description | Text | No | Auto-fill | Max 500 chars |
| Quantity | Number | Yes | 1 | > 0 |
| Unit | Text | No | "pcs" | Max 20 chars |
| Unit Price | Currency | Yes | Product price | ≥ 0 |
| Tax Rate | Select | No | Default rate | Valid % |
| Discount | Number/% | No | 0 | ≥ 0 |
| Total | Currency | Auto | Calculated | Display only |

### Pricing Calculation Logic

```
Line Total = (Quantity × Unit Price) - Line Discount

Line Tax = Line Total × (Tax Rate / 100)

Subtotal = Sum of all Line Totals

Total Tax = Sum of all Line Taxes

Quote Discount = Subtotal × (Quote Discount % / 100)
                or Quote Discount Amount

Grand Total = Subtotal + Total Tax - Quote Discount + Shipping
```

### Form Actions

| Button | Action | Validation | Result |
|--------|--------|------------|--------|
| Save Draft | Save without sending | Basic | Quote saved, redirect to details |
| Send to Customer | Save and send email | Full | Quote sent, status updated |
| Cancel | Discard changes | Confirm if dirty | Return to quotes list |
| Add Line | Add new line item | None | New row in table |
| Remove Line | Remove line item | Min 1 line | Delete row |

### Validation Rules

| Field | Rule | Error Message |
|-------|------|---------------|
| Customer | Required | "Please select a customer" |
| Line Items | Min 1 | "Add at least one line item" |
| Quantity | > 0 | "Quantity must be positive" |
| Unit Price | ≥ 0 | "Price cannot be negative" |
| Expiry Date | > Quote Date | "Expiry must be after quote date" |
| Total | > 0 | "Quote total must be positive" |

### Expected Outcome
- Functional quote creation form at `/quotes/new`
- Customer selection with search
- Dynamic line item builder
- Real-time pricing calculations
- Terms and notes configuration
- Save and send functionality
- Form validation with helpful error messages

### Verification Checklist
- [ ] `frontend/app/(dashboard)/quotes/new/page.tsx` file created
- [ ] Page accessible at `/quotes/new` route
- [ ] Customer selection dropdown works
- [ ] Line items can be added and removed
- [ ] Product search/selection functional
- [ ] Quantity and price inputs work correctly
- [ ] Pricing calculations update in real-time
- [ ] Tax calculations correct
- [ ] Discount application works
- [ ] Terms and notes can be entered
- [ ] Save Draft button creates quote
- [ ] Send button validates and sends quote
- [ ] Cancel button returns to list
- [ ] Form validation shows errors clearly
- [ ] Duplicate quote feature works (`?duplicate=QUO-XXX`)
- [ ] Success message shows after save
- [ ] Redirects to quote details after creation

---

## Task 11: Configure Page Metadata

### Overview
Configure metadata for all sales module pages to optimize SEO, improve social media sharing, and provide better browser tab information. Metadata includes page titles, descriptions, Open Graph tags, and Twitter Card information, ensuring professional presentation across all platforms.

### Dependencies
- Tasks 01-10: All route pages must be created

### Instructions

1. **Understand Next.js metadata system**
   - Review Next.js App Router metadata API
   - Understand static vs dynamic metadata
   - Learn metadata inheritance and merging

2. **Define metadata for Orders List page**
   - Navigate to `frontend/app/(dashboard)/orders/page.tsx`
   - Export metadata object or generateMetadata function
   - Set title: "Orders | LankaCommerce Cloud"
   - Set description: "Manage and track all customer orders"
   - Configure Open Graph properties

3. **Define metadata for Order Details page**
   - Navigate to `frontend/app/(dashboard)/orders/[id]/page.tsx`
   - Use generateMetadata async function (for dynamic titles)
   - Fetch order number for dynamic title
   - Set title: "Order #ORD-XXX | LankaCommerce Cloud"
   - Set description with order details

4. **Define metadata for New Order page**
   - Navigate to `frontend/app/(dashboard)/orders/new/page.tsx`
   - Export metadata object
   - Set title: "Create New Order | LankaCommerce Cloud"
   - Set description: "Create a new customer order"

5. **Define metadata for Invoices List page**
   - Navigate to `frontend/app/(dashboard)/invoices/page.tsx`
   - Export metadata object
   - Set title: "Invoices | LankaCommerce Cloud"
   - Set description: "View and manage all invoices"

6. **Define metadata for Invoice Details page**
   - Navigate to `frontend/app/(dashboard)/invoices/[id]/page.tsx`
   - Use generateMetadata async function
   - Set title: "Invoice #INV-XXX | LankaCommerce Cloud"
   - Set description with invoice details

7. **Define metadata for Quotes List page**
   - Navigate to `frontend/app/(dashboard)/quotes/page.tsx`
   - Export metadata object
   - Set title: "Quotes | LankaCommerce Cloud"
   - Set description: "Manage sales quotes and proposals"

8. **Define metadata for Quote Details page**
   - Navigate to `frontend/app/(dashboard)/quotes/[id]/page.tsx`
   - Use generateMetadata async function
   - Set title: "Quote #QUO-XXX | LankaCommerce Cloud"
   - Set description with quote details

9. **Define metadata for New Quote page**
   - Navigate to `frontend/app/(dashboard)/quotes/new/page.tsx`
   - Export metadata object
   - Set title: "Create New Quote | LankaCommerce Cloud"
   - Set description: "Create a new sales quote"

10. **Add Open Graph metadata**
    - Configure OG title (same as page title)
    - Set OG description (same as page description)
    - Add OG type: "website"
    - Include OG site name: "LankaCommerce Cloud"
    - Add OG image if applicable (logo or default image)

11. **Add Twitter Card metadata**
    - Set Twitter card type: "summary"
    - Configure Twitter title and description
    - Add Twitter image if applicable

12. **Configure robots metadata**
    - For public pages: allow indexing
    - For authenticated pages: noindex (dashboard pages)
    - Set appropriate follow/nofollow directives

13. **Test metadata rendering**
    - Verify titles appear in browser tabs
    - Check meta tags in page source
    - Test with social media debuggers
    - Confirm dynamic metadata generates correctly

### Metadata Structure

| Page | Title | Description |
|------|-------|-------------|
| Orders List | Orders \| LCC | Manage and track all customer orders |
| Order Details | Order #ORD-XXX \| LCC | View details for order #ORD-XXX |
| New Order | Create New Order \| LCC | Create a new customer order |
| Invoices List | Invoices \| LCC | View and manage all invoices |
| Invoice Details | Invoice #INV-XXX \| LCC | View invoice #INV-XXX details |
| Quotes List | Quotes \| LCC | Manage sales quotes and proposals |
| Quote Details | Quote #QUO-XXX \| LCC | View quote #QUO-XXX details |
| New Quote | Create New Quote \| LCC | Create a new sales quote |

### Expected Outcome
- All sales pages have proper metadata configured
- Browser tabs show descriptive titles
- SEO descriptions improve search visibility
- Social media sharing displays correct information
- Dynamic pages show specific entity information
- Robots directives prevent indexing of authenticated pages

### Verification Checklist
- [ ] Orders list page metadata configured
- [ ] Order details page uses dynamic metadata
- [ ] New order page metadata configured
- [ ] Invoices list page metadata configured
- [ ] Invoice details page uses dynamic metadata
- [ ] Quotes list page metadata configured
- [ ] Quote details page uses dynamic metadata
- [ ] New quote page metadata configured
- [ ] Browser tabs show correct titles
- [ ] Meta tags visible in page source
- [ ] Open Graph tags present
- [ ] Robots directives set correctly
- [ ] Dynamic titles include entity numbers

---

## Task 12: Create Sales Loading States

### Overview
Implement loading state indicators for all sales module pages using Next.js Suspense and loading.tsx files. Loading states provide visual feedback during data fetching operations, improving perceived performance and user experience. Create skeleton loaders that match the layout of each page type.

### Dependencies
- Tasks 01-10: All route pages must be created

### Instructions

1. **Understand Next.js loading states**
   - Review Next.js loading.tsx convention
   - Understand Suspense boundary behavior
   - Learn skeleton loader patterns

2. **Create Orders loading state**
   - Navigate to `frontend/app/(dashboard)/orders/` directory
   - Create new file named `loading.tsx`
   - Export default loading component

3. **Design Orders list skeleton loader**
   - Create skeleton for page header
   - Create skeleton for filter controls
   - Create skeleton data table with placeholder rows
   - Include skeleton pagination controls

4. **Create Order details loading state**
   - Navigate to `frontend/app/(dashboard)/orders/[id]/` directory
   - Create `loading.tsx` file

5. **Create Invoices loading state**
   - Navigate to `frontend/app/(dashboard)/invoices/` directory
   - Create `loading.tsx` file

6. **Create Invoice details loading state**
   - Navigate to `frontend/app/(dashboard)/invoices/[id]/` directory
   - Create `loading.tsx` file

7. **Create Quotes loading state**
   - Navigate to `frontend/app/(dashboard)/quotes/` directory
   - Create `loading.tsx` file

8. **Create Quote details loading state**
   - Navigate to `frontend/app/(dashboard)/quotes/[id]/` directory
   - Create `loading.tsx` file

### Expected Outcome
- Loading states for all sales pages
- Skeleton loaders match actual page layouts
- Smooth loading experience
- No layout shift when data loads

### Verification Checklist
- [ ] All loading.tsx files created
- [ ] Skeleton loaders display during data fetch
- [ ] Animations smooth and consistent
- [ ] No layout shift occurs

---

## Task 13: Create Sales Error Boundaries

### Overview
Implement error boundaries for all sales module pages using Next.js error.tsx files. Error boundaries catch errors and display user-friendly messages with recovery options.

### Dependencies
- Tasks 01-10: All route pages must be created

### Instructions

1. **Understand Next.js error boundaries**
   - Review error.tsx convention
   - Mark files as 'use client'

2. **Create error boundaries for each route**
   - Create error.tsx in orders/, orders/[id]/, invoices/, invoices/[id]/, quotes/, quotes/[id]/
   - Handle 404 and generic errors
   - Provide retry and navigation options

### Expected Outcome
- Error boundaries for all sales pages
- User-friendly error messages
- Recovery options working

### Verification Checklist
- [ ] All error.tsx files created
- [ ] Error UI displays correctly
- [ ] Retry functionality works
- [ ] Navigation links work

---

## Task 14: Verify Route Structure

### Overview
Perform comprehensive verification of the entire sales module route structure to ensure all routes, loading states, error boundaries, and navigation work correctly.

### Dependencies
- Tasks 01-13: All previous tasks complete

### Instructions

1. **Test all routes**
   - Navigate to each page
   - Test dynamic routes with IDs
   - Test 404 scenarios

2. **Verify loading states**
   - Throttle network
   - Confirm skeletons display

3. **Test error boundaries**
   - Simulate API failures
   - Test error recovery

4. **Check metadata**
   - Verify browser tab titles
   - Check meta tags

5. **Document results**
   - Create verification checklist
   - Note any issues

### Verification Checklist
- [ ] All routes accessible
- [ ] Loading states work
- [ ] Error boundaries functional
- [ ] Metadata correct
- [ ] Navigation flows work
- [ ] Responsive on all devices

---

## Summary

This document completed Group A by implementing quotes routes, configuring metadata, creating loading states, implementing error boundaries, and verifying the entire route structure. The sales module foundation is now complete and ready for feature development.

---

**End of Document 02 - Group A Complete**
