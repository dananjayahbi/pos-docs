# Tasks 63-68: Designation Service and Search Functionality

> **Phase:** 06 - ERP Advanced Modules  
> **SubPhase:** 02 - Department & Designations  
> **Group:** E - Services & Business Logic  
> **Document:** 02 of 02  
> **Tasks Covered:** 63, 64, 65, 66, 67, 68

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [01_Tasks-57-62_Department-Service.md](01_Tasks-57-62_Department-Service.md)

---

## Document Overview

This document covers the implementation of the DesignationService class for designation management, salary range validation, and comprehensive search functionality for both departments and designations. These services provide the business logic layer for designation operations and powerful search capabilities across the organizational structure.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 63 | Create DesignationService Class | High | 30 min |
| 64 | Implement Create Designation | Medium | 25 min |
| 65 | Implement Update Designation | Medium | 25 min |
| 66 | Implement Designation Salary Range | Medium | 25 min |
| 67 | Create Department Search | Medium | 25 min |
| 68 | Create Designation Search | Medium | 25 min |

---

## Task 63: Create DesignationService Class

### Overview
Create the DesignationService class that serves as the centralized business logic layer for all designation operations. This service handles designation creation, updates, deactivation, salary validation, and querying, ensuring data integrity and business rule enforcement.

### Dependencies
- Designation model exists (Group B)
- EmployeeDesignation model exists (Group C)
- Django transaction support configured
- Cache framework configured

### Instructions

1. **Create service module file**
   - Create file at `apps/organization/services/designation_service.py`
   - Import necessary Django and model components

2. **Import required modules**
   - Import Django transaction module
   - Import Django cache framework
   - Import Designation, EmployeeDesignation models
   - Import Employee model
   - Import Django exceptions (ValidationError, ObjectDoesNotExist)
   - Import timezone utilities
   - Import Q objects for complex queries
   - Import decimal for salary calculations

3. **Define DesignationService class**
   - Create class-based service
   - Add comprehensive class docstring
   - Explain service purpose and responsibilities

4. **Add initialization method**
   - Accept optional tenant parameter
   - Store tenant reference for multi-tenant operations
   - Allow tenant-scoped operations

5. **Define core method signatures**
   - create(data, user) - Create new designation
   - update(designation_id, data, user) - Update existing designation
   - deactivate(designation_id, user) - Deactivate designation
   - activate(designation_id, user) - Reactivate designation
   - validate_salary(employee_id, salary) - Check salary range
   - search(query, filters) - Search designations
   - get_employees(designation_id) - Get employees with designation
   - get_by_level(level) - Get designations by level

6. **Add private helper methods**
   - _validate_designation_data(data) - Validate designation input
   - _generate_designation_code(title) - Generate unique code
   - _check_salary_overlap(designation) - Check for overlapping ranges
   - _invalidate_cache() - Clear designation cache
   - _can_deactivate(designation) - Check deactivation eligibility

7. **Add cache key constants**
   - Define cache key patterns for designations
   - Set cache timeout constants
   - Document cache invalidation strategy

8. **Add salary validation constants**
   - Define severity levels (WARNING, ERROR)
   - Define validation rules
   - Set tolerance percentages

9. **Update services/__init__.py**
   - Import DesignationService
   - Add to __all__ list for easy importing

### DesignationService Architecture

```
┌─────────────────────────────────────────────────────────┐
│             DesignationService Class                    │
├─────────────────────────────────────────────────────────┤
│ Public Methods:                                         │
│  • create(data, user)                                   │
│  • update(designation_id, data, user)                   │
│  • deactivate(designation_id, user)                     │
│  • activate(designation_id, user)                       │
│  • validate_salary(employee_id, salary)                 │
│  • search(query, filters)                               │
│  • get_employees(designation_id)                        │
│  • get_by_level(level)                                  │
│                                                         │
│ Private Methods:                                        │
│  • _validate_designation_data(data)                     │
│  • _generate_designation_code(title)                    │
│  • _check_salary_overlap(designation)                   │
│  • _invalidate_cache()                                  │
│  • _can_deactivate(designation)                         │
└─────────────────────────────────────────────────────────┘
```

### Service Layer Benefits

| Benefit | Description |
|---------|-------------|
| Encapsulation | Business logic separated from views/serializers |
| Reusability | Same logic used by API, admin, and background tasks |
| Validation | Consistent salary and data validation |
| Cache Management | Centralized cache invalidation |
| Business Rules | Enforce designation level rules |
| Testability | Easy to unit test business logic |

### Service Interaction Flow

```
┌──────────────┐
│   API View   │
│ or Admin     │
└──────┬───────┘
       │
       ▼
┌──────────────────────┐
│ DesignationService   │
│                      │
│ • Validates input    │
│ • Checks salary      │
│ • Performs operation │
│ • Updates related    │
│ • Invalidates cache  │
└──────┬───────────────┘
       │
       ▼
┌──────────────────────┐
│   Database           │
│ • Designation        │
│ • EmployeeDesignation│
└──────────────────────┘
```

### Designation Service Responsibilities

```
Business Logic Layer
════════════════════════════════════════

1. Data Validation
   ├─ Title, code, level validation
   ├─ Salary range validation
   └─ Department assignment validation

2. Salary Management
   ├─ Validate employee salary against range
   ├─ Check for overlapping ranges
   └─ Provide salary recommendations

3. Designation Lifecycle
   ├─ Create with validation
   ├─ Update with propagation
   ├─ Deactivate safely
   └─ Activate with checks

4. Query Operations
   ├─ Search by various criteria
   ├─ Filter by level, department
   ├─ Get employees by designation
   └─ Get designations by level

5. Cache Management
   ├─ Invalidate on changes
   ├─ Maintain performance
   └─ Ensure consistency
```

### Cache Key Structure

| Cache Key Pattern | Purpose | Example |
|------------------|---------|---------|
| `designations_{tenant_id}` | All designations | `designations_123` |
| `designation_employees_{desig_id}` | Employees with designation | `designation_employees_456` |
| `designation_level_{level}` | Designations by level | `designation_level_senior` |
| `designation_dept_{dept_id}` | Designations in department | `designation_dept_789` |

### Salary Validation Severity Levels

