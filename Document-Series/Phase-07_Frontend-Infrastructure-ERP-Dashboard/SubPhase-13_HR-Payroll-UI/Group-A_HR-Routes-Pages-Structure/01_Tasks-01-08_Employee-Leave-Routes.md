# Tasks 01-08: Employee & Leave Routes Setup

> **Phase:** 07 - Frontend Infrastructure & ERP Dashboard  
> **SubPhase:** 13 - HR & Payroll UI  
> **Group:** A - HR Routes & Pages Structure  
> **Document:** 01 of 02  
> **Tasks Covered:** 01-08

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** None (First Document)
- **→ Next Document:** [02_Tasks-09-16_Payroll-Routes-Verify.md](02_Tasks-09-16_Payroll-Routes-Verify.md)
- **⊚ SubPhase Tasks:** [00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)

---

## Document Overview

This document covers the initial HR route structure setup, focusing on employee and leave routes. Creates the four main HR directories, then implements all employee-related routes including list, details, new employee, and organizational chart pages. Finally sets up attendance and leave routes with their respective sub-pages.

### Tasks in This Document

| Task # | Task Name | Complexity | Dependencies |
|--------|-----------|------------|--------------|
| 01 | Create HR Route Directories | Low | SubPhase-07 |
| 02 | Create Employees List Page Route | Low | Task 01 |
| 03 | Create Employee Details Page Route | Low | Task 01 |
| 04 | Create New Employee Page Route | Low | Task 01 |
| 05 | Create Org Chart Page Route | Low | Task 01 |
| 06 | Create Attendance Page Route | Low | Task 01 |
| 07 | Create Attendance Report Page Route | Low | Task 06 |
| 08 | Create Leave Page Route | Low | Task 01 |

---

## Task 01: Create HR Route Directories

### Overview

Establish the foundational directory structure for the HR module within the Next.js App Router. Creates four main directories: employees, attendance, leave, and payroll under the dashboard layout.

### Dependencies

- **Requires:** SubPhase-07 (Frontend infrastructure)
- **Blocks:** Tasks 02-16 (all subsequent routes)

### Instructions

**Step 1: Navigate to Dashboard Layout**

Locate the main dashboard layout directory where all authenticated routes are nested.

**Step 2: Create HR Route Directories**

Create four main directories for the HR module sections:

- employees: For employee management routes
- attendance: For attendance tracking routes  
- leave: For leave management routes
- payroll: For payroll processing routes

**Step 3: Verify Directory Structure**

Ensure the directory hierarchy matches the App Router conventions:

```
app/
└── (dashboard)/
    ├── employees/
    ├── attendance/
    ├── leave/
    └── payroll/
```

**Step 4: Plan Route Organization**

Understand the planned routes for each directory:

| Directory | Routes |
|-----------|--------|
| employees | /employees (list), /employees/new, /employees/[id], /employees/org-chart |
| attendance | /attendance (dashboard), /attendance/report |
| leave | /leave (dashboard), /leave/request |
| payroll | /payroll (dashboard), /payroll/run, /payroll/[id] |

### Expected Outcome

Four empty directories created and ready to receive page files. Directory structure aligns with Next.js App Router conventions and enables clean URL patterns for HR features.

### Verification Checklist

- [ ] All four directories created (employees, attendance, leave, payroll)
- [ ] Directories located under (dashboard) layout
- [ ] Directory names use lowercase and hyphens
- [ ] Structure matches App Router conventions
- [ ] Ready for page.tsx files to be added

---

## Task 02: Create Employees List Page Route

### Overview

Create the main employees list page route that displays all employees in the organization. This is the landing page for the employees section showing employee directory with filtering and search capabilities.

### Dependencies

- **Requires:** Task 01 (HR route directories)
- **Blocks:** None (independent component)

### Instructions

**Step 1: Create Page File**

Inside the employees directory, create a page.tsx file.

