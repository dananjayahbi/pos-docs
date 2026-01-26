# Tasks 01-07: Inventory Routes & Pages Structure

> **Phase:** 07 - Frontend Infrastructure & ERP Dashboard  
> **SubPhase:** 09 - Inventory Management UI  
> **Group:** A - Inventory Routes & Pages Structure  
> **Document:** 01 of 02  
> **Tasks Covered:** 01, 02, 03, 04, 05, 06, 07

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **→ Next Document:** [02_Tasks-08-14_Warehouse-Routes-States.md](02_Tasks-08-14_Warehouse-Routes-States.md)

---

## Document Overview

This document covers the creation of the inventory management route structure within the dashboard. It establishes the foundational routing architecture for inventory features, including the shared inventory layout with tab navigation, stock overview, movements tracking, adjustments management, and transfer workflows.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 01 | Create Inventory Route Directory | Low | 10 min |
| 02 | Create Inventory Layout | Medium | 30 min |
| 03 | Create Stock Overview Page Route | Low | 20 min |
| 04 | Create Movements Page Route | Low | 15 min |
| 05 | Create Adjustments Page Route | Low | 15 min |
| 06 | Create New Adjustment Page Route | Low | 20 min |
| 07 | Create Transfers Page Route | Low | 15 min |

---

## Task 01: Create Inventory Route Directory

### Overview
Create the inventory route directory within the dashboard layout. This directory will house all inventory-related pages.

### Dependencies
- SubPhase-08 (Dashboard Layout) complete
- Dashboard route group `(dashboard)` exists

### Instructions

1. **Navigate to dashboard directory:** Go to `frontend/app/(dashboard)/`
2. **Create inventory directory:** Create new folder named `inventory`
3. **Verify structure:** Confirm `frontend/app/(dashboard)/inventory/` exists

### Directory Structure
```
frontend/app/
└── (dashboard)/
    └── inventory/          # New inventory module
        └── (files TBD)
```

### Expected Outcome
- Inventory route directory created at correct location
- Ready to receive layout and page files

### Verification
- [ ] `frontend/app/(dashboard)/inventory/` directory exists
- [ ] Located inside dashboard route group

---

## Task 02: Create Inventory Layout

### Overview
Create shared layout for inventory pages with tab navigation. Provides consistent structure and navigation tabs for all inventory features.

### Dependencies
- Task 01: Create Inventory Route Directory

### Instructions

1. **Create layout file:** In `frontend/app/(dashboard)/inventory/`, create `layout.tsx`
2. **Import dependencies:** Import React types, Link component, tab components
3. **Define layout component:** Accept children prop and wrap in container
4. **Add tab navigation:** Create tabs for Stock, Movements, Adjustments, Transfers, Warehouses
5. **Implement active state:** Highlight current tab based on URL path
6. **Style container:** Add padding, max-width, and responsive design

### Tab Configuration

| Tab | Path | Label | Icon |
|-----|------|-------|------|
| Stock | /inventory | Stock Levels | Package |
| Movements | /inventory/movements | Movements | TrendingUp |
| Adjustments | /inventory/adjustments | Adjustments | Edit |
| Transfers | /inventory/transfers | Transfers | ArrowRightLeft |
| Warehouses | /inventory/warehouses | Warehouses | Building2 |

### Layout Structure
```
┌──────────────────────────────────────────┐
│  Inventory Management                     │
├──────────────────────────────────────────┤
│ [Stock] [Movements] [Adjustments] [...] │
├──────────────────────────────────────────┤
│                                          │
│          {children}                      │
│        (Page Content)                    │
│                                          │
└──────────────────────────────────────────┘
```

### Expected Outcome
- Functional layout with tab navigation
- Active tab highlighting based on current route
- Responsive design for mobile and desktop

### Verification
- [ ] Layout file created with proper structure
- [ ] Five tabs configured correctly
- [ ] Active state works for current path

---

## Task 03: Create Stock Overview Page Route

### Overview
Create the main stock overview page showing inventory levels across all products. This is the default page when accessing /inventory.

### Dependencies
- Task 02: Create Inventory Layout

### Instructions

1. **Create page file:** In `frontend/app/(dashboard)/inventory/`, create `page.tsx`
2. **Define metadata:** Export metadata with title "Inventory - LCC"
3. **Import components:** Import page header, filter components, stock table
4. **Create page component:** Structure with header, filters, and content area
5. **Add page header:** Include title "Stock Levels" and "New Adjustment" button
6. **Add filter section:** Include search, warehouse filter, category filter, stock status filter
7. **Add stock table:** Configure columns for product, SKU, warehouse, current stock, min stock, max stock, status

