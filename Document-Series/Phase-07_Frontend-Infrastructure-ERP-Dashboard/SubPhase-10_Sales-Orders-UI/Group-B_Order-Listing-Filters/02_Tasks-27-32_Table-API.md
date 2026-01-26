# Tasks 27-32: Orders Table and API Connection

> **Phase:** 07 - Frontend Infrastructure & ERP Dashboard  
> **SubPhase:** 10 - Sales & Orders UI  
> **Group:** B - Order Listing & Filters  
> **Document:** 02 of 02  
> **Tasks Covered:** 27, 28, 29, 30, 31, 32

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [01_Tasks-15-26_Page-Cards-Filters.md](01_Tasks-15-26_Page-Cards-Filters.md)
- **→ Next Group:** [Group-C_Order-Details-Timeline](../Group-C_Order-Details-Timeline/)

---

## Document Overview

This document covers the creation of the orders data table with TanStack Table. It establishes the table structure with column definitions, custom cell components for status badges and actions, sorting functionality, and connection to the backend API for fetching order data. The table displays order information with proper formatting, interactive elements, and performance optimizations.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 27 | Create Orders Table | Medium | 45 min |
| 28 | Define Order Table Columns | Medium | 40 min |
| 29 | Create Order Status Badge | Low | 20 min |
| 30 | Create Order Actions Cell | Low | 30 min |
| 31 | Implement Table Sorting | Medium | 35 min |
| 32 | Connect to Orders API | Medium | 40 min |

---

## Task 27: Create Orders Table

### Overview
Create the OrdersTable component using TanStack Table library. This component provides a robust data table with features like sorting, pagination, and custom cell rendering. The table serves as the primary interface for viewing and interacting with order data.

### Dependencies
- Task 15: Create Orders List Page
- SubPhase-05: Form Components & Validation (Table library setup)
- TanStack Table installed and configured

### Instructions

1. **Create table component file**
   - Navigate to `frontend/components/modules/sales/Orders/` directory
   - Create new file named `OrdersTable.tsx`
   - Set up component structure with TypeScript types

2. **Import required dependencies**
   - Import TanStack Table core functions (useReactTable, getCoreRowModel, getSortedRowModel, getPaginationRowModel)
   - Import table UI components (Table, TableHeader, TableBody, TableRow, TableCell)
   - Import order type definition
   - Import column definitions from Task 28

3. **Define component props interface**
   - Define OrdersTableProps interface
   - Include orders array (Order[] type)
   - Include isLoading boolean for loading state
   - Include onRowClick optional callback for row selection
   - Include pagination props (optional)

4. **Set up table state management**
   - Initialize sorting state with useState
   - Initialize pagination state with useState
   - Set up default page size (e.g., 10, 25, 50 options)
   - Initialize column visibility state (optional)

5. **Configure TanStack Table instance**
   - Call useReactTable hook with configuration
   - Pass orders data to data property
   - Pass columns from Task 28
   - Configure sorting, pagination, and core row models
   - Set manual pagination if using server-side pagination
   - Configure initial state with default sorting

6. **Implement table markup structure**
   - Render Table wrapper component
   - Create TableHeader with mapped header groups
   - Render TableBody with mapped rows
   - Include TableRow for each data row
   - Render TableCell for each cell with getValue()

7. **Add loading state handling**
   - Show skeleton rows when isLoading is true
   - Display loading indicator in table
   - Maintain table structure during loading

8. **Add empty state handling**
   - Check if orders array is empty
   - Display empty state message
   - Include illustration or icon
   - Add "Create Order" call-to-action button

9. **Implement row click handling**
   - Add onClick handler to TableRow
   - Call onRowClick prop with order data
   - Navigate to order details page
   - Apply hover styles for better UX

10. **Add pagination controls**
    - Render pagination component below table
    - Show current page and total pages
    - Include Previous/Next buttons
    - Add page size selector
    - Display total records count

11. **Style table responsively**
    - Apply responsive classes for mobile view
    - Use horizontal scroll for narrow screens
    - Ensure proper spacing and alignment
    - Apply zebra striping for better readability

12. **Add table accessibility**
    - Include proper ARIA labels
    - Add keyboard navigation support
    - Ensure screen reader compatibility
    - Add focus indicators

