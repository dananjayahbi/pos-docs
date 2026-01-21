# Group E: HR KPIs & Alerts

> **Phase:** 06 - ERP Advanced Modules  
> **SubPhase:** 13 - Dashboard KPIs  
> **Group:** E of F  
> **Tasks Covered:** 65-80  
> **Group Goal:** Implement HR KPI calculator and KPI alert system with threshold monitoring

---

## Navigation

- **↑ Parent:** [00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [Group-D_Financial-KPIs](../Group-D_Financial-KPIs/)
- **→ Next Group:** [Group-F_API-Testing-Documentation](../Group-F_API-Testing-Documentation/)

---

## Group Overview

This group implements the HRKPICalculator with employee and workforce metrics, plus the KPI alert system for threshold-based notifications. Calculates employee headcount, new hires, turnover rate, daily and monthly attendance rates, leave balances, pending leave requests, and payroll costs. Creates KPIAlert model for configuring warning and critical thresholds with notification options. Implements alert check service and Celery task for periodic monitoring.

### Key Outcomes

- HRKPICalculator extending BaseKPICalculator
- Total employee count KPI
- New hires this month KPI
- Turnover rate KPI
- Today's attendance KPI
- Monthly attendance rate KPI
- Leave balance summary by type
- Pending leave requests count KPI
- Current month payroll cost KPI
- HR KPI API endpoint
- KPIAlert model
- Warning and critical threshold fields
- Notification configuration (email, dashboard)
- Alert check service
- Alert checking Celery task (periodic)

### Technology Context

- **Data Source:** Employee, Attendance, LeaveRequest, Payroll
- **Alerts:** Threshold-based with urgency levels
- **Scheduling:** Celery Beat for periodic checks
- **Notifications:** Email and dashboard banners

---

## Documents in This Group

| # | Document | Description | Tasks Covered |
|---|----------|-------------|---------------|
| 01 | `01_Tasks-65-74_HR-Metrics.md` | Create HRKPICalculator with all HR metrics and endpoint | 65-74 |
| 02 | `02_Tasks-75-80_Alert-System.md` | Create KPIAlert model, alert service, and Celery task | 75-80 |

---

## Task Summary

| Task # | Task Name | Complexity | Dependencies |
|--------|-----------|------------|--------------|
| 65 | Create HRKPICalculator | Medium | Task 64 |
| 66 | Add Employee Count KPI | Low | Task 65 |
| 67 | Add New Hires KPI | Low | Task 66 |
| 68 | Add Turnover Rate KPI | Medium | Task 67 |
| 69 | Add Today's Attendance KPI | Medium | Task 68 |
| 70 | Add Attendance Rate KPI | Low | Task 69 |
| 71 | Add Leave Balance Summary KPI | Medium | Task 70 |
| 72 | Add Pending Leave Requests KPI | Low | Task 71 |
| 73 | Add Payroll Cost KPI | Medium | Task 72 |
| 74 | Create HR KPI Endpoint | Low | Task 73 |
| 75 | Create KPIAlert Model | Medium | Task 74 |
| 76 | Add Alert Threshold Fields | Low | Task 75 |
| 77 | Add Alert Notification Config | Low | Task 75 |
| 78 | Run KPIAlert Migrations | Low | Task 77 |
| 79 | Create Alert Check Service | High | Task 78 |
| 80 | Create Alert Celery Task | Medium | Task 79 |

---

## Execution Order

```
Task 65: Create HRKPICalculator
    │
    ▼
Task 66: Employee Count KPI
    │
    ▼
Task 67: New Hires KPI
    │
    ▼
Task 68: Turnover Rate KPI
    │
    ▼
Task 69: Today's Attendance KPI
    │
    ▼
Task 70: Attendance Rate KPI
    │
    ▼
Task 71: Leave Balance Summary KPI
    │
    ▼
Task 72: Pending Leave Requests KPI
    │
    ▼
Task 73: Payroll Cost KPI
    │
    ▼
Task 74: Create HR KPI Endpoint
    │
    ▼
Task 75: Create KPIAlert Model
    │
    ├──────────────┐
    ▼              ▼
Task 76        Task 77
(thresholds)   (notifications)
    │              │
    └──────┬───────┘
           ▼
      Task 78: Run Migrations
           │
           ▼
      Task 79: Create Alert Check Service
           │
           ▼
      Task 80: Create Alert Celery Task
```

---

## Expected Deliverables

```
apps/dashboard/
├── calculators/
│   ├── __init__.py
│   ├── base.py
│   ├── sales.py
│   ├── inventory.py
│   ├── financial.py
│   └── hr.py                  # HRKPICalculator
├── models/
│   ├── __init__.py
│   ├── kpi_definition.py
│   └── kpi_alert.py           # KPIAlert model
├── services/
│   ├── __init__.py
│   ├── cache_service.py
│   └── alert_service.py       # Alert checking
├── views/
│   └── dashboard.py           # Add HR endpoint
├── tasks.py                   # Alert Celery task
└── migrations/
    └── 0002_kpialert.py
```

---

## Notes for AI Agents

### HR KPI Response Structure
```json
{
  "category": "HR",
  "kpis": {
    "employee_count": {
      "value": 50,
      "active": 48,
      "on_leave": 2
    },
    "new_hires": {
      "value": 3,
      "period": "This Month"
    },
    "turnover_rate": {
      "value": 5.2,
      "formatted": "5.2%",
      "interpretation": "Healthy"
    },
    "todays_attendance": {
      "present": 45,
      "total": 48,
      "rate": 93.75
    },
    "attendance_rate": {
      "value": 94.5,
      "formatted": "94.5%"
    },
    "pending_leave_requests": {
      "value": 5,
      "urgency": "normal"
    },
    "payroll_cost": {
      "value": 4500000.00,
      "formatted": "LKR 4,500,000.00"
    }
  },
  "leave_balances": {...}
}
```

### KPI Formulas

**Turnover Rate:**
```
Turnover Rate = (Terminations / Average Headcount) × 100
```

**Attendance Rate:**
```
Attendance Rate = (Present Days / Total Working Days) × 100
```

### Leave Balance Summary
```json
{
  "leave_balances": {
    "annual": {
      "entitled": 700,
      "used": 250,
      "pending": 50,
      "remaining": 400
    },
    "sick": {...},
    "casual": {...}
  }
}
```

### KPIAlert Model Fields
- kpi_definition: FK to KPIDefinition
- warning_threshold: Decimal value
- critical_threshold: Decimal value
- comparison_operator: GT, LT, EQ
- notify_email: Boolean
- notify_dashboard: Boolean
- notification_recipients: JSONField

### Alert Thresholds (Default)
| KPI | Warning | Critical |
|-----|---------|----------|
| Low Stock Count | > 10 | > 25 |
| Out of Stock | > 0 | > 5 |
| AR Overdue (90+) | > LKR 100K | > LKR 500K |
| Cash Position | < LKR 50K | < LKR 10K |
| Attendance Rate | < 90% | < 80% |

### Alert Check Logic
```
For each configured alert:
1. Get current KPI value
2. Compare against thresholds
3. If threshold breached:
   - Create/update alert status
   - Send notifications if configured
   - Add to dashboard banner
```

### Celery Task Schedule
- Run every 30 minutes
- Check all configured KPI alerts
- Deduplicate notifications (don't spam)
- Clear alerts when resolved
