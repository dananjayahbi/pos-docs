# Tasks 33-40: Attendance Service & Clock-In/Out Processing

> **Phase:** 06 - ERP Advanced Modules  
> **SubPhase:** 03 - Attendance System  
> **Group:** C - Check-In/Out Processing  
> **Document:** 01 of 02  
> **Tasks Covered:** 33, 34, 35, 36, 37, 38, 39, 40

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [Group B: Attendance Record Model - Doc 02](../Group-B_Attendance-Record-Model/02_Tasks-25-32_Hours-Location-Index.md)
- **→ Next Document:** [02_Tasks-41-48_Biometric-Mobile-Regularization.md](02_Tasks-41-48_Biometric-Mobile-Regularization.md)

---

## Document Overview

This document covers the core AttendanceService implementation for processing clock-in and clock-out operations. The service handles shift lookup, validates timing, detects late arrivals and early departures, determines attendance status, and calculates working hours with precision.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 33 | Create AttendanceService Class | High | 30 min |
| 34 | Implement Clock In Method | High | 30 min |
| 35 | Implement Clock Out Method | High | 30 min |
| 36 | Implement Get Current Shift | Medium | 25 min |
| 37 | Implement Late Detection | Medium | 25 min |
| 38 | Implement Early Leave Detection | Medium | 20 min |
| 39 | Implement Status Determination | Medium | 25 min |
| 40 | Implement Work Hours Calculation | Medium | 25 min |

---

## Task 33: Create AttendanceService Class

### Overview
Create the AttendanceService class that serves as the central business logic layer for all attendance operations including clock-in/out processing, validation, calculations, and status management.

### Dependencies
- AttendanceRecord model created (Tasks 17-32)
- Shift and ShiftSchedule models exist (Tasks 01-16)
- Employee model accessible
- Service layer patterns established

### Instructions

1. **Create service directory structure**
   - Navigate to `apps/attendance/` directory
   - Create `services/` directory if not exists
   - Create `__init__.py` in services directory
   - Will contain all attendance services

2. **Create attendance_service.py file**
   - Create file `services/attendance_service.py`
   - Will contain AttendanceService class
   - Import required models and utilities

3. **Define AttendanceService class**
   - Create class AttendanceService
   - Accept tenant parameter in constructor
   - Accept optional user parameter for audit
   - Initialize with tenant context

4. **Add service initialization**
   - Store tenant reference
   - Store user reference for audit trail
   - Load tenant attendance settings
   - Initialize timezone handler

5. **Add configuration loading**
   - Load grace period settings
   - Load overtime rules
   - Load full/half day thresholds
   - Cache configuration for performance

6. **Add helper method stubs**
   - get_or_create_attendance()
   - get_current_shift()
   - calculate_lateness()
   - calculate_early_departure()
   - determine_status()
   - calculate_hours()

7. **Add transaction handling**
   - Use Django atomic transactions
   - Handle concurrent operations
   - Implement proper locking
   - Rollback on errors

8. **Add error handling**
   - Define custom exceptions
   - Handle validation errors
   - Provide meaningful error messages
   - Include recovery suggestions

### Service Architecture

```
AttendanceService Structure:
┌─────────────────────────────────────┐
│     AttendanceService               │
├─────────────────────────────────────┤
│ - tenant                            │
│ - user                              │
│ - config (cached settings)          │
├─────────────────────────────────────┤
│ + clock_in()                        │
│ + clock_out()                       │
│ + get_current_shift()               │
│ + calculate_lateness()              │
│ + calculate_early_departure()       │
│ + determine_status()                │
│ + calculate_hours()                 │
│ + get_today_attendance()            │
│ + get_employee_attendance_history() │
└─────────────────────────────────────┘
```

### Service Configuration

```
Attendance Configuration Settings:
┌────────────────────────────┬──────────┐
│ Setting                    │ Default  │
├────────────────────────────┼──────────┤
│ late_grace_minutes         │ 15       │
│ early_grace_minutes        │ 10       │
│ minimum_hours_full_day     │ 8.0      │
│ minimum_hours_half_day     │ 4.0      │
│ overtime_threshold_hours   │ 8.5      │
│ overtime_multiplier        │ 1.5      │
│ auto_clock_out_enabled     │ False    │
│ require_location           │ True     │
│ require_photo              │ False    │
└────────────────────────────┴──────────┘
```

### Expected Outcome
- AttendanceService class created
- Service properly initialized with tenant context
- Configuration loading implemented
- Foundation ready for business logic methods

### Verification Checklist
- [ ] services/attendance_service.py file created
- [ ] AttendanceService class defined
- [ ] Constructor accepts tenant and user
- [ ] Configuration loading implemented
- [ ] Helper method stubs added
- [ ] Transaction handling considered
- [ ] Error handling framework in place
- [ ] Service can be instantiated successfully

---

## Task 34: Implement Clock In Method

### Overview
Implement the clock_in() method that records employee arrival time, validates against shift schedule, checks for duplicate entries, applies business rules, and creates attendance records.

### Dependencies
- Task 33: AttendanceService class created
- AttendanceRecord model functional
- Shift lookup capability exists

### Instructions

1. **Define clock_in method signature**
   - Accept employee_id parameter (required)
   - Accept clock_in_time parameter (optional, default to now)
   - Accept location_data parameter (optional GPS)
   - Accept device_info parameter (optional)
   - Accept notes parameter (optional)
   - Return attendance record object

