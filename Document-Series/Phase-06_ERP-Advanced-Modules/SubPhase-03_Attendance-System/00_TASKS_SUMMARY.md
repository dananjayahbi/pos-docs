# SubPhase 03: Attendance System - Tasks Summary

> **Phase:** 06 - ERP Advanced Modules  
> **SubPhase Index:** 03 of 14  
> **SubPhase Goal:** Track employee attendance with clock in/out, overtime, and reporting  
> **Total Tasks:** 88 | **Status:** Planning  
> **Estimated Duration:** 12-14 hours

---

## Navigation

- **↑ Parent:** [00_SUBPHASES_SUMMARY.md](../00_SUBPHASES_SUMMARY.md)
- **← Previous SubPhase:** [SubPhase-02_Department-Designations](../SubPhase-02_Department-Designations/)
- **→ Next SubPhase:** [SubPhase-04_Leave-Management](../SubPhase-04_Leave-Management/)

---

## SubPhase Overview

This sub-phase implements a complete attendance tracking system for HR operations. Supports multiple check-in methods (web, mobile, biometric API), shift management, late arrival tracking, overtime calculation, and comprehensive attendance reports.

### Key Outcomes
- AttendanceRecord model with clock in/out times
- Multiple check-in methods support
- Shift definition and scheduling
- Late arrival and early departure tracking
- Overtime hours calculation
- Work hours computation
- Attendance status (Present, Absent, Late, Half-day)
- Attendance regularization workflow
- Daily, weekly, monthly attendance reports
- Integration with payroll for attendance-based pay

### Technology Context
- **Backend:** Django 5.x with DRF for API
- **Timezone:** Asia/Colombo for Sri Lanka
- **Biometric:** API integration for biometric devices
- **Frontend:** Next.js 14+ with TypeScript
- **Real-time:** WebSocket for live attendance dashboard

### Dependencies
- Phase-06 SubPhase-01: Employee model
- Phase-06 SubPhase-02: Department model

---

## Task Execution Order

```
TASK GROUP A: Shift & Schedule Models (Tasks 01-16)
        │
        ▼
TASK GROUP B: Attendance Record Model (Tasks 17-32)
        │
        ▼
TASK GROUP C: Check-In/Out Processing (Tasks 33-48)
        │
        ▼
TASK GROUP D: Overtime & Calculations (Tasks 49-62)
        │
        ▼
TASK GROUP E: Reports & Analytics (Tasks 63-76)
        │
        ▼
TASK GROUP F: API, Testing & Documentation (Tasks 77-88)
```

---

## Task Index

### Group A: Shift & Schedule Models (Tasks 01-16)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 01 | **Create attendance Django App** | Create new Django app for attendance tracking | None | 🔴 Not Created |
| 02 | **Register attendance App** | Add attendance app to TENANT_APPS | Task 01 | 🔴 Not Created |
| 03 | **Define ShiftType Choices** | Create enum: REGULAR, MORNING, EVENING, NIGHT, FLEXIBLE | Task 01 | 🔴 Not Created |
| 04 | **Create Shift Model Core** | Define Shift with name, code, shift_type | Task 03 | 🔴 Not Created |
| 05 | **Add Shift Time Fields** | Add start_time, end_time, break_start, break_end | Task 04 | 🔴 Not Created |
| 06 | **Add Shift Duration Fields** | Add work_hours, break_duration (calculated) | Task 04 | 🔴 Not Created |
| 07 | **Add Shift Grace Period** | Add late_grace_minutes, early_leave_grace_minutes | Task 04 | 🔴 Not Created |
| 08 | **Add Shift Overtime Rules** | Add overtime_start_after, overtime_multiplier | Task 04 | 🔴 Not Created |
| 09 | **Add Shift Half-Day Threshold** | Add min_hours_for_half_day, min_hours_for_full_day | Task 04 | 🔴 Not Created |
| 10 | **Run Shift Model Migrations** | Generate and apply migrations | Task 09 | 🔴 Not Created |
| 11 | **Create ShiftSchedule Model** | Assign shifts to employees by date range | Task 10 | 🔴 Not Created |
| 12 | **Add Schedule Date Fields** | Add effective_from, effective_to, is_recurring | Task 11 | 🔴 Not Created |
| 13 | **Add Schedule Weekday Fields** | Add applicable_days (Monday-Sunday flags) | Task 11 | 🔴 Not Created |
| 14 | **Add Schedule Employee FK** | Add employee FK for individual schedules | Task 11 | 🔴 Not Created |
| 15 | **Add Schedule Department FK** | Add department FK for department-wide schedules | Task 11 | 🔴 Not Created |
| 16 | **Run ShiftSchedule Migrations** | Generate and apply migrations | Task 15 | 🔴 Not Created |

