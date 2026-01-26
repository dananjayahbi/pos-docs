# Tasks 15-26: Customer List & Filters

> **Phase:** 07 - Frontend Infrastructure & ERP Dashboard  
> **SubPhase:** 12 - Customer & Vendor UI  
> **Group:** B - Customer Listing & Filters  
> **Document:** 01 of 02  
> **Tasks Covered:** 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **→ Next Document:** [02_Tasks-27-32_Table-API.md](02_Tasks-27-32_Table-API.md)

---

## Document Overview

This document covers the creation of the customer listing page with header, summary cards showing key metrics, and comprehensive filtering capabilities. It establishes the main interface for viewing and managing all customers with search, status, type, and credit filters.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 15 | Create Customers List Page | Low | 20 min |
| 16 | Create Customers Header | Low | 15 min |
| 17 | Create Customer Summary Cards | Medium | 30 min |
| 18 | Create Total Customers Card | Low | 15 min |
| 19 | Create Active Customers Card | Low | 15 min |
| 20 | Create Credit Outstanding Card | Low | 15 min |
| 21 | Create Customer Filters Bar | Low | 20 min |
| 22 | Create Customer Search | Low | 15 min |
| 23 | Create Status Filter | Low | 15 min |
| 24 | Create Type Filter | Low | 15 min |
| 25 | Create Credit Status Filter | Low | 15 min |
| 26 | Create Customers Table | Medium | 40 min |

---

## Task 15: Create Customers List Page

### Overview
Create the main CustomersList component that serves as the container for the entire customers page. This component orchestrates all child components including header, summary cards, filters, and data table. It manages the overall page state and layout.

### Dependencies
- Group A (Task 14): Route structure verified
- SubPhase-05: Form components available
- SubPhase-04: UI components available

### Instructions

1. **Create component file**
   - Navigate to `frontend/components/modules/crm/Customers/` directory
   - Create directory structure if not exists
   - Create new file `CustomersList.tsx`

2. **Import required dependencies**
   - Import React and state management hooks
   - Import child components (header, cards, filters, table)
   - Import useCustomers hook from TanStack Query

3. **Define component structure**
   - Create functional component CustomersList
   - Set up state for filters (search, status, type, credit)
   - Initialize TanStack Query data fetching
   - Define loading and error states

4. **Create page layout**
   - Use consistent page container
   - Add proper spacing between sections
   - Ensure responsive design
   - Set up proper grid/flex layout

5. **Compose child components**
   - Add CustomersHeader at top
   - Place CustomerSummaryCards below header
   - Add CustomerFilters below cards
   - Place CustomersTable at bottom
   - Pass necessary props to each child

6. **Handle page state**
   - Manage filter state centrally
   - Pass filter handlers to children
   - Coordinate loading states
   - Handle errors gracefully

### Component Structure

```
CustomersList
├── CustomersHeader (Task 16)
├── CustomerSummaryCards (Task 17)
│   ├── TotalCustomersCard (Task 18)
│   ├── ActiveCustomersCard (Task 19)
│   └── CreditOutstandingCard (Task 20)
├── CustomerFilters (Task 21)
│   ├── CustomerSearch (Task 22)
│   ├── StatusFilter (Task 23)
│   ├── TypeFilter (Task 24)
│   └── CreditStatusFilter (Task 25)
└── CustomersTable (Task 26)
```

### State Management

| State Variable | Type | Purpose |
|----------------|------|---------|
| searchQuery | string | Customer search text |
| statusFilter | string | Active/Inactive filter |
| typeFilter | string | Customer type filter |
| creditFilter | string | Credit status filter |
| sortConfig | object | Table sorting state |

### Expected Outcome
- Main customers list component created
- Layout structure established
- State management configured
- Child components integrated
- Page ready for data display

### Verification Checklist
- [ ] CustomersList.tsx file created
- [ ] Component exports as default
- [ ] Layout renders correctly
- [ ] State management works
- [ ] Responsive design implemented

