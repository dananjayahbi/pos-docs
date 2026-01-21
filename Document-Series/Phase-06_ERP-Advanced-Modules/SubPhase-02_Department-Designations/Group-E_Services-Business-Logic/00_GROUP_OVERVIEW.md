# Group E: Services & Business Logic

> **Phase:** 06 - ERP Advanced Modules  
> **SubPhase:** 02 - Department & Designations  
> **Group:** E of F  
> **Tasks Covered:** 57-68  
> **Group Goal:** Implement department and designation services with business logic

---

## Navigation

- **↑ Parent:** [SubPhase-02 Summary](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [Group D: Org Chart & Visualization](../Group-D_OrgChart-Visualization/)
- **→ Next Group:** [Group F: API, Testing & Documentation](../Group-F_API-Testing-Documentation/)

---

## Group Overview

### Key Outcomes

1. **DepartmentService Class** - Main service for department operations
2. **Create Department** - Create with validation
3. **Update Department** - Update, handle parent change
4. **Archive Department** - Archive, reassign employees
5. **Move Department** - Move to new parent
6. **Merge Departments** - Merge two into one
7. **DesignationService Class** - Service for designation operations
8. **Create Designation** - Create with validation
9. **Update Designation** - Update, propagate changes
10. **Designation Salary Range** - Validate employee salary
11. **Department Search** - Search by name, code
12. **Designation Search** - Search by title, level

### Technology Context

| Technology | Purpose |
|------------|---------|
| Service Layer | Business logic |
| Transactions | Atomic operations |
| MPTT | Tree operations |
| Search | Full-text search |

---

## Documents in This Group

| # | Document | Tasks | Description |
|---|----------|-------|-------------|
| 01 | `01_Tasks-57-62_Department-Service.md` | 57-62 | DepartmentService, CRUD, archive, move, merge |
| 02 | `02_Tasks-63-68_Designation-Service-Search.md` | 63-68 | DesignationService, salary range, search |

---

## Task Summary

| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 57 | Create DepartmentService Class | High | 30 min |
| 58 | Implement Create Department | Medium | 25 min |
| 59 | Implement Update Department | Medium | 25 min |
| 60 | Implement Archive Department | High | 30 min |
| 61 | Implement Move Department | High | 30 min |
| 62 | Implement Merge Departments | High | 35 min |
| 63 | Create DesignationService Class | High | 30 min |
| 64 | Implement Create Designation | Medium | 25 min |
| 65 | Implement Update Designation | Medium | 25 min |
| 66 | Implement Designation Salary Range | Medium | 25 min |
| 67 | Create Department Search | Medium | 25 min |
| 68 | Create Designation Search | Medium | 25 min |

---

## Execution Order

```
[Tasks 57-62: DepartmentService operations]
         │
         ▼
[Tasks 63-68: DesignationService, search]
```

---

## Expected Deliverables

```
apps/organization/
├── services/
│   ├── __init__.py
│   ├── department_service.py     # Tasks 57-62, 67
│   └── designation_service.py    # Tasks 63-68
```

---

## Notes for AI Agents

### DepartmentService Methods
- create(data, user)
- update(department_id, data, user)
- archive(department_id, reassign_to, user)
- activate(department_id, user)
- move(department_id, new_parent_id, user)
- merge(source_id, target_id, user)
- search(query, filters)
- get_children(department_id)
- get_employees(department_id)

### Create Department
```
Validation:
1. Name required
2. Code unique per tenant
3. Parent exists (if provided)
4. Manager is active employee

Process:
1. Generate code if not provided
2. Create department
3. Create DepartmentHead if manager set
4. Invalidate org chart cache
```

### Archive Department
```
Cannot archive if:
- Has active child departments
- Has active employees (unless reassign)

Archive Process:
1. Reassign employees to target department
2. Create transfer history records
3. Set status = ARCHIVED
4. Close DepartmentHead record
5. Invalidate org chart cache
```

### Move Department
```
Move DEPT-SALES from DEPT-OPS to DEPT-MARKETING

Validation:
1. New parent exists
2. New parent is not descendant of moving department
3. No circular reference

Process:
1. Update parent FK
2. MPTT rebuilds tree (lft, rght, level)
3. Invalidate org chart cache
```

### Merge Departments
```
Merge DEPT-SALES1 into DEPT-SALES2

Process:
1. Move all employees from source to target
2. Update DepartmentMember records
3. Move child departments to target
4. Archive source department
5. Create merge history record
6. Invalidate org chart cache

Result:
- Source: ARCHIVED
- Target: Contains all employees/children
```

### DesignationService Methods
- create(data, user)
- update(designation_id, data, user)
- deactivate(designation_id, user)
- validate_salary(employee_id, salary)
- search(query, filters)
- get_employees(designation_id)
- get_by_level(level)

### Salary Range Validation
```
Designation: Software Engineer
- min_salary: Rs. 80,000
- max_salary: Rs. 150,000

Employee: John Doe
- salary: Rs. 75,000

Result:
{
  "is_valid": false,
  "message": "Salary below minimum for Software Engineer",
  "min": 80000,
  "max": 150000,
  "actual": 75000,
  "severity": "warning"  // Not blocking
}
```

### Department Search
```
Search fields:
- name (partial match)
- code (exact or partial)
- manager name
- location

Filters:
- status (ACTIVE, INACTIVE, ARCHIVED)
- parent_id
- has_employees

Example:
search("sales", {"status": "ACTIVE"})
→ [DEPT-SALES, DEPT-SALES-NORTH, DEPT-SALES-SOUTH]
```

### Designation Search
```
Search fields:
- title (partial match)
- code (exact or partial)
- description

Filters:
- level (ENTRY, JUNIOR, MID, etc.)
- department_id
- status (ACTIVE, INACTIVE)
- is_manager

Example:
search("engineer", {"level": "SENIOR"})
→ [Senior Software Engineer, Senior QA Engineer]
```
