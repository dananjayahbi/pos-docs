# Tasks 65-72: DataTable Components and Skeleton Loaders

> **Phase:** 07 - Frontend Infrastructure ERP Dashboard  
> **SubPhase:** 03 - Component Library Setup  
> **Group:** E - Data Display Feedback Components  
> **Document:** 01 of 03  
> **Tasks Covered:** 65, 66, 67, 68, 69, 70, 71, 72

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **→ Next Document:** [02_Tasks-73-80_Feedback-State-Components.md](02_Tasks-73-80_Feedback-State-Components.md)

---

## Document Overview

This document covers the implementation of data display components and loading state components for the ERP dashboard. These include a powerful DataTable component built with TanStack Table v8, supporting advanced features like sorting, filtering, pagination, and column management, along with skeleton loader components for enhanced user experience during data loading.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 65 | Install Table Component | Low | 10 min |
| 66 | Create DataTable Component | High | 90 min |
| 67 | Create TablePagination Component | Medium | 35 min |
| 68 | Create TableToolbar Component | High | 60 min |
| 69 | Create TableColumnToggle Component | Medium | 30 min |
| 70 | Install Skeleton Component | Low | 10 min |
| 71 | Create TableSkeleton Component | Medium | 25 min |
| 72 | Create CardSkeleton Component | Medium | 20 min |

---

## Task 65: Install Table Component

### Overview
Install the shadcn/ui Table component and TanStack Table v8 library, which provides the foundation for building powerful, feature-rich data tables in the ERP system. TanStack Table is a headless table library that offers excellent performance and flexibility for complex data display requirements.

### Dependencies
- Node.js and npm configured
- Next.js project initialized
- shadcn/ui configured in project

### Instructions

1. **Install shadcn/ui Table component**
   - Open terminal in frontend project root
   - Run shadcn/ui CLI command to add Table component
   - This adds base table components (Table, TableHeader, TableBody, TableRow, TableCell, etc.)

2. **Install TanStack Table library**
   - Install TanStack Table v8 package
   - Install TanStack Table React adapter
   - Verify installation in package.json

3. **Verify component files**
   - Check that table component files created in components/ui directory
   - Verify all table subcomponents present
   - Review component structure and exports

4. **Test basic table rendering**
   - Create simple test component with basic table
   - Verify table renders correctly
   - Check styling and theming applied

5. **Review TanStack Table documentation**
   - Familiarize with core concepts (columns, rows, state)
   - Understand column definitions
   - Review available features

### Table Component Structure

```
components/ui/
├── table.tsx                      # Base table components
│   ├── Table                     # Main wrapper
│   ├── TableHeader               # Header row wrapper
│   ├── TableBody                 # Body rows wrapper
│   ├── TableFooter               # Footer row wrapper
│   ├── TableRow                  # Single row
│   ├── TableHead                 # Header cell
│   ├── TableCell                 # Data cell
│   └── TableCaption              # Table caption/title
```

### TanStack Table Key Features

| Feature | Description | Use Case |
|---------|-------------|----------|
| Column Definitions | Define column structure and behavior | Configure data mapping |
| Sorting | Multi-column sorting with custom comparators | Sort by date, number, string |
| Filtering | Column-level and global filtering | Search and filter data |
| Pagination | Client-side and server-side pagination | Handle large datasets |
| Row Selection | Single and multi-row selection | Bulk actions, checkboxes |
| Column Resizing | Adjustable column widths | User customization |
| Column Ordering | Drag-to-reorder columns | Personalize layout |
| Column Visibility | Show/hide columns dynamically | Toggle column display |

### Installation Verification

```
Package Installation Check:
✓ @tanstack/react-table installed
✓ Version: 8.x.x or higher
✓ Table component in components/ui/table.tsx

Component Files Check:
✓ Table wrapper component
✓ TableHeader component
✓ TableBody component
✓ TableRow component
✓ TableHead component
✓ TableCell component
✓ TableFooter component
✓ TableCaption component
```

### Expected Outcome
- shadcn/ui Table components installed
- TanStack Table v8 library available
- Base table component files created
- Ready for DataTable implementation

### Verification Checklist
- [ ] shadcn/ui Table command executed successfully
- [ ] TanStack Table package installed
- [ ] table.tsx file exists in components/ui
- [ ] All table subcomponents present
- [ ] Package.json shows correct versions
- [ ] Basic table test renders successfully
- [ ] No installation errors or warnings

---

## Task 66: Create DataTable Component

### Overview
Create a comprehensive DataTable component using TanStack Table v8 that serves as the primary data display component for the ERP system. This component provides sorting, filtering, pagination, row selection, column resizing, and column reordering capabilities, making it suitable for displaying product lists, transactions, inventory, and other business data.

### Dependencies
- Task 65: Install Table Component
- TanStack Table v8 installed
- shadcn/ui Table components available

### Instructions

1. **Create DataTable component file**
   - Create file at components/ui/data-table.tsx
   - Set up component with TypeScript generics for type safety
   - Import required TanStack Table hooks and utilities

2. **Define component props interface**
   - Define generic DataTableProps interface
   - Include columns prop (column definitions array)
   - Include data prop (data array)
   - Add optional props for customization

3. **Define column state management**
   - Set up column visibility state
   - Set up column order state
   - Set up column sizing state
   - Use useState hooks for state management

4. **Define sorting state management**
   - Create sorting state variable
   - Configure sorting change handler
   - Support multi-column sorting
   - Set default sort order if needed

5. **Define filtering state management**
   - Create column filters state
   - Create global filter state
   - Set up filter handlers
   - Support debounced filtering

6. **Define pagination state management**
   - Create pagination state (pageIndex, pageSize)
   - Set default page size
   - Configure pagination handlers
   - Support page size options

7. **Define row selection state management**
   - Create row selection state
   - Configure selection handlers
   - Support single and multi-select
   - Add select all functionality

8. **Initialize TanStack Table instance**
   - Use useReactTable hook
   - Pass data and columns
   - Configure all state variables
   - Enable all required features

9. **Configure table features**
   - Enable getCoreRowModel for basic rendering
   - Enable getSortedRowModel for sorting
   - Enable getFilteredRowModel for filtering
   - Enable getPaginationRowModel for pagination
   - Enable column resizing feature
   - Enable column ordering feature
   - Enable row selection feature

10. **Render table structure**
    - Use shadcn/ui Table components
    - Render TableHeader with header groups
    - Render TableBody with rows
    - Add sorting indicators to headers
    - Add resize handles to headers
    - Include empty state message

11. **Add column header interactions**
    - Add click handler for sorting
    - Add drag handles for reordering
    - Add resize handles on header edges
    - Show sort direction indicators
    - Add tooltips for column actions

12. **Add row rendering**
    - Map through visible rows
    - Render cells based on column definitions
    - Apply row selection styling
    - Handle row click events
    - Support row expansion if needed

13. **Add keyboard navigation**
    - Support arrow key navigation
    - Enable Enter key for selection
    - Support Ctrl+A for select all
    - Add Tab navigation through cells

14. **Export component**
    - Export DataTable component
    - Export related types and interfaces
    - Document component props
    - Add usage examples in comments

### DataTable Component Architecture

```
┌────────────────────────────────────────────────────────────┐
│                    DataTable Component                      │
├────────────────────────────────────────────────────────────┤
│                                                            │
│  ┌──────────────────────────────────────────────────────┐ │
│  │              TableToolbar (Task 68)                  │ │
│  │  [Search] [Filters] [Actions] [Columns] [Export]    │ │
│  └──────────────────────────────────────────────────────┘ │
│                                                            │
│  ┌──────────────────────────────────────────────────────┐ │
│  │                   Table Header                       │ │
│  │  [☐] Name ↑  Category  Price  Stock  Actions        │ │
│  │       │       │         │      │        │            │ │
│  │     Sort    Filter    Resize  Order   Menu          │ │
│  └──────────────────────────────────────────────────────┘ │
│                                                            │
│  ┌──────────────────────────────────────────────────────┐ │
│  │                   Table Body                         │ │
│  │  [☑] Product A  Electronics  $99   50   [...]       │ │
│  │  [☐] Product B  Clothing    $49   120   [...]       │ │
│  │  [☐] Product C  Food        $15   200   [...]       │ │
│  │  ...                                                 │ │
│  └──────────────────────────────────────────────────────┘ │
│                                                            │
│  ┌──────────────────────────────────────────────────────┐ │
│  │         TablePagination (Task 67)                    │ │
│  │  Rows: [10 ▼]  Showing 1-10 of 250  [◄] 1 of 25 [►]│ │
│  └──────────────────────────────────────────────────────┘ │
│                                                            │
└────────────────────────────────────────────────────────────┘
```