2. **Add pre-validation checks**
   - Verify employee exists and is active
   - Check employment status is valid
   - Verify not terminated
   - Validate employee_id belongs to tenant

3. **Check for existing attendance**
   - Query AttendanceRecord for employee + today
   - If exists with clock_in, raise DuplicateClockInError
   - If exists without clock_in, use existing record
   - If not exists, prepare to create new

4. **Lookup applicable shift**
   - Call get_current_shift() method
   - Pass employee_id and date
   - Handle no shift scenario
   - Store shift reference

5. **Validate clock-in time window**
   - Check not in future
   - Check within reasonable shift window
   - Apply early arrival rules if before shift
   - Flag if significantly outside shift time

6. **Validate location if required**
   - Check if location_data provided
   - Validate GPS coordinates format
   - Check distance from work location
   - Apply geofencing rules
   - Allow or reject based on distance

7. **Calculate late arrival**
   - Call calculate_lateness() method
   - Pass clock_in_time and shift start
   - Get late_minutes value
   - Determine is_late boolean

8. **Create or update attendance record**
   - Use transaction for atomicity
   - Set employee reference
   - Set date from clock_in_time
   - Set shift reference
   - Set clock_in timestamp
   - Set clock_in_method (WEB, MOBILE, etc.)
   - Set clock_in_location if provided
   - Set clock_in_ip from request
   - Set late_minutes if late
   - Set initial status (PRESENT or LATE)
   - Save record to database

9. **Send notifications**
   - Notify employee of successful clock-in
   - If late, notify manager
   - Include late minutes in notification
   - Send via configured channels

10. **Return response**
    - Return attendance record object
    - Include status information
    - Include late minutes if applicable
    - Include expected clock-out time

### Clock-In Processing Flow

```
Clock-In Workflow:
┌─────────────────────────────┐
│ 1. Receive Clock-In Request │
└──────────┬──────────────────┘
           │
           ▼
┌─────────────────────────────┐
│ 2. Validate Employee        │
│    - Active status          │
│    - Employment dates       │
└──────────┬──────────────────┘
           │
           ▼
┌─────────────────────────────┐
│ 3. Check Existing Attendance│
│    - No duplicate today     │
└──────────┬──────────────────┘
           │
           ▼
┌─────────────────────────────┐
│ 4. Get Applicable Shift     │
│    - Priority: Employee >   │
│      Dept > Default         │
└──────────┬──────────────────┘
           │
           ▼
┌─────────────────────────────┐
│ 5. Validate Time & Location │
│    - Time window OK?        │
│    - Location in geofence?  │
└──────────┬──────────────────┘
           │
           ▼
┌─────────────────────────────┐
│ 6. Detect Late Arrival      │
│    - Compare to shift start │
│    - Apply grace period     │
└──────────┬──────────────────┘
           │
           ▼
┌─────────────────────────────┐
│ 7. Create Attendance Record │
│    - Save to database       │
└──────────┬──────────────────┘
           │
           ▼
┌─────────────────────────────┐
│ 8. Send Notifications       │
│    - Employee confirmation  │
│    - Manager alert if late  │
└─────────────────────────────┘
```

### Validation Rules

```
Clock-In Validations:
┌──────────────────────────┬────────────────┐
│ Validation               │ Action         │
├──────────────────────────┼────────────────┤
│ Employee not found       │ Raise error    │
│ Employee inactive        │ Raise error    │
│ Already clocked in today │ Raise error    │
│ No shift assigned        │ Use default or │
│                          │ raise error    │
│ Time in future           │ Raise error    │
│ Outside geofence         │ Flag/reject    │
│ On approved leave        │ Allow with note│
│ Public holiday           │ Allow, flag OT │
└──────────────────────────┴────────────────┘
```

### Expected Outcome
- Clock-in method fully functional
- Attendance records created correctly
- Late detection working
- Location validation operational
- Notifications sent appropriately

### Verification Checklist
- [ ] clock_in() method defined
- [ ] Employee validation implemented
- [ ] Duplicate check working
- [ ] Shift lookup integrated
- [ ] Time validation functioning
- [ ] Location validation optional but working
- [ ] Late detection called
- [ ] Attendance record created/updated
- [ ] Notifications sent
- [ ] Transaction handling proper
- [ ] Error scenarios handled
- [ ] Return value complete

---

## Task 35: Implement Clock Out Method

### Overview
Implement the clock_out() method that records employee departure time, calculates total work duration, determines final attendance status, computes overtime, and completes the attendance record.

### Dependencies
- Task 34: Clock-in method implemented
- AttendanceRecord model has clock_out field
- Hours calculation logic planned

### Instructions

1. **Define clock_out method signature**
   - Accept employee_id parameter (required)
   - Accept clock_out_time parameter (optional, default to now)
   - Accept location_data parameter (optional)
   - Accept device_info parameter (optional)
   - Accept notes parameter (optional)
   - Return updated attendance record

2. **Validate existing attendance record**
   - Query AttendanceRecord for employee + today
   - Verify record exists (must have clocked in first)
   - Verify clock_in time is not null
   - Verify clock_out is null (not already clocked out)
   - Raise error if validation fails

