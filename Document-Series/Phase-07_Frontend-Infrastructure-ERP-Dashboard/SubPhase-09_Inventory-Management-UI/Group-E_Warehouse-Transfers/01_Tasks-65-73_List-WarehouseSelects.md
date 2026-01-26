# Tasks 65-73: Transfer List & Warehouse Selects

> **Phase:** 07 - Frontend Infrastructure & ERP Dashboard  
> **SubPhase:** 09 - Inventory Management UI  
> **Group:** E - Warehouse Transfers  
> **Document:** 01 of 02  
> **Tasks Covered:** 65, 66, 67, 68, 69, 70, 71, 72, 73

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **→ Next Document:** [02_Tasks-74-78_Items-Actions.md](02_Tasks-74-78_Items-Actions.md)

---

## Document Overview

This document covers the creation of the warehouse transfers list page with table view, status tracking, and the initialization of the transfer creation form with source and destination warehouse selection.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 65 | Create Transfers List Page | Low | 20 min |
| 66 | Create Transfers Header | Low | 15 min |
| 67 | Create Transfers Table | Medium | 30 min |
| 68 | Define Transfer Table Columns | Medium | 25 min |
| 69 | Create Transfer Status Badge | Low | 15 min |
| 70 | Create New Transfer Page | Medium | 25 min |
| 71 | Create Transfer Form Schema | Medium | 30 min |
| 72 | Create Source Warehouse Select | Low | 20 min |
| 73 | Create Destination Warehouse Select | Low | 20 min |

---

## Task 65: Create Transfers List Page

### Overview
Create the main transfers list page displaying all warehouse transfer records with filtering, status tracking, and action capabilities.

### Dependencies
- Group A Task 14: Verify Route Structure
- Transfers route at /inventory/transfers exists

### Instructions

1. **Create component directory:** In `frontend/components/modules/inventory/`, create `Transfers/` folder
2. **Create main component:** Create `TransfersList.tsx`
3. **Set up page structure:** Header section, filters, and table area
4. **Add state management:** Manage filter state, selected transfers
5. **Add refresh capability:** Reload transfers on demand
6. **Export component:** Create index.ts barrel export

### Page Structure
```
┌────────────────────────────────────────┐
│  Warehouse Transfers  [New Transfer]   │
├────────────────────────────────────────┤
│  Filters: Status, Date Range, WH       │
├────────────────────────────────────────┤
│  Transfers Table                       │
│  ┌──────────────────────────────────┐  │
│  │ Date│Ref│From│To│Items│Status  │  │
│  └──────────────────────────────────┘  │
└────────────────────────────────────────┘
```

### Page Features

| Feature | Description |
|---------|-------------|
| List View | Table of all transfers |
| Filtering | Status, date, warehouses |
| Sorting | By date, reference, status |
| Actions | View, Receive, Cancel |
| Refresh | Manual refresh button |

### Expected Outcome
- Main container for transfers list
- Filter state management
- Table integration ready

### Verification
- [ ] Component created in correct directory
- [ ] Page structure defined
- [ ] State management configured

---

## Task 66: Create Transfers Header

### Overview
Create header component with page title, transfer count, filter summary, and action button for creating new transfers.

### Dependencies
- Task 65: Create Transfers List Page

### Instructions

1. **Create component file:** Create `TransfersHeader.tsx` in Transfers directory
2. **Add title section:** Display "Warehouse Transfers" heading with count
3. **Add new button:** "New Transfer" button linking to /inventory/transfers/new
4. **Add filter summary:** Show active filter count and clear option
5. **Add status stats:** Quick stats for pending, in-transit, completed
6. **Style header:** Flex layout with space-between alignment
7. **Add icons:** Truck icon for transfers, Plus for new button

