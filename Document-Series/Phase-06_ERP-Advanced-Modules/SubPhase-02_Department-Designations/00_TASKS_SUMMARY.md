# SubPhase 02: Department & Designations - Tasks Summary

> **Phase:** 06 - ERP Advanced Modules  
> **SubPhase Index:** 02 of 14  
> **SubPhase Goal:** Define organizational structure with departments and job designations  
> **Total Tasks:** 78 | **Status:** Planning  
> **Estimated Duration:** 10-12 hours

---

## Navigation

- **↑ Parent:** [00_SUBPHASES_SUMMARY.md](../00_SUBPHASES_SUMMARY.md)
- **← Previous SubPhase:** [SubPhase-01_Employee-Management](../SubPhase-01_Employee-Management/)
- **→ Next SubPhase:** [SubPhase-03_Attendance-System](../SubPhase-03_Attendance-System/)

---

## SubPhase Overview

This sub-phase implements the organizational structure for HR management. Defines departments with hierarchical parent-child relationships, job designations with levels, and department managers. Enables org chart visualization and department-based access control.

### Key Outcomes
- Department model with hierarchy support
- Department code auto-generation
- Parent-child department relationships
- Department manager assignment
- Designation/job title model
- Designation levels for seniority
- Org chart visualization data
- Department cost center (optional)
- Department budget tracking (optional)
- Link departments and designations to Employee

### Technology Context
- **Backend:** Django 5.x with DRF for API
- **Hierarchy:** MPTT or django-treebeard for efficient tree queries
- **Frontend:** Next.js 14+ with TypeScript
- **Department Code Format:** `DEPT-{CODE}` (e.g., DEPT-HR, DEPT-FIN)

### Dependencies
- Phase-06 SubPhase-01: Employee model (for manager FK)

---

## Task Execution Order

```
TASK GROUP A: Department Model & Hierarchy (Tasks 01-16)
        │
        ▼
TASK GROUP B: Designation Model & Levels (Tasks 17-30)
        │
        ▼
TASK GROUP C: Department-Employee Links (Tasks 31-44)
        │
        ▼
TASK GROUP D: Org Chart & Visualization (Tasks 45-56)
        │
        ▼
TASK GROUP E: Services & Business Logic (Tasks 57-68)
        │
        ▼
TASK GROUP F: API, Testing & Documentation (Tasks 69-78)
```

---

## Task Index

### Group A: Department Model & Hierarchy (Tasks 01-16)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 01 | **Create organization Django App** | Create new Django app for org structure | None | 🔴 Not Created |
| 02 | **Register organization App** | Add organization app to TENANT_APPS | Task 01 | 🔴 Not Created |
| 03 | **Install django-mptt** | Install MPTT for efficient tree structure | Task 01 | 🔴 Not Created |
| 04 | **Define DepartmentStatus Choices** | Create enum: ACTIVE, INACTIVE, ARCHIVED | Task 01 | 🔴 Not Created |
| 05 | **Create Department Model Core** | Define Department with name, code, status | Task 04 | 🔴 Not Created |
| 06 | **Add Department Description** | Add description, mission_statement fields | Task 05 | 🔴 Not Created |
| 07 | **Add Parent FK for Hierarchy** | Add parent self-referential FK using MPTT | Task 05 | 🔴 Not Created |
| 08 | **Add MPTT Fields** | Add lft, rght, tree_id, level for tree structure | Task 07 | 🔴 Not Created |
| 09 | **Add Department Manager FK** | Add manager FK to Employee model | Task 05 | 🔴 Not Created |
| 10 | **Add Department Location** | Add location, building, floor fields | Task 05 | 🔴 Not Created |
| 11 | **Add Department Contact** | Add email, phone, extension fields | Task 05 | 🔴 Not Created |
| 12 | **Add Cost Center Field** | Add cost_center for accounting integration | Task 05 | 🔴 Not Created |
| 13 | **Add Budget Fields** | Add annual_budget, currency (optional) | Task 05 | 🔴 Not Created |
| 14 | **Create Department Code Generator** | Auto-generate or validate department codes | Task 05 | 🔴 Not Created |
| 15 | **Create Department Model Indexes** | Add indexes for code, status, parent | Task 05 | 🔴 Not Created |
| 16 | **Run Initial Department Migrations** | Generate and apply migrations | Task 15 | 🔴 Not Created |

