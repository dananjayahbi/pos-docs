# Tasks 47-52: Clock In/Out & Attendance Reports

> **Phase:** 07 - Frontend Infrastructure & ERP Dashboard  
> **SubPhase:** 13 - HR & Payroll UI  
> **Group:** C - Attendance Management  
> **Document:** 02 of 02  
> **Tasks Covered:** 47-52

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [01_Tasks-35-46_Dashboard-Calendar.md](01_Tasks-35-46_Dashboard-Calendar.md)
- **→ Next Document:** None (Last in Group) | **Next Group:** [Group-D_Leave-Management](../Group-D_Leave-Management/)
- **⊚ SubPhase Tasks:** [00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)

---

## Document Overview

This document completes attendance management by implementing self-service clock in/out functionality, attendance filters, and comprehensive reporting. Creates clock in/out button for employees to mark attendance. Builds attendance filters for department and status. Creates attendance report page with date range selection and detailed tables. Implements export functionality for downloading attendance data in CSV/Excel formats.

### Tasks in This Document

| Task # | Task Name | Complexity | Dependencies |
|--------|-----------|------------|--------------|
| 47 | Create Clock In/Out Button | Medium | Task 35 |
| 48 | Create Attendance Filters | Low | Task 35 |
| 49 | Create Attendance Report Page | Medium | Task 16 |
| 50 | Create Date Range Selector | Low | Task 49 |
| 51 | Create Attendance Report Table | Medium | Task 49 |
| 52 | Create Export Attendance | Low | Task 51 |

---

## Task 47: Create Clock In/Out Button

### Overview
Create the clock in/out button component that allows employees to mark their attendance with a single click. This component displays current clock status, handles geo-location validation (if enabled), and records precise timestamps in Sri Lankan timezone (UTC+5:30).

### Dependencies
- Task 35: Create Attendance Dashboard Page

### Instructions

1. **Create clock button component**
   - Create `ClockInOutButton.tsx` in Attendance directory
   - Create directory: `components/modules/hr/Attendance/`
   - Large, prominent button for easy access
   - Display current status and time

2. **Fetch current clock status**
   - Query API for today's attendance record
   - Check if already clocked in
   - Get clock-in time if exists
   - Determine button state (In/Out)

3. **Design button appearance**
   - Show "Clock In" in green if not clocked in
   - Show "Clock Out" in red if clocked in
   - Display current time prominently
   - Include clock icon
   - Show elapsed time if clocked in

4. **Add status indicators**
   - Current status badge (Not Started, In Progress, Completed)
   - Clock-in time display
   - Work duration counter
   - Location status (if geo-tracking enabled)

5. **Implement geo-location check**
   - Request browser geo-location permission
   - Validate user is within allowed radius
   - Office location from settings (lat/lng)
   - Allowed radius (default: 100 meters)
   - Show error if outside range

6. **Handle clock-in action**
   - Capture current timestamp (Sri Lankan time)
   - Get geo-location coordinates
   - Call POST `/api/hr/attendance/clock-in`
   - Pass employee ID, timestamp, location
   - Show success notification
   - Update button state immediately

7. **Handle clock-out action**
   - Capture current timestamp
   - Calculate work duration
   - Call POST `/api/hr/attendance/clock-out`
   - Pass attendance ID, clock-out time
   - Calculate overtime if > 8 hours
   - Show summary (hours worked)

8. **Add confirmation dialogs**
   - Confirm clock-out action
   - Display total hours worked
   - Show calculated overtime
   - Allow notes/comments
   - Cancel option

9. **Implement work timer**
   - Start timer on clock-in
   - Update every minute
   - Display in HH:MM format
   - Persist across page refreshes
   - Stop on clock-out

10. **Handle edge cases**
    - Already clocked in today: Show error
    - Missing clock-in: Don't allow clock-out
    - Geo-location disabled: Show warning
    - Network error: Queue for retry
    - Duplicate clicks: Debounce button

11. **Add loading states**
    - Show spinner during API calls
    - Disable button while processing
    - Display progress message
    - Handle timeout (30 seconds)

12. **Style for accessibility**
    - Large touch target (min 44x44px)
    - High contrast colors
    - Clear labels
    - Keyboard accessible
    - Screen reader support

### Clock In/Out Button Layout
```
Not Clocked In:
┌────────────────────────────────────────┐
│        🕐 14:25:30                     │
│                                        │
│   ┌──────────────────────────────┐    │
│   │   🟢 Clock In                 │    │
│   │                               │    │
│   │   Start your workday          │    │
│   └──────────────────────────────┘    │
│                                        │
│   Status: Not Started                 │
└────────────────────────────────────────┘

Clocked In:
┌────────────────────────────────────────┐
│        🕐 14:25:30                     │
│                                        │
│   Clocked In: 08:30:00                │
│   Work Duration: 05:55:30             │
│                                        │
│   ┌──────────────────────────────┐    │
│   │   🔴 Clock Out                │    │
│   │                               │    │
│   │   End your workday            │    │
│   └──────────────────────────────┘    │
│                                        │
│   Status: In Progress                 │
│   📍 Location: Verified              │
└────────────────────────────────────────┘

Clock Out Confirmation:
┌────────────────────────────────────────┐
│ Confirm Clock Out                      │
├────────────────────────────────────────┤
│                                        │
│ Clock In:  08:30:00                   │
│ Clock Out: 17:45:00                   │
│ Duration:  09:15:00                   │
│                                        │
│ Regular Hours:  08:00:00              │
│ Overtime:       01:15:00              │
│                                        │
│ Notes (optional):                     │
│ ┌────────────────────────────────┐   │
│ │ Completed project deployment   │   │
│ └────────────────────────────────┘   │
│                                        │
│   [ Cancel ]    [ Confirm ]          │
└────────────────────────────────────────┘
```

### Clock In Flow
```
1. Employee opens attendance page
   ↓
2. Component checks today's status
   ↓
3. API returns: No attendance record
   ↓
4. Display "Clock In" button (green)
   ↓
5. Employee clicks "Clock In"
   ↓
6. Request geo-location permission
   ↓
7. Get coordinates (lat/lng)
   ↓
8. Validate within office radius
   ↓
9. If valid: Call clock-in API
   ↓
10. API creates attendance record
   ↓
11. Response: Attendance ID, timestamp
   ↓
12. Update UI to "Clock Out" state
   ↓
13. Start work duration timer
   ↓
14. Show success notification
```

### Clock Out Flow
```
1. Employee clicks "Clock Out"
   ↓
2. Show confirmation dialog
   ↓
3. Display work duration summary
   ↓
4. Calculate overtime (if > 8 hours)
   ↓
5. Optional: Add notes
   ↓
6. Employee confirms
   ↓
7. Call clock-out API
   ↓
8. API updates attendance record
   ↓
9. Stop work timer
   ↓
10. Show completion summary
   ↓
11. Reset to "Clock In" state
```

### Button States

| State | Appearance | Action | Condition |
|-------|------------|--------|-----------|
| Clock In | Green button, clock-in icon | Start attendance | No attendance today |
| Clock Out | Red button, clock-out icon | End attendance | Already clocked in |
| Loading | Spinner, disabled | None | API in progress |
| Disabled | Gray, no hover | None | Outside geo-fence |
| Completed | Gray, checkmark | View only | Already clocked out |

### Geo-Location Validation

| Check | Condition | Action |
|-------|-----------|--------|
| Permission | Browser allows location | Proceed |
| Permission Denied | User blocks location | Show warning, allow manual |
| Within Radius | Distance < 100m | Allow clock in |
| Outside Radius | Distance > 100m | Show error, don't allow |
| Location Unavailable | GPS error | Show warning, allow manual |

