# Tasks 79-88: Warehouse CRUD Operations

> **Phase:** 07 - Frontend Infrastructure & ERP Dashboard  
> **SubPhase:** 09 - Inventory Management UI  
> **Group:** F - Warehouse Management & Testing  
> **Document:** 01 of 02  
> **Tasks Covered:** 79, 80, 81, 82, 83, 84, 85, 86, 87, 88

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **→ Next Document:** [02_Tasks-89-92_Edit-Delete-Testing.md](02_Tasks-89-92_Edit-Delete-Testing.md)

---

## Document Overview

This document covers the creation of warehouse management pages including the warehouse list with card view, warehouse creation form with comprehensive fields including name, code, address, and settings.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 79 | Create Warehouses List Page | Low | 20 min |
| 80 | Create Warehouses Header | Low | 15 min |
| 81 | Create Warehouse Cards | Medium | 30 min |
| 82 | Create Warehouse Card Component | Medium | 30 min |
| 83 | Create Warehouse Stats | Low | 20 min |
| 84 | Create New Warehouse Page | Medium | 25 min |
| 85 | Create Warehouse Form Schema | Medium | 30 min |
| 86 | Create Warehouse Name Input | Low | 15 min |
| 87 | Create Warehouse Address Form | Medium | 30 min |
| 88 | Create Warehouse Settings | Low | 20 min |

---

## Task 79: Create Warehouses List Page

### Overview
Create the main warehouses list page displaying all warehouses in a card grid layout with filtering and action capabilities.

### Dependencies
- Group A Task 14: Verify Route Structure
- Warehouses route at /inventory/warehouses exists

### Instructions

1. **Create component directory:** In `frontend/components/modules/inventory/`, create `Warehouses/` folder
2. **Create main component:** Create `WarehousesList.tsx`
3. **Set up page structure:** Header section, filters, and card grid area
4. **Add state management:** Manage filter state, view mode
5. **Add search capability:** Search warehouses by name/code
6. **Export component:** Create index.ts barrel export

### Page Structure
```
┌────────────────────────────────────────┐
│  Warehouses              [New Warehouse]│
├────────────────────────────────────────┤
│  [🔍 Search]  [Filter ▼]  [View: Cards]│
├────────────────────────────────────────┤
│  ┌──────────┐  ┌──────────┐           │
│  │ Card 1   │  │ Card 2   │           │
│  └──────────┘  └──────────┘           │
│  ┌──────────┐  ┌──────────┐           │
│  │ Card 3   │  │ Card 4   │           │
│  └──────────┘  └──────────┘           │
└────────────────────────────────────────┘
```

### Page Features

| Feature | Description |
|---------|-------------|
| Card View | Grid of warehouse cards |
| Search | Filter by name/code |
| Filter | Status (active/inactive) |
| Sort | Name, code, items count |
| Actions | View, edit, delete per card |

### Grid Layout

| Breakpoint | Columns | Gap |
|------------|---------|-----|
| Mobile | 1 | 16px |
| Tablet | 2 | 20px |
| Desktop | 3 | 24px |
| Large | 4 | 24px |

### Expected Outcome
- Main container for warehouses list
- Card grid layout
- Search and filter capability

### Verification
- [ ] Component created in correct directory
- [ ] Page structure defined
- [ ] Grid responsive

---

## Task 80: Create Warehouses Header

### Overview
Create header component with page title, warehouse count, search bar, and action button for creating new warehouses.

### Dependencies
- Task 79: Create Warehouses List Page

### Instructions

1. **Create component file:** Create `WarehousesHeader.tsx` in Warehouses directory
2. **Add title section:** Display "Warehouses" heading with count
3. **Add search bar:** Inline search input with icon
4. **Add filter dropdown:** Active/Inactive/All filter
5. **Add new button:** "New Warehouse" button linking to /inventory/warehouses/new
6. **Add stats summary:** Total warehouses, active, storage capacity
7. **Style header:** Flex layout with space-between
8. **Add icons:** Building icon for warehouses, Plus for new button

### Header Layout
```
┌────────────────────────────────────────────────────────┐
│  🏢 Warehouses (8)                                     │
│  Active: 7 | Total Capacity: 85%                       │
│                                                        │
│  [🔍 Search warehouses...]  [Status: All ▼]           │
│                                      [+ New Warehouse] │
└────────────────────────────────────────────────────────┘
```

