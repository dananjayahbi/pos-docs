# Tasks 63-70: Staff/HR Reports

> **Phase:** 06 - ERP Advanced Modules  
> **SubPhase:** 14 - Analytics & Reports  
> **Group:** D - Customer & Staff Reports  
> **Document:** 02 of 02  
> **Tasks Covered:** 63, 64, 65, 66, 67, 68, 69, 70

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [01_Tasks-53-62_Customer-Reports.md](01_Tasks-53-62_Customer-Reports.md)

---

## Document Overview

This document covers the implementation of staff and HR analytics reports, including attendance tracking, leave utilization, and overtime analysis. These reports provide critical insights into workforce management, helping managers monitor attendance patterns, leave balances, and overtime costs across the organization.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 63 | Create AttendanceReport class | Medium | 35 min |
| 64 | Implement attendance rate calculation | Medium | 30 min |
| 65 | Add punctuality statistics | Medium | 30 min |
| 66 | Create LeaveReport class | Medium | 35 min |
| 67 | Implement leave utilization analysis | Medium | 35 min |
| 68 | Create OvertimeReport class | Medium | 35 min |
| 69 | Implement overtime cost calculation | Medium | 35 min |
| 70 | Create staff reports API endpoint | Medium | 30 min |

---

## Staff Reports Architecture

### Report Types Overview

| Report Type | Purpose | Key Metrics | Data Sources |
|-------------|---------|-------------|--------------|
| **AttendanceReport** | Track employee attendance patterns | Attendance rate, punctuality, absences | Employee, Attendance |
| **LeaveReport** | Analyze leave utilization | Leave balance, utilization rate, types | Employee, Leave |
| **OvertimeReport** | Monitor overtime hours and costs | Total hours, cost, per-employee breakdown | Employee, OvertimeRecord |

### Data Flow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                   Staff Reports System                       │
└─────────────────────────────────────────────────────────────┘
                              │
                              │
        ┌─────────────────────┼─────────────────────┐
        │                     │                     │
        ▼                     ▼                     ▼
┌───────────────┐     ┌───────────────┐    ┌──────────────┐
│  Attendance   │     │ LeaveReport   │    │  Overtime    │
│    Report     │     │               │    │   Report     │
└───────────────┘     └───────────────┘    └──────────────┘
        │                     │                     │
        │                     │                     │
┌───────┴────────┐    ┌───────┴────────┐   ┌──────┴───────┐
│ Attendance     │    │ Leave          │   │ Overtime     │
│ Model          │    │ Model          │   │ Record       │
└────────────────┘    └────────────────┘   └──────────────┘
        │                     │                     │
        └─────────────────────┴─────────────────────┘
                              │
                              ▼
                    ┌─────────────────┐
                    │   Employee      │
                    │   Model         │
                    └─────────────────┘
```

### Calculation Formulas

#### Attendance Rate
```
Attendance Rate = (Present Days / Total Working Days) × 100

Where:
- Present Days = Days marked as Present or On Time
- Total Working Days = Business days in period (excluding weekends/holidays)
- Excludes: Approved leaves, public holidays
```

#### Leave Utilization
```
Leave Utilization = (Leaves Taken / Total Leave Balance) × 100

Per Leave Type:
- Annual Leave: Entitled days vs. taken days
- Sick Leave: Available vs. utilized
- Casual Leave: Allocation vs. usage

Balance = Total Entitled - (Taken + Pending Approval)
```

#### Overtime Cost
```
Overtime Cost = Overtime Hours × Base Hourly Rate × Overtime Multiplier

Where:
- Base Hourly Rate = Monthly Salary / (Working Days × Hours per Day)
- Overtime Multiplier = 1.5x for weekdays, 2.0x for weekends/holidays
- Total Cost = Sum across all employees

Example:
Employee: Monthly Salary = Rs. 50,000
Working Days = 22, Hours per Day = 8
Base Hourly = 50,000 / (22 × 8) = Rs. 284.09
Overtime (5 hours @ 1.5x) = 5 × 284.09 × 1.5 = Rs. 2,130.68
```

---

## Task 63: Create AttendanceReport Class

### Overview
Create the `AttendanceReport` class that inherits from `BaseReportGenerator` to provide comprehensive attendance analytics. This report tracks employee attendance patterns, calculates attendance rates, and provides insights into workforce presence.

### Dependencies
- `BaseReportGenerator` class (from Task 41)
- `Employee` model
- `Attendance` model with status tracking
- Django ORM and QuerySet methods

### Instructions

1. **Create AttendanceReport file**
   - Navigate to `apps/reports/analytics/` directory
   - Create file `attendance_report.py`
   - Import BaseReportGenerator and required models

2. **Define AttendanceReport class**
   - Inherit from `BaseReportGenerator`
   - Set `report_type` attribute to 'attendance'
   - Add class docstring explaining attendance analytics

3. **Define report metadata**
   - Set `report_name` to 'Employee Attendance Report'
   - Set `report_category` to 'hr_analytics'
   - Define `default_date_field` as 'attendance_date'

4. **Configure data source**
   - Set `model` attribute to `Attendance` model
   - Configure QuerySet to include employee relationships
   - Add select_related for employee details

5. **Define available filters**
   - Employee filter (single or multiple)
   - Department filter
   - Date range filter (start_date, end_date)
   - Attendance status filter (Present, Absent, Late, etc.)

6. **Implement get_queryset method**
   - Override base method to add attendance-specific filtering
   - Apply employee filter if provided
   - Apply department filter if provided
   - Apply date range filter
   - Apply status filter
   - Order by attendance_date and employee

7. **Configure aggregations**
   - Total attendance records
   - Unique employees count
   - Present days count
   - Absent days count
   - Late arrivals count
   - Early departures count

8. **Define grouping options**
   - By employee (id, name, department)
   - By department
   - By date (daily, weekly, monthly)
   - By status

9. **Add export formats**
   - Support PDF export
   - Support Excel export
   - Support CSV export
   - Include formatted date columns

### Report Structure

```
Attendance Report
═════════════════════════════════════════════════════════════
Period: [Start Date] to [End Date]
Department: [Department Name / All Departments]
─────────────────────────────────────────────────────────────

Summary Statistics:
├── Total Employees Tracked: 125
├── Total Working Days: 22
├── Total Present Days: 2,580
├── Total Absent Days: 170
├── Average Attendance Rate: 93.8%
└── Late Arrivals: 48 (1.9%)

