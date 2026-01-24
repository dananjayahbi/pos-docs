# Tasks 69-75: Serializers, ViewSets, and Filtering

> **Phase:** 06 - ERP Advanced Modules  
> **SubPhase:** 02 - Department & Designations  
> **Group:** F - API, Testing & Documentation  
> **Document:** 01 of 02  
> **Tasks Covered:** 69, 70, 71, 72, 73, 74, 75

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **→ Next Document:** [02_Tasks-76-78_URLs-Tests-Documentation.md](02_Tasks-76-78_URLs-Tests-Documentation.md)

---

## Document Overview

This document covers the creation of Django REST Framework serializers, viewsets, and filtering capabilities for the Organization module. These components provide a complete RESTful API for managing departments, designations, and organizational chart data.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 69 | Create DepartmentSerializer | Medium | 30 min |
| 70 | Create DesignationSerializer | Medium | 25 min |
| 71 | Create OrgChartSerializer | Medium | 25 min |
| 72 | Create DepartmentViewSet | High | 35 min |
| 73 | Create DesignationViewSet | Medium | 30 min |
| 74 | Create OrgChartView | Medium | 25 min |
| 75 | Implement Department Filtering | Medium | 25 min |

---

## Task 69: Create DepartmentSerializer

### Overview
Create the DepartmentSerializer to handle serialization of Department model data for API responses. This serializer includes nested relationships, computed fields for tree hierarchy information, and optimized querysets to prevent N+1 queries.

### Dependencies
- Department model exists
- Employee model exists
- Django REST Framework installed
- MPTT functionality configured

### Instructions

1. **Create serializers directory structure**
   - Navigate to `apps/organization/` directory
   - Create new directory named `serializers`
   - Create `__init__.py` in `serializers/` directory

2. **Create department_serializer.py file**
   - Create file at `apps/organization/serializers/department_serializer.py`
   - Import necessary DRF components

3. **Import required modules**
   - Import serializers from rest_framework
   - Import Department model
   - Import Employee model (for nested serialization)
   - Import timezone utilities

4. **Define nested ManagerSerializer**
   - Create lightweight serializer for manager field
   - Include: id, name (full_name), employee_id
   - Read-only serializer for nested representation

5. **Define nested ParentDepartmentSerializer**
   - Create lightweight serializer for parent department
   - Include: id, name, code
   - Read-only serializer for hierarchy display

6. **Define DepartmentSerializer class**
   - Inherit from serializers.ModelSerializer
   - Add serializer docstring explaining purpose

7. **Add nested field definitions**
   - parent field using ParentDepartmentSerializer (read-only)
   - manager field using ManagerSerializer (read-only)
   - Write operations accept IDs via separate fields

8. **Add computed fields**
   - employee_count (IntegerField, read-only)
   - children_count (IntegerField, read-only)
   - level (IntegerField, read-only, from MPTT)
   - path (ListField, read-only, list of ancestor names)

9. **Add writable ID fields**
   - parent_id (PrimaryKeyRelatedField, write-only, optional)
   - manager_id (PrimaryKeyRelatedField, write-only, optional)
   - Used for create/update operations

10. **Configure Meta class**
    - Set model = Department
    - Define fields list (all relevant fields)
    - Set read_only_fields (created_at, updated_at, level)
    - Add extra_kwargs for field customization

11. **Implement get_employee_count method**
    - Return count of employees in department
    - Use prefetched data if available
    - Fallback to query count

12. **Implement get_children_count method**
    - Return count of direct child departments
    - Use MPTT get_children() method
    - Consider caching for performance

13. **Implement get_path method**
    - Return list of ancestor department names
    - Use MPTT get_ancestors() method
    - Include current department in path

14. **Implement create method**
    - Extract parent_id and manager_id
    - Validate parent doesn't create circular reference
    - Create department with tenant context
    - Return created instance

15. **Implement update method**
    - Handle parent_id changes (department moves)
    - Handle manager_id changes
    - Validate changes don't break hierarchy
    - Update and return instance

16. **Update serializers/__init__.py**
    - Import DepartmentSerializer
    - Add to __all__ list

### DepartmentSerializer Structure

```
┌─────────────────────────────────────────────────┐
│         DepartmentSerializer                    │
├─────────────────────────────────────────────────┤
│ Nested Read-Only Fields:                        │
│  • parent (ParentDepartmentSerializer)          │
│  • manager (ManagerSerializer)                  │
│                                                 │
│ Computed Read-Only Fields:                      │
│  • employee_count (IntegerField)                │
│  • children_count (IntegerField)                │
│  • level (IntegerField)                         │
│  • path (ListField)                             │
│                                                 │
│ Write-Only Fields:                              │
│  • parent_id (PrimaryKeyRelatedField)           │
│  • manager_id (PrimaryKeyRelatedField)          │
│                                                 │
│ Standard Fields:                                │
│  • id, name, code, description                  │
│  • status, location                             │
│  • created_at, updated_at                       │
└─────────────────────────────────────────────────┘
```

### Serialization Examples

#### Department Detail Response
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "name": "Operations",
  "code": "DEPT-OPS",
  "description": "Operations department handling daily processes",
  "status": "ACTIVE",
  "parent": {
    "id": "550e8400-e29b-41d4-a716-446655440001",
    "name": "Company",
    "code": "DEPT-ROOT"
  },
  "manager": {
    "id": "660e8400-e29b-41d4-a716-446655440000",
    "name": "John Smith",
    "employee_id": "EMP-0001"
  },
  "location": "Building A, Floor 2",
  "employee_count": 45,
  "children_count": 3,
  "level": 1,
  "path": ["Company", "Operations"],
  "created_at": "2020-01-15T10:00:00Z",
  "updated_at": "2025-12-01T14:30:00Z"
}
```

#### Create/Update Request
```json
{
  "name": "Quality Assurance",
  "code": "DEPT-QA",
  "description": "Quality assurance and testing department",
  "parent_id": "550e8400-e29b-41d4-a716-446655440001",
  "manager_id": "660e8400-e29b-41d4-a716-446655440005",
  "location": "Building B, Floor 1",
  "status": "ACTIVE"
}
```

### Nested Serializers Structure

#### ManagerSerializer
```python
Fields:
- id (UUID)
- name (String, from full_name property)
- employee_id (String)
```

#### ParentDepartmentSerializer
```python
Fields:
- id (UUID)
- name (String)
- code (String)
```

### Computed Fields Logic

#### employee_count Calculation
```
Direct Approach:
department.employees.filter(status='ACTIVE').count()

Optimized (with prefetch):
len(department.employees.all())  # Uses prefetched data
```

#### children_count Calculation
```
MPTT Method:
department.get_children().count()

Or use cached count:
department.children_count (if cached in model)
```

#### path Generation
```
MPTT Ancestors:
ancestors = department.get_ancestors(include_self=True)
path = [ancestor.name for ancestor in ancestors]

Example Result:
["Company", "Operations", "Quality Assurance"]
```

### Validation Requirements

| Validation | Rule | Error Message |
|------------|------|---------------|
| Parent circular reference | Parent cannot be self or descendant | "Cannot set department as its own parent or descendant" |
| Manager existence | Manager must be active employee | "Manager must be an active employee" |
| Code uniqueness | Department code unique per tenant | "Department code already exists" |
| Status change | Cannot deactivate with active children | "Cannot deactivate department with active children" |

### Performance Optimization

```
QuerySet Optimization Strategy
═══════════════════════════════

1. Prefetch Related:
   departments = Department.objects.prefetch_related(
       'parent',
       'manager',
       'employees',
       'children'
   )

2. Select Related:
   departments = Department.objects.select_related(
       'parent',
       'manager'
   )

3. Annotate Counts:
   departments = Department.objects.annotate(
       employee_count=Count('employees'),
       children_count=Count('children')
   )
