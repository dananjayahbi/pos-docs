# Tasks 45-50: Service, Tree Queries, and Aggregation

> **Phase:** 06 - ERP Advanced Modules  
> **SubPhase:** 02 - Department & Designations  
> **Group:** D - Org Chart & Visualization  
> **Document:** 01 of 02  
> **Tasks Covered:** 45, 46, 47, 48, 49, 50

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **→ Next Document:** [02_Tasks-51-56_Stats-Flatten-Path-Cache.md](02_Tasks-51-56_Stats-Flatten-Path-Cache.md)

---

## Document Overview

This document covers the core organization chart service implementation, including service class creation, hierarchical tree queries for departments and employees, JSON generation for frontend consumption, and aggregation methods for employee counts and budget calculations. These elements establish the foundation for visualizing organizational structures.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 45 | Create OrgChartService Class | High | 30 min |
| 46 | Implement Department Tree Query | High | 30 min |
| 47 | Implement Employee Tree Query | High | 30 min |
| 48 | Generate Org Chart JSON | Medium | 25 min |
| 49 | Add Employee Count Aggregation | Medium | 25 min |
| 50 | Add Budget Aggregation | Medium | 25 min |

---

## Task 45: Create OrgChartService Class

### Overview
Create the OrgChartService class as a centralized service layer for generating organization chart data. This service encapsulates all business logic for hierarchical queries, data transformation, and aggregation operations, providing a clean API for retrieving org chart information.

### Dependencies
- Department model with django-mptt
- Employee model with manager relationships
- Django project structure established
- apps/organization/ application exists

### Instructions

1. **Create services directory**
   - Navigate to `apps/organization/` directory
   - Create new directory named `services`
   - This will house all organization-related service classes

2. **Create services package initialization**
   - Create `__init__.py` in `services/` directory
   - Prepare for service class imports

3. **Create orgchart_service.py file**
   - Create `orgchart_service.py` in `services/` directory
   - This will contain the OrgChartService class

4. **Import required modules**
   - Import Department and Employee models
   - Import Django database functions (Count, Sum, Avg)
   - Import timezone utilities
   - Import django-mptt query utilities
   - Import connection for tenant-aware queries

5. **Define OrgChartService class**
   - Create class with comprehensive docstring
   - Explain service purpose and capabilities
   - List all available methods

6. **Add __init__ method**
   - Accept optional tenant parameter
   - Store tenant for filtering operations
   - Initialize any required state

7. **Add _get_base_department_queryset method**
   - Private method for base department queries
   - Apply tenant filtering
   - Return queryset with optimized select_related
   - Include manager, parent relationships

8. **Add _get_base_employee_queryset method**
   - Private method for base employee queries
   - Apply tenant filtering
   - Include department, manager, user relationships
   - Return optimized queryset

9. **Add method stubs for all operations**
   - Create method signatures for all org chart operations
   - Add docstrings explaining each method's purpose
   - Document expected parameters and return types
   - Leave implementation for subsequent tasks

10. **Update services/__init__.py**
    - Import OrgChartService
    - Add to __all__ list for clean imports

### OrgChartService Class Structure

```
┌─────────────────────────────────────────────────┐
│           OrgChartService Class                 │
├─────────────────────────────────────────────────┤
│ Initialization:                                 │
│  • __init__(tenant)                             │
│                                                 │
│ Private Helper Methods:                         │
│  • _get_base_department_queryset()              │
│  • _get_base_employee_queryset()                │
│                                                 │
│ Tree Query Methods:                             │
│  • get_department_tree(root_id)                 │
│  • get_employee_tree(root_employee_id)          │
│                                                 │
│ Data Generation Methods:                        │
│  • generate_orgchart_json(type)                 │
│                                                 │
│ Aggregation Methods:                            │
│  • get_employee_count(department_id)            │
│  • get_total_budget(department_id)              │
│                                                 │
│ Statistics & Utilities:                         │
│  • get_department_stats(department_id)          │
│  • flatten_hierarchy(department_id)             │
│  • get_path_to_root(department_id)              │
│  • get_subtree(department_id)                   │
│  • get_reporting_chain(employee_id)             │
│                                                 │
│ Cache Management:                               │
│  • invalidate_cache()                           │
└─────────────────────────────────────────────────┘
```

### Service Layer Architecture

```
┌──────────────────────────────────────────────────┐
│              Controller/View Layer               │
│         (API endpoints, admin views)             │
└────────────────┬─────────────────────────────────┘
                 │
                 ▼
┌──────────────────────────────────────────────────┐
│            OrgChartService Layer                 │
│  • Business logic encapsulation                  │
│  • Data transformation                           │
│  • Query optimization                            │
│  • Cache management                              │
└────────────────┬─────────────────────────────────┘
                 │
                 ▼
┌──────────────────────────────────────────────────┐
│              Model Layer (ORM)                   │
│  • Department (MPTT)                             │
│  • Employee                                      │
│  • User                                          │
└──────────────────────────────────────────────────┘
```

### Method Signature Reference

