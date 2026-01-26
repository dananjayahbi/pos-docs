# Tasks 49-58: Vendor List & Profile

> **Phase:** 07 - Frontend Infrastructure & ERP Dashboard  
> **SubPhase:** 12 - Customer & Vendor UI  
> **Group:** D - Vendor Management  
> **Document:** 01 of 02  
> **Tasks Covered:** 49, 50, 51, 52, 53, 54, 55, 56, 57, 58

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **→ Next Document:** [02_Tasks-59-64_Vendor-Contacts.md](02_Tasks-59-64_Vendor-Contacts.md)

---

## Document Overview

This document covers the creation of the vendor listing page with summary cards, filters, data table, and the vendor details page with header and tabbed interface. Vendors are suppliers/manufacturers from whom the business purchases inventory and supplies.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 49 | Create Vendors List Page | Low | 20 min |
| 50 | Create Vendors Header | Low | 15 min |
| 51 | Create Vendor Summary Cards | Medium | 25 min |
| 52 | Create Vendor Filters | Low | 20 min |
| 53 | Create Vendors Table | Medium | 30 min |
| 54 | Define Vendor Table Columns | Medium | 25 min |
| 55 | Create Vendor Actions Cell | Low | 20 min |
| 56 | Create Vendor Details Page | Medium | 25 min |
| 57 | Create Vendor Header Section | Low | 20 min |
| 58 | Create Vendor Tabs | Low | 20 min |

---

## Task 49: Create Vendors List Page

### Overview
Create the main VendorsList component that serves as the container for the entire vendors page. Similar structure to CustomersList but tailored for vendor/supplier management.

### Dependencies
- Group A (Task 05): Vendors route exists
- Group B: Customer list pattern established

### Instructions

1. **Create component file**
   - Navigate to `frontend/components/modules/crm/Vendors/` directory
   - Create new file `VendorsList.tsx`

2. **Import required dependencies**
   - Import child components (header, cards, filters, table)
   - Import useVendors hook

3. **Define component structure**
   - Set up state for filters (search, status, category)
   - Initialize data fetching
   - Define loading and error states

4. **Create page layout**
   - VendorsHeader at top
   - VendorSummaryCards below header
   - VendorFilters toolbar
   - VendorsTable at bottom

5. **Manage filter state**
   - searchQuery, statusFilter, categoryFilter
   - Pass to table and API

### Expected Outcome
- Vendors list page container created
- Layout structure established
- State management configured

### Verification Checklist
- [ ] VendorsList.tsx file created
- [ ] Component exports correctly
- [ ] Layout renders properly
- [ ] State management works

---

## Task 50: Create Vendors Header

### Overview
Create the VendorsHeader component with page title and "Add Vendor" button.

### Dependencies
- Task 49: Vendors List Page created

### Instructions

1. **Create component file**
   - Create new file `VendorsHeader.tsx`

2. **Implement header layout**
   - Title: "Vendors"
   - Action button: "Add Vendor" (navigates to /vendors/new)
   - Use flex layout

### Expected Outcome
- Header displays title and add button
- Navigation to new vendor page works

### Verification Checklist
- [ ] VendorsHeader.tsx file created
- [ ] Title renders
- [ ] Add button navigates correctly

---

## Task 51: Create Vendor Summary Cards

### Overview
Create VendorSummaryCards showing total vendors and active vendors count.

### Dependencies
- Task 50: Vendors Header created

### Instructions

1. **Create component file**
   - Create new file `VendorSummaryCards.tsx`

2. **Create card grid**
   - 2 columns (Total Vendors, Active Vendors)
   - Responsive layout

3. **Fetch vendor statistics**
   - Use useVendorStats hook
   - Display total count
   - Display active count

4. **Style cards**
   - Use Building2 icon for Total
   - Use CheckCircle icon for Active
   - Add trend indicators

### Card Layout

```
┌──────────────┐    ┌──────────────┐
│ 🏢           │    │ ✓            │
│ Total Vendors│    │Active Vendors│
│    125       │    │    118       │
│ +5 this month│    │ +3 this month│
└──────────────┘    └──────────────┘
```

### Expected Outcome
- Two summary cards display counts
- Trend indicators show changes

### Verification Checklist
- [ ] VendorSummaryCards.tsx file created
- [ ] Cards display correctly
- [ ] Statistics fetch from API

---

## Task 52: Create Vendor Filters

### Overview
Create VendorFilters toolbar with search and status filter.

### Dependencies
- Task 51: Summary cards created

### Instructions

1. **Create component file**
   - Create new file `VendorFilters.tsx`

2. **Add search input**
   - Search by name, contact name
   - Debounce 300ms

3. **Add status filter**
   - All, Active, Inactive

4. **Optional: Category filter**
   - Filter by product categories vendor supplies

### Filter Layout

```
┌─────────────────────────────────────────────┐
│ 🔍 Search vendors...  [Status▼] [Category▼]│
└─────────────────────────────────────────────┘
```

### Expected Outcome
- Filter toolbar displays controls
- Filters update vendor list

### Verification Checklist
- [ ] VendorFilters.tsx file created
- [ ] Search works with debounce
- [ ] Status filter functional

---

## Task 53: Create Vendors Table

### Overview
Create VendorsTable component using TanStack Table to display vendor data.

### Dependencies
- Task 52: Vendor filters created

### Instructions

1. **Create component file**
   - Create new file `VendorsTable.tsx`

2. **Initialize TanStack Table**
   - Use useReactTable hook
   - Configure columns (Task 54)
   - Set up sorting and pagination

3. **Create table structure**
   - Table header
   - Table body with vendor rows
   - Loading skeleton
   - Empty state

4. **Add row interactions**
   - Click row to navigate to vendor details
   - Hover states