```

### Expected Outcome
- Functional DepartmentSerializer with nested data
- Efficient handling of tree hierarchy information
- Proper read/write field separation
- Optimized for API performance

### Verification Checklist
- [ ] department_serializer.py file created
- [ ] ManagerSerializer defined
- [ ] ParentDepartmentSerializer defined
- [ ] DepartmentSerializer class defined
- [ ] Nested read-only fields configured
- [ ] Computed fields (employee_count, children_count, level, path)
- [ ] Write-only ID fields (parent_id, manager_id)
- [ ] Meta class properly configured
- [ ] get_employee_count method implemented
- [ ] get_children_count method implemented
- [ ] get_path method implemented
- [ ] create method with validation
- [ ] update method with validation
- [ ] Serializer imported in __init__.py

---

## Task 70: Create DesignationSerializer

### Overview
Create the DesignationSerializer to handle serialization of Designation model data. This serializer includes nested department information, designation hierarchy, and salary range details formatted for API consumption.

### Dependencies
- Designation model exists
- Department model exists
- DepartmentSerializer completed (Task 69)
- Django REST Framework installed

### Instructions

1. **Create designation_serializer.py file**
   - Create file at `apps/organization/serializers/designation_serializer.py`
   - Import necessary DRF components

2. **Import required modules**
   - Import serializers from rest_framework
   - Import Designation model
   - Import Department model for nested serialization
   - Import related serializers

3. **Define nested DepartmentBasicSerializer**
   - Create lightweight serializer for department field
   - Include: id, name, code
   - Read-only serializer for nested representation

4. **Define nested ReportsToSerializer**
   - Create lightweight serializer for reports_to field
   - Include: id, title, code, level
   - Shows reporting designation hierarchy

5. **Define DesignationSerializer class**
   - Inherit from serializers.ModelSerializer
   - Add serializer docstring explaining purpose

6. **Add nested field definitions**
   - department field using DepartmentBasicSerializer (read-only)
   - reports_to field using ReportsToSerializer (read-only)
   - Write operations accept IDs via separate fields

7. **Add computed display fields**
   - level_display (CharField, read-only)
   - salary_range_display (CharField, read-only)
   - currency_display (CharField, read-only)

8. **Add computed count fields**
   - employee_count (IntegerField, read-only)
   - subordinate_designations_count (IntegerField, read-only)

9. **Add writable ID fields**
   - department_id (PrimaryKeyRelatedField, write-only, optional)
   - reports_to_id (PrimaryKeyRelatedField, write-only, optional)
   - Used for create/update operations

10. **Configure Meta class**
    - Set model = Designation
    - Define fields list (all relevant fields)
    - Set read_only_fields (created_at, updated_at)
    - Add extra_kwargs for field customization

11. **Implement get_level_display method**
    - Return human-readable level name
    - Use model's get_level_display() method
    - Format: "Entry Level", "Mid-Level", etc.

12. **Implement get_salary_range_display method**
    - Format salary range with currency
    - Handle null values gracefully
    - Format: "LKR 80,000 - 150,000"

13. **Implement get_employee_count method**
    - Return count of employees with this designation
    - Use prefetched data if available
    - Fallback to query count

14. **Implement get_subordinate_designations_count method**
    - Count designations that report to this one
    - Query designations with reports_to = current designation

15. **Implement create method**
    - Extract department_id and reports_to_id
    - Validate reports_to doesn't create circular reference
    - Validate salary ranges are logical
    - Create designation with tenant context
    - Return created instance

16. **Implement update method**
    - Handle department_id changes
    - Handle reports_to_id changes
    - Validate hierarchy changes
    - Update and return instance

17. **Update serializers/__init__.py**
    - Import DesignationSerializer
    - Add to __all__ list

### DesignationSerializer Structure

```
┌─────────────────────────────────────────────────┐
│         DesignationSerializer                   │
├─────────────────────────────────────────────────┤
│ Nested Read-Only Fields:                        │
│  • department (DepartmentBasicSerializer)       │
│  • reports_to (ReportsToSerializer)             │
│                                                 │
│ Computed Display Fields:                        │
│  • level_display (CharField)                    │
│  • salary_range_display (CharField)             │
│  • currency_display (CharField)                 │
│                                                 │
│ Computed Count Fields:                          │
│  • employee_count (IntegerField)                │
│  • subordinate_designations_count (IntegerField)│
│                                                 │
│ Write-Only Fields:                              │
│  • department_id (PrimaryKeyRelatedField)       │
│  • reports_to_id (PrimaryKeyRelatedField)       │
│                                                 │
│ Standard Fields:                                │
│  • id, title, code, level                       │
│  • description, min_salary, max_salary          │
│  • currency, experience_years, is_manager       │
│  • status, created_at, updated_at               │
└─────────────────────────────────────────────────┘
```

### Serialization Examples

#### Designation Detail Response
```json
{
  "id": "770e8400-e29b-41d4-a716-446655440000",
  "title": "Software Engineer",
  "code": "SE",
  "level": "MID",
  "level_display": "Mid-Level",
  "description": "Develops and maintains software applications",
  "department": {
    "id": "550e8400-e29b-41d4-a716-446655440001",
    "name": "Engineering",
    "code": "DEPT-ENG"
  },
  "min_salary": 80000.00,
  "max_salary": 150000.00,
  "salary_range_display": "LKR 80,000 - 150,000",
  "currency": "LKR",
  "currency_display": "Sri Lankan Rupee",
  "experience_years": 2,
  "is_manager": false,
  "reports_to": {
    "id": "770e8400-e29b-41d4-a716-446655440001",
    "title": "Senior Software Engineer",
    "code": "SSE",
    "level": "SENIOR"
  },
  "status": "ACTIVE",
  "employee_count": 15,
  "subordinate_designations_count": 2,
  "created_at": "2020-03-10T09:00:00Z",
  "updated_at": "2025-11-20T16:45:00Z"
}
```

#### Create/Update Request
```json
{
  "title": "Junior Software Engineer",
  "code": "JSE",
  "level": "JUNIOR",
  "description": "Entry-level software development position",
  "department_id": "550e8400-e29b-41d4-a716-446655440001",
  "min_salary": 50000.00,
  "max_salary": 80000.00,
  "currency": "LKR",
  "experience_years": 0,
  "is_manager": false,
  "reports_to_id": "770e8400-e29b-41d4-a716-446655440000",
  "status": "ACTIVE"
}
```

### Nested Serializers Structure

#### DepartmentBasicSerializer
```python
Fields:
- id (UUID)
- name (String)
- code (String)
```

#### ReportsToSerializer
```python
Fields:
- id (UUID)
- title (String)
- code (String)
- level (String choice)
```

### Display Field Formatting

#### Level Display Mapping
```python
Level Choices → Display Names:
ENTRY → "Entry Level"
JUNIOR → "Junior Level"
MID → "Mid-Level"
SENIOR → "Senior Level"
LEAD → "Lead Level"
MANAGER → "Manager"
DIRECTOR → "Director"
EXECUTIVE → "Executive"
```

#### Salary Range Display
```python
Format Examples:
min_salary=80000, max_salary=150000, currency=LKR
→ "LKR 80,000 - 150,000"

min_salary=None, max_salary=None
→ "Not specified"

min_salary=80000, max_salary=None
→ "LKR 80,000+"
```

### Validation Requirements

| Validation | Rule | Error Message |
|------------|------|---------------|
| Reports-to circular | Cannot report to self or subordinate | "Circular reporting structure detected" |
| Salary range logic | min_salary <= max_salary | "Minimum salary cannot exceed maximum" |
| Code uniqueness | Designation code unique per tenant | "Designation code already exists" |
| Department validity | Department must be active | "Cannot assign to inactive department" |
| Experience years | Must be non-negative | "Experience years cannot be negative" |

### Reporting Hierarchy Examples

```
Designation Hierarchy
════════════════════