```python
# Initialization
__init__(tenant=None)

# Tree queries
get_department_tree(root_id=None) -> QuerySet
get_employee_tree(root_employee_id=None) -> QuerySet

# JSON generation
generate_orgchart_json(type='department') -> dict

# Aggregation
get_employee_count(department_id) -> int
get_total_budget(department_id) -> Decimal

# Statistics
get_department_stats(department_id) -> dict

# Utilities
flatten_hierarchy(department_id=None) -> list
get_path_to_root(department_id) -> list
get_subtree(department_id) -> QuerySet
get_reporting_chain(employee_id) -> list

# Cache
invalidate_cache() -> None
```

### Service Usage Pattern

```
Usage Flow
══════════

1. Instantiate Service:
   service = OrgChartService(tenant=request.tenant)

2. Call Methods:
   dept_tree = service.get_department_tree()
   json_data = service.generate_orgchart_json('department')
   stats = service.get_department_stats(dept_id)

3. Cache Management:
   service.invalidate_cache()  # When data changes
```

### Expected Outcome
- Clean service layer architecture
- Centralized org chart logic
- Tenant-aware operations
- Optimized query methods
- Foundation for all org chart features

### Verification Checklist
- [ ] services/ directory created
- [ ] services/__init__.py file created
- [ ] orgchart_service.py file created
- [ ] OrgChartService class defined
- [ ] __init__ method implemented
- [ ] _get_base_department_queryset method created
- [ ] _get_base_employee_queryset method created
- [ ] All method stubs defined with docstrings
- [ ] Service imported in __init__.py

---

## Task 46: Implement Department Tree Query

### Overview
Implement the get_department_tree method to retrieve hierarchical department data using django-mptt's efficient tree query capabilities. This method returns a complete department hierarchy starting from a root department or the entire tree if no root is specified.

### Dependencies
- Task 45: Create OrgChartService Class
- Department model with django-mptt configured
- MPTT fields (lft, rght, tree_id, level) populated

### Instructions

1. **Open orgchart_service.py file**
   - Navigate to `apps/organization/services/orgchart_service.py`
   - Locate get_department_tree method stub

2. **Implement get_department_tree method**
   - Accept optional root_id parameter
   - If root_id is None, return entire department tree
   - If root_id is provided, return subtree from that root

3. **Handle root department retrieval**
   - If root_id provided, get root department
   - Verify department exists and belongs to tenant
   - Handle DoesNotExist exception gracefully

4. **Use MPTT get_descendants method**
   - Call get_descendants(include_self=True)
   - This returns all descendants plus the root
   - Single optimized query using MPTT tree structure

5. **Apply select_related optimization**
   - Include 'manager' relationship
   - Include 'manager__user' for user details
   - Include 'parent' for hierarchy navigation
   - Reduces N+1 query problems

6. **Apply prefetch_related for employees**
   - Prefetch 'employees' relationship
   - Include employee user details
   - Include designation information
   - Optimize for rendering org chart

7. **Order results by tree structure**
   - Order by 'tree_id' and 'lft' fields
   - Maintains hierarchical order
   - Ensures parent before children

8. **Handle entire tree case**
   - If no root_id, use base queryset
   - Apply same optimizations
   - Return all tenant departments

9. **Add comprehensive docstring**
   - Document parameters and return type
   - Explain MPTT optimization
   - Provide usage examples

### Department Tree Query with MPTT

```
MPTT Tree Structure (Nested Sets)
══════════════════════════════════

Department Table with MPTT Fields:
┌─────┬──────────┬─────┬──────┬────────┬───────┐
│ ID  │ Name     │ lft │ rght │ tree_id│ level │
├─────┼──────────┼─────┼──────┼────────┼───────┤
│ 1   │ Company  │ 1   │ 12   │ 1      │ 0     │
│ 2   │ Ops      │ 2   │ 7    │ 1      │ 1     │
│ 3   │ Sales    │ 3   │ 4    │ 1      │ 2     │
│ 4   │ Support  │ 5   │ 6    │ 1      │ 2     │
│ 5   │ Finance  │ 8   │ 11   │ 1      │ 1     │
│ 6   │ Accounts │ 9   │ 10   │ 1      │ 2     │
└─────┴──────────┴─────┴──────┴────────┴───────┘

Tree Visualization:
Company (1-12)
├── Operations (2-7)
│   ├── Sales (3-4)
│   └── Support (5-6)
└── Finance (8-11)
    └── Accounts (9-10)

Query: Get subtree of "Operations"
WHERE lft >= 2 AND rght <= 7 AND tree_id = 1

Result: Operations, Sales, Support
```

### MPTT Query Performance

```
Traditional Recursive Approach:
═══════════════════════════════

SELECT * FROM department WHERE id = 2;           -- Query 1: Get Ops
SELECT * FROM department WHERE parent_id = 2;    -- Query 2: Get children
SELECT * FROM department WHERE parent_id = 3;    -- Query 3: Sales children
SELECT * FROM department WHERE parent_id = 4;    -- Query 4: Support children
...
Total: N queries for N departments (O(n) complexity)

MPTT Approach:
═══════════════

SELECT * FROM department 
WHERE lft >= 2 AND rght <= 7 AND tree_id = 1
ORDER BY lft;                                     -- Single query!

Total: 1 query for entire subtree (O(1) complexity)
Performance: 10-100x faster for large hierarchies
```

### Query Optimization Details