### Page Structure
```
┌──────────────────────────────────────────┐
│  Stock Levels           [New Adjustment] │
├──────────────────────────────────────────┤
│  [Search] [Warehouse▼] [Category▼] [...] │
├──────────────────────────────────────────┤
│  Product Table                           │
│  ┌────────────────────────────────────┐  │
│  │ Product | SKU | Warehouse | Stock │  │
│  │ Item A  | ... | Main      | 100   │  │
│  │ Item B  | ... | Backup    | 50    │  │
│  └────────────────────────────────────┘  │
└──────────────────────────────────────────┘
```

### Stock Status Indicators

| Status | Condition | Badge Color |
|--------|-----------|-------------|
| In Stock | >= Min Stock | Green |
| Low Stock | < Min Stock | Yellow |
| Out of Stock | = 0 | Red |
| Overstock | > Max Stock | Blue |

### Expected Outcome
- Functional stock overview page at /inventory
- Filterable product list with stock levels
- Status badges indicating stock conditions

### Verification
- [ ] Page renders at /inventory route
- [ ] Filters work correctly
- [ ] Stock status badges display properly

---

## Task 04: Create Movements Page Route

### Overview
Create page for viewing stock movement history. Shows all stock in/out transactions with filtering capabilities.

### Dependencies
- Task 02: Create Inventory Layout

### Instructions

1. **Create movements directory:** In `frontend/app/(dashboard)/inventory/`, create `movements/` folder
2. **Create page file:** In movements directory, create `page.tsx`
3. **Define metadata:** Export metadata with title "Stock Movements - LCC"
4. **Add page header:** Title "Stock Movements"
5. **Add filters:** Date range, movement type, warehouse, product search
6. **Add movements table:** Columns for date, product, type, quantity, from/to location, reference, user

### Movement Types

| Type | Icon | Color | Description |
|------|------|-------|-------------|
| Purchase | ArrowDown | Green | Stock received from supplier |
| Sale | ArrowUp | Red | Stock sold to customer |
| Adjustment | Edit | Yellow | Manual stock adjustment |
| Transfer | ArrowRightLeft | Blue | Warehouse transfer |
| Return | RotateCcw | Purple | Customer/supplier return |

### Page Structure
```
┌──────────────────────────────────────────┐
│  Stock Movements                         │
├──────────────────────────────────────────┤
│  [Date Range] [Type▼] [Warehouse▼] [...] │
├──────────────────────────────────────────┤
│  Movement History Table                  │
│  ┌────────────────────────────────────┐  │
│  │ Date | Product | Type | Qty | ... │  │
│  │ Jan 25| Item A | Sale | -5  | ... │  │
│  └────────────────────────────────────┘  │
└──────────────────────────────────────────┘
```

### Expected Outcome
- Movements page at /inventory/movements
- Filterable transaction history
- Type-based icons and colors

### Verification
- [ ] Page renders at correct route
- [ ] Movement types display with proper styling
- [ ] Filters function correctly

---

## Task 05: Create Adjustments Page Route

### Overview
Create page listing all stock adjustment records. Shows history of manual stock corrections with filtering.

### Dependencies
- Task 02: Create Inventory Layout

### Instructions

1. **Create adjustments directory:** In `frontend/app/(dashboard)/inventory/`, create `adjustments/` folder
2. **Create page file:** In adjustments directory, create `page.tsx`
3. **Define metadata:** Title "Stock Adjustments - LCC"
4. **Add page header:** Title "Stock Adjustments" with "New Adjustment" button
5. **Add filters:** Date range, warehouse, status (pending/completed)
6. **Add adjustments table:** Columns for date, warehouse, products count, reason, status, created by, actions

### Adjustment Status Flow
```
Draft → Pending Review → Completed
  │         │              │
  └─────────┴──────────────┴──→ Cancelled
```

### Page Structure
```
┌──────────────────────────────────────────┐
│  Stock Adjustments      [New Adjustment] │
├──────────────────────────────────────────┤
│  [Date Range] [Warehouse▼] [Status▼]     │
├──────────────────────────────────────────┤
│  Adjustments Table                       │
│  ┌────────────────────────────────────┐  │
│  │ Date | Warehouse | Reason | Status │  │
│  │ Jan 25| Main | Damage | Complete  │  │
│  └────────────────────────────────────┘  │
└──────────────────────────────────────────┘
```

### Expected Outcome
- Adjustments list page at /inventory/adjustments
- Status-based filtering
- Link to create new adjustment

### Verification
- [ ] Page renders at correct route
- [ ] New Adjustment button links properly
- [ ] Status badges display correctly

---

## Task 06: Create New Adjustment Page Route