3. **Validate clock-out time**
   - Ensure clock_out_time not in future
   - Ensure clock_out_time > clock_in_time
   - Check reasonable duration (not too short/long)
   - Handle overnight shifts properly

4. **Validate location if required**
   - Similar to clock-in validation
   - Check GPS coordinates if provided
   - Validate against work location
   - Store clock_out_location

5. **Calculate early departure**
   - Call calculate_early_departure() method
   - Pass clock_out_time and shift end
   - Get early_departure_minutes value
   - Determine if early departure flag

6. **Calculate total work duration**
   - Get time difference: clock_out - clock_in
   - Convert to hours and minutes
   - Store in total_duration field
   - Consider break time (if tracked separately)

7. **Calculate actual working hours**
   - Call calculate_hours() method
   - Pass attendance record
   - Deduct break time
   - Calculate effective hours
   - Store in work_hours field

8. **Detect overtime**
   - Compare work_hours to shift hours
   - Compare to overtime threshold
   - Calculate overtime_hours if applicable
   - Set overtime_approved to False initially

9. **Determine final status**
   - Call determine_status() method
   - Pass attendance record with all times
   - Get final status (PRESENT, HALF_DAY, etc.)
   - Update status field

10. **Update attendance record**
    - Set clock_out timestamp
    - Set clock_out_method
    - Set clock_out_location if provided
    - Set clock_out_ip
    - Set early_departure_minutes
    - Set work_hours
    - Set overtime_hours
    - Set final status
    - Save record in transaction

11. **Trigger post-clock-out actions**
    - Send clock-out confirmation to employee
    - If early departure, notify manager
    - If overtime, flag for approval
    - Update attendance summaries
    - Trigger payroll integration

12. **Return response**
    - Return updated attendance record
    - Include work hours summary
    - Include overtime details
    - Include pay impact information

### Clock-Out Processing Flow

```
Clock-Out Workflow:
┌─────────────────────────────┐
│ 1. Receive Clock-Out Request│
└──────────┬──────────────────┘
           │
           ▼
┌─────────────────────────────┐
│ 2. Validate Attendance      │
│    - Clock-in exists        │
│    - Not already clocked out│
└──────────┬──────────────────┘
           │
           ▼
┌─────────────────────────────┐
│ 3. Validate Time & Location │
│    - After clock-in         │
│    - Location valid         │
└──────────┬──────────────────┘
           │
           ▼
┌─────────────────────────────┐
│ 4. Calculate Duration       │
│    - Total time worked      │
│    - Deduct breaks          │
└──────────┬──────────────────┘
           │
           ▼
┌─────────────────────────────┐
│ 5. Detect Early Departure   │
│    - Before scheduled end?  │
│    - Apply grace period     │
└──────────┬──────────────────┘
           │
           ▼
┌─────────────────────────────┐
│ 6. Calculate Working Hours  │
│    - Effective hours        │
│    - Break deductions       │
└──────────┬──────────────────┘
           │
           ▼
┌─────────────────────────────┐
│ 7. Detect Overtime          │
│    - Exceeds threshold?     │
│    - Calculate OT hours     │
└──────────┬──────────────────┘
           │
           ▼
┌─────────────────────────────┐
│ 8. Determine Final Status   │
│    - PRESENT / HALF_DAY     │
│    - Based on hours worked  │
└──────────┬──────────────────┘
           │
           ▼
┌─────────────────────────────┐
│ 9. Update Record & Notify   │
│    - Save all calculations  │
│    - Send notifications     │
└─────────────────────────────┘
```

### Hours Calculation Example

```
Clock-Out Calculation Example:
Clock-In:  09:15 AM
Clock-Out: 06:10 PM

Step 1: Total Duration
Total = 06:10 PM - 09:15 AM
Total = 8 hours 55 minutes

Step 2: Break Deduction
Scheduled Break = 30 minutes
Actual Work = 8:55 - 0:30 = 8:25

Step 3: Convert to Decimal
Work Hours = 8.42 hours

Step 4: Compare to Thresholds
Full Day Threshold = 8.0 hours
8.42 >= 8.0 → FULL DAY

Step 5: Overtime Check
Overtime Threshold = 8.5 hours
8.42 < 8.5 → No overtime

Result:
- Status: PRESENT (Full Day)
- Work Hours: 8.42
- Overtime: 0
- Late: 15 minutes
- Early: 20 minutes (left at 6:10 vs 6:30)
```

### Expected Outcome
- Clock-out method fully functional
- Work hours calculated accurately
- Early departure detected
- Overtime calculated correctly
- Final status determined properly

### Verification Checklist
- [ ] clock_out() method defined
- [ ] Attendance record validation working
- [ ] Time validation implemented
- [ ] Location validation functional
- [ ] Early departure detection working
- [ ] Duration calculation correct
- [ ] Work hours calculation accurate
- [ ] Break time handling proper
- [ ] Overtime detection functional
- [ ] Status determination integrated
- [ ] Record update successful
- [ ] Notifications sent
- [ ] Transaction handling proper
- [ ] Return value complete

---

## Task 36: Implement Get Current Shift

### Overview
Implement get_current_shift() method that retrieves the applicable shift for an employee on a given date, following priority rules (employee > department > default) and handling various scheduling scenarios.

### Dependencies
- Shift and ShiftSchedule models exist (Tasks 01-16)
- Employee model accessible
- Date handling utilities available

