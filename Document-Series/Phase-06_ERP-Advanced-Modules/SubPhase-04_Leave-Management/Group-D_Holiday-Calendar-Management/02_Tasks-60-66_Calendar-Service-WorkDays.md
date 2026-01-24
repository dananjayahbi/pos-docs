# Tasks 60-66: Calendar Service and Working Days Calculation

> **Phase:** 06 - ERP Advanced Modules  
> **SubPhase:** 04 - Leave Management  
> **Group:** D - Holiday & Calendar Management  
> **Document:** 02 of 02  
> **Tasks Covered:** 60, 61, 62, 63, 64, 65, 66

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [01_Tasks-53-59_Holiday-Model-Seed.md](01_Tasks-53-59_Holiday-Model-Seed.md)

---

## Document Overview

This document covers the implementation of the LeaveCalendarService, which provides calendar data generation, working days calculation, and automatic leave day adjustment based on holidays and weekends. The service integrates with FullCalendar on the frontend, supports team and department calendar views, and ensures accurate leave calculations by excluding non-working days.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 60 | Create LeaveCalendarService | High | 30 min |
| 61 | Implement Team Calendar | Medium | 25 min |
| 62 | Implement Department Calendar | Medium | 25 min |
| 63 | Implement Holiday Calendar | Medium | 20 min |
| 64 | Implement Calendar JSON Export | Medium | 25 min |
| 65 | Calculate Working Days | High | 30 min |
| 66 | Auto-Adjust Leave Days | High | 30 min |

---

## Task 60: Create LeaveCalendarService

### Overview
Create the LeaveCalendarService, a service class that provides calendar-related functionality for the leave management system. This service acts as the central orchestrator for calendar data, holiday lookups, leave display, and working day calculations. It follows the service layer pattern to separate business logic from models and views.

### Dependencies
- Holiday model exists and populated
- LeaveRequest model exists
- Employee model exists
- Department model exists

### Instructions

1. **Create services directory**
   - Navigate to `apps/leave/`
   - Create directory: `services/`
   - Create `__init__.py` in services directory

2. **Create calendar_service.py file**
   - Create file at `apps/leave/services/calendar_service.py`
   - This will contain the LeaveCalendarService class

3. **Import required modules**
   - Import Django ORM utilities (Q, F, Count, etc.)
   - Import Holiday model
   - Import LeaveRequest model
   - Import Employee and Department models
   - Import date/datetime utilities
   - Import leave status constants

4. **Define LeaveCalendarService class**
   - Create class with comprehensive docstring
   - Explain service purpose and methods
   - No inheritance needed (standalone service)

5. **Add initialization method**
   - `__init__(self, tenant)`
   - Store tenant reference
   - All queries will be tenant-scoped

6. **Create method stubs**
   - Add placeholder methods for Tasks 61-66
   - Include method signatures and docstrings
   - Actual implementation in subsequent tasks

7. **Add helper method: _get_date_range**
   - Private method to parse date range
   - Accept start_date and end_date parameters
   - Validate date range
   - Return tuple of (start_date, end_date)

8. **Add helper method: _format_employee_name**
   - Private method to format employee display name
   - Accept employee object
   - Return formatted string (e.g., "John Doe")

9. **Update services/__init__.py**
   - Import LeaveCalendarService
   - Add to __all__ list

### LeaveCalendarService Structure

```
┌────────────────────────────────────────────────────────┐
│           LeaveCalendarService                         │
├────────────────────────────────────────────────────────┤
│ Initialization:                                        │
│  • __init__(tenant)                                    │
│                                                        │
│ Public Methods (Tasks 61-66):                         │
│  • get_team_calendar(manager_id, date_range)          │
│  • get_department_calendar(department_id, date_range) │
│  • get_holidays(date_range, filters)                  │
│  • generate_calendar_json(employee_id, date_range)    │
│  • calculate_working_days(start, end, employee_id)    │
│  • auto_adjust_leave_days(leave_request_data)         │
│                                                        │
│ Helper Methods:                                        │
│  • _get_date_range(start, end)                        │
│  • _format_employee_name(employee)                    │
│  • _get_weekends_in_range(start, end)                 │
│  • _get_holidays_for_employee(employee, start, end)   │
└────────────────────────────────────────────────────────┘
```

### Service Layer Pattern

```
┌─────────────────────────────────────────────────────┐
│              Service Layer Architecture              │
├─────────────────────────────────────────────────────┤
│                                                      │
│  View/API Layer                                     │
│       │                                             │
│       ├─── Receives request                         │
│       ├─── Validates input                          │
│       └─── Calls service method                     │
│              │                                       │
│              ▼                                       │
│  Service Layer (LeaveCalendarService)               │
│       │                                             │
│       ├─── Business logic                           │
│       ├─── Data aggregation                         │
│       ├─── Calculations                             │
│       └─── Returns processed data                   │
│              │                                       │
│              ▼                                       │
│  Model Layer (Holiday, LeaveRequest, Employee)      │
│       │                                             │
│       ├─── Database queries                         │
│       ├─── Data validation                          │
│       └─── Returns raw data                         │
│              │                                       │
│              ▼                                       │
│  Database (PostgreSQL)                              │
│                                                      │
└─────────────────────────────────────────────────────┘
```

### Service Class Foundation

```python
# apps/leave/services/calendar_service.py

from django.db.models import Q, F, Prefetch
from apps.leave.models import Holiday, LeaveRequest
from apps.core.models import Employee, Department
from apps.leave.constants import LEAVE_STATUS_APPROVED, LEAVE_STATUS_PENDING
from datetime import date, timedelta
from typing import Dict, List, Tuple, Optional

class LeaveCalendarService:
    """
    Service class for leave calendar operations.
    
    Provides functionality for:
    - Team and department leave calendars
    - Holiday calendar integration
    - FullCalendar JSON export
    - Working days calculation
    - Automatic leave day adjustment
    
    All operations are tenant-scoped for multi-tenancy support.
    
    Usage:
        service = LeaveCalendarService(tenant=request.tenant)
        calendar_data = service.get_team_calendar(manager_id=1, date_range=(start, end))
    """
    
    def __init__(self, tenant):
        """
        Initialize the calendar service with a tenant context.
        
        Args:
            tenant: Tenant instance for multi-tenancy scoping
        """
        self.tenant = tenant
    
    # Task 61: Team Calendar
    def get_team_calendar(self, manager_id: int, date_range: Tuple[date, date]) -> Dict:
        """
        Get leave calendar for a manager's team.
        Implementation in Task 61.
        """
        pass
    
    # Task 62: Department Calendar
    def get_department_calendar(self, department_id: int, date_range: Tuple[date, date]) -> Dict:
        """
        Get leave calendar for a department.
        Implementation in Task 62.
        """
        pass
    
    # Task 63: Holiday Calendar
    def get_holidays(self, date_range: Tuple[date, date], department_id: Optional[int] = None,
                    location: Optional[str] = None) -> List[Dict]:
        """
        Get holidays for specified date range and scope.
        Implementation in Task 63.
        """
        pass
    
    # Task 64: Calendar JSON Export
    def generate_calendar_json(self, employee_id: int, date_range: Tuple[date, date]) -> Dict:
        """
        Generate FullCalendar-compatible JSON data.
        Implementation in Task 64.
        """
        pass
    
    # Task 65: Calculate Working Days
    def calculate_working_days(self, start_date: date, end_date: date, 
                               employee_id: int) -> int:
        """
        Calculate working days between dates, excluding weekends and holidays.
        Implementation in Task 65.
        """
        pass
    
    # Task 66: Auto-Adjust Leave Days
    def auto_adjust_leave_days(self, leave_request_data: Dict) -> Dict:
        """
        Automatically adjust leave days based on weekends and holidays.
        Implementation in Task 66.
        """
        pass
    
    # Helper Methods
    
    def _get_date_range(self, start_date, end_date) -> Tuple[date, date]:
        """
        Validate and parse date range.
        
        Args:
            start_date: Start date (date object or string)
            end_date: End date (date object or string)
        
        Returns:
            Tuple of (start_date, end_date) as date objects
        
        Raises:
            ValueError: If date range is invalid
        """
        # Convert strings to date objects if necessary
        if isinstance(start_date, str):
            start_date = date.fromisoformat(start_date)
        if isinstance(end_date, str):
            end_date = date.fromisoformat(end_date)
        
        # Validate range
        if end_date < start_date:
            raise ValueError("End date must be after start date")
        
        return (start_date, end_date)
    
    def _format_employee_name(self, employee) -> str:
        """
        Format employee name for display.
        
        Args:
            employee: Employee instance
        
        Returns:
            Formatted name string
        """
        if employee.user.first_name and employee.user.last_name:
            return f"{employee.user.first_name} {employee.user.last_name}"
        return employee.user.username
```

### Service Initialization

```python
# Usage in views/API endpoints

from apps.leave.services.calendar_service import LeaveCalendarService

# In a Django view or DRF view
def team_calendar_view(request):
    # Initialize service with tenant
    service = LeaveCalendarService(tenant=request.tenant)
    
    # Call service method
    calendar_data = service.get_team_calendar(
        manager_id=request.user.employee.id,
        date_range=(start_date, end_date)
    )
    
    return JsonResponse(calendar_data)
```

### Service Benefits

| Benefit | Description |
|---------|-------------|
| **Separation of Concerns** | Business logic separate from models/views |
| **Reusability** | Service methods can be used across multiple endpoints |
| **Testability** | Easy to unit test service methods in isolation |
| **Maintainability** | Centralized location for calendar logic |
| **Tenant Safety** | All queries automatically tenant-scoped |
| **Consistency** | Same logic used throughout application |