| Severity | Description | Action |
|----------|-------------|--------|
| PASS | Salary within range | Allow without warning |
| WARNING | Salary outside range but within tolerance | Allow with warning |
| ERROR | Salary significantly outside range | Block or require override |

### Expected Outcome
- Centralized DesignationService class
- Clean service interface
- Salary validation framework
- Cache management infrastructure
- Foundation for all designation operations

### Verification Checklist
- [ ] designation_service.py file created
- [ ] DesignationService class defined
- [ ] All public method signatures created
- [ ] Private helper methods defined
- [ ] Cache key constants defined
- [ ] Salary validation constants defined
- [ ] Class docstring comprehensive
- [ ] Service imported in __init__.py

---

## Task 64: Implement Create Designation

### Overview
Implement the create method in DesignationService that handles new designation creation with complete validation, code generation, salary range validation, and level assignment.

### Dependencies
- Task 63: Create DesignationService class
- Designation model with level support
- Department model for optional assignment

### Instructions

1. **Define create method signature**
   - Accept data dictionary with designation fields
   - Accept user parameter for audit trail
   - Return created Designation instance

2. **Implement input validation**
   - Validate required fields (title)
   - Validate level value from choices
   - Validate salary range (min <= max)
   - Validate department exists (if provided)
   - Check for duplicate titles within tenant
   - Validate description length

3. **Implement code generation**
   - Check if code provided in data
   - If not, generate from title (e.g., "Senior Engineer" → "DESIG-SEN-ENG")
   - Ensure code is unique within tenant
   - Handle code collisions with numeric suffix

4. **Validate salary range**
   - If min_salary and max_salary provided
   - Ensure min_salary < max_salary
   - Ensure both are positive values
   - Check for reasonable range (max <= 10x min)
   - Validate against tenant salary policies

5. **Check for overlapping ranges**
   - Query existing designations with same level
   - Check if salary ranges overlap
   - Issue warning if overlap detected
   - Allow creation but log warning

6. **Wrap in transaction**
   - Use @transaction.atomic decorator
   - Ensure all operations are atomic
   - Automatic rollback on any error

7. **Create designation record**
   - Extract validated data
   - Set tenant from user context
   - Set created_by to user
   - Set initial status to ACTIVE
   - Use Designation.objects.create()

8. **Handle department assignment**
   - If department_id provided, validate it exists
   - Set department relationship
   - Optional field, can be None

9. **Invalidate caches**
   - Call _invalidate_cache() helper
   - Clear designations list cache for tenant
   - Clear department's designations cache if assigned

10. **Return created designation**
    - Return fully created Designation instance
    - Include all related data loaded

### Create Designation Flow

```
┌────────────────────────────────────────────────────┐
│         Create Designation Process                 │
└────────────────────────────────────────────────────┘

1. Validate Input
   ├─ Title required?
   ├─ Level valid?
   ├─ Salary range valid?
   ├─ Department exists?
   └─ No duplicate title?

2. Generate Code
   ├─ Code provided?
   ├─ If not: "Senior Engineer" → "DESIG-SEN-ENG"
   └─ Ensure uniqueness

3. Validate Salary Range
   ├─ min < max?
   ├─ Both positive?
   ├─ Reasonable range?
   └─ Check overlaps (warning only)

4. Begin Transaction
   │
   ├─ Create Designation
   │  ├─ Set title
   │  ├─ Set code
   │  ├─ Set level
   │  ├─ Set min_salary, max_salary
   │  ├─ Set department (optional)
   │  ├─ Set tenant
   │  └─ Set status = ACTIVE
   │
   └─ Invalidate Cache
      ├─ Clear designations list
      └─ Clear department designations

5. Return Designation
```

### Validation Rules

| Rule | Check | Error Message |
|------|-------|---------------|
| Title Required | title in data and title.strip() | "Designation title is required" |
| Title Length | 3 <= len(title) <= 100 | "Title must be 3-100 characters" |
| Level Valid | level in LEVEL_CHOICES | "Invalid designation level" |
| Salary Min < Max | min_salary < max_salary | "Minimum salary must be less than maximum" |
| Salary Positive | min_salary > 0 and max_salary > 0 | "Salary must be positive" |
| Unique Code | Not exists for tenant | "Designation code already exists" |
| Duplicate Title | Not exists for tenant | "Designation title already exists" |

### Code Generation Algorithm

```
Input: "Senior Software Engineer"
Steps:
1. Extract keywords: "Senior", "Software", "Engineer"
2. Take first 3-4 letters: "SEN", "SOF", "ENG"
3. Combine with prefix: "DESIG-SEN-ENG"
4. Check uniqueness
   - If exists: "DESIG-SEN-ENG-2"
   - If exists: "DESIG-SEN-ENG-3"
   - Continue until unique
Output: "DESIG-SEN-ENG" or "DESIG-SEN-ENG-2"
```

### Salary Range Validation

```
Valid Range Examples:
══════════════════════════════════════

Example 1: Software Engineer
- min_salary: Rs. 80,000
- max_salary: Rs. 150,000
- range: 1.875x (reasonable)
✓ Valid

Example 2: Manager
- min_salary: Rs. 120,000
- max_salary: Rs. 250,000
- range: 2.08x (reasonable)
✓ Valid

Invalid Range Examples:
══════════════════════════════════════

Example 1: Invalid min > max
- min_salary: Rs. 150,000
- max_salary: Rs. 80,000
✗ Error: "Min must be less than max"

Example 2: Too wide range
- min_salary: Rs. 50,000
- max_salary: Rs. 1,000,000
- range: 20x (unreasonable)
✗ Warning: "Range too wide, verify values"
```

### Overlapping Range Detection

```
Existing Designations:
══════════════════════════════════════

Junior Engineer (JUNIOR)
- min: Rs. 60,000
- max: Rs. 90,000

Senior Engineer (SENIOR)
- min: Rs. 100,000
- max: Rs. 180,000

New Designation: Mid-Level Engineer (MID)
- min: Rs. 85,000
- max: Rs. 120,000

Overlap Analysis:
├─ Overlaps with Junior: Rs. 85,000 - Rs. 90,000 (5k overlap)
└─ Overlaps with Senior: Rs. 100,000 - Rs. 120,000 (20k overlap)

Result: WARNING (not blocking)
"Salary range overlaps with existing designations"
```

