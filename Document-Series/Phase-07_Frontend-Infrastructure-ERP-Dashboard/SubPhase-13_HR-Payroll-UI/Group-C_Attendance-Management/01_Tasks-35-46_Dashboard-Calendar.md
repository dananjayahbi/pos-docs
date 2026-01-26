# Tasks 35-46: Attendance Dashboard & Calendar

> **Phase:** 07 - Frontend Infrastructure & ERP Dashboard  
> **SubPhase:** 13 - HR & Payroll UI  
> **Group:** C - Attendance Management  
> **Document:** 01 of 02  
> **Tasks Covered:** 35-46

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Group:** [Group-B_Employee-Management](../Group-B_Employee-Management/)
- **→ Next Document:** [02_Tasks-47-52_ClockIn-Reports.md](02_Tasks-47-52_ClockIn-Reports.md)
- **⊚ SubPhase Tasks:** [00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)

---

## Document Overview

This document creates the attendance dashboard with calendar visualization and daily attendance tracking. Builds the main attendance page with header and date navigation. Implements summary cards showing today's attendance metrics (present, absent, late). Creates monthly calendar view with color-coded attendance status for each day. Builds daily attendance list showing detailed check-in/out times. Includes manual entry modal for attendance corrections.

### Tasks in This Document

| Task # | Task Name | Complexity | Dependencies |
|--------|-----------|------------|--------------|
| 35 | Create Attendance Page | Low | Task 16 |
| 36 | Create Attendance Header | Low | Task 35 |
| 37 | Create Today Summary Cards | Medium | Task 35 |
| 38 | Create Present Count Card | Low | Task 37 |
| 39 | Create Absent Count Card | Low | Task 37 |
| 40 | Create Late Count Card | Low | Task 37 |
| 41 | Create Attendance Calendar | Medium | Task 35 |
| 42 | Create Calendar Day Cell | Medium | Task 41 |
| 43 | Create Attendance Legend | Low | Task 41 |
| 44 | Create Daily Attendance List | Medium | Task 35 |
| 45 | Create Attendance Row | Low | Task 44 |
| 46 | Create Manual Entry Modal | Medium | Task 44 |

---

## Task 35: Create Attendance Page

### Overview

Build the main attendance dashboard page serving as the central hub for attendance tracking. This page displays attendance overview with calendar visualization, daily lists, and quick actions for attendance management.

### Dependencies

- **Requires:** Task 16 (route structure)
- **Blocks:** Tasks 36-46 (all attendance components)

### Instructions

**Step 1: Define Page Layout Structure**

The attendance page contains these main sections:

| Section | Purpose | Position |
|---------|---------|----------|
| Header | Title, date nav, actions | Top |
| Summary Cards | Today's metrics | Below header |
| Calendar | Monthly view | Main left |
| Daily List | Today's details | Main right |
| Filters | Filter controls | Below summary |

**Step 2: Page Layout**

```
┌─────────────────────────────────────────────────────┐
│  [Attendance Header]                                │
│  Date: Wednesday, 26 January 2026      [← Today →]  │
├─────────────────────────────────────────────────────┤
│  [Today Summary Cards]                              │
│  [Present: 45] [Absent: 5] [Late: 3]               │
├─────────────────────────────────────────────────────┤
│  [Filters]                                          │
│  [Department ▼] [Status ▼]                         │
├─────────────────────────────────────────────────────┤
│ Calendar View           │  Daily Attendance          │
│ ┌──────────────────┐    │  ┌───────────────────┐    │
│ │ [Monthly]        │    │  │ Today's List      │    │
│ │                  │    │  │                   │    │
│ │ [Color Grid]     │    │  │ [Check-ins/outs]  │    │
│ │                  │    │  │                   │    │
│ └──────────────────┘    │  └───────────────────┘    │
│ [Legend]                │                            │
└─────────────────────────────────────────────────────┘
```

**Step 3: State Management**

```
Attendance Page State:
{
  selectedDate: Date,
  currentMonth: Date,
  attendanceData: Array,
  summaryMetrics: {
    present: number,
    absent: number,
    late: number,
    leave: number
  },
  filters: {
    department: string,
    status: string
  },
  loading: boolean
}
```

**Step 4: Data Fetching Flow**

