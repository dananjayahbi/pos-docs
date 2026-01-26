# Tasks 43-48: Table View, Modal & Export

> **Phase:** 07 - Frontend Infrastructure & ERP Dashboard  
> **SubPhase:** 09 - Inventory Management UI  
> **Group:** C - Stock Movement History  
> **Document:** 02 of 02  
> **Tasks Covered:** 43, 44, 45, 46, 47, 48

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [01_Tasks-33-42_Filters-Timeline.md](01_Tasks-33-42_Filters-Timeline.md)

---

## Document Overview

This document covers the alternative table view for movements, view toggle, detail modal, API integration, and export functionality. Provides users with multiple ways to view and analyze stock movement data.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 43 | Create Movements Table View | Medium | 30 min |
| 44 | Define Movement Table Columns | Medium | 25 min |
| 45 | Create View Toggle | Low | 15 min |
| 46 | Create Movement Detail Modal | Medium | 30 min |
| 47 | Connect to Movements API | Medium | 30 min |
| 48 | Create Export Movements | Medium | 25 min |

---

## Task 43: Create Movements Table View

### Overview
Create alternative table view for displaying movements in tabular format with sorting and pagination.

### Dependencies
- Task 33: Create Movements Page
- Task 40: Create Movements Timeline

### Instructions

1. **Create component file:** Create `MovementsTable.tsx`
2. **Import TanStack Table:** Use useReactTable hook
3. **Define table props:** Accept movements data and columns
4. **Configure table instance:** Set up with sorting and pagination
5. **Create table structure:** Header, body, footer sections
6. **Add loading state:** Skeleton table rows
7. **Add empty state:** No movements message

### Table Structure
```
┌──────────────────────────────────────────────────────────┐
│ Date/Time │ Product  │ Type  │ Qty │ Ref   │ User      │
├──────────────────────────────────────────────────────────┤
│ Jan 25    │ Prod A   │ Sale  │ -10 │ INV01 │ John D.   │
│ 10:30 AM  │          │ ⬆️    │     │       │           │
├──────────────────────────────────────────────────────────┤
│ Jan 25    │ Prod B   │ Purch │ +50 │ PO123 │ Jane S.   │
│ 09:15 AM  │          │ ⬇️    │     │       │           │
├──────────────────────────────────────────────────────────┤
│                   Showing 1-10 of 234                    │
└──────────────────────────────────────────────────────────┘
```

### Table Configuration

| Feature | Setting |
|---------|---------|
| Rows per page | 10, 25, 50, 100 |
| Default sort | Date descending (newest first) |
| Sortable columns | Date, Product, Type, Quantity |
| Click action | Open detail modal |

### Expected Outcome
- Functional table view with sorting
- Paginated results
- Clickable rows for details

### Verification
- [ ] Table displays movements
- [ ] Sorting works on columns
- [ ] Pagination functions

---

## Task 44: Define Movement Table Columns

### Overview
Define column configuration for the movements table with proper accessors and cell renderers.

### Dependencies
- Task 43: Create Movements Table View

### Instructions

1. **Create columns file:** Create `MovementTableColumns.tsx`
2. **Import column types:** Import ColumnDef from TanStack Table
3. **Define columns array:** Create array of column definitions
4. **Configure each column:** Set accessor, header, cell renderer
5. **Add custom cells:** Direction icon, quantity with sign, type badge
6. **Set column widths:** Define min/max widths
7. **Enable sorting:** Set sortable flags

### Column Definitions

| Column | Width | Sortable | Content |
|--------|-------|----------|---------|
| Date/Time | 150px | Yes | Date + time formatted |
| Product | 200px | Yes | Product name |
| Type | 120px | Yes | Type badge + icon |
| Quantity | 100px | Yes | Quantity with +/- sign |
| From/To | 150px | No | Location details |
| Reference | 150px | No | Reference number |
| User | 120px | No | User name |

### Quantity Cell Format

| Value | Display | Color |
|-------|---------|-------|
| Positive | +50 | Green |
| Negative | -10 | Red |
| Zero | ±0 | Gray |

### Type Badge Design

| Type | Badge Color | Icon |
|------|------------|------|
| Sale | Red | ArrowUp |
| Purchase | Green | ArrowDown |
| Adjustment | Yellow | Edit |
| Transfer | Blue | ArrowLeftRight |
| Return | Purple | RotateCcw |

### Expected Outcome
- Complete column definitions
- Custom cell renderers working
- Proper column widths and sorting

### Verification
- [ ] All columns defined
- [ ] Custom cells render
- [ ] Sorting enabled correctly

