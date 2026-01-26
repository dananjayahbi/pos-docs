# Tasks 17-27: Employee List, Cards & Table View

> **Phase:** 07 - Frontend Infrastructure & ERP Dashboard  
> **SubPhase:** 13 - HR & Payroll UI  
> **Group:** B - Employee Management  
> **Document:** 01 of 02  
> **Tasks Covered:** 17-27

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** None (First Document) | **Previous Group:** [Group-A_HR-Routes-Pages-Structure](../Group-A_HR-Routes-Pages-Structure/)
- **→ Next Document:** [02_Tasks-28-34_Profile-OrgChart.md](02_Tasks-28-34_Profile-OrgChart.md)
- **⊚ SubPhase Tasks:** [00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)

---

## Document Overview

This document builds the complete employee directory interface with dual view modes. Creates the main employee list page with header and action buttons. Implements summary cards showing employee statistics. Builds comprehensive filter system with search, department, and status filters. Creates employee cards grid view with photo avatars and employee information. Implements alternative table view for detailed data display. Adds view toggle to switch between card and table layouts.

### Tasks in This Document

| Task # | Task Name | Complexity | Dependencies |
|--------|-----------|------------|--------------|
| 17 | Create Employees List Page | Low | Task 16 |
| 18 | Create Employees Header | Low | Task 17 |
| 19 | Create Employee Summary Cards | Medium | Task 17 |
| 20 | Create Employee Filters | Low | Task 17 |
| 21 | Create Department Filter | Low | Task 20 |
| 22 | Create Status Filter | Low | Task 20 |
| 23 | Create Employee Cards Grid | Medium | Task 17 |
| 24 | Create Employee Card Component | Medium | Task 23 |
| 25 | Create Employee Avatar | Low | Task 24 |
| 26 | Create Employees Table View | Medium | Task 17 |
| 27 | Create View Toggle | Low | Task 26 |

---

## Task 17: Create Employees List Page

### Overview

Build the main employees list page component that serves as the container for the employee directory. This component manages the overall layout, state management for view mode, filtering, and data fetching for the employee list.

### Dependencies

- **Requires:** Task 16 (route structure verified)
- **Blocks:** Tasks 18-27 (all list page components)

### Instructions

**Step 1: Define Page Component Structure**

The page component should manage:

| Responsibility | Description |
|----------------|-------------|
| Data Fetching | Load employee data from API |
| State Management | View mode, filters, search, pagination |
| Layout Structure | Header, filters, content, pagination |
| View Switching | Toggle between cards and table |

**Step 2: Define State Management**

State variables needed:

| State | Type | Purpose |
|-------|------|---------|
| employees | Array | Employee data list |
| viewMode | string | 'cards' or 'table' |
| searchTerm | string | Search filter value |
| departmentFilter | string | Selected department |
| statusFilter | string | Selected status |
| page | number | Current page number |
| loading | boolean | Data loading state |

**Step 3: Page Layout Structure**

```
┌─────────────────────────────────────────────────────┐
│  [EmployeesHeader]                                  │
│  - Title: "Employees"                               │
│  - Button: [+ Add Employee]                         │
├─────────────────────────────────────────────────────┤
│  [EmployeeSummaryCards]                             │
│  - Total Employees | Active | Departments           │
├─────────────────────────────────────────────────────┤
│  [EmployeeFilters]                                  │
│  - Search | Department Filter | Status Filter       │
│  - View Toggle (Cards/Table)                        │
├─────────────────────────────────────────────────────┤
│                                                     │
│  [EmployeeCardsGrid] or [EmployeesTableView]        │
│  - Conditional rendering based on viewMode          │
│                                                     │
├─────────────────────────────────────────────────────┤
│  [Pagination]                                       │
│  - Page controls                                    │
└─────────────────────────────────────────────────────┘
```

**Step 4: Data Flow Diagram**

```
[Component Mount]
      │
      ├──> Initialize State
      │    ├── viewMode: 'cards'
      │    ├── filters: {}
      │    └── page: 1
      │
      ├──> Fetch Employees
      │    └── GET /api/employees
      │
      ├──> Apply Filters
      │    ├── Search filter
      │    ├── Department filter
      │    └── Status filter
      │
      └──> Render View
           ├── Cards View
           └── Table View
```

**Step 5: Filter Logic Flow**

```
Filter Application:
  │
  ├──> Original Employee List (50 employees)
  │
  ├──> Apply Search Filter
  │    └── Filter by name/email/ID
  │         (45 employees)
  │
  ├──> Apply Department Filter
  │    └── Filter by selected department
  │         (30 employees)
  │
  ├──> Apply Status Filter
  │    └── Filter by active/inactive
  │         (28 employees)
  │
  └──> Apply Pagination
       └── Show 12 per page
            (Page 1: 12 employees)
```

