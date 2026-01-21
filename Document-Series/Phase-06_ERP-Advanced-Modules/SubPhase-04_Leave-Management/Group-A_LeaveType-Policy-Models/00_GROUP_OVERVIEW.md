# Group A: Leave Type & Policy Models

> **Phase:** 06 - ERP Advanced Modules  
> **SubPhase:** 04 - Leave Management  
> **Group:** A of F  
> **Tasks Covered:** 01-18  
> **Group Goal:** Create leave Django app with LeaveType and LeavePolicy models

---

## Navigation

- **↑ Parent:** [SubPhase-04 Summary](../00_TASKS_SUMMARY.md)
- **→ Next Group:** [Group B: Leave Balance & Accrual](../Group-B_LeaveBalance-Accrual/)

---

## Group Overview

### Key Outcomes

1. **Leave Django App** - New Django app for leave management
2. **App Registration** - Register leave in TENANT_APPS
3. **LeaveTypeCategory Choices** - ANNUAL, CASUAL, SICK, MATERNITY, PATERNITY, NO_PAY, OTHER
4. **LeaveType Model Core** - name, code, category
5. **Leave Type Description** - description, color (for calendar)
6. **Days Per Year Field** - default_days_per_year
7. **Max Days Field** - max_consecutive_days, max_days_per_request
8. **Paid Leave Flag** - is_paid boolean
9. **Document Required Flag** - requires_document
10. **Gender Restriction** - applicable_gender for maternity/paternity
11. **Min Service Requirement** - min_service_months
12. **Advance Notice Days** - min_notice_days
13. **LeaveType Migrations** - Apply migrations
14. **LeavePolicy Model** - Policy linking leave types
15. **Policy Scope Fields** - applies_to (all, department, designation)
16. **Policy Date Range** - effective_from, effective_to
17. **LeavePolicy Migrations** - Apply migrations
18. **Default Leave Types Seed** - Sri Lanka standard types

### Technology Context

| Technology | Purpose |
|------------|---------|
| Django ORM | LeaveType, LeavePolicy models |
| Choice Field | Category, gender restriction |
| Management Command | Seed default data |
| ForeignKey | Department, designation links |

---

## Documents in This Group

| # | Document | Tasks | Description |
|---|----------|-------|-------------|
| 01 | `01_Tasks-01-09_App-LeaveType-Core.md` | 01-09 | Django app, LeaveType model, core fields |
| 02 | `02_Tasks-10-18_Restrictions-Policy-Seed.md` | 10-18 | Gender, service requirements, LeavePolicy, seed |

---

## Task Summary

| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 01 | Create leave Django App | Low | 15 min |
| 02 | Register leave App | Low | 10 min |
| 03 | Define LeaveTypeCategory Choices | Low | 15 min |
| 04 | Create LeaveType Model Core | Medium | 25 min |
| 05 | Add Leave Type Description | Low | 15 min |
| 06 | Add Days Per Year Field | Low | 15 min |
| 07 | Add Max Days Field | Low | 15 min |
| 08 | Add Paid Leave Flag | Low | 10 min |
| 09 | Add Document Required Flag | Low | 10 min |
| 10 | Add Gender Restriction | Medium | 20 min |
| 11 | Add Min Service Requirement | Low | 15 min |
| 12 | Add Advance Notice Days | Low | 15 min |
| 13 | Run LeaveType Migrations | Low | 15 min |
| 14 | Create LeavePolicy Model | Medium | 25 min |
| 15 | Add Policy Scope Fields | Medium | 20 min |
| 16 | Add Policy Date Range | Low | 15 min |
| 17 | Run LeavePolicy Migrations | Low | 15 min |
| 18 | Create Default Leave Types Seed | Medium | 25 min |

---

## Execution Order

```
[Tasks 01-13: Django app, LeaveType model, migrations]
         │
         ▼
[Tasks 14-18: LeavePolicy model, seed data]
```

---

## Expected Deliverables

```
apps/leave/
├── __init__.py
├── apps.py                       # Tasks 01-02
├── constants.py                  # Task 03
├── models/
│   ├── __init__.py
│   ├── leave_type.py             # Tasks 04-12
│   └── leave_policy.py           # Tasks 14-16
├── management/
│   └── commands/
│       └── seed_leave_types.py   # Task 18
└── migrations/
    ├── 0001_leave_type.py        # Task 13
    └── 0002_leave_policy.py      # Task 17
```

---

## Notes for AI Agents

### LeaveTypeCategory Choices
| Category | Description |
|----------|-------------|
| ANNUAL | Annual/vacation leave |
| CASUAL | Casual/personal leave |
| SICK | Sick leave with certificate |
| MATERNITY | Maternity leave (female) |
| PATERNITY | Paternity leave (male) |
| NO_PAY | Unpaid leave |
| OTHER | Other leave types |

### LeaveType Model Fields
- name: CharField (e.g., "Annual Leave")
- code: CharField (unique, e.g., "AL")
- category: LeaveTypeCategory choice
- description: TextField
- color: CharField (hex color for calendar)
- default_days_per_year: Integer
- max_consecutive_days: Integer
- max_days_per_request: Integer
- is_paid: Boolean
- requires_document: Boolean
- applicable_gender: Choice (ALL, MALE, FEMALE)
- min_service_months: Integer (0 for immediate)
- min_notice_days: Integer
- is_active: Boolean
- allow_half_day: Boolean
- allow_encashment: Boolean
- carry_forward_allowed: Boolean
- max_carry_forward_days: Integer

### Sri Lanka Standard Leave Types
| Type | Code | Days | Paid | Gender |
|------|------|------|------|--------|
| Annual Leave | AL | 14-21 | Yes | All |
| Casual Leave | CL | 7 | Yes | All |
| Sick Leave | SL | 7-14 | Yes | All |
| Maternity Leave | ML | 84 | Yes | Female |
| Paternity Leave | PL | 3 | Yes | Male |
| No-Pay Leave | NPL | - | No | All |

### LeavePolicy Model Fields
- name: CharField
- leave_type: FK to LeaveType
- applies_to: Choice (ALL, DEPARTMENT, DESIGNATION)
- department: FK to Department (nullable)
- designation: FK to Designation (nullable)
- days_per_year: Integer (override default)
- accrual_method: Choice
- effective_from: DateField
- effective_to: DateField (nullable)
- is_active: Boolean

### Policy Scope Logic
```
Policy applies_to:
- ALL: Applies to all employees
- DEPARTMENT: Only specific department
- DESIGNATION: Only specific designation

Priority:
1. Employee-specific policy
2. Designation policy
3. Department policy
4. All employees policy
5. Default from LeaveType
```

### Color for Calendar
```
Leave types with distinct colors:
- Annual: #4CAF50 (Green)
- Casual: #2196F3 (Blue)
- Sick: #FF9800 (Orange)
- Maternity: #E91E63 (Pink)
- Paternity: #9C27B0 (Purple)
- No-Pay: #9E9E9E (Grey)
```