By Employee:
┌─────────┬──────────────────┬────────┬────────┬────────┬───────┐
│ Emp ID  │ Employee Name    │Present │ Absent │ Late   │ Rate  │
├─────────┼──────────────────┼────────┼────────┼────────┼───────┤
│ EMP001  │ John Silva       │   20   │   2    │   1    │ 90.9% │
│ EMP002  │ Sarah Fernando   │   22   │   0    │   0    │ 100%  │
│ EMP003  │ Ravi Kumar       │   19   │   3    │   2    │ 86.4% │
└─────────┴──────────────────┴────────┴────────┴────────┴───────┘

Attendance Trends:
Week 1: 95.2% | Week 2: 94.1% | Week 3: 92.8% | Week 4: 93.5%
```

### Expected Outcome
- AttendanceReport class successfully created
- Inherits all BaseReportGenerator functionality
- Provides attendance-specific filtering and grouping
- Supports multiple export formats
- Includes comprehensive attendance metrics

### Verification Checklist
- [ ] `attendance_report.py` file created
- [ ] `AttendanceReport` class defined
- [ ] Inherits from `BaseReportGenerator`
- [ ] `report_type` set to 'attendance'
- [ ] `report_name` and `report_category` configured
- [ ] Employee and department filters implemented
- [ ] Date range filtering works correctly
- [ ] Status filtering functional
- [ ] get_queryset method overridden
- [ ] Aggregations configured
- [ ] Grouping options defined
- [ ] Export formats supported

---

## Task 64: Implement Attendance Rate Calculation

### Overview
Implement the attendance rate calculation logic within the `AttendanceReport` class. This calculation determines the percentage of working days an employee was present, providing a key metric for workforce management.

### Dependencies
- AttendanceReport class (from Task 63)
- Attendance model with status field
- Working days calculation logic
- Date utilities for business days

### Instructions

1. **Create calculate_attendance_rate method**
   - Add method to `AttendanceReport` class
   - Accept parameters: employee_id, start_date, end_date
   - Return attendance rate as percentage

2. **Calculate total working days**
   - Determine business days in date range
   - Exclude weekends (configurable)
   - Exclude public holidays (from holidays table)
   - Consider company working schedule

3. **Count present days**
   - Query Attendance records for employee
   - Filter by date range
   - Count records with status='Present' or 'On Time'
   - Include partial attendance if configured

4. **Handle leave days**
   - Query approved leaves in date range
   - Exclude approved leave days from calculation
   - Treat approved leaves as neutral (not absent)
   - Only count unauthorized absences

5. **Calculate attendance rate**
   - Formula: (Present Days / Working Days) × 100
   - Round to 2 decimal places
   - Handle edge case: zero working days
   - Return None if insufficient data

6. **Implement batch calculation**
   - Create `calculate_rates_for_employees` method
   - Accept list of employee IDs
   - Calculate rates for all employees efficiently
   - Use bulk queries to optimize performance

7. **Add rate categorization**
   - Excellent: 95% - 100%
   - Good: 90% - 94.9%
   - Satisfactory: 85% - 89.9%
   - Needs Improvement: < 85%
   - Create helper method for categorization

8. **Implement period comparison**
   - Add method to compare attendance across periods
   - Calculate current period vs. previous period
   - Show improvement or decline
   - Calculate trend percentage

### Calculation Logic Flow

```
┌─────────────────────────────────────────────┐
│  Attendance Rate Calculation Process        │
└─────────────────────────────────────────────┘
                    │
                    ▼
         ┌──────────────────────┐
         │  Get Date Range      │
         │  (Start → End)       │
         └──────────────────────┘
                    │
                    ▼
         ┌──────────────────────┐
         │  Calculate Working   │
         │  Days in Range       │
         │  (Exclude Weekends)  │
         └──────────────────────┘
                    │
                    ▼
         ┌──────────────────────┐
         │  Exclude Public      │
         │  Holidays            │
         └──────────────────────┘
                    │
                    ▼
         ┌──────────────────────┐
         │  Count Present Days  │
         │  (Status=Present)    │
         └──────────────────────┘
                    │
                    ▼
         ┌──────────────────────┐
         │  Exclude Approved    │
         │  Leave Days          │
         └──────────────────────┘
                    │
                    ▼
         ┌──────────────────────┐
         │  Calculate Rate:     │
         │  (Present/Working)   │
         │  × 100               │
         └──────────────────────┘
                    │
                    ▼
         ┌──────────────────────┐
         │  Categorize Result   │
         │  (Excellent/Good)    │
         └──────────────────────┘
```

### Rate Categories Table

| Category | Range | Indicator | Action Required |
|----------|-------|-----------|----------------|
| Excellent | 95% - 100% | 🟢 Green | No action needed |
| Good | 90% - 94.9% | 🟡 Yellow | Monitor |
| Satisfactory | 85% - 89.9% | 🟠 Orange | Review with employee |
| Needs Improvement | < 85% | 🔴 Red | Manager intervention required |

### Expected Outcome
- Accurate attendance rate calculation
- Proper handling of leaves and holidays
- Efficient batch processing for multiple employees
- Rate categorization for quick assessment
- Period comparison for trend analysis

### Verification Checklist
- [ ] `calculate_attendance_rate` method implemented
- [ ] Working days calculation correct
- [ ] Weekend exclusion working
- [ ] Public holidays excluded
- [ ] Present days counted accurately
- [ ] Approved leaves handled properly
- [ ] Formula applied correctly: (Present/Working) × 100
- [ ] Result rounded to 2 decimal places
- [ ] Edge cases handled (zero working days)
- [ ] Batch calculation method created
- [ ] Rate categorization implemented
- [ ] Period comparison functional
- [ ] Performance optimized with bulk queries

---

## Task 65: Add Punctuality Statistics

### Overview
Extend the AttendanceReport with punctuality statistics that track late arrivals and early departures. This feature provides insights into employee time discipline and helps identify patterns of tardiness.

### Dependencies
- AttendanceReport class with attendance rate (Tasks 63-64)
- Attendance model with time fields (check_in, check_out)
- Company schedule configuration (work start time, end time)
- Time calculation utilities

### Instructions

1. **Add punctuality fields to report**
   - Extend report data structure
   - Add late_arrivals_count field
   - Add early_departures_count field
   - Add average_delay_minutes field
   - Add punctuality_percentage field

2. **Implement late arrival detection**
   - Create `calculate_late_arrivals` method
   - Get configured work start time (e.g., 08:30)
   - Add grace period tolerance (e.g., 10 minutes)
   - Compare check_in time with start time + grace
   - Count instances where check_in > threshold

3. **Calculate delay duration**
   - For each late arrival, calculate delay in minutes
   - Delay = check_in_time - (start_time + grace_period)
   - Aggregate total delay minutes
   - Calculate average delay across late arrivals

4. **Implement early departure detection**
   - Create `calculate_early_departures` method
   - Get configured work end time (e.g., 17:30)
   - Compare check_out time with end time
   - Count instances where check_out < end_time
   - Calculate minutes left early

5. **Calculate punctuality percentage**
   - Formula: ((Working Days - Late Arrivals) / Working Days) × 100
   - Represents on-time arrival rate
   - Should be separate from attendance rate
   - Round to 2 decimal places

6. **Implement pattern analysis**
   - Create `analyze_punctuality_patterns` method
   - Group late arrivals by day of week
   - Identify if Mondays or Fridays have more instances
   - Calculate average for each day
   - Return pattern insights

7. **Add severity classification**
   - Classify late arrivals by severity
   - Minor: 1-15 minutes late
   - Moderate: 16-30 minutes late
   - Serious: 31-60 minutes late
   - Critical: > 60 minutes late
   - Count instances in each category

8. **Implement reporting methods**
   - Create `get_punctuality_summary` method
   - Return dictionary with all punctuality metrics
   - Include totals, averages, and percentages
   - Add per-employee breakdown

9. **Add comparative analysis**
   - Compare employee punctuality with department average
   - Calculate deviation from company average
   - Flag employees significantly below average
   - Suggest threshold for review (e.g., < 85%)

### Punctuality Metrics Structure

```
Punctuality Analysis
═════════════════════════════════════════════════════════════
Employee: John Silva (EMP001)
Department: Sales
Period: January 2026
─────────────────────────────────────────────────────────────