### Header Elements

| Element | Description | Behavior |
|---------|-------------|----------|
| Title | "Warehouses" with icon | Static with count badge |
| Count Badge | Total warehouses | Updates dynamically |
| Stats Bar | Active count, capacity | Real-time data |
| Search | Inline search input | Filter cards |
| Status Filter | Dropdown (All/Active/Inactive) | Filter by status |
| New Button | Create warehouse | Links to form |

### Stats Display
```
Active: 7 of 8
Total Capacity: 85%
Total Items: 1,234
```

### Search Features

| Feature | Implementation |
|---------|----------------|
| Debounce | 300ms delay |
| Min Characters | 2 characters |
| Search Fields | Name, code, address |
| Clear Button | X icon to clear |
| Placeholder | "Search warehouses..." |

### Expected Outcome
- Functional header with search
- Warehouse statistics
- Navigation to new warehouse form
- Status filtering

### Verification
- [ ] Header displays with counts
- [ ] Search works
- [ ] Filter functions
- [ ] New button navigates

---

## Task 81: Create Warehouse Cards

### Overview
Create the card grid container component that manages the layout and rendering of individual warehouse cards.

### Dependencies
- Task 79: Create Warehouses List Page

### Instructions

1. **Create component file:** Create `WarehouseCards.tsx`
2. **Define component props:** Accept warehouses array, loading state
3. **Create grid layout:** Responsive CSS grid
4. **Map warehouses:** Render WarehouseCard for each warehouse
5. **Add loading skeleton:** Show skeleton cards while loading
6. **Add empty state:** Display message when no warehouses
7. **Implement sorting:** Support multiple sort options
8. **Add animation:** Fade-in effect for cards
9. **Style grid:** Proper spacing and responsive design
10. **Export component:** Export with types

### Grid Structure
```
┌────────────────────────────────────────────────────────┐
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐ │
│  │ Warehouse 1  │  │ Warehouse 2  │  │ Warehouse 3  │ │
│  └──────────────┘  └──────────────┘  └──────────────┘ │
│                                                        │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐ │
│  │ Warehouse 4  │  │ Warehouse 5  │  │ Warehouse 6  │ │
│  └──────────────┘  └──────────────┘  └──────────────┘ │
└────────────────────────────────────────────────────────┘
```

### Empty State
```
┌────────────────────────────────────────┐
│                                        │
│              🏢                         │
│                                        │
│         No Warehouses Found            │
│                                        │
│    Create your first warehouse to      │
│    start managing inventory            │
│                                        │
│         [+ New Warehouse]              │
│                                        │
└────────────────────────────────────────┘
```

### Loading State
```
Show 6 skeleton cards with:
- Animated shimmer effect
- Card shape and size
- Placeholder for content
```

### Sort Options

| Sort By | Order | Display |
|---------|-------|---------|
| Name | A-Z | Alphabetical |
| Code | A-Z | By warehouse code |
| Items | Desc | Most items first |
| Capacity | Desc | Highest capacity first |

### Grid Animation
```
Cards fade in with stagger:
Card 1: 0ms delay
Card 2: 50ms delay
Card 3: 100ms delay
...
```

### Expected Outcome
- Responsive card grid
- Loading states
- Empty state handling
- Smooth animations

### Verification
- [ ] Grid displays cards
- [ ] Responsive at all breakpoints
- [ ] Loading skeleton shows
- [ ] Empty state displays

---

## Task 82: Create Warehouse Card Component

### Overview
Create the individual warehouse card component displaying warehouse information, statistics, and action buttons.

### Dependencies
- Task 81: Create Warehouse Cards

### Instructions

1. **Create component file:** Create `WarehouseCard.tsx`
2. **Define component props:** Accept warehouse data, onEdit, onDelete
3. **Create card structure:** Header, body, stats, footer sections
4. **Display warehouse info:** Name, code, type badge
5. **Show address:** Formatted address display
6. **Add status badge:** Active/Inactive indicator
7. **Include stats:** Use WarehouseStats component
8. **Add action buttons:** Edit, delete, view details
9. **Implement hover effect:** Lift on hover
10. **Style card:** Clean, modern design
11. **Export component:** Export with types