---

### Group B: Designation Model & Levels (Tasks 17-30)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 17 | **Define DesignationLevel Choices** | Create enum: ENTRY, JUNIOR, MID, SENIOR, LEAD, MANAGER, DIRECTOR, EXECUTIVE | Task 16 | 🔴 Not Created |
| 18 | **Create Designation Model Core** | Define Designation with title, code | Task 17 | 🔴 Not Created |
| 19 | **Add Designation Level Field** | Add level field for seniority hierarchy | Task 18 | 🔴 Not Created |
| 20 | **Add Designation Description** | Add description, responsibilities | Task 18 | 🔴 Not Created |
| 21 | **Add Designation Department FK** | Optional FK to Department (generic or specific) | Task 18 | 🔴 Not Created |
| 22 | **Add Salary Range Fields** | Add min_salary, max_salary for position | Task 18 | 🔴 Not Created |
| 23 | **Add Designation Requirements** | Add qualifications, experience_years fields | Task 18 | 🔴 Not Created |
| 24 | **Add Reports To Field** | Add reports_to FK to Designation for hierarchy | Task 18 | 🔴 Not Created |
| 25 | **Add Is Manager Flag** | Add is_manager boolean for access control | Task 18 | 🔴 Not Created |
| 26 | **Add Designation Status** | Add status: ACTIVE, INACTIVE | Task 18 | 🔴 Not Created |
| 27 | **Create Designation Code Generator** | Auto-generate designation codes | Task 18 | 🔴 Not Created |
| 28 | **Create Designation Model Indexes** | Add indexes for title, level, department | Task 18 | 🔴 Not Created |
| 29 | **Run Designation Migrations** | Generate and apply migrations | Task 28 | 🔴 Not Created |
| 30 | **Create Default Designations Seed** | Seed common designations (CEO, Manager, etc.) | Task 29 | 🔴 Not Created |

---

### Group C: Department-Employee Links (Tasks 31-44)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 31 | **Update Employee Department FK** | Link Employee.department to Department model | Task 30 | 🔴 Not Created |
| 32 | **Update Employee Designation FK** | Link Employee.designation to Designation model | Task 30 | 🔴 Not Created |
| 33 | **Run Employee FK Update Migrations** | Generate and apply FK migrations | Task 32 | 🔴 Not Created |
| 34 | **Create DepartmentMember Model** | Track department membership with dates | Task 33 | 🔴 Not Created |
| 35 | **Add Membership Date Fields** | Add joined_date, left_date for history | Task 34 | 🔴 Not Created |
| 36 | **Add Membership Role Field** | Add role: MEMBER, LEAD, DEPUTY_MANAGER | Task 34 | 🔴 Not Created |
| 37 | **Run DepartmentMember Migrations** | Generate and apply migrations | Task 36 | 🔴 Not Created |
| 38 | **Create Department Transfer Signal** | Track employee department changes | Task 37 | 🔴 Not Created |
| 39 | **Create Designation Change Signal** | Track employee designation changes | Task 37 | 🔴 Not Created |
| 40 | **Create DepartmentHead Model** | Track department heads with history | Task 37 | 🔴 Not Created |
| 41 | **Add Head Tenure Fields** | Add start_date, end_date for head tenure | Task 40 | 🔴 Not Created |
| 42 | **Run DepartmentHead Migrations** | Generate and apply migrations | Task 41 | 🔴 Not Created |
| 43 | **Validate Circular Manager** | Prevent circular references in manager chain | Task 42 | 🔴 Not Created |
| 44 | **Validate Department Consistency** | Ensure employee manager in same/parent dept | Task 42 | 🔴 Not Created |

---

