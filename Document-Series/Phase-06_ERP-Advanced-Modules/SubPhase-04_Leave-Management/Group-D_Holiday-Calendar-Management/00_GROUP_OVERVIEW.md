# Group D: Holiday & Calendar Management

> **Phase:** 06 - ERP Advanced Modules  
> **SubPhase:** 04 - Leave Management  
> **Group:** D of F  
> **Tasks Covered:** 53-66  
> **Group Goal:** Implement holiday management and leave calendar features

---

## Navigation

- **↑ Parent:** [SubPhase-04 Summary](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [Group C: Leave Request Workflow](../Group-C_LeaveRequest-Workflow/)
- **→ Next Group:** [Group E: Reports & Integration](../Group-E_Reports-Integration/)

---

## Group Overview

### Key Outcomes

1. **HolidayType Choices** - PUBLIC, BANK, COMPANY, OPTIONAL
2. **Holiday Model** - Model for holidays/non-working days
3. **Holiday Core Fields** - name, date, holiday_type, description
4. **Holiday Scope Fields** - applies_to (all, department, location)
5. **Recurring Holiday Flag** - is_recurring, recurrence_rule
6. **Holiday Migrations** - Apply migrations
7. **Sri Lanka Holidays Seed** - Seed public holidays
8. **LeaveCalendarService** - Calendar data generation
9. **Team Calendar** - Show team leaves
10. **Department Calendar** - Show department leaves
11. **Holiday Calendar** - Show holidays
12. **Calendar JSON Export** - FullCalendar compatible
13. **Calculate Working Days** - Exclude weekends/holidays
14. **Auto-Adjust Leave Days** - Adjust excluding holidays

### Technology Context

| Technology | Purpose |
|------------|---------|
| Django ORM | Holiday model |
| Service Layer | Calendar logic |
| FullCalendar | Frontend integration |
| dateutil | Recurrence rules |

---

## Documents in This Group

| # | Document | Tasks | Description |
|---|----------|-------|-------------|
| 01 | `01_Tasks-53-59_Holiday-Model-Seed.md` | 53-59 | Holiday model, migrations, Sri Lanka seed |
| 02 | `02_Tasks-60-66_Calendar-Service-WorkDays.md` | 60-66 | CalendarService, working days calculation |

---

## Task Summary

| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 53 | Define HolidayType Choices | Low | 10 min |
| 54 | Create Holiday Model | Medium | 25 min |
| 55 | Add Holiday Core Fields | Low | 15 min |
| 56 | Add Holiday Scope Fields | Medium | 20 min |
| 57 | Add Recurring Holiday Flag | Medium | 20 min |
| 58 | Run Holiday Migrations | Low | 15 min |
| 59 | Create Sri Lanka Holidays Seed | Medium | 25 min |
| 60 | Create LeaveCalendarService | High | 30 min |
| 61 | Implement Team Calendar | Medium | 25 min |
| 62 | Implement Department Calendar | Medium | 25 min |
| 63 | Implement Holiday Calendar | Medium | 20 min |
| 64 | Implement Calendar JSON Export | Medium | 25 min |
| 65 | Calculate Working Days | High | 30 min |
| 66 | Auto-Adjust Leave Days | High | 30 min |

---

## Execution Order

```
[Tasks 53-59: Holiday model, seed]
         │
         ▼
[Tasks 60-66: CalendarService, working days]
```

---

## Expected Deliverables

```
apps/leave/
├── constants.py                  # Task 53 (add to existing)
├── models/
│   └── holiday.py                # Tasks 54-57
├── services/
│   └── calendar_service.py       # Tasks 60-66
├── management/
│   └── commands/
│       └── seed_holidays.py      # Task 59
└── migrations/
    └── 0005_holiday.py           # Task 58
```

---

## Notes for AI Agents

### HolidayType Choices
| Type | Description |
|------|-------------|
| PUBLIC | National public holiday |
| BANK | Bank holiday |
| COMPANY | Company-specific holiday |
| OPTIONAL | Optional/restricted holiday |

### Holiday Model Fields
- name: CharField
- date: DateField
- holiday_type: HolidayType choice
- description: TextField
- applies_to: Choice (ALL, DEPARTMENT, LOCATION)
- department: FK to Department (nullable)
- location: CharField (nullable)
- is_recurring: Boolean
- recurrence_rule: CharField (RRULE format)
- year: Integer (nullable for recurring)
- is_active: Boolean

### Holiday Scope
```
applies_to = ALL:
- Applies to entire company

applies_to = DEPARTMENT:
- Only specific department

applies_to = LOCATION:
- Only specific office location

Example:
Colombo Office Anniversary → applies_to=LOCATION, location="Colombo"
```

### Recurring Holidays
```
is_recurring = True
recurrence_rule = "RRULE:FREQ=YEARLY;BYMONTH=12;BYMONTHDAY=25"

Generates holiday instances for each year.
Christmas: Every December 25th
```

### Sri Lanka Public Holidays
| Date | Holiday | Type |
|------|---------|------|
| Jan 14 | Thai Pongal | PUBLIC |
| Feb 4 | Independence Day | PUBLIC |
| Apr 13-14 | Sinhala & Tamil New Year | PUBLIC |
| May 1 | May Day | PUBLIC |
| May (Full Moon) | Vesak Poya | PUBLIC |
| Jun (Full Moon) | Poson Poya | PUBLIC |
| Dec 25 | Christmas Day | PUBLIC |

### Poya Holidays (Lunar)
```
Monthly full moon days are public holidays in Sri Lanka.
These need to be calculated or seeded annually based on lunar calendar.
```

### LeaveCalendarService Methods
- get_team_calendar(manager_id, date_range)
- get_department_calendar(department_id, date_range)
- get_holidays(date_range, department_id=None)
- generate_calendar_json(employee_id, date_range)
- calculate_working_days(start_date, end_date, employee_id)
- auto_adjust_leave_days(leave_request)

### Calendar JSON Format (FullCalendar)
```json
{
  "events": [
    {
      "id": "leave-123",
      "title": "John Doe - Annual Leave",
      "start": "2026-01-15",
      "end": "2026-01-17",
      "color": "#4CAF50",
      "type": "leave",
      "status": "APPROVED"
    },
    {
      "id": "holiday-001",
      "title": "Independence Day",
      "start": "2026-02-04",
      "end": "2026-02-04",
      "color": "#F44336",
      "type": "holiday"
    }
  ]
}
```

### Team Calendar
```
Shows leaves for:
- Direct reports of manager
- Approved and pending leaves
- Color-coded by leave type
```

### Working Days Calculation
```
Start: Monday, Jan 13
End: Friday, Jan 17
Calendar Days: 5

Exclude:
- Weekends: 0 (none in range)
- Holidays: 1 (Thai Pongal - Jan 14)

Working Days = 5 - 0 - 1 = 4 days
```

### Weekend Configuration
```
Standard: Saturday, Sunday
Some may have: Friday, Saturday (Middle East offices)

Configurable per tenant or location.
```

### Auto-Adjust Leave Days
```
When employee selects date range:
1. Calculate calendar days
2. Identify weekends in range
3. Identify holidays in range (for employee's scope)
4. Subtract weekends and holidays
5. Return adjusted working days

API Response:
{
  "start_date": "2026-01-13",
  "end_date": "2026-01-17",
  "calendar_days": 5,
  "weekends": 0,
  "holidays": 1,
  "holiday_details": [{"date": "2026-01-14", "name": "Thai Pongal"}],
  "working_days": 4
}
```

### Holiday Conflict with Leave
```
If leave request includes a holiday:
1. Automatically exclude holiday from leave days
2. Show notification to employee
3. Recalculate total_days

Example:
Requested: Jan 13-17 (5 days)
Holiday: Jan 14
Actual Leave: 4 days (holiday excluded)
```