### Service Method Conventions

```
Method Naming:
- Public methods: get_*, calculate_*, generate_*, auto_*
- Private methods: _helper_name (single underscore prefix)

Parameter Order:
1. Primary identifier (employee_id, department_id)
2. Date range (start_date, end_date or tuple)
3. Optional filters (department_id=None, location=None)

Return Types:
- get_* methods: Dict or List[Dict]
- calculate_* methods: int or float
- generate_* methods: Dict
- auto_* methods: Dict (modified data)
```

### Expected Outcome
- LeaveCalendarService class created
- Service initialization with tenant context
- Method stubs for Tasks 61-66
- Helper methods for common operations
- Foundation for calendar functionality

### Verification Checklist
- [ ] `services/` directory created
- [ ] `services/__init__.py` created
- [ ] `calendar_service.py` file created
- [ ] LeaveCalendarService class defined
- [ ] `__init__` method implemented
- [ ] Method stubs for Tasks 61-66 added
- [ ] `_get_date_range` helper implemented
- [ ] `_format_employee_name` helper implemented
- [ ] Service imported in `services/__init__.py`
- [ ] Comprehensive docstrings added

---

## Task 61: Implement Team Calendar

### Overview
Implement the `get_team_calendar` method in LeaveCalendarService. This method retrieves leave information for all direct reports of a manager, showing approved and pending leave requests within a specified date range. This is essential for managers to see who is on leave or planning to take leave in their team.

### Dependencies
- Task 60: LeaveCalendarService created
- LeaveRequest model exists
- Employee model has manager relationship

### Instructions

1. **Open calendar_service.py**
   - Navigate to `apps/leave/services/calendar_service.py`
   - Locate `get_team_calendar` method stub

2. **Implement method logic**
   - Accept manager_id and date_range parameters
   - Validate date range using helper method
   - Query for manager's direct reports
   - Query leave requests for team members
   - Filter by date range and status (approved/pending)
   - Aggregate leave data

3. **Build query for direct reports**
   - Query Employee model
   - Filter by manager_id
   - Filter by tenant
   - Filter by is_active=True
   - Select related user for name

4. **Query leave requests**
   - Get leave requests for team members
   - Filter by date range (overlapping dates)
   - Filter by status (APPROVED or PENDING)
   - Prefetch related employee and leave_type
   - Order by start_date

5. **Format response data**
   - Create list of leave entries
   - Include employee name, leave type, dates, status
   - Include leave request ID for reference
   - Group by employee or chronologically

6. **Add color coding metadata**
   - Assign colors based on leave type
   - Different colors for approved vs pending
   - Return color information for frontend

7. **Handle edge cases**
   - Manager with no direct reports
   - No leave requests in date range
   - Invalid manager_id
   - Return empty results gracefully

### Team Calendar Data Flow

```
┌─────────────────────────────────────────────────┐
│       Team Calendar Request Flow                 │
├─────────────────────────────────────────────────┤
│                                                  │
│  1. Manager requests team calendar              │
│     └─ manager_id=5, date_range=(2026-01-01,    │
│        2026-01-31)                               │
│                                                  │
│  2. Service validates inputs                    │
│     ├─ Manager exists and has permission        │
│     └─ Date range is valid                      │
│                                                  │
│  3. Query direct reports                        │
│     └─ SELECT * FROM employee                   │
│        WHERE manager_id=5 AND is_active=True    │
│                                                  │
│  4. Query leave requests                        │
│     └─ SELECT * FROM leave_request              │
│        WHERE employee_id IN (...)               │
│        AND (start_date <= '2026-01-31'          │
│             AND end_date >= '2026-01-01')       │
│        AND status IN ('APPROVED', 'PENDING')    │
│                                                  │
│  5. Format response                             │
│     └─ Group by employee or chronologically     │
│                                                  │
│  6. Return calendar data                        │
│     └─ List of leave entries with metadata      │
│                                                  │
└─────────────────────────────────────────────────┘
```

### Method Implementation

```python
def get_team_calendar(self, manager_id: int, date_range: Tuple[date, date]) -> Dict:
    """
    Get leave calendar for a manager's team (direct reports).
    
    Args:
        manager_id: ID of the manager/supervisor
        date_range: Tuple of (start_date, end_date)
    
    Returns:
        Dictionary containing:
        - team_members: List of team member details
        - leave_entries: List of leave requests in date range
        - summary: Statistics (total leaves, by status)
    
    Example:
        {
            'team_members': [
                {'id': 10, 'name': 'John Doe', 'department': 'Sales'},
                {'id': 11, 'name': 'Jane Smith', 'department': 'Sales'}
            ],
            'leave_entries': [
                {
                    'id': 123,
                    'employee_id': 10,
                    'employee_name': 'John Doe',
                    'leave_type': 'Annual Leave',
                    'start_date': '2026-01-15',
                    'end_date': '2026-01-17',
                    'total_days': 3,
                    'status': 'APPROVED',
                    'color': '#4CAF50'
                }
            ],
            'summary': {
                'total_team_members': 2,
                'total_leave_requests': 1,
                'approved_leaves': 1,
                'pending_leaves': 0
            }
        }
    """
    # Validate date range
    start_date, end_date = self._get_date_range(date_range[0], date_range[1])
    
    # Get team members (direct reports)
    team_members = Employee.objects.filter(
        tenant=self.tenant,
        manager_id=manager_id,
        is_active=True
    ).select_related('user', 'department').order_by('user__first_name', 'user__last_name')
    
    if not team_members.exists():
        return {
            'team_members': [],
            'leave_entries': [],
            'summary': {
                'total_team_members': 0,
                'total_leave_requests': 0,
                'approved_leaves': 0,
                'pending_leaves': 0
            }
        }
    
    team_member_ids = list(team_members.values_list('id', flat=True))
    
    # Get leave requests for team members in date range
    leave_requests = LeaveRequest.objects.filter(
        tenant=self.tenant,
        employee_id__in=team_member_ids,
        start_date__lte=end_date,
        end_date__gte=start_date,
        status__in=[LEAVE_STATUS_APPROVED, LEAVE_STATUS_PENDING]
    ).select_related('employee__user', 'leave_type').order_by('start_date', 'employee__user__first_name')
    
    # Format team members
    team_members_data = [
        {
            'id': member.id,
            'name': self._format_employee_name(member),
            'department': member.department.name if member.department else None,
            'position': member.position,
        }
        for member in team_members
    ]
    
    # Format leave entries
    leave_entries_data = [
        {
            'id': leave.id,
            'employee_id': leave.employee.id,
            'employee_name': self._format_employee_name(leave.employee),
            'leave_type': leave.leave_type.name,
            'leave_type_code': leave.leave_type.code,
            'start_date': leave.start_date.isoformat(),
            'end_date': leave.end_date.isoformat(),
            'total_days': leave.total_days,
            'status': leave.status,
            'color': self._get_leave_color(leave.leave_type.code, leave.status),
            'reason': leave.reason[:100] if leave.reason else None,  # Truncate for calendar view
        }
        for leave in leave_requests
    ]
    
    # Calculate summary
    approved_count = sum(1 for leave in leave_requests if leave.status == LEAVE_STATUS_APPROVED)
    pending_count = sum(1 for leave in leave_requests if leave.status == LEAVE_STATUS_PENDING)
    
    return {
        'team_members': team_members_data,
        'leave_entries': leave_entries_data,
        'summary': {
            'total_team_members': len(team_members),
            'total_leave_requests': len(leave_requests),
            'approved_leaves': approved_count,
            'pending_leaves': pending_count,
        },
        'date_range': {
            'start': start_date.isoformat(),
            'end': end_date.isoformat()
        }
    }
```

### Color Coding Helper

```python
def _get_leave_color(self, leave_type_code: str, status: str) -> str:
    """
    Get color for leave entry based on type and status.
    
    Args:
        leave_type_code: Leave type code (ANNUAL, SICK, etc.)
        status: Leave request status
    
    Returns:
        Hex color code string
    """
    # Color map for leave types (approved)
    leave_type_colors = {
        'ANNUAL': '#4CAF50',      # Green
        'SICK': '#F44336',        # Red
        'CASUAL': '#2196F3',      # Blue
        'MATERNITY': '#E91E63',   # Pink
        'PATERNITY': '#9C27B0',   # Purple
        'UNPAID': '#FF9800',      # Orange
        'COMPENSATORY': '#00BCD4', # Cyan
        'STUDY': '#795548',       # Brown
    }
    
    # Get base color for leave type
    color = leave_type_colors.get(leave_type_code, '#757575')  # Default gray
    
    # Lighten color for pending status
    if status == LEAVE_STATUS_PENDING:
        # Use lighter shade for pending (add transparency or use lighter hex)
        color = color + '80'  # Add 50% transparency
    
    return color
```

### Team Calendar Example Response

```json
{
  "team_members": [
    {
      "id": 10,
      "name": "John Doe",
      "department": "Sales",
      "position": "Sales Executive"
    },
    {
      "id": 11,
      "name": "Jane Smith",
      "department": "Sales",
      "position": "Senior Sales Executive"
    }
  ],
  "leave_entries": [
    {
      "id": 123,
      "employee_id": 10,
      "employee_name": "John Doe",
      "leave_type": "Annual Leave",
      "leave_type_code": "ANNUAL",
      "start_date": "2026-01-15",
      "end_date": "2026-01-17",
      "total_days": 3,
      "status": "APPROVED",
      "color": "#4CAF50",
      "reason": "Family vacation"
    },
    {
      "id": 124,
      "employee_id": 11,
      "employee_name": "Jane Smith",
      "leave_type": "Sick Leave",
      "leave_type_code": "SICK",
      "start_date": "2026-01-20",
      "end_date": "2026-01-21",
      "total_days": 2,
      "status": "PENDING",
      "color": "#F4433680",
      "reason": "Flu symptoms"
    }
  ],
  "summary": {
    "total_team_members": 2,
    "total_leave_requests": 2,
    "approved_leaves": 1,
    "pending_leaves": 1
  },
  "date_range": {
    "start": "2026-01-01",
    "end": "2026-01-31"
  }
}
```

