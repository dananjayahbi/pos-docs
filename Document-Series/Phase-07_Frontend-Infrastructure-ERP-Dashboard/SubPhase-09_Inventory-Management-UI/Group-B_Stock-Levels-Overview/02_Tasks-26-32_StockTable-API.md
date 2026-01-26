# Tasks 26-32: Stock Table & API Integration

> **Phase:** 07 - Frontend Infrastructure & ERP Dashboard  
> **SubPhase:** 09 - Inventory Management UI  
> **Group:** B - Stock Levels Overview  
> **Document:** 02 of 02  
> **Tasks Covered:** 26, 27, 28, 29, 30, 31, 32

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [01_Tasks-15-25_Overview-Cards-Filters.md](01_Tasks-15-25_Overview-Cards-Filters.md)

---

## Document Overview

This document covers the creation of the stock levels data table with custom cells, sorting, pagination, and API integration. The table displays detailed stock information for all products with visual indicators and action buttons.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 26 | Create Stock Level Table | Medium | 30 min |
| 27 | Define Stock Table Columns | Medium | 25 min |
| 28 | Create Stock Level Cell | Low | 20 min |
| 29 | Create Stock Actions Cell | Low | 20 min |
| 30 | Implement Table Sorting | Medium | 25 min |
| 31 | Implement Table Pagination | Medium | 25 min |
| 32 | Connect to Inventory API | Medium | 30 min |

---

## Task 26: Create Stock Level Table

### Overview
Create the main data table component using TanStack Table for displaying stock information.

### Dependencies
- Task 15: Create Stock Overview Page
- SubPhase-05 (Data Table Components) complete

### Instructions

1. **Create component file:** Create `StockTable.tsx` in StockOverview directory
2. **Import TanStack Table:** Import useReactTable and table utilities
3. **Define table props:** Accept data, columns, loading state
4. **Set up table instance:** Configure table with data and columns
5. **Create table structure:** Render table with header, body, and footer
6. **Add loading skeleton:** Show skeleton rows while data loads
7. **Add empty state:** Display message when no data available

### Table Structure
```
┌────────────────────────────────────────────────────────┐
│ Product     │ SKU    │ Warehouse │ Qty │ Status │ ... │
├────────────────────────────────────────────────────────┤
│ Product A   │ SKU001 │ Main      │ 100 │ 🟢 OK  │ ... │
│ Product B   │ SKU002 │ Branch    │ 5   │ 🟡 Low │ ... │
│ Product C   │ SKU003 │ Main      │ 0   │ 🔴 Out │ ... │
├────────────────────────────────────────────────────────┤
│                   Showing 1-10 of 150                  │
└────────────────────────────────────────────────────────┘
```

### Table Configuration

| Feature | Implementation |
|---------|----------------|
| Library | TanStack Table v8 |
| Rows per page | 10, 25, 50, 100 |
| Default sort | Product name (A-Z) |
| Loading | Skeleton rows |
| Empty | "No products found" |

### Expected Outcome
- Functional data table with TanStack Table
- Loading and empty states
- Ready to receive column definitions

### Verification
- [ ] Table renders with data
- [ ] Loading skeleton displays
- [ ] Empty state shows when no data

---

## Task 27: Define Stock Table Columns

### Overview
Define the column configuration for the stock table including headers, accessors, and custom cells.

### Dependencies
- Task 26: Create Stock Level Table

### Instructions

1. **Create columns file:** Create `StockTableColumns.tsx`
2. **Import column helpers:** Import ColumnDef from TanStack Table
3. **Define column array:** Create array of column definitions
4. **Configure each column:** Set id, header, accessor, cell renderer
5. **Set column widths:** Define min/max widths for each column
6. **Enable/disable sorting:** Set sortable flags per column
7. **Export columns:** Export column definitions for use in table

### Column Definitions