### Header Layout
```
┌────────────────────────────────────────┐
│  🚚 Warehouse Transfers (34)           │
│  Pending: 5 | In Transit: 8 | Done: 21 │
│                                        │
│  [🔍 2 filters active - Clear]         │
│                          [+ New Transfer] │
└────────────────────────────────────────┘
```

### Header Elements

| Element | Description | Behavior |
|---------|-------------|----------|
| Title | "Warehouse Transfers" | Static with icon |
| Count Badge | Total transfers | Updates dynamically |
| Status Stats | Quick counts | Clickable to filter |
| Filter Summary | Active filters | Shows when filtered |
| Clear Filters | Button | Resets all filters |
| New Button | Create transfer | Links to form |

### Status Stats Display
```
Pending: 5    - Yellow dot
In Transit: 8 - Blue dot
Received: 21  - Green dot
```

### Expected Outcome
- Functional header with counts
- Navigation to new transfer form
- Filter status display
- Quick stats access

### Verification
- [ ] Header displays with counts
- [ ] New button navigates correctly
- [ ] Stats update dynamically
- [ ] Filter summary shows/hides

---

## Task 67: Create Transfers Table

### Overview
Create the main data table component for displaying transfer records with sorting, filtering, pagination, and action capabilities.

### Dependencies
- Task 65: Create Transfers List Page
- SubPhase-05 (Data Table Components) complete

### Instructions

1. **Create component file:** Create `TransfersTable.tsx`
2. **Import TanStack Table:** Import useReactTable and dependencies
3. **Define table props:** Accept data, columns, loading, onRowClick
4. **Set up table instance:** Configure with sorting and pagination
5. **Create table structure:** Header, body, and pagination footer
6. **Add loading skeleton:** Show skeleton rows while loading
7. **Add empty state:** Display message when no transfers exist
8. **Implement row click:** Navigate to transfer detail on click
9. **Add row actions:** Receive, cancel buttons per row
10. **Style table:** Responsive design with hover effects

### Table Structure
```
┌──────────────────────────────────────────────────────────┐
│ Date    │ Ref     │ From  │ To    │ Items │ Status │ ... │
├──────────────────────────────────────────────────────────┤
│ Jan 26  │ TRF-001 │ Main  │ Br. 1 │ 3     │ 🔵 Trans│ [→]│
│ 10:30   │         │       │       │       │        │     │
├──────────────────────────────────────────────────────────┤
│ Jan 25  │ TRF-002 │ Br. 1 │ Main  │ 5     │ ⏳ Pend│ [✕]│
│ 02:15   │         │       │       │       │        │     │
├──────────────────────────────────────────────────────────┤
│                   Showing 1-10 of 34                     │
└──────────────────────────────────────────────────────────┘
```

### Table Configuration

| Feature | Setting |
|---------|---------|
| Rows per page | 10, 25, 50 |
| Default sort | Date descending (newest first) |
| Sortable columns | Date, Reference, From, To, Status |
| Row click | Navigate to detail view |
| Loading | Skeleton 5 rows |
| Empty | "No transfers found" |

### Row Actions by Status

| Status | Actions Available |
|--------|-------------------|
| Pending | View, Cancel |
| In Transit | View, Receive, Cancel |
| Received | View only |
| Cancelled | View only |

### Expected Outcome
- Functional table with TanStack Table
- Sortable columns
- Status-based actions
- Clickable rows

### Verification
- [ ] Table renders with data
- [ ] Sorting works correctly
- [ ] Actions display properly
- [ ] Row click navigates

---

## Task 68: Define Transfer Table Columns

### Overview
Define the column configuration for the transfers table including headers, accessors, cell renderers, and sorting.

### Dependencies
- Task 67: Create Transfers Table

### Instructions

