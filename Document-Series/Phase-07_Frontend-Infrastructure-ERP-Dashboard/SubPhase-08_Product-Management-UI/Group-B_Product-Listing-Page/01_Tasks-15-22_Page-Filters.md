# Tasks 15-22: Product List Page and Filters

> **Phase:** 07 - Frontend Infrastructure & ERP Dashboard  
> **SubPhase:** 08 - Product Management UI  
> **Group:** B - Product Listing Page  
> **Document:** 01 of 02  
> **Tasks Covered:** 15, 16, 17, 18, 19, 20, 21, 22

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **→ Next Document:** [02_Tasks-23-34_DataTable-BulkActions.md](02_Tasks-23-34_DataTable-BulkActions.md)

---

## Document Overview

This document covers the creation of the product listing page foundation and comprehensive filtering system. It establishes the main list page component, header with action buttons, and a robust filter bar with search, status, category, and stock level filters.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 15 | Create Product List Page Component | Low | 20 min |
| 16 | Create Product List Header | Low | 25 min |
| 17 | Create Product Filters Bar | Low | 30 min |
| 18 | Create Search Input | Low | 20 min |
| 19 | Create Status Filter | Low | 20 min |
| 20 | Create Category Filter | Low | 25 min |
| 21 | Create Stock Filter | Low | 20 min |
| 22 | Create Clear Filters Button | Low | 15 min |

---

## Task 15: Create Product List Page Component

### Overview
Create the main ProductList page component that serves as the container for all product listing functionality. This component coordinates the header, filters, and data table, managing the overall layout and state for the product listing interface.

### Dependencies
- Task 14: Create product page structure (from Group A)
- SubPhase-05 (Data Table Components) must be complete
- Product routes and navigation established

### Instructions

1. **Create ProductList component directory**
   - Navigate to `frontend/components/modules/products/` directory
   - Create new directory named `ProductList`
   - This will house all product listing related components

2. **Create main ProductList component file**
   - Create `ProductList.tsx` in the ProductList directory
   - Set up as client component with "use client" directive
   - Import necessary React hooks and dependencies

3. **Initialize component state management**
   - Set up filter state (search, status, category, stock)
   - Initialize pagination state (page, pageSize)
   - Set up sorting state (sortBy, sortOrder)
   - Use URL search params for state persistence

4. **Define layout structure**
   - Create three main sections: header, filters, content
   - Use flexbox or grid for responsive layout
   - Add proper spacing between sections
   - Ensure mobile-first responsive design

5. **Implement container styling**
   - Add page container with proper padding
   - Set maximum width for content (max-w-7xl)
   - Center content on large screens
   - Add background color if needed

6. **Create component exports**
   - Export ProductList as default
   - Create index.ts barrel export
   - Set up for future component additions

### Component State Structure

| State | Type | Purpose |
|-------|------|---------|
| filters | Object | Search, status, category, stock filters |
| pagination | Object | Current page and page size |
| sorting | Object | Sort column and direction |
| selectedRows | Array | Selected product IDs for bulk actions |

### Page Layout Structure

```
┌─────────────────────────────────────────────┐
│         ProductListHeader                    │
│  ┌─────────────────────────────────────┐   │
│  │ Title + Create Product Button        │   │
│  └─────────────────────────────────────┘   │
├─────────────────────────────────────────────┤
│         ProductFilters                       │
│  ┌─────────────────────────────────────┐   │
│  │ Search | Status | Category | Stock   │   │
│  └─────────────────────────────────────┘   │
├─────────────────────────────────────────────┤
│         ProductTable                         │
│  ┌─────────────────────────────────────┐   │
│  │                                      │   │
│  │     Data Table with Products         │   │
│  │                                      │   │
│  └─────────────────────────────────────┘   │
│                                              │
│         Pagination Controls                  │
└─────────────────────────────────────────────┘
```

### URL State Management

| Parameter | Type | Example | Purpose |
|-----------|------|---------|---------|
| search | string | ?search=laptop | Search query |
| status | string | ?status=active | Filter by status |
| category | string | ?category=electronics | Filter by category |
| stock | string | ?stock=low | Filter by stock level |
| page | number | ?page=2 | Current page |
| sort | string | ?sort=name | Sort column |
| order | string | ?order=asc | Sort direction |

### Responsive Breakpoints