---

## Task 16: Create Customers Header

### Overview
Create the CustomersHeader component displaying the page title and action buttons. This header includes the "Customers" title and a prominent "Add Customer" button that navigates to the new customer form.

### Dependencies
- Task 15: Create Customers List Page

### Instructions

1. **Create component file**
   - Navigate to `frontend/components/modules/crm/Customers/` directory
   - Create new file `CustomersHeader.tsx`

2. **Import required dependencies**
   - Import Button component from UI library
   - Import Plus icon from icon library
   - Import Link or useRouter for navigation

3. **Define component structure**
   - Create functional component CustomersHeader
   - No props needed (static content)
   - Use semantic HTML structure

4. **Create header layout**
   - Use flex container for alignment
   - Place title on the left
   - Place action button on the right
   - Ensure responsive behavior

5. **Implement title section**
   - Use h1 heading for "Customers"
   - Apply consistent typography styles
   - Add proper semantic markup

6. **Implement action button**
   - Create "Add Customer" button with Plus icon
   - Set up navigation to /customers/new
   - Style as primary action button
   - Ensure accessibility

### Header Layout

```
┌─────────────────────────────────────────────┐
│ Customers                    [+ Add Customer]│
└─────────────────────────────────────────────┘

Components:
├── Title: "Customers" (h1)
└── Action Button: Link to /customers/new
```

### Responsive Behavior

| Breakpoint | Layout |
|------------|--------|
| Desktop | Title left, button right (flex-row) |
| Tablet | Same as desktop |
| Mobile | Stack vertically with full-width button |

### Expected Outcome
- Header component displays title and button
- Navigation to new customer page works
- Responsive layout functions correctly
- Consistent with other ERP page headers

### Verification Checklist
- [ ] CustomersHeader.tsx file created
- [ ] Title renders correctly
- [ ] Add button navigates to /customers/new
- [ ] Responsive design works
- [ ] Matches design system styles

---

## Task 17: Create Customer Summary Cards

### Overview
Create the CustomerSummaryCards container component that displays three metric cards showing total customers, active customers, and credit outstanding. This component fetches summary statistics and passes data to individual card components.

### Dependencies
- Task 15: Create Customers List Page
- Task 16: Create Customers Header

### Instructions

1. **Create component file**
   - Navigate to `frontend/components/modules/crm/Customers/` directory
   - Create new file `CustomerSummaryCards.tsx`

2. **Import required dependencies**
   - Import individual card components
   - Import useCustomerStats hook
   - Import loading skeleton components

3. **Define component structure**
   - Create functional component CustomerSummaryCards
   - Fetch customer statistics
   - Handle loading and error states
   - Pass data to child cards

4. **Create card grid layout**
   - Use CSS Grid with 3 columns
   - Ensure responsive behavior (1 col mobile, 2 col tablet, 3 col desktop)
   - Add consistent spacing between cards
   - Set equal card heights

5. **Fetch summary statistics**
   - Use TanStack Query to fetch stats
   - Query endpoint: /api/customers/stats
   - Handle loading state with skeletons
   - Handle error state with fallback

6. **Pass data to cards**
   - Total customers count to TotalCustomersCard
   - Active customers count to ActiveCustomersCard
   - Credit outstanding amount to CreditOutstandingCard

### Grid Layout

```
┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│ 👥           │  │ ✓            │  │ 💳           │
│ Total        │  │ Active       │  │ Credit       │
│ Customers    │  │ Customers    │  │ Outstanding  │
│              │  │              │  │              │
│    450       │  │    420       │  │  ₨1,234,500 │
│              │  │              │  │              │
│ +12 from     │  │ +5 from      │  │ +₨50K from  │
│ last month   │  │ last month   │  │ last month   │
└──────────────┘  └──────────────┘  └──────────────┘
```

### Responsive Grid

