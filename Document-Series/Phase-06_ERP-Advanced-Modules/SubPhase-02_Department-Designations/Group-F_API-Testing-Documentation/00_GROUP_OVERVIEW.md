# Group F: API, Testing & Documentation

> **Phase:** 06 - ERP Advanced Modules  
> **SubPhase:** 02 - Department & Designations  
> **Group:** F of F  
> **Tasks Covered:** 69-78  
> **Group Goal:** Create API endpoints, tests, and module documentation

---

## Navigation

- **↑ Parent:** [SubPhase-02 Summary](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [Group E: Services & Business Logic](../Group-E_Services-Business-Logic/)

---

## Group Overview

### Key Outcomes

1. **DepartmentSerializer** - DRF serializer with tree
2. **DesignationSerializer** - DRF serializer for designations
3. **OrgChartSerializer** - Serializer for org chart JSON
4. **DepartmentViewSet** - ViewSet with CRUD, move, merge
5. **DesignationViewSet** - ViewSet with CRUD
6. **OrgChartView** - API view for org chart data
7. **Department Filtering** - Filter by status, parent, manager
8. **Organization API URLs** - All endpoints
9. **Organization Module Tests** - Unit and integration tests
10. **Organization Documentation** - API docs, org structure guide

### Technology Context

| Technology | Purpose |
|------------|---------|
| Django REST Framework | API serializers/views |
| django-filter | Filtering capabilities |
| pytest | Testing framework |
| OpenAPI | API documentation |

---

## Documents in This Group

| # | Document | Tasks | Description |
|---|----------|-------|-------------|
| 01 | `01_Tasks-69-75_Serializers-ViewSets-Filter.md` | 69-75 | Serializers, viewsets, org chart view, filtering |
| 02 | `02_Tasks-76-78_URLs-Tests-Documentation.md` | 76-78 | URL registration, tests, documentation |

---

## Task Summary

| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 69 | Create DepartmentSerializer | Medium | 30 min |
| 70 | Create DesignationSerializer | Medium | 25 min |
| 71 | Create OrgChartSerializer | Medium | 25 min |
| 72 | Create DepartmentViewSet | High | 35 min |
| 73 | Create DesignationViewSet | Medium | 30 min |
| 74 | Create OrgChartView | Medium | 25 min |
| 75 | Implement Department Filtering | Medium | 25 min |
| 76 | Register Organization API URLs | Low | 20 min |
| 77 | Create Organization Module Tests | High | 45 min |
| 78 | Create Organization Documentation | Medium | 35 min |

---

## Execution Order

```
[Tasks 69-75: Serializers, viewsets, filtering]
         │
         ▼
[Tasks 76-78: URLs, tests, documentation]
```

---

## Expected Deliverables

```
apps/organization/
├── serializers/
│   ├── __init__.py
│   ├── department_serializer.py  # Task 69
│   ├── designation_serializer.py # Task 70
│   └── orgchart_serializer.py    # Task 71
├── views/
│   ├── __init__.py
│   ├── department_viewset.py     # Task 72
│   ├── designation_viewset.py    # Task 73
│   └── orgchart_view.py          # Task 74
├── filters.py                    # Task 75
├── urls.py                       # Task 76
├── tests/
│   ├── __init__.py
│   ├── test_models.py
│   ├── test_services.py
│   ├── test_orgchart.py
│   └── test_api.py               # Task 77
└── docs/
    └── README.md                 # Task 78
```

---

## Notes for AI Agents

### Organization API Endpoints
```
/api/v1/organization/
├── GET /departments/             # List departments
├── POST /departments/            # Create department
├── GET /departments/{id}/        # Get department detail
├── PUT /departments/{id}/        # Update department
├── DELETE /departments/{id}/     # Delete (archive) department
├── GET /departments/{id}/tree/   # Get department subtree
├── GET /departments/{id}/employees/ # Get department employees
├── GET /departments/{id}/children/  # Get direct children
├── GET /departments/{id}/path/   # Get path to root
├── POST /departments/{id}/move/  # Move to new parent
├── POST /departments/{id}/merge/ # Merge with another
├── POST /departments/{id}/archive/ # Archive department
├── POST /departments/{id}/activate/ # Activate department
│
├── GET /designations/            # List designations
├── POST /designations/           # Create designation
├── GET /designations/{id}/       # Get designation detail
├── PUT /designations/{id}/       # Update designation
├── DELETE /designations/{id}/    # Delete (deactivate)
├── GET /designations/{id}/employees/ # Get employees
├── GET /designations/by-level/{level}/ # Get by level
│
├── GET /orgchart/                # Get full org chart
├── GET /orgchart/department/     # Department-based chart
├── GET /orgchart/employee/       # Employee-based chart
├── GET /orgchart/employee/{id}/  # Chart starting from employee
├── GET /orgchart/reporting-chain/{id}/ # Employee's chain
```

### Department Filtering Options
```
GET /departments/?status=ACTIVE
GET /departments/?parent={parent_id}
GET /departments/?parent__isnull=true  (root departments)
GET /departments/?manager={employee_id}
GET /departments/?search=sales
GET /departments/?has_employees=true
```

### DepartmentSerializer Nested Structure
```json
{
  "id": "uuid",
  "name": "Operations",
  "code": "DEPT-OPS",
  "description": "...",
  "status": "ACTIVE",
  "parent": {
    "id": "uuid",
    "name": "Company",
    "code": "DEPT-ROOT"
  },
  "manager": {
    "id": "uuid",
    "name": "John Smith",
    "employee_id": "EMP-0001"
  },
  "location": "Building A",
  "employee_count": 45,
  "level": 1,
  "children_count": 3,
  "path": ["Company", "Operations"],
  "created_at": "2020-01-15T10:00:00"
}
```

### DesignationSerializer
```json
{
  "id": "uuid",
  "title": "Software Engineer",
  "code": "SE",
  "level": "MID",
  "level_display": "Mid-Level",
  "description": "...",
  "department": {...},
  "min_salary": 80000,
  "max_salary": 150000,
  "currency": "LKR",
  "experience_years": 2,
  "is_manager": false,
  "reports_to": {...},
  "status": "ACTIVE",
  "employee_count": 15
}
```

### OrgChartSerializer
```json
{
  "type": "department",
  "generated_at": "2026-01-17T10:00:00",
  "total_departments": 25,
  "total_employees": 150,
  "root": {...}
}
```

### Test Categories
| Category | Tests |
|----------|-------|
| Model Tests | Department (MPTT), Designation |
| Service Tests | Create, update, archive, move, merge |
| Org Chart Tests | Tree queries, aggregations |
| Validation Tests | Circular, consistency |
| API Tests | All endpoints, permissions |
| Integration | End-to-end workflows |

### Documentation Sections
1. **Overview** - Module introduction
2. **Department Hierarchy** - MPTT explanation
3. **Designation Levels** - Level system
4. **Org Chart** - Visualization data
5. **Common Operations** - Move, merge, archive
6. **API Reference** - All endpoints
7. **Configuration** - Settings reference
