# Group F: API, Testing & Documentation

> **Phase:** 06 - ERP Advanced Modules  
> **SubPhase:** 03 - Attendance System  
> **Group:** F of F  
> **Tasks Covered:** 77-88  
> **Group Goal:** Create API endpoints, tests, and module documentation

---

## Navigation

- **↑ Parent:** [SubPhase-03 Summary](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [Group E: Reports & Analytics](../Group-E_Reports-Analytics/)

---

## Group Overview

### Key Outcomes

1. **ShiftSerializer** - DRF serializer for Shift model
2. **AttendanceRecordSerializer** - Serializer for attendance
3. **RegularizationSerializer** - Serializer for regularization
4. **ShiftViewSet** - ViewSet for shift CRUD
5. **AttendanceViewSet** - ViewSet for attendance
6. **CheckInView** - API for clock in/out
7. **RegularizationViewSet** - Regularization workflow
8. **Attendance Filtering** - Filter by date, employee, status
9. **BiometricWebhook View** - Webhook for biometric devices
10. **Attendance API URLs** - All endpoint registration
11. **Attendance Module Tests** - Unit and integration tests
12. **Attendance Documentation** - API docs, guides

### Technology Context

| Technology | Purpose |
|------------|---------|
| Django REST Framework | API serializers/views |
| django-filter | Filtering capabilities |
| Webhook | Biometric integration |
| pytest | Testing framework |

---

## Documents in This Group

| # | Document | Tasks | Description |
|---|----------|-------|-------------|
| 01 | `01_Tasks-77-83_Serializers-ViewSets.md` | 77-83 | Serializers, viewsets, check-in API |
| 02 | `02_Tasks-84-88_Filter-Webhook-Tests-Docs.md` | 84-88 | Filtering, webhook, tests, documentation |

---

## Task Summary

| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 77 | Create ShiftSerializer | Medium | 25 min |
| 78 | Create AttendanceRecordSerializer | Medium | 30 min |
| 79 | Create RegularizationSerializer | Medium | 25 min |
| 80 | Create ShiftViewSet | Medium | 25 min |
| 81 | Create AttendanceViewSet | High | 30 min |
| 82 | Create CheckInView | High | 35 min |
| 83 | Create RegularizationViewSet | High | 30 min |
| 84 | Implement Attendance Filtering | Medium | 25 min |
| 85 | Create BiometricWebhook View | High | 35 min |
| 86 | Register Attendance API URLs | Low | 20 min |
| 87 | Create Attendance Module Tests | High | 45 min |
| 88 | Create Attendance Documentation | Medium | 35 min |

---

## Execution Order

```
[Tasks 77-83: Serializers, viewsets, check-in API]
         │
         ▼
[Tasks 84-88: Filtering, webhook, tests, documentation]
```

---

## Expected Deliverables

```
apps/attendance/
├── serializers/
│   ├── __init__.py
│   ├── shift_serializer.py       # Task 77
│   ├── attendance_serializer.py  # Task 78
│   └── regularization_serializer.py # Task 79
├── views/
│   ├── __init__.py
│   ├── shift_viewset.py          # Task 80
│   ├── attendance_viewset.py     # Task 81
│   ├── checkin_view.py           # Task 82
│   ├── regularization_viewset.py # Task 83
│   └── biometric_webhook.py      # Task 85
├── filters.py                    # Task 84
├── urls.py                       # Task 86
├── tests/
│   ├── __init__.py
│   ├── test_models.py
│   ├── test_services.py
│   ├── test_api.py               # Task 87
│   └── test_integration.py
└── docs/
    └── README.md                 # Task 88
```

---

## Notes for AI Agents

### Attendance API Endpoints
```
/api/v1/attendance/
├── GET /shifts/                  # List shifts
├── POST /shifts/                 # Create shift
├── GET /shifts/{id}/             # Get shift detail
├── PUT /shifts/{id}/             # Update shift
├── DELETE /shifts/{id}/          # Delete shift
├── GET /shifts/{id}/schedules/   # Get shift schedules
│
├── GET /records/                 # List attendance records
├── GET /records/{id}/            # Get record detail
├── GET /records/today/           # Today's record for user
├── GET /records/employee/{id}/   # Employee's records
│
├── POST /clock-in/               # Clock in
├── POST /clock-out/              # Clock out
├── GET /status/                  # Current status (in/out)
│
├── GET /regularizations/         # List regularizations
├── POST /regularizations/        # Create request
├── GET /regularizations/{id}/    # Get request detail
├── POST /regularizations/{id}/approve/ # Approve
├── POST /regularizations/{id}/reject/  # Reject
│
├── POST /webhook/biometric/      # Biometric webhook
│
├── GET /reports/daily/           # Daily report
├── GET /reports/weekly/          # Weekly report
├── GET /reports/monthly/         # Monthly report
├── GET /reports/employee/{id}/   # Employee report
├── GET /reports/department/{id}/ # Department report
├── GET /reports/export/          # Export report
│
├── GET /dashboard/               # Dashboard data
└── WS /ws/dashboard/             # Real-time dashboard
```

### ShiftSerializer
```json
{
  "id": "uuid",
  "name": "Regular Day Shift",
  "code": "SHIFT-REG",
  "shift_type": "REGULAR",
  "start_time": "09:00:00",
  "end_time": "17:30:00",
  "break_start": "13:00:00",
  "break_end": "13:30:00",
  "work_hours": 8.0,
  "late_grace_minutes": 15,
  "overtime_start_after": 8.5,
  "overtime_multiplier": 1.5
}
```

### AttendanceRecordSerializer
```json
{
  "id": "uuid",
  "employee": {
    "id": "uuid",
    "name": "John Doe",
    "employee_id": "EMP-0001"
  },
  "date": "2026-01-17",
  "clock_in": "2026-01-17T09:05:00+05:30",
  "clock_out": "2026-01-17T17:45:00+05:30",
  "clock_in_method": "WEB",
  "clock_out_method": "WEB",
  "status": "PRESENT",
  "shift": {...},
  "work_hours": 8.25,
  "late_minutes": 0,
  "overtime_hours": 0.25,
  "is_late": false,
  "is_early_departure": false
}
```

### CheckIn API Request/Response
```
POST /api/v1/attendance/clock-in/
Request:
{
  "method": "WEB",
  "location": {
    "latitude": 6.9271,
    "longitude": 79.8612
  }
}

Response:
{
  "success": true,
  "message": "Clocked in successfully",
  "record": {
    "id": "uuid",
    "clock_in": "2026-01-17T09:05:00+05:30",
    "status": "PRESENT",
    "shift": "Regular Day Shift"
  }
}
```

### Biometric Webhook
```
POST /api/v1/attendance/webhook/biometric/
Headers:
  X-Device-ID: device-001
  X-Signature: hmac-sha256-signature

Request:
{
  "device_id": "device-001",
  "employee_id": "EMP-0001",
  "event_type": "PUNCH_IN",
  "timestamp": "2026-01-17T09:00:00+05:30",
  "verification_method": "fingerprint"
}

Response:
{
  "success": true,
  "message": "Event processed",
  "record_id": "uuid"
}
```

### Attendance Filtering Options
```
GET /records/?date=2026-01-17
GET /records/?date_from=2026-01-01&date_to=2026-01-31
GET /records/?employee={employee_id}
GET /records/?department={department_id}
GET /records/?status=LATE
GET /records/?status__in=LATE,ABSENT
GET /records/?is_late=true
GET /records/?has_overtime=true
```

### Test Categories
| Category | Tests |
|----------|-------|
| Model Tests | Shift, AttendanceRecord, Regularization |
| Service Tests | Clock in/out, late detection, overtime |
| API Tests | All endpoints, permissions |
| Integration | Biometric webhook, mobile check-in |
| Timezone Tests | Asia/Colombo handling |
| Celery Tests | Daily tasks, auto clock-out |

### Documentation Sections
1. **Overview** - Module introduction
2. **Shift Configuration** - How to set up shifts
3. **Check-In Methods** - Web, mobile, biometric
4. **Regularization** - Correction workflow
5. **Overtime** - Detection and approval
6. **Reports** - Available reports
7. **API Reference** - All endpoints
8. **Biometric Integration** - Webhook setup
9. **Mobile App Integration** - GPS requirements
10. **Configuration** - Settings reference
