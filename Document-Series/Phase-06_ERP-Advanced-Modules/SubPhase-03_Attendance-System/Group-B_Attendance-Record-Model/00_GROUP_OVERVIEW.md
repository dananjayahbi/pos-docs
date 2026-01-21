# Group B: Attendance Record Model

> **Phase:** 06 - ERP Advanced Modules  
> **SubPhase:** 03 - Attendance System  
> **Group:** B of F  
> **Tasks Covered:** 17-32  
> **Group Goal:** Create AttendanceRecord model with all tracking fields

---

## Navigation

- **↑ Parent:** [SubPhase-03 Summary](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [Group A: Shift & Schedule Models](../Group-A_Shift-Schedule-Models/)
- **→ Next Group:** [Group C: Check-In/Out Processing](../Group-C_CheckIn-Out-Processing/)

---

## Group Overview

### Key Outcomes

1. **AttendanceStatus Choices** - PRESENT, ABSENT, LATE, HALF_DAY, ON_LEAVE, HOLIDAY, WEEKEND
2. **CheckInMethod Choices** - WEB, MOBILE, BIOMETRIC, MANUAL, IMPORT
3. **AttendanceRecord Model** - Core attendance tracking model
4. **Employee FK** - Link to Employee model
5. **Date Field** - Unique per employee per day
6. **Clock In/Out Fields** - clock_in, clock_out datetime
7. **Check-In Method Fields** - clock_in_method, clock_out_method
8. **Status Field** - Attendance status
9. **Shift Reference** - FK to scheduled shift
10. **Work Hours Fields** - work_hours, break_hours, effective_hours
11. **Late/Early Fields** - late_minutes, early_departure_minutes
12. **Overtime Fields** - overtime_hours, overtime_approved
13. **Location Fields** - GPS coordinates for clock in/out
14. **IP Address Fields** - Web check-in IP tracking
15. **Record Indexes** - Performance indexes
16. **AttendanceRecord Migrations** - Apply migrations

### Technology Context

| Technology | Purpose |
|------------|---------|
| Django ORM | AttendanceRecord model |
| DateTimeField | Clock in/out timestamps |
| DecimalField | Hours calculations |
| JSONField | GPS location data |

---

## Documents in This Group

| # | Document | Tasks | Description |
|---|----------|-------|-------------|
| 01 | `01_Tasks-17-24_Choices-Core-Fields.md` | 17-24 | Status/method choices, core model fields |
| 02 | `02_Tasks-25-32_Hours-Location-Index.md` | 25-32 | Work hours, location, IP, indexes, migrations |

---

## Task Summary

| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 17 | Define AttendanceStatus Choices | Low | 15 min |
| 18 | Define CheckInMethod Choices | Low | 10 min |
| 19 | Create AttendanceRecord Model | Medium | 25 min |
| 20 | Add Record Employee FK | Low | 15 min |
| 21 | Add Record Date Field | Low | 15 min |
| 22 | Add Clock In/Out Fields | Medium | 20 min |
| 23 | Add Check-In Method Fields | Low | 15 min |
| 24 | Add Status Field | Low | 15 min |
| 25 | Add Shift Reference | Low | 15 min |
| 26 | Add Work Hours Fields | Medium | 20 min |
| 27 | Add Late/Early Fields | Medium | 20 min |
| 28 | Add Overtime Fields | Medium | 20 min |
| 29 | Add Location Fields | Medium | 25 min |
| 30 | Add IP Address Fields | Low | 15 min |
| 31 | Add Record Indexes | Medium | 20 min |
| 32 | Run AttendanceRecord Migrations | Low | 15 min |

---

## Execution Order

```
[Tasks 17-24: Choices, core model, employee, date, clock fields]
         │
         ▼
[Tasks 25-32: Shift, hours, location, indexes, migrations]
```

---

## Expected Deliverables

```
apps/attendance/
├── constants.py                  # Tasks 17-18 (add to existing)
├── models/
│   ├── __init__.py
│   └── attendance_record.py      # Tasks 19-31
└── migrations/
    └── 0002_attendance_record.py # Task 32
```

---

## Notes for AI Agents

### AttendanceStatus Choices
| Status | Description |
|--------|-------------|
| PRESENT | Full day attendance |
| ABSENT | No attendance (no clock-in) |
| LATE | Clocked in after grace period |
| HALF_DAY | Less than full-day threshold |
| ON_LEAVE | On approved leave |
| HOLIDAY | Public holiday |
| WEEKEND | Weekend (non-working day) |

### CheckInMethod Choices
| Method | Description |
|--------|-------------|
| WEB | Browser-based check-in |
| MOBILE | Mobile app with GPS |
| BIOMETRIC | Biometric device |
| MANUAL | Manager entered manually |
| IMPORT | Bulk import from file |

### AttendanceRecord Fields
- employee: FK to Employee
- date: DateField (unique with employee)
- clock_in: DateTimeField (nullable)
- clock_out: DateTimeField (nullable)
- clock_in_method: CheckInMethod
- clock_out_method: CheckInMethod
- status: AttendanceStatus
- shift: FK to Shift
- work_hours: Decimal
- break_hours: Decimal
- effective_hours: Decimal
- late_minutes: Integer
- early_departure_minutes: Integer
- overtime_hours: Decimal
- overtime_approved: Boolean
- clock_in_location: JSONField
- clock_out_location: JSONField
- clock_in_ip: GenericIPAddressField
- clock_out_ip: GenericIPAddressField
- notes: TextField
- is_regularized: Boolean
- regularized_by: FK to User

### Location JSON Structure
```json
{
  "latitude": 6.9271,
  "longitude": 79.8612,
  "accuracy": 10.5,
  "timestamp": "2026-01-17T09:00:00+05:30",
  "address": "123 Main St, Colombo"
}
```

### Work Hours Calculation
```
clock_in: 09:15 AM
clock_out: 05:45 PM

Total Hours: 8.5 hours
Break Hours: 0.5 hours
Effective Hours: 8.0 hours
Late Minutes: 15 (after 15 min grace = 0)
Overtime: 8.0 - 8.0 = 0 hours
```

### Late/Early Detection
```
Shift Start: 09:00 AM
Grace Period: 15 minutes
Clock In: 09:20 AM

Late = clock_in - (shift_start + grace)
Late = 09:20 - 09:15 = 5 minutes late

Status: LATE (if late_minutes > 0)
```

### Unique Constraint
```
unique_together = ['employee', 'date']

One record per employee per day.
Multiple clock in/out → Use first in, last out.
```

### Database Indexes
- (employee, date) - unique
- (date) - for daily reports
- (status) - for filtering
- (department, date) - for department reports
- (employee, date, status) - composite