### Card Structure
```
┌──────────────────────────────────────┐
│  Main Warehouse            [Default] │
│  WH-001                     ● Active │
├──────────────────────────────────────┤
│  📍 123 Main Street                  │
│     Colombo, Western Province        │
│     Sri Lanka                        │
├──────────────────────────────────────┤
│  📦 234 Items  💰 LKR 2.5M          │
│  📊 85% Capacity                     │
├──────────────────────────────────────┤
│  [Edit] [Delete]          [View →]  │
└──────────────────────────────────────┘
```

### Card Sections

**Header Section:**
| Element | Content |
|---------|---------|
| Name | Warehouse name (large, bold) |
| Code | Warehouse code (gray) |
| Default Badge | If is_default = true |
| Status | Active/Inactive badge |

**Body Section:**
| Element | Content |
|---------|---------|
| Icon | Location pin |
| Address | Multi-line formatted address |
| District | District name |

**Stats Section:**
| Element | Content |
|---------|---------|
| Items | Total item count + icon |
| Value | Total inventory value + icon |
| Capacity | Utilization percentage + icon |

**Footer Section:**
| Element | Content |
|---------|---------|
| Edit Button | Navigate to edit form |
| Delete Button | Open delete confirmation |
| View Button | Navigate to detail view |

### Badge Variants

**Default Badge:**
```
Display: [⭐ Default]
Color: Blue/Gold
Shows when: is_default = true
```

**Status Badge:**
```
Active:   [● Active]   - Green
Inactive: [● Inactive] - Gray
```

### Card Hover Effect
```
Default: shadow-sm
Hover:   shadow-lg + translateY(-2px)
Transition: 200ms ease
```

### Action Buttons

| Button | Icon | Color | Action |
|--------|------|-------|--------|
| Edit | Pencil | Blue | Navigate to edit |
| Delete | Trash | Red | Open delete dialog |
| View | ArrowRight | Gray | Navigate to detail |

### Expected Outcome
- Attractive warehouse card
- Clear information display
- Interactive hover effects
- Functional action buttons

### Verification
- [ ] Card displays warehouse info
- [ ] Badges show correctly
- [ ] Actions work
- [ ] Hover effects smooth

---

## Task 83: Create Warehouse Stats

### Overview
Create a component that displays warehouse statistics including total items, inventory value, and capacity utilization.

### Dependencies
- Task 82: Create Warehouse Card Component

### Instructions

1. **Create component file:** Create `WarehouseStats.tsx`
2. **Define component props:** Accept stats data (items, value, capacity)
3. **Create stats layout:** Grid of stat items
4. **Display items count:** Total products with icon
5. **Display total value:** Inventory value formatted
6. **Display capacity:** Utilization percentage with visual bar
7. **Add icons:** Visual indicators for each stat
8. **Color code capacity:** Green/yellow/red based on percentage
9. **Add tooltips:** Detailed info on hover
10. **Style component:** Clean, scannable design
11. **Export component:** Export with types

### Stats Display
```
┌──────────────────────────────────────┐
│  📦 234 Items    💰 LKR 2,500,000    │
│                                      │
│  📊 Capacity: 85%                    │
│  [████████████████░░░░]              │
└──────────────────────────────────────┘
```

### Stat Items

**Total Items:**
| Element | Display |
|---------|---------|
| Icon | Package (📦) |
| Value | Count number |
| Label | "Items" |
| Tooltip | "Total products stored" |

**Total Value:**
| Element | Display |
|---------|---------|
| Icon | Currency (💰) |
| Value | Formatted currency (LKR) |
| Label | "Inventory Value" |
| Tooltip | "Total value of all items" |

**Capacity:**
| Element | Display |
|---------|---------|
| Icon | BarChart (📊) |
| Value | Percentage |
| Label | "Capacity" |
| Visual | Progress bar |
| Tooltip | "Storage utilization" |

### Capacity Color Coding