1. **Create columns file:** Create `TransferTableColumns.tsx`
2. **Import column types:** Import ColumnDef from TanStack Table
3. **Define type interface:** Create Transfer type for row data
4. **Create columns array:** Define all table columns
5. **Configure date column:** Format date and time with sorting
6. **Configure reference column:** Display reference with link
7. **Configure from/to columns:** Show warehouse names with codes
8. **Configure items column:** Display item count
9. **Configure status column:** Use status badge component
10. **Configure actions column:** Conditional action buttons
11. **Export columns:** Export column definitions

### Column Definitions

| Column | Width | Accessor | Sortable | Cell Type |
|--------|-------|----------|----------|-----------|
| Date | 150px | created_at | Yes | Date + Time |
| Reference | 150px | reference | Yes | Text + Link |
| From | 150px | source_warehouse.name | Yes | Warehouse |
| To | 150px | destination_warehouse.name | Yes | Warehouse |
| Items | 80px | items.length | No | Number |
| Status | 100px | status | Yes | Badge |
| Actions | 80px | - | No | Button Group |

### Date Column Configuration
```
Format: MMM DD, YYYY
Time: HH:MM AM/PM
Sort: ISO timestamp
Example: Jan 26, 2026 - 10:30 AM
```

### Reference Column Configuration
```
Display: TRF-XXXX format
Link: Navigate to detail
Copyable: Click to copy
Icon: External link on hover
```

### Warehouse Columns (From/To)
```
Display: Warehouse Name
Secondary: Code in gray
Example: Main Warehouse
         (WH-001)
```

### Items Column
```
Display: Number only
Tooltip: Show item names
Example: 3 items
```

### Expected Outcome
- Complete column definitions
- Proper data accessors
- Custom cell renderers
- Sorting configuration

### Verification
- [ ] All columns defined
- [ ] Sorting works
- [ ] Cell rendering correct
- [ ] Links functional

---

## Task 69: Create Transfer Status Badge

### Overview
Create a visual status badge component that displays transfer status with appropriate colors, icons, and descriptions.

### Dependencies
- Task 68: Define Transfer Table Columns

### Instructions

1. **Create component file:** Create `TransferStatusBadge.tsx`
2. **Define status type:** Create union type for valid statuses
3. **Define props interface:** Accept status and optional size
4. **Create status config:** Map each status to color, icon, label
5. **Implement component:** Render badge with icon and text
6. **Add variants:** Support small, medium, large sizes
7. **Add tooltips:** Explain status on hover
8. **Style badge:** Use Tailwind with status-specific colors
9. **Export component:** Export with type definitions

### Status Definitions

| Status | Color | Icon | Label | Description |
|--------|-------|------|-------|-------------|
| Pending | Yellow | Clock | Pending | Not yet shipped |
| In Transit | Blue | Truck | In Transit | Shipped, not received |
| Received | Green | CheckCircle | Received | Completed transfer |
| Cancelled | Gray | XCircle | Cancelled | Transfer cancelled |

### Badge Visual Design
```
Pending:     [⏰ Pending]     - Yellow bg, yellow text
In Transit:  [🚚 In Transit]  - Blue bg, blue text
Received:    [✓ Received]     - Green bg, green text
Cancelled:   [✗ Cancelled]    - Gray bg, gray text
```

### Badge Sizes

| Size | Height | Font Size | Icon Size | Padding |
|------|--------|-----------|-----------|---------|
| Small | 20px | 12px | 14px | 4px 8px |
| Medium | 24px | 14px | 16px | 6px 12px |
| Large | 28px | 16px | 18px | 8px 16px |

### Status Colors (Tailwind)

| Status | Background | Text | Border |
|--------|------------|------|--------|
| Pending | bg-yellow-100 | text-yellow-700 | border-yellow-300 |
| In Transit | bg-blue-100 | text-blue-700 | border-blue-300 |
| Received | bg-green-100 | text-green-700 | border-green-300 |
| Cancelled | bg-gray-100 | text-gray-700 | border-gray-300 |

### Tooltip Content by Status