### Time Calculations

| Calculation | Formula | Example |
|-------------|---------|---------|
| Work Duration | Clock Out - Clock In | 09:15:00 - 08:30:00 = 08:45:00 |
| Regular Hours | Min(Duration, 8:00:00) | Min(08:45:00, 08:00:00) = 08:00:00 |
| Overtime | Max(Duration - 8:00:00, 0) | Max(09:15:00 - 08:00:00, 0) = 01:15:00 |
| Break Time | Auto-deduct if > 6 hours | 08:45:00 - 00:30:00 = 08:15:00 |

### Sri Lankan Working Hours

| Parameter | Value | Notes |
|-----------|-------|-------|
| Standard Hours | 8 hours/day | 40 hours/week |
| Overtime Start | After 8 hours | 1.5x pay rate |
| Break Time | 30 minutes | If work > 6 hours |
| Grace Period | 15 minutes | For clock-in late |
| Timezone | UTC+5:30 | Sri Lanka Time |

### Expected Component Structure
```typescript
// File: frontend/components/modules/hr/Attendance/ClockInOutButton.tsx

// 'use client' directive
// Imports
// ClockInOutButton component
//   - Current time display
//   - Fetch today's attendance status
//   - Render clock-in or clock-out button
//   - Handle geo-location check
//   - Clock-in handler
//     - Get location
//     - Validate radius
//     - Call API
//     - Update state
//   - Clock-out handler
//     - Show confirmation
//     - Calculate duration
//     - Call API
//     - Show summary
//   - Work timer component
//   - Status indicators
//   - Error handling
```

### Validation Rules

| Field | Rule | Error Message |
|-------|------|---------------|
| Geo-location | Within 100m radius | "You are outside the office location. Please move closer." |
| Clock-in Time | Not already clocked in today | "You have already clocked in today." |
| Clock-out Time | Must have clocked in first | "You must clock in before clocking out." |
| Duplicate Action | Debounce 2 seconds | "Please wait before trying again." |
| Working Hours | Max 12 hours/day | "Maximum 12 hours per day. Please clock out." |

### Error Scenarios

| Scenario | Handling |
|----------|----------|
| Geo-location disabled | Show warning, allow manual override (if permitted) |
| Network error | Queue action for retry, show offline message |
| API timeout | Retry up to 3 times, then show error |
| Already clocked in | Show current status, don't allow duplicate |
| Server error | Display error message, log for admin |
| Invalid timestamp | Use server time instead of client time |

### Verification Checklist
- [ ] `ClockInOutButton.tsx` created in Attendance directory
- [ ] Current time displays in Sri Lankan timezone
- [ ] Button shows correct state (In/Out) based on today's status
- [ ] Geo-location permission requested on click
- [ ] Radius validation works (100m from office)
- [ ] Clock-in API call successful
- [ ] Clock-out confirmation dialog shows
- [ ] Work duration calculates correctly
- [ ] Overtime calculated for hours > 8
- [ ] Timer updates every minute
- [ ] Loading states display during API calls
- [ ] Error messages show for validation failures
- [ ] Success notifications appear
- [ ] Keyboard navigation works
- [ ] Touch-friendly for mobile devices

---

## Task 48: Create Attendance Filters

### Overview
Create comprehensive filter components for the attendance dashboard that allow HR managers and supervisors to filter attendance records by department, employee, date range, status, and attendance type.

### Dependencies
- Task 35: Create Attendance Dashboard Page

### Instructions

1. **Create attendance filters component**
   - Create `AttendanceFilters.tsx` in Attendance directory
   - Horizontal layout for all filters
   - Responsive design for mobile
   - Real-time filtering

2. **Add department filter dropdown**
   - Multi-select dropdown
   - List all departments from API
   - Option: "All Departments"
   - Show employee count per department
   - Apply filter on selection

3. **Add employee search filter**
   - Autocomplete search input
   - Search by name or employee ID
   - Show employee photo and name
   - Clear button
   - Debounce search (300ms)

4. **Add status filter**
   - Dropdown with attendance statuses
   - Options: All, Present, Absent, Late, On Leave, Half Day
   - Color-coded options
   - Show count for each status

5. **Add date range filter**
   - Date picker with range selection
   - Quick options: Today, This Week, This Month
   - Custom range selector
   - Max range: 3 months
   - Display selected range

6. **Add attendance type filter**
   - Dropdown for attendance types
   - Options: Regular, Overtime, Remote, On-site
   - Multi-select capability
   - Filter badge indicators

7. **Add shift filter**
   - Dropdown for work shifts
   - Options based on company shifts
   - Example: Morning (8-4), Evening (4-12), Night (12-8)
   - Show shift count

8. **Create quick filter buttons**
   - Today's Absences
   - Late Arrivals Today
   - Overtime This Week
   - Remote Workers Today
   - One-click filter application

9. **Implement clear all filters**
   - "Clear All" button
   - Reset all filters to default
   - Refresh data
   - Confirmation if many filters active

10. **Add filter summary bar**
    - Display active filters as chips
    - Click chip to remove filter
    - Show result count
    - "X results found" message

11. **Implement URL params**
    - Save filters in URL query params
    - Allow bookmarking filtered views
    - Restore filters on page load
    - Share filtered URLs

12. **Handle filter combinations**
    - AND logic for multiple filters
    - Update results in real-time
    - Show loading state during filtering
    - Optimize performance for large datasets

### Attendance Filters Layout
```
┌──────────────────────────────────────────────────────────────────┐
│  Attendance Filters                                              │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐            │
│  │ Department ▼ │ │ Employee    🔍│ │ Status     ▼ │           │
│  │ All Depts    │ │ Search...    │ │ All          │           │
│  └──────────────┘ └──────────────┘ └──────────────┘            │
│                                                                  │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐            │
│  │ Date Range ▼ │ │ Type       ▼ │ │ Shift      ▼ │           │
│  │ This Month   │ │ All Types    │ │ All Shifts   │           │
│  └──────────────┘ └──────────────┘ └──────────────┘            │
│                                                                  │
│  Quick Filters:                                                 │
│  [ Today's Absences ] [ Late Today ] [ Overtime ] [ Remote ]   │
│                                                                  │
│  Active: [Engineering ×] [Present ×] [This Week ×]             │
│  [Clear All]                        456 results found          │
└──────────────────────────────────────────────────────────────────┘
```

### Department Filter Dropdown
```
┌─────────────────────────────┐
│ Select Department           │
├─────────────────────────────┤
│ ☑ All Departments           │
├─────────────────────────────┤
│ ☐ Engineering (45)          │
│ ☐ Sales (32)                │
│ ☐ Marketing (18)            │
│ ☐ HR (8)                    │
│ ☐ Finance (12)              │
│ ☐ Operations (28)           │
└─────────────────────────────┘
```

### Status Filter Options
```
┌─────────────────────────────┐
│ Select Status               │
├─────────────────────────────┤
│ ○ All Statuses              │
│ ○ 🟢 Present (142)          │
│ ○ 🔴 Absent (8)             │
│ ○ 🟡 Late (12)              │
│ ○ 🔵 On Leave (15)          │
│ ○ 🟠 Half Day (5)           │
│ ○ ⚫ Not Marked (3)         │
└─────────────────────────────┘
```

### Date Range Selector
```
┌─────────────────────────────┐
│ Select Date Range           │
├─────────────────────────────┤
│ Quick Options:              │
│ • Today                     │
│ • This Week                 │
│ • This Month                │
│ • Last Month                │
├─────────────────────────────┤
│ Custom Range:               │
│ From: [2024-01-01] 📅       │
│ To:   [2024-01-31] 📅       │
│                             │
│      [ Apply ]              │
└─────────────────────────────┘
```