Punctuality Summary:
├── Total Working Days: 22
├── On-Time Arrivals: 18
├── Late Arrivals: 4
├── Punctuality Rate: 81.8%
├── Average Delay (when late): 18 minutes
└── Status: ⚠️ Needs Monitoring

Late Arrival Breakdown:
├── Minor (1-15 min): 2 instances
├── Moderate (16-30 min): 1 instance
├── Serious (31-60 min): 1 instance
└── Critical (>60 min): 0 instances

Pattern Analysis:
┌────────────┬───────────┬─────────────────┐
│ Day        │ Late Count│ Avg Delay (min) │
├────────────┼───────────┼─────────────────┤
│ Monday     │     2     │       22        │
│ Tuesday    │     0     │       0         │
│ Wednesday  │     1     │       15        │
│ Thursday   │     0     │       0         │
│ Friday     │     1     │       12        │
└────────────┴───────────┴─────────────────┘

Early Departures:
├── Total Instances: 1
├── Average Time Left Early: 45 minutes
└── Date: Jan 15, 2026 (left at 16:45)

Department Comparison:
├── Employee Punctuality: 81.8%
├── Department Average: 92.5%
├── Deviation: -10.7% (Below Average)
└── Action: Manager Review Recommended
```

### Severity Thresholds

| Severity | Delay Range | Action | Escalation |
|----------|-------------|--------|------------|
| Minor | 1-15 min | Verbal reminder | After 3 instances/month |
| Moderate | 16-30 min | Written warning | After 2 instances/month |
| Serious | 31-60 min | Formal warning | Immediate |
| Critical | > 60 min | HR investigation | Immediate |

### Expected Outcome
- Comprehensive punctuality tracking
- Late arrival and early departure detection
- Pattern analysis by day of week
- Severity classification of delays
- Comparative analysis with department/company averages
- Actionable insights for management

### Verification Checklist
- [ ] Punctuality fields added to report
- [ ] Late arrival detection implemented
- [ ] Grace period considered
- [ ] Delay duration calculated correctly
- [ ] Early departure detection working
- [ ] Punctuality percentage calculated
- [ ] Pattern analysis by weekday functional
- [ ] Severity classification implemented
- [ ] Per-employee summary method created
- [ ] Department comparison working
- [ ] Edge cases handled (missing check-in/out)
- [ ] Performance optimized

---

## Task 66: Create LeaveReport Class

### Overview
Create the `LeaveReport` class to analyze employee leave utilization, track balances, and provide insights into leave patterns across different leave types (annual, sick, casual). This report helps HR manage leave policies and identify potential issues.

### Dependencies
- BaseReportGenerator class (from Task 41)
- Employee model
- Leave model with type and status fields
- LeaveBalance model (if separate)
- Leave entitlement configuration

### Instructions

1. **Create LeaveReport file**
   - Navigate to `apps/reports/analytics/` directory
   - Create file `leave_report.py`
   - Import BaseReportGenerator and required models

2. **Define LeaveReport class**
   - Inherit from `BaseReportGenerator`
   - Set `report_type` attribute to 'leave'
   - Add class docstring explaining leave analytics

3. **Configure report metadata**
   - Set `report_name` to 'Employee Leave Analysis Report'
   - Set `report_category` to 'hr_analytics'
   - Define `default_date_field` as 'start_date'

4. **Define leave type constants**
   - Annual Leave (AL)
   - Sick Leave (SL)
   - Casual Leave (CL)
   - Maternity Leave (ML)
   - Paternity Leave (PL)
   - Unpaid Leave (UL)
   - Compensatory Leave (CO)

5. **Configure data source**
   - Set `model` attribute to `Leave` model
   - Add select_related for employee details
   - Include leave type and status

6. **Define available filters**
   - Employee filter (single or multiple)
   - Department filter
   - Leave type filter (select multiple types)
   - Status filter (Pending, Approved, Rejected)
   - Date range filter
   - Leave duration filter (< 3 days, 3-7 days, > 7 days)

7. **Implement get_queryset method**
   - Override base method for leave-specific filtering
   - Apply employee filter
   - Apply department filter
   - Apply leave type filter
   - Apply status filter
   - Apply date range filter
   - Order by start_date descending

8. **Configure aggregations**
   - Total leave days taken
   - Total leave requests
   - Approved leave count
   - Pending leave count
   - Rejected leave count
   - Average leave duration
   - By leave type breakdown

9. **Define grouping options**
   - By employee
   - By department
   - By leave type
   - By month
   - By status

10. **Add leave balance tracking**
    - Method to get current balance per leave type
    - Calculate balance: Entitled - (Taken + Pending)
    - Show utilization percentage
    - Flag low balance warnings

### Report Structure

```
Leave Analysis Report
═════════════════════════════════════════════════════════════
Period: January 2026 - December 2026
Department: All Departments
─────────────────────────────────────────────────────────────

Summary Statistics:
├── Total Employees: 125
├── Total Leave Days Taken: 1,840
├── Average Leave Days/Employee: 14.7
├── Pending Requests: 15
└── Rejection Rate: 2.3%

