# Tasks 67-74: Leave Reports and Export Service

> **Phase:** 06 - ERP Advanced Modules  
> **SubPhase:** 04 - Leave Management  
> **Group:** E - Reports & Integration  
> **Document:** 01 of 02  
> **Tasks Covered:** 67, 68, 69, 70, 71, 72, 73, 74

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **→ Next Document:** [02_Tasks-75-80_Integration-Notifications-Dashboard.md](02_Tasks-75-80_Integration-Notifications-Dashboard.md)

---

## Document Overview

This document covers the implementation of comprehensive leave reporting services and export functionality. These services provide managers and HR personnel with detailed insights into leave balances, usage patterns, departmental trends, and pending approvals. The export service enables reports to be generated in Excel and PDF formats for analysis and record-keeping.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 67 | Create LeaveReportService | High | 35 min |
| 68 | Implement Balance Summary Report | Medium | 25 min |
| 69 | Implement Leave History Report | Medium | 25 min |
| 70 | Implement Department Leave Report | Medium | 25 min |
| 71 | Implement Leave Type Usage Report | Medium | 25 min |
| 72 | Implement Pending Approvals Report | Medium | 20 min |
| 73 | Implement Expiring Leave Report | Medium | 25 min |
| 74 | Create Report Export Service | High | 35 min |

---

## Task 67: Create LeaveReportService

### Overview
Create a comprehensive service class for generating various leave-related reports. This service acts as the central hub for all leave reporting functionality, providing methods for balance summaries, usage analysis, departmental reports, and approval tracking.

### Dependencies
- LeaveRequest model exists
- LeaveBalance model exists
- LeaveType model exists
- Employee model exists
- Department model exists
- Django aggregation framework
- Python datetime utilities

### Instructions

1. **Create services directory structure**
   - Navigate to `apps/leave/` directory
   - Create `services/` subdirectory if not exists
   - Create `__init__.py` in services directory

2. **Create report_service.py file**
   - Create file at `apps/leave/services/report_service.py`
   - Add module docstring explaining report service purpose
   - Import necessary Django components

3. **Import required modules**
   - Import Django DB functions (Count, Sum, Avg, Q, F)
   - Import date utilities (datetime, timedelta, timezone)
   - Import Decimal for calculations
   - Import all relevant models
   - Import typing for type hints

4. **Define LeaveReportService class**
   - Create service class with descriptive docstring
   - Use tenant-aware approach for all methods
   - Add type hints for all method parameters and returns

5. **Add initialization method**
   - Accept optional tenant parameter
   - Store tenant for tenant-aware queries
   - Add logger for debugging

6. **Create base query methods**
   - Implement _get_employee_queryset() helper
   - Implement _get_leave_request_queryset() helper
   - Implement _get_leave_balance_queryset() helper
   - Apply tenant filtering automatically

7. **Add date range utility methods**
   - Implement _validate_date_range() method
   - Implement _get_year_date_range() method
   - Implement _get_current_period() method
   - Handle timezone conversions properly

8. **Add aggregation helper methods**
   - Implement _aggregate_by_leave_type() method
   - Implement _aggregate_by_department() method
   - Implement _aggregate_by_status() method
   - Return structured dictionaries

9. **Add filtering helper methods**
   - Implement _filter_by_employee() method
   - Implement _filter_by_department() method
   - Implement _filter_by_date_range() method
   - Implement _filter_by_leave_type() method

10. **Update services __init__.py**
    - Import LeaveReportService
    - Add to __all__ list for easy importing

### LeaveReportService Structure

```
┌──────────────────────────────────────────────────┐
│          LeaveReportService Class                │
├──────────────────────────────────────────────────┤
│ Core Methods:                                    │
│  • balance_summary()                             │
│  • leave_history()                               │
│  • department_report()                           │
│  • leave_type_usage()                            │
│  • pending_approvals()                           │
│  • expiring_leaves()                             │
│                                                  │
│ Helper Methods:                                  │
│  • _get_employee_queryset()                      │
│  • _get_leave_request_queryset()                 │
│  • _get_leave_balance_queryset()                 │
│  • _validate_date_range()                        │
│  • _aggregate_by_leave_type()                    │
│  • _filter_by_department()                       │
└──────────────────────────────────────────────────┘
```

### Service Architecture

```
┌─────────────────────────────────────────────────────┐
│                LeaveReportService                   │
└─────────────────────────────────────────────────────┘
                      │
        ┌─────────────┼─────────────┬─────────────┐
        ▼             ▼             ▼             ▼
┌──────────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐
│LeaveBalance  │ │  Leave   │ │ Employee │ │Department│
│    Model     │ │ Request  │ │  Model   │ │  Model   │
└──────────────┘ └──────────┘ └──────────┘ └──────────┘
```

### Base Query Methods Pattern

```
_get_employee_queryset():
│
├─> Apply tenant filter
├─> Select related fields (department, user)
├─> Apply active status filter
└─> Return optimized queryset

_get_leave_request_queryset():
│
├─> Apply tenant filter
├─> Select related fields (employee, leave_type, approver)
├─> Prefetch related balances
└─> Return optimized queryset

_get_leave_balance_queryset():
│
├─> Apply tenant filter
├─> Select related fields (employee, leave_type)
├─> Apply active status filter
└─> Return optimized queryset
```

### Date Range Validation

```
_validate_date_range(start_date, end_date):
│
├─> Check if start_date is before end_date
├─> Ensure dates are not in future (if applicable)
├─> Convert to timezone-aware if needed
├─> Raise ValidationError if invalid
└─> Return validated dates
```

### Helper Method Examples

#### Filter by Department
```
Input: department_id = "DEPT-001"
Process:
  1. Get department instance
  2. Get all employees in department
  3. Filter queryset by employee list
  4. Return filtered queryset

Output: Queryset filtered to specific department
```

#### Aggregate by Leave Type
```
Input: Leave request queryset
Process:
  1. Group by leave_type
  2. Count requests per type
  3. Sum total days per type
  4. Calculate average days per type
  5. Format as dictionary

Output: {
  "Annual Leave": {
    "count": 15,
    "total_days": 45,
    "average_days": 3.0
  },
  ...
}
```

### Service Usage Pattern

```
# Initialize service
service = LeaveReportService(tenant=current_tenant)

# Generate balance summary
balance_report = service.balance_summary(
    year=2026,
    department_id="DEPT-001"
)

# Generate leave history
history_report = service.leave_history(
    employee_id="EMP-0001",
    start_date=date(2026, 1, 1),
    end_date=date(2026, 12, 31)
)

# Generate department report
dept_report = service.department_report(
    department_id="DEPT-001",
    start_date=date(2026, 1, 1),
    end_date=date(2026, 1, 31)
)
```

### Expected Outcome
- Centralized reporting service
- Tenant-aware report generation
- Optimized database queries
- Reusable helper methods
- Foundation for all reports

### Verification Checklist
- [ ] services/ directory created
- [ ] report_service.py file created
- [ ] LeaveReportService class defined
- [ ] Initialization method implemented
- [ ] Base query methods created
- [ ] Date range utilities added
- [ ] Aggregation helpers implemented
- [ ] Filtering helpers implemented
- [ ] Service imported in __init__.py
- [ ] Type hints added for all methods

---

## Task 68: Implement Balance Summary Report

### Overview
Implement the balance summary report method that provides a comprehensive overview of leave balances for all employees or a specific department. This report shows allocated, used, pending, and available leave days for each leave type, helping HR and managers track leave entitlements across the organization.

### Dependencies
- Task 67: Create LeaveReportService

### Instructions

1. **Open report_service.py file**
   - Navigate to `apps/leave/services/report_service.py`
   - Locate LeaveReportService class

2. **Define balance_summary method signature**
   - Method name: balance_summary()
   - Accept year parameter (integer)
   - Accept optional department_id parameter
   - Accept optional employee_id parameter for individual report
   - Return dictionary with report data

3. **Add method docstring**
   - Describe method purpose
   - Document all parameters
   - Document return structure
   - Include usage example

4. **Implement year validation**
   - Validate year is reasonable (2000-2100)
   - Default to current year if not provided
   - Raise ValidationError for invalid years

5. **Get base employee queryset**
   - Use _get_employee_queryset() helper
   - Apply department filter if department_id provided
   - Apply employee filter if employee_id provided
   - Order by department, then employee name

6. **Get leave balances for period**
   - Query LeaveBalance model for specified year
   - Filter by employee queryset
   - Select related leave type and employee
   - Prefetch related leave requests

7. **Calculate balance metrics for each employee**
   - Iterate through employees
   - Get all leave types for employee
   - For each leave type calculate:
     - Allocated days (from balance)
     - Used days (approved requests)
     - Pending days (pending requests)
     - Available days (allocated - used - pending)

8. **Format employee balance data**
   - Create employee dictionary with basic info
   - Add list of leave type balances
   - Include employee metadata (department, position)
   - Format dates and decimals appropriately

9. **Calculate aggregate statistics**
   - Total employees included in report
   - Total leave days allocated across all types
   - Total leave days used
   - Total leave days pending
   - Average utilization percentage

10. **Build final report structure**
    - Add report metadata (year, generation timestamp)
    - Add filters applied (department, employee)
    - Add employee list with balances
    - Add aggregate statistics
    - Return complete report dictionary

### Balance Summary Report Structure

```
┌─────────────────────────────────────────────────────┐
│            Balance Summary Report                   │
├─────────────────────────────────────────────────────┤
│ Report Metadata:                                    │
│  • year: 2026                                       │
│  • generated_at: "2026-01-24T10:00:00Z"            │
│  • filters: {department_id, employee_id}            │
│                                                     │
│ Employee Balances:                                  │
│  • employee_id, name, department                    │
│  • Leave type balances array:                       │
│    - leave_type name                                │
│    - allocated days                                 │
│    - used days                                      │
│    - pending days                                   │
│    - available days                                 │
│    - utilization percentage                         │
│                                                     │
│ Aggregate Statistics:                               │
│  • total_employees                                  │
│  • total_allocated_days                             │
│  • total_used_days                                  │
│  • total_pending_days                               │
│  • average_utilization                              │
└─────────────────────────────────────────────────────┘
```

### Report Data Flow

```
Input Parameters
    │
    ├─> Validate year
    ├─> Apply department filter
    └─> Apply employee filter
    │
    ▼
Get Employee Queryset
    │
    └─> Active employees only
    │
    ▼
Get Leave Balances (for year)
    │
    ├─> Join with LeaveType
    ├─> Join with Employee
    └─> Prefetch LeaveRequests
    │
    ▼
Calculate Metrics (per employee, per leave type)
    │
    ├─> Allocated = balance.allocated_days
    ├─> Used = sum(approved requests)
    ├─> Pending = sum(pending requests)
    └─> Available = allocated - used - pending
    │
    ▼
Format Employee Data
    │
    ├─> Employee info
    ├─> Department info
    └─> Balance array
    │
    ▼
Calculate Aggregate Statistics
    │
    ├─> Sum all allocated
    ├─> Sum all used
    ├─> Sum all pending
    └─> Calculate averages
    │
    ▼
Build Final Report
```

