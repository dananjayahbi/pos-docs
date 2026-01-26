# Tasks 23-34: Data Table and Bulk Actions

> **Phase:** 07 - Frontend Infrastructure & ERP Dashboard  
> **SubPhase:** 08 - Product Management UI  
> **Group:** B - Product Listing Page  
> **Document:** 02 of 02  
> **Tasks Covered:** 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [01_Tasks-15-22_Page-Filters.md](01_Tasks-15-22_Page-Filters.md)

---

## Document Overview

This document covers the creation of the product data table with TanStack Table v8, including column definitions, custom cell components, server-side sorting and pagination, row selection, and bulk action capabilities. The table connects to the API through the useProducts hook and supports LKR currency formatting.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 23 | Create Product Data Table | Medium | 45 min |
| 24 | Define Product Table Columns | Medium | 40 min |
| 25 | Create Product Name Cell | Low | 25 min |
| 26 | Create Price Cell | Low | 20 min |
| 27 | Create Stock Cell | Low | 25 min |
| 28 | Create Status Badge Cell | Low | 20 min |
| 29 | Create Actions Cell | Low | 30 min |
| 30 | Implement Table Sorting | Medium | 35 min |
| 31 | Implement Table Pagination | Medium | 35 min |
| 32 | Implement Row Selection | Medium | 40 min |
| 33 | Create Bulk Actions Bar | Medium | 45 min |
| 34 | Connect Table to API | Medium | 40 min |

---

## Task 23: Create Product Data Table

### Overview
Create the ProductTable component using TanStack Table v8. This component serves as the main data display component for the product listing page, providing a foundation for columns, sorting, pagination, and row selection functionality.

### Dependencies
- Task 15: Create Product List Page Component
- TanStack Table v8 must be installed
- TypeScript types for Product model

### Instructions

1. **Create table component file**
   - Navigate to `frontend/components/modules/products/ProductList/` directory
   - Create new file named `ProductTable.tsx`
   - Set up TypeScript React functional component structure

2. **Import required dependencies**
   - Import React core (useState, useMemo)
   - Import TanStack Table v8 types and hooks (useReactTable, getCoreRowModel, ColumnDef)
   - Import Product type from types/models
   - Import UI components (Table from shadcn/ui)

3. **Define component props interface**
   - Create `ProductTableProps` interface
   - Include `data` prop (array of Product objects)
   - Include `isLoading` prop (boolean for loading state)
   - Include pagination props (page, pageSize, totalPages, onPageChange)
   - Include sorting props (sortBy, sortOrder, onSortChange)
   - Include selection props (selectedIds, onSelectionChange)

4. **Set up table state**
   - Initialize row selection state (useState for selectedRowIds)
   - Initialize sorting state (if needed for UI state)
   - Initialize pagination state (if needed for UI state)

5. **Create table instance**
   - Use useReactTable hook with configuration
   - Pass data and columns (from Task 24)
   - Configure getCoreRowModel for basic functionality
   - Set initial state for sorting and pagination

6. **Implement table markup structure**
   - Create table container div with proper styling
   - Use Table component from shadcn/ui
   - Create TableHeader with column headers
   - Create TableBody with data rows
   - Add loading state overlay or skeleton

7. **Handle empty state**
   - Display message when no products found
   - Show empty state illustration or icon
   - Provide action to create first product

8. **Add responsive wrapper**
   - Wrap table in horizontal scroll container for mobile
   - Use overflow-x-auto for scroll behavior
   - Ensure table maintains readability on small screens

### Table Architecture

```
ProductTable Component
├── Table Instance (TanStack Table)
│   ├── Configuration
│   │   ├── Data (products array)
│   │   ├── Columns (from Task 24)
│   │   ├── Row Model (core)
│   │   └── State (sorting, pagination, selection)
│   └── API Methods
│       ├── getHeaderGroups()
│       ├── getRowModel()
│       └── getSelectedRowModel()
├── UI Structure
│   ├── Table Container
│   ├── Table Header
│   ├── Table Body
│   └── Loading Overlay
└── States
    ├── Row Selection
    ├── Sorting
    └── Pagination
```

### Component Props Specification

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| data | Product[] | Yes | Array of product objects |
| isLoading | boolean | Yes | Loading state indicator |
| pagination | PaginationProps | Yes | Pagination configuration |
| sorting | SortingProps | Yes | Sorting configuration |
| onRowSelect | Function | Yes | Row selection callback |

### Table Structure Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│ Table Container (overflow-x-auto)                               │
│ ┌─────────────────────────────────────────────────────────────┐ │
│ │ Table Header                                                 │ │
│ │ ┌───┬─────────┬──────┬──────────┬───────┬───────┬──────┬───┐ │ │
│ │ │ □ │ Product │ SKU  │ Category │ Price │ Stock │Status│ ⋮ │ │ │
│ │ └───┴─────────┴──────┴──────────┴───────┴───────┴──────┴───┘ │ │
│ │ Table Body                                                   │ │
│ │ ┌───┬─────────┬──────┬──────────┬───────┬───────┬──────┬───┐ │ │
│ │ │ ☑ │[img] Pr1│ SK001│ Electron │ 2,500 │ 25 ● │Active│ ⋮ │ │ │
│ │ ├───┼─────────┼──────┼──────────┼───────┼───────┼──────┼───┤ │ │
│ │ │ □ │[img] Pr2│ SK002│ Clothing │ 1,200 │ 5 ●  │Draft │ ⋮ │ │ │
│ │ └───┴─────────┴──────┴──────────┴───────┴───────┴──────┴───┘ │ │
│ └─────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

### TanStack Table Configuration

| Config Option | Value | Purpose |
|---------------|-------|---------|
| data | products array | Data source |
| columns | columnDefinitions | Column config |
| getCoreRowModel | getCoreRowModel() | Basic row rendering |
| enableRowSelection | true | Allow row selection |
| enableMultiRowSelection | true | Multiple row selection |
| enableSorting | true | Enable sorting |
| manualSorting | true | Server-side sorting |
| manualPagination | true | Server-side pagination |

### Loading State Handling

| State | Display |
|-------|---------|
| Loading | Skeleton rows or spinner overlay |
| Empty | "No products found" message |
| Error | Error message with retry button |
| Success | Product data rows |

### Expected Outcome
- Functional table component using TanStack Table v8
- Proper TypeScript types for props and state
- Table structure ready for column definitions
- Loading and empty states handled
- Responsive container for mobile devices

### Verification Checklist
- [ ] `ProductTable.tsx` file created in correct directory
- [ ] TanStack Table v8 imported and configured
- [ ] Props interface defined with all required properties
- [ ] Table instance created with useReactTable hook
- [ ] Table markup structure implemented
- [ ] Loading state displays properly
- [ ] Empty state displays when no data
- [ ] Responsive container wraps table
- [ ] Component exports properly

---

## Task 24: Define Product Table Columns

### Overview
Define the column configuration for the product data table using TanStack Table's ColumnDef type. This task establishes the structure for all table columns including checkbox selection, product details, SKU, category, price, stock, status, and actions.

### Dependencies
- Task 23: Create Product Data Table

### Instructions

1. **Create columns definition file**
   - Navigate to `frontend/components/modules/products/ProductList/` directory
   - Create new file named `ProductTableColumns.tsx`
   - Set up for exporting column definitions

2. **Import required dependencies**
   - Import ColumnDef type from TanStack Table
   - Import Product type from types/models
   - Import cell components (Tasks 25-29)
   - Import necessary icons (sorting indicators)

3. **Define columns array**
   - Create and export `productColumns` constant
   - Type as `ColumnDef<Product>[]`
   - Define each column with appropriate properties

4. **Create selection column**
   - Add checkbox column as first column
   - Set id as "select"
   - Set fixed width (40px)
   - Disable sorting
   - Use Checkbox component in header and cells

5. **Create product name column**
   - Set id as "name"
   - Set header as "Product"
   - Set min-width (300px)
   - Enable sorting
   - Use ProductNameCell component (Task 25)

