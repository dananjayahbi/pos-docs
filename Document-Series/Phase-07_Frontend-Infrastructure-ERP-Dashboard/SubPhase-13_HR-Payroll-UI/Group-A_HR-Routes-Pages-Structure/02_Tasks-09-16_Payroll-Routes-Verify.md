# Tasks 09-16: Payroll Routes & Verification

> **Phase:** 07 - Frontend Infrastructure & ERP Dashboard  
> **SubPhase:** 13 - HR & Payroll UI  
> **Group:** A - HR Routes & Pages Structure  
> **Document:** 02 of 02  
> **Tasks Covered:** 09-16

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [01_Tasks-01-08_Employee-Leave-Routes.md](01_Tasks-01-08_Employee-Leave-Routes.md)
- **→ Next Document:** None (Last in Group) | **Next Group:** [Group-B_Employee-Management](../Group-B_Employee-Management/)
- **⊚ SubPhase Tasks:** [00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)

---

## Document Overview

This document completes the HR route structure by implementing payroll routes and adding essential infrastructure. Creates payroll dashboard, run payroll wizard, and payslip details pages. Configures SEO metadata for all HR pages. Implements loading states using Suspense and creates error boundaries for graceful error handling. Concludes with comprehensive route verification testing.

### Tasks in This Document

| Task # | Task Name | Complexity | Dependencies |
|--------|-----------|------------|--------------|
| 09 | Create Leave Request Page Route | Low | Task 08 |
| 10 | Create Payroll Page Route | Low | Task 01 |
| 11 | Create Payroll Run Page Route | Low | Task 10 |
| 12 | Create Payslip Details Page Route | Low | Task 10 |
| 13 | Configure Page Metadata | Low | Task 01 |
| 14 | Create HR Loading States | Low | Task 01 |
| 15 | Create HR Error Boundaries | Low | Task 01 |
| 16 | Verify Route Structure | Low | Task 15 |

---

## Task 09: Create Leave Request Page Route

### Overview

Create the leave request submission page where employees can submit new leave requests. This page contains a form with leave type selection, date range picker, and reason input, accessible at /leave/request.

### Dependencies

- **Requires:** Task 08 (leave page route)
- **Blocks:** None (independent component)

### Instructions

**Step 1: Create Route Directory**

Inside the leave directory, create a request folder.

**Step 2: Create Page File**

Inside the request directory, create a page.tsx file.

**Step 3: Define Form Structure**

Plan the leave request form fields:

| Field | Type | Validation |
|-------|------|------------|
| Leave Type | Select | Required, one of predefined types |
| Start Date | Date Picker | Required, not in past |
| End Date | Date Picker | Required, after start date |
| Half Day | Checkbox | Optional |
| Reason | Textarea | Required, min 10 characters |
| Covering Person | Select | Optional, another employee |
| Attachment | File Upload | Optional, medical certificates |

**Step 4: Leave Type Options**

```
Leave Types:
  ├── Annual Leave
  ├── Casual Leave
  ├── Medical Leave
  │   └── [Requires medical certificate]
  ├── Maternity Leave
  │   └── [Requires medical certificate]
  ├── Paternity Leave
  └── No Pay Leave
```

**Step 5: Form Validation Rules**

| Rule | Description |
|------|-------------|
| Date Range | End date must be after start date |
| Balance Check | Cannot exceed available balance |
| Overlap Check | Cannot overlap with existing leaves |
| Advance Notice | Must submit 3 days in advance (except medical) |
| Medical Proof | Required for medical/maternity leave |

**Step 6: Page Layout Structure**

```
┌─────────────────────────────────────────┐
│  Request Leave              [Cancel]    │
├─────────────────────────────────────────┤
│  Available Balance:                     │
│  Annual: 10 days | Casual: 5 days       │
├─────────────────────────────────────────┤
│  Leave Type: [Select Type ▼]            │
│                                         │
│  Date Range:                            │
│  From: [DD/MM/YYYY]  To: [DD/MM/YYYY]   │
│  □ Half Day (Start/End)                 │
│                                         │
│  Total Days: 3 working days             │
│                                         │
│  Reason:                                │
│  ┌───────────────────────────────────┐ │
│  │                                   │ │
│  │                                   │ │
│  └───────────────────────────────────┘ │
│                                         │
│  Covering Person: [Select ▼]            │
│                                         │
│  Attachment: [Choose File]              │
│                                         │
│                    [Submit Request]     │
└─────────────────────────────────────────┘
```

**Step 7: Submission Flow**