### Group D: Org Chart & Visualization (Tasks 45-56)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 45 | **Create OrgChartService Class** | Service for org chart data generation | Task 44 | 🔴 Not Created |
| 46 | **Implement Department Tree Query** | Get hierarchical department tree | Task 45 | 🔴 Not Created |
| 47 | **Implement Employee Tree Query** | Get employee hierarchy by manager | Task 45 | 🔴 Not Created |
| 48 | **Generate Org Chart JSON** | Format data for frontend org chart | Task 47 | 🔴 Not Created |
| 49 | **Add Employee Count Aggregation** | Count employees per department | Task 45 | 🔴 Not Created |
| 50 | **Add Budget Aggregation** | Sum budgets across child departments | Task 45 | 🔴 Not Created |
| 51 | **Create Department Statistics** | Calculate department stats (headcount, etc.) | Task 50 | 🔴 Not Created |
| 52 | **Implement Flatten Hierarchy** | Get flat list with level indicators | Task 45 | 🔴 Not Created |
| 53 | **Implement Path to Root** | Get department path from leaf to root | Task 45 | 🔴 Not Created |
| 54 | **Implement Subtree Query** | Get all departments under a parent | Task 45 | 🔴 Not Created |
| 55 | **Create Reporting Chain Query** | Get employee's reporting chain | Task 45 | 🔴 Not Created |
| 56 | **Cache Org Chart Data** | Cache computed org chart with Redis | Task 55 | 🔴 Not Created |

---

### Group E: Services & Business Logic (Tasks 57-68)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 57 | **Create DepartmentService Class** | Main service for department operations | Task 56 | 🔴 Not Created |
| 58 | **Implement Create Department** | Create department with validation | Task 57 | 🔴 Not Created |
| 59 | **Implement Update Department** | Update department, handle parent change | Task 57 | 🔴 Not Created |
| 60 | **Implement Archive Department** | Archive department, reassign employees | Task 57 | 🔴 Not Created |
| 61 | **Implement Move Department** | Move department to new parent | Task 57 | 🔴 Not Created |
| 62 | **Implement Merge Departments** | Merge two departments into one | Task 57 | 🔴 Not Created |
| 63 | **Create DesignationService Class** | Service for designation operations | Task 57 | 🔴 Not Created |
| 64 | **Implement Create Designation** | Create designation with validation | Task 63 | 🔴 Not Created |
| 65 | **Implement Update Designation** | Update designation, propagate changes | Task 63 | 🔴 Not Created |
| 66 | **Implement Designation Salary Range** | Validate employee salary against range | Task 63 | 🔴 Not Created |
| 67 | **Create Department Search** | Search departments by name, code | Task 57 | 🔴 Not Created |
| 68 | **Create Designation Search** | Search designations by title, level | Task 63 | 🔴 Not Created |

---

### Group F: API, Testing & Documentation (Tasks 69-78)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 69 | **Create DepartmentSerializer** | DRF serializer for Department with tree | Task 68 | 🔴 Not Created |
| 70 | **Create DesignationSerializer** | DRF serializer for Designation | Task 69 | 🔴 Not Created |
| 71 | **Create OrgChartSerializer** | Serializer for org chart JSON output | Task 69 | 🔴 Not Created |
| 72 | **Create DepartmentViewSet** | ViewSet with CRUD, move, merge actions | Task 71 | 🔴 Not Created |
| 73 | **Create DesignationViewSet** | ViewSet with CRUD operations | Task 72 | 🔴 Not Created |
| 74 | **Create OrgChartView** | API view for org chart data | Task 72 | 🔴 Not Created |
| 75 | **Implement Department Filtering** | Filter by status, parent, manager | Task 72 | 🔴 Not Created |
| 76 | **Register Organization API URLs** | Add all endpoints to URL config | Task 75 | 🔴 Not Created |
| 77 | **Create Organization Module Tests** | Unit and integration tests | Task 76 | 🔴 Not Created |
| 78 | **Create Organization Documentation** | API docs, org structure guide | Task 77 | 🔴 Not Created |

---

## Expected File Structure

```
backend/apps/organization/
├── __init__.py
├── admin.py                    # Admin for Department, Designation
├── apps.py                     # App configuration
├── models/
│   ├── __init__.py
│   ├── department.py          # Department model with MPTT
│   ├── designation.py         # Designation model
│   ├── department_member.py   # DepartmentMember model
│   └── department_head.py     # DepartmentHead model
├── services/
│   ├── __init__.py
│   ├── department_service.py  # Department operations
│   ├── designation_service.py # Designation operations
│   └── orgchart_service.py    # Org chart generation
├── serializers/
│   ├── __init__.py
│   ├── department_serializer.py
│   ├── designation_serializer.py
│   └── orgchart_serializer.py
├── views/
│   ├── __init__.py
│   ├── department_viewset.py  # Department CRUD ViewSet
│   ├── designation_viewset.py # Designation ViewSet
│   └── orgchart_view.py       # Org chart API
├── filters.py                  # Department/Designation filtering
├── urls.py                     # URL routing
├── signals.py                  # Transfer/change signals
├── validators.py               # Hierarchy validators
├── tests/
│   ├── __init__.py
│   ├── test_models.py
│   ├── test_services.py
│   ├── test_orgchart.py
│   └── test_api.py
├── management/
│   └── commands/
│       └── seed_designations.py  # Seed command
└── migrations/
```