6. **Create SKU column**
   - Set id as "sku"
   - Set header as "SKU"
   - Set width (120px)
   - Enable sorting
   - Display as plain text

7. **Create category column**
   - Set id as "category"
   - Set header as "Category"
   - Set width (150px)
   - Disable sorting (or enable based on requirements)
   - Display category name

8. **Create price column**
   - Set id as "price"
   - Set header as "Price"
   - Set width (120px)
   - Enable sorting
   - Use PriceCell component (Task 26)

9. **Create stock column**
   - Set id as "stock"
   - Set header as "Stock"
   - Set width (100px)
   - Enable sorting
   - Use StockCell component (Task 27)

10. **Create status column**
    - Set id as "status"
    - Set header as "Status"
    - Set width (100px)
    - Disable sorting
    - Use StatusBadgeCell component (Task 28)

11. **Create actions column**
    - Set id as "actions"
    - Set header as empty string or "Actions"
    - Set fixed width (80px)
    - Disable sorting
    - Use ActionsCell component (Task 29)

12. **Add sorting indicators**
    - Include sort icons in sortable column headers
    - Show ascending/descending state
    - Add hover effects for sortable columns

### Column Configuration Structure

```
productColumns: ColumnDef<Product>[]
├── Selection Column
│   ├── id: "select"
│   ├── width: 40px
│   ├── sortable: false
│   └── cell: Checkbox
├── Product Name Column
│   ├── id: "name"
│   ├── minWidth: 300px
│   ├── sortable: true
│   └── cell: ProductNameCell
├── SKU Column
│   ├── id: "sku"
│   ├── width: 120px
│   ├── sortable: true
│   └── cell: Plain text
├── Category Column
│   ├── id: "category"
│   ├── width: 150px
│   ├── sortable: false
│   └── cell: Category name
├── Price Column
│   ├── id: "price"
│   ├── width: 120px
│   ├── sortable: true
│   └── cell: PriceCell (LKR formatted)
├── Stock Column
│   ├── id: "stock"
│   ├── width: 100px
│   ├── sortable: true
│   └── cell: StockCell (with indicator)
├── Status Column
│   ├── id: "status"
│   ├── width: 100px
│   ├── sortable: false
│   └── cell: StatusBadgeCell
└── Actions Column
    ├── id: "actions"
    ├── width: 80px
    ├── sortable: false
    └── cell: ActionsCell
```

### Column Specifications Table

| Column | ID | Width | Sortable | Component | Alignment |
|--------|----|----|----------|-----------|-----------|
| Checkbox | select | 40px | No | Checkbox | Center |
| Product | name | 300px | Yes | ProductNameCell | Left |
| SKU | sku | 120px | Yes | Text | Left |
| Category | category | 150px | No | Text | Left |
| Price | price | 120px | Yes | PriceCell | Right |
| Stock | stock | 100px | Yes | StockCell | Center |
| Status | status | 100px | No | StatusBadgeCell | Center |
| Actions | actions | 80px | No | ActionsCell | Center |

### Column Definition Pattern

Each column follows this structure:
- **id**: Unique identifier matching data property
- **header**: Display text or header component
- **cell**: Custom cell component or accessor
- **size**: Column width (fixed or min-width)
- **enableSorting**: Boolean for sort capability
- **meta**: Additional metadata (alignment, etc.)

### Sorting Configuration

| Column | Sort Type | Server Field |
|--------|-----------|--------------|
| Product | Alphabetical | name |
| SKU | Alphanumeric | sku |
| Price | Numeric | price |
| Stock | Numeric | stock_quantity |

### Header Component Structure

```
Column Header
├── Label Text
├── Sort Indicator (if sortable)
│   ├── Unsorted: ↕
│   ├── Ascending: ↑
│   └── Descending: ↓
└── Click Handler (if sortable)
```

### Expected Outcome
- Complete column definitions array ready for use
- All columns properly typed with ColumnDef<Product>
- Sortable columns configured correctly
- Cell components referenced for custom rendering
- Column widths optimized for content

### Verification Checklist
- [ ] `ProductTableColumns.tsx` file created
- [ ] All 8 columns defined (select, name, SKU, category, price, stock, status, actions)
- [ ] Column IDs match Product model properties
- [ ] Sortable columns configured with enableSorting: true
- [ ] Fixed widths set appropriately
- [ ] Cell components imported and referenced
- [ ] TypeScript types correct (ColumnDef<Product>[])
- [ ] Columns array exported for use in ProductTable

---

## Task 25: Create Product Name Cell

### Overview
Create the ProductNameCell component that displays the product name with thumbnail image in a table cell. This component provides a rich display format showing the product image, name, and optionally the SKU below the name.

### Dependencies
- Task 24: Define Product Table Columns

### Instructions

1. **Create cells directory**
   - Navigate to `frontend/components/modules/products/ProductList/` directory
   - Create new directory named `cells`
   - This will house all custom cell components

2. **Create ProductNameCell component file**
   - Create `ProductNameCell.tsx` in `cells/` directory
   - Set up TypeScript React functional component

3. **Define component props**
   - Create `ProductNameCellProps` interface
   - Include `product` prop with Product type
   - Include optional `showSku` prop (boolean, default true)

4. **Import dependencies**
   - Import Next.js Image component for thumbnail
   - Import Next.js Link component for navigation
   - Import Product type
   - Import placeholder image constant

5. **Implement thumbnail display**
   - Use Next.js Image with product thumbnail
   - Set fixed dimensions (40x40 pixels)
   - Add rounded corners (rounded-md)
   - Handle missing images with placeholder
   - Add object-cover for proper aspect ratio

6. **Implement name display**
   - Display product name as clickable link
   - Link to product detail page (/products/[id])
   - Apply truncation for long names
   - Use appropriate font weight (medium)
   - Add hover effect (text color change)

7. **Implement SKU display (optional)**
   - Show SKU below product name if showSku is true
   - Use smaller font size (text-sm)
   - Apply muted text color (text-gray-500)
   - Ensure proper spacing between name and SKU

8. **Create layout structure**
   - Use flexbox for horizontal layout
   - Align image and text content properly
   - Add gap between image and text
   - Ensure vertical alignment

### Component Structure

```
ProductNameCell
├── Container (flex, items-center, gap-3)
│   ├── Thumbnail Section
│   │   └── Next Image (40x40, rounded)
│   └── Text Section
│       ├── Product Name
│       │   └── Link to detail page
│       └── SKU (optional)
│           └── Small muted text
```

### Component Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| product | Product | Yes | - | Product data object |
| showSku | boolean | No | true | Show SKU below name |

### Visual Layout

```
┌──────────────────────────────────────┐
│ ┌────┐  Product Name (Clickable)    │
│ │ ▓▓ │  SKU: PR-12345                │
│ │ ▓▓ │  (small, muted)               │
│ └────┘                                │
│  40x40                                │
└──────────────────────────────────────┘
```

### Styling Specifications

| Element | Tailwind Classes | Purpose |
|---------|------------------|---------|
| Container | `flex items-center gap-3` | Layout structure |
| Thumbnail | `w-10 h-10 rounded-md object-cover` | Image display |
| Name Link | `font-medium hover:text-blue-600 truncate` | Interactive name |
| SKU Text | `text-sm text-gray-500` | Secondary info |

### Thumbnail Handling

| Scenario | Implementation |
|----------|----------------|
| Image exists | Display product.thumbnail |
| No image | Display placeholder image |
| Loading error | Fallback to placeholder |
| Alt text | Use product name |

### Navigation Logic

| Element | Destination | Purpose |
|---------|-------------|---------|
| Name Link | `/products/[id]` | View product details |
| Thumbnail | No link (or same as name) | Visual element |

### Text Truncation

```
Product Name Scenarios:
├── Short name: "iPhone 14" → Displays fully
├── Medium name: "Samsung Galaxy S23 Ultra" → Displays fully
└── Long name: "Sony WH-1000XM5 Wireless..." → Truncates with ellipsis
```

### Expected Outcome
- Reusable cell component for product name display
- Thumbnail image with proper sizing and fallback
- Clickable product name linking to detail page
- Optional SKU display below name
- Proper text truncation for long names