| Optimization | Purpose | Benefit |
|--------------|---------|---------|
| select_related('manager') | Join manager in same query | Avoid N+1 for manager access |
| select_related('manager__user') | Include user details | Get manager name without extra query |
| select_related('parent') | Include parent department | Navigate hierarchy efficiently |
| prefetch_related('employees') | Prefetch all employees | Batch fetch employees per dept |
| order_by('tree_id', 'lft') | Hierarchical ordering | Parent always before children |

### Tree Query Scenarios

#### Scenario 1: Full Organization Tree
```
Input: root_id = None
Query: All departments in tenant

Result:
[
  Department(id=1, name="Company", level=0),
  Department(id=2, name="Operations", level=1),
  Department(id=3, name="Sales", level=2),
  Department(id=4, name="Support", level=2),
  Department(id=5, name="Finance", level=1),
  Department(id=6, name="Accounts", level=2)
]
```

#### Scenario 2: Specific Department Subtree
```
Input: root_id = 2 (Operations)
Query: Operations and all descendants

Result:
[
  Department(id=2, name="Operations", level=1),
  Department(id=3, name="Sales", level=2),
  Department(id=4, name="Support", level=2)
]
```

#### Scenario 3: Leaf Department (No Children)
```
Input: root_id = 3 (Sales)
Query: Sales only (no descendants)

Result:
[
  Department(id=3, name="Sales", level=2)
]
```

### Hierarchical Data Structure

```
Returned QuerySet Properties:
═══════════════════════════════

Each Department object includes:
├── Basic Fields
│   ├── id, name, code, description
│   └── is_active, budget
│
├── MPTT Fields
│   ├── level (depth in tree)
│   ├── lft, rght (nested set boundaries)
│   └── tree_id (separate tree identifier)
│
├── Relationships (via select_related)
│   ├── manager (Employee object)
│   ├── manager.user (User object)
│   └── parent (Parent Department)
│
└── Prefetched Collections
    └── employees (QuerySet of Employee objects)
```

### Expected Outcome
- Efficient department tree retrieval
- Single-query optimization via MPTT
- Proper relationship loading
- Hierarchical ordering maintained
- Support for full tree or subtree queries

### Verification Checklist
- [ ] get_department_tree method implemented
- [ ] root_id parameter handled correctly
- [ ] MPTT get_descendants used for subtree
- [ ] select_related optimization applied
- [ ] prefetch_related for employees added
- [ ] Hierarchical ordering maintained
- [ ] Full tree case handled
- [ ] Comprehensive docstring added
- [ ] DoesNotExist exception handled

---

## Task 47: Implement Employee Tree Query

### Overview
Implement the get_employee_tree method to retrieve hierarchical employee data based on manager-employee relationships. This method returns an employee hierarchy starting from a specific employee (typically a manager) or from top-level employees (those without managers) if no root is specified.

### Dependencies
- Task 45: Create OrgChartService Class
- Employee model with manager field (self-referencing ForeignKey)
- User model relationship configured

### Instructions

1. **Open orgchart_service.py file**
   - Navigate to `apps/organization/services/orgchart_service.py`
   - Locate get_employee_tree method stub

2. **Implement get_employee_tree method**
   - Accept optional root_employee_id parameter
   - If root_employee_id is None, return top-level employees
   - If root_employee_id provided, return that employee and subordinates

3. **Handle root employee retrieval**
   - If root_employee_id provided, get root employee
   - Verify employee exists and belongs to tenant
   - Handle DoesNotExist exception gracefully

4. **Define recursive query function**
   - Create internal recursive function to traverse hierarchy
   - Accept employee and depth parameters
   - Return list of employee dictionaries with hierarchy info

5. **Build employee hierarchy data**
   - For each employee, include basic information
   - Add hierarchy level (depth)
   - Include manager relationship
   - Count direct reports

6. **Recursively process direct reports**
   - Query employees where manager = current employee
   - Call recursive function for each direct report
   - Increment depth for subordinates
   - Build complete tree structure

7. **Apply select_related optimization**
   - Include 'user' relationship for name/email
   - Include 'department' for org context
   - Include 'designation' for title
   - Include 'manager' for reporting line

8. **Handle top-level employees case**
   - Query employees where manager is None
   - These are executives/top management
   - Process each as separate tree root

9. **Order results meaningfully**
   - Order by designation level (senior first)
   - Then by department
   - Then by name alphabetically

10. **Add comprehensive docstring**
    - Document parameters and return structure
    - Explain recursive approach
    - Provide usage examples

### Employee Tree Structure

```
Employee Hierarchy (Manager-Employee Relationships)
═══════════════════════════════════════════════════

Database Relationships:
┌─────┬───────────────┬────────────┬──────────────┐
│ ID  │ Name          │ Manager_ID │ Designation  │
├─────┼───────────────┼────────────┼──────────────┤
│ 1   │ John Smith    │ NULL       │ CEO          │
│ 2   │ Jane Doe      │ 1          │ COO          │
│ 3   │ Bob Wilson    │ 1          │ CFO          │
│ 4   │ Alice Brown   │ 2          │ VP Ops       │
│ 5   │ Charlie Green │ 2          │ VP Sales     │
│ 6   │ David Lee     │ 4          │ Sales Mgr    │
└─────┴───────────────┴────────────┴──────────────┘

Tree Visualization:
CEO (John Smith)
├── COO (Jane Doe)
│   ├── VP Ops (Alice Brown)
│   │   └── Sales Mgr (David Lee)
│   └── VP Sales (Charlie Green)
└── CFO (Bob Wilson)
```