```
Mobile (< 640px)
├── Stack all sections vertically
├── Full width components
├── Collapsible filters (optional)
└── Compact table view

Tablet (640px - 1024px)
├── Same vertical stacking
├── Wider containers
└── Full table view

Desktop (> 1024px)
├── Centered container (max-w-7xl)
├── All features visible
└── Optimal spacing
```

### Expected Outcome
- Functional product list page container
- Proper state management for filters and pagination
- Responsive layout structure ready for child components
- URL-based state persistence for bookmarking

### Verification Checklist
- [ ] `frontend/components/modules/products/ProductList/ProductList.tsx` created
- [ ] Component marked as client component
- [ ] State hooks initialized for filters, pagination, sorting
- [ ] Three-section layout implemented
- [ ] URL search params integrated
- [ ] Responsive container styling applied
- [ ] Component exports correctly

---

## Task 16: Create Product List Header

### Overview
Create the ProductListHeader component that displays the page title, description, and primary action button (Create Product). This header provides clear context and the main call-to-action for the product listing page.

### Dependencies
- Task 15: Create Product List Page Component

### Instructions

1. **Create ProductListHeader component file**
   - Create `ProductListHeader.tsx` in the ProductList directory
   - Set up as React functional component
   - No need for client directive unless using state

2. **Define header structure**
   - Create container div with flexbox layout
   - Left section: title and description
   - Right section: action buttons
   - Ensure responsive stacking on mobile

3. **Add page title**
   - Display "Products" as main heading (h1)
   - Use appropriate heading size (text-2xl or text-3xl)
   - Apply proper font weight (font-bold)
   - Use brand text color

4. **Add page description (optional)**
   - Include subtitle below title
   - Example: "Manage your product catalog"
   - Use smaller text and muted color
   - Keep description concise

5. **Implement Create Product button**
   - Use Button component from UI library
   - Display "Create Product" text with plus icon
   - Apply primary button styling
   - Link to product creation page
   - Position in top-right corner

6. **Add responsive behavior**
   - Stack vertically on mobile (title then button)
   - Horizontal layout on tablet and desktop
   - Adjust spacing for different screen sizes
   - Center align on mobile, space-between on desktop

7. **Include additional actions (optional)**
   - Import products button
   - Export products button
   - Settings/preferences button
   - Group in dropdown menu for mobile

### Header Layout

```
Desktop View
┌──────────────────────────────────────────────────┐
│  Products                      [+ Create Product] │
│  Manage your product catalog                      │
└──────────────────────────────────────────────────┘

Mobile View
┌──────────────────────────────────────────────────┐
│  Products                                         │
│  Manage your product catalog                      │
│  [+ Create Product]                               │
└──────────────────────────────────────────────────┘
```

### Component Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| title | string | No | "Products" | Page title |
| description | string | No | - | Optional subtitle |
| onCreateClick | function | No | - | Override create handler |

### Button Configuration

| Button | Icon | Variant | Action |
|--------|------|---------|--------|
| Create Product | Plus | Primary | Navigate to /products/create |
| Import | Upload | Secondary | Open import dialog |
| Export | Download | Secondary | Trigger export |

### Styling Specifications

| Element | Tailwind Classes | Purpose |
|---------|------------------|---------|
| Container | `flex justify-between items-start mb-6` | Header layout |
| Title Section | `flex-1` | Allow title to grow |
| Title | `text-3xl font-bold text-gray-900` | Main heading |
| Description | `text-sm text-gray-600 mt-1` | Subtitle |
| Actions | `flex gap-2` | Button group |

### Accessibility Features

| Feature | Implementation |
|---------|----------------|
| Semantic HTML | Use h1 for title |
| Button Labels | Clear, descriptive text |
| Focus Indicators | Visible focus rings |
| Keyboard Nav | Tab navigation support |

### Expected Outcome
- Professional page header with clear hierarchy
- Prominent Create Product button
- Responsive layout for all screen sizes
- Optional secondary action buttons

### Verification Checklist
- [ ] `ProductListHeader.tsx` file created
- [ ] Page title displayed correctly
- [ ] Create Product button implemented
- [ ] Button navigates to creation page
- [ ] Responsive layout on mobile and desktop
- [ ] Optional description text included
- [ ] Proper spacing and alignment
- [ ] Component exports properly

---

## Task 17: Create Product Filters Bar

### Overview
Create the ProductFilters component that serves as the container for all filter controls. This component manages the layout and coordination of individual filter components (search, status, category, stock) and provides a consistent filtering interface.

### Dependencies
- Task 15: Create Product List Page Component

### Instructions