### Instructions

1. **Define method signature**
   - Accept employee_id parameter
   - Accept date parameter (default to today)
   - Accept reference_time parameter (optional, for time-specific shifts)
   - Return ShiftSchedule object or None

2. **Implement employee-specific shift lookup**
   - Query ShiftSchedule model
   - Filter by employee_id
   - Filter by effective_from <= date
   - Filter by effective_to >= date OR effective_to is NULL
   - Filter by applicable weekday (e.g., if Monday, monday=True)
   - Order by priority or effective_from DESC
   - Get first match

3. **Implement department shift lookup (fallback)**
   - If no employee-specific shift found
   - Get employee's department
   - Query ShiftSchedule for department
   - Apply same date and weekday filters
   - Get first match

4. **Implement default shift lookup (final fallback)**
   - If no department shift found
   - Query for tenant default shift
   - Check if applies to all employees
   - Return default if configured

5. **Add weekday validation**
   - Extract day of week from date
   - Map to weekday field (monday, tuesday, etc.)
   - Check if shift schedule has that day enabled
   - Filter out non-applicable schedules

6. **Handle overnight shifts**
   - If reference_time provided
   - Check if shift crosses midnight
   - Determine correct shift based on time
   - Handle date boundary logic

7. **Add caching for performance**
   - Cache key: shift:{employee_id}:{date}
   - Check cache first before database
   - Store result in cache with TTL (e.g., 4 hours)
   - Invalidate on shift assignment changes

8. **Add no-shift handling**
   - If no shift found at all
   - Return None or raise NoActiveShiftError
   - Provide helpful error message
   - Suggest checking shift assignments

9. **Add validation checks**
   - Verify employee exists
   - Verify employee is active
   - Check if date is in employment period
   - Handle leave/holiday scenarios

### Shift Lookup Priority Flow

```
Shift Lookup Algorithm:
┌────────────────────────────┐
│ Start: Get Shift for Date │
└──────────┬─────────────────┘
           │
           ▼
┌────────────────────────────┐
│ Priority 1:                │
│ Employee-Specific Schedule │
│ (ShiftSchedule.employee)   │
└──────────┬─────────────────┘
           │
      Found? ──Yes──> Return Shift
           │
          No
           ▼
┌────────────────────────────┐
│ Priority 2:                │
│ Department Schedule        │
│ (ShiftSchedule.department) │
└──────────┬─────────────────┘
           │
      Found? ──Yes──> Return Shift
           │
          No
           ▼
┌────────────────────────────┐
│ Priority 3:                │
│ Default Shift              │
│ (Tenant default)           │
└──────────┬─────────────────┘
           │
      Found? ──Yes──> Return Shift
           │
          No
           ▼
┌────────────────────────────┐
│ Return None / Raise Error  │
└────────────────────────────┘
```

### Weekday Matching Example

```
Weekday Filter Example:
Date: 2026-01-26 (Monday)

ShiftSchedule Records:
┌────┬──────────┬────────┬─────────┬────────┐
│ ID │ Employee │ Monday │ Tuesday │ Status │
├────┼──────────┼────────┼─────────┼────────┤
│ 1  │ John     │ True   │ True    │ Active │
│ 2  │ John     │ False  │ True    │ Active │
│ 3  │ Jane     │ True   │ False   │ Active │
└────┴──────────┴────────┴─────────┴────────┘

Query for John on Monday:
- Record 1: Monday=True ✓ (Match)
- Record 2: Monday=False ✗ (Skip)

Result: Return Record 1
```

### Expected Outcome
- Shift lookup method working correctly
- Priority rules applied properly
- Weekday matching functional
- Caching improves performance
- No-shift scenarios handled gracefully

### Verification Checklist
- [ ] get_current_shift() method defined
- [ ] Employee-specific lookup implemented
- [ ] Department lookup as fallback
- [ ] Default shift lookup works
- [ ] Weekday validation functional
- [ ] Date range filtering correct
- [ ] Overnight shift handling considered
- [ ] Caching implemented
- [ ] No-shift error handling proper
- [ ] Return value correct (ShiftSchedule or None)

---

## Task 37: Implement Late Detection

### Overview
Implement calculate_lateness() method that determines if an employee clocked in late, calculates the number of minutes late, applies grace periods, and categorizes lateness severity.

### Dependencies
- Shift model has start_time and late_grace_minutes
- Attendance configuration loaded
- Time comparison utilities available

### Instructions

1. **Define method signature**
   - Accept clock_in_time parameter (DateTime)
   - Accept scheduled_start_time parameter (Time)
   - Accept shift parameter (optional, for grace period)
   - Return dictionary with is_late, late_minutes, category

2. **Combine date and scheduled time**
   - Get date from clock_in_time
   - Combine with scheduled_start_time
   - Create scheduled_start_datetime
   - Handle timezone properly

3. **Calculate raw lateness**
   - Calculate difference: clock_in_time - scheduled_start_datetime
   - Convert to total minutes
   - If negative (early), set raw_late_minutes = 0
   - If positive (late), store value

4. **Load grace period**
   - Check shift-specific grace period first
   - Fallback to tenant default grace period
   - If none configured, use 0 minutes
   - Store grace_period_minutes value