CTO (Executive)
└── Engineering Director (Director)
    ├── Senior Engineering Manager (Manager)
    │   ├── Senior Software Engineer (Senior)
    │   │   ├── Software Engineer (Mid)  ← Current
    │   │   │   └── Junior Software Engineer (Junior)
    │   │   └── Software Engineer (Mid)
    │   └── Senior Software Engineer (Senior)
    └── Senior Engineering Manager (Manager)
```

### Expected Outcome
- Functional DesignationSerializer with nested data
- Formatted display fields for better UX
- Proper designation hierarchy representation
- Salary information clearly presented

### Verification Checklist
- [ ] designation_serializer.py file created
- [ ] DepartmentBasicSerializer defined
- [ ] ReportsToSerializer defined
- [ ] DesignationSerializer class defined
- [ ] Nested read-only fields configured
- [ ] Display fields (level_display, salary_range_display)
- [ ] Count fields (employee_count, subordinate_designations_count)
- [ ] Write-only ID fields (department_id, reports_to_id)
- [ ] Meta class properly configured
- [ ] get_level_display method implemented
- [ ] get_salary_range_display method implemented
- [ ] get_employee_count method implemented
- [ ] get_subordinate_designations_count method implemented
- [ ] create method with validation
- [ ] update method with validation
- [ ] Serializer imported in __init__.py

---

## Task 71: Create OrgChartSerializer

### Overview
Create the OrgChartSerializer to generate hierarchical organizational chart data in JSON format. This serializer recursively structures department and employee data for visualization in org chart components, supporting both department-based and employee-based chart types.

### Dependencies
- Department model exists
- Employee model exists
- DepartmentSerializer completed (Task 69)
- MPTT functionality configured

### Instructions

1. **Create orgchart_serializer.py file**
   - Create file at `apps/organization/serializers/orgchart_serializer.py`
   - Import necessary DRF components

2. **Import required modules**
   - Import serializers from rest_framework
   - Import Department and Employee models
   - Import timezone utilities
   - Import tree-building utilities

3. **Define EmployeeNodeSerializer**
   - Lightweight serializer for employee nodes
   - Include: id, name, employee_id, designation, avatar_url
   - Used in employee-based org charts

4. **Define DepartmentNodeSerializer**
   - Recursive serializer for department nodes
   - Include: id, name, code, manager, employee_count
   - Self-referential children field

5. **Define OrgChartSerializer class**
   - Main serializer for complete org chart structure
   - Not tied to a specific model
   - Accepts raw data (departments/employees)

6. **Add root-level fields**
   - chart_type (CharField: 'department' or 'employee')
   - generated_at (DateTimeField)
   - total_departments (IntegerField)
   - total_employees (IntegerField)
   - tenant_id (UUIDField)

7. **Add data fields**
   - root (DepartmentNodeSerializer or EmployeeNodeSerializer)
   - Dynamically selected based on chart_type

8. **Implement to_representation method**
   - Override to build hierarchical structure
   - Handle department-based chart generation
   - Handle employee-based chart generation
   - Include metadata

9. **Create build_department_tree method**
   - Recursively build department hierarchy
   - Include manager information
   - Include employee counts
   - Add children recursively

10. **Create build_employee_tree method**
    - Build employee reporting hierarchy
    - Start from top-level employees
    - Include direct reports recursively
    - Show designation information

11. **Create get_department_node_data method**
    - Extract relevant department data
    - Include computed fields
    - Format for frontend consumption

12. **Create get_employee_node_data method**
    - Extract relevant employee data
    - Include designation and department
    - Format for visualization

13. **Add filtering capabilities**
    - Support filtering by department (subtree only)
    - Support filtering by status
    - Support depth limiting

14. **Update serializers/__init__.py**
    - Import OrgChartSerializer
    - Add to __all__ list

### OrgChartSerializer Structure

```
┌─────────────────────────────────────────────────┐
│           OrgChartSerializer                    │
├─────────────────────────────────────────────────┤
│ Metadata Fields:                                │
│  • chart_type (CharField)                       │
│  • generated_at (DateTimeField)                 │
│  • total_departments (IntegerField)             │
│  • total_employees (IntegerField)               │
│  • tenant_id (UUIDField)                        │
│                                                 │
│ Data Fields:                                    │
│  • root (DepartmentNodeSerializer or            │
│           EmployeeNodeSerializer)               │
│                                                 │
│ Node Serializers:                               │
│  • DepartmentNodeSerializer (recursive)         │
│  • EmployeeNodeSerializer (recursive)           │
└─────────────────────────────────────────────────┘
```

### Department-Based Org Chart Example

```json
{
  "chart_type": "department",
  "generated_at": "2026-01-17T10:30:00Z",
  "total_departments": 25,
  "total_employees": 150,
  "tenant_id": "440e8400-e29b-41d4-a716-446655440000",
  "root": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "name": "LankaCommerce Pvt Ltd",
    "code": "DEPT-ROOT",
    "level": 0,
    "manager": {
      "id": "660e8400-e29b-41d4-a716-446655440000",
      "name": "Jane Doe",
      "employee_id": "EMP-0001",
      "designation": "CEO"
    },
    "employee_count": 5,
    "status": "ACTIVE",
    "children": [
      {
        "id": "550e8400-e29b-41d4-a716-446655440001",
        "name": "Engineering",
        "code": "DEPT-ENG",
        "level": 1,
        "manager": {
          "id": "660e8400-e29b-41d4-a716-446655440001",
          "name": "John Smith",
          "employee_id": "EMP-0002",
          "designation": "CTO"
        },
        "employee_count": 45,
        "status": "ACTIVE",
        "children": [
          {
            "id": "550e8400-e29b-41d4-a716-446655440002",
            "name": "Software Development",
            "code": "DEPT-DEV",
            "level": 2,
            "manager": {
              "id": "660e8400-e29b-41d4-a716-446655440002",
              "name": "Alice Johnson",
              "employee_id": "EMP-0003",
              "designation": "Development Manager"
            },
            "employee_count": 30,
            "status": "ACTIVE",
            "children": []
          }
        ]
      },
      {
        "id": "550e8400-e29b-41d4-a716-446655440003",
        "name": "Sales",
        "code": "DEPT-SALES",
        "level": 1,
        "manager": {
          "id": "660e8400-e29b-41d4-a716-446655440003",
          "name": "Bob Williams",
          "employee_id": "EMP-0004",
          "designation": "Sales Director"
        },
        "employee_count": 25,
        "status": "ACTIVE",
        "children": []
      }
    ]
  }
}
```

### Employee-Based Org Chart Example

```json
{
  "chart_type": "employee",
  "generated_at": "2026-01-17T10:30:00Z",
  "total_departments": 25,
  "total_employees": 150,
  "tenant_id": "440e8400-e29b-41d4-a716-446655440000",
  "root": {
    "id": "660e8400-e29b-41d4-a716-446655440000",
    "name": "Jane Doe",
    "employee_id": "EMP-0001",
    "designation": {
      "id": "770e8400-e29b-41d4-a716-446655440000",
      "title": "CEO",
      "level": "EXECUTIVE"
    },
    "department": {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "name": "Executive",
      "code": "DEPT-EXEC"
    },
    "avatar_url": "/media/avatars/jane_doe.jpg",
    "email": "jane.doe@example.com",
    "status": "ACTIVE",
    "direct_reports": [
      {
        "id": "660e8400-e29b-41d4-a716-446655440001",
        "name": "John Smith",
        "employee_id": "EMP-0002",
        "designation": {
          "id": "770e8400-e29b-41d4-a716-446655440001",
          "title": "CTO",
          "level": "EXECUTIVE"
        },
        "department": {
          "id": "550e8400-e29b-41d4-a716-446655440001",
          "name": "Engineering",
          "code": "DEPT-ENG"
        },
        "avatar_url": "/media/avatars/john_smith.jpg",
        "email": "john.smith@example.com",
        "status": "ACTIVE",
        "direct_reports": [...]
      }
    ]
  }
}
```

### Chart Type Comparison

| Feature | Department-Based | Employee-Based |
|---------|------------------|----------------|
| Root Node | Top department | Top employee (CEO) |
| Hierarchy | Department parent/child | Employee reporting line |
| Node Count | Department count | Employee count |
| Use Case | Org structure view | Reporting chain view |
| Visual Type | Department boxes | Employee cards |

### Recursive Tree Building

```
Department Tree Algorithm
═════════════════════════