### Sample Report Output

```json
{
  "report_type": "balance_summary",
  "year": 2026,
  "generated_at": "2026-01-24T10:00:00Z",
  "filters": {
    "department_id": "DEPT-001",
    "department_name": "IT"
  },
  "employees": [
    {
      "employee_id": "EMP-0001",
      "employee_code": "E001",
      "name": "Nimal Perera",
      "department": "IT",
      "position": "Senior Developer",
      "balances": [
        {
          "leave_type_id": "LT-001",
          "leave_type_name": "Annual Leave",
          "allocated": 14,
          "used": 5,
          "pending": 2,
          "available": 7,
          "utilization_percentage": 35.71
        },
        {
          "leave_type_id": "LT-002",
          "leave_type_name": "Casual Leave",
          "allocated": 7,
          "used": 2,
          "pending": 0,
          "available": 5,
          "utilization_percentage": 28.57
        },
        {
          "leave_type_id": "LT-003",
          "leave_type_name": "Sick Leave",
          "allocated": 7,
          "used": 1,
          "pending": 0,
          "available": 6,
          "utilization_percentage": 14.29
        }
      ],
      "total_allocated": 28,
      "total_used": 8,
      "total_pending": 2,
      "total_available": 18,
      "overall_utilization": 28.57
    },
    {
      "employee_id": "EMP-0002",
      "employee_code": "E002",
      "name": "Kumari Silva",
      "department": "IT",
      "position": "QA Engineer",
      "balances": [
        {
          "leave_type_id": "LT-001",
          "leave_type_name": "Annual Leave",
          "allocated": 14,
          "used": 7,
          "pending": 0,
          "available": 7,
          "utilization_percentage": 50.00
        },
        {
          "leave_type_id": "LT-002",
          "leave_type_name": "Casual Leave",
          "allocated": 7,
          "used": 3,
          "pending": 1,
          "available": 3,
          "utilization_percentage": 42.86
        },
        {
          "leave_type_id": "LT-003",
          "leave_type_name": "Sick Leave",
          "allocated": 7,
          "used": 0,
          "pending": 0,
          "available": 7,
          "utilization_percentage": 0.00
        }
      ],
      "total_allocated": 28,
      "total_used": 10,
      "total_pending": 1,
      "total_available": 17,
      "overall_utilization": 35.71
    }
  ],
  "aggregate_statistics": {
    "total_employees": 2,
    "total_allocated_days": 56,
    "total_used_days": 18,
    "total_pending_days": 3,
    "total_available_days": 35,
    "average_utilization_percentage": 32.14,
    "by_leave_type": {
      "Annual Leave": {
        "total_allocated": 28,
        "total_used": 12,
        "average_utilization": 42.86
      },
      "Casual Leave": {
        "total_allocated": 14,
        "total_used": 5,
        "average_utilization": 35.71
      },
      "Sick Leave": {
        "total_allocated": 14,
        "total_used": 1,
        "average_utilization": 7.14
      }
    }
  }
}
```

### Utilization Calculation

```
Utilization Percentage = (Used Days / Allocated Days) × 100

Example:
  Allocated: 14 days
  Used: 5 days
  Utilization: (5 / 14) × 100 = 35.71%
```

### Report Use Cases

| Use Case | Filter | Purpose |
|----------|--------|---------|
| Company-wide summary | No filters | Overall leave usage |
| Department summary | department_id | Track department trends |
| Individual employee | employee_id | Employee leave status |
| Year comparison | Different years | Track year-over-year |

### Sri Lanka Context

#### Typical Balance Summary for Sri Lankan Company
```
Employee: Nimal Perera (IT Department)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Annual Leave:      14 allocated | 5 used | 9 available
Casual Leave:       7 allocated | 2 used | 5 available
Sick Leave:         7 allocated | 1 used | 6 available
Medical Leave:      7 allocated | 0 used | 7 available
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Total:             35 allocated | 8 used | 27 available
Utilization:       22.86%
```

#### Poya Day Considerations
- Poya days are public holidays
- If leave request spans Poya day, exclude from count
- Balance summary should show working days only
- Note: Separate tracking for holiday adjustments

### Expected Outcome
- Comprehensive balance overview
- Individual and aggregate metrics
- Department-level filtering
- Utilization tracking
- Year-based reporting

### Verification Checklist
- [ ] balance_summary() method defined
- [ ] Year validation implemented
- [ ] Department filtering works
- [ ] Employee filtering works
- [ ] Balance calculations correct
- [ ] Used days calculation accurate
- [ ] Pending days calculation accurate
- [ ] Available days calculation correct
- [ ] Utilization percentage calculated
- [ ] Aggregate statistics included
- [ ] Report metadata added
- [ ] Return structure matches specification

---

## Task 69: Implement Leave History Report

### Overview
Implement the leave history report method that provides a detailed chronological record of an employee's leave requests over a specified period. This report includes all leave requests (approved, rejected, pending, cancelled), showing leave types, dates, durations, approval status, and approver information.

### Dependencies
- Task 67: Create LeaveReportService

### Instructions

1. **Open report_service.py file**
   - Continue in `apps/leave/services/report_service.py`
   - Locate LeaveReportService class

2. **Define leave_history method signature**
   - Method name: leave_history()
   - Accept employee_id parameter (required)
   - Accept start_date parameter
   - Accept end_date parameter
   - Accept optional status_filter (list of statuses)
   - Accept optional leave_type_filter
   - Return dictionary with report data

3. **Add method docstring**
   - Describe method purpose
   - Document all parameters and defaults
   - Document return structure
   - Include usage examples

4. **Validate date range**
   - Use _validate_date_range() helper
   - Default to current year if not provided
   - Ensure end_date is not before start_date

5. **Get employee instance**
   - Fetch employee by employee_id
   - Verify employee exists
   - Raise ValidationError if not found
   - Get employee details for report

6. **Build leave request queryset**
   - Get all leave requests for employee
   - Filter by date range (start_date overlaps range)
   - Apply status filter if provided
   - Apply leave type filter if provided
   - Order by start_date descending (most recent first)

7. **Select and prefetch related data**
   - Select related leave_type
   - Select related approver (user)
   - Select related employee details
   - Optimize query for performance

8. **Format leave request data**
   - Iterate through leave requests
   - Extract request details (ID, dates, days, reason)
   - Include leave type information
   - Include approval information (approver, date, comments)
   - Include status and status changes
   - Format dates consistently

9. **Calculate summary statistics**
   - Total requests in period
   - Total days requested
   - Total days approved
   - Breakdown by leave type
   - Breakdown by status
   - Average request duration

10. **Build final report structure**
    - Add report metadata (employee, date range)
    - Add employee information section
    - Add requests array (chronological)
    - Add summary statistics
    - Return complete report dictionary

### Leave History Report Structure

```
┌─────────────────────────────────────────────────────┐
│            Leave History Report                     │
├─────────────────────────────────────────────────────┤
│ Report Metadata:                                    │
│  • employee_id, name, department                    │
│  • date_range: "2026-01-01 to 2026-12-31"          │
│  • generated_at: timestamp                          │
│  • filters: {status, leave_type}                    │
│                                                     │
│ Leave Requests (Chronological):                     │
│  • request_id, request_number                       │
│  • leave_type_name                                  │
│  • start_date, end_date, total_days                 │
│  • status, status_display                           │
│  • applied_date                                     │
│  • approval_info:                                   │
│    - approver_name                                  │
│    - approval_date                                  │
│    - approval_comments                              │
│  • reason                                           │
│  • half_day_start, half_day_end                     │
│                                                     │
│ Summary Statistics:                                 │
│  • total_requests                                   │
│  • total_days_requested                             │
│  • total_days_approved                              │
│  • by_leave_type                                    │
│  • by_status                                        │
│  • average_request_duration                         │
└─────────────────────────────────────────────────────┘
```

### Report Data Flow

```
Input Parameters
    │
    ├─> Validate employee_id
    ├─> Validate date range
    ├─> Apply status filter
    └─> Apply leave type filter
    │
    ▼
Get Employee Instance
    │
    └─> Verify employee exists
    │
    ▼
Build Leave Request Queryset
    │
    ├─> Filter by employee
    ├─> Filter by date range
    ├─> Apply optional filters
    └─> Order by start_date DESC
    │
    ▼
Optimize Query
    │
    ├─> Select related leave_type
    ├─> Select related approver
    └─> Prefetch status changes
    │
    ▼
Format Request Data
    │
    ├─> Extract request details
    ├─> Format dates
    ├─> Include approval info
    └─> Build request dictionary
    │
    ▼
Calculate Summary Statistics
    │
    ├─> Count total requests
    ├─> Sum total days
    ├─> Group by leave type
    ├─> Group by status
    └─> Calculate averages
    │
    ▼
Build Final Report
```

### Sample Report Output

