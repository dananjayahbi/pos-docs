# Tasks 81-87: Serializers and ViewSets

> **Phase:** 06 - ERP Advanced Modules  
> **SubPhase:** 04 - Leave Management  
> **Group:** F - API, Testing & Documentation  
> **Document:** 01 of 02  
> **Tasks Covered:** 81, 82, 83, 84, 85, 86, 87

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **→ Next Document:** [02_Tasks-88-90_URLs-Tests-Documentation.md](02_Tasks-88-90_URLs-Tests-Documentation.md)

---

## Document Overview

This document covers the creation of Django REST Framework serializers and viewsets for the Leave Management module. These components provide RESTful API endpoints for leave types, leave balances, leave requests, and holidays, enabling frontend applications and external systems to interact with the leave management system.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 81 | Create LeaveTypeSerializer | Medium | 25 min |
| 82 | Create LeaveBalanceSerializer | Medium | 25 min |
| 83 | Create LeaveRequestSerializer | High | 30 min |
| 84 | Create HolidaySerializer | Medium | 20 min |
| 85 | Create LeaveTypeViewSet | Medium | 25 min |
| 86 | Create LeaveRequestViewSet | High | 35 min |
| 87 | Create HolidayViewSet | Medium | 25 min |

---

## Task 81: Create LeaveTypeSerializer

### Overview
Create a Django REST Framework serializer for the LeaveType model. This serializer handles serialization and deserialization of leave type data, validation of leave type configurations, and provides read-write API access for leave type management.

### Dependencies
- LeaveType model exists (`apps/leave/models/`)
- Django REST Framework installed
- Leave type constants defined

### Instructions

1. **Create serializers directory structure**
   - Navigate to `apps/leave/` directory
   - Create new directory named `serializers`
   - Create `__init__.py` in serializers directory

2. **Create leave_type_serializer.py file**
   - Create file at `apps/leave/serializers/leave_type_serializer.py`
   - Import necessary DRF components

3. **Import required modules**
   - Import serializers from rest_framework
   - Import LeaveType model
   - Import leave type constants (LEAVE_CATEGORIES, GENDER_CHOICES)
   - Import any validators needed

4. **Define LeaveTypeSerializer class**
   - Inherit from serializers.ModelSerializer
   - Add class docstring explaining purpose
   - Include API usage examples in docstring

5. **Configure Meta class**
   - Set model to LeaveType
   - Define fields list (include all relevant fields)
   - Set read_only_fields (id, created_at, updated_at, created_by)
   - Add ordering for consistent output

6. **Add computed fields**
   - Add is_active_display field (read-only string representation)
   - Add category_display field (human-readable category)
   - Add applicable_gender_display field (gender text)
   - Add usage_count field (number of times used in requests)

7. **Implement field validation**
   - Validate default_days_per_year is positive
   - Validate max_carry_forward_days doesn't exceed default days
   - Validate min_notice_days is reasonable (0-90 days)
   - Validate min_service_months is reasonable (0-60 months)
   - Ensure code is unique and uppercase

8. **Add validate method**
   - Cross-field validation logic
   - Ensure carry forward settings are consistent
   - Validate gender-specific configurations
   - Check document requirements for specific categories

9. **Add to_representation method**
   - Add computed fields to output
   - Format color field with # prefix
   - Include usage statistics if requested
   - Add tenant-specific configurations

10. **Update __init__.py**
    - Import LeaveTypeSerializer
    - Add to __all__ list

### LeaveTypeSerializer Structure

```
┌─────────────────────────────────────────────────┐
│         LeaveTypeSerializer                     │
├─────────────────────────────────────────────────┤
│ Serialized Fields:                              │
│  • id (UUID, read-only)                         │
│  • name (string, required)                      │
│  • code (string, required, unique)              │
│  • category (choice, required)                  │
│  • description (text, optional)                 │
│  • color (string, hex color)                    │
│  • default_days_per_year (decimal)              │
│  • is_paid (boolean)                            │
│  • requires_document (boolean)                  │
│  • applicable_gender (choice)                   │
│  • min_service_months (integer)                 │
│  • min_notice_days (integer)                    │
│  • max_consecutive_days (integer)               │
│  • allow_half_day (boolean)                     │
│  • carry_forward_allowed (boolean)              │
│  • max_carry_forward_days (decimal)             │
│  • carry_forward_expiry_months (integer)        │
│  • is_active (boolean)                          │
│                                                 │
│ Computed/Display Fields:                        │
│  • category_display (string)                    │
│  • applicable_gender_display (string)           │
│  • usage_count (integer)                        │
│  • is_active_display (string)                   │
└─────────────────────────────────────────────────┘
```

### Validation Rules

| Field | Validation | Error Message |
|-------|------------|---------------|
| default_days_per_year | > 0 and <= 365 | "Must be between 0 and 365 days" |
| max_carry_forward_days | <= default_days_per_year | "Cannot exceed default days per year" |
| min_notice_days | >= 0 and <= 90 | "Must be between 0 and 90 days" |
| min_service_months | >= 0 and <= 60 | "Must be between 0 and 60 months" |
| max_consecutive_days | > 0 or None | "Must be positive or unlimited" |
| code | Uppercase, 2-10 chars | "Code must be 2-10 uppercase letters" |
| color | Valid hex color | "Must be valid hex color (#RRGGBB)" |

### API Response Example

```json
{
  "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "name": "Annual Leave",
  "code": "AL",
  "category": "ANNUAL",
  "category_display": "Annual Leave",
  "description": "Paid annual leave for all employees",
  "color": "#4CAF50",
  "default_days_per_year": 14.0,
  "is_paid": true,
  "requires_document": false,
  "applicable_gender": "ALL",
  "applicable_gender_display": "All Employees",
  "min_service_months": 0,
  "min_notice_days": 3,
  "max_consecutive_days": null,
  "allow_half_day": true,
  "carry_forward_allowed": true,
  "max_carry_forward_days": 5.0,
  "carry_forward_expiry_months": 3,
  "is_active": true,
  "is_active_display": "Active",
  "usage_count": 45,
  "created_at": "2026-01-01T10:00:00Z",
  "updated_at": "2026-01-15T14:30:00Z"
}
```

### Cross-Field Validation Logic

```
Carry Forward Validation
═══════════════════════
IF carry_forward_allowed = True:
  ├─ max_carry_forward_days must be set
  ├─ max_carry_forward_days <= default_days_per_year
  └─ carry_forward_expiry_months should be set

Document Requirement Validation
══════════════════════════════
IF category IN ['MEDICAL', 'MATERNITY', 'PATERNITY']:
  └─ requires_document should typically be True

Gender-Specific Validation
═════════════════════════
IF category = 'MATERNITY':
  └─ applicable_gender must be 'FEMALE'
IF category = 'PATERNITY':
  └─ applicable_gender must be 'MALE'
```

### Expected Outcome
- Fully functional LeaveTypeSerializer
- Proper field validation
- Human-readable display fields
- Cross-field validation logic
- API-ready leave type representation