### Filter Options

| Filter | Type | Options | Multi-Select |
|--------|------|---------|--------------|
| Department | Dropdown | All departments + "All" | Yes |
| Employee | Autocomplete | All employees | No |
| Status | Dropdown | Present, Absent, Late, On Leave, Half Day | No |
| Date Range | Date Picker | Today, Week, Month, Custom | No |
| Type | Dropdown | Regular, Overtime, Remote, On-site | Yes |
| Shift | Dropdown | Company shifts + "All" | No |

### Quick Filter Buttons

| Button | Filter Applied | Description |
|--------|----------------|-------------|
| Today's Absences | Status=Absent, Date=Today | Shows all employees absent today |
| Late Today | Status=Late, Date=Today | Shows employees who clocked in late |
| Overtime This Week | Type=Overtime, Range=This Week | Shows overtime records |
| Remote Today | Type=Remote, Date=Today | Shows remote workers today |

### Filter Logic

| Scenario | Logic | Result |
|----------|-------|--------|
| Single Filter | Apply that filter | Filtered results |
| Multiple Filters | AND all conditions | Results matching ALL filters |
| Clear Single | Remove that filter | Update results |
| Clear All | Reset all filters | Show all records |

### Filter State Management
```
Initial State:
- All filters: "All" or "None selected"
- Date range: "This Month"
- No active filter chips

Filtered State:
- Active filters: Show values
- Filter chips: Display below filters
- Result count: Update dynamically
- URL: Include query params

Cleared State:
- Reset to initial state
- Remove all chips
- Reset result count
- Clear URL params
```

### Filter Performance

| Dataset Size | Strategy | Load Time |
|--------------|----------|-----------|
| < 1,000 records | Client-side filter | < 100ms |
| 1,000 - 10,000 | Debounced filter | < 500ms |
| > 10,000 records | Server-side filter | < 2s |

### Expected Component Structure
```typescript
// File: frontend/components/modules/hr/Attendance/AttendanceFilters.tsx

// 'use client' directive
// Imports
// AttendanceFilters props
// AttendanceFilters component
//   - Department filter dropdown
//   - Employee search autocomplete
//   - Status filter dropdown
//   - Date range picker
//   - Type filter multi-select
//   - Shift filter dropdown
//   - Quick filter buttons
//   - Active filters summary
//   - Clear all button
//   - Apply filters handler
//     - Combine filter values
//     - Update URL params
//     - Trigger data refetch
//   - Remove filter handler
//   - Clear all handler
```

### Filter URL Parameters

| Parameter | Format | Example |
|-----------|--------|---------|
| department | Comma-separated IDs | `dept=1,3,5` |
| employee | Employee ID | `emp=EMP123` |
| status | Status code | `status=present` |
| dateFrom | ISO date | `from=2024-01-01` |
| dateTo | ISO date | `to=2024-01-31` |
| type | Comma-separated types | `type=regular,overtime` |
| shift | Shift ID | `shift=morning` |

### Validation Rules

| Filter | Rule | Error Message |
|--------|------|---------------|
| Date Range | Max 3 months | "Date range cannot exceed 3 months" |
| Employee | Must exist in system | "Employee not found" |
| Department | Must be active | "Department is inactive" |
| Date From | Cannot be future | "Start date cannot be in the future" |
| Date To | Must be after From | "End date must be after start date" |

### Verification Checklist
- [ ] `AttendanceFilters.tsx` created
- [ ] All filter dropdowns render correctly
- [ ] Department filter shows all departments with counts
- [ ] Employee search autocomplete works
- [ ] Status filter displays all status options
- [ ] Date range picker has quick options
- [ ] Type filter allows multi-select
- [ ] Shift filter shows company shifts
- [ ] Quick filter buttons work
- [ ] Active filters display as chips
- [ ] Clear all button resets filters
- [ ] URL params save filter state
- [ ] Filters combine with AND logic
- [ ] Results update in real-time
- [ ] Loading state shows during filtering
- [ ] Mobile responsive layout

---

## Task 49: Create Attendance Report Page

### Overview
Create comprehensive attendance report page with summary statistics, detailed tables, charts, and export functionality. This page provides HR managers with insights into attendance patterns, trends, and anomalies.

### Dependencies
- Task 16: Create Common Page Layout

### Instructions

1. **Create attendance report page**
   - Create `reports/page.tsx` in attendance routes
   - Path: `/hr/attendance/reports`
   - Full-page layout
   - Protected route (HR role required)

2. **Add report page header**
   - Title: "Attendance Reports"
   - Subtitle: Current period
   - Breadcrumb navigation
   - Print report button

3. **Create summary statistics section**
   - Total employees
   - Present today
   - Absent today
   - Late arrivals
   - Average attendance rate
   - Trend indicators (up/down arrows)

4. **Add summary cards row**
   - Card 1: Attendance Rate (% with gauge)
   - Card 2: On-Time Percentage
   - Card 3: Average Hours Worked
   - Card 4: Overtime Hours
   - Color-coded for quick scanning

5. **Create department comparison section**
   - Bar chart comparing departments
   - Metrics: Attendance rate, late rate, overtime
   - Hover tooltips with details
   - Sort by best/worst performing

6. **Add attendance trend chart**
   - Line chart showing 30-day trend
   - Metrics: Daily attendance count
   - Multiple lines: Present, Late, Absent
   - Interactive hover for exact numbers

7. **Create date range selector**
   - Quick options: This Week, Month, Quarter, Year
   - Custom date range picker
   - Apply button
   - Reset to default button

8. **Build top performers section**
   - Table showing employees with perfect attendance
   - Period selector
   - Sortable columns
   - Export to recognize employees

9. **Add attendance issues section**
   - List of attendance concerns
   - Frequent absentees
   - Consistent late arrivals
   - Missing clock-outs
   - Action items for HR

10. **Create detailed report table**
    - Includes Task 51 functionality
    - All attendance records for period
    - Sortable and filterable columns
    - Pagination
    - Export button

11. **Implement print layout**
    - Print-friendly styling
    - Hide interactive elements
    - Format for A4 paper
    - Include company header/footer
    - Page breaks between sections

12. **Add report scheduling**
    - Schedule automatic reports
    - Email delivery options
    - Frequency: Daily, Weekly, Monthly
    - Recipient selection
    - Report format: PDF, Excel