### Recursive Query Algorithm

```
Algorithm: Build Employee Tree
═══════════════════════════════

function get_employee_tree(root_id):
    if root_id is None:
        roots = Employee.filter(manager=None)
    else:
        roots = [Employee.get(id=root_id)]
    
    result = []
    for root in roots:
        tree = build_subtree(root, level=0)
        result.append(tree)
    
    return result

function build_subtree(employee, level):
    node = {
        'employee': employee,
        'level': level,
        'direct_reports': []
    }
    
    subordinates = Employee.filter(manager=employee)
    for sub in subordinates:
        child = build_subtree(sub, level + 1)
        node['direct_reports'].append(child)
    
    return node
```

### Query Optimization Strategy

```
Without Optimization:
════════════════════

get_employee_tree(ceo_id)
└── Query 1: Get CEO
    ├── Query 2: Get CEO's direct reports (2 employees)
    ├── Query 3: Get COO's direct reports (2 employees)
    ├── Query 4: Get VP Ops' direct reports (1 employee)
    ├── Query 5: Get VP Sales' direct reports (0 employees)
    └── Query 6: Get Sales Mgr's direct reports (0 employees)

Total: 6 queries (N+1 problem)

With Optimization:
═════════════════

Query 1: Get all employees with select_related
    SELECT * FROM employee e
    LEFT JOIN user u ON e.user_id = u.id
    LEFT JOIN department d ON e.department_id = d.id
    LEFT JOIN designation ds ON e.designation_id = ds.id
    LEFT JOIN employee m ON e.manager_id = m.id
    WHERE e.tenant_id = ? AND e.lft >= ? AND e.rght <= ?

Query 2: Build hierarchy in Python (no additional queries)

Total: 1-2 queries (optimal)
```

### Employee Tree Data Structure

```
Returned Data Structure:
════════════════════════

[
  {
    'id': 1,
    'name': 'John Smith',
    'designation': 'CEO',
    'department': 'Executive',
    'level': 0,
    'photo_url': 'https://...',
    'email': 'john@company.com',
    'direct_reports_count': 2,
    'direct_reports': [
      {
        'id': 2,
        'name': 'Jane Doe',
        'designation': 'COO',
        'level': 1,
        'direct_reports_count': 2,
        'direct_reports': [...]
      },
      {
        'id': 3,
        'name': 'Bob Wilson',
        'designation': 'CFO',
        'level': 1,
        'direct_reports_count': 0,
        'direct_reports': []
      }
    ]
  }
]
```

### Employee Tree Scenarios

#### Scenario 1: From CEO (Full Org)
```
Input: root_employee_id = 1 (CEO)
Result: Complete organizational hierarchy

Tree Levels:
Level 0: CEO (1 person)
Level 1: C-Suite (2 people)
Level 2: VPs (2 people)
Level 3: Managers (1 person)
Level 4: Individual Contributors
```

#### Scenario 2: From Department Head
```
Input: root_employee_id = 2 (COO)
Result: Operations division hierarchy

Tree:
COO
├── VP Operations
│   └── Sales Manager
└── VP Sales
```

#### Scenario 3: Top-Level Employees
```
Input: root_employee_id = None
Result: Multiple trees (if multiple top employees)

Trees:
1. CEO Tree (main organization)
2. Consultant Tree (reports to none)
3. Advisor Tree (special roles)
```

### Direct Reports Calculation

```
Direct Reports Count:
════════════════════

Query per Employee:
SELECT COUNT(*) FROM employee WHERE manager_id = ?

Efficient Approach:
Count in Python during tree building (no extra queries)
direct_reports_count = len(subordinates)
```

### Expected Outcome
- Efficient employee hierarchy retrieval
- Recursive tree structure
- Optimized relationship loading
- Support for full org or department trees
- Clear reporting line visualization

### Verification Checklist
- [ ] get_employee_tree method implemented
- [ ] root_employee_id parameter handled
- [ ] Recursive traversal function created
- [ ] select_related optimization applied
- [ ] Direct reports queried efficiently
- [ ] Hierarchy level (depth) tracked
- [ ] Top-level employees case handled
- [ ] Comprehensive docstring added
- [ ] DoesNotExist exception handled

---

## Task 48: Generate Org Chart JSON

### Overview
Implement the generate_orgchart_json method to transform hierarchical department or employee data into a JSON format suitable for frontend visualization libraries. This method formats the tree structure with all necessary information for rendering interactive org charts.

### Dependencies
- Task 46: Implement Department Tree Query
- Task 47: Implement Employee Tree Query
- JSON serialization utilities

### Instructions

1. **Open orgchart_service.py file**
   - Navigate to `apps/organization/services/orgchart_service.py`
   - Locate generate_orgchart_json method stub

2. **Implement generate_orgchart_json method**
   - Accept type parameter ('department' or 'employee')
   - Accept optional root_id parameter
   - Return formatted JSON-serializable dictionary

3. **Handle department org chart generation**
   - If type='department', call get_department_tree
   - Transform QuerySet into nested dictionary structure
   - Include all department information

4. **Handle employee org chart generation**
   - If type='employee', call get_employee_tree
   - Transform hierarchy into nested dictionary structure
   - Include all employee information