function build_department_tree(department, max_depth):
    node = {
        id: department.id,
        name: department.name,
        ...
    }
    
    if max_depth > 0:
        children = department.get_children()
        node.children = [
            build_department_tree(child, max_depth - 1)
            for child in children
        ]
    
    return node
```

```
Employee Tree Algorithm
═══════════════════════

function build_employee_tree(employee, max_depth):
    node = {
        id: employee.id,
        name: employee.full_name,
        ...
    }
    
    if max_depth > 0:
        reports = employee.direct_reports.all()
        node.direct_reports = [
            build_employee_tree(report, max_depth - 1)
            for report in reports
        ]
    
    return node
```

### Query Optimization

```
Optimization Strategy
════════════════════

Department-Based Chart:
- Use MPTT get_descendants()
- Prefetch managers
- Annotate employee counts
- Select related parent

Employee-Based Chart:
- Prefetch related reports_to chain
- Select related designation
- Select related department
- Prefetch direct_reports
```

### Filtering Options

| Filter | Parameter | Effect |
|--------|-----------|--------|
| Department subtree | department_id | Only show specified dept + descendants |
| Max depth | max_depth | Limit tree depth (performance) |
| Status filter | status | Only active/inactive depts/employees |
| Include archived | include_archived | Show archived items |

### Expected Outcome
- Hierarchical JSON structure for org charts
- Support for both department and employee views
- Optimized recursive data building
- Flexible filtering capabilities

### Verification Checklist
- [ ] orgchart_serializer.py file created
- [ ] EmployeeNodeSerializer defined
- [ ] DepartmentNodeSerializer defined (recursive)
- [ ] OrgChartSerializer class defined
- [ ] Metadata fields configured
- [ ] to_representation method overridden
- [ ] build_department_tree method implemented
- [ ] build_employee_tree method implemented
- [ ] get_department_node_data method implemented
- [ ] get_employee_node_data method implemented
- [ ] Filtering capabilities added
- [ ] Query optimization implemented
- [ ] Serializer imported in __init__.py

---

## Task 72: Create DepartmentViewSet

### Overview
Create the DepartmentViewSet providing CRUD operations and custom actions for department management. This viewset includes standard operations plus specialized actions for tree manipulation (move, merge), bulk operations, and hierarchy queries.

### Dependencies
- DepartmentSerializer completed (Task 69)
- Department model with services
- Django REST Framework installed
- Permissions system configured

### Instructions

1. **Create views directory structure**
   - Navigate to `apps/organization/` directory
   - Create new directory named `views`
   - Create `__init__.py` in `views/` directory

2. **Create department_viewset.py file**
   - Create file at `apps/organization/views/department_viewset.py`
   - Import necessary DRF components

3. **Import required modules**
   - Import viewsets from rest_framework
   - Import response, status from rest_framework
   - Import action decorator
   - Import DepartmentSerializer
   - Import Department model and services
   - Import permission classes

4. **Define DepartmentViewSet class**
   - Inherit from viewsets.ModelViewSet
   - Add viewset docstring explaining purpose

5. **Configure viewset attributes**
   - Set queryset with optimizations
   - Set serializer_class = DepartmentSerializer
   - Set permission_classes (IsAuthenticated, appropriate permissions)
   - Set filter_backends (will be configured in Task 75)
   - Set search_fields (name, code, description)
   - Set ordering_fields (name, code, created_at)
   - Set ordering default

6. **Override get_queryset method**
   - Filter by tenant automatically
   - Apply prefetch_related for optimization
   - Apply select_related for parent/manager
   - Annotate with employee_count, children_count

7. **Override perform_create method**
   - Inject tenant from request
   - Call department creation service
   - Handle validation errors
   - Return appropriate response

8. **Override perform_update method**
   - Validate update permissions
   - Call department update service
   - Handle parent changes via service
   - Return appropriate response

9. **Override perform_destroy method**
   - Implement soft delete (archive)
   - Validate no active children exist
   - Call archive service
   - Return appropriate response

10. **Add tree action**
    - @action(detail=True, methods=['get'])
    - Return department with full subtree
    - Use MPPT get_descendants(include_self=True)
    - Serialize with nested structure

11. **Add employees action**
    - @action(detail=True, methods=['get'])
    - Return all employees in department
    - Include paginated response
    - Filter by active status

12. **Add children action**
    - @action(detail=True, methods=['get'])
    - Return direct children only
    - Use MPTT get_children()
    - Serialize department list

13. **Add path action**
    - @action(detail=True, methods=['get'])
    - Return path from root to current department
    - Use MPTT get_ancestors(include_self=True)
    - Format as breadcrumb data

14. **Add move action**
    - @action(detail=True, methods=['post'])
    - Move department to new parent
    - Validate circular reference
    - Call department move service
    - Return updated department

15. **Add merge action**
    - @action(detail=True, methods=['post'])
    - Merge department into target
    - Move all employees and children
    - Call department merge service
    - Archive source department

16. **Add archive action**
    - @action(detail=True, methods=['post'])
    - Archive department (soft delete)
    - Archive all children recursively
    - Call archive service
    - Return success response

17. **Add activate action**
    - @action(detail=True, methods=['post'])
    - Activate archived department
    - Validate parent is active
    - Call activate service
    - Return success response

18. **Update views/__init__.py**
    - Import DepartmentViewSet
    - Add to __all__ list

### DepartmentViewSet Structure

```
┌─────────────────────────────────────────────────┐
│           DepartmentViewSet                     │
├─────────────────────────────────────────────────┤
│ Standard Actions:                               │
│  • list() - List all departments                │
│  • create() - Create new department             │
│  • retrieve() - Get department detail           │
│  • update() - Update department                 │
│  • partial_update() - Partial update            │
│  • destroy() - Archive department               │
│                                                 │
│ Custom Actions:                                 │
│  • tree() - Get department subtree              │
│  • employees() - Get department employees       │
│  • children() - Get direct children             │
│  • path() - Get path to root                    │
│  • move() - Move to new parent                  │
│  • merge() - Merge with another department      │
│  • archive() - Archive department               │
│  • activate() - Activate archived department    │
└─────────────────────────────────────────────────┘
```

### ViewSet Actions Detail

#### Standard CRUD Actions

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /departments/ | List all departments (paginated, filtered) |
| POST | /departments/ | Create new department |
| GET | /departments/{id}/ | Get single department details |
| PUT | /departments/{id}/ | Full update of department |
| PATCH | /departments/{id}/ | Partial update of department |
| DELETE | /departments/{id}/ | Archive department (soft delete) |

#### Custom Actions

| Method | Endpoint | Description | Parameters |
|--------|----------|-------------|------------|
| GET | /departments/{id}/tree/ | Get subtree | max_depth (optional) |
| GET | /departments/{id}/employees/ | Get employees | status (optional), paginated |
| GET | /departments/{id}/children/ | Direct children | - |
| GET | /departments/{id}/path/ | Path to root | - |
| POST | /departments/{id}/move/ | Move department | new_parent_id |
| POST | /departments/{id}/merge/ | Merge department | target_department_id |
| POST | /departments/{id}/archive/ | Archive department | recursive (default: true) |
| POST | /departments/{id}/activate/ | Activate department | - |

### Action Implementation Examples

#### Tree Action Response
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440001",
  "name": "Engineering",
  "children": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440002",
      "name": "Software Development",
      "children": [
        {
          "id": "550e8400-e29b-41d4-a716-446655440003",
          "name": "Frontend Team",
          "children": []
        }
      ]
    }
  ]
}
```