### Attendance Report Page Layout
```
┌────────────────────────────────────────────────────────────┐
│ HR > Attendance > Reports                    [Print] [⚙]  │
│ Attendance Reports                                         │
│ January 2024 Analysis                                      │
├────────────────────────────────────────────────────────────┤
│                                                            │
│ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐      │
│ │Present   │ │ Absent   │ │ Late     │ │ On Leave │      │
│ │ 142/150  │ │   8      │ │  12      │ │   15     │      │
│ │  95%  ↑  │ │  5%   ↓  │ │  8%   →  │ │  10%  ↑  │      │
│ └──────────┘ └──────────┘ └──────────┘ └──────────┘      │
│                                                            │
│ Performance Metrics                                        │
│ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐       │
│ │ Attendance   │ │ On-Time %    │ │ Avg Hours    │       │
│ │ Rate: 95%    │ │    87%       │ │   8.2 hrs    │       │
│ │   ███░░      │ │   ████░      │ │   [Chart]    │       │
│ └──────────────┘ └──────────────┘ └──────────────┘       │
│                                                            │
│ Department Comparison                                      │
│ ┌────────────────────────────────────────────────────┐    │
│ │ Engineering  ████████████████████  95%            │    │
│ │ Sales        ███████████████░░░░░  88%            │    │
│ │ Marketing    █████████████████████  98%            │    │
│ │ Finance      ████████████████░░░░░  91%            │    │
│ └────────────────────────────────────────────────────┘    │
│                                                            │
│ 30-Day Attendance Trend                                   │
│ ┌────────────────────────────────────────────────────┐    │
│ │150│                               ──────────        │    │
│ │   │                     ─────────             Present │    │
│ │100│           ────────                         ─────  │    │
│ │   │       ───        Late                            │    │
│ │ 50│  ──                Absent                       │    │
│ │   │─────────────────────────────────────────────    │    │
│ │  0└─────────────────────────────────────────────┘  │    │
│ │    Jan 1      Jan 10     Jan 20     Jan 30         │    │
│ └────────────────────────────────────────────────────┘    │
│                                                            │
│ Detailed Records                                          │
│ [Date Range: This Month ▼]  [Department: All ▼]         │
│ [Export: CSV] [Export: Excel] [Export: PDF]              │
│                                                            │
│ (Attendance table from Task 51)                           │
└────────────────────────────────────────────────────────────┘
```

### Summary Statistics Cards

| Metric | Calculation | Display Format | Color |
|--------|-------------|----------------|-------|
| Present Today | Count(status=present) / Total | 142/150 (95%) | Green |
| Absent Today | Count(status=absent) / Total | 8/150 (5%) | Red |
| Late Arrivals | Count(late) / Count(present) | 12/142 (8%) | Yellow |
| On Leave | Count(status=leave) / Total | 15/150 (10%) | Blue |
| Attendance Rate | (Present+Late) / Total * 100 | 95% | Green |
| On-Time Rate | (Present-Late) / Present * 100 | 87% | Orange |

### Report Sections

| Section | Content | Purpose |
|---------|---------|---------|
| Summary Stats | Quick overview numbers | At-a-glance status |
| Performance Metrics | Rates and trends | Monitor KPIs |
| Department Comparison | Cross-department analysis | Identify patterns |
| Trend Chart | 30-day historical data | Spot trends |
| Top Performers | Perfect attendance list | Recognition |
| Issues | Attendance concerns | Action items |
| Detailed Table | All records | Deep dive |

### Date Range Options

| Option | Range | Use Case |
|--------|-------|----------|
| Today | Current date | Daily monitoring |
| This Week | Mon-Sun current week | Weekly review |
| This Month | 1st to last day of month | Monthly reports |
| This Quarter | Q1/Q2/Q3/Q4 | Quarterly analysis |
| This Year | Jan 1 to Dec 31 | Annual review |
| Custom | User-defined | Specific periods |

### Department Comparison Metrics

| Metric | Calculation | Best Practice |
|--------|-------------|---------------|
| Attendance Rate | Present / Total employees | > 95% |
| Late Rate | Late / Present | < 5% |
| Absence Rate | Absent / Total | < 5% |
| Leave Rate | On Leave / Total | 5-10% |
| Overtime Hours | Sum(overtime) / employees | Monitor carefully |

### Trend Chart Data Points

| Line | Data | Color | Purpose |
|------|------|-------|---------|
| Present | Daily present count | Green | Main attendance |
| Late | Daily late count | Yellow | Punctuality |
| Absent | Daily absent count | Red | Absences |
| On Leave | Daily leave count | Blue | Planned absences |

### Top Performers Criteria

| Criteria | Requirement | Period |
|----------|-------------|--------|
| Perfect Attendance | 0 absences | Selected period |
| Always On-Time | 0 late arrivals | Selected period |
| No Early Exits | All days full hours | Selected period |
| Minimum Days | At least 20 working days | Per month |

### Attendance Issues Detection

| Issue Type | Detection Logic | Action Required |
|------------|----------------|-----------------|
| Frequent Absences | > 3 absences in month | Manager review |
| Consistent Late | Late > 5 times in month | Warning notice |
| Missing Clock-Out | No clock-out record | Follow up |
| Excessive Overtime | > 20 hours OT/month | Workload review |
| Pattern Absences | Monday/Friday pattern | Investigation |

### Expected Component Structure
```typescript
// File: frontend/app/(dashboard)/hr/attendance/reports/page.tsx

// Imports
// AttendanceReportsPage component
//   - Page header with title
//   - Date range selector (Task 50)
//   - Summary statistics section
//     - Present/Absent/Late cards
//     - Attendance rate gauge
//     - On-time percentage
//     - Average hours worked
//   - Performance metrics cards
//   - Department comparison chart
//   - 30-day trend chart
//   - Top performers section
//   - Attendance issues section
//   - Detailed report table (Task 51)
//   - Export buttons (Task 52)
//   - Print styling
```

### Print Layout Specifications

| Element | Print Behavior |
|---------|----------------|
| Header | Include company logo and report title |
| Summary Cards | Display in 2x2 grid |
| Charts | Convert to static images |
| Tables | Break across pages if needed |
| Interactive Elements | Hide (buttons, dropdowns) |
| Footer | Include page numbers, date generated |
| Margins | 2cm all sides |
| Paper Size | A4 portrait |

### Verification Checklist
- [ ] Attendance report page created at `/hr/attendance/reports`
- [ ] Page header with title and breadcrumb displays
- [ ] Summary statistics cards show correct data
- [ ] Present/Absent/Late counts calculate correctly
- [ ] Attendance rate percentage displays
- [ ] Performance metrics cards render
- [ ] Department comparison chart displays
- [ ] 30-day trend chart shows historical data
- [ ] Date range selector works (Task 50)
- [ ] Top performers section lists eligible employees
- [ ] Attendance issues section flags concerns
- [ ] Detailed table displays all records (Task 51)
- [ ] Export buttons functional (Task 52)
- [ ] Print layout formats correctly
- [ ] Only HR role can access page
- [ ] Loading states for data fetching
- [ ] Empty states if no data
- [ ] Responsive design for mobile

---

## Task 50: Create Date Range Selector

### Overview
Create a flexible date range selector component with quick options and custom range selection for filtering attendance reports and data.

### Dependencies
- Task 49: Create Attendance Report Page

### Instructions

1. **Create date range component**
   - Create `DateRangeSelector.tsx` in common HR components
   - Reusable across HR modules
   - Support quick options and custom ranges
   - Display selected range clearly

2. **Add quick selection buttons**
   - Today button
   - This Week button (Mon-Sun)
   - This Month button
   - Last Month button
   - This Quarter button
   - This Year button
   - Highlight active selection

3. **Create custom range picker**
   - Date picker for start date
   - Date picker for end date
   - Calendar popup for selection
   - Visual range highlight in calendar

4. **Implement date validation**
   - Start date cannot be after end date
   - End date cannot be in future
   - Maximum range: 1 year
   - Minimum range: 1 day
   - Show validation errors

5. **Add range presets dropdown**
   - Last 7 Days
   - Last 30 Days
   - Last 90 Days
   - Year to Date
   - All Time
   - Apply preset immediately

6. **Display selected range**
   - Format: "Jan 1, 2024 - Jan 31, 2024"
   - Day count: "(31 days)"
   - Comparison to previous period option
   - Clear selection button

7. **Implement comparison mode**
   - Toggle "Compare to Previous Period"
   - Automatically calculate comparison range
   - Display both ranges
   - Show difference indicators

8. **Add apply and cancel buttons**
   - Apply button: Trigger data reload
   - Cancel button: Revert to previous selection
   - Auto-apply for quick options
   - Confirm for custom ranges