**Step 6: Employee Data Structure**

Expected employee object structure:

| Field | Type | Description |
|-------|------|-------------|
| id | string | Unique identifier |
| employeeCode | string | Employee code (e.g., EMP001) |
| firstName | string | First name |
| lastName | string | Last name |
| email | string | Email address |
| phone | string | Phone number (+94) |
| position | string | Job title |
| department | string | Department name |
| status | string | 'active' or 'inactive' |
| joinDate | string | Date joined (ISO format) |
| photo | string | Photo URL or null |
| salary | number | Basic salary (LKR) |

### Expected Outcome

Employees list page component created with proper state management, data fetching, and layout structure. Page conditionally renders cards or table view based on user preference. Filters apply correctly to narrow down employee list.

### Verification Checklist

- [ ] Page component created and exported
- [ ] State management implemented
- [ ] Data fetching from API working
- [ ] Layout structure matches design
- [ ] View mode switching functional

---

## Task 18: Create Employees Header

### Overview

Build the header component for the employees page displaying the page title and primary action button for adding new employees. The header is consistent with other ERP module headers.

### Dependencies

- **Requires:** Task 17 (employees list page)
- **Blocks:** None (independent component)

### Instructions

**Step 1: Define Header Structure**

The header should contain:

| Element | Purpose |
|---------|---------|
| Title | Display "Employees" |
| Breadcrumbs | Show navigation path |
| Add Button | Navigate to new employee form |
| Action Menu | Additional actions dropdown |

**Step 2: Header Layout**

```
┌─────────────────────────────────────────────────────┐
│  Employees                           [+ Add Employee]│
│  Dashboard / HR / Employees                         │
└─────────────────────────────────────────────────────┘
```

**Step 3: Button Specifications**

Add Employee button properties:

| Property | Value |
|----------|-------|
| Variant | Primary |
| Icon | Plus icon |
| Action | Navigate to /employees/new |
| Permission | hr.employee.create |

**Step 4: Additional Actions Menu**

Optional dropdown menu:

```
[⋮ More Actions]
    │
    ├──> Import Employees (CSV)
    ├──> Export Employees (CSV/Excel)
    ├──> Bulk Update
    └──> Manage Departments
```

**Step 5: Responsive Behavior**

```
Desktop (>1024px):
┌──────────────────────────────────────────┐
│  Employees              [+ Add Employee] │
└──────────────────────────────────────────┘

Tablet (768-1024px):
┌──────────────────────────────────────────┐
│  Employees                        [+ Add]│
└──────────────────────────────────────────┘

Mobile (<768px):
┌──────────────────────────────────────────┐
│  Employees                                │
│                                      [+]  │
└──────────────────────────────────────────┘
```

### Expected Outcome

Employee header component displays title and add employee button. Button navigates to new employee form. Header is responsive and adapts to different screen sizes.

### Verification Checklist

- [ ] Header component created
- [ ] Title displays correctly
- [ ] Add button navigates to form
- [ ] Responsive on all screen sizes
- [ ] Styling matches design system

---

## Task 19: Create Employee Summary Cards

### Overview

Build summary cards displaying key employee metrics at the top of the employee list page. Shows total employees, active employees, and department count providing quick overview of the workforce.

### Dependencies

- **Requires:** Task 17 (employees list page)
- **Blocks:** None (independent component)

### Instructions

**Step 1: Define Card Metrics**

Three summary cards needed:

| Card | Metric | Calculation |
|------|--------|-------------|
| Total Employees | Count of all employees | Total records |
| Active Employees | Count of active only | Filter by status='active' |
| Departments | Count of unique departments | Distinct department count |

**Step 2: Cards Layout**

```
┌─────────────┬─────────────┬─────────────┐
│   Total     │   Active    │ Departments │
│  Employees  │  Employees  │             │
│             │             │             │
│     52      │     48      │      8      │
│             │             │             │
│  [↑ +5]     │  [↑ +3]     │  [→ 0]      │
│  vs last    │  vs last    │  vs last    │
│  month      │  month      │  month      │
└─────────────┴─────────────┴─────────────┘
```

**Step 3: Card Component Structure**

Each card should display:

| Element | Description |
|---------|-------------|
| Icon | Representative icon for metric |
| Label | Metric name |
| Value | Large number display |
| Trend | Change indicator (up/down/neutral) |
| Comparison | Comparison text (vs previous period) |

**Step 4: Metric Calculation Logic**

```
Total Employees:
  Count all employee records
  
Active Employees:
  Filter employees where status === 'active'
  
Departments:
  Get unique department values
  Count distinct departments
  
Trend Calculation:
  Current Month Count - Previous Month Count
  │
  ├──> Positive: Show ↑ with green color
  ├──> Negative: Show ↓ with red color
  └──> Zero: Show → with gray color
```