#### Employees Action Response
```json
{
  "count": 45,
  "next": null,
  "previous": null,
  "results": [
    {
      "id": "660e8400-e29b-41d4-a716-446655440010",
      "name": "John Doe",
      "employee_id": "EMP-0010",
      "designation": "Software Engineer",
      "status": "ACTIVE"
    }
  ]
}
```

#### Path Action Response
```json
{
  "path": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "name": "Company",
      "code": "DEPT-ROOT",
      "level": 0
    },
    {
      "id": "550e8400-e29b-41d4-a716-446655440001",
      "name": "Engineering",
      "code": "DEPT-ENG",
      "level": 1
    },
    {
      "id": "550e8400-e29b-41d4-a716-446655440002",
      "name": "Software Development",
      "code": "DEPT-DEV",
      "level": 2
    }
  ]
}
```

#### Move Action Request/Response
```json
Request:
{
  "new_parent_id": "550e8400-e29b-41d4-a716-446655440005"
}

Response:
{
  "id": "550e8400-e29b-41d4-a716-446655440002",
  "name": "Software Development",
  "parent": {
    "id": "550e8400-e29b-41d4-a716-446655440005",
    "name": "Operations",
    "code": "DEPT-OPS"
  },
  "message": "Department moved successfully"
}
```

#### Merge Action Request/Response
```json
Request:
{
  "target_department_id": "550e8400-e29b-41d4-a716-446655440006",
  "transfer_employees": true,
  "transfer_children": true
}

Response:
{
  "message": "Department merged successfully",
  "source_department_id": "550e8400-e29b-41d4-a716-446655440002",
  "target_department_id": "550e8400-e29b-41d4-a716-446655440006",
  "employees_transferred": 15,
  "children_transferred": 2
}
```

### QuerySet Optimization

```python
Optimized QuerySet Structure
════════════════════════════

queryset = Department.objects.select_related(
    'parent',
    'manager',
    'manager__designation'
).prefetch_related(
    'employees',
    'children'
).annotate(
    employee_count=Count('employees', filter=Q(employees__status='ACTIVE')),
    children_count=Count('children', filter=Q(children__status='ACTIVE'))
).filter(
    tenant=request.tenant
)
```

### Permission Requirements

| Action | Permission | Additional Check |
|--------|------------|------------------|
| list | organization.view_department | Tenant filter |
| retrieve | organization.view_department | Tenant match |
| create | organization.add_department | Valid parent |
| update | organization.change_department | Tenant match |
| destroy | organization.delete_department | No active children |
| move | organization.change_department | No circular ref |
| merge | organization.delete_department | Both owned by tenant |
| archive | organization.delete_department | No active children |
| activate | organization.change_department | Parent active |

### Expected Outcome
- Full CRUD functionality for departments
- Tree manipulation capabilities
- Custom actions for hierarchy operations
- Proper permission enforcement
- Optimized queries

### Verification Checklist
- [ ] department_viewset.py file created
- [ ] DepartmentViewSet class defined
- [ ] Viewset attributes configured
- [ ] get_queryset method overridden
- [ ] perform_create method overridden
- [ ] perform_update method overridden
- [ ] perform_destroy method overridden
- [ ] tree action implemented
- [ ] employees action implemented
- [ ] children action implemented
- [ ] path action implemented
- [ ] move action implemented
- [ ] merge action implemented
- [ ] archive action implemented
- [ ] activate action implemented
- [ ] ViewSet imported in __init__.py

---

## Task 73: Create DesignationViewSet

### Overview
Create the DesignationViewSet providing CRUD operations for designation management. This viewset includes standard operations plus custom actions for querying designations by level, viewing employees with a designation, and managing designation hierarchy.

### Dependencies
- DesignationSerializer completed (Task 70)
- Designation model with services
- Django REST Framework installed
- Permissions system configured

### Instructions

1. **Create designation_viewset.py file**
   - Create file at `apps/organization/views/designation_viewset.py`
   - Import necessary DRF components

2. **Import required modules**
   - Import viewsets from rest_framework
   - Import response, status from rest_framework
   - Import action decorator
   - Import DesignationSerializer
   - Import Designation model and services
   - Import permission classes

3. **Define DesignationViewSet class**
   - Inherit from viewsets.ModelViewSet
   - Add viewset docstring explaining purpose

4. **Configure viewset attributes**
   - Set queryset with optimizations
   - Set serializer_class = DesignationSerializer
   - Set permission_classes (IsAuthenticated, appropriate permissions)
   - Set filter_backends (will be configured in Task 75)
   - Set search_fields (title, code, description)
   - Set ordering_fields (title, code, level, created_at)
   - Set ordering default

5. **Override get_queryset method**
   - Filter by tenant automatically
   - Apply select_related for department, reports_to
   - Annotate with employee_count
   - Order by level then title

6. **Override perform_create method**
   - Inject tenant from request
   - Call designation creation service
   - Validate salary ranges
   - Return appropriate response

7. **Override perform_update method**
   - Validate update permissions
   - Call designation update service
   - Handle reports_to changes
   - Return appropriate response

8. **Override perform_destroy method**
   - Implement soft delete (deactivate)
   - Validate no employees assigned
   - Call deactivate service
   - Return appropriate response

9. **Add employees action**
   - @action(detail=True, methods=['get'])
   - Return all employees with this designation
   - Include paginated response
   - Filter by status

10. **Add by_level action**
    - @action(detail=False, methods=['get'])
    - Accept level parameter
    - Return all designations at specified level
    - Use for level-based filtering

11. **Add hierarchy action**
    - @action(detail=True, methods=['get'])
    - Return reporting hierarchy
    - Show designations that report to this one
    - Include subordinate counts

12. **Add activate action**
    - @action(detail=True, methods=['post'])
    - Activate deactivated designation
    - Validate department is active
    - Return success response

13. **Add deactivate action**
    - @action(detail=True, methods=['post'])
    - Deactivate designation
    - Validate no active employees
    - Return success response

14. **Update views/__init__.py**
    - Import DesignationViewSet
    - Add to __all__ list

### DesignationViewSet Structure

```
┌─────────────────────────────────────────────────┐
│          DesignationViewSet                     │
├─────────────────────────────────────────────────┤
│ Standard Actions:                               │
│  • list() - List all designations               │
│  • create() - Create new designation            │
│  • retrieve() - Get designation detail          │
│  • update() - Update designation                │
│  • partial_update() - Partial update            │
│  • destroy() - Deactivate designation           │
│                                                 │
│ Custom Actions:                                 │
│  • employees() - Get employees                  │
│  • by_level() - Get by level                    │
│  • hierarchy() - Get reporting hierarchy        │
│  • activate() - Activate designation            │
│  • deactivate() - Deactivate designation        │
└─────────────────────────────────────────────────┘
```

### ViewSet Actions Detail

#### Standard CRUD Actions

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /designations/ | List all designations (paginated, filtered) |
| POST | /designations/ | Create new designation |
| GET | /designations/{id}/ | Get single designation details |
| PUT | /designations/{id}/ | Full update of designation |
| PATCH | /designations/{id}/ | Partial update of designation |
| DELETE | /designations/{id}/ | Deactivate designation |

#### Custom Actions

| Method | Endpoint | Description | Parameters |
|--------|----------|-------------|------------|
| GET | /designations/{id}/employees/ | Get employees | status (optional), paginated |
| GET | /designations/by-level/{level}/ | Get by level | level (ENTRY, JUNIOR, MID, etc.) |
| GET | /designations/{id}/hierarchy/ | Reporting hierarchy | max_depth (optional) |
| POST | /designations/{id}/activate/ | Activate designation | - |
| POST | /designations/{id}/deactivate/ | Deactivate designation | force (optional) |