| Breakpoint | Columns | Gap |
|------------|---------|-----|
| Desktop (>1024px) | 3 | 24px |
| Tablet (768-1024px) | 2 | 16px |
| Mobile (<768px) | 1 | 16px |

### Statistics API Response

```
{
  total: 450,
  active: 420,
  inactive: 30,
  creditOutstanding: 1234500,
  totalSpent: 15600000,
  averageOrderValue: 34666
}
```

### Expected Outcome
- Summary cards container created
- Grid layout responsive
- Statistics fetched from API
- Loading states handled
- Data passed to individual cards

### Verification Checklist
- [ ] CustomerSummaryCards.tsx file created
- [ ] Grid layout renders correctly
- [ ] Statistics API called
- [ ] Loading skeletons display
- [ ] Data passes to child cards
- [ ] Responsive design works

---

## Task 18: Create Total Customers Card

### Overview
Create the TotalCustomersCard component that displays the total count of all customers in the system with a trend indicator showing the change from the previous period.

### Dependencies
- Task 17: Create Customer Summary Cards

### Instructions

1. **Create component file**
   - Navigate to `frontend/components/modules/crm/Customers/` directory
   - Create new file `TotalCustomersCard.tsx`

2. **Import required dependencies**
   - Import Card component from UI library
   - Import Users icon
   - Import TrendUp/TrendDown icons
   - Import number formatting utilities

3. **Define component props**
   - total: number (total customer count)
   - trend: object (change amount and percentage)
   - Optional: loading state

4. **Create card structure**
   - Use Card component as container
   - Add icon header (Users icon)
   - Display metric label "Total Customers"
   - Show large number for count
   - Add trend indicator at bottom

5. **Format numbers**
   - Use comma separators for thousands
   - Display trend as "+12" or "-5"
   - Show percentage if available
   - Format with appropriate color

6. **Style trend indicator**
   - Green for positive trends
   - Red for negative trends
   - Gray for no change
   - Include arrow icon

### Card Layout

```
┌────────────────────────┐
│ 👥                     │
│                        │
│ Total Customers        │
│                        │
│        450             │
│                        │
│ ↗ +12 from last month │
│   (2.7% increase)      │
└────────────────────────┘
```

### Component Props

| Prop | Type | Description |
|------|------|-------------|
| total | number | Total customer count |
| trend | {amount: number, percent: number} | Change from previous period |
| loading | boolean | Loading state (optional) |

### Expected Outcome
- Total customers card displays count
- Trend indicator shows change
- Colors reflect positive/negative trends
- Card matches design system

### Verification Checklist
- [ ] TotalCustomersCard.tsx file created
- [ ] Card displays total count
- [ ] Trend indicator works
- [ ] Colors applied correctly
- [ ] Numbers formatted properly

---

## Task 19: Create Active Customers Card

### Overview
Create the ActiveCustomersCard component that displays the count of active customers (customers with active status) with a trend indicator.

### Dependencies
- Task 17: Create Customer Summary Cards

### Instructions

1. **Create component file**
   - Navigate to `frontend/components/modules/crm/Customers/` directory
   - Create new file `ActiveCustomersCard.tsx`

2. **Import required dependencies**
   - Import Card component
   - Import UserCheck icon
   - Import trend icons and utilities

3. **Define component props**
   - active: number (active customer count)
   - trend: object (change from previous period)
   - total: number (for percentage calculation)

4. **Create card structure**
   - Similar to Task 18 structure
   - Use UserCheck icon
   - Label as "Active Customers"
   - Display active count
   - Show trend and percentage of total

5. **Calculate percentage**
   - Calculate active/total percentage
   - Display as "(93% of total)"
   - Format with one decimal place

6. **Apply styling**
   - Use success/green theme colors
   - Match card design system
   - Ensure consistency with other cards

### Card Layout

