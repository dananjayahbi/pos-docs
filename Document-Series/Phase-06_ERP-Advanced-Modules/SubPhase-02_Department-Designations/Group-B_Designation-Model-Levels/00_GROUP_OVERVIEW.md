# Group B: Designation Model & Levels

> **Phase:** 06 - ERP Advanced Modules  
> **SubPhase:** 02 - Department & Designations  
> **Group:** B of F  
> **Tasks Covered:** 17-30  
> **Group Goal:** Create Designation model with seniority levels and salary ranges

---

## Navigation

- **↑ Parent:** [SubPhase-02 Summary](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [Group A: Department Model & Hierarchy](../Group-A_Department-Model-Hierarchy/)
- **→ Next Group:** [Group C: Department-Employee Links](../Group-C_Department-Employee-Links/)

---

## Group Overview

### Key Outcomes

1. **DesignationLevel Choices** - ENTRY, JUNIOR, MID, SENIOR, LEAD, MANAGER, DIRECTOR, EXECUTIVE
2. **Designation Model Core** - title, code
3. **Designation Level Field** - Seniority hierarchy
4. **Designation Description** - description, responsibilities
5. **Designation Department FK** - Optional department link
6. **Salary Range Fields** - min_salary, max_salary
7. **Designation Requirements** - qualifications, experience_years
8. **Reports To Field** - FK to Designation for hierarchy
9. **Is Manager Flag** - Boolean for access control
10. **Designation Status** - ACTIVE, INACTIVE
11. **Designation Code Generator** - Auto-generate codes
12. **Designation Model Indexes** - Indexes for title, level
13. **Designation Migrations** - Apply migrations
14. **Default Designations Seed** - Seed common designations

### Technology Context

| Technology | Purpose |
|------------|---------|
| Django ORM | Designation model |
| Choice Field | Level hierarchy |
| Management Command | Seed data |
| ForeignKey | Reports to relationship |

---

## Documents in This Group

| # | Document | Tasks | Description |
|---|----------|-------|-------------|
| 01 | `01_Tasks-17-24_Model-Core-Level-Salary.md` | 17-24 | Level choices, core fields, salary range, reports to |
| 02 | `02_Tasks-25-30_Manager-Flag-Index-Seed.md` | 25-30 | Is manager, status, code generator, indexes, migrations, seed |

---

## Task Summary

| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 17 | Define DesignationLevel Choices | Low | 15 min |
| 18 | Create Designation Model Core | Medium | 25 min |
| 19 | Add Designation Level Field | Low | 15 min |
| 20 | Add Designation Description | Low | 15 min |
| 21 | Add Designation Department FK | Medium | 20 min |
| 22 | Add Salary Range Fields | Medium | 20 min |
| 23 | Add Designation Requirements | Medium | 20 min |
| 24 | Add Reports To Field | Medium | 20 min |
| 25 | Add Is Manager Flag | Low | 15 min |
| 26 | Add Designation Status | Low | 15 min |
| 27 | Create Designation Code Generator | Medium | 20 min |
| 28 | Create Designation Model Indexes | Medium | 20 min |
| 29 | Run Designation Migrations | Low | 15 min |
| 30 | Create Default Designations Seed | Medium | 25 min |

---

## Execution Order

```
[Tasks 17-24: Level choices, core fields, salary, reports to]
         │
         ▼
[Tasks 25-30: Manager flag, status, indexes, seed]
```

---

## Expected Deliverables

```
apps/organization/
├── models/
│   ├── __init__.py
│   └── designation.py            # Tasks 18-28
├── constants.py                  # Task 17 (add to existing)
├── services/
│   └── code_generator.py         # Task 27 (add to existing)
├── management/
│   └── commands/
│       └── seed_designations.py  # Task 30
└── migrations/
    └── 0002_designation.py       # Task 29
```

---

## Notes for AI Agents

### DesignationLevel Choices
| Level | Code | Numeric |
|-------|------|---------|
| ENTRY | 1 | Entry level / Intern |
| JUNIOR | 2 | Junior position |
| MID | 3 | Mid-level |
| SENIOR | 4 | Senior position |
| LEAD | 5 | Team Lead |
| MANAGER | 6 | Manager |
| DIRECTOR | 7 | Director |
| EXECUTIVE | 8 | C-Level Executive |

### Designation Key Fields
- title: CharField (e.g., "Software Engineer")
- code: CharField (unique, e.g., "SE")
- level: DesignationLevel choice
- description: TextField
- responsibilities: TextField
- department: FK to Department (nullable)
- min_salary: Decimal
- max_salary: Decimal
- currency: CharField (default LKR)
- qualifications: TextField
- experience_years: Integer
- reports_to: FK to Designation (nullable)
- is_manager: Boolean
- status: Choice (ACTIVE, INACTIVE)

### Level Hierarchy Example
```
Level 8: EXECUTIVE     (CEO, COO, CFO)
Level 7: DIRECTOR      (IT Director, Sales Director)
Level 6: MANAGER       (HR Manager, Finance Manager)
Level 5: LEAD          (Team Lead, Project Lead)
Level 4: SENIOR        (Senior Developer, Senior Analyst)
Level 3: MID           (Developer, Analyst)
Level 2: JUNIOR        (Junior Developer)
Level 1: ENTRY         (Trainee, Intern)
```

### Reports To Hierarchy
```
CEO (reports_to: null)
├── COO (reports_to: CEO)
│   └── Operations Manager (reports_to: COO)
├── CFO (reports_to: CEO)
│   └── Accountant (reports_to: CFO)
└── CTO (reports_to: CEO)
    └── Developer (reports_to: CTO)
```

### Salary Range Example
```
Designation: Software Engineer (Mid)
- min_salary: Rs. 80,000
- max_salary: Rs. 150,000
- currency: LKR

Validation:
If employee.salary < min_salary or employee.salary > max_salary:
    → Warning (not error)
```

### Default Designations Seed
| Title | Code | Level |
|-------|------|-------|
| Chief Executive Officer | CEO | EXECUTIVE |
| Chief Operating Officer | COO | EXECUTIVE |
| Chief Financial Officer | CFO | EXECUTIVE |
| Chief Technology Officer | CTO | EXECUTIVE |
| Director | DIR | DIRECTOR |
| Manager | MGR | MANAGER |
| Team Lead | TL | LEAD |
| Senior Associate | SA | SENIOR |
| Associate | ASSOC | MID |
| Junior Associate | JA | JUNIOR |
| Trainee | TRN | ENTRY |

### Is Manager Flag
```
is_manager = True for:
- Levels MANAGER and above
- Any position with direct reports
- Used for:
  - Access control
  - Report visibility
  - Approval workflows
```