### Verification Checklist
- [ ] `ProductNameCell.tsx` created in cells directory
- [ ] Component accepts product prop
- [ ] Thumbnail displays with 40x40 dimensions
- [ ] Placeholder image used when thumbnail missing
- [ ] Product name is clickable link to detail page
- [ ] SKU displays below name (if enabled)
- [ ] Text truncation works for long names
- [ ] Hover effect applied to name link
- [ ] Component exports properly

---

## Task 26: Create Price Cell

### Overview
Create the PriceCell component that formats and displays product prices in Sri Lankan Rupees (LKR) with proper thousand separators and decimal places. This component ensures consistent currency formatting across the product table.

### Dependencies
- Task 24: Define Product Table Columns

### Instructions

1. **Create PriceCell component file**
   - Create `PriceCell.tsx` in `cells/` directory
   - Set up TypeScript React functional component

2. **Define component props**
   - Create `PriceCellProps` interface
   - Include `price` prop (number)
   - Include optional `currency` prop (default "LKR")

3. **Create price formatting utility**
   - Create helper function `formatPrice`
   - Accept price number and currency code
   - Return formatted string with LKR prefix and commas

4. **Implement formatting logic**
   - Add thousand separators (commas)
   - Show two decimal places (.00)
   - Add LKR prefix
   - Handle zero and null values

5. **Apply cell styling**
   - Right-align text for numerical data
   - Use tabular numbers font variant (font-variant-numeric: tabular-nums)
   - Apply appropriate font weight
   - Ensure consistent spacing

6. **Handle edge cases**
   - Zero price: Display "LKR 0.00"
   - Null/undefined: Display "—" or "N/A"
   - Negative price: Display with minus sign (if applicable)
   - Very large numbers: Ensure proper formatting

7. **Consider locale formatting**
   - Use Intl.NumberFormat for proper formatting
   - Set locale to 'en-LK' for Sri Lankan format
   - Configure currency display options

### Component Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| price | number | Yes | - | Price value to format |
| currency | string | No | "LKR" | Currency code |

### Price Formatting Examples

| Input | Output | Notes |
|-------|--------|-------|
| 2500 | LKR 2,500.00 | Standard format |
| 125000 | LKR 125,000.00 | With thousand separator |
| 1250000 | LKR 1,250,000.00 | Multiple separators |
| 99.99 | LKR 99.99 | Preserves decimals |
| 100 | LKR 100.00 | Adds decimal places |
| 0 | LKR 0.00 | Zero value |
| null | — | Null handling |

### Formatting Function Structure

```
formatPrice(price: number, currency: string = 'LKR')
├── Check for null/undefined
├── Convert to number if needed
├── Apply Intl.NumberFormat
│   ├── locale: 'en-LK'
│   ├── style: 'currency'
│   ├── currency: 'LKR'
│   └── minimumFractionDigits: 2
└── Return formatted string
```

### Intl.NumberFormat Configuration

| Option | Value | Purpose |
|--------|-------|---------|
| locale | 'en-LK' | Sri Lankan English |
| style | 'currency' | Currency formatting |
| currency | 'LKR' | Sri Lankan Rupee |
| minimumFractionDigits | 2 | Always show .00 |
| maximumFractionDigits | 2 | Max two decimals |

### Cell Styling

| Style Property | CSS/Tailwind | Purpose |
|----------------|--------------|---------|
| Text Align | `text-right` | Numerical alignment |
| Font Variant | `tabular-nums` | Consistent digit width |
| Font Weight | `font-medium` | Emphasis |
| Color | `text-gray-900` | High contrast |

### Visual Alignment

```
Price Column (Right-aligned)
┌──────────────────┐
│      LKR 2,500.00│
│      LKR 1,200.00│
│     LKR 15,000.00│
│    LKR 125,000.00│
└──────────────────┘
    ↑ Digits align
```

### Expected Outcome
- Reusable price cell component with LKR formatting
- Thousand separators for readability
- Consistent decimal places (.00)
- Right-aligned text for numerical data
- Proper null/zero value handling

### Verification Checklist
- [ ] `PriceCell.tsx` created in cells directory
- [ ] Component accepts price prop
- [ ] Price formatted with LKR prefix
- [ ] Thousand separators applied (commas)
- [ ] Two decimal places always shown
- [ ] Text right-aligned
- [ ] Tabular numbers font variant applied
- [ ] Null values handled gracefully
- [ ] Large numbers format correctly
- [ ] Component exports properly

---

## Task 27: Create Stock Cell

### Overview
Create the StockCell component that displays stock quantity with a visual indicator showing stock level status (normal, low stock, out of stock). This component helps users quickly identify inventory issues.

### Dependencies
- Task 24: Define Product Table Columns

### Instructions

1. **Create StockCell component file**
   - Create `StockCell.tsx` in `cells/` directory
   - Set up TypeScript React functional component

2. **Define component props**
   - Create `StockCellProps` interface
   - Include `quantity` prop (number)
   - Include optional `lowStockThreshold` prop (default 10)

3. **Create stock level logic**
   - Define helper function `getStockLevel`
   - Return "out" if quantity is 0
   - Return "low" if quantity is 1-10 (or threshold)
   - Return "normal" if quantity > 10

4. **Implement indicator component**
   - Create colored dot indicator
   - Green for normal stock (>10)
   - Yellow/amber for low stock (1-10)
   - Red for out of stock (0)
   - Use rounded-full with appropriate size

5. **Display stock quantity**
   - Show numerical quantity value
   - Center-align text
   - Use appropriate font weight
   - Add spacing between indicator and number

6. **Apply conditional styling**
   - Match text color to indicator color
   - Normal: text-green-700
   - Low: text-amber-700
   - Out: text-red-700

7. **Create layout structure**
   - Use flexbox for horizontal layout
   - Center align items vertically
   - Add gap between indicator and quantity
   - Justify content to center

### Component Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| quantity | number | Yes | - | Current stock quantity |
| lowStockThreshold | number | No | 10 | Threshold for low stock |

### Stock Level Logic

| Stock Quantity | Level | Indicator Color | Text Color |
|----------------|-------|-----------------|------------|
| 0 | Out of Stock | Red (bg-red-500) | text-red-700 |
| 1-10 | Low Stock | Amber (bg-amber-500) | text-amber-700 |
| 11+ | Normal | Green (bg-green-500) | text-green-700 |

### Component Structure

```
StockCell
├── Container (flex, items-center, justify-center, gap-2)
│   ├── Indicator Dot
│   │   ├── Size: w-2 h-2
│   │   ├── Shape: rounded-full
│   │   └── Color: Based on stock level
│   └── Quantity Text
│       ├── Value: Stock number
│       └── Color: Matches indicator
```

### Visual Display

```
Stock Cell Examples:
┌──────────────┐
│  ● 25        │  ← Green dot, Normal stock
├──────────────┤
│  ● 5         │  ← Yellow dot, Low stock
├──────────────┤
│  ● 0         │  ← Red dot, Out of stock
└──────────────┘
```

### Indicator Styling

| Level | Dot Class | Text Class | Description |
|-------|-----------|------------|-------------|
| Normal | `bg-green-500` | `text-green-700` | Stock healthy |
| Low | `bg-amber-500` | `text-amber-700` | Needs attention |
| Out | `bg-red-500` | `text-red-700` | Critical |

### Stock Level Function

```
getStockLevel(quantity: number, threshold: number = 10)
├── if quantity === 0 → return 'out'
├── if quantity <= threshold → return 'low'
└── else → return 'normal'
```

### Layout Specifications

| Element | Tailwind Classes | Purpose |
|---------|------------------|---------|
| Container | `flex items-center justify-center gap-2` | Centered layout |
| Indicator | `w-2 h-2 rounded-full` | Circular dot |
| Quantity | `font-medium` | Emphasized number |

### Accessibility Considerations

| Feature | Implementation |
|---------|----------------|
| Color + Text | Don't rely solely on color |
| ARIA Label | Add descriptive label |
| Screen Reader | Include stock level text |