### Action Implementation Examples

#### Employees Action Response
```json
{
  "count": 15,
  "next": null,
  "previous": null,
  "results": [
    {
      "id": "660e8400-e29b-41d4-a716-446655440020",
      "name": "Alice Smith",
      "employee_id": "EMP-0020",
      "designation": {
        "id": "770e8400-e29b-41d4-a716-446655440000",
        "title": "Software Engineer",
        "code": "SE"
      },
      "department": {
        "id": "550e8400-e29b-41d4-a716-446655440002",
        "name": "Software Development"
      },
      "status": "ACTIVE"
    }
  ]
}
```

#### By Level Action Response
```json
{
  "level": "MID",
  "level_display": "Mid-Level",
  "count": 8,
  "designations": [
    {
      "id": "770e8400-e29b-41d4-a716-446655440000",
      "title": "Software Engineer",
      "code": "SE",
      "department": {
        "id": "550e8400-e29b-41d4-a716-446655440002",
        "name": "Software Development"
      },
      "employee_count": 15,
      "status": "ACTIVE"
    },
    {
      "id": "770e8400-e29b-41d4-a716-446655440005",
      "title": "Marketing Specialist",
      "code": "MS",
      "department": {
        "id": "550e8400-e29b-41d4-a716-446655440010",
        "name": "Marketing"
      },
      "employee_count": 8,
      "status": "ACTIVE"
    }
  ]
}
```

#### Hierarchy Action Response
```json
{
  "designation": {
    "id": "770e8400-e29b-41d4-a716-446655440001",
    "title": "Senior Software Engineer",
    "code": "SSE",
    "level": "SENIOR"
  },
  "direct_subordinates": [
    {
      "id": "770e8400-e29b-41d4-a716-446655440000",
      "title": "Software Engineer",
      "code": "SE",
      "level": "MID",
      "employee_count": 15,
      "subordinates": [
        {
          "id": "770e8400-e29b-41d4-a716-446655440002",
          "title": "Junior Software Engineer",
          "code": "JSE",
          "level": "JUNIOR",
          "employee_count": 8,
          "subordinates": []
        }
      ]
    }
  ],
  "total_subordinate_designations": 2,
  "total_subordinate_employees": 23
}
```

### QuerySet Optimization

```python
Optimized QuerySet Structure
════════════════════════════

queryset = Designation.objects.select_related(
    'department',
    'reports_to',
    'reports_to__department'
).annotate(
    employee_count=Count('employees', filter=Q(employees__status='ACTIVE'))
).filter(
    tenant=request.tenant
).order_by('level', 'title')
```

### Level-Based Queries

```
Designation Level Hierarchy
═══════════════════════════

EXECUTIVE (8)
    └── CTO, CFO, COO

DIRECTOR (7)
    └── Engineering Director, Sales Director

MANAGER (6)
    └── Development Manager, Sales Manager

LEAD (5)
    └── Team Lead, Project Lead

SENIOR (4)
    └── Senior Software Engineer

MID (3)
    └── Software Engineer

JUNIOR (2)
    └── Junior Software Engineer

ENTRY (1)
    └── Intern, Trainee
```

### Validation Rules

| Validation | Rule | Error Message |
|------------|------|---------------|
| Reports-to validity | Must be higher level or manager | "Invalid reporting designation" |
| Salary logic | min_salary <= max_salary | "Invalid salary range" |
| Code uniqueness | Unique per tenant | "Designation code already exists" |
| Active employees | Cannot deactivate with active employees | "Designation has active employees" |
| Department validity | Department must be active | "Department is inactive" |

### Permission Requirements

| Action | Permission | Additional Check |
|--------|------------|------------------|
| list | organization.view_designation | Tenant filter |
| retrieve | organization.view_designation | Tenant match |
| create | organization.add_designation | Valid department |
| update | organization.change_designation | Tenant match |
| destroy | organization.delete_designation | No active employees |
| activate | organization.change_designation | Department active |
| deactivate | organization.delete_designation | No active employees |

### Expected Outcome
- Full CRUD functionality for designations
- Level-based querying capability
- Hierarchy visualization support
- Proper permission enforcement
- Optimized queries

### Verification Checklist
- [ ] designation_viewset.py file created
- [ ] DesignationViewSet class defined
- [ ] Viewset attributes configured
- [ ] get_queryset method overridden
- [ ] perform_create method overridden
- [ ] perform_update method overridden
- [ ] perform_destroy method overridden
- [ ] employees action implemented
- [ ] by_level action implemented
- [ ] hierarchy action implemented
- [ ] activate action implemented
- [ ] deactivate action implemented
- [ ] ViewSet imported in __init__.py

---

## Task 74: Create OrgChartView

### Overview
Create the OrgChartView APIView to generate and serve organizational chart data. This view provides endpoints for generating both department-based and employee-based org charts with filtering and customization options.

### Dependencies
- OrgChartSerializer completed (Task 71)
- Department and Employee models
- DepartmentViewSet and DesignationViewSet completed
- Django REST Framework installed

### Instructions

1. **Create orgchart_view.py file**
   - Create file at `apps/organization/views/orgchart_view.py`
   - Import necessary DRF components

2. **Import required modules**
   - Import APIView from rest_framework.views
   - Import Response from rest_framework.response
   - Import status from rest_framework
   - Import OrgChartSerializer
   - Import Department, Employee models
   - Import permission classes

3. **Define OrgChartView class**
   - Inherit from APIView
   - Add view docstring explaining purpose

4. **Configure view attributes**
   - Set permission_classes (IsAuthenticated)
   - Add allowed methods documentation

5. **Implement get method**
   - Accept query parameters (chart_type, department_id, employee_id, max_depth, status)
   - Determine chart type (default to 'department')
   - Call appropriate chart generation method
   - Return serialized response

6. **Create generate_department_chart method**
   - Accept department_id parameter (optional, defaults to root)
   - Accept max_depth parameter (default 10)
   - Query departments with optimizations
   - Build hierarchical structure
   - Return chart data dictionary

7. **Create generate_employee_chart method**
   - Accept employee_id parameter (optional, defaults to top employee)
   - Accept max_depth parameter (default 10)
   - Query employees with reporting relationships
   - Build hierarchical structure
   - Return chart data dictionary

8. **Create get_root_department method**
   - Find tenant's root department (parent=None)
   - Handle case where multiple roots exist
   - Return root department instance

9. **Create get_top_employee method**
   - Find top employee (reports_to=None)
   - Handle case where multiple top employees exist
   - Return top employee instance

10. **Add filtering logic**
    - Filter by status (ACTIVE, INACTIVE, ALL)
    - Filter by specific department subtree
    - Filter by specific employee reporting chain

11. **Add caching considerations**
    - Document cache key structure
    - Add cache invalidation notes
    - Consider Redis cache for large orgs

12. **Update views/__init__.py**
    - Import OrgChartView
    - Add to __all__ list

### OrgChartView Structure

```
┌─────────────────────────────────────────────────┐
│             OrgChartView                        │
├─────────────────────────────────────────────────┤
│ HTTP Methods:                                   │
│  • GET - Generate org chart                     │
│                                                 │
│ Query Parameters:                               │
│  • chart_type - 'department' or 'employee'      │
│  • department_id - Start from specific dept     │
│  • employee_id - Start from specific employee   │
│  • max_depth - Limit tree depth                 │
│  • status - Filter by status                    │
│  • include_archived - Include archived items    │
│                                                 │
│ Methods:                                        │
│  • get() - Main handler                         │
│  • generate_department_chart()                  │
│  • generate_employee_chart()                    │
│  • get_root_department()                        │
│  • get_top_employee()                           │
└─────────────────────────────────────────────────┘
```