Leave Type Breakdown:
┌─────────────────┬──────────┬────────┬─────────┬──────────┐
│ Leave Type      │ Entitled │ Taken  │ Balance │ Util. %  │
├─────────────────┼──────────┼────────┼─────────┼──────────┤
│ Annual Leave    │  2,500   │ 1,230  │ 1,270   │  49.2%   │
│ Sick Leave      │  1,250   │   385  │   865   │  30.8%   │
│ Casual Leave    │    750   │   225  │   525   │  30.0%   │
│ Maternity Leave │    630   │   420  │   210   │  66.7%   │
│ Paternity Leave │    175   │    35  │   140   │  20.0%   │
└─────────────────┴──────────┴────────┴─────────┴──────────┘

By Employee (Top Utilizers):
┌─────────┬──────────────────┬──────────┬──────┬──────────┐
│ Emp ID  │ Name             │ Leave Type│ Taken│ Balance  │
├─────────┼──────────────────┼──────────┼──────┼──────────┤
│ EMP015  │ Priya Perera     │ Maternity│  90  │    0     │
│ EMP042  │ Saman Bandara    │ Annual   │  18  │    2     │
│ EMP089  │ Lisa Fernando    │ Sick     │  12  │    0     │
└─────────┴──────────────────┴──────────┴──────┴──────────┘

Monthly Trend:
Jan│████░░░░ 35%  |  Apr│██████░░ 58%  |  Jul│███████░ 71%
Feb│█████░░░ 48%  |  May│████░░░░ 42%  |  Aug│█████░░░ 52%
Mar│███░░░░░ 28%  |  Jun│██████░░ 63%  |  Sep│████░░░░ 45%
```

### Expected Outcome
- Comprehensive leave analysis report
- Leave balance tracking per type
- Utilization percentage calculation
- Employee-level and department-level insights
- Support for multiple leave types
- Trend analysis over time

### Verification Checklist
- [ ] `leave_report.py` file created
- [ ] `LeaveReport` class defined
- [ ] Inherits from `BaseReportGenerator`
- [ ] Report metadata configured
- [ ] Leave type constants defined
- [ ] Employee and department filters work
- [ ] Leave type filter implemented
- [ ] Status filter functional
- [ ] Date range filtering works
- [ ] get_queryset method overridden
- [ ] Aggregations configured correctly
- [ ] Grouping options defined
- [ ] Leave balance calculation method added

---

## Task 67: Implement Leave Utilization Analysis

### Overview
Implement comprehensive leave utilization analysis within the `LeaveReport` class. This includes calculating utilization rates, identifying patterns, and providing predictive insights for leave management.

### Dependencies
- LeaveReport class (from Task 66)
- Leave model with dates and duration
- LeaveBalance or entitlement configuration
- Date utilities for period calculations

### Instructions

1. **Create calculate_utilization_rate method**
   - Add method to calculate leave utilization
   - Parameters: employee_id, leave_type, period (year)
   - Formula: (Leaves Taken / Total Entitled) × 100
   - Return utilization percentage

2. **Implement entitlement retrieval**
   - Create method to get leave entitlement
   - Check employee contract for entitled days
   - Consider probation period rules
   - Account for pro-rated entitlements (mid-year joiners)
   - Return entitled days per leave type

3. **Calculate taken leaves**
   - Query approved leaves for employee
   - Filter by leave type and period
   - Sum total days taken
   - Handle half-day leaves correctly
   - Exclude rejected leaves

4. **Calculate pending leaves**
   - Query leaves with status='Pending'
   - Include in calculations with flag
   - Show separately in reports
   - Consider for balance calculations

5. **Calculate remaining balance**
   - Formula: Entitled - (Taken + Pending)
   - Separate calculation per leave type
   - Handle negative balance cases
   - Flag if balance < 0 (over-utilized)

6. **Implement utilization categorization**
   - Under-utilized: < 30% (may forfeit unused leaves)
   - Normal: 30% - 70%
   - High: 70% - 90%
   - Critical: > 90% (limited leave availability)
   - Create helper method for categorization

7. **Add pattern detection**
   - Create `analyze_leave_patterns` method
   - Identify clustering (multiple employees on leave same dates)
   - Detect frequent short leaves (potential abuse)
   - Find unusual patterns (all Fridays/Mondays)
   - Flag suspicious patterns for review

8. **Implement seasonal analysis**
   - Group leaves by month
   - Calculate monthly utilization rates
   - Identify peak leave months
   - Compare with previous year
   - Predict future demand

9. **Create balance projection**
   - Calculate projected year-end balance
   - Based on current utilization rate
   - Formula: Current Balance - (Average Monthly × Remaining Months)
   - Flag potential forfeitures
   - Suggest optimal leave planning

10. **Add department-level analysis**
    - Aggregate utilization by department
    - Calculate department average
    - Compare with company average
    - Identify departments with issues
    - Check if any department under-staffed due to leaves

### Utilization Analysis Flow

```
┌─────────────────────────────────────────────┐
│  Leave Utilization Analysis Process         │
└─────────────────────────────────────────────┘
                    │
                    ▼
         ┌──────────────────────┐
         │  Get Employee Leave  │
         │  Entitlements        │
         └──────────────────────┘
                    │
                    ▼
         ┌──────────────────────┐
         │  Calculate Taken     │
         │  (Approved Leaves)   │
         └──────────────────────┘
                    │
                    ▼
         ┌──────────────────────┐
         │  Calculate Pending   │
         │  (Awaiting Approval) │
         └──────────────────────┘
                    │
                    ▼
         ┌──────────────────────┐
         │  Calculate Balance   │
         │  (Remaining)         │
         └──────────────────────┘
                    │
                    ▼
         ┌──────────────────────┐
         │  Calculate Util %    │
         │  (Taken/Entitled)    │
         └──────────────────────┘
                    │
                    ▼
         ┌──────────────────────┐
         │  Categorize Result   │
         │  & Flag Issues       │
         └──────────────────────┘
                    │
                    ▼
         ┌──────────────────────┐
         │  Pattern Analysis    │
         │  & Predictions       │
         └──────────────────────┘