### Query Optimization

```python
# Efficient query with select_related and prefetch_related
leave_requests = LeaveRequest.objects.filter(
    tenant=self.tenant,
    employee_id__in=team_member_ids,
    start_date__lte=end_date,
    end_date__gte=start_date,
    status__in=[LEAVE_STATUS_APPROVED, LEAVE_STATUS_PENDING]
).select_related(
    'employee__user',      # Avoid N+1 query for employee name
    'leave_type'           # Avoid N+1 query for leave type
).order_by('start_date', 'employee__user__first_name')

# This executes as a single query with JOINs, not multiple queries
```

### Frontend Integration

```javascript
// Example FullCalendar usage with team calendar data

const fetchTeamCalendar = async (managerId, startDate, endDate) => {
  const response = await fetch(`/api/leave/team-calendar/?manager=${managerId}&start=${startDate}&end=${endDate}`);
  const data = await response.json();
  
  // Transform leave entries to FullCalendar events
  const events = data.leave_entries.map(entry => ({
    id: `leave-${entry.id}`,
    title: `${entry.employee_name} - ${entry.leave_type}`,
    start: entry.start_date,
    end: entry.end_date,
    backgroundColor: entry.color,
    extendedProps: {
      employeeId: entry.employee_id,
      leaveType: entry.leave_type_code,
      status: entry.status,
      reason: entry.reason
    }
  }));
  
  return events;
};
```

### Expected Outcome
- Team calendar method functional
- Direct reports' leave data retrieved
- Approved and pending leaves included
- Color-coded by leave type and status
- Optimized database queries
- Summary statistics included

### Verification Checklist
- [ ] `get_team_calendar` method implemented
- [ ] Date range validation working
- [ ] Team members query correct (direct reports only)
- [ ] Leave requests query with date overlap logic
- [ ] Status filter (APPROVED, PENDING) applied
- [ ] Response format matches specification
- [ ] Color coding helper method added
- [ ] Summary statistics calculated correctly
- [ ] Empty results handled gracefully
- [ ] Query optimization with select_related

---

## Task 62: Implement Department Calendar

### Overview
Implement the `get_department_calendar` method in LeaveCalendarService. This method retrieves leave information for all employees in a specific department, providing a broader view than team calendar for department heads or HR personnel to manage department-wide leave planning.

### Dependencies
- Task 61: Team calendar implemented
- Department model exists

### Instructions

1. **Open calendar_service.py**
   - Navigate to `apps/leave/services/calendar_service.py`
   - Locate `get_department_calendar` method stub

2. **Implement method logic**
   - Accept department_id and date_range parameters
   - Validate department exists and belongs to tenant
   - Query all employees in department
   - Query leave requests for department employees
   - Filter by date range and status
   - Format response similar to team calendar

3. **Build query for department employees**
   - Query Employee model
   - Filter by department_id
   - Filter by tenant
   - Filter by is_active=True
   - Include all employees regardless of manager

4. **Query leave requests**
   - Get leave requests for department employees
   - Apply same date range logic as team calendar
   - Filter by status (APPROVED, PENDING)
   - Order by start_date and employee name

5. **Add department grouping**
   - If department has sub-departments, consider grouping
   - Include team/section information if available
   - Group leave entries by team within department

6. **Calculate department statistics**
   - Total employees in department
   - Employees on leave in date range
   - Leave coverage (% of department on leave per day)
   - Peak leave days (days with most employees on leave)

7. **Add leave conflict detection**
   - Identify days with high leave count
   - Flag potential understaffing situations
   - Suggest optimal leave distribution

### Department Calendar Data Flow

```
┌──────────────────────────────────────────────────┐
│     Department Calendar Request Flow              │
├──────────────────────────────────────────────────┤
│                                                   │
│  1. Department head requests dept calendar       │
│     └─ department_id=3, date_range=(...)         │
│                                                   │
│  2. Service validates department                 │
│     ├─ Department exists                         │
│     ├─ Department belongs to tenant              │
│     └─ User has permission                       │
│                                                   │
│  3. Query all department employees               │
│     └─ SELECT * FROM employee                    │
│        WHERE department_id=3                     │
│        AND is_active=True                        │
│                                                   │
│  4. Query leave requests                         │
│     └─ Same as team calendar but for all dept   │
│                                                   │
│  5. Calculate department statistics              │
│     ├─ Total employees                           │
│     ├─ Employees on leave per day                │
│     └─ Leave coverage percentage                 │
│                                                   │
│  6. Return department calendar data              │
│                                                   │
└──────────────────────────────────────────────────┘
```

### Method Implementation

```python
def get_department_calendar(self, department_id: int, date_range: Tuple[date, date]) -> Dict:
    """
    Get leave calendar for an entire department.
    
    Args:
        department_id: ID of the department
        date_range: Tuple of (start_date, end_date)
    
    Returns:
        Dictionary containing:
        - department: Department details
        - employees: List of all department employees
        - leave_entries: List of leave requests
        - statistics: Department-wide leave statistics
        - coverage_analysis: Daily leave coverage data
    
    Example:
        {
            'department': {
                'id': 3,
                'name': 'Sales Department',
                'total_employees': 15
            },
            'employees': [...],
            'leave_entries': [...],
            'statistics': {
                'total_leaves': 8,
                'peak_leave_date': '2026-01-20',
                'peak_leave_count': 4,
                'average_daily_absences': 1.5
            },
            'coverage_analysis': {
                '2026-01-20': {
                    'employees_on_leave': 4,
                    'coverage_percentage': 73.3,
                    'critical': False
                }
            }
        }
    """
    # Validate date range
    start_date, end_date = self._get_date_range(date_range[0], date_range[1])
    
    # Get department
    try:
        from apps.core.models import Department
        department = Department.objects.get(id=department_id, tenant=self.tenant)
    except Department.DoesNotExist:
        raise ValueError(f"Department with ID {department_id} not found")
    
    # Get all department employees
    employees = Employee.objects.filter(
        tenant=self.tenant,
        department=department,
        is_active=True
    ).select_related('user', 'department').order_by('user__first_name', 'user__last_name')
    
    if not employees.exists():
        return {
            'department': {
                'id': department.id,
                'name': department.name,
                'total_employees': 0
            },
            'employees': [],
            'leave_entries': [],
            'statistics': {},
            'coverage_analysis': {}
        }
    
    employee_ids = list(employees.values_list('id', flat=True))
    
    # Get leave requests
    leave_requests = LeaveRequest.objects.filter(
        tenant=self.tenant,
        employee_id__in=employee_ids,
        start_date__lte=end_date,
        end_date__gte=start_date,
        status__in=[LEAVE_STATUS_APPROVED, LEAVE_STATUS_PENDING]
    ).select_related('employee__user', 'leave_type').order_by('start_date', 'employee__user__first_name')
    
    # Format employees
    employees_data = [
        {
            'id': emp.id,
            'name': self._format_employee_name(emp),
            'position': emp.position,
            'manager': self._format_employee_name(emp.manager) if emp.manager else None,
        }
        for emp in employees
    ]
    
    # Format leave entries (same as team calendar)
    leave_entries_data = [
        {
            'id': leave.id,
            'employee_id': leave.employee.id,
            'employee_name': self._format_employee_name(leave.employee),
            'leave_type': leave.leave_type.name,
            'leave_type_code': leave.leave_type.code,
            'start_date': leave.start_date.isoformat(),
            'end_date': leave.end_date.isoformat(),
            'total_days': leave.total_days,
            'status': leave.status,
            'color': self._get_leave_color(leave.leave_type.code, leave.status),
        }
        for leave in leave_requests
    ]
    
    # Calculate statistics and coverage
    statistics, coverage_analysis = self._calculate_department_statistics(
        employees, leave_requests, start_date, end_date
    )
    
    return {
        'department': {
            'id': department.id,
            'name': department.name,
            'total_employees': len(employees)
        },
        'employees': employees_data,
        'leave_entries': leave_entries_data,
        'statistics': statistics,
        'coverage_analysis': coverage_analysis,
        'date_range': {
            'start': start_date.isoformat(),
            'end': end_date.isoformat()
        }
    }
```

### Department Statistics Calculator