```
┌────────────────────────┐
│ ✓                      │
│                        │
│ Active Customers       │
│                        │
│        420             │
│    (93% of total)      │
│                        │
│ ↗ +5 from last month  │
└────────────────────────┘
```

### Component Props

| Prop | Type | Description |
|------|------|-------------|
| active | number | Active customer count |
| total | number | Total customers (for %) |
| trend | {amount: number, percent: number} | Change indicator |

### Expected Outcome
- Active customers card displays count
- Percentage of total calculated
- Trend indicator functional
- Success/green theme applied

### Verification Checklist
- [ ] ActiveCustomersCard.tsx file created
- [ ] Active count displays correctly
- [ ] Percentage calculation works
- [ ] Trend indicator shows change
- [ ] Styling matches design system

---

## Task 20: Create Credit Outstanding Card

### Overview
Create the CreditOutstandingCard component that displays the total amount of credit outstanding across all customers in Sri Lankan Rupees (LKR) with trend information.

### Dependencies
- Task 17: Create Customer Summary Cards

### Instructions

1. **Create component file**
   - Navigate to `frontend/components/modules/crm/Customers/` directory
   - Create new file `CreditOutstandingCard.tsx`

2. **Import required dependencies**
   - Import Card component
   - Import CreditCard icon
   - Import currency formatting utilities
   - Import trend components

3. **Define component props**
   - amount: number (credit outstanding in LKR)
   - trend: object (change from previous period)
   - Optional: creditLimit for utilization

4. **Create card structure**
   - Use CreditCard icon
   - Label as "Credit Outstanding"
   - Display formatted currency amount
   - Show trend in currency format
   - Optional: show credit utilization bar

5. **Format currency**
   - Use LKR currency format: ₨1,234,500
   - Use appropriate decimal places
   - Handle large numbers with K/M abbreviations
   - Maintain readability

6. **Style with warning colors**
   - Use warning/amber theme for high amounts
   - Consider threshold-based coloring
   - Ensure visibility and contrast

### Card Layout

```
┌────────────────────────┐
│ 💳                     │
│                        │
│ Credit Outstanding     │
│                        │
│    ₨1,234,500         │
│                        │
│ ↗ +₨50,000           │
│   from last month      │
└────────────────────────┘
```

### Currency Formatting

| Amount | Display |
|--------|---------|
| 1234 | ₨1,234 |
| 1234500 | ₨1,234,500 or ₨1.23M |
| 50000 | ₨50,000 or ₨50K |

### Component Props

| Prop | Type | Description |
|------|------|-------------|
| amount | number | Outstanding amount in LKR |
| trend | {amount: number, percent: number} | Change indicator |
| creditLimit | number | Total credit limit (optional) |

### Expected Outcome
- Credit outstanding card displays amount
- LKR currency properly formatted
- Trend shows change in currency
- Warning theme applied appropriately

### Verification Checklist
- [ ] CreditOutstandingCard.tsx file created
- [ ] Currency formatting correct (LKR)
- [ ] Amount displays with ₨ symbol
- [ ] Trend indicator shows change
- [ ] Styling uses warning colors

---

## Task 21: Create Customer Filters Bar

### Overview
Create the CustomerFilters component that serves as a container for all filter controls. This toolbar allows users to filter customers by search query, status, type, and credit status.

### Dependencies
- Task 17: Create Customer Summary Cards

### Instructions

1. **Create component file**
   - Navigate to `frontend/components/modules/crm/Customers/` directory
   - Create new file `CustomerFilters.tsx`

2. **Import required dependencies**
   - Import individual filter components
   - Import state management hooks
   - Import filter icons

3. **Define component props**
   - onSearchChange: callback for search
   - onStatusChange: callback for status filter
   - onTypeChange: callback for type filter
   - onCreditChange: callback for credit filter
   - currentFilters: object with current values

4. **Create filter bar layout**
   - Use horizontal flex container
   - Place search on the left
   - Place dropdowns on the right
   - Ensure responsive wrapping
   - Add clear filters button