### TanStack Table State Management

```
State Flow Diagram
═══════════════════

User Action → State Update → Table Re-render
    │              │              │
    │              │              └── Virtual DOM diff
    │              └── React state update
    └── Event handler

State Variables:
┌─────────────────────────────────────┐
│ • columnVisibility                  │
│ • columnOrder                       │
│ • columnSizing                      │
│ • sorting                           │
│ • columnFilters                     │
│ • globalFilter                      │
│ • pagination { pageIndex, pageSize }│
│ • rowSelection                      │
└─────────────────────────────────────┘
```

### Column Definition Structure

```
Column Definition Example:

{
  accessorKey: 'name',           // Data field key
  header: 'Product Name',        // Display header
  cell: (info) => info.getValue(), // Custom rendering
  enableSorting: true,           // Enable sort
  enableColumnFilter: true,       // Enable filter
  size: 200,                     // Default width
  minSize: 100,                  // Min width
  maxSize: 400,                  // Max width
}
```

### Feature Integration Matrix

| Feature | State Hook | TanStack Option | Handler |
|---------|-----------|-----------------|---------|
| Sorting | useState | getSortedRowModel | onSortingChange |
| Filtering | useState | getFilteredRowModel | onColumnFiltersChange |
| Pagination | useState | getPaginationRowModel | onPaginationChange |
| Selection | useState | enableRowSelection | onRowSelectionChange |
| Visibility | useState | state.columnVisibility | onColumnVisibilityChange |
| Sizing | useState | enableColumnResizing | onColumnSizingChange |
| Ordering | useState | state.columnOrder | onColumnOrderChange |

### Column Sorting Visualization

```
Unsorted State:
┌─────────────────────────────────┐
│ Name        Price      Stock    │
├─────────────────────────────────┤
│ Product C   $15.00     200      │
│ Product A   $99.00     50       │
│ Product B   $49.00     120      │
└─────────────────────────────────┘

Sorted Ascending (Name):
┌─────────────────────────────────┐
│ Name ↑      Price      Stock    │
├─────────────────────────────────┤
│ Product A   $99.00     50       │
│ Product B   $49.00     120      │
│ Product C   $15.00     200      │
└─────────────────────────────────┘

Sorted Descending (Price):
┌─────────────────────────────────┐
│ Name        Price ↓    Stock    │
├─────────────────────────────────┤
│ Product A   $99.00     50       │
│ Product B   $49.00     120      │
│ Product C   $15.00     200      │
└─────────────────────────────────┘
```

### Row Selection Modes

```
Single Selection:
┌─────────────────────────────────┐
│ [ ] Product A                   │
│ [●] Product B  ← Selected       │
│ [ ] Product C                   │
└─────────────────────────────────┘

Multiple Selection:
┌─────────────────────────────────┐
│ [☑] Product A  ← Selected       │
│ [☐] Product B                   │
│ [☑] Product C  ← Selected       │
└─────────────────────────────────┘

Select All:
┌─────────────────────────────────┐
│ [☑] Select All                  │
├─────────────────────────────────┤
│ [☑] Product A                   │
│ [☑] Product B                   │
│ [☑] Product C                   │
└─────────────────────────────────┘
```

### Column Resizing Interaction

```
Resize Handle:
┌──────────┬──────────┬──────────┐
│ Name     │┊ Price   │ Stock    │
│          │┊         │          │
└──────────┴──────────┴──────────┘
            ↑
         Drag handle
       (cursor: col-resize)

After Resize:
┌────────────────┬────────┬────────┐
│ Name           │ Price  │ Stock  │
│                │        │        │
└────────────────┴────────┴────────┘
```

### Column Reordering Interaction

```
Before Reorder:
┌─────────┬──────────┬──────────┐
│ Name    │ Category │ Price    │
└─────────┴──────────┴──────────┘

During Drag:
┌─────────┬──────────┬──────────┐
│ Name    │  [Price] │ Category │
│         │    ↓     │          │
└─────────┴──────────┴──────────┘

After Drop:
┌─────────┬──────────┬──────────┐
│ Name    │ Price    │ Category │
└─────────┴──────────┴──────────┘
```

### Empty State Handling

```
No Data Available:
┌────────────────────────────────────┐
│  Name     Category     Price       │
├────────────────────────────────────┤
│                                    │
│         📊 No Data Available       │
│                                    │
│   No items match your filters.     │
│   Try adjusting your search.       │
│                                    │
└────────────────────────────────────┘

No Search Results:
┌────────────────────────────────────┐
│  Name     Category     Price       │
├────────────────────────────────────┤
│                                    │
│    🔍 No results for "laptop"      │
│                                    │
│   Try different keywords or        │
│   clear your filters.              │
│                                    │
└────────────────────────────────────┘
```

### Expected Outcome
- Fully functional DataTable component
- Support for all major table features
- Type-safe column definitions
- Responsive and accessible
- Optimized performance for large datasets
- Reusable across ERP modules

### Verification Checklist
- [ ] DataTable component file created
- [ ] TypeScript generics implemented
- [ ] All state variables configured
- [ ] TanStack Table instance initialized
- [ ] Sorting functionality works
- [ ] Filtering functionality works
- [ ] Pagination functionality works
- [ ] Row selection works
- [ ] Column resizing works
- [ ] Column reordering works
- [ ] Column visibility toggle works
- [ ] Empty states display correctly
- [ ] Keyboard navigation implemented
- [ ] Component properly typed
- [ ] Component exported correctly

---

## Task 67: Create TablePagination Component

### Overview
Create a TablePagination component that provides intuitive pagination controls for the DataTable. This component displays page navigation buttons, current page information, total record count, and page size selection, enabling users to efficiently navigate through large datasets.

### Dependencies
- Task 66: Create DataTable Component
- TanStack Table instance available
- shadcn/ui Button component

### Instructions

1. **Create TablePagination component file**
   - Create file at components/ui/table-pagination.tsx
   - Import necessary dependencies
   - Set up component with TypeScript props

2. **Define component props interface**
   - Add table prop (TanStack Table instance)
   - Add optional pageSize options array
   - Add optional display text customization
   - Support RTL layouts for Sri Lankan context

3. **Create page size selector**
   - Use Select component for page size dropdown
   - Provide common options (10, 20, 50, 100, 200)
   - Handle page size change events
   - Update table pagination state

4. **Create page information display**
   - Calculate current row range (e.g., "1-10")
   - Show total rows count
   - Format as "Showing X-Y of Z"
   - Update dynamically on page change

5. **Create navigation buttons**
   - Add "First Page" button
   - Add "Previous Page" button
   - Add "Next Page" button
   - Add "Last Page" button
   - Disable buttons appropriately

6. **Add page number display**
   - Show current page number
   - Show total pages count
   - Format as "Page X of Y"
   - Center between navigation buttons

7. **Add direct page input**
   - Optional input field for page number
   - Validate input range
   - Jump to specified page
   - Handle invalid input gracefully

8. **Style component**
   - Use flexbox for responsive layout
   - Apply consistent spacing
   - Match design system theme
   - Support dark mode

9. **Add accessibility features**
   - Add ARIA labels to buttons
   - Support keyboard navigation
   - Announce page changes to screen readers
   - Use semantic HTML

10. **Handle edge cases**
    - Single page (hide pagination)
    - Empty dataset
    - Invalid page numbers
    - Page size larger than total