```
[Request Form]
      │
      ├──> Validate Form
      │    ├── Check required fields
      │    ├── Validate date range
      │    └── Check leave balance
      │
      ├──> Calculate Working Days
      │    └── Exclude weekends/holidays
      │
      ├──> Submit Request
      │    ├── Send to API
      │    └── Notify manager
      │
      └──> Show Confirmation
           └── Redirect to leave dashboard
```

### Expected Outcome

Leave request page accessible at /leave/request route. Page displays form with all necessary fields for submitting leave requests, including validation rules and balance checking.

### Verification Checklist

- [ ] Route directory created (request)
- [ ] Page file created in request/page.tsx
- [ ] Form structure rendered correctly
- [ ] All required fields present
- [ ] Route accessible via navigation

---

## Task 10: Create Payroll Page Route

### Overview

Create the main payroll dashboard page showing payroll overview, recent payroll runs, and payroll summary statistics. This is the landing page for payroll management at /payroll.

### Dependencies

- **Requires:** Task 01 (HR route directories)
- **Blocks:** Tasks 11-12 (payroll sub-routes)

### Instructions

**Step 1: Create Page File**

Inside the payroll directory, create a page.tsx file.

**Step 2: Define Page Structure**

Plan the payroll dashboard components:

| Section | Purpose |
|---------|---------|
| Header | Title and run payroll button |
| Summary Cards | Total payroll, pending, processed |
| Periods Table | Recent payroll periods |
| Quick Stats | Monthly costs, employee count |
| Recent Activity | Recent payroll actions |

**Step 3: Summary Metrics**

Key metrics to display:

| Metric | Description | Format |
|--------|-------------|--------|
| Total Payroll | Current period total | LKR 5,250,000.00 |
| Pending | Periods not yet processed | 1 period |
| Processed | Completed this month | 1 period |
| Employees | Active employees | 45 employees |

**Step 4: Payroll Periods Table**

```
┌──────────────────────────────────────────────────────────────┐
│ Period       │ Employees │ Total Amount    │ Status     │    │
├──────────────────────────────────────────────────────────────┤
│ Jan 2026     │    45     │ LKR 5,250,000   │ Completed  │ [→]│
│ Dec 2025     │    43     │ LKR 4,980,000   │ Completed  │ [→]│
│ Nov 2025     │    42     │ LKR 4,850,000   │ Completed  │ [→]│
│ Oct 2025     │    40     │ LKR 4,600,000   │ Completed  │ [→]│
└──────────────────────────────────────────────────────────────┘
```

**Step 5: Page Layout Structure**

```
┌─────────────────────────────────────────┐
│  Payroll              [+ Run Payroll]   │
├─────────────────────────────────────────┤
│  ┌──────────┐ ┌──────────┐ ┌─────────┐ │
│  │   LKR    │ │ Pending  │ │Process- │ │
│  │5,250,000 │ │    1     │ │ed: 1    │ │
│  └──────────┘ └──────────┘ └─────────┘ │
├─────────────────────────────────────────┤
│  Payroll Periods:                       │
│  [Periods Table...]                     │
├─────────────────────────────────────────┤
│  Quick Stats:                           │
│  Average Salary: LKR 116,667            │
│  Total Employees: 45                    │
│  EPF Contribution: LKR 630,000          │
│  ETF Contribution: LKR 157,500          │
└─────────────────────────────────────────┘
```

**Step 6: Sri Lankan Payroll Components**

```
Payroll Calculation Breakdown:
  │
  ├── Basic Salary (100%)
  │
  ├── Allowances
  │   ├── Transport Allowance
  │   ├── Meal Allowance
  │   └── Other Allowances
  │
  ├── Deductions
  │   ├── EPF (8% employee contribution)
  │   ├── PAYE (Income Tax)
  │   └── Other Deductions
  │
  └── Employer Contributions
      ├── EPF (12% employer)
      └── ETF (3% employer)
```

### Expected Outcome

Payroll page accessible at /payroll route. Page displays payroll dashboard with summary cards, periods table, and quick statistics showing Sri Lankan payroll components.

### Verification Checklist

- [ ] Page file created at payroll/page.tsx
- [ ] Component exports default function
- [ ] Route accessible via navigation
- [ ] Dashboard structure rendered
- [ ] Summary sections visible

---

## Task 11: Create Payroll Run Page Route

### Overview

Create the payroll run wizard page for processing new payroll periods. This page guides users through period selection, employee verification, calculation review, and final processing at /payroll/run.