### Table Structure Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│ OrdersTable                                                         │
├─────────────────────────────────────────────────────────────────────┤
│  ┌───────────────────────────────────────────────────────────────┐ │
│  │ TableHeader                                                   │ │
│  ├──────────┬──────────┬──────────┬──────────┬──────────┬───────┤ │
│  │ Order #  │ Customer │   Date   │  Items   │  Total   │Status │ │
│  │   ↕      │    ↕     │    ↕     │          │    ↕     │   ↕   │ │
│  └──────────┴──────────┴──────────┴──────────┴──────────┴───────┘ │
│  ┌───────────────────────────────────────────────────────────────┐ │
│  │ TableBody                                                     │ │
│  ├──────────┬──────────┬──────────┬──────────┬──────────┬───────┤ │
│  │ ORD-1001 │ John Doe │ Jan 24   │    5     │ 25,000   │ [●]   │ │
│  ├──────────┼──────────┼──────────┼──────────┼──────────┼───────┤ │
│  │ ORD-1002 │ Jane S.  │ Jan 23   │    3     │ 15,500   │ [●]   │ │
│  ├──────────┼──────────┼──────────┼──────────┼──────────┼───────┤ │
│  │ ORD-1003 │ Bob M.   │ Jan 22   │    8     │ 42,300   │ [●]   │ │
│  └──────────┴──────────┴──────────┴──────────┴──────────┴───────┘ │
│  ┌───────────────────────────────────────────────────────────────┐ │
│  │ Pagination: [←] Page 1 of 10 [→]  [10 ▼] per page            │ │
│  └───────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────┘
```

### Loading State Pattern

```
┌─────────────────────────────────────────┐
│ TableHeader (Static)                    │
├──────────┬──────────┬──────────┬────────┤
│ Order #  │ Customer │   Date   │ Total  │
└──────────┴──────────┴──────────┴────────┘
┌─────────────────────────────────────────┐
│ Skeleton Row 1                          │
│ ░░░░░░░  ░░░░░░░░░  ░░░░░░░  ░░░░░░░   │
├─────────────────────────────────────────┤
│ Skeleton Row 2                          │
│ ░░░░░░░  ░░░░░░░░░  ░░░░░░░  ░░░░░░░   │
├─────────────────────────────────────────┤
│ Skeleton Row 3                          │
│ ░░░░░░░  ░░░░░░░░░  ░░░░░░░  ░░░░░░░   │
└─────────────────────────────────────────┘
```

### Expected Outcome
- Fully functional orders table component
- Clean and responsive table layout
- Proper loading and empty states
- Interactive row selection
- Pagination controls working
- Accessible table structure

### Verification Checklist
- [ ] OrdersTable component created and exported
- [ ] TanStack Table configured correctly
- [ ] Table renders with all columns
- [ ] Loading state displays skeleton
- [ ] Empty state shows appropriate message
- [ ] Row click navigation works
- [ ] Pagination controls functional
- [ ] Table is responsive on mobile
- [ ] Accessibility features implemented
- [ ] TypeScript types properly defined

---

## Task 28: Define Order Table Columns

### Overview
Define the column configuration for the orders table using TanStack Table's column definition API. This establishes the structure, formatting, and behavior of each column including order number, customer, date, items count, total amount, status, and actions.

### Dependencies
- Task 27: Create Orders Table
- Order type definitions from backend models
- Date formatting utilities

### Instructions

1. **Create columns definition file**
   - Navigate to `frontend/components/modules/sales/Orders/` directory
   - Create new file named `OrderTableColumns.tsx`
   - Import ColumnDef type from TanStack Table

2. **Import required utilities**
   - Import format function from date-fns
   - Import currency formatting utility
   - Import Order type definition
   - Import OrderStatusBadge from Task 29
   - Import OrderActionsCell from Task 30

3. **Define Order Number column**
   - Set accessorKey to 'order_number'
   - Set header text to "Order #"
   - Set fixed width to 120px
   - Enable sorting
   - Format as clickable link
   - Apply monospace font for better readability

4. **Define Customer column**
   - Set accessorKey to 'customer_name'
   - Set header text to "Customer"
   - Set width to 200px
   - Enable sorting
   - Display customer full name
   - Add truncation for long names
   - Include tooltip with full name

5. **Define Date column**
   - Set accessorKey to 'created_at'
   - Set header text to "Date"
   - Set width to 120px
   - Enable sorting
   - Format date as "MMM dd, yyyy"
   - Add tooltip with full timestamp

6. **Define Items Count column**
   - Set accessorKey to 'items_count'
   - Set header text to "Items"
   - Set width to 80px
   - Disable sorting
   - Center align content
   - Format as integer number

7. **Define Total Amount column**
   - Set accessorKey to 'total_amount'
   - Set header text to "Total"
   - Set width to 120px
   - Enable sorting
   - Format as LKR currency
   - Right align content
   - Include thousands separator

8. **Define Status column**
   - Set accessorKey to 'status'
   - Set header text to "Status"
   - Set width to 120px
   - Enable sorting
   - Use OrderStatusBadge component
   - Center align content

9. **Define Actions column**
   - Set id to 'actions'
   - Set header text to "Actions"
   - Set width to 80px
   - Disable sorting
   - Use OrderActionsCell component
   - Right align content

10. **Configure column sorting**
    - Set enableSorting for each column
    - Define sortingFn for custom sorting
    - Set default sort direction
    - Add sort indicator icons

11. **Configure column visibility**
    - Set default visibility for each column
    - Allow toggling column visibility
    - Maintain responsive behavior
    - Hide less important columns on mobile

12. **Export column definitions**
    - Export columns array as default export
    - Type the export with ColumnDef<Order>[]
    - Add JSDoc comments for documentation

### Column Configuration Table

| Column | Width | Sortable | Align | Format |
|--------|-------|----------|-------|--------|
| Order # | 120px | Yes | Left | ORD-XXXX |
| Customer | 200px | Yes | Left | Full Name |
| Date | 120px | Yes | Left | MMM dd, yyyy |
| Items | 80px | No | Center | Number |
| Total | 120px | Yes | Right | LKR X,XXX.XX |
| Status | 120px | Yes | Center | Badge |
| Actions | 80px | No | Right | Dropdown |

### Column Definitions Structure

```
columns = [
  {
    Order Number Column
    - accessorKey: 'order_number'
    - sortable: true
    - cell: LinkCell
  },
  {
    Customer Column
    - accessorKey: 'customer_name'
    - sortable: true
    - cell: TruncatedCell
  },
  {
    Date Column
    - accessorKey: 'created_at'
    - sortable: true
    - cell: FormattedDateCell
  },
  {
    Items Column
    - accessorKey: 'items_count'
    - sortable: false
    - cell: CenteredCell
  },
  {
    Total Column
    - accessorKey: 'total_amount'
    - sortable: true
    - cell: CurrencyCell
  },
  {
    Status Column
    - accessorKey: 'status'
    - sortable: true
    - cell: StatusBadgeCell
  },
  {
    Actions Column
    - id: 'actions'
    - sortable: false
    - cell: ActionsCell
  }
]
```

### Responsive Column Behavior

| Screen Size | Visible Columns |
|-------------|----------------|
| Desktop (≥1024px) | All columns |
| Tablet (768-1023px) | Hide Items column |
| Mobile (<768px) | Order#, Customer, Total, Actions |

### Expected Outcome
- Complete column definitions file
- All columns properly configured
- Custom cell renderers working
- Sorting enabled on appropriate columns
- Responsive column visibility
- Proper data formatting

### Verification Checklist
- [ ] OrderTableColumns.tsx created
- [ ] All 7 columns defined
- [ ] Sorting configured correctly
- [ ] Date formatting works
- [ ] Currency formatting shows LKR
- [ ] Order number displays as link
- [ ] Customer name truncates properly
- [ ] Status badge renders correctly
- [ ] Actions cell shows dropdown
- [ ] Columns export properly
- [ ] TypeScript types correct

---

## Task 29: Create Order Status Badge

### Overview
Create the OrderStatusBadge component to display order status with appropriate visual styling. This badge provides clear visual feedback about order state using color-coded badges with icons. Each status (draft, confirmed, processing, shipped, delivered, cancelled) has distinct styling.

### Dependencies
- Task 28: Define Order Table Columns
- Badge component from UI library
- Order status type definitions

### Instructions

1. **Create badge component file**
   - Navigate to `frontend/components/modules/sales/Orders/` directory
   - Create subdirectory named `cells/`
   - Create file `OrderStatusBadge.tsx` in cells directory

2. **Import required dependencies**
   - Import Badge component from UI library
   - Import status icons from Lucide React
   - Import cn utility for className merging
   - Import OrderStatus type definition

3. **Define component props interface**
   - Create OrderStatusBadgeProps interface
   - Include status property of type OrderStatus
   - Include optional className property
   - Include optional size variant

4. **Define status configuration object**
   - Create statusConfig object mapping each status
   - Define label text for each status
   - Define color variant for each status
   - Define icon component for each status
   - Include hover text descriptions

5. **Implement status mapping logic**
   - Create function to get config for status
   - Handle all possible status values
   - Provide fallback for unknown statuses
   - Return appropriate config object

6. **Build badge component**
   - Create functional component structure
   - Get status config based on props
   - Render Badge with appropriate variant
   - Include icon and label text
   - Apply custom className if provided

7. **Apply status-specific styling**
   - Draft: Gray/slate color, FileText icon
   - Confirmed: Blue color, CheckCircle icon
   - Processing: Yellow/amber color, Clock icon
   - Shipped: Purple/indigo color, Truck icon
   - Delivered: Green color, Package icon
   - Cancelled: Red color, XCircle icon

8. **Add size variants**
   - Implement sm, md, lg size options
   - Adjust icon size based on variant
   - Adjust padding and font size
   - Default to medium size

9. **Include accessibility features**
   - Add aria-label with full status text
   - Include title attribute for tooltip
   - Ensure sufficient color contrast
   - Support screen reader announcements

10. **Add status transition indicators**
    - Include subtle animation for status changes
    - Add pulsing effect for active statuses
    - Indicate processing states visually

11. **Style for consistency**
    - Use consistent spacing and sizing
    - Match design system colors
    - Ensure readability in light and dark modes
    - Apply rounded corners and proper padding

12. **Export component**
    - Default export OrderStatusBadge
    - Export OrderStatusBadgeProps type
    - Add JSDoc documentation

### Status Configuration Table

| Status | Color | Icon | Label | Description |
|--------|-------|------|-------|-------------|
| draft | Gray | FileText | Draft | Order not yet confirmed |
| confirmed | Blue | CheckCircle | Confirmed | Order confirmed by customer |
| processing | Yellow | Clock | Processing | Order being prepared |
| shipped | Purple | Truck | Shipped | Order shipped to customer |
| delivered | Green | Package | Delivered | Order delivered successfully |
| cancelled | Red | XCircle | Cancelled | Order cancelled |

### Visual Badge Examples

```
┌─────────────────────┐
│  📄 Draft           │  Gray background, dark gray text
└─────────────────────┘