```json
{
  "report_type": "leave_history",
  "employee": {
    "employee_id": "EMP-0001",
    "employee_code": "E001",
    "name": "Nimal Perera",
    "department": "IT",
    "position": "Senior Developer",
    "join_date": "2020-01-15"
  },
  "date_range": {
    "start_date": "2026-01-01",
    "end_date": "2026-12-31",
    "display": "January 1, 2026 to December 31, 2026"
  },
  "generated_at": "2026-01-24T10:30:00Z",
  "filters": {
    "status": ["APPROVED", "PENDING"],
    "leave_type": null
  },
  "requests": [
    {
      "request_id": "LR-145",
      "request_number": "LR-2026-0145",
      "leave_type": {
        "id": "LT-001",
        "name": "Annual Leave",
        "code": "AL"
      },
      "dates": {
        "start_date": "2026-03-15",
        "end_date": "2026-03-17",
        "total_days": 3,
        "working_days": 3,
        "half_day_start": false,
        "half_day_end": false
      },
      "status": {
        "code": "APPROVED",
        "display": "Approved",
        "date": "2026-03-10T14:20:00Z"
      },
      "approval": {
        "approver_name": "Saman Fernando",
        "approver_position": "IT Manager",
        "approval_date": "2026-03-10T14:20:00Z",
        "comments": "Approved for personal travel"
      },
      "application": {
        "applied_date": "2026-03-08T09:15:00Z",
        "reason": "Personal travel to Kandy"
      }
    },
    {
      "request_id": "LR-089",
      "request_number": "LR-2026-0089",
      "leave_type": {
        "id": "LT-003",
        "name": "Sick Leave",
        "code": "SL"
      },
      "dates": {
        "start_date": "2026-02-10",
        "end_date": "2026-02-10",
        "total_days": 1,
        "working_days": 1,
        "half_day_start": false,
        "half_day_end": false
      },
      "status": {
        "code": "APPROVED",
        "display": "Approved",
        "date": "2026-02-11T10:00:00Z"
      },
      "approval": {
        "approver_name": "Saman Fernando",
        "approver_position": "IT Manager",
        "approval_date": "2026-02-11T10:00:00Z",
        "comments": "Medical certificate received"
      },
      "application": {
        "applied_date": "2026-02-11T09:30:00Z",
        "reason": "Fever and flu"
      }
    },
    {
      "request_id": "LR-045",
      "request_number": "LR-2026-0045",
      "leave_type": {
        "id": "LT-002",
        "name": "Casual Leave",
        "code": "CL"
      },
      "dates": {
        "start_date": "2026-01-22",
        "end_date": "2026-01-23",
        "total_days": 2,
        "working_days": 2,
        "half_day_start": false,
        "half_day_end": true
      },
      "status": {
        "code": "APPROVED",
        "display": "Approved",
        "date": "2026-01-20T16:45:00Z"
      },
      "approval": {
        "approver_name": "Saman Fernando",
        "approver_position": "IT Manager",
        "approval_date": "2026-01-20T16:45:00Z",
        "comments": null
      },
      "application": {
        "applied_date": "2026-01-18T11:00:00Z",
        "reason": "Family function"
      }
    }
  ],
  "summary": {
    "total_requests": 3,
    "total_days_requested": 6,
    "total_days_approved": 6,
    "by_leave_type": {
      "Annual Leave": {
        "requests": 1,
        "days": 3,
        "percentage": 50.00
      },
      "Casual Leave": {
        "requests": 1,
        "days": 2,
        "percentage": 33.33
      },
      "Sick Leave": {
        "requests": 1,
        "days": 1,
        "percentage": 16.67
      }
    },
    "by_status": {
      "APPROVED": {
        "requests": 3,
        "days": 6
      },
      "PENDING": {
        "requests": 0,
        "days": 0
      },
      "REJECTED": {
        "requests": 0,
        "days": 0
      }
    },
    "average_request_duration": 2.0
  }
}
```

### Status Filtering Options

| Filter Value | Description | Use Case |
|--------------|-------------|----------|
| `["APPROVED"]` | Approved only | Confirmed leave history |
| `["PENDING"]` | Pending only | Current pending requests |
| `["REJECTED"]` | Rejected only | Denied requests analysis |
| `["APPROVED", "PENDING"]` | Active requests | Exclude rejected/cancelled |
| `null` | All statuses | Complete history |

### Report Use Cases

| Use Case | Parameters | Purpose |
|----------|------------|---------|
| Annual review | Full year | Performance review |
| Recent history | Last 6 months | Quick overview |
| Approval audit | All approved | Verify approvals |
| Pending tracking | PENDING status | Follow up required |
| Leave type analysis | Specific type | Type-specific usage |

### Sri Lanka Context

#### Leave History for Sri Lankan Employee
```
Leave History Report
Employee: Nimal Perera (IT Department)
Period: January 1, 2026 - December 31, 2026
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

March 15-17, 2026 (Annual Leave - 3 days)
  Status: APPROVED by Saman Fernando
  Reason: Personal travel to Kandy
  Applied: March 8, 2026

February 10, 2026 (Sick Leave - 1 day)
  Status: APPROVED by Saman Fernando
  Reason: Fever and flu
  Medical certificate provided
  Applied: February 11, 2026

January 22-23, 2026 (Casual Leave - 2 days)
  Status: APPROVED by Saman Fernando
  Reason: Family function
  Half-day on end date
  Applied: January 18, 2026

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Summary:
  Total Requests: 3
  Total Days: 6
  Breakdown:
    • Annual Leave: 3 days (50%)
    • Casual Leave: 2 days (33%)
    • Sick Leave: 1 day (17%)
```

#### Poya Day Handling in History
- If leave spans Poya day, show total days vs working days
- Example: "March 15-18, 2026 (4 days, 3 working days)"
- Note Poya days excluded from leave deduction

### Expected Outcome
- Detailed chronological leave history
- Complete request information
- Approval tracking
- Status breakdown
- Usage analysis by type

### Verification Checklist
- [ ] leave_history() method defined
- [ ] Employee validation implemented
- [ ] Date range filtering works
- [ ] Status filtering works
- [ ] Leave type filtering works
- [ ] Request data formatted correctly
- [ ] Approval information included
- [ ] Summary statistics calculated
- [ ] Chronological ordering correct
- [ ] Half-day information included
- [ ] Return structure matches specification

---

## Task 70: Implement Department Leave Report

### Overview
Implement the department leave report method that provides an aggregated view of leave usage within a specific department over a specified period. This report helps managers understand departmental leave patterns, identify high-usage periods, track team availability, and plan resource allocation.

### Dependencies
- Task 67: Create LeaveReportService

### Instructions

1. **Open report_service.py file**
   - Continue in `apps/leave/services/report_service.py`
   - Locate LeaveReportService class

2. **Define department_report method signature**
   - Method name: department_report()
   - Accept department_id parameter (required)
   - Accept start_date parameter (required)
   - Accept end_date parameter (required)
   - Accept optional include_details flag (default True)
   - Return dictionary with report data

3. **Add method docstring**
   - Describe method purpose
   - Document all parameters
   - Document return structure
   - Include usage examples

4. **Validate inputs**
   - Validate date range using _validate_date_range()
   - Verify department exists
   - Raise ValidationError for invalid inputs

5. **Get department information**
   - Fetch department instance
   - Get department name and code
   - Get total employee count in department
   - Get active employee count

6. **Build employee queryset**
   - Get all active employees in department
   - Select related user information
   - Apply tenant filter
   - Order by employee name

7. **Build leave request queryset**
   - Get all leave requests for department employees
   - Filter by date range (requests overlapping period)
   - Filter approved requests only (for usage stats)
   - Select related leave type and employee
   - Order by start_date

8. **Calculate departmental metrics**
   - Total leave days taken in period
   - Average days per employee
   - Number of employees who took leave
   - Peak leave days (days with most people on leave)
   - Leave distribution by type

9. **Calculate daily availability**
   - For each day in range:
     - Count employees on leave
     - Calculate availability percentage
     - Identify peak leave days
   - Store as time series data

10. **Calculate leave type breakdown**
    - Aggregate by leave type
    - Count requests per type
    - Sum days per type
    - Calculate percentage of total

11. **Include individual employee details (if flag set)**
    - For each employee:
      - Total days taken
      - Number of requests
      - Leave types used
    - Sort by total days descending

12. **Build final report structure**
    - Add department metadata
    - Add date range information
    - Add aggregate statistics
    - Add leave type breakdown
    - Add daily availability data (optional)
    - Add employee details (if requested)
    - Return complete report dictionary

### Department Leave Report Structure

```
┌──────────────────────────────────────────────────────┐
│          Department Leave Report                     │
├──────────────────────────────────────────────────────┤
│ Report Metadata:                                     │
│  • department_id, name, code                         │
│  • date_range                                        │
│  • generated_at                                      │
│                                                      │
│ Department Summary:                                  │
│  • total_employees (in department)                   │
│  • active_employees                                  │
│  • employees_on_leave (in period)                    │
│                                                      │
│ Leave Statistics:                                    │
│  • total_leave_days                                  │
│  • average_per_employee                              │
│  • peak_leave_day (date with most absences)          │
│  • peak_leave_count                                  │
│                                                      │
│ By Leave Type:                                       │
│  • leave_type_name                                   │
│  • total_requests                                    │
│  • total_days                                        │
│  • percentage_of_total                               │
│                                                      │
│ Daily Availability (optional):                       │
│  • date                                              │
│  • employees_on_leave                                │
│  • available_employees                               │
│  • availability_percentage                           │
│                                                      │
│ Employee Details (optional):                         │
│  • employee_name                                     │
│  • total_days_taken                                  │
│  • requests_count                                    │
│  • leave_types_used                                  │
└──────────────────────────────────────────────────────┘
```

### Report Data Flow

```
Input Parameters
    │
    ├─> Validate department_id
    └─> Validate date range
    │
    ▼
Get Department Information
    │
    ├─> Department details
    └─> Employee count
    │
    ▼
Build Employee Queryset
    │
    └─> All department employees
    │
    ▼
Build Leave Request Queryset
    │
    ├─> Filter by department
    ├─> Filter by date range
    └─> Filter approved requests
    │
    ▼
Calculate Departmental Metrics
    │
    ├─> Total leave days
    ├─> Average per employee
    ├─> Employees on leave count
    └─> Peak leave days
    │
    ▼
Calculate Daily Availability
    │
    ├─> For each day in range:
    │   ├─> Count on leave
    │   ├─> Calculate available
    │   └─> Store metrics
    │
    ▼
Calculate Leave Type Breakdown
    │
    ├─> Group by leave type
    ├─> Sum days per type
    └─> Calculate percentages
    │
    ▼
Include Employee Details (if requested)
    │
    ├─> Aggregate per employee
    └─> Sort by usage
    │
    ▼
Build Final Report
```

### Sample Report Output

```json
{
  "report_type": "department_leave",
  "department": {
    "department_id": "DEPT-001",
    "department_code": "IT",
    "name": "Information Technology",
    "total_employees": 20,
    "active_employees": 18
  },
  "date_range": {
    "start_date": "2026-01-01",
    "end_date": "2026-01-31",
    "display": "January 2026",
    "total_days": 31,
    "working_days": 22
  },
  "generated_at": "2026-01-24T11:00:00Z",
  "summary": {
    "total_leave_days": 45,
    "average_per_employee": 2.5,
    "employees_on_leave_count": 12,
    "employees_on_leave_percentage": 66.67,
    "peak_leave_day": "2026-01-24",
    "peak_leave_count": 5
  },
  "on_leave_today": {
    "date": "2026-01-24",
    "count": 3,
    "employees": [
      "Nimal Perera",
      "Kumari Silva",
      "Ashan Fernando"
    ]
  },
  "by_leave_type": {
    "Annual Leave": {
      "requests": 8,
      "total_days": 25,
      "percentage": 55.56,
      "average_duration": 3.13
    },
    "Casual Leave": {
      "requests": 6,
      "total_days": 10,
      "percentage": 22.22,
      "average_duration": 1.67
    },
    "Sick Leave": {
      "requests": 5,
      "total_days": 8,
      "percentage": 17.78,
      "average_duration": 1.60
    },
    "Medical Leave": {
      "requests": 1,
      "total_days": 2,
      "percentage": 4.44,
      "average_duration": 2.00
    }
  },
  "daily_availability": [
    {
      "date": "2026-01-24",
      "day_of_week": "Friday",
      "is_working_day": true,
      "employees_on_leave": 3,
      "available_employees": 15,
      "availability_percentage": 83.33,
      "employees_on_leave_list": [
        "Nimal Perera (Annual Leave)",
        "Kumari Silva (Casual Leave)",
        "Ashan Fernando (Annual Leave)"
      ]
    },
    {
      "date": "2026-01-15",
      "day_of_week": "Wednesday",
      "is_working_day": true,
      "is_poya_day": true,
      "employees_on_leave": 0,
      "available_employees": 18,
      "availability_percentage": 100.00
    }
  ],
  "employee_details": [
    {
      "employee_id": "EMP-0001",
      "employee_code": "E001",
      "name": "Nimal Perera",
      "position": "Senior Developer",
      "total_days_taken": 5,
      "requests_count": 2,
      "leave_types_used": [
        {
          "leave_type": "Annual Leave",
          "days": 3,
          "requests": 1
        },
        {
          "leave_type": "Casual Leave",
          "days": 2,
          "requests": 1
        }
      ]
    },
    {
      "employee_id": "EMP-0002",
      "employee_code": "E002",
      "name": "Kumari Silva",
      "position": "QA Engineer",
      "total_days_taken": 4,
      "requests_count": 2,
      "leave_types_used": [
        {
          "leave_type": "Annual Leave",
          "days": 3,
          "requests": 1
        },
        {
          "leave_type": "Sick Leave",
          "days": 1,
          "requests": 1
        }
      ]
    }
  ]
}
```

