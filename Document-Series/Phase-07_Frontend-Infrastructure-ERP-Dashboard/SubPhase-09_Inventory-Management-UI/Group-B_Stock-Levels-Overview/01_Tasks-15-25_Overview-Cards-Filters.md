# Tasks 15-25: Overview Page, Summary Cards & Filters

> **Phase:** 07 - Frontend Infrastructure & ERP Dashboard  
> **SubPhase:** 09 - Inventory Management UI  
> **Group:** B - Stock Levels Overview  
> **Document:** 01 of 02  
> **Tasks Covered:** 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **→ Next Document:** [02_Tasks-26-32_StockTable-API.md](02_Tasks-26-32_StockTable-API.md)

---

## Document Overview

This document covers the creation of the stock levels overview page structure, including the page header, four summary statistic cards, and a comprehensive filter bar. These components provide users with at-a-glance metrics and powerful filtering capabilities for managing inventory effectively.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 15 | Create Stock Overview Page | Low | 20 min |
| 16 | Create Stock Overview Header | Low | 15 min |
| 17 | Create Stock Summary Cards | Medium | 30 min |
| 18 | Create Total Products Card | Low | 15 min |
| 19 | Create Low Stock Alert Card | Low | 15 min |
| 20 | Create Out of Stock Card | Low | 15 min |
| 21 | Create Total Valuation Card | Low | 15 min |
| 22 | Create Stock Filters Bar | Low | 20 min |
| 23 | Create Product Search | Low | 15 min |
| 24 | Create Warehouse Filter | Low | 15 min |
| 25 | Create Stock Level Filter | Low | 15 min |

---

## Task 15: Create Stock Overview Page

### Overview
Create the main stock overview page component that serves as the container for all stock level features. This is the main component in `frontend/app/(dashboard)/inventory/page.tsx`.

### Dependencies
- Group A Task 14: Verify Route Structure
- SubPhase-08 (Dashboard Layout) complete

### Instructions

1. **Create component directory:** In `frontend/components/modules/`, create `inventory/StockOverview/` folder
2. **Create main component:** Create `StockOverview.tsx` in StockOverview directory
3. **Define component structure:** Set up component with header, cards, filters, and table sections
4. **Add container layout:** Use proper spacing and responsive grid
5. **Export component:** Create index.ts barrel export

### Component Structure
```
┌────────────────────────────────────────┐
│  StockOverview Component               │
├────────────────────────────────────────┤
│  Header                                │
├────────────────────────────────────────┤
│  Summary Cards (4 cards)               │
├────────────────────────────────────────┤
│  Filters Bar                           │
├────────────────────────────────────────┤
│  Data Table                            │
└────────────────────────────────────────┘
```

### Expected Outcome
- Main stock overview component created
- Proper section layout defined
- Ready to receive child components

### Verification
- [ ] Component file created in correct directory
- [ ] Component exports properly
- [ ] Layout structure defined

---

## Task 16: Create Stock Overview Header

### Overview
Create the page header component displaying the title and action button for creating new stock adjustments.

### Dependencies
- Task 15: Create Stock Overview Page

### Instructions

1. **Create component file:** In StockOverview directory, create `StockOverviewHeader.tsx`
2. **Add title section:** Display "Stock Levels" heading
3. **Add action button:** "New Adjustment" button linking to /inventory/adjustments/new
4. **Style header:** Use flex layout with space-between alignment
5. **Add icon:** Include Plus icon on button

### Header Layout
```
┌────────────────────────────────────────┐
│  Stock Levels        [New Adjustment]  │
└────────────────────────────────────────┘
```

### Expected Outcome
- Header with title and action button
- Responsive layout adjusting for mobile
- Button links to adjustment creation

### Verification
- [ ] Header displays title correctly
- [ ] Button navigates to correct route
- [ ] Responsive on mobile devices

---

## Task 17: Create Stock Summary Cards

### Overview
Create the container component for the four summary statistic cards. Sets up responsive grid layout.