---

## Task 45: Create View Toggle

### Overview
Create toggle component for switching between timeline and table views.

### Dependencies
- Task 40: Create Movements Timeline
- Task 43: Create Movements Table View

### Instructions

1. **Create component file:** Create `ViewToggle.tsx`
2. **Add toggle buttons:** Timeline and Table options
3. **Add active state:** Highlight selected view
4. **Add icons:** Timeline and Table icons
5. **Handle toggle:** Emit view change to parent
6. **Save preference:** Store view preference in localStorage

### Toggle Layout
```
┌─────────────────────────────┐
│ [📋 Timeline] [📊 Table]    │
└─────────────────────────────┘
   (active)      (inactive)
```

### Toggle States

| View | Icon | State | Description |
|------|------|-------|-------------|
| Timeline | Timeline | Active | Vertical timeline view |
| Table | Table | Inactive | Tabular data view |

### View Preference
- Store in localStorage key: `movements_view`
- Default to timeline view
- Apply on page load

### Expected Outcome
- Toggle buttons for view switching
- Active state highlighting
- View preference persisted

### Verification
- [ ] Toggle switches views
- [ ] Active state displays
- [ ] Preference saves

---

## Task 46: Create Movement Detail Modal

### Overview
Create modal dialog displaying detailed information about a specific movement.

### Dependencies
- Task 41: Create Movement Timeline Item
- Task 43: Create Movements Table View

### Instructions

1. **Create component file:** Create `MovementDetailModal.tsx`
2. **Import modal component:** Use Dialog from UI library
3. **Define props interface:** Accept movement data and open state
4. **Add modal sections:** Header, movement info, product details, metadata
5. **Add direction icon:** Large icon showing movement direction
6. **Display complete info:** All movement details in readable format
7. **Add close button:** X button and backdrop click to close

### Modal Structure
```
┌──────────────────────────────────────┐
│  ⬆️  Stock Out Movement          [X] │
├──────────────────────────────────────┤
│  Product Information                 │
│  Name: Product A                     │
│  SKU: SKU001                         │
│  Category: Electronics               │
│                                      │
│  Movement Details                    │
│  Type: Sale                          │
│  Quantity: -15 units                 │
│  Reference: INV-001                  │
│  Warehouse: Main Warehouse           │
│                                      │
│  Additional Information              │
│  Performed by: John Doe              │
│  Date/Time: Jan 25, 2026 10:30 AM   │
│  Notes: Customer order fulfillment   │
│                                      │
│            [Close]                   │
└──────────────────────────────────────┘
```

### Modal Sections

| Section | Content |
|---------|---------|
| Header | Movement type + direction icon |
| Product Info | Name, SKU, category |
| Movement Details | Type, quantity, reference, location |
| Metadata | User, date/time, notes |
| Actions | Close button |

### Information Display

| Field | Format | Example |
|-------|--------|---------|
| Date | Full date + time | Jan 25, 2026 10:30 AM |
| Quantity | With sign and unit | -15 units |
| User | Full name | John Doe |
| Reference | Clickable link | INV-001 (link to invoice) |
| Notes | Multi-line text | Full note content |

### Expected Outcome
- Modal with complete movement details
- Organized section layout
- Close functionality working

### Verification
- [ ] Modal opens with data
- [ ] All fields display
- [ ] Close button works

---

## Task 47: Connect to Movements API

### Overview
Integrate movements components with backend API using TanStack Query for data fetching.

### Dependencies
- Task 44: Define Movement Table Columns
- Backend movements API available

### Instructions

1. **Create API hook:** Create `useMovements` hook
2. **Import TanStack Query:** Import useQuery
3. **Define API endpoint:** GET /api/inventory/movements
4. **Create query function:** Implement fetch function
5. **Add query parameters:** Support filters, sorting, pagination
6. **Handle loading state:** Show loading indicators
7. **Handle error state:** Display error messages
8. **Add refetch trigger:** Manual and automatic refetch
9. **Update components:** Use query data in timeline and table

### API Endpoints

| Endpoint | Method | Purpose |
|----------|--------|---------|
| /api/inventory/movements | GET | Get movements list |
| /api/inventory/movements/:id | GET | Get movement details |
| /api/inventory/movements/export | POST | Export movements data |

### Query Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| page | number | Page number |
| pageSize | number | Items per page |
| startDate | string | Filter start date (ISO) |
| endDate | string | Filter end date (ISO) |
| type | string | Movement type filter |
| productId | string | Product filter |
| warehouseId | string | Warehouse filter |
| sortBy | string | Sort column |
| sortDir | string | Sort direction |