11. **Export component**
    - Export TablePagination component
    - Export related types
    - Document usage

### TablePagination Component Layout

```
┌──────────────────────────────────────────────────────────────┐
│  Rows per page: [10 ▼]  Showing 1-10 of 250  [◄◄] [◄] 1 of 25 [►] [►►] │
│                                                              │
│  └─ Page Size     └─ Row Range      └─ Navigation Controls  │
└──────────────────────────────────────────────────────────────┘
```

### Pagination State Flow

```
User Interaction Flow
═════════════════════

Click "Next" → Check bounds → Update pageIndex → Re-render table
                    │
                    └─── If last page, disable "Next" button

Change page size → Reset to page 1 → Update pageSize → Re-render table
                         │
                         └─── Recalculate total pages

Direct input → Validate number → Jump to page → Update pageIndex
                    │
                    └─── If invalid, show error/stay on current
```

### Page Size Options

| Option | Use Case | Dataset Size |
|--------|----------|--------------|
| 10 | Quick browsing, mobile devices | Small to medium |
| 20 | Default desktop view | Medium |
| 50 | Power users, large screens | Large |
| 100 | Data analysis, exports | Very large |
| 200 | Bulk operations | Extremely large |

### Navigation Button States

```
First Page:
┌────────────────────────────────────────────┐
│ [◄◄] [◄] 1 of 25 [►] [►►]                │
│  ↑    ↑            ↑   ↑                  │
│  │    │            │   │                  │
│  Disabled (on page 1)  Enabled            │
└────────────────────────────────────────────┘

Middle Page:
┌────────────────────────────────────────────┐
│ [◄◄] [◄] 10 of 25 [►] [►►]               │
│  ↑    ↑             ↑   ↑                 │
│  │    │             │   │                 │
│  All buttons enabled                      │
└────────────────────────────────────────────┘

Last Page:
┌────────────────────────────────────────────┐
│ [◄◄] [◄] 25 of 25 [►] [►►]               │
│  ↑    ↑            ↑   ↑                  │
│  Enabled    Disabled (on last page)       │
└────────────────────────────────────────────┘
```

### Row Range Calculation Examples

```
Page 1, Size 10 (250 total):
"Showing 1-10 of 250"

Page 5, Size 20 (250 total):
"Showing 81-100 of 250"

Last Page (Page 25, Size 10, 250 total):
"Showing 241-250 of 250"

Only Page (Size 10, 8 total):
"Showing 1-8 of 8"
```

### Responsive Layout

```
Desktop Layout:
┌──────────────────────────────────────────────────────────┐
│ Rows per page: [10▼]  Showing 1-10 of 250  [◄◄][◄] 1 of 25 [►][►►] │
└──────────────────────────────────────────────────────────┘

Tablet Layout:
┌─────────────────────────────────────────────┐
│ Rows: [10▼]  1-10 of 250  [◄] 1/25 [►]    │
└─────────────────────────────────────────────┘

Mobile Layout:
┌──────────────────────────────────┐
│ [10▼]   1-10 of 250             │
│ [◄] Page 1 of 25 [►]            │
└──────────────────────────────────┘
```

### Direct Page Input

```
With Input Field:
┌────────────────────────────────────────────────┐
│ [◄◄] [◄] Go to: [__5__] of 25 [►] [►►]       │
│              └─ Input field                    │
│              Enter page number and press Enter │
└────────────────────────────────────────────────┘

Input Validation:
• Empty input: Stay on current page
• Out of range (0, 26+): Show error, stay current
• Valid (1-25): Jump to that page
• Non-numeric: Show error, clear input
```

### ERP-Specific Pagination Features

| Feature | Description | Use Case |
|---------|-------------|----------|
| Quick Jump | Direct page number input | Navigate large datasets |
| Custom Sizes | Configurable page size options | Different modules needs |
| Total Display | Always show total count | Business reporting |
| Range Display | Show current row range | Data verification |
| Keyboard Nav | Arrow keys, Page Up/Down | Power users |

### Expected Outcome
- Functional pagination controls
- Intuitive page navigation
- Responsive design
- Accessible to all users
- Smooth integration with DataTable

### Verification Checklist
- [ ] TablePagination component file created
- [ ] Component props interface defined
- [ ] Page size selector implemented
- [ ] Page information displays correctly
- [ ] First page button works
- [ ] Previous page button works
- [ ] Next page button works
- [ ] Last page button works
- [ ] Page number displays correctly
- [ ] Direct page input functional (if implemented)
- [ ] Buttons disable appropriately
- [ ] Row range calculates correctly
- [ ] Responsive layout works
- [ ] Accessibility features implemented
- [ ] Component exported correctly

---

## Task 68: Create TableToolbar Component

### Overview
Create a comprehensive TableToolbar component that sits above the DataTable and provides global search, filter controls, bulk actions, column visibility toggle, and data export functionality. This toolbar serves as the primary control center for table operations, enabling users to efficiently search, filter, and manipulate data.

### Dependencies
- Task 66: Create DataTable Component
- Task 69: Create TableColumnToggle Component
- shadcn/ui Input component
- shadcn/ui Button component
- shadcn/ui DropdownMenu component

### Instructions

1. **Create TableToolbar component file**
   - Create file at components/ui/table-toolbar.tsx
   - Import required components and utilities
   - Set up component with TypeScript generics

2. **Define component props interface**
   - Add table prop (TanStack Table instance)
   - Add optional filterOptions prop
   - Add optional bulkActions prop
   - Add optional exportOptions prop
   - Add optional customization props

3. **Create global search input**
   - Add search input field with icon
   - Implement debounced search handler
   - Update table global filter state
   - Add clear search button
   - Show search results count

4. **Create filter dropdowns section**
   - Add dropdown for each filterable column
   - Populate options from data or props
   - Handle multi-select filters
   - Show active filter badges
   - Add "Clear All Filters" button

5. **Create bulk actions dropdown**
   - Add dropdown for bulk operations
   - Enable when rows selected
   - Show selected count in button label
   - Include common actions (delete, export, update)
   - Handle action callbacks

6. **Integrate column toggle**
   - Add button to open column visibility panel
   - Use TableColumnToggle component (Task 69)
   - Position as dropdown or side panel
   - Show currently visible column count

7. **Create export functionality**
   - Add export button/dropdown
   - Support CSV export
   - Support Excel export (optional)
   - Support PDF export (optional)
   - Handle export of current view vs. all data

8. **Add filter chips display**
   - Show active filters as removable chips
   - Position below toolbar
   - Add remove button on each chip
   - Show clear all option when multiple active

9. **Implement layout sections**
   - Left section: Search and filters
   - Center section: Active filter chips
   - Right section: Bulk actions, column toggle, export
   - Use flexbox for responsive layout

10. **Add responsive behavior**
    - Collapse to menu on mobile
    - Prioritize search on small screens
    - Stack buttons vertically on mobile
    - Show tooltips on icon-only buttons

11. **Style component**
    - Match design system theme
    - Add proper spacing and padding
    - Support dark mode
    - Add hover and focus states

12. **Add accessibility features**
    - Proper ARIA labels
    - Keyboard navigation support
    - Focus management
    - Screen reader announcements

13. **Export component**
    - Export TableToolbar component
    - Export related types and interfaces
    - Document usage and examples

### TableToolbar Component Layout

```
┌────────────────────────────────────────────────────────────────────┐
│  [🔍 Search products...]  [Category ▼]  [Status ▼]  │ [Actions ▼] [👁 Columns] [⬇ Export] │
│                                                      │                                      │
│  Left Section: Search & Filters                     │  Right Section: Actions              │
└────────────────────────────────────────────────────────────────────┘
│  [× Electronics] [× In Stock]   Clear all filters                 │ ← Active filters row
└────────────────────────────────────────────────────────────────────┘
```

### Toolbar Section Breakdown