9. **Handle timezone conversions**
   - Use Sri Lankan timezone (UTC+5:30)
   - Display dates in local format
   - API calls use ISO format
   - Consistent date handling

10. **Create range chips display**
    - Show active range as chip
    - Click to modify
    - Clear button (X)
    - Visual feedback

11. **Implement keyboard shortcuts**
    - Arrow keys: Navigate dates
    - Enter: Apply selection
    - Escape: Cancel
    - T: Today
    - W: This Week
    - M: This Month

12. **Add mobile responsiveness**
    - Stack buttons vertically on small screens
    - Touch-friendly date picker
    - Swipe gestures for months
    - Optimized calendar view

### Date Range Selector Layout
```
Quick Options:
┌────────────────────────────────────────────────────────────┐
│ Select Date Range                                          │
├────────────────────────────────────────────────────────────┤
│ [ Today ] [ This Week ] [ This Month ] [ This Quarter ]   │
│                                                            │
│ Custom Range:                                              │
│ ┌──────────────────────┐    ┌──────────────────────┐      │
│ │ From: 2024-01-01  📅 │    │ To: 2024-01-31   📅 │      │
│ └──────────────────────┘    └──────────────────────┘      │
│                                                            │
│ Presets: [ Last 7 Days ▼ ]                                │
│                                                            │
│ ☐ Compare to Previous Period                              │
│                                                            │
│               [ Cancel ]  [ Apply ]                        │
└────────────────────────────────────────────────────────────┘

Calendar View:
┌────────────────────────────────────────┐
│  ◀ January 2024 ▶                     │
├────────────────────────────────────────┤
│ Su Mo Tu We Th Fr Sa                  │
│     1  2  3  4  5  6                  │
│  7  8  9 10 11 12 13                  │
│ [14 15 16 17 18 19 20]  ← Selected    │
│ 21 22 23 24 25 26 27                  │
│ 28 29 30 31                           │
└────────────────────────────────────────┘

Selected Range Display:
┌────────────────────────────────────────┐
│ [📅 Jan 14, 2024 - Jan 20, 2024  ×]  │
│     (7 days)                           │
└────────────────────────────────────────┘
```

### Quick Options

| Button | Date Range | Days | Use Case |
|--------|------------|------|----------|
| Today | Current date only | 1 | Daily checks |
| This Week | Monday to Sunday (current) | 7 | Weekly review |
| This Month | 1st to last day of current month | 28-31 | Monthly reports |
| Last Month | Previous month full | 28-31 | Historical review |
| This Quarter | Q1/Q2/Q3/Q4 (current) | ~90 | Quarterly analysis |
| This Year | Jan 1 to Dec 31 (current) | 365/366 | Annual review |

### Custom Range Presets

| Preset | Description | Calculation |
|--------|-------------|-------------|
| Last 7 Days | Rolling 7 days | Today - 6 days to Today |
| Last 30 Days | Rolling 30 days | Today - 29 days to Today |
| Last 90 Days | Rolling 90 days | Today - 89 days to Today |
| Year to Date | Start of year to today | Jan 1 to Today |
| All Time | Entire history | Earliest record to Today |

### Date Validation Rules

| Rule | Validation | Error Message |
|------|------------|---------------|
| Start Date | Cannot be after End Date | "Start date must be before end date" |
| End Date | Cannot be in future | "End date cannot be in the future" |
| Max Range | Cannot exceed 1 year | "Date range cannot exceed 1 year" |
| Min Range | Must be at least 1 day | "Please select at least 1 day" |
| Required | Both dates must be selected | "Please select both start and end dates" |

### Comparison Mode

| Feature | Behavior |
|---------|----------|
| Enable | Toggle "Compare to Previous Period" |
| Auto-Calculate | Previous period = same duration before start |
| Display | Show both ranges in UI |
| API Call | Send both ranges to backend |
| Results | Display side-by-side comparison |

**Example:**
- Selected: Jan 15 - Jan 21 (7 days)
- Comparison: Jan 8 - Jan 14 (7 days)

### Date Format Specifications

| Context | Format | Example |
|---------|--------|---------|
| Display | MMM DD, YYYY | Jan 15, 2024 |
| Short Display | MM/DD/YYYY | 01/15/2024 |
| API Request | YYYY-MM-DD | 2024-01-15 |
| ISO Format | ISO 8601 | 2024-01-15T00:00:00+05:30 |
| Day Count | (X days) | (31 days) |

### Expected Component Structure
```typescript
// File: frontend/components/modules/hr/common/DateRangeSelector.tsx

// 'use client' directive
// Imports
// DateRangeSelector props
//   - onRangeChange: Callback function
//   - defaultRange: Initial range
//   - maxRange: Maximum allowed range
//   - minDate: Earliest selectable date
//   - maxDate: Latest selectable date (default: today)
// DateRangeSelector component
//   - Quick option buttons
//     - Today handler
//     - This Week handler
//     - This Month handler
//     - etc.
//   - Custom range pickers
//     - Start date picker
//     - End date picker
//     - Calendar component
//   - Preset dropdown
//   - Comparison toggle
//   - Selected range display
//   - Validation logic
//   - Apply/Cancel buttons
//   - Keyboard shortcuts
```

### State Management
```
Initial State:
- Default range: This Month
- Comparison: Off
- Validation: All pass

User Selects Quick Option:
- Update start and end dates
- Apply immediately
- No confirmation needed
- Trigger onRangeChange callback

User Selects Custom Range:
- Open calendar
- Select start date
- Select end date
- Validate dates
- Require Apply button

User Enables Comparison:
- Calculate previous period
- Update display
- Include in API call
- Show comparison results

User Applies Range:
- Validate all rules
- Format dates for API
- Trigger onRangeChange callback
- Close picker
- Update display chip
```

### Keyboard Shortcuts

| Key | Action |
|-----|--------|
| T | Select Today |
| W | Select This Week |
| M | Select This Month |
| Q | Select This Quarter |
| Y | Select This Year |
| Enter | Apply selection |
| Escape | Cancel changes |
| Arrow Keys | Navigate calendar dates |

### Verification Checklist
- [ ] `DateRangeSelector.tsx` created
- [ ] Quick option buttons render and work
- [ ] Today button selects current date
- [ ] This Week selects Monday-Sunday
- [ ] This Month selects full current month
- [ ] Custom range picker opens calendar
- [ ] Start and end date pickers functional
- [ ] Date validation rules enforce correctly
- [ ] Error messages display for invalid ranges
- [ ] Preset dropdown options work
- [ ] Comparison mode toggles correctly
- [ ] Previous period calculates automatically
- [ ] Selected range displays formatted
- [ ] Apply button triggers onRangeChange callback
- [ ] Cancel button reverts changes
- [ ] Keyboard shortcuts work
- [ ] Mobile responsive layout
- [ ] Dates use Sri Lankan timezone
- [ ] ISO format for API calls

---

## Task 51: Create Attendance Report Table

### Overview
Create a comprehensive data table component displaying detailed attendance records with sorting, filtering, pagination, and row actions. This table shows all attendance data for the selected period with employee information, timestamps, durations, and status.

### Dependencies
- Task 49: Create Attendance Report Page

### Instructions

1. **Create attendance table component**
   - Create `AttendanceReportTable.tsx` in Attendance directory
   - Use data table component from component library
   - Support large datasets (1000+ rows)
   - Virtual scrolling for performance

2. **Define table columns**
   - Date column
   - Employee ID column
   - Employee Name column (with photo)
   - Department column
   - Clock In time column
   - Clock Out time column
   - Duration column
   - Status column (badge)
   - Location column (if geo-tracking)
   - Actions column