┌─────────────────────┐
│  ✓ Confirmed        │  Blue background, blue text
└─────────────────────┘

┌─────────────────────┐
│  ⏱ Processing       │  Yellow background, amber text
└─────────────────────┘

┌─────────────────────┐
│  🚚 Shipped          │  Purple background, indigo text
└─────────────────────┘

┌─────────────────────┐
│  📦 Delivered        │  Green background, green text
└─────────────────────┘

┌─────────────────────┐
│  ✕ Cancelled        │  Red background, red text
└─────────────────────┘
```

### Badge Component Structure

```
OrderStatusBadge
├── Badge (wrapper)
│   ├── variant (color based on status)
│   ├── size (sm/md/lg)
│   └── className (custom styles)
│
└── Content
    ├── Icon (status-specific)
    │   ├── size: 16px (md)
    │   └── className: mr-1
    │
    └── Text (status label)
        └── className: font-medium
```

### Expected Outcome
- Reusable status badge component
- All statuses properly styled
- Icons display correctly
- Color coding clear and consistent
- Accessible to all users
- Responsive and scalable

### Verification Checklist
- [ ] OrderStatusBadge component created
- [ ] All 6 status types supported
- [ ] Correct icon for each status
- [ ] Appropriate color for each status
- [ ] Size variants working
- [ ] Aria-label included
- [ ] Title tooltip displays
- [ ] Component properly typed
- [ ] Exports working correctly
- [ ] Styling matches design system

---

## Task 30: Create Order Actions Cell

### Overview
Create the OrderActionsCell component for the actions column in the orders table. This component provides a dropdown menu with quick actions for each order including View, Edit, Duplicate, Print, and Delete options. Actions are conditionally displayed based on order status and permissions.

### Dependencies
- Task 28: Define Order Table Columns
- DropdownMenu component from UI library
- Order type definitions

### Instructions

1. **Create actions cell component file**
   - Navigate to `frontend/components/modules/sales/Orders/cells/` directory
   - Create file `OrderActionsCell.tsx`
   - Set up component with TypeScript types

2. **Import required dependencies**
   - Import DropdownMenu components (Trigger, Content, Item)
   - Import Button component
   - Import icons from Lucide React (MoreVertical, Eye, Edit, Copy, Printer, Trash)
   - Import useRouter from Next.js
   - Import Order type definition

3. **Define component props interface**
   - Create OrderActionsCellProps interface
   - Include order property of type Order
   - Include onDelete callback function
   - Include onDuplicate callback function
   - Include optional permissions object

4. **Set up router and handlers**
   - Initialize useRouter hook
   - Create handleView function to navigate to details
   - Create handleEdit function to navigate to edit page
   - Create handlePrint function to trigger print
   - Create handleDelete function to show confirmation

5. **Implement view action**
   - Add "View Details" menu item
   - Include Eye icon
   - Navigate to `/orders/[id]` on click
   - Always enabled for all orders

6. **Implement edit action**
   - Add "Edit Order" menu item
   - Include Edit icon
   - Navigate to `/orders/[id]/edit` on click
   - Disable if order is shipped or delivered
   - Show tooltip explaining why disabled

7. **Implement duplicate action**
   - Add "Duplicate" menu item
   - Include Copy icon
   - Call onDuplicate callback with order
   - Enable for all orders
   - Show success toast after duplication

8. **Implement print action**
   - Add "Print Order" menu item
   - Include Printer icon
   - Trigger browser print dialog
   - Format order details for printing
   - Enable for confirmed orders and above

9. **Implement delete action**
   - Add "Delete" menu item with separator
   - Include Trash icon
   - Apply destructive styling (red color)
   - Call onDelete callback with order
   - Only enable for draft orders
   - Show confirmation dialog before deletion

10. **Add menu structure**
    - Wrap items in DropdownMenu component
    - Use MoreVertical icon for trigger button
    - Style trigger as ghost button
    - Position menu to the right
    - Add keyboard navigation support

11. **Implement conditional rendering**
    - Check order status for each action
    - Check user permissions if provided
    - Disable/hide unavailable actions
    - Show tooltips for disabled actions

12. **Style dropdown menu**
    - Apply consistent spacing
    - Use appropriate icon sizes
    - Add hover states
    - Include focus indicators
    - Apply destructive styles to delete

13. **Add loading states**
    - Show loading spinner during actions
    - Disable menu during processing
    - Provide feedback on completion

14. **Export component**
    - Default export OrderActionsCell
    - Export props type
    - Add JSDoc documentation

### Actions Availability Matrix

| Action | Draft | Confirmed | Processing | Shipped | Delivered | Cancelled |
|--------|-------|-----------|------------|---------|-----------|-----------|
| View | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Edit | ✓ | ✓ | ✓ | ✗ | ✗ | ✗ |
| Duplicate | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Print | ✗ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Delete | ✓ | ✗ | ✗ | ✗ | ✗ | ✗ |

### Dropdown Menu Structure

```
┌─────────────────────────────┐
│ ⋮ (More Actions)            │
└─────────────────────────────┘
         │
         ▼