### Expected Outcome
- Stock cell component with visual indicators
- Color-coded dots for stock levels
- Matching text colors for consistency
- Quick visual identification of stock issues
- Centered alignment in table cell

### Verification Checklist
- [ ] `StockCell.tsx` created in cells directory
- [ ] Component accepts quantity prop
- [ ] Stock level logic implemented correctly
- [ ] Green indicator for normal stock (>10)
- [ ] Yellow indicator for low stock (1-10)
- [ ] Red indicator for out of stock (0)
- [ ] Quantity displayed with indicator
- [ ] Text color matches indicator color
- [ ] Center alignment applied
- [ ] Component exports properly

---

## Task 28: Create Status Badge Cell

### Overview
Create the StatusBadgeCell component that displays product status (Active, Draft, Archived) using colored badge components. This component provides clear visual indication of product status in the table.

### Dependencies
- Task 24: Define Product Table Columns

### Instructions

1. **Create StatusBadgeCell component file**
   - Create `StatusBadgeCell.tsx` in `cells/` directory
   - Set up TypeScript React functional component

2. **Define component props**
   - Create `StatusBadgeCellProps` interface
   - Include `status` prop (ProductStatus enum or string)

3. **Import or create Badge component**
   - Import Badge from shadcn/ui components
   - Or create inline badge component
   - Ensure support for variant prop

4. **Define status variants**
   - Active: Green badge (success variant)
   - Draft: Yellow/amber badge (warning variant)
   - Archived: Gray badge (secondary variant)

5. **Implement status mapping**
   - Create helper function `getStatusVariant`
   - Map ProductStatus enum to badge variant
   - Return appropriate variant name

6. **Render badge component**
   - Display Badge with status text
   - Apply correct variant based on status
   - Center badge in table cell

7. **Add status text formatting**
   - Capitalize status text
   - Use appropriate font size
   - Ensure readability

### Component Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| status | ProductStatus \| string | Yes | Product status value |

### Status Badge Variants

| Status | Variant | Background | Text Color | Use Case |
|--------|---------|------------|------------|----------|
| Active | Success | bg-green-100 | text-green-800 | Live products |
| Draft | Warning | bg-amber-100 | text-amber-800 | Work in progress |
| Archived | Secondary | bg-gray-100 | text-gray-800 | Inactive products |

### Component Structure

```
StatusBadgeCell
├── Container (flex, justify-center)
│   └── Badge Component
│       ├── Variant: Based on status
│       ├── Text: Status name
│       └── Styling: Padding, rounded
```

### Visual Display

```
Status Badges:
┌────────────────┐
│   ● Active     │  ← Green badge
├────────────────┤
│   ● Draft      │  ← Yellow badge
├────────────────┤
│   ● Archived   │  ← Gray badge
└────────────────┘
```

### Badge Styling Specifications

| Status | Badge Classes | Purpose |
|--------|---------------|---------|
| Active | `bg-green-100 text-green-800 border-green-200` | Success state |
| Draft | `bg-amber-100 text-amber-800 border-amber-200` | Warning state |
| Archived | `bg-gray-100 text-gray-800 border-gray-200` | Neutral state |

### Status Mapping Function

```
getStatusVariant(status: ProductStatus)
├── if status === 'ACTIVE' → return 'success'
├── if status === 'DRAFT' → return 'warning'
└── if status === 'ARCHIVED' → return 'secondary'
```

### Badge Component Structure

If creating inline badge:
- Container: inline-flex, items-center
- Padding: px-2.5 py-0.5
- Border radius: rounded-full
- Font size: text-xs
- Font weight: font-medium
- Border: border

### ProductStatus Type

```
enum ProductStatus {
  ACTIVE = 'ACTIVE',
  DRAFT = 'DRAFT',
  ARCHIVED = 'ARCHIVED'
}
```

### Layout and Alignment

| Element | Alignment | Classes |
|---------|-----------|---------|
| Container | Center | `flex justify-center` |
| Badge | Inline | `inline-flex` |
| Text | Center | `text-center` |

### Expected Outcome
- Status badge component with color variants
- Clear visual distinction between statuses
- Consistent badge styling across table
- Centered alignment in table cell
- Proper status text formatting

### Verification Checklist
- [ ] `StatusBadgeCell.tsx` created in cells directory
- [ ] Component accepts status prop
- [ ] Badge component imported or created
- [ ] Active status shows green badge
- [ ] Draft status shows yellow badge
- [ ] Archived status shows gray badge
- [ ] Badge centered in cell
- [ ] Status text properly capitalized
- [ ] Appropriate padding and rounded corners
- [ ] Component exports properly

---

## Task 29: Create Actions Cell

### Overview
Create the ActionsCell component that displays action buttons (View, Edit, Delete) in a dropdown menu for each product row. This component provides access to product-specific actions without cluttering the table.

### Dependencies
- Task 24: Define Product Table Columns

### Instructions

1. **Create ActionsCell component file**
   - Create `ActionsCell.tsx` in `cells/` directory
   - Set up TypeScript React functional component

2. **Define component props**
   - Create `ActionsCellProps` interface
   - Include `productId` prop (string)
   - Include `productName` prop (string, for confirmation)
   - Include optional callback props (onView, onEdit, onDelete)

3. **Import required components**
   - Import DropdownMenu from shadcn/ui
   - Import Button component
   - Import icons (MoreVertical, Eye, Pencil, Trash)
   - Import Next.js useRouter for navigation

4. **Create dropdown menu structure**
   - Add trigger button with three-dot icon (MoreVertical)
   - Configure DropdownMenu with proper positioning
   - Create DropdownMenuContent with action items

5. **Add View action**
   - Create DropdownMenuItem for View
   - Add Eye icon
   - Navigate to product detail page on click
   - Link: `/products/[productId]`

6. **Add Edit action**
   - Create DropdownMenuItem for Edit
   - Add Pencil icon
   - Navigate to product edit page on click
   - Link: `/products/[productId]/edit`

7. **Add Delete action**
   - Create DropdownMenuItem for Delete
   - Add Trash icon with red color
   - Show confirmation dialog before deletion
   - Call onDelete callback with productId

8. **Implement confirmation dialog**
   - Create or import AlertDialog component
   - Show product name in confirmation message
   - Include Cancel and Delete buttons
   - Handle deletion on confirm

9. **Add loading and error states**
   - Disable menu during deletion
   - Show loading spinner if needed
   - Handle deletion errors with toast notification

### Component Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| productId | string | Yes | Product identifier |
| productName | string | Yes | For confirmation dialog |
| onView | Function | No | Custom view handler |
| onEdit | Function | No | Custom edit handler |
| onDelete | Function | No | Delete handler |

### Actions Structure

```
ActionsCell
├── DropdownMenu
│   ├── Trigger (Three-dot button)
│   └── Content
│       ├── View Item
│       │   ├── Icon: Eye
│       │   └── Action: Navigate to detail
│       ├── Edit Item
│       │   ├── Icon: Pencil
│       │   └── Action: Navigate to edit
│       └── Delete Item
│           ├── Icon: Trash (red)
│           └── Action: Show confirmation
└── AlertDialog (Delete confirmation)
    ├── Title: "Delete Product"
    ├── Description: Confirmation message
    └── Actions: Cancel, Delete
```

### Action Menu Items

| Action | Icon | Color | Behavior |
|--------|------|-------|----------|
| View | Eye | Default | Navigate to `/products/[id]` |
| Edit | Pencil | Default | Navigate to `/products/[id]/edit` |
| Delete | Trash | Red (destructive) | Show confirmation dialog |

### Visual Layout

```
Actions Cell:
┌─────┐
│  ⋮  │  ← Three-dot button
└─────┘
    │
    ▼ (On click)
┌──────────────────┐
│ 👁 View          │
├──────────────────┤
│ ✏  Edit          │
├──────────────────┤
│ 🗑 Delete        │  ← Red text
└──────────────────┘
```

### Dropdown Menu Configuration

| Property | Value | Purpose |
|----------|-------|---------|
| align | "end" | Right-align menu |
| sideOffset | 5 | Spacing from trigger |
| className | "w-40" | Menu width |

