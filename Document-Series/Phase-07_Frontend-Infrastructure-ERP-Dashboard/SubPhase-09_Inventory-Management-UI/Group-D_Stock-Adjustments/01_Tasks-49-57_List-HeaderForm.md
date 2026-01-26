# Tasks 49-57: Adjustment List & Header Form

> **Phase:** 07 - Frontend Infrastructure & ERP Dashboard  
> **SubPhase:** 09 - Inventory Management UI  
> **Group:** D - Stock Adjustments  
> **Document:** 01 of 02  
> **Tasks Covered:** 49, 50, 51, 52, 53, 54, 55, 56, 57

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **→ Next Document:** [02_Tasks-58-64_Items-Submit.md](02_Tasks-58-64_Items-Submit.md)

---

## Document Overview

This document covers the creation of the stock adjustments list page with table view and the initialization of the adjustment creation form. It includes the adjustment table with status badges, filtering capabilities, and the header form section where users select warehouse and reason codes.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 49 | Create Adjustments List Page | Low | 20 min |
| 50 | Create Adjustments Header | Low | 15 min |
| 51 | Create Adjustments Table | Medium | 30 min |
| 52 | Define Adjustment Table Columns | Medium | 25 min |
| 53 | Create Adjustment Status Badge | Low | 15 min |
| 54 | Create New Adjustment Page | Medium | 25 min |
| 55 | Create Adjustment Form Schema | Medium | 30 min |
| 56 | Create Adjustment Header Form | Medium | 30 min |
| 57 | Create Reason Code Select | Low | 20 min |

---

## Task 49: Create Adjustments List Page

### Overview
Create the main adjustments list page displaying all stock adjustments with filtering and status tracking capabilities.

### Dependencies
- Group A Task 14: Verify Route Structure
- Adjustments route at /inventory/adjustments exists

### Instructions

1. **Create component directory:** In `frontend/components/modules/inventory/`, create `Adjustments/` folder
2. **Create main component:** Create `AdjustmentsList.tsx`
3. **Set up page structure:** Header section, filters, and table area
4. **Add state management:** Manage filter state and selected adjustments
5. **Export component:** Create index.ts barrel export

### Page Structure
```
┌────────────────────────────────────────┐
│  Stock Adjustments    [New Adjustment] │
├────────────────────────────────────────┤
│  Filters: Status, Date Range, WH       │
├────────────────────────────────────────┤
│  Adjustments Table                     │
│  ┌──────────────────────────────────┐  │
│  │ Date │ Ref │ WH │ Status │ ...  │  │
│  └──────────────────────────────────┘  │
└────────────────────────────────────────┘
```

### Expected Outcome
- Main container for adjustments list
- Filter state management
- Table integration ready

### Verification
- [ ] Component created in correct directory
- [ ] Page structure defined
- [ ] State management configured

---

## Task 50: Create Adjustments Header

### Overview
Create header component with page title, adjustment count, and action button for creating new adjustments.

### Dependencies
- Task 49: Create Adjustments List Page

### Instructions

1. **Create component file:** Create `AdjustmentsHeader.tsx` in Adjustments directory
2. **Add title section:** Display "Stock Adjustments" heading with count badge
3. **Add new button:** "New Adjustment" button linking to /inventory/adjustments/new
4. **Add filter summary:** Show active filter count if filters applied
5. **Style header:** Flex layout with space-between alignment
6. **Add icons:** Plus icon for new button, Filter icon for summary

### Header Layout
```
┌────────────────────────────────────────┐
│  Stock Adjustments (47)  [+ New Adj.]  │
│  Showing 12 filtered results           │
└────────────────────────────────────────┘
```

### Header Elements

| Element | Description | Behavior |
|---------|-------------|----------|
| Title | "Stock Adjustments" | Static text |
| Count Badge | Total count | Updates on data change |
| Filter Summary | Active filters | Shows when filters applied |
| New Button | Create adjustment | Links to /adjustments/new |

### Expected Outcome
- Functional header with count
- Navigation to new adjustment form
- Filter status display