| Column | Width | Sortable | Accessor |
|--------|-------|----------|----------|
| Product | 250px | Yes | product.name |
| SKU | 120px | Yes | product.sku |
| Warehouse | 150px | Yes | warehouse.name |
| Available | 100px | Yes | quantity.available |
| Reserved | 100px | No | quantity.reserved |
| Reorder Point | 100px | No | reorderPoint |
| Status | 120px | No | Custom cell |
| Actions | 80px | No | Custom cell |

### Column Structure Template
```
Column Definition:
- id: string
- header: string | Component
- accessorKey: string
- cell: (props) => Component
- minSize: number
- maxSize: number
- enableSorting: boolean
```

### Column Types

| Type | Description | Example |
|------|-------------|---------|
| Text | Simple text display | Product name |
| Number | Numeric values | Quantities |
| Custom | Custom cell component | Status badges |
| Actions | Button/menu cells | Edit/View buttons |

### Expected Outcome
- Complete column definitions array
- Proper typing for all columns
- Custom cell configurations

### Verification
- [ ] All 8 columns defined
- [ ] Column widths set appropriately
- [ ] Sortable flags configured

---

## Task 28: Create Stock Level Cell

### Overview
Create custom cell component for displaying stock level status with colored indicator badges.

### Dependencies
- Task 27: Define Stock Table Columns

### Instructions

1. **Create cell directory:** In StockOverview, create `cells/` folder
2. **Create component file:** Create `StockLevelCell.tsx` in cells directory
3. **Define props interface:** Accept quantity, reorderPoint, maxLevel
4. **Calculate status:** Determine stock status based on thresholds
5. **Render badge:** Display colored badge with status text
6. **Add tooltip:** Show detailed info on hover
7. **Export component:** Export for use in columns

### Stock Status Logic

| Status | Condition | Badge Color | Icon |
|--------|-----------|-------------|------|
| In Stock | qty >= reorderPoint | Green | CheckCircle |
| Low Stock | qty < reorderPoint && qty > 0 | Yellow | AlertTriangle |
| Out of Stock | qty = 0 | Red | XCircle |
| Overstocked | qty > maxLevel | Blue | TrendingUp |

### Badge Design
```
🟢 In Stock      (Green background, dark green text)
🟡 Low Stock     (Yellow background, dark yellow text)
🔴 Out of Stock  (Red background, white text)
🔵 Overstocked   (Blue background, dark blue text)
```

### Cell Component Structure
```
┌────────────────────┐
│  🟡 Low Stock      │  ← Badge with icon
│  (Hover for info)  │
└────────────────────┘
        │
        ▼ (on hover)
┌─────────────────────────┐
│ Available: 5            │
│ Reorder Point: 20       │
│ 15 units below minimum  │
└─────────────────────────┘
```

### Expected Outcome
- Custom cell component with status badges
- Color-coded status indicators
- Hover tooltip with details

### Verification
- [ ] Status calculation works correctly
- [ ] Badge colors match status
- [ ] Tooltip displays on hover

---

## Task 29: Create Stock Actions Cell

### Overview
Create custom cell component for action buttons (view, adjust, transfer).

### Dependencies
- Task 27: Define Stock Table Columns

### Instructions

1. **Create component file:** Create `StockActionsCell.tsx` in cells directory
2. **Define props interface:** Accept product ID and current data
3. **Add action buttons:** View details, Quick adjust, Transfer
4. **Create dropdown menu:** Combine actions in dropdown for space
5. **Add icons:** Use appropriate icons for each action
6. **Handle click events:** Navigate or open modals on click
7. **Add permissions:** Show/hide actions based on user permissions

### Action Options

| Action | Icon | Behavior | Permission |
|--------|------|----------|------------|
| View Details | Eye | Navigate to product page | All users |
| Quick Adjust | Edit | Open adjustment modal | inventory.adjust |
| Transfer | ArrowRightLeft | Open transfer modal | inventory.transfer |
| View History | Clock | Navigate to movements | All users |