### Dependencies
- Task 15: Create Stock Overview Page

### Instructions

1. **Create component file:** Create `StockSummaryCards.tsx` in StockOverview directory
2. **Define props interface:** Accept summary data as props
3. **Create grid layout:** 4-column grid on desktop, 2-column on tablet, 1-column on mobile
4. **Add card slots:** Four card positions for statistics
5. **Handle loading state:** Show skeleton cards while data loads

### Grid Layout

| Screen Size | Columns | Card Width |
|-------------|---------|------------|
| Mobile (< 640px) | 1 | 100% |
| Tablet (640-1024px) | 2 | 50% each |
| Desktop (> 1024px) | 4 | 25% each |

### Cards Grid
```
Desktop Layout:
┌──────┬──────┬──────┬──────┐
│ Card │ Card │ Card │ Card │
│  1   │  2   │  3   │  4   │
└──────┴──────┴──────┴──────┘

Mobile Layout:
┌────────────┐
│   Card 1   │
├────────────┤
│   Card 2   │
├────────────┤
│   Card 3   │
├────────────┤
│   Card 4   │
└────────────┘
```

### Expected Outcome
- Responsive grid container for cards
- Proper spacing between cards
- Loading state support

### Verification
- [ ] Grid layout responds to screen size
- [ ] Cards display in correct order
- [ ] Spacing is consistent

---

## Task 18: Create Total Products Card

### Overview
Create the first summary card displaying the total count of products tracked in inventory.

### Dependencies
- Task 17: Create Stock Summary Cards

### Instructions

1. **Create component file:** Create `TotalProductsCard.tsx`
2. **Import card component:** Use base Card component from UI library
3. **Add icon:** Use Package icon from lucide-react
4. **Display metrics:** Show total product count and percentage change
5. **Style card:** Apply consistent card styling with icon color

### Card Structure
```
┌────────────────────────┐
│  📦  Total Products    │
│                        │
│      1,234             │
│    ↑ +5% from last mo │
└────────────────────────┘
```

### Metric Display

| Element | Description |
|---------|-------------|
| Icon | Package icon (blue) |
| Label | "Total Products" |
| Value | Product count |
| Trend | Percentage change with arrow |

### Expected Outcome
- Card displays total product count
- Trend indicator shows growth/decline
- Consistent styling with design system

### Verification
- [ ] Card renders with correct data
- [ ] Icon displays properly
- [ ] Trend calculation works

---

## Task 19: Create Low Stock Alert Card

### Overview
Create card showing the count of products below their reorder point, requiring attention.

### Dependencies
- Task 17: Create Stock Summary Cards

### Instructions

1. **Create component file:** Create `LowStockCard.tsx`
2. **Add alert icon:** Use AlertTriangle icon (yellow/orange)
3. **Display count:** Show number of products below reorder point
4. **Add action link:** Link to filtered view showing only low stock items
5. **Highlight urgency:** Use warning color scheme

### Card Structure
```
┌────────────────────────┐
│  ⚠️  Low Stock Alerts  │
│                        │
│       23               │
│    Needs attention    │
└────────────────────────┘
```

### Alert Severity

| Count | Severity | Color |
|-------|----------|-------|
| 0 | None | Gray |
| 1-10 | Low | Yellow |
| 11-50 | Medium | Orange |
| 50+ | High | Red |

### Expected Outcome
- Card displays low stock count
- Color indicates severity level
- Clickable to filter low stock items

### Verification
- [ ] Count displays correctly
- [ ] Severity colors applied
- [ ] Click filters table properly

---

## Task 20: Create Out of Stock Card

### Overview
Create card displaying the count of products completely out of stock (quantity = 0).

### Dependencies
- Task 17: Create Stock Summary Cards

### Instructions

1. **Create component file:** Create `OutOfStockCard.tsx`
2. **Add error icon:** Use XCircle icon (red)
3. **Display count:** Show number of products with zero quantity
4. **Add urgency indicator:** Use critical color scheme (red)
5. **Add action link:** Link to out-of-stock filtered view

