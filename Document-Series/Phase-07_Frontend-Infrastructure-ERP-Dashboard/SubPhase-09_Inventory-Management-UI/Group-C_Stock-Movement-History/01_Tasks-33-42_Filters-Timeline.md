# Tasks 33-42: Filters & Timeline View

> **Phase:** 07 - Frontend Infrastructure & ERP Dashboard  
> **SubPhase:** 09 - Inventory Management UI  
> **Group:** C - Stock Movement History  
> **Document:** 01 of 02  
> **Tasks Covered:** 33, 34, 35, 36, 37, 38, 39, 40, 41, 42

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **→ Next Document:** [02_Tasks-43-48_Table-Modal-Export.md](02_Tasks-43-48_Table-Modal-Export.md)

---

## Document Overview

This document covers the creation of the stock movements page with filter toolbar and timeline view. It includes date range filtering, movement type filtering, and a visual timeline showing the history of stock movements with directional icons.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 33 | Create Movements Page | Low | 20 min |
| 34 | Create Movements Header | Low | 15 min |
| 35 | Create Movements Filters | Medium | 30 min |
| 36 | Create Date Range Filter | Medium | 25 min |
| 37 | Create Movement Type Filter | Low | 15 min |
| 38 | Create Product Filter | Low | 15 min |
| 39 | Create Warehouse Filter | Low | 15 min |
| 40 | Create Movements Timeline | Medium | 30 min |
| 41 | Create Movement Timeline Item | Medium | 25 min |
| 42 | Create Movement Direction Icon | Low | 15 min |

---

## Task 33: Create Movements Page

### Overview
Create the main movements page component to display stock movement history.

### Dependencies
- Group A Task 14: Verify Route Structure
- Movements route created at /inventory/movements

### Instructions

1. **Create component directory:** In `frontend/components/modules/inventory/`, create `Movements/` folder
2. **Create main component:** Create `MovementsPage.tsx`
3. **Set up page structure:** Header, filters, and view area sections
4. **Add view state:** Manage timeline/table view toggle
5. **Export component:** Create index.ts barrel export

### Page Structure
```
┌────────────────────────────────────────┐
│  Header (Title + Export)               │
├────────────────────────────────────────┤
│  Filters (Date, Type, Product, WH)     │
├────────────────────────────────────────┤
│  View Toggle (Timeline | Table)        │
├────────────────────────────────────────┤
│  Content Area (Timeline or Table)      │
└────────────────────────────────────────┘
```

### Expected Outcome
- Main page container for movements
- Section layout defined
- View state management ready

### Verification
- [ ] Component created in correct directory
- [ ] Page structure defined
- [ ] Exports properly

---

## Task 34: Create Movements Header

### Overview
Create header component with page title and export button.

### Dependencies
- Task 33: Create Movements Page

### Instructions

1. **Create component file:** Create `MovementsHeader.tsx`
2. **Add title section:** Display "Stock Movements" heading
3. **Add export button:** Button to export filtered movements
4. **Add info badge:** Show count of filtered movements
5. **Style header:** Flex layout with space-between

### Header Layout
```
┌────────────────────────────────────────┐
│  Stock Movements (234)    [Export ⬇️]  │
└────────────────────────────────────────┘
```

### Expected Outcome
- Header with title and count badge
- Export button triggering download
- Responsive layout

### Verification
- [ ] Header displays title
- [ ] Movement count shows
- [ ] Export button present

---

## Task 35: Create Movements Filters

### Overview
Create the filter toolbar container for all movement filters.

### Dependencies
- Task 33: Create Movements Page

### Instructions

1. **Create component file:** Create `MovementsFilters.tsx`
2. **Create filter container:** Horizontal layout for filter inputs
3. **Add filter state:** Manage all filter values
4. **Add reset button:** Clear all filters option
5. **Emit filter changes:** Pass filter values to parent
6. **Make responsive:** Stack filters on mobile