### API Endpoints

| Method | Endpoint | Description | Parameters |
|--------|----------|-------------|------------|
| GET | /orgchart/ | Full organization chart | chart_type, max_depth, status |
| GET | /orgchart/department/ | Department-based chart | department_id, max_depth, status |
| GET | /orgchart/employee/ | Employee-based chart | employee_id, max_depth, status |
| GET | /orgchart/employee/{id}/ | Chart from specific employee | max_depth |
| GET | /orgchart/reporting-chain/{id}/ | Employee's reporting chain | - |

### Request/Response Examples

#### Default Department Chart Request
```http
GET /api/v1/organization/orgchart/
```

Response:
```json
{
  "chart_type": "department",
  "generated_at": "2026-01-17T10:30:00Z",
  "total_departments": 25,
  "total_employees": 150,
  "tenant_id": "440e8400-e29b-41d4-a716-446655440000",
  "root": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "name": "LankaCommerce Pvt Ltd",
    "children": [...]
  }
}
```

#### Department Subtree Request
```http
GET /api/v1/organization/orgchart/department/?department_id=550e8400-e29b-41d4-a716-446655440001&max_depth=2
```

Response:
```json
{
  "chart_type": "department",
  "generated_at": "2026-01-17T10:30:00Z",
  "total_departments": 8,
  "total_employees": 45,
  "root": {
    "id": "550e8400-e29b-41d4-a716-446655440001",
    "name": "Engineering",
    "children": [...]  // Limited to 2 levels deep
  }
}
```

#### Employee Chart Request
```http
GET /api/v1/organization/orgchart/employee/?employee_id=660e8400-e29b-41d4-a716-446655440001
```

Response:
```json
{
  "chart_type": "employee",
  "generated_at": "2026-01-17T10:30:00Z",
  "total_departments": 25,
  "total_employees": 150,
  "root": {
    "id": "660e8400-e29b-41d4-a716-446655440001",
    "name": "John Smith",
    "employee_id": "EMP-0002",
    "designation": {"title": "CTO"},
    "direct_reports": [...]
  }
}
```

#### Reporting Chain Request
```http
GET /api/v1/organization/orgchart/reporting-chain/660e8400-e29b-41d4-a716-446655440020/
```

Response:
```json
{
  "employee": {
    "id": "660e8400-e29b-41d4-a716-446655440020",
    "name": "Alice Johnson",
    "employee_id": "EMP-0020"
  },
  "reporting_chain": [
    {
      "id": "660e8400-e29b-41d4-a716-446655440000",
      "name": "Jane Doe",
      "designation": "CEO",
      "level": 0
    },
    {
      "id": "660e8400-e29b-41d4-a716-446655440001",
      "name": "John Smith",
      "designation": "CTO",
      "level": 1
    },
    {
      "id": "660e8400-e29b-41d4-a716-446655440002",
      "name": "Bob Wilson",
      "designation": "Engineering Manager",
      "level": 2
    }
  ],
  "depth": 3
}
```

### Query Optimization Strategy

```python
Department Chart Optimization
═════════════════════════════

# Get root or specific department
if department_id:
    root = Department.objects.get(id=department_id, tenant=tenant)
else:
    root = Department.objects.filter(tenant=tenant, parent__isnull=True).first()

# Get all descendants
departments = root.get_descendants(include_self=True)

# Optimize queries
departments = departments.select_related(
    'parent',
    'manager',
    'manager__designation'
).prefetch_related(
    'employees',
    'children'
).annotate(
    employee_count=Count('employees', filter=Q(employees__status='ACTIVE'))
)

Employee Chart Optimization
═══════════════════════════

# Get top employee or specific employee
if employee_id:
    root = Employee.objects.get(id=employee_id, tenant=tenant)
else:
    root = Employee.objects.filter(
        tenant=tenant,
        reports_to__isnull=True,
        status='ACTIVE'
    ).first()

# Recursively prefetch all reporting relationships
employees = Employee.objects.filter(
    tenant=tenant,
    status='ACTIVE'
).select_related(
    'designation',
    'department',
    'reports_to'
).prefetch_related(
    'direct_reports',
    'direct_reports__designation',
    'direct_reports__department'
)
```

### Caching Strategy

```
Cache Key Structure
══════════════════

Key Format:
orgchart:{tenant_id}:{chart_type}:{root_id}:{max_depth}:{status}

Examples:
orgchart:440e8400:department:root:10:active
orgchart:440e8400:employee:660e8400:5:all

Cache TTL:
- 15 minutes for frequently accessed charts
- 1 hour for specific subtrees
- Invalidate on department/employee changes
```

### Error Handling

| Error Case | Status Code | Response |
|------------|-------------|----------|
| Department not found | 404 | {"error": "Department not found"} |
| Employee not found | 404 | {"error": "Employee not found"} |
| Invalid chart_type | 400 | {"error": "Invalid chart type"} |
| Permission denied | 403 | {"error": "Permission denied"} |
| Max depth exceeded | 400 | {"error": "Max depth must be between 1 and 20"} |

### Expected Outcome
- Functional org chart generation API
- Support for both chart types
- Flexible filtering and customization
- Optimized query performance
- Optional caching support

### Verification Checklist
- [ ] orgchart_view.py file created
- [ ] OrgChartView class defined
- [ ] permission_classes configured
- [ ] get method implemented
- [ ] generate_department_chart method implemented
- [ ] generate_employee_chart method implemented
- [ ] get_root_department method implemented
- [ ] get_top_employee method implemented
- [ ] Filtering logic added
- [ ] Error handling implemented
- [ ] Caching considerations documented
- [ ] View imported in __init__.py

---

## Task 75: Implement Department Filtering

### Overview
Implement comprehensive filtering capabilities for the Department API using django-filter. This includes filtering by status, parent department, manager, employee count, and text search across multiple fields.

### Dependencies
- DepartmentViewSet completed (Task 72)
- django-filter package installed
- Department model with all fields

### Instructions

1. **Install django-filter (if not installed)**
   - Add 'django-filter' to requirements
   - Add 'django_filters' to INSTALLED_APPS
   - Configure in settings

2. **Create filters.py file**
   - Create file at `apps/organization/filters.py`
   - Import necessary django-filter components

3. **Import required modules**
   - Import django_filters
   - Import Department and Designation models
   - Import Q objects for complex queries

4. **Define DepartmentFilter class**
   - Inherit from django_filters.FilterSet
   - Add filter docstring explaining purpose

5. **Add status filter**
   - ChoiceFilter based on status field
   - Support multiple status values
   - Default to active departments

6. **Add parent filter**
   - ModelChoiceFilter for parent department
   - Allow filtering by parent department ID
   - Support null parent (root departments)

7. **Add parent__isnull filter**
   - BooleanFilter for root departments
   - True returns departments with no parent
   - Useful for getting top-level departments

8. **Add manager filter**
   - ModelChoiceFilter for manager (Employee)
   - Filter departments by manager ID
   - Support null manager (no manager assigned)

9. **Add has_employees filter**
   - BooleanFilter for departments with employees
   - True returns departments with >= 1 employee
   - Requires annotation in queryset

10. **Add employee_count__gte filter**
    - NumberFilter for minimum employee count
    - Filter departments with at least N employees
    - Requires annotation in queryset

11. **Add employee_count__lte filter**
    - NumberFilter for maximum employee count
    - Filter departments with at most N employees
    - Requires annotation in queryset

12. **Add search filter**
    - CharFilter with custom method
    - Search across name, code, description
    - Use Q objects for OR queries

13. **Add level filter**
    - NumberFilter for MPTT level
    - Filter departments at specific tree depth
    - 0 = root, 1 = first level children, etc.

14. **Add created_at filters**
    - DateFilter for created_at__gte (from date)
    - DateFilter for created_at__lte (to date)
    - Support date range filtering