1. **Create ProductFilters component file**
   - Create `ProductFilters.tsx` in the ProductList directory
   - Set up as client component (uses state and handlers)
   - Import necessary React hooks

2. **Define component props interface**
   - Accept current filter values as props
   - Accept filter change handlers
   - Include reset/clear filters handler
   - Define TypeScript types for all props

3. **Create filters container layout**
   - Use flexbox or grid for filter arrangement
   - Allow filters to wrap on smaller screens
   - Maintain consistent spacing between filters
   - Add proper padding and margins

4. **Implement filter slots**
   - Create designated areas for each filter type
   - Search input (Task 18)
   - Status filter dropdown (Task 19)
   - Category filter dropdown (Task 20)
   - Stock filter dropdown (Task 21)
   - Clear filters button (Task 22)

5. **Add active filters indicator**
   - Show count of active filters
   - Display as badge or text
   - Example: "3 filters active"
   - Position near clear button

6. **Implement responsive behavior**
   - Stack filters vertically on mobile
   - Two-column grid on tablet
   - Single row on desktop (if space allows)
   - Collapsible filter panel on mobile (optional)

7. **Add filter persistence**
   - Sync with URL search params
   - Update URL when filters change
   - Load initial filters from URL
   - Enable bookmarkable filter states

### Filters Bar Layout

```
Desktop View
┌───────────────────────────────────────────────────────────┐
│ [Search...] [Status ▼] [Category ▼] [Stock ▼] [Clear All] │
└───────────────────────────────────────────────────────────┘

Mobile View
┌──────────────────────────┐
│ [Search...............]  │
│ [Status ▼] [Category ▼]  │
│ [Stock ▼]  [Clear All]   │
└──────────────────────────┘
```

### Component Props Interface

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| filters | FilterState | Yes | Current filter values |
| onFilterChange | Function | Yes | Handle filter updates |
| onClearFilters | Function | Yes | Reset all filters |
| categories | Array | Yes | Available categories |
| isLoading | Boolean | No | Show loading state |

### FilterState Type Definition

```
FilterState {
  search: string
  status: 'all' | 'active' | 'draft' | 'archived'
  category: string | null
  stock: 'all' | 'low' | 'out'
}
```

### Filter Layout Strategy

| Screen Size | Layout | Columns |
|-------------|--------|---------|
| Mobile (< 640px) | Stack | 1 |
| Tablet (640-1024px) | Grid | 2 |
| Desktop (> 1024px) | Flex Row | Auto |

### Active Filters Display

| Condition | Display |
|-----------|---------|
| No filters | Normal state |
| 1+ filters | "N filters active" badge |
| Can show | Individual filter tags (optional) |

### Styling Specifications

| Element | Tailwind Classes | Purpose |
|---------|------------------|---------|
| Container | `bg-white border rounded-lg p-4 mb-6` | Filter panel |
| Filters Grid | `grid grid-cols-1 md:grid-cols-2 lg:flex gap-3` | Responsive layout |
| Filter Item | `flex-1 min-w-[200px]` | Individual filter sizing |
| Active Badge | `text-sm text-blue-600 font-medium` | Status indicator |

### Expected Outcome
- Functional filter container component
- Proper layout for all filter controls
- Responsive design across devices
- Filter state management with URL sync
- Active filter count indicator

### Verification Checklist
- [ ] `ProductFilters.tsx` file created
- [ ] Component accepts filter props and handlers
- [ ] Container layout implemented
- [ ] Slots prepared for individual filters
- [ ] Responsive grid/flex layout applied
- [ ] Active filters indicator included
- [ ] URL state synchronization working
- [ ] Component exports properly

---

## Task 18: Create Search Input

### Overview
Create a SearchInput component for filtering products by name, SKU, or description. This component provides real-time search functionality with debouncing to optimize performance and reduce unnecessary API calls.

### Dependencies
- Task 17: Create Product Filters Bar

### Instructions

1. **Create SearchInput component file**
   - Create component within ProductList directory or shared location
   - Can be reusable across different modules
   - Set up as controlled input component

2. **Define component props**
   - Accept current search value
   - Accept onChange handler
   - Accept placeholder text (optional)
   - Accept debounce delay (optional, default 300ms)

3. **Implement input structure**
   - Use text input with search type
   - Add search icon (magnifying glass) on left
   - Add clear button (X) on right when text exists
   - Style as form control with proper sizing