| Utilization | Color | Bar | Status Text |
|-------------|-------|-----|-------------|
| 0-50% | Green | bg-green-500 | "Plenty of space" |
| 51-80% | Yellow | bg-yellow-500 | "Good utilization" |
| 81-95% | Orange | bg-orange-500 | "Nearly full" |
| 96-100% | Red | bg-red-500 | "At capacity" |

### Capacity Bar
```
Visual progress bar showing utilization:
┌──────────────────────────┐
│████████████████████░░░░░░│ 85%
└──────────────────────────┘
Filled: 85%
Empty: 15%
```

### Value Formatting

| Value | Format | Example |
|-------|--------|---------|
| < 1,000 | N | 234 |
| < 1,000,000 | N.NK | 234.5K |
| >= 1,000,000 | N.NM | 2.5M |

### Tooltip Content
```
Total Items:
234 unique products
Total Quantity: 1,250 units

Inventory Value:
Total: LKR 2,500,000
Average per item: LKR 10,683

Capacity:
Used: 850 sqm
Total: 1,000 sqm
Available: 150 sqm
```

### Layout

**Desktop:**
```
[Icon Value Label] [Icon Value Label] [Icon Value Label]
Horizontal row
```

**Mobile:**
```
[Icon Value Label]
[Icon Value Label]
[Icon Value Label]
Vertical stack
```

### Expected Outcome
- Clear statistics display
- Color-coded capacity
- Formatted values
- Informative tooltips

### Verification
- [ ] Stats display correctly
- [ ] Capacity bar shows
- [ ] Colors match levels
- [ ] Tooltips work

---

## Task 84: Create New Warehouse Page

### Overview
Create the page for creating new warehouses with a comprehensive form including name, code, address, and settings.

### Dependencies
- Group A Task 14: Verify Route Structure
- New warehouse route at /inventory/warehouses/new

### Instructions

1. **Create page directory:** In warehouses folder, create `new/` folder
2. **Create page file:** In new directory, create `page.tsx`
3. **Define metadata:** Title "New Warehouse - LCC"
4. **Set up page layout:** Header with breadcrumbs and form container
5. **Add form wrapper:** Container with proper spacing
6. **Import form component:** Use WarehouseForm component
7. **Handle navigation:** Cancel returns to list, submit processes data

### Page Structure
```
┌────────────────────────────────────────┐
│  Home > Inventory > Warehouses > New   │
├────────────────────────────────────────┤
│  New Warehouse                         │
├────────────────────────────────────────┤
│  [Form Content Area]                   │
│                                        │
│  [Cancel]          [Create Warehouse]  │
└────────────────────────────────────────┘
```

### Form Sections

| Section | Fields | Purpose |
|---------|--------|---------|
| Basic Info | Name, Code | Identification |
| Address | Multi-line address | Location |
| Settings | Default, Active | Configuration |

### Navigation Elements

| Element | Type | Action |
|---------|------|--------|
| Breadcrumbs | Links | Navigate to parent pages |
| Cancel Button | Secondary | Return to list (confirm if changes) |
| Create Button | Primary | Submit warehouse |

### Expected Outcome
- New warehouse form page
- Clean form interface
- Proper navigation

### Verification
- [ ] Page renders at correct route
- [ ] Breadcrumbs work
- [ ] Form displays
- [ ] Navigation functions

---

## Task 85: Create Warehouse Form Schema

### Overview
Create Zod validation schema for the warehouse form ensuring data integrity, unique codes, and proper address validation.

### Dependencies
- Task 84: Create New Warehouse Page
- Zod library installed

### Instructions

1. **Create schema file:** In `frontend/lib/validations/`, create `warehouse.ts`
2. **Import Zod:** Import z from 'zod'
3. **Define address schema:** Nested schema for address fields
4. **Define main schema:** Complete warehouse form schema
5. **Add custom validations:** Unique code, format validation
6. **Add conditional rules:** Required fields based on settings
7. **Define TypeScript types:** Infer types from schemas
8. **Export schemas:** Export for use in forms
9. **Add error messages:** Custom validation error messages

### Schema Structure

**Address Schema:**
| Field | Type | Validation | Error Message |
|-------|------|------------|---------------|
| line1 | string | Required, 2-100 chars | "Address line 1 required" |
| line2 | string | Optional, max 100 chars | "Address too long" |
| city | string | Required, 2-50 chars | "City required" |
| district | string | Required, valid district | "District required" |
| postal_code | string | Optional, format NNNNN | "Invalid postal code" |