┌─────────────────────────────┐
│ 👁 View Details             │
├─────────────────────────────┤
│ ✏ Edit Order                │
├─────────────────────────────┤
│ 📋 Duplicate                │
├─────────────────────────────┤
│ 🖨 Print Order              │
├─────────────────────────────┤
│                             │ (separator)
├─────────────────────────────┤
│ 🗑 Delete (red)             │
└─────────────────────────────┘
```

### Action Flow Diagram

```
User clicks ⋮
    │
    ▼
Dropdown opens
    │
    ├─→ View → Navigate to details page
    │
    ├─→ Edit → Check if editable
    │          │
    │          ├─→ Yes: Navigate to edit page
    │          └─→ No: Show tooltip, disable
    │
    ├─→ Duplicate → Call onDuplicate
    │              │
    │              └─→ Show success toast
    │
    ├─→ Print → Format order data
    │          │
    │          └─→ Open print dialog
    │
    └─→ Delete → Check if deletable
               │
               ├─→ Yes: Show confirmation
               │         │
               │         └─→ Call onDelete
               │
               └─→ No: Disable option
```

### Expected Outcome
- Functional actions dropdown menu
- All actions properly implemented
- Conditional logic working correctly
- Appropriate visual feedback
- Smooth user experience
- Proper error handling

### Verification Checklist
- [ ] OrderActionsCell component created
- [ ] Dropdown menu renders correctly
- [ ] View action navigates to details
- [ ] Edit action checks order status
- [ ] Duplicate action calls callback
- [ ] Print action opens print dialog
- [ ] Delete action shows confirmation
- [ ] Disabled states show tooltips
- [ ] Icons display correctly
- [ ] Component properly typed
- [ ] Exports working

---

## Task 31: Implement Table Sorting

### Overview
Implement comprehensive sorting functionality for the orders table. Enable users to sort by order number, customer name, date, and total amount in both ascending and descending order. Provide clear visual indicators for active sort column and direction.

### Dependencies
- Task 27: Create Orders Table
- Task 28: Define Order Table Columns
- TanStack Table sorting API

### Instructions

1. **Configure table sorting state**
   - In OrdersTable component, initialize sorting state
   - Use useState with SortingState type
   - Set default sort (e.g., date descending)
   - Pass state to useReactTable hook

2. **Enable sorting in table instance**
   - Import getSortedRowModel from TanStack Table
   - Add getSortedRowModel to table configuration
   - Set onSortingChange handler
   - Configure manual sorting if using server-side

3. **Update column definitions for sorting**
   - In OrderTableColumns.tsx, set enableSorting
   - Enable sorting for: Order #, Customer, Date, Total
   - Disable sorting for: Items, Status, Actions
   - Define custom sortingFn if needed

4. **Add sort indicators to headers**
   - Import sort icons (ArrowUp, ArrowDown, ArrowUpDown)
   - Show ArrowUpDown when column is sortable but not sorted
   - Show ArrowUp when sorted ascending
   - Show ArrowDown when sorted descending
   - Position icons to the right of header text

5. **Implement header click handling**
   - Add onClick handler to sortable headers
   - Call column.toggleSorting() on click
   - Cycle through: none → asc → desc → none
   - Update sort state accordingly

6. **Configure sort behavior**
   - Set sortDescFirst to true for date and amount
   - Set sortDescFirst to false for text columns
   - Allow multiple column sorting (optional)
   - Implement shift+click for multi-column sort

7. **Implement custom sort functions**
   - Create custom sort for order numbers
   - Extract numeric part from "ORD-1001" format
   - Sort numerically rather than alphabetically
   - Handle edge cases (null/undefined values)

8. **Add date sorting logic**
   - Parse date strings to Date objects
   - Compare using timestamp values
   - Handle invalid dates gracefully
   - Sort most recent first by default

9. **Add currency sorting logic**
   - Remove formatting (commas, currency symbols)
   - Parse to numeric values
   - Sort by numeric amount
   - Handle decimal precision correctly

10. **Implement server-side sorting**
    - If using server-side pagination
    - Send sort parameters to API
    - Update API call with sort field and direction
    - Handle sort state in query parameters

11. **Add sort state persistence**
    - Save sort state to URL query parameters
    - Read initial sort from URL on load
    - Maintain sort when navigating back
    - Clear sort with reset button

12. **Style sorted columns**
    - Highlight sorted column header
    - Apply subtle background to sorted column
    - Add hover states to sortable headers
    - Show cursor pointer on sortable columns

13. **Add accessibility features**
    - Include aria-sort attribute on headers
    - Announce sort changes to screen readers
    - Support keyboard navigation (Enter/Space)
    - Add descriptive aria-labels

14. **Test sorting functionality**
    - Verify each sortable column works
    - Test sort direction cycling
    - Check sort indicator updates
    - Ensure data sorts correctly

### Sorting State Flow

```
Initial State
    │
    ▼