### Verification Checklist
- [ ] leave_type_serializer.py file created
- [ ] LeaveTypeSerializer class defined
- [ ] Meta class configured with all fields
- [ ] Computed display fields added
- [ ] Field validators implemented
- [ ] validate method for cross-field validation
- [ ] to_representation method customized
- [ ] Code uppercase validation
- [ ] Carry forward logic validation
- [ ] Gender-specific validation
- [ ] Serializer imported in __init__.py

---

## Task 82: Create LeaveBalanceSerializer

### Overview
Create a serializer for the LeaveBalance model. This serializer provides read-only access to employee leave balances, including opening balance, used days, pending days, and available days. It includes nested employee and leave type information for comprehensive balance reporting.

### Dependencies
- LeaveBalance model exists
- LeaveType model exists
- Employee model exists
- Task 81: Create LeaveTypeSerializer

### Instructions

1. **Create balance_serializer.py file**
   - Create file at `apps/leave/serializers/balance_serializer.py`
   - Import necessary DRF components

2. **Import required modules**
   - Import serializers from rest_framework
   - Import LeaveBalance model
   - Import Employee model
   - Import LeaveTypeSerializer (for nesting)

3. **Create EmployeeMinimalSerializer**
   - Lightweight serializer for employee info
   - Include only: id, employee_id, full_name, department
   - Used in nested representation

4. **Define LeaveBalanceSerializer class**
   - Inherit from serializers.ModelSerializer
   - Add class docstring
   - Note that this is primarily read-only

5. **Configure Meta class**
   - Set model to LeaveBalance
   - Define fields list
   - All fields are read-only
   - Add ordering by leave type name

6. **Add nested serializers**
   - employee field using EmployeeMinimalSerializer
   - leave_type field using LeaveTypeSerializer
   - Both should be read-only nested serializers

7. **Add computed balance fields**
   - available_days (opening + allocated - used - pending)
   - utilization_percentage (used / allocated * 100)
   - balance_status (CRITICAL, LOW, HEALTHY, GOOD)
   - expiry_date (if carry forward has expiry)

8. **Add to_representation method**
   - Calculate available_days
   - Calculate utilization_percentage
   - Determine balance_status based on available days
   - Format dates properly
   - Include year information

9. **Create BalanceStatusSerializer**
   - Separate serializer for balance status indicators
   - Shows warning levels and recommendations
   - Used in dashboard views

10. **Update __init__.py**
    - Import LeaveBalanceSerializer
    - Import BalanceStatusSerializer
    - Add to __all__ list

### LeaveBalanceSerializer Structure

```
┌─────────────────────────────────────────────────┐
│         LeaveBalanceSerializer                  │
├─────────────────────────────────────────────────┤
│ Core Fields (Read-Only):                        │
│  • id (UUID)                                    │
│  • year (integer)                               │
│  • opening_balance (decimal)                    │
│  • allocated_days (decimal)                     │
│  • used_days (decimal)                          │
│  • pending_days (decimal)                       │
│  • carried_from_previous (decimal)              │
│  • carry_forward_expiry_date (date)             │
│                                                 │
│ Nested Objects:                                 │
│  • employee (EmployeeMinimalSerializer)         │
│  • leave_type (LeaveTypeSerializer)             │
│                                                 │
│ Computed Fields:                                │
│  • available_days (decimal)                     │
│  • utilization_percentage (decimal)             │
│  • balance_status (string)                      │
│  • status_color (string)                        │
│  • days_until_expiry (integer)                  │
└─────────────────────────────────────────────────┘
```

### Balance Status Logic

```
Balance Status Determination
═══════════════════════════
available_days / opening_balance * 100 = percentage

IF percentage >= 75%:
  └─ Status: GOOD (green, #4CAF50)
ELIF percentage >= 50%:
  └─ Status: HEALTHY (blue, #2196F3)
ELIF percentage >= 25%:
  └─ Status: LOW (orange, #FF9800)
ELSE:
  └─ Status: CRITICAL (red, #F44336)
```

### API Response Example

```json
{
  "id": "b2c3d4e5-f6a7-8901-bcde-f12345678901",
  "employee": {
    "id": "c3d4e5f6-a7b8-9012-cdef-123456789012",
    "employee_id": "EMP-0001",
    "full_name": "Nimal Perera",
    "department": "IT Department"
  },
  "leave_type": {
    "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    "name": "Annual Leave",
    "code": "AL",
    "color": "#4CAF50",
    "allow_half_day": true
  },
  "year": 2026,
  "opening_balance": 14.0,
  "allocated_days": 0.0,
  "used_days": 5.0,
  "pending_days": 2.0,
  "carried_from_previous": 0.0,
  "available_days": 7.0,
  "utilization_percentage": 35.71,
  "balance_status": "HEALTHY",
  "status_color": "#2196F3",
  "carry_forward_expiry_date": null,
  "days_until_expiry": null,
  "created_at": "2026-01-01T00:00:00Z",
  "updated_at": "2026-01-20T10:30:00Z"
}
```

### Balance Summary Response

```json
{
  "employee_id": "EMP-0001",
  "employee_name": "Nimal Perera",
  "year": 2026,
  "balances": [
    {
      "leave_type": "Annual Leave (AL)",
      "available": 7.0,
      "status": "HEALTHY"
    },
    {
      "leave_type": "Casual Leave (CL)",
      "available": 5.0,
      "status": "GOOD"
    },
    {
      "leave_type": "Medical Leave (ML)",
      "available": 2.0,
      "status": "CRITICAL"
    }
  ],
  "total_available": 14.0,
  "expiring_soon": [
    {
      "leave_type": "Carried Forward AL",
      "days": 2.0,
      "expires_on": "2026-03-31"
    }
  ]
}
```

### Utilization Percentage Calculation

| Opening Balance | Used Days | Pending Days | Available Days | Utilization % |
|----------------|-----------|--------------|----------------|---------------|
| 14.0 | 0.0 | 0.0 | 14.0 | 0% |
| 14.0 | 5.0 | 0.0 | 9.0 | 35.71% |
| 14.0 | 5.0 | 2.0 | 7.0 | 50% |
| 14.0 | 10.0 | 2.0 | 2.0 | 85.71% |
| 14.0 | 14.0 | 0.0 | 0.0 | 100% |

### Expected Outcome
- Read-only balance serializer
- Nested employee and leave type info
- Computed balance fields
- Status indicators for balance health
- Support for balance summaries

### Verification Checklist
- [ ] balance_serializer.py file created
- [ ] EmployeeMinimalSerializer created
- [ ] LeaveBalanceSerializer class defined
- [ ] Meta class with all fields
- [ ] Nested employee serializer
- [ ] Nested leave_type serializer
- [ ] available_days computation
- [ ] utilization_percentage calculation
- [ ] balance_status determination
- [ ] status_color mapping
- [ ] BalanceStatusSerializer created
- [ ] Serializers imported in __init__.py

---

## Task 83: Create LeaveRequestSerializer