5. **Create department node formatter**
   - Define internal function to format single department
   - Include id, name, code, description
   - Add manager information (if exists)
   - Include employee count and budget
   - Format children recursively

6. **Create employee node formatter**
   - Define internal function to format single employee
   - Include id, name, designation, department
   - Add photo URL, email, phone
   - Format direct reports recursively

7. **Build nested JSON structure**
   - Start from root node(s)
   - Recursively build children arrays
   - Maintain hierarchy relationships
   - Ensure JSON serializable types

8. **Add metadata to output**
   - Include type (department/employee)
   - Add generation timestamp
   - Include root information
   - Add total node count

9. **Handle serialization edge cases**
   - Convert Decimal to float for JSON
   - Format datetime as ISO strings
   - Handle None values appropriately
   - Ensure all URLs are absolute

10. **Add comprehensive docstring**
    - Document parameters and return structure
    - Show example JSON output
    - Explain frontend integration

### Department Org Chart JSON Structure

```json
{
  "type": "department",
  "generated_at": "2026-01-24T10:30:00Z",
  "total_departments": 6,
  "total_employees": 150,
  "root": {
    "id": "dept-001",
    "name": "LankaCommerce Pvt Ltd",
    "code": "DEPT-ROOT",
    "description": "Company headquarters",
    "level": 0,
    "manager": {
      "id": "emp-001",
      "name": "Nimal Perera",
      "designation": "Chief Executive Officer",
      "department": "Executive",
      "photo_url": "https://cdn.example.com/photos/emp-001.jpg",
      "email": "nimal@lankacommerce.lk",
      "phone": "+94 77 123 4567"
    },
    "statistics": {
      "employee_count": 150,
      "active_employees": 145,
      "on_leave": 5,
      "budget": 50000000.00,
      "sub_departments": 2
    },
    "children": [
      {
        "id": "dept-002",
        "name": "Operations",
        "code": "DEPT-OPS",
        "level": 1,
        "manager": {
          "id": "emp-002",
          "name": "Saman Silva",
          "designation": "Chief Operating Officer"
        },
        "statistics": {
          "employee_count": 45,
          "budget": 15000000.00
        },
        "children": [
          {
            "id": "dept-003",
            "name": "Sales",
            "code": "DEPT-SALES",
            "level": 2,
            "statistics": {
              "employee_count": 25,
              "budget": 8000000.00
            },
            "children": []
          }
        ]
      },
      {
        "id": "dept-005",
        "name": "Finance",
        "code": "DEPT-FIN",
        "level": 1,
        "manager": {
          "id": "emp-005",
          "name": "Kumari Fernando",
          "designation": "Chief Financial Officer"
        },
        "statistics": {
          "employee_count": 30,
          "budget": 12000000.00
        },
        "children": []
      }
    ]
  }
}
```

### Employee Org Chart JSON Structure

```json
{
  "type": "employee",
  "generated_at": "2026-01-24T10:30:00Z",
  "total_employees": 150,
  "max_depth": 5,
  "root": {
    "id": "emp-001",
    "name": "Nimal Perera",
    "designation": "Chief Executive Officer",
    "department": {
      "id": "dept-001",
      "name": "Executive",
      "code": "DEPT-EXEC"
    },
    "contact": {
      "email": "nimal@lankacommerce.lk",
      "phone": "+94 77 123 4567",
      "extension": "1001"
    },
    "photo_url": "https://cdn.example.com/photos/emp-001.jpg",
    "level": 0,
    "is_active": true,
    "direct_reports_count": 5,
    "direct_reports": [
      {
        "id": "emp-002",
        "name": "Saman Silva",
        "designation": "Chief Operating Officer",
        "department": {
          "id": "dept-002",
          "name": "Operations"
        },
        "photo_url": "https://cdn.example.com/photos/emp-002.jpg",
        "level": 1,
        "direct_reports_count": 8,
        "direct_reports": [
          {
            "id": "emp-010",
            "name": "Tharaka Rathnayake",
            "designation": "Operations Manager",
            "level": 2,
            "direct_reports_count": 12,
            "direct_reports": []
          }
        ]
      }
    ]
  }
}
```

### JSON Formatting Utilities

```
Data Type Conversions:
═════════════════════

1. Decimal to Float:
   budget: Decimal('15000000.00') → 15000000.0

2. DateTime to ISO String:
   created_at: datetime(2026, 1, 24, 10, 30) → "2026-01-24T10:30:00Z"

3. None Handling:
   manager: None → null (JSON null)
   description: None → null or omit field

4. URL Formatting:
   photo: '/media/photos/emp.jpg' → 'https://domain.com/media/photos/emp.jpg'

5. Boolean Preservation:
   is_active: True → true (JSON boolean)
```

### Recursive Node Building

```
Algorithm: Build Department Node
════════════════════════════════

function build_department_node(dept):
    node = {
        'id': dept.code,
        'name': dept.name,
        'level': dept.level,
        'manager': build_manager_info(dept.manager),
        'statistics': build_stats(dept),
        'children': []
    }
    
    # Get immediate children
    children = dept.get_children()
    for child in children:
        child_node = build_department_node(child)
        node['children'].append(child_node)
    
    return node

function build_manager_info(employee):
    if employee is None:
        return null
    
    return {
        'id': employee.employee_code,
        'name': employee.full_name,
        'designation': employee.designation.title,
        'photo_url': employee.get_photo_url()
    }
```

