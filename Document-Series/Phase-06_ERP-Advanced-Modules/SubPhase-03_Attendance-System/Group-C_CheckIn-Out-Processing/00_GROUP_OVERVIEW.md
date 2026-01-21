# Group C: Check-In/Out Processing

> **Phase:** 06 - ERP Advanced Modules  
> **SubPhase:** 03 - Attendance System  
> **Group:** C of F  
> **Tasks Covered:** 33-48  
> **Group Goal:** Implement check-in/out processing with multiple methods and regularization

---

## Navigation

- **↑ Parent:** [SubPhase-03 Summary](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [Group B: Attendance Record Model](../Group-B_Attendance-Record-Model/)
- **→ Next Group:** [Group D: Overtime & Calculations](../Group-D_Overtime-Calculations/)

---

## Group Overview

### Key Outcomes

1. **AttendanceService Class** - Main service for attendance operations
2. **Clock In Method** - Record employee clock in
3. **Clock Out Method** - Record clock out, calculate hours
4. **Get Current Shift** - Determine applicable shift
5. **Late Detection** - Detect and calculate late arrival
6. **Early Leave Detection** - Detect early departure
7. **Status Determination** - PRESENT, LATE, HALF_DAY logic
8. **Work Hours Calculation** - Calculate effective hours
9. **BiometricIntegration Service** - API for biometric devices
10. **Biometric Event Handler** - Process biometric events
11. **MobileCheckIn Service** - Mobile app with GPS
12. **GPS Geofencing** - Validate check-in location
13. **AttendanceRegularization Model** - Correction requests
14. **Regularization Fields** - Original, corrected times, reason
15. **Regularization Workflow** - Request → Approval → Apply
16. **Regularization Migrations** - Apply migrations

### Technology Context

| Technology | Purpose |
|------------|---------|
| Service Layer | Business logic |
| GPS/Geofencing | Location validation |
| Webhook | Biometric integration |
| Workflow | Approval process |

---

## Documents in This Group

| # | Document | Tasks | Description |
|---|----------|-------|-------------|
| 01 | `01_Tasks-33-40_Service-ClockInOut-Calculation.md` | 33-40 | AttendanceService, clock in/out, hours calculation |
| 02 | `02_Tasks-41-48_Biometric-Mobile-Regularization.md` | 41-48 | Biometric, mobile GPS, regularization workflow |

---

## Task Summary

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
| 41 | Create BiometricIntegration Service | High | 35 min |
| 42 | Implement Biometric Event Handler | High | 30 min |
| 43 | Create MobileCheckIn Service | High | 30 min |
| 44 | Implement GPS Geofencing | High | 30 min |
| 45 | Create AttendanceRegularization Model | Medium | 25 min |
| 46 | Add Regularization Fields | Medium | 20 min |
| 47 | Implement Regularization Workflow | High | 35 min |
| 48 | Run Regularization Migrations | Low | 15 min |

---

## Execution Order

```
[Tasks 33-40: AttendanceService, clock in/out, calculations]
         │
         ▼
[Tasks 41-48: Biometric, mobile, regularization]
```

---

## Expected Deliverables

```
apps/attendance/
├── services/
│   ├── __init__.py
│   ├── attendance_service.py     # Tasks 33-40
│   ├── biometric_service.py      # Tasks 41-42
│   └── mobile_service.py         # Tasks 43-44
├── models/
│   └── regularization.py         # Tasks 45-46
├── workflows/
│   └── regularization_workflow.py # Task 47
└── migrations/
    └── 0003_regularization.py    # Task 48
```

---

## Notes for AI Agents

### AttendanceService Methods
- clock_in(employee_id, method, location=None, ip=None)
- clock_out(employee_id, method, location=None, ip=None)
- get_current_shift(employee_id, date)
- detect_late(clock_in_time, shift)
- detect_early_leave(clock_out_time, shift)
- determine_status(record)
- calculate_work_hours(record)
- get_today_record(employee_id)
- get_employee_attendance(employee_id, date_range)

### Clock In Flow
```
1. Get or create AttendanceRecord for today
2. Validate no existing clock_in
3. Get applicable shift
4. Record clock_in time and method
5. Record location/IP if provided
6. Detect if late
7. Set initial status
8. Save record
9. Return confirmation
```

### Clock Out Flow
```
1. Get today's AttendanceRecord
2. Validate clock_in exists
3. Validate no existing clock_out
4. Record clock_out time and method
5. Record location/IP if provided
6. Detect early departure
7. Calculate work hours
8. Determine final status
9. Check overtime
10. Save record
11. Return summary
```

### Get Current Shift Priority
```
1. Employee-specific ShiftSchedule for date
2. Department ShiftSchedule for date
3. Default company shift

Check:
- effective_from <= date <= effective_to
- Applicable weekday flag is True
```

### Late Detection Logic
```
shift_start = 09:00
grace_minutes = 15
effective_start = 09:15

clock_in = 09:20

if clock_in > effective_start:
    late_minutes = (clock_in - effective_start).minutes
    → 5 minutes late
```

### Status Determination Matrix
| Condition | Status |
|-----------|--------|
| Work hours >= full_day_threshold | PRESENT |
| Work hours >= half_day_threshold | HALF_DAY |
| Late arrival (any) | LATE |
| No clock_in by EOD | ABSENT |
| On approved leave | ON_LEAVE |
| Public holiday | HOLIDAY |
| Weekend (non-working) | WEEKEND |

### BiometricIntegration Service
- register_device(device_id, device_info)
- sync_employees(device_id)
- process_event(device_id, employee_id, event_type, timestamp)
- get_device_status(device_id)

### Biometric Event Types
| Event | Action |
|-------|--------|
| PUNCH_IN | Clock in |
| PUNCH_OUT | Clock out |
| BREAK_START | Log break start |
| BREAK_END | Log break end |

### MobileCheckIn Service
- check_in(employee_id, location)
- check_out(employee_id, location)
- validate_location(location, office_locations)
- get_nearest_office(location)

### GPS Geofencing
```
Office: 6.9271° N, 79.8612° E
Radius: 200 meters

Employee Location: 6.9275° N, 79.8615° E

Distance = haversine(office, employee)
→ ~50 meters

if distance <= radius:
    → Allow check-in
else:
    → Reject or flag for review
```

### AttendanceRegularization Fields
- attendance_record: FK to AttendanceRecord
- employee: FK to Employee
- original_clock_in: DateTimeField
- original_clock_out: DateTimeField
- corrected_clock_in: DateTimeField
- corrected_clock_out: DateTimeField
- reason: TextField
- status: Choice (PENDING, APPROVED, REJECTED)
- requested_at: DateTimeField
- approved_by: FK to User
- approved_at: DateTimeField
- rejection_reason: TextField

### Regularization Workflow
```
Employee Request → Manager Review → 
├── Approved → Apply corrections to AttendanceRecord
└── Rejected → Notify employee with reason
```
