# Tasks 77-83: Serializers & ViewSets

**Phase**: 06_ERP-Advanced-Modules  
**SubPhase**: 03_Attendance-System  
**Group**: F_API-Testing-Documentation  
**Tasks**: 77-83 (Serializers, ViewSets, API Endpoints)

---

## Navigation

- **Parent**: [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **Previous**: [../Group-E_Attendance-Reports-Export/02_Tasks-71-76_Report-Exports-Notifications.md](../Group-E_Attendance-Reports-Export/02_Tasks-71-76_Report-Exports-Notifications.md)
- **Next**: [02_Tasks-84-88_API-Testing-Documentation.md](02_Tasks-84-88_API-Testing-Documentation.md)

---

## Overview

This document covers the API layer implementation for the Attendance System, including DRF serializers, viewsets, and specialized endpoints for clock-in/out operations. These components expose attendance functionality through RESTful APIs with proper validation, filtering, and permission controls.

**Key Components**:
- Serializers for data validation and transformation
- ViewSets for CRUD operations on attendance entities
- Specialized views for real-time clock-in/out
- Filtering, searching, and pagination support
- Permission-based access control

**API Design Principles**:
- RESTful conventions
- Nested relationships support
- Multi-tenant data isolation
- Field-level permissions
- Comprehensive error responses

---

## Task 77: ShiftSerializer

**Purpose**: Serialize and validate Shift model data for API endpoints, supporting nested employee assignments and shift pattern details.

### Implementation Requirements

**Serializer Type**: ModelSerializer  
**Model**: Shift  
**Validation Focus**: Time ranges, break periods, employee limits, tenant isolation

### Field Configuration

| Field | Type | Required | Read-Only | Notes |
|-------|------|----------|-----------|-------|
| id | UUID | No | Yes | Auto-generated |
| tenant | Nested | No | Yes | From context |
| shift_code | String | Yes | No | Unique per tenant |
| name | String | Yes | No | Max 200 chars |
| start_time | Time | Yes | No | Format: HH:MM:SS |
| end_time | Time | Yes | No | Format: HH:MM:SS |
| grace_period_in | Integer | No | No | Minutes, default: 0 |
| grace_period_out | Integer | No | No | Minutes, default: 0 |
| break_duration | Integer | No | No | Minutes |
| is_overnight | Boolean | No | Yes | Calculated |
| working_hours | Decimal | No | Yes | Calculated |
| total_hours | Decimal | No | Yes | Includes break |
| color_code | String | No | No | Hex format |
| is_active | Boolean | No | No | Default: True |
| max_employees | Integer | No | No | Null = unlimited |
| current_employees_count | Integer | No | Yes | Calculated |
| created_at | DateTime | No | Yes | ISO 8601 |
| updated_at | DateTime | No | Yes | ISO 8601 |

### Nested Serializers

**ShiftAssignmentSerializer** (nested):
- Included when `include_assignments=true` query param
- Shows employees assigned to shift
- Fields: employee_id, employee_name, assignment_date, status

**ShiftBreakSerializer** (nested):
- Included when `include_breaks=true` query param
- Details configured break periods
- Fields: break_type, start_time, duration, is_paid

### Validation Rules

| Validation | Rule | Error Message |
|------------|------|---------------|
| Time Range | end_time > start_time (unless overnight) | "End time must be after start time for same-day shifts" |
| Grace Period | 0 <= grace_period <= 60 | "Grace period must be between 0 and 60 minutes" |
| Break Duration | break_duration < working_hours | "Break duration cannot exceed working hours" |
| Max Employees | max_employees > 0 or null | "Maximum employees must be positive or unlimited" |
| Shift Code | Unique per tenant | "Shift code already exists in this organization" |
| Color Code | Valid hex format (#RRGGBB) | "Invalid color code format" |
| Overlap Check | No overlapping shifts for same employee | "Employee has overlapping shift assignment" |

### Request Format - Create Shift

**Endpoint**: POST /api/attendance/shifts/

**Headers**:
- Authorization: Bearer {token}
- Content-Type: application/json
- X-Tenant-ID: {tenant_uuid}

**Payload**:
```
{
  "shift_code": "MORNING",
  "name": "Morning Shift",
  "start_time": "08:00:00",
  "end_time": "17:00:00",
  "grace_period_in": 15,
  "grace_period_out": 10,
  "break_duration": 60,
  "color_code": "#4CAF50",
  "is_active": true,
  "max_employees": 50
}
```

### Response Format - Success (201 Created)

```
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "tenant": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "name": "Acme Corporation"
  },
  "shift_code": "MORNING",
  "name": "Morning Shift",
  "start_time": "08:00:00",
  "end_time": "17:00:00",
  "grace_period_in": 15,
  "grace_period_out": 10,
  "break_duration": 60,
  "is_overnight": false,
  "working_hours": 8.00,
  "total_hours": 9.00,
  "color_code": "#4CAF50",
  "is_active": true,
  "max_employees": 50,
  "current_employees_count": 0,
  "created_at": "2026-01-24T10:30:00Z",
  "updated_at": "2026-01-24T10:30:00Z"
}
```

### Response Format - Validation Error (400 Bad Request)

```
{
  "status": "error",
  "code": "VALIDATION_ERROR",
  "message": "Invalid shift data provided",
  "errors": {
    "shift_code": ["Shift code already exists in this organization"],
    "grace_period_in": ["Grace period must be between 0 and 60 minutes"]
  }
}
```

### Serializer Methods

**get_is_overnight**: Calculates if shift crosses midnight  
**get_working_hours**: Computes total working hours  
**get_current_employees_count**: Counts active assignments  
**validate_time_range**: Ensures logical time boundaries  
**validate_shift_code**: Checks uniqueness within tenant

---

## Task 78: AttendanceRecordSerializer

**Purpose**: Serialize attendance records with related employee, shift, and location data, including clock-in/out timestamps and status calculations.

### Implementation Requirements

**Serializer Type**: ModelSerializer  
**Model**: AttendanceRecord  
**Validation Focus**: Clock times, status consistency, location tracking, overtime calculations

### Field Configuration

| Field | Type | Required | Read-Only | Notes |
|-------|------|----------|-----------|-------|
| id | UUID | No | Yes | Auto-generated |
| tenant | Nested | No | Yes | From context |
| employee | Nested | Yes | No | Employee details |
| shift | Nested | Yes | No | Assigned shift |
| attendance_date | Date | Yes | No | ISO format |
| clock_in_time | DateTime | No | No | ISO 8601 |
| clock_out_time | DateTime | No | No | ISO 8601 |
| clock_in_location | GeoJSON | No | No | Lat/lng coordinates |
| clock_out_location | GeoJSON | No | No | Lat/lng coordinates |
| clock_in_method | Choice | No | No | WEB/MOBILE/BIOMETRIC |
| clock_out_method | Choice | No | No | WEB/MOBILE/BIOMETRIC |
| status | Choice | No | Yes | Calculated |
| working_hours | Decimal | No | Yes | Calculated |
| break_hours | Decimal | No | Yes | From breaks |
| overtime_hours | Decimal | No | Yes | Calculated |
| late_by_minutes | Integer | No | Yes | Calculated |
| early_leave_minutes | Integer | No | Yes | Calculated |
| is_late | Boolean | No | Yes | Derived |
| is_early_leave | Boolean | No | Yes | Derived |
| notes | Text | No | No | Employee notes |
| remarks | Text | No | No | Manager remarks |
| approved_by | Nested | No | Yes | Approver details |
| approved_at | DateTime | No | Yes | Approval timestamp |
| created_at | DateTime | No | Yes | ISO 8601 |
| updated_at | DateTime | No | Yes | ISO 8601 |

### Nested Serializers

**EmployeeMinimalSerializer** (read-only):
- Fields: id, employee_code, full_name, department, profile_photo_url

**ShiftMinimalSerializer** (read-only):
- Fields: id, shift_code, name, start_time, end_time, working_hours

**AttendanceBreakSerializer** (nested, optional):
- Included when `include_breaks=true`
- Fields: break_type, start_time, end_time, duration

**AttendanceStatusHistorySerializer** (nested, optional):
- Included when `include_history=true`
- Fields: status, changed_at, changed_by, reason

### Status Choices

| Status | Description | Calculation |
|--------|-------------|-------------|
| PRESENT | Clocked in and out | Has both times |
| ABSENT | Did not clock in | No clock_in_time |
| HALF_DAY | Partial hours worked | working_hours < 4 |
| LATE | Arrived after grace period | late_by_minutes > 0 |
| ON_LEAVE | Approved leave | Leave record exists |
| HOLIDAY | Public holiday | Holiday calendar match |
| PENDING | Clocked in, not out yet | Only clock_in_time |

### Clock Method Choices

- WEB: Web portal
- MOBILE: Mobile app
- BIOMETRIC: Biometric device
- MANUAL: Manual entry by admin
- INTEGRATION: Third-party system

### Validation Rules

| Validation | Rule | Error Message |
|------------|------|---------------|
| Clock Sequence | clock_out_time > clock_in_time | "Clock-out time must be after clock-in time" |
| Same Day | Both times on same date | "Clock times must be on the same calendar day" |
| Future Time | Times <= now | "Cannot clock in/out in the future" |
| Duplicate Check | No duplicate records for same date | "Attendance already recorded for this date" |
| Shift Assignment | Employee assigned to shift on date | "Employee not assigned to this shift" |
| Location Required | Location data if geo-fencing enabled | "Location data required for clock in/out" |
| Edit Window | Can only edit within 48 hours | "Attendance record edit window expired" |

### Request Format - Create Attendance (Clock In)

**Endpoint**: POST /api/attendance/records/

**Payload**:
```
{
  "employee": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "shift": "550e8400-e29b-41d4-a716-446655440000",
  "attendance_date": "2026-01-24",
  "clock_in_time": "2026-01-24T08:15:00Z",
  "clock_in_location": {
    "type": "Point",
    "coordinates": [79.8612, 6.9271]
  },
  "clock_in_method": "MOBILE",
  "notes": "On time arrival"
}
```

### Response Format - Success (201 Created)

```
{
  "id": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
  "tenant": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "name": "Acme Corporation"
  },
  "employee": {
    "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    "employee_code": "EMP001",
    "full_name": "John Doe",
    "department": "Engineering",
    "profile_photo_url": "/media/profiles/emp001.jpg"
  },
  "shift": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "shift_code": "MORNING",
    "name": "Morning Shift",
    "start_time": "08:00:00",
    "end_time": "17:00:00",
    "working_hours": 8.00
  },
  "attendance_date": "2026-01-24",
  "clock_in_time": "2026-01-24T08:15:00Z",
  "clock_out_time": null,
  "clock_in_location": {
    "type": "Point",
    "coordinates": [79.8612, 6.9271]
  },
  "clock_out_location": null,
  "clock_in_method": "MOBILE",
  "clock_out_method": null,
  "status": "PENDING",
  "working_hours": 0.00,
  "break_hours": 0.00,
  "overtime_hours": 0.00,
  "late_by_minutes": 15,
  "early_leave_minutes": 0,
  "is_late": true,
  "is_early_leave": false,
  "notes": "On time arrival",
  "remarks": null,
  "approved_by": null,
  "approved_at": null,
  "created_at": "2026-01-24T08:15:30Z",
  "updated_at": "2026-01-24T08:15:30Z"
}
```

### Request Format - Update Attendance (Clock Out)

**Endpoint**: PATCH /api/attendance/records/{id}/

**Payload**:
```
{
  "clock_out_time": "2026-01-24T17:30:00Z",
  "clock_out_location": {
    "type": "Point",
    "coordinates": [79.8615, 6.9275]
  },
  "clock_out_method": "MOBILE"
}
```

### Response Format - Clock Out Success (200 OK)

```
{
  "id": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
  "status": "PRESENT",
  "working_hours": 8.25,
  "break_hours": 1.00,
  "overtime_hours": 0.25,
  "late_by_minutes": 15,
  "early_leave_minutes": 0,
  "is_late": true,
  "is_early_leave": false,
  "clock_out_time": "2026-01-24T17:30:00Z",
  "clock_out_location": {
    "type": "Point",
    "coordinates": [79.8615, 6.9275]
  },
  "clock_out_method": "MOBILE",
  "updated_at": "2026-01-24T17:30:15Z"
}
```

### Serializer Methods

**get_status**: Calculates current attendance status  
**get_working_hours**: Computes actual working hours  
**get_overtime_hours**: Calculates overtime beyond shift  
**get_late_by_minutes**: Minutes late after grace period  
**get_early_leave_minutes**: Minutes early before grace period  
**validate_clock_times**: Ensures logical clock sequence  
**validate_location**: Validates geo-fencing if enabled

---

## Task 79: RegularizationSerializer

**Purpose**: Serialize attendance regularization requests for correcting attendance records, handling missed clock-ins/outs, and leave adjustments.

### Implementation Requirements

**Serializer Type**: ModelSerializer  
**Model**: AttendanceRegularization  
**Validation Focus**: Reason validation, supporting documents, approval workflow, time limits

### Field Configuration

| Field | Type | Required | Read-Only | Notes |
|-------|------|----------|-----------|-------|
| id | UUID | No | Yes | Auto-generated |
| tenant | Nested | No | Yes | From context |
| attendance_record | Nested | Yes | No | Related attendance |
| employee | Nested | No | Yes | From attendance |
| request_type | Choice | Yes | No | See choices below |
| request_date | DateTime | No | Yes | Auto-set |
| requested_clock_in | DateTime | No | No | Corrected time |
| requested_clock_out | DateTime | No | No | Corrected time |
| original_clock_in | DateTime | No | Yes | From record |
| original_clock_out | DateTime | No | Yes | From record |
| reason | Text | Yes | No | Min 20 chars |
| supporting_documents | Array | No | No | File URLs |
| status | Choice | No | Yes | Workflow status |
| submitted_by | Nested | No | Yes | Request submitter |
| submitted_at | DateTime | No | Yes | Submission time |
| reviewed_by | Nested | No | Yes | Reviewer/approver |
| reviewed_at | DateTime | No | Yes | Review timestamp |
| review_comments | Text | No | No | Approver remarks |
| priority | Choice | No | No | Default: NORMAL |
| days_since_request | Integer | No | Yes | Calculated |
| is_overdue | Boolean | No | Yes | >3 days pending |
| created_at | DateTime | No | Yes | ISO 8601 |
| updated_at | DateTime | No | Yes | ISO 8601 |

### Request Type Choices

| Type | Description | Required Fields |
|------|-------------|-----------------|
| MISSING_CLOCK_IN | Forgot to clock in | requested_clock_in |
| MISSING_CLOCK_OUT | Forgot to clock out | requested_clock_out |
| BOTH_MISSING | Both times missing | Both times |
| TIME_CORRECTION | Correct wrong times | One or both times |
| LEAVE_ADJUSTMENT | Convert to leave | reason only |
| OVERTIME_CLAIM | Claim overtime hours | requested_clock_out |
| SHIFT_CHANGE | Wrong shift recorded | reason, shift_id |

### Status Choices

| Status | Description | Can Transition To |
|--------|-------------|-------------------|
| DRAFT | Being prepared | SUBMITTED, CANCELLED |
| SUBMITTED | Awaiting review | UNDER_REVIEW, CANCELLED |
| UNDER_REVIEW | Being reviewed | APPROVED, REJECTED, INFO_NEEDED |
| INFO_NEEDED | More info required | SUBMITTED, CANCELLED |
| APPROVED | Request approved | APPLIED |
| APPLIED | Changes applied | None (final) |
| REJECTED | Request rejected | None (final) |
| CANCELLED | Cancelled by employee | None (final) |

### Priority Choices

- LOW: Standard request, no urgency
- NORMAL: Default priority
- HIGH: Affects payroll/reports
- URGENT: Critical issue

### Validation Rules

| Validation | Rule | Error Message |
|------------|------|---------------|
| Time Window | Request within 7 days of attendance date | "Cannot regularize attendance older than 7 days" |
| Reason Length | Min 20 characters | "Please provide detailed reason (min 20 characters)" |
| Time Logic | Requested times logical | "Clock-out must be after clock-in" |
| Document Limit | Max 5 supporting documents | "Maximum 5 documents allowed" |
| Duplicate Check | No pending request for same record | "Pending regularization already exists" |
| Permission Check | Employee can request own records only | "Cannot request regularization for other employees" |
| Status Transition | Valid workflow transition | "Invalid status transition" |

### Request Format - Create Regularization

**Endpoint**: POST /api/attendance/regularizations/

**Payload**:
```
{
  "attendance_record": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
  "request_type": "MISSING_CLOCK_OUT",
  "requested_clock_out": "2026-01-24T17:00:00Z",
  "reason": "Device battery died before I could clock out. I left office at 5 PM as usual.",
  "priority": "NORMAL",
  "supporting_documents": [
    "/media/regularizations/battery_screenshot.jpg"
  ]
}
```

### Response Format - Success (201 Created)

```
{
  "id": "9b7f8c6d-4a2e-4f1c-b3d5-8e9f7a6b5c4d",
  "tenant": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "name": "Acme Corporation"
  },
  "attendance_record": {
    "id": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
    "attendance_date": "2026-01-24",
    "status": "PENDING"
  },
  "employee": {
    "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    "employee_code": "EMP001",
    "full_name": "John Doe"
  },
  "request_type": "MISSING_CLOCK_OUT",
  "request_date": "2026-01-24T18:30:00Z",
  "requested_clock_in": null,
  "requested_clock_out": "2026-01-24T17:00:00Z",
  "original_clock_in": "2026-01-24T08:15:00Z",
  "original_clock_out": null,
  "reason": "Device battery died before I could clock out. I left office at 5 PM as usual.",
  "supporting_documents": [
    "/media/regularizations/battery_screenshot.jpg"
  ],
  "status": "SUBMITTED",
  "submitted_by": {
    "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    "full_name": "John Doe"
  },
  "submitted_at": "2026-01-24T18:30:00Z",
  "reviewed_by": null,
  "reviewed_at": null,
  "review_comments": null,
  "priority": "NORMAL",
  "days_since_request": 0,
  "is_overdue": false,
  "created_at": "2026-01-24T18:30:00Z",
  "updated_at": "2026-01-24T18:30:00Z"
}
```

### Request Format - Approve Regularization

**Endpoint**: POST /api/attendance/regularizations/{id}/approve/

**Payload**:
```
{
  "review_comments": "Approved based on office security logs showing exit at 5:05 PM",
  "apply_changes": true
}
```

### Response Format - Approval Success (200 OK)

```
{
  "id": "9b7f8c6d-4a2e-4f1c-b3d5-8e9f7a6b5c4d",
  "status": "APPLIED",
  "reviewed_by": {
    "id": "b2c3d4e5-f6a7-8901-bcde-f12345678901",
    "full_name": "Jane Manager",
    "position": "HR Manager"
  },
  "reviewed_at": "2026-01-24T20:15:00Z",
  "review_comments": "Approved based on office security logs showing exit at 5:05 PM",
  "updated_at": "2026-01-24T20:15:00Z",
  "attendance_record": {
    "id": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
    "status": "PRESENT",
    "clock_out_time": "2026-01-24T17:00:00Z",
    "working_hours": 8.00
  }
}
```

### Request Format - Reject Regularization

**Endpoint**: POST /api/attendance/regularizations/{id}/reject/

**Payload**:
```
{
  "review_comments": "Security logs show exit at 4:30 PM, not 5:00 PM. Please resubmit with correct time."
}
```

### Serializer Methods

**get_days_since_request**: Days elapsed since submission  
**get_is_overdue**: Check if pending >3 days  
**validate_time_window**: Ensure within 7-day limit  
**validate_status_transition**: Check valid workflow  
**validate_permissions**: Verify employee can request

---

## Task 80: ShiftViewSet

**Purpose**: REST API ViewSet for shift management with CRUD operations, filtering, search, and specialized actions for shift assignments.

### Implementation Requirements

**ViewSet Type**: ModelViewSet  
**Serializer**: ShiftSerializer  
**Permissions**: IsAuthenticated, IsTenantMember, ShiftManagementPermission  
**Pagination**: PageNumberPagination (100 per page)

### Endpoint Structure

| Method | Endpoint | Description | Permission |
|--------|----------|-------------|------------|
| GET | /api/attendance/shifts/ | List all shifts | attendance.view_shift |
| POST | /api/attendance/shifts/ | Create new shift | attendance.add_shift |
| GET | /api/attendance/shifts/{id}/ | Retrieve shift details | attendance.view_shift |
| PUT | /api/attendance/shifts/{id}/ | Full update shift | attendance.change_shift |
| PATCH | /api/attendance/shifts/{id}/ | Partial update shift | attendance.change_shift |
| DELETE | /api/attendance/shifts/{id}/ | Soft delete shift | attendance.delete_shift |
| POST | /api/attendance/shifts/{id}/activate/ | Activate shift | attendance.change_shift |
| POST | /api/attendance/shifts/{id}/deactivate/ | Deactivate shift | attendance.change_shift |
| GET | /api/attendance/shifts/{id}/assignments/ | Get shift assignments | attendance.view_shift |
| POST | /api/attendance/shifts/{id}/assign-employees/ | Assign employees | attendance.manage_assignments |
| POST | /api/attendance/shifts/bulk-create/ | Create multiple shifts | attendance.add_shift |
| GET | /api/attendance/shifts/active/ | List active shifts only | attendance.view_shift |

### Query Parameters

| Parameter | Type | Description | Example |
|-----------|------|-------------|---------|
| search | string | Search in code/name | ?search=morning |
| is_active | boolean | Filter by active status | ?is_active=true |
| is_overnight | boolean | Filter overnight shifts | ?is_overnight=false |
| start_time__gte | time | Start time greater/equal | ?start_time__gte=08:00:00 |
| start_time__lte | time | Start time less/equal | ?start_time__lte=12:00:00 |
| working_hours__gte | decimal | Min working hours | ?working_hours__gte=8 |
| working_hours__lte | decimal | Max working hours | ?working_hours__lte=12 |
| has_space | boolean | Has capacity for more employees | ?has_space=true |
| ordering | string | Order by field | ?ordering=-created_at |
| include_assignments | boolean | Include employee assignments | ?include_assignments=true |
| include_breaks | boolean | Include break details | ?include_breaks=true |
| page | integer | Page number | ?page=2 |
| page_size | integer | Items per page | ?page_size=50 |

### Filtering Logic

**Active Shifts**: is_active=True  
**Available Capacity**: current_employees_count < max_employees  
**Time Range**: Filter by start/end time boundaries  
**Duration**: Filter by working hours range

### Request Example - List Shifts with Filters

**Endpoint**: GET /api/attendance/shifts/?is_active=true&working_hours__gte=8&ordering=start_time

**Response** (200 OK):
```
{
  "count": 3,
  "next": null,
  "previous": null,
  "results": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "shift_code": "MORNING",
      "name": "Morning Shift",
      "start_time": "08:00:00",
      "end_time": "17:00:00",
      "working_hours": 8.00,
      "is_active": true,
      "current_employees_count": 35,
      "max_employees": 50
    },
    {
      "id": "660e8400-e29b-41d4-a716-446655440111",
      "shift_code": "EVENING",
      "name": "Evening Shift",
      "start_time": "14:00:00",
      "end_time": "23:00:00",
      "working_hours": 8.00,
      "is_active": true,
      "current_employees_count": 20,
      "max_employees": 30
    }
  ]
}
```

### Custom Action - Assign Employees to Shift

**Endpoint**: POST /api/attendance/shifts/{id}/assign-employees/

**Payload**:
```
{
  "employee_ids": [
    "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    "b2c3d4e5-f6a7-8901-bcde-f12345678901"
  ],
  "start_date": "2026-02-01",
  "end_date": null,
  "days_of_week": [1, 2, 3, 4, 5],
  "notes": "Regular weekday schedule"
}
```

**Response** (200 OK):
```
{
  "message": "Successfully assigned 2 employees to shift",
  "assignments_created": 2,
  "assignments_failed": 0,
  "shift": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "name": "Morning Shift",
    "current_employees_count": 37
  },
  "assigned_employees": [
    {
      "employee_id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
      "employee_name": "John Doe",
      "status": "success"
    },
    {
      "employee_id": "b2c3d4e5-f6a7-8901-bcde-f12345678901",
      "employee_name": "Jane Smith",
      "status": "success"
    }
  ]
}
```

### Custom Action - Bulk Create Shifts

**Endpoint**: POST /api/attendance/shifts/bulk-create/

**Payload**:
```
{
  "shifts": [
    {
      "shift_code": "MORNING",
      "name": "Morning Shift",
      "start_time": "08:00:00",
      "end_time": "17:00:00"
    },
    {
      "shift_code": "EVENING",
      "name": "Evening Shift",
      "start_time": "14:00:00",
      "end_time": "23:00:00"
    }
  ]
}
```

**Response** (201 Created):
```
{
  "message": "Successfully created 2 shifts",
  "created_count": 2,
  "failed_count": 0,
  "shifts": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "shift_code": "MORNING",
      "name": "Morning Shift"
    },
    {
      "id": "660e8400-e29b-41d4-a716-446655440111",
      "shift_code": "EVENING",
      "name": "Evening Shift"
    }
  ]
}
```

### Permission Matrix

| Action | Required Permission | Additional Checks |
|--------|-------------------|-------------------|
| List/Retrieve | attendance.view_shift | Tenant isolation |
| Create | attendance.add_shift | Max shifts limit check |
| Update | attendance.change_shift | Cannot modify with assignments |
| Delete | attendance.delete_shift | Soft delete only, check dependencies |
| Assign Employees | attendance.manage_assignments | Check capacity |
| Bulk Operations | attendance.add_shift | Batch validation |

---

## Task 81: AttendanceViewSet

**Purpose**: REST API ViewSet for attendance record management with filtering by employee, date range, status, and specialized actions for reports.

### Implementation Requirements

**ViewSet Type**: ModelViewSet  
**Serializer**: AttendanceRecordSerializer  
**Permissions**: IsAuthenticated, IsTenantMember, AttendancePermission  
**Pagination**: PageNumberPagination (50 per page)

### Endpoint Structure

| Method | Endpoint | Description | Permission |
|--------|----------|-------------|------------|
| GET | /api/attendance/records/ | List attendance records | attendance.view_record |
| POST | /api/attendance/records/ | Create record (admin) | attendance.add_record |
| GET | /api/attendance/records/{id}/ | Retrieve record details | attendance.view_record |
| PUT | /api/attendance/records/{id}/ | Full update record | attendance.change_record |
| PATCH | /api/attendance/records/{id}/ | Partial update | attendance.change_record |
| DELETE | /api/attendance/records/{id}/ | Soft delete record | attendance.delete_record |
| GET | /api/attendance/records/my-attendance/ | Employee's own records | Self access |
| GET | /api/attendance/records/today/ | Today's attendance | attendance.view_record |
| GET | /api/attendance/records/summary/ | Attendance summary stats | attendance.view_statistics |
| POST | /api/attendance/records/{id}/approve/ | Approve attendance | attendance.approve_record |
| POST | /api/attendance/records/bulk-import/ | Bulk import records | attendance.add_record |
| GET | /api/attendance/records/export/ | Export to CSV/Excel | attendance.export_data |

### Query Parameters

| Parameter | Type | Description | Example |
|-----------|------|-------------|---------|
| employee | uuid | Filter by employee ID | ?employee={uuid} |
| employee_code | string | Filter by employee code | ?employee_code=EMP001 |
| shift | uuid | Filter by shift ID | ?shift={uuid} |
| date_from | date | Start date (inclusive) | ?date_from=2026-01-01 |
| date_to | date | End date (inclusive) | ?date_to=2026-01-31 |
| status | string | Filter by status | ?status=PRESENT |
| is_late | boolean | Late arrivals only | ?is_late=true |
| is_early_leave | boolean | Early leaves only | ?is_early_leave=true |
| has_overtime | boolean | Records with overtime | ?has_overtime=true |
| department | string | Filter by department | ?department=Engineering |
| search | string | Search employee name | ?search=John |
| ordering | string | Order by field | ?ordering=-attendance_date |
| include_breaks | boolean | Include break details | ?include_breaks=true |
| include_history | boolean | Include status history | ?include_history=true |
| page | integer | Page number | ?page=1 |

### Filtering Examples

**My Today's Attendance**:  
GET /api/attendance/records/my-attendance/?date_from=2026-01-24&date_to=2026-01-24

**Late Arrivals This Month**:  
GET /api/attendance/records/?is_late=true&date_from=2026-01-01&date_to=2026-01-31

**Department Attendance for Date Range**:  
GET /api/attendance/records/?department=Engineering&date_from=2026-01-15&date_to=2026-01-24

### Request Example - List Attendance Records

**Endpoint**: GET /api/attendance/records/?date_from=2026-01-24&date_to=2026-01-24&status=PRESENT

**Response** (200 OK):
```
{
  "count": 2,
  "next": null,
  "previous": null,
  "results": [
    {
      "id": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
      "employee": {
        "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
        "employee_code": "EMP001",
        "full_name": "John Doe",
        "department": "Engineering"
      },
      "shift": {
        "id": "550e8400-e29b-41d4-a716-446655440000",
        "shift_code": "MORNING",
        "name": "Morning Shift"
      },
      "attendance_date": "2026-01-24",
      "clock_in_time": "2026-01-24T08:15:00Z",
      "clock_out_time": "2026-01-24T17:30:00Z",
      "status": "PRESENT",
      "working_hours": 8.25,
      "overtime_hours": 0.25,
      "is_late": true,
      "late_by_minutes": 15
    }
  ]
}
```

### Custom Action - Today's Attendance Summary

**Endpoint**: GET /api/attendance/records/today/

**Response** (200 OK):
```
{
  "date": "2026-01-24",
  "total_employees": 100,
  "present": 85,
  "absent": 10,
  "on_leave": 5,
  "late_arrivals": 12,
  "early_leaves": 3,
  "pending_clock_out": 8,
  "attendance_percentage": 85.0,
  "by_shift": [
    {
      "shift": "Morning Shift",
      "total": 50,
      "present": 45,
      "absent": 5
    },
    {
      "shift": "Evening Shift",
      "total": 30,
      "present": 28,
      "absent": 2
    }
  ]
}
```

### Custom Action - Attendance Summary Stats

**Endpoint**: GET /api/attendance/records/summary/?date_from=2026-01-01&date_to=2026-01-31&employee={uuid}

**Response** (200 OK):
```
{
  "employee": {
    "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    "employee_code": "EMP001",
    "full_name": "John Doe"
  },
  "period": {
    "start_date": "2026-01-01",
    "end_date": "2026-01-31",
    "total_days": 31,
    "working_days": 22
  },
  "attendance_summary": {
    "present_days": 20,
    "absent_days": 1,
    "half_days": 1,
    "leave_days": 2,
    "holidays": 7,
    "attendance_percentage": 95.45
  },
  "time_summary": {
    "total_working_hours": 160.50,
    "total_overtime_hours": 5.25,
    "average_working_hours": 8.02,
    "late_arrivals": 3,
    "early_leaves": 1
  },
  "regularization_summary": {
    "total_requests": 2,
    "approved": 2,
    "pending": 0,
    "rejected": 0
  }
}
```

### Custom Action - Bulk Import

**Endpoint**: POST /api/attendance/records/bulk-import/

**Payload** (multipart/form-data):
```
file: attendance_import.csv
date_format: "YYYY-MM-DD"
time_format: "HH:MM:SS"
overwrite_existing: false
```

**CSV Format**:
```
employee_code,attendance_date,clock_in_time,clock_out_time,status
EMP001,2026-01-24,08:15:00,17:30:00,PRESENT
EMP002,2026-01-24,09:00:00,18:00:00,PRESENT
```

**Response** (200 OK):
```
{
  "message": "Bulk import completed",
  "total_rows": 100,
  "successful_imports": 95,
  "failed_imports": 5,
  "errors": [
    {
      "row": 15,
      "employee_code": "EMP999",
      "error": "Employee not found"
    },
    {
      "row": 42,
      "employee_code": "EMP025",
      "error": "Duplicate record for date"
    }
  ]
}
```

### Custom Action - Export Records

**Endpoint**: GET /api/attendance/records/export/?format=xlsx&date_from=2026-01-01&date_to=2026-01-31

**Query Parameters**:
- format: csv, xlsx, pdf
- All standard filters apply

**Response** (200 OK):
```
Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet
Content-Disposition: attachment; filename="attendance_2026-01-01_to_2026-01-31.xlsx"

[Binary file content]
```

### Permission Matrix

| Action | Required Permission | Additional Checks |
|--------|-------------------|-------------------|
| List All | attendance.view_record | Tenant isolation |
| View Own | Self | Employee can view own |
| Create | attendance.add_record | Admin only, manual entry |
| Update | attendance.change_record | Within edit window |
| Approve | attendance.approve_record | Manager level |
| Export | attendance.export_data | Department filter enforced |
| Bulk Import | attendance.add_record | Admin only |

---

## Task 82: CheckInView (Clock-In/Out API)

**Purpose**: Specialized API endpoints for real-time clock-in and clock-out operations with geo-fencing validation and device tracking.

### Implementation Requirements

**View Type**: APIView (not ViewSet)  
**Methods**: POST only  
**Permissions**: IsAuthenticated, IsTenantMember  
**Rate Limiting**: 5 requests per minute per user

### Endpoint Structure

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | /api/attendance/check-in/ | Clock in | Yes |
| POST | /api/attendance/check-out/ | Clock out | Yes |
| GET | /api/attendance/check-status/ | Check current status | Yes |
| POST | /api/attendance/check-location/ | Validate location | Yes |

### Clock-In Implementation

**Endpoint**: POST /api/attendance/check-in/

**Request Headers**:
- Authorization: Bearer {token}
- Content-Type: application/json
- X-Device-ID: {unique_device_id}
- X-Device-Type: WEB|MOBILE|BIOMETRIC
- X-App-Version: {version}

**Request Payload**:
```
{
  "shift_id": "550e8400-e29b-41d4-a716-446655440000",
  "clock_in_time": "2026-01-24T08:15:00Z",
  "location": {
    "latitude": 6.9271,
    "longitude": 79.8612,
    "accuracy": 10.5
  },
  "device_info": {
    "device_id": "device_unique_id_12345",
    "device_type": "MOBILE",
    "os": "Android",
    "os_version": "12",
    "app_version": "2.1.5"
  },
  "notes": "Morning check-in"
}
```

**Validation Checks**:

| Check | Description | Error Code |
|-------|-------------|------------|
| Existing Clock-In | No pending clock-in for today | ALREADY_CLOCKED_IN |
| Shift Assignment | Employee assigned to shift | SHIFT_NOT_ASSIGNED |
| Geo-Fencing | Location within allowed radius | LOCATION_OUT_OF_RANGE |
| Time Window | Within acceptable time range | CLOCK_IN_TOO_EARLY |
| Future Time | Not in future | FUTURE_TIME_NOT_ALLOWED |
| Device Limit | Device registered/allowed | DEVICE_NOT_AUTHORIZED |

**Success Response** (201 Created):
```
{
  "status": "success",
  "message": "Clock-in successful",
  "data": {
    "attendance_id": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
    "employee": {
      "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
      "employee_code": "EMP001",
      "full_name": "John Doe"
    },
    "shift": {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "name": "Morning Shift",
      "start_time": "08:00:00",
      "end_time": "17:00:00"
    },
    "clock_in_time": "2026-01-24T08:15:00Z",
    "is_late": true,
    "late_by_minutes": 15,
    "location_verified": true,
    "distance_from_office": 25.5,
    "attendance_date": "2026-01-24",
    "status": "PENDING"
  },
  "metadata": {
    "server_time": "2026-01-24T08:15:02Z",
    "processing_time_ms": 125
  }
}
```

**Error Response - Already Clocked In** (400 Bad Request):
```
{
  "status": "error",
  "code": "ALREADY_CLOCKED_IN",
  "message": "You have already clocked in today",
  "data": {
    "existing_attendance": {
      "id": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
      "clock_in_time": "2026-01-24T08:15:00Z",
      "shift": "Morning Shift"
    }
  }
}
```

**Error Response - Location Out of Range** (403 Forbidden):
```
{
  "status": "error",
  "code": "LOCATION_OUT_OF_RANGE",
  "message": "You are outside the allowed office area",
  "data": {
    "current_location": {
      "latitude": 6.9350,
      "longitude": 79.8700
    },
    "office_location": {
      "latitude": 6.9271,
      "longitude": 79.8612
    },
    "distance_meters": 1250.5,
    "allowed_radius_meters": 500,
    "exceeded_by_meters": 750.5
  },
  "actions": [
    {
      "action": "REQUEST_EXCEPTION",
      "label": "Request location exception",
      "endpoint": "/api/attendance/location-exception/"
    }
  ]
}
```

### Clock-Out Implementation

**Endpoint**: POST /api/attendance/check-out/

**Request Payload**:
```
{
  "attendance_id": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
  "clock_out_time": "2026-01-24T17:30:00Z",
  "location": {
    "latitude": 6.9275,
    "longitude": 79.8615,
    "accuracy": 8.2
  },
  "device_info": {
    "device_id": "device_unique_id_12345",
    "device_type": "MOBILE"
  },
  "notes": "End of day check-out"
}
```

**Validation Checks**:

| Check | Description | Error Code |
|-------|-------------|------------|
| Pending Clock-In | Has clocked in today | NO_CLOCK_IN_FOUND |
| Already Clocked Out | Not already clocked out | ALREADY_CLOCKED_OUT |
| Time Sequence | Clock-out after clock-in | INVALID_TIME_SEQUENCE |
| Minimum Hours | Worked minimum required hours | MINIMUM_HOURS_NOT_MET |
| Geo-Fencing | Location within range | LOCATION_OUT_OF_RANGE |

**Success Response** (200 OK):
```
{
  "status": "success",
  "message": "Clock-out successful",
  "data": {
    "attendance_id": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
    "employee": {
      "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
      "employee_code": "EMP001",
      "full_name": "John Doe"
    },
    "attendance_summary": {
      "clock_in_time": "2026-01-24T08:15:00Z",
      "clock_out_time": "2026-01-24T17:30:00Z",
      "total_hours": 9.25,
      "break_hours": 1.00,
      "working_hours": 8.25,
      "overtime_hours": 0.25,
      "status": "PRESENT"
    },
    "flags": {
      "is_late": true,
      "is_early_leave": false,
      "has_overtime": true
    },
    "location_verified": true,
    "distance_from_office": 30.2
  },
  "metadata": {
    "server_time": "2026-01-24T17:30:03Z",
    "processing_time_ms": 98
  }
}
```

**Error Response - No Clock-In Found** (404 Not Found):
```
{
  "status": "error",
  "code": "NO_CLOCK_IN_FOUND",
  "message": "No active clock-in found for today",
  "data": {
    "date": "2026-01-24",
    "last_attendance": {
      "date": "2026-01-23",
      "status": "PRESENT"
    }
  },
  "actions": [
    {
      "action": "REGULARIZE",
      "label": "Submit regularization request",
      "endpoint": "/api/attendance/regularizations/"
    }
  ]
}
```

### Check Status Implementation

**Endpoint**: GET /api/attendance/check-status/

**Query Parameters**:
- date: ISO date (default: today)

**Response** (200 OK):
```
{
  "status": "success",
  "data": {
    "date": "2026-01-24",
    "has_clocked_in": true,
    "has_clocked_out": false,
    "current_status": "PENDING",
    "attendance": {
      "id": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
      "clock_in_time": "2026-01-24T08:15:00Z",
      "clock_out_time": null,
      "shift": {
        "name": "Morning Shift",
        "end_time": "17:00:00"
      },
      "hours_worked_so_far": 6.5,
      "is_late": true,
      "late_by_minutes": 15
    },
    "shift_info": {
      "expected_clock_out": "2026-01-24T17:00:00Z",
      "time_until_clock_out": "2:15:00"
    }
  }
}
```

### Location Validation

**Endpoint**: POST /api/attendance/check-location/

**Request Payload**:
```
{
  "latitude": 6.9271,
  "longitude": 79.8612,
  "accuracy": 10.5
}
```

**Response** (200 OK):
```
{
  "status": "success",
  "data": {
    "location_valid": true,
    "distance_from_office": 25.5,
    "allowed_radius": 500,
    "within_range": true,
    "office_location": {
      "name": "Head Office",
      "latitude": 6.9271,
      "longitude": 79.8612
    },
    "can_clock_in": true
  }
}
```

### Geo-Fencing Configuration

**Office Location Settings**:
- Center coordinates: lat/lng
- Allowed radius: meters
- Strict mode: enforce vs. warning
- Exception requests: allowed/disallowed

**Distance Calculation**: Haversine formula for GPS coordinates

### Device Tracking

**Device Registration**:
- Unique device ID stored
- Device type tracked (WEB/MOBILE/BIOMETRIC)
- OS and version logged
- Max devices per employee configurable

**Security Features**:
- Device fingerprinting
- Anomaly detection (location jumps)
- Rate limiting per device
- Suspicious activity alerts

### Rate Limiting

**Limits**:
- 5 clock-in attempts per minute
- 5 clock-out attempts per minute
- 10 status checks per minute

**Response Headers**:
- X-RateLimit-Limit: 5
- X-RateLimit-Remaining: 3
- X-RateLimit-Reset: 1706095260

---

## Task 83: RegularizationViewSet

**Purpose**: REST API ViewSet for attendance regularization management with approval workflow, status tracking, and batch processing.

### Implementation Requirements

**ViewSet Type**: ModelViewSet  
**Serializer**: RegularizationSerializer  
**Permissions**: IsAuthenticated, IsTenantMember, RegularizationPermission  
**Pagination**: PageNumberPagination (30 per page)

### Endpoint Structure

| Method | Endpoint | Description | Permission |
|--------|----------|-------------|------------|
| GET | /api/attendance/regularizations/ | List regularizations | attendance.view_regularization |
| POST | /api/attendance/regularizations/ | Create request | attendance.add_regularization |
| GET | /api/attendance/regularizations/{id}/ | Retrieve details | attendance.view_regularization |
| PUT | /api/attendance/regularizations/{id}/ | Full update | attendance.change_regularization |
| PATCH | /api/attendance/regularizations/{id}/ | Partial update | attendance.change_regularization |
| DELETE | /api/attendance/regularizations/{id}/ | Cancel request | Self or admin |
| POST | /api/attendance/regularizations/{id}/approve/ | Approve request | attendance.approve_regularization |
| POST | /api/attendance/regularizations/{id}/reject/ | Reject request | attendance.approve_regularization |
| POST | /api/attendance/regularizations/{id}/request-info/ | Request more info | attendance.approve_regularization |
| GET | /api/attendance/regularizations/my-requests/ | Employee's requests | Self |
| GET | /api/attendance/regularizations/pending-approvals/ | Pending for approval | Manager |
| POST | /api/attendance/regularizations/bulk-approve/ | Approve multiple | attendance.approve_regularization |

### Query Parameters

| Parameter | Type | Description | Example |
|-----------|------|-------------|---------|
| employee | uuid | Filter by employee | ?employee={uuid} |
| status | string | Filter by status | ?status=PENDING |
| request_type | string | Filter by type | ?request_type=MISSING_CLOCK_OUT |
| priority | string | Filter by priority | ?priority=HIGH |
| date_from | date | Request date from | ?date_from=2026-01-01 |
| date_to | date | Request date to | ?date_to=2026-01-31 |
| attendance_date_from | date | Attendance date from | ?attendance_date_from=2026-01-15 |
| attendance_date_to | date | Attendance date to | ?attendance_date_to=2026-01-24 |
| is_overdue | boolean | Overdue requests | ?is_overdue=true |
| department | string | Filter by department | ?department=Engineering |
| search | string | Search employee/reason | ?search=battery |
| ordering | string | Order by field | ?ordering=-submitted_at |
| page | integer | Page number | ?page=1 |

### Filtering Examples

**My Pending Requests**:  
GET /api/attendance/regularizations/my-requests/?status=SUBMITTED

**Overdue Approvals**:  
GET /api/attendance/regularizations/pending-approvals/?is_overdue=true

**High Priority Requests**:  
GET /api/attendance/regularizations/?priority=HIGH&status=SUBMITTED

### Request Example - List Regularizations

**Endpoint**: GET /api/attendance/regularizations/?status=SUBMITTED&ordering=-submitted_at

**Response** (200 OK):
```
{
  "count": 5,
  "next": null,
  "previous": null,
  "results": [
    {
      "id": "9b7f8c6d-4a2e-4f1c-b3d5-8e9f7a6b5c4d",
      "employee": {
        "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
        "employee_code": "EMP001",
        "full_name": "John Doe",
        "department": "Engineering"
      },
      "attendance_record": {
        "id": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
        "attendance_date": "2026-01-24"
      },
      "request_type": "MISSING_CLOCK_OUT",
      "status": "SUBMITTED",
      "priority": "NORMAL",
      "submitted_at": "2026-01-24T18:30:00Z",
      "days_since_request": 0,
      "is_overdue": false
    }
  ]
}
```

### Custom Action - Pending Approvals

**Endpoint**: GET /api/attendance/regularizations/pending-approvals/

**Response** (200 OK):
```
{
  "count": 12,
  "summary": {
    "by_priority": {
      "URGENT": 2,
      "HIGH": 3,
      "NORMAL": 5,
      "LOW": 2
    },
    "by_type": {
      "MISSING_CLOCK_OUT": 5,
      "MISSING_CLOCK_IN": 3,
      "TIME_CORRECTION": 4
    },
    "overdue_count": 3,
    "average_pending_days": 1.5
  },
  "results": [
    {
      "id": "9b7f8c6d-4a2e-4f1c-b3d5-8e9f7a6b5c4d",
      "employee": {
        "employee_code": "EMP001",
        "full_name": "John Doe"
      },
      "request_type": "MISSING_CLOCK_OUT",
      "priority": "NORMAL",
      "days_since_request": 0,
      "attendance_date": "2026-01-24"
    }
  ]
}
```

### Custom Action - Approve Regularization

**Endpoint**: POST /api/attendance/regularizations/{id}/approve/

**Request Payload**:
```
{
  "review_comments": "Verified with security logs. Approved.",
  "apply_changes": true
}
```

**Process Flow**:
1. Validate reviewer has permission
2. Check request is in approvable state
3. Update attendance record if apply_changes=true
4. Set status to APPLIED or APPROVED
5. Record reviewer and timestamp
6. Send notification to employee
7. Trigger payroll recalculation if needed

**Response** (200 OK):
```
{
  "status": "success",
  "message": "Regularization approved and applied successfully",
  "data": {
    "regularization_id": "9b7f8c6d-4a2e-4f1c-b3d5-8e9f7a6b5c4d",
    "status": "APPLIED",
    "reviewed_by": {
      "id": "b2c3d4e5-f6a7-8901-bcde-f12345678901",
      "full_name": "Jane Manager"
    },
    "reviewed_at": "2026-01-24T20:15:00Z",
    "review_comments": "Verified with security logs. Approved.",
    "attendance_updated": true,
    "attendance_record": {
      "id": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
      "status": "PRESENT",
      "working_hours": 8.00,
      "clock_out_time": "2026-01-24T17:00:00Z"
    }
  }
}
```

### Custom Action - Reject Regularization

**Endpoint**: POST /api/attendance/regularizations/{id}/reject/

**Request Payload**:
```
{
  "review_comments": "Security logs show different exit time. Please resubmit with correct information."
}
```

**Response** (200 OK):
```
{
  "status": "success",
  "message": "Regularization rejected",
  "data": {
    "regularization_id": "9b7f8c6d-4a2e-4f1c-b3d5-8e9f7a6b5c4d",
    "status": "REJECTED",
    "reviewed_by": {
      "id": "b2c3d4e5-f6a7-8901-bcde-f12345678901",
      "full_name": "Jane Manager"
    },
    "reviewed_at": "2026-01-24T20:20:00Z",
    "review_comments": "Security logs show different exit time. Please resubmit with correct information."
  }
}
```

### Custom Action - Request More Information

**Endpoint**: POST /api/attendance/regularizations/{id}/request-info/

**Request Payload**:
```
{
  "info_needed": "Please provide security badge logs or manager confirmation of your exit time."
}
```

**Response** (200 OK):
```
{
  "status": "success",
  "message": "Information requested from employee",
  "data": {
    "regularization_id": "9b7f8c6d-4a2e-4f1c-b3d5-8e9f7a6b5c4d",
    "status": "INFO_NEEDED",
    "info_requested_by": {
      "id": "b2c3d4e5-f6a7-8901-bcde-f12345678901",
      "full_name": "Jane Manager"
    },
    "info_requested_at": "2026-01-24T20:25:00Z",
    "info_needed": "Please provide security badge logs or manager confirmation of your exit time."
  }
}
```

### Custom Action - Bulk Approve

**Endpoint**: POST /api/attendance/regularizations/bulk-approve/

**Request Payload**:
```
{
  "regularization_ids": [
    "9b7f8c6d-4a2e-4f1c-b3d5-8e9f7a6b5c4d",
    "8a6e7b5c-3b1d-4e2f-a4c6-7d8e9f6a5b4c"
  ],
  "review_comments": "Batch approval after verification",
  "apply_changes": true
}
```

**Response** (200 OK):
```
{
  "status": "success",
  "message": "Bulk approval completed",
  "summary": {
    "total_requested": 2,
    "approved": 2,
    "failed": 0
  },
  "results": [
    {
      "regularization_id": "9b7f8c6d-4a2e-4f1c-b3d5-8e9f7a6b5c4d",
      "status": "APPLIED",
      "employee": "John Doe"
    },
    {
      "regularization_id": "8a6e7b5c-3b1d-4e2f-a4c6-7d8e9f6a5b4c",
      "status": "APPLIED",
      "employee": "Jane Smith"
    }
  ]
}
```

### Workflow State Transitions

| From Status | To Status | Action | Permission Required |
|-------------|-----------|--------|---------------------|
| DRAFT | SUBMITTED | Submit | Employee (self) |
| SUBMITTED | UNDER_REVIEW | Start review | Manager |
| UNDER_REVIEW | APPROVED | Approve | Manager |
| UNDER_REVIEW | REJECTED | Reject | Manager |
| UNDER_REVIEW | INFO_NEEDED | Request info | Manager |
| INFO_NEEDED | SUBMITTED | Resubmit | Employee (self) |
| APPROVED | APPLIED | Apply changes | System/Manager |
| Any | CANCELLED | Cancel | Employee (self) or Admin |

### Permission Matrix

| Action | Required Permission | Additional Checks |
|--------|-------------------|-------------------|
| List Own | Self access | Employee sees own only |
| List All | attendance.view_regularization | Manager sees department |
| Create | attendance.add_regularization | Within 7-day window |
| Update | attendance.change_regularization | Own requests in DRAFT |
| Approve | attendance.approve_regularization | Manager level |
| Reject | attendance.approve_regularization | Manager level |
| Bulk Approve | attendance.approve_regularization | Manager level |
| Cancel | Self or admin | SUBMITTED/INFO_NEEDED only |

### Notification Triggers

| Event | Recipient | Notification Type |
|-------|-----------|-------------------|
| Request Submitted | Manager | Email + In-app |
| Request Approved | Employee | Email + In-app |
| Request Rejected | Employee | Email + In-app |
| Info Requested | Employee | Email + In-app |
| Request Overdue | Manager | Email |
| Bulk Approval Complete | All employees | In-app |

---

## API Testing Guidelines

### Authentication

All endpoints require valid JWT token in Authorization header:

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Tenant Context

Multi-tenant isolation enforced via:
- X-Tenant-ID header (required)
- Token-embedded tenant ID
- Automatic filtering in ViewSets

### Error Response Format

Standard error format across all endpoints:

```
{
  "status": "error",
  "code": "ERROR_CODE",
  "message": "Human-readable error message",
  "errors": {
    "field_name": ["Error detail 1", "Error detail 2"]
  },
  "metadata": {
    "request_id": "req_123456",
    "timestamp": "2026-01-24T10:30:00Z"
  }
}
```

### Common HTTP Status Codes

| Code | Meaning | Usage |
|------|---------|-------|
| 200 | OK | Successful GET, PATCH, PUT |
| 201 | Created | Successful POST |
| 204 | No Content | Successful DELETE |
| 400 | Bad Request | Validation errors |
| 401 | Unauthorized | Missing/invalid token |
| 403 | Forbidden | Insufficient permissions |
| 404 | Not Found | Resource doesn't exist |
| 409 | Conflict | Duplicate/constraint violation |
| 422 | Unprocessable Entity | Business logic error |
| 429 | Too Many Requests | Rate limit exceeded |
| 500 | Internal Server Error | Server error |

### Testing Checklist

**Serializer Testing**:
- [ ] Valid data creates objects
- [ ] Invalid data raises validation errors
- [ ] Required fields enforced
- [ ] Read-only fields not writable
- [ ] Nested serializers work correctly
- [ ] Custom validation methods work
- [ ] Calculated fields computed correctly

**ViewSet Testing**:
- [ ] List returns paginated results
- [ ] Create with valid data succeeds
- [ ] Retrieve returns correct object
- [ ] Update modifies object
- [ ] Delete removes/soft-deletes object
- [ ] Filtering works correctly
- [ ] Search returns relevant results
- [ ] Ordering works as expected
- [ ] Permissions enforced
- [ ] Custom actions function properly

**Clock-In/Out Testing**:
- [ ] Successful clock-in creates record
- [ ] Duplicate clock-in prevented
- [ ] Location validation works
- [ ] Clock-out updates record
- [ ] No clock-in prevents clock-out
- [ ] Time calculations accurate
- [ ] Device tracking works
- [ ] Rate limiting enforced

**Regularization Testing**:
- [ ] Request creation works
- [ ] Workflow transitions valid
- [ ] Approval applies changes
- [ ] Rejection preserves original
- [ ] Bulk operations work
- [ ] Notifications sent
- [ ] Permissions enforced

---

## Documentation Notes

**API Documentation Tools**:
- Swagger/OpenAPI auto-generated
- ReDoc for interactive docs
- Postman collection available

**Base URL**: https://api.example.com/v1

**API Versioning**: URI versioning (/v1/, /v2/)

**Rate Limits**:
- Standard: 100 requests/minute
- Check-in/out: 5 requests/minute
- Bulk operations: 10 requests/minute

**Pagination**:
- Default page size: 50
- Max page size: 100
- Response includes count, next, previous

**Date/Time Formats**:
- Dates: ISO 8601 (YYYY-MM-DD)
- Times: HH:MM:SS
- DateTimes: ISO 8601 with timezone

---

## Summary

This document covers the complete API layer for the Attendance System, including:

✅ **Task 77**: ShiftSerializer with nested data and validation  
✅ **Task 78**: AttendanceRecordSerializer with status calculations  
✅ **Task 79**: RegularizationSerializer with workflow support  
✅ **Task 80**: ShiftViewSet with CRUD and assignments  
✅ **Task 81**: AttendanceViewSet with filtering and reports  
✅ **Task 82**: CheckInView with geo-fencing and device tracking  
✅ **Task 83**: RegularizationViewSet with approval workflow

All components follow DRF best practices with proper validation, permissions, and error handling.

---

**Document Status**: Complete  
**Tasks Covered**: 77-83 (7 tasks)  
**Line Count**: ~985 lines