### Peak Leave Analysis

```
Peak Leave Days Identification:
│
├─> Count employees on leave for each day
├─> Identify days with highest count
├─> Flag days with >50% of team absent
└─> Warn managers about coverage issues

Example Peak Day:
  Date: January 24, 2026 (Friday)
  On Leave: 5 employees (27.78%)
  Available: 13 employees (72.22%)
  Status: ADEQUATE COVERAGE
```

### Availability Thresholds

| Availability % | Status | Action Required |
|----------------|--------|-----------------|
| 90-100% | Optimal | None |
| 75-89% | Adequate | Monitor |
| 60-74% | Moderate | Plan coverage |
| Below 60% | Critical | Immediate action |

### Sri Lanka Context

#### Department Report for Sri Lankan IT Team
```
Department Leave Report
IT Department (20 employees)
Period: January 2026
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Summary:
  Total Leave Days: 45
  Average per Employee: 2.5 days
  Employees on Leave: 12 (60%)
  
Peak Leave Day:
  January 24, 2026 (Friday)
  5 employees on leave (25%)
  ⚠ Plan coverage for critical tasks

Leave Type Breakdown:
  • Annual Leave: 25 days (56%)
  • Casual Leave: 10 days (22%)
  • Sick Leave: 8 days (18%)
  • Medical Leave: 2 days (4%)

Poya Days in Period:
  • January 15, 2026 (Full Moon Poya)
  • No leave requests (Public Holiday)

Top Leave Takers:
  1. Nimal Perera: 5 days
  2. Kumari Silva: 4 days
  3. Ashan Fernando: 4 days
```

#### Festival Season Impact
```
December Department Report:
  • High leave usage expected
  • Vesak (May), Poson (June): Low leave
  • Sinhala & Tamil New Year (April): Peak leave
  • Christmas season: Moderate leave
```

### Report Use Cases

| Use Case | Period | Purpose |
|----------|--------|---------|
| Monthly review | Current month | Track monthly usage |
| Quarter planning | 3 months | Resource planning |
| Year-end analysis | Full year | Annual review |
| Peak season | Festival months | Plan coverage |

### Expected Outcome
- Comprehensive department overview
- Leave pattern analysis
- Daily availability tracking
- Resource planning insights
- Peak period identification

### Verification Checklist
- [ ] department_report() method defined
- [ ] Department validation implemented
- [ ] Date range filtering works
- [ ] Employee count calculated
- [ ] Total leave days calculated
- [ ] Average per employee calculated
- [ ] Peak leave day identified
- [ ] Leave type breakdown included
- [ ] Daily availability calculated
- [ ] Employee details included (if requested)
- [ ] Return structure matches specification

---

## Task 71: Implement Leave Type Usage Report

### Overview
Implement the leave type usage report method that analyzes how a specific leave type is being utilized across the organization or within a department over a specified period. This report helps HR understand demand patterns, adjust allocations, and identify trends in leave type preferences.

### Dependencies
- Task 67: Create LeaveReportService

### Instructions

1. **Open report_service.py file**
   - Continue in `apps/leave/services/report_service.py`
   - Locate LeaveReportService class

2. **Define leave_type_usage method signature**
   - Method name: leave_type_usage()
   - Accept leave_type_id parameter (required)
   - Accept start_date parameter (required)
   - Accept end_date parameter (required)
   - Accept optional department_id parameter
   - Return dictionary with report data

3. **Add method docstring**
   - Describe method purpose
   - Document all parameters
   - Document return structure
   - Include usage examples

4. **Validate inputs**
   - Validate date range
   - Verify leave type exists
   - Verify department exists (if provided)
   - Raise ValidationError for invalid inputs

5. **Get leave type information**
   - Fetch LeaveType instance
   - Get leave type name, code, and settings
   - Get allocation rules
   - Get max days allowed

6. **Build base queryset**
   - Get all leave requests for specified leave type
   - Filter by date range
   - Apply department filter if provided
   - Select related employee and approver

7. **Calculate usage statistics**
   - Total requests submitted
   - Total requests approved
   - Total requests rejected
   - Total requests pending
   - Total days requested
   - Total days approved

8. **Calculate approval metrics**
   - Approval rate (approved / total)
   - Rejection rate (rejected / total)
   - Average approval time
   - Approval rate by manager

9. **Analyze request patterns**
   - Average request duration
   - Most common duration (mode)
   - Distribution by duration (1 day, 2-3 days, 4+ days)
   - Peak usage months/weeks
   - Half-day vs full-day ratio

10. **Calculate employee coverage**
    - Total employees with this leave type
    - Employees who used this type (count and percentage)
    - Top users (employees with most usage)
    - Employees who haven't used (count)

11. **Analyze temporal trends**
    - Usage by month
    - Usage by day of week
    - Identify peak periods
    - Compare to previous period (if data available)

12. **Build final report structure**
    - Add leave type metadata
    - Add date range information
    - Add usage statistics
    - Add approval metrics
    - Add request patterns
    - Add employee coverage
    - Add temporal trends
    - Return complete report dictionary

### Leave Type Usage Report Structure

```
┌──────────────────────────────────────────────────────┐
│          Leave Type Usage Report                     │
├──────────────────────────────────────────────────────┤
│ Report Metadata:                                     │
│  • leave_type_id, name, code                         │
│  • date_range                                        │
│  • department filter (if applied)                    │
│  • generated_at                                      │
│                                                      │
│ Leave Type Details:                                  │
│  • max_days_per_request                              │
│  • requires_approval                                 │
│  • can_be_half_day                                   │
│                                                      │
│ Usage Statistics:                                    │
│  • total_requests                                    │
│  • total_days_requested                              │
│  • total_days_approved                               │
│  • average_request_duration                          │
│                                                      │
│ Approval Metrics:                                    │
│  • approval_rate                                     │
│  • rejection_rate                                    │
│  • average_approval_time                             │
│  • by_status breakdown                               │
│                                                      │
│ Request Patterns:                                    │
│  • duration_distribution                             │
│  • half_day_percentage                               │
│  • most_common_duration                              │
│  • peak_usage_periods                                │
│                                                      │
│ Employee Coverage:                                   │
│  • eligible_employees_count                          │
│  • employees_who_used_count                          │
│  • usage_coverage_percentage                         │
│  • top_users                                         │
│                                                      │
│ Temporal Trends:                                     │
│  • usage_by_month                                    │
│  • usage_by_day_of_week                              │
│  • peak_periods                                      │
└──────────────────────────────────────────────────────┘
```

### Report Data Flow

```
Input Parameters
    │
    ├─> Validate leave_type_id
    ├─> Validate date range
    └─> Validate department_id (optional)
    │
    ▼
Get Leave Type Information
    │
    ├─> Leave type details
    └─> Allocation rules
    │
    ▼
Build Leave Request Queryset
    │
    ├─> Filter by leave type
    ├─> Filter by date range
    └─> Filter by department (optional)
    │
    ▼
Calculate Usage Statistics
    │
    ├─> Count total requests
    ├─> Sum total days
    ├─> Group by status
    └─> Calculate averages
    │
    ▼
Calculate Approval Metrics
    │
    ├─> Calculate approval rate
    ├─> Calculate rejection rate
    └─> Measure approval time
    │
    ▼
Analyze Request Patterns
    │
    ├─> Duration distribution
    ├─> Half-day analysis
    └─> Identify peaks
    │
    ▼
Calculate Employee Coverage
    │
    ├─> Count eligible employees
    ├─> Count users
    └─> Identify top users
    │
    ▼
Analyze Temporal Trends
    │
    ├─> Usage by month
    ├─> Usage by day of week
    └─> Identify patterns
    │
    ▼
Build Final Report
```

### Sample Report Output

