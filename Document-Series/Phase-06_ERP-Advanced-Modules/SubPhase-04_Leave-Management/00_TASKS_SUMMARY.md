# SubPhase 04: Leave Management - Tasks Summary

> **Phase:** 06 - ERP Advanced Modules  
> **SubPhase Index:** 04 of 14  
> **SubPhase Goal:** Manage employee leave requests, approvals, and balances  
> **Total Tasks:** 90 | **Status:** Planning  
> **Estimated Duration:** 12-14 hours

---

## Navigation

- **↑ Parent:** [00_SUBPHASES_SUMMARY.md](../00_SUBPHASES_SUMMARY.md)
- **← Previous SubPhase:** [SubPhase-03_Attendance-System](../SubPhase-03_Attendance-System/)
- **→ Next SubPhase:** [SubPhase-05_Salary-Structure](../SubPhase-05_Salary-Structure/)

---

## SubPhase Overview

This sub-phase implements a complete leave management system for HR operations. Supports configurable leave types (Annual, Casual, Sick, Maternity/Paternity), leave balance tracking, request-approval workflow, leave calendar, and holiday management for Sri Lanka.

### Key Outcomes
- Leave type configuration with Sri Lanka compliance
- Leave policy with accrual rules
- Employee leave balance tracking
- Leave request and approval workflow
- Manager approval hierarchy
- Leave calendar view
- Holiday calendar management
- Carry forward and expiry rules
- Leave encashment support
- Integration with attendance and payroll

### Technology Context
- **Backend:** Django 5.x with DRF for API
- **Workflow:** State machine for leave request status
- **Calendar:** FullCalendar integration for frontend
- **Frontend:** Next.js 14+ with TypeScript

### Dependencies
- Phase-06 SubPhase-01: Employee model
- Phase-06 SubPhase-02: Department model
- Phase-06 SubPhase-03: Attendance (for leave status in attendance)

---

## Task Execution Order

```
TASK GROUP A: Leave Type & Policy Models (Tasks 01-18)
        │
        ▼
TASK GROUP B: Leave Balance & Accrual (Tasks 19-34)
        │
        ▼
TASK GROUP C: Leave Request Workflow (Tasks 35-52)
        │
        ▼
TASK GROUP D: Holiday & Calendar Management (Tasks 53-66)
        │
        ▼
TASK GROUP E: Reports & Integration (Tasks 67-80)
        │
        ▼
TASK GROUP F: API, Testing & Documentation (Tasks 81-90)
```

---

## Task Index

### Group A: Leave Type & Policy Models (Tasks 01-18)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 01 | **Create leave Django App** | Create new Django app for leave management | None | 🔴 Not Created |
| 02 | **Register leave App** | Add leave app to TENANT_APPS | Task 01 | 🔴 Not Created |
| 03 | **Define LeaveTypeCategory Choices** | Create enum: ANNUAL, CASUAL, SICK, MATERNITY, PATERNITY, NO_PAY, OTHER | Task 01 | 🔴 Not Created |
| 04 | **Create LeaveType Model Core** | Define LeaveType with name, code, category | Task 03 | 🔴 Not Created |
| 05 | **Add Leave Type Description** | Add description, color (for calendar) | Task 04 | 🔴 Not Created |
| 06 | **Add Days Per Year Field** | Add default_days_per_year for annual allocation | Task 04 | 🔴 Not Created |
| 07 | **Add Max Days Field** | Add max_consecutive_days, max_days_per_request | Task 04 | 🔴 Not Created |
| 08 | **Add Paid Leave Flag** | Add is_paid boolean for payroll calculation | Task 04 | 🔴 Not Created |
| 09 | **Add Document Required Flag** | Add requires_document (e.g., sick certificate) | Task 04 | 🔴 Not Created |
| 10 | **Add Gender Restriction** | Add applicable_gender for maternity/paternity | Task 04 | 🔴 Not Created |
| 11 | **Add Min Service Requirement** | Add min_service_months to be eligible | Task 04 | 🔴 Not Created |
| 12 | **Add Advance Notice Days** | Add min_notice_days for leave request | Task 04 | 🔴 Not Created |
| 13 | **Run LeaveType Migrations** | Generate and apply migrations | Task 12 | 🔴 Not Created |
| 14 | **Create LeavePolicy Model** | Policy linking leave types to groups | Task 13 | 🔴 Not Created |
| 15 | **Add Policy Scope Fields** | Add applies_to (all, department, designation) | Task 14 | 🔴 Not Created |
| 16 | **Add Policy Date Range** | Add effective_from, effective_to | Task 14 | 🔴 Not Created |
| 17 | **Run LeavePolicy Migrations** | Generate and apply migrations | Task 16 | 🔴 Not Created |
| 18 | **Create Default Leave Types Seed** | Seed Sri Lanka standard leave types | Task 17 | 🔴 Not Created |