### Example Data Structures

#### Input Data
```python
data = {
    'title': 'Senior Software Engineer',
    'code': None,  # Will be generated
    'level': 'SENIOR',
    'min_salary': 120000.00,
    'max_salary': 200000.00,
    'department_id': 456,  # IT Department
    'description': 'Experienced software engineer role',
    'is_manager': False,
}
```

#### Created Designation
```python
designation = {
    'id': 789,
    'title': 'Senior Software Engineer',
    'code': 'DESIG-SEN-ENG',
    'level': 'SENIOR',
    'min_salary': 120000.00,
    'max_salary': 200000.00,
    'department_id': 456,
    'status': 'ACTIVE',
    'tenant_id': 100,
    'created_by_id': user.id,
    'created_at': '2026-01-24T10:30:00Z',
}
```

### Level-Based Validation

| Level | Expected Min Salary | Expected Max Salary | Validation |
|-------|-------------------|-------------------|------------|
| ENTRY | Rs. 40,000 - 60,000 | Rs. 60,000 - 90,000 | Warn if outside range |
| JUNIOR | Rs. 60,000 - 80,000 | Rs. 90,000 - 120,000 | Warn if outside range |
| MID | Rs. 80,000 - 120,000 | Rs. 120,000 - 180,000 | Warn if outside range |
| SENIOR | Rs. 120,000 - 180,000 | Rs. 180,000 - 300,000 | Warn if outside range |
| LEAD | Rs. 180,000 - 250,000 | Rs. 300,000 - 450,000 | Warn if outside range |
| MANAGER | Rs. 200,000 - 300,000 | Rs. 350,000 - 500,000 | Warn if outside range |
| DIRECTOR | Rs. 300,000 - 500,000 | Rs. 500,000 - 1,000,000 | Warn if outside range |
| EXECUTIVE | Rs. 500,000+ | Rs. 1,000,000+ | Warn if outside range |

### Expected Outcome
- Functional create method
- Complete validation
- Automatic code generation
- Salary range validation
- Overlap detection
- Cache invalidation
- Transaction safety

### Verification Checklist
- [ ] create method implemented
- [ ] Input validation complete
- [ ] Code generation logic implemented
- [ ] Salary range validation implemented
- [ ] Overlap detection implemented
- [ ] Transaction decorator applied
- [ ] Designation creation works
- [ ] Cache invalidation implemented
- [ ] Error handling comprehensive

---

## Task 65: Implement Update Designation

### Overview
Implement the update method in DesignationService that handles designation modifications including title changes, level changes, salary range updates, and department reassignment. Updates should propagate to related employee records where necessary.

### Dependencies
- Task 64: Implement Create Designation
- EmployeeDesignation model for tracking changes
- Salary validation rules

### Instructions

1. **Define update method signature**
   - Accept designation_id parameter
   - Accept data dictionary with fields to update
   - Accept user parameter for audit trail
   - Return updated Designation instance

2. **Fetch designation to update**
   - Query Designation by ID and tenant
   - Raise ObjectDoesNotExist if not found
   - Select related department for efficiency

3. **Implement validation**
   - Validate new level if changing
   - Validate new salary range if changing
   - Validate new department exists if changing
   - Check new title uniqueness if changing
   - Validate status transition if changing status

4. **Handle level change**
   - Detect if level is changing
   - Validate new level from choices
   - Check impact on existing employees
   - Issue warning if employees affected

5. **Handle salary range change**
   - Detect if min_salary or max_salary changing
   - Validate new range (min < max)
   - Check existing employee salaries
   - Issue warnings for employees outside new range
   - Do not block update, just warn

6. **Wrap in transaction**
   - Use @transaction.atomic decorator
   - Ensure all updates are atomic
   - Rollback on any validation failure

7. **Update designation fields**
   - Update title if provided
   - Update code if provided
   - Update level if provided
   - Update min_salary if provided
   - Update max_salary if provided
   - Update department if provided
   - Update description if provided
   - Set updated_by to user
   - Call designation.save()

8. **Propagate changes to employees**
   - If level changed, log change for employees
   - If salary range changed, validate all employees
   - Create notification for affected employees
   - Update any derived fields

9. **Invalidate caches**
   - Clear designations list cache
   - Clear old department's designations cache (if department changed)
   - Clear new department's designations cache (if department changed)
   - Clear employees cache for this designation

10. **Return updated designation**
    - Refresh from database to get latest state
    - Return updated Designation instance

### Update Designation Flow

```
┌────────────────────────────────────────────────────┐
│         Update Designation Process                 │
└────────────────────────────────────────────────────┘

1. Fetch Designation
   ├─ Query by ID + tenant
   ├─ Not found? Raise error
   └─ Select related data

2. Validate Changes
   ├─ Level changing?
   │  └─ New level valid?
   ├─ Salary range changing?
   │  └─ min < max? Both positive?
   ├─ Department changing?
   │  └─ New department exists?
   └─ Title changing?
      └─ No duplicate?

3. Check Employee Impact
   ├─ Level changing?
   │  └─ Get count of affected employees
   ├─ Salary range changing?
   │  └─ Check employees outside new range
   └─ Generate warnings

4. Begin Transaction
   │
   ├─ Update Designation Fields
   │  ├─ title
   │  ├─ level
   │  ├─ min_salary, max_salary
   │  ├─ department
   │  └─ description
   │
   ├─ Propagate Changes
   │  ├─ Log level changes
   │  ├─ Validate employee salaries
   │  └─ Create notifications
   │
   └─ Invalidate Cache
      ├─ Designations list
      ├─ Old department designations
      └─ New department designations

5. Return Updated Designation
```

### Level Change Impact Analysis

```
Scenario: Change level from SENIOR to LEAD
══════════════════════════════════════════

Designation: Software Engineer
- Current level: SENIOR
- New level: LEAD
- Employees with this designation: 15

Impact Check:
├─ Get all employees with this designation
├─ Check if any have level-specific benefits
├─ Check if any have level-based permissions
└─ Generate impact report

Warning Message:
"Changing designation level from SENIOR to LEAD will affect 15 employees.
This may impact their permissions and benefits. Continue?"
```

### Salary Range Change Impact