### Dependencies

- **Requires:** Task 10 (payroll page route)
- **Blocks:** None (independent component)

### Instructions

**Step 1: Create Route Directory**

Inside the payroll directory, create a run folder.

**Step 2: Create Page File**

Inside the run directory, create a page.tsx file.

**Step 3: Define Wizard Steps**

Multi-step wizard structure:

| Step | Title | Purpose |
|------|-------|---------|
| 1 | Select Period | Choose month/year to process |
| 2 | Select Employees | Confirm employees to include |
| 3 | Review Calculations | Verify salary calculations |
| 4 | Confirm Processing | Final review and submit |

**Step 4: Wizard Flow Diagram**

```
[Start Payroll Run]
         │
         ▼
   ┌──────────────────┐
   │ Step 1: Period   │
   │ Select: Jan 2026 │
   └────────┬─────────┘
            │
            ▼
   ┌──────────────────┐
   │ Step 2: Employees│
   │ Select: 45/45    │
   │ □ Select All     │
   │ ☑ John Doe       │
   │ ☑ Jane Smith     │
   │ ☐ Bob (On Leave) │
   └────────┬─────────┘
            │
            ▼
   ┌──────────────────┐
   │ Step 3: Review   │
   │ Calculations     │
   │                  │
   │ Total: LKR 5.2M  │
   │ EPF: LKR 630K    │
   │ ETF: LKR 157.5K  │
   └────────┬─────────┘
            │
            ▼
   ┌──────────────────┐
   │ Step 4: Confirm  │
   │ [Process Payroll]│
   └────────┬─────────┘
            │
            ▼
     [Processing...]
            │
            ▼
      [Completed!]
```

**Step 5: Page Layout Structure**

```
┌─────────────────────────────────────────┐
│  Run Payroll                            │
│  ● Period  ○ Employees  ○ Review  ○ Done│
├─────────────────────────────────────────┤
│                                         │
│  Step 1: Select Payroll Period          │
│                                         │
│  Month: [January ▼]  Year: [2026 ▼]    │
│                                         │
│  Period: 01-Jan-2026 to 31-Jan-2026     │
│  Working Days: 22                       │
│                                         │
│  Employees in Period: 45                │
│                                         │
│                                         │
│              [Cancel]  [Next Step →]    │
└─────────────────────────────────────────┘
```

**Step 6: Calculation Review Table**

```
┌────────────────────────────────────────────────────────┐
│ Employee     │ Basic   │ Allow. │ Deduct. │ Net Pay   │
├────────────────────────────────────────────────────────┤
│ John Doe     │ 150,000 │ 25,000 │ 23,000  │ 152,000   │
│ Jane Smith   │ 120,000 │ 20,000 │ 18,400  │ 121,600   │
│ Bob Johnson  │ 100,000 │ 15,000 │ 14,600  │ 100,400   │
│ ...          │         │        │         │           │
├────────────────────────────────────────────────────────┤
│ TOTAL        │4,500,000│ 750,000│ 563,000 │4,687,000  │
└────────────────────────────────────────────────────────┘

Employer Contributions:
  EPF (12%): LKR 630,000
  ETF (3%):  LKR 157,500
  ────────────────────────
  TOTAL:     LKR 787,500
```

### Expected Outcome

Payroll run page accessible at /payroll/run route. Page displays wizard interface guiding users through payroll processing steps with calculation previews and confirmation.

### Verification Checklist

- [ ] Route directory created (run)
- [ ] Page file created in run/page.tsx
- [ ] Wizard structure implemented
- [ ] Step navigation visible
- [ ] Route accessible via navigation

---

## Task 12: Create Payslip Details Page Route

### Overview

Create the dynamic payslip details page showing complete payslip information for a specific employee and period. Accessible at /payroll/[id] where [id] is the payslip identifier.

### Dependencies

- **Requires:** Task 10 (payroll page route)
- **Blocks:** None (independent component)

### Instructions

**Step 1: Create Dynamic Route Directory**

Inside the payroll directory, create a [id] folder.

**Step 2: Create Page File**

Inside the [id] directory, create a page.tsx file.

**Step 3: Define Payslip Structure**

Payslip sections to display:

| Section | Content |
|---------|---------|
| Header | Company info, employee info, period |
| Earnings | Basic salary, allowances breakdown |
| Deductions | EPF, PAYE, other deductions |
| Summary | Gross pay, total deductions, net pay |
| Footer | Employer contributions, signature |

**Step 4: Payslip Layout**