5. **Apply grace period**
   - Subtract grace_period from raw_late_minutes
   - adjusted_late_minutes = max(0, raw_late_minutes - grace_period)
   - This is the final late_minutes value

6. **Determine is_late flag**
   - If adjusted_late_minutes > 0: is_late = True
   - Else: is_late = False

7. **Categorize lateness severity**
   - If late_minutes == 0: category = "On Time"
   - If late_minutes <= 15: category = "Minor Late"
   - If late_minutes <= 30: category = "Moderate Late"
   - If late_minutes <= 60: category = "Severe Late"
   - If late_minutes > 60: category = "Extreme Late"

8. **Check for excused lateness**
   - Query for pre-approved late exceptions
   - Check emergency flags
   - Mark as excused if applicable
   - Store excuse reason

9. **Pattern detection (optional)**
   - Check frequency of late arrivals this month
   - Flag if chronic pattern detected
   - Include in response for manager visibility

10. **Return lateness details**
    - Return is_late boolean
    - Return late_minutes (adjusted)
    - Return raw_late_minutes
    - Return grace_period_applied
    - Return category
    - Return is_excused
    - Return pattern_flag if applicable

### Late Detection Logic Flow

```
Late Detection Algorithm:
┌─────────────────────────────┐
│ Clock-In Time: 09:20 AM     │
│ Scheduled Start: 09:00 AM   │
│ Grace Period: 15 minutes    │
└──────────┬──────────────────┘
           │
           ▼
┌─────────────────────────────┐
│ Calculate Raw Lateness      │
│ 09:20 - 09:00 = 20 minutes  │
└──────────┬──────────────────┘
           │
           ▼
┌─────────────────────────────┐
│ Apply Grace Period          │
│ 20 - 15 = 5 minutes late    │
└──────────┬──────────────────┘
           │
           ▼
┌─────────────────────────────┐
│ Determine Status            │
│ 5 > 0 → is_late = True      │
│ 5 <= 15 → Minor Late        │
└─────────────────────────────┘
```

### Grace Period Application

```
Grace Period Examples:
┌─────────────┬──────────┬───────┬────────┬─────────┐
│ Clock-In    │ Schedule │ Grace │ Raw    │ Final   │
├─────────────┼──────────┼───────┼────────┼─────────┤
│ 09:05       │ 09:00    │ 15    │ 5      │ 0 ✓     │
│ 09:15       │ 09:00    │ 15    │ 15     │ 0 ✓     │
│ 09:20       │ 09:00    │ 15    │ 20     │ 5 Late  │
│ 09:45       │ 09:00    │ 15    │ 45     │ 30 Late │
│ 10:30       │ 09:00    │ 15    │ 90     │ 75 Late │
└─────────────┴──────────┴───────┴────────┴─────────┘

Legend:
✓ = On Time (within grace)
Late = Late (beyond grace)
```

### Lateness Categories

```
Category Thresholds:
┌────────────────┬──────────────┬────────────┐
│ Category       │ Minutes Late │ Severity   │
├────────────────┼──────────────┼────────────┤
│ On Time        │ 0            │ None       │
│ Minor Late     │ 1-15         │ Low        │
│ Moderate Late  │ 16-30        │ Medium     │
│ Severe Late    │ 31-60        │ High       │
│ Extreme Late   │ 61+          │ Critical   │
└────────────────┴──────────────┴────────────┘

Actions by Category:
- Minor: Track only
- Moderate: Manager notification
- Severe: Formal warning
- Extreme: HR escalation
```

### Expected Outcome
- Late detection method functional
- Grace periods applied correctly
- Lateness categorized properly
- Pattern detection working (if implemented)

### Verification Checklist
- [ ] calculate_lateness() method defined
- [ ] Raw lateness calculation correct
- [ ] Grace period loading works
- [ ] Grace period application accurate
- [ ] is_late flag determined correctly
- [ ] Category assignment proper
- [ ] Excused lateness handled
- [ ] Pattern detection implemented (optional)
- [ ] Return value complete and accurate

---

## Task 38: Implement Early Leave Detection

### Overview
Implement calculate_early_departure() method that determines if an employee clocked out early, calculates minutes of early departure, applies grace periods, and handles various early-leave scenarios.

### Dependencies
- Shift model has end_time and early_leave_grace_minutes
- Clock-out time available
- Similar to late detection logic

### Instructions

1. **Define method signature**
   - Accept clock_out_time parameter (DateTime)
   - Accept scheduled_end_time parameter (Time)
   - Accept shift parameter (optional, for grace period)
   - Return dictionary with is_early, early_minutes, severity

2. **Combine date and scheduled time**
   - Get date from clock_out_time
   - Combine with scheduled_end_time
   - Create scheduled_end_datetime
   - Handle overnight shifts (may be next day)

3. **Calculate raw early departure**
   - Calculate difference: scheduled_end_datetime - clock_out_time
   - Convert to total minutes
   - If negative (stayed late), set raw_early_minutes = 0
   - If positive (left early), store value

4. **Load early departure grace period**
   - Check shift-specific early grace
   - Fallback to tenant default
   - Typical: 5-10 minutes
   - Store early_grace_minutes value

5. **Apply grace period**
   - Subtract grace from raw_early_minutes
   - adjusted_early_minutes = max(0, raw_early_minutes - grace_period)
   - Final early_departure_minutes value