**Step 2: Define Page Component Structure**

The page should be structured to eventually contain:

- Page header with title and add employee button
- Summary cards showing employee statistics
- Filter toolbar for search and filtering
- Employee grid or table view
- Pagination controls

**Step 3: Set Up Page Layout**

Create the basic page component with:

- Main container with proper spacing
- Placeholder for future components
- Empty state message for development

**Step 4: Define Route Metadata**

Prepare for SEO metadata:

| Metadata | Value |
|----------|-------|
| Title | Employees - HR Management |
| Description | Employee directory and management |
| Route | /employees |

**Step 5: Visual Layout Structure**

```
┌─────────────────────────────────────────┐
│  Employees                     [+ Add]   │
├─────────────────────────────────────────┤
│  [Total] [Active] [Departments]         │
├─────────────────────────────────────────┤
│  [Search] [Filters]                     │
├─────────────────────────────────────────┤
│                                         │
│  Employee Cards/Table                   │
│                                         │
│  (To be implemented in Group B)         │
│                                         │
└─────────────────────────────────────────┘
```

### Expected Outcome

Employees list page is accessible at /employees route. Page renders with basic structure ready to receive employee list components in subsequent tasks.

### Verification Checklist

- [ ] Page file created at employees/page.tsx
- [ ] Component exports default function
- [ ] Route accessible via navigation
- [ ] Page renders without errors
- [ ] Placeholder content visible for development

---

## Task 03: Create Employee Details Page Route

### Overview

Create the dynamic employee details page route using Next.js dynamic segments. This page displays comprehensive information about a specific employee when accessed via /employees/[id].

### Dependencies

- **Requires:** Task 01 (HR route directories)
- **Blocks:** None (independent component)

### Instructions

**Step 1: Create Dynamic Route Directory**

Inside the employees directory, create a [id] folder for the dynamic route segment.

**Step 2: Create Page File**

Inside the [id] directory, create a page.tsx file.

**Step 3: Define Page Props Interface**

The page will receive dynamic parameters:

| Param | Type | Description |
|-------|------|-------------|
| id | string | Employee unique identifier |

**Step 4: Set Up Page Structure**

The page should be organized to contain:

- Employee profile header with photo and basic info
- Tab navigation for different sections
- Personal information tab
- Employment information tab
- Documents tab
- Performance tab

**Step 5: Plan Data Flow**

Understand the data requirements:

```
[Page Load]
    │
    ├──> Extract ID from params
    │
    ├──> Fetch employee data by ID
    │
    └──> Display employee details
         │
         ├──> Profile Header
         ├──> Personal Info Tab
         ├──> Employment Info Tab
         ├──> Documents Tab
         └──> Performance Tab
```

**Step 6: Page Layout Structure**

```
┌─────────────────────────────────────────┐
│  [← Back]                               │
├─────────────────────────────────────────┤
│  [Photo] John Doe                       │
│          Software Engineer              │
│          Active                         │
├─────────────────────────────────────────┤
│  [Personal] [Employment] [Docs]         │
├─────────────────────────────────────────┤
│                                         │
│  Tab Content                            │
│  (To be implemented in Group B)         │
│                                         │
└─────────────────────────────────────────┘
```

### Expected Outcome

Employee details page accessible via /employees/[id] where [id] is any employee identifier. Page extracts ID from URL parameters and prepares structure for detailed employee information display.

### Verification Checklist

- [ ] Dynamic route directory created ([id])
- [ ] Page file created in [id]/page.tsx
- [ ] Page receives params prop correctly
- [ ] Route accessible with any ID value
- [ ] Page renders without errors

---

## Task 04: Create New Employee Page Route

### Overview

Create the new employee page route for adding new employees to the system. This page contains a comprehensive form for entering employee information and is accessed via /employees/new.

### Dependencies

- **Requires:** Task 01 (HR route directories)
- **Blocks:** None (independent component)

### Instructions