```
[Page Load]
      │
      ├──> Set Default Date (Today)
      │
      ├──> Fetch Month Attendance
      │    └──> GET /api/attendance/month/:month
      │
      ├──> Fetch Today Summary
      │    └──> GET /api/attendance/summary/today
      │
      ├──> Fetch Daily List
      │    └──> GET /api/attendance/daily/:date
      │
      └──> Render Components
```

**Step 5: Responsive Grid**

```
Desktop (>1024px): Two columns
┌──────────────────┬──────────────┐
│ Calendar (60%)   │ Daily (40%)  │
│                  │              │
└──────────────────┴──────────────┘

Mobile (<768px): Stacked
┌─────────────────────────────────┐
│ Summary Cards                   │
├─────────────────────────────────┤
│ Daily List (Today)              │
├─────────────────────────────────┤
│ [View Calendar] button          │
│ → Opens fullscreen calendar     │
└─────────────────────────────────┘
```

### Expected Outcome

Attendance page created with proper layout structure. Page displays summary metrics, monthly calendar, and daily attendance list. Date navigation allows viewing different dates and months.

### Verification Checklist

- [ ] Page component created
- [ ] Layout structure implemented
- [ ] Data fetching working
- [ ] Date navigation functional
- [ ] Responsive layout

---

## Task 36: Create Attendance Header

### Overview

Build the attendance header displaying page title, current date, date navigation controls, and quick action buttons for attendance management.

### Dependencies

- **Requires:** Task 35 (attendance page)
- **Blocks:** None

### Instructions

**Step 1: Header Layout**

```
┌─────────────────────────────────────────────────────┐
│  Attendance                          [Actions ▼]    │
│  Wednesday, 26 January 2026  [← Today →]            │
└─────────────────────────────────────────────────────┘
```

**Step 2: Date Navigation**

```
Date Controls:
  ├──> Previous Day [←]
  ├──> Today Button
  ├──> Next Day [→]
  └──> Date Picker (click date to open)

Navigation Flow:
  [←] → Go to yesterday
  [Today] → Jump to current date
  [→] → Go to tomorrow
  [Date] → Open calendar picker
```

**Step 3: Actions Dropdown**

```
[Actions ▼]
    ├──> Manual Entry
    ├──> Import Attendance (CSV)
    ├──> Export Month
    └──> Attendance Settings
```

### Expected Outcome

Header displays page title and current date with navigation controls. Actions menu provides quick access to common attendance functions.

### Verification Checklist

- [ ] Header component created
- [ ] Date display formatted
- [ ] Navigation controls working
- [ ] Actions menu functional

---

## Task 37: Create Today Summary Cards

### Overview

Build container component for summary cards displaying today's attendance metrics with visual indicators and trend comparisons.

### Dependencies

- **Requires:** Task 35 (attendance page)
- **Blocks:** Tasks 38-40 (individual cards)

### Instructions

**Step 1: Cards Grid Layout**

```
┌───────────┬───────────┬───────────┬───────────┐
│ Present   │ Absent    │ Late      │ On Leave  │
│   45      │    5      │    3      │    2      │
│ ↑ +2      │ ↓ -1      │ → 0       │ ↑ +1      │
└───────────┴───────────┴───────────┴───────────┘
```

**Step 2: Metric Calculations**

```
Summary Metrics:
  │
  ├──> Present: status === 'present'
  ├──> Absent: status === 'absent'
  ├──> Late: status === 'late'
  └──> On Leave: status === 'leave'

Trends:
  Compare to yesterday:
  ├──> Positive: ↑ +X (green)
  ├──> Negative: ↓ -X (red)
  └──> No change: → 0 (gray)
```

**Step 3: Color Coding**