6. **Determine is_early flag**
   - If adjusted_early_minutes > 0: is_early = True
   - Else: is_early = False

7. **Categorize severity**
   - If early_minutes == 0: "On Time Departure"
   - If early_minutes <= 15: "Minor Early"
   - If early_minutes <= 30: "Moderate Early"
   - If early_minutes > 30: "Significant Early"

8. **Check for approved early leave**
   - Query for early departure requests
   - Check emergency permissions
   - Mark as approved if exists
   - Store approval reference

9. **Calculate impact on pay**
   - If early and unapproved, may affect pay
   - Flag for manager review
   - Note in response

10. **Return early departure details**
    - Return is_early boolean
    - Return early_departure_minutes
    - Return raw_early_minutes
    - Return grace_period_applied
    - Return severity category
    - Return is_approved flag

### Early Departure Detection Flow

```
Early Departure Algorithm:
┌─────────────────────────────┐
│ Clock-Out: 05:40 PM         │
│ Scheduled End: 06:00 PM     │
│ Grace Period: 10 minutes    │
└──────────┬──────────────────┘
           │
           ▼
┌─────────────────────────────┐
│ Calculate Raw Early         │
│ 06:00 - 05:40 = 20 minutes  │
└──────────┬──────────────────┘
           │
           ▼
┌─────────────────────────────┐
│ Apply Grace Period          │
│ 20 - 10 = 10 minutes early  │
└──────────┬──────────────────┘
           │
           ▼
┌─────────────────────────────┐
│ Determine Status            │
│ 10 > 0 → is_early = True    │
│ 10 <= 15 → Minor Early      │
└─────────────────────────────┘
```

### Early Departure Examples

```
Early Departure Scenarios:
┌──────────┬──────────┬───────┬────────┬─────────┐
│ Clock-Out│ Schedule │ Grace │ Raw    │ Final   │
├──────────┼──────────┼───────┼────────┼─────────┤
│ 17:55    │ 18:00    │ 10    │ 5      │ 0 ✓     │
│ 17:50    │ 18:00    │ 10    │ 10     │ 0 ✓     │
│ 17:45    │ 18:00    │ 10    │ 15     │ 5 Early │
│ 17:30    │ 18:00    │ 10    │ 30     │ 20 Early│
│ 17:00    │ 18:00    │ 10    │ 60     │ 50 Early│
└──────────┴──────────┴───────┴────────┴─────────┘

✓ = On Time (within grace)
Early = Early Departure (beyond grace)
```

### Expected Outcome
- Early departure detection working
- Grace periods applied correctly
- Severity categorized appropriately
- Approved early leaves recognized

### Verification Checklist
- [ ] calculate_early_departure() method defined
- [ ] Raw early departure calculation correct
- [ ] Grace period loading functional
- [ ] Grace period application accurate
- [ ] is_early flag determined correctly
- [ ] Severity categorization proper
- [ ] Approved early leave handling works
- [ ] Pay impact flagged if needed
- [ ] Return value complete

---

## Task 39: Implement Status Determination

### Overview
Implement determine_status() method that analyzes attendance record and determines final status (PRESENT, ABSENT, LATE, HALF_DAY, etc.) based on clock times, hours worked, and business rules.

### Dependencies
- All previous methods implemented
- AttendanceStatus choices defined
- Working hours calculated
- Late/early detection complete

### Instructions

1. **Define method signature**
   - Accept attendance_record parameter (AttendanceRecord object)
   - Return final status string
   - Return status details dictionary

2. **Check for special day types first**
   - If date is public holiday: check if clocked in
   - If holiday + attendance: Status = "HOLIDAY_WORKING"
   - If holiday + no attendance: Status = "HOLIDAY"
   - If weekly off + attendance: Status = "WEEKEND_WORKING"
   - If weekly off + no attendance: Status = "WEEKEND"

3. **Check for approved leave**
   - Query leave records for employee + date
   - If full day leave approved: Status = "ON_LEAVE"
   - If half day leave: proceed to check attendance
   - Consider leave type in status details

4. **Check clock-in status**
   - If clock_in is NULL: Status = "ABSENT"
   - Cannot proceed without clock-in

5. **Check clock-out status**
   - If clock_out is NULL: Status = "INCOMPLETE"
   - Or Status = "MISSING_CLOCK_OUT"
   - Flag for auto-clock-out or correction

6. **Calculate and check working hours**
   - Get work_hours from attendance_record
   - Load full_day_threshold from config (e.g., 8.0 hours)
   - Load half_day_threshold from config (e.g., 4.0 hours)

7. **Determine based on hours worked**
   - If work_hours >= full_day_threshold:
     - Base status: "PRESENT"
   - Else if work_hours >= half_day_threshold:
     - Status: "HALF_DAY"
   - Else:
     - Status: "INSUFFICIENT_HOURS"

8. **Apply late/early modifiers**
   - If is_late flag is True:
     - Append to status or create modifier
     - Status display: "PRESENT (Late)"
   - If is_early flag is True:
     - Status display: "PRESENT (Early Departure)"
   - If both late and early:
     - Status display: "PRESENT (Late & Early)"

9. **Check overtime flag**
   - If overtime_hours > 0:
     - Add overtime modifier
     - Status: "PRESENT (With Overtime)"