### Verification
- [ ] Header displays with count
- [ ] New button navigates correctly
- [ ] Filter summary updates

---

## Task 51: Create Adjustments Table

### Overview
Create the main data table component for displaying adjustment records with sorting, filtering, and pagination.

### Dependencies
- Task 49: Create Adjustments List Page
- SubPhase-05 (Data Table Components) complete

### Instructions

1. **Create component file:** Create `AdjustmentsTable.tsx`
2. **Import TanStack Table:** Import useReactTable and dependencies
3. **Define table props:** Accept data, columns, loading state, onRowClick
4. **Set up table instance:** Configure with sorting and pagination
5. **Create table structure:** Header, body, and pagination footer
6. **Add loading skeleton:** Show skeleton rows while loading
7. **Add empty state:** Display message when no adjustments exist
8. **Implement row click:** Navigate to adjustment detail on row click

### Table Structure
```
┌────────────────────────────────────────────────────────────┐
│ Date     │ Reference │ Warehouse │ Items │ Status  │ User │
├────────────────────────────────────────────────────────────┤
│ Jan 26   │ ADJ-001   │ Main      │ 3     │ ✓ Appr  │ John │
│ 10:30 AM │           │           │       │         │      │
├────────────────────────────────────────────────────────────┤
│ Jan 25   │ ADJ-002   │ Branch 1  │ 5     │ ⏳ Pend │ Jane │
│ 02:15 PM │           │           │       │         │      │
├────────────────────────────────────────────────────────────┤
│                   Showing 1-10 of 47                       │
└────────────────────────────────────────────────────────────┘
```

### Table Configuration

| Feature | Setting |
|---------|---------|
| Rows per page | 10, 25, 50 |
| Default sort | Date descending (newest first) |
| Sortable columns | Date, Reference, Warehouse, Status |
| Row click | Navigate to detail view |
| Loading | Skeleton 5 rows |
| Empty | "No adjustments found" |

### Expected Outcome
- Functional table with TanStack Table
- Sortable columns
- Clickable rows for details

### Verification
- [ ] Table renders with data
- [ ] Sorting works correctly
- [ ] Row click navigates

---

## Task 52: Define Adjustment Table Columns

### Overview
Define the column configuration for the adjustments table including headers, accessors, cell renderers, and sorting.

### Dependencies
- Task 51: Create Adjustments Table

### Instructions

1. **Create columns file:** Create `AdjustmentTableColumns.tsx`
2. **Import column types:** Import ColumnDef from TanStack Table
3. **Define type interface:** Create Adjustment type for row data
4. **Create columns array:** Define all table columns
5. **Configure date column:** Format date and time with sorting
6. **Configure reference column:** Display reference with search highlight
7. **Configure warehouse column:** Show warehouse name
8. **Configure items column:** Display item count
9. **Configure status column:** Use status badge component
10. **Configure user column:** Display creator name and avatar
11. **Configure actions column:** Add view/edit/delete actions
12. **Export columns:** Export column definitions

### Column Definitions

| Column | Width | Accessor | Sortable | Cell Type |
|--------|-------|----------|----------|-----------|
| Date | 150px | created_at | Yes | Date + Time |
| Reference | 150px | reference | Yes | Text + Link |
| Warehouse | 150px | warehouse.name | Yes | Text |
| Items | 80px | items.length | No | Number |
| Status | 100px | status | Yes | Badge |
| Created By | 120px | created_by.name | No | Avatar + Name |
| Actions | 60px | - | No | Button Group |

### Date Column Configuration
```
Format: MMM DD, YYYY
Time: HH:MM AM/PM
Sort: ISO timestamp
Example: Jan 26, 2026 - 10:30 AM
```