4. **Add debouncing functionality**
   - Implement debounce to delay API calls
   - Use useDebounce hook or lodash debounce
   - Trigger search after user stops typing (300-500ms)
   - Show loading indicator during debounce (optional)

5. **Implement clear functionality**
   - Show clear button (X icon) when input has value
   - Clear input and reset search on click
   - Return focus to input after clearing
   - Trigger filter update immediately

6. **Add keyboard shortcuts (optional)**
   - Focus input with "/" key press
   - Clear with Escape key
   - Submit with Enter key (immediate search)

7. **Style the input**
   - Apply border, padding, and rounded corners
   - Add focus ring for accessibility
   - Style icons with appropriate colors
   - Ensure proper sizing for mobile

### Search Input Structure

```
┌─────────────────────────────────────────┐
│ 🔍  Search products...            [X]  │
└─────────────────────────────────────────┘
    ↑                                ↑
  Icon                          Clear Button
```

### Component Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| value | string | Yes | - | Current search text |
| onChange | Function | Yes | - | Search change handler |
| placeholder | string | No | "Search products..." | Placeholder text |
| debounceMs | number | No | 300 | Debounce delay |
| className | string | No | "" | Additional classes |

### Search Behavior

| User Action | System Response |
|-------------|-----------------|
| Types character | Input updates, debounce timer starts |
| Stops typing | After 300ms, trigger API search |
| Types more | Reset debounce timer |
| Clicks clear | Immediately clear and update |
| Presses Escape | Clear search |
| Presses Enter | Immediate search (bypass debounce) |

### Debounce Implementation

```
Flow:
1. User types "lap"
2. Timer starts (300ms)
3. User types "top" → timer resets
4. User stops typing
5. After 300ms → API call with "laptop"
```

### Styling Specifications

| Element | Tailwind Classes | Purpose |
|---------|------------------|---------|
| Container | `relative flex-1` | Input wrapper |
| Input | `w-full pl-10 pr-10 py-2 border rounded-lg` | Main input |
| Search Icon | `absolute left-3 top-2.5 text-gray-400` | Visual indicator |
| Clear Button | `absolute right-3 top-2.5 text-gray-400 hover:text-gray-600` | Clear action |

### Search Scope

| Field | Searchable | Priority |
|-------|------------|----------|
| Product Name | Yes | High |
| SKU | Yes | High |
| Description | Yes | Medium |
| Category Name | Optional | Low |
| Barcode | Optional | Medium |

### Accessibility Features

| Feature | Implementation |
|---------|----------------|
| Label | aria-label="Search products" |
| Role | role="search" on container |
| Clear Button | aria-label="Clear search" |
| Keyboard | Full keyboard navigation |

### Expected Outcome
- Functional search input with debouncing
- Clear button when text is present
- Responsive design and proper styling
- Optimized API calls through debouncing

### Verification Checklist
- [ ] SearchInput component created
- [ ] Controlled input with value and onChange
- [ ] Search icon displayed on left
- [ ] Clear button appears when text exists
- [ ] Debouncing implemented (300ms default)
- [ ] Clear button clears input and triggers update
- [ ] Proper styling and focus states
- [ ] Accessibility attributes added
- [ ] Component exports properly

---

## Task 19: Create Status Filter

### Overview
Create a StatusFilter dropdown component for filtering products by their status (Active, Draft, Archived). This component provides a select dropdown with predefined status options and visual indicators for each status type.

### Dependencies
- Task 17: Create Product Filters Bar

### Instructions

1. **Create StatusFilter component file**
   - Create component in ProductList directory
   - Can be reusable for other status filters
   - Set up as controlled select component

2. **Define status options**
   - Create array of status options with labels and values
   - All: Show all products (default)
   - Active: Published and available products
   - Draft: Unpublished products
   - Archived: Inactive/archived products

3. **Implement dropdown structure**
   - Use Select component from UI library
   - Display current selection
   - Show dropdown icon (chevron)
   - Open options list on click

4. **Add status badges in dropdown**
   - Show colored badge next to each status option
   - Active: Green badge
   - Draft: Yellow badge
   - Archived: Gray badge
   - All: No badge or neutral badge

5. **Implement selection handler**
   - Update filter state on selection change
   - Trigger filter update through props
   - Update URL search params
   - Close dropdown after selection

6. **Style the dropdown**
   - Match design system styling
   - Apply proper padding and sizing
   - Add hover effects on options
   - Ensure mobile-friendly touch targets