```
┌─────────────────────────────────────────┐
│         COMPANY NAME PVT LTD            │
│         Payslip - January 2026          │
├─────────────────────────────────────────┤
│ Employee: John Doe                      │
│ ID: EMP001 | Position: Software Engineer│
│ Department: IT | NIC: 199012345678V     │
│ EPF No: EPF123456 | ETF No: ETF123456   │
├─────────────────────────────────────────┤
│ EARNINGS:                   Amount (LKR)│
│ ─────────────────────────────────────── │
│ Basic Salary                    150,000 │
│ Transport Allowance              15,000 │
│ Meal Allowance                   10,000 │
│                                ───────── │
│ Gross Earnings                  175,000 │
├─────────────────────────────────────────┤
│ DEDUCTIONS:                              │
│ ─────────────────────────────────────── │
│ EPF (8%)                         14,000 │
│ PAYE                              9,000 │
│                                ───────── │
│ Total Deductions                 23,000 │
├─────────────────────────────────────────┤
│ NET PAY:                        152,000 │
├─────────────────────────────────────────┤
│ EMPLOYER CONTRIBUTIONS:                  │
│ EPF (12%)                        21,000 │
│ ETF (3%)                          5,250 │
│                                         │
│                       [Download PDF]    │
└─────────────────────────────────────────┘
```

**Step 5: Data Flow**

```
[Payslip Page]
      │
      ├──> Extract Payslip ID from params
      │
      ├──> Fetch Payslip Data
      │    ├── Employee Info
      │    ├── Period Info
      │    ├── Earnings Details
      │    └── Deductions Details
      │
      ├──> Calculate Totals
      │    ├── Gross Earnings
      │    ├── Total Deductions
      │    └── Net Pay
      │
      └──> Display Payslip
           └── Enable PDF download
```

**Step 6: Sri Lankan Payroll Calculations**

```
Calculation Example:
  Basic Salary:        LKR 150,000
  Transport Allow:     LKR  15,000
  Meal Allowance:      LKR  10,000
  ────────────────────────────────
  Gross Salary:        LKR 175,000

  Deductions:
    EPF (8%):          LKR  14,000
    PAYE:              LKR   9,000
  ────────────────────────────────
  Total Deductions:    LKR  23,000

  Net Pay:             LKR 152,000

  Employer Contributions:
    EPF (12%):         LKR  21,000
    ETF (3%):          LKR   5,250
```

### Expected Outcome

Payslip details page accessible at /payroll/[id] route. Page displays complete payslip with earnings, deductions, and Sri Lankan statutory calculations formatted for printing or PDF download.

### Verification Checklist

- [ ] Dynamic route directory created ([id])
- [ ] Page file created in [id]/page.tsx
- [ ] Payslip structure rendered
- [ ] All sections visible
- [ ] Route accessible with any ID

---

## Task 13: Configure Page Metadata

### Overview

Configure SEO metadata for all HR pages to improve discoverability and provide proper page titles and descriptions. Uses Next.js metadata API to set static and dynamic metadata.

### Dependencies

- **Requires:** Task 01 (HR route directories)
- **Blocks:** None (enhancement)

### Instructions

**Step 1: Understand Metadata Types**

Next.js supports two metadata approaches:

| Type | Use Case |
|------|----------|
| Static Metadata | Pages with fixed titles (list pages) |
| Dynamic Metadata | Pages with variable titles (detail pages) |

**Step 2: Define Metadata for Each Page**

| Route | Title | Description |
|-------|-------|-------------|
| /employees | Employees - HR Management | Employee directory and management system |
| /employees/[id] | Employee Name - Profile | View and manage employee information |
| /employees/new | New Employee - HR | Add new employee to the organization |
| /employees/org-chart | Organization Chart - HR | Visual representation of company structure |
| /attendance | Attendance Dashboard - HR | Track and manage employee attendance |
| /attendance/report | Attendance Report - HR | Generate detailed attendance reports |
| /leave | Leave Management - HR | Manage employee leave requests and balances |
| /leave/request | Request Leave - HR | Submit new leave request |
| /payroll | Payroll Dashboard - HR | Manage payroll processing and payments |
| /payroll/run | Run Payroll - HR | Process payroll for selected period |
| /payroll/[id] | Payslip - Employee Name | View detailed payslip information |

**Step 3: Metadata Configuration Structure**

For static metadata, export metadata object:

```
Metadata Object Properties:
  ├── title: string
  ├── description: string
  ├── openGraph
  │   ├── title: string
  │   ├── description: string
  │   └── type: 'website'
  └── robots
      ├── index: boolean
      └── follow: boolean
```