```

### Utilization Categories

| Category | Range | Indicator | Action |
|----------|-------|-----------|--------|
| Under-utilized | < 30% | 🔵 Blue | Remind employees to use leaves |
| Normal | 30% - 70% | 🟢 Green | No action needed |
| High | 70% - 90% | 🟡 Yellow | Monitor remaining leaves |
| Critical | > 90% | 🟠 Orange | Plan carefully, limited availability |
| Over-utilized | > 100% | 🔴 Red | Review policy, check for errors |

### Pattern Detection Examples

| Pattern Type | Indicator | Action Required |
|--------------|-----------|----------------|
| Frequent Friday/Monday leaves | > 4 instances/quarter | Review with employee |
| Clustering with others | 3+ employees same dates | Check team coverage |
| Short frequent leaves | > 6 single-day leaves | Investigate reason |
| Last-minute requests | > 5 requests with < 3 days notice | Policy reminder |
| Excessive sick leave | > 15 days/year | Medical certificate required |

### Expected Outcome
- Accurate utilization rate calculation
- Balance tracking per leave type
- Pattern detection for suspicious activity
- Seasonal analysis for planning
- Predictive insights for future leave demand
- Department-level analysis

### Verification Checklist
- [ ] Utilization rate calculation implemented
- [ ] Entitlement retrieval working
- [ ] Taken leaves counted correctly
- [ ] Pending leaves included
- [ ] Balance calculation accurate
- [ ] Formula correct: (Taken/Entitled) × 100
- [ ] Utilization categorization implemented
- [ ] Pattern detection functional
- [ ] Seasonal analysis working
- [ ] Balance projection calculated
- [ ] Department-level aggregation working
- [ ] Edge cases handled (negative balance, pro-rata)
- [ ] Performance optimized

---

## Task 68: Create OvertimeReport Class

### Overview
Create the `OvertimeReport` class to track and analyze employee overtime hours and associated costs. This report helps management monitor overtime expenses, identify trends, and ensure compliance with labor regulations.

### Dependencies
- BaseReportGenerator class (from Task 41)
- Employee model with salary information
- OvertimeRecord model with hours and multiplier
- Company overtime policy configuration
- Labor law compliance rules

### Instructions

1. **Create OvertimeReport file**
   - Navigate to `apps/reports/analytics/` directory
   - Create file `overtime_report.py`
   - Import BaseReportGenerator and required models

2. **Define OvertimeReport class**
   - Inherit from `BaseReportGenerator`
   - Set `report_type` attribute to 'overtime'
   - Add class docstring explaining overtime analytics

3. **Configure report metadata**
   - Set `report_name` to 'Overtime Hours and Cost Report'
   - Set `report_category` to 'hr_analytics'
   - Define `default_date_field` as 'overtime_date'

4. **Define overtime types**
   - Regular weekday overtime (1.5x multiplier)
   - Weekend overtime (2.0x multiplier)
   - Public holiday overtime (2.5x multiplier)
   - Night shift overtime (additional allowance)
   - Emergency overtime (special rate)

5. **Configure data source**
   - Set `model` attribute to `OvertimeRecord` model
   - Add select_related for employee and salary data
   - Include overtime type and approval status

6. **Define available filters**
   - Employee filter (single or multiple)
   - Department filter
   - Date range filter
   - Overtime type filter
   - Approval status filter (Pending, Approved, Rejected)
   - Cost threshold filter (high-cost overtime)

7. **Implement get_queryset method**
   - Override base method for overtime-specific filtering
   - Apply employee filter
   - Apply department filter
   - Apply date range filter
   - Apply overtime type filter
   - Only include approved overtime by default
   - Order by overtime_date descending

8. **Configure aggregations**
   - Total overtime hours
   - Total overtime cost
   - Average overtime per employee
   - Average cost per hour
   - By overtime type breakdown
   - By department totals

9. **Define grouping options**
   - By employee (id, name, department)
   - By department
   - By overtime type
   - By date (daily, weekly, monthly)
   - By shift

10. **Add cost tracking**
    - Method to calculate overtime cost
    - Consider salary, hours, and multiplier
    - Track total monthly/yearly cost
    - Budget comparison if configured

### Report Structure

```
Overtime Report
═════════════════════════════════════════════════════════════
Period: January 2026
Department: All Departments
─────────────────────────────────────────────────────────────

Summary Statistics:
├── Total Overtime Hours: 487.5 hours
├── Total Overtime Cost: Rs. 1,245,680
├── Average Cost/Hour: Rs. 2,555
├── Employees with Overtime: 42
├── Average Hours/Employee: 11.6 hours
└── Budget Status: 78.3% utilized

Overtime Type Breakdown:
┌──────────────────┬─────────┬────────────┬────────────────┐
│ Overtime Type    │ Hours   │ Cost (Rs.) │ % of Total     │
├──────────────────┼─────────┼────────────┼────────────────┤
│ Weekday (1.5x)   │  325.0  │  715,420   │     57.4%      │
│ Weekend (2.0x)   │  120.0  │  395,260   │     31.7%      │
│ Holiday (2.5x)   │   42.5  │  135,000   │     10.8%      │
│ Night Shift      │   18.0  │   45,000   │      3.6%      │
└──────────────────┴─────────┴────────────┴────────────────┘

By Employee (Top 10):
┌─────────┬───────────────────┬─────────┬────────────┬──────────┐
│ Emp ID  │ Name              │ Hours   │ Cost (Rs.) │ Avg/Week │
├─────────┼───────────────────┼─────────┼────────────┼──────────┤
│ EMP023  │ Kasun Jayasinghe  │   48.5  │  156,890   │   12.1   │
│ EMP067  │ Nimal Perera      │   42.0  │  138,240   │   10.5   │
│ EMP105  │ Amaya Silva       │   38.5  │  127,365   │    9.6   │
└─────────┴───────────────────┴─────────┴────────────┴──────────┘

Department Summary:
┌──────────────────┬─────────┬────────────┬───────────┐
│ Department       │ Hours   │ Cost (Rs.) │ Employees │
├──────────────────┼─────────┼────────────┼───────────┤
│ Manufacturing    │  245.0  │  625,480   │    18     │
│ Warehouse        │  128.5  │  315,260   │    12     │
│ Customer Service │   74.0  │  198,540   │     8     │
│ Sales            │   40.0  │  106,400   │     4     │
└──────────────────┴─────────┴────────────┴───────────┘

