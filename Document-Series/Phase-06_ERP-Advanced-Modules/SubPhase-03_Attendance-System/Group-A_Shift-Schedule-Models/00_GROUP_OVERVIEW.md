# Group A: Shift & Schedule Models

> **Phase:** 06 - ERP Advanced Modules  
> **SubPhase:** 03 - Attendance System  
> **Group:** A of F  
> **Tasks Covered:** 01-16  
> **Group Goal:** Create attendance Django app with Shift and ShiftSchedule models

---

## Navigation

- **↑ Parent:** [SubPhase-03 Summary](../00_TASKS_SUMMARY.md)
- **→ Next Group:** [Group B: Attendance Record Model](../Group-B_Attendance-Record-Model/)

---

## Group Overview

### Key Outcomes

1. **Attendance Django App** - New Django app for attendance tracking
2. **App Registration** - Register attendance in TENANT_APPS
3. **ShiftType Choices** - REGULAR, MORNING, EVENING, NIGHT, FLEXIBLE
4. **Shift Model Core** - name, code, shift_type
5. **Shift Time Fields** - start_time, end_time, break_start, break_end
6. **Shift Duration Fields** - work_hours, break_duration (calculated)
7. **Shift Grace Period** - late_grace_minutes, early_leave_grace_minutes
8. **Shift Overtime Rules** - overtime_start_after, overtime_multiplier
9. **Shift Half-Day Threshold** - min_hours_for_half_day, min_hours_for_full_day
10. **Shift Model Migrations** - Apply migrations
11. **ShiftSchedule Model** - Assign shifts to employees
12. **Schedule Date Fields** - effective_from, effective_to, is_recurring
13. **Schedule Weekday Fields** - applicable_days (Monday-Sunday)
14. **Schedule Employee FK** - Individual employee schedules
15. **Schedule Department FK** - Department-wide schedules
16. **ShiftSchedule Migrations** - Apply migrations

### Technology Context

| Technology | Purpose |
|------------|---------|
| Django ORM | Shift, ShiftSchedule models |
| TimeField | Shift start/end times |
| DurationField | Work hours calculation |
| ForeignKey | Employee, Department links |

---

## Documents in This Group

| # | Document | Tasks | Description |
|---|----------|-------|-------------|
| 01 | `01_Tasks-01-10_App-Shift-Model.md` | 01-10 | Django app, ShiftType, Shift model, migrations |
| 02 | `02_Tasks-11-16_ShiftSchedule-Model.md` | 11-16 | ShiftSchedule model, date/weekday fields, migrations |

---

## Task Summary

| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 01 | Create attendance Django App | Low | 15 min |
| 02 | Register attendance App | Low | 10 min |
| 03 | Define ShiftType Choices | Low | 10 min |
| 04 | Create Shift Model Core | Medium | 25 min |
| 05 | Add Shift Time Fields | Medium | 20 min |
| 06 | Add Shift Duration Fields | Medium | 20 min |
| 07 | Add Shift Grace Period | Low | 15 min |
| 08 | Add Shift Overtime Rules | Medium | 20 min |
| 09 | Add Shift Half-Day Threshold | Low | 15 min |
| 10 | Run Shift Model Migrations | Low | 15 min |
| 11 | Create ShiftSchedule Model | Medium | 25 min |
| 12 | Add Schedule Date Fields | Medium | 20 min |
| 13 | Add Schedule Weekday Fields | Medium | 20 min |
| 14 | Add Schedule Employee FK | Low | 15 min |
| 15 | Add Schedule Department FK | Low | 15 min |
| 16 | Run ShiftSchedule Migrations | Low | 15 min |

---

## Execution Order

```
[Tasks 01-10: Django app, Shift model, migrations]
         │
         ▼
[Tasks 11-16: ShiftSchedule model, migrations]
```

---

## Expected Deliverables

```
apps/attendance/
├── __init__.py
├── apps.py                       # Tasks 01-02
├── constants.py                  # Task 03
├── models/
│   ├── __init__.py
│   ├── shift.py                  # Tasks 04-09
│   └── shift_schedule.py         # Tasks 11-15
└── migrations/
    └── 0001_initial.py           # Tasks 10, 16
```

---

## Notes for AI Agents

### ShiftType Choices
| Type | Description |
|------|-------------|
| REGULAR | Standard day shift (9 AM - 5 PM) |
| MORNING | Early morning shift (6 AM - 2 PM) |
| EVENING | Evening shift (2 PM - 10 PM) |
| NIGHT | Night shift (10 PM - 6 AM) |
| FLEXIBLE | Flexible working hours |

### Shift Model Fields
- name: CharField (e.g., "Regular Day Shift")
- code: CharField (e.g., "SHIFT-REG")
- shift_type: ShiftType choice
- start_time: TimeField
- end_time: TimeField
- break_start: TimeField (nullable)
- break_end: TimeField (nullable)
- work_hours: Decimal (calculated)
- break_duration: Duration (calculated)
- late_grace_minutes: Integer (default 15)
- early_leave_grace_minutes: Integer (default 10)
- overtime_start_after: Decimal (hours)
- overtime_multiplier: Decimal (default 1.5)
- min_hours_for_half_day: Decimal (default 4)
- min_hours_for_full_day: Decimal (default 7.5)

### Shift Configuration Example
```
REGULAR SHIFT:
Start: 09:00, End: 17:30
Break: 13:00 - 13:30 (30 min)
Work Hours: 8 hours
Late Grace: 15 minutes
OT After: 8.5 hours
OT Multiplier: 1.5x
Half-Day: 4+ hours
Full-Day: 7.5+ hours
```

### ShiftSchedule Model Fields
- employee: FK to Employee (nullable)
- department: FK to Department (nullable)
- shift: FK to Shift
- effective_from: DateField
- effective_to: DateField (nullable)
- is_recurring: Boolean
- monday: Boolean
- tuesday: Boolean
- wednesday: Boolean
- thursday: Boolean
- friday: Boolean
- saturday: Boolean
- sunday: Boolean

### Schedule Priority
```
1. Individual Employee Schedule (highest)
2. Department Schedule
3. Default Company Shift (lowest)

Resolution:
Find employee schedule for date → 
Fall back to department schedule → 
Fall back to default shift
```

### Weekday Flags Example
```
Standard 5-Day Week:
- monday: True
- tuesday: True
- wednesday: True
- thursday: True
- friday: True
- saturday: False
- sunday: False
```

### Night Shift Handling
```
For shifts crossing midnight:
Start: 22:00, End: 06:00 (next day)

Logic:
- If end_time < start_time → Shift spans midnight
- Clock-in on Day 1, Clock-out on Day 2
- Attendance record linked to clock-in date
```