### Reference Column Configuration
```
Display: ADJ-XXXX format
Link: Navigate to detail
Searchable: Yes
Copy on click: Yes
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

---

## Task 53: Create Adjustment Status Badge

### Overview
Create a visual status badge component that displays adjustment status with appropriate colors and icons.

### Dependencies
- Task 52: Define Adjustment Table Columns

### Instructions

1. **Create component file:** Create `AdjustmentStatusBadge.tsx`
2. **Define status type:** Create union type for valid statuses
3. **Define props interface:** Accept status and optional size
4. **Create status config:** Map each status to color, icon, label
5. **Implement component:** Render badge with icon and text
6. **Add variants:** Support small, medium, large sizes
7. **Style badge:** Use Tailwind with status-specific colors
8. **Export component:** Export with type definitions

### Status Definitions

| Status | Color | Icon | Label | Description |
|--------|-------|------|-------|-------------|
| Draft | Gray | FileText | Draft | Not yet submitted |
| Pending | Yellow | Clock | Pending | Awaiting approval |
| Approved | Green | CheckCircle | Approved | Applied to stock |
| Rejected | Red | XCircle | Rejected | Declined/Cancelled |

### Badge Visual Design
```
Draft:    [📄 Draft]     - Gray background, gray text
Pending:  [⏰ Pending]   - Yellow background, yellow text
Approved: [✓ Approved]   - Green background, green text
Rejected: [✗ Rejected]   - Red background, red text
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
| Draft | bg-gray-100 | text-gray-700 | border-gray-300 |
| Pending | bg-yellow-100 | text-yellow-700 | border-yellow-300 |
| Approved | bg-green-100 | text-green-700 | border-green-300 |
| Rejected | bg-red-100 | text-red-700 | border-red-300 |

### Expected Outcome
- Reusable status badge component
- Visual distinction between statuses
- Size variants available

### Verification
- [ ] Badge renders for all statuses
- [ ] Colors match design
- [ ] Icons display correctly

---

## Task 54: Create New Adjustment Page

### Overview
Create the page for creating new stock adjustments with a multi-step form approach. This page serves as the container for the adjustment form wizard.

### Dependencies
- Group A Task 14: Verify Route Structure
- New adjustment route at /inventory/adjustments/new

### Instructions

1. **Create page directory:** In adjustments folder, create `new/` folder
2. **Create page file:** In new directory, create `page.tsx`
3. **Define metadata:** Title "New Stock Adjustment - LCC"
4. **Set up page layout:** Header with breadcrumbs and form container
5. **Add form wrapper:** Container with proper spacing and max-width
6. **Add step indicator:** Show progress through form steps
7. **Import form component:** Use AdjustmentForm component
8. **Handle navigation:** Cancel returns to list, submit processes data

### Page Structure
```
┌────────────────────────────────────────┐
│  Home > Inventory > Adjustments > New  │
├────────────────────────────────────────┤
│  New Stock Adjustment                  │
│  ○──○──○  Step 1 of 3                  │
├────────────────────────────────────────┤
│  [Form Content Area]                   │
│                                        │
│  [Cancel]              [Next Step →]   │
└────────────────────────────────────────┘
```

### Form Steps

| Step | Title | Content | Next Button |
|------|-------|---------|-------------|
| 1 | Header | Reference, Warehouse, Reason | Next |
| 2 | Items | Product selection, quantities | Next |
| 3 | Review | Summary, notes | Submit |

### Navigation Elements

| Element | Type | Action |
|---------|------|--------|
| Breadcrumbs | Links | Navigate to parent pages |
| Cancel Button | Secondary | Return to list (confirm if changes) |
| Next Button | Primary | Advance to next step |
| Submit Button | Primary | Save adjustment (final step) |

### Expected Outcome
- New adjustment form page
- Multi-step wizard interface
- Proper navigation and breadcrumbs

### Verification
- [ ] Page renders at correct route
- [ ] Breadcrumbs work
- [ ] Step navigation functions

---

## Task 55: Create Adjustment Form Schema

### Overview
Create Zod validation schema for the adjustment form ensuring data integrity and preventing invalid submissions.

### Dependencies
- Task 54: Create New Adjustment Page
- Zod library installed

### Instructions

1. **Create schema file:** In `frontend/lib/validations/`, create `adjustment.ts`
2. **Import Zod:** Import z from 'zod'
3. **Define item schema:** Schema for individual adjustment items
4. **Define main schema:** Complete adjustment form schema
5. **Add custom validations:** Quantity limits, item uniqueness
6. **Define TypeScript types:** Infer types from schemas
7. **Export schemas:** Export for use in forms
8. **Add error messages:** Custom validation error messages