**Main Warehouse Schema:**
| Field | Type | Validation | Error Message |
|-------|------|------------|---------------|
| name | string | Required, 2-100 chars | "Warehouse name required" |
| code | string | Required, 2-20 chars, uppercase, unique | "Code required & unique" |
| address | object | Address schema | Nested validation |
| is_default | boolean | Default false | - |
| is_active | boolean | Default true | - |
| capacity | number | Optional, > 0 | "Must be positive" |
| type | string | Optional, enum | "Invalid type" |

### Validation Rules

| Rule | Check | Error |
|------|-------|-------|
| Name Length | 2-100 characters | "Name must be 2-100 characters" |
| Code Format | Uppercase, alphanumeric, hyphen | "Code must be uppercase (e.g., WH-001)" |
| Code Unique | Not exists in database | "Code already exists" |
| Address Line1 | Required | "Address line 1 is required" |
| City | Required | "City is required" |
| District | Valid Sri Lankan district | "Invalid district" |
| Postal Code | Optional, 5 digits | "Postal code must be 5 digits" |

### District Enum
```
Valid districts (Sri Lanka):
- Colombo
- Gampaha
- Kalutara
- Kandy
- Matale
- Nuwara Eliya
- Galle
- Matara
- Hambantota
... (all 25 districts)
```

### Warehouse Type Enum
```
- MAIN: Main warehouse
- BRANCH: Branch location
- RETAIL: Retail store
- STORAGE: Storage facility
- DISTRIBUTION: Distribution center
```

### Code Format Validation
```
Pattern: ^[A-Z0-9-]+$
Examples:
  Valid: WH-001, MAIN-WH, BR-COLOMBO
  Invalid: wh-001, warehouse_1, WH 001
```

### Postal Code Validation
```
Pattern: ^\\d{5}$
Examples:
  Valid: 10100, 11300, 80000
  Invalid: 1234, 123456, ABC12
```

### Expected Outcome
- Complete Zod schema
- TypeScript types inferred
- Custom error messages
- District and type enums

### Verification
- [ ] Schema validates correctly
- [ ] Types inferred
- [ ] Error messages display
- [ ] Custom validations work

---

## Task 86: Create Warehouse Name Input

### Overview
Create the name and code input section with auto-suggestion for warehouse code based on name.

### Dependencies
- Task 85: Create Warehouse Form Schema

### Instructions

1. **Create component file:** Create `WarehouseNameInput.tsx`
2. **Define component props:** Accept form control, register, errors
3. **Create name input:** Text input with validation
4. **Create code input:** Text input with auto-suggest
5. **Implement auto-suggest:** Generate code from name
6. **Add format helper:** Explain code format
7. **Add uniqueness check:** Validate code availability
8. **Style inputs:** Side-by-side on desktop
9. **Export component:** Export with types

### Input Layout
```
┌────────────────────────────────────────┐
│  Warehouse Name *                      │
│  [Main Warehouse Branch 1]             │
│                                        │
│  Warehouse Code *                      │
│  [MAIN-BR-1]      [Suggest from name]  │
│  Must be uppercase (e.g., WH-001)      │
│                                        │
│  ✓ Code is available                   │
└────────────────────────────────────────┘
```

### Name Input

| Property | Value |
|----------|-------|
| Type | Text |
| Required | Yes |
| Min Length | 2 characters |
| Max Length | 100 characters |
| Placeholder | "Main Warehouse" |

### Code Input

| Property | Value |
|----------|-------|
| Type | Text |
| Required | Yes |
| Min Length | 2 characters |
| Max Length | 20 characters |
| Transform | Uppercase |
| Pattern | A-Z, 0-9, hyphen |
| Placeholder | "WH-001" |

### Auto-Suggest Logic
```
Input: "Main Warehouse Branch 1"
Suggested Code: "MAIN-BR-1"

Rules:
1. Take first 4 letters of first word
2. Take first 2 letters of other words
3. Replace spaces with hyphens
4. Convert to uppercase
5. Limit to 20 characters
```

### Code Suggestions Examples