**Step 4: Dynamic Metadata Approach**

For pages with dynamic content ([id] routes):

```
Dynamic Metadata Flow:
  │
  ├──> Extract parameters (id, slug, etc.)
  │
  ├──> Fetch data if needed
  │
  ├──> Generate metadata object
  │    ├── Use data in title
  │    └── Create dynamic description
  │
  └──> Return metadata
```

**Step 5: Example Metadata Configurations**

Static page metadata structure:

```
Page: /employees
Title: "Employees - HR Management | Company Name"
Description: "View and manage all employees in the organization. Access employee directory, add new employees, and view organizational structure."
Keywords: employees, staff, directory, HR, management
```

Dynamic page metadata structure:

```
Page: /employees/[id]
Title: "[Employee Name] - Employee Profile | Company Name"
Description: "View detailed information for [Employee Name] including personal info, employment details, and performance records."
Data Required: Employee name from API
```

**Step 6: Implementation Checklist**

Pages requiring metadata configuration:

```
Static Metadata:
  ☐ /employees/page.tsx
  ☐ /employees/new/page.tsx
  ☐ /employees/org-chart/page.tsx
  ☐ /attendance/page.tsx
  ☐ /attendance/report/page.tsx
  ☐ /leave/page.tsx
  ☐ /leave/request/page.tsx
  ☐ /payroll/page.tsx
  ☐ /payroll/run/page.tsx

Dynamic Metadata:
  ☐ /employees/[id]/page.tsx
  ☐ /payroll/[id]/page.tsx
```

### Expected Outcome

All HR pages have proper metadata configured. Page titles display correctly in browser tabs. Search engines can properly index and describe each page. Dynamic pages show appropriate titles based on content.

### Verification Checklist

- [ ] Metadata configured for all pages
- [ ] Page titles visible in browser tabs
- [ ] Descriptions appropriate for content
- [ ] Dynamic pages show correct titles
- [ ] OpenGraph metadata included

---

## Task 14: Create HR Loading States

### Overview

Implement loading states for all HR pages using Next.js loading.tsx convention. Creates skeleton loaders that display while page content is being fetched, improving perceived performance.

### Dependencies

- **Requires:** Task 01 (HR route directories)
- **Blocks:** None (enhancement)

### Instructions

**Step 1: Understand Loading State Locations**

Loading files needed at route segment level:

| Route | Loading File Location |
|-------|----------------------|
| /employees | employees/loading.tsx |
| /employees/[id] | employees/[id]/loading.tsx |
| /attendance | attendance/loading.tsx |
| /leave | leave/loading.tsx |
| /payroll | payroll/loading.tsx |

**Step 2: Define Loading State Patterns**

Different loading states for different layouts:

| Layout Type | Loading Pattern |
|-------------|----------------|
| Dashboard | Skeleton cards and table |
| Form | Skeleton form fields |
| Details | Skeleton header and tabs |
| Table | Skeleton rows |
| Calendar | Skeleton grid |

**Step 3: Employees List Loading State**

```
┌─────────────────────────────────────────┐
│  ████████              [████████]       │
├─────────────────────────────────────────┤
│  ┌──────┐  ┌──────┐  ┌──────┐          │
│  │██████│  │██████│  │██████│          │
│  │██████│  │██████│  │██████│          │
│  └──────┘  └──────┘  └──────┘          │
├─────────────────────────────────────────┤
│  [██████] [████]                        │
├─────────────────────────────────────────┤
│  ┌────┐  ████████  ████████             │
│  │████│  ████████  ████████             │
│  └────┘                                 │
│                                         │
│  ┌────┐  ████████  ████████             │
│  │████│  ████████  ████████             │
│  └────┘                                 │
│                                         │
│  (Skeleton continues...)                │
└─────────────────────────────────────────┘
```

**Step 4: Dashboard Loading State**

```
┌─────────────────────────────────────────┐
│  ████████              [████████]       │
├─────────────────────────────────────────┤
│  ┌────────────┐ ┌────────────┐         │
│  │ ██████     │ │ ██████     │         │
│  │ ████████   │ │ ████████   │         │
│  └────────────┘ └────────────┘         │
├─────────────────────────────────────────┤
│  ████████████████                       │
│  ┌───────────────────────────────────┐ │
│  │ ████  ████  ████  ████            │ │
│  │ ████  ████  ████  ████            │ │
│  │ ████  ████  ████  ████            │ │
│  └───────────────────────────────────┘ │
└─────────────────────────────────────────┘
```

