# Group B: Leave Balance & Accrual

> **Phase:** 06 - ERP Advanced Modules  
> **SubPhase:** 04 - Leave Management  
> **Group:** B of F  
> **Tasks Covered:** 19-34  
> **Group Goal:** Implement leave balance tracking and accrual calculation

---

## Navigation

- **↑ Parent:** [SubPhase-04 Summary](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [Group A: Leave Type & Policy Models](../Group-A_LeaveType-Policy-Models/)
- **→ Next Group:** [Group C: Leave Request Workflow](../Group-C_LeaveRequest-Workflow/)

---

## Group Overview

### Key Outcomes

1. **AccrualMethod Choices** - ANNUAL_GRANT, MONTHLY_ACCRUAL, PRO_RATA
2. **LeaveBalance Model** - Track employee balances
3. **Balance Core Fields** - employee FK, leave_type FK, year
4. **Allocation Fields** - allocated_days, opening_balance
5. **Usage Fields** - used_days, pending_days, available_days
6. **Carry Forward Field** - carried_from_previous
7. **Encashed Field** - encashed_days
8. **LeaveBalance Migrations** - Apply migrations
9. **LeaveAccrualService** - Accrual calculation service
10. **Annual Grant Accrual** - Full balance at year start
11. **Monthly Accrual** - Credit leave monthly
12. **Pro-Rata for New Joiners** - Based on join date
13. **Carry Forward Logic** - Roll over unused leave
14. **Max Carry Forward Limit** - Limit carry forward
15. **Leave Expiry** - Expire after period
16. **Year-End Accrual Celery Task** - Annual reset/rollover

### Technology Context

| Technology | Purpose |
|------------|---------|
| Django ORM | LeaveBalance model |
| Service Layer | Accrual calculations |
| Celery | Year-end task |
| Decimal | Precise balance tracking |

---

## Documents in This Group

| # | Document | Tasks | Description |
|---|----------|-------|-------------|
| 01 | `01_Tasks-19-26_Balance-Model.md` | 19-26 | AccrualMethod, LeaveBalance model, migrations |
| 02 | `02_Tasks-27-34_Accrual-Service-Tasks.md` | 27-34 | AccrualService, carry forward, expiry, Celery |

---

## Task Summary

| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 19 | Define AccrualMethod Choices | Low | 10 min |
| 20 | Create LeaveBalance Model | Medium | 25 min |
| 21 | Add Balance Core Fields | Low | 15 min |
| 22 | Add Allocation Fields | Low | 15 min |
| 23 | Add Usage Fields | Medium | 20 min |
| 24 | Add Carry Forward Field | Low | 15 min |
| 25 | Add Encashed Field | Low | 15 min |
| 26 | Run LeaveBalance Migrations | Low | 15 min |
| 27 | Create LeaveAccrualService | High | 30 min |
| 28 | Implement Annual Grant Accrual | Medium | 25 min |
| 29 | Implement Monthly Accrual | Medium | 25 min |
| 30 | Implement Pro-Rata for New Joiners | High | 30 min |
| 31 | Implement Carry Forward Logic | High | 30 min |
| 32 | Add Max Carry Forward Limit | Medium | 20 min |
| 33 | Implement Leave Expiry | Medium | 25 min |
| 34 | Create Year-End Accrual Celery Task | High | 30 min |

---

## Execution Order

```
[Tasks 19-26: LeaveBalance model, migrations]
         │
         ▼
[Tasks 27-34: AccrualService, carry forward, Celery]
```

---

## Expected Deliverables

```
apps/leave/
├── constants.py                  # Task 19 (add to existing)
├── models/
│   └── leave_balance.py          # Tasks 20-25
├── services/
│   ├── __init__.py
│   └── accrual_service.py        # Tasks 27-33
├── tasks/
│   ├── __init__.py
│   └── accrual_tasks.py          # Task 34
└── migrations/
    └── 0003_leave_balance.py     # Task 26
```

---

## Notes for AI Agents

### AccrualMethod Choices
| Method | Description |
|--------|-------------|
| ANNUAL_GRANT | Full balance granted at year start |
| MONTHLY_ACCRUAL | Balance credited monthly (days/12) |
| PRO_RATA | Based on employment period |

### LeaveBalance Model Fields
- employee: FK to Employee
- leave_type: FK to LeaveType
- year: Integer (e.g., 2026)
- opening_balance: Decimal
- allocated_days: Decimal
- used_days: Decimal
- pending_days: Decimal
- available_days: Decimal (computed)
- carried_from_previous: Decimal
- carry_forward_expiry: DateField
- encashed_days: Decimal
- last_accrual_date: DateField
- is_active: Boolean

### Unique Constraint
```
unique_together = ['employee', 'leave_type', 'year']

One balance record per employee per leave type per year.
```

### Balance Calculation
```
Available = Opening + Allocated + Carried - Used - Pending - Encashed

Example:
Opening Balance:     14.0
Allocated (accrued):  0.0
Carried Forward:      3.0
Used:                 5.0
Pending Approval:     2.0
Encashed:             0.0
─────────────────────
Available:           10.0 days
```

### Annual Grant Accrual
```
January 1st:
- Create LeaveBalance for new year
- Set allocated_days = policy.days_per_year
- Process carry forward from previous year
```

### Monthly Accrual
```
Each month:
- Calculate: days_per_year / 12
- Add to allocated_days
- Example: 14 / 12 = 1.17 days per month
```

### Pro-Rata Calculation
```
New Joiner (joined June 1st):
- Remaining months: 7 (Jun-Dec)
- Annual entitlement: 14 days
- Pro-rata: 14 × (7/12) = 8.17 days
```

### Carry Forward Logic
```
Year-End Process:
1. Calculate unused days
2. Check if carry_forward_allowed
3. Apply max_carry_forward_days limit
4. Set carry_forward_expiry (e.g., March 31)
5. Create next year balance with carried amount

Example:
2025 Balance: 5 days unused
Max Carry: 3 days
2026 Balance: carried_from_previous = 3 days
Expiry: 2026-03-31
```

### Leave Expiry
```
Check carry_forward_expiry:
- If today > expiry_date:
  - Reduce available_days by carried_from_previous
  - Set carried_from_previous = 0
  - Log expiry record

Celery task runs daily to check expirations.
```

### Year-End Celery Task
```
Schedule: December 31 at 23:59

Process:
1. For each active employee:
   a. For each leave type:
      - Calculate carry forward
      - Create next year balance
      - Close current year balance
2. Log all operations
3. Send summary report to HR
```

### Celery Beat Schedule
```
CELERY_BEAT_SCHEDULE = {
    'year-end-leave-accrual': {
        'task': 'leave.tasks.year_end_accrual',
        'schedule': crontab(month_of_year=12, day_of_month=31, hour=23, minute=59),
    },
    'check-leave-expiry': {
        'task': 'leave.tasks.check_leave_expiry',
        'schedule': crontab(hour=0, minute=30),  # Daily
    },
}
```