---

### Group B: Attendance Record Model (Tasks 17-32)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 17 | **Define AttendanceStatus Choices** | Create enum: PRESENT, ABSENT, LATE, HALF_DAY, ON_LEAVE, HOLIDAY, WEEKEND | Task 16 | 🔴 Not Created |
| 18 | **Define CheckInMethod Choices** | Create enum: WEB, MOBILE, BIOMETRIC, MANUAL, IMPORT | Task 16 | 🔴 Not Created |
| 19 | **Create AttendanceRecord Model** | Define core attendance record model | Task 18 | 🔴 Not Created |
| 20 | **Add Record Employee FK** | Add employee ForeignKey | Task 19 | 🔴 Not Created |
| 21 | **Add Record Date Field** | Add date field (unique per employee per day) | Task 19 | 🔴 Not Created |
| 22 | **Add Clock In/Out Fields** | Add clock_in, clock_out datetime fields | Task 19 | 🔴 Not Created |
| 23 | **Add Check-In Method Fields** | Add clock_in_method, clock_out_method | Task 19 | 🔴 Not Created |
| 24 | **Add Status Field** | Add status using AttendanceStatus choices | Task 19 | 🔴 Not Created |
| 25 | **Add Shift Reference** | Add shift FK to scheduled shift | Task 19 | 🔴 Not Created |
| 26 | **Add Work Hours Fields** | Add work_hours, break_hours, effective_hours | Task 19 | 🔴 Not Created |
| 27 | **Add Late/Early Fields** | Add late_minutes, early_departure_minutes | Task 19 | 🔴 Not Created |
| 28 | **Add Overtime Fields** | Add overtime_hours, overtime_approved | Task 19 | 🔴 Not Created |
| 29 | **Add Location Fields** | Add clock_in_location, clock_out_location (GPS) | Task 19 | 🔴 Not Created |
| 30 | **Add IP Address Fields** | Add clock_in_ip, clock_out_ip for web check-in | Task 19 | 🔴 Not Created |
| 31 | **Add Record Indexes** | Add indexes for employee, date, status | Task 19 | 🔴 Not Created |
| 32 | **Run AttendanceRecord Migrations** | Generate and apply migrations | Task 31 | 🔴 Not Created |

---