```json
{
  "report_type": "leave_type_usage",
  "leave_type": {
    "leave_type_id": "LT-001",
    "name": "Annual Leave",
    "code": "AL",
    "max_days_per_request": 14,
    "requires_approval": true,
    "can_be_half_day": true,
    "is_paid": true
  },
  "date_range": {
    "start_date": "2026-01-01",
    "end_date": "2026-12-31",
    "display": "Year 2026",
    "total_days": 365,
    "working_days": 252
  },
  "filters": {
    "department_id": null,
    "department_name": "All Departments"
  },
  "generated_at": "2026-01-24T11:30:00Z",
  "usage_statistics": {
    "total_requests": 145,
    "total_days_requested": 520,
    "total_days_approved": 485,
    "total_days_rejected": 20,
    "total_days_pending": 15,
    "average_request_duration": 3.59
  },
  "approval_metrics": {
    "approval_rate": 87.59,
    "rejection_rate": 8.28,
    "pending_rate": 4.13,
    "average_approval_time_hours": 18.5,
    "by_status": {
      "APPROVED": {
        "count": 127,
        "percentage": 87.59,
        "total_days": 485
      },
      "REJECTED": {
        "count": 12,
        "percentage": 8.28,
        "total_days": 20
      },
      "PENDING": {
        "count": 6,
        "percentage": 4.13,
        "total_days": 15
      }
    }
  },
  "request_patterns": {
    "duration_distribution": {
      "1_day": {
        "count": 35,
        "percentage": 24.14
      },
      "2_3_days": {
        "count": 58,
        "percentage": 40.00
      },
      "4_7_days": {
        "count": 42,
        "percentage": 28.97
      },
      "8_plus_days": {
        "count": 10,
        "percentage": 6.89
      }
    },
    "half_day_requests": {
      "count": 28,
      "percentage": 19.31
    },
    "most_common_duration": 3,
    "median_duration": 3,
    "peak_usage_months": [
      {
        "month": "December",
        "requests": 25,
        "days": 85
      },
      {
        "month": "April",
        "requests": 22,
        "days": 75
      },
      {
        "month": "August",
        "requests": 18,
        "days": 62
      }
    ]
  },
  "employee_coverage": {
    "eligible_employees": 150,
    "employees_who_used": 98,
    "usage_coverage_percentage": 65.33,
    "employees_who_didnt_use": 52,
    "top_users": [
      {
        "employee_id": "EMP-0045",
        "name": "Saman Kumara",
        "department": "Sales",
        "total_days": 12,
        "requests": 4
      },
      {
        "employee_id": "EMP-0023",
        "name": "Nimal Perera",
        "department": "IT",
        "total_days": 11,
        "requests": 3
      },
      {
        "employee_id": "EMP-0067",
        "name": "Kumari Silva",
        "department": "HR",
        "total_days": 10,
        "requests": 3
      }
    ]
  },
  "temporal_trends": {
    "usage_by_month": [
      {
        "month": "January",
        "month_number": 1,
        "requests": 10,
        "days": 32
      },
      {
        "month": "February",
        "month_number": 2,
        "requests": 8,
        "days": 28
      },
      {
        "month": "March",
        "month_number": 3,
        "requests": 12,
        "days": 38
      },
      {
        "month": "April",
        "month_number": 4,
        "requests": 22,
        "days": 75
      }
    ],
    "usage_by_day_of_week": {
      "Monday": {
        "start_count": 45,
        "end_count": 35
      },
      "Tuesday": {
        "start_count": 28,
        "end_count": 30
      },
      "Wednesday": {
        "start_count": 20,
        "end_count": 25
      },
      "Thursday": {
        "start_count": 18,
        "end_count": 22
      },
      "Friday": {
        "start_count": 34,
        "end_count": 33
      }
    }
  }
}
```

### Duration Distribution Analysis

```
Request Duration Patterns:
│
├─> 1 Day Requests (24.14%)
│   • Quick single-day absences
│   • Often for personal matters
│   • High approval rate
│
├─> 2-3 Day Requests (40.00%)
│   • Most common duration
│   • Long weekend extensions
│   • Moderate approval rate
│
├─> 4-7 Day Requests (28.97%)
│   • Week-long vacations
│   • Requires advance planning
│   • Standard approval rate
│
└─> 8+ Day Requests (6.89%)
    • Extended holidays
    • Requires significant notice
    • Careful approval review
```

### Peak Period Analysis

| Period | Requests | Reason (Sri Lanka Context) |
|--------|----------|----------------------------|
| April | High | Sinhala & Tamil New Year |
| May | Moderate | Vesak holidays |
| July-August | Moderate | School holidays |
| December | High | Christmas & year-end |

### Sri Lanka Context

#### Annual Leave Usage Pattern
```
Annual Leave Usage Report
Year: 2026 (All Departments)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Total Requests: 145
Total Days Used: 485
Approval Rate: 87.59%
Average Duration: 3.6 days

Peak Usage Months:
  1. December (25 requests, 85 days)
     - Christmas holidays
     - Year-end vacations
  
  2. April (22 requests, 75 days)
     - Sinhala & Tamil New Year
     - Peak festival season
  
  3. August (18 requests, 62 days)
     - School holidays
     - Family time

Request Patterns:
  • Single Day: 35 requests (24%)
  • 2-3 Days: 58 requests (40%)
  • 4-7 Days: 42 requests (29%)
  • 8+ Days: 10 requests (7%)

Day of Week Preferences:
  • Friday start: 34 requests (extend weekend)
  • Monday start: 45 requests (long weekend)
  • Mid-week: Less common

Employee Coverage:
  • 98 of 150 employees used (65%)
  • 52 employees haven't used yet
  • Average usage: 3.2 days per employee
```

#### Festival Season Impact
```
Leave Type: Casual Leave
April 2026 (New Year Period)

Peak Period: April 12-17, 2026
  • Sinhala & Tamil New Year: April 13-14
  • Extended leave requests around holidays
  • 45% of department requested leave
  • ⚠ Coverage planning required
```

### Approval Time Benchmarks

| Approval Time | Rating | Action |
|---------------|--------|--------|
| < 24 hours | Excellent | Maintain |
| 24-48 hours | Good | Acceptable |
| 2-5 days | Moderate | Improve |
| > 5 days | Poor | Investigate |

### Expected Outcome
- Comprehensive leave type analysis
- Usage pattern identification
- Approval metrics tracking
- Employee coverage insights
- Temporal trend analysis

### Verification Checklist
- [ ] leave_type_usage() method defined
- [ ] Leave type validation implemented
- [ ] Date range filtering works
- [ ] Department filtering works
- [ ] Usage statistics calculated
- [ ] Approval metrics calculated
- [ ] Duration distribution analyzed
- [ ] Employee coverage calculated
- [ ] Temporal trends analyzed
- [ ] Peak periods identified
- [ ] Return structure matches specification

---

## Task 72: Implement Pending Approvals Report

### Overview
Implement the pending approvals report method that provides managers with a list of all leave requests awaiting their approval. This report helps managers efficiently review and process pending requests, ensuring timely responses and better employee experience.

### Dependencies
- Task 67: Create LeaveReportService

### Instructions

1. **Open report_service.py file**
   - Continue in `apps/leave/services/report_service.py`
   - Locate LeaveReportService class

2. **Define pending_approvals method signature**
   - Method name: pending_approvals()
   - Accept optional manager_id parameter
   - Accept optional department_id parameter
   - Accept optional priority_filter (urgent/normal)
   - Accept optional sort_by parameter (date, urgency, employee)
   - Return dictionary with report data

3. **Add method docstring**
   - Describe method purpose
   - Document all parameters
   - Document return structure
   - Include usage examples

4. **Build base queryset**
   - Get all leave requests with status=PENDING
   - Apply tenant filter
   - Select related employee, leave type, approver
   - Exclude cancelled requests

5. **Apply manager filter**
   - If manager_id provided:
     - Filter requests assigned to this manager
   - Otherwise:
     - Get all pending requests
   - Handle hierarchy if applicable

6. **Apply department filter**
   - If department_id provided:
     - Filter by employee department
   - Support multiple departments if needed

7. **Calculate urgency metrics**
   - Days since request submitted
   - Leave start date proximity
   - Mark urgent if start date within 3 days
   - Mark overdue if pending > 5 days
   - Calculate SLA status

8. **Calculate priority scores**
   - Combine urgency factors
   - Consider start date proximity
   - Consider request submission date
   - Consider request duration
   - Generate priority score (0-100)

9. **Apply priority filtering**
   - If priority_filter provided:
     - URGENT: start within 3 days or overdue
     - NORMAL: all others
   - Filter accordingly

10. **Sort requests**
    - Apply sort_by parameter:
      - 'urgency': priority score descending
      - 'start_date': leave start date ascending
      - 'submitted_date': application date ascending
      - 'employee': employee name ascending
    - Default to urgency sorting

11. **Format request data**
    - For each pending request:
      - Request details (ID, number, dates)
      - Employee information
      - Leave type information
      - Urgency indicators
      - Days pending
      - Reason summary

12. **Calculate summary statistics**
    - Total pending requests
    - Urgent requests count
    - Overdue requests count
    - Average days pending
    - By leave type breakdown
    - By department breakdown (if applicable)

13. **Build final report structure**
    - Add report metadata
    - Add manager information (if filtered)
    - Add pending requests array (sorted)
    - Add summary statistics
    - Add urgency breakdown
    - Return complete report dictionary

### Pending Approvals Report Structure

```
┌──────────────────────────────────────────────────────┐
│          Pending Approvals Report                    │
├──────────────────────────────────────────────────────┤
│ Report Metadata:                                     │
│  • generated_at                                      │
│  • manager_id, manager_name (if filtered)            │
│  • department filter (if applied)                    │
│                                                      │
│ Summary Statistics:                                  │
│  • total_pending_requests                            │
│  • urgent_requests_count                             │
│  • overdue_requests_count                            │
│  • average_days_pending                              │
│                                                      │
│ Pending Requests (Sorted):                           │
│  • request_id, request_number                        │
│  • employee_name, department                         │
│  • leave_type_name                                   │
│  • start_date, end_date, total_days                  │
│  • applied_date, days_pending                        │
│  • urgency_level (URGENT/NORMAL/OVERDUE)             │
│  • priority_score                                    │
│  • reason (truncated)                                │
│  • days_until_start                                  │
│                                                      │
│ By Leave Type:                                       │
│  • leave_type_name                                   │
│  • pending_count                                     │
│                                                      │
│ By Urgency:                                          │
│  • URGENT count                                      │
│  • OVERDUE count                                     │
│  • NORMAL count                                      │
└──────────────────────────────────────────────────────┘
```

### Report Data Flow

```
Input Parameters
    │
    ├─> Manager filter (optional)
    ├─> Department filter (optional)
    ├─> Priority filter (optional)
    └─> Sort preference
    │
    ▼
Build Base Queryset
    │
    ├─> Status = PENDING
    └─> Apply tenant filter
    │
    ▼
Apply Filters
    │
    ├─> Filter by manager
    └─> Filter by department
    │
    ▼
Calculate Urgency Metrics
    │
    ├─> Days since submitted
    ├─> Days until start
    ├─> Check SLA compliance
    └─> Assign urgency level
    │
    ▼
Calculate Priority Scores
    │
    ├─> Combine urgency factors
    ├─> Assign 0-100 score
    └─> Higher = more urgent
    │
    ▼
Apply Priority Filter
    │
    └─> Filter by urgency level
    │
    ▼
Sort Requests
    │
    └─> Apply sort preference
    │
    ▼
Format Request Data
    │
    ├─> Extract details
    ├─> Add urgency indicators
    └─> Format dates
    │
    ▼
Calculate Summary Statistics
    │
    ├─> Count by urgency
    ├─> Count by leave type
    └─> Calculate averages
    │
    ▼
Build Final Report
```

### Urgency Calculation Logic

```
Calculate Urgency Level:
│
├─> Get days_until_start
├─> Get days_pending
│
├─> If days_pending > 5:
│   └─> OVERDUE (priority: 100)
│
├─> Else if days_until_start <= 0:
│   └─> OVERDUE (priority: 95)
│
├─> Else if days_until_start <= 3:
│   └─> URGENT (priority: 80-90)
│
├─> Else if days_until_start <= 7:
│   └─> HIGH (priority: 60-70)
│
└─> Else:
    └─> NORMAL (priority: 0-50)
```

### Priority Score Formula