### Frontend Integration

```
Frontend Org Chart Libraries:
══════════════════════════════

Compatible with:
1. OrgChart.js
2. D3.js org chart
3. GoJS organization chart
4. React Organizational Chart
5. Vue Organization Chart

Common Requirements:
- Nested children array structure
- Unique node identifiers
- Consistent property names
- Metadata for rendering (level, counts)
```

### Node Customization Options

| Field | Department Chart | Employee Chart | Optional |
|-------|------------------|----------------|----------|
| id | ✓ | ✓ | No |
| name | ✓ | ✓ | No |
| level | ✓ | ✓ | No |
| children / direct_reports | ✓ | ✓ | No |
| manager | ✓ | ✗ | Yes |
| designation | ✗ | ✓ | No |
| department | ✗ | ✓ | Yes |
| photo_url | Manager only | ✓ | Yes |
| statistics | ✓ | ✗ | Yes |
| contact | ✗ | ✓ | Yes |

### Expected Outcome
- Clean JSON structure for frontend
- Nested hierarchy properly formatted
- All necessary data included
- Compatible with visualization libraries
- Efficient serialization

### Verification Checklist
- [ ] generate_orgchart_json method implemented
- [ ] type parameter ('department'/'employee') handled
- [ ] Department formatting function created
- [ ] Employee formatting function created
- [ ] Nested children structure built
- [ ] Metadata included in output
- [ ] Data type conversions handled
- [ ] URLs formatted as absolute paths
- [ ] Comprehensive docstring added

---

## Task 49: Add Employee Count Aggregation

### Overview
Implement the get_employee_count method to calculate the total number of employees in a department, including all employees in descendant departments. This aggregation provides valuable metrics for organizational analysis and capacity planning.

### Dependencies
- Task 46: Implement Department Tree Query
- Employee model with department relationship
- django-mptt for efficient subtree queries

### Instructions

1. **Open orgchart_service.py file**
   - Navigate to `apps/organization/services/orgchart_service.py`
   - Locate get_employee_count method stub

2. **Implement get_employee_count method**
   - Accept department_id parameter
   - Return integer count of all employees
   - Include employees from all descendant departments

3. **Retrieve target department**
   - Get department by ID
   - Verify department exists and belongs to tenant
   - Handle DoesNotExist exception gracefully

4. **Get department subtree**
   - Use get_descendants(include_self=True)
   - Returns department and all children via MPTT
   - Single efficient query

5. **Extract department IDs**
   - Get list of all department IDs in subtree
   - Use values_list('id', flat=True)
   - Prepare for employee count query

6. **Query employee count**
   - Filter employees by department_id__in subtree IDs
   - Filter by is_active=True (count active only)
   - Apply tenant filter
   - Use .count() for efficient counting

7. **Add optional parameters**
   - Accept include_inactive parameter (default False)
   - If True, count all employees regardless of status
   - Adjust query filter accordingly

8. **Add caching consideration**
   - Document that this query can be cached
   - Note cache invalidation triggers
   - Suggest cache key pattern

9. **Handle edge cases**
   - Return 0 if department has no employees
   - Handle None department_id gracefully
   - Return count for entire organization if id is None

10. **Add comprehensive docstring**
    - Document parameters and return type
    - Explain aggregation logic
    - Provide usage examples

### Employee Count Aggregation Logic

```
Department Hierarchy with Employees:
═══════════════════════════════════

Company (ROOT)
├── Operations (5 direct employees)
│   ├── Sales (12 direct employees)
│   └── Support (8 direct employees)
└── Finance (10 direct employees)
    └── Accounts (7 direct employees)

Employee Counts:
----------------
get_employee_count('Company')
  = 5 + 12 + 8 + 10 + 7 = 42 employees

get_employee_count('Operations')
  = 5 + 12 + 8 = 25 employees

get_employee_count('Sales')
  = 12 employees (no children)

get_employee_count('Finance')
  = 10 + 7 = 17 employees
```

### Query Optimization

```
Inefficient Approach (Recursive Queries):
════════════════════════════════════════

function count_employees(dept):
    count = Employee.filter(department=dept).count()
    
    for child in dept.children:
        count += count_employees(child)
    
    return count

Queries: 1 per department + 1 per count
Total: 2N queries for N departments

Efficient Approach (MPPT + Single Count):
═════════════════════════════════════════

function count_employees(dept):
    # Single MPTT query for all descendants
    subtree = dept.get_descendants(include_self=True)
    dept_ids = [d.id for d in subtree]
    
    # Single aggregate query
    count = Employee.filter(
        department_id__in=dept_ids,
        is_active=True
    ).count()
    
    return count

Queries: 2 total (1 for subtree, 1 for count)
Performance: O(1) regardless of tree depth
```

### SQL Query Example

```sql
-- Step 1: Get department subtree (MPTT query)
SELECT id, name, lft, rght
FROM organization_department
WHERE tenant_id = ?
  AND lft >= ?  -- Root department's lft
  AND rght <= ? -- Root department's rght
  AND tree_id = ?;

-- Step 2: Count employees (Single aggregate)
SELECT COUNT(*)
FROM organization_employee
WHERE department_id IN (dept_ids...)  -- From step 1
  AND is_active = TRUE
  AND tenant_id = ?;
```

