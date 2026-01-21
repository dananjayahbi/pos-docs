# Group C: Department-Employee Links

> **Phase:** 06 - ERP Advanced Modules  
> **SubPhase:** 02 - Department & Designations  
> **Group:** C of F  
> **Tasks Covered:** 31-44  
> **Group Goal:** Link employees to departments and designations with history tracking

---

## Navigation

- **↑ Parent:** [SubPhase-02 Summary](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [Group B: Designation Model & Levels](../Group-B_Designation-Model-Levels/)
- **→ Next Group:** [Group D: Org Chart & Visualization](../Group-D_OrgChart-Visualization/)

---

## Group Overview

### Key Outcomes

1. **Update Employee Department FK** - Link Employee to Department
2. **Update Employee Designation FK** - Link Employee to Designation
3. **Employee FK Update Migrations** - Apply FK migrations
4. **DepartmentMember Model** - Track membership with dates
5. **Membership Date Fields** - joined_date, left_date
6. **Membership Role Field** - MEMBER, LEAD, DEPUTY_MANAGER
7. **DepartmentMember Migrations** - Apply migrations
8. **Department Transfer Signal** - Track department changes
9. **Designation Change Signal** - Track designation changes
10. **DepartmentHead Model** - Track heads with history
11. **Head Tenure Fields** - start_date, end_date
12. **DepartmentHead Migrations** - Apply migrations
13. **Validate Circular Manager** - Prevent circular references
14. **Validate Department Consistency** - Manager in same/parent dept

### Technology Context

| Technology | Purpose |
|------------|---------|
| Django ORM | DepartmentMember, DepartmentHead models |
| Signals | Change tracking |
| Validators | Circular/consistency checks |
| ForeignKey | Employee links |

---

## Documents in This Group

| # | Document | Tasks | Description |
|---|----------|-------|-------------|
| 01 | `01_Tasks-31-37_Employee-FK-Membership.md` | 31-37 | Employee FK updates, DepartmentMember model |
| 02 | `02_Tasks-38-44_Signals-Head-Validation.md` | 38-44 | Transfer signals, DepartmentHead, validators |

---

## Task Summary

| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 31 | Update Employee Department FK | Medium | 20 min |
| 32 | Update Employee Designation FK | Medium | 20 min |
| 33 | Run Employee FK Update Migrations | Low | 15 min |
| 34 | Create DepartmentMember Model | Medium | 25 min |
| 35 | Add Membership Date Fields | Medium | 20 min |
| 36 | Add Membership Role Field | Low | 15 min |
| 37 | Run DepartmentMember Migrations | Low | 15 min |
| 38 | Create Department Transfer Signal | High | 30 min |
| 39 | Create Designation Change Signal | High | 30 min |
| 40 | Create DepartmentHead Model | Medium | 25 min |
| 41 | Add Head Tenure Fields | Medium | 20 min |
| 42 | Run DepartmentHead Migrations | Low | 15 min |
| 43 | Validate Circular Manager | High | 30 min |
| 44 | Validate Department Consistency | Medium | 25 min |

---

## Execution Order

```
[Tasks 31-37: Employee FKs, DepartmentMember]
         │
         ▼
[Tasks 38-44: Signals, DepartmentHead, validators]
```

---

## Expected Deliverables

```
apps/employees/
├── models/
│   └── employee.py               # Tasks 31-32 (update)
└── migrations/
    └── 0009_fk_updates.py        # Task 33

apps/organization/
├── models/
│   ├── __init__.py
│   ├── department_member.py      # Tasks 34-36
│   └── department_head.py        # Tasks 40-41
├── signals.py                    # Tasks 38-39
├── validators.py                 # Tasks 43-44
└── migrations/
    ├── 0003_member.py            # Task 37
    └── 0004_head.py              # Task 42
```

---

## Notes for AI Agents

### Employee Model Updates
```
Employee Model (add fields):
- department: FK to Department (nullable)
- designation: FK to Designation (nullable)
```

### DepartmentMember Fields
- employee: FK to Employee
- department: FK to Department
- role: Choice (MEMBER, LEAD, DEPUTY_MANAGER)
- joined_date: DateField
- left_date: DateField (nullable)
- is_primary: Boolean (primary department)
- notes: TextField

### Membership Role Choices
| Role | Description |
|------|-------------|
| MEMBER | Regular member |
| LEAD | Team/project lead |
| DEPUTY_MANAGER | Deputy department manager |

### DepartmentMember Usage
```
Employee can belong to multiple departments:
- Primary department (is_primary=True)
- Secondary departments (cross-functional)

Example:
John Doe:
├── IT (primary, MEMBER)
└── Project Alpha (secondary, LEAD)
```

### Department Transfer Signal
```
On Employee department change:
1. Close old DepartmentMember (set left_date)
2. Create new DepartmentMember (set joined_date)
3. Create EmploymentHistory record
4. Invalidate org chart cache
```

### DepartmentHead Fields
- department: FK to Department
- employee: FK to Employee
- start_date: DateField
- end_date: DateField (nullable)
- is_acting: Boolean (acting/interim head)
- appointed_by: FK to User
- notes: TextField

### DepartmentHead Usage
```
Track department head history:

IT Department Heads:
├── John Smith (2020-01-01 to 2023-06-30)
├── Jane Doe (2023-07-01 to present)
└── Mike Brown (2024-01-01 to 2024-02-28, acting)
```

### Circular Manager Validation
```
Prevent:
A → B → C → A (A reports to B, B reports to C, C reports to A)

Algorithm:
1. Get employee's manager chain
2. Check if employee appears in own chain
3. Raise ValidationError if circular
```

### Department Consistency Validation
```
Optional rule:
Employee's manager should be in:
- Same department, OR
- Parent department, OR
- Ancestor department

Example (valid):
├── IT (Manager: CTO)
│   └── Developer (Manager: IT Manager) ✓

Example (invalid if enforced):
├── IT (Manager: HR Manager) ✗
```

### Signal Flow
```
Employee.save() triggered:
│
├── Check if department changed
│   └── Yes → Create DepartmentMember record
│            → Create EmploymentHistory record
│
├── Check if designation changed
│   └── Yes → Create EmploymentHistory record
│
└── Check if manager changed
    └── Yes → Validate no circular reference
             → Create EmploymentHistory record
```