```python
def _calculate_department_statistics(self, employees, leave_requests, 
                                     start_date: date, end_date: date) -> Tuple[Dict, Dict]:
    """
    Calculate department-wide leave statistics and daily coverage analysis.
    
    Args:
        employees: QuerySet of employees
        leave_requests: QuerySet of leave requests
        start_date: Start date of analysis
        end_date: End date of analysis
    
    Returns:
        Tuple of (statistics_dict, coverage_analysis_dict)
    """
    total_employees = len(employees)
    total_leaves = len(leave_requests)
    
    # Calculate daily leave counts
    daily_leave_counts = {}
    current_date = start_date
    
    while current_date <= end_date:
        # Count employees on leave this day
        employees_on_leave = sum(
            1 for leave in leave_requests
            if leave.start_date <= current_date <= leave.end_date
            and leave.status == LEAVE_STATUS_APPROVED
        )
        
        daily_leave_counts[current_date.isoformat()] = {
            'employees_on_leave': employees_on_leave,
            'coverage_percentage': round((total_employees - employees_on_leave) / total_employees * 100, 1) if total_employees > 0 else 100,
            'critical': employees_on_leave > total_employees * 0.3  # Flag if >30% on leave
        }
        
        current_date += timedelta(days=1)
    
    # Find peak leave day
    if daily_leave_counts:
        peak_date = max(daily_leave_counts.items(), key=lambda x: x[1]['employees_on_leave'])
        peak_leave_date = peak_date[0]
        peak_leave_count = peak_date[1]['employees_on_leave']
    else:
        peak_leave_date = None
        peak_leave_count = 0
    
    # Calculate average daily absences
    total_days = (end_date - start_date).days + 1
    average_daily_absences = sum(
        day['employees_on_leave'] for day in daily_leave_counts.values()
    ) / total_days if total_days > 0 else 0
    
    statistics = {
        'total_leaves': total_leaves,
        'peak_leave_date': peak_leave_date,
        'peak_leave_count': peak_leave_count,
        'average_daily_absences': round(average_daily_absences, 1),
        'approved_leaves': sum(1 for leave in leave_requests if leave.status == LEAVE_STATUS_APPROVED),
        'pending_leaves': sum(1 for leave in leave_requests if leave.status == LEAVE_STATUS_PENDING)
    }
    
    return statistics, daily_leave_counts
```

### Department Calendar Example Response

```json
{
  "department": {
    "id": 3,
    "name": "Sales Department",
    "total_employees": 15
  },
  "employees": [
    {"id": 10, "name": "John Doe", "position": "Sales Executive", "manager": "Sarah Manager"},
    {"id": 11, "name": "Jane Smith", "position": "Senior Sales Executive", "manager": "Sarah Manager"}
  ],
  "leave_entries": [
    {
      "id": 123,
      "employee_id": 10,
      "employee_name": "John Doe",
      "leave_type": "Annual Leave",
      "leave_type_code": "ANNUAL",
      "start_date": "2026-01-15",
      "end_date": "2026-01-17",
      "total_days": 3,
      "status": "APPROVED",
      "color": "#4CAF50"
    }
  ],
  "statistics": {
    "total_leaves": 8,
    "peak_leave_date": "2026-01-20",
    "peak_leave_count": 4,
    "average_daily_absences": 1.5,
    "approved_leaves": 7,
    "pending_leaves": 1
  },
  "coverage_analysis": {
    "2026-01-20": {
      "employees_on_leave": 4,
      "coverage_percentage": 73.3,
      "critical": False
    },
    "2026-01-23": {
      "employees_on_leave": 5,
      "coverage_percentage": 66.7,
      "critical": True
    }
  },
  "date_range": {
    "start": "2026-01-01",
    "end": "2026-01-31"
  }
}
```

### Coverage Analysis Visualization

```
Department: Sales (15 employees)
Date Range: Jan 1 - Jan 31, 2026

Daily Leave Coverage:
═══════════════════════════════════════════════════

Date       | On Leave | Working | Coverage | Status
-----------|----------|---------|----------|--------
2026-01-15 |    3     |   12    |   80%    | ✓ OK
2026-01-20 |    4     |   11    |   73%    | ✓ OK
2026-01-23 |    5     |   10    |   67%    | ⚠ Critical
2026-01-27 |    2     |   13    |   87%    | ✓ OK

Peak Leave Day: Jan 23 (5 employees)
Average Daily Absences: 1.5 employees
Critical Days (>30% on leave): 1 day
```

### Expected Outcome
- Department calendar method functional
- All department employees included
- Daily coverage analysis provided
- Peak leave days identified
- Critical staffing warnings
- Statistics for department management

### Verification Checklist
- [ ] `get_department_calendar` method implemented
- [ ] Department validation working
- [ ] All department employees queried
- [ ] Leave requests filtered by department
- [ ] Statistics calculation helper added
- [ ] Coverage analysis implemented
- [ ] Peak leave day detection working
- [ ] Critical staffing flags added
- [ ] Response format matches specification

---

## Task 63: Implement Holiday Calendar

### Overview
Implement the `get_holidays` method in LeaveCalendarService. This method retrieves holidays applicable to employees based on date range, department, and location. It supports filtering holidays by scope (company-wide, department-specific, location-specific) to show only relevant holidays to each employee.

### Dependencies
- Task 59: Holiday model seeded with data
- Holiday model with scope fields

### Instructions

1. **Open calendar_service.py**
   - Navigate to `apps/leave/services/calendar_service.py`
   - Locate `get_holidays` method stub

2. **Implement method logic**
   - Accept date_range, department_id (optional), location (optional)
   - Validate date range
   - Build query for applicable holidays
   - Apply scope filters
   - Order by date
   - Format response

3. **Build holiday query**
   - Filter by tenant
   - Filter by date range
   - Filter by is_active=True
   - Apply scope logic (ALL, DEPARTMENT, LOCATION)

4. **Implement scope filtering logic**
   - If no department_id/location: return only ALL holidays
   - If department_id provided: return ALL + DEPARTMENT holidays
   - If location provided: return ALL + LOCATION holidays
   - If both provided: return ALL + DEPARTMENT + LOCATION

5. **Format holiday response**
   - Include holiday name, date, type, description
   - Include scope information
   - Add color coding for holiday types
   - Group by month (optional)

6. **Add holiday type colors**
   - Different colors for PUBLIC, BANK, COMPANY, OPTIONAL
   - Visual distinction in calendar view

7. **Handle recurring holidays**
   - Exclude recurring templates (is_recurring=True, year=null)
   - Only include specific year instances

### Holiday Query Logic

```
┌────────────────────────────────────────────────┐
│          Holiday Scope Filter Logic             │
├────────────────────────────────────────────────┤
│                                                 │
│  Input: department_id=5, location="Colombo"    │
│                                                 │
│  Query Conditions (OR logic):                  │
│  1. applies_to='ALL'                           │
│     → Company-wide holidays                    │
│                                                 │
│  2. applies_to='DEPARTMENT' AND department_id=5│
│     → Department-specific holidays             │
│                                                 │
│  3. applies_to='LOCATION' AND location='Colombo'│
│     → Location-specific holidays               │
│                                                 │
│  Result: Union of all matching holidays        │
│                                                 │
└────────────────────────────────────────────────┘
```

### Method Implementation

```python
def get_holidays(self, date_range: Tuple[date, date], department_id: Optional[int] = None,
                location: Optional[str] = None) -> List[Dict]:
    """
    Get holidays for specified date range and scope.
    
    Args:
        date_range: Tuple of (start_date, end_date)
        department_id: Optional department ID for department-specific holidays
        location: Optional location string for location-specific holidays
    
    Returns:
        List of holiday dictionaries with details
    
    Example:
        [
            {
                'id': 1,
                'name': 'Vesak Poya',
                'date': '2026-05-03',
                'holiday_type': 'PUBLIC',
                'holiday_type_display': 'Public Holiday',
                'description': 'Most important Buddhist festival...',
                'applies_to': 'ALL',
                'color': '#F44336',
                'is_poya': True
            },
            {
                'id': 15,
                'name': 'IT Department Team Building',
                'date': '2026-06-15',
                'holiday_type': 'COMPANY',
                'holiday_type_display': 'Company Holiday',
                'description': 'Annual IT team building event',
                'applies_to': 'DEPARTMENT',
                'department': 'IT Department',
                'color': '#9C27B0'
            }
        ]
    """
    # Validate date range
    start_date, end_date = self._get_date_range(date_range[0], date_range[1])
    
    # Build base query
    holidays_query = Holiday.objects.filter(
        tenant=self.tenant,
        date__gte=start_date,
        date__lte=end_date,
        is_active=True,
        is_recurring=False  # Exclude templates, only include instances
    )
    
    # Apply scope filters
    scope_conditions = Q(applies_to='ALL')  # Always include company-wide holidays
    
    if department_id:
        scope_conditions |= Q(applies_to='DEPARTMENT', department_id=department_id)
    
    if location:
        scope_conditions |= Q(applies_to='LOCATION', location=location)
    
    holidays_query = holidays_query.filter(scope_conditions)
    
    # Select related and order
    holidays = holidays_query.select_related('department').order_by('date', 'name')
    
    # Format response
    holidays_data = [
        {
            'id': holiday.id,
            'name': holiday.name,
            'date': holiday.date.isoformat(),
            'holiday_type': holiday.holiday_type,
            'holiday_type_display': holiday.get_holiday_type_display(),
            'description': holiday.description,
            'applies_to': holiday.applies_to,
            'department': holiday.department.name if holiday.department else None,
            'location': holiday.location,
            'color': self._get_holiday_color(holiday.holiday_type),
            'is_poya': 'Poya' in holiday.name,  # Flag Poya days
        }
        for holiday in holidays
    ]
    
    return holidays_data
```

### Holiday Color Coding

```python
def _get_holiday_color(self, holiday_type: str) -> str:
    """
    Get color for holiday based on type.
    
    Args:
        holiday_type: Holiday type (PUBLIC, BANK, COMPANY, OPTIONAL)
    
    Returns:
        Hex color code
    """
    holiday_colors = {
        'PUBLIC': '#F44336',    # Red - Public holidays
        'BANK': '#FF9800',      # Orange - Bank holidays
        'COMPANY': '#9C27B0',   # Purple - Company holidays
        'OPTIONAL': '#00BCD4',  # Cyan - Optional holidays
    }
    
    return holiday_colors.get(holiday_type, '#757575')  # Default gray
```

### Holiday Calendar Example Response