7. **Add keyboard navigation**
   - Arrow keys to navigate options
   - Enter to select
   - Escape to close
   - Tab to move to next filter

### Status Options

| Value | Label | Badge Color | Description |
|-------|-------|-------------|-------------|
| all | All Status | - | Show all products |
| active | Active | Green | Published products |
| draft | Draft | Yellow | Unpublished products |
| archived | Archived | Gray | Archived products |

### Dropdown Structure

```
┌──────────────────────┐
│ Status: All      ▼  │  ← Closed state
└──────────────────────┘

┌──────────────────────┐
│ Status: All      ▲  │
├──────────────────────┤
│ ○ All Status         │  ← Open state
│ ● Active            │
│ ● Draft             │
│ ● Archived          │
└──────────────────────┘
```

### Component Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| value | string | Yes | "all" | Current status filter |
| onChange | Function | Yes | - | Selection change handler |
| className | string | No | "" | Additional classes |

### Status Badge Colors

| Status | Background | Text | Border |
|--------|------------|------|--------|
| Active | bg-green-100 | text-green-800 | border-green-200 |
| Draft | bg-yellow-100 | text-yellow-800 | border-yellow-200 |
| Archived | bg-gray-100 | text-gray-800 | border-gray-200 |

### Filter Behavior

| User Action | System Response |
|-------------|-----------------|
| Clicks dropdown | Show options list |
| Selects option | Update filter, close dropdown |
| Filter changes | Trigger product list refresh |
| Page loads | Apply status from URL param |

### Styling Specifications

| Element | Tailwind Classes | Purpose |
|---------|------------------|---------|
| Select | `border rounded-lg px-3 py-2 min-w-[160px]` | Main dropdown |
| Option | `px-3 py-2 hover:bg-gray-100` | Dropdown items |
| Badge | `inline-block px-2 py-1 text-xs rounded` | Status indicator |

### Expected Outcome
- Functional status filter dropdown
- Visual status badges in options
- Proper selection and filter updates
- Responsive and accessible design

### Verification Checklist
- [ ] StatusFilter component created
- [ ] Four status options defined (All, Active, Draft, Archived)
- [ ] Colored badges displayed for each status
- [ ] Dropdown opens and closes properly
- [ ] Selection updates filter state
- [ ] URL params updated on change
- [ ] Keyboard navigation supported
- [ ] Proper styling applied
- [ ] Component exports properly

---

## Task 20: Create Category Filter

### Overview
Create a CategoryFilter dropdown component for filtering products by their category. This component fetches available categories from the API and displays them in a searchable dropdown, allowing users to filter the product list by a specific category.

### Dependencies
- Task 17: Create Product Filters Bar
- Categories API endpoint available
- useCategories hook (if available)

### Instructions

1. **Create CategoryFilter component file**
   - Create component in ProductList directory
   - Set up as client component (needs API data)
   - Import necessary hooks for data fetching

2. **Fetch categories data**
   - Use useCategories hook or API call
   - Fetch category list on component mount
   - Handle loading and error states
   - Cache categories for performance

3. **Implement dropdown structure**
   - Use Select or Combobox component
   - Display "All Categories" as default option
   - Show category list in dropdown
   - Include search/filter within dropdown (optional)

4. **Add category hierarchy support**
   - Display parent categories
   - Show subcategories with indentation
   - Use tree structure if categories are nested
   - Example: "Electronics > Laptops"

5. **Implement selection handler**
   - Update category filter on selection
   - Clear selection option (All Categories)
   - Trigger product list refresh
   - Update URL search params

6. **Handle empty or loading states**
   - Show loading spinner while fetching
   - Display "No categories" if empty
   - Handle API errors gracefully
   - Provide retry option on error

7. **Add search functionality (optional)**
   - Allow searching categories by name
   - Filter dropdown options as user types
   - Highlight matching text
   - Clear search when dropdown closes

### Category Dropdown Structure

```
┌──────────────────────────┐
│ Category: All        ▼  │  ← Closed state
└──────────────────────────┘

┌──────────────────────────┐
│ Category: All        ▲  │
├──────────────────────────┤
│ All Categories           │  ← Open state
│ Electronics              │
│   ↳ Laptops             │
│   ↳ Phones              │
│ Clothing                 │
│ Food & Beverages         │
└──────────────────────────┘
```

### Component Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| value | string \| null | Yes | null | Selected category ID |
| onChange | Function | Yes | - | Selection change handler |
| categories | Array | No | - | Pre-fetched categories |
| className | string | No | "" | Additional classes |