### Delete Confirmation Dialog

```
┌─────────────────────────────────────┐
│ Delete Product                      │
├─────────────────────────────────────┤
│ Are you sure you want to delete     │
│ "[Product Name]"?                   │
│                                     │
│ This action cannot be undone.       │
│                                     │
│              [Cancel] [Delete]      │
└─────────────────────────────────────┘
```

### Action Handlers

| Action | Handler Flow |
|--------|--------------|
| View | router.push(`/products/${productId}`) |
| Edit | router.push(`/products/${productId}/edit`) |
| Delete | Open dialog → Confirm → Call onDelete → Show toast |

### State Management

| State | Purpose |
|-------|---------|
| isOpen | Dropdown menu visibility |
| showDeleteDialog | Delete confirmation visibility |
| isDeleting | Loading state during deletion |

### Expected Outcome
- Actions dropdown menu with three action items
- View and Edit actions navigate to appropriate pages
- Delete action shows confirmation dialog
- Proper icons and styling for each action
- Loading and error handling for deletion

### Verification Checklist
- [ ] `ActionsCell.tsx` created in cells directory
- [ ] Component accepts productId and productName props
- [ ] DropdownMenu implemented with three-dot trigger
- [ ] View action navigates to detail page
- [ ] Edit action navigates to edit page
- [ ] Delete action shows confirmation dialog
- [ ] Confirmation dialog displays product name
- [ ] Delete button styled in red (destructive)
- [ ] Deletion calls onDelete callback
- [ ] Toast notification shown on success/error
- [ ] Component exports properly

---

## Task 30: Implement Table Sorting

### Overview
Implement server-side sorting functionality for the product table. This task enables users to sort products by name, SKU, price, and stock quantity, with sort state managed by URL parameters and API requests.

### Dependencies
- Task 23: Create Product Data Table
- Task 24: Define Product Table Columns

### Instructions

1. **Define sorting types and interfaces**
   - Create SortField type (name, sku, price, stock)
   - Create SortOrder type (asc, desc)
   - Create SortingState interface with field and order

2. **Set up sorting state management**
   - Use URL search params for sorting state
   - Parse sortBy and sortOrder from query parameters
   - Create functions to update URL params on sort change

3. **Configure TanStack Table sorting**
   - Set manualSorting to true (server-side)
   - Pass sorting state to table instance
   - Configure onSortingChange callback

4. **Implement sort header component**
   - Create reusable SortableHeader component
   - Display column label with sort indicator
   - Show unsorted, ascending, descending states
   - Handle click to toggle sort direction

5. **Add sort indicators**
   - Unsorted: Up/down arrows (↕)
   - Ascending: Up arrow only (↑)
   - Descending: Down arrow only (↓)
   - Apply active state styling

6. **Update column definitions**
   - Add sort capability to sortable columns
   - Pass SortableHeader to header prop
   - Configure header component with column info

7. **Implement sort change handler**
   - Create handleSortChange function
   - Toggle sort order if same column
   - Set ascending if new column
   - Update URL parameters
   - Trigger data refetch

8. **Connect sorting to API**
   - Pass sortBy and sortOrder to useProducts hook
   - Ensure API query includes sort parameters
   - Handle loading state during sort changes

### Sorting Configuration

```
Sortable Columns:
├── Product Name (name)
│   └── Alphabetical (A-Z, Z-A)
├── SKU (sku)
│   └── Alphanumeric
├── Price (price)
│   └── Numerical (Low-High, High-Low)
└── Stock (stock)
    └── Numerical (Low-High, High-Low)
```

### Sorting State Structure

| State Field | Type | Values | Description |
|-------------|------|--------|-------------|
| sortBy | string | "name", "sku", "price", "stock" | Field to sort by |
| sortOrder | string | "asc", "desc" | Sort direction |

### Sort Indicators Visual

```
Column Header States:
┌─────────────────────┐
│ Product Name  ↕    │  ← Unsorted (hoverable)
├─────────────────────┤
│ Product Name  ↑    │  ← Ascending (active)
├─────────────────────┤
│ Product Name  ↓    │  ← Descending (active)
└─────────────────────┘
```

### URL Parameter Structure

| Parameter | Example Value | Description |
|-----------|---------------|-------------|
| sortBy | "name" | Field to sort by |
| sortOrder | "asc" | Sort direction |

Example URL: `/products?sortBy=price&sortOrder=desc`

### Sort Toggle Logic

```
handleSortChange(column: string)
├── If column === currentSortBy
│   └── Toggle sortOrder (asc ↔ desc)
└── Else (new column)
    ├── Set sortBy = column
    └── Set sortOrder = 'asc'
```

### TanStack Table Sorting Configuration

| Config Option | Value | Purpose |
|---------------|-------|---------|
| manualSorting | true | Server-side sorting |
| onSortingChange | Function | Handle sort changes |
| state.sorting | Array | Current sort state |

### SortableHeader Component

```
SortableHeader Props:
├── column: Column object
├── label: Display text
├── sortBy: Current sort field
├── sortOrder: Current sort order
└── onSort: Sort change handler

Component Structure:
└── Button (clickable header)
    ├── Label text
    └── Sort indicator icon
        ├── Unsorted: ChevronsUpDown
        ├── Asc: ChevronUp
        └── Desc: ChevronDown
```

### Sorting Implementation Flow

```
User clicks column header
        ↓
handleSortChange called
        ↓
Update URL parameters
        ↓
URL change triggers useEffect
        ↓
Update sorting state
        ↓
Call useProducts with new sort params
        ↓
API request with sort query
        ↓
Receive sorted data
        ↓
Table re-renders with sorted products
```

### Expected Outcome
- Sortable column headers with visual indicators
- Server-side sorting via API
- Sort state persisted in URL
- Smooth toggling between sort directions
- Loading state during sort operations

### Verification Checklist
- [ ] Sorting types and interfaces defined
- [ ] URL parameters used for sort state
- [ ] TanStack Table configured with manualSorting
- [ ] SortableHeader component created
- [ ] Sort indicators display correctly (↕ ↑ ↓)
- [ ] Clicking header toggles sort direction
- [ ] Product Name column sortable
- [ ] SKU column sortable
- [ ] Price column sortable
- [ ] Stock column sortable
- [ ] Sort parameters passed to API
- [ ] Table updates with sorted data
- [ ] Active sort column highlighted

---

## Task 31: Implement Table Pagination

### Overview
Implement server-side pagination for the product table with page controls, page size selector, and page information display. This task enables efficient browsing of large product datasets.

### Dependencies
- Task 23: Create Product Data Table

### Instructions

1. **Define pagination types**
   - Create PaginationState interface (page, pageSize, totalPages, totalItems)
   - Define page size options (10, 20, 50, 100)

2. **Set up pagination state management**
   - Use URL search params for page and pageSize
   - Parse pagination values from query parameters
   - Create functions to update URL params

3. **Configure TanStack Table pagination**
   - Set manualPagination to true (server-side)
   - Pass pagination state to table instance
   - Configure onPaginationChange callback

4. **Create pagination controls component**
   - Create ProductTablePagination component
   - Include previous/next buttons
   - Add page number display
   - Add page size selector

5. **Implement page navigation**
   - Add "Previous" button (disabled on first page)
   - Add "Next" button (disabled on last page)
   - Add first/last page buttons (optional)
   - Update URL params on navigation

6. **Add page size selector**
   - Create Select dropdown for page size
   - Options: 10, 20, 50, 100 per page
   - Reset to page 1 when page size changes
   - Update URL params on selection

7. **Display pagination information**
   - Show current page number and total pages
   - Show item range (e.g., "Showing 1-10 of 47")
   - Update dynamically based on state

8. **Connect pagination to API**
   - Pass page and pageSize to useProducts hook
   - Receive totalPages and totalItems from API
   - Handle loading state during page changes

9. **Add keyboard navigation (optional)**
   - Left/Right arrows for previous/next page
   - Home/End keys for first/last page

### Pagination State Structure