5. **Compose filter components**
   - Add CustomerSearch (Task 22)
   - Add StatusFilter (Task 23)
   - Add TypeFilter (Task 24)
   - Add CreditStatusFilter (Task 25)
   - Connect each to parent state

6. **Add clear filters action**
   - Show when filters are active
   - Clear all filters at once
   - Display active filter count badge

### Filter Bar Layout

```
┌─────────────────────────────────────────────┐
│ 🔍 Search...  [Status▼] [Type▼] [Credit▼]  │
│                              [Clear Filters] │
└─────────────────────────────────────────────┘

Responsive (Mobile):
┌─────────────────────────┐
│ 🔍 Search...            │
├─────────────────────────┤
│ [Status▼] [Type▼]      │
│ [Credit▼] [Clear (3)]   │
└─────────────────────────┘
```

### Filter Props Interface

```
interface CustomerFiltersProps {
  onSearchChange: (query: string) => void;
  onStatusChange: (status: string) => void;
  onTypeChange: (type: string) => void;
  onCreditChange: (credit: string) => void;
  currentFilters: {
    search: string;
    status: string;
    type: string;
    credit: string;
  };
}
```

### Expected Outcome
- Filter bar container created
- All filter controls integrated
- State management connected
- Clear filters functionality works
- Responsive layout implemented

### Verification Checklist
- [ ] CustomerFilters.tsx file created
- [ ] Filter controls render correctly
- [ ] Callbacks work properly
- [ ] Clear filters button functional
- [ ] Responsive design works

---

## Task 22: Create Customer Search

### Overview
Create the CustomerSearch component providing a text input for searching customers by name, phone, or email. Features debounced input and search icon.

### Dependencies
- Task 21: Create Customer Filters Bar

### Instructions

1. **Create component file**
   - Navigate to `frontend/components/modules/crm/Customers/` directory
   - Create new file `CustomerSearch.tsx` (or inline in filters)

2. **Import required dependencies**
   - Import Input component
   - Import Search icon
   - Import debounce utility

3. **Define component props**
   - value: current search query
   - onChange: callback for search change
   - placeholder: search hint text

4. **Implement search input**
   - Use Input component with left icon
   - Add Search icon on left side
   - Set placeholder text
   - Configure input type and autocomplete

5. **Add debounce logic**
   - Debounce search input by 300ms
   - Prevent excessive API calls
   - Provide instant visual feedback
   - Clear debounce on unmount

6. **Add clear button**
   - Show X icon when input has value
   - Clear search on click
   - Maintain input focus

### Search Input Design

```
┌─────────────────────────┐
│ 🔍 Search customers...  │
└─────────────────────────┘

With Value:
┌─────────────────────────┐
│ 🔍 john silva        ✕ │
└─────────────────────────┘
```

### Component Props

| Prop | Type | Description |
|------|------|-------------|
| value | string | Current search query |
| onChange | (value: string) => void | Change handler |
| placeholder | string | Placeholder text |

### Debounce Configuration

| Setting | Value |
|---------|-------|
| Delay | 300ms |
| Trailing | true |
| Leading | false |

### Expected Outcome
- Search input renders with icon
- Debounced input prevents excessive calls
- Clear button works
- Placeholder text guides users

### Verification Checklist
- [ ] Search input component created
- [ ] Search icon displays on left
- [ ] Debounce works (300ms delay)
- [ ] Clear button functional
- [ ] Styling matches design system

---

## Task 23: Create Status Filter

### Overview
Create the StatusFilter dropdown component allowing users to filter customers by their active/inactive status.

### Dependencies
- Task 21: Create Customer Filters Bar

### Instructions

1. **Create component file**
   - Create inline or separate component
   - Location: within CustomerFilters

2. **Import required dependencies**
   - Import Select component
   - Import status options

3. **Define filter options**
   - All (no filter)
   - Active
   - Inactive