```
┌─────────────────────────────────────────────────────────────────┐
│                       TableToolbar                              │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Left Section (flex-start):                                     │
│  ┌────────────────────────────────────────────┐                │
│  │ [🔍] Global Search Input                   │                │
│  │ [Category ▼] [Status ▼] [Price Range ▼]   │                │
│  └────────────────────────────────────────────┘                │
│                                                                 │
│  Right Section (flex-end):                                      │
│  ┌────────────────────────────────────────────┐                │
│  │ [Bulk Actions ▼] [Columns] [Export ▼]     │                │
│  └────────────────────────────────────────────┘                │
│                                                                 │
│  Active Filters Row (full-width):                              │
│  ┌────────────────────────────────────────────┐                │
│  │ [× Filter1] [× Filter2] Clear all          │                │
│  └────────────────────────────────────────────┘                │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Global Search Implementation

```
Search Input:
┌───────────────────────────────────────┐
│ 🔍  Search products...           [×] │
│                                       │
│ Searching: "laptop"                   │
│ Found 24 results                      │
└───────────────────────────────────────┘

Search Behavior:
• Debounced input (300ms delay)
• Searches across all visible columns
• Case-insensitive matching
• Clear button appears when has value
• Shows result count
• Updates table in real-time
```

### Filter Dropdown Structure

```
Category Filter:
┌────────────────────────┐
│ Category: All       ▼  │
├────────────────────────┤
│ ☐ All Categories       │
│ ☑ Electronics          │ ← Selected
│ ☐ Clothing             │
│ ☐ Food & Beverage      │
│ ☐ Home & Garden        │
│ ☐ Sports               │
│ ────────────────────   │
│ [Apply] [Clear]        │
└────────────────────────┘

Status Filter:
┌────────────────────────┐
│ Status: Multiple    ▼  │
├────────────────────────┤
│ ☑ In Stock             │
│ ☑ Low Stock            │
│ ☐ Out of Stock         │
│ ☐ Discontinued         │
│ ────────────────────   │
│ [Apply] [Clear]        │
└────────────────────────┘

Price Range Filter:
┌────────────────────────┐
│ Price Range         ▼  │
├────────────────────────┤
│ ☐ Under Rs. 1,000      │
│ ☐ Rs. 1,000 - 5,000    │
│ ☐ Rs. 5,000 - 10,000   │
│ ☑ Rs. 10,000 - 50,000  │
│ ☐ Over Rs. 50,000      │
│ ────────────────────   │
│ Custom Range:          │
│ Min: [_____]           │
│ Max: [_____]           │
│ [Apply] [Clear]        │
└────────────────────────┘
```

### Active Filter Chips

```
Multiple Active Filters:
┌────────────────────────────────────────────────────────┐
│ Active Filters:                                        │
│ [Electronics ×] [Low Stock ×] [Rs. 10K-50K ×]         │
│                                    [Clear all filters]  │
└────────────────────────────────────────────────────────┘

Chip Interactions:
• Click × to remove individual filter
• Hover shows filter details
• Color-coded by filter type
• Animated on add/remove
```

### Bulk Actions Dropdown

```
No Selection:
┌────────────────────┐
│ Actions         ▼  │ ← Disabled/dimmed
└────────────────────┘

With Selection (3 items):
┌────────────────────┐
│ Actions (3)     ▼  │ ← Enabled
├────────────────────┤
│ ✓ Export Selected  │
│ 🗑 Delete Selected  │
│ 📝 Update Status   │
│ 🏷 Add Tags        │
│ 📋 Copy to...      │
└────────────────────┘

After Action Confirmation:
┌────────────────────────────────────┐
│ Delete 3 selected items?           │
│ This action cannot be undone.      │
│ [Cancel] [Delete]                  │
└────────────────────────────────────┘
```

### Export Options

```
Export Dropdown:
┌────────────────────────┐
│ Export              ▼  │
├────────────────────────┤
│ 📊 Export as CSV       │
│ 📗 Export as Excel     │
│ 📄 Export as PDF       │
│ ────────────────────   │
│ Export Options:        │
│ ○ Current Page (10)    │
│ ● Filtered Data (48)   │ ← Selected
│ ○ All Data (250)       │
│ ────────────────────   │
│ [Export]               │
└────────────────────────┘

Export Formats:
CSV:  Simple data export, Excel compatible
Excel: Formatted with headers, filters preserved
PDF:  Print-friendly, formatted layout
```

### Column Toggle Integration

```
Column Toggle Button:
┌────────────────────┐
│ 👁 Columns (5/8) ▼ │
└────────────────────┘
         ↓
Opens TableColumnToggle (Task 69)
```

### Responsive Toolbar Layout

```
Desktop (>1024px):
┌────────────────────────────────────────────────────────────┐
│ [🔍 Search...] [Category▼] [Status▼] │ [Actions▼] [Columns] [Export▼] │
└────────────────────────────────────────────────────────────┘

Tablet (768-1024px):
┌─────────────────────────────────────────────┐
│ [🔍 Search...]     [Category▼] [Status▼]   │
│ [Actions▼] [Columns] [Export▼]             │
└─────────────────────────────────────────────┘

Mobile (<768px):
┌──────────────────────────────┐
│ [🔍 Search...]         [☰]  │ ← Hamburger menu
│ [× Category] [× Status]      │
└──────────────────────────────┘

Mobile Menu Open:
┌──────────────────────────────┐
│ [×] Menu                     │
├──────────────────────────────┤
│ Category Filter              │
│ Status Filter                │
│ ──────────────               │
│ Bulk Actions                 │
│ Show/Hide Columns            │
│ Export Data                  │
└──────────────────────────────┘
```

### Filter State Management

```
Filter Flow:
User selects filter → Update columnFilters state → Table re-renders
       │                       │                         │
       │                       └── TanStack Table       │
       └── UI updates (badges, chips)                   └── Filtered data
```

### ERP-Specific Toolbar Features

| Feature | Description | Use Case |
|---------|-------------|----------|
| Quick Filters | Pre-configured filter sets | "Show low stock", "This month" |
| Saved Views | Save filter/column configurations | Frequently used reports |
| Bulk Import | Upload CSV to update items | Mass updates |
| Print Preview | View print layout | Physical reports |
| Refresh Data | Manual data reload | Real-time updates |

### Expected Outcome
- Comprehensive toolbar component
- Intuitive search and filtering
- Efficient bulk operations
- Easy column management
- Flexible export options
- Responsive and accessible

### Verification Checklist
- [ ] TableToolbar component file created
- [ ] Component props interface defined
- [ ] Global search input implemented
- [ ] Search debouncing works
- [ ] Filter dropdowns functional
- [ ] Filter chips display correctly
- [ ] Bulk actions dropdown works
- [ ] Column toggle integration complete
- [ ] Export functionality implemented
- [ ] CSV export works
- [ ] Active filters display correctly
- [ ] Clear all filters works
- [ ] Responsive layout functional
- [ ] Mobile menu works
- [ ] Accessibility features implemented
- [ ] Component exported correctly

---

## Task 69: Create TableColumnToggle Component

### Overview
Create a TableColumnToggle component that allows users to show or hide table columns dynamically. This component provides an intuitive interface for column visibility management, enabling users to customize their table view based on their preferences and screen space.

### Dependencies
- Task 66: Create DataTable Component
- shadcn/ui DropdownMenu component
- shadcn/ui Checkbox component

### Instructions

1. **Create TableColumnToggle component file**
   - Create file at components/ui/table-column-toggle.tsx
   - Import required components
   - Set up component with TypeScript props

2. **Define component props interface**
   - Add table prop (TanStack Table instance)
   - Add optional title prop
   - Add optional excludeColumns prop (columns that cannot be hidden)
   - Support custom column display names

3. **Get all columns from table**
   - Access table.getAllColumns() method
   - Filter out non-toggleable columns
   - Sort columns by display order
   - Handle column groups if present

4. **Create dropdown trigger button**
   - Use Button component
   - Show column icon and label
   - Display count of visible columns
   - Add dropdown indicator

5. **Build column list**
   - Map through all columns
   - Create checkbox for each column
   - Show column display name
   - Bind to column visibility state

6. **Implement toggle handlers**
   - Handle individual column toggle
   - Update column visibility state
   - Sync with TanStack Table
   - Prevent hiding all columns

7. **Add "Show All" option**
   - Add checkbox/button at top
   - Select/deselect all columns
   - Respect excludeColumns
   - Update all visibility states

8. **Add "Reset to Default" option**
   - Add button to restore default columns
   - Reset to initial visibility state
   - Clear any saved preferences
   - Provide visual feedback

9. **Implement column search**
   - Add search input in dropdown
   - Filter column list by name
   - Show "no results" message
   - Clear search option

10. **Add persistent preferences**
    - Save column visibility to localStorage
    - Load preferences on mount
    - Support per-table preferences
    - Handle missing columns gracefully

11. **Style component**
    - Match design system theme
    - Proper spacing in dropdown
    - Scrollable column list
    - Dark mode support

12. **Add accessibility features**
    - Keyboard navigation
    - ARIA labels
    - Focus management
    - Screen reader support

13. **Export component**
    - Export TableColumnToggle component
    - Export related types
    - Document usage

### TableColumnToggle Component Structure

```
┌─────────────────────────────────┐
│  👁 Columns (5 of 8) ▼          │ ← Trigger button
└─────────────────────────────────┘
            ↓ (Click)