**Step 5: Card Visual Design**

```
Individual Card:
┌──────────────────────────┐
│  [👥 Icon]               │
│                          │
│  Total Employees         │
│                          │
│       52                 │
│                          │
│  ┌────────────────────┐  │
│  │ ↑ +5 vs last month │  │
│  └────────────────────┘  │
└──────────────────────────┘
```

**Step 6: Responsive Grid**

```
Desktop (>1024px): 3 columns
┌────┐ ┌────┐ ┌────┐
│ 52 │ │ 48 │ │  8 │
└────┘ └────┘ └────┘

Tablet (768-1024px): 3 columns (smaller)
┌───┐ ┌───┐ ┌───┐
│ 52│ │ 48│ │ 8 │
└───┘ └───┘ └───┘

Mobile (<768px): 1 column
┌────┐
│ 52 │
└────┘
┌────┐
│ 48 │
└────┘
┌────┐
│  8 │
└────┘
```

**Step 7: Color Coding**

| Metric | Primary Color | Trend Color |
|--------|---------------|-------------|
| Total Employees | Blue | Green/Red/Gray |
| Active Employees | Green | Green/Red/Gray |
| Departments | Purple | Green/Red/Gray |

### Expected Outcome

Summary cards container displays three metric cards showing employee statistics. Cards show current values with trend indicators. Layout is responsive and adapts to screen size.

### Verification Checklist

- [ ] Container component created
- [ ] Three metric cards displayed
- [ ] Calculations accurate
- [ ] Trend indicators working
- [ ] Responsive grid layout

---

## Task 20: Create Employee Filters

### Overview

Build the filters toolbar component containing search input, department filter, status filter, and view toggle. This component manages the filter state and provides filtering controls for the employee list.

### Dependencies

- **Requires:** Task 17 (employees list page)
- **Blocks:** Tasks 21-22, 27 (filter components)

### Instructions

**Step 1: Define Filter Toolbar Structure**

The toolbar should contain:

| Component | Purpose |
|-----------|---------|
| Search Input | Search by name, email, or ID |
| Department Filter | Filter by department |
| Status Filter | Filter by employment status |
| Clear Filters Button | Reset all filters |
| View Toggle | Switch cards/table view |

**Step 2: Toolbar Layout**

```
┌────────────────────────────────────────────────────────────┐
│  [🔍 Search employees...]  [Department ▼]  [Status ▼]     │
│                                        [Clear]  [☰ ▢]      │
└────────────────────────────────────────────────────────────┘
```

**Step 3: Search Input Specifications**

| Property | Value |
|----------|-------|
| Placeholder | "Search employees..." |
| Debounce | 300ms |
| Search Fields | name, email, employeeCode |
| Icon | Search icon (magnifying glass) |
| Clear Button | X icon when text entered |

**Step 4: Filter State Management**

```
Filter State Structure:
{
  searchTerm: string,
  department: string | 'all',
  status: string | 'all',
  viewMode: 'cards' | 'table'
}

State Updates:
  │
  ├──> Search Changed
  │    └──> Update searchTerm
  │         └──> Debounce 300ms
  │              └──> Apply filter
  │
  ├──> Department Changed
  │    └──> Update department
  │         └──> Apply filter immediately
  │
  └──> Status Changed
       └──> Update status
            └──> Apply filter immediately
```

**Step 5: Search Debounce Logic**

```
[User Types in Search]
      │
      ├──> Start Timer (300ms)
      │
      ├──> User Types Again?
      │    └──> Reset Timer
      │
      └──> Timer Expires
           └──> Apply Search Filter
```

**Step 6: Responsive Layout**

```
Desktop (>1024px):
┌─────────────────────────────────────────────────────┐
│ [Search......] [Dept ▼] [Status ▼] [Clear] [☰ ▢]  │
└─────────────────────────────────────────────────────┘

Tablet (768-1024px):
┌─────────────────────────────────────────────────────┐
│ [Search.................]  [Dept ▼]  [Status ▼]    │
│                                  [Clear]  [☰ ▢]     │
└─────────────────────────────────────────────────────┘

Mobile (<768px):
┌─────────────────────────────────────────────────────┐
│ [Search.................................]  [☰ ▢]   │
│ [Department ▼]  [Status ▼]              [Clear]    │
└─────────────────────────────────────────────────────┘
```

**Step 7: Clear Filters Behavior**

```
[Clear Filters Button Clicked]
      │
      ├──> Reset searchTerm to ""
      ├──> Reset department to "all"
      ├──> Reset status to "all"
      └──> Refresh employee list
```

### Expected Outcome

Filter toolbar component created with search input and filter dropdowns. Search debounces input to avoid excessive filtering. Clear button resets all filters. Layout is responsive.

### Verification Checklist