| Status | Tooltip Text |
|--------|-------------|
| Pending | "Transfer created but not yet shipped" |
| In Transit | "Items shipped and en route to destination" |
| Received | "Transfer completed and items received" |
| Cancelled | "Transfer was cancelled" |

### Expected Outcome
- Reusable status badge component
- Visual distinction between statuses
- Size variants available
- Helpful tooltips

### Verification
- [ ] Badge renders for all statuses
- [ ] Colors match design
- [ ] Icons display correctly
- [ ] Tooltips show on hover

---

## Task 70: Create New Transfer Page

### Overview
Create the page for creating new warehouse transfers with a form for selecting source/destination warehouses and adding transfer items.

### Dependencies
- Group A Task 14: Verify Route Structure
- New transfer route at /inventory/transfers/new

### Instructions

1. **Create page directory:** In transfers folder, create `new/` folder
2. **Create page file:** In new directory, create `page.tsx`
3. **Define metadata:** Title "New Warehouse Transfer - LCC"
4. **Set up page layout:** Header with breadcrumbs and form container
5. **Add form wrapper:** Container with proper spacing and max-width
6. **Add step indicator:** Optional progress indicator
7. **Import form component:** Use TransferForm component
8. **Handle navigation:** Cancel returns to list, submit processes data

### Page Structure
```
┌────────────────────────────────────────┐
│  Home > Inventory > Transfers > New    │
├────────────────────────────────────────┤
│  New Warehouse Transfer                │
├────────────────────────────────────────┤
│  [Form Content Area]                   │
│                                        │
│  [Cancel]          [Create Transfer]   │
└────────────────────────────────────────┘
```

### Form Sections

| Section | Content | Purpose |
|---------|---------|---------|
| Header | Reference, Expected date | Basic info |
| Warehouses | Source & Destination | Define route |
| Items | Product selection, quantities | What to transfer |
| Notes | Optional transfer notes | Context |

### Navigation Elements

| Element | Type | Action |
|---------|------|--------|
| Breadcrumbs | Links | Navigate to parent pages |
| Cancel Button | Secondary | Return to list (confirm if changes) |
| Create Button | Primary | Submit transfer |

### Expected Outcome
- New transfer form page
- Clean form interface
- Proper navigation and breadcrumbs

### Verification
- [ ] Page renders at correct route
- [ ] Breadcrumbs work
- [ ] Form displays correctly
- [ ] Navigation functions

---

## Task 71: Create Transfer Form Schema

### Overview
Create Zod validation schema for the transfer form ensuring data integrity, preventing same warehouse transfers, and validating stock availability.

### Dependencies
- Task 70: Create New Transfer Page
- Zod library installed

### Instructions

1. **Create schema file:** In `frontend/lib/validations/`, create `transfer.ts`
2. **Import Zod:** Import z from 'zod'
3. **Define item schema:** Schema for individual transfer items
4. **Define main schema:** Complete transfer form schema
5. **Add custom validations:** Source != Destination, quantity limits
6. **Add stock check:** Validate available quantity
7. **Define TypeScript types:** Infer types from schemas
8. **Export schemas:** Export for use in forms
9. **Add error messages:** Custom validation error messages

### Schema Structure

**Transfer Item Schema:**
| Field | Type | Validation | Error Message |
|-------|------|------------|---------------|
| product_id | string | UUID, required | "Product is required" |
| product_name | string | Min 1 char | "Product name required" |
| available_quantity | number | >= 0 | "Invalid availability" |
| transfer_quantity | number | > 0, <= available | "Invalid quantity" |
| notes | string | Optional, max 200 | "Notes too long" |

**Main Transfer Schema:**
| Field | Type | Validation | Error Message |
|-------|------|------------|---------------|
| reference | string | Auto-generated | Auto-generated |
| source_warehouse_id | string | UUID, required | "Source warehouse required" |
| destination_warehouse_id | string | UUID, required, != source | "Destination required & different" |
| expected_date | date | Optional, future | "Must be future date" |
| notes | string | Optional, max 500 | "Notes too long" |
| items | array | Min 1, unique products | "Add at least 1 item" |