### Overview
Create page for creating new stock adjustments. Multi-product adjustment form with reason selection.

### Dependencies
- Task 05: Create Adjustments Page Route

### Instructions

1. **Create new directory:** In adjustments folder, create `new/` folder
2. **Create page file:** In new directory, create `page.tsx`
3. **Define metadata:** Title "New Stock Adjustment - LCC"
4. **Add form header:** Title "New Stock Adjustment" with Cancel/Save buttons
5. **Add warehouse selector:** Dropdown to select warehouse
6. **Add reason selector:** Dropdown with predefined reasons
7. **Add products section:** Multi-row form to add products with current/new quantities
8. **Add notes field:** Textarea for additional notes
9. **Implement validation:** Validate quantities and required fields

### Adjustment Reasons

| Reason | Description |
|--------|-------------|
| Damage | Products damaged or broken |
| Theft | Missing inventory due to theft |
| Expired | Products past expiration date |
| Count Error | Correction of counting mistake |
| Return | Returned from customer |
| Found | Previously missing items found |
| Other | Custom reason with notes |

### Form Structure
```
┌──────────────────────────────────────────┐
│  New Stock Adjustment    [Cancel] [Save] │
├──────────────────────────────────────────┤
│  Warehouse: [Main Warehouse ▼]          │
│  Reason: [Select reason ▼]               │
├──────────────────────────────────────────┤
│  Products to Adjust:                     │
│  ┌────────────────────────────────────┐  │
│  │ Product | Current | New | Diff    │  │
│  │ [Select] | 100    | 95  | -5      │  │
│  │ [Add Product]                      │  │
│  └────────────────────────────────────┘  │
│  Notes: [Optional notes...]             │
└──────────────────────────────────────────┘
```

### Expected Outcome
- New adjustment form at /inventory/adjustments/new
- Product selection with quantity adjustment
- Validation and submission handling

### Verification
- [ ] Form renders at correct route
- [ ] Product rows can be added/removed
- [ ] Validation prevents invalid submissions

---

## Task 07: Create Transfers Page Route

### Overview
Create page listing warehouse transfer records. Shows history of stock movements between warehouses.

### Dependencies
- Task 02: Create Inventory Layout

### Instructions

1. **Create transfers directory:** In `frontend/app/(dashboard)/inventory/`, create `transfers/` folder
2. **Create page file:** In transfers directory, create `page.tsx`
3. **Define metadata:** Title "Warehouse Transfers - LCC"
4. **Add page header:** Title "Warehouse Transfers" with "New Transfer" button
5. **Add filters:** Date range, source warehouse, destination warehouse, status
6. **Add transfers table:** Columns for date, transfer ID, from warehouse, to warehouse, products count, status, actions

### Transfer Status Flow
```
Draft → Pending → In Transit → Received → Completed
  │       │          │            │         
  └───────┴──────────┴────────────┴──────→ Cancelled
```

### Status Descriptions

| Status | Description | Actions Available |
|--------|-------------|-------------------|
| Draft | Being prepared | Edit, Delete |
| Pending | Awaiting approval | Approve, Cancel |
| In Transit | Shipped to destination | Update, Cancel |
| Received | Arrived at destination | Complete |
| Completed | Fully processed | View only |
| Cancelled | Transfer cancelled | View only |

### Page Structure
```
┌──────────────────────────────────────────┐
│  Warehouse Transfers    [New Transfer]   │
├──────────────────────────────────────────┤
│  [Date Range] [From▼] [To▼] [Status▼]    │
├──────────────────────────────────────────┤
│  Transfers Table                         │
│  ┌────────────────────────────────────┐  │
│  │ Date | From | To | Products | Stat │  │
│  │ Jan 25| Main| B1 | 5 items | Transit│  │
│  └────────────────────────────────────┘  │
└──────────────────────────────────────────┘
```

### Expected Outcome
- Transfers list page at /inventory/transfers
- Status-based filtering and badges
- Link to create new transfer

### Verification
- [ ] Page renders at correct route
- [ ] Status badges show correct colors
- [ ] New Transfer button works

---

## Summary

This document established the core route structure for the inventory management module:

### Created Routes
- `/inventory` - Stock levels overview (Task 03)
- `/inventory/movements` - Movement history (Task 04)
- `/inventory/adjustments` - Adjustments list (Task 05)
- `/inventory/adjustments/new` - Create adjustment (Task 06)
- `/inventory/transfers` - Transfers list (Task 07)

### Key Features
- Shared layout with tab navigation (Task 02)
- Consistent page structure across all routes
- Status-based filtering and badges
- Create/edit action buttons

### Next Steps
Continue to Document 02 for warehouse management routes (Tasks 08-14) and loading states.