No sorting applied
    │
    ▼
User clicks column header
    │
    ├─→ First click: Sort ascending
    │        │
    │        ├─→ Show ↑ indicator
    │        └─→ Update table data
    │
    ├─→ Second click: Sort descending
    │        │
    │        ├─→ Show ↓ indicator
    │        └─→ Update table data
    │
    └─→ Third click: Clear sort
             │
             ├─→ Show ↕ indicator
             └─→ Return to default order
```

### Sort Configuration Table

| Column | Sortable | Default Direction | Custom Sort Function |
|--------|----------|-------------------|---------------------|
| Order # | Yes | Ascending | Numeric extraction |
| Customer | Yes | Ascending | Alphabetical |
| Date | Yes | Descending | Date comparison |
| Items | No | - | - |
| Total | Yes | Descending | Numeric |
| Status | Yes | Ascending | Status order |
| Actions | No | - | - |

### Header Sort Indicators

```
Not Sorted (Sortable)
┌─────────────┐
│ Customer ↕  │
└─────────────┘

Sorted Ascending
┌─────────────┐
│ Customer ↑  │  (highlighted)
└─────────────┘

Sorted Descending
┌─────────────┐
│ Customer ↓  │  (highlighted)
└─────────────┘

Not Sortable
┌─────────────┐
│ Items       │  (no icon)
└─────────────┘
```

### Multi-Column Sort Example

```
Primary Sort: Date (desc)
    │
    ├─→ Jan 25, 2026
    │   ├─→ Secondary Sort: Customer (asc)
    │   │   ├─→ Alice
    │   │   ├─→ Bob
    │   │   └─→ Charlie
    │
    ├─→ Jan 24, 2026
    │   ├─→ Alice
    │   └─→ David
    │
    └─→ Jan 23, 2026
        └─→ Bob