4. **Implement dropdown**
   - Use Select component
   - Display current selection
   - Handle selection change
   - Pass to parent callback

5. **Style dropdown**
   - Match design system
   - Show active state
   - Display option labels clearly

### Status Filter Options

| Label | Value | Description |
|-------|-------|-------------|
| All Statuses | "" | Show all customers |
| Active | "active" | Only active customers |
| Inactive | "inactive" | Only inactive customers |

### Dropdown UI

```
┌──────────────┐
│ Status    ▼ │
└──────────────┘

Opened:
┌──────────────┐
│ Status    ▲ │
├──────────────┤
│ All Statuses │
│ Active       │
│ Inactive     │
└──────────────┘
```

### Expected Outcome
- Status filter dropdown functional
- Options display correctly
- Selection updates filter state
- UI matches design system

### Verification Checklist
- [ ] Status filter dropdown created
- [ ] Options render correctly
- [ ] Selection works
- [ ] Callback triggers properly

---

## Task 24: Create Type Filter

### Overview
Create the TypeFilter dropdown component allowing users to filter customers by their business type (Individual, Business, Wholesale).

### Dependencies
- Task 21: Create Customer Filters Bar

### Instructions

1. **Create filter component**
   - Create inline or separate component
   - Location: within CustomerFilters

2. **Import required dependencies**
   - Import Select component
   - Import type options

3. **Define filter options**
   - All (no filter)
   - Individual
   - Business
   - Wholesale

4. **Implement dropdown**
   - Use Select component
   - Display current selection
   - Handle selection change
   - Pass to parent callback

### Type Filter Options

| Label | Value | Description |
|-------|-------|-------------|
| All Types | "" | Show all customer types |
| Individual | "individual" | Individual customers |
| Business | "business" | Business customers |
| Wholesale | "wholesale" | Wholesale customers |

### Expected Outcome
- Type filter dropdown functional
- All type options available
- Selection updates filter state

### Verification Checklist
- [ ] Type filter dropdown created
- [ ] Options render correctly
- [ ] Selection triggers callback
- [ ] Styling consistent

---

## Task 25: Create Credit Status Filter

### Overview
Create the CreditStatusFilter dropdown allowing users to filter customers by their credit status (no credit, good standing, near limit, over limit).

### Dependencies
- Task 21: Create Customer Filters Bar

### Instructions

1. **Create filter component**
   - Create inline or separate component
   - Location: within CustomerFilters

2. **Define filter options**
   - All (no filter)
   - No Credit
   - Good Standing
   - Near Limit
   - Over Limit

3. **Implement dropdown**
   - Use Select component
   - Add color indicators for status
   - Handle selection change

4. **Add status indicators**
   - Green dot for Good Standing
   - Yellow dot for Near Limit
   - Red dot for Over Limit
   - Gray for No Credit

### Credit Status Options

| Label | Value | Indicator | Description |
|-------|-------|-----------|-------------|
| All Credit Status | "" | - | Show all |
| No Credit | "no_credit" | ⚪ Gray | No credit terms |
| Good Standing | "good" | 🟢 Green | Below 70% limit |
| Near Limit | "near_limit" | 🟡 Yellow | 70-100% of limit |
| Over Limit | "over_limit" | 🔴 Red | Above limit |

### Expected Outcome
- Credit status filter dropdown functional
- Status indicators display colors
- Selection updates filter state

### Verification Checklist
- [ ] Credit filter dropdown created
- [ ] Status indicators show colors
- [ ] Options render correctly
- [ ] Selection triggers callback

---

## Task 26: Create Customers Table

### Overview
Create the CustomersTable component using TanStack Table to display customer data in a sortable, paginated table. This is the main data display component for the customers list page.

### Dependencies
- Task 21: Create Customer Filters Bar
- TanStack Table library installed

### Instructions

1. **Create component file**
   - Navigate to `frontend/components/modules/crm/Customers/` directory
   - Create new file `CustomersTable.tsx`