**Step 5: Form Loading State**

```
┌─────────────────────────────────────────┐
│  ███████████            [████] [████]   │
├─────────────────────────────────────────┤
│  ████████████████                       │
│  ┌───────────────────────────────────┐ │
│  │ ████████████████                  │ │
│  └───────────────────────────────────┘ │
│                                         │
│  ████████████████                       │
│  ┌───────────────────────────────────┐ │
│  │ ████████████████                  │ │
│  └───────────────────────────────────┘ │
│                                         │
│  ████████████████                       │
│  ┌───────────────────────────────────┐ │
│  │ ████████████████                  │ │
│  └───────────────────────────────────┘ │
│                                         │
│                         [████████████]  │
└─────────────────────────────────────────┘
```

**Step 6: Implementation Strategy**

For each loading.tsx file:

- Use Skeleton components from UI library
- Match layout of actual page
- Animate pulse or shimmer effect
- Keep loading simple and fast

**Step 7: Loading Files Checklist**

```
Loading States Required:
  ☐ employees/loading.tsx (cards skeleton)
  ☐ employees/[id]/loading.tsx (profile skeleton)
  ☐ employees/new/loading.tsx (form skeleton)
  ☐ employees/org-chart/loading.tsx (tree skeleton)
  ☐ attendance/loading.tsx (calendar skeleton)
  ☐ attendance/report/loading.tsx (table skeleton)
  ☐ leave/loading.tsx (dashboard skeleton)
  ☐ leave/request/loading.tsx (form skeleton)
  ☐ payroll/loading.tsx (dashboard skeleton)
  ☐ payroll/run/loading.tsx (wizard skeleton)
  ☐ payroll/[id]/loading.tsx (payslip skeleton)
```

### Expected Outcome

All HR pages show appropriate loading states while content is being fetched. Users see skeleton placeholders instead of blank pages. Loading states match the final layout structure for smooth transition.

### Verification Checklist

- [ ] Loading files created for all routes
- [ ] Skeletons match page layouts
- [ ] Smooth transition to actual content
- [ ] Loading states render quickly
- [ ] Appropriate animation applied

---

## Task 15: Create HR Error Boundaries

### Overview

Implement error boundaries for all HR pages using Next.js error.tsx convention. Provides graceful error handling and recovery options when page components fail to render or data fetching errors occur.

### Dependencies

- **Requires:** Task 01 (HR route directories)
- **Blocks:** Task 16 (verification requires error handling)

### Instructions

**Step 1: Understand Error Boundary Locations**

Error files needed at route segment level:

| Route | Error File Location |
|-------|---------------------|
| /employees | employees/error.tsx |
| /attendance | attendance/error.tsx |
| /leave | leave/error.tsx |
| /payroll | payroll/error.tsx |

**Step 2: Error Boundary Structure**

Each error component receives:

| Prop | Type | Description |
|------|------|-------------|
| error | Error | Error object with message and stack |
| reset | Function | Function to reset error boundary |

**Step 3: Error Display Layout**

```
┌─────────────────────────────────────────┐
│            [⚠️ ERROR ICON]              │
│                                         │
│        Something went wrong!            │
│                                         │
│  We couldn't load the requested page.   │
│  This might be due to a network issue   │
│  or a problem with our servers.         │
│                                         │
│  Error Details:                         │
│  ┌───────────────────────────────────┐ │
│  │ Failed to fetch employee data     │ │
│  └───────────────────────────────────┘ │
│                                         │
│        [Try Again]  [Go to Dashboard]  │
└─────────────────────────────────────────┘
```

**Step 4: Error Types to Handle**

Common errors in HR module:

| Error Type | Cause | Recovery Action |
|------------|-------|-----------------|
| Network Error | API unreachable | Retry request |
| 404 Not Found | Invalid ID | Go back or home |
| 403 Forbidden | No permission | Show message, go home |
| 500 Server Error | Backend issue | Retry or contact support |
| Validation Error | Invalid data | Show form errors |

**Step 5: Error Recovery Actions**

```
Error Handling Flow:
  │
  ├──> Catch Error
  │
  ├──> Log Error
  │    ├── Console log (development)
  │    └── Error tracking service (production)
  │
  ├──> Display User-Friendly Message
  │    ├── Hide technical details
  │    └── Show actionable message
  │
  └──> Provide Recovery Options
       ├── Try Again (reset boundary)
       ├── Go Back (navigation)
       └── Contact Support (help link)
```