| Name | Suggested Code |
|------|----------------|
| Main Warehouse | MAIN-WH |
| Branch 1 | BR-1 |
| Colombo Storage Facility | COL-ST-FAC |
| Distribution Center | DIST-CE |

### Uniqueness Check
```
OnBlur of code input:
1. Call API to check if code exists
2. Show loading spinner
3. Display result:
   - ✓ Available
   - ✗ Already exists
```

### Helper Text
```
Below code input:
"Must be uppercase alphanumeric with hyphens (e.g., WH-001)"
```

### Expected Outcome
- Name and code inputs
- Auto-suggestion working
- Code validation
- Uniqueness check

### Verification
- [ ] Name input works
- [ ] Code auto-suggests
- [ ] Uppercase enforced
- [ ] Uniqueness checks

---

## Task 87: Create Warehouse Address Form

### Overview
Create the comprehensive address form section with fields for Sri Lankan addresses including district selection.

### Dependencies
- Task 85: Create Warehouse Form Schema

### Instructions

1. **Create component file:** Create `WarehouseAddressForm.tsx`
2. **Define component props:** Accept form control, register, errors
3. **Create address line 1:** Required text input
4. **Create address line 2:** Optional text input
5. **Create city input:** Required text input with suggestions
6. **Create district select:** Dropdown with all Sri Lankan districts
7. **Create postal code:** Optional formatted input
8. **Add field descriptions:** Helper text for each field
9. **Style form:** Grid layout for responsive design
10. **Export component:** Export with types

### Address Form Layout
```
┌────────────────────────────────────────┐
│  Address Information                   │
├────────────────────────────────────────┤
│  Address Line 1 *                      │
│  [123 Main Street]                     │
│                                        │
│  Address Line 2                        │
│  [Building/Unit (optional)]            │
│                                        │
│  City *                                │
│  [Colombo]                             │
│                                        │
│  District *                            │
│  [Colombo ▼]                           │
│                                        │
│  Postal Code                           │
│  [10100]                               │
│  5-digit postal code (optional)        │
└────────────────────────────────────────┘
```

### Field Specifications

**Address Line 1:**
| Property | Value |
|----------|-------|
| Type | Text |
| Required | Yes |
| Max Length | 100 characters |
| Placeholder | "123 Main Street" |

**Address Line 2:**
| Property | Value |
|----------|-------|
| Type | Text |
| Required | No |
| Max Length | 100 characters |
| Placeholder | "Building, Floor, Unit" |

**City:**
| Property | Value |
|----------|-------|
| Type | Text with autocomplete |
| Required | Yes |
| Max Length | 50 characters |
| Placeholder | "Colombo" |
| Suggestions | Major Sri Lankan cities |

**District:**
| Property | Value |
|----------|-------|
| Type | Select dropdown |
| Required | Yes |
| Options | All 25 Sri Lankan districts |
| Placeholder | "Select district" |

**Postal Code:**
| Property | Value |
|----------|-------|
| Type | Text |
| Required | No |
| Pattern | 5 digits |
| Format | NNNNN |
| Placeholder | "10100" |

### Sri Lankan Districts List
```
Grouped by Province:

Western Province:
- Colombo
- Gampaha
- Kalutara

Central Province:
- Kandy
- Matale
- Nuwara Eliya

Southern Province:
- Galle
- Matara
- Hambantota

... (all 25 districts organized by province)
```

### City Suggestions
```
Major cities for autocomplete:
- Colombo
- Kandy
- Galle
- Jaffna
- Negombo
- Kurunegala
- Trincomalee
- Batticaloa
- Anuradhapura
... (50+ major cities)
```

### Postal Code Format
```
Input: 10100
Display: 10100
Validation: Must be exactly 5 digits
```

### Grid Layout

**Desktop (2 columns):**
```
[Address Line 1      ] [Address Line 2     ]
[City                ] [District ▼         ]
[Postal Code         ] [                   ]
```

**Mobile (1 column):**
```
[Address Line 1                           ]
[Address Line 2                           ]
[City                                     ]
[District ▼                               ]
[Postal Code                              ]
```

### Expected Outcome
- Complete address form
- District dropdown
- City suggestions
- Postal code validation

