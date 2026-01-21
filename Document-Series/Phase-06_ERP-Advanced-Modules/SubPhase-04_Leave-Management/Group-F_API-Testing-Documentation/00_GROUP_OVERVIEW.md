# Group F: API, Testing & Documentation

> **Phase:** 06 - ERP Advanced Modules  
> **SubPhase:** 04 - Leave Management  
> **Group:** F of F  
> **Tasks Covered:** 81-90  
> **Group Goal:** Create API endpoints, tests, and module documentation

---

## Navigation

- **↑ Parent:** [SubPhase-04 Summary](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [Group E: Reports & Integration](../Group-E_Reports-Integration/)

---

## Group Overview

### Key Outcomes

1. **LeaveTypeSerializer** - DRF serializer for LeaveType
2. **LeaveBalanceSerializer** - Serializer for balance
3. **LeaveRequestSerializer** - Serializer for requests
4. **HolidaySerializer** - Serializer for holidays
5. **LeaveTypeViewSet** - ViewSet for leave type CRUD
6. **LeaveRequestViewSet** - ViewSet with workflow actions
7. **HolidayViewSet** - ViewSet for holidays
8. **Leave API URLs** - All endpoint registration
9. **Leave Module Tests** - Unit and integration tests
10. **Leave Documentation** - API docs, policy guide

### Technology Context

| Technology | Purpose |
|------------|---------|
| Django REST Framework | API serializers/views |
| django-filter | Filtering capabilities |
| pytest | Testing framework |
| OpenAPI | API documentation |

---

## Documents in This Group

| # | Document | Tasks | Description |
|---|----------|-------|-------------|
| 01 | `01_Tasks-81-87_Serializers-ViewSets.md` | 81-87 | Serializers, viewsets, actions |
| 02 | `02_Tasks-88-90_URLs-Tests-Documentation.md` | 88-90 | URL registration, tests, documentation |

---

## Task Summary

| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 81 | Create LeaveTypeSerializer | Medium | 25 min |
| 82 | Create LeaveBalanceSerializer | Medium | 25 min |
| 83 | Create LeaveRequestSerializer | High | 30 min |
| 84 | Create HolidaySerializer | Medium | 20 min |
| 85 | Create LeaveTypeViewSet | Medium | 25 min |
| 86 | Create LeaveRequestViewSet | High | 35 min |
| 87 | Create HolidayViewSet | Medium | 25 min |
| 88 | Register Leave API URLs | Low | 20 min |
| 89 | Create Leave Module Tests | High | 45 min |
| 90 | Create Leave Documentation | Medium | 35 min |

---

## Execution Order

```
[Tasks 81-87: Serializers, viewsets]
         │
         ▼
[Tasks 88-90: URLs, tests, documentation]
```

---

## Expected Deliverables

```
apps/leave/
├── serializers/
│   ├── __init__.py
│   ├── leave_type_serializer.py  # Task 81
│   ├── balance_serializer.py     # Task 82
│   ├── request_serializer.py     # Task 83
│   └── holiday_serializer.py     # Task 84
├── views/
│   ├── __init__.py
│   ├── leave_type_viewset.py     # Task 85
│   ├── request_viewset.py        # Task 86
│   ├── holiday_viewset.py        # Task 87
│   └── calendar_view.py
├── filters.py
├── urls.py                       # Task 88
├── tests/
│   ├── __init__.py
│   ├── test_models.py
│   ├── test_services.py
│   ├── test_workflow.py
│   └── test_api.py               # Task 89
└── docs/
    └── README.md                 # Task 90
```

---

## Notes for AI Agents

### Leave API Endpoints
```
/api/v1/leave/
├── GET /types/                   # List leave types
├── POST /types/                  # Create leave type (admin)
├── GET /types/{id}/              # Get leave type detail
├── PUT /types/{id}/              # Update leave type
├── DELETE /types/{id}/           # Delete leave type
│
├── GET /balances/                # List my balances
├── GET /balances/{employee_id}/  # Employee's balances
├── GET /balances/summary/        # Balance summary report
│
├── GET /requests/                # List my requests
├── POST /requests/               # Create request
├── GET /requests/{id}/           # Get request detail
├── PUT /requests/{id}/           # Update draft request
├── DELETE /requests/{id}/        # Delete draft
├── POST /requests/{id}/submit/   # Submit for approval
├── POST /requests/{id}/approve/  # Approve (manager)
├── POST /requests/{id}/reject/   # Reject (manager)
├── POST /requests/{id}/cancel/   # Cancel (employee)
├── POST /requests/{id}/recall/   # Recall approved
├── GET /requests/pending/        # Pending for my approval
├── GET /requests/team/           # Team's requests
│
├── GET /holidays/                # List holidays
├── POST /holidays/               # Create holiday (admin)
├── GET /holidays/{id}/           # Get holiday detail
├── PUT /holidays/{id}/           # Update holiday
├── DELETE /holidays/{id}/        # Delete holiday
├── GET /holidays/{year}/         # Holidays for year
│
├── GET /calendar/                # My calendar
├── GET /calendar/team/           # Team calendar
├── GET /calendar/department/{id}/ # Department calendar
├── GET /calendar/holidays/       # Holiday calendar
│
├── GET /reports/balance-summary/ # Balance summary
├── GET /reports/history/{id}/    # Employee history
├── GET /reports/department/{id}/ # Department report
├── GET /reports/expiring/        # Expiring leaves
├── GET /reports/export/          # Export report
│
└── GET /dashboard/               # Dashboard data
```

### LeaveTypeSerializer
```json
{
  "id": "uuid",
  "name": "Annual Leave",
  "code": "AL",
  "category": "ANNUAL",
  "description": "Paid annual leave",
  "color": "#4CAF50",
  "default_days_per_year": 14,
  "is_paid": true,
  "requires_document": false,
  "applicable_gender": "ALL",
  "min_service_months": 0,
  "min_notice_days": 3,
  "allow_half_day": true,
  "carry_forward_allowed": true,
  "max_carry_forward_days": 5
}
```

### LeaveBalanceSerializer
```json
{
  "id": "uuid",
  "employee": {
    "id": "uuid",
    "name": "John Doe",
    "employee_id": "EMP-0001"
  },
  "leave_type": {
    "id": "uuid",
    "name": "Annual Leave",
    "code": "AL"
  },
  "year": 2026,
  "opening_balance": 14.0,
  "allocated_days": 0.0,
  "used_days": 5.0,
  "pending_days": 2.0,
  "available_days": 7.0,
  "carried_from_previous": 0.0
}
```

### LeaveRequestSerializer
```json
{
  "id": "uuid",
  "employee": {...},
  "leave_type": {...},
  "start_date": "2026-01-15",
  "end_date": "2026-01-17",
  "total_days": 3.0,
  "is_half_day": false,
  "half_day_type": null,
  "reason": "Family vacation",
  "contact_during_leave": "+94771234567",
  "status": "PENDING",
  "attachment": "https://...",
  "submitted_at": "2026-01-10T10:00:00",
  "approved_by": null,
  "approved_at": null,
  "rejection_reason": null,
  "can_approve": true,
  "can_cancel": true,
  "can_recall": false
}
```

### HolidaySerializer
```json
{
  "id": "uuid",
  "name": "Independence Day",
  "date": "2026-02-04",
  "holiday_type": "PUBLIC",
  "description": "Sri Lanka Independence Day",
  "applies_to": "ALL",
  "department": null,
  "location": null,
  "is_recurring": true
}
```

### Request ViewSet Actions
| Action | Method | Permissions |
|--------|--------|-------------|
| list | GET | Authenticated |
| create | POST | Authenticated |
| retrieve | GET | Owner or Manager |
| update | PUT | Owner (DRAFT only) |
| submit | POST | Owner |
| approve | POST | Manager |
| reject | POST | Manager |
| cancel | POST | Owner |
| recall | POST | Owner |

### Filtering Options
```
GET /requests/?status=PENDING
GET /requests/?leave_type={id}
GET /requests/?start_date__gte=2026-01-01
GET /requests/?start_date__lte=2026-01-31
GET /requests/?employee={employee_id}
```

### Test Categories
| Category | Tests |
|----------|-------|
| Model Tests | LeaveType, LeaveBalance, LeaveRequest, Holiday |
| Service Tests | Accrual, request operations |
| Workflow Tests | Submit, approve, reject, cancel, recall |
| Balance Tests | Deduction, restoration |
| Calendar Tests | Working days, holiday exclusion |
| API Tests | All endpoints, permissions |

### Documentation Sections
1. **Overview** - Module introduction
2. **Leave Types** - Configuration guide
3. **Leave Policy** - Policy setup
4. **Balance Management** - Accrual, carry forward
5. **Request Workflow** - Step-by-step
6. **Holiday Management** - Calendar setup
7. **Reports** - Available reports
8. **API Reference** - All endpoints
9. **Sri Lanka Compliance** - Local requirements
10. **Configuration** - Settings reference
