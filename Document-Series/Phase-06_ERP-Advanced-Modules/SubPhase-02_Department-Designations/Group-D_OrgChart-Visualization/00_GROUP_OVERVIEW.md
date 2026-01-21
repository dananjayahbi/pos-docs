# Group D: Org Chart & Visualization

> **Phase:** 06 - ERP Advanced Modules  
> **SubPhase:** 02 - Department & Designations  
> **Group:** D of F  
> **Tasks Covered:** 45-56  
> **Group Goal:** Implement org chart data generation and visualization support

---

## Navigation

- **↑ Parent:** [SubPhase-02 Summary](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [Group C: Department-Employee Links](../Group-C_Department-Employee-Links/)
- **→ Next Group:** [Group E: Services & Business Logic](../Group-E_Services-Business-Logic/)

---

## Group Overview

### Key Outcomes

1. **OrgChartService Class** - Service for org chart data generation
2. **Department Tree Query** - Get hierarchical department tree
3. **Employee Tree Query** - Get employee hierarchy by manager
4. **Generate Org Chart JSON** - Format data for frontend
5. **Employee Count Aggregation** - Count per department
6. **Budget Aggregation** - Sum budgets across children
7. **Department Statistics** - Calculate headcount, etc.
8. **Flatten Hierarchy** - Get flat list with level indicators
9. **Path to Root** - Get department path from leaf to root
10. **Subtree Query** - Get all departments under parent
11. **Reporting Chain Query** - Get employee's reporting chain
12. **Cache Org Chart Data** - Cache with Redis

### Technology Context

| Technology | Purpose |
|------------|---------|
| django-mptt | Efficient tree queries |
| Service Layer | Org chart logic |
| Redis | Caching |
| JSON | Frontend data format |

---

## Documents in This Group

| # | Document | Tasks | Description |
|---|----------|-------|-------------|
| 01 | `01_Tasks-45-50_Service-Tree-Aggregation.md` | 45-50 | OrgChartService, tree queries, aggregation |
| 02 | `02_Tasks-51-56_Stats-Flatten-Path-Cache.md` | 51-56 | Statistics, flatten, path, subtree, reporting chain, cache |

---

## Task Summary

| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 45 | Create OrgChartService Class | High | 30 min |
| 46 | Implement Department Tree Query | High | 30 min |
| 47 | Implement Employee Tree Query | High | 30 min |
| 48 | Generate Org Chart JSON | Medium | 25 min |
| 49 | Add Employee Count Aggregation | Medium | 25 min |
| 50 | Add Budget Aggregation | Medium | 25 min |
| 51 | Create Department Statistics | Medium | 25 min |
| 52 | Implement Flatten Hierarchy | Medium | 20 min |
| 53 | Implement Path to Root | Medium | 20 min |
| 54 | Implement Subtree Query | Medium | 20 min |
| 55 | Create Reporting Chain Query | Medium | 25 min |
| 56 | Cache Org Chart Data | High | 30 min |

---

## Execution Order

```
[Tasks 45-50: Service, tree queries, aggregation]
         │
         ▼
[Tasks 51-56: Statistics, utilities, caching]
```

---

## Expected Deliverables

```
apps/organization/
├── services/
│   ├── __init__.py
│   └── orgchart_service.py       # Tasks 45-56
└── cache/
    └── orgchart_cache.py         # Task 56
```

---

## Notes for AI Agents

### OrgChartService Methods
- get_department_tree(root_id=None)
- get_employee_tree(root_employee_id=None)
- generate_orgchart_json(type='department')
- get_employee_count(department_id)
- get_total_budget(department_id)
- get_department_stats(department_id)
- flatten_hierarchy(department_id=None)
- get_path_to_root(department_id)
- get_subtree(department_id)
- get_reporting_chain(employee_id)
- invalidate_cache()

### Department Tree Query (MPTT)
```
Without MPTT (N+1 queries):
- Get all descendants: Recursive queries
- Performance: O(n) queries for n nodes

With MPTT (Single query):
- Get all descendants: 
  WHERE lft BETWEEN parent.lft AND parent.rght
- Performance: O(1) query
```

### Org Chart JSON Structure
```json
{
  "type": "department",
  "root": {
    "id": "dept-001",
    "name": "Company",
    "code": "DEPT-ROOT",
    "manager": {
      "id": "emp-001",
      "name": "CEO Name",
      "designation": "CEO",
      "photo": "https://..."
    },
    "employee_count": 150,
    "budget": 50000000,
    "children": [
      {
        "id": "dept-002",
        "name": "Operations",
        "code": "DEPT-OPS",
        "manager": {...},
        "employee_count": 45,
        "budget": 15000000,
        "children": [...]
      }
    ]
  }
}
```

### Employee Org Chart JSON
```json
{
  "type": "employee",
  "root": {
    "id": "emp-001",
    "name": "John Smith",
    "designation": "CEO",
    "department": "Executive",
    "photo": "https://...",
    "direct_reports": [
      {
        "id": "emp-002",
        "name": "Jane Doe",
        "designation": "COO",
        "direct_reports": [...]
      }
    ]
  }
}
```

### Department Statistics
```json
{
  "department_id": "dept-002",
  "name": "Operations",
  "total_employees": 45,
  "active_employees": 42,
  "on_leave": 3,
  "sub_departments": 3,
  "total_budget": 15000000,
  "avg_tenure_years": 3.5,
  "open_positions": 5
}
```

### Flatten Hierarchy
```
Input: Department Tree
Output: Flat list with level indicators

[
  {"id": "dept-001", "name": "Company", "level": 0},
  {"id": "dept-002", "name": "Operations", "level": 1},
  {"id": "dept-003", "name": "Sales", "level": 2},
  {"id": "dept-004", "name": "Finance", "level": 1}
]
```

### Path to Root
```
Department: Accounts (DEPT-ACC)
Path: Accounts → Finance → Company (Root)

[
  {"id": "dept-acc", "name": "Accounts", "level": 2},
  {"id": "dept-fin", "name": "Finance", "level": 1},
  {"id": "dept-root", "name": "Company", "level": 0}
]
```

### Reporting Chain
```
Employee: Junior Developer (EMP-050)
Chain: Junior Dev → Senior Dev → Team Lead → CTO → CEO

[
  {"id": "emp-050", "name": "Junior Dev", "is_current": true},
  {"id": "emp-030", "name": "Senior Dev"},
  {"id": "emp-010", "name": "Team Lead"},
  {"id": "emp-003", "name": "CTO"},
  {"id": "emp-001", "name": "CEO"}
]
```

### Caching Strategy
```
Cache Keys:
- orgchart:department:tree:{tenant_id}
- orgchart:employee:tree:{tenant_id}
- orgchart:stats:{department_id}

TTL: 1 hour (configurable)

Invalidation Triggers:
- Department create/update/delete
- Employee department change
- Employee manager change
- Department manager change
```