| State Field | Type | Description |
|-------------|------|-------------|
| page | number | Current page (1-indexed) |
| pageSize | number | Items per page |
| totalPages | number | Total number of pages |
| totalItems | number | Total number of products |

### Pagination Controls Layout

```
┌────────────────────────────────────────────────────────────┐
│ Showing 11-20 of 47 products                               │
│                                                            │
│ [10 per page ▼]  [First] [< Prev] Page 2 of 5 [Next >] [Last] │
└────────────────────────────────────────────────────────────┘
```

### Page Size Options

| Option | Value | Use Case |
|--------|-------|----------|
| Small | 10 | Quick overview |
| Default | 20 | Standard view |
| Medium | 50 | More items |
| Large | 100 | Bulk review |

### URL Parameter Structure

| Parameter | Example | Description |
|-----------|---------|-------------|
| page | "2" | Current page number |
| pageSize | "20" | Items per page |

Example URL: `/products?page=2&pageSize=20`

### Pagination Component Structure

```
ProductTablePagination
├── Info Section
│   └── "Showing X-Y of Z products"
├── Controls Section
│   ├── Page Size Selector
│   │   └── Select dropdown (10, 20, 50, 100)
│   └── Navigation Buttons
│       ├── First Page (optional)
│       ├── Previous Page
│       ├── Page Display (Page X of Y)
│       ├── Next Page
│       └── Last Page (optional)
```

### Button States

| Button | Enabled When | Disabled When |
|--------|--------------|---------------|
| First | page > 1 | page === 1 |
| Previous | page > 1 | page === 1 |
| Next | page < totalPages | page === totalPages |
| Last | page < totalPages | page === totalPages |

### Page Information Calculation

```
Calculate Item Range:
├── startItem = (page - 1) * pageSize + 1
├── endItem = min(page * pageSize, totalItems)
└── Display: "Showing {startItem}-{endItem} of {totalItems}"

Example (page=2, pageSize=20, total=47):
└── "Showing 21-40 of 47 products"
```

### Navigation Handler Logic

```
handlePageChange(newPage: number)
├── Validate newPage (1 <= newPage <= totalPages)
├── Update URL parameter: page = newPage
└── Trigger data refetch

handlePageSizeChange(newSize: number)
├── Update URL parameter: pageSize = newSize
├── Reset to page 1
└── Trigger data refetch
```

### TanStack Table Pagination Configuration

| Config Option | Value | Purpose |
|---------------|-------|---------|
| manualPagination | true | Server-side pagination |
| pageCount | totalPages | Total pages available |
| state.pagination | Object | Current page state |
| onPaginationChange | Function | Handle page changes |

### Pagination Flow

```
User clicks Next button
        ↓
handlePageChange(page + 1)
        ↓
Update URL: ?page=3
        ↓
URL change triggers useEffect
        ↓
Update pagination state
        ↓
Call useProducts with page=3
        ↓
API request with pagination params
        ↓
Receive page 3 data
        ↓
Table re-renders with new data
        ↓
Update pagination controls
```

### Expected Outcome
- Functional pagination controls at bottom of table
- Page navigation with previous/next buttons
- Page size selector with multiple options
- Page information display showing item range
- Server-side pagination via API
- Pagination state persisted in URL

### Verification Checklist
- [ ] Pagination types and interfaces defined
- [ ] URL parameters used for pagination state
- [ ] TanStack Table configured with manualPagination
- [ ] ProductTablePagination component created
- [ ] Previous/Next buttons functional
- [ ] Buttons disabled appropriately (first/last page)
- [ ] Page size selector with options (10, 20, 50, 100)
- [ ] Page information displays correctly
- [ ] Changing page size resets to page 1
- [ ] Pagination params passed to API
- [ ] Table updates with new page data
- [ ] Loading state shown during page changes

---

## Task 32: Implement Row Selection

### Overview
Implement row selection functionality with checkboxes for each row and a select-all checkbox in the header. This task enables users to select multiple products for bulk operations.

### Dependencies
- Task 23: Create Product Data Table
- Task 24: Define Product Table Columns

### Instructions

1. **Set up selection state**
   - Add rowSelection state to component
   - Use useState with Record<string, boolean> type
   - Initialize as empty object

2. **Configure TanStack Table selection**
   - Set enableRowSelection to true
   - Set enableMultiRowSelection to true
   - Pass rowSelection state to table instance
   - Configure onRowSelectionChange callback

3. **Add selection column**
   - Update column definitions (Task 24)
   - Add checkbox column as first column
   - Set fixed width (40px)
   - Disable sorting for this column

4. **Create header checkbox**
   - Add Checkbox in selection column header
   - Check state: all rows selected, some rows, none
   - Display indeterminate state when some selected
   - Handle select-all / deselect-all on toggle

5. **Create row checkboxes**
   - Add Checkbox in each row's selection cell
   - Bind to row selection state
   - Handle individual row toggle
   - Use product ID as row identifier

6. **Implement select-all logic**
   - Select all rows on current page only
   - Clear all selections when header unchecked
   - Handle indeterminate state (some but not all)

7. **Track selected products**
   - Create helper to get selected product IDs
   - Convert rowSelection object to ID array
   - Expose selectedIds to parent component

8. **Update parent component**
   - Pass selection state to ProductTable
   - Expose onSelectionChange callback
   - Track selectedIds in parent state
   - Pass to BulkActionsBar (Task 33)

9. **Add selection feedback**
   - Highlight selected rows with background color
   - Show selection count in bulk actions bar
   - Clear selections after bulk action completion

### Selection State Structure

```
rowSelection State:
{
  "product-id-1": true,
  "product-id-3": true,
  "product-id-5": true
}

Converts to:
selectedIds: ["product-id-1", "product-id-3", "product-id-5"]
```

### Selection Column Definition

```
Selection Column:
├── id: "select"
├── width: 40px
├── enableSorting: false
├── header: ({ table }) => HeaderCheckbox
└── cell: ({ row }) => RowCheckbox
```

### Checkbox States

| Checkbox | State | Visual | Description |
|----------|-------|--------|-------------|
| Header | Unchecked | □ | No rows selected |
| Header | Indeterminate | ⊟ | Some rows selected |
| Header | Checked | ☑ | All rows selected |
| Row | Unchecked | □ | Row not selected |
| Row | Checked | ☑ | Row selected |

### Visual Layout with Selection

```
┌───┬────────────────────────────────────────────┐
│ ⊟ │ Product | SKU | Category | Price | ...   │  ← Indeterminate header
├───┼────────────────────────────────────────────┤
│ ☑ │ Product 1 | ... | ... | ...               │  ← Selected row (highlighted)
├───┼────────────────────────────────────────────┤
│ □ │ Product 2 | ... | ... | ...               │  ← Unselected row
├───┼────────────────────────────────────────────┤
│ ☑ │ Product 3 | ... | ... | ...               │  ← Selected row (highlighted)
└───┴────────────────────────────────────────────┘
```

### Header Checkbox Logic

```
Header Checkbox State:
├── checked: All current page rows selected
├── indeterminate: Some but not all rows selected
└── onChange: Toggle all rows on current page

Calculation:
├── totalRows = table.getRowModel().rows.length
├── selectedRows = Object.keys(rowSelection).length
├── checked = totalRows > 0 && selectedRows === totalRows
└── indeterminate = selectedRows > 0 && selectedRows < totalRows
```

### Row Checkbox Logic

```
Row Checkbox:
├── checked: row.getIsSelected()
├── onChange: row.toggleSelected()
└── disabled: row.getCanSelect()
```

### TanStack Table Selection Configuration

| Config Option | Value | Purpose |
|---------------|-------|---------|
| enableRowSelection | true | Enable selection feature |
| enableMultiRowSelection | true | Allow multiple selections |
| getRowId | (row) => row.id | Use product ID as row ID |
| state.rowSelection | Object | Current selection state |
| onRowSelectionChange | Function | Handle selection changes |

### Selection Helper Functions