### Group C: Check-In/Out Processing (Tasks 33-48)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 33 | **Create AttendanceService Class** | Main service for attendance operations | Task 32 | 🔴 Not Created |
| 34 | **Implement Clock In Method** | Record employee clock in with method | Task 33 | 🔴 Not Created |
| 35 | **Implement Clock Out Method** | Record employee clock out, calculate hours | Task 33 | 🔴 Not Created |
| 36 | **Implement Get Current Shift** | Determine applicable shift for employee/date | Task 33 | 🔴 Not Created |
| 37 | **Implement Late Detection** | Detect and calculate late arrival | Task 33 | 🔴 Not Created |
| 38 | **Implement Early Leave Detection** | Detect and calculate early departure | Task 33 | 🔴 Not Created |
| 39 | **Implement Status Determination** | Determine PRESENT, LATE, HALF_DAY based on rules | Task 33 | 🔴 Not Created |
| 40 | **Implement Work Hours Calculation** | Calculate effective work hours | Task 33 | 🔴 Not Created |
| 41 | **Create BiometricIntegration Service** | API for biometric device integration | Task 33 | 🔴 Not Created |
| 42 | **Implement Biometric Event Handler** | Process events from biometric devices | Task 41 | 🔴 Not Created |
| 43 | **Create MobileCheckIn Service** | Mobile app check-in with GPS validation | Task 33 | 🔴 Not Created |
| 44 | **Implement GPS Geofencing** | Validate check-in location within office | Task 43 | 🔴 Not Created |
| 45 | **Create AttendanceRegularization Model** | Request to correct attendance | Task 32 | 🔴 Not Created |
| 46 | **Add Regularization Fields** | Add original_in, original_out, corrected_in, corrected_out, reason | Task 45 | 🔴 Not Created |
| 47 | **Implement Regularization Workflow** | Request → Manager Approval → Apply | Task 46 | 🔴 Not Created |
| 48 | **Run Regularization Migrations** | Generate and apply migrations | Task 47 | 🔴 Not Created |

---

### Group D: Overtime & Calculations (Tasks 49-62)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 49 | **Create OvertimeService Class** | Service for overtime calculations | Task 48 | 🔴 Not Created |
| 50 | **Implement Overtime Detection** | Detect overtime based on shift rules | Task 49 | 🔴 Not Created |
| 51 | **Implement Overtime Calculation** | Calculate overtime hours with multipliers | Task 49 | 🔴 Not Created |
| 52 | **Create OvertimeRequest Model** | Employee overtime request | Task 48 | 🔴 Not Created |
| 53 | **Add Overtime Request Fields** | Add date, hours, reason, approved_by | Task 52 | 🔴 Not Created |
| 54 | **Implement Overtime Approval Workflow** | Request → Approval → Applied to record | Task 53 | 🔴 Not Created |
| 55 | **Run OvertimeRequest Migrations** | Generate and apply migrations | Task 54 | 🔴 Not Created |
| 56 | **Create AttendanceSettings Model** | Tenant-level attendance settings | Task 55 | 🔴 Not Created |
| 57 | **Add Default Grace Period Settings** | Add default late grace, early leave grace | Task 56 | 🔴 Not Created |
| 58 | **Add Overtime Settings** | Add require_ot_approval, max_ot_hours_per_day | Task 56 | 🔴 Not Created |
| 59 | **Add Geofencing Settings** | Add office_locations, geofence_radius | Task 56 | 🔴 Not Created |
| 60 | **Run AttendanceSettings Migrations** | Generate and apply migrations | Task 59 | 🔴 Not Created |
| 61 | **Create Daily Attendance Celery Task** | Mark absent for no clock-in | Task 60 | 🔴 Not Created |
| 62 | **Create End of Day Celery Task** | Auto clock-out for forgotten punch-outs | Task 60 | 🔴 Not Created |

---

### Group E: Reports & Analytics (Tasks 63-76)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 63 | **Create AttendanceReportService** | Service for generating attendance reports | Task 62 | 🔴 Not Created |
| 64 | **Implement Daily Report** | Daily attendance summary by department | Task 63 | 🔴 Not Created |
| 65 | **Implement Weekly Report** | Weekly attendance summary per employee | Task 63 | 🔴 Not Created |
| 66 | **Implement Monthly Report** | Monthly attendance with totals | Task 63 | 🔴 Not Created |
| 67 | **Implement Employee Report** | Individual employee attendance history | Task 63 | 🔴 Not Created |
| 68 | **Implement Department Report** | Department-level attendance metrics | Task 63 | 🔴 Not Created |
| 69 | **Create Late Arrival Report** | List of late arrivals with minutes | Task 63 | 🔴 Not Created |
| 70 | **Create Overtime Report** | Overtime hours summary by employee | Task 63 | 🔴 Not Created |
| 71 | **Create Absence Report** | List of absences for date range | Task 63 | 🔴 Not Created |
| 72 | **Implement Attendance Percentage** | Calculate attendance % per employee/dept | Task 63 | 🔴 Not Created |
| 73 | **Create Report Export Service** | Export reports to Excel/PDF | Task 72 | 🔴 Not Created |
| 74 | **Create Attendance Dashboard Data** | Aggregate data for dashboard widgets | Task 72 | 🔴 Not Created |
| 75 | **Implement Real-time Dashboard** | Live attendance status WebSocket | Task 74 | 🔴 Not Created |
| 76 | **Create Payroll Integration Data** | Export attendance for payroll processing | Task 74 | 🔴 Not Created |