| Metric | Color | Icon |
|--------|-------|------|
| Present | Green (#10B981) | ✓ |
| Absent | Red (#EF4444) | ✗ |
| Late | Yellow (#F59E0B) | ⏰ |
| Leave | Blue (#3B82F6) | 📅 |

### Expected Outcome

Summary cards container displays four metric cards with current counts and trend indicators. Cards are responsive and color-coded.

### Verification Checklist

- [ ] Container created
- [ ] Grid layout responsive
- [ ] Metrics calculated correctly
- [ ] Trends displayed

---

## Task 38: Create Present Count Card

### Overview

Build the individual card component displaying count of employees present today with attendance percentage.

### Dependencies

- **Requires:** Task 37 (summary cards)
- **Blocks:** None

### Instructions

**Step 1: Card Structure**

```
┌─────────────────────┐
│ ✓ Present           │
│                     │
│       45            │
│     90.0%           │
│                     │
│  ↑ +2 vs yesterday  │
└─────────────────────┘
```

**Step 2: Percentage Calculation**

```
Attendance Rate:
  (Present / Total Employees) × 100
  
Example:
  45 present / 50 total = 90%
```

**Step 3: Status Indicator**

```
Good: ≥ 95% (Green)
Fair: 85-94% (Yellow)
Poor: < 85% (Red)
```

### Expected Outcome

Present count card displays number present with percentage and trend. Color indicates attendance rate status.

### Verification Checklist

- [ ] Card component created
- [ ] Count displayed
- [ ] Percentage calculated
- [ ] Trend indicator shown

---

## Task 39: Create Absent Count Card

### Overview

Build card displaying count of employees absent today with absence rate calculation.

### Dependencies

- **Requires:** Task 37 (summary cards)
- **Blocks:** None

### Instructions

**Step 1: Card Layout**

```
┌─────────────────────┐
│ ✗ Absent            │
│                     │
│        5            │
│     10.0%           │
│                     │
│  ↓ -1 vs yesterday  │
└─────────────────────┘
```

**Step 2: Absence Rate**

```
Absence Rate:
  (Absent / Total Employees) × 100
```

### Expected Outcome

Absent count card shows number absent with rate. Downward trend is positive (fewer absences).

### Verification Checklist

- [ ] Card displays absent count
- [ ] Rate calculated
- [ ] Trend shows correctly

---

## Task 40: Create Late Count Card

### Overview

Build card showing count of employees who arrived late today.

### Dependencies

- **Requires:** Task 37 (summary cards)
- **Blocks:** None

### Instructions

**Step 1: Card Display**

```
┌─────────────────────┐
│ ⏰ Late             │
│                     │
│        3            │
│      6.0%           │
│                     │
│  → 0 vs yesterday   │
└─────────────────────┘
```

**Step 2: Late Definition**

```
Late Criteria:
  Check-in time > 09:00 AM
  Grace Period: 15 minutes
  Counted Late: > 09:15 AM
```

### Expected Outcome

Late count card displays late arrivals with rate. Helps track punctuality trends.

### Verification Checklist

- [ ] Card shows late count
- [ ] Calculation correct
- [ ] Grace period applied

---

## Task 41: Create Attendance Calendar

### Overview

Build monthly calendar component visualizing attendance patterns with color-coded day cells showing attendance status.

### Dependencies

- **Requires:** Task 35 (attendance page)
- **Blocks:** Tasks 42-43 (calendar components)

### Instructions

**Step 1: Calendar Structure**

```
┌─────────────────────────────────────────────┐
│        January 2026              [< >]      │
├─────────────────────────────────────────────┤
│ Mon  Tue  Wed  Thu  Fri  Sat  Sun          │
├─────────────────────────────────────────────┤
│  -    -    1    2    3    4    5           │
│                [●] [●] [●] [ ] [ ]          │
│                                             │
│  6    7    8    9   10   11   12           │
│ [●]  [●]  [●]  [◐]  [●] [ ] [ ]            │
│                                             │
│ 13   14   15   16   17   18   19           │
│ [●]  [●]  [●]  [●]  [●] [ ] [ ]            │
│                                             │
│ 20   21   22   23   24   25   26           │
│ [○]  [●]  [●]  [●]  [●] [ ] [●]            │
│                                             │
│ 27   28   29   30   31    -    -           │
│ [●]  [●]  [●]  [●]  [●]   -    -           │
└─────────────────────────────────────────────┘
```

**Step 2: Data Structure**

```
Calendar Data:
{
  month: number,
  year: number,
  days: [
    {
      date: string,
      dayOfWeek: number,
      present: number,
      absent: number,
      late: number,
      leave: number,
      holiday: boolean,
      weekend: boolean
    }
  ]
}
```

**Step 3: Cell Color Logic**

```
Cell Background Color:
  │
  ├──> All Present → Green
  ├──> Some Absent → Yellow
  ├──> Many Absent → Orange
  ├──> Mostly Absent → Red
  ├──> Holiday → Purple
  └──> Weekend → Gray (light)
```

### Expected Outcome

Calendar displays month grid with color-coded cells showing daily attendance patterns. Clicking a cell shows detailed attendance for that day.

### Verification Checklist

- [ ] Calendar renders month grid
- [ ] Days populate correctly
- [ ] Colors apply based on status
- [ ] Month navigation works

---

## Task 42: Create Calendar Day Cell

### Overview

Build individual day cell component for the calendar showing date number, attendance status color, and employee count.

### Dependencies

- **Requires:** Task 41 (attendance calendar)
- **Blocks:** None

### Instructions

**Step 1: Cell Layout**

```
Regular Day:
┌────────┐
│   15   │ ← Date number
│  [●]   │ ← Status indicator
│  (45)  │ ← Employee count
└────────┘

Weekend:
┌────────┐
│   18   │
│  [ ]   │ ← Empty (weekend)
│        │
└────────┘

Holiday:
┌────────┐
│   01   │
│  [H]   │ ← Holiday marker
│  🎉    │ ← Holiday icon
└────────┘
```

**Step 2: Status Colors**

| Status | Background | Symbol |
|--------|------------|--------|
| All Present | Green | ● |
| Some Late | Yellow | ◐ |
| Some Absent | Orange | ◑ |
| Many Absent | Red | ○ |
| Holiday | Purple | H |
| Weekend | Light Gray | - |

**Step 3: Cell Interaction**

```
[Cell Clicked]
      │
      ├──> Update Selected Date
      │
      ├──> Fetch Daily Attendance
      │    └──> Load employee list for day
      │
      └──> Highlight Selected Cell
           └──> Update daily list panel
```

### Expected Outcome

Calendar day cells display date with color-coded status. Clicking a cell loads that day's attendance details in the daily list panel.

### Verification Checklist

- [ ] Cell displays date number
- [ ] Status color applied
- [ ] Employee count shown
- [ ] Click interaction working

---

## Task 43: Create Attendance Legend

### Overview

Build legend component explaining calendar color coding and status symbols for easy interpretation.

### Dependencies

- **Requires:** Task 41 (attendance calendar)
- **Blocks:** None

### Instructions

**Step 1: Legend Layout**

```
┌─────────────────────────────────────────────┐
│ Legend:                                     │
│ ● Present  ◐ Late  ◑ Absent  ○ Many Absent │
│ H Holiday  [ ] Weekend                      │
└─────────────────────────────────────────────┘
```

**Step 2: Legend Items**

| Symbol | Color | Label | Description |
|--------|-------|-------|-------------|
| ● | Green | Present | All present |
| ◐ | Yellow | Late | Some late arrivals |
| ◑ | Orange | Absent | Some absences |
| ○ | Red | Many Absent | High absence rate |
| H | Purple | Holiday | Public holiday |
| [ ] | Gray | Weekend | Saturday/Sunday |

### Expected Outcome

Legend displays below calendar explaining all status colors and symbols for easy reference.

### Verification Checklist

- [ ] Legend component created
- [ ] All statuses included
- [ ] Colors match calendar
- [ ] Clear descriptions

---

## Task 44: Create Daily Attendance List

### Overview

Build component displaying detailed attendance list for selected date with employee rows showing check-in/out times.

### Dependencies

- **Requires:** Task 35 (attendance page)
- **Blocks:** Tasks 45-46 (row and modal)

### Instructions

**Step 1: List Layout**

```
┌─────────────────────────────────────────────────────┐
│ Attendance for Wednesday, 26 January 2026           │
│ Total: 45 Present, 5 Absent, 3 Late   [+ Manual]   │
├─────────────────────────────────────────────────────┤
│ ┌───────────────────────────────────────────────┐  │
│ │ Employee     Check In   Check Out   Hrs  Status│  │
│ ├───────────────────────────────────────────────┤  │
│ │ [🧑] John    08:30 AM    05:30 PM    9h  ● Present│ │
│ │ [🧑] Jane    09:15 AM    05:30 PM    8h  ◐ Late  │  │
│ │ [🧑] Bob         -           -        -   ○ Absent│  │
│ │ [🧑] Alice   08:45 AM    05:45 PM   9h  ● Present│  │
│ │ ...                                              │  │
│ └───────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────┘
```

**Step 2: List Features**

| Feature | Description |
|---------|-------------|
| Filter | Filter by status (present/absent/late) |
| Sort | Sort by name, check-in time, status |
| Search | Search employee by name |
| Actions | Edit, manual entry |

**Step 3: Empty State**

```
No attendance records for selected date.
[+ Add Manual Entry]
```

### Expected Outcome

Daily list displays employee attendance rows for selected date. Shows check-in/out times and status. Supports filtering and searching.

### Verification Checklist

- [ ] List component created
- [ ] Rows display correctly
- [ ] Filters working
- [ ] Search functional

---

## Task 45: Create Attendance Row

### Overview

Build individual row component for daily attendance list showing employee info and attendance times.

### Dependencies

- **Requires:** Task 44 (daily list)
- **Blocks:** None

### Instructions

**Step 1: Row Layout**

```
┌──────────────────────────────────────────────────┐
│ [Avatar] Employee Name                           │
│          Position - Department                   │
│                                                  │
│ Check In:  08:30 AM    Check Out: 05:30 PM      │
│ Hours:     9h 0m       Status: ● Present        │
│                                      [Edit] [⋮]  │
└──────────────────────────────────────────────────┘
```

**Step 2: Row Actions**

```
[⋮ Actions Menu]
    ├──> Edit Times
    ├──> Mark Absent
    ├──> Add Note
    └──> View History
```

**Step 3: Status Display**

```
Present:  ● Green
Late:     ◐ Yellow (with delay time)
Absent:   ○ Red
Leave:    □ Blue
```

### Expected Outcome

Attendance row displays employee with check-in/out times and status. Actions menu allows editing attendance records.

### Verification Checklist

- [ ] Row displays employee info
- [ ] Times formatted correctly
- [ ] Status indicator shown
- [ ] Actions menu works

---

## Task 46: Create Manual Entry Modal

### Overview

Build modal dialog for manually entering or correcting attendance records when automatic tracking fails or needs adjustment.

### Dependencies

- **Requires:** Task 44 (daily list)
- **Blocks:** None

### Instructions

**Step 1: Modal Layout**

```
┌─────────────────────────────────────────┐
│ Manual Attendance Entry        [×]      │
├─────────────────────────────────────────┤
│                                         │
│ Employee: [Search and select ▼]        │
│                                         │
│ Date: [DD/MM/YYYY]                      │
│                                         │
│ Check In Time: [HH:MM]      [AM/PM]    │
│                                         │
│ Check Out Time: [HH:MM]     [AM/PM]    │
│                                         │
│ Status: [Present ▼]                     │
│                                         │
│ Notes: ┌───────────────────────────┐   │
│        │                           │   │
│        └───────────────────────────┘   │
│                                         │
│           [Cancel]  [Save Entry]        │
└─────────────────────────────────────────┘
```

**Step 2: Form Validation**

```
Validation Rules:
  │
  ├──> Employee: Required
  ├──> Date: Required, not future
  ├──> Check In: Required if not absent
  ├──> Check Out: Optional, must be after check-in
  └──> Status: Required
```

**Step 3: Status Options**

| Status | Description |
|--------|-------------|
| Present | Normal attendance |
| Late | Late arrival |
| Half Day | Partial attendance |
| Absent | Not present |
| Leave | On approved leave |

### Expected Outcome

Manual entry modal allows creating/editing attendance records with validation. Supports cases where automatic tracking isn't available.

### Verification Checklist

- [ ] Modal opens/closes correctly
- [ ] Form fields functional
- [ ] Validation working
- [ ] Save creates/updates record

---

## Summary

This document created the attendance dashboard with calendar visualization and daily tracking. Built main attendance page with responsive layout containing calendar and daily list panels. Implemented header with date navigation and actions menu. Created summary cards showing today's metrics for present, absent, and late employees with trend indicators. Built monthly calendar with color-coded day cells visualizing attendance patterns. Implemented calendar day cell component showing date, status, and employee count. Created attendance legend explaining color codes. Built daily attendance list displaying employee rows with check-in/out times. Implemented attendance row component with employee info and action menu. Created manual entry modal for correcting attendance records with validation.

The attendance module now provides comprehensive daily and monthly views of employee attendance with visual calendar and detailed lists. Supports manual entry for corrections and provides quick metrics for monitoring attendance patterns.

### What's Next

The next document (02_Tasks-47-52_ClockIn-Reports.md) will complete attendance management by implementing clock in/out functionality for self-service attendance, attendance filters, and comprehensive attendance reporting with export capabilities.

---

**Document Status:** Ready for Implementation  
**Last Updated:** 2026-01-26