Weekly Trend:
Week 1│████████░░ 118.5h | Week 3│██████████ 142.0h
Week 2│██████░░░░  95.0h | Week 4│████████░░ 132.0h
```

### Expected Outcome
- Comprehensive overtime tracking report
- Cost calculation per employee and department
- Overtime type breakdown with multipliers
- Budget utilization tracking
- Trend analysis over time
- Compliance monitoring capability

### Verification Checklist
- [ ] `overtime_report.py` file created
- [ ] `OvertimeReport` class defined
- [ ] Inherits from `BaseReportGenerator`
- [ ] Report metadata configured
- [ ] Overtime types defined
- [ ] Employee and department filters work
- [ ] Date range filtering implemented
- [ ] Overtime type filter functional
- [ ] Approval status filter working
- [ ] get_queryset method overridden
- [ ] Aggregations configured
- [ ] Grouping options defined
- [ ] Cost tracking method added

---

## Task 69: Implement Overtime Cost Calculation

### Overview
Implement detailed overtime cost calculation logic within the `OvertimeReport` class. This includes computing base hourly rates, applying overtime multipliers, and tracking total costs across various overtime scenarios.

### Dependencies
- OvertimeReport class (from Task 68)
- Employee model with salary fields
- OvertimeRecord model with hours and type
- Company overtime policy settings
- Sri Lankan labor law compliance rules

### Instructions

1. **Create calculate_hourly_rate method**
   - Add method to calculate base hourly rate
   - Parameters: employee_id
   - Get employee monthly salary
   - Get working days per month (default: 22)
   - Get hours per day (default: 8)
   - Formula: Monthly Salary / (Working Days × Hours per Day)
   - Return base hourly rate

2. **Implement overtime multiplier logic**
   - Create method to get overtime multiplier
   - Parameters: overtime_type, datetime
   - Weekday overtime: 1.5x
   - Weekend overtime: 2.0x
   - Public holiday overtime: 2.5x
   - Night shift (10pm-6am): 1.5x base + night allowance
   - Return appropriate multiplier

3. **Create calculate_overtime_cost method**
   - Parameters: employee_id, hours, overtime_type
   - Get base hourly rate
   - Get overtime multiplier
   - Formula: Hours × Base Hourly Rate × Multiplier
   - Add any fixed allowances
   - Round to 2 decimal places
   - Return total cost

4. **Implement batch calculation**
   - Create `calculate_costs_for_period` method
   - Parameters: start_date, end_date, employee_ids (optional)
   - Query all overtime records in period
   - Calculate cost for each record
   - Aggregate total cost
   - Return summary with breakdown

5. **Add ceiling and threshold checks**
   - Implement maximum overtime hour limits
   - Sri Lankan law: typically 12 hours/day max
   - Weekly limit: 60 hours/week maximum
   - Monthly limit: configurable (e.g., 40-60 hours)
   - Flag violations for compliance review

6. **Implement cost center allocation**
   - Allow overtime cost allocation to projects/departments
   - Track cost per cost center
   - Support percentage-based allocation
   - Generate cost center reports

7. **Add budget comparison**
   - Create method to compare with overtime budget
   - Parameters: department, period
   - Get allocated budget from configuration
   - Calculate actual cost
   - Calculate variance: Actual - Budget
   - Calculate percentage: (Actual / Budget) × 100
   - Flag if over budget

8. **Implement trend analysis**
   - Create `analyze_cost_trends` method
   - Compare current period with previous periods
   - Calculate month-over-month growth
   - Calculate year-over-year comparison
   - Identify cost increase/decrease patterns
   - Predict future costs based on trends

9. **Add cost breakdown reporting**
   - Create detailed cost breakdown method
   - By employee: individual cost contribution
   - By department: departmental totals
   - By overtime type: cost per type
   - By project: if allocated
   - Generate summary statistics

10. **Implement compliance reporting**
    - Check hours against Sri Lankan labor laws
    - Flag excessive overtime (> 60 hours/month)
    - Ensure proper approvals exist
    - Generate compliance report
    - Include violations and warnings

### Cost Calculation Flow

```
┌─────────────────────────────────────────────┐
│  Overtime Cost Calculation Process          │
└─────────────────────────────────────────────┘
                    │
                    ▼
         ┌──────────────────────┐
         │  Get Employee Salary │
         │  (Monthly Base)      │
         └──────────────────────┘
                    │
                    ▼
         ┌──────────────────────┐
         │  Calculate Base      │
         │  Hourly Rate         │
         │  Salary/(Days×Hours) │
         └──────────────────────┘
                    │
                    ▼
         ┌──────────────────────┐
         │  Determine Overtime  │
         │  Multiplier          │
         │  (1.5x, 2.0x, 2.5x)  │
         └──────────────────────┘
                    │
                    ▼
         ┌──────────────────────┐
         │  Get Overtime Hours  │
         │  for Period          │
         └──────────────────────┘
                    │
                    ▼
         ┌──────────────────────┐
         │  Calculate Cost:     │
         │  Hours × Rate ×      │
         │  Multiplier          │
         └──────────────────────┘
                    │
                    ▼
         ┌──────────────────────┐
         │  Add Allowances      │
         │  (Night Shift, etc.) │
         └──────────────────────┘
                    │
                    ▼
         ┌──────────────────────┐
         │  Aggregate Total     │
         │  & Generate Report   │
         └──────────────────────┘
```

### Cost Calculation Example

```
Employee: Kasun Jayasinghe (EMP023)
Monthly Salary: Rs. 75,000
Working Days: 22
Hours per Day: 8

Base Hourly Rate:
= Rs. 75,000 / (22 × 8)
= Rs. 75,000 / 176
= Rs. 426.14 per hour

Overtime Breakdown:
┌─────────────────┬───────┬────────┬──────────┬─────────┐
│ Type            │ Hours │ Rate   │ Multi.   │ Cost    │
├─────────────────┼───────┼────────┼──────────┼─────────┤
│ Weekday         │  24.0 │ 426.14 │ 1.5x     │ 15,341  │
│ Weekend         │  16.5 │ 426.14 │ 2.0x     │ 14,063  │
│ Public Holiday  │   8.0 │ 426.14 │ 2.5x     │  8,523  │
├─────────────────┼───────┼────────┼──────────┼─────────┤
│ Total           │  48.5 │        │          │ 37,927  │
└─────────────────┴───────┴────────┴──────────┴─────────┘

