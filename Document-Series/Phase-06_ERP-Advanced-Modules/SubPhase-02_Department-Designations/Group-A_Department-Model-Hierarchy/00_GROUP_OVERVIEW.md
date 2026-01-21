# Group A: Department Model & Hierarchy

> **Phase:** 06 - ERP Advanced Modules  
> **SubPhase:** 02 - Department & Designations  
> **Group:** A of F  
> **Tasks Covered:** 01-16  
> **Group Goal:** Create organization Django app with Department model using MPTT for hierarchy

---

## Navigation

- **↑ Parent:** [SubPhase-02 Summary](../00_TASKS_SUMMARY.md)
- **→ Next Group:** [Group B: Designation Model & Levels](../Group-B_Designation-Model-Levels/)

---

## Group Overview

### Key Outcomes

1. **Organization Django App** - New Django app for org structure
2. **App Registration** - Register organization in TENANT_APPS
3. **Install django-mptt** - MPTT for efficient tree structure
4. **DepartmentStatus Choices** - ACTIVE, INACTIVE, ARCHIVED
5. **Department Model Core** - name, code, status
6. **Department Description** - description, mission_statement fields
7. **Parent FK for Hierarchy** - Self-referential FK using MPTT
8. **MPTT Fields** - lft, rght, tree_id, level for tree
9. **Department Manager FK** - Link to Employee model
10. **Department Location** - location, building, floor
11. **Department Contact** - email, phone, extension
12. **Cost Center Field** - cost_center for accounting
13. **Budget Fields** - annual_budget, currency (optional)
14. **Department Code Generator** - Auto-generate or validate codes
15. **Department Model Indexes** - Indexes for code, status, parent
16. **Initial Department Migrations** - Apply migrations

### Technology Context

| Technology | Purpose |
|------------|---------|
| Django ORM | Department model |
| django-mptt | Efficient tree queries |
| PostgreSQL | Indexes and constraints |
| Self-referential FK | Parent-child hierarchy |

---

## Documents in This Group

| # | Document | Tasks | Description |
|---|----------|-------|-------------|
| 01 | `01_Tasks-01-08_App-Setup-MPTT-Core.md` | 01-08 | Django app, MPTT, status, core fields, hierarchy |
| 02 | `02_Tasks-09-16_Manager-Location-Budget-Index.md` | 09-16 | Manager, location, contact, budget, code generator, migrations |

---

## Task Summary

| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 01 | Create organization Django App | Low | 15 min |
| 02 | Register organization App | Low | 10 min |
| 03 | Install django-mptt | Low | 15 min |
| 04 | Define DepartmentStatus Choices | Low | 10 min |
| 05 | Create Department Model Core | Medium | 25 min |
| 06 | Add Department Description | Low | 15 min |
| 07 | Add Parent FK for Hierarchy | Medium | 25 min |
| 08 | Add MPTT Fields | Medium | 20 min |
| 09 | Add Department Manager FK | Medium | 20 min |
| 10 | Add Department Location | Low | 15 min |
| 11 | Add Department Contact | Low | 15 min |
| 12 | Add Cost Center Field | Low | 15 min |
| 13 | Add Budget Fields | Medium | 20 min |
| 14 | Create Department Code Generator | Medium | 25 min |
| 15 | Create Department Model Indexes | Medium | 20 min |
| 16 | Run Initial Department Migrations | Low | 15 min |

---

## Execution Order

```
[Tasks 01-08: Django app, MPTT, core fields, hierarchy]
         │
         ▼
[Tasks 09-16: Manager, location, budget, indexes, migrations]
```

---

## Expected Deliverables

```
apps/organization/
├── __init__.py
├── apps.py                       # Tasks 01-02
├── models/
│   ├── __init__.py
│   └── department.py             # Tasks 05-15
├── constants.py                  # Task 04
├── services/
│   └── code_generator.py         # Task 14
└── migrations/
    └── 0001_initial.py           # Task 16
```

---

## Notes for AI Agents

### DepartmentStatus Choices
- **ACTIVE**: Currently operational
- **INACTIVE**: Temporarily inactive
- **ARCHIVED**: No longer in use

### Department Key Fields
- name: CharField
- code: CharField (unique, e.g., DEPT-HR)
- description: TextField
- mission_statement: TextField
- parent: FK to self (MPTT)
- manager: FK to Employee (nullable)
- location: CharField
- building: CharField
- floor: CharField
- email: EmailField
- phone: CharField
- extension: CharField
- cost_center: CharField
- annual_budget: Decimal
- currency: CharField (default LKR)
- status: DepartmentStatus

### MPTT Fields
```
lft: Left tree value
rght: Right tree value
tree_id: Tree identifier
level: Depth in tree (0 = root)

Benefits:
- Get all descendants: Single query
- Get path to root: Single query
- Get tree depth: Stored value
```

### Department Hierarchy Example
```
Company (Root)
├── Operations (level 1)
│   ├── Sales (level 2)
│   └── Logistics (level 2)
├── Finance (level 1)
│   ├── Accounts (level 2)
│   └── Treasury (level 2)
└── HR (level 1)
```

### Department Code Format
```
DEPT-{CODE}
Examples: DEPT-HR, DEPT-FIN, DEPT-OPS

Auto-generate from name if not provided.
Validate uniqueness per tenant.
```

### Database Indexes
- code (unique per tenant)
- status
- parent
- manager
- (status, parent) composite
- MPTT indexes (lft, rght, tree_id)

### Manager Validation
```
Department manager must be:
- Active employee
- Optionally: Belong to same department or parent
- Cannot be circular (manager's manager's... is not self)
```