```json
[
  {
    "id": 1,
    "name": "Thai Pongal",
    "date": "2026-01-14",
    "holiday_type": "PUBLIC",
    "holiday_type_display": "Public Holiday",
    "description": "Tamil harvest festival. Celebrated by the Tamil community throughout Sri Lanka.",
    "applies_to": "ALL",
    "department": null,
    "location": null,
    "color": "#F44336",
    "is_poya": false
  },
  {
    "id": 2,
    "name": "Independence Day",
    "date": "2026-02-04",
    "holiday_type": "PUBLIC",
    "holiday_type_display": "Public Holiday",
    "description": "National Day commemorating independence from British rule on February 4, 1948.",
    "applies_to": "ALL",
    "department": null,
    "location": null,
    "color": "#F44336",
    "is_poya": false
  },
  {
    "id": 10,
    "name": "Vesak Full Moon Poya Day",
    "date": "2026-05-03",
    "holiday_type": "PUBLIC",
    "holiday_type_display": "Public Holiday",
    "description": "The most important Buddhist festival. Commemorates the birth, enlightenment, and death of Lord Buddha.",
    "applies_to": "ALL",
    "department": null,
    "location": null,
    "color": "#F44336",
    "is_poya": true
  },
  {
    "id": 25,
    "name": "IT Department Team Building",
    "date": "2026-06-15",
    "holiday_type": "COMPANY",
    "holiday_type_display": "Company Holiday",
    "description": "Annual IT team building event",
    "applies_to": "DEPARTMENT",
    "department": "IT Department",
    "location": null,
    "color": "#9C27B0",
    "is_poya": false
  },
  {
    "id": 30,
    "name": "Colombo Office Anniversary",
    "date": "2026-09-01",
    "holiday_type": "COMPANY",
    "holiday_type_display": "Company Holiday",
    "description": "10th anniversary of Colombo office opening",
    "applies_to": "LOCATION",
    "department": null,
    "location": "Colombo",
    "color": "#9C27B0",
    "is_poya": false
  }
]
```

### Holiday Filtering Examples

#### Example 1: All Employees (No Filters)
```python
# Get holidays for general employee (no department/location)
holidays = service.get_holidays(
    date_range=(date(2026, 1, 1), date(2026, 12, 31))
)
# Returns: Only PUBLIC, BANK, COMPANY holidays with applies_to='ALL'
```

#### Example 2: Department-Specific
```python
# Get holidays for IT department employee
holidays = service.get_holidays(
    date_range=(date(2026, 1, 1), date(2026, 12, 31)),
    department_id=5  # IT Department
)
# Returns: ALL holidays + IT department holidays
```

#### Example 3: Location-Specific
```python
# Get holidays for Colombo office employee
holidays = service.get_holidays(
    date_range=(date(2026, 1, 1), date(2026, 12, 31)),
    location="Colombo"
)
# Returns: ALL holidays + Colombo location holidays
```

#### Example 4: Department + Location
```python
# Get holidays for IT employee in Colombo office
holidays = service.get_holidays(
    date_range=(date(2026, 1, 1), date(2026, 12, 31)),
    department_id=5,
    location="Colombo"
)
# Returns: ALL + IT department + Colombo location holidays
```

### Expected Outcome
- Holiday calendar method functional
- Scope-based filtering working
- Company-wide holidays always included
- Department/location holidays conditionally included
- Color coding by holiday type
- Poya days flagged
- Sorted by date

### Verification Checklist
- [ ] `get_holidays` method implemented
- [ ] Date range validation working
- [ ] Scope filtering logic correct (ALL, DEPARTMENT, LOCATION)
- [ ] Recurring templates excluded
- [ ] Only active holidays included
- [ ] Holiday color helper added
- [ ] Poya day detection working
- [ ] Response format matches specification
- [ ] Query optimization with select_related

---

## Task 64: Implement Calendar JSON Export

### Overview
Implement the `generate_calendar_json` method in LeaveCalendarService. This method generates a FullCalendar-compatible JSON format that combines an employee's own leave requests, team members' leaves (if manager), and applicable holidays. This provides a comprehensive calendar view for the frontend.

### Dependencies
- Tasks 61-63: Team, department, holiday calendars implemented
- FullCalendar library knowledge

### Instructions

1. **Open calendar_service.py**
   - Navigate to `apps/leave/services/calendar_service.py`
   - Locate `generate_calendar_json` method stub

2. **Implement method logic**
   - Accept employee_id and date_range
   - Get employee's own leave requests
   - Get team calendar if employee is a manager
   - Get applicable holidays
   - Merge all calendar data
   - Format for FullCalendar

3. **Query employee's leave requests**
   - All statuses (not just approved)
   - Include pending, rejected for employee's view
   - Different styling for different statuses

4. **Check if employee is manager**
   - Query if employee has direct reports
   - If manager, include team calendar data
   - If not manager, skip team data

5. **Get applicable holidays**
   - Use get_holidays method
   - Pass employee's department and location
   - Include all scope-relevant holidays

6. **Format events for FullCalendar**
   - FullCalendar event structure:
     - id: unique identifier
     - title: event title
     - start: start date (ISO format)
     - end: end date (ISO format) end: end date (ISO format)
     - color/backgroundColor: event color
     - extendedProps: custom data

7. **Add event types**
   - 'my-leave': Employee's own leave
   - 'team-leave': Team member's leave
   - 'holiday': Holiday
   - Use type for frontend filtering

8. **Handle all-day events**
   - Leaves are all-day events
   - Holidays are all-day events
   - Set allDay: true in FullCalendar format

### FullCalendar Event Format

```
FullCalendar Event Structure:
═══════════════════════════════

{
  id: string,              // Unique event ID
  title: string,           // Event title (displayed)
  start: string,           // ISO date (2026-01-15)
  end: string,             // ISO date (2026-01-17)
  allDay: boolean,         // True for full-day events
  color: string,           // Background color (hex)
  textColor: string,       // Text color (optional)
  extendedProps: {         // Custom properties
    type: string,          // 'my-leave', 'team-leave', 'holiday'
    status: string,        // Leave status (if applicable)
    employeeId: number,    // Employee ID (if applicable)
    leaveType: string,     // Leave type code
    ...                    // Other custom data
  }
}
```

### Method Implementation

```python
def generate_calendar_json(self, employee_id: int, date_range: Tuple[date, date]) -> Dict:
    """
    Generate FullCalendar-compatible JSON data for an employee.
    
    Includes:
    - Employee's own leave requests (all statuses)
    - Team members' leaves (if employee is a manager)
    - Applicable holidays (based on department/location)
    
    Args:
        employee_id: ID of the employee
        date_range: Tuple of (start_date, end_date)
    
    Returns:
        Dictionary with FullCalendar events array
    
    Example:
        {
            'events': [
                {
                    'id': 'leave-123',
                    'title': 'My Annual Leave',
                    'start': '2026-01-15',
                    'end': '2026-01-18',  # Exclusive end date
                    'allDay': True,
                    'color': '#4CAF50',
                    'extendedProps': {
                        'type': 'my-leave',
                        'status': 'APPROVED',
                        'leaveType': 'ANNUAL',
                        'totalDays': 3
                    }
                }
            ]
        }
    """
    # Validate date range
    start_date, end_date = self._get_date_range(date_range[0], date_range[1])
    
    # Get employee
    try:
        employee = Employee.objects.select_related('user', 'department').get(
            id=employee_id,
            tenant=self.tenant
        )
    except Employee.DoesNotExist:
        raise ValueError(f"Employee with ID {employee_id} not found")
    
    events = []
    
    # 1. Add employee's own leave requests
    my_leaves = LeaveRequest.objects.filter(
        tenant=self.tenant,
        employee=employee,
        start_date__lte=end_date,
        end_date__gte=start_date
    ).select_related('leave_type').order_by('start_date')
    
    for leave in my_leaves:
        events.append({
            'id': f'my-leave-{leave.id}',
            'title': f'My {leave.leave_type.name}',
            'start': leave.start_date.isoformat(),
            'end': (leave.end_date + timedelta(days=1)).isoformat(),  # Exclusive end
            'allDay': True,
            'color': self._get_my_leave_color(leave.status, leave.leave_type.code),
            'extendedProps': {
                'type': 'my-leave',
                'status': leave.status,
                'leaveType': leave.leave_type.code,
                'totalDays': leave.total_days,
                'reason': leave.reason,
                'leaveId': leave.id
            }
        })
    
    # 2. Add team members' leaves (if employee is a manager)
    direct_reports_count = Employee.objects.filter(
        tenant=self.tenant,
        manager=employee,
        is_active=True
    ).count()
    
    if direct_reports_count > 0:
        team_calendar = self.get_team_calendar(employee.id, date_range)
        for leave in team_calendar['leave_entries']:
            # Only include approved leaves (pending shown differently)
            if leave['status'] == LEAVE_STATUS_APPROVED:
                events.append({
                    'id': f'team-leave-{leave["id"]}',
                    'title': f'{leave["employee_name"]} - {leave["leave_type"]}',
                    'start': leave['start_date'],
                    'end': (date.fromisoformat(leave['end_date']) + timedelta(days=1)).isoformat(),
                    'allDay': True,
                    'color': leave['color'],
                    'extendedProps': {
                        'type': 'team-leave',
                        'employeeId': leave['employee_id'],
                        'employeeName': leave['employee_name'],
                        'leaveType': leave['leave_type_code'],
                        'status': leave['status']
                    }
                })
    
    # 3. Add applicable holidays
    holidays = self.get_holidays(
        date_range,
        department_id=employee.department.id if employee.department else None,
        location=employee.office_location if hasattr(employee, 'office_location') else None
    )
    
    for holiday in holidays:
        events.append({
            'id': f'holiday-{holiday["id"]}',
            'title': holiday['name'],
            'start': holiday['date'],
            'end': (date.fromisoformat(holiday['date']) + timedelta(days=1)).isoformat(),
            'allDay': True,
            'color': holiday['color'],
            'textColor': '#FFFFFF',
            'display': 'background',  # Show as background event in FullCalendar
            'extendedProps': {
                'type': 'holiday',
                'holidayType': holiday['holiday_type'],
                'description': holiday['description'],
                'isPoya': holiday['is_poya']
            }
        })
    
    return {
        'events': events,
        'meta': {
            'employee_id': employee.id,
            'employee_name': self._format_employee_name(employee),
            'is_manager': direct_reports_count > 0,
            'date_range': {
                'start': start_date.isoformat(),
                'end': end_date.isoformat()
            }
        }
    }
```