### Category Data Structure

```
Category {
  id: string
  name: string
  parentId: string | null
  slug: string
  level: number
}
```

### Loading States

| State | Display |
|-------|---------|
| Loading | "Loading categories..." with spinner |
| Error | "Failed to load categories" with retry |
| Empty | "No categories available" |
| Loaded | Category list |

### Hierarchy Display

| Category Level | Display | Indentation |
|----------------|---------|-------------|
| Root | Electronics | None |
| Level 1 | ↳ Laptops | 1rem (ml-4) |
| Level 2 | ↳ Gaming Laptops | 2rem (ml-8) |

### Filter Behavior

| User Action | System Response |
|-------------|-----------------|
| Opens dropdown | Load categories if not cached |
| Selects category | Filter products by category |
| Selects "All" | Clear category filter |
| Types in search | Filter dropdown options |

### API Integration

| Endpoint | Method | Purpose |
|----------|--------|---------|
| /api/categories | GET | Fetch all categories |
| Query Params | - | ?include=children |

### Styling Specifications

| Element | Tailwind Classes | Purpose |
|---------|------------------|---------|
| Select | `border rounded-lg px-3 py-2 min-w-[180px]` | Main dropdown |
| Option | `px-3 py-2 hover:bg-gray-100` | Category items |
| Nested | `ml-4 text-sm text-gray-600` | Subcategories |
| Loading | `flex items-center gap-2 text-gray-500` | Loading state |

### Expected Outcome
- Functional category filter with API integration
- Support for hierarchical categories
- Loading and error handling
- Optional search within categories
- Responsive dropdown design

### Verification Checklist
- [ ] CategoryFilter component created
- [ ] Categories fetched from API
- [ ] "All Categories" default option included
- [ ] Nested categories displayed with hierarchy
- [ ] Loading state shows spinner
- [ ] Error state handled gracefully
- [ ] Selection updates filter state
- [ ] URL params updated on change
- [ ] Optional search functionality working
- [ ] Component exports properly

---

## Task 21: Create Stock Filter

### Overview
Create a StockFilter dropdown component for filtering products by their stock level status. This component provides quick access to filter products by stock availability (All, Low Stock, Out of Stock), helping users identify inventory issues quickly.

### Dependencies
- Task 17: Create Product Filters Bar

### Instructions

1. **Create StockFilter component file**
   - Create component in ProductList directory
   - Set up as controlled select component
   - No API calls needed (static options)

2. **Define stock level options**
   - Create array of stock filter options
   - All: Show all products regardless of stock
   - Low Stock: Products with quantity ≤ threshold (e.g., 10 units)
   - Out of Stock: Products with zero quantity

3. **Implement dropdown structure**
   - Use Select component from UI library
   - Display current selection
   - Show dropdown icon (chevron)
   - Open options list on click

4. **Add stock indicators**
   - Show colored dot next to each option
   - Normal/All: No indicator or blue dot
   - Low Stock: Yellow/amber dot
   - Out of Stock: Red dot
   - Match indicators used in table cells

5. **Implement selection handler**
   - Update stock filter state on selection
   - Trigger filter update through props
   - Update URL search params
   - Close dropdown after selection

6. **Configure threshold values**
   - Accept lowStockThreshold prop (default: 10)
   - Use threshold for "Low Stock" definition
   - Can be configurable from settings
   - Display threshold in option label (optional)

7. **Style the dropdown**
   - Match other filter styling
   - Apply consistent spacing
   - Add hover effects
   - Ensure mobile touch targets

### Stock Filter Options

| Value | Label | Indicator | Logic |
|-------|-------|-----------|-------|
| all | All Stock | - | No stock filter |
| low | Low Stock | 🟡 Yellow | quantity > 0 AND quantity ≤ 10 |
| out | Out of Stock | 🔴 Red | quantity = 0 |

### Dropdown Structure

```
┌──────────────────────┐
│ Stock: All       ▼  │  ← Closed state
└──────────────────────┘

┌──────────────────────┐
│ Stock: All       ▲  │
├──────────────────────┤
│ All Stock            │  ← Open state
│ 🟡 Low Stock         │
│ 🔴 Out of Stock      │
└──────────────────────┘
```

### Component Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| value | string | Yes | "all" | Current stock filter |
| onChange | Function | Yes | - | Selection change handler |
| lowThreshold | number | No | 10 | Low stock threshold |
| className | string | No | "" | Additional classes |