### Overview
Create a comprehensive serializer for the LeaveRequest model. This serializer handles leave request creation, updates, and workflow actions. It includes validation of business rules, nested employee and leave type data, and computed fields for UI display and workflow management.

### Dependencies
- LeaveRequest model exists
- Task 81: Create LeaveTypeSerializer
- Task 82: Create LeaveBalanceSerializer
- Leave workflow services exist

### Instructions

1. **Create request_serializer.py file**
   - Create file at `apps/leave/serializers/request_serializer.py`
   - Import necessary components

2. **Import required modules**
   - Import serializers from rest_framework
   - Import LeaveRequest model
   - Import leave balance service
   - Import calendar service (working days calculation)
   - Import request status constants
   - Import validators

3. **Define LeaveRequestCreateSerializer**
   - Serializer for creating new requests
   - Validate leave type, dates, reason
   - Check balance availability
   - Calculate total days

4. **Define LeaveRequestUpdateSerializer**
   - Serializer for updating draft requests
   - Only allows updates when status is DRAFT
   - Re-validate dates and balance

5. **Define LeaveRequestSerializer (main)**
   - Comprehensive serializer for read operations
   - Includes nested employee, leave_type data
   - Add workflow action permissions
   - Add computed fields

6. **Configure Meta class**
   - Set model to LeaveRequest
   - Define comprehensive fields list
   - Set read_only_fields appropriately
   - Add ordering

7. **Add nested serializers**
   - employee field (EmployeeMinimalSerializer)
   - leave_type field (LeaveTypeSerializer, partial)
   - approved_by field (UserMinimalSerializer)
   - rejected_by field (UserMinimalSerializer)

8. **Add computed permission fields**
   - can_edit (boolean, owner and draft status)
   - can_delete (boolean, owner and draft status)
   - can_submit (boolean, owner and draft status)
   - can_approve (boolean, manager and pending status)
   - can_reject (boolean, manager and pending status)
   - can_cancel (boolean, owner and approved/pending status)
   - can_recall (boolean, owner and approved status)

9. **Implement field validation**
   - Validate start_date is not in the past
   - Validate end_date is after start_date
   - Validate dates don't fall on holidays
   - Validate half_day settings
   - Validate reason is provided
   - Validate contact information

10. **Add validate method**
    - Check employee has sufficient balance
    - Validate date range doesn't overlap existing requests
    - Check minimum notice period requirements
    - Validate maximum consecutive days limit
    - Check service month requirements
    - Validate document attachment if required

11. **Add create method**
    - Set employee from request user
    - Calculate total_days using calendar service
    - Set initial status to DRAFT
    - Create leave request instance

12. **Add to_representation method**
    - Add computed permission fields
    - Calculate days_remaining
    - Format dates consistently
    - Include status display text
    - Add workflow history summary

13. **Create WorkflowActionSerializer**
    - Separate serializer for workflow actions
    - Fields: action (choice), reason (for rejection)
    - Validate action is appropriate for current status

14. **Update __init__.py**
    - Import all request serializers
    - Add to __all__ list

### LeaveRequestSerializer Structure

```
┌─────────────────────────────────────────────────┐
│         LeaveRequestSerializer                  │
├─────────────────────────────────────────────────┤
│ Core Fields:                                    │
│  • id (UUID, read-only)                         │
│  • start_date (date, required)                  │
│  • end_date (date, required)                    │
│  • total_days (decimal, computed)               │
│  • is_half_day (boolean)                        │
│  • half_day_type (choice)                       │
│  • reason (text, required)                      │
│  • contact_during_leave (string)                │
│  • status (choice, read-only)                   │
│  • attachment (file, optional)                  │
│                                                 │
│ Nested Objects:                                 │
│  • employee (EmployeeMinimalSerializer)         │
│  • leave_type (LeaveTypeSerializer)             │
│  • approved_by (UserMinimalSerializer)          │
│  • rejected_by (UserMinimalSerializer)          │
│                                                 │
│ Workflow Fields:                                │
│  • submitted_at (datetime)                      │
│  • approved_at (datetime)                       │
│  • rejected_at (datetime)                       │
│  • rejection_reason (text)                      │
│  • cancelled_at (datetime)                      │
│  • cancellation_reason (text)                   │
│                                                 │
│ Computed Fields:                                │
│  • status_display (string)                      │
│  • can_edit (boolean)                           │
│  • can_delete (boolean)                         │
│  • can_submit (boolean)                         │
│  • can_approve (boolean)                        │
│  • can_reject (boolean)                         │
│  • can_cancel (boolean)                         │
│  • can_recall (boolean)                         │
│  • days_until_start (integer)                   │
│  • is_past (boolean)                            │
└─────────────────────────────────────────────────┘
```

### Validation Rules

```
Date Validation
══════════════
✓ start_date >= today (unless admin override)
✓ end_date >= start_date
✓ dates not on holidays (unless leave type allows)
✓ dates are working days
✓ minimum notice period satisfied

Balance Validation
═════════════════
✓ sufficient balance available
✓ pending requests don't exceed balance
✓ total_days <= max_consecutive_days (if set)

Business Rules Validation
════════════════════════
✓ employee meets min_service_months
✓ no overlapping requests
✓ document attached if required
✓ half_day settings are valid
```

### Permission Logic

```
Action Permissions Matrix
════════════════════════

can_edit:
  └─ owner AND status = DRAFT

can_delete:
  └─ owner AND status = DRAFT

can_submit:
  └─ owner AND status = DRAFT AND balance available

can_approve:
  └─ is_manager AND status = PENDING AND not self

can_reject:
  └─ is_manager AND status = PENDING

can_cancel:
  └─ owner AND status IN [PENDING, APPROVED] AND not started

can_recall:
  └─ owner AND status = APPROVED AND not started
      AND recall_period not expired
```

### API Request Example (Create)

```json
{
  "leave_type": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "start_date": "2026-02-15",
  "end_date": "2026-02-17",
  "is_half_day": false,
  "half_day_type": null,
  "reason": "Family vacation to Kandy",
  "contact_during_leave": "+94771234567"
}
```

### API Response Example (Detail)

```json
{
  "id": "d4e5f6a7-b8c9-0123-def4-567890123456",
  "employee": {
    "id": "c3d4e5f6-a7b8-9012-cdef-123456789012",
    "employee_id": "EMP-0001",
    "full_name": "Nimal Perera",
    "department": "IT Department"
  },
  "leave_type": {
    "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    "name": "Annual Leave",
    "code": "AL",
    "color": "#4CAF50"
  },
  "start_date": "2026-02-15",
  "end_date": "2026-02-17",
  "total_days": 3.0,
  "is_half_day": false,
  "half_day_type": null,
  "reason": "Family vacation to Kandy",
  "contact_during_leave": "+94771234567",
  "status": "PENDING",
  "status_display": "Pending Approval",
  "attachment": null,
  "submitted_at": "2026-01-25T10:00:00Z",
  "approved_by": null,
  "approved_at": null,
  "rejected_by": null,
  "rejected_at": null,
  "rejection_reason": null,
  "cancelled_at": null,
  "cancellation_reason": null,
  "can_edit": false,
  "can_delete": false,
  "can_submit": false,
  "can_approve": true,
  "can_reject": true,
  "can_cancel": true,
  "can_recall": false,
  "days_until_start": 21,
  "is_past": false,
  "created_at": "2026-01-25T09:30:00Z",
  "updated_at": "2026-01-25T10:00:00Z"
}
```