### Color Coding for My Leaves

```python
def _get_my_leave_color(self, status: str, leave_type_code: str) -> str:
    """
    Get color for employee's own leave based on status.
    
    Args:
        status: Leave request status
        leave_type_code: Leave type code
    
    Returns:
        Hex color code
    """
    # Base colors by leave type
    base_colors = {
        'ANNUAL': '#4CAF50',
        'SICK': '#F44336',
        'CASUAL': '#2196F3',
        'MATERNITY': '#E91E63',
        'PATERNITY': '#9C27B0',
        'UNPAID': '#FF9800',
        'COMPENSATORY': '#00BCD4',
    }
    
    base_color = base_colors.get(leave_type_code, '#757575')
    
    # Modify based on status
    if status == 'APPROVED':
        return base_color  # Full color
    elif status == 'PENDING':
        return base_color + '80'  # 50% transparency
    elif status == 'REJECTED':
        return '#E0E0E0'  # Gray for rejected
    else:
        return '#BDBDBD'  # Light gray for draft
```

### FullCalendar JSON Example

```json
{
  "events": [
    {
      "id": "my-leave-123",
      "title": "My Annual Leave",
      "start": "2026-01-15",
      "end": "2026-01-18",
      "allDay": true,
      "color": "#4CAF50",
      "extendedProps": {
        "type": "my-leave",
        "status": "APPROVED",
        "leaveType": "ANNUAL",
        "totalDays": 3,
        "reason": "Family vacation",
        "leaveId": 123
      }
    },
    {
      "id": "team-leave-124",
      "title": "John Doe - Sick Leave",
      "start": "2026-01-20",
      "end": "2026-01-22",
      "allDay": true,
      "color": "#F44336",
      "extendedProps": {
        "type": "team-leave",
        "employeeId": 10,
        "employeeName": "John Doe",
        "leaveType": "SICK",
        "status": "APPROVED"
      }
    },
    {
      "id": "holiday-1",
      "title": "Thai Pongal",
      "start": "2026-01-14",
      "end": "2026-01-15",
      "allDay": true,
      "color": "#F44336",
      "textColor": "#FFFFFF",
      "display": "background",
      "extendedProps": {
        "type": "holiday",
        "holidayType": "PUBLIC",
        "description": "Tamil harvest festival...",
        "isPoya": false
      }
    }
  ],
  "meta": {
    "employee_id": 5,
    "employee_name": "Jane Smith",
    "is_manager": true,
    "date_range": {
      "start": "2026-01-01",
      "end": "2026-01-31"
    }
  }
}
```

### Frontend Integration Example

```javascript
// Initialize FullCalendar with API data
document.addEventListener('DOMContentLoaded', function() {
  const calendarEl = document.getElementById('calendar');
  
  const calendar = new FullCalendar.Calendar(calendarEl, {
    initialView: 'dayGridMonth',
    events: async function(info, successCallback, failureCallback) {
      try {
        const response = await fetch(
          `/api/leave/calendar-json/?employee=${employeeId}&start=${info.startStr}&end=${info.endStr}`
        );
        const data = await response.json();
        successCallback(data.events);
      } catch (error) {
        failureCallback(error);
      }
    },
    eventClick: function(info) {
      const props = info.event.extendedProps;
      
      if (props.type === 'my-leave') {
        // Show leave details modal
        showLeaveDetails(props.leaveId);
      } else if (props.type === 'team-leave') {
        // Show team member leave info
        showTeamLeaveInfo(props.employeeId, info.event.title);
      } else if (props.type === 'holiday') {
        // Show holiday description
        showHolidayInfo(info.event.title, props.description);
      }
    },
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,dayGridWeek,listWeek'
    }
  });
  
  calendar.render();
});
```

### Expected Outcome
- FullCalendar-compatible JSON generated
- Employee's own leaves included (all statuses)
- Team leaves included (if manager)
- Holidays included (scope-aware)
- Proper event formatting
- Color coding by type and status
- Custom properties for frontend logic

### Verification Checklist
- [ ] `generate_calendar_json` method implemented
- [ ] Employee's own leaves queried
- [ ] Manager check working (direct reports)
- [ ] Team leaves included for managers
- [ ] Holidays queried with scope
- [ ] FullCalendar event format correct
- [ ] Exclusive end dates handled (end + 1 day)
- [ ] allDay property set to true
- [ ] Color coding helpers used
- [ ] Extended properties included
- [ ] Meta information added

---

## Task 65: Calculate Working Days

### Overview
Implement the `calculate_working_days` method in LeaveCalendarService. This critical method calculates the actual working days between two dates by excluding weekends and applicable holidays. It's essential for accurate leave balance calculations and ensuring employees aren't charged leave days for non-working days.

### Dependencies
- Task 63: Holiday calendar implemented
- Weekend configuration available

### Instructions

1. **Open calendar_service.py**
   - Navigate to `apps/leave/services/calendar_service.py`
   - Locate `calculate_working_days` method stub

2. **Implement method logic**
   - Accept start_date, end_date, employee_id
   - Validate dates (start <= end)
   - Get employee for department/location context
   - Count total calendar days
   - Identify weekends in range
   - Get holidays in range for employee
   - Calculate: total_days - weekends - holidays

3. **Define weekend configuration**
   - Default: Saturday and Sunday
   - Configurable per tenant (future: Friday/Saturday for Middle East)
   - Use constant or tenant setting

4. **Create helper: _get_weekends_in_range**
   - Count weekend days between dates
   - Check each day if it's Saturday or Sunday
   - Return count of weekend days

5. **Create helper: _get_holidays_for_employee**
   - Use get_holidays method
   - Pass employee's department and location
   - Filter to date range
   - Return list of holiday dates

6. **Handle overlaps**
   - If holiday falls on weekend, don't double-count
   - Holiday on weekend = still 1 non-working day (not 2)

7. **Add validation**
   - Start date must be <= end date
   - Return 0 for same-day range
   - Handle edge cases

8. **Return detailed result**
   - Total calendar days
   - Weekend days count
   - Holiday days count
   - Final working days count
   - List of excluded dates for transparency

### Working Days Calculation Logic

```
┌──────────────────────────────────────────────────┐
│     Working Days Calculation Process              │
├──────────────────────────────────────────────────┤
│                                                   │
│  Input:                                           │
│  ├─ start_date: 2026-01-13 (Monday)              │
│  ├─ end_date: 2026-01-17 (Friday)                │
│  └─ employee_id: 5                               │
│                                                   │
│  Step 1: Count total calendar days               │
│  └─ (2026-01-17 - 2026-01-13) + 1 = 5 days      │
│                                                   │
│  Step 2: Identify weekends                       │
│  └─ Check each day: Mon, Tue, Wed, Thu, Fri     │
│     Result: 0 weekend days                       │
│                                                   │
│  Step 3: Get applicable holidays                 │
│  └─ Query holidays for employee's scope          │
│     Found: Thai Pongal (Jan 14)                  │
│     Result: 1 holiday                            │
│                                                   │
│  Step 4: Calculate working days                  │
│  └─ 5 (total) - 0 (weekends) - 1 (holiday) = 4  │
│                                                   │
│  Output: 4 working days                          │
│                                                   │
└──────────────────────────────────────────────────┘
```

### Method Implementation

```python
def calculate_working_days(self, start_date: date, end_date: date, 
                          employee_id: int) -> int:
    """
    Calculate working days between two dates, excluding weekends and holidays.
    
    Args:
        start_date: Start date (inclusive)
        end_date: End date (inclusive)
        employee_id: Employee ID for holiday scope
    
    Returns:
        Number of working days
    
    Raises:
        ValueError: If start_date > end_date
    
    Example:
        # Jan 13-17, 2026 (Mon-Fri with Thai Pongal on Jan 14)
        working_days = service.calculate_working_days(
            date(2026, 1, 13),
            date(2026, 1, 17),
            employee_id=5
        )
        # Returns: 4 (5 days - 0 weekends - 1 holiday)
    """
    # Validate dates
    if end_date < start_date:
        raise ValueError("End date must be on or after start date")
    
    # Get employee for scope context
    try:
        employee = Employee.objects.select_related('department').get(
            id=employee_id,
            tenant=self.tenant
        )
    except Employee.DoesNotExist:
        raise ValueError(f"Employee with ID {employee_id} not found")
    
    # Calculate total calendar days (inclusive)
    total_days = (end_date - start_date).days + 1
    
    # Get weekend days in range
    weekend_days = self._get_weekends_in_range(start_date, end_date)
    
    # Get holidays for employee in range
    holidays = self.get_holidays(
        date_range=(start_date, end_date),
        department_id=employee.department.id if employee.department else None,
        location=employee.office_location if hasattr(employee, 'office_location') else None
    )
    
    # Convert holiday dates to set for efficient lookup
    holiday_dates = {date.fromisoformat(h['date']) for h in holidays}
    
    # Count holidays that are NOT on weekends (to avoid double-counting)
    holidays_not_on_weekend = 0
    for holiday_date in holiday_dates:
        if not self._is_weekend(holiday_date):
            holidays_not_on_weekend += 1
    
    # Calculate working days
    working_days = total_days - weekend_days - holidays_not_on_weekend
    
    return max(working_days, 0)  # Ensure non-negative
```