2. **Import required dependencies**
   - Import TanStack Table components and hooks
   - Import table UI components
   - Import CustomerTableColumns (Task 27)
   - Import pagination components

3. **Define component props**
   - data: customer array
   - loading: boolean
   - pagination: pagination state
   - sorting: sorting state
   - onPaginationChange: callback
   - onSortingChange: callback

4. **Initialize TanStack Table**
   - Use useReactTable hook
   - Configure columns from CustomerTableColumns
   - Set up sorting state
   - Configure pagination
   - Enable row selection if needed

5. **Create table structure**
   - Render table header with sortable columns
   - Render table body with customer rows
   - Add loading skeleton overlay
   - Add empty state for no results
   - Include pagination controls

6. **Implement sorting**
   - Enable column sorting
   - Show sort indicators (arrows)
   - Handle sort state changes
   - Pass sorting to API query

7. **Implement pagination**
   - Show page size selector (10, 25, 50, 100)
   - Add page navigation (prev, next, page numbers)
   - Display result count
   - Handle page changes

8. **Add row interactions**
   - Make rows clickable to navigate to details
   - Add hover states
   - Handle row selection (optional)

### Table Structure

```
┌─────────────────────────────────────────────────────────┐
│ Name ↓   Phone        Email        Orders  Balance  ... │
├─────────────────────────────────────────────────────────┤
│ John S   0771234567   john@ex.lk   45     ₨125,000  [⋮]│
│ Mary P   0772345678   mary@ex.lk   32     ₨98,000   [⋮]│
│ David F  0773456789   david@ex.lk  28     ₨156,000  [⋮]│
│ ...                                                     │
├─────────────────────────────────────────────────────────┤
│ Showing 1-10 of 450  [10 per page▼] [← 1 2 3 ... 45 →]│
└─────────────────────────────────────────────────────────┘
```

### Table Columns Overview

| Column | Width | Sortable | Content |
|--------|-------|----------|---------|
| Name | 200px | Yes | Customer name |
| Phone | 140px | No | Phone number |
| Email | 200px | No | Email address |
| Orders | 80px | Yes | Order count |
| Balance (LKR) | 120px | Yes | Outstanding balance |
| Status | 100px | Yes | Active/Inactive badge |
| Actions | 80px | No | Action menu |

### TanStack Table Configuration

```
Table Config:
├── columns: from CustomerTableColumns
├── data: customers array
├── state:
│   ├── sorting
│   └── pagination
├── onSortingChange
├── onPaginationChange
├── getCoreRowModel
├── getSortedRowModel
└── getPaginationRowModel
```

### Expected Outcome
- Customers table displays data
- Sorting works on sortable columns
- Pagination controls functional
- Loading states handled
- Empty state displays when no data
- Row interactions work

### Verification Checklist
- [ ] CustomersTable.tsx file created
- [ ] TanStack Table initialized
- [ ] Columns render correctly
- [ ] Sorting functionality works
- [ ] Pagination controls functional
- [ ] Loading states display
- [ ] Empty state shows when no data
- [ ] Row click navigation works

---

## Summary

This document established the customer listing page with header, summary cards, and comprehensive filtering capabilities. The following components were created:

### Page Structure
- CustomersList - Main page container
- CustomersHeader - Title and actions
- CustomerSummaryCards - Statistics display

### Summary Cards
- TotalCustomersCard - Total count with trend
- ActiveCustomersCard - Active count with percentage
- CreditOutstandingCard - Outstanding credit in LKR

### Filtering
- CustomerFilters - Filter toolbar container
- CustomerSearch - Debounced search input
- StatusFilter - Active/Inactive filter
- TypeFilter - Customer type filter
- CreditStatusFilter - Credit status filter

### Data Display
- CustomersTable - Main data table with TanStack Table

The next document will complete the table columns, actions, and API integration.