```
Scenario: Narrow salary range
══════════════════════════════════════════

Designation: Senior Engineer
- Current range: Rs. 100,000 - Rs. 200,000
- New range: Rs. 120,000 - Rs. 180,000

Employees:
1. John Doe - Rs. 95,000 (below new min)
2. Jane Smith - Rs. 150,000 (within range)
3. Bob Johnson - Rs. 190,000 (above new max)

Impact Analysis:
├─ 1 employee below new minimum (John)
├─ 1 employee above new maximum (Bob)
└─ 1 employee within range (Jane)

Warnings Generated:
"2 employees have salaries outside the new range:
- John Doe (Rs. 95,000) is below minimum (Rs. 120,000)
- Bob Johnson (Rs. 190,000) is above maximum (Rs. 180,000)
Consider adjusting salaries or revising range."
```

### Department Change Handling

```
Before: Senior Engineer assigned to IT Department
After: Senior Engineer assigned to Engineering Department

Impact:
├─ All employees with this designation
│  └─ May need department transfer
├─ Department statistics
│  └─ Update designation counts
└─ Organization chart
   └─ Invalidate cache

Note: Designation department assignment is informational
Employees maintain their own department memberships
```

### Validation Matrix

| Field Change | Validation Required | Check Description |
|-------------|--------------------|--------------------|
| title | Uniqueness | No duplicate in tenant |
| code | Uniqueness | No duplicate in tenant |
| level | Valid Choice | Level in LEVEL_CHOICES |
| min_salary | Range Check | min < max, positive |
| max_salary | Range Check | max > min, positive |
| department_id | Existence | Department exists |
| status | Transition Rules | Valid status transition |

### Employee Salary Validation After Update

```
After updating salary range, check all employees:

def _validate_employees_after_update(designation):
    employees = Employee.objects.filter(
        designations__designation=designation,
        designations__is_current=True
    )
    
    warnings = []
    for employee in employees:
        result = validate_salary(employee.id, employee.salary)
        if not result['is_valid']:
            warnings.append({
                'employee': employee,
                'salary': employee.salary,
                'issue': result['message']
            })
    
    return warnings

Example Output:
[
    {
        'employee': 'John Doe',
        'salary': 95000.00,
        'issue': 'Salary below minimum for Senior Engineer'
    },
    {
        'employee': 'Bob Johnson',
        'salary': 190000.00,
        'issue': 'Salary above maximum for Senior Engineer'
    }
]
```

### Update Scenarios

| Scenario | Fields Changed | Impact | Action |
|----------|---------------|--------|--------|
| Minor update | description | None | Update directly |
| Title change | title | Branding | Validate uniqueness |
| Level change | level | High - affects employees | Warn and update |
| Salary range narrow | min, max | High - employees may be out of range | Warn but allow |
| Salary range widen | min, max | Low | Update directly |
| Department change | department_id | Medium - informational | Update and invalidate cache |

### Cache Invalidation Strategy

| Cache Key | Invalidate When | Reason |
|-----------|----------------|--------|
| `designations_{tenant}` | Always | List may have changed |
| `designation_dept_{old_dept}` | Department changed | Department association changed |
| `designation_dept_{new_dept}` | Department changed | New department association |
| `designation_employees_{desig_id}` | Salary range changed | Need to revalidate |
| `designation_level_{level}` | Level changed | Level grouping changed |

### Expected Outcome
- Functional update method
- Complete validation
- Employee impact analysis
- Salary range validation
- Change propagation
- Cache invalidation

### Verification Checklist
- [ ] update method implemented
- [ ] Designation fetch with error handling
- [ ] Validation for all changes
- [ ] Level change impact check implemented
- [ ] Salary range impact check implemented
- [ ] Employee validation after update
- [ ] Transaction decorator applied
- [ ] Cache invalidation comprehensive

---

## Task 66: Implement Designation Salary Range Validation

### Overview
Implement the validate_salary method in DesignationService that checks if an employee's salary falls within their designation's defined salary range. This validation provides warnings for out-of-range salaries without blocking operations, supporting flexible salary management.

### Dependencies
- Task 65: Implement Update Designation
- Employee model with salary field
- EmployeeDesignation model with current designation tracking

### Instructions

1. **Define validate_salary method signature**
   - Accept employee_id parameter
   - Accept salary parameter (decimal/float)
   - Return validation result dictionary

2. **Fetch employee and designation**
   - Query Employee by ID
   - Get employee's current designation via EmployeeDesignation
   - If no designation, return validation pass with note
   - Raise ObjectDoesNotExist if employee not found

3. **Get designation salary range**
   - Extract min_salary and max_salary from designation
   - If range not defined, return validation pass with note
   - Handle null/None values for salary range

4. **Implement validation logic**
   - Check if salary is within range (min <= salary <= max)
   - Calculate deviation percentage if outside range
   - Determine severity based on deviation

5. **Calculate deviation percentage**
   - If below minimum: ((min - salary) / min) * 100
   - If above maximum: ((salary - max) / max) * 100
   - Use to determine severity level

6. **Determine severity level**
   - PASS: salary within range (min <= salary <= max)
   - WARNING: salary outside range but within tolerance (< 10% deviation)
   - ERROR: salary significantly outside range (>= 10% deviation)

7. **Build validation result**
   - Create dictionary with validation details:
     - is_valid: boolean
     - severity: PASS, WARNING, or ERROR
     - message: human-readable message
     - designation: designation title
     - min_salary: range minimum
     - max_salary: range maximum
     - actual_salary: employee's salary
     - deviation_percent: percentage outside range
     - recommendation: suggested action

8. **Generate appropriate message**
   - For PASS: "Salary within range for {designation}"
   - For WARNING: "Salary {below/above} range but within tolerance"
   - For ERROR: "Salary significantly {below/above} range for {designation}"

9. **Add salary recommendations**
   - If below minimum, suggest minimum salary
   - If above maximum, suggest maximum salary or justify exception
   - Provide context-appropriate guidance

10. **Handle edge cases**
    - Employee has no designation
    - Designation has no salary range
    - Salary is zero or negative
    - Multiple designations (use primary)

### Salary Validation Flow