**Step 6: Error Component Features**

Each error boundary should include:

- Clear error icon or illustration
- User-friendly error message
- Technical error message (collapsed/hideable)
- Reset button to retry
- Navigation button to return to safety
- Optional error ID for support

**Step 7: Error Files Checklist**

```
Error Boundaries Required:
  ☐ employees/error.tsx
  ☐ attendance/error.tsx
  ☐ leave/error.tsx
  ☐ payroll/error.tsx
```

**Step 8: User-Friendly Error Messages**

| Technical Error | User Message |
|----------------|--------------|
| Failed to fetch | We couldn't load the data. Please check your connection and try again. |
| 404 Not Found | The requested resource was not found. It may have been deleted or moved. |
| 403 Forbidden | You don't have permission to access this page. Contact your administrator. |
| 500 Internal Server Error | Something went wrong on our end. We're working to fix it. |
| Validation failed | Please check your input and try again. |

### Expected Outcome

All HR sections have error boundaries that catch and display errors gracefully. Users see helpful error messages instead of blank pages or technical stack traces. Recovery options allow users to retry or navigate to safety.

### Verification Checklist

- [ ] Error files created for all main routes
- [ ] Error components handle errors correctly
- [ ] User-friendly messages displayed
- [ ] Reset functionality works
- [ ] Navigation options provided

---

## Task 16: Verify Route Structure

### Overview

Perform comprehensive verification of the complete HR route structure. Test all routes are accessible, loading states work correctly, error boundaries catch errors appropriately, and navigation flows properly.

### Dependencies

- **Requires:** Task 15 (error boundaries)
- **Blocks:** None (final verification)

### Instructions

**Step 1: Route Accessibility Testing**

Verify each route is accessible:

```
Route Verification Checklist:

Employees Module:
  ☐ /employees → Loads list page
  ☐ /employees/new → Loads form page
  ☐ /employees/[id] → Loads detail page
  ☐ /employees/org-chart → Loads chart page

Attendance Module:
  ☐ /attendance → Loads dashboard
  ☐ /attendance/report → Loads report page

Leave Module:
  ☐ /leave → Loads dashboard
  ☐ /leave/request → Loads request form

Payroll Module:
  ☐ /payroll → Loads dashboard
  ☐ /payroll/run → Loads wizard
  ☐ /payroll/[id] → Loads payslip
```

**Step 2: Loading States Verification**

Test loading states display correctly:

| Route | Loading Test |
|-------|-------------|
| /employees | Navigate and observe skeleton |
| /employees/[id] | Navigate with ID and observe skeleton |
| /attendance | Navigate and observe skeleton |
| /leave | Navigate and observe skeleton |
| /payroll | Navigate and observe skeleton |

**Step 3: Error Boundary Testing**

Trigger errors to verify boundaries:

```
Error Testing Scenarios:

Scenario 1: Invalid ID
  ☐ Navigate to /employees/invalid-id
  ☐ Error boundary displays
  ☐ Error message shown
  ☐ Reset button works

Scenario 2: Network Failure
  ☐ Disconnect network
  ☐ Navigate to any page
  ☐ Error boundary displays
  ☐ Retry button available

Scenario 3: Component Error
  ☐ Force component error
  ☐ Error boundary catches
  ☐ User-friendly message shown
  ☐ Navigation options available
```

**Step 4: Metadata Verification**

Check metadata is properly configured:

```
Metadata Testing:
  │
  ├──> Check Browser Tab Titles
  │    ☐ Each page shows correct title
  │    ☐ Dynamic pages show correct names
  │
  ├──> Inspect Meta Tags
  │    ☐ Description tags present
  │    ☐ OpenGraph tags configured
  │
  └──> Test SEO
       ☐ Pages indexable
       ☐ Descriptions appropriate
```

**Step 5: Navigation Flow Testing**

Test navigation between pages:

```
Navigation Path Testing:

Path 1: Employee Management Flow
  Dashboard → Employees → Employee Details → Edit

Path 2: Attendance Flow
  Dashboard → Attendance → Attendance Report → Export

Path 3: Leave Flow
  Dashboard → Leave → Request Leave → Submit

Path 4: Payroll Flow
  Dashboard → Payroll → Run Payroll → Review → Process
```

**Step 6: Dynamic Route Testing**

Test dynamic routes with various parameters:

| Route Pattern | Test Cases |
|--------------|------------|
| /employees/[id] | Valid ID, Invalid ID, Non-existent ID |
| /payroll/[id] | Valid ID, Invalid ID, Missing ID |