### Card Structure
```
┌────────────────────────┐
│  ❌  Out of Stock      │
│                        │
│        8               │
│    Immediate action   │
└────────────────────────┘
```

### Critical Status
- Use red color scheme for urgency
- Display "Immediate action" text
- Make entire card clickable

### Expected Outcome
- Card highlights critical out-of-stock items
- Clear visual indication of urgency
- Links to filtered view

### Verification
- [ ] Card displays correct count
- [ ] Red color scheme applied
- [ ] Link to filtered view works

---

## Task 21: Create Total Valuation Card

### Overview
Create card displaying the total monetary value of all inventory in LKR.

### Dependencies
- Task 17: Create Stock Summary Cards

### Instructions

1. **Create component file:** Create `ValuationCard.tsx`
2. **Add currency icon:** Use DollarSign or Coins icon (green)
3. **Display value:** Show total inventory value in LKR format
4. **Format currency:** Use proper Sri Lankan Rupee formatting (₨ X,XXX,XXX.XX)
5. **Show breakdown:** Optional breakdown by warehouse

### Card Structure
```
┌────────────────────────┐
│  💰  Total Valuation   │
│                        │
│  ₨ 12,450,000.00       │
│    Across 3 warehouses│
└────────────────────────┘
```

### Currency Formatting

| Value | Formatted Display |
|-------|-------------------|
| 1234567.89 | ₨ 1,234,567.89 |
| 1000000 | ₨ 1,000,000.00 |
| 500.5 | ₨ 500.50 |

### Expected Outcome
- Card displays total inventory value
- Proper LKR currency formatting
- Optional warehouse breakdown

### Verification
- [ ] Value calculates correctly
- [ ] Currency formatting proper
- [ ] Displays LKR symbol

---

## Task 22: Create Stock Filters Bar

### Overview
Create the filter bar component containing search, warehouse filter, and stock level filter.

### Dependencies
- Task 15: Create Stock Overview Page

### Instructions

1. **Create component file:** Create `StockFilters.tsx`
2. **Create filter container:** Horizontal flex layout for filter inputs
3. **Add filter state:** Manage filter values in component state
4. **Add reset button:** Clear all filters option
5. **Emit filter changes:** Pass filter values to parent component
6. **Make responsive:** Stack filters vertically on mobile

### Filter Bar Layout

```
Desktop:
┌────────────────────────────────────────────────────┐
│ [Search...] [Warehouse ▼] [Stock Level ▼] [Reset] │
└────────────────────────────────────────────────────┘

Mobile:
┌─────────────────┐
│ [Search...]     │
├─────────────────┤
│ [Warehouse ▼]   │
├─────────────────┤
│ [Stock Level ▼] │
├─────────────────┤
│ [Reset]         │
└─────────────────┘
```

### Filter State Structure
```
Filters Object:
- search: string
- warehouse: string | "all"
- stockLevel: "all" | "low" | "out" | "overstock"
```

### Expected Outcome
- Functional filter bar with three filter types
- Responsive layout for mobile
- Filter state management working

### Verification
- [ ] All three filters display
- [ ] Filter state updates correctly
- [ ] Reset button clears filters

---

## Task 23: Create Product Search

### Overview
Create the search input component for filtering products by name or SKU.

### Dependencies
- Task 22: Create Stock Filters Bar

### Instructions

1. **Add search input:** Create text input with search icon
2. **Implement debouncing:** Delay search by 300ms after typing stops
3. **Add clear button:** X button to clear search quickly
4. **Add placeholder:** "Search by product name or SKU"
5. **Handle onChange:** Emit search value to parent

### Search Input Features

| Feature | Implementation |
|---------|----------------|
| Icon | Search icon on left |
| Debounce | 300ms delay |
| Clear | X button on right |
| Placeholder | Descriptive text |