┌─────────────────────────────────┐
│ 📋 Manage Columns               │
├─────────────────────────────────┤
│ [🔍 Search columns...]          │
│ ─────────────────────────       │
│ ☑ Show All                      │
│ ─────────────────────────       │
│ ☑ Name                          │
│ ☑ SKU                           │
│ ☑ Category                      │
│ ☑ Price                         │
│ ☑ Stock                         │
│ ☐ Cost                          │ ← Hidden
│ ☐ Supplier                      │ ← Hidden
│ ☐ Last Updated                  │ ← Hidden
│ ─────────────────────────       │
│ [Reset to Default]              │
└─────────────────────────────────┘
```

### Column Visibility States

```
All Columns Visible:
┌─────────────────────────────────┐
│ ☑ Show All                      │
│ ─────────────────────────       │
│ ☑ Column A                      │
│ ☑ Column B                      │
│ ☑ Column C                      │
│ ☑ Column D                      │
└─────────────────────────────────┘

Some Columns Hidden:
┌─────────────────────────────────┐
│ ☐ Show All (Indeterminate)      │ ← Mixed state
│ ─────────────────────────       │
│ ☑ Column A                      │
│ ☐ Column B                      │
│ ☑ Column C                      │
│ ☐ Column D                      │
└─────────────────────────────────┘

All Columns Hidden (Prevented):
┌─────────────────────────────────┐
│ At least one column must        │
│ be visible                      │
│ ─────────────────────────       │
│ ☑ Column A  ← Cannot uncheck    │
└─────────────────────────────────┘
```

### Column Search Feature

```
Search Input:
┌─────────────────────────────────┐
│ [🔍 Search: "price"___]         │
│ ─────────────────────────       │
│ ☑ Price                         │
│ ☑ Cost Price                    │
│ ☑ Sale Price                    │
│ ─────────────────────────       │
│ 3 columns found                 │
└─────────────────────────────────┘

No Results:
┌─────────────────────────────────┐
│ [🔍 Search: "xyz"___] [×]       │
│ ─────────────────────────       │
│                                 │
│   No columns found              │
│   for "xyz"                     │
│                                 │
└─────────────────────────────────┘
```

### Column Groups Handling

```
Flat Column Structure:
┌─────────────────────────────────┐
│ ☑ Product Name                  │
│ ☑ SKU                           │
│ ☑ Category                      │
│ ☑ Price                         │
│ ☑ Stock Quantity                │
└─────────────────────────────────┘

Grouped Column Structure:
┌─────────────────────────────────┐
│ ▼ Product Information           │ ← Collapsible group
│   ☑ Name                        │
│   ☑ SKU                         │
│   ☑ Category                    │
│                                 │
│ ▼ Pricing                       │
│   ☑ Cost                        │
│   ☑ Sale Price                  │
│   ☑ Discount                    │
│                                 │
│ ▼ Inventory                     │
│   ☑ Stock Quantity              │
│   ☑ Reserved                    │
│   ☑ Available                   │
└─────────────────────────────────┘
```

### Exclude Columns Configuration

```
Excluding Critical Columns:

excludeColumns = ['id', 'actions']

Result:
┌─────────────────────────────────┐
│ Name          (Always visible)  │ ← Cannot hide
│ ☑ SKU                           │
│ ☑ Category                      │
│ ☑ Price                         │
│ Actions       (Always visible)  │ ← Cannot hide
└─────────────────────────────────┘

Use Cases:
• ID column: Critical for row identification
• Actions column: Always need action buttons
• Select column: Required for bulk operations
• Primary identifier: Essential business field
```

### Visibility State Persistence

```
LocalStorage Structure:
{
  "tableColumns_products": {
    "name": true,
    "sku": true,
    "category": true,
    "price": true,
    "cost": false,    ← Hidden
    "supplier": false, ← Hidden
    "lastUpdated": false ← Hidden
  },
  "tableColumns_transactions": {
    "date": true,
    "customer": true,
    "amount": true,
    "status": true
  }
}

Storage Keys:
• Unique per table: "tableColumns_{tableId}"
• Tenant-aware: "tenant_{id}_tableColumns_{tableId}"
• User-specific: "user_{id}_tableColumns_{tableId}"
```

### Reset to Default Behavior

```
Before Reset (Custom View):
┌─────────────────────────────────┐
│ ☑ Name                          │
│ ☐ SKU            ← Hidden       │
│ ☑ Category                      │
│ ☑ Price                         │
│ ☐ Cost           ← Hidden       │
│ ☐ Supplier       ← Hidden       │
└─────────────────────────────────┘

After Reset (Default View):
┌─────────────────────────────────┐
│ ☑ Name                          │
│ ☑ SKU            ← Restored     │
│ ☑ Category                      │
│ ☑ Price                         │
│ ☑ Cost           ← Restored     │
│ ☐ Supplier       ← Still hidden │
└─────────────────────────────────┘

Default Configuration:
• Restore initial visibility from column definitions
• Clear localStorage for this table
• Animate changes
• Show confirmation
```

### Show All / Hide All Logic

```
Show All Flow:
Click "Show All" → Set all toggleable columns to visible
                  → Update table state
                  → Save to localStorage

Hide All Prevention:
Click last visible column → Show warning
                          → Prevent action
                          → Keep at least one visible

Warning Message:
┌─────────────────────────────────┐
│ ⚠ Cannot Hide All Columns       │
│                                 │
│ At least one column must        │
│ remain visible                  │
│                                 │
│ [OK]                            │
└─────────────────────────────────┘
```

### Responsive Behavior

```
Desktop Dropdown:
┌─────────────────────────────────┐
│ Full column list                │
│ Scrollable if many columns      │
│ Max height: 400px               │
└─────────────────────────────────┘

Mobile Dropdown:
┌──────────────────────┐
│ Compact list         │
│ Smaller checkboxes   │
│ Touch-friendly       │
│ Max height: 300px    │
└──────────────────────┘

Mobile Sheet/Modal (Alternative):
┌──────────────────────┐
│ [×] Manage Columns   │
├──────────────────────┤
│ [Search...]          │
│ ☑ Show All           │
│ ─────────────        │
│ ☑ Name               │
│ ☑ Category           │
│ ☑ Price              │
│ ☐ Cost               │
│ ☐ Supplier           │
│ ─────────────        │
│ [Reset] [Done]       │
└──────────────────────┘
```

### Integration with DataTable

```
Column Visibility Sync:
┌──────────────────────────────────────┐
│ TableColumnToggle                    │
│ ├── Reads: table.getState()         │
│ │            .columnVisibility       │
│ └── Updates: table.setColumnVisibility()│
└──────────────────────────────────────┘
         ↕