### Custom Validations

| Rule | Check | Error |
|------|-------|-------|
| Different Warehouses | source_id != destination_id | "Source and destination must be different" |
| Unique Products | No duplicate product_id | "Product already added" |
| Min Items | At least 1 item | "Add at least one item" |
| Stock Available | transfer_qty <= available_qty | "Insufficient stock at source" |
| Valid Quantity | transfer_qty > 0 | "Quantity must be greater than 0" |

### Validation Rules Summary
```
1. Source and destination must be different warehouses
2. Each product can only appear once in the transfer
3. Transfer quantity must not exceed available stock
4. At least one item must be included
5. All quantities must be positive numbers
6. Expected date must be in the future (if provided)
```

### Expected Outcome
- Complete Zod schema for validation
- TypeScript types inferred
- Custom error messages
- Stock validation logic

### Verification
- [ ] Schema validates correctly
- [ ] Types inferred properly
- [ ] Error messages display
- [ ] Custom validations work

---

## Task 72: Create Source Warehouse Select

### Overview
Create a specialized select component for choosing the source warehouse with stock information and filtering out the destination warehouse.

### Dependencies
- Task 71: Create Transfer Form Schema

### Instructions

1. **Create component file:** Create `SourceWarehouseSelect.tsx`
2. **Define component props:** Accept value, onChange, excludeId, error
3. **Fetch warehouses:** Query all active warehouses
4. **Filter options:** Exclude destination if selected
5. **Display format:** Name, code, total items
6. **Add search:** Filter warehouses by name/code
7. **Show stock info:** Display total items in each warehouse
8. **Handle selection:** Call onChange callback
9. **Style component:** Consistent form styling
10. **Export component:** Export with types

### Select Structure
```
┌────────────────────────────────────────┐
│  Source Warehouse *                    │
│  [Select source warehouse ▼]           │
│                                        │
│  Dropdown:                             │
│  ┌──────────────────────────────────┐  │
│  │ 🏢 Main Warehouse (WH-001)       │  │
│  │    234 items in stock            │  │
│  ├──────────────────────────────────┤  │
│  │ 🏪 Branch 1 (WH-002)             │  │
│  │    156 items in stock            │  │
│  ├──────────────────────────────────┤  │
│  │ 🏪 Branch 2 (WH-003)             │  │
│  │    89 items in stock             │  │
│  └──────────────────────────────────┘  │
└────────────────────────────────────────┘
```

### Dropdown Item Layout
```
[Icon] Warehouse Name (Code)
       N items in stock
```

### Display Information

| Element | Content |
|---------|---------|
| Icon | Building icon (variant by type) |
| Name | Warehouse name |
| Code | Warehouse code (gray) |
| Stock | Total items count |
| Status | Active badge |

### Filtering Logic

| Condition | Behavior |
|-----------|----------|
| No destination | Show all warehouses |
| Destination selected | Hide that warehouse |
| Search query | Filter by name/code |
| Inactive | Hide inactive warehouses |

### Component Features

| Feature | Implementation |
|---------|----------------|
| Search | Filter by typing |
| Icons | Visual distinction |
| Stock Info | Help with decision |
| Keyboard | Arrow navigation |
| Validation | Required field |

### Expected Outcome
- Functional source warehouse select
- Excludes destination
- Shows stock information
- Searchable options

### Verification
- [ ] Warehouses load
- [ ] Exclusion works
- [ ] Stock displays
- [ ] Selection works

---

## Task 73: Create Destination Warehouse Select

### Overview
Create a specialized select component for choosing the destination warehouse, ensuring it differs from the source warehouse.

### Dependencies
- Task 71: Create Transfer Form Schema
- Task 72: Create Source Warehouse Select

### Instructions