### Count Variations

```
Count Options:
═════════════

1. Active Employees Only (Default):
   filter(is_active=True).count()
   Use: Standard operational metrics

2. All Employees (Including Inactive):
   count()  # No is_active filter
   Use: Historical analysis, total capacity

3. By Employment Type:
   filter(employment_type='FULL_TIME').count()
   Use: Full-time vs part-time analysis

4. By Position Status:
   filter(position_status='FILLED').count()
   Use: Actual headcount vs open positions
```

### Aggregation Breakdown

```
Detailed Employee Count Breakdown:
═════════════════════════════════

{
  "department": "Operations",
  "total_employees": 25,
  "breakdown": {
    "direct": 5,           # Employees directly in Operations
    "descendants": 20,     # Employees in child departments
    "by_status": {
      "active": 24,
      "on_leave": 1,
      "inactive": 0
    },
    "by_type": {
      "full_time": 20,
      "part_time": 3,
      "contract": 2
    },
    "by_department": {
      "Operations": 5,
      "Sales": 12,
      "Support": 8
    }
  }
}
```

### Caching Strategy

```
Cache Pattern:
═════════════

Key: f"dept:{dept_id}:employee_count:active"
TTL: 1 hour (3600 seconds)

Invalidation Triggers:
- Employee created in department or descendants
- Employee transferred to/from department
- Employee status changed (active/inactive)
- Department moved in hierarchy
- Department deleted

Cache Implementation:
from django.core.cache import cache

def get_employee_count(dept_id):
    cache_key = f"dept:{dept_id}:employee_count:active"
    count = cache.get(cache_key)
    
    if count is None:
        count = _calculate_employee_count(dept_id)
        cache.set(cache_key, count, 3600)
    
    return count
```

### Expected Outcome
- Accurate employee count aggregation
- Efficient MPTT-based queries
- Support for subtree counting
- Optional active/inactive filtering
- Foundation for department statistics

### Verification Checklist
- [ ] get_employee_count method implemented
- [ ] department_id parameter handled
- [ ] MPTT get_descendants used for subtree
- [ ] Employee count query optimized
- [ ] is_active filter applied
- [ ] include_inactive parameter added
- [ ] Edge cases handled
- [ ] Caching considerations documented
- [ ] Comprehensive docstring added

---

## Task 50: Add Budget Aggregation

### Overview
Implement the get_total_budget method to calculate the total budget allocation for a department, including all budgets from descendant departments. This aggregation supports financial planning, budget tracking, and resource allocation analysis.

### Dependencies
- Task 46: Implement Department Tree Query
- Department model with budget field
- django-mptt for efficient subtree queries

### Instructions

1. **Open orgchart_service.py file**
   - Navigate to `apps/organization/services/orgchart_service.py`
   - Locate get_total_budget method stub

2. **Implement get_total_budget method**
   - Accept department_id parameter
   - Return Decimal total of all budgets
   - Include budgets from all descendant departments

3. **Retrieve target department**
   - Get department by ID
   - Verify department exists and belongs to tenant
   - Handle DoesNotExist exception gracefully

4. **Get department subtree**
   - Use get_descendants(include_self=True)
   - Returns department and all children via MPTT
   - Single efficient query

5. **Calculate budget sum**
   - Use aggregate with Sum function
   - Sum the 'budget' field across all departments
   - Return Decimal value (default 0 if None)

6. **Handle null budgets**
   - Some departments may have budget=None
   - Treat None as 0 in calculations
   - Use Coalesce for null handling

7. **Add currency handling**
   - Document that budget uses Decimal for precision
   - Note currency assumptions (LKR for Sri Lanka)
   - Preserve decimal places for financial accuracy

8. **Add optional filters**
   - Accept include_inactive parameter
   - Filter by is_active if needed
   - Allow for different budget scenarios

9. **Handle edge cases**
   - Return Decimal('0.00') if no budgets
   - Handle None department_id gracefully
   - Return organization total if id is None

10. **Add comprehensive docstring**
    - Document parameters and return type
    - Explain aggregation logic with null handling
    - Provide usage examples with currency

### Budget Aggregation Logic

```
Department Hierarchy with Budgets (LKR):
════════════════════════════════════════

Company (ROOT) - Budget: 5,000,000
├── Operations - Budget: 15,000,000
│   ├── Sales - Budget: 8,000,000
│   └── Support - Budget: 3,000,000
└── Finance - Budget: 10,000,000
    └── Accounts - Budget: 2,500,000

Budget Calculations:
-------------------
get_total_budget('Company')
  = 5,000,000 + 15,000,000 + 8,000,000 + 3,000,000 
    + 10,000,000 + 2,500,000
  = LKR 43,500,000

get_total_budget('Operations')
  = 15,000,000 + 8,000,000 + 3,000,000
  = LKR 26,000,000

get_total_budget('Sales')
  = 8,000,000 (no children)

get_total_budget('Finance')
  = 10,000,000 + 2,500,000
  = LKR 12,500,000
```

### Query Implementation