**Step 1: Create Route Directory**

Inside the employees directory, create a new folder.

**Step 2: Create Page File**

Inside the new directory, create a page.tsx file.

**Step 3: Define Form Structure**

Plan the form sections that will be implemented:

| Section | Fields |
|---------|--------|
| Personal Info | Name, NIC, DOB, Gender, Marital Status |
| Contact Info | Phone (+94), Email, Address |
| Employment Info | Position, Department, Join Date, Salary |
| Documents | NIC Copy, CV, Certificates, Contract |

**Step 4: Set Up Page Layout**

The page should contain:

- Header with title and save/cancel buttons
- Form progress indicator (steps)
- Form sections organized logically
- Document upload area
- Action buttons at bottom

**Step 5: Form Flow Visualization**

```
[New Employee Form]
         │
         ├──> Step 1: Personal Information
         │    ├── Full Name
         │    ├── NIC (Sri Lankan format)
         │    ├── Date of Birth
         │    ├── Gender
         │    └── Marital Status
         │
         ├──> Step 2: Contact Information
         │    ├── Phone (+94 format)
         │    ├── Email
         │    └── Address
         │
         ├──> Step 3: Employment Information
         │    ├── Position
         │    ├── Department
         │    ├── Join Date
         │    ├── Basic Salary (LKR)
         │    └── EPF/ETF Numbers
         │
         └──> Step 4: Documents
              ├── NIC Copy
              ├── CV/Resume
              ├── Certificates
              └── Employment Contract
                   │
                   └──> [Submit]
```

**Step 6: Page Layout Structure**

```
┌─────────────────────────────────────────┐
│  New Employee       [Cancel] [Save]     │
├─────────────────────────────────────────┤
│  ● Personal  ○ Contact  ○ Employment    │
├─────────────────────────────────────────┤
│                                         │
│  Personal Information                   │
│  ┌───────────────────────────────────┐ │
│  │ Full Name: [____________]         │ │
│  │ NIC: [____________]               │ │
│  │ DOB: [DD/MM/YYYY]                 │ │
│  │ Gender: [Select]                  │ │
│  │ Marital: [Select]                 │ │
│  └───────────────────────────────────┘ │
│                                         │
│                    [Next Step →]        │
└─────────────────────────────────────────┘
```

### Expected Outcome

New employee page accessible at /employees/new route. Page displays form structure ready to receive employee form components with proper validation and submission handling.

### Verification Checklist

- [ ] Route directory created (new)
- [ ] Page file created in new/page.tsx
- [ ] Route accessible via navigation
- [ ] Page renders form structure
- [ ] Form sections organized logically

---

## Task 05: Create Org Chart Page Route

### Overview

Create the organizational chart page route that visualizes the company's hierarchical structure. This page displays employees in a tree diagram showing reporting relationships and is accessed via /employees/org-chart.

### Dependencies

- **Requires:** Task 01 (HR route directories)
- **Blocks:** None (independent component)

### Instructions

**Step 1: Create Route Directory**

Inside the employees directory, create an org-chart folder.

**Step 2: Create Page File**

Inside the org-chart directory, create a page.tsx file.

**Step 3: Define Visualization Structure**

Plan the org chart features:

| Feature | Description |
|---------|-------------|
| Hierarchical View | Tree structure showing reporting lines |
| Employee Nodes | Cards with photo, name, and position |
| Zoom Controls | Zoom in/out for large organizations |
| Search | Find specific employees in chart |
| Filters | Filter by department or level |

**Step 4: Understand Hierarchy Flow**

```
[CEO/Managing Director]
         │
    ┌────┴────┬─────────────┐
    │         │             │
[CTO]     [CFO]         [COO]
    │         │             │
    ├──────┐  ├────┐        ├──────┐
    │      │  │    │        │      │
[Dev Mgr] │ [Acc] │    [Ops Mgr] │
    │      │       │        │      │
    ├────┐ │       │        │      │
    │    │ │       │        │      │
[Devs]  [QA]  [Finance] [Sales] [Support]
```