```
Priority Score (0-100):
│
├─> Base Score = 50
│
├─> If overdue (pending > 5 days):
│   └─> Add 50 points → Score = 100
│
├─> If start date passed:
│   └─> Add 45 points → Score = 95
│
├─> If start within 3 days:
│   └─> Add (30 - days_until_start * 10) points
│
├─> Add pending time bonus:
│   └─> Add min(days_pending * 5, 20) points
│
└─> Cap at 100
```

### Sample Report Output

```json
{
  "report_type": "pending_approvals",
  "generated_at": "2026-01-24T12:00:00Z",
  "manager": {
    "manager_id": "EMP-0010",
    "name": "Saman Fernando",
    "position": "IT Manager",
    "department": "IT"
  },
  "filters": {
    "department_id": null,
    "priority": null
  },
  "summary": {
    "total_pending": 8,
    "urgent_count": 3,
    "overdue_count": 1,
    "normal_count": 4,
    "average_days_pending": 3.5
  },
  "pending_requests": [
    {
      "request_id": "LR-234",
      "request_number": "LR-2026-0234",
      "urgency_level": "OVERDUE",
      "priority_score": 100,
      "employee": {
        "employee_id": "EMP-0045",
        "name": "Ashan Kumar",
        "department": "IT",
        "position": "Developer"
      },
      "leave_type": {
        "id": "LT-003",
        "name": "Sick Leave",
        "code": "SL"
      },
      "dates": {
        "start_date": "2026-01-22",
        "end_date": "2026-01-23",
        "total_days": 2,
        "half_day_start": false,
        "half_day_end": false
      },
      "timeline": {
        "applied_date": "2026-01-17T08:30:00Z",
        "days_pending": 7,
        "days_until_start": -2,
        "sla_breach": true
      },
      "reason": "Fever and flu symptoms. Medical certificate attached.",
      "attachments_count": 1,
      "alerts": [
        "⚠️ OVERDUE: Pending for 7 days",
        "⚠️ Leave start date has passed"
      ]
    },
    {
      "request_id": "LR-256",
      "request_number": "LR-2026-0256",
      "urgency_level": "URGENT",
      "priority_score": 85,
      "employee": {
        "employee_id": "EMP-0023",
        "name": "Nimal Perera",
        "department": "IT",
        "position": "Senior Developer"
      },
      "leave_type": {
        "id": "LT-001",
        "name": "Annual Leave",
        "code": "AL"
      },
      "dates": {
        "start_date": "2026-01-27",
        "end_date": "2026-01-29",
        "total_days": 3,
        "half_day_start": false,
        "half_day_end": false
      },
      "timeline": {
        "applied_date": "2026-01-20T10:15:00Z",
        "days_pending": 4,
        "days_until_start": 3,
        "sla_compliant": true
      },
      "reason": "Personal travel to Kandy for family function.",
      "attachments_count": 0,
      "alerts": [
        "⏰ URGENT: Starts in 3 days"
      ]
    },
    {
      "request_id": "LR-267",
      "request_number": "LR-2026-0267",
      "urgency_level": "URGENT",
      "priority_score": 80,
      "employee": {
        "employee_id": "EMP-0067",
        "name": "Kumari Silva",
        "department": "IT",
        "position": "QA Engineer"
      },
      "leave_type": {
        "id": "LT-002",
        "name": "Casual Leave",
        "code": "CL"
      },
      "dates": {
        "start_date": "2026-01-26",
        "end_date": "2026-01-26",
        "total_days": 1,
        "half_day_start": false,
        "half_day_end": true
      },
      "timeline": {
        "applied_date": "2026-01-23T14:30:00Z",
        "days_pending": 1,
        "days_until_start": 2,
        "sla_compliant": true
      },
      "reason": "Medical appointment in the afternoon.",
      "attachments_count": 0,
      "alerts": [
        "⏰ Starts in 2 days"
      ]
    }
  ],
  "by_leave_type": {
    "Annual Leave": 3,
    "Casual Leave": 2,
    "Sick Leave": 2,
    "Medical Leave": 1
  },
  "by_urgency": {
    "OVERDUE": 1,
    "URGENT": 3,
    "NORMAL": 4
  }
}
```

### SLA (Service Level Agreement) Standards

| Metric | Standard | Action |
|--------|----------|--------|
| Response Time | < 3 days | Normal processing |
| Urgent Requests | < 24 hours | Priority handling |
| Maximum Pending | 5 days | Escalate if exceeded |
| Pre-start Approval | Before start date | Critical requirement |

### Sri Lanka Context

#### Pending Approvals Dashboard
```
Pending Leave Approvals
Manager: Saman Fernando (IT Manager)
Generated: January 24, 2026, 12:00 PM
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

⚠️ OVERDUE (1):
  • Ashan Kumar - Sick Leave (Jan 22-23)
    Pending for 7 days | Start date passed
    Action: APPROVE OR REJECT IMMEDIATELY
    
⏰ URGENT (3):
  • Nimal Perera - Annual Leave (Jan 27-29)
    Starts in 3 days | Pending for 4 days
    
  • Kumari Silva - Casual Leave (Jan 26)
    Starts in 2 days | Pending for 1 day
    Half-day afternoon
    
  • Sandun Wickrama - Annual Leave (Jan 28-30)
    Starts in 4 days | Pending for 2 days

📋 NORMAL (4):
  • Chamara Peris - Annual Leave (Feb 5-7)
  • Dilini Fernando - Casual Leave (Feb 10)
  • Rashmi Dias - Annual Leave (Feb 15-17)
  • Tharindu Silva - Medical Leave (Feb 20)

Summary:
  Total Pending: 8 requests
  Average Pending Time: 3.5 days
  SLA Breaches: 1 (OVERDUE)
```

#### Festival Season Considerations
```
Pending During Peak Season (April - New Year):
  • High volume of requests expected
  • Advance approvals encouraged
  • Team coverage planning critical
  • Multiple requests for same dates
  • Approval priority: First-come-first-served
```

### Expected Outcome
- Prioritized pending request list
- Urgency indicators
- Overdue request tracking
- Manager-specific filtering
- Efficient approval workflow

### Verification Checklist
- [ ] pending_approvals() method defined
- [ ] Manager filtering works
- [ ] Department filtering works
- [ ] Urgency calculation implemented
- [ ] Priority scoring implemented
- [ ] Overdue detection works
- [ ] Sorting options implemented
- [ ] Summary statistics calculated
- [ ] SLA tracking included
- [ ] Return structure matches specification

---

## Task 73: Implement Expiring Leave Report

### Overview
Implement the expiring leave report method that identifies employees with leave balances that are approaching their expiration date. This proactive report helps HR and managers encourage employees to utilize their leave entitlements before losing them, ensuring employee wellbeing and compliance with leave policies.

### Dependencies
- Task 67: Create LeaveReportService

### Instructions

1. **Open report_service.py file**
   - Continue in `apps/leave/services/report_service.py`
   - Locate LeaveReportService class

2. **Define expiring_leaves method signature**
   - Method name: expiring_leaves()
   - Accept optional days_until_expiry parameter (default 30)
   - Accept optional department_id parameter
   - Accept optional leave_type_id parameter
   - Accept optional min_days_expiring parameter (default 1)
   - Return dictionary with report data

3. **Add method docstring**
   - Describe method purpose
   - Document all parameters
   - Document return structure
   - Include usage examples

4. **Calculate expiry threshold date**
   - Get current date
   - Add days_until_expiry to get threshold
   - Filter balances expiring before threshold
   - Handle timezone appropriately

5. **Build base queryset**
   - Get all active LeaveBalance records
   - Filter where expiry_date is not null
   - Filter where expiry_date <= threshold date
   - Filter where available_days > 0 (has balance to lose)
   - Apply tenant filter

6. **Apply optional filters**
   - If department_id provided:
     - Filter by employee department
   - If leave_type_id provided:
     - Filter by specific leave type
   - If min_days_expiring provided:
     - Filter where available_days >= min_days

7. **Optimize query**
   - Select related employee, leave_type
   - Select related department
   - Prefetch employee user data
   - Order by expiry_date ascending

8. **Calculate expiry metrics for each balance**
   - Days until expiration
   - Available days at risk
   - Percentage of allocation at risk
   - Employee can still request?
   - Urgency level

9. **Categorize by urgency**
   - CRITICAL: Expires within 7 days
   - HIGH: Expires within 14 days
   - MEDIUM: Expires within 30 days
   - LOW: Expires beyond 30 days (if threshold increased)

10. **Format balance data**
    - For each expiring balance:
      - Employee information
      - Leave type information
      - Available days expiring
      - Expiry date
      - Days until expiry
      - Urgency level
      - Allocation details

11. **Calculate summary statistics**
    - Total employees affected
    - Total days at risk of expiry
    - By leave type breakdown
    - By department breakdown
    - By urgency level breakdown
    - Average days at risk per employee

12. **Generate recommendations**
    - For each employee:
      - Suggest dates to use leave
      - Calculate optimal request duration
      - Note any upcoming holidays
      - Consider team coverage

13. **Build final report structure**
    - Add report metadata
    - Add threshold information
    - Add expiring balances array (sorted by urgency)
    - Add summary statistics
    - Add urgency breakdown
    - Add recommendations
    - Return complete report dictionary

### Expiring Leave Report Structure

```
┌──────────────────────────────────────────────────────┐
│          Expiring Leave Report                       │
├──────────────────────────────────────────────────────┤
│ Report Metadata:                                     │
│  • generated_at                                      │
│  • threshold_days: 30                                │
│  • threshold_date: "2026-02-23"                      │
│  • filters: {department, leave_type, min_days}       │
│                                                      │
│ Summary Statistics:                                  │
│  • total_employees_affected                          │
│  • total_days_at_risk                                │
│  • average_days_per_employee                         │
│  • by_urgency_breakdown                              │
│  • by_leave_type_breakdown                           │
│                                                      │
│ Expiring Balances (Sorted by urgency):               │
│  • employee_id, name, department                     │
│  • leave_type_name                                   │
│  • available_days (expiring)                         │
│  • allocated_days                                    │
│  • used_days                                         │
│  • expiry_date                                       │
│  • days_until_expiry                                 │
│  • urgency_level                                     │
│  • percentage_at_risk                                │
│  • can_still_request (Boolean)                       │
│  • recommendation                                    │
│                                                      │
│ By Leave Type:                                       │
│  • leave_type_name                                   │
│  • employees_affected                                │
│  • total_days_expiring                               │
│                                                      │
│ By Urgency Level:                                    │
│  • CRITICAL (< 7 days)                               │
│  • HIGH (< 14 days)                                  │
│  • MEDIUM (< 30 days)                                │
│  • LOW (30+ days)                                    │
└──────────────────────────────────────────────────────┘
```

### Report Data Flow