### Schema Structure

**Adjustment Item Schema:**
| Field | Type | Validation | Error Message |
|-------|------|------------|---------------|
| product_id | string | UUID, required | "Product is required" |
| product_name | string | Min 1 char | "Product name required" |
| current_quantity | number | >= 0 | "Invalid quantity" |
| new_quantity | number | >= 0 | "Must be 0 or greater" |
| difference | number | Calculated | Auto-calculated |
| notes | string | Optional, max 200 | "Notes too long" |

**Main Adjustment Schema:**
| Field | Type | Validation | Error Message |
|-------|------|------------|---------------|
| reference | string | Auto-generated | Auto-generated |
| warehouse_id | string | UUID, required | "Warehouse required" |
| reason_code | string | Required, enum | "Reason required" |
| notes | string | Optional, max 500 | "Notes too long" |
| items | array | Min 1, unique products | "Add at least 1 item" |

### Reason Code Enum
```
- DAMAGE: Damaged goods
- LOSS: Lost or stolen
- FOUND: Found inventory
- RECOUNT: Physical count correction
- EXPIRY: Expired products
- QUALITY: Quality issues
- OTHER: Other reason
```

### Validation Rules

| Rule | Check | Error |
|------|-------|-------|
| Unique Products | No duplicate product_id | "Product already added" |
| Min Items | At least 1 item | "Add at least one item" |
| Quantity Valid | new_quantity >= 0 | "Quantity cannot be negative" |
| Warehouse Required | Valid UUID | "Select a warehouse" |
| Reason Required | One of enum values | "Select a reason" |

### Custom Validations
```
1. Validate item uniqueness
2. Calculate difference automatically
3. Prevent negative stock (configurable)
4. Validate warehouse exists
5. Ensure at least one item
```

### Expected Outcome
- Complete Zod schema for validation
- TypeScript types inferred
- Custom error messages

### Verification
- [ ] Schema validates correctly
- [ ] Types inferred properly
- [ ] Error messages display

---

## Task 56: Create Adjustment Header Form

### Overview
Create the header section of the adjustment form where users enter reference number, select warehouse, and choose reason code.

### Dependencies
- Task 55: Create Adjustment Form Schema

### Instructions

1. **Create component file:** Create `AdjustmentHeaderForm.tsx`
2. **Import form dependencies:** React Hook Form, Zod resolver
3. **Define component props:** Accept form control, register, errors
4. **Create reference field:** Auto-generated, read-only, display only
5. **Create warehouse select:** Dropdown with all active warehouses
6. **Create reason code select:** Use ReasonCodeSelect component
7. **Add validation display:** Show field errors inline
8. **Style form:** Use grid layout for responsive design
9. **Export component:** Export with prop types

### Form Layout
```
┌────────────────────────────────────────┐
│  Adjustment Details                    │
├────────────────────────────────────────┤
│  Reference Number                      │
│  [ADJ-2026-001]  (Auto-generated)      │
│                                        │
│  Warehouse *                           │
│  [Select warehouse ▼]                  │
│                                        │
│  Reason Code *                         │
│  [Select reason ▼]                     │
│                                        │
│  General Notes (Optional)              │
│  [Optional notes for this adjustment]  │
└────────────────────────────────────────┘
```

### Field Specifications

**Reference Number:**
| Property | Value |
|----------|-------|
| Format | ADJ-YYYY-NNN |
| Generation | Auto on form init |
| Editable | No |
| Display | Read-only input |

**Warehouse Select:**
| Property | Value |
|----------|-------|
| Type | Searchable dropdown |
| Options | Active warehouses only |
| Display | Name + Code |
| Required | Yes |
| Default | User's default warehouse |

**Reason Code Select:**
| Property | Value |
|----------|-------|
| Type | Dropdown |
| Options | Predefined reasons |
| Required | Yes |
| Default | None |