**Step 5: Set Up Page Layout**

The page should contain:

- Header with chart title and controls
- Zoom and pan controls
- Search and filter toolbar
- Main chart canvas area
- Employee detail popup on node click

**Step 6: Page Layout Structure**

```
┌─────────────────────────────────────────┐
│  Organizational Chart                   │
│  [Search] [Department ▼] [− ◯ +]       │
├─────────────────────────────────────────┤
│                                         │
│          ┌───────────────┐              │
│          │   CEO         │              │
│          │   John Smith  │              │
│          └───────┬───────┘              │
│                  │                      │
│      ┌───────────┼───────────┐          │
│      │           │           │          │
│  ┌───┴───┐   ┌───┴───┐   ┌───┴───┐     │
│  │ CTO   │   │ CFO   │   │ COO   │     │
│  └───┬───┘   └───────┘   └───────┘     │
│      │                                  │
│  [Tree continues...]                    │
│                                         │
└─────────────────────────────────────────┘
```

**Step 7: Node Structure**

Each employee node should display:

```
┌──────────────┐
│   [Photo]    │
├──────────────┤
│  Full Name   │
│  Job Title   │
│  Department  │
└──────────────┘
```

### Expected Outcome

Organizational chart page accessible at /employees/org-chart route. Page renders with proper structure to display hierarchical employee relationships using a tree visualization.

### Verification Checklist

- [ ] Route directory created (org-chart)
- [ ] Page file created in org-chart/page.tsx
- [ ] Route accessible via navigation
- [ ] Page renders with chart container
- [ ] Controls area visible for zoom/search

---

## Task 06: Create Attendance Page Route

### Overview

Create the main attendance page route that serves as the attendance dashboard. This page displays daily attendance overview, calendar view, and attendance summary statistics at /attendance.

### Dependencies

- **Requires:** Task 01 (HR route directories)
- **Blocks:** Task 07 (attendance report route)

### Instructions

**Step 1: Create Page File**

Inside the attendance directory, create a page.tsx file.

**Step 2: Define Page Structure**

Plan the attendance dashboard components:

| Section | Purpose |
|---------|---------|
| Header | Title and date selector |
| Summary Cards | Present, absent, late counts |
| Calendar | Monthly attendance view |
| Daily List | Today's attendance details |
| Quick Actions | Clock in/out, manual entry |

**Step 3: Plan Data Flow**

```
[Attendance Page]
         │
         ├──> Load Today's Date
         │
         ├──> Fetch Attendance Summary
         │    ├── Present Count
         │    ├── Absent Count
         │    └── Late Count
         │
         ├──> Load Calendar Data
         │    └── Monthly attendance records
         │
         └──> Load Daily List
              └── Today's employee attendance
```

**Step 4: Page Layout Structure**

```
┌─────────────────────────────────────────┐
│  Attendance            [← →] Jan 2026   │
├─────────────────────────────────────────┤
│  ┌──────┐  ┌──────┐  ┌──────┐          │
│  │ 45   │  │  5   │  │  3   │          │
│  │Present│ │Absent│  │ Late │          │
│  └──────┘  └──────┘  └──────┘          │
├─────────────────────────────────────────┤
│  Calendar View                          │
│  ┌─────────────────────────────────┐   │
│  │ Mon Tue Wed Thu Fri Sat Sun     │   │
│  │  1   2   3   4   5   6   7      │   │
│  │ [●] [●] [●] [●] [●] [ ] [ ]     │   │
│  │  ...                             │   │
│  └─────────────────────────────────┘   │
├─────────────────────────────────────────┤
│  Today's Attendance                     │
│  ┌───────────────────────────────────┐ │
│  │ Employee    Check In    Check Out │ │
│  │ John Doe    08:30 AM    05:30 PM  │ │
│  │ ...                               │ │
│  └───────────────────────────────────┘ │
└─────────────────────────────────────────┘
```

