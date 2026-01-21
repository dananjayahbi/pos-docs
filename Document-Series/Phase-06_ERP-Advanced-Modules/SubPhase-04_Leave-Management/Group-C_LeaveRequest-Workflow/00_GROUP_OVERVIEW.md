# Group C: Leave Request Workflow

> **Phase:** 06 - ERP Advanced Modules  
> **SubPhase:** 04 - Leave Management  
> **Group:** C of F  
> **Tasks Covered:** 35-52  
> **Group Goal:** Implement leave request model and approval workflow

---

## Navigation

- **↑ Parent:** [SubPhase-04 Summary](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [Group B: Leave Balance & Accrual](../Group-B_LeaveBalance-Accrual/)
- **→ Next Group:** [Group D: Holiday & Calendar Management](../Group-D_Holiday-Calendar-Management/)

---

## Group Overview

### Key Outcomes

1. **LeaveRequestStatus Choices** - DRAFT, PENDING, APPROVED, REJECTED, CANCELLED, RECALLED
2. **LeaveRequest Model** - Core leave request model
3. **Request Employee FK** - Link to Employee
4. **Request Leave Type FK** - Link to LeaveType
5. **Request Date Fields** - start_date, end_date, total_days
6. **Half Day Support** - is_half_day, half_day_type
7. **Request Reason Field** - reason, contact_during_leave
8. **Request Status Field** - Status tracking
9. **Approval Fields** - approved_by, approved_at, rejection_reason
10. **Document Attachment** - FileField for supporting docs
11. **LeaveRequest Migrations** - Apply migrations
12. **LeaveRequestService** - Request operations service
13. **Submit Request** - Validate and submit
14. **Balance Validation** - Check available balance
15. **Overlap Detection** - Detect overlapping requests
16. **Approval Workflow** - Manager approval
17. **Rejection Workflow** - Rejection with reason
18. **Cancel/Recall** - Cancel or recall leave

### Technology Context

| Technology | Purpose |
|------------|---------|
| Django ORM | LeaveRequest model |
| Service Layer | Request operations |
| State Machine | Status transitions |
| FileField | Document attachments |

---

## Documents in This Group

| # | Document | Tasks | Description |
|---|----------|-------|-------------|
| 01 | `01_Tasks-35-45_Request-Model.md` | 35-45 | LeaveRequestStatus, model, migrations |
| 02 | `02_Tasks-46-52_Request-Service-Workflow.md` | 46-52 | RequestService, validation, approval workflow |

---

## Task Summary

| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 35 | Define LeaveRequestStatus Choices | Low | 15 min |
| 36 | Create LeaveRequest Model | Medium | 25 min |
| 37 | Add Request Employee FK | Low | 15 min |
| 38 | Add Request Leave Type FK | Low | 15 min |
| 39 | Add Request Date Fields | Medium | 20 min |
| 40 | Add Half Day Support | Medium | 20 min |
| 41 | Add Request Reason Field | Low | 15 min |
| 42 | Add Request Status Field | Low | 15 min |
| 43 | Add Approval Fields | Medium | 20 min |
| 44 | Add Document Attachment | Medium | 20 min |
| 45 | Run LeaveRequest Migrations | Low | 15 min |
| 46 | Create LeaveRequestService | High | 35 min |
| 47 | Implement Submit Request | High | 30 min |
| 48 | Implement Balance Validation | Medium | 25 min |
| 49 | Implement Overlap Detection | Medium | 25 min |
| 50 | Implement Approval Workflow | High | 35 min |
| 51 | Implement Rejection Workflow | Medium | 20 min |
| 52 | Implement Cancel/Recall | High | 30 min |

---

## Execution Order

```
[Tasks 35-45: LeaveRequest model, migrations]
         │
         ▼
[Tasks 46-52: RequestService, workflow]
```

---

## Expected Deliverables

```
apps/leave/
├── constants.py                  # Task 35 (add to existing)
├── models/
│   └── leave_request.py          # Tasks 36-44
├── services/
│   └── request_service.py        # Tasks 46-52
└── migrations/
    └── 0004_leave_request.py     # Task 45
```

---

## Notes for AI Agents

### LeaveRequestStatus Choices
| Status | Description |
|--------|-------------|
| DRAFT | Not yet submitted |
| PENDING | Awaiting approval |
| APPROVED | Approved by manager |
| REJECTED | Rejected with reason |
| CANCELLED | Cancelled by employee |
| RECALLED | Recalled after approval |

### Status Transitions
```
DRAFT → PENDING (submit)
PENDING → APPROVED (approve)
PENDING → REJECTED (reject)
PENDING → CANCELLED (cancel)
APPROVED → RECALLED (recall, before start date)
```

### LeaveRequest Model Fields
- employee: FK to Employee
- leave_type: FK to LeaveType
- start_date: DateField
- end_date: DateField
- total_days: Decimal (calculated)
- is_half_day: Boolean
- half_day_type: Choice (FIRST_HALF, SECOND_HALF)
- reason: TextField
- contact_during_leave: CharField
- status: LeaveRequestStatus
- attachment: FileField (nullable)
- approved_by: FK to User (nullable)
- approved_at: DateTimeField (nullable)
- rejection_reason: TextField (nullable)
- recalled_at: DateTimeField (nullable)
- recalled_reason: TextField (nullable)
- submitted_at: DateTimeField
- created_at: DateTimeField
- updated_at: DateTimeField

### Half Day Support
```
is_half_day = True
half_day_type = FIRST_HALF or SECOND_HALF

Total Days Calculation:
- Full day: end_date - start_date + 1
- Half day: 0.5 days

Example:
Start: Jan 15 (half day FIRST_HALF)
End: Jan 15
Total: 0.5 days
```

### LeaveRequestService Methods
- create_draft(employee_id, data)
- submit(request_id, user)
- validate_balance(request)
- check_overlap(request)
- approve(request_id, approved_by, notes=None)
- reject(request_id, rejected_by, reason)
- cancel(request_id, user)
- recall(request_id, user, reason)
- get_pending_for_manager(manager_id)
- get_employee_requests(employee_id, filters)

### Balance Validation
```
On Submit:
1. Get employee's LeaveBalance for leave_type and year
2. Check: available_days >= total_days
3. If insufficient: Raise ValidationError

On Approval:
1. Increment used_days
2. Decrement pending_days

On Rejection/Cancel:
1. Decrement pending_days (if was PENDING)
```

### Overlap Detection
```
Check if new request overlaps with:
- Existing APPROVED requests
- Existing PENDING requests

Overlap exists if:
(new_start <= existing_end) AND (new_end >= existing_start)

Exception:
- Allow overlap with CANCELLED/REJECTED
```

### Approval Workflow
```
1. Employee submits request
   → Status: PENDING
   → Increment pending_days in balance
   → Notify manager

2. Manager reviews
   → APPROVE: 
     - Status: APPROVED
     - Move pending_days to used_days
     - Notify employee
   → REJECT:
     - Status: REJECTED
     - Restore pending_days
     - Notify employee with reason
```

### Recall Workflow
```
Conditions:
- Status must be APPROVED
- Current date must be before start_date
- Cannot recall after leave has started

Process:
1. Set status = RECALLED
2. Restore used_days to available
3. Notify manager
4. Log recall reason
```

### Attachment Handling
```
Supported formats: PDF, JPG, PNG
Max size: 5MB
Storage: Tenant-specific folder

Path: /media/tenants/{tenant}/leave_docs/{year}/{request_id}/
```

### Notification Triggers
| Event | Notify |
|-------|--------|
| Submit | Manager |
| Approve | Employee |
| Reject | Employee |
| Cancel | Manager |
| Recall | Manager |