### Stock Level Indicators

| Level | Color | Icon | Usage |
|-------|-------|------|-------|
| Normal | Green | ● | Stock > threshold |
| Low | Yellow | ● | 0 < Stock ≤ threshold |
| Out | Red | ● | Stock = 0 |

### Filter Logic

| Filter Selected | API Query | Result |
|----------------|-----------|---------|
| All Stock | No filter | All products |
| Low Stock | stock_level=low | Products with 1-10 units |
| Out of Stock | stock_level=out | Products with 0 units |

### Business Rules

| Rule | Implementation |
|------|----------------|
| Low Stock Threshold | Configurable (default: 10 units) |
| Multiple Variants | Check total or per-variant stock |
| Reserved Stock | Exclude from available count |

### Styling Specifications

| Element | Tailwind Classes | Purpose |
|---------|------------------|---------|
| Select | `border rounded-lg px-3 py-2 min-w-[160px]` | Main dropdown |
| Option | `px-3 py-2 hover:bg-gray-100 flex items-center gap-2` | Dropdown items |
| Indicator | `w-2 h-2 rounded-full` | Stock level dot |
| Green Dot | `bg-green-500` | Normal stock |
| Yellow Dot | `bg-yellow-500` | Low stock |
| Red Dot | `bg-red-500` | Out of stock |

### Expected Outcome
- Functional stock level filter dropdown
- Visual stock indicators (colored dots)
- Three filter options (All, Low, Out)
- Proper selection and state updates
- Consistent styling with other filters

### Verification Checklist
- [ ] StockFilter component created
- [ ] Three stock options defined
- [ ] Colored indicators displayed
- [ ] Dropdown opens and closes properly
- [ ] Selection updates filter state
- [ ] URL params updated on change
- [ ] Low stock threshold configurable
- [ ] Proper styling applied
- [ ] Component exports properly

---

## Task 22: Create Clear Filters Button

### Overview
Create a Clear Filters button component that resets all active filters to their default state. This component provides users with a quick way to remove all applied filters and return to the unfiltered product list view.

### Dependencies
- Task 17: Create Product Filters Bar
- Tasks 18-21: All filter components

### Instructions

1. **Create ClearFiltersButton component file**
   - Create component in ProductList directory or as part of ProductFilters
   - Can be a simple button component or integrated into filters bar
   - Set up with click handler

2. **Implement button structure**
   - Use Button component from UI library
   - Display "Clear Filters" or "Clear All" text
   - Add X icon or clear icon before text
   - Use secondary or ghost button variant

3. **Add conditional rendering**
   - Only show button when filters are active
   - Hide when no filters applied
   - Check all filter values (search, status, category, stock)
   - Calculate hasActiveFilters boolean

4. **Implement clear functionality**
   - Reset search to empty string
   - Reset status to "all"
   - Reset category to null
   - Reset stock to "all"
   - Trigger filter update through parent component

5. **Update URL parameters**
   - Clear all filter-related search params
   - Remove search, status, category, stock params
   - Keep page and sort params (optional decision)
   - Update browser URL without reload

6. **Add visual feedback**
   - Show loading state during clear action (optional)
   - Display brief confirmation message (optional)
   - Animate button appearance/disappearance
   - Focus on search input after clearing (optional)

7. **Include active filter count**
   - Display number of active filters
   - Example: "Clear 3 Filters"
   - Update count dynamically
   - Position in button text or as badge

### Button Variations

| State | Display | Action |
|-------|---------|--------|
| No filters | Hidden or disabled | No action |
| 1 filter | "Clear Filter" | Reset that filter |
| 2+ filters | "Clear 3 Filters" | Reset all filters |

### Button Structure

```
Hidden State (No Filters)
[Button not visible]

Visible State (Filters Active)
┌─────────────────┐
│ ✕ Clear Filters │
└─────────────────┘
```

### Component Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| onClear | Function | Yes | - | Clear action handler |
| filterCount | number | No | 0 | Number of active filters |
| disabled | boolean | No | false | Disable button |
| className | string | No | "" | Additional classes |

### Active Filter Detection

| Filter | Considered Active When |
|--------|----------------------|
| Search | value.length > 0 |
| Status | value !== "all" |
| Category | value !== null |
| Stock | value !== "all" |

### Clear Action Flow

```
1. User clicks "Clear Filters"
2. Component calls onClear handler
3. Parent resets all filter states
4. URL params cleared
5. Product list refreshes with no filters
6. Button hides (no active filters)
```