### API Request Example
```
GET /api/inventory/movements?
  page=1&
  pageSize=25&
  startDate=2026-01-18&
  endDate=2026-01-25&
  type=sale&
  warehouseId=wh-001&
  sortBy=date&
  sortDir=desc
```

### API Response Structure
```
Response:
- data: Array<Movement>
  - id: string
  - type: string
  - product: Object
  - quantity: number
  - warehouse: Object
  - reference: string
  - user: Object
  - createdAt: string
  - notes: string
- meta:
  - total: number
  - page: number
  - pageSize: number
  - pageCount: number
```

### Query Configuration
```
useQuery config:
- queryKey: ["movements", filters, sort, pagination]
- queryFn: () => fetchMovements(params)
- refetchInterval: 60000 (1 minute)
- staleTime: 30000 (30 seconds)
- cacheTime: 300000 (5 minutes)
```

### Expected Outcome
- API connected with live data
- Filters update API requests
- Auto-refetch working
- Error handling in place

### Verification
- [ ] API requests successful
- [ ] Data displays correctly
- [ ] Filters work with API
- [ ] Refetch updates data

---

## Task 48: Create Export Movements

### Overview
Implement export functionality to download filtered movements as CSV or Excel files.

### Dependencies
- Task 47: Connect to Movements API

### Instructions

1. **Create export function:** Create `exportMovements` utility
2. **Add format options:** CSV and Excel export
3. **Use current filters:** Export filtered data only
4. **Define export columns:** Select relevant columns for export
5. **Format data:** Transform API data for export
6. **Trigger download:** Generate and download file
7. **Add loading state:** Show progress during export
8. **Handle large exports:** Support chunked downloads for large datasets

### Export Formats

| Format | Extension | Library | Features |
|--------|-----------|---------|----------|
| CSV | .csv | Papa Parse | Simple, universal |
| Excel | .xlsx | xlsx | Formatted, multiple sheets |

### Export Columns

| Column | Header | Format |
|--------|--------|--------|
| Date | "Date/Time" | ISO date |
| Product | "Product" | Name |
| SKU | "SKU" | Code |
| Type | "Movement Type" | Text |
| Quantity | "Quantity" | Number with sign |
| Warehouse | "Warehouse" | Name |
| Reference | "Reference" | Number/code |
| User | "Performed By" | Full name |
| Notes | "Notes" | Text |

### Export Process Flow
```
User clicks Export
    │
    ▼
Select format (CSV/Excel)
    │
    ▼
Show loading indicator
    │
    ▼
Fetch all filtered data
    │
    ▼
Format data for export
    │
    ▼
Generate file
    │
    ▼
Trigger download
    │
    ▼
Hide loading, show success
```

### Filename Format
```
Pattern: movements_{startDate}_{endDate}.{ext}
Example: movements_2026-01-18_2026-01-25.csv
```

### Export Options Dialog
```
┌────────────────────────────┐
│  Export Stock Movements    │
├────────────────────────────┤
│  Format:                   │
│  ○ CSV                     │
│  ● Excel                   │
│                            │
│  Date Range:               │
│  Jan 18 - Jan 25, 2026     │
│                            │
│  Total Records: 234        │
│                            │
│  [Cancel] [Export]         │
└────────────────────────────┘
```

### Export API Request
```
POST /api/inventory/movements/export
Body:
{
  format: "csv" | "xlsx",
  filters: {
    startDate, endDate, type, etc.
  },
  columns: ["date", "product", "type", ...]
}
```

### Expected Outcome
- Export button triggers download
- CSV and Excel formats supported
- Filtered data exported correctly
- Filename includes date range

### Verification
- [ ] Export button works
- [ ] CSV download successful
- [ ] Excel download successful
- [ ] Data matches filters

---

## Summary

This document completed the movements feature with table view and export:

### Components Created
- MovementsTable with TanStack Table (Task 43)
- Movement table columns with custom cells (Task 44)
- ViewToggle for timeline/table switching (Task 45)
- MovementDetailModal for detailed view (Task 46)

### Features Implemented
- Alternative table view with sorting
- View preference persistence
- Detail modal with complete info
- Full API integration (Task 47)
- CSV and Excel export (Task 48)

### Key Functionality
- Dual view options (timeline/table)
- Complete movement details in modal
- Real-time data from API
- Export filtered movements
- Query-based data fetching
- Automatic refetching

### Group C Complete
Stock movement history fully functional with timeline, table views, filtering, detail modal, and export capabilities. Ready for Group D (Stock Adjustments).