┌──────────────────────────────────────┐
│ DataTable                            │
│ └── Re-renders with new columns      │
└──────────────────────────────────────┘
```

### Expected Outcome
- Intuitive column visibility control
- Persistent user preferences
- Search and filter columns
- Responsive design
- Accessible interface
- Smooth integration with DataTable

### Verification Checklist
- [ ] TableColumnToggle component file created
- [ ] Component props interface defined
- [ ] Column list renders correctly
- [ ] Individual toggle works
- [ ] Show All functionality works
- [ ] Reset to Default works
- [ ] Column search implemented
- [ ] Excluded columns respected
- [ ] At least one column always visible
- [ ] Preferences persist to localStorage
- [ ] Preferences load correctly
- [ ] Responsive design works
- [ ] Accessibility features implemented
- [ ] Component exported correctly

---

## Task 70: Install Skeleton Component

### Overview
Install the shadcn/ui Skeleton component, which provides a loading placeholder with a shimmer animation effect. Skeleton loaders enhance user experience by showing content placeholders while data is loading, making the application feel more responsive and polished.

### Dependencies
- Node.js and npm configured
- Next.js project initialized
- shadcn/ui configured in project

### Instructions

1. **Install shadcn/ui Skeleton component**
   - Open terminal in frontend project root
   - Run shadcn/ui CLI command to add Skeleton component
   - Component will be added to components/ui directory

2. **Verify component installation**
   - Check that skeleton.tsx file created
   - Review component implementation
   - Verify TypeScript types included

3. **Test basic skeleton rendering**
   - Create simple test component
   - Render skeleton with different sizes
   - Verify animation works
   - Check styling and theming

4. **Review skeleton variants**
   - Understand default styling
   - Review animation properties
   - Check dark mode support
   - Note customization options

5. **Review usage patterns**
   - Single line skeleton
   - Multiple line skeleton
   - Card skeleton layouts
   - Table row skeletons

### Skeleton Component Structure

```
components/ui/
└── skeleton.tsx
    └── Skeleton component
        • Base shimmer animation
        • Customizable dimensions
        • Theme-aware styling
        • Dark mode support
```

### Skeleton Variants

```
Text Line Skeleton:
┌─────────────────────────────────────┐
│ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓░░░░░░░░░░         │ ← Shimmer animation
└─────────────────────────────────────┘

Short Text:
┌──────────────┐
│ ▓▓▓▓▓▓░░░░░  │
└──────────────┘

Paragraph (Multiple Lines):
┌─────────────────────────────────────┐
│ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓░░░░░░         │
│ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓░░░░░░░░         │
│ ▓▓▓▓▓▓▓▓▓▓▓▓░░░░░░░░░              │
└─────────────────────────────────────┘

Circle/Avatar:
 ┌──────┐
 │ ▓▓▓▓ │
 │ ▓▓▓▓ │
 └──────┘

Rectangle/Image:
┌──────────────────┐
│ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓ │
│ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓ │
│ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓ │
└──────────────────┘
```

### Skeleton Animation

```
Shimmer Effect:
════════════════════════════════════

Frame 1:  ▓▓▓▓▓░░░░░░░░░░░░░░░
Frame 2:  ░▓▓▓▓▓░░░░░░░░░░░░░░
Frame 3:  ░░▓▓▓▓▓░░░░░░░░░░░░░
Frame 4:  ░░░▓▓▓▓▓░░░░░░░░░░░░
Frame 5:  ░░░░▓▓▓▓▓░░░░░░░░░░░
...
Continuous animation (pulse/shimmer)
```

### Common Skeleton Patterns

| Pattern | Description | Use Case |
|---------|-------------|----------|
| Line | Single horizontal bar | Text placeholder |
| Paragraph | Multiple stacked lines | Content block |
| Circle | Round shape | Avatar placeholder |
| Rectangle | Box shape | Image/card placeholder |
| Custom | Any shape/size | Specific UI element |

### Skeleton Sizing

```
Default Size (h-4):
▓▓▓▓▓▓▓▓░░░░░░  ← 16px height

Small (h-3):
▓▓▓▓▓░░░  ← 12px height

Medium (h-5):
▓▓▓▓▓▓▓▓▓▓░░░░  ← 20px height

Large (h-8):
▓▓▓▓▓▓▓▓▓▓▓▓▓▓
▓▓▓▓▓▓▓▓▓▓▓▓▓▓  ← 32px height
```

### Expected Outcome
- Skeleton component installed and ready
- Shimmer animation working
- Theme integration complete
- Available for use in custom skeleton components

### Verification Checklist
- [ ] shadcn/ui Skeleton command executed successfully
- [ ] skeleton.tsx file exists in components/ui
- [ ] Component imports without errors
- [ ] Basic skeleton renders
- [ ] Shimmer animation visible
- [ ] Dark mode styling works
- [ ] Component customizable

---

## Task 71: Create TableSkeleton Component

### Overview
Create a TableSkeleton component that displays a loading state for DataTables. This component mimics the structure of a data table with skeleton rows, providing users with a visual indication that data is being loaded while maintaining the table's layout and structure.

### Dependencies
- Task 70: Install Skeleton Component
- Task 65: Install Table Component
- shadcn/ui Skeleton component available

### Instructions

1. **Create TableSkeleton component file**
   - Create file at components/ui/table-skeleton.tsx
   - Import Skeleton component
   - Import Table components

2. **Define component props interface**
   - Add rows prop (number of skeleton rows, default 5)
   - Add columns prop (number of columns, default 5)
   - Add showHeader prop (show header row, default true)
   - Add showPagination prop (show pagination skeleton, default true)
   - Add showToolbar prop (show toolbar skeleton, default true)

3. **Create toolbar skeleton section**
   - Skeleton for search input
   - Skeletons for filter buttons
   - Skeletons for action buttons
   - Match TableToolbar layout

4. **Create table header skeleton**
   - Create TableHeader wrapper
   - Create TableRow with TableHead cells
   - Add skeleton in each header cell
   - Match actual table header layout

5. **Create table body skeletons**
   - Create TableBody wrapper
   - Generate specified number of rows
   - Create skeleton cells for each column
   - Vary skeleton widths for natural look

6. **Create pagination skeleton**
   - Skeleton for page size selector
   - Skeleton for page info text
   - Skeletons for navigation buttons
   - Match TablePagination layout

7. **Add cell width variation**
   - Vary skeleton widths (60%, 80%, 100%)
   - Make layout look natural
   - Prevent uniform appearance
   - Randomize or use patterns

8. **Style component**
   - Match design system theme
   - Ensure proper spacing
   - Support dark mode
   - Align with actual table styling

9. **Add responsive behavior**
   - Hide columns on mobile
   - Adjust skeleton sizes
   - Match responsive table behavior

10. **Export component**
    - Export TableSkeleton component
    - Export props interface
    - Document usage

### TableSkeleton Component Layout

```
Full Table Skeleton:
┌────────────────────────────────────────────────────────────┐
│  ▓▓▓▓▓▓▓░░░░  ▓▓▓░  ▓▓▓░   ▓▓▓░  ▓▓░  ▓▓░                │ ← Toolbar
├────────────────────────────────────────────────────────────┤
│  ▓▓▓▓▓░     ▓▓▓▓▓░    ▓▓▓▓░   ▓▓▓▓░   ▓▓▓░               │ ← Header
├────────────────────────────────────────────────────────────┤
│  ▓▓▓▓▓▓▓░   ▓▓▓▓░     ▓▓▓░    ▓▓▓▓░   ▓▓░                │ ← Row 1
│  ▓▓▓▓▓░     ▓▓▓▓▓░    ▓▓▓▓░   ▓▓░     ▓▓▓░               │ ← Row 2
│  ▓▓▓▓▓▓░    ▓▓▓░      ▓▓▓░    ▓▓▓▓░   ▓▓░                │ ← Row 3
│  ▓▓▓▓░      ▓▓▓▓▓▓░   ▓▓░     ▓▓▓░    ▓▓▓░               │ ← Row 4
│  ▓▓▓▓▓▓▓░   ▓▓▓▓░     ▓▓▓▓░   ▓▓▓▓░   ▓▓░                │ ← Row 5
├────────────────────────────────────────────────────────────┤
│  ▓▓▓░  ▓▓▓▓▓▓▓▓▓▓▓░░░░░░         ▓░  ▓▓░  ▓░  ▓░         │ ← Pagination
└────────────────────────────────────────────────────────────┘
```

### Toolbar Skeleton Detail

```
┌────────────────────────────────────────────────────────────┐
│  [▓▓▓▓▓▓▓▓▓▓▓░░░░░░]  [▓▓▓░] [▓▓▓░]  [▓▓░] [▓▓░] [▓▓░]   │
│   └─ Search input      └─ Filters    └─ Actions/Export    │
└────────────────────────────────────────────────────────────┘
```

### Header Skeleton Detail

```
┌────────────────────────────────────────────────────────────┐
│  [▓▓▓▓▓░]  [▓▓▓▓▓▓░]  [▓▓▓▓░]  [▓▓▓▓▓░]  [▓▓▓░]         │
│   Name     Category    Price    Stock     Actions          │
└────────────────────────────────────────────────────────────┘
```

### Body Row Skeleton Variations

```
Row with Varied Widths:
┌────────────────────────────────────────────────────────────┐
│  [▓▓▓▓▓▓▓░░░] [▓▓▓▓▓░]  [▓▓▓░░]  [▓▓▓▓▓░]  [▓░]          │
│   100%        80%        60%       90%        40%           │
└────────────────────────────────────────────────────────────┘