---

### Group B: Leave Balance & Accrual (Tasks 19-34)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 19 | **Define AccrualMethod Choices** | Create enum: ANNUAL_GRANT, MONTHLY_ACCRUAL, PRO_RATA | Task 18 | 🔴 Not Created |
| 20 | **Create LeaveBalance Model** | Track employee leave balances | Task 19 | 🔴 Not Created |
| 21 | **Add Balance Core Fields** | Add employee FK, leave_type FK, year | Task 20 | 🔴 Not Created |
| 22 | **Add Allocation Fields** | Add allocated_days, opening_balance | Task 20 | 🔴 Not Created |
| 23 | **Add Usage Fields** | Add used_days, pending_days, available_days | Task 20 | 🔴 Not Created |
| 24 | **Add Carry Forward Field** | Add carried_from_previous for rollover | Task 20 | 🔴 Not Created |
| 25 | **Add Encashed Field** | Add encashed_days for leave encashment | Task 20 | 🔴 Not Created |
| 26 | **Run LeaveBalance Migrations** | Generate and apply migrations | Task 25 | 🔴 Not Created |
| 27 | **Create LeaveAccrualService** | Service for leave accrual calculations | Task 26 | 🔴 Not Created |
| 28 | **Implement Annual Grant Accrual** | Grant full balance at year start | Task 27 | 🔴 Not Created |
| 29 | **Implement Monthly Accrual** | Credit leave monthly (days/12) | Task 27 | 🔴 Not Created |
| 30 | **Implement Pro-Rata for New Joiners** | Calculate based on join date | Task 27 | 🔴 Not Created |
| 31 | **Implement Carry Forward Logic** | Roll over unused leave to next year | Task 27 | 🔴 Not Created |
| 32 | **Add Max Carry Forward Limit** | Limit carry forward days | Task 31 | 🔴 Not Created |
| 33 | **Implement Leave Expiry** | Expire leaves after carry forward period | Task 31 | 🔴 Not Created |
| 34 | **Create Year-End Accrual Celery Task** | Annual leave balance reset/rollover | Task 33 | 🔴 Not Created |

---