### Actions Cell Structure
```
┌─────────┐
│  ⋮ ▼   │  ← Menu button
└─────────┘
     │
     ▼
┌──────────────────┐
│ 👁 View Details  │
│ ✏️ Quick Adjust  │
│ ⇄ Transfer       │
│ 🕐 View History  │
└──────────────────┘
```

### Menu Implementation
- Use DropdownMenu component from UI library
- Trigger with three-dot icon
- Align to right edge of cell
- Close on action click

### Expected Outcome
- Dropdown menu with action options
- Icon-labeled actions
- Permission-based visibility

### Verification
- [ ] Menu opens on button click
- [ ] Actions trigger correctly
- [ ] Permissions filter options

---

## Task 30: Implement Table Sorting

### Overview
Implement multi-column sorting functionality using TanStack Table sorting features.

### Dependencies
- Task 26: Create Stock Level Table
- Task 27: Define Stock Table Columns

### Instructions

1. **Enable sorting:** Configure table with sorting state
2. **Add sort state:** Manage sort state in table instance
3. **Add column headers:** Make sortable column headers clickable
4. **Add sort indicators:** Show up/down arrows for sort direction
5. **Handle multi-sort:** Support sorting by multiple columns with shift-click
6. **Set default sort:** Default to product name ascending
7. **Persist sort:** Save sort preferences to localStorage

### Sorting Indicators

| State | Indicator | Description |
|-------|-----------|-------------|
| Unsorted | ⇅ | Column can be sorted |
| Ascending | ↑ | Sorted A-Z, 0-9 |
| Descending | ↓ | Sorted Z-A, 9-0 |

### Sort Behavior

| Click | Action |
|-------|--------|
| Single click | Sort by column (toggle asc/desc) |
| Shift + click | Add to multi-column sort |
| Third click | Remove sort |

### Sorting Logic Flow
```
Unsorted → Click → Ascending → Click → Descending → Click → Unsorted
```

### Sort Configuration
```
Sort State:
- columnId: string
- direction: "asc" | "desc"
- multi: boolean (shift-click)
```

### Expected Outcome
- Clickable column headers with sort
- Visual indicators for sort direction
- Multi-column sorting support

### Verification
- [ ] Clicking headers sorts correctly
- [ ] Sort indicators display
- [ ] Multi-sort works with shift

---

## Task 31: Implement Table Pagination

### Overview
Implement pagination controls for the stock table with page size options.

### Dependencies
- Task 26: Create Stock Level Table
- Task 30: Implement Table Sorting

### Instructions

1. **Add pagination state:** Manage page index and page size
2. **Calculate page count:** Determine total pages from data length
3. **Create pagination controls:** Previous, next, first, last buttons
4. **Add page size selector:** Dropdown for rows per page
5. **Add page info:** Display "Showing X-Y of Z"
6. **Handle page changes:** Update table data on page change
7. **Persist pagination:** Save preferences to localStorage

### Pagination Controls Layout
```
┌────────────────────────────────────────────────────┐
│  Showing 1-10 of 150 products    [10 ▼] per page  │
│  [First] [Prev]  Page 1 of 15  [Next] [Last]      │
└────────────────────────────────────────────────────┘
```

### Page Size Options

| Option | Description |
|--------|-------------|
| 10 | Default, quick scanning |
| 25 | Medium lists |
| 50 | Large lists |
| 100 | All items (if < 100) |

### Pagination State
```
Pagination:
- pageIndex: number (0-based)
- pageSize: number (10, 25, 50, 100)
- pageCount: number (calculated)
```

### Navigation Buttons

| Button | Behavior | Disabled When |
|--------|----------|---------------|
| First | Go to page 1 | On first page |
| Previous | Go to previous page | On first page |
| Next | Go to next page | On last page |
| Last | Go to last page | On last page |