```
Input Parameters
    │
    ├─> days_until_expiry (default 30)
    ├─> Department filter (optional)
    ├─> Leave type filter (optional)
    └─> min_days_expiring (default 1)
    │
    ▼
Calculate Threshold Date
    │
    └─> current_date + days_until_expiry
    │
    ▼
Build Base Queryset
    │
    ├─> Active balances
    ├─> Has expiry date
    ├─> Expires before threshold
    └─> Has available days > 0
    │
    ▼
Apply Optional Filters
    │
    ├─> Filter by department
    ├─> Filter by leave type
    └─> Filter by min days
    │
    ▼
Optimize Query
    │
    ├─> Select related fields
    └─> Order by expiry date
    │
    ▼
Calculate Expiry Metrics
    │
    ├─> Days until expiry
    ├─> Days at risk
    ├─> Percentage at risk
    └─> Urgency level
    │
    ▼
Categorize by Urgency
    │
    ├─> CRITICAL (< 7 days)
    ├─> HIGH (< 14 days)
    ├─> MEDIUM (< 30 days)
    └─> LOW (30+ days)
    │
    ▼
Format Balance Data
    │
    ├─> Extract employee info
    ├─> Extract leave type info
    └─> Add urgency indicators
    │
    ▼
Calculate Summary Statistics
    │
    ├─> Count employees
    ├─> Sum days at risk
    ├─> Group by leave type
    └─> Group by urgency
    │
    ▼
Generate Recommendations
    │
    ├─> Suggest usage dates
    └─> Note constraints
    │
    ▼
Build Final Report
```

### Urgency Level Calculation

```
Determine Urgency Level:
│
├─> Get days_until_expiry
│
├─> If days_until_expiry <= 7:
│   └─> CRITICAL (Immediate action needed)
│
├─> Else if days_until_expiry <= 14:
│   └─> HIGH (Act within a week)
│
├─> Else if days_until_expiry <= 30:
│   └─> MEDIUM (Plan usage soon)
│
└─> Else:
    └─> LOW (Monitor)
```

### Sample Report Output

```json
{
  "report_type": "expiring_leaves",
  "generated_at": "2026-01-24T12:30:00Z",
  "threshold": {
    "days": 30,
    "threshold_date": "2026-02-23",
    "display": "Expires within 30 days"
  },
  "filters": {
    "department_id": null,
    "leave_type_id": null,
    "min_days_expiring": 1
  },
  "summary": {
    "total_employees_affected": 15,
    "total_days_at_risk": 85,
    "average_days_per_employee": 5.67,
    "by_urgency": {
      "CRITICAL": {
        "count": 3,
        "days": 18
      },
      "HIGH": {
        "count": 5,
        "days": 32
      },
      "MEDIUM": {
        "count": 7,
        "days": 35
      }
    },
    "by_leave_type": {
      "Annual Leave": {
        "employees": 10,
        "days": 60
      },
      "Casual Leave": {
        "employees": 5,
        "days": 25
      }
    }
  },
  "expiring_balances": [
    {
      "urgency_level": "CRITICAL",
      "employee": {
        "employee_id": "EMP-0023",
        "employee_code": "E023",
        "name": "Nimal Perera",
        "department": "IT",
        "position": "Senior Developer",
        "email": "nimal.perera@company.lk"
      },
      "leave_type": {
        "id": "LT-001",
        "name": "Annual Leave",
        "code": "AL"
      },
      "balance": {
        "allocated_days": 14,
        "used_days": 7,
        "pending_days": 0,
        "available_days": 5,
        "percentage_available": 35.71
      },
      "expiry": {
        "expiry_date": "2026-01-31",
        "days_until_expiry": 7,
        "days_at_risk": 5,
        "percentage_at_risk": 35.71
      },
      "status": {
        "can_still_request": true,
        "requires_immediate_action": true,
        "alerts": [
          "⚠️ CRITICAL: 5 days expire in 7 days",
          "📅 Last day to use: January 31, 2026"
        ]
      },
      "recommendation": {
        "action": "Submit leave request immediately",
        "suggested_dates": [
          {
            "start_date": "2026-01-27",
            "end_date": "2026-01-31",
            "days": 5,
            "note": "Use all expiring days"
          }
        ],
        "notes": [
          "Consider taking full week off",
          "Coordinate with team for coverage"
        ]
      }
    },
    {
      "urgency_level": "HIGH",
      "employee": {
        "employee_id": "EMP-0045",
        "employee_code": "E045",
        "name": "Kumari Silva",
        "department": "HR",
        "position": "HR Executive",
        "email": "kumari.silva@company.lk"
      },
      "leave_type": {
        "id": "LT-001",
        "name": "Annual Leave",
        "code": "AL"
      },
      "balance": {
        "allocated_days": 14,
        "used_days": 6,
        "pending_days": 0,
        "available_days": 8,
        "percentage_available": 57.14
      },
      "expiry": {
        "expiry_date": "2026-02-07",
        "days_until_expiry": 14,
        "days_at_risk": 8,
        "percentage_at_risk": 57.14
      },
      "status": {
        "can_still_request": true,
        "requires_immediate_action": false,
        "alerts": [
          "⏰ HIGH: 8 days expire in 14 days"
        ]
      },
      "recommendation": {
        "action": "Plan leave within next 2 weeks",
        "suggested_dates": [
          {
            "start_date": "2026-02-03",
            "end_date": "2026-02-07",
            "days": 5,
            "note": "Take 5 days before expiry"
          },
          {
            "start_date": "2026-01-30",
            "end_date": "2026-01-31",
            "days": 2,
            "note": "Additional 2 days if needed"
          }
        ],
        "notes": [
          "Split into two requests if needed",
          "Consider long weekend extension"
        ]
      }
    },
    {
      "urgency_level": "MEDIUM",
      "employee": {
        "employee_id": "EMP-0067",
        "employee_code": "E067",
        "name": "Ashan Fernando",
        "department": "Sales",
        "position": "Sales Executive",
        "email": "ashan.fernando@company.lk"
      },
      "leave_type": {
        "id": "LT-002",
        "name": "Casual Leave",
        "code": "CL"
      },
      "balance": {
        "allocated_days": 7,
        "used_days": 4,
        "pending_days": 0,
        "available_days": 3,
        "percentage_available": 42.86
      },
      "expiry": {
        "expiry_date": "2026-02-20",
        "days_until_expiry": 27,
        "days_at_risk": 3,
        "percentage_at_risk": 42.86
      },
      "status": {
        "can_still_request": true,
        "requires_immediate_action": false,
        "alerts": [
          "📋 MEDIUM: 3 days expire in 27 days"
        ]
      },
      "recommendation": {
        "action": "Plan casual leave usage",
        "suggested_dates": [
          {
            "start_date": "2026-02-13",
            "end_date": "2026-02-14",
            "days": 2,
            "note": "Weekend extension"
          },
          {
            "start_date": "2026-02-20",
            "end_date": "2026-02-20",
            "days": 1,
            "note": "Single day if needed"
          }
        ],
        "notes": [
          "Good time to take casual leave",
          "No immediate rush"
        ]
      }
    }
  ]
}
```

### Recommendation Generation Logic

```
Generate Usage Recommendations:
│
├─> Calculate optimal dates:
│   ├─> Consider days until expiry
│   ├─> Avoid public holidays (already off)
│   ├─> Suggest Friday/Monday for long weekends
│   └─> Group consecutive days if possible
│
├─> Check team availability:
│   ├─> Avoid dates with multiple team members off
│   └─> Note if coordination needed
│
└─> Generate notes:
    ├─> Urgency reminders
    ├─> Practical suggestions
    └─> Policy reminders
```

### Sri Lanka Context

#### Expiring Leave Notification
```
Expiring Leave Alert
Employee: Nimal Perera (IT Department)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

⚠️ CRITICAL ALERT
You have 5 Annual Leave days expiring on January 31, 2026
Days until expiry: 7 days
Action required: IMMEDIATE

Recommendation:
  Submit leave request for January 27-31 (5 days)
  This will use all expiring days
  
Important Notes:
  • Submit request today for approval
  • Coordinate with team for coverage
  • Cannot be carried forward after expiry
  • Will lose these days if not used

Need help planning your leave?
Contact HR: hr@company.lk
```

#### Year-End Expiry Pattern
```
Common Expiry Periods in Sri Lanka:
  • January 31: Most annual leave expires
  • March 31: Some companies use financial year
  • December 31: Calendar year expiry
  
Best Practices:
  • Notify employees 60 days before expiry
  • Send reminders at 30, 14, 7 days
  • Encourage usage during lean periods
  • Avoid festival season rush (April, December)
```

### Expiry Policy Variations

| Policy | Expiry Rule | Sri Lanka Common? |
|--------|-------------|-------------------|
| Calendar Year | December 31 | Yes |
| Financial Year | March 31 | Yes (government) |
| Anniversary | Employee join date + 1 year | Less common |
| Rolling | 12 months from allocation | Rare |

### Expected Outcome
- Proactive expiry tracking
- Employee notifications
- Usage recommendations
- Risk quantification
- Compliance support

### Verification Checklist
- [ ] expiring_leaves() method defined
- [ ] Threshold calculation implemented
- [ ] Expiry date filtering works
- [ ] Available days validation works
- [ ] Department filtering works
- [ ] Leave type filtering works
- [ ] Urgency categorization implemented
- [ ] Days until expiry calculated
- [ ] Percentage at risk calculated
- [ ] Recommendations generated
- [ ] Summary statistics calculated
- [ ] Return structure matches specification

---

## Task 74: Create Report Export Service

### Overview
Create a comprehensive service for exporting leave reports in various formats (Excel, PDF, CSV). This service takes report data from LeaveReportService and generates professional, formatted documents suitable for distribution, printing, and archival purposes.

### Dependencies
- Task 67: Create LeaveReportService
- Tasks 68-73: All report methods
- Python libraries: openpyxl, reportlab, pandas (optional)

### Instructions

1. **Create export_service.py file**
   - Create file at `apps/leave/services/export_service.py`
   - Add module docstring explaining export service purpose
   - Import necessary libraries

2. **Import required modules**
   - Import openpyxl for Excel generation
   - Import reportlab for PDF generation
   - Import io for BytesIO
   - Import datetime utilities
   - Import Django utilities
   - Import typing for type hints

3. **Define LeaveExportService class**
   - Create service class with descriptive docstring
   - Add type hints for all methods
   - Include tenant awareness

4. **Add initialization method**
   - Accept optional tenant parameter
   - Store tenant for tenant-aware exports
   - Initialize logger

5. **Create base Excel workbook methods**
   - Method: _create_workbook()
   - Create workbook with default styling
   - Set up worksheet with headers
   - Apply company branding (if available)
   - Return workbook instance

6. **Create base PDF document methods**
   - Method: _create_pdf_document()
   - Initialize PDF canvas
   - Set up page layout
   - Add company header/logo
   - Return PDF document instance