---

### Group F: API, Testing & Documentation (Tasks 77-88)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 77 | **Create ShiftSerializer** | DRF serializer for Shift model | Task 76 | 🔴 Not Created |
| 78 | **Create AttendanceRecordSerializer** | DRF serializer for AttendanceRecord | Task 77 | 🔴 Not Created |
| 79 | **Create RegularizationSerializer** | DRF serializer for regularization requests | Task 77 | 🔴 Not Created |
| 80 | **Create ShiftViewSet** | ViewSet for shift CRUD operations | Task 79 | 🔴 Not Created |
| 81 | **Create AttendanceViewSet** | ViewSet for attendance records | Task 80 | 🔴 Not Created |
| 82 | **Create CheckInView** | API endpoint for clock in/out | Task 81 | 🔴 Not Created |
| 83 | **Create RegularizationViewSet** | ViewSet for regularization workflow | Task 81 | 🔴 Not Created |
| 84 | **Implement Attendance Filtering** | Filter by date, employee, department, status | Task 81 | 🔴 Not Created |
| 85 | **Create BiometricWebhook View** | Webhook for biometric device events | Task 81 | 🔴 Not Created |
| 86 | **Register Attendance API URLs** | Add all endpoints to URL config | Task 85 | 🔴 Not Created |
| 87 | **Create Attendance Module Tests** | Unit and integration tests | Task 86 | 🔴 Not Created |
| 88 | **Create Attendance Documentation** | API docs, check-in methods guide | Task 87 | 🔴 Not Created |

---

## Expected File Structure

```
backend/apps/attendance/
├── __init__.py
├── admin.py                    # Admin for Shift, AttendanceRecord
├── apps.py                     # App configuration
├── models/
│   ├── __init__.py
│   ├── shift.py               # Shift model
│   ├── shift_schedule.py      # ShiftSchedule model
│   ├── attendance_record.py   # AttendanceRecord model
│   ├── regularization.py      # AttendanceRegularization model
│   ├── overtime_request.py    # OvertimeRequest model
│   └── attendance_settings.py # AttendanceSettings model
├── services/
│   ├── __init__.py
│   ├── attendance_service.py  # Main attendance operations
│   ├── overtime_service.py    # Overtime calculations
│   ├── biometric_service.py   # Biometric integration
│   ├── mobile_service.py      # Mobile check-in with GPS
│   └── report_service.py      # Attendance reports
├── serializers/
│   ├── __init__.py
│   ├── shift_serializer.py
│   ├── attendance_serializer.py
│   └── regularization_serializer.py
├── views/
│   ├── __init__.py
│   ├── shift_viewset.py       # Shift CRUD ViewSet
│   ├── attendance_viewset.py  # Attendance ViewSet
│   ├── checkin_view.py        # Clock in/out API
│   └── biometric_webhook.py   # Biometric webhook
├── tasks/
│   ├── __init__.py
│   ├── daily_tasks.py         # Mark absent, auto clock-out
│   └── report_tasks.py        # Report generation
├── filters.py                  # Attendance filtering
├── urls.py                     # URL routing
├── signals.py                  # Attendance signals
├── consumers.py                # WebSocket consumers
├── tests/
│   ├── __init__.py
│   ├── test_models.py
│   ├── test_services.py
│   ├── test_overtime.py
│   └── test_api.py
└── migrations/
```