**Step 5: Define Status Colors**

Attendance status indicators:

| Status | Color | Symbol |
|--------|-------|--------|
| Present | Green | ● |
| Absent | Red | ○ |
| Late | Yellow | ◐ |
| Half Day | Orange | ◑ |
| Leave | Blue | □ |

### Expected Outcome

Attendance page accessible at /attendance route. Page displays dashboard structure with placeholders for summary cards, calendar, and daily attendance list.

### Verification Checklist

- [ ] Page file created at attendance/page.tsx
- [ ] Component exports default function
- [ ] Route accessible via navigation
- [ ] Page renders dashboard structure
- [ ] Placeholder sections visible

---

## Task 07: Create Attendance Report Page Route

### Overview

Create the attendance report page route for generating and viewing detailed attendance reports. This page allows filtering by date range, department, and employee, accessible at /attendance/report.

### Dependencies

- **Requires:** Task 06 (attendance page route)
- **Blocks:** None (independent component)

### Instructions

**Step 1: Create Route Directory**

Inside the attendance directory, create a report folder.

**Step 2: Create Page File**

Inside the report directory, create a page.tsx file.

**Step 3: Define Report Structure**

Plan the report page sections:

| Section | Purpose |
|---------|---------|
| Header | Title and export button |
| Filters | Date range, department, employee |
| Summary | Total days, present, absent percentages |
| Report Table | Detailed attendance records |
| Export | Download as CSV or Excel |

**Step 4: Set Up Filter Options**

Available filters:

| Filter | Options |
|--------|---------|
| Date Range | Start Date, End Date |
| Department | All, IT, Finance, Sales, HR, Operations |
| Employee | All or specific employee |
| Status | All, Present, Absent, Late, Leave |

**Step 5: Report Table Structure**

```
┌──────────────────────────────────────────────────────────┐
│ Date       │ Employee    │ Check In │ Check Out │ Status  │
├──────────────────────────────────────────────────────────┤
│ 2026-01-20 │ John Doe    │ 08:30 AM │ 05:30 PM  │ Present │
│ 2026-01-20 │ Jane Smith  │ 09:15 AM │ 05:30 PM  │ Late    │
│ 2026-01-20 │ Bob Johnson │    -     │    -      │ Absent  │
│ 2026-01-21 │ John Doe    │ 08:25 AM │ 05:35 PM  │ Present │
│ ...        │             │          │           │         │
└──────────────────────────────────────────────────────────┘
```

**Step 6: Page Layout Structure**

```
┌─────────────────────────────────────────┐
│  Attendance Report      [Export ▼]      │
├─────────────────────────────────────────┤
│  Date Range: [Start] to [End]           │
│  Department: [All ▼]  Employee: [All ▼] │
│  Status: [All ▼]      [Apply Filters]   │
├─────────────────────────────────────────┤
│  Summary:                               │
│  Total Days: 20 | Present: 18 (90%)     │
│  Absent: 2 (10%) | Late: 1 (5%)         │
├─────────────────────────────────────────┤
│  [Report Table...]                      │
│                                         │
│  [Pagination: 1 2 3 ... 10]             │
└─────────────────────────────────────────┘
```

### Expected Outcome

Attendance report page accessible at /attendance/report route. Page renders with filter controls and table structure ready to display detailed attendance records with export functionality.

### Verification Checklist

- [ ] Route directory created (report)
- [ ] Page file created in report/page.tsx
- [ ] Route accessible via navigation
- [ ] Filter controls visible
- [ ] Report table structure rendered

---

## Task 08: Create Leave Page Route

### Overview

Create the main leave management page route that serves as the leave dashboard. This page displays leave balances, pending requests, and leave calendar at /leave.

### Dependencies

- **Requires:** Task 01 (HR route directories)
- **Blocks:** None (independent component)

