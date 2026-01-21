# Group D: Leave Management

> **Phase:** 07 - Frontend Infrastructure & ERP Dashboard  
> **SubPhase:** 13 - HR & Payroll UI  
> **Group:** D of F  
> **Tasks Covered:** 53-68  
> **Group Goal:** Build leave management with balances, request workflow, and calendar view

---

## Navigation

- **↑ Parent:** [00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [Group-C_Attendance-Management](../Group-C_Attendance-Management/)
- **→ Next Group:** [Group-E_Payroll-Processing](../Group-E_Payroll-Processing/)

---

## Group Overview

This group creates the complete leave management interface. Creates leave dashboard page with header and request button. Builds leave balance cards showing entitlement and used for each type. Creates leave requests table with columns for employee, type, dates, and status. Adds leave status badge (Pending, Approved, Rejected). Creates leave request page with form. Creates Zod schema for leave request. Builds leave type select, date picker (start/end), and reason input. Creates leave approval actions with approve/reject buttons. Creates approval modal with notes. Creates leave calendar view showing team leaves. Connects to leave API.

### Key Outcomes

- Leave dashboard page
- Leave header with request button
- Leave balance cards container
- Leave balance card component
- Leave requests table
- Leave request columns defined
- Leave status badge
- Leave request page
- Leave form schema
- Leave type select
- Leave date picker (range)
- Leave reason input
- Leave approval actions
- Approval modal
- Leave calendar view
- Connected to leave API

### Technology Context

- **Form:** React Hook Form + Zod
- **Calendar:** Team leave calendar
- **Status:** Approval workflow
- **Balance:** Leave entitlements

---

## Documents in This Group

| # | Document | Description | Tasks Covered |
|---|----------|-------------|---------------|
| 01 | `01_Tasks-53-62_Dashboard-Form.md` | Create leave dashboard and request form | 53-62 |
| 02 | `02_Tasks-63-68_Approval-Calendar-API.md` | Create approval actions, calendar, and API | 63-68 |

---

## Task Summary

| Task # | Task Name | Complexity | Dependencies |
|--------|-----------|------------|--------------|
| 53 | Create Leave Dashboard Page | Low | Task 16 |
| 54 | Create Leave Header | Low | Task 53 |
| 55 | Create Leave Balance Cards | Medium | Task 53 |
| 56 | Create Leave Balance Card | Low | Task 55 |
| 57 | Create Leave Requests Table | Medium | Task 53 |
| 58 | Define Leave Request Columns | Medium | Task 57 |
| 59 | Create Leave Status Badge | Low | Task 58 |
| 60 | Create Leave Request Page | Medium | Task 16 |
| 61 | Create Leave Form Schema | Medium | Task 60 |
| 62 | Create Leave Type Select | Low | Task 61 |
| 63 | Create Leave Date Picker | Low | Task 61 |
| 64 | Create Leave Reason Input | Low | Task 61 |
| 65 | Create Leave Approval Actions | Medium | Task 57 |
| 66 | Create Approval Modal | Medium | Task 65 |
| 67 | Create Leave Calendar View | Medium | Task 53 |
| 68 | Connect Leave to API | Medium | Task 67 |

---

## Execution Order

```
Task 53: Leave Dashboard Page
    │
    ├──────────────────────────────────────────────────┐
    ▼                                                  │
Task 54: Leave Header                                  │
    │                                                  │
    ▼                                                  │
Task 55: Leave Balance Cards                           │
    │                                                  │
    ▼                                                  │
Task 56: Balance Card                                  │
    │                                                  │
    ▼                                                  │
Task 57: Leave Requests Table                          │
    │                                                  │
    ▼                                                  │
Task 58: Request Columns                               │
    │                                                  │
    ▼                                                  │
Task 59: Status Badge                                  │
    │                                                  │
    └──────────────────────────────────────────────────┘
               │
               ▼
         Task 60: Leave Request Page
               │
               ▼
         Task 61: Form Schema
               │
         ┌─────┼─────┬─────┐
         ▼     ▼     ▼     │
      Task 62 Task 63 Task 64
      (Type)  (Dates) (Reason)
         │     │     │     │
         └─────┴─────┴─────┘
               │
               ▼
         Task 65: Approval Actions
               │
               ▼
         Task 66: Approval Modal
               │
               ▼
         Task 67: Leave Calendar
               │
               ▼
         Task 68: API
```

---

## Expected Deliverables

```
frontend/
├── app/
│   └── (dashboard)/
│       └── leave/
│           ├── page.tsx
│           └── request/
│               └── page.tsx
├── components/
│   └── modules/
│       └── hr/
│           └── Leave/
│               ├── LeaveDashboard.tsx
│               ├── LeaveHeader.tsx
│               ├── LeaveBalanceCards.tsx
│               ├── LeaveBalanceCard.tsx
│               ├── LeaveRequestsTable.tsx
│               ├── LeaveRequestColumns.tsx
│               ├── LeaveStatusBadge.tsx
│               ├── LeaveRequestForm.tsx
│               ├── LeaveTypeSelect.tsx
│               ├── LeaveDatePicker.tsx
│               ├── LeaveReasonInput.tsx
│               ├── LeaveApprovalActions.tsx
│               ├── ApprovalModal.tsx
│               ├── LeaveCalendar.tsx
│               └── index.ts
└── lib/
    └── validations/
        └── leave.ts
```

---

## Notes for AI Agents

### Leave Balance Cards (Task 55)
| Type | Entitlement | Color |
|------|-------------|-------|
| Annual | 14 days | Blue |
| Casual | 7 days | Green |
| Sick | 7 days | Yellow |
| Maternity | 84 days | Pink |
| Paternity | 3 days | Purple |

### Leave Balance Card (Task 56)
| Element | Content |
|---------|---------|
| Type Name | Leave type |
| Used | Days used |
| Remaining | Days left |
| Total | Total entitlement |
| Progress | Usage bar |

### Leave Request Columns (Task 58)
| Column | Width | Sortable |
|--------|-------|----------|
| Employee | 200px | Yes |
| Type | 100px | Yes |
| Start Date | 100px | Yes |
| End Date | 100px | Yes |
| Days | 60px | No |
| Status | 100px | Yes |
| Actions | 120px | No |

### Leave Status Badge (Task 59)
| Status | Color | Description |
|--------|-------|-------------|
| Pending | Yellow | Awaiting approval |
| Approved | Green | Approved |
| Rejected | Red | Rejected |

### Leave Form Schema (Task 61)
| Field | Type | Validation |
|-------|------|------------|
| leave_type | enum | Required |
| start_date | date | Required, future |
| end_date | date | Required, >= start |
| reason | string | Optional |
| half_day | boolean | Optional |

### Leave Types (Task 62)
| Type | Value | Days |
|------|-------|------|
| Annual | annual | 14 |
| Casual | casual | 7 |
| Sick | sick | 7 |
| Maternity | maternity | 84 |
| Paternity | paternity | 3 |
| Unpaid | unpaid | - |

### Date Picker (Task 63)
| Feature | Description |
|---------|-------------|
| Range | Start and end date |
| Validation | End >= Start |
| Weekends | Optional exclude |
| Holidays | Highlight holidays |

### Approval Modal (Task 66)
| Field | Type |
|-------|------|
| Decision | Approve/Reject |
| Notes | Textarea |
| Notify | Checkbox |

### Leave Calendar (Task 67)
| View | Description |
|------|-------------|
| Month | Monthly calendar |
| Color | By leave type |
| Tooltip | Employee + type |
| Filter | By department |