**Step 7: File Structure Verification**

Confirm all files exist and are properly organized:

```
File Structure Checklist:
app/(dashboard)/
  ├── employees/
  │   ├── page.tsx ✓
  │   ├── loading.tsx ✓
  │   ├── error.tsx ✓
  │   ├── new/
  │   │   ├── page.tsx ✓
  │   │   └── loading.tsx ✓
  │   ├── org-chart/
  │   │   ├── page.tsx ✓
  │   │   └── loading.tsx ✓
  │   └── [id]/
  │       ├── page.tsx ✓
  │       ├── loading.tsx ✓
  │       └── error.tsx ✓
  ├── attendance/
  │   ├── page.tsx ✓
  │   ├── loading.tsx ✓
  │   ├── error.tsx ✓
  │   └── report/
  │       ├── page.tsx ✓
  │       └── loading.tsx ✓
  ├── leave/
  │   ├── page.tsx ✓
  │   ├── loading.tsx ✓
  │   ├── error.tsx ✓
  │   └── request/
  │       ├── page.tsx ✓
  │       └── loading.tsx ✓
  └── payroll/
      ├── page.tsx ✓
      ├── loading.tsx ✓
      ├── error.tsx ✓
      ├── run/
      │   ├── page.tsx ✓
      │   └── loading.tsx ✓
      └── [id]/
          ├── page.tsx ✓
          └── loading.tsx ✓
```

**Step 8: Performance Testing**

Verify page performance:

```
Performance Checks:
  ☐ Pages load within acceptable time
  ☐ Loading states display immediately
  ☐ No console errors in browser
  ☐ No React hydration errors
  ☐ Smooth transitions between pages
```

**Step 9: Responsive Design Verification**

Test routes on different screen sizes:

| Screen Size | Test |
|------------|------|
| Desktop (1920x1080) | All layouts render correctly |
| Tablet (768x1024) | Mobile-friendly layouts |
| Mobile (375x667) | Touch-friendly controls |

**Step 10: Final Acceptance Criteria**

```
Route Structure Acceptance:

Must Have:
  ✓ All routes accessible
  ✓ Loading states working
  ✓ Error boundaries functional
  ✓ Metadata configured
  ✓ Navigation flows correctly
  ✓ No console errors
  ✓ Proper file organization

Should Have:
  ○ SEO optimized
  ○ Performance optimized
  ○ Responsive design
  ○ Accessibility features

Nice to Have:
  ○ Page transitions
  ○ Route prefetching
  ○ Advanced error recovery
```

### Expected Outcome

Complete HR route structure verified and functional. All routes accessible with proper loading states and error handling. Navigation flows smoothly between pages. File structure organized correctly following Next.js conventions.

### Verification Checklist

- [ ] All routes accessible and working
- [ ] Loading states display correctly
- [ ] Error boundaries catch errors
- [ ] Metadata showing in browser
- [ ] Navigation paths functional
- [ ] Dynamic routes working with parameters
- [ ] File structure organized properly
- [ ] No console errors or warnings
- [ ] Performance acceptable
- [ ] Ready for component implementation

---

## Summary

This document completed the HR route structure by implementing payroll routes, configuring metadata, and adding infrastructure. Created leave request submission page with comprehensive form validation. Built payroll dashboard, multi-step payroll run wizard, and detailed payslip view with Sri Lankan payroll calculations. Configured SEO metadata for all pages with static and dynamic metadata approaches. Implemented loading states using skeleton loaders matching each page layout. Created error boundaries with user-friendly error messages and recovery options. Performed comprehensive verification testing ensuring all routes are accessible, loading states work, error boundaries catch errors, and navigation flows correctly.

The complete HR route structure now includes 11 pages across four main sections with proper metadata, loading states, and error handling. All routes follow Next.js App Router conventions and are ready for component implementation in subsequent groups.

### Route Structure Summary

```
Total Routes Created: 11
  ├── Employees: 4 routes
  ├── Attendance: 2 routes  
  ├── Leave: 2 routes
  └── Payroll: 3 routes

Infrastructure Added:
  ├── Loading States: 11 files
  ├── Error Boundaries: 4 files
  └── Metadata: 11 configurations
```

### What's Next

Group B (Employee Management) will implement the actual components for employee listing, cards, table views, profile pages, and organizational chart visualization using the route structure created in this group.

---

**Document Status:** Ready for Implementation  
**Last Updated:** 2026-01-26