### Group C: Leave Request Workflow (Tasks 35-52)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 35 | **Define LeaveRequestStatus Choices** | Create enum: DRAFT, PENDING, APPROVED, REJECTED, CANCELLED, RECALLED | Task 34 | 🔴 Not Created |
| 36 | **Create LeaveRequest Model** | Core leave request model | Task 35 | 🔴 Not Created |
| 37 | **Add Request Employee FK** | Add employee ForeignKey | Task 36 | 🔴 Not Created |
| 38 | **Add Request Leave Type FK** | Add leave_type ForeignKey | Task 36 | 🔴 Not Created |
| 39 | **Add Request Date Fields** | Add start_date, end_date, total_days | Task 36 | 🔴 Not Created |
| 40 | **Add Half Day Support** | Add is_half_day, half_day_type (FIRST/SECOND) | Task 36 | 🔴 Not Created |
| 41 | **Add Request Reason Field** | Add reason, contact_during_leave | Task 36 | 🔴 Not Created |
| 42 | **Add Request Status Field** | Add status using LeaveRequestStatus | Task 36 | 🔴 Not Created |
| 43 | **Add Approval Fields** | Add approved_by, approved_at, rejection_reason | Task 36 | 🔴 Not Created |
| 44 | **Add Document Attachment** | Add attachment FileField for supporting docs | Task 36 | 🔴 Not Created |
| 45 | **Run LeaveRequest Migrations** | Generate and apply migrations | Task 44 | 🔴 Not Created |
| 46 | **Create LeaveRequestService** | Service for leave request operations | Task 45 | 🔴 Not Created |
| 47 | **Implement Submit Request** | Validate and submit leave request | Task 46 | 🔴 Not Created |
| 48 | **Implement Balance Validation** | Check available balance before submit | Task 46 | 🔴 Not Created |
| 49 | **Implement Overlap Detection** | Detect overlapping leave requests | Task 46 | 🔴 Not Created |
| 50 | **Implement Approval Workflow** | Manager approval with notifications | Task 46 | 🔴 Not Created |
| 51 | **Implement Rejection Workflow** | Rejection with reason | Task 46 | 🔴 Not Created |
| 52 | **Implement Cancel/Recall** | Cancel pending or recall approved leave | Task 46 | 🔴 Not Created |

---

### Group D: Holiday & Calendar Management (Tasks 53-66)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 53 | **Define HolidayType Choices** | Create enum: PUBLIC, BANK, COMPANY, OPTIONAL | Task 52 | 🔴 Not Created |
| 54 | **Create Holiday Model** | Model for holidays/non-working days | Task 53 | 🔴 Not Created |
| 55 | **Add Holiday Core Fields** | Add name, date, holiday_type, description | Task 54 | 🔴 Not Created |
| 56 | **Add Holiday Scope Fields** | Add applies_to (all, department, location) | Task 54 | 🔴 Not Created |
| 57 | **Add Recurring Holiday Flag** | Add is_recurring, recurrence_rule | Task 54 | 🔴 Not Created |
| 58 | **Run Holiday Migrations** | Generate and apply migrations | Task 57 | 🔴 Not Created |
| 59 | **Create Sri Lanka Holidays Seed** | Seed public holidays for Sri Lanka | Task 58 | 🔴 Not Created |
| 60 | **Create LeaveCalendarService** | Service for calendar data generation | Task 59 | 🔴 Not Created |
| 61 | **Implement Team Calendar** | Show team leaves on calendar | Task 60 | 🔴 Not Created |
| 62 | **Implement Department Calendar** | Show department leaves | Task 60 | 🔴 Not Created |
| 63 | **Implement Holiday Calendar** | Show holidays on calendar | Task 60 | 🔴 Not Created |
| 64 | **Implement Calendar JSON Export** | FullCalendar compatible JSON | Task 60 | 🔴 Not Created |
| 65 | **Calculate Working Days** | Exclude weekends and holidays | Task 60 | 🔴 Not Created |
| 66 | **Auto-Adjust Leave Days** | Adjust total_days excluding holidays | Task 65 | 🔴 Not Created |

---