1. **Create component file:** Create `DestinationWarehouseSelect.tsx`
2. **Define component props:** Accept value, onChange, excludeId, error
3. **Fetch warehouses:** Query all active warehouses
4. **Filter options:** Exclude source if selected
5. **Display format:** Name, code, capacity info
6. **Add search:** Filter warehouses by name/code
7. **Show capacity:** Display available space if applicable
8. **Handle selection:** Call onChange callback
9. **Validate selection:** Ensure different from source
10. **Style component:** Consistent form styling
11. **Export component:** Export with types

### Select Structure
```
┌────────────────────────────────────────┐
│  Destination Warehouse *               │
│  [Select destination warehouse ▼]      │
│                                        │
│  Dropdown:                             │
│  ┌──────────────────────────────────┐  │
│  │ 🏪 Branch 1 (WH-002)             │  │
│  │    Capacity: 80% (Space available)│  │
│  ├──────────────────────────────────┤  │
│  │ 🏪 Branch 2 (WH-003)             │  │
│  │    Capacity: 45% (Space available)│  │
│  ├──────────────────────────────────┤  │
│  │ 🏢 Secondary Warehouse (WH-004)  │  │
│  │    Capacity: 95% (Nearly full)   │  │
│  └──────────────────────────────────┘  │
└────────────────────────────────────────┘
```

### Dropdown Item Layout
```
[Icon] Warehouse Name (Code)
       Capacity: N% (Status text)
```

### Display Information

| Element | Content |
|---------|---------|
| Icon | Building icon (variant by type) |
| Name | Warehouse name |
| Code | Warehouse code (gray) |
| Capacity | Utilization percentage |
| Status | Space availability text |

### Capacity Indicators

| Utilization | Color | Text |
|-------------|-------|------|
| 0-50% | Green | "Plenty of space" |
| 51-80% | Yellow | "Space available" |
| 81-95% | Orange | "Limited space" |
| 96-100% | Red | "Nearly full" |

### Filtering Logic

| Condition | Behavior |
|-----------|----------|
| No source | Show all warehouses |
| Source selected | Hide that warehouse |
| Search query | Filter by name/code |
| Inactive | Hide inactive warehouses |

### Validation

| Check | Error Message |
|-------|---------------|
| Required | "Destination warehouse is required" |
| Same as source | "Destination must be different from source" |
| Inactive | "Selected warehouse is inactive" |

### Component Features

| Feature | Implementation |
|---------|----------------|
| Search | Filter by typing |
| Icons | Visual distinction |
| Capacity Info | Help with decision |
| Keyboard | Arrow navigation |
| Validation | Required, != source |

### Expected Outcome
- Functional destination warehouse select
- Excludes source warehouse
- Shows capacity information
- Validates properly

### Verification
- [ ] Warehouses load
- [ ] Exclusion works
- [ ] Capacity displays
- [ ] Selection works
- [ ] Validation triggers

---

## Summary

This document established the foundation for warehouse transfers functionality, including:

✓ Transfers list page with filtering  
✓ Transfers table with sortable columns  
✓ Status badge with visual indicators  
✓ New transfer page structure  
✓ Zod validation schema  
✓ Source warehouse select with stock info  
✓ Destination warehouse select with capacity info  
✓ Validation preventing same-warehouse transfers  

**Next Document:** [02_Tasks-74-78_Items-Actions.md](02_Tasks-74-78_Items-Actions.md) covers the items section for selecting products to transfer, stock availability checks, and submission workflow.

---

**Completion Checklist:**
- [ ] All components created in correct directories
- [ ] Forms use React Hook Form + Zod
- [ ] Table uses TanStack Table
- [ ] Status badges styled correctly
- [ ] Validation working (source != destination)
- [ ] Warehouse selects populate correctly
- [ ] Navigation between pages functional
- [ ] Error handling implemented
- [ ] Loading states added