Width Variation Pattern:
Row 1: [████████] [██████]   [███]     [████████] [██]
Row 2: [██████]   [████████] [████]    [██████]   [████]
Row 3: [████████] [████]     [██████]  [███]      [██]
Row 4: [██████]   [████████] [███]     [████████] [████]
Row 5: [████████] [██████]   [████]    [██████]   [██]
```

### Pagination Skeleton Detail

```
┌────────────────────────────────────────────────────────────┐
│  Rows: [▓▓░]  Showing ▓▓▓▓▓▓▓░░  [▓] [▓] ▓▓▓░ [▓] [▓]     │
│                                                             │
│  └─ Selector  └─ Info text       └─ Nav buttons            │
└────────────────────────────────────────────────────────────┘
```

### Configurable Row Counts

```
Minimal (3 rows):
┌──────────────────────────────┐
│  ▓▓▓▓▓░  ▓▓▓▓░  ▓▓▓░        │
├──────────────────────────────┤
│  ▓▓▓▓░   ▓▓▓░   ▓▓▓▓░       │
│  ▓▓▓▓▓░  ▓▓▓▓░  ▓▓░         │
│  ▓▓▓░    ▓▓▓░   ▓▓▓▓░       │
└──────────────────────────────┘

Standard (5 rows):
┌──────────────────────────────┐
│  ▓▓▓▓▓░  ▓▓▓▓░  ▓▓▓░        │
├──────────────────────────────┤
│  ▓▓▓▓░   ▓▓▓░   ▓▓▓▓░       │
│  ▓▓▓▓▓░  ▓▓▓▓░  ▓▓░         │
│  ▓▓▓░    ▓▓▓░   ▓▓▓▓░       │
│  ▓▓▓▓░   ▓▓▓▓░  ▓▓░         │
│  ▓▓▓▓▓░  ▓▓▓░   ▓▓▓▓░       │
└──────────────────────────────┘

Extended (10 rows):
┌──────────────────────────────┐
│  ▓▓▓▓▓░  ▓▓▓▓░  ▓▓▓░        │
├──────────────────────────────┤
│  ▓▓▓▓░   ▓▓▓░   ▓▓▓▓░       │
│  ... (10 rows) ...           │
│  ▓▓▓▓▓░  ▓▓▓░   ▓▓▓▓░       │
└──────────────────────────────┘
```

### Component Options

```
Full Layout (default):
showToolbar = true
showHeader = true
rows = 5
showPagination = true

Simple Table:
showToolbar = false
showHeader = true
rows = 5
showPagination = false

Compact:
showToolbar = false
showHeader = true
rows = 3
showPagination = false
```

### Usage Example Structure

```
During Loading:
┌────────────────────────────────┐
│  <TableSkeleton               │
│    rows={5}                   │
│    columns={6}                │
│    showToolbar={true}         │
│    showPagination={true}      │
│  />                           │
└────────────────────────────────┘

After Loading:
┌────────────────────────────────┐
│  <DataTable                   │
│    columns={columns}          │
│    data={data}                │
│  />                           │
└────────────────────────────────┘
```

### Responsive Skeleton

```
Desktop (6 columns):
▓▓▓▓ | ▓▓▓▓ | ▓▓▓ | ▓▓▓▓ | ▓▓▓ | ▓▓

Tablet (4 columns):
▓▓▓▓ | ▓▓▓▓ | ▓▓▓ | ▓▓

Mobile (2-3 columns):
▓▓▓▓ | ▓▓▓▓ | ▓▓
```

### Expected Outcome
- Realistic table loading state
- Configurable row/column count
- Smooth loading experience
- Matches actual table structure
- Professional appearance

### Verification Checklist
- [ ] TableSkeleton component file created
- [ ] Component props interface defined
- [ ] Toolbar skeleton renders correctly
- [ ] Header skeleton renders correctly
- [ ] Body row skeletons render correctly
- [ ] Pagination skeleton renders correctly
- [ ] Row count prop works
- [ ] Column count prop works
- [ ] Show/hide options work
- [ ] Skeleton widths vary naturally
- [ ] Responsive behavior works
- [ ] Animation smooth and consistent
- [ ] Component exported correctly

---

## Task 72: Create CardSkeleton Component

### Overview
Create a CardSkeleton component that displays loading states for card-based layouts. This component is used in dashboard views, product grids, and other card-based interfaces, providing a consistent loading experience across the ERP system.

### Dependencies
- Task 70: Install Skeleton Component
- shadcn/ui Card component (if available)
- shadcn/ui Skeleton component

### Instructions

1. **Create CardSkeleton component file**
   - Create file at components/ui/card-skeleton.tsx
   - Import Skeleton component
   - Import Card component if using

2. **Define component props interface**
   - Add variant prop (default, compact, detailed)
   - Add showImage prop (show image skeleton, default true)
   - Add showActions prop (show action buttons, default true)
   - Add count prop (number of cards in grid, default 1)

3. **Create card wrapper structure**
   - Use Card component or custom div
   - Add proper padding and spacing
   - Match card component styling

4. **Create image/media skeleton**
   - Large rectangle at top of card
   - Aspect ratio (16:9 or 1:1)
   - Optional based on showImage prop

5. **Create title skeleton**
   - Prominent skeleton bar
   - 70-90% width for natural look
   - Larger height than body text

6. **Create description/body skeleton**
   - Multiple skeleton lines
   - Varying widths (100%, 95%, 75%)
   - 2-3 lines typical

7. **Create metadata skeleton**
   - Small skeleton elements
   - Represent dates, categories, tags
   - Optional badges/chips

8. **Create action buttons skeleton**
   - Small rectangular skeletons
   - Represent buttons
   - Position at bottom of card

9. **Create variant layouts**
   - Default: Image + title + description + actions
   - Compact: Title + brief description
   - Detailed: All elements including metadata

10. **Add grid layout support**
    - Render multiple cards based on count prop
    - Use grid or flex layout
    - Responsive columns

11. **Style component**
    - Match card component styling
    - Proper spacing and gaps
    - Support dark mode
    - Border and shadow matching

12. **Export component**
    - Export CardSkeleton component
    - Export props interface
    - Document variants

### CardSkeleton Component Layouts

```
Default Variant:
┌─────────────────────────────┐
│ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓ │ ← Image
│ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓ │
│ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓ │
├─────────────────────────────┤
│                             │
│ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓░░░░░        │ ← Title
│                             │
│ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓░░░      │ ← Description
│ ▓▓▓▓▓▓▓▓▓▓▓▓░░░░░░        │
│                             │
│ ▓▓░  ▓▓░                   │ ← Metadata
│                             │
│ [▓▓▓▓░]  [▓▓▓▓░]          │ ← Actions
└─────────────────────────────┘