### Group E: Reports & Integration (Tasks 67-80)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 67 | **Create LeaveReportService** | Service for leave reports | Task 66 | 🔴 Not Created |
| 68 | **Implement Balance Summary Report** | All employees' current balances | Task 67 | 🔴 Not Created |
| 69 | **Implement Leave History Report** | Employee leave history by date range | Task 67 | 🔴 Not Created |
| 70 | **Implement Department Leave Report** | Department-level leave usage | Task 67 | 🔴 Not Created |
| 71 | **Implement Leave Type Usage Report** | Usage by leave type | Task 67 | 🔴 Not Created |
| 72 | **Implement Pending Approvals Report** | List of pending leave requests | Task 67 | 🔴 Not Created |
| 73 | **Implement Expiring Leave Report** | Leaves about to expire | Task 67 | 🔴 Not Created |
| 74 | **Create Report Export Service** | Export reports to Excel/PDF | Task 73 | 🔴 Not Created |
| 75 | **Integrate with Attendance** | Mark ON_LEAVE in attendance records | Task 74 | 🔴 Not Created |
| 76 | **Integrate with Payroll** | Provide leave days for salary calculation | Task 74 | 🔴 Not Created |
| 77 | **Create Leave Notification Service** | Email/push notifications for leave events | Task 74 | 🔴 Not Created |
| 78 | **Implement Request Submitted Notification** | Notify manager of new request | Task 77 | 🔴 Not Created |
| 79 | **Implement Approval Notification** | Notify employee of approval/rejection | Task 77 | 🔴 Not Created |
| 80 | **Create Leave Dashboard Data** | Aggregate data for dashboard widgets | Task 77 | 🔴 Not Created |

---

### Group F: API, Testing & Documentation (Tasks 81-90)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 81 | **Create LeaveTypeSerializer** | DRF serializer for LeaveType | Task 80 | 🔴 Not Created |
| 82 | **Create LeaveBalanceSerializer** | DRF serializer for LeaveBalance | Task 81 | 🔴 Not Created |
| 83 | **Create LeaveRequestSerializer** | DRF serializer for LeaveRequest | Task 81 | 🔴 Not Created |
| 84 | **Create HolidaySerializer** | DRF serializer for Holiday | Task 81 | 🔴 Not Created |
| 85 | **Create LeaveTypeViewSet** | ViewSet for leave type CRUD | Task 84 | 🔴 Not Created |
| 86 | **Create LeaveRequestViewSet** | ViewSet with submit, approve, reject actions | Task 85 | 🔴 Not Created |
| 87 | **Create HolidayViewSet** | ViewSet for holiday management | Task 85 | 🔴 Not Created |
| 88 | **Register Leave API URLs** | Add all endpoints to URL config | Task 87 | 🔴 Not Created |
| 89 | **Create Leave Module Tests** | Unit and integration tests | Task 88 | 🔴 Not Created |
| 90 | **Create Leave Documentation** | API docs, leave policy guide | Task 89 | 🔴 Not Created |

---

## Expected File Structure

```
backend/apps/leave/
├── __init__.py
├── admin.py                    # Admin for LeaveType, LeaveRequest
├── apps.py                     # App configuration
├── models/
│   ├── __init__.py
│   ├── leave_type.py          # LeaveType model
│   ├── leave_policy.py        # LeavePolicy model
│   ├── leave_balance.py       # LeaveBalance model
│   ├── leave_request.py       # LeaveRequest model
│   └── holiday.py             # Holiday model
├── services/
│   ├── __init__.py
│   ├── accrual_service.py     # Leave accrual calculations
│   ├── request_service.py     # Leave request operations
│   ├── calendar_service.py    # Calendar data generation
│   ├── report_service.py      # Leave reports
│   └── notification_service.py # Leave notifications
├── serializers/
│   ├── __init__.py
│   ├── leave_type_serializer.py
│   ├── balance_serializer.py
│   ├── request_serializer.py
│   └── holiday_serializer.py
├── views/
│   ├── __init__.py
│   ├── leave_type_viewset.py
│   ├── request_viewset.py
│   ├── holiday_viewset.py
│   └── calendar_view.py
├── tasks/
│   ├── __init__.py
│   ├── accrual_tasks.py       # Year-end accrual
│   └── notification_tasks.py  # Email notifications
├── filters.py                  # Leave filtering
├── urls.py                     # URL routing
├── signals.py                  # Leave approval signals
├── tests/
│   ├── __init__.py
│   ├── test_models.py
│   ├── test_accrual.py
│   ├── test_workflow.py
│   └── test_api.py
├── management/
│   └── commands/
│       ├── seed_leave_types.py
│       └── seed_holidays.py
└── migrations/
```

---

## Leave Request Workflow