- [ ] Toolbar component created
- [ ] Search input with debounce
- [ ] Filter dropdowns integrated
- [ ] Clear filters working
- [ ] Responsive layout

---

## Task 21: Create Department Filter

### Overview

Build the department filter dropdown component allowing users to filter employees by department. Loads department list dynamically and updates the employee list when selection changes.

### Dependencies

- **Requires:** Task 20 (employee filters)
- **Blocks:** None (independent filter)

### Instructions

**Step 1: Define Department Filter Specifications**

| Property | Value |
|----------|-------|
| Type | Select dropdown |
| Default | "All Departments" |
| Options | Dynamic from department list |
| Action | Filter employees on change |

**Step 2: Department Options Structure**

```
Department Options:
  │
  ├──> All Departments (default)
  ├──> IT & Development
  ├──> Finance & Accounting
  ├──> Sales & Marketing
  ├──> Human Resources
  ├──> Operations
  ├──> Customer Support
  ├──> Administration
  └──> Management
```

**Step 3: Department Filter Dropdown**

```
Collapsed State:
┌──────────────────────┐
│ All Departments  ▼   │
└──────────────────────┘

Expanded State:
┌──────────────────────┐
│ All Departments  ▲   │
├──────────────────────┤
│ ✓ All Departments    │
│   IT & Development   │
│   Finance            │
│   Sales              │
│   Human Resources    │
│   Operations         │
│   Support            │
│   Administration     │
│   Management         │
└──────────────────────┘
```

**Step 4: Department Loading Logic**

```
[Component Mount]
      │
      ├──> Fetch Departments
      │    └──> GET /api/departments
      │
      ├──> Build Options List
      │    ├── Add "All Departments" option
      │    └── Add department options
      │
      └──> Render Dropdown
```

**Step 5: Filter Application**

```
[Department Selected]
      │
      ├──> Update Filter State
      │    └──> department: selected_id
      │
      ├──> Filter Employees
      │    │
      │    ├──> If "All": No filter
      │    │
      │    └──> If Specific: 
      │         Filter where department === selected
      │
      └──> Update Employee List
```

**Step 6: Department Counter**

Show employee count per department:

```
┌─────────────────────────┐
│ All Departments (52) ▼  │
├─────────────────────────┤
│ ✓ All Departments (52)  │
│   IT & Development (15) │
│   Finance (8)           │
│   Sales (12)            │
│   HR (5)                │
│   Operations (8)        │
│   Support (4)           │
└─────────────────────────┘
```

### Expected Outcome

Department filter dropdown created with dynamically loaded departments. Selecting a department filters the employee list. "All Departments" option shows all employees.

### Verification Checklist

- [ ] Dropdown component created
- [ ] Departments loaded from API
- [ ] "All" option included
- [ ] Filter updates employee list
- [ ] Employee counts displayed

---

## Task 22: Create Status Filter

### Overview

Build the status filter dropdown allowing users to filter employees by employment status (active, inactive, on leave). Updates employee list based on selected status.

### Dependencies

- **Requires:** Task 20 (employee filters)
- **Blocks:** None (independent filter)

### Instructions

**Step 1: Define Status Filter Specifications**

| Property | Value |
|----------|-------|
| Type | Select dropdown |
| Default | "All Status" |
| Options | Static predefined statuses |
| Action | Filter employees on change |

**Step 2: Status Options**

```
Status Options:
  │
  ├──> All Status (default)
  ├──> Active
  ├──> Inactive
  ├──> On Leave
  ├──> Probation
  └──> Notice Period
```

**Step 3: Status Filter Dropdown**

```
Collapsed State:
┌──────────────────────┐
│ All Status  ▼        │
└──────────────────────┘

Expanded State:
┌──────────────────────┐
│ All Status  ▲        │
├──────────────────────┤
│ ✓ All Status         │
│ ● Active             │
│ ○ Inactive           │
│ ◐ On Leave           │
│ ⊙ Probation          │
│ ◉ Notice Period      │
└──────────────────────┘
```

**Step 4: Status Indicators**

Visual indicators for each status:

| Status | Color | Symbol |
|--------|-------|--------|
| All Status | Gray | ✓ |
| Active | Green | ● |
| Inactive | Red | ○ |
| On Leave | Blue | ◐ |
| Probation | Yellow | ⊙ |
| Notice Period | Orange | ◉ |

**Step 5: Filter Application Logic**

```
[Status Selected]
      │
      ├──> Update Filter State
      │    └──> status: selected_status
      │
      ├──> Filter Employees
      │    │
      │    ├──> If "All": No filter
      │    │
      │    └──> If Specific:
      │         Filter where status === selected
      │
      └──> Update Employee List
```

**Step 6: Status Counter**

Show employee count per status:

```
┌──────────────────────────┐
│ All Status (52) ▼        │
├──────────────────────────┤
│ ✓ All Status (52)        │
│ ● Active (48)            │
│ ○ Inactive (2)           │
│ ◐ On Leave (2)           │
│ ⊙ Probation (0)          │
│ ◉ Notice Period (0)      │
└──────────────────────────┘
```

### Expected Outcome

Status filter dropdown created with predefined status options. Selecting a status filters employees by that status. Color-coded status indicators enhance visual clarity.

### Verification Checklist

- [ ] Dropdown component created
- [ ] Status options defined
- [ ] "All" option included
- [ ] Color indicators implemented
- [ ] Filter updates employee list

---

## Task 23: Create Employee Cards Grid

### Overview

Build the cards grid layout component that displays employees as cards in a responsive grid. This is the default view mode providing a visual, card-based display of employee information.

### Dependencies

- **Requires:** Task 17 (employees list page)
- **Blocks:** Task 24 (employee card component)

### Instructions

**Step 1: Define Grid Specifications**

Grid layout properties:

| Property | Value |
|----------|-------|
| Layout | CSS Grid |
| Gap | 1.5rem (24px) |
| Min Card Width | 280px |
| Auto Fit | Responsive columns |

**Step 2: Responsive Grid Layout**

```
Desktop (>1440px): 4 columns
┌────┐ ┌────┐ ┌────┐ ┌────┐
│ 🧑 │ │ 🧑 │ │ 🧑 │ │ 🧑 │
└────┘ └────┘ └────┘ └────┘

Laptop (1024-1440px): 3 columns
┌────┐ ┌────┐ ┌────┐
│ 🧑 │ │ 🧑 │ │ 🧑 │
└────┘ └────┘ └────┘

Tablet (768-1024px): 2 columns
┌────┐ ┌────┐
│ 🧑 │ │ 🧑 │
└────┘ └────┘

Mobile (<768px): 1 column
┌────┐
│ 🧑 │
└────┘
```

**Step 3: Grid Container Structure**

```
┌──────────────────────────────────────────────────────┐
│  Employee Cards Grid (12 items)                      │
├──────────────────────────────────────────────────────┤
│  ┌────────┐  ┌────────┐  ┌────────┐  ┌────────┐     │
│  │[Card 1]│  │[Card 2]│  │[Card 3]│  │[Card 4]│     │
│  └────────┘  └────────┘  └────────┘  └────────┘     │
│                                                      │
│  ┌────────┐  ┌────────┐  ┌────────┐  ┌────────┐     │
│  │[Card 5]│  │[Card 6]│  │[Card 7]│  │[Card 8]│     │
│  └────────┘  └────────┘  └────────┘  └────────┘     │
│                                                      │
│  ┌────────┐  ┌────────┐  ┌────────┐  ┌────────┐     │
│  │[Card 9]│  │[Card10]│  │[Card11]│  │[Card12]│     │
│  └────────┘  └────────┘  └────────┘  └────────┘     │
└──────────────────────────────────────────────────────┘
```

**Step 4: Empty State**

When no employees match filters:

```
┌──────────────────────────────────────────────────────┐
│                                                      │
│                     [📋 Icon]                        │
│                                                      │
│             No employees found                       │
│                                                      │
│     Try adjusting your filters or search term       │
│                                                      │
│                 [Clear Filters]                      │
│                                                      │
└──────────────────────────────────────────────────────┘
```

**Step 5: Loading State**

While loading employees:

```
┌──────────────────────────────────────────────────────┐
│  ┌────────┐  ┌────────┐  ┌────────┐  ┌────────┐     │
│  │████████│  │████████│  │████████│  │████████│     │
│  │████████│  │████████│  │████████│  │████████│     │
│  │████████│  │████████│  │████████│  │████████│     │
│  └────────┘  └────────┘  └────────┘  └────────┘     │
│                                                      │
│  (Skeleton cards loading...)                        │
└──────────────────────────────────────────────────────┘
```

**Step 6: Grid Rendering Logic**

```
[Render Grid]
      │
      ├──> Check Employee List
      │    │
      │    ├──> Empty?
      │    │    └──> Show Empty State
      │    │
      │    └──> Has Data?
      │         └──> Map to Cards
      │
      └──> Apply Grid Layout
           └──> Responsive columns
```

### Expected Outcome

Employee cards grid component created with responsive layout. Grid automatically adjusts columns based on screen size. Shows empty state when no employees found. Loading skeleton displays while fetching data.

### Verification Checklist

- [ ] Grid component created
- [ ] Responsive layout working
- [ ] Empty state implemented
- [ ] Loading state implemented
- [ ] Proper spacing and gaps

---

## Task 24: Create Employee Card Component

### Overview

Build the individual employee card component displaying employee photo, name, position, department, and status. Cards are clickable and navigate to employee details page.

### Dependencies

- **Requires:** Task 23 (cards grid)
- **Blocks:** Task 25 (employee avatar)