```
┌────────────────────────────────────────────────────┐
│         Salary Validation Process                  │
└────────────────────────────────────────────────────┘

1. Fetch Employee & Designation
   ├─ Get employee by ID
   ├─ Get current designation
   ├─ No designation? Return PASS
   └─ No salary range? Return PASS

2. Extract Salary Range
   ├─ min_salary from designation
   ├─ max_salary from designation
   └─ actual_salary from employee

3. Check Range
   ├─ Within range?
   │  └─ Return PASS
   ├─ Below minimum?
   │  ├─ Calculate deviation
   │  └─ Determine severity
   └─ Above maximum?
      ├─ Calculate deviation
      └─ Determine severity

4. Build Result
   ├─ is_valid
   ├─ severity
   ├─ message
   ├─ designation
   ├─ min, max, actual
   ├─ deviation_percent
   └─ recommendation

5. Return Validation Result
```

### Validation Logic

```
Designation: Senior Software Engineer
- min_salary: Rs. 120,000
- max_salary: Rs. 200,000

Validation Cases:
══════════════════════════════════════

Case 1: Within Range
Employee salary: Rs. 150,000
Check: 120,000 <= 150,000 <= 200,000
Result: PASS
{
  "is_valid": true,
  "severity": "PASS",
  "message": "Salary within range for Senior Software Engineer"
}

Case 2: Slightly Below (< 10%)
Employee salary: Rs. 115,000
min_salary: Rs. 120,000
deviation: ((120,000 - 115,000) / 120,000) * 100 = 4.17%
Result: WARNING
{
  "is_valid": false,
  "severity": "WARNING",
  "message": "Salary slightly below minimum for Senior Software Engineer",
  "deviation_percent": 4.17,
  "recommendation": "Consider adjusting to minimum: Rs. 120,000"
}

Case 3: Significantly Below (>= 10%)
Employee salary: Rs. 100,000
min_salary: Rs. 120,000
deviation: ((120,000 - 100,000) / 120,000) * 100 = 16.67%
Result: ERROR
{
  "is_valid": false,
  "severity": "ERROR",
  "message": "Salary significantly below minimum for Senior Software Engineer",
  "deviation_percent": 16.67,
  "recommendation": "Salary must be increased to at least Rs. 120,000"
}

Case 4: Above Maximum (< 10%)
Employee salary: Rs. 210,000
max_salary: Rs. 200,000
deviation: ((210,000 - 200,000) / 200,000) * 100 = 5%
Result: WARNING
{
  "is_valid": false,
  "severity": "WARNING",
  "message": "Salary slightly above maximum for Senior Software Engineer",
  "deviation_percent": 5.0,
  "recommendation": "Verify exceptional performance or consider promotion"
}
```

### Severity Determination Matrix

| Deviation | Severity | Action | Message Template |
|-----------|----------|--------|-----------------|
| Within range | PASS | None | "Salary within range" |
| 0-10% below | WARNING | Notify | "Salary slightly below minimum" |
| > 10% below | ERROR | Review required | "Salary significantly below minimum" |
| 0-10% above | WARNING | Notify | "Salary slightly above maximum" |
| > 10% above | ERROR | Justify required | "Salary significantly above maximum" |

### Validation Result Structure

```python
ValidationResult = {
    'is_valid': bool,          # True if within range
    'severity': str,           # 'PASS', 'WARNING', or 'ERROR'
    'message': str,            # Human-readable message
    'designation': str,        # Designation title
    'min_salary': Decimal,     # Range minimum
    'max_salary': Decimal,     # Range maximum
    'actual_salary': Decimal,  # Employee's salary
    'deviation_percent': float,# Percentage outside range (if applicable)
    'recommendation': str,     # Suggested action
    'checked_at': datetime,    # Validation timestamp
}

Example:
{
    'is_valid': False,
    'severity': 'WARNING',
    'message': 'Salary below minimum for Senior Engineer',
    'designation': 'Senior Software Engineer',
    'min_salary': Decimal('120000.00'),
    'max_salary': Decimal('200000.00'),
    'actual_salary': Decimal('115000.00'),
    'deviation_percent': 4.17,
    'recommendation': 'Consider adjusting to minimum: Rs. 120,000',
    'checked_at': '2026-01-24T10:30:00Z',
}
```

### Edge Cases Handling

```
Edge Case 1: No Designation
══════════════════════════════════════
Employee: John Doe
Designation: None

Result:
{
    'is_valid': True,
    'severity': 'PASS',
    'message': 'No designation assigned, validation skipped',
    'designation': None,
    'recommendation': 'Assign designation for salary validation'
}

Edge Case 2: No Salary Range
══════════════════════════════════════
Designation: Intern
min_salary: None
max_salary: None

Result:
{
    'is_valid': True,
    'severity': 'PASS',
    'message': 'Designation has no salary range defined',
    'designation': 'Intern',
    'recommendation': 'Define salary range for this designation'
}

Edge Case 3: Multiple Designations
══════════════════════════════════════
Employee has:
- Primary: Senior Engineer
- Secondary: Team Lead

Validation uses Primary designation only

Edge Case 4: Negative Salary
══════════════════════════════════════
Employee salary: Rs. -5,000

Result:
{
    'is_valid': False,
    'severity': 'ERROR',
    'message': 'Invalid salary: negative value',
    'recommendation': 'Salary must be a positive value'
}
```

### Usage Scenarios

```
Scenario 1: New Employee Hiring
══════════════════════════════════════
Position: Senior Engineer
Offered salary: Rs. 115,000
Designation range: Rs. 120,000 - Rs. 200,000

validate_salary(new_employee.id, 115000)
→ WARNING: 4.17% below minimum
→ HR reviews and adjusts offer to Rs. 120,000

Scenario 2: Salary Review
══════════════════════════════════════
Employee: Jane Smith
Current: Rs. 180,000
Proposed: Rs. 210,000
Designation range: Rs. 120,000 - Rs. 200,000

validate_salary(jane.id, 210000)
→ WARNING: 5% above maximum
→ Manager justifies based on performance

Scenario 3: Bulk Validation
══════════════════════════════════════
HR runs validation on all employees:

for employee in Employee.objects.all():
    result = validate_salary(employee.id, employee.salary)
    if result['severity'] != 'PASS':
        report.add_issue(employee, result)

→ Generates report of out-of-range salaries
```

### Tolerance Configuration

