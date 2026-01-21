# Group F: API, Testing & Documentation

> **Phase:** 06 - ERP Advanced Modules  
> **SubPhase:** 06 - Payroll Processing  
> **Group:** F of F  
> **Tasks Covered:** 83-92  
> **Group Goal:** Create API endpoints, tests, and module documentation

---

## Navigation

- **↑ Parent:** [SubPhase-06 Summary](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [Group E: Approval & Finalization](../Group-E_Approval-Finalization/)

---

## Group Overview

### Key Outcomes

1. **PayrollPeriodSerializer** - DRF serializer for period
2. **PayrollRunSerializer** - Serializer for run
3. **EmployeePayrollSerializer** - Serializer for employee payroll
4. **PayrollPeriodViewSet** - ViewSet for period management
5. **PayrollRunViewSet** - ViewSet with process, approve actions
6. **Payroll Actions** - process, approve, finalize, reverse
7. **Report Endpoints** - EPF/ETF/PAYE report endpoints
8. **Register Payroll Processing URLs** - All endpoint registration
9. **Payroll Processing Tests** - Unit and integration tests
10. **Payroll Documentation** - API docs, processing guide

### Technology Context

| Technology | Purpose |
|------------|---------|
| Django REST Framework | API serializers/views |
| ViewSet Actions | Custom actions |
| pytest | Testing framework |
| OpenAPI | API documentation |

---

## Documents in This Group

| # | Document | Tasks | Description |
|---|----------|-------|-------------|
| 01 | `01_Tasks-83-88_Serializers-ViewSets.md` | 83-88 | Serializers, viewsets, actions |
| 02 | `02_Tasks-89-92_Reports-Tests-Docs.md` | 89-92 | Report endpoints, tests, documentation |

---

## Task Summary

| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 83 | Create PayrollPeriodSerializer | Medium | 25 min |
| 84 | Create PayrollRunSerializer | Medium | 30 min |
| 85 | Create EmployeePayrollSerializer | High | 35 min |
| 86 | Create PayrollPeriodViewSet | Medium | 25 min |
| 87 | Create PayrollRunViewSet | High | 35 min |
| 88 | Add Payroll Actions | High | 35 min |
| 89 | Create Report Endpoints | High | 35 min |
| 90 | Register Payroll Processing URLs | Low | 20 min |
| 91 | Create Payroll Processing Tests | High | 45 min |
| 92 | Create Payroll Documentation | Medium | 35 min |

---

## Execution Order

```
[Tasks 83-88: Serializers, viewsets, actions]
         │
         ▼
[Tasks 89-92: Reports, tests, documentation]
```

---

## Expected Deliverables

```
apps/payroll/
├── serializers/
│   ├── period_serializer.py      # Task 83
│   ├── run_serializer.py         # Task 84
│   └── employee_payroll_serializer.py # Task 85
├── views/
│   ├── period_viewset.py         # Task 86
│   ├── run_viewset.py            # Tasks 87-88
│   └── report_views.py           # Task 89
├── urls.py                       # Task 90 (extend)
├── tests/
│   ├── test_processor.py
│   ├── test_approval.py
│   ├── test_finalization.py
│   └── test_api.py               # Task 91
└── docs/
    └── README.md                 # Task 92
```

---

## Notes for AI Agents

### Payroll Processing API Endpoints
```
/api/v1/payroll/
├── GET /periods/                 # List periods
├── POST /periods/                # Create period
├── GET /periods/{id}/            # Get period detail
├── PUT /periods/{id}/            # Update period
├── GET /periods/current/         # Current period
├── POST /periods/{id}/close/     # Close period
│
├── GET /runs/                    # List payroll runs
├── GET /runs/{id}/               # Get run detail
├── POST /runs/process/           # Start processing
├── GET /runs/{id}/status/        # Processing status
├── POST /runs/{id}/submit/       # Submit for approval
├── POST /runs/{id}/approve/      # Approve payroll
├── POST /runs/{id}/reject/       # Reject payroll
├── POST /runs/{id}/finalize/     # Finalize payroll
├── POST /runs/{id}/reverse/      # Reverse payroll
├── GET /runs/{id}/summary/       # Run summary
│
├── GET /employee-payrolls/       # List employee payrolls
├── GET /employee-payrolls/{id}/  # Get payroll detail
├── GET /employee-payrolls/{id}/line-items/ # Line items
│
├── GET /reports/epf/             # EPF return report
├── GET /reports/etf/             # ETF return report
├── GET /reports/paye/            # PAYE return report
├── GET /reports/summary/         # Payroll summary
├── GET /reports/bank-file/       # Generate bank file
│
└── GET /settings/                # Payroll settings
    PUT /settings/                # Update settings
```

### PayrollPeriodSerializer
```json
{
  "id": "uuid",
  "name": "January 2026",
  "period_month": 1,
  "period_year": 2026,
  "start_date": "2026-01-01",
  "end_date": "2026-01-31",
  "pay_date": "2026-01-25",
  "status": "DRAFT",
  "total_working_days": 22,
  "is_locked": false,
  "runs_count": 0
}
```

### PayrollRunSerializer
```json
{
  "id": "uuid",
  "period": {...},
  "run_number": 1,
  "status": "PROCESSED",
  "started_at": "2026-01-20T10:00:00Z",
  "completed_at": "2026-01-20T10:15:00Z",
  "total_employees": 50,
  "total_gross": 6500000,
  "total_deductions": 750000,
  "total_net": 5750000,
  "total_epf_employee": 520000,
  "total_epf_employer": 780000,
  "total_etf": 195000,
  "total_paye": 180000,
  "error_count": 0,
  "processed_by": {...},
  "approved_by": null
}
```

### EmployeePayrollSerializer
```json
{
  "id": "uuid",
  "employee": {
    "id": "uuid",
    "employee_id": "EMP-0001",
    "name": "John Doe"
  },
  "payroll_run": {...},
  "days_worked": 20,
  "days_absent": 2,
  "overtime_hours": 8.5,
  "basic_salary": 150000,
  "overtime_amount": 18750,
  "gross_salary": 200000,
  "total_deductions": 25200,
  "net_salary": 174800,
  "epf_employee": 12000,
  "epf_employer": 18000,
  "etf": 4500,
  "paye_tax": 5500,
  "payment_status": "PENDING",
  "line_items": [
    {
      "component": "Basic Salary",
      "type": "EARNING",
      "amount": 150000
    },
    {
      "component": "Transport Allowance",
      "type": "EARNING",
      "amount": 15000
    }
  ]
}
```

### Process Action Request
```json
POST /api/v1/payroll/runs/process/
{
  "period_id": "uuid"
}

Response:
{
  "run_id": "uuid",
  "status": "PROCESSING",
  "task_id": "celery-task-uuid",
  "message": "Payroll processing started"
}
```

### Processing Status Response
```json
GET /api/v1/payroll/runs/{id}/status/
{
  "status": "PROCESSING",
  "progress": {
    "total": 50,
    "processed": 35,
    "success": 33,
    "errors": 2,
    "percentage": 70,
    "current_employee": "EMP-0036"
  }
}
```

### Approve Action
```json
POST /api/v1/payroll/runs/{id}/approve/
{
  "notes": "Approved for January 2026"
}
```

### Report Endpoints
```
GET /api/v1/payroll/reports/epf/?period_id={id}&format=excel
GET /api/v1/payroll/reports/etf/?period_id={id}&format=excel
GET /api/v1/payroll/reports/paye/?period_id={id}&format=pdf
GET /api/v1/payroll/reports/bank-file/?run_id={id}&bank=boc
```

### Test Categories
| Category | Tests |
|----------|-------|
| Processor Tests | Calculation accuracy, pro-rata |
| EPF/ETF Tests | Rate calculations, base earnings |
| PAYE Tests | Tax slab application, YTD |
| Approval Tests | Workflow, permissions |
| Finalization Tests | Lock, bank file |
| API Tests | All endpoints, actions |
| Integration Tests | End-to-end processing |

### Test Scenarios
- Full month employee (all days worked)
- Mid-month joining
- Leave without pay
- Overtime calculation
- Tax exemptions
- Approval workflow
- Reversal and correction

### Documentation Sections
1. **Overview** - Module introduction
2. **Payroll Period** - Period configuration
3. **Processing Workflow** - Step-by-step guide
4. **Calculation Logic** - Pro-rata, overtime
5. **EPF/ETF Compliance** - Sri Lanka requirements
6. **PAYE Tax** - Tax calculation
7. **Approval Workflow** - Submit, approve, reject
8. **Finalization** - Lock, bank file
9. **Reversal** - Correction process
10. **API Reference** - All endpoints
11. **Reports** - Statutory returns
12. **Troubleshooting** - Common issues