```
getSelectedProductIds(rowSelection, products)
├── Extract selected row IDs from rowSelection object
├── Map to product IDs
└── Return array of selected product IDs

clearSelection()
├── Set rowSelection to empty object {}
└── Update parent state
```

### Selected Row Styling

| Element | Tailwind Classes | Purpose |
|---------|------------------|---------|
| Selected Row | `bg-blue-50` | Highlight background |
| Hover State | `hover:bg-blue-100` | Interactive feedback |
| Normal Row | `hover:bg-gray-50` | Default hover |

### Integration with Parent Component

```
ProductList Component:
├── State: selectedProductIds (string[])
├── Handler: handleSelectionChange
└── Pass to:
    ├── ProductTable
    │   └── Manages row selection
    └── BulkActionsBar
        └── Shows selection count
```

### Expected Outcome
- Checkboxes in header and each row
- Select-all functionality in header
- Individual row selection
- Visual feedback for selected rows
- Selected product IDs tracked and exposed
- Ready for bulk actions integration

### Verification Checklist
- [ ] Selection state configured in table
- [ ] rowSelection state managed with useState
- [ ] TanStack Table selection config applied
- [ ] Selection column added as first column
- [ ] Header checkbox displays correctly
- [ ] Header shows indeterminate state
- [ ] Select-all toggles all rows on page
- [ ] Row checkboxes functional
- [ ] Selected rows highlighted
- [ ] Selected IDs tracked correctly
- [ ] Selection state passed to parent
- [ ] Ready for BulkActionsBar integration

---

## Task 33: Create Bulk Actions Bar

### Overview
Create the BulkActionsBar component that appears when products are selected, providing bulk operations for delete, status change, and selection management. This component enables efficient multi-product operations.

### Dependencies
- Task 32: Implement Row Selection

### Instructions

1. **Create BulkActionsBar component file**
   - Navigate to `frontend/components/modules/products/ProductList/` directory
   - Create new file named `BulkActionsBar.tsx`
   - Set up TypeScript React functional component

2. **Define component props**
   - Create `BulkActionsBarProps` interface
   - Include `selectedIds` prop (string array)
   - Include `onClearSelection` callback
   - Include `onBulkDelete` callback
   - Include `onBulkStatusChange` callback

3. **Implement visibility logic**
   - Show bar only when products are selected
   - Hide when selectedIds.length === 0
   - Add slide-in animation when appearing

4. **Display selection count**
   - Show number of selected products
   - Format: "X products selected"
   - Use bold or emphasized styling

5. **Add Clear Selection button**
   - Display "Clear Selection" button
   - Call onClearSelection when clicked
   - Use secondary styling (ghost variant)

6. **Add Bulk Delete action**
   - Create "Delete Selected" button
   - Use destructive styling (red)
   - Show confirmation dialog before deletion
   - Call onBulkDelete with selectedIds

7. **Add Bulk Status Change actions**
   - Create dropdown for status changes
   - Options: Set Active, Set Draft, Archive
   - Show confirmation for archive action
   - Call onBulkStatusChange with status and IDs

8. **Implement confirmation dialogs**
   - Create AlertDialog for bulk delete
   - Show count of products to be deleted
   - Include Cancel and Confirm buttons
   - Handle loading state during operation

9. **Add action feedback**
   - Show loading state on buttons during operation
   - Display success toast after completion
   - Display error toast if operation fails
   - Clear selection after successful operation

10. **Style the bar**
    - Fixed position at bottom of screen or table
    - Add shadow for elevation
    - Use brand colors for background
    - Ensure visibility above other content

### Component Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| selectedIds | string[] | Yes | Array of selected product IDs |
| onClearSelection | Function | Yes | Clear all selections |
| onBulkDelete | Function | Yes | Delete selected products |
| onBulkStatusChange | Function | Yes | Change status of selected |

### Component Structure

```
BulkActionsBar
├── Container (fixed/sticky, shadow, background)
│   ├── Selection Info Section
│   │   ├── Selection Count
│   │   └── Clear Selection Button
│   ├── Action Buttons Section
│   │   ├── Status Change Dropdown
│   │   │   ├── Set Active
│   │   │   ├── Set Draft
│   │   │   └── Archive
│   │   └── Delete Button
│   └── Confirmation Dialogs
│       ├── Delete Confirmation
│       └── Archive Confirmation
```

### Visual Layout

```
┌────────────────────────────────────────────────────────────────┐
│ ✓ 3 products selected  [Clear]  [Status ▼]  [Delete Selected] │
└────────────────────────────────────────────────────────────────┘
                                  ↑
                         Fixed at bottom
```

### Bulk Actions Menu

```
Status Dropdown:
┌─────────────────┐
│ Set Active      │
├─────────────────┤
│ Set Draft       │
├─────────────────┤
│ Archive         │  ← Requires confirmation
└─────────────────┘
```

### Delete Confirmation Dialog

```
┌─────────────────────────────────────────┐
│ Delete Products                         │
├─────────────────────────────────────────┤
│ Are you sure you want to delete         │
│ 3 selected products?                    │
│                                         │
│ This action cannot be undone.           │
│                                         │
│              [Cancel] [Delete]          │
└─────────────────────────────────────────┘
```

### Action Handlers

| Action | Handler Flow |
|--------|--------------|
| Clear Selection | onClearSelection() → Reset state |
| Delete | Show dialog → Confirm → onBulkDelete(ids) → Toast → Clear |
| Set Active | onBulkStatusChange('ACTIVE', ids) → Toast → Clear |
| Set Draft | onBulkStatusChange('DRAFT', ids) → Toast → Clear |
| Archive | Show dialog → Confirm → onBulkStatusChange('ARCHIVED', ids) |

### Styling Specifications

| Element | Tailwind Classes | Purpose |
|---------|------------------|---------|
| Container | `fixed bottom-0 left-0 right-0 bg-blue-600 text-white` | Bar position and color |
| Inner Container | `container mx-auto px-4 py-3 flex items-center justify-between` | Content layout |
| Count Text | `font-semibold` | Emphasize count |
| Clear Button | `text-white hover:text-blue-100` | Secondary action |
| Delete Button | `bg-red-600 hover:bg-red-700` | Destructive action |

### Visibility and Animation

```
CSS/Tailwind for slide-in:
├── Initial: translate-y-full, opacity-0
├── Visible: translate-y-0, opacity-100
└── Transition: transition-all duration-300
```

### Integration Flow

```
User selects products
        ↓
selectedIds.length > 0
        ↓
BulkActionsBar slides in
        ↓
User clicks bulk action
        ↓
Confirmation dialog (if needed)
        ↓
User confirms
        ↓
Show loading state
        ↓
Call API for bulk operation
        ↓
Display toast (success/error)
        ↓
Clear selection
        ↓
BulkActionsBar slides out
```

### State Management

| State | Type | Purpose |
|-------|------|---------|
| showDeleteDialog | boolean | Delete confirmation visibility |
| showArchiveDialog | boolean | Archive confirmation visibility |
| isLoading | boolean | Loading state during operation |

### Expected Outcome
- Bulk actions bar appears when products selected
- Selection count displayed clearly
- Clear selection button functional
- Delete action with confirmation
- Status change actions with dropdown
- Loading states during operations
- Success/error feedback with toasts
- Smooth slide-in/out animations

### Verification Checklist
- [ ] `BulkActionsBar.tsx` file created
- [ ] Component accepts all required props
- [ ] Bar only visible when products selected
- [ ] Selection count displays correctly
- [ ] Clear Selection button functional
- [ ] Delete button with confirmation dialog
- [ ] Status change dropdown with 3 options
- [ ] Archive action requires confirmation
- [ ] Loading states on action buttons
- [ ] Success toast after bulk operation
- [ ] Error toast on operation failure
- [ ] Selection cleared after success
- [ ] Slide-in animation smooth
- [ ] Component exports properly

---

## Task 34: Connect Table to API

### Overview
Connect the ProductTable component to the API through the useProducts hook, integrating all data fetching, filtering, sorting, pagination, and bulk operation functionality with the backend.