```

### Expected Outcome
- Fully functional table sorting
- Clear visual sort indicators
- Smooth sort transitions
- Proper data ordering
- Accessible sort controls
- Persistent sort state

### Verification Checklist
- [ ] Sorting state initialized
- [ ] Sort indicators display correctly
- [ ] Click handling works on headers
- [ ] Order # sorts numerically
- [ ] Customer sorts alphabetically
- [ ] Date sorts chronologically
- [ ] Total sorts numerically
- [ ] Status sorts by priority
- [ ] Sort direction cycles correctly
- [ ] Aria-sort attributes present
- [ ] Keyboard navigation works
- [ ] Sort persists in URL

---

## Task 32: Connect to Orders API

### Overview
Connect the orders table to the backend API using TanStack Query. Implement data fetching, caching, error handling, and real-time updates. Set up query hooks for fetching orders list with filters, pagination, and sorting parameters.

### Dependencies
- Task 31: Implement Table Sorting
- TanStack Query configured in project
- Backend orders API endpoints available
- API client utilities set up

### Instructions

1. **Create orders query hooks file**
   - Navigate to `frontend/lib/api/` directory
   - Create subdirectory `queries/` if not exists
   - Create file `useOrders.ts` in queries directory

2. **Import required dependencies**
   - Import useQuery, useMutation from TanStack Query
   - Import API client instance (axios/fetch)
   - Import Order type definitions
   - Import query key factory

3. **Define query parameters interface**
   - Create OrdersQueryParams interface
   - Include page and pageSize for pagination
   - Include sortBy and sortOrder for sorting
   - Include filter parameters (status, date range, search, payment status)
   - All parameters optional with defaults

4. **Create query keys factory**
   - Define ordersKeys object
   - Create keys for all orders queries
   - Include list keys with filters
   - Include detail keys with ID
   - Use structured key format

5. **Implement useOrders hook**
   - Create custom hook with parameters
   - Use useQuery with appropriate key
   - Fetch orders from API endpoint
   - Transform response data if needed
   - Return data, loading, error states

6. **Build API request function**
   - Create fetchOrders async function
   - Construct API URL with base path
   - Add query parameters to URL
   - Send GET request to backend
   - Handle response data extraction

7. **Add pagination support**
   - Include page and pageSize in request
   - Handle pagination metadata from response
   - Return total count and page info
   - Support cursor-based pagination if needed

8. **Add sorting support**
   - Map frontend sort field to backend field
   - Convert sort direction to API format
   - Include sort parameters in request
   - Handle multiple sort columns

9. **Add filtering support**
   - Include status filter parameter
   - Add date range filter (start_date, end_date)
   - Include search query parameter
   - Add payment status filter
   - Encode filter parameters properly

10. **Implement error handling**
    - Catch API request errors
    - Transform error messages for display
    - Handle network errors gracefully
    - Show appropriate error states in UI
    - Add retry logic for failed requests

11. **Configure caching strategy**
    - Set staleTime to 30 seconds
    - Set cacheTime to 5 minutes
    - Enable background refetching
    - Configure retry attempts
    - Set refetchOnWindowFocus

12. **Add optimistic updates**
    - Implement cache updates on mutations
    - Optimistically update list after create
    - Update cache after status changes
    - Rollback on mutation failure

13. **Create related mutation hooks**
    - Create useCreateOrder hook
    - Create useUpdateOrder hook
    - Create useDeleteOrder hook
    - Invalidate queries after mutations

14. **Integrate with OrdersTable**
    - Import useOrders hook in OrdersList component
    - Pass query parameters from filters
    - Pass pagination state to hook
    - Pass sorting state to hook
    - Handle loading and error states

15. **Add real-time updates**
    - Set up polling with refetchInterval
    - Implement WebSocket updates (optional)
    - Auto-refresh on window focus
    - Show notification for new orders

16. **Implement prefetching**
    - Prefetch next page on pagination
    - Prefetch order details on row hover
    - Use prefetchQuery for optimization

17. **Add request debouncing**
    - Debounce search input
    - Debounce filter changes
    - Prevent excessive API calls
    - Improve performance

18. **Test API integration**
    - Verify orders load correctly
    - Test pagination functionality
    - Test sorting with API
    - Test filters with API
    - Check error handling

### API Endpoint Structure

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/v1/orders` | GET | Fetch orders list |
| `/api/v1/orders/:id` | GET | Fetch single order |
| `/api/v1/orders` | POST | Create new order |
| `/api/v1/orders/:id` | PUT | Update order |
| `/api/v1/orders/:id` | DELETE | Delete order |