### Search Behavior
```
User types → Wait 300ms → Emit search value → Filter table
```

### Expected Outcome
- Functional search input with debounce
- Clear button for quick reset
- Smooth typing experience

### Verification
- [ ] Search input renders correctly
- [ ] Debounce prevents excessive updates
- [ ] Clear button works

---

## Task 24: Create Warehouse Filter

### Overview
Create dropdown filter for selecting specific warehouse or viewing all warehouses.

### Dependencies
- Task 22: Create Stock Filters Bar

### Instructions

1. **Create dropdown:** Use Select component from UI library
2. **Add "All Warehouses" option:** Default selection
3. **Populate warehouses:** Fetch warehouse list from API or context
4. **Handle selection:** Emit selected warehouse to parent
5. **Show warehouse count:** Display count in dropdown label

### Warehouse Options

| Value | Label |
|-------|-------|
| all | All Warehouses |
| wh-001 | Main Warehouse (500 SKU) |
| wh-002 | Branch 1 (200 SKU) |
| wh-003 | Storage Facility (150 SKU) |

### Dropdown Structure
```
┌─────────────────────────┐
│ Warehouse: All ▼        │
└─────────────────────────┘
     │
     ▼
┌─────────────────────────┐
│ ✓ All Warehouses        │
│   Main Warehouse (500)  │
│   Branch 1 (200)        │
│   Storage Facility (150)│
└─────────────────────────┘
```

### Expected Outcome
- Dropdown with warehouse options
- Default "All" selection
- Displays SKU count per warehouse

### Verification
- [ ] Dropdown populates with warehouses
- [ ] Selection updates filter
- [ ] SKU counts display correctly

---

## Task 25: Create Stock Level Filter

### Overview
Create dropdown filter for filtering by stock status (all, low stock, out of stock, overstocked).

### Dependencies
- Task 22: Create Stock Filters Bar

### Instructions

1. **Create dropdown:** Use Select component
2. **Define filter options:** All, Low Stock, Out of Stock, Overstocked
3. **Add option descriptions:** Explain each filter option
4. **Add icons:** Visual indicators for each status
5. **Handle selection:** Emit selected status to parent

### Stock Level Options

| Value | Label | Icon | Description |
|-------|-------|------|-------------|
| all | All Products | Package | Show all items |
| low | Low Stock | AlertTriangle | Below reorder point |
| out | Out of Stock | XCircle | Zero quantity |
| overstock | Overstocked | TrendingUp | Above max level |

### Dropdown Structure
```
┌─────────────────────────┐
│ Stock Level: All ▼      │
└─────────────────────────┘
     │
     ▼
┌─────────────────────────┐
│ ✓ 📦 All Products       │
│   ⚠️ Low Stock          │
│   ❌ Out of Stock       │
│   📈 Overstocked        │
└─────────────────────────┘
```

### Filter Logic

| Filter | Condition |
|--------|-----------|
| All | No filter applied |
| Low Stock | quantity < reorderPoint |
| Out of Stock | quantity = 0 |
| Overstocked | quantity > maxLevel |

### Expected Outcome
- Dropdown with four stock level options
- Icons for visual clarity
- Proper filtering logic applied

### Verification
- [ ] All four options display
- [ ] Icons show correctly
- [ ] Filter logic works properly

---

## Summary

This document created the stock overview page structure with summary cards and filters:

### Components Created
- StockOverview page container (Task 15)
- StockOverviewHeader with action button (Task 16)
- StockSummaryCards grid container (Task 17)
- Four summary cards: Total Products, Low Stock, Out of Stock, Valuation (Tasks 18-21)
- StockFilters bar (Task 22)
- Three filters: Product Search, Warehouse Filter, Stock Level Filter (Tasks 23-25)

### Key Features
- Responsive grid layout for cards
- Real-time metric updates
- Debounced search input
- Multi-criteria filtering
- Mobile-responsive design

### Next Steps
Continue to Document 02 for stock table implementation and API integration (Tasks 26-32).
