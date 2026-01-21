# Group F: API, Testing & Documentation

> **Phase:** 06 - ERP Advanced Modules  
> **SubPhase:** 05 - Salary Structure  
> **Group:** F of F  
> **Tasks Covered:** 77-86  
> **Group Goal:** Create API endpoints, tests, and module documentation

---

## Navigation

- **↑ Parent:** [SubPhase-05 Summary](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [Group E: Services & Calculations](../Group-E_Services-Calculations/)

---

## Group Overview

### Key Outcomes

1. **SalaryComponentSerializer** - DRF serializer for components
2. **SalaryTemplateSerializer** - Serializer for templates
3. **EmployeeSalarySerializer** - Serializer for employee salary
4. **SalaryComponentViewSet** - ViewSet for component CRUD
5. **SalaryTemplateViewSet** - ViewSet for templates
6. **EmployeeSalaryViewSet** - ViewSet for salary assignment
7. **Salary Actions** - assign, revise, compare actions
8. **Salary API URLs** - All endpoint registration
9. **Salary Module Tests** - Unit and integration tests
10. **Salary Documentation** - API docs, configuration guide

### Technology Context

| Technology | Purpose |
|------------|---------|
| Django REST Framework | API serializers/views |
| ViewSet Actions | Custom actions |
| pytest | Testing framework |
| OpenAPI | API documentation |

---

## Documents in This Group

| # | Document | Tasks | Description |
|---|----------|-------|-------------|
| 01 | `01_Tasks-77-83_Serializers-ViewSets.md` | 77-83 | Serializers, viewsets, actions |
| 02 | `02_Tasks-84-86_URLs-Tests-Documentation.md` | 84-86 | URL registration, tests, documentation |

---

## Task Summary

| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 77 | Create SalaryComponentSerializer | Medium | 25 min |
| 78 | Create SalaryTemplateSerializer | Medium | 30 min |
| 79 | Create EmployeeSalarySerializer | High | 35 min |
| 80 | Create SalaryComponentViewSet | Medium | 25 min |
| 81 | Create SalaryTemplateViewSet | Medium | 30 min |
| 82 | Create EmployeeSalaryViewSet | High | 35 min |
| 83 | Add Salary Actions | High | 30 min |
| 84 | Register Salary API URLs | Low | 20 min |
| 85 | Create Salary Module Tests | High | 45 min |
| 86 | Create Salary Documentation | Medium | 35 min |

---

## Execution Order

```
[Tasks 77-83: Serializers, viewsets, actions]
         │
         ▼
[Tasks 84-86: URLs, tests, documentation]
```

---

## Expected Deliverables

```
apps/payroll/
├── serializers/
│   ├── __init__.py
│   ├── component_serializer.py   # Task 77
│   ├── template_serializer.py    # Task 78
│   └── employee_salary_serializer.py # Task 79
├── views/
│   ├── __init__.py
│   ├── component_viewset.py      # Task 80
│   ├── template_viewset.py       # Task 81
│   └── employee_salary_viewset.py # Tasks 82-83
├── urls.py                       # Task 84
├── tests/
│   ├── __init__.py
│   ├── test_models.py
│   ├── test_services.py
│   ├── test_epf_etf.py
│   ├── test_paye.py
│   └── test_api.py               # Task 85
└── docs/
    └── README.md                 # Task 86
```

---

## Notes for AI Agents

### Salary API Endpoints
```
/api/v1/payroll/
├── GET /components/              # List components
├── POST /components/             # Create component (admin)
├── GET /components/{id}/         # Get component detail
├── PUT /components/{id}/         # Update component
├── DELETE /components/{id}/      # Delete component
├── GET /components/statutory/    # Statutory components only
├── GET /components/earnings/     # Earning components only
├── GET /components/deductions/   # Deduction components only
│
├── GET /templates/               # List templates
├── POST /templates/              # Create template
├── GET /templates/{id}/          # Get template detail
├── PUT /templates/{id}/          # Update template
├── DELETE /templates/{id}/       # Delete template
├── GET /templates/{id}/components/ # Template components
├── POST /templates/{id}/add-component/ # Add component
│
├── GET /grades/                  # List grades
├── POST /grades/                 # Create grade
├── GET /grades/{id}/             # Get grade detail
│
├── GET /salaries/                # List employee salaries
├── GET /salaries/{id}/           # Get salary detail
├── GET /salaries/employee/{id}/  # Employee's salary
├── GET /salaries/employee/{id}/history/ # Salary history
├── POST /salaries/assign/        # Assign template to employee
├── POST /salaries/{id}/revise/   # Create revision
├── POST /salaries/{id}/override-component/ # Override value
├── GET /salaries/compare/        # Compare salaries
├── GET /salaries/export/         # Export salary data
│
├── GET /epf-settings/            # EPF settings
├── PUT /epf-settings/            # Update EPF settings
├── GET /etf-settings/            # ETF settings
├── PUT /etf-settings/            # Update ETF settings
├── GET /tax-slabs/               # Tax slabs
├── POST /tax-slabs/              # Create slab
└── GET /exemptions/              # Tax exemptions
```

### SalaryComponentSerializer
```json
{
  "id": "uuid",
  "name": "Basic Salary",
  "code": "BASIC",
  "component_type": "EARNING",
  "category": "BASIC",
  "calculation_type": "FIXED",
  "default_value": 100000,
  "percentage": null,
  "is_taxable": true,
  "is_epf_applicable": true,
  "is_fixed": true,
  "is_active": true,
  "display_order": 10
}
```

### SalaryTemplateSerializer
```json
{
  "id": "uuid",
  "name": "Senior Developer Package",
  "code": "TMPL-SD",
  "description": "Salary package for senior developers",
  "designation": {
    "id": "uuid",
    "title": "Senior Software Engineer"
  },
  "is_active": true,
  "components": [
    {
      "component": {...},
      "default_value": 150000,
      "can_override": true,
      "min_value": 120000,
      "max_value": 200000
    }
  ]
}
```

### EmployeeSalarySerializer
```json
{
  "id": "uuid",
  "employee": {
    "id": "uuid",
    "name": "John Doe",
    "employee_id": "EMP-0001"
  },
  "salary_template": {...},
  "salary_grade": {...},
  "basic_salary": 150000,
  "gross_salary": 195000,
  "effective_from": "2026-01-01",
  "effective_to": null,
  "is_current": true,
  "revision_number": 3,
  "components": [
    {
      "component": "Basic Salary",
      "amount": 150000,
      "is_overridden": false
    },
    {
      "component": "Transport Allowance",
      "amount": 15000,
      "is_overridden": true
    }
  ],
  "deductions": {
    "epf_employee": 12000,
    "paye_tax": 5250
  },
  "net_salary": 177750,
  "employer_cost": {
    "epf_employer": 18000,
    "etf": 4500
  },
  "total_ctc": 217500
}
```

### Assign Action Request
```json
POST /api/v1/payroll/salaries/assign/
{
  "employee_id": "uuid",
  "template_id": "uuid",
  "effective_from": "2026-01-01",
  "overrides": [
    {
      "component_id": "uuid",
      "value": 155000
    }
  ]
}
```

### Revise Action Request
```json
POST /api/v1/payroll/salaries/{id}/revise/
{
  "effective_from": "2026-07-01",
  "reason": "Annual increment",
  "changes": [
    {
      "component_id": "uuid",
      "new_value": 165000
    }
  ]
}
```

### Compare Action Response
```json
GET /api/v1/payroll/salaries/compare/?old={id}&new={id}
{
  "old_salary": {...},
  "new_salary": {...},
  "change": {
    "basic": 15000,
    "gross": 18000,
    "basic_percentage": 10.0
  },
  "component_changes": [...]
}
```

### Test Categories
| Category | Tests |
|----------|-------|
| Model Tests | SalaryComponent, Template, EmployeeSalary |
| Service Tests | Assignment, revision, override |
| EPF Tests | Employee/employer calculations |
| ETF Tests | Contribution calculation |
| PAYE Tests | Tax slab application, exemptions |
| API Tests | All endpoints, permissions |

### Documentation Sections
1. **Overview** - Module introduction
2. **Salary Components** - Component configuration
3. **Templates & Grades** - Template setup
4. **Employee Salary** - Assignment process
5. **EPF/ETF** - Statutory contributions
6. **PAYE Tax** - Tax calculation
7. **Salary Revision** - Revision workflow
8. **API Reference** - All endpoints
9. **Sri Lanka Compliance** - Legal requirements
10. **Configuration** - Settings reference