---

## Department Hierarchy Diagram

```
                    ┌─────────────────────┐
                    │   Company (Root)    │
                    │   DEPT-ROOT         │
                    └─────────┬───────────┘
                              │
          ┌───────────────────┼───────────────────┐
          │                   │                   │
          ▼                   ▼                   ▼
  ┌───────────────┐   ┌───────────────┐   ┌───────────────┐
  │  Operations   │   │    Finance    │   │      HR       │
  │  DEPT-OPS     │   │   DEPT-FIN    │   │   DEPT-HR     │
  └───────┬───────┘   └───────┬───────┘   └───────────────┘
          │                   │
    ┌─────┴─────┐       ┌─────┴─────┐
    │           │       │           │
    ▼           ▼       ▼           ▼
┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐
│  Sales │ │Logistics│ │Accounts│ │Treasury│
│DEPT-SAL│ │DEPT-LOG │ │DEPT-ACC│ │DEPT-TRS│
└────────┘ └────────┘ └────────┘ └────────┘
```

---

## Designation Level Hierarchy

```
Level 8: EXECUTIVE     (CEO, COO, CFO)
Level 7: DIRECTOR      (Director of Sales, IT Director)
Level 6: MANAGER       (Department Manager, Team Manager)
Level 5: LEAD          (Team Lead, Project Lead)
Level 4: SENIOR        (Senior Engineer, Senior Analyst)
Level 3: MID           (Software Engineer, Business Analyst)
Level 2: JUNIOR        (Junior Developer, Junior Accountant)
Level 1: ENTRY         (Trainee, Intern)
```

---

## Org Chart JSON Structure

```json
{
  "id": "dept-001",
  "name": "Operations",
  "code": "DEPT-OPS",
  "manager": {
    "id": "emp-001",
    "name": "John Smith",
    "designation": "Operations Director"
  },
  "employee_count": 45,
  "children": [
    {
      "id": "dept-002",
      "name": "Sales",
      "code": "DEPT-SAL",
      "manager": {...},
      "employee_count": 20,
      "children": []
    }
  ]
}
```

---

## Key Business Rules

1. **Unique Codes:** Department and designation codes must be unique per tenant
2. **Active Manager:** Department manager must be active employee
3. **No Circular Hierarchy:** Parent cannot be own descendant
4. **Archive Cascade:** Archiving parent doesn't auto-archive children
5. **Manager in Department:** Optionally enforce manager belongs to department
6. **Designation Salary Range:** Warn if employee salary outside range
7. **Root Department:** Every tenant must have a root department

---

## MPTT Tree Benefits

```
Without MPTT (N+1 queries):
─────────────────────────────────────
- Get all descendants: Recursive queries
- Get path to root: N queries for N levels
- Get tree depth: Full table scan

With MPTT (Single query):
─────────────────────────────────────
- Get all descendants: WHERE lft BETWEEN parent.lft AND parent.rght
- Get path to root: WHERE lft < node.lft AND rght > node.rght
- Get tree depth: Stored in level field
```

---

## Progress Tracking

| Metric | Count |
|--------|-------|
| Total Tasks | 78 |
| Tasks Completed | 0 |
| Tasks In Progress | 0 |
| Completion Percentage | 0% |

**Last Updated:** 2026-01-17  
**Next Action:** Create Task 01 (organization Django App)

---

## Notes for AI Agents

- MPTT critical for efficient tree queries
- Cache org chart data for performance
- Department changes should update employment history
- Consider soft delete for departments (archive)
- Org chart visualization is common frontend requirement
- Manager validation prevents circular references
- Cost center links to accounting module (Phase 06)
- Budget tracking is optional feature

---

*End of SubPhase 02 Tasks Summary*