### Query Parameters Format

```
GET /api/v1/orders?
  page=1&
  pageSize=25&
  sortBy=created_at&
  sortOrder=desc&
  status=confirmed,processing&
  payment_status=paid&
  search=ORD-1001&
  start_date=2026-01-01&
  end_date=2026-01-31
```

### Query Keys Structure

```javascript
ordersKeys = {
  all: ['orders'],
  lists: () => [...ordersKeys.all, 'list'],
  list: (params) => [...ordersKeys.lists(), params],
  details: () => [...ordersKeys.all, 'detail'],
  detail: (id) => [...ordersKeys.details(), id],
}
```

### Data Flow Diagram

```
OrdersList Component
    │
    ├─→ Uses useOrders hook
    │       │
    │       └─→ Parameters
    │           ├─→ page, pageSize
    │           ├─→ sortBy, sortOrder
    │           └─→ filters
    │
    ▼
useOrders Hook
    │
    ├─→ useQuery
    │   ├─→ Query key with params
    │   ├─→ fetchOrders function
    │   └─→ Config (stale time, cache)
    │
    ▼
fetchOrders Function
    │
    ├─→ Build API URL
    ├─→ Add query parameters
    ├─→ Send GET request
    │
    ▼
Backend API
    │
    ├─→ Process request
    ├─→ Apply filters/sorting
    ├─→ Paginate results
    │
    ▼
Response
    │
    ├─→ data: Order[]
    ├─→ meta: { total, page, pageSize }
    └─→ status: 200
    │
    ▼
Transform & Cache
    │
    ├─→ Store in TanStack Query cache
    ├─→ Return to component
    │
    ▼
OrdersList Component
    │
    └─→ Render OrdersTable
        └─→ Display orders data
```