---

## Attendance Status Flow

```
                        ┌─────────────────────────────┐
                        │      Employee Arrives       │
                        └─────────────┬───────────────┘
                                      │
                                      ▼
                        ┌─────────────────────────────┐
                        │        Clock In             │
                        │   (Web/Mobile/Biometric)    │
                        └─────────────┬───────────────┘
                                      │
                    ┌─────────────────┼─────────────────┐
                    │                 │                 │
                    ▼                 ▼                 ▼
           ┌─────────────┐   ┌─────────────┐   ┌─────────────┐
           │  ON TIME    │   │    LATE     │   │  VERY LATE  │
           │  (Within    │   │  (After     │   │  (Half-day  │
           │   grace)    │   │   grace)    │   │   cutoff)   │
           └─────────────┘   └─────────────┘   └─────────────┘
                    │                 │                 │
                    └────────┬────────┴─────────────────┘
                             │
                             ▼
                   ┌─────────────────────────────┐
                   │        Clock Out            │
                   └─────────────┬───────────────┘
                                 │
         ┌───────────────────────┼───────────────────────┐
         │                       │                       │
         ▼                       ▼                       ▼
  ┌─────────────┐       ┌─────────────┐       ┌─────────────┐
  │  FULL DAY   │       │  HALF DAY   │       │  OVERTIME   │
  │  (Normal)   │       │  (< min hrs)│       │  (> shift)  │
  └─────────────┘       └─────────────┘       └─────────────┘
```

---

## Shift Configuration Example

```
REGULAR SHIFT:
─────────────────────────────────────
Start Time:         09:00 AM
End Time:           05:30 PM
Break Start:        01:00 PM
Break End:          01:30 PM
Work Hours:         8 hours
Break Duration:     30 minutes
Late Grace:         15 minutes
Early Leave Grace:  10 minutes
OT Starts After:    8.5 hours
Half-Day Threshold: 4 hours
```

---

## GPS Geofencing

```
Office Location: 6.9271° N, 79.8612° E (Colombo)
Geofence Radius: 200 meters

VALIDATION:
─────────────────────────────────────
1. Employee opens mobile app
2. App captures GPS coordinates
3. Calculate distance to office center
4. If distance <= radius → Allow check-in
5. If distance > radius → Reject or flag
```

---

## Overtime Calculation

```
SHIFT: 9:00 AM - 5:30 PM (8 hours work)
ACTUAL: 9:00 AM - 8:00 PM

Calculation:
─────────────────────────────────────
Total Hours:      11 hours
Regular Hours:    8 hours
Break:            0.5 hours
Effective Hours:  10.5 hours
Overtime:         10.5 - 8 = 2.5 hours
OT Multiplier:    1.5x
OT Pay Hours:     2.5 × 1.5 = 3.75 hours
```

---

## Key Business Rules

1. **One Record Per Day:** Only one attendance record per employee per date
2. **Clock In First:** Cannot clock out without clock in
3. **No Future Dates:** Cannot clock in for future dates
4. **Shift Required:** Employee must have assigned shift
5. **Grace Period:** Configurable per shift
6. **Auto Absent:** Mark absent if no clock-in by end of day
7. **Regularization:** Allow correction with manager approval
8. **Overtime Approval:** Optional approval for overtime

---

## Progress Tracking

| Metric | Count |
|--------|-------|
| Total Tasks | 88 |
| Tasks Completed | 0 |
| Tasks In Progress | 0 |
| Completion Percentage | 0% |

**Last Updated:** 2026-01-17  
**Next Action:** Create Task 01 (attendance Django App)

---

## Notes for AI Agents

- Timezone handling critical (Asia/Colombo)
- Biometric integration via webhook/API
- GPS validation for mobile check-in
- Consider shift crossing midnight
- Attendance data feeds payroll calculation
- Real-time dashboard via WebSocket
- Support multiple offices with different geofences
- Consider public holidays integration

---

*End of SubPhase 03 Tasks Summary*