| Configuration | Value | Purpose |
|--------------|-------|---------|
| WARNING_THRESHOLD | 10% | Deviation considered warning |
| ERROR_THRESHOLD | 10% | Deviation considered error |
| ALLOW_OVERRIDE | True | Allow manual override of validation |
| LOG_WARNINGS | True | Log all warnings to audit trail |

### Expected Outcome
- Functional salary validation
- Clear severity levels
- Deviation calculation
- Helpful recommendations
- Edge case handling
- Audit trail support

### Verification Checklist
- [ ] validate_salary method implemented
- [ ] Employee and designation fetch
- [ ] Range validation logic complete
- [ ] Deviation calculation accurate
- [ ] Severity determination correct
- [ ] Result structure comprehensive
- [ ] Edge cases handled
- [ ] Recommendations provided
- [ ] Human-readable messages generated

---

## Task 67: Create Department Search

### Overview
Implement comprehensive search functionality for departments in the DepartmentService class. This search should support text-based queries, multiple filters, and return relevant departments with ranking based on match quality.

### Dependencies
- Task 62: Implement Merge Departments (DepartmentService complete)
- Django Q objects for complex queries
- Database full-text search support (optional)

### Instructions

1. **Add search method to DepartmentService**
   - Accept query parameter (search string)
   - Accept filters dictionary (optional filters)
   - Return queryset of matching departments

2. **Implement text search**
   - Search in department name (partial match, case-insensitive)
   - Search in department code (exact or partial match)
   - Search in manager name (if manager assigned)
   - Search in location field
   - Use Q objects to combine search conditions with OR logic

3. **Implement filter support**
   - Filter by status (ACTIVE, INACTIVE, ARCHIVED)
   - Filter by parent_id (direct children only)
   - Filter by has_employees (departments with employees)
   - Filter by department_id (specific department)
   - Combine filters with AND logic

4. **Add sort options**
   - Sort by name (alphabetical)
   - Sort by code
   - Sort by created_at (newest first)
   - Sort by employee_count
   - Default to alphabetical by name

5. **Implement match ranking**
   - Exact name match - highest priority
   - Exact code match - high priority
   - Name starts with query - medium priority
   - Name contains query - lower priority
   - Order results by relevance

6. **Add pagination support**
   - Accept page and page_size parameters
   - Default page_size to 20
   - Return paginated results with total count

7. **Optimize query performance**
   - Use select_related() for parent and manager
   - Use prefetch_related() for children and employees
   - Add database indexes on searchable fields
   - Consider full-text search for large datasets

8. **Build search response**
   - Return queryset of departments
   - Include total count
   - Include applied filters
   - Include search query

9. **Handle empty results**
   - Return empty queryset gracefully
   - Provide suggestions for similar names
   - Log search queries for analytics

10. **Add search caching**
    - Cache frequent search queries
    - Cache for 5-10 minutes
    - Invalidate on department changes

### Department Search Flow

```
┌────────────────────────────────────────────────────┐
│          Department Search Process                 │
└────────────────────────────────────────────────────┘

1. Parse Input
   ├─ Extract query string
   ├─ Extract filters
   ├─ Extract sort options
   └─ Extract pagination params

2. Build Base Query
   ├─ Start with Department.objects.all()
   ├─ Filter by tenant
   └─ Select/prefetch related data

3. Apply Text Search
   ├─ Q(name__icontains=query)
   ├─ Q(code__icontains=query)
   ├─ Q(manager__name__icontains=query)
   ├─ Q(location__icontains=query)
   └─ Combine with OR

4. Apply Filters
   ├─ status filter (if provided)
   ├─ parent_id filter (if provided)
   ├─ has_employees filter (if provided)
   └─ Combine with AND

5. Rank Results
   ├─ Exact matches first
   ├─ Starts-with matches
   └─ Contains matches

6. Sort Results
   ├─ By relevance
   └─ Then by name

7. Paginate
   ├─ Apply limit/offset
   └─ Get total count

8. Return Results
```

### Search Examples

```
Example 1: Simple Text Search
══════════════════════════════════════
Query: "sales"
Filters: None

SQL:
SELECT * FROM department
WHERE tenant_id = 123
  AND (
    name ILIKE '%sales%' OR
    code ILIKE '%sales%' OR
    location ILIKE '%sales%'
  )
ORDER BY name

Results:
1. Sales Department (DEPT-SALES)
2. Sales North (DEPT-SALES-NORTH)
3. Sales South (DEPT-SALES-SOUTH)

Example 2: Search with Status Filter
══════════════════════════════════════
Query: "sales"
Filters: {"status": "ACTIVE"}

Results:
1. Sales Department (DEPT-SALES) - ACTIVE
2. Sales North (DEPT-SALES-NORTH) - ACTIVE
(Sales South excluded - INACTIVE)

Example 3: Search by Parent
══════════════════════════════════════
Query: ""
Filters: {"parent_id": 100}

Results: All direct children of department 100
1. Sales North
2. Sales South
3. Sales East

Example 4: Search with Employee Filter
══════════════════════════════════════
Query: "sales"
Filters: {"has_employees": True}

Results: Only sales departments with employees
1. Sales Department (15 employees)
2. Sales North (8 employees)
(Sales South excluded - 0 employees)
```

### Filter Options

| Filter Key | Type | Description | Example |
|-----------|------|-------------|---------|
| status | string | Department status | "ACTIVE", "INACTIVE", "ARCHIVED" |
| parent_id | integer | Parent department ID | 100 |
| has_employees | boolean | Has active employees | true |
| department_id | integer | Specific department | 456 |
| created_after | date | Created after date | "2026-01-01" |
| created_before | date | Created before date | "2026-12-31" |

### Search Response Structure

```python
SearchResult = {
    'query': str,              # Original query
    'filters': dict,           # Applied filters
    'results': QuerySet,       # Department queryset
    'total': int,              # Total matching count
    'page': int,               # Current page
    'page_size': int,          # Results per page
    'pages': int,              # Total pages
}

Example:
{
    'query': 'sales',
    'filters': {'status': 'ACTIVE'},
    'results': <QuerySet [
        <Department: Sales Department>,
        <Department: Sales North>,
    ]>,
    'total': 2,
    'page': 1,
    'page_size': 20,
    'pages': 1,
}
```

