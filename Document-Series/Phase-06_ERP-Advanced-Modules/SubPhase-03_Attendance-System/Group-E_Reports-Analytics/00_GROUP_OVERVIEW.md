# Group E: Reports & Analytics

> **Phase:** 06 - ERP Advanced Modules  
> **SubPhase:** 03 - Attendance System  
> **Group:** E of F  
> **Tasks Covered:** 63-76  
> **Group Goal:** Implement attendance reports, analytics, and real-time dashboard

---

## Navigation

- **↑ Parent:** [SubPhase-03 Summary](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [Group D: Overtime & Calculations](../Group-D_Overtime-Calculations/)
- **→ Next Group:** [Group F: API, Testing & Documentation](../Group-F_API-Testing-Documentation/)

---

## Group Overview

### Key Outcomes

1. **AttendanceReportService** - Service for report generation
2. **Daily Report** - Daily attendance summary
3. **Weekly Report** - Weekly summary per employee
4. **Monthly Report** - Monthly attendance with totals
5. **Employee Report** - Individual history
6. **Department Report** - Department-level metrics
7. **Late Arrival Report** - Late arrivals list
8. **Overtime Report** - Overtime summary
9. **Absence Report** - Absences for date range
10. **Attendance Percentage** - Calculate attendance %
11. **Report Export Service** - Excel/PDF export
12. **Attendance Dashboard Data** - Dashboard widgets
13. **Real-time Dashboard** - Live WebSocket updates
14. **Payroll Integration Data** - Export for payroll

### Technology Context

| Technology | Purpose |
|------------|---------|
| Service Layer | Report logic |
| Pandas | Data aggregation |
| WebSocket | Real-time updates |
| Export | Excel/PDF generation |

---

## Documents in This Group

| # | Document | Tasks | Description |
|---|----------|-------|-------------|
| 01 | `01_Tasks-63-70_Report-Service-Types.md` | 63-70 | ReportService, daily/weekly/monthly/OT reports |
| 02 | `02_Tasks-71-76_Export-Dashboard-Payroll.md` | 71-76 | Absence, attendance %, export, dashboard, payroll |

---

## Task Summary

| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 63 | Create AttendanceReportService | High | 35 min |
| 64 | Implement Daily Report | Medium | 25 min |
| 65 | Implement Weekly Report | Medium | 25 min |
| 66 | Implement Monthly Report | Medium | 30 min |
| 67 | Implement Employee Report | Medium | 25 min |
| 68 | Implement Department Report | Medium | 30 min |
| 69 | Create Late Arrival Report | Medium | 25 min |
| 70 | Create Overtime Report | Medium | 25 min |
| 71 | Create Absence Report | Medium | 25 min |
| 72 | Implement Attendance Percentage | Medium | 25 min |
| 73 | Create Report Export Service | High | 35 min |
| 74 | Create Attendance Dashboard Data | High | 30 min |
| 75 | Implement Real-time Dashboard | High | 40 min |
| 76 | Create Payroll Integration Data | High | 35 min |

---

## Execution Order

```
[Tasks 63-70: ReportService, report types]
         │
         ▼
[Tasks 71-76: Export, dashboard, payroll integration]
```

---

## Expected Deliverables

```
apps/attendance/
├── services/
│   ├── report_service.py         # Tasks 63-72
│   └── export_service.py         # Task 73
├── dashboard/
│   ├── __init__.py
│   └── dashboard_service.py      # Task 74
├── consumers.py                  # Task 75
├── integrations/
│   └── payroll_integration.py    # Task 76
└── routing.py                    # WebSocket routing
```

---

## Notes for AI Agents

### AttendanceReportService Methods
- daily_summary(date, department_id=None)
- weekly_summary(start_date, end_date, employee_id=None)
- monthly_summary(year, month, employee_id=None)
- employee_history(employee_id, date_range)
- department_metrics(department_id, date_range)
- late_arrivals_report(date_range, department_id=None)
- overtime_report(date_range, department_id=None)
- absence_report(date_range, department_id=None)
- attendance_percentage(employee_id, date_range)

### Daily Summary Report
```json
{
  "date": "2026-01-17",
  "department": "IT",
  "total_employees": 50,
  "present": 45,
  "absent": 2,
  "late": 3,
  "on_leave": 0,
  "attendance_rate": 90.0,
  "employees": [
    {
      "id": "emp-001",
      "name": "John Doe",
      "status": "PRESENT",
      "clock_in": "09:05",
      "clock_out": "17:45",
      "work_hours": 8.25
    }
  ]
}
```

### Weekly Summary Report
```json
{
  "week": "2026-W03",
  "start_date": "2026-01-13",
  "end_date": "2026-01-17",
  "employee": {
    "id": "emp-001",
    "name": "John Doe"
  },
  "days": {
    "2026-01-13": {"status": "PRESENT", "hours": 8.0},
    "2026-01-14": {"status": "LATE", "hours": 7.5},
    "2026-01-15": {"status": "PRESENT", "hours": 8.5},
    "2026-01-16": {"status": "ON_LEAVE", "hours": 0},
    "2026-01-17": {"status": "PRESENT", "hours": 8.0}
  },
  "totals": {
    "days_present": 3,
    "days_late": 1,
    "days_leave": 1,
    "total_hours": 32.0,
    "overtime_hours": 0.5,
    "late_minutes": 15
  }
}
```

### Monthly Summary Report
```json
{
  "month": "2026-01",
  "employee": "John Doe",
  "working_days": 22,
  "present_days": 20,
  "absent_days": 0,
  "late_days": 2,
  "leave_days": 2,
  "total_work_hours": 165.5,
  "total_overtime_hours": 5.5,
  "total_late_minutes": 45,
  "attendance_percentage": 90.9
}
```

### Late Arrival Report
```json
{
  "date_range": "2026-01-01 to 2026-01-31",
  "department": "All",
  "total_late_instances": 25,
  "records": [
    {
      "date": "2026-01-15",
      "employee": "John Doe",
      "expected_time": "09:00",
      "actual_time": "09:25",
      "late_minutes": 10,
      "reason": "Traffic"
    }
  ]
}
```

### Overtime Report
```json
{
  "date_range": "2026-01-01 to 2026-01-31",
  "employees": [
    {
      "id": "emp-001",
      "name": "John Doe",
      "total_ot_hours": 15.5,
      "approved_hours": 12.0,
      "pending_hours": 3.5,
      "ot_pay_estimate": 18750.00
    }
  ],
  "department_total": 125.5
}
```

### Attendance Percentage Formula
```
Attendance % = (Present Days / Working Days) × 100

Working Days = Total days - Holidays - Weekends
Present Days = PRESENT + LATE (counted as present)

Example:
Working Days: 22
Present: 18
Late (but present): 2
Leave: 2

Attendance % = (18 + 2) / 22 × 100 = 90.9%
```

### Report Export Formats
| Format | Library |
|--------|---------|
| Excel | openpyxl |
| PDF | WeasyPrint |
| CSV | csv (standard) |

### Dashboard Data Structure
```json
{
  "today": {
    "date": "2026-01-17",
    "total_employees": 150,
    "checked_in": 125,
    "not_checked_in": 25,
    "on_leave": 10,
    "late_today": 5
  },
  "week": {
    "avg_attendance_rate": 92.5,
    "total_late_instances": 15,
    "total_overtime_hours": 45
  },
  "recent_activity": [
    {"time": "09:05", "employee": "John Doe", "action": "Clock In"},
    {"time": "09:03", "employee": "Jane Smith", "action": "Clock In"}
  ]
}
```

### Real-time Dashboard WebSocket
```
Channel: attendance_dashboard

Events:
- employee_clocked_in
- employee_clocked_out
- dashboard_stats_update

Message Format:
{
  "type": "employee_clocked_in",
  "data": {
    "employee_id": "emp-001",
    "name": "John Doe",
    "time": "09:05:00",
    "status": "PRESENT"
  }
}
```

### Payroll Integration Data
```json
{
  "payroll_period": "2026-01",
  "employees": [
    {
      "employee_id": "emp-001",
      "name": "John Doe",
      "working_days": 22,
      "present_days": 20,
      "leave_days_paid": 2,
      "leave_days_unpaid": 0,
      "total_hours": 165.5,
      "regular_hours": 160,
      "overtime_hours": 5.5,
      "late_deduction_minutes": 45,
      "early_leave_minutes": 0
    }
  ]
}
```