**Notes Field:**
| Property | Value |
|----------|-------|
| Type | Textarea |
| Max Length | 500 characters |
| Required | No |
| Rows | 3 |

### Reference Number Format
```
Pattern: ADJ-YYYY-NNN
Example: ADJ-2026-001

YYYY: Current year
NNN: Sequential number (001-999)
Auto-increments based on existing adjustments
```

### Expected Outcome
- Header form section
- Warehouse selection working
- Reference auto-generation
- Validation feedback

### Verification
- [ ] Reference generates correctly
- [ ] Warehouse dropdown populates
- [ ] Validation works
- [ ] Form submits data

---

## Task 57: Create Reason Code Select

### Overview
Create a specialized select component for adjustment reason codes with descriptions and icons.

### Dependencies
- Task 56: Create Adjustment Header Form

### Instructions

1. **Create component file:** Create `ReasonCodeSelect.tsx`
2. **Define reason interface:** Type definition for reasons
3. **Create reasons array:** Define all available reason codes
4. **Define component props:** Accept value, onChange, error
5. **Create select structure:** Dropdown with icon and description
6. **Add visual indicators:** Icon for each reason type
7. **Implement selection:** Handle value changes
8. **Show descriptions:** Display reason description on hover/focus
9. **Style component:** Use consistent form styling
10. **Export component:** Export with types

### Reason Code Definitions

| Code | Label | Icon | Description | Color |
|------|-------|------|-------------|-------|
| DAMAGE | Damaged Goods | AlertTriangle | Products damaged during storage/handling | Red |
| LOSS | Loss/Theft | ShieldAlert | Missing inventory due to loss or theft | Red |
| FOUND | Found Inventory | Search | Previously missing items found | Green |
| RECOUNT | Physical Recount | Calculator | Adjustment from physical count | Blue |
| EXPIRY | Expired Products | Clock | Products past expiration date | Orange |
| QUALITY | Quality Issues | AlertCircle | Failed quality control | Yellow |
| OTHER | Other Reason | FileText | Other reason not listed | Gray |

### Select Structure
```
┌────────────────────────────────────────┐
│  Reason Code *                         │
│  [Select reason ▼]                     │
│                                        │
│  Dropdown:                             │
│  ┌──────────────────────────────────┐  │
│  │ ⚠️  Damaged Goods                │  │
│  │     Products damaged during...    │  │
│  │ 🛡️  Loss/Theft                   │  │
│  │     Missing inventory due to...   │  │
│  │ 🔍 Found Inventory               │  │
│  │     Previously missing items...   │  │
│  └──────────────────────────────────┘  │
└────────────────────────────────────────┘
```

### Dropdown Item Layout
```
Each item shows:
[Icon] Reason Label
       Description text (gray, smaller)
```

### Component Features

| Feature | Implementation |
|---------|----------------|
| Search | Filter reasons by typing |
| Icons | Visual distinction |
| Descriptions | Help text for each option |
| Keyboard | Arrow navigation support |
| Validation | Required field indicator |

### Expected Outcome
- Functional reason select
- Clear visual indicators
- Helpful descriptions
- Easy selection

### Verification
- [ ] All reasons display
- [ ] Icons show correctly
- [ ] Selection works
- [ ] Validation triggers

---

## Summary

This document established the foundation for stock adjustments functionality, including:

✓ Adjustments list page with filtering  
✓ Adjustments table with sortable columns  
✓ Status badge with visual indicators  
✓ New adjustment page structure  
✓ Zod validation schema  
✓ Header form with warehouse and reason selection  
✓ Specialized reason code dropdown  

**Next Document:** [02_Tasks-58-64_Items-Submit.md](02_Tasks-58-64_Items-Submit.md) covers the items section where users add products and quantities, along with the submission workflow.

---

**Completion Checklist:**
- [ ] All components created in correct directories
- [ ] Forms use React Hook Form + Zod
- [ ] Table uses TanStack Table
- [ ] Status badges styled correctly
- [ ] Validation working properly
- [ ] Navigation between pages functional
- [ ] Error handling implemented
- [ ] Loading states added