3. **Add employee information column**
   - Employee photo thumbnail
   - Employee full name
   - Employee ID below name
   - Clickable to view profile
   - Tooltip with more details

4. **Create clock in/out time columns**
   - Display in 12-hour format (HH:MM AM/PM)
   - Color-coded: Green (on-time), Red (late), Gray (absent)
   - Show timezone (Sri Lankan time)
   - Tooltip with exact timestamp

5. **Calculate duration column**
   - Format: HH:MM (e.g., 08:30)
   - Calculate: Clock Out - Clock In - Break
   - Color-code: Green (≥8 hours), Yellow (6-8), Red (<6)
   - Show overtime separately

6. **Create status badge column**
   - Present (Green)
   - Late (Yellow)
   - Absent (Red)
   - Half Day (Orange)
   - On Leave (Blue)
   - Not Marked (Gray)
   - Icon + text

7. **Add actions column**
   - View details button
   - Edit attendance button (admin only)
   - Add notes button
   - Export individual record
   - More menu (...)

8. **Implement column sorting**
   - Sort by any column
   - Ascending/descending toggle
   - Visual indicator (↑/↓ arrow)
   - Default sort: Date descending

9. **Add column filtering**
   - Quick filter per column
   - Date range filter (integrated with Task 50)
   - Text search for name/ID
   - Status dropdown filter
   - Clear filters button

10. **Implement pagination**
    - Show 25/50/100 rows per page
    - Page number display
    - Previous/Next buttons
    - Jump to page input
    - Total records count

11. **Add row selection**
    - Checkbox for each row
    - Select all checkbox in header
    - Bulk actions: Export, Delete, Update Status
    - Selection count display

12. **Create expandable rows**
    - Click row to expand
    - Show additional details
    - Notes/comments
    - Location map (if available)
    - Edit form (inline)

13. **Add loading and empty states**
    - Skeleton rows while loading
    - "No records found" empty state
    - Illustrations for empty states
    - Retry button on error

14. **Implement responsive design**
    - Horizontal scroll on mobile
    - Sticky columns (freeze first column)
    - Collapsible columns
    - Mobile card view option

### Attendance Report Table Layout
```
┌──────────────────────────────────────────────────────────────────────────────────┐
│ Attendance Report - January 2024                                  456 records    │
├──────────────────────────────────────────────────────────────────────────────────┤
│ ☐ Date ▼│ Employee    │ Dept    │ Clock In│ Clock Out│ Duration│ Status │ Actions│
├─────────┼─────────────┼─────────┼─────────┼──────────┼─────────┼────────┼────────┤
│ ☐ Jan 15│ [👤] John   │ Eng     │ 08:25 AM│ 05:30 PM │ 08:35   │🟢Pres. │ [...]  │
│         │     Doe     │         │         │          │         │        │        │
│         │     #EMP001 │         │         │          │         │        │        │
├─────────┼─────────────┼─────────┼─────────┼──────────┼─────────┼────────┼────────┤
│ ☐ Jan 15│ [👤] Jane   │ Sales   │ 09:15 AM│ 06:00 PM │ 08:15   │🟡Late  │ [...]  │
│         │     Smith   │         │  (Late) │          │         │        │        │
│         │     #EMP002 │         │         │          │         │        │        │
├─────────┼─────────────┼─────────┼─────────┼──────────┼─────────┼────────┼────────┤
│ ☐ Jan 15│ [👤] Bob    │ HR      │    -    │    -     │   0:00  │🔴Abs.  │ [...]  │
│         │     Wilson  │         │         │          │         │        │        │
│         │     #EMP003 │         │         │          │         │        │        │
├─────────┴─────────────┴─────────┴─────────┴──────────┴─────────┴────────┴────────┤
│ [Bulk Actions: Export Selected | Update Status]              3 of 456 selected   │
│                                                                                    │
│ Rows per page: [25 ▼]    ◀ 1 2 3 ... 19 ▶                Page 1 of 19           │
└────────────────────────────────────────────────────────────────────────────────────┘

Expanded Row View:
┌──────────────────────────────────────────────────────────────────────────────────┐
│ ☑ Jan 15│ [👤] John Doe #EMP001                                                  │
├──────────────────────────────────────────────────────────────────────────────────┤
│ Additional Details:                                                               │
│                                                                                   │
│ Clock In:  08:25:32 AM (Sri Lanka Time)      Location: ✓ Verified               │
│ Clock Out: 05:30:15 PM (Sri Lanka Time)      Coordinates: 6.9271° N, 79.8612° E │
│                                                                                   │
│ Work Duration:  09:04:43                     Breaks: 00:30:00 (Auto-deducted)    │
│ Net Hours:      08:34:43                     Overtime: 00:34:43                  │
│                                                                                   │
│ Notes: Completed Q4 report submission                                            │
│                                                                                   │
│ [ Edit ] [ Add Note ] [ View Location ] [ Export ]                              │
└──────────────────────────────────────────────────────────────────────────────────┘
```

### Table Column Definitions

| Column | Width | Sortable | Filterable | Mobile | Description |
|--------|-------|----------|------------|--------|-------------|
| Checkbox | 40px | No | No | Hide | Row selection |
| Date | 100px | Yes | Yes | Show | Attendance date |
| Employee | 200px | Yes | Yes | Show | Name, photo, ID |
| Department | 120px | Yes | Yes | Hide | Department name |
| Clock In | 120px | Yes | No | Show | Clock in time |
| Clock Out | 120px | Yes | No | Hide | Clock out time |
| Duration | 100px | Yes | Yes | Show | Total hours |
| Status | 100px | Yes | Yes | Show | Attendance status |
| Actions | 80px | No | No | Show | Row actions |

### Status Badge Styles

| Status | Color | Icon | Background | Border |
|--------|-------|------|------------|--------|
| Present | Green | ✓ | Light Green | Green |
| Late | Yellow | ⚠ | Light Yellow | Orange |
| Absent | Red | ✗ | Light Red | Red |
| Half Day | Orange | ◐ | Light Orange | Orange |
| On Leave | Blue | ℹ | Light Blue | Blue |
| Not Marked | Gray | - | Light Gray | Gray |

### Duration Color Coding

| Duration | Color | Meaning |
|----------|-------|---------|
| ≥ 8:00 hours | Green | Full day |
| 6:00 - 7:59 hours | Yellow | Short day |
| 4:00 - 5:59 hours | Orange | Half day |
| < 4:00 hours | Red | Incomplete |
| 0:00 hours | Gray | No attendance |

### Time Display Format

| Column | Format | Example | Timezone |
|--------|--------|---------|----------|
| Clock In | hh:MM AM/PM | 08:25 AM | Sri Lanka (UTC+5:30) |
| Clock Out | hh:MM AM/PM | 05:30 PM | Sri Lanka (UTC+5:30) |
| Duration | HH:MM | 08:35 | Hours:Minutes |
| Overtime | HH:MM | 00:35 | Hours:Minutes |

### Sorting Options

| Column | Default | Behavior |
|--------|---------|----------|
| Date | Descending | Most recent first |
| Employee | Ascending | Alphabetical A-Z |
| Department | Ascending | Alphabetical A-Z |
| Clock In | Ascending | Earliest first |
| Clock Out | Descending | Latest first |
| Duration | Descending | Longest first |
| Status | Custom | Present > Late > Half Day > Absent |

### Actions Menu Options

| Action | Icon | Access | Description |
|--------|------|--------|-------------|
| View Details | 👁 | All | Open expanded row |
| Edit Attendance | ✏️ | Admin/HR | Modify record |
| Add Note | 📝 | Manager/HR | Add comment |
| View Location | 📍 | HR | Show clock-in location |
| Export Record | 💾 | All | Download single record |
| Delete | 🗑 | Admin only | Remove record (with confirm) |