### Workflow Action Request

```json
{
  "action": "approve",
  "reason": ""
}

{
  "action": "reject",
  "reason": "Insufficient staffing during requested period"
}

{
  "action": "cancel",
  "reason": "Plans changed, no longer need leave"
}
```

### Expected Outcome
- Full CRUD serializer for leave requests
- Comprehensive validation logic
- Balance checking integration
- Permission-based field computation
- Support for workflow actions

### Verification Checklist
- [ ] request_serializer.py file created
- [ ] LeaveRequestCreateSerializer defined
- [ ] LeaveRequestUpdateSerializer defined
- [ ] LeaveRequestSerializer (main) defined
- [ ] Meta class configured
- [ ] Nested serializers added
- [ ] Permission fields computed
- [ ] Date validation implemented
- [ ] Balance validation implemented
- [ ] Overlap checking implemented
- [ ] Notice period validation
- [ ] Service months validation
- [ ] create method implemented
- [ ] validate method implemented
- [ ] to_representation customized
- [ ] WorkflowActionSerializer created
- [ ] Serializers imported in __init__.py

---

## Task 84: Create HolidaySerializer

### Overview
Create a serializer for the Holiday model. This serializer provides CRUD operations for holiday management, including public holidays, department-specific holidays, and location-specific holidays. It includes validation to prevent duplicate holidays and supports recurring annual holidays.

### Dependencies
- Holiday model exists
- Department model exists (if applicable)
- Location model exists (if applicable)

### Instructions

1. **Create holiday_serializer.py file**
   - Create file at `apps/leave/serializers/holiday_serializer.py`
   - Import necessary components

2. **Import required modules**
   - Import serializers from rest_framework
   - Import Holiday model
   - Import holiday type constants
   - Import validators

3. **Define HolidaySerializer class**
   - Inherit from serializers.ModelSerializer
   - Add class docstring

4. **Configure Meta class**
   - Set model to Holiday
   - Define fields list
   - Set read_only_fields (id, created_at, updated_at)
   - Add ordering by date

5. **Add computed fields**
   - holiday_type_display (human-readable type)
   - days_until (days until holiday from today)
   - is_upcoming (boolean, within next 30 days)
   - is_past (boolean, date has passed)
   - applies_to_display (who holiday applies to)

6. **Add department field handling**
   - department_name (read-only, from relationship)
   - Nested department minimal info if applicable

7. **Add location field handling**
   - location_name (read-only, from relationship)
   - Nested location minimal info if applicable

8. **Implement field validation**
   - Validate date is valid
   - Validate holiday_type is valid choice
   - Validate name is provided
   - Validate applies_to logic (ALL vs specific)

9. **Add validate method**
   - Check for duplicate holidays on same date
   - Validate department exists if department-specific
   - Validate location exists if location-specific
   - Ensure applies_to logic is consistent

10. **Add to_representation method**
    - Add computed fields
    - Format date display
    - Include applicability info
    - Add days_until calculation

11. **Create HolidayCalendarSerializer**
    - Simplified serializer for calendar views
    - Include only essential fields
    - Optimized for listing many holidays

12. **Update __init__.py**
    - Import HolidaySerializer
    - Import HolidayCalendarSerializer
    - Add to __all__ list

### HolidaySerializer Structure

```
┌─────────────────────────────────────────────────┐
│         HolidaySerializer                       │
├─────────────────────────────────────────────────┤
│ Core Fields:                                    │
│  • id (UUID, read-only)                         │
│  • name (string, required)                      │
│  • date (date, required)                        │
│  • holiday_type (choice, required)              │
│  • description (text, optional)                 │
│  • applies_to (choice)                          │
│  • is_recurring (boolean)                       │
│                                                 │
│ Relationship Fields:                            │
│  • department (UUID, optional)                  │
│  • department_name (string, read-only)          │
│  • location (UUID, optional)                    │
│  • location_name (string, read-only)            │
│                                                 │
│ Computed Fields:                                │
│  • holiday_type_display (string)                │
│  • applies_to_display (string)                  │
│  • days_until (integer)                         │
│  • is_upcoming (boolean)                        │
│  • is_past (boolean)                            │
│  • year (integer)                               │
└─────────────────────────────────────────────────┘
```

### Holiday Types

| Type | Value | Description | Example |
|------|-------|-------------|---------|
| PUBLIC | 'PUBLIC' | National public holiday | Independence Day |
| BANK | 'BANK' | Banking sector holiday | Bank Holiday |
| RELIGIOUS | 'RELIGIOUS' | Religious observance | Vesak, Christmas |
| COMPANY | 'COMPANY' | Company-specific | Founder's Day |
| DEPARTMENTAL | 'DEPARTMENTAL' | Department-specific | IT Team Day |
| LOCATION | 'LOCATION' | Location/branch-specific | Branch Anniversary |

### Sri Lankan Public Holidays

```
┌──────────────────────────────────────────────┐
│     Sri Lankan Public Holidays (2026)        │
├──────────────────────────────────────────────┤
│ Jan 15  │ Thai Pongal                        │
│ Feb 04  │ Independence Day                   │
│ Feb 19  │ Maha Shivarathri                   │
│ Apr 13  │ Sinhala & Tamil New Year           │
│ Apr 14  │ Sinhala & Tamil New Year           │
│ May 01  │ May Day                            │
│ May 05  │ Vesak Full Moon Poya Day           │
│ May 06  │ Day Following Vesak                │
│ Jun 03  │ Poson Full Moon Poya Day           │
│ Aug 17  │ Nikini Full Moon Poya Day          │
│ Oct 31  │ Deepavali                          │
│ Nov 16  │ Il Full Moon Poya Day              │
│ Dec 25  │ Christmas Day                      │
│ Dec 31  │ Special Bank Holiday (optional)    │
└──────────────────────────────────────────────┘
```

### API Request Example (Create)

```json
{
  "name": "Vesak Full Moon Poya Day",
  "date": "2026-05-05",
  "holiday_type": "PUBLIC",
  "description": "Vesak commemorates the birth, enlightenment, and passing of Lord Buddha",
  "applies_to": "ALL",
  "department": null,
  "location": null,
  "is_recurring": true
}
```

### API Response Example

