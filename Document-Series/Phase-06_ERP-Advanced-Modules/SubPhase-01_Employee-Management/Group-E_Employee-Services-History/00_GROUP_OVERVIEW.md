# Group E: Employee Services & History

> **Phase:** 06 - ERP Advanced Modules  
> **SubPhase:** 01 - Employee Management  
> **Group:** E of F  
> **Tasks Covered:** 67-80  
> **Group Goal:** Implement employee services, search, and import/export functionality

---

## Navigation

- **↑ Parent:** [SubPhase-01 Summary](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [Group D: Documents & Bank Details](../Group-D_Documents-Bank-Details/)
- **→ Next Group:** [Group F: API, Testing & Documentation](../Group-F_API-Testing-Documentation/)

---

## Group Overview

### Key Outcomes

1. **EmployeeService Class** - Main service for employee operations
2. **Create Employee** - Create new employee with validation
3. **Update Employee** - Update details with history tracking
4. **Employee Status Change** - Activate, deactivate, terminate, resign
5. **Link User Account** - Create/link user account for employee
6. **EmployeeSearchService** - Service for directory search
7. **Full-Text Search** - Search by name, email, employee_id
8. **Filter by Department** - Filter employees by department
9. **Filter by Status** - Filter by employment status
10. **EmployeeImportService** - Import from CSV/Excel
11. **Import Validation** - Validate before creating
12. **EmployeeExportService** - Export to CSV/Excel
13. **Export Filtering** - Export with filters
14. **Employee Reporting** - Generate summary reports

### Technology Context

| Technology | Purpose |
|------------|---------|
| Service Layer | Business logic |
| Full-Text Search | PostgreSQL/Elasticsearch |
| openpyxl | Excel import/export |
| pandas | CSV processing |

---

## Documents in This Group

| # | Document | Tasks | Description |
|---|----------|-------|-------------|
| 01 | `01_Tasks-67-75_Employee-Service-Search.md` | 67-75 | EmployeeService, status changes, search service |
| 02 | `02_Tasks-76-80_Import-Export-Reporting.md` | 76-80 | Import, export, validation, reporting |

---

## Task Summary

| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 67 | Create EmployeeService Class | High | 30 min |
| 68 | Implement Create Employee | Medium | 25 min |
| 69 | Implement Update Employee | Medium | 25 min |
| 70 | Implement Employee Status Change | Medium | 25 min |
| 71 | Implement Link User Account | Medium | 25 min |
| 72 | Create EmployeeSearchService | High | 30 min |
| 73 | Implement Full-Text Search | High | 30 min |
| 74 | Implement Filter by Department | Medium | 20 min |
| 75 | Implement Filter by Status | Medium | 20 min |
| 76 | Create EmployeeImportService | High | 35 min |
| 77 | Create Import Validation | High | 30 min |
| 78 | Create EmployeeExportService | Medium | 25 min |
| 79 | Implement Export Filtering | Medium | 20 min |
| 80 | Create Employee Reporting | Medium | 25 min |

---

## Execution Order

```
[Tasks 67-75: EmployeeService, search service]
         │
         ▼
[Tasks 76-80: Import, export, reporting]
```

---

## Expected Deliverables

```
apps/employees/
├── services/
│   ├── __init__.py
│   ├── employee_service.py       # Tasks 67-71
│   ├── search_service.py         # Tasks 72-75
│   ├── import_service.py         # Tasks 76-77
│   ├── export_service.py         # Tasks 78-79
│   └── report_service.py         # Task 80
└── templates/
    └── imports/
        └── employee_template.xlsx
```

---

## Notes for AI Agents

### EmployeeService Methods
- create_employee(data, user)
- update_employee(employee_id, data, user)
- activate(employee_id, user)
- deactivate(employee_id, reason, user)
- terminate(employee_id, date, reason, user)
- resign(employee_id, date, reason, notice_days, user)
- link_user_account(employee_id, user_data, user)
- unlink_user_account(employee_id, user)

### Status Change Rules
| Current | Allowed Transitions |
|---------|---------------------|
| ACTIVE | ON_LEAVE, INACTIVE, TERMINATED, RESIGNED |
| ON_LEAVE | ACTIVE |
| INACTIVE | ACTIVE, TERMINATED |
| TERMINATED | (none) |
| RESIGNED | (none) |

### User Account Linking
```
When linking user account:
1. Create User if not exists
2. Set user.employee_id = employee.id
3. Set employee.user = user
4. Assign default role (EMPLOYEE)
5. Send welcome email with credentials
```

### EmployeeSearchService Methods
- search(query, filters)
- search_by_name(name)
- search_by_email(email)
- search_by_employee_id(employee_id)
- filter_by_department(department_id)
- filter_by_status(status)
- filter_by_manager(manager_id)

### Full-Text Search
```
Search Query: "john developer"

Searches in:
- first_name, last_name (weighted 1.0)
- email (weighted 0.8)
- employee_id (weighted 0.7)
- designation (weighted 0.5)

Returns: Ranked results by relevance
```

### Import CSV Format
```csv
first_name,last_name,nic_number,email,phone,department,designation,hire_date,employment_type
John,Doe,912345678V,john@example.com,+94712345678,IT,Developer,2026-01-15,FULL_TIME
```

### Import Validation Rules
| Field | Validation |
|-------|------------|
| nic_number | Valid format, unique |
| email | Valid format, unique |
| phone | Sri Lanka format |
| department | Must exist |
| designation | Must exist |
| hire_date | Valid date |
| employment_type | Valid choice |

### Import Error Handling
```
Row 5: Invalid NIC format
Row 8: Duplicate email
Row 12: Department "Marketing" not found

Result:
- 47 employees imported
- 3 rows failed
- Error report generated
```

### Export Options
```
Filters:
- department
- status
- employment_type
- hire_date_range
- manager

Formats:
- CSV
- Excel (.xlsx)
- PDF (summary)

Fields:
- All fields
- Basic (name, email, department)
- Payroll (name, bank details)
```

### Employee Reports
| Report | Description |
|--------|-------------|
| Headcount | Total employees by status |
| Department Summary | Employees per department |
| Tenure Report | Average tenure, new hires |
| Turnover Report | Resignations, terminations |
| Anniversary Report | Upcoming work anniversaries |
