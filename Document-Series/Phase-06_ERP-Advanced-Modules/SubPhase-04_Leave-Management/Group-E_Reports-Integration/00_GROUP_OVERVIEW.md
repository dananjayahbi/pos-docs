# Group E: Reports & Integration

> **Phase:** 06 - ERP Advanced Modules  
> **SubPhase:** 04 - Leave Management  
> **Group:** E of F  
> **Tasks Covered:** 67-80  
> **Group Goal:** Implement leave reports, notifications, and module integrations

---

## Navigation

- **↑ Parent:** [SubPhase-04 Summary](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [Group D: Holiday & Calendar Management](../Group-D_Holiday-Calendar-Management/)
- **→ Next Group:** [Group F: API, Testing & Documentation](../Group-F_API-Testing-Documentation/)

---

## Group Overview

### Key Outcomes

1. **LeaveReportService** - Service for leave reports
2. **Balance Summary Report** - All employees' balances
3. **Leave History Report** - Employee leave history
4. **Department Leave Report** - Department-level usage
5. **Leave Type Usage Report** - Usage by type
6. **Pending Approvals Report** - Pending requests list
7. **Expiring Leave Report** - Leaves about to expire
8. **Report Export Service** - Excel/PDF export
9. **Integrate with Attendance** - Mark ON_LEAVE
10. **Integrate with Payroll** - Provide leave days
11. **Leave Notification Service** - Email/push notifications
12. **Request Submitted Notification** - Notify manager
13. **Approval Notification** - Notify employee
14. **Leave Dashboard Data** - Dashboard widgets

### Technology Context

| Technology | Purpose |
|------------|---------|
| Service Layer | Report logic |
| Pandas | Data aggregation |
| Celery | Async notifications |
| Export | Excel/PDF generation |

---

## Documents in This Group

| # | Document | Tasks | Description |
|---|----------|-------|-------------|
| 01 | `01_Tasks-67-74_Reports-Export.md` | 67-74 | ReportService, export |
| 02 | `02_Tasks-75-80_Integration-Notifications-Dashboard.md` | 75-80 | Attendance/payroll integration, notifications |

---

## Task Summary

| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 67 | Create LeaveReportService | High | 35 min |
| 68 | Implement Balance Summary Report | Medium | 25 min |
| 69 | Implement Leave History Report | Medium | 25 min |
| 70 | Implement Department Leave Report | Medium | 25 min |
| 71 | Implement Leave Type Usage Report | Medium | 25 min |
| 72 | Implement Pending Approvals Report | Medium | 20 min |
| 73 | Implement Expiring Leave Report | Medium | 25 min |
| 74 | Create Report Export Service | High | 35 min |
| 75 | Integrate with Attendance | High | 30 min |
| 76 | Integrate with Payroll | High | 30 min |
| 77 | Create Leave Notification Service | High | 30 min |
| 78 | Implement Request Submitted Notification | Medium | 20 min |
| 79 | Implement Approval Notification | Medium | 20 min |
| 80 | Create Leave Dashboard Data | Medium | 25 min |

---

## Execution Order

```
[Tasks 67-74: ReportService, export]
         │
         ▼
[Tasks 75-80: Integrations, notifications, dashboard]
```

---

## Expected Deliverables

```
apps/leave/
├── services/
│   ├── report_service.py         # Tasks 67-73
│   ├── export_service.py         # Task 74
│   └── notification_service.py   # Tasks 77-79
├── integrations/
│   ├── __init__.py
│   ├── attendance_integration.py # Task 75
│   └── payroll_integration.py    # Task 76
├── dashboard/
│   └── dashboard_service.py      # Task 80
└── tasks/
    └── notification_tasks.py     # Async notifications
```

---

## Notes for AI Agents

### LeaveReportService Methods
- balance_summary(year, department_id=None)
- leave_history(employee_id, date_range)
- department_report(department_id, date_range)
- leave_type_usage(leave_type_id, date_range)
- pending_approvals(manager_id)
- expiring_leaves(days_until_expiry=30)

### Balance Summary Report
```json
{
  "year": 2026,
  "generated_at": "2026-01-17T10:00:00",
  "employees": [
    {
      "employee_id": "EMP-0001",
      "name": "John Doe",
      "department": "IT",
      "balances": [
        {
          "leave_type": "Annual Leave",
          "allocated": 14,
          "used": 5,
          "pending": 2,
          "available": 7
        },
        {
          "leave_type": "Sick Leave",
          "allocated": 7,
          "used": 1,
          "pending": 0,
          "available": 6
        }
      ]
    }
  ]
}
```

### Leave History Report
```json
{
  "employee": "John Doe",
  "date_range": "2026-01-01 to 2026-12-31",
  "requests": [
    {
      "id": "LR-001",
      "leave_type": "Annual Leave",
      "start_date": "2026-01-15",
      "end_date": "2026-01-17",
      "days": 3,
      "status": "APPROVED",
      "approved_by": "Jane Manager"
    }
  ],
  "summary": {
    "total_requests": 5,
    "total_days_taken": 10,
    "by_type": {
      "Annual Leave": 7,
      "Sick Leave": 2,
      "Casual Leave": 1
    }
  }
}
```

### Department Leave Report
```json
{
  "department": "IT",
  "date_range": "2026-01-01 to 2026-01-31",
  "total_employees": 20,
  "summary": {
    "total_leave_days": 45,
    "average_per_employee": 2.25,
    "by_leave_type": {
      "Annual Leave": 25,
      "Sick Leave": 10,
      "Casual Leave": 10
    }
  },
  "on_leave_today": 3
}
```

### Expiring Leave Report
```json
{
  "threshold_days": 30,
  "expiring_leaves": [
    {
      "employee": "John Doe",
      "leave_type": "Annual Leave",
      "days_expiring": 5,
      "expiry_date": "2026-03-31",
      "days_until_expiry": 15
    }
  ]
}
```

### Report Export Formats
| Format | Use Case |
|--------|----------|
| Excel | Data analysis, editing |
| PDF | Printing, sharing |
| CSV | Import to other systems |

### Attendance Integration
```
When leave is APPROVED:
1. For each day in leave range:
   a. Check if working day
   b. Create/update AttendanceRecord
   c. Set status = ON_LEAVE
   d. Set leave_request FK

When leave is RECALLED:
1. For each day in range:
   a. Set AttendanceRecord status = null (pending)
   b. Clear leave_request FK
```

### Payroll Integration
```
Monthly payroll data export:
{
  "employee_id": "EMP-0001",
  "period": "2026-01",
  "leave_summary": {
    "paid_leave_days": 5,
    "unpaid_leave_days": 0,
    "by_type": {
      "Annual Leave": 3,
      "Sick Leave": 2
    }
  }
}
```

### Notification Service Methods
- notify_request_submitted(leave_request)
- notify_approval(leave_request)
- notify_rejection(leave_request)
- notify_cancellation(leave_request)
- notify_upcoming_leave(leave_request)
- notify_expiring_balance(employee_id, leave_type_id)

### Notification Templates
| Event | Recipients | Channel |
|-------|------------|---------|
| Request Submitted | Manager | Email, Push |
| Approved | Employee | Email, Push |
| Rejected | Employee | Email, Push |
| Upcoming Leave | Employee | Email |
| Balance Expiring | Employee | Email |

### Dashboard Data
```json
{
  "my_balance": {
    "annual": 10,
    "casual": 5,
    "sick": 7
  },
  "pending_requests": 1,
  "upcoming_leaves": [
    {
      "start_date": "2026-02-01",
      "end_date": "2026-02-03",
      "type": "Annual Leave"
    }
  ],
  "team_on_leave_today": 2,
  "pending_for_approval": 3
}
```