### Instructions

**Step 1: Define Card Structure**

Card sections:

| Section | Content |
|---------|---------|
| Header | Avatar and status badge |
| Body | Name, position, department |
| Footer | Contact info and actions |

**Step 2: Card Layout**

```
┌──────────────────────────┐
│      [Avatar]      [●]   │ ← Header
│                          │
│    John Doe              │ ← Name
│    Software Engineer     │ ← Position
│    IT Department         │ ← Department
│                          │
│  ──────────────────────  │
│                          │
│  📧 john@company.com     │ ← Email
│  📱 +94 77 123 4567      │ ← Phone
│                          │
│  [View Profile] [⋮]      │ ← Actions
└──────────────────────────┘
```

**Step 3: Card Component Props**

| Prop | Type | Description |
|------|------|-------------|
| employee | Object | Employee data |
| onViewClick | Function | Handle view profile click |
| onEditClick | Function | Handle edit click |
| onDeleteClick | Function | Handle delete click |

**Step 4: Status Badge**

Status badge positioning:

```
Active Status:
┌──────────────────────────┐
│  [Avatar]         ● Active│
│                          │

Inactive Status:
┌──────────────────────────┐
│  [Avatar]      ○ Inactive │
│                          │

On Leave:
┌──────────────────────────┐
│  [Avatar]      ◐ On Leave │
│                          │
```

**Step 5: Card Interactions**

```
Card Interactions:
  │
  ├──> Hover
  │    └──> Elevate card (shadow)
  │         └──> Change cursor to pointer
  │
  ├──> Click Card Body
  │    └──> Navigate to /employees/[id]
  │
  └──> Click Actions Menu
       ├──> View Profile
       ├──> Edit Employee
       └──> Delete Employee
```

**Step 6: Responsive Card**

```
Desktop Card (280px width):
┌──────────────────────────┐
│    [Large Avatar]    [●] │
│                          │
│    Full Name             │
│    Full Position Title   │
│    Department Name       │
│                          │
│  ──────────────────────  │
│                          │
│  📧 email@company.com    │
│  📱 +94 77 123 4567      │
│                          │
│  [View Profile]  [⋮]     │
└──────────────────────────┘

Mobile Card (full width):
┌──────────────────────────┐
│  [Sm Avatar] Name    [●] │
│  Position - Department   │
│  [View]                  │
└──────────────────────────┘
```

**Step 7: Card Accessibility**

| Feature | Implementation |
|---------|---------------|
| Keyboard Nav | Tab to focus, Enter to open |
| ARIA Labels | Proper labels for screen readers |
| Focus Indicator | Visible outline on focus |
| Alt Text | Avatar alt text with name |

### Expected Outcome

Employee card component created displaying employee information in an organized card layout. Cards are interactive and navigate to details. Status badges show employment status visually.

### Verification Checklist

- [ ] Card component created
- [ ] All employee info displayed
- [ ] Status badge working
- [ ] Click navigation working
- [ ] Actions menu functional

---

## Task 25: Create Employee Avatar

### Overview

Build the employee avatar component displaying employee photo or initials fallback. Handles missing photos gracefully and provides consistent avatar styling across the application.

### Dependencies

- **Requires:** Task 24 (employee card)
- **Blocks:** None (UI component)

### Instructions

**Step 1: Define Avatar Specifications**

| Property | Value |
|----------|-------|
| Default Size | 64px (card), 128px (profile) |
| Shape | Circle |
| Fallback | Initials with background |
| Photo Source | URL from employee data |

**Step 2: Avatar Display Logic**

```
[Display Avatar]
      │
      ├──> Has Photo URL?
      │    │
      │    ├──> Yes
      │    │    └──> Display Photo
      │    │         │
      │    │         ├──> Load Success
      │    │         │    └──> Show Image
      │    │         │
      │    │         └──> Load Error
      │    │              └──> Show Initials
      │    │
      │    └──> No
      │         └──> Show Initials
      │
      └──> Apply Size & Style
```

**Step 3: Avatar Variations**

```
With Photo:
┌──────────┐
│  ╭────╮  │
│  │📷  │  │
│  │Image│  │
│  ╰────╯  │
└──────────┘

Without Photo (Initials):
┌──────────┐
│  ╭────╮  │
│  │ JD │  │
│  │    │  │
│  ╰────╯  │
└──────────┘
```

**Step 4: Initials Generation**

```
Generate Initials:
  │
  ├──> Extract First Name
  │    └──> Take first character
  │         (e.g., "John" → "J")
  │
  ├──> Extract Last Name
  │    └──> Take first character
  │         (e.g., "Doe" → "D")
  │
  └──> Combine
       └──> "J" + "D" = "JD"
```

**Step 5: Background Color Generation**

Generate consistent color based on name:

```
Color Generation:
  │
  ├──> Hash Name String
  │    └──> Generate number from string
  │
  ├──> Select Color from Palette
  │    └──> Use modulo to pick from colors
  │
  └──> Apply Background Color
       │
       Palette:
       ├──> Blue (#3B82F6)
       ├──> Green (#10B981)
       ├──> Purple (#8B5CF6)
       ├──> Pink (#EC4899)
       ├──> Orange (#F59E0B)
       └──> Red (#EF4444)
```

**Step 6: Avatar Sizes**

| Size | Dimension | Use Case |
|------|-----------|----------|
| xs | 32px | Table rows, notifications |
| sm | 48px | List items |
| md | 64px | Employee cards (default) |
| lg | 96px | Profile header |
| xl | 128px | Full profile page |

**Step 7: Avatar Component Props**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| src | string | null | Photo URL |
| name | string | required | Employee full name |
| size | string | 'md' | Size variant |
| status | string | null | Status indicator |

### Expected Outcome

Employee avatar component created handling both photo display and initials fallback. Consistent styling and coloring. Multiple size variants supported.

### Verification Checklist

- [ ] Avatar component created
- [ ] Photo display working
- [ ] Initials fallback working
- [ ] Color generation consistent
- [ ] All size variants implemented

---

## Task 26: Create Employees Table View

### Overview

Build the alternative table view for displaying employees in a detailed, spreadsheet-style layout. Provides more columns and data density compared to cards view.

### Dependencies

- **Requires:** Task 17 (employees list page)
- **Blocks:** Task 27 (view toggle)

### Instructions

**Step 1: Define Table Columns**

| Column | Width | Content |
|--------|-------|---------|
| Employee | 250px | Avatar, name, email |
| Employee ID | 120px | Employee code |
| Position | 180px | Job title |
| Department | 150px | Department name |
| Phone | 140px | Phone number |
| Status | 100px | Status badge |
| Actions | 80px | Action buttons |

**Step 2: Table Layout**

```
┌───────────────────────────────────────────────────────────────┐
│ Employee         │ID    │Position │Dept    │Phone  │St │Act │
├───────────────────────────────────────────────────────────────┤
│ [🧑] John Doe    │EMP001│Software │IT      │+94 77 │● │[⋮] │
│      john@co.com │      │Engineer │        │123456 │  │    │
├───────────────────────────────────────────────────────────────┤
│ [🧑] Jane Smith  │EMP002│Accountant│Finance│+94 77 │● │[⋮] │
│      jane@co.com │      │         │        │234567 │  │    │
├───────────────────────────────────────────────────────────────┤
│ [🧑] Bob Johnson │EMP003│Sales    │Sales   │+94 77 │◐ │[⋮] │
│      bob@co.com  │      │Manager  │        │345678 │  │    │
└───────────────────────────────────────────────────────────────┘
```

**Step 3: Table Features**

| Feature | Description |
|---------|-------------|
| Sorting | Click column headers to sort |
| Row Selection | Checkbox for bulk actions |
| Row Hover | Highlight on hover |
| Sticky Header | Header stays visible on scroll |
| Horizontal Scroll | Scrollable on small screens |

**Step 4: Sorting Logic**

```
[Column Header Clicked]
      │
      ├──> Determine Sort Column
      │
      ├──> Determine Sort Direction
      │    ├──> First Click: Ascending
      │    ├──> Second Click: Descending
      │    └──> Third Click: Clear Sort
      │
      ├──> Sort Employee Array
      │    │
      │    ├──> String Columns (Name, Position)
      │    │    └──> Alphabetical sort
      │    │
      │    ├──> Number Columns (ID)
      │    │    └──> Numeric sort
      │    │
      │    └──> Date Columns (Join Date)
      │         └──> Chronological sort
      │
      └──> Update Display
```

**Step 5: Column Sorting Indicators**

```
Not Sorted:
┌─────────────────┐
│ Name      ⇅     │
└─────────────────┘

Ascending:
┌─────────────────┐
│ Name      ▲     │
└─────────────────┘

Descending:
┌─────────────────┐
│ Name      ▼     │
└─────────────────┘
```

**Step 6: Row Actions Menu**

```
[⋮ Menu Clicked]
      │
      ├──> View Profile
      │    └──> Navigate to /employees/[id]
      │
      ├──> Edit Employee
      │    └──> Navigate to /employees/[id]/edit
      │
      ├──> View Payslip
      │    └──> Navigate to /payroll/employee/[id]
      │
      └──> Delete Employee
           └──> Show confirmation dialog
```

**Step 7: Responsive Table**