### Expected Outcome
- Functional pagination controls
- Page size selector working
- Proper disabled states for buttons

### Verification
- [ ] Pagination controls render
- [ ] Page size changes update table
- [ ] Navigation buttons work correctly

---

## Task 32: Connect to Inventory API

### Overview
Integrate the stock table with the backend inventory API using TanStack Query for data fetching.

### Dependencies
- Task 31: Implement Table Pagination
- Backend inventory API endpoints available

### Instructions

1. **Create API hook:** Create `useInventory` hook in hooks directory
2. **Import TanStack Query:** Import useQuery from @tanstack/react-query
3. **Define API endpoints:** Set up endpoints for stock data
4. **Create query function:** Implement fetch function for stock data
5. **Add query parameters:** Support filters, sorting, pagination
6. **Handle loading state:** Show loading skeleton during fetch
7. **Handle error state:** Display error message on API failure
8. **Add refetch trigger:** Implement manual refetch capability
9. **Update table component:** Use query data in table

### API Endpoints

| Endpoint | Method | Purpose |
|----------|--------|---------|
| /api/inventory/stock | GET | Get stock levels list |
| /api/inventory/summary | GET | Get summary statistics |
| /api/warehouses | GET | Get warehouse list |

### Query Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| page | number | Page number (1-based) |
| pageSize | number | Items per page |
| search | string | Search term |
| warehouse | string | Warehouse filter |
| stockLevel | string | Stock status filter |
| sortBy | string | Sort column |
| sortDir | string | Sort direction |

### API Request Example
```
GET /api/inventory/stock?
  page=1&
  pageSize=10&
  search=product&
  warehouse=wh-001&
  stockLevel=low&
  sortBy=name&
  sortDir=asc
```

### API Response Structure
```
Response:
- data: Array<StockItem>
- meta:
  - total: number
  - page: number
  - pageSize: number
  - pageCount: number
- summary:
  - totalProducts: number
  - lowStockCount: number
  - outOfStockCount: number
  - totalValue: number
```

### Query Configuration
```
useQuery configuration:
- queryKey: ["inventory", filters, sort, pagination]
- queryFn: () => fetchStockData(params)
- refetchInterval: 30000 (30 seconds)
- staleTime: 10000 (10 seconds)
- cacheTime: 300000 (5 minutes)
```

### Error Handling

| Error | Response | User Message |
|-------|----------|--------------|
| Network | Show error banner | "Unable to connect to server" |
| 401 | Redirect to login | "Session expired" |
| 403 | Show permission error | "Access denied" |
| 500 | Show error message | "Server error occurred" |

### Loading States

| State | UI Display |
|-------|-----------|
| Initial Load | Full page skeleton |
| Refetch | Overlay spinner |
| Background Refetch | No UI change |
| Error | Error banner with retry |

### Expected Outcome
- Table connected to live API data
- Automatic data refetching
- Proper error handling
- Loading states working

### Verification
- [ ] API requests successful
- [ ] Data displays in table
- [ ] Filters update API params
- [ ] Error handling works
- [ ] Refetch updates data

---

## Summary

This document completed the stock overview feature with table and API integration:

### Components Created
- StockTable with TanStack Table (Task 26)
- Column definitions with 8 columns (Task 27)
- StockLevelCell with status badges (Task 28)
- StockActionsCell with dropdown menu (Task 29)

### Features Implemented
- Multi-column sorting with indicators (Task 30)
- Pagination with page size options (Task 31)
- Full API integration with TanStack Query (Task 32)

### Key Functionality
- Real-time data fetching
- Advanced filtering capabilities
- Sortable columns
- Paginated results
- Custom cell renderers
- Error handling

### API Integration
- useInventory hook for data fetching
- Query parameter support
- Automatic refetching
- Comprehensive error handling

### Group B Complete
Stock levels overview fully functional with live data, summary cards, filters, and sortable/paginated table. Ready for Group C (Stock Movement History).