### Response Data Structure

```typescript
{
  data: [
    {
      id: 'uuid',
      order_number: 'ORD-1001',
      customer_id: 'uuid',
      customer_name: 'John Doe',
      customer_email: 'john@example.com',
      status: 'confirmed',
      payment_status: 'paid',
      items_count: 5,
      subtotal: 23000.00,
      tax: 2000.00,
      total_amount: 25000.00,
      created_at: '2026-01-24T10:30:00Z',
      updated_at: '2026-01-24T11:00:00Z'
    },
    // ... more orders
  ],
  meta: {
    total: 150,
    page: 1,
    pageSize: 25,
    totalPages: 6
  }
}
```

### Error Handling Pattern

```
API Request
    │
    ▼
Try/Catch Block
    │
    ├─→ Success
    │   └─→ Return data
    │
    └─→ Error
        │
        ├─→ Network Error
        │   └─→ Show "Check connection"
        │
        ├─→ 401 Unauthorized
        │   └─→ Redirect to login
        │
        ├─→ 403 Forbidden
        │   └─→ Show "No permission"
        │
        ├─→ 404 Not Found
        │   └─→ Show "No orders found"
        │
        ├─→ 500 Server Error
        │   └─→ Show "Server error"
        │
        └─→ Retry (max 3 times)
```

### Expected Outcome
- Orders data loads from API
- Filters update API requests
- Pagination works with backend
- Sorting reflects in API calls
- Error states display properly
- Loading states show correctly
- Cache optimizes performance
- Real-time updates work

### Verification Checklist
- [ ] useOrders hook created
- [ ] Query keys defined
- [ ] fetchOrders function implemented
- [ ] Pagination parameters work
- [ ] Sorting parameters work
- [ ] Filter parameters work
- [ ] Error handling implemented
- [ ] Loading states working
- [ ] Cache configuration set
- [ ] Mutations invalidate cache
- [ ] Integration in OrdersList works
- [ ] API calls visible in network tab
- [ ] Data displays correctly in table
- [ ] Errors show appropriate messages

---

## Summary

This document covered the creation of the orders data table with comprehensive functionality. The OrdersTable component provides a robust interface for viewing and interacting with order data, with support for sorting, pagination, custom cell renderers, and full API integration.

### Completed Components

1. **OrdersTable** - Main table component with TanStack Table
2. **OrderTableColumns** - Column definitions with formatting
3. **OrderStatusBadge** - Visual status indicators
4. **OrderActionsCell** - Action dropdown menu
5. **Table Sorting** - Multi-column sorting functionality
6. **API Integration** - Complete backend connection with TanStack Query

### Key Features Delivered

- Responsive data table with sorting
- Custom cell components for status and actions
- Pagination controls
- Filter integration
- Loading and empty states
- Error handling
- Optimistic updates
- Cache management
- Real-time data sync

### Next Steps

Proceed to **Group C: Order Details & Timeline** to build the detailed order view with timeline, items display, and status management features.

---

**End of Document 02**