```
Desktop (>1024px): Full table
┌────────────────────────────────────────┐
│ Employee │ ID │ Position │ ... │ Status│
└────────────────────────────────────────┘

Tablet (768-1024px): Scroll horizontally
┌────────────────────────────────────────┐→
│ Employee │ ID │ Position │ ... │       │
└────────────────────────────────────────┘

Mobile (<768px): Card-like rows
┌────────────────────────────────────────┐
│ [🧑] John Doe              ● Active    │
│ Software Engineer - IT                 │
│ EMP001 | +94 77 123 4567               │
└────────────────────────────────────────┘
```

### Expected Outcome

Employee table view component created displaying employees in spreadsheet format. Table supports sorting by columns. Rows are interactive with action menus. Table is responsive and scrollable on small screens.

### Verification Checklist

- [ ] Table component created
- [ ] All columns displaying correctly
- [ ] Sorting functionality working
- [ ] Row actions menu functional
- [ ] Responsive on all screens

---

## Task 27: Create View Toggle

### Overview

Build the view toggle control allowing users to switch between cards and table view modes. Saves user preference and updates the display accordingly.

### Dependencies

- **Requires:** Task 26 (table view)
- **Blocks:** None (UI control)

### Instructions

**Step 1: Define Toggle Specifications**

| Property | Value |
|----------|-------|
| Type | Segmented button |
| Options | Cards, Table |
| Default | Cards |
| Persistence | Local storage |

**Step 2: Toggle Button Design**

```
Inactive State:
┌────────────────┐
│ [☰] Cards  [▢] Table │
└────────────────┘

Cards Active:
┌────────────────┐
│ [☰] Cards  [▢] Table │
│  ▔▔▔▔▔▔▔       │
└────────────────┘

Table Active:
┌────────────────┐
│ [☰] Cards  [▢] Table │
│             ▔▔▔▔▔ │
└────────────────┘
```

**Step 3: Toggle Interaction Flow**

```
[Toggle Clicked]
      │
      ├──> Update View Mode State
      │    ├── If Cards: Set to 'cards'
      │    └── If Table: Set to 'table'
      │
      ├──> Save Preference
      │    └──> localStorage.setItem('viewMode', mode)
      │
      └──> Re-render Display
           ├──> Cards Mode: Show grid
           └──> Table Mode: Show table
```

**Step 4: State Management**

```
View Mode State:
{
  viewMode: 'cards' | 'table',
  preference: localStorage.getItem('viewMode')
}

Initialization:
  │
  ├──> Check Local Storage
  │    │
  │    ├──> Has Preference?
  │    │    └──> Load preference
  │    │
  │    └──> No Preference?
  │         └──> Default to 'cards'
  │
  └──> Set Initial State
```

**Step 5: Toggle Icons**

| View Mode | Icon | Description |
|-----------|------|-------------|
| Cards | ☰ Grid icon | 3x3 grid squares |
| Table | ▢ List icon | Horizontal lines |

**Step 6: Responsive Toggle**

```
Desktop:
┌───────────────────────┐
│ [☰ Cards]  [▢ Table]  │
└───────────────────────┘

Mobile:
┌──────┬──────┐
│ [☰]  │ [▢]  │
└──────┴──────┘
```

**Step 7: Accessibility**

| Feature | Implementation |
|---------|---------------|
| Keyboard | Tab to focus, Space/Enter to toggle |
| ARIA | aria-label for each button |
| Focus | Visible focus indicator |
| State | aria-pressed for active state |

### Expected Outcome

View toggle component created allowing smooth switching between cards and table views. User preference persists across sessions. Toggle is accessible and responsive.

### Verification Checklist

- [ ] Toggle component created
- [ ] View switching working
- [ ] Preference saved to localStorage
- [ ] Icons appropriate for each mode
- [ ] Keyboard accessible

---

## Summary

This document built the complete employee list interface with dual view modes. Created the main employees list page component managing state, filtering, and view modes. Implemented header with add employee button and summary cards showing key metrics (total, active, departments) with trend indicators. Built comprehensive filter system with debounced search input, department dropdown, and status dropdown with clear filters option. Created responsive employee cards grid with auto-adjusting columns, empty state, and loading skeleton. Built individual employee card component displaying avatar, name, position, department, contact info, and status badge with click navigation. Implemented employee avatar component with photo display and initials fallback with consistent color generation. Created alternative table view with sortable columns, row actions menu, and responsive horizontal scrolling. Added view toggle control allowing users to switch between cards and table modes with localStorage persistence.

The employee directory now provides two comprehensive viewing options catering to different user preferences. Cards view offers visual, scannable layout while table view provides detailed, sortable data display. All components are responsive and work seamlessly across device sizes.

### What's Next

The next document (02_Tasks-28-34_Profile-OrgChart.md) will complete employee management by implementing the employee details/profile page with tabs for personal and employment information, and creating the organizational chart visualization showing company hierarchy.

---

**Document Status:** Ready for Implementation  
**Last Updated:** 2026-01-26