### Helper Methods

```python
def _get_weekends_in_range(self, start_date: date, end_date: date) -> int:
    """
    Count weekend days between start and end dates (inclusive).
    
    Args:
        start_date: Start date
        end_date: End date
    
    Returns:
        Number of weekend days
    """
    weekend_count = 0
    current_date = start_date
    
    while current_date <= end_date:
        if self._is_weekend(current_date):
            weekend_count += 1
        current_date += timedelta(days=1)
    
    return weekend_count


def _is_weekend(self, check_date: date) -> bool:
    """
    Check if a date is a weekend.
    
    Args:
        check_date: Date to check
    
    Returns:
        True if weekend, False otherwise
    
    Note:
        weekday() returns 0=Monday, 6=Sunday
        Default weekend: Saturday (5) and Sunday (6)
    """
    # Default: Saturday and Sunday
    # Future: Make configurable per tenant (e.g., Friday/Saturday for Middle East)
    return check_date.weekday() in [5, 6]  # Saturday, Sunday


def _get_holidays_for_employee(self, employee, start_date: date, end_date: date) -> List[date]:
    """
    Get list of holiday dates applicable to an employee.
    
    Args:
        employee: Employee instance
        start_date: Start date
        end_date: End date
    
    Returns:
        List of holiday date objects
    """
    holidays = self.get_holidays(
        date_range=(start_date, end_date),
        department_id=employee.department.id if employee.department else None,
        location=employee.office_location if hasattr(employee, 'office_location') else None
    )
    
    return [date.fromisoformat(h['date']) for h in holidays]
```

### Working Days Calculation Examples

#### Example 1: Regular Week (No Holidays)
```
Date Range: Monday, Jan 6 - Friday, Jan 10, 2026
Total Days: 5
Weekends: 0
Holidays: 0
Working Days: 5
```

#### Example 2: Week with Weekend
```
Date Range: Friday, Jan 9 - Tuesday, Jan 13, 2026
Total Days: 5
Weekends: 2 (Saturday 10, Sunday 11)
Holidays: 0
Working Days: 3 (Fri, Mon, Tue)
```

#### Example 3: Week with Holiday
```
Date Range: Monday, Jan 13 - Friday, Jan 17, 2026
Total Days: 5
Weekends: 0
Holidays: 1 (Thai Pongal - Wednesday, Jan 14)
Working Days: 4
```

#### Example 4: Week with Weekend and Holiday
```
Date Range: Monday, Feb 2 - Friday, Feb 6, 2026
Total Days: 5
Weekends: 0
Holidays: 1 (Independence Day - Wednesday, Feb 4)
Working Days: 4
```

#### Example 5: Holiday on Weekend
```
Date Range: Thursday, Dec 24 - Monday, Dec 28, 2026
Total Days: 5
Weekends: 2 (Saturday 26, Sunday 27)
Holidays: 1 (Christmas - Friday, Dec 25)
Working Days: 2 (Thursday 24, Monday 28)

Note: If Christmas falls on a Saturday:
Total Days: 5
Weekends: 2 (including Christmas)
Holidays on weekdays: 0
Working Days: 3
```

### Detailed Calculation Example

```python
# Example: Calculate leave days for Jan 13-17, 2026

start = date(2026, 1, 13)  # Monday
end = date(2026, 1, 17)    # Friday

# Day-by-day breakdown:
# Jan 13 (Mon) - Working day
# Jan 14 (Tue) - Holiday (Thai Pongal)
# Jan 15 (Wed) - Working day
# Jan 16 (Thu) - Working day
# Jan 17 (Fri) - Working day

# Calculation:
total_days = 5
weekends = 0
holidays = 1 (Thai Pongal on Jan 14)
working_days = 5 - 0 - 1 = 4

# Employee should be charged 4 days of leave, not 5
```

### Advanced: Weekend Configuration

```python
# Future enhancement: Tenant-specific weekend configuration

class TenantSettings(models.Model):
    tenant = models.OneToOneField(Tenant, on_delete=models.CASCADE)
    weekend_days = models.JSONField(default=list)  # [5, 6] for Sat/Sun
    # [4, 5] for Fri/Sat (Middle East)
    # [6] for Sunday only (some countries)


def _is_weekend(self, check_date: date) -> bool:
    """Check if date is weekend based on tenant configuration."""
    # Get tenant weekend configuration
    weekend_days = getattr(self.tenant, 'weekend_days', [5, 6])
    return check_date.weekday() in weekend_days
```

### Expected Outcome
- Accurate working days calculation
- Weekends excluded
- Holidays excluded (scope-aware)
- No double-counting (holiday on weekend)
- Validation for invalid date ranges
- Helper methods for reusability

### Verification Checklist
- [ ] `calculate_working_days` method implemented
- [ ] Date validation working
- [ ] Employee query for scope context
- [ ] Total calendar days calculated correctly
- [ ] `_get_weekends_in_range` helper implemented
- [ ] `_is_weekend` helper implemented
- [ ] Holidays queried for employee scope
- [ ] Holiday-weekend overlap handled
- [ ] Non-negative result ensured
- [ ] Edge cases tested (same day, one day, etc.)

---

## Task 66: Auto-Adjust Leave Days

### Overview
Implement the `auto_adjust_leave_days` method in LeaveCalendarService. This method automatically calculates the correct number of leave days when an employee selects a date range, excluding weekends and holidays. It provides real-time feedback to employees during leave request creation, showing exactly how many leave days will be deducted from their balance.

### Dependencies
- Task 65: Calculate working days implemented

### Instructions

1. **Open calendar_service.py**
   - Navigate to `apps/leave/services/calendar_service.py`
   - Locate `auto_adjust_leave_days` method stub

2. **Implement method logic**
   - Accept leave_request_data (dict with start_date, end_date, employee_id)
   - Validate input data
   - Calculate calendar days
   - Calculate working days using Task 65 method
   - Identify excluded days (weekends and holidays)
   - Build detailed breakdown
   - Return adjusted data with explanations

3. **Input validation**
   - Ensure start_date and end_date are provided
   - Ensure employee_id is provided
   - Parse dates if strings
   - Validate date range

4. **Calculate breakdowns**
   - Total calendar days
   - Weekend days (with dates)
   - Holiday days (with names and dates)
   - Final working days

5. **Build exclusion details**
   - List all excluded dates with reasons
   - Format: {"date": "2026-01-14", "reason": "Holiday - Thai Pongal"}
   - Include weekends: {"date": "2026-01-18", "reason": "Weekend - Saturday"}

6. **Return comprehensive data**
   - Original input dates
   - Calendar days
   - Working days
   - Excluded weekends (count and list)
   - Excluded holidays (count and list)
   - Detailed breakdown for UI display
   - Warnings if applicable

7. **Add warnings**
   - Warn if leave spans multiple weeks
   - Warn if includes public holidays
   - Warn if high leave count for short range

### Auto-Adjust Data Flow

```
┌────────────────────────────────────────────────────┐
│       Auto-Adjust Leave Days Flow                   │
├────────────────────────────────────────────────────┤
│                                                     │
│  1. Employee selects dates in UI                   │
│     ├─ Start: 2026-01-13 (Monday)                  │
│     └─ End: 2026-01-19 (Sunday)                    │
│                                                     │
│  2. Frontend calls auto-adjust API                 │
│     └─ POST /api/leave/auto-adjust/                │
│        {start_date, end_date, employee_id}         │
│                                                     │
│  3. Service calculates breakdown                   │
│     ├─ Calendar days: 7                            │
│     ├─ Weekends: 2 (Jan 18, 19)                    │
│     ├─ Holidays: 1 (Jan 14 - Thai Pongal)          │
│     └─ Working days: 4                             │
│                                                     │
│  4. Service returns detailed response              │
│     └─ Includes all calculations and exclusions    │
│                                                     │
│  5. Frontend displays breakdown                    │
│     ├─ "You selected 7 calendar days"              │
│     ├─ "Excluding 2 weekends and 1 holiday"        │
│     └─ "This leave request will deduct 4 days"     │
│                                                     │
│  6. Employee confirms or adjusts selection         │
│                                                     │
└────────────────────────────────────────────────────┘
```

### Method Implementation