### Bulk Actions

| Action | Condition | Effect |
|--------|-----------|--------|
| Export Selected | ≥1 row selected | Download selected rows |
| Update Status | ≥1 row selected | Batch status change |
| Add Notes | ≥1 row selected | Add note to multiple records |
| Delete Selected | ≥1 row selected, Admin only | Batch delete with confirm |

### Pagination Settings

| Setting | Options | Default | Description |
|---------|---------|---------|-------------|
| Rows per Page | 25, 50, 100, All | 25 | Number of rows displayed |
| Page Controls | Previous, Next, Jump | - | Navigation options |
| Display | "Page X of Y" | - | Current page indicator |
| Total | "X records" | - | Total record count |

### Expected Component Structure
```typescript
// File: frontend/components/modules/hr/Attendance/AttendanceReportTable.tsx

// 'use client' directive
// Imports
// AttendanceReportTable props
//   - data: Attendance records array
//   - dateRange: Selected date range
//   - onRowClick: Callback for row selection
//   - onExport: Callback for export
// AttendanceReportTable component
//   - Table header
//     - Column headers with sort icons
//     - Select all checkbox
//   - Table body
//     - Map attendance records to rows
//     - Employee cell (photo, name, ID)
//     - Clock in/out cells
//     - Duration cell with calculation
//     - Status badge cell
//     - Actions cell
//   - Expandable row details
//     - Additional info section
//     - Notes section
//     - Location display
//     - Edit form
//   - Pagination controls
//   - Bulk action bar
//   - Loading skeleton
//   - Empty state
```

### Row Data Structure
```
Attendance Record:
- id: Unique attendance ID
- date: Attendance date (YYYY-MM-DD)
- employee:
  - id: Employee ID
  - name: Full name
  - photo: Photo URL
  - department: Department name
- clockIn: Timestamp (ISO 8601)
- clockOut: Timestamp (ISO 8601)
- duration: Total minutes worked
- breakTime: Minutes deducted
- netHours: Actual work hours
- overtime: Overtime minutes
- status: Status code (present/late/absent/etc.)
- location:
  - latitude: Geo coordinate
  - longitude: Geo coordinate
  - verified: Boolean
- notes: Array of note objects
- approved: Boolean
```

### Verification Checklist
- [ ] `AttendanceReportTable.tsx` created
- [ ] Table displays all defined columns
- [ ] Employee column shows photo, name, and ID
- [ ] Clock in/out times format correctly (AM/PM)
- [ ] Duration calculates correctly (Clock Out - Clock In - Break)
- [ ] Status badges display with correct colors
- [ ] Actions column shows menu with options
- [ ] Column sorting works (ascending/descending)
- [ ] Column filters apply correctly
- [ ] Pagination controls work
- [ ] Rows per page selector functions
- [ ] Row selection checkboxes work
- [ ] Select all checkbox works
- [ ] Bulk actions available when rows selected
- [ ] Expandable rows show additional details
- [ ] Loading skeleton displays during data fetch
- [ ] Empty state shows when no records
- [ ] Mobile responsive (horizontal scroll)
- [ ] Sri Lankan timezone used for times
- [ ] Performance optimized for 1000+ rows

---

## Task 52: Create Export Attendance

### Overview
Create export functionality that allows users to download attendance data in multiple formats (CSV, Excel, PDF) with customizable options for columns, date ranges, and filtering.

### Dependencies
- Task 51: Create Attendance Report Table

### Instructions

1. **Create export button component**
   - Create `ExportAttendance.tsx` in Attendance directory
   - Dropdown button with format options
   - Icon: Download symbol
   - Placement: Above table, near filters

2. **Add export format options**
   - CSV format option
   - Excel (XLSX) format option
   - PDF format option
   - JSON format option (for developers)
   - Format icons and descriptions

3. **Create export configuration dialog**
   - Modal/drawer for export settings
   - Column selection (choose which columns)
   - Date range selection
   - Filter options
   - File name input
   - Format preview

4. **Implement CSV export**
   - Generate CSV from table data
   - Include headers
   - Proper comma/quote escaping
   - UTF-8 encoding
   - Download as file

5. **Implement Excel export**
   - Use library (e.g., exceljs, xlsx)
   - Multiple sheets if needed
   - Formatted cells (colors, borders)
   - Auto-column width
   - Header formatting
   - Company logo in header

6. **Implement PDF export**
   - Use library (e.g., pdfmake, jsPDF)
   - Professional layout
   - Company header with logo
   - Table with proper formatting
   - Page numbers
   - Print-ready A4 size