### Styling Specifications

| Element | Tailwind Classes | Purpose |
|---------|------------------|---------|
| Button | `text-gray-700 hover:text-gray-900` | Secondary style |
| Icon | `w-4 h-4 mr-1` | Clear icon size |
| Badge | `ml-1 px-2 py-0.5 bg-blue-100 text-blue-800 rounded-full text-xs` | Filter count |

### Button Variants

| Variant | Style | Use Case |
|---------|-------|----------|
| Text Only | No background | Minimal design |
| Outlined | Border, no fill | Standard design |
| Ghost | Subtle hover | Modern design |

### Accessibility Features

| Feature | Implementation |
|---------|----------------|
| Button Label | aria-label="Clear all filters" |
| Keyboard | Activatable with Enter/Space |
| Focus | Visible focus indicator |
| Screen Reader | Announce filter count |

### Expected Outcome
- Functional clear filters button
- Only visible when filters are active
- Resets all filters to default state
- Updates URL parameters
- Smooth appearance/disappearance

### Verification Checklist
- [ ] Clear Filters button component created
- [ ] Button only visible when filters active
- [ ] Click handler resets all filters
- [ ] URL parameters cleared properly
- [ ] Filter count displayed (optional)
- [ ] Proper button styling applied
- [ ] Smooth show/hide animation
- [ ] Accessibility features implemented
- [ ] Component exports properly

---

## Summary

This document established the foundation of the product listing interface, including the main list page component, header with action buttons, and a comprehensive filtering system. The filter bar includes search, status, category, and stock level filters, plus a clear filters button for easy reset.

### Completed Tasks
1. ✓ Created ProductList page component with layout structure
2. ✓ Created ProductListHeader with title and Create button
3. ✓ Created ProductFilters container for filter controls
4. ✓ Created SearchInput with debouncing functionality
5. ✓ Created StatusFilter dropdown with visual badges
6. ✓ Created CategoryFilter dropdown with API integration
7. ✓ Created StockFilter dropdown with level indicators
8. ✓ Created Clear Filters button with conditional rendering

### Next Steps
Proceed to [02_Tasks-23-34_DataTable-BulkActions.md](02_Tasks-23-34_DataTable-BulkActions.md) to create the product data table with TanStack Table, implement column definitions, add sorting and pagination, create row selection, and build bulk actions functionality.

---

## Key Integration Points

### State Management
```
ProductList (Parent)
├── filterState: { search, status, category, stock }
├── paginationState: { page, pageSize }
├── sortingState: { sortBy, sortOrder }
└── selectedRows: string[]

Passed to:
├── ProductListHeader
├── ProductFilters
│   ├── SearchInput
│   ├── StatusFilter
│   ├── CategoryFilter
│   ├── StockFilter
│   └── ClearFiltersButton
└── ProductTable (Next Document)
```

### URL State Synchronization
```
URL Parameters:
?search=laptop
&status=active
&category=electronics
&stock=low
&page=2
&sort=name
&order=asc
```

### Component Hierarchy
```
ProductList/
├── ProductList.tsx (Main Container)
├── ProductListHeader.tsx (Title + Actions)
├── ProductFilters.tsx (Filter Bar Container)
│   ├── SearchInput (Integrated or Separate)
│   ├── StatusFilter (Integrated or Separate)
│   ├── CategoryFilter (Integrated or Separate)
│   ├── StockFilter (Integrated or Separate)
│   └── ClearFiltersButton (Integrated or Separate)
├── ProductTable.tsx (Next Document)
└── index.ts (Barrel Export)
```

### Filter State Flow Diagram

```
┌─────────────────────────────────────────────┐
│           User Interaction                   │
│  (Type, Select, Click Clear)                │
└──────────────────┬──────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────┐
│         Filter Component                     │
│  (SearchInput, StatusFilter, etc.)          │
└──────────────────┬──────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────┐
│         onChange Handler                     │
│  (Passed from Parent)                       │
└──────────────────┬──────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────┐
│         Update Filter State                  │
│  (ProductList Component)                    │
└──────────────────┬──────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────┐
│         Update URL Params                    │
│  (useSearchParams)                          │
└──────────────────┬──────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────┐
│         Trigger API Call                     │
│  (useProducts Hook)                         │
└──────────────────┬──────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────┐
│         Update Product List                  │
│  (ProductTable Component)                   │
└─────────────────────────────────────────────┘
```