### Filter Bar Layout
```
Desktop:
┌──────────────────────────────────────────────────────────┐
│ [Date Range] [Type ▼] [Product] [Warehouse ▼] [Reset]   │
└──────────────────────────────────────────────────────────┘

Mobile:
┌─────────────────┐
│ [Date Range]    │
├─────────────────┤
│ [Type ▼]        │
├─────────────────┤
│ [Product]       │
├─────────────────┤
│ [Warehouse ▼]   │
└─────────────────┘
```

### Expected Outcome
- Filter toolbar container
- Responsive filter layout
- Filter state management

### Verification
- [ ] Filter bar renders
- [ ] Filters display horizontally
- [ ] Mobile layout stacks

---

## Task 36: Create Date Range Filter

### Overview
Create date range picker filter with preset options for quick filtering.

### Dependencies
- Task 35: Create Movements Filters

### Instructions

1. **Import date picker:** Use DateRangePicker component
2. **Add preset options:** Quick select buttons (Today, Yesterday, etc.)
3. **Add custom range:** Calendar picker for custom dates
4. **Set default range:** Default to "Last 7 days"
5. **Format dates:** Use ISO format for API
6. **Handle selection:** Emit date range to parent

### Preset Options

| Preset | Range | Description |
|--------|-------|-------------|
| Today | Current day | 00:00 - 23:59 today |
| Yesterday | Previous day | Full previous day |
| Last 7 days | Past week | 7 days back to today |
| Last 30 days | Past month | 30 days back to today |
| This month | Current month | 1st to today |
| Custom | Date picker | Select any range |

### Date Picker Layout
```
┌─────────────────────────────────┐
│  Last 7 days ▼                  │
└─────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────┐
│  Quick Select:                  │
│  [Today] [Yesterday]            │
│  [Last 7d] [Last 30d]           │
│  [This month] [Custom]          │
│                                 │
│  Custom Range:                  │
│  From: [Jan 15, 2026]           │
│  To:   [Jan 25, 2026]           │
│                                 │
│  [Cancel] [Apply]               │
└─────────────────────────────────┘
```

### Expected Outcome
- Date range picker with presets
- Custom range selection
- Formatted date output

### Verification
- [ ] Preset buttons work
- [ ] Custom picker opens
- [ ] Dates filter correctly

---

## Task 37: Create Movement Type Filter

### Overview
Create dropdown filter for selecting movement types (all, in, out, adjustment, transfer).

### Dependencies
- Task 35: Create Movements Filters

### Instructions

1. **Create dropdown:** Use Select component
2. **Define type options:** All, In, Out, Adjustment, Transfer
3. **Add icons:** Icon for each movement type
4. **Set default:** Default to "All"
5. **Handle selection:** Emit selected type to parent

### Movement Type Options

| Value | Label | Icon | Color | Description |
|-------|-------|------|-------|-------------|
| all | All Movements | - | Gray | Show all |
| in | Stock In | ArrowDown | Green | Received stock |
| out | Stock Out | ArrowUp | Red | Sold/used stock |
| adjustment | Adjustment | Edit | Yellow | Manual correction |
| transfer | Transfer | ArrowLeftRight | Blue | Warehouse move |

### Dropdown Layout
```
┌─────────────────────────┐
│  Type: All ▼            │
└─────────────────────────┘
         │
         ▼
┌─────────────────────────┐
│  ✓ All Movements        │
│  ⬇️ Stock In            │
│  ⬆️ Stock Out           │
│  ✏️ Adjustment          │
│  ⬌ Transfer             │
└─────────────────────────┘
```

### Expected Outcome
- Type filter dropdown
- Icons for visual clarity
- Type-based filtering

### Verification
- [ ] Dropdown displays options
- [ ] Icons show correctly
- [ ] Selection filters data

---

## Task 38: Create Product Filter

### Overview
Create autocomplete search input for filtering by specific product.

### Dependencies
- Task 35: Create Movements Filters

### Instructions