### Verification
- [ ] All fields render
- [ ] District dropdown populates
- [ ] City autocomplete works
- [ ] Postal code validates

---

## Task 88: Create Warehouse Settings

### Overview
Create the settings section with toggles for default warehouse and active status.

### Dependencies
- Task 85: Create Warehouse Form Schema

### Instructions

1. **Create component file:** Create `WarehouseSettings.tsx`
2. **Define component props:** Accept form control, register
3. **Create default toggle:** Switch for default warehouse
4. **Create active toggle:** Switch for active status
5. **Add descriptions:** Explain each setting
6. **Add validation logic:** Only one default warehouse
7. **Show warnings:** Alert if making inactive with stock
8. **Style section:** Card layout with clear sections
9. **Export component:** Export with types

### Settings Layout
```
┌────────────────────────────────────────┐
│  Warehouse Settings                    │
├────────────────────────────────────────┤
│  Default Warehouse           [OFF]     │
│  Make this the default warehouse for   │
│  new inventory items                   │
│                                        │
│  Active Status                [ON]     │
│  Active warehouses can receive and     │
│  transfer inventory                    │
│                                        │
│  Storage Capacity (Optional)           │
│  [1000] square meters                  │
└────────────────────────────────────────┘
```

### Setting Items

**Default Warehouse Toggle:**
| Property | Value |
|----------|-------|
| Type | Switch/Toggle |
| Default | false |
| Label | "Default Warehouse" |
| Description | "Make this the default warehouse for new inventory items" |
| Behavior | Only one can be default |

**Active Status Toggle:**
| Property | Value |
|----------|-------|
| Type | Switch/Toggle |
| Default | true |
| Label | "Active Status" |
| Description | "Active warehouses can receive and transfer inventory" |
| Warning | If has stock and setting inactive |

**Storage Capacity:**
| Property | Value |
|----------|-------|
| Type | Number input |
| Required | No |
| Unit | Square meters |
| Min | 1 |
| Max | 999999 |
| Placeholder | "1000" |

### Toggle States
```
ON:  [======●] (Blue background)
OFF: [●------] (Gray background)
```

### Default Warehouse Logic
```
If setting as default:
1. Check if another warehouse is default
2. Show confirmation: "This will remove default status from [Name]"
3. On confirm: Update both warehouses
4. Show success message
```

### Active Status Warning
```
If warehouse has stock and setting inactive:
┌────────────────────────────────────────┐
│  ⚠️ Warning                            │
│                                        │
│  This warehouse has 234 items in       │
│  stock. Setting it inactive will       │
│  prevent new transfers.                │
│                                        │
│  Existing items will remain. Consider  │
│  transferring items first.             │
│                                        │
│  [Cancel]  [Set Inactive Anyway]       │
└────────────────────────────────────────┘
```

### Capacity Field
```
┌────────────────────────────────────────┐
│  Storage Capacity (Optional)           │
│  [1000] square meters                  │
│  Used for capacity calculations        │
└────────────────────────────────────────┘
```

### Expected Outcome
- Default warehouse toggle
- Active status toggle
- Capacity input
- Warning dialogs
- Validation logic

### Verification
- [ ] Toggles work
- [ ] Default logic functions
- [ ] Active warning shows
- [ ] Capacity input validates

---

## Summary

This document established the warehouse management CRUD foundations, including:

✓ Warehouses list page with card grid  
✓ Search and filtering capabilities  
✓ Warehouse cards with stats display  
✓ New warehouse form page  
✓ Comprehensive validation schema  
✓ Name and code inputs with auto-suggest  
✓ Complete address form for Sri Lankan addresses  
✓ Warehouse settings with toggles  

**Next Document:** [02_Tasks-89-92_Edit-Delete-Testing.md](02_Tasks-89-92_Edit-Delete-Testing.md) covers the edit functionality, delete confirmation, documentation, and final verification testing.

---

**Completion Checklist:**
- [ ] All components created in correct directories
- [ ] Card grid responsive
- [ ] Forms use React Hook Form + Zod
- [ ] Address form complete with districts
- [ ] Settings toggles working
- [ ] Validation functioning
- [ ] Navigation between pages functional
- [ ] Error handling implemented
- [ ] Loading states added