```json
{
  "id": "e5f6a7b8-c9d0-1234-efab-6789012345cd",
  "name": "Vesak Full Moon Poya Day",
  "date": "2026-05-05",
  "holiday_type": "PUBLIC",
  "holiday_type_display": "Public Holiday",
  "description": "Vesak commemorates the birth, enlightenment, and passing of Lord Buddha",
  "applies_to": "ALL",
  "applies_to_display": "All Employees",
  "department": null,
  "department_name": null,
  "location": null,
  "location_name": null,
  "is_recurring": true,
  "days_until": 101,
  "is_upcoming": false,
  "is_past": false,
  "year": 2026,
  "created_at": "2026-01-01T00:00:00Z",
  "updated_at": "2026-01-01T00:00:00Z"
}
```

### Calendar View Response

```json
{
  "year": 2026,
  "holidays": [
    {
      "date": "2026-02-04",
      "name": "Independence Day",
      "type": "PUBLIC"
    },
    {
      "date": "2026-04-13",
      "name": "Sinhala & Tamil New Year",
      "type": "PUBLIC"
    },
    {
      "date": "2026-04-14",
      "name": "Sinhala & Tamil New Year",
      "type": "PUBLIC"
    }
  ],
  "total_holidays": 15
}
```

### Validation Rules

```
Holiday Validation Rules
═══════════════════════

Date Uniqueness:
✓ No duplicate holidays on same date (per scope)
✓ PUBLIC holidays: unique per tenant
✓ DEPARTMENTAL: unique per tenant + department
✓ LOCATION: unique per tenant + location

Applicability Rules:
✓ IF applies_to = 'ALL':
    └─ department and location must be NULL
✓ IF applies_to = 'DEPARTMENT':
    └─ department must be set
✓ IF applies_to = 'LOCATION':
    └─ location must be set

Recurring Rules:
✓ Recurring holidays auto-create for next year
✓ Date format: MM-DD (month-day only)
```

### Expected Outcome
- Full CRUD serializer for holidays
- Support for different holiday types
- Department and location scoping
- Calendar view optimization
- Recurring holiday support

### Verification Checklist
- [ ] holiday_serializer.py file created
- [ ] HolidaySerializer class defined
- [ ] Meta class configured
- [ ] Computed fields added
- [ ] Department handling implemented
- [ ] Location handling implemented
- [ ] Field validation implemented
- [ ] validate method for business rules
- [ ] to_representation customized
- [ ] days_until calculation
- [ ] HolidayCalendarSerializer created
- [ ] Serializers imported in __init__.py

---

## Task 85: Create LeaveTypeViewSet

### Overview
Create a Django REST Framework ViewSet for LeaveType CRUD operations. This viewset provides API endpoints for listing, creating, updating, and deleting leave types. It includes proper permissions, filtering, and ordering capabilities.

### Dependencies
- Task 81: Create LeaveTypeSerializer
- LeaveType model exists
- DRF viewsets installed

### Instructions

1. **Create views directory structure**
   - Navigate to `apps/leave/` directory
   - Create `views/` directory if not exists
   - Create `__init__.py` in views directory

2. **Create leave_type_viewset.py file**
   - Create file at `apps/leave/views/leave_type_viewset.py`
   - Import necessary DRF components

3. **Import required modules**
   - Import viewsets from rest_framework
   - Import permissions from rest_framework.permissions
   - Import filters from django_filters
   - Import LeaveType model
   - Import LeaveTypeSerializer
   - Import response and status from rest_framework

4. **Define LeaveTypeViewSet class**
   - Inherit from viewsets.ModelViewSet
   - Add class docstring with API endpoints documentation
   - Include usage examples

5. **Configure queryset**
   - Set queryset to LeaveType.objects.all()
   - Add select_related for optimizations
   - Add prefetch_related for relationships
   - Order by name by default

6. **Set serializer_class**
   - Set to LeaveTypeSerializer
   - Use get_serializer_class if different for actions

7. **Configure permissions**
   - Define permission_classes
   - Admin users: full CRUD access
   - Manager users: read-only access
   - Regular users: read-only for active leave types

8. **Add filtering capabilities**
   - Filter by is_active status
   - Filter by category
   - Filter by applicable_gender
   - Search by name and code

9. **Add ordering capabilities**
   - Order by name
   - Order by code
   - Order by created_at

10. **Add custom actions**
    - @action for activating leave type
    - @action for deactivating leave type
    - @action for usage statistics

11. **Override get_queryset method**
    - Filter to active only for non-admin users
    - Apply tenant filtering
    - Apply permission-based filtering

12. **Override perform_create method**
    - Set created_by to current user
    - Set tenant from current context

13. **Override perform_update method**
    - Update updated_by field
    - Log change history

14. **Override destroy method**
    - Prevent deletion if leave type is in use
    - Soft delete (deactivate) instead of hard delete

15. **Update __init__.py**
    - Import LeaveTypeViewSet
    - Add to __all__ list

### LeaveTypeViewSet Structure

```
┌─────────────────────────────────────────────────┐
│         LeaveTypeViewSet                        │
├─────────────────────────────────────────────────┤
│ Standard Actions:                               │
│  • list() - GET /types/                         │
│  • create() - POST /types/                      │
│  • retrieve() - GET /types/{id}/                │
│  • update() - PUT /types/{id}/                  │
│  • partial_update() - PATCH /types/{id}/        │
│  • destroy() - DELETE /types/{id}/              │
│                                                 │
│ Custom Actions:                                 │
│  • activate() - POST /types/{id}/activate/      │
│  • deactivate() - POST /types/{id}/deactivate/  │
│  • usage_stats() - GET /types/{id}/usage/       │
│                                                 │
│ Filtering:                                      │
│  • ?is_active=true                              │
│  • ?category=ANNUAL                             │
│  • ?applicable_gender=ALL                       │
│  • ?search=annual                               │
│                                                 │
│ Ordering:                                       │
│  • ?ordering=name                               │
│  • ?ordering=-created_at                        │
└─────────────────────────────────────────────────┘
```

### Permission Matrix

| User Role | List | Create | Update | Delete | Activate/Deactivate |
|-----------|------|--------|--------|--------|-------------------|
| Admin | ✓ All | ✓ | ✓ | ✓ | ✓ |
| HR Manager | ✓ All | ✓ | ✓ | ✗ | ✓ |
| Manager | ✓ Active | ✗ | ✗ | ✗ | ✗ |
| Employee | ✓ Active | ✗ | ✗ | ✗ | ✗ |

### API Endpoints

```
Leave Type Endpoints
═══════════════════

GET /api/v1/leave/types/
  └─ List all leave types
  └─ Supports filtering, searching, ordering
  └─ Returns paginated results

POST /api/v1/leave/types/
  └─ Create new leave type
  └─ Requires admin/HR permissions
  └─ Validates all fields

GET /api/v1/leave/types/{id}/
  └─ Get leave type details
  └─ Includes usage statistics
  └─ Shows all configurations

PUT /api/v1/leave/types/{id}/
  └─ Update leave type
  └─ Requires admin/HR permissions
  └─ Full update

PATCH /api/v1/leave/types/{id}/
  └─ Partial update
  └─ Update specific fields only

DELETE /api/v1/leave/types/{id}/
  └─ Soft delete (deactivate)
  └─ Prevents if in use
  └─ Requires admin permissions

POST /api/v1/leave/types/{id}/activate/
  └─ Activate deactivated leave type
  └─ Requires admin/HR permissions

POST /api/v1/leave/types/{id}/deactivate/
  └─ Deactivate leave type
  └─ Prevents new requests

GET /api/v1/leave/types/{id}/usage/
  └─ Get usage statistics
  └─ Total requests, active requests
  └─ Total days used
```