### Expected Outcome
- Vendors table displays data
- Sorting and pagination work

### Verification Checklist
- [ ] VendorsTable.tsx file created
- [ ] Table renders data
- [ ] Sorting functional
- [ ] Pagination works

---

## Task 54: Define Vendor Table Columns

### Overview
Define column configuration for vendors table including name, contact, products, PO count, status, and actions.

### Dependencies
- Task 53: Vendors Table created

### Instructions

1. **Create column definitions file**
   - Create new file `VendorTableColumns.tsx`

2. **Define Vendor interface**
   - id, name, contactName, phone, email, status, productsCount, posCount

3. **Create columns:**
   - **Name**: Display vendor name, sortable
   - **Contact**: Contact name and phone
   - **Products**: Count of products supplied
   - **POs**: Count of purchase orders
   - **Status**: Active/Inactive badge
   - **Actions**: Dropdown menu

### Column Layout

```
┌───────────────────────────────────────────────────┐
│ Name ↓      Contact     Products  POs Status  ... │
├───────────────────────────────────────────────────┤
│ ABC Supply  Raj Kumar   45        32 [Active]  [⋮]│
│             0711234567                            │
└───────────────────────────────────────────────────┘
```

### Expected Outcome
- All columns defined correctly
- Formatters applied

### Verification Checklist
- [ ] VendorTableColumns.tsx file created
- [ ] All columns render
- [ ] Sorting works on correct columns

---

## Task 55: Create Vendor Actions Cell

### Overview
Create VendorActionsCell component with dropdown menu for vendor actions.

### Dependencies
- Task 54: Vendor columns defined

### Instructions

1. **Create component file**
   - Create new file `VendorActionsCell.tsx`

2. **Create actions dropdown:**
   - **View Details**: Navigate to /vendors/[id]
   - **Edit Vendor**: Open edit modal
   - **Delete**: Confirm and delete (only if no active POs)

3. **Implement handlers**
   - View: Navigate to details
   - Edit: Trigger edit modal
   - Delete: Show confirmation, call API

### Expected Outcome
- Actions dropdown functional
- All actions work correctly

### Verification Checklist
- [ ] VendorActionsCell.tsx file created
- [ ] Dropdown renders
- [ ] Actions functional

---

## Task 56: Create Vendor Details Page

### Overview
Create VendorDetails component showing comprehensive vendor information with tabbed interface.

### Dependencies
- Group A (Task 06): Vendor details route exists

### Instructions

1. **Create component file**
   - Navigate to `frontend/components/modules/crm/Vendors/VendorProfile/` directory
   - Create new file `VendorDetails.tsx`

2. **Fetch vendor data**
   - Use useVendor(id) hook
   - Handle loading and error states

3. **Create page layout**
   - VendorHeader section (Task 57)
   - VendorTabs component (Task 58)

4. **Add back button**
   - Navigate back to vendors list

### Expected Outcome
- Vendor details page displays information
- Data fetches correctly

### Verification Checklist
- [ ] VendorDetails.tsx file created
- [ ] Data fetches from API
- [ ] Page renders correctly

---

## Task 57: Create Vendor Header Section

### Overview
Create VendorHeader component displaying vendor name, status, and action buttons.

### Dependencies
- Task 56: Vendor details page created

### Instructions

1. **Create component file**
   - Create new file `VendorHeader.tsx`

2. **Display vendor information:**
   - Vendor name (large text)
   - Status badge (Active/Inactive)
   - Contact person name
   - Action buttons (Edit, More options)

3. **Add quick stats (optional):**
   - Total purchase orders
   - Total amount purchased
   - Last PO date

### Header Layout

```
┌─────────────────────────────────────────────┐
│ ← Back                                      │
│                                             │
│ ABC Suppliers Ltd            [Edit] [⋮ More]│
│ [Active]                                    │
│ Contact: Raj Kumar                          │
└─────────────────────────────────────────────┘
```

### Expected Outcome
- Header displays vendor name and status
- Action buttons functional

### Verification Checklist
- [ ] VendorHeader.tsx file created
- [ ] Name and status display
- [ ] Action buttons work

---

## Task 58: Create Vendor Tabs

### Overview
Create VendorTabs component with tabs for Overview, Products, and PO History.

### Dependencies
- Task 57: Vendor header created

### Instructions

1. **Create component file**
   - Create new file `VendorTabs.tsx`

2. **Define tabs:**
   - **Overview**: Company info, payment terms (Task 59)
   - **Products**: Products from this vendor (Task 60)
   - **PO History**: Purchase order history (Task 61)

3. **Implement tab navigation**
   - Use Radix UI Tabs
   - Sync with URL (optional)

### Tabs Layout

```
┌─────────────────────────────────────────────┐
│ [Overview] [Products (45)] [PO History]     │
├─────────────────────────────────────────────┤
│                                             │
│         Tab Content Here                    │
│                                             │
└─────────────────────────────────────────────┘
```

### Expected Outcome
- Tabs display and switch correctly
- Count badges show on Products tab

### Verification Checklist
- [ ] VendorTabs.tsx file created
- [ ] All tabs render
- [ ] Tab switching works
- [ ] Content displays correctly

---

## Summary

This document created the vendor listing page and vendor details page foundation. The following components were implemented:

### Vendor List
- VendorsList - Main container
- VendorsHeader - Title and actions
- VendorSummaryCards - Statistics display
- VendorFilters - Search and filters
- VendorsTable - Data table
- VendorTableColumns - Column definitions
- VendorActionsCell - Actions dropdown

### Vendor Profile
- VendorDetails - Main details page
- VendorHeader - Vendor name and status
- VendorTabs - Tabbed navigation

The next document will complete vendor functionality with tab content, forms, and API integration.
