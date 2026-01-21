# Group D: Overtime & Calculations

> **Phase:** 06 - ERP Advanced Modules  
> **SubPhase:** 03 - Attendance System  
> **Group:** D of F  
> **Tasks Covered:** 49-62  
> **Group Goal:** Implement overtime tracking, calculations, and attendance settings

---

## Navigation

- **↑ Parent:** [SubPhase-03 Summary](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [Group C: Check-In/Out Processing](../Group-C_CheckIn-Out-Processing/)
- **→ Next Group:** [Group E: Reports & Analytics](../Group-E_Reports-Analytics/)

---

## Group Overview

### Key Outcomes

1. **OvertimeService Class** - Service for overtime calculations
2. **Overtime Detection** - Detect overtime based on shift rules
3. **Overtime Calculation** - Calculate hours with multipliers
4. **OvertimeRequest Model** - Employee overtime request
5. **Overtime Request Fields** - date, hours, reason, approved_by
6. **Overtime Approval Workflow** - Request → Approval → Applied
7. **OvertimeRequest Migrations** - Apply migrations
8. **AttendanceSettings Model** - Tenant-level settings
9. **Default Grace Period Settings** - Late/early leave grace
10. **Overtime Settings** - Require approval, max hours
11. **Geofencing Settings** - Office locations, radius
12. **AttendanceSettings Migrations** - Apply migrations
13. **Daily Attendance Celery Task** - Mark absent for no clock-in
14. **End of Day Celery Task** - Auto clock-out

### Technology Context

| Technology | Purpose |
|------------|---------|
| Service Layer | Overtime logic |
| Celery | Scheduled tasks |
| Workflow | Approval process |
| Tenant Settings | Per-tenant config |

---

## Documents in This Group

| # | Document | Tasks | Description |
|---|----------|-------|-------------|
| 01 | `01_Tasks-49-55_Overtime-Service-Request.md` | 49-55 | OvertimeService, request model, approval |
| 02 | `02_Tasks-56-62_Settings-Celery-Tasks.md` | 56-62 | AttendanceSettings, Celery tasks |

---

## Task Summary

| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 49 | Create OvertimeService Class | High | 30 min |
| 50 | Implement Overtime Detection | Medium | 25 min |
| 51 | Implement Overtime Calculation | Medium | 25 min |
| 52 | Create OvertimeRequest Model | Medium | 25 min |
| 53 | Add Overtime Request Fields | Medium | 20 min |
| 54 | Implement Overtime Approval Workflow | High | 30 min |
| 55 | Run OvertimeRequest Migrations | Low | 15 min |
| 56 | Create AttendanceSettings Model | Medium | 25 min |
| 57 | Add Default Grace Period Settings | Low | 15 min |
| 58 | Add Overtime Settings | Medium | 20 min |
| 59 | Add Geofencing Settings | Medium | 25 min |
| 60 | Run AttendanceSettings Migrations | Low | 15 min |
| 61 | Create Daily Attendance Celery Task | High | 30 min |
| 62 | Create End of Day Celery Task | High | 30 min |

---

## Execution Order

```
[Tasks 49-55: OvertimeService, request model, approval]
         │
         ▼
[Tasks 56-62: Settings, Celery tasks]
```

---

## Expected Deliverables

```
apps/attendance/
├── services/
│   └── overtime_service.py       # Tasks 49-51
├── models/
│   ├── overtime_request.py       # Tasks 52-53
│   └── attendance_settings.py    # Tasks 56-59
├── workflows/
│   └── overtime_workflow.py      # Task 54
├── tasks/
│   ├── __init__.py
│   └── daily_tasks.py            # Tasks 61-62
└── migrations/
    ├── 0004_overtime_request.py  # Task 55
    └── 0005_settings.py          # Task 60
```

---

## Notes for AI Agents

### OvertimeService Methods
- detect_overtime(attendance_record)
- calculate_overtime(record, shift)
- get_overtime_hours(employee_id, date_range)
- approve_overtime(request_id, approved_by)
- reject_overtime(request_id, reason, rejected_by)
- get_pending_requests(department_id)

### Overtime Detection
```
Shift: 09:00 - 17:30 (8 hours work)
OT Starts After: 8.5 hours

Clock In: 09:00
Clock Out: 20:00

Work Hours: 11 hours
Overtime: 11 - 8.5 = 2.5 hours
```

### Overtime Calculation with Multiplier
```
Base Rate: Rs. 500/hour
OT Multiplier: 1.5x

OT Hours: 2.5
OT Pay: 2.5 × 500 × 1.5 = Rs. 1,875

Weekend OT Multiplier: 2.0x
Weekend OT Pay: 2.5 × 500 × 2.0 = Rs. 2,500
```

### OvertimeRequest Fields
- employee: FK to Employee
- attendance_record: FK to AttendanceRecord (nullable)
- date: DateField
- planned_hours: Decimal
- actual_hours: Decimal (after completion)
- reason: TextField
- status: Choice (PENDING, APPROVED, REJECTED, COMPLETED)
- requested_at: DateTimeField
- approved_by: FK to User
- approved_at: DateTimeField
- completed_at: DateTimeField
- rejection_reason: TextField

### Overtime Workflow
```
Pre-Approval Flow:
Employee Request → Manager Approval → 
Work Overtime → Record Hours → Complete

Post-Approval Flow:
Work Overtime → Auto-Detect → 
Manager Review → Approve/Reject
```

### AttendanceSettings Fields
- tenant: OneToOne to Client
- default_late_grace_minutes: Integer
- default_early_leave_grace_minutes: Integer
- require_overtime_approval: Boolean
- max_overtime_hours_per_day: Decimal
- max_overtime_hours_per_month: Decimal
- weekend_overtime_multiplier: Decimal
- holiday_overtime_multiplier: Decimal
- enable_geofencing: Boolean
- geofence_radius_meters: Integer
- office_locations: JSONField
- auto_clock_out_time: TimeField
- mark_absent_after_hours: Integer

### Office Locations JSON
```json
{
  "offices": [
    {
      "id": "office-1",
      "name": "Head Office",
      "latitude": 6.9271,
      "longitude": 79.8612,
      "radius": 200
    },
    {
      "id": "office-2",
      "name": "Branch Office",
      "latitude": 7.2906,
      "longitude": 80.6337,
      "radius": 150
    }
  ]
}
```

### Daily Attendance Celery Task
```
Schedule: Daily at 23:59 (Asia/Colombo)

Process:
1. Get all active employees
2. For each employee without clock_in today:
   a. Check if on approved leave → ON_LEAVE
   b. Check if public holiday → HOLIDAY
   c. Check if weekend/non-working → WEEKEND
   d. Otherwise → ABSENT
3. Create AttendanceRecord with status
```

### End of Day Celery Task
```
Schedule: Daily at auto_clock_out_time (e.g., 22:00)

Process:
1. Get records with clock_in but no clock_out
2. For each record:
   a. Set clock_out = auto_clock_out_time
   b. Set clock_out_method = SYSTEM
   c. Calculate work hours
   d. Flag for review (is_auto_clocked_out = True)
3. Send notification to employee and manager
```

### Celery Beat Configuration
```
CELERY_BEAT_SCHEDULE = {
    'mark-absent-employees': {
        'task': 'attendance.tasks.mark_absent_employees',
        'schedule': crontab(hour=23, minute=59),
    },
    'auto-clock-out': {
        'task': 'attendance.tasks.auto_clock_out',
        'schedule': crontab(hour=22, minute=0),
    },
}
```