### Instructions

**Step 1: Create Page File**

Inside the leave directory, create a page.tsx file.

**Step 2: Define Page Structure**

Plan the leave dashboard components:

| Section | Purpose |
|---------|---------|
| Header | Title and request leave button |
| Balance Cards | Leave balances by type |
| Requests Table | Pending and recent leave requests |
| Leave Calendar | Team leave overview |
| Quick Actions | Submit request, view policy |

**Step 3: Define Leave Types**

Sri Lankan standard leave types:

| Leave Type | Annual Entitlement |
|------------|-------------------|
| Annual Leave | 14 days |
| Casual Leave | 7 days |
| Medical Leave | 14 days |
| Maternity Leave | 84 days (12 weeks) |
| Paternity Leave | 3 days |
| No Pay Leave | As needed |

**Step 4: Plan Data Flow**

```
[Leave Dashboard]
         │
         ├──> Load Employee Leave Balances
         │    ├── Annual Leave: 10/14 remaining
         │    ├── Casual Leave: 5/7 remaining
         │    └── Medical Leave: 12/14 remaining
         │
         ├──> Fetch Leave Requests
         │    ├── Pending Requests
         │    ├── Approved Requests
         │    └── Rejected Requests
         │
         └──> Load Team Calendar
              └── Upcoming team leaves
```

**Step 5: Page Layout Structure**

```
┌─────────────────────────────────────────┐
│  Leave Management    [+ Request Leave]  │
├─────────────────────────────────────────┤
│  Leave Balances:                        │
│  ┌────────┐ ┌────────┐ ┌────────┐      │
│  │Annual  │ │Casual  │ │Medical │      │
│  │ 10/14  │ │  5/7   │ │ 12/14  │      │
│  └────────┘ └────────┘ └────────┘      │
├─────────────────────────────────────────┤
│  Leave Requests:                        │
│  ┌───────────────────────────────────┐ │
│  │ Type    │ From   │ To     │Status │ │
│  │ Annual  │ Jan 20 │ Jan 22 │Pending│ │
│  │ Medical │ Jan 15 │ Jan 15 │Approve│ │
│  └───────────────────────────────────┘ │
├─────────────────────────────────────────┤
│  Team Calendar:                         │
│  [Calendar showing team leaves...]      │
└─────────────────────────────────────────┘
```

**Step 6: Leave Status Indicators**

```
Request Status:
  [●] Pending   - Awaiting approval
  [✓] Approved  - Approved by manager
  [✗] Rejected  - Request denied
  [○] Cancelled - Cancelled by employee
```

### Expected Outcome

Leave page accessible at /leave route. Page displays leave dashboard structure with balance cards, requests table, and calendar placeholder ready for detailed implementation.

### Verification Checklist

- [ ] Page file created at leave/page.tsx
- [ ] Component exports default function
- [ ] Route accessible via navigation
- [ ] Dashboard structure rendered
- [ ] Balance cards section visible

---

## Summary

This document established the foundational route structure for the HR module. Created four main directories for employees, attendance, leave, and payroll. Implemented employee routes including list page, dynamic details page with [id] parameter, new employee form page, and organizational chart visualization page. Set up attendance routes with main dashboard and report pages. Created leave dashboard page with balance tracking and request management structure.

All eight routes are now accessible and ready for component implementation in subsequent groups. The route structure follows Next.js App Router conventions with proper use of dynamic segments, nested routes, and organized directory hierarchy. Each page has a clear purpose and layout plan aligned with Sri Lankan HR management requirements including EPF/ETF considerations and local leave policies.

### What's Next

The next document (02_Tasks-09-16_Payroll-Routes-Verify.md) will complete the route structure by creating payroll routes, configuring metadata for all pages, implementing loading states and error boundaries, and verifying the complete route structure is accessible and functional.

---

**Document Status:** Ready for Implementation  
**Last Updated:** 2026-01-26