1. **Create autocomplete:** Use Combobox component
2. **Add search input:** Text input with debounce
3. **Fetch product list:** Load products as user types
4. **Display suggestions:** Show matching products
5. **Handle selection:** Emit selected product to parent
6. **Add clear button:** Quick clear option

### Autocomplete Features

| Feature | Implementation |
|---------|----------------|
| Search | Debounced input (300ms) |
| Dropdown | Max 10 suggestions |
| Display | Product name + SKU |
| Selection | Store product ID |
| Clear | X button to reset |

### Autocomplete Layout
```
┌─────────────────────────┐
│  Product: [Search...] X │
└─────────────────────────┘
         │
         ▼ (typing)
┌─────────────────────────┐
│  Product A (SKU001)     │
│  Product AB (SKU012)    │
│  Product ABC (SKU023)   │
└─────────────────────────┘
```

### Expected Outcome
- Searchable product filter
- Autocomplete suggestions
- Clear selection option

### Verification
- [ ] Search returns results
- [ ] Selection works
- [ ] Clear button resets

---

## Task 39: Create Warehouse Filter

### Overview
Create dropdown filter for selecting specific warehouse.

### Dependencies
- Task 35: Create Movements Filters

### Instructions

1. **Create dropdown:** Use Select component
2. **Add "All Warehouses" option:** Default selection
3. **Load warehouses:** Fetch warehouse list
4. **Display warehouse names:** Show warehouse name
5. **Handle selection:** Emit selected warehouse to parent

### Warehouse Options

| Value | Label |
|-------|-------|
| all | All Warehouses |
| wh-001 | Main Warehouse |
| wh-002 | Branch 1 |
| wh-003 | Storage Facility |

### Expected Outcome
- Warehouse dropdown filter
- All warehouses default option
- Warehouse-based filtering

### Verification
- [ ] Dropdown loads warehouses
- [ ] Selection updates filter
- [ ] "All" option works

---

## Task 40: Create Movements Timeline

### Overview
Create vertical timeline component for displaying stock movements chronologically.

### Dependencies
- Task 33: Create Movements Page
- Tasks 36-39: Filters complete

### Instructions

1. **Create component file:** Create `MovementsTimeline.tsx`
2. **Define timeline structure:** Vertical layout with connecting line
3. **Accept movements data:** Props for movement items
4. **Render timeline items:** Map through movements
5. **Add loading state:** Skeleton timeline items
6. **Add empty state:** Message when no movements
7. **Group by date:** Optional date headers

### Timeline Structure
```
┌────────────────────────────────┐
│  Jan 25, 2026                  │
│  ┌─●─────────────────────────┐ │
│  │ Product A - Sale           │ │
│  │ ⬆️ -10 units               │ │
│  │ Ref: INV-001 | 10:30 AM   │ │
│  └────────────────────────────┘ │
│  │                             │
│  ┌─●─────────────────────────┐ │
│  │ Product B - Purchase       │ │
│  │ ⬇️ +50 units               │ │
│  │ Ref: PO-123 | 09:15 AM    │ │
│  └────────────────────────────┘ │
│                                 │
│  Jan 24, 2026                  │
│  ┌─●─────────────────────────┐ │
│  │ Product C - Adjustment     │ │
│  │ ✏️ +5 units                │ │
│  │ Ref: ADJ-045 | 04:20 PM   │ │
│  └────────────────────────────┘ │
└────────────────────────────────┘
```

### Timeline Features

| Feature | Description |
|---------|-------------|
| Vertical line | Connects all items |
| Date groups | Group by date headers |
| Chronological | Newest first (reverse) |
| Infinite scroll | Load more on scroll |

### Expected Outcome
- Vertical timeline layout
- Date-grouped movements
- Smooth scrolling

### Verification
- [ ] Timeline displays vertically
- [ ] Items grouped by date
- [ ] Connecting line visible

---

## Task 41: Create Movement Timeline Item