Budget Comparison:
├── Allocated Budget: Rs. 35,000
├── Actual Cost: Rs. 37,927
├── Variance: Rs. +2,927 (Over Budget)
└── Percentage: 108.4%
```

### Compliance Limits

| Limit Type | Threshold | Action if Exceeded |
|------------|-----------|-------------------|
| Daily Maximum | 12 hours | Immediate manager approval required |
| Weekly Maximum | 60 hours | HR notification |
| Monthly Maximum | 40-60 hours | Director approval required |
| Consecutive Days | 6 days | Mandatory rest day |

### Expected Outcome
- Accurate overtime cost calculation
- Base hourly rate correctly computed
- Overtime multipliers applied properly
- Budget comparison and variance analysis
- Compliance checking with labor laws
- Trend analysis for cost forecasting
- Cost allocation to departments/projects

### Verification Checklist
- [ ] Base hourly rate calculation implemented
- [ ] Formula correct: Salary / (Days × Hours)
- [ ] Overtime multiplier logic working
- [ ] Cost calculation method functional
- [ ] Formula correct: Hours × Rate × Multiplier
- [ ] Batch calculation for periods working
- [ ] Compliance limits checked
- [ ] Violations flagged appropriately
- [ ] Cost center allocation implemented
- [ ] Budget comparison functional
- [ ] Variance calculation correct
- [ ] Trend analysis working
- [ ] Cost breakdown reporting complete
- [ ] Performance optimized with bulk queries

---

## Task 70: Create Staff Reports API Endpoint

### Overview
Create a unified REST API endpoint to access all staff/HR reports (attendance, leave, overtime). This endpoint provides a consistent interface for frontend applications to retrieve staff analytics with flexible filtering and formatting options.

### Dependencies
- All staff report classes (Tasks 63-69)
- Django REST Framework
- API authentication and permissions
- Report rendering utilities
- Export format handlers (PDF, Excel, CSV)

### Instructions

1. **Create staff reports views file**
   - Navigate to `apps/reports/api/` directory
   - Create file `staff_reports_views.py`
   - Import report classes and DRF components

2. **Define StaffReportsViewSet**
   - Create ViewSet class
   - Inherit from `viewsets.ViewSet`
   - Add class docstring explaining endpoint purpose
   - Set basename to 'staff-reports'

3. **Configure authentication**
   - Require user authentication
   - Set `permission_classes` to `[IsAuthenticated]`
   - Add tenant-aware permissions if multi-tenant
   - Ensure users can only access their tenant's data

4. **Implement attendance report action**
   - Create `@action(detail=False)` method `attendance_report`
   - Parse query parameters for filters
   - Instantiate AttendanceReport
   - Apply filters (employee, department, date range)
   - Generate report data
   - Return serialized response

5. **Implement leave report action**
   - Create `@action(detail=False)` method `leave_report`
   - Parse leave type, status filters
   - Instantiate LeaveReport
   - Apply all relevant filters
   - Generate report with utilization analysis
   - Return formatted response

6. **Implement overtime report action**
   - Create `@action(detail=False)` method `overtime_report`
   - Parse overtime type and date filters
   - Instantiate OvertimeReport
   - Generate cost calculations
   - Return response with cost breakdown

7. **Add combined staff summary action**
   - Create `@action(detail=False)` method `staff_summary`
   - Generate all three reports
   - Combine key metrics into single response
   - Include: attendance rate, leave balance, overtime hours
   - Return comprehensive summary

8. **Implement export functionality**
   - Add `export_format` query parameter support
   - Options: 'json', 'pdf', 'excel', 'csv'
   - Create method to handle export format
   - Use appropriate renderer for each format
   - Return file download response

9. **Add pagination**
   - Implement pagination for large datasets
   - Use PageNumberPagination
   - Set default page size to 50
   - Allow page size override via query param
   - Include pagination metadata in response

10. **Implement filtering and sorting**
    - Use DjangoFilterBackend
    - Support sorting by multiple fields
    - Add search capability for employee names
    - Implement filter validation
    - Return clear error messages for invalid filters

11. **Add response caching**
    - Implement caching for expensive queries
    - Cache key: report type + filters
    - Set TTL based on report type (e.g., 1 hour)
    - Allow cache invalidation
    - Add cache status to response headers

12. **Create serializers**
    - Create `AttendanceReportSerializer`
    - Create `LeaveReportSerializer`
    - Create `OvertimeReportSerializer`
    - Include all relevant fields
    - Add computed fields (rates, percentages)
    - Format currency and date fields

13. **Add error handling**
    - Validate all input parameters
    - Handle missing required filters
    - Catch report generation exceptions
    - Return meaningful error messages
    - Log errors for debugging

14. **Register URLs**
    - Add ViewSet to router in `urls.py`
    - Configure URL patterns
    - Ensure proper namespacing
    - Test all endpoints

### API Endpoint Structure

```
POST /api/reports/staff/attendance_report/
Query Parameters:
├── employee_id (optional): Filter by employee
├── department_id (optional): Filter by department
├── start_date (required): Start of period (YYYY-MM-DD)
├── end_date (required): End of period (YYYY-MM-DD)
├── status (optional): Filter by attendance status
├── export_format (optional): json/pdf/excel/csv
└── page (optional): Page number for pagination

POST /api/reports/staff/leave_report/
Query Parameters:
├── employee_id (optional): Filter by employee
├── department_id (optional): Filter by department
├── leave_type (optional): Filter by leave type
├── status (optional): Pending/Approved/Rejected
├── start_date (required): Start of period
├── end_date (required): End of period
├── export_format (optional): json/pdf/excel/csv
└── page (optional): Page number

POST /api/reports/staff/overtime_report/
Query Parameters:
├── employee_id (optional): Filter by employee
├── department_id (optional): Filter by department
├── overtime_type (optional): Weekday/Weekend/Holiday
├── start_date (required): Start of period
├── end_date (required): End of period
├── export_format (optional): json/pdf/excel/csv
└── page (optional): Page number