10. **Handle partial leave combinations**
    - If leave_hours + work_hours >= full_day:
      - Status: "PRESENT (Partial Leave)"
    - If leave_hours + work_hours >= half_day:
      - Status: "HALF_DAY (Partial Leave)"

11. **Determine requires_approval flag**
    - Set True if:
      - Early departure > threshold
      - Insufficient hours
      - Overtime not pre-approved
      - Policy violations detected

12. **Return status and details**
    - Return final_status string
    - Return status_category (present/absent/leave)
    - Return modifiers list (late, early, overtime)
    - Return requires_approval flag
    - Return pay_percentage (100%, 50%, 0%)

### Status Decision Tree

```
Status Determination Logic:
┌───────────────────┐
│ Start             │
└─────────┬─────────┘
          │
          ▼
    Is Holiday? ──Yes──> HOLIDAY or HOLIDAY_WORKING
          │
         No
          ▼
   Is Weekly Off? ──Yes──> WEEKEND or WEEKEND_WORKING
          │
         No
          ▼
    Has Leave? ──Yes──> ON_LEAVE or partial check
          │
         No
          ▼
   Has Clock-In? ──No──> ABSENT
          │
        Yes
          ▼
   Has Clock-Out? ──No──> INCOMPLETE
          │
        Yes
          ▼
  ┌────────────────────┐
  │ Check Hours Worked │
  └─────────┬──────────┘
            │
            ▼
   Hours >= 8? ──Yes──> PRESENT (check modifiers)
            │
           No
            ▼
   Hours >= 4? ──Yes──> HALF_DAY (check modifiers)
            │
           No
            ▼
    INSUFFICIENT_HOURS
```

### Status Examples

```
Status Determination Examples:
┌──────────┬─────────┬───────┬────────┬────────────────────┐
│ Clock-In │Clock-Out│ Hours │ Late?  │ Status             │
├──────────┼─────────┼───────┼────────┼────────────────────┤
│ 09:00    │ 18:00   │ 8.0   │ No     │ PRESENT            │
│ 09:20    │ 18:00   │ 7.67  │ Yes    │ PRESENT (Late)     │
│ 09:00    │ 17:30   │ 7.5   │ No     │ PRESENT (Early)    │
│ 09:00    │ 13:00   │ 4.0   │ No     │ HALF_DAY           │
│ 12:00    │ 18:00   │ 6.0   │ Yes    │ HALF_DAY (Late)    │
│ NULL     │ NULL    │ 0     │ -      │ ABSENT             │
│ 09:00    │ NULL    │ -     │ -      │ INCOMPLETE         │
│ -        │ -       │ -     │ Leave  │ ON_LEAVE           │
└──────────┴─────────┴───────┴────────┴────────────────────┘
```

### Expected Outcome
- Status determination accurate for all scenarios
- Hours thresholds applied correctly
- Modifiers (late/early/overtime) applied properly
- Special day types handled

### Verification Checklist
- [ ] determine_status() method defined
- [ ] Holiday/weekend check first
- [ ] Leave check implemented
- [ ] Clock-in/out validation works
- [ ] Hours threshold comparison correct
- [ ] Full day vs half day logic accurate
- [ ] Late/early modifiers applied
- [ ] Overtime flag considered
- [ ] Partial leave handling works
- [ ] requires_approval flag set correctly
- [ ] Return value complete with all details

---

## Task 40: Implement Work Hours Calculation

### Overview
Implement calculate_hours() method that precisely calculates total work duration, deducts break time, determines actual working hours, calculates overtime, and applies rounding rules per tenant policy.

### Dependencies
- Clock-in and clock-out times exist
- Break time configuration available
- Overtime rules defined
- Rounding policies configured

### Instructions

1. **Define method signature**
   - Accept attendance_record parameter
   - Accept include_breaks parameter (default False)
   - Return hours summary dictionary

2. **Extract time values**
   - Get clock_in_time from attendance_record
   - Get clock_out_time from attendance_record
   - Validate both are not NULL
   - Ensure clock_out > clock_in

3. **Calculate total duration**
   - Calculate time delta: clock_out_time - clock_in_time
   - Convert to total seconds
   - Convert to total minutes
   - Convert to decimal hours
   - Store as total_duration_hours

4. **Determine break duration**
   - Check if breaks tracked separately (Break model records)
   - If tracked: Query and sum all break durations
   - If not tracked: Use shift default break time
   - If no breaks configured: break_duration = 0
   - Validate break_duration <= total_duration

5. **Calculate actual working hours**
   - If include_breaks parameter is False (typical):
     - working_hours = total_duration - break_duration
   - If include_breaks is True:
     - working_hours = total_duration
   - Ensure working_hours >= 0

6. **Apply rounding rules**
   - Load tenant rounding policy
   - Options: none, 0.25 hours, 0.5 hours, 1 hour
   - Round working_hours accordingly
   - Store both raw and rounded values

7. **Calculate overtime**
   - Get shift scheduled_hours from shift assignment
   - Get overtime_threshold from config (or use scheduled_hours)
   - If working_hours > overtime_threshold:
     - overtime_hours = working_hours - overtime_threshold
     - regular_hours = overtime_threshold
   - Else:
     - overtime_hours = 0
     - regular_hours = working_hours

8. **Determine overtime category**
   - If overtime_hours > 0 and overtime_hours <= 2: "Regular OT"
   - If overtime_hours > 2 and overtime_hours <= 4: "Extended OT"
   - If overtime_hours > 4: "Excessive OT"