### Overview
Create individual timeline item component displaying movement details.

### Dependencies
- Task 40: Create Movements Timeline
- Task 42: Create Movement Direction Icon

### Instructions

1. **Create component file:** Create `MovementTimelineItem.tsx`
2. **Define props interface:** Accept movement data
3. **Add timeline dot:** Circle icon on timeline
4. **Add direction icon:** Show in/out/adjust icon
5. **Display movement info:** Product, quantity, type
6. **Add metadata:** Reference, user, timestamp
7. **Make clickable:** Open detail modal on click
8. **Add hover effect:** Highlight on hover

### Timeline Item Structure
```
┌───●─────────────────────────────────┐
│  ⬆️  Product A - Stock Out           │
│  -15 units • Sale                   │
│  Ref: INV-001                       │
│  by John Doe • 10:30 AM             │
└─────────────────────────────────────┘
```

### Item Elements

| Element | Content | Position |
|---------|---------|----------|
| Dot | Timeline marker | Left edge |
| Icon | Direction icon | Left side |
| Title | Product + type | Top |
| Quantity | Change amount | Middle |
| Reference | Reference number | Bottom |
| User | Who performed | Bottom right |
| Time | Timestamp | Bottom right |

### Movement Info Display

| Type | Title Format | Badge Color |
|------|-------------|-------------|
| Sale | "Product - Stock Out" | Red |
| Purchase | "Product - Stock In" | Green |
| Adjustment | "Product - Adjustment" | Yellow |
| Transfer | "Product - Transfer" | Blue |

### Expected Outcome
- Styled timeline item card
- All movement details displayed
- Clickable for more info

### Verification
- [ ] Item displays all info
- [ ] Click opens modal
- [ ] Hover effect works

---

## Task 42: Create Movement Direction Icon

### Overview
Create icon component showing movement direction (in, out, adjustment, transfer).

### Dependencies
- Task 41: Create Movement Timeline Item

### Instructions

1. **Create component file:** Create `MovementDirectionIcon.tsx`
2. **Define props interface:** Accept movement type
3. **Map type to icon:** Different icon per type
4. **Add icon colors:** Color based on direction
5. **Add background:** Circular background
6. **Add tooltip:** Hover to show type

### Direction Icons

| Type | Icon | Color | Background | Description |
|------|------|-------|------------|-------------|
| In | ArrowDown | Green | Light green | Stock received |
| Out | ArrowUp | Red | Light red | Stock removed |
| Adjustment+ | Plus | Green | Light green | Added quantity |
| Adjustment- | Minus | Red | Light red | Reduced quantity |
| Transfer | ArrowLeftRight | Blue | Light blue | Moved between |

### Icon Component Structure
```
┌─────┐
│ ⬇️  │  Green icon on light green circle
└─────┘
  │
  └─→ Tooltip: "Stock In"
```

### Icon Sizes

| Context | Size | Description |
|---------|------|-------------|
| Timeline | 32px | Standard view |
| Table | 24px | Compact view |
| Detail | 48px | Modal header |

### Expected Outcome
- Icon component with colors
- Circular background
- Tooltip on hover

### Verification
- [ ] Correct icon displays
- [ ] Colors match type
- [ ] Tooltip shows

---

## Summary

This document created the movements page with filters and timeline view:

### Components Created
- MovementsPage container (Task 33)
- MovementsHeader with export (Task 34)
- MovementsFilters toolbar (Task 35)
- Four filters: Date Range, Type, Product, Warehouse (Tasks 36-39)
- MovementsTimeline with date grouping (Task 40)
- MovementTimelineItem card (Task 41)
- MovementDirectionIcon with colors (Task 42)

### Key Features
- Date range filtering with presets
- Movement type filtering
- Product and warehouse filters
- Vertical timeline layout
- Direction-based icons and colors
- Date-grouped movements
- Clickable timeline items

### Next Steps
Continue to Document 02 for table view, detail modal, and export functionality (Tasks 43-48).