### Custom Action: Usage Statistics

```python
# Example response structure (do not implement code)
{
  "leave_type_id": "uuid",
  "leave_type_name": "Annual Leave",
  "statistics": {
    "total_requests": 145,
    "pending_requests": 8,
    "approved_requests": 120,
    "rejected_requests": 12,
    "cancelled_requests": 5,
    "total_days_requested": 435.0,
    "total_days_approved": 360.0,
    "total_days_used": 360.0,
    "active_employees_count": 50,
    "employees_with_requests": 48
  }
}
```

### Filtering Examples

```
Filter by Active Status:
GET /api/v1/leave/types/?is_active=true

Filter by Category:
GET /api/v1/leave/types/?category=ANNUAL

Filter by Gender:
GET /api/v1/leave/types/?applicable_gender=FEMALE

Search by Name/Code:
GET /api/v1/leave/types/?search=annual

Combined Filters:
GET /api/v1/leave/types/?is_active=true&category=ANNUAL&ordering=name
```

### Expected Outcome
- Full CRUD API for leave types
- Proper permission enforcement
- Filtering and searching capabilities
- Custom actions for activate/deactivate
- Usage statistics endpoint

### Verification Checklist
- [ ] leave_type_viewset.py file created
- [ ] LeaveTypeViewSet class defined
- [ ] queryset configured with optimizations
- [ ] serializer_class set
- [ ] permission_classes configured
- [ ] Filtering backend added
- [ ] Ordering backend added
- [ ] Search fields configured
- [ ] get_queryset method overridden
- [ ] perform_create method overridden
- [ ] perform_update method overridden
- [ ] destroy method overridden
- [ ] activate action implemented
- [ ] deactivate action implemented
- [ ] usage_stats action implemented
- [ ] ViewSet imported in __init__.py

---

## Task 86: Create LeaveRequestViewSet

### Overview
Create a comprehensive ViewSet for LeaveRequest with full CRUD operations and workflow actions. This viewset includes endpoints for submitting, approving, rejecting, cancelling, and recalling leave requests. It implements permission-based access control and supports filtering by various criteria.

### Dependencies
- Task 83: Create LeaveRequestSerializer
- LeaveRequest model exists
- Leave workflow services exist
- Task 85: Create LeaveTypeViewSet (for reference)

### Instructions

1. **Create request_viewset.py file**
   - Create file at `apps/leave/views/request_viewset.py`
   - Import necessary components

2. **Import required modules**
   - Import viewsets, permissions, status from DRF
   - Import LeaveRequest model
   - Import all request serializers
   - Import workflow service
   - Import balance service
   - Import action decorator

3. **Define LeaveRequestViewSet class**
   - Inherit from viewsets.ModelViewSet
   - Add comprehensive class docstring
   - Document all endpoints and actions

4. **Configure queryset**
   - Set base queryset with select_related
   - Include employee, leave_type, approver info
   - Order by created_at descending

5. **Set serializer_class**
   - Implement get_serializer_class method
   - Return LeaveRequestCreateSerializer for create
   - Return LeaveRequestUpdateSerializer for update
   - Return LeaveRequestSerializer for other actions

6. **Configure permissions**
   - Implement get_permissions method
   - Own requests: read-write access
   - Team requests: read-only for managers
   - Workflow actions: appropriate permissions

7. **Override get_queryset method**
   - Employees see their own requests
   - Managers see team's requests
   - HR/Admin see all requests
   - Apply status filters

8. **Add list action customization**
   - Support filtering by status
   - Support filtering by leave type
   - Support date range filtering
   - Support employee filtering (managers only)

9. **Override perform_create**
   - Set employee from request.user
   - Calculate total_days
   - Set initial status to DRAFT

10. **Override perform_update**
    - Only allow updates to DRAFT requests
    - Re-validate dates and balance
    - Recalculate total_days

11. **Add submit action**
    - @action(detail=True, methods=['post'])
    - Call workflow service to submit
    - Validate balance before submission
    - Send notifications

12. **Add approve action**
    - @action(detail=True, methods=['post'])
    - Check manager permissions
    - Call workflow service to approve
    - Deduct balance
    - Send notifications

13. **Add reject action**
    - @action(detail=True, methods=['post'])
    - Check manager permissions
    - Require rejection reason
    - Call workflow service to reject
    - Send notifications

14. **Add cancel action**
    - @action(detail=True, methods=['post'])
    - Check owner permissions
    - Require cancellation reason
    - Restore balance if approved
    - Call workflow service to cancel

15. **Add recall action**
    - @action(detail=True, methods=['post'])
    - Check owner permissions
    - Check recall period
    - Restore balance
    - Call workflow service to recall

16. **Add pending_approvals action**
    - @action(detail=False, methods=['get'])
    - List pending requests requiring my approval
    - Manager-only access

17. **Add team_requests action**
    - @action(detail=False, methods=['get'])
    - List all team member requests
    - Manager-only access

18. **Add calendar action**
    - @action(detail=False, methods=['get'])
    - Return calendar view of requests
    - Include approved and pending requests

19. **Add history action**
    - @action(detail=True, methods=['get'])
    - Return workflow history for request
    - Show all status changes

20. **Update __init__.py**
    - Import LeaveRequestViewSet
    - Add to __all__ list

### LeaveRequestViewSet Structure

```
┌─────────────────────────────────────────────────┐
│         LeaveRequestViewSet                     │
├─────────────────────────────────────────────────┤
│ Standard Actions:                               │
│  • list() - GET /requests/                      │
│  • create() - POST /requests/                   │
│  • retrieve() - GET /requests/{id}/             │
│  • update() - PUT /requests/{id}/               │
│  • partial_update() - PATCH /requests/{id}/     │
│  • destroy() - DELETE /requests/{id}/           │
│                                                 │
│ Workflow Actions:                               │
│  • submit() - POST /requests/{id}/submit/       │
│  • approve() - POST /requests/{id}/approve/     │
│  • reject() - POST /requests/{id}/reject/       │
│  • cancel() - POST /requests/{id}/cancel/       │
│  • recall() - POST /requests/{id}/recall/       │
│                                                 │
│ Query Actions:                                  │
│  • pending_approvals() - GET /requests/pending/ │
│  • team_requests() - GET /requests/team/        │
│  • calendar() - GET /requests/calendar/         │
│  • history() - GET /requests/{id}/history/      │
│                                                 │
│ Filtering:                                      │
│  • ?status=PENDING                              │
│  • ?leave_type={id}                             │
│  • ?start_date__gte=2026-01-01                  │
│  • ?employee={id} (managers only)               │
└─────────────────────────────────────────────────┘
```