7. **Implement Excel styling methods**
   - Method: _apply_header_style()
   - Method: _apply_data_style()
   - Method: _apply_total_style()
   - Define color schemes
   - Set font styles and sizes
   - Add borders and alignment

8. **Implement PDF styling methods**
   - Method: _add_pdf_header()
   - Method: _add_pdf_footer()
   - Method: _add_pdf_table()
   - Define text styles
   - Set margins and spacing
   - Add page numbers

9. **Create export_to_excel() method**
   - Accept report_data dictionary
   - Accept report_type parameter
   - Parse report data structure
   - Create appropriate Excel layout
   - Format cells based on data type
   - Add charts/graphs (if applicable)
   - Return BytesIO object

10. **Create export_to_pdf() method**
    - Accept report_data dictionary
    - Accept report_type parameter
    - Parse report data structure
    - Create appropriate PDF layout
    - Format content professionally
    - Add page breaks as needed
    - Return BytesIO object

11. **Create export_to_csv() method**
    - Accept report_data dictionary
    - Accept report_type parameter
    - Extract tabular data
    - Format as CSV
    - Handle multi-level data (flatten if needed)
    - Return BytesIO object

12. **Add format-specific methods for each report type**
    - Method: export_balance_summary_excel()
    - Method: export_balance_summary_pdf()
    - Method: export_leave_history_excel()
    - Method: export_leave_history_pdf()
    - Method: export_department_report_excel()
    - Method: export_department_report_pdf()
    - Customize layout for each report type

13. **Add utility methods**
    - Method: _format_date() - consistent date formatting
    - Method: _format_number() - number formatting
    - Method: _sanitize_filename() - safe filenames
    - Method: _generate_filename() - descriptive names
    - Method: _calculate_column_widths() - auto-sizing

14. **Update services __init__.py**
    - Import LeaveExportService
    - Add to __all__ list

### LeaveExportService Structure

```
┌──────────────────────────────────────────────────────┐
│          LeaveExportService Class                    │
├──────────────────────────────────────────────────────┤
│ Core Export Methods:                                 │
│  • export_to_excel()                                 │
│  • export_to_pdf()                                   │
│  • export_to_csv()                                   │
│                                                      │
│ Report-Specific Methods:                             │
│  • export_balance_summary_excel()                    │
│  • export_leave_history_pdf()                        │
│  • export_department_report_excel()                  │
│  • ... (one per report type per format)              │
│                                                      │
│ Helper Methods:                                      │
│  • _create_workbook()                                │
│  • _create_pdf_document()                            │
│  • _apply_header_style()                             │
│  • _add_pdf_header()                                 │
│  • _format_date()                                    │
│  • _generate_filename()                              │
└──────────────────────────────────────────────────────┘
```

### Export Service Architecture

```
┌─────────────────────────────────────────────────┐
│          LeaveExportService                     │
└─────────────────────────────────────────────────┘
                      │
        ┌─────────────┼─────────────┬─────────────┐
        ▼             ▼             ▼             ▼
┌──────────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐
│ Excel Export │ │   PDF    │ │   CSV    │ │  Custom  │
│   (openpyxl) │ │ Export   │ │  Export  │ │  Format  │
│              │ │(reportlab│ │          │ │          │
└──────────────┘ └──────────┘ └──────────┘ └──────────┘
```

### Excel Export Structure

```
Excel Workbook Layout:
│
├─> Sheet 1: Report Data
│   ├─> Header row (styled)
│   ├─> Data rows
│   ├─> Summary row (totals)
│   └─> Auto-sized columns
│
├─> Sheet 2: Summary Statistics (if applicable)
│   ├─> Key metrics
│   └─> Charts/graphs
│
└─> Sheet 3: Filters Applied
    └─> Report metadata
```

### PDF Export Structure

```
PDF Document Layout:
│
├─> Page Header
│   ├─> Company logo
│   ├─> Report title
│   └─> Generation date
│
├─> Report Filters Section
│   └─> Applied filters and parameters
│
├─> Main Content
│   ├─> Summary statistics
│   ├─> Data tables
│   └─> Charts (if applicable)
│
└─> Page Footer
    ├─> Page numbers
    └─> Generation info
```

### Sample Usage

```python
# Initialize services
report_service = LeaveReportService(tenant=current_tenant)
export_service = LeaveExportService(tenant=current_tenant)

# Generate report data
balance_report = report_service.balance_summary(
    year=2026,
    department_id="DEPT-001"
)

# Export to Excel
excel_file = export_service.export_to_excel(
    report_data=balance_report,
    report_type="balance_summary"
)

# Export to PDF
pdf_file = export_service.export_to_pdf(
    report_data=balance_report,
    report_type="balance_summary"
)

# Export to CSV
csv_file = export_service.export_to_csv(
    report_data=balance_report,
    report_type="balance_summary"
)

# Download response
from django.http import HttpResponse

response = HttpResponse(
    excel_file.getvalue(),
    content_type='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
)
response['Content-Disposition'] = 'attachment; filename="balance_summary_2026.xlsx"'
return response
```

### Excel Styling Example

```python
# Header style
header_fill = PatternFill(
    start_color="366092",  # Blue
    end_color="366092",
    fill_type="solid"
)
header_font = Font(
    name="Calibri",
    size=11,
    bold=True,
    color="FFFFFF"
)
header_alignment = Alignment(
    horizontal="center",
    vertical="center"
)

# Data style
data_font = Font(name="Calibri", size=10)
data_alignment = Alignment(horizontal="left")

# Total style
total_fill = PatternFill(
    start_color="D9E1F2",  # Light blue
    end_color="D9E1F2",
    fill_type="solid"
)
total_font = Font(
    name="Calibri",
    size=10,
    bold=True
)
```

### PDF Styling Example

```python
from reportlab.lib.styles import getSampleStyleSheet
from reportlab.lib.colors import HexColor

styles = getSampleStyleSheet()

# Title style
title_style = ParagraphStyle(
    'CustomTitle',
    parent=styles['Heading1'],
    fontSize=18,
    textColor=HexColor('#366092'),
    spaceAfter=12,
    alignment=1  # Center
)

# Header style
header_style = ParagraphStyle(
    'CustomHeader',
    parent=styles['Heading2'],
    fontSize=14,
    textColor=HexColor('#366092'),
    spaceAfter=10
)

# Body style
body_style = ParagraphStyle(
    'CustomBody',
    parent=styles['BodyText'],
    fontSize=10,
    spaceAfter=6
)
```

### Sri Lanka Context

#### Company Header for Sri Lankan Company
```
┌────────────────────────────────────────────────┐
│         [Company Logo]                         │
│                                                │
│         LANKACOMMERCE (PVT) LTD                │
│       123 Galle Road, Colombo 03               │
│     Tel: +94 11 234 5678                       │
│     Email: hr@lankacommerce.lk                 │
│                                                │
│     Leave Balance Summary Report               │
│     Year: 2026                                 │
│     Generated: January 24, 2026                │
└────────────────────────────────────────────────┘
```

#### Excel Report - Balance Summary
```
A1: LANKACOMMERCE (PVT) LTD - Leave Balance Summary 2026
A3: Employee Code | Employee Name | Department | Leave Type | Allocated | Used | Available
A4: E001 | Nimal Perera | IT | Annual Leave | 14 | 5 | 9
A5: E001 | Nimal Perera | IT | Casual Leave | 7 | 2 | 5
...

Row styling:
  - Header: Blue background, white text, bold
  - Data: Alternating row colors (white, light gray)
  - Totals: Light blue background, bold
  - Number columns: Right-aligned, 0 decimals
  - Date columns: DD-MMM-YYYY format
```

#### PDF Report Layout
```
Page 1:
  • Company header with logo
  • Report title: "Leave Balance Summary 2026"
  • Filters: Department: IT
  • Generated: January 24, 2026, 12:00 PM
  
  Summary Statistics:
    Total Employees: 20
    Total Leave Days Allocated: 560
    Total Leave Days Used: 185
    Average Utilization: 33.04%
  
  Detailed Breakdown:
    [Table with employee data]
  
  Page 1 of 3
```

### Filename Generation

```python
def _generate_filename(report_type, filters, format_ext):
    """
    Generate descriptive filename
    
    Examples:
      balance_summary_2026_IT_20260124.xlsx
      leave_history_EMP0001_20260124.pdf
      department_report_IT_Jan2026_20260124.csv
    """
    parts = [report_type]
    
    if filters.get('year'):
        parts.append(str(filters['year']))
    if filters.get('department'):
        parts.append(filters['department'])
    if filters.get('employee_code'):
        parts.append(filters['employee_code'])
    
    # Add generation date
    parts.append(datetime.now().strftime('%Y%m%d'))
    
    filename = '_'.join(parts) + '.' + format_ext
    return filename.lower().replace(' ', '_')
```

### Expected Outcome
- Professional report exports
- Multiple format support (Excel, PDF, CSV)
- Consistent styling and branding
- Optimized file generation
- User-friendly filenames

### Verification Checklist
- [ ] export_service.py file created
- [ ] LeaveExportService class defined
- [ ] Excel export method implemented
- [ ] PDF export method implemented
- [ ] CSV export method implemented
- [ ] Excel styling applied
- [ ] PDF styling applied
- [ ] Report-specific methods created
- [ ] Utility methods implemented
- [ ] Filename generation works
- [ ] BytesIO objects returned
- [ ] Service imported in __init__.py

---

## Summary

This document implemented comprehensive leave reporting and export functionality:

### Completed Infrastructure
- ✅ LeaveReportService with base methods and helpers
- ✅ Balance Summary Report - employee leave balance overview
- ✅ Leave History Report - employee chronological leave records
- ✅ Department Leave Report - departmental usage analysis
- ✅ Leave Type Usage Report - leave type utilization patterns
- ✅ Pending Approvals Report - manager approval queue
- ✅ Expiring Leave Report - proactive balance expiry tracking
- ✅ LeaveExportService - multi-format export (Excel, PDF, CSV)

### Key Achievements
1. **Comprehensive Reporting** - Seven distinct report types covering all needs
2. **Manager Tools** - Pending approvals and department reports for decision-making
3. **Employee Insights** - Balance summaries and history for employee awareness
4. **Proactive Alerts** - Expiring leave tracking to prevent balance loss
5. **Usage Analytics** - Leave type and departmental trend analysis
6. **Professional Exports** - Multi-format support with styling and branding
7. **Sri Lanka Context** - Poya day handling, festival season awareness

### Next Steps
Proceed to [02_Tasks-75-80_Integration-Notifications-Dashboard.md](02_Tasks-75-80_Integration-Notifications-Dashboard.md) to implement integrations with Attendance and Payroll modules, notification services, and dashboard data.

---

**Document Status:** ✅ Complete  
**Total Tasks:** 8  
**Total Lines:** ~1365