Compact Variant:
┌─────────────────────────────┐
│ ▓▓▓▓▓▓▓▓▓▓▓▓▓░░░░░        │ ← Title
│                             │
│ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓░░░      │ ← Brief description
│                             │
│ ▓▓░  ▓▓░                   │ ← Metadata
└─────────────────────────────┘

Detailed Variant:
┌─────────────────────────────┐
│ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓ │ ← Image
│ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓ │
├─────────────────────────────┤
│                             │
│ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓░░░░░        │ ← Title
│                             │
│ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓░░░      │ ← Description
│ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓░░░░       │
│ ▓▓▓▓▓▓▓▓░░░░░░            │
│                             │
│ ▓▓░ ▓▓░ ▓▓░               │ ← Badges/Tags
│                             │
│ ▓▓▓░  |  ▓▓▓▓░  |  ▓▓▓░  │ ← Stats
│                             │
│ [▓▓▓▓░] [▓▓▓▓░] [▓▓░]    │ ← Actions
└─────────────────────────────┘
```

### Image Skeleton Variants

```
Square (1:1 aspect ratio):
┌───────────────┐
│ ▓▓▓▓▓▓▓▓▓▓▓▓ │
│ ▓▓▓▓▓▓▓▓▓▓▓▓ │
│ ▓▓▓▓▓▓▓▓▓▓▓▓ │
│ ▓▓▓▓▓▓▓▓▓▓▓▓ │
└───────────────┘

Wide (16:9 aspect ratio):
┌─────────────────────────────┐
│ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓ │
│ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓ │
└─────────────────────────────┘

Portrait (3:4 aspect ratio):
┌───────────────┐
│ ▓▓▓▓▓▓▓▓▓▓▓▓ │
│ ▓▓▓▓▓▓▓▓▓▓▓▓ │
│ ▓▓▓▓▓▓▓▓▓▓▓▓ │
│ ▓▓▓▓▓▓▓▓▓▓▓▓ │
│ ▓▓▓▓▓▓▓▓▓▓▓▓ │
└───────────────┘
```

### Grid Layout Examples

```
Single Card:
┌─────────────────────────────┐
│ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓ │
│ ▓▓▓▓▓▓░░░                  │
│ ▓▓▓▓▓▓▓▓▓░░░               │
└─────────────────────────────┘

Two Column Grid:
┌──────────────┐  ┌──────────────┐
│ ▓▓▓▓▓▓▓▓▓▓▓ │  │ ▓▓▓▓▓▓▓▓▓▓▓ │
│ ▓▓▓▓░░░     │  │ ▓▓▓▓░░░     │
│ ▓▓▓▓▓░░░    │  │ ▓▓▓▓▓░░░    │
└──────────────┘  └──────────────┘

Three Column Grid:
┌─────────┐  ┌─────────┐  ┌─────────┐
│ ▓▓▓▓▓▓▓ │  │ ▓▓▓▓▓▓▓ │  │ ▓▓▓▓▓▓▓ │
│ ▓▓▓░░   │  │ ▓▓▓░░   │  │ ▓▓▓░░   │
│ ▓▓▓▓░░  │  │ ▓▓▓▓░░  │  │ ▓▓▓▓░░  │
└─────────┘  └─────────┘  └─────────┘

Four Column Grid:
┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐
│ ▓▓▓▓ │ │ ▓▓▓▓ │ │ ▓▓▓▓ │ │ ▓▓▓▓ │
│ ▓▓░  │ │ ▓▓░  │ │ ▓▓░  │ │ ▓▓░  │
│ ▓▓▓░ │ │ ▓▓▓░ │ │ ▓▓▓░ │ │ ▓▓▓░ │
└──────┘ └──────┘ └──────┘ └──────┘
```

### Use Cases by Variant

| Variant | Elements | Use Case |
|---------|----------|----------|
| Default | Image, title, description, actions | Product cards, blog posts |
| Compact | Title, brief description | List view, sidebar items |
| Detailed | All elements + metadata + stats | Detailed product view, dashboards |

### Product Card Skeleton

```
┌─────────────────────────────┐
│ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓ │ ← Product image
│ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓ │
├─────────────────────────────┤
│                             │
│ ▓▓▓▓▓▓▓▓▓▓▓▓░░░░          │ ← Product name
│                             │
│ ▓▓░  ▓▓▓▓░                 │ ← Category, SKU
│                             │
│ ▓▓▓▓▓▓░░                   │ ← Price
│                             │
│ ▓▓░  ▓▓▓░                  │ ← Stock, rating
│                             │
│ [▓▓▓▓▓░]  [▓▓░]           │ ← Add to cart, wishlist
└─────────────────────────────┘
```

### Dashboard Card Skeleton

```
┌─────────────────────────────┐
│ ▓▓▓▓▓▓▓▓▓░░░░     [▓░]     │ ← Title + menu
│                             │
│     ▓▓▓▓▓                  │ ← Icon/stat
│                             │
│     ▓▓▓▓▓▓▓▓▓▓▓▓▓░░       │ ← Value
│                             │
│ ▓▓▓▓░  ▓▓░                 │ ← Subtitle, change
│                             │
│ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓  │ ← Chart/graph area
│ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓  │
└─────────────────────────────┘
```

### Notification/Activity Card Skeleton

```
┌─────────────────────────────┐
│ ┌──┐                        │
│ │▓▓│ ▓▓▓▓▓▓▓▓░░░░          │ ← Avatar + title
│ └──┘                        │
│     ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓░░░    │ ← Description
│     ▓▓▓▓▓▓▓▓░░░░          │
│                             │
│     ▓▓░                    │ ← Timestamp
└─────────────────────────────┘
```

### Responsive Grid Behavior

```
Desktop (4 columns):
[Card] [Card] [Card] [Card]
[Card] [Card] [Card] [Card]

Tablet (2-3 columns):
[Card] [Card] [Card]
[Card] [Card] [Card]

Mobile (1-2 columns):
[Card] [Card]
[Card] [Card]
```

### Expected Outcome
- Versatile card skeleton component
- Multiple layout variants
- Grid support for multiple cards
- Matches actual card styling
- Professional loading experience

### Verification Checklist
- [ ] CardSkeleton component file created
- [ ] Component props interface defined
- [ ] Default variant renders correctly
- [ ] Compact variant renders correctly
- [ ] Detailed variant renders correctly
- [ ] Image skeleton displays correctly
- [ ] Title skeleton renders
- [ ] Description skeleton renders
- [ ] Metadata skeleton renders
- [ ] Action buttons skeleton renders
- [ ] Grid layout works (multiple cards)
- [ ] Count prop works
- [ ] Show/hide options work
- [ ] Responsive behavior works
- [ ] Component exported correctly

---

## Summary

This document established comprehensive data display and loading state components for the ERP dashboard:

### Completed Components
- ✅ TanStack Table v8 installation and setup
- ✅ DataTable component with full feature set
- ✅ TablePagination component with navigation controls
- ✅ TableToolbar component with search, filters, and actions
- ✅ TableColumnToggle component for column visibility
- ✅ Skeleton component installation
- ✅ TableSkeleton component for table loading states
- ✅ CardSkeleton component for card loading states

### Key Features Implemented
1. **Advanced Table Functionality** - Sorting, filtering, pagination, selection, resizing, reordering
2. **Comprehensive Controls** - Global search, column filters, bulk actions, export
3. **User Customization** - Column visibility, saved preferences, responsive layouts
4. **Professional Loading States** - Skeleton loaders matching actual component structure
5. **Type Safety** - Full TypeScript support with generics
6. **Accessibility** - ARIA labels, keyboard navigation, screen reader support

### Next Steps
Proceed to [02_Tasks-73-80_Feedback-State-Components.md](02_Tasks-73-80_Feedback-State-Components.md) to implement feedback and state management components including alerts, toasts, badges, progress indicators, and empty states.

---

**Document Status:** ✅ Complete  
**Total Tasks:** 8  
**Total Lines:** ~975