### Permission Matrix

| Action | Employee (Own) | Manager (Team) | HR/Admin |
|--------|---------------|----------------|----------|
| list | ✓ Own | ✓ Team | ✓ All |
| create | ✓ | ✓ | ✓ |
| retrieve | ✓ Own | ✓ Team | ✓ All |
| update | ✓ Draft | ✗ | ✓ Draft |
| delete | ✓ Draft | ✗ | ✓ Draft |
| submit | ✓ Own Draft | ✗ | ✓ |
| approve | ✗ | ✓ Team Pending | ✓ Pending |
| reject | ✗ | ✓ Team Pending | ✓ Pending |
| cancel | ✓ Own | ✗ | ✓ |
| recall | ✓ Own Approved | ✗ | ✓ |
| pending_approvals | ✗ | ✓ | ✓ |
| team_requests | ✗ | ✓ | ✓ |

### Workflow Action Flows

```
Submit Flow
══════════
DRAFT → (validate balance) → PENDING
└─ Notifications: manager

Approve Flow
═══════════
PENDING → (deduct balance) → APPROVED
└─ Notifications: employee

Reject Flow
══════════
PENDING → (add reason) → REJECTED
└─ Notifications: employee

Cancel Flow
══════════
PENDING|APPROVED → (restore balance) → CANCELLED
└─ Notifications: manager

Recall Flow
══════════
APPROVED → (within recall period) → RECALLED
        → (restore balance) → DRAFT
└─ Notifications: manager
```

### API Request Examples

#### Submit Request
```json
POST /api/v1/leave/requests/{id}/submit/
{}
```

#### Approve Request
```json
POST /api/v1/leave/requests/{id}/approve/
{
  "comments": "Approved. Enjoy your leave."
}
```

#### Reject Request
```json
POST /api/v1/leave/requests/{id}/reject/
{
  "reason": "Insufficient staffing during requested period. Please choose alternative dates."
}
```

#### Cancel Request
```json
POST /api/v1/leave/requests/{id}/cancel/
{
  "reason": "Plans changed, no longer need leave"
}
```

### Query Endpoints

#### Pending Approvals
```
GET /api/v1/leave/requests/pending/
Response: List of requests pending my approval
```

#### Team Requests
```
GET /api/v1/leave/requests/team/?status=APPROVED&start_date__gte=2026-01-01
Response: List of team member requests with filters
```

#### Calendar View
```
GET /api/v1/leave/requests/calendar/?year=2026&month=2
Response: {
  "year": 2026,
  "month": 2,
  "requests": [
    {
      "employee": "Nimal Perera",
      "start_date": "2026-02-15",
      "end_date": "2026-02-17",
      "leave_type": "Annual Leave",
      "status": "APPROVED"
    }
  ]
}
```

#### Request History
```
GET /api/v1/leave/requests/{id}/history/
Response: {
  "request_id": "uuid",
  "history": [
    {
      "timestamp": "2026-01-25T09:30:00Z",
      "action": "CREATED",
      "user": "Nimal Perera",
      "status": "DRAFT"
    },
    {
      "timestamp": "2026-01-25T10:00:00Z",
      "action": "SUBMITTED",
      "user": "Nimal Perera",
      "status": "PENDING"
    },
    {
      "timestamp": "2026-01-26T11:15:00Z",
      "action": "APPROVED",
      "user": "Kamal Silva (Manager)",
      "status": "APPROVED",
      "comments": "Approved"
    }
  ]
}
```

### Filtering Examples

```
My Requests (Current User):
GET /api/v1/leave/requests/

Pending Requests:
GET /api/v1/leave/requests/?status=PENDING

Date Range:
GET /api/v1/leave/requests/?start_date__gte=2026-02-01&start_date__lte=2026-02-29

Leave Type:
GET /api/v1/leave/requests/?leave_type={uuid}

Employee (Manager View):
GET /api/v1/leave/requests/?employee={uuid}

Combined:
GET /api/v1/leave/requests/?status=APPROVED&start_date__gte=2026-01-01&ordering=-start_date
```

### Expected Outcome
- Complete leave request API
- Full workflow action support
- Permission-based access control
- Filtering and querying capabilities
- Manager and employee views
- Notification integration

### Verification Checklist
- [ ] request_viewset.py file created
- [ ] LeaveRequestViewSet class defined
- [ ] queryset with optimizations
- [ ] get_serializer_class implemented
- [ ] get_permissions implemented
- [ ] get_queryset with role-based filtering
- [ ] perform_create overridden
- [ ] perform_update overridden
- [ ] submit action implemented
- [ ] approve action implemented
- [ ] reject action implemented
- [ ] cancel action implemented
- [ ] recall action implemented
- [ ] pending_approvals action
- [ ] team_requests action
- [ ] calendar action
- [ ] history action
- [ ] Filtering configured
- [ ] Ordering configured
- [ ] ViewSet imported in __init__.py

---

## Task 87: Create HolidayViewSet

### Overview
Create a ViewSet for Holiday management with CRUD operations. This viewset provides API endpoints for managing public holidays, bank holidays, and company-specific holidays. It includes filtering by year, type, and applicability, and supports calendar views.

### Dependencies
- Task 84: Create HolidaySerializer
- Holiday model exists

### Instructions

1. **Create holiday_viewset.py file**
   - Create file at `apps/leave/views/holiday_viewset.py`
   - Import necessary components

2. **Import required modules**
   - Import viewsets, permissions from DRF
   - Import Holiday model
   - Import HolidaySerializer, HolidayCalendarSerializer
   - Import action decorator
   - Import datetime utilities

3. **Define HolidayViewSet class**
   - Inherit from viewsets.ModelViewSet
   - Add class docstring

4. **Configure queryset**
   - Set to Holiday.objects.all()
   - Add select_related for department, location
   - Order by date

5. **Set serializer_class**
   - Implement get_serializer_class
   - Return HolidayCalendarSerializer for calendar action
   - Return HolidaySerializer for other actions

6. **Configure permissions**
   - Admin/HR: full CRUD access
   - Managers: read-only access
   - Employees: read-only access

7. **Override get_queryset**
   - Apply tenant filtering
   - Filter by date range if provided
   - Filter by year if provided

8. **Add filtering capabilities**
   - Filter by holiday_type
   - Filter by year
   - Filter by month
   - Filter by applies_to
   - Filter by department (if applicable)
   - Filter by location (if applicable)

9. **Add ordering capabilities**
   - Order by date
   - Order by name
   - Order by holiday_type

10. **Add calendar action**
    - @action(detail=False, methods=['get'])
    - Return holidays for specific year
    - Group by month
    - Use HolidayCalendarSerializer

11. **Add upcoming action**
    - @action(detail=False, methods=['get'])
    - Return upcoming holidays (next 90 days)
    - Exclude past holidays

12. **Add year_view action**
    - @action(detail=False, methods=['get'])
    - Return all holidays for a year
    - Include statistics (total, by type)