7. **Add column selection**
   - Checklist of all columns
   - Select all / Deselect all
   - Required columns (can't uncheck)
   - Preview selected columns
   - Reorder columns option

8. **Implement data filtering for export**
   - Use current table filters
   - Option to export all or filtered data
   - Option to export selected rows only
   - Date range for export
   - Department filter

9. **Add file naming options**
   - Default: "Attendance_Report_YYYY-MM-DD"
   - Custom name input
   - Automatic timestamp
   - Department/period in name
   - Sanitize filename

10. **Create export progress indicator**
    - Show progress bar for large exports
    - Cancel export option
    - Estimated time remaining
    - Success notification
    - Download link

11. **Implement batch export**
    - Export multiple formats at once
    - Export multiple periods
    - Compress as ZIP
    - Email export option
    - Schedule regular exports

12. **Add export templates**
    - Save export configurations
    - "My Exports" templates
    - Quick export buttons
    - Share templates with team
    - Default template option

### Export Button Layout
```
Simple Button:
┌────────────────────────────────┐
│ [↓ Export]                     │
└────────────────────────────────┘

Dropdown Menu:
┌────────────────────────────────┐
│ Export As...                   │
├────────────────────────────────┤
│ 📄 CSV File                    │
│ 📊 Excel Spreadsheet           │
│ 📋 PDF Document                │
│ 🔧 JSON Data                   │
├────────────────────────────────┤
│ ⚙️ Configure Export...         │
└────────────────────────────────┘

Export Configuration Dialog:
┌────────────────────────────────────────┐
│ Export Configuration           [×]     │
├────────────────────────────────────────┤
│ Format: [Excel ▼]                      │
│                                        │
│ Columns to Export:                     │
│ ☑ Date          ☑ Employee Name        │
│ ☑ Department    ☑ Clock In             │
│ ☑ Clock Out     ☑ Duration             │
│ ☑ Status        ☐ Location             │
│ [Select All] [Deselect All]           │
│                                        │
│ Date Range: [This Month ▼]            │
│ From: [2024-01-01] To: [2024-01-31]   │
│                                        │
│ Include:                               │
│ ○ All Records (456)                    │
│ ○ Filtered Records (142)               │
│ ○ Selected Rows Only (5)              │
│                                        │
│ File Name:                             │
│ [Attendance_Report_2024-01         ]  │
│                                        │
│ Options:                               │
│ ☑ Include Summary Statistics          │
│ ☑ Include Charts                       │
│ ☐ Email after export                  │
│                                        │
│        [ Cancel ]  [ Export ]         │
└────────────────────────────────────────┘

Exporting Progress:
┌────────────────────────────────────────┐
│ Exporting Attendance Data...          │
├────────────────────────────────────────┤
│ ████████████████░░░░░░░░░░ 62%        │
│                                        │
│ Processing 284 of 456 records         │
│ Estimated time: 5 seconds             │
│                                        │
│          [ Cancel Export ]            │
└────────────────────────────────────────┘

Export Complete:
┌────────────────────────────────────────┐
│ ✓ Export Complete!                    │
├────────────────────────────────────────┤
│ File: Attendance_Report_2024-01.xlsx  │
│ Size: 245 KB                           │
│ Records: 456                           │
│                                        │
│   [ Download ] [ Export Another ]     │
└────────────────────────────────────────┘
```

### Export Format Options

| Format | File Extension | Use Case | Features |
|--------|---------------|----------|----------|
| CSV | .csv | Simple data, Excel import | Plain text, universal |
| Excel | .xlsx | Formatted reports | Multiple sheets, formatting |
| PDF | .pdf | Official reports, printing | Professional layout |
| JSON | .json | Developer/API integration | Structured data |

### CSV Export Specifications

| Feature | Implementation |
|---------|----------------|
| Delimiter | Comma (,) |
| Text Qualifier | Double quote (") |
| Encoding | UTF-8 with BOM |
| Line Ending | CRLF (\r\n) |
| Header Row | Yes, column names |
| Date Format | YYYY-MM-DD |
| Time Format | HH:MM:SS |

### Excel Export Features

| Feature | Description |
|---------|-------------|
| Worksheets | Summary, Details, Charts |
| Header | Company logo, title, date |
| Formatting | Bold headers, borders, colors |
| Formulas | Duration calculations, totals |
| Filters | Auto-filter on header row |
| Freeze Panes | First row and column |
| Column Width | Auto-fit to content |
| Charts | Attendance trend chart |

### PDF Export Layout

| Section | Content |
|---------|---------|
| Header | Company logo, name, address |
| Title | "Attendance Report" with date range |
| Summary | Total stats (present, absent, etc.) |
| Table | Attendance records in table format |
| Charts | Visual representations (optional) |
| Footer | Page numbers, generated date, user |

### Column Selection Options

| Column | Required | Default | Description |
|--------|----------|---------|-------------|
| Date | Yes | Yes | Cannot deselect |
| Employee Name | Yes | Yes | Cannot deselect |
| Employee ID | No | Yes | Employee identifier |
| Department | No | Yes | Department name |
| Clock In | No | Yes | Clock in time |
| Clock Out | No | Yes | Clock out time |
| Duration | No | Yes | Work duration |
| Status | No | Yes | Attendance status |
| Location | No | No | Geo coordinates |
| Notes | No | No | Comments/remarks |

### Export Data Filtering

| Filter Type | Options | Default |
|-------------|---------|---------|
| Records | All / Filtered / Selected | Filtered |
| Date Range | Quick options / Custom | Current filters |
| Department | All / Specific departments | Current filter |
| Status | All / Specific statuses | Current filter |
| Employees | All / Specific employees | All |

### File Naming Convention

| Component | Format | Example |
|-----------|--------|---------|
| Prefix | Fixed text | Attendance_Report |
| Date Range | YYYY-MM-DD_to_YYYY-MM-DD | 2024-01-01_to_2024-01-31 |
| Department | Department name (if single) | Engineering |
| Timestamp | YYYYMMDD_HHMMSS | 20240115_143025 |
| Extension | Based on format | .xlsx, .csv, .pdf |

**Full Example:** `Attendance_Report_2024-01-01_to_2024-01-31_Engineering_20240115_143025.xlsx`

### Export Process Flow
```
1. User clicks "Export" button
   ↓
2. Show format dropdown menu
   ↓
3. User selects format (or "Configure")
   ↓
4. If "Configure": Open configuration dialog
   ↓
5. User selects columns, filters, options
   ↓
6. User clicks "Export"
   ↓
7. Validate selections
   ↓
8. Show progress indicator
   ↓
9. Fetch data from API (if not cached)
   ↓
10. Generate file in selected format
   ↓
11. Create download link
   ↓
12. Trigger browser download
   ↓
13. Show success notification
   ↓
14. Option to export another or close
```

### Export Performance

| Records | Expected Time | Strategy |
|---------|---------------|----------|
| < 1,000 | < 1 second | Client-side generation |
| 1,000 - 10,000 | 1-5 seconds | Client-side with progress |
| > 10,000 | 5-30 seconds | Server-side generation |
| > 50,000 | Background job | Email link when complete |

### Expected Component Structure
```typescript
// File: frontend/components/modules/hr/Attendance/ExportAttendance.tsx

// 'use client' directive
// Imports
// ExportAttendance props
//   - data: Attendance records to export
//   - filters: Current applied filters
//   - selectedRows: Selected row IDs
// ExportAttendance component
//   - Export button with dropdown
//   - Format options (CSV, Excel, PDF, JSON)
//   - Configuration dialog
//     - Column selection checklist
//     - Date range selector
//     - Data filtering options
//     - File name input
//     - Additional options
//   - Export handlers
//     - handleCSVExport
//     - handleExcelExport
//     - handlePDFExport
//     - handleJSONExport
//   - Progress indicator
//   - Success notification
//   - Download trigger

// File: frontend/services/export/attendanceExport.ts

// Export utility functions
// generateCSV(data, columns)
// generateExcel(data, columns, options)
// generatePDF(data, columns, options)
// generateJSON(data)
// downloadFile(blob, filename)
// formatDataForExport(data, columns)
```

### Export Templates

| Template | Pre-configured Settings |
|----------|------------------------|
| Daily Summary | Today's records, summary stats only |
| Weekly Report | This week, all columns, include charts |
| Monthly Full | This month, all data, Excel with sheets |
| Payroll Export | Required payroll columns, CSV format |
| Quick CSV | Filtered records, basic columns, CSV |

### Error Handling

| Error Scenario | Handling |
|----------------|----------|
| No Data | Show "No data to export" message |
| Large Dataset | Warn user, offer to email link |
| Network Error | Retry option, save configuration |
| File Too Large | Suggest narrower date range |
| Browser Limit | Switch to server-side generation |
| Permission Denied | Show access error message |

### Verification Checklist
- [ ] `ExportAttendance.tsx` component created
- [ ] Export button displays near table
- [ ] Format dropdown shows all options
- [ ] Configuration dialog opens
- [ ] Column selection checklist works
- [ ] Date range selector integrated
- [ ] File name input accepts custom names
- [ ] CSV export generates correctly
- [ ] Excel export creates formatted file
- [ ] PDF export produces professional layout
- [ ] JSON export includes all data
- [ ] Progress bar shows during export
- [ ] Download triggers automatically
- [ ] Success notification appears
- [ ] Large datasets handled efficiently
- [ ] Error messages display appropriately
- [ ] Export templates functional
- [ ] Selected rows export option works
- [ ] File naming convention followed

---

## Summary

This document completed attendance management by implementing clock in/out self-service with geo-location validation, comprehensive filtering system with department, employee, status, date range, and type filters, detailed reporting page with summary statistics, performance metrics, department comparison, and trend charts, flexible date range selector with quick options and custom ranges, comprehensive data table with sorting, filtering, pagination, and expandable rows, and powerful export functionality supporting CSV, Excel, and PDF formats with customizable options.

All features follow Sri Lankan labor standards including 8-hour workdays, overtime calculations, grace periods, break time deductions, and proper timezone handling (UTC+5:30). Geo-location features validate office proximity within 100 meters. The system provides both employee self-service and HR management capabilities.

### What's Next

Group D (Leave Management) will implement leave request workflows, approval systems, leave balance tracking, team leave calendar, and full API integration following Sri Lankan leave policies (14 days annual leave, 7 days casual leave, medical leave requirements).

---

**Document Status:** Ready for Implementation  
**Last Updated:** 2026-01-26