15. **Configure Meta class**
    - Set model = Department
    - Define fields list
    - Set filter overrides if needed

16. **Implement search_filter method**
    - Custom filter method for text search
    - Query name, code, description fields
    - Use icontains for case-insensitive search

17. **Define DesignationFilter class**
    - Similar structure to DepartmentFilter
    - Filter by level, department, status
    - Filter by salary range

18. **Update DepartmentViewSet**
    - Add DepartmentFilter to filter_backends
    - Set filterset_class = DepartmentFilter
    - Configure DjangoFilterBackend

19. **Update DesignationViewSet**
    - Add DesignationFilter to filter_backends
    - Set filterset_class = DesignationFilter
    - Configure DjangoFilterBackend

### Department Filter Structure

```
┌─────────────────────────────────────────────────┐
│          DepartmentFilter                       │
├─────────────────────────────────────────────────┤
│ Basic Filters:                                  │
│  • status - ChoiceFilter                        │
│  • parent - ModelChoiceFilter                   │
│  • parent__isnull - BooleanFilter               │
│  • manager - ModelChoiceFilter                  │
│  • level - NumberFilter                         │
│                                                 │
│ Count Filters:                                  │
│  • has_employees - BooleanFilter                │
│  • employee_count__gte - NumberFilter           │
│  • employee_count__lte - NumberFilter           │
│                                                 │
│ Search Filters:                                 │
│  • search - CharFilter (custom method)          │
│                                                 │
│ Date Filters:                                   │
│  • created_at__gte - DateFilter                 │
│  • created_at__lte - DateFilter                 │
└─────────────────────────────────────────────────┘
```

### Filter Usage Examples

#### Filter by Status
```http
GET /api/v1/organization/departments/?status=ACTIVE
```

#### Filter Root Departments
```http
GET /api/v1/organization/departments/?parent__isnull=true
```

#### Filter by Parent Department
```http
GET /api/v1/organization/departments/?parent=550e8400-e29b-41d4-a716-446655440001
```

#### Filter by Manager
```http
GET /api/v1/organization/departments/?manager=660e8400-e29b-41d4-a716-446655440005
```

#### Filter Departments with Employees
```http
GET /api/v1/organization/departments/?has_employees=true
```

#### Filter by Employee Count Range
```http
GET /api/v1/organization/departments/?employee_count__gte=10&employee_count__lte=50
```

#### Text Search
```http
GET /api/v1/organization/departments/?search=engineering
```

#### Filter by Tree Level
```http
GET /api/v1/organization/departments/?level=1
```

#### Filter by Date Range
```http
GET /api/v1/organization/departments/?created_at__gte=2025-01-01&created_at__lte=2025-12-31
```

#### Combined Filters
```http
GET /api/v1/organization/departments/?status=ACTIVE&has_employees=true&level=1&search=sales
```

### Designation Filter Structure

```
┌─────────────────────────────────────────────────┐
│         DesignationFilter                       │
├─────────────────────────────────────────────────┤
│ Basic Filters:                                  │
│  • status - ChoiceFilter                        │
│  • level - ChoiceFilter                         │
│  • department - ModelChoiceFilter               │
│  • reports_to - ModelChoiceFilter               │
│  • is_manager - BooleanFilter                   │
│                                                 │
│ Salary Filters:                                 │
│  • min_salary__gte - NumberFilter               │
│  • min_salary__lte - NumberFilter               │
│  • max_salary__gte - NumberFilter               │
│  • max_salary__lte - NumberFilter               │
│  • currency - ChoiceFilter                      │
│                                                 │
│ Experience Filter:                              │
│  • experience_years__gte - NumberFilter         │
│  • experience_years__lte - NumberFilter         │
│                                                 │
│ Search Filters:                                 │
│  • search - CharFilter (custom method)          │
└─────────────────────────────────────────────────┘
```

### Designation Filter Examples

#### Filter by Level
```http
GET /api/v1/organization/designations/?level=MID
```

#### Filter by Department
```http
GET /api/v1/organization/designations/?department=550e8400-e29b-41d4-a716-446655440002
```

#### Filter Manager Positions
```http
GET /api/v1/organization/designations/?is_manager=true
```

#### Filter by Salary Range
```http
GET /api/v1/organization/designations/?min_salary__gte=80000&max_salary__lte=200000
```

#### Filter by Experience
```http
GET /api/v1/organization/designations/?experience_years__gte=3
```

#### Combined Designation Filters
```http
GET /api/v1/organization/designations/?level=MID&is_manager=false&min_salary__gte=80000&status=ACTIVE
```

### Filter Implementation Details

#### Search Filter Implementation
```python
def search_filter(self, queryset, name, value):
    """
    Search across multiple fields using OR logic
    """
    if not value:
        return queryset
    
    return queryset.filter(
        Q(name__icontains=value) |
        Q(code__icontains=value) |
        Q(description__icontains=value) |
        Q(location__icontains=value)
    )
```

#### Has Employees Filter
```python
has_employees = django_filters.BooleanFilter(
    method='filter_has_employees',
    label='Has Employees'
)

def filter_has_employees(self, queryset, name, value):
    if value:
        return queryset.filter(employee_count__gt=0)
    return queryset.filter(employee_count=0)
```

### ViewSet Configuration

```python
Department ViewSet Configuration
════════════════════════════════

from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter

class DepartmentViewSet(viewsets.ModelViewSet):
    filter_backends = [
        DjangoFilterBackend,
        SearchFilter,
        OrderingFilter
    ]
    filterset_class = DepartmentFilter
    search_fields = ['name', 'code', 'description']
    ordering_fields = ['name', 'code', 'created_at', 'level']
    ordering = ['level', 'name']
```

### Filter Response Examples

#### Filtered List Response
```json
{
  "count": 12,
  "next": null,
  "previous": null,
  "results": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440001",
      "name": "Engineering",
      "status": "ACTIVE",
      "employee_count": 45,
      "level": 1
    }
  ],
  "filters_applied": {
    "status": "ACTIVE",
    "has_employees": true,
    "level": 1
  }
}
```

### Expected Outcome
- Comprehensive filtering for departments
- Filtering for designations
- Text search across multiple fields
- Combined filter support
- Clean filter API

### Verification Checklist
- [ ] filters.py file created
- [ ] DepartmentFilter class defined
- [ ] status filter added
- [ ] parent filters added
- [ ] manager filter added
- [ ] employee count filters added
- [ ] search filter implemented
- [ ] level filter added
- [ ] date range filters added
- [ ] DesignationFilter class defined
- [ ] Designation filters configured
- [ ] DepartmentViewSet updated with filters
- [ ] DesignationViewSet updated with filters
- [ ] All filters tested and working

---

## Summary

This document established the API layer for the Organization module:

### Completed Components
- ✅ DepartmentSerializer with nested data and computed fields
- ✅ DesignationSerializer with hierarchy and salary formatting
- ✅ OrgChartSerializer for hierarchical visualization
- ✅ DepartmentViewSet with CRUD and tree operations
- ✅ DesignationViewSet with level-based queries
- ✅ OrgChartView for chart generation
- ✅ Comprehensive filtering for departments and designations

### Key Achievements
1. **Complete REST API** - Full CRUD for departments and designations
2. **Tree Operations** - Move, merge, archive operations
3. **Org Chart Generation** - Both department and employee-based
4. **Advanced Filtering** - Multi-field filtering and search
5. **Optimized Queries** - Prefetch and annotation strategies
6. **Hierarchy Support** - Path, tree, and reporting chain queries

### Next Steps
Proceed to [02_Tasks-76-78_URLs-Tests-Documentation.md](02_Tasks-76-78_URLs-Tests-Documentation.md) to implement URL configuration, comprehensive tests, and module documentation.

---

**Document Status:** ✅ Complete  
**Total Tasks:** 7  
**Estimated Time:** 3 hours 15 minutes