```
Efficient Aggregation Query:
═══════════════════════════

from django.db.models import Sum
from django.db.models.functions import Coalesce

def get_total_budget(department_id):
    dept = Department.objects.get(id=department_id)
    
    # Get subtree (MPTT query)
    subtree = dept.get_descendants(include_self=True)
    
    # Aggregate budget sum
    result = subtree.aggregate(
        total=Coalesce(Sum('budget'), Decimal('0.00'))
    )
    
    return result['total']

SQL Generated:
SELECT COALESCE(SUM(budget), 0.00) AS total
FROM organization_department
WHERE tenant_id = ?
  AND lft >= ?
  AND rght <= ?
  AND tree_id = ?;
```

### Decimal Precision Handling

```
Financial Decimal Precision:
═══════════════════════════

Model Definition:
budget = models.DecimalField(
    max_digits=15,      # Up to 999,999,999,999.99
    decimal_places=2,   # 2 decimal places (cents)
    null=True,
    blank=True
)

Budget Values:
--------------
LKR 15,000,000.00    ✓ Correct (Decimal)
15000000             ✗ Wrong (Integer)
15000000.0           ✗ Wrong (Float - precision loss)

Decimal Operations:
-------------------
from decimal import Decimal

total = Decimal('15000000.00')
percent = total * Decimal('0.10')  # 10%
result = Decimal('1500000.00')     # Precise calculation
```

### Null Budget Handling

```
Null Budget Scenarios:
═════════════════════

Scenario 1: All departments have budgets
Company (5M) → Operations (15M) → Sales (8M)
Total: 5M + 15M + 8M = 28M

Scenario 2: Some departments have None
Company (5M) → Operations (None) → Sales (8M)
Total: 5M + 0 + 8M = 13M  # None treated as 0

Scenario 3: All None
Company (None) → Operations (None) → Sales (None)
Total: 0 + 0 + 0 = 0.00   # Return Decimal('0.00')

Coalesce Usage:
Coalesce(Sum('budget'), Decimal('0.00'))
  → If SUM returns NULL, use 0.00 instead
```

### Budget Breakdown Analysis

```
Detailed Budget Analysis:
════════════════════════

{
  "department": "Operations",
  "total_budget": "26000000.00",
  "currency": "LKR",
  "breakdown": {
    "direct": "15000000.00",        # Operations budget
    "descendants": "11000000.00",   # Children budgets
    "by_department": {
      "Operations": "15000000.00",
      "Sales": "8000000.00",
      "Support": "3000000.00"
    },
    "by_level": {
      "level_1": "15000000.00",     # Direct budget
      "level_2": "11000000.00"      # Children sum
    }
  },
  "percentage_of_total": "59.77%",  # Of company budget
  "avg_per_employee": "1040000.00"  # Total / employee count
}
```

### Budget Aggregation Variations

```
Different Aggregation Scenarios:
═══════════════════════════════

1. Total Allocated Budget (Default):
   Sum(budget) - All department budgets

2. Available Budget:
   Sum(budget) - Sum(actual_spent)

3. Budget Utilization:
   (Sum(actual_spent) / Sum(budget)) * 100

4. Variance Analysis:
   Sum(budget) - Sum(actual_spent)  # Over/under budget

5. Average Budget per Department:
   Sum(budget) / Count(departments)

6. Budget per Employee:
   Sum(budget) / Count(employees)
```

### Currency and Localization

```
Sri Lankan Rupee (LKR) Formatting:
═════════════════════════════════

Budget Value: Decimal('15000000.00')

Formatted Displays:
- Database: 15000000.00
- API JSON: "15000000.00"
- User Display: "Rs. 15,000,000.00"
- Short Form: "Rs. 15M"
- With Symbol: "රු 15,000,000.00"

Django Template:
{{ budget|floatformat:2|intcomma }} LKR
→ 15,000,000.00 LKR
```

### Expected Outcome
- Accurate budget aggregation
- Efficient MPTT-based queries
- Proper Decimal precision
- Null value handling
- Support for financial analysis

### Verification Checklist
- [ ] get_total_budget method implemented
- [ ] department_id parameter handled
- [ ] MPTT get_descendants used for subtree
- [ ] Sum aggregation with Coalesce applied
- [ ] Decimal precision maintained
- [ ] Null budgets handled gracefully
- [ ] Edge cases handled
- [ ] Currency documented
- [ ] Comprehensive docstring added

---

## Summary

This document established the core org chart service functionality:

### Completed Infrastructure
- ✅ OrgChartService class with service layer architecture
- ✅ Department tree query using django-mptt
- ✅ Employee tree query with recursive hierarchy
- ✅ JSON generation for frontend visualization
- ✅ Employee count aggregation across subtrees
- ✅ Budget aggregation with Decimal precision

### Key Achievements
1. **Service Layer** - Centralized org chart business logic
2. **MPTT Optimization** - Efficient tree queries (O(1) complexity)
3. **Hierarchy Traversal** - Support for both department and employee trees
4. **JSON API** - Frontend-ready data structure
5. **Aggregations** - Employee counts and budget calculations

### Next Steps
Proceed to [02_Tasks-51-56_Stats-Flatten-Path-Cache.md](02_Tasks-51-56_Stats-Flatten-Path-Cache.md) to implement department statistics, utility methods for flattening hierarchies, path traversal, subtree queries, reporting chains, and caching mechanisms.

---

**Document Status:** ✅ Complete  
**Total Tasks:** 6  
**Estimated Time:** 2 hours 45 minutes