### Dependencies
- Task 23: Create Product Data Table
- Task 30: Implement Table Sorting
- Task 31: Implement Table Pagination
- Task 32: Implement Row Selection
- Task 33: Create Bulk Actions Bar
- useProducts hook from Task 10

### Instructions

1. **Import useProducts hook**
   - Import useProducts from hooks directory
   - Import useMutation for bulk operations
   - Import necessary types (ProductListParams, etc.)

2. **Set up query parameters state**
   - Extract URL search params (useSearchParams)
   - Parse filters, sorting, and pagination params
   - Create queryParams object for API

3. **Initialize useProducts hook**
   - Call useProducts with queryParams
   - Destructure data, isLoading, isError, refetch
   - Handle loading and error states

4. **Connect filter values**
   - Read search, status, category, stock from URL
   - Pass to useProducts queryParams
   - Update URL when filters change (from Task 22)

5. **Connect sorting values**
   - Read sortBy and sortOrder from URL (Task 30)
   - Pass to useProducts queryParams
   - Update when sort changes

6. **Connect pagination values**
   - Read page and pageSize from URL (Task 31)
   - Pass to useProducts queryParams
   - Update when page changes
   - Extract totalPages and totalItems from response

7. **Pass data to table component**
   - Pass products array to ProductTable
   - Pass isLoading state
   - Pass pagination info (page, pageSize, totalPages)
   - Pass sorting info (sortBy, sortOrder)

8. **Implement bulk delete mutation**
   - Create useMutation for bulk delete endpoint
   - Call API: DELETE /api/products/bulk
   - Pass selectedIds in request body
   - Handle success: refetch products, show toast
   - Handle error: show error toast

9. **Implement bulk status update mutation**
   - Create useMutation for bulk status update
   - Call API: PATCH /api/products/bulk/status
   - Pass selectedIds and new status
   - Handle success: refetch products, show toast
   - Handle error: show error toast

10. **Connect BulkActionsBar handlers**
    - Implement onBulkDelete handler
    - Implement onBulkStatusChange handler
    - Clear selection after successful operation
    - Show appropriate toast notifications

11. **Handle data refresh**
    - Refetch after bulk operations
    - Refetch after filter changes
    - Maintain scroll position if possible
    - Show loading overlay during refetch

12. **Add error handling**
    - Display error message if query fails
    - Provide retry button
    - Handle network errors gracefully
    - Show user-friendly error messages

### API Integration Structure

```
ProductList Component
├── URL State
│   ├── Filters (search, status, category, stock)
│   ├── Sorting (sortBy, sortOrder)
│   └── Pagination (page, pageSize)
├── useProducts Hook
│   ├── Input: queryParams
│   └── Output: { data, isLoading, isError, refetch }
├── Bulk Operations
│   ├── useMutation: bulkDelete
│   └── useMutation: bulkStatusUpdate
└── Components
    ├── ProductTable (receives data)
    └── BulkActionsBar (triggers mutations)
```

### Query Parameters Object

```
queryParams: ProductListParams
├── search: string | undefined
├── status: ProductStatus | undefined
├── category: string | undefined
├── stock: StockFilter | undefined
├── sortBy: SortField | undefined
├── sortOrder: SortOrder | undefined
├── page: number (default: 1)
└── pageSize: number (default: 20)
```

### useProducts Hook Usage

```typescript
const {
  data,           // { products, pagination }
  isLoading,      // Boolean
  isError,        // Boolean
  error,          // Error object
  refetch         // Function to refetch
} = useProducts(queryParams);

const products = data?.products || [];
const totalPages = data?.pagination.totalPages || 1;
const totalItems = data?.pagination.totalItems || 0;
```

### Bulk Delete API Call

| Property | Value |
|----------|-------|
| Method | DELETE |
| Endpoint | /api/products/bulk |
| Body | { productIds: string[] } |
| Response | { success: boolean, deletedCount: number } |

### Bulk Status Update API Call

| Property | Value |
|----------|-------|
| Method | PATCH |
| Endpoint | /api/products/bulk/status |
| Body | { productIds: string[], status: ProductStatus } |
| Response | { success: boolean, updatedCount: number } |

### Data Flow Diagram

```
URL Parameters
     ↓
Parse to queryParams
     ↓
useProducts(queryParams)
     ↓
API Request
     ↓
Response Data
     ↓
ProductTable Component
     ↓
User Interaction
     ↓
Update URL Parameters
     ↓
[Cycle repeats]

Bulk Operations Flow:
User selects rows
     ↓
Clicks bulk action
     ↓
Mutation triggered
     ↓
API Request
     ↓
Success/Error
     ↓
refetch() products
     ↓
Clear selection
```

### Error Handling

| Error Type | Display | Action |
|------------|---------|--------|
| Network Error | "Failed to load products" | Retry button |
| 404 Not Found | "No products found" | Create product button |
| 500 Server Error | "Server error occurred" | Retry button |
| Bulk Op Error | "Failed to update products" | Toast notification |

### Loading States

| Operation | Loading Indicator |
|-----------|-------------------|
| Initial Load | Table skeleton |
| Page Change | Loading overlay |
| Sort Change | Loading overlay |
| Bulk Operation | Button spinner |
| Refetch | Subtle indicator |

### Success Feedback

| Operation | Toast Message |
|-----------|---------------|
| Bulk Delete | "X products deleted successfully" |
| Bulk Active | "X products set to Active" |
| Bulk Draft | "X products set to Draft" |
| Bulk Archive | "X products archived" |

### Integration Checklist

```
✓ URL params parsed correctly
✓ useProducts hook called with params
✓ Data passed to ProductTable
✓ Filters connected to API
✓ Sorting connected to API
✓ Pagination connected to API
✓ Bulk delete mutation created
✓ Bulk status mutation created
✓ Mutations trigger refetch
✓ Loading states displayed
✓ Error states handled
✓ Success toasts shown
```

### Expected Outcome
- Table fully connected to backend API
- All filters, sorting, pagination working
- Bulk operations functional
- Data refetches after changes
- Loading and error states handled
- User feedback with toast notifications
- Complete data flow from URL to API to UI

### Verification Checklist
- [ ] useProducts hook imported and called
- [ ] Query params extracted from URL
- [ ] Query params passed to useProducts
- [ ] Products data passed to table
- [ ] Pagination data passed to table
- [ ] Sorting data passed to table
- [ ] isLoading state handled
- [ ] isError state handled
- [ ] Bulk delete mutation implemented
- [ ] Bulk status update mutation implemented
- [ ] Mutations connected to BulkActionsBar
- [ ] Success toasts display correctly
- [ ] Error toasts display correctly
- [ ] Data refetches after bulk operations
- [ ] Selection cleared after success
- [ ] All table features working end-to-end

---

## Summary

This document established the complete data table functionality for the product listing page, including TanStack Table v8 integration, custom cell components, server-side sorting and pagination, row selection, and bulk action capabilities. The table is fully connected to the API for real-time data operations.

### Completed Tasks
1. ✓ Created ProductTable component with TanStack Table v8
2. ✓ Defined all table columns with proper configuration
3. ✓ Created ProductNameCell with thumbnail and SKU
4. ✓ Created PriceCell with LKR formatting
5. ✓ Created StockCell with level indicators
6. ✓ Created StatusBadgeCell with color variants
7. ✓ Created ActionsCell with dropdown menu
8. ✓ Implemented server-side table sorting
9. ✓ Implemented server-side table pagination
10. ✓ Implemented row selection with checkboxes
11. ✓ Created BulkActionsBar for multi-product operations
12. ✓ Connected entire table to API via useProducts hook

### Key Features Delivered
- TanStack Table v8 with server-side operations
- 8 columns including selection, product details, and actions
- Custom cell components for rich data display
- LKR currency formatting with thousand separators
- Stock level indicators (green/yellow/red)
- Status badges (Active/Draft/Archived)
- Sortable columns with visual indicators
- Pagination with page size selector
- Multi-row selection with bulk actions
- Delete and status change bulk operations
- Complete API integration with loading/error states

### Next Steps
Proceed to Group C to create the product form for adding and editing products with comprehensive validation and media upload capabilities.