### Ranking Algorithm

```
Scoring System:
══════════════════════════════════════

Query: "sales"

1. Exact name match: "Sales" → Score: 100
2. Exact code match: "DEPT-SALES" → Score: 90
3. Name starts with: "Sales Department" → Score: 80
4. Name contains: "Regional Sales" → Score: 60
5. Code contains: "DEPT-SALES-NORTH" → Score: 50
6. Location contains: "Sales Building" → Score: 40

Order by score DESC, then name ASC
```

### Performance Optimization

```
Database Indexes:
══════════════════════════════════════

CREATE INDEX idx_department_name ON department(name);
CREATE INDEX idx_department_code ON department(code);
CREATE INDEX idx_department_status ON department(status);
CREATE INDEX idx_department_parent ON department(parent_id);

Query Optimization:
══════════════════════════════════════

# Use select_related for ForeignKey
departments = Department.objects.filter(
    name__icontains=query
).select_related('parent', 'manager')

# Use prefetch_related for Many-to-Many
departments = departments.prefetch_related(
    'children',
    'employees'
)

# Use only() to limit fields
departments = departments.only(
    'id', 'name', 'code', 'status'
)
```

### Expected Outcome
- Functional department search
- Text-based searching
- Multiple filter support
- Result ranking
- Pagination
- Performance optimization

### Verification Checklist
- [ ] search method added to DepartmentService
- [ ] Text search implemented (name, code, location)
- [ ] Filter support implemented
- [ ] Sort options implemented
- [ ] Match ranking algorithm
- [ ] Pagination support
- [ ] Query optimization (select_related, prefetch_related)
- [ ] Empty results handling
- [ ] Search caching implemented

---

## Task 68: Create Designation Search

### Overview
Implement comprehensive search functionality for designations in the DesignationService class. This search should support text-based queries, level filtering, department filtering, and return relevant designations with proper ranking.

### Dependencies
- Task 67: Create Department Search (for pattern reference)
- Designation model with all fields
- EmployeeDesignation for employee counts

### Instructions

1. **Add search method to DesignationService**
   - Accept query parameter (search string)
   - Accept filters dictionary (optional filters)
   - Return queryset of matching designations

2. **Implement text search**
   - Search in designation title (partial match, case-insensitive)
   - Search in designation code (exact or partial match)
   - Search in description field
   - Use Q objects to combine search conditions with OR logic

3. **Implement filter support**
   - Filter by level (ENTRY, JUNIOR, MID, SENIOR, etc.)
   - Filter by department_id (designations in specific department)
   - Filter by status (ACTIVE, INACTIVE)
   - Filter by is_manager (management positions)
   - Filter by salary_range (min/max salary criteria)
   - Combine filters with AND logic

4. **Add sort options**
   - Sort by title (alphabetical)
   - Sort by level (hierarchy order)
   - Sort by min_salary (ascending/descending)
   - Sort by employee_count (most used first)
   - Default to alphabetical by title

5. **Implement match ranking**
   - Exact title match - highest priority
   - Exact code match - high priority
   - Title starts with query - medium priority
   - Title contains query - lower priority
   - Description contains query - lowest priority
   - Order results by relevance

6. **Add level-based grouping**
   - Option to group results by level
   - Hierarchical display (EXECUTIVE > DIRECTOR > MANAGER > ...)
   - Count per level

7. **Optimize query performance**
   - Use select_related() for department
   - Use annotate() for employee count
   - Add database indexes on searchable fields
   - Consider full-text search for descriptions

8. **Build search response**
   - Return queryset of designations
   - Include total count
   - Include applied filters
   - Include level distribution

9. **Handle empty results**
   - Return empty queryset gracefully
   - Provide suggestions for similar titles
   - Log search queries for analytics

10. **Add search caching**
    - Cache frequent search queries
    - Cache for 5-10 minutes
    - Invalidate on designation changes

### Designation Search Flow

```
┌────────────────────────────────────────────────────┐
│         Designation Search Process                 │
└────────────────────────────────────────────────────┘

1. Parse Input
   ├─ Extract query string
   ├─ Extract filters
   ├─ Extract sort options
   └─ Extract pagination params

2. Build Base Query
   ├─ Start with Designation.objects.all()
   ├─ Filter by tenant
   └─ Select/annotate related data

3. Apply Text Search
   ├─ Q(title__icontains=query)
   ├─ Q(code__icontains=query)
   ├─ Q(description__icontains=query)
   └─ Combine with OR

4. Apply Filters
   ├─ level filter (if provided)
   ├─ department_id filter (if provided)
   ├─ status filter (if provided)
   ├─ is_manager filter (if provided)
   └─ Combine with AND

5. Rank Results
   ├─ Exact matches first
   ├─ Starts-with matches
   └─ Contains matches

6. Sort Results
   ├─ By relevance
   ├─ Then by level
   └─ Then by title

7. Paginate
   ├─ Apply limit/offset
   └─ Get total count

8. Return Results
```

### Search Examples

```
Example 1: Simple Text Search
══════════════════════════════════════
Query: "engineer"
Filters: None

Results:
1. Software Engineer (DESIG-SEN-ENG)
2. Senior Software Engineer (DESIG-SR-ENG)
3. QA Engineer (DESIG-QA-ENG)
4. DevOps Engineer (DESIG-DEVOPS-ENG)

Example 2: Search by Level
══════════════════════════════════════
Query: "engineer"
Filters: {"level": "SENIOR"}

Results:
1. Senior Software Engineer (SENIOR)
2. Senior QA Engineer (SENIOR)
(Junior and Mid-level excluded)

Example 3: Search by Department
══════════════════════════════════════
Query: ""
Filters: {"department_id": 100}

Results: All designations in IT Department
1. Software Engineer
2. Senior Software Engineer
3. QA Engineer
4. DevOps Engineer

Example 4: Management Positions
══════════════════════════════════════
Query: ""
Filters: {"is_manager": True}

Results:
1. Engineering Manager (MANAGER)
2. Department Head (DIRECTOR)
3. VP Engineering (EXECUTIVE)

Example 5: Salary Range Search
══════════════════════════════════════
Query: ""
Filters: {
    "min_salary_gte": 100000,
    "max_salary_lte": 200000
}

Results: Designations with salary range overlapping 100k-200k
1. Senior Software Engineer (120k - 200k)
2. Team Lead (100k - 180k)
```