9. **Calculate pay implications**
   - regular_pay_hours = regular_hours
   - overtime_pay_hours = overtime_hours * overtime_multiplier
   - total_payable_hours = regular_pay_hours + overtime_pay_hours

10. **Validate calculated values**
    - Ensure working_hours <= 16 (reasonable daily max)
    - Ensure working_hours >= 0
    - Ensure break_duration reasonable
    - Flag anomalies

11. **Store in attendance record**
    - Update attendance_record.work_hours
    - Update attendance_record.break_hours
    - Update attendance_record.effective_hours
    - Update attendance_record.overtime_hours
    - Save record

12. **Return calculation summary**
    - Return total_duration
    - Return break_duration
    - Return working_hours (raw and rounded)
    - Return overtime_hours
    - Return regular_hours
    - Return payable_hours
    - Return calculation_details

### Hours Calculation Flow

```
Work Hours Calculation:
┌─────────────────────────────┐
│ Clock-In: 09:00 AM          │
│ Clock-Out: 06:00 PM         │
└──────────┬──────────────────┘
           │
           ▼
┌─────────────────────────────┐
│ Total Duration              │
│ 18:00 - 09:00 = 9 hours     │
└──────────┬──────────────────┘
           │
           ▼
┌─────────────────────────────┐
│ Break Deduction             │
│ 9 hours - 1 hour = 8 hours  │
└──────────┬──────────────────┘
           │
           ▼
┌─────────────────────────────┐
│ Apply Rounding (0.25)       │
│ 8.0 hours (no rounding)     │
└──────────┬──────────────────┘
           │
           ▼
┌─────────────────────────────┐
│ Overtime Check              │
│ 8.0 <= 8.5 → No OT          │
└──────────┬──────────────────┘
           │
           ▼
┌─────────────────────────────┐
│ Result:                     │
│ Working Hours: 8.0          │
│ Overtime: 0                 │
│ Payable: 8.0                │
└─────────────────────────────┘
```

### Rounding Examples

```
Rounding Methods:
┌─────────┬──────────────┬─────────┬────────┬────────┐
│ Raw     │ No Rounding  │ 0.25    │ 0.5    │ 1.0    │
├─────────┼──────────────┼─────────┼────────┼────────┤
│ 8.00    │ 8.00         │ 8.00    │ 8.0    │ 8.0    │
│ 8.10    │ 8.10         │ 8.00    │ 8.0    │ 8.0    │
│ 8.13    │ 8.13         │ 8.25    │ 8.0    │ 8.0    │
│ 8.25    │ 8.25         │ 8.25    │ 8.5    │ 8.0    │
│ 8.40    │ 8.40         │ 8.50    │ 8.5    │ 8.0    │
│ 8.50    │ 8.50         │ 8.50    │ 8.5    │ 9.0    │
│ 8.75    │ 8.75         │ 8.75    │ 9.0    │ 9.0    │
└─────────┴──────────────┴─────────┴────────┴────────┘

Most Common: 0.25 hours (15 minutes)
```

### Overtime Calculation

```
Overtime Example:
Scheduled: 8 hours
Overtime Threshold: 8.5 hours
Worked: 10 hours

Breakdown:
- Regular Hours: 8.5 hours @ 1.0x
- Overtime Hours: 1.5 hours @ 1.5x

Pay Calculation:
- Regular Pay: 8.5 hours
- Overtime Pay: 1.5 × 1.5 = 2.25 hours equivalent
- Total Payable: 8.5 + 2.25 = 10.75 hours
```

### Expected Outcome
- Work hours calculated precisely
- Break time deducted correctly
- Rounding applied per policy
- Overtime calculated accurately
- All values validated

### Verification Checklist
- [ ] calculate_hours() method defined
- [ ] Time extraction working
- [ ] Total duration calculation correct
- [ ] Break duration determined properly
- [ ] Working hours calculated accurately
- [ ] Rounding rules applied correctly
- [ ] Overtime calculation functional
- [ ] Overtime category determined
- [ ] Pay implications calculated
- [ ] Validation checks in place
- [ ] Attendance record updated
- [ ] Return value complete with all details

---

## Summary

This document implemented the core AttendanceService with complete clock-in/out processing, shift lookup, late/early detection, status determination, and precise hours calculation. All methods work together to provide comprehensive attendance management.

### Completed Tasks
✅ Task 33: AttendanceService class created with proper initialization  
✅ Task 34: Clock-in method with full validation and recording  
✅ Task 35: Clock-out method with hours calculation and status finalization  
✅ Task 36: Shift lookup with priority rules and caching  
✅ Task 37: Late detection with grace periods and categorization  
✅ Task 38: Early departure detection and severity classification  
✅ Task 39: Status determination with comprehensive business rules  
✅ Task 40: Work hours calculation with overtime and rounding

### Key Deliverables
- Complete AttendanceService class with 8 core methods
- Full clock-in/out workflow implementation
- Intelligent shift lookup with fallback logic
- Accurate late/early detection algorithms
- Comprehensive status determination rules
- Precise work hours and overtime calculations

### Next Steps
Proceed to Group C Document 02 to implement biometric integration, mobile check-in with GPS geofencing, and attendance regularization workflows.
