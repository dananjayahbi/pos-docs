# Group D: Customer & Staff Reports

> **Phase:** 06 - ERP Advanced Modules  
> **SubPhase:** 14 - Analytics & Reports  
> **Group:** D of F  
> **Tasks Covered:** 53-70  
> **Group Goal:** Implement customer analytics and staff/HR reports with acquisition, retention, and performance metrics

---

## Navigation

- **↑ Parent:** [00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [Group-C_Inventory-Purchase-Reports](../Group-C_Inventory-Purchase-Reports/)
- **→ Next Group:** [Group-E_Report-Builder-Scheduling](../Group-E_Report-Builder-Scheduling/)

---

## Group Overview

This group implements customer analytics and staff HR reports. Creates three customer reports: acquisition (new customers by period with channel), retention (repeat customer analysis with churn), and lifetime value (CLV calculation with segmentation). Creates three staff reports: attendance (summary with punctuality metrics), leave (utilization with balance analysis), and overtime (hours and cost by employee). All reports include the relevant API endpoints.

### Key Outcomes

- CustomerAcquisitionReport with new customers
- Acquisition channel tracking
- First purchase value analysis
- CustomerRetentionReport with repeat customers
- Repeat rate calculation
- Churn analysis and identification
- CustomerLifetimeValueReport
- CLV formula calculation
- Customer segmentation (High/Medium/Low)
- Customer report API endpoint
- AttendanceReport for staff
- Attendance rate calculation
- Late/early punctuality stats
- LeaveReport with utilization
- Leave balance analysis by type
- OvertimeReport
- Overtime hours and cost calculation
- Staff report API endpoint

### Technology Context

- **CLV Calculation:** Historical value + predicted future
- **Churn Definition:** No purchase in X months
- **Data Source:** Customer, Order, Employee, Attendance
- **Segmentation:** RFM-like analysis

---

## Documents in This Group

| # | Document | Description | Tasks Covered |
|---|----------|-------------|---------------|
| 01 | `01_Tasks-53-62_Customer-Reports.md` | Create acquisition, retention, and CLV reports | 53-62 |
| 02 | `02_Tasks-63-70_Staff-Reports.md` | Create attendance, leave, and overtime reports | 63-70 |

---

## Task Summary

| Task # | Task Name | Complexity | Dependencies |
|--------|-----------|------------|--------------|
| 53 | Create CustomerAcquisitionReport | Medium | Task 52 |
| 54 | Add Acquisition Channel | Low | Task 53 |
| 55 | Add First Purchase Value | Low | Task 54 |
| 56 | Create CustomerRetentionReport | High | Task 55 |
| 57 | Add Repeat Rate Calc | Medium | Task 56 |
| 58 | Add Churn Analysis | Medium | Task 57 |
| 59 | Create CustomerLifetimeValueReport | High | Task 58 |
| 60 | Add CLV Formula | High | Task 59 |
| 61 | Add Customer Segmentation | Medium | Task 60 |
| 62 | Create Customer Report Endpoint | Low | Task 61 |
| 63 | Create AttendanceReport | Medium | Task 62 |
| 64 | Add Attendance Rate Calc | Low | Task 63 |
| 65 | Add Late/Early Stats | Medium | Task 64 |
| 66 | Create LeaveReport | Medium | Task 65 |
| 67 | Add Leave Balance Analysis | Medium | Task 66 |
| 68 | Create OvertimeReport | Medium | Task 67 |
| 69 | Add Overtime Cost Calc | Medium | Task 68 |
| 70 | Create Staff Report Endpoint | Low | Task 69 |

---

## Execution Order

```
Task 53: CustomerAcquisitionReport
    │
    ▼
Task 54: Acquisition Channel
    │
    ▼
Task 55: First Purchase Value
    │
    ▼
Task 56: CustomerRetentionReport
    │
    ▼
Task 57: Repeat Rate Calc
    │
    ▼
Task 58: Churn Analysis
    │
    ▼
Task 59: CustomerLifetimeValueReport
    │
    ▼
Task 60: CLV Formula
    │
    ▼
Task 61: Customer Segmentation
    │
    ▼
Task 62: Customer Report Endpoint
    │
    ▼
Task 63: AttendanceReport
    │
    ▼
Task 64: Attendance Rate Calc
    │
    ▼
Task 65: Late/Early Stats
    │
    ▼
Task 66: LeaveReport
    │
    ▼
Task 67: Leave Balance Analysis
    │
    ▼
Task 68: OvertimeReport
    │
    ▼
Task 69: Overtime Cost Calc
    │
    ▼
Task 70: Staff Report Endpoint
```

---

## Expected Deliverables

```
apps/analytics/
├── generators/
│   ├── __init__.py
│   ├── base.py
│   ├── sales/
│   ├── inventory/
│   ├── purchase/
│   ├── customer/
│   │   ├── __init__.py
│   │   ├── acquisition.py      # CustomerAcquisitionReport
│   │   ├── retention.py        # CustomerRetentionReport
│   │   └── lifetime_value.py   # CustomerLifetimeValueReport
│   └── staff/
│       ├── __init__.py
│       ├── attendance.py       # AttendanceReport
│       ├── leave.py            # LeaveReport
│       └── overtime.py         # OvertimeReport
└── views/
    └── reports.py              # Add customer/staff endpoints
```

---

## Notes for AI Agents

### CustomerAcquisitionReport Structure
```json
{
  "report_type": "CUSTOMER_ACQUISITION",
  "period": "2026-01",
  "data": [
    {
      "date": "2026-01-15",
      "customer_id": 123,
      "customer_name": "John Doe",
      "channel": "WEBSTORE",
      "first_purchase_value": 15000.00
    }
  ],
  "summary": {
    "total_new_customers": 25,
    "by_channel": {
      "POS": 10,
      "WEBSTORE": 15
    },
    "avg_first_purchase": 12500.00
  }
}
```

### CustomerRetentionReport Metrics
```json
{
  "report_type": "CUSTOMER_RETENTION",
  "period": "2026-01",
  "metrics": {
    "total_customers": 500,
    "repeat_customers": 350,
    "repeat_rate": 70.0,
    "churned_customers": 25,
    "churn_rate": 5.0
  },
  "cohort_analysis": [...]
}
```

### CLV Calculation Formula
```
CLV = Average Order Value × Purchase Frequency × Customer Lifespan
```

Or simplified:
```
CLV = Total Historical Revenue + (Predicted Future Purchases × AOV)
```

### Customer Segmentation
| Segment | CLV Range | Characteristics |
|---------|-----------|-----------------|
| High Value | > 500,000 LKR | Top 20% |
| Medium Value | 100,000-500,000 LKR | Middle 50% |
| Low Value | < 100,000 LKR | Bottom 30% |

### AttendanceReport Structure
```json
{
  "report_type": "ATTENDANCE",
  "period": "2026-01",
  "data": [
    {
      "employee_id": 1,
      "employee_name": "Employee Name",
      "working_days": 22,
      "present_days": 21,
      "attendance_rate": 95.45,
      "late_count": 2,
      "early_leave_count": 1
    }
  ]
}
```

### LeaveReport Structure
```json
{
  "report_type": "LEAVE_UTILIZATION",
  "year": 2026,
  "data": [
    {
      "employee_id": 1,
      "employee_name": "Employee Name",
      "annual_entitled": 14,
      "annual_used": 5,
      "annual_remaining": 9,
      "sick_entitled": 7,
      "sick_used": 2,
      "sick_remaining": 5
    }
  ]
}
```

### OvertimeReport Structure
```json
{
  "report_type": "OVERTIME",
  "period": "2026-01",
  "data": [
    {
      "employee_id": 1,
      "employee_name": "Employee Name",
      "overtime_hours": 15.5,
      "overtime_rate": 1.5,
      "base_hourly": 500.00,
      "overtime_cost": 11625.00
    }
  ],
  "totals": {
    "total_hours": 250,
    "total_cost": 187500.00
  }
}
```