### Filter Options

| Filter Key | Type | Description | Example |
|-----------|------|-------------|---------|
| level | string | Designation level | "SENIOR", "MANAGER" |
| department_id | integer | Department ID | 100 |
| status | string | Status | "ACTIVE", "INACTIVE" |
| is_manager | boolean | Management position | true |
| min_salary_gte | decimal | Min salary >= value | 100000 |
| max_salary_lte | decimal | Max salary <= value | 200000 |
| has_employees | boolean | Has assigned employees | true |

### Search Response Structure

```python
SearchResult = {
    'query': str,              # Original query
    'filters': dict,           # Applied filters
    'results': QuerySet,       # Designation queryset
    'total': int,              # Total matching count
    'page': int,               # Current page
    'page_size': int,          # Results per page
    'pages': int,              # Total pages
    'level_distribution': dict,# Count per level
}

Example:
{
    'query': 'engineer',
    'filters': {'level': 'SENIOR'},
    'results': <QuerySet [
        <Designation: Senior Software Engineer>,
        <Designation: Senior QA Engineer>,
    ]>,
    'total': 2,
    'page': 1,
    'page_size': 20,
    'pages': 1,
    'level_distribution': {
        'SENIOR': 2,
    }
}
```

### Ranking Algorithm

```
Scoring System:
══════════════════════════════════════

Query: "engineer"

1. Exact title match: "Engineer" → Score: 100
2. Exact code match: "DESIG-ENG" → Score: 90
3. Title starts with: "Engineer Lead" → Score: 80
4. Title contains: "Software Engineer" → Score: 60
5. Code contains: "DESIG-SR-ENG" → Score: 50
6. Description contains: "Engineering role" → Score: 40

Order by score DESC, then level DESC, then title ASC
```

### Level-Based Grouping

```
Grouped Results:
══════════════════════════════════════

Query: "engineer"
Group by level: True

EXECUTIVE Level (1):
  - Chief Technology Officer

DIRECTOR Level (1):
  - Engineering Director

MANAGER Level (2):
  - Engineering Manager
  - QA Manager

LEAD Level (2):
  - Senior Team Lead
  - Technical Lead

SENIOR Level (5):
  - Senior Software Engineer
  - Senior QA Engineer
  - Senior DevOps Engineer
  - Senior Data Engineer
  - Senior Mobile Engineer

MID Level (3):
  - Software Engineer
  - QA Engineer
  - DevOps Engineer

JUNIOR Level (2):
  - Junior Software Engineer
  - Junior QA Engineer

ENTRY Level (1):
  - Software Engineering Intern

Total: 17 designations across 8 levels
```

### Salary Range Filtering

```
Scenario: Find designations for 150k budget
══════════════════════════════════════

Filters: {
    "min_salary_lte": 150000,  # Can afford minimum
    "max_salary_gte": 150000,  # Range includes 150k
}

Logic:
min_salary <= 150000 AND max_salary >= 150000

Results:
1. Senior Engineer (120k - 200k) ✓
2. Team Lead (100k - 180k) ✓
3. Manager (150k - 300k) ✓

Excluded:
- Director (300k - 500k) - min > 150k
- Junior Engineer (60k - 100k) - max < 150k
```

### Performance Optimization

```
Database Indexes:
══════════════════════════════════════

CREATE INDEX idx_designation_title ON designation(title);
CREATE INDEX idx_designation_code ON designation(code);
CREATE INDEX idx_designation_level ON designation(level);
CREATE INDEX idx_designation_status ON designation(status);

Query Optimization:
══════════════════════════════════════

# Annotate employee count
designations = Designation.objects.annotate(
    employee_count=Count('employeedesignation')
).filter(title__icontains=query)

# Select related department
designations = designations.select_related('department')

# Order by multiple fields
designations = designations.order_by(
    '-level_order',  # Custom level ordering
    'title'
)
```

### Advanced Search Features

```
Feature 1: Fuzzy Matching
══════════════════════════════════════
Query: "enginer" (typo)
Suggest: "Did you mean 'engineer'?"

Feature 2: Related Searches
══════════════════════════════════════
Query: "engineer"
Related: "developer", "programmer", "architect"

Feature 3: Popular Searches
══════════════════════════════════════
Track: Most searched designations
Display: "Popular: Manager, Engineer, Lead"

Feature 4: Recent Searches
══════════════════════════════════════
Store: User's recent designation searches
Display: Quick access to recent queries
```

### Expected Outcome
- Functional designation search
- Text-based searching
- Multiple filter support
- Level-based filtering
- Salary range filtering
- Result ranking
- Level-based grouping
- Performance optimization

### Verification Checklist
- [ ] search method added to DesignationService
- [ ] Text search implemented (title, code, description)
- [ ] Level filter implemented
- [ ] Department filter implemented
- [ ] Status filter implemented
- [ ] is_manager filter implemented
- [ ] Salary range filters implemented
- [ ] Sort options implemented
- [ ] Match ranking algorithm
- [ ] Level-based grouping option
- [ ] Query optimization (select_related, annotate)
- [ ] Empty results handling
- [ ] Search caching implemented

---

## Summary

This document established the designation service layer and search functionality:

### Completed Infrastructure
- ✅ DesignationService class with core architecture
- ✅ Create designation with validation and code generation
- ✅ Update designation with change propagation
- ✅ Salary range validation with severity levels
- ✅ Department search with text and filters
- ✅ Designation search with level and salary filtering

### Key Achievements
1. **Service Layer** - Centralized business logic for designation operations
2. **Salary Validation** - Flexible salary range checking with warnings
3. **Search Functionality** - Powerful search for departments and designations
4. **Filter Support** - Multiple filters for precise results
5. **Result Ranking** - Relevance-based result ordering
6. **Performance** - Optimized queries with caching

### Next Steps
Proceed to [Group F: API, Testing & Documentation](../Group-F_API-Testing-Documentation/) to implement REST APIs, comprehensive testing, and complete documentation for the department and designation system.

---

**Document Status:** ✅ Complete  
**Total Tasks:** 6 (63-68)  
**Estimated Time:** 155 minutes