GET /api/reports/staff/staff_summary/
Query Parameters:
├── employee_id (optional): Filter by employee
├── department_id (optional): Filter by department
└── period (required): Month (YYYY-MM) or Year (YYYY)
```

### Response Format Examples

**Attendance Report Response:**
```json
{
    "report_type": "attendance",
    "period": {
        "start_date": "2026-01-01",
        "end_date": "2026-01-31"
    },
    "summary": {
        "total_employees": 125,
        "total_working_days": 22,
        "average_attendance_rate": 93.8,
        "total_present_days": 2580,
        "total_absent_days": 170,
        "late_arrivals": 48
    },
    "data": [
        {
            "employee_id": "EMP001",
            "employee_name": "John Silva",
            "department": "Sales",
            "present_days": 20,
            "absent_days": 2,
            "late_arrivals": 1,
            "attendance_rate": 90.9,
            "punctuality_rate": 95.0
        }
    ],
    "pagination": {
        "page": 1,
        "page_size": 50,
        "total_records": 125,
        "total_pages": 3
    }
}
```

**Leave Report Response:**
```json
{
    "report_type": "leave",
    "period": {
        "start_date": "2026-01-01",
        "end_date": "2026-12-31"
    },
    "summary": {
        "total_leave_days": 1840,
        "total_employees": 125,
        "average_per_employee": 14.7,
        "pending_requests": 15,
        "rejection_rate": 2.3
    },
    "leave_type_breakdown": [
        {
            "leave_type": "Annual Leave",
            "entitled": 2500,
            "taken": 1230,
            "balance": 1270,
            "utilization_rate": 49.2
        }
    ],
    "data": [
        {
            "employee_id": "EMP015",
            "employee_name": "Priya Perera",
            "leave_type": "Maternity",
            "entitled": 90,
            "taken": 90,
            "balance": 0,
            "utilization_rate": 100.0
        }
    ]
}
```

**Overtime Report Response:**
```json
{
    "report_type": "overtime",
    "period": {
        "start_date": "2026-01-01",
        "end_date": "2026-01-31"
    },
    "summary": {
        "total_hours": 487.5,
        "total_cost": 1245680.00,
        "average_cost_per_hour": 2555.00,
        "employees_with_overtime": 42,
        "average_hours_per_employee": 11.6
    },
    "overtime_type_breakdown": [
        {
            "overtime_type": "Weekday",
            "multiplier": 1.5,
            "hours": 325.0,
            "cost": 715420.00,
            "percentage": 57.4
        }
    ],
    "data": [
        {
            "employee_id": "EMP023",
            "employee_name": "Kasun Jayasinghe",
            "department": "Manufacturing",
            "total_hours": 48.5,
            "total_cost": 156890.00,
            "average_per_week": 12.1
        }
    ]
}
```

### Expected Outcome
- Fully functional REST API for staff reports
- Consistent response format across all reports
- Flexible filtering and sorting
- Multiple export format support
- Proper authentication and permissions
- Efficient performance with caching
- Clear error handling and validation

### Verification Checklist
- [ ] `staff_reports_views.py` file created
- [ ] `StaffReportsViewSet` class defined
- [ ] Authentication configured
- [ ] Attendance report action implemented
- [ ] Leave report action implemented
- [ ] Overtime report action implemented
- [ ] Staff summary action created
- [ ] Export functionality working (PDF, Excel, CSV)
- [ ] Pagination implemented
- [ ] Filtering and sorting functional
- [ ] Response caching configured
- [ ] Serializers created for all reports
- [ ] Error handling comprehensive
- [ ] URLs registered correctly
- [ ] All endpoints tested
- [ ] API documentation updated

---

## Summary

This document established comprehensive staff/HR reporting functionality:

### Completed Features

#### AttendanceReport (Tasks 63-65)
- ✅ Core AttendanceReport class with BaseReportGenerator inheritance
- ✅ Attendance rate calculation: (Present / Working Days) × 100
- ✅ Punctuality statistics: late arrivals, early departures
- ✅ Pattern analysis by day of week
- ✅ Severity classification for delays
- ✅ Department and company-wide comparisons

#### LeaveReport (Tasks 66-67)
- ✅ Core LeaveReport class with multi-type support
- ✅ Leave utilization calculation: (Taken / Entitled) × 100
- ✅ Balance tracking per leave type
- ✅ Pattern detection for suspicious leave patterns
- ✅ Seasonal analysis and predictions
- ✅ Department-level aggregation

#### OvertimeReport (Tasks 68-69)
- ✅ Core OvertimeReport class with cost tracking
- ✅ Base hourly rate calculation: Salary / (Days × Hours)
- ✅ Overtime cost: Hours × Rate × Multiplier
- ✅ Multiple overtime types with different multipliers
- ✅ Budget comparison and variance analysis
- ✅ Compliance checking with labor laws
- ✅ Trend analysis for forecasting

#### API Integration (Task 70)
- ✅ RESTful API endpoints for all reports
- ✅ Flexible filtering and sorting
- ✅ Multiple export formats (JSON, PDF, Excel, CSV)
- ✅ Response caching for performance
- ✅ Pagination for large datasets
- ✅ Comprehensive error handling

### Key Achievements

1. **Comprehensive HR Analytics** - Full coverage of attendance, leave, and overtime
2. **Accurate Calculations** - Proper formulas for rates, utilization, and costs
3. **Pattern Detection** - Identifies suspicious patterns and trends
4. **Compliance Monitoring** - Checks against labor law limits
5. **Cost Management** - Detailed overtime cost tracking and budgeting
6. **API Integration** - Complete REST API with flexible options
7. **Multiple Export Formats** - PDF, Excel, CSV support

### Calculation Formulas Summary

| Metric | Formula | Example |
|--------|---------|---------|
| Attendance Rate | (Present Days / Working Days) × 100 | (20/22) × 100 = 90.9% |
| Punctuality Rate | ((Working Days - Late) / Working Days) × 100 | ((22-4)/22) × 100 = 81.8% |
| Leave Utilization | (Taken / Entitled) × 100 | (45/90) × 100 = 50% |
| Base Hourly Rate | Salary / (Working Days × Hours/Day) | 75,000 / (22 × 8) = Rs. 426.14 |
| Overtime Cost | Hours × Hourly Rate × Multiplier | 24 × 426.14 × 1.5 = Rs. 15,341 |

### Integration Points

These staff reports integrate with:
- **BaseReportGenerator** - Common report functionality
- **Employee Module** - Employee master data
- **Attendance System** - Daily attendance tracking
- **Leave Management** - Leave requests and balances
- **Payroll Module** - Salary and overtime processing
- **Dashboard KPIs** - Real-time HR metrics display

### Next Steps

1. **Test all report classes** with sample data
2. **Validate calculations** against expected results
3. **Test API endpoints** with various filters
4. **Verify export formats** generate correctly
5. **Performance test** with large datasets
6. **Review with HR team** for business logic validation
7. **Configure caching** for optimal performance
8. **Set up scheduled generation** for regular reports

---

## Notes for AI Agents

### Implementation Priorities

1. **Start with base calculations**
   - Implement attendance rate first
   - Then add punctuality metrics
   - Follow with leave and overtime

2. **Test incrementally**
   - Test each calculation method independently
   - Verify formulas with known data
   - Check edge cases (zero working days, negative balances)

3. **Optimize queries**
   - Use select_related for employee data
   - Use prefetch_related for multiple relationships
   - Aggregate at database level when possible
   - Cache expensive calculations

4. **Handle edge cases**
   - Zero working days in period
   - Negative leave balances
   - Overtime exceeding legal limits
   - Missing salary information
   - Pro-rated entitlements for new joiners

### Common Patterns

**Report Generation Flow:**
```
1. Validate filters
2. Build queryset with filters
3. Calculate aggregations
4. Group data as requested
5. Apply calculations to grouped data
6. Format for output
7. Apply export format
8. Return response
```

**Cost Calculation Pattern:**
```
1. Get employee salary
2. Calculate base hourly rate
3. Determine overtime multiplier
4. Calculate cost per record
5. Aggregate totals
6. Add allowances
7. Return formatted cost
```

### Testing Considerations

- Test with various date ranges (daily, weekly, monthly, yearly)
- Test with single and multiple employees
- Test with different departments
- Test edge cases (no data, partial data)
- Test export formats generate correctly
- Test API pagination with large datasets
- Verify calculations match manual calculations
- Test caching behavior
- Test permission enforcement

### Performance Tips

- Use database aggregations instead of Python loops
- Cache report results for identical filter combinations
- Implement lazy loading for expensive calculations
- Use database indexes on frequently filtered fields
- Batch process multiple employees together
- Consider asynchronous generation for large reports

---

**Document Status:** ✅ Complete  
**Total Tasks:** 8  
**Total Lines:** 971