```
                        ┌─────────────────────────────┐
                        │     Employee Creates        │
                        │       Leave Request         │
                        └─────────────┬───────────────┘
                                      │
                                      ▼
                              ┌───────────────┐
                              │    DRAFT      │ ← Can be edited
                              └───────┬───────┘
                                      │ submit()
                                      ▼
                              ┌───────────────┐
                              │   PENDING     │ ← Awaiting approval
                              └───────┬───────┘
                                      │
              ┌───────────────────────┼───────────────────────┐
              │                       │                       │
              ▼                       ▼                       ▼
      ┌───────────────┐       ┌───────────────┐       ┌───────────────┐
      │   APPROVED    │       │   REJECTED    │       │  CANCELLED    │
      │ (Deduct bal.) │       │ (With reason) │       │ (By employee) │
      └───────┬───────┘       └───────────────┘       └───────────────┘
              │
              │ recall() (before start date)
              ▼
      ┌───────────────┐
      │   RECALLED    │ ← Restore balance
      └───────────────┘
```

---

## Sri Lanka Leave Types

| Leave Type | Days/Year | Paid | Notes |
|------------|-----------|------|-------|
| Annual Leave | 14-21 | ✅ | Based on tenure |
| Casual Leave | 7 | ✅ | Personal matters |
| Sick Leave | 7-14 | ✅ | Medical certificate required |
| Maternity Leave | 84 | ✅ | Female employees (3 months) |
| Paternity Leave | 3 | ✅ | Male employees |
| No-Pay Leave | Unlimited | ❌ | Unpaid leave |

---

## Leave Balance Calculation

```
ANNUAL BALANCE EXAMPLE:
─────────────────────────────────────
Opening Balance:       14 days
Carried Forward:        3 days
Total Available:       17 days
Used:                   5 days
Pending Approval:       2 days
Remaining:             10 days

CALCULATION:
Available = Opening + Carried - Used - Pending
          = 14 + 3 - 5 - 2
          = 10 days
```

---

## Working Days Calculation

```
LEAVE REQUEST:
─────────────────────────────────────
Start Date: Monday, Jan 15
End Date:   Friday, Jan 19
Total Calendar Days: 5

ADJUSTMENTS:
- Weekend Days: 0 (none in range)
- Holidays: 1 (Pongal - Jan 17)
- Working Days: 5 - 0 - 1 = 4 days

RESULT: Leave duration = 4 working days
```

---

## Key Business Rules

1. **Balance Check:** Cannot request more than available balance
2. **No Overlap:** Cannot have overlapping leave requests
3. **Advance Notice:** Some leave types require advance notice
4. **Document Required:** Sick leave may require medical certificate
5. **Manager Approval:** All leaves require manager approval
6. **Carry Forward Limit:** Max days that can roll over
7. **Expiry Date:** Carried forward leaves expire after period
8. **Holiday Exclusion:** Holidays don't count as leave days

---

## Sri Lanka Public Holidays (Sample)

| Date | Holiday |
|------|---------|
| Jan 14 | Pongal/Thai Pongal |
| Feb 4 | Independence Day |
| Apr 13-14 | Sinhala & Tamil New Year |
| May 1 | May Day |
| May (Full Moon) | Vesak Poya |
| Dec 25 | Christmas Day |

---

## Progress Tracking

| Metric | Count |
|--------|-------|
| Total Tasks | 90 |
| Tasks Completed | 0 |
| Tasks In Progress | 0 |
| Completion Percentage | 0% |

**Last Updated:** 2026-01-17  
**Next Action:** Create Task 01 (leave Django App)

---

## Notes for AI Agents

- Leave management is core HR feature
- Balance calculation must be accurate
- Consider timezone for date calculations
- Holiday exclusion in working days is critical
- Notify managers immediately on new requests
- Leave data feeds payroll (paid/unpaid)
- Support half-day leaves
- Consider comp-off (compensatory leave) in future

---

*End of SubPhase 04 Tasks Summary*