13. **Add check action**
    - @action(detail=False, methods=['get'])
    - Check if specific date is a holiday
    - Accept date parameter
    - Return holiday details if found

14. **Override perform_create**
    - Set tenant from current context
    - Validate no duplicate on same date

15. **Update __init__.py**
    - Import HolidayViewSet
    - Add to __all__ list

### HolidayViewSet Structure

```
┌─────────────────────────────────────────────────┐
│         HolidayViewSet                          │
├─────────────────────────────────────────────────┤
│ Standard Actions:                               │
│  • list() - GET /holidays/                      │
│  • create() - POST /holidays/                   │
│  • retrieve() - GET /holidays/{id}/             │
│  • update() - PUT /holidays/{id}/               │
│  • partial_update() - PATCH /holidays/{id}/     │
│  • destroy() - DELETE /holidays/{id}/           │
│                                                 │
│ Custom Actions:                                 │
│  • calendar() - GET /holidays/calendar/         │
│  • upcoming() - GET /holidays/upcoming/         │
│  • year_view() - GET /holidays/year/{year}/     │
│  • check() - GET /holidays/check/?date=...      │
│                                                 │
│ Filtering:                                      │
│  • ?year=2026                                   │
│  • ?month=2                                     │
│  • ?holiday_type=PUBLIC                         │
│  • ?applies_to=ALL                              │
└─────────────────────────────────────────────────┘
```

### Permission Matrix

| User Role | List | Create | Update | Delete |
|-----------|------|--------|--------|--------|
| Admin | ✓ | ✓ | ✓ | ✓ |
| HR Manager | ✓ | ✓ | ✓ | ✓ |
| Manager | ✓ | ✗ | ✗ | ✗ |
| Employee | ✓ | ✗ | ✗ | ✗ |

### API Endpoints

```
Holiday Endpoints
════════════════

GET /api/v1/leave/holidays/
  └─ List all holidays
  └─ Supports filtering by year, type, month

POST /api/v1/leave/holidays/
  └─ Create new holiday
  └─ Requires admin/HR permissions

GET /api/v1/leave/holidays/{id}/
  └─ Get holiday details

PUT /api/v1/leave/holidays/{id}/
  └─ Update holiday
  └─ Requires admin/HR permissions

DELETE /api/v1/leave/holidays/{id}/
  └─ Delete holiday
  └─ Requires admin permissions

GET /api/v1/leave/holidays/calendar/
  └─ Calendar view of holidays
  └─ Grouped by month

GET /api/v1/leave/holidays/upcoming/
  └─ Upcoming holidays (next 90 days)
  └─ Sorted by date

GET /api/v1/leave/holidays/year/{year}/
  └─ All holidays for specific year
  └─ Includes statistics

GET /api/v1/leave/holidays/check/?date=2026-02-04
  └─ Check if date is a holiday
  └─ Returns holiday details or null
```

### Calendar Action Response

```json
{
  "year": 2026,
  "total_holidays": 15,
  "by_month": {
    "1": [
      {
        "date": "2026-01-15",
        "name": "Thai Pongal",
        "type": "PUBLIC"
      }
    ],
    "2": [
      {
        "date": "2026-02-04",
        "name": "Independence Day",
        "type": "PUBLIC"
      },
      {
        "date": "2026-02-19",
        "name": "Maha Shivarathri",
        "type": "RELIGIOUS"
      }
    ]
  },
  "by_type": {
    "PUBLIC": 12,
    "RELIGIOUS": 2,
    "BANK": 1
  }
}
```

### Upcoming Holidays Response

```json
{
  "upcoming_holidays": [
    {
      "id": "uuid",
      "date": "2026-02-04",
      "name": "Independence Day",
      "holiday_type": "PUBLIC",
      "days_until": 11,
      "description": "Sri Lanka Independence Day"
    },
    {
      "id": "uuid",
      "date": "2026-02-19",
      "name": "Maha Shivarathri",
      "holiday_type": "RELIGIOUS",
      "days_until": 26,
      "description": "Hindu festival"
    }
  ],
  "total": 2
}
```

### Check Date Response

```json
{
  "date": "2026-02-04",
  "is_holiday": true,
  "holiday": {
    "id": "uuid",
    "name": "Independence Day",
    "holiday_type": "PUBLIC",
    "description": "Sri Lanka Independence Day",
    "applies_to": "ALL"
  }
}

{
  "date": "2026-02-05",
  "is_holiday": false,
  "holiday": null
}
```

### Filtering Examples

```
All Holidays:
GET /api/v1/leave/holidays/

Holidays for 2026:
GET /api/v1/leave/holidays/?year=2026

Public Holidays Only:
GET /api/v1/leave/holidays/?holiday_type=PUBLIC

Holidays for February 2026:
GET /api/v1/leave/holidays/?year=2026&month=2

Department-Specific:
GET /api/v1/leave/holidays/?applies_to=DEPARTMENT&department={uuid}

Upcoming Only:
GET /api/v1/leave/holidays/upcoming/

Calendar View:
GET /api/v1/leave/holidays/calendar/?year=2026
```

### Expected Outcome
- Full CRUD API for holidays
- Calendar view support
- Upcoming holidays listing
- Date checking capability
- Filtering by year, type, month
- Permission-based access

### Verification Checklist
- [ ] holiday_viewset.py file created
- [ ] HolidayViewSet class defined
- [ ] queryset configured
- [ ] get_serializer_class implemented
- [ ] permission_classes configured
- [ ] get_queryset overridden
- [ ] Filtering configured
- [ ] Ordering configured
- [ ] calendar action implemented
- [ ] upcoming action implemented
- [ ] year_view action implemented
- [ ] check action implemented
- [ ] perform_create overridden
- [ ] ViewSet imported in __init__.py

---

## Summary

This document established the API layer for the Leave Management module:

### Completed Components
- ✅ LeaveTypeSerializer with validation
- ✅ LeaveBalanceSerializer with computations
- ✅ LeaveRequestSerializer with workflow support
- ✅ HolidaySerializer with calendar support
- ✅ LeaveTypeViewSet with CRUD and custom actions
- ✅ LeaveRequestViewSet with full workflow
- ✅ HolidayViewSet with calendar views

### Key Achievements
1. **Serializers** - Complete data serialization layer
2. **Validation** - Business rule enforcement in serializers
3. **ViewSets** - Full CRUD operations with DRF
4. **Workflow Actions** - Submit, approve, reject, cancel, recall
5. **Filtering** - Comprehensive filtering capabilities
6. **Permissions** - Role-based access control
7. **Custom Actions** - Calendar views, statistics, team views

### Next Steps
Proceed to [02_Tasks-88-90_URLs-Tests-Documentation.md](02_Tasks-88-90_URLs-Tests-Documentation.md) to register API URLs, create comprehensive tests, and write module documentation.

---

**Document Status:** ✅ Complete  
**Total Tasks:** 7  
**Total Lines:** ~1395