```python
def auto_adjust_leave_days(self, leave_request_data: Dict) -> Dict:
    """
    Automatically adjust leave days based on weekends and holidays.
    
    Calculates the actual working days for a leave request by excluding
    weekends and applicable holidays. Returns detailed breakdown for
    transparent display to the employee.
    
    Args:
        leave_request_data: Dictionary containing:
            - start_date: Start date (date object or ISO string)
            - end_date: End date (date object or ISO string)
            - employee_id: Employee ID
    
    Returns:
        Dictionary containing:
            - start_date: Parsed start date (ISO string)
            - end_date: Parsed end date (ISO string)
            - calendar_days: Total calendar days
            - working_days: Actual working days (adjusted)
            - excluded_weekends: List of weekend dates
            - excluded_holidays: List of holiday details
            - breakdown: Human-readable breakdown
            - warnings: List of warnings (if any)
    
    Example:
        Input:
        {
            'start_date': '2026-01-13',
            'end_date': '2026-01-19',
            'employee_id': 5
        }
        
        Output:
        {
            'start_date': '2026-01-13',
            'end_date': '2026-01-19',
            'calendar_days': 7,
            'working_days': 4,
            'excluded_weekends': [
                {'date': '2026-01-18', 'day': 'Saturday'},
                {'date': '2026-01-19', 'day': 'Sunday'}
            ],
            'excluded_holidays': [
                {
                    'date': '2026-01-14',
                    'name': 'Thai Pongal',
                    'type': 'PUBLIC'
                }
            ],
            'breakdown': 'Leave request: 7 calendar days - 2 weekends - 1 holiday = 4 working days',
            'warnings': []
        }
    """
    # Validate input
    if 'start_date' not in leave_request_data or 'end_date' not in leave_request_data:
        raise ValueError("start_date and end_date are required")
    if 'employee_id' not in leave_request_data:
        raise ValueError("employee_id is required")
    
    # Parse dates
    start_date = leave_request_data['start_date']
    end_date = leave_request_data['end_date']
    
    if isinstance(start_date, str):
        start_date = date.fromisoformat(start_date)
    if isinstance(end_date, str):
        end_date = date.fromisoformat(end_date)
    
    employee_id = leave_request_data['employee_id']
    
    # Validate date range
    if end_date < start_date:
        raise ValueError("End date must be on or after start date")
    
    # Get employee
    try:
        employee = Employee.objects.select_related('department').get(
            id=employee_id,
            tenant=self.tenant
        )
    except Employee.DoesNotExist:
        raise ValueError(f"Employee with ID {employee_id} not found")
    
    # Calculate calendar days
    calendar_days = (end_date - start_date).days + 1
    
    # Get weekends in range
    excluded_weekends = []
    current_date = start_date
    while current_date <= end_date:
        if self._is_weekend(current_date):
            excluded_weekends.append({
                'date': current_date.isoformat(),
                'day': current_date.strftime('%A')  # Day name (Saturday, Sunday)
            })
        current_date += timedelta(days=1)
    
    # Get holidays in range
    holidays = self.get_holidays(
        date_range=(start_date, end_date),
        department_id=employee.department.id if employee.department else None,
        location=employee.office_location if hasattr(employee, 'office_location') else None
    )
    
    # Filter out holidays that fall on weekends (already counted)
    weekend_dates = {w['date'] for w in excluded_weekends}
    excluded_holidays = [
        {
            'date': h['date'],
            'name': h['name'],
            'type': h['holiday_type'],
            'is_poya': h['is_poya']
        }
        for h in holidays
        if h['date'] not in weekend_dates
    ]
    
    # Calculate working days
    working_days = self.calculate_working_days(start_date, end_date, employee_id)
    
    # Build breakdown message
    breakdown = (
        f"Leave request: {calendar_days} calendar days "
        f"- {len(excluded_weekends)} weekends "
        f"- {len(excluded_holidays)} holidays "
        f"= {working_days} working days"
    )
    
    # Generate warnings
    warnings = []
    
    if calendar_days > 10:
        warnings.append("This is an extended leave (more than 10 days). Please ensure proper handover.")
    
    if len(excluded_holidays) > 0:
        holiday_names = ', '.join([h['name'] for h in excluded_holidays])
        warnings.append(f"Your leave includes public holidays: {holiday_names}. These days are automatically excluded.")
    
    if working_days == 0:
        warnings.append("The selected date range contains only weekends and holidays. No leave days will be deducted.")
    
    # Return comprehensive data
    return {
        'start_date': start_date.isoformat(),
        'end_date': end_date.isoformat(),
        'calendar_days': calendar_days,
        'working_days': working_days,
        'excluded_weekends': excluded_weekends,
        'excluded_holidays': excluded_holidays,
        'breakdown': breakdown,
        'warnings': warnings,
        'employee': {
            'id': employee.id,
            'name': self._format_employee_name(employee),
            'department': employee.department.name if employee.department else None
        }
    }
```

### Auto-Adjust Response Example

```json
{
  "start_date": "2026-01-13",
  "end_date": "2026-01-19",
  "calendar_days": 7,
  "working_days": 4,
  "excluded_weekends": [
    {"date": "2026-01-18", "day": "Saturday"},
    {"date": "2026-01-19", "day": "Sunday"}
  ],
  "excluded_holidays": [
    {
      "date": "2026-01-14",
      "name": "Thai Pongal",
      "type": "PUBLIC",
      "is_poya": false
    }
  ],
  "breakdown": "Leave request: 7 calendar days - 2 weekends - 1 holiday = 4 working days",
  "warnings": [
    "Your leave includes public holidays: Thai Pongal. These days are automatically excluded."
  ],
  "employee": {
    "id": 5,
    "name": "Jane Smith",
    "department": "Sales"
  }
}
```

### Frontend Integration Example

```javascript
// Auto-adjust leave days on date selection

const startDateInput = document.getElementById('start-date');
const endDateInput = document.getElementById('end-date');
const leaveDaysDisplay = document.getElementById('leave-days-display');
const breakdownDisplay = document.getElementById('breakdown-display');

// Debounce function to avoid excessive API calls
const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// Auto-calculate on date change
const autoAdjustLeaveDays = debounce(async () => {
  const startDate = startDateInput.value;
  const endDate = endDateInput.value;
  
  if (!startDate || !endDate) return;
  
  try {
    const response = await fetch('/api/leave/auto-adjust/', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        start_date: startDate,
        end_date: endDate,
        employee_id: currentEmployeeId
      })
    });
    
    const data = await response.json();
    
    // Update UI
    leaveDaysDisplay.innerHTML = `
      <strong>${data.working_days} working days</strong>
      <small>(${data.calendar_days} calendar days selected)</small>
    `;
    
    breakdownDisplay.innerHTML = `
      <div class="breakdown">
        <p>${data.breakdown}</p>
        ${data.excluded_weekends.length > 0 ? `
          <p>Weekends excluded: ${data.excluded_weekends.map(w => w.day).join(', ')}</p>
        ` : ''}
        ${data.excluded_holidays.length > 0 ? `
          <p>Holidays excluded: ${data.excluded_holidays.map(h => h.name).join(', ')}</p>
        ` : ''}
        ${data.warnings.length > 0 ? `
          <div class="warnings">
            ${data.warnings.map(w => `<p class="warning">⚠ ${w}</p>`).join('')}
          </div>
        ` : ''}
      </div>
    `;
    
  } catch (error) {
    console.error('Error calculating leave days:', error);
  }
}, 500);  // 500ms debounce

startDateInput.addEventListener('change', autoAdjustLeaveDays);
endDateInput.addEventListener('change', autoAdjustLeaveDays);
```

### UI Display Examples

#### Simple Display
```
┌────────────────────────────────────────┐
│  Leave Request                         │
├────────────────────────────────────────┤
│  Start Date: [2026-01-13]              │
│  End Date:   [2026-01-19]              │
│                                        │
│  ✓ 4 working days will be deducted     │
│    (7 calendar days - 2 weekends       │
│     - 1 holiday)                       │
│                                        │
│  ℹ Holidays excluded: Thai Pongal      │
└────────────────────────────────────────┘
```

#### Detailed Display
```
┌────────────────────────────────────────────────────┐
│  Leave Calculation Breakdown                       │
├────────────────────────────────────────────────────┤
│  Selected: Jan 13, 2026 - Jan 19, 2026            │
│                                                    │
│  Calendar Days:      7 days                        │
│  Excluded Weekends:  2 days (Sat 18, Sun 19)      │
│  Excluded Holidays:  1 day (Thai Pongal - Jan 14) │
│  ────────────────────────────────────────          │
│  Working Days:       4 days                        │
│                                                    │
│  This leave will deduct 4 days from your balance. │
└────────────────────────────────────────────────────┘
```

### Expected Outcome
- Auto-adjust method functional
- Real-time leave day calculation
- Detailed breakdown provided
- Weekends and holidays excluded
- Warnings for important cases
- Transparent calculation for employees
- Frontend integration ready

### Verification Checklist
- [ ] `auto_adjust_leave_days` method implemented
- [ ] Input validation working
- [ ] Date parsing handles strings and date objects
- [ ] Calendar days calculated
- [ ] Weekends identified with dates and day names
- [ ] Holidays queried for employee scope
- [ ] Weekend-holiday overlap handled
- [ ] Working days calculated using Task 65 method
- [ ] Breakdown message generated
- [ ] Warnings added for relevant cases
- [ ] Response format matches specification
- [ ] Frontend integration example provided

---

## Summary

This document implemented the LeaveCalendarService with comprehensive calendar functionality:

### Completed Features
- ✅ LeaveCalendarService class with tenant-scoped operations
- ✅ Team calendar showing direct reports' leaves
- ✅ Department calendar with coverage analysis
- ✅ Holiday calendar with scope-based filtering
- ✅ FullCalendar JSON export with multiple event types
- ✅ Working days calculation excluding weekends and holidays
- ✅ Auto-adjust leave days with detailed breakdown

### Key Achievements
1. **Service Layer Pattern** - Clean separation of business logic
2. **Calendar Integration** - FullCalendar-compatible JSON format
3. **Accurate Calculations** - Weekend and holiday exclusion logic
4. **Scope Awareness** - Department and location filtering
5. **Real-time Feedback** - Auto-adjustment for leave requests
6. **Transparent Breakdowns** - Detailed explanations for employees

### Integration Points
- Frontend calendar views (FullCalendar library)
- Leave request creation form (auto-adjust)
- Manager dashboard (team calendar)
- HR dashboard (department calendar)
- Leave balance calculations (working days)

### Sri Lankan Context
- Poya day recognition and handling
- Public holiday exclusion from leave counts
- Multi-location office support (Colombo, Kandy, etc.)
- Department-specific holidays
- Weekend configuration (Saturday/Sunday default)

---

**Document Status:** ✅ Complete  
**Total Tasks:** 7  
**Total Lines:** ~1370
